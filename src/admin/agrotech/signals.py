import os
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from elasticsearch import Elasticsearch
import redis as redis_sync

logger = logging.getLogger(__name__)

BOVINOS_INDEX = "bovinos"

_redis_client = None


def get_es_client():
    url = os.getenv("ELASTICSEARCH_URL", "http://elasticsearch:9200")
    return Elasticsearch(url)


def get_redis_client():
    global _redis_client
    if _redis_client is None:
        try:
            url = os.getenv("REDIS_URL", "redis://redis:6379")
            _redis_client = redis_sync.Redis.from_url(url, decode_responses=True)
        except Exception:
            pass
    return _redis_client


def invalidar_cache_bovinos():
    client = get_redis_client()
    if not client:
        return
    try:
        keys = client.keys("bovinos:pagina:*")
        if keys:
            client.delete(*keys)
    except Exception:
        logger.warning("Redis: no se pudo invalidar el caché de bovinos")


@receiver(post_save, sender='agrotech.Bovinos')
def sync_bovino(sender, instance, created, **kwargs):
    es = get_es_client()
    doc = {
        "id": str(instance.id),
        "raza": instance.raza,
        "sexo": instance.sexo,
        "origen": instance.origen,
        "fecha_nacimiento": instance.fecha_nacimiento.isoformat() if instance.fecha_nacimiento else None,
        "lote_nombre": instance.lote.nombre if instance.lote else None,
    }
    try:
        if created:
            es.index(index=BOVINOS_INDEX, id=str(instance.id), document=doc)
        else:
            es.update(index=BOVINOS_INDEX, id=str(instance.id), body={"doc": doc})
    except Exception:
        logger.exception("Error sincronizando bovino %s en Elasticsearch", instance.id)
    finally:
        es.close()
    invalidar_cache_bovinos()


@receiver(post_save, sender='agrotech.Pesajes')
def sync_pesaje(sender, instance, **kwargs):
    from agrotech.models import Pesajes
    es = get_es_client()
    ultimos = list(
        Pesajes.objects
        .filter(bovino=instance.bovino)
        .order_by('-fecha_pesaje', '-creado_en')[:2]
    )
    doc = {
        "peso_actual": float(ultimos[0].peso) if len(ultimos) >= 1 else None,
        "fecha_peso_actual": ultimos[0].fecha_pesaje.isoformat() if len(ultimos) >= 1 else None,
        "peso_anterior": float(ultimos[1].peso) if len(ultimos) >= 2 else None,
        "fecha_peso_anterior": ultimos[1].fecha_pesaje.isoformat() if len(ultimos) >= 2 else None,
    }
    try:
        es.update(index=BOVINOS_INDEX, id=str(instance.bovino_id), body={"doc": doc})
    except Exception:
        logger.exception("Error sincronizando pesaje del bovino %s en Elasticsearch", instance.bovino_id)
    finally:
        es.close()
    invalidar_cache_bovinos()


@receiver(post_save, sender='agrotech.EstadosBovinos')
def sync_estado_bovino(sender, instance, **kwargs):
    es = get_es_client()
    try:
        es.update(
            index=BOVINOS_INDEX,
            id=str(instance.bovino_id),
            body={"doc": {"estado_actual": instance.estado}},
        )
    except Exception:
        logger.exception("Error sincronizando estado del bovino %s en Elasticsearch", instance.bovino_id)
    finally:
        es.close()
    invalidar_cache_bovinos()


@receiver(post_save, sender='agrotech.Lotes')
def sync_lote(sender, instance, **kwargs):
    invalidar_cache_bovinos()
