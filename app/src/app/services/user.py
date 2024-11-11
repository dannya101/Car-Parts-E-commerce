import secrets

from fastapi import HTTPException
from passlib.hash import bcrypt
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import verify_password
from app.models.user import User
from app.schemas.user import UserCreate

from app.crud import (
    add_and_commit,
    get_user,
    get_user_by_username,
    get_user_by_email,
)

settings = get_settings()

#Register
def create_user(db: Session, user: UserCreate):
    if get_user_by_username(db, user.username) or get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Username or Email is already registered")

    password_hash = bcrypt.hash(user.password)
    verification_code = secrets.token_urlsafe(32)

    db_user = User(
        username = user.username,
        email = user.email,
        password_hash = password_hash,
        verification_code=verification_code
    )

    return add_and_commit(db, db_user)

def authenticate_user(db: Session, username:str, password:str):
    user = get_user_by_username(db, username)

    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None

    return user
