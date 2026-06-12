// ============================================
// ADMIN.JS - Dashboard Logic
// ============================================
import {
  isAdminLoggedIn, setAdminSession, clearAdminSession,
  getLayouts, saveLayout, deleteLayout,
  getGallery, saveGalleryItem, deleteGalleryItem,
  getCrew, saveCrew, deleteCrew,
  getTestimonials, saveTestimonial, deleteTestimonial,
  getContact, saveContact,
  getStats, saveStats,
  sanitize, initStorage
} from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initStorage();
  const path = window.location.pathname;

  if (path.includes('admin')) {
    if (!isAdminLoggedIn()) {
      showLoginView();
    } else {
      showDashboard();
    }
  }

  initLoginForm();
});

// =====================
// AUTH
// =====================
function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-username')?.value.trim();
    const pass = document.getElementById('admin-password')?.value;
    const errEl = document.getElementById('login-error');

    if (user === 'admin' && pass === 'admin123') {
      setAdminSession({ user, time: Date.now() });
      showDashboard();
    } else {
      if (errEl) {
        errEl.textContent = 'Invalid credentials. Try admin / admin123';
        errEl.style.display = 'block';
      }
    }
  });
}

function showLoginView() {
  document.getElementById('login-view')?.classList.remove('hidden');
  document.getElementById('dashboard-view')?.classList.add('hidden');
}

function showDashboard() {
  document.getElementById('login-view')?.classList.add('hidden');
  document.getElementById('dashboard-view')?.classList.remove('hidden');
  initDashboard();
}

// =====================
// DASHBOARD
// =====================
function initDashboard() {
  initNavigation();
  updateDashboardStats();
  renderLayouts();
  renderGallery();
  renderCrew();
  renderTestimonials();
  loadContactSettings();
  loadContentSettings();
  initLogout();
}

function initNavigation() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const panel = item.getAttribute('data-panel');
      if (!panel) return;

      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(`panel-${panel}`)?.classList.add('active');

      // Update page title
      const title = document.getElementById('admin-page-title');
      if (title) title.textContent = item.querySelector('span:last-child')?.textContent || 'Dashboard';
    });
  });
}

function updateDashboardStats() {
  const layouts = getLayouts();
  const gallery = getGallery();
  const crew = getCrew();

  setEl('dash-layouts-count', layouts.length);
  setEl('dash-gallery-count', gallery.length);
  setEl('dash-crew-count', crew.length);
  setEl('dash-available-count', layouts.filter(l => l.status === 'available').length);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function initLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearAdminSession();
    showLoginView();
  });
}

