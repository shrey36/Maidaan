# ⚽ Maidaan — MERN Stack Sports Turf Discovery & Booking Platform

> **"Your Game. Your Maidaan."**

Maidaan has been fully migrated to the **MERN Stack** (MongoDB + Mongoose, Express.js, React + Vite, Node.js), preserving 100% of the approved UI/UX design, dark sports-tech color theme, interactive slot booking flows, and features!

---

## 🛠️ MERN Technology Stack

- **Frontend (`client/`)**: React 18, React Router v6, Context API (`AuthContext`), Vite, Vanilla CSS design tokens.
- **Backend (`server/`)**: Node.js + Express.js REST API, JWT authentication, `bcryptjs` password hashing.
- **Database**: **MongoDB** with Mongoose schemas (supports MongoDB Atlas URI as well as zero-config local fallback via `mongo-memory-server`).

---

## 🔑 Demo Credentials

| Role | Email | Password | Features |
|---|---|---|---|
| **User** | `user@maidaan.com` | `password123` | Turf booking, My Bookings, Team Builder, Profile |
| **Admin** | `admin@maidaan.com` | `admin123` | Admin Dashboard, Add/Delete Turfs, View All Bookings |

*Clickable auto-fill buttons are available on the Login page (`/login`).*

---

## 📁 Folder Structure

```text
Maidaan/
├── client/                     # React Frontend (Vite + React Router)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, TurfCard, ProtectedRoute
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # Home, Login, Signup, Turfs, TurfDetails, Bookings, Profile, Players, Team, Tournaments, Auction, Admin
│   │   ├── services/           # api.js REST HTTP Client
│   │   ├── styles/             # style.css, components.css, responsive.css
│   │   ├── App.jsx             # React Router v6 Routes
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express.js Backend
│   ├── config/
│   │   └── db.js               # MongoDB Connection (Atlas + fallback)
│   ├── controllers/            # Auth, Turf, Booking, User, Player, Team, Tournament, Admin Controllers
│   ├── middleware/             # Auth JWT, Admin Role, Error Handlers
│   ├── models/                 # Mongoose Schemas (User, Turf, Booking, Player, Team, Tournament)
│   ├── routes/                 # Express API Routes (/api/auth, /api/turfs, /api/bookings, etc.)
│   ├── seed/
│   │   └── seed.js             # Database Seeder (10 Turfs, Demo Users, Players, Teams)
│   ├── app.js                  # Express App Setup
│   ├── server.js               # Server Entry Point
│   └── package.json
├── README.md
├── .gitignore
└── package.json                # Root package for single-command startup
```

---

## 🚀 How to Run the MERN Project Locally

### Step 1: Install Dependencies
In the root directory, run:
```bash
npm run install:all
```
*(Installs root, `server`, and `client` dependencies).*

---

### Step 2: Seed the MongoDB Database
Run:
```bash
npm run seed
```
*(Populates MongoDB with 10 Goa turfs, demo users, players, team, and tournaments).*

---

### Step 3: Start Both Backend & Frontend Simultaneously
Run:
```bash
npm run dev
```

- **Express Backend**: `http://localhost:5001`
- **React Frontend**: `http://localhost:5173`

---

## 🌐 REST API Endpoints Overview

### Authentication
- `POST /api/auth/register` — Register new user account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Get current logged in user details

### Turfs & Availability
- `GET /api/turfs` — List/filter turfs (search, sport, location, price, rating)
- `GET /api/turfs/:id` — Get turf details by ID
- `GET /api/turfs/:id/availability?date=YYYY-MM-DD` — Get hourly slot availability for a date

### Bookings
- `POST /api/bookings` — Create a new turf booking (verifies slot availability)
- `GET /api/bookings/my` — Get user's bookings list
- `GET /api/bookings/:id` — Get single booking details
- `PUT /api/bookings/:id/cancel` — Cancel an upcoming booking

### Players, Teams & Tournaments
- `GET /api/players` — Search players directory
- `GET /api/teams/my` — Get user's personal team
- `POST /api/teams` — Create team
- `POST /api/teams/:teamId/add-player/:playerId` — Add player to squad
- `GET /api/tournaments` — List upcoming tournaments

### Admin (`ROLE_ADMIN` Required)
- `POST /api/admin/turfs` — Create new turf
- `PUT /api/admin/turfs/:id` — Edit turf details
- `DELETE /api/admin/turfs/:id` — Delete turf
- `GET /api/admin/bookings` — View all system user bookings
- `GET /api/admin/users` — View all registered users
