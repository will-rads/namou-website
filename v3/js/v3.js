/* v3 page logic — plot filter on /buy, deal filter on /invest/deals,
   and form-to-WhatsApp on the eval + broker register forms.
   Each block guards on element presence so a single file works on every
   page without errors. */

// ── Buy plot filter ─────────────────────────────────────
// v2-style filter set: minSqft + maxSqft (numeric thresholds) + use (Type)
// + area + budget (AED range like "0-10000000").
//
// Default-collapse: shows only the first 6 *matched* plots. "See more
// lands" button (#plot-more) expands the grid to all matched. On any
// filter change, the expanded state resets to false so the 6-cap
// reapplies and the button reappears if matches > LIMIT.
(function () {
  var grid = document.getElementById("plot-grid");
  if (!grid) return;
  var fields = ["minSqft", "maxSqft", "use", "area", "budget"].map(function (k) {
    return { key: k, el: document.getElementById("f-" + k) };
  });
  var countEl = document.getElementById("filter-count");
  var emptyEl = document.getElementById("plot-empty");
  var moreBtn = document.getElementById("plot-more");
  var plots = grid.querySelectorAll(".v3-plot");

  var LIMIT = 6;
  var expanded = false;

  function setQS() {
    var params = new URLSearchParams();
    fields.forEach(function (f) {
      if (f.el && f.el.value) params.set(f.key, f.el.value);
    });
    var qs = params.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }
  function readQS() {
    var p = new URLSearchParams(window.location.search);
    fields.forEach(function (f) {
      if (f.el && p.has(f.key)) f.el.value = p.get(f.key);
    });
  }

  function apply() {
    var minS   = fields[0].el && fields[0].el.value ? parseInt(fields[0].el.value, 10) : null;
    var maxS   = fields[1].el && fields[1].el.value ? parseInt(fields[1].el.value, 10) : null;
    var use    = fields[2].el ? fields[2].el.value : "";
    var area   = fields[3].el ? fields[3].el.value : "";
    var budget = fields[4].el ? fields[4].el.value : "";

    var bMin = null, bMax = null;
    if (budget) {
      var parts = budget.split("-");
      bMin = parseInt(parts[0], 10);
      bMax = parseInt(parts[1], 10);
    }

    var matched = 0;
    var visible = 0;
    plots.forEach(function (p) {
      var sqft = parseInt(p.getAttribute("data-size"), 10);
      var aed  = parseInt(p.getAttribute("data-price"), 10);
      var ok = (!use  || p.getAttribute("data-use")  === use) &&
               (!area || p.getAttribute("data-area") === area) &&
               (minS == null || isNaN(sqft) || sqft >= minS) &&
               (maxS == null || isNaN(sqft) || sqft <= maxS) &&
               (bMin == null || isNaN(aed)  || (aed >= bMin && aed <= bMax));
      if (ok) {
        matched += 1;
        if (expanded || matched <= LIMIT) {
          p.style.display = "";
          visible += 1;
        } else {
          p.style.display = "none";
        }
      } else {
        p.style.display = "none";
      }
    });

    if (countEl) {
      if (matched === 0) {
        countEl.textContent = "Showing 0 plots";
      } else if (visible === matched) {
        countEl.textContent = "Showing all " + matched + " plots";
      } else {
        countEl.textContent = "Showing " + visible + " of " + matched + " plots";
      }
    }
    if (emptyEl) emptyEl.hidden = matched !== 0;
    if (moreBtn) {
      moreBtn.hidden = expanded || matched <= LIMIT;
    }
    setQS();
  }

  readQS();
  fields.forEach(function (f) {
    if (f.el) f.el.addEventListener("change", function () {
      // Filter changed → reset to collapsed state so the 6-cap reapplies
      // and the "See more lands" button reappears for new match counts >LIMIT.
      expanded = false;
      apply();
    });
  });
  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      expanded = true;
      apply();
    });
  }
  apply();
})();

