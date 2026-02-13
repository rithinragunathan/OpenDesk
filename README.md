# EcoReport Community Platform

A community-based digital platform for reporting environmental issues with secure authentication, geolocation-assisted reporting, and interactive map visualization.

## Tech Stack
- **Frontend:** React + Vite, Leaflet.js
- **Backend:** Express.js REST API
- **Authentication:** JWT + Google ID token sign-in, password hashing and salting via bcrypt
- **Database:** PostgreSQL
- **Location:** Browser Geolocation API + map markers

## Features
- Email/password registration and login
- Google sign-in endpoint integration (`/api/auth/google`) with ID token verification
- JWT-protected issue reporting endpoint
- Password hashing + salting to strengthen account security
- Interactive map with issue hotspots
- Geolocation capture to auto-fill coordinates while reporting

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create `server/.env`:
```env
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgres://postgres:postgres@localhost:5432/environmental_platform
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRY=8h
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

### 3. Start PostgreSQL and create DB
```sql
CREATE DATABASE environmental_platform;
```

### 4. Run app
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/issues`
- `POST /api/issues` (requires `Authorization: Bearer <jwt>`)

## Security Notes
- Passwords are never stored as plain text.
- JWT secures authenticated API access.
- Use HTTPS and secure cookie/token policies in production.
