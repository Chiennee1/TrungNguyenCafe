USE TrungNguyenCafeChain;
GO

-- ============================================================
-- Chi nhánh HN (002) — 45 đơn
-- Chi nhánh HCM (003) — 45 đơn
-- Tổng: 90 đơn, trải từ 01/04 → 17/04/2026
-- ============================================================

DECLARE @tid_hn        UNIQUEIDENTIFIER = '00000000-0000-0000-0000-000000000002';
DECLARE @tid_hcm       UNIQUEIDENTIFIER = '00000000-0000-0000-0000-000000000003';
DECLARE @uid_hn_staff  UNIQUEIDENTIFIER = '20000000-0000-0000-0000-000000000004';
DECLARE @uid_hn_mgr    UNIQUEIDENTIFIER = '20000000-0000-0000-0000-000000000003';
DECLARE @uid_hcm_staff UNIQUEIDENTIFIER = '20000000-0000-0000-0000-000000000007';
DECLARE @baseDate4     DATETIME2        = '2026-04-01 07:30:00';

-- Bảng tạm lưu OrderId để tham chiếu OrderItem
DECLARE @apr_orders TABLE (
    seq INT,
    orderId UNIQUEIDENTIFIER,
    tenantId UNIQUEIDENTIFIER,
    createdAt DATETIME2
);

-- ── 1.1 Sinh đơn HN (seq 1–45) ─────────────────────────────
DECLARE @n INT = 1;
DECLARE @oid UNIQUEIDENTIFIER;
DECLARE @odate DATETIME2;
DECLARE @opaid DATETIME2;
DECLARE @ocid  UNIQUEIDENTIFIER;
DECLARE @opm   VARCHAR(20);
DECLARE @otot  DECIMAL(12,2);

WHILE @n <= 45
BEGIN
    SET @oid   = NEWID();

    -- Ngày trải đều 01–17/04, ~2–3 đơn/ngày, giờ cao điểm sáng/chiều
    SET @odate = DATEADD(MINUTE,
                    (@n * 37) % 600,
                    DATEADD(HOUR,
                        CASE (@n % 3)
                            WHEN 0 THEN 7   -- sáng sớm 7h
                            WHEN 1 THEN 10  -- sáng 10h
                            ELSE        15  -- chiều 15h
                        END,
                        DATEADD(DAY, (@n - 1) / 3, @baseDate4)
                    )
                 );
    SET @opaid = DATEADD(MINUTE, 3, @odate);

    -- Khách hàng xoay vòng (kể cả vãng lai)
    SET @ocid = CASE (@n % 6)
        WHEN 0 THEN '30000000-0000-0000-0000-000000000001'  -- Hoa
        WHEN 1 THEN '30000000-0000-0000-0000-000000000002'  -- Bình
        WHEN 2 THEN '30000000-0000-0000-0000-000000000006'  -- Hùng
        WHEN 3 THEN NULL                                    -- vãng lai
        WHEN 4 THEN '30000000-0000-0000-0000-000000000007'  -- Mỹ Linh
        ELSE        '30000000-0000-0000-0000-000000000010'  -- Khoa
    END;

    -- Thanh toán: tháng 4 xu hướng chuyển khoản nhiều hơn
    SET @opm = CASE (@n % 5)
        WHEN 0 THEN 'CASH'
        WHEN 1 THEN 'MOMO'
        WHEN 2 THEN 'VNPAY'
        WHEN 3 THEN 'MOMO'
        ELSE        'CASH'
    END;

    -- Tổng tiền thực tế (cuối tuần cao hơn)
    SET @otot = CASE
        WHEN @n % 7 IN (0,6) THEN  -- cuối tuần
            CASE (@n % 4)
                WHEN 0 THEN 175000.00
                WHEN 1 THEN 220000.00
                WHEN 2 THEN 148000.00
                ELSE        195000.00
            END
        ELSE  -- ngày thường
            CASE (@n % 5)
                WHEN 0 THEN  93000.00
                WHEN 1 THEN  64000.00
                WHEN 2 THEN 110000.00
                WHEN 3 THEN  87000.00
                ELSE         58000.00
            END
    END;

    INSERT INTO tbl_Order
        (OrderId, TenantId, UserId, CustomerId, iStatus, fTotal, sPaymentMethod, dCreatedAt, dPaidAt)
    VALUES
        (@oid, @tid_hn, @uid_hn_staff, @ocid, 1, @otot, @opm, @odate, @opaid);

    INSERT INTO @apr_orders
    VALUES
        (@n, @oid, @tid_hn, @odate);

    SET @n = @n + 1;
