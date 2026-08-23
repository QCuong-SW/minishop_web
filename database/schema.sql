-- ============================================================================
-- 🛒 SHOPEE MINI — DATABASE SCHEMA (MySQL 8.0+)
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. BẢNG USERS (Tài khoản người dùng & Quản trị viên)
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL COMMENT 'Mã hoá bcrypt hoặc hash',
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `avatar_url` VARCHAR(500) NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `status` ENUM('ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. BẢNG CATEGORIES (Danh mục sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. BẢNG PRODUCTS (Sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE `products` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(280) NOT NULL,
    `description` LONGTEXT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `original_price` DECIMAL(12, 2) NULL COMMENT 'Giá gốc trước khi giảm để hiển thị % sale',
    `stock` INT UNSIGNED NOT NULL DEFAULT 0,
    `image_url` VARCHAR(500) NOT NULL COMMENT 'Ảnh đại diện chính',
    `rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 5.00 COMMENT 'Điểm đánh giá trung bình 1.00 - 5.00',
    `rating_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_products_slug` (`slug`),
    INDEX `idx_products_category_id` (`category_id`),
    INDEX `idx_products_status_price` (`status`, `price`),
    CONSTRAINT `fk_products_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. BẢNG PRODUCT_IMAGES (Bộ sưu tập ảnh phụ của sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE `product_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_product_images_product_id` (`product_id`),
    CONSTRAINT `fk_product_images_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BẢNG CART_ITEMS (Giỏ hàng của người dùng)
-- ----------------------------------------------------------------------------
CREATE TABLE `cart_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_cart_user_product` (`user_id`, `product_id`),
    CONSTRAINT `fk_cart_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_cart_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. BẢNG COUPONS (Mã giảm giá khuyến mãi)
-- ----------------------------------------------------------------------------
CREATE TABLE `coupons` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `discount_type` ENUM('FIXED', 'PERCENT') NOT NULL DEFAULT 'FIXED',
    `discount_value` DECIMAL(12, 2) NOT NULL COMMENT 'Số tiền giảm cố định hoặc số %',
    `min_order_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `max_discount` DECIMAL(12, 2) NULL COMMENT 'Giới hạn giảm tối đa nếu là type PERCENT',
    `expires_at` DATETIME NOT NULL,
    `usage_limit` INT UNSIGNED NOT NULL DEFAULT 100,
    `used_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'EXPIRED', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_coupons_code` (`code`),
    INDEX `idx_coupons_status_expires` (`status`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. BẢNG ORDERS (Đơn đặt hàng)
-- ----------------------------------------------------------------------------
CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(50) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `coupon_id` BIGINT UNSIGNED NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng tiền hàng trước giảm',
    `shipping_fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `final_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Số tiền cuối cùng khách phải trả',
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `payment_method` ENUM('COD', 'MOCK_BANKING') NOT NULL DEFAULT 'COD',
    `payment_status` ENUM('UNPAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
    `shipping_name` VARCHAR(100) NOT NULL,
    `shipping_phone` VARCHAR(20) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `note` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_orders_order_code` (`order_code`),
    INDEX `idx_orders_user_id` (`user_id`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_created_at` (`created_at`),
    CONSTRAINT `fk_orders_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_orders_coupon`
        FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. BẢNG ORDER_ITEMS (Chi tiết mặt hàng trong đơn — Snapshot)
-- ----------------------------------------------------------------------------
CREATE TABLE `order_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NULL COMMENT 'Để NULL nếu sản phẩm gốc sau này bị xoá',
    `product_name_snapshot` VARCHAR(255) NOT NULL,
    `product_image_snapshot` VARCHAR(500) NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_order_items_order_id` (`order_id`),
    CONSTRAINT `fk_order_items_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_order_items_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. BẢNG REVIEWS (Đánh giá & Nhận xét sản phẩm)
-- ----------------------------------------------------------------------------
CREATE TABLE `reviews` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `order_id` BIGINT UNSIGNED NULL COMMENT 'Liên kết đơn hàng để xác thực Đã mua hàng',
    `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_reviews_product_id` (`product_id`),
    INDEX `idx_reviews_user_id` (`user_id`),
    CONSTRAINT `fk_reviews_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. BẢNG WISHLISTS (Sản phẩm yêu thích)
-- ----------------------------------------------------------------------------
CREATE TABLE `wishlists` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_wishlist_user_product` (`user_id`, `product_id`),
    CONSTRAINT `fk_wishlist_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_wishlist_product`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. BẢNG APPOINTMENTS (Đặt lịch hẹn Showroom / Thử đồ / Tư vấn)
-- ----------------------------------------------------------------------------
CREATE TABLE `appointments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `appointment_date` DATE NOT NULL,
    `appointment_time` TIME NOT NULL,
    `service_type` VARCHAR(100) NOT NULL DEFAULT 'Tư vấn & Thử đồ tại showroom',
    `guest_count` INT UNSIGNED NOT NULL DEFAULT 1,
    `note` TEXT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_appointments_user_id` (`user_id`),
    INDEX `idx_appointments_date_status` (`appointment_date`, `status`),
    CONSTRAINT `fk_appointments_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
