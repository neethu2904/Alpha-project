# Project Step-By-Step Guide

This file is the main documentation for the whole project.

Read this first if you are new to React, new to Laravel, or want to understand how the full project works from start to finish.

## 1. What this project is

This project is now split into 2 clear parts:

- `frontend/` = the React application that shows the UI in the browser
- `backend/` = the Laravel API that stores and serves data

This is a good structure because:

- React handles the screens and user experience
- Laravel handles the business logic and API
- the same Laravel API can later be reused for mobile apps

## 2. Folder structure

At the root of the project:

- `frontend/` contains the React app view files
- `backend/` contains the Laravel app
- `docs/` contains extra setup notes
- `PROJECT_STEP_BY_STEP_GUIDE.md` is this main guide
- `package.json` at root is used only to run frontend commands more easily
- `vite.config.ts` at root tells Vite that the real frontend lives in `frontend/`
- `vercel.json` at root tells Vercel to build the frontend from `frontend/`

## 3. Important frontend files

Inside `frontend/`:

- `frontend/index.html`
  This is the browser entry HTML file.

- `frontend/src/main.tsx`
  This is where React starts.

- `frontend/src/App.tsx`
  This is the main app controller for login, API loading, demo reset, and app state.

- `frontend/src/api/campusApi.ts`
  This is the API helper file that talks to Laravel.

- `frontend/src/components/CampusLogin.tsx`
  This is the login screen.

- `frontend/src/components/CampusWorkspace.tsx`
  This is the main dashboard area after login.

- `frontend/src/campusTypes.ts`
  This stores TypeScript types for the data shape.

- `frontend/src/campusDemoData.ts`
  This stores local fallback demo data when the API is not configured.

## 4. Important backend files

Inside `backend/`:

- `backend/routes/api.php`
  This defines the API routes used by the frontend.

- `backend/app/Http/Controllers/Api/V1/CampusController.php`
  This receives API requests and returns JSON responses.

- `backend/app/Support/Campus/CampusDataService.php`
  This prepares the campus data in the same structure the React frontend expects.

- `backend/database/migrations/`
  These files create the database tables.

- `backend/database/seeders/CampusDemoSeeder.php`
  This fills the database with demo data.

- `backend/tests/Feature/CampusApiTest.php`
  This checks that login and bootstrap data work correctly.

## 5. First-time setup

Do this when you open the project on a new machine.

### Backend setup

1. Open a terminal in the project root.
2. Go to the backend folder:

```powershell
cd backend
```

3. Install PHP packages if needed:

```powershell
composer install
```

4. Copy the environment file if needed:

```powershell
copy .env.example .env
```

5. Run migrations and seed demo data:

```powershell
php artisan migrate:fresh --seed
```

### Frontend setup

1. Open another terminal in the project root.
2. Install Node packages if needed:

```powershell
npm install
```

That root `npm install` is enough because the root package controls the frontend build commands.

## 6. How to run the project daily

### Start the backend API

From the project root:

```powershell
npm run dev:api
```

This starts Laravel on:

```text
http://127.0.0.1:8000
```

### Start the frontend

Open a second terminal and run:

```powershell
npm run dev
```

This starts the React frontend with Vite.

## 7. How frontend and backend connect

The frontend does not talk directly to the database.

The frontend talks to Laravel through HTTP API routes.

The flow is:

1. Browser opens the React app.
2. React shows the login screen.
3. User logs in.
4. React sends login data to Laravel API.
5. Laravel checks credentials.
6. Laravel returns:
   user session data
   full campus dashboard data
7. React stores that data in state and renders the dashboard.

## 8. API versioning

All main API routes are inside:

```text
/api/v1
```

This is important for the future.

Why:

- web frontend can use `/api/v1`
- mobile app can use `/api/v1`
- later you can create `/api/v2` without breaking old apps

## 9. What happens on login

Frontend login logic is in:

- `frontend/src/App.tsx`
- `frontend/src/api/campusApi.ts`

Backend login logic is in:

- `backend/routes/api.php`
- `backend/app/Http/Controllers/Api/V1/CampusController.php`

Step by step:

1. User enters `admin@demo.com` and `demo123`
2. React calls:

```text
POST /api/v1/auth/login
```

3. Laravel checks the `users` table
4. If valid, Laravel returns:

- `user`
- `data`

5. React saves the user session
6. React shows the dashboard

## 10. What happens when dashboard data changes

Inside React, when you add a student or company, the app updates local state first.

If the API is enabled, React also syncs the latest full data snapshot back to Laravel.

