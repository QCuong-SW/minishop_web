# MINISHOP — DU AN WEB THUONG MAI DIEN TU VA QUAN TRI HE THONG

He thong thuong mai dien tu toan dien (E-Commerce Platform) phuc vu hoc phan Lap trinh Web va Cong nghe Phan mem. Du an duoc thiet ke theo kien truc Monorepo hien dai, phan tach ro rang giua Frontend (Next.js 14), Backend (PHP 8.2 REST API OOP) va Co so du lieu quan he (MySQL 8.0).

---

## 1. CONG NGHE SU DUNG (TECH STACK)

### Frontend (Client-side)
- Framework: Next.js 14 (App Router Architecture), React 18
- Ngon ngu: TypeScript (Type-safe toan dien)
- Styling: Tailwind CSS, CSS Grid, Flexbox, Custom Keyframes Animations
- Icons va UI Components: Lucide React, Sonner Toast
- Quan ly State va Context: React Context API (AuthContext, CartContext, WishlistContext)
- Trien khai (Deployment): Vercel CI/CD

### Backend (Server-side API)
- Ngon ngu va Moi truong: PHP 8.2 (CLI / Built-in Server)
- Kien truc: Thiet ke huong doi tuong thuan (Pure OOP), Layered Architecture (Controller -> Service -> Repository)
- Chuan code: PSR-4 Autoloading, RESTful API Design Pattern
- Ket noi CSDL: PDO MySQL voi Prepared Statements (Phong chong SQL Injection 100%)
- Bao mat va Xac thuc: JWT (JSON Web Token), Bcrypt Password Hashing, CorsMiddleware
- Trien khai (Deployment): Render Web Service (Docker Container)

### Co so du lieu (Database Layer)
- He quan tri CSDL: MySQL 8.0 Community Server
- Storage Engine: InnoDB (Ho tro ACID Transactions va Foreign Key Constraints)
- Script khoi tao: schema.sql (Cau truc 8 bang quan he), seed.sql (Du lieu mau chuan hoa)

### DevOps va Containerization
- Cong cu: Docker, Docker Compose
- Multi-stage Dockerfile cho ca Frontend va Backend
- Quan tri CSDL truc quan: phpMyAdmin Container (Port 8080)

---

## 2. CAU TRUC THU MUC DU AN (PROJECT STRUCTURE)

