// ============================================
// GALLERY.JS
// ============================================
import { getGallery } from './storage.js';
import { initScrollAnimations } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  initGalleryFilters();
  initLightbox();
});

let currentFilter = 'all';

function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let items = getGallery();
  if (filter !== 'all') items = items.filter(g => g.category === filter);

  if (!items.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🖼️</div>
        <p>No gallery items found.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map((item, i) => `
    <div class="masonry-item anim-zoom-in delay-${(i % 4) + 1}"
         data-id="${item.id}"
         data-src="${item.image}"
         data-title="${item.title}"
         onclick="openLightbox('${item.image}', '${item.title}')">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="masonry-item-overlay">
        <span class="masonry-item-title">${item.title}</span>
      </div>
    </div>
  `).join('');

  initScrollAnimations();
}

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderGallery(currentFilter);
    });
  });
}

// =====================
// LIGHTBOX
// =====================
let lightbox, lightboxImg;

function initLightbox() {
  lightbox = document.getElementById('lightbox');
  lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

window.openLightbox = function(src, title) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = title || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
  if (lightboxImg) {
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }
}