That happens through:

```text
PUT /api/v1/campus/sync
```

This is a simple and safe structure for now.

Later, you can improve it into separate API endpoints like:

- `POST /students`
- `PUT /students/{id}`
- `DELETE /students/{id}`

## 11. Why there is still local demo data in React

The frontend still has:

- `frontend/src/campusDemoData.ts`

This is useful as a fallback.

Why:

- if Laravel is not running, the UI can still load demo data
- you can keep working on design without waiting for backend changes
- it helps during fast demos

But the long-term goal should be:

- Laravel becomes the main source of truth
- React becomes only the UI layer

## 12. How the backend builds the API response

The key backend file is:

- `backend/app/Support/Campus/CampusDataService.php`

This file:

1. reads data from database tables
2. converts database column names into frontend field names
3. builds one clean JSON object
4. sends it back to React

Example:

- database may store `registration_number`
- frontend expects `registrationNumber`

This service handles that conversion.

## 13. Database tables used now

Main tables:

- `users`
- `departments`
- `students`
- `companies`
- `announcements`
- `company_applications`

These tables are created by the migration files in:

- `backend/database/migrations/`

## 14. How demo data gets inserted

The demo data is inserted by:

- `backend/database/seeders/CampusDemoSeeder.php`

This file creates:

- demo users
- demo departments
- demo students
- demo companies
- demo announcements

To reset everything to fresh demo data:

```powershell
cd backend
php artisan migrate:fresh --seed
```

Or from the browser app, use the reset button in the UI.

## 15. How to understand the React side if you are new

You said you do not know React, so use this order when reading files:

1. `frontend/src/main.tsx`
   This starts React.

2. `frontend/src/App.tsx`
   This is the main control center.

3. `frontend/src/api/campusApi.ts`
   This shows how React talks to Laravel.

4. `frontend/src/components/CampusLogin.tsx`
   This shows a simple screen component.

5. `frontend/src/components/CampusWorkspace.tsx`
   This is the large dashboard UI.

6. `frontend/src/campusTypes.ts`
   This helps you understand the data model.

## 16. How to add a new frontend page

Example: you want to add an Attendance page.

Step by step:

1. Create a new React component in:

```text
frontend/src/components/
```

2. Add a new tab or navigation item inside:

```text
frontend/src/components/CampusWorkspace.tsx
```

3. Add a render section for the new page
4. If the page needs data from backend, add a new API function in:

```text
frontend/src/api/campusApi.ts
```

5. If backend needs new data, add a Laravel route and controller logic

## 17. How to add a new backend API endpoint

Example: you want an attendance summary API.

Step by step:

1. Add a route in:

```text
backend/routes/api.php
```

2. Add controller logic in:

```text
backend/app/Http/Controllers/Api/V1/CampusController.php
```

3. If needed, add query logic in:

```text
backend/app/Support/Campus/CampusDataService.php
```

4. Test it using:

```powershell
php artisan test
```

## 18. How mobile apps will use this later

This project is already prepared for mobile use because the backend is API-based.

Future flow:

1. Keep Laravel as the main backend
2. Build mobile app separately
3. Mobile app calls the same API routes:

- `/api/v1/auth/login`
- `/api/v1/campus/bootstrap`
- `/api/v1/students`
- `/api/v1/companies`

That means:

- web frontend and mobile app can share the same backend
- you do not need to rebuild your backend again for mobile

## 19. Commands you should remember

From project root:

```powershell
npm run dev
```

Starts React frontend

```powershell
npm run dev:api
```

Starts Laravel backend

```powershell
npm run build
```

Builds frontend production files

From `backend/`:

```powershell
php artisan migrate:fresh --seed
```

Resets database and inserts demo data

```powershell
php artisan test
```

Runs backend tests

## 20. Important note about old files

There is still a root file called:

- `server.ts`

This is from the older structure and is no longer the main backend.

Now the real backend is Laravel inside:

- `backend/`

So for day-to-day work:

- use `frontend/` for UI
- use `backend/` for API and database
- ignore `server.ts` unless you want to remove old legacy code later

## 21. Recommended way to learn this project

If you are new, follow this order:

1. Read this file fully
2. Run the backend
3. Run the frontend
4. Open the app in the browser
5. Open `frontend/src/App.tsx`
6. Open `backend/routes/api.php`
7. Open `backend/app/Http/Controllers/Api/V1/CampusController.php`
8. Open `backend/app/Support/Campus/CampusDataService.php`

That order is the easiest way to understand the full flow.
