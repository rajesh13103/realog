// ============================================
// MAIN.JS - Core Site Functionality
// ============================================
import { initStorage, getContact, getStats } from './storage.js';

// =====================
// DOM Ready
// =====================
document.addEventListener('DOMContentLoaded', async () => {
  await initStorage();
  initLoader();
  initCursor();
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initBackToTop();
  initFloatingButtons();
  updateContactInfo();
  updateStats();
});

// =====================
// LOADING SCREEN
// =====================
function initLoader() {
  const screen = document.getElementById('loading-screen');
  const bar = document.querySelector('.loader-bar');
  const text = document.querySelector('.loader-text');
  if (!screen) return;

  const msgs = ['Loading Experience...', 'Crafting Excellence...', 'Almost Ready...'];
  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = progress + '%';
    if (text && progress > 40 && msgIdx < 2) {
      msgIdx++;
      text.textContent = msgs[msgIdx] || msgs[0];
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  }, 80);

  document.body.style.overflow = 'hidden';
}

// =====================
// CUSTOM CURSOR
// =====================
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Ring follows with lag
  function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover effect
  const hoverEls = document.querySelectorAll('a, button, [data-cursor-hover]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide on mobile
  document.addEventListener('touchstart', () => {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }, { once: true });
}

// =====================
// SCROLL PROGRESS
// =====================
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  }, { passive: true });
}

// =====================
// NAVBAR
// =====================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const update = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (path.endsWith('index.html') || path === '/' || path === '') && (href === 'index.html' || href === './') ||
      path.includes('layouts') && href.includes('layouts') ||
      path.includes('services') && href.includes('services') ||
      path.includes('gallery') && href.includes('gallery') ||
      path.includes('contact') && href.includes('contact')
    ) {
      link.classList.add('active');
    }
  });
}

// =====================
// MOBILE NAV
// =====================
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// =====================
// BACK TO TOP
// =====================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================
// FLOATING BUTTONS
// =====================
function initFloatingButtons() {
  const contact = getContact();
  if (!contact) return;

  const whatsappBtn = document.querySelector('.float-whatsapp');
  const callBtn = document.querySelector('.float-call');

  if (whatsappBtn && contact.whatsapp) {
    whatsappBtn.href = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Hello! I'm interested in your properties.`;
  }
  if (callBtn && contact.phone) {
    callBtn.href = `tel:${contact.phone.replace(/\s/g, '')}`;
  }
}

// =====================
// UPDATE CONTACT INFO
// =====================
function updateContactInfo() {
  const contact = getContact();
  if (!contact) return;

  // Phone numbers
  document.querySelectorAll('[data-contact="phone"]').forEach(el => {
    if (contact.phone) {
      el.textContent = contact.phone;
      if (el.tagName === 'A') el.href = `tel:${contact.phone.replace(/\s/g, '')}`;
    }
  });

  // Email
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    if (contact.email) {
      el.textContent = contact.email;
      if (el.tagName === 'A') el.href = `mailto:${contact.email}`;
    }
  });

  // Address
  document.querySelectorAll('[data-contact="address"]').forEach(el => {
    if (contact.address) el.textContent = contact.address;
  });

  // Company name
  document.querySelectorAll('[data-contact="name"]').forEach(el => {
    if (contact.name) el.textContent = contact.name;
  });
}

// =====================
// UPDATE STATS
// =====================
function updateStats() {
  const stats = getStats();
  if (!stats) return;

  const map = {
    '[data-stat="layouts"]': stats.layouts,
    '[data-stat="plots"]': stats.plotsSold,
    '[data-stat="projects"]': stats.projects,
    '[data-stat="clients"]': stats.clients,
    '[data-stat="crew"]': stats.crew
  };

  for (const [selector, value] of Object.entries(map)) {
    document.querySelectorAll(selector).forEach(el => {
      el.setAttribute('data-target', value);
    });
  }
}

// =====================
// TOAST NOTIFICATION
// =====================
export function showToast(msg, type = 'success') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// =====================
// RIPPLE EFFECT
// =====================
export function addRipple(btn) {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// =====================
// COUNTER ANIMATION
// =====================
export function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent);
  if (isNaN(target)) return;
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

// =====================
// INTERSECTION OBSERVER
// =====================
export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Counter
        if (entry.target.classList.contains('counter-number')) {
          animateCounter(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-zoom-in, .anim-scale, .counter-number').forEach(el => {
    observer.observe(el);
  });
}

// =====================
// PARALLAX HERO
// =====================
export function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.25}px)`;
      hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
  }, { passive: true });
}

// =====================
// PARTICLES (hero bg)
// =====================
export function initParticles(container) {
  if (!container) return;
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      opacity: ${Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}
