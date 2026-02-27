# API Documentation - ST-Inventory

This document describes the API endpoints available in the ST-Inventory system.

## Base URL
`http://localhost:5000/api`

---

## 1. Authentication (`/auth`)

### 1.1 Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate a user and return a token.
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Expected Result:**
  - `200 OK`: Returns user object with `token`.
  - `401 Unauthorized`: Invalid credentials.

### 1.2 Register
- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user.
- **Request Body:**
```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "member" // optional (default: member)
}
```
- **Expected Result:**
  - `201 Created`: Returns the newly created user object.
  - `400 Bad Request`: User already exists or invalid data.

---

## 2. Products (`/products`)

### 2.1 Get All Products
- **Endpoint:** `GET /products`
- **Description:** Retrieve a list of all products.
- **Expected Result:**
  - `200 OK`: Array of product objects.

### 2.2 Create Product
- **Endpoint:** `POST /products`
- **Description:** Add a new product to the inventory.
- **Request Body:**
```json
{
  "name": "Product Name",
  "price": 100,
  "stock": 50,
  "category": "Electronics",
  "image": "url_string" // optional
}
```
- **Expected Result:**
  - `201 Created`: Returns the created product.
  - `400 Bad Request`: Validation error.

### 2.3 Update Product
- **Endpoint:** `PUT /products/:id`
- **Description:** Update an existing product.
- **Request Body:** Fields to update (e.g., `price`, `stock`).
- **Expected Result:**
  - `200 OK`: Returns the updated product.
  - `404 Not Found`: Product ID doesn't exist.

### 2.4 Delete Product
- **Endpoint:** `DELETE /products/:id`
- **Description:** Remove a product from the inventory.
- **Expected Result:**
  - `200 OK`: Success message.
  - `404 Not Found`: Product ID doesn't exist.

---

## 3. Orders (`/orders`)

### 3.1 Get All Orders
- **Endpoint:** `GET /orders`
- **Description:** Retrieve a list of all orders.
- **Expected Result:**
  - `200 OK`: Array of order objects with populated user and payment info.

### 3.2 Get Order by ID
- **Endpoint:** `GET /orders/:id`
- **Description:** Retrieve detailed information for a specific order.
- **Expected Result:**
  - `200 OK`: Order object with nested `items` (orderDetails).
  - `404 Not Found`: Order ID doesn't exist.

### 3.3 Create Order
- **Endpoint:** `POST /orders`
- **Description:** Place a new order.
- **Request Body:**
```json
{
  "orderId": "ORD-12345",
  "user": "user_id",
  "customer": "Customer Name",
  "amount": 500,
  "status": "pending",
  "paymentMethod": "qr" | "card" | "cod",
  "items": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 250,
      "quantity": 2
    }
  ]
}
```
- **Expected Result:**
  - `201 Created`: Returns the created order with payment details.

### 3.4 Update Order
- **Endpoint:** `PUT /orders/:id`
- **Description:** Update order status or details.
- **Expected Result:**
  - `200 OK`: Returns updated order.

### 3.5 Delete Order
- **Endpoint:** `DELETE /orders/:id`
- **Description:** Remove an order and its associated details/payments.
- **Expected Result:**
  - `200 OK`: Success message.

---

## 4. Users (`/users`)

### 4.1 Get All Users
- **Endpoint:** `GET /users`
- **Description:** Retrieve a list of all users.
- **Expected Result:**
  - `200 OK`: Array of user objects.

### 4.2 Create User
- **Endpoint:** `POST /users`
- **Description:** Create a new user (Admin function).
- **Request Body:** Similar to Register.
- **Expected Result:**
  - `201 Created`: Returns the created user.

### 4.3 Update User
- **Endpoint:** `PUT /users/:id`
- **Description:** Update user role, status, or info.
- **Expected Result:**
  - `200 OK`: Returns updated user.

### 4.4 Delete User
- **Endpoint:** `DELETE /users/:id`
- **Description:** Remove a user.
- **Expected Result:**
  - `200 OK`: Success message.
