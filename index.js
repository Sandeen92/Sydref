// Define routes: external HTML snippets (located in the "route/" folder)
const routes = {
  home: 'start.html',
  about: 'aboutme.html',
  contact: 'gallery.html'
};

function populateGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  const totalImages = 38;
  const images = [];
  for (let i = 1; i <= totalImages; i++) {
    images.push(`/gallery/img${i}.jpg`);
  }

  // Grid styling
  gallery.style.display = 'grid';
  gallery.style.gridTemplateColumns = 'repeat(4, 1fr)';
  gallery.style.gap = '10px';

  // Lightbox setup (create elements once)
  let currentIndex = 0;
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);z-index:1000;';
  const lbImg = document.createElement('img');
  lbImg.style.maxWidth = '90%';
  lbImg.style.maxHeight = '90%';
  const prev = document.createElement('button');
  prev.textContent = '‹';
  prev.style.cssText = 'position:absolute;left:20px;top:50%;transform:translateY(-50%);';
  const next = document.createElement('button');
  next.textContent = '›';
  next.style.cssText = 'position:absolute;right:20px;top:50%;transform:translateY(-50%);';
  const close = document.createElement('button');
  close.textContent = '✕';
  close.style.cssText = 'position:absolute;top:20px;right:20px;';
  lightbox.append(prev, lbImg, next, close);
  document.body.appendChild(lightbox);

  function openLB(idx) {
    currentIndex = idx;
    lbImg.src = images[idx];
    lightbox.style.display = 'flex';
    document.addEventListener('keydown', onKey);
  }
  function closeLB() {
    lightbox.style.display = 'none';
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'Escape') closeLB();
  }
  function goNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src = images[currentIndex];
  }
  function goPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src = images[currentIndex];
  }
  prev.addEventListener('click', goPrev);
  next.addEventListener('click', goNext);
  close.addEventListener('click', closeLB);
  lightbox.addEventListener('click', e => e.target === lightbox && closeLB());

  // Populate thumbnails
  images.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Image ${idx+1}`;
    img.style.width = '100%';
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLB(idx));
    gallery.appendChild(img);
  });
}

function loadRoute(name) {
  const content = document.getElementById('content');
  const path = routes[name];
  if (!path) {
    content.innerHTML = '<h1>404 – Sidan hittades inte</h1>';
    return;
  }

  // Add cache-busting query string
  const fetchPath = `${path}?t=${Date.now()}`;

  fetch(fetchPath)
    .then(res => {
      if (!res.ok) throw new Error(`Could not fetch ${path} (status: ${res.status})`);
      return res.text();
    })
    .then(html => {
      content.innerHTML = html;

      if (path === 'gallery.html') {
        populateGallery();
      }
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h1>Kunde inte ladda sidan</h1><p>${err.message}</p>`;
    });
}

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    loadRoute(link.dataset.route);
  });
});

// Initial
loadRoute('home');