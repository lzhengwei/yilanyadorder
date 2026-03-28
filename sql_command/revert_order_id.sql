-- === Start a transaction ===
BEGIN;

-- 1️⃣ Add back stock for each product in the order
UPDATE products p
SET stock = p.stock + oi.quantity
FROM order_items oi
WHERE oi.product_id = p.id
  AND oi.order_id = 10008;

-- 2️⃣ Delete the order (order_items auto-delete via CASCADE)
DELETE FROM orders
WHERE order_id = 10008;

-- === Commit changes ===
COMMIT;
