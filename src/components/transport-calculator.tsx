import { useState } from "react";
import { Truck, Calculator, ArrowRight, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";

interface MarketQuote {
  name: string;
  region: string;
  maizePrice: number;
  yamPrice: number;
  tomatoPrice: number;
}

const marketQuotes: Record<string, MarketQuote> = {
  "Techiman Market": { name: "Techiman Market", region: "Bono East (Production Hub)", maizePrice: 620, yamPrice: 1450, tomatoPrice: 320 },
  "Tamale Central": { name: "Tamale Central", region: "Northern Region (Production Hub)", maizePrice: 590, yamPrice: 1380, tomatoPrice: 310 },
  "Kejetia Central": { name: "Kejetia Central", region: "Kumasi, Ashanti", maizePrice: 635, yamPrice: 1520, tomatoPrice: 350 },
  "Agbogbloshie": { name: "Agbogbloshie", region: "Accra, Greater Accra", maizePrice: 660, yamPrice: 1650, tomatoPrice: 380 },
  "Kaneshie Market": { name: "Kaneshie Market", region: "Accra, Greater Accra", maizePrice: 665, yamPrice: 1670, tomatoPrice: 385 },
};

export function TransportCalculator() {
  const [crop, setCrop] = useState<"maize" | "yam" | "tomato">("maize");
  const [origin, setOrigin] = useState("Techiman Market");
  const [destination, setDestination] = useState("Agbogbloshie");
  const [quantity, setQuantity] = useState<number>(50);
  const [freightPerUnit, setFreightPerUnit] = useState<number>(18);
  const [handlingFee, setHandlingFee] = useState<number>(150);

  const originQuote = marketQuotes[origin] || marketQuotes["Techiman Market"];
  const destQuote = marketQuotes[destination] || marketQuotes["Agbogbloshie"];

  const getPrice = (q: MarketQuote) => {
    if (crop === "yam") return q.yamPrice;
    if (crop === "tomato") return q.tomatoPrice;
    return q.maizePrice;
  };

  const originPrice = getPrice(originQuote);
  const destPrice = getPrice(destQuote);

  const priceDiffPerUnit = destPrice - originPrice;
  const totalPurchaseCost = originPrice * quantity;
  const totalDestRevenue = destPrice * quantity;
  const totalFreightCost = freightPerUnit * quantity + handlingFee;
  const grossSpread = totalDestRevenue - totalPurchaseCost;
  const netProfit = grossSpread - totalFreightCost;
  const roiPercentage = totalPurchaseCost > 0 ? ((netProfit / (totalPurchaseCost + totalFreightCost)) * 100).toFixed(1) : "0";

  const isProfitable = netProfit > 0;

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Truck className="w-4 h-4" />
            <span>Inter-Regional Trade Advisory</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Crop Transport Profitability Calculator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calculate net profit spread when moving produce from farmgate production hubs to urban consumption markets.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {[
            { id: "maize", label: "Maize (100kg)" },
            { id: "yam", label: "Yam (100 tubers)" },
            { id: "tomato", label: "Tomato (Crate)" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCrop(item.id as "maize" | "yam" | "tomato")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                crop === item.id ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="md:col-span-6 space-y-4 bg-background p-5 rounded-xl border border-border">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Origin Market (Source)</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              >
                {Object.keys(marketQuotes).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Destination Market</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              >
                {Object.keys(marketQuotes).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Quantity (Units)</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Freight/Unit (GH₵)</label>
              <input
                type="number"
                min="0"
                value={freightPerUnit}
                onChange={(e) => setFreightPerUnit(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Loading (GH₵)</label>
              <input
                type="number"
                min="0"
                value={handlingFee}
                onChange={(e) => setHandlingFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/80">
            <span>Origin Rate: <strong className="font-mono text-foreground">GH₵ {originPrice}</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Destination Rate: <strong className="font-mono text-foreground">GH₵ {destPrice}</strong></span>
          </div>
        </div>

        {/* Calculation Result Column */}
        <div className="md:col-span-6 space-y-4">
          <div className={`p-5 rounded-xl border ${isProfitable ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200" : "bg-red-950/10 border-red-500/30 text-red-950 dark:text-red-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                {isProfitable ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                {isProfitable ? "Profitable Transport Route" : "Unfavorable Margin Warning"}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isProfitable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                {isProfitable ? `+${roiPercentage}% ROI` : `${roiPercentage}% ROI`}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Estimated Net Profit:</span>
              <span className={`font-mono text-3xl font-bold ${isProfitable ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                GH₵ {netProfit.toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {isProfitable
                ? `Transporting ${quantity} unit(s) from ${originQuote.name} to ${destQuote.name} yields an estimated net gain of GH₵ ${netProfit.toLocaleString()} after total freight expenses of GH₵ ${totalFreightCost.toLocaleString()}.`
                : `Transport fees (GH₵ ${totalFreightCost}) exceed price difference (GH₵ ${priceDiffPerUnit} per unit). Selling locally at ${originQuote.name} is recommended.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-background p-3 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[11px]">Total Purchase Cost</span>
              <span className="font-mono font-bold text-foreground text-base">GH₵ {totalPurchaseCost.toLocaleString()}</span>
            </div>
            <div className="bg-background p-3 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[11px]">Total Freight & Handling</span>
              <span className="font-mono font-bold text-foreground text-base">GH₵ {totalFreightCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
