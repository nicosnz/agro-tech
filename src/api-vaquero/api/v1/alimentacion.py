from fastapi import APIRouter, Depends
from services.alimentacion.AddAlimentacion import AddAlimentacion,get_add_alimentacion,AlimentacionRequest,Alimentacion
router = APIRouter()

@router.post('/', response_model=Alimentacion)
async def add_alimentacion(alimentacion:AlimentacionRequest,service: AddAlimentacion = Depends(get_add_alimentacion)):
    return await service.create(alimentacion)
