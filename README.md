# LeadFlow – Lead Management Dashboard

A small CRM-style app for sales users to add, track, and organize leads. Built as a Full Stack Developer screening assignment.

## Features
- Add, view, edit, and delete leads (delete asks for confirmation)
- Search by name and filter by status (handled by the API, so it works on the full dataset)
- Summary strip with Total / New / Contacted / Qualified / Lost, calculated from the database
- Validation on both frontend and backend (required fields, email format, phone format, allowed source/status values)
- Loading, empty, error (with retry), and success states
- Responsive layout: the table turns into stacked rows on small screens

## Tech stack
- **Frontend:** React 18 + Vite, plain CSS, Fetch API
- **Backend:** Node.js, Express 4, Mongoose
- **Database:** MongoDB (Atlas)

## Project structure
```
leadflow/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/Lead.js            # Mongoose schema
│   ├── controllers/leadController.js
│   ├── routes/leadRoutes.js
│   ├── middleware/validateLead.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/leadsApi.js       # all fetch calls
    │   ├── components/           # StatsBar, Toolbar, LeadTable, LeadModal, ConfirmDialog, Toast, StatusBadge
    │   ├── App.jsx               # state and data loading
    │   └── styles.css
    └── .env.example
```

## Setup
Requires Node.js 18+ and a MongoDB Atlas cluster (or any MongoDB instance).

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit .env
npm run dev              # or: npm start
```

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Your MongoDB connection string. In Atlas: Connect → Drivers. Remember to add your IP under Network Access. |
| `CLIENT_URL` | Frontend origin allowed by CORS (default `http://localhost:5173`) |

`.env` is git-ignored; never commit real credentials.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. In development, Vite proxies `/api` to `http://localhost:5000`, so no frontend config is needed. If you deploy the API elsewhere, set `VITE_API_URL` (see `frontend/.env.example`).

## API
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/leads?search=&status=` | List leads (newest first) |
| GET | `/api/leads/stats` | Counts per status and total |
| GET | `/api/leads/:id` | Get one lead |
| POST | `/api/leads` | Create a lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

Errors return JSON: `{ "message": "...", "errors": { field: "..." } }` with 400 (validation / bad ID), 404 (not found), or 500.

## Assumptions
- Single-user tool: there is no login, so anyone who can reach the API can manage leads.
- All fields are required. Phone accepts digits, spaces, `+`, `-`, and parentheses with 7–15 digits.
- Sources are a fixed list: Website, Referral, LinkedIn, Cold Call, Event, Other.
- Duplicate emails are allowed, since the brief doesn't say otherwise.

## Possible future improvements
- Authentication and per-user leads
- Pagination and column sorting
- Notes / activity history per lead
- Duplicate-email warning
- CSV import/export
- Automated tests (API with Jest + Supertest, UI with Vitest)