// ── Deal filter ─────────────────────────────────────────
(function () {
  var grid = document.getElementById("deal-grid");
  if (!grid) return;
  var modelSel = document.getElementById("d-model");
  var statusSel = document.getElementById("d-status");
  var countEl = document.getElementById("deal-count");
  var deals = grid.querySelectorAll(".v3-deal");

  function setQS() {
    var p = new URLSearchParams();
    if (modelSel && modelSel.value) p.set("model", modelSel.value);
    if (statusSel && statusSel.value) p.set("status", statusSel.value);
    var qs = p.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }
  function readQS() {
    var p = new URLSearchParams(window.location.search);
    if (modelSel && p.has("model")) modelSel.value = p.get("model");
    if (statusSel && p.has("status")) statusSel.value = p.get("status");
  }
  function apply() {
    var m = modelSel ? modelSel.value : "";
    var s = statusSel ? statusSel.value : "";
    var visible = 0;
    deals.forEach(function (d) {
      var ok = (!m || d.getAttribute("data-model") === m) &&
               (!s || d.getAttribute("data-status") === s);
      d.style.display = ok ? "" : "none";
      if (ok) visible += 1;
    });
    if (countEl) countEl.textContent = "Showing " + visible + " of " + deals.length + " deals";
    setQS();
  }
  readQS();
  if (modelSel) modelSel.addEventListener("change", apply);
  if (statusSel) statusSel.addEventListener("change", apply);
  apply();
})();