END;

-- ── 1.2 Sinh đơn HCM (seq 46–90) ───────────────────────────
SET @n = 46;
WHILE @n <= 90
BEGIN
    SET @oid   = NEWID();
    SET @odate = DATEADD(MINUTE,
                    ((@n - 45) * 41) % 600,
                    DATEADD(HOUR,
                        CASE (@n % 3)
                            WHEN 0 THEN 8
                            WHEN 1 THEN 11
                            ELSE        16
                        END,
                        DATEADD(DAY, ((@n - 46)) / 3, @baseDate4)
                    )
                 );
    SET @opaid = DATEADD(MINUTE, 2, @odate);

    SET @ocid = CASE (@n % 6)
        WHEN 0 THEN '30000000-0000-0000-0000-000000000003'  -- Cúc
        WHEN 1 THEN '30000000-0000-0000-0000-000000000004'  -- Đức
        WHEN 2 THEN '30000000-0000-0000-0000-000000000005'  -- Lan
        WHEN 3 THEN NULL
        WHEN 4 THEN '30000000-0000-0000-0000-000000000009'  -- Thu Hương
        ELSE        '30000000-0000-0000-0000-000000000008'  -- Tùng
    END;

    SET @opm = CASE (@n % 5)
        WHEN 0 THEN 'CASH'
        WHEN 1 THEN 'VNPAY'
        WHEN 2 THEN 'ZALOPAY'
        WHEN 3 THEN 'MOMO'
        ELSE        'CASH'
    END;

    SET @otot = CASE
        WHEN @n % 7 IN (0,6) THEN
            CASE (@n % 4)
                WHEN 0 THEN 210000.00
                WHEN 1 THEN 185000.00
                WHEN 2 THEN 265000.00   -- có Weasel coffee
                ELSE        155000.00
            END
        ELSE
            CASE (@n % 5)
                WHEN 0 THEN 110000.00
                WHEN 1 THEN  87000.00
                WHEN 2 THEN 130000.00
                WHEN 3 THEN  93000.00
                ELSE          75000.00
            END
    END;

    INSERT INTO tbl_Order
        (OrderId, TenantId, UserId, CustomerId, iStatus, fTotal, sPaymentMethod, dCreatedAt, dPaidAt)
    VALUES
        (@oid, @tid_hcm, @uid_hcm_staff, @ocid, 1, @otot, @opm, @odate, @opaid);

    INSERT INTO @apr_orders
    VALUES
        (@n, @oid, @tid_hcm, @odate);

    SET @n = @n + 1;
END;
GO

-- ============================================================
-- PHẦN 2: ORDER ITEMS — gắn sản phẩm vào từng đơn
-- ============================================================

-- Lấy lại OrderId từ DB
-- HN Orders: lấy 45 đơn mới nhất của HN trong tháng 4
-- HCM Orders: lấy 45 đơn mới nhất của HCM trong tháng 4

-- ── 2.1 OrderItems cho HN ──────────────────────────────────
DECLARE @hn_orders TABLE (seq INT IDENTITY(1,1),
    oid UNIQUEIDENTIFIER);
INSERT INTO @hn_orders
    (oid)
SELECT TOP 45
    OrderId
FROM tbl_Order
WHERE TenantId = '00000000-0000-0000-0000-000000000002'
    AND dCreatedAt >= '2026-04-01'
ORDER BY dCreatedAt DESC;

DECLARE @hi INT = 1;
DECLARE @h_oid UNIQUEIDENTIFIER;

