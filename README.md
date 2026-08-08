# SCIC/EJP-13 Express + Prisma API Backend

A production-ready, type-safe RESTful API built using Node.js, Express.js, TypeScript, and Prisma ORM with PostgreSQL database integration. The project implements a scalable Service-Layer Architecture separating route registration, HTTP request handling/validation (Controllers), core business actions (Services), and direct database client configurations.

---

## 🚀 Tech Stack

*   **Runtime**: Node.js (v18+)
*   **Framework**: Express.js
*   **Programming Language**: TypeScript
*   **Database Tooling**: Prisma ORM (v7+)
*   **Database**: PostgreSQL
*   **Security & Auth**: Bcrypt (password hashing), JsonWebToken (JWT authentication)
*   **Local Tooling**: ts-node-dev (live-reload development server)

---

## 🛠️ Local Setup Guide

Follow these steps to run the application locally on your machine:

### 1. Clone the repository and install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root and add the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>?schema=public"
JWT_SECRET="your_jwt_signature_secret_key"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=12
```

### 3. Generate Prisma Client Types
Run the Prisma generator to compile type definitions corresponding to the database models:
```bash
npx prisma generate
```

### 4. Run Database Migrations
Create the tables in your local database schema:
```bash
npx prisma migrate dev --name init
```

### 5. Launch Development Server
Start the live-reloaded server:
```bash
npm run dev
```
The server will boot up and should print: `Server is running at http://localhost:5000`.

### 6. Build for Production
To compile the TypeScript source files to the target compilation folder (`dist/`):
```bash
npm run build
npm start
```

---

## 📂 Project Structure

The project strictly maps folders by architectural responsibility:
```text
postgresql-prisma-start/
├── prisma/
│   ├── schema.prisma       # Database schema models, enums & index settings
│   └── migrations/         # Database migration history files
├── src/
│   ├── lib/
│   │   └── prisma.ts       # Prisma Client singleton with Pool configurations
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # Token authorization and role-checking guards
│   │   ├── globalErrorHandler.ts # Operational and Prisma error formatter
│   │   └── notFound.ts     # Unmatched endpoint handler
│   ├── services/
│   │   ├── auth.service.ts # Registration, verification, and token issuing
│   │   ├── user.service.ts # Core user operations
│   │   ├── category.service.ts # Category CRUD
│   │   ├── product.service.ts # Product logic with owner clearance checks
│   │   └── review.service.ts  # Review logic with owner clearance checks
│   ├── routes/
│   │   ├── index.ts        # Primary API Router registration aggregator
│   │   ├── auth.route.ts   # Authentication paths
│   │   ├── user.route.ts   # User paths
│   │   ├── category.route.ts # Category paths
│   │   ├── product.route.ts # Product paths
│   │   └── review.route.ts  # Review paths
│   ├── app.ts              # Core Express setup with middlewares
│   └── server.ts           # Entry point: starts the HTTP listener
└── tsconfig.json           # Compiler rules
```

---

## 🌐 API Reference

All requests must route to `/api/v1` base prefix.

### 🔐 Authentication Module (`/api/v1/auth`)

#### 1. POST `/register`
*   **Description**: Registers a new user. Passes plain text password which is safely hashed using bcrypt.
*   **Auth**: Public
*   **HTTP Status**: `201 Created` on success, `400 Bad Request` if email already exists or parameters are invalid.
*   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "strongpassword123",
      "role": "USER"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "ACTIVE",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:44:12.000Z",
        "updatedAt": "2026-08-08T14:44:12.000Z"
      }
    }
    ```

#### 2. POST `/login`
*   **Description**: Authenticates user credentials. Generates a signed JWT access token.
*   **Auth**: Public
*   **HTTP Status**: `200 OK` on success, `401 Unauthorized` if invalid email or password.
*   **Request Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "strongpassword123"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "User logged in successfully",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "USER",
          "status": "ACTIVE",
          "isDeleted": false,
          "createdAt": "2026-08-08T14:44:12.000Z",
          "updatedAt": "2026-08-08T14:44:12.000Z"
        }
      }
    }
    ```

