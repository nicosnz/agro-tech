from typing import List
import uuid
from pydantic import BaseModel
from fastapi import Depends
from repositories.potreroRepository import get_potrero_repository, PotreroRepository


class PotreroReponse(BaseModel):
    id: uuid.UUID
    nombre: str
    ubicacion: str
    capacidad: int
    estado: str


class GetAllPotreros:
    def __init__(self, potrero_repo: PotreroRepository):
        self.potrero_repo = potrero_repo

    async def get(self) -> List[PotreroReponse]:
        potreros = await self.potrero_repo.GetPotreros()
        return [
            PotreroReponse(
                id=p.id,
                nombre=p.nombre,
                ubicacion=p.ubicacion,
                capacidad=p.capacidad,
                estado=p.estado,
            )
            for p in potreros
        ]


def get_all_potreros(
    potrero_repo: PotreroRepository = Depends(get_potrero_repository),
):
    return GetAllPotreros(potrero_repo)
