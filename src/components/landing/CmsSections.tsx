import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles, Building2, ChevronLeft, ChevronRight, X, Navigation,
  ShoppingBag, Hospital, GraduationCap, Trees, MapPin, Phone, Calendar,
  Trophy, Star, ShieldCheck, Wifi, Waves, Dumbbell, Heart, Leaf, Users,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  getPublicAmenities, getPublicSpecifications, getPublicVideoSection,
  getPublicGallery, getPublicFloorPlans, getPublicLocation, getPublicFaqs,
} from "@/lib/cms.functions";
import { site } from "@/content/site";

const ICONS: Record<string, typeof MapPin> = {
  MapPin, Navigation, Building2, ShoppingBag, Hospital, GraduationCap, Trees,
  Phone, Calendar, Trophy, Star, ShieldCheck, Wifi, Waves, Dumbbell, Heart,
  Leaf, Users, Sparkles,
};

function SectionHead({ eyebrow, title, subtitle, dark = false }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`eyebrow mb-3 ${dark ? "text-gold" : ""}`}>{eyebrow}</p>
      <h2 className={`font-serif text-3xl md:text-5xl leading-tight ${dark ? "text-white" : "text-navy"}`}>{title}</h2>
      {subtitle && <p className={`mt-4 ${dark ? "text-white/70" : "text-ink-soft"}`}>{subtitle}</p>}
    </div>
  );
}

