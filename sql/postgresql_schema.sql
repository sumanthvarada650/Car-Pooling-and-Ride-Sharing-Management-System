-- ===================================================================
-- ShareCar India — PostgreSQL Relational Database Schema
-- Standard: 3rd Normal Form (3NF) with ACID Transaction Support
-- Features: Intercity Expressways & Urban Tech Corridor Carpooling
-- All currency values in INR (₹)
-- ===================================================================

-- Create Schema / Drop Existing Tables if re-running
DROP TABLE IF EXISTS safety_report CASCADE;
DROP TABLE IF EXISTS customer_support CASCADE;
DROP TABLE IF EXISTS support_team CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS ride_booking CASCADE;
DROP TABLE IF EXISTS carpool_ride CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS driver CASCADE;
DROP TABLE IF EXISTS passenger CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

-- 1. Base User Table (Aadhaar KYC verified identities)
CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    nid VARCHAR(50) UNIQUE NOT NULL, -- Aadhaar / Government ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Location Table (Highway Hubs, Metro Stations & IT Corridors)
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    is_intercity_hub BOOLEAN DEFAULT FALSE
);

-- 3. Passenger Entity
CREATE TABLE passenger (
    passenger_id INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
    is_verified BOOLEAN DEFAULT TRUE,
    balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    location_id INT REFERENCES location(location_id)
);

-- 4. Driver Entity (Government RTO Driving License authenticated)
CREATE TABLE driver (
    driver_id INT PRIMARY KEY REFERENCES app_user(user_id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL, -- State RTO Driving License
    avg_rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (avg_rating BETWEEN 0.0 AND 5.0),
    is_verified BOOLEAN DEFAULT TRUE,
    ride_count INT DEFAULT 0 CHECK (ride_count >= 0),
    balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    location_id INT REFERENCES location(location_id)
);

-- 5. Vehicle Entity (Indian vehicle registry)
CREATE TABLE vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES driver(driver_id) ON DELETE CASCADE,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(40) DEFAULT 'Petrol AC', -- CNG Green, Diesel AC, Electric EV
    year INT CHECK (year >= 2000),
    license_plate VARCHAR(40) UNIQUE NOT NULL, -- Indian RTO Registration
    color VARCHAR(50),
    type VARCHAR(50) NOT NULL, -- 'MUV', 'SUV', 'Sedan', 'Electric SUV', 'MPV'
    capacity INT NOT NULL CHECK (capacity BETWEEN 1 AND 15)
);

