
# EcoReport Community Platform (Frontend Only)

A modern, UI-focused React app for reporting environmental issues locally and visualizing them on an interactive Leaflet map.

## What Changed
- Backend dependency removed from local development workflow.
- `npm run dev` now starts only the frontend.
- Authentication is local and demo-only for UI work:
  - **Username:** `admin`
  - **Password:** `Admin@123`
- Issue reports are stored in browser `localStorage` and instantly displayed on the map.

## Tech Stack
- React + Vite
- Leaflet.js + React Leaflet
- Browser Geolocation API
- localStorage for local session + issue persistence

## Run Locally

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Notes
- This setup is intentionally frontend-only for fast UI editing and prototyping.
- No PostgreSQL, Express server, JWT verification, or Google OAuth setup is required in this mode.
