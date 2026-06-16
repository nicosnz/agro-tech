from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from typing import Optional, List
from uuid import UUID
from models.bovino import Bovino
from repositories.baseRepository import BaseRepository

class BovinoRepository(BaseRepository[Bovino]):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: UUID) -> Optional[Bovino]:
        return await self.session.get(Bovino, id)

    async def get_all(self) -> List[Bovino]:
        result = await self.session.exec(select(Bovino))
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

def get_bovino_repository(db:AsyncSession = Depends(get_db())):
    return BovinoRepository(db)