"use client";

import { motion, useInView } from "framer-motion";
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

const accentColors = ["#6366F1","#8B5CF6","#06B6D4","#10B981","#F59E0B","#EC4899"];

// Base bar heights per service (stable, no hydration issues)
const baseHeights = [
  [45, 70, 30, 85, 55, 90, 40, 65, 75, 50, 80, 35],
  [60, 40, 80, 55, 70, 35, 90, 45, 65, 75, 50, 85],
  [35, 80, 50, 70, 40, 90, 60, 45, 75, 55, 85, 30],
  [75, 45, 85, 35, 65, 80, 50, 90, 40, 70, 55, 60],
  [50, 85, 40, 75, 60, 35, 80, 55, 90, 45, 70, 65],
  [80, 35, 65, 90, 45, 70, 55, 85, 40, 60, 75, 50],
];

// Continuously animated bar chart per card
function LiveBars({ color, isActive }: { color: string; isActive: boolean }) {
  const [heights, setHeights] = useState(baseHeights[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    const base = baseHeights[indexRef.current];
    const interval = isActive ? 300 : 900;
    const id = setInterval(() => {
      setHeights(base.map(h => {
        const jitter = (Math.random() - 0.5) * (isActive ? 40 : 18);
        return Math.max(10, Math.min(100, h + jitter));
      }));
    }, interval);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="flex gap-0.5 items-end h-7">
      {heights.map((h, j) => (
        <motion.div
          key={j}
          className="flex-1 rounded-full"
          style={{ backgroundColor: color, opacity: isActive ? 0.3 + (h / 100) * 0.7 : 0.18 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: isActive ? 0.25 : 0.7, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Wrapper to assign stable index to each LiveBars instance
function ServiceCard({
  service, i, isInView, color, dictService,
}: {
  service: (typeof services)[number];
  i: number;
  isInView: boolean;
  color: string;
  dictService: { title: string; description: string };
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="group cursor-default rounded-2xl border border-border/50 p-5 bg-background/60 backdrop-blur-sm transition-all duration-300"
      style={{
        borderColor: isActive ? `${color}40` : undefined,
        background: isActive ? `${color}08` : undefined,
      }}
    >
      {/* Top row: icon + number */}
      <div className="flex items-center justify-between mb-4">
        <motion.div animate={{ scale: isActive ? 1.15 : 1, rotate: isActive ? 5 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="w-6 h-6 transition-colors duration-300" fill="none" viewBox="0 0 24 24"
            stroke={isActive ? color : "#64748B"} strokeWidth={1.5}>
            <motion.path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[service.icon]}
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>
        <span className="font-mono text-xs font-bold transition-colors duration-300"
          style={{ color: isActive ? color : "#64748B" }}>
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="font-heading text-base font-semibold mb-2 transition-colors duration-300 leading-snug"
        style={{ color: isActive ? color : undefined }}>
        {dictService.title}
      </h3>

      <p className="text-xs text-muted leading-relaxed mb-4">{dictService.description}</p>

      <LiveBarsForIndex serviceIndex={i} color={color} isActive={isActive} />
    </motion.div>
  );
}

// Each service gets its own stable base heights
function LiveBarsForIndex({ serviceIndex, color, isActive }: { serviceIndex: number; color: string; isActive: boolean }) {
  const base = baseHeights[serviceIndex];
  const [heights, setHeights] = useState(base);

  useEffect(() => {
    const interval = isActive ? 280 : 850;
    const id = setInterval(() => {
      setHeights(base.map(h => {
        const jitter = (Math.random() - 0.5) * (isActive ? 38 : 16);
        return Math.max(8, Math.min(100, h + jitter));
      }));
    }, interval);
    return () => clearInterval(id);
  }, [isActive, base]);

  return (
    <div className="flex gap-0.5 items-end h-7">
      {heights.map((h, j) => (
        <motion.div
          key={j}
          className="flex-1 rounded-full"
          style={{ backgroundColor: color, opacity: isActive ? 0.25 + (h / 100) * 0.75 : 0.15 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: isActive ? 0.22 : 0.65, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const color = accentColors[i % accentColors.length];
            const dictService = (dictionary.services.services as Array<{ title: string; description: string }>)[i];
            return (
              <ServiceCard
                key={`service-${i}`}
                service={service}
                i={i}
                isInView={isInView}
                color={color}
                dictService={dictService || { title: service.title, description: service.description }}
              />
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
