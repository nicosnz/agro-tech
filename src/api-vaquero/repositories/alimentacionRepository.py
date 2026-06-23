from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from typing import List
from uuid import UUID
from models.alimentacion import Alimentacion

class AlimentacionRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self,alimentacion:Alimentacion):
        self.session.add(alimentacion)
        await self.session.commit()
        await self.session.refresh(alimentacion)
        return alimentacion

def get_alimentacion_repository(db: AsyncSession = Depends(get_db)):
    return AlimentacionRepository(db)
