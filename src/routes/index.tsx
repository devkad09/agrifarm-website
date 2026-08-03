import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import marketImg from "@/assets/market.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmsAlertSection } from "@/components/sms-alert-section";
import { TransportCalculator } from "@/components/transport-calculator";
import { HarvestCalendar } from "@/components/harvest-calendar";
import { FieldOfficersDirectory } from "@/components/field-officers-directory";
import { getCanonicalUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { CheckCircle2, TrendingUp, Smartphone, MapPin, ArrowRight, UserCheck, Truck, Calendar, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriFarm — Ghana Wholesale Crop Market Intelligence & SMS Alerts" },
      {
        name: "description",
        content:
          "Compare live wholesale crop prices across Kejetia, Agbogbloshie, Techiman & Tamale. Get tailored SMS price alerts for Maize, Tomato, Yam & Cassava.",
      },
      { property: "og:title", content: "AgriFarm — Ghana Crop Market Prices & SMS Alerts" },
      {
        property: "og:description",
        content:
          "Real-time crop market prices, price trends, and SMS alerts for Ghanaian farmers and agricultural traders.",
      },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:url", content: getCanonicalUrl("/") },
      { name: "twitter:title", content: "AgriFarm — Ghana Crop Market Prices & SMS Alerts" },
      {
        name: "twitter:description",
        content: "Real-time market prices, price trends, and SMS alerts for Ghanaian farmers.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: getCanonicalUrl("/") }],
  }),
  component: Index,
});

const marketsList = [
  { id: "all", name: "All Ghana Markets", region: "Nationwide", count: 20 },
  { id: "techiman", name: "Techiman Market", region: "Bono East", count: 18 },
  { id: "kejetia", name: "Kejetia Central", region: "Kumasi, Ashanti", count: 16 },
  { id: "agbogbloshie", name: "Agbogbloshie", region: "Accra, Greater Accra", count: 15 },
  { id: "tamale", name: "Tamale Central", region: "Tamale, Northern", count: 14 },
  { id: "kaneshie", name: "Kaneshie Market", region: "Accra, Greater Accra", count: 12 },
  { id: "makola", name: "Makola Market", region: "Accra, Greater Accra", count: 12 },
  { id: "ho", name: "Ho Central", region: "Ho, Volta Region", count: 10 },
  { id: "takoradi", name: "Takoradi Circle", region: "Takoradi, Western", count: 11 },
];

interface Commodity {
  crop: string;
  market: string;
  region: string;
  unit: string;
  price: string;
  rawPrice: number;
  change: string;
  up: boolean;
  officer: string;
  updated: string;
}

const allCommodities: Commodity[] = [
  { crop: "Yellow Maize", market: "Techiman Market", region: "Bono East", unit: "100kg bag", price: "GH₵ 620", rawPrice: 620, change: "+4.2%", up: true, officer: "K. Addo", updated: "Today, 07:30 AM" },
  { crop: "White Maize", market: "Kejetia Central", region: "Kumasi", unit: "100kg bag", price: "GH₵ 635", rawPrice: 635, change: "+2.8%", up: true, officer: "E. Mensah", updated: "Today, 08:15 AM" },
  { crop: "Fresh Tomatoes", market: "Agbogbloshie", region: "Accra", unit: "Large Crate (50kg)", price: "GH₵ 380", rawPrice: 380, change: "-6.1%", up: false, officer: "A. Boateng", updated: "Today, 06:45 AM" },
  { crop: "Pona Yam", market: "Techiman Market", region: "Bono East", unit: "100 tubers", price: "GH₵ 1,450", rawPrice: 1450, change: "+2.4%", up: true, officer: "K. Addo", updated: "Today, 07:30 AM" },
  { crop: "Fresh Cassava", market: "Tamale Central", region: "Northern", unit: "100kg bag", price: "GH₵ 210", rawPrice: 210, change: "+1.8%", up: true, officer: "I. Alhassan", updated: "Today, 07:00 AM" },
  { crop: "Apentu Plantain", market: "Kejetia Central", region: "Kumasi", unit: "Large Bunch", price: "GH₵ 85", rawPrice: 85, change: "-1.2%", up: false, officer: "E. Mensah", updated: "Today, 08:15 AM" },
  { crop: "Red Bird Pepper", market: "Agbogbloshie", region: "Accra", unit: "Olonka", price: "GH₵ 95", rawPrice: 95, change: "+8.3%", up: true, officer: "A. Boateng", updated: "Today, 06:45 AM" },
  { crop: "Yellow Onions", market: "Kaneshie Market", region: "Accra", unit: "50kg bag", price: "GH₵ 420", rawPrice: 420, change: "+3.5%", up: true, officer: "S. Quaye", updated: "Today, 08:00 AM" },
  { crop: "Cowpea Beans", market: "Tamale Central", region: "Northern", unit: "100kg bag", price: "GH₵ 890", rawPrice: 890, change: "+1.1%", up: true, officer: "I. Alhassan", updated: "Today, 07:00 AM" },
];

