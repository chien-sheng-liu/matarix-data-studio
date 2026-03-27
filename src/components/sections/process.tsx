"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { processSteps } from "@/config/site";

const stepColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

// SVG data points rising from bottom-left to top-right (viewBox 0 0 1000 400)
const dataPoints = [
  { x: 80,  y: 340 },
  { x: 265, y: 265 },
  { x: 450, y: 185 },
  { x: 680, y: 110 },
  { x: 920, y: 50  },
];

function buildCurvePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

const curvePath = buildCurvePath(dataPoints);
const areaPath = `${curvePath} L 920 400 L 80 400 Z`;

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { dictionary } = useLocale();

  const steps = dictionary.process.steps as Array<{ title: string; description: string }>;

  return (
    <SectionWrapper id="process">
      <div ref={ref}>
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
        >
          {dictionary.process.label}
        </motion.p>

        <TextReveal
          as="h2"
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-16"
        >
          {dictionary.process.heading}
        </TextReveal>

        {/* Desktop: Growth curve layout */}
        <div className="hidden lg:block">
          <div className="relative w-full" style={{ height: "540px" }}>
            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {[0.2, 0.4, 0.6, 0.8].map((frac) => (
                <div
                  key={frac}
                  className="absolute left-0 right-0 border-t border-white/[0.035]"
                  style={{ top: `${frac * 100}%` }}
                />
              ))}
              <div className="absolute top-0 bottom-0 left-[60px] border-l border-white/[0.035]" />
            </div>

            {/* SVG growth curve */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.7" />
                  <stop offset="50%"  stopColor="#06B6D4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="1.0" />
                </linearGradient>
                <filter id="curveGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dotGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Area fill */}
              <motion.path
                d={areaPath}
                fill="url(#curveGradient)"
                fillOpacity="0.05"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.4 }}
              />

              {/* Curve line */}
              <motion.path
                d={curvePath}
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#curveGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Data point dots */}
              {dataPoints.map((pt, i) => (
                <motion.circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  fill={stepColors[i]}
                  filter="url(#dotGlow)"
                  initial={{ r: 0 } as never}
                  animate={isInView ? ({ r: 6 } as never) : ({ r: 0 } as never)}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.35, type: "spring", stiffness: 280, damping: 18 }}
                />
              ))}
            </svg>

            {/* Step cards */}
            {dataPoints.map((pt, i) => {
              const xPct = (pt.x / 1000) * 100;
              const yPx = (pt.y / 400) * 540;
              const above = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `calc(${xPct}% - 112px)`,
                    top: above ? `${yPx - 168}px` : `${yPx + 20}px`,
                    width: "224px",
                  }}
                  initial={{ opacity: 0, y: above ? -12 : 12, scale: 0.88 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="rounded-xl border p-4 bg-background/80 backdrop-blur-sm hover:bg-background/95 transition-all duration-300"
                    style={{ borderColor: `${stepColors[i]}40` }}
                  >
                    <motion.div
                      className="w-full h-[2px] rounded-full mb-3"
                      style={{ background: stepColors[i] }}
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span
                      className="font-mono text-xs font-bold tracking-widest mb-1 block"
                      style={{ color: stepColors[i] }}
                    >
                      {processSteps[i].step}
                    </span>
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-1.5 leading-snug">
                      {steps[i]?.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {steps[i]?.description}
                    </p>
                  </div>
                  {/* Connector line to dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-px opacity-25"
                    style={{
                      background: stepColors[i],
                      height: "20px",
                      ...(above ? { bottom: "-20px" } : { top: "-20px" }),
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical rising timeline */}
        <div className="lg:hidden">
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-px overflow-hidden">
              <motion.div
                className="absolute inset-0 origin-top"
                style={{
                  background: "linear-gradient(to bottom, #6366F1, #8B5CF6, #06B6D4, #10B981, #F59E0B)",
                }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
              />
            </div>

            <div className="space-y-6">
              {dataPoints.map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 border-background z-10"
                    style={{ background: stepColors[i] }}
                  />
                  <div
                    className="rounded-xl border p-4 bg-background/60 backdrop-blur-sm"
                    style={{ borderColor: `${stepColors[i]}40` }}
                  >
                    <div
                      className="w-8 h-[2px] rounded-full mb-2"
                      style={{ background: stepColors[i] }}
                    />
                    <span
                      className="font-mono text-xs font-bold tracking-widest mb-1 block"
                      style={{ color: stepColors[i] }}
                    >
                      {processSteps[i].step}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                      {steps[i]?.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {steps[i]?.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
