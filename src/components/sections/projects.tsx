"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { ProjectDrawer } from "@/components/ui/project-drawer";
import { projects } from "@/config/site";

// ─── Visualization 1: Stock Chart ────────────────────────────────────────────
const stockPoints = [18, 24, 20, 32, 28, 38, 34, 45, 40, 52, 48, 58, 54, 65, 70];
const stockLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
function toPath(pts: number[], w: number, h: number) {
  return pts
    .map((v, i) => {
      const x = 32 + (i / (pts.length - 1)) * (w - 40);
      const y = h - (v / 80) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}
function StockViz({ color, isInView }: { color: string; isInView: boolean }) {
  const W = 280; const H = 185;
  const path = toPath(stockPoints, W, H);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full">
      <defs>
        <linearGradient id="sg0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="sglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Y-axis ticks + grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = H * (1 - f);
        const val = Math.round(f * 80);
        return (
          <g key={f}>
            <line x1={30} y1={y} x2={W} y2={y} stroke="white" strokeOpacity={0.05} strokeWidth={1} />
            <text x={26} y={y + 4} textAnchor="end" fill="#64748B" fontSize={8} fontFamily="monospace">{val}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <motion.path
        d={`${path} L ${32 + (W - 40)} ${H + 10} L 32 ${H + 10} Z`}
        fill="url(#sg0)"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.5 }}
      />
      {/* Main line */}
      <motion.path
        d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
        filter="url(#sglow)"
        initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Data points + tooltips */}
      {stockPoints.map((v, i) => {
        const x = 32 + (i / (stockPoints.length - 1)) * (W - 40);
        const y = H - (v / 80) * H;
        const isH = hovered === i;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "crosshair" }}>
            <circle cx={x} cy={y} r={isH ? 7 : 4} fill={color} opacity={isH ? 1 : 0.65} />
            {isH && (
              <g>
                <rect x={x - 22} y={y - 28} width={44} height={20} rx={5} fill={color} opacity={0.92} />
                <text x={x} y={y - 14} textAnchor="middle" fill="white" fontSize={10} fontFamily="monospace" fontWeight="bold">${v}</text>
              </g>
            )}
          </g>
        );
      })}
      {/* X-axis labels (every 3rd) */}
      {stockPoints.map((_, i) => {
        if (i % 3 !== 0) return null;
        const x = 32 + (i / (stockPoints.length - 1)) * (W - 40);
        return <text key={i} x={x} y={H + 20} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">{stockLabels[i]}</text>;
      })}
      {/* Rising label */}
      <motion.text x={W - 4} y={H - (stockPoints[stockPoints.length - 1] / 80) * H - 10}
        textAnchor="end" fill={color} fontSize={12} fontFamily="monospace" fontWeight="bold"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
        ▲ +289%
      </motion.text>
    </svg>
  );
}

