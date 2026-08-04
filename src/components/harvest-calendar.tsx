import { useState } from "react";
import { Calendar, Sun, CloudRain, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface CropSeason {
  name: string;
  category: string;
  peakHarvest: string;
  leanPeriod: string;
  storageTip: string;
  months: ("peak" | "lean" | "normal")[]; // 12 months Jan-Dec
}

const cropSeasons: CropSeason[] = [
  {
    name: "Yellow Maize",
    category: "Grains & Cereals",
    peakHarvest: "Aug – Oct (Major), Dec – Jan (Minor)",
    leanPeriod: "May – July",
    storageTip: "Dry below 13% moisture level using PICS triple-layer hermetic bags to prevent Weevil infestation without chemicals.",
    months: ["peak", "normal", "normal", "normal", "lean", "lean", "lean", "peak", "peak", "peak", "normal", "peak"],
  },
  {
    name: "Pona Yam",
    category: "Roots & Tubers",
    peakHarvest: "Aug – Nov",
    leanPeriod: "May – July (Old yam scarce)",
    storageTip: "Store in well-ventilated raised yam barns under shady trees. Inspect fortnightly for rot.",
    months: ["normal", "normal", "normal", "normal", "lean", "lean", "lean", "peak", "peak", "peak", "peak", "normal"],
  },
  {
    name: "Fresh Tomatoes",
    category: "Vegetables",
    peakHarvest: "Nov – March (Irrigated/Bono East)",
    leanPeriod: "June – Aug (Heavy rains rot)",
    storageTip: "Highly perishable. Transport in plastic ventilated crates rather than traditional wooden boxes to reduce crushing by 30%.",
    months: ["peak", "peak", "peak", "normal", "normal", "lean", "lean", "lean", "normal", "normal", "peak", "peak"],
  },
  {
    name: "Fresh Cassava",
    category: "Roots & Tubers",
    peakHarvest: "Year-Round (Peak: Oct – Dec)",
    leanPeriod: "March – May (Hard ground harvest friction)",
    storageTip: "Process into Gari or Cassava Flour (HQCF) within 48 hours of harvest to prevent physiological deterioration.",
    months: ["normal", "normal", "lean", "lean", "lean", "normal", "normal", "normal", "normal", "peak", "peak", "peak"],
  },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function HarvestCalendar() {
  const [selectedCrop, setSelectedCrop] = useState<CropSeason>(cropSeasons[0]);

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Calendar className="w-4 h-4" />
            <span>Seasonal Market Intelligence</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghana Crop Harvest & Price Scarcity Calendar
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Plan planting, harvest dispatch, and post-harvest storage timing to maximize seasonal price returns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-secondary p-1 rounded-xl border border-border">
          {cropSeasons.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCrop.name === c.name
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Matrix Display */}
      <div className="space-y-6">
        <div className="bg-background p-5 rounded-xl border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-display font-semibold text-lg text-foreground">{selectedCrop.name}</h4>
              <span className="text-xs text-muted-foreground">{selectedCrop.category}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-emerald-600"></span> Peak Harvest (Lowest Price)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-500"></span> Lean Period (Highest Price)
              </span>
            </div>
          </div>

          {/* 12 Month Heatmap Bar */}
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-cols-12 min-w-[540px] gap-1 pt-2">
              {selectedCrop.months.map((status, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full h-12 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                      status === "peak"
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : status === "lean"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                    title={`${monthNames[idx]}: ${status.toUpperCase()}`}
                  >
                    {monthNames[idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advisory Cards */}
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-secondary/60 p-4 rounded-xl border border-border space-y-1.5">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-emerald-600" /> Peak Supply Window
            </span>
            <p className="text-muted-foreground leading-relaxed">{selectedCrop.peakHarvest}</p>
          </div>

          <div className="bg-secondary/60 p-4 rounded-xl border border-border space-y-1.5">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-amber-600" /> High Scarcity & Peak Price Window
            </span>
            <p className="text-muted-foreground leading-relaxed">{selectedCrop.leanPeriod}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs">
          <ShieldAlert className="w-4 h-4 text-primary flex-none mt-0.5" />
          <div>
            <strong className="block text-foreground font-semibold">Post-Harvest Storage Protocol</strong>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">{selectedCrop.storageTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
