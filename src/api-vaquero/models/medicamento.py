from sqlmodel import SQLModel,Field,Relationship
from decimal import Decimal
from sqlalchemy import Column,String,Text,Numeric
from datetime import datetime
from typing import Optional,TYPE_CHECKING,List
import uuid

if TYPE_CHECKING:
    from models.vacunacion import Vacunacion

class Medicamento(SQLModel,table=True):
    __tablename__='medicamento'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    nombre: str = Field(unique=True, max_length=100)
    dosis_recomendada:str = Field(max_length=100)
    descripcion:Optional[str] = Field(default=None,sa_type=Text)
    precio:Decimal = Field(sa_type=Numeric(10,2))
    disponible:bool = Field(default=True)
    vacunaciones:List['Vacunacion'] = Relationship(back_populates='medicamento')

    creado_en:datetime
    actualizado_en:datetime