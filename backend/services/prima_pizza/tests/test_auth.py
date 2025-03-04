import json


def test_register_user(test_client, init_database):
    response = test_client.post(
        "/api/v1/auth/register",
        json={"username": "test_user", "password": "test_password", "role": "chef"},
    )
    assert response.status_code == 201
    assert b"User registered successfully" in response.data


def test_login_user(test_client, init_database):
    test_client.post(
        "/api/v1/auth/register",
        json={"username": "test_user", "password": "test_password", "role": "chef"},
    )
    response = test_client.post(
        "/api/v1/auth/login",
        json={"username": "test_user", "password": "test_password"},
    )
    assert response.status_code == 200
    assert "access_token" in json.loads(response.data)
