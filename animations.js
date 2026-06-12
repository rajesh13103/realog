// ============================================
// ANIMATIONS.JS
// ============================================
import { initScrollAnimations, initParallax, initParticles } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initParallax();

  const particlesWrap = document.querySelector('.particles-wrap');
  if (particlesWrap) initParticles(particlesWrap);

  initTestimonialSlider();
  initButtonRipples();
  initHeroLines();
});

// =====================
// TESTIMONIAL SLIDER
// =====================
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (!slides.length) return;

  let current = 0;
  let autoplay;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function start() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function stop() { clearInterval(autoplay); }

  prevBtn?.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  nextBtn?.addEventListener('click', () => { stop(); goTo(current + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stop(); goTo(i); start(); }));

  goTo(0);
  start();
}

// =====================
// BUTTON RIPPLES
// =====================
function initButtonRipples() {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
      `;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

// =====================
// HERO DECORATIVE LINES
// =====================
function initHeroLines() {
  const heroLines = document.querySelectorAll('.hero-line');
  heroLines.forEach((line, i) => {
    line.style.animationDelay = `${i * 1.5}s`;
  });
}
