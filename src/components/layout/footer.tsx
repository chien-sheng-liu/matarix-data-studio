"use client";

import { siteConfig } from "@/config/site";
import { useLocale } from "@/components/providers/locale-provider";

export function Footer() {
  const year = new Date().getFullYear();
  const { dictionary } = useLocale();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-heading text-lg font-bold gradient-text">
              {dictionary.common.brand}
            </span>
            <span className="ml-1 text-muted text-xs tracking-widest uppercase">
              {dictionary.common.tagline}
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
            &copy; {year} {dictionary.common.brand}. {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