// ── Broker scheduling form (was register form). On submit, builds a
//    WhatsApp deeplink with the form details and opens it so the broker
//    can confirm the call + receive the A2A from Namou.
//
//    No backend, no calendar API — this is a frontend-only handoff to
//    WhatsApp. The "video call confirmation" + "A2A signing" referenced
//    in the message both happen manually on the WhatsApp thread; the
//    page does not auto-confirm or auto-sign.
// Sheet-backed homepage FAQ renderer.
//
// Primary source: the published Google Sheet CSV export, fetched directly from
// the browser (`data-faq-sheet-csv`). Google sets `Access-Control-Allow-Origin:
// *` and `Cache-Control: no-store` on the CSV export, so cross-origin fetch
// from the deployed site succeeds and always returns fresh sheet content
// (Google's own CSV-export cache typically refreshes within ~1–2 min of an
// edit). This makes spreadsheet edits effectively near-real-time on the site
// — no `npm run sync:faqs`, no commit, no redeploy required. Refresh the
// homepage and the change is visible.
//
// Fallback chain (only used when the live sheet fetch fails — offline, CORS
// regression, Google outage, ad-blocker, etc.):
//   1. Local static JSON snapshot at `data-faq-source` (default
//      `/v3/data/faqs.json`). Maintained by `npm run sync:faqs` for offline
//      previews and as a safety net; no longer the primary data source.
//   2. Inert `<template data-faq-static>` cloned into the list, so the FAQ
//      section never renders empty.
//
// Filter / sort / article-link parsing apply uniformly to all three sources.
(function () {
  var lists = document.querySelectorAll("[data-faq-list]");
  if (!lists.length) return;

  function parseArticle(article) {
    var text = String(article || "").trim();
    if (!text) return null;

    var match = text.match(/https?:\/\/\S+$/);
    if (!match) return null;

    var url = match[0];
    var label = text.slice(0, match.index).replace(/\s+[-–—]\s*$/, "").trim();
    return {
      label: label || url,
      url: url
    };
  }

  function buildItem(row) {
    var details = document.createElement("details");
    details.className = "faq__item";

    var summary = document.createElement("summary");
    summary.textContent = row.question || "";

    var body = document.createElement("div");
    body.className = "faq__body";

    var answer = document.createElement("p");
    answer.textContent = row.answer || "";

    body.appendChild(answer);

    var article = parseArticle(row.article);
    if (article) {
      var source = document.createElement("p");
      source.className = "faq__source";
      source.appendChild(document.createTextNode("Reference: "));

      var link = document.createElement("a");
      link.href = article.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = article.label;

      source.appendChild(link);
      body.appendChild(source);
    }

    details.appendChild(summary);
    details.appendChild(body);
    return details;
  }

  function renderRows(list, rows) {
    var selected = rows
      .filter(function (row) {
        var status = String(row.status || "").trim().toLowerCase();
        return status === "active";
      })
      .sort(function (a, b) {
        return (parseInt(a.sort_order, 10) || 0) - (parseInt(b.sort_order, 10) || 0);
      });

    list.innerHTML = "";
    selected.forEach(function (row) {
      list.appendChild(buildItem(row));
    });
  }

  function renderStaticFallback(list) {
    var template = list.querySelector("[data-faq-static]");
    if (!template || !template.content) return;
    list.innerHTML = "";
    list.appendChild(template.content.cloneNode(true));
  }

  // Minimal RFC4180-ish CSV parser. Handles quoted fields, escaped quotes
  // (""), embedded commas, embedded newlines, BOM, and CRLF/LF line endings.
  function parseCsv(text) {
    if (!text) return [];
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;
    var len = text.length;

    while (i < len) {
      var c = text.charAt(i);
      if (inQuotes) {
        if (c === "\"") {
          if (text.charAt(i + 1) === "\"") { field += "\""; i += 2; }
          else { inQuotes = false; i += 1; }
        } else {
          field += c; i += 1;
        }
      } else {
        if (c === "\"") { inQuotes = true; i += 1; }
        else if (c === ",") { row.push(field); field = ""; i += 1; }
        else if (c === "\r") { i += 1; }
        else if (c === "\n") {
          row.push(field); rows.push(row);
          row = []; field = ""; i += 1;
        } else { field += c; i += 1; }
      }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return String(h || "").trim(); });
    return rows.slice(1)
      .filter(function (r) { return r.some(function (c) { return String(c || "").length > 0; }); })
      .map(function (r) {
        var obj = {};
        headers.forEach(function (h, idx) { obj[h] = String(r[idx] != null ? r[idx] : "").trim(); });
        return obj;
      });
  }

  function fetchSheetCsv(url) {
    return fetch(url, { cache: "no-store", redirect: "follow" })
      .then(function (response) {
        if (!response.ok) throw new Error("Sheet CSV fetch failed: " + response.status);
        return response.text();
      })
      .then(function (text) {
        var rows = parseCsv(text);
        if (!rows.length) throw new Error("Sheet CSV parsed to zero rows");
        return rows;
      });
  }

  function fetchJsonSnapshot(url) {
    return fetch(url, { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("JSON snapshot fetch failed: " + response.status);
        return response.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) throw new Error("JSON snapshot is not an array");
        return rows;
      });
  }

  lists.forEach(function (list) {
    var sheetUrl = list.getAttribute("data-faq-sheet-csv") || "";
    var jsonUrl = list.getAttribute("data-faq-source") || "/v3/data/faqs.json";

    var primary = sheetUrl
      ? fetchSheetCsv(sheetUrl).catch(function (err) {
          if (window.console && console.warn) console.warn("[FAQ] sheet CSV failed, falling back to JSON snapshot:", err.message);
          return fetchJsonSnapshot(jsonUrl);
        })
      : fetchJsonSnapshot(jsonUrl);

    primary
      .then(function (rows) { renderRows(list, rows); })
      .catch(function (err) {
        if (window.console && console.warn) console.warn("[FAQ] all fetches failed, rendering static fallback:", err.message);
        renderStaticFallback(list);
      });
  });
})();

