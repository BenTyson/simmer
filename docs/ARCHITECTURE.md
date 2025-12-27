# Ember Whisk - Technical Architecture

> **Last Updated**: 2025-12-24
> **Related**: [SESSION-START.md](./SESSION-START.md) | [SIMMER.md](./SIMMER.md) | [AGENT-WORKFLOW.md](./AGENT-WORKFLOW.md)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SIMMER ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Next.js    │────▶│   Supabase   │
│   (Client)   │◀────│   (Railway)  │◀────│  (Postgres)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │                    ▼
       │            ┌──────────────┐
       │            │   Scraper    │
       │            │  (Cheerio)   │
       │            └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  localStorage│     │ Recipe Sites │
│ (Shop List)  │     │ (schema.org) │
└──────────────┘     └──────────────┘
```

---

## 2. Tech Stack Details

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 16.0.10 | SSR, App Router, API routes |
| Runtime | React | 19.2.1 | UI components |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Database | PostgreSQL | 15+ | Via Supabase |
| ORM/Client | @supabase/supabase-js | 2.87+ | Database access |
| Scraping | Cheerio | 1.1+ | HTML parsing |
| State | Zustand | 5.x | Client state + localStorage |
| Icons | Lucide React | 0.561+ | SVG icons |
| Animation | Framer Motion | 12.x | UI animations |
| Hosting | Railway | - | Deployment + cron |

---

## 3. Directory Structure

```
simmer/
├── docs/                          # Documentation
│   ├── SESSION-START.md           # AI agent quick start
│   ├── ARCHITECTURE.md            # This file
│   └── SIMMER.md                  # Project vision
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout (fonts, meta)
│   │   ├── page.tsx               # Homepage
│   │   ├── globals.css            # Tailwind v4 config
│   │   ├── search/page.tsx        # Search results
│   │   ├── recipe/[slug]/page.tsx # Recipe detail
│   │   ├── list/page.tsx          # Shopping list
│   │   ├── about/page.tsx         # About + legal
│   │   └── api/
│   │       └── health/route.ts    # Health check
│   │
│   ├── components/
│   │   ├── ui/                    # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── StarRating.tsx      # Display star rating
│   │   │   ├── StarInput.tsx       # Interactive star input
│   │   │   ├── BottomSheet.tsx     # Mobile slide-up modal
│   │   │   └── index.ts
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── BottomNav.tsx       # Mobile bottom navigation
│   │   │   └── index.ts
│   │   ├── recipe/                # Recipe-specific
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeControls.tsx
│   │   │   ├── IngredientList.tsx
│   │   │   ├── Instructions.tsx
│   │   │   ├── SourceAttribution.tsx
│   │   │   ├── RecipeSchema.tsx
│   │   │   ├── ReviewCard.tsx      # Single review display
│   │   │   ├── ReviewForm.tsx      # Review submission form
│   │   │   ├── ReviewList.tsx      # Paginated review list
│   │   │   ├── ReviewsSection.tsx  # Wrapper for recipe pages
│   │   │   ├── RecipeFilters.tsx   # Desktop dropdown filters
│   │   │   ├── MobileFilters.tsx   # Mobile bottom sheet filters
│   │   │   ├── BrowseRecipes.tsx   # Browse grid with filters + pagination
│   │   │   └── index.ts
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── index.ts
│   │   └── shopping/              # Future: shopping components
│   │
│   ├── lib/
│   │   ├── db/                    # Database layer
│   │   │   ├── client.ts          # Supabase clients
│   │   │   ├── recipes.ts         # Recipe CRUD
│   │   │   └── search.ts          # FTS queries
│   │   ├── scraper/               # Scraping pipeline
│   │   │   ├── index.ts           # Orchestrator
│   │   │   ├── schema-parser.ts   # JSON-LD extraction
│   │   │   ├── ingredient-parser.ts
│   │   │   └── fetcher.ts         # HTTP + rate limiting
│   │   └── utils/
│   │       └── cn.ts              # clsx + tailwind-merge
│   │
│   ├── hooks/                     # Custom React hooks (future)
│   │
│   ├── store/
│   │   └── shopping-list.ts       # Zustand store
│   │
│   └── types/
│       └── recipe.ts              # TypeScript interfaces
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql # Core tables
│       ├── 002_fts_search.sql     # FTS setup
│       ├── 003_domain_functions.sql # Domain stats
│       ├── 004_fix_search_vector.sql # Parameter fix
│       └── 005_reviews.sql          # Reviews & ratings system
│
├── public/                        # Static assets
│
├── .env.example                   # Environment template
├── next.config.ts                 # Next.js config
├── package.json                   # Dependencies
├── railway.json                   # Railway deployment
├── tsconfig.json                  # TypeScript config
└── tailwind.config.ts             # (Not needed in v4)
```

---

## 4. Data Models

### Recipe (Core Entity)

```typescript
interface Recipe {
  id: string;              // UUID
  slug: string;            // URL-safe identifier
  name: string;
  description: string | null;

