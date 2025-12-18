# Simmer - AI Agent Session Start

> **READ THIS FIRST** - Essential context for new AI agent sessions
> **Last Updated**: 2025-12-16
> **Project Status**: Database Connected - Scraping Operational

---

## 1. Quick Start Commands

```bash
cd /Users/bentyson/simmer
npm run dev              # http://localhost:3388
npm run build            # Production build
npm run seed:domains     # Seed 18 recipe site domains
npm run seed:test        # Seed test recipe URLs

# Scrape recipes (requires dev server running)
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3388/api/cron/scrape
```

---

## 2. Project Overview

**Simmer** strips bloat from recipe websites. We scrape schema.org/Recipe data, present it cleanly, and add value through scaling, unit conversion, and shopping lists.

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

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/scrape` | POST | Manual single URL scrape |
| `/api/cron/scrape` | POST | Process queue (batch) |
| `/api/cron/discover` | POST | Discover URLs from sitemaps |

### Core Libraries
| File | Purpose |
|------|---------|
| `src/lib/scraper/index.ts` | Scraping orchestrator |
| `src/lib/scraper/schema-parser.ts` | JSON-LD + HTML entity cleaning |
| `src/lib/scraper/ingredient-parser.ts` | Parse "2 cups flour" |
| `src/lib/db/recipes.ts` | Recipe CRUD |
| `src/lib/db/search.ts` | FTS queries |
| `src/store/shopping-list.ts` | Zustand + localStorage |

### Database Migrations
| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Core tables |
| `002_fts_search.sql` | Full-text search |
| `003_domain_functions.sql` | Domain stats |
| `004_fix_search_vector.sql` | Parameter name fix |

---

## 4. Environment Setup

`.env.local` required variables:
```bash
SUPABASE_ACCESS_TOKEN=sbp_...        # For CLI
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=your-secret-key
```

---

## 5. Current State

### Done
- [x] All pages rendering
- [x] Database connected (Supabase)
- [x] Scraping pipeline operational
- [x] 10+ recipes indexed from multiple sources
- [x] HTML entity cleaning (`&nbsp;` → space)
- [x] Supabase CLI linked for SQL execution

### Not Done
- [ ] Production deployment (Railway)
- [ ] Affiliate link integration
- [ ] Scale to 1000+ recipes
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
