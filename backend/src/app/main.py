

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os

from app.core.database import Base, engine
from app.routes import api_router
from app.middleware.logging_middleware import LoggingMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

UPLOAD_FOLDER = "uploads"

print(f"Current Working Directory: {os.getcwd()}")

try:
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        print(f"Directory '{UPLOAD_FOLDER}' created successfully.")
except Exception as e:
    print(f"Failed to create directory: {e}")

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

app.include_router(api_router)
