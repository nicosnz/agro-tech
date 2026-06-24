from elasticsearch import AsyncElasticsearch
from database.elastic import get_elastic
from fastapi import Depends
from database.elastic_indices import BOVINOS_INDEX


class ElasticBovinoRepository:

    def __init__(self, elastic: AsyncElasticsearch):
        self.elastic = elastic

    async def search(self, q: str) -> list:
        query = {
            "query": {
                "multi_match": {
                    "query": q,
                    "fields": ["raza", "sexo", "origen", "lote_nombre"]
                }
            }
        }
        resultado = await self.elastic.search(index=BOVINOS_INDEX, body=query)
        hits = resultado["hits"]["hits"]
        return [hit["_source"] for hit in hits]


def get_elastic_bovino_repository(elastic: AsyncElasticsearch = Depends(get_elastic)):
    return ElasticBovinoRepository(elastic)
