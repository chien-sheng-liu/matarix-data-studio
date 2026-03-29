"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { services } from "@/config/site";

const iconPaths: Record<string, string> = {
  database:
    "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75",
  brain:
    "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
  chart:
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  strategy:
    "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  pipeline:
    "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  integration:
    "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z",
};

const accentColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"];

const baseHeights = [
  [45, 70, 30, 85, 55, 90, 40, 65, 75, 50, 80, 35, 60, 45, 88, 42, 72, 58],
  [60, 40, 80, 55, 70, 35, 90, 45, 65, 75, 50, 85, 38, 68, 48, 82, 52, 78],
  [35, 80, 50, 70, 40, 90, 60, 45, 75, 55, 85, 30, 72, 42, 88, 58, 44, 66],
  [75, 45, 85, 35, 65, 80, 50, 90, 40, 70, 55, 60, 48, 82, 36, 74, 62, 52],
  [50, 85, 40, 75, 60, 35, 80, 55, 90, 45, 70, 65, 38, 78, 52, 42, 88, 58],
  [80, 35, 65, 90, 45, 70, 55, 85, 40, 60, 75, 50, 88, 42, 68, 56, 36, 76],
];

// Live bars visualization for the preview panel
function PreviewBars({ serviceIndex, color }: { serviceIndex: number; color: string }) {
  const base = baseHeights[serviceIndex];
  const [heights, setHeights] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setHeights(base.map(h => {
        const jitter = (Math.random() - 0.5) * 32;
        return Math.max(8, Math.min(100, h + jitter));
      }));
    }, 220);
    return () => clearInterval(id);
  }, [base]);

  return (
    <div className="flex gap-1 items-end h-16">
      {heights.map((h, j) => (
        <motion.div
          key={j}
          className="flex-1 rounded-full"
          style={{ backgroundColor: color, opacity: 0.25 + (h / 100) * 0.75 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Right-side preview panel
function ServicePreview({
  service, i, color, dictService,
}: {
  service: (typeof services)[number];
  i: number;
  color: string;
  dictService: { title: string; description: string };
}) {
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col justify-between p-8 lg:p-10"
    >
      {/* Top: icon */}
      <div>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.4}>
            <motion.path
              strokeLinecap="round" strokeLinejoin="round"
              d={iconPaths[service.icon]}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs font-bold" style={{ color }}>{String(i + 1).padStart(2, "0")}</span>
          <div className="h-px flex-1" style={{ backgroundColor: `${color}25` }} />
        </div>

        <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4 leading-tight"
          style={{ color }}>
          {dictService.title}
        </h3>

        <p className="text-sm text-muted leading-relaxed">
          {dictService.description}
        </p>
      </div>

      {/* Bottom: live bars */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="font-mono text-xs text-muted">LIVE ACTIVITY</span>
        </div>
        <PreviewBars serviceIndex={i} color={color} />
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();
  const [active, setActive] = useState(0);

  const dictServices = dictionary.services.services as Array<{ title: string; description: string }>;
  const activeColor = accentColors[active];

  return (
    <SectionWrapper id="services" className="bg-surface/30">
      <div ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4 text-center"
        >
          {dictionary.services.label}
        </motion.p>

        <TextReveal as="h2" className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-12 justify-center">
          {dictionary.services.heading}
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 lg:gap-6">
          {/* Left: service list */}
          <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
            {services.map((service, i) => {
              const color = accentColors[i];
              const isActive = active === i;
              const dictService = dictServices[i] || { title: service.title, description: service.description };
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="w-full flex items-center gap-5 px-6 py-4 text-left transition-colors duration-200 relative"
                  style={{
                    backgroundColor: isActive ? `${color}0C` : "transparent",
                    borderBottom: i < services.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  {/* Active left bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  {/* Number */}
                  <span className="font-mono text-xs font-bold w-7 flex-shrink-0 transition-colors duration-200"
                    style={{ color: isActive ? color : "#475569" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? `${color}15` : "transparent",
                      border: `1px solid ${isActive ? `${color}30` : "transparent"}`,
                    }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke={isActive ? color : "#64748B"} strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[service.icon]} />
                    </svg>
                  </div>

                  {/* Title */}
                  <span className="font-heading text-sm font-semibold flex-1 transition-colors duration-200"
                    style={{ color: isActive ? color : undefined }}>
                    {dictService.title}
                  </span>

                  {/* Arrow */}
                  <motion.svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    animate={{ x: isActive ? 2 : 0, opacity: isActive ? 1 : 0.3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M1 7h12M8 2l5 5-5 5" stroke={isActive ? color : "currentColor"}
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.button>
              );
            })}
          </div>

          {/* Right: preview panel */}
          <div className="relative rounded-2xl border overflow-hidden min-h-[360px]"
            style={{ borderColor: `${activeColor}20`, backgroundColor: `${activeColor}05`,
              transition: "border-color 0.4s, background-color 0.4s" }}>
            {/* Accent top line */}
            <div className="absolute top-0 left-0 right-0 h-px transition-all duration-400"
              style={{ background: `linear-gradient(90deg, transparent, ${activeColor}70, transparent)` }} />
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 30% 30%, ${activeColor}08 0%, transparent 60%)`,
                transition: "background 0.4s" }} />

            <AnimatePresence mode="wait">
              <ServicePreview
                key={active}
                service={services[active]}
                i={active}
                color={activeColor}
                dictService={dictServices[active] || { title: services[active].title, description: services[active].description }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
