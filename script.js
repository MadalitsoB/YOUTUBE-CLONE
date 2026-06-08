// ===== SIDEBAR TOGGLE (Mobile) =====
const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Close sidebar when clicking on main content
document.querySelector(".main-content").addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active");
  }
});

// ===== SEARCH FUNCTIONALITY =====
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const videoCards = document.querySelectorAll(".video-card");

function filterVideos(query) {
  const lowerQuery = query.toLowerCase();
  videoCards.forEach((card) => {
    const title = card.querySelector(".video-title").textContent.toLowerCase();
    const channel = card
      .querySelector(".video-channel")
      .textContent.toLowerCase();

    if (title.includes(lowerQuery) || channel.includes(lowerQuery)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

searchBar.addEventListener("keyup", (e) => {
  filterVideos(e.target.value);
});

searchBtn.addEventListener("click", () => {
  filterVideos(searchBar.value);
});

// ===== FILTER BUTTON FUNCTIONALITY =====
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    // Optional: Filter videos by category
    const category = btn.textContent.trim();
    console.log("Selected category:", category);
  });
});

// ===== DARK MODE / LIGHT MODE TOGGLE =====
function initDarkMode() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.querySelector(".theme-toggle");
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

// Call on page load
initDarkMode();

// ===== VIDEO CARD HOVER PREVIEW =====
function initVideoPreview() {
  videoCards.forEach((card) => {
    // Create preview overlay
    const preview = document.createElement("div");
    preview.className = "video-preview-overlay";

    const title = card.querySelector(".video-title").textContent;
    const channel = card.querySelector(".video-channel").textContent;

    preview.innerHTML = `
      <div class="preview-title">${title}</div>
      <div class="preview-channel">${channel}</div>
      <div class="preview-actions">
        <button class="preview-btn">▶ Play</button>
        <button class="preview-btn">➕ Add</button>
      </div>
    `;

    card.querySelector(".video-thumbnail").appendChild(preview);
  });
}

initVideoPreview();

// ===== VIDEO MODAL FUNCTIONALITY =====
const videoModal = document.getElementById("videoModal");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");

function openVideoModal(card) {
  const title = card.querySelector(".video-title").textContent;
  const channel = card.querySelector(".video-channel").textContent;
  const stats = card.querySelector(".video-stats").textContent;
  const thumbnail = card
    .querySelector(".video-thumbnail img")
    .getAttribute("src");

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalChannel").textContent = channel;
  document.getElementById("modalStats").textContent = stats;
  document.getElementById("modalThumbnail").setAttribute("src", thumbnail);

  videoModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  videoModal.classList.remove("active");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeVideoModal);
modalOverlay.addEventListener("click", closeVideoModal);

// Close modal on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoModal.classList.contains("active")) {
    closeVideoModal();
  }
});

// Update video card click to open modal
videoCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    openVideoModal(card);
  });
});

// ===== RESPONSIVE SIDEBAR =====
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("active");
  }
});
