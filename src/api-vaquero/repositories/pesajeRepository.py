from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from sqlalchemy import desc, func
from typing import List
from uuid import UUID
from models.pesaje import Pesaje


class PesajeRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_ultimos_dos_por_animales(self, ids: List[UUID]) -> dict:
        pesajes_numerados = (
            select(
                Pesaje,
                func.row_number().over(
                    partition_by=Pesaje.id_animal,
                    order_by=desc(Pesaje.fecha_pesaje)
                ).label('rn')
            )
            .where(Pesaje.id_animal.in_(ids))
            .subquery()
        )

        resultado = await self.session.execute(
            select(pesajes_numerados).where(pesajes_numerados.c.rn <= 2)
        )

        pesajes_por_animal: dict = {}
        for row in resultado.mappings().all():
            id_animal = row['id_animal']
            if id_animal not in pesajes_por_animal:
                pesajes_por_animal[id_animal] = []
            pesajes_por_animal[id_animal].append(row)

        return pesajes_por_animal


def get_pesaje_repository(db: AsyncSession = Depends(get_db)):
    return PesajeRepository(db)
