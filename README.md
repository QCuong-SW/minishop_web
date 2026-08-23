# 🛒 Shopee Mini — Web Programming Project

Dự án website thương mại điện tử "Shopee Mini" cho môn học Lập trình Web.

## 🛠️ Techstack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Sonner Toast.
- **Backend:** PHP REST API (OOP, Layered Architecture: Controller -> Service -> Repository).
- **Database:** MySQL 8.0 (Docker Container).

## 🚀 Hướng dẫn khởi chạy nhanh

### 1. Khởi động MySQL Database (Docker)
```bash
docker compose up -d
```
> Database `shopee_mini` sẽ tự động khởi tạo các bảng từ `database/schema.sql` và nạp dữ liệu mẫu từ `database/seed.sql`.

### 2. Khởi chạy Backend PHP API
```bash
cd backend
php -S localhost:8000 -t public
```

### 3. Khởi chạy Frontend Next.js
```bash
cd frontend
npm install
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

## 🔑 Tài khoản Demo có sẵn
- **Admin:** `admin@shopee.com` / `password123`
- **Khách hàng:** `user@shopee.com` / `password123`
