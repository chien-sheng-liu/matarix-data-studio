"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/config/site";
import { useLocale } from "@/components/providers/locale-provider";

interface ProjectDrawerProps {
  index: number | null;
  side: "left" | "right";
  onClose: () => void;
}

export function ProjectDrawer({ index, side, onClose }: ProjectDrawerProps) {
  const { dictionary } = useLocale();
  const dict = dictionary.projects;

  // Escape key + body scroll lock
  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose]);

  const project = index !== null ? projects[index] : null;
  const dictProject = index !== null
    ? (dict.projects as Array<{
        title: string; category: string; description: string;
        role: string; highlights: string[]; outcome: string;
      }>)[index]
    : null;

  const isLeft = side === "left";

  return (
    <AnimatePresence>
      {index !== null && project && dictProject && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className={`fixed inset-y-0 z-50 w-full max-w-xl flex flex-col
                       bg-[#0A0A0F]/95 backdrop-blur-xl
                       ${isLeft ? "left-0 border-r border-white/[0.08]" : "right-0 border-l border-white/[0.08]"}`}
            initial={{ x: isLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* Accent top border */}
            <div className="flex-shrink-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }} />

            {/* Scrollable content area */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-8 pb-16">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-mono tracking-wider mb-3"
                      style={{ color: project.color, backgroundColor: `${project.color}15`, border: `1px solid ${project.color}30` }}
                    >
                      {dictProject.category}
                    </span>
                    <h2 className="font-heading text-2xl font-bold leading-snug pr-4">
                      {dictProject.title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label={dict.close as string}
                    className="mt-1 flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted hover:text-foreground hover:border-white/30 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Role */}
                <div className="mb-6">
                  <p className="text-xs font-mono tracking-widest text-muted uppercase mb-1">{dict.role as string}</p>
                  <p className="text-sm font-medium" style={{ color: project.color }}>{dictProject.role}</p>
                </div>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed mb-8">{dictProject.description}</p>

                {/* Key Metrics */}
                {"metrics" in project && (
                  <div className="mb-8">
                    <p className="text-xs font-mono tracking-widest text-muted uppercase mb-3">{dict.keyMetrics as string}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {(project.metrics as readonly string[]).map((metric, i) => {
                        const parts = metric.match(/^([\d.]+[A-Za-z+%×]*)\s+(.+)$/) || metric.match(/^(.+?)\s+(.+)$/);
                        const value = parts ? parts[1] : metric;
                        const label = parts ? parts[2] : "";
                        return (
                          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="font-heading text-xl font-bold mb-0.5" style={{ color: project.color }}>{value}</div>
                            <div className="text-xs text-muted leading-tight">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div className="mb-8">
                  <p className="text-xs font-mono tracking-widest text-muted uppercase mb-4">{dict.highlights as string}</p>
                  <ul className="space-y-3">
                    {dictProject.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                        className="flex gap-3 text-sm text-muted leading-relaxed"
                      >
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                {"technologies" in project && (
                  <div className="mb-8">
                    <p className="text-xs font-mono tracking-widest text-muted uppercase mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies as readonly string[]).map((tech) => (
                        <span key={tech} className="text-xs px-2.5 py-1 rounded-md font-mono border"
                          style={{ color: `${project.color}CC`, borderColor: `${project.color}25`, backgroundColor: `${project.color}08` }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outcome */}
                <div className="rounded-xl border p-5" style={{ borderColor: `${project.color}25`, backgroundColor: `${project.color}06` }}>
                  <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: project.color }}>{dict.outcome as string}</p>
                  <p className="text-sm text-foreground leading-relaxed">{dictProject.outcome}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
