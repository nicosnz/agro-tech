import os
import logging
from redis.asyncio import Redis

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

_client: Redis | None = None


async def init_redis():
    global _client
    try:
        client = Redis.from_url(REDIS_URL, decode_responses=True)
        await client.ping()
        _client = client
        logger.info("Redis conectado en %s", REDIS_URL)
    except Exception as e:
        logger.warning("Redis no disponible (%s). El caché estará desactivado.", e)


async def close_redis():
    global _client
    if _client:
        await _client.aclose()
        _client = None


def get_redis() -> Redis | None:
    return _client


async def invalidar_cache_bovinos(redis: Redis | None) -> None:
    if not redis:
        return
    try:
        keys = await redis.keys("bovinos:pagina:*")
        if keys:
            await redis.delete(*keys)
    except Exception:
        logger.warning("Redis: no se pudo invalidar el caché de bovinos")
