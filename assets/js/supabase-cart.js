import { supabaseClient } from "./supabase-config.js";
import { refreshUser } from "./supabase-login.js";

const SHIPPING_COST = 49;

let cart = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await refreshUser();
  await initCartUI();
  await loadCart();
});

export async function initCartUI() {
  const cartPanel = document.getElementById("cartPanel");
  const cartArrow = document.getElementById("cartArrow");
  const cartIcon = document.getElementById("cartIcon");

  cartIcon.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = cartPanel.classList.toggle("show");
    cartArrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
  });

  window.addEventListener("click", e => {
    if (!document.querySelector(".cart-wrapper").contains(e.target)) {
      cartPanel.classList.remove("show");
      cartArrow.style.transform = "rotate(0deg)";
    }
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return;

    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    sessionStorage.setItem("checkoutTotal", getFinalTotal());

    window.location.href = "/checkout.html";
  });
}

// ----------------- CART FUNCTIONS -----------------

export async function loadCart() {
  if (!currentUser) return;

  const { data, error } = await supabaseClient
    .from("Cart")
    .select("*")
    .eq("user_id", currentUser.id);

  if (error) console.error(error);
  else cart = data;

  renderCart();
}

export async function addToCart(product) {
  if (!currentUser) return alert("You must be logged in to add items!");

  const configKey = product.options
    ? JSON.stringify(product.options)
    : null;

  const existing = cart.find(
    item =>
      item.product_id === product.product_id &&
      item.config_key === configKey
  );

  if (existing) {
    existing.quantity++;

    await supabaseClient
      .from("Cart")
      .update({ quantity: existing.quantity })
      .eq("id", existing.id);
  } else {
    const { data, error } = await supabaseClient
      .from("Cart")
      .insert([
        {
          user_id: currentUser.id,
          product_id: product.product_id,
          product_name: product.name,
          price: product.price,
          image_url: product.image,
          options: product.options || null,
          config_key: configKey,
          quantity: 1
        }
      ])
      .select();

    if (error) console.error(error);
    else cart.push(data[0]);
  }

  renderCart();
}

async function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id == itemId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    await supabaseClient.from("Cart").delete().eq("id", item.id);
    cart = cart.filter(c => c.id !== item.id);
  } else {
    await supabaseClient
      .from("Cart")
      .update({ quantity: item.quantity })
      .eq("id", item.id);
  }

  renderCart();
}

function getCartSubtotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function getFinalTotal() {
  if (!cart.length) return 0;
  return getCartSubtotal() + SHIPPING_COST;
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalText = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalText.textContent = "0 kr";
    cartCount.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image_url}" alt="${item.product_name}">
      <div class="cart-item-name">${item.product_name}</div>
      <div class="cart-price">${item.price} kr</div>
      <div class="cart-quantity">
        <button class="minus-btn" data-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button class="plus-btn" data-id="${item.id}">+</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById("cartSubtotal").textContent =
    `${getCartSubtotal()} kr`;

  document.getElementById("cartShipping").textContent =
    cart.length ? `${SHIPPING_COST} kr` : `0 kr`;

  totalText.textContent =
    `${getFinalTotal()} kr`;

  cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document
    .querySelectorAll(".plus-btn")
    .forEach(btn =>
      btn.addEventListener("click", () =>
        updateQuantity(btn.dataset.id, 1)
      )
    );

  document
    .querySelectorAll(".minus-btn")
    .forEach(btn =>
      btn.addEventListener("click", () =>
        updateQuantity(btn.dataset.id, -1)
      )
    );
}
