// -------------------- Supabase Setup --------------------
const SUPABASE_URL = "https://lkwomhjfvrvitvjibdsz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd29taGpmdnJ2aXR2amliZHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzc4MTUsImV4cCI6MjA3NzY1MzgxNX0.ZQNpmFqv0rnlDif4reiQaACe-vZtFH6yjzvqmCQUJKw";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true } // ✅ Keep login between refreshes
});

// === DOM Elements ===
const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");
const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");
const authButton = document.getElementById("authButton");
const closeButtons = document.querySelectorAll(".close");
const navbarProfile = document.getElementById("navbarProfile");
const navbarUsername = document.getElementById("navbarUsername");
const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
const profileUsername = document.getElementById("profileUsername");
const logoutBtn = document.getElementById("logoutBtn");
const signinNavItem = document.getElementById("signinNavItem");

// ensure these are defined near top of file
const loginBtn = document.getElementById("authButtonLogIn");
const signUpBtn = document.getElementById("authButtonSignUp");

// open login modal
loginBtn.addEventListener("click", () => {
  openModal(loginModal);
});

// open signup modal
signUpBtn.addEventListener("click", () => {
  openModal(signupModal);
});



// === Forms ===
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// === Open/Close Modals ===
function openModal(modal) {
  modal.style.display = "flex"; // Flex centers modal
}
function closeModal(modal) {
  modal.style.display = "none";
  clearFormInputs();
}
function clearFormInputs() {
  signupForm.reset();
  loginForm.reset();
}

authButtonLogIn.addEventListener("click", () => openModal(loginModal));
authButtonSignUp.addEventListener("click", () => openModal(signupModal));



closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(loginModal);
    closeModal(signupModal);
  });
});

// === Switch Modals ===
signupLink.addEventListener("click", e => {
  e.preventDefault();
  closeModal(loginModal);
  openModal(signupModal);
});

loginLink.addEventListener("click", e => {
  e.preventDefault();
  closeModal(signupModal);
  openModal(loginModal);
});

// === Toggle Password Visibility ===
document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const icon = button.querySelector("ion-icon");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.setAttribute("name", isHidden ? "eye-off-outline" : "eye-outline");
  });
});

// === SIGN UP ===
signupForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return alert(error.message);

  // Log in immediately after signup
  const { error: signInError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) return alert(signInError.message);

  closeModal(signupModal);
  await checkUser();
});

// === LOG IN ===
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return alert(error.message);

  closeModal(loginModal);
  await checkUser();
});

// === LOG OUT ===
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLoggedOutState();
});

// === PROFILE MENU TOGGLE ===
profileButton.addEventListener("click", e => {
  e.stopPropagation();
  profileMenu.classList.toggle("show");
});
window.addEventListener("click", e => {
  if (!profileButton.contains(e.target)) {
    profileMenu.classList.remove("show");
  }
});

// === CHECK SESSION ===
async function checkUser() {
  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;

  if (user) {
    const username = user.user_metadata?.username || user.email.split("@")[0];
    profileUsername.textContent = username;
    navbarUsername.textContent = username;
    signinNavItem.style.display = "none";
    navbarProfile.style.display = "flex";
  } else {
    showLoggedOutState();
  }
}

function showLoggedOutState() {
  navbarProfile.style.display = "none";
  signinNavItem.style.display = "block";
}

// === INITIAL CHECK ===
checkUser();

// === ESCAPE KEY CLOSE MODALS ===
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(loginModal);
    closeModal(signupModal);
  }
});
