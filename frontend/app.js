const itemsContainer = document.getElementById("items-container");
const API_URL = "https://campus-lost-and-found-r8vm.onrender.com/api/items";

// --- NEW FORM LOGIC ---
const toggleBtn = document.getElementById("toggle-form-btn");
const formSection = document.getElementById("form-section");
const itemForm = document.getElementById("item-form");

// --- AUTHENTICATION CHECK ---
const USER_TOKEN = localStorage.getItem("token");

// If no token exists, kick them back to the login screen
if (!USER_TOKEN) {
  window.location.href = "login.html";
}

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token"); // Destroy the token
  window.location.href = "login.html"; // Send back to login
});
// ----------------------------

// Toggle form visibility
toggleBtn.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
});

// Handle form submission
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the page from reloading

  // FormData automatically captures all inputs and files
  const formData = new FormData(itemForm);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
        // Notice we do NOT set 'Content-Type'.
        // The browser sets it automatically for FormData.
      },
      body: formData,
    });

    if (response.ok) {
      alert("Item reported successfully!");
      itemForm.reset(); // Clear the form
      formSection.classList.add("hidden"); // Hide the form
      fetchItems(); // Refresh the grid to show the new item
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Failed to connect to the server.");
  }
});
// --- END NEW FORM LOGIC ---

async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    const items = await response.json();

    displayItems(items);
  } catch (error) {
    itemsContainer.innerHTML =
      '<div class="loading">Error loading items. Ensure backend is running.</div>';
    console.error("Error fetching items:", error);
  }
}

function displayItems(items) {
  if (items.length === 0) {
    itemsContainer.innerHTML =
      '<div class="loading">No items reported yet.</div>';
    return;
  }

  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    // Format Date
    const dateObj = new Date(item.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Handle Image
    let imageSection = "";
    if (item.imageUrl) {
      imageSection = `
                <div class="item-image-container">
                    <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
                </div>
            `;
    }

    // Build Card HTML
    card.innerHTML = `
            ${imageSection}
            <div class="item-content">
                <div class="card-header">
                    <div>
                        <h3>${item.title}</h3>
                        <span class="item-date">${formattedDate}</span>
                    </div>
                    <span class="badge ${item.status}">${item.status}</span>
                </div>
                
                <div class="item-details">
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${item.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${item.category}</span>
                    </div>
                </div>

                <p class="item-description">${item.description}</p>
            </div>
        `;

    itemsContainer.appendChild(card);
  });
}

fetchItems();
