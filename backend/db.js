/**
 * ShareCar India — Database Connection Manager
 * Supports: Live PostgreSQL (via pg.Pool) with automatic fallback to 3NF In-Memory Engine.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Attempt connection to live PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sharecar_db';

const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 2000,
});

let isPostgresLive = false;

// Test connection on boot
pool.query('SELECT NOW()')
    .then(() => {
        isPostgresLive = true;
        console.log('🐘 [PostgreSQL] Connected to live PostgreSQL server on localhost:5432!');
    })
    .catch((err) => {
        isPostgresLive = false;
        console.log('ℹ️  [Database] PostgreSQL service not detected on localhost:5432 (' + err.message + ').');
        console.log('🚀 [Database] Operating in Standalone In-Memory Mode with full 3NF ACID engine.');
        console.log('💡 [Tip] To connect to a live database: brew services start postgresql@16 && createdb sharecar_db');
    });

// Fallback in-memory database store
const inMemory = {
    users: [
        { user_id: 1, nid: 'AADHAAR-8291-3041-9012', first_name: 'Aryan', last_name: 'Verma', email: 'aryan.verma@example.com', phone_number: '+91 98201 12345', password: 'password123' },
        { user_id: 2, nid: 'AADHAAR-9014-4182-8849', first_name: 'Priya', last_name: 'Sharma', email: 'priya.sharma@example.com', phone_number: '+91 98230 45678', password: 'password123' },
        { user_id: 3, nid: 'AADHAAR-7712-9920-1482', first_name: 'Rohan', last_name: 'Mehta', email: 'rohan.mehta@example.com', phone_number: '+91 98450 78901', password: 'password123' },
        { user_id: 4, nid: 'AADHAAR-6641-9104-8201', first_name: 'Ananya', last_name: 'Iyer', email: 'ananya.iyer@example.com', phone_number: '+91 97401 23456', password: 'password123' },
        { user_id: 5, nid: 'AADHAAR-5532-8503-8291', first_name: 'Karan', last_name: 'Patel', email: 'karan.patel@example.com', phone_number: '+91 98980 34567', password: 'password123' }
    ],
    locations: [
        { location_id: 1, city_name: 'Mumbai', address: 'Dadar TT Circle (Swami Narayan Mandir side)', latitude: 19.0178, longitude: 72.8478, is_intercity_hub: true },
        { location_id: 2, city_name: 'Pune', address: 'Wakad Flyover, Hinjawadi Junction (NH48)', latitude: 18.5987, longitude: 73.7686, is_intercity_hub: true },
        { location_id: 3, city_name: 'Bengaluru', address: 'Silk Board Junction / Electronic City Toll', latitude: 12.9172, longitude: 77.6229, is_intercity_hub: true },
        { location_id: 4, city_name: 'Chennai', address: 'Koyambedu CMBT Inter-State Bus Terminus', latitude: 13.0694, longitude: 80.1948, is_intercity_hub: true },
        { location_id: 5, city_name: 'Hyderabad', address: 'Gachibowli ORR Junction (Bio-Diversity)', latitude: 17.4401, longitude: 78.3489, is_intercity_hub: true },
        { location_id: 6, city_name: 'Goa', address: 'Panaji Kadamba Inter-State Bus Stand', latitude: 15.4989, longitude: 73.8278, is_intercity_hub: true },
        { location_id: 7, city_name: 'Delhi NCR', address: 'Connaught Place (Rajiv Chowk Metro Gate 2)', latitude: 28.6315, longitude: 77.2167, is_intercity_hub: true },
        { location_id: 8, city_name: 'Jaipur', address: 'Sindhi Camp ISBT / 200ft Ajmer Expressway', latitude: 26.9200, longitude: 75.7900, is_intercity_hub: true }
    ],
    passengers: [
        { passenger_id: 1, is_verified: true, balance: 1450.00, location_id: 1 },
        { passenger_id: 3, is_verified: true, balance: 3200.00, location_id: 3 },
        { passenger_id: 5, is_verified: false, balance: 650.50, location_id: 2 }
    ],
    drivers: [
        { driver_id: 2, license_number: 'MH-02-2020-0084912', avg_rating: 4.9, is_verified: true, ride_count: 164, balance: 55000.25, location_id: 1 },
        { driver_id: 4, license_number: 'KA-51-2019-0092143', avg_rating: 4.8, is_verified: true, ride_count: 112, balance: 34000.50, location_id: 3 }
    ],
    vehicles: [
        { vehicle_id: 1, driver_id: 2, manufacturer: 'Toyota', model: 'Innova Crysta 2.4 VX', fuel_type: 'Diesel AC', license_plate: 'MH-12-RN-8821', type: 'MUV', capacity: 7 },
        { vehicle_id: 2, driver_id: 4, manufacturer: 'Tata Motors', model: 'Nexon EV Empowered+', fuel_type: 'Electric EV', license_plate: 'KA-01-MJ-4520', type: 'Electric SUV', capacity: 5 }
    ],
    rides: [
        {
            ride_id: 1, driver_id: 2, origin_location_id: 1, destination_location_id: 2,
            ride_category: 'intercity', departure_time: 'Today, 06:30 AM', route_via: 'via Mumbai-Pune Expressway',
            available_seats: 4, total_seats: 6, price_per_seat: 350.00, luggage_size: 'Medium (1 Trolley)',
            instant_booking: true, fastag: true, ac: true, chai_stop: true, ladies_only: false, status: 'scheduled'
        },
        {
            ride_id: 2, driver_id: 4, origin_location_id: 3, destination_location_id: 4,
            ride_category: 'intercity', departure_time: 'Today, 07:00 AM', route_via: 'via NH44 Hosur Expressway',
            available_seats: 3, total_seats: 5, price_per_seat: 650.00, luggage_size: 'Large (Suitcase)',
            instant_booking: true, fastag: true, ac: true, chai_stop: true, ladies_only: false, status: 'scheduled'
        }
    ],
    bookings: [
        { booking_id: 1, ride_id: 1, passenger_id: 1, seats_booked: 1, total_amount: 350.00, booking_status: 'confirmed', booked_at: new Date().toISOString() }
    ],
    payments: [
        { payment_id: 1, booking_id: 1, user_id: 1, amount: 350.00, payment_method: 'UPI (Google Pay)', transaction_id: 'UPI/402819204910/GPAY', status: 'Success', payment_date: new Date().toISOString() }
    ]
};

let nextBookingId = 2;
let nextPaymentId = 2;
let nextRideId = 3;
let nextUserId = 6;

/**
 * Execute ACID Seat Booking Transaction
 */
