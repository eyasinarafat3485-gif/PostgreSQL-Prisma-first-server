# 🚀 SCIC / EJP-13 E-Commerce Backend REST API Documentation

Production-ready, scalable RESTful API built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 📌 Base URL
`http://localhost:5000/api` (Local Development)

---

## 🔒 Authentication & Headers
Protected endpoints require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📑 Consistent API Response Schema

All API responses strictly adhere to the standardized JSON payload envelope format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error details or validation message",
  "error": "Error details"
}
```

---

## 🔑 1. Auth Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Description**: Creates a new user account with hashed password.

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "USER"
}
```

#### Response (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "c33691af-19a9-4000-95c7-2c5176e19b2d",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2026-08-08T14:00:00.000Z"
  }
}
```

---

### 1.2 Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Description**: Authenticates user and returns JWT token.

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c33691af-19a9-4000-95c7-2c5176e19b2d",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

---

## 👤 2. User Endpoints (`/api/users`)

### 2.1 Get All Users
- **Method**: `GET`
- **Endpoint**: `/api/users`
- **Access**: Private (Admin)

### 2.2 Get User by ID
- **Method**: `GET`
- **Endpoint**: `/api/users/:id`
- **Access**: Private

---

## 📁 3. Category Endpoints (`/api/categories`)

### 3.1 Get All Categories
- **Method**: `GET`
- **Endpoint**: `/api/categories`
- **Access**: Public
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    { "id": "cat-1", "name": "Electronics" },
    { "id": "cat-2", "name": "Fashion" }
  ]
}
```

### 3.2 Create Category
- **Method**: `POST`
- **Endpoint**: `/api/categories`
- **Access**: Private (Admin)

---

## 📦 4. Product Endpoints (`/api/products`)

### 4.1 Get All Products
- **Method**: `GET`
- **Endpoint**: `/api/products`
- **Query Parameters**:
  - `categoryId` (optional): Filter by category ID
  - `status` (optional): Filter by `ACTIVE` / `PENDING` / `INACTIVE`
- **Access**: Public

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "prod-101",
      "title": "Samsung Galaxy S24 Ultra 5G",
      "price": 1299.99,
      "description": "200MP Quad Telephoto Camera",
      "imageUrl": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80",
      "status": "ACTIVE",
      "categoryId": "cat-1",
      "userId": "usr-1",
      "category": { "id": "cat-1", "name": "Electronics" },
      "user": { "id": "usr-1", "name": "Admin Seller", "email": "admin@example.com" }
    }
  ]
}
```

---

### 4.2 Create Product
- **Method**: `POST`
- **Endpoint**: `/api/products`
- **Access**: Private (Authenticated User / Admin)

#### Request Body:
```json
{
  "title": "Classic Oxford Cotton Shirt",
  "price": 36.99,
  "description": "A timeless regular-fit Oxford shirt made from breathable cotton fabric.",
  "imageUrl": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80",
  "categoryId": "cat-2",
  "status": "ACTIVE"
}
```

---

### 4.3 Update Product
- **Method**: `PUT`
- **Endpoint**: `/api/products/:id`
- **Access**: Private (Product Creator / Admin)

---

### 4.4 Delete Product
- **Method**: `DELETE`
- **Endpoint**: `/api/products/:id`
- **Access**: Private (Product Creator / Admin)

---

## ⭐ 5. Review Endpoints (`/api/reviews`)

### 5.1 Create Review
- **Method**: `POST`
- **Endpoint**: `/api/reviews`
- **Access**: Private (Authenticated User)

#### Request Body:
```json
{
  "productId": "prod-101",
  "rating": 5,
  "comment": "Outstanding smartphone quality!"
}
```

---

## 🛠️ Error Status Codes Summary

| Status Code | Description |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource successfully created |
| `400 Bad Request` | Missing parameters or invalid body format |
| `401 Unauthorized` | Missing or invalid Bearer JWT token |
| `403 Forbidden` | User lacks Admin / Ownership permissions |
| `404 Not Found` | Requested item or route does not exist |
| `500 Server Error` | Unhandled server or database error |
