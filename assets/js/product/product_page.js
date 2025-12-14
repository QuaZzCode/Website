window.onload = () => {
    const productId = localStorage.getItem("selectedProduct") || "keychain1";
    loadProduct(productId);
};

/* ---------------------------------------------------------
   APPLY OR REMOVE A LAYER BY CLICKING AN OPTION DIRECTLY
--------------------------------------------------------- */

function setLayer(layerId, imagePath, element, category) {
    const layer = document.getElementById(layerId);
    const options = document.getElementById(category + "-options");

    const isAlreadyActive = element.classList.contains("active");

    // If clicked option is already active → deactivate it
    if (isAlreadyActive) {
        element.classList.remove("active");
        layer.style.display = "none";
        return;
    }

    // Otherwise activate the layer
    layer.src = imagePath;
    layer.style.display = "block";

    // Remove active from others in that group
    options.querySelectorAll(".icon, .color-square")
           .forEach(e => e.classList.remove("active"));

    // Highlight newly selected option
    element.classList.add("active");
}



let currentProduct = null;

/* ---------------------------------------------------------
   Load product and reset UI
--------------------------------------------------------- */

function loadProduct(productId) {
    currentProduct = PRODUCTS[productId];

    // Update product info
    document.getElementById("p-name").innerText = currentProduct.name;
    document.getElementById("p-material").innerText = currentProduct.material;
    document.getElementById("p-price").innerText = currentProduct.basePrice + " kr";

    // Base layer
    document.getElementById("base-layer").src = currentProduct.base;

    // Reset layers
    document.getElementById("stitching-layer").style.display = "none";
    document.getElementById("button-layer").style.display = "none";
    document.getElementById("shape-layer").style.display = "none";

    // Reset option highlights
    document.querySelectorAll(".color-square, .icon")
        .forEach(i => i.classList.remove("active"));
}


/* ---------------------------------------------------------
   Called when clicking a product card
--------------------------------------------------------- */

function openProduct(productId) {
    localStorage.setItem("selectedProduct", productId);
    window.location.href = "product_page.html";
}
