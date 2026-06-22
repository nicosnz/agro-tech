from sqlmodel import SQLModel,Field,Relationship,Numeric
from datetime import datetime,date
from decimal import Decimal
from typing import Optional,TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.bovino import Bovino



class Pesaje(SQLModel,table=True):
    __tablename__='pesaje'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    fecha_pesaje:date
    peso:Decimal = Field(sa_type=Numeric(6,2))
    id_animal: Optional[uuid.UUID] = Field(default=None, foreign_key='content.bovino.id')
    bovino:Optional['Bovino'] = Relationship(back_populates='pesajes')
    creado_en:datetime
    actualizado_en:datetime