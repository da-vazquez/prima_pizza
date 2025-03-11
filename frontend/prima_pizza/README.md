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
NEXT_PUBLIC_MONGODB_URL=""
NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV=""
NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL="localhost:5005"
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
> Casing is important! Enter exactly as shown below

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

## 8. Deployment

### 8.1 Deploying to Azure Static Web Apps

Our frontend is deployed to Azure Static Web Apps using GitHub Actions. This automated CI/CD pipeline handles building and deploying the application whenever changes are pushed to the main branch.

#### Key Deployment Configuration

1. **GitHub Workflow**: The workflow file `.github/workflows/azure-static-web-apps-white-forest-0d702341e.yml` contains the complete deployment configuration.

2. **Build Configuration**:
   - Node.js 18
   - Yarn for package management
   - Next.js output for static site generation

3. **Environment Variables**:
NEXT_PUBLIC_NODE_ENV=PROD
NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL="http://localhost:5005"
NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_PROD=""
NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_DEV=""

4. **API Proxy Configuration**: The `staticwebapp.config.json` file configures API routing:
```json
{
  "routes": [
    {
      "route": "/api/v1/auth/login",
      "allowedRoles": ["anonymous"],
      "methods": ["POST", "OPTIONS"],
      "headers": {
        "Content-Type": "application/json"
      },
      "backendUri": "https://prima-pizza-backend-west.azurewebsites.net/api/v1/auth/login"
    },
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"],
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "backendUri": "https://prima-pizza-backend-west.azurewebsites.net/api/*"
    }
  ]
}
```

5. Production URL: The deployed application is available at:

> https://white-forest-0d702341e.6.azurestaticapps.net/

### 8.2 API Communication

When accessing API endpoints from the frontend:

1. URL Format: Always include trailing slashes in API endpoint URLs (e.g., /api/v1/toppings/ instead of /api/v1/toppings).

2. Authentication: JWT tokens are stored in localStorage and must be included in the Authorization header for protected endpoints:

```js
headers: {
  "Authorization": `Bearer ${token}`
}
```

3. CORS Considerations: The backend allows requests from any origin, but all API requests from the frontend go through Azure Static Web Apps' proxy configuration.


### 9.3 Troubleshooting Frontend Deployment

1. API Connection Issues: Check the API URL format, ensure trailing slashes are used, and verify the staticwebapp.config.json is properly proxying requests.

2. Authentication Errors: Verify the token format and expiration.

3. Build Failures: Review the GitHub Actions logs for any build or deployment errors.

4. Environment Variables: Ensure all required environment variables are properly set in the GitHub workflow.