```text
minishop_web/
|-- backend/                        # Ma nguon PHP RESTful API
|   |-- config/                     # Cau hinh Database va He thong
|   |   `-- database.php
|   |-- public/                     # Entry point cua Backend
|   |   `-- index.php
|   |-- routes/                     # Dinh tuyen REST API
|   |   `-- api.php
|   |-- src/                        # Logic xu ly huong doi tuong (OOP)
|   |   |-- Controllers/            # Tiep nhan Request va tra ve Response
|   |   |-- Services/               # Xu ly Business Logic, Validation, Transaction
|   |   |-- Repositories/           # Thao tac truy van SQL thuan qua PDO
|   |   `-- Shared/                 # Middleware (CORS, Auth), Database Singleton, Router
|   |-- composer.json
|   `-- Dockerfile                  # Container hoa Backend PHP
|
|-- frontend/                       # Ma nguon Next.js 14 App Router
|   |-- src/
|   |   |-- app/                    # App Router Pages va Layouts
|   |   |   |-- (auth)/             # Phan he Dang nhap & Dang ky (login, register)
|   |   |   |-- (shop)/             # Phan he Khach hang (products, cart, checkout, orders, wishlist, appointments)
|   |   |   |-- admin/              # Phan he Quan tri vien (dashboard, products, categories, orders, coupons, appointments, users)
|   |   |   |-- layout.tsx
|   |   |   `-- globals.css
|   |   |-- components/             # UI Components tai su dung
|   |   |   |-- auth/               # AdminGuard, AuthPageWrapper
|   |   |   |-- layout/             # Navbar, Footer, AdminHeader, AdminSidebar
|   |   |   `-- shared/             # ProductCard, QuickViewModal, ConfirmModal, Carousel
|   |   |-- context/                # AuthContext, CartContext, WishlistContext
|   |   |-- features/               # API clients va data services cho tung tinh nang
|   |   |-- lib/                    # StorageService (Auto-healing LocalStorage), Mock Data, Utils
|   |   `-- types/                  # TypeScript Data Models & Interfaces
|   |-- package.json
|   |-- tailwind.config.ts
|   |-- next.config.mjs
|   |-- vercel.json
|   `-- Dockerfile                  # Multi-stage production build cho Frontend
|
|-- database/
|   |-- schema.sql                  # DDL tao 8 bang, khoa chinh, khoa ngoai va index
|   `-- seed.sql                    # DML nạp du lieu mau khoi tao
|
|-- docker-compose.yml              # Dinh nghia fullstack 4 containers
|-- .env.example                    # Mau bien moi truong
`-- README.md                       # Tai lieu huong dan du an
```

---

## 3. CAC TINH NANG CHINH CUA HE THONG

### Phan He Khach Hang (Customer Storefront)
1. Trang chu: Banner trinh dien san pham, danh muc noi bat, Flash Deals dem nguoc gio, dai bang truyen gia tri vo tan (Infinite Marquee Conveyor Belt).
2. Danh muc & Tim kiem: Bo loc da tieu chi (theo danh muc, khoang gia, sap xep gia tang/giam, danh gia sao), tim kiem san pham theo thoi gian thuc.
3. Chi tiet san pham: Xem anh chat luong cao, chon so luong/size/mau sac, kiem tra so luong ton kho truc tiep, danh gia & binh luan san pham.
4. Xem nhanh (Quick View Modal): Xem chi tiet va them vao gio hang tuc thi khong can chuyen trang.
5. Gio hang: Chon chon loc tung san pham de thanh toan, tinh tong tien tu dong, cap nhat so luong linh hoat.
6. Thanh toan (Checkout): Kiem tra ton kho truoc khi dat hang, ap dung ma giam gia (Coupon), ho tro 3 hinh thuc thanh toan (COD, Chuyen khoan ngan hang Mock Banking, The tin dung Visa/Mastercard).
7. Quan ly don hang: Theo doi danh sach don hang ca nhan, xem chi tiet tung don hang, huy don hang khi o trang thai cho xu ly, viet danh gia san pham.
8. Dat lich hen Showroom: Tinh nang dat lich trai nghiem thuc te, chon khung gio, so luong khach va nhan vien tu van.
9. Danh sach yeu thich (Wishlist): Luu va quan ly cac san pham quan tam.
10. Xac thuc: Giao dien Dang nhap / Dang ky dang Split-Screen co animation truot Carousel hai chieu dong bo.

### Phan He Quan Tri Vien (Admin Control Panel)
1. Tuong lua bao ve (AdminGuard): Chan 100% truy cap trai phep tu User thuong hoac khach chua dang nhap (Tra ve ma 403 Forbidden).
2. Tong quan Dashboard:
   - Thong ke tong doanh thu, tong don hang, so luong san pham, tong nguoi dung.
   - Bieu do song doanh thu da tang (Interactive Spline Area Wave Chart) voi gradient phat sang, hover crosshair va chuyen doi che do xem cot don hang (Bar Chart).
   - Danh sach don hang moi cho duyet nhanh.
   - Canh bao san pham ton kho thap can nhap hang.
3. Quan ly San pham: Them moi, sua, xoa (Soft delete), tim kiem, loc theo danh muc, quan ly so luong ton kho va hinh anh.
4. Quan ly Danh muc: Them, sua, bat/tat trang thai hoat dong cua danh muc.
5. Quan ly Don hang: Xem chi tiet don hang, cap nhat trang thai don hang theo quy trinh (PENDING -> CONFIRMED -> PROCESSING -> SHIPPING -> DELIVERED / CANCELLED).
6. Quan ly Ma giam gia (Coupons): Tao ma giam theo so tien co dinh (FIXED) hoac phan tram (PERCENT), quy dinh han muc su dung va thoi gian het han.
7. Quan ly Lich hen Showroom: Tiep nhan, xac nhan hoac huy lich hen cua khach hang.
8. Quan ly Khach hang & Quyen (RBAC): Quan ly danh sach tai khoan, cap nhat quyen ADMIN hoac USER, khoa/mo khoa tai khoan.
9. Che do Xem Cua Hang (Admin Preview): Cho phep Admin chuyen sang giao dien mua hang de kiem tra he thong duoi tu cach Khach vang lai.

---

## 4. TAI KHOAN DEMO CO SAN

He thong da khoi tao san 2 tai khoan mau:

| Vai tro | Ten hien thi | Email dang nhap | Mat khau | Pham vi truy cap |
| :--- | :--- | :--- | :--- | :--- |
| Super Administrator | Quan Van Ly | `admin@minishop.vn` | `admin123` | Toan quyen Quan tri he thong (/admin/*) |
| Customer User | Nguyen Van Khach | `user@minishop.vn` | `123456` | Giao dien Mua sam & Dat hang (/cart, /orders...) |

*Ghi chu: Tai man hinh Dang nhap da tich hop nut bam "1-Click User" va "1-Click Admin" de thao tac nhanh trong cac buoi bao cao/demo.*

---

## 5. HUONG DAN CAI DAT VA KHOI CHAY

### Cach 1: Chay Tron Goi Bang Docker Compose (Khuyen dung - 1 lenh duy nhat)

Yeu cau: May tinh da cai dat Docker Desktop.

Mo Terminal tai thu muc goc cua du an va chay:
```bash
docker compose up -d --build
```

Sau khi khoi chay thanh cong:
- Giao dien Cua hang: `http://localhost:4000`
- Giao dien Quan tri Admin: `http://localhost:4000/admin`
- Backend REST API: `http://localhost:8000/api`
- phpMyAdmin quan tri Database: `http://localhost:8080` (Tai khoan: `app` / Mat khau: `app`)

