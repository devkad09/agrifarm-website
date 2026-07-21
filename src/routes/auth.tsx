import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · AgriFarm" },
      { name: "description", content: "Sign in or create your AgriFarm account to save price alerts and follow markets." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().max(20).optional(),
  region: z.string().trim().max(60).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    region: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: parsed.data.full_name,
              phone: parsed.data.phone ?? "",
              region: parsed.data.region ?? "",
            },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome to AgriFarm!");
        navigate({ to: "/" });
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container-page h-16 flex items-center">
          <Link to="/" className="font-display text-lg font-semibold flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">A</span>
            AgriFarm
          </Link>
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="font-display text-3xl font-semibold">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to save alerts and follow your markets."
                : "Join AgriFarm to get price alerts tailored to your crops."}
            </p>

            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary transition disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.12A6.98 6.98 0 0 1 5.5 12c0-.74.13-1.45.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.96l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">or with email</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <>
                  <Field label="Full name" value={form.full_name} onChange={onChange("full_name")} placeholder="Ama Mensah" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Phone (optional)" value={form.phone} onChange={onChange("phone")} placeholder="+233 …" />
                    <Field label="Region (optional)" value={form.region} onChange={onChange("region")} placeholder="Bono East" />
                  </div>
                </>
              )}
              <Field label="Email" type="email" value={form.email} onChange={onChange("email")} placeholder="you@example.com" required />
              <Field label="Password" type="password" value={form.password} onChange={onChange("password")} placeholder="At least 6 characters" required />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-muted-foreground">
              {mode === "signin" ? "New to AgriFarm?" : "Already have an account?"}{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
