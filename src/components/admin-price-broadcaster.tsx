import { useState } from "react";
import { CROPS, MARKETS, broadcastPriceUpdateSmsAlerts } from "@/lib/sms";
import { toast } from "sonner";
import { Send, TrendingUp, Radio, CheckCircle2, PhoneCall, Sparkles } from "lucide-react";

export function AdminPriceBroadcaster() {
  const [crop, setCrop] = useState(CROPS[0]);
  const [market, setMarket] = useState(MARKETS[1] || "Techiman"); // Default Techiman
  const [oldPrice, setOldPrice] = useState("620");
  const [newPrice, setNewPrice] = useState("650");
  const [broadcasting, setBroadcasting] = useState(false);
  const [resultLog, setResultLog] = useState<{
    count: number;
    dispatchedLog: Array<{ id?: string; phone_number: string; message: string; sent_at: string }>;
  } | null>(null);

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();

    const nPrice = parseFloat(newPrice);
    const oPrice = parseFloat(oldPrice);

    if (isNaN(nPrice) || nPrice <= 0) {
      toast.error("Please enter a valid new price");
      return;
    }

    setBroadcasting(true);
    try {
      const res = await broadcastPriceUpdateSmsAlerts({
        crop,
        market: market === "All Markets (Nationwide)" ? "Techiman" : market,
        newPrice: nPrice,
        oldPrice: isNaN(oPrice) ? undefined : oPrice,
      });

      setResultLog(res);
      toast.success(`Updated ${crop} price to GH₵ ${nPrice}! SMS alert dispatched to ${res.count} subscriber(s).`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to broadcast SMS update");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Update Market Prices & Broadcast SMS Alerts</h3>
            <p className="text-xs text-muted-foreground">Publish price updates and dispatch automated SMS texts to all subscribers</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> SMS Gateway Active
        </span>
      </div>

      <form onSubmit={handleBroadcast} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Market</label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {MARKETS.filter((m) => m !== "All Markets (Nationwide)").map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Previous Price (GH₵)</label>
          <input
            type="number"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="620"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Updated Price (GH₵)</label>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="650"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 mt-2">
          <button
            type="submit"
            disabled={broadcasting}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{broadcasting ? "Broadcasting SMS Alerts..." : `Publish Update & Send SMS to ${crop} Subscribers`}</span>
          </button>
        </div>
      </form>

      {/* Broadcast Execution Results */}
      {resultLog && (
        <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Broadcast Complete — Dispatched to {resultLog.count} Subscriber(s)
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {resultLog.dispatchedLog.length > 0 ? (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {resultLog.dispatchedLog.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-border bg-background/80 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-primary flex-none" />
                    <span className="font-bold">{log.phone_number}:</span>
                    <span className="text-muted-foreground truncate max-w-md">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 self-start sm:self-auto">
                    {(log as any).status || "DELIVERED"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              No active subscribers found matching crop <strong>{crop}</strong> yet. Subscribe a phone number on the home page to test receiving updates!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
