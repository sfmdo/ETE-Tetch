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

Here is the specification formatted cleanly in Markdown:


# 4. Service Order Management

## Security Notice
Access to these endpoints is restricted to authenticated users (Admin, Technicians/Users). All requests require authentication via a Bearer token (JWT).

## Logistics Workflow and Statuses
The system tracks the lifecycle of a service through the `Logistics_Status` (Enum):

*   **PENDING:** Initial state. Equipment received, pending diagnosis.
*   **IN_PROGRESS:** Technician is currently working on the equipment.
*   **COMPLETED:** Work finished. Diagnosis and solution registered. Ready for pickup. (If the balance is already $0, it will bypass this and go directly to PAID).
*   **PAID:** Financial balance is zeroed AND the technical work is finished. The process is fully closed.

---

## Endpoints API

### 4.1. Get All Orders (Dashboard)
Retrieves a complete list of all service orders for management and tracking.

*   **Endpoint:** `GET /api/orders/`
*   **Access:** Authenticated (Admin, User)
*   **Response (200 OK):**

```json
[
  {
  "Applied_Solution": null
  "Brand_Model": "Huawei P20"
  "Client_ID": 1
  "Client_Name": "Santiago"
  "Creation_Date": "2026-04-28T01:40:10.000Z"
  "Final_Diagnosis": null
  "Logistics_Status": "COMPLETED"
  "Order_ID": 4
  "Order_Number": "ORD-1777340410406"
  "Order_Total": "185.60"
  "Pending_Balance": "185.60"
  "Reported_Fault": "No prende"
  "Technician_ID": null
  "Technician_Name": null
  }
]
```

### 4.2. Get Order by ID (Basic)
Retrieves the header information of a specific order.

*   **Endpoint:** `GET /api/orders/:id`
*   **Access:** Authenticated (Admin, User)
*   **Response (200 OK):** Returns the `IOrder` object (excluding item details).

### 4.3. Get Full Order Details (Deep View)
Retrieves the order header and an array of all associated products/services with their descriptive names.

*   **Endpoint:** `GET /api/orders/:id/full`
*   **Access:** Authenticated (Admin, User)
*   **Logic:** Performs a JOIN with the PRODUCTS table to resolve item names.
*   **Response (200 OK):**

```json
{
  "Order_ID": 3,
  "Order_Number": "ORD-1777319799559",
  "Client_ID": 1,
  "Client_Name": "Client",
  "Technician_ID": 1,
  "Technician_Name": "Technician",
  "Brand_Model": "Google hhjhjhf",
  "Reported_Fault": "ojoh",
  "Final_Diagnosis": "El pepe",
  "Applied_Solution": "sda",
  "Logistics_Status": "IN_PROGRESS",
  "Order_Total": 1229.60,
  "Pending_Balance": 1229.60,
  "Creation_Date": "2026-04-27T13:56:39.000Z",
  "Items": [
    {
      "Product_ID": 2,
      "Product_Name": "Mantenimiento de computadora",
      "Quantity": 1,
      "Unit_Price": 185.60,
      "Product_Type": "SERVICE",
      "Line_Subtotal": 185.60
    }
  ]
}
```

### 4.4. Create Initial Order (Reception)
Registers equipment and base service. Generates `Order_Number` automatically.

*   **Endpoint:** `POST /api/orders/`
*   **Request Body:** 
```json
{ 
  "Client_ID": 10, 
  "Service_ID": 5, 
  "Brand_Model": "...", 
  "Reported_Fault": "..." 
}
```

### 4.5. Add Items/Parts to Order
Adds extra parts/services. Updates total and deducts inventory.

*   **Endpoint:** `POST /api/orders/add-items`
*   **Request Body:** 
```json
{ 
  "Order_ID": 101, 
  "items": [
    { "Product_ID": 12, "Quantity": 1 }
  ] 
}
```

### 4.6. Register Technical Diagnosis
Final report or partial reports.

*   **Endpoint:** `PUT /api/orders/:id/diagnosis`
*   **Request Body:** 
```json
{ 
  "Technician_ID": 2, 
  "Final_Diagnosis": "...", 
  "Applied_Solution": "..." 
}
```
*Note: If the requested status is COMPLETED but the order has a Pending_Balance of $0, the database will automatically override the request and set it to PAID.*

### 4.7. Update Logistics Status
Manual override for the order's state.

*   **Endpoint:** `PATCH /api/orders/:id/status`
*   **Request Body:** 
```json
{ 
  "status": "IN_PROGRESS" 
}
```

### 4.8. Register Payment (Abono/Cobro)
Registers a partial or full payment. Deducts the amount from the `Pending_Balance` directly in the database. If the new balance reaches 0 and the order was already `COMPLETED`, it automatically closes the order by changing the status to `PAID`.

* **Endpoint:** `POST /api/orders/:id/pay`
* **Access:** Authenticated (Admin, User)
* **Request Body:** ```json
{ 
  "amount": 185.60 
}

**Response (200 OK)**:
```
{
  "message": "Pago registrado correctamente."
}
```
### 4.9. Get Client Orders (History)

Retrieves a complete list of all service orders associated with a specific client. This endpoint is designed for the client portal dashboard.

* **Endpoint:** `GET /api/orders/client/:clientId`

* **Access:** Authenticated (Admin, Client - Clients should only be able to query their own ID)

**Response (200 OK):**
```json
[
  {
    "Order_ID": 4,
    "Order_Number": "ORD-1777340410406",
    "Client_ID": 1,
    "Client_Name": "Santiago",
    "Technician_ID": 2,
    "Technician_Name": "Technician Name",
    "Brand_Model": "Huawei P20",
    "Reported_Fault": "No prende",
    "Final_Diagnosis": "Batería inflada",
    "Applied_Solution": "Reemplazo de batería",
    "Logistics_Status": "PAID",
    "Order_Total": "185.60",
    "Pending_Balance": "0.00",
    "Creation_Date": "2026-04-28T01:40:10.000Z"
  },
  {
    "Order_ID": 7,
    "Order_Number": "ORD-1777351234567",
    "Client_ID": 1,
    "Client_Name": "Santiago",
    "Technician_ID": null,
    "Technician_Name": null,
    "Brand_Model": "Dell XPS 13",
    "Reported_Fault": "Pantalla rota",
    "Final_Diagnosis": null,
    "Applied_Solution": null,
    "Logistics_Status": "PENDING",
    "Order_Total": "0.00",
    "Pending_Balance": "0.00",
    "Creation_Date": "2026-04-30T10:15:00.000Z"
  }
]
```

---

## Order Module Error Handling

| Status Code | Error Message (JSON) | Cause |
| :--- | :--- | :--- |
| 400 Bad Request | {"message": "Brand, Model, Description... are required"} | Missing mandatory fields in initial reception. |
| 400 Bad Request | {"error": "Insufficient stock for: [Name]"} | Attempted to add a product that exceeds current inventory. |
| 400 Bad Request | {"error": "Cannot add products to an already paid order"} | Business logic violation: Order is already closed. |
| 400 Bad Request | {"message": "El monto del pago debe ser mayor a 0."} | Attempted to register a negative or zero payment amount in the `/pay` endpoint. |
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