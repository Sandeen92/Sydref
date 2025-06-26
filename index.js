// index.js

const pageRoutes = {
  home:    'start.html',
  about:   'aboutme.html',
  contact: 'gallery.html'
};

document.addEventListener('DOMContentLoaded', () => {
  setupNavLinks();
  navigateTo('home');
});

function setupNavLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      navigateTo(link.dataset.route);
    });
  });
}

function navigateTo(routeName) {
  const content = document.getElementById('content');
  const path = pageRoutes[routeName];
  if (!path) {
    content.innerHTML = '<h1>404 – Sidan hittades inte</h1>';
    return;
  }

  fetch(`${path}?t=${Date.now()}`)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then(html => {
      content.innerHTML = html;

      if (routeName === 'contact') {
        // gallery.html has been injected, now wire up the lightbox
        initGallery();
      }
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h1>404 – Sidan hittades inte</h1><p>${err.message}</p>`;
    });
}

// Called every time you load the gallery route
function initGallery() {
  const thumbs   = Array.from(document.querySelectorAll('#gallery .gallery-img'));
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const btnPrev  = document.getElementById('lightbox-prev');
  const btnNext  = document.getElementById('lightbox-next');
  const btnClose = document.getElementById('lightbox-close');

  let currentIndex = 0;

  function openLightbox(idx) {
    currentIndex = idx;
    lbImg.src = thumbs[idx].src;
    lightbox.style.display = 'flex';
    document.addEventListener('keydown', onKey);
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.removeEventListener('keydown', onKey);
  }

  function showNext() {
    openLightbox((currentIndex + 1) % thumbs.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + thumbs.length) % thumbs.length);
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'Escape')     closeLightbox();
  }

  // detach old handlers (if any) to prevent duplicates
  thumbs.forEach(img => {
    img.replaceWith(img.cloneNode(true));
  });

  // re-query fresh thumbs
  const freshThumbs = Array.from(document.querySelectorAll('#gallery .gallery-img'));

  freshThumbs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });
  btnNext.addEventListener('click',   showNext);
  btnPrev.addEventListener('click',   showPrev);
  btnClose.addEventListener('click',  closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}