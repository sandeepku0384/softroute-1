/* ============================================================
   SOFTROUTE INFO TECHNOLOGIES — MAIN.JS
   Navbar, Mega Menu, Mobile Menu, Active Links, Scroll
   ============================================================ */

'use strict';

/* ── 1. DOM READY ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMegaMenu();
  initMobileMenu();
  initActiveLinks();
  initSmoothScroll();
  initScrollProgress();
  initLucideIcons();
});

/* ── 2. INIT LUCIDE ICONS ────────────────────────────────── */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ── 3. NAVBAR ───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;
  const navLogo = document.getElementById('navLogo');

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
      if (navLogo) navLogo.src = 'assets/logo1.png';
    } else {
      navbar.classList.remove('scrolled');
      if (navLogo) navLogo.src = 'assets/logo.png';
    }
  }

  // Run on load
  updateNavbar();

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Pages without hero gradient use solid navbar always
  if (navbar.dataset.solid === 'true') {
    navbar.classList.add('navbar-solid');
  }
}

/* ── 4. MEGA MENU ────────────────────────────────────────── */
function initMegaMenu() {
  const megaItems = document.querySelectorAll('.has-mega');

  megaItems.forEach(item => {
    const link = item.querySelector(':scope > a, :scope > button');
    const menu = item.querySelector('.mega-menu');
    if (!link || !menu) return;

    let closeTimer = null;

    // Desktop: hover
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      // Close all other mega menus
      megaItems.forEach(other => {
        if (other !== item) other.classList.remove('mega-open');
      });
      item.classList.add('mega-open');
    });

    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('mega-open');
      }, 120);
    });

    menu.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
    });

    menu.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('mega-open');
      }, 120);
    });
  });

  // Close mega menus on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-mega')) {
      megaItems.forEach(item => item.classList.remove('mega-open'));
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      megaItems.forEach(item => item.classList.remove('mega-open'));
    }
  });
}

/* ── 5. MOBILE MENU ──────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    // Close all submenus
    document.querySelectorAll('.mobile-submenu.open').forEach(sub => {
      sub.classList.remove('open');
    });
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Mobile submenu toggles
  const mobileSubToggles = document.querySelectorAll('.mobile-sub-toggle');
  mobileSubToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const submenuId = toggle.dataset.submenu;
      const submenu = document.getElementById(submenuId);
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');

      // Close all submenus
      document.querySelectorAll('.mobile-submenu.open').forEach(sub => {
        sub.classList.remove('open');
      });
      document.querySelectorAll('.mobile-sub-toggle').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const icon = t.querySelector('svg');
        if (icon) icon.style.transform = '';
      });

      // Open clicked one
      if (!isOpen) {
        submenu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        const icon = toggle.querySelector('svg');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Close on backdrop click (clicking outside the menu panel)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // Small delay for visual feedback
      setTimeout(closeMenu, 150);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ── 6. ACTIVE NAV LINKS ─────────────────────────────────── */
function initActiveLinks() {
  const currentPath = window.location.pathname;

  // Desktop nav
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Normalize paths for comparison
    const linkPath = new URL(href, window.location.origin).pathname;

    if (
      currentPath === linkPath ||
      (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))
    ) {
      link.classList.add('active');
    }
  });

  // Mobile nav
  document.querySelectorAll('.mobile-nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    try {
      const linkPath = new URL(href, window.location.origin).pathname;
      if (
        currentPath === linkPath ||
        (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))
      ) {
        link.classList.add('active');
        // Open parent submenu if active link is inside one
        const submenu = link.closest('.mobile-submenu');
        if (submenu) {
          submenu.classList.add('open');
          const toggle = document.querySelector(`[data-submenu="${submenu.id}"]`);
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
      }
    } catch (e) {
      // ignore invalid URLs
    }
  });
}

/* ── 7. SMOOTH SCROLL ────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
      ) || 72;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/* ── 8. SCROLL PROGRESS BAR ──────────────────────────────── */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ── 9. UTILITY: DEBOUNCE ────────────────────────────────── */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ── 10. UTILITY: THROTTLE ───────────────────────────────── */
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/* ── 11. UTILITY: GET ELEMENT ────────────────────────────── */
function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

/* ── 12. EXPOSE UTILITIES ────────────────────────────────── */
window.SoftRoute = window.SoftRoute || {};
window.SoftRoute.utils = { debounce, throttle, $, $$ };
window.SoftRoute.reinitIcons = initLucideIcons;
