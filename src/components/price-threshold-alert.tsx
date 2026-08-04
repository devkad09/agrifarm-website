import { useState } from "react";
import { Bell, Smartphone, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function PriceThresholdAlert() {
  const [phone, setPhone] = useState("");
  const [crop, setCrop] = useState("Yellow Maize");
  const [market, setMarket] = useState("Agbogbloshie (Accra)");
  const [condition, setCondition] = useState<"Above" | "Below">("Above");
  const [targetPrice, setTargetPrice] = useState<string>("650");
  const [network, setNetwork] = useState("MTN");

  function handleSaveAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      toast.error("Please enter a valid Ghanaian mobile number.");
      return;
    }

    toast.success(`Target Price Alert Saved for ${phone}! You will receive an SMS when ${crop} price in ${market} goes ${condition.toLowerCase()} GH₵ ${targetPrice}.`);
    setPhone("");
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Bell className="w-4 h-4" />
            <span>Automated Profit Target Alerting</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Custom SMS Price Threshold Trigger Configuration
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set custom price targets for your crops. Receive an instant automated SMS the moment wholesale gate prices hit your profit target.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-primary text-primary-foreground px-3 py-1 rounded-lg">
          SHORTCODE 718
        </span>
      </div>

      <form onSubmit={handleSaveAlert} className="grid md:grid-cols-12 gap-6 items-end bg-background p-6 rounded-xl border border-border">
        <div className="md:col-span-3 space-y-1">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Mobile Phone Number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="024 123 4567"
            className="w-full text-xs font-mono font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Network Provider</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
          >
            <option value="MTN">MTN Ghana</option>
            <option value="Telecel">Telecel Ghana</option>
            <option value="AT">AT Ghana</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
          >
            <option value="Yellow Maize">Yellow Maize</option>
            <option value="Pona Yam">Pona Yam</option>
            <option value="Fresh Tomatoes">Fresh Tomatoes</option>
            <option value="Fresh Cassava">Fresh Cassava</option>
          </select>
        </div>

        <div className="md:col-span-3 space-y-1">
          <label className="block text-xs font-semibold text-muted-foreground uppercase">Target Market & Trigger Price</label>
          <div className="flex gap-2">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as "Above" | "Below")}
              className="w-20 text-xs font-semibold rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
            >
              <option value="Above">≥ (Over)</option>
              <option value="Below">≤ (Under)</option>
            </select>
            <div className="flex-1 flex items-center bg-card rounded-lg border border-border px-2">
              <span className="text-xs font-mono text-muted-foreground mr-1">GH₵</span>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full text-xs font-mono font-bold outline-none py-2"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Activate Alert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
