// ============================================
// LAYOUTS.JS
// ============================================
import { getLayouts } from './storage.js';
import { initScrollAnimations } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  renderLayouts();
  initFilters();
  initModal();
});

// =====================
// RENDER LAYOUTS
// =====================
function renderLayouts(filtered = null) {
  const grid = document.getElementById('layouts-grid');
  if (!grid) return;

  const layouts = filtered !== null ? filtered : getLayouts();

  if (!layouts.length) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div class="no-results-icon">🏗️</div>
        <p>No layouts found matching your criteria.</p>
      </div>`;
    return;
  }

  grid.innerHTML = layouts.map((l, i) => `
    <div class="layout-card anim-fade-up delay-${(i % 4) + 1}" onclick="openLayoutModal(${l.id})">
      <div class="layout-img">
        <img src="${l.image}" alt="${l.name}" loading="lazy">
        <span class="project-status status-${l.status}">${statusLabel(l.status)}</span>
      </div>
      <div class="layout-body">
        <h3 class="layout-name">${l.name}</h3>
        <p class="layout-location">📍 ${l.location}</p>
        <div class="layout-info-row">
          <div class="layout-info-item">
            <span class="layout-info-label">Total Area</span>
            <span class="layout-info-val">${l.totalArea}</span>
          </div>
          <div class="layout-info-item">
            <span class="layout-info-label">Available</span>
            <span class="layout-info-val">${l.availablePlots} Plots</span>
          </div>
        </div>
        <p style="font-size:0.82rem;color:var(--gray-mid);margin-bottom:1rem;line-height:1.6;">${l.description}</p>
        <div class="layout-footer">
          <span class="layout-price">${l.pricePerSqYd}/Sq Yd</span>
          <button class="btn-ghost" onclick="openLayoutModal(${l.id});event.stopPropagation()">
            View Details ›
          </button>
        </div>
      </div>
    </div>
  `).join('');

  initScrollAnimations();
}

function statusLabel(s) {
  const map = { available: 'Available', limited: 'Limited', soldout: 'Sold Out', upcoming: 'Upcoming' };
  return map[s] || s;
}

// =====================
// FILTER & SEARCH
// =====================
function initFilters() {
  const searchInput = document.getElementById('layout-search');
  const statusFilter = document.getElementById('status-filter');
  const priceFilter = document.getElementById('price-filter');
  const clearBtn = document.getElementById('filter-clear');

  function applyFilters() {
    let layouts = getLayouts();
    const search = searchInput?.value.toLowerCase().trim();
    const status = statusFilter?.value;
    const price = priceFilter?.value;

    if (search) {
      layouts = layouts.filter(l =>
        l.name.toLowerCase().includes(search) ||
        l.location.toLowerCase().includes(search)
      );
    }

    if (status && status !== 'all') {
      layouts = layouts.filter(l => l.status === status);
    }

    if (price) {
      layouts = layouts.filter(l => {
        const val = parseInt(l.pricePerSqYd.replace(/[^0-9]/g, ''));
        if (price === 'under15') return val < 15000;
        if (price === '15to20') return val >= 15000 && val <= 20000;
        if (price === 'over20') return val > 20000;
        return true;
      });
    }

    renderLayouts(layouts);
  }

  searchInput?.addEventListener('input', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
  priceFilter?.addEventListener('change', applyFilters);

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'all';
    if (priceFilter) priceFilter.value = '';
    renderLayouts();
  });
}

// =====================
// LAYOUT MODAL
// =====================
let modalOverlay, currentLayout = null;

function initModal() {
  modalOverlay = document.getElementById('layout-modal');
  if (!modalOverlay) return;

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeLayoutModal();
  });

  document.getElementById('modal-close')?.addEventListener('click', closeLayoutModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLayoutModal();
  });
}

window.openLayoutModal = function(id) {
  const layout = getLayouts().find(l => l.id === parseInt(id));
  if (!layout || !modalOverlay) return;
  currentLayout = layout;

  document.getElementById('modal-title').textContent = layout.name;

  // Images
  const mainImg = document.getElementById('modal-main-img');
  const secImgs = document.querySelectorAll('.modal-img-secondary img');
  if (mainImg) mainImg.src = layout.image;
  if (secImgs.length) {
    secImgs.forEach(img => img.src = layout.image);
  }

  // Details
  const detailsEl = document.getElementById('modal-details');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="modal-details-grid">
        <div class="modal-detail-group">
          <h4>Infrastructure</h4>
          <ul class="modal-detail-list">
            <li>Roads: ${layout.roads || 'BT Roads'}</li>
            <li>Water: ${layout.water || 'Borewell + HMWSSB'}</li>
            <li>Electricity: ${layout.electricity || 'TS Transco'}</li>
            <li>Total Area: ${layout.totalArea}</li>
            <li>Available Plots: ${layout.availablePlots} / ${layout.totalPlots}</li>
          </ul>
        </div>
        <div class="modal-detail-group">
          <h4>Plot Sizes</h4>
          <ul class="modal-detail-list">
            ${(layout.plotSizes || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-detail-group">
          <h4>Amenities</h4>
          <ul class="modal-detail-list">
            ${(layout.amenities || []).map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-detail-group">
          <h4>Nearby Locations</h4>
          <ul class="modal-detail-list">
            ${(layout.nearby || []).map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;">
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:1rem 1.5rem;flex:1;min-width:140px;">
          <div style="font-size:0.7rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.3rem;">Price</div>
          <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--gold)">${layout.pricePerSqYd}</div>
          <div style="font-size:0.7rem;color:var(--gray-mid)">per Sq Yard</div>
        </div>
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:1rem 1.5rem;flex:1;min-width:140px;">
          <div style="font-size:0.7rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.3rem;">Status</div>
          <span class="project-status status-${layout.status}">${statusLabel(layout.status)}</span>
        </div>
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:1rem 1.5rem;flex:1;min-width:140px;">
          <div style="font-size:0.7rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.3rem;">Location</div>
          <div style="font-size:0.9rem;">📍 ${layout.location}</div>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;">
        <a href="contact.html" class="btn-primary" style="flex:1;text-align:center;min-width:160px;">Enquire Now</a>
        ${layout.mapsLink ? `<a href="${layout.mapsLink}" target="_blank" class="btn-outline" style="flex:1;text-align:center;min-width:160px;">View on Maps</a>` : ''}
      </div>
    `;
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

function closeLayoutModal() {
  modalOverlay?.classList.remove('active');
  document.body.style.overflow = '';
  currentLayout = null;
}
