---
description: Add a new recipe site domain for scraping
---

Add a new recipe domain to the scrape_domains table: $ARGUMENTS

Steps:
1. Parse the URL to extract the domain (e.g., "https://example.com/recipe/123" -> "example.com")
2. Check if domain already exists in scrape_domains table
3. If new, try to discover the sitemap:
   - Check /sitemap.xml
   - Check /sitemap_index.xml
   - Check /robots.txt for sitemap reference
4. Insert into scrape_domains with:
   - domain: the extracted domain
   - sitemap_url: discovered sitemap (or null)
   - is_active: true
   - rate_limit_ms: 5000 (default)
5. Report what was found and added