WHILE @hi <= 45
BEGIN
    SELECT @h_oid = oid
    FROM @hn_orders
    WHERE seq = @hi;

    -- Sản phẩm chính (xoay 6 sản phẩm phổ biến HN)
    INSERT INTO tbl_OrderItem
        (OrderId, ProductId, iQuantity, fUnitPrice)
    VALUES
        (
            @h_oid,
            CASE (@hi % 6)
            WHEN 0 THEN '50000000-0000-0000-0002-000000000001'  -- CF đen đá      29k
            WHEN 1 THEN '50000000-0000-0000-0002-000000000005'  -- CF sữa đá      35k
            WHEN 2 THEN '50000000-0000-0000-0002-000000000007'  -- Cappuccino      55k
            WHEN 3 THEN '50000000-0000-0000-0002-000000000010'  -- Trà đào         45k
            WHEN 4 THEN '50000000-0000-0000-0002-000000000008'  -- Caffe Latte     58k
            ELSE        '50000000-0000-0000-0002-000000000006'  -- Bạc xỉu         38k
        END,
            CASE WHEN @hi % 4 = 0 THEN 2 ELSE 1 END,
            CASE (@hi % 6)
            WHEN 0 THEN 29000.00
            WHEN 1 THEN 35000.00
            WHEN 2 THEN 55000.00
            WHEN 3 THEN 45000.00
            WHEN 4 THEN 58000.00
            ELSE        38000.00
        END
    );

    -- Sản phẩm phụ (đồ ăn kèm, 60% đơn)
    IF @hi % 5 != 0
    BEGIN
        INSERT INTO tbl_OrderItem
            (OrderId, ProductId, iQuantity, fUnitPrice)
        VALUES
            (
                @h_oid,
                CASE (@hi % 4)
                WHEN 0 THEN '50000000-0000-0000-0002-000000000015'  -- Croissant       35k
                WHEN 1 THEN '50000000-0000-0000-0002-000000000016'  -- Bánh mì bơ tỏi  28k
                WHEN 2 THEN '50000000-0000-0000-0002-000000000019'  -- Nước suối        15k
                ELSE        '50000000-0000-0000-0002-000000000020'  -- Pepsi lon        20k
            END,
                1,
                CASE (@hi % 4)
                WHEN 0 THEN 35000.00
                WHEN 1 THEN 28000.00
                WHEN 2 THEN 15000.00
                ELSE        20000.00
            END
        );
    END;

    -- Thêm sản phẩm thứ 3 vào đơn lớn (cuối tuần)
    IF @hi % 7 IN (0, 6)
    BEGIN
        INSERT INTO tbl_OrderItem
            (OrderId, ProductId, iQuantity, fUnitPrice)
        VALUES
            (
                @h_oid,
                CASE (@hi % 3)
                WHEN 0 THEN '50000000-0000-0000-0002-000000000017'  -- Legend Blend    75k
                WHEN 1 THEN '50000000-0000-0000-0002-000000000012'  -- Trà sữa trân châu 52k
                ELSE        '50000000-0000-0000-0002-000000000009'  -- Flat White       60k
            END,
                1,
                CASE (@hi % 3)
                WHEN 0 THEN 75000.00
                WHEN 1 THEN 52000.00
                ELSE        60000.00
            END
        );
    END;

    SET @hi = @hi + 1;
END;

-- ── 2.2 OrderItems cho HCM ─────────────────────────────────
DECLARE @hcm_orders TABLE (seq INT IDENTITY(1,1),
    oid UNIQUEIDENTIFIER);
INSERT INTO @hcm_orders
    (oid)
SELECT TOP 45
    OrderId
FROM tbl_Order
WHERE TenantId = '00000000-0000-0000-0000-000000000003'
    AND dCreatedAt >= '2026-04-01'
ORDER BY dCreatedAt DESC;

DECLARE @ci INT = 1;
DECLARE @c_oid UNIQUEIDENTIFIER;

