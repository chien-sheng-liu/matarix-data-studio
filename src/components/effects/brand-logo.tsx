"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Each letter lives somewhere on the viewport as an art installation,
  then choreographs its way into the final MENTARIX formation.

  Phase 0  "scattered"  — letters are giant, rotated, positioned across the full screen
  Phase 1  "drift"      — they start drifting, rotating, breathing
  Phase 2  "converge"   — they fly/morph into final position
  Phase 3  "settled"    — final lockup, shimmer, subtitle appears
*/

interface LetterConfig {
  char: string;
  // Scattered position (relative to center, in vw/vh-ish units)
  scattered: {
    x: string;
    y: string;
    scale: number;
    rotate: number;
    opacity: number;
    blur: number;
  };
  // Mid-flight artistic state
  drift: {
    x: string;
    y: string;
    scale: number;
    rotate: number;
  };
  // Color accent for this letter's trail/glow
  color: string;
  // Delay offset within each phase (seconds)
  stagger: number;
  // Unique motion style
  motionStyle: "float" | "fall" | "spiral" | "strike" | "bloom" | "shatter" | "beam" | "slash";
}

const letters: LetterConfig[] = [
  {
    char: "M",
    scattered: { x: "-38vw", y: "-30vh", scale: 3.5, rotate: -15, opacity: 0.15, blur: 8 },
    drift: { x: "-25vw", y: "-18vh", scale: 2.2, rotate: -8 },
    color: "#6366F1",
    stagger: 0,
    motionStyle: "float",
  },
  {
    char: "E",
    scattered: { x: "35vw", y: "25vh", scale: 2.8, rotate: 90, opacity: 0.12, blur: 12 },
    drift: { x: "20vw", y: "12vh", scale: 1.8, rotate: 45 },
    color: "#818CF8",
    stagger: 0.15,
    motionStyle: "spiral",
  },
  {
    char: "N",
    scattered: { x: "-30vw", y: "35vh", scale: 4, rotate: 180, opacity: 0.1, blur: 15 },
    drift: { x: "-15vw", y: "20vh", scale: 2.5, rotate: 120 },
    color: "#06B6D4",
    stagger: 0.3,
    motionStyle: "bloom",
  },
  {
    char: "T",
    scattered: { x: "5vw", y: "-42vh", scale: 5, rotate: 0, opacity: 0.08, blur: 6 },
    drift: { x: "3vw", y: "-28vh", scale: 3, rotate: -5 },
    color: "#8B5CF6",
    stagger: 0.1,
    motionStyle: "fall",
  },
  {
    char: "A",
    scattered: { x: "40vw", y: "-20vh", scale: 2.5, rotate: -45, opacity: 0.14, blur: 10 },
    drift: { x: "28vw", y: "-10vh", scale: 1.6, rotate: -20 },
    color: "#6366F1",
    stagger: 0.25,
    motionStyle: "strike",
  },
  {
    char: "R",
    scattered: { x: "-42vw", y: "5vh", scale: 3.2, rotate: 30, opacity: 0.11, blur: 14 },
    drift: { x: "-28vw", y: "3vh", scale: 2, rotate: 15 },
    color: "#06B6D4",
    stagger: 0.2,
    motionStyle: "shatter",
  },
  {
    char: "I",
    scattered: { x: "0vw", y: "40vh", scale: 6, rotate: 0, opacity: 0.06, blur: 4 },
    drift: { x: "0vw", y: "25vh", scale: 3.5, rotate: 0 },
    color: "#22D3EE",
    stagger: 0.35,
    motionStyle: "beam",
  },
  {
    char: "X",
    scattered: { x: "32vw", y: "-35vh", scale: 3, rotate: -90, opacity: 0.13, blur: 8 },
    drift: { x: "18vw", y: "-20vh", scale: 2, rotate: -45 },
    color: "#8B5CF6",
    stagger: 0.05,
    motionStyle: "slash",
  },
];

