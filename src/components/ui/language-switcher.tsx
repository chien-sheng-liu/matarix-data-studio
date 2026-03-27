"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as const, label: "EN", name: "English" },
    { code: "zh-TW" as const, label: "繁中", name: "繁體中文" },
  ];

  const current = languages.find((l) => l.code === locale);

  const handleLanguageChange = (code: "en" | "zh-TW") => {
    if (code !== locale) {
      setLocale(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Change language"
      >
        {current?.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                locale === lang.code
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              } ${lang.code === languages[0].code ? "border-b border-border" : ""}`}
            >
              <div className="font-medium">{lang.label}</div>
              <div className="text-xs text-muted-foreground">{lang.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
