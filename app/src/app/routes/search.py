from fastapi import APIRouter

router = APIRouter()


@router.get("/{search_terms}")
def get_products_from_search():
    pass
