document.addEventListener('DOMContentLoaded', function () {
  console.log('MAKWELL: Full app.js loaded - initializing components.');

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when nav link clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close mobile menu if clicked outside menu and hamburger
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Product Tab Switching (Products Page)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        // Remove active class from buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Activate clicked tab
        this.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      if (!validateContactForm(data)) return;

      simulateFormSubmission(data);
    });
  }

  function validateContactForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'subject', 'message'];
    const errors = [];

    requiredFields.forEach(field => {
      if (!data[field] || data[field].trim() === '') {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    if (data.email && !isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (data.phone && !isValidPhone(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (errors.length > 0) {
      showFormErrors(errors);
      return false;
    }

    return true;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[1-9]?[0-9]{7,12}$/;
    return phoneRegex.test(phoneClean);
  }

  function showFormErrors(errors) {
    // Clear previous errors
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(err => err.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
      <h4 style="margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Please fix the following:</h4>
      <ul style="margin: 0; padding-left: 1.5rem;">
        ${errors.map(err => `<li>${err}</li>`).join('')}
      </ul>
    `;

    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function simulateFormSubmission(data) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Clear errors if any
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(err => err.remove());

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      console.log('Form data submitted:', data);

      // Reset form after 5 seconds
      setTimeout(() => {
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 5000);
    }, 2000);
  }

  // Auto-fit images system
  function initAutoFitImages() {
    const imageContainers = document.querySelectorAll('.product-image, .category-card-image, .banner-image, .showcase-image, .product-image-large');

    imageContainers.forEach(container => {
      const img = container.querySelector('img');
      const icon = container.querySelector('i');

      if (img) {
        container.classList.add('image-loading');

        img.onload = function () {
          container.classList.remove('image-loading');
          container.classList.remove('fallback');
          if (icon) icon.style.display = 'none';
        };

        img.onerror = function () {
          container.classList.remove('image-loading');
          container.classList.add('fallback');
          img.style.display = 'none';
          if (icon) icon.style.display = 'block';
        };

        if (img.complete && img.naturalHeight !== 0) {
          container.classList.remove('image-loading');
          if (icon) icon.style.display = 'none';
        }
      }
    });
  }

  // Navigation color locking
  function lockNavigationColors() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.style.setProperty('background', 'var(--color-nav-bg)', 'important');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.style.setProperty('color', 'var(--color-nav-text)', 'important');
    });

    const logoText = document.querySelectorAll('.nav-logo h2, .nav-logo-text h2');
    logoText.forEach(text => {
      text.style.setProperty('color', 'var(--color-nav-text)', 'important');
    });
  }

  // Initialize auto-fit images and lock navigation colors on load
  initAutoFitImages();
  lockNavigationColors();

  // Scroll handler - only change shadow, never nav color
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.style.setProperty('box-shadow', '0 4px 20px rgba(65, 105, 225, 0.2)', 'important');
    } else {
      navbar.style.setProperty('box-shadow', '0 4px 20px rgba(65, 105, 225, 0.1)', 'important');
    }
    lockNavigationColors();
  });
});
