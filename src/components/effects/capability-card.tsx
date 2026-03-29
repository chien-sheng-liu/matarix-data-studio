"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface CapabilityCardProps {
  icon: "data" | "ai" | "analytics" | "strategy";
  title: string;
  description: string;
  index: number;
}

// Brand-aligned palette — matches the site's primary/accent tokens
const accentColors = {
  data:      "#6366F1",
  ai:        "#8B5CF6",
  analytics: "#06B6D4",
  strategy:  "#EC4899",
};

const icons = {
  data: (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <ellipse cx="24" cy="12" rx="14" ry="5" />
      <path d="M10 12v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 20v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 28v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="24" cy="24" r="6" />
      <circle cx="8"  cy="16" r="3" />
      <circle cx="8"  cy="32" r="3" />
      <circle cx="40" cy="16" r="3" />
      <circle cx="40" cy="32" r="3" />
      <circle cx="24" cy="6"  r="3" />
      <circle cx="24" cy="42" r="3" />
      <line x1="11" y1="16" x2="18" y2="21" />
      <line x1="11" y1="32" x2="18" y2="27" />
      <line x1="37" y1="16" x2="30" y2="21" />
      <line x1="37" y1="32" x2="30" y2="27" />
      <line x1="24" y1="9"  x2="24" y2="18" />
      <line x1="24" y1="30" x2="24" y2="39" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="6" y="6" width="36" height="28" rx="3" />
      <polyline points="14,26 20,18 26,22 34,12" />
      <circle cx="14" cy="26" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="34" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <line x1="18" y1="34" x2="18" y2="42" />
      <line x1="30" y1="34" x2="30" y2="42" />
      <line x1="12" y1="42" x2="36" y2="42" />
    </svg>
  ),
  strategy: (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="6" />
      <line x1="24" y1="8"  x2="24" y2="18" />
      <line x1="24" y1="30" x2="24" y2="40" />
      <line x1="8"  y1="24" x2="18" y2="24" />
      <line x1="30" y1="24" x2="40" y2="24" />
      <line x1="24" y1="6"  x2="24" y2="10" strokeWidth="3" />
    </svg>
  ),
};

export function CapabilityCard({ icon, title, description, index }: CapabilityCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const color = accentColors[icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl border p-6 cursor-default overflow-hidden transition-colors duration-300"
      style={{
        borderColor: hovered ? `${color}40` : "rgba(255,255,255,0.07)",
        backgroundColor: hovered ? `${color}08` : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${color}14 0%, transparent 65%)` }}
      />

      {/* Icon */}
      <div className="relative mb-5">
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300"
          style={{
            backgroundColor: hovered ? `${color}15` : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? `${color}30` : "rgba(255,255,255,0.06)"}`,
            color: hovered ? color : "#64748B",
            transition: "background-color 0.3s, border-color 0.3s, color 0.3s",
          }}
          animate={isInView ? { scale: [0.8, 1.05, 1], opacity: [0, 1, 1] } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {icons[icon]}
        </motion.div>
      </div>

      {/* Title */}
      <h3
        className="font-heading text-base font-semibold mb-2 relative transition-colors duration-300"
        style={{ color: hovered ? color : undefined }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed relative">
        {description}
      </p>

      {/* Bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: hovered ? 0.8 : 0.2 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
