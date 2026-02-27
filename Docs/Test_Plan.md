# Test Plan for API Testing - ST-Inventory

## 1. Introduction
The objective of this test plan is to define the scope, approach, and resources for testing the ST-Inventory REST API. This ensures the backend services are reliable, secure, and perform according to requirements.

## 2. Scope of Testing
- **In-Scope:**
  - Authentication (Login, Register)
  - Product Management (CRUD)
  - Order Management (List, Create, Detail)
  - User Management (Admin functions)
- **Out-of-Scope:**
  - UI/UX Testing
  - Load Testing (Performance)
  - Third-party payment gateway integration (currently mocked)

## 3. Test Methodology
- **Black-Box Testing:** Testing the API endpoints without knowing the internal code structure.
- **Positive Testing:** Verifying the API works as expected with valid inputs.
- **Negative Testing:** Verifying the API handles invalid inputs, unauthorized access, and edge cases gracefully.

## 4. Test Environment
- **Local Server:** `http://localhost:5000`
- **Database:** MongoDB (Local or Atlas)
- **Tools:** Postman / Insomnia / cURL / Jest

## 5. Pass/Fail Criteria
- **Pass:**
  - HTTP Status Code matches expectation.
  - Response body contains required fields/values.
  - Database state reflects the changes (e.g., product added).
- **Fail:**
  - Server crashes (500 error) on unhandled exceptions.
  - Sensitive data leaked (e.g., password field returned in plain text).
  - Validation bypassed (e.g., negative price accepted).

## 6. Execution Schedule
1. **Unit Testing:** During development of each route.
2. **Integration Testing:** Once all routes are connected.
3. **Regression Testing:** After any bug fixes or feature updates.

## 7. Deliverables
- Test Case Report
- Bug Logs (if any)
- API Documentation (already created in `Docs/API_Documentation.md`)