// =====================
// LAYOUTS MANAGEMENT
// =====================
function renderLayouts() {
  const tbody = document.getElementById('layouts-tbody');
  if (!tbody) return;
  const layouts = getLayouts();

  if (!layouts.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gray-mid);padding:2rem">No layouts added yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = layouts.map(l => `
    <tr>
      <td>
        <img src="${l.image}" alt="${l.name}" style="width:50px;height:36px;object-fit:cover;border-radius:6px;margin-right:0.5rem;vertical-align:middle">
        ${sanitize(l.name)}
      </td>
      <td>${sanitize(l.location)}</td>
      <td>${l.availablePlots} / ${l.totalPlots}</td>
      <td>${sanitize(l.pricePerSqYd)}</td>
      <td><span class="status-badge ${l.status}">${statusLabel(l.status)}</span></td>
      <td>
        <button class="admin-action-btn edit" onclick="editLayout(${l.id})">Edit</button>
        <button class="admin-action-btn delete" onclick="deleteLayoutItem(${l.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('btn-add-layout')?.addEventListener('click', () => openLayoutModal());

window.editLayout = function(id) {
  const layout = getLayouts().find(l => l.id === id);
  if (layout) openLayoutModal(layout);
};

window.deleteLayoutItem = function(id) {
  if (confirm('Delete this layout? This cannot be undone.')) {
    deleteLayout(id);
    renderLayouts();
    updateDashboardStats();
    showToast('Layout deleted.');
  }
};

function openLayoutModal(layout = null) {
  const modal = document.getElementById('layout-modal');
  if (!modal) return;

  const form = document.getElementById('layout-form');
  if (form) {
    if (layout) {
      form.querySelector('[name="id"]').value = layout.id || '';
      form.querySelector('[name="name"]').value = layout.name || '';
      form.querySelector('[name="location"]').value = layout.location || '';
      form.querySelector('[name="totalPlots"]').value = layout.totalPlots || '';
      form.querySelector('[name="availablePlots"]').value = layout.availablePlots || '';
      form.querySelector('[name="totalArea"]').value = layout.totalArea || '';
      form.querySelector('[name="pricePerSqYd"]').value = layout.pricePerSqYd || '';
      form.querySelector('[name="description"]').value = layout.description || '';
      form.querySelector('[name="image"]').value = layout.image || '';
      form.querySelector('[name="mapsLink"]').value = layout.mapsLink || '';
      form.querySelector('[name="status"]').value = layout.status || 'available';
      form.querySelector('[name="roads"]').value = layout.roads || '';
      form.querySelector('[name="water"]').value = layout.water || '';
      form.querySelector('[name="electricity"]').value = layout.electricity || '';
      form.querySelector('[name="amenities"]').value = (layout.amenities || []).join(', ');
      form.querySelector('[name="plotSizes"]').value = (layout.plotSizes || []).join(', ');
      form.querySelector('[name="nearby"]').value = (layout.nearby || []).join(', ');
    } else {
      form.reset();
    }
  }

  document.getElementById('layout-modal-title').textContent = layout ? 'Edit Layout' : 'Add New Layout';
  modal.classList.add('active');
}

document.getElementById('layout-modal-close')?.addEventListener('click', () => {
  document.getElementById('layout-modal')?.classList.remove('active');
});

document.getElementById('layout-modal-cancel')?.addEventListener('click', () => {
  document.getElementById('layout-modal')?.classList.remove('active');
});

document.getElementById('layout-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('[name="id"]').value;

  const layout = {
    id: id ? parseInt(id) : null,
    name: sanitize(form.querySelector('[name="name"]').value),
    location: sanitize(form.querySelector('[name="location"]').value),
    totalPlots: parseInt(form.querySelector('[name="totalPlots"]').value),
    availablePlots: parseInt(form.querySelector('[name="availablePlots"]').value),
    totalArea: sanitize(form.querySelector('[name="totalArea"]').value),
    pricePerSqYd: sanitize(form.querySelector('[name="pricePerSqYd"]').value),
    description: sanitize(form.querySelector('[name="description"]').value),
    image: sanitize(form.querySelector('[name="image"]').value),
    mapsLink: sanitize(form.querySelector('[name="mapsLink"]').value),
    status: form.querySelector('[name="status"]').value,
    roads: sanitize(form.querySelector('[name="roads"]').value),
    water: sanitize(form.querySelector('[name="water"]').value),
    electricity: sanitize(form.querySelector('[name="electricity"]').value),
    amenities: form.querySelector('[name="amenities"]').value.split(',').map(s => sanitize(s.trim())).filter(Boolean),
    plotSizes: form.querySelector('[name="plotSizes"]').value.split(',').map(s => sanitize(s.trim())).filter(Boolean),
    nearby: form.querySelector('[name="nearby"]').value.split(',').map(s => sanitize(s.trim())).filter(Boolean)
  };

  if (!layout.id) delete layout.id;
  saveLayout(layout);
  document.getElementById('layout-modal')?.classList.remove('active');
  renderLayouts();
  updateDashboardStats();
  showToast('Layout saved successfully!');
});

