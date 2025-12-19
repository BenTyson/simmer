---
description: Search recipes in the database
---

Search for recipes matching: $ARGUMENTS

Query the recipes table using full-text search or ILIKE pattern matching on:
- name
- description
- source_domain

Show results as a table with:
- name
- source_domain
- total_time (formatted)
- slug (for URL)

Limit to 20 results. If no results found, suggest checking the spelling or trying broader terms.
