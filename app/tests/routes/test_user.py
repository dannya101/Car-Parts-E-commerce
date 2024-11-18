# from fastapi.testclient import TestClient

# from app.routes.user.py import app

# client = TestClient(app)


# def test_read_item():
#     response = client.get("/me", headers={"X-Token": "coneofsilence"})
#     assert response.status_code == 200
#     assert response.json() == {
#         "id": "foo",
#         "title": "Foo",
#         "description": "There goes my hero",
#     }
