from typing import List, Optional
import uuid
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends
from pydantic import BaseModel
from repositories.tipoAlimentoRepository import TipoAlimentoRepository,get_tipo_alimento_repository

class TipoAlimentoResponse(BaseModel):
    id: uuid.UUID
    nombre: str
    descripcion: str
    precio: float
    cantidad_restante: float
    disponible:bool

class GetAllTipoAlimentos:
    def __init__(
        self,
        tipo_alimento_repo: TipoAlimentoRepository,
        
    ):
        self.tipo_alimento_repo = tipo_alimento_repo
        

    async def get(self) -> List[TipoAlimentoResponse]:
        tipoAlimentos = await self.tipo_alimento_repo.get_all()

        resultado = []
        for tipoAlimento in tipoAlimentos:
            tipoAlimento_response = TipoAlimentoResponse(
                id=tipoAlimento.id,
                nombre=tipoAlimento.nombre,
                descripcion=tipoAlimento.descripcion,
                precio=tipoAlimento.precio,
                cantidad_restante=tipoAlimento.cantidad_restante,
                disponible=tipoAlimento.disponible
            )
            resultado.append(tipoAlimento_response)
        return resultado


def get_all_tipo_alimentos(
    tipo_alimento_repo: TipoAlimentoRepository = Depends(get_tipo_alimento_repository),
   
):
    return GetAllTipoAlimentos(tipo_alimento_repo)
