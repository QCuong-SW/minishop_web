-- ============================================================================
-- 🛒 SHOPEE MINI — SAMPLE SEED DATA (MySQL 8.0+)
-- Mật khẩu mặc định của mọi tài khoản: 'password123'
-- Hash Bcrypt: $2y$10$wN9F4k1aB3rA2N4/jG1l6eG9F9YF1sD9L1H6z.q6J3R3P4X9G4hTe
-- ============================================================================

-- 1. USERS
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar_url`, `phone`, `address`, `status`) VALUES
(1, 'Quản Văn Lý', 'admin@minishop.vn', '$2y$10$wN9F4k1aB3rA2N4/jG1l6eG9F9YF1sD9L1H6z.q6J3R3P4X9G4hTe', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', '0901234567', 'Trụ sở chính MiniShop, Q.1, TP.HCM', 'ACTIVE'),
(2, 'Nguyễn Văn Khách', 'user@minishop.vn', '$2y$10$wN9F4k1aB3rA2N4/jG1l6eG9F9YF1sD9L1H6z.q6J3R3P4X9G4hTe', 'USER', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', '0987654321', '123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM', 'ACTIVE'),
(3, 'Trần Thị Thảo', 'thao.tran@example.com', '$2y$10$wN9F4k1aB3rA2N4/jG1l6eG9F9YF1sD9L1H6z.q6J3R3P4X9G4hTe', 'USER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', '0912345678', '456 Lê Văn Sỹ, Quận 3, TP.HCM', 'ACTIVE');

-- 2. CATEGORIES
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `status`) VALUES
(1, 'Thời Trang Nam', 'thoi-trang-nam', 'Áo thun, sơ mi, quần jean, áo khoác nam phong cách hiện đại', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500', 'ACTIVE'),
(2, 'Thời Trang Nữ', 'thoi-trang-nu', 'Váy đầm, áo kiểu, chân váy thanh lịch, bắt trend', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', 'ACTIVE'),
(3, 'Phụ Kiện & Giày Dép', 'phu-kien-giay-dep', 'Sneakers, túi xách, balo, mắt kính cao cấp', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'ACTIVE'),
(4, 'Đồ Công Nghệ & Decor', 'do-cong-nghe-decor', 'Tai nghe, bàn phím cơ, đồng hồ thông minh, đèn bàn decor', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'ACTIVE');

-- 3. PRODUCTS
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `original_price`, `stock`, `image_url`, `rating_avg`, `rating_count`, `status`) VALUES
(101, 1, 'Áo Thun Unisex Cotton Compact 100%', 'ao-thun-unisex-cotton-compact-100', 'Áo phông trơn chất liệu 100% cotton chải kỹ, thoáng khí và thấm hút mồ hôi cực tốt. Form regular fit thoải mái.', 149000.00, 199000.00, 150, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600', 4.90, 48, 'ACTIVE'),
(102, 1, 'Áo Sơ Mi Oxford Dài Tay Form Rộng', 'ao-so-mi-oxford-dai-tay-form-rong', 'Chất vải Oxford dày dặn đứng form, chống nhăn, phù hợp đi học lẫn đi làm công sở.', 289000.00, 350000.00, 80, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 4.75, 16, 'ACTIVE'),
(103, 1, 'Quần Jean Nam Ống Suông Vintage', 'quan-jean-nam-ong-suong-vintage', 'Quần bò denim cao cấp màu xanh retro, wash nhẹ cá tính, đường may kép chắc chắn.', 350000.00, 420000.00, 65, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', 4.80, 20, 'ACTIVE'),
(104, 2, 'Đầm Nữ Dáng Xòe Cổ Vuông Thanh Lịch', 'dam-nu-dang-xoe-co-vuong-thanh-lich', 'Chất liệu lụa satin mềm mịn, thiết kế chiết eo tôn dáng, phù hợp dự tiệc và dạo phố.', 399000.00, 499000.00, 40, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', 5.00, 12, 'ACTIVE'),
(105, 2, 'Áo Cardigan Len Mềm Nữ Style Hàn Quốc', 'ao-cardigan-len-mem-nu-style-han-quoc', 'Áo khoác len mỏng dệt kim, cúc áo ngọc trai tinh tế, phối đồ mùa thu đông cực xinh.', 249000.00, 320000.00, 90, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', 4.85, 30, 'ACTIVE'),
(106, 3, 'Giày Sneaker Trắng Đế Cao Su Kháng Khuẩn', 'giay-sneaker-trang-de-cao-su-khang-khuan', 'Sneaker phong cách basic dễ phối đồ, lót giày memory foam êm chân, chống trơn trượt.', 480000.00, 590000.00, 45, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600', 4.90, 62, 'ACTIVE'),
(107, 3, 'Balo Canvas Chống Nước Ngăn Laptop 15.6 inch', 'balo-canvas-chong-nuoc-ngan-laptop', 'Chất liệu vải Oxford chống thấm, quai đeo đệm thoáng khí, nhiều ngăn tiện lợi.', 320000.00, 390000.00, 110, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 4.70, 25, 'ACTIVE'),
(108, 4, 'Tai Nghe Chụp Tai Bluetooth Chống Ồn ANC', 'tai-nghe-chup-tai-bluetooth-chong-on-anc', 'Âm bass mạnh mẽ, pin trâu liên tục 40 giờ, đệm tai da êm ái không đau tai.', 790000.00, 990000.00, 30, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 4.95, 84, 'ACTIVE'),
(109, 4, 'Bàn Phím Cơ Không Dây 3 Mode RGB', 'ban-phim-co-khong-day-3-mode-rgb', 'Layout 75% gọn gàng, switch hot-swap êm ái, kết nối Bluetooth / 2.4Ghz / Type-C.', 650000.00, 850000.00, 25, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 4.88, 33, 'ACTIVE'),
(110, 4, 'Đèn Bàn Hoàng Hôn Sunset Lamp Decor', 'den-ban-hoang-hon-sunset-lamp-decor', 'Đèn chiếu ánh sáng hoàng hôn 16 màu kèm điều khiển từ xa, sống ảo và trang trí phòng ngủ cực chill.', 129000.00, 180000.00, 200, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 4.65, 41, 'ACTIVE');

-- 4. COUPONS
INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount`, `expires_at`, `usage_limit`, `used_count`, `status`) VALUES
(1, 'WELCOME50K', 'Giảm ngay 50k cho khách hàng mới với đơn từ 300k', 'FIXED', 50000.00, 300000.00, NULL, '2026-12-31 23:59:59', 500, 1, 'ACTIVE'),
(2, 'FREESHIP', 'Miễn phí vận chuyển (Tối đa 30k) cho đơn từ 200k', 'FIXED', 30000.00, 200000.00, NULL, '2026-12-31 23:59:59', 1000, 0, 'ACTIVE'),
(3, 'SALE10', 'Giảm 10% tổng giá trị đơn hàng (Tối đa 100k)', 'PERCENT', 10.00, 150000.00, 100000.00, '2026-12-31 23:59:59', 200, 0, 'ACTIVE');

