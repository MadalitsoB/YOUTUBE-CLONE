// ===== SIDEBAR TOGGLE (Mobile) =====
const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

// Close sidebar when clicking on main content
const mainContent = document.querySelector(".main-content");
if (mainContent) {
  mainContent.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
    }
  });
}

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

if (searchBar) {
  searchBar.addEventListener("keyup", (e) => {
    filterVideos(e.target.value);
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    filterVideos(searchBar ? searchBar.value : "");
  });
}

// ===== FILTER BUTTON FUNCTIONALITY =====
const filterBtns = document.querySelectorAll(".filter-btn");

if (filterBtns && filterBtns.length > 0) {
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
}

// ===== DARK MODE / LIGHT MODE TOGGLE =====
function initDarkMode() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.body.setAttribute("data-theme", savedTheme);
}

const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

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

try {
  initVideoPreview();
} catch (e) {
  console.error("Error initializing video preview:", e);
}

// ===== VIDEO MODAL FUNCTIONALITY =====
const videoModal = document.getElementById("videoModal");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");
const modalThumbnail = document.getElementById("modalThumbnail");
const modalVideo = document.getElementById("modalVideo");
const modalIframe = document.getElementById("modalIframe");
const modalPlayBtn = document.querySelector(".modal-play-btn");
let currentVideoCard = null;

function parseYouTubeId(url) {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getVideoSource(card) {
  if (!card) return null;
  if (card.dataset.videoSrc) {
    const source = card.dataset.videoSrc;
    const youtubeId = parseYouTubeId(source);
    if (youtubeId) {
      return { type: "youtube", id: youtubeId };
    }
    return { type: "video", src: source };
  }

  if (card.dataset.videoId) {
    return { type: "youtube", id: card.dataset.videoId };
  }

  const thumbnailSrc = card
    .querySelector(".video-thumbnail img")
    .getAttribute("src");
  const youtubeId = parseYouTubeId(thumbnailSrc);
  if (youtubeId) {
    return { type: "youtube", id: youtubeId };
  }

  if (thumbnailSrc.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: "video", src: thumbnailSrc };
  }

  return null;
}

function openVideoModal(card) {
  currentVideoCard = card;
  const title = card.querySelector(".video-title").textContent;
  const channel = card.querySelector(".video-channel").textContent;
  const stats = card.querySelector(".video-stats").textContent;
  const thumbnail = card
    .querySelector(".video-thumbnail img")
    .getAttribute("src");
  const source = getVideoSource(card);

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalChannel").textContent = channel;
  document.getElementById("modalStats").textContent = stats;
  modalThumbnail.setAttribute("src", thumbnail);
  modalThumbnail.style.display = "block";
  modalPlayBtn.style.display = "flex";
  modalVideo.style.display = "none";
  modalIframe.style.display = "none";
  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideo.removeAttribute("src");
  modalIframe.removeAttribute("src");

  if (source?.type === "video") {
    modalVideo.src = source.src;
  }

  videoModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  videoModal.classList.remove("active");
  document.body.style.overflow = "";
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.style.display = "none";
    modalVideo.removeAttribute("src");
  }
  if (modalIframe) {
    modalIframe.style.display = "none";
    modalIframe.removeAttribute("src");
  }
  if (modalThumbnail) {
    modalThumbnail.style.display = "block";
  }
}

modalClose.addEventListener("click", closeVideoModal);
modalOverlay.addEventListener("click", closeVideoModal);

modalPlayBtn.addEventListener("click", () => {
  if (!currentVideoCard) return;
  const source = getVideoSource(currentVideoCard);
  modalThumbnail.style.display = "none";

  if (source?.type === "youtube") {
    modalIframe.src = `https://www.youtube.com/embed/${source.id}?autoplay=1&mute=1&rel=0&playsinline=1`;
    modalIframe.style.display = "block";
  } else if (source?.type === "video") {
    modalVideo.style.display = "block";
    modalVideo.muted = true;
    modalVideo.controls = true;
    modalVideo.play();
  } else {
    modalVideo.src = "https://www.w3schools.com/html/mov_bbb.mp4";
    modalVideo.style.display = "block";
    modalVideo.muted = true;
    modalVideo.controls = true;
    modalVideo.play();
  }

  modalPlayBtn.style.display = "none";
});

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
