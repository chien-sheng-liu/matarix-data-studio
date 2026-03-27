"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/effects/brand-logo";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { siteConfig } from "@/config/site";

const HeroScene = dynamic(
  () =>
    import("@/components/effects/hero-scene").then((mod) => ({
      default: mod.HeroScene,
    })),
  { ssr: false }
);

export function HeroSection() {
  const [sceneVisible, setSceneVisible] = useState(false);

  useEffect(() => {
    // Show 3D scene after brand convergence
    const timer = setTimeout(() => setSceneVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Scene — fades in after brand letters converge */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={sceneVisible ? { opacity: 0.7 } : {}}
        transition={{ duration: 3 }}
      >
        <HeroScene />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
        {/* ★ Brand Logo — the main art piece */}
        <BrandLogo />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 5.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
            {siteConfig.subtitle}
          </p>
        </motion.div>

        {/* Secondary headline */}
        <div className="text-center mt-4 overflow-hidden">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 6.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium gradient-text"
          >
            Turning Data into Decisions
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 6.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            href="#services"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white hover:bg-primary-light transition-colors duration-300"
          >
            Explore Our Services
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-muted hover:text-foreground hover:border-muted transition-colors duration-300"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-muted/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
