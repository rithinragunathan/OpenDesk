# EcoReport Elite Console (Frontend Only)

This version provides distinct role-based UX with richer animation and glass UI:

- **Citizen Portal**: submit requests with area, auto-fetch location if needed, track status (`Kept`, `In Review`, `Resolved`, `Declined`).
- **Staff Portal**: review requests from multiple citizens and mark issues as `Resolved` or `Declined`.
- **Admin Control Center**: full monitoring access, status updates, support notes, system health/requests metrics.

## Demo Accounts
- Citizen: `citizen` / `Citizen@123`
- Staff: `staff` / `Staff@123`
- Admin: `admin` / `Admin@123`

## UX Notes
- Map is **on-demand** (toggle button), not always visible.
- If citizen does not provide area, app attempts geolocation and auto-fills area/coordinates.
- All data persists in browser `localStorage`.

## Run
```bash
npm install
npm run dev
```
