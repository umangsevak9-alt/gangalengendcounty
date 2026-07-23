# How to actually run this on Hostinger — 3 real paths

You have a **TanStack Start + Supabase** app (SSR React on a Node runtime).
Hostinger's shared plans (Premium, Business, Cloud) only run **PHP + MySQL**.
That mismatch is the reason this isn't just "upload and go" — and it's why
I've now built you a full PHP backend under `/hostinger/` so you have every
option open.

Below are the **three real paths** to running on Hostinger, ranked by
effort. Pick the one that fits your budget and timeline.

---

## Path A — Hostinger VPS (recommended: 30 min, keeps the app as-is)

**What you do:**
1. hPanel → **Upgrade** → pick **VPS 1** (₹499/mo, 4 GB RAM, KVM) or higher.
2. Install Node 20 + PM2 (one-liner script below).
3. `git clone` this project, `bun install`, `bun run build`, `pm2 start`.
4. Point your domain at the VPS IP.

**Why this is the right answer for most people:**
- Zero rewrite. Zero risk. SSR keeps working, SEO stays perfect.
- Everything you built on Lovable ships identically.
- You get real Node, real environment variables, real logs.

**One-liner VPS setup (SSH into your VPS as root):**

```bash
# 1. Install Node 20 + build tools
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git nginx certbot python3-certbot-nginx
npm install -g pm2 bun

# 2. Deploy
cd /var/www
git clone <your-repo-url> gangalegend
cd gangalegend
bun install
bun run build

# 3. Set env vars (create /var/www/gangalegend/.env)
cat > .env <<'EOF'
SUPABASE_URL=<your existing values>
SUPABASE_PUBLISHABLE_KEY=<...>
SUPABASE_SERVICE_ROLE_KEY=<...>
VITE_SUPABASE_URL=<...>
VITE_SUPABASE_PUBLISHABLE_KEY=<...>
EOF

# 4. Run under PM2 (auto-restart on crash)
pm2 start "bun run .output/server/index.mjs" --name gangalegend
pm2 startup && pm2 save

# 5. Nginx reverse proxy + free SSL
cat > /etc/nginx/sites-available/gangalegend <<'EOF'
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF
ln -sf /etc/nginx/sites-available/gangalegend /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Result:** Site live in ~30 min. Data still on Lovable Cloud (you can keep
it there indefinitely, or migrate to your own Postgres later).

---

## Path B — Hybrid: Lovable-hosted React + Hostinger MySQL for data

**What you do:**
1. Deploy the `/hostinger` PHP backend (see `README.md` in that folder) —
   ~30 min, gives you `https://yourdomain.com/api/...` endpoints.
2. Keep publishing the React frontend from Lovable as you do today.
3. Rewire the React app's `.functions.ts` files to `fetch` your PHP API
   instead of Supabase. (~3–4 turns of my work.)

**Trade-offs:**
- Data + uploads live on **your** Hostinger MySQL and `/uploads/` — full
  ownership. You can `mysqldump` any time.
- No Lovable Cloud dependency for data.
- The React SSR keeps working (Lovable Cloudflare Worker → your PHP API →
  MySQL).
- Cross-origin auth cookies need a proxy or SameSite=None config; I handle
  that in the rewire.
- You keep paying for both Lovable + Hostinger, but Hostinger holds
  everything valuable.

**When to pick this:** You want data ownership on Hostinger but don't want
to leave Lovable's hosting environment.

---

## Path C — Full frontend rewrite for Hostinger shared PHP (2–3 turns)

**What you do:**
1. Deploy the `/hostinger` PHP backend (done — package ready).
2. I strip TanStack Start's SSR layer, convert the app to a **plain Vite
   React SPA**, wire all data/auth to the PHP API, rebuild.
3. Upload the resulting `dist/` folder plus `/hostinger` to `public_html/`.
4. Migrate data + media using the guide in `EXPORT-FROM-CURRENT.md`.

**Trade-offs:**
- Cheapest hosting bill (₹149/mo Premium is enough).
- **Everything on Hostinger** — data, media, frontend, one bill.
- SEO drops from server-rendered to client-rendered. Google still indexes
  modern SPAs, but link previews (WhatsApp, LinkedIn) won't work without
  extra prerendering.
- Your Lovable preview breaks during the rewrite window.
- No Node runtime, so no SSR, no route loaders that fetch, no `head()` with
  dynamic OG tags for shared links.

**When to pick this:** Absolute minimum cost, no ongoing Lovable
subscription, you don't need pretty link previews.

---

## What's already built for you (any path)

Under `/hostinger`:
- **Complete PHP 8 backend** — 26 endpoints (auth, admin CRUD, public reads,
  uploads, leads with CSV export).
- **MySQL schema** — every table, indexes, constraints, seed admin.
- **Security** — PDO prepared statements, bcrypt passwords, HS256 JWT
  cookies, CSRF origin checks, login rate-limit, upload MIME sniffing,
  security headers, forced HTTPS.
- **Docs** — `README.md` (step-by-step deploy), `EXPORT-FROM-CURRENT.md`
  (data migration).

This backend is useful for **B and C**, and available if you ever migrate
away from Supabase on **A**.

---

## My honest recommendation

Pick **A** unless the ~₹500/mo VPS cost is a hard blocker. It's the only
path that gets you live this weekend with zero rewrite risk and full SEO.
If cost is the deciding factor, pick **C** and accept the SEO downgrade.
Pick **B** only if you specifically want data ownership on Hostinger MySQL
while keeping the Lovable dev flow.

**Tell me which path you want and I'll execute it.** For A, that's writing
you the exact deploy script. For B or C, that's the frontend rewire.
