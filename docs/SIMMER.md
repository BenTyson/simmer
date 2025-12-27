# EMBER WHISK - Project Overview

> **Last Updated**: 2025-12-24
> **Status**: MVP Complete - Ready for Launch
> **Domain**: emberwhisk.co
> **Local Dev**: `http://localhost:3388`
> **Tagline**: "Recipes that ignite"

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [SESSION-START.md](./SESSION-START.md) | **START HERE** - AI agent onboarding |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |

---

## 1. What is Ember Whisk?

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

### 2025-12-22 - Recipe Filters & Launch Prep

**Accomplished:**
- Added comprehensive filtering to all browse pages
- RecipeFilters component: cuisine, diet, time, rating filters
- Filters combine with primary browse filter (e.g., filter breakfast by Italian + Vegetarian)
- Updated API to support combined filter parameters
- Conducted launch readiness review

**Launch Blockers Identified:**
- Missing: sitemap.xml, error pages, favicon set, OG image, loading states
- Plausible domain hardcoded to Railway URL
- Need custom domain

**Build Status:** Passing

---

### 2025-12-21 - Ratings & Reviews System

**Accomplished:**
- Built complete anonymous reviews system
- Database: `reviews` table with trigger for auto-updating `avg_rating`/`review_count` on recipes
- Components: StarRating, StarInput, ReviewForm, ReviewList, ReviewCard, ReviewsSection
- API: GET/POST `/api/recipes/[id]/reviews` with pagination and sorting
- Integration: Ratings display on RecipeCard and recipe detail pages
- Updated all browse pages to include rating fields

**Build Status:** Passing

---

### 2025-12-16 - Database Connected & Scraping Operational

**Accomplished:**
- Connected Supabase database with all migrations
- Fixed search vector function (parameter name collision)
- Scraped 458+ recipes successfully from multiple sources
- Added HTML entity cleaning (`&nbsp;` → proper spaces)
- Set up Supabase Management API for SQL execution
- Seeded 18 domains and test URLs
- Built all browse pages (category, cuisine, diet, protein, time, method, vegetable)
- Added Load More pagination to all browse pages
- Integrated Plausible analytics

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

### Launch Blockers (Do First)
1. [ ] Create dynamic sitemap.xml
2. [ ] Create error pages (not-found.tsx, error.tsx, global-error.tsx)
3. [ ] Add favicon set and web manifest
4. [ ] Create default OG image for social sharing
5. [ ] Add loading.tsx states for suspense boundaries
6. [ ] Update Plausible domain (currently hardcoded)
7. [ ] Get custom domain (user working on)
8. [ ] Run Lighthouse audit

### Post-Launch
1. [ ] Deploy to Railway with custom domain
2. [ ] Scale scraping to 1000+ recipes
3. [ ] Apply for affiliate programs
4. [x] ~~Add analytics (Plausible)~~ - Done
5. [x] ~~Add ratings & reviews~~ - Done
6. [x] ~~Add recipe filters~~ - Done
7. [ ] User accounts (optional, for persistent reviews)
8. [ ] "Was this helpful?" voting on reviews

---

## Appendix: Recipe Sources

**Tier 1**: AllRecipes, Food Network, Serious Eats, Bon Appetit, Epicurious, BBC Good Food, Taste of Home

**Tier 2**: Delish, Simply Recipes, Budget Bytes, Minimalist Baker, Cookie and Kate, Smitten Kitchen, Pioneer Woman

**Tier 3**: Skinnytaste, Diet Doctor, Oh She Glows, King Arthur Baking
