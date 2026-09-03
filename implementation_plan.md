# Inkviz Backend — Implementation Plan

Build the complete **Express + TypeScript + MongoDB** backend for Inkviz, the Invoice Generator SaaS, fully aligned with Blueprint v2.2 best practices from [instructions.md](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/instructions.md) and the [Inkviz PRD](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/Inkviz_PRD%20%281%29.md).

---

## PRD vs Blueprint Gap Analysis

Before writing a single line of code, here is a compliance check of the PRD against the Blueprint:

| Concern | PRD Says | Blueprint Requires | Status |
|---|---|---|---|
| Version Safety | ✅ "verify at build time, never hardcode" | Mandatory web search + `npm show` | ✅ Aligned |
| Auth Strategy | Email + password only (no OAuth MVP) | Email or Google OAuth | ✅ Valid subset |
| JWT Lifetimes | Access 15 min, Refresh 7 days | 15 min / 7 days | ✅ Aligned |
| Refresh token storage | HttpOnly, Secure, SameSite=Strict | Same | ✅ Aligned |
| Refresh token hashing | Hashed in DB, rotated on use | Same | ✅ Aligned |
| Token comparison | `crypto.timingSafeEqual()` | Required | ✅ Aligned |
| Middleware order | Sentry → helmet → cors → json → sanitize → rate-limit → routes | Same order required | ✅ Aligned |
| Ownership check | `assertOwnership()` → 404 (never 403) | Required in every controller | ✅ Aligned |
| Zod validation | Every route | Required | ✅ Aligned |
| Soft delete | `isDeleted` + `deletedAt` + TTL 30 days | Best practice | ✅ Aligned |
| Logging | Winston, no PII/tokens | Required | ✅ Aligned |
| Sentry | Yes, with scrubbing | Required | ✅ Aligned |
| Health endpoints | `/health` + `/ready` | Required | ✅ Aligned |
| Account lockout | After 5 failed logins → 15-min lock | Required | ✅ PRD mentions it |
| GDPR export | `GET /users/me/export` | Required | ✅ PRD has it |
| Account deletion | `DELETE /users/me` + confirmation text | Required | ✅ PRD has it |
| `ENCRYPTION_KEY` | ❌ Not in PRD `.env.example` | Required for sensitive tokens | ⚠️ **Gap — will add** |
| Invoice counter race | Atomic `$inc` on `User.invoiceCounter` | Correct approach | ✅ Aligned |
| Blueprint module `invoiceNumber.ts` | In PRD structure | Dedicated util | ✅ Aligned |
| `roleGuard.ts` | ❌ Not in PRD structure | Listed in Blueprint | ℹ️ Not needed (single role) |
| `passport.ts` | ❌ Not in PRD (no OAuth) | Only if OAuth | ✅ Correctly omitted |
| Socket.io | ❌ Not in PRD | No real-time needed | ✅ Correctly omitted |

> [!IMPORTANT]
> **One gap found:** The PRD `.env.example` is missing `ENCRYPTION_KEY`. Blueprint Section 6 requires AES-256-GCM encryption for any sensitive tokens stored in DB. Even without OAuth tokens, this is a good practice to add for future extensibility. We will include it.

> [!NOTE]
> **PRD-specific additions vs Blueprint base:** `invoiceNumber.ts` util, `pdf/` module, `SMTP_PORT` variable, `TRASH_EXPIRED` error code, and TTL-driven invoice cleanup are all Inkviz-specific extensions that are consistent with Blueprint patterns.

---

## User Review Required

> [!IMPORTANT]
> **Two decisions you should confirm before execution:**
>
> 1. **Free plan invoice cap**: The PRD leaves the exact monthly invoice limit open as an "Open Question." Do you want to implement a **placeholder limit** (e.g. 5 invoices/month) now and configure it later, or skip plan-gating entirely for MVP?
>
> 2. **Email verification flow**: PRD says "optional but recommended." Should email verification be **required before first invoice creation**, or is it **optional/advisory** for MVP?

