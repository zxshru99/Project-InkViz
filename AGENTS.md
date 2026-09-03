# Workspace Agent Rules & Workflow Standards

## 1. Mandatory Testing Workflow (CLI + MongoDB)
- **CLI-Driven API Execution:** Always use CLI commands (Terminal, `curl`, PowerShell, or executable Node/TypeScript scripts) to send HTTP requests (`GET`, `POST`, `PATCH`, `DELETE`) to the API endpoints.
- **Immediate MongoDB Verification:** After making CLI requests, immediately query and verify the real-time database state directly against MongoDB Atlas (checking document creation, updates, calculations, soft-deletions, or removals).
- **Zero-Bypass Policy:** Never mock or bypass HTTP network calls or database checks.

## 2. Autonomous Execution & Permissions
- **Proactive Execution:** Automatically apply code changes, create files, edit files, and execute verification terminal commands without stopping to ask for manual permission for routine coding actions.

## 3. Mandatory API Modification Workflow
Whenever API routes, controllers, schemas, or models in `backend/` are created, updated, or deleted:
1. **Documentation Sync:** Automatically update [`backend/API_DOCUMENTATION.md`](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/backend/API_DOCUMENTATION.md).
2. **Postman Sync:** Update the live Postman workspace collection via Postman MCP (`putCollection`) and update [`backend/Inkviz_Postman_Collection.json`](file:///c:/Users/samri/OneDrive/Desktop/BackendUsingAi/backend/Inkviz_Postman_Collection.json).
3. **TypeScript Verification:** Run `npm run typecheck` to confirm zero compilation errors.
