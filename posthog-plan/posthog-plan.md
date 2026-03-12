# PostHog Implementation Plan (Phase 2)
This document outlines the full PostHog analytics setup to be implemented after the Namou website homepage redesign is complete. It is based on an AI-powered website optimization workflow where PostHog serves as the analytics engine, and an AI assistant reads the data to continuously recommend improvements.
Do NOT implement any of this during Phase 1 (homepage build). This file exists as a reference so the codebase is prepared.
---
## Step 1: Install PostHog
Research how to install PostHog on this repository. Install and configure it. Verify that events are being sent to the PostHog dashboard.
- Sign up for a free PostHog account (free tier: 1M events/month, 5K session replays, 1M feature flag requests)
- Install the PostHog JS snippet or SDK into the site
- Confirm that basic pageview events are flowing into the PostHog dashboard
---
## Step 2: Custom Event Tracking
Set up PostHog custom event tracking on this site. Track the following:
- **WhatsApp button clicks** — with properties: `button_text`, `section` (pulled from the `data-section` attribute on each WhatsApp CTA). This is the primary conversion event.
- **All other button clicks** — with `button_text` as a property
- **Form submissions** (when forms are added on future subpages) — with `form_name` as a property
- **Scroll depth** — at 25%, 50%, 75%, and 100% thresholds
- **Outbound link clicks** — with the destination URL as a property
- **Navigation link clicks** — with the link label and destination as properties
Use descriptive event names (e.g., `whatsapp_cta_clicked`, `button_clicked`, `scroll_depth_reached`, `outbound_link_clicked`).
All interactive elements on the site already have `data-analytics` attributes from the Phase 1 build — use these to hook into events cleanly.
Verify all events appear correctly in the PostHog dashboard.
---
## Step 3: A/B Testing (Feature Flags)
Set up an A/B split test on the hero section using PostHog feature flags:
- Keep the current version as the **control**
- Create one **variant** with a different headline and CTA button text
- Track clicks on the primary WhatsApp CTA as the **conversion goal**
- Split traffic **50/50**
- Both variants should look identical except for the copy being tested
This allows us to test which headline and CTA language drives the most WhatsApp clicks.
---
## Step 4: Connect AI to PostHog Data
This step happens outside the codebase — in the Claude AI web interface:
- Use Claude's **Connectors** feature to link the PostHog account directly to Claude
- This allows Claude to read analytics data in real-time and make recommendations
---
## Step 5: AI-Driven Optimization Loop
Set up a Claude **Project** with the following system prompt:
> You are a website analytics advisor connected to PostHog. When I ask about my site, pull real data from PostHog. Analyze event patterns, conversion rates, and user drop-off points. Identify what is working and what is underperforming. When you recommend a change, write a specific prompt I can paste into Claude Code to implement it. Always back recommendations with actual PostHog data, not assumptions.
Once configured, you can prompt Claude with things like:
- "Update my landing page based on all the analytics of my website"
- "Which sections have the highest drop-off?"
- "What's the WhatsApp click rate from the hero vs. the broker section?"
Claude will analyze the PostHog data and output ready-to-paste Claude Code prompts for each improvement.
---
## Important Note: Meta Pixel & Google Ads Tags
PostHog is for on-site analytics and optimization. It does NOT replace Meta Pixel or Google Ads conversion tracking.
If the business runs Meta or Google ads, those platforms need their own tracking installed separately so their bidding algorithms receive conversion data. The same AI workflow (prompting Claude Code) can be used to install and test those tags.
This is not part of the PostHog plan but should be addressed as a Phase 3 step.
---
## Free Tier Limits (Reference)
PostHog's free tier resets monthly:
- **1,000,000** analytics events/month
- **5,000** session replays/month
- **1,000,000** feature flag requests/month
- No credit card required to start
- Pay-as-you-go pricing kicks in only if limits are exceeded (can set billing caps to prevent surprise charges)