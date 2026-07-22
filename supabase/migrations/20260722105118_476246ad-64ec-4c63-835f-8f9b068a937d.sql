ALTER TABLE public.video_section ADD COLUMN IF NOT EXISTS aspect_ratio TEXT NOT NULL DEFAULT '16/9';
ALTER TABLE public.video_section DROP CONSTRAINT IF EXISTS video_section_aspect_ratio_check;
ALTER TABLE public.video_section ADD CONSTRAINT video_section_aspect_ratio_check CHECK (aspect_ratio IN ('16/9','4/3','1/1','9/16','21/9'));