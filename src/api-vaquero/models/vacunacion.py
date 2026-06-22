from sqlmodel import SQLModel,Field,Relationship,Numeric,Text
from datetime import datetime,date
from decimal import Decimal
from typing import Optional,TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.bovino import Bovino
    from models.medicamento import Medicamento



class Vacunacion(SQLModel,table=True):
    __tablename__='vacunacion'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    id_medicamento: Optional[uuid.UUID] = Field(default=None, foreign_key='content.medicamento.id')
    medicamento:Optional['Medicamento'] = Relationship(back_populates='vacunaciones')
    fecha_aplicacion:date
    id_animal: Optional[uuid.UUID] = Field(default=None, foreign_key='content.bovino.id')
    bovino:Optional['Bovino'] = Relationship(back_populates='vacunaciones')
    dosis:Decimal = Field(sa_type=Numeric(8,2))
    observacion:Optional[str] = Field(default=None,sa_type=Text)
    creado_en:datetime
    actualizado_en:datetime