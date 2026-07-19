// Centralized site content — edit here to update the landing page copy.
export const site = {
  brand: {
    name: "Ganga Legend County",
    code: "Nova One",
    developer: "Goel Ganga Corporation",
    partner: "Unicon Group",
    location: "Pune, India",
    rera: "RERA Approved",
    phone: "+91 98220 00000",
    whatsapp: "919822000000",
    email: "sales@gangalegendcounty.com",
  },
  hero: {
    eyebrow: "Pre-Launch · Pune",
    title: "Your Dream Home\nAwaits in Pune",
    subtitle:
      "Four premium towers with green gardens, world-class club and modern homes — made for Indian families.",
    ctaPrimary: "Book Site Visit",
    ctaSecondary: "Download Brochure",
  },
  towers: [
    {
      code: "B7",
      name: "Aarambh",
      tagline: "New Beginnings Rooted in Balance",
      meaning: "Beginnings & Intention",
      description:
        "The origin tower — where every threshold is a chapter, and every home a considered start.",
      features: ["2, 3 & 4 BHK Refined", "Earthquake-resistant frame", "Smart home automation"],
    },
    {
      code: "B8",
      name: "Udaan",
      tagline: "Flight — the Upward Journey of Growth",
      meaning: "Growth & Freedom",
      description:
        "Sky-facing residences with panoramic balconies designed for those on the ascent.",
      features: ["Panoramic sky decks", "Premium Italian fittings", "Concierge lobby"],
    },
    {
      code: "B9",
      name: "Samarasya",
      tagline: "Balance — Inner Peace & Abundance",
      meaning: "Balance & Wellness",
      description:
        "A tower of stillness — biophilic corridors, meditative pockets, and light-tuned interiors.",
      features: ["Biophilic corridors", "Yoga & meditation decks", "Circadian lighting"],
    },
    {
      code: "B10",
      name: "Jeevanam",
      tagline: "Vitality — the Art of a Long, Meaningful Life",
      meaning: "Vitality & Health",
      description:
        "The wellness tower — engineered around air, water and movement for a longer, richer life.",
      features: ["MERV-13 fresh-air system", "Alkaline water filtration", "Wellness concierge"],
    },
  ],
  amenities: {
    club: "The Ileseum Club",
    intro:
      "A private members' club with wellness, sports, culture and community — only for Nova One residents.",
    items: [
      { title: "Michael Phelps Signature Pool", note: "Olympic-grade lap & leisure water" },
      { title: "Meditation Pavilion", note: "Silence rooms & sound therapy" },
      { title: "Fully-Equipped Gymnasium", note: "Technogym® strength & cardio" },
      { title: "Private Cinema", note: "Dolby Atmos screening lounge" },
      { title: "Arts Gallery", note: "Rotating curated residencies" },
      { title: "Cricket · Tennis · Football", note: "Championship-grade grounds" },
      { title: "Co-working & Business Lounge", note: "Fibre-linked private suites" },
      { title: "Pet Spa & Runs", note: "Grooming, play, veterinary corner" },
      { title: "Children's Discovery Zone", note: "STEM lab, splash pool, library" },
    ],
  },
  sustainability: [
    "IGBC Platinum pre-certification target",
    "Vertical gardens across every façade",
    "Rainwater harvesting & greywater reuse",
    "Solar-assisted common utilities",
  ],
  preLaunch: {
    title: "The Pre-Launch Advantage",
    subtitle: "Reserved for the first 100 patrons of Nova One.",
    rows: [
      { label: "Founder pricing", value: "Save ₹5+ Lakhs", note: "Locked below launch card" },
      { label: "Complimentary parking", value: "₹3.5 L value", note: "Covered, assigned bay" },
      { label: "Priority unit selection", value: "First rights", note: "Floors, views, orientation" },
      { label: "Flexible payment plan", value: "20 : 40 : 40", note: "Milestone-linked" },
      { label: "First 100 patrons", value: "Ileseum Founding Membership", note: "Named plaque at club" },
    ],
    urgency: "Only 42 of the first 100 pre-launch slots remain.",
  },
  specifications: [
    { group: "Structure", detail: "RCC earthquake-resistant framed structure, seismic zone III+ compliant" },
    { group: "Flooring", detail: "800×1600 vitrified tiles in living & bedrooms; imported marble in master" },
    { group: "Kitchen", detail: "Granite counter, S/S sink, glazed dado, provisions for hob, chimney, RO, WM" },
    { group: "Bathrooms", detail: "Grohe/Kohler CP fittings, wall-hung EWCs, glass shower enclosures" },
    { group: "Doors & Windows", detail: "Engineered veneer main door with digital lock; UPVC double-glazed windows" },
    { group: "Electrification", detail: "Modular switches, concealed copper wiring, EV-ready parking, 3-phase supply" },
    { group: "Automation", detail: "Smart lighting scenes, AC control, video door phone, app-based access" },
  ],
  connectivity: [
    { place: "Pune International Airport", time: "22 min" },
    { place: "Kharadi IT Park (EON)", time: "10 min" },
    { place: "Magarpatta City", time: "12 min" },
    { place: "Amanora Mall", time: "8 min" },
    { place: "Ruby Hall Clinic", time: "15 min" },
    { place: "Symbiosis International School", time: "6 min" },
  ],
  faqs: [
    {
      q: "When is Nova One launching?",
      a: "The official launch is coming soon. Book now in pre-launch to get the best price and first choice of unit.",
    },
    {
      q: "Is the project RERA approved?",
      a: "Yes. All four towers are registered with Maharashtra RERA. Full numbers will be shared in your booking letter.",
    },
    {
      q: "Which flat sizes are available?",
      a: "2 BHK, 3 BHK and 4 BHK premium flats. Sky-view units are also available in Udaan and Jeevanam towers.",
    },
    {
      q: "What is the payment plan?",
      a: "Simple 20:40:40 payment plan linked to construction stages. Home loans from all major banks are also available.",
    },
    {
      q: "Can I resell or give the flat on rent later?",
      a: "Yes. Nova One is good for both living and investment. Kharadi area has strong rental demand and good price growth.",
    },
  ],
};

export type Tower = (typeof site.towers)[number];
