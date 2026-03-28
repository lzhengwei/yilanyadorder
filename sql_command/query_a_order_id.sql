SELECT * FROM orders WHERE order_id = 10008;

SELECT 
  oi.order_id, 
  oi.product_id, 
  p.name,
  oi.quantity
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 10008;