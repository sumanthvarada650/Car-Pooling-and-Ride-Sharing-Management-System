<p align="center">
  <img src="images/logo-transparent.png" alt="ShareCar Logo" width="130" />
</p>

# ShareCar — Carpool Management System

A full-stack **carpool management platform** with a rich web interface inspired by a modern carpool-inspired design language, powered by a **PostgreSQL 3NF relational database** architecture.

## 🚗 Features

### Web Interface (`Car-Ride Sharing/`)
- **Intercity Carpool** — Schedule city-to-city shared rides (Mumbai → Pune, Bengaluru → Chennai, Delhi → Jaipur, etc.)
- **Within-City Commute** — Real-time urban express carpool within a city
- **Modern Carpool-Inspired Design** — Electric Sky Blue (#00AFF5) + Deep Forest Navy (#054752) color palette
- **Seat Booking with ACID Transactions** — Multi-seat reservations with atomic wallet deductions
- **Publish a Ride** — Driver flow to offer seats on any intercity or urban route
- **Wallet System** — Passenger top-up and balance management
- **PostgreSQL DB Inspector** — Browse all 3NF tables and export live SQL dumps
- **Driver Ratings & Reviews** — Dynamic weighted rating system

### Database (`sql/`)
- **Schema DDL** — Original T-SQL schema (reference)
- **PostgreSQL Schema** — Native PostgreSQL DDL with enums, ACID transactions, and 3NF relationships

## 🐘 Database Architecture (3NF)

```
app_user ──────────────┐
    │                   │
    ├──► passenger      │
    │    (wallet,       │
    │     balance)      │
    │                   │
    └──► driver ──────► vehicle
              │
              └──► carpool_ride ──► location (origin)
                        │        └─► location (destination)
                        │
                        └──► ride_booking ──► passenger
                                  │
                                  └──► payment
```

**Tables**: `app_user`, `location`, `passenger`, `driver`, `vehicle`, `carpool_ride`, `ride_booking`, `payment`, `review`, `support_team`, `customer_support`, `safety_report`

## 🚀 Running Locally

```bash
# Serve the web interface
cd "Car-Ride Sharing"
python3 -m http.server 8787
# Open: http://localhost:8787
```

## 🗄️ PostgreSQL Setup

```bash
# Create database
createdb sharecar_db

# Apply schema
psql sharecar_db < sql/postgresql_schema.sql
```

Or use **DBeaver** / **pgAdmin** to connect and run the schema.

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, Vanilla CSS, Vanilla JS    |
| Design     | Modern carpool UI/UX          |
| Database   | PostgreSQL 16 (3NF normalized)    |
| Hosting    | Any static file server            |

## 📁 Project Structure

```
Carpool-Management-System-DBMS/
├── Car-Ride Sharing/          ← Web Application
│   ├── index.html             ← Main page (ShareCar UI)
│   ├── css/styles.css         ← ShareCar design system
│   ├── js/app.js              ← Application controller
│   └── js/db.js               ← In-memory PostgreSQL engine (3NF ACID)
├── sql/
│   ├── postgresql_schema.sql  ← Native PostgreSQL DDL + seed data
│   ├── Schema_DDL.sql         ← Original T-SQL schema (reference)
│   ├── Business_Logic.sql     ← T-SQL business logic (reference)
│   ├── Data_DML.sql           ← Sample data (reference)
│   └── Verification.sql       ← Query verification (reference)
└── diagrams/
    ├── ER_Diagram.png
    └── Schema_Diagram.png
```
