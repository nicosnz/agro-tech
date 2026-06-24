from typing import List
import uuid
from datetime import date
from pydantic import BaseModel
from fastapi import Depends
from repositories.loteRepository import get_lote_repository, LoteRepository


class LoteResponse(BaseModel):
    id: uuid.UUID
    nombre: str
    tipo: str
    cantidad_animales: int
    fecha_creacion: date
    activo: bool


class GetLotesByPotrero:
    def __init__(self, lote_repo: LoteRepository):
        self.lote_repo = lote_repo

    async def get(self, id_potrero: uuid.UUID) -> List[LoteResponse]:
        lotes = await self.lote_repo.get_by_potrero(id_potrero)
        return [
            LoteResponse(
                id=l.id,
                nombre=l.nombre,
                tipo=l.tipo,
                cantidad_animales=l.cantidad_animales,
                fecha_creacion=l.fecha_creacion,
                activo=l.activo,
            )
            for l in lotes
        ]


def get_lotes_by_potrero(
    lote_repo: LoteRepository = Depends(get_lote_repository),
):
    return GetLotesByPotrero(lote_repo)
