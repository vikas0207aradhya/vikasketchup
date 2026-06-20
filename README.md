# vikasketchup.com

Personal site with a live "what I'm doing right now" status badge —
auto-updates for Sleep/Driving via iOS Shortcuts, manual toggle for everything else.

## 1. Run it locally

```bash
npm install
cp .env.example .env.local
# edit .env.local — set STATUS_SECRET to any long random string
npm run dev
```

Open http://localhost:3000 — and http://localhost:3000/admin to test toggling status.
Without KV env vars set, status is stored in memory (resets when the dev server restarts). That's fine for testing.

## 2. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Before the first deploy, add an environment variable:
   - `STATUS_SECRET` = a long random string (e.g. run `openssl rand -hex 24` locally and paste the result)
4. Deploy.
5. **Add persistent storage** (so status survives between requests — required for production):
   - In your Vercel project → Storage tab → Create Database → pick **KV** (Upstash Redis, free tier is plenty).
   - Connect it to this project. Vercel auto-fills `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you — no manual copying needed.
   - Redeploy once after connecting so the new env vars apply.
6. Go to your domain settings in Vercel → add `vikasketchup.com` → follow the DNS instructions it gives you (usually just an A record + CNAME at your domain registrar).

## 3. Set status manually

Go to `https://vikasketchup.com/admin`, paste in your `STATUS_SECRET` once (it's saved in that browser only), then tap any status to update it live. Refresh the homepage and you'll see it within ~12 seconds.

## 4. Auto status via iOS Shortcuts (Sleep + Driving)

This is the "outside phone boundary" piece — Shortcuts runs the automation locally on your phone and pings your site, no app needed.

### A. Sleeping → auto-set when Sleep Focus turns on

1. Open the **Shortcuts** app → **Automation** tab → **+** → **Create Personal Automation**.
2. Choose **Focus** → set Focus = **Sleep** → When **Focus is turned on**.
3. Tap **Add Action** → search **Get Contents of URL**.
4. Configure it:
   - URL: `https://vikasketchup.com/api/status`
   - Method: `POST`
   - Headers: add one — Key: `x-status-secret`, Value: *(your STATUS_SECRET)*
   - Headers: add another — Key: `Content-Type`, Value: `application/json`
   - Request Body: **JSON** → add field `status` = `sleeping`
5. Turn **off** "Ask Before Running" (so it fires silently).
6. Save.

### B. Driving → auto-set when CarPlay connects (or Driving Focus turns on)

Same steps as above, but trigger = **CarPlay is connected** (Automation tab → + → **CarPlay** → Connects) or **Focus = Driving → turned on**, whichever you actually use. Body field `status` = `driving`.

### C. Back to normal when you wake up / stop driving

Optional but recommended — add a second automation per trigger using **"is turned off"** / **"disconnects"**, with body `status` = `online` (or whatever you want as your default).

### Notes on reliability

- Shortcuts automations need **"Ask Before Running" turned off** to fire without you tapping confirm — iOS will ask you to confirm this once when you first set it up.
- These run **on-device**, so they work as long as your phone has any signal (wifi or cellular) — no need for the site to be open.
- You can add more automations the same way: "App opened" triggers exist for some apps' Shortcuts integration, but most apps (including Instagram) don't expose an "opened" trigger to Shortcuts for privacy/sandboxing reasons — that's an iOS-wide limitation, not something this site can work around. Screen-on/off and Focus modes are the most reliable hooks available.

## 5. Add more statuses later

Edit `lib/statuses.ts` — add a new entry to the `STATUSES` object with a `key`, `label`, `emoji`, `mood`, and `source`. It'll automatically show up on the `/admin` page and works immediately via the API. No other file needs to change.

## Project structure

```
app/
  page.tsx              → homepage (hero, status badge, links)
  admin/page.tsx         → manual status toggle page
  api/status/route.ts    → GET (read status) / POST (write status, needs secret)
  layout.tsx, globals.css
components/
  LiveStatusBadge.tsx     → polls /api/status every 12s, renders badge
  ParticleField.tsx       → canvas particle background
lib/
  statuses.ts             → all possible statuses live here
  store.ts                → KV read/write with in-memory fallback
```
