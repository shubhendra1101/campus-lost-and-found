const API_URL = "https://campus-lost-and-found-r8vm.onrender.com/api/items";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");

// Toggle between Login and Register views
showRegisterBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

showLoginBtn.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Inside your loginForm.addEventListener
  const email = document.getElementById("login-email").value.trim(); // <-- Add .trim()
  const password = document.getElementById("login-password").value;
  console.log("SENDING TO BACKEND:", { email, password });

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token to browser and redirect to dashboard
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Failed to connect to server");
  }
});

// Handle Registration
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please log in.");
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Failed to connect to server");
  }
});
