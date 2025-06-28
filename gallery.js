// gallery.js

// Hard‑coded mapping from category name → image paths
const categories = {
  "Härdning": [
    "Härdning/hard1.jpg",
    "Härdning/hard2.jpg",
    "Härdning/hard3.jpg"
  ],
  "Kremation": [
    "Kremation/krem1.jpg",
    "Kremation/krem2.jpg",
    "Kremation/krem3.jpg",
    "Kremation/krem4.jpg",
    "Kremation/krem5.jpg",
    "Kremation/krem6.jpg",
    "Kremation/krem7.jpg",
    "Kremation/krem8.jpg",
    "Kremation/krem9.jpg"
  ],
  "Övrigt": [
    "Övrigt/ovr1.jpg",
    "Övrigt/ovr2.jpg",
    "Övrigt/ovr3.jpg",
    "Övrigt/ovr4.jpg",
    "Övrigt/ovr5.jpg",
    "Övrigt/ovr6.jpg"
  ],
  "Verkstad": [
    "Verkstad/verk1.jpg",
    "Verkstad/verk2.jpg",
    "Verkstad/verk3.jpg",
    "Verkstad/verk4.jpg",
    "Verkstad/verk5.jpg",
    "Verkstad/verk6.jpg",
    "Verkstad/verk7.jpg"
  ]
};

let thumbs = [];
let currentIndex = 0;

/**
 * Call this once your gallery.html is injected into #content.
 */
function initGallery() {
  const galleryEl = document.getElementById("gallery");
  const titleEl   = document.getElementById("gallery-title");
  const backBtn   = document.getElementById("backBtn");
  const lightbox  = document.getElementById("lightbox");
  const lbImg     = document.getElementById("lightbox-img");
  const btnPrev   = document.getElementById("lightbox-prev");
  const btnNext   = document.getElementById("lightbox-next");
  const btnClose  = document.getElementById("lightbox-close");

  // Render top‐level categories
  renderCategories();

  backBtn.addEventListener("click", () => renderCategories());
  setupLightbox();

  function renderCategories() {
    titleEl.textContent   = "Välj kategori";
    backBtn.style.display = "none";
    galleryEl.className   = "gallery-grid category-grid";
    galleryEl.innerHTML   = "";
    thumbs                = [];

    Object.keys(categories).forEach(cat => {
      const card = document.createElement("div");
      card.className  = "category-card";
      card.textContent = cat;
      card.addEventListener("click", () => renderGallery(cat));
      galleryEl.appendChild(card);
    });
  }

  function renderGallery(category) {
    titleEl.textContent   = category;
    backBtn.style.display = "inline-block";
    galleryEl.className   = "gallery-grid";
    galleryEl.innerHTML   = "";
    thumbs                = [];

    categories[category].forEach((relPath, idx) => {
      const src = `/gallery/${relPath}`;
      const img = document.createElement("img");
      img.src       = src;
      img.alt       = `${category} ${idx+1}`;
      img.className = "gallery-img";
      img.addEventListener("click", () => openLightbox(idx));
      galleryEl.appendChild(img);
      thumbs.push(img);
    });
  }

  function setupLightbox() {
    function openLightbox(idx) {
      currentIndex = idx;
      lbImg.src    = thumbs[idx].src;
      lightbox.style.display = "flex";
      document.addEventListener("keydown", onKey);
    }
    function closeLightbox() {
      lightbox.style.display = "none";
      document.removeEventListener("keydown", onKey);
    }
    function showNext() { openLightbox((currentIndex + 1) % thumbs.length); }
    function showPrev() { openLightbox((currentIndex - 1 + thumbs.length) % thumbs.length); }
    function onKey(e) {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft")  showPrev();
      if (e.key === "Escape")     closeLightbox();
    }

    btnPrev.addEventListener("click", showPrev);
    btnNext.addEventListener("click", showNext);
    btnClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }
}

// Make initGallery available to your router
window.initGallery = initGallery;