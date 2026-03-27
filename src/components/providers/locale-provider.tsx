"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/app/[lang]/dictionaries";

interface Dictionary {
  nav: Record<string, string>;
  hero: Record<string, any>;
  about: Record<string, any>;
  services: Record<string, any>;
  projects: Record<string, any>;
  process: Record<string, any>;
  contact: Record<string, any>;
  footer: Record<string, any>;
  common: Record<string, string>;
  metadata: Record<string, string>;
}

interface LocaleContextType {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}

export function LocaleProvider({
  children,
  locale: initialLocale,
  dictionary,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);

      // Save preference to cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // Replace current locale in pathname with new locale
      const segments = pathname.split("/");
      segments[1] = newLocale; // Replace locale segment
      const newPathname = segments.join("/");

      // Navigate to new locale
      router.push(newPathname);
    },
    [pathname, router]
  );

  const value: LocaleContextType = {
    locale,
    dictionary,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
