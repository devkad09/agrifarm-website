import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu, X, Smartphone, ArrowRight } from "lucide-react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!mounted) return;
      setUser(u);
      if (u) {
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (mounted && userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin");
          } else if (mounted) {
            setIsAdmin(false);
          }
        } catch {
          if (mounted) setIsAdmin(false);
        }
      } else {
        if (mounted) setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function signOut() {
    await firebaseSignOut(auth);
    navigate({ to: "/" });
  }

  const navLinks = [
    { label: "Commodities", href: "#exchange" },
    { label: "Compare Markets", href: "#comparison" },
    { label: "Unit/kg Converter", href: "#converter" },
    { label: "Logistics Map", href: "#logistics" },
    { label: "Freight Calculator", href: "#calculator" },
    { label: "Profit Planner", href: "#planner" },
    { label: "Weather & Roads", href: "#weather" },
    { label: "Crop Health", href: "#crop-health" },
    { label: "Harvest Calendar", href: "#calendar" },
    { label: "Trade Board", href: "#trade-board" },
    { label: "PFJ Subsidies", href: "#subsidies" },
    { label: "Phrasebook", href: "#voice" },
    { label: "USSD *718#", href: "#ussd" },
    { label: "Price Alert", href: "#threshold-alert" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
      <div className="container-page flex items-center justify-between h-16">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs group-hover:bg-primary/90 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3v18M12 3c-4 0-8 3.5-8 8.5C4 16.5 8 20 12 21M12 3c4 0 8 3.5 8 8.5 0 5-4 8.5-8 9.5M12 12c-3-2-6-1-7 2M12 12c3-2 6-1 7 2" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight tracking-tight text-foreground">
                AgriFarm
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Ghana Crop Intelligence
              </span>
            </div>
          </Link>

          {/* Live Market Status Pill */}
          <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-[11px] font-medium text-secondary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>8 Wholesale Markets Live</span>
          </div>
        </div>

        {/* Desktop Navigation Header */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium">
          <a href="#exchange" className="text-muted-foreground hover:text-foreground transition-colors">
            Commodities
          </a>
          <a href="#comparison" className="text-muted-foreground hover:text-foreground transition-colors">
            Compare
          </a>
          <a href="#logistics" className="text-muted-foreground hover:text-foreground transition-colors">
            Logistics Map
          </a>
          <a href="#crop-health" className="text-muted-foreground hover:text-foreground transition-colors">
            Crop Health
          </a>
          <a href="#subsidies" className="text-muted-foreground hover:text-foreground transition-colors">
            PFJ Subsidies
          </a>
          <a href="#threshold-alert" className="text-muted-foreground hover:text-foreground transition-colors">
            Price Alert
          </a>
          <a href="#ussd" className="text-muted-foreground hover:text-foreground transition-colors font-mono">
            *718#
          </a>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>
            Journal
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary font-semibold hover:underline">
              Officer Portal
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[140px] font-mono">{user.email}</span>
              <button
                onClick={signOut}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-primary text-primary-foreground px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs whitespace-nowrap"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-border bg-background p-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium pb-3 border-b border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground flex items-center justify-between transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Field Journal & Extension Updates
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Market Officer Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
