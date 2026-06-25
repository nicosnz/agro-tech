from typing import List
from fastapi import Depends
from services.lote.GetLotesByPotrero import LoteResponse
from repositories.loteRepository import get_lote_repository, LoteRepository


class GetAllLotes:
    def __init__(self, lote_repo: LoteRepository):
        self.lote_repo = lote_repo

    async def get(self) -> List[LoteResponse]:
        lotes = await self.lote_repo.get_all()
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


def get_all_lotes(
    lote_repo: LoteRepository = Depends(get_lote_repository),
):
    return GetAllLotes(lote_repo)
