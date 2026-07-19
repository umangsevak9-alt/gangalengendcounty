This is a large build. I'll split it into two phases so you see progress fast and can course-correct.

## Phase 1 — Landing Page Redesign (no backend needed)

Rebuild the current single page in a true Navy + White + Gold + selective Red luxury system, inspired by Elite24's polish but original.

**Theme**
- Palette: `#0B2A5B` navy primary, `#154EA8` royal, `#D4AF37` gold, `#C62828` red (used only for site-visit CTA, "limited units", offer badges), `#F7F8FB` light section, white cards, `#1E293B` text.
- Typography: serif headings (Libre Baskerville), sans body (IBM Plex Sans) — already loaded.
- 70% white / 20% navy / 5% gold / 5% red distribution across sections.
- Rounded-2xl cards, soft shadows, generous whitespace, subtle fade/slide/counter animations.

**Sections (no header, no footer — landing only)**
1. Hero — full-bleed tower image, navy overlay, huge serif headline "Live the Future. Own the Lifestyle." with gold-highlighted words, sub-copy, stat row (Acres / Families / Amenities / RERA), 4 CTAs (Book Site Visit red, Call Now, WhatsApp, Virtual Tour).
2. Floating vertical contact rail (WhatsApp green, Call red, Site Visit blue, Directions gold, Callback white) with tooltips + hover lift.
3. Why Choose Us — 6 luxury cards with premium icons, hover lift.
4. Amenities — 8-card luxury grid (Ileseum Club items), icon + hover shadow.
5. Gallery — Pinterest-style masonry with lightbox (zoom, prev/next).
6. Floor Plans — cards with area/price/CTA, popup with PDF link.
7. Location — embedded map, directions, nearby (schools/hospitals/airport/metro/mall).
8. Trust Band — dark navy section, gold icons (RERA, IGBC, awards, delivery record).
9. Offer Banner — light section with gold divider and single red "Book Now" CTA.
10. Testimonials — auto-slider cards with photo + 5-star + quote.
11. Contact Form — glass card on light section (Name, Phone, Email, Property, Message).
12. Popups — exit-intent, scroll, offer, welcome, thank-you (data-driven so Phase 2 can toggle them).

**Deliverables Phase 1**
- Rewrite `src/styles.css` tokens to the navy/gold system.
- Rewrite `src/routes/index.tsx` with the sections above.
- Add small components under `src/components/landing/` (Hero, FloatingRail, Amenities, Gallery, FloorPlans, Testimonials, ContactForm, Popups).
- Lead form saves to `localStorage` in Phase 1; swaps to DB in Phase 2.

## Phase 2 — Admin CMS (Lovable Cloud)

Enable Lovable Cloud (managed Postgres + Auth + Storage). Every landing section reads from DB so admins edit without code.

**Auth**
- Email + password login at `/admin/login`.
- Roles: `admin`, `editor` (via `user_roles` table + `has_role()` security-definer).
- Protected `/admin/*` routes gated by session + role.

**Database tables** (public schema, RLS on, grants set)
`hero`, `stats`, `amenities`, `gallery_images`, `videos`, `floor_plans`, `location_settings`, `nearby_places`, `offers`, `testimonials`, `popups`, `leads`, `settings` (logo/favicon/colors/fonts/analytics IDs/SMTP), `seo_meta`, `user_roles`.

Public site reads with a publishable-key client + narrow `TO anon` SELECT policies. Writes require authenticated admin/editor.

**Storage buckets**
`site-images` (public), `floor-plan-pdfs` (public), `videos` (public). Uploads with drag-drop, replace, delete, auto-compress client-side.

**Admin panel** (`/admin`)
- Dark left sidebar, white content, luxury cards.
- Dashboard: total leads, visitors, conversions, recent leads table, monthly chart, activity feed.
- CMS screens: Hero, Amenities, Gallery, Videos, Floor Plans, Location, Offers, Testimonials, Popups, Contact info, SEO, Settings, Users.
- Leads: table with search/filter, status (New/Contacted/Site Visit/Closed), assign agent, notes, CSV export, delete.
- SEO: meta title/description/keywords/OG image/robots/canonical/schema JSON-LD, read by root route `head()`.

**Forms**
- Contact + Book Site Visit + Callback save to `leads` table.
- Success popup on submit.
- Optional email notification via managed email domain (offered separately once domain is set up).

**Responsive & polish**
- Mobile-first at every step.
- Lazy-load images, semantic HTML, alt text, Core Web Vitals aware.

## Technical notes (for the record)
- Stack: TanStack Start (already set up). Server functions for admin writes with `requireSupabaseAuth` middleware; public reads via publishable client in server functions.
- No Supabase branding shown to you — Lovable Cloud handles it.
- Google Analytics / Meta Pixel / Search Console: IDs stored in `settings`; script tags injected from `__root.tsx` when present.
- Google Maps: embed URL editable from admin (no API key required for basic embed).

## What I need from you before starting

1. **Go / adjust?** Reply "go" and I'll start Phase 1 immediately. Or tell me what to change.
2. **Admin email** for the first admin account (used in Phase 2 seed). You can share it when Phase 1 is done.
3. **Real assets** — brochure PDF, logo, brand phone/WhatsApp number, RERA numbers, Google Maps location — send anytime; I'll use sensible placeholders otherwise.

Phase 1 ships first as a single big update. Phase 2 follows in focused chunks (auth + schema → CMS screens → leads → SEO/settings) so nothing feels half-built.