"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const navLinks = [
  { href: "#about", key: "about" },
  { href: "#services", key: "services" },
  { href: "#projects", key: "projects" },
  { href: "#process", key: "process" },
  { href: "#team", key: "team" },
  { href: "#contact", key: "contact" },
];

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dictionary } = useLocale();

  useEffect(() => {
    function handleScroll() {
      // Show navbar after scrolling past ~80% of viewport height
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={
        visible
          ? { y: 0, opacity: 1 }
          : { y: -100, opacity: 0 }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a
          href="/#"
          className="font-heading text-lg font-bold tracking-tight text-foreground"
        >
          <span className="gradient-text">{dictionary.common.brand}</span>
          <span className="ml-1 text-muted font-light text-xs tracking-widest uppercase">
            {dictionary.common.tagline}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              {dictionary.nav[item.key as keyof typeof dictionary.nav]}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-primary/10 px-5 py-2 text-sm text-primary hover:bg-primary/20 transition-colors duration-300 border border-primary/20"
          >
            {dictionary.nav.startProject}
          </a>
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label={dictionary.nav.toggleMenu}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-foreground"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-foreground"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block h-0.5 w-6 bg-foreground"
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="flex flex-col gap-4 px-6 py-8">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted hover:text-foreground transition-colors tracking-wide"
                >
                  {dictionary.nav[item.key as keyof typeof dictionary.nav]}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-primary/10 px-5 py-2 text-sm text-primary hover:bg-primary/20 transition-colors duration-300 border border-primary/20 inline-block w-fit"
              >
                {dictionary.nav.startProject}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