// ─── Visualization 2: AIS Radar ───────────────────────────────────────────────
const radarVessels = [
  { angle: 28,  r: 0.55, anomaly: false },
  { angle: 72,  r: 0.38, anomaly: false },
  { angle: 110, r: 0.70, anomaly: true  },
  { angle: 145, r: 0.30, anomaly: false },
  { angle: 190, r: 0.62, anomaly: false },
  { angle: 225, r: 0.45, anomaly: true  },
  { angle: 260, r: 0.78, anomaly: false },
  { angle: 305, r: 0.52, anomaly: true  },
  { angle: 340, r: 0.33, anomaly: false },
  { angle: 58,  r: 0.82, anomaly: false },
  { angle: 175, r: 0.58, anomaly: true  },
  { angle: 320, r: 0.68, anomaly: false },
];
function vesselXY(angle: number, r: number, cx: number, cy: number, maxR: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + Math.cos(rad) * r * maxR, y: cy + Math.sin(rad) * r * maxR };
}
function AnomalyViz({ color, isInView }: { color: string; isInView: boolean }) {
  const [sweep, setSweep] = useState(0);
  const [lit, setLit] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setSweep(s => (s + 2) % 360);
    }, 16);
    return () => clearInterval(id);
  }, [isInView]);

  // light up vessels when sweep passes over them
  useEffect(() => {
    radarVessels.forEach((v, i) => {
      const diff = ((sweep - v.angle) + 360) % 360;
      if (diff < 6) {
        setLit(prev => new Set([...prev, i]));
        setTimeout(() => setLit(prev => { const n = new Set(prev); n.delete(i); return n; }), 900);
      }
    });
  }, [sweep]);

  const W = 280; const H = 220;
  const cx = W / 2; const cy = H / 2 + 4; const maxR = 92;
  const sweepRad = (sweep - 90) * (Math.PI / 180);
  const sweepX = cx + Math.cos(sweepRad) * maxR;
  const sweepY = cy + Math.sin(sweepRad) * maxR;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <radialGradient id="radarbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </radialGradient>
        <radialGradient id="sweep-trail" cx={`${(sweepX/W)*100}%`} cy={`${(sweepY/H)*100}%`} r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id="aglow2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="rglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="radarclip"><circle cx={cx} cy={cy} r={maxR}/></clipPath>
      </defs>

      {/* Radar background */}
      <circle cx={cx} cy={cy} r={maxR} fill="url(#radarbg)" />
      {/* Rings */}
      {[0.33, 0.66, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={maxR * f} fill="none"
          stroke={color} strokeOpacity={0.12} strokeWidth={0.8} />
      ))}
      {/* Cross hairs */}
      <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke={color} strokeOpacity={0.1} strokeWidth={0.6}/>
      <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke={color} strokeOpacity={0.1} strokeWidth={0.6}/>

      {/* Sweep trail (pie sector) — client-only to avoid SSR mismatch */}
      {mounted && <g clipPath="url(#radarclip)">
        {Array.from({ length: 30 }, (_, k) => {
          const trailAngle = sweep - k * 4;
          const a1 = (trailAngle - 90) * (Math.PI / 180);
          const a2 = (trailAngle - 4 - 90) * (Math.PI / 180);
          const x1 = cx + Math.cos(a1) * maxR; const y1 = cy + Math.sin(a1) * maxR;
          const x2 = cx + Math.cos(a2) * maxR; const y2 = cy + Math.sin(a2) * maxR;
          return (
            <path key={k}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${maxR} ${maxR} 0 0 0 ${x2} ${y2} Z`}
              fill={color} fillOpacity={(0.18 * (1 - k / 30))}
            />
          );
        })}
        {/* Sweep line */}
        <line x1={cx} y1={cy} x2={sweepX} y2={sweepY}
          stroke={color} strokeWidth={1.5} strokeOpacity={0.9} filter="url(#aglow2)" />
      </g>}

      {/* Vessels */}
      {radarVessels.map((v, i) => {
        const { x, y } = vesselXY(v.angle, v.r, cx, cy, maxR);
        const isLit = lit.has(i);
        return (
          <g key={i}>
            {v.anomaly && (
              <motion.circle cx={x} cy={y} r={8}
                fill="none" stroke="#EF4444" strokeWidth={1}
                animate={{ r: [6, 11, 6], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              />
            )}
            <circle cx={x} cy={y} r={v.anomaly ? 3.5 : 2.5}
              fill={v.anomaly ? "#EF4444" : color}
              opacity={isLit ? 1 : v.anomaly ? 0.85 : 0.35}
              filter={v.anomaly ? "url(#rglow)" : undefined}
            />
          </g>
        );
      })}

      {/* Labels */}
      <text x={cx - maxR + 4} y={cy - maxR + 12} fill={color} fontSize={8} fontFamily="monospace" opacity={0.5}>AIS RADAR</text>
      <motion.text x={cx} y={H - 6} textAnchor="middle" fill="#EF4444" fontSize={9} fontFamily="monospace"
        animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
        ⚠ {radarVessels.filter(v => v.anomaly).length} HIGH-RISK VESSELS DETECTED
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
  const W = 280; const H = 175;
  const lines = [
    { data: sarima,  c: color,     label: "SARIMA" },
    { data: prophet, c: "#10B981", label: "Prophet" },
    { data: hw,      c: "#F59E0B", label: "HW" },
  ];
  const [hov, setHov] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H + 45}`} className="w-full">
      {/* Y-axis grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = H * (1 - f);
        const val = Math.round(40 + f * 30);
        return (
          <g key={f}>
            <line x1={28} y1={y} x2={W} y2={y} stroke="white" strokeOpacity={0.05} strokeWidth={1}/>
            <text x={24} y={y + 4} textAnchor="end" fill="#64748B" fontSize={8} fontFamily="monospace">{val}</text>
          </g>
        );
      })}
      {/* COVID disruption band */}
      <motion.rect x={W * 0.35} y={0} width={W * 0.25} height={H}
        fill="#EF4444" fillOpacity={0.07}
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}/>
      <motion.text x={W * 0.475} y={12} textAnchor="middle" fill="#EF4444" fontSize={8} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
        COVID-19
      </motion.text>
      {/* Forecast lines */}
      {lines.map((l, li) => (
        <g key={li} onMouseEnter={() => setHov(li)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
          <motion.path d={fPath(l.data, W, H)} fill="none"
            stroke={l.c} strokeWidth={hov === li ? 3 : 2}
            strokeOpacity={hov !== null && hov !== li ? 0.2 : 0.9}
            strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4 + li * 0.2, ease: "easeInOut" }}
          />
          <motion.text x={W - 2} y={H - ((l.data[l.data.length - 1] - 40) / 30) * H + 4}
            textAnchor="end" fill={l.c} fontSize={9} fontFamily="monospace" fontWeight={hov === li ? "bold" : "normal"}
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.9 + li * 0.1 }}>
            {l.label}
          </motion.text>
        </g>
      ))}
      {/* Legend */}
      {lines.map((l, li) => (
        <motion.g key={li} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 + li * 0.1 }}>
          <rect x={30 + li * 76} y={H + 16} width={10} height={3} rx={1.5} fill={l.c}/>
          <text x={44 + li * 76} y={H + 21} fill={l.c} fontSize={9} fontFamily="monospace">{l.label}</text>
        </motion.g>
      ))}
      <motion.text x={W / 2} y={H + 38} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
        Hover to compare models
      </motion.text>
    </svg>
  );
}