> [!WARNING]
> **PDF generation library**: The PRD says "Puppeteer or maintained equivalent — verify at build time." Puppeteer is the most common choice but is **~300MB** and can be slow to start in serverless environments. We will verify the current best option via `npm show` at build time and use Puppeteer unless there's a strong advisory against it.

---

## Proposed Changes

All files go into `c:\Users\samri\OneDrive\Desktop\BackendUsingAi\backend\`

---

### Layer 0 — Project Bootstrap & Configuration

#### [NEW] `backend/package.json`
Scaffold with all dependencies — versions verified via `npm show` at build time. Includes scripts: `dev`, `build`, `start`, `typecheck`, `lint`.

**Packages to verify (run `npm show <pkg> version` before pinning):**
- **Runtime deps:** `express`, `mongoose`, `zod`, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize`, `nodemailer`, `winston`, `@sentry/node`, `morgan`, `puppeteer` (or verified alternative for PDF)
- **Dev deps:** `typescript`, `ts-node-dev`, `@types/express`, `@types/node`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cors`, `@types/morgan`, `@types/nodemailer`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier`

#### [NEW] `backend/tsconfig.json`
TypeScript strict mode (`"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`).

#### [NEW] `backend/.env.example`
Based on PRD Section 9, extended with `ENCRYPTION_KEY` (Blueprint Section 6 requirement):
```
NODE_ENV, PORT, MONGODB_URI
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
CLIENT_URL, CORS_ORIGINS
ENCRYPTION_KEY (added — Blueprint requirement)
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
SENTRY_DSN
```

#### [NEW] `backend/.gitignore`

#### [NEW] `backend/.cursorignore`
Mirrors `.gitignore` sensitive paths to keep secrets out of AI context (Blueprint Section 9).

#### [NEW] `backend/.eslintrc.json`
ESLint config with `@typescript-eslint` rules and strict TypeScript checks. Required for `npm run lint` in the verification plan.

#### [NEW] `backend/.prettierrc`
Prettier formatting config for consistent code style.

---

### Layer 1 — Config

#### [NEW] `backend/src/config/env.ts`
Zod-validated env schema. Crashes on startup with a clear error if misconfigured. Matches Blueprint Section 3 pattern exactly, adapted for Inkviz (no OAuth, no VAPID).

#### [NEW] `backend/src/config/db.ts`
`mongoose.connect()` + `mongoose.disconnect()` wrapper with logging.

---

### Layer 2 — Types & Express Augmentation

#### [NEW] `backend/src/types/express.d.ts`
Augments `express.Request` with `req.user: { _id: string; email: string; plan: 'free' | 'paid' }`.

---

### Layer 3 — Utilities

#### [NEW] `backend/src/utils/jwt.ts`
`signAccess()`, `signRefresh()`, `verifyAccess()`, `verifyRefresh()` — using `jsonwebtoken`.

#### [NEW] `backend/src/utils/tokenCompare.ts`
`safeCompare(a, b)` using `crypto.timingSafeEqual()`. Blueprint Section 4 pattern.

#### [NEW] `backend/src/utils/ownershipCheck.ts`
`assertOwnership<T>(Model, resourceId, userId)` — always throws 404, never 403. Blueprint Section 4 pattern.

#### [NEW] `backend/src/utils/invoiceNumber.ts`
`generateInvoiceNumber(userId)` — atomically increments `User.invoiceCounter` via `$inc`, returns formatted string `${prefix}${counter.padStart(4, '0')}`.

---

### Layer 4 — Middleware

#### [NEW] `backend/src/middleware/requireAuth.ts`
Verifies Bearer access token, attaches `req.user`, throws `TOKEN_EXPIRED` or `TOKEN_INVALID`.

#### [NEW] `backend/src/middleware/validate.ts`
Zod schema factory middleware: `validate(schema)` → returns 400 `VALIDATION_ERROR` with field-level errors on failure.

#### [NEW] `backend/src/middleware/errorHandler.ts`
Central error handler (must be last middleware). Maps known error codes to HTTP status, returns standard `{ success: false, error: { code, message, fields? } }` shape.

