"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/effects/text-reveal";
import { BarChart } from "@/components/effects/bar-chart";
import { projects } from "@/config/site";

const projectCharts = [
  [
    { label: "Q1", value: 42, color: "#6366F1" },
    { label: "Q2", value: 68, color: "#6366F1" },
    { label: "Q3", value: 85, color: "#6366F1" },
    { label: "Q4", value: 96, color: "#6366F1" },
  ],
  [
    { label: "IoT", value: 50, color: "#06B6D4" },
    { label: "Traffic", value: 78, color: "#06B6D4" },
    { label: "Energy", value: 65, color: "#06B6D4" },
    { label: "Safety", value: 45, color: "#06B6D4" },
  ],
  [
    { label: "CTR", value: 34, color: "#8B5CF6" },
    { label: "Conv", value: 89, color: "#8B5CF6" },
    { label: "AOV", value: 56, color: "#8B5CF6" },
    { label: "LTV", value: 72, color: "#8B5CF6" },
  ],
  [
    { label: "Extract", value: 85, color: "#10B981" },
    { label: "Accuracy", value: 97, color: "#10B981" },
    { label: "Speed", value: 73, color: "#10B981" },
    { label: "Scale", value: 60, color: "#10B981" },
  ],
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
          isEven ? "" : "lg:direction-rtl"
        }`}
      >
        {/* Text side */}
        <div className={isEven ? "lg:pr-8" : "lg:pl-8 lg:order-2"}>
          <motion.span
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block rounded-full px-4 py-1.5 text-xs font-mono tracking-wider mb-6"
            style={{
              color: project.color,
              backgroundColor: `${project.color}12`,
              border: `1px solid ${project.color}25`,
            }}
          >
            {project.category}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
          >
            {project.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted leading-relaxed mb-6"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: project.color }}
          >
            <span>View Case Study</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </motion.div>
        </div>

        {/* Chart side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`rounded-2xl border border-border bg-surface/30 p-8 ${
            isEven ? "" : "lg:order-1"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs text-muted tracking-wider uppercase">
              Key Metrics
            </span>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: project.color }}
            />
          </div>
          <BarChart data={projectCharts[index]} height={120} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative px-6 py-24 lg:px-8 lg:py-32 overflow-hidden"
    >
      {/* Parallax background element */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[128px] pointer-events-none"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        <div ref={headerRef} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
          >
            Selected Work
          </motion.p>

          <TextReveal
            as="h2"
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl justify-center"
          >
            Our Projects
          </TextReveal>
        </div>

        <div className="space-y-32">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
