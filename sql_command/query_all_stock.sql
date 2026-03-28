-- query_all_stock.sql
SELECT id, name, stock
FROM products
ORDER BY id;

-- To reset stock of product id 1 to 20
UPDATE products
SET stock = 30
WHERE id = 8;