const teamMembers = [
  { name: "Djayouri Atsu Kelvin", role: "Lead Systems Architect & Full-stack Engineer" },
  { name: "Kumordzi Mawuena", role: "Data Pipeline & Verification Specialist" },
  { name: "Alhassan Abdul Basit", role: "SMS Gateway Integration Developer" },
  { name: "Duku Bright", role: "Field Research & Data Operations Lead" },
  { name: "Senyeme Damien Klenam", role: "UI/UX & Mobile Interface Designer" },
  { name: "Ankamah Emmanuel Yeboah", role: "Database Engineer & Security Analyst" },
];

function Index() {
  const [selectedMarketId, setSelectedMarketId] = useState("all");
  const [cropFilter, setCropFilter] = useState("All");

  // Hero Interactive Query State
  const [heroMarket, setHeroMarket] = useState("Techiman Market");
  const [heroCrop, setHeroCrop] = useState("Yellow Maize");

  const filteredCommodities = allCommodities.filter((item) => {
    const matchesMarket =
      selectedMarketId === "all" ||
      item.market.toLowerCase().includes(selectedMarketId.toLowerCase());

    const matchesCrop =
      cropFilter === "All" || item.crop.toLowerCase().includes(cropFilter.toLowerCase());

    return matchesMarket && matchesCrop;
  });

  const activeHeroItem =
    allCommodities.find(
      (c) => c.market.includes(heroMarket) && c.crop.includes(heroCrop)
    ) || allCommodities[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section id="top" className="border-b border-border bg-card/60">
        <div className="container-page py-12 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="badge-tactile">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>Accra Technical University · Dept. of IST Capstone Project</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-foreground">
              Empowering Ghanaian Farmers & Traders with <span className="text-primary underline decoration-accent/40 decoration-wavy">Verified Market Prices</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              AgriFarm delivers real-time wholesale crop prices collected directly from market gates at Kejetia, Techiman, Agbogbloshie & Tamale — accessible via web or automated SMS on any phone.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#sms-alerts"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Get Free SMS Price Alerts</span>
              </a>
              <a
                href="#exchange"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <span>Browse Live Commodity Exchange</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80 max-w-lg">
              <div>
                <span className="font-display text-2xl font-bold text-foreground">8+</span>
                <p className="text-xs text-muted-foreground mt-0.5">Wholesale Hubs</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-foreground">20+</span>
                <p className="text-xs text-muted-foreground mt-0.5">Tracked Crops</p>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-primary">SMS 718</span>
                <p className="text-xs text-muted-foreground mt-0.5">No Internet Needed</p>
              </div>
            </div>
          </div>

          {/* Hero Interactive Market Query Box */}
          <div className="lg:col-span-5">
            <div className="card-tactile p-6 rounded-2xl border-2 border-primary/20 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Live Market Price Query
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">Updated Today</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Select Market</label>
                  <select
                    value={heroMarket}
                    onChange={(e) => setHeroMarket(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-border bg-background p-2.5 outline-none focus:border-primary"
                  >
                    <option value="Techiman">Techiman Market</option>
                    <option value="Kejetia">Kejetia (Kumasi)</option>
                    <option value="Agbogbloshie">Agbogbloshie (Accra)</option>
                    <option value="Tamale">Tamale Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Select Commodity</label>
                  <select
                    value={heroCrop}
                    onChange={(e) => setHeroCrop(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-border bg-background p-2.5 outline-none focus:border-primary"
                  >
                    <option value="Maize">Yellow Maize</option>
                    <option value="Yam">Pona Yam</option>
                    <option value="Tomato">Fresh Tomatoes</option>
                    <option value="Cassava">Fresh Cassava</option>
                  </select>
                </div>
              </div>

              <div className="bg-secondary/70 rounded-xl p-4 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-base text-foreground">{activeHeroItem.crop}</span>
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${activeHeroItem.up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {activeHeroItem.change}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-3xl font-bold text-primary">{activeHeroItem.price}</span>
                  <span className="text-xs text-muted-foreground">per {activeHeroItem.unit}</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary" /> Verified by {activeHeroItem.officer}
                  </span>
                  <span>{activeHeroItem.updated}</span>
                </div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border text-xs flex items-center justify-between">
                <span className="text-muted-foreground">SMS Query Code:</span>
                <code className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded border border-border">
                  TEXT "PRICE {activeHeroItem.crop.split(" ")[0].toUpperCase()}" TO 718
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Reality Comparison Section */}
      <section className="py-16 border-b border-border bg-background">
        <div className="container-page space-y-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Agricultural Market Realities</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
              Removing information asymmetry across Ghana's food corridors.
            </h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Without accurate market price data, smallholder farmers often accept below-market aggregator offers or waste fuel transporting perishable crops to oversupplied markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-tactile p-6 rounded-2xl border-l-4 border-l-red-500 space-y-3">
              <h3 className="font-display font-semibold text-lg text-foreground">Traditional Market Friction</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Middleman Pricing Power:</strong> Farmers travel without knowing what buyers paid yesterday in Kumasi or Accra.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Perishable Spoiled Crop Losses:</strong> Tomatoes and plantains spoil while searching for competitive buyers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>No Historical Trend Visibility:</strong> Planting schedules made without seasonal price history data.</span>
                </li>
              </ul>
            </div>

            <div className="card-tactile p-6 rounded-2xl border-l-4 border-l-primary space-y-3">
              <h3 className="font-display font-semibold text-lg text-foreground">The AgriFarm Advantage</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <span><strong>Verified Gate Prices:</strong> On-the-ground market officers submit verified wholesale prices every morning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <span><strong>Feature Phone Accessibility:</strong> SMS alerts and shortcode queries ensure connectivity even in zero-data zones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <span><strong>Multi-Market Comparison:</strong> Compare Kejetia vs Techiman rates before loading transport trucks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Commodity Exchange Board */}
      <section id="exchange" className="py-16 border-b border-border bg-card/40">
        <div className="container-page space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Live Wholesale Board</span>
              <h2 className="mt-1 font-display text-3xl font-semibold">Today's Ghana Commodity Prices</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-muted-foreground font-medium mr-1">Crop:</span>
              {["All", "Maize", "Tomato", "Yam", "Cassava"].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setCropFilter(crop)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    cropFilter === crop
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary text-secondary-foreground hover:bg-border"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Market Tab Selector */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-3">
            {marketsList.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMarketId(m.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMarketId === m.id
                    ? "bg-foreground text-background shadow-2xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {m.name} <span className="opacity-70">({m.region})</span>
              </button>
            ))}
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommodities.map((c, i) => (
              <div key={i} className="card-tactile card-tactile-hover p-5 rounded-2xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground">{c.crop}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" /> {c.market} ({c.region})
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-semibold px-2 py-1 rounded-md ${c.up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {c.up ? "▲" : "▼"} {c.change}
                  </span>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-bold text-foreground">{c.price}</span>
                  <span className="text-xs text-muted-foreground">per {c.unit}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Officer {c.officer}</span>
                  <span className="font-mono">{c.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW FEATURE 1: Crop Transport Profitability Calculator */}
      <section id="calculator" className="py-16 border-b border-border bg-background">
        <div className="container-page">
          <TransportCalculator />
        </div>
      </section>

      {/* NEW FEATURE 2: Ghana Crop Harvest & Price Scarcity Calendar */}
      <section id="calendar" className="py-16 border-b border-border bg-card/40">
        <div className="container-page">
          <HarvestCalendar />
        </div>
      </section>

      {/* NEW FEATURE 3: Verified Market Officers Directory */}
      <section id="officers" className="py-16 border-b border-border bg-background">
        <div className="container-page">
          <FieldOfficersDirectory />
        </div>
      </section>

      {/* Interactive SMS Alert Section */}
      <section id="sms-alerts" className="py-16 border-b border-border bg-card/40">
        <div className="container-page">
          <SmsAlertSection />
        </div>
      </section>

      {/* Operational Pipeline / How it Works */}
      <section id="how" className="py-16 border-b border-border bg-background">
        <div className="container-page grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <img
              src={marketImg}
              alt="Vibrant Ghanaian market scene"
              width={1000}
              height={750}
              className="rounded-2xl border border-border shadow-md object-cover aspect-[4/3]"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">System Architecture</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
                From field officer clipboard to phone display in 4 steps.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { step: "01", title: "Market Gate Price Recording", desc: "Designated field officers collect early morning wholesale quotes directly from traders at market entrances." },
                { step: "02", title: "Verification & Outlier Detection", desc: "Submissions undergo automated price range verification to eliminate artificial market rumors." },
                { step: "03", title: "Multi-Channel Broadcast", desc: "Verified price data feeds both the online dashboard and Africa's Talking SMS shortcode gateway." },
                { step: "04", title: "Informed Trading & Transportation", desc: "Farmers compare prices and set target SMS alerts before dispatching produce to market." },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-3.5 rounded-xl border border-border bg-card">
                  <span className="font-mono font-bold text-sm text-primary bg-secondary px-2.5 py-1 rounded-md">{s.step}</span>
                  <div>
                    <h3 className="font-display font-semibold text-base text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Academic Capstone Project Showcase */}
      <section id="team" className="py-16 border-b border-border bg-card/40">
        <div className="container-page space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Academic Innovation</span>
            <h2 className="mt-2 font-display text-3xl font-semibold">Group 39 — Accra Technical University</h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Diploma in Information Technology Final Year Capstone Project · Department of Information Systems Technology, Faculty of Applied Sciences. Supervised by <strong>Dr. Duodu Yaw Nana</strong>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="card-tactile p-4 rounded-xl border border-border bg-card flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-bold text-xs flex-none">
                  {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">{member.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
