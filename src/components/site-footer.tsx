export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container-page flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            A
          </span>
          <div>
            <p className="font-semibold text-foreground">AgriFarm · Ghana Crop Market Intelligence</p>
            <p className="mt-0.5">Accra Technical University · Dept. of Information Systems Technology · Group 39 (2025/2026)</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span>SMS Shortcode: <strong className="font-mono text-foreground">718</strong></span>
          <span>Supervised by Dr. Duodu Yaw Nana</span>
          <span>Accra, Ghana</span>
        </div>
      </div>
    </footer>
  );
}

