import { useState } from "react";
import { Bug, AlertTriangle, ShieldCheck, Leaf, Search } from "lucide-react";

interface ThreatItem {
  id: string;
  crop: string;
  threatName: string;
  scientificName: string;
  symptoms: string;
  organicTreatment: string;
  preventativeMeasures: string;
  severity: "High" | "Critical" | "Moderate";
}

const cropThreats: ThreatItem[] = [
  {
    id: "th-1",
    crop: "Yellow Maize",
    threatName: "Fall Armyworm (FAW)",
    scientificName: "Spodoptera frugiperda",
    symptoms: "Ragged hole feeding on leaves, sawdust-like frass inside the whorl, damaged developing tassels.",
    organicTreatment: "Spray neem seed extract (50g ground neem seeds/liter of water) or Apply Bacillus thuringiensis (Bt) biopesticide.",
    preventativeMeasures: "Early planting at onset of rains, intercropping maize with cowpea or velvet bean, handpicking egg masses.",
    severity: "Critical",
  },
  {
    id: "th-2",
    crop: "Fresh Tomatoes",
    threatName: "Tomato Late Blight",
    scientificName: "Phytophthora infestans",
    symptoms: "Dark water-soaked lesions on leaves and stems, white moldy growth on leaf undersides during humid weather.",
    organicTreatment: "Apply copper hydroxide spray or bio-fungicide containing Trichoderma harzianum.",
    preventativeMeasures: "Use certified disease-resistant seeds, avoid overhead watering, maintain 60cm plant spacing for airflow.",
    severity: "High",
  },
  {
    id: "th-3",
    crop: "Pona Yam",
    threatName: "Yam Tuber Dry Rot",
    scientificName: "Scutellonema bradys / Fusarium spp.",
    symptoms: "Yellowing and cracking of stored tuber skin, brown dry rot decay below outer bark layer.",
    organicTreatment: "Ash dusting on harvested tuber cut surfaces and dip seed yams in wood ash slurry before planting.",
    preventativeMeasures: "Avoid harvesting in wet soil, store yams in well-ventilated raised slatted barns.",
    severity: "Moderate",
  },
  {
    id: "th-4",
    crop: "Fresh Cassava",
    threatName: "Cassava Mosaic Disease (CMD)",
    scientificName: "Begomovirus (Whitefly-transmitted)",
    symptoms: "Yellow-green mosaic mottling, distorted twisted leaves, stunted root development.",
    organicTreatment: "Systematic roguing (uprooting and burning) infected plants in early growth stage.",
    preventativeMeasures: "Plant disease-resistant MoFA varieties (e.g., Bankye Hemaa or Ampong) obtained from certified nurseries.",
    severity: "High",
  },
];

export function CropHealthAdvisor() {
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem>(cropThreats[0]);

  const filteredThreats = cropThreats.filter((t) => {
    if (selectedCropFilter === "All") return true;
    return t.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
  });

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Bug className="w-4 h-4" />
            <span>Plant Protection & Post-Harvest Loss Defense</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghana Crop Pest & Disease Early Warning Guide
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identify crop threats, leaf symptoms, organic treatment protocols, and preventative controls.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {["All", "Maize", "Tomatoes", "Yam", "Cassava"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCropFilter === c ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Threat Selector List */}
        <div className="md:col-span-5 space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Select Crop Threat</label>
          <div className="space-y-2">
            {filteredThreats.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThreat(t)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  selectedThreat.id === t.id
                    ? "bg-primary/10 border-primary text-foreground shadow-2xs"
                    : "bg-background border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-sm text-foreground">{t.threatName}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    t.severity === "Critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {t.severity}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground block">Affecting <strong>{t.crop}</strong></span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Threat Diagnostic Card */}
        <div className="md:col-span-7 bg-background p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h4 className="font-display font-semibold text-xl text-foreground">{selectedThreat.threatName}</h4>
              <span className="text-xs font-mono italic text-muted-foreground">{selectedThreat.scientificName}</span>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              Target: {selectedThreat.crop}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-card p-3.5 rounded-lg border border-border space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Identified Symptoms
              </span>
              <p className="text-muted-foreground leading-relaxed">{selectedThreat.symptoms}</p>
            </div>

            <div className="bg-emerald-950/10 border border-emerald-500/30 p-3.5 rounded-lg space-y-1">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Recommended Organic Field Treatment
              </span>
              <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">{selectedThreat.organicTreatment}</p>
            </div>

            <div className="bg-card p-3.5 rounded-lg border border-border space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Long-Term Preventative Field Protocol
              </span>
              <p className="text-muted-foreground leading-relaxed">{selectedThreat.preventativeMeasures}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
