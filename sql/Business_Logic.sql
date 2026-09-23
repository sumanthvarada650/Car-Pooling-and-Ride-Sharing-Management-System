USE Carpool
GO

-- 1. Ride Booking (Passenger 15)
BEGIN TRAN;
BEGIN TRY
    -- Paasenger info and Preference
    DECLARE @PassengerIDToFind INT = 15;
    DECLARE @DestinationLocationID INT = 111;
    DECLARE @VehicleTypePreference VARCHAR(50) = 'Microbus';
    DECLARE @PassengerID INT;
    DECLARE @PassengerLocationID INT;
    DECLARE @PassengerLat DECIMAL(10, 8);
    DECLARE @PassengerLon DECIMAL(11, 8);
    DECLARE @PassengerBalance DECIMAL(10, 2);
    -- Destination Info & Fare
    DECLARE @DestinationLat DECIMAL(10, 8);
    DECLARE @DestinationLon DECIMAL(11, 8);
    DECLARE @NearestDriverID INT;
    DECLARE @RatePerKm DECIMAL(4, 2);
    DECLARE @CalculatedFare DECIMAL(8, 2);
    DECLARE @CalculatedDistanceKM DECIMAL(10, 2);

    --New Ride Info
    DECLARE @NewRideID INT;
    DECLARE @NewReviewID INT;
    DECLARE @NewPaymentID INT;
    DECLARE @NewRatingGiven DECIMAL(2, 1) = 4.0;
    -- Find the passenger's details using their ID
    SELECT
        @PassengerID = P.passenger_id,
        @PassengerLocationID = P.location_id,
        @PassengerLat = L.latitude,
        @PassengerLon = L.longitude,
        @PassengerBalance = P.balance
    FROM
        Passenger AS P
    JOIN
        [User] AS U ON P.passenger_id = U.user_id
    JOIN
        Location AS L ON P.location_id = L.location_id
    WHERE
        U.user_id = @PassengerIDToFind;
    -- Find the destination's coordinates
    SELECT
        @DestinationLat = latitude,
        @DestinationLon = longitude
    FROM
        Location
    WHERE
        location_id = @DestinationLocationID;
    --- Finding Nearest Driver
    SELECT TOP 1
        @NearestDriverID = D.driver_id
    FROM
        Driver AS D
    JOIN
        Location AS L ON D.location_id = L.location_id
    JOIN
        Vehicle AS V ON D.driver_id = V.driver_id
    CROSS APPLY (
        -- Calculating the distance in KM using the Haversine formula
        SELECT
            (6371 * 2 * ATN2(
                SQRT(
                    SIN(RADIANS(L.latitude - @PassengerLat) / 2) * SIN(RADIANS(L.latitude - @PassengerLat) / 2) +
                    COS(RADIANS(@PassengerLat)) * COS(RADIANS(L.latitude)) *
                    SIN(RADIANS(L.longitude - @PassengerLon) / 2) * SIN(RADIANS(L.longitude - @PassengerLon) / 2)
                ),
                SQRT(1 - (
                    SIN(RADIANS(L.latitude - @PassengerLat) / 2) * SIN(RADIANS(L.latitude - @PassengerLat) / 2) +
                    COS(RADIANS(@PassengerLat)) * COS(RADIANS(L.latitude)) *
                    SIN(RADIANS(L.longitude - @PassengerLon) / 2) * SIN(RADIANS(L.longitude - @PassengerLon) / 2)
                ))
            )) AS Kilometers
    ) AS Dist
    WHERE
        D.is_verified = 1
        AND V.[type] = @VehicleTypePreference
    ORDER BY
        Dist.Kilometers ASC;
    IF @NearestDriverID IS NULL
    BEGIN
        RAISERROR('No available drivers found.', 16, 1);
        ROLLBACK TRAN;
        RETURN;
    END;

    -- Calculating fare
    SET @CalculatedDistanceKM = (
        6371 * 2 * ATN2(
            SQRT(
                SIN(RADIANS(@DestinationLat - @PassengerLat) / 2) * SIN(RADIANS(@DestinationLat - @PassengerLat) / 2) +
                COS(RADIANS(@PassengerLat)) * COS(RADIANS(@DestinationLat)) *
                SIN(RADIANS(@DestinationLon - @PassengerLon) / 2) * SIN(RADIANS(@DestinationLon - @PassengerLon) / 2)
            ),
            SQRT(1 - (
                SIN(RADIANS(@DestinationLat - @PassengerLat) / 2) * SIN(RADIANS(@DestinationLat - @PassengerLat) / 2) +
                COS(RADIANS(@PassengerLat)) * COS(RADIANS(@DestinationLat)) *
                SIN(RADIANS(@DestinationLon - @PassengerLon) / 2) * SIN(RADIANS(@DestinationLon - @PassengerLon) / 2)
            ))
        )
    );
    -- fare by Vehicle catagory
    SET @RatePerKm = CASE @VehicleTypePreference
        WHEN 'Sedan' THEN 25.00
        WHEN 'SUV' THEN 35.00
        WHEN 'Hybrid' THEN 22.00
        WHEN 'Microbus' THEN 40.00
        ELSE 20.00 -- Default
    END;
    SET @CalculatedFare = @CalculatedDistanceKM * @RatePerKm;
    -- Check if passenger has enough balance
    IF @PassengerBalance < @CalculatedFare
    BEGIN
        RAISERROR('Insufficient balance for this ride.', 16, 1);
        ROLLBACK TRAN;
        RETURN;
    END;
    --  Creating new Ride record
    SELECT @NewRideID = ISNULL(MAX(ride_id), 0) + 1 FROM Ride;
    INSERT INTO Ride
    VALUES (
        @NewRideID,
        @PassengerID,
        @NearestDriverID,
        @PassengerLocationID,
        @DestinationLocationID,
        DATEADD(minute, -15, GETDATE()),
        GETDATE(),
        @CalculatedFare,
        'completed',
        @NewRatingGiven
    );
    -- Updating Passenger balance
    UPDATE Passenger
    SET balance = balance - @CalculatedFare
    WHERE passenger_id = @PassengerID;
    -- Updating Driver balance, ride_count and avg_rating
    UPDATE Driver
    SET
        balance = balance + @CalculatedFare,
        avg_rating = CASE
            WHEN ride_count = 0 THEN @NewRatingGiven
            ELSE ( (avg_rating * ride_count) + @NewRatingGiven ) / (ride_count + 1)
        END,
        ride_count = ride_count + 1
    WHERE
        driver_id = @NearestDriverID;
    -- Add to Review table
    SELECT @NewReviewID = ISNULL(MAX(review_id), 0) + 1 FROM Review;

    INSERT INTO Review (
        review_id,
        ride_id,
        reviewer_passenger_id,
        reviewed_driver_id,
        rating,
        [comment]
    )
    VALUES (
        @NewReviewID,
        @NewRideID,
        @PassengerID,
        @NearestDriverID,
        @NewRatingGiven,
        'The driver was very professional. A truly amazing and safe ride.'
    );
    SELECT @NewPaymentID = ISNULL(MAX(payment_id), 0) + 1 FROM Payment;
    -- Inserting Payment
    INSERT INTO Payment
    VALUES (
        @NewPaymentID,
        @NewRideID,
        @PassengerID,
        @CalculatedFare,
        GETDATE(),
        CASE
            WHEN @NewRideID % 3 = 0 THEN 'Cash'
            WHEN @NewRideID % 3 = 1 THEN 'Credit Card'
            ELSE 'Digital Wallet'
        END,
        CONCAT('TXN', RIGHT('0000' + CAST(@NewRideID AS VARCHAR(10)), 4)),
        'Success'
    );
    COMMIT TRAN;
    SELECT
        'Ride Booked, Completed & Paid Successfully!' AS Result,
        @NewRideID AS NewRideID,
        @NewPaymentID AS NewPaymentID,
        U_Pass.first_name AS PassengerName,
        U_Drive.first_name AS DriverName,
        @CalculatedFare AS Fare,
        @CalculATEDDistanceKM AS DistanceKM
    FROM
        [User] AS U_Pass
    JOIN
        [User] AS U_Drive ON U_Drive.user_id = @NearestDriverID
    WHERE
        U_Pass.user_id = @PassengerID;
