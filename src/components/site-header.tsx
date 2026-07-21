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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">A</span>
          AgriFarm
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">Home</Link>
          <Link to="/blog" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Journal</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-foreground transition">Admin</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</span>
              <button
                onClick={signOut}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
