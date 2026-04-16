# ☕ Hệ Thống Quản Lý Chuỗi Cà Phê Trung Nguyên (Trung Nguyen Cafe Chain Management)

> Một hệ thống quản lý toàn diện (Full-stack) dành cho chuỗi không gian cà phê Trung Nguyên Legend và E-Coffee, hỗ trợ mô hình đa chi nhánh (Multi-tenant), nhượng quyền (Franchise) và các nghiệp vụ đặc thù của ngành F&B như POS, quản lý kho, công thức pha chế, và điểm thưởng khách hàng.

---

## 📑 Mục lục
- [☕ Hệ Thống Quản Lý Chuỗi Cà Phê Trung Nguyên (Trung Nguyen Cafe Chain Management)](#-hệ-thống-quản-lý-chuỗi-cà-phê-trung-nguyên-trung-nguyen-cafe-chain-management)
  - [📑 Mục lục](#-mục-lục)
  - [🌟 Giới thiệu chung](#-giới-thiệu-chung)
  - [🚀 Các tính năng nổi bật (Key Features)](#-các-tính-năng-nổi-bật-key-features)
  - [💻 Công nghệ sử dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
  - [📁 Cấu trúc thư mục (Project Structure)](#-cấu-trúc-thư-mục-project-structure)
  - [🗄️ Cấu trúc CSDL (Database Architecture)](#️-cấu-trúc-csdl-database-architecture)
  - [⚙️ Hướng dẫn cài đặt và chạy dự án (Installation)](#️-hướng-dẫn-cài-đặt-và-chạy-dự-án-installation)
    - [1. Cài đặt Database](#1-cài-đặt-database)
    - [2. Chạy Backend (ASP.NET Core)](#2-chạy-backend-aspnet-core)
    - [3. Chạy Frontend (ReactJS)](#3-chạy-frontend-reactjs)
  - [🔐 Phân quyền Hệ thống (Roles)](#-phân-quyền-hệ-thống-roles)
  - [💳 Tích hợp Thanh toán (Payment Integrations)](#-tích-hợp-thanh-toán-payment-integrations)
  - [📄 Nhóm phát triển](#-nhóm-phát-triển)

---

## 🌟 Giới thiệu chung
Dự án được xây dựng với mục tiêu số hóa và tối ưu hóa quy trình quản lý cho thương hiệu **Trung Nguyên Legend** và **E-Coffee**. Hệ thống giải quyết các bài toán phức tạp của một chuỗi F&B lớn bao gồm: Quản lý tập trung từ hội sở (HQ), quản trị chi nhánh nhượng quyền, kiểm soát định mức nguyên liệu tự động, và quản lý hội viên thống nhất trên toàn chuỗi.

Dự án triển khai kiến trúc Server-Client tách biệt, kết nối qua RESTful API, đảm bảo khả năng mở rộng và bảo trì dễ dàng.

---

## 🚀 Các tính năng nổi bật (Key Features)

1. **Multi-Tenant Architecture (Đa Chi Nhánh)**
   - Quản lý đồng thời dữ liệu của Trụ sở (HQ), Cửa hàng tự doanh (Company-owned), và Các cửa hàng Nhượng quyền (Franchise).
   - Đảm bảo dữ liệu chi nhánh độc lập nhưng HQ vẫn có thể xem được báo cáo tổng thể.
2. **Nghiệp vụ Bán hàng (POS - Point of Sale)**
   - Quy trình đặt hàng, thanh toán nhanh chóng.
   - Cập nhật trạng thái đơn trực tiếp (Pending ➔ Paid ➔ Preparing ➔ Ready).
3. **Quản lý Kho & Định mức nguyên liệu (Inventory & Recipes)**
   - Thiết lập công thức pha chế (Recipes - ví dụ: 1 Cà Phê Sữa = 18g Cafe + 30g Sữa + 200g Đá).
   - Hệ thống **tự động trừ kho (Auto-deduct)** nguyên liệu ngay khi đơn hàng hoàn tất.
   - Lịch sử biến động kho (Nhập/Xuất/Điều chỉnh).
4. **Quản lý Khách hàng thân thiết (Loyalty & CRM)**
   - Tích điểm hóa đơn, thăng hạng hội viên (Bronze, Silver, Gold, Platinum).
   - Thanh toán và quy đổi bằng điểm thưởng.
5. **Thanh toán Số (Digital Payments)**
   - Tích hợp cổng thanh toán: MoMo, ZaloPay, VNPay.
6. **Bảo mật & Theo dõi (Security & Audit Log)**
   - Phân quyền (RBAC) chi tiết với 7 vai trò khác nhau.
   - Ghi log mọi hành động (Audit Log) của người dùng để truy vết hệ thống.

---

## 💻 Công nghệ sử dụng (Tech Stack)

* **Frontend:**
  * ReactJS (TypeScript / JavaScript)
  * CSS framework (Tailwind CSS / Bootstrap)
  * Quản lý trạng thái: Redux Toolkit hoặc React Context
  * Axios để fetch data.
* **Backend:**
  * ASP.NET Core Web API (.NET)
  * Entity Framework Core (ORM)
  * JWT Authentication & BCrypt hashing.
* **Database:**
  * Microsoft SQL Server (T-SQL)

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
TrungNguyenCafe/
│
├── backend/               # Mã nguồn C# ASP.NET Core Web API
│   ├── Controllers/       # Xử lý các request HTTP (API Endpoints)
│   ├── Models/            # Lớp thực thể (Entities/Models) tương ứng với Database
│   ├── DTOs/              # Data Transfer Objects
│   ├── Services/          # Lớp Xử lý Business Logic
│   ├── backend.sln        # Solution của dự án
│   └── appsettings.json   # Cấu hình chuỗi kết nối DB (Connection string)
│
├── fontend/               # Mã nguồn ReactJS
│   ├── src/
│   │   ├── components/    # Components UI dùng chung
│   │   ├── pages/         # Các màn hình chính (POS, Inventory, Dashboard,...)
│   │   ├── services/      # Chứa các file gọi API tới Backend
│   │   └── App.tsx        # Entry point của Frontend
│   └── package.json       # Danh sách dependencies
│
└── database/              # Chứa kịch bản Cơ sở dữ liệu
    └── Database_CNPM.sql  # Script tạo Schema, Roles, Seed data (Tranh Nguyên, E-Coffee, Customers...)
```

---

## 🗄️ Cấu trúc CSDL (Database Architecture)

Hệ thống được thiết kế chặt chẽ với các thực thể (tables) cốt lõi sau:
- `tbl_Tenant`: Quản lý các chi nhánh/cửa hàng.
- `tbl_User` & `tbl_Role`: Người dùng và phân quyền (ứng dụng Role-Based Access Control).
- `tbl_Customer` & `tbl_LoyaltyHistory`: Hội viên và Lịch sử tích/đổi điểm.
- `tbl_Category` & `tbl_Product`: Danh mục và Sản phẩm bán ra.
- `tbl_Ingredient` & `tbl_Recipe`: Nguyên liệu kho và Định lượng pha chế (BOM).
- `tbl_Order` & `tbl_OrderItem`: Xử lý đơn đặt hàng và chi tiết.
- `tbl_StockHistory`: Ghi nhận biến động hàng hóa trong kho.
- `tbl_PaymentTransaction`: Quản lý log thanh toán qua Cổng.
- `tbl_AuditLog`: Nhật ký hoạt động nhằm mục đích đối soát an ninh.

*(Bạn có thể xem chi tiết ở file `database/Database_CNPM.sql` với hơn 1000 lines bao gồm toàn bộ Constraint và dữ liệu mẫu).*

---

## ⚙️ Hướng dẫn cài đặt và chạy dự án (Installation)

### 1. Cài đặt Database
1. Mở SQL Server Management Studio (SSMS) hoặc Azure Data Studio.
2. Mở file `database/Database_CNPM.sql`.
3. Chạy toàn bộ file script (Execute). 
   *Script tự động tạo DB `TrungNguyenCafeChain`, cấp phát cấu trúc bảng và seeding dữ liệu cho 8 chi nhánh, cùng hàng trăm sản phẩm/đơn hàng mẫu.*

### 2. Chạy Backend (ASP.NET Core)
1. Mở thư mục `backend/` bằng Visual Studio hoặc Rider.
2. Mở file `appsettings.json`, cập nhật `DefaultConnection` phù hợp với thông tin kết nối SQL Server của bạn.
3. Chạy lệnh:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
4. Backend sẽ chạy ở (ví dụ): `https://localhost:7001` (Kèm theo giao diện Swagger UI để test API).

### 3. Chạy Frontend (ReactJS)
1. Mở Terminal / Command Prompt truy cập vào thư mục `fontend/` (⚠️ *Lưu ý tên thư mục hiện đang là `fontend`*).
2. Cài đặt thư viện:
   ```bash
   npm install
   # hoặc
   yarn install
   ```
3. Cấu hình biến môi trường (`.env` nếu có) trỏ Base URL về Backend `https://localhost:7001/api`.
4. Chạy ứng dụng:
   ```bash
   npm start
   # hoặc
   npm run dev
   ```

---

## 🔐 Phân quyền Hệ thống (Roles)

Hệ thống cung cấp sẵn các trải nghiệm Role cụ thể (Password mặc định: `Password@123`):
1. **SYSTEM_ADMIN** (`admin@trungnguyen.com.vn`): Quản trị toàn hệ thống.
2. **CHAIN_MANAGER** (`chainmgr@trungnguyen.com.vn`): Xem tổng thể kinh doanh của mọi chi nhánh.
3. **FRANCHISE_OWNER** (`owner.dn@ecoffee.vn`): Chủ thương hiệu nhượng quyền.
4. **STORE_MANAGER** (`manager.hn@trungnguyen.com.vn`): Quản lý chi nhánh cụ thể.
5. **STAFF_POS**: Thu ngân (lên đơn đặt hàng, thanh toán).
6. **BARISTA**: Nhân viên pha chế (tiếp nhận đơn hàng, hoàn tất món).
7. **WAREHOUSE**: Thủ kho (Nhập hàng, kiểm kê nguyên liệu).

---

## 💳 Tích hợp Thanh toán (Payment Integrations)
Mặc dù hệ thống hỗ trợ thanh toán `CASH` làm mặc định, cơ sở dữ liệu đã chuẩn bị cho các giao dịch Gateway bao gồm:
- **MOMO**
- **ZALOPAY**
- **VNPAY**

*Chi tiết logs giao dịch phản hồi sẽ được lưu tại `tbl_PaymentTransaction`.*
