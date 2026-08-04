import { useState } from "react";
import { CloudRain, Sun, Droplets, Truck, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";

interface RegionalWeather {
  region: string;
  hub: string;
  temp: string;
  condition: "Partly Sunny" | "Heavy Rain Risk" | "Sunny & Dry" | "Scattered Showers";
  rainProb: string;
  humidity: string;
  dryingIndex: "Optimal (Fast Grain Drying)" | "Moderate" | "Poor (High Mold Risk)";
  roadStatus: "Clear & Accessible" | "Caution: Muddy Feeder Roads" | "Passable with 4x4 Only";
  icon: "sun" | "rain" | "cloud";
}

const regionalWeatherData: RegionalWeather[] = [
  {
    region: "Bono East",
    hub: "Techiman & Nkoranza Corridor",
    temp: "29°C",
    condition: "Sunny & Dry",
    rainProb: "15%",
    humidity: "62%",
    dryingIndex: "Optimal (Fast Grain Drying)",
    roadStatus: "Clear & Accessible",
    icon: "sun",
  },
  {
    region: "Ashanti Region",
    hub: "Kumasi & Ejura Farming Belt",
    temp: "27°C",
    condition: "Scattered Showers",
    rainProb: "45%",
    humidity: "78%",
    dryingIndex: "Moderate",
    roadStatus: "Caution: Muddy Feeder Roads",
    icon: "cloud",
  },
  {
    region: "Northern Region",
    hub: "Tamale & Yendi Grain Corridor",
    temp: "33°C",
    condition: "Sunny & Dry",
    rainProb: "5%",
    humidity: "48%",
    dryingIndex: "Optimal (Fast Grain Drying)",
    roadStatus: "Clear & Accessible",
    icon: "sun",
  },
  {
    region: "Greater Accra",
    hub: "Agbogbloshie & Tema Port",
    temp: "28°C",
    condition: "Partly Sunny",
    rainProb: "20%",
    humidity: "75%",
    dryingIndex: "Moderate",
    roadStatus: "Clear & Accessible",
    icon: "sun",
  },
  {
    region: "Eastern Region",
    hub: "Koforidua & Asesewa Belt",
    temp: "25°C",
    condition: "Heavy Rain Risk",
    rainProb: "80%",
    humidity: "88%",
    dryingIndex: "Poor (High Mold Risk)",
    roadStatus: "Passable with 4x4 Only",
    icon: "rain",
  },
];

export function RegionalWeatherWidget() {
  const [selectedRegion, setSelectedRegion] = useState<RegionalWeather>(regionalWeatherData[0]);

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <CloudRain className="w-4 h-4" />
            <span>Farming Weather & Logistics Advisory</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghana Regional Weather & Road Transport Status
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor rain probability, grain drying suitability, and feeder road transport conditions across agricultural corridors.
          </p>
        </div>

        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {regionalWeatherData.map((w) => (
            <button
              key={w.region}
              onClick={() => setSelectedRegion(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedRegion.region === w.region ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {w.region}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Display */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Weather Main Card */}
        <div className="md:col-span-6 bg-background p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h4 className="font-display font-semibold text-xl text-foreground">{selectedRegion.region}</h4>
              <span className="text-xs text-muted-foreground">{selectedRegion.hub}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedRegion.icon === "sun" ? (
                <Sun className="w-8 h-8 text-amber-500" />
              ) : selectedRegion.icon === "rain" ? (
                <CloudRain className="w-8 h-8 text-blue-500" />
              ) : (
                <Sun className="w-8 h-8 text-emerald-600" />
              )}
              <span className="font-mono text-3xl font-bold text-foreground">{selectedRegion.temp}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-card p-3 rounded-lg border border-border space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Forecast Condition</span>
              <strong className="text-foreground font-medium">{selectedRegion.condition}</strong>
            </div>

            <div className="bg-card p-3 rounded-lg border border-border space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Rain Probability</span>
              <strong className="text-foreground font-mono font-bold">{selectedRegion.rainProb}</strong>
            </div>
          </div>
        </div>

        {/* Agricultural Logistics Metrics */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 rounded-xl border border-border bg-secondary/60 space-y-1">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-600" /> Grain Drying Suitability
            </span>
            <p className="text-xs font-medium text-foreground">{selectedRegion.dryingIndex}</p>
            <p className="text-[11px] text-muted-foreground">Relative Humidity: <span className="font-mono font-bold text-foreground">{selectedRegion.humidity}</span></p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            selectedRegion.roadStatus.includes("Clear")
              ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
              : "bg-amber-950/10 border-amber-500/30 text-amber-950 dark:text-amber-200"
          }`}>
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Feeder Road Transport Accessibility
            </span>
            <p className="text-xs font-bold">{selectedRegion.roadStatus}</p>
            <p className="text-[11px] opacity-80">Check road condition before dispatching heavy trucks from farmgate to urban market gates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
