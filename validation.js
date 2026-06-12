// ============================================
// VALIDATION.JS
// ============================================

export function validateForm(form) {
  let valid = true;
  const fields = form.querySelectorAll('[data-required]');

  fields.forEach(field => {
    clearError(field);
    const val = field.value.trim();
    const type = field.getAttribute('data-validate') || field.type;

    if (!val) {
      showError(field, 'This field is required');
      valid = false;
      return;
    }

    if (type === 'email' && !isValidEmail(val)) {
      showError(field, 'Enter a valid email address');
      valid = false;
    }

    if (type === 'tel' && !isValidPhone(val)) {
      showError(field, 'Enter a valid phone number');
      valid = false;
    }

    const minLen = parseInt(field.getAttribute('data-min'));
    if (minLen && val.length < minLen) {
      showError(field, `Minimum ${minLen} characters required`);
      valid = false;
    }
  });

  return valid;
}

export function showError(field, msg) {
  field.classList.add('error');
  let errEl = field.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  errEl.classList.add('visible');
}

export function clearError(field) {
  field.classList.remove('error');
  const errEl = field.parentElement?.querySelector('.field-error');
  if (errEl) errEl.classList.remove('visible');
}

export function clearAllErrors(form) {
  form.querySelectorAll('.error').forEach(f => f.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{8,15}$/.test(phone);
}

// =====================
// Real-time validation
// =====================
export function initLiveValidation(form) {
  form.querySelectorAll('[data-required]').forEach(field => {
    field.addEventListener('blur', () => {
      const val = field.value.trim();
      if (!val) {
        showError(field, 'This field is required');
        return;
      }
      const type = field.getAttribute('data-validate') || field.type;
      if (type === 'email' && !isValidEmail(val)) {
        showError(field, 'Enter a valid email address');
        return;
      }
      if (type === 'tel' && !isValidPhone(val)) {
        showError(field, 'Enter a valid phone number');
        return;
      }
      clearError(field);
    });

    field.addEventListener('input', () => {
      if (field.value.trim()) clearError(field);
    });
  });
}
