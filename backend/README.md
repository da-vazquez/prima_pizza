# Backend Documentation

## 1. Overview
This backend is a REST API built using Flask for managing a pizza restaurant. It allows the management of pizzas, toppings, and users, with JWT authentication for security. The system supports role-based access control with different permissions for owners and chefs.

## 2. Installation and Setup

### 2.1 Prerequisites
Make sure you have the following installed:
- Python 3.8 or higher
- pip3 (Python package installer)
- MongoDB Compass
- MongoDB Atlas (for remote connections)
- pre-commit (for linting and conformed code)
- Visual Studio Code

### 2.2 Installation

#### 1. Ensure you are at root of backend (/prima_pizza/backend/)

#### 2. Create a virtual environment- This may differ depending on your OS

MacOS:
```bash
python3 -m venv venv 
```

#### 3. Activate your newly created virtual environment - This may differ depending on your OS

MacOS:
```bash
. venv/bin/activate
```

#### 4. Install project dependencies
```bash
pip3 install -r requirements.txt
```

#### 5. Set up MongoDB

Ensure that your MongoDB instance is running. If you’re using a local instance, the default connection will usually be mongodb://localhost:27017/.

Alternatively, you can use a cloud provider like MongoDB Atlas and update the connection string in your configuration.

#### 6. Create and set environment variables in backend/instance

If in LOCAL development:
```bash
touch local.env
```

If in DEV development:
```bash
touch dev.env
```

Sample local.env:

```
FLASK_APP=app.py
FLASK_ENV=development
DEBUG=True
LOG_LEVEL=WARNING
JWT_SECRET_KEY=your_jwt_secret_key
DATABASE_URL="your_database_url"
```

#### 7. In your terminal, set the ENV variable to either "LOCAL" ,"DEV", or "TEST"
```bash
export ENV=LOCAL
```
OR
```bash
export ENV=DEV
``` 
OR
```bash
export ENV=TEST
``` 

> You'll get an error running tests in any other env other than TEST instructing to switch ENV's

```bash
ImportError while loading conftest '/Users/user/prima_pizza/backend/services/prima_pizza/tests/conftest.py'.
services/prima_pizza/tests/conftest.py:13: in <module>
    pytest.exit("Tests can only be run in the TEST environment. Please set the ENV environment variable to 'TEST'.", returncode=1)
E   _pytest.outcomes.Exit: Tests can only be run in the TEST environment. Please set the ENV environment variable to 'TEST'.
```


#### 8. Start the application from /backend root
```bash
python3 -m services.prima_pizza.app
```

- The API will start on localhost:5005


## 3. Routes

### 3.1 Auth

#### Register User
```yaml
URL: /api/v1/auth/register
Method: POST
Body: JSON object with the following properties..
  username: string (required)
  password: string (required)
  role: string (owner or chef) (required)

Response:
  Success: {"message": "User registered successfully"}, 201
  Failure: {"message": "User already exists"}, 400
```


#### Login User
```yaml
URL: /api/v1/auth/login
Method: POST
Body: JSON object with the following properties..
  username: string (required)
  password: string (required)
Response:
  Success: {"access_token": "<jwt_token>"}, 200
  Failure: {"message": "Invalid credentials or account does not exist"}, 401
```


#### Get Users (Protected, requires JWT)
```yaml
URL: /api/v1/auth/users
Method: GET
Headers:
Authorization: Bearer <jwt_token>
Response:
  Success: JSON array of user objects
  Failure: {"message": "Missing or invalid token"}
```

Example Successful Response:
```js
  [
    {
      "_id": "67c36ef9190af727de4a4b75",
      "role": "owner",
      "username": "test1"
    },
    {
      "_id": "67c36f1d190af727de4a4b76",
      "role": "chef",
      "username": "test2"
    }
  ]
```

### 3.2 Pizzas

#### Get All Pizzas
```yaml
URL: /api/v1/pizzas
Method: GET
Response: JSON array of pizzas
```

Example successful response:
```js
[
  {
    "cheese": "Mozarella",
    "crust": "Hand Tossed",
    "date_added": "Sat, 01 Mar 2025 00:03:55 GMT",
    "name": "Classic_Italian",
    "price": {
      "l": 34.99,
      "m": 25.99,
      "s": 18.99
    },
    "sauce": "Classic Marinara",
    "toppings": [
      "Pepperoni",
      "Green Peppers",
      "Black Olives",
      "Mushrooms",
      "Garlic",
      "Italian Sausage"
    ]
  }
]
```

