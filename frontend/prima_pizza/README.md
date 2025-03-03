# Frontend Documentation

## 1. Overview
This frontend is a web application built using Next.js and React for the Prima Pizza client App. It allows the management of pizzas, toppings, and user accounts, with role-based access control for different user roles such as owners and chefs.

## 2. Installation and Setup

### 2.1 Prerequisites
Make sure you have the following installed:
- Node.js (version 14 or higher)
- npm (Node package manager)
- Visual Studio Code

### 2.2 Installation

#### 1. Ensure you are at the root of the frontend directory (`/prima_pizza/frontend/prima_pizza/`)

#### 2. Install project dependencies
```bash
yarn install
```

#### 3. Create a .env file in the root of the frontend directory and add the following environment variables:
```bash
NEXT_PUBLIC_MONGODB_URI="your-mongodb-URI"
NEXT_PUBLIC_NODE_ENV=LOCAL
```

#### 4. Start the development server
```bash
yarn run dev
```

- The Dev server will start on localhost:3000


## 3. Routes

### 3.1 Pages

#### Home 
```yaml
URL: "/"
Method: GET
Description: Displays a welcome screen with options to login or register
```


#### Dashboard
```yaml
URL: "/dashboard"
Method: GET
Description: Displays the dashboard with options to view/modify pizzas, view/modify toppings, and account settings.
```

#### Login 
```yaml
URL: "/login"
Method: GET
Description: Displays the login page for user authentication.
```

> Credentials for Demo

To login as an <b>OWNER</b>
<ul>
  <li>username = "Owner_Bob"
  <li>password = "owner123"
</ul>

To login as a <b>CHEF</b>
<ul>
  <li>username = "Chef_Bob"
  <li>password = "chef123"
</ul>


## 4. Components

### 4.1 Home

<ul>
  <li>File: src/components/dashHome.tsx</li>
  <li>Description: Displays the home page of the dashboard with user information and pizza/topping counts.</li>
</ul>

### 4.2 PizzaTable

<ul>
<li>File: src/components/dashPizza.tsx</li>
<li>Description: Displays a table of pizzas with options to add, edit, and delete pizzas.</li>
</ul>

### 4.3 ToppingTable

<ul>
  <li>File: src/components/dashToppings.tsx</li>
  <li>Description: Displays a table of toppings with options to add, edit, and delete toppings.</li>
</ul>

## 5. Authentication

### 5.1 Login

<ul>
  <li>File: src/app/login/page.tsx</li>
  <li>Description: Handles user login and stores the JWT token in local storage.</li>
</ul>

### 5.2 Logout

<ul>
  <li>File: src/app/dashboard/page.tsx</li>
  <li>Description: Handles user logout by removing the JWT token from local storage and redirecting to the login page.</li>
</ul>


## 6. Error Handling

Error messages are displayed using toast notifications in the dashboard components.

## 7. Security

JWT authentication is used to secure the application.
Role-based access control is implemented to restrict access to certain features based on user roles.

## 8. Testing

Coming soon.