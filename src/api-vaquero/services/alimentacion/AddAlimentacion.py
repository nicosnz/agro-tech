from typing import Optional
import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel
from fastapi import Depends, HTTPException
from uuid import UUID
from repositories.alimentacionRepository import AlimentacionRepository, Alimentacion, get_alimentacion_repository
from repositories.tipoAlimentoRepository import TipoAlimentoRepository, get_tipo_alimento_repository


class AlimentacionRequest(BaseModel):
    id_tipo_alimento: UUID
    cantidad: Decimal
    observacion: Optional[str] = None
    id_lote: UUID


class AddAlimentacion:
    def __init__(
        self,
        alimentacion_repo: AlimentacionRepository,
        tipo_alimento_repo: TipoAlimentoRepository,
    ):
        self.alimentacion_repo = alimentacion_repo
        self.tipo_alimento_repo = tipo_alimento_repo

    async def create(self, request: AlimentacionRequest) -> Alimentacion:
        tipo_alimento = await self.tipo_alimento_repo.get_by_id(request.id_tipo_alimento)

        if not tipo_alimento:
            raise HTTPException(status_code=404, detail='Tipo de alimento no encontrado')

        if tipo_alimento.cantidad_restante < request.cantidad:
            raise HTTPException(
                status_code=400,
                detail=f'Cantidad restante insuficiente. Disponible: {tipo_alimento.cantidad_restante} kg'
            )

        tipo_alimento.cantidad_restante -= request.cantidad
        await self.tipo_alimento_repo.update(tipo_alimento)

        alimentacion = Alimentacion(
            id_tipo_alimento=request.id_tipo_alimento,
            cantidad=request.cantidad,
            observacion=request.observacion,
            id_lote=request.id_lote,
            fecha_alimentacion=date.today(),
            creado_en=datetime.now(),
            actualizado_en=datetime.now()
        )
        return await self.alimentacion_repo.create(alimentacion)


def get_add_alimentacion(
    alimentacion_repo: AlimentacionRepository = Depends(get_alimentacion_repository),
    tipo_alimento_repo: TipoAlimentoRepository = Depends(get_tipo_alimento_repository),
):
    return AddAlimentacion(alimentacion_repo, tipo_alimento_repo)
