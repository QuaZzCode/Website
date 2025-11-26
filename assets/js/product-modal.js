const productsData = [
  {
    title: "Leather Keychain",
    images: ["images/pictures/image1.png", "images/pictures/image2.png", "images/pictures/image3.png"],
    price: "149 kr",
    material: "Materail: Genuine leather",
    desc: "Handmade keychain, durable and stylish."
  },
  {
    title: "Wooden Bracelet",
    images: ["images/pictures/image1.png", "images/pictures/image2.png", "images/pictures/image3.png"],
    price: "199 kr",
    material: "Material: Oak wood",
    desc: "Crafted from oak, adjustable size, elegant look."
  }
];

const productModal = document.getElementById("productModal");
const popupTitle = document.getElementById("popupTitle");
const popupPrice = document.getElementById("popupPrice");
const popupMaterial = document.getElementById("popupMaterial");
const popupDesc = document.getElementById("popupDesc");
let productSwiper;

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", e => {
    // Prevent clicks on the add-to-cart button from triggering navigation
    if (e.target.classList.contains("buy-btn")) return;

    const productId = card.dataset.id;
    window.location.href = `product.html?id=${productId}`; 
  });
});

function closeProductModal() {
  productModal.style.display = "none";
}

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    closeProductModal();
  });
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeProductModal();
});
