/**
 * ShareCar India — Full-Stack Backend Server
 * Express.js + PostgreSQL 3NF Relational Architecture
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../Car-Ride Sharing')));

// =====================================================================
// 1. Authentication Endpoints
// =====================================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    try {
        if (db.isPostgresLive()) {
            const query = 'SELECT u.*, p.balance, p.is_verified FROM app_user u LEFT JOIN passenger p ON u.user_id = p.passenger_id WHERE u.email = $1';
            const result = await db.pool.query(query, [email.toLowerCase().trim()]);
            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, error: 'Invalid email or password.' });
            }
            const user = result.rows[0];
            return res.json({
                success: true,
                message: 'Login successful!',
                user: {
                    user_id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    nid: user.nid,
                    phone: user.phone_number,
                    balance: parseFloat(user.balance || 0),
                    is_verified: user.is_verified
                }
            });
        } else {
            const user = db.inMemory.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
            if (!user) {
                return res.status(401).json({ success: false, error: 'User not found. Try aryan.verma@example.com with password123' });
            }
            const passenger = db.inMemory.passengers.find(p => p.passenger_id === user.user_id);
            return res.json({
                success: true,
                message: 'Login successful (In-Memory 3NF Mode)!',
                user: {
                    user_id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    nid: user.nid,
                    phone: user.phone_number,
                    balance: passenger ? passenger.balance : 1450.00,
                    is_verified: true
                }
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    const { first_name, last_name, email, phone_number, nid } = req.body;
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ success: false, error: 'First name, last name, and email are required.' });
    }

    try {
        const aadhaar = nid || `AADHAAR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const phone = phone_number || '+91 98200 ' + Math.floor(10000 + Math.random() * 90000);

        if (db.isPostgresLive()) {
            const client = await db.pool.connect();
            try {
                await client.query('BEGIN');
                const userRes = await client.query(
                    'INSERT INTO app_user (nid, first_name, last_name, email, phone_number, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id',
                    [aadhaar, first_name, last_name, email.toLowerCase().trim(), phone, 'e10adc3949ba59abbe56e057f20f883e']
                );
                const userId = userRes.rows[0].user_id;
                await client.query('INSERT INTO passenger (passenger_id, is_verified, balance, location_id) VALUES ($1, TRUE, 1000.00, 1)', [userId]);
                await client.query('COMMIT');

                return res.json({
                    success: true,
                    message: 'Registration complete with ₹1,000 welcome wallet balance!',
                    user: { user_id: userId, name: `${first_name} ${last_name}`, email, nid: aadhaar, balance: 1000.00 }
                });
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
        } else {
            const userId = db.nextUserId();
            const newUser = { user_id: userId, nid: aadhaar, first_name, last_name, email, phone_number: phone, password: 'password123' };
            db.inMemory.users.push(newUser);
            db.inMemory.passengers.push({ passenger_id: userId, is_verified: true, balance: 1000.00, location_id: 1 });

            return res.json({
                success: true,
                message: 'Registration complete with ₹1,000 welcome wallet balance (In-Memory 3NF Mode)!',
                user: { user_id: userId, name: `${first_name} ${last_name}`, email, nid: aadhaar, balance: 1000.00 }
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// =====================================================================
// 2. Rides & Search Endpoints
// =====================================================================

// GET /api/rides
app.get('/api/rides', async (req, res) => {
    const { from, to, category, seats } = req.query;

    try {
        if (db.isPostgresLive()) {
            let sql = `
                SELECT 
                    r.*, 
                    orig.city_name AS origin_city, orig.address AS origin_address,
                    dest.city_name AS dest_city, dest.address AS dest_address,
                    u.first_name || ' ' || u.last_name AS driver_name,
                    d.avg_rating AS driver_rating, d.ride_count AS driver_rides, d.license_number AS driver_license,
                    v.manufacturer || ' ' || v.model AS vehicle_model, v.fuel_type AS vehicle_fuel, v.license_plate AS vehicle_plate
                FROM carpool_ride r
                JOIN location orig ON r.origin_location_id = orig.location_id
                JOIN location dest ON r.destination_location_id = dest.location_id
                JOIN driver d ON r.driver_id = d.driver_id
                JOIN app_user u ON d.driver_id = u.user_id
                LEFT JOIN vehicle v ON d.driver_id = v.driver_id
                WHERE r.status = 'scheduled'
            `;
            const params = [];
            let pIdx = 1;

            if (category && category !== 'all') {
                sql += ` AND r.ride_category = $${pIdx++}`;
                params.push(category);
            }
            if (seats) {
                sql += ` AND r.available_seats >= $${pIdx++}`;
                params.push(Number(seats));
            }

            const result = await db.pool.query(sql, params);
            return res.json({ success: true, count: result.rows.length, rides: result.rows });
        } else {
            // In-Memory filtering
            let rides = db.inMemory.rides.filter(r => r.status === 'scheduled');
            if (category && category !== 'all') {
                rides = rides.filter(r => r.ride_category === category);
            }
            if (seats) {
                rides = rides.filter(r => r.available_seats >= Number(seats));
            }

            const enriched = rides.map(r => {
                const orig = db.inMemory.locations.find(l => l.location_id === r.origin_location_id);
                const dest = db.inMemory.locations.find(l => l.location_id === r.destination_location_id);
                const driver = db.inMemory.drivers.find(d => d.driver_id === r.driver_id);
                const user = db.inMemory.users.find(u => u.user_id === r.driver_id);
                const veh = db.inMemory.vehicles.find(v => v.driver_id === r.driver_id);

                return {
                    ...r,
                    origin_city: orig?.city_name || 'Mumbai',
                    origin_address: orig?.address || 'Pickup Point',
                    dest_city: dest?.city_name || 'Pune',
                    dest_address: dest?.address || 'Drop Point',
                    driver_name: user ? `${user.first_name} ${user.last_name}` : 'Driver',
                    driver_rating: driver?.avg_rating || 4.9,
                    driver_rides: driver?.ride_count || 100,
                    driver_license: driver?.license_number || 'DL-RTO',
                    vehicle_model: veh ? `${veh.manufacturer} ${veh.model}` : 'Car',
                    vehicle_fuel: veh?.fuel_type || 'Diesel AC',
                    vehicle_plate: veh?.license_plate || 'IND-PLATE'
                };
            });

            return res.json({ success: true, count: enriched.length, rides: enriched });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/rides (Publish Ride)
app.post('/api/rides', async (req, res) => {
    const { driver_id, origin_location_id, destination_location_id, ride_category, departure_time, route_via, available_seats, price_per_seat, luggage_size } = req.body;

    try {
        if (db.isPostgresLive()) {
            const sql = `
                INSERT INTO carpool_ride (driver_id, origin_location_id, destination_location_id, ride_category, departure_time, route_via, available_seats, total_seats, price_per_seat, luggage_size, instant_booking, fastag, ac, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9, TRUE, TRUE, TRUE, 'scheduled')
                RETURNING ride_id
            `;
            const result = await db.pool.query(sql, [driver_id || 2, origin_location_id, destination_location_id, ride_category, departure_time, route_via, available_seats, price_per_seat, luggage_size]);
            return res.json({ success: true, ride_id: result.rows[0].ride_id, message: 'Ride published live on PostgreSQL!' });
        } else {
            const newRide = {
                ride_id: db.nextRideId(),
                driver_id: Number(driver_id) || 2,
                origin_location_id: Number(origin_location_id),
                destination_location_id: Number(destination_location_id),
                ride_category: ride_category || 'intercity',
                departure_time: departure_time || 'Today, 06:00 PM',
                route_via: route_via || 'via National Expressway',
                available_seats: Number(available_seats),
                total_seats: Number(available_seats),
                price_per_seat: parseFloat(price_per_seat),
                luggage_size: luggage_size || 'Medium (1 Trolley)',
                instant_booking: true, fastag: true, ac: true, chai_stop: true, status: 'scheduled'
            };
            db.inMemory.rides.push(newRide);
            return res.json({ success: true, ride: newRide, message: 'Ride published to in-memory 3NF store!' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// =====================================================================
// 3. ACID Seat Booking Transaction Endpoint
// =====================================================================

// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
    const { ride_id, passenger_id, seats } = req.body;
    if (!ride_id || !passenger_id) {
        return res.status(400).json({ success: false, error: 'ride_id and passenger_id are required' });
    }

    try {
        const seatsToBook = Number(seats) || 1;
        const result = await db.bookSeatsTransaction(ride_id, passenger_id, seatsToBook);
        return res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// =====================================================================
// 4. Wallet & Top-Up Endpoints
// =====================================================================

// GET /api/wallet/:passengerId
app.get('/api/wallet/:passengerId', async (req, res) => {
    const passengerId = Number(req.params.passengerId);
    try {
        if (db.isPostgresLive()) {
            const result = await db.pool.query('SELECT balance FROM passenger WHERE passenger_id = $1', [passengerId]);
            if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Passenger not found' });
            return res.json({ success: true, balance: parseFloat(result.rows[0].balance) });
        } else {
            const pass = db.inMemory.passengers.find(p => p.passenger_id === passengerId);
            return res.json({ success: true, balance: pass ? pass.balance : 1450.00 });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/wallet/topup
app.post('/api/wallet/topup', async (req, res) => {
    const { passenger_id, amount } = req.body;
    const addAmt = parseFloat(amount) || 500;
    const pId = Number(passenger_id) || 1;

    try {
        if (db.isPostgresLive()) {
            await db.pool.query('UPDATE passenger SET balance = balance + $1 WHERE passenger_id = $2', [addAmt, pId]);
            await db.pool.query(
                'INSERT INTO payment (user_id, amount, payment_method, transaction_id, status) VALUES ($1, $2, $3, $4, $5)',
                [pId, addAmt, 'UPI Instant Top-Up (GPay/PhonePe)', `UPI/TOPUP-${Date.now()}`, 'Success']
            );
            const updated = await db.pool.query('SELECT balance FROM passenger WHERE passenger_id = $1', [pId]);
            return res.json({ success: true, message: `Recharged ₹${addAmt.toFixed(2)} via UPI`, balance: parseFloat(updated.rows[0].balance) });
        } else {
            const pass = db.inMemory.passengers.find(p => p.passenger_id === pId);
            if (pass) pass.balance = parseFloat((pass.balance + addAmt).toFixed(2));
            return res.json({ success: true, message: `Recharged ₹${addAmt.toFixed(2)} via UPI`, balance: pass ? pass.balance : 1950.00 });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// =====================================================================
// 5. DBMS Health & 3NF Relation Inspector
// =====================================================================

// GET /api/db/status
app.get('/api/db/status', (req, res) => {
    res.json({
        service: 'ShareCar India DBMS API',
        postgres_live: db.isPostgresLive(),
        database: db.isPostgresLive() ? 'PostgreSQL 16 (sharecar_db on localhost:5432)' : 'Standalone In-Memory 3NF Engine',
        acid_enabled: true,
        normal_form: '3NF (Third Normal Form)'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`=================================================================`);
    console.log(`🚗 ShareCar India — Full-Stack Server Running on Port ${PORT}`);
    console.log(`🌐 Local Web UI & API: http://localhost:${PORT}`);
    console.log(`🐘 Database Mode: ${db.isPostgresLive() ? 'Live PostgreSQL 16' : '3NF In-Memory Fallback'}`);
    console.log(`=================================================================`);
});
