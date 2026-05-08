# `/v3/` — Components

Reference for v3's component class system. Use this when authoring or
modifying any v3 page so you don't reinvent a class that already exists,
and so you understand modifier behavior before adding new variants.

— Brand tokens, color values, type scale, motion ease curves live in
[`../DESIGN.md`](../DESIGN.md). This doc references token names but does
not restate values.
— Variant strategy, deployment, the WhatsApp handoff pattern, and the
v3 data layer live in [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md).
— Route tree and link relationships live in [`./SITEMAP.md`](./SITEMAP.md).

## Conventions

- **BEM-style** — `.v3-block`, `.v3-block__element`, `.v3-block--modifier`.
- **`.v3-` prefix** on every class so v3 styles never collide with root or v2.
- **Status legend per component:**
  - ✅ Live — currently rendered in `v3/*.html`
  - ⚠️ Subject to change / partial drift / verify before relying on
  - ❌ Orphan — CSS rule exists, no HTML usage. Listed in §6 with delete instructions.
- **Markup snippets are condensed** — class structure only. Attributes
  are shown only when behavior depends on them (e.g. `data-area` on
  `.v3-plot`, read by the buy filter). Token values, padding, color:
  not in the skeleton — link to [`../DESIGN.md`](../DESIGN.md).
- **Card design** — `.v3-card` (see §1.12) is the v3 default card pattern.
  Apply it everywhere a card is needed unless the placement has been
  explicitly approved for an alternative design (e.g. `.v3-aud-card` on
  the home audience router, where image-led cards are an IA decision).
  New components should default to `.v3-card`.

## CSS layering note