// Homepage News & Updates carousel controller. Drives the scroll-snap
// viewport + JS-rendered pagination dots and prev/next arrows on
// `.home-news` (homepage final-major section). Page count is derived
// from viewport vs track width so the same controller handles 3-up
// (desktop), 2-up (tablet), and 1-up (mobile) layouts. The viewport is
// already a horizontal-scroll container in CSS, so if this script
// fails the user still gets a working swipe; the controller only adds
// dot/arrow controls and active-page indication on top.
(function () {
  var viewport = document.querySelector("[data-news-viewport]");
  if (!viewport) return;
  var dotsContainer = document.querySelector("[data-news-dots]");
  var prevBtn = document.querySelector("[data-news-prev]");
  var nextBtn = document.querySelector("[data-news-next]");
  if (!dotsContainer || !prevBtn || !nextBtn) return;
  var mobileNewsMq = window.matchMedia ? window.matchMedia("(max-width: 768px)") : null;

  function isMobileNews() {
    return mobileNewsMq && mobileNewsMq.matches;
  }

  function getCardStep() {
    var card = viewport.querySelector(".home-news__card");
    if (!card) return viewport.clientWidth || 1;
    var styles = window.getComputedStyle(viewport.querySelector(".home-news__track"));
    var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function getCardsPerPage() {
    if (isMobileNews()) return 1;
    var step = getCardStep();
    if (step <= 0) return 1;
    return Math.max(1, Math.round(viewport.clientWidth / step));
  }

  function getTotalCards() {
    return viewport.querySelectorAll(".home-news__card").length;
  }

  function getPageCount() {
    var total = getTotalCards();
    var perPage = getCardsPerPage();
    return Math.max(1, Math.ceil(total / perPage));
  }

  function getCurrentPage() {
    var step = getCardStep();
    var perPage = getCardsPerPage();
    if (step <= 0 || perPage <= 0) return 0;
    return Math.round(viewport.scrollLeft / (step * perPage));
  }

  function setActivePage(pageIndex) {
    var pages = getPageCount();
    var current = Math.min(Math.max(0, pageIndex), pages - 1);
    var dots = dotsContainer.querySelectorAll(".home-news__dot");
    dots.forEach(function (d, i) {
      var active = i === current;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
      d.tabIndex = active ? 0 : -1;
    });
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= pages - 1;
  }

  function scrollToPage(pageIndex) {
    var step = getCardStep();
    var perPage = getCardsPerPage();
    var maxScroll = viewport.scrollWidth - viewport.clientWidth;
    var pages = getPageCount();
    var current = Math.min(Math.max(0, pageIndex), pages - 1);
    var target = Math.min(maxScroll, Math.max(0, current * perPage * step));
    setActivePage(current);
    viewport.scrollTo({ left: target, behavior: "smooth" });
  }

  function updateNav() {
    setActivePage(getCurrentPage());
  }

  function buildDots() {
    var pages = getPageCount();
    dotsContainer.innerHTML = "";
    for (var i = 0; i < pages; i += 1) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "home-news__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Page " + (i + 1) + " of " + pages);
      (function (idx) {
        dot.addEventListener("click", function () { scrollToPage(idx); });
      })(i);
      dotsContainer.appendChild(dot);
    }
    updateNav();
  }

  prevBtn.addEventListener("click", function () { scrollToPage(getCurrentPage() - 1); });
  nextBtn.addEventListener("click", function () { scrollToPage(getCurrentPage() + 1); });

  var scrollTimer;
  viewport.addEventListener("scroll", function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateNav, 60);
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 200);
  });

  buildDots();
})();

