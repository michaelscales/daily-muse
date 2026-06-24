# daily-muse

Emails and Telegram-messages one AI-art drawing prompt plus a matching Unsplash reference photo every morning at 6 AM Central. Stateless — no database, no server.

## How it works

GitHub Actions runs at 11:00 and 12:00 UTC. The service checks the current hour in `America/Chicago`; only the run that lands at 6 AM local time actually delivers. The other exits silently. This covers both CST (UTC-6) and CDT (UTC-5) without any manual adjustment.

Each delivery:
1. Picks a random subject, treatment, lighting, and composition from `data/themes.json`
2. Fetches a matching Unsplash photo (fires the required attribution trigger)
3. Sends an HTML email via Resend and a Telegram photo message — both include photographer credit

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url> daily-muse
cd daily-muse
npm install
```

### 2. Create your `.env`

```bash
cp .env.example .env
```

Fill in all six values (see below).

### 3. Test locally

```bash
npm run dev
```

`FORCE_RUN=true` is baked into the `dev` script — it bypasses the 6 AM time-guard so you can test at any hour.

### 4. Push secrets to GitHub

```bash
gh secret set UNSPLASH_ACCESS_KEY
gh secret set RESEND_API_KEY
gh secret set FROM_EMAIL
gh secret set TO_EMAIL
gh secret set TELEGRAM_BOT_TOKEN
gh secret set TELEGRAM_CHAT_ID
```

Each command prompts you to paste the value — nothing is stored in a file.

## Required secrets

| Secret | Where to get it |
|---|---|
| `UNSPLASH_ACCESS_KEY` | [Unsplash Developers](https://unsplash.com/developers) — create an app, copy the **Access Key** |
| `RESEND_API_KEY` | [Resend](https://resend.com) — create an account, verify a sending domain, then generate an API key |
| `FROM_EMAIL` | A verified sender address on your Resend domain, e.g. `muse@yourdomain.com` |
| `TO_EMAIL` | Your personal email address where you want to receive the prompt |
| `TELEGRAM_BOT_TOKEN` | Message [@BotFather](https://t.me/BotFather) on Telegram — `/newbot`, follow the prompts, copy the token |
| `TELEGRAM_CHAT_ID` | Start a chat with your bot, then message [@userinfobot](https://t.me/userinfobot) — it replies with your numeric chat ID |

## Extending themes

Edit `data/themes.json`. Each subject needs:
- `label` — a sentence fragment used in the prompt text
- `keyword` — passed to Unsplash search

Treatments, lighting, and composition are flat string arrays — append freely.

## Project layout

```
daily-muse/
├── .github/workflows/daily.yml   # cron at 11 and 12 UTC
├── src/
│   ├── config.ts                 # env loader, fail-fast
│   ├── prompt.ts                 # random prompt from themes.json
│   ├── image.ts                  # Unsplash fetch + attribution
│   ├── email.ts                  # Resend HTML email
│   ├── telegram.ts               # Telegram sendPhoto
│   └── index.ts                  # entry point + time-guard
├── data/themes.json              # 56 subjects, 5×3 modifiers
├── .env.example
├── tsconfig.json
└── package.json
```