#### Add Pizza (Protected, requires JWT and Chef role)
```yaml
URL: /api/v1/pizzas
Method: POST
Headers:
Authorization: Bearer <jwt_token>
Body: JSON object with the following properties..
  name: string (required)
  crust: string (required)
  sauce: string (required)
  cheese: string (required)
  toppings: array of strings (required)
Response:
  Success: {"message": "Pizza <pizza_name> added"}, 201
  Failure: {"message": "Ingredients <ingredients> do not exist"}, 400
```


#### Delete Pizza (Protected, requires JWT and Chef role)
```yaml
URL: /api/v1/pizzas/<string:name>
Method: DELETE
Headers:
Authorization: Bearer <jwt_token>
Response:
  Success: {"message": "Pizza <name> deleted"}, 200
  Failure: {"message": "Pizza not found"}, 404
```


### 3.3 Toppings

#### Get All Toppings
```yaml
URL: /api/v1/toppings
Method: GET
Response: JSON array of toppings
```

Example successful response:

```js
[
  {
    "date_added": "Fri, 28 Feb 2025 21:38:30 GMT",
    "name": "Bacon",
    "price": 1.25,
    "topping_type": "meat"
  },
  {
    "date_added": "Fri, 28 Feb 2025 21:39:06 GMT",
    "name": "Garlic",
    "price": 0.75,
    "topping_type": "vegetable"
  },
]
```

#### Add Topping (Protected, requires JWT and Owner role)
```yaml
URL: /api/v1/toppings
Method: POST
Headers: Authorization: Bearer <jwt_token>
Body: JSON object with the following properties:
  name: string (required)
  price: number (required)
Response:
  Success: {"message": "Topping added"}, 201
  Failure: {"message": "Topping already exists"}, 400
```

#### Delete Topping (Protected, requires JWT and Owner role)
```yaml
URL: /api/v1/toppings/<string:name>
Method: DELETE
Headers: Authorization: Bearer <jwt_token>
Response:
  Success: {"message": "Topping <name> deleted"}, 200
  Failure: {"message": "Topping <name> not found"}, 404
```


## 4. Error Handling

### 4.1 Unauthorized

If the request is missing a valid JWT token or the token is invalid, a 401 Unauthorized error is returned with this message:

```js
{"message": "Missing or invalid token"}, 401
```

### 4.2 Forbidden

If the authenticated user does not have the correct role (e.g., trying to access owner-only or chef-only routes), a 403 Forbidden error is returned:

```js
{"message": "Unauthorized"}, 403
```

### 4.3 Not Found

If a requested resource (pizza or topping) does not exist, a 404 Not Found error is returned:

```js
{"message": "Pizza not found"}, 404  or {"message": "Topping not found"}, 404
```

## 5. Security

### 5.1 JWT Authentication

#### The API uses JWT (JSON Web Tokens) for user authentication. Users must log in to receive a token, which is then used to authenticate requests to protected routes (e.g., adding or deleting pizzas).


### 5.2 Role-based Access Control:

#### There are two roles: owner and chef.
```yaml
Owner: Can add or delete toppings.
Chef: Can add or delete pizzas.
```

*Only users with the appropriate role can access certain routes.


## 6. Testing

### 6.1 Check for Installed Dependencies

Ensure you have all the required dependencies installed. You can install them using:
```bash
pip3 install -r requirements.txt
```

### 6.2 Running Tests

To run the tests, use the following command:
```bash
venv/bin/python -m pytest services/prima_pizza/tests
```

This will execute all the tests in the tests directory and provide a summary of the test results.

### 6.3 Checking Test Coverage

To check the test coverage, you can use the `pytest-cov` plugin. Install it using:
```bash
pip install pytest-cov
```

To run standard tests without coverage reporting:
```bash
venv/bin/python -m pytest services/prima_pizza/tests
```

To run tests WITH coverage reporting:
```bash
venv/bin/python pytest --cov=services/prima_pizza/tests/
```

This will provide a detailed report of your test coverage.

### 6.4 Debugging Test Failures

If your tests do not pass, follow these steps to debug:

1. **Check Environment Variables**: Ensure that the `ENV` environment variable is set to `TEST`.
   ```bash
   export ENV=TEST
   ```

2. **Check Database Configuration**: Ensure that your test database is correctly configured in `backend/instance/test.env`.

3. **Review Test Output**: Look at the test output to identify which tests are failing and why. The output will provide details on the assertions that failed.

4. **Run Individual Tests**: Run individual tests to isolate issues.
   ```bash
   venv/bin/pytest -m path/to/test_file.py::test_function_name
   ```

5. **Use Debugging Tools**: Use debugging tools like `pdb` to step through your code and identify issues.
   ```python
   import pdb; pdb.set_trace()
   ```