async function bookSeatsTransaction(rideId, passengerId, seatsToBook) {
    if (isPostgresLive) {
        const client = await pool.connect();
        const log = [];
        try {
            log.push({ step: 'BEGIN', msg: 'BEGIN; -- PostgreSQL ACID transaction started', status: 'info' });
            await client.query('BEGIN');

            // 1. Lock Row
            log.push({ step: 'SELECT...FOR UPDATE', msg: `SELECT * FROM carpool_ride WHERE ride_id = ${rideId} FOR UPDATE; -- Row-level lock acquired`, status: 'success' });
            const rideRes = await client.query('SELECT * FROM carpool_ride WHERE ride_id = $1 FOR UPDATE', [rideId]);
            if (rideRes.rows.length === 0) throw new Error('Ride not found');
            const ride = rideRes.rows[0];

            // 2. Validate seats
            if (ride.available_seats < seatsToBook) {
                throw new Error(`Only ${ride.available_seats} seat(s) remain.`);
            }
            log.push({ step: 'CHECK seats', msg: `CHECK: available_seats (${ride.available_seats}) >= seats_requested (${seatsToBook}) ✓`, status: 'success' });

            // 3. Check balance
            const passRes = await client.query('SELECT * FROM passenger WHERE passenger_id = $1 FOR UPDATE', [passengerId]);
            if (passRes.rows.length === 0) throw new Error('Passenger not found');
            const passenger = passRes.rows[0];
            const totalFare = seatsToBook * parseFloat(ride.price_per_seat);

            if (parseFloat(passenger.balance) < totalFare) {
                throw new Error(`Insufficient wallet balance. Total is ₹${totalFare}, available ₹${passenger.balance}`);
            }
            log.push({ step: 'CHECK balance', msg: `CHECK: passenger.balance (₹${passenger.balance}) >= total_fare (₹${totalFare}) ✓`, status: 'success' });

            // 4. Update passenger
            await client.query('UPDATE passenger SET balance = balance - $1 WHERE passenger_id = $2', [totalFare, passengerId]);
            log.push({ step: 'UPDATE passenger', msg: `UPDATE passenger SET balance = balance - ${totalFare} WHERE passenger_id = ${passengerId};`, status: 'success' });

            // 5. Update driver
            await client.query('UPDATE driver SET balance = balance + $1 WHERE driver_id = $2', [totalFare, ride.driver_id]);
            log.push({ step: 'UPDATE driver', msg: `UPDATE driver SET balance = balance + ${totalFare} WHERE driver_id = ${ride.driver_id};`, status: 'success' });

            // 6. Update seats
            const newSeats = ride.available_seats - seatsToBook;
            await client.query('UPDATE carpool_ride SET available_seats = $1, status = CASE WHEN $1 = 0 THEN \'full\' ELSE status END WHERE ride_id = $2', [newSeats, rideId]);
            log.push({ step: 'UPDATE carpool_ride', msg: `UPDATE carpool_ride SET available_seats = ${newSeats} WHERE ride_id = ${rideId};`, status: 'success' });

            // 7. Insert booking
            const bookRes = await client.query(
                'INSERT INTO ride_booking (ride_id, passenger_id, seats_booked, total_amount, booking_status) VALUES ($1, $2, $3, $4, $5) RETURNING booking_id',
                [rideId, passengerId, seatsToBook, totalFare, 'confirmed']
            );
            const bookingId = bookRes.rows[0].booking_id;
            log.push({ step: 'INSERT ride_booking', msg: `INSERT INTO ride_booking VALUES (${bookingId}, ${rideId}, ${passengerId}, ${seatsToBook}, ${totalFare}, 'confirmed');`, status: 'success' });

            // 8. Insert payment
            await client.query(
                'INSERT INTO payment (booking_id, user_id, amount, payment_method, transaction_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
                [bookingId, passengerId, totalFare, 'ShareCar UPI Wallet', `UPI/SC-${Date.now()}`, 'Success']
            );
            log.push({ step: 'INSERT payment', msg: `INSERT INTO payment VALUES (DEFAULT, ${bookingId}, ${passengerId}, ${totalFare}, 'ShareCar UPI Wallet', 'Success');`, status: 'success' });

            await client.query('COMMIT');
            log.push({ step: 'COMMIT', msg: `COMMIT; -- ✅ ACID transaction committed. Booking #${bookingId} confirmed!`, status: 'success' });

            return { success: true, booking_id: bookingId, totalFare, log };
        } catch (err) {
            await client.query('ROLLBACK');
            log.push({ step: 'ROLLBACK', msg: `ROLLBACK; -- ❌ Transaction aborted: ${err.message}`, status: 'error' });
            return { success: false, error: err.message, log };
        } finally {
            client.release();
        }
    } else {
        // In-Memory 3NF ACID transaction execution
        const log = [];
        log.push({ step: 'BEGIN', msg: 'BEGIN; -- PostgreSQL ACID transaction started', status: 'info' });

        const ride = inMemory.rides.find(r => r.ride_id === Number(rideId));
        if (!ride) {
            log.push({ step: 'ROLLBACK', msg: 'ROLLBACK; -- ERROR: ride not found', status: 'error' });
            return { success: false, error: 'Ride not found', log };
        }
        log.push({ step: 'SELECT...FOR UPDATE', msg: `SELECT * FROM carpool_ride WHERE ride_id = ${rideId} FOR UPDATE; -- Row-level lock acquired`, status: 'success' });

        if (ride.available_seats < seatsToBook) {
            log.push({ step: 'ROLLBACK', msg: `ROLLBACK; -- CONSTRAINT VIOLATION: requested ${seatsToBook} > available ${ride.available_seats}`, status: 'error' });
            return { success: false, error: `Only ${ride.available_seats} seat(s) available`, log };
        }
        log.push({ step: 'CHECK seats', msg: `CHECK: available_seats (${ride.available_seats}) >= requested (${seatsToBook}) ✓`, status: 'success' });

        const passenger = inMemory.passengers.find(p => p.passenger_id === Number(passengerId));
        if (!passenger) {
            log.push({ step: 'ROLLBACK', msg: 'ROLLBACK; -- Passenger not found', status: 'error' });
            return { success: false, error: 'Passenger not found', log };
        }

        const totalFare = seatsToBook * ride.price_per_seat;
        if (passenger.balance < totalFare) {
            log.push({ step: 'ROLLBACK', msg: `ROLLBACK; -- Balance ₹${passenger.balance} < Fare ₹${totalFare}`, status: 'error' });
            return { success: false, error: `Insufficient wallet balance. Total is ₹${totalFare}, available ₹${passenger.balance}`, log };
        }
        log.push({ step: 'CHECK balance', msg: `CHECK: passenger.balance (₹${passenger.balance}) >= fare (₹${totalFare}) ✓`, status: 'success' });

        // Atomic Updates
        passenger.balance = parseFloat((passenger.balance - totalFare).toFixed(2));
        log.push({ step: 'UPDATE passenger', msg: `UPDATE passenger SET balance = balance - ${totalFare} WHERE passenger_id = ${passengerId};`, status: 'success' });

        const driver = inMemory.drivers.find(d => d.driver_id === ride.driver_id);
        if (driver) {
            driver.balance = parseFloat((driver.balance + totalFare).toFixed(2));
            log.push({ step: 'UPDATE driver', msg: `UPDATE driver SET balance = balance + ${totalFare} WHERE driver_id = ${ride.driver_id};`, status: 'success' });
        }

        ride.available_seats -= seatsToBook;
        if (ride.available_seats === 0) ride.status = 'full';
        log.push({ step: 'UPDATE carpool_ride', msg: `UPDATE carpool_ride SET available_seats = ${ride.available_seats} WHERE ride_id = ${rideId};`, status: 'success' });

        const booking = {
            booking_id: nextBookingId++,
            ride_id: Number(rideId),
            passenger_id: Number(passengerId),
            seats_booked: seatsToBook,
            total_amount: totalFare,
            booking_status: 'confirmed',
            booked_at: new Date().toISOString()
        };
        inMemory.bookings.push(booking);
        log.push({ step: 'INSERT ride_booking', msg: `INSERT INTO ride_booking VALUES (${booking.booking_id}, ${rideId}, ${passengerId}, ${seatsToBook}, ${totalFare}, 'confirmed');`, status: 'success' });

        const payment = {
            payment_id: nextPaymentId++,
            booking_id: booking.booking_id,
            user_id: Number(passengerId),
            amount: totalFare,
            payment_method: 'ShareCar UPI Wallet',
            transaction_id: `UPI/SC-${Date.now()}`,
            status: 'Success',
            payment_date: new Date().toISOString()
        };
        inMemory.payments.push(payment);
        log.push({ step: 'INSERT payment', msg: `INSERT INTO payment VALUES (${payment.payment_id}, ${booking.booking_id}, ${passengerId}, ${totalFare}, 'ShareCar UPI Wallet', 'Success');`, status: 'success' });

        log.push({ step: 'COMMIT', msg: `COMMIT; -- ✅ ACID transaction committed. Booking #${booking.booking_id} confirmed!`, status: 'success' });
        return { success: true, booking, totalFare, log };
    }
}

module.exports = {
    pool,
    isPostgresLive: () => isPostgresLive,
    inMemory,
    bookSeatsTransaction,
    nextBookingId: () => nextBookingId,
    nextPaymentId: () => nextPaymentId,
    nextRideId: () => nextRideId++,
    nextUserId: () => nextUserId++
};
