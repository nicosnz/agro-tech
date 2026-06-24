import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, field_validator
from fastapi import Depends
from repositories.pesajeRepository import get_pesaje_repository, PesajeRepository, Pesaje
from repositories.elasticBovinoRepository import ElasticBovinoRepository, get_elastic_bovino_repository


class PesajeRequest(BaseModel):
    id: uuid.UUID
    peso: Decimal

    @field_validator('peso')
    @classmethod
    def validar_peso(cls, v):
        if v <= 0:
            raise ValueError('El peso debe ser mayor a 0 kg')
        if v > 10000:
            raise ValueError('El peso no puede superar los 10000 kg')
        return v


class AddPesaje:
    def __init__(self, pesaje_repo: PesajeRepository, elastic_repo: ElasticBovinoRepository):
        self.pesaje_repo  = pesaje_repo
        self.elastic_repo = elastic_repo

    async def create(self, pesaje_request: PesajeRequest) -> Pesaje:
        pesaje = Pesaje(
            id_animal=pesaje_request.id,
            peso=pesaje_request.peso,
            fecha_pesaje=date.today(),
            creado_en=datetime.now(),
            actualizado_en=datetime.now()
        )
        pesaje = await self.pesaje_repo.create(pesaje)

        pesajes = await self.pesaje_repo.get_ultimos_dos_por_animales([pesaje_request.id])
        ultimos = pesajes.get(pesaje_request.id, [])
        peso_actual  = ultimos[0] if len(ultimos) >= 1 else None
        peso_anterior = ultimos[1] if len(ultimos) >= 2 else None
        await self.elastic_repo.update_pesos_bovino(str(pesaje_request.id), peso_actual, peso_anterior)

        return pesaje


def get_add_pesaje(
    pesaje_repo:  PesajeRepository         = Depends(get_pesaje_repository),
    elastic_repo: ElasticBovinoRepository  = Depends(get_elastic_bovino_repository),
):
    return AddPesaje(pesaje_repo, elastic_repo)
