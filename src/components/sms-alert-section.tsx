import { useState, useEffect } from "react";
import { CROPS, MARKETS, subscribeSmsAlert, fetchUserSmsAlerts, cancelSmsAlert, type SmsAlertSubscription } from "@/lib/sms";
import { toast } from "sonner";
import { Bell, CheckCircle2, Phone, Trash2, Smartphone, ShieldCheck, Send } from "lucide-react";

export function SmsAlertSection() {
  const [phone, setPhone] = useState("+233 ");
  const [crop, setCrop] = useState(CROPS[0]);
  const [market, setMarket] = useState(MARKETS[0]);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [userAlerts, setUserAlerts] = useState<SmsAlertSubscription[]>([]);
  const [, setLoadingAlerts] = useState(false);

  // SMS Feature Phone Simulator State
  const [simCommand, setSimCommand] = useState("PRICE MAIZE");
  const [phoneMessages, setPhoneMessages] = useState<Array<{ sender: "user" | "system"; text: string; time: string }>>([
    {
      sender: "user",
      text: "PRICE MAIZE TECHIMAN",
      time: "10:14 AM",
    },
    {
      sender: "system",
      text: "[AgriFarm] Techiman Market Today: Maize GH₵ 620/100kg (+4.2%), Yam GH₵ 1,450/100 tubers. Verified 2h ago. Reply ALERT to subscribe.",
      time: "10:14 AM",
    },
  ]);

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

  function handleSimulateSend(cmdToRun?: string) {
    const cmd = (cmdToRun || simCommand).trim().toUpperCase();
    if (!cmd) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user" as const, text: cmd, time: timeNow };

    let replyText = "";
    if (cmd.startsWith("PRICE")) {
      const parts = cmd.split(" ");
      const cropName = parts[1] || "MAIZE";
      replyText = `[AgriFarm 718] Wholesale quote for ${cropName}: Techiman GH₵ 620, Kejetia GH₵ 635, Agbogbloshie GH₵ 650. Verified by field officers today.`;
    } else if (cmd.startsWith("ALERT")) {
      replyText = `[AgriFarm 718] Success! Alert set for ${cmd}. You will receive a text as soon as market prices update.`;
    } else {
      replyText = `[AgriFarm 718] Text 'PRICE [CROP]' (e.g. PRICE MAIZE) or 'ALERT [CROP] [PRICE]' to get live market prices across Ghana.`;
    }

    setPhoneMessages((prev) => [...prev, userMsg, { sender: "system" as const, text: replyText, time: timeNow }]);
    setSimCommand("");
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

      const marketLabel = market === "All Markets (Nationwide)" ? "nationwide" : `${market}`;
      const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const confirmationMsg = `[AgriFarm 718] Alert Subscribed! Phone ${cleanPhone} will receive instant SMS price updates for ${crop} (${marketLabel}).`;

      setPhoneMessages((prev) => [
        ...prev,
        { sender: "user" as const, text: `ALERT ${crop} ${market}`, time: timeNow },
        { sender: "system" as const, text: confirmationMsg, time: timeNow },
      ]);

      toast.success(`SMS Alert registered for ${crop} (${market})!`);
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
    <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-xs relative">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-4">
          <Smartphone className="w-3.5 h-3.5 text-primary" />
          <span>Works on basic feature phones & smartphones across Ghana</span>
        </div>

        <h3 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Ghana Wholesale SMS Market Intelligence
        </h3>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          No internet bundle required. Farmers and traders receive direct SMS price alerts or query live wholesale rates by texting shortcode <strong className="font-mono text-foreground">718</strong> from any network (MTN, Telecel, AT).
        </p>
      </div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-4 bg-background p-6 rounded-2xl border border-border">
          <h4 className="font-display font-semibold text-base text-foreground border-b border-border pb-3">
            Register Phone for Live Price Alerts
          </h4>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Ghanaian Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 123 4567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="bg-secondary px-1.5 py-0.5 rounded font-mono">MTN</span>
              <span className="bg-secondary px-1.5 py-0.5 rounded font-mono">Telecel</span>
              <span className="bg-secondary px-1.5 py-0.5 rounded font-mono">AT</span>
              <span>Supported across all 16 regions</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Market
              </label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Alert Price Threshold (GH₵, Optional)
            </label>
            <input
              type="number"
              min="1"
              step="5"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 600 (Triggers text when price reaches GH₵ 600)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>{submitting ? "Registering..." : "Activate SMS Alerts"}</span>
          </button>

          {/* User Active Alerts List */}
          {userAlerts.length > 0 && (
            <div className="pt-3 border-t border-border mt-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Your Subscriptions ({userAlerts.length})
              </h5>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {userAlerts.map((alert) => (
                  <div key={alert.id} className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{alert.crop}</span> — <span className="text-muted-foreground">{alert.market}</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{alert.phone_number}</p>
                    </div>
                    {alert.id && (
                      <button
                        onClick={() => handleRemove(alert.id!)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
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
        </form>

        {/* Feature Phone Interactive Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border-2 border-[color:var(--soil)] bg-[#1A261C] p-5 shadow-lg text-emerald-100">
            {/* Phone Screen Top Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 text-xs font-mono text-emerald-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>MTN GH · Shortcode 718</span>
              </div>
              <span>SMS LIVE SIMULATOR</span>
            </div>

            {/* Phone Screen Message Feed */}
            <div className="my-4 space-y-3 min-h-[220px] max-h-[260px] overflow-y-auto pr-1">
              {phoneMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 text-xs font-mono leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-700 text-white rounded-br-none"
                        : "bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-emerald-600 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Command Pills */}
            <div className="pt-2 border-t border-emerald-900/60">
              <p className="text-[11px] font-mono text-emerald-400 mb-2">Try SMS Command Samples:</p>
              <div className="flex flex-wrap gap-2">
                {["PRICE MAIZE", "PRICE YAM TECHIMAN", "PRICE TOMATO", "PRICE CASSAVA"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSimulateSend(sample)}
                    className="text-[10px] font-mono bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS Input Box */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={simCommand}
                onChange={(e) => setSimCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSimulateSend()}
                placeholder="Type SMS e.g. PRICE MAIZE"
                className="flex-1 bg-emerald-950 border border-emerald-800 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-100 placeholder:text-emerald-700 outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSimulateSend()}
                className="bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" /> Send
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="bg-card p-3.5 rounded-xl border border-border flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary flex-none mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium">Field Officer Verified</strong>
                <span>Prices submitted by verified officers at market gates every morning.</span>
              </div>
            </div>
            <div className="bg-card p-3.5 rounded-xl border border-border flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary flex-none mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium">Africa's Talking Gateway</strong>
                <span>Instant dispatch over USSD and SMS text pipelines.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

