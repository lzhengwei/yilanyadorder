-- === Upgrade to Scheme A: Add custom order_id (5-digit) ===

-- 1️⃣ Add order_id column to orders
ALTER TABLE orders ADD COLUMN order_id INTEGER;

-- 2️⃣ Initialize order_id values (start from 10000)
UPDATE orders SET order_id = id + 10000;

-- 3️⃣ Ensure order_id is unique
ALTER TABLE orders ADD CONSTRAINT orders_order_id_key UNIQUE (order_id);

-- 4️⃣ Update order_items foreign key to reference orders.order_id
ALTER TABLE order_items DROP CONSTRAINT order_items_order_id_fkey;

ALTER TABLE order_items
ADD CONSTRAINT order_items_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES orders(order_id);

-- 5️⃣ Verify structure
SELECT order_id, buyer_name, buyer_phone, buyer_line FROM orders ORDER BY order_id;
