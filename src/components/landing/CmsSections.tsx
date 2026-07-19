import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import {
  getPublicAmenities,
  getPublicSpecifications,
  getPublicVideoSection,
} from "@/lib/cms.functions";
import { site } from "@/content/site";

/* -------------------- AMENITIES (CMS) -------------------- */
export function AmenitiesSection() {
  const fetchFn = useServerFn(getPublicAmenities);
  const { data } = useQuery({
    queryKey: ["public", "amenities"],
    queryFn: () => fetchFn(),
    staleTime: 60_000,
  });
  const items = data?.items ?? [];

  return (
    <section id="amenities" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">The Ileseum Club</p>
          <h2 className="font-serif text-3xl md:text-5xl text-navy leading-tight">
            Amenities of a private members' resort.
          </h2>
          <p className="mt-4 text-ink-soft">{site.amenities.intro}</p>
        </div>

        {items.length === 0 ? (
          <div className="mt-14 text-center text-ink-soft text-sm">Amenities coming soon.</div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((a) => (
              <div
                key={a.id}
                className="hover-lift group overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_-10px_rgba(11,42,91,0.15)]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#f0ebe3]">
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-navy/40">
                      <Sparkles className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <div className="font-serif text-lg text-navy">{a.title}</div>
                  {a.note && <div className="mt-1 text-xs text-ink-soft">{a.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------- SPECIFICATIONS (CMS) -------------------- */
export function SpecificationsSection() {
  const fetchFn = useServerFn(getPublicSpecifications);
  const { data } = useQuery({
    queryKey: ["public", "specifications"],
    queryFn: () => fetchFn(),
    staleTime: 60_000,
  });
  const items = data?.items ?? [];

  return (
    <section id="specifications" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Craftsmanship</p>
          <h2 className="font-serif text-3xl md:text-5xl text-navy leading-tight">
            Specifications, detailed to the finish.
          </h2>
          <p className="mt-4 text-ink-soft">
            Every material chosen with intent — from the front door hinge to the sky-garden trellis.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-14 text-center text-ink-soft text-sm">Specifications coming soon.</div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <div
                key={s.id}
                className="hover-lift group overflow-hidden rounded-2xl border border-[#e8e4dd] bg-white"
              >
                {s.image_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#f0ebe3]">
                    <img
                      src={s.image_url}
                      alt={s.group_name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="eyebrow mb-2">{s.group_name}</div>
                  <p className="text-sm text-ink leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------- VIDEO SECTION (CMS) -------------------- */
function toEmbed(url: string, provider: "youtube" | "vimeo"): string {
  try {
    const u = new URL(url);
    if (provider === "youtube") {
      if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (provider === "vimeo" && u.hostname.includes("vimeo.com") && !u.hostname.includes("player")) {
      return `https://player.vimeo.com${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

export function VideoSection() {
  const fetchFn = useServerFn(getPublicVideoSection);
  const { data } = useQuery({
    queryKey: ["public", "video"],
    queryFn: () => fetchFn(),
    staleTime: 60_000,
  });

  if (!data) return null;

  return (
    <section id="video" className="bg-[#0B2A5B] py-20 md:py-28 text-white">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3 text-gold">Film</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">{data.title}</h2>
          {data.subtitle && <p className="mt-4 text-white/70">{data.subtitle}</p>}
        </div>
        <div className="mt-12 mx-auto max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          <div className="relative aspect-video w-full">
            {data.provider === "upload" && data.video_signed_url ? (
              <video
                src={data.video_signed_url}
                poster={data.poster_url ?? undefined}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : data.video_url ? (
              <iframe
                src={toEmbed(data.video_url, data.provider as "youtube" | "vimeo")}
                title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="grid h-full place-items-center text-white/50">Video unavailable</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
