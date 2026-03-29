"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { CapabilityCard } from "@/components/effects/capability-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useLocale } from "@/components/providers/locale-provider";
import { stats } from "@/config/site";

const capabilityIcons = ["data", "ai", "analytics", "strategy"] as const;
const capabilityKeys = ["dataEngineering", "aiMl", "analytics", "strategy"] as const;

const brandStory = {
  en: "Mentarix comes from the root ment- meaning mind, cognition, and reasoning, combined with a modern technical suffix -rix, representing systems, structure, and engineering. The name reflects the idea of building intelligent systems driven by logic, data, and analytical thinking.",
  "zh-TW": "Mentarix 來自於 ment-（思維、理性、認知）與 -rix（系統、結構、工程）的結合，象徵以邏輯與數據為核心，打造智慧決策與分析系統。",
};

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { dictionary, locale } = useLocale();

  const intro = dictionary.about.intro as {
    title: string;
    narrative: string;
    whyUs: string;
    differentiators: Array<{ title: string; description: string }>;
  };

  const capabilities = dictionary.about.capabilities as Record<
    string,
    { title: string; description: string }
  >;

  const statKeys = ["yearsExperience", "clientsHandled", "dataProcessed", "industriesCovered"] as const;

  return (
    <SectionWrapper id="about">
      <div ref={ref}>
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
        >
          {dictionary.about.label}
        </motion.p>

        <TextReveal
          as="h2"
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-12"
        >
          {dictionary.about.heading}
        </TextReveal>

        {/* ── Brand Origin ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-2xl border border-white/[0.08] overflow-hidden mb-12 p-8 lg:p-10"
        >
          {/* subtle background glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 65%)" }} />

          {/* MENT- + -RIX split — centred, tight gap */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            {/* Left: MENT- */}
            <div className="text-center sm:text-right">
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block font-heading text-5xl lg:text-6xl font-bold tracking-tight"
                style={{ color: "#6366F1" }}
              >
                MENT-
              </motion.span>
              <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 mt-2">
                {["mind", "cognition", "reasoning"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                    style={{ color: "#6366F1", borderColor: "#6366F130", backgroundColor: "#6366F110" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* + */}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.45, type: "spring", stiffness: 300 }}
              className="font-mono text-2xl text-muted flex-shrink-0"
            >
              +
            </motion.span>

            {/* Right: -RIX */}
            <div className="text-center sm:text-left">
              <motion.span
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block font-heading text-5xl lg:text-6xl font-bold tracking-tight"
                style={{ color: "#06B6D4" }}
              >
                -RIX
              </motion.span>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                {["systems", "structure", "engineering"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                    style={{ color: "#06B6D4", borderColor: "#06B6D430", backgroundColor: "#06B6D410" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Separator line */}
          <div className="h-px w-full mb-6"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(6,182,212,0.3), transparent)" }} />

          {/* Description — both EN + ZH always shown */}
          <div className="space-y-3 max-w-2xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-foreground/80 text-sm leading-relaxed"
            >
              {brandStory["en"]}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-muted text-sm leading-relaxed"
            >
              {brandStory["zh-TW"]}
            </motion.p>
          </div>
        </motion.div>


        {/* ── Narrative + Why Us ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Left: narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-heading text-xl font-semibold mb-4">{intro.title}</h3>
            <p className="text-muted leading-relaxed">{intro.narrative}</p>
          </motion.div>

          {/* Right: why us — numbered list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-heading text-xl font-semibold mb-6">{intro.whyUs}</h3>
            <ul className="space-y-5">
              {intro.differentiators.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-xs font-bold mt-0.5 flex-shrink-0 w-6 text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="font-semibold text-foreground text-sm">{item.title}</span>
                    <span className="text-muted text-sm"> — {item.description}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Core Capabilities + stats ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <p className="font-mono text-xs text-accent tracking-wider uppercase">
            {dictionary.about.coreCapabilities}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {stats.map((stat, i) => (
              <motion.span
                key={statKeys[i]}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.06 }}
                className="font-mono text-xs text-muted"
              >
                <span className="font-bold text-foreground/70">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                {" "}{dictionary.about.stats[statKeys[i]] || stat.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {capabilityKeys.map((key, i) => {
            const cap = capabilities[key];
            if (!cap) return null;
            return (
              <CapabilityCard
                key={key}
                icon={capabilityIcons[i]}
                title={cap.title}
                description={cap.description}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