/* -------------------- AMENITIES -------------------- */
export function AmenitiesSection() {
  const fetchFn = useServerFn(getPublicAmenities);
  const { data } = useQuery({ queryKey: ["public", "amenities"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const items = data?.items ?? [];

  return (
    <section id="amenities" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead eyebrow="The Ileseum Club" title="Amenities of a private members' resort." subtitle={site.amenities.intro} />
        {items.length === 0 ? (
          <div className="mt-14 text-center text-ink-soft text-sm">Amenities coming soon.</div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((a) => (
              <div key={a.id} className="hover-lift group overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_-10px_rgba(11,42,91,0.15)]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#f0ebe3]">
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center text-navy/40"><Sparkles className="h-8 w-8" /></div>
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

/* -------------------- SPECIFICATIONS -------------------- */
export function SpecificationsSection() {
  const fetchFn = useServerFn(getPublicSpecifications);
  const { data } = useQuery({ queryKey: ["public", "specifications"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const items = data?.items ?? [];

  return (
    <section id="specifications" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Craftsmanship"
          title="Specifications, detailed to the finish."
          subtitle="Every material chosen with intent — from the front door hinge to the sky-garden trellis."
        />
        {items.length === 0 ? (
          <div className="mt-14 text-center text-ink-soft text-sm">Specifications coming soon.</div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <div key={s.id} className="hover-lift group overflow-hidden rounded-2xl border border-[#e8e4dd] bg-white">
                {s.image_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#f0ebe3]">
                    <img src={s.image_url} alt={s.group_name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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

/* -------------------- VIDEO -------------------- */
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
  } catch { return url; }
}

export function VideoSection() {
  const fetchFn = useServerFn(getPublicVideoSection);
  const { data } = useQuery({ queryKey: ["public", "video"], queryFn: () => fetchFn(), staleTime: 60_000 });
  if (!data) return null;

  return (
    <section id="video" className="bg-[#0B2A5B] py-20 md:py-28 text-white">
      <div className="container-luxe">
        <SectionHead eyebrow="Film" title={data.title} subtitle={data.subtitle ?? undefined} dark />
        <div className="mt-12 mx-auto max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          <div className="relative aspect-video w-full">
            {data.provider === "upload" && data.video_signed_url ? (
              <video src={data.video_signed_url} poster={data.poster_url ?? undefined} controls playsInline className="h-full w-full object-cover" />
            ) : data.video_url ? (
              <iframe src={toEmbed(data.video_url, data.provider as "youtube" | "vimeo")} title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                className="absolute inset-0 h-full w-full" />
            ) : (
              <div className="grid h-full place-items-center text-white/50">Video unavailable</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- GALLERY -------------------- */
export function GallerySection({ fallback }: { fallback: Array<{ src: string; alt: string; tall?: boolean }> }) {
  const fetchFn = useServerFn(getPublicGallery);
  const { data } = useQuery({ queryKey: ["public", "gallery"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const cmsItems = data?.items ?? [];
  const images = cmsItems.length > 0
    ? cmsItems.map((i) => ({ src: i.image_url ?? "", alt: i.title ?? "Gallery image", tall: i.aspect === "tall" }))
    : fallback;

  const [active, setActive] = useState<number | null>(null);
  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setActive((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead eyebrow="Gallery" title="A visual walk-through of Nova One."
          subtitle="Renderings, façades and sky gardens — the details that define the address." />
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.filter((i) => !!i.src).map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className="block w-full overflow-hidden rounded-2xl border border-line bg-mist">
              <img src={img.src} alt={img.alt} loading="lazy"
                className={`w-full object-cover transition duration-500 hover:scale-105 ${img.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
            </button>
          ))}
        </div>
      </div>

      {active !== null && images[active] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={close}>
          <button className="absolute right-6 top-6 text-white" onClick={close} aria-label="Close"><X className="h-7 w-7" /></button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous"><ChevronLeft className="h-6 w-6" /></button>
          <img src={images[active].src} alt={images[active].alt} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next"><ChevronRight className="h-6 w-6" /></button>
        </div>
      )}
    </section>
  );
}

/* -------------------- FLOOR PLANS -------------------- */
export function FloorPlansSection({ fallbackImage }: { fallbackImage: string }) {
  const fetchFn = useServerFn(getPublicFloorPlans);
  const { data } = useQuery({ queryKey: ["public", "floorplans"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const plans = data?.items ?? [];

  return (
    <section id="floor-plans" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead eyebrow="Floor Plans" title="Designed for the way you actually live."
          subtitle="Curated configurations — each intelligently spaced, cross-ventilated and sun-oriented." />
        {plans.length === 0 ? (
          <div className="mt-14 text-center text-ink-soft text-sm">Floor plans coming soon.</div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.id} className="hover-lift group overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-25px_rgba(11,42,91,0.25)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <img src={p.image_url ?? fallbackImage} alt={p.name} className="h-full w-full object-cover opacity-70 transition group-hover:scale-105" />
                  {p.is_limited && p.status && (
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--red-cta)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                      {p.status}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-serif text-2xl">{p.name}</div>
                    {p.tower && <div className="text-xs text-gold-soft">{p.tower}</div>}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink-soft">Carpet Area</div>
                      <div className="font-serif text-lg text-navy">{p.area ?? "—"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-ink-soft">Starting</div>
                      <div className="font-serif text-lg text-gold">{p.price ?? "—"}</div>
                    </div>
                  </div>
                  <a href="#contact">
                    <Button className="w-full rounded-full bg-navy text-white hover:bg-navy-deep">Request Detailed Plan</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------- LOCATION -------------------- */
export function LocationSection() {
  const fetchFn = useServerFn(getPublicLocation);
  const { data } = useQuery({ queryKey: ["public", "location"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const s = data?.settings;
  const landmarks = data?.landmarks ?? [];
  const directionsUrl = s?.directions_url || "https://www.google.com/maps/search/?api=1&query=Ganga+Legend+County+Pune";

  return (
    <section id="location" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Location"
          title={s?.heading || "Pune's most connected luxury address."}
          subtitle={s?.subtitle || "Everything that matters — 20 minutes or less."}
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-line lg:col-span-3">
            <iframe title="Nova One location"
              src={toMapsEmbed(s?.map_embed_url) || "https://www.google.com/maps?q=Kharadi+Pune&output=embed"}
              loading="lazy" className="h-[420px] w-full" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-line bg-mist p-6">
              <h3 className="font-serif text-2xl text-navy">Nearby Landmarks</h3>
              {s?.address && <p className="mt-1 text-xs text-ink-soft">{s.address}</p>}
              <div className="mt-6 space-y-4">
                {landmarks.map((n) => {
                  const Icon = ICONS[n.icon_key] ?? MapPin;
                  return (
                    <div key={n.id} className="flex items-center justify-between border-b border-line/70 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-navy text-gold"><Icon className="h-4 w-4" /></div>
                        <span className="text-sm text-ink">{n.label}</span>
                      </div>
                      {n.travel_time && <span className="text-sm font-semibold text-navy">{n.travel_time}</span>}
                    </div>
                  );
                })}
                {landmarks.length === 0 && <div className="text-sm text-ink-soft">Landmarks coming soon.</div>}
              </div>
              <a href={directionsUrl} target="_blank" rel="noreferrer">
                <Button className="mt-6 w-full rounded-full bg-gold text-navy hover:bg-gold-soft">
                  <Navigation className="mr-2 h-4 w-4" /> Get Directions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FAQ -------------------- */
export function FaqsSection() {
  const fetchFn = useServerFn(getPublicFaqs);
  const { data } = useQuery({ queryKey: ["public", "faqs"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead eyebrow="Questions" title="Everything you're wondering, answered." />
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-line bg-white p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {items.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left font-serif text-lg text-navy">{f.question}</AccordionTrigger>
                <AccordionContent className="text-ink-soft leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

// silence unused-import warning for useEffect if not needed
void useEffect;
