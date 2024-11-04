from fastapi import APIRouter

router = APIRouter()


@router.post("/products")
def create_product():
    pass


@router.put("/products/{id}")
def update_product():
    pass


@router.delete("/products/{id}")
def delete_product():
    pass
