from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from sqlalchemy import desc, func
from typing import List
from uuid import UUID
from models.estadoAnimal import EstadoAnimal


class EstadoAnimalRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_ultimo_por_animales(self, ids: List[UUID]) -> dict:
        estados_numerados = (
            select(
                EstadoAnimal,
                func.row_number().over(
                    partition_by=EstadoAnimal.id_animal,
                    order_by=desc(EstadoAnimal.fecha_registro)
                ).label('rn')
            )
            .where(EstadoAnimal.id_animal.in_(ids))
            .subquery()
        )

        resultado = await self.session.execute(
            select(estados_numerados).where(estados_numerados.c.rn == 1)
        )

        return {row['id_animal']: row for row in resultado.mappings().all()}


def get_estado_animal_repository(db: AsyncSession = Depends(get_db)):
    return EstadoAnimalRepository(db)
