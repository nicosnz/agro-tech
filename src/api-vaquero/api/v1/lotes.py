from fastapi import APIRouter, Depends
from typing import List
from uuid import UUID
from services.lote.GetLotesByPotrero import get_lotes_by_potrero, GetLotesByPotrero, LoteResponse
from services.lote.GetAllLotes import get_all_lotes, GetAllLotes

router = APIRouter()


@router.get('/all', response_model=List[LoteResponse])
async def getAll(service: GetAllLotes = Depends(get_all_lotes)):
    return await service.get()


@router.get('/', response_model=List[LoteResponse])
async def getLotesByPotrero(id_potrero: UUID, service: GetLotesByPotrero = Depends(get_lotes_by_potrero)):
    return await service.get(id_potrero)
