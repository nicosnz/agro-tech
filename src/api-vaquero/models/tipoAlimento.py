from sqlmodel import SQLModel,Field,Relationship
from decimal import Decimal
from sqlalchemy import Column,String,Text,Numeric
from datetime import datetime
from typing import Optional,TYPE_CHECKING,List
import uuid

if TYPE_CHECKING:
    from models.alimentacion import Alimentacion

class TipoAlimento(SQLModel,table=True):
    __tablename__='tipoalimento'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    nombre: str = Field(unique=True, max_length=100)
    descripcion:Optional[str] = Field(default=None,sa_type=Text)
    precio:Decimal = Field(sa_type=Numeric(10,2))  
    cantidad_restante:Decimal = Field(sa_type=Numeric(10,2))
    disponible:bool = Field(default=True)
    alimentaciones:List['Alimentacion'] = Relationship(back_populates='tipo_alimento')
    creado_en:datetime
    actualizado_en:datetime