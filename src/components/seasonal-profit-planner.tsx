import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface CropDefault {
  crop: string;
  expectedYieldPerAcre: number; // bags or crates
  expectedPricePerUnit: number; // GH₵
  seedCostPerAcre: number;
  fertilizerCostPerAcre: number;
  plowingCostPerAcre: number;
  laborCostPerAcre: number;
}

const cropDefaults: Record<string, CropDefault> = {
  "Yellow Maize": { crop: "Yellow Maize", expectedYieldPerAcre: 18, expectedPricePerUnit: 620, seedCostPerAcre: 250, fertilizerCostPerAcre: 1800, plowingCostPerAcre: 600, laborCostPerAcre: 800 },
  "Fresh Tomatoes": { crop: "Fresh Tomatoes", expectedYieldPerAcre: 40, expectedPricePerUnit: 350, seedCostPerAcre: 450, fertilizerCostPerAcre: 2400, plowingCostPerAcre: 700, laborCostPerAcre: 1400 },
  "Pona Yam": { crop: "Pona Yam", expectedYieldPerAcre: 25, expectedPricePerUnit: 1450, seedCostPerAcre: 2800, fertilizerCostPerAcre: 1200, plowingCostPerAcre: 1000, laborCostPerAcre: 1600 },
  "Fresh Cassava": { crop: "Fresh Cassava", expectedYieldPerAcre: 22, expectedPricePerUnit: 210, seedCostPerAcre: 150, fertilizerCostPerAcre: 600, plowingCostPerAcre: 500, laborCostPerAcre: 600 },
};

export function SeasonalProfitPlanner() {
  const [selectedCrop, setSelectedCrop] = useState("Yellow Maize");
  const [acres, setAcres] = useState<number>(2);

  const defaults = cropDefaults[selectedCrop] || cropDefaults["Yellow Maize"];

  const [seedCost, setSeedCost] = useState<number>(defaults.seedCostPerAcre);
  const [fertilizerCost, setFertilizerCost] = useState<number>(defaults.fertilizerCostPerAcre);
  const [plowingCost, setPlowingCost] = useState<number>(defaults.plowingCostPerAcre);
  const [laborCost, setLaborCost] = useState<number>(defaults.laborCostPerAcre);
  const [expectedPrice, setExpectedPrice] = useState<number>(defaults.expectedPricePerUnit);
  const [expectedYield, setExpectedYield] = useState<number>(defaults.expectedYieldPerAcre);

  function handleCropChange(c: string) {
    setSelectedCrop(c);
    const d = cropDefaults[c] || cropDefaults["Yellow Maize"];
    setSeedCost(d.seedCostPerAcre);
    setFertilizerCost(d.fertilizerCostPerAcre);
    setPlowingCost(d.plowingCostPerAcre);
    setLaborCost(d.laborCostPerAcre);
    setExpectedPrice(d.expectedPricePerUnit);
    setExpectedYield(d.expectedYieldPerAcre);
  }

  const totalInputCost = (seedCost + fertilizerCost + plowingCost + laborCost) * acres;
  const totalYieldUnits = expectedYield * acres;
  const totalGrossRevenue = totalYieldUnits * expectedPrice;
  const netSeasonalProfit = totalGrossRevenue - totalInputCost;
  const roiPercentage = totalInputCost > 0 ? ((netSeasonalProfit / totalInputCost) * 100).toFixed(1) : "0";

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Calculator className="w-4 h-4" />
            <span>Seasonal Financial Planning</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Smallholder Seasonal Input Cost & Net Profit Estimator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estimate upfront cultivation costs (seeds, fertilizer, plowing, labor) vs expected harvest revenue per acre.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {Object.keys(cropDefaults).map((c) => (
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
        {/* Input Parameters Column */}
        <div className="md:col-span-6 space-y-4 bg-background p-5 rounded-xl border border-border">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Total Farm Size (Acres)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={acres}
                onChange={(e) => setAcres(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Expected Yield / Acre</label>
              <input
                type="number"
                min="1"
                value={expectedYield}
                onChange={(e) => setExpectedYield(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Seed / Planting Material (GH₵/Acre)</label>
              <input
                type="number"
                min="0"
                value={seedCost}
                onChange={(e) => setSeedCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Fertilizer & Chemicals (GH₵/Acre)</label>
              <input
                type="number"
                min="0"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Tractor Plowing (GH₵/Acre)</label>
              <input
                type="number"
                min="0"
                value={plowingCost}
                onChange={(e) => setPlowingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Weeding & Harvesting Labor (GH₵/Acre)</label>
              <input
                type="number"
                min="0"
                value={laborCost}
                onChange={(e) => setLaborCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-mono rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Profit Output Column */}
        <div className="md:col-span-6 space-y-4">
          <div className={`p-5 rounded-xl border ${netSeasonalProfit >= 0 ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200" : "bg-red-950/10 border-red-500/30 text-red-950 dark:text-red-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                {netSeasonalProfit >= 0 ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                Estimated Seasonal Net Returns
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${netSeasonalProfit >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                {netSeasonalProfit >= 0 ? `+${roiPercentage}% ROI` : `${roiPercentage}% ROI`}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Estimated Net Profit ({acres} Acre[s]):</span>
              <span className={`font-mono text-3xl font-bold ${netSeasonalProfit >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                GH₵ {netSeasonalProfit.toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Cultivating {acres} acre(s) of {selectedCrop} requires an estimated input outlay of GH₵ {totalInputCost.toLocaleString()} and is projected to generate GH₵ {totalGrossRevenue.toLocaleString()} in wholesale revenue.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-background p-3 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[11px]">Total Cultivation Outlay</span>
              <span className="font-mono font-bold text-foreground text-base">GH₵ {totalInputCost.toLocaleString()}</span>
            </div>

            <div className="bg-background p-3 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[11px]">Projected Gross Harvest</span>
              <span className="font-mono font-bold text-foreground text-base">GH₵ {totalGrossRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
