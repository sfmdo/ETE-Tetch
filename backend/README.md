# API Documentation Overview

This API provides a comprehensive set of endpoints to manage users, authentication, and a catalog of products and services. It is divided into three main modules:
1. **Authentication Module:** Handles public registration and login, issuing JWT tokens for secure access.
2. **User Profile Module:** Allows authenticated users to view and update their own contact information.
3. **Product & Service Management:** Manages the catalog of items, handling automated tax and price calculations, inventory tracking, and differentiation between products and services.

Security is enforced via JSON Web Tokens (JWT). Public endpoints do not require a token, while protected endpoints require the token to be passed in the `Authorization` header.

---

## 1. Authentication Module

### Security Notice
Endpoints in this module are **Public**. They are the entry points to the system and are responsible for issuing the JWT tokens required for the rest of the API.

### 1.1. Register User
Creates a new user in the system. Passwords are automatically hashed using bcrypt before saving.

* **Endpoint:** `POST /api/auth/register`
* **Access:** Public

**Request Body:**
```json
{
  "Full_Name": "Juan Perez",
  "Email": "juan@example.com",
  "Password": "securepassword123",
  "Phone": "3312345678",
  "Role": "User", 
  "Status": 1
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": 5
}
```

**Response (409 Conflict):**
```json
{
  "message": "Email is already registered"
}
```

### 1.2. Login
Authenticates a user and issues a JSON Web Token (JWT) valid for 2 hours.

* **Endpoint:** `POST /api/auth/login`
* **Access:** Public

**Request Body:**
```json
{
  "Email": "juan@example.com",
  "Password": "securepassword123"
}
```

**Response (200 OK):**
*(Note: Password is never returned in the payload for security reasons).*
```json
{
  "message": "Login successful",
  "user": {
    "User_ID": 5,
    "Full_Name": "Juan Perez",
    "Email": "juan@example.com",
    "Phone": "3312345678",
    "Role": "User",
    "Status": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

## 2. User Profile Module

### Security Notice
Access to these endpoints requires a valid JWT Token sent in the `Authorization: Bearer <token>` header. The system identifies the user directly from the token, preventing unauthorized access to other users' profiles.

### 2.1. Get Logged-In Profile
Retrieves the contact information and status of the currently authenticated user.

* **Endpoint:** `GET /api/users/profile`
* **Access:** Authenticated (Admin, User)

**Response (200 OK):**
```json
{
  "User_ID": 5,
  "Full_Name": "Juan Perez",
  "Email": "juan@example.com",
  "Phone": "3312345678",
  "Role": "User",
  "Status": 1
}
```

### 2.2. Update Profile Contact Info
Updates the current user's contact details. To maintain system integrity, only `Full_Name` and `Phone` can be modified through this endpoint.

* **Endpoint:** `PATCH /api/users/profile`
* **Access:** Authenticated (Admin, User)

**Request Body:**
```json
{
  "Full_Name": "Juan Perez Hernandez",
  "Phone": "3399887766"
}
```

**Response (200 OK):**
*(Returns the freshly updated user object so the frontend can instantly update the UI).*
```json
{
  "message": "Profile updated successfully",
  "user": {
    "User_ID": 5,
    "Full_Name": "Juan Perez Hernandez",
    "Email": "juan@example.com",
    "Phone": "3399887766",
    "Role": "User",
    "Status": 1
  }
}
```

---

## 3. Product & Service Management

### Security Notice
Access to these endpoints is restricted to authenticated users with Admin or User roles. All requests require authentication via a Bearer token (JWT).

### Data Schema & Logic

**Accounting Logic**
To ensure financial integrity, the system handles the following key fields:
* **Cost_Price:** Base cost for the company.
* **Tax_Rate:** Applied tax rate (Enum: 0.16).
* **Final_Price:** Read-only. Automatically calculated as `Sale_Price * (1 + Tax_Rate)`. The system recalculates this value if either the price or the tax rate is updated.
* **Item_Type:** This field only can be `SERVICE` or `PRODUCT`.

**Inventory Fields**
* **Current_Stock:** Current physical quantity (Use 0 for services).
* **Minimum_Stock:** Safety stock threshold (Use 0 for services).

### 3.1. List Records
Retrieves items from the catalog.

* **Endpoints:** 
  * `GET /api/products/all` — Retrieves all records.
  * `GET /api/products/only-products` — Filters by `Item_Type: PRODUCT`.
  * `GET /api/products/only-services` — Filters by `Item_Type: SERVICE`.
* **Access:** Authenticated (Admin, User)

**Response (200 OK):**
```json
[
  {
    "Product_ID": 1,
    "SKU_Code": "COMP-001",
    "Name": "Wireless Mouse",
    "Description": "Ergonomic 2.4GHz mouse",
    "Category": "Peripherals",
    "Item_Type": "PRODUCT",
    "Cost_Price": 10.00,
    "Sale_Price": 20.00,
    "Tax_Rate": 0.16,
    "Final_Price": 23.20,
    "Current_Stock": 50,
    "Minimum_Stock": 10,
    "Status": 1,
    "Image": "https://link-to-image.com/mouse.jpg"
  }
]
```

### 3.2. Create Product / Service
Registers a new entry. The `Final_Price` is automatically calculated by the server.

* **Endpoint:** `POST /api/products/`
* **Access:** Authenticated (Admin, User)

**Request Body:**
```json
{
  "SKU_Code": "SRV-MAINT-01",
  "Name": "Monthly Server Maintenance",
  "Description": "Full server checkup and updates",
  "Category": "IT Support",
  "Item_Type": "SERVICE",
  "Cost_Price": 50.00,
  "Sale_Price": 100.00,
  "Tax_Rate": 0.16,
  "Current_Stock": 0,
  "Minimum_Stock": 0,
  "Status": 1,
  "Image": "base64_string_here"
}
```

**Response (201 Created):**
```json
{
  "message": "Record created",
  "id": 25
}
```

### 3.3. Update Product / Service
Updates an existing record. If `Sale_Price` or `Tax_Rate` are included in the request, the system automatically updates the `Final_Price`.

* **Endpoint:** `PUT /api/products/:id`
* **Access:** Authenticated (Admin, User)

**Example Request (Price Update):**
```json
{
  "Sale_Price": 150.00,
  "Current_Stock": 10
}
```

**Response (200 OK):**
```json
{
  "message": "Product updated and prices recalculated"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Product not found for update"
}
```

### 3.4. Delete Record (Hard Delete)
Permanently removes the record from the database.

* **Endpoint:** `DELETE /api/products/:id`
* **Access:** Authenticated (Admin, User)

**Response (200 OK):**
```json
{
  "message": "Record deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Record does not exist"
}
```

---

## Error Handling Summary

| Status Code | Error Message (JSON) | Cause |
| :--- | :--- | :--- |
| **400 Bad Request** | `{"message": "Missing required fields"}` | Missing necessary fields for creation or update. |
| **400 Bad Request** | `{"error": "Error: Duplicate entry 'SKU001'..."}` | The SKU_Code already exists in the database. |
| **401 Unauthorized** | `{"message": "Access denied. No token provided."}` | Token is missing or improperly formatted. |
| **403 Forbidden** | `{"message": "Invalid or expired token."}` | Token is mathematically invalid or has passed its expiration time. |
| **404 Not Found** | `{"message": "Record does not exist"}` | The ID provided in the URL does not match any record. |
| **500 Internal Error**| `{"message": "Internal server error"}` | Server-side error (e.g., Database connection lost). |