// =====================
// GALLERY MANAGEMENT
// =====================
function renderGallery() {
  const grid = document.getElementById('admin-gallery-grid');
  if (!grid) return;
  const gallery = getGallery();

  if (!gallery.length) {
    grid.innerHTML = '<p style="color:var(--gray-mid);font-size:0.85rem;">No gallery items yet.</p>';
    return;
  }

  grid.innerHTML = gallery.map(item => `
    <div class="admin-gallery-item">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="admin-gallery-item-overlay">
        <button class="admin-action-btn delete" onclick="deleteGalleryImg(${item.id})"
          style="background:rgba(239,68,68,0.8);border:none;color:white;padding:0.4rem 0.8rem;border-radius:6px;font-size:0.75rem">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

window.deleteGalleryImg = function(id) {
  if (confirm('Remove this image?')) {
    deleteGalleryItem(id);
    renderGallery();
    updateDashboardStats();
    showToast('Image removed.');
  }
};

document.getElementById('gallery-add-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const item = {
    title: sanitize(form.querySelector('[name="title"]').value),
    image: sanitize(form.querySelector('[name="imageUrl"]').value),
    category: form.querySelector('[name="category"]').value
  };
  if (!item.image) { showToast('Please enter an image URL', 'error'); return; }
  saveGalleryItem(item);
  form.reset();
  renderGallery();
  updateDashboardStats();
  showToast('Image added to gallery!');
});

// =====================
// CREW MANAGEMENT
// =====================
function renderCrew() {
  const grid = document.getElementById('admin-crew-grid');
  if (!grid) return;
  const crew = getCrew();

  if (!crew.length) {
    grid.innerHTML = '<p style="color:var(--gray-mid);font-size:0.85rem;">No crew members yet.</p>';
    return;
  }

  grid.innerHTML = crew.map(m => `
    <div class="admin-crew-card">
      <img src="${m.photo}" alt="${m.name}" class="admin-crew-photo" onerror="this.src='https://via.placeholder.com/60x60/1a1f2e/D4AF37?text=${m.name.charAt(0)}'">
      <div class="admin-crew-name">${sanitize(m.name)}</div>
      <div class="admin-crew-role">${sanitize(m.role)}</div>
      <div style="font-size:0.7rem;color:var(--gray-mid);margin-bottom:0.75rem">${sanitize(m.experience)}</div>
      <div style="display:flex;gap:0.4rem;justify-content:center;flex-wrap:wrap">
        <button class="admin-action-btn edit" onclick="editCrewMember(${m.id})" style="font-size:0.7rem;padding:0.25rem 0.6rem">Edit</button>
        <button class="admin-action-btn delete" onclick="deleteCrewMember(${m.id})" style="font-size:0.7rem;padding:0.25rem 0.6rem">Delete</button>
      </div>
    </div>
  `).join('');
}

window.editCrewMember = function(id) {
  const member = getCrew().find(c => c.id === id);
  if (member) openCrewModal(member);
};

window.deleteCrewMember = function(id) {
  if (confirm('Remove this crew member?')) {
    deleteCrew(id);
    renderCrew();
    updateDashboardStats();
    showToast('Crew member removed.');
  }
};

document.getElementById('btn-add-crew')?.addEventListener('click', () => openCrewModal());

function openCrewModal(member = null) {
  const modal = document.getElementById('crew-modal');
  if (!modal) return;
  const form = document.getElementById('crew-form');

  if (form && member) {
    form.querySelector('[name="id"]').value = member.id || '';
    form.querySelector('[name="name"]').value = member.name || '';
    form.querySelector('[name="role"]').value = member.role || '';
    form.querySelector('[name="experience"]').value = member.experience || '';
    form.querySelector('[name="photo"]').value = member.photo || '';
    form.querySelector('[name="skills"]').value = (member.skills || []).join(', ');
  } else if (form) {
    form.reset();
  }

  document.getElementById('crew-modal-title').textContent = member ? 'Edit Crew Member' : 'Add Crew Member';
  modal.classList.add('active');
}

document.getElementById('crew-modal-close')?.addEventListener('click', () => document.getElementById('crew-modal')?.classList.remove('active'));
document.getElementById('crew-modal-cancel')?.addEventListener('click', () => document.getElementById('crew-modal')?.classList.remove('active'));

document.getElementById('crew-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('[name="id"]').value;
  const member = {
    id: id ? parseInt(id) : null,
    name: sanitize(form.querySelector('[name="name"]').value),
    role: sanitize(form.querySelector('[name="role"]').value),
    experience: sanitize(form.querySelector('[name="experience"]').value),
    photo: sanitize(form.querySelector('[name="photo"]').value),
    skills: form.querySelector('[name="skills"]').value.split(',').map(s => sanitize(s.trim())).filter(Boolean)
  };
  if (!member.id) delete member.id;
  saveCrew(member);
  document.getElementById('crew-modal')?.classList.remove('active');
  renderCrew();
  updateDashboardStats();
  showToast('Crew member saved!');
});

// =====================
// TESTIMONIALS
// =====================
function renderTestimonials() {
  const tbody = document.getElementById('testimonials-tbody');
  if (!tbody) return;
  const list = getTestimonials();

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-mid);padding:2rem">No testimonials yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${sanitize(t.name)}</td>
      <td>${sanitize(t.project)}</td>
      <td>${'★'.repeat(t.rating)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${sanitize(t.review)}</td>
      <td>
        <button class="admin-action-btn delete" onclick="deleteTestimonialItem(${t.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteTestimonialItem = function(id) {
  if (confirm('Delete this testimonial?')) {
    deleteTestimonial(id);
    renderTestimonials();
    showToast('Testimonial deleted.');
  }
};

document.getElementById('testimonial-add-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const t = {
    name: sanitize(form.querySelector('[name="name"]').value),
    project: sanitize(form.querySelector('[name="project"]').value),
    rating: parseInt(form.querySelector('[name="rating"]').value),
    review: sanitize(form.querySelector('[name="review"]').value),
    photo: sanitize(form.querySelector('[name="photo"]').value || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100')
  };
  saveTestimonial(t);
  form.reset();
  renderTestimonials();
  showToast('Testimonial added!');
});

// =====================
// CONTACT SETTINGS
// =====================
function loadContactSettings() {
  const contact = getContact();
  if (!contact) return;

  const form = document.getElementById('contact-settings-form');
  if (!form) return;

  form.querySelector('[name="companyName"]').value = contact.name || '';
  form.querySelector('[name="phone"]').value = contact.phone || '';
  form.querySelector('[name="whatsapp"]').value = contact.whatsapp || '';
  form.querySelector('[name="email"]').value = contact.email || '';
  form.querySelector('[name="address"]').value = contact.address || '';
  form.querySelector('[name="tagline"]').value = contact.tagline || '';
}

document.getElementById('contact-settings-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  saveContact({
    name: sanitize(form.querySelector('[name="companyName"]').value),
    phone: sanitize(form.querySelector('[name="phone"]').value),
    whatsapp: sanitize(form.querySelector('[name="whatsapp"]').value),
    email: sanitize(form.querySelector('[name="email"]').value),
    address: sanitize(form.querySelector('[name="address"]').value),
    tagline: sanitize(form.querySelector('[name="tagline"]').value)
  });
  showToast('Contact info updated!');
});

// =====================
// CONTENT / STATS
// =====================
function loadContentSettings() {
  const stats = getStats();
  if (!stats) return;

  const form = document.getElementById('stats-form');
  if (!form) return;

  form.querySelector('[name="layouts"]').value = stats.layouts || '';
  form.querySelector('[name="plotsSold"]').value = stats.plotsSold || '';
  form.querySelector('[name="projects"]').value = stats.projects || '';
  form.querySelector('[name="clients"]').value = stats.clients || '';
  form.querySelector('[name="crew"]').value = stats.crew || '';
}

document.getElementById('stats-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  saveStats({
    layouts: parseInt(form.querySelector('[name="layouts"]').value),
    plotsSold: parseInt(form.querySelector('[name="plotsSold"]').value),
    projects: parseInt(form.querySelector('[name="projects"]').value),
    clients: parseInt(form.querySelector('[name="clients"]').value),
    crew: parseInt(form.querySelector('[name="crew"]').value)
  });
  showToast('Statistics updated!');
});

// =====================
// HELPERS
// =====================
function statusLabel(s) {
  const map = { available: 'Available', limited: 'Limited', soldout: 'Sold Out', upcoming: 'Upcoming' };
  return map[s] || s;
}

function showToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
}
