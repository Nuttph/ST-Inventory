# Test Cases (Equivalence Partitioning) - ST-Inventory

This document contains comprehensive test cases categorized by module using Equivalence Partitioning (EP) and Boundary Value Analysis (BVA).

## 1. Authentication Module (`/auth`)

| ID | Test Scenario | Equivalence Class | Input | Expected Result |
|---|---|---|---|---|
| TC-AUTH-01 | Valid Login | Valid Email & Password | `email: "admin@st.com", pass: "123456"` | `200 OK`, JWT Token returned |
| TC-AUTH-02 | Invalid Email | Email not found in DB | `email: "wrong@test.com", pass: "123"` | `401 Unauthorized` |
| TC-AUTH-03 | Wrong Password | Correct Email, Wrong Password | `email: "admin@st.com", pass: "wrong"` | `401 Unauthorized` |
| TC-AUTH-04 | Register Existing User | Email already exists | `email: "admin@st.com"` | `400 Bad Request`, "User already exists" |
| TC-AUTH-05 | Register Missing Fields | Missing `name` or `email` | `{password: "123"}` | `400 Bad Request`, Error message |

## 2. Product Management Module (`/products`)

| ID | Test Scenario | Equivalence Class | Input | Expected Result |
|---|---|---|---|---|
| TC-PROD-01 | Create Valid Product | All valid fields | `{name: "CPU", price: 5000, stock: 10, category: "IT"}` | `201 Created` |
| TC-PROD-02 | Price at Boundary (Min) | Price = 0 | `{price: 0}` | `201 Created` (or 400 if logic forbids) |
| TC-PROD-03 | Negative Price | Price < 0 | `{price: -100}` | `400 Bad Request` |
| TC-PROD-04 | Missing Required Field | No `name` provided | `{price: 100, stock: 1}` | `400 Bad Request` |
| TC-PROD-05 | Update Non-existent ID | Invalid ID format or not found | `ID: "non-existent"` | `404 Not Found` |

## 3. Order & Stock Integration Module (`/orders`)

*Note: Create Order now automatically decrements Product Stock.*

| ID | Test Scenario | Equivalence Class | Input | Expected Result |
|---|---|---|---|---|
| TC-ORD-01 | Successful Order | Stock > Quantity | `items: [{_id: "P1", quantity: 2}]` (Stock: 10) | `201 Created`, Stock becomes 8 |
| TC-ORD-02 | Exact Stock Order | Stock = Quantity | `items: [{_id: "P1", quantity: 10}]` (Stock: 10) | `201 Created`, Stock becomes 0 |
| TC-ORD-03 | Out of Stock Order | Stock < Quantity | `items: [{_id: "P1", quantity: 15}]` (Stock: 10) | `400 Bad Request`, "Insufficient stock" |
| TC-ORD-04 | Product Not Found | Invalid Product ID in items | `items: [{_id: "invalid_id"}]` | `400 Bad Request`, "Product not found" |
| TC-ORD-05 | Multiple Items Order | Multiple valid products | `items: [P1, P2]` | `201 Created`, Both stocks reduced |

## 4. User Management Module (`/users`)

| ID | Test Scenario | Equivalence Class | Input | Expected Result |
|---|---|---|---|---|
| TC-USER-01 | Fetch All Users | N/A | `GET /users` | `200 OK`, Array of users |
| TC-USER-02 | Update User Role | Valid role (admin/member) | `{role: "admin"}` | `200 OK`, Role updated |
| TC-USER-03 | Delete Admin User | Existing Admin ID | `DELETE /users/:id` | `200 OK`, "User removed" |
| TC-USER-04 | Update Status | Valid status enum | `{status: "inactive"}` | `200 OK`, Status updated |

---

## Summary of Testing Methods Used:
1. **Positive Testing**: TC-AUTH-01, TC-PROD-01, TC-ORD-01
2. **Negative Testing**: TC-AUTH-02, TC-PROD-03, TC-ORD-03
3. **Equivalence Partitioning**: Grouping inputs like "Valid Price" vs "Negative Price".
4. **Integration Testing**: TC-ORD-01 (Verifies connection between Order and Product Stock).
