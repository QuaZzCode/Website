// supabase-cart.js
import { supabaseClient } from './supabase-config.js';
import { refreshUser } from './supabase-login.js';

let cart = [];
let currentUser = null;

// Initialize cart UI
document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await refreshUser();
  await initCartUI();
});

async function initCartUI() {
  const cartPanel = document.getElementById("cartPanel");
  const cartArrow = document.getElementById("cartArrow");
  const cartIcon = document.getElementById("cartIcon");

  // Toggle cart visibility
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

  document.getElementById("checkoutBtn").addEventListener("click", () => alert("Checkout feature coming soon!"));

}
document.addEventListener("click", async e => {
  if (e.target.classList.contains("buy-btn")) {
    e.stopPropagation();
    const card = e.target.closest(".product-card");
    const product = {
      id: card.dataset.id,
      name: card.querySelector("h3").textContent,
      price: parseFloat(card.querySelector(".price").textContent.replace("kr", "").trim()),
      image: card.querySelector("img").src,
    };
    await addToCart(product);
  }
});



// ----------------- CART FUNCTIONS -----------------
async function loadCart() {
  if (!currentUser) return;
  const { data, error } = await supabaseClient
    .from("Cart")
    .select("*")
    .eq("user_id", currentUser.id);
  if (error) console.error(error);
  else cart = data;
  renderCart();
}

async function addToCart(product) {
  if (!currentUser) return alert("You must be logged in to add items!");

  const existing = cart.find(item => Number(item.product_id) === Number(product.id));
  if (existing) {
    existing.quantity++;
    await supabaseClient.from("Cart").update({ quantity: existing.quantity }).eq("id", existing.id);
  } else {
    const { data, error } = await supabaseClient.from("Cart").insert([{
      user_id: currentUser.id,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image_url: product.image,
      quantity: 1,
    }]).select();
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
    await supabaseClient.from("Cart").update({ quantity: item.quantity }).eq("id", item.id);
  }

  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  totalText.textContent = `${getCartTotal()} kr`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".plus-btn").forEach(btn => btn.addEventListener("click", () => updateQuantity(btn.dataset.id, 1)));
  document.querySelectorAll(".minus-btn").forEach(btn => btn.addEventListener("click", () => updateQuantity(btn.dataset.id, -1)));
}