END TRY
BEGIN CATCH
    ROLLBACK TRAN;
    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_LINE() AS ErrorLine;
END CATCH
GO


-- 2. Report Insertion
DECLARE @NewReportID INT = (SELECT ISNULL(MAX(report_id), 0) + 1 FROM Report);
DECLARE @UserWhoIsReporting INT = 15;
DECLARE @UserBeingReported INT = 10;
INSERT INTO Report (
    report_id,
    reporter_user_id,
    reported_user_id,
    reporter_role,
    report_type,
    [description],
    [status]
)
VALUES (
    @NewReportID,
    @UserWhoIsReporting,
    @UserBeingReported,
    'Passenger',
    'Driver Behavior',
    'Driver was speeding and playing music too loudly.',
    'Open'
);
SELECT * FROM Report WHERE report_id = @NewReportID;


-- 3. Checking Ticket History (User 3)
BEGIN TRAN;
BEGIN TRY

    DECLARE @SubmittingUserID INT = 3;
    DECLARE @InquiryType VARCHAR(100) = 'Account Help';
    DECLARE @MessageText VARCHAR(MAX) = 'I forgot my password and cannot reset it.';
    DECLARE @Priority VARCHAR(20) = 'High';
    -- Find the next available ticket_id
    DECLARE @NewTicketID INT;
    SET @NewTicketID = (SELECT ISNULL(MAX(ticket_id), 0) + 1 FROM Customer_Support);
    -- Insert the new ticket record
    INSERT INTO Customer_Support
    (
        ticket_id,
        user_id,
        assigned_staff_id,
        inquiry_type,
        [message],
        [priority],
        [status]
    )
    VALUES (
        @NewTicketID,
        @SubmittingUserID,
        NULL,
        @InquiryType,
        @MessageText,
        @Priority,
        'Pending Staff Review'
    );

    -- Assigned Staff to Handle Ticket
    DECLARE @AssignToStaffID INT = 2;
    UPDATE Customer_Support
    SET
        assigned_staff_id = @AssignToStaffID,
        [status] = 'In Progress'
    WHERE
        ticket_id = @NewTicketID;
    SELECT
        'My Open Ticket' AS ViewTitle,
        CS.ticket_id,
        CS.inquiry_type,
        CS.[status],
        CS.created_at,
        CS.[message],
        ISNULL(ST.first_name + ' ' + ST.last_name, 'Not Assigned Yet') AS AssignedStaff
    FROM
        Customer_Support AS CS
    LEFT JOIN
        Support_Team AS ST ON CS.assigned_staff_id = ST.support_staff_id
    WHERE
        CS.ticket_id = @NewTicketID;
    UPDATE Customer_Support
    SET
        [status] = 'Resolved'
    WHERE
        ticket_id = @NewTicketID;

    COMMIT TRAN;
END TRY
BEGIN CATCH
    ROLLBACK TRAN;
    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_LINE() AS ErrorLine;
END CATCH
GO