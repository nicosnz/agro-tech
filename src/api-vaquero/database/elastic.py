import os
from elasticsearch import AsyncElasticsearch

ELASTIC_URL = os.getenv("ELASTICSEARCH_URL")

elastic = AsyncElasticsearch(ELASTIC_URL)


async def get_elastic():
    return elastic
