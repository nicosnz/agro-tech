from fastapi import APIRouter, Depends
from typing import List
from uuid import UUID
from services.bovino.GetAllBovinos import get_all_bovinos, GetAllBovinos, BovinoResponseGetAll
from services.bovino.GetBovinosByLote import get_bovinos_by_lote, GetBovinosByLote,BovinoResponseByLote

router = APIRouter()

@router.get('/', response_model=List[BovinoResponseGetAll])
async def getAll(pagina: int = 1, service: GetAllBovinos = Depends(get_all_bovinos)):
    return await service.getAll(pagina)

@router.get('/by-lote', response_model=List[BovinoResponseByLote])
async def getByLote(id_lote: UUID, service: GetBovinosByLote = Depends(get_bovinos_by_lote)):
    return await service.get(id_lote)
