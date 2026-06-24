import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import *
from repositories import *
from api.v1 import bovinos,lotes,potreros,pesajes,tipoAlimento,alimentacion
from database.elastic_indices import create_indices, sync_bovinos
from database.redis import init_redis, close_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_redis()
    await create_indices()
    await sync_bovinos()
    yield
    await close_redis()


app = FastAPI(
    title='API Agrotech',
    description='API para el negocio Agrotech',
    version='1.0.0',
    lifespan=lifespan
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bovinos.router, prefix='/api/v1/bovinos', tags=['Bovinos'])
app.include_router(lotes.router, prefix='/api/v1/lotes', tags=['Lotes'])
app.include_router(potreros.router, prefix='/api/v1/potreros', tags=['Potreros'])
app.include_router(pesajes.router, prefix='/api/v1/pesajes', tags=['Pesajes'])
app.include_router(tipoAlimento.router, prefix='/api/v1/tipo-alimento', tags=['Tipo Alimento'])
app.include_router(alimentacion.router, prefix='/api/v1/alimentacion', tags=['Alimentacion'])


@app.get("/api/v1/healthz")
async def healthz():
    return {"status": "ok"}