import json
import logging
import uuid
from typing import List, Optional
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from redis.asyncio import Redis
from models.bovino import RazaBovinos
from models.estadoAnimal import Estado
from repositories.bovinoRepository import get_bovino_repository, BovinoRepository
from repositories.pesajeRepository import get_pesaje_repository, PesajeRepository
from repositories.estadoAnimalRepository import get_estado_animal_repository, EstadoAnimalRepository
from database.redis import get_redis

logger = logging.getLogger(__name__)

CACHE_TTL = 300
CACHE_KEY = "bovinos:pagina:{pagina}"


class LoteResumen(BaseModel):
    nombre: str


class PesajeResumen(BaseModel):
    peso: Decimal
    fecha_pesaje: date


class EstadoResumen(BaseModel):
    estado: Estado


class BovinoResponseGetAll(BaseModel):
    id: uuid.UUID
    raza: RazaBovinos
    fecha_nacimiento: date
    lote: Optional[LoteResumen]
    peso_actual: Optional[PesajeResumen]
    peso_anterior: Optional[PesajeResumen]
    estado_actual: Optional[EstadoResumen]

class BovinosIds(BaseModel):
    id:uuid.UUID
class GetAllBovinos:
    def __init__(
        self,
        bovino_repo: BovinoRepository,
        pesaje_repo: PesajeRepository,
        estado_repo: EstadoAnimalRepository,
        redis: Redis | None = None,
    ):
        self.bovino_repo = bovino_repo
        self.pesaje_repo = pesaje_repo
        self.estado_repo = estado_repo
        self.redis = redis

    async def getAll(self, pagina: int = 1) -> List[BovinoResponseGetAll]:
        cache_key = CACHE_KEY.format(pagina=pagina)

        cached = await self._get_cache(cache_key)
        if cached is not None:
            return [BovinoResponseGetAll.model_validate(item) for item in cached]

        bovinos = await self.bovino_repo.get_all(pagina)
        ids = [bovino.id for bovino, _ in bovinos]
        pesajes = await self.pesaje_repo.get_ultimos_dos_por_animales(ids)
        estados = await self.estado_repo.get_ultimo_por_animales(ids)

        resultado = []
        for bovino, lote in bovinos:
            lote_resumen = LoteResumen(nombre=lote.nombre) if lote else None

            pesajes_animal = pesajes.get(bovino.id, [])
            peso_actual = PesajeResumen(peso=pesajes_animal[0]['peso'], fecha_pesaje=pesajes_animal[0]['fecha_pesaje']) if len(pesajes_animal) >= 1 else None
            peso_anterior = PesajeResumen(peso=pesajes_animal[1]['peso'], fecha_pesaje=pesajes_animal[1]['fecha_pesaje']) if len(pesajes_animal) >= 2 else None

            estado_row = estados.get(bovino.id)
            estado_actual = EstadoResumen(estado=estado_row['estado']) if estado_row else None

            resultado.append(BovinoResponseGetAll(
                id=bovino.id,
                raza=bovino.raza,
                fecha_nacimiento=bovino.fecha_nacimiento,
                lote=lote_resumen,
                peso_actual=peso_actual,
                peso_anterior=peso_anterior,
                estado_actual=estado_actual,
            ))

        await self._set_cache(cache_key, resultado)
        return resultado

    async def _get_cache(self, key: str):
        if not self.redis:
            return None
        try:
            data = await self.redis.get(key)
            return json.loads(data) if data else None
        except Exception:
            logger.warning("Redis get falló para key %s", key)
            return None

    async def _set_cache(self, key: str, data: List[BovinoResponseGetAll]):
        if not self.redis:
            return
        try:
            serialized = json.dumps([item.model_dump(mode='json') for item in data])
            await self.redis.set(key, serialized, ex=CACHE_TTL)
        except Exception:
            logger.warning("Redis set falló para key %s", key)
    async def get_machos(self) -> List[BovinosIds]:
        bovinos = await self.bovino_repo.get_machos()
        resultado = []
        for bovino in bovinos:
            resultado.append(
                BovinosIds(
                    id=bovino.id
                )
            )
        return resultado
    async def get_hembras(self) -> List[BovinosIds]:
        bovinos = await self.bovino_repo.get_hembras()
        resultado = []
        for bovino in bovinos:
            resultado.append(
                BovinosIds(
                    id=bovino.id
                )
            )
        return resultado       


def get_all_bovinos(
    bovino_repo: BovinoRepository = Depends(get_bovino_repository),
    pesaje_repo: PesajeRepository = Depends(get_pesaje_repository),
    estado_repo: EstadoAnimalRepository = Depends(get_estado_animal_repository),
    redis: Redis | None = Depends(get_redis),
):
    return GetAllBovinos(bovino_repo, pesaje_repo, estado_repo, redis)
