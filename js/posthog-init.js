/* PostHog browser SDK initialization for Namou Properties.
   Loaded in <head> on every HTML page. The official PostHog array-stub
   snippet is inlined here so analytics queues calls before the SDK is
   downloaded, then replays them on load. */
(function () {
  if (window.__namouPosthogInitialized) return;
  window.__namouPosthogInitialized = true;

  window.NAMOU_POSTHOG_CONFIG = {
    apiKey: "phc_C3uFXjR7LDqFkXGwj2XfHNiHhcmzwNaWwsXmfBakUVAa",
    apiHost: "https://us.i.posthog.com",
    uiHost: "https://us.posthog.com"
  };

  !function (t, e) {
    var o, n, p, r;
    e.__SV ||
      ((window.posthog = e),
      (e._i = []),
      (e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split(".");
          2 == o.length && ((t = t[o[0]]), (e = o[1])),
            (t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            });
        }
        ((p = t.createElement("script")).type = "text/javascript"),
          (p.crossOrigin = "anonymous"),
          (p.async = !0),
          (p.src =
            s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
            "/static/array.js"),
          (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
        var u = e;
        for (
          void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
            u.people = u.people || [],
            u.toString = function (t) {
              var e = "posthog";
              return (
                "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
              );
            },
            u.people.toString = function () {
              return u.toString(1) + ".people (stub)";
            },
            o =
              "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(
                " "
              ),
            n = 0;
          n < o.length;
          n++
        )
          g(u, o[n]);
        e._i.push([i, s, a]);
      }),
      (e.__SV = 1));
  }(document, window.posthog || []);

  window.posthog.init(window.NAMOU_POSTHOG_CONFIG.apiKey, {
    api_host: window.NAMOU_POSTHOG_CONFIG.apiHost,
    ui_host: window.NAMOU_POSTHOG_CONFIG.uiHost,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    rageclick: true,
    person_profiles: "identified_only",
    disable_session_recording: true,
    mask_all_text: false,
    mask_all_element_attributes: false,
    sanitize_properties: function (properties) {
      // Belt-and-suspenders: never let WhatsApp text query strings or
      // sensitive search params slip into event properties even if a
      // page link happens to expose them via $current_url. Replace any
      // ?text=... / ?body=... / ?message=... / ?email=... payload with
      // a redacted placeholder before the event leaves the browser.
      function scrubUrl(value) {
        if (typeof value !== "string" || value.indexOf("?") === -1) return value;
        try {
          var url = new URL(value, window.location.origin);
          var redactKeys = ["text", "body", "message", "email", "phone", "name"];
          var changed = false;
          redactKeys.forEach(function (k) {
            if (url.searchParams.has(k)) {
              url.searchParams.set(k, "[redacted]");
              changed = true;
            }
          });
          return changed ? url.toString() : value;
        } catch (e) {
          return value;
        }
      }
      ["$current_url", "$pathname", "$referrer", "href", "page_url"].forEach(function (key) {
        if (properties && properties[key]) properties[key] = scrubUrl(properties[key]);
      });
      return properties;
    },
    loaded: function (ph) {
      // Surface a console marker for QA so it is obvious that PostHog
      // initialized successfully without inspecting the network panel.
      if (window.console && window.console.info) {
        window.console.info("[namou] PostHog ready, distinct_id:", ph.get_distinct_id());
      }
    }
  });
})();
