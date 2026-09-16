SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

DELIMITER //
CREATE PROCEDURE assert_true(IN condition_value BOOLEAN, IN failure_message VARCHAR(255))
BEGIN
    IF condition_value IS NULL OR condition_value = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = failure_message;
    END IF;
END//
DELIMITER ;

CALL assert_true((SELECT COUNT(*) >= 11 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()), 'Schema must contain at least 11 tables');
CALL assert_true((SELECT COUNT(*) >= 14 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_TYPE = 'FOREIGN KEY'), 'Unexpected foreign-key count');
CALL assert_true((SELECT COUNT(*) >= 14 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_TYPE = 'CHECK'), 'Required CHECK constraints are missing');

CREATE TEMPORARY TABLE fk_cycles AS
WITH RECURSIVE fk_edges AS (
    SELECT DISTINCT TABLE_NAME AS child_table, REFERENCED_TABLE_NAME AS parent_table
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL
), paths AS (
    SELECT child_table AS start_table,
           parent_table AS current_table,
           CAST(CONCAT(child_table, ',', parent_table) AS CHAR(1000)) AS path,
           child_table = parent_table AS is_cycle
    FROM fk_edges
    UNION ALL
    SELECT paths.start_table,
           fk_edges.parent_table,
           CONCAT(paths.path, ',', fk_edges.parent_table),
           FIND_IN_SET(fk_edges.parent_table, paths.path) > 0
    FROM paths
    JOIN fk_edges ON fk_edges.child_table = paths.current_table
    WHERE paths.is_cycle = FALSE
)
SELECT path FROM paths WHERE is_cycle = TRUE;

CALL assert_true((SELECT COUNT(*) = 0 FROM fk_cycles), 'Foreign-key dependency cycle detected');

CALL assert_true((SELECT COUNT(*) = 4 FROM users), 'Unexpected users seed count');
CALL assert_true((SELECT COUNT(*) = 5 FROM categories), 'Unexpected categories seed count');
CALL assert_true((SELECT COUNT(*) = 12 FROM products), 'Unexpected products seed count');
CALL assert_true((SELECT COUNT(*) = 4 FROM product_images), 'Unexpected product images seed count');
CALL assert_true((SELECT COUNT(*) = 5 FROM coupons), 'Unexpected coupons seed count');
CALL assert_true((SELECT COUNT(*) = 7 FROM orders), 'Unexpected orders seed count');
CALL assert_true((SELECT COUNT(*) = 9 FROM order_items), 'Unexpected order items seed count');
CALL assert_true((SELECT COUNT(*) = 6 FROM reviews), 'Unexpected reviews seed count');
CALL assert_true((SELECT COUNT(*) = 3 FROM wishlists), 'Unexpected wishlists seed count');
CALL assert_true((SELECT COUNT(*) = 1 FROM cart_items), 'Unexpected cart seed count');
CALL assert_true((SELECT COUNT(*) = 3 FROM appointments), 'Unexpected appointments seed count');

CALL assert_true((SELECT name = 'Thời Trang Nữ' FROM categories WHERE id = 2), 'UTF-8 Vietnamese seed data is corrupted');
CALL assert_true((SELECT COUNT(*) = 1 FROM users WHERE role = 'ADMIN' AND status = 'ACTIVE'), 'Seed must contain one active admin');
CALL assert_true((SELECT COUNT(*) = 1 FROM users WHERE status = 'BANNED'), 'Seed must cover a banned user');
CALL assert_true((SELECT COUNT(*) = 10 FROM products WHERE status = 'ACTIVE'), 'Seed must expose ten active storefront products');
CALL assert_true((SELECT COUNT(*) = 2 FROM products WHERE status = 'INACTIVE' AND stock = 0), 'Seed must cover inactive out-of-stock products');
CALL assert_true((SELECT COUNT(DISTINCT status) = 4 FROM orders), 'Seed orders must cover four workflow statuses');
CALL assert_true((SELECT COUNT(DISTINCT status) = 3 FROM coupons), 'Seed coupons must cover active, expired and disabled statuses');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM orders
    WHERE total_amount < 0 OR shipping_fee < 0 OR discount_amount < 0
       OR discount_amount > total_amount
       OR final_amount <> GREATEST(0, total_amount + shipping_fee - discount_amount)
), 'Order totals are inconsistent');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM order_items
    WHERE quantity < 1 OR unit_price < 0 OR subtotal <> unit_price * quantity
), 'Order item subtotals are inconsistent');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM orders o
    LEFT JOIN (SELECT order_id, SUM(subtotal) AS item_total FROM order_items GROUP BY order_id) i ON i.order_id = o.id
    WHERE o.total_amount <> COALESCE(i.item_total, 0)
), 'Order total does not match item snapshots');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM products p
    LEFT JOIN (
        SELECT oi.product_id, SUM(oi.quantity) AS expected_sold
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id AND o.status <> 'CANCELLED'
        GROUP BY oi.product_id
    ) sold ON sold.product_id = p.id
    WHERE p.sold_count <> COALESCE(sold.expected_sold, 0)
), 'Product sold_count does not match non-cancelled orders');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM products p
    JOIN (
        SELECT product_id, COUNT(*) AS review_count, AVG(rating) AS review_average
        FROM reviews GROUP BY product_id
    ) aggregate_reviews ON aggregate_reviews.product_id = p.id
    WHERE p.rating_count <> aggregate_reviews.review_count
       OR ABS(p.rating_avg - aggregate_reviews.review_average) > 0.001
), 'Product rating aggregates do not match reviews');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM reviews r
    JOIN orders o ON o.id = r.order_id
    LEFT JOIN order_items oi ON oi.order_id = r.order_id AND oi.product_id = r.product_id
    WHERE o.user_id <> r.user_id OR o.status <> 'DELIVERED' OR oi.id IS NULL
), 'A review is not linked to its delivered order item');

