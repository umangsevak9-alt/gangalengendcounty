
## Reality check (please read first)

- **Hostinger shared/Cloud plans run PHP + MySQL only.** Your current app is Node.js/React with Supabase. It cannot be "pointed at" Hostinger — the backend has to be rewritten in PHP.
- I will **not** delete or rewrite your live Supabase-connected app in this turn. That would break the site immediately. The Hostinger version will live in a new `hostinger/` folder that you upload separately.
- Full frontend rewiring (removing Supabase from every React component) is a **separate later phase** — see "What comes after this plan" at the bottom.

## What I will build now (single turn)

A complete `hostinger/` folder at the project root, ready to zip and upload to Hostinger's `public_html`. It contains:

### 1. MySQL schema — `hostinger/database/schema.sql`

Converted from your current Postgres tables:
- `users`, `user_roles` (admin / editor) with bcrypt password hashes
- `profiles`
- `site_settings`, `amenities`, `specifications`, `video_section`
- `gallery_images`, `floor_plans`, `location_settings`, `location_landmarks`
- `faqs`, `testimonials`, `leads`
- `password_resets` (for forgot-password tokens)

MySQL 8 / MariaDB 10.4 compatible, `utf8mb4`, all foreign keys, indexes, and default admin user seed.

### 2. Data export instructions — `hostinger/database/EXPORT-FROM-CURRENT.md`

Step-by-step: how to export CSVs from the current backend via Lovable Cloud → Advanced → Export data, then `LOAD DATA INFILE` them into MySQL. Includes column-mapping notes for the few fields that change shape (e.g. `image_path` stays a relative path, Supabase UUIDs are preserved).

### 3. PHP backend — `hostinger/api/`

Plain PHP 8 (no framework, works on any Hostinger plan):

```text
hostinger/
├── .htaccess                    # routing + gzip + security headers + HTTPS force
├── index.html                   # placeholder (your built React app goes here)
├── api/
│   ├── bootstrap.php            # env loader, DB (PDO), CORS, error handler
│   ├── auth/
│   │   ├── login.php            # email + password → JWT cookie
│   │   ├── logout.php
│   │   ├── me.php               # current user + roles
│   │   ├── forgot-password.php  # emails reset link via SMTP
│   │   └── reset-password.php
│   ├── admin/
│   │   ├── users.php            # list/grant/revoke roles (admin only)
│   │   ├── settings.php
│   │   ├── amenities.php
│   │   ├── specifications.php
│   │   ├── video.php
│   │   ├── gallery.php
│   │   ├── floor-plans.php
│   │   ├── location.php
│   │   ├── faqs.php
│   │   ├── testimonials.php
│   │   ├── leads.php            # list + CSV export
│   │   └── upload.php           # multipart → /uploads/{folder}/…
│   └── public/
│       ├── site.php             # brand, phone, hero image, etc.
│       ├── amenities.php
│       ├── specifications.php
│       ├── video.php
│       ├── gallery.php
│       ├── floor-plans.php
│       ├── location.php
│       ├── faqs.php
│       ├── testimonials.php
│       └── lead.php             # POST — public contact form
└── lib/
    ├── db.php                   # PDO singleton, prepared statements only
    ├── jwt.php                  # HS256 sign/verify, HTTP-only Secure cookie
    ├── auth.php                 # requireLogin(), requireRole('admin'|'editor')
    ├── validate.php             # input validation helpers
    ├── rate-limit.php           # file-based login rate limiter (5/min/IP)
    └── mailer.php               # PHPMailer wrapper for SMTP
```

Security baked in:
- **SQL injection**: PDO prepared statements everywhere, no string concatenation
- **XSS**: JSON responses, no HTML rendering from user input
- **CSRF**: `SameSite=Strict` cookies + `Origin` header check on writes
- **Passwords**: `password_hash(PASSWORD_BCRYPT)` / `password_verify`
- **JWT**: HS256, HTTP-only, `Secure`, `SameSite=Strict`, 7-day expiry
- **Rate limit**: login capped at 5/min per IP (file-based, no Redis needed)
- **Uploads**: MIME sniff + extension allowlist, size cap, random filename
- **Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy` starter

### 4. File storage — `hostinger/uploads/`

Skeleton folders committed with `.gitkeep`:
```
uploads/images/  uploads/videos/  uploads/documents/  uploads/profile/  uploads/services/
```
`.htaccess` in `uploads/` blocks PHP execution (prevents uploaded-file RCE).

### 5. Config — `hostinger/.env.example`

```
APP_URL=https://yourdomain.com
DB_HOST=localhost
DB_NAME=u123456_gangalegend
DB_USER=u123456_admin
DB_PASS=
JWT_SECRET=
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@yourdomain.com
UPLOAD_MAX_MB=25
```

### 6. Deployment guide — `hostinger/README.md`

Written for non-technical users. Covers:
1. Create MySQL DB in hPanel + note credentials
2. Import `schema.sql` via phpMyAdmin
3. Import data CSVs (from step 2)
4. Upload `hostinger/` contents to `public_html/`
5. Rename `.env.example` → `.env` and fill in credentials
6. Set folder permissions (`755` dirs / `644` files / `775` uploads)
7. Turn on SSL in hPanel
8. Log in with seeded admin, change password
9. Backup schedule (hPanel auto-backups + `mysqldump` cron example)

### 7. SEO files — copy `public/robots.txt` and generate a static `sitemap.xml` inside `hostinger/`

## What this plan does NOT do (be aware)

- **Does not rewrite your React frontend to call the PHP API.** Your Lovable site keeps running on Supabase exactly as it does today. Rewiring `src/lib/*.functions.ts` files to `fetch('/api/…')` is a big second phase — I'll do it in a follow-up turn once you've confirmed the PHP backend works on Hostinger.
- **Does not automatically export your existing data.** I'll give you the export commands and column mappings, but you (or I in a later turn) run the export from Lovable Cloud → Advanced → Export data.
- **Does not migrate password hashes.** Supabase's bcrypt variant isn't compatible — every existing user (there's basically only your admin account) will use forgot-password once, or I seed you a fresh admin login in the SQL.
- **Does not test end-to-end on Hostinger.** I can't SSH into your Hostinger account. You'll have to upload and confirm; I'll fix any issues you report.

## What comes after this plan (follow-up turns)

Once the `hostinger/` package is uploaded and you confirm the PHP API responds:
- **Phase 2:** Add a `VITE_API_BASE` env var to the React app and a thin `apiClient` that mirrors the current `cms.functions.ts` calls but hits the PHP endpoints instead of Supabase. Ship behind a flag.
- **Phase 3:** Data export/import for real content.
- **Phase 4:** Cut over — remove Supabase client, rebuild the React app, drop the built `dist/` into Hostinger `public_html/`.

## Confirm and I start

Reply **"go"** and I'll build the entire `hostinger/` folder in the next turn. If you want any changes to the plan (add blog tables, drop features, use MariaDB instead of MySQL 8, different folder name, etc.) tell me now.
