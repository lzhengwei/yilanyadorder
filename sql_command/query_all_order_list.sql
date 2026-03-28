SELECT 
    o.order_id,
SUM(CASE WHEN p.id = 1  THEN oi.quantity ELSE 0 END) AS product1,
SUM(CASE WHEN p.id = 2  THEN oi.quantity ELSE 0 END) AS product2,
SUM(CASE WHEN p.id = 3  THEN oi.quantity ELSE 0 END) AS product3,
SUM(CASE WHEN p.id = 4  THEN oi.quantity ELSE 0 END) AS product4,
SUM(CASE WHEN p.id = 5  THEN oi.quantity ELSE 0 END) AS product5,
SUM(CASE WHEN p.id = 6  THEN oi.quantity ELSE 0 END) AS product6,
SUM(CASE WHEN p.id = 7  THEN oi.quantity ELSE 0 END) AS product7,
SUM(CASE WHEN p.id = 8  THEN oi.quantity ELSE 0 END) AS product8,
SUM(CASE WHEN p.id = 9  THEN oi.quantity ELSE 0 END) AS product9,
SUM(CASE WHEN p.id = 10 THEN oi.quantity ELSE 0 END) AS product10,
SUM(CASE WHEN p.id = 11 THEN oi.quantity ELSE 0 END) AS product11,
SUM(CASE WHEN p.id = 12 THEN oi.quantity ELSE 0 END) AS product12,
SUM(CASE WHEN p.id = 13 THEN oi.quantity ELSE 0 END) AS product13,
SUM(CASE WHEN p.id = 14 THEN oi.quantity ELSE 0 END) AS product14,
SUM(CASE WHEN p.id = 15 THEN oi.quantity ELSE 0 END) AS product15,
SUM(CASE WHEN p.id = 16 THEN oi.quantity ELSE 0 END) AS product16,
SUM(CASE WHEN p.id = 17 THEN oi.quantity ELSE 0 END) AS product17,
SUM(CASE WHEN p.id = 18 THEN oi.quantity ELSE 0 END) AS product18,
SUM(CASE WHEN p.id = 19 THEN oi.quantity ELSE 0 END) AS product19,
SUM(CASE WHEN p.id = 20 THEN oi.quantity ELSE 0 END) AS product20,
SUM(CASE WHEN p.id = 21 THEN oi.quantity ELSE 0 END) AS product21,
SUM(CASE WHEN p.id = 22 THEN oi.quantity ELSE 0 END) AS product22,
SUM(CASE WHEN p.id = 23 THEN oi.quantity ELSE 0 END) AS product23,
SUM(CASE WHEN p.id = 24 THEN oi.quantity ELSE 0 END) AS product24,
SUM(CASE WHEN p.id = 25 THEN oi.quantity ELSE 0 END) AS product25,
SUM(CASE WHEN p.id = 26 THEN oi.quantity ELSE 0 END) AS product26,
SUM(CASE WHEN p.id = 27 THEN oi.quantity ELSE 0 END) AS product27,
SUM(CASE WHEN p.id = 28 THEN oi.quantity ELSE 0 END) AS product28

FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY o.order_id
ORDER BY o.order_id;
