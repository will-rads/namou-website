/* Attribution capture for Namou Properties.
   - Reads platform click IDs, UTMs, referrer on landing.
   - Persists first-touch and latest-touch state in localStorage under
     `namou_attribution`. First-touch is set once on the first visit and
     never overwritten; latest-touch is rewritten on every meaningful
     landing event (a visit that brought a new click ID, new UTMs, or a
     new external referrer).
   - Exposes a small API on window.NamouAttribution that the events
     module uses when capturing whatsapp_lead_started and when appending
     lead_id to WhatsApp prefilled messages.
   - Click IDs are treated as opaque, case-sensitive identifiers and
     never lowercased, trimmed, decoded, or re-encoded beyond what the
     URLSearchParams API does on read. */
(function () {
  if (window.NamouAttribution) return;

  var STORAGE_KEY = "namou_attribution";
  var LEAD_PREFIX = "NAMOU";

  var CLICK_ID_KEYS = [
    "fbclid",
    "gclid",
    "gbraid",
    "wbraid",
    "dclid",
    "li_fat_id",
    "ttclid",
    "msclkid"
  ];

  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ];

  var SEARCH_REFERRER_HOSTS = [
    "google.",
    "bing.",
    "yahoo.",
    "duckduckgo.",
    "yandex.",
    "baidu.",
    "ecosia."
  ];

  var SOCIAL_REFERRER_HOSTS = {
    facebook: "facebook",
    fb: "facebook",
    instagram: "instagram",
    linkedin: "linkedin",
    "lnkd.in": "linkedin",
    twitter: "twitter",
    "x.com": "twitter",
    "t.co": "twitter",
    tiktok: "tiktok",
    youtube: "youtube",
    youtu: "youtube",
    pinterest: "pinterest",
    reddit: "reddit",
    snapchat: "snapchat",
    threads: "threads"
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function readJSON(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage may be disabled (private mode, quota); attribution
      // still works for the current page via the in-memory object.
    }
  }

  function readCookie(name) {
    var match = ("; " + document.cookie).split("; " + name + "=");
    if (match.length < 2) return "";
    return match.pop().split(";").shift();
  }

  function getParams() {
    return new URLSearchParams(window.location.search || "");
  }

  function pickClickIds(params) {
    var ids = {};
    CLICK_ID_KEYS.forEach(function (key) {
      var v = params.get(key);
      if (v) ids[key] = v;
    });
    return ids;
  }

  function pickUtms(params) {
    var utms = {};
    UTM_KEYS.forEach(function (key) {
      var v = params.get(key);
      if (v) utms[key] = v;
    });
    return utms;
  }

  function externalReferrer() {
    var ref = document.referrer || "";
    if (!ref) return "";
    try {
      var url = new URL(ref);
      if (url.hostname === window.location.hostname) return "";
      return ref;
    } catch (e) {
      return "";
    }
  }

  function classify(touch) {
    var clickIds = touch.click_ids || {};
    var utms = touch.utms || {};
    var ref = touch.referrer || "";
    var refHost = "";
    if (ref) {
      try {
        refHost = new URL(ref).hostname.toLowerCase();
      } catch (e) {
        refHost = "";
      }
    }

    var source = utms.utm_source || "";
    var medium = utms.utm_medium || "";
    var campaign = utms.utm_campaign || "";
    var channel = "";

    // Paid channels take priority — a paid click id is unambiguous even
    // when UTMs are missing (organic posts often forget to tag).
    if (clickIds.fbclid) {
      channel = "paid_social";
      if (!source) source = "facebook";
      if (!medium) medium = "paid_social";
    } else if (clickIds.gclid || clickIds.gbraid || clickIds.wbraid || clickIds.dclid) {
      channel = "paid_search";
      if (!source) source = "google";
      if (!medium) medium = "cpc";
    } else if (clickIds.li_fat_id) {
      channel = "paid_linkedin";
      if (!source) source = "linkedin";
      if (!medium) medium = "paid_social";
    } else if (clickIds.ttclid) {
      channel = "paid_social";
      if (!source) source = "tiktok";
      if (!medium) medium = "paid_social";
    } else if (clickIds.msclkid) {
      channel = "paid_search";
      if (!source) source = "bing";
      if (!medium) medium = "cpc";
    } else if (medium && /cpc|ppc|paid/i.test(medium)) {
      channel = "paid_other";
    } else if (refHost) {
      var isSearch = SEARCH_REFERRER_HOSTS.some(function (s) {
        return refHost.indexOf(s) !== -1;
      });
      if (isSearch) {
        channel = "organic_search";
        if (!source) source = refHost.split(".")[0];
        if (!medium) medium = "organic";
      } else {
        var socialMatch = "";
        Object.keys(SOCIAL_REFERRER_HOSTS).forEach(function (key) {
          if (!socialMatch && refHost.indexOf(key) !== -1) {
            socialMatch = SOCIAL_REFERRER_HOSTS[key];
          }
        });
        if (socialMatch) {
          channel = "organic_social";
          if (!source) source = socialMatch;
          if (!medium) medium = "organic_social";
        } else {
          channel = "referral";
          if (!source) source = refHost;
          if (!medium) medium = "referral";
        }
      }
    } else if (source || medium || campaign) {
      // UTMs present but no referrer/click id → email / newsletter /
      // QR / printed campaign. Trust utm_medium when supplied.
      channel = medium || "campaign";
    } else {
      channel = "direct";
      source = "(direct)";
      medium = "(none)";
    }

    return {
      source: source,
      medium: medium,
      campaign: campaign,
      channel: channel
    };
  }

  function buildTouch() {
    var params = getParams();
    var clickIds = pickClickIds(params);
    var fbc = readCookie("_fbc");
    var fbp = readCookie("_fbp");
    if (fbc) clickIds._fbc = fbc;
    if (fbp) clickIds._fbp = fbp;

    var touch = {
      click_ids: clickIds,
      utms: pickUtms(params),
      referrer: externalReferrer(),
      landing_url: window.location.href,
      landing_path: window.location.pathname,
      seen_at: nowIso()
    };
    var inferred = classify(touch);
    touch.source = inferred.source;
    touch.medium = inferred.medium;
    touch.campaign = inferred.campaign;
    touch.channel = inferred.channel;
    return touch;
  }

  function hasSignal(touch) {
    return Boolean(
      Object.keys(touch.click_ids || {}).length ||
      Object.keys(touch.utms || {}).length ||
      touch.referrer
    );
  }

  function loadStored() {
    return readJSON(STORAGE_KEY) || {};
  }

  function persist() {
    var current = loadStored();
    var touch = buildTouch();

    // First touch: write once, then never overwrite.
    if (!current.first) {
      current.first = touch;
      current.first_seen_at = touch.seen_at;
    }

    // Latest touch: refresh on any visit that carries a recognizable
    // attribution signal. Pure internal navigation/refreshes don't
    // overwrite latest-touch so the user's last meaningful entry point
    // is preserved.
    if (!current.latest || hasSignal(touch)) {
      current.latest = touch;
    }
    current.latest_seen_at = touch.seen_at;

    writeJSON(STORAGE_KEY, current);
    return current;
  }

  function randomSuffix() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "";
    var bytes;
    if (window.crypto && window.crypto.getRandomValues) {
      bytes = new Uint8Array(4);
      window.crypto.getRandomValues(bytes);
    } else {
      bytes = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ];
    }
    for (var i = 0; i < 4; i += 1) out += chars.charAt(bytes[i] % chars.length);
    return out;
  }

  function generateLeadId() {
    var d = new Date();
    var yy = String(d.getUTCFullYear()).slice(-2);
    var mm = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    var dd = ("0" + d.getUTCDate()).slice(-2);
    return LEAD_PREFIX + "-" + yy + mm + dd + "-" + randomSuffix();
  }

  function generateEventId() {
    if (window.crypto && window.crypto.randomUUID) {
      try { return window.crypto.randomUUID(); } catch (e) { /* fall through */ }
    }
    return "evt_" + Date.now() + "_" + randomSuffix() + randomSuffix();
  }

  function flatten(state) {
    state = state || loadStored();
    var first = state.first || {};
    var latest = state.latest || {};
    var firstClicks = first.click_ids || {};
    var latestClicks = latest.click_ids || {};
    var latestUtms = latest.utms || {};

    return {
      fbclid_present: Boolean(latestClicks.fbclid || firstClicks.fbclid),
      fbc_present: Boolean(latestClicks._fbc || firstClicks._fbc),
      fbp_present: Boolean(latestClicks._fbp || firstClicks._fbp),
      gclid_present: Boolean(latestClicks.gclid || firstClicks.gclid),
      gbraid_present: Boolean(latestClicks.gbraid || firstClicks.gbraid),
      wbraid_present: Boolean(latestClicks.wbraid || firstClicks.wbraid),
      dclid_present: Boolean(latestClicks.dclid || firstClicks.dclid),
      li_fat_id_present: Boolean(latestClicks.li_fat_id || firstClicks.li_fat_id),
      ttclid_present: Boolean(latestClicks.ttclid || firstClicks.ttclid),
      msclkid_present: Boolean(latestClicks.msclkid || firstClicks.msclkid),
      utm_source: latestUtms.utm_source || "",
      utm_medium: latestUtms.utm_medium || "",
      utm_campaign: latestUtms.utm_campaign || "",
      utm_content: latestUtms.utm_content || "",
      utm_term: latestUtms.utm_term || "",
      source: latest.source || first.source || "",
      medium: latest.medium || first.medium || "",
      campaign: latest.campaign || first.campaign || "",
      channel: latest.channel || first.channel || "",
      initial_referrer: first.referrer || "",
      latest_referrer: latest.referrer || "",
      initial_landing_url: first.landing_url || "",
      latest_landing_url: latest.landing_url || "",
      first_seen_at: state.first_seen_at || "",
      latest_seen_at: state.latest_seen_at || ""
    };
  }

  var state = persist();

  window.NamouAttribution = {
    STORAGE_KEY: STORAGE_KEY,
    get: function () { return loadStored(); },
    flat: function () { return flatten(loadStored()); },
    generateLeadId: generateLeadId,
    generateEventId: generateEventId,
    refresh: persist
  };

  // Register the flattened attribution on PostHog as super-properties so
  // every subsequent event (including autocapture) carries source /
  // medium / campaign / channel without each event having to opt in.
  function applyToPostHog() {
    if (!window.posthog || typeof window.posthog.register !== "function") return false;
    window.posthog.register(flatten(state));
    return true;
  }

  if (!applyToPostHog()) {
    var tries = 0;
    var iv = setInterval(function () {
      tries += 1;
      if (applyToPostHog() || tries > 40) clearInterval(iv);
    }, 150);
  }
})();