-- 5. SAMPLE ORDERS & ORDER_ITEMS
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `coupon_id`, `total_amount`, `shipping_fee`, `discount_amount`, `final_amount`, `status`, `payment_method`, `payment_status`, `shipping_name`, `shipping_phone`, `shipping_address`, `note`, `created_at`) VALUES
(5001, 'ORD-20260820-5001', 2, 1, 499000.00, 30000.00, 50000.00, 479000.00, 'DELIVERED', 'MOCK_BANKING', 'PAID', 'Nguyễn Văn Khách', '0987654321', '123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM', 'Giao giờ hành chính', '2026-08-20 10:15:00');

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name_snapshot`, `product_image_snapshot`, `unit_price`, `quantity`, `subtotal`, `created_at`) VALUES
(1, 5001, 101, 'Áo Thun Unisex Cotton Compact 100%', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600', 149000.00, 1, 149000.00, '2026-08-20 10:15:00'),
(2, 5001, 103, 'Quần Jean Nam Ống Suông Vintage', 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600', 350000.00, 1, 350000.00, '2026-08-20 10:15:00');

-- 6. REVIEWS
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `order_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 101, 5001, 5, 'Chất vải thun rất mát, đường may chuẩn chỉ. Sẽ ủng hộ shop tiếp!', '2026-08-20 16:30:00'),
(2, 2, 103, 5001, 5, 'Quần mặc vừa vặn, form suông hack dáng tốt!', '2026-08-20 16:32:00');

-- 7. WISHLISTS
INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 2, 108, '2026-08-21 08:00:00'),
(2, 2, 109, '2026-08-21 08:05:00');

-- 8. APPOINTMENTS (Lịch hẹn Showroom)
INSERT INTO `appointments` (`id`, `user_id`, `appointment_date`, `appointment_time`, `service_type`, `guest_count`, `note`, `status`, `created_at`) VALUES
(1, 2, '2026-08-25', '14:30:00', 'Tư vấn & Thử đồ tại showroom', 2, 'Cần tư vấn chọn trang phục chụp ảnh kỷ yếu', 'CONFIRMED', '2026-08-21 11:20:00'),
(2, 3, '2026-08-26', '10:00:00', 'Trải nghiệm bàn phím cơ & gear công nghệ', 1, 'Muốn gõ thử trực tiếp các loại switch', 'PENDING', '2026-08-21 15:45:00');