---

### Layer 5 — Data Models

#### [NEW] `backend/src/modules/users/user.model.ts`
Mongoose schema for `User` with all fields from PRD Section 7:
- `loginAttempts`, `lockUntil` fields added for **account lockout** (PRD Security Checklist)
- `passwordResetToken`, `passwordResetExpires` for password reset flow
- TTL on `lockUntil` handled in service logic

#### [NEW] `backend/src/modules/invoices/invoice.model.ts`
Mongoose schema for `Invoice` with:
- TTL index on `deletedAt` (30 days) for soft-delete auto-purge
- Compound index on `{ userId, isDeleted, status }` for fast dashboard queries

#### [NEW] `backend/src/modules/templates/template.model.ts`
Mongoose schema for `Template`.

---

### Layer 6 — Services (shared)

#### [NEW] `backend/src/services/email.service.ts`
Nodemailer wrapper: `sendVerificationEmail()`, `sendPasswordResetEmail()`. No PII in Winston logs.

---

### Layer 7 — Modules

Each module follows the **routes → controller → service → schema** pattern from Blueprint Section 2.

#### Auth Module (`src/modules/auth/`)

**[NEW] `auth.schema.ts`** — Zod schemas for register, login, forgotPassword, resetPassword bodies.

**[NEW] `auth.service.ts`** — Business logic:
- `register`: hash password (bcrypt cost=10), create user, send verification email
- `login`: find user, verify password, check lockout, issue tokens, hash+store refresh token
- `refresh`: find user by hashed refresh token, verify, rotate token (`timingSafeEqual`)
- `logout`: clear refresh token hash in DB, clear cookie
- `forgotPassword`: generate `crypto.randomBytes(32)` token, hash, store, send email (generic response always)
- `resetPassword`: verify token, hash new password, clear reset fields
- Account lockout: increment `loginAttempts` on failure, lock for 15 min after 5 attempts

**[NEW] `auth.controller.ts`** — Thin controllers, delegates to service, handles cookie setting/clearing.

**[NEW] `auth.routes.ts`** — All `/api/v1/auth/*` routes.

---

#### Users Module (`src/modules/users/`)

**[NEW] `user.schema.ts`** — Zod schemas for PATCH profile, DELETE account (confirmation text).

**[NEW] `user.service.ts`** — Business logic:
- `getMe`: return profile (exclude passwordHash, refreshTokenHash)
- `updateMe`: update name, invoicePrefix, defaultCurrency
- `exportData`: serialize user + all their invoices as downloadable JSON
- `deleteMe`: compare confirmation text → throw **`CONFIRM_TEXT_MISMATCH` (400)** if wrong (Blueprint §5 error code — distinct from `VALIDATION_ERROR`) → delete all invoices → delete user

> **Session Management (MVP Decision):** Blueprint §6 requires session management. For Inkviz MVP, the `refreshTokenHash` field on the `User` model represents a **single active session per user**. `POST /auth/logout` clears this hash — effectively revoking the only session. Multi-device session listing (`GET /users/me/sessions`) is deferred to post-MVP. This decision must be documented in the API docs.

**[NEW] `user.controller.ts`**, **[NEW] `user.routes.ts`**

---

#### Invoices Module (`src/modules/invoices/`)

**[NEW] `invoice.schema.ts`** — Zod schemas for create, update, list query params.

**[NEW] `invoice.service.ts`** — Business logic:
- `listInvoices`: paginated list, filters by status, `isDeleted: false` mandatory filter
- `listTrash`: `isDeleted: true` filter only
- `createInvoice`: plan-gating check, call `generateInvoiceNumber()`, create
- `getInvoice`: `assertOwnership()` then return
- `updateInvoice`: `assertOwnership()`, partial update
- `softDelete`: `assertOwnership()`, set `isDeleted: true`, `deletedAt: new Date()`
- `restore`: `assertOwnership()`, check `deletedAt` within 30 days (else throw `TRASH_EXPIRED`), clear flags

**[NEW] `invoice.controller.ts`**, **[NEW] `invoice.routes.ts`**

