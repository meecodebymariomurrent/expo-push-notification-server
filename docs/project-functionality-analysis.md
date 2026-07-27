# Expo Push Notification Server - Project Functionality Analysis

## Overview

This project is a full-stack Expo push notification management system:

1. **Backend (`src/`)**: Node.js + TypeScript API built with Express and Inversify, using RethinkDB for persistence.
2. **Frontend (`client/`)**: Angular + PrimeNG web UI for user login, app identifier management, subscriber viewing, and notification publishing.

Its main purpose is to let an authenticated user manage app identifiers, receive subscriber registrations from Expo clients, and send push notifications to selected subscribers.

## High-Level Architecture

### Backend

- **Entry point**: `src/app.ts`
- **Dependency injection**: Inversify container (`src/config/container.ts`)
- **Database**: RethinkDB via `rethinkdb-ts` (`src/services/database.service.ts`)
- **Security middleware**: JWT bearer token validation (`src/middleware/jwt.middleware.ts`)
- **Logging**: Winston + express-winston

On startup, the backend:

1. Loads environment variables from `.env`.
2. Connects to RethinkDB.
3. Creates database/tables if missing.
4. Ensures a default admin user exists (from `src/config/database-configuration.json`).
5. Starts HTTP server (default port `4545` from `.env.defaults`).

### Frontend

- **Framework**: Angular 15
- **UI**: PrimeNG
- **Backend URL**: `http://localhost:4545` (environment config)
- **Routing**: login, register, home, app identifier, settings

The frontend stores auth token/user ID in browser storage, attaches bearer tokens through an HTTP interceptor, and guards private routes with an auth guard.

## Core Backend Functionality

## 1) Authentication

- **Endpoint**: `POST /login`
- Validates request payload (`username`, `password`).
- Compares credentials against stored user.
- Creates JWT (`expiresIn: 1h`) on success.
- Returns `{ loggedIn, token, userId }`.

Session tracking also exists in memory (`SessionService`), but persistence is token-driven (JWT + client storage).

## 2) User Registration

- **Endpoint**: `POST /user/create`
- Creates a user if username does not already exist.
- Returns conflict error when username already exists.

Frontend hashes password with SHA-256 before sending.

## 3) App Identifier Management

- **List**: `GET /user/:id/appIdentifier`
- **Create**: `POST /appIdentifier/create` (JWT protected)
- **Delete**: `DELETE /appIdentifier/:id` (JWT protected)

App identifiers map a user to logical app names used by subscribers.

## 4) Subscriber Registration and Management

- **Check existing subscriber**: `POST /subscriber/exists`
- **Create subscriber**: `POST /subscriber/create`
- **Update subscriber**: `POST /subscriber/:id`
- **List user subscribers**: `GET /user/:id/subscriber` (JWT protected)

Subscribers are keyed by Expo push token and linked to an `appIdentifierId`.

## 5) Push Notification Publishing

- **Endpoint**: `POST /notification/publish` (JWT protected)
- Accepts title, message, and array of subscriber tokens.
- Uses `expo-server-sdk` to send push notifications.
- Returns Expo receipt data.

## 6) Health Endpoints

- **Liveness**: `GET /health/live`
- **Authenticated health check**: `GET /health/check` (JWT protected)

Liveness becomes unhealthy if an uncaught exception occurs (`tainted` flag).

## Data Model Summary

Configured RethinkDB tables:

- `user`
- `subscriber`
- `appIdentifier`
- `notifications` (defined, but not fully used in current code)

Key entities:

- **User**: `id`, `username`, `password`
- **AppIdentifier**: `id`, `name`, `userId`
- **Subscriber**: `token`, `appIdentifierId`, `lastUpdate`, `expired`, `userId`

## Frontend Functionality (Current UI)

## 1) Login Page

- Authenticates via `/login`.
- Stores JWT/user ID locally.
- Redirects to home on success.

## 2) Register Page

- Registers user via `/user/create`.
- Shows success toast flow and option to go to login.

## 3) Home Page

- Displays subscriber table.
- Allows selecting subscribers.
- Opens dialog to publish notifications.

## 4) App Identifier Page

- Lists app identifiers.
- Allows create and bulk delete actions.

## 5) App Shell

- Top toolbar + side menu + about dialog.
- Logout clears stored auth data and routes to login.

## Current Gaps / Partially Implemented Areas

The repository contains placeholders or incomplete features:

1. `POST /notification/schedule` and `GET /notification/scheduled` are empty.
2. Subscriber expiration action (`expireSelectedSubscriber`) is not implemented in UI component.
3. Settings page is a placeholder (`settings-page works!`).
4. Some endpoint protection is inconsistent (e.g., `GET /user/:id/appIdentifier` is not JWT-protected while related operations are).

## Operational Notes

- Root backend run script is `npm run serve` (nodemon with `src/app.ts`).
- Frontend dev script is `npm start` inside `client/`.
- Docker compose includes app service + RethinkDB service.

