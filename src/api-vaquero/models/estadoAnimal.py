from sqlmodel import SQLModel,Field,Relationship
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column,String,Text,Numeric
from datetime import datetime,date
from typing import Optional,TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.bovino import Bovino
class Estado(str,Enum):
    en_observacion='En observacion'
    en_tratamiento='En tratamiento'
    fallecido='Fallecido'
    sano='Sano'
    vendio='Vendido'

class EstadoAnimal(SQLModel,table=True):
    __tablename__='estadoanimal'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    estado:Estado
    descripcion:Optional[str] = Field(default=None,sa_type=Text)
    fecha_registro:date
    id_animal:uuid.UUID = Field(foreign_key='content.bovino.id')
    bovino:Optional['Bovino'] = Relationship(back_populates='estados')
    creado_en:datetime
    actualizado_en:datetime