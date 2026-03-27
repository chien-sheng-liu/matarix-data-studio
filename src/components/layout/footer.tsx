import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-heading text-lg font-bold gradient-text">
              Mentarix
            </span>
            <span className="ml-1 text-muted text-xs tracking-widest uppercase">
              Data Studio
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-foreground transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>

          <p className="text-xs text-muted/60">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
