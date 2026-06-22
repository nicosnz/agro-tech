from typing import List, Optional
import uuid
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from repositories.loteRepository import get_lote_repository,LoteRepository
from models.lote import Lote
from pydantic import BaseModel


class LoteResponse(BaseModel):
    id: uuid.UUID
    nombre: str
    tipo: str
    cantidad_animales: int
    fecha_creacion: date
    activo: bool

class GetLotesByPotrero:
    def __init__(
        self,
        lote_repo: LoteRepository,
        
    ):
        self.lote_repo = lote_repo
        

    async def get(self, id_potrero:uuid.UUID) -> List[LoteResponse]:
        lotes = await self.lote_repo.get_by_potrero(id_potrero)

        resultado = []
        for lote in lotes:
            lote_response = LoteResponse(
                id=lote.id,
                nombre=lote.nombre,
                tipo=lote.tipo,
                cantidad_animales=lote.cantidad_animales,
                fecha_creacion=lote.fecha_creacion,
                activo=lote.activo
            )
            resultado.append(lote_response)
        return resultado


def get_lotes_by_potrero(
    lote_repo: LoteRepository = Depends(get_lote_repository),
   
):
    return GetLotesByPotrero(lote_repo)
