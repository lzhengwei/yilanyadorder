const API_BASE = "https://yilanyadorder-backend.onrender.com/api";

// 🛒 儲存購物車至 localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 🛒 加入或更新購物車
function updateCart(id, qty) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const found = cart.find(i => i.id === id);
  if (found) {
    if (qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    } else {
      found.qty = qty;
    }
  } else if (qty > 0) {
    cart.push({ id, qty });
  }
  saveCart(cart);
}

// ✅ 模擬 15 組商品資料（前端預覽模式）
const localProducts = [
  { id: 1, name: "青梅竹馬", price: 120, stock: 20, image_url: "https://placehold.co/300x200?text=T恤" },
  { id: 2, name: "陶瓷馬", price: 120, stock: 12, image_url: "https://placehold.co/300x200?text=水瓶" },
  { id: 3, name: "流蘇白馬", price: 280, stock: 10, image_url: "https://placehold.co/300x200?text=馬" },
  { id: 4, name: "金貂福馬", price: 250, stock: 10, image_url: "https://placehold.co/300x200?text=馬" },
  { id: 5, name: "竹子小紅馬", price: 130, stock: 10, image_url: "https://placehold.co/300x200?text=馬" },
  { id: 6, name: "白色獨角獸", price: 200, stock: 10, image_url: "https://placehold.co/300x200?text=獨角獸" },
  { id: 7, name: "粉色獨角獸", price: 250, stock: 10, image_url: "https://placehold.co/300x200?text=獨角獸" },
  { id: 8, name: "馬上有錢掛件", price: 120, stock: 10, image_url: "https://placehold.co/300x200?text=掛件" },
  { id: 9, name: "水豚啪啪圈兔毛", price: 168, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 10, name: "發財樹水豚", price: 220, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 11, name: "麻將水豚", price: 220, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 12, name: "牛油果水豚", price: 350, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 13, name: "粉色米水豚", price: 350, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 14, name: "藍色衣服水豚", price: 350, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" },
  { id: 15, name: "游泳圈水豚", price: 350, stock: 10, image_url: "https://placehold.co/300x200?text=水豚" }
];


// ✅ 建立浮動視窗 (Modal)
function createModal() {
  const modal = document.createElement("div");
  modal.id = "product-modal";
  modal.style.display = "none";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">✖</button>
      <img id="modal-image" src="" alt="">
      <h2 id="modal-name"></h2>
      <p id="modal-price"></p>
      <p id="modal-stock"></p>
      <p id="modal-desc"></p>
      <div class="quantity-selector">
        <button id="modal-decrease">−</button>
        <input type="number" id="modal-qty" value="1" min="1" />
        <button id="modal-increase">＋</button>
      </div>
      <button id="modal-add">加入購物車</button>
    </div>
  `;
  document.body.appendChild(modal);

  const style = document.createElement("style");
  style.textContent = `
    #product-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
    .modal-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .modal-content {
      position: relative;
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      width: 90%;
      max-width: 400px;
      text-align: center;
      z-index: 1000;
    }
    .modal-content img {
      width: 100%;
      border-radius: 10px;
    }
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}
createModal();

// ✅ 顯示商品詳細視窗
function showProductModal(p, stock) {
  const modal = document.getElementById("product-modal");
  modal.style.display = "flex";
  document.getElementById("modal-image").src = p.image_url;
  document.getElementById("modal-name").textContent = p.name;
  document.getElementById("modal-price").textContent = `價格：$${p.price}`;
  document.getElementById("modal-stock").textContent = `庫存：${stock}`;
  document.getElementById("modal-desc").textContent = p.desc;

  const qtyInput = document.getElementById("modal-qty");
  const addBtn = document.getElementById("modal-add");

  document.getElementById("modal-increase").onclick = () => {
    if (qtyInput.value < stock) qtyInput.value++;
  };
  document.getElementById("modal-decrease").onclick = () => {
    if (qtyInput.value > 1) qtyInput.value--;
  };

  addBtn.onclick = () => {
    updateCart(p.id, parseInt(qtyInput.value));
    alert(`🛒 已加入購物車：${p.name} x ${qtyInput.value}`);
    modal.style.display = "none";
  };

  modal.querySelector(".modal-overlay").onclick = () => (modal.style.display = "none");
  modal.querySelector(".modal-close").onclick = () => (modal.style.display = "none");
}

// ✅ 載入商品並顯示
async function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
    container.innerHTML = "<p>載入中...</p>";

  let apiStock = {};
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    data.forEach(item => {
      apiStock[item.id] = item.stock;
    });
  } catch (e) {
    console.warn("⚠️ 無法連線至 API，使用預設庫存");
  }

  container.innerHTML = "";
  localProducts.forEach(p => {
    const stock = apiStock[p.id] ?? 0;
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <p>剩餘：${stock}</p>
      <div class="quantity-selector">
        <button class="decrease">−</button>
        <input type="number" value="0" min="0" max="${stock}" />
        <button class="increase">＋</button>
      </div>
      <button class="add-to-cart" ${stock === 0 ? "disabled" : ""}>加入購物車</button>
    `;

        // 點擊商品卡開啟詳情視窗
    div.addEventListener("click", () => showProductModal(p, stock));
    container.appendChild(div);
  });
}

// ✅ 顯示購物車內容
async function loadCart() {
  const cartEl = document.getElementById("cart");
  if (!cartEl) return;
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const products = localProducts;

  const items = cart.map(c => {
    const p = products.find(p => p.id === c.id);
    if (!p) return "";
    return `<div>${p.name} x ${c.qty} = $${p.price * c.qty}</div>`;
  }).join("");

  cartEl.innerHTML = items || "購物車是空的";
}

// ✅ 結帳
async function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) return alert("購物車是空的！");

  const buyer_name = document.getElementById("buyer-name")?.value || "";
  const buyer_phone = document.getElementById("buyer-phone")?.value || "";
  const buyer_email = document.getElementById("buyer-email")?.value || "";

  if (!buyer_name || !buyer_phone || !buyer_email) {
    alert("請完整填寫購買者資料！");
    return;
  }

  const res = await fetch(`${API_BASE}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      buyer_name,
      buyer_phone,
      buyer_email,
      items: cart
    })
  });

  const data = await res.json();
  alert("✅ 訂單已建立！編號：" + data.order_id);

  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      alert("🧹 購物車已清空");
      loadCart();
    });
  }
});

// 🚀 初始化
loadProducts();
loadCart();