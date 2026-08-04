import { useState } from "react";
import { Volume2, VolumeX, Play, Square, Mic, Globe } from "lucide-react";
import { toast } from "sonner";

interface LanguageVoice {
  lang: string;
  nativeName: string;
  region: string;
  sampleTranscript: string;
  englishTranslation: string;
}

const voiceLanguages: LanguageVoice[] = [
  {
    lang: "Twi (Asante / Fante)",
    nativeName: "Akan Kasa",
    region: "Ashanti, Bono East, Central & Eastern Regions",
    sampleTranscript: "Akwaaba ma AgriFarm Techiman dwa: Ɛnnɛ Aburo boɔ yɛ Cedi Ahansia aduonu (GH₵ 620) wɔ bag bɔne baako mu. Bayere boɔ yɛ Cedi Ahape baako ne Ahannron aduonum (GH₵ 1,450).",
    englishTranslation: "Welcome to AgriFarm Techiman Market: Today Maize price is GH₵ 620 per 100kg bag. Pona Yam is GH₵ 1,450 per 100 tubers.",
  },
  {
    lang: "Dagbani",
    nativeName: "Dagbanli",
    region: "Northern & Savannah Regions (Tamale Corridor)",
    sampleTranscript: "Wuni su n-kyɛ bɛ kpe AgriFarm Tamale daa: Zunɔɔ Kawi daa nyɛla Cedi ko’wobi la diba ayi (GH₵ 590) bagini. Nyuya daa nyɛla Cedi tusali ni koba naahi (GH₵ 1,380).",
    englishTranslation: "Welcome to AgriFarm Tamale Market: Today Maize is GH₵ 590 per bag. Yam is GH₵ 1,380 per 100 tubers.",
  },
  {
    lang: "Ga",
    nativeName: "Ga Wiemɔ",
    region: "Greater Accra Region (Agbogbloshie & Kaneshie)",
    sampleTranscript: "Ofai AgriFarm Agbogbloshie jra nɔ: Nmɛnɛ Abele jra ji Cedi Akpe kpakpa (GH₵ 660) yɛ bag kome mli. Amɔdiɔ jra ji Cedi Ohai etɛ gboo (GH₵ 380) yɛ akpɔkpɔ mli.",
    englishTranslation: "Welcome to AgriFarm Agbogbloshie Market: Today Maize is GH₵ 660 per bag. Fresh Tomatoes is GH₵ 380 per crate.",
  },
  {
    lang: "Ewe",
    nativeName: "Eʋegbe",
    region: "Volta & Oti Regions (Ho Central Market)",
    sampleTranscript: "Woezɔ ɖe AgriFarm Ho asime: Egbe Bli fia cedi alaafa ade eve (GH₵ 620) le akpɔkplɔ ɖeka me. Te fia cedi alaafa ene blaetɔ (GH₵ 1,420).",
    englishTranslation: "Welcome to AgriFarm Ho Market: Today Maize is GH₵ 620 per bag. Yam is GH₵ 1,420 per 100 tubers.",
  },
];

export function VoiceAudioSimulator() {
  const [selectedLang, setSelectedLang] = useState<LanguageVoice>(voiceLanguages[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlay() {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedLang.sampleTranscript);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      toast.success(`Playing IVR Voice Prompt in ${selectedLang.lang}`);
    } else {
      toast.error("Speech Synthesis not supported in this browser");
    }
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Globe className="w-4 h-4" />
            <span>Inclusive Local Language Accessibility</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Local Language Audio Voice IVR Hotline Simulator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Non-literate farmers dial AgriFarm voice hotlines to hear real-time market prices spoken in native dialects.
          </p>
        </div>

        {/* Language Selector Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {voiceLanguages.map((l) => (
            <button
              key={l.lang}
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsPlaying(false);
                setSelectedLang(l);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedLang.lang === l.lang ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Audio Player Box */}
        <div className="md:col-span-7 bg-background p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h4 className="font-display font-semibold text-base text-foreground">{selectedLang.lang} ({selectedLang.nativeName})</h4>
              <span className="text-xs text-muted-foreground">{selectedLang.region}</span>
            </div>
            <button
              onClick={togglePlay}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isPlaying ? "bg-red-600 text-white animate-pulse" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              title={isPlaying ? "Stop Voice" : "Play Voice Prompt"}
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" /> Audio Transcript (Native Dialect)
            </span>
            <p className="font-display italic text-sm text-foreground leading-relaxed">
              "{selectedLang.sampleTranscript}"
            </p>
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            <span className="font-semibold text-foreground">English Translation:</span>
            <p className="mt-0.5 leading-relaxed">{selectedLang.englishTranslation}</p>
          </div>
        </div>

        {/* Feature Explainer */}
        <div className="md:col-span-5 space-y-3 text-xs text-muted-foreground">
          <div className="bg-secondary/60 p-4 rounded-xl border border-border space-y-1.5">
            <strong className="block text-foreground font-semibold">Zero-Literacy Audio Gateway</strong>
            <p className="leading-relaxed">
              In rural Ghana, audio voice calls eliminate literacy barriers. Farmers dial the AgriFarm toll-free voice hotline and press <strong>1 for Twi</strong>, <strong>2 for Dagbani</strong>, <strong>3 for Ga</strong>, or <strong>4 for Ewe</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between font-mono">
            <span>Toll-Free Voice Line:</span>
            <span className="font-bold text-foreground bg-secondary px-2.5 py-1 rounded">0800 718 000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
