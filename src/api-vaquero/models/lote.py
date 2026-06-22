from sqlmodel import SQLModel,Field,Relationship
from sqlalchemy import Enum as SAEnum
from enum import Enum
from datetime import datetime,date
from typing import Optional,TYPE_CHECKING,List
import uuid

if TYPE_CHECKING:
    from models.potrero import Potrero
    from models.bovino import Bovino
    from models.alimentacion import Alimentacion

class TipoLote(str,Enum):
    nacimiento='Nacimiento'
    recria='Recria'
    engorde='Engorde'

class Lote(SQLModel,table=True):
    __tablename__='lote'
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    nombre: str = Field(max_length=100)
    tipo: TipoLote = Field(sa_type=SAEnum(TipoLote, values_callable=lambda x: [e.value for e in x]))
    cantidad_animales:int  
    fecha_creacion:date
    activo:bool
    id_potrero:Optional[uuid.UUID]= Field(default=None,foreign_key='content.potrero.id')
    potrero:Optional['Potrero'] = Relationship(back_populates='lotes')
    bovinos:List['Bovino'] = Relationship(back_populates='lote')
    alimentaciones:List['Alimentacion'] = Relationship(back_populates='lote')
    creado_en:datetime
    actualizado_en:datetime