#### 3. GET `/me`
*   **Description**: Fetches current authenticated user details.
*   **Auth**: Bearer Token
*   **HTTP Status**: `200 OK` on success, `401 Unauthorized` if token missing or invalid.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "User profile retrieved successfully",
      "data": {
        "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "ACTIVE",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:44:12.000Z",
        "updatedAt": "2026-08-08T14:44:12.000Z"
      }
    }
    ```

---

### 📂 Category Module (`/api/v1/categories`)

#### 1. POST `/`
*   **Description**: Registers a new category.
*   **Auth**: Bearer Token (ADMIN only)
*   **HTTP Status**: `201 Created` on success, `401 Unauthorized` if not authenticated, `403 Forbidden` if not ADMIN.
*   **Request Body**:
    ```json
    {
      "name": "Electronics"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Category created successfully",
      "data": {
        "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "name": "Electronics",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:48:56.000Z",
        "updatedAt": "2026-08-08T14:48:56.000Z"
      }
    }
    ```

#### 2. GET `/`
*   **Description**: Fetches all categories where `isDeleted` is false.
*   **Auth**: Public
*   **HTTP Status**: `200 OK`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Categories fetched successfully",
      "data": [
        {
          "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
          "name": "Electronics",
          "isDeleted": false,
          "createdAt": "2026-08-08T14:48:56.000Z",
          "updatedAt": "2026-08-08T14:48:56.000Z"
        }
      ]
    }
    ```

#### 3. GET `/:id`
*   **Description**: Fetches a single category by ID where `isDeleted` is false.
*   **Auth**: Public
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if deleted or missing.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Category fetched successfully",
      "data": {
        "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "name": "Electronics",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:48:56.000Z",
        "updatedAt": "2026-08-08T14:48:56.000Z"
      }
    }
    ```

#### 4. PATCH `/:id`
*   **Description**: Renames category.
*   **Auth**: Bearer Token (ADMIN only)
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if missing, `403 Forbidden` if not ADMIN.
*   **Request Body**:
    ```json
    {
      "name": "Smart Devices"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Category updated successfully",
      "data": {
        "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "name": "Smart Devices",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:48:56.000Z",
        "updatedAt": "2026-08-08T14:49:05.000Z"
      }
    }
    ```

#### 5. DELETE `/:id`
*   **Description**: Soft-deletes a category (sets `isDeleted` flag to true).
*   **Auth**: Bearer Token (ADMIN only)
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if missing or already deleted.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Category deleted successfully",
      "data": {
        "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "name": "Smart Devices",
        "isDeleted": true,
        "createdAt": "2026-08-08T14:48:56.000Z",
        "updatedAt": "2026-08-08T14:49:08.000Z"
      }
    }
    ```

---

### 📦 Product Module (`/api/v1/products`)

#### 1. POST `/`
*   **Description**: Registers a new product linked to a category. Automatically maps ownership to the logged-in user.
*   **Auth**: Bearer Token
*   **HTTP Status**: `201 Created`
*   **Request Body**:
    ```json
    {
      "title": "Bluetooth Headset",
      "price": 59.99,
      "description": "Premium noise cancelling headphones",
      "categoryId": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Product created successfully",
      "data": {
        "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "title": "Bluetooth Headset",
        "price": 59.99,
        "description": "Premium noise cancelling headphones",
        "categoryId": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "status": "ACTIVE",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:54:17.000Z",
        "updatedAt": "2026-08-08T14:54:17.000Z"
      }
    }
    ```

#### 2. GET `/`
*   **Description**: Fetches active products (`isDeleted: false`). Supports optional query filters `categoryId` and `status`. Preloads category and author profiles.
*   **Auth**: Public
*   **Query Parameters**:
    - `categoryId`: string (optional filter)
    - `status`: `PENDING` | `ACTIVE` | `INACTIVE` (optional filter)
