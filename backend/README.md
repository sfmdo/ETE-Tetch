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

# 4. Service Order Management

### Security Notice
Access to these endpoints is restricted to authenticated users (Admin, Technicians/Users). All requests require authentication via a Bearer token (JWT).

---

## Data Schema and Logistics Logic

### Logistics Workflow and Statuses
The system tracks the lifecycle of a service through the Logistics_Status (Enum):

*   **PENDING**: Initial state. Equipment is received but not yet diagnosed.
*   **IN_PROGRESS**: Technician is currently working on the equipment.
*   **COMPLETED**: Work is finished. Diagnosis and solution are registered. Ready for pickup/payment.
*   **PAID**: Financial balance is zeroed, and the process is closed.

### Calculation Logic
*   **Atomic Transactions**: All operations (creating orders or adding items) use SQL transactions. If any step fails (e.g., insufficient stock), the entire process is rolled back to ensure data integrity.
*   **Order_Total**: Sum of the base service cost plus all subsequently added parts/items.
*   **Pending_Balance**: Amount remaining to be paid. Initially matches the Order_Total.

---

## Endpoints API

### 4.1. Create Initial Order (Reception)
Registers the equipment and the base service requested by the client. Generates a unique Order_Number automatically.

*   **Endpoint**: POST /api/orders/
*   **Access**: Authenticated (Admin, User)
*   **Requirement**: RF2.3 (Mandatory capture of Brand, Model, and Fault).

**Request Body:**
```json
{
  "Client_ID": 10,
  "Service_ID": 5,
  "Brand_Model": "Samsung Galaxy S23",
  "Reported_Fault": "Cracked screen and touch not responding"
}
```

**Response (201 Created):**
```json
{
  "message": "Order initiated successfully",
  "summary": {
    "orderId": 101,
    "orderNumber": "ORD-1713824561000",
    "brandModel": "Samsung Galaxy S23",
    "baseCost": 150.00
  }
}
```

---

### 4.2. Add Items/Parts to Order
Allows adding extra parts or services to an active order. It automatically updates the total cost and deducts inventory for physical products.

*   **Endpoint**: POST /api/orders/add-items
*   **Access**: Authenticated (Admin, User)
*   **Requirement**: RF4.4 & RF4.5 (Stock deduction and cost auto-update).

**Request Body:**
```json
{
  "Order_ID": 101,
  "items": [
    { "Product_ID": 12, "Quantity": 1 },
    { "Product_ID": 45, "Quantity": 2 }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Items added and total updated",
  "newTotal": 285.50
}
```

---

### 4.3. Register Technical Diagnosis
Used by the technician to provide the final report of the work performed.

*   **Endpoint**: PUT /api/orders/:id/diagnosis
*   **Access**: Authenticated (Admin, User)
*   **Logic**: Upon success, the status automatically changes to COMPLETED.

**Request Body:**
```json
{
  "Technician_ID": 2,
  "Final_Diagnosis": "Damaged OLED panel due to impact",
  "Applied_Solution": "Screen assembly replacement and internal cleaning"
}
```

**Response (200 OK):**
```json
{
  "message": "Technical information updated and order marked as completed."
}
```

---

### 4.4. Update Logistics Status
Manual override for the order's progress state.

*   **Endpoint**: PATCH /api/orders/:id/status
*   **Access**: Authenticated (Admin, User)

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200 OK):**
```json
{
  "message": "Status updated to IN_PROGRESS"
}
```

---

### 4.5. Payment Processing (PENDING)
This module is currently under development.

*   **Planned Integration**: PayPal Checkout API.
*   **Planned Logic**: 
    *   Create Payment Intent based on Pending_Balance.
    *   Webhook listener to verify successful transaction.
    *   Automatic status update to PAID upon confirmation.

---

## Order Module Error Handling

| Status Code | Error Message (JSON) | Cause |
| :--- | :--- | :--- |
| 400 Bad Request | {"message": "Brand, Model, Description... are required"} | Missing mandatory fields in initial reception. |
| 400 Bad Request | {"error": "Insufficient stock for: [Name]"} | Attempted to add a product that exceeds current inventory. |
| 400 Bad Request | {"error": "Cannot add products to an already paid order"} | Business logic violation: Order is already closed. |
| 404 Not Found | {"message": "Order not found"} | The Order_ID provided does not exist. |
| 500 Internal Error | {"error": "[Database Error Details]"} | Transaction failed or database connection issue. |

# 5. Expense Management (Administrative Egress)

### Security Notice
Access to these endpoints is restricted to authenticated users with Admin roles. All requests require authentication via a Bearer token (JWT).

---

## Data Schema and Logic

### Financial Integrity
*   **Expense_ID**: Primary key, auto-incremented.
*   **Admin_Registry_ID**: Optional foreign key. Links the expense to the administrator who registered it.
*   **Amount**: Stored as decimal(10,2) to ensure precision in financial calculations.
*   **Expense_Date**: Automatically set to current_timestamp() upon creation.

---

## Endpoints API

### 5.1. List All Expenses
Retrieves the complete history of administrative expenses, ordered from newest to oldest.

*   **Endpoint**: GET /api/expenses/
*   **Access**: Authenticated (Admin)

**Response (200 OK):**
```json
[
  {
    "Expense_ID": 10,
    "Admin_Registry_ID": 1,
    "Description": "Purchase of soldering wire and flux",
    "Amount": 45.50,
    "Expense_Date": "2026-04-20T10:00:00.000Z"
  },
  {
    "Expense_ID": 9,
    "Admin_Registry_ID": null,
    "Description": "Monthly electricity bill",
    "Amount": 120.00,
    "Expense_Date": "2026-04-15T14:30:00.000Z"
  }
]
```

---

### 5.2. Create New Expense
Registers a new administrative expenditure.

*   **Endpoint**: POST /api/expenses/
*   **Access**: Authenticated (Admin)

**Request Body:**
```json
{
  "Description": "Office stationery and printer ink",
  "Amount": 85.20,
  "Admin_Registry_ID": 1
}
```

**Response (201 Created):**
```json
{
  "message": "Expense recorded successfully",
  "expenseId": 11
}
```

---

### 5.3. Get Expense Detail
Retrieves specific information about a single expenditure record.

*   **Endpoint**: GET /api/expenses/:id
*   **Access**: Authenticated (Admin)

**Response (200 OK):**
```json
{
  "Expense_ID": 11,
  "Admin_Registry_ID": 1,
  "Description": "Office stationery and printer ink",
  "Amount": 85.20,
  "Expense_Date": "2026-04-20T11:20:00.000Z"
}
```

---

### 5.4. Delete Expense Record
Permanently removes an expense record. Warning: This action cannot be undone.

*   **Endpoint**: DELETE /api/expenses/:id
*   **Access**: Authenticated (Admin)

**Response (200 OK):**
```json
{
  "message": "Expense record deleted."
}
```

---

## Expense Module Error Handling

| Status Code | Error Message (JSON) | Cause |
| :--- | :--- | :--- |
| 400 Bad Request | {"message": "Description and Amount are required."} | One or both mandatory fields are missing in the request body. |
| 401 Unauthorized | {"message": "Access denied. No token provided."} | Token is missing from the Authorization header. |
| 404 Not Found | {"message": "Expense not found."} | The provided Expense_ID does not exist in the database. |
| 500 Internal Error | {"error": "[Database Error Details]"} | Server-side failure or database connection timeout. |