CALL assert_true((
    SELECT COUNT(*) = 0
    FROM coupons c
    LEFT JOIN (
        SELECT coupon_id, COUNT(*) AS usage_count
        FROM orders
        WHERE coupon_id IS NOT NULL AND status <> 'CANCELLED'
        GROUP BY coupon_id
    ) usage_data ON usage_data.coupon_id = c.id
    WHERE c.used_count <> COALESCE(usage_data.usage_count, 0)
), 'Coupon used_count does not match non-cancelled orders');

SET @stock_before = (SELECT stock FROM products WHERE id = 102);
SET @sold_before = (SELECT sold_count FROM products WHERE id = 102);
START TRANSACTION;
UPDATE products
SET stock = stock - 1, sold_count = sold_count + 1
WHERE id = 102 AND stock >= 1;
CALL assert_true(ROW_COUNT() = 1, 'Atomic stock and sold_count update failed');
CALL assert_true((SELECT stock = @stock_before - 1 AND sold_count = @sold_before + 1 FROM products WHERE id = 102), 'Stock update produced incorrect values');
ROLLBACK;
CALL assert_true((SELECT stock = @stock_before AND sold_count = @sold_before FROM products WHERE id = 102), 'Stock test transaction did not roll back');

DELIMITER //
CREATE PROCEDURE test_constraint_rejections()
BEGIN
    DECLARE rejected BOOLEAN DEFAULT FALSE;

    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE products SET price = -1 WHERE id = 101;
    END;
    CALL assert_true(rejected, 'Negative product price was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE cart_items SET quantity = 0 WHERE id = 1;
    END;
    CALL assert_true(rejected, 'Zero cart quantity was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE coupons SET discount_value = 101 WHERE id = 3;
    END;
    CALL assert_true(rejected, 'Percent coupon above 100 was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE orders SET final_amount = final_amount + 1 WHERE id = 5001;
    END;
    CALL assert_true(rejected, 'Inconsistent order total was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE order_items SET quantity = 0 WHERE id = 1;
    END;
    CALL assert_true(rejected, 'Zero order-item quantity was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE reviews SET rating = 6 WHERE id = 1;
    END;
    CALL assert_true(rejected, 'Review rating above five was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        UPDATE appointments SET guest_count = 0 WHERE id = 1;
    END;
    CALL assert_true(rejected, 'Zero appointment guests was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        INSERT INTO cart_items (user_id, product_id, quantity) VALUES (3, 104, 1);
    END;
    CALL assert_true(rejected, 'Duplicate cart item was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        INSERT INTO wishlists (user_id, product_id) VALUES (2, 999999);
    END;
    CALL assert_true(rejected, 'Orphan wishlist product was accepted');

    SET rejected = FALSE;
    BEGIN DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET rejected = TRUE;
        INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
        VALUES (2, 108, 5001, 5, 'Sai sản phẩm trong đơn');
    END;
    CALL assert_true(rejected, 'Review for a product outside the order was accepted');
END//
DELIMITER ;

CALL test_constraint_rejections();

SELECT 'PASS database schema, seed, relationships and constraints' AS result;