WHILE @ci <= 45
BEGIN
    SELECT @c_oid = oid
    FROM @hcm_orders
    WHERE seq = @ci;

    INSERT INTO tbl_OrderItem
        (OrderId, ProductId, iQuantity, fUnitPrice)
    VALUES
        (
            @c_oid,
            CASE (@ci % 7)
            WHEN 0 THEN '50000000-0000-0000-0003-000000000005'  -- CF sữa đá      35k
            WHEN 1 THEN '50000000-0000-0000-0003-000000000007'  -- Cappuccino      55k
            WHEN 2 THEN '50000000-0000-0000-0003-000000000009'  -- Cold Brew sữa   65k
            WHEN 3 THEN '50000000-0000-0000-0003-000000000010'  -- Trà đào         45k
            WHEN 4 THEN '50000000-0000-0000-0003-000000000012'  -- Sinh tố bơ      65k
            WHEN 5 THEN '50000000-0000-0000-0003-000000000016'  -- Legend Blend    75k
            ELSE        '50000000-0000-0000-0003-000000000001'  -- CF đen đá       29k
        END,
            CASE WHEN @ci % 3 = 0 THEN 2 ELSE 1 END,
            CASE (@ci % 7)
            WHEN 0 THEN 35000.00
            WHEN 1 THEN 55000.00
            WHEN 2 THEN 65000.00
            WHEN 3 THEN 45000.00
            WHEN 4 THEN 65000.00
            WHEN 5 THEN 75000.00
            ELSE        29000.00
        END
    );

    IF @ci % 4 != 0
    BEGIN
        INSERT INTO tbl_OrderItem
            (OrderId, ProductId, iQuantity, fUnitPrice)
        VALUES
            (
                @c_oid,
                CASE (@ci % 5)
                WHEN 0 THEN '50000000-0000-0000-0003-000000000014'  -- Bánh tiramisu   65k
                WHEN 1 THEN '50000000-0000-0000-0003-000000000019'  -- Nước suối        15k
                WHEN 2 THEN '50000000-0000-0000-0003-000000000013'  -- Sinh tố dâu     60k
                WHEN 3 THEN '50000000-0000-0000-0003-000000000011'  -- Trà vải lài      48k
                ELSE        '50000000-0000-0000-0003-000000000020'  -- Nước cam ép      45k
            END,
                1,
                CASE (@ci % 5)
                WHEN 0 THEN 65000.00
                WHEN 1 THEN 15000.00
                WHEN 2 THEN 60000.00
                WHEN 3 THEN 48000.00
                ELSE        45000.00
            END
        );
    END;

    -- Weasel coffee cho khách VIP (Đức - PLATINUM) vào cuối tuần
    IF @ci % 7 = 0
    BEGIN
        INSERT INTO tbl_OrderItem
            (OrderId, ProductId, iQuantity, fUnitPrice)
        VALUES
            (
                @c_oid,
                '50000000-0000-0000-0003-000000000015', -- Weasel Coffee 250k
                1,
                250000.00
        );
    END;

    SET @ci = @ci + 1;
END;
GO

-- ============================================================
-- PHẦN 3: STOCK HISTORY THÁNG 4 — nhập kho đầu tháng + trừ theo đơn
-- ============================================================

-- ── 3.1 Nhập kho đầu tháng 4 (01–03/04) ────────────────────
INSERT INTO tbl_StockHistory
    (TenantId, IngredientId, OrderId, fChangeAmount, sType, sNote, UserId, dCreatedAt)
