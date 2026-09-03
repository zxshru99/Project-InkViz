# API Documentation & Postman Synchronization Rule

Whenever you create, modify, or delete any API route, controller, service, middleware, or Zod schema in the backend:

---

## Mandatory Post-Modification Workflow

You **MUST ALWAYS** automatically execute the following three steps without waiting for explicit user prompts:

### 1. 📝 Update API Documentation
* Keep [`backend/API_DOCUMENTATION.md`](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/backend/API_DOCUMENTATION.md) in sync.
* Update:
  * Request method, path, and parameters.
  * Zod validation rules and required/optional payload fields.
  * Status codes (`200`, `201`, `400`, `401`, `403`, `404`, `409`, `429`, `500`).
  * Error codes (`VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, etc.).
  * Lifecycle state diagrams or business rules if relevant.

---

### 2. 📮 Sync Postman Workspace Collection
* Sync the Postman workspace collection (`Inkviz API` in the `InkViz` workspace) using the Postman MCP tool (`putCollection`).
* Ensure:
  * Proper folder categorization (**Health**, **Authentication**, **Users & Profile**, **Templates**, **Invoices**, **PDF Generation**).
  * Request body raw JSON matches the updated Zod schema.
  * Collection-level Bearer token inheritance (`{{accessToken}}`) and auto-token extraction test scripts remain intact.
* Update local backup file [`backend/Inkviz_Postman_Collection.json`](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/backend/Inkviz_Postman_Collection.json).

---

### 3. 🧪 Verify TypeScript & Build Integrity
* Run `npm run typecheck` in `backend/` to verify zero TypeScript compilation errors.
* Ensure all routes match their Express router definitions.
