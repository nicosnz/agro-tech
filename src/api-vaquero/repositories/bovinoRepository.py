from sqlmodel.ext.asyncio.session import AsyncSession
from database.postgres import get_db
from fastapi import Depends
from sqlmodel import select
from typing import Optional, List
from uuid import UUID
from models.bovino import Bovino
from models.lote import Lote


class BovinoRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: UUID) -> Optional[Bovino]:
        return await self.session.get(Bovino, id)

    async def get_all(self, pagina: int = 1) -> List:
        query = (
            select(Bovino, Lote)
            .join(Lote, Bovino.id_lote == Lote.id, isouter=True)
            .offset((pagina - 1) * 8)
            .limit(8)
        )
        result = await self.session.exec(query)
        return result.all()

    async def get_all_sin_paginacion(self) -> List:
        query = select(Bovino, Lote).join(Lote, Bovino.id_lote == Lote.id, isouter=True)
        result = await self.session.exec(query)
        return result.all()

    async def get_machos(self) -> List[Bovino]:
        query = (select(Bovino).where(Bovino.sexo == "Macho"))
        result = await self.session.exec(query)
        return result.all()
    async def get_hembras(self) -> List[Bovino]:
        query = (select(Bovino).where(Bovino.sexo == "Hembra"))
        result = await self.session.exec(query)
        return result.all()
    async def get_by_lote(self,id_lote:UUID) -> List[Bovino]:
        query = (select(Bovino).where(Bovino.id_lote == id_lote))
        result = await self.session.exec(query)
        return result.all()
    
    async def create(self, bovino: Bovino) -> Bovino:
        self.session.add(bovino)
        await self.session.commit()
        await self.session.refresh(bovino)
        return bovino

    


def get_bovino_repository(db: AsyncSession = Depends(get_db)):
    return BovinoRepository(db)
