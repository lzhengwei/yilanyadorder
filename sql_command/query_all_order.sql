SELECT 
    o.order_id,
    o.buyer_name,
	o.buyer_phone,
	o.buyer_line,
    o.created_at,
	o.soap_box_count,
	o.delivery_method,
    p.name AS product_name,
    p.price,
    oi.quantity,
    (p.price * oi.quantity) AS total_price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.order_id;
