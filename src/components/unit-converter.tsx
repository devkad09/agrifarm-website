import { useState } from "react";
import { Scale, ArrowRightLeft, Calculator, HelpCircle } from "lucide-react";

interface UnitConversionRule {
  crop: string;
  unitName: string;
  approxKg: number;
  samplePrice: number; // GH₵
}

const conversionRules: UnitConversionRule[] = [
  { crop: "Yellow Maize", unitName: "100kg Maxi Bag", approxKg: 100, samplePrice: 620 },
  { crop: "Yellow Maize", unitName: "Olonka (Marginal Vol)", approxKg: 2.5, samplePrice: 18 },
  { crop: "Fresh Tomatoes", unitName: "Large Wooden Crate", approxKg: 50, samplePrice: 380 },
  { crop: "Fresh Tomatoes", unitName: "Small Paint Bucket", approxKg: 5, samplePrice: 42 },
  { crop: "Pona Yam", unitName: "100 Tubers Lot (Med/Large)", approxKg: 250, samplePrice: 1450 },
  { crop: "Fresh Cassava", unitName: "100kg Maxi Bag", approxKg: 100, samplePrice: 210 },
  { crop: "Red Pepper", unitName: "Olonka Measure", approxKg: 2.2, samplePrice: 95 },
];

export function UnitConverter() {
  const [selectedCrop, setSelectedCrop] = useState("Yellow Maize");
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [unitPrice, setUnitPrice] = useState<number>(620);
  const [customUnits, setCustomUnits] = useState<number>(1);

  const availableUnits = conversionRules.filter((r) => r.crop === selectedCrop);
  const currentRule = availableUnits[selectedUnitIndex] || availableUnits[0] || conversionRules[0];

  const totalWeightKg = (currentRule.approxKg * customUnits).toFixed(1);
  const pricePerKg = (unitPrice / currentRule.approxKg).toFixed(2);
  const totalCost = (unitPrice * customUnits).toFixed(2);

  function handleCropChange(c: string) {
    setSelectedCrop(c);
    setSelectedUnitIndex(0);
    const newUnits = conversionRules.filter((r) => r.crop === c);
    if (newUnits[0]) setUnitPrice(newUnits[0].samplePrice);
  }

  function handleUnitChange(idx: number) {
    setSelectedUnitIndex(idx);
    const rule = availableUnits[idx];
    if (rule) setUnitPrice(rule.samplePrice);
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Scale className="w-4 h-4" />
            <span>Standardization & Measurement Tool</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghanaian Traditional Market Unit & Kilogram Converter
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Convert traditional market measures (Olonka, Maxi Bag, Crate, Tuber Lot) into standardized price per kilogram (GH₵ / kg).
          </p>
        </div>

        {/* Crop Selector Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {["Yellow Maize", "Fresh Tomatoes", "Pona Yam", "Fresh Cassava", "Red Pepper"].map((c) => (
            <button
              key={c}
              onClick={() => handleCropChange(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCrop === c ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="md:col-span-6 space-y-4 bg-background p-5 rounded-xl border border-border">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Traditional Unit Measure</label>
            <select
              value={selectedUnitIndex}
              onChange={(e) => handleUnitChange(parseInt(e.target.value))}
              className="w-full text-xs font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
            >
              {availableUnits.map((u, i) => (
                <option key={i} value={i}>
                  {u.unitName} (~{u.approxKg} kg)
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Market Price (GH₵ per unit)</label>
              <input
                type="number"
                min="1"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Number of Units</label>
              <input
                type="number"
                min="1"
                max="500"
                value={customUnits}
                onChange={(e) => setCustomUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Calculation Result Column */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl text-foreground space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Standardized Kilogram Metric</span>
              <span className="text-[11px] font-mono bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
                NORMALIZED
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-muted-foreground">Standardized Rate:</span>
              <span className="font-mono text-3xl font-bold text-primary">GH₵ {pricePerKg} <span className="text-xs text-muted-foreground font-normal">/ kg</span></span>
            </div>

            <div className="pt-2 border-t border-primary/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Mass: <strong className="font-mono text-foreground">{totalWeightKg} kg</strong></span>
              <span>Total Outlay: <strong className="font-mono text-foreground">GH₵ {totalCost}</strong></span>
            </div>
          </div>

          <div className="p-3.5 bg-background rounded-xl border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
            <HelpCircle className="w-4 h-4 text-primary flex-none mt-0.5" />
            <span>
              In Ghanaian markets, <strong>1 Olonka</strong> of Maize weighs ~2.5kg, while <strong>1 Olonka</strong> of Red Pepper weighs ~2.2kg due to crop density. Standardizing per kg ensures accurate price comparisons across regions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
