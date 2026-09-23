# ShareCar India — Master DBMS Architecture, Normalization & ACID Project Report

**Project Title**: ShareCar — Intercity & Urban Tech Corridor Carpooling System  
**Architecture**: 3rd Normal Form (3NF) Relational Database Management System  
**Database Engine**: PostgreSQL 16+ with ACID Concurrency Control  
**Application Stack**: Node.js, Express REST API, Vanilla JavaScript, HTML5, CSS3  

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [ER Diagram & Conceptual Schema Alignment](#2-er-diagram--conceptual-schema-alignment)
3. [Relational Schema & Constraint Architecture](#3-relational-schema--constraint-architecture)
4. [Deep-Dive: Normalization Theory & 3NF Justification](#4-deep-dive-normalization-theory--3nf-justification)
5. [Transaction Management & ACID Implementation](#5-transaction-management--acid-implementation)
6. [Concurrency Control & Row-Level Locking](#6-concurrency-control--row-level-locking)
7. [Step-by-Step PostgreSQL Setup & Access Guide](#7-step-by-step-postgresql-setup--access-guide)
8. [Backend Architecture & Dual-Mode Engine](#8-backend-architecture--dual-mode-engine)
9. [DBMS Viva / Exam Presentation Cheat Sheet](#9-dbms-viva--exam-presentation-cheat-sheet)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Business & Technological Challenge
Highway travel and urban tech commutes in India (e.g., Mumbai–Pune Expressway, Bengaluru Silk Board–ITPL, Delhi–Gurugram Cyber Hub) face two major problems:
1. **Severe Traffic & Highway Congestion**: Millions of single-occupancy private cars travel identical corridors daily.
2. **High Fuel Costs**: Private vehicle owners bear 100% of fuel and toll expenses, while commuters face exorbitant cab fares.

### 1.2 Why a Relational DBMS (RDBMS) is Mandatory
Carpool seat booking is a **mission-critical financial and logistical transaction**. Unlike social media posts or view counts where eventual consistency is acceptable, carpool systems require **strict serializability and relational integrity**:
- **Zero Overbooking**: A car has a fixed physical capacity (e.g., 4 or 6 seats). Two passengers booking the final seat concurrently must **never** result in double allocation.
- **Financial Ledger Consistency**: Debiting the passenger's wallet and crediting the driver's balance must execute **atomically** (all-or-nothing).
- **Referential Integrity**: A booking cannot exist without a valid passenger, an active ride, and a registered driver with an RTO license.

Therefore, **PostgreSQL with 3NF normalization and ACID transactions** was selected as the core engine.

---

## 2. ER Diagram & Conceptual Schema Alignment

### 2.1 Verification Against `diagrams/ER_Diagram.png`
The relational implementation exactly mirrors the provided **Entity-Relationship Diagram** and **Schema Diagram**:

```
                         ┌──────────────┐
                         │   app_user   │
                         └──────┬───────┘
                                │ (ISA Hierarchy)
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌──────────────┐              ┌──────────────┐
         │  passenger   │              │    driver    │
         └──────┬───────┘              └──────┬───────┘
                │                             │ 1
                │                             ▼ N
                │                      ┌──────────────┐
                │                      │   vehicle    │
                │                      └──────────────┘
                │                             │ 1
                │                             ▼ N
                │                      ┌──────────────┐
                │                      │ carpool_ride │◄─── (Origin & Dest Location)
                │                      └──────┬───────┘
                │                             │ 1
                │ M                           ▼ N
                └─────────────────────►┌──────────────┐
                   (Resolves M:N)      │ ride_booking │
                                       └──────┬───────┘
                                              │ 1:1
                                              ▼
                                       ┌──────────────┐
                                       │   payment    │
                                       └──────────────┘
```

### 2.2 Entity Catalogue & Cardinalities

| Entity / Table | Primary Key | Foreign Keys | Relationship / Cardinality | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`app_user`** | `user_id` | *None* | Root Parent Entity | Base identity: Aadhaar KYC (`nid`), name, email, phone, password hash. |
| **`passenger`** | `passenger_id` | `app_user(user_id)` | **1 : 1** with `app_user` | Specialized user role with wallet `balance` and verification status. |
| **`driver`** | `driver_id` | `app_user(user_id)` | **1 : 1** with `app_user` | Specialized user role with RTO `license_number`, `avg_rating`, `ride_count`. |
| **`vehicle`** | `vehicle_id` | `driver(driver_id)` | **1 : N** (1 driver owns N vehicles) | Vehicle registry: brand, model, license plate, fuel type, seating capacity. |
| **`location`** | `location_id` | *None* | **1 : N** referenced by rides | Transit hubs, metro stations, highway toll plazas with latitude & longitude. |
| **`carpool_ride`** | `ride_id` | `driver_id`, `origin_id`, `dest_id` | **1 : N** from driver; references 2 locations | Trip offered by a driver with departure time, available seats, fare per seat. |
| **`ride_booking`** | `booking_id` | `ride_id`, `passenger_id` | **M : N associative junction** | Resolves the many-to-many relationship between passengers and rides. |
| **`payment`** | `payment_id` | `booking_id`, `user_id` | **1 : 1** with `ride_booking` | Financial ledger: amount in INR (₹), method (UPI/Wallet), transaction ID. |
| **`review`** | `review_id` | `ride_id`, `passenger_id`, `driver_id` | **Ternary association** | Trip rating (1–5 stars) and passenger feedback after trip completion. |
| **`support_team`** | `support_staff_id`| *None* | Independent | Customer service agents, KYC specialists, operations managers. |
| **`customer_support`**| `ticket_id` | `user_id`, `assigned_staff_id` | **N : 1** to user & staff | Inquiry management: FASTag questions, UPI refund tickets. |
| **`safety_report`** | `report_id` | `reporter_id`, `reported_id` | **N : 1** to app_user | Incident tracking and compliance under Motor Vehicles safety regulations. |

---

## 3. Relational Schema & Constraint Architecture

### 3.1 DDL Integrity Constraints
In PostgreSQL, data correctness is guaranteed through multi-layered constraints:

```sql
-- 1. Entity Integrity (Primary Keys)
user_id SERIAL PRIMARY KEY,
ride_id SERIAL PRIMARY KEY,

-- 2. Referential Integrity (Foreign Keys with Cascade / Restrict)
passenger_id INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
driver_id INT NOT NULL REFERENCES driver(driver_id) ON DELETE RESTRICT,

-- 3. Domain Check Constraints
balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0.00), -- No negative wallet
available_seats INT NOT NULL CHECK (available_seats >= 0),    -- Prevents overbooking
rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),          -- 1 to 5 star ratings

-- 4. Unique Constraints (Candidate Keys)
nid VARCHAR(50) UNIQUE NOT NULL,            -- Unique Aadhaar ID
email VARCHAR(255) UNIQUE NOT NULL,         -- Unique email
license_number VARCHAR(50) UNIQUE NOT NULL, -- Unique RTO Driver License
license_plate VARCHAR(40) UNIQUE NOT NULL   -- Unique Vehicle Number Plate
```

---

## 4. Deep-Dive: Normalization Theory & 3NF Justification

Normalization is the systematic process of decomposing relations to **minimize data redundancy** and **eliminate insertion, deletion, and update anomalies**.

### 4.1 The Unnormalized Form (UNF) Anti-Pattern
If the carpool system were implemented in a single unnormalized table (like a spreadsheet):

$$\text{UNF}(\text{BookingID}, \text{PassengerName}, \text{PassengerAadhaar}, \text{DriverName}, \text{DriverLicense}, \text{CarModel}, \text{Origin}, \text{Dest}, \text{Seats}, \text{Fare})$$

This produces three classical DBMS anomalies:
1. **Insertion Anomaly**: We cannot register a new driver or vehicle until they publish their very first ride with an active passenger.
2. **Deletion Anomaly**: If a passenger cancels the only booking for a trip and we delete the record, we accidentally delete the driver's license number and vehicle details from our system.
3. **Update Anomaly**: If a driver changes their vehicle or phone number, we must update hundreds of past booking rows. Missing a single row creates contradictory data.

---

### 4.2 First Normal Form (1NF)
> **Definition**: A relation $R$ is in 1NF if and only if all underlying domains contain only **atomic (indivisible) values**, and there are no repeating groups.

- **Violation in Carpool**: Storing multiple booked passenger names in a single comma-separated string `passenger_ids = "1, 3, 5"` inside the `carpool_ride` table.
- **Resolution**: Every column holds a single atomic value. We decompose the relation so each passenger reservation is an independent row in `ride_booking`.

---

### 4.3 Second Normal Form (2NF)
> **Definition**: A relation $R$ is in 2NF if it is in 1NF and **every non-prime attribute is fully functionally dependent** on the primary key (no partial dependencies on a composite key).

- **Composite Key Example**: Consider a composite key table:
  $$\text{Booking}(\underline{\text{passenger\_id}, \text{ride\_id}}, \text{seats\_booked}, \text{passenger\_email}, \text{fare})$$
  - Functional Dependencies:
    - $\{\text{passenger\_id}, \text{ride\_id}\} \to \text{seats\_booked}$ (Full dependency)
    - $\text{passenger\_id} \to \text{passenger\_email}$ (**Partial dependency!** `passenger_email` depends *only* on `passenger_id`, not on the entire composite key).
- **Resolution**: Decompose into:
  - `passenger(passenger_id, passenger_email)`
  - `ride_booking(booking_id, ride_id, passenger_id, seats_booked)`

---

### 4.4 Third Normal Form (3NF)
> **Definition**: A relation $R$ is in 3NF if it is in 2NF and **no non-prime attribute is transitively dependent on the primary key**.  
> In formal terms: For every functional dependency $X \to Y$, either:
> 1. $X$ is a superkey, OR
> 2. $Y$ is a prime attribute (part of a candidate key).

#### Concrete 3NF Proof in ShareCar:
Consider vehicle information associated with a ride:
$$\text{carpool\_ride}(\underline{\text{ride\_id}}, \text{driver\_id}, \text{vehicle\_id}, \text{manufacturer}, \text{model}, \text{fuel\_type})$$

- Functional Dependencies:
  1. $\text{ride\_id} \to \text{driver\_id}$
  2. $\text{driver\_id} \to \text{vehicle\_id}$
  3. $\text{vehicle\_id} \to \{\text{manufacturer}, \text{model}, \text{fuel\_type}\}$
- Therefore:
  $$\text{ride\_id} \to \text{vehicle\_id} \to \text{manufacturer}$$
  This is a **transitive dependency**! $\text{manufacturer}$ depends on $\text{vehicle\_id}$, which is NOT a superkey of `carpool_ride`.
- **Anomalies Produced**:
  - If a driver updates their car from a *Honda City* to an *Innova Crysta*, every scheduled ride must be updated individually.
  - If a vehicle has no rides scheduled today, its manufacturer and model cannot be stored in the database.
- **3NF Decomposition**:
  - `carpool_ride` retains: $(\underline{\text{ride\_id}}, \text{driver\_id}, \dots)$
  - `driver` retains: $(\underline{\text{driver\_id}}, \text{license\_number}, \dots)$
  - `vehicle` retains: $(\underline{\text{vehicle\_id}}, \text{driver\_id}, \text{manufacturer}, \text{model}, \text{fuel\_type}, \dots)$
  - Transitive dependencies are eliminated. All non-key attributes depend on the key, the whole key, and nothing but the key!

---

### 4.5 Why 3NF Was Chosen Over 2NF, BCNF, or Denormalization

| Normal Form | Pros | Cons | Why 3NF was Selected |
| :--- | :--- | :--- | :--- |
| **2NF** | Easier to query (fewer joins). | Suffers from transitive update and deletion anomalies. | **Rejected**: Financial and vehicle data would easily become desynchronized. |
| **3NF** | **Eliminates all insertion, update, and deletion anomalies. Preserves all functional dependencies. High OLTP transactional throughput.** | Requires `JOIN` operations across foreign keys. | **✅ SELECTED**: Represents the universal standard for transactional systems where consistency and data integrity are paramount. |
| **BCNF (Boyce-Codd)** | Stricter than 3NF (handles overlapping composite candidate keys). | May fail to preserve functional dependencies without multi-table triggers. | **Unnecessary**: Our tables have single-attribute surrogate primary keys (`SERIAL INT`), meaning all 3NF relations in this schema are inherently in BCNF. |
| **Denormalized (NoSQL)** | Fast single-document reads. | Catastrophic for ACID seat booking. Race conditions cause overbooking. | **Rejected**: Cannot support atomic multi-seat inventory or financial ledger consistency. |

---

## 5. Transaction Management & ACID Implementation

### 5.1 What is an ACID Transaction?
A **database transaction** is a logical unit of work that contains one or more SQL operations. To ensure database integrity, every booking transaction satisfies all four **ACID** properties:

$$\text{ACID} = \text{Atomicity} + \text{Consistency} + \text{Isolation} + \text{Durability}$$

---

### 5.2 Step-by-Step Code Walkthrough

```sql
-- Step 1: ATOMICITY - Start the transaction block
BEGIN;

-- Step 2: ISOLATION - Acquire pessimistic row-level lock on the target ride
SELECT * FROM carpool_ride 
WHERE ride_id = 1 
FOR UPDATE;

-- Step 3: CONSISTENCY - Validate business invariants in application or trigger
-- CHECK: available_seats (4) >= requested (1)
-- CHECK: passenger.balance (₹1450.00) >= total_fare (₹350.00)

-- Step 4: CONSISTENCY - Deduct fare atomically from passenger wallet
UPDATE passenger 
SET balance = balance - 350.00 
WHERE passenger_id = 1;

-- Step 5: CONSISTENCY - Credit fare to driver balance
UPDATE driver 
SET balance = balance + 350.00 
WHERE driver_id = 2;

-- Step 6: CONSISTENCY - Decrement available seat count
UPDATE carpool_ride 
SET available_seats = available_seats - 1,
    status = CASE WHEN available_seats - 1 = 0 THEN 'full' ELSE status END
WHERE ride_id = 1;

-- Step 7: ATOMICITY & REFERENTIAL INTEGRITY - Insert reservation record
INSERT INTO ride_booking (booking_id, ride_id, passenger_id, seats_booked, total_amount, booking_status) 
VALUES (101, 1, 1, 1, 350.00, 'confirmed');

-- Step 8: ATOMICITY - Record immutable payment ledger entry
INSERT INTO payment (booking_id, user_id, amount, payment_method, transaction_id, status) 
VALUES (101, 1, 350.00, 'ShareCar UPI Wallet', 'UPI/SC-40281920', 'Success');

-- Step 9: DURABILITY - Commit transaction to Write-Ahead Log (WAL) on disk
COMMIT;
```

---

### 5.3 Detailed Breakdown of ACID in ShareCar

#### 1. Atomicity (All-or-Nothing)
- **Scenario**: Suppose the server crashes or power fails right after Step 4 (passenger wallet deducted ₹350), but before Step 7 (booking inserted).
- **Behavior**: PostgreSQL's transaction manager issues an automatic `ROLLBACK`. The passenger's ₹350 is instantly restored. Money is never lost into a void.

#### 2. Consistency (State Invariants)
- Every transaction transitions the database from **one valid state to another valid state**.
- If a passenger tries to book 2 seats for ₹700 but only has ₹450, the `CHECK (balance >= 0)` constraint or application check fails, triggering an immediate `ROLLBACK`.

#### 3. Isolation (Concurrency Control)
- **Scenario**: Two users, Aryan and Rohan, click "Book Last Seat" on the Mumbai–Pune Innova at the exact same millisecond.
- **Mechanism**: `SELECT * FROM carpool_ride WHERE ride_id = 1 FOR UPDATE;` places an exclusive **row-level write lock** on `ride_id = 1`.
  - Aryan's transaction acquires the lock first.
  - Rohan's transaction is placed in a queue, waiting for Aryan's transaction to `COMMIT`.
  - When Aryan commits, `available_seats` becomes 0.
  - Rohan's transaction wakes up, evaluates `available_seats (0) >= 1`, receives `FALSE`, and safely aborts with an informative error message.
  - **Zero overbooking guaranteed.**

#### 4. Durability (Persistence)
- Once PostgreSQL responds with `COMMIT`, the changes are written to the **Write-Ahead Log (WAL)** on non-volatile disk storage. Even if the server is abruptly powered off a microsecond later, the committed reservation is restored intact upon recovery.

---

## 6. Concurrency Control & Row-Level Locking

### 6.1 Isolation Levels in PostgreSQL

| Isolation Level | Dirty Read Possible? | Non-Repeatable Read? | Phantom Read? | ShareCar Usage |
| :--- | :---: | :---: | :---: | :--- |
| **Read Uncommitted** | No (Postgres treats as Read Committed) | Yes | Yes | Not used |
| **Read Committed** | ❌ No | Yes | Yes | Default PostgreSQL level. Paired with `FOR UPDATE` for safe row-locking. |
| **Repeatable Read** | ❌ No | ❌ No | ❌ No | Used for analytical daily revenue reports. |
| **Serializable** | ❌ No | ❌ No | ❌ No | Strictest isolation via SSI (Serializable Snapshot Isolation). |

---

## 7. Step-by-Step PostgreSQL Setup & Access Guide

Follow these exact steps to run and query the live PostgreSQL database on your computer:

### Step 1: Install PostgreSQL
On macOS using Homebrew:
```bash
brew install postgresql@16
```

### Step 2: Start the PostgreSQL Service
```bash
brew services start postgresql@16
```
To verify the service is running:
```bash
brew services list
```

### Step 3: Create the Project Database
```bash
createdb sharecar_db
```

### Step 4: Execute the Schema & Seed Data
Navigate to your project root and pipe the schema into `psql`:
```bash
cd /Users/sumanthvarada/hello/Carpool-Management-System-DBMS
psql -d sharecar_db -f sql/postgresql_schema.sql
```

### Step 5: Connect via Command Line (`psql`)
```bash
psql -d sharecar_db
```

Useful `psql` meta-commands:
```sql
\dt                  -- List all 12 3NF relations/tables
\d carpool_ride      -- Inspect columns, datatypes, and constraints of carpool_ride
\d+ ride_booking     -- Inspect foreign key references and indexes
SELECT * FROM app_user;     -- View Indian users and Aadhaar KYC records
SELECT * FROM carpool_ride; -- View scheduled expressway rides
\q                   -- Exit psql
```

### Step 6: Connect via Graphical Client (pgAdmin 4 / DBeaver / TablePlus)
1. **Host**: `localhost`
2. **Port**: `5432`
3. **Database**: `sharecar_db`
4. **Username**: `postgres` (or your macOS username)
5. **Password**: *(leave blank or enter your local postgres password)*

---

## 8. Backend Architecture & Dual-Mode Engine

The project includes a complete Node.js/Express backend located at `backend/`:

### 8.1 Dual-Mode Database Architecture
To ensure high availability, the backend features an **automatic dual-engine fallback**:
1. **Live PostgreSQL Mode**: When PostgreSQL is running on port 5432, queries run directly against the live database via `pg.Pool`.
2. **In-Memory 3NF Fallback Mode**: If PostgreSQL is temporarily stopped, the system automatically falls back to an in-memory 3NF ACID engine so testing never breaks.

### 8.2 Starting the Backend Server
```bash
cd backend
npm start
```
The server will boot on `http://localhost:3001` and output:
```
=================================================================
🚗 ShareCar India — Full-Stack Server Running on Port 3001
🌐 Local Web UI & API: http://localhost:3001
🐘 Database Mode: Live PostgreSQL 16 (or In-Memory Fallback)
=================================================================
```

### 8.3 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with email & password, returns passenger wallet balance. |
| `POST` | `/api/auth/register` | Register new user with Aadhaar KYC and ₹1,000 welcome wallet balance. |
| `GET` | `/api/rides` | Filter rides by origin, destination, seats needed, and category. |
| `POST` | `/api/rides` | Driver flow to publish a new carpool route. |
| `POST` | `/api/bookings` | **Executes PostgreSQL ACID transaction** (`BEGIN`, `FOR UPDATE`, `COMMIT`). |
| `GET` | `/api/wallet/:id` | Fetch current passenger balance. |
| `POST` | `/api/wallet/topup` | Recharge passenger wallet via UPI (Google Pay, PhonePe). |
| `GET` | `/api/db/status` | Health check verifying live PostgreSQL connection. |

---

## 9. DBMS Viva / Exam Presentation Cheat Sheet

Use these concise, high-impact answers when presenting to examiners or professors:

### Q1: "What is the primary key of your associative entity `ride_booking`?"
> **Answer**: `booking_id` is the primary key (`SERIAL INT`), while `ride_id` and `passenger_id` are foreign keys. We chose a surrogate key (`booking_id`) rather than a composite key `(ride_id, passenger_id)` so a passenger can book seats on the same recurring ride across different dates, and so the `payment` table can reference a clean, single-attribute foreign key.

### Q2: "Why did you choose 3NF over Denormalization?"
> **Answer**: In carpooling, seat inventory and payment records are mission-critical transactional data (OLTP). Denormalization introduces severe update anomalies (e.g. updating a vehicle's model across thousands of booking records). 3NF ensures that every non-key attribute depends only on the primary key, eliminating data duplication while preserving functional dependencies.

### Q3: "How do you prevent race conditions when two users book the last seat simultaneously?"
> **Answer**: We use **Pessimistic Row-Level Concurrency Control** via `SELECT * FROM carpool_ride WHERE ride_id = $1 FOR UPDATE`. This locks the specific ride row at the database kernel level until the active transaction executes `COMMIT` or `ROLLBACK`. Subsequent transactions must wait in queue, preventing lost updates and overbooking.

### Q4: "Where is the ISA hierarchy in your ER diagram and how is it implemented in SQL?"
> **Answer**: `app_user` is the generalized parent entity. It specializes into `passenger` and `driver` through a 1:1 disjoint relationship. In SQL, `passenger.passenger_id` and `driver.driver_id` serve simultaneously as **both Primary Key and Foreign Key** referencing `app_user(user_id)`.

### Q5: "What happens if a transaction fails midway during payment deduction?"
> **Answer**: Atomicity guarantees all-or-nothing execution. The transaction catches the exception and executes `ROLLBACK`. Any deductions from the passenger's wallet or increments to the driver's balance are discarded, restoring the database to its pre-transaction state.
