from fastapi import APIRouter

router = APIRouter()


@router.get("/{user_id}")
def get_cart_by_user_id():
    pass


@router.post("/add")
def add_product_to_cart():
    pass


@router.put("/update")
def update_quantity():
    pass


@router.delete("/remove/{product_id}")
def remove_product():
    pass


@router.delete("/clear")
def clear_cart():
    pass
