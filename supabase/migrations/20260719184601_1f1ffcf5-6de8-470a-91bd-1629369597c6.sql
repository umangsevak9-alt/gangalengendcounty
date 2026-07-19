
-- Gallery Images
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_path TEXT NOT NULL,
  aspect TEXT NOT NULL DEFAULT 'wide',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery_editor_write" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER gallery_updated BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Floor Plans
CREATE TABLE public.floor_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tower TEXT,
  area TEXT,
  price TEXT,
  status TEXT,
  is_limited BOOLEAN NOT NULL DEFAULT false,
  image_path TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.floor_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.floor_plans TO authenticated;
GRANT ALL ON public.floor_plans TO service_role;
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_public_read" ON public.floor_plans FOR SELECT USING (true);
CREATE POLICY "plans_editor_write" ON public.floor_plans FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER plans_updated BEFORE UPDATE ON public.floor_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Location: settings (single-row) + landmarks
CREATE TABLE public.location_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT 'Pune''s most connected luxury address.',
  subtitle TEXT,
  address TEXT,
  map_embed_url TEXT,
  directions_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.location_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.location_settings TO authenticated;
GRANT ALL ON public.location_settings TO service_role;
ALTER TABLE public.location_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loc_public_read" ON public.location_settings FOR SELECT USING (true);
CREATE POLICY "loc_editor_write" ON public.location_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER loc_updated BEFORE UPDATE ON public.location_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.location_landmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  travel_time TEXT,
  icon_key TEXT NOT NULL DEFAULT 'MapPin',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.location_landmarks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.location_landmarks TO authenticated;
GRANT ALL ON public.location_landmarks TO service_role;
ALTER TABLE public.location_landmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "landmarks_public_read" ON public.location_landmarks FOR SELECT USING (true);
CREATE POLICY "landmarks_editor_write" ON public.location_landmarks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER landmarks_updated BEFORE UPDATE ON public.location_landmarks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "faqs_editor_write" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Leads (contact form submissions)
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact_form',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_anon_insert" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "leads_auth_insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "leads_editor_read" ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- Seed defaults
INSERT INTO public.location_settings (heading, subtitle, address, map_embed_url, directions_url)
VALUES (
  'Pune''s most connected luxury address.',
  'Everything that matters — work, schools, healthcare, retail — is 20 minutes or less.',
  'Ganga Legend County, Kharadi, Pune',
  'https://www.google.com/maps?q=Kharadi+Pune&output=embed',
  'https://www.google.com/maps/search/?api=1&query=Ganga+Legend+County+Pune'
);

INSERT INTO public.location_landmarks (label, travel_time, icon_key, sort_order) VALUES
('Pune Airport','22 min','Navigation',10),
('Kharadi IT Park','10 min','Building2',20),
('Amanora Mall','8 min','ShoppingBag',30),
('Ruby Hall Clinic','15 min','Hospital',40),
('Symbiosis School','6 min','GraduationCap',50),
('Central Park','5 min','Trees',60);

INSERT INTO public.floor_plans (name, tower, area, price, status, is_limited, sort_order) VALUES
('2 BHK Refined','Aarambh · Udaan','1,180 sq.ft.','₹1.35 Cr onwards','Available',false,10),
('3 BHK Signature','Samarasya','1,720 sq.ft.','₹1.95 Cr onwards','Filling Fast',true,20),
('4 BHK Sky Suite','Jeevanam','2,640 sq.ft.','₹3.10 Cr onwards','Limited Units',true,30);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('When is Nova One launching?','Nova One is currently in pre-launch. Priority allotment is open for select families before the public launch.',10),
('What is the RERA status?','Nova One is RERA approved. Registration numbers are shared upon request during the site visit.',20),
('What configurations are available?','2 BHK, 3 BHK, and 4 BHK sky suites across the four towers — Aarambh, Udaan, Samarasya and Jeevanam.',30),
('Is home-loan assistance available?','Yes — we have empanelled partners with HDFC, SBI, ICICI and Axis for pre-approved loans up to 90% of value.',40);
