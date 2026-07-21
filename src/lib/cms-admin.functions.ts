import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertEditor(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("editor")) {
    throw new Error("Forbidden: admin or editor role required");
  }
}

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin")) throw new Error("Forbidden: admin role required");
}

/* ---------- Amenities ---------- */
const amenitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  note: z.string().max(500).nullable().optional(),
  image_path: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999),
});

export const listAmenitiesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase
      .from("amenities").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertAmenity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => amenitySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = { title: data.title, note: data.note ?? null, image_path: data.image_path ?? null, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("amenities").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("amenities").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteAmenity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("amenities").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Specifications ---------- */
const specSchema = z.object({
  id: z.string().uuid().optional(),
  group_name: z.string().min(1).max(200),
  detail: z.string().min(1).max(1000),
  image_path: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999),
});

export const listSpecificationsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("specifications").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertSpecification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => specSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = { group_name: data.group_name, detail: data.detail, image_path: data.image_path ?? null, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("specifications").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("specifications").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteSpecification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("specifications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Video ---------- */
const videoSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).nullable().optional(),
  provider: z.enum(["upload", "youtube", "vimeo"]),
  video_url: z.string().max(1000).nullable().optional(),
  video_path: z.string().max(500).nullable().optional(),
  poster_path: z.string().max(500).nullable().optional(),
  is_active: z.boolean().default(true),
});

export const getVideoSectionAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("video_section").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertVideoSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => videoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      title: data.title, subtitle: data.subtitle ?? null, provider: data.provider,
      video_url: data.video_url ?? null, video_path: data.video_path ?? null,
      poster_path: data.poster_path ?? null, is_active: data.is_active,
    };
    if (data.id) {
      const { error } = await context.supabase.from("video_section").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("video_section").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

/* ---------- Gallery ---------- */
const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().max(200).nullable().optional(),
  image_path: z.string().min(1).max(500),
  aspect: z.enum(["wide", "tall", "square"]),
  sort_order: z.number().int().min(0).max(9999),
});

export const listGalleryAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertGalleryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => gallerySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = { title: data.title ?? null, image_path: data.image_path, aspect: data.aspect, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("gallery_images").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("gallery_images").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteGalleryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("gallery_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Floor plans ---------- */
const planSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  tower: z.string().max(200).nullable().optional(),
  area: z.string().max(100).nullable().optional(),
  price: z.string().max(100).nullable().optional(),
  status: z.string().max(100).nullable().optional(),
  is_limited: z.boolean().default(false),
  image_path: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999),
});

export const listFloorPlansAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("floor_plans").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertFloorPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => planSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      name: data.name, tower: data.tower ?? null, area: data.area ?? null,
      price: data.price ?? null, status: data.status ?? null,
      is_limited: data.is_limited, image_path: data.image_path ?? null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("floor_plans").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("floor_plans").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteFloorPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("floor_plans").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Location settings ---------- */
const locationSchema = z.object({
  id: z.string().uuid().optional(),
  heading: z.string().min(1).max(300),
  subtitle: z.string().max(1000).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  map_embed_url: z.string().max(2000).nullable().optional(),
  directions_url: z.string().max(2000).nullable().optional(),
  is_active: z.boolean().default(true),
});

export const getLocationAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const [{ data: settings }, { data: landmarks }] = await Promise.all([
      context.supabase.from("location_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      context.supabase.from("location_landmarks").select("*").order("sort_order", { ascending: true }),
    ]);
    return { settings: settings ?? null, landmarks: landmarks ?? [] };
  });

export const upsertLocationSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => locationSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      heading: data.heading, subtitle: data.subtitle ?? null, address: data.address ?? null,
      map_embed_url: data.map_embed_url ?? null, directions_url: data.directions_url ?? null,
      is_active: data.is_active,
    };
    if (data.id) {
      const { error } = await context.supabase.from("location_settings").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("location_settings").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

/* ---------- Landmarks ---------- */
const landmarkSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(200),
  travel_time: z.string().max(50).nullable().optional(),
  icon_key: z.string().max(50).default("MapPin"),
  sort_order: z.number().int().min(0).max(9999),
});

export const upsertLandmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => landmarkSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = { label: data.label, travel_time: data.travel_time ?? null, icon_key: data.icon_key, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("location_landmarks").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("location_landmarks").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteLandmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("location_landmarks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- FAQs ---------- */
const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(3000),
  sort_order: z.number().int().min(0).max(9999),
});

export const listFaqsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => faqSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = { question: data.question, answer: data.answer, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("faqs").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("faqs").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Leads ---------- */
export const listLeadsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase
      .from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Site Settings ---------- */
const siteSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  brand_name: z.string().min(1).max(200),
  brand_code: z.string().max(100).default(""),
  developer: z.string().max(200).default(""),
  partner: z.string().max(200).default(""),
  location: z.string().max(200).default(""),
  rera: z.string().max(200).default(""),
  phone: z.string().max(50).default(""),
  whatsapp: z.string().max(50).default(""),
  email: z.string().max(200).default(""),
  whatsapp_message: z.string().max(500).default(""),
});

export const getSiteSettingsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase
      .from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
  });

export const upsertSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => siteSettingsSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      brand_name: data.brand_name, brand_code: data.brand_code, developer: data.developer,
      partner: data.partner, location: data.location, rera: data.rera,
      phone: data.phone, whatsapp: data.whatsapp, email: data.email,
      whatsapp_message: data.whatsapp_message,
    };
    if (data.id) {
      const { error } = await context.supabase.from("site_settings").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase.from("site_settings").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });
