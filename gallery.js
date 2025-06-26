// gallery.js

(function() {
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

  // Wire up everything
  thumbs.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);
  btnClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
})();