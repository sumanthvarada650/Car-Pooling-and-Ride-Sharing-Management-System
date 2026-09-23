USE Carpool
GO

-- 4. Ride History for Passenger 15
SELECT * FROM Ride
WHERE passenger_id = 15

-- 5. Passenger Balance (Passenger ID 15)
SELECT
    P.passenger_id AS Passenger_ID,
    concat(U.first_name ,' ', U.last_name) AS Passenger_Name,
    P.balance AS My_Balance
FROM Passenger AS P
JOIN [User] AS U
    ON P.passenger_id = U.user_id
WHERE P.passenger_id = 15

-- 6. Driver Balance (Driver ID 10)
SELECT
    D.driver_id AS Driver_ID,
    CONCAT(U.first_name, ' ', U.last_name) AS Driver_Name,
    D.balance AS My_Balance
FROM
    Driver AS D
JOIN
    [User] AS U ON D.driver_id = U.user_id
WHERE
    D.driver_id = 10;

-- 7. Data Verification: Ride History for Driver 10
SELECT
    R.ride_id,R.passenger_id, 
    CONCAT(U_Pass.first_name, ' ', U_Pass.last_name) AS Passenger_Name,
    R.driver_id,
    CONCAT(U_Drive.first_name, ' ', U_Drive.last_name) AS DriverName,
    R.pickup_location_id,R.dropoff_location_id,R.start_time,R.end_time,R.fare,R.status,R.rating
FROM
    Ride AS R
JOIN
    [User] AS U_Pass ON R.passenger_id = U_Pass.user_id
JOIN
    [User] AS U_Drive ON R.driver_id = U_Drive.user_id 
WHERE
    R.driver_id = 10;

-- 8. Checking Ticket History for User 3
SELECT * FROM Customer_Support
WHERE user_id = 3