function ArtLetter({
  config,
  phase,
  finalIndex,
  totalLetters,
}: {
  config: LetterConfig;
  phase: number;
  finalIndex: number;
  totalLetters: number;
}) {
  // Calculate final x position: centered, letter-spaced
  // Each letter slot is ~1 character wide at final size, centered
  const totalWidth = totalLetters * 1; // in "em" units
  const offsetEm = finalIndex - (totalLetters - 1) / 2;

  // Phase-dependent animation
  const getAnimationState = () => {
    if (phase === 0) {
      return {
        x: config.scattered.x,
        y: config.scattered.y,
        scale: config.scattered.scale,
        rotate: config.scattered.rotate,
        opacity: config.scattered.opacity,
        filter: `blur(${config.scattered.blur}px)`,
      };
    }
    if (phase === 1) {
      return {
        x: config.drift.x,
        y: config.drift.y,
        scale: config.drift.scale,
        rotate: config.drift.rotate,
        opacity: 0.35,
        filter: "blur(3px)",
      };
    }
    if (phase >= 2) {
      return {
        x: `${offsetEm * 0.85}em`,
        y: "0px",
        scale: 1,
        rotate: 0,
        opacity: 1,
        filter: "blur(0px)",
      };
    }
    return {};
  };

  // Unique transition per motionStyle
  const getTransition = () => {
    const base = { delay: config.stagger };
    switch (config.motionStyle) {
      case "float":
        return { ...base, duration: 1.8, ease: [0.22, 0.68, 0.36, 1] as const };
      case "fall":
        return { ...base, type: "spring" as const, stiffness: 50, damping: 12, mass: 2 };
      case "spiral":
        return { ...base, duration: 2.0, ease: [0.16, 1, 0.3, 1] as const };
      case "strike":
        return { ...base, duration: 1.2, ease: [0.87, 0, 0.13, 1] as const };
      case "bloom":
        return { ...base, type: "spring" as const, stiffness: 80, damping: 15 };
      case "shatter":
        return { ...base, duration: 1.6, ease: [0.34, 1.56, 0.64, 1] as const };
      case "beam":
        return { ...base, duration: 1.4, ease: [0.16, 1, 0.3, 1] as const };
      case "slash":
        return { ...base, duration: 1.0, ease: [0.87, 0, 0.13, 1] as const };
      default:
        return { ...base, duration: 1.5 };
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        fontSize: "inherit",
        lineHeight: 1,
        top: "50%",
        left: "50%",
        marginTop: "-0.5em",
        marginLeft: "-0.5em",
        width: "1em",
        height: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      animate={getAnimationState()}
      transition={getTransition()}
    >
      {/* Glow aura — visible during scattered/drift phases */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, ${config.color}30 0%, transparent 70%)`,
        }}
        animate={{
          scale: phase < 2 ? [1, 1.3, 1] : 0,
          opacity: phase < 2 ? [0.4, 0.7, 0.4] : 0,
        }}
        transition={{
          duration: 3 + config.stagger * 2,
          repeat: phase < 2 ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Trail/afterimage — during convergence */}
      {phase === 2 && (
        <>
          <motion.span
            className="absolute font-heading font-bold"
            style={{ color: config.color, fontSize: "1em", opacity: 0.15, filter: "blur(8px)" }}
            initial={{ scale: config.drift.scale, rotate: config.drift.rotate }}
            animate={{ scale: 1, rotate: 0, opacity: 0 }}
            transition={{ duration: 2, delay: config.stagger }}
          >
            {config.char}
          </motion.span>
          <motion.span
            className="absolute font-heading font-bold"
            style={{ color: config.color, fontSize: "1em", opacity: 0.08, filter: "blur(16px)" }}
            initial={{ scale: config.drift.scale * 1.3 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 2.5, delay: config.stagger + 0.1 }}
          >
            {config.char}
          </motion.span>
        </>
      )}

      {/* The letter */}
      <span
        className="relative font-heading font-bold z-10"
        style={
          phase >= 2
            ? {
                background: `linear-gradient(170deg, #ffffff 0%, ${config.color} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
            : {
                color: config.color,
                transition: "color 1s ease",
                textShadow: `0 0 40px ${config.color}40`,
              }
        }
      >
        {config.char}
      </span>
    </motion.div>
  );
}

// ─── Ambient floating geometric shapes (background art) ─────────────
function AmbientShapes({ visible }: { visible: boolean }) {
  const shapes = [
    { x: "15%", y: "20%", size: 60, rotate: 45, color: "#6366F1", type: "rect" },
    { x: "80%", y: "30%", size: 40, rotate: -30, color: "#06B6D4", type: "circle" },
    { x: "25%", y: "75%", size: 80, rotate: 15, color: "#8B5CF6", type: "rect" },
    { x: "70%", y: "70%", size: 30, rotate: 60, color: "#22D3EE", type: "circle" },
    { x: "50%", y: "15%", size: 50, rotate: -15, color: "#6366F1", type: "line" },
    { x: "10%", y: "50%", size: 35, rotate: 90, color: "#8B5CF6", type: "circle" },
    { x: "90%", y: "55%", size: 45, rotate: -60, color: "#06B6D4", type: "line" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: s.x, top: s.y }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={
            visible
              ? {
                  opacity: [0, 0.06, 0.04],
                  scale: [0, 1, 0.8],
                  rotate: [0, s.rotate, s.rotate + 10],
                }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 4,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        >
          {s.type === "rect" && (
            <div
              className="border"
              style={{
                width: s.size,
                height: s.size,
                borderColor: `${s.color}25`,
              }}
            />
          )}
          {s.type === "circle" && (
            <div
              className="rounded-full border"
              style={{
                width: s.size,
                height: s.size,
                borderColor: `${s.color}20`,
              }}
            />
          )}
          {s.type === "line" && (
            <div
              style={{
                width: s.size,
                height: 1,
                background: `${s.color}20`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Convergence particle burst ──────────────────────────────────────
function ConvergenceBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const distance = 80 + Math.random() * 120;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: i % 3 === 0 ? "#6366F1" : i % 3 === 1 ? "#06B6D4" : "#8B5CF6" }}
            initial={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0.8,
              scale: 1,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.2,
              delay: Math.random() * 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main BrandLogo ──────────────────────────────────────────────────
export function BrandLogo() {
  const [phase, setPhase] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    // Cinematic timing
    const timers = [
      setTimeout(() => setPhase(0), 300),    // Scattered — appear
      setTimeout(() => setPhase(1), 1800),    // Drift — start moving
      setTimeout(() => setPhase(2), 3500),    // Converge — fly to position
      setTimeout(() => setPhase(3), 5500),    // Settled — final state
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full" style={{ height: "40vh", minHeight: 300 }}>
      {/* Ambient geometric shapes */}
      <AmbientShapes visible={phase >= 0 && phase < 3} />

      {/* Convergence particle burst */}
      <ConvergenceBurst active={phase === 2} />

      {/* Letters container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
      >
        {letters.map((config, i) => (
          <ArtLetter
            key={config.char}
            config={config}
            phase={phase}
            finalIndex={i}
            totalLetters={letters.length}
          />
        ))}
      </div>

      {/* Shimmer sweep after settled */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute"
              style={{
                width: "100%",
                height: "1.2em",
                fontSize: "clamp(2.5rem, 10vw, 8rem)",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.28) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                backgroundRepeat: "no-repeat",
              }}
              animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover interactions after settled */}
      {phase >= 3 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
        >
          <div className="flex">
            {letters.map((config, i) => (
              <motion.div
                key={`hover-${config.char}`}
                className="relative cursor-default"
                style={{ width: "0.85em", textAlign: "center" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={
                  hovered === i
                    ? { y: -12, scale: 1.08 }
                    : { y: 0, scale: 1 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="font-heading font-bold invisible">
                  {config.char}
                </span>

                {/* Hover glow */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      className="absolute inset-0 -inset-x-2 -inset-y-2 rounded-lg pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* DATA STUDIO subtitle */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 text-center"
        initial={{ opacity: 0, letterSpacing: "1.5em" }}
        animate={
          phase >= 3
            ? { opacity: 1, letterSpacing: "0.35em" }
            : {}
        }
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-sm sm:text-base text-muted tracking-[0.35em] uppercase">
          Data Studio
        </span>

        {/* Decorative flow line */}
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <svg
            width="200"
            height="20"
            viewBox="0 0 200 20"
            className="overflow-visible"
          >
            <motion.path
              d="M0 10 Q50 2 100 10 Q150 18 200 10"
              fill="none"
              stroke="url(#flowGrad)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={phase >= 3 ? { pathLength: 1 } : {}}
              transition={{
                duration: 1.5,
                delay: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
            {phase >= 3 &&
              [0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  r="1.5"
                  fill={
                    i === 0
                      ? "#6366F1"
                      : i === 1
                        ? "#06B6D4"
                        : "#8B5CF6"
                  }
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    offsetDistance: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    delay: 1.5 + i * 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath:
                      'path("M0 10 Q50 2 100 10 Q150 18 200 10")',
                  }}
                />
              ))}
            <defs>
              <linearGradient
                id="flowGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
                <stop offset="30%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
