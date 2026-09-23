/**
 * ShareCar — PostgreSQL In-Memory Relational Database Engine
 * Architecture: 3NF Relational Design with ACID Transaction Mechanics
 * Indian Intent: Aadhaar KYC, RTO Driving Licenses, FASTag, Highway Dhabas,
 * UPI Payments (GPay, PhonePe, Paytm), Indian Vehicles (Innova, Ertiga CNG, Nexon EV),
 * and Indian Expressway & City Commuter Corridors.
 * All currency in INR (₹)
 */

class PostgresCarpoolDB {
    constructor() {
        this.resetToSeedData();
    }

    resetToSeedData() {
        // Table: app_user (Aadhaar KYC verified Indian identities)
        this.app_users = [
            { user_id: 1,  nid: 'AADHAAR-8291-3041-9012', first_name: 'Aryan',   last_name: 'Verma',    email: 'aryan.verma@example.com',   phone_number: '+91 98201 12345', password_hash: 'e10adc3949ba59abbe56e057f20f883e', created_at: '2024-01-10 09:30:00Z' },
            { user_id: 2,  nid: 'AADHAAR-9014-4182-8849', first_name: 'Priya',   last_name: 'Sharma',   email: 'priya.sharma@example.com',  phone_number: '+91 98230 45678', password_hash: 'f379eaf3c831b04de153469d1bec345e', created_at: '2024-01-11 10:15:00Z' },
            { user_id: 3,  nid: 'AADHAAR-7712-9920-1482', first_name: 'Rohan',   last_name: 'Mehta',    email: 'rohan.mehta@example.com',   phone_number: '+91 98450 78901', password_hash: '5170365a687339174548dce196f014e7', created_at: '2024-01-12 11:20:00Z' },
            { user_id: 4,  nid: 'AADHAAR-6641-9104-8201', first_name: 'Ananya',  last_name: 'Iyer',     email: 'ananya.iyer@example.com',   phone_number: '+91 97401 23456', password_hash: '8a5433a388b3f46f4ebc853ae2fb0b25', created_at: '2024-01-13 14:00:00Z' },
            { user_id: 5,  nid: 'AADHAAR-5532-8503-8291', first_name: 'Karan',   last_name: 'Patel',    email: 'karan.patel@example.com',   phone_number: '+91 98980 34567', password_hash: 'd8578edf8458ce06fbc5bb76a58c5ca4', created_at: '2024-01-14 15:45:00Z' },
            { user_id: 6,  nid: 'AADHAAR-4421-9204-9182', first_name: 'Divya',   last_name: 'Nair',     email: 'divya.nair@example.com',    phone_number: '+91 94470 56789', password_hash: '1679091c5a880faf6fb5e6087eb1b2dc', created_at: '2024-01-15 08:30:00Z' },
            { user_id: 7,  nid: 'AADHAAR-3310-8049-1820', first_name: 'Arjun',   last_name: 'Singh',    email: 'arjun.singh@example.com',   phone_number: '+91 98110 67890', password_hash: '25d55ad283aa400af464c76d713c07ad', created_at: '2024-01-16 16:10:00Z' },
            { user_id: 8,  nid: 'AADHAAR-2209-2049-1820', first_name: 'Meera',   last_name: 'Kapoor',   email: 'meera.kapoor@example.com',  phone_number: '+91 98710 78901', password_hash: 'e99a18c428cb38d5f260853678922e03', created_at: '2024-01-17 12:25:00Z' },
            { user_id: 9,  nid: 'AADHAAR-1198-8404-9182', first_name: 'Vikram',  last_name: 'Bose',     email: 'vikram.bose@example.com',   phone_number: '+91 98300 89012', password_hash: '1f32aa4c9a1d2ea010adcf2348166a04', created_at: '2024-01-24 08:15:00Z' },
            { user_id: 10, nid: 'AADHAAR-9987-8704-9182', first_name: 'Suresh',  last_name: 'Reddy',    email: 'suresh.reddy@example.com',  phone_number: '+91 98480 90123', password_hash: '900150983cd24fb0d6963f7d28e17f72', created_at: '2024-01-19 19:15:00Z' }
        ];

        // Table: location (Iconic Indian Highway Hubs, Metro Stations & IT Parks)
        this.locations = [
            // Intercity Highway Hubs
            { location_id: 1,  city_name: 'Mumbai',    address: 'Dadar TT Circle (Swami Narayan Mandir side)',     latitude: 19.0178, longitude: 72.8478, is_intercity_hub: true  },
            { location_id: 2,  city_name: 'Pune',      address: 'Wakad Flyover, Hinjawadi Junction (NH48)',        latitude: 18.5987, longitude: 73.7686, is_intercity_hub: true  },
            { location_id: 3,  city_name: 'Bengaluru', address: 'Silk Board Junction / Electronic City Toll',     latitude: 12.9172, longitude: 77.6229, is_intercity_hub: true  },
            { location_id: 4,  city_name: 'Chennai',   address: 'Koyambedu CMBT Inter-State Bus Terminus',         latitude: 13.0694, longitude: 80.1948, is_intercity_hub: true  },
            { location_id: 5,  city_name: 'Hyderabad', address: 'Gachibowli ORR Junction (Near Bio-Diversity)',    latitude: 17.4401, longitude: 78.3489, is_intercity_hub: true  },
            { location_id: 6,  city_name: 'Goa',       address: 'Panaji Kadamba Inter-State Bus Stand',            latitude: 15.4989, longitude: 73.8278, is_intercity_hub: true  },
            { location_id: 7,  city_name: 'Delhi NCR', address: 'Connaught Place (Rajiv Chowk Metro Gate 2)',     latitude: 28.6315, longitude: 77.2167, is_intercity_hub: true  },
            { location_id: 8,  city_name: 'Jaipur',    address: 'Sindhi Camp ISBT / 200ft Ajmer Expressway',       latitude: 26.9200, longitude: 75.7900, is_intercity_hub: true  },
            { location_id: 9,  city_name: 'Chandigarh',address: 'Sector 17 Inter-State Bus Terminal (ISBT)',       latitude: 30.7398, longitude: 76.7827, is_intercity_hub: true  },
            { location_id: 10, city_name: 'Mysuru',    address: 'Suburban Bus Stand, Bengaluru Expressway Exit',   latitude: 12.3051, longitude: 76.6552, is_intercity_hub: true  },

            // Within-City Urban Tech Corridors & Commute Stops
            { location_id: 11, city_name: 'Mumbai',    address: 'Bandra Kurla Complex (BKC Diamond Bourse Gate 2)',latitude: 19.0660, longitude: 72.8680, is_intercity_hub: false },
            { location_id: 12, city_name: 'Mumbai',    address: 'Andheri West Metro (SV Road Junction)',           latitude: 19.1136, longitude: 72.8697, is_intercity_hub: false },
            { location_id: 13, city_name: 'Mumbai',    address: 'Vashi Toll Plaza, Navi Mumbai',                   latitude: 19.0633, longitude: 72.9982, is_intercity_hub: false },
            { location_id: 14, city_name: 'Pune',      address: 'Hinjawadi Phase 1, Rajiv Gandhi Infotech Park',   latitude: 18.5913, longitude: 73.7389, is_intercity_hub: false },
            { location_id: 15, city_name: 'Pune',      address: 'Kothrud, Chandani Chowk Flyover',                 latitude: 18.5074, longitude: 73.7915, is_intercity_hub: false },
            { location_id: 16, city_name: 'Bengaluru', address: 'Whitefield ITPL Main Gate (Hope Farm)',           latitude: 12.9856, longitude: 77.7314, is_intercity_hub: false },
            { location_id: 17, city_name: 'Bengaluru', address: 'Koramangala 5th Block (Sony World Signal)',       latitude: 12.9352, longitude: 77.6245, is_intercity_hub: false },
            { location_id: 18, city_name: 'Delhi NCR', address: 'Gurugram Cyber Hub (DLF Phase 2 Rapid Metro)',   latitude: 28.4960, longitude: 77.0890, is_intercity_hub: false },
            { location_id: 19, city_name: 'Delhi NCR', address: 'Noida Sector 62 (Electronic City Metro Station)',  latitude: 28.6280, longitude: 77.3649, is_intercity_hub: false },
            { location_id: 20, city_name: 'Hyderabad', address: 'Hitec City Cyber Towers Junction',                latitude: 17.4504, longitude: 78.3808, is_intercity_hub: false }
        ];

        // Table: passenger
        this.passengers = [
            { passenger_id: 1, is_verified: true,  balance: 1450.00, location_id: 1  },
            { passenger_id: 3, is_verified: true,  balance: 3200.00, location_id: 3  },
            { passenger_id: 5, is_verified: false, balance: 650.50,  location_id: 2  },
            { passenger_id: 7, is_verified: true,  balance: 2800.00, location_id: 4  },
            { passenger_id: 9, is_verified: true,  balance: 4500.00, location_id: 1  }
        ];

        // Table: driver (Government RTO DL authenticated)
        this.drivers = [
            { driver_id: 2,  license_number: 'MH-02-2020-0084912', avg_rating: 4.9, is_verified: true, ride_count: 164, balance: 55000.25, location_id: 1 },
            { driver_id: 4,  license_number: 'KA-51-2019-0092143', avg_rating: 4.8, is_verified: true, ride_count: 112, balance: 34000.50, location_id: 3 },
            { driver_id: 6,  license_number: 'TN-07-2022-0034182', avg_rating: 4.9, is_verified: true, ride_count: 78,  balance: 18500.00, location_id: 4 },
            { driver_id: 8,  license_number: 'TS-09-2018-0056129', avg_rating: 5.0, is_verified: true, ride_count: 235, balance: 92000.80, location_id: 5 },
            { driver_id: 10, license_number: 'DL-04-2021-0071205', avg_rating: 4.7, is_verified: true, ride_count: 52,  balance: 12500.00, location_id: 7 }
        ];

        // Table: vehicle (Top Indian Carpool & Commute Vehicles)
        this.vehicles = [
            { vehicle_id: 1, driver_id: 2,  manufacturer: 'Toyota',         model: 'Innova Crysta 2.4 VX',  fuel_type: 'Diesel AC', year: 2022, license_plate: 'MH-12-RN-8821', color: 'Pearl White',    type: 'MUV / 7-Seater', capacity: 7 },
            { vehicle_id: 2, driver_id: 4,  manufacturer: 'Tata Motors',    model: 'Nexon EV Empowered+',   fuel_type: 'Electric EV',year: 2023, license_plate: 'KA-01-MJ-4520', color: 'Daytona Grey',   type: 'Electric SUV',   capacity: 5 },
            { vehicle_id: 3, driver_id: 6,  manufacturer: 'Honda',          model: 'City 1.5 i-VTEC ZX',    fuel_type: 'Petrol AC',   year: 2021, license_plate: 'TN-07-BW-3344', color: 'Lunar Silver',   type: 'Executive Sedan',capacity: 5 },
            { vehicle_id: 4, driver_id: 8,  manufacturer: 'Mahindra',       model: 'XUV700 AX7 Luxury',     fuel_type: 'Diesel AC', year: 2023, license_plate: 'TS-07-JK-9922', color: 'Midnight Black', type: 'Premium SUV',   capacity: 7 },
            { vehicle_id: 5, driver_id: 10, manufacturer: 'Maruti Suzuki',  model: 'Ertiga ZXi (CNG)',      fuel_type: 'CNG Green', year: 2023, license_plate: 'DL-3C-CA-9012', color: 'Magma Grey',     type: 'MPV / 7-Seater', capacity: 7 }
        ];

        // Table: carpool_ride (Rich Indian Expressway & City Corridors)
        this.rides = [
            // Intercity Expressways & National Highways
            {
                ride_id: 1, driver_id: 2,
                origin_location_id: 1, destination_location_id: 2, // Mumbai (Dadar) → Pune (Wakad)
                ride_category: 'intercity', departure_time: 'Today, 06:30 AM',
                route_via: 'via Mumbai-Pune Expressway',
                available_seats: 4, total_seats: 6, price_per_seat: 350,
                luggage_size: 'Medium (1 Trolley)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 2, driver_id: 4,
                origin_location_id: 3, destination_location_id: 4, // Bengaluru (Silk Board) → Chennai (CMBT)
                ride_category: 'intercity', departure_time: 'Today, 07:00 AM',
                route_via: 'via NH44 Hosur-Krishnagiri Expressway',
                available_seats: 3, total_seats: 5, price_per_seat: 650,
                luggage_size: 'Large (Suitcase + Bag)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 3, driver_id: 10,
                origin_location_id: 7, destination_location_id: 8, // Delhi (CP) → Jaipur (Sindhi Camp)
                ride_category: 'intercity', departure_time: 'Today, 08:00 AM',
                route_via: 'via Delhi-Mumbai Expressway',
                available_seats: 4, total_seats: 7, price_per_seat: 480,
                luggage_size: 'Medium (Dicky Space)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 4, driver_id: 8,
                origin_location_id: 5, destination_location_id: 3, // Hyderabad (Gachibowli) → Bengaluru (Silk Board)
                ride_category: 'intercity', departure_time: 'Today, 05:30 AM',
                route_via: 'via NH44 Highway Express',
                available_seats: 5, total_seats: 7, price_per_seat: 850,
                luggage_size: 'Large (Dicky Space)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 5, driver_id: 10,
                origin_location_id: 7, destination_location_id: 9, // Delhi (CP) → Chandigarh (ISBT 17)
                ride_category: 'intercity', departure_time: 'Today, 09:30 AM',
                route_via: 'via GT Road / Murthal Dhaba Stop',
                available_seats: 3, total_seats: 6, price_per_seat: 420,
                luggage_size: 'Medium (1 Bag)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 6, driver_id: 2,
                origin_location_id: 1, destination_location_id: 6, // Mumbai → Goa (Panaji)
                ride_category: 'intercity', departure_time: 'Tomorrow, 09:00 PM',
                route_via: 'via NH66 Konkan Highway',
                available_seats: 3, total_seats: 6, price_per_seat: 950,
                luggage_size: 'Large (Full Dicky)', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },
            {
                ride_id: 7, driver_id: 4,
                origin_location_id: 3, destination_location_id: 10, // Bengaluru → Mysuru
                ride_category: 'intercity', departure_time: 'Today, 04:30 PM',
                route_via: 'via Bengaluru-Mysuru 10-Lane Expressway',
                available_seats: 3, total_seats: 5, price_per_seat: 250,
                luggage_size: 'Small / Medium', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: false, ladies_only: false
            },
            {
                ride_id: 8, driver_id: 6,
                origin_location_id: 2, destination_location_id: 1, // Pune (Wakad) → Mumbai (Dadar)
                ride_category: 'intercity', departure_time: 'Today, 05:00 PM',
                route_via: 'via Mumbai-Pune Expressway',
                available_seats: 3, total_seats: 5, price_per_seat: 380,
                luggage_size: 'Small / Backpack', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: true, ladies_only: false
            },

            // Daily Urban Tech Corridors & City Commutes
            {
                ride_id: 9, driver_id: 2,
                origin_location_id: 15, destination_location_id: 14, // Kothrud (Chandani Chowk) → Hinjawadi Phase 1
                ride_category: 'within_city', departure_time: 'In 10 mins',
                route_via: 'via NH48 Bypass to IT Park',
                available_seats: 3, total_seats: 6, price_per_seat: 80,
                luggage_size: 'Laptop Backpack', instant_booking: true, status: 'scheduled',
                fastag: false, ac: true, chai_stop: false, ladies_only: false
            },
            {
                ride_id: 10, driver_id: 4,
                origin_location_id: 16, destination_location_id: 17, // Whitefield ITPL → Koramangala 5th Block
                ride_category: 'within_city', departure_time: 'In 15 mins',
                route_via: 'via HAL Old Airport Road / ORR',
                available_seats: 2, total_seats: 5, price_per_seat: 120,
                luggage_size: 'Laptop Bag Only', instant_booking: true, status: 'scheduled',
                fastag: false, ac: true, chai_stop: false, ladies_only: true
            },
            {
                ride_id: 11, driver_id: 10,
                origin_location_id: 7, destination_location_id: 18, // Connaught Place → Gurugram Cyber Hub
                ride_category: 'within_city', departure_time: 'In 25 mins',
                route_via: 'via NH48 / Delhi-Gurgaon Expressway',
                available_seats: 4, total_seats: 7, price_per_seat: 140,
                luggage_size: 'Office Backpack', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: false, ladies_only: false
            },
            {
                ride_id: 12, driver_id: 2,
                origin_location_id: 11, destination_location_id: 13, // BKC Diamond Bourse → Vashi Toll Plaza
                ride_category: 'within_city', departure_time: 'In 18 mins',
                route_via: 'via Eastern Express Highway & Sion-Panvel',
                available_seats: 3, total_seats: 6, price_per_seat: 90,
                luggage_size: 'Office Bag', instant_booking: true, status: 'scheduled',
                fastag: true, ac: true, chai_stop: false, ladies_only: false
            },
            {
                ride_id: 13, driver_id: 8,
                origin_location_id: 20, destination_location_id: 5, // Hitec City Cyber Towers → Gachibowli ORR
                ride_category: 'within_city', departure_time: 'In 8 mins',
                route_via: 'via Mindspace IT Corridor',
                available_seats: 4, total_seats: 7, price_per_seat: 75,
                luggage_size: 'Laptop Bag', instant_booking: true, status: 'scheduled',
                fastag: false, ac: true, chai_stop: false, ladies_only: false
            }
        ];

        // Table: ride_booking (Seat reservations)
        this.bookings = [
            { booking_id: 1, ride_id: 1, passenger_id: 1, seats_booked: 1, total_amount: 350,  booking_status: 'confirmed', booked_at: '2024-02-01 06:10:00Z' },
            { booking_id: 2, ride_id: 9, passenger_id: 9, seats_booked: 1, total_amount: 80,   booking_status: 'confirmed', booked_at: '2024-02-01 08:30:00Z' },
            { booking_id: 3, ride_id: 2, passenger_id: 3, seats_booked: 1, total_amount: 650,  booking_status: 'completed', booked_at: '2024-01-28 06:45:00Z' },
            { booking_id: 4, ride_id: 3, passenger_id: 7, seats_booked: 2, total_amount: 960,  booking_status: 'confirmed', booked_at: '2024-02-01 07:15:00Z' }
        ];

        // Table: payment (Indian UPI Ledger: GPay, PhonePe, Paytm, BHIM)
        this.payments = [
            { payment_id: 1, booking_id: 1, user_id: 1, amount: 350,  payment_method: 'UPI (Google Pay)',      transaction_id: 'UPI/402819204910/GPAY',    status: 'Success', payment_date: '2024-02-01 06:12:00Z' },
            { payment_id: 2, booking_id: 2, user_id: 9, amount: 80,   payment_method: 'ShareCar UPI Wallet',   transaction_id: 'TXN-SC-WLT-99210',         status: 'Success', payment_date: '2024-02-01 08:31:00Z' },
            { payment_id: 3, booking_id: 3, user_id: 3, amount: 650,  payment_method: 'UPI (PhonePe)',         transaction_id: 'UPI/402819381029/PHONEPE', status: 'Success', payment_date: '2024-01-28 06:47:00Z' },
            { payment_id: 4, booking_id: 4, user_id: 7, amount: 960,  payment_method: 'Net Banking (HDFC Bank)',transaction_id: 'TXN-HDFC-9912048',        status: 'Success', payment_date: '2024-02-01 07:17:00Z' }
        ];

        // Table: review (Authentic Indian Commuter Feedback)
        this.reviews = [
            { review_id: 1, ride_id: 1, reviewer_passenger_id: 1, reviewed_driver_id: 2, rating: 5, comment: 'Super comfortable Innova Crysta on the Mumbai-Pune Expressway. Stopped for a quick tea and vada pav break at the Food Mall. Punctual pickup at Dadar TT!', created_at: '2024-02-01 10:30:00Z' },
            { review_id: 2, ride_id: 2, reviewer_passenger_id: 3, reviewed_driver_id: 4, rating: 5, comment: 'Silky smooth and silent ride in the Nexon EV to Chennai. Driver Ananya is very courteous, car is spotlessly clean with FASTag toll covered.', created_at: '2024-01-28 14:00:00Z' },
            { review_id: 3, ride_id: 3, reviewer_passenger_id: 7, reviewed_driver_id: 10, rating: 5, comment: 'Cruised on the new Delhi-Mumbai Expressway to Jaipur. AC was chilled, dicky had ample space for our suitcases. Will book again!', created_at: '2024-02-01 13:45:00Z' },
            { review_id: 4, ride_id: 10, reviewer_passenger_id: 6, reviewed_driver_id: 4, rating: 5, comment: 'The Ladies-Only option between Whitefield and Koramangala is a gamechanger for women techies. Very safe and stress-free.', created_at: '2024-02-01 18:20:00Z' }
        ];

        // Table: support_team
        this.supportTeam = [
            { support_staff_id: 1, first_name: 'Ramesh',  last_name: 'Verma',  email: 'r.verma@sharecar.in',    role: 'Tier 1 Support' },
            { support_staff_id: 2, first_name: 'Sumitra', last_name: 'Das',    email: 's.das@sharecar.in',      role: 'KYC & Safety Specialist' },
            { support_staff_id: 3, first_name: 'Ajay',    last_name: 'Gupta',  email: 'a.gupta@sharecar.in',    role: 'Operations Lead' }
        ];

        // Table: customer_support
        this.customerSupport = [
            { ticket_id: 1, user_id: 1, assigned_staff_id: 2, inquiry_type: 'FASTag Toll Clarification', message: 'Confirmed that Mumbai-Pune Expressway toll is fully included in the ₹350 fare.', priority: 'Low',    status: 'Resolved',    created_at: '2024-02-02 09:00:00Z' },
            { ticket_id: 2, user_id: 3, assigned_staff_id: 1, inquiry_type: 'UPI Refund Verification',    message: 'UPI instant refund status for cancelled seat reversal on PhonePe handle.', priority: 'Medium', status: 'Resolved',    created_at: '2024-02-03 11:30:00Z' },
            { ticket_id: 3, user_id: 5, assigned_staff_id: 3, inquiry_type: 'Luggage / Boot Space',       message: 'Inquiry regarding carrying two trolley bags in Ertiga CNG dicky for weekend trip.', priority: 'Low', status: 'Open', created_at: '2024-02-04 14:00:00Z' }
        ];

        // Table: safety_report
        this.reports = [
            { report_id: 1, reporter_user_id: 9, reported_user_id: 10, reporter_role: 'Passenger', report_type: 'Toll Cash Clarification', description: 'Driver asked whether FASTag was enabled; passenger clarified FASTag is pre-included in ShareCar fare.', status: 'Resolved', reported_at: '2024-02-03 14:00:00Z' }
        ];

        // Auto-increment counters
        this._nextBookingId = this.bookings.length + 1;
        this._nextPaymentId = this.payments.length + 1;
        this._nextRideId    = this.rides.length + 1;
    }

