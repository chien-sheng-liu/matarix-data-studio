"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const isDecimal = value % 1 !== 0;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;

      setDisplay(isDecimal ? current.toFixed(1) : Math.floor(current).toString());

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCompleted(true);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      animate={
        completed
          ? { textShadow: ["0 0 0px transparent", "0 0 20px rgba(124, 58, 237, 0.6)", "0 0 0px transparent"] }
          : { textShadow: "0 0 0px transparent" }
      }
      transition={{ duration: 0.8 }}
    >
      <motion.span
        animate={completed ? { scale: [1, 1.15, 1] } : {}}
        transition={{ type: "tween", duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {display}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.5, y: -4 }}
        animate={completed ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.08 }}
      >
        {suffix}
      </motion.span>
    </motion.span>
  );
}
