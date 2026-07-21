export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">A</span>
          <span>AgriFarm · Group 39 · Accra Technical University · 2025/2026</span>
        </div>
        <p>Built with care for Ghana's farmers.</p>
      </div>
    </footer>
  );
}
