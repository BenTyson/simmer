# Ember Whisk - AI Agent Session Start

> **READ THIS FIRST** - Essential context for new AI agent sessions
> **Last Updated**: 2025-12-24
> **Project Status**: MVP Complete - Ready for Launch
> **Domain**: emberwhisk.co

---

## 1. Quick Start Commands

```bash
cd /Users/bentyson/simmer
git checkout develop     # Always work on develop branch
git pull origin develop  # Get latest changes

npm run dev              # http://localhost:3388
npm run build            # Production build

# Scrape recipes (requires dev server running)
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3388/api/cron/scrape
```

### Git Workflow
```
develop → https://simmer-staging-staging.up.railway.app (staging)
main    → https://emberwhisk.co (production)
```
- **Always push to `develop`** - never push directly to `main`
- Create PR from `develop` → `main` to deploy to production
- See [AGENT-WORKFLOW.md](./AGENT-WORKFLOW.md) for full workflow guide

---

## 2. Project Overview

**Ember Whisk** strips bloat from recipe websites. We scrape schema.org/Recipe data, present it cleanly, and add value through scaling, unit conversion, and shopping lists.

- **Revenue**: Affiliate links (Instacart, Amazon)
- **Design**: Bold & Playful (coral #FF6B35, teal #00D9C0, yellow #FFD23F)
- **Database**: Supabase PostgreSQL with 10+ recipes indexed
- **Status**: Core scraping pipeline operational

---

## 3. Critical Files Map

### Pages (App Router)
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage with hero search |
| `src/app/search/page.tsx` | Search results with filters |
| `src/app/recipe/[slug]/page.tsx` | Recipe detail view |
| `src/app/list/page.tsx` | Shopping list (client-side) |
| `src/app/about/page.tsx` | About + legal info |
| `src/app/not-found.tsx` | Custom 404 page |
| `src/app/error.tsx` | Error boundary |
| `src/app/global-error.tsx` | Root error boundary |

### SEO & Meta Files
| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap with all recipes |
| `src/app/robots.ts` | robots.txt configuration |
| `src/app/manifest.ts` | PWA web manifest |
| `src/app/icon.tsx` | Dynamic favicon (32x32) |
| `src/app/apple-icon.tsx` | Apple touch icon (180x180) |
| `src/app/opengraph-image.tsx` | OG image for social sharing |
| `src/app/twitter-image.tsx` | Twitter card image |

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/scrape` | POST | Manual single URL scrape |
| `/api/cron/scrape` | POST | Process queue (batch) |
| `/api/cron/discover` | POST | Discover URLs from sitemaps |
| `/api/recipes/[id]/reviews` | GET/POST | Fetch or submit reviews |

### Core Libraries
| File | Purpose |
|------|---------|
| `src/lib/scraper/index.ts` | Scraping orchestrator |
| `src/lib/scraper/schema-parser.ts` | JSON-LD + HTML entity cleaning |
| `src/lib/scraper/ingredient-parser.ts` | Parse "2 cups flour" |
| `src/lib/db/recipes.ts` | Recipe CRUD (includes rating fields) |
| `src/lib/db/search.ts` | FTS queries |
| `src/store/shopping-list.ts` | Zustand + localStorage |

### Review Components
| File | Purpose |
|------|---------|
| `src/components/ui/StarRating.tsx` | Display star rating (1-5) |
| `src/components/ui/StarInput.tsx` | Interactive star input |
| `src/components/recipe/ReviewForm.tsx` | Submit review form |
| `src/components/recipe/ReviewList.tsx` | Paginated review list |
| `src/components/recipe/ReviewCard.tsx` | Single review display |
| `src/components/recipe/ReviewsSection.tsx` | Wrapper for recipe pages |

### Mobile UI Components
| File | Purpose |
|------|---------|
| `src/components/layout/BottomNav.tsx` | Fixed bottom nav (mobile only) |
| `src/components/ui/BottomSheet.tsx` | Slide-up modal component |
| `src/components/recipe/MobileFilters.tsx` | Tab-based mobile filters |
| `src/components/recipe/RecipeFilters.tsx` | Desktop dropdowns + mobile integration |

### Database Migrations
| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Core tables |
| `002_fts_search.sql` | Full-text search |
| `003_domain_functions.sql` | Domain stats |
| `004_fix_search_vector.sql` | Parameter name fix |
| `005_reviews.sql` | Reviews table + rating trigger |

---

## 4. Environment Setup

`.env.local` required variables:
```bash
SUPABASE_ACCESS_TOKEN=sbp_...        # For CLI
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=your-secret-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # Used for sitemap, OG images, Plausible
```

---

## 5. Current State

### Done
- [x] All pages rendering
- [x] Database connected (Supabase)
- [x] Scraping pipeline operational
- [x] 458+ recipes indexed from multiple sources
- [x] HTML entity cleaning (`&nbsp;` → space)
- [x] Supabase CLI linked for SQL execution
- [x] Browse pages (category, cuisine, diet, protein, time, method, vegetable)
- [x] Load More pagination on all browse pages
- [x] Ratings & Reviews system (anonymous)
- [x] Plausible analytics configured (uses NEXT_PUBLIC_SITE_URL)
- [x] Recipe filters on browse pages (cuisine, diet, time, rating)
- [x] Dynamic sitemap.xml with all recipes and browse pages
- [x] robots.txt configured
- [x] Error pages (not-found.tsx, error.tsx, global-error.tsx)
- [x] Favicon set (icon.tsx, apple-icon.tsx, icon-192, icon-512)
- [x] Web manifest (manifest.ts)
- [x] OG images for social sharing (opengraph-image.tsx, twitter-image.tsx)
- [x] Loading states for all main routes
- [x] Lighthouse audit passed (Performance: 68%, A11y: 96%, Best Practices: 100%, SEO: 91%)
- [x] Color contrast accessibility fixes
- [x] **V2 Mobile-First UI Polish**:
  - Mobile bottom navigation (Home, Search, List, Browse)
  - Bottom sheet filters for mobile
  - Simplified recipe cards (single smart badge)
  - Playful hover effects (rotation, lift)
  - Fixed invisible touch buttons on mobile
- [x] **Staging Environment**:
  - `develop` branch → staging.railway.app
  - `main` branch → production.railway.app
  - Full CI/CD pipeline configured

### Not Done - Launch Blockers
- [ ] Get custom domain (user working on this)

### Not Done - Post-Launch
- [ ] Affiliate link integration
- [ ] Scale to 1000+ recipes
- [ ] User accounts (reviews currently anonymous)
- [ ] Images (intentionally skipped - copyright)

---

## 6. Key Constraints

1. **ALWAYS credit sources** - Every recipe links to original
2. **NEVER scrape photos** - Copyright violation
3. **Respect rate limits** - 5+ seconds between requests
4. **Use schema.org only** - No prose/stories
5. **Port 3388** - Local development
6. **Bold & Playful design** - Not minimal

---

## 7. Running SQL Commands

Use Supabase Management API:
```bash
curl -X POST "https://api.supabase.com/v1/projects/hrreshxbsmaakqkpygrm/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT name FROM recipes LIMIT 5;"}'
```

---

## 8. Related Docs

| Document | Purpose |
|----------|---------|
| [SIMMER.md](./SIMMER.md) | Vision, business context, session log |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |
| [AGENT-WORKFLOW.md](./AGENT-WORKFLOW.md) | Git branching & deployment workflow |
