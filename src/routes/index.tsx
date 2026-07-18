import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  Leaf,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import heroAsset from "@/assets/tower-hero.jpeg.asset.json";
import facadeAsset from "@/assets/tower-facade.jpeg.asset.json";
import skylineAsset from "@/assets/tower-skyline.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova One · Ganga Legend County — Pre-Launch, Pune" },
      {
        name: "description",
        content:
          "Four philosophically-inspired luxury towers in Pune. Pre-launch pricing, priority selection and Ileseum Club membership.",
      },
      { property: "og:image", content: heroAsset.url },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: NovaOneLanding,
});

function NovaOneLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <Towers />
      <Amenities />
      <Sustainability />
      <PreLaunch />
      <Specifications />
      <Connectivity />
      <FAQSection />
      <ContactSection />
      <SiteFooter />
      <FloatingCTA />
    </div>
  );
}

/* -------------------- Header -------------------- */
function SiteHeader() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Towers", href: "#towers" },
    { label: "Ileseum Club", href: "#amenities" },
    { label: "Pre-Launch", href: "#pre-launch" },
    { label: "Specifications", href: "#specifications" },
    { label: "Location", href: "#location" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-luxe grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 md:grid-cols-[auto_1fr_auto]">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/50 text-gold-deep font-display text-lg">
            N
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-tight">Nova One</span>
            <span className="eyebrow block truncate">Ganga Legend County</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center justify-center gap-8">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="gold" size="sm" className="hidden md:inline-flex">
            <a href="#contact">Book Pre-Launch</a>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid h-10 w-10 place-items-center rounded-md border border-border"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-luxe flex flex-col py-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-foreground/80 border-b border-border last:border-0"
              >
                {n.label}
              </a>
            ))}
            <Button asChild variant="gold" className="mt-4">
              <a href="#contact" onClick={() => setOpen(false)}>Book Pre-Launch</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------- Hero (Attention) -------------------- */
