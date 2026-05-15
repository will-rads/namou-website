/* Namou v2 — motion layer + shared contact constants */
window.Namou = window.Namou || {};
window.Namou.PHONE = "971569636360";
window.Namou.PHONE_DISPLAY = "+971 56 963 6360";
window.Namou.EMAIL = "reachus@namou.ae";

/* Active nav state — match the current pathname against nav anchors and
   tag the matching link with aria-current="page" + .is-active. */
(function () {
  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute("href").replace(/\/+$/, "");
    if (href === path) {
      a.setAttribute("aria-current", "page");
      a.classList.add("is-active");
    }
  });
})();
/**
 * Build a wa.me deep link with a pre-filled message.
 * @param {string} msg — plain-text message (will be URL-encoded)
 */
window.Namou.waUrl = function (msg) {
  return "https://wa.me/" + window.Namou.PHONE + "?text=" + encodeURIComponent(msg);
};

/* v3 intentionally does not run the inherited v2 intent modal. The
   audience-router cards and page-specific WhatsApp links already carry
   intent, so wa.me CTAs should open their pre-written messages directly. */

(function () {
  "use strict";

  // ── Mobile menu
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    function setMenuState(open) {
      mobileMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    }
    navToggle.addEventListener("click", function () {
      setMenuState(!mobileMenu.classList.contains("is-open"));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenuState(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) setMenuState(false);
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

  // ── Stat count-up — animate from 0 to the displayed integer when a stat
  //    enters the viewport. Detects the "1,000+", "25,000+", "~30M" formats
  //    on landowner and the "0%" cell on home, parses out the numeric core,
  //    and re-injects with the original prefix/suffix preserved.
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function parseStatText(text) {
    var match = text.match(/^(\D*)([\d,]+(?:\.\d+)?)([^\d]*)$/);
    if (!match) return null;
    var num = parseFloat(match[2].replace(/,/g, ""));
    if (!isFinite(num)) return null;
    return { prefix: match[1], value: num, suffix: match[3], original: text };
  }
  function formatStat(value, parsed) {
    var rounded = parsed.value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
    var withCommas = rounded >= 1000
      ? Math.round(rounded).toLocaleString("en-US")
      : String(rounded);
    return parsed.prefix + withCommas + parsed.suffix;
  }
  function countUp(el) {
    if (prefersReducedMotion) return;
    var parsed = parseStatText(el.textContent.trim());
    if (!parsed) return;
    var duration = 900;
    var start = performance.now();
    var initial = 0;
    function step(now) {
      var t = Math.min(1, (now - start) / duration);
      // ease-out-quart to match --ease curve
      var eased = 1 - Math.pow(1 - t, 4);
      var value = initial + (parsed.value - initial) * eased;
      el.textContent = formatStat(value, parsed);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = parsed.original;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          countUp(e.target);
          statObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll(".stat__num, .bento__stat").forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // ── Scroll progress bar — single fixed line at the top of the viewport.
  //    On browsers without scroll-driven CSS timelines, this rAF loop drives
  //    the same .scroll-progress element. With them, the CSS animation wins
  //    (no JS run). Cheap fallback — capped at one rAF per scroll.
  var progressEl = document.createElement("div");
  progressEl.className = "scroll-progress";
  progressEl.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressEl);
  var supportsScrollTimeline =
    typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: scroll()");
  if (!supportsScrollTimeline && !prefersReducedMotion) {
    var ticking = false;
    function updateProgress() {
      var doc = document.documentElement;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      var pct = max > 0 ? scrolled / max : 0;
      progressEl.style.transform = "scaleX(" + pct.toFixed(4) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    updateProgress();
  }

})();

/* Masterplan stop-motion reveal — swaps among 11 pre-rendered frames as the
   page scrolls through the .hero__plan-reveal section. Threshold table maps
   scroll progress (0…1 across the 150vh section) to a frame index. CSS handles
   the 120ms cross-fade via .is-active. Frames preload before the listener
   activates so the first swap doesn't flash a blank image. Reduced-motion
   bails out and lets CSS render the final frame statically. */
(function () {
  var section = document.querySelector(".hero__plan-reveal");
  if (!section) return;
  var frames = section.querySelectorAll(".hero__plan-frame");
  if (!frames.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Initial visible state is Frame-6 (data-frame=0) — all five plots rendered,
  // no building yet. Scroll progression then peels the building's floors
  // bottom-to-top across Frame-7 through Frame-11 (data-frames 1..5).
  var FRAME_THRESHOLDS = [
    { threshold: 0.00, frame: 0 },
    { threshold: 0.05, frame: 1 },
    { threshold: 0.20, frame: 2 },
    { threshold: 0.40, frame: 3 },
    { threshold: 0.60, frame: 4 },
    { threshold: 0.80, frame: 5 }
  ];

  var activeFrame = 0;
  var ticking = false;

  function getFrameForProgress(progress) {
    var frame = 0;
    for (var i = 0; i < FRAME_THRESHOLDS.length; i++) {
      if (progress >= FRAME_THRESHOLDS[i].threshold) {
        frame = FRAME_THRESHOLDS[i].frame;
      } else {
        break;
      }
    }
    return frame;
  }

  function updateFrame() {
    ticking = false;
    // Map progress against total page scroll from y=0 to the section's bottom
    // edge — so the first pixel of scroll already nudges Frame-1 toward Frame-2.
    // Anchoring to the section's own height (rect-relative) waited for the
    // section to reach the viewport top before progressing, which left the
    // user staring at Frame-1 through all 60vh of hero copy above.
    var vh = window.innerHeight;
    var sectionBottom = section.offsetTop + section.offsetHeight;
    var totalScrollable = sectionBottom - vh;
    if (totalScrollable <= 0) return;
    var progress = Math.max(0, Math.min(1, window.scrollY / totalScrollable));
    var target = getFrameForProgress(progress);
    if (target !== activeFrame) {
      frames[activeFrame].classList.remove("is-active");
      frames[target].classList.add("is-active");
      activeFrame = target;
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateFrame);
    }
  }

  function preloadFrames() {
    var pending = [];
    for (var i = 0; i < frames.length; i++) {
      var img = frames[i];
      if (img.complete && img.naturalWidth > 0) continue;
      pending.push(new Promise(function (resolve) {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      }));
    }
    return Promise.all(pending);
  }

  preloadFrames().then(function () {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateFrame();
  });
})();
