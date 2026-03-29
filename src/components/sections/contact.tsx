"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { siteConfig } from "@/config/site";

// Channel config: color, icon SVG path, link builder
const channelConfig = [
  {
    color: "#EF4444",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    href: `mailto:${siteConfig.email}`,
    external: false,
  },
  {
    color: "#0077B5",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
    href: siteConfig.linkedin,
    external: true,
  },
  {
    color: "#16A34A",
    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z",
    href: siteConfig.calendar,
    external: true,
  },
];

// Animated constellation background
const conNodes = [
  { x: 20, y: 20 }, { x: 50, y: 10 }, { x: 80, y: 25 },
  { x: 15, y: 55 }, { x: 50, y: 50 }, { x: 85, y: 55 },
  { x: 30, y: 85 }, { x: 65, y: 80 }, { x: 45, y: 35 },
];
const conEdges: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5],
  [3, 6], [6, 7], [7, 5], [4, 8], [8, 1], [0, 8],
];

function ConstellationBg({ isInView }: { isInView: boolean }) {
  const [pulse, setPulse] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => setPulse(p => (p + 1) % conEdges.length), 900);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
        {mounted && conEdges.map(([a, b], i) => (
          <motion.line key={i}
            x1={conNodes[a].x} y1={conNodes[a].y}
            x2={conNodes[b].x} y2={conNodes[b].y}
            stroke="#6366F1"
            strokeWidth={pulse === i ? 0.6 : 0.2}
            strokeOpacity={pulse === i ? 0.5 : 0.08}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: i * 0.08 }}
            style={{ transition: "stroke-opacity 0.4s, stroke-width 0.3s" }}
          />
        ))}
        {conNodes.map((n, i) => (
          <motion.circle key={i} cx={n.x} cy={n.y}
            fill="#6366F1"
            initial={{ r: 0 } as never}
            animate={isInView ? ({ r: 0.8, opacity: 0.3 } as never) : ({ r: 0 } as never)}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}
        {/* Travelling pulse */}
        {mounted && (() => {
          const [a, b] = conEdges[pulse];
          return (
            <motion.circle key={`p-${pulse}`} r={1}
              fill="#6366F1" fillOpacity={0.6}
              animate={{
                cx: [conNodes[a].x, conNodes[b].x],
                cy: [conNodes[a].y, conNodes[b].y],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          );
        })()}
      </svg>
    </div>
  );
}

// Contact card component
function ContactCard({ channel, config, index, isInView }: {
  channel: { label: string; subtitle: string; detail: string };
  config: typeof channelConfig[number];
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={config.href}
      target={config.external ? "_blank" : undefined}
      rel={config.external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center gap-5 rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer"
      style={{
        borderColor: hovered ? `${config.color}40` : "rgba(255,255,255,0.06)",
        backgroundColor: hovered ? `${config.color}08` : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Accent left bar */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ backgroundColor: config.color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <motion.div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: `${config.color}18`,
          boxShadow: hovered ? `0 0 20px ${config.color}20` : "none",
        }}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
          stroke={config.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d={config.icon} />
        </svg>
      </motion.div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-heading text-base font-semibold transition-colors duration-300"
            style={{ color: hovered ? config.color : undefined }}>
            {channel.label}
          </span>
          <span className="text-xs text-muted hidden sm:inline">
            {channel.subtitle}
          </span>
        </div>
        <p className="text-sm text-muted truncate">{channel.detail}</p>
      </div>

      {/* Arrow */}
      <motion.div
        className="flex-shrink-0 text-muted transition-colors duration-300"
        style={{ color: hovered ? config.color : undefined }}
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.a>
  );
}

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();

  const channels = (dictionary.contact as Record<string, unknown>).channels as Array<{ label: string; subtitle: string; detail: string }> | undefined;

  return (
    <SectionWrapper id="contact">
      <div ref={ref} className="relative">
        {/* Background constellation */}
        <ConstellationBg isInView={isInView} />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
            >
              {dictionary.contact.label}
            </motion.p>

            <TextReveal
              as="h2"
              className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl justify-center mb-6"
            >
              {dictionary.contact.heading}
            </TextReveal>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted text-lg max-w-xl mx-auto"
            >
              {dictionary.contact.description}
            </motion.p>
          </div>

          {/* Contact cards */}
          <div className="max-w-2xl mx-auto space-y-4">
            {(channels ?? []).map((channel, i) => (
              <ContactCard
                key={i}
                channel={channel}
                config={channelConfig[i]}
                index={i}
                isInView={isInView}
              />
            ))}
          </div>

          {/* Response time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-sm text-muted font-mono">
              {dictionary.contact.responseTime as string}
            </span>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
