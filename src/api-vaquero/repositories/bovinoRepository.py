from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from sqlalchemy import desc
from typing import Optional, List
from uuid import UUID
from models.bovino import Bovino
from models.lote import Lote
from models.pesaje import Pesaje
from models.estadoAnimal import EstadoAnimal
from repositories.baseRepository import BaseRepository


class BovinoRepository(BaseRepository[Bovino]):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: UUID) -> Optional[Bovino]:
        return await self.session.get(Bovino, id)

    async def get_all(self, pagina: int = 1) -> List:
        ultimo_pesaje = (
            select(Pesaje)
            .distinct(Pesaje.id_animal)
            .order_by(Pesaje.id_animal, desc(Pesaje.fecha_pesaje))
            .subquery()
        )

        ultimo_estado = (
            select(EstadoAnimal)
            .distinct(EstadoAnimal.id_animal)
            .order_by(EstadoAnimal.id_animal, desc(EstadoAnimal.fecha_registro))
            .subquery()
        )

        query = (
            select(
                Bovino,
                Lote,
                ultimo_pesaje.c.peso,
                ultimo_pesaje.c.fecha_pesaje,
                ultimo_estado.c.estado,
            )
            .join(Lote, Bovino.id_lote == Lote.id, isouter=True)
            .join(ultimo_pesaje, ultimo_pesaje.c.id_animal == Bovino.id, isouter=True)
            .join(ultimo_estado, ultimo_estado.c.id_animal == Bovino.id, isouter=True)
            .offset((pagina - 1) * 8)
            .limit(8)
        )

        result = await self.session.exec(query)
        return result.all()

    async def get_by_lote(self, id_lote: UUID) -> List[Bovino]:
        result = await self.session.exec(
            select(Bovino).where(Bovino.id_lote == id_lote)
        )
        return result.all()

    async def create(self, bovino: Bovino) -> Bovino:
        self.session.add(bovino)
        await self.session.commit()
        await self.session.refresh(bovino)
        return bovino

    async def update(self, bovino: Bovino) -> Bovino:
        self.session.add(bovino)
        await self.session.commit()
        await self.session.refresh(bovino)
        return bovino

    async def delete(self, id: UUID) -> None:
        bovino = await self.get_by_id(id)
        if bovino:
            await self.session.delete(bovino)
            await self.session.commit()


def get_bovino_repository(db: AsyncSession = Depends(get_db)):
    return BovinoRepository(db)
