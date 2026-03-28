-- === Recreate Full Database Schema with 5-digit oder id ===

-- ⚠️ WARNING: This script will delete all existing data and recreate the schema.
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- === 1️⃣ Products Table ===
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

-- === 2️⃣ Orders Table (with 5-digit order_id) ===
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_line TEXT NOT NULL,
  soap_box_count INTEGER NOT NULL DEFAULT 0,
  delivery_method TEXT,          
  pickup_time TEXT,              
  receiver_name TEXT,           
  receiver_phone TEXT,           
  receiver_address TEXT,         
  created_at TIMESTAMP DEFAULT NOW()
);

-- === 3️⃣ Order Items Table ===
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);

-- === 4️⃣ Initialize order_id sequence starting from 10000 ===
-- This sequence will help generate next order_id values manually if needed.
DROP SEQUENCE IF EXISTS order_id_seq CASCADE;

CREATE SEQUENCE order_id_seq START 10000;


INSERT INTO products (name, price, stock) VALUES
('青梅竹馬', 150, 20),
('陶瓷馬', 150, 20),
('流蘇白馬', 250, 20),
('金貂福馬', 280, 20),
('竹子小紅馬', 120, 20),
('白色獨角獸', 250, 17),
('粉色獨角獸', 200, 20),
('馬上有錢掛件', 120, 30),
('長壽水豚', 168, 20),
('大吉大利水豚', 220, 20),
('發心水豚', 220, 20),
('夏威夷水豚', 350, 15),
('游泳健將水豚', 350, 15),
('粉系水豚', 500, 10),
('牛油果水豚組合', 500, 10),
('活力清新系-恭喜發財', 50, 30),
('活力清新系-招財進寶', 50, 30),
('活力清新系-福字', 50, 30),
('療癒花香系-吉祥', 60, 30),
('療癒花香系-如意', 60, 30),
('療癒花香系-太陽花', 60, 30),
('森林木質系-幸福', 60, 30),
('森林木質系-快樂', 60, 30),
('森林木質系-平安', 60, 30),
('放鬆安神系-元寶', 100, 30),
('放鬆安神系-福氣馬', 100, 30),
('放鬆安神系-馬到成功', 100, 30),
('優惠組合', 300, 30),
('福馬系列-發財', 50, 20),
('福馬系列-馬上有錢', 50, 20),
('福馬系列-馬上平安', 50, 20),
('福馬系列-開運(福)', 50, 20),
('招財貓系列-開運', 50, 10),
('招財貓系列-結緣', 50, 10),
('招財貓系列-健康', 50, 10),
('招財貓系列-平安', 50, 11),
('鞭炮系列-財源滾滾', 50, 25),
('鞭炮系列-大吉', 50, 23),
('鞭炮系列-平安', 50, 28),
('諸事皆宜', 50, 26),
('平安喜樂', 50, 25),
('藍繩+平安+藍色小馬', 150, 13),
('綠繩+平安+綠色小馬', 150, 14),
('綠繩+暴富+棕色小馬', 150, 10),
('粉繩+福運+紫色小馬', 150, 14);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  lineid TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);