# Ganga Legend County — Hostinger Deployment Package

A complete PHP 8 + MySQL backend + deployment kit. Upload the contents of this
`hostinger/` folder to your Hostinger `public_html/`, import the SQL, fill in
`.env`, and the API is live.

> **Note:** This backend is the *server side* only. The React frontend still
> talks to Supabase today. Rewiring the frontend to call this API is a
> separate step — see "Phase 2: switch the frontend" at the bottom.

---

## What's in this folder

```
hostinger/
├── .env.example                # copy to .env and fill in
├── .htaccess                   # HTTPS, gzip, caching, security headers, SPA fallback
├── index.html                  # placeholder — replace with built React app
├── robots.txt
├── sitemap.xml
├── database/
│   ├── schema.sql              # MySQL schema, seed admin, seed site settings
│   └── EXPORT-FROM-CURRENT.md  # how to migrate existing data
├── api/
│   ├── bootstrap.php           # env, CORS, error handler
│   ├── auth/                   # login, logout, me, forgot/reset password
│   ├── admin/                  # settings, amenities, specs, gallery, plans,
│   │                             location, faqs, testimonials, leads, users, upload
│   └── public/                 # public read endpoints + lead submit
├── lib/                        # db, jwt, auth, validate, rate-limit, mailer, crud
└── uploads/                    # images/, videos/, documents/, profile/, services/
```

---

## Step-by-step deployment

### 1. Create a MySQL database on Hostinger

- hPanel → **Databases** → **MySQL Databases**
- Create a new DB (name it e.g. `u123456_novaone`). Note the DB name, user, password, and host.
- Note the values — you'll paste them into `.env` in step 4.

### 2. Import the schema

- hPanel → **phpMyAdmin** → select the DB → **Import** tab → upload `database/schema.sql`.
- This creates all tables and seeds one admin account:
  - Email: `admin@example.com`
  - Password: `ChangeMe!2026` — **change immediately after first login**.

### 3. Upload the files

- hPanel → **File Manager** → open `public_html/`.
- Upload everything from this `hostinger/` folder into `public_html/`. Do not
  upload the folder itself; upload its **contents**.
- Set folder permissions:
  - Directories: `755`
  - Files: `644`
  - `uploads/` and subfolders: `775` (writable so PHP can save files)

### 4. Configure environment variables

- In File Manager, rename `.env.example` → `.env`.
- Edit `.env` and fill in:
  - `APP_URL` — your final HTTPS domain (e.g. `https://gangalegend.com`)
  - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` — from step 1
  - `JWT_SECRET` — a random 64-char string. Generate on any Linux box:
    ```bash
    php -r "echo bin2hex(random_bytes(32));"
    ```
    or use https://generate-secret.now.sh/32
  - `SMTP_*` — Hostinger email account (create in hPanel → Emails → Email Accounts)

### 5. Turn on SSL

- hPanel → **Security** → **SSL** → install the free Let's Encrypt cert on your domain.
- The `.htaccess` already forces HTTPS.

### 6. Test the API

Open these URLs in your browser (should return JSON):

- `https://yourdomain.com/api/public/site.php` → seeded brand info
- `https://yourdomain.com/api/public/amenities.php` → `{ "items": [] }`

Log in from a REST client (Postman / curl):

```bash
curl -X POST https://yourdomain.com/api/auth/login.php \
  -H 'Content-Type: application/json' -H 'Origin: https://yourdomain.com' \
  -d '{"email":"admin@example.com","password":"ChangeMe!2026"}' \
  -c cookies.txt
```

Then verify session:

```bash
curl https://yourdomain.com/api/auth/me.php -b cookies.txt
```

### 7. Change the admin password

Call the reset endpoint from the admin panel (once Phase 2 is done), or
manually update in phpMyAdmin:

```php
<?php echo password_hash('YourNewStrongPassword', PASSWORD_BCRYPT);
```

Paste the resulting hash into the `users.password_hash` cell for `admin@example.com`.

---

## API endpoints (reference)

### Public (no auth)
| Method | Path | Purpose |
|--|--|--|
| GET | `/api/public/site.php` | Brand + contact info |
| GET | `/api/public/amenities.php` | Amenity cards |
| GET | `/api/public/specifications.php` | Spec sheet |
| GET | `/api/public/video.php` | Homepage video |
| GET | `/api/public/gallery.php` | Gallery images |
| GET | `/api/public/floor-plans.php` | Floor plan cards |
| GET | `/api/public/location.php` | Location settings + landmarks |
| GET | `/api/public/faqs.php` | FAQs |
| GET | `/api/public/testimonials.php` | Active testimonials |
| POST | `/api/public/lead.php` | Submit contact form |

