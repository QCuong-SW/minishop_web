# MINISHOP - DỰ ÁN WEB THƯƠNG MẠI ĐIỆN TỬ VÀ QUẢN TRỊ HỆ THỐNG

Hệ thống thương mại điện tử toàn diện (E-Commerce Platform) phục vụ học phần Lập trình Web và Công nghệ Phần mềm. Dự án được thiết kế theo kiến trúc Monorepo hiện đại, phân tách rõ ràng giữa Frontend (Next.js 14), Backend (PHP 8.2 REST API OOP) và Cơ sở dữ liệu quan hệ (MySQL 8.0).

**Website:** [https://47-129-30-135.sslip.io](https://47-129-30-135.sslip.io)

---

## 1. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

### Frontend (Client-side)
- Framework: Next.js 14 (App Router Architecture), React 18
- Ngôn ngữ: TypeScript (Type-safe toàn diện)
- Styling: Tailwind CSS, CSS Grid, Flexbox, Custom Keyframes Animations
- Icons và UI Components: Lucide React, Sonner Toast
- Quản lý State và Context: React Context API (AuthContext, CartContext, WishlistContext)
- Triển khai (Deployment): Docker Container

### Backend (Server-side API)
- Ngôn ngữ và Môi trường: PHP 8.2 (CLI / Built-in Server)
- Kiến trúc: Thiết kế hướng đối tượng thuần (Pure OOP), Layered Architecture (Controller -> Service -> Repository)
- Chuẩn code: PSR-4 Autoloading, RESTful API Design Pattern
- Kết nối CSDL: PDO MySQL với Prepared Statements (Phòng chống SQL Injection 100%)
- Bảo mật và Xác thực: JWT (JSON Web Token), Bcrypt Password Hashing, CorsMiddleware
- Triển khai (Deployment): Render Web Service (Docker Container)

### Cơ sở dữ liệu (Database Layer)
- Hệ quản trị CSDL: MySQL 8.0 Community Server
- Storage Engine: InnoDB (Hỗ trợ ACID Transactions và Foreign Key Constraints)
- Script khởi tạo: schema.sql (Cấu trúc 8 bảng quan hệ), seed.sql (Dữ liệu mẫu chuẩn hóa)

### DevOps và Containerization
- Công cụ: Docker, Docker Compose
- Multi-stage Dockerfile cho cả Frontend và Backend
- Quản trị CSDL trực quan: phpMyAdmin Container (Port 8080)

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE)

