import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-farmer.jpg";
import marketImg from "@/assets/market.jpg";
import cropsImg from "@/assets/crops.jpg";
import { SiteHeader } from "@/components/site-header";
import { SmsAlertSection } from "@/components/sms-alert-section";
import { getCanonicalUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriFarm — Real-time Ghana Market Prices & SMS Farmer Alerts" },
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

const markets = [
  { name: "Agbogbloshie", city: "Accra" },
  { name: "Kaneshie", city: "Accra" },
  { name: "Makola", city: "Accra" },
  { name: "Kejetia", city: "Kumasi" },
  { name: "Techiman", city: "Bono East" },
  { name: "Tamale Central", city: "Tamale" },
  { name: "Ho Central", city: "Volta" },
  { name: "Takoradi Market Circle", city: "Western" },
];

const priceSamples = [
  { crop: "Maize", unit: "100kg bag", price: "GH₵ 620", change: "+4.2%", up: true },
  { crop: "Tomato", unit: "Crate", price: "GH₵ 380", change: "-6.1%", up: false },
  { crop: "Cassava", unit: "100kg bag", price: "GH₵ 210", change: "+1.8%", up: true },
  { crop: "Yam", unit: "100 tubers", price: "GH₵ 1,450", change: "+2.4%", up: true },
  { crop: "Plantain", unit: "Bunch", price: "GH₵ 85", change: "-1.2%", up: false },
  { crop: "Pepper", unit: "Olonka", price: "GH₵ 95", change: "+8.3%", up: true },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />


      <section id="top" className="relative overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-12 py-16 lg:py-24 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--harvest)]" />
              Built in Ghana · For Ghanaian farmers
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight">
              Know the price <span className="italic text-primary">before</span> you go to market.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              AgriFarm brings real-time crop prices from major Ghanaian markets to any phone — with charts,
              market comparisons, and SMS alerts, even when there's no internet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition">
                Check today's prices
                <ArrowIcon className="h-4 w-4" />
              </a>
              <a href="#how" className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition">
                See how it works
              </a>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[["8+", "Markets tracked"], ["20+", "Crops covered"], ["SMS", "No internet needed"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-primary">{n}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImg}
              alt="A Ghanaian farmer in a green field checking market prices on a phone"
              width={1600}
              height={1200}
              className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/5] lg:aspect-[5/6]"
            />
            <div className="absolute -bottom-6 -left-4 sm:left-8 bg-card rounded-xl shadow-xl p-4 w-64 border border-border">
              <p className="text-xs text-muted-foreground">Techiman Market · today</p>
              <p className="mt-1 font-display text-lg font-semibold">Maize · 100kg</p>
              <div className="flex items-end justify-between mt-2">
                <span className="font-display text-2xl text-primary">GH₵ 620</span>
                <span className="text-xs font-medium text-[color:var(--soil)] bg-[color:var(--harvest)]/20 px-2 py-1 rounded-full">▲ 4.2%</span>
              </div>
              <div className="mt-3 flex gap-1 items-end h-8">
                {[3, 5, 4, 6, 5, 7, 8, 7, 9, 8, 10, 12].map((h, i) => (
                  <span key={i} style={{ height: `${h * 8}%` }} className="flex-1 bg-primary/70 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 py-16">
        <div className="container-page grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Farmers lose money when middlemen own the price.
            </h2>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {[
              { t: "No price transparency", d: "Farmers arrive at market without knowing what buyers paid yesterday — or what a neighbouring town pays today." },
              { t: "Middlemen set the terms", d: "Without independent prices, aggregators dictate offers, especially in remote farming communities." },
              { t: "Wasted trips", d: "Perishables spoil while farmers travel between markets hoping for a better deal." },
              { t: "No history to plan with", d: "Farmers can't plan planting or storage without seeing how prices moved last season." },
            ].map((p) => (
              <div key={p.t} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-display text-lg font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">What AgriFarm does</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Four tools, one fair market.</h2>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <FeatureCard icon={<ChartIcon />} title="Live prices & trends" body="See today's price for every crop in every tracked market, plus 30-day trend charts to spot the right time to sell." />
            <FeatureCard icon={<CompareIcon />} title="Compare markets side by side" body="One search shows what Techiman, Kejetia and Agbogbloshie are paying for the same crop right now." />
            <FeatureCard icon={<SmsIcon />} title="SMS price alerts" body="Get a text when your crop crosses your target price. Powered by Africa's Talking — no smartphone required." accent />
            <FeatureCard icon={<ShieldIcon />} title="Verified by officers" body="Prices are submitted by field officers and cross-checked before publishing. No rumours, no guesswork." />
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-border">
              <div>
                <p className="font-display text-xl font-semibold">Today at Techiman Market</p>
                <p className="text-xs text-muted-foreground">Sample view · updated daily by verified officers</p>
              </div>
              <span className="text-xs text-muted-foreground">21 Jul 2026</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {priceSamples.map((p, i) => (
                <div key={p.crop} className={`p-5 ${i >= 3 ? "border-t border-border" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold">{p.crop}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.up ? "▲" : "▼"} {p.change.replace(/[+-]/, "")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">per {p.unit}</p>
                  <p className="mt-3 font-display text-2xl">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="sms-alerts" className="py-16 bg-background">
        <div className="container-page">
          <SmsAlertSection />
        </div>
      </section>

      <section id="how" className="py-24 bg-[color:var(--cream)] border-y border-border">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <img src={marketImg} alt="Vibrant Ghanaian open-air market" width={1200} height={900} loading="lazy" className="rounded-2xl w-full h-auto object-cover aspect-[4/3] shadow-xl" />
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest">How it works</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">From the field officer's clipboard to your phone.</h2>
            <ol className="mt-10 space-y-6">
              {[
                { t: "Officers collect prices", d: "Trusted field officers at each market record daily prices for tracked crops." },
                { t: "Prices are verified", d: "Submissions are reviewed and outliers flagged before publishing." },
                { t: "Farmers check the web or SMS", d: "Open agrifarm.gh, or text a crop name to our shortcode — a price comes right back." },
                { t: "Sell smart", d: "Compare markets, watch trends, and travel only when the price justifies the trip." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex-none inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="markets" className="py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-primary uppercase tracking-widest">Markets we track</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Prices from eight major Ghanaian markets — and growing.</h2>
            </div>
            <img src={cropsImg} alt="Basket of Ghanaian crops" width={1200} height={900} loading="lazy" className="hidden md:block h-32 w-32 rounded-full object-cover shadow-lg" />
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {markets.map((m) => (
              <div key={m.name} className="rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-md transition">
                <p className="font-display text-lg font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.city}</p>
                <p className="mt-4 text-xs font-medium text-primary">Live prices →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-24 bg-primary text-primary-foreground">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest opacity-80">The team</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Group 39 — Accra Technical University</h2>
            <p className="mt-4 opacity-80">
              A Diploma in Information Technology final-year project from the Department of Information Systems
              Technology. Supervised by Dr. Duodu Yaw Nana.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Djayouri Atsu Kelvin","Kumordzi Mawuena","Alhassan Abdul Basit","Duku Bright","Senyeme Damien Klenam","Ankamah Emmanuel Yeboah"].map((name) => (
              <div key={name} className="rounded-xl bg-primary-foreground/10 backdrop-blur p-5 border border-primary-foreground/15">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-[color:var(--harvest)] text-[color:var(--soil)] inline-flex items-center justify-center font-display font-semibold">
                    {name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                  <p className="font-display text-lg">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-24">
        <div className="container-page">
          <div className="rounded-3xl bg-[color:var(--soil)] text-primary-foreground p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,var(--harvest),transparent_60%)]" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-semibold">Start getting fair prices this harvest.</h2>
              <p className="mt-4 opacity-90">
                Text <span className="font-mono bg-white/10 px-2 py-0.5 rounded">PRICE MAIZE</span> to our shortcode,
                or check live prices online. Free for farmers.
              </p>
              <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg" onSubmit={(e) => e.preventDefault()}>
                <input type="tel" placeholder="Your phone number" className="flex-1 rounded-full px-5 py-3 bg-white/10 border border-white/20 placeholder:text-white/60 text-white outline-none focus:border-white" />
                <button type="submit" className="rounded-full bg-[color:var(--harvest)] text-[color:var(--soil)] font-medium px-6 py-3 hover:opacity-90 transition">
                  Get free alerts
                </button>
              </form>
              <p className="mt-3 text-xs opacity-70">No spam. Stop anytime by texting STOP.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LeafIcon className="h-3 w-3" />
            </span>
            <span>AgriFarm · Group 39 · Accra Technical University · 2025/2026</span>
          </div>
          <p>Built with care for Ghana's farmers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, body, accent }: { icon: React.ReactNode; title: string; body: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-8 border transition hover:-translate-y-0.5 ${accent ? "bg-[color:var(--harvest)]/15 border-[color:var(--harvest)]/40" : "bg-card border-border"}`}>
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent ? "bg-[color:var(--harvest)] text-[color:var(--soil)]" : "bg-primary text-primary-foreground"}`}>
        {icon}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}

function LeafIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-9 1 4 4 7 8 7 0 5-4 9-9 9Z" />
      <path d="M4 13c4 0 8-3 9-8" />
    </svg>
  );
}
function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 5-6" />
    </svg>
  );
}
function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v16" /><path d="m3 8 4-4 4 4" /><path d="M17 20V4" /><path d="m21 16-4 4-4-4" />
    </svg>
  );
}
function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
