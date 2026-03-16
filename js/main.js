/**
 * DirecTokunbo - Car Auction Website
 * Main JavaScript
 */

import { initAnimations } from './animations.js';
import { initHeroParticles } from './hero3d.js';

document.addEventListener('DOMContentLoaded', function () {

  // ===== INIT GSAP + Three.js =====
  initAnimations();
  initHeroParticles();
  initTickerHoverCards();

  // ===== UTILITIES =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== CURRENT YEAR =====
  const yearSpan = $('#currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ===== HEADER SCROLL =====
  const header = $('#header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.pageYOffset > 60);
  }, { passive: true });

  // ===== MOBILE NAVIGATION =====
  const navToggle = $('#navToggle');
  const mainNav = $('#mainNav');
  const headerActions = $('.header-actions');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      mainNav?.classList.toggle('active');
      headerActions?.classList.toggle('active');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav?.classList.remove('active');
        headerActions?.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== SMOOTH SCROLL =====
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = $(targetId);
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 80) + 20;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ===== CATEGORY FILTER TABS =====
  const catTabs = $$('.cat-tab');
  const listingCards = $$('.listing-card[data-cat]');

  catTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      catTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const cat = this.dataset.cat;
      listingCards.forEach(card => {
        const matches = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !matches);
      });
    });
  });

  // ===== WATCH / FAVORITE BUTTONS =====
  $$('.listing-watch, .listing-watch-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('active');
      // Also toggle the paired button if both exist on same card
      const card = this.closest('.listing-card');
      if (card) {
        card.querySelectorAll('.listing-watch, .listing-watch-btn').forEach(b => {
          b.classList.toggle('active', this.classList.contains('active'));
        });
      }
    });
  });

  // ===== AUCTION COUNTDOWN TIMERS =====
  function formatTime(totalSeconds) {
    if (totalSeconds <= 0) return 'Ended';
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    if (days > 0) return `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
    if (hours > 0) return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }

  const timers = $$('.auction-timer[data-hours]');
  if (timers.length) {
    // Store end time as ms from now
    timers.forEach(el => {
      const hoursLeft = parseFloat(el.dataset.hours);
      el.dataset.endMinutes = Date.now() + hoursLeft * 3600 * 1000;
    });

    // Immediate first render
    timers.forEach(el => {
      const msLeft = el.dataset.endMinutes - Date.now();
      el.textContent = formatTime(Math.floor(msLeft / 1000));
    });

    setInterval(() => {
      timers.forEach(el => {
        const msLeft = el.dataset.endMinutes - Date.now();
        const secsLeft = Math.floor(msLeft / 1000);
        el.textContent = formatTime(secsLeft);

        const timerEl = el.closest('.listing-timer');
        if (timerEl && secsLeft < 7200 && secsLeft > 0) {
          timerEl.classList.add('listing-timer-urgent');
        }
      });
    }, 1000); // Update every second
  }


  // ===== CONTACT FORM =====
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = `<svg class="icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/></svg> Sending…`;
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          submitBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!`;
          submitBtn.style.background = '#22c55e';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        submitBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Failed — Try Again`;
        submitBtn.style.background = '#ef4444';
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2500);
      }
    });
  }

  // ===== INVENTORY VIEW TOGGLE (inventory.html) =====
  const gridViewBtn = $('#gridView');
  const listViewBtn = $('#listView');
  const inventoryGridEl = $('#inventoryGrid');

  if (gridViewBtn && listViewBtn && inventoryGridEl) {
    gridViewBtn.addEventListener('click', () => {
      inventoryGridEl.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });
    listViewBtn.addEventListener('click', () => {
      inventoryGridEl.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }

  // ===== PAGINATION =====
  $$('.page-num').forEach(num => {
    num.addEventListener('click', function () {
      $$('.page-num').forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

});

// ===== TICKER HOVER CARDS =====
function initTickerHoverCards() {
  const lookup = {
    'toyota highlander': { image: 'assets/images/toyota-highlander.jpg' },
    'lexus rx':          { image: 'assets/images/lexus-rx.jpg' },
    'mercedes gle':      { image: 'assets/images/mercedes-gle.jpg' },
    'bmw x5':            { image: 'assets/images/bmw-x5.jpg' },
    'audi q7':           { image: 'assets/images/audi-q7.jpg' },
    'land rover':        { image: 'assets/images/land-rover-defender.jpg' },
    'nissan patrol':     { image: 'assets/images/inventory-3.jpg' },
    'toyota fortuner':   { image: 'assets/images/toyota-highlander.jpg' },
  };

  const card = document.createElement('div');
  card.className = 'ticker-hover-card';
  card.innerHTML = `
    <img class="ticker-hover-img" src="" alt="">
    <div class="ticker-hover-body">
      <div class="ticker-hover-title"></div>
      <div class="ticker-hover-price"></div>
      <a href="inventory.html" class="ticker-hover-link">View Vehicle →</a>
    </div>`;
  document.body.appendChild(card);

  let hideTimer;

  document.querySelectorAll('.ticker-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
      clearTimeout(hideTimer);
      const text = this.textContent.toLowerCase();
      let imgSrc = null;
      for (const [key, val] of Object.entries(lookup)) {
        if (text.includes(key)) { imgSrc = val.image; break; }
      }
      if (!imgSrc) return;

      const title = this.querySelector('strong')?.textContent || '';
      const priceMatch = this.textContent.match(/₦[\d,]+/);
      const price = priceMatch ? priceMatch[0] + ' current bid' : 'View listing';

      card.querySelector('.ticker-hover-img').src = imgSrc;
      card.querySelector('.ticker-hover-img').alt = title;
      card.querySelector('.ticker-hover-title').textContent = title;
      card.querySelector('.ticker-hover-price').textContent = price;

      const rect = this.getBoundingClientRect();
      const cardW = 220;
      const left = Math.min(Math.max(rect.left, 8), window.innerWidth - cardW - 8);
      const top = rect.top - 230;
      card.style.left = left + 'px';
      card.style.top = (top < 8 ? rect.bottom + 8 : top) + 'px';
      card.classList.add('visible');
    });

    item.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => card.classList.remove('visible'), 180);
    });
  });

  card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  card.addEventListener('mouseleave', () => card.classList.remove('visible'));
}

// Spin animation CSS
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}`;
document.head.appendChild(spinStyle);

// ===== FAQ ACCORDION (standalone — isolated from other JS) =====
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var item = this.closest('.accordion-item');
      var panel = item.querySelector('.accordion-panel');
      var isOpen = this.getAttribute('aria-expanded') === 'true';

      // Close all other panels
      document.querySelectorAll('.accordion-item').forEach(function (other) {
        if (other === item) return;
        var otherToggle = other.querySelector('.accordion-toggle');
        var otherPanel = other.querySelector('.accordion-panel');
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        other.classList.remove('active');
        if (otherPanel) otherPanel.style.maxHeight = '0';
      });

      if (isOpen) {
        this.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        panel.style.maxHeight = '0';
      } else {
        this.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
});

// ===== IMAGE ERROR FALLBACK =====
document.addEventListener('error', function(e) {
  if (e.target.tagName !== 'IMG') return;
  const container = e.target.closest('.listing-img');
  if (container) {
    e.target.style.display = 'none';
    container.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%)';
  } else {
    e.target.style.opacity = '0';
  }
}, true);