De dung he thong:
```bash
docker compose down
```

---

### Cach 2: Chay Thu Cong Tung Phan Tren May Cuc Bo (Manual Run)

#### Buoc 1: Khoi chay MySQL Database
Khoi dong container MySQL:
```bash
docker compose up -d mysql
```
CSDL se tu dong nạp file `database/schema.sql` va `database/seed.sql`.

#### Buoc 2: Khoi chay Backend PHP
```bash
cd backend
php -S 0.0.0.0:8000 -t public
```

#### Buoc 3: Khoi chay Frontend Next.js
Mo mot cua so Terminal moi:
```bash
cd frontend
npm install
npm run dev
```
Truy cap trinh duyet tai dia chi: `http://localhost:4000`

---

## 6. DANH SACH API ENDPOINTS CHINH (BACKEND REST API)

| Phuong thuc | Endpoint | Mo ta chuc nang | Quyen yeu cau |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Dang nhap va nhan Token | Public |
| POST | `/api/auth/register` | Dang ky tai khoan khach hang moi | Public |
| GET | `/api/auth/me` | Lay thong tin tai khoan hien tai | Authenticated |
| GET | `/api/products` | Lay danh sach san pham (Ho tro loc, phan trang) | Public |
| GET | `/api/products/{id}` | Chi tiet san pham theo ID hoac Slug | Public |
| POST | `/api/products` | Them moi san pham | ADMIN |
| PUT | `/api/products/{id}` | Cap nhat thong tin san pham | ADMIN |
| DELETE | `/api/products/{id}` | Xoa san pham | ADMIN |
| GET | `/api/categories` | Lay danh sach danh muc | Public |
| POST | `/api/categories` | Tao danh muc moi | ADMIN |
| GET | `/api/orders` | Danh sach don hang | User / ADMIN |
| POST | `/api/orders` | Dat hang moi (Kem Transaction kiem tra ton kho) | Authenticated |
| PUT | `/api/orders/{id}/status` | Cap nhat trang thai don hang | ADMIN |
| POST | `/api/coupons/validate` | Kiem tra hop le va tinh so tien giam cua Coupon | Authenticated |
| GET | `/api/appointments` | Danh sach lich hen showroom | User / ADMIN |
| POST | `/api/appointments` | Dat lich hen showroom moi | Authenticated |
| GET | `/api/admin/dashboard` | Lay so lieu thong ke doanh thu va don hang | ADMIN |

---

## 7. QUY CHUAN BAO MAT VA KIEN TRUC

- Role-Based Access Control (RBAC): Kiem soat phan quyen chat che o ca Frontend (`AdminGuard`) va Backend (`AuthMiddleware`).
- Data Sanitization & SQL Injection Protection: Toan bo cau lenh truy van su dung PDO Parameter Binding.
- ACID Transaction Handling: Cac nghiep vu tao don hang, tru ton kho, cong so luong da ban deu duoc bao boc trong Database Transaction `beginTransaction() -> commit() / rollBack()`.
- Stateless RESTful Design: Giao tiep qua JSON, khong luu Session tren Server, de dang scale len Cloud.
