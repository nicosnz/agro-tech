from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from typing import Optional, List
from models.potrero import Potrero
class PotreroRepository:
    def __init__(self,session:AsyncSession):
        self.session = session

    async def GetPotreros(self) -> List[Potrero]:
        query = (select(Potrero))
        result = await self.session.exec(query)
        return result.all()
    
def get_potrero_repository(db: AsyncSession = Depends(get_db)):
    return PotreroRepository(db)
