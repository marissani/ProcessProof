# Code Workflow

<!-- managed:linked-repos -->
## Linked Repositories
- marissani/ProcessProof
<!-- /managed:linked-repos -->

## Default Process
1. Members push code to feature branches and create pull requests
2. The team lead reviews and merges PRs
3. Before starting new work, members should pull the latest default branch so they branch from up-to-date code

## Notes
- The team lead can update this file to reflect the owner's preferences (outside the managed block above, which is overwritten when the owner changes the allow-listed repositories)
- If the owner provides specific instructions about code review, branch strategy, or merge policies, update this document accordingly

## Backup to GitHub (owner instruction, 2026-09-23)
The owner wants the team's work written to GitHub for redundancy.

- **Repository:** `marissani/ProcessProof`. **Git root is `/home/team/shared`** (not `site/`).
- **Layout:** `site/` is the website source; `research/`, `qa/` and `skills/` hold the team's research briefs, verification records and skills; `WORKFLOW.md` is this file.
- **The site is still deployed with the lead's `publish_site`**, not from GitHub. The repository is a backup and a code history, not a deploy pipeline.
- **The repository is PUBLIC.** While it is public, nothing business-sensitive may be committed: no research briefs, no pricing analysis, no outreach plans, no customer or signup data, no personal information. Those directories stay untracked until the owner makes the repository private, at which point the lead adds and pushes them.
- **Never commit secrets**: no `.env`, no tokens, no `DATABASE_URL`, no credentials. `.gitignore` blocks them; if you ever see one staged, unstage it and tell the lead immediately — a secret that reaches a public repository must be rotated, not just deleted.
- **Never force-push** `main` unless the lead has said so explicitly for that specific push.
- Code changes follow the process above: feature branch → pull request → the lead merges. Branch from `main` at the repository root.
