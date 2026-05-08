# /v3/ — Content placeholders

Every value flagged inline with `<span class="v3-flag">` renders as a small amber badge on the rendered page so reviewers see exactly what's mock data. Below is the comprehensive list.

## Wynn catalyst section (home) — added in surgical pass

| Item | Current placeholder | Owner |
|---|---|---|
| Wynn opening date | Q1 2027 | Jad — confirm exact opening month |
| Wynn development scale | USD 3.9B+ integrated resort | Jad — confirm latest figure |
| UAE casino license status | "Only UAE casino license issued" | Jad — confirm whether literally true at publish date |
| Wynn 30km zone claim | "Every Namou-mandated plot sits inside the Wynn 30km zone." | Jad / Nadim — verify literal accuracy against full mandate list |

## Buyer pipeline data (home + sell hub) — added in surgical pass

| Page | Stat | Current placeholder | Owner |
|---|---|---|---|
| `/v3/sell/` hero | Daily inbound buyer leads | `[X]` placeholder | Jad — replace with quarterly average |
| `/v3/sell/` pipeline section | Daily inbound buyer leads | 14 | Jad |
| `/v3/sell/` pipeline section | Qualified buyers in active pipeline | 210+ | Jad |
| `/v3/sell/` pipeline section | Average time to first match | 11 days | Jad |
| `/v3/sell/` pipeline section | Average time to close | 71 days | Jad |

## Numerical stats (placeholder until real data lands)

| Page | Stat | Current value | Owner |
|---|---|---|---|
| `/v3/`              | Transactions closed                | 18                | Adam |
| `/v3/`              | Total transaction volume           | AED 218M          | Adam |
| `/v3/`              | Plots under active mandate         | 12                | Adam / Nadim |
| `/v3/`              | Average time to sale               | 71d               | Adam |
| `/v3/sell/`         | Active pre-qualified buyers        | 210+              | Nadim |
| `/v3/sell/`         | Recent matches across mandates     | 36                | Nadim |
| `/v3/invest/`       | Open opportunities                 | 4                 | Jad |
| `/v3/invest/`       | Min ticket / IRR / hold ranges     | AED 2M+ / 12–24% / 2.5–7y | Jad |

## Compliance / licensing — `/v3/about/`

| Item | Current placeholder | Owner |
|---|---|---|
| RAK DED license number | "License # placeholder" | Farid |
| RERA registration number | "RERA # placeholder" | Farid |
| Year established | "Operating in RAK since 2019" | Farid (confirm year) |

## Commission rates — `/v3/broker/`

| Page | Item | Current placeholder | Owner |
|---|---|---|---|
| `/v3/broker/`      | Default broker split       | 50/50 | Adam |

## JV deal data — `/v3/invest/`, `/v3/invest/<model>/`, `/v3/invest/deals/`

The four deals in `/v3/data/deals.json` are mock structures — area, model, IRR target, hold, min ticket, raise size, partner notes. Replace with real opportunities under NDA before the deck distribution. All ranges (IRR, hold, min ticket) on `/v3/invest/`, `/v3/invest/sellout/`, `/v3/invest/income/`, `/v3/invest/hospitality/` are placeholder — Jad to confirm actuals.

| Field | Owner |
|---|---|
| Per-deal description, partners | Jad |
| Per-model IRR / EM / cash-on-cash ranges | Jad |
| Sample-deal table on each model page | Jad |
| Capital call schedule percentages | Jad |
| Preferred return percentage (currently "8% pref") | Jad |
| Sponsor promote percentage (currently "20%") | Jad |
| Protection-window length on `/v3/broker/agreement/` (currently 12 months) | Adam |

## Plot data — `/v3/data/plots.json` + `/v3/buy/[slug]/`

Twelve plots with realistic-shape but placeholder pricing, sizes, descriptions. Audit each before going live:

| Field | Owner |
|---|---|
| Real plot inventory | Nadim |
| Per-plot title status, NOC, encumbrances | Nadim |
| Suggested use cases | Nadim / Adam |
| Adjacent developments per plot | Nadim |
| Distance pills (Wynn, RAK Airport, Dubai) | Confirm per plot — currently generic |

## Form submission targets

| Form | Current target | Notes |
|---|---|---|
| `/v3/broker/register/` form     | wa.me deep link to +971569636360 | Same |

## Sample documents

| Item | Location | Owner |
|---|---|---|
| Sample A2A PDF download   | `/v3/broker/agreement/` (currently `#`) | Adam (legal counsel) |

## Word-count compliance audit

Each page conforms to its specified budget. Spot-checked manually during build; no violations. Re-run an automated word-count scan after any copy edit.
