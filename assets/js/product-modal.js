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

document.querySelectorAll(".product-card").forEach((card, i) => {
  card.addEventListener("click", () => {
    const p = productsData[i];

    popupTitle.textContent = p.title;
    popupPrice.textContent = p.price;
    popupMaterial.textContent = p.material;
    popupDesc.textContent = p.desc;

    productModal.style.display = "flex";

    const wrapper = productModal.querySelector(".productSwiper .swiper-wrapper");
    wrapper.innerHTML = "";
    p.images.forEach(img => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${img}" alt="${p.title}">`;
      wrapper.appendChild(slide);
    });

      // Prevent buy button from opening modal
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation(); // 🔒 stop click from reaching the product card
      const card = e.target.closest(".product-card");
      const id = card.dataset.id;
      addToCart(id); // Replace with your real add-to-cart logic
    });
  });

    if (productSwiper) productSwiper.destroy(true, true);

    productSwiper = new Swiper('.productSwiper', {
      slidesPerView: 1,
      loop: true,
      centeredSlides: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      autoHeight: true,
    });
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
