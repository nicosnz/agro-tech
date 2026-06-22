from sqlmodel import SQLModel,Field,Relationship
from sqlalchemy import Enum as SAEnum
from enum import Enum
from datetime import datetime
from typing import List,TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.lote import Lote

class EstadoPotrero(str,Enum):
    disponible='Disponible'
    ocupado='Ocupado'
    en_descanso='En Descanso'
    inactivo='Inactivo'

class Potrero(SQLModel,table=True):
    __tablename__='potrero'
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    nombre: str = Field(max_length=100)
    capacidad:int
    ubicacion: str = Field(max_length=100)
    estado: EstadoPotrero = Field(sa_type=SAEnum(EstadoPotrero, values_callable=lambda x: [e.value for e in x]))
    lotes:List['Lote'] = Relationship(back_populates='potrero')
    creado_en:datetime
    actualizado_en:datetime