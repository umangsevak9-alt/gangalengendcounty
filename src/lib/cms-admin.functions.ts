import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertEditor(context: { supabase: ReturnType<typeof requireSupabaseAuth extends never ? never : any>; userId: string }) {
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
      .from("amenities")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertAmenity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => amenitySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      title: data.title,
      note: data.note ?? null,
      image_path: data.image_path ?? null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("amenities").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("amenities").insert(row).select("id").single();
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
    const { data, error } = await context.supabase
      .from("specifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertSpecification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => specSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      group_name: data.group_name,
      detail: data.detail,
      image_path: data.image_path ?? null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("specifications").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("specifications").insert(row).select("id").single();
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

/* ---------- Video Section ---------- */
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
    const { data, error } = await context.supabase
      .from("video_section")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertVideoSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => videoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const row = {
      title: data.title,
      subtitle: data.subtitle ?? null,
      provider: data.provider,
      video_url: data.video_url ?? null,
      video_path: data.video_path ?? null,
      poster_path: data.poster_path ?? null,
      is_active: data.is_active,
    };
    if (data.id) {
      const { error } = await context.supabase.from("video_section").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("video_section").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return inserted;
  });
