// MAKWELL Website JavaScript - COMPLETELY FIXED - No Color Changes on Scroll

document.addEventListener('DOMContentLoaded', function() {
    
    // FIXED: Remove all scroll-based color changes
    console.log('MAKWELL: Navigation color changes disabled - Royal Blue & Creamy theme locked');
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Product Tab Switching (for products page)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateContactForm(data)) {
                return;
            }

            // Simulate form submission
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

        // Email validation
        if (data.email && !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        // Phone validation (basic)
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
        const phoneRegex = /^[\+]?[1-9]?[0-9]{7,12}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function showFormErrors(errors) {
        // Remove any existing error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());

        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; color: rgb(239, 68, 68);">
                <h4 style="margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Please correct the following errors:</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;

        contactForm.insertBefore(errorDiv, contactForm.firstChild);
        
        // Scroll to form
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function simulateFormSubmission(data) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Remove any error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());

        // Simulate API call delay
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Log form data (in real implementation, send to server)
            console.log('Form submitted with data:', data);

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset form after delay
            setTimeout(() => {
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);

        }, 2000);
    }

    // Smooth scroll animation for internal links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = 80; // Account for fixed navbar
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize smooth scrolling
    initSmoothScrolling();

    // COMPLETELY REMOVED NAVIGATION COLOR CHANGING
    // NO scroll events that modify navbar colors
    const navbar = document.querySelector('.navbar');
    
    // Force navigation colors and prevent any changes
    function lockNavigationColors() {
        if (navbar) {
            // Force royal blue on creamy colors
            navbar.style.setProperty('background', 'var(--color-nav-bg)', 'important');
            navbar.style.setProperty('background-color', 'var(--color-nav-bg)', 'important');
            
            // Ensure all nav links stay royal blue
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.setProperty('color', 'var(--color-nav-text)', 'important');
            });
            
            // Logo text stays royal blue
            const logoText = document.querySelectorAll('.nav-logo h2, .nav-logo-text h2');
            logoText.forEach(text => {
                text.style.setProperty('color', 'var(--color-nav-text)', 'important');
            });
            
            console.log('MAKWELL: Navigation colors locked - Royal Blue on Creamy background');
        }
    }

    // Lock colors immediately and on any potential changes
    lockNavigationColors();
    
    // Optional: Only subtle shadow change on scroll (no color changes)
    let lastScrollY = 0;
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            // Only change shadow, never colors
            if (currentScrollY > 50) {
                navbar.style.setProperty('box-shadow', '0 4px 20px rgba(65, 105, 225, 0.2)', 'important');
            } else {
                navbar.style.setProperty('box-shadow', '0 4px 20px rgba(65, 105, 225, 0.1)', 'important');
            }
            
            // Re-lock colors on every scroll to prevent any changes
            lockNavigationColors();
        }
        
        lastScrollY = currentScrollY;
    }, 16)); // 60fps throttle

    // Ensure CSS is loaded and styles are applied
    function ensureCSS() {
        // Check if our custom CSS variables are available
        const testElement = document.createElement('div');
        testElement.style.color = 'var(--color-royal-blue)';
        document.body.appendChild(testElement);
        
        const computedColor = window.getComputedStyle(testElement).color;
        if (computedColor === '' || computedColor === 'var(--color-royal-blue)') {
            console.warn('MAKWELL: CSS variables not loaded properly, applying fallback styles');
            
            // Apply fallback styles
            const fallbackStyles = `
                <style id="makwell-fallback-styles">
                    .navbar {
                        background: rgba(255, 253, 240, 1) !important;
                        background-color: rgba(255, 253, 240, 1) !important;
                    }
                    .nav-link, .nav-logo h2, .nav-logo-text h2 {
                        color: rgba(65, 105, 225, 1) !important;
                    }
                    .tagline {
                        color: rgba(72, 61, 139, 1) !important;
                    }
                    .section-title, .about-card h3, .contact-card h3, .product-info h4 {
                        color: rgba(65, 105, 225, 1) !important;
                    }
                    .section-subtitle, .about-card p, .contact-card p, .product-features li {
                        color: rgba(72, 61, 139, 1) !important;
                    }
                </style>
            `;
            
            if (!document.getElementById('makwell-fallback-styles')) {
                document.head.insertAdjacentHTML('beforeend', fallbackStyles);
            }
        } else {
            console.log('MAKWELL: CSS loaded successfully');
        }
        
        document.body.removeChild(testElement);
    }

    // Check CSS loading after a short delay
    setTimeout(ensureCSS, 100);
    
    // Re-check CSS and lock colors after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            ensureCSS();
            lockNavigationColors();
            console.log('MAKWELL: Page fully loaded, styles locked');
        }, 200);
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .feature-card, .contact-card, .about-card, .offer-card, .tech-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });

    // Form field focus effects
    const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Button click effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                pointer-events: none;
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // WhatsApp floating button
    function createWhatsAppButton() {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = 'https://wa.me/919980000515';
        whatsappBtn.target = '_blank';
        whatsappBtn.className = 'whatsapp-float';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.title = 'Chat on WhatsApp';
        
        // Style the button
        const style = document.createElement('style');
        style.textContent = `
            .whatsapp-float {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #25d366;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                text-decoration: none;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
                z-index: 1000;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            }
            
            .whatsapp-float:hover {
                background: #128c7e;
                transform: scale(1.1);
                color: white;
            }
            
            @keyframes pulse {
                0% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
                }
                50% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.6);
                }
                100% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
                }
            }
            
            @media (max-width: 768px) {
                .whatsapp-float {
                    bottom: 15px;
                    right: 15px;
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(whatsappBtn);
    }

    // Create WhatsApp button on all pages except contact page
    if (!window.location.pathname.includes('contact')) {
        createWhatsAppButton();
    }

    // Back to top button
    function createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Back to Top';
        
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 45px;
                height: 45px;
                background: rgba(65, 105, 225, 0.9);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                background: rgba(72, 61, 139, 1);
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .back-to-top {
                    left: 15px;
                    bottom: 90px;
                    width: 40px;
                    height: 40px;
                    font-size: 0.9rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(backToTopBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    createBackToTopButton();

    // Console log for developers
    console.log('%c🚀 MAKWELL Website Loaded Successfully!', 'color: #4169E1; font-size: 16px; font-weight: bold;');
    console.log('%cRoyal Blue & Creamy Theme - Navigation FIXED - No color changes on scroll!', 'color: #4169E1; font-size: 12px;');
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for global use if needed
window.makwellUtils = {
    debounce,
    throttle
};

// Emergency CSS fix function - call if styles are missing
window.emergencyFixCSS = function() {
    console.log('MAKWELL: Applying emergency CSS fixes...');
    
    const emergencyCSS = `
        <style id="makwell-emergency-fix">
            /* EMERGENCY NAVIGATION FIX */
            .navbar {
                background: rgba(255, 253, 240, 1) !important;
                background-color: rgba(255, 253, 240, 1) !important;
            }
            .nav-link, .nav-logo h2, .nav-logo-text h2 {
                color: rgba(65, 105, 225, 1) !important;
            }
            .tagline {
                color: rgba(72, 61, 139, 1) !important;
            }
            
            /* EMERGENCY PAGE CONTENT FIX */
            .section-title {
                color: rgba(65, 105, 225, 1) !important;
                font-size: 2.5rem !important;
                font-weight: 700 !important;
                margin-bottom: 1rem !important;
            }
            .section-subtitle {
                color: rgba(72, 61, 139, 1) !important;
                font-size: 1.1rem !important;
            }
            .about-card, .contact-card, .product-card, .feature-card {
                background: white !important;
                border: 2px solid rgba(65, 105, 225, 0.2) !important;
                border-radius: 1rem !important;
                padding: 1.5rem !important;
                margin-bottom: 1rem !important;
                box-shadow: 0 4px 6px rgba(65, 105, 225, 0.1) !important;
            }
            .about-card h3, .contact-card h3, .product-info h4, .feature-card h3 {
                color: rgba(65, 105, 225, 1) !important;
                font-size: 1.3rem !important;
                font-weight: 600 !important;
                margin-bottom: 0.5rem !important;
            }
            .about-card p, .contact-card p, .product-features li, .feature-card p {
                color: rgba(72, 61, 139, 1) !important;
                line-height: 1.6 !important;
            }
            
            /* EMERGENCY LAYOUT FIX */
            .container {
                max-width: 1200px !important;
                margin: 0 auto !important;
                padding: 0 1rem !important;
            }
            .about-section, .contact-section, .products-section {
                padding: 100px 0 4rem !important;
                background: white !important;
            }
            .about-text, .contact-content {
                display: grid !important;
                gap: 2rem !important;
            }
        </style>
    `;
    
    if (!document.getElementById('makwell-emergency-fix')) {
        document.head.insertAdjacentHTML('beforeend', emergencyCSS);
    }
    
    console.log('MAKWELL: Emergency CSS fixes applied!');
};