import { useState } from "react";
import { PhoneCall, Send, RotateCcw, Smartphone, Check } from "lucide-react";

export function UssdSimulator() {
  const [screenText, setScreenText] = useState<string>(
    "Welcome to AgriFarm *718#\n\n1. Live Crop Prices\n2. Compare Markets\n3. Set SMS Price Alert\n4. Contact Field Officer\n\nSelect option (1-4):"
  );
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState<"home" | "prices" | "compare" | "alert" | "officer">("home");

  function handleSend(valOverride?: string) {
    const input = (valOverride || inputValue).trim();
    if (!input) return;

    if (currentStep === "home") {
      if (input === "1") {
        setScreenText(
          "AgriFarm Wholesale Prices Today:\n\n1. Maize - GH₵ 620/100kg (Techiman)\n2. Yam - GH₵ 1,450/100 tubers\n3. Tomato - GH₵ 380/crate\n4. Cassava - GH₵ 210/100kg\n\n0. Back"
        );
        setCurrentStep("prices");
      } else if (input === "2") {
        setScreenText(
          "Market Comparison (Yellow Maize):\n\n- Techiman: GH₵ 620\n- Kejetia (Kumasi): GH₵ 635\n- Agbogbloshie (Accra): GH₵ 660\n\nSpread: +GH₵ 40/bag\n\n0. Back"
        );
        setCurrentStep("compare");
      } else if (input === "3") {
        setScreenText(
          "Set SMS Price Alert:\n\nSend SMS text:\n'ALERT [CROP] [PRICE]'\nto 718.\n\nExample: ALERT MAIZE 600\n\n0. Back"
        );
        setCurrentStep("alert");
      } else if (input === "4") {
        setScreenText(
          "Field Officer Hotline:\n\n- Techiman: Kwame Addo (+233 24 123 8912)\n- Kejetia: E. Mensah (+233 20 441 0012)\n- Accra: A. Boateng (+233 55 990 1234)\n\n0. Back"
        );
        setCurrentStep("officer");
      } else {
        setScreenText("Invalid option. Please enter 1, 2, 3, or 4:\n\n1. Prices\n2. Compare\n3. Alerts\n4. Officer");
      }
    } else {
      if (input === "0") {
        resetUssd();
      } else {
        setScreenText(`Option ${input} selected.\n\n[AgriFarm 718] Request processed successfully.\n\n0. Back to Main Menu`);
      }
    }

    setInputValue("");
  }

  function resetUssd() {
    setScreenText(
      "Welcome to AgriFarm *718#\n\n1. Live Crop Prices\n2. Compare Markets\n3. Set SMS Price Alert\n4. Contact Field Officer\n\nSelect option (1-4):"
    );
    setCurrentStep("home");
    setInputValue("");
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Feature Phone USSD Menu Integration</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Dial *718# USSD Interactive Simulator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test how smallholder farmers query wholesale prices on non-smartphones without internet or mobile data.
          </p>
        </div>

        <button
          onClick={resetUssd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary text-xs font-semibold hover:bg-border transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Dial Screen
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* USSD Phone Screen */}
        <div className="lg:col-span-6 max-w-sm mx-auto w-full">
          <div className="rounded-3xl border-4 border-[color:var(--soil)] bg-[#101912] p-6 shadow-xl text-emerald-300 space-y-4">
            {/* Phone Screen Top Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2 font-mono text-xs text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>USSD *718#</span>
              </span>
              <span>MTN / TELECEL / AT</span>
            </div>

            {/* Screen Content Box */}
            <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl font-mono text-xs text-emerald-200 leading-relaxed whitespace-pre-wrap min-h-[160px]">
              {screenText}
            </div>

            {/* Keypad Input Row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Enter option (e.g. 1)"
                className="flex-1 bg-emerald-950 border border-emerald-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-100 placeholder:text-emerald-700 outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Reply
              </button>
            </div>

            {/* Simulated Keypad Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-900/60">
              {["1", "2", "3", "4", "0"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSend(num)}
                  className="bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={resetUssd}
                className="col-span-3 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                END CALL
              </button>
            </div>
          </div>
        </div>

        {/* Feature Explainer */}
        <div className="lg:col-span-6 space-y-4 text-xs text-muted-foreground">
          <div className="bg-background p-4 rounded-xl border border-border space-y-2">
            <h4 className="font-display font-semibold text-base text-foreground">Why USSD *718# Matters for Ghanaian Farmers</h4>
            <p className="leading-relaxed">
              Over 65% of smallholder farmers in rural Ghana operate basic feature phones (Nokia, Itel) without active internet bundles. The AgriFarm USSD shortcode gateway operates over standard cellular voice/signal pipelines at zero data cost.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-card rounded-xl border border-border flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary flex-none mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium">Instant Live Quotes</strong>
                <span>Dial *718# &rarr; Select crop to view today's wholesale gate price.</span>
              </div>
            </div>

            <div className="p-3.5 bg-card rounded-xl border border-border flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary flex-none mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium">Direct Officer Hotline</strong>
                <span>Connect directly with on-duty market officers at Techiman or Kejetia.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