VALUES
    -- HN nhập kho 01/04
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000001', NULL, 8000.000, 'IMPORT', N'Nhập cà phê Robusta đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:00:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000002', NULL, 5000.000, 'IMPORT', N'Nhập cà phê Arabica đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:05:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000003', NULL, 20000.000, 'IMPORT', N'Nhập sữa tươi đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:10:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000004', NULL, 6000.000, 'IMPORT', N'Nhập sữa đặc đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:15:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000006', NULL, 60000.000, 'IMPORT', N'Nhập đá viên đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:20:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000007', NULL, 400.000, 'IMPORT', N'Nhập túi trà đào tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:25:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000012', NULL, 2000.000, 'IMPORT', N'Nhập ly nhựa tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:30:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000013', NULL, 3000.000, 'IMPORT', N'Nhập ống hút tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-01 07:35:00'),

    -- HCM nhập kho 02/04
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000001', NULL, 10000.000, 'IMPORT', N'Nhập Robusta đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:00:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000002', NULL, 6000.000, 'IMPORT', N'Nhập Arabica đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:05:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000003', NULL, 30000.000, 'IMPORT', N'Nhập sữa tươi đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:10:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000006', NULL, 80000.000, 'IMPORT', N'Nhập đá viên đầu tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:15:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000007', NULL, 600.000, 'IMPORT', N'Nhập túi trà đào tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:20:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000011', NULL, 8000.000, 'IMPORT', N'Nhập quả bơ tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:25:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000015', NULL, 500.000, 'IMPORT', N'Nhập cà phê chồn rang tháng 4', '20000000-0000-0000-0000-000000000008', '2026-04-02 07:30:00'),

    -- HN nhập bổ sung giữa tháng 10/04 (hàng tiêu thụ nhanh)
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000001', NULL, 5000.000, 'IMPORT', N'Nhập bổ sung Robusta 10/04', '20000000-0000-0000-0000-000000000008', '2026-04-10 08:00:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000003', NULL, 15000.000, 'IMPORT', N'Nhập bổ sung sữa 10/04', '20000000-0000-0000-0000-000000000008', '2026-04-10 08:10:00'),
    ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000006', NULL, 40000.000, 'IMPORT', N'Nhập đá bổ sung 10/04', '20000000-0000-0000-0000-000000000008', '2026-04-10 08:20:00'),

    -- HCM nhập bổ sung 12/04
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000003', NULL, 20000.000, 'IMPORT', N'Nhập bổ sung sữa tươi 12/04', '20000000-0000-0000-0000-000000000008', '2026-04-12 07:30:00'),
    ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000010', NULL, 5000.000, 'IMPORT', N'Nhập dâu tây tươi 12/04', '20000000-0000-0000-0000-000000000008', '2026-04-12 07:35:00');

-- ── 3.2 Trừ kho theo tiêu thụ thực (01–17/04) ──────────────
DECLARE @sd INT = 1;
WHILE @sd <= 17
BEGIN
    DECLARE @sdate DATETIME2 = DATEADD(DAY, @sd - 1, '2026-04-01 18:00:00');

    -- HN: trừ kho cuối mỗi ngày
    INSERT INTO tbl_StockHistory
        (TenantId, IngredientId, OrderId, fChangeAmount, sType, sNote, UserId, dCreatedAt)
    VALUES
        ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000001', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 540.000 ELSE 324.000 END),
            'DEDUCT', N'Tiêu thụ Robusta ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000004', @sdate),

        ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000003', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 4500.000 ELSE 2700.000 END),
            'DEDUCT', N'Tiêu thụ sữa tươi ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000004', @sdate),

        ('00000000-0000-0000-0000-000000000002', '60000000-0000-0000-0002-000000000006', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 6000.000 ELSE 4000.000 END),
            'DEDUCT', N'Tiêu thụ đá viên ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000004', @sdate),

        -- HCM: tiêu thụ cao hơn HN ~30%
        ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000001', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 720.000 ELSE 432.000 END),
            'DEDUCT', N'Tiêu thụ Robusta ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000007', @sdate),

        ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000003', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 6000.000 ELSE 3600.000 END),
            'DEDUCT', N'Tiêu thụ sữa tươi ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000007', @sdate),

        ('00000000-0000-0000-0000-000000000003', '60000000-0000-0000-0003-000000000006', NULL,
            -(CASE WHEN @sd % 7 IN (0,6) THEN 8000.000 ELSE 5000.000 END),
            'DEDUCT', N'Tiêu thụ đá viên ngày ' + CAST(@sd AS NVARCHAR) + '/04',
            '20000000-0000-0000-0000-000000000007', @sdate);

    SET @sd = @sd + 1;
