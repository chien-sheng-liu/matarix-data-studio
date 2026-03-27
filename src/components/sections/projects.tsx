"use client";

import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { ProjectDrawer } from "@/components/ui/project-drawer";
import { projects } from "@/config/site";

// ─── Visualization 1: Stock Chart ────────────────────────────────────────────
const stockPoints = [18, 24, 20, 32, 28, 38, 34, 45, 40, 52, 48, 58, 54, 65, 70];
function toPath(pts: number[], w: number, h: number) {
  return pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (v / 80) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}
function StockViz({ color, isInView }: { color: string; isInView: boolean }) {
  const W = 280; const H = 100;
  const path = toPath(stockPoints, W, H);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="sg0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="sglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Grid */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={0} y1={H * f} x2={W} y2={H * f} stroke="white" strokeOpacity={0.05} strokeWidth={1} />
      ))}
      {/* Area */}
      <motion.path
        d={`${path} L ${W} ${H + 20} L 0 ${H + 20} Z`}
        fill="url(#sg0)"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.5 }}
      />
      {/* Line */}
      <motion.path
        d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
        filter="url(#sglow)"
        initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Data points */}
      {stockPoints.map((v, i) => {
        const x = (i / (stockPoints.length - 1)) * W;
        const y = H - (v / 80) * H;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "crosshair" }}>
            <circle cx={x} cy={y} r={hovered === i ? 5 : 3} fill={color} opacity={hovered === i ? 1 : 0.6} />
            {hovered === i && (
              <g>
                <rect x={x - 18} y={y - 22} width={36} height={16} rx={4} fill={color} opacity={0.9} />
                <text x={x} y={y - 11} textAnchor="middle" fill="white" fontSize={9} fontFamily="monospace">${v}</text>
              </g>
            )}
          </g>
        );
      })}
      {/* Rising arrow */}
      <motion.text x={W - 8} y={H - (stockPoints[stockPoints.length - 1] / 80) * H - 6}
        textAnchor="end" fill={color} fontSize={10} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
        ▲ +289%
      </motion.text>
    </svg>
  );
}

// ─── Visualization 2: Anomaly Scatter Plot ────────────────────────────────────
const vessels = Array.from({ length: 28 }, (_, i) => ({
  x: 12 + (i * 37) % 256,
  y: 15 + (i * 53 + i * i * 7) % 90,
  anomaly: [3, 9, 15, 21].includes(i),
}));
function AnomalyViz({ color, isInView }: { color: string; isInView: boolean }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, [isInView]);
  return (
    <svg viewBox="0 0 280 120" className="w-full" style={{ height: 120 }}>
      <defs>
        <filter id="aglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Grid */}
      {[0.33, 0.66].map(f => (
        <g key={f}>
          <line x1={0} y1={120 * f} x2={280} y2={120 * f} stroke="white" strokeOpacity={0.04} strokeWidth={1}/>
          <line x1={280 * f} y1={0} x2={280 * f} y2={120} stroke="white" strokeOpacity={0.04} strokeWidth={1}/>
        </g>
      ))}
      {vessels.map((v, i) => (
        <motion.circle key={i} cx={v.x} cy={v.y} r={v.anomaly ? 5 : 3}
          fill={v.anomaly ? "#EF4444" : color}
          opacity={v.anomaly ? 1 : 0.5}
          filter={v.anomaly ? "url(#aglow)" : undefined}
          initial={{ scale: 0 }}
          animate={isInView ? {
            scale: 1,
            r: v.anomaly ? [5, 7, 5] : 3,
          } : {}}
          transition={v.anomaly
            ? { duration: 0.4, delay: 0.4 + i * 0.03, r: { repeat: Infinity, duration: 1.2, delay: tick * 0.1 } }
            : { duration: 0.3, delay: 0.3 + i * 0.03 }}
        />
      ))}
      <motion.text x={2} y={115} fill="#EF4444" fontSize={8} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>
        ● {vessels.filter(v => v.anomaly).length} anomalies detected
      </motion.text>
    </svg>
  );
}

// ─── Visualization 3: Forecast Lines ─────────────────────────────────────────
const timeX = Array.from({ length: 20 }, (_, i) => i);
const sarima  = [42,44,43,46,48,45,47,50,49,52,51,54,56,53,55,58,60,57,59,62];
const prophet = [42,45,44,48,50,47,49,53,51,55,54,57,59,55,58,62,64,60,63,67];
const hw      = [42,43,44,45,47,46,48,51,49,52,52,55,56,54,56,59,61,58,60,63];
function fPath(vals: number[], W: number, H: number) {
  const mn = 40; const mx = 70;
  return vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - ((v - mn) / (mx - mn)) * H;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}
