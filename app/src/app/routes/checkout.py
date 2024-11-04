from fastapi import APIRouter

router = APIRouter()


@router.post("/")
def start_checkout():
    pass


@router.post("/address")
def add_shipping_address():
    pass


@router.post("/shipping-method")
def select_shipping_method():
    pass


@router.post("/payment-method")
def select_payment_method():
    pass


@router.post("/complete")
def finalize_checkout():
    pass


@router.get("/order-summary")
def get_order_summary():
    pass
