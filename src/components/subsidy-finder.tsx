import { useState } from "react";
import { Landmark, MapPin, Search, CheckCircle, ExternalLink, Award } from "lucide-react";

interface SubsidyCenter {
  id: string;
  name: string;
  program: string;
  region: string;
  district: string;
  subsidizedInputs: string;
  contactOfficer: string;
  phone: string;
  status: "Active Depot" | "Registration Open";
}

const centers: SubsidyCenter[] = [
  {
    id: "ctr-1",
    name: "Techiman MoFA Agricultural Depot",
    program: "Planting for Food and Jobs (PFJ 2.0)",
    region: "Bono East",
    district: "Techiman Municipal",
    subsidizedInputs: "NPK 15-15-15, Urea, Certified Hybrid Yellow Maize Seed",
    contactOfficer: "Director Kwame Boateng",
    phone: "+233 24 990 1200",
    status: "Active Depot",
  },
  {
    id: "ctr-2",
    name: "Ejura Agriculture Extension Center",
    program: "PFJ 2.0 Grain Support",
    region: "Ashanti Region",
    district: "Ejura Sekyedumase",
    subsidizedInputs: "Organic Fertilizer, Certified Cowpea & Maize Seeds",
    contactOfficer: "Mr. Kwaku Addai",
    phone: "+233 20 881 3344",
    status: "Active Depot",
  },
  {
    id: "ctr-3",
    name: "Tamale Central Mechanization Hub",
    program: "PFJ Tractor Hiring Subsidy",
    region: "Northern Region",
    district: "Tamale Metropolitan",
    subsidizedInputs: "Subsidized Tractor Plowing Vouchers, Rice & Maize Seeds",
    contactOfficer: "Hajia Amina Fuseini",
    phone: "+233 55 440 9911",
    status: "Registration Open",
  },
  {
    id: "ctr-4",
    name: "Ho MoFA Regional Seed Store",
    program: "MoFA Extension Input Subsidy",
    region: "Volta Region",
    district: "Ho Municipal",
    subsidizedInputs: "Cassava Stem Cuttings (Bankye Hemaa), NPK Fertilizer",
    contactOfficer: "Mr. Selorm Kpodo",
    phone: "+233 24 332 1199",
    status: "Active Depot",
  },
];

export function SubsidyFinder() {
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filteredCenters = centers.filter((c) => {
    if (selectedRegion === "All") return true;
    return c.region.toLowerCase().includes(selectedRegion.toLowerCase());
  });

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Landmark className="w-4 h-4" />
            <span>Government Agricultural Support & Extension Service</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            MoFA & PFJ 2.0 Subsidized Input Depot Directory
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Locate official Ministry of Food & Agriculture (MoFA) subsidized fertilizer centers and certified seed pickup points.
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {["All", "Bono East", "Ashanti", "Northern", "Volta"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedRegion === r ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filteredCenters.map((ctr) => (
          <div key={ctr.id} className="p-5 rounded-xl border border-border bg-background space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded block w-max mb-1">
                  {ctr.program}
                </span>
                <h4 className="font-display font-semibold text-base text-foreground">{ctr.name}</h4>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-none" /> {ctr.district}, {ctr.region}
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md flex-none">
                {ctr.status}
              </span>
            </div>

            <div className="bg-card p-3 rounded-lg border border-border text-xs space-y-1">
              <span className="text-muted-foreground block text-[11px]">Subsidized Input Inventory</span>
              <strong className="text-foreground font-medium">{ctr.subsidizedInputs}</strong>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
              <span>{ctr.contactOfficer}</span>
              <span className="font-mono font-semibold text-foreground">{ctr.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
