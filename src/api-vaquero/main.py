from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import *
from repositories import *
from api.v1 import bovinos,lotes,potreros

app = FastAPI(
    title='API Agrotech',
    description='API para el negocio Agrotech',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bovinos.router, prefix='/api/v1/bovinos', tags=['Bovinos'])
app.include_router(lotes.router, prefix='/api/v1/lotes', tags=['Lotes'])
app.include_router(potreros.router, prefix='/api/v1/potreros', tags=['Potreros'])


@app.get("/api/v1/healthz")
async def healthz():
    return {"status": "ok"}