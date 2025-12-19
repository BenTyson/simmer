---
description: Run full system health check
---

Perform a comprehensive health check of the Simmer system:

1. **Database Connection**
   - Query recipes count to verify Supabase connection
   - Report any connection errors

2. **API Endpoints** (if NEXT_PUBLIC_SITE_URL is set)
   - Check /api/health endpoint
   - Report status code and response

3. **Environment Variables**
   - Verify required vars are set (don't show values):
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_ROLE_KEY
     - CRON_SECRET

4. **Data Integrity**
   - Recipes without ingredients
   - Recipes without instructions
   - Orphaned ingredients (no recipe)

Report status with checkmarks or X marks for each item.
