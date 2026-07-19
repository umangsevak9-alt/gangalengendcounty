
-- 1. Amenities
CREATE TABLE public.amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  note text,
  image_path text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.amenities TO authenticated;
GRANT ALL ON public.amenities TO service_role;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read amenities" ON public.amenities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors write amenities" ON public.amenities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 2. Specifications
CREATE TABLE public.specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL,
  detail text NOT NULL,
  image_path text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.specifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.specifications TO authenticated;
GRANT ALL ON public.specifications TO service_role;
ALTER TABLE public.specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read specifications" ON public.specifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors write specifications" ON public.specifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 3. Video section (single-row)
CREATE TABLE public.video_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Experience Nova One',
  subtitle text,
  provider text NOT NULL DEFAULT 'upload' CHECK (provider IN ('upload','youtube','vimeo')),
  video_url text,
  video_path text,
  poster_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_section TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_section TO authenticated;
GRANT ALL ON public.video_section TO service_role;
ALTER TABLE public.video_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read video" ON public.video_section FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors write video" ON public.video_section FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 4. Updated-at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER amenities_updated BEFORE UPDATE ON public.amenities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER specifications_updated BEFORE UPDATE ON public.specifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER video_section_updated BEFORE UPDATE ON public.video_section FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Storage policies on cms-media bucket
CREATE POLICY "Public read cms-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'cms-media');

CREATE POLICY "Editors upload cms-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cms-media'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Editors update cms-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cms-media'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Editors delete cms-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cms-media'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- 6. Seed content from site.ts
INSERT INTO public.amenities (title, note, sort_order) VALUES
  ('Michael Phelps Signature Pool', 'Olympic-grade lap & leisure water', 10),
  ('Meditation Pavilion', 'Silence rooms & sound therapy', 20),
  ('Fully-Equipped Gymnasium', 'Technogym® strength & cardio', 30),
  ('Private Cinema', 'Dolby Atmos screening lounge', 40),
  ('Arts Gallery', 'Rotating curated residencies', 50),
  ('Cricket · Tennis · Football', 'Championship-grade grounds', 60),
  ('Co-working & Business Lounge', 'Fibre-linked private suites', 70),
  ('Pet Spa & Runs', 'Grooming, play, veterinary corner', 80),
  ('Children''s Discovery Zone', 'STEM lab, splash pool, library', 90);

INSERT INTO public.specifications (group_name, detail, sort_order) VALUES
  ('Structure', 'RCC earthquake-resistant framed structure, seismic zone III+ compliant', 10),
  ('Flooring', '800×1600 vitrified tiles in living & bedrooms; imported marble in master', 20),
  ('Kitchen', 'Granite counter, S/S sink, glazed dado, provisions for hob, chimney, RO, WM', 30),
  ('Bathrooms', 'Grohe/Kohler CP fittings, wall-hung EWCs, glass shower enclosures', 40),
  ('Doors & Windows', 'Engineered veneer main door with digital lock; UPVC double-glazed windows', 50),
  ('Electrification', 'Modular switches, concealed copper wiring, EV-ready parking, 3-phase supply', 60),
  ('Automation', 'Smart lighting scenes, AC control, video door phone, app-based access', 70);

INSERT INTO public.video_section (title, subtitle, provider, video_url) VALUES
  ('Experience Nova One', 'A cinematic walkthrough of the towers, the club, and the wellness spaces.',
   'youtube', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
