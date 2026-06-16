from fastapi import FastAPI

app = FastAPI(
    title='API Agrotech',
    description='API para el negocio Agrotech',
    version='1.0.0'
)

@app.get("/api/v1/healthz")
async def healthz():
    return {"status": "ok"}