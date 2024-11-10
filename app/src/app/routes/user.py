from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

import app.services.user as user_service
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user
from app.dependencies import get_db
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db=db, user=user)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_service.authenticate_user(db=db, username=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_current_user(current_user: User = Depends(get_current_user)):
    return {"message": "Logged Out: Remove JWT from storage"}


@router.post("/verify-email/{verification_code}")
def verify_email():
    pass