```text
minishop_web/
|-- backend/                        # Mã nguồn PHP RESTful API
|   |-- config/                     # Cấu hình Database và Hệ thống
|   |   `-- database.php
|   |-- public/                     # Entry point của Backend
|   |   `-- index.php
|   |-- routes/                     # Định tuyến REST API
|   |   `-- api.php
|   |-- src/                        # Logic xử lý hướng đối tượng (OOP)
|   |   |-- Controllers/            # Tiếp nhận Request và trả về Response
|   |   |-- Services/               # Xử lý Business Logic, Validation, Transaction
|   |   |-- Repositories/           # Thao tác truy vấn SQL thuần qua PDO
|   |   `-- Shared/                 # Middleware (CORS, Auth), Database Singleton, Router
|   |-- composer.json
|   `-- Dockerfile                  # Container hóa Backend PHP
|
|-- frontend/                       # Mã nguồn Next.js 14 App Router
|   |-- src/
|   |   |-- app/                    # App Router Pages và Layouts
|   |   |   |-- (auth)/             # Phân hệ Đăng nhập và Đăng ký (login, register)
|   |   |   |-- (shop)/             # Phân hệ Khách hàng (products, cart, checkout, orders, wishlist, appointments)
|   |   |   |-- admin/              # Phân hệ Quản trị viên (dashboard, products, categories, orders, coupons, appointments, users)
|   |   |   |-- layout.tsx
|   |   |   `-- globals.css
|   |   |-- components/             # UI Components tái sử dụng
|   |   |   |-- auth/               # AdminGuard, AuthPageWrapper
|   |   |   |-- layout/             # Navbar, Footer, AdminHeader, AdminSidebar
|   |   |   `-- shared/             # ProductCard, QuickViewModal, ConfirmModal, Carousel
|   |   |-- context/                # AuthContext, CartContext, WishlistContext
|   |   |-- features/               # API clients và data services cho từng tính năng
|   |   |-- lib/                    # StorageService (Auto-healing LocalStorage), Mock Data, Utils
|   |   `-- types/                  # TypeScript Data Models và Interfaces
|   |-- package.json
|   |-- tailwind.config.ts
|   |-- next.config.mjs
|   `-- Dockerfile                  # Multi-stage production build cho Frontend
|
|-- database/
|   |-- schema.sql                  # DDL tạo 8 bảng, khóa chính, khóa ngoại và index
|   `-- seed.sql                    # DML nạp dữ liệu mẫu khởi tạo
|
|-- docker-compose.yml              # Định nghĩa fullstack 4 containers
|-- .env.example                    # Mẫu biến môi trường
`-- README.md                       # Tài liệu hướng dẫn dự án
```

---

## 3. CÁC TÍNH NĂNG CHÍNH CỦA HỆ THỐNG

### Phân hệ Khách hàng (Customer Storefront)
1. Trang chủ: Banner trình diễn sản phẩm, danh mục nổi bật, Flash Deals đếm ngược giờ, dải băng truyền giá trị vô tận (Infinite Marquee Conveyor Belt).
2. Danh mục và Tìm kiếm: Bộ lọc đa tiêu chí (theo danh mục, khoảng giá, sắp xếp giá tăng/giảm, đánh giá sao), tìm kiếm sản phẩm theo thời gian thực.
3. Chi tiết sản phẩm: Xem ảnh chất lượng cao, chọn số lượng/size/màu sắc, kiểm tra số lượng tồn kho trực tiếp, đánh giá và bình luận sản phẩm.
4. Xem nhanh (Quick View Modal): Xem chi tiết và thêm vào giỏ hàng tức thì không cần chuyển trang.
5. Giỏ hàng: Chọn lọc từng sản phẩm để thanh toán, tính tổng tiền tự động, cập nhật số lượng linh hoạt.
6. Thanh toán (Checkout): Kiểm tra tồn kho trước khi đặt hàng, áp dụng mã giảm giá (Coupon), hỗ trợ 3 hình thức thanh toán (COD, Chuyển khoản ngân hàng Mock Banking, Thẻ tín dụng Visa/Mastercard).
7. Quản lý đơn hàng: Theo dõi danh sách đơn hàng cá nhân, xem chi tiết từng đơn hàng, hủy đơn hàng khi ở trạng thái chờ xử lý, viết đánh giá sản phẩm.
8. Đặt lịch hẹn Showroom: Tính năng đặt lịch trải nghiệm thực tế, chọn khung giờ, số lượng khách và nhân viên tư vấn.
9. Danh sách yêu thích (Wishlist): Lưu và quản lý các sản phẩm quan tâm.
10. Xác thực: Giao diện Đăng nhập / Đăng ký dạng Split-Screen có animation trượt Carousel hai chiều đồng bộ.

### Phân hệ Quản trị viên (Admin Control Panel)
1. Tường lửa bảo vệ (AdminGuard): Chặn 100% truy cập trái phép từ User thường hoặc khách chưa đăng nhập (Trả về mã 403 Forbidden).
2. Tổng quan Dashboard:
   - Thống kê tổng doanh thu, tổng đơn hàng, số lượng sản phẩm, tổng người dùng.
   - Biểu đồ sóng doanh thu đa tầng (Interactive Spline Area Wave Chart) với gradient phát sáng, hover crosshair và chuyển đổi chế độ xem cột đơn hàng (Bar Chart).
   - Danh sách đơn hàng mới chờ duyệt nhanh.
   - Cảnh báo sản phẩm tồn kho thấp cần nhập hàng.
3. Quản lý Sản phẩm: Thêm mới, sửa, xóa (Soft delete), tìm kiếm, lọc theo danh mục, quản lý số lượng tồn kho và hình ảnh.
4. Quản lý Danh mục: Thêm, sửa, bật/tắt trạng thái hoạt động của danh mục.
5. Quản lý Đơn hàng: Xem chi tiết đơn hàng, cập nhật trạng thái đơn hàng theo quy trình (PENDING -> CONFIRMED -> PROCESSING -> SHIPPING -> DELIVERED / CANCELLED).
6. Quản lý Mã giảm giá (Coupons): Tạo mã giảm theo số tiền cố định (FIXED) hoặc phần trăm (PERCENT), quy định hạn mức sử dụng và thời gian hết hạn.
7. Quản lý Lịch hẹn Showroom: Tiếp nhận, xác nhận hoặc hủy lịch hẹn của khách hàng.
8. Quản lý Khách hàng và Quyền (RBAC): Quản lý danh sách tài khoản, cập nhật quyền ADMIN hoặc USER, khóa/mở khóa tài khoản.
9. Chế độ Xem Cửa hàng (Admin Preview): Cho phép Admin chuyển sang giao diện mua hàng để kiểm tra hệ thống dưới tư cách Khách vãng lai.

---

## 4. TÀI KHOẢN DEMO CÓ SẴN

Hệ thống đã khởi tạo sẵn 2 tài khoản mẫu:

| Vai trò | Tên hiển thị | Email đăng nhập | Mật khẩu | Phạm vi truy cập |
| :--- | :--- | :--- | :--- | :--- |
| Super Administrator | Quản Văn Lý | `admin@minishop.vn` | `password123` | Toàn quyền Quản trị hệ thống (`/admin/*`) |
| Customer User | Nguyễn Văn Khách | `user@minishop.vn` | `password123` | Giao diện Mua sắm và Đặt hàng (`/cart`, `/orders`...) |

*Ghi chú: Tại màn hình Đăng nhập đã tích hợp hai tài khoản gợi ý. Chọn vai trò Khách hàng hoặc Quản trị viên để đăng nhập nhanh trong các buổi báo cáo/demo.*

---

## 5. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY

### CI/CD production

GitHub Actions chạy lint, typecheck, unit test, database test, E2E và production
build cho mỗi pull request/push. Nhánh `dev` chỉ chạy CI; chỉ merge/push vào
`main` (hoặc chạy thủ công workflow trên `main`) mới được phép deploy EC2 sau
khi tất cả gate thành công. Workflow dùng các GitHub Actions secrets: `AWS_SSH_PRIVATE_KEY`,
`AWS_EC2_HOST`, `AWS_EC2_USER`, và `PROD_ENV_FILE`.

`PROD_ENV_FILE` phải là nội dung đầy đủ của `.env` production. Đặt
`NEXT_PUBLIC_API_URL=/api`, `APP_ENV=production`, `APP_URL` và `FRONTEND_URL`
theo domain HTTPS thật sự; không dùng các giá trị mẫu trong `.env.example`.
Deploy sẽ chờ đến 60 giây để `/` và `/api/products` sẵn sàng; nếu thất bại,
workflow in log của backend/frontend/proxy để dễ chẩn đoán.

Với domain `sslip.io`, đặt `DOMAIN=<public-ip>.sslip.io`, `APP_URL=https://<public-ip>.sslip.io`,
`FRONTEND_URL=https://<public-ip>.sslip.io` và `NEXT_PUBLIC_API_URL=/api` trong
`PROD_ENV_FILE`. Let's Encrypt cần xác thực qua port 80; mở cả TCP 80 và 443
trong AWS Security Group. Sau khi cấp phát lần đầu, renewal script là
`deploy/scripts/renew-certificates.sh`.

### Cách 1: Chạy trọn gói bằng Docker Compose (Khuyên dùng - 1 lệnh duy nhất)

Yêu cầu: Máy tính đã cài đặt Docker Desktop.

Mở Terminal tại thư mục gốc của dự án và chạy:
```bash
docker compose up -d --build
```

Sau khi khởi chạy thành công:
- Giao diện Cửa hàng: `http://localhost:4000`
- Giao diện Quản trị Admin: `http://localhost:4000/admin`
- Backend REST API: `http://localhost:8000/api`
- phpMyAdmin quản trị Database: `http://localhost:8080` (Tài khoản: `app` / Mật khẩu: `app`)

Để dừng hệ thống:
```bash
docker compose down
```

---

### Cách 2: Chạy thủ công từng phần trên máy cục bộ (Manual Run)

#### Bước 1: Khởi chạy MySQL Database
Khởi động container MySQL:
```bash
docker compose up -d mysql
```
CSDL sẽ tự động nạp file `database/schema.sql` và `database/seed.sql`.

#### Bước 2: Khởi chạy Backend PHP
```bash
cd backend
php -S 0.0.0.0:8000 -t public
```

#### Bước 3: Khởi chạy Frontend Next.js
Mở một cửa sổ Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:4000`

---

## 6. DANH SÁCH API ENDPOINTS CHÍNH (BACKEND REST API)

| Phương thức | Endpoint | Mô tả chức năng | Quyền yêu cầu |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Đăng nhập và nhận Token | Public |
| POST | `/api/auth/register` | Đăng ký tài khoản khách hàng mới | Public |
| GET | `/api/auth/me` | Lấy thông tin tài khoản hiện tại | Authenticated |
| GET | `/api/products` | Lấy danh sách sản phẩm (Hỗ trợ lọc, phân trang) | Public |
| GET | `/api/products/{id}` | Chi tiết sản phẩm theo ID hoặc Slug | Public |
| POST | `/api/products` | Thêm mới sản phẩm | ADMIN |
| PUT | `/api/products/{id}` | Cập nhật thông tin sản phẩm | ADMIN |
| DELETE | `/api/products/{id}` | Xóa sản phẩm | ADMIN |
| GET | `/api/categories` | Lấy danh sách danh mục | Public |
| POST | `/api/categories` | Tạo danh mục mới | ADMIN |
| GET | `/api/orders` | Danh sách đơn hàng | User / ADMIN |
| POST | `/api/orders` | Đặt hàng mới (Kèm Transaction kiểm tra tồn kho) | Authenticated |
| PUT | `/api/orders/{id}/status` | Cập nhật trạng thái đơn hàng | ADMIN |
| POST | `/api/coupons/validate` | Kiểm tra hợp lệ và tính số tiền giảm của Coupon | Authenticated |
| GET | `/api/appointments` | Danh sách lịch hẹn showroom | User / ADMIN |
| POST | `/api/appointments` | Đặt lịch hẹn showroom mới | Authenticated |
| GET | `/api/admin/dashboard` | Lấy số liệu thống kê doanh thu và đơn hàng | ADMIN |

---

## 7. QUY CHUẨN BẢO MẬT VÀ KIẾN TRÚC

- Role-Based Access Control (RBAC): Kiểm soát phân quyền chặt chẽ ở cả Frontend (`AdminGuard`) và Backend (`AuthMiddleware`).
- Data Sanitization và SQL Injection Protection: Toàn bộ câu lệnh truy vấn sử dụng PDO Parameter Binding.
- ACID Transaction Handling: Các nghiệp vụ tạo đơn hàng, trừ tồn kho, cộng số lượng đã bán đều được bao bọc trong Database Transaction `beginTransaction() -> commit() / rollBack()`.
- Stateless RESTful Design: Giao tiếp qua JSON, không lưu Session trên Server, dễ dàng scale lên Cloud.
