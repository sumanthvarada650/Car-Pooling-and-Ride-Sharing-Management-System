CREATE DATABASE Carpool
GO
USE Carpool
GO
-- USER table to store generic data of driver and passengers
CREATE TABLE [User] (
    user_id INT PRIMARY KEY,
    nid VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
-- Location table
CREATE TABLE Location (
    location_id INT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL
);
-- Vehicle table
CREATE TABLE Vehicle (
    vehicle_id INT PRIMARY KEY ,
    driver_id INT NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    [year] INT,
    license_plate VARCHAR(40) UNIQUE NOT NULL,
    color VARCHAR(50),
    [type] VARCHAR(50),
    capacity INT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES [User](user_id)
);
-- Passenger table
CREATE TABLE Passenger (
    passenger_id INT PRIMARY KEY,
    is_verified BIT DEFAULT 0,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    location_id INT NULL,
    FOREIGN KEY (passenger_id) REFERENCES [User](user_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);
-- Driver table
CREATE TABLE Driver (
    driver_id INT PRIMARY KEY,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    avg_rating DECIMAL(2, 1) DEFAULT 0.0,
    is_verified BIT DEFAULT 0,
    ride_count INT,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    location_id INT NULL,
    FOREIGN KEY (driver_id) REFERENCES [User](user_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);
-- Ride table
CREATE TABLE Ride (
    ride_id INT PRIMARY KEY,
    passenger_id INT NOT NULL,
    driver_id INT NOT NULL,
    pickup_location_id INT NOT NULL,
    dropoff_location_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    fare DECIMAL(8, 2) NOT NULL,
    [status] VARCHAR(50) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (pickup_location_id) REFERENCES Location(location_id),
    FOREIGN KEY (dropoff_location_id) REFERENCES Location(location_id)
);
-- Payment table
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY,
    ride_id INT UNIQUE NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(8, 2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    [status] VARCHAR(50) NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES Ride(ride_id),
    FOREIGN KEY (user_id) REFERENCES [User](user_id)
);
-- Review table
CREATE TABLE Review (
    review_id INT PRIMARY KEY ,
    ride_id INT NOT NULL,
    reviewer_passenger_id INT NOT NULL,
    reviewed_driver_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    [comment] VARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ride_id) REFERENCES Ride(ride_id),
    FOREIGN KEY (reviewer_passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (reviewed_driver_id) REFERENCES Driver(driver_id)
);
-- Support Team table
CREATE TABLE Support_Team (
    support_staff_id INT PRIMARY KEY IDENTITY(1,1),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    [role] VARCHAR(50)
);
-- Report table
CREATE TABLE Report (
    report_id INT PRIMARY KEY,
    reporter_user_id INT NOT NULL,
    reported_user_id INT NULL,
    reporter_role VARCHAR(20) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    [description] VARCHAR(MAX) NOT NULL,
    reported_at DATETIME DEFAULT GETDATE(),
    [status] VARCHAR(50) NOT NULL,
    FOREIGN KEY (reporter_user_id) REFERENCES [User](user_id),
    FOREIGN KEY (reported_user_id) REFERENCES [User](user_id),
);
-- Customer Support table
CREATE TABLE Customer_Support (
    ticket_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    assigned_staff_id INT NULL,
    inquiry_type VARCHAR(100),
    [message] VARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    priority VARCHAR(20),
    [status] VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES [User](user_id),
    FOREIGN KEY (assigned_staff_id) REFERENCES Support_Team(support_staff_id)
);