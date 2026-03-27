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

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();

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
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
        >
          {dictionary.about.heading}
        </TextReveal>

        {/* Intro block: narrative + differentiators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Left: narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
              {intro.title}
            </h3>
            <p className="text-muted text-lg leading-relaxed">
              {intro.narrative}
            </p>
          </motion.div>

          {/* Right: differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
              {intro.whyUs}
            </h3>
            <ul className="space-y-4">
              {intro.differentiators.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.35 + i * 0.12 }}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 text-accent"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </motion.span>
                  <div>
                    <span className="font-semibold text-foreground text-sm">
                      {item.title}
                    </span>
                    <span className="text-muted text-sm"> — {item.description}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Stats row with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => {
            const statKeys = ["yearsExperience", "clientsHandled", "dataProcessed", "industriesCovered"] as const;
            const statLabel = dictionary.about.stats[statKeys[i]] || stat.label;

            return (
              <motion.div
                key={statKeys[i]}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted font-mono">{statLabel}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Core Capabilities */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-mono text-xs text-accent tracking-wider uppercase mb-8"
        >
          {dictionary.about.coreCapabilities}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
