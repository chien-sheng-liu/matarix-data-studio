"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { services } from "@/config/site";

const iconPaths: Record<string, string> = {
  database:
    "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75",
  brain:
    "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
  chart:
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  strategy:
    "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  pipeline:
    "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  integration:
    "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z",
};

const accentColors = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <SectionWrapper id="services" className="bg-surface/30">
      <div ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4 text-center"
        >
          What We Do
        </motion.p>

        <TextReveal
          as="h2"
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-16 justify-center"
        >
          Our Services
        </TextReveal>

        {/* Interactive accordion-style list */}
        <div className="max-w-4xl mx-auto space-y-2">
          {services.map((service, i) => {
            const isActive = activeIndex === i;
            const color = accentColors[i % accentColors.length];

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className="group cursor-pointer border-b border-border/50"
              >
                <div className="flex items-center gap-6 py-6 px-4">
                  {/* Number */}
                  <span
                    className="font-mono text-sm transition-colors duration-300"
                    style={{ color: isActive ? color : "#64748B" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon with draw animation */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      rotate: isActive ? 5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-6 h-6 transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={isActive ? color : "#64748B"}
                      strokeWidth={1.5}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={iconPaths[service.icon]}
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{
                          duration: 1.5,
                          delay: 0.3 + i * 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="font-heading text-xl sm:text-2xl font-semibold flex-1 transition-colors duration-300"
                    style={{ color: isActive ? color : undefined }}
                  >
                    {service.title}
                  </h3>

                  {/* Expand arrow */}
                  <motion.svg
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5 text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-6 pl-[88px]">
                        <p className="text-muted leading-relaxed max-w-lg">
                          {service.description}
                        </p>
                        {/* Mini data visualization */}
                        <div className="mt-4 flex gap-1 items-end h-8">
                          {Array.from({ length: 12 }, (_, j) => (
                            <motion.div
                              key={j}
                              initial={{ height: 0 }}
                              animate={{
                                height: `${20 + Math.random() * 80}%`,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: j * 0.04,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="w-2 rounded-full"
                              style={{
                                backgroundColor: color,
                                opacity: 0.3 + Math.random() * 0.7,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
