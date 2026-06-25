from elasticsearch import AsyncElasticsearch
from database.elastic import get_elastic
from fastapi import Depends
from database.elastic_indices import BOVINOS_INDEX
from models.bovino import Bovino


class ElasticBovinoRepository:

    def __init__(self, elastic: AsyncElasticsearch):
        self.elastic = elastic

    async def index_bovino(self, bovino: Bovino, lote_nombre: str | None):
        await self.elastic.index(
            index=BOVINOS_INDEX,
            id=str(bovino.id),
            body={
                "id":                  str(bovino.id),
                "raza":                bovino.raza,
                "sexo":                bovino.sexo,
                "origen":              bovino.origen,
                "fecha_nacimiento":    bovino.fecha_nacimiento.isoformat(),
                "lote_nombre":         lote_nombre,
                "peso_actual":         None,
                "fecha_peso_actual":   None,
                "peso_anterior":       None,
                "fecha_peso_anterior": None,
                "estado_actual":       None,
            }
        )

    async def update_pesos_bovino(self, id_animal: str, peso_actual: dict | None, peso_anterior: dict | None):
        await self.elastic.update(
            index=BOVINOS_INDEX,
            id=id_animal,
            body={
                "doc": {
                    "peso_actual":         float(peso_actual['peso'])                     if peso_actual  else None,
                    "fecha_peso_actual":   peso_actual['fecha_pesaje'].isoformat()        if peso_actual  else None,
                    "peso_anterior":       float(peso_anterior['peso'])                   if peso_anterior else None,
                    "fecha_peso_anterior": peso_anterior['fecha_pesaje'].isoformat()      if peso_anterior else None,
                }
            }
        )
    
    async def search(self, q: str) -> list:
        query = {
            "query": {
                "multi_match": {
                    "query": q,
                    "fields": ["id","raza", "sexo", "origen", "lote_nombre","fecha_peso_actual"]
                }
            }
        }
        resultado = await self.elastic.search(index=BOVINOS_INDEX, body=query)
        hits = resultado["hits"]["hits"]
        return [hit["_source"] for hit in hits]


def get_elastic_bovino_repository(elastic: AsyncElasticsearch = Depends(get_elastic)):
    return ElasticBovinoRepository(elastic)
