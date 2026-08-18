/* ============================================
   FLOLABS — SHARED SITE BEHAVIOUR
   ============================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Header scroll state -------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------- Mobile nav toggle -------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-nav__close');

  function openNav() {
    mobileNav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var firstLink = mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });
    if (mobileClose) mobileClose.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeNav();
    });
  }

  /* -------- Custom cursor (desktop / fine pointer only) -------- */
  var supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (supportsFinePointer) {
    var ring = document.createElement('div');
    ring.className = 'cursor-ring is-hidden';
    var dot = document.createElement('div');
    dot.className = 'cursor-dot is-hidden';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add('has-custom-cursor');

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    var shown = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
      if (!shown) {
        ring.classList.remove('is-hidden');
        dot.classList.remove('is-hidden');
        shown = true;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      ring.classList.add('is-hidden');
      dot.classList.add('is-hidden');
    });

    function raf() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    var hoverTargets = 'a, button, input, textarea, select, [data-cursor-hover]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) ring.classList.remove('is-hover');
    });
  }

  /* -------- Viewport reveal system -------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .slide-left, .slide-right');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -------- Active nav link highlighting -------- */
  var currentPage = document.body.getAttribute('data-page');
  if (currentPage) {
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === currentPage) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* -------- Current year in footer -------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();