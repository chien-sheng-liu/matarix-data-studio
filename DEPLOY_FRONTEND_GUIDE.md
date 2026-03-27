# Frontend Deploy Automation Guide

> Quick reference for using the `/deploy-frontend` command to automate frontend deployment to GitHub

## Quick Start

```bash
# Step 1: Make frontend changes
# Edit files in src/components/, src/app/, etc.

# Step 2: Verify everything is ready
/deploy-frontend check

# Step 3: Deploy to GitHub
/deploy-frontend deploy

# Step 4 (Optional): Create a pull request
/deploy-frontend pr
```

## Commands Overview

| Command | What It Does | Side Effects |
|---------|-------------|--------------|
| `/deploy-frontend check` | Detect changes + run quality gates (type check, lint, build) | None — dry-run only |
| `/deploy-frontend deploy` | Full workflow: branch, checks, commit, push | Creates branch, commits, pushes to GitHub |
| `/deploy-frontend pr` | Full workflow + create draft PR | Also creates PR on GitHub |
| `/deploy-frontend status` | Show current branch, pending changes, unpushed commits | None — read-only |

## Workflow Example

**Scenario:** You just updated the brand logo animation in `src/components/effects/brand-logo.tsx`

```
Step 1: Check everything is ready
$ /deploy-frontend check
✓ Detected: 1 frontend file changed (src/components/effects/brand-logo.tsx)
✓ Type check passed
✓ Lint check passed
✓ Build successful
→ Ready to deploy!

Step 2: Deploy the changes
$ /deploy-frontend deploy
✓ Created branch: frontend/effects-20260327
✓ Audited .gitignore: all mandatory patterns present
✓ Staged: src/components/effects/brand-logo.tsx
✓ Committed: feat: improve brand logo animation choreography
Push to origin/frontend/effects-20260327? (yes/no)
→ yes
✓ Pushed to origin/frontend/effects-20260327

Step 3: Create a pull request (optional)
$ /deploy-frontend pr
✓ Created draft PR: https://github.com/.../pull/42
→ Share the link with your team!
```

## What Gets Deployed (Frontend Scope)

The skill recognizes changes to these files as "frontend":

```
✓ src/components/**/*          React components
✓ src/app/**/*                 App router pages, layouts
✓ src/config/**/*              Configuration files
✓ src/lib/**/*                 Library utilities
✓ public/**/*                  Static assets
✓ tailwind.config.*            Tailwind configuration
✓ next.config.*                Next.js configuration
✓ postcss.config.*             PostCSS configuration
✓ src/app/globals.css          Global styles

✗ README.md                    Not deployed by this skill
✗ package.json                 Not deployed by this skill
✗ .github/                     Not deployed by this skill
```

## Safety Features

The skill includes multiple safety checks:

1. **Prevents commits to main/master** — Always creates a feature branch
2. **Confirms before pushing** — You approve the push explicitly
3. **Rejects secrets** — Won't commit .env* files even by accident
4. **Runs quality gates** — Type check → Lint → Build (all must pass)
5. **Audits .gitignore** — Catches missing patterns
6. **No force pushes** — Ever, under any circumstances
7. **Smart branch names** — `frontend/<scope>-<YYYYMMDD>` format

## Branch Naming Convention

Branches are auto-generated with intelligent names:

```
frontend/components-20260327    ← Changed src/components/
frontend/app-20260327           ← Changed src/app/
frontend/update-20260327        ← Changed multiple areas
```

## Commit Message Format

Commits use conventional commits:

```
feat: add animated counter component

- Implement AnimatedCounter with easing
- Add to About section statistics
- Update TypeScript types

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

Types: `feat:` (new feature), `fix:` (bug fix), `refactor:` (restructure)

## Troubleshooting

### "Build failed"
**Problem:** Production build didn't pass
**Solution:** Fix the errors in your code editor, save, then run `/deploy-frontend check` again

### "Type check failed"
**Problem:** TypeScript compilation errors
**Solution:** Check the errors reported and fix your code, then retry

### "Push rejected"
**Problem:** Remote has conflicting changes
**Solution:** Run in terminal: `git pull --rebase origin <branch>` then retry

### "gh not authenticated"
**Problem:** GitHub CLI not set up for PR creation
**Solution:** Run in terminal: `gh auth login` and follow the prompts

### "No frontend changes detected"
**Problem:** You tried to deploy but no frontend files changed
**Solution:** Make sure you saved your file edits and that they're in the frontend scope (see above)

## When to Use Each Command

### Use `check` when:
- You want to verify your code is production-ready
- You're not sure if everything compiles
- You want to preview what will be committed before deploying

### Use `deploy` when:
- Your `check` passed and you're ready to push
- You've made significant frontend changes
- You want to create a GitHub branch and push

### Use `pr` when:
- You want to create a pull request immediately
- You want GitHub Copilot to generate a PR summary
- Your team reviews changes via pull requests

### Use `status` when:
- You want to see what branch you're on
- You want to check for unpushed commits
- You're just browsing the current state (read-only)

## Advanced Usage

### Dry-run mode
```
/deploy-frontend check
```
This runs all quality gates without touching git. Perfect for verifying before committing.

### Status only
```
/deploy-frontend status
```
Shows current branch, pending changes, and unpushed commits. Safe to run anytime.

### Continue on existing branch
If you're already on a `frontend/*` branch, running `/deploy-frontend deploy` will continue using that branch (won't create a new one).

## FAQ

**Q: What if I need to deploy multiple unrelated changes?**
A: Push the first change with `/deploy-frontend deploy`, then create a new feature from `main` for the second change.

**Q: Can I use this for non-frontend files?**
A: No — the skill only stages frontend-scoped files. For other changes, use manual git commands.

**Q: Do I need the `gh` CLI to use this skill?**
A: No — `check` and `deploy` work without it. PR creation (`pr` mode) requires `gh` CLI installed and authenticated.

**Q: Can I force-push if I need to?**
A: No — the skill explicitly prohibits force pushes. If you need to force-push, use manual git commands.

**Q: What's in a draft PR?**
A: Title (auto-generated), list of changed components, summary of changes, test checklist, and Vercel preview link.

## Related Documentation

- Full skill reference: `~/.claude/skills/frontend-deploy.md`
- Team git standards: `~/.claude/skills/mentarix-collaboration.md`
- Component architecture: `~/.claude/skills/mentarix-frontend-components.md`
- Performance checklist: `~/.claude/skills/mentarix-performance.md`
