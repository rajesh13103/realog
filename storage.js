// ============================================
// STORAGE.JS - LocalStorage Utilities
// ============================================

const DB_KEYS = {
  LAYOUTS: 'prestige_layouts',
  GALLERY: 'prestige_gallery',
  CREW: 'prestige_crew',
  TESTIMONIALS: 'prestige_testimonials',
  CONTACT: 'prestige_contact',
  COMPANY: 'prestige_company',
  STATS: 'prestige_stats',
  ADMIN_SESSION: 'prestige_admin_session'
};

// =====================
// Generic Storage
// =====================
export function storageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Storage read error:', e);
    return null;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write error:', e);
    return false;
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

// =====================
// Init from sample data
// =====================
export async function initStorage() {
  // Only seed if no data exists
  const hasData = storageGet(DB_KEYS.LAYOUTS);
  if (hasData) return;

  try {
    const base = window.location.pathname.includes('/admin') ||
                 window.location.pathname.includes('/contact') ||
                 window.location.pathname.includes('/gallery') ||
                 window.location.pathname.includes('/services') ||
                 window.location.pathname.includes('/layouts')
      ? '../data/sample-data.json'
      : 'data/sample-data.json';

    const resp = await fetch(base);
    const data = await resp.json();

    storageSet(DB_KEYS.LAYOUTS, data.layouts);
    storageSet(DB_KEYS.GALLERY, data.gallery);
    storageSet(DB_KEYS.CREW, data.crew);
    storageSet(DB_KEYS.TESTIMONIALS, data.testimonials);
    storageSet(DB_KEYS.CONTACT, data.company);
    storageSet(DB_KEYS.STATS, data.company.stats);
    storageSet(DB_KEYS.COMPANY, {
      name: data.company.name,
      tagline: data.company.tagline,
      founded: data.company.founded
    });
  } catch (e) {
    // Use inline defaults if fetch fails
    seedDefaults();
  }
}

function seedDefaults() {
  if (!storageGet(DB_KEYS.CONTACT)) {
    storageSet(DB_KEYS.CONTACT, {
      name: 'Prestige Estates',
      phone: '+91 98765 43210',
      whatsapp: '+919876543210',
      email: 'info@prestigeestates.in',
      address: 'Plot No. 42, Jubilee Hills, Hyderabad, Telangana 500033',
      tagline: 'Where Luxury Meets Legacy'
    });
  }
  if (!storageGet(DB_KEYS.STATS)) {
    storageSet(DB_KEYS.STATS, { layouts: 48, plotsSold: 1200, projects: 320, clients: 850, crew: 15 });
  }
  if (!storageGet(DB_KEYS.LAYOUTS)) storageSet(DB_KEYS.LAYOUTS, []);
  if (!storageGet(DB_KEYS.GALLERY)) storageSet(DB_KEYS.GALLERY, []);
  if (!storageGet(DB_KEYS.CREW)) storageSet(DB_KEYS.CREW, []);
  if (!storageGet(DB_KEYS.TESTIMONIALS)) storageSet(DB_KEYS.TESTIMONIALS, []);
}

// =====================
// Layouts CRUD
// =====================
export function getLayouts() {
  return storageGet(DB_KEYS.LAYOUTS) || [];
}

export function getLayoutById(id) {
  return getLayouts().find(l => l.id === parseInt(id));
}

export function saveLayout(layout) {
  const layouts = getLayouts();
  if (layout.id) {
    const idx = layouts.findIndex(l => l.id === layout.id);
    if (idx !== -1) layouts[idx] = layout;
    else layouts.push(layout);
  } else {
    layout.id = Date.now();
    layouts.push(layout);
  }
  storageSet(DB_KEYS.LAYOUTS, layouts);
  return layout;
}

export function deleteLayout(id) {
  const layouts = getLayouts().filter(l => l.id !== parseInt(id));
  storageSet(DB_KEYS.LAYOUTS, layouts);
}

// =====================
// Gallery CRUD
// =====================
export function getGallery() {
  return storageGet(DB_KEYS.GALLERY) || [];
}

export function saveGalleryItem(item) {
  const gallery = getGallery();
  if (!item.id) item.id = Date.now();
  gallery.push(item);
  storageSet(DB_KEYS.GALLERY, gallery);
  return item;
}

export function deleteGalleryItem(id) {
  const gallery = getGallery().filter(g => g.id !== parseInt(id));
  storageSet(DB_KEYS.GALLERY, gallery);
}

// =====================
// Crew CRUD
// =====================
export function getCrew() {
  return storageGet(DB_KEYS.CREW) || [];
}

export function saveCrew(member) {
  const crew = getCrew();
  if (member.id) {
    const idx = crew.findIndex(c => c.id === member.id);
    if (idx !== -1) crew[idx] = member;
    else crew.push(member);
  } else {
    member.id = Date.now();
    crew.push(member);
  }
  storageSet(DB_KEYS.CREW, crew);
  return member;
}

export function deleteCrew(id) {
  const crew = getCrew().filter(c => c.id !== parseInt(id));
  storageSet(DB_KEYS.CREW, crew);
}

// =====================
// Testimonials CRUD
// =====================
export function getTestimonials() {
  return storageGet(DB_KEYS.TESTIMONIALS) || [];
}

export function saveTestimonial(t) {
  const list = getTestimonials();
  if (t.id) {
    const idx = list.findIndex(x => x.id === t.id);
    if (idx !== -1) list[idx] = t;
    else list.push(t);
  } else {
    t.id = Date.now();
    list.push(t);
  }
  storageSet(DB_KEYS.TESTIMONIALS, list);
  return t;
}

export function deleteTestimonial(id) {
  const list = getTestimonials().filter(t => t.id !== parseInt(id));
  storageSet(DB_KEYS.TESTIMONIALS, list);
}

// =====================
// Contact Info
// =====================
export function getContact() {
  return storageGet(DB_KEYS.CONTACT) || {};
}

export function saveContact(data) {
  const current = getContact();
  storageSet(DB_KEYS.CONTACT, { ...current, ...data });
}

// =====================
// Stats
// =====================
export function getStats() {
  return storageGet(DB_KEYS.STATS) || {};
}

export function saveStats(data) {
  storageSet(DB_KEYS.STATS, data);
}

// =====================
// Admin Session
// =====================
export function getAdminSession() {
  return storageGet(DB_KEYS.ADMIN_SESSION);
}

export function setAdminSession(data) {
  storageSet(DB_KEYS.ADMIN_SESSION, data);
}

export function clearAdminSession() {
  storageRemove(DB_KEYS.ADMIN_SESSION);
}

export function isAdminLoggedIn() {
  const session = getAdminSession();
  if (!session) return false;
  // Session expires after 8 hours
  const now = Date.now();
  if (now - session.time > 8 * 60 * 60 * 1000) {
    clearAdminSession();
    return false;
  }
  return true;
}

// =====================
// XSS Sanitization
// =====================
export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function sanitizeObj(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === 'string') clean[key] = sanitize(val);
      else if (Array.isArray(val)) clean[key] = val.map(v => typeof v === 'string' ? sanitize(v) : v);
      else if (typeof val === 'object') clean[key] = sanitizeObj(val);
      else clean[key] = val;
    }
  }
  return clean;
}
