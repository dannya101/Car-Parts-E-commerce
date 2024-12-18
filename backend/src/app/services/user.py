import secrets

from fastapi import HTTPException
from passlib.hash import bcrypt
from sqlalchemy.orm import Session

from app.core.config import get_settings, send_verification_email
from app.core.security import verify_password
from app.models.user import User
from app.schemas.user import UserCreate

from app.crud import (
    add_and_commit,
    get_user,
    get_user_by_username,
    get_user_by_email,
    set_admin
)

settings = get_settings()

def verify_user_email(db: Session, verification_code: str):
    # Check if a user with the given verification code exists
    user = db.query(User).filter(User.verification_code == verification_code).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification code.")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email is already verified.")

    # Mark the email as verified
    user.is_verified = True
    user.verification_code = None  # Clear the code after successful verification
    db.commit()
    return {"message": "Email verified successfully."}

def create_user(db: Session, user: UserCreate):
    """
    Registers a new user by adding them to the database.

    Parameters:
        db (Session): The database session.
        user (UserCreate): Schema containing user details (username, email, password).

    Returns:
        User: The newly created user.

    Raises:
        HTTPException: If the username or email is already registered.
    """
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

    #Send verification email if email address is not example.com
    if not user.email.endswith('@example.com'):
        send_verification_email(to_email=user.email, verification_code=verification_code)

    return add_and_commit(db, db_user)

def authenticate_user(db: Session, username:str, password:str):
    """
    Authenticates a user by verifying their username and password.

    Parameters:
        db (Session): The database session.
        username (str): The user's username.
        password (str): The plain text password provided by the user.

    Returns:
        User: The authenticated user if credentials are correct, otherwise None.
    """
    user = get_user_by_username(db, username)

    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None

    return user
