import { useState } from "react";
import { Globe, BookOpen, FileText } from "lucide-react";

interface TranslationItem {
  cropKey: string;
  cropEn: string;
  marketEn: string;
  priceGhs: number;
  unitEn: string;
  translations: Record<
    string,
    {
      nativeText: string;
      phonetic: string;
      cropWord: string;
      marketWord: string;
      priceWord: string;
      translationNotes: string;
    }
  >;
}

const translationDatabase: TranslationItem[] = [
  {
    cropKey: "maize",
    cropEn: "Yellow Maize",
    marketEn: "Techiman Market",
    priceGhs: 620,
    unitEn: "100kg bag",
    translations: {
      twi: {
        nativeText: "Akwaaba! Ɛnnɛ Aburo boɔ wɔ Techiman dwa mu yɛ Cedi Ahansia aduonu (GH₵ 620) wɔ bag baako mu.",
        phonetic: "Ak-waa-ba! En-ne Ah-bu-ro bo-oh wo Techiman dwa mu ye Cedi A-han-si-a a-du-o-nu wo bag baa-ko mu.",
        cropWord: "Aburo (Maize)",
        marketWord: "Techiman Dwa (Techiman Market)",
        priceWord: "Boɔ (Price) = GH₵ 620",
        translationNotes: "'Aburo' means Maize/Corn in Twi. 'Boɔ' means cost/price. 'Ahansia aduonu' is 620.",
      },
      dagbani: {
        nativeText: "Wuni su n-kyɛ! Zunɔɔ Kawi daa nyɛla Cedi ko’wobi la diba ayi (GH₵ 620) Techiman daa ni.",
        phonetic: "Wu-ni su n-kye! Zu-noh Ka-wi daa nye-la Cedi ko-wo-bi la di-ba a-yi Techiman daa ni.",
        cropWord: "Kawi (Maize)",
        marketWord: "Techiman Daa (Techiman Market)",
        priceWord: "Daa / Daabu (Price) = GH₵ 620",
        translationNotes: "'Kawi' means Maize in Dagbani. 'Daa' means market.",
      },
      ga: {
        nativeText: "Ofai! Nmɛnɛ Abele jra yɛ Techiman jra nɔ ji Cedi Akpe kpakpa sɔŋ (GH₵ 620) yɛ bag kome mli.",
        phonetic: "O-fai! N-me-ne A-be-le jra ye Techiman jra no ji Cedi A-kpe kpa-kpa ye bag ko-me mli.",
        cropWord: "Abele (Maize)",
        marketWord: "Techiman Jra (Techiman Market)",
        priceWord: "Jra nɔ (Market Price) = GH₵ 620",
        translationNotes: "'Abele' is the Ga term for Corn/Maize. 'Nmɛnɛ' means Today.",
      },
      ewe: {
        nativeText: "Woezɔ! Egbe Bli fia cedi alaafa ade eve (GH₵ 620) le Techiman asime le akpɔkplɔ ɖeka me.",
        phonetic: "Way-zor! Eg-be Bli fia cedi a-laa-fa a-de e-ve le Techiman a-si-me le ak-por-kplor de-ka me.",
        cropWord: "Bli (Maize)",
        marketWord: "Techiman Asime (Techiman Market)",
        priceWord: "Asi / Fia (Price) = GH₵ 620",
        translationNotes: "'Bli' means Maize in Ewe. 'Asime' means Market.",
      },
      hausa: {
        nativeText: "Sannu da zuwa! Yau farashin Masara a Kasuwar Techiman shinkafa ce Cedi dari shida da biyu (GH₵ 620).",
        phonetic: "San-nu da zu-wa! Yau fa-ra-shin Ma-sa-ra a Ka-su-war Techiman shin-ka-fa ce Cedi da-ri shi-da da bi-yu.",
        cropWord: "Masara (Maize)",
        marketWord: "Kasuwar Techiman (Techiman Market)",
        priceWord: "Farashi (Price) = GH₵ 620",
        translationNotes: "'Masara' means Corn/Maize in Hausa. 'Kasuwa' means Market.",
      },
    },
  },
  {
    cropKey: "yam",
    cropEn: "Pona Yam",
    marketEn: "Kejetia Market (Kumasi)",
    priceGhs: 1450,
    unitEn: "100 tubers",
    translations: {
      twi: {
        nativeText: "Akwaaba! Ɛnnɛ Pona Bayere boɔ wɔ Kejetia dwa mu yɛ Cedi Ahape baako ne Ahannron aduonum (GH₵ 1,450).",
        phonetic: "Ak-waa-ba! En-ne Po-na Ba-ye-re bo-oh wo Kejetia dwa mu ye Cedi A-ha-pe baa-ko ne A-han-nron a-du-o-num.",
        cropWord: "Bayere (Yam)",
        marketWord: "Kejetia Dwa (Kejetia Market)",
        priceWord: "Boɔ (Price) = GH₵ 1,450",
        translationNotes: "'Bayere' is Yam in Twi. 'Ahape baako ne Ahannron aduonum' is 1,450.",
      },
      dagbani: {
        nativeText: "Wuni su n-kyɛ! Zunɔɔ Nyuya daa nyɛla Cedi tusali ni koba naahi ni pihinu (GH₵ 1,450) Kejetia daa ni.",
        phonetic: "Wu-ni su n-kye! Zu-noh Nyu-ya daa nye-la Cedi tu-sa-li ni ko-ba naa-hi ni pi-hi-nu Kejetia daa ni.",
        cropWord: "Nyuya (Yam)",
        marketWord: "Kejetia Daa (Kejetia Market)",
        priceWord: "Daa (Price) = GH₵ 1,450",
        translationNotes: "'Nyuya' is Yam in Dagbani.",
      },
      ga: {
        nativeText: "Ofai! Nmɛnɛ Yele jra yɛ Kejetia jra nɔ ji Cedi Akpe kome kɛ Ohai etɛ (GH₵ 1,450).",
        phonetic: "O-fai! N-me-ne Ye-le jra ye Kejetia jra no ji Cedi A-kpe ko-me ke O-hai e-te.",
        cropWord: "Yele (Yam)",
        marketWord: "Kejetia Jra (Kejetia Market)",
        priceWord: "Jra nɔ (Price) = GH₵ 1,450",
        translationNotes: "'Yele' is Yam in Ga.",
      },
      ewe: {
        nativeText: "Woezɔ! Egbe Te fia cedi alaafa ene blaetɔ (GH₵ 1,450) le Kejetia asime.",
        phonetic: "Way-zor! Eg-be Te fia cedi a-laa-fa e-ne bla-e-tor le Kejetia a-si-me.",
        cropWord: "Te (Yam)",
        marketWord: "Kejetia Asime (Kejetia Market)",
        priceWord: "Asi / Fia (Price) = GH₵ 1,450",
        translationNotes: "'Te' is Yam in Ewe.",
      },
      hausa: {
        nativeText: "Sannu da zuwa! Yau farashin Doya a Kasuwar Kejetia cedi dubu daya da dari hudu da hamsin ne (GH₵ 1,450).",
        phonetic: "San-nu da zu-wa! Yau fa-ra-shin Do-ya a Ka-su-war Kejetia cedi du-bu da-ya da da-ri hu-du da ham-sin ne.",
        cropWord: "Doya (Yam)",
        marketWord: "Kasuwar Kejetia (Kejetia Market)",
        priceWord: "Farashi (Price) = GH₵ 1,450",
        translationNotes: "'Doya' is Yam in Hausa.",
      },
    },
  },
  {
    cropKey: "tomato",
    cropEn: "Fresh Tomatoes",
    marketEn: "Agbogbloshie Market (Accra)",
    priceGhs: 380,
    unitEn: "50kg Crate",
    translations: {
      twi: {
        nativeText: "Akwaaba! Ɛnnɛ Ntosom boɔ wɔ Agbogbloshie dwa mu yɛ Cedi Ahansia aduatee (GH₵ 380) wɔ kente bɔne baako mu.",
        phonetic: "Ak-waa-ba! En-ne N-to-som bo-oh wo Agbogbloshie dwa mu ye Cedi A-han-si-a a-du-a-tee.",
        cropWord: "Ntosom / Ntoosi (Tomatoes)",
        marketWord: "Agbogbloshie Dwa (Accra Market)",
        priceWord: "Boɔ (Price) = GH₵ 380",
        translationNotes: "'Ntosom' is Tomato in Twi.",
      },
      dagbani: {
        nativeText: "Wuni su n-kyɛ! Zunɔɔ Kamantoosi daa nyɛla Cedi koba etɛ ni pihieyi (GH₵ 380) Agbogbloshie daa ni.",
        phonetic: "Wu-ni su n-kye! Zu-noh Ka-man-too-si daa nye-la Cedi ko-ba e-te ni pi-hi-e-yi.",
        cropWord: "Kamantoosi (Tomatoes)",
        marketWord: "Agbogbloshie Daa (Accra Market)",
        priceWord: "Daa (Price) = GH₵ 380",
        translationNotes: "'Kamantoosi' is Tomato in Dagbani.",
      },
      ga: {
        nativeText: "Ofai! Nmɛnɛ Amɔdiɔ jra yɛ Agbogbloshie jra nɔ ji Cedi Ohai etɛ gboo (GH₵ 380) yɛ akpɔkpɔ mli.",
        phonetic: "O-fai! N-me-ne A-mo-dio jra ye Agbogbloshie jra no ji Cedi O-hai e-te gboo.",
        cropWord: "Amɔdiɔ (Tomatoes)",
        marketWord: "Agbogbloshie Jra (Accra Market)",
        priceWord: "Jra nɔ (Price) = GH₵ 380",
        translationNotes: "'Amɔdiɔ' is Tomato in Ga.",
      },
      ewe: {
        nativeText: "Woezɔ! Egbe Timati fia cedi alaafa etɔ blaenyi (GH₵ 380) le Agbogbloshie asime.",
        phonetic: "Way-zor! Eg-be Ti-ma-ti fia cedi a-laa-fa e-tor blae-nyi le Agbogbloshie a-si-me.",
        cropWord: "Timati / Agbitima (Tomatoes)",
        marketWord: "Agbogbloshie Asime (Accra Market)",
        priceWord: "Fia (Price) = GH₵ 380",
        translationNotes: "'Timati' is Tomato in Ewe.",
      },
      hausa: {
        nativeText: "Sannu da zuwa! Yau farashin Tumatur a Kasuwar Agbogbloshie Cedi dari uku da tamanin ne (GH₵ 380).",
        phonetic: "San-nu da zu-wa! Yau fa-ra-shin Tu-ma-tur a Ka-su-war Agbogbloshie Cedi da-ri u-ku da ta-ma-nin ne.",
        cropWord: "Tumatur (Tomatoes)",
        marketWord: "Kasuwar Agbogbloshie (Accra Market)",
        priceWord: "Farashi (Price) = GH₵ 380",
        translationNotes: "'Tumatur' is Tomato in Hausa.",
      },
    },
  },
];

