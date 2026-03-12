/* ===========================================
   NAMOU PROPERTIES — Main JavaScript
   Mobile nav, scroll reveal, stat counter
   =========================================== */

(function () {
  'use strict';

  // --- Mobile Navigation Toggle ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    var navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }


  // --- Scroll Reveal Animation ---
  var revealElements = document.querySelectorAll(
    '.action-card, .advantage, .stat, .broker-feature, .property-card, .contact__text, .contact__info'
  );

  // Add reveal class
  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  // --- Animated Stat Counter ---
  var statNumbers = document.querySelectorAll('.stat__number[data-target]');
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 1800;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out quad
        var eased = 1 - (1 - progress) * (1 - progress);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(step);
    });
  }

  var statsSection = document.getElementById('stats');
  if (statsSection) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }


  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = document.querySelector('.nav').offsetHeight;
        var targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  // --- Nav Background Enhancement on Scroll ---
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
      } else {
        nav.style.background = 'rgba(10, 10, 10, 0.85)';
      }
    }, { passive: true });
  }

})();
