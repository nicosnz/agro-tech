from fastapi import APIRouter, Depends
from typing import List
from services.tipoAlimento.GetAllTipoAlimentos import get_all_tipo_alimentos,TipoAlimentoResponse,GetAllTipoAlimentos
router = APIRouter()

@router.get('/', response_model=List[TipoAlimentoResponse])
async def get_all_tipo_alimentos(service: GetAllTipoAlimentos = Depends(get_all_tipo_alimentos)):
    return await service.get()
