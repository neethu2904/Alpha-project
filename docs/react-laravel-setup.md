# React + Laravel Setup

This project now supports a split architecture:

- `frontend/` is the React frontend.
- `backend/` is the Laravel 12 API backend.

## Local development

1. Start Laravel API:

```powershell
npm run dev:api
```

2. Start React frontend in a second terminal:

```powershell
npm run dev
```

## Environment

The frontend reads these variables from the root `.env`:

```env
VITE_API_BASE_URL=/api/v1
LARAVEL_DEV_URL=http://127.0.0.1:8000
```

- `VITE_API_BASE_URL=/api/v1` keeps the frontend API-ready while using the Vite proxy during local development.
- For separate deployments, set `VITE_API_BASE_URL` to the full Laravel API URL such as `https://api.example.com/api/v1`.

## Laravel API endpoints

The Laravel backend exposes versioned endpoints under `/api/v1`:

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /campus/bootstrap`
- `POST /campus/reset`
- `GET /departments`
- `POST /departments`
- `GET /students`
- `POST /students`
- `GET /companies`
- `POST /companies`
- `POST /companies/{company}/apply`
- `GET /announcements`
- `POST /announcements`
- `GET /reports/summary`

All module routes now use Laravel Sanctum bearer tokens plus Spatie role/permission checks.

## Mobile future

The React app already talks to versioned Laravel endpoints, so the same backend can later be reused for:

- React Native
- Flutter
- native Android/iOS apps

The backend is now set up for:

1. Laravel Sanctum token authentication.
2. Spatie module-wise roles and permissions.
3. Permission-aware CRUD-style module actions instead of raw snapshot syncing.

Typical next production steps would be:

1. Add update/delete endpoints for each module.
2. Add pagination, filters, and search on list endpoints.
3. Add user management screens for assigning roles and permissions from the UI.

## Frontend location

Important frontend files are now inside the `frontend/` folder:

- `frontend/index.html`
- `frontend/src/App.tsx`
- `frontend/src/components/`
- `frontend/src/api/`

The root `package.json`, `vite.config.ts`, and `tsconfig.json` stay at the project root only to make the commands simpler.