// ─── Visualization 4: Slot Reels ──────────────────────────────────────────────
const SYMBOLS = ["7️⃣", "💎", "🍒", "⭐", "🔔", "🍋", "💰", "🎯"];
const WIN_ROW = ["💎", "💎", "💎"]; // winning combo
const REEL_COUNT = 3;
const VISIBLE = 3; // visible rows per reel
const CELL_H = 56;

function buildReel(winSymbol: string) {
  // build a long strip ending in the win symbol at position VISIBLE-1 (middle row)
  const filler = Array.from({ length: 12 }, (_, i) => SYMBOLS[i % SYMBOLS.length]);
  return [...filler, winSymbol];
}

const reelStrips = WIN_ROW.map(s => buildReel(s));

function SlotViz({ color, isInView }: { color: string; isInView: boolean }) {
  // offsets: how many cells each reel has scrolled
  const [offsets, setOffsets] = useState([0, 0, 0]);
  const [stopped, setStopped] = useState([false, false, false]);
  const [won, setWon] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isInView) return;
    setOffsets([0, 0, 0]);
    setStopped([false, false, false]);
    setWon(false);

    // spin all reels fast
    let tick = 0;
    animRef.current = setInterval(() => {
      tick++;
      setOffsets(prev => prev.map((o, i) => stopped[i] ? o : o + 1));
    }, 60);

    // stop reels sequentially
    const finalOffset = reelStrips[0].length - 1; // land on win symbol
    const stopReel = (col: number) => {
      setStopped(prev => {
        const n = [...prev]; n[col] = true; return n;
      });
      setOffsets(prev => {
        const n = [...prev]; n[col] = finalOffset; return n;
      });
    };

    const t1 = setTimeout(() => stopReel(0), 900);
    const t2 = setTimeout(() => stopReel(1), 1400);
    const t3 = setTimeout(() => {
      stopReel(2);
      if (animRef.current) clearInterval(animRef.current);
      setTimeout(() => setWon(true), 200);
    }, 1900);

    return () => {
      if (animRef.current) clearInterval(animRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  const reelW = 68;
  const gap = 14;
  const totalW = REEL_COUNT * reelW + (REEL_COUNT - 1) * gap;
  const startX = (280 - totalW) / 2;
  const reelH = VISIBLE * CELL_H;
  const frameY = 18;

  return (
    <svg viewBox="0 0 280 230" className="w-full">
      <defs>
        <filter id="slotglow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="slotfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0A0A0F" stopOpacity="0.98"/>
          <stop offset="22%"  stopColor="#0A0A0F" stopOpacity="0"/>
          <stop offset="78%"  stopColor="#0A0A0F" stopOpacity="0"/>
          <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0.98"/>
        </linearGradient>
        <clipPath id="reelclip"><rect x={startX - 4} y={frameY + 4} width={totalW + 8} height={reelH}/></clipPath>
      </defs>

      {/* Machine frame */}
      <rect x={startX - 10} y={frameY} width={totalW + 20} height={reelH + 12} rx={12}
        fill="none" stroke={color} strokeOpacity={won ? 0.95 : 0.3} strokeWidth={won ? 2.5 : 1.5}
        style={{ transition: "stroke-opacity 0.4s, stroke-width 0.3s" }}
      />
      {won && (
        <rect x={startX - 10} y={frameY} width={totalW + 20} height={reelH + 12} rx={12}
          fill={color} fillOpacity={0.07} filter="url(#slotglow)"
        />
      )}

      {/* Column dividers */}
      {[1, 2].map(col => (
        <line key={col}
          x1={startX + col * (reelW + gap) - gap / 2} y1={frameY}
          x2={startX + col * (reelW + gap) - gap / 2} y2={frameY + reelH + 12}
          stroke={color} strokeOpacity={0.1} strokeWidth={1}
        />
      ))}

      {/* Win line */}
      <line
        x1={startX - 10} y1={frameY + 6 + CELL_H + CELL_H / 2}
        x2={startX + totalW + 10} y2={frameY + 6 + CELL_H + CELL_H / 2}
        stroke={color} strokeOpacity={won ? 0.85 : 0.18} strokeWidth={won ? 2 : 1}
        style={{ transition: "stroke-opacity 0.4s" }}
      />

      {/* Reels */}
      <g clipPath="url(#reelclip)">
        {Array.from({ length: REEL_COUNT }, (_, col) => {
          const strip = reelStrips[col];
          const offset = offsets[col] % strip.length;
          const x = startX + col * (reelW + gap);
          return (
            <g key={col}>
              {Array.from({ length: VISIBLE + 2 }, (_, row) => {
                const symbolIdx = (offset + row) % strip.length;
                const symbol = strip[symbolIdx];
                const y = frameY + 4 + (row - 1) * CELL_H;
                const isMidRow = row === 1;
                return (
                  <text key={row} x={x + reelW / 2} y={y + CELL_H * 0.7}
                    textAnchor="middle" fontSize={isMidRow && won ? 36 : 30}
                    opacity={isMidRow ? 1 : 0.28}
                    style={{ transition: "font-size 0.3s" }}
                  >
                    {symbol}
                  </text>
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Fade mask */}
      <rect x={startX - 10} y={frameY} width={totalW + 20} height={reelH + 12} fill="url(#slotfade)" rx={12}/>

      {/* Stopped indicators */}
      {stopped.map((s, col) => s && (
        <motion.circle key={col}
          cx={startX + col * (reelW + gap) + reelW / 2}
          cy={frameY + reelH + 22}
          r={4} fill={color}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
      ))}

      {/* RTP label */}
      <motion.text x={140} y={213} textAnchor="middle" fill={color} fontSize={11} fontFamily="monospace" fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={won ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        ✦ RTP 95% TARGET ACHIEVED ✦
      </motion.text>
    </svg>
  );
}

// ─── Visualization 5: RAG Pipeline Flow (large) ───────────────────────────────
const pipeNodes = [
  { x: 36,  y: 110, label: "Document", sub: "Upload",   icon: "📄", w: 62 },
  { x: 130, y: 110, label: "Embed",    sub: "768-dim",  icon: "⚡", w: 58 },
  { x: 220, y: 110, label: "Vector DB", sub: "pgvector", icon: "🗄", w: 62 },
  { x: 310, y: 65,  label: "LLM",      sub: "OpenAI",   icon: "🧠", w: 56 },
  { x: 310, y: 158, label: "Redis",    sub: "Cache",    icon: "⚡", w: 56 },
  { x: 370, y: 110, label: "Reply",    sub: "Stream",   icon: "💬", w: 56 },
];
const pipeEdges = [[0,1],[1,2],[2,3],[2,4],[3,5],[4,5]];
const edgeLabels = ["chunk", "embed", "retrieve", "generate", "cache hit", "stream"];

function PipelineViz({ color, isInView }: { color: string; isInView: boolean }) {
  const [active, setActive] = useState(0);
  const [particleKey, setParticleKey] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setActive(a => (a + 1) % pipeEdges.length);
      setParticleKey(k => k + 1);
    }, 700);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <svg viewBox="0 0 410 220" className="w-full">
      <defs>
        <filter id="pglow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="nodeglow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={color} opacity={0.7}/>
        </marker>
        {/* Dot grid background */}
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.8" fill={color} fillOpacity="0.06"/>
        </pattern>
      </defs>

      {/* Background */}
      <rect width="410" height="220" fill="url(#dots)" rx="8"/>

      {/* Edges */}
      {pipeEdges.map(([a, b], ei) => {
        const from = pipeNodes[a]; const to = pipeNodes[b];
        const isLit = active === ei;
        const x1 = from.x + from.w / 2; const y1 = from.y;
        const x2 = to.x - to.w / 2;    const y2 = to.y;
        const mx = (x1 + x2) / 2;
        return (
          <g key={ei}>
            <path d={`M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
              fill="none" stroke={color}
              strokeWidth={isLit ? 2 : 1}
              strokeOpacity={isLit ? 0.85 : 0.18}
              markerEnd="url(#arr2)"
              style={{ transition: "stroke-opacity 0.3s, stroke-width 0.25s" }}
            />
            {/* Edge label */}
            <text x={mx} y={(y1 + y2) / 2 - 5} textAnchor="middle"
              fill={color} fontSize={6.5} fontFamily="monospace"
              opacity={isLit ? 0.9 : 0.25}
              style={{ transition: "opacity 0.3s" }}>
              {edgeLabels[ei]}
            </text>
            {/* Animated particle */}
            {isLit && (
              <motion.circle key={`p-${particleKey}-${ei}`} r={4.5}
                fill={color} filter="url(#pglow2)"
                animate={{
                  offsetDistance: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                }}
                style={{ offsetPath: `path("M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}")` } as React.CSSProperties}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {pipeNodes.map((n, i) => {
        const isActive = pipeEdges[active]?.includes(i);
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.1, type: "spring", stiffness: 240 }}
          >
            {isActive && (
              <rect x={n.x - n.w / 2 - 3} y={n.y - 28} width={n.w + 6} height={56} rx={11}
                fill={color} fillOpacity={0.14} filter="url(#nodeglow)"/>
            )}
            <rect x={n.x - n.w / 2} y={n.y - 25} width={n.w} height={50} rx={9}
              fill="#0D0D14"
              stroke={color}
              strokeOpacity={isActive ? 0.9 : 0.3}
              strokeWidth={isActive ? 2 : 1}
              style={{ transition: "stroke-opacity 0.3s, stroke-width 0.25s" }}
            />
            <text x={n.x} y={n.y - 7} textAnchor="middle" fontSize={17}>{n.icon}</text>
            <text x={n.x} y={n.y + 10} textAnchor="middle" fill="#E2E8F0" fontSize={8} fontFamily="monospace" fontWeight="600">{n.label}</text>
            <text x={n.x} y={n.y + 20} textAnchor="middle" fill={color} fontSize={7} fontFamily="monospace" opacity={0.75}>{n.sub}</text>
          </motion.g>
        );
      })}
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

// ─── Bento grid spans ─────────────────────────────────────────────────────────
// Row 1: [0 wide=2col] [1 normal=1col]
// Row 2: [2 normal=1col] [3 wide=2col]
// Row 3: [4 full=3col]
const bentoSpan = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2", "md:col-span-3"];

function parseMetric(metric: string) {
  const parts = metric.match(/^([\d.]+[A-Za-z+%×]*)\s+(.+)$/) || metric.match(/^(.+?)\s+(.+)$/);
  return { value: parts ? parts[1] : metric, label: parts ? parts[2] : "" };
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({ project, index, onOpen }: {
  project: (typeof projects)[number]; index: number; onOpen: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { dictionary } = useLocale();
  const dictProject = (dictionary.projects.projects as Array<{ title: string; category: string; description: string }>)[index];
  const title = dictProject?.title || project.title;
  const category = dictProject?.category || project.category;
  const isFull = index === 4;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      className={`group relative rounded-2xl border overflow-hidden bg-surface/20 cursor-pointer
        hover:bg-surface/40 transition-all duration-300 flex flex-col
        ${isFull ? "md:flex-row" : ""}`}
      style={{ borderColor: `${project.color}20` }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}10 0%, transparent 70%)` }} />

      {/* Full-width card: left info panel */}
      {isFull && (
        <div className="md:w-64 lg:w-72 flex-shrink-0 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.06]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-muted">{String(index + 1).padStart(2, "0")}</span>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
            </div>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-mono tracking-wider mb-4"
              style={{ color: project.color, backgroundColor: `${project.color}14`, border: `1px solid ${project.color}28` }}>
              {category}
            </span>
            <h3 className="font-heading text-lg font-bold leading-snug mb-3">{title}</h3>
          </div>
          <div>
            {"metrics" in project && (
              <div className="space-y-2 mb-4">
                {(project.metrics as readonly string[]).map((m, j) => {
                  const { value, label } = parseMetric(m);
                  return (
                    <div key={j} className="flex items-baseline gap-2">
                      <span className="font-heading text-sm font-bold" style={{ color: project.color }}>{value}</span>
                      <span className="text-xs text-muted">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: project.color }}>
              {dictionary.projects.viewDetails as string}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Viz area */}
      <div className={`${isFull ? "flex-1" : "flex-1"} p-4 pb-2 flex flex-col`}>
        {!isFull && (
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-muted">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-mono"
                style={{ color: project.color, backgroundColor: `${project.color}14`, border: `1px solid ${project.color}28` }}>
                {category}
              </span>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
            </div>
          </div>
        )}

        {/* Viz container — uniform background, svg fills width */}
        <div className="rounded-xl overflow-hidden bg-background/50 border border-white/[0.05] flex-1 min-h-0 flex items-center justify-center p-2">
          <ProjectViz index={index} color={project.color} isInView={isInView} />
        </div>
      </div>

      {/* Bottom info (non-full cards) */}
      {!isFull && (
        <div className="px-4 pb-4 pt-2">
          <h3 className="font-heading text-sm font-bold leading-snug mb-2 group-hover:text-white transition-colors duration-200"
            style={{ color: "inherit" }}>
            {title}
          </h3>
          {"metrics" in project && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {(project.metrics as readonly string[]).map((m, j) => {
                const { value, label } = parseMetric(m);
                return (
                  <div key={j} className="flex items-baseline gap-1">
                    <span className="font-heading text-xs font-bold" style={{ color: project.color }}>{value}</span>
                    <span className="text-xs text-muted">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: project.color }}>
            {dictionary.projects.viewDetails as string}
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
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
        <div ref={headerRef} className="text-center mb-14">
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

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <div key={project.title} className={bentoSpan[i]}>
              <BentoCard
                project={project}
                index={i}
                onOpen={() => setSelected({ index: i, side: "right" })}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectDrawer index={selected?.index ?? null} side={selected?.side ?? "right"} onClose={() => setSelected(null)} />
    </section>
  );
}
