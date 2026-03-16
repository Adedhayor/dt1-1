/**
 * DirecTokunbo - GSAP Animations
 * Simple, purposeful: hero reveal, scroll fade-ins, stat counters
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  initHeroAnimation();
  initScrollAnimations();
  initCounterAnimations();
}

// ========== HERO ANIMATION ==========

function initHeroAnimation() {
  const heroCopy = document.querySelector('.hero-copy');
  const heroPanel = document.querySelector('.hero-search-panel');

  if (!heroCopy) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from(heroCopy, { x: -40, opacity: 0, duration: 0.9 })
    .from(heroPanel, { x: 40, opacity: 0, duration: 0.9 }, '-=0.6');
}

// ========== SCROLL ANIMATIONS ==========

function initScrollAnimations() {
  // Section headers (badge → title → subtitle stagger)
  gsap.utils.toArray('.section-header').forEach(header => {
    const badge = header.querySelector('.section-badge');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');
    const els = [badge, title, subtitle].filter(Boolean);

    gsap.from(els, {
      scrollTrigger: { trigger: header, start: 'top 82%' },
      y: 28,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.out',
    });
  });

  // Stats row
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 78%' },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
  });

  // Inventory listing cards
  ScrollTrigger.create({
    trigger: '.inventory',
    start: 'top 72%',
    once: true,
    onEnter: () => {
      gsap.from('.listing-card', {
        y: 30,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power2.out',
      });
    },
  });

  // How It Works step cards
  gsap.from('.step-card', {
    scrollTrigger: { trigger: '.how-it-works', start: 'top 74%' },
    y: 35,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
  });

  // Why Us feature cards
  gsap.from('.feature-card', {
    scrollTrigger: { trigger: '.why-us', start: 'top 74%' },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out',
  });

  // Testimonials
  gsap.from('.testimonial-card', {
    scrollTrigger: { trigger: '.testimonials', start: 'top 78%' },
    y: 35,
    opacity: 0,
    duration: 0.65,
    stagger: 0.13,
    ease: 'power2.out',
  });

  // FAQ accordion items — y only, no opacity (opacity blocks click interaction)
  gsap.from('.accordion-item', {
    scrollTrigger: { trigger: '.faqs', start: 'top 74%' },
    y: 20,
    duration: 0.45,
    stagger: 0.07,
    ease: 'power1.out',
  });

  // Contact columns
  gsap.from('.contact-form-wrapper', {
    scrollTrigger: { trigger: '.contact', start: 'top 78%' },
    x: -35,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  });

  gsap.from('.contact-visual', {
    scrollTrigger: { trigger: '.contact', start: 'top 78%' },
    x: 35,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  });

  // CTA banner
  gsap.from('.cta-banner', {
    scrollTrigger: { trigger: '.cta-banner', start: 'top 82%' },
    scale: 0.97,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  });

  // Subtle hero background parallax on scroll
  gsap.to('.hero-bg', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: '20%',
    ease: 'none',
  });
}

// ========== COUNTER ANIMATIONS ==========

function initCounterAnimations() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.closest('.stat-item').dataset.count, 10);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            const v = Math.round(this.targets()[0].val);
            if (target >= 1000) {
              el.textContent = v >= 1000 ? (v / 1000).toFixed(target >= 100000 ? 0 : 1) + 'K' : v;
            } else {
              el.textContent = v;
            }
          },
          onComplete: () => {
            if (target >= 1000) {
              el.textContent = target >= 100000
                ? Math.round(target / 1000) + 'K'
                : (target / 1000).toFixed(1) + 'K';
            } else {
              el.textContent = target;
            }
          },
        });
      },
    });
  });
}