function ForecastViz({ color, isInView }: { color: string; isInView: boolean }) {
  const W = 280; const H = 95;
  const lines = [
    { data: sarima,  c: color,     label: "SARIMA" },
    { data: prophet, c: "#10B981", label: "Prophet" },
    { data: hw,      c: "#F59E0B", label: "HW" },
  ];
  const [hov, setHov] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H + 25}`} className="w-full" style={{ height: 120 }}>
      {/* COVID disruption band */}
      <motion.rect x={W * 0.35} y={0} width={W * 0.25} height={H}
        fill="#EF4444" fillOpacity={0.06}
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}/>
      <motion.text x={W * 0.475} y={10} textAnchor="middle" fill="#EF4444" fontSize={7} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
        COVID-19
      </motion.text>
      {lines.map((l, li) => (
        <g key={li} onMouseEnter={() => setHov(li)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
          <motion.path d={fPath(l.data, W, H)} fill="none"
            stroke={l.c} strokeWidth={hov === li ? 2.5 : 1.5}
            strokeOpacity={hov !== null && hov !== li ? 0.25 : 0.9}
            strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4 + li * 0.2, ease: "easeInOut" }}
          />
          <motion.text x={W - 2} y={H - ((l.data[l.data.length - 1] - 40) / 30) * H + 4}
            textAnchor="end" fill={l.c} fontSize={8} fontFamily="monospace" fontWeight={hov === li ? "bold" : "normal"}
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.9 + li * 0.1 }}>
            {l.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

// ─── Visualization 4: Probability Histogram ───────────────────────────────────
const rtpBins = [
  { label: "88%", h: 15 }, { label: "90%", h: 28 }, { label: "92%", h: 45 },
  { label: "94%", h: 72 }, { label: "95%", h: 98 }, { label: "96%", h: 70 },
  { label: "97%", h: 42 }, { label: "98%", h: 20 }, { label: "99%", h: 8 },
];
function SlotViz({ color, isInView }: { color: string; isInView: boolean }) {
  const [run, setRun] = useState(false);
  const [heights, setHeights] = useState(rtpBins.map(b => b.h));
  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setRun(true), 800);
    return () => clearTimeout(t);
  }, [isInView]);
  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame > 6) { clearInterval(id); setHeights(rtpBins.map(b => b.h)); return; }
      setHeights(rtpBins.map(() => 8 + Math.random() * 90));
    }, 180);
    return () => clearInterval(id);
  }, [run]);
  const W = 280; const H = 90;
  const bw = W / rtpBins.length - 4;
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" style={{ height: 120 }}>
      {rtpBins.map((b, i) => {
        const x = i * (W / rtpBins.length) + 2;
        const bh = (heights[i] / 100) * H;
        const isTarget = b.label === "95%";
        return (
          <g key={i}>
            <motion.rect x={x} y={H - bh} width={bw} height={bh} rx={2}
              fill={isTarget ? color : `${color}50`}
              animate={{ y: H - bh, height: bh }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
            <text x={x + bw / 2} y={H + 12} textAnchor="middle" fill={isTarget ? color : "#64748B"} fontSize={7} fontFamily="monospace">{b.label}</text>
          </g>
        );
      })}
      <motion.text x={W / 2} y={H + 22} textAnchor="middle" fill={color} fontSize={8} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>
        Target RTP Optimised ✓
      </motion.text>
    </svg>
  );
}

// ─── Visualization 5: RAG Pipeline Flow ──────────────────────────────────────
const nodes = [
  { x: 20,  y: 50, label: "Doc", icon: "📄" },
  { x: 85,  y: 50, label: "Embed", icon: "⚡" },
  { x: 150, y: 50, label: "Vector\nDB", icon: "🗄" },
  { x: 215, y: 30, label: "LLM", icon: "🧠" },
  { x: 215, y: 70, label: "Redis", icon: "⚙" },
  { x: 260, y: 50, label: "Reply", icon: "💬" },
];
const edges = [
  [0,1],[1,2],[2,3],[2,4],[3,5],[4,5],
];
function PipelineViz({ color, isInView }: { color: string; isInView: boolean }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => setActive(a => (a + 1) % edges.length), 600);
    return () => clearInterval(id);
  }, [isInView]);
  return (
    <svg viewBox="0 0 280 110" className="w-full" style={{ height: 120 }}>
      <defs>
        <filter id="pglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} opacity={0.6}/>
        </marker>
      </defs>
      {/* Edges */}
      {edges.map(([a, b], ei) => {
        const from = nodes[a]; const to = nodes[b];
        const isLit = active === ei;
        return (
          <g key={ei}>
            <line x1={from.x + 18} y1={from.y} x2={to.x - 18} y2={to.y}
              stroke={color} strokeWidth={isLit ? 2 : 1}
              strokeOpacity={isLit ? 0.9 : 0.2}
              markerEnd="url(#arr)"
              style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
            />
            {isLit && (
              <motion.circle r={3} fill={color} filter="url(#pglow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0], cx: [from.x + 18, to.x - 18], cy: [from.y, to.y] }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.12, type: "spring", stiffness: 260 }}
        >
          <rect x={n.x - 18} y={n.y - 14} width={36} height={28} rx={6}
            fill="#0A0A0F" stroke={color} strokeOpacity={0.4} strokeWidth={1.5}/>
          <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize={10}>{n.icon}</text>
          <text x={n.x} y={n.y + 10} textAnchor="middle" fill="#94A3B8" fontSize={6} fontFamily="monospace">{n.label}</text>
        </motion.g>
      ))}
    </svg>
  );
}

// ─── Viz selector ─────────────────────────────────────────────────────────────
function ProjectViz({ index, color, isInView }: { index: number; color: string; isInView: boolean }) {
  switch (index) {
    case 0: return <StockViz color={color} isInView={isInView} />;
    case 1: return <AnomalyViz color={color} isInView={isInView} />;
    case 2: return <ForecastViz color={color} isInView={isInView} />;
    case 3: return <SlotViz color={color} isInView={isInView} />;
    case 4: return <PipelineViz color={color} isInView={isInView} />;
    default: return null;
  }
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onOpen }: { project: (typeof projects)[number]; index: number; onOpen: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;
  const { dictionary } = useLocale();
  const dictProject = (dictionary.projects.projects as Array<{ title: string; category: string; description: string }>)[index];
  const title = dictProject?.title || project.title;
  const category = dictProject?.category || project.category;
  const description = dictProject?.description || project.description;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Text side */}
        <div className={isEven ? "lg:pr-8" : "lg:pl-8 lg:order-2"}>
          <motion.span
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block rounded-full px-4 py-1.5 text-xs font-mono tracking-wider mb-6"
            style={{ color: project.color, backgroundColor: `${project.color}12`, border: `1px solid ${project.color}25` }}
          >
            {category}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-2xl sm:text-3xl font-bold mb-4 leading-tight"
          >
            {title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted leading-relaxed mb-6 text-sm"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {"technologies" in project &&
              (project.technologies as readonly string[]).map((tech) => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-md font-mono border"
                  style={{ color: `${project.color}CC`, borderColor: `${project.color}25`, backgroundColor: `${project.color}08` }}>
                  {tech}
                </span>
              ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={onOpen}
            className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: project.color }}
          >
            {dictionary.projects.viewDetails as string}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform group-hover:translate-x-1">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Visualization side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`rounded-2xl border bg-surface/30 p-6 ${isEven ? "" : "lg:order-1"}`}
          style={{ borderColor: `${project.color}20` }}
        >
          {/* Header + metrics */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-muted tracking-wider uppercase">
              {dictionary.projects.keyMetrics}
            </span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
          </div>

          {"metrics" in project && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(project.metrics as readonly string[]).map((metric, j) => {
                const parts = metric.match(/^([\d.]+[A-Za-z+%×]*)\s+(.+)$/) || metric.match(/^(.+?)\s+(.+)$/);
                const value = parts ? parts[1] : metric;
                const label = parts ? parts[2] : "";
                return (
                  <motion.div key={j} initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + j * 0.1 }}
                    className="text-center">
                    <div className="font-heading text-lg font-bold mb-0.5" style={{ color: project.color }}>{value}</div>
                    <div className="text-xs text-muted leading-tight">{label}</div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Dynamic visualization */}
          <div className="rounded-xl bg-background/50 p-3 border border-white/[0.04]">
            <ProjectViz index={index} color={project.color} isInView={isInView} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const { dictionary } = useLocale();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const [selected, setSelected] = useState<{ index: number; side: "left" | "right" } | null>(null);

  return (
    <section id="projects" ref={containerRef} className="relative px-6 py-14 lg:px-8 lg:py-20 overflow-hidden">
      <motion.div style={{ y: bgY }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[128px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div ref={headerRef} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4">
            {dictionary.projects.label}
          </motion.p>
          <TextReveal as="h2" className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl justify-center">
            {dictionary.projects.heading}
          </TextReveal>
        </div>

        <div className="space-y-28">
          {projects.map((project, i) => {
            // Even: text left → drawer right. Odd: text right → drawer left.
            const drawerSide = i % 2 === 0 ? "right" : "left";
            return (
              <ProjectCard key={project.title} project={project} index={i} onOpen={() => setSelected({ index: i, side: drawerSide })} />
            );
          })}
        </div>
      </div>

      <ProjectDrawer index={selected?.index ?? null} side={selected?.side ?? "right"} onClose={() => setSelected(null)} />
    </section>
  );
}
