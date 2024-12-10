from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

import app.services.user as user_service
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user, check_admin_pass
from app.dependencies import get_db
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a New User

    This endpoint allows you to register a new user by providing their details.

    - **Parameters**:
        - `user` (UserCreate): The user information required for registration.
          Includes fields such as `username`, `email`, and `password`.
        - `db` (Session): A database session dependency, automatically injected.

    - **Returns**:
        - `UserResponse`: A response model containing the details of the newly registered user (excluding sensitive information like the password).

    - **Raises**:
        - `HTTPException` (status code 400): If the user already exists or if the input data is invalid.
        - `HTTPException` (status code 500): For unexpected server errors.

    Example usage:
    ```json
    POST /register
    {
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": "securepassword123"
    }
    ```

    Successful response:
    ```json
    {
        "id": 1,
        "username": "johndoe",
        "email": "johndoe@example.com",
        "created_at": "2024-11-17T12:00:00"
    }
    ```
    """
    return user_service.create_user(db=db, user=user)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login for Access Token

    This endpoint allows users to log in and obtain an access token for authentication.
    The access token can be used to authenticate subsequent requests to protected routes.

    - **Parameters**:
        - `form_data` (OAuth2PasswordRequestForm): A dependency that extracts login credentials (`username` and `password`) from the request form data.
        - `db` (Session): A database session dependency, automatically injected.

    - **Returns**:
        - `Token`: A dictionary containing:
            - `access_token`: The JWT access token for the authenticated user.
            - `token_type`: The type of token, typically `"bearer"`.

    - **Raises**:
        - `HTTPException` (status code 401): If authentication fails due to incorrect credentials.

    Example Request:
    ```json
    POST /token
    Content-Type: application/x-www-form-urlencoded

    username=johndoe&password=securepassword123
    ```

    Example Successful Response:
    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "bearer"
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Incorrect Username or Password"
    }
    ```

    - **Notes**:
        - Ensure the client sends the `Content-Type: application/x-www-form-urlencoded` header.
        - The `WWW-Authenticate` header is included in the 401 error response to indicate the use of the Bearer authentication scheme.
    """
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
    """
    Retrieve the Current Logged-in User

    This endpoint returns the details of the currently authenticated user based on the access token provided in the request.

    - **Parameters**:
        - `current_user` (User): A dependency that retrieves the currently authenticated user using the `get_current_user` function.

    - **Returns**:
        - `User`: The user object representing the currently logged-in user. Typically includes fields such as `id`, `username`, `email`, and other profile details.

    - **Raises**:
        - `HTTPException` (status code 401): If the user is not authenticated or if the access token is invalid or expired.

    Example Request:
    ```http
    GET /me
    Authorization: Bearer <access_token>
    ```

    Example Successful Response:
    ```json
    {
        "id": 1,
        "username": "johndoe",
        "email": "johndoe@example.com",
        "created_at": "2024-11-17T12:00:00"
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Not authenticated"
    }
    ```

    - **Notes**:
        - This endpoint requires a valid JWT access token in the `Authorization` header.
        - The `get_current_user` function handles the token validation and user retrieval process.
    """
    return current_user


@router.post("/logout")
def logout_current_user(current_user: User = Depends(get_current_user),  db:Session=Depends(get_db)):
    """
    Logout the Current Logged-in User

    This endpoint logs out the currently authenticated user. It serves as a client-side instruction to remove the JWT from storage,
    as no server-side session management is typically involved with stateless JWTs.

    - **Parameters**:
        - `current_user` (User): A dependency that retrieves the currently authenticated user using the `get_current_user` function.
        - `db` (Session): A database session dependency, provided in case logout-related database updates are required (optional in this implementation).

    - **Returns**:
        - `dict`: A dictionary containing a message instructing the client to remove the JWT from storage.

    Example Request:
    ```http
    POST /logout
    Authorization: Bearer <access_token>
    ```

    Example Successful Response:
    ```json
    {
        "message": "Logged Out: Remove JWT from storage"
    }
    ```

    - **Notes**:
        - This endpoint assumes stateless JWTs are being used, so the "logout" operation is effectively a client-side action.
        - For blacklisting or revoking tokens, additional logic would be required to track invalidated tokens (e.g., storing them in a database or cache).
        - The `current_user` dependency ensures the request is made by an authenticated user.

    - **Raises**:
        - `HTTPException` (status code 401): If the user is not authenticated or if the access token is invalid or expired.
    """
    return {"message": "Logged Out: Remove JWT from storage"}

@router.get("/verify-email")
def verify_email(verification_code: str,  db:Session=Depends(get_db)):
    """
    Verify the User's Email Address

    This endpoint allows the currently authenticated user to verify their email address by providing a verification code.
    Email verification is typically required to activate an account or access certain features.

    - **Parameters**:
        - `verification_code` (str): The verification code sent to the user's email. This code is used to confirm the user's email address.
        - `current_user` (User): A dependency that retrieves the currently authenticated user using the `get_current_user` function.
        - `db` (Session): A database session dependency for performing the verification logic and updating the user's email status.

    - **Returns**:
        - `dict`: A dictionary indicating the success of the verification, typically containing a confirmation message.

    - **Raises**:
        - `HTTPException` (status code 400): If the verification code is invalid or expired.
        - `HTTPException` (status code 401): If the user is not authenticated.

    Example Request:
    ```http
    POST /verify-email
    Authorization: Bearer <access_token>
    Content-Type: application/json

    {
        "verification_code": "123456"
    }
    ```

    Example Successful Response:
    ```json
    {
        "message": "Email verified successfully."
    }
    ```

    Example Error Response:
    ```json
    {
        "detail": "Invalid or expired verification code."
    }
    ```

    - **Notes**:
        - Ensure the user has received a valid verification code via email before calling this endpoint.
        - The `user_service.verify_user_email` method handles the business logic for verifying the code and updating the database.
        - This endpoint is protected and requires the user to be authenticated.

    - **Use Case**:
        - Verifying the email address to complete the registration process or enable email-related features.
    """
    return user_service.verify_user_email(db=db, verification_code=verification_code)

#To make an admin user, you must edit the database directly
"""
@router.post("/setAdmin")
def set_user_as_admin(password: str, current_user: User=Depends(get_current_user), db:Session=Depends(get_db)):
    if not check_admin_pass(password=password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect Admin Password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_service.set_admin(db=db, user_id=current_user.id)
"""

@router.get("/isAdmin")
def is_user_admin(current_user: User=Depends(get_current_user), db:Session=Depends(get_db)):
    user =user_service.get_user(db=db, user_id=current_user.id)
    if(user.is_admin):
        return {"success": "User Is Admin"}
    else:
        return {"fail": "User Is NOT Admin"}
