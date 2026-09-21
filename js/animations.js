/* ============================================================
   SOFTROUTE INFO TECHNOLOGIES — ANIMATIONS.JS
   Scroll Reveals, Counters, Stagger, IntersectionObserver
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initCounters();
  initHeroParticles();
});

/* ── 1. SCROLL REVEAL OBSERVER ───────────────────────────── */
function initScrollReveals() {
  const revealSelectors = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.reveal-fade'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  if (!elements.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stop observing once revealed (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── 2. ANIMATED COUNTERS ────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target    = parseFloat(el.dataset.target);
  const duration  = 2200;
  const decimals  = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const start     = performance.now();
  const startVal  = parseFloat(el.dataset.start || 0);

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed  = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuart(progress);
    const value    = startVal + (eased * (target - startVal));

    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure exact final value
      el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

/* ── 3. STAGGER CHILDREN OBSERVER ───────────────────────── */
// Applied to .stagger containers — children get reveal class dynamically
function initStaggerObserver() {
  const staggerContainers = document.querySelectorAll('.stagger');
  if (!staggerContainers.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    staggerContainers.forEach(container => {
      container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => el.classList.add('revealed'));
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
          );
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  staggerContainers.forEach(container => observer.observe(container));
}

/* ── 4. HERO PARTICLES (SVG background dots) ─────────────── */
function initHeroParticles() {
  const heroSections = document.querySelectorAll('.hero-particles');
  heroSections.forEach(section => {
    createParticles(section);
  });
}

function createParticles(container) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'hero-particle-svg');
  svg.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  `;

  const count = 24;
  for (let i = 0; i < count; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const r = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.4 + 0.1;
    const delay = Math.random() * 6;

    circle.setAttribute('cx', `${x}%`);
    circle.setAttribute('cy', `${y}%`);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'white');
    circle.setAttribute('opacity', opacity);
    circle.style.animation = `particle-drift ${5 + Math.random() * 5}s ${delay}s ease-in-out infinite`;

    svg.appendChild(circle);
  }

  container.style.position = 'relative';
  container.insertBefore(svg, container.firstChild);
}

/* ── 5. NUMBER FORMAT HELPER ─────────────────────────────── */
function formatNumber(n, decimals = 0) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(decimals) + 'K';
  return n.toLocaleString();
}

/* ── 6. SECTION HIGHLIGHT (for long pages) ───────────────── */
function initSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ── 7. LAZY IMAGE LOADER ────────────────────────────────── */
function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  if ('loading' in HTMLImageElement.prototype) return; // Native lazy loading supported

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ── 8. EXPOSE TO GLOBAL ─────────────────────────────────── */
window.SoftRoute = window.SoftRoute || {};
window.SoftRoute.animations = {
  initScrollReveals,
  initCounters,
  animateCounter,
  formatNumber
};

// Auto-init stagger and lazy images on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initStaggerObserver();
  initLazyImages();
  initSectionHighlight();
});
