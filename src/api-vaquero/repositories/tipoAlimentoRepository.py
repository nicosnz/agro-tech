from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from typing import List, Optional
from uuid import UUID
from models.tipoAlimento import TipoAlimento

class TipoAlimentoRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> List[TipoAlimento]:
        query = (select(TipoAlimento))
        resultado = await self.session.exec(query)
        return resultado.all()

    async def get_by_id(self, id: UUID) -> Optional[TipoAlimento]:
        return await self.session.get(TipoAlimento, id)

    async def update(self, tipo_alimento: TipoAlimento) -> TipoAlimento:
        self.session.add(tipo_alimento)
        await self.session.commit()
        await self.session.refresh(tipo_alimento)
        return tipo_alimento


def get_tipo_alimento_repository(db: AsyncSession = Depends(get_db)):
    return TipoAlimentoRepository(db)
