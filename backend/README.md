# Product & Service Management API Documentation

## Security Notice
Access to these endpoints is restricted to users with **Inventory** permissions. All requests require authentication via a token (JWT).

> **Note:** The security layer is currently being implemented. JWT and Login requirements will be enforced once the authentication module is finalized.

---

## Data Schema & Logic

### Accounting Logic
To ensure financial integrity, the system handles the following key fields:
*   **`Cost_Price`**: Base cost for the company.
*   **`Tax_Rate`**: Applied tax rate (Enum: `0.16`).
*   **`Final_Price`**: **Read-only**. Automatically calculated as `Sale_Price * (1 + Tax_Rate)`. The system recalculates this value if either the price or the tax rate is updated.
*   **`ITEM_TYPE`**:This ield only can be SERVICE or PRODUCT
### Inventory Fields
*   **`Current_Stock`**: Current physical quantity (Use `0` for services).
*   **`Minimum_Stock`**: Safety stock threshold (Use `0` for services).

---

## 1. List Records
Retrieves items from the catalog.

*   **Endpoints:** 
    *   `GET /api/products/all` — Retrieves all records.
    *   `GET /api/products/only-products` — Filters by `Item_Type: PRODUCT`.
    *   `GET /api/products/only-services` — Filters by `Item_Type: SERVICE`.
*   **Access:** Authenticated

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

---

## 2. Create Product / Service
Registers a new entry. The `Final_Price` is automatically calculated by the server.

*   **Endpoint:** `POST /api/products/`
*   **Access:** Authenticated (Inventory Permissions)

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

---

## 3. Update Product / Service
Updates an existing record. If `Sale_Price` or `Tax_Rate` are included in the request, the system automatically updates the `Final_Price`.

*   **Endpoint:** `PUT /api/products/:id`
*   **Access:** Authenticated (Inventory Permissions)

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

---

## 4. Delete Record (Hard Delete)
Permanently removes the record from the database.

*   **Endpoint:** `DELETE /api/products/:id`
*   **Access:** Authenticated (Inventory Permissions)

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
| **400 Bad Request** | `{"error": "Error: Duplicate entry 'SKU001'..."}` | The `SKU_Code` already exists in the database. |
| **400 Bad Request** | `{"error": "..."}` | Missing required fields or invalid `Item_Type` enum. |
| **404 Not Found** | `{"message": "Record does not exist"}` | The ID provided in the URL does not match any record. |
| **500 Internal Error** | `{"error": "..."}` | Server-side error (e.g., Database connection lost or type mismatch). |

### Implementation Details:
1.  **Images**: The system accepts both external URLs and Base64 strings.
2.  **Price Precision**: All prices are stored as decimals and rounded to 2 decimal places during calculation.
3.  **Services**: While the schema requires `Current_Stock` and `Minimum_Stock`, these should be set to `0` for items of type `SERVICE`.