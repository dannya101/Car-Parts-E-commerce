from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_all_products():
    pass

@router.get("/{id}")
def get_product_byID():
    pass

@router.get("/partcategories")
def get_part_categories():
    pass

@router.get("/{part_cagegory_id}")
def get_product_byPart():
    pass

@router.get("/{brand_category_id}")
def get_product_byBrand():
    pass

@router.get("/brandcategories")
def get_brand_categories():
    pass
