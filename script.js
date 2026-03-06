
// ========== NAVBAR - Sticky with blur on scroll ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU - Toggle hamburger menu ==========
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ========== SCROLL REVEAL - Fade-up animation when sections enter viewport ==========
const reveals = document.querySelectorAll('.reveal');
function revealOnScroll() {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ========== WHATSAPP FLOATING BUTTON ==========
// Replace with your WhatsApp number (include country code, no + or spaces)
// Example: 919876543210 for +91 98765 43210
const WHATSAPP_NUMBER = '8999542585';
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'm interested in joining Falcon Fitness. I'd like to know more about your membership plans.");

const whatsappBtn = document.getElementById('whatsappBtn');
if (whatsappBtn) {
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
}

// ========== CONTACT FORM - Configuration ==========
// Replace with your Google Apps Script Web App URL (Deploy > Web app > Copy URL)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby40rvAaERQU8BuK2AgJERnukOX1shXUptuzF8Wy9SsXC2L55G2jtAFtvOptBOtrWCmCw/exec';

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Removes error styling and messages from all form fields
 */
function clearFieldErrors() {
  document.querySelectorAll('.input-modern').forEach(input => input.classList.remove('input-error'));
  document.querySelectorAll('.field-error').forEach(el => {
    el.classList.add('hidden');
    el.textContent = '';
  });
}

/**
 * Shows error on a specific field
 * @param {string} fieldId - Id of input (name, email, message)
 * @param {string} message - Error message to display
 */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (input && errorEl) {
    input.classList.add('input-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

/**
 * Validates form - checks required fields, email format, prevents empty submissions
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateForm(form) {
  const errors = [];
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Required: Name
  if (!name) {
    errors.push({ field: 'name', message: 'Please enter your name.' });
  }

  // Required: Email + format
  if (!email) {
    errors.push({ field: 'email', message: 'Please enter your email.' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  // Required: Message
  if (!message) {
    errors.push({ field: 'message', message: 'Please enter your message.' });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Shows the success modal popup
 * Auto-closes after 3 seconds; overlay click also closes it
 */
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const closeModal = () => modal.classList.add('hidden');
  setTimeout(closeModal, 3000);

  // Close when clicking overlay (one-time listener)
  modal.querySelector('.success-modal-overlay').onclick = closeModal;
}

/**
 * Shows error toast notification (for validation or submit failure)
 * @param {string} message - Error message
 */
function showErrorToast(message) {
  const notification = document.getElementById('formNotification');
  notification.textContent = message;
  notification.className = 'form-notification error';
  notification.classList.remove('hidden');
  setTimeout(() => notification.classList.add('hidden'), 5000);
}

/**
 * Clears the contact form fields
 */
function clearForm() {
  document.getElementById('contactForm').reset();
  clearFieldErrors();
}

/**
 * Restores submit button to default state
 * @param {HTMLElement} btn - Submit button element
 */
function restoreSubmitButton(btn) {
  btn.disabled = false;
  btn.textContent = 'Send Message';
}

/**
 * Handles contact form submission
 * Validates → Sends to Google Sheets → Shows success modal or error
 */
function handleContactFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  // Step 1: Clear any previous errors
  clearFieldErrors();

  // Step 2: Validate form
  const validation = validateForm(form);
  if (!validation.valid) {
    validation.errors.forEach(({ field, message }) => showFieldError(field, message));
    showErrorToast(validation.errors[0].message);
    return;
  }

  // Step 3: Check if Google Script URL is configured
  if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
    showErrorToast('Form is not configured yet. Please add your Google Apps Script URL.');
    return;
  }

  // Step 4: Disable button, show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
    timestamp: new Date().toISOString()
  };

  // Step 5: Send to Google Apps Script (use text/plain to avoid CORS preflight)
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.success) {
        showSuccessModal();
        clearForm();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      showErrorToast('Something went wrong. Please try again or contact us via WhatsApp.');
    })
    .finally(() => {
      restoreSubmitButton(submitBtn);
    });
}

// Attach form submit handler
document.getElementById('contactForm').addEventListener('submit', handleContactFormSubmit);

// Clear field errors when user starts typing (better UX)
document.querySelectorAll('#contactForm .input-modern, #contactForm textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('input-error');
    const errorId = input.id + 'Error';
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.add('hidden');
  });
});

