"use client";

import { motion } from "framer-motion";

interface CapabilityCardProps {
  icon: "data" | "ai" | "analytics" | "strategy";
  title: string;
  description: string;
  index: number;
}

const icons = {
  data: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <ellipse cx="24" cy="12" rx="14" ry="5" />
      <path d="M10 12v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 20v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
      <path d="M10 28v8c0 2.76 6.27 5 14 5s14-2.24 14-5v-8" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="24" cy="24" r="6" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="8" cy="32" r="3" />
      <circle cx="40" cy="16" r="3" />
      <circle cx="40" cy="32" r="3" />
      <circle cx="24" cy="6" r="3" />
      <circle cx="24" cy="42" r="3" />
      <line x1="11" y1="16" x2="18" y2="21" />
      <line x1="11" y1="32" x2="18" y2="27" />
      <line x1="37" y1="16" x2="30" y2="21" />
      <line x1="37" y1="32" x2="30" y2="27" />
      <line x1="24" y1="9" x2="24" y2="18" />
      <line x1="24" y1="30" x2="24" y2="39" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
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
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="6" />
      <line x1="24" y1="8" x2="24" y2="18" />
      <line x1="24" y1="30" x2="24" y2="40" />
      <line x1="8" y1="24" x2="18" y2="24" />
      <line x1="30" y1="24" x2="40" y2="24" />
      <line x1="24" y1="6" x2="24" y2="10" strokeWidth="3" />
    </svg>
  ),
};

const accentColors = {
  data: "from-blue-500/20 to-cyan-500/10 border-blue-500/20 group-hover:border-blue-500/40",
  ai: "from-violet-500/20 to-purple-500/10 border-violet-500/20 group-hover:border-violet-500/40",
  analytics: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 group-hover:border-emerald-500/40",
  strategy: "from-amber-500/20 to-orange-500/10 border-amber-500/20 group-hover:border-amber-500/40",
};

const iconColors = {
  data: "text-blue-400",
  ai: "text-violet-400",
  analytics: "text-emerald-400",
  strategy: "text-amber-400",
};

const accentBarColors = {
  data: "bg-blue-400",
  ai: "bg-violet-400",
  analytics: "bg-emerald-400",
  strategy: "bg-amber-400",
};

const glowBgColors = {
  data: "bg-blue-500/20",
  ai: "bg-violet-500/20",
  analytics: "bg-emerald-500/20",
  strategy: "bg-amber-500/20",
};

export function CapabilityCard({ icon, title, description, index }: CapabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.12 }}
      className={`group relative rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 ${accentColors[icon]}`}
    >
      {/* Expanding background glow */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${glowBgColors[icon]}`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      />

      {/* Icon */}
      <div className={`mb-4 relative ${iconColors[icon]}`}>
        {icons[icon]}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 relative">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed relative">
        {description}
      </p>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }} />

      {/* Animated accent bar */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl ${accentBarColors[icon]}`}
        style={{ opacity: 0.3 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
