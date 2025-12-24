# Agent Workflow Guide

> **Simmer Project Git Workflow**
> **Last Updated**: 2025-12-23

---

## ⚠️ CRITICAL: Branch Rules

```
DEFAULT BRANCH: develop (YOU ARE HERE)
PRODUCTION:     main (DO NOT TOUCH)
```

### The One Rule

**NEVER push to `main`. Always push to `develop`.**

---

## Start of Session

```bash
# 1. Verify you're on develop
git branch

# 2. If not on develop, switch
git checkout develop

# 3. Pull latest
git pull origin develop
```

---

## During Work

```bash
# Make changes, then:
git add .
git commit -m "Description of changes"
git push origin develop
```

---

## End of Session

**Always say:**
> "Changes pushed to `develop`. Create a PR to `main` when ready to deploy."

**DO NOT:**
- Push to main
- Create PRs automatically
- Merge anything

---

## When User Says "Deploy" / "Merge" / "Go Live"

Only then:

```bash
# Option A: Guide user to GitHub
# "Go to: https://github.com/USERNAME/REPO/compare/main...develop"
# "Create PR, then merge"

# Option B: If user wants CLI
git checkout main
git merge develop
git push origin main
git checkout develop
```

---

## Commands to NEVER Run

```bash
git push origin main          # NO
git checkout main && git push # NO
git merge main                # NO (wrong direction)
```

---

## Commands That Are Safe

```bash
git checkout develop          # YES
git pull origin develop       # YES
git push origin develop       # YES
git add .                     # YES
git commit -m "..."           # YES
git status                    # YES
git log                       # YES
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Check branch | `git branch` |
| Switch to develop | `git checkout develop` |
| Pull latest | `git pull origin develop` |
| Push changes | `git push origin develop` |
| Check status | `git status` |

---

## Why This Workflow?

- `main` = production (auto-deploys to live site)
- `develop` = safe working branch
- PRs = controlled deployments with review
- Prevents accidental production pushes

---

## Simmer Deployment URLs

| Branch | Environment | URL |
|--------|-------------|-----|
| `develop` | Staging | https://simmer-staging-staging.up.railway.app |
| `main` | Production | https://simmer-production.up.railway.app |

### Railway CLI Commands

```bash
# Check status
railway status

# Switch environments
railway environment staging
railway environment production

# View logs
railway logs

# View variables
railway variables
```

---

## Related Docs

- [SESSION-START.md](./SESSION-START.md) - Project context and quick start
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SIMMER.md](./SIMMER.md) - Vision and business context
