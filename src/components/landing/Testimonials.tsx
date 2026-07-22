import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Quote, Star, Play } from "lucide-react";
import { getPublicTestimonials } from "@/lib/cms.functions";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  provider: string;
  video_url: string | null;
  video_signed_url: string | null;
  image_url: string | null;
};

const FALLBACK: Testimonial[] = [
  { id: "f1", name: "Rohit & Sneha Deshmukh", role: "Home Buyer · 3 BHK", quote: "Booking was smooth and the site visit was very professional. The Ileseum Club is exactly what our family was looking for.", rating: 5, provider: "none", video_url: null, video_signed_url: null, image_url: null },
  { id: "f2", name: "Ananya Sharma", role: "Investor · Kharadi", quote: "The location, RERA clarity and pre-launch pricing made this an easy decision. Sales team responded within minutes.", rating: 5, provider: "none", video_url: null, video_signed_url: null, image_url: null },
  { id: "f3", name: "Rajesh Iyer", role: "Home Buyer · 4 BHK", quote: "Beautiful green towers and thoughtful floor plans. Cross-ventilation and sky gardens truly stand out.", rating: 5, provider: "none", video_url: null, video_signed_url: null, image_url: null },
  { id: "f4", name: "Priya & Kunal Mehta", role: "First-Time Buyers", quote: "Loved the transparency on price and possession. Everything promised on the visit matched the brochure.", rating: 5, provider: "none", video_url: null, video_signed_url: null, image_url: null },
];

function toEmbed(url: string, provider: string): string {
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

export function TestimonialsSection() {
  const fetchFn = useServerFn(getPublicTestimonials);
  const { data } = useQuery({ queryKey: ["public", "testimonials"], queryFn: () => fetchFn(), staleTime: 60_000 });
  const items: Testimonial[] = (data?.items && data.items.length > 0) ? data.items : FALLBACK;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [dragDx, setDragDx] = useState(0);
  const count = items.length;
  const dragging = startX !== null;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 2000);
    return () => clearInterval(id);
  }, [paused, count]);

  const onStart = (x: number) => { setStartX(x); setDragDx(0); setPaused(true); };
  const onMove = (x: number) => { if (startX === null) return; setDragDx(x - startX); };
  const onEnd = () => {
    if (startX !== null) {
      const threshold = 50;
      if (dragDx > threshold) setIndex((i) => (i - 1 + count) % count);
      else if (dragDx < -threshold) setIndex((i) => (i + 1) % count);
    }
    setStartX(null); setDragDx(0); setPaused(false);
  };

  return (
    <section id="testimonials" className="bg-white py-14 md:py-20">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Testimonials</p>
          <h2 className="font-serif text-3xl leading-tight text-navy md:text-5xl">
            Loved by <span className="text-gold italic">Pune families.</span>
          </h2>
          <p className="mt-4 text-ink-soft">Honest words from happy home buyers and investors.</p>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-3xl touch-pan-y select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { if (dragging) onEnd(); else setPaused(false); }}
          onMouseDown={(e) => onStart(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onEnd}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
        >
          <div className="overflow-hidden rounded-3xl border border-line bg-[var(--mist)] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:p-10">
            <div
              className="flex"
              style={{
                transform: `translateX(calc(-${index * 100}% + ${dragDx}px))`,
                transition: dragging ? "none" : "transform 600ms ease",
              }}
            >
              {items.map((t) => {
                const hasVideo =
                  (t.provider === "upload" && t.video_signed_url) ||
                  ((t.provider === "youtube" || t.provider === "vimeo") && t.video_url);
                return (
                  <div key={t.id} className="w-full shrink-0 px-1 text-center">
                    {hasVideo && (
                      <div className="mx-auto mb-6 max-w-lg overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/10">
                        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                          {t.provider === "upload" && t.video_signed_url ? (
                            <video
                              src={t.video_signed_url}
                              controls
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-cover"
                            />
                          ) : t.video_url ? (
                            <iframe
                              src={toEmbed(t.video_url, t.provider)}
                              title={t.name}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 h-full w-full"
                            />
                          ) : null}
                        </div>
                      </div>
                    )}
                    {!hasVideo && <Quote className="mx-auto h-8 w-8 text-gold" />}
                    <p className="mt-5 font-serif text-lg leading-relaxed text-navy md:text-xl">
                      "{t.quote}"
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-1 text-gold">
                      {Array.from({ length: Math.max(0, Math.min(5, t.rating || 5)) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-3">
                      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-navy font-serif text-gold">
                        {t.image_url ? (
                          <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
                        ) : hasVideo ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          t.name.charAt(0)
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-navy">{t.name}</div>
                        {t.role && <div className="text-xs text-ink-soft">{t.role}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-[var(--red-cta)]" : "w-2 bg-navy/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
