from sqlmodel import SQLModel,Field,Relationship
from enum import Enum
from datetime import datetime,date
from typing import Optional,TYPE_CHECKING,List
import uuid

if TYPE_CHECKING:
    from models.lote import Lote
    from models.pesaje import Pesaje
    from models.vacunacion import Vacunacion
    from models.estadoAnimal import EstadoAnimal

class SexoBovinos(str,Enum):
    macho='Macho'
    hembra='Hembra'
class RazaBovinos(str,Enum):
    nelore='Nelore'
    brangus='Brangus'
    brahman='Brahman'
class OrigenBovino(str,Enum):
    comprado='Comprado'
    nacimiento_propio = 'Nacimiento Propio'

class Bovino(SQLModel,table=True):
    __tablename__='bovino'    
    __table_args__={'schema':'content'}

    id: uuid.UUID = Field(default_factory=uuid.uuid4,primary_key=True,index=True)
    sexo:SexoBovinos
    raza:RazaBovinos
    fecha_nacimiento:date
    id_madre: Optional[uuid.UUID] = Field(default=None, foreign_key='content.bovino.id')
    id_padre: Optional[uuid.UUID] = Field(default=None, foreign_key='content.bovino.id')
    id_lote:Optional[uuid.UUID] = Field(default=None,foreign_key='content.lote.id')
    lote:Optional['Lote'] = Relationship(back_populates='bovinos')
    pesajes:List['Pesaje'] = Relationship(back_populates='bovino')
    vacunaciones:List['Vacunacion'] = Relationship(back_populates='bovino')
    estados:List['EstadoAnimal'] = Relationship(back_populates='bovino')

    origen:OrigenBovino
    creado_en:datetime
    actualizado_en:datetime