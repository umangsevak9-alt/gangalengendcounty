import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { getPublicSiteSettings } from "@/lib/cms.functions";
import { site } from "@/content/site";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function pushDataLayer(event: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}


export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Your Site Visit Request is Received" },
      {
        name: "description",
        content:
          "Thanks for your enquiry. Our sales team will call you within 30 minutes with pricing, floor plans and site visit timings.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank You — Enquiry Received" },
      {
        property: "og:description",
        content: "Our sales team will call you within 30 minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { data: settings } = useQuery({
    queryKey: ["public", "site-settings"],
    queryFn: () => getPublicSiteSettings(),
  });
  const phone = settings?.phone || site.brand.phone;
  const brandName = settings?.brand_name || site.brand.name;
  const conversionPushed = useRef(false);

  useEffect(() => {
    if (conversionPushed.current) return;
    pushDataLayer("conversion", { page_type: "thank_you", brand_name: brandName });
    conversionPushed.current = true;
  }, [brandName]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--mist)] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy text-gold">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-7 font-serif text-3xl text-navy sm:text-4xl">Thank you!</h1>
        <div className="mx-auto my-5 h-px w-16 bg-gold" />
        <p className="text-ink-soft">
          Your enquiry for {brandName} has been received. Our sales team will call
          you within 30 minutes with the price list, floor plans and site visit timings.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="block"
            onClick={() => pushDataLayer("call_click", { location: "thank_you_page" })}
          >
            <Button className="h-12 w-full rounded-full bg-[#166534] text-white hover:bg-[#14532d]">
              <PhoneCall className="mr-2 h-4 w-4" /> Call Us Now
            </Button>
          </a>
          <Link to="/" className="block">
            <Button variant="outline" className="h-12 w-full rounded-full border-navy text-navy">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
