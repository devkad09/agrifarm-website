import { useState, useEffect } from "react";
import { CROPS, MARKETS, subscribeSmsAlert, fetchUserSmsAlerts, cancelSmsAlert, type SmsAlertSubscription } from "@/lib/sms";
import { toast } from "sonner";
import { Bell, CheckCircle2, Phone, Sparkles, Trash2, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SmsAlertSection() {
  const [phone, setPhone] = useState("+233 ");
  const [crop, setCrop] = useState(CROPS[0]);
  const [market, setMarket] = useState(MARKETS[0]);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [userAlerts, setUserAlerts] = useState<SmsAlertSubscription[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [lastNotification, setLastNotification] = useState<{ phone: string; message: string } | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setLoadingAlerts(true);
    try {
      const data = await fetchUserSmsAlerts();
      setUserAlerts(data);
    } catch {
      // ignore empty alerts
    } finally {
      setLoadingAlerts(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 9) {
      toast.error("Please enter a valid Ghanaian phone number (e.g. +233 24 123 4567)");
      return;
    }

    setSubmitting(true);
    try {
      const numericPrice = targetPrice ? parseFloat(targetPrice) : null;
      await subscribeSmsAlert({
        phone_number: cleanPhone,
        crop,
        market,
        target_price: numericPrice,
      });

      const marketLabel = market === "All Markets (Nationwide)" ? "any market nationwide" : `${market} market`;
      const sampleSmsMessage = `[AgriFarm Alert] Subscribed successfully! We will text ${cleanPhone} whenever ${crop} price updates across ${marketLabel}. Latest quote: GH₵ ${crop === "Maize" ? "620" : "480"}.`;

      setLastNotification({
        phone: cleanPhone,
        message: sampleSmsMessage,
      });

      toast.success(`SMS Alert subscribed for ${crop} (${market})!`);
      loadAlerts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe to SMS alert");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await cancelSmsAlert(id);
      toast.success("SMS Alert subscription canceled");
      loadAlerts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove alert");
    }
  }

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-10 shadow-xl relative overflow-hidden">
      {/* Decorative accent element */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-time SMS Service · Powered by Africa's Talking</span>
        </div>

        <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Subscribe to Live SMS Market Price Alerts
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Never miss a price surge. Get an automated SMS text directly to your phone when prices update or reach your custom target price — works on feature phones and smartphones across Ghana.
        </p>
      </div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 bg-card/80 p-6 rounded-2xl border border-border/80 backdrop-blur-sm shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Ghana Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 123 4567"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">e.g. MTN, Telecel, or AT number</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Target Market
              </label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {MARKETS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Alert Threshold Price (GH₵ per 100kg bag, optional)
            </label>
            <input
              type="number"
              min="1"
              step="5"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 600 (Alert if price reaches or exceeds GH₵ 600)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>{submitting ? "Subscribing..." : "Activate Free SMS Alerts"}</span>
          </button>
        </form>

        {/* Feature / Simulation Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-base">How SMS Delivery Works</h4>
                <p className="text-xs text-muted-foreground">Zero data cost for farmers</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-none" />
                <span>Instant dispatch when field officers report price updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-none" />
                <span>Supports feature phones (basic Nokia / Itel) & smartphones</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary flex-none" />
                <span>Verified prices only — no spam or unverified rumours</span>
              </li>
            </ul>
          </div>

          {/* Test SMS Dispatch Drawer/Simulation */}
          {lastNotification && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl transition-all animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  SMS Dispatch Simulation
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-0.5 rounded">
                  SENT
                </span>
              </div>
              <p className="mt-2 text-xs font-mono bg-background/80 p-3 rounded-lg border border-border text-foreground leading-relaxed">
                "{lastNotification.message}"
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground text-right">To: {lastNotification.phone}</p>
            </div>
          )}

          {/* User Active Alerts List */}
          {userAlerts.length > 0 && (
            <div className="bg-card p-4 rounded-2xl border border-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Your Active SMS Subscriptions ({userAlerts.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {userAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-xl border border-border bg-background/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{alert.crop}</span> @ <span className="text-muted-foreground">{alert.market}</span>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{alert.phone_number}</p>
                    </div>
                    {alert.id && (
                      <button
                        onClick={() => handleRemove(alert.id!)}
                        className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-colors"
                        title="Cancel alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
