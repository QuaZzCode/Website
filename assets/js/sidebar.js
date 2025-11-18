const menuArrow = document.getElementById("menuArrow");
const sideMenu = document.getElementById("sideMenu");

function toggleMenu() {
  sideMenu.classList.toggle("show");
  menuArrow.classList.toggle("open");
}

menuArrow.addEventListener("click", toggleMenu);



// -------- CATEGORY FILTERING --------

const categoryItems = sideMenu.querySelectorAll("li");
const productCards = document.querySelectorAll(".product-card");

// Highlight selected category
function selectCategory(el) {
  categoryItems.forEach(i => i.classList.remove("active"));
  el.classList.add("active");
}

function filterProducts(category) {
  productCards.forEach(card => {
    const cardCategory = card.dataset.category;

    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Make menu items clickable
categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    const category = item.dataset.category;
    selectCategory(item);
    filterProducts(category);
  });
});

// -------- DEFAULT: FIRST CATEGORY OPEN --------

window.addEventListener("DOMContentLoaded", () => {
  const first = categoryItems[0];
  if (first) {
    selectCategory(first);
    filterProducts(first.dataset.category);
  }
});
