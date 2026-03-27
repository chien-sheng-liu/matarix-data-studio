"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
  label?: string;
}

export function LineChart({
  data,
  color = "#6366F1",
  height = 100,
  label,
}: LineChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const width = 280;
  const padding = 8;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;

  // Area fill
  const areaD = `${pathD} L${width - padding},${height - padding} L${padding},${height - padding} Z`;

  const totalLength = data.length * 50;

  return (
    <div ref={ref} className="w-full">
      {label && (
        <p className="text-xs text-muted mb-2 font-mono">{label}</p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padding}
            x2={width - padding}
            y1={padding + frac * (height - padding * 2)}
            y2={padding + frac * (height - padding * 2)}
            stroke="#1E293B"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill={`url(#gradient-${label})`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ strokeDasharray: totalLength, strokeDashoffset: totalLength }}
          animate={
            isInView
              ? { strokeDashoffset: 0 }
              : { strokeDashoffset: totalLength }
          }
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Data points */}
        {data.map((v, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y =
            height - padding - ((v - min) / range) * (height - padding * 2);
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            />
          );
        })}

        <defs>
          <linearGradient
            id={`gradient-${label}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
