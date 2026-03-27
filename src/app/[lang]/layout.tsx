import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Noto_Sans_TC } from "next/font/google";
import { notFound } from "next/navigation";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { getDictionary, hasLocale, locales, type Locale } from "@/app/[lang]/dictionaries";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dict = await getDictionary(lang);

  const baseUrl = "https://mentarix.studio";
  const canonicalUrl = `${baseUrl}/${lang}`;

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords.split(", "),
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: "website",
      url: canonicalUrl,
      locale: lang === "zh-TW" ? "zh_TW" : "en_US",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        "zh-TW": `${baseUrl}/zh-TW`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSansTc.variable} antialiased`}
    >
      <head>
        <link rel="alternate" hrefLang="en" href="https://mentarix.studio/en" />
        <link rel="alternate" hrefLang="zh-TW" href="https://mentarix.studio/zh-TW" />
        <link rel="alternate" hrefLang="x-default" href="https://mentarix.studio/en" />
      </head>
      <body className="relative">
        <LocaleProvider locale={lang as Locale} dictionary={dict}>
          <LenisProvider>{children}</LenisProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
