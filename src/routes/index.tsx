import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Play,
  Star,
  X,
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
      { title: "Nova One · Ganga Legend County — Premium Homes in Pune" },
      {
        name: "description",
        content:
          "Premium 2, 3 & 4 BHK homes in Pune. Four towers, world-class club, pre-launch price. Save ₹5+ Lakhs — book your site visit today.",
      },
      { property: "og:image", content: heroAsset.url },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const WHATSAPP_URL = `https://wa.me/${site.brand.whatsapp}?text=${encodeURIComponent(
  "Hi, I am interested in Nova One at Ganga Legend County. Please share details.",
)}`;
const CALL_URL = `tel:${site.brand.phone.replace(/\s+/g, "")}`;
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Ganga+Legend+County+Pune";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <Hero />
      <CmsAmenities />
      <CmsVideo />
      <CmsGallery fallback={[
        { src: heroAsset.url, alt: "Nova One tower", tall: true },
        { src: facadeAsset.url, alt: "Green facade" },
        { src: skylineAsset.url, alt: "Sky garden", tall: true },
        { src: facadeAsset.url, alt: "Facade" },
        { src: heroAsset.url, alt: "Tower view" },
        { src: skylineAsset.url, alt: "Panoramic view" },
      ]} />
      <CmsFloorPlans fallbackImage={facadeAsset.url} />
      <CmsSpecifications />
      <CmsLocation />
      <ContactForm />
      <CmsFaqs />
      <FloatingRail />
      <Popups />
      <MiniFooter />
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  return (
    <section className="relative isolate min-h-[80svh] w-full overflow-hidden">
      <img
        src={heroAsset.url}
        alt="Nova One premium towers in Pune"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A5B]/85 via-[#0B2A5B]/70 to-[#071c40]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,rgba(212,175,55,0.18),transparent_70%)]" />

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

      <div className="container-luxe relative z-10 flex min-h-[calc(80svh-96px)] flex-col justify-center py-8 text-white">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              Pre-Launch · Pune
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Your Dream <span className="text-gold italic">Home</span>
            <br />
            Awaits in <span className="text-gold italic">Pune.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Four premium towers with green gardens, world-class club, and
            modern homes — made for Indian families who want the best.
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
                className="rounded-full bg-green-600 px-7 text-white hover:bg-green-700 shadow-[0_10px_30px_-10px_rgba(22,163,74,0.6)]"
              >
                <PhoneCall className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <Button
                size="lg"
                className="rounded-full bg-[#25D366] px-7 text-white hover:bg-[#1faa52] shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)]"
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
                <Play className="mr-2 h-4 w-4" /> See Photos
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.24em] text-white/70">
            <span><span className="text-gold font-serif text-base normal-case tracking-normal">25+</span> Acres</span>
            <span><span className="text-gold font-serif text-base normal-case tracking-normal">1,200</span> Families</span>
            <span><span className="text-gold font-serif text-base normal-case tracking-normal">40+</span> Amenities</span>
            <span className="text-gold">RERA Approved</span>
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
    name: "", phone: "", email: "", property: "3 BHK", message: "",
  });
  const send = useServerFn(submitLead);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Please enter your name and phone number.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.phone)) return toast.error("Please enter a valid phone number.");
    setBusy(true);
    try {
      await send({ data: {
        name: form.name, phone: form.phone, email: form.email,
        property_interest: form.property, message: form.message, source: "contact_form",
      } });
      setShowThanks(true);
      setForm({ name: "", phone: "", email: "", property: "3 BHK", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--mist)] py-12 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(11,42,91,0.06),transparent_60%)]" />
      <div className="container-luxe relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Talk to Us</span>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-navy md:text-5xl">
              Book your <span className="text-gold italic">free site visit.</span>
            </h2>
            <div className="my-5 h-px w-16 bg-gold" />
            <p className="max-w-lg text-ink-soft">
              Fill this simple form. Our sales team will call you within 30
              minutes with full price list, floor plans and site visit time.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: PhoneCall, label: site.brand.phone, sub: "Talk to our sales team" },
                { icon: MapPin, label: site.brand.location, sub: "Site office — Kharadi, Pune" },
                { icon: Calendar, label: "10 AM to 7 PM · All days", sub: "Site visit timings" },
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
              Priority Reply
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-2 h-12 rounded-xl" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" className="mt-2 h-12 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-2 h-12 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>I am looking for</Label>
                <Select value={form.property} onValueChange={(v) => setForm({ ...form, property: v })}>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 BHK">2 BHK</SelectItem>
                    <SelectItem value="3 BHK">3 BHK</SelectItem>
                    <SelectItem value="4 BHK">4 BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="msg">Message (optional)</Label>
                <Textarea id="msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any question?" className="mt-2 min-h-[90px] rounded-xl" />
              </div>
              <Button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#a91f1f]">
                {busy ? "Sending…" : "Book Free Site Visit"}
              </Button>
              <p className="text-center text-[11px] text-ink-soft">
                By submitting, you agree to be contacted about Nova One.
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
    { href: WHATSAPP_URL, label: "WhatsApp", bg: "#25D366", icon: "W" as const },
    { href: CALL_URL, label: "Call", bg: "#16A34A", icon: <Phone className="h-5 w-5" /> },
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
const WELCOME_DELAY_MS = 15000; // show welcome popup after 15 seconds

function Popups() {
  const [welcome, setWelcome] = useState(false);
  const [exit, setExit] = useState(false);
  const [shownExit, setShownExit] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("novaone_welcome")) return;
    const t = setTimeout(() => {
      setWelcome(true);
      sessionStorage.setItem("novaone_welcome", "1");
    }, WELCOME_DELAY_MS);
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
        <p className="mt-2 text-sm text-ink-soft">Special pre-launch price. Only for first 100 bookings. Hurry!</p>
        <a href="#contact"><Button onClick={onClose} className="mt-6 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#a91f1f]">Book Site Visit</Button></a>
      </div>
    </PopupShell>
  );
}

function ExitPopup({ onClose }: { onClose: () => void }) {
  return (
    <PopupShell onClose={onClose}>
      <div className="bg-navy p-8 text-center text-white">
        <span className="eyebrow text-gold">Wait — one minute</span>
        <h3 className="mt-3 font-serif text-2xl">Take our brochure with you.</h3>
        <p className="mt-2 text-sm text-white/70">Get full price list, floor plans and photos on WhatsApp in 30 seconds.</p>
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
        <h3 className="mt-6 font-serif text-2xl text-navy">Thank you!</h3>
        <p className="mt-2 text-sm text-ink-soft">Our sales team will call you within 30 minutes.</p>
        <Button onClick={onClose} className="mt-6 w-full rounded-full bg-navy text-white hover:bg-navy-deep">
          Continue Browsing
        </Button>
      </div>
    </PopupShell>
  );
}

function MiniFooter() {
  return (
    <div className="border-t border-line bg-white py-6 text-center text-xs text-ink-soft">
      © {new Date().getFullYear()} {site.brand.developer} × {site.brand.partner} · {site.brand.rera}
    </div>
  );
}
