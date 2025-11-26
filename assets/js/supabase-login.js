// supabase-login.js
import { supabaseClient } from './supabase-config.js';
import { loadCart } from './supabase-cart.js';
import {initCartUI } from './supabase-cart.js';

let currentUser = null;

// DOM elements
const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");
const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");
const signinNavItem = document.getElementById("signinNavItem");
const navbarProfile = document.getElementById("navbarProfile");
const navbarUsername = document.getElementById("navbarUsername");
const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
const profileUsername = document.getElementById("profileUsername");
const logoutBtn = document.getElementById("logoutBtn");
const closeButtons = document.querySelectorAll(".close");

const loginBtn = document.getElementById("authButtonLogIn");
const signUpBtn = document.getElementById("authButtonSignUp");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// ----------------- MODAL HELPERS -----------------
function openModal(modal) { modal.style.display = "flex"; }
function closeModal(modal) { modal.style.display = "none"; signupForm.reset(); loginForm.reset(); }

closeButtons.forEach(btn => btn.addEventListener("click", () => {
  closeModal(loginModal);
  closeModal(signupModal);
}));

loginBtn.addEventListener("click", () => openModal(loginModal));
signUpBtn.addEventListener("click", () => openModal(signupModal));

signupLink.addEventListener("click", e => { e.preventDefault(); closeModal(loginModal); openModal(signupModal); });
loginLink.addEventListener("click", e => { e.preventDefault(); closeModal(signupModal); openModal(loginModal); });

// Toggle password visibility
document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const icon = button.querySelector("ion-icon");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.setAttribute("name", isHidden ? "eye-off-outline" : "eye-outline");
  });
});

// ----------------- SIGNUP -----------------
signupForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });
  if (error) return alert(error.message);

  // Auto-login
  const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (signInError) return alert(signInError.message);

  await refreshUser();
  closeModal(signupModal);
});

// ----------------- LOGIN -----------------
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { error, data } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  currentUser = data.user;
  await refreshUser();
  await loadCart();
  location.reload();
  closeModal(loginModal);
});

// ----------------- LOGOUT -----------------
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  currentUser = null;
  showLoggedOutState();
  await loadCart();
  
});

// ----------------- PROFILE MENU -----------------
profileButton.addEventListener("click", e => {
  e.stopPropagation();
  profileMenu.classList.toggle("show");
});
window.addEventListener("click", e => {
  if (!profileButton.contains(e.target)) profileMenu.classList.remove("show");
});

// ----------------- SESSION & UI -----------------
export async function refreshUser() {
  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user || currentUser || null;

  currentUser = user;

  if (user) {
    const username = user.user_metadata?.username || user.email.split("@")[0];
    profileUsername.textContent = username;
    navbarUsername.textContent = username;
    signinNavItem.style.display = "none";
    navbarProfile.style.display = "flex";
  } else {
    showLoggedOutState();
  }

  return user;
}

function showLoggedOutState() {
  navbarProfile.style.display = "none";
  signinNavItem.style.display = "block";
}

// Escape closes modals
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(loginModal);
    closeModal(signupModal);
  }
});

// ----------------- INITIAL SESSION CHECK -----------------
refreshUser();
