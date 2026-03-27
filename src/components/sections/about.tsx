"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { RingChart } from "@/components/effects/ring-chart";
import { LineChart } from "@/components/effects/line-chart";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { stats } from "@/config/site";

const capabilities = [
  { percentage: 95, label: "Data Engineering", color: "#6366F1" },
  { percentage: 92, label: "AI / ML", color: "#8B5CF6" },
  { percentage: 88, label: "Visualization", color: "#06B6D4" },
  { percentage: 90, label: "Strategy", color: "#10B981" },
];

const growthData = [12, 28, 35, 42, 58, 72, 85, 96, 110, 128, 145, 168];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          About Us
        </motion.p>

        <TextReveal
          as="h2"
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
        >
          We speak the language of data
        </TextReveal>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted text-lg leading-relaxed max-w-3xl mb-20"
        >
          Mentarix Data Studio is a team of data engineers, AI researchers,
          and strategists who believe that every organization sits on a
          goldmine of untapped data. We build the infrastructure, models, and
          dashboards that turn raw information into competitive advantage.
        </motion.p>

        {/* Stats row with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <p className="font-heading text-5xl font-bold gradient-text mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Data visualization section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Ring charts - capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-2xl border border-border bg-surface/30 p-8"
          >
            <p className="font-mono text-xs text-accent tracking-wider uppercase mb-8">
              Core Capabilities
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {capabilities.map((cap) => (
                <RingChart
                  key={cap.label}
                  percentage={cap.percentage}
                  label={cap.label}
                  color={cap.color}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Line chart - growth */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="rounded-2xl border border-border bg-surface/30 p-8"
          >
            <p className="font-mono text-xs text-accent tracking-wider uppercase mb-8">
              Project Growth (Monthly)
            </p>
            <LineChart
              data={growthData}
              color="#6366F1"
              height={160}
              label="deliveries"
            />
            <div className="flex justify-between mt-4 text-xs text-muted/50 font-mono">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
