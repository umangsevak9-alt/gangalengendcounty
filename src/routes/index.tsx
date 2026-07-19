import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Film,
  Flower2,
  GraduationCap,
  Heart,
  Hospital,
  Leaf,
  MapPin,
  Navigation,
  Palette,
  Phone,
  PhoneCall,
  Play,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trees,
  Trophy,
  Users,
  Waves,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/content/site";
import {
  AmenitiesSection as CmsAmenities,
  SpecificationsSection as CmsSpecifications,
  VideoSection as CmsVideo,
  GallerySection as CmsGallery,
  FloorPlansSection as CmsFloorPlans,
  LocationSection as CmsLocation,
  FaqsSection as CmsFaqs,
} from "@/components/landing/CmsSections";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/cms.functions";
import heroAsset from "@/assets/tower-hero.jpeg.asset.json";
import facadeAsset from "@/assets/tower-facade.jpeg.asset.json";
import skylineAsset from "@/assets/tower-skyline.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova One · Ganga Legend County — Luxury Residences in Pune" },
      {
        name: "description",
        content:
          "Live the future. Own the lifestyle. 4 philosophically-inspired luxury towers in Pune with the Ileseum Club, pre-launch pricing, and priority selection.",
      },
      { property: "og:image", content: heroAsset.url },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const WHATSAPP_URL = `https://wa.me/${site.brand.whatsapp}?text=${encodeURIComponent(
  "Hi, I'm interested in Nova One at Ganga Legend County.",
)}`;
const CALL_URL = `tel:${site.brand.phone.replace(/\s+/g, "")}`;
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Ganga+Legend+County+Pune";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <Hero />
      <WhyChooseUs />
      <CmsAmenities />
      <CmsVideo />
      <Gallery />
      <FloorPlans />
      <CmsSpecifications />
      <Location />
      <TrustBand />
      <OfferBanner />
      <Testimonials />
      <ContactForm />
      <FloatingRail />
      <Popups />
      <MiniFooter />
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      <img
        src={heroAsset.url}
        alt="Nova One luxury towers"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A5B]/85 via-[#0B2A5B]/70 to-[#071c40]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,rgba(212,175,55,0.18),transparent_70%)]" />

      {/* Top brand line (no header per brief, but a light brand line for identity) */}
      <div className="relative z-10">
        <div className="container-luxe flex items-center justify-between py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/70 text-gold font-serif text-lg">
              N
            </div>
            <div className="leading-tight">
              <div className="eyebrow text-gold">{site.brand.code}</div>
              <div className="text-sm font-medium">{site.brand.name}</div>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full border border-white/25 px-3 py-1 text-[11px] uppercase tracking-widest">
              {site.brand.rera}
            </span>
            <a
              href={CALL_URL}
              className="rounded-full border border-gold/60 px-4 py-2 text-sm text-gold hover:bg-gold hover:text-navy transition"
            >
              {site.brand.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-luxe relative z-10 flex min-h-[calc(100svh-96px)] flex-col justify-center py-10 text-white">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              Pre-Launch · Pune
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Live the <span className="text-gold italic">Future.</span>
            <br />
            Own the <span className="text-gold italic">Lifestyle.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Four philosophically-inspired luxury towers rising in green harmony —
            a rare Pune address where architecture, wellness and intention meet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact">
              <Button
                size="lg"
                className="rounded-full bg-[var(--red-cta)] px-7 text-white hover:bg-[#a91f1f] shadow-[0_10px_30px_-10px_rgba(198,40,40,0.6)]"
              >
                Book Free Site Visit
              </Button>
            </a>
            <a href={CALL_URL}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/5 px-7 text-white hover:bg-white hover:text-navy"
              >
                <PhoneCall className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/5 px-7 text-white hover:bg-white hover:text-navy"
              >
                WhatsApp
              </Button>
            </a>
            <a href="#gallery">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full px-6 text-gold hover:bg-gold/10 hover:text-gold"
              >
                <Play className="mr-2 h-4 w-4" /> Virtual Tour
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
            {[
              { n: "25+", l: "Acres" },
              { n: "1,200", l: "Families" },
              { n: "40+", l: "Amenities" },
              { n: "RERA", l: "Approved" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl text-gold md:text-4xl">{s.n}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/70">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- WHY CHOOSE US -------------------- */
function WhyChooseUs() {
  const items = [
    { icon: ShieldCheck, title: "RERA Approved Trust", desc: "Fully registered with transparent milestones and legal clarity." },
    { icon: Trophy, title: "Award-Winning Developer", desc: "Goel Ganga Corp × Unicon Group — 40+ years of delivery." },
    { icon: Leaf, title: "IGBC Platinum Target", desc: "Living façades, greywater reuse, solar-assisted utilities." },
    { icon: Sparkles, title: "Ileseum Signature Club", desc: "Michael Phelps pool, private cinema, wellness pavilion." },
    { icon: Building2, title: "Earthquake-Safe Design", desc: "RCC framed structure, seismic-zone III+ compliant." },
    { icon: Zap, title: "Smart-Home Ready", desc: "Automation, EV parking, fibre and app-based access." },
  ];
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Why Nova One"
          title="A rare address, engineered for the aspirational."
          subtitle="Six reasons why India's discerning families are choosing Nova One before the world does."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="hover-lift group rounded-2xl border border-line bg-white p-8"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold ring-1 ring-gold/40">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl text-navy">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- AMENITIES -------------------- */
function Amenities() {
  const icons = [Waves, Flower2, Dumbbell, Film, Palette, Trophy, Wifi, Heart];
  return (
    <section id="amenities" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="The Ileseum Club"
          title="Amenities of a private members' resort."
          subtitle={site.amenities.intro}
          center
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {site.amenities.items.slice(0, 8).map((a, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={a.title}
                className="hover-lift rounded-2xl bg-white p-6 text-center shadow-[0_2px_20px_-10px_rgba(11,42,91,0.15)]"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-navy text-gold">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-serif text-lg text-navy">{a.title}</div>
                <div className="mt-1 text-xs text-ink-soft">{a.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- GALLERY -------------------- */
function Gallery() {
  const images = [
    { src: heroAsset.url, alt: "Nova One tower", tall: true },
    { src: facadeAsset.url, alt: "Vertical garden facade" },
    { src: skylineAsset.url, alt: "Sky garden at sunset", tall: true },
    { src: facadeAsset.url, alt: "Facade detail" },
    { src: heroAsset.url, alt: "Tower view" },
    { src: skylineAsset.url, alt: "Panoramic view" },
  ];
  const [active, setActive] = useState<number | null>(null);
  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setActive((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Gallery"
          title="A visual walk-through of Nova One."
          subtitle="Renderings, façades and sky gardens — the details that define the address."
        />
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="block w-full overflow-hidden rounded-2xl border border-line bg-mist"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`w-full object-cover transition duration-500 hover:scale-105 ${img.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={close}>
          <button className="absolute right-6 top-6 text-white" onClick={close} aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={images[active].src}
            alt={images[active].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}

/* -------------------- FLOOR PLANS -------------------- */
function FloorPlans() {
  const plans = [
    { name: "2 BHK Refined", area: "1,180 sq.ft.", price: "₹1.35 Cr onwards", tower: "Aarambh · Udaan", status: "Available" },
    { name: "3 BHK Signature", area: "1,720 sq.ft.", price: "₹1.95 Cr onwards", tower: "Samarasya", status: "Filling Fast", limited: true },
    { name: "4 BHK Sky Suite", area: "2,640 sq.ft.", price: "₹3.10 Cr onwards", tower: "Jeevanam", status: "Limited Units", limited: true },
  ];
  return (
    <section id="floor-plans" className="bg-[var(--mist)] py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Floor Plans"
          title="Designed for the way you actually live."
          subtitle="Three curated configurations — each intelligently spaced, cross-ventilated and sun-oriented."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className="hover-lift group overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-25px_rgba(11,42,91,0.25)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <img src={facadeAsset.url} alt={p.name} className="h-full w-full object-cover opacity-60 transition group-hover:scale-105" />
                {p.limited && (
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--red-cta)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                    {p.status}
                  </span>
                )}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="font-serif text-2xl">{p.name}</div>
                  <div className="text-xs text-gold-soft">{p.tower}</div>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-soft">Carpet Area</div>
                    <div className="font-serif text-lg text-navy">{p.area}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-ink-soft">Starting</div>
                    <div className="font-serif text-lg text-gold">{p.price}</div>
                  </div>
                </div>
                <a href="#contact">
                  <Button className="w-full rounded-full bg-navy text-white hover:bg-navy-deep">
                    Request Detailed Plan
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- LOCATION -------------------- */
function Location() {
  const nearby = [
    { icon: Navigation, label: "Pune Airport", time: "22 min" },
    { icon: Building2, label: "Kharadi IT Park", time: "10 min" },
    { icon: ShoppingBag, label: "Amanora Mall", time: "8 min" },
    { icon: Hospital, label: "Ruby Hall Clinic", time: "15 min" },
    { icon: GraduationCap, label: "Symbiosis School", time: "6 min" },
    { icon: Trees, label: "Central Park", time: "5 min" },
  ];
  return (
    <section id="location" className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Location"
          title="Pune's most connected luxury address."
          subtitle="Everything that matters — work, schools, healthcare, retail — is 20 minutes or less."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-line lg:col-span-3">
            <iframe
              title="Nova One location"
              src="https://www.google.com/maps?q=Kharadi+Pune&output=embed"
              loading="lazy"
              className="h-[420px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-line bg-mist p-6">
              <h3 className="font-serif text-2xl text-navy">Nearby Landmarks</h3>
              <div className="mt-6 space-y-4">
                {nearby.map((n) => (
                  <div key={n.label} className="flex items-center justify-between border-b border-line/70 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-navy text-gold">
                        <n.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-ink">{n.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-navy">{n.time}</span>
                  </div>
                ))}
              </div>
              <a href={MAPS_URL} target="_blank" rel="noreferrer">
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

/* -------------------- TRUST BAND -------------------- */
function TrustBand() {
  const items = [
    { icon: ShieldCheck, k: "RERA", v: "Approved" },
    { icon: Leaf, k: "IGBC", v: "Platinum Target" },
    { icon: Trophy, k: "40+ Years", v: "Legacy" },
    { icon: Users, k: "12,000+", v: "Happy Families" },
    { icon: Award, k: "50+", v: "Design Awards" },
    { icon: Building2, k: "35M sq.ft.", v: "Delivered" },
  ];
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(212,175,55,0.15),transparent_60%)]" />
      <div className="container-luxe relative">
        <div className="text-center">
          <span className="eyebrow text-gold">Built on Trust</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Numbers that speak louder than words.</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold" />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {items.map((it) => (
            <div key={it.k} className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                <it.icon className="h-6 w-6" />
              </div>
              <div className="font-serif text-2xl text-gold">{it.k}</div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-white/70">{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- OFFER BANNER -------------------- */
function OfferBanner() {
  return (
    <section className="bg-[var(--mist)] py-20 md:py-24">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_20px_60px_-30px_rgba(11,42,91,0.35)] md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(212,175,55,0.12),transparent_60%)]" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--red-cta)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--red-cta)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--red-cta)]" />
                Limited Pre-Launch Offer
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-navy md:text-5xl">
                Save <span className="text-gold">₹5+ Lakhs</span> today,
                plus complimentary parking.
              </h2>
              <div className="my-6 h-px w-16 bg-gold" />
              <p className="max-w-xl text-ink-soft">
                Only for the first 100 patrons — founder pricing, priority unit
                selection, and the Ileseum Founding Membership.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#contact">
                  <Button size="lg" className="rounded-full bg-[var(--red-cta)] px-8 text-white hover:bg-[#a91f1f]">
                    Book Site Visit
                  </Button>
                </a>
                <a href={CALL_URL}>
                  <Button size="lg" variant="outline" className="rounded-full border-navy text-navy hover:bg-navy hover:text-white">
                    <Phone className="mr-2 h-4 w-4" /> {site.brand.phone}
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-navy p-8 text-white">
              <div className="eyebrow text-gold">Offer expires in</div>
              <Countdown />
              <div className="mt-6 space-y-3 text-sm">
                {[
                  "Save ₹5+ Lakhs off launch card",
                  "Complimentary covered parking",
                  "20:40:40 flexible payment plan",
                  "Ileseum Founding Membership",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-navy">
                      <Star className="h-3 w-3 fill-current" />
                    </span>
                    <span className="text-white/90">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const [t, setT] = useState({ d: 12, h: 8, m: 42, s: 30 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let s = p.s - 1;
        let m = p.m;
        let h = p.h;
        let d = p.d;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return p;
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const cell = (n: number, l: string) => (
    <div className="flex-1 rounded-lg bg-white/10 p-3 text-center">
      <div className="font-serif text-2xl text-gold">{String(n).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-widest text-white/70">{l}</div>
    </div>
  );
  return (
    <div className="mt-3 flex gap-2">
      {cell(t.d, "Days")}{cell(t.h, "Hrs")}{cell(t.m, "Min")}{cell(t.s, "Sec")}
    </div>
  );
}

/* -------------------- TESTIMONIALS -------------------- */
function Testimonials() {
  const items = [
    { name: "Rohit & Meera Sharma", role: "Kharadi", quote: "Nova One felt considered from the first walk-through. The Ileseum Club sealed it for our family.", initials: "RS" },
    { name: "Dr. Anjali Deshmukh", role: "Endocrinologist", quote: "As a doctor I looked for air, water and light quality first. Jeevanam tower delivers on every front.", initials: "AD" },
    { name: "Kunal Iyer", role: "Founder, TechScale", quote: "The pre-launch pricing plus the smart-home spec sheet is genuinely rare in this micro-market.", initials: "KI" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-luxe">
        <SectionHead
          eyebrow="Testimonials"
          title="Loved by Pune's discerning families."
          center
        />
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-mist p-8 md:p-14">
            <div className="absolute right-6 top-6 font-serif text-8xl leading-none text-gold/20">"</div>
            <div className="relative">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-6 font-serif text-xl leading-relaxed text-navy md:text-2xl">
                "{items[i].quote}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-navy font-serif text-gold">
                  {items[i].initials}
                </div>
                <div>
                  <div className="font-semibold text-navy">{items[i].name}</div>
                  <div className="text-xs uppercase tracking-widest text-ink-soft">{items[i].role}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${i === k ? "w-10 bg-gold" : "w-2 bg-line"}`}
                aria-label={`Slide ${k + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- CONTACT FORM -------------------- */
function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", property: "3 BHK Signature", message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Please share your name and phone.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.phone)) return toast.error("Please enter a valid phone number.");
    setBusy(true);
    setTimeout(() => {
      const leads = JSON.parse(localStorage.getItem("novaone_leads") || "[]");
      leads.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("novaone_leads", JSON.stringify(leads));
      setBusy(false);
      setShowThanks(true);
      setForm({ name: "", phone: "", email: "", property: "3 BHK Signature", message: "" });
    }, 700);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--mist)] py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(11,42,91,0.06),transparent_60%)]" />
      <div className="container-luxe relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Reserve Your Home</span>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy md:text-5xl">
              Speak with a Nova One <span className="text-gold italic">advisor.</span>
            </h2>
            <div className="my-5 h-px w-16 bg-gold" />
            <p className="max-w-lg text-ink-soft">
              Share your details and a senior residence advisor will call within 30 minutes with pricing, floor plans, and a private site-visit slot.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: PhoneCall, label: site.brand.phone, sub: "Speak to an advisor" },
                { icon: MapPin, label: site.brand.location, sub: "Sales gallery — Kharadi" },
                { icon: Calendar, label: "10 AM – 7 PM · All days", sub: "Site-visit hours" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-navy">{c.label}</div>
                    <div className="text-xs text-ink-soft">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={submit}
            className="glass-card relative rounded-3xl p-8 shadow-[0_30px_80px_-40px_rgba(11,42,91,0.4)] md:p-10"
          >
            <div className="absolute -top-4 left-8 rounded-full bg-[var(--red-cta)] px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              Priority Response
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-2 h-12 rounded-xl" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" className="mt-2 h-12 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-2 h-12 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>Interested In</Label>
                <Select value={form.property} onValueChange={(v) => setForm({ ...form, property: v })}>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 BHK Refined">2 BHK Refined</SelectItem>
                    <SelectItem value="3 BHK Signature">3 BHK Signature</SelectItem>
                    <SelectItem value="4 BHK Sky Suite">4 BHK Sky Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Optional — any specific questions?" className="mt-2 min-h-[90px] rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#a91f1f]">
                {busy ? "Sending…" : "Book Free Site Visit"}
              </Button>
              <p className="text-center text-[11px] text-ink-soft">
                By submitting you agree to be contacted regarding Nova One.
              </p>
            </div>
          </form>
        </div>
      </div>

      {showThanks && <ThanksPopup onClose={() => setShowThanks(false)} />}
    </section>
  );
}

/* -------------------- FLOATING RAIL -------------------- */
function FloatingRail() {
  const btns = [
    { href: WHATSAPP_URL, label: "WhatsApp", bg: "#25D366", icon: "M" },
    { href: CALL_URL, label: "Call", bg: "#C62828", icon: <Phone className="h-5 w-5" /> },
    { href: "#contact", label: "Site Visit", bg: "#154EA8", icon: <Calendar className="h-5 w-5" /> },
    { href: MAPS_URL, label: "Directions", bg: "#D4AF37", icon: <Navigation className="h-5 w-5" /> },
  ];
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {btns.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target={b.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-lg transition hover:scale-110"
          style={{ backgroundColor: b.bg }}
          aria-label={b.label}
        >
          {typeof b.icon === "string" ? (
            <span className="font-serif text-lg">W</span>
          ) : (
            b.icon
          )}
          <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-navy px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
            {b.label}
          </span>
        </a>
      ))}
    </div>
  );
}

/* -------------------- POPUPS -------------------- */
function Popups() {
  const [welcome, setWelcome] = useState(false);
  const [exit, setExit] = useState(false);
  const [shownExit, setShownExit] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("novaone_welcome")) return;
    const t = setTimeout(() => {
      setWelcome(true);
      sessionStorage.setItem("novaone_welcome", "1");
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !shownExit && !sessionStorage.getItem("novaone_exit")) {
        setExit(true);
        setShownExit(true);
        sessionStorage.setItem("novaone_exit", "1");
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [shownExit]);

  return (
    <>
      {welcome && <WelcomePopup onClose={() => setWelcome(false)} />}
      {exit && <ExitPopup onClose={() => setExit(false)} />}
    </>
  );
}

function PopupShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute right-4 top-4 z-10 rounded-full bg-white p-1 text-ink-soft hover:text-navy" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function WelcomePopup({ onClose }: { onClose: () => void }) {
  return (
    <PopupShell onClose={onClose}>
      <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${heroAsset.url})` }}>
        <div className="h-full w-full bg-gradient-to-b from-navy/30 to-navy/80 p-6 text-white">
          <span className="eyebrow text-gold">Welcome to Nova One</span>
        </div>
      </div>
      <div className="p-8 text-center">
        <h3 className="font-serif text-2xl text-navy">Save ₹5+ Lakhs today</h3>
        <p className="mt-2 text-sm text-ink-soft">Founder pricing for the first 100 patrons — locked below public launch.</p>
        <a href="#contact"><Button onClick={onClose} className="mt-6 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#a91f1f]">Claim Pre-Launch Offer</Button></a>
      </div>
    </PopupShell>
  );
}

function ExitPopup({ onClose }: { onClose: () => void }) {
  return (
    <PopupShell onClose={onClose}>
      <div className="bg-navy p-8 text-center text-white">
        <span className="eyebrow text-gold">Wait — one moment</span>
        <h3 className="mt-3 font-serif text-2xl">Take the brochure with you.</h3>
        <p className="mt-2 text-sm text-white/70">Floor plans, pricing and amenities — delivered to WhatsApp in 30 seconds.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          <Button onClick={onClose} className="mt-6 w-full rounded-full bg-gold text-navy hover:bg-gold-soft">
            Get Brochure on WhatsApp
          </Button>
        </a>
      </div>
    </PopupShell>
  );
}

function ThanksPopup({ onClose }: { onClose: () => void }) {
  return (
    <PopupShell onClose={onClose}>
      <div className="p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy text-gold">
          <Star className="h-7 w-7 fill-current" />
        </div>
        <h3 className="mt-6 font-serif text-2xl text-navy">Thank you.</h3>
        <p className="mt-2 text-sm text-ink-soft">A senior residence advisor will reach out within 30 minutes.</p>
        <Button onClick={onClose} className="mt-6 w-full rounded-full bg-navy text-white hover:bg-navy-deep">
          Continue Exploring
        </Button>
      </div>
    </PopupShell>
  );
}

/* -------------------- MINI FOOTER (brand line only) -------------------- */
function MiniFooter() {
  return (
    <div className="border-t border-line bg-white py-6 text-center text-xs text-ink-soft">
      © {new Date().getFullYear()} {site.brand.developer} × {site.brand.partner} · {site.brand.rera}
    </div>
  );
}

/* -------------------- SectionHead -------------------- */
function SectionHead({
  eyebrow, title, subtitle, center = false,
}: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-navy md:text-5xl">{title}</h2>
      <div className={`mt-4 h-px w-16 bg-gold ${center ? "mx-auto" : ""}`} />
      {subtitle && <p className="mt-5 text-base leading-relaxed text-ink-soft">{subtitle}</p>}
    </div>
  );
}
