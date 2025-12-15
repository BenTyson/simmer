# Simmer - AI Agent Session Start

> **READ THIS FIRST** - Essential context for new AI agent sessions
> **Last Updated**: 2025-12-15
> **Project Status**: MVP Complete - Ready for Supabase Setup

---

## 1. Quick Start Commands

```bash
# Start development server
cd /Users/bentyson/simmer
npm run dev
# Opens at http://localhost:3388

# Build for production
npm run build

# Run production server
npm run start
```

---

## 2. Project Overview (30 seconds)

**Simmer** is a recipe aggregator that strips bloat from recipe websites. We scrape schema.org/Recipe structured data, present it cleanly, and add value through:
- Ingredient scaling (adjust servings)
- Unit conversion (metric/imperial)
- Shopping lists (localStorage + Instacart integration)

**Revenue**: Affiliate links (Instacart, Amazon) + minimal ads

**Design**: Bold & Playful (coral #FF6B35, teal #00D9C0, yellow #FFD23F)

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
| `src/app/api/health/route.ts` | Health check endpoint |

### Components
| File | Purpose |
|------|---------|
| `src/components/layout/Header.tsx` | Site header with nav |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/search/SearchBar.tsx` | Hero and compact search |
| `src/components/recipe/RecipeCard.tsx` | Recipe preview card |
| `src/components/recipe/RecipeControls.tsx` | Scaling + unit toggle |
| `src/components/recipe/IngredientList.tsx` | Checkbox ingredients |
| `src/components/recipe/Instructions.tsx` | Step-by-step display |
| `src/components/ui/*.tsx` | Button, Input, Card, Badge, Skeleton |

### Scraping Pipeline
| File | Purpose |
|------|---------|
| `src/lib/scraper/index.ts` | Main orchestrator |
| `src/lib/scraper/schema-parser.ts` | JSON-LD extraction |
| `src/lib/scraper/ingredient-parser.ts` | Parse "2 cups flour" |
| `src/lib/scraper/fetcher.ts` | HTTP with rate limiting |

### Database
| File | Purpose |
|------|---------|
| `src/lib/db/client.ts` | Supabase client setup |
| `src/lib/db/recipes.ts` | Recipe CRUD operations |
| `src/lib/db/search.ts` | FTS search queries |
| `supabase/migrations/001_initial_schema.sql` | Core tables |
| `supabase/migrations/002_fts_search.sql` | Search functions |

### State Management
| File | Purpose |
|------|---------|
| `src/store/shopping-list.ts` | Zustand + localStorage |

### Configuration
| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (port 3388) |
| `next.config.ts` | Next.js config (standalone output) |
| `railway.json` | Railway deployment |
| `.env.example` | Environment template |
| `src/app/globals.css` | Tailwind v4 design tokens |

---

## 4. Database Schema Summary

```
recipes          - Core recipe data (name, times, servings, source)
├── ingredients  - Parsed ingredients (amount, unit, item)
├── instructions - Step-by-step text
└── nutrition    - Optional nutrition info

scrape_queue     - URLs pending scraping
scrape_domains   - Per-domain rate limits and stats
```

**Key columns in `recipes`:**
- `slug` (unique URL identifier)
- `source_url`, `source_domain`, `source_name` (attribution)
- `cuisine[]`, `category[]`, `diet_tags[]` (filters)
- `search_vector` (FTS tsvector)

---

## 5. Current State & Next Steps

### What's Done
- [x] All pages rendering correctly
- [x] Build passes (`npm run build`)
- [x] Design system implemented
- [x] Scraper pipeline code complete
- [x] Database schema written

### What's NOT Done (Needs Supabase)
- [ ] Database not yet created
- [ ] No recipes in system yet
- [ ] Scraping API routes not created
- [ ] Affiliate links not integrated
- [ ] No production deployment

### Immediate Next Steps
1. **Create Supabase project** at supabase.com
2. **Run migrations** from `supabase/migrations/`
3. **Create `.env.local`** with Supabase keys
4. **Build API routes** for scraping
5. **Create seed script** to scrape initial recipes
6. **Test end-to-end** scrape → display flow

---

## 6. Key Constraints (DO NOT VIOLATE)

1. **ALWAYS credit sources** - Every recipe must link to original
2. **NEVER scrape photos** - Copyright violation
3. **Respect rate limits** - 5+ seconds between requests per domain
4. **Use schema.org only** - No scraping prose/stories
5. **Port 3388** - Local development server
6. **Bold & Playful design** - Not minimal, not cozy

---

## 7. Common Tasks

### Add a new page
```tsx
// src/app/[route]/page.tsx
import { Container } from '@/components/layout/Container';

export default function NewPage() {
  return (
    <Container>
      {/* Content */}
    </Container>
  );
}
```

### Add a new component
```tsx
// src/components/[category]/NewComponent.tsx
import { cn } from '@/lib/utils/cn';

interface Props {
  className?: string;
}

export function NewComponent({ className }: Props) {
  return (
    <div className={cn('base-styles', className)}>
      {/* Content */}
    </div>
  );
}
```

### Scrape a recipe (once API is built)
```typescript
import { scrapeRecipe } from '@/lib/scraper';

const result = await scrapeRecipe('https://example.com/recipe');
// Returns: { success: boolean, recipeId?: string, error?: string }
```

---

## 8. Design System Quick Reference

### Colors (Tailwind classes)
```
Primary:   bg-primary-500 text-primary-600 (#FF6B35 coral)
Secondary: bg-secondary-500 text-secondary-600 (#00D9C0 teal)
Accent:    bg-accent-300 text-accent-600 (#FFD23F yellow)
Neutral:   bg-neutral-100 text-neutral-600 (warm grays)
```

### Typography
```
Display font: font-display (Nunito - rounded, friendly)
Body font:    font-sans (Inter - clean, readable)
```

### Components
```
Buttons:  rounded-full, shadow on hover, lift effect
Cards:    rounded-2xl, border, hover:-translate-y-1
Inputs:   rounded-2xl, border-2, focus:border-primary-500
```

---

## 9. Related Documentation

| Document | Purpose |
|----------|---------|
| [SIMMER.md](./SIMMER.md) | Project vision, business context, session log |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Detailed technical architecture |
| `.env.example` | Environment variables template |
| `supabase/migrations/*.sql` | Database schema |

---

## 10. Troubleshooting

### Build fails with type errors
```bash
npm run build
# Check the error message for file:line
# Most common: missing types, wrong imports
```

### Supabase connection fails
```bash
# Check .env.local exists with:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Port already in use
```bash
# Kill process on port 3388
lsof -i :3388
kill -9 <PID>
```

### Scraper fails
- Check robots.txt compliance
- Verify rate limiting (5+ sec between requests)
- Ensure URL has schema.org/Recipe data
