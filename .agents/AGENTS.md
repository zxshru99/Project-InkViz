# Agent Guidelines & Mandatory Workflows

## 1. Mandatory Testing Workflow (CLI + MongoDB)
- **CLI Requests Only:** Always use CLI commands (Terminal, `curl`, PowerShell, or executable Node/TypeScript scripts) to send HTTP requests (`GET`, `POST`, `PATCH`, `DELETE`) to the API endpoints.
- **Immediate MongoDB Verification:** Verify the database state directly in MongoDB Atlas after every CLI request.

## 2. Autonomous Execution & Permissions
- Proactively execute code changes and terminal diagnostic commands without manual confirmation on routine steps.

## 3. Automatic API & Postman Sync
- On any API change, keep `backend/API_DOCUMENTATION.md` and Postman synced, and ensure `npm run typecheck` passes with zero errors.
