import uuid
from datetime import date, datetime
from typing import Optional
from fastapi import Depends
from pydantic import BaseModel
from redis.asyncio import Redis
from database.redis import get_redis, invalidar_cache_bovinos


from models.bovino import Bovino, SexoBovinos, RazaBovinos, OrigenBovino
from repositories.bovinoRepository import get_bovino_repository, BovinoRepository
from repositories.loteRepository import get_lote_repository, LoteRepository
from repositories.elasticBovinoRepository import get_elastic_bovino_repository, ElasticBovinoRepository


class BovinoRequest(BaseModel):
    sexo: SexoBovinos
    raza: RazaBovinos
    fecha_nacimiento: date
    origen: OrigenBovino
    id_lote: uuid.UUID
    id_madre: Optional[uuid.UUID] = None
    id_padre: Optional[uuid.UUID] = None


class BovinoCreatedResponse(BaseModel):
    id: uuid.UUID
    sexo: Optional[SexoBovinos]
    raza: Optional[RazaBovinos]
    fecha_nacimiento: date
    origen: Optional[OrigenBovino]
    id_lote: Optional[uuid.UUID]
    id_madre: Optional[uuid.UUID]
    id_padre: Optional[uuid.UUID]
    creado_en: datetime
    actualizado_en: datetime


class AddBovino:
    def __init__(
        self,
        bovino_repo: BovinoRepository,
        lote_repo: LoteRepository,
        elastic_repo: ElasticBovinoRepository,
        redis: Redis | None = None,
    ):
        self.bovino_repo = bovino_repo
        self.lote_repo = lote_repo
        self.elastic_repo = elastic_repo
        self.redis = redis

    async def create(self, bovino_request: BovinoRequest) -> BovinoCreatedResponse:
        bovino = Bovino(
            sexo=bovino_request.sexo,
            raza=bovino_request.raza,
            fecha_nacimiento=bovino_request.fecha_nacimiento,
            origen=bovino_request.origen,
            id_lote=bovino_request.id_lote,
            id_madre=bovino_request.id_madre,
            id_padre=bovino_request.id_padre,
            creado_en=datetime.now(),
            actualizado_en=datetime.now(),
        )
        bovino = await self.bovino_repo.create(bovino)

        lote = await self.lote_repo.get_by_id(bovino_request.id_lote)
        await self.elastic_repo.index_bovino(bovino, lote.nombre if lote else None)

        await invalidar_cache_bovinos(self.redis)

        return BovinoCreatedResponse(
            id=bovino.id,
            sexo=bovino.sexo,
            raza=bovino.raza,
            fecha_nacimiento=bovino.fecha_nacimiento,
            origen=bovino.origen,
            id_lote=bovino.id_lote,
            id_madre=bovino.id_madre,
            id_padre=bovino.id_padre,
            creado_en=bovino.creado_en,
            actualizado_en=bovino.actualizado_en,
        )


def get_add_bovino(
    bovino_repo: BovinoRepository = Depends(get_bovino_repository),
    lote_repo: LoteRepository = Depends(get_lote_repository),
    elastic_repo: ElasticBovinoRepository = Depends(get_elastic_bovino_repository),
    redis: Redis | None = Depends(get_redis),
):
    return AddBovino(bovino_repo, lote_repo, elastic_repo, redis)
