from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from uuid import UUID

T = TypeVar('T')

class BaseRepository(ABC, Generic[T]):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[T]:
        raise NotImplementedError

    @abstractmethod
    async def get_all(self) -> List[T]:
        raise NotImplementedError

    @abstractmethod
    async def create(self, entity: T) -> T:
        raise NotImplementedError

    