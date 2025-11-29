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

// ✅ 定義分組與分類（兩層）
// 需求：顯示兩個主要群組：1. 娃娃 2. 佛光普皂，並保留子分類
const groups = [
  {
    id: 'doll',
    name: '新春娃娃',
    categories: [
      { id: 1, name: "駿馬系列", startId: 1, endId: 8 },
      { id: 2, name: "卡皮巴拉系列", startId: 9, endId: 15 },
    ]
  },
  {
    id: 'soap',
    name: '佛光普皂',
    categories: [
      { id: 3, name: "活力清新系", startId: 16, endId: 18 },
      { id: 4, name: "療癒花香系", startId: 19, endId: 21 },
      { id: 5, name: "森林木質系", startId: 22, endId: 24 },
      { id: 6, name: "放鬆安神系", startId: 25, endId: 27 },
      { id: 7, name: "優惠組合", startId: 28, endId: 28 },
    ]
  }
];

// backwards-compatible flat list for other code that might expect `categories`
const categories = groups.flatMap(g => g.categories);

// ✅ 模擬 15 組商品資料（前端預覽模式）
const localProducts = [
  { id: 1, name: "青梅竹馬", price: 150, stock: 20, image_url: [
    "asset/doll/青梅竹馬.png",
  ] },
  { id: 2, name: "陶瓷馬", price: 150, stock: 12, image_url: "asset/doll/陶瓷馬.png" },
  { id: 3, name: "流蘇白馬", price: 280, stock: 10, image_url: "asset/doll/流蘇白馬.png" },
  { id: 4, name: "金貂福馬", price: 250, stock: 10, image_url: "asset/doll/金貂福馬.png" },
  { id: 5, name: "竹子小紅馬", price: 120, stock: 10, image_url: "asset/doll/竹子小紅馬.png" },
  { id: 6, name: "白色獨角獸", price: 200, stock: 10, image_url: "asset/doll/白色獨角獸.png" },
  { id: 7, name: "粉色獨角獸", price: 250, stock: 10, image_url: "asset/doll/粉色獨角獸.png" },
  { id: 8, name: "馬上有錢掛件", price: 120, stock: 10, image_url: "asset/doll/馬上有錢掛件.png" },
  { id: 9, name: "長壽水豚", price: 168, stock: 10, image_url: "asset/doll/長壽水豚.png" },
  { id: 10, name: "大吉大利水豚", price: 220, stock: 10, image_url: "asset/doll/大吉大利水豚.png" },
  { id: 11, name: "發心水豚", price: 220, stock: 10, image_url: "asset/doll/發心水豚.png" },
  { id: 12, name: "夏威夷水豚", price: 350, stock: 10, image_url: "asset/doll/夏威夷水豚.png" },
  { id: 13, name: "游泳健將水豚", price: 350, stock: 10, image_url: "asset/doll/游泳健將水豚.png" },
  { id: 14, name: "粉系水豚", price: 350, stock: 10, image_url: "asset/doll/粉系水豚.png" },
  { id: 15, name: "牛油果水豚組合", price: 500, stock: 10, image_url: "asset/doll/牛油果水豚組合.jpg" },
  { id: 16, name: "恭喜發財", price: 50, stock: 20, image_url: "asset/soap/活力清新系_恭喜發財.png" },
  { id: 17, name: "招財進寶", price: 50, stock: 20, image_url: "asset/soap/活力清新系_招財進寶.png" },
  { id: 18, name: "福字", price: 50, stock: 20, image_url: "asset/soap/活力清新系_福字.png" },
  { id: 19, name: "吉祥", price: 60, stock: 10, image_url: "asset/soap/療癒花香系_吉祥.png" },
  { id: 20, name: "如意", price: 60, stock: 10, image_url: "asset/soap/療癒花香系_如意.png" },
  { id: 21, name: "太陽花", price: 60, stock: 10, image_url: "asset/soap/療癒花香系_花.png" },
  { id: 22, name: "幸福", price: 60, stock: 10, image_url: "asset/soap/森林木質系_幸福.png" },
  { id: 23, name: "快樂", price: 60, stock: 10, image_url: "asset/soap/森林木質系_快樂.png" },
  { id: 24, name: "平安", price: 60, stock: 10, image_url: "asset/soap/森林木質系_平安竹.png" },
  { id: 25, name: "元寶", price: 100, stock: 10, image_url: "asset/soap/放鬆安神系_元寶.png" },
  { id: 26, name: "福氣馬", price: 100, stock: 10, image_url: "asset/soap/放鬆安神系_福氣馬.png" },
  { id: 27, name: "馬到成功", price: 100, stock: 10, image_url: "asset/soap/放鬆安神系_馬到成功.png", desc: "香皂為純手工製作，易有色差" },
  { id: 28, name: "優惠組合", price: 350, stock: 10, image_url: "asset/soap/優惠組合.png"
    , desc: "福氣馬、馬到成功、如意、幸福優惠組合"
   },
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
      width: 100vh;   /* 螢幕寬度 100% */
      height: 80vh;  /* 螢幕高度 80% */
      max-width: 300px;
      text-align: center;
      z-index: 1000;
      overflow-y: auto;
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
    // .modal-close {
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    //   background: none;
    //   border: none;
    //   font-size: 1rem;
    //   cursor: pointer;
    //   color: #ff9fb3;
    //   z-index: 2000; /* ✅ 確保在最上層 */
    // }
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff8fa3 !important;
      color: white !important;
      border: none;
      padding: 0.4rem 0.7rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.5rem;
      font-weight: 600;
      transition: background 0.2s ease;
      z-index: 2000; /* ✅ 確保在最上層 */
    }

    .modal-close:hover {
      background: #ff748c !important;
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
  document.querySelector(".floating-buttons").style.display = "none";
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
    document.querySelector(".floating-buttons").style.display = "flex";
  };

  modal.querySelector(".modal-close").onclick = () => {
    modal.style.display = "none";
    qtyInput.value = 1; // 關閉時歸零
    // 🔥 恢復 floating buttons
    document.querySelector(".floating-buttons").style.display = "flex";
  };

  modal.querySelector(".modal-overlay").onclick = () => {
    modal.style.display = "none";
    qtyInput.value = 1; // 點擊背景時也歸零
    // 🔥 恢復 floating buttons
    document.querySelector(".floating-buttons").style.display = "flex";
  };
}

