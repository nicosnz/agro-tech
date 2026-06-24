from fastapi import Depends
from typing import List
from repositories.elasticBovinoRepository import ElasticBovinoRepository, get_elastic_bovino_repository
from services.bovino.GetAllBovinos import BovinoResponseGetAll, LoteResumen, PesajeResumen, EstadoResumen
from decimal import Decimal


class SearchBovinos:

    def __init__(self, elastic_repo: ElasticBovinoRepository):
        self.elastic_repo = elastic_repo

    async def search(self, query: str) -> List[BovinoResponseGetAll]:
        resultados = await self.elastic_repo.search(query)

        bovinos = []
        for r in resultados:
            lote         = LoteResumen(nombre=r["lote_nombre"]) if r.get("lote_nombre") else None
            peso_actual  = PesajeResumen(peso=Decimal(str(r["peso_actual"])),  fecha_pesaje=r["fecha_peso_actual"])  if r.get("peso_actual")  else None
            peso_anterior= PesajeResumen(peso=Decimal(str(r["peso_anterior"])), fecha_pesaje=r["fecha_peso_anterior"]) if r.get("peso_anterior") else None
            estado_actual= EstadoResumen(estado=r["estado_actual"]) if r.get("estado_actual") else None

            bovinos.append(BovinoResponseGetAll(
                id=r["id"],
                raza=r["raza"],
                fecha_nacimiento=r["fecha_nacimiento"],
                lote=lote,
                peso_actual=peso_actual,
                peso_anterior=peso_anterior,
                estado_actual=estado_actual,
            ))

        return bovinos


def get_search_bovinos(elastic_repo: ElasticBovinoRepository = Depends(get_elastic_bovino_repository)):
    return SearchBovinos(elastic_repo)