// Mobile swipe indicators for CSS snap rows. The rows remain native
// horizontal scrollers; this only adds lightweight dot/pill position UI.
(function () {
  var mq = window.matchMedia ? window.matchMedia("(max-width: 768px)") : null;
  var selectors = [
    ".v3-case__cards",
    ".section--lanes .lanes",
    ".v3-frame-group--sell-method .v3-feature-row--method",
    ".v3-frame-group--sell-method .v3-process__cards-row",
    ".v3-frame-group--invest-intro .v3-feature-row",
    ".v3-frame-group--invest-intro .v3-stats",
    ".v3-frame-group--invest-final .v3-usps",
    ".v3-frame-group--broker-pair .v3-feature-row",
    ".v3-frame-group--broker-pair-2 .v3-process__cards-row"
  ].join(",");

  function isMobile() {
    return !mq || mq.matches;
  }

  function getItems(row) {
    return Array.prototype.slice.call(row.children).filter(function (child) {
      var style = window.getComputedStyle(child);
      return style.display !== "none" && child.getBoundingClientRect().width > 0;
    });
  }

  function getRowPaddingLeft(row) {
    return parseFloat(window.getComputedStyle(row).paddingLeft || "0") || 0;
  }

  function getItemTarget(row, item) {
    return item.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - getRowPaddingLeft(row);
  }

  function getActiveIndex(row, items) {
    var anchor = row.getBoundingClientRect().left + getRowPaddingLeft(row);
    var active = 0;
    var best = Infinity;
    items.forEach(function (item, idx) {
      var distance = Math.abs(item.getBoundingClientRect().left - anchor);
      if (distance < best) {
        best = distance;
        active = idx;
      }
    });
    return active;
  }

  function updateIndicator(row) {
    var indicator = row.nextElementSibling;
    if (!indicator || !indicator.classList.contains("mobile-swipe-indicator")) return;
    var items = getItems(row);
    var active = getActiveIndex(row, items);
    var dots = indicator.querySelectorAll(".mobile-swipe-dot");
    dots.forEach(function (dot, idx) {
      var isActive = idx === active;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function buildIndicator(row) {
    var items = getItems(row);
    var existing = row.nextElementSibling && row.nextElementSibling.classList.contains("mobile-swipe-indicator")
      ? row.nextElementSibling
      : null;

    if (!isMobile() || items.length < 2 || row.scrollWidth <= row.clientWidth + 2) {
      if (existing) existing.remove();
      row.removeAttribute("data-mobile-swipe-indicator");
      return;
    }

    var indicator = existing || document.createElement("div");
    indicator.className = "mobile-swipe-indicator";
    indicator.setAttribute("aria-label", "Swipe position");

    if (!existing) row.insertAdjacentElement("afterend", indicator);
    indicator.innerHTML = "";

    items.forEach(function (item, idx) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "mobile-swipe-dot";
      dot.setAttribute("aria-label", "Go to item " + (idx + 1) + " of " + items.length);
      dot.addEventListener("click", function () {
        row.scrollTo({ left: getItemTarget(row, item), behavior: "smooth" });
      });
      indicator.appendChild(dot);
    });

    if (!row.getAttribute("data-mobile-swipe-indicator")) {
      var ticking = false;
      row.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateIndicator(row);
          ticking = false;
        });
      }, { passive: true });
      row.setAttribute("data-mobile-swipe-indicator", "true");
    }

    updateIndicator(row);
  }

  function initSwipeIndicators() {
    document.querySelectorAll(selectors).forEach(buildIndicator);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initSwipeIndicators, 160);
  });

  if (mq && mq.addEventListener) mq.addEventListener("change", initSwipeIndicators);
  else if (mq && mq.addListener) mq.addListener(initSwipeIndicators);

  initSwipeIndicators();
})();

(function () {
  var form = document.getElementById("broker-form");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get("brokerName") || "").trim();
    var company = (d.get("brokerCompany") || "").trim();
    var phone = (d.get("brokerPhone") || "").trim();
    var email = (d.get("brokerEmail") || "").trim();
    var date = (d.get("callDate") || "").trim();
    var time = (d.get("callTime") || "").trim();
    var notes = (d.get("notes") || "").trim();
    var preferred = [date, time].filter(Boolean).join(" ");
    var msg =
      "Hi Namou, I am a broker and would like to schedule a video call to review land opportunities and the A2A process. " +
      "My name is " + name + ", " +
      "company: " + company + ", " +
      "phone: " + phone + ", " +
      "email: " + email + ", " +
      "preferred call: " + preferred + ".";
    if (notes) msg += " Notes: " + notes + ".";
    msg += " Please send me the A2A to sign and confirm the video call.";
    window.open("https://wa.me/971569636360?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
})();
