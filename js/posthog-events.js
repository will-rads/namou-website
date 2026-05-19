/* Semantic event tracking for Namou Properties.
   Loaded at the end of <body> on every HTML page, after /js/site.js.
   Each block guards on element presence so this file is safe to load
   on every page without per-page wiring.

   Privacy contract:
   - No names, phone numbers, emails, message bodies, or freeform notes
     are sent to PostHog or ad platforms.
   - We never read or forward the `text=` query parameter from
     WhatsApp links.
   - Sensitive form fields on /broker/register/ are tagged with the
     PostHog `ph-no-capture` class so autocapture skips them.

   Lead-to-WhatsApp bridge:
   - Every WhatsApp CTA click generates a first-party `lead_id` and an
     `event_id` for PostHog/ad-platform attribution. The lead_id is not
     appended to the visible WhatsApp message; exact inbound-chat
     matching requires Wassenger webhook logic, a visible reference, or
     another server-side matching strategy.
*/
(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }
  ready(boot);

  function boot() {
    var attribution = window.NamouAttribution;
    if (!attribution) {
      // attribution.js failed or was not loaded. Surface a console
      // warning so QA notices, but keep event handlers wired so PostHog
      // still receives them — degraded mode, not silent failure.
      if (window.console && window.console.warn) {
        window.console.warn("[namou] NamouAttribution not present; events will lack source attribution");
      }
      attribution = {
        flat: function () { return {}; },
        generateLeadId: function () { return "NAMOU-" + Date.now(); },
        generateEventId: function () { return "evt_" + Date.now(); }
      };
    }

    function ph() {
      return window.posthog && typeof window.posthog.capture === "function" ? window.posthog : null;
    }

    function inferAudience() {
      var p = (window.location.pathname || "").toLowerCase();
      if (p.indexOf("/buy") === 0) return "buyer";
      if (p.indexOf("/sell") === 0) return "seller";
      if (p.indexOf("/invest") === 0) return "investor";
      if (p.indexOf("/broker") === 0) return "broker";
      return "general";
    }

    function basePayload(extra) {
      var base = {
        page_path: window.location.pathname,
        page_url: window.location.href,
        page_title: document.title || "",
        audience: inferAudience(),
        viewport_width: window.innerWidth || 0,
        viewport_height: window.innerHeight || 0
      };
      if (extra) {
        Object.keys(extra).forEach(function (k) { base[k] = extra[k]; });
      }
      return base;
    }

    function capture(name, props) {
      var p = ph();
      if (!p) return;
      try {
        p.capture(name, basePayload(props || {}));
      } catch (e) {
        // never let analytics break the page
      }
    }

    function textOf(el) {
      if (!el) return "";
      return (el.textContent || el.innerText || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
    }

    function closest(target, selector) {
      if (!target || target.nodeType !== 1) return null;
      if (target.closest) return target.closest(selector);
      var el = target;
      while (el && el.nodeType === 1) {
        if (el.matches && el.matches(selector)) return el;
        el = el.parentElement;
      }
      return null;
    }

    function inferIntent(el, hrefType) {
      var text = (textOf(el) || "").toLowerCase();
      var path = (window.location.pathname || "").toLowerCase();
      if (text.indexOf("nda") !== -1) return "nda_request";
      if (text.indexOf("valuation") !== -1) return "free_valuation";
      if (text.indexOf("walk") !== -1 || text.indexOf("walkthrough") !== -1) return "plot_walkthrough";
      if (text.indexOf("video call") !== -1 || text.indexOf("schedule a call") !== -1) return "video_call";
      if (path.indexOf("/broker") === 0) return "broker_call";
      if (path.indexOf("/invest") === 0) return "investment_discussion";
      if (hrefType === "phone" || hrefType === "email") return "general_contact";
      if (path.indexOf("/sell") === 0) return "free_valuation";
      if (path.indexOf("/buy") === 0) return "plot_walkthrough";
      return "general_contact";
    }

    function inferSection(el) {
      var section = closest(el, "section, footer, header, nav");
      if (!section) return "";
      var label = section.getAttribute("data-section") ||
        section.getAttribute("id") ||
        section.getAttribute("aria-label") ||
        (section.tagName || "").toLowerCase();
      return label || "";
    }

    // ─── WhatsApp link enrichment (must run before any click) ──────
    // Lead IDs are generated for analytics only. Standard wa.me links
    // do not support hidden payloads, so we leave the visible message
    // untouched and match inbound chats through Wassenger separately.
    function prepareWhatsappLead(anchor) {
      if (!anchor || !anchor.href) return null;
      var href = anchor.href;
      if (href.indexOf("wa.me") === -1 && href.indexOf("whatsapp.com/send") === -1) return null;

      return {
        lead_id: attribution.generateLeadId(),
        event_id: attribution.generateEventId(),
        visible_reference_added: false
      };
    }

    // ─── Global click delegation ───────────────────────────────────
    document.addEventListener("click", function (e) {
      var target = e.target;
      if (!target || target.nodeType !== 1) return;

      var anchor = closest(target, "a[href]");
      if (!anchor) return;

      var href = anchor.getAttribute("href") || "";
      var lowerHref = href.toLowerCase();
      var hrefType = "";
      var channel = "";

      if (lowerHref.indexOf("wa.me") !== -1 || lowerHref.indexOf("whatsapp.com/send") !== -1) {
        hrefType = "whatsapp"; channel = "whatsapp";
      } else if (lowerHref.indexOf("tel:") === 0) {
        hrefType = "phone"; channel = "phone";
      } else if (lowerHref.indexOf("mailto:") === 0) {
        hrefType = "email"; channel = "email";
      }

      var intent = inferIntent(anchor, hrefType);
      var section = inferSection(anchor);
      var ctaText = textOf(anchor);

      // lead_cta_clicked fires for any WhatsApp / phone / email CTA.
      if (channel) {
        capture("lead_cta_clicked", {
          channel: channel,
          cta_text: ctaText,
          href_type: hrefType,
          section: section,
          intent: intent
        });
      }

      // WhatsApp gets the deeper, ad-attribution-grade event. The
      // visible message is left unchanged.
      if (channel === "whatsapp") {
        var ids = prepareWhatsappLead(anchor) || {
          lead_id: attribution.generateLeadId(),
          event_id: attribution.generateEventId(),
          visible_reference_added: false
        };
        var plot = closest(anchor, ".v3-plot, [data-plot-slug], [data-plot-title]");
        var attr = attribution.flat();
        var props = {
          lead_id: ids.lead_id,
          event_id: ids.event_id,
          channel: "whatsapp",
          cta_text: ctaText,
          intent: intent,
          section: section,
          visible_reference_added: Boolean(ids.visible_reference_added)
        };
        if (plot) {
          var plotName = plot.getAttribute("data-plot-title") ||
            (plot.querySelector(".v3-plot__title") && plot.querySelector(".v3-plot__title").textContent) || "";
          var plotSlug = plot.getAttribute("data-plot-slug") || "";
          if (plotName) props.plot_name = String(plotName).trim().slice(0, 200);
          if (plotSlug) props.plot_slug = plotSlug;
        }
        // Plot detail pages: derive plot_slug from path /buy/<slug>/
        if (!props.plot_slug && /^\/buy\/[^/]+\/?$/.test(window.location.pathname)) {
          var seg = window.location.pathname.split("/").filter(Boolean);
          if (seg[0] === "buy" && seg[1]) props.plot_slug = seg[1];
        }
        Object.keys(attr).forEach(function (k) { props[k] = attr[k]; });
        if (window.posthog && typeof window.posthog.get_distinct_id === "function") {
          try { props.posthog_distinct_id = window.posthog.get_distinct_id(); } catch (e) {}
        }
        capture("whatsapp_lead_started", props);

        fireAdPlatformLead(props);
      }

      // Outbound / map / nav-style events for non-contact links.
      if (!channel) {
        if (/google\.[^/]+\/maps|maps\.app\.goo|goo\.gl\/maps|maps\.google/i.test(href)) {
          capture("map_clicked", { cta_text: ctaText, href: href });
        } else if (/^https?:\/\//i.test(href)) {
          try {
            var u = new URL(href, window.location.href);
            if (u.hostname !== window.location.hostname) {
              capture("outbound_link_clicked", { href_domain: u.hostname, cta_text: ctaText });
            }
          } catch (err) { /* ignore */ }
        }
      }

      // Nav clicks — only when the anchor sits inside a known nav surface.
      var navLocation = "";
      if (closest(anchor, ".nav__links")) navLocation = "desktop";
      else if (closest(anchor, ".mobile-menu")) navLocation = "mobile";
      else if (closest(anchor, "footer")) navLocation = "footer";
      if (navLocation) {
        capture("nav_clicked", {
          label: ctaText,
          href: href,
          nav_location: navLocation
        });
      }

      // Plot inventory card click on /buy/
      var plotCardLink = closest(anchor, ".v3-plot__link");
      if (plotCardLink) {
        var card = closest(plotCardLink, ".v3-plot");
        if (card) {
          capture("plot_card_clicked", {
            plot_name: textOf(card.querySelector(".v3-plot__title")),
            plot_area: card.getAttribute("data-area") || "",
            plot_use: card.getAttribute("data-use") || "",
            plot_size_sqft: parseInt(card.getAttribute("data-size"), 10) || null,
            plot_price_aed: parseInt(card.getAttribute("data-price"), 10) || null,
            destination: "whatsapp"
          });
        }
      }

      // Plot detail page CTA
      if (/^\/buy\/[^/]+\/?$/.test(window.location.pathname) && channel === "whatsapp") {
        var dctaText = ctaText.toLowerCase();
        if (dctaText.indexOf("walk this plot") !== -1 || dctaText.indexOf("schedule a walkthrough") !== -1 || dctaText.indexOf("walk this") !== -1) {
          var slug = window.location.pathname.split("/").filter(Boolean)[1] || "";
          var titleEl = document.querySelector("h1");
          capture("plot_detail_cta_clicked", {
            plot_slug: slug,
            plot_title: titleEl ? textOf(titleEl) : "",
            cta_text: ctaText,
            destination: "whatsapp"
          });
        }
      }

      // Back to inventory from plot detail
      if (/^\/buy\/[^/]+\/?$/.test(window.location.pathname) && (href === "/buy/" || href === "/buy" || /\/buy\/?$/.test(href))) {
        var slugBack = window.location.pathname.split("/").filter(Boolean)[1] || "";
        capture("back_to_inventory_clicked", { plot_slug: slugBack });
      }

      // Investment model links on /invest/
      if (window.location.pathname === "/invest/" || window.location.pathname === "/invest") {
        var modelMatch = href.match(/\/invest\/(sellout|income|hospitality)\/?/);
        if (modelMatch) {
          capture("investment_model_clicked", {
            model: modelMatch[1],
            cta_text: ctaText
          });
        }
      }

      // NDA WhatsApp CTAs on /invest/<model>/
      var ndaMatch = window.location.pathname.match(/^\/invest\/(sellout|income|hospitality)\/?$/);
      if (ndaMatch && channel === "whatsapp" && ctaText.toLowerCase().indexOf("nda") !== -1) {
        capture("investment_nda_clicked", {
          model: ndaMatch[1],
          destination: "whatsapp"
        });
      }

      // /sell/ valuation CTAs
      if (window.location.pathname === "/sell/" || window.location.pathname === "/sell") {
        var sellText = ctaText.toLowerCase();
        if (sellText.indexOf("valuation") !== -1 || sellText.indexOf("whatsapp nadim") !== -1) {
          capture("seller_valuation_clicked", {
            cta_text: ctaText,
            intent: "free_valuation",
            destination: channel || "whatsapp"
          });
        }
      }
    }, true);

    // ─── Mobile menu toggle ────────────────────────────────────────
    var navToggle = document.getElementById("navToggle");
    if (navToggle) {
      navToggle.addEventListener("click", function () {
        // Capture state after the existing handler flips it; defer to next tick.
        setTimeout(function () {
          var menu = document.querySelector(".mobile-menu");
          var open = menu ? menu.classList.contains("is-open") || menu.getAttribute("aria-hidden") === "false" : null;
          capture("mobile_menu_toggled", { open: open });
        }, 0);
      });
    }

    // ─── Inventory filters on /buy/ ────────────────────────────────
    var filterIds = ["f-minSqft", "f-maxSqft", "f-use", "f-area", "f-budget"];
    var filterEls = filterIds
      .map(function (id) { return { id: id, el: document.getElementById(id) }; })
      .filter(function (entry) { return entry.el; });
    if (filterEls.length) {
      filterEls.forEach(function (entry) {
        entry.el.addEventListener("change", function () {
          var snapshot = {};
          filterEls.forEach(function (e) {
            snapshot[e.id.replace(/^f-/, "")] = e.el.value || "";
          });
          var grid = document.getElementById("plot-grid");
          var totalCount = grid ? grid.querySelectorAll(".v3-plot").length : null;
          var visibleCount = grid ? Array.prototype.filter.call(grid.querySelectorAll(".v3-plot"), function (n) {
            return n.style.display !== "none";
          }).length : null;
          capture("inventory_filter_changed", {
            filter_name: entry.id.replace(/^f-/, ""),
            filter_value: entry.el.value || "",
            min_sqft: snapshot.minSqft || "",
            max_sqft: snapshot.maxSqft || "",
            use: snapshot.use || "",
            area: snapshot.area || "",
            budget: snapshot.budget || "",
            visible_count: visibleCount,
            total_count: totalCount
          });
        });
      });
    }

    // ─── "See more lands" button on /buy/ ──────────────────────────
    var moreBtn = document.getElementById("plot-more");
    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        var grid = document.getElementById("plot-grid");
        var totalCount = grid ? grid.querySelectorAll(".v3-plot").length : null;
        var visibleBefore = grid ? Array.prototype.filter.call(grid.querySelectorAll(".v3-plot"), function (n) {
          return n.style.display !== "none";
        }).length : null;
        capture("inventory_more_clicked", {
          visible_before: visibleBefore,
          total_count: totalCount
        });
      });
    }

    // ─── Broker register form ──────────────────────────────────────
    var brokerForm = document.getElementById("broker-form");
    if (brokerForm) {
      // Tag sensitive fields so PostHog autocapture skips them. The
      // ph-no-capture class is the PostHog convention for "do not record
      // this element or its value".
      ["brokerName", "brokerCompany", "brokerPhone", "callDate", "callTime", "notes"].forEach(function (name) {
        var el = brokerForm.querySelector('[name="' + name + '"]');
        if (el) {
          el.classList.add("ph-no-capture");
          el.setAttribute("data-ph-no-capture", "true");
        }
      });

      var started = false;
      function markStart() {
        if (started) return;
        started = true;
        capture("broker_form_started", {});
      }
      brokerForm.addEventListener("focusin", markStart);
      brokerForm.addEventListener("change", markStart);

      // Capture submit in capture phase so we record the event before
      // site.js opens the WhatsApp window and the page navigates away.
      brokerForm.addEventListener("submit", function () {
        var data = new FormData(brokerForm);
        var leadId = attribution.generateLeadId();
        var eventId = attribution.generateEventId();
        var attr = attribution.flat();
        var props = {
          lead_id: leadId,
          event_id: eventId,
          has_company: Boolean((data.get("brokerCompany") || "").trim()),
          has_phone: Boolean((data.get("brokerPhone") || "").trim()),
          has_call_date: Boolean((data.get("callDate") || "").trim()),
          has_call_time: Boolean((data.get("callTime") || "").trim()),
          has_notes: Boolean((data.get("notes") || "").trim())
        };
        Object.keys(attr).forEach(function (k) { props[k] = attr[k]; });
        capture("broker_form_submitted", props);

        // The broker form opens WhatsApp itself in site.js; this also
        // counts as a WhatsApp lead from the website's perspective.
        var waProps = {
          lead_id: leadId,
          event_id: eventId,
          channel: "whatsapp",
          cta_text: "Schedule broker call",
          intent: "broker_call",
          section: "broker_register"
        };
        Object.keys(attr).forEach(function (k) { waProps[k] = attr[k]; });
        if (window.posthog && typeof window.posthog.get_distinct_id === "function") {
          try { waProps.posthog_distinct_id = window.posthog.get_distinct_id(); } catch (e) {}
        }
        capture("whatsapp_lead_started", waProps);
        fireAdPlatformLead(waProps);
      }, true);
    }

    // ─── News carousel interactions ────────────────────────────────
    var newsPrev = document.querySelector("[data-news-prev]");
    var newsNext = document.querySelector("[data-news-next]");
    if (newsPrev) newsPrev.addEventListener("click", function () { capture("news_interaction", { action: "prev" }); });
    if (newsNext) newsNext.addEventListener("click", function () { capture("news_interaction", { action: "next" }); });
    var newsDots = document.querySelector("[data-news-dots]");
    if (newsDots) {
      newsDots.addEventListener("click", function (e) {
        var dot = closest(e.target, ".home-news__dot");
        if (dot) capture("news_interaction", { action: "dot" });
      });
    }
    var newsViewport = document.querySelector("[data-news-viewport]");
    if (newsViewport) {
      newsViewport.addEventListener("click", function (e) {
        var card = closest(e.target, ".home-news__card a, .home-news__card");
        if (!card) return;
        var titleEl = card.querySelector("h3, h4, .home-news__title") || card;
        capture("news_interaction", {
          action: "article_click",
          article_title: textOf(titleEl)
        });
      });
    }

    // ─── FAQ open ──────────────────────────────────────────────────
    document.addEventListener("toggle", function (e) {
      var det = e.target;
      if (!det || det.tagName !== "DETAILS") return;
      if (!det.open) return;
      if (det._faqLoggedOpen) return;
      det._faqLoggedOpen = true;
      var summary = det.querySelector("summary");
      capture("faq_opened", { question: textOf(summary) });
    }, true);

    // ─── Section view (IntersectionObserver, once per pageview) ────
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el._sectionLogged) return;
          el._sectionLogged = true;
          observer.unobserve(el);
          capture("section_viewed", {
            section_id: el.id || "",
            section_label: el.getAttribute("data-section") || el.getAttribute("aria-label") || ""
          });
        });
      }, { threshold: 0.4 });
      var sections = document.querySelectorAll("section[id], section[data-section]");
      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  // ─── Ad-platform conversion fan-out ──────────────────────────────
  // Pixel installation is currently dormant — these calls are no-ops
  // unless explicitly enabled and Meta Pixel / Google gtag / LinkedIn lintrk has been added
  // to the page globally. When IDs are configured later, the matching
  // global function will exist and the conversion fires automatically
  // with the same event_id PostHog used, so future server-side
  // deduplication is possible.
  function fireAdPlatformLead(props) {
    // Keep GTM as the single source of truth for ad-platform tags.
    if (window.NAMOU_ENABLE_DIRECT_PIXEL_HOOKS !== true) return;
    try {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: props.intent || "whatsapp_lead",
          content_category: props.audience || "general"
        }, { eventID: props.event_id });
      }
    } catch (e) {}
    try {
      if (typeof window.gtag === "function" && window.NAMOU_GOOGLE_CONVERSION) {
        window.gtag("event", "conversion", {
          send_to: window.NAMOU_GOOGLE_CONVERSION,
          transaction_id: props.event_id
        });
      }
    } catch (e) {}
    try {
      if (typeof window.lintrk === "function" && window.NAMOU_LINKEDIN_CONVERSION_ID) {
        window.lintrk("track", { conversion_id: window.NAMOU_LINKEDIN_CONVERSION_ID });
      }
    } catch (e) {}
  }
})();
