"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { processSteps } from "@/config/site";

const stepColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

// Each step: progress ring %, completion label, and what metric is growing
const stepMeta = [
  { ring: 0.20, label: "20%", metric: "Scope Defined" },
  { ring: 0.40, label: "40%", metric: "Requirements Locked" },
  { ring: 0.60, label: "60%", metric: "Spec Approved" },
  { ring: 0.85, label: "85%", metric: "In Production" },
  { ring: 1.00, label: "100%", metric: "Delivered" },
];

// Animated progress ring
function ProgressRing({ progress, color, size, strokeW, isActive, delay }: {
  progress: number; color: string; size: number; strokeW: number;
  isActive: boolean; delay: number;
}) {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="block -rotate-90">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="white" strokeOpacity={0.05} strokeWidth={strokeW} />
      {/* Fill arc */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          filter: isActive ? `drop-shadow(0 0 6px ${color}80)` : "none",
          transition: "filter 0.3s",
        }}
      />
      {/* Glow ring when active */}
      {isActive && (
        <motion.circle
          cx={size / 2} cy={size / 2} r={r + 4}
          fill="none" stroke={color} strokeWidth={1}
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

// Flowing connector between steps (animated dashes moving left→right)
function FlowConnector({ color, nextColor, isReached }: {
  color: string; nextColor: string; isReached: boolean;
}) {
  return (
    <div className="flex-1 flex items-center mx-1 relative h-10">
      {/* Base line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.06]" />
      {/* Animated flowing line */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 origin-left rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${nextColor})` }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isReached ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Flowing particles */}
      {isReached && (
        <>
          {[0, 1, 2].map(j => (
            <motion.div
              key={j}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, ${nextColor})` }}
              animate={{ left: ["-4%", "104%"], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 1.6,
                delay: j * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
      {/* Arrow head */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={isReached ? { opacity: 0.6 } : {}}
        transition={{ delay: 0.6 }}
      >
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
          <path d="M1 1l5 4-5 4" stroke={nextColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
}

// Animated counter that counts up
function AnimCounter({ target, isActive }: { target: string; isActive: boolean }) {
  const num = parseInt(target);
  const suffix = target.replace(/\d+/, "");
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isActive) { setVal(0); return; }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 700, 1);
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * num));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, num]);
  return <>{val}{suffix}</>;
}

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { dictionary } = useLocale();
  const [activeStep, setActiveStep] = useState(0);
  const [reached, setReached] = useState<Set<number>>(new Set());

  const steps = dictionary.process.steps as Array<{ title: string; description: string }>;

  // Auto-advance through steps on first view, then stop
  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => {
        setReached(prev => new Set([...prev, i]));
        setActiveStep(i);
      }, 400 + i * 600));
    }
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

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

        {/* ─── Desktop: Pipeline with progress rings ─────────────────── */}
        <div className="hidden lg:block">
          {/* Top row: rings + flowing connectors */}
          <div className="flex items-center mb-8">
            {processSteps.map((_, i) => {
              const isReached = reached.has(i);
              const isActive = activeStep === i;
              const ringDelay = 0.4 + i * 0.6;
              return (
                <div key={i} className="contents">
                  {/* Ring node */}
                  <motion.div
                    className="relative flex-shrink-0 cursor-pointer"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isReached ? { scale: 1, opacity: 1 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 22, delay: ringDelay }}
                    onMouseEnter={() => setActiveStep(i)}
                    onClick={() => setActiveStep(i)}
                  >
                    <ProgressRing
                      progress={isReached ? stepMeta[i].ring : 0}
                      color={stepColors[i]}
                      size={80}
                      strokeW={4}
                      isActive={isActive}
                      delay={ringDelay}
                    />
                    {/* Center: step number + percentage */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-xs font-bold" style={{ color: stepColors[i] }}>
                        {processSteps[i].step}
                      </span>
                      <span className="font-heading text-sm font-bold mt-0.5" style={{ color: isActive ? stepColors[i] : "#64748B" }}>
                        {isReached ? (
                          <AnimCounter target={stepMeta[i].label} isActive={isReached} />
                        ) : "0%"}
                      </span>
                    </div>
                  </motion.div>

                  {/* Connector (not after last) */}
                  {i < 4 && (
                    <FlowConnector
                      color={stepColors[i]}
                      nextColor={stepColors[i + 1]}
                      isReached={reached.has(i + 1)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom: detail card for active step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border p-8 relative overflow-hidden"
              style={{
                borderColor: `${stepColors[activeStep]}30`,
                background: `linear-gradient(135deg, ${stepColors[activeStep]}08 0%, transparent 60%)`,
              }}
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${stepColors[activeStep]}, transparent)` }} />

              <div className="flex items-start gap-8">
                {/* Left: big progress ring */}
                <div className="flex-shrink-0 relative">
                  <ProgressRing
                    progress={stepMeta[activeStep].ring}
                    color={stepColors[activeStep]}
                    size={120}
                    strokeW={6}
                    isActive
                    delay={0}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-2xl font-bold" style={{ color: stepColors[activeStep] }}>
                      <AnimCounter target={stepMeta[activeStep].label} isActive />
                    </span>
                    <span className="text-xs text-muted mt-0.5">complete</span>
                  </div>
                </div>

                {/* Right: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-sm font-bold" style={{ color: stepColors[activeStep] }}>
                      STEP {processSteps[activeStep].step}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{
                        color: stepColors[activeStep],
                        backgroundColor: `${stepColors[activeStep]}15`,
                        border: `1px solid ${stepColors[activeStep]}25`,
                      }}>
                      {stepMeta[activeStep].metric}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3" style={{ color: stepColors[activeStep] }}>
                    {steps[activeStep]?.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed max-w-2xl">
                    {steps[activeStep]?.description}
                  </p>

                  {/* Mini progress bar showing cumulative progress */}
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-xs text-muted font-mono">PROJECT PROGRESS</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${stepColors[0]}, ${stepColors[activeStep]})` }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${stepMeta[activeStep].ring * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold" style={{ color: stepColors[activeStep] }}>
                      <AnimCounter target={stepMeta[activeStep].label} isActive />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Step selector pills */}
          <div className="flex justify-center gap-2 mt-6">
            {processSteps.map((_, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-medium transition-all duration-300"
                  style={{
                    borderColor: isActive ? `${stepColors[i]}50` : "rgba(255,255,255,0.06)",
                    backgroundColor: isActive ? `${stepColors[i]}12` : "transparent",
                    color: isActive ? stepColors[i] : "#64748B",
                  }}
                >
                  <span>{processSteps[i].step}</span>
                  <span>{steps[i]?.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Mobile: Vertical pipeline ─────────────────────────────── */}
        <div className="lg:hidden">
          <div className="relative pl-16">
            {/* Vertical flowing line */}
            <div className="absolute left-6 top-0 bottom-0 w-px overflow-hidden">
              <motion.div
                className="absolute inset-0 origin-top"
                style={{ background: `linear-gradient(to bottom, ${stepColors.join(", ")})` }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Flowing particles on the line */}
              {isInView && [0, 1, 2].map(j => (
                <motion.div
                  key={j}
                  className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ top: ["-2%", "102%"], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 3, delay: j * 1, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>

            <div className="space-y-4">
              {processSteps.map((_, i) => {
                const isActive = activeStep === i;
                const isReached = reached.has(i);
                return (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, x: 24 }}
                    animate={isReached ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Ring node */}
                    <div className="absolute -left-[52px] top-3">
                      <ProgressRing
                        progress={isReached ? stepMeta[i].ring : 0}
                        color={stepColors[i]}
                        size={40}
                        strokeW={3}
                        isActive={isActive}
                        delay={0.4 + i * 0.25}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[10px] font-bold" style={{ color: stepColors[i] }}>
                          {processSteps[i].step}
                        </span>
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-xl border p-4 cursor-pointer transition-all duration-300"
                      style={{
                        borderColor: isActive ? `${stepColors[i]}40` : "rgba(255,255,255,0.06)",
                        backgroundColor: isActive ? `${stepColors[i]}06` : "transparent",
                      }}
                      onClick={() => setActiveStep(i)}
                    >
                      {/* Title row */}
                      <div className="flex items-center justify-between">
                        <h3
                          className="font-heading text-base font-semibold leading-snug transition-colors duration-300"
                          style={{ color: isActive ? stepColors[i] : undefined }}
                        >
                          {steps[i]?.title}
                        </h3>
                        <span className="font-heading text-sm font-bold tabular-nums" style={{ color: stepColors[i] }}>
                          {isReached ? stepMeta[i].label : ""}
                        </span>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            {/* Progress bar */}
                            <div className="flex items-center gap-2 mt-3 mb-2">
                              <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: stepColors[i] }}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${stepMeta[i].ring * 100}%` }}
                                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                />
                              </div>
                              <span className="text-xs font-mono" style={{ color: stepColors[i] }}>
                                {stepMeta[i].metric}
                              </span>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                              {steps[i]?.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
