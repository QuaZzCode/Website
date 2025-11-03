const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

    const swiper = new Swiper('.swiper', {
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: -40, // negative makes them overlap like a curve
      loop: true,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });




// Example product data
const productsData = [
  {
    title: "Leather Keychain",
    images: [
      "images/pictures/image1.png",
      "images/pictures/image2.png",
      "images/pictures/image3.png"
    ],
    price: "149 kr",
    material: "Materail: Genuine leather",
    desc: "Handmade keychain, durable and stylish."
  },
  {
    title: "Wooden Bracelet",
    images: [
      "images/pictures/image1.png",
      "images/pictures/image2.png",
      "images/pictures/image3.png"
    ],
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

    // Fill info
    popupTitle.textContent = p.title;
    popupPrice.textContent = p.price;
    popupMaterial.textContent = p.material;
    popupDesc.textContent = p.desc;

    productModal.style.display = "flex";

    // Fill slides
    const wrapper = productModal.querySelector(".productSwiper .swiper-wrapper");
    wrapper.innerHTML = ""; // clean old slides
    p.images.forEach(img => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${img}" alt="${p.title}">`;
      wrapper.appendChild(slide);
    });

    // Destroy old Swiper
    if (productSwiper) productSwiper.destroy(true, true);

    // Init new Swiper
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

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
      closeProductModal();
    }
  });