// ✅ 載入分類標題
function loadCategories() {
  const linksContainer = document.getElementById("category-links");
  if (!linksContainer) return;

  // Render top-level groups with their subcategory links
  linksContainer.innerHTML = groups.map(g => `
    <div class="group-links">
      <span class="group-title">${g.name}</span>
      <div class="sub-links">
        ${g.categories.map(cat => `<a class="category-link" href="#cat-${cat.id}">${cat.name}</a>`).join(' ')}
      </div>
    </div>
  `).join('\n');
}

async function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "<p>載入中...</p>";
  container.innerHTML = "";

  // ==== 先顯示所有商品，但 stock 顯示讀取中 ====
  // Render each group first, then its categories and products
  groups.forEach(group => {

    const groupTitle = document.createElement("h1");
    groupTitle.textContent = group.name;
    groupTitle.className = 'group-title';
    container.appendChild(groupTitle);

    group.categories.forEach(category => {

    const title = document.createElement("h2");
    title.textContent = category.name;
    // add id for anchor linking from top navigation
    title.id = `cat-${category.id}`;
    title.className = "category-title";
    container.appendChild(title);

    const categoryContainer = document.createElement("div");
    categoryContainer.className = "category-container";

    const categoryProducts = localProducts.filter(p =>
      p.id >= category.startId && p.id <= category.endId
    );

    categoryProducts.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";
  div.dataset.id = p.id;

  div.innerHTML = `
    <img src="${Array.isArray(p.image_url) ? p.image_url[0] : p.image_url}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>$${p.price}</p>

    <p class="stock">讀取中...</p>

    <div class="quantity-selector">
      <button class="decrease" disabled>−</button>
      <input type="number" value="0" min="0" disabled />
      <button class="increase" disabled>＋</button>
    </div>

    <button class="add-to-cart" disabled>加入購物車</button>
  `;

    // 🔥 原本：只給商品卡片整體觸發
    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("decrease")) return;
      if (e.target.classList.contains("increase")) return;
      if (e.target.classList.contains("add-to-cart")) return;
      if (e.target.tagName === 'INPUT') return;

      const latestStock = Number(div.dataset.stock);
      showProductModal(p, latestStock);
    });

    // 🔥 為 decrease 增加事件
    div.querySelector(".decrease").addEventListener("click", (e) => {
      e.stopPropagation();  // 不要讓事件被 div 處理
      // ↓↓↓ 原本 decrease 的功能（如果你之後有）↓↓↓
      // ...

      // 🔥 點完還是開 modal
      div.click();
    });

    // 🔥 為 increase 增加事件
    div.querySelector(".increase").addEventListener("click", (e) => {
      e.stopPropagation();
      // ...

      div.click(); // 同樣開 modal
    });

    // 🔥 為 add-to-cart 增加事件
    div.querySelector(".add-to-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      // ...

      div.click(); // 同樣開 modal
    });

    categoryContainer.appendChild(div);
  });


      container.appendChild(categoryContainer);
    });
  });

  // ==== 後端資料回來後更新庫存 ====
  try {
    const res = await fetch(`${API_BASE}/products`);
    const backendProducts = await res.json();

    updateStocks(backendProducts);

  } catch (err) {
    console.error("載入庫存失敗，使用 fallback");
  }
}


