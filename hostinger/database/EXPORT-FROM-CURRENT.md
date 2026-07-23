# Migrating existing data from the current backend to Hostinger MySQL

The current site stores everything in Supabase Postgres + Supabase Storage.
Below is exactly how to move it to your Hostinger MySQL DB and `/uploads/`.

## 1. Export tables as CSV

In the Lovable editor: **Cloud → Advanced → Export data**. This exports every
table as a `.csv` file. You'll receive a zip.

Alternatively, if you have `psql` access, run one line per table:

```bash
for T in site_settings amenities specifications video_section gallery_images \
         floor_plans location_settings location_landmarks faqs testimonials leads \
         profiles user_roles; do
  psql -c "\copy public.$T TO '/tmp/${T}.csv' CSV HEADER"
done
```

## 2. Column mapping notes

Most columns line up 1:1 between Postgres and MySQL. Watch for:

| Table | Field | Change |
|--|--|--|
| all | `id` | UUID string preserved as-is (MySQL `CHAR(36)`) |
| all | `created_at`, `updated_at` | Postgres `timestamptz` → MySQL `DATETIME`. Strip the timezone: `2026-07-01 12:00:00+00` → `2026-07-01 12:00:00` |
| all | `image_path`, `video_path`, `poster_path`, `hero_image_path` | These currently reference the Supabase Storage `cms-media` bucket. After you re-upload the media (step 4), the paths become relative to `/uploads/`. Recommend a global find/replace: `bucket-prefix/…` → `images/…` (or the right subfolder) |
| `video_section`, `testimonials` | `provider` | Enum values match: `upload | youtube | vimeo` (testimonials also allow `none`) |
| `leads` | (new) `ip_address` | Not exported; leave NULL |

## 3. Import into MySQL

Option A — phpMyAdmin (simplest for < ~5 MB):
- Select the table → **Import** tab → upload the CSV.
- Format: `CSV using LOAD DATA`.
- **Column names in first row**: ✓
- **Fields terminated by**: `,`  **Enclosed by**: `"`  **Escaped by**: `\`

Option B — SSH to the Hostinger server (available on Business+ / VPS):
```bash
mysql -u DB_USER -p DB_NAME -e "
  LOAD DATA LOCAL INFILE '/home/user/site_settings.csv'
  INTO TABLE site_settings
  FIELDS TERMINATED BY ',' ENCLOSED BY '\"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS;"
```

Import in this order to satisfy foreign keys:
1. `users` (see note below), `profiles`
2. `user_roles`
3. Everything else (site_settings, amenities, specifications, video_section, gallery_images, floor_plans, location_settings, location_landmarks, faqs, testimonials, leads)

## 4. Users + passwords

Supabase stores passwords with its own bcrypt variant that is not portable to
another system. You have two choices:

**Recommended — everyone resets their password once.**
Import `profiles` and `user_roles`, but leave `users.password_hash` as any
random value (or generate throwaway hashes). Send everyone the forgot-password
link once the site is live. The seeded `admin@example.com` in `schema.sql` is
your first working login.

**Alternative — recreate accounts manually.**
For each old user, INSERT a new row into `users` with a fresh password via
phpMyAdmin (see README step 7 for how to generate a hash).

## 5. Media files (Supabase Storage → /uploads)

The `cms-media` bucket contains every image and video uploaded through the
admin panel. To move them:

1. In the Lovable editor: **Cloud → Storage → cms-media** → select all → Download.
   You'll get a zip.
2. Extract locally. The paths inside look like `amenities/xxx.jpg`,
   `specifications/xxx.png`, `hero/xxx.jpg`, etc.
3. Re-upload each subfolder into the matching Hostinger `/uploads/` subfolder:
   - Any images → `/uploads/images/`
   - Any videos → `/uploads/videos/`
   - Hero image → `/uploads/images/`
4. In each database table, `UPDATE ... SET image_path = REPLACE(image_path,
   'old-prefix/', 'images/')` — see the note in the mapping table above.

## 6. Verify

- `SELECT COUNT(*) FROM amenities;` should match your old dashboard count.
- Open `https://yourdomain.com/api/public/amenities.php` — you should see the
  imported rows with `image_url` pointing at `/uploads/…`.
- Load `https://yourdomain.com/uploads/images/<one-of-the-files>` in a browser
  — should render the image (not 404).

Once verified, Phase 2 (frontend switchover) can safely swap the React app
onto this API.
