from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_all_products():
    pass


@router.get("/{id}")
def get_product_by_id():
    pass


@router.get("/partcategories")
def get_part_categories():
    pass


@router.get("/{part_cagegory_id}")
def get_product_by_part():
    pass


@router.get("/{brand_category_id}")
def get_product_by_brand():
    pass


@router.get("/brandcategories")
def get_brand_categories():
    pass
