from elasticsearch.helpers import async_bulk
from sqlmodel import select
from models.bovino import Bovino
from models.lote import Lote
from database.elastic import elastic
from database.postgres import AsyncSessionLocal
from repositories.pesajeRepository import PesajeRepository
from repositories.estadoAnimalRepository import EstadoAnimalRepository

BOVINOS_INDEX = "bovinos"

BOVINOS_MAPPING = {
    "settings": {
        "analysis": {
            "normalizer": {
                "lowercase_normalizer": {
                    "type": "custom",
                    "filter": ["lowercase"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id":                  {"type": "keyword"},
            "raza":                {"type": "keyword", "normalizer": "lowercase_normalizer"},
            "sexo":                {"type": "keyword", "normalizer": "lowercase_normalizer"},
            "origen":              {"type": "keyword", "normalizer": "lowercase_normalizer"},
            "fecha_nacimiento":    {"type": "date"},
            "lote_nombre":         {"type": "text"},
            "peso_actual":         {"type": "float"},
            "fecha_peso_actual":   {"type": "keyword"},
            "peso_anterior":       {"type": "float"},
            "fecha_peso_anterior": {"type": "date"},
            "estado_actual":       {"type": "keyword", "normalizer": "lowercase_normalizer"},
        }
    }
}


async def create_indices():
    exists = await elastic.indices.exists(index=BOVINOS_INDEX)
    if not exists:
        await elastic.indices.create(index=BOVINOS_INDEX, body=BOVINOS_MAPPING)


async def sync_bovinos():
    async with AsyncSessionLocal() as session:
        result  = await session.exec(select(Bovino, Lote).join(Lote, Bovino.id_lote == Lote.id, isouter=True))
        bovinos = result.all()

        ids     = [bovino.id for bovino, _ in bovinos]
        pesajes = await PesajeRepository(session).get_ultimos_dos_por_animales(ids)
        estados = await EstadoAnimalRepository(session).get_ultimo_por_animales(ids)

    acciones = []
    for bovino, lote in bovinos:
        pesajes_animal      = pesajes.get(bovino.id, [])
        estado_row          = estados.get(bovino.id)

        peso_actual         = float(pesajes_animal[0]['peso'])                   if len(pesajes_animal) >= 1 else None
        fecha_peso_actual   = pesajes_animal[0]['fecha_pesaje'].isoformat()      if len(pesajes_animal) >= 1 else None
        peso_anterior       = float(pesajes_animal[1]['peso'])                   if len(pesajes_animal) >= 2 else None
        fecha_peso_anterior = pesajes_animal[1]['fecha_pesaje'].isoformat()      if len(pesajes_animal) >= 2 else None
        estado_actual       = estado_row['estado']                               if estado_row else None

        acciones.append({
            "_index": BOVINOS_INDEX,
            "_id": str(bovino.id),
            "_source": {
                "id":                  str(bovino.id),
                "raza":                bovino.raza,
                "sexo":                bovino.sexo,
                "origen":              bovino.origen,
                "fecha_nacimiento":    bovino.fecha_nacimiento.isoformat(),
                "lote_nombre":         lote.nombre if lote else None,
                "peso_actual":         peso_actual,
                "fecha_peso_actual":   fecha_peso_actual,
                "peso_anterior":       peso_anterior,
                "fecha_peso_anterior": fecha_peso_anterior,
                "estado_actual":       estado_actual,
            }
        })

    if acciones:
        await async_bulk(elastic, acciones)
