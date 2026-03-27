"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { processSteps } from "@/config/site";

const stepColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  // Flow line progress
  const lineWidth = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative bg-surface/30"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 lg:px-8 mb-12">
          <div ref={headerRef} className="mx-auto max-w-7xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
            >
              {dictionary.process.label}
            </motion.p>

            <TextReveal
              as="h2"
              className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {dictionary.process.heading}
            </TextReveal>
          </div>
        </div>

        {/* Flow line */}
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-8 mb-8">
          <div className="relative h-[2px] bg-border/30 rounded-full overflow-hidden">
            <motion.div
              style={{ width: lineWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary-light rounded-full"
            />
            {/* Glow dot at the end */}
            <motion.div
              style={{ left: lineWidth }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent"
            >
              <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
            </motion.div>
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div className="overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 pl-6 lg:pl-8">
            {processSteps.map((step, i) => {
              const color = stepColors[i % stepColors.length];

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                  className="flex-shrink-0 w-[340px] sm:w-[400px]"
                >
                  <div className="rounded-2xl border border-border bg-background/50 p-8 h-full relative overflow-hidden group">
                    {/* Background number */}
                    <span
                      className="absolute -right-4 -top-6 font-heading text-[120px] font-bold leading-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
                      style={{ color }}
                    >
                      {step.step}
                    </span>

                    {/* Animated step indicator */}
                    <div className="relative z-10 mb-6 flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold"
                        style={{
                          backgroundColor: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {step.step}
                      </div>

                      {/* Data flow dots */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <motion.div
                            key={j}
                            animate={{
                              opacity: [0.2, 1, 0.2],
                              scale: [0.8, 1, 0.8],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: j * 0.2,
                              repeat: Infinity,
                            }}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="relative z-10 font-heading text-2xl font-semibold mb-3">
                      {step.title}
                    </h3>
                    <p className="relative z-10 text-muted leading-relaxed">
                      {step.description}
                    </p>

                    {/* Mini visualization */}
                    <div className="relative z-10 mt-6 flex items-end gap-[3px] h-10">
                      {Array.from({ length: 20 }, (_, j) => (
                        <motion.div
                          key={j}
                          animate={{
                            height: [
                              `${10 + Math.random() * 30}%`,
                              `${30 + Math.random() * 70}%`,
                              `${10 + Math.random() * 30}%`,
                            ],
                          }}
                          transition={{
                            duration: 2 + Math.random(),
                            delay: j * 0.05,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="flex-1 rounded-full"
                          style={{
                            backgroundColor: color,
                            opacity: 0.15 + (j / 20) * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {/* Spacer for scroll end */}
            <div className="flex-shrink-0 w-[100px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
