from fastapi import APIRouter, Depends
from services.pesaje.AddPesaje import get_add_pesaje,PesajeRequest,Pesaje,AddPesaje

router = APIRouter()

@router.post('/', response_model=Pesaje)
async def add_pesaje(new_pesaje:PesajeRequest,service: AddPesaje = Depends(get_add_pesaje)):
    return await service.create(new_pesaje)
