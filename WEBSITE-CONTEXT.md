# Namou Properties — Website Context

> **Purpose:** This file captures the full project context so any future AI chat session can pick up where the last one left off without running into context window limits. **Update this file every time a change is made.**

---

## Company Overview

- **Company:** Namou Properties LLC
- **Location:** Ras Al Khaimah (RAK), UAE
- **Focus:** Land and commercial real estate brokerage
- **Founder:** Jad Barghout (jad@namou.ae)
- **Marketing Lead:** William R (william@namou.ae)
- **WhatsApp (primary CTA):** +971 56 963 6360

---

## Website Overview

- **Domain:** namou.ae (hosted on Vercel)
- **Repo:** https://github.com/will-rads/namou-website.git
- **Stack:** Static HTML / CSS / vanilla JS — no framework, no build step
- **Hosting:** Vercel, preset "Other", root directory "./"
- **Phase:** Phase 1 complete (homepage). Phase 2 = PostHog analytics.

---

## Design Direction

- **Inspiration:** [starlink.com](https://starlink.com) — simple, clean, bold, modern, premium feel
- **Theme:** White/light default with a dark mode toggle (localStorage persists choice)
- **Fonts (Google Fonts):**
  - **DM Sans** — headings, buttons, nav
  - **Roboto Mono** — body text
- **Primary brand color:** `#00B073` (green)
- **WhatsApp green:** `#25D366`
- **Light mode BG:** `#FFFFFF` / alt `#F5F5F5`
- **Dark mode BG:** `#0A0A0A`

---

## Core Conversion Goal

**WhatsApp clicks are the #1 conversion metric.** Every section of the site includes a WhatsApp CTA. The site currently has 10 WhatsApp buttons, each with:
- `data-analytics="whatsapp-cta"`
- A descriptive `data-section` attribute (e.g., `data-section="hero"`, `data-section="broker-feature-3"`)
- Pre-filled WhatsApp messages via `wa.me/971569636360?text=...`

---

## Site Structure (Homepage Sections)

1. **Nav** — Logo, 5 anchor links, dark mode toggle, mobile hamburger
2. **Hero** — Bold headline, subtitle, primary WhatsApp CTA
3. **Action Cards** — Two cards: "Buy Land & Commercial" (with broker-team.jpg) and "Sell Your Property" (with hero-sell.jpg), each with a WhatsApp CTA
4. **Advantages** — 6 advantage cards (3 buying, 3 selling) in a 3-column grid
5. **Stats** — 4 animated counters (200+ properties, 50+ brokers, 12+ years, 98% satisfaction)
6. **Broker Collaboration** — Split layout (text left, hero-buy.jpg right), 3 feature items, WhatsApp CTA
7. **Featured Properties** — 3 property cards (placeholder images), each with a WhatsApp CTA
8. **Contact CTA** — Final call-to-action with phone, email, WhatsApp
9. **Footer** — Logo, quick links, contact info, copyright

---

## File Map

```
namou-website/
├── index.html              ← Full homepage
├── css/
│   └── styles.css          ← All styles (light + dark mode, responsive)
├── js/
│   └── main.js             ← Dark mode toggle, mobile nav, scroll reveal, stat counter
├── assets/
│   └── images/
│       ├── logo.png
│       ├── hero-buy.jpg        (team grid headshots — used in broker section)
│       ├── hero-sell.jpg       (WhatsApp seller mockup — used in Sell action card)
│       ├── broker-team.jpg     (WhatsApp buyer mockup — used in Buy action card)
│       ├── property-1.webp
│       ├── property-2.webp
│       └── property-3.webp
├── posthog-plan/
│   └── posthog-plan.md     ← Phase 2 PostHog analytics plan
├── jads-request.md          ← Jad's original redesign brief
├── context/                 ← Old site files + PDFs (git-ignored)
├── .gitignore
└── WEBSITE-CONTEXT.md       ← This file
```

---

## Technical Details

- **CSS custom properties** for theming — light mode in `:root`, dark mode in `[data-theme="dark"]`
- **localStorage key:** `namou-theme` (values: `light` or `dark`)
- **IntersectionObserver** for scroll-reveal animations and stat counter trigger
- **Responsive breakpoints:** 900px (tablet), 640px (mobile)
- **Mobile nav:** hamburger toggle, locks body scroll when open
- **Smooth scroll** for all `#anchor` links, offset by nav height
- **38+ `data-analytics` attributes** on interactive elements, ready for PostHog Phase 2

---

## Future Plans

- **Phase 2:** PostHog analytics — see `posthog-plan/posthog-plan.md`
- **Subpages:** /broker, /landowner, /featured-property (not yet built)
- **Arabic version:** planned but not in Phase 1
- **Meta Pixel / Google Ads tags:** Phase 3 (separate from PostHog)
- **A/B testing:** Hero section headline + CTA via PostHog feature flags

---

## Commits / Changelog

> Update this section every time a commit is pushed.

| Date | Commit | Description |
|------|--------|-------------|
| 2026-03-13 | `55f1aa1` | Initial commit (GitHub repo setup) |
| 2026-03-13 | `71abffd` | Phase 1: Namou homepage redesign — dark/bold Starlink-inspired design |
| 2026-03-13 | `cd5d6e3` | Add images to action cards and broker section |
| 2026-03-13 | `21be6b3` | Switch to white default with dark mode toggle, DM Sans + Roboto Mono fonts |
| 2026-03-13 | `a1f1a0a` | UX copy overhaul, Starlink-style hero with glass router cards, Material Symbols icons |
| 2026-03-13 | `acef152` | Visual overhaul: bento lanes grid, grain texture, atmospheric gradients, hero entrance animation, staggered reveals, green glow hovers, gradient stat numbers |
| 2026-03-13 | `3600537` | Revert lanes to 3-col horizontal, add Material Symbols stat icons, replace flat gray stats bg with atmospheric green gradients |
| 2026-03-14 | `a82dfbe` | Glass card treatment (backdrop-filter blur, semi-transparent bg, inset highlights), cooler alt backgrounds (#EBEEF2 / #0D0F13) |
