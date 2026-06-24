# daily-muse

Stateless Node.js + TypeScript service that emails and Telegram-messages one AI-art drawing prompt plus a matching Unsplash reference photo every morning at 6 AM Central. No database, no server.

## Architecture

- **Delivery:** GitHub Actions cron runs at both `0 11 * * *` and `0 12 * * *` UTC. `src/index.ts` has a time-guard that exits unless the current hour in `America/Chicago` is 6, covering both CST (UTC-6) and CDT (UTC-5) year-round. `FORCE_RUN=true` bypasses the guard for local testing.
- **Prompt generation:** `src/prompt.ts` reads `data/themes.json` at runtime and randomly assembles a subject, treatment, lighting, and composition string. Fully local — no LLM call.
- **Image:** `src/image.ts` queries the Unsplash Search API with the prompt's keyword, picks randomly from results, fires the required `download_location` trigger, and returns photographer attribution with UTM referral params.
- **Email:** `src/email.ts` sends HTML via [Resend](https://resend.com). Requires a verified sending domain.
- **Telegram:** `src/telegram.ts` calls `sendPhoto` on the Bot API with a caption including photographer credit.
- **Config:** `src/config.ts` loads `.env` via `dotenv` and throws immediately on any missing variable.

## Key files

| File | Purpose |
|---|---|
| `src/index.ts` | Entry point, time-guard, orchestration |
| `src/config.ts` | Env loader — fail-fast on missing secrets |
| `src/prompt.ts` | Random prompt assembler |
| `src/image.ts` | Unsplash fetch + attribution |
| `src/email.ts` | Resend HTML email |
| `src/telegram.ts` | Telegram Bot sendPhoto |
| `data/themes.json` | 56 subjects, 5 treatments, 5 lighting, 5 compositions |
| `.github/workflows/daily.yml` | GitHub Actions cron |

## Extending themes

Add entries to `data/themes.json`. Each subject needs a `label` (sentence fragment used in the prompt) and a `keyword` (passed to Unsplash search). Treatments, lighting, and composition are flat string arrays — just append.

## Secrets

All six secrets must be set in GitHub → Settings → Secrets → Actions. See `README.md` for where each comes from.
