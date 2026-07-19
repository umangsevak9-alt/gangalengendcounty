## What you'll get

- **Amenities cards** now show a real photo above each title.
- **Specifications rows** get an optional photo per category (Structure, Flooring, Kitchen, etc.).
- A new **Video section** on the landing page (title, subtitle, hosted video + poster image).
- **Admin panel** gets three fully editable sections with drag-free reorder, image upload, and inline edit — no code needed.

## Data & storage

Create one public storage bucket `cms-media` for images and videos (max ~50 MB per file), plus three tables:

- **`amenities`** — `title`, `note`, `image_url`, `sort_order`
- **`specifications`** — `group_name`, `detail`, `image_url`, `sort_order`
- **`video_section`** — single-row table: `title`, `subtitle`, `video_url`, `poster_url`, `provider` (upload | youtube | vimeo)

Row-level security:
- Anyone (including anonymous visitors) can **read** — the landing page needs to render for the public.
- Only **admins** and **editors** can insert/update/delete.
- Storage bucket: public read; authenticated users with a role can upload/delete.

Seed the tables with your current amenity list and specifications from `src/content/site.ts` so the site keeps rendering identically until you edit it.

## Admin panel (`/admin`)

Three new pages, gated by role:

1. `/admin/amenities` — list + add/edit modal (title, note, image upload, sort order), delete confirm.
2. `/admin/specifications` — same shape, for spec rows.
3. `/admin/video` — single form for the video section (upload a video file or paste YouTube/Vimeo URL, upload poster, edit title/subtitle).

Each editor:
- Drops files into the `cms-media` bucket via signed upload.
- Shows a live preview of the current image / video.
- Uses the existing sand/ivory admin styling.

The dashboard cards on `/admin` will link to these three pages.

## Landing page rewiring

- Amenities and Specifications sections switch from hardcoded arrays in `site.ts` to a public read from the new tables (server function using the publishable-key client with a narrow `TO anon` select policy). Falls back to the seeded copy if the fetch fails so the page never blanks.
- Add a new `<VideoSection>` component between Amenities and Sustainability, with responsive `<video>` or embedded iframe.
- Images use `object-cover` with rounded corners consistent with the current aesthetic.

## Technical details (skip if not interested)

- Public reads: TanStack `createServerFn` with a `SUPABASE_PUBLISHABLE_KEY` client, narrow `TO anon` SELECT policies on all three tables.
- Admin writes: `createServerFn` with `requireSupabaseAuth` middleware; policies check `has_role(auth.uid(), 'admin' OR 'editor')`.
- Upload: browser client uploads directly to `cms-media` bucket; server function returns signed URL and stores public URL in the table.
- Video: supports MP4 upload (playable via `<video>` tag) OR YouTube/Vimeo URL (embedded via iframe).
- Cache: `queryClient.invalidateQueries` after each admin write so the public site updates instantly on refresh.

## Out of scope for this round

- Reordering via drag-and-drop (sort_order is a number input for now).
- Bulk image import.
- Multiple video sections.

Ready to build?