END;
GO

-- ============================================================
-- PHẦN 4: LOYALTY HISTORY THÁNG 4
-- ============================================================

DECLARE @lk INT = 1;
WHILE @lk <= 40
BEGIN
    DECLARE @lcust UNIQUEIDENTIFIER;
    DECLARE @lten  UNIQUEIDENTIFIER;
    DECLARE @lpts  INT;
    DECLARE @ltype VARCHAR(10);
    DECLARE @lnote NVARCHAR(200);
    DECLARE @ldate DATETIME2 = DATEADD(HOUR, @lk % 12 + 8,
                                DATEADD(DAY, (@lk - 1) / 3, '2026-04-01'));

    SET @lcust = CASE (@lk % 8)
        WHEN 0 THEN '30000000-0000-0000-0000-000000000001'  -- Hoa (SILVER)
        WHEN 1 THEN '30000000-0000-0000-0000-000000000002'  -- Bình (GOLD)
        WHEN 2 THEN '30000000-0000-0000-0000-000000000004'  -- Đức (PLATINUM)
        WHEN 3 THEN '30000000-0000-0000-0000-000000000006'  -- Hùng (SILVER)
        WHEN 4 THEN '30000000-0000-0000-0000-000000000007'  -- Mỹ Linh (SILVER)
        WHEN 5 THEN '30000000-0000-0000-0000-000000000009'  -- Thu Hương (GOLD)
        WHEN 6 THEN '30000000-0000-0000-0000-000000000010'  -- Khoa (SILVER)
        ELSE        '30000000-0000-0000-0000-000000000003'  -- Cúc (BRONZE)
    END;

    SET @lten = CASE WHEN @lk % 2 = 0
        THEN '00000000-0000-0000-0000-000000000002'
        ELSE '00000000-0000-0000-0000-000000000003'
    END;

    -- Đức PLATINUM đổi điểm nhiều; GOLD tích nhiều; còn lại tích thường
    IF @lk % 6 = 0 AND @lcust = '30000000-0000-0000-0000-000000000004'
    BEGIN
        SET @lpts  = -500;
        SET @ltype = 'REDEEM';
        SET @lnote = N'Đổi 500 điểm lấy 1 ly Weasel Coffee';
    END
    ELSE IF @lk % 9 = 0
    BEGIN
        SET @lpts  = -200;
        SET @ltype = 'REDEEM';
        SET @lnote = N'Đổi điểm lấy đồ uống miễn phí';
    END
    ELSE IF @lk % 4 = 0
    BEGIN
        SET @lpts  = 200;
        SET @ltype = 'EARN';
        SET @lnote = N'Tích điểm hóa đơn trên 150.000đ';
    END
    ELSE IF @lk % 3 = 0
    BEGIN
        SET @lpts  = 100;
        SET @ltype = 'EARN';
        SET @lnote = N'Tích điểm hóa đơn 80.000–150.000đ';
    END
    ELSE
    BEGIN
        SET @lpts  = 50;
        SET @ltype = 'EARN';
        SET @lnote = N'Tích điểm 1 ly tiêu chuẩn tháng 4';
    END;

    INSERT INTO tbl_LoyaltyHistory
        (CustomerId, TenantId, OrderId, iPointChange, sType, sNote, dCreatedAt)
    VALUES
        (@lcust, @lten, NULL, @lpts, @ltype, @lnote, @ldate);

    SET @lk = @lk + 1;
END;
GO

-- ============================================================
-- PHẦN 5: PAYMENT TRANSACTIONS THÁNG 4
-- Lấy đơn thanh toán online của tháng 4
-- ============================================================

INSERT INTO tbl_PaymentTransaction
    (TransactionId, OrderId, TenantId, sGateway, sGatewayTransId, fAmount, iStatus, dCreatedAt, dUpdatedAt)
SELECT
    NEWID(),
    o.OrderId,
    o.TenantId,
    o.sPaymentMethod,
    'APR26' + FORMAT(ROW_NUMBER() OVER (ORDER BY o.dCreatedAt), '00000'),
    o.fTotal,
    1, -- Success
    o.dCreatedAt,
    o.dPaidAt