### Auth
| Method | Path | Purpose |
|--|--|--|
| POST | `/api/auth/login.php` | Email + password → session cookie |
| POST | `/api/auth/logout.php` | Clear session |
| GET  | `/api/auth/me.php` | Current user + roles |
| POST | `/api/auth/forgot-password.php` | Send reset email |
| POST | `/api/auth/reset-password.php` | Set new password with token |

### Admin (requires editor or admin cookie)
GET lists items, POST upserts (`{ id?, ... }`), DELETE removes (`{ id }`).
- `/api/admin/settings.php`, `/api/admin/amenities.php`, `/api/admin/specifications.php`
- `/api/admin/video.php`, `/api/admin/gallery.php`, `/api/admin/floor-plans.php`
- `/api/admin/location.php?type=settings|landmarks`, `/api/admin/faqs.php`
- `/api/admin/testimonials.php`, `/api/admin/leads.php` (`?format=csv` for export)
- `/api/admin/upload.php` — multipart form: `file`, `folder` (images/videos/documents/profile/services)
- `/api/admin/users.php` — admin only. POST body `{ action: "create" | "set_role" | "toggle_active", ... }`

---

## Security features already built in

- **SQL injection**: PDO prepared statements, no string concatenation anywhere.
- **XSS**: JSON-only responses; nothing user-supplied is rendered as HTML server-side.
- **CSRF**: `SameSite=Strict` cookies + `Origin`/`Referer` header check on all writes.
- **Passwords**: `password_hash(PASSWORD_BCRYPT)` (60-char bcrypt).
- **Sessions**: HS256 JWT in HTTP-only + Secure cookie, 7-day expiry.
- **Login rate limit**: 5 failed attempts / min / IP (`login_attempts` table).
- **Lead spam guard**: 10 submissions / min / IP.
- **Uploads**: MIME sniff via `finfo`, extension allowlist, size cap, random filename, `uploads/.htaccess` blocks PHP execution.
- **HTTPS**: forced by `.htaccess`; `Strict-Transport-Security` header set.
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Backups

**Recommended cadence: daily database, weekly full-site.**

### Database (automated in hPanel)
hPanel → **Files** → **Backups** → enable automatic daily backups. Hostinger keeps 7 days.

### Manual DB dump (add to cron for extra safety)
hPanel → **Advanced** → **Cron Jobs**. Add a daily job:
```
0 3 * * * mysqldump -u $DB_USER -p'$DB_PASS' $DB_NAME | gzip > ~/backups/db-$(date +\%Y\%m\%d).sql.gz
```

### Uploads backup
```
0 4 * * 0 tar -czf ~/backups/uploads-$(date +\%Y\%m\%d).tar.gz -C ~/public_html uploads
```

### Restore
1. Database: phpMyAdmin → Import → select `.sql` or `.sql.gz`.
2. Files: extract the tarball back into `public_html/`.

---

## Phase 2: switch the frontend to this API

Currently the React app talks to Supabase. To make the deployed site use this
PHP backend, in a follow-up we will:

1. Add `VITE_API_BASE=https://yourdomain.com` to the React app.
2. Replace every `src/lib/*.functions.ts` call with `fetch('${API_BASE}/api/...')`.
3. Replace `supabase.auth` with the `/api/auth/*` endpoints.
4. Run `bun run build` → drop the contents of `dist/` into `public_html/`
   (alongside `api/` and `uploads/`).

Say **"go ahead with phase 2"** whenever you're ready and I'll do that migration.

---

## Troubleshooting

| Symptom | Fix |
|--|--|
| 500 on every request | Check `.env` exists in `public_html/` and DB credentials are right. Look at hPanel → **Errors log**. |
| `Bad origin` on writes | Set `APP_URL` in `.env` to your real domain (with `https://`). |
| Login always fails | Confirm you didn't skip step 2 (schema import). Try phpMyAdmin → `SELECT * FROM users;` |
| Uploads 500 | `uploads/` folder needs `775` permissions. |
| Emails not sending | Verify SMTP creds; try `SMTP_PORT=587` if 465 blocked. |
