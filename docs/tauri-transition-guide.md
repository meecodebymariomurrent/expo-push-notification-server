# Tauri Migration Guide (Feature-Parity)

## Goal

Move this project to **Tauri** while keeping the same functional behavior:

- user login/registration
- app identifier CRUD
- subscriber registration/list/update
- push notification publishing through Expo
- health checks and auth protection

---

## Recommended Target Architecture

For true parity (including mobile clients registering subscribers), use a **hybrid architecture**:

1. **Tauri Desktop App** = new admin UI built with **React**.
2. **Backend API** = network-accessible **Strapi** service.
3. **Database** = relational DB used by Strapi (PostgreSQL recommended).

Why: subscriber registration and push workflows depend on reachable API endpoints. A purely local desktop-only backend would break remote client flows.

---

## Migration Strategy (Low-Risk, Phased)

## Phase 1 - Build Tauri + React Desktop UI

Rebuild the current frontend behavior in React and run it inside Tauri:

1. Create React app structure for pages: login, register, home, app identifier, settings.
2. Add Tauri project and wire it to the React build/dev server.
3. Recreate current route protection and auth/session UX behavior.
4. Keep all HTTP calls to backend (`http://localhost:4545` in dev; configurable URL for prod).
5. Keep token storage behavior (localStorage or Tauri plugin storage).

**Outcome:** Desktop app UX with no functional regression.

## Phase 2 - Migrate Backend to Strapi (with API Parity)

1. Model Strapi content types: `user`, `subscriber`, `appIdentifier`, `notifications`.
2. Implement custom Strapi controllers/routes so existing endpoint contracts remain compatible.
3. Keep JWT interceptor and route guard behavior in UI.
4. Add environment switching in UI for backend URL (dev/staging/prod).
5. Validate all current user flows:
   - login
   - register
   - list/create/delete app identifiers
   - list subscribers
   - publish notifications
6. Keep old Node backend available until Strapi parity is confirmed.

**Outcome:** Same functionality, desktop-distributed.

## Phase 3 - Hardening and Cutover

After Strapi parity:

1. Remove Node/RethinkDB dependencies from deployment.
2. Keep request/response contracts identical (or version APIs if intentionally changing).
3. Keep JWT and protected-route behavior equivalent.
4. Finalize Expo push publish path in Strapi service layer.

**Outcome:** Tauri + Strapi stack in production with full feature parity.

---

## Feature Mapping (Current -> Tauri Transition)

| Current Capability | Current Location | Tauri Transition |
|---|---|---|
| Login (`POST /login`) | Node controller/service + Angular login page | Recreate in React UI + Strapi auth/custom route with same response shape |
| Register (`POST /user/create`) | Node + Angular register page | Recreate in React UI + Strapi custom user-create endpoint |
| App Identifier list/create/delete | Node app-identifier/user controllers + Angular page/components | Recreate pages/components in React; keep URI parity in Strapi |
| Subscriber exists/create/update/list | Node subscriber/user controllers | Implement Strapi routes/services for token-based lookup and updates |
| Publish notifications (`POST /notification/publish`) | Node notification controller using expo-server-sdk | Move logic to Strapi service (Expo API integration) |
| JWT auth middleware | Node middleware + Angular interceptor | Keep bearer flow; implement equivalent React HTTP client interceptor behavior |
| Health checks | `/health/live`, `/health/check` | Keep same endpoints for monitoring and auth test |

---

## Endpoint Parity Checklist

Keep these endpoints and semantics unchanged during migration:

- `POST /login`
- `POST /user/create`
- `GET /user/:id/appIdentifier`
- `POST /appIdentifier/create` (JWT)
- `DELETE /appIdentifier/:id` (JWT)
- `POST /subscriber/exists`
- `POST /subscriber/create`
- `POST /subscriber/:id`
- `GET /user/:id/subscriber` (JWT)
- `POST /notification/publish` (JWT)
- `GET /health/live`
- `GET /health/check` (JWT)

---

## Data & Security Compatibility

## Data

1. Migrate to Strapi-managed schema for `user`, `subscriber`, `appIdentifier`, `notifications`.
2. Use PostgreSQL with Strapi migrations/content-type sync.
3. Recreate default admin bootstrap in Strapi startup/bootstrap logic.
4. Preserve payload shapes to avoid frontend/mobile changes.

## Security

1. Keep SHA-256 password hashing behavior in UI until backend auth model is deliberately changed.
2. Keep JWT bearer flow exactly the same in first migration.
3. Preserve 401 handling behavior (redirect to login).

---

## Suggested Repository Refactor

## Short term

- `client/` -> React + Tauri desktop app
- `src/` -> existing Node API (temporary, until Strapi cutover)

## Medium term (optional)

- `apps/desktop` -> Tauri + React frontend
- `apps/api` -> Strapi API
- `packages/shared-contracts` -> shared DTOs/types for endpoint parity

---

## Build & Release Plan

1. Add Strapi deployment pipeline (environment config, secrets, DB migrations).
2. Add Tauri desktop builds (macOS/Windows/Linux).
3. Inject backend base URL by environment at build time.
4. Release desktop app against Strapi staging, then cut over production.

---

## Risks and How to Avoid Regressions

1. **Risk:** breaking mobile subscriber registration with local-only backend.  
   **Mitigation:** keep network-accessible backend in Phase 1/2.

2. **Risk:** auth drift between Node and Strapi implementation.  
   **Mitigation:** freeze JWT contract and protected endpoint behavior.

3. **Risk:** silent payload incompatibilities.  
   **Mitigation:** contract tests for each endpoint before Strapi cutover.

4. **Risk:** partial feature migration (already-empty schedule endpoints).  
   **Mitigation:** preserve status quo first; implement missing features after parity.

---

## Practical First Sprint (What to Build First)

1. Scaffold Tauri + React desktop app and implement login/register flows.
2. Stand up Strapi with content types and parity endpoints.
3. Verify all existing UI flows against Strapi staging.
4. Add configurable backend URL and package one target OS alpha build.

This delivers Tauri transition with a clear **Strapi-first** backend migration path and minimal functional risk.