*   **HTTP Status**: `200 OK`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Products fetched successfully",
      "data": [
        {
          "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
          "title": "Bluetooth Headset",
          "price": 59.99,
          "description": "Premium noise cancelling headphones",
          "categoryId": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
          "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "status": "ACTIVE",
          "isDeleted": false,
          "createdAt": "2026-08-08T14:54:17.000Z",
          "updatedAt": "2026-08-08T14:54:17.000Z",
          "category": {
            "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
            "name": "Smart Devices",
            "isDeleted": false,
            "createdAt": "2026-08-08T14:48:56.000Z",
            "updatedAt": "2026-08-08T14:49:05.000Z"
          },
          "user": {
            "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
    ```

#### 3. GET `/:id`
*   **Description**: Resolves single product details along with its category, author, and associated active reviews list.
*   **Auth**: Public
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if missing or soft-deleted.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Product fetched successfully",
      "data": {
        "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "title": "Bluetooth Headset",
        "price": 59.99,
        "description": "Premium noise cancelling headphones",
        "categoryId": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "status": "ACTIVE",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:54:17.000Z",
        "updatedAt": "2026-08-08T14:54:17.000Z",
        "category": {
          "id": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
          "name": "Smart Devices"
        },
        "user": {
          "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "reviews": [
          {
            "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
            "rating": 5,
            "comment": "Amazing sound quality!",
            "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
            "userId": "d98e723a-fcf1-8a9d-bca2-f472bc239dfa",
            "isDeleted": false,
            "createdAt": "2026-08-08T15:00:41.000Z",
            "updatedAt": "2026-08-08T15:00:41.000Z"
          }
        ]
      }
    }
    ```

#### 4. PATCH `/:id`
*   **Description**: Updates product details. Enforces **Creator/Admin authorization**.
*   **Auth**: Bearer Token
*   **HTTP Status**: `200 OK` on success, `403 Forbidden` if unauthorized.
*   **Request Body**:
    ```json
    {
      "price": 49.99,
      "status": "INACTIVE"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Product updated successfully",
      "data": {
        "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "title": "Bluetooth Headset",
        "price": 49.99,
        "description": "Premium noise cancelling headphones",
        "categoryId": "f5b82c61-0429-4d6d-88f5-46aa1d6e159a",
        "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "status": "INACTIVE",
        "isDeleted": false,
        "createdAt": "2026-08-08T14:54:17.000Z",
        "updatedAt": "2026-08-08T14:54:24.000Z"
      }
    }
    ```

#### 5. DELETE `/:id`
*   **Description**: Soft-deletes a product. Enforces **Creator/Admin authorization**.
*   **Auth**: Bearer Token
*   **HTTP Status**: `200 OK` on success, `403 Forbidden` if unauthorized.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Product deleted successfully",
      "data": {
        "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "isDeleted": true,
        "createdAt": "2026-08-08T14:54:17.000Z",
        "updatedAt": "2026-08-08T14:54:27.000Z"
      }
    }
    ```

---

### 💬 Review Module (`/api/v1/reviews`)

#### 1. POST `/`
*   **Description**: Submits a product review. Checks that the product exists and is active (`isDeleted: false`).
*   **Auth**: Bearer Token
*   **HTTP Status**: `201 Created` on success, `400 Bad Request` if product is missing/deleted.
*   **Request Body**:
    ```json
    {
      "rating": 5,
      "comment": "Amazing sound quality!",
      "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Review created successfully",
      "data": {
        "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
        "rating": 5,
        "comment": "Amazing sound quality!",
        "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "isDeleted": false,
        "createdAt": "2026-08-08T15:00:41.000Z",
        "updatedAt": "2026-08-08T15:00:41.000Z"
      }
    }
    ```

#### 2. GET `/`
*   **Description**: Fetches all active reviews (`isDeleted: false`). Preloads product and reviewer profiles.
*   **Auth**: Public
*   **HTTP Status**: `200 OK`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Reviews fetched successfully",
      "data": [
        {
          "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
          "rating": 5,
          "comment": "Amazing sound quality!",
          "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
          "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "isDeleted": false,
          "product": {
            "id": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
            "title": "Bluetooth Headset",
            "price": 49.99
          },
          "user": {
            "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
    ```

#### 3. GET `/product/:productId`
*   **Description**: Retrieves active reviews for a target product ID, including the review author information.
*   **Auth**: Public
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if product is missing or deleted.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Product reviews fetched successfully",
      "data": [
        {
          "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
          "rating": 5,
          "comment": "Amazing sound quality!",
          "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
          "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "isDeleted": false,
          "user": {
            "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
    ```

#### 4. PATCH `/:id`
*   **Description**: Modifies review metrics. Enforces **Creator/Admin checks**.
*   **Auth**: Bearer Token
*   **HTTP Status**: `200 OK` on success, `403 Forbidden` if unauthorized.
*   **Request Body**:
    ```json
    {
      "rating": 4,
      "comment": "Good sound, but battery could be better."
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Review updated successfully",
      "data": {
        "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
        "rating": 4,
        "comment": "Good sound, but battery could be better.",
        "productId": "e8a94b8e-dcf1-455c-bc3c-f4b638a16ddf",
        "userId": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "isDeleted": false,
        "createdAt": "2026-08-08T15:00:41.000Z",
        "updatedAt": "2026-08-08T15:01:00.000Z"
      }
    }
    ```

#### 5. DELETE `/:id`
*   **Description**: Soft-deletes review. Enforces **Creator/Admin checks**.
*   **Auth**: Bearer Token
*   **HTTP Status**: `200 OK` on success, `403 Forbidden` if unauthorized.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Review deleted successfully",
      "data": {
        "id": "c7a8b92d-9b8e-49b8-8fa1-cc34f59c8bde",
        "isDeleted": true,
        "createdAt": "2026-08-08T15:00:41.000Z",
        "updatedAt": "2026-08-08T15:01:02.000Z"
      }
    }
    ```

---

### 👤 User Module (`/api/v1/users`)

#### 1. GET `/`
*   **Description**: Retrieves list of users (primarily for administrative utility).
*   **Auth**: Public
*   **HTTP Status**: `200 OK`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Users fetched successfully",
      "data": [
        {
          "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "USER",
          "status": "ACTIVE",
          "isDeleted": false
        }
      ]
    }
    ```

#### 2. GET `/:id`
*   **Description**: Retrieves user profile by ID.
*   **Auth**: Public
*   **HTTP Status**: `200 OK` on success, `404 Not Found` if missing.
*   **Response**:
    ```json
    {
      "success": true,
      "message": "User fetched successfully",
      "data": {
        "id": "a8c9b31d-d9b8-4e89-9a2c-df643328e1cc",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "status": "ACTIVE",
        "isDeleted": false
      }
    }
    ```

---

## 🛑 Global Error Response Format

Any operational error (400, 401, 403, 404, 500) will yield a standardized response payload:
```json
{
  "success": false,
  "message": "Error description message details.",
  "errorDetails": {
    "name": "ErrorName",
    "statusCode": 403
  }
}
```
If requesting a non-existent API route, the system yields a `404 Not Found` response:
```json
{
  "success": false,
  "message": "API Endpoint Not Found!"
}
```

---

## ☁️ Deployment Instructions

### Deploying to Render
1.  **Create Web Service**: Connect your GitHub repository to Render and choose the **Web Service** environment.
2.  **Environment Settings**:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
3.  **Environment Variables**:
    Under the service configuration dashboard, add all required environment variables:
    *   `PORT`
    *   `DATABASE_URL` (Provide your production hosted PostgreSQL connection URI)
    *   `JWT_SECRET`
    *   `JWT_EXPIRES_IN`
    *   `BCRYPT_SALT_ROUNDS`
4.  **Database Migration**: Add a post-build or start step inside your setup dashboard or run database migration commands manually from your migration console prior to launching: `npx prisma migrate deploy`.

### Deploying to Vercel
Vercel serverless environments execute using Node.js lambdas.
1.  **Configure vercel.json**: Add a `vercel.json` file to your project root specifying routing and entry points.
2.  **Build Configuration**: Configure your project build script to compile TypeScript to Javascript and bundle assets.
3.  **Deploy Command**: Link and deploy using the Vercel CLI: `vercel --prod`. Make sure all environment variables are mapped in your Vercel settings panel.
