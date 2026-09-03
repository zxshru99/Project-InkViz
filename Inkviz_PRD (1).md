# Inkviz — Product Requirements Document (PRD)

### Invoice Generator SaaS — Next.js + Express + MongoDB

> **Version:** 1.0
> **Brand:** Inkviz
> **Primary color:** `#1763B9`
> **Industry:** Invoice Generation / SaaS Billing Tool
> **Audience:** Engineering team, AI coding assistants (Cursor, Copilot, Claude), designers, stakeholders
> **Source references:** Project Blueprint v2.2 (tech/security standards) + product mind-maps (Pages sitemap, Features breakdown)

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [Brand Identity](#2-brand-identity)
3. [Tech Stack](#3-tech-stack)
4. [Sitemap (Pages)](#4-sitemap-pages)
5. [Feature Breakdown](#5-feature-breakdown)
6. [User Roles & Auth](#6-user-roles--auth)
7. [Data Models](#7-data-models)
8. [Repository Structure](#8-repository-structure)
9. [Environment Variables](#9-environment-variables)
10. [Backend Architecture](#10-backend-architecture)
11. [API Documentation](#11-api-documentation)
12. [Pricing Plans](#12-pricing-plans)
13. [Backend Security Checklist](#13-backend-security-checklist)
14. [Frontend Security Checklist](#14-frontend-security-checklist)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Master Build Prompt (for AI assistants)](#16-master-build-prompt-for-ai-assistants)
17. [Open Questions / Future Scope](#17-open-questions--future-scope)

---

## 1. Product Summary

**Inkviz** is a web-based invoice generator that lets freelancers and small businesses create, customize, and download professional invoices in minutes. Users sign up with email, land on a dashboard showing their recent invoices, pick a template, customize branding (font, color, signature), fill in line items and tax details, and export a polished PDF invoice — with invoice numbers that auto-increment based on history.

**Core value proposition:** the fastest path from "blank invoice" to "downloaded PDF," with enough customization (signature, currency, tax, color scheme) to feel branded, but without the complexity of a full accounting suite.

**MVP goal:** ship the flows in the mind-maps — Home/About/Contact/Privacy/Pricing marketing pages, email-based auth, a dashboard with draft/published/archived invoices and a 30-day trash, a template picker, and a customization + generation flow that ends in a downloadable invoice.

---

## 2. Brand Identity

| Element | Value |
|---|---|
| **Product name** | Inkviz |
| **Primary brand color** | `#1763B9` (deep blue) |
| **Suggested supporting palette** | `#0F4C8C` (darker shade, hover/active states), `#5B9BD5` (light accent), `#F5F8FC` (page background), `#1A1A1A` (text), `#22C55E` (success/published), `#F59E0B` (draft), `#94A3B8` (archived/muted) |
| **Typography** | A clean, modern sans-serif for UI (e.g. Inter / Geist) for the product itself — kept separate from **Invoice Fonts**, which are a user-selectable customization option applied only inside the generated invoice document |
| **Logo tone** | Should read as trustworthy and precise (financial document tool) — avoid playful/rounded styling; prefer geometric, confident forms |
| **Voice** | Direct, efficient, no jargon — the product is for freelancers and small business owners, not accountants |

---

## 3. Tech Stack

> Following the Blueprint's **Version Safety Rule**: do not hardcode dependency versions here or in `package.json` from memory. Before install, web-search each package for latest stable + security advisories, and confirm with `npm show <package> version`. Use `^` ranges unless a specific CVE requires a pin.

| Layer | Choice | Notes |
|---|---|---|
| **Frontend framework** | Next.js (App Router) + React | SSR/SSG for marketing pages (Home, About, Pricing, Privacy, Contact); CSR for authenticated dashboard/editor |
| **Styling** | Tailwind CSS | Design tokens configured around `#1763B9` primary; dark-mode not required for MVP |
| **Language** | TypeScript (strict mode) | Both frontend and backend |
| **Backend framework** | Node.js + Express | Verify current Active LTS Node + latest stable Express before scaffolding |
| **Database** | MongoDB Atlas | Cloud-hosted, IP allowlist required |
| **ODM** | Mongoose | Match driver version to Atlas docs |
| **Validation** | Zod | Env validation + request body/query/param validation, shared schema shapes where practical |
| **Auth** | Email + password only (no OAuth for MVP) | JWT access + refresh, per Blueprint standard |
| **JWT** | jsonwebtoken | Access 15 min, refresh 7 days |
| **Password hashing** | bcryptjs | Cost factor ≥ 10 |
| **Security headers** | helmet | CSP tuned for Next.js SPA/CDN assets |
| **CORS** | cors | Explicit origin allowlist (`CORS_ORIGINS`) |
| **Rate limiting** | express-rate-limit | Strict on `/auth/*`, general on `/api` |
| **NoSQL sanitize** | express-mongo-sanitize | Applied globally |
| **PDF generation** | Server-side HTML→PDF (e.g. Puppeteer or a maintained equivalent — verify current best-practice option at build time) | Renders the selected invoice template + customization into a downloadable PDF |
| **Signature capture** | Canvas-based drawing on frontend (e.g. a signature-pad library) + font-based typed signature option | Signature stored as an image (drawn) or as styled text (font-based) in the invoice document, not as a separate identity artifact |
| **Email** | nodemailer | Transactional email: verification, password reset, invoice delivery (post-MVP) |
| **Logging** | winston | Structured logs, no PII/secrets |
| **Monitoring** | @sentry/node (backend), Sentry SDK for Next.js (frontend) | Error tracking with scrubbing |
| **Forms** | React Hook Form + Zod | All customization and auth forms |
| **HTTP client** | Axios | Interceptor-based token refresh |
| **Server state** | TanStack Query | Dashboard lists, invoice CRUD |
| **HTML sanitize** | DOMPurify | Any rendered rich text (e.g. invoice notes field) |
| **Deploy: Frontend** | Vercel | Native fit for Next.js |
| **Deploy: Backend** | Render / Railway | Env vars via dashboard |
| **Deploy: DB** | MongoDB Atlas | IP allowlist |

**Token lifetime standard:** Access JWT 15 minutes (`Authorization: Bearer`), Refresh token 7 days (`HttpOnly; Secure; SameSite=Strict` cookie) — unchanged from Blueprint default.

---

## 4. Sitemap (Pages)

Derived from the product mind-map.

```
Pages
├── Home
│   ├── Header
│   └── Hero
├── About
├── Contact Us
├── Privacy Policy
└── Pricing
    └── Pricing Table with Title
        ├── Free Forever
        └── $6 Plan
```

| Page | Purpose | Auth required |
|---|---|---|
| **Home** (Header + Hero) | Marketing landing page; explains Inkviz value prop, CTA to sign up | No |
| **About** | Company/product story | No |
| **Contact Us** | Support/contact form | No |
| **Privacy Policy** | Legal/compliance page | No |
| **Pricing** | Pricing Table with Title, comparing **Free Forever** vs **$6 Plan** | No |
| **Login / Signup** | Email-based auth | No |
| **Dashboard** | Authenticated home — recent invoices, trash | Yes |
| **Invoice Editor / Customization** | Template selection → customization → generate | Yes |

---

## 5. Feature Breakdown

Derived from the Features mind-map.

```
Features
├── Dashboard
│   ├── Recent Invoice Created (status: Draft, Published, Archived)
│   └── Trash (30-day recovery)
├── Login and Signup (email-based only)
├── Create Button
└── Invoice Template For Selection
    └── Customization
        1. Invoice Font
        2. Invoice Color Scheme
        3. Signature (font-based typed, or hand-drawn via canvas)
        4. Changing Value (Amount)
        5. Currency supporting all countries
        6. Tax Percentage
        7. Invoice Download Button
        8. Auto-increment invoice number (based on history)
```

### 5.1 Dashboard

- Shows the user's **recent invoices** with status badges: `Draft`, `Published`, `Archived`.
- **Create button** prominently placed — starts the template selection flow.
- **Trash**: soft-deleted invoices live here for **30 days**, after which they are permanently purged (TTL-based cleanup). Users can restore from Trash within the window.
- List is paginated; supports basic filter by status.

### 5.2 Auth (Login & Signup)

- **Email + password only** — no social/OAuth login in MVP.
- Standard flows: register, verify email (optional but recommended), login, forgot/reset password, logout.
- Session bootstrap via refresh-token cookie on app load (per Blueprint `AuthProvider` pattern).

### 5.3 Invoice Template Selection

- User picks from a gallery of predefined invoice templates (layout only — color/font applied afterward).
- Selecting a template moves the user into the **Customization** step.

### 5.4 Customization

| Sub-feature | Description |
|---|---|
| **Invoice Font** | User picks a font applied to the rendered invoice document (distinct from app UI font) |
| **Invoice Color Scheme** | User picks an accent color for the invoice document; defaults to brand `#1763B9` but is fully user-overridable per invoice |
| **Signature** | Two modes: (a) **font-based** — user types their name, rendered in a script/signature-style font; (b) **draw-based** — user signs via an HTML canvas, captured as an image |
| **Changing Value (Amount)** | Editable line items: description, quantity, unit price, computed line total, invoice subtotal |
| **Currency** | Supports all major world currencies with correct symbol + formatting (ISO 4217-driven) |
| **Tax Percentage** | User-defined tax rate applied to subtotal; shown as a separate line before the grand total |
| **Invoice Download Button** | Triggers server-side render to PDF and downloads the file |
| **Auto-increment Invoice Number** | System looks at the user's invoice history and generates the next sequential number (e.g. `INV-0001`, `INV-0002`), user can override the prefix/format in settings |

---

## 6. User Roles & Auth

MVP is single-tenant per user (no teams/organizations in v1).

| Role | Description |
|---|---|
| **Guest** | Can view marketing pages (Home, About, Contact, Privacy, Pricing) |
| **User** | Authenticated account owner; full access to their own dashboard, invoices, and settings |

All resources are scoped by `userId` — no cross-user data access. `assertOwnership()` pattern applies to every invoice-related controller (per Blueprint Section 4), always returning `404` (never `403`) when a resource doesn't belong to the requester.

---

## 7. Data Models

### `User`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `email` | string, unique | Lowercased, indexed |
| `passwordHash` | string | bcrypt |
| `name` | string | |
| `plan` | enum: `free`, `paid` | Drives Free Forever vs $6 Plan limits |
| `isEmailVerified` | boolean | |
| `refreshTokenHash` | string \| null | Hashed, rotated on use |
| `invoiceCounter` | number | Used to auto-increment invoice numbers |
| `invoicePrefix` | string | Default `INV-`, user-editable |
| `defaultCurrency` | string | ISO 4217 code |
| `createdAt` / `updatedAt` | Date | |

### `Invoice`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `userId` | ObjectId | Owner, indexed |
| `invoiceNumber` | string | Auto-generated, unique per user |
| `status` | enum: `draft`, `published`, `archived` | |
| `templateId` | string/ObjectId | Which layout template |
| `customization` | object | `{ font, colorScheme, signature: { type: 'typed'|'drawn', value } }` |
| `client` | object | Name, email, address |
| `lineItems` | array | `{ description, quantity, unitPrice, total }` |
| `currency` | string | ISO 4217 code |
| `taxPercentage` | number | |
| `subtotal` / `taxAmount` / `total` | number | Computed |
| `notes` | string | Sanitized with DOMPurify if rendered as rich text |
| `isDeleted` | boolean | Soft delete flag |
| `deletedAt` | Date \| null | TTL index for 30-day trash purge |
| `createdAt` / `updatedAt` | Date | |

### `Template`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `name` | string | |
| `previewImageUrl` | string | |
| `layoutKey` | string | Maps to a server-side render component |
| `isActive` | boolean | |

---

## 8. Repository Structure

Adapted from the Blueprint's MERN structure for a **Next.js frontend**.

```
Inkviz/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── db.ts
│   │   ├── middleware/
│   │   │   ├── requireAuth.ts
│   │   │   ├── validate.ts
│   │   │   └── errorHandler.ts
│   │   ├── modules/
│   │   │   ├── auth/          # register, login, refresh, logout, password reset
│   │   │   ├── users/         # profile, settings, invoice prefix/counter
│   │   │   ├── invoices/      # CRUD, status transitions, trash/restore
│   │   │   ├── templates/     # template catalog
│   │   │   └── pdf/           # server-side render → PDF
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── ownershipCheck.ts
│   │   │   ├── tokenCompare.ts
│   │   │   └── invoiceNumber.ts   # auto-increment logic
│   │   └── types/
│   ├── postman/
│   ├── .env.example
│   └── package.json
│
├── frontend/                      # Next.js App Router
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   └── pricing/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── (app)/
│   │       ├── dashboard/page.tsx
│   │       ├── trash/page.tsx
│   │       └── invoices/
│   │           ├── new/page.tsx        # template selection
│   │           └── [id]/edit/page.tsx  # customization + generate
│   ├── components/
│   │   ├── layout/                 # Header, Hero, Footer
│   │   ├── invoices/                # LineItemsTable, SignaturePad, ColorPicker, FontPicker
│   │   └── ui/
│   ├── lib/
│   │   ├── env.ts
│   │   └── api/
│   │       ├── client.ts
│   │       └── refreshClient.ts
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   └── tokenStore.ts
│   ├── .env.example
│   └── package.json
│
└── docs/
    └── PRD.md   # this file
```

---

## 9. Environment Variables

### Backend `.env.example`

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/inkviz

JWT_ACCESS_SECRET=replace_with_64_char_hex
JWT_REFRESH_SECRET=replace_with_different_64_char_hex
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_api_key
EMAIL_FROM=noreply@inkviz.app

SENTRY_DSN=https://your_sentry_dsn_here
```

### Frontend `.env.example`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_BRAND_COLOR=#1763B9
```

No `GOOGLE_CLIENT_ID` / OAuth vars — MVP is email-only auth.

---

## 10. Backend Architecture

Middleware stack order follows the Blueprint pattern, minus Google OAuth/Passport and Socket.io (not needed for MVP — no real-time collaboration):

```
1. Sentry request handler
2. helmet()
3. cors({ origin: CORS_ORIGINS, credentials: true })
4. express.json({ limit: '10kb' })
5. express-mongo-sanitize()
6. morgan (dev only)
7. Global rate limiter (/api)
8. Strict auth rate limiter (/api/v1/auth)
9. Routes (/api/v1)
10. Sentry error handler
11. Central error handler (last)
```

**Error/success response shape** — unchanged from Blueprint:

```json
// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "fields": {} } }

// Success
{ "success": true, "data": { } }

// Paginated
{ "success": true, "data": [], "pagination": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 } }
```

**Invoice number generation:** on invoice creation, atomically increment `User.invoiceCounter` (e.g. `findOneAndUpdate` with `$inc`) and format as `${invoicePrefix}${String(counter).padStart(4, '0')}` to avoid race conditions under concurrent requests.

**PDF generation flow:** `POST /invoices/:id/download` → server loads the invoice + its customization → renders the matching template component server-side with the chosen font/color/signature → converts to PDF → streams the file back (not stored permanently unless the user explicitly saves a generated copy).

`GET /health` and `GET /ready` implemented per Blueprint, excluded from strict rate limits.

---

## 11. API Documentation

Following the Blueprint's endpoint template. Representative endpoints below — extend per-module using the same shape.

### `POST /api/v1/auth/register`

**Description:** Creates a new user with email + password.
**Auth required:** No

**Body:**
```json
{ "email": "user@example.com", "password": "min 8 chars", "name": "Jane Doe" }
```

**Response — 201 Created**
```json
{ "success": true, "data": { "_id": "...", "email": "...", "name": "..." } }
```

**Response — 400 Validation Error / 409 Conflict** (email already exists)

---

### `POST /api/v1/auth/login`

**Description:** Authenticates a user, sets refresh cookie, returns access token.
**Auth required:** No

**Response — 200 OK**
```json
{ "success": true, "data": { "accessToken": "...", "user": { "_id": "...", "email": "..." } } }
```

---

### `POST /api/v1/auth/refresh`

**Description:** Rotates the refresh token (from the HttpOnly cookie) and issues a new access token. Called by the frontend's single-flight interceptor on 401, and on app-load session bootstrap.
**Auth required:** No (relies on the refresh cookie itself)

**Response — 200 OK**
```json
{ "success": true, "data": { "accessToken": "..." } }
```

**Response — 401 `REFRESH_TOKEN_INVALID`** — cookie missing, expired, or already rotated (possible reuse/breach signal — triggers full revocation for that user).

---

### `POST /api/v1/auth/logout`

**Description:** Clears the refresh cookie and invalidates the stored refresh token hash.
**Auth required:** Yes

---

### `POST /api/v1/auth/forgot-password`

**Description:** Sends a single-use, expiring password-reset link to the given email if an account exists. Always returns a generic success message (no email enumeration).
**Auth required:** No

---

### `POST /api/v1/auth/reset-password`

**Description:** Sets a new password given a valid, unexpired reset token.
**Auth required:** No

**Body:**
```json
{ "token": "...", "newPassword": "min 8 chars" }
```

---

### `GET /api/v1/users/me`

**Description:** Returns the authenticated user's profile (name, email, plan, invoicePrefix, defaultCurrency).
**Auth required:** Yes

---

### `PATCH /api/v1/users/me`

**Description:** Updates profile fields — name, invoicePrefix, defaultCurrency.
**Auth required:** Yes

---

### `GET /api/v1/users/me/export`

**Description:** Returns a downloadable export of the user's account and invoice data (GDPR data portability).
**Auth required:** Yes

---

### `DELETE /api/v1/users/me`

**Description:** Permanently deletes the account. Requires a confirmation text match in the body to prevent accidental deletion.
**Auth required:** Yes

---

### `GET /api/v1/templates`

**Description:** Lists available invoice templates (name, preview image, layout key) for the template-selection step.
**Auth required:** Yes

---

### `GET /api/v1/invoices`

**Description:** List the authenticated user's invoices (excludes soft-deleted by default).
**Auth required:** Yes

**Query params:** `?page=1&limit=20&status=draft|published|archived`

**Response — 200 OK** — paginated list shape (see Section 10).

---

### `POST /api/v1/invoices`

**Description:** Creates a new invoice (status defaults to `draft`), auto-assigns the next invoice number.
**Auth required:** Yes

**Body:**
```json
{
  "templateId": "...",
  "client": { "name": "...", "email": "...", "address": "..." },
  "lineItems": [{ "description": "...", "quantity": 1, "unitPrice": 100 }],
  "currency": "USD",
  "taxPercentage": 10,
  "customization": { "font": "...", "colorScheme": "#1763B9", "signature": { "type": "typed", "value": "Jane Doe" } }
}
```

**Response — 201 Created** — full invoice object including generated `invoiceNumber`.

---

### `PATCH /api/v1/invoices/:id`

**Description:** Updates an invoice (line items, customization, status transitions between `draft`/`published`/`archived`).
**Auth required:** Yes — ownership enforced, 404 on mismatch.

---

### `DELETE /api/v1/invoices/:id`

**Description:** Soft-deletes an invoice (moves to Trash); sets `isDeleted: true` and `deletedAt: now`. A TTL job purges records 30 days after `deletedAt`.
**Auth required:** Yes

---

### `POST /api/v1/invoices/:id/restore`

**Description:** Restores a soft-deleted invoice from Trash within the 30-day window.
**Auth required:** Yes

---

### `GET /api/v1/invoices/:id/download`

**Description:** Renders the invoice (template + customization) to PDF and streams it.
**Auth required:** Yes

**Response — 200 OK** — `application/pdf` binary stream.

---

### Error Codes Reference

Same master table as the Blueprint (`VALIDATION_ERROR`, `UNAUTHORIZED`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `REFRESH_TOKEN_INVALID`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR`), plus one addition:

| HTTP | Code | When to use |
|---|---|---|
| 400 | `TRASH_EXPIRED` | Attempted restore on an invoice past its 30-day trash window |

---

## 12. Pricing Plans

From the Pricing Table mind-map node:

| Plan | Price | Suggested scope (to be confirmed with stakeholders) |
|---|---|---|
| **Free Forever** | $0 | Limited invoices/month, Inkviz branding on generated PDF, core templates only |
| **$6 Plan** | $6/month | Unlimited invoices, no Inkviz branding, full template + customization library, priority support |

`User.plan` drives feature gating server-side (never trust a client-side plan flag). Plan limits (e.g. monthly invoice cap for Free) should be enforced in the `invoices` module before creation.

---

## 13. Backend Security Checklist

Per Blueprint Section 6, scoped to Inkviz (no OAuth, no Socket.io for MVP):

**Environment & Configuration**
- [ ] All secrets in `.env`, zero hardcoded
- [ ] `.env*` gitignored except `.env.example`
- [ ] Env validated with Zod at startup — crash on bad config
- [ ] `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` distinct, ≥64 chars
- [ ] MongoDB Atlas: restricted DB user + IP allowlist

**Authentication**
- [ ] Access token 15 min, refresh 7 days (HttpOnly, Secure, SameSite=Strict cookie)
- [ ] Refresh tokens hashed in DB, rotated per use, reuse triggers full revocation
- [ ] `crypto.timingSafeEqual()` for token comparisons
- [ ] Account lockout after 5 failed logins → 15 min lock
- [ ] Password reset flow uses single-use, expiring tokens

**API Security**
- [ ] `helmet()`, `cors()` with explicit origins, `express-mongo-sanitize()`
- [ ] `express-rate-limit` global + strict on `/auth`
- [ ] Zod validation on every route
- [ ] `assertOwnership()` in every invoice controller
- [ ] Soft-delete (`isDeleted`) filter on all invoice queries
- [ ] TTL index purges trashed invoices after 30 days

**Data & Privacy**
- [ ] Passwords bcrypt-hashed (cost ≥ 10)
- [ ] `GET /users/me/export` for data portability
- [ ] `DELETE /users/me` requires confirmation text

**Infrastructure**
- [ ] `GET /health` / `GET /ready` implemented, excluded from strict rate limits
- [ ] Winston logs — no passwords/tokens/PII
- [ ] Sentry configured with scrubbing
- [ ] `npm audit` clean; `npm ci` in CI
- [ ] HTTPS enforced in production

---

## 14. Frontend Security Checklist

Per Blueprint Section 8:

- [ ] Access token in memory only (`tokenStore.ts`) — never `localStorage`
- [ ] Refresh token HttpOnly cookie, single-flight refresh interceptor
- [ ] `DOMPurify.sanitize()` on any rendered invoice notes/rich text
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Signature canvas data validated (size/type) before upload
- [ ] All forms validated with React Hook Form + Zod
- [ ] `RequireAuth` wrapper on dashboard/invoice routes
- [ ] `npm audit` clean; `NEXT_PUBLIC_*` env vars validated with Zod

---

## 15. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | PDF generation completes in < 3s for a typical invoice; dashboard list loads < 1s at 100 invoices |
| **Availability** | `GET /health` and `GET /ready` support host-level auto-restart/monitoring |
| **Scalability** | Stateless backend (JWT-based) so it can scale horizontally behind a load balancer |
| **Internationalization** | Currency formatting must support all ISO 4217 currencies; invoice content itself is not multi-language in MVP |
| **Accessibility** | Marketing pages and dashboard meet basic WCAG AA contrast against the `#1763B9` palette |
| **Data retention** | Trashed invoices purge automatically 30 days after deletion via TTL index |

---

## 16. Master Build Prompt (for AI assistants)

Filled-in version of the Blueprint's Full-Stack Bootstrap Prompt for this product:

```
Build a production-ready full-stack invoice generator called Inkviz, in TypeScript.

Industry: Invoice generation / SaaS billing tool
Brand color: #1763B9
Primary resources: users, invoices, templates

── Backend ──────────────────────────────────────────────────────────────
- backend/ (Express + Mongoose + TypeScript), frontend/ (Next.js App Router + Tailwind + TypeScript)
- Before writing any package.json: web search each dependency for latest stable + advisories,
  confirm with `npm show <pkg> version` — never hardcode versions from this or any other doc
- src/config/env.ts (Zod, crash on bad config), db.ts, app.ts, server.ts
- Modules under src/modules/: auth, users, invoices, templates, pdf
- Auth: EMAIL + PASSWORD ONLY — no OAuth. JWT access (15min) in JSON response;
  refresh (7d) in HttpOnly; Secure; SameSite=Strict cookie; rotation with hashed refresh token
- Security middleware in order: Sentry request handler, helmet, cors (explicit origins),
  express.json({limit:'10kb'}), express-mongo-sanitize, rate-limit, requireAuth, validate
- All errors follow: { success: false, error: { code, message, fields? } }
- All success responses follow: { success: true, data: {...} }
- assertOwnership() in every invoice controller — always 404 never 403 on wrong user
- crypto.timingSafeEqual() for all token comparisons
- Zod validation on every route body/query/params
- Invoice numbering: atomic $inc on User.invoiceCounter, format as `${invoicePrefix}0001`
- Soft-delete pattern on invoices (isDeleted + deletedAt) with TTL purge at 30 days
- Server-side PDF rendering for invoice templates (Puppeteer or equivalent — verify current
  best option at build time), applying user's font/color/signature customization
- Winston structured logging in production — never log passwords, tokens, or raw PII; Sentry
  with sensitive data scrubbing
- GET /health (liveness) and GET /ready (readiness, Mongo connected)

── Frontend (Next.js) ───────────────────────────────────────────────────
- Tailwind CSS themed around #1763B9 as primary
- Marketing pages (SSR/SSG): Home (Header + Hero), About, Contact Us, Privacy Policy,
  Pricing (Pricing Table with Title: Free Forever vs $6 Plan)
- Auth pages: Login, Signup (email/password only)
- Dashboard: recent invoices list with status badges (Draft/Published/Archived), Create button,
  Trash view with 30-day restore window
- Invoice flow: Template selection → Customization (font, color scheme, signature
  [typed or canvas-drawn], line items/amounts, currency picker supporting all ISO 4217
  currencies, tax percentage) → Download button (calls PDF endpoint)
- Validate NEXT_PUBLIC_* vars with Zod in src/lib/env.ts
- Axios instance with withCredentials:true; single-flight refresh interceptor on 401
  using a separate refreshClient (no interceptors)
- Access token in memory only (tokenStore.ts) — never localStorage
- AuthProvider bootstraps session via POST /auth/refresh then GET /users/me
- RequireAuth wrapper for dashboard/invoice routes
- TanStack Query for invoice list/detail state; invalidate on mutation
- React Hook Form + Zod for all forms (auth, invoice customization)
- DOMPurify for any user-generated rich text (invoice notes)
- Error boundary at root level

── Deliverables ─────────────────────────────────────────────────────────
1. .env.example for both backend and frontend with comments
2. Root .gitignore — node_modules/, .env*, keys, dist/build/.next; lockfile committed
3. .cursorignore mirroring sensitive paths
4. README with setup instructions + minimal CI (npm ci, typecheck, test, npm audit)
5. Postman collection + environment JSON under backend/postman/
6. TypeScript strict mode tsconfig.json for backend and frontend
7. Full API documentation for each endpoint following this PRD's Section 11 template
```

---

## 17. Open Questions / Future Scope

These are flagged for stakeholder decision before/during build — not blockers for starting scaffolding:

- **Free plan limits:** exact invoice-per-month cap and any watermark/branding rule for the Free Forever tier.
- **Email verification:** required before first invoice creation, or optional?
- **Multiple invoice templates:** how many at launch, and are they static layouts or fully composable?
- **Team/multi-user accounts:** out of scope for v1 (single owner per account) — confirm this is acceptable for launch.
- **Recurring invoices / reminders:** not in the mind-map — confirm out of scope for v1.
- **Payment collection on invoices** (e.g. "Pay Now" link via Stripe): not in the mind-map — confirm out of scope for v1.
- **Signature storage:** confirm whether drawn signatures should be reusable across invoices (saved to user profile) or re-drawn per invoice.

---

*This PRD should evolve alongside the Project Blueprint's maintenance rules (Section 13): update when integrations, auth strategy, or CI/git hygiene practices change. Dependency version numbers are never authoritative in this document — always verify at build time.*
