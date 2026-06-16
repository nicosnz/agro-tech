from typing import List, Optional
import uuid
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from models.bovino import RazaBovinos
from models.estadoAnimal import Estado
from repositories.bovinoRepository import get_bovino_repository, BovinoRepository


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
    lote: Optional[LoteResumen]
    peso_actual: Optional[PesajeResumen]
    estado_actual: Optional[EstadoResumen]
    fecha_nacimiento:date


class GetAllBovinos:
    def __init__(self, repository: BovinoRepository):
        self.repository = repository

    async def getAll(self) -> List[BovinoResponseGetAll]:
        rows = await self.repository.get_all()

        resultado = []
        for bovino, lote, peso, fecha_pesaje, estado in rows:
            lote_resumen = LoteResumen(nombre=lote.nombre) if lote else None
            peso_actual = PesajeResumen(peso=peso, fecha_pesaje=fecha_pesaje) if peso is not None else None
            estado_actual = EstadoResumen(estado=estado) if estado is not None else None

            bovino_response = BovinoResponseGetAll(
                id=bovino.id,
                raza=bovino.raza,
                lote=lote_resumen,
                peso_actual=peso_actual,
                estado_actual=estado_actual,
                fecha_nacimiento=bovino.fecha_nacimiento
            )
            resultado.append(bovino_response)

        return resultado


def get_all_bovinos(repository: BovinoRepository = Depends(get_bovino_repository)):
    return GetAllBovinos(repository)
