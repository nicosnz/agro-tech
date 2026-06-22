from typing import List, Optional
import uuid
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from models.bovino import RazaBovinos
from models.estadoAnimal import Estado
from repositories.bovinoRepository import get_bovino_repository, BovinoRepository
from repositories.pesajeRepository import get_pesaje_repository, PesajeRepository
from repositories.estadoAnimalRepository import get_estado_animal_repository, EstadoAnimalRepository





class PesajeResumen(BaseModel):
    peso: Decimal
    fecha_pesaje: date


class EstadoResumen(BaseModel):
    estado: Estado


class BovinoResponseByLote(BaseModel):
    id: uuid.UUID
    raza: RazaBovinos
    fecha_nacimiento: date
    peso_actual: Optional[PesajeResumen]
    peso_anterior: Optional[PesajeResumen]
    estado_actual: Optional[EstadoResumen]


class GetBovinosByLote:
    def __init__(
        self,
        bovino_repo: BovinoRepository,
        pesaje_repo: PesajeRepository,
        estado_repo: EstadoAnimalRepository,
    ):
        self.bovino_repo = bovino_repo
        self.pesaje_repo = pesaje_repo
        self.estado_repo = estado_repo

    async def get(self, id_lote: uuid.UUID) -> List[BovinoResponseByLote]:
        bovinos = await self.bovino_repo.get_by_lote(id_lote)

        ids = [bovino.id for bovino in bovinos]

        pesajes = await self.pesaje_repo.get_ultimos_dos_por_animales(ids)
        estados = await self.estado_repo.get_ultimo_por_animales(ids)

        resultado = []
        for bovino in bovinos:
            pesajes_animal = pesajes.get(bovino.id, [])
            peso_actual = PesajeResumen(peso=pesajes_animal[0]['peso'], fecha_pesaje=pesajes_animal[0]['fecha_pesaje']) if len(pesajes_animal) >= 1 else None
            peso_anterior = PesajeResumen(peso=pesajes_animal[1]['peso'], fecha_pesaje=pesajes_animal[1]['fecha_pesaje']) if len(pesajes_animal) >= 2 else None

            estado_row = estados.get(bovino.id)
            estado_actual = EstadoResumen(estado=estado_row['estado']) if estado_row else None

            resultado.append(BovinoResponseByLote(
                id=bovino.id,
                raza=bovino.raza,
                fecha_nacimiento=bovino.fecha_nacimiento,
                peso_actual=peso_actual,
                peso_anterior=peso_anterior,
                estado_actual=estado_actual,
            ))

        return resultado


def get_bovinos_by_lote(
    bovino_repo: BovinoRepository = Depends(get_bovino_repository),
    pesaje_repo: PesajeRepository = Depends(get_pesaje_repository),
    estado_repo: EstadoAnimalRepository = Depends(get_estado_animal_repository),
):
    return GetBovinosByLote(bovino_repo, pesaje_repo, estado_repo)
