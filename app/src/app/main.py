import jwt
from jwt.exceptions import InvalidTokenError

from passlib.context import CryptContext

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

from app.core.database import Base, engine
from app.routes import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(api_router)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
async def root(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
