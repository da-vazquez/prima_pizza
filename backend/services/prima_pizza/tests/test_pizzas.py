import json


def test_add_pizza(test_client, init_database):
    # Register and login the owner
    test_client.post(
        "/api/v1/auth/register",
        json={"username": "test_owner", "password": "test_password", "role": "owner"},
    )
    login_response = test_client.post(
        "/api/v1/auth/login",
        json={"username": "test_owner", "password": "test_password"},
    )
    owner_token = json.loads(login_response.data)["access_token"]

    # Add necessary ingredients
    ingredients = [
        {"name": "Pepperoni", "price": 1.0, "topping_type": "meat"},
        {"name": "Mushrooms", "price": 0.5, "topping_type": "vegetable"},
        {"name": "Thin Crust", "price": 2.0, "topping_type": "crust"},
        {"name": "Tomato Sauce", "price": 0.75, "topping_type": "sauce"},
        {"name": "Mozzarella", "price": 1.5, "topping_type": "cheese"},
    ]

    for ingredient in ingredients:
        test_client.post(
            "/api/v1/toppings/",
            json=ingredient,
            headers={"Authorization": f"Bearer {owner_token}"},
        )

    # Register and login the chef
    test_client.post(
        "/api/v1/auth/register",
        json={"username": "test_user", "password": "test_password", "role": "chef"},
    )
    login_response = test_client.post(
        "/api/v1/auth/login",
        json={"username": "test_user", "password": "test_password"},
    )
    chef_token = json.loads(login_response.data)["access_token"]

    # Add the pizza
    response = test_client.post(
        "/api/v1/pizzas/",
        json={
            "name": "Test Pizza",
            "cheese": "Mozzarella",
            "crust": "Thin Crust",
            "sauce": "Tomato Sauce",
            "toppings": ["Pepperoni", "Mushrooms"],
        },
        headers={"Authorization": f"Bearer {chef_token}"},
    )

    print("loggin response: ", response.data)
    assert response.status_code == 201
    assert b"Pizza Test Pizza added" in response.data


def test_get_pizzas(test_client, init_database):
    response = test_client.get("/api/v1/pizzas/")
    assert response.status_code == 200
    assert len(json.loads(response.data)) > 0