function updateStocks(backendProducts) {
  backendProducts.forEach(bp => {
    const productDiv = document.querySelector(`.product[data-id="${bp.id}"]`);
    if (!productDiv) return;

    const stockElem = productDiv.querySelector(".stock");
    const decreaseBtn = productDiv.querySelector(".decrease");
    const increaseBtn = productDiv.querySelector(".increase");
    const inputElem = productDiv.querySelector("input");
    const addBtn = productDiv.querySelector(".add-to-cart");

    productDiv.dataset.stock = bp.stock;

    if (bp.stock > 0) {
      stockElem.textContent = `剩餘：${bp.stock}`;
      decreaseBtn.disabled = false;
      increaseBtn.disabled = false;
      inputElem.disabled = false;
      addBtn.disabled = false;
      inputElem.max = bp.stock;
    } else {
      stockElem.textContent = "已售完";
      decreaseBtn.disabled = true;
      increaseBtn.disabled = true;
      inputElem.disabled = true;
      addBtn.disabled = true;
    }
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
  if (cart.length === 0) {
    alert("購物車是空的！");
    window.location.href = "index.html";
    
    return;
  }

  const delivery_method = document.querySelector('input[name="delivery"]:checked')?.value;
  const buyer_name = document.getElementById("buyer-name")?.value || "";
  const buyer_phone = document.getElementById("buyer-phone")?.value || "";
  const buyer_line = document.getElementById("buyer-line")?.value || "";
  const soap_box_check = document.querySelector('input[name="add-soapbox"]:checked')?.value;
  const soap_box_count = document.getElementById("soapbox-qty")?.value || "";

  if (!buyer_name || !buyer_phone || !buyer_line) {
    alert("請完整填寫購買者資料！");
    return;
  }

  try {

  const orderData = {
    buyer_name,
    buyer_phone,
    buyer_line,
    soap_box_count,
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

  if (soap_box_check === "yes") {
    orderData.soap_box_count = parseInt(soap_box_count) || 0;
  }
  else {
    orderData.soap_box_count = 0;
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
      soap_box_count,
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
      ${order.soap_box_count > 0 ? `
        <div class="summary-item">
          <span>佛光普皂禮盒 × ${order.soap_box_count}</span>
          <span>$${order.soap_box_count * 20}</span>
        </div>
      ` : ""}
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
      }, 0) + (order.soap_box_count * 20)}</p>
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
            soap_box_count: r.soap_box_count,
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
            <p>Line ID：${o.buyer_line}</p>
            ${renderDeliveryInfo(o)}
            <h3>商品明細</h3>
            ${o.soap_box_count > 0 ? `
            <div class="summary-item">
              <span>佛光普皂禮盒 × ${o.soap_box_count}</span>
              <span>$${o.soap_box_count * 20}</span>
            </div>
            ` : ""}
            <ul>
              ${o.items.map(i => `<li>${i.name} × ${i.qty} = $${i.price * i.qty}</li>`).join("")}
            </ul>
            <p><strong>總金額：</strong>$${o.items.reduce((s, i) => s + i.price * i.qty, 0)+ (o.soap_box_count * 20)}</p>
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
loadCategories();
loadProducts();
loadCart();

