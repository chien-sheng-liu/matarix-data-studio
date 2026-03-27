"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 140 }: BarChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const max = Math.max(...data.map((d) => d.value));
  const barWidth = 32;
  const gap = 16;
  const width = data.length * (barWidth + gap) - gap + 40;

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="w-full min-w-[260px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base line */}
        <line
          x1="20"
          x2={width - 20}
          y1={height}
          y2={height}
          stroke="#1E293B"
          strokeWidth="1"
        />

        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 20);
          const x = 20 + i * (barWidth + gap);
          const y = height - barHeight;
          const color = d.color || "#6366F1";

          return (
            <g key={d.label}>
              <motion.rect
                x={x}
                y={height}
                width={barWidth}
                rx="4"
                fill={color}
                initial={{ height: 0, y: height }}
                animate={
                  isInView
                    ? { height: barHeight, y }
                    : { height: 0, y: height }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              {/* Value label */}
              <motion.text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
              >
                {d.value}
              </motion.text>
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height + 16}
                textAnchor="middle"
                fill="#64748B"
                fontSize="8"
                fontFamily="monospace"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
