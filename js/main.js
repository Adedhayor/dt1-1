/**
 * DirecTokunbo - Car Auction Website
 * Main JavaScript - Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', function () {
  // ========== UTILITIES ==========

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ========== HEADER SCROLL EFFECT ==========

  const header = $('#header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ========== MOBILE NAVIGATION ==========

  const navToggle = $('#navToggle');
  const mainNav = $('#mainNav');
  const headerActions = $('.header-actions');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('active');

      if (headerActions) {
        headerActions.classList.toggle('active');
      }

      // Prevent body scroll when menu is open
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });
  }

  // Close mobile nav when clicking a link
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        if (headerActions) {
          headerActions.classList.remove('active');
        }
      }
    });
  });

  // ========== SMOOTH SCROLL ==========

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (target) {
        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== CAR CAROUSEL ==========

  const carouselTrack = $('#cardsGrid');
  const prevBtn = $('.carousel-btn.prev');
  const nextBtn = $('.carousel-btn.next');

  if (carouselTrack && prevBtn && nextBtn) {
    const scrollAmount = () => {
      const card = carouselTrack.querySelector('.car-card');
      return card ? card.offsetWidth + 24 : 324; // Card width + gap
    };

    const scrollCarousel = (direction) => {
      const amount = direction === 'next' ? scrollAmount() : -scrollAmount();
      carouselTrack.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    };

    nextBtn.addEventListener('click', () => {
      scrollCarousel('next');
      resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
      scrollCarousel('prev');
      resetAutoScroll();
    });

    // Auto-scroll logic
    let autoScrollInterval;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        // If at the end, scroll back to start
        if (carouselTrack.scrollLeft + carouselTrack.offsetWidth >= carouselTrack.scrollWidth - 10) {
          carouselTrack.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          scrollCarousel('next');
        }
      }, 5000);
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };

    const resetAutoScroll = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', stopAutoScroll);
    carouselTrack.addEventListener('mouseleave', startAutoScroll);

    // Initial start
    startAutoScroll();
  }

  // ========== TABS ==========

  const tabs = $$('.tab');
  const cardsGrid = $('#cardsGrid');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      this.classList.add('active');

      // Animate cards
      const cards = $$('.car-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });
  });

  // ========== FAQ ACCORDION ==========

  const accordionToggles = $$('.accordion-toggle');

  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const item = this.parentElement;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other accordions
      accordionToggles.forEach(otherToggle => {
        if (otherToggle !== this) {
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.parentElement.classList.remove('active');
        }
      });

      // Toggle current
      this.setAttribute('aria-expanded', !isExpanded);
      item.classList.toggle('active');
    });
  });

  // ========== CONTACT FORM ==========

  const contactForm = $('#contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Get form data
      const formData = new FormData(this);
      const formObject = {};
      for (const [key, value] of formData) {
        formObject[key] = value;
      }

      // Log form data to console
      console.log('📧 Contact Form Submission:', formObject);

      // Show loading state
      submitBtn.innerHTML = `
        <svg class="icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        // Get phone number for success message
        const userPhone = formObject.phone || formObject.email || 'your contact';

        // Log success message
        console.log(`✅ Thank you! We will contact you at ${userPhone} shortly.`);

        submitBtn.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Message Sent!
        `;
        submitBtn.style.background = '#22c55e';

        // Show success alert
        alert(`Thank you! We will contact you at ${userPhone} shortly.`);

        // Reset form
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

  // ========== SEARCH FORM ==========

  const searchForm = $('#searchForm');

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form values
      const formData = new FormData(this);
      const params = new URLSearchParams();

      for (const [key, value] of formData) {
        if (value) params.append(key, value);
      }

      // Navigate to inventory page with filters
      const queryString = params.toString();
      const targetUrl = queryString ? `inventory.html?${queryString}` : 'inventory.html';
      window.location.href = targetUrl;
    });
  }

  // ========== CURRENT YEAR ==========

  const yearSpan = $('#currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========== INVENTORY VIEW TOGGLE ==========

  const gridViewBtn = $('#gridView');
  const listViewBtn = $('#listView');
  const inventoryGridElement = $('#inventoryGrid');

  if (gridViewBtn && listViewBtn && inventoryGridElement) {
    gridViewBtn.addEventListener('click', () => {
      inventoryGridElement.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
      inventoryGridElement.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }

  // ========== PAGINATION ==========

  const pageNums = $$('.page-num');
  pageNums.forEach(num => {
    num.addEventListener('click', function () {
      pageNums.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      // In a real app, this would trigger a data fetch
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ========== INITIALIZE ANIMATIONS ==========
  // (Assuming Motion One or similar is used elsewhere or handled by data-animate)
});

// ========== SCROLL ANIMATIONS ==========

const animateElements = document.querySelectorAll('[data-animate]');

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;

      setTimeout(() => {
        entry.target.classList.add('animated');
      }, parseInt(delay));

      animationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animateElements.forEach(el => {
  animationObserver.observe(el);
});

// ========== PERFORMANCE OPTIMIZATIONS ==========

// Debounce function
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

// ========== CONSOLE BRANDING ==========

console.log(
  '%c 🚗 DirectTokunbo ',
  'background: #f6cb12; color: #000; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
);
console.log('Import quality cars from China to Nigeria');

// ========== CSS FOR SPIN ANIMATION ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
