/* =============================================
   NAMOU FUNNEL — Shared Logic
   State · scoring · WhatsApp builder · UI helpers
   ============================================= */

(function() {
  'use strict';

  var STORAGE_KEY = 'namou_funnel_state';
  var WHATSAPP_NUMBER = '971569636360';

  var DEFAULT_STATE = {
    intent: null,
    goal: null,
    budgetBand: null,
    timeline: null,
    funding: null,
    investorProfile: null,
    zones: [],
    zoning: [],
    sizeBand: null,
    features: [],
    matchedPlotIds: [],
    noMatchBrief: false,
    viewedValueMoment: false,
    contact: null,
    score: 0,
    tier: null,
    createdAt: new Date().toISOString()
  };

  /* ----- State management ----- */

  function getState() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        var state = {};
        for (var key in DEFAULT_STATE) {
          state[key] = parsed.hasOwnProperty(key) ? parsed[key] : DEFAULT_STATE[key];
        }
        return state;
      }
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function setState(updates) {
    var current = getState();
    for (var key in updates) {
      if (updates.hasOwnProperty(key)) {
        current[key] = updates[key];
      }
    }
    current.score = calculateScore(current);
    current.tier = getTier(current.score);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) { /* ignore */ }
    return current;
  }

  function resetState() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  /* ----- Lead scoring ----- */

  function calculateScore(state) {
    var s = 0;
    if (state.intent)           s += 10;
    if (state.goal)             s += 15;
    if (state.budgetBand)       s += (state.budgetBand === 'unsure') ? 5 : 15;
    if (state.timeline) {
      if (state.timeline === '30-days')       s += 15;
      else if (state.timeline !== 'exploring') s += 10;
    }
    if (state.funding) {
      if (state.funding === 'cash')                s += 10;
      else if (state.funding === 'mortgage-approved') s += 7;
      else if (state.funding === 'arranging')         s += 3;
    }
    if (state.investorProfile)               s += 5;
    if (state.zones && state.zones.length)   s += 5;
    if (state.zoning && state.zoning.length) s += 5;
    if (state.sizeBand)                      s += 5;
    if (state.viewedValueMoment)             s += 10;
    if (state.contact)                       s += 10;
    return Math.min(s, 100);
  }

  function getTier(score) {
    if (score >= 80) return 'hot';
    if (score >= 50) return 'warm';
    return 'cold';
  }

  /* ----- WhatsApp link builder ----- */

  var LABELS = {
    goal: {
      'sale':           'Buy a plot to hold or flip',
      'jv-build-sell':  'Build and sell with a partner',
      'jv-build-lease': 'Build and lease with a partner',
      'jv-build-hotel': 'Build and hand to hotel operator'
    },
    budgetBand: {
      'under-2m': 'Under AED 2M',
      '2-10m':    'AED 2M – 10M',
      '10-30m':   'AED 10M – 30M',
      '30m-plus': 'AED 30M+',
      'unsure':   'Not sure yet'
    },
    timeline: {
      '30-days':    'Within 30 days',
      '1-3-months': '1–3 months',
      '3-6-months': '3–6 months',
      'exploring':  'Just exploring'
    },
    funding: {
      'cash':              'Cash available',
      'mortgage-approved': 'Mortgage pre-approved',
      'arranging':         'Arranging finance'
    },
    investorProfile: {
      'uae-resident':  'UAE resident',
      'gcc-national':  'GCC national',
      'international': 'International'
    },
    sizeBand: {
      'under-10k': '<10k sqft',
      '10-25k':    '10–25k sqft',
      '25-50k':    '25–50k sqft',
      '50k-plus':  '50k+ sqft'
    }
  };

  function label(category, value) {
    return (LABELS[category] && LABELS[category][value]) || '\u2014';
  }

  function buildWhatsAppLink(state) {
    var lines = [
      'Hi Namou \u2014 sending you my brief from your site:',
      '',
      'Goal: '     + label('goal', state.goal),
      'Budget: '   + label('budgetBand', state.budgetBand),
      'Timeline: ' + label('timeline', state.timeline),
      'Funding: '  + label('funding', state.funding),
      'Profile: '  + label('investorProfile', state.investorProfile),
      'Zones: '    + (state.zones && state.zones.length ? state.zones.join(', ') : '\u2014'),
      'Zoning: '   + (state.zoning && state.zoning.length ? state.zoning.join(', ') : '\u2014'),
      'Size: '     + label('sizeBand', state.sizeBand)
    ];

    if (state.contact && state.contact.notes) {
      lines.push('Notes: ' + state.contact.notes);
    }
    if (state.noMatchBrief) {
      lines.push('');
      lines.push('[Sourcing brief \u2014 no exact matches at time of inquiry]');
    }
    lines.push('');
    lines.push('Score: ' + state.score + '/100 (' + (state.tier || 'unscored') + ')');

    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  /* ----- Zone definitions ----- */

  var ZONES = [
    { id: 'al-marjan',   name: 'Al Marjan Island' },
    { id: 'al-hamra',    name: 'Al Hamra' },
    { id: 'mina-al-arab', name: 'Mina Al Arab' },
    { id: 'al-jazeera',  name: 'Al Jazeera Al Hamra' },
    { id: 'rak-central', name: 'RAK Central' },
    { id: 'rak-mainland', name: 'RAK Mainland' }
  ];

  /* ----- UI helpers ----- */

  /**
   * Initialize a chip group with click handlers.
   * @param {string} containerId  ID of the chips container
   * @param {string} stateKey     Key in funnel state to update
   * @param {string} mode         'single' or 'multi'
   */
  function initChips(containerId, stateKey, mode) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var chips = container.querySelectorAll('.funnel-chip');
    var state = getState();

    // Restore previous selection
    var current = state[stateKey];
    if (mode === 'single' && current) {
      var prev = container.querySelector('[data-value="' + current + '"]');
      if (prev) prev.classList.add('funnel-chip--selected');
    } else if (mode === 'multi' && Array.isArray(current)) {
      current.forEach(function(val) {
        var el = container.querySelector('[data-value="' + val + '"]');
        if (el) el.classList.add('funnel-chip--selected');
      });
    }

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var value = this.getAttribute('data-value');

        if (mode === 'single') {
          chips.forEach(function(c) { c.classList.remove('funnel-chip--selected'); });
          this.classList.add('funnel-chip--selected');
          var update = {};
          update[stateKey] = value;
          setState(update);
        } else {
          this.classList.toggle('funnel-chip--selected');
          var selected = [];
          container.querySelectorAll('.funnel-chip--selected').forEach(function(c) {
            selected.push(c.getAttribute('data-value'));
          });
          var update = {};
          update[stateKey] = selected;
          setState(update);
        }

        container.dispatchEvent(new CustomEvent('chipchange', {
          detail: { key: stateKey, value: getState()[stateKey] }
        }));
      });
    });
  }

  /**
   * Enable or disable a button by ID.
   */
  function toggleContinue(buttonId, enabled) {
    var btn = document.getElementById(buttonId);
    if (btn) btn.disabled = !enabled;
  }

  /* ----- Plot matching ----- */

  function plotInBudget(plot, band) {
    switch (band) {
      case 'under-2m':  return plot.price_aed < 2000000;
      case '2-10m':     return plot.price_aed >= 2000000  && plot.price_aed < 10000000;
      case '10-30m':    return plot.price_aed >= 10000000 && plot.price_aed < 30000000;
      case '30m-plus':  return plot.price_aed >= 30000000;
      case 'unsure':    return true;
      default:          return true;
    }
  }

  function plotInSize(plot, band) {
    switch (band) {
      case 'under-10k': return plot.size_sqft < 10000;
      case '10-25k':    return plot.size_sqft >= 10000 && plot.size_sqft < 25000;
      case '25-50k':    return plot.size_sqft >= 25000 && plot.size_sqft < 50000;
      case '50k-plus':  return plot.size_sqft >= 50000;
      default:          return true;
    }
  }

  /**
   * Match plots against funnel state.
   * Returns { state: 'perfect'|'partial'|'no-match', plots: [] }
   */
  function matchPlots(state, plots) {
    if (!plots || !plots.length) {
      return { state: 'no-match', plots: [], suggestions: [] };
    }

    var exact = [];
    var partial = [];

    plots.forEach(function(plot) {
      var checks = 0;
      var hits = 0;

      if (state.budgetBand) {
        checks++;
        if (plotInBudget(plot, state.budgetBand)) hits++;
      }
      if (state.zones && state.zones.length) {
        checks++;
        if (state.zones.indexOf(plot.zone) !== -1 || state.zones.indexOf('Any') !== -1) hits++;
      }
      if (state.zoning && state.zoning.length) {
        checks++;
        if (state.zoning.indexOf(plot.zoning) !== -1 || state.zoning.indexOf('Not sure') !== -1) hits++;
      }
      if (state.sizeBand) {
        checks++;
        if (plotInSize(plot, state.sizeBand)) hits++;
      }

      if (checks > 0) {
        if (hits === checks) exact.push(plot);
        else if (hits >= checks - 1) partial.push(plot);
      }
    });

    if (exact.length > 0)   return { state: 'perfect', plots: exact };
    if (partial.length > 0) return { state: 'partial',  plots: partial };
    return { state: 'no-match', plots: [], suggestions: [] };
  }


  /* ----- ROI calculator ----- */

  var ROI_ASSUMPTIONS = {
    'Residential':  { landCost: 200, buildCost: 350, gdv: 900 },
    'Mixed-use':    { landCost: 250, buildCost: 400, gdv: 1100 },
    'Commercial':   { landCost: 300, buildCost: 450, gdv: 1200 },
    'Hospitality':  { landCost: 350, buildCost: 500, gdv: 1500 },
    'Industrial':   { landCost: 100, buildCost: 250, gdv: 500 },
    'Not sure':     { landCost: 200, buildCost: 350, gdv: 900 }
  };

  var ZONE_PREMIUM = {
    'Al Marjan Island':     1.6,
    'Al Hamra':             1.3,
    'Mina Al Arab':         1.2,
    'Al Jazeera Al Hamra':  0.9,
    'RAK Central':          1.0,
    'RAK Mainland':         0.8,
    'Any':                  1.0
  };

  var BUDGET_TO_SIZE = {
    'under-2m':  5000,
    '2-10m':     15000,
    '10-30m':    35000,
    '30m-plus':  75000,
    'unsure':    15000
  };

  function calculateROI(state) {
    var zoning = (state.zoning && state.zoning.length) ? state.zoning[0] : 'Residential';
    var zone   = (state.zones  && state.zones.length)  ? state.zones[0]  : 'Any';
    var size   = BUDGET_TO_SIZE[state.budgetBand] || 15000;

    var base    = ROI_ASSUMPTIONS[zoning] || ROI_ASSUMPTIONS['Residential'];
    var premium = ZONE_PREMIUM[zone]      || 1.0;

    var landCost  = Math.round(base.landCost  * premium * size);
    var buildCost = Math.round(base.buildCost * premium * size);
    var gdv       = Math.round(base.gdv       * premium * size);
    var totalCost = landCost + buildCost;
    var profit    = gdv - totalCost;
    var margin    = totalCost > 0 ? Math.round((profit / totalCost) * 100) : 0;

    return { landCost: landCost, buildCost: buildCost, gdv: gdv, margin: margin };
  }


  /* ----- Formatting ----- */

  function formatAED(num) {
    if (num >= 1000000) return 'AED ' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000)    return 'AED ' + Math.round(num / 1000) + 'K';
    return 'AED ' + num;
  }


  /* ----- Mapbox token ----- */
  // TODO: Replace with your Mapbox access token
  var MAPBOX_TOKEN = '';


  /* ----- Expose ----- */

  window.Funnel = {
    getState:          getState,
    setState:          setState,
    resetState:        resetState,
    calculateScore:    calculateScore,
    getTier:           getTier,
    buildWhatsAppLink: buildWhatsAppLink,
    matchPlots:        matchPlots,
    calculateROI:      calculateROI,
    formatAED:         formatAED,
    initChips:         initChips,
    toggleContinue:    toggleContinue,
    LABELS:            LABELS,
    ZONES:             ZONES,
    WHATSAPP_NUMBER:   WHATSAPP_NUMBER,
    MAPBOX_TOKEN:      MAPBOX_TOKEN
  };

})();
