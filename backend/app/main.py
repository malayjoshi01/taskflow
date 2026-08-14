from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes import boards, tasks


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
    description="Backend API for the TaskFlow task management board",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://frontend-five-omega-53.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(boards.router)
app.include_router(tasks.router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
