/* Namou v2 — motion layer */
(function () {
  "use strict";

  // ── Theme toggle
  var themeToggle = document.getElementById("themeToggle");
  var saved = localStorage.getItem("namou-v2-theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var next = cur === "dark" ? "light" : "dark";
      if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("namou-v2-theme", next);
    });
  }

  // ── Mobile menu
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
      });
    });
  }

  // ── Fade-in on scroll (ScrollTrigger-lite using IntersectionObserver)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () {
              e.target.classList.add("motion-in");
            }, i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-40px 0px" }
    );
    document.querySelectorAll(".motion-fade").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".motion-fade").forEach(function (el) {
      el.classList.add("motion-in");
    });
  }

  // ── Scrubbing text reveal (word-by-word opacity scrub)
  function setupScrub(container) {
    if (!container) return;
    var words = container.querySelectorAll(".scrub-word");
    if (!words.length) return;
    function update() {
      var rect = container.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.8;
      var end = vh * 0.2;
      var progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      var activeIdx = Math.floor(progress * words.length);
      words.forEach(function (w, i) {
        if (i < activeIdx) w.classList.add("active");
        else w.classList.remove("active");
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
  document.querySelectorAll("[data-scrub]").forEach(setupScrub);

  // ── Subtle parallax on hero inline image (follows cursor slightly)
  var heroImg = document.querySelector(".hero__inline-img");
  if (heroImg && window.matchMedia("(min-width: 900px)").matches) {
    document.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 12;
      var y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroImg.style.transform =
        "translate(" + x.toFixed(2) + "px, calc(-0.1em + " + y.toFixed(2) + "px))";
    });
  }
})();
