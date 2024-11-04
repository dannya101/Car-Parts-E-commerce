from fastapi import APIRouter

router = APIRouter()


@router.post("/ticket")
def create_support_ticket():
    pass


@router.get("/ticket")
def get_support_ticket():
    pass


@router.post("/ticket/reply")
def reply_to_ticket():
    pass


@router.post("/ticket/close")
def close_ticket():
    pass
