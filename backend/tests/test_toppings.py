import json


def test_add_topping(test_client, init_database):
    test_client.post(
        "/api/v1/auth/register",
        json={"username": "test_owner", "password": "test_password", "role": "owner"},
    )
    login_response = test_client.post(
        "/api/v1/auth/login",
        json={"username": "test_owner", "password": "test_password"},
    )
    token = json.loads(login_response.data)["access_token"]

    response = test_client.post(
        "/api/v1/toppings/",
        json={"name": "Test Topping", "price": 1.99, "topping_type": "vegetable"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert b"Topping added" in response.data


def test_get_toppings(test_client, init_database):
    response = test_client.get("/api/v1/toppings/")
    assert response.status_code == 200
    assert len(json.loads(response.data)) > 0
