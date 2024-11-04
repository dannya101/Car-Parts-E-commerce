from fastapi import APIRouter

router = APIRouter()


@router.get("/{user_id}")
def get_all_user_orders():
    pass


@router.get("/{order_id}")
def get_order_by_id():
    pass
