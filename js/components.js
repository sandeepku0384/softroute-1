/* ============================================================
   SOFTROUTE INFO TECHNOLOGIES — COMPONENTS.JS
   FAQ Accordion, Form Validation, Tabs, Misc Components
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initContactForm();
  initTabs();
  initTooltips();
  initCopyButtons();
  initBackToTop();
});

/* ── 1. FAQ ACCORDION ────────────────────────────────────── */
function initFAQ() {
  const faqLists = document.querySelectorAll('.faq-list');

  faqLists.forEach(faqList => {
    const items = faqList.querySelectorAll('.faq-item');

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0';

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all in this list
        items.forEach(otherItem => {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        // Toggle current
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });

      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  });
}

function openItem(item) {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  item.classList.add('open');
  question.setAttribute('aria-expanded', 'true');
  answer.style.maxHeight = answer.scrollHeight + 'px';
  answer.style.opacity = '1';
}

function closeItem(item) {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  item.classList.remove('open');
  question.setAttribute('aria-expanded', 'false');
  answer.style.maxHeight = '0';
  answer.style.opacity = '0';
}

/* ── 2. CONTACT FORM VALIDATION ──────────────────────────── */
function initContactForm() {
  const forms = document.querySelectorAll('.contact-form, [data-validate]');

  forms.forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors(form);

      // Validate
      const errors = validateForm(form);

      if (errors.length > 0) {
        showErrors(form, errors);
        // Focus first error field
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        showFormSuccess(form);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
        }
      }, 1400);
    });

    // Live validation on blur
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
      field.addEventListener('blur', () => {
        const error = validateField(field);
        if (error) {
          showFieldError(field, error);
        } else {
          clearFieldError(field);
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          const error = validateField(field);
          if (!error) clearFieldError(field);
        }
      });
    });

    // Store original submit text
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
    }
  });
}

function validateForm(form) {
  const errors = [];
  const fields  = form.querySelectorAll('.form-input, .form-textarea, .form-select');

  fields.forEach(field => {
    const error = validateField(field);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
}

function validateField(field) {
  const value    = field.value.trim();
  const type     = field.type;
  const required = field.required || field.dataset.required === 'true';
  const name     = field.name || field.id || 'Field';

  if (required && !value) {
    return `${getFieldLabel(field)} is required`;
  }

  if (value && type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  if (value && (type === 'tel' || field.dataset.type === 'phone')) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
  }

  if (field.dataset.minLength && value.length < parseInt(field.dataset.minLength)) {
    return `Please enter at least ${field.dataset.minLength} characters`;
  }

  return null;
}

function getFieldLabel(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);
  if (label) {
    return label.textContent.replace('*', '').trim();
  }
  return field.placeholder || field.name || 'This field';
}

function showErrors(form, errors) {
  errors.forEach(({ field, message }) => {
    showFieldError(field, message);
  });
}

function showFieldError(field, message) {
  field.classList.add('error');

  // Remove existing error message
  const existingError = field.parentNode.querySelector('.form-error');
  if (existingError) existingError.remove();

  const errorEl = document.createElement('span');
  errorEl.className = 'form-error';
  errorEl.setAttribute('role', 'alert');
  errorEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${message}`;

  field.parentNode.appendChild(errorEl);
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');
  const errorEl = field.parentNode.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  form.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
    el.removeAttribute('aria-invalid');
  });
}

function showFormSuccess(form) {
  const successEl = form.querySelector('.form-success');

  // Hide form fields
  form.querySelectorAll('.form-group').forEach(group => {
    group.style.display = 'none';
  });

  const submitWrap = form.querySelector('.form-submit');
  if (submitWrap) submitWrap.style.display = 'none';

  // Show success message
  if (successEl) {
    successEl.classList.add('visible');
    successEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:#38a169">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 style="font-size:1.25rem;font-weight:700;color:#1a2332;margin:0">Message Sent Successfully!</h3>
        <p style="color:#4a5568;margin:0;text-align:center">Thank you for reaching out. Our team will get back to you within 24 business hours.</p>
      </div>
    `;
  } else {
    // Create success element if not present
    const newSuccess = document.createElement('div');
    newSuccess.className = 'form-success visible';
    newSuccess.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:#38a169">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 style="font-size:1.25rem;font-weight:700;color:#1a2332;margin:0">Message Sent Successfully!</h3>
        <p style="color:#4a5568;margin:0;text-align:center">Thank you for reaching out. Our team will get back to you within 24 business hours.</p>
      </div>
    `;
    form.appendChild(newSuccess);
  }
}

/* ── 3. TABS ─────────────────────────────────────────────── */
function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tabs]');

  tabGroups.forEach(group => {
    const tabBtns    = group.querySelectorAll('[data-tab]');
    const tabPanels  = group.querySelectorAll('[data-tab-panel]');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update buttons
        tabBtns.forEach(b => {
          b.classList.toggle('tab-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        // Update panels
        tabPanels.forEach(panel => {
          const isActive = panel.dataset.tabPanel === targetTab;
          panel.classList.toggle('tab-panel-active', isActive);
          panel.hidden = !isActive;
        });
      });
    });

    // Keyboard navigation
    tabBtns.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') newIndex = (index + 1) % tabBtns.length;
        if (e.key === 'ArrowLeft')  newIndex = (index - 1 + tabBtns.length) % tabBtns.length;
        if (e.key === 'Home')       newIndex = 0;
        if (e.key === 'End')        newIndex = tabBtns.length - 1;

        if (newIndex !== index) {
          e.preventDefault();
          tabBtns[newIndex].click();
          tabBtns[newIndex].focus();
        }
      });
    });
  });
}

/* ── 4. TOOLTIPS ─────────────────────────────────────────── */
function initTooltips() {
  const tooltipTargets = document.querySelectorAll('[data-tooltip]');

  tooltipTargets.forEach(target => {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = target.dataset.tooltip;
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);

    function showTip(e) {
      const rect = target.getBoundingClientRect();
      tip.style.cssText = `
        position: fixed;
        background: rgba(26,35,50,0.92);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: var(--font-body);
        pointer-events: none;
        z-index: 9999;
        white-space: nowrap;
        top: ${rect.top - 36}px;
        left: ${rect.left + rect.width / 2}px;
        transform: translateX(-50%);
        opacity: 1;
        transition: opacity 0.15s ease;
      `;
    }

    function hideTip() {
      tip.style.opacity = '0';
      setTimeout(() => { tip.style.display = 'none'; }, 150);
    }

    target.addEventListener('mouseenter', showTip);
    target.addEventListener('mouseleave', hideTip);
    target.addEventListener('focus', showTip);
    target.addEventListener('blur', hideTip);
  });
}

/* ── 5. COPY BUTTONS ─────────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 2000);
      } catch (e) {
        console.warn('Clipboard API not available');
      }
    });
  });
}

/* ── 6. BACK TO TOP ──────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 7. EXPOSE TO GLOBAL ─────────────────────────────────── */
window.SoftRoute = window.SoftRoute || {};
window.SoftRoute.components = {
  initFAQ,
  initContactForm,
  initTabs,
  openItem,
  closeItem
};
