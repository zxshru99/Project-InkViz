---
name: inkviz-api-manager
description: Manages, executes, tests, and synchronizes the Inkviz backend API endpoints and Postman workspace collections via Postman and MongoDB MCP tools. Use when the user asks to test API routes, sync Postman collections, run sanity checks, or verify database state.
---

# Inkviz API & Postman Sync Skill

This skill provides automated workflows for testing, managing, and synchronizing the **Inkviz SaaS Backend API** and its associated **Postman Workspace & Collections** using Model Context Protocol (MCP) tools.

---

## 1. Quick Reference & Context

* **Backend Port:** `5001` (default in `.env`)
* **Base URL:** `http://localhost:5001`
* **Postman Workspace:** `InkViz` (ID: `e9489369-8e64-45d8-81a0-8e37affc8e5d`)
* **Collection Name:** `Inkviz API` (UID: `57886560-8e3e37b1-532f-4298-a081-4eab5a6a97e4`)
* **Environment:** `Inkviz Local Dev` (UID: `57886560-754b1ed9-1cdd-4eff-93e0-6c633603dcad`)
* **MongoDB Database:** `inkviz` (Collections: `users`, `invoices`, `templates`)

---

## 2. API Endpoint Architecture

### A. Health & System (Public)
* `GET /health` — Server uptime & status
* `GET /ready` — Database connection readiness

### B. Authentication (`/api/v1/auth`)
* `POST /api/v1/auth/register` — Register user `{ name, email, password }`
* `POST /api/v1/auth/login` — Login user (Returns `accessToken` & sets `refreshToken` HttpOnly cookie)
* `POST /api/v1/auth/refresh` — Refresh access token
* `POST /api/v1/auth/logout` — Invalidate session and clear cookies
* `POST /api/v1/auth/forgot-password` — Password recovery link trigger
* `POST /api/v1/auth/reset-password` — Password reset with token

### C. Users & Profile (`/api/v1/users`) [Protected]
* `GET /api/v1/users/me` — Current user profile
* `PATCH /api/v1/users/me` — Update profile settings
* `GET /api/v1/users/me/export` — Export user data (GDPR)
* `DELETE /api/v1/users/me` — Account deletion

### D. Templates (`/api/v1/templates`) [Protected]
* `GET /api/v1/templates` — List available invoice themes

### E. Invoices (`/api/v1/invoices`) [Protected]
* `GET /api/v1/invoices` — List invoices (supports `?status=&page=&limit=`)
* `POST /api/v1/invoices` — Create invoice with calculated totals
* `GET /api/v1/invoices/trash` — List soft-deleted invoices
* `GET /api/v1/invoices/:id` — Get single invoice
* `PATCH /api/v1/invoices/:id` — Update invoice
* `DELETE /api/v1/invoices/:id` — Soft-delete invoice
* `POST /api/v1/invoices/:id/restore` — Restore invoice from trash

### F. PDF Generation (`/api/v1/invoices`) [Protected]
* `GET /api/v1/invoices/:id/download` — Download rendered PDF

---

## 3. Workflow 1: End-to-End API Health & Sanity Audit

When asked to verify or test the backend:
1. Ensure the server is listening on port `5001`.
2. Send `GET /health` and `GET /ready`.
3. Create a disposable test user via `POST /api/v1/auth/register`.
4. Log in via `POST /api/v1/auth/login` to obtain `accessToken`.
5. Test a protected endpoint (`GET /api/v1/templates`) passing `Authorization: Bearer <accessToken>`.
6. Inspect MongoDB using the MongoDB MCP (`mongodb-mcp-server/find` or `list-collections`).

---

## 4. Workflow 2: Postman Collection Sync via MCP

When asked to sync or update Postman endpoints:
1. Call `postman-mcp-server/getWorkspaces` to retrieve the `InkViz` workspace.
2. Call `postman-mcp-server/getCollection` using collection UID `57886560-8e3e37b1-532f-4298-a081-4eab5a6a97e4`.
3. If new routes or modifications are introduced, update the collection using `postman-mcp-server/putCollection` preserving folder IDs and auto-token test scripts.
4. Verify changes using `postman-mcp-server/getCollection`.

---

## 5. Automated Postman Test Scripts Pattern

Ensure `Register User` and `Login User` requests retain test scripts that automatically capture and persist the access token:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const res = pm.response.json();
    if (res.data && res.data.accessToken) {
        pm.collectionVariables.set("accessToken", res.data.accessToken);
        pm.environment.set("accessToken", res.data.accessToken);
        console.log("✅ Auto-saved accessToken!");
    }
}
```