-- 6. Carpool Ride (Expressways, National Highways & Urban Tech Corridors)
CREATE TABLE carpool_ride (
    ride_id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES driver(driver_id) ON DELETE RESTRICT,
    origin_location_id INT NOT NULL REFERENCES location(location_id),
    destination_location_id INT NOT NULL REFERENCES location(location_id),
    ride_category VARCHAR(20) NOT NULL CHECK (ride_category IN ('intercity', 'within_city')),
    departure_time VARCHAR(100) NOT NULL,
    route_via VARCHAR(150),
    available_seats INT NOT NULL CHECK (available_seats >= 0),
    total_seats INT NOT NULL CHECK (total_seats > 0),
    price_per_seat NUMERIC(10, 2) NOT NULL CHECK (price_per_seat > 0), -- INR (₹)
    luggage_size VARCHAR(50) DEFAULT 'Medium (1 Trolley)',
    instant_booking BOOLEAN DEFAULT TRUE,
    fastag BOOLEAN DEFAULT TRUE,
    ac BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'full', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Ride Booking (Multi-Seat Reservation with ACID integrity)
CREATE TABLE ride_booking (
    booking_id SERIAL PRIMARY KEY,
    ride_id INT NOT NULL REFERENCES carpool_ride(ride_id) ON DELETE CASCADE,
    passenger_id INT NOT NULL REFERENCES passenger(passenger_id) ON DELETE RESTRICT,
    seats_booked INT NOT NULL CHECK (seats_booked > 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0), -- INR (₹)
    booking_status VARCHAR(50) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'completed', 'cancelled')),
    booked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payment Ledger (UPI & Wallet transactions)
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES ride_booking(booking_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES app_user(user_id),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0), -- INR (₹)
    payment_method VARCHAR(60) NOT NULL, -- UPI (GPay), UPI (PhonePe), ShareCar UPI Wallet
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Success' CHECK (status IN ('Success', 'Pending', 'Failed', 'Refunded')),
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Review & Rating Entity
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    ride_id INT NOT NULL REFERENCES carpool_ride(ride_id) ON DELETE CASCADE,
    reviewer_passenger_id INT NOT NULL REFERENCES passenger(passenger_id),
    reviewed_driver_id INT NOT NULL REFERENCES driver(driver_id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Customer Support Staff
CREATE TABLE support_team (
    support_staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 11. Customer Inquiries & Ticket System
CREATE TABLE customer_support (
    ticket_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id),
    assigned_staff_id INT REFERENCES support_team(support_staff_id),
    inquiry_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(50) DEFAULT 'Pending Staff Review' CHECK (status IN ('Pending Staff Review', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Safety & Conduct Incident Reports
CREATE TABLE safety_report (
    report_id SERIAL PRIMARY KEY,
    reporter_user_id INT NOT NULL REFERENCES app_user(user_id),
    reported_user_id INT REFERENCES app_user(user_id),
    reporter_role VARCHAR(20) NOT NULL CHECK (reporter_role IN ('Passenger', 'Driver')),
    report_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Closed', 'Resolved')),
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- Seed Data: Indian Commuters, Highway Hubs, Vehicles & Corridors
-- ===================================================================

-- Insert App Users (Aadhaar KYC authenticated)
INSERT INTO app_user (nid, first_name, last_name, email, phone_number, password_hash) VALUES
('AADHAAR-8291-3041-9012', 'Aryan',   'Verma',   'aryan.verma@example.com',   '+91 98201 12345', 'e10adc3949ba59abbe56e057f20f883e'),
('AADHAAR-9014-4182-8849', 'Priya',   'Sharma',  'priya.sharma@example.com',  '+91 98230 45678', 'f379eaf3c831b04de153469d1bec345e'),
('AADHAAR-7712-9920-1482', 'Rohan',   'Mehta',   'rohan.mehta@example.com',   '+91 98450 78901', '5170365a687339174548dce196f014e7'),
('AADHAAR-6641-9104-8201', 'Ananya',  'Iyer',    'ananya.iyer@example.com',   '+91 97401 23456', '8a5433a388b3f46f4ebc853ae2fb0b25'),
('AADHAAR-5532-8503-8291', 'Karan',   'Patel',   'karan.patel@example.com',   '+91 98980 34567', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
('AADHAAR-4421-9204-9182', 'Divya',   'Nair',    'divya.nair@example.com',    '+91 94470 56789', '1679091c5a880faf6fb5e6087eb1b2dc'),
('AADHAAR-3310-8049-1820', 'Arjun',   'Singh',   'arjun.singh@example.com',   '+91 98110 67890', '25d55ad283aa400af464c76d713c07ad'),
('AADHAAR-2209-2049-1820', 'Meera',   'Kapoor',  'meera.kapoor@example.com',  '+91 98710 78901', 'e99a18c428cb38d5f260853678922e03'),
('AADHAAR-1198-8404-9182', 'Vikram',  'Bose',    'vikram.bose@example.com',   '+91 98300 89012', '1f32aa4c9a1d2ea010adcf2348166a04'),
('AADHAAR-9987-8704-9182', 'Suresh',  'Reddy',   'suresh.reddy@example.com',  '+91 98480 90123', '900150983cd24fb0d6963f7d28e17f72');

-- Insert Locations (Indian Highway Hubs, Metro Stations & IT Parks)
INSERT INTO location (city_name, address, latitude, longitude, is_intercity_hub) VALUES
('Mumbai',    'Dadar TT Circle (Swami Narayan Mandir side)',     19.0178, 72.8478, TRUE),
('Pune',      'Wakad Flyover, Hinjawadi Junction (NH48)',        18.5987, 73.7686, TRUE),
('Bengaluru', 'Silk Board Junction / Electronic City Toll',     12.9172, 77.6229, TRUE),
('Chennai',   'Koyambedu CMBT Inter-State Bus Terminus',         13.0694, 80.1948, TRUE),
('Hyderabad', 'Gachibowli ORR Junction (Near Bio-Diversity)',    17.4401, 78.3489, TRUE),
('Goa',       'Panaji Kadamba Inter-State Bus Stand',            15.4989, 73.8278, TRUE),
('Delhi NCR', 'Connaught Place (Rajiv Chowk Metro Gate 2)',     28.6315, 77.2167, TRUE),
('Jaipur',    'Sindhi Camp ISBT / 200ft Ajmer Expressway',       26.9200, 75.7900, TRUE),
('Mumbai',    'Bandra Kurla Complex (BKC Diamond Bourse Gate 2)',19.0660, 72.8680, FALSE),
('Pune',      'Hinjawadi Phase 1, Rajiv Gandhi Infotech Park',   18.5913, 73.7389, FALSE),
('Bengaluru', 'Whitefield ITPL Main Gate (Hope Farm)',           12.9856, 77.7314, FALSE),
('Delhi NCR', 'Gurugram Cyber Hub (DLF Phase 2 Rapid Metro)',   28.4960, 77.0890, FALSE);

-- Insert Passengers
INSERT INTO passenger (passenger_id, is_verified, balance, location_id) VALUES
(1, TRUE, 1450.00, 1),
(3, TRUE, 3200.00, 3),
(5, FALSE, 650.50, 2),
(7, TRUE, 2800.00, 4),
(9, TRUE, 4500.00, 1);

-- Insert Drivers (State RTO Driving Licenses)
INSERT INTO driver (driver_id, license_number, avg_rating, is_verified, ride_count, balance, location_id) VALUES
(2,  'MH-02-2020-0084912', 4.9, TRUE, 164, 55000.25, 1),
(4,  'KA-51-2019-0092143', 4.8, TRUE, 112, 34000.50, 3),
(6,  'TN-07-2022-0034182', 4.9, TRUE, 78,  18500.00, 4),
(8,  'TS-09-2018-0056129', 5.0, TRUE, 235, 92000.80, 5),
(10, 'DL-04-2021-0071205', 4.7, TRUE, 52,  12500.00, 7);

-- Insert Vehicles (Popular Indian Carpool Vehicles)
INSERT INTO vehicle (driver_id, manufacturer, model, fuel_type, year, license_plate, color, type, capacity) VALUES
(2,  'Toyota',        'Innova Crysta 2.4 VX', 'Diesel AC',   2022, 'MH-12-RN-8821', 'Pearl White',    'MUV',         7),
(4,  'Tata Motors',   'Nexon EV Empowered+',  'Electric EV', 2023, 'KA-01-MJ-4520', 'Daytona Grey',   'Electric SUV',5),
(6,  'Honda',         'City 1.5 i-VTEC ZX',   'Petrol AC',   2021, 'TN-07-BW-3344', 'Lunar Silver',   'Sedan',       5),
(8,  'Mahindra',      'XUV700 AX7 Luxury',    'Diesel AC',   2023, 'TS-07-JK-9922', 'Midnight Black', 'SUV',         7),
(10, 'Maruti Suzuki', 'Ertiga ZXi (CNG)',     'CNG Green',   2023, 'DL-3C-CA-9012', 'Magma Grey',     'MPV',         7);

-- Insert Carpool Rides (Expressways & Urban Tech Corridors)
INSERT INTO carpool_ride (driver_id, origin_location_id, destination_location_id, ride_category, departure_time, route_via, available_seats, total_seats, price_per_seat, luggage_size, instant_booking, fastag, ac, status) VALUES
(2,  1,  2,  'intercity',   'Today, 06:30 AM',  'via Mumbai-Pune Expressway',              4, 6, 350.00, 'Medium (1 Trolley)',   TRUE, TRUE, TRUE, 'scheduled'),
(4,  3,  4,  'intercity',   'Today, 07:00 AM',  'via NH44 Hosur-Krishnagiri Expressway',   3, 5, 650.00, 'Large (Suitcase + Bag)',TRUE, TRUE, TRUE, 'scheduled'),
(10, 7,  8,  'intercity',   'Today, 08:00 AM',  'via Delhi-Mumbai Expressway',             4, 7, 480.00, 'Medium (Dicky Space)',  TRUE, TRUE, TRUE, 'scheduled'),
(8,  5,  3,  'intercity',   'Today, 05:30 AM',  'via NH44 Highway Express',                5, 7, 850.00, 'Large (Dicky Space)',   TRUE, TRUE, TRUE, 'scheduled'),
(2,  9,  10, 'within_city', 'In 15 mins',       'via Eastern Freeway / Expressway Bypass', 3, 6, 90.00,  'Office Backpack',       TRUE, TRUE, TRUE, 'scheduled'),
(4,  11, 3,  'within_city', 'In 20 mins',       'via ORR Silk Board IT Corridor',          2, 5, 120.00, 'Laptop Bag',            TRUE, FALSE,TRUE, 'scheduled'),
(10, 7,  12, 'within_city', 'In 25 mins',       'via Delhi-Gurgaon Expressway',            4, 7, 140.00, 'Office Bag',            TRUE, TRUE, TRUE, 'scheduled');

-- Insert Initial Bookings & Payments
INSERT INTO ride_booking (ride_id, passenger_id, seats_booked, total_amount, booking_status) VALUES
(1, 1, 1, 350.00, 'confirmed'),
(5, 9, 1, 90.00,  'confirmed');

INSERT INTO payment (booking_id, user_id, amount, payment_method, transaction_id, status) VALUES
(1, 1, 350.00, 'UPI (Google Pay)',    'UPI/402819204910/GPAY', 'Success'),
(2, 9, 90.00,  'ShareCar UPI Wallet', 'TXN-SC-WLT-99210',      'Success');

-- Support Team (@sharecar.in)
INSERT INTO support_team (first_name, last_name, email, role) VALUES
('Ramesh',  'Verma', 'r.verma@sharecar.in', 'Tier 1 Support'),
('Sumitra', 'Das',   's.das@sharecar.in',   'KYC & Safety Specialist'),
('Ajay',    'Gupta', 'a.gupta@sharecar.in', 'Operations Lead');

-- Customer Support Inquiries
INSERT INTO customer_support (user_id, assigned_staff_id, inquiry_type, message, priority, status) VALUES
(1, 2, 'FASTag Toll Clarification', 'Confirmed Mumbai-Pune Expressway toll is fully included in ₹350 fare.', 'Low', 'Resolved'),
(3, 1, 'UPI Refund Verification',    'UPI instant refund status for cancelled seat on PhonePe handle.',      'Medium', 'Resolved');

-- Incident Reports
INSERT INTO safety_report (reporter_user_id, reported_user_id, reporter_role, report_type, description, status) VALUES
(9, 10, 'Passenger', 'Toll Cash Clarification', 'Driver inquired about FASTag; passenger clarified FASTag is pre-included in ShareCar fare.', 'Resolved');
