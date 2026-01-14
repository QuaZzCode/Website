const SHIPPING_COST = 49;

const cart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];

const orderItemsEl = document.getElementById("orderItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

function renderSummary() {
  let subtotal = 0;
  orderItemsEl.innerHTML = "";

  cart.forEach(item => {
    const line = document.createElement("div");
    line.className = "order-item";
    line.innerHTML = `
      <span>${item.product_name} × ${item.quantity}</span>
      <span>${item.price * item.quantity} kr</span>
    `;
    orderItemsEl.appendChild(line);
    subtotal += item.price * item.quantity;
  });

  subtotalEl.textContent = `${subtotal} kr`;
  totalEl.textContent = `${subtotal + SHIPPING_COST} kr`;
}

renderSummary();

document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  // At this point you would:
  // 1. Save order to database
  // 2. Trigger payment
  // 3. Send confirmation email

  alert("Order placed successfully!");

  sessionStorage.removeItem("checkoutCart");
  sessionStorage.removeItem("checkoutTotal");

  window.location.href = "/thank-you.html";
});
