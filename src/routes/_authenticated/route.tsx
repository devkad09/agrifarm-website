import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

async function getCurrentUser() {
  if (typeof window === "undefined") return null;
  if (auth.currentUser) return auth.currentUser;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 2500);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timer);
      unsubscribe();
      resolve(user);
    });
  });
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return { user: null };
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/auth" });
    }
    return { user };
  },
  component: () => <Outlet />,
});

