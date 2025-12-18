# SIMMER - Project Overview

> **Last Updated**: 2025-12-16
> **Status**: Database Connected - Scraping Operational
> **Local Dev**: `http://localhost:3388`
> **Tagline**: "Let it simmer"

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [SESSION-START.md](./SESSION-START.md) | **START HERE** - AI agent onboarding |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |

---

## 1. What is Simmer?

A recipe aggregator that strips away stories, ads, and fluff from recipe sites. We present just the recipe with value-added features:

- **Ingredient scaling** - Adjust servings dynamically
- **Unit conversion** - Metric/imperial toggle
- **Shopping lists** - Add ingredients, export to Instacart
- **Clean reading** - No life stories, no pop-ups

**Revenue**: Affiliate links (Instacart, Amazon) + minimal ads
**Target**: $2-5K/month passive income

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 + React 19 |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS v4 |
| Hosting | Railway |
| Scraping | Cheerio (schema.org) |
| State | Zustand + localStorage |

---

## 3. Legal Compliance

### We DO:
- Extract schema.org/Recipe structured data
- Credit and link to original source
- Respect robots.txt and rate limits
- Add genuine value (scaling, lists)

### We DON'T:
- Scrape photos (copyrighted)
- Copy story content
- Ignore rate limits
- Remove attribution

---

## 4. Session Log

### 2025-12-16 - Database Connected & Scraping Operational

**Accomplished:**
- Connected Supabase database with all migrations
- Fixed search vector function (parameter name collision)
- Scraped 10+ recipes successfully from multiple sources
- Added HTML entity cleaning (`&nbsp;` → proper spaces)
- Set up Supabase Management API for SQL execution
- Seeded 18 domains and test URLs

**Recipes Indexed:**
- Budget Bytes, AllRecipes, Serious Eats
- King Arthur Baking, Cookie and Kate, Skinnytaste

**Build Status:** Passing

---

### 2025-12-15 (Session 2) - API Routes & Seed Scripts

- Created `/api/scrape`, `/api/cron/scrape`, `/api/cron/discover`
- Added migration `003_domain_functions.sql`
- Created seed scripts for domains and test URLs

---

### 2025-12-15 (Session 1) - MVP Build

- Built complete Next.js 16 application
- Created Bold & Playful design system
- Implemented all pages and components
- Built scraping pipeline
- Created database schema

---

### 2025-12-13 - Initial Planning

- Named project "Simmer"
- Confirmed legal approach (schema.org)
- Designed architecture

---

## 5. Key Decisions (Final)

1. **schema.org only** - No scraping prose
2. **Always credit sources** - Link to original
3. **No photos** - Copyright risk
4. **Stack**: Next.js + Supabase + Railway
5. **Monetization**: Affiliate links
6. **Design**: Bold & Playful
7. **Light mode only** (MVP)
8. **Port 3388** (local dev)

---

## 6. Next Steps

1. [ ] Deploy to Railway
2. [ ] Scale scraping to 1000+ recipes
3. [ ] Apply for affiliate programs
4. [ ] Add analytics (Plausible)

---

## Appendix: Recipe Sources

**Tier 1**: AllRecipes, Food Network, Serious Eats, Bon Appetit, Epicurious, BBC Good Food, Taste of Home

**Tier 2**: Delish, Simply Recipes, Budget Bytes, Minimalist Baker, Cookie and Kate, Smitten Kitchen, Pioneer Woman

**Tier 3**: Skinnytaste, Diet Doctor, Oh She Glows, King Arthur Baking
