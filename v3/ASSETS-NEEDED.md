# /v3/ — Assets needed

Photography slots used the `<div class="ph">` placeholder component during build; some are now wired to real photography in `/v3/assets/illustrations/`. **Status** column tracks which: ✅ wired (real image rendering today) vs. ⏳ placeholder (still rendering the dotted-mint placeholder div).

To replace a placeholder, remove the placeholder div and insert an `<img>` (or background-image) at the same aspect ratio.

## Photography slots

| Slot | Status | Location | Aspect | Intended use | Source |
|---|---|---|---|---|---|
| `home-hero`        | ✅ wired — `Home-hero.jpg`     | `/v3/`         | 16:9  | Full-bleed RAK aerial — golden hour, elevated angle, no buildings dominant | Licensed stock (in repo) |
| `home-buy-card`    | ⏳ placeholder | `/v3/`         | 16:9 (1200×675) | Audience-router card — aerial of an undeveloped or partially developed RAK plot. Drone, golden hour, scale visible (vehicles or landmarks for context). | Licensed stock (Unsplash/Pexels — Adam to curate) |
| `home-sell-card`   | ✅ wired — `Sell-card-2.jpg`   | `/v3/`         | 16:9 (1200×675) | Audience-router card — aerial of an established RAK residential community (Al Hamra Village or Mina Al Arab style). Proof that mandates become built communities. | Licensed stock (in repo) |
| `home-invest-card` | ✅ wired — `Invest-hero.jpg`   | `/v3/`         | 16:9 (1200×675) | Audience-router card — RAK development under construction or recently completed. Institutional-grade scale (hotel, mixed-use tower, Wynn-adjacent if findable). Same image reused as `/v3/invest/` hero. | Licensed stock (in repo) |
| `home-broker-card` | ⏳ placeholder | `/v3/`         | 16:9 (1200×675) | Audience-router card — close-up of a tablet or laptop screen showing a Namou video deck slide (drone footage, ROI simulator, or master plan view). Product-focused, not lifestyle. | Custom screenshot composite OR licensed stock + overlay |
| `home-wynn`        | ✅ wired — `Wynn-casino.jpg`   | `/v3/` (Wynn catalyst section) | landscape | Wynn integrated resort photograph. Replaced the schematic ring-map SVG (`wynn-rings.svg`); SVG retained in `/v3/assets/illustrations/` for future reuse. | Licensed stock (in repo) |
| `buy-hero`    | ⏳ placeholder | `/v3/buy/`     | 16:9  | RAK plot aerial with infrastructure visible (roads, adjacent dev) | Licensed stock |
| `sell-hero`   | ⏳ placeholder | `/v3/sell/`    | 16:9  | Landowner context — coastal plot or coastline, no faces | Licensed stock |
| `invest-hero` | ✅ wired — `Invest-hero.jpg`   | `/v3/invest/`  | 16:9  | RAK development under construction. Same image as the home invest router card. | Licensed stock (in repo) |
| `about-office`| ⏳ placeholder | `/v3/about/`   | 16:9  | Julphar Towers — exterior wide shot OR interior office | Custom photography (commission) |

## Land-use category images (used across `/buy`, `/buy/[slug]`, `/invest/deals`)

Six master images, one per category. Drop into `/v3/assets/categories/<slug>.jpg`. The `<div class="ph ph--category">` placeholders auto-pick from `data-category` and currently render branded gradient tiles labelled with the category name.

| Category slug | Aspect | Intended use | Source |
|---|---|---|---|
| `residential`         | 3:2 | Villa community aerial, palm-lined streets | Licensed stock |
| `commercial`          | 3:2 | Mid-rise commercial street view, RAK or analogous | Licensed stock |
| `hospitality`         | 3:2 | Beachfront resort aerial | Licensed stock — "Al Marjan resort aerial" |
| `mixed-use`           | 3:2 | Master-planned development aerial | Licensed stock |
| `industrial`          | 3:2 | Industrial zone aerial | Licensed stock |
| `branded-residential` | 3:2 | Tower with hotel branding, beachfront | Licensed stock |

## Per-plot location maps (`/v3/buy/[slug]/`)

Slot `map-<slug>` per plot detail page (12 slots). Currently labelled "Map: <area> — pin coordinates pending Mapbox token". Once the Mapbox public token is supplied, replace each placeholder with a Mapbox GL JS embed of the plot's parcel and a pin at its centroid.

| Slot id template | Aspect | Source |
|---|---|---|
| `map-<plot-slug>` | 16:9 | Mapbox GL JS, `streets-v12` style |

## Custom illustrations — already generated as standalone SVGs

All 16 SVG illustrations are in `/v3/assets/illustrations/`; most are referenced via `<img>`. Brand-coherent (Forest Green stroke, Mint accent fills, Mint White backgrounds, 1.5px stroke). They can be edited or replaced as standalone `.svg` files without touching HTML.

| File | Used on |
|---|---|
| `rak-map.svg`              | (no longer wired — `/v3/insights/` removed; standalone asset retained for future reuse) |
| `valuation-flow.svg`       | `/v3/sell/` valuation methodology |
| `sell-timeline.svg`        | `/v3/sell/` five-step seller timeline |
| `payment-flow.svg`         | (no longer wired — public Sell fees route removed; retained for future reuse) |
| `model-sellout.svg`        | `/v3/invest/` sellout card |
| `model-income.svg`         | `/v3/invest/` income card |
| `model-hospitality.svg`    | `/v3/invest/` hospitality card |
| `spv-flow-sellout.svg`     | `/v3/invest/sellout/` |
| `spv-flow-income.svg`      | `/v3/invest/income/` |
| `spv-flow-hospitality.svg` | `/v3/invest/hospitality/` |
| `capital-call.svg`         | All three `/v3/invest/<model>/` pages |
| `commission-flow.svg`      | `/v3/broker/` |
| `broker-timeline.svg`      | `/v3/broker/` four-step process |
| `doc-mockup.svg`           | `/v3/broker/agreement/` |
| `broker-shield.svg`        | `/v3/broker/` hero |

## Existing assets reused (no action needed)

| Path | Used on |
|---|---|
| `/assets/images/logo-dark.png`      | Nav + footer, every page |
| `/assets/images/jv-strategies.png`  | `/v3/` audience-router invest card |
| `/assets/images/jv-simulator.png`   | `/v3/invest/<model>/` returns profile |
| `/assets/images/roi-simulator.png`  | `/v3/buy/[slug]/` ROI snapshot |
| `/assets/images/deck/deck-home.png` | `/v3/` audience-router broker card |
| `/assets/images/deck/deck-1..6.png` | `/v3/broker/` six-screen deck walkthrough |
| `/assets/images/nadim-salameh.jpeg` | `/v3/sell/` representative card — the only team photo on v3 |

## PDF placeholders

| Slot | Location |
|---|---|
| Sample A2A (PDF) | `/v3/broker/agreement/` — currently links to `#`. Generate a one-page sample agreement PDF and drop at `/v3/assets/sample-a2a.pdf` |
