from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID
from services.bovino.GetAllBovinos import get_all_bovinos, GetAllBovinos, BovinoResponseGetAll,BovinosIds
from services.bovino.GetBovinosByLote import get_bovinos_by_lote, GetBovinosByLote, BovinoResponseByLote
from services.bovino.SearchBovinos import get_search_bovinos, SearchBovinos
from services.bovino.AddBovino import get_add_bovino, AddBovino, BovinoRequest, BovinoCreatedResponse

router = APIRouter()

@router.post('/', response_model=BovinoCreatedResponse, status_code=status.HTTP_201_CREATED)
async def create(body: BovinoRequest, service: AddBovino = Depends(get_add_bovino)):
    return await service.create(body)

@router.get('/', response_model=List[BovinoResponseGetAll])
async def getAll(pagina: int = 1, service: GetAllBovinos = Depends(get_all_bovinos)):
    return await service.getAll(pagina)

@router.get('/by-lote', response_model=List[BovinoResponseByLote])
async def getByLote(id_lote: UUID, service: GetBovinosByLote = Depends(get_bovinos_by_lote)):
    return await service.get(id_lote)

@router.get('/search', response_model=List[BovinoResponseGetAll])
async def search(query: str, service: SearchBovinos = Depends(get_search_bovinos)):
    return await service.search(query)

@router.get('/hembras', response_model=List[BovinosIds])
async def getHembras(service: GetAllBovinos = Depends(get_all_bovinos)):
    return await service.get_hembras()

@router.get('/machos', response_model=List[BovinosIds])
async def getMachos(service: GetAllBovinos = Depends(get_all_bovinos)):
    return await service.get_machos()
