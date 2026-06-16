import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
load_dotenv()


DB_URL=os.getenv("DATABASE_URL")
engine = create_async_engine(DB_URL,echo=True)

AsyncSessionLocal=async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session