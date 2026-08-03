import { useState } from "react";
import { UserCheck, ShieldCheck, MapPin, CheckCircle, Clock } from "lucide-react";

interface Officer {
  id: string;
  name: string;
  market: string;
  region: string;
  phoneShort: string;
  reportsSubmitted: number;
  lastActive: string;
  status: "Verified On-Duty" | "Field Audit";
}

const fieldOfficers: Officer[] = [
  { id: "OFF-101", name: "Kwame Addo", market: "Techiman Wholesale Market", region: "Bono East", phoneShort: "+233 24 *** 8912", reportsSubmitted: 1420, lastActive: "Today, 07:30 AM", status: "Verified On-Duty" },
  { id: "OFF-102", name: "Emmanuel Mensah", market: "Kejetia Central Market", region: "Kumasi, Ashanti", phoneShort: "+233 20 *** 4410", reportsSubmitted: 1285, lastActive: "Today, 08:15 AM", status: "Verified On-Duty" },
  { id: "OFF-103", name: "Abena Boateng", market: "Agbogbloshie Market Gate", region: "Accra, Greater Accra", phoneShort: "+233 55 *** 9901", reportsSubmitted: 1150, lastActive: "Today, 06:45 AM", status: "Verified On-Duty" },
  { id: "OFF-104", name: "Ibrahim Alhassan", market: "Tamale Central Market", region: "Northern Region", phoneShort: "+233 24 *** 3321", reportsSubmitted: 980, lastActive: "Today, 07:00 AM", status: "Verified On-Duty" },
  { id: "OFF-105", name: "Samuel Quaye", market: "Kaneshie Food Hub", region: "Accra, Greater Accra", phoneShort: "+233 27 *** 1156", reportsSubmitted: 840, lastActive: "Today, 08:00 AM", status: "Verified On-Duty" },
  { id: "OFF-106", name: "Grace Kumi", market: "Ho Central Market", region: "Volta Region", phoneShort: "+233 24 *** 7780", reportsSubmitted: 620, lastActive: "Yesterday", status: "Field Audit" },
];

export function FieldOfficersDirectory() {
  const [filterRegion, setFilterRegion] = useState("All");

  const filteredOfficers = fieldOfficers.filter((o) => {
    if (filterRegion === "All") return true;
    return o.region.includes(filterRegion);
  });

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Field Governance & Quality Assurance</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Verified Market Gate Officers
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prices published on AgriFarm are recorded live every morning by stationed officers at wholesale market gates.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
          {["All", "Bono East", "Ashanti", "Accra", "Northern"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRegion(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterRegion === r ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficers.map((officer) => (
          <div key={officer.id} className="p-4 rounded-xl border border-border bg-background space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-bold text-xs">
                  {officer.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">{officer.name}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground">{officer.id}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                <CheckCircle className="w-3 h-3" /> {officer.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground border-t border-border/60 pt-2">
              <p className="flex items-center gap-1 text-foreground font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary flex-none" /> {officer.market}
              </p>
              <p className="text-[11px]">{officer.region}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
              <span>{officer.reportsSubmitted} Logs</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {officer.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
