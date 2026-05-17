const API_URL = "https://campus-lost-and-found-r8vm.onrender.com/api/items";
const itemsContainer = document.getElementById("items-container");
const toggleBtn = document.getElementById("toggle-form-btn");
const formSection = document.getElementById("form-section");
const itemForm = document.getElementById("item-form");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

// --- AUTHENTICATION & PROFILE CONTEXT ROLES ---
const USER_TOKEN = localStorage.getItem('token');
const CURRENT_USER_ID = localStorage.getItem('userId');
const CURRENT_USER_ROLE = localStorage.getItem('userRole');

if (!USER_TOKEN) {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear(); // Safe clean wipe
      window.location.href = "login.html";
    });
}

// Toggle form visibility
toggleBtn.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
});

// Real-Time Indexed Search Triggers
searchInput.addEventListener("input", () => handleSearchAndFilter());
categoryFilter.addEventListener("change", () => handleSearchAndFilter());

async function handleSearchAndFilter() {
    const queryStr = searchInput.value.trim();
    const activeCategory = categoryFilter.value;
    
    // Construct Search Query String URLs dynamically
    let endpointUrl = API_URL;
    if (queryStr || activeCategory) {
        endpointUrl = `${API_URL}/search?`;
        if (queryStr) endpointUrl += `q=${encodeURIComponent(queryStr)}&`;
        if (activeCategory) endpointUrl += `category=${encodeURIComponent(activeCategory)}`;
    }
    
    try {
        const response = await fetch(endpointUrl);
        const filteredItems = await response.json();
        displayItems(filteredItems);
    } catch (error) {
        console.error("Filtering engine breakdown:", error);
    }
}

// Handle form submission
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(itemForm);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
      body: formData
    });

    if (response.ok) {
      alert("Item reported successfully!");
      itemForm.reset();
      formSection.classList.add("hidden");
      fetchItems();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Submission failed:", error);
  }
});

async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    const items = await response.json();
    displayItems(items);
  } catch (error) {
    itemsContainer.innerHTML = '<div class="loading">Error loading system records.</div>';
  }
}

// Actions Execution Core Logics
async function updateStatusToClaimed(itemId) {
    if (!confirm("Are you sure this item has been resolved and claimed?")) return;
    try {
        const response = await fetch(`${API_URL}/${itemId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${USER_TOKEN}`
            },
            body: JSON.stringify({ status: 'claimed' })
        });
        if (response.ok) { alert("Status tracking updated to CLAIMED."); fetchItems(); }
    } catch (err) { console.error(err); }
}

async function executeDeletion(itemId) {
    if (!confirm("CRITICAL: Delete this report permanently from system logs?")) return;
    try {
        const response = await fetch(`${API_URL}/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${USER_TOKEN}` }
        });
        if (response.ok) { alert("Report expunged successfully."); fetchItems(); }
    } catch (err) { console.error(err); }
}

function displayItems(items) {
  if (items.length === 0) {
    itemsContainer.innerHTML = '<div class="loading">No matching items found.</div>';
    return;
  }
  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

    let imageSection = item.imageUrl ? `
        <div class="item-image-container">
            <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
        </div>
    ` : '';

    // DYNAMIC CONDITIONAL BUTTONS GENERATION
    // Determine ownership: checks database identifier string against cached local token user context ID
    const isOwner = item.postedBy && (item.postedBy._id === CURRENT_USER_ID || item.postedBy === CURRENT_USER_ID);
    const isAdmin = CURRENT_USER_ROLE === 'admin';

    let actionsControlPanel = "";
    if ((isOwner || isAdmin) && item.status !== 'claimed') {
        actionsControlPanel = `
            <div class="card-actions">
                <button class="action-btn claim-btn" onclick="updateStatusToClaimed('${item._id}')">✓ Mark Claimed</button>
                <button class="action-btn delete-btn" onclick="executeDeletion('${item._id}')">🗑 Delete</button>
            </div>
        `;
    }

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
                    <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${item.location}</span></div>
                    <div class="detail-row"><span class="detail-label">Category:</span><span class="detail-value">${item.category}</span></div>
                </div>
                <p class="item-description">${item.description}</p>
                ${actionsControlPanel}
            </div>
        `;
    itemsContainer.appendChild(card);
  });
}

fetchItems();