function Hero() {
  const [line1, line2] = site.hero.title.split("\n");
  return (
    <section id="top" className="relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroAsset.url}
          alt="Nova One residential tower rising above Pune with a plane crossing the sky"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c2340]/70 via-[#0c2340]/40 to-[#0c2340]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/80 via-[#0c2340]/30 to-transparent" />
      </div>

      <div className="container-luxe grid min-h-[92vh] items-end pb-16 pt-28 md:min-h-[100vh] md:items-center md:pt-32">
        <div className="max-w-2xl">
          <span className="eyebrow inline-flex items-center gap-3 text-[#5cbdb9]">
            <span className="gold-rule bg-[#5cbdb9]" /> {site.hero.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl text-white">
            {line1}
            <br />
            <span className="font-serif-elegant text-[#5cbdb9]">{line2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
            {site.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#5cbdb9] text-[#0c2340] hover:bg-[#4aa9a5]">
              <a href="#contact" className="inline-flex items-center gap-2">
                {site.hero.ctaPrimary} <ArrowRight size={16} />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <a href="#contact" className="inline-flex items-center gap-2">
                <Download size={16} /> {site.hero.ctaSecondary}
              </a>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-6">
            {[
              { k: "4", v: "Signature Towers" },
              { k: "3.2 AC", v: "The Ileseum Club" },
              { k: "42/100", v: "Pre-launch slots left" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl text-[#5cbdb9]">{s.k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 hidden md:flex flex-col items-center gap-2">
        <span className="eyebrow text-[#5cbdb9]">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}

function TrustStrip() {
  const badges = [
    { icon: ShieldCheck, label: site.brand.rera },
    { icon: Award, label: "IGBC Platinum Target" },
    { icon: Building2, label: `${site.brand.developer} × ${site.brand.partner}` },
    { icon: Leaf, label: "Green Certified Design" },
  ];
  return (
    <section className="border-y border-border bg-white">
      <div className="container-luxe grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
        {badges.map((b) => (
          <div key={b.label} className="flex min-w-0 items-center gap-3">
            <b.icon size={18} className="shrink-0 text-gold" />
            <span className="truncate text-xs uppercase tracking-[0.18em] text-foreground/70">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Interest — Towers -------------------- */
function Towers() {
  return (
    <section id="towers" className="py-24 md:py-32 bg-white">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Interest · Four Towers, One Intention"
          title={<>Philosophies rendered <span className="font-serif-elegant text-gold">in stone & sky</span></>}
          intro="Each tower is named for a Sanskrit ideal that shapes its architecture, layouts and daily rituals."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {site.towers.map((t, i) => (
            <article
              key={t.code}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-gold hover:shadow-[0_20px_60px_-30px_rgba(45,138,158,0.25)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="eyebrow">{t.meaning}</span>
                  <h3 className="mt-2 font-display text-4xl text-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-1 font-serif-elegant text-gold">{t.tagline}</p>
                </div>
                <span className="shrink-0 rounded-full border border-gold/60 px-3 py-1 text-xs font-medium text-gold">
                  {t.code}
                </span>
              </div>
              <p className="mt-6 text-foreground/75 leading-relaxed">{t.description}</p>
              <ul className="mt-6 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute -right-6 -top-6 font-display text-[9rem] leading-none text-gold/10 select-none">
                0{i + 1}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-border shadow-sm">
          <img
            src={facadeAsset.url}
            alt="Vertical gardens cascading down the Nova One façade"
            className="h-64 w-full object-cover md:h-96"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------- Desire — Amenities -------------------- */
function Amenities() {
  return (
    <section id="amenities" className="bg-[#0c2340] text-white py-24 md:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Desire · The Ileseum Club"
          title={
            <>
              A club within a home,
              <br />
              <span className="font-serif-elegant text-[#5cbdb9]">reserved for the few.</span>
            </>
          }
          intro={site.amenities.intro}
          tone="dark"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.amenities.items.map((a, i) => (
            <div
              key={a.title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-6 transition-colors hover:border-[#5cbdb9]/60 hover:bg-white/[0.08]"
            >
              <span className="font-display text-xs text-[#5cbdb9]/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-white/60">{a.note}</p>
              <Sparkles
                size={16}
                className="absolute right-5 top-5 text-[#5cbdb9]/40 transition-transform group-hover:rotate-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sustainability() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-luxe grid gap-12 md:grid-cols-2 md:items-center">
        <div className="order-2 md:order-1 overflow-hidden rounded-2xl border border-border shadow-sm">
          <img
            src={skylineAsset.url}
            alt="Nova One skyline gardens at sunset"
            className="h-80 w-full object-cover md:h-[520px]"
            loading="lazy"
          />
        </div>
        <div className="order-1 md:order-2">
          <SectionHeading
            eyebrow="Green by Design"
            title={<>Living systems, <span className="font-serif-elegant text-gold">not just buildings.</span></>}
            intro="Every façade breathes. Every drop counts. Nova One is engineered for a lower footprint and a richer everyday."
            align="left"
          />
          <ul className="mt-8 space-y-4">
            {site.sustainability.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3 border-b border-border pb-4 last:border-0"
              >
                <Leaf size={18} className="mt-0.5 shrink-0 text-forest" />
                <span className="text-foreground/80">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Action — Pre-Launch -------------------- */
function PreLaunch() {
  return (
    <section
      id="pre-launch"
      className="relative overflow-hidden py-24 md:py-32 bg-secondary/30"
    >
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Action · Founder Advantage"
          title={site.preLaunch.title}
          intro={site.preLaunch.subtitle}
        />

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-[0_30px_80px_-40px_rgba(45,138,158,0.2)]">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] items-center gap-4 border-b border-border bg-secondary/60 px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            <span>Benefit</span>
            <span>Value</span>
            <span className="hidden sm:block">Note</span>
          </div>
          {site.preLaunch.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.1fr_1fr_1fr] items-center gap-4 border-b border-border px-6 py-5 last:border-0"
            >
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="font-display text-lg text-gold">{row.value}</span>
              <span className="hidden sm:block text-sm text-foreground/60">{row.note}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-foreground/80">
            <span className="font-medium text-destructive">Limited:</span> {site.preLaunch.urgency}
          </p>
          <Button asChild variant="gold">
            <a href="#contact">Reserve My Slot</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Specifications -------------------- */
function Specifications() {
  return (
    <section id="specifications" className="py-24 md:py-32 bg-white">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Crafted To The Last Detail"
          title="Specifications"
          intro="Materials, finishes and systems chosen for longevity, comfort and quiet luxury."
        />
        <div className="mt-12 overflow-hidden rounded-2xl border border-border shadow-sm">
          {site.specifications.map((s, i) => (
            <div
              key={s.group}
              className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[220px_1fr] sm:gap-8 ${
                i % 2 === 0 ? "bg-card" : "bg-secondary/60"
              }`}
            >
              <div className="font-display text-lg text-foreground">{s.group}</div>
              <div className="text-sm text-foreground/75 leading-relaxed">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Location -------------------- */
function Connectivity() {
  return (
    <section id="location" className="bg-secondary/30 py-24 md:py-32">
      <div className="container-luxe grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Location · Pune"
            title={<>An address that <span className="font-serif-elegant text-gold">already arrived.</span></>}
            intro="At the intersection of Pune's IT growth corridor, hospitality and heritage — minutes from what matters."
            align="left"
          />
          <ul className="mt-10 divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
            {site.connectivity.map((c) => (
              <li
                key={c.place}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <MapPin size={16} className="shrink-0 text-gold-deep" />
                  <span className="truncate text-foreground/80">{c.place}</span>
                </span>
                <span className="shrink-0 font-display text-gold-deep">{c.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-full min-h-[380px]">
            <iframe
              title="Nova One location — Pune"
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.87%2C18.53%2C73.97%2C18.60&layer=mapnik&marker=18.5679%2C73.9143"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FAQ -------------------- */
function FAQSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe max-w-3xl">
        <SectionHeading
          eyebrow="Considered Answers"
          title="Frequently asked"
        />
        <Accordion type="single" collapsible className="mt-10">
          {site.faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-display text-lg">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* -------------------- Contact -------------------- */
function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", tower: "" });
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Please fill in your name, phone and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    // Store locally until CMS/backend is wired.
    try {
      const key = "nova_one_inquiries";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", phone: "", email: "", tower: "" });
      toast.success("Thank you. Our relationship manager will call within 24 hours.");
    }, 700);
  }

  return (
    <section id="contact" className="bg-charcoal text-ivory py-24 md:py-32">
      <div className="container-luxe grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading
            eyebrow="Action · Reserve"
            title={<>Begin your <span className="font-serif-elegant text-gold">Nova One</span> chapter</>}
            intro="Share your details and a senior relationship manager will walk you through pre-launch pricing, floor plans and priority selection."
            tone="dark"
            align="left"
          />
          <div className="mt-8 space-y-3 text-ivory/75">
            <a href={`tel:${site.brand.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-gold">
              <Phone size={16} className="text-gold" /> {site.brand.phone}
            </a>
            <a
              href={`https://wa.me/${site.brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-gold"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-forest" /> WhatsApp us anytime
            </a>
            <p className="flex items-center gap-3">
              <MapPin size={16} className="text-gold" /> {site.brand.location}
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur"
        >
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name" className="text-ivory/80">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
                placeholder="Your name"
                className="mt-1.5 border-white/15 bg-white/5 text-ivory placeholder:text-ivory/40"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone" className="text-ivory/80">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                  placeholder="+91 …"
                  className="mt-1.5 border-white/15 bg-white/5 text-ivory placeholder:text-ivory/40"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-ivory/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={120}
                  placeholder="you@example.com"
                  className="mt-1.5 border-white/15 bg-white/5 text-ivory placeholder:text-ivory/40"
                />
              </div>
            </div>
            <div>
              <Label className="text-ivory/80">Tower of interest</Label>
              <Select value={form.tower} onValueChange={(v) => setForm({ ...form, tower: v })}>
                <SelectTrigger className="mt-1.5 border-white/15 bg-white/5 text-ivory">
                  <SelectValue placeholder="Select a tower" />
                </SelectTrigger>
                <SelectContent>
                  {site.towers.map((t) => (
                    <SelectItem key={t.code} value={t.name}>
                      {t.name} · {t.code} — {t.meaning}
                    </SelectItem>
                  ))}
                  <SelectItem value="Undecided">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="gold" size="lg" disabled={submitting} className="mt-2">
              {submitting ? "Submitting…" : "Request Pre-Launch Access"}
            </Button>
            <p className="text-xs text-ivory/50">
              By submitting, you consent to be contacted about Nova One. We do not share your details.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */
function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-luxe py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl">Nova One</span>
          <p className="mt-2 text-sm text-foreground/60 max-w-md">
            A {site.brand.developer} development in partnership with {site.brand.partner}. RERA
            registration numbers are disclosed on the reservation letter.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li><a href="#towers" className="hover:text-foreground">Towers</a></li>
            <li><a href="#amenities" className="hover:text-foreground">Ileseum Club</a></li>
            <li><a href="#specifications" className="hover:text-foreground">Specifications</a></li>
            <li><a href="#location" className="hover:text-foreground">Location</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>{site.brand.phone}</li>
            <li>{site.brand.email}</li>
            <li>{site.brand.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxe py-5 text-[11px] text-foreground/50 leading-relaxed">
          Disclaimer: Images are artistic impressions. Specifications, amenities and offers are
          indicative and subject to change without notice. This is not a legal offering. All
          transactions are governed by the terms of the final agreement for sale under MahaRERA.
          © {new Date().getFullYear()} {site.brand.developer}.
        </div>
      </div>
    </footer>
  );
}

/* -------------------- Floating CTA -------------------- */
function FloatingCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${site.brand.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full bg-forest text-ivory shadow-lg transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M19.11 17.44c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.72.91-.88 1.1-.16.19-.32.21-.6.07-.28-.14-1.19-.44-2.26-1.4-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.51-.86-2.07-.22-.54-.45-.47-.63-.48h-.54c-.18 0-.49.07-.75.35-.26.28-.99.97-.99 2.35 0 1.38 1.01 2.72 1.15 2.9.14.19 1.99 3.04 4.83 4.26.68.29 1.21.47 1.62.6.68.22 1.29.19 1.78.12.54-.08 1.66-.68 1.9-1.33.24-.66.24-1.22.17-1.33-.07-.11-.26-.19-.54-.33ZM16.02 3C9.4 3 4 8.4 4 15.02c0 2.11.55 4.16 1.6 5.97L4 27l6.19-1.62a11.98 11.98 0 0 0 5.83 1.49h.01c6.61 0 12-5.39 12-12.01C28.03 8.4 22.64 3 16.02 3Z" />
        </svg>
      </a>
      <a
        href={`tel:${site.brand.phone.replace(/\s/g, "")}`}
        aria-label="Call sales"
        className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ivory shadow-lg transition-transform hover:scale-105"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}

/* -------------------- Reusable -------------------- */
function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const introColor = tone === "dark" ? "text-ivory/70" : "text-foreground/70";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className={`eyebrow inline-flex items-center gap-3 ${tone === "dark" ? "text-gold" : ""}`}>
        <span className="gold-rule" /> {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">{title}</h2>
      {intro && <p className={`mt-4 ${introColor}`}>{intro}</p>}
    </div>
  );
}
