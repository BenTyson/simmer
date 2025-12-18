# Simmer - Claude Code Context

## Project Overview
Recipe aggregator that strips bloat from recipe sites. Scrapes schema.org/Recipe data, presents cleanly with scaling, unit conversion, and shopping lists.

## Tech Stack
- **Framework**: Next.js 16 + React 19 + TypeScript
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS v4
- **State**: Zustand + localStorage
- **Scraping**: Cheerio (schema.org JSON-LD)

## Key Commands
```bash
npm run dev           # localhost:3388
npm run build         # Production build
npm run seed:domains  # Seed recipe site domains
npm run seed:test     # Seed test URLs
```

## Slash Commands
- `/scrape-url <url>` - Scrape a single recipe
- `/db-query <sql>` - Run SQL query
- `/queue-status` - Check scrape queue
- `/recipes` - List all recipes
- `/scrape-batch` - Process queue

## Database Tables
- `recipes` - Core recipe data
- `ingredients` - Parsed ingredients
- `instructions` - Step-by-step text
- `nutrition` - Nutritional info
- `scrape_queue` - URLs to scrape
- `scrape_domains` - Domain configs

## API Routes
- `POST /api/scrape` - Single URL (auth required)
- `POST /api/cron/scrape` - Batch process (auth required)
- `POST /api/cron/discover` - Sitemap discovery (auth required)
- `GET /api/health` - Health check

## Key Constraints
1. ALWAYS credit sources with links
2. NEVER scrape photos (copyright)
3. Respect rate limits (5+ sec/domain)
4. Use schema.org only, no prose
5. Bold & Playful design style

## Environment
- Supabase project: `hrreshxbsmaakqkpygrm`
- Local port: 3388
- Auth header: `Authorization: Bearer $CRON_SECRET`