FROM tbl_Order o
WHERE o.sPaymentMethod IN ('VNPAY','MOMO','ZALOPAY')
    AND o.dCreatedAt >= '2026-04-01'
    AND o.dCreatedAt <  '2026-04-18';
GO

-- ============================================================
-- PHẦN 6: AUDIT LOG THÁNG 4
-- ============================================================

INSERT INTO tbl_AuditLog
    (TenantId, UserId, sAction, sEntityName, sEntityId, sOldValue, sNewValue, sIpAddress, dCreatedAt)
VALUES
    -- Login đầu tháng
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
        N'LOGIN_SUCCESS', 'tbl_User', '20000000-0000-0000-0000-000000000003',
        NULL, NULL, '14.162.131.5', '2026-04-01 07:58:00'),

    ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006',
        N'LOGIN_SUCCESS', 'tbl_User', '20000000-0000-0000-0000-000000000006',
        NULL, NULL, '113.190.87.22', '2026-04-01 08:01:00'),

    -- Điều chỉnh giá sản phẩm HN: Cappuccino tăng giá
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
        N'UPDATE_PRODUCT_PRICE', 'tbl_Product', '50000000-0000-0000-0002-000000000007',
        N'{"fPrice":50000}', N'{"fPrice":55000}',
        '14.162.131.5', '2026-04-02 09:15:00'),

    -- Thêm sản phẩm mới HCM: Cold Brew nâu đá (SP mùa hè)
    ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006',
        N'CREATE_PRODUCT', 'tbl_Product', '50000000-0000-0000-0003-000000000021',
        NULL, N'{"sProductName":"Cold Brew nâu đá","fPrice":65000}',
        '113.190.87.22', '2026-04-03 10:00:00'),

    -- Cảnh báo tồn kho thấp HN — sữa tươi
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
        N'LOW_STOCK_ALERT', 'tbl_Ingredient', '60000000-0000-0000-0002-000000000003',
        NULL, N'{"fStockQuantity":2800,"fAlertThreshold":3000}',
        '14.162.131.5', '2026-04-09 17:30:00'),

    -- Nhập kho xử lý sau cảnh báo
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008',
        N'IMPORT_STOCK', 'tbl_Ingredient', '60000000-0000-0000-0002-000000000003',
        N'{"fStockQuantity":2800}', N'{"fStockQuantity":17800}',
        '14.162.131.5', '2026-04-10 08:10:00'),

    -- Khóa tạm nhân viên nghỉ phép
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
        N'LOCK_USER', 'tbl_User', '20000000-0000-0000-0000-000000000005',
        N'{"iStatus":1}', N'{"iStatus":0}',
        '14.162.131.5', '2026-04-07 08:00:00'),

    -- Mở lại sau kỳ nghỉ
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003',
        N'UNLOCK_USER', 'tbl_User', '20000000-0000-0000-0000-000000000005',
        N'{"iStatus":0}', N'{"iStatus":1}',
        '14.162.131.5', '2026-04-14 07:55:00'),

    -- Login thất bại (brute force)
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
        N'LOGIN_FAILED', 'tbl_User', 'unknown',
        NULL, N'{"email":"test@hack.vn","attempts":3}',
        '27.72.54.100', '2026-04-11 02:47:00'),

    -- Admin HQ xem báo cáo tổng hợp
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
        N'VIEW_REPORT', 'vw_RevenueByTenantDate', NULL,
        NULL, N'{"filter":"2026-04-01 to 2026-04-15"}',
        '118.69.211.10', '2026-04-15 09:00:00'),

    -- Điều chỉnh tồn kho HCM (kiểm kê thực tế)
    ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006',
        N'ADJUST_STOCK', 'tbl_Ingredient', '60000000-0000-0000-0003-000000000001',
        N'{"fStockQuantity":4500}', N'{"fStockQuantity":4200}',
        '113.190.87.22', '2026-04-16 17:45:00');
GO