const languageOptions = [
  { key: "twi", name: "Twi (Asante / Fante)", native: "Akan Kasa", region: "Ashanti, Bono East, Central & Eastern" },
  { key: "dagbani", name: "Dagbani", native: "Dagbanli", region: "Northern & Savannah (Tamale Corridor)" },
  { key: "ga", name: "Ga", native: "Ga Wiemɔ", region: "Greater Accra (Agbogbloshie & Kaneshie)" },
  { key: "ewe", name: "Ewe", native: "Eʋegbe", region: "Volta & Oti Regions (Ho Market)" },
  { key: "hausa", name: "Hausa", native: "Harshen Hausa", region: "Zongo Markets & Cross-Border Traders" },
];

export function VoiceAudioSimulator() {
  const [selectedCropKey, setSelectedCropKey] = useState("maize");
  const [selectedLangKey, setSelectedLangKey] = useState("twi");

  const activeItem = translationDatabase.find((item) => item.cropKey === selectedCropKey) || translationDatabase[0];
  const activeLangConfig = languageOptions.find((l) => l.key === selectedLangKey) || languageOptions[0];
  const activeTranslation = activeItem.translations[selectedLangKey] || activeItem.translations["twi"];

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Globe className="w-4 h-4" />
            <span>Multilingual Market Phrasebook & Dictionary</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghanaian Agricultural Written Language Phrasebook
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Read authentic market price sentence translations, vocabulary keys, and phonetic guides in Twi, Dagbani, Ga, Ewe, and Hausa.
          </p>
        </div>

        {/* Commodity Selector Pills */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {translationDatabase.map((item) => (
            <button
              key={item.cropKey}
              onClick={() => setSelectedCropKey(item.cropKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCropKey === item.cropKey ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.cropEn}
            </button>
          ))}
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase mr-1">Target Language:</span>
        {languageOptions.map((lang) => (
          <button
            key={lang.key}
            onClick={() => setSelectedLangKey(lang.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedLangKey === lang.key
                ? "bg-foreground text-background shadow-2xs"
                : "bg-background text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {lang.name} <span className="opacity-70">({lang.native})</span>
          </button>
        ))}
      </div>

      {/* Main Written Translation Output Area */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Translation Output Card */}
        <div className="md:col-span-7 bg-background p-6 rounded-xl border border-border space-y-4">
          <div className="border-b border-border pb-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
              {activeLangConfig.name} ({activeLangConfig.native})
            </span>
            <span className="text-[11px] text-muted-foreground">{activeLangConfig.region}</span>
          </div>

          {/* Authentic Native Script */}
          <div className="bg-card p-4 rounded-xl border border-border space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Written Native Dialect Sentence:
            </span>
            <p className="font-display font-semibold text-lg text-foreground leading-relaxed">
              "{activeTranslation.nativeText}"
            </p>
          </div>

          {/* Phonetic Pronunciation Guide */}
          <div className="bg-secondary/60 p-4 rounded-xl border border-border space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider block">
              Phonetic Pronunciation Guide:
            </span>
            <p className="font-mono text-xs text-foreground leading-relaxed">
              {activeTranslation.phonetic}
            </p>
          </div>
        </div>

        {/* Agricultural Vocabulary Breakdown */}
        <div className="md:col-span-5 space-y-3 text-xs">
          <div className="bg-card p-4 rounded-xl border border-border space-y-2.5">
            <h4 className="font-display font-semibold text-sm text-foreground flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" /> Agricultural Vocabulary Key
            </h4>
            <div className="space-y-1.5 text-muted-foreground">
              <div className="p-2 rounded bg-background border border-border flex justify-between">
                <span className="text-muted-foreground">Crop Term:</span>
                <strong className="text-foreground font-semibold">{activeTranslation.cropWord}</strong>
              </div>
              <div className="p-2 rounded bg-background border border-border flex justify-between">
                <span className="text-muted-foreground">Market Hub:</span>
                <strong className="text-foreground font-semibold">{activeTranslation.marketWord}</strong>
              </div>
              <div className="p-2 rounded bg-background border border-border flex justify-between">
                <span className="text-muted-foreground">Price Metric:</span>
                <strong className="text-foreground font-mono font-bold">{activeTranslation.priceWord}</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 text-muted-foreground text-[11px] leading-relaxed">
            <strong className="block text-foreground font-semibold mb-0.5">Linguistic Context Note:</strong>
            {activeTranslation.translationNotes}
          </div>
        </div>
      </div>
    </div>
  );
}
