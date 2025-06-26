// Define page routes: external HTML snippets
const pageRoutes = {
  home: 'start.html',
  about: 'aboutme.html',
  contact: 'gallery.html'  // key matches data-route="contact"
};

let cachedGalleryHTML = '';
let lightbox, lbImg, prevBtn, nextBtn, closeBtn;
let currentIdx = 0;

// Build static gallery markup once
function buildGalleryContent() {
  const totalImages = 37;
  const images = Array.from({ length: totalImages }, (_, i) => `/gallery/img${i + 1}.jpg`);

  // Gallery grid
  let html = '<div id="gallery" class="gallery-grid">';
  images.forEach(src => {
    html += `<img src="${src}" class="gallery-img" alt="Gallery Image" />`;
  });
  html += '</div>';
  return html;
}

// Setup lightbox once
function setupLightbox() {
  lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';

  lbImg = document.createElement('img');
  lbImg.id = 'lightbox-img';

  prevBtn = document.createElement('button');
  prevBtn.id = 'lightbox-prev';
  prevBtn.textContent = '‹';

  nextBtn = document.createElement('button');
  nextBtn.id = 'lightbox-next';
  nextBtn.textContent = '›';

  closeBtn = document.createElement('button');
  closeBtn.id = 'lightbox-close';
  closeBtn.textContent = '✕';

  lightbox.append(prevBtn, lbImg, nextBtn, closeBtn);
  document.body.appendChild(lightbox);

  prevBtn.addEventListener('click', () => showImage(currentIdx - 1));
  nextBtn.addEventListener('click', () => showImage(currentIdx + 1));
  closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none'; });
  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowRight') showImage(currentIdx + 1);
      if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
      if (e.key === 'Escape') lightbox.style.display = 'none';
    }
  });
}

// Show image in lightbox
function showImage(idx) {
  const imgs = document.querySelectorAll('#gallery img');
  const total = imgs.length;
  currentIdx = (idx + total) % total;
  lbImg.src = imgs[currentIdx].src;
  lightbox.style.display = 'flex';
}

// Inject gallery and wire thumbnails
function renderGallery() {
  const content = document.getElementById('content');
  content.innerHTML = cachedGalleryHTML;
  const thumbs = document.querySelectorAll('#gallery img');
  thumbs.forEach((img, i) => img.addEventListener('click', () => showImage(i)));
}

// Initial setup: build HTML and lightbox
cachedGalleryHTML = buildGalleryContent();
setupLightbox();

// Navigation
function navigateTo(routeName) {
  const content = document.getElementById('content');
  if (routeName === 'contact') return renderGallery();

  const path = pageRoutes[routeName];
  if (!path) {
    content.innerHTML = '<h1>404 – Sidan hittades inte</h1>';
    return;
  }
  fetch(`${path}?t=${Date.now()}`)
    .then(res => res.ok ? res.text() : Promise.reject(res.statusText))
    .then(html => content.innerHTML = html)
    .catch(err => content.innerHTML = `<h1>Kunde inte ladda sidan</h1><p>${err}</p>`);
}

document.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    navigateTo(link.dataset.route);
  })
);

document.addEventListener('DOMContentLoaded', () => navigateTo('home'));