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
  { id: 1, name: "青梅竹馬", price: 120, stock: 20, image_url: [
    "https://placehold.co/300x200?text=T恤1",
    "https://placehold.co/300x200?text=T恤2"
  ] },
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

      <div class="modal-image-wrapper">
        <button class="prev-btn">⟨</button>
        <img id="modal-image" src="" alt="">
        <button class="next-btn">⟩</button>
      </div>

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
    .modal-image-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-image-wrapper img {
      width: 100%;
      border-radius: 10px;
    }
    .prev-btn, .next-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.4);
      color: #fff;
      border: none;
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
      border-radius: 50%;
      cursor: pointer;
    }
    .prev-btn { left: 10px; }
    .next-btn { right: 10px; }
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      color: #333;
      z-index: 2000; /* ✅ 確保在最上層 */
    }
  `;
  document.head.appendChild(style);
}
createModal();

// ✅ 顯示商品詳細視窗（支援多張圖片）
function showProductModal(p, stock) {
  const modal = document.getElementById("product-modal");
  const modalImg = document.getElementById("modal-image");
  const prevBtn = modal.querySelector(".prev-btn");
  const nextBtn = modal.querySelector(".next-btn");

  // 支援 image_url 為字串或陣列
  const images = Array.isArray(p.image_url) ? p.image_url : [p.image_url];
  let currentIndex = 0;

  function updateImage() {
    modalImg.src = images[currentIndex];
    prevBtn.style.display = images.length > 1 ? "block" : "none";
    nextBtn.style.display = images.length > 1 ? "block" : "none";
  }

  updateImage();

  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };

  modal.style.display = "flex";
  document.getElementById("modal-name").textContent = p.name;
  document.getElementById("modal-price").textContent = `價格：$${p.price}`;
  document.getElementById("modal-stock").textContent = `庫存：${stock}`;
  document.getElementById("modal-desc").textContent = p.desc || "";

  const qtyInput = document.getElementById("modal-qty");
  const addBtn = document.getElementById("modal-add");
  const increaseBtn = document.getElementById("modal-increase");
  const decreaseBtn = document.getElementById("modal-decrease");

  // === 數量按鈕 ===
  if (stock === 0) {
    addBtn.disabled = true;
    increaseBtn.disabled = true;
    decreaseBtn.disabled = true;
  } else {
    addBtn.disabled = false;
    increaseBtn.disabled = false;
    decreaseBtn.disabled = false;
  }

  increaseBtn.onclick = () => {
    if (qtyInput.value < stock) qtyInput.value++;
  };

  decreaseBtn.onclick = () => {
    if (qtyInput.value > 1) qtyInput.value--;
  };

  addBtn.onclick = () => {
    const qty = parseInt(qtyInput.value);
    if (qty > stock) {
      alert(`⚠️ 數量超過庫存，最多只能買 ${stock} 件`);
      return;
    }
    if (stock <= 0) {
      alert(`⚠️ 商品已售完，無法加入購物車`);
      return;
    }
    updateCart(p.id, qty);
    alert(`🛒 已加入購物車：${p.name} x ${qty}`);
    qtyInput.value = 1;
    modal.style.display = "none";
  };

modal.querySelector(".modal-close").onclick = () => {
  modal.style.display = "none";
  qtyInput.value = 1; // 關閉時歸零
};

modal.querySelector(".modal-overlay").onclick = () => {
  modal.style.display = "none";
  qtyInput.value = 1; // 點擊背景時也歸零
};
}


// ✅ 載入商品並顯示（支援動態更新按鈕）
async function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "<p>載入中...</p>";

  container.innerHTML = "";
  localProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.dataset.id = p.id;       // 商品ID
    div.dataset.stock = 0;       // 預設庫存（等後端回來更新）
    div.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <p class="stock">庫存載入中...</p>
      <div class="quantity-selector">
        <button class="decrease" disabled>−</button>
        <input type="number" value="0" min="0" max="0" />
        <button class="increase" disabled>＋</button>
      </div>
      <button class="add-to-cart" disabled>加入購物車</button>
    `;

    // 🔗 點擊卡片顯示詳細視窗（庫存後續會更新）
    div.addEventListener("click", (e) => {
      // ⚠️ 避免點擊內部按鈕（如加入購物車）時觸發 Modal

      const currentStock = parseInt(div.dataset.stock) || 0;
      showProductModal(p, currentStock);
    });

    container.appendChild(div);
  });

  // 🧩 後端載入庫存
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();

    data.forEach(item => {
      const productDiv = container.querySelector(`[data-id="${item.id}"]`);
      if (productDiv) {
        // ✅ 更新 dataset 與畫面顯示
        productDiv.dataset.stock = item.stock;
        const stockEl = productDiv.querySelector(".stock");
        stockEl.textContent = `剩餘：${item.stock}`;

        // ✅ 更新所有相關按鈕狀態
        const decreaseBtn = productDiv.querySelector(".decrease");
        const increaseBtn = productDiv.querySelector(".increase");
        const qtyInput = productDiv.querySelector("input");
        const addBtn = productDiv.querySelector(".add-to-cart");

        if (item.stock > 0) {
          decreaseBtn.disabled = false;
          increaseBtn.disabled = false;
          addBtn.disabled = false;
          qtyInput.max = item.stock;
        } else {
          decreaseBtn.disabled = true;
          increaseBtn.disabled = true;
          addBtn.disabled = true;
          qtyInput.max = 0;
        }
      }
    });
  } catch (e) {
    alert("❌ 伺服器錯誤，請稍後再試或聯繫客服");
  }
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
  if (cart.length === 0) {
    alert("購物車是空的！");
    window.location.href = "index.html";
    return;
  }

  const delivery_method = document.querySelector('input[name="delivery"]:checked')?.value;
  const buyer_name = document.getElementById("buyer-name")?.value || "";
  const buyer_phone = document.getElementById("buyer-phone")?.value || "";
  const buyer_line = document.getElementById("buyer-line")?.value || "";

  if (!buyer_name || !buyer_phone || !buyer_line) {
    alert("請完整填寫購買者資料！");
    return;
  }

  try {

  const orderData = {
    buyer_name,
    buyer_phone,
    buyer_line,
    delivery_method,
    items: cart
  };

  if (delivery_method === "pickup") {
    orderData.pickup_time = document.getElementById("pickup-time").value;
  }

  // === 郵寄 ===
  if (delivery_method === "shipping") {
    orderData.receiver_name = document.getElementById("receiver-name").value;
    orderData.receiver_phone = document.getElementById("receiver-phone").value;
    orderData.receiver_address = document.getElementById("receiver-address").value;

    if (!orderData.receiver_name || !orderData.receiver_phone || !orderData.receiver_address) {
      alert("請完整填寫郵寄資訊！");
      return;
    }
  }

    const res = await fetch(`${API_BASE}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    // 检查 HTTP 状态码
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    
    // 检查 API 响应是否包含订单号
    if (!data.order_id) {
      throw new Error("伺服器回應缺少訂單編號");
    }

    alert("✅ 訂單已建立！編號：" + data.order_id);

    // 顯示購買明細浮窗
    showOrderSummary({
      order_id: data.order_id,
      buyer_name,
      buyer_phone,
      buyer_line,
      delivery_method,
      pickup_time: orderData.pickup_time,
      receiver_name: orderData.receiver_name,
      receiver_phone: orderData.receiver_phone,
      receiver_address: orderData.receiver_address,
      items: cart
    });

    // 清空购物车并跳转
    localStorage.removeItem("cart");
    
  } catch (error) {
    console.error("❌ 訂單建立失敗:", error);
    
    if (error.message.includes("HTTP 4") || error.message.includes("HTTP 5")) {
      alert("❌ 伺服器錯誤，請稍後再試或聯繫客服");
    } else if (error.message.includes("Failed to fetch")) {
      alert("❌ 網路連線失敗，請檢查網路連線");
    } else {
      alert("❌ 訂單建立失敗: " + error.message);
    }
  }
}

// ✅ 顯示購買明細浮窗
function showOrderSummary(order) {
  const products = localProducts;
  const modal = document.createElement("div");
  modal.id = "order-summary";
  modal.innerHTML = `
    <div class="summary-overlay"></div>
    <div class="summary-box">
      <h2>✅ 訂單建立成功！</h2>
      <p><strong>訂單編號：</strong>${order.order_id}</p>
      <hr>
      <h3>購買者資料</h3>
      <p>👤 姓名：${order.buyer_name}</p>
      <p>📞 電話：${order.buyer_phone}</p>
      <p>💬 Line ID：${order.buyer_line}</p>
      ${renderDeliveryInfo(order)}
      <hr>
      <h3>商品明細</h3>
      <div class="summary-items">
        ${order.items.map(i => {
          const p = products.find(p => p.id === i.id);
          const subtotal = p ? p.price * i.qty : 0;
          return `
            <div class="summary-item">
              <span>${p?.name || "未知商品"} × ${i.qty}</span>
              <span>$${subtotal}</span>
            </div>
          `;
        }).join("")}
      </div>
      <hr>
      <p><strong>總金額：</strong>$${order.items.reduce((sum, i) => {
        const p = products.find(p => p.id === i.id);
        return sum + (p ? p.price * i.qty : 0);
      }, 0)}</p>
      <div class="summary-actions">
        <button id="save-order">💾 儲存結果</button>
        <button id="close-summary">✖ 關閉</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // === 匯出 PDF ===
  document.getElementById("save-order").onclick = async () => {
    window.print();
  };

  document.getElementById("close-summary").onclick = () => {
    window.location.href = "index.html";
  };
}

function renderDeliveryInfo(o) {
  if (o.delivery_method === "pickup") {
    return `
      <p>取貨方式：現場取貨</p>
      <p>取貨時間：${o.pickup_time || "未指定"}</p>
    `;
  }
  if (o.delivery_method === "shipping") {
    return `
      <p>取貨方式：郵寄</p>
      <p>收件人：${o.receiver_name || "未指定"}</p>
      <p>收件人電話：${o.receiver_phone || "未指定"}</p>
      <p>收件地址：${o.receiver_address || "未指定"}</p>
    `;
  }
  return "";
}

// === 訂單查詢浮窗控制 ===
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("orderSearchModal");
  const openBtn = document.getElementById("searchOrderBtn");
  const closeBtn = modal?.querySelector(".close");
  const searchBtn = document.getElementById("order-search-btn");
  

  openBtn?.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // === 查詢訂單 ===
  searchBtn?.addEventListener("click", async () => {
    const q = document.getElementById("order-search-input").value.trim();
    const resultBox = document.getElementById("order-search-result");
    resultBox.innerHTML = "查詢中...";

    if (!q) {
      resultBox.innerHTML = "⚠️ 請輸入訂單編號或姓名";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/order/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();

      // 整理查詢結果
      const grouped = {};
      data.forEach(r => {
        if (!grouped[r.order_id]) {
          grouped[r.order_id] = {
            buyer_name: r.buyer_name,
            buyer_phone: r.buyer_phone,
            buyer_line: r.buyer_line,
            delivery_method: r.delivery_method,
            pickup_time: r.pickup_time,
            receiver_name: r.receiver_name,
            receiver_phone: r.receiver_phone,
            receiver_address: r.receiver_address,
            items: []
          };
        }
        grouped[r.order_id].items.push({
          name: r.product_name,
          price: r.price,
          qty: r.quantity
        });
      });

      resultBox.innerHTML = Object.entries(grouped)
        .map(([id, o]) => `
          <div class="order-result-card">
            <h4>🧾 訂單編號：${id}</h4>
            <p>姓名：${o.buyer_name}</p>
            <p>電話：${o.buyer_phone}</p>
            <p>Line：${o.buyer_line}</p>
            ${renderDeliveryInfo(o)}
            <h3>商品明細</h3>
            <ul>
              ${o.items.map(i => `<li>${i.name} × ${i.qty} = $${i.price * i.qty}</li>`).join("")}
            </ul>
            <p><strong>總金額：</strong>$${o.items.reduce((s, i) => s + i.price * i.qty, 0)}</p>
          </div>
        `).join("");

    } catch (err) {
      resultBox.innerHTML = "❌ 查詢失敗：" + err.message;
    }
  });
});

// === 聯繫我們浮窗控制 ===
document.addEventListener("DOMContentLoaded", () => {
  const contactModal = document.getElementById("contactModal");
  const contactBtn = document.getElementById("contactBtn");
  const closeBtns = document.querySelectorAll(".modal .close");

  contactBtn?.addEventListener("click", () => {
    contactModal.style.display = "block";
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === contactModal) contactModal.style.display = "none";
  });
});

// 🚀 初始化
loadProducts();
loadCart();