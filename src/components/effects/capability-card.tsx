"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface CapabilityCardProps {
  icon: "data" | "ai" | "analytics" | "strategy";
  title: string;
  description: string;
  index: number;
}

const accentColors = {
  data:      "#6366F1",
  ai:        "#8B5CF6",
  analytics: "#06B6D4",
  strategy:  "#EC4899",
};

const techTags = {
  data:      ["Kafka", "Spark", "ClickHouse", "dbt"],
  ai:        ["LangChain", "PyTorch", "OpenAI", "RAG"],
  analytics: ["SQL", "Metabase", "Python", "dbt"],
  strategy:  ["Roadmap", "Governance", "KPIs", "ROI"],
};

const sparklineBases = {
  data:      [40, 65, 50, 80, 60, 90, 70, 85],
  ai:        [55, 45, 75, 60, 85, 50, 90, 70],
  analytics: [30, 70, 45, 80, 55, 75, 60, 95],
  strategy:  [60, 50, 80, 40, 70, 85, 55, 75],
};

function Sparkline({ color, icon, active }: { color: string; icon: keyof typeof sparklineBases; active: boolean }) {
  const base = sparklineBases[icon];
  const [heights, setHeights] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setHeights(base.map(h => Math.max(10, Math.min(100, h + (Math.random() - 0.5) * (active ? 30 : 14)))));
    }, active ? 250 : 800);
    return () => clearInterval(id);
  }, [base, active]);

  return (
    <div className="flex items-end gap-0.5 h-8">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ backgroundColor: color, opacity: active ? 0.3 + (h / 100) * 0.7 : 0.15 + (h / 100) * 0.2 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: active ? 0.2 : 0.6, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const icons = {
  data: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <ellipse cx="24" cy="12" rx="14" ry="5" />
      <path d="M10 12v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 20v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 28v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="24" cy="24" r="6" />
      <circle cx="8"  cy="16" r="3" /><circle cx="8"  cy="32" r="3" />
      <circle cx="40" cy="16" r="3" /><circle cx="40" cy="32" r="3" />
      <circle cx="24" cy="6"  r="3" /><circle cx="24" cy="42" r="3" />
      <line x1="11" y1="16" x2="18" y2="21" /><line x1="11" y1="32" x2="18" y2="27" />
      <line x1="37" y1="16" x2="30" y2="21" /><line x1="37" y1="32" x2="30" y2="27" />
      <line x1="24" y1="9"  x2="24" y2="18" /><line x1="24" y1="30" x2="24" y2="39" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="6" y="6" width="36" height="28" rx="3" />
      <polyline points="14,26 20,18 26,22 34,12" />
      <circle cx="14" cy="26" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="34" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <line x1="18" y1="34" x2="18" y2="42" /><line x1="30" y1="34" x2="30" y2="42" />
      <line x1="12" y1="42" x2="36" y2="42" />
    </svg>
  ),
  strategy: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="6" />
      <line x1="24" y1="8"  x2="24" y2="18" /><line x1="24" y1="30" x2="24" y2="40" />
      <line x1="8"  y1="24" x2="18" y2="24" /><line x1="30" y1="24" x2="40" y2="24" />
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
      className="group relative rounded-2xl border p-5 cursor-default overflow-hidden flex flex-col gap-4"
      style={{
        borderColor: hovered ? `${color}40` : "rgba(255,255,255,0.07)",
        backgroundColor: hovered ? `${color}08` : "rgba(255,255,255,0.02)",
        transition: "border-color 0.3s, background-color 0.3s",
      }}
    >
      {/* Always-on subtle bg */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 10%, ${color}0A 0%, transparent 60%)` }} />
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${color}18 0%, transparent 65%)` }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden rounded-tl-2xl pointer-events-none">
        <div className="absolute top-0 left-0 w-[2px] h-5 rounded-full"
          style={{ backgroundColor: color, opacity: hovered ? 0.9 : 0.4, transition: "opacity 0.3s" }} />
        <div className="absolute top-0 left-0 h-[2px] w-5 rounded-full"
          style={{ backgroundColor: color, opacity: hovered ? 0.9 : 0.4, transition: "opacity 0.3s" }} />
      </div>

      {/* Icon + title row */}
      <div className="flex items-center gap-3 relative">
        <motion.div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: `${color}12`,
            border: `1px solid ${color}25`,
            color: hovered ? color : `${color}99`,
            transition: "color 0.3s",
          }}
          animate={isInView ? { scale: [0.8, 1.05, 1], opacity: [0, 1, 1] } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
        >
          {icons[icon]}
        </motion.div>
        <h3
          className="font-heading text-sm font-semibold leading-snug transition-colors duration-300"
          style={{ color: hovered ? color : undefined }}
        >
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed relative">
        {description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 relative">
        {techTags[icon].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + i * 0.05 }}
            className="font-mono text-[10px] px-2 py-0.5 rounded-md border"
            style={{
              color: hovered ? color : `${color}88`,
              borderColor: hovered ? `${color}35` : `${color}18`,
              backgroundColor: hovered ? `${color}10` : `${color}06`,
              transition: "color 0.3s, border-color 0.3s, background-color 0.3s",
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Sparkline */}
      <div className="relative">
        <Sparkline color={color} icon={icon} active={hovered} />
      </div>

      {/* Bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: hovered ? 0.85 : 0.35 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
      />
    </motion.div>
  );
}
