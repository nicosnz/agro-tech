from sqlmodel import SQLModel,Field,Relationship
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column,String,Text,Numeric
from datetime import datetime,date
from typing import Optional,TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.tipoAlimento import TipoAlimento
    from models.lote import Lote


class Alimentacion(SQLModel,table=True):
    __tablename__='alimentacion'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    fecha_alimentacion:date
    id_tipo_alimento:uuid.UUID = Field(foreign_key='content.tipoalimento.id')
    tipo_alimento:Optional['TipoAlimento'] = Relationship(back_populates='alimentaciones')
    cantidad:Decimal = Field(sa_type=Numeric(10,2))  
    observacion:Optional[str] = Field(default=None,sa_type=Text)
    id_lote:uuid.UUID = Field(foreign_key='content.lote.id')
    lote:Optional['Lote'] = Relationship(back_populates='alimentaciones')
    creado_en:datetime
    actualizado_en:datetime