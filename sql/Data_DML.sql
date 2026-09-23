USE Carpool
GO

-- User Data (Aadhaar KYC verified Indian identities)
INSERT INTO [User] (user_id, nid, first_name, last_name, email, phone_number, password_hash) VALUES
(1,  'AADHAAR-8291-3041-9012', 'Aryan',   'Verma',     'aryan.verma@example.com',    '+91 98201 12345', 'e10adc3949ba59abbe56e057f20f883e'),
(2,  'AADHAAR-9014-4182-8849', 'Priya',   'Sharma',    'priya.sharma@example.com',   '+91 98230 45678', 'f379eaf3c831b04de153469d1bec345e'),
(3,  'AADHAAR-7712-9920-1482', 'Rohan',   'Mehta',     'rohan.mehta@example.com',    '+91 98450 78901', '5170365a687339174548dce196f014e7'),
(4,  'AADHAAR-6641-9104-8201', 'Ananya',  'Iyer',      'ananya.iyer@example.com',    '+91 97401 23456', '8a5433a388b3f46f4ebc853ae2fb0b25'),
(5,  'AADHAAR-5532-8503-8291', 'Karan',   'Patel',     'karan.patel@example.com',    '+91 98980 34567', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(6,  'AADHAAR-4421-9204-9182', 'Divya',   'Nair',      'divya.nair@example.com',     '+91 94470 56789', '1679091c5a880faf6fb5e6087eb1b2dc'),
(7,  'AADHAAR-3310-8049-1820', 'Arjun',   'Singh',     'arjun.singh@example.com',    '+91 98110 67890', '25d55ad283aa400af464c76d713c07ad'),
(8,  'AADHAAR-2209-2049-1820', 'Meera',   'Kapoor',    'meera.kapoor@example.com',   '+91 98710 78901', 'e99a18c428cb38d5f260853678922e03'),
(9,  'AADHAAR-1198-8404-9182', 'Vikram',  'Bose',      'vikram.bose@example.com',    '+91 98300 89012', '1f32aa4c9a1d2ea010adcf2348166a04'),
(10, 'AADHAAR-9987-8704-9182', 'Suresh',  'Reddy',     'suresh.reddy@example.com',   '+91 98480 90123', '900150983cd24fb0d6963f7d28e17f72'),
(11, 'AADHAAR-9304-9182-1102', 'Neha',    'Gupta',     'neha.gupta@example.com',     '+91 98101 23456', '02c75fb22c75b23dc963b7eb0b014266'),
(12, 'AADHAAR-8904-9182-1203', 'Aditya',  'Deshmukh',  'aditya.d@example.com',       '+91 98220 34567', 'fcea920f7412b4da7be0cf6f11c62e80'),
(13, 'AADHAAR-2004-9182-1304', 'Pooja',   'Kulkarni',  'pooja.k@example.com',        '+91 98231 45678', 'a3dcb4d229de6fde0db5686dee47145d'),
(14, 'AADHAAR-9604-9182-1405', 'Manish',  'Choudhary', 'manish.c@example.com',       '+91 98290 56789', '7694f4a66316e53c8cdd9d9954bd611d'),
(15, 'AADHAAR-8404-9182-1506', 'Siddharth','Menon',   'siddharth.m@example.com',    '+91 94460 67890', '1f32aa4c9a1d2ea010adcf2348166a04'),
(16, 'AADHAAR-9904-9182-1607', 'Kavita',  'Pillai',    'kavita.p@example.com',       '+91 94480 78901', '4e4d6c332b6fe62a63afe56171fd3725'),
(17, 'AADHAAR-8604-9182-1708', 'Rajesh',  'Kumar',     'rajesh.k@example.com',       '+91 98111 89012', 'b59c67bf196a4758191e42f76670ceba'),
(18, 'AADHAAR-2034-9182-1809', 'Swati',   'Bhattacharya','swati.b@example.com',      '+91 98310 90123', 'c56d0e9a7cddcc759f25a0ff9ec06124'),
(19, 'AADHAAR-9144-9182-1910', 'Gaurav',  'Saxena',    'gaurav.s@example.com',       '+91 98102 01234', '5f4dcc3b5aa765d61d8327deb882cf99'),
(20, 'AADHAAR-8254-9182-2011', 'Deepa',   'Sundaram',  'deepa.s@example.com',        '+91 98401 12345', '3d2172418ce305c7d16d4b05597c6a59');

-- Location Data (Iconic Indian Transit Hubs & Tech Corridors)
INSERT INTO Location VALUES
(101, 'Dadar TT Circle (Swami Narayan Mandir side), Mumbai',       19.0178, 72.8478),
(102, 'Wakad Flyover, Hinjawadi Junction (NH48), Pune',            18.5987, 73.7686),
(103, 'Silk Board Junction / Electronic City Toll, Bengaluru',     12.9172, 77.6229),
(104, 'Koyambedu CMBT Inter-State Bus Terminus, Chennai',         13.0694, 80.1948),
(105, 'Gachibowli ORR Junction (Bio-Diversity), Hyderabad',        17.4401, 78.3489),
(106, 'Panaji Kadamba Inter-State Bus Stand, Goa',                15.4989, 73.8278),
(107, 'Connaught Place (Rajiv Chowk Metro Gate 2), Delhi NCR',     28.6315, 77.2167),
(108, 'Sindhi Camp ISBT / 200ft Ajmer Expressway, Jaipur',         26.9200, 75.7900),
(109, 'Sector 17 Inter-State Bus Terminal (ISBT), Chandigarh',     30.7398, 76.7827),
(110, 'Suburban Bus Stand, Bengaluru Expressway Exit, Mysuru',     12.3051, 76.6552),
(111, 'Bandra Kurla Complex (BKC Diamond Bourse Gate 2), Mumbai',  19.0660, 72.8680),
(112, 'Hinjawadi Phase 1, Rajiv Gandhi Infotech Park, Pune',       18.5913, 73.7389),
(113, 'Whitefield ITPL Main Gate (Hope Farm), Bengaluru',          12.9856, 77.7314),
(114, 'Gurugram Cyber Hub (DLF Phase 2 Rapid Metro), Delhi NCR',   28.4960, 77.0890),
(115, 'Hitec City Cyber Towers Junction, Hyderabad',               17.4504, 78.3808);

-- Passenger Data (Balances in INR ₹)
INSERT INTO Passenger VALUES
(1,  1, 1450.00, 101),
(3,  1, 3200.00, 103),
(5,  0, 650.50,  102),
(7,  1, 2800.00, 107),
(9,  1, 4500.00, 101),
(11, 1, 1200.00, 104),
(13, 0, 750.50,  105),
(15, 1, 999.00,  108),
(16, 1, 2300.00, 113),
(19, 1, 1500.00, 114);

-- Driver Data (State RTO Driving Licenses)
INSERT INTO Driver VALUES
(2,  'MH-02-2020-0084912', 4.9, 1, 164, 55000.25, 101),
(4,  'KA-51-2019-0092143', 4.8, 1, 112, 34000.50, 103),
(6,  'TN-07-2022-0034182', 4.9, 1, 78,  18500.00, 104),
(8,  'TS-09-2018-0056129', 5.0, 1, 235, 92000.80, 105),
(10, 'DL-04-2021-0071205', 4.7, 1, 52,  12500.00, 107),
(12, 'MH-12-2021-0065219', 4.8, 1, 88,  26000.00, 102),
(14, 'RJ-14-2020-0043198', 4.6, 1, 60,  17500.00, 108),
(17, 'KA-03-2022-0054210', 4.9, 1, 95,  31000.00, 113),
(18, 'HR-26-2021-0087123', 4.7, 1, 70,  21500.00, 114),
(20, 'AP-09-2020-0032189', 4.8, 1, 84,  24500.00, 115);

-- Vehicle Data (Indian Vehicle Registry)
INSERT INTO Vehicle VALUES
(1,  2,  'Toyota',        'Innova Crysta 2.4 VX', 2022, 'MH-12-RN-8821', 'Pearl White',    'MUV',         7),
(2,  4,  'Tata Motors',   'Nexon EV Empowered+',  2023, 'KA-01-MJ-4520', 'Daytona Grey',   'Electric SUV',5),
(3,  6,  'Honda',         'City 1.5 i-VTEC ZX',   2021, 'TN-07-BW-3344', 'Lunar Silver',   'Sedan',       5),
(4,  8,  'Mahindra',      'XUV700 AX7 Luxury',    2023, 'TS-07-JK-9922', 'Midnight Black', 'SUV',         7),
(5,  10, 'Maruti Suzuki', 'Ertiga ZXi (CNG)',     2023, 'DL-3C-CA-9012', 'Magma Grey',     'MPV',         7),
(6,  12, 'Mahindra',      'Scorpio-N Z8L',        2022, 'MH-14-GH-6055', 'Deep Forest',    'SUV',         7),
(7,  14, 'Hyundai',       'Creta SX(O) Diesel',   2022, 'RJ-14-CA-2122', 'Polar White',    'SUV',         5),
(8,  17, 'Tata Motors',   'Harrier Fearless+',    2023, 'KA-03-NB-8219', 'Sunlit Yellow',  'SUV',         5),
(9,  18, 'Maruti Suzuki', 'Swift Dzire VXi (CNG)',2022, 'HR-26-DQ-4344', 'Arctic White',   'Sedan',       5),
(10, 20, 'Toyota',        'Urban Cruiser Hyryder', 2023, 'TS-09-FA-7711', 'Sportin Red',    'Hybrid',      5);

-- Support Team Data (@sharecar.in)
INSERT INTO Support_Team VALUES
('Ramesh',  'Verma',  'r.verma@sharecar.in',  'Tier 1 Support'),
('Sumitra', 'Das',    's.das@sharecar.in',    'KYC & Safety Specialist'),
('Ajay',    'Gupta',  'a.gupta@sharecar.in',  'Operations Lead'),
('Deepika', 'Rao',    'd.rao@sharecar.in',    'Tier 1 Support'),
('Naveen',  'Patil',  'n.patil@sharecar.in',  'Tier 1 Support'),
('Farhan',  'Ansari', 'f.ansari@sharecar.in', 'Tier 2 Specialist'),
('Gita',    'Sharma', 'g.sharma@sharecar.in', 'Tier 1 Support'),
('Harish',  'Reddy',  'h.reddy@sharecar.in',  'Tier 1 Support'),
('Ishaan',  'Bose',   'i.bose@sharecar.in',   'Tier 2 Specialist'),
('Jayesh',  'Mehta',  'j.mehta@sharecar.in',  'Operations Manager');