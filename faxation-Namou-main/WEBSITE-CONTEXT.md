# Namou Properties - Website Context

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
- **Stack:** Static HTML / CSS / vanilla JS - no framework, no build step
- **Hosting:** Vercel, preset "Other", root directory "./"
- **Phase:** Intent-based funnel draft. `/home` routes users into separate `/buy`, `/sell`, and `/broker` sub-sites.

---

## Design Direction

- **Inspiration:** [starlink.com](https://starlink.com) - simple, clean, bold, modern, premium feel
- **Theme:** White/light default with a dark mode toggle (`localStorage` persists choice)
- **Fonts (Google Fonts):**
  - **DM Sans** - headings, buttons, nav
  - **Roboto Mono** - body text
- **Primary brand color:** `#00B073`
- **WhatsApp green:** `#25D366`
- **Light mode BG:** `#FFFFFF` / alt `#F5F5F5`
- **Dark mode BG:** `#0A0A0A`
- **Critical UX rule:** mobile-first, content centered, safe on narrow screens, no side clipping

---

## Core Conversion Goal

**WhatsApp conversations are the primary conversion goal.** Each intent-specific sub-site collects qualification data first, then opens WhatsApp with a prefilled lead brief so the Namou specialist can continue with context.

---

## Site Structure - Root `/` (index.html)

1. **Nav** - Logo, 5 anchor links, dark mode toggle, mobile hamburger
2. **Hero** - Bold headline, subtitle, primary WhatsApp CTA
3. **Action Cards** - Two cards: "Buy Land & Commercial" and "Sell Your Property", each with a WhatsApp CTA
4. **Advantages** - 6 advantage cards in a 3-column grid
5. **Stats** - 4 animated counters
6. **Broker Collaboration** - Split layout with image, feature items, and WhatsApp CTA
7. **Featured Properties** - 3 property cards with WhatsApp CTAs
8. **Contact CTA** - Final call-to-action with phone, email, WhatsApp
9. **Footer** - Logo, quick links, contact info, copyright

---

## Site Structure - `/home` (home/index.html)

Standalone landing page with simplified UI for paid-traffic routing.

1. **Nav** - Logo (left), dark mode toggle, and "I'm a broker" route CTA (right). No nav links, no hamburger.
2. **Hero** - Bold headline ("Real Estate Done Right") and subtitle. No hero buttons.
3. **Action Cards** - "Invest in RAK" routes to `/buy`, "Sell Your Land" routes to `/sell`, and the broker CTA routes to `/broker`.
4. **Micro-proof strip** - Compact trust line under the router cards covering market coverage, verified listings, and WhatsApp-based support.

---

## Site Structure - `/buy` (buy/index.html)

Buyer sub-site for land acquisition and investment leads. Mobile-first, branded to match `/home`, and designed to end in WhatsApp with the buyer brief prefilled.

1. **Nav** - Logo routes to `/home`, dark mode toggle on the right
2. **Hero** - Buyer-focused investment headline, supporting copy, land-category tags, and stronger inventory/proof framing
3. **Trust / Value Sections** - Expanded panels for verified market access, investment-led guidance, RAK opportunity types, and buyer-proof signals
4. **What happens next** - Added process section describing brief review, qualified WhatsApp continuation, and video-call onboarding
5. **Pitch deck layer** - Buyer onboarding can include a video call using the Namou visual deck at `https://namou-ae1.vercel.app/home` to explain curated plots, ROI framing, and ownership path
6. **Form** - One-question-at-a-time intake for land type, area, budget, objective, name, and contact details
7. **Final destination** - Submit opens WhatsApp with a structured buyer lead summary

---

## Site Structure - `/sell` (sell/index.html)

Seller sub-site for landowners and representatives in RAK. Mobile-first, branded to match `/home`, and designed to collect sale-critical details before WhatsApp.

1. **Nav** - Logo routes to `/home`, dark mode toggle on the right
2. **Hero** - Seller-focused headline with qualification framing and stronger seriousness/readiness copy
3. **Trust / Support Sections** - Expanded panels covering buyer-network access, sale-readiness, document visibility, controlled first contact, and practical valuation framing
4. **What happens next** - Added seller process section describing initial review, readiness discussion, and next-step guidance after WhatsApp
5. **Form** - One-question-at-a-time intake for location, plot size, paperwork status, ownership papers, name, and contact details
6. **Final destination** - Submit opens WhatsApp with a structured seller lead summary

---

## Site Structure - `/broker` (broker/index.html)

Broker partnership sub-site for broker-to-broker collaboration and buyer briefs. Mobile-first, branded to match `/home`, and designed to gather client requirements before WhatsApp.

1. **Nav** - Logo routes to `/home`, dark mode toggle on the right
2. **Hero** - Broker-partnership headline with stronger commercial framing
3. **Trust / Partnership Sections** - Expanded panels covering fair commissions, support, mandate quality, collaboration mechanics, and what brokers can expect
4. **What happens next** - Added sections describing post-brief alignment, ongoing coordination, and how the broker stays visible in the process
5. **Pitch deck layer** - Qualified broker leads can move into a video call using the Namou visual deck at `https://namou-ae1.vercel.app/home`
6. **Commercial clarity note** - Page now states what can be said confidently today and flags missing policy details that still need explicit Namou guidance
7. **Form** - One-question-at-a-time intake for the broker's client brief plus broker name, agency, and contact details
8. **Final destination** - Submit opens WhatsApp with a structured broker/client summary

---

## Reference Notes

- **Primary public reference used:** https://namou.ae/
- **Broker partnership guide:** Google Doc provided by user, not directly accessible from this environment during the draft pass
- **Company profile folder:** Google Drive folder provided by user, not directly accessible from this environment during the draft pass
- **Draft content status:** sections now mix current site reference, user-provided process guidance, and mock structure where exact policy or commercial wording is still unavailable
- **Buyer / broker onboarding note:** after qualified onboarding, Namou may use a video call plus the visual deck at `https://namou-ae1.vercel.app/home`

---

## File Map

```text
namou-website/
|-- index.html
|-- home/
|   |-- index.html
|-- buy/
|   |-- index.html
|-- sell/
|   |-- index.html
|-- broker/
|   |-- index.html
|-- css/
|   |-- styles.css
|-- js/
|   |-- main.js
|-- assets/
|   |-- images/
|       |-- logo.png
|       |-- hero-buy.jpg
|       |-- hero-sell.jpg
|       |-- broker-team.jpg
|       |-- property-1.webp
|       |-- property-2.webp
|       |-- property-3.webp
|-- posthog-plan/
|   |-- posthog-plan.md
|-- jads-request.md
|-- .gitignore
|-- README.md
`-- WEBSITE-CONTEXT.md
```

---

## Technical Details

- **CSS custom properties** for theming - light mode in `:root`, dark mode in `[data-theme="dark"]`
- **localStorage key:** `namou-theme` (values: `light` or `dark`)
- **Responsive breakpoints:** shared site styles use 900px and 640px; sub-site pages add narrow-screen handling for tighter mobile widths
- **Sub-site interaction model:** `/buy`, `/sell`, and `/broker` use mobile-first single-card steppers with delayed auto-advance on radio selection, manual continue for text steps, inline validation, safe-area-aware padding, and centered content
- **WhatsApp handoff:** submit compiles the captured answers into a prefilled `wa.me` message and redirects the user to WhatsApp
- **No backend:** all forms are front-end only in this draft
- **Known missing policy detail:** broker protection structure, exclusivity model, and closing-commission mechanics still need explicit Namou-approved wording before publication as hard claims

---

## Future Plans

- Replace mock copy with approved company-profile content and broker-partnership guide details
- Add Arabic versions after English intent funnels are approved
- Add analytics instrumentation for funnel drop-off and WhatsApp handoff quality
- Add Meta Pixel / Google Ads tags after funnel structure is locked

---

## Commits / Changelog

> Update this section every time a commit is pushed.

| Date | Commit | Description |
|------|--------|-------------|
| 2026-03-13 | `55f1aa1` | Initial commit (GitHub repo setup) |
| 2026-03-13 | `71abffd` | Phase 1: Namou homepage redesign |
| 2026-03-13 | `cd5d6e3` | Add images to action cards and broker section |
| 2026-03-13 | `21be6b3` | Switch to white default with dark mode toggle, DM Sans + Roboto Mono fonts |
| 2026-03-13 | `a1f1a0a` | UX copy overhaul, Starlink-style hero with glass router cards |
| 2026-03-13 | `acef152` | Visual overhaul: gradients, grain texture, hero motion, staggered reveals |
| 2026-03-13 | `3600537` | Revert lanes to 3-col horizontal and refine stat section visuals |
| 2026-03-14 | `a82dfbe` | Glass card treatment and cooler alternate backgrounds |
| 2026-03-21 | `a8f7882` | Reverted mistaken `/home` changes on root index |
| 2026-03-21 | `ad69be9` | Apply routing-page changes to `/home` only |
| 2026-03-21 | `b643c87` | Style `/home` CTA buttons |
| 2026-03-21 | `8050a7b` | Add initial `/buy` buyer inquiry page |
| 2026-03-21 | `82edeac` | Wire `/home` buy CTA to `/buy` |
| 2026-03-21 | `d75f465` | Apply mint/forest branding from reference to `/home` and `/buy` |
| 2026-04-01 | `06dc4ec` | First draft intent-based sub-sites: `/buy`, `/sell`, and `/broker`, with `/home` routing updated |
| 2026-04-01 | `e25402f` | Expand `/broker` content to explain how Namou works with brokers after the brief is shared |
| 2026-04-01 | `pending` | Add proof, value, and what-happens-next content across `/home`, `/buy`, `/sell`, and `/broker`, including buyer/broker video-call pitch-deck references |
