from typing import List, Optional
import uuid
from datetime import date,datetime
from decimal import Decimal
from pydantic import BaseModel,Field,field_validator
from fastapi import Depends
from repositories.pesajeRepository import get_pesaje_repository,PesajeRepository,Pesaje
from pydantic import BaseModel


class PesajeRequest(BaseModel):
    id: uuid.UUID
    peso:Decimal
    @field_validator('peso')
    @classmethod
    def validar_peso(cls, v):
        if v <= 0:
            raise ValueError('El peso debe ser mayor a 0 kg')
        if v > 10000:
            raise ValueError('El peso no puede superar los 10000 kg')
        return v
    
class AddPesaje:
    def __init__(
        self,
        pesaje_repo:PesajeRepository,
        
    ):
        self.pesaje_repo=pesaje_repo
        

    async def create(self, pesaje_request:PesajeRequest) -> Pesaje:
        pesaje = Pesaje(
            id_animal=pesaje_request.id,
            peso=pesaje_request.peso,
            fecha_pesaje=date.today(),
            creado_en=datetime.now(),
            actualizado_en=datetime.now()
        )
        return await self.pesaje_repo.create(pesaje)


def get_add_pesaje(
    pesaje_repo: PesajeRepository = Depends(get_pesaje_repository),
   
):
    return AddPesaje(pesaje_repo)
