import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function refreshRole(u: User | null) {
      if (!u) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) setIsAdmin(!!data);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      refreshRole(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setUser(session?.user ?? null);
      refreshRole(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/80 shadow-2xs">
      <div className="container-page flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
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

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[150px] font-mono">{user.email}</span>
              <button
                onClick={signOut}
                className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