---

#### Templates Module (`src/modules/templates/`)

**[NEW] `template.service.ts`** — List active templates only.

**[NEW] `template.controller.ts`**, **[NEW] `template.routes.ts`**

Seed data script for initial templates will be added separately.

---

#### PDF Module (`src/modules/pdf/`)

**[NEW] `pdf.service.ts`** — 
- `generateInvoicePdf(invoiceId, userId)`: calls `assertOwnership`, loads invoice + template, renders HTML with customization data, converts to PDF via Puppeteer (or verified equivalent), returns Buffer.
- HTML template rendering: inline CSS with user's `colorScheme`, `font`, and `signature`.

**[NEW] `pdf.controller.ts`**, **[NEW] `pdf.routes.ts`**

---

### Layer 8 — Application Entry Points

#### [NEW] `backend/src/app.ts`
Express app with full middleware stack in Blueprint-mandated order:
1. Sentry request handler
2. `helmet()`
3. `cors()` with explicit `CORS_ORIGINS`
4. `express.json({ limit: '10kb' })` **+ `express.urlencoded({ extended: true })`** (Blueprint §4 — both required)
5. `express-mongo-sanitize()`
6. `morgan` (dev only)
→ **`GET /health` and `GET /ready` mounted HERE** — at root level (not under `/api`), so they naturally bypass the `/api` rate limiters below. Blueprint §4 explicitly requires health routes to be excluded from aggressive rate limits.
7. Global rate limiter (`/api`)
8. Strict auth rate limiter (`/api/v1/auth`)
9. All API routes (`/api/v1`)
10. Sentry error handler
11. Central error handler (last)

#### [NEW] `backend/src/server.ts`
Entry point: load env → connect DB → start server.

---

### Layer 9 — Dev Tooling & Docs

#### [NEW] `backend/postman/collection.json`
Postman collection with all endpoints, test scripts, pre-request token refresh script (Blueprint §10 pattern).

#### [NEW] `backend/postman/environment.json`
Template with `baseUrl`, `accessToken`, `tokenExpiry`, `invoiceId` variables.

#### [NEW] `backend/README.md`
Setup instructions, env setup, running locally, CI commands (`npm ci`, `npm run typecheck`, `npm audit --audit-level=high`).

> **Dependabot / Snyk (Blueprint §6 Infrastructure):** Enable GitHub Dependabot alerts on the repository after first push for automated dependency vulnerability notifications. This is a Blueprint requirement.

---

## Verification Plan

### Automated
```bash
# Type safety
cd backend && npx tsc --noEmit

# Dependency audit
npm audit --audit-level=high

# Lint
npm run lint
```

### Manual API Verification (Postman run order)
1. `POST /auth/register` → 201
2. `POST /auth/login` → 200 + refresh cookie
3. `GET /users/me` → 200 profile
4. `POST /invoices` → 201 with `INV-0001`
5. `GET /invoices` → paginated list
6. `PATCH /invoices/:id` → 200 updated
7. `GET /invoices/:id/download` → 200 PDF stream
8. `DELETE /invoices/:id` → 200 soft-deleted
9. `GET /invoices` → invoice no longer listed (isDeleted filter)
10. `POST /invoices/:id/restore` → 200 restored
11. `POST /auth/refresh` → new access token
12. `POST /auth/logout` → cookie cleared
13. `GET /users/me` with stale token → 401
14. `POST /auth/forgot-password` → 200 (generic)
15. `DELETE /users/me` with wrong confirm text → 400
16. `GET /health` → 200 (no auth)
17. `GET /ready` → 200 (DB connected check)

### Security Spot-Checks
- [ ] Try accessing another user's invoice → expect 404
- [ ] Send `{ "$gt": "" }` in login email → should be sanitized
- [ ] Send 11 login requests in 60s → expect 429 on 11th
- [ ] Use expired access token → expect `TOKEN_EXPIRED`, then refresh works
- [ ] Reuse old refresh token after rotation → expect `REFRESH_TOKEN_INVALID` + full session revocation