    // =================================================================
    // Geospatial Distance (Haversine Formula)
    // =================================================================
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const toRad = deg => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    }

    // =================================================================
    // Carpool Search Engine
    // =================================================================
    searchRides(leavingFrom = '', goingTo = '', category = 'all', seatsNeeded = 1) {
        return this.rides
            .filter(ride => {
                if (ride.status !== 'scheduled') return false;
                if (ride.available_seats < Number(seatsNeeded)) return false;

                if (category === 'intercity' && ride.ride_category !== 'intercity') return false;
                if (category === 'within_city' && ride.ride_category !== 'within_city') return false;
                if (category === 'ladies_only' && !ride.ladies_only) return false;

                const origin = this.locations.find(l => l.location_id === ride.origin_location_id);
                const dest   = this.locations.find(l => l.location_id === ride.destination_location_id);

                if (leavingFrom.trim()) {
                    const q = leavingFrom.toLowerCase().trim();
                    if (!origin || (!origin.city_name.toLowerCase().includes(q) && !origin.address.toLowerCase().includes(q))) return false;
                }
                if (goingTo.trim()) {
                    const q = goingTo.toLowerCase().trim();
                    if (!dest || (!dest.city_name.toLowerCase().includes(q) && !dest.address.toLowerCase().includes(q))) return false;
                }
                return true;
            })
            .map(ride => this._enrichRide(ride));
    }

    _enrichRide(ride) {
        const origin  = this.locations.find(l => l.location_id === ride.origin_location_id);
        const dest    = this.locations.find(l => l.location_id === ride.destination_location_id);
        const driver  = this.drivers.find(d => d.driver_id === ride.driver_id);
        const user    = this.app_users.find(u => u.user_id === ride.driver_id);
        const vehicle = this.vehicles.find(v => v.driver_id === ride.driver_id);
        const dist    = origin && dest ? this.calculateDistance(origin.latitude, origin.longitude, dest.latitude, dest.longitude) : '—';

        return {
            ...ride,
            originCity: origin?.city_name || '—',
            originAddress: origin?.address || '—',
            destCity: dest?.city_name || '—',
            destAddress: dest?.address || '—',
            distanceKm: dist,
            driverName: user ? `${user.first_name} ${user.last_name}` : 'Verified Driver',
            driverAvatar: user ? `${user.first_name[0]}${user.last_name[0]}` : 'VD',
            driverRating: driver?.avg_rating || 5.0,
            driverRides: driver?.ride_count || 10,
            driverLicense: driver?.license_number || 'MH-RTO-DL',
            driverAadhaarVerified: true,
            vehicleModel: vehicle ? `${vehicle.manufacturer} ${vehicle.model}` : 'Comfort Car',
            vehiclePlate: vehicle?.license_plate || 'IND-RTO',
            vehicleColor: vehicle?.color || 'White',
            vehicleFuel: vehicle?.fuel_type || 'AC Fuel',
            routeVia: ride.route_via || (ride.ride_category === 'intercity' ? 'via National Expressway' : 'via City IT Corridor'),
            hasFastag: ride.fastag !== false,
            hasAc: ride.ac !== false,
            hasChaiStop: !!ride.chai_stop,
            isLadiesOnly: !!ride.ladies_only
        };
    }

    // =================================================================
    // ACID Seat Booking Transaction
    // =================================================================
    bookSeatsTransaction(rideId, passengerId, seatsToBook) {
        const log = [];
        log.push({ step: 'BEGIN', msg: 'BEGIN; -- PostgreSQL ACID transaction started', status: 'info' });

        // 1. Lock and validate ride
        const ride = this.rides.find(r => r.ride_id === rideId);
        if (!ride) {
            log.push({ step: 'ROLLBACK', msg: 'ROLLBACK; -- ERROR: carpool_ride ID not found', status: 'error' });
            return { success: false, error: 'Ride not found.', log };
        }
        log.push({ step: 'SELECT...FOR UPDATE', msg: `SELECT * FROM carpool_ride WHERE ride_id = ${rideId} FOR UPDATE; -- Row-level lock acquired`, status: 'success' });

        // 2. Validate seat availability
        if (ride.available_seats < seatsToBook) {
            log.push({ step: 'ROLLBACK', msg: `ROLLBACK; -- CONSTRAINT VIOLATION: requested ${seatsToBook} seats > available ${ride.available_seats}`, status: 'error' });
            return { success: false, error: `Only ${ride.available_seats} seat(s) remain. Please adjust your request.`, log };
        }
        log.push({ step: 'CHECK seats', msg: `CHECK: available_seats (${ride.available_seats}) >= seats_requested (${seatsToBook}) ✓`, status: 'success' });

        // 3. Check passenger balance
        const passenger = this.passengers.find(p => p.passenger_id === passengerId);
        if (!passenger) {
            log.push({ step: 'ROLLBACK', msg: 'ROLLBACK; -- ERROR: passenger profile not found', status: 'error' });
            return { success: false, error: 'Passenger profile not found.', log };
        }
        const totalFare = seatsToBook * ride.price_per_seat;
        if (passenger.balance < totalFare) {
            log.push({ step: 'ROLLBACK', msg: `ROLLBACK; -- INSUFFICIENT FUNDS: Wallet ₹${passenger.balance.toFixed(2)} < Fare ₹${totalFare.toFixed(2)}`, status: 'error' });
            return { success: false, error: `Insufficient wallet balance. Total fare is ₹${totalFare.toFixed(2)}, available ₹${passenger.balance.toFixed(2)}. Please recharge via UPI.`, log };
        }
        log.push({ step: 'CHECK balance', msg: `CHECK: passenger.balance (₹${passenger.balance.toFixed(2)}) >= total_fare (₹${totalFare.toFixed(2)}) ✓`, status: 'success' });

        // 4. Deduct passenger balance
        passenger.balance = parseFloat((passenger.balance - totalFare).toFixed(2));
        log.push({ step: 'UPDATE passenger', msg: `UPDATE passenger SET balance = balance - ${totalFare.toFixed(2)} WHERE passenger_id = ${passengerId};`, status: 'success' });

        // 5. Credit driver balance
        const driver = this.drivers.find(d => d.driver_id === ride.driver_id);
        if (driver) {
            driver.balance = parseFloat((driver.balance + totalFare).toFixed(2));
            log.push({ step: 'UPDATE driver', msg: `UPDATE driver SET balance = balance + ${totalFare.toFixed(2)} WHERE driver_id = ${ride.driver_id};`, status: 'success' });
        }

        // 6. Reduce available seats
        ride.available_seats -= seatsToBook;
        if (ride.available_seats === 0) ride.status = 'full';
        log.push({ step: 'UPDATE carpool_ride', msg: `UPDATE carpool_ride SET available_seats = ${ride.available_seats} WHERE ride_id = ${rideId};`, status: 'success' });

        // 7. Insert ride_booking record
        const booking = {
            booking_id: this._nextBookingId++,
            ride_id: rideId, passenger_id: passengerId,
            seats_booked: seatsToBook, total_amount: totalFare,
            booking_status: 'confirmed', booked_at: new Date().toISOString()
        };
        this.bookings.push(booking);
        log.push({ step: 'INSERT ride_booking', msg: `INSERT INTO ride_booking (booking_id, ride_id, passenger_id, seats_booked, total_amount, status) VALUES (${booking.booking_id}, ${rideId}, ${passengerId}, ${seatsToBook}, ${totalFare}, 'confirmed');`, status: 'success' });

        // 8. Insert payment record (UPI / ShareCar Wallet)
        const payment = {
            payment_id: this._nextPaymentId++,
            booking_id: booking.booking_id, user_id: passengerId,
            amount: totalFare, payment_method: 'ShareCar UPI Wallet',
            transaction_id: `UPI/SC-${Date.now()}`,
            status: 'Success', payment_date: new Date().toISOString()
        };
        this.payments.push(payment);
        log.push({ step: 'INSERT payment', msg: `INSERT INTO payment (payment_id, booking_id, user_id, amount, payment_method, status) VALUES (${payment.payment_id}, ${booking.booking_id}, ${passengerId}, ₹${totalFare.toFixed(2)}, 'ShareCar UPI Wallet', 'Success');`, status: 'success' });

        log.push({ step: 'COMMIT', msg: `COMMIT; -- ✅ ACID transaction committed! Booking #${booking.booking_id} confirmed. ₹${totalFare.toFixed(2)} debited from wallet.`, status: 'success' });
        return { success: true, booking, log };
    }

    // =================================================================
    // Publish a New Ride (Driver Flow)
    // =================================================================
    publishRide(driverId, originId, destId, category, departureTime, seats, price, luggage, routeVia = '', fuel = 'Petrol AC', ladiesOnly = false) {
        const ride = {
            ride_id: this._nextRideId++,
            driver_id: Number(driverId),
            origin_location_id: Number(originId),
            destination_location_id: Number(destId),
            ride_category: category,
            departure_time: departureTime,
            route_via: routeVia || (category === 'intercity' ? 'via National Expressway / FASTag' : 'via City Tech Corridor'),
            available_seats: Number(seats),
            total_seats: Number(seats),
            price_per_seat: parseFloat(price),
            luggage_size: luggage,
            instant_booking: true,
            status: 'scheduled',
            fastag: true,
            ac: true,
            chai_stop: category === 'intercity',
            ladies_only: Boolean(ladiesOnly)
        };
        this.rides.push(ride);
        return ride;
    }

    // =================================================================
    // Top-Up Passenger Balance (UPI Flow)
    // =================================================================
    topUpBalance(passengerId, amount) {
        const passenger = this.passengers.find(p => p.passenger_id === passengerId);
        if (passenger) {
            passenger.balance = parseFloat((passenger.balance + amount).toFixed(2));
            const payment = {
                payment_id: this._nextPaymentId++,
                booking_id: null, user_id: passengerId,
                amount, payment_method: 'UPI Instant Top-Up (GPay/PhonePe)',
                transaction_id: `UPI/TOPUP-${Date.now()}`,
                status: 'Success', payment_date: new Date().toISOString()
            };
            this.payments.push(payment);
        }
    }

    // =================================================================
    // Get Table Data for PostgreSQL Inspector
    // =================================================================
    getTableData(tableName) {
        switch (tableName) {
            case 'carpool_ride':     return this.rides;
            case 'ride_booking':     return this.bookings;
            case 'payment':          return this.payments;
            case 'app_user':         return this.app_users;
            case 'location':         return this.locations;
            case 'passenger':        return this.passengers;
            case 'driver':           return this.drivers;
            case 'vehicle':          return this.vehicles;
            case 'review':           return this.reviews;
            case 'customer_support': return this.customerSupport;
            case 'safety_report':    return this.reports;
            default: return [];
        }
    }

    // =================================================================
    // Export PostgreSQL SQL Dump
    // =================================================================
    exportPostgreSql() {
        const ts = new Date().toISOString();
        let sql = `-- ShareCar India — PostgreSQL Schema Dump\n-- Generated: ${ts}\n-- Architecture: 3NF Normalized Relational Database\n-- Indian Context: Aadhaar KYC, RTO DL Verification, FASTag, UPI Ledger\n\n`;

        sql += `-- Extension\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;
        sql += `-- Enum Types\nCREATE TYPE ride_category AS ENUM ('intercity', 'within_city');\nCREATE TYPE booking_status AS ENUM ('confirmed', 'completed', 'cancelled');\n\n`;

        sql += `-- Table: app_user\nCREATE TABLE app_user (\n  user_id SERIAL PRIMARY KEY,\n  nid VARCHAR(40) UNIQUE NOT NULL, -- Aadhaar / Govt ID\n  first_name VARCHAR(50) NOT NULL,\n  last_name VARCHAR(50) NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  phone_number VARCHAR(20) NOT NULL,\n  password_hash VARCHAR(64) NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

        sql += `-- Table: location\nCREATE TABLE location (\n  location_id SERIAL PRIMARY KEY,\n  city_name VARCHAR(80) NOT NULL,\n  address VARCHAR(200),\n  latitude NUMERIC(9,6),\n  longitude NUMERIC(9,6),\n  is_intercity_hub BOOLEAN DEFAULT FALSE\n);\n\n`;

        sql += `-- Table: passenger\nCREATE TABLE passenger (\n  passenger_id INT PRIMARY KEY REFERENCES app_user(user_id),\n  is_verified BOOLEAN DEFAULT TRUE,\n  balance NUMERIC(12,2) DEFAULT 0.00,\n  location_id INT REFERENCES location(location_id)\n);\n\n`;

        sql += `-- Table: driver\nCREATE TABLE driver (\n  driver_id INT PRIMARY KEY REFERENCES app_user(user_id),\n  license_number VARCHAR(40) UNIQUE NOT NULL, -- RTO Driving License\n  avg_rating NUMERIC(3,2) DEFAULT 0.00,\n  is_verified BOOLEAN DEFAULT TRUE,\n  ride_count INT DEFAULT 0,\n  balance NUMERIC(12,2) DEFAULT 0.00,\n  location_id INT REFERENCES location(location_id)\n);\n\n`;

        sql += `-- Table: vehicle\nCREATE TABLE vehicle (\n  vehicle_id SERIAL PRIMARY KEY,\n  driver_id INT NOT NULL REFERENCES driver(driver_id),\n  manufacturer VARCHAR(50),\n  model VARCHAR(80),\n  fuel_type VARCHAR(30),\n  year INT,\n  license_plate VARCHAR(25) UNIQUE, -- Indian RTO Registration\n  color VARCHAR(40),\n  type VARCHAR(30),\n  capacity INT NOT NULL\n);\n\n`;

        sql += `-- Table: carpool_ride\nCREATE TABLE carpool_ride (\n  ride_id SERIAL PRIMARY KEY,\n  driver_id INT NOT NULL REFERENCES driver(driver_id),\n  origin_location_id INT NOT NULL REFERENCES location(location_id),\n  destination_location_id INT NOT NULL REFERENCES location(location_id),\n  ride_category ride_category NOT NULL,\n  departure_time VARCHAR(60),\n  route_via VARCHAR(100),\n  available_seats INT NOT NULL,\n  total_seats INT NOT NULL,\n  price_per_seat NUMERIC(10,2) NOT NULL, -- INR (₹)\n  luggage_size VARCHAR(40),\n  instant_booking BOOLEAN DEFAULT TRUE,\n  fastag BOOLEAN DEFAULT TRUE,\n  ac BOOLEAN DEFAULT TRUE,\n  status VARCHAR(20) DEFAULT 'scheduled'\n);\n\n`;

        sql += `-- Table: ride_booking\nCREATE TABLE ride_booking (\n  booking_id SERIAL PRIMARY KEY,\n  ride_id INT NOT NULL REFERENCES carpool_ride(ride_id),\n  passenger_id INT NOT NULL REFERENCES passenger(passenger_id),\n  seats_booked INT NOT NULL,\n  total_amount NUMERIC(10,2) NOT NULL, -- INR (₹)\n  booking_status booking_status DEFAULT 'confirmed',\n  booked_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

        sql += `-- Table: payment\nCREATE TABLE payment (\n  payment_id SERIAL PRIMARY KEY,\n  booking_id INT REFERENCES ride_booking(booking_id),\n  user_id INT NOT NULL REFERENCES app_user(user_id),\n  amount NUMERIC(10,2) NOT NULL, -- INR (₹)\n  payment_method VARCHAR(60), -- UPI / NetBanking / Wallet\n  transaction_id VARCHAR(60) UNIQUE,\n  status VARCHAR(20),\n  payment_date TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

        // Insert seed data
        sql += `-- Seed Data\n\n-- INSERT INTO app_user\n`;
        this.app_users.forEach(u => {
            sql += `INSERT INTO app_user VALUES (${u.user_id}, '${u.nid}', '${u.first_name}', '${u.last_name}', '${u.email}', '${u.phone_number}', '${u.password_hash}', '${u.created_at}');\n`;
        });

        sql += `\n-- INSERT INTO location\n`;
        this.locations.forEach(l => {
            sql += `INSERT INTO location VALUES (${l.location_id}, '${l.city_name}', '${l.address.replace(/'/g, "''")}', ${l.latitude}, ${l.longitude}, ${l.is_intercity_hub});\n`;
        });

        sql += `\n-- INSERT INTO vehicle\n`;
        this.vehicles.forEach(v => {
            sql += `INSERT INTO vehicle VALUES (${v.vehicle_id}, ${v.driver_id}, '${v.manufacturer}', '${v.model}', '${v.fuel_type}', ${v.year}, '${v.license_plate}', '${v.color}', '${v.type}', ${v.capacity});\n`;
        });

        sql += `\n-- INSERT INTO carpool_ride\n`;
        this.rides.forEach(r => {
            sql += `INSERT INTO carpool_ride VALUES (${r.ride_id}, ${r.driver_id}, ${r.origin_location_id}, ${r.destination_location_id}, '${r.ride_category}', '${r.departure_time}', '${r.route_via}', ${r.available_seats}, ${r.total_seats}, ${r.price_per_seat}, '${r.luggage_size}', ${r.instant_booking}, ${r.fastag}, ${r.ac}, '${r.status}');\n`;
        });

        sql += `\n-- INSERT INTO ride_booking\n`;
        this.bookings.forEach(b => {
            sql += `INSERT INTO ride_booking VALUES (${b.booking_id}, ${b.ride_id}, ${b.passenger_id}, ${b.seats_booked}, ${b.total_amount}, '${b.booking_status}', '${b.booked_at}');\n`;
        });

        sql += `\n-- INSERT INTO payment\n`;
        this.payments.forEach(p => {
            sql += `INSERT INTO payment VALUES (${p.payment_id}, ${p.booking_id || 'NULL'}, ${p.user_id}, ${p.amount}, '${p.payment_method}', '${p.transaction_id}', '${p.status}', '${p.payment_date}');\n`;
        });

        sql += `\n-- End of ShareCar India PostgreSQL Dump\n`;
        return sql;
    }
}

// Initialize global DB instance
window.carpoolDB = new PostgresCarpoolDB();
