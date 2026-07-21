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
import { useQuery } from "@tanstack/react-query";
import { submitLead, getPublicSiteSettings } from "@/lib/cms.functions";
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

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Ganga+Legend+County+Pune";

function useBrand() {
  const fetchSettings = useServerFn(getPublicSiteSettings);
  const { data } = useQuery({
    queryKey: ["public", "site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60 * 1000,
  });
  const brand = {
    name: data?.brand_name || site.brand.name,
    code: data?.brand_code || site.brand.code,
    developer: data?.developer || site.brand.developer,
    partner: data?.partner || site.brand.partner,
    location: data?.location || site.brand.location,
    rera: data?.rera || site.brand.rera,
    phone: data?.phone || site.brand.phone,
    whatsapp: data?.whatsapp || site.brand.whatsapp,
    email: data?.email || site.brand.email,
    whatsappMessage:
      data?.whatsapp_message ||
      "Hi, I am interested in Nova One at Ganga Legend County. Please share details.",
  };

  const whatsappUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(brand.whatsappMessage)}`;
  const callUrl = `tel:${brand.phone.replace(/\s+/g, "")}`;
  return { brand, whatsappUrl, callUrl };
}


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
      <MobileActionBar />
      <Popups />
      <MiniFooter />
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  const { brand, whatsappUrl, callUrl } = useBrand();
  return (
    <section className="relative isolate min-h-[92svh] w-full overflow-hidden sm:min-h-[80svh]">

      <img
        src={heroAsset.url}
        alt="Nova One premium towers in Pune"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,rgba(220,38,38,0.18),transparent_70%)]" />

      <div className="relative z-10">
        <div className="container-luxe flex items-center justify-between py-4 text-white sm:py-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/70 text-gold font-serif text-base sm:h-10 sm:w-10 sm:text-lg">
              N
            </div>
            <div className="min-w-0 leading-tight">
              <div className="eyebrow text-gold truncate">{brand.code}</div>
              <div className="truncate text-xs font-medium sm:text-sm">{brand.name}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={callUrl}
              aria-label="Call now"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:scale-105 hover:bg-[var(--red-cta)] hover:border-[var(--red-cta)] md:h-11 md:w-11"
            >
              <PhoneCall className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-[#25D366] text-white backdrop-blur transition hover:scale-105 md:h-11 md:w-11"
            >
              <WhatsAppIcon className="h-4 w-4 md:h-5 md:w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-luxe relative z-10 flex min-h-[calc(92svh-72px)] flex-col justify-center py-8 text-white sm:min-h-[calc(80svh-96px)]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1.5 backdrop-blur sm:px-4">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold sm:text-[11px] sm:tracking-[0.3em]">
              Pre-Launch · Pune
            </span>
          </div>

          <h1 className="font-serif text-[2rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
            Your Dream <span className="text-gold italic">Home</span>
            <br />
            Awaits in <span className="text-gold italic">Pune.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-6 sm:text-base md:text-lg">
            Four premium towers with green gardens, world-class club, and
            modern homes — made for Indian families who want the best.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:mt-8">
            <a href="#contact" className="w-full">
              <Button
                size="lg"
                className="h-14 w-full rounded-full bg-[var(--red-cta)] text-base font-semibold text-white hover:bg-[#b91c1c] shadow-[0_10px_30px_-10px_rgba(220,38,38,0.6)]"
              >
                <Calendar className="mr-2 h-5 w-5" /> Book Free Site Visit
              </Button>
            </a>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-white/70 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:text-xs sm:tracking-[0.24em]">
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
  const { brand } = useBrand();
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
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(220,38,38,0.06),transparent_60%)]" />
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
                { icon: PhoneCall, label: brand.phone, sub: "Talk to our sales team" },
                { icon: MapPin, label: brand.location, sub: "Site office — Kharadi, Pune" },
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
            className="glass-card relative rounded-3xl p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:p-8 md:p-10"
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
              <Button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#b91c1c]">
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
  const { whatsappUrl, callUrl } = useBrand();
  const btns = [
    { href: whatsappUrl, label: "WhatsApp", bg: "#25D366", icon: "W" as const },
    { href: callUrl, label: "Call", bg: "#16A34A", icon: <Phone className="h-5 w-5" /> },
    { href: "#contact", label: "Site Visit", bg: "#DC2626", icon: <Calendar className="h-5 w-5" /> },
    { href: MAPS_URL, label: "Directions", bg: "#0a0a0a", icon: <Navigation className="h-5 w-5" /> },
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
          {b.label === "WhatsApp" ? (
            <WhatsAppIcon className="h-5 w-5" />
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

/* -------------------- MOBILE STICKY ACTION BAR -------------------- */
function MobileActionBar() {
  const { whatsappUrl, callUrl } = useBrand();
  return (

    <>
      <div className="h-16 md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <a href={callUrl} className="flex flex-col items-center justify-center rounded-xl bg-green-600 py-2 text-white shadow-sm active:scale-[0.98]">
            <PhoneCall className="h-4 w-4" />
            <span className="mt-0.5 text-[11px] font-medium">Call</span>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center rounded-xl bg-[#25D366] py-2 text-white shadow-sm active:scale-[0.98]">
            <WhatsAppIcon className="h-4 w-4" />
            <span className="mt-0.5 text-[11px] font-medium">WhatsApp</span>
          </a>
          <a href="#contact" className="flex flex-col items-center justify-center rounded-xl bg-[var(--red-cta)] py-2 text-white shadow-sm active:scale-[0.98]">
            <Calendar className="h-4 w-4" />
            <span className="mt-0.5 text-[11px] font-medium">Visit</span>
          </a>
        </div>
      </div>
    </>
  );
}

/* -------------------- POPUPS -------------------- */
const WELCOME_DELAY_MS = 5000; // show welcome popup after 5 seconds
const EXIT_AFTER_WELCOME_MS = 5000; // show second popup 5 seconds after first closes

function Popups() {
  const [welcome, setWelcome] = useState(false);
  const [welcomeClosed, setWelcomeClosed] = useState(false);
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
    if (!welcomeClosed || shownExit || sessionStorage.getItem("novaone_exit")) return;
    const t = setTimeout(() => {
      setExit(true);
      setShownExit(true);
      sessionStorage.setItem("novaone_exit", "1");
    }, EXIT_AFTER_WELCOME_MS);
    return () => clearTimeout(t);
  }, [welcomeClosed, shownExit]);

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
      {welcome && (
        <WelcomePopup
          onClose={() => {
            setWelcome(false);
            setWelcomeClosed(true);
          }}
        />
      )}
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
        <div className="h-full w-full bg-gradient-to-b from-black/30 to-black/80 p-6 text-white">
          <span className="eyebrow text-gold">Welcome to Nova One</span>
        </div>
      </div>
      <div className="p-8 text-center">
        <h3 className="font-serif text-2xl text-navy">Save ₹5+ Lakhs today</h3>
        <p className="mt-2 text-sm text-ink-soft">Special pre-launch price. Only for first 100 bookings. Hurry!</p>
        <p className="mt-2 text-[11px] text-ink-soft/80">*Terms and Conditions Apply</p>
        <a href="#contact"><Button onClick={onClose} className="mt-6 w-full rounded-full bg-[var(--red-cta)] text-white hover:bg-[#b91c1c]">Book Site Visit</Button></a>
      </div>
    </PopupShell>
  );
}

function ExitPopup({ onClose }: { onClose: () => void }) {
  const { whatsappUrl } = useBrand();
  return (

    <PopupShell onClose={onClose}>
      <div className="bg-navy p-8 text-center text-white">
        <span className="eyebrow text-gold">Wait — one minute</span>
        <h3 className="mt-3 font-serif text-2xl">Take our brochure with you.</h3>
        <p className="mt-2 text-sm text-white/70">Get full price list, floor plans and photos on WhatsApp in 30 seconds.</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          <Button onClick={onClose} className="mt-6 w-full rounded-full bg-gold text-white hover:bg-[#b91c1c]">
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
  const { brand } = useBrand();
  return (

    <div className="border-t border-line bg-white py-6 text-center text-xs text-ink-soft">
      © {new Date().getFullYear()} {brand.developer} × {brand.partner} · {brand.rera}
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
