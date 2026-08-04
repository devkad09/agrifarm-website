import { useState } from "react";
import { ArrowRightLeft, TrendingUp, Award, MapPin } from "lucide-react";

interface MarketData {
  market: string;
  region: string;
  price: number;
  unit: string;
  change: string;
  up: boolean;
}

const comparisonDataset: Record<string, MarketData[]> = {
  "Yellow Maize": [
    { market: "Techiman Market", region: "Bono East", price: 620, unit: "100kg bag", change: "+4.2%", up: true },
    { market: "Kejetia Central", region: "Kumasi, Ashanti", price: 635, unit: "100kg bag", change: "+2.8%", up: true },
    { market: "Agbogbloshie", region: "Accra, Greater Accra", price: 660, unit: "100kg bag", price: 660, change: "+5.1%", up: true },
    { market: "Tamale Central", region: "Northern Region", price: 590, unit: "100kg bag", change: "+1.0%", up: true },
  ],
  "Fresh Tomatoes": [
    { market: "Agbogbloshie", region: "Accra, Greater Accra", price: 380, unit: "Large Crate (50kg)", change: "-6.1%", up: false },
    { market: "Kejetia Central", region: "Kumasi, Ashanti", price: 350, unit: "Large Crate (50kg)", change: "-4.0%", up: false },
    { market: "Techiman Market", region: "Bono East", price: 320, unit: "Large Crate (50kg)", change: "-8.5%", up: false },
    { market: "Tamale Central", region: "Northern Region", price: 310, unit: "Large Crate (50kg)", change: "-2.1%", up: false },
  ],
  "Pona Yam": [
    { market: "Kaneshie Market", region: "Accra, Greater Accra", price: 1670, unit: "100 tubers", change: "+3.2%", up: true },
    { market: "Agbogbloshie", region: "Accra, Greater Accra", price: 1650, unit: "100 tubers", change: "+2.8%", up: true },
    { market: "Kejetia Central", region: "Kumasi, Ashanti", price: 1520, unit: "100 tubers", change: "+1.9%", up: true },
    { market: "Techiman Market", region: "Bono East", price: 1450, unit: "100 tubers", change: "+2.4%", up: true },
  ],
  "Fresh Cassava": [
    { market: "Agbogbloshie", region: "Accra, Greater Accra", price: 245, unit: "100kg bag", change: "+2.0%", up: true },
    { market: "Kejetia Central", region: "Kumasi, Ashanti", price: 230, unit: "100kg bag", change: "+1.5%", up: true },
    { market: "Tamale Central", region: "Northern Region", price: 210, unit: "100kg bag", change: "+1.8%", up: true },
    { market: "Techiman Market", region: "Bono East", price: 215, unit: "100kg bag", change: "+0.5%", up: true },
  ],
};

export function MarketComparisonMatrix() {
  const [selectedCrop, setSelectedCrop] = useState("Yellow Maize");
  const [marketA, setMarketA] = useState("Techiman Market");
  const [marketB, setMarketB] = useState("Agbogbloshie");

  const cropMarkets = comparisonDataset[selectedCrop] || comparisonDataset["Yellow Maize"];
  const itemA = cropMarkets.find((m) => m.market === marketA) || cropMarkets[0];
  const itemB = cropMarkets.find((m) => m.market === marketB) || cropMarkets[1] || cropMarkets[0];

  const highestMarket = cropMarkets.reduce((max, cur) => (cur.price > max.price ? cur : max), cropMarkets[0]);
  const lowestMarket = cropMarkets.reduce((min, cur) => (cur.price < min.price ? cur : min), cropMarkets[0]);
  const priceSpread = itemB.price - itemA.price;

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Cross-Market Arbitrage & Price Discovery</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Multi-Market Price Comparison Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare commodity wholesale prices across Ghana's primary market hubs side-by-side.
          </p>
        </div>

        {/* Crop Selector Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {Object.keys(comparisonDataset).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCrop === c ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Selector & Stats Bar */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Market A Card */}
        <div className="md:col-span-5 bg-background p-5 rounded-xl border border-border space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Market A (Baseline)</label>
          <select
            value={marketA}
            onChange={(e) => setMarketA(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
          >
            {cropMarkets.map((m) => (
              <option key={m.market} value={m.market}>
                {m.market} ({m.region})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-baseline justify-between border-t border-border/80">
            <div>
              <span className="font-mono text-3xl font-bold text-foreground">GH₵ {itemA.price}</span>
              <span className="text-xs text-muted-foreground block">per {itemA.unit}</span>
            </div>
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${itemA.up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {itemA.change}
            </span>
          </div>
        </div>

        {/* Diff Indicator Center Badge */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/80 border border-border text-center space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Price Spread</span>
          <span className={`font-mono text-xl font-bold ${priceSpread >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {priceSpread >= 0 ? `+GH₵ ${priceSpread}` : `-GH₵ ${Math.abs(priceSpread)}`}
          </span>
          <span className="text-[9px] text-muted-foreground">per {itemA.unit}</span>
        </div>

        {/* Market B Card */}
        <div className="md:col-span-5 bg-background p-5 rounded-xl border border-border space-y-3">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Market B (Target)</label>
          <select
            value={marketB}
            onChange={(e) => setMarketB(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
          >
            {cropMarkets.map((m) => (
              <option key={m.market} value={m.market}>
                {m.market} ({m.region})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-baseline justify-between border-t border-border/80">
            <div>
              <span className="font-mono text-3xl font-bold text-foreground">GH₵ {itemB.price}</span>
              <span className="text-xs text-muted-foreground block">per {itemB.unit}</span>
            </div>
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${itemB.up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {itemB.change}
            </span>
          </div>
        </div>
      </div>

      {/* Cross-Market Highlights */}
      <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
        <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Highest Wholesale Price
            </span>
            <p className="text-muted-foreground">{highestMarket.market} ({highestMarket.region})</p>
          </div>
          <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-400">GH₵ {highestMarket.price}</span>
        </div>

        <div className="p-4 rounded-xl bg-secondary/80 border border-border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> Lowest Farmgate/Hub Price
            </span>
            <p className="text-muted-foreground">{lowestMarket.market} ({lowestMarket.region})</p>
          </div>
          <span className="font-mono font-bold text-lg text-foreground">GH₵ {lowestMarket.price}</span>
        </div>
      </div>
    </div>
  );
}
