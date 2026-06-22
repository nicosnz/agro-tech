from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from fastapi import Depends
from database.postgres import get_db
from typing import List
from models.lote import Lote
from uuid import UUID
class LoteRepository:
    def __init__(self,session:AsyncSession):
        self.session = session

    async def get_by_potrero(self,id_potrero:UUID) -> List[Lote]:
        query = (
            select(Lote).where(Lote.id_potrero == id_potrero).where(Lote.activo == True)
        )

        result = await self.session.exec(query)
        return result.all()

def get_lote_repository(db:AsyncSession = Depends(get_db)):
    return LoteRepository(db)