v3's stylesheet (`v3/css/v3.css`) **layers on top of v2's base styles**
(`v3/css/styles.css` is a copy of v2's base, loaded first). Resets,
typographic defaults, the `.btn`/`.btn--primary` button styles, the
nav/footer/intent-modal classes, and the brand-token `:root` block all
come from the v2 base. v3 adds its own scoped components on top with
the `.v3-` prefix.

**Implication:** a change to v2's `styles.css` cascades into v3
rendering. When editing v2, scan v3 surfaces too. When editing v3,
prefer adding `.v3-`-prefixed rules over modifying inherited base
styles.

## Quick index

| Section | Components |
|---|---|
| §1 Primitives | section, cta-row, prose, eyebrow, h1/h2/h3, lede, body, serif, flag, **card** |
| §2 Hero family | `.v3-hero` (+ `--full`, `--text`) |
| §3 Home page | marquee, audience-router cards, wynn catalyst, trust strip, hub marquee (used on the 4 audience hubs) |
| §4 Cross-page section blocks | feature-row, usps, process, stats, faq, twocol, pill, table, illu |
| §5 Audience-specific | Buy / Sell / Invest / Broker / About / Track-record blocks |
| §6 Orphaned CSS | Delete backlog with line ranges and risk per item |
| §7 Card-design migration audit | `.v3-card`-vs-existing categorization (pending review) |

---

# 1. Primitives

## 1.1 `.v3-section` ✅

**Purpose.** Vertical rhythm primitive. Every page section wraps in
`.v3-section` to inherit consistent top/bottom padding (controlled by
`--v3-pad-y`). Inner container caps at viewport-width by default.

**Used on.** Every v3 page.

**Markup.**
```
<section class="v3-section">
  <div class="v3-section__inner">
    …
  </div>
</section>
```

**Modifiers.**
- `.v3-section--alt` — switches background to `var(--v3-mint-white)`. Used to alternate section bands.
- `.v3-section--narrow` — caps `.v3-section__inner` at `760px` (forms, reading-width content).
- `.v3-section--cta` — large vertical padding for closing CTAs; centers content.
- `.v3-section--strip` — short padding (`32px`) with rule lines top + bottom. Used for the home marquee strip.
- `.v3-section--trust` — tighter padding (clamp 16/26px) for the home trust strip.

**Notes.**
- `.v3-section__inner` has `max-width: none` by default — wide-monitor coverage. See [`DESIGN.md` Layout](../DESIGN.md#layout).
- Default horizontal padding is `32px`. Side padding is the section's responsibility, not the inner container's.
- `--v3-pad-y` is defined in `:root` of `v3.css` as `clamp(80px, 9vw, 128px)`.

## 1.2 `.v3-cta-row` ✅

**Purpose.** Horizontal flex container for one or more CTA buttons.

**Used on.** Every v3 page that has a section-level CTA.

**Markup.**
```
<div class="v3-cta-row">
  <a class="btn btn--primary" href="…">…</a>
  <a class="btn btn--ghost" href="…">…</a>
</div>
```

**Modifiers.**
- `.v3-cta-row--center` — centers buttons horizontally; used inside hero copy and CTA-final sections.

**Notes.**
- Inside `.v3-hero` containers, `.v3-cta-row` is auto-centered by a hero-scoped rule (no `--center` modifier needed).
- Buttons use the `.btn` and `.btn--primary` / `.btn--ghost` classes inherited from v2's `styles.css`.

## 1.3 `.v3-prose` ✅

**Purpose.** Lightweight wrapper for paragraph blocks (e.g. About story).
Resets margins on child `<p>` so multiple paragraphs sit consistently.

**Used on.** `/v3/about/`.

**Markup.**
```
<div class="v3-prose">
  <p>…</p>
  <p>…</p>
</div>
```

## 1.4 `.v3-eyebrow` ✅

**Purpose.** Small uppercase label above a section heading. Renders
in `var(--accent)` with letter-spacing.

**Used on.** Every section across v3.

**Markup.** `<p class="v3-eyebrow">Where you fit in</p>`

## 1.5 `.v3-h1` ✅

**Purpose.** Display heading for hero sections only.

**Used on.** Every v3 hero.

**Markup.** `<h1 class="v3-h1">Headline with <span class="v3-serif">accent</span>.</h1>`

**Notes.**
- Capped at `max-width: 22ch` for readability.
- v2 base CSS applies `text-transform: capitalize` to all `<h1>`; the v3 capitalize-override rule (top of `v3.css`) restores natural sentence case.

## 1.6 `.v3-h2` ✅

**Purpose.** Section heading.

**Markup.** `<h2 class="v3-h2">Headline with <span class="v3-serif">accent</span>.</h2>`

**Modifiers.**
- `.v3-h2--center` — centers + adjusts max-width to `32ch`. Used in CTA-final headings.

## 1.7 `.v3-h3` ✅

**Purpose.** Sub-heading inside a section (e.g. step labels, card titles).

**Markup.** `<h3 class="v3-h3">…</h3>`

## 1.8 `.v3-lede` ✅

**Purpose.** Paragraph immediately following a hero or section heading.
Larger than body; muted color.

**Markup.** `<p class="v3-lede">…</p>`

## 1.9 `.v3-body` ✅

**Purpose.** Paragraph body within sections.

**Modifiers.**
- `.v3-body--center` — centers and tightens max-width. ⚠️ Orphan after the public seller intake page was retired.

## 1.10 `.v3-serif` ✅

**Purpose.** Italic Instrument Serif accent on a single phrase. Brand
voice rule: **one phrase per page maximum**. See
[`PRODUCT.md` Brand Voice](../PRODUCT.md#brand-voice) and
[`DESIGN.md` Typography](../DESIGN.md#typography).

**Markup.** `<span class="v3-serif">your land</span>`

**Notes.**
- Color: `var(--v3-forest)` on light backgrounds, `var(--mint)` inside `.v3-section--deep` and `.v3-hero--full`.
- Audit each page on save: if `class="v3-serif"` appears more than once on the same page, remove all but one.

## 1.11 `.v3-flag` ✅

**Purpose.** Inline placeholder marker. Renders as a small amber badge
indicating mock content for reviewers. Tracked in [`./PLACEHOLDERS.md`](./PLACEHOLDERS.md).

**Markup.** `<span class="v3-flag" title="Placeholder figure">[X]</span>`

**Notes.** Strip every `.v3-flag` instance before going to production.

## 1.12 `.v3-card` ✅

**Purpose.** v3's default card primitive — the canonical content-card
treatment used site-wide. Port of root site's `.bento__cell` visual
(light fill, mint rule border, rounded corners, centered icon + display-
scale title + supporting body, hover lift). Applies everywhere a card
is needed unless the placement has been explicitly approved for an
alternative design.

**Used on.** `/v3/` (Wynn sub-grid). **Standing rule** (see Conventions
above): every new card placement should default to `.v3-card`. Existing
v3 components that haven't been migrated yet are tracked in §7 with a
migrate / keep-special / surface-for-decision categorization; treat that
table as the migration backlog.

**Markup.**
```
<div class="v3-card">
  <span class="material-symbols-outlined v3-card__icon">…</span>
  <h4 class="v3-card__title">…</h4>
  <p class="v3-card__body">…</p>
</div>
```

**Sub-elements.**
- `.v3-card__icon` — Material Symbols span at the top of the card,
  `font-size: 32px; color: var(--accent)`.
- `.v3-card__title` — display heading. DM Sans 500,
  `clamp(1.4rem, 2vw, 2rem)`, line-height 1.1, letter-spacing -0.02em.
  For stat-style cards (value-as-title hierarchy), the value goes here
  even when it's a short string like `0%` or `45 min`.
- `.v3-card__body` — supporting copy. 14px, `var(--ink-muted)`, line-
  height 1.6.

**Token mapping (root → v3 port).**
- bg: `var(--bg-alt)` → `var(--v3-mint-white)` (slight mint tint vs
  root's neutral gray; keeps brand consistency)
- border: `1px solid var(--line)` → `1px solid var(--v3-rule)` (RGBA
  value identical, just v3 token name)
- radius / padding / icon size / accent color / title scale / body
  scale — all direct port

**Notes.**
- Cards inside a CSS Grid that has multiple columns will share row
  height when `align-items: stretch` is the default — useful for
  paired-card layouts. Source-order placement may need
  `grid-auto-flow: dense` if cards are explicitly assigned to columns
  (see §3.3 Wynn sub-grid for the precedent).
- The class name was renamed from `.v3-wynn-card` to `.v3-card` once
  the pattern was promoted to a site-wide primitive. The old class no
  longer exists in CSS or HTML.
- One known explicit alternative: `.v3-aud-card` (§3.2) — image-led
  audience-router cards on the home page. The image-led IA is an
  approved deviation, not a candidate for migration.

---

# 2. Hero family

## 2.1 `.v3-hero` ✅

**Purpose.** Page hero. Two variants — `--full` for image-led heros,
`--text` for text-only heros (sub-pages, forms).

**Used on.** Every v3 page (one hero per page).

**Markup — `--full` variant.**
```
<section class="v3-hero v3-hero--full">
  <div class="v3-hero__media">
    <img src="…" alt="…">         <!-- or a .ph placeholder div -->
  </div>
  <div class="v3-hero__copy">
    <p class="v3-eyebrow">…</p>
    <h1 class="v3-h1">…</h1>
    <p class="v3-lede">…</p>
    <div class="v3-cta-row">…</div>
  </div>
</section>
```

**Markup — `--text` variant.**
```
<section class="v3-section v3-hero v3-hero--text">
  <div class="v3-section__inner">
    <p class="v3-eyebrow">…</p>
    <h1 class="v3-h1">…</h1>
    <p class="v3-lede">…</p>
  </div>
</section>
```

**Modifiers / sub-elements.**
- `.v3-hero--full` — image fills behind copy with a brand-tinted gradient overlay; copy sits at top, centered. Desktop ≥1024px caps height at `calc(100dvh - 80px)` so hero + marquee fit one viewport.
- `.v3-hero--text` — text-only, padded `clamp(140px, 18vh, 200px)` top to clear the floating nav. Inner caps at `880px`.
- `.v3-hero__copy` — content container. Receives white text via `--full` rules; auto-centered by the hero-scoped alignment rules.
- `.v3-hero__media` — image/placeholder container. `object-fit: cover` crops to fit the hero box.
- `.v3-hero__media--plot` — softer gradient overlay for plot-detail heros.

**Notes.**
- All hero child elements (`.v3-eyebrow`, `.v3-h1`, `.v3-lede`, `.v3-cta-row`) are auto-centered inside any hero. Don't add `--center` modifiers manually.
- Plot-detail and deal-detail pages reuse `.v3-hero--full` with `.v3-hero__media--plot`.

---

# 3. Home page components

## 3.1 `.v3-marquee-section` ✅

**Purpose.** The 80px-tall scrolling band of RAK freehold zone names
that sits at the bottom of the home hero. Combined with the hero,
fills exactly `100dvh` on desktop.

**Used on.** `/v3/` only.

**Markup.**
```
<section class="v3-section v3-section--strip v3-marquee-section">
  <div class="v3-marquee" aria-label="RAK freehold zones">
    <div class="v3-marquee__track">
      <span class="v3-marquee__item">Al Marjan Island</span>
      <span class="v3-marquee__sep">·</span>
      <!-- repeated; the duplicate set is aria-hidden for seamless loop -->
    </div>
  </div>
</section>
```

**Modifiers / sub-elements.** `__track`, `__item`, `__sep`.

**Notes.**
- Duplicates the item list inside `__track` and animates `transform: translateX(-50%)` on a 40s linear loop for a seamless scroll.
- Pauses on hover. Honors `prefers-reduced-motion`.
- Mask gradient on the marquee container fades items in/out at the edges.

## 3.2 Audience router — `.v3-aud-router__grid` + `.v3-aud-card` ✅

**Purpose.** Premium editorial cards routing the visitor to one of four
audience hubs (Buy / Sell / Invest / Broker). Each card is a single
clickable `<a>` wrapping image + content panel with a soft fade between.

**Used on.** `/v3/` only.

**Markup.**
```
<section class="v3-section v3-section--alt v3-aud-router" id="audience">
  <div class="v3-section__inner">
    <p class="v3-eyebrow">Where you fit in</p>
    <h2 class="v3-h2">…</h2>

    <div class="v3-aud-router__grid">
      <a class="v3-aud-card" href="/buy/">
        <div class="v3-aud-card__image-wrap">
          <img class="v3-aud-card__image" src="…" alt="…">
          <!-- OR: <div class="v3-aud-card__placeholder">…</div> -->
        </div>
        <div class="v3-aud-card__body">
          <div class="v3-aud-card__label-row">
            <span class="v3-aud-card__label">BUY</span>
            <span class="v3-aud-card__label-dot"></span>
          </div>
          <h3 class="v3-aud-card__headline">…</h3>
          <span class="v3-aud-card__link">… <svg class="v3-aud-card__arrow">…</svg></span>
        </div>
      </a>
      <!-- 3 more cards -->
    </div>
  </div>
</section>
```

**Sub-elements.**
- `.v3-aud-card__image-wrap` — `aspect-ratio: 16/9`, soft fade overlay via `::after` pseudo-element gradient → cream.
- `.v3-aud-card__image` — `object-fit: cover`.
- `.v3-aud-card__placeholder` — mint dotted-border placeholder when no image yet. Sub-elements `__placeholder-label`, `__placeholder-tag`.
- `.v3-aud-card__body` — content panel with `--v3-bg-card` background.
- `.v3-aud-card__label-row` — flex row containing label + mint dot.
- `.v3-aud-card__label` — `BUY` / `SELL` / `INVEST` / `BROKER` (uppercase 12px).
- `.v3-aud-card__label-dot` — 8px mint circle (brand-mark equivalent of a verified checkmark).
- `.v3-aud-card__headline` — 2-line clamp at 18px desktop / 17px mobile.
- `.v3-aud-card__link` — "Open the [audience] hub →" with arrow that translates 4px right on card hover.
- `.v3-aud-card__arrow` — inline SVG arrow.

**Notes.**
- Grid: 2 columns desktop, `column-gap: 24px / row-gap: 48px`. Mobile (≤900px) collapses to 1 column with `row-gap: 32px`.
- Hover: card lifts `translateY(-2px)` with deeper shadow.
- Focus: 2px Forest Green outline + 2px offset for keyboard accessibility.
- Active: scale `0.99` for tactile feedback.
- The `--v3-bg-card` token (`#FAFBF9`, defined in `:root`) is the cream that the image fade dissolves into.

## 3.3 Wynn catalyst — `.v3-wynn` ✅

**Purpose.** Two-column feature block with copy on the left, photograph
on the right. Below the headline + lede, the left column carries a
2-col × 3-row card sub-grid: 3 stat cards in column 1, 3 USP cards in
column 2 (freehold / 0% tax / 45 min from DXB — content sourced
verbatim from the root site's `.bento` USP cells). Communicates the
Wynn Al Marjan opening as the structural growth catalyst for RAK land.

**Used on.** `/v3/` only.

**Markup.**
```
<section class="v3-section v3-section--filled v3-wynn">
  <div class="v3-section__inner">
    <div class="v3-wynn__grid">
      <div class="v3-wynn__copy">
        <p class="v3-eyebrow">…</p>
        <h2 class="v3-h2">…</h2>
        <p class="v3-lede">…</p>
        <div class="v3-wynn__sub">
          <!-- 3 stat cards (column 1, value-as-title) -->
          <div class="v3-card">
            <span class="material-symbols-outlined v3-card__icon">event</span>
            <h4 class="v3-card__title">Q1 2027</h4>
            <p class="v3-card__body">Opening</p>
          </div>
          <!-- 2 more stat cards -->
          <!-- 3 USP cards (column 2, headline + supporting body) -->
          <div class="v3-card">
            <span class="material-symbols-outlined v3-card__icon">public</span>
            <h4 class="v3-card__title">100% freehold.<br>No local sponsor.</h4>
            <p class="v3-card__body">Full ownership rights for international buyers — no residency required.</p>
          </div>
          <!-- 2 more USP cards -->
        </div>
      </div>
      <div class="v3-wynn__map">
        <img src="…" alt="…">
      </div>
    </div>
  </div>
</section>
```

**Sub-elements.** `__grid`, `__copy`, `__sub`, `__map` (on `.v3-wynn`).
The cards inside `__sub` use the site-wide `.v3-card` primitive — see
§1.12 for the full card markup, sub-elements, and token mapping.

**Composition.** Wynn was the **first placement** of `.v3-card` (the
class shipped originally as `.v3-wynn-card` and was renamed once the
pattern was promoted to a v3 default in COMPONENTS.md Conventions).
Other placements may follow per the §6 migration backlog.

**Notes.**
- The section is wrapped in `.v3-section--filled` (85vh min-height,
  flex-centered) so the content sits in a viewport-sized frame on
  desktop (≥1024px). On mobile, default padding-driven height applies.
- `.v3-wynn__map` is capped at `max-height: 540px` on desktop with
  `object-fit: cover` so the photo never dominates the viewport;
  natural aspect at typical column widths usually renders shorter than
  the cap, so the cap is precautionary.
- Card row alignment uses `grid-auto-flow: dense` on `.v3-wynn__sub`
  + explicit `grid-column` per card (cards 1–3 in col 1, cards 4–6 in
  col 2) + `align-items: stretch` (grid default). Result: paired cards
  in each row share top y AND height. **Without `dense`, default
  sparse auto-flow would push cards 4–6 into implicit rows 4–6 — keep
  the `dense` declaration.**
- Stat cards use the value as `__title` (e.g. "Q1 2027") and the label
  as `__body` (e.g. "Opening"), matching root's stat-emphasis hierarchy
  on the `.bento__cell--dark` "0%" cell.
- USP copy is sourced verbatim from root `index.html`'s `.bento` cells
  (cells 2, 3, 4 — the freehold / tax / airport USPs). The Wynn-corridor
  hero card from root (cell 1) is intentionally not duplicated here
  since the surrounding section already pitches Wynn. Icons match root
  where root has one (`public` for freehold, `directions_car` for the
  airport card); v3 adds icons for the otherwise-iconless 0% card
  (`paid`) and all three stat cards (`event`, `trending_up`, `verified`).
- Mobile (≤1000px) collapses `__grid` to single column; the `__sub`
  sub-grid collapses at ≤700px.
- The `__map` slot currently uses a Wynn photograph; the schematic
  ring-map SVG (`/v3/assets/illustrations/wynn-rings.svg`) is retained
  for future reuse.
- **Removed in earlier passes (this section's evolution):**
  - `.v3-wynn__close` paragraph + CSS rule (closing line "Every
    Namou-mandated plot sits inside the Wynn 30km zone." removed)
  - `.v3-wynn__stats--stack` modifier + `.v3-wynn__usps` list (interim
    pre-card sub-grid layout — replaced by the unified `.v3-card`
    pattern)

## 3.4 Trust strip — `.v3-trust` ✅

**Purpose.** Three-cell horizontal trust panel directly below the
audience router. Each cell: icon + headline + body sentence in RE
language ("Plots mandated", "Returns modeled live", "Defensible entry").

**Used on.** `/v3/` only.

**Markup.**
```
<section class="v3-section v3-section--alt v3-section--trust">
  <div class="v3-section__inner">
    <div class="v3-trust">
      <div class="v3-trust__cell">
        <span class="material-symbols-outlined">videocam</span>
        <h3>…</h3>
        <p>…</p>
      </div>
      <!-- 2 more cells -->
    </div>
  </div>
</section>
```

**Sub-elements.** `__cell`. Three cells fixed; mobile (≤720px) stacks to one column.

## 3.5 Hub marquee — `.v3-hub-marquee` + `.v3-marquee__num` ✅

**Purpose.** 80px companion strip that sits directly below `.v3-hero--full`
on audience hub pages that still expose public process steps. Pairs with
the hero (`calc(100dvh - 80px)`) so hero + marquee fill exactly one desktop viewport. Carries the
hub's process steps as a slowly-scrolling numbered band — a sister
component to `§3.1 .v3-marquee-section` (which carries RAK freehold zone
names on the home page).

**Used on.** `/v3/sell/`, `/v3/invest/`, `/v3/broker/`. Note:
despite living in `§3 Home page components` for marquee-family
discoverability, `.v3-hub-marquee` is **not** used on `/v3/`. The home
marquee is `.v3-marquee-section` (zones), the hub marquee is
`.v3-hub-marquee` (process).

**Markup.**
```
<section class="v3-section v3-section--strip v3-hub-marquee">
  <div class="v3-marquee" aria-label="Audience process steps">
    <div class="v3-marquee__track">
      <span class="v3-marquee__item">
        <span class="v3-marquee__num">01</span> Step label
      </span>
      <span class="v3-marquee__sep">·</span>
      <!-- repeat for all steps; aria-hidden duplicate set for seamless loop -->
    </div>
  </div>
</section>
```

**Sub-elements.**
- `.v3-marquee__num` — leading 2-digit step number, accent-colored
  (`var(--accent)`), 0.85em font-size, tabular numerals, 0.4em right margin
  before the step word.
- `.v3-marquee`, `.v3-marquee__track`, `.v3-marquee__item`,
  `.v3-marquee__sep` — reused verbatim from `§3.1` (loop animation,
  mask-gradient, pause-on-hover, `prefers-reduced-motion` handling all
  inherited).

**Per-hub `aria-label` and step content** (verbatim, sourced from existing
process content):

| Hub | `aria-label` | Steps |
|---|---|---|
| `/v3/sell/`   | `Sell process steps`   | `01 Reach out · 02 Assess · 03 Market · 04 Weekly reports · 05 Negotiate & close` (inline `.v3-process` on the hub) |
| `/v3/invest/` | `Investment flow`      | `01 Capital pooled · 02 SPV formed · 03 Asset acquired · 04 Built / operated · 05 Exited / distributed` (sourced from `/v3/invest/{model}/` SPV-flow blocks — all 3 model sub-pages carry identical labels) |
| `/v3/broker/` | `Broker process steps` | `01 Reach out · 02 A2A signed · 03 Handoff · 04 Closing` (inline `.v3-process--4` on the hub) |

**Notes.**
- Wrapper class `.v3-hub-marquee` mirrors `.v3-marquee-section`'s
  exact-80px shape (overrides `.v3-section--strip`'s 32px padding so the
  band lands at exactly 80px height). This is required for the
  `calc(100dvh - 80px)` hero + 80px strip = 1vp pairing math to land cleanly.
- Differentiation from home marquee is purely content-level: numbered
  green-accent prefix (`.v3-marquee__num`) on hub steps vs. unprefixed zone
  names on home. Same band shape, same scroll speed (40s linear loop), same
  pause-on-hover, same `prefers-reduced-motion` handling.
- Slash-with-spaces in step labels (`Built / operated`, `Exited /
  distributed`) is canonical and matches the existing `.v3-process` h3
  rendering on the model sub-pages — preserve when editing.

---

# 4. Cross-page section blocks

## 4.1 Feature row — `.v3-feature-row` + `.v3-feature` ✅

**Purpose.** Horizontal grid of icon-headline-body cards. The
workhorse 3-up (or 4-up) section block used across every audience hub.

**Used on.** Buy hub, Sell hub, Invest hub, Broker hub, About — almost
every audience page renders one.

**Markup.**
```
<div class="v3-feature-row">
  <div class="v3-feature">
    <span class="material-symbols-outlined v3-feature__icon">videocam</span>
    <h3>…</h3>
    <p>…</p>
  </div>
  <!-- 2 or 3 more cells -->
</div>
```

**Modifiers.**
- `.v3-feature-row--4` — switches to 4-column grid. ⚠️ Orphan after the public Sell fees route was retired.
- `.v3-feature-row--off` — dashed border, muted icons. ⚠️ Orphan after the public Sell fees route was retired.

**Notes.**
- `.v3-feature__icon` is the icon span; `.v3-feature` h3 / p are the heading + body.
- Mobile breakpoints: ≤1000px → 2 columns, ≤600px → 1 column.

## 4.2 Numbered USPs — `.v3-usps` + `.v3-usp` ✅

**Purpose.** Two-column grid of numbered "01 / 02 / 03 / 04" USP
blocks. Closes audience hubs and `/v3/invest/` "why JV with Namou".

**Used on.** `/v3/invest/` (Why JV with Namou block).

**Markup.**
```
<div class="v3-usps">
  <div class="v3-usp">
    <span class="v3-usp__num">01</span>
    <h3>…</h3>
    <p>…</p>
  </div>
  <!-- 3 more -->
</div>
```

**Sub-elements.** `__num`.

## 4.3 Process timeline — `.v3-process` ✅

**Purpose.** Numbered horizontal step grid. Default 5 columns; modifier
classes for 3, 4, or 6 steps.

**Used on.** Sell hub (5 steps), Broker hub (4 steps), Invest model
pages (5 steps), Broker register (3 steps).

**Markup.**
```
<div class="v3-process">
  <div class="v3-process__step">
    <span class="v3-process__num">01</span>
    <h3>…</h3>
    <p>…</p>
  </div>
  <!-- repeat -->
</div>
```

**Modifiers.**
- `.v3-process--3` — 3-column grid. ✅ on Broker register.
- `.v3-process--4` — 4-column grid. ✅ on Broker hub.
- `.v3-process--6` — 6-column grid. ❌ orphan — defined but no HTML uses it. See §6.

**Notes.**
- Mobile ≤1100px → 2 columns. ≤600px → 1 column.
- Each step has a hover wash to `var(--accent-subtle)`.

## 4.4 Stats — `.v3-stats` + `.v3-stat` ✅

**Purpose.** Horizontal grid of large numerals + small captions. Used
for credibility ribbons and KPI strips.

**Used on.** Sell hub (4-up pipeline strip), Invest hub (4-up active-pipeline),
Invest model pages (4-up returns profile), Track-record (6-up grid),
Plot detail, Deal detail.

**Markup.**
```
<div class="v3-stats v3-stats--4">
  <div class="v3-stat">
    <p class="v3-stat__num">14</p>
    <p class="v3-stat__label">Daily inbound buyer leads</p>
  </div>
  <!-- repeat -->
</div>
<p class="v3-stats__caption">Pipeline data refreshed monthly. <span class="v3-flag">flag</span></p>
```

**Modifiers.**
- `.v3-stats--3` — 3-column grid. ❌ orphan — defined but no HTML uses it. See §6.
- `.v3-stats--4` — 4-column grid. ✅ widely used.
- `.v3-stats--6` — 6-column grid. ❌ orphan after `/v3/track-record/` removal. See §6.

**Notes.**
- Default (no modifier) is 4-column; `.v3-stats--4` is explicit but visually identical.
- Mobile breakpoints: ≤1100px → 3 cols (`--6` only), ≤900px → 2 cols, ≤540px → 1 col.

## 4.5 FAQ accordion — `.v3-faq` ✅

**Purpose.** Native `<details>/<summary>` accordion for question/answer
pairs. Brand-styled with +/− toggle in accent color.

**Used on.** Current audience sub-pages where inline FAQs remain.

**Markup.**
```
<div class="v3-faq">
  <details class="v3-faq__item">
    <summary class="v3-faq__q">…?</summary>
    <p class="v3-faq__a">…</p>
  </details>
  <!-- repeat -->
</div>
```

**Sub-elements.** `__item`, `__q`, `__a`.

**Notes.**
- Native `<details>` for keyboard accessibility — no JS dependency.
- Was previously rendered on `/v3/insights/` (page removed in `4cc8e59`); the FAQ pattern persists on the Buy process page and is a likely future addition to other audience hubs.

## 4.6 Two-column do/don't — `.v3-twocol` ✅

**Purpose.** Side-by-side "we do this / we don't do that" panel.

**Used on.** `/v3/about/`.

**Markup.**
```
<div class="v3-twocol">
  <div class="v3-twocol__col">
    <h3 class="v3-twocol__h">We focus on</h3>
    <ul class="v3-twocol__list">
      <li><span class="material-symbols-outlined">check_circle</span>…</li>
      <!-- repeat -->
    </ul>
  </div>
  <div class="v3-twocol__col v3-twocol__col--off">
    <h3 class="v3-twocol__h">We don't do</h3>
    <ul class="v3-twocol__list v3-twocol__list--off">
      <li><span class="material-symbols-outlined">close</span>…</li>
    </ul>
  </div>
</div>
```

**Modifiers.** `.v3-twocol__col--off` mutes icon color for the negative column.

## 4.7 Pills — `.v3-pill` + `.v3-pill-list` ✅

**Purpose.** Inline pill labels for status, distance markers, and
faceted lists.

**Used on.** Plot detail (status pills, distance pills, adjacent
developments list), Deal detail ("Behind NDA" list), Plot cards.

**Markup.**
```
<span class="v3-pill v3-pill--ok">Available</span>

<ul class="v3-pill-list">
  <li class="v3-pill v3-pill--ghost">Wynn Al Marjan</li>
  <li class="v3-pill v3-pill--ghost">Al Marjan Boulevard</li>
</ul>
```

**Modifiers.**
- `.v3-pill--ok` — accent-tinted background. Status "Available" / "Open".
- `.v3-pill--ghost` — transparent with rule border. Used for distance / nearby-development lists.

## 4.8 Tables — `.v3-table` ✅

**Purpose.** Data table with brand-styled head row.

**Used on.** Track-record (transactions), Buy process (cost breakdown),
Invest model pages (sample-deal walkthrough, comparison table), Deal
detail.

**Markup.**
```
<table class="v3-table">
  <thead><tr><th>…</th><th>…</th></tr></thead>
  <tbody>
    <tr><td>…</td><td>…</td></tr>
  </tbody>
</table>
<p class="v3-table__note">Note text below table.</p>
```

**Modifiers.**
- `.v3-table--compare` — first column emphasis (label column for cross-variant comparisons).

## 4.9 Illustration wrapper — `.v3-illu` ✅

**Purpose.** Centered max-width container for inline SVG illustrations
(timelines, flow diagrams, model isometrics). Catalogue of standalone
SVGs lives in [`./ASSETS-NEEDED.md`](./ASSETS-NEEDED.md#custom-illustrations).

**Used on.** Buy process (timeline + Gantt), Sell hub (timeline + flow),
Invest model pages (SPV flow + capital call),
Broker hub (commission flow + timeline), Broker agreement (doc mockup).

**Markup.**
```
<div class="v3-illu">
  <img src="/v3/assets/illustrations/valuation-flow.svg" alt="…">
</div>
```

**Modifiers.**
- `.v3-illu--simulator` — adds a hairline border + radius for the JV/ROI simulator screenshots (so they read as device-framed).

---

# 5. Audience-specific blocks

## 5.1 Buy — Filter bar + Plot grid ✅

**Purpose.** Functional filter bar above the inventory grid; reads
filter selections and hides plot cards client-side.

**Used on.** `/v3/buy/`.

**Markup — filter bar.**
```
<div class="v3-filters" role="region" aria-label="Plot filters">
  <label class="v3-filter">
    <span class="v3-filter__label">Land use</span>
    <select id="f-use">…</select>
  </label>
  <!-- 4 more selects: f-area, f-size, f-budget, f-status -->
</div>
<p class="v3-filters__count" id="filter-count">Showing 12 of 12 plots</p>
```

**Markup — plot grid.**
```
<div class="v3-plots" id="plot-grid">
  <article class="v3-plot"
           data-use="Hospitality"
           data-area="Al Marjan Island"
           data-size="101789"
           data-price="38000000"
           data-status="Available">
    <a class="v3-plot__link" href="…">
      <div class="v3-plot__media">
        <img src="…" alt="…">  <!-- or .ph -->
      </div>
      <div class="v3-plot__body">
        <div class="v3-plot__row">
          <p class="v3-plot__loc">Al Marjan Island</p>
          <span class="v3-plot__status v3-plot__status--available">Available</span>
        </div>
        <h3 class="v3-plot__title">…</h3>
        <p class="v3-plot__price"><strong>AED 38M</strong> · AED 373/sqft</p>
        <span class="v3-plot__cta">View details <span class="material-symbols-outlined">arrow_forward</span></span>
      </div>
    </a>
  </article>
  <!-- 11 more plots -->
</div>
```

**Sub-elements.**
- `.v3-filter` — single filter row inside `.v3-filters`. `__label` is the label span.
- `.v3-plot__link` — `<a>` wrapping the entire card.
- `.v3-plot__media` — `aspect-ratio: 3/2` image container.
- `.v3-plot__body` — text content panel with hover lift transitions.
- `.v3-plot__row` — flex row pairing location with status pill.
- `.v3-plot__loc` — uppercase label.
- `.v3-plot__title` — "Use plot · NN,NNN sqft".
- `.v3-plot__price` — `<strong>` AED-millions + price-per-sqft.
- `.v3-plot__cta` — "View details" link with hover-translating arrow.
- `.v3-plot__status` + status modifiers: `--available`, `--under-offer`, `--reserved`, `--open`, `--funded`, `--closed`. Color-coded via `var(--accent-subtle)` and grayed variants.

**JS hook.** `v3/js/v3.js` queries `.v3-plot[data-area|data-use|data-size|data-price|data-status]` and toggles `display: none` based on the five select values. Filter state persists to URL via `URLSearchParams`. **Adding a new filter requires updating both the markup data attribute and the `v3.js` filter logic.**

**Notes.**
- Empty state: see §5.3 `.v3-empty`.
- Mobile breakpoints: filter bar ≤1000px → 2 cols, ≤600px → 1 col. Plot grid ≤1000px → 2 cols, ≤600px → 1 col.

## 5.2 Buy — Plot detail ✅

**Purpose.** Per-plot drilldown page surfaces. Hero, key facts grid,
location pills, ROI snapshot.

**Used on.** Each `/v3/buy/[slug]/` (12 plot detail pages).

**Markup — hero copy add-ons.**
```
<div class="v3-hero__copy">
  <p class="v3-eyebrow">Al Marjan Island · Hospitality</p>
  <h1 class="v3-h1">Hospitality plot · 101,789 sqft</h1>
  <p class="v3-plot-detail__cta-line">Walk this plot on a 20-minute video call.</p>
  <p class="v3-plot-detail__price"><strong>AED 38M</strong> · AED 38,000,000 · AED 373/sqft</p>
  <p class="v3-plot-detail__status"><span class="v3-plot__status v3-plot__status--available">Available</span></p>
  <div class="v3-cta-row">…</div>
</div>
```

**Markup — key facts.**
```
<div class="v3-keyfacts">
  <div class="v3-keyfact">
    <span class="material-symbols-outlined">explore</span>
    <dt>Size</dt>
    <dd>101,789 sqft</dd>
  </div>
  <!-- 5 more (3-column grid, 2 rows) -->
</div>
```

**Markup — location.**
```
<div class="v3-map"><div class="ph">Map placeholder</div></div>
<div class="v3-distances">
  <span class="v3-pill">Wynn Al Marjan: ≈ 12 km</span>
  <span class="v3-pill">RAK Airport: ≈ 25 km</span>
</div>
<ul class="v3-pill-list">
  <li class="v3-pill v3-pill--ghost">Wynn Al Marjan</li>
</ul>
```

**Markup — ROI snapshot.**
```
<div class="v3-roi-snap">
  <img src="/assets/images/roi-simulator.png" alt="…" loading="lazy">
</div>
```

**Notes.**
- `.v3-map` is a 16:9 wrapper currently rendering a placeholder; replace with Mapbox embed when the public token lands. See [`./ASSETS-NEEDED.md`](./ASSETS-NEEDED.md#per-plot-location-maps-v3buyslug).
- `.v3-keyfacts` is a 3-column grid on desktop, single column on ≤720px.
- `.v3-roi-snap` styles the static ROI screenshot with a hairline border.

## 5.3 Buy — Empty state — `.v3-empty` ✅

**Purpose.** Shown when filter selections produce zero plot matches.

**Used on.** `/v3/buy/` (toggled by JS — element with `id="plot-empty"`).

**Markup.**
```
<div class="v3-empty" id="plot-empty" hidden>
  <p>Nothing in current inventory matches that brief…</p>
  <div class="v3-cta-row">
    <a class="btn btn--primary" target="_blank" rel="noopener" href="https://wa.me/971569636360?text=…">Send buyer brief</a>
  </div>
</div>
```

**JS hook.** `v3/js/v3.js` sets `emptyEl.hidden = visible !== 0` after each filter pass.

## 5.4 Sell — Methodology split — `.v3-split` ✅

**Purpose.** Two-column layout: copy + 3 feature cards on the left,
illustration on the right.

**Used on.** `/v3/sell/` (Valuation methodology section).

**Markup.**
```
<div class="v3-split">
  <div class="v3-split__copy">
    <div class="v3-feature-row">…</div>
  </div>
  <div class="v3-split__visual">
    <img src="/v3/assets/illustrations/valuation-flow.svg" alt="…">
  </div>
</div>
```

**Notes.** Mobile ≤1000px stacks to one column.

## 5.5 Sell — Representative card — `.v3-rep` ✅

**Purpose.** Nadim Salameh card — the only team photo on all of v3 per
the v3 build spec. Side-by-side photo + bio + dual CTAs (WhatsApp +
phone).

**Used on.** `/v3/sell/` only.

**Markup.**
```
<div class="v3-rep">
  <div class="v3-rep__photo">
    <img src="/assets/images/nadim-salameh.jpeg" alt="Nadim Salameh, licensed real estate representative">
  </div>
  <div class="v3-rep__copy">
    <h3>Nadim Salameh</h3>
    <p class="v3-rep__role">Licensed RAK real estate representative · 10+ years RAK land transactions</p>
    <p>Your file runs through Nadim end to end…</p>
    <div class="v3-cta-row">
      <a class="btn btn--primary" target="_blank" href="https://wa.me/…">WhatsApp Nadim</a>
      <a class="btn btn--ghost" href="tel:+971569636360">Call …</a>
    </div>
  </div>
</div>
```

**Sub-elements.** `__photo` (round-cropped square), `__copy`, `__role` (accent-colored byline).

**Notes.**
- Mobile ≤720px stacks photo above copy, centered.
- The "no team photos on v3 except this one" rule is documented in the v3 build spec — do not generalize this component to other pages without an explicit owner decision.

## 5.6 Sell — Fees — `.v3-fees` + `.v3-fee` ⚠️

**Purpose.** Retired two-card commission comparison (Exclusive vs Non-exclusive).

**Used on.** Currently orphaned after the public Sell fees route was retired.

**Markup.**
```
<div class="v3-fees">
  <div class="v3-fee">
    <h3>Exclusive mandate</h3>
    <p class="v3-fee__rate">2%<span class="v3-flag">Confirm rate</span></p>
    <ul>
      <li>Full marketing package</li>
      <!-- … -->
    </ul>
  </div>
  <!-- second .v3-fee -->
</div>
```

**Sub-elements.** `__rate` is the large `3rem` percentage display.

## 5.7 Form fields — `.v3-eval` ✅

**Purpose.** Two-column intake form layout. On submit, the active
broker registration handler builds a `wa.me` deep link with all fields
URL-encoded.

**Used on.** `/v3/broker/register/` (form id `#broker-form`) — handler
logic lives in `v3/js/v3.js`.

**Markup.**
```
<form class="v3-eval" id="broker-form" autocomplete="off">
  <label class="v3-eval__field">
    <span class="v3-eval__label">Your name</span>
    <input type="text" name="brokerName" required>
  </label>
  <!-- repeat for broker firm/contact and client brief fields -->
  <label class="v3-eval__field v3-eval__field--full">
    <span class="v3-eval__label">Notes (optional)</span>
    <textarea name="notes"></textarea>
  </label>
  <button type="submit" class="btn btn--primary v3-eval__submit" data-direct-wa="true">…</button>
</form>
```

**Sub-elements.**
- `.v3-eval__field` — single labelled input wrapper. Two-column grid on desktop.
- `.v3-eval__field--full` — span both columns (used for the Notes textarea).
- `.v3-eval__label` — uppercase 11px label above input.
- `.v3-eval__submit` — submit button, spans both columns, justify-self: start.

**JS hook.** `v3/js/v3.js` listens for `submit` on `#broker-form`, builds a `wa.me` URL with the form values URL-encoded, opens in a new tab. Submit is `preventDefault`-ed so no actual form post occurs. Also wired with `data-direct-wa="true"` to bypass the v2-style intent modal (which v3 deliberately doesn't use anyway).

**Notes.**
- Mobile ≤700px collapses to single column.
- Handler logic lives in the same `v3.js`.

## 5.8 Invest — Model cards — `.v3-models` + `.v3-model` ✅

**Purpose.** Three big cards on `/v3/invest/` linking to the three JV
model deep pages (sellout / income / hospitality). Each carries
isometric illustration + key stats + "Explore the model" CTA.

**Used on.** `/v3/invest/`.

**Markup.**
```
<div class="v3-models">
  <a class="v3-model" href="/invest/sellout/">
    <div class="v3-model__illu"><img src="…/model-sellout.svg" alt="…"></div>
    <h3>Sellout · build &amp; sell</h3>
    <p>Build, presell off-plan, exit at handover.</p>
    <dl class="v3-model__stats">
      <div><dt>IRR target</dt><dd>18–22% <span class="v3-flag">Range</span></dd></div>
      <!-- 2 more -->
    </dl>
    <span class="v3-model__cta">Explore the model <span class="material-symbols-outlined">arrow_forward</span></span>
  </a>
  <!-- 2 more models -->
</div>
```

**Sub-elements.** `__illu`, `__stats`, `__cta`.

## 5.9 Invest — Deal grid — `.v3-deals` + `.v3-deal` ✅

**Purpose.** Filterable grid of live JV opportunities.

**Used on.** `/v3/invest/deals/`.

**Markup.**
```
<div class="v3-deal-filters">
  <label class="v3-filter">
    <span class="v3-filter__label">Model</span>
    <select id="d-model">…</select>
  </label>
  <label class="v3-filter">
    <span class="v3-filter__label">Status</span>
    <select id="d-status">…</select>
  </label>
</div>
<p class="v3-filters__count" id="deal-count">…</p>

<div class="v3-deals" id="deal-grid">
  <article class="v3-deal" data-model="hospitality" data-status="Open">
    <a class="v3-deal__link" href="…">
      <div class="v3-deal__media">…</div>
      <div class="v3-deal__body">
        <div class="v3-plot__row">
          <span class="v3-deal__model">hospitality</span>
          <span class="v3-plot__status v3-plot__status--open">Open</span>
        </div>
        <h3 class="v3-deal__title">…</h3>
        <dl class="v3-deal__stats">
          <div><dt>Target IRR</dt><dd>20–24%</dd></div>
          <!-- 3 more -->
        </dl>
        <span class="v3-plot__cta">View details <span class="material-symbols-outlined">arrow_forward</span></span>
      </div>
    </a>
  </article>
  <!-- 3 more deals -->
</div>
```

**Sub-elements.** `__link`, `__media`, `__body`, `__model`, `__title`, `__stats`. Reuses `.v3-plot__row`, `.v3-plot__status*`, `.v3-plot__cta` from the plot family — both grids share the same status-pill + CTA visual language.

**JS hook.** `v3/js/v3.js` queries `.v3-deal[data-model|data-status]` and toggles visibility based on the two select values. Same pattern as the buy filter.

## 5.10 Invest — Progress bar — `.v3-progress` ✅

**Purpose.** Single horizontal raised-percentage bar on a deal detail
page.

**Used on.** Each `/v3/invest/deals/[slug]/`.

**Markup.**
```
<div class="v3-progress">
  <div class="v3-progress__bar" style="width:38%"></div>
</div>
<p class="v3-stats__caption">38% raised. <span class="v3-flag">flag</span></p>
```

**Notes.** Inline `width: NN%` is the live binding to `deal.raisedPct`.

## 5.11 Invest — Partners — `.v3-partners` + `.v3-partner` ✅

**Purpose.** Three-card text-only block describing deal partners
(land partner / developer partner / operator partner). Per the v3 spec
this is **text-only — no partner photos**, even though we use a photo
for Nadim on /v3/sell/.

**Used on.** `/v3/invest/<model>/` and `/v3/invest/deals/[slug]/`.

**Markup.**
```
<div class="v3-partners">
  <div class="v3-partner">
    <h3>Land partner</h3>
    <p>Vetted RAK landowner… <span class="v3-flag">Partner details placeholder</span></p>
  </div>
  <!-- 2 more -->
</div>
```

**Notes.** Mobile ≤1000px stacks to single column.

## 5.12 Broker — Deck walkthrough — `.v3-deck-walk` ✅

**Purpose.** 6-screen broker deck walkthrough, showing each screen
of the Namou broker deck with a 2-line description.

**Used on.** `/v3/broker/`.

**Markup.**
```
<div class="v3-deck-walk">
  <div class="v3-deck-walk__step">
    <img src="/assets/images/deck/deck-home.png" alt="…" loading="lazy">
    <p>…</p>
  </div>
  <!-- 5 more -->
</div>
```

**Notes.** 2-column desktop grid, single column ≤720px.

## 5.13 Broker — Document mockup wrapper — `.v3-doc-mock` ✅

**Purpose.** Centered max-width wrapper for the A2A document mockup
SVG.

**Used on.** `/v3/broker/agreement/`.

**Markup.**
```
<div class="v3-doc-mock">
  <img src="/v3/assets/illustrations/doc-mockup.svg" alt="A2A document mockup">
</div>
```

## 5.14 Broker — Terms list — `.v3-terms` ✅

**Purpose.** Numbered ordered list of plain-English contract terms.
Custom counter rendering with accent color.

**Used on.** `/v3/broker/agreement/`.

**Markup.**
```
<ol class="v3-terms">
  <li>
    <h3>Buyer registration</h3>
    <p>You register your client…</p>
  </li>
  <!-- repeat -->
</ol>
```

**Notes.** Numbers are auto-rendered via CSS `counter-increment` —
don't put numbers in the HTML.

## 5.15 Broker — Principles — `.v3-principle` ✅

**Purpose.** Single-class block for the 4-up "fairness / professionalism /
transparency / client protection" cards. Uses `.v3-feature-row` as
parent grid.

**Used on.** `/v3/broker/`.

**Markup.**
```
<div class="v3-principles">  <!-- ⚠️ note: parent class differs from the singular .v3-principle -->
  <div class="v3-principle">
    <h3>Fairness</h3>
    <p>50/50 default split…</p>
  </div>
  <!-- 3 more -->
</div>
```

**Notes.** ⚠️ The CSS file's `.v3-principle` selector exists but the
parent grid class `.v3-principles` is also active in HTML. Verify
both selectors are stable before refactoring.

## 5.16 About — Credentials — `.v3-credentials` + `.v3-cred` ✅

**Purpose.** 4-up grid of compliance credentials (license number,
RERA registration, office address, year established).

**Used on.** `/v3/about/`.

**Markup.**
```
<div class="v3-credentials">
  <div class="v3-cred">
    <span class="material-symbols-outlined">verified</span>
    <h3>RAK DED license</h3>
    <p>License # placeholder…</p>
  </div>
  <!-- 3 more -->
</div>

<div class="v3-cred-visual">
  <img src="…" alt="Julphar Towers office">
</div>
```

**Sub-elements.** `__visual` is the office photograph slot below the credentials grid.

## 5.17 Track-record — Quotes — `.v3-quotes` + `.v3-quote` ❌

**Purpose.** 3-column grid of anonymised testimonial pull-quotes. Per
v3 spec: text-only, no headshots.

**Used on.** Was used on `/v3/track-record/`; that route was removed,
so this family is now orphan. See §6.7 for delete instructions.

**Markup.**
```
<div class="v3-quotes">
  <blockquote class="v3-quote">
    <p>"…"</p>
    <footer>
      <strong>Investor (anonymized)</strong>
      <span>Single-family office, Riyadh</span>
    </footer>
  </blockquote>
  <!-- 2 more -->
</div>
```

**Notes.** Forest-green left border treatment per quote. Mobile
≤1000px collapses to single column.

---

# 6. Orphaned / deprecated CSS — delete backlog

Each item below is **CSS that exists in `v3/css/v3.css` but has zero
HTML usage in `v3/`**. Listed with delete instructions so a future
cleanup pass can act without re-investigating.

## 6.1 `.v3-router` family ❌

- **Why orphaned:** replaced by `.v3-aud-card` family in commit `b4a327f` (audience-card redesign on home).
- **Lines:** `v3/css/v3.css:432–459` plus the `@media (max-width: 720px)` block on line 460. Approximately **28 lines, 11 selectors** total.
- **Sub-classes:** `.v3-router`, `.v3-router__intro` (via `#audience .v3-router__intro` on line 432), `.v3-router__card`, `.v3-router__media`, `.v3-router__body`, `.v3-router__eye`, `.v3-router__arrow`, plus the cap-override rule on line 21 (`.v3-router__card h3`).
- **Risk:** none — verified zero HTML instances on 2026-04-30 via grep.
- **Action:** safe to delete in next cleanup pass. The line-21 cap-override entry is part of a multi-selector group; remove the `.v3-router__card h3,` segment specifically, leave the rest of the rule alone.

## 6.2 `.v3-areas__caption` ❌

- **Why orphaned:** marquee caption stripped in commit `ceb3652` (hero + marquee fit-to-viewport).
- **Lines:** `v3/css/v3.css:226` (1 rule).
- **Risk:** none — zero HTML instances.
- **Action:** safe to delete.

## 6.3 `.v3-rakmap` ❌

- **Why orphaned:** was the hero illustration on `/v3/insights/`; page removed in commit `4cc8e59`.
- **Lines:** `v3/css/v3.css:674–675` (2 rules).
- **Risk:** none — zero HTML instances.
- **Action:** safe to delete. The standalone `wynn-rings.svg` and `rak-map.svg` files in `/v3/assets/illustrations/` are retained for future reuse — only the CSS wrapper is dead.

## 6.4 `.v3-features__cell` ❌

- **Why orphaned:** the v3 build initially shipped a `.v3-features__cell` audience-features grid; the cells were redesigned to `.v3-feature-row` + `.v3-feature` and `.v3-features__cell` was abandoned. Only residue is its inclusion in the capitalize-override selector group on line 25.
- **Lines:** `v3/css/v3.css:25` (selector segment only — `.v3-features__cell h3,`).
- **Risk:** none — zero HTML instances.
- **Action:** safe to delete the selector segment from line 25; leave the rest of the rule alone.

## 6.5 `.v3-process--6` ❌

- **Why orphaned:** modifier defined for a 6-column process timeline; never instantiated in HTML. The retired public Buy process page used default `.v3-process` (5 columns... actually wrapped).
- **Lines:** `v3/css/v3.css:513` (1 rule).
- **Risk:** ⚠️ **hold for likely future reuse.** A 6-step process is a plausible future addition (extended buying flow, broker onboarding sequence). Pattern is consistent with `--3` and `--4` siblings.
- **Action:** **hold for now.** Only delete if the modifier proves unused after another major v3 build. Tag the rule with a `/* unused — kept for future N-step variants */` comment in the next cleanup pass instead of removing.

## 6.6 `.v3-stats--3` ❌

- **Why orphaned:** modifier defined for a 3-column stats grid; never instantiated. Default stats grid is 4-column; sell hub uses `--4`, no current page uses 3-column or 6-column (the `--6` previously used on track-record was orphaned when that page was removed — see §6.8).
- **Lines:** `v3/css/v3.css:397` (1 rule).
- **Risk:** ⚠️ **hold for likely future reuse.** A 3-column stats grid is a plausible mid-density layout that the next audience-page might want.
- **Action:** **hold for now.** Tag with a `/* unused — kept for future variants */` comment, don't delete.

---

## 6.7 `.v3-quotes` family ❌

- **Why orphaned:** the `/v3/track-record/` page was removed; that page was the only consumer of `.v3-quotes` / `.v3-quote`. The CSS rules and the `.v3-quote` selector group in the capitalize-override list are now dead.
- **Lines:** `v3/css/v3.css:666–671` (the `.v3-quotes` grid + `.v3-quote` blockquote rules + the `@media (max-width: 1000px)` block). Approximately **6 lines, 4 selectors** total.
- **Sub-classes:** `.v3-quotes`, `.v3-quote`, `.v3-quote p`, `.v3-quote footer`, `.v3-quote footer strong`. None appear in the capitalize-override selector list (verified — the override list does not include `.v3-quote`), so no segment removal needed there.
- **Risk:** none — verified zero HTML instances after `/v3/track-record/` removal.
- **Action:** safe to delete in next cleanup pass. The `testimonials.json` data file is retained for possible future reuse on a different surface; do not delete the data file alongside the CSS.

## 6.8 `.v3-stats--6` ❌

- **Why orphaned:** modifier was used only on `/v3/track-record/`'s 6-up stats grid; the page was removed.
- **Lines:** `v3/css/v3.css:464` (1 rule). Plus the `@media (max-width: 1100px)` rule on line 471 that switches `.v3-stats--6` to 3 columns — review whether that media-query branch should also be removed.
- **Risk:** ⚠️ **hold for likely future reuse.** A 6-column stats grid is a plausible future credibility ribbon (similar use case to track-record). Pattern is consistent with `--3` and `--4` siblings.
- **Action:** **hold for now.** Tag with a `/* unused — kept for future N-stat ribbons */` comment in the next cleanup pass instead of removing.

---

## Total cleanup footprint if §6.1–6.4 + §6.7 are deleted

| Item | Lines | Delete-safety |
|---|---|---|
| `.v3-router` family | ~28 lines + 1 selector segment | safe |
| `.v3-areas__caption` | 1 line | safe |
| `.v3-rakmap` | 2 lines | safe |
| `.v3-features__cell` selector segment | 1 selector | safe |
| `.v3-quotes` family | ~6 lines | safe |
| **Total** | **~38 lines, ~17 selectors** | **safe to remove in one focused commit** |

§6.5, §6.6, and §6.8 (`--6`, `--3`, `--6` stats modifiers) **stay**
until proven unneeded across another build cycle.

---

# 7. Card-design migration audit

After `.v3-card` was promoted to the v3 default card primitive (see
Conventions and §1.12), every existing card-like component on v3 was
walked and classified. Three categories:

- **Migrate to `.v3-card`** — generic content-card pattern; should
  match the default visual.
- **Keep as deliberate special design** — has a brand or functional
  reason to look different.
- **Surface for decision** — unclear whether the visual difference is
  deliberate or just predates the rule; needs a call before migration.

This table is a **categorization, not a migration plan** — migration
is a separate decision after review.

| Component | Visual elements | Surface treatment today | Category | Rationale |
|---|---|---|---|---|
| `.v3-aud-card` (§3.2) | image-wrap (16:9) + content panel + soft-fade gradient + label-row + headline + arrow link | bg `--v3-bg-card` cream, 24px radius, border 1px Forest Green 8%, hover lift 2px + deeper shadow | **Keep special** | Image-led IA. Each card carries the audience identity (Buy / Sell / Invest / Broker faces) via photography. The fade-to-cream gradient is the signature visual moment of the home page. Migrating would erase the IA. |
| `.v3-feature` (§4.1) | icon (28px) + h3 + p, left-aligned | bg `--bg` (white), border 1px `--v3-rule`, 14px radius, padding 28×24, hover lift 3px | **Migrate** | Generic icon-headline-body content card. The most-used card pattern across v3 (every audience hub renders one or more `.v3-feature-row`s). Differs from `.v3-card` only in scale (smaller title, smaller icon, tighter padding, white bg, left-aligned, smaller radius) — every difference is a candidate for migration. |
| `.v3-cred` (§5.16) | icon (28px) + h3 + p, left-aligned | bg `--bg` (white), border 1px `--v3-rule`, 12px radius, padding 28×24 | **Migrate** | Visually almost identical to `.v3-feature`. Same icon-h3-p shape. Same migrate-or-keep decision as `.v3-feature` — should follow it. |
| `.v3-trust__cell` (§3.4) | icon (36px) + h3 + p, left-aligned | **no card surface** (no padding, border, radius, or bg) — just text in a slim band | **Keep special** | The trust strip is a deliberate slim-band ribbon (`.v3-section--trust`), not a card grid. Its purpose is a quiet credibility line between the audience router and the closing CTA. Adding card surfaces would inflate the band into a third audience-card panel, breaking the band rhythm. |
| `.v3-fee` (§5.6) | h3 + giant rate (3rem accent-colored) + bullet list | bg `--bg`, border 1px `--v3-rule`, 16px radius, padding 32×28 | **Surface for decision** | Card surface mostly matches `.v3-card` shape, but has a stat-emphasis rate (`.v3-fee__rate` at 3rem) AND a bullet list inside. `.v3-card` has icon + title + body; `.v3-fee` has h3 + big-stat + list. Migrating cleanly would either need a `.v3-card--stat` variant for the rate or an internal-list slot, or just drop the bullet list (content shift). Needs a design call. |
| `.v3-model` (§5.8) | square illustration (200×200 isometric) + h3 + p + bordered stats grid + "Explore the model" CTA arrow | bg `--bg`, border 1px `--v3-rule`, 16px radius, padding 32×28, hover lift 4px + shadow | **Surface for decision** | Multi-element internal structure: illustration + heading + para + stats sub-grid + CTA. Shape diverges from `.v3-card` icon-title-body more than `.v3-fee` does. Could keep as a "feature card" variant; migrating would lose the illustration slot or require a new modifier. |
| `.v3-deal` (§5.9) | image (16:10) + label + status pill + h3 + 4-up stats sub-grid + CTA arrow | bg `--bg`, 14px radius, border 1px `--v3-rule`, hover lift | **Keep special** | Listing-card pattern with image-led top + filterable data attrs (`data-model`, `data-status`). Shares the inventory-card visual language with `.v3-plot`. Shouldn't migrate to a centered icon-title-body shape. |
| `.v3-plot` (§5.1) | image (3:2) + location label + status pill + title + price + CTA arrow | bg `--bg`, 14px radius, border 1px `--v3-rule`, hover lift | **Keep special** | Functional inventory card with `data-area / data-use / data-size / data-price / data-status` attributes wired to the buy filter (`v3.js`). Image-led, listing-card pattern. Migrating would break filter behavior and lose the image slot. |
| `.v3-keyfact` (§5.2) | icon (24px) + dt label + dd value | **grid-cell with surrounding borders** (no individual radius or bg, just shared cell border-right + border-bottom; the whole 3×2 grid reads as a connected table) | **Surface for decision** | Currently a connected-grid pattern (each cell has only borders, not a card surface). Visually a data table, not a card grid. Migrating to `.v3-card` would split the 6 facts into 6 floating cards — different reading. Worth a deliberate decision: data-table or card-grid? |
| `.v3-deck-walk__step` (§5.12) | image (deck screenshot, with own border + 12px radius) + caption below | **no card surface** — image carries its own border; caption sits as plain text below | **Keep special** | The deck walkthrough is a 2-up image gallery; the screenshots ARE the content. A card surface around the image would add a frame-around-frame visual. The caption-below pattern matches the deck-flip semantic. |
| `.v3-partner` (§5.11) | h3 + p, text-only, left-aligned | bg none, border 1px `--v3-rule`, 12px radius, padding 24 | **Surface for decision** | Has card surface (border + radius + padding) but no icon and no bg. Per v3 spec, partner blocks are intentionally text-only (no logos, no headshots). Could migrate to `.v3-card` without an icon (keeping title + body), or keep the simpler text-block. The "no icon" is a deliberate brand choice; migrating risks adding an icon slot that doesn't fit the partner pattern. |
| `.v3-rep` (§5.5) | round photo (Nadim) + role byline + bio + 2 CTAs (WhatsApp + tel) | bg `--v3-mint-white`, border 1px `--v3-rule`, 16px radius, padding 32, side-by-side photo + copy | **Keep special** | The only team photo on all of v3 (deliberate brand rule per the build spec). Shape is photo + bio + dual-CTAs — not a card-grid item, a section-internal feature. Migrating would erase the photo or force the photo into a `__icon` slot, both wrong. |
| `.v3-stat` / `.v3-process__step` | grid cells inside `.v3-stats` / `.v3-process` timelines, with shared borders between cells | grid-cell pattern, NOT individual cards | **Keep special** | These are stat-grid and process-timeline cells, visually a connected table not a card collection. Same pattern as `.v3-keyfact` — connected grid, not individual cards. |
| `.v3-faq__item` | summary + answer detail, native `<details>` element | accordion item, NOT a card | **Skip** | Not a card. Native HTML accordion behavior; styling is divider lines, not card surfaces. |
| `.v3-quote` (§5.17) | blockquote + footer (cite) | left-border accent + mint-white bg, 12px radius right side | **Skip** | Already orphaned after track-record removal (§6.7 in delete backlog). No live HTML usage. |
| `.v3-principle` (§5.15) | h3 + p, used inside `.v3-principles` 4-up grid on `/v3/broker/` | per `v3/COMPONENTS.md` §5.15: ⚠️ CSS selector exists but parent grid uses different class name (`.v3-principles` vs `.v3-principle`) | **Surface for decision** | Pre-existing drift flagged in §5.15. Resolve the class-name drift first, then categorize. Likely shape is similar to `.v3-feature` and `.v3-cred` — would follow their migration decision. |

## Summary

- **Migrate (clean candidates):** `.v3-feature`, `.v3-cred` — both icon-h3-p generic content cards.
- **Keep special (deliberate):** `.v3-aud-card`, `.v3-trust__cell`, `.v3-deal`, `.v3-plot`, `.v3-deck-walk__step`, `.v3-rep`, `.v3-stat` / `.v3-process__step` (grid cells), `.v3-faq__item`, `.v3-quote` (orphan).
- **Surface for decision:** `.v3-fee` (stat + list internal structure), `.v3-model` (illustration + multi-element), `.v3-keyfact` (connected grid vs cards), `.v3-partner` (text-only by spec), `.v3-principle` (drift to resolve first).

## What this audit does NOT do

- **No code migration yet.** This table is the categorization. Migration is a separate decision after review.
- **No removal of existing classes.** Even the "Migrate" candidates keep their current classes until an explicit migration commit.
- **No cross-page rendering changes.** The `.v3-wynn-card` → `.v3-card` rename is a no-op visually (same rule body, same selectors apply on the same elements).
