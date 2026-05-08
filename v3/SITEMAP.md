# /v3/ — Sitemap

Visual sitemap of all routes under `/v3/`. Arrows show the primary link relationships (audience flow + drill-downs). All pages also link to nav (Buy / Sell / Invest / Brokers), the floating WhatsApp CTA, and the footer.

```
/v3/                              · Home — audience routing + credibility
│
├── /v3/about/                    · License, story, focus (NO team grid)
│
├── /v3/buy/                      · Inventory hub — 12 plots, functional filters
│   ├── /v3/buy/[slug]/           · 12 plot detail pages
│   │   ├── al-marjan-hospitality-plot-12
│   │   ├── al-hamra-residential-plot-08
│   │   ├── mina-al-arab-mixed-plot-03
│   │   ├── rak-central-commercial-plot-22
│   │   ├── al-marjan-branded-residential-05
│   │   ├── al-hamra-residential-plot-19
│   │   ├── al-marjan-hospitality-plot-18
│   │   ├── mina-al-arab-residential-plot-07
│   │   ├── rak-central-mixed-plot-31
│   │   ├── al-nakheel-commercial-plot-02
│   │   ├── dafan-al-maireed-industrial-plot-01
│   │   └── al-marjan-branded-residential-09
│
├── /v3/sell/                     · Seller hub — Nadim card here only
│
├── /v3/invest/                   · Three-model JV overview
│   ├── /v3/invest/sellout/       · Build-sell deep page
│   ├── /v3/invest/income/        · Build-lease deep page
│   └── /v3/invest/hospitality/   · Build-to-hotel deep page
│
└── /v3/broker/                   · Broker hub — protection-first
    └── /v3/broker/register/      · Broker scheduling form (→ WhatsApp + A2A)
```

## Link relationships

- **Home → all four audience pages** via the audience-router cards
- **Buy hub ↔ Buy detail** via plot grid + back-to-inventory CTA on each detail page
- **Sell hub → WhatsApp** via free-valuation and mandate CTAs
- **Invest hub → three model pages** via model cards; closing CTA opens WhatsApp for JV inquiries
- **Broker hub → Agreement + Register** via primary CTAs

## SEO surface

- `/v3/sitemap.xml` lists all 23 routes
- Site-root `/robots.txt` references both `/v2/sitemap.xml` and `/v3/sitemap.xml`
- JSON-LD per page:
  - `RealEstateAgent` schema on `/v3/` and `/v3/about/`
  - `Service` schema with audience-specific `serviceType` on every audience hub and sub-page
  - `RealEstateListing` schema on each `/v3/buy/[slug]/`

## Page count summary

- **11 unique HTML structures** (was 17 before `/v3/insights/`, `/v3/track-record/`, public process/form/fees route removals, and `/v3/invest/deals/` removal)
- **23 generated pages total** (11 + 12 plot details)
- **16 SVG illustrations** in `/v3/assets/illustrations/`
- **4 JSON data files** in `/v3/data/`
- **4 documentation files** in `/v3/`
- **1 sitemap, 1 site-root robots.txt**
