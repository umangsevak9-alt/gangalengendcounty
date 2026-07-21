import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

function serverPublicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function signPath(
  supabase: ReturnType<typeof serverPublicClient>,
  path: string | null,
): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("cms-media").createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

export const getPublicAmenities = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("amenities")
    .select("id, title, note, image_path, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { items: [] as Array<{ id: string; title: string; note: string | null; image_url: string | null; sort_order: number }> };
  const items = await Promise.all(
    (data ?? []).map(async (r) => ({
      id: r.id,
      title: r.title,
      note: r.note,
      image_url: await signPath(supabase, r.image_path),
      sort_order: r.sort_order,
    })),
  );
  return { items };
});

export const getPublicSpecifications = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("specifications")
    .select("id, group_name, detail, image_path, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { items: [] as Array<{ id: string; group_name: string; detail: string; image_url: string | null; sort_order: number }> };
  const items = await Promise.all(
    (data ?? []).map(async (r) => ({
      id: r.id,
      group_name: r.group_name,
      detail: r.detail,
      image_url: await signPath(supabase, r.image_path),
      sort_order: r.sort_order,
    })),
  );
  return { items };
});

export const getPublicVideoSection = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("video_section")
    .select("id, title, subtitle, provider, video_url, video_path, poster_path, is_active")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    provider: data.provider as "upload" | "youtube" | "vimeo",
    video_url: data.video_url,
    video_signed_url: await signPath(supabase, data.video_path),
    poster_url: await signPath(supabase, data.poster_path),
  };
});

/* -------- Gallery -------- */
export const getPublicGallery = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, title, image_path, aspect, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { items: [] as Array<{ id: string; title: string | null; image_url: string | null; aspect: string; sort_order: number }> };
  const items = await Promise.all(
    (data ?? []).map(async (r) => ({
      id: r.id,
      title: r.title,
      image_url: await signPath(supabase, r.image_path),
      aspect: r.aspect,
      sort_order: r.sort_order,
    })),
  );
  return { items };
});

/* -------- Floor plans -------- */
export const getPublicFloorPlans = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("floor_plans")
    .select("id, name, tower, area, price, status, is_limited, image_path, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { items: [] as Array<{ id: string; name: string; tower: string | null; area: string | null; price: string | null; status: string | null; is_limited: boolean; image_url: string | null; sort_order: number }> };
  const items = await Promise.all(
    (data ?? []).map(async (r) => ({
      id: r.id,
      name: r.name,
      tower: r.tower,
      area: r.area,
      price: r.price,
      status: r.status,
      is_limited: r.is_limited,
      image_url: await signPath(supabase, r.image_path),
      sort_order: r.sort_order,
    })),
  );
  return { items };
});

/* -------- Location -------- */
export const getPublicLocation = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const [{ data: settings }, { data: landmarks }] = await Promise.all([
    supabase.from("location_settings").select("*").eq("is_active", true).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("location_landmarks").select("id, label, travel_time, icon_key, sort_order").order("sort_order", { ascending: true }),
  ]);
  return {
    settings: settings ?? null,
    landmarks: landmarks ?? [],
  };
});

/* -------- FAQs -------- */
export const getPublicFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return { items: [] as Array<{ id: string; question: string; answer: string; sort_order: number }> };
  return { items: data ?? [] };
});

/* -------- Submit lead (public) -------- */
const leadSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(5).max(40),
  email: z.string().email().max(200).optional().or(z.literal("")),
  property_interest: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().max(50).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = serverPublicClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      property_interest: data.property_interest || null,
      message: data.message || null,
      source: data.source || "contact_form",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getPublicSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("brand_name, brand_code, developer, partner, location, rera, phone, whatsapp, email, whatsapp_message")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
});
