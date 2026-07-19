import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
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
