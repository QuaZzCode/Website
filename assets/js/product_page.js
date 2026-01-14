import { addToCart } from "./supabase-cart.js";

/* ---------------- PRODUCT ---------------- */
const currentProduct = JSON.parse(localStorage.getItem("selectedProduct"));
if (!currentProduct) alert("No product selected");

const BASE_PRICE = 100;
const OPTION_PRICE = 5;

/* ---------------- STATE ---------------- */
const state = {
  leather: null,
  stitch: null,
  button: null,
  shape: {
    front: null,
    back: null
  },
  side: "front"
};

/* ---------------- IMAGE PATH ---------------- */
function img(type, value) {
  if (!value) return null;

  if (type === "leather") {
    return `${currentProduct.path}/leather/${value}.png`;
  }

  if (type === "shape") {
    return `${currentProduct.path}/shapes/${state.side}/${state.leather}/${value}.png`;
  }

  const folder = type === "stitch" ? "stitches" : `${type}s`;
  return `${currentProduct.path}/${folder}/${state.leather}/${value}.png`;
}

/* ---------------- PRICE ---------------- */
function updatePrice() {
  let price = BASE_PRICE;

  if (state.stitch) price += OPTION_PRICE;
  if (state.button) price += OPTION_PRICE;
  if (state.shape.front) price += OPTION_PRICE;
  if (state.shape.back) price += OPTION_PRICE;

  document.getElementById("price-value").textContent = `${price} kr`;
}

/* ---------------- UI ---------------- */
function updateShapeUI() {
  document.querySelectorAll('[data-option="shape"]').forEach(el => {
    const value = el.dataset.value;

    // ONLY highlight shape for CURRENT side
    el.classList.toggle(
      "active",
      state.shape[state.side] === value
    );
  });
}

/* ---------------- HANDLE OPTION ---------------- */
function handleOption(el) {
  const type = el.dataset.option;
  const value = el.dataset.value;
  const layer = document.getElementById(`${type}-layer`);

  /* ---- SHAPES (PER SIDE) ---- */
  if (type === "shape") {
    const side = state.side;

    if (state.shape[side] === value) {
      state.shape[side] = null;
      layer.style.display = "none";
    } else {
      state.shape[side] = value;
      layer.src = img("shape", value);
      layer.style.display = "block";
    }

    updateShapeUI();
    updatePrice();
    saveState();
    return;
  }

  /* ---- TOGGLE OFF ---- */
  if (state[type] === value) {
    state[type] = null;
    layer.style.display = "none";
    el.classList.remove("active");
    updatePrice();
    saveState();
    return;
  }

  /* ---- SET STATE ---- */
  state[type] = value;
  layer.src = img(type, value);
  layer.style.display = "block";

  el.parentElement
    .querySelectorAll("[data-option]")
    .forEach(o => o.classList.remove("active"));

  el.classList.add("active");

  /* ---- LEATHER CHANGE ---- */
  if (type === "leather") {
    ["stitch", "button"].forEach(t => {
      if (state[t]) {
        const l = document.getElementById(`${t}-layer`);
        l.src = img(t, state[t]);
        l.style.display = "block";
      }
    });

    if (state.shape[state.side]) {
      document.getElementById("shape-layer").src =
        img("shape", state.shape[state.side]);
    }
  }

  updatePrice();
  updateOptionPriceLabels();
  saveState();
}

/* ---------------- STORAGE ---------------- */
function saveState() {
  localStorage.setItem("customizerState", JSON.stringify(state));
}

/* ---------------- FINAL IMAGE ---------------- */
function generateFinalImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const layers = [
    "leather-layer",
    "stitch-layer",
    "button-layer",
    "shape-layer"
  ]
    .map(id => document.getElementById(id))
    .filter(l => l && l.style.display !== "none");

  if (!layers.length) return null;

  canvas.width = layers[0].naturalWidth;
  canvas.height = layers[0].naturalHeight;

  layers.forEach(img => ctx.drawImage(img, 0, 0));
  return canvas.toDataURL("image/png");
}

/* ---------------- CART ---------------- */
document.querySelector(".buy-btn").addEventListener("click", async () => {
  const product = {
    product_id: currentProduct.id,
    name: currentProduct.name,
    price: parseInt(document.getElementById("price-value").textContent),
    image: generateFinalImage(),
    options: JSON.parse(JSON.stringify(state))
  };

  await addToCart(product);
});

/* ---------------- FLIP ---------------- */
const preview = document.querySelector(".keychain-preview");
document.getElementById("flip-btn").addEventListener("click", () => {
  preview.classList.toggle("flipped");
  state.side = state.side === "front" ? "back" : "front";

  const shapeLayer = document.getElementById("shape-layer");
  const value = state.shape[state.side];

  if (value) {
    shapeLayer.src = img("shape", value);
    shapeLayer.style.display = "block";
  } else {
    shapeLayer.style.display = "none";
  }

  updateShapeUI();
  updateOptionPriceLabels();
  saveState();
});

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("base-layer").src = currentProduct.base;

  document.querySelectorAll("[data-option]").forEach(el =>
    el.addEventListener("click", () => handleOption(el))
  );

  // Default leather
  const brown = document.querySelector('[data-option="leather"][data-value="brown"]');
  if (brown) handleOption(brown);

  updatePrice();
  updateOptionPriceLabels();
});


function updateOptionPriceLabels() {
  // Stitch
  togglePriceLabel("stitch", !!state.stitch);

  // Button
  togglePriceLabel("button", !!state.button);

  // Shape (can be 0 / 5 / 10 kr)
  const shapeCount =
    (state.shape.front ? 1 : 0) +
    (state.shape.back ? 1 : 0);

  const shapeLabel = document.querySelector('[data-price-for="shape"]');
  if (shapeLabel) {
    if (shapeCount === 0) {
      shapeLabel.classList.remove("active");
    } else {
      shapeLabel.classList.add("active");
      shapeLabel.textContent = `+${shapeCount * OPTION_PRICE} kr`;
    }
  }
}

function togglePriceLabel(type, active) {
  const el = document.querySelector(`[data-price-for="${type}"]`);
  if (!el) return;

  el.classList.toggle("active", active);
  el.textContent = `+${OPTION_PRICE} kr`;
}


