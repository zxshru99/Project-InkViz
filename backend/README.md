# Inkviz Backend API

Production-grade Express + TypeScript + MongoDB Atlas REST API backend for the **Inkviz** Invoice Generator SaaS.

---

## 🚀 Quick Start

### 1. Environment Setup
Copy the sample environment file and configure your credentials:
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot up with hot-reloading enabled at `http://localhost:5001`.

---

## 🛠️ Build & Verification Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local dev server with `tsx watch` hot-reloading |
| `npm run build` | Compiles TypeScript into JavaScript (`dist/`) |
| `npm start` | Launches compiled production server |
| `npm run typecheck` | Executes strict TypeScript compiler checks (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint across the codebase |

---

## 📬 API Endpoint Catalog & Testing (cURL)

Below are copy-pasteable standard cURL commands organized by category. You can also import them directly into Postman (**Import** ➔ **Paste raw text / cURL**).

### 📁 1. Authentication (`auth`)

#### 1.1 Sign Up / Register
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Mercer",
    "email": "alex.mercer@example.com",
    "password": "Password123!"
  }'
```

#### 1.2 Login
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.mercer@example.com",
    "password": "Password123!"
  }'
```

#### 1.3 Refresh Access Token
```bash
curl -X POST http://localhost:5001/api/v1/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN"
```

#### 1.4 Forgot Password
```bash
curl -X POST http://localhost:5001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.mercer@example.com"
  }'
```

#### 1.5 Reset Password
```bash
curl -X POST http://localhost:5001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewSecurePassword123!"
  }'
```

#### 1.6 Logout
```bash
curl -X POST http://localhost:5001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 📁 2. Users & Profile (`users`)

#### 2.1 Get Current User Profile
```bash
curl -X GET http://localhost:5001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 2.2 Update User Profile
```bash
curl -X PATCH http://localhost:5001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Mercer",
    "defaultCurrency": "USD",
    "invoicePrefix": "INV-"
  }'
```

#### 2.3 Export User Data (GDPR)
```bash
curl -X GET http://localhost:5001/api/v1/users/me/export \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 2.4 Delete Account
```bash
curl -X DELETE http://localhost:5001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmText": "delete my account"
  }'
```

---

### 📁 3. Templates (`templates`)

#### 3.1 List Invoice Templates
```bash
curl -X GET http://localhost:5001/api/v1/templates \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 📁 4. Invoices (`invoices`)

#### 4.1 List Active Invoices (Paginated)
```bash
curl -X GET "http://localhost:5001/api/v1/invoices?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4.2 Create Invoice (Draft)
```bash
curl -X POST http://localhost:5001/api/v1/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "6a9874e598be009a93af641b",
    "clientName": "Acme Innovations",
    "clientEmail": "billing@acme.com",
    "clientAddress": "123 Tech Blvd, Suite 400, San Francisco, CA",
    "items": [
      {
        "description": "Fullstack AI Application Engineering",
        "quantity": 20,
        "price": 125
      },
      {
        "description": "Cloud Infrastructure Deployment",
        "quantity": 1,
        "price": 500
      }
    ],
    "taxRate": 10,
    "discountRate": 5,
    "currency": "USD",
    "issueDate": "2026-09-01T00:00:00.000Z",
    "dueDate": "2026-09-15T00:00:00.000Z",
    "notes": "Payment due within 14 days"
  }'
```

#### 4.3 Get Invoice by ID
```bash
curl -X GET http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4.4 Update Invoice (Change Items & Status)
```bash
curl -X PATCH http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent",
    "items": [
      {
        "description": "Fullstack AI Application Engineering",
        "quantity": 25,
        "price": 125
      }
    ],
    "notes": "Updated terms: Net 30"
  }'
```

#### 4.5 Mark Invoice as Paid
```bash
curl -X PATCH http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

#### 4.6 Soft Delete Invoice (Move to Trash)
```bash
curl -X DELETE http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4.7 List Trashed Invoices
```bash
curl -X GET http://localhost:5001/api/v1/invoices/trash \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4.8 Restore Invoice from Trash
```bash
curl -X POST http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID/restore \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 📁 5. PDF Generation (`pdf`)

#### 5.1 Download Invoice PDF
```bash
curl -X GET http://localhost:5001/api/v1/invoices/YOUR_INVOICE_ID/download \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o invoice.pdf
```

---

### 📁 6. Health & System (`system`)

#### 6.1 Server Health Probe
```bash
curl -X GET http://localhost:5001/health
```

#### 6.2 Database Readiness Probe
```bash
curl -X GET http://localhost:5001/ready
```

---

## 📚 Documentation & Postman Resources

* **Full API Specification:** [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
* **Postman Collection v2.1:** [`Inkviz_Postman_Collection.json`](Inkviz_Postman_Collection.json)
