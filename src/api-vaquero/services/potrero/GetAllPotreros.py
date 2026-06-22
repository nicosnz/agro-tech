from typing import List, Optional
import uuid
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from repositories.potreroRepository import get_potrero_repository,PotreroRepository
from pydantic import BaseModel


class PotreroReponse(BaseModel):
    id: uuid.UUID
    nombre: str
    ubicacion: str
    capacidad: int
    estado: str

class GetAllPotreros:
    def __init__(
        self,
        potrero_repo: PotreroRepository,
        
    ):
        self.potrero_repo = potrero_repo
        

    async def get(self) -> List[PotreroReponse]:
        potreros = await self.potrero_repo.GetPotreros()

        resultado = []
        for potrero in potreros:
            potrero_response = PotreroReponse(
                id=potrero.id,
                nombre=potrero.nombre,
                ubicacion=potrero.ubicacion,
                capacidad=potrero.capacidad,
                estado=potrero.estado
            )
            resultado.append(potrero_response)
        return resultado


def get_all_potreros(
    potrero_repo: PotreroRepository = Depends(get_potrero_repository),
   
):
    return GetAllPotreros(potrero_repo)
