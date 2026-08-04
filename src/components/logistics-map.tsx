import { useState } from "react";
import { Navigation, MapPin, Truck, Clock, ShieldAlert, ArrowRight } from "lucide-react";

interface CorridorRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  transitHours: string;
  freightCostPerTon: number; // GH₵
  roadCondition: string;
  checkpoints: number;
  primaryCrops: string;
}

const corridors: CorridorRoute[] = [
  {
    id: "route-1",
    name: "North-South Grain Trunk Line",
    origin: "Techiman (Bono East)",
    destination: "Agbogbloshie (Accra)",
    distanceKm: 370,
    transitHours: "6 - 7 hrs",
    freightCostPerTon: 320,
    roadCondition: "Paved Highway (N6 Corridor)",
    checkpoints: 3,
    primaryCrops: "Yellow Maize, Pona Yam, Cassava",
  },
  {
    id: "route-2",
    name: "Northern Savannah Food Corridor",
    origin: "Tamale (Northern Region)",
    destination: "Techiman Hub (Bono East)",
    distanceKm: 235,
    transitHours: "4 - 5 hrs",
    freightCostPerTon: 210,
    roadCondition: "Paved (N10 Highway)",
    checkpoints: 2,
    primaryCrops: "White Maize, Cowpea, Sorghum",
  },
  {
    id: "route-3",
    name: "Ashanti Farming Belt Link",
    origin: "Ejura (Ashanti Region)",
    destination: "Kejetia Central (Kumasi)",
    distanceKm: 98,
    transitHours: "2 hrs",
    freightCostPerTon: 140,
    roadCondition: "Mixed Paved & Unpaved Feeder",
    checkpoints: 1,
    primaryCrops: "Fresh Tomatoes, Maize, Plantain",
  },
  {
    id: "route-4",
    name: "Volta Basin Corridor",
    origin: "Ho Central (Volta Region)",
    destination: "Kaneshie Market (Accra)",
    distanceKm: 160,
    transitHours: "3 - 3.5 hrs",
    freightCostPerTon: 180,
    roadCondition: "Paved Highway (N2)",
    checkpoints: 2,
    primaryCrops: "Cassava, Yam, Sweet Potatoes",
  },
];

export function LogisticsMap() {
  const [selectedRoute, setSelectedRoute] = useState<CorridorRoute>(corridors[0]);

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Navigation className="w-4 h-4" />
            <span>Inter-Regional Transport Logistics</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghana Inter-Regional Crop Supply Corridor Map
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor primary highway trade routes, transit times, toll checkpoints, and freight rates per ton.
          </p>
        </div>

        {/* Route Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {corridors.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoute(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedRoute.id === r.id ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.origin.split(" ")[0]} &rarr; {r.destination.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Visual Map Diagram Box */}
        <div className="lg:col-span-6 bg-background p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-display font-semibold text-base text-foreground">{selectedRoute.name}</span>
            <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
              {selectedRoute.distanceKm} km
            </span>
          </div>

          {/* Route Visual Pathway */}
          <div className="bg-card p-4 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <div>
                  <strong className="text-xs text-foreground block">{selectedRoute.origin}</strong>
                  <span className="text-[10px] text-muted-foreground">Production Hub</span>
                </div>
              </div>

              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-[10px] font-mono text-muted-foreground">{selectedRoute.transitHours}</span>
                <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden my-1">
                  <div className="h-full bg-primary rounded-full w-3/4 animate-pulse"></div>
                </div>
                <span className="text-[9px] text-muted-foreground">{selectedRoute.checkpoints} Toll/Checkpoints</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div className="text-right">
                  <strong className="text-xs text-foreground block">{selectedRoute.destination}</strong>
                  <span className="text-[10px] text-muted-foreground">Market Gate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-card p-3 rounded-lg border border-border">
              <span className="text-muted-foreground text-[11px] block">Road Classification</span>
              <span className="text-foreground font-medium">{selectedRoute.roadCondition}</span>
            </div>

            <div className="bg-card p-3 rounded-lg border border-border">
              <span className="text-muted-foreground text-[11px] block">Primary Freight Cargo</span>
              <span className="text-foreground font-medium">{selectedRoute.primaryCrops}</span>
            </div>
          </div>
        </div>

        {/* Freight Cost & Advisory Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Average Haulage Freight Rate
              </span>
              <span className="text-[10px] font-mono bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
                ESTIMATED
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-muted-foreground">Truck Rate / Metric Ton:</span>
              <span className="font-mono text-3xl font-bold text-primary">GH₵ {selectedRoute.freightCostPerTon} <span className="text-xs text-muted-foreground font-normal">/ ton</span></span>
            </div>

            <div className="pt-2 border-t border-primary/20 text-xs text-muted-foreground flex justify-between">
              <span>Standard 10-Ton Cargo Load:</span>
              <strong className="font-mono text-foreground">GH₵ {(selectedRoute.freightCostPerTon * 10).toLocaleString()}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-background flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldAlert className="w-4 h-4 text-primary flex-none mt-0.5" />
            <span>
              Always verify vehicle axle-load limits at Ministry of Roads & Highways weighbridges along the N6 corridor to avoid transport delay fines.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
