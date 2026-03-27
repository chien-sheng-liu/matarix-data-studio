import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "zh-TW": () =>
    import("./dictionaries/zh-TW.json").then((module) => module.default),
};

export const locales = ["en", "zh-TW"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries[defaultLocale]();
};

export const hasLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};
