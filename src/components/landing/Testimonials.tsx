import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initial: string;
};

const ITEMS: Testimonial[] = [
  {
    name: "Rohit & Sneha Deshmukh",
    role: "Home Buyer · 3 BHK",
    quote:
      "Booking was smooth and the site visit was very professional. The Ileseum Club is exactly what our family was looking for.",
    initial: "R",
  },
  {
    name: "Ananya Sharma",
    role: "Investor · Kharadi",
    quote:
      "The location, RERA clarity and pre-launch pricing made this an easy decision. Sales team responded within minutes.",
    initial: "A",
  },
  {
    name: "Rajesh Iyer",
    role: "Home Buyer · 4 BHK",
    quote:
      "Beautiful green towers and thoughtful floor plans. Cross-ventilation and sky gardens truly stand out.",
    initial: "R",
  },
  {
    name: "Priya & Kunal Mehta",
    role: "First-Time Buyers",
    quote:
      "Loved the transparency on price and possession. Everything promised on the visit matched the brochure.",
    initial: "P",
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = ITEMS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section id="testimonials" className="bg-white py-14 md:py-20">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Testimonials</p>
          <h2 className="font-serif text-3xl leading-tight text-navy md:text-5xl">
            Loved by <span className="text-gold italic">Pune families.</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Honest words from happy home buyers and investors.
          </p>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-3xl border border-line bg-[var(--mist)] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:p-12">
            <div className="flex" style={{
              transform: `translateX(-${index * 100}%)`,
              transition: "transform 600ms ease",
            }}>
              {ITEMS.map((t) => (
                <div key={t.name} className="w-full shrink-0 px-1 text-center">
                  <Quote className="mx-auto h-8 w-8 text-gold" />
                  <p className="mt-5 font-serif text-lg leading-relaxed text-navy md:text-xl">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-navy font-serif text-gold">
                      {t.initial}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-navy">{t.name}</div>
                      <div className="text-xs text-ink-soft">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={prev}
            className="absolute left-1 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lg ring-1 ring-line hover:bg-navy hover:text-white md:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={next}
            className="absolute right-1 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lg ring-1 ring-line hover:bg-navy hover:text-white md:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {ITEMS.map((_, i) => (
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