  // Timing (minutes)
  prepTime: number | null;
  cookTime: number | null;
  totalTime: number | null;

  // Servings
  servings: number | null;
  servingsUnit: string | null;  // "servings", "cookies"

  // Categorization (arrays)
  cuisine: string[];       // ["Italian", "Mediterranean"]
  category: string[];      // ["Dinner", "Main Course"]
  dietTags: string[];      // ["Vegetarian", "Gluten-Free"]

  // Source attribution (REQUIRED)
  sourceUrl: string;
  sourceDomain: string;
  sourceName: string | null;

  // Ratings (auto-calculated via trigger)
  avgRating: number | null;     // 1.0-5.0, null if no reviews
  reviewCount: number;          // 0 if no reviews

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### Ingredient

```typescript
interface Ingredient {
  id: string;
  recipeId: string;
  position: number;           // Order in recipe

  originalText: string;       // "2 cups all-purpose flour"

  // Parsed components
  amount: number | null;      // 2
  amountMax: number | null;   // For ranges: "3-4 cloves"
  unit: string | null;        // "cups"
  unitNormalized: string | null; // "cup" (standardized)
  item: string | null;        // "all-purpose flour"
  preparation: string | null; // "minced", "diced"

  affiliateCategory: string | null; // "produce", "dairy"
}
```

### Instruction

```typescript
interface Instruction {
  id: string;
  recipeId: string;
  stepNumber: number;
  text: string;
}
```

### Nutrition (Optional)

```typescript
interface Nutrition {
  id: string;
  recipeId: string;
  calories: number | null;
  fatGrams: number | null;
  carbsGrams: number | null;
  proteinGrams: number | null;
  fiberGrams: number | null;
  sodiumMg: number | null;
  servingSize: string | null;
}
```

### Review

```typescript
interface Review {
  id: string;
  recipeId: string;
  authorName: string;          // User-provided name
  rating: number;              // 1-5 stars
  title: string | null;        // Optional title
  comment: string;             // Required, min 10 chars
  helpfulCount: number;        // "Was this helpful?" votes
  createdAt: string;
}
```

### Shopping List Item (Client-Side Only)

```typescript
interface ShoppingListItem {
  id: string;
  text: string;
  recipeId?: string;
  recipeName?: string;
  checked: boolean;
  addedAt: string;
}
```

---

## 5. Database Schema

### Tables

```sql
-- Core tables
recipes              -- Main recipe data + avg_rating, review_count
ingredients          -- Parsed ingredients (FK: recipe_id)
instructions         -- Step-by-step (FK: recipe_id)
nutrition            -- Optional nutrition (FK: recipe_id)
reviews              -- User reviews (FK: recipe_id)

-- Scraping infrastructure
scrape_queue         -- URLs to scrape
scrape_domains       -- Per-domain config & stats
```

### Reviews Trigger

```sql
-- Automatically updates recipes.avg_rating and recipes.review_count
-- when reviews are inserted, updated, or deleted
CREATE TRIGGER trigger_update_recipe_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_recipe_rating_stats();
```

### Key Indexes

```sql
-- Recipes
idx_recipes_slug           -- Unique slug lookup
idx_recipes_source_domain  -- Filter by source
idx_recipes_cuisine        -- GIN index on array
idx_recipes_category       -- GIN index on array
idx_recipes_diet           -- GIN index on array
idx_recipes_search         -- GIN index on tsvector

-- Performance
idx_recipes_created        -- Recent recipes
idx_recipes_not_deleted    -- Active recipes only
```

### Full-Text Search

```sql
-- Search function with weighted ranking
search_recipes(
  search_query TEXT,
  cuisine_filter TEXT[],
  category_filter TEXT[],
  diet_filter TEXT[],
  max_time INTEGER,
  result_limit INTEGER,
  result_offset INTEGER
) RETURNS TABLE (...)

-- Weight distribution:
-- A = recipe name (highest)
-- B = description
-- C = ingredients
-- D = cuisine/category (lowest)
```

---

## 6. API Routes

### Implemented

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/health` | GET | Health check for Railway | None |
| `/api/scrape` | POST | Manual scrape single URL | Bearer CRON_SECRET |
| `/api/cron/scrape` | POST | Process scrape queue (batch) | Bearer CRON_SECRET |
| `/api/cron/discover` | POST | Discover URLs from sitemaps | Bearer CRON_SECRET |
| `/api/recipes/[id]/reviews` | GET | Fetch reviews (paginated, sortable) | None |
| `/api/recipes/[id]/reviews` | POST | Submit a review | None |

### Example Usage

```bash
# Health check
curl http://localhost:3388/api/health

# Scrape a single URL
curl -X POST http://localhost:3388/api/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/recipe"}'

# Process queue (called by Railway cron)
curl -X POST http://localhost:3388/api/cron/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Discover new URLs from sitemaps
curl -X POST http://localhost:3388/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Reviews API

```bash
# Get reviews (with pagination and sorting)
curl "http://localhost:3388/api/recipes/UUID/reviews?sort=recent&limit=10&offset=0"

# Submit a review
curl -X POST http://localhost:3388/api/recipes/UUID/reviews \
  -H "Content-Type: application/json" \
  -d '{"authorName": "John", "rating": 5, "comment": "Great recipe!"}'
```

### Future Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/search` | GET | Search recipes (optional, can use server components) |
| `/api/reviews/[id]/helpful` | POST | Increment helpful count |

---

## 7. Scraping Pipeline

### Flow

```
1. URL Discovery
   └─▶ Sitemap parsing OR manual submission

2. Queue Processing (rate-limited)
   └─▶ Fetch HTML
   └─▶ Extract JSON-LD
   └─▶ Find Recipe schema

3. Data Extraction
   └─▶ Parse recipe fields
   └─▶ Parse ingredients (amount, unit, item)
   └─▶ Normalize instructions

4. Database Insert
   └─▶ Generate unique slug
   └─▶ Insert recipe + relations
   └─▶ Update search vector
```

### Rate Limiting

```typescript
// Per-domain throttling
const rateLimiter = new RateLimiter(5000); // 5 sec default
await rateLimiter.throttle(domain);
```

### Schema.org Extraction

```typescript
// Handles multiple JSON-LD formats:
// - Direct @type: "Recipe"
// - Array of types
// - @graph format (common on WordPress)
// - Nested in array
```

---

## 8. State Management

### Server State
- **Supabase** for all persistent data
- **Server Components** for data fetching (SSR)

### Client State
- **Zustand** for shopping list
- **localStorage** for persistence
- **React useState** for UI state (scale, units)

### Shopping List Store

```typescript
const useShoppingList = create(
  persist(
    (set) => ({
      items: [],
      addItem: (text, recipeId?, recipeName?) => {...},
      removeItem: (id) => {...},
      toggleItem: (id) => {...},
      clearChecked: () => {...},
      clearAll: () => {...},
    }),
    { name: 'emberwhisk-shopping-list' }
  )
);
```

---

## 9. Design System

### Color Palette

```css
/* Primary - Coral Orange */
--color-primary-500: #FF6B35;

/* Secondary - Teal */
--color-secondary-500: #00D9C0;

/* Accent - Sunny Yellow */
--color-accent-300: #FFD23F;

/* Neutral - Warm Grays */
--color-neutral-50: #fafaf9;
--color-neutral-900: #1c1917;

/* Background */
--background: #fffdf7; /* Warm off-white */
```

### Typography

```css
/* Display - Nunito (rounded, friendly) */
--font-display: "Nunito", system-ui, sans-serif;

/* Body - Inter (clean, readable) */
--font-sans: "Inter", system-ui, sans-serif;
```

### Component Patterns

```css
/* Buttons */
.btn { @apply rounded-full transition-all; }
.btn:hover { @apply -translate-y-0.5 shadow-lg; }

/* Cards */
.card { @apply rounded-2xl border border-neutral-200; }
.card:hover { @apply border-primary-300 shadow-xl -translate-y-1; }

/* Inputs */
.input { @apply rounded-2xl border-2 focus:border-primary-500; }
```

---

## 10. Deployment

### Environments

| Branch | Environment | URL |
|--------|-------------|-----|
| `develop` | Staging | https://simmer-staging-staging.up.railway.app |
| `main` | Production | https://emberwhisk.co |

### Railway Configuration

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health"
  }
}
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For scraping
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # Plausible, OG images

# Optional
SCRAPE_USER_AGENT=EmberWhiskBot/1.0
SCRAPE_RATE_LIMIT_MS=5000
CRON_SECRET=xxx
```

### Build Output

```bash
output: 'standalone'  # Self-contained for Railway
```

### Railway CLI

```bash
# Switch environments
railway environment staging
railway environment production

# View logs & variables
railway logs
railway variables
```

---

## 11. Performance Considerations

### SSR Strategy
- Recipe pages: Server-rendered for SEO
- Search results: Server-rendered with filters
- Shopping list: Client-side only (localStorage)

### Caching
- Static pages: ISR where possible
- Database: Supabase handles query caching
- HTTP: Browser caching via headers

### Bundle Size
- Tree-shaking enabled
- Dynamic imports for heavy components
- Minimal dependencies

---

## 12. Security

### Database
- Row Level Security (RLS) in Supabase
- Service role key only on server
- Anon key for public read operations

### Scraping
- robots.txt compliance
- Rate limiting per domain
- User-Agent identification

### Headers
```typescript
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
]
```
