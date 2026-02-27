# Frontend Test Cases - ST-Inventory

This document defines the functional test cases for the web interface, focusing on user interactions and expected UI/UX outcomes.

## 1. Authentication Module (Login & Register)

| ID | Test Scenario | User Action | Expected UI Behavior |
|---|---|---|---|
| FT-AUTH-01 | Successful Login | Enter valid email/password and click "Login" | Redirect to Dashboard, Sidebar shows user name/role |
| FT-AUTH-02 | Failed Login | Enter wrong credentials and click "Login" | Error message appears: "Invalid email or password", Fields remain filled |
| FT-AUTH-03 | Missing Input | Leave fields empty and click "Login" | Input fields show validation error (red outline or helper text) |
| FT-AUTH-04 | Successful Register | Fill all fields and click "Register" | Shows success toast/alert, Redirect to Login page |

## 2. Inventory Management Module

| ID | Test Scenario | User Action | Expected UI Behavior |
|---|---|---|---|
| FT-INV-01 | View Inventory | Navigate to Inventory page | Table displays all products fetched from API with correct stock status colors |
| FT-INV-02 | Open Add Product | Click "Add New Product" button | Dialog pops up with empty fields |
| FT-INV-03 | Save New Product | Fill form and click "Add Product" | Dialog closes, Table refreshes with new item, Success message displayed |
| FT-INV-04 | Edit Existing Product| Click "Edit" on a product row | Dialog pops up with current product data pre-filled |
| FT-INV-05 | Confirm Delete | Click "Delete" and confirm in browser popup | Row is removed from the table immediately, Statistics cards update |
| FT-INV-06 | Restock Action | Click "Restock", enter "5", click "Confirm" | The stock value for that row increases by 5, Badge status may change (e.g., Low Stock -> In Stock) |

## 3. Shopping & Checkout Module

| ID | Test Scenario | User Action | Expected UI Behavior |
|---|---|---|---|
| FT-SHOP-01 | Add to Cart | Click "Add to Cart" on a product card | Cart badge number increases, Product shows in cart sidebar/summary |
| FT-SHOP-02 | Checkout Flow | Click "Checkout Now" from cart | Redirect to payment page/dialog |
| FT-SHOP-03 | Payment Success | Proceed with payment and click "Confirm" | Redirect to "Orders" page, Stock for items is reduced (verified by checking Inventory page) |
| FT-SHOP-04 | Empty Cart | Navigate to shop | Empty state message or placeholder displayed |

## 4. Navigation & Layout

| ID | Test Scenario | User Action | Expected UI Behavior |
|---|---|---|---|
| FT-NAV-01 | Sidebar Collapse | Click menu toggle icon | Sidebar collapses to icons only, Content area expands |
| FT-NAV-02 | Unauthorized Access| Try to access /admin as a 'member' role | Redirect to Dashboard or Unauthorized page |
| FT-NAV-03 | Responsive View | Resize browser to mobile width | Sidebar hides behind a hamburger menu, Table becomes scrollable |

---

## Testing Environment Details
- **Browser:** Chrome / Edge (Latest)
- **Resolution:** 1920x1080 (Desktop), 375x812 (Mobile)
- **URL:** `http://localhost:3000`
