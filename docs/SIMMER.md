# SIMMER - Session Start Document

> **Last Updated**: 2025-12-15
> **Current Phase**: MVP Complete - Ready for Supabase Setup
> **Project Status**: ACTIVE
> **Local Dev**: `http://localhost:3388`
> **Tagline**: "Let it simmer"

---

## Quick Links (Internal Documentation)

| Document | Purpose |
|----------|---------|
| [SESSION-START.md](./SESSION-START.md) | **START HERE** - AI agent onboarding, critical files, quick commands |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture, data models, API design |
| [SIMMER.md](./SIMMER.md) | This file - project vision, business context, session log |

---

## 1. Project Status Summary

### What's Built (MVP Complete)
- [x] Next.js 16 + TypeScript + Tailwind v4
- [x] Bold & Playful design system (coral/teal/yellow palette)
- [x] Homepage with hero search
- [x] Search page with filters
- [x] Recipe detail page with scaling controls
- [x] Shopping list with Zustand + localStorage
- [x] Schema.org scraping pipeline
- [x] Ingredient parser (amounts, units, items)
- [x] Supabase database schema + FTS search
- [x] Railway deployment configuration

### What's Next
- [ ] **Set up Supabase project** and run migrations
- [ ] **Configure environment variables** (.env.local)
- [ ] **Create seed scripts** for initial recipe scraping
- [ ] **Connect Railway** for production deployment
- [ ] **Apply for affiliate programs** (Instacart, Amazon)

---

## 2. Quick Context

**What**: A clean recipe aggregator that strips away the stories, ads, and fluff from recipe sites, presenting just the recipe with value-added features like shopping lists, scaling, and unit conversion.

**Revenue Model**: Affiliate links (Instacart, Amazon) + minimal display ads

**Why This Will Work**: Recipe sites are universally hated for their bloated content. We solve a real pain point by leveraging legally-published schema.org structured data while adding genuine value.

**Target Revenue**: $2-5K/month

**Passivity Score**: 8/10 - Automated scraping, minimal support, evergreen content

---

## 3. Tech Stack (Final)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 16** | SSR for SEO, App Router, React 19 |
| Database | **Supabase (PostgreSQL)** | Recipe storage, full-text search |
| Styling | **Tailwind CSS v4** | Bold & Playful design tokens |
| Hosting | **Railway** | Easy deployment, cron jobs |
| Search | **PostgreSQL FTS** | Built into Supabase |
| Scraping | **Cheerio** | schema.org JSON-LD extraction |
| State | **Zustand** | Shopping list with localStorage |
| Analytics | **Plausible** | Privacy-focused (future) |

---

## 4. Legal Compliance (CRITICAL)

### What We DO
- Extract schema.org/Recipe structured data (publicly published)
- Always credit and link to original source
- Respect robots.txt and rate limits
- Add value through scaling, conversion, shopping lists

### What We DON'T Do
- Scrape photos (copyrighted)
- Copy story content (creative expression)
- Ignore rate limits
- Remove attribution

---

## 5. Session Log

### 2025-12-15 - MVP Build Complete

**Accomplished:**
- Built complete Next.js 16 application from scratch
- Created Bold & Playful design system (coral #FF6B35, teal #00D9C0, yellow #FFD23F)
- Implemented all core pages: Homepage, Search, Recipe Detail, Shopping List, About
- Built scraping pipeline: schema-parser.ts, ingredient-parser.ts, fetcher.ts
- Created Supabase database schema with FTS search functions
- Set up Zustand store for shopping list with localStorage persistence
- Configured Railway deployment (railway.json, standalone output)
- Set local dev port to 3388

**Files Created:** 36 TypeScript/TSX files
**Build Status:** Passing

**Next Session Should:**
1. Set up Supabase project and run migrations
2. Create .env.local with Supabase credentials
3. Build scraping API routes (/api/scrape, /api/cron/scrape)
4. Create seed-urls.ts script for initial recipes
5. Test full scrape → display flow

### 2025-12-13 - Initial Planning

- User presented problem: wife frustrated with recipe site bloat
- Researched legal aspects of recipe aggregation
- Confirmed: recipes not copyrightable, schema.org is fair game
- Designed full aggregator + search approach
- Named project "Simmer" - "Let it simmer"
- Created initial planning document

---

## 6. Success Metrics

| Metric | 6 Month | 12 Month |
|--------|---------|----------|
| Recipes Indexed | 500K | 2M |
| Monthly Visitors | 50K | 200K |
| Shopping List Clicks | 5K | 25K |
| Monthly Revenue | $500-1K | $2-5K |

---

## 7. Key Decisions (DO NOT CHANGE)

These decisions have been made and should not be revisited:

1. **Aggregate via schema.org only** - No scraping of non-structured content
2. **Always credit sources** - Every recipe links to original
3. **No photo scraping** - Copyright violation
4. **Stack**: Next.js + Supabase + Tailwind + Railway
5. **Primary monetization**: Affiliate links (Instacart, Amazon)
6. **Design style**: Bold & Playful (not minimal or warm/cozy)
7. **Light mode only** for MVP (dark mode later)
8. **Local dev port**: 3388

---

## 8. Open Questions (Future Decisions)

- Exact affiliate program partnerships (need to apply)
- Whether to allow user recipe submissions
- Meal planning feature scope
- Mobile app potential
- Premium tier features (if any)
- Custom domain selection

---

## Appendix: Top Recipe Sites for Seeding

### Tier 1 (High Quality schema.org)
1. AllRecipes.com
2. Food Network
3. Serious Eats
4. Bon Appetit
5. Epicurious
6. BBC Good Food
7. Taste of Home

### Tier 2 (Good Coverage)
8. Delish
9. Simply Recipes
10. Budget Bytes
11. Minimalist Baker
12. Cookie and Kate
13. Smitten Kitchen
14. Pioneer Woman

### Tier 3 (Niche/Diet-Specific)
15. Skinnytaste (healthy)
16. Diet Doctor (keto)
17. Oh She Glows (vegan)
18. King Arthur Baking (baking)

**Note:** NYT Cooking has a paywall - skip for now.
