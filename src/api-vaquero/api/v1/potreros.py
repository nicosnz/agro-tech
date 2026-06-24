from fastapi import APIRouter, Depends
from typing import List
from services.potrero.GetAllPotreros import get_all_potreros, GetAllPotreros, PotreroReponse

router = APIRouter()


@router.get('/', response_model=List[PotreroReponse])
async def get_all_potreros_endpoint(service: GetAllPotreros = Depends(get_all_potreros)):
    return await service.get()
