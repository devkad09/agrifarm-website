import { useState } from "react";
import { Download, Printer, FileText, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

interface PrintableQuote {
  crop: string;
  market: string;
  price: string;
  unit: string;
  change: string;
  officer: string;
  timestamp: string;
}

const reportQuotes: PrintableQuote[] = [
  { crop: "Yellow Maize", market: "Techiman Market (Bono East)", price: "GH₵ 620", unit: "100kg bag", change: "+4.2%", officer: "Kwame Addo", timestamp: "07:30 AM" },
  { crop: "White Maize", market: "Kejetia Central (Kumasi)", price: "GH₵ 635", unit: "100kg bag", change: "+2.8%", officer: "Emmanuel Mensah", timestamp: "08:15 AM" },
  { crop: "Fresh Tomatoes", market: "Agbogbloshie (Accra)", price: "GH₵ 380", unit: "50kg Crate", change: "-6.1%", officer: "Abena Boateng", timestamp: "06:45 AM" },
  { crop: "Pona Yam", market: "Techiman Market (Bono East)", price: "GH₵ 1,450", unit: "100 Tubers", change: "+2.4%", officer: "Kwame Addo", timestamp: "07:30 AM" },
  { crop: "Fresh Cassava", market: "Tamale Central (Northern)", price: "GH₵ 210", unit: "100kg bag", change: "+1.8%", officer: "Ibrahim Alhassan", timestamp: "07:00 AM" },
  { crop: "Red Pepper", market: "Agbogbloshie (Accra)", price: "GH₵ 95", unit: "Olonka", change: "+8.3%", officer: "Abena Boateng", timestamp: "06:45 AM" },
];

export function PdfReportExporter() {
  const [showPreview, setShowPreview] = useState(false);

  function handleExportCsv() {
    const headers = "Crop,Market,Price (GHS),Unit,24h Change,Verified Officer,Timestamp\n";
    const rows = reportQuotes
      .map((q) => `"${q.crop}","${q.market}","${q.price}","${q.unit}","${q.change}","${q.officer}","${q.timestamp}"`)
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `agrifarm_wholesale_prices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded AgriFarm Wholesale Market Data Sheet (CSV)");
  }

  function handlePrintPdf() {
    window.print();
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <FileText className="w-4 h-4" />
            <span>Market Data Export & Extension Service</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Official Daily Market Price Bulletin & Exporter
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Export today's verified wholesale market quotes for university research, co-op notices, or government extension printing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Bulletin</span>
          </button>
        </div>
      </div>

      {/* Printable Bulletin Preview Container */}
      <div className="bg-background p-6 rounded-xl border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">A</span>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground">AgriFarm Daily Market Price Bulletin</h4>
              <span className="text-[10px] text-muted-foreground">Accra Technical University · Dept. of IST Capstone Project</span>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold bg-secondary px-2.5 py-1 rounded border border-border">
            Date: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* Printable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary text-muted-foreground uppercase font-mono text-[10px] border-b border-border">
              <tr>
                <th className="p-2.5">Crop</th>
                <th className="p-2.5">Market Location</th>
                <th className="p-2.5">Unit</th>
                <th className="p-2.5">Wholesale Price</th>
                <th className="p-2.5">24h Change</th>
                <th className="p-2.5">Verified Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportQuotes.map((q, idx) => (
                <tr key={idx} className="hover:bg-card/60 transition-colors font-medium">
                  <td className="p-2.5 font-display font-semibold text-foreground">{q.crop}</td>
                  <td className="p-2.5 text-muted-foreground">{q.market}</td>
                  <td className="p-2.5 text-muted-foreground">{q.unit}</td>
                  <td className="p-2.5 font-mono font-bold text-primary">{q.price}</td>
                  <td className={`p-2.5 font-mono ${q.change.startsWith("+") ? "text-emerald-700 font-semibold" : "text-red-600"}`}>{q.change}</td>
                  <td className="p-2.5 text-muted-foreground">{q.officer} ({q.timestamp})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Verified by Stationed Market Officers
          </span>
          <span>Shortcode: <strong className="font-mono text-foreground">718</strong></span>
        </div>
      </div>
    </div>
  );
}
