"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { teamMembers } from "@/config/site";

// Orbiting ring around photo
function OrbitRing({ color, size, isInView }: { color: string; size: number; isInView: boolean }) {
  const r = size / 2 - 3;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeOpacity={0.08} strokeWidth={2} />
      {/* Animated arc */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ, rotate: 0 }}
        animate={isInView ? { strokeDashoffset: circ * 0.6 } : {}}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Orbiting dot */}
      {isInView && (
        <motion.circle r={3} fill={color}
          animate={{
            cx: [size / 2 + r, size / 2, size / 2 - r, size / 2, size / 2 + r],
            cy: [size / 2, size / 2 - r, size / 2, size / 2 + r, size / 2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      )}
    </svg>
  );
}

// Particle stream between cards (desktop only)
function ConnectionStream({ isInView }: { isInView: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isInView) return null;

  return (
    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px">
      {[0, 1, 2, 3].map(j => (
        <motion.div
          key={j}
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: "linear-gradient(90deg, #6366F1, #06B6D4)" }}
          animate={{
            left: ["-10%", "110%"],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: j * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Reverse particles */}
      {[0, 1].map(j => (
        <motion.div
          key={`r-${j}`}
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: "linear-gradient(90deg, #06B6D4, #6366F1)" }}
          animate={{
            left: ["110%", "-10%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 0.3 + j * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Social icon button
function SocialLink({ href, icon, color, delay }: {
  href: string; icon: "github" | "linkedin" | "email"; color: string; delay: number;
}) {
  const paths: Record<string, string> = {
    github: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z",
    linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
    email: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  };
  return (
    <motion.a
      href={icon === "email" ? `mailto:${href}` : href}
      target={icon === "email" ? undefined : "_blank"}
      rel={icon === "email" ? undefined : "noopener noreferrer"}
      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ borderColor: `${color}30` }}
      whileHover={{ backgroundColor: `${color}15`, borderColor: `${color}60` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <svg className="w-4 h-4" fill={icon === "github" ? color : "none"} viewBox="0 0 24 24"
        stroke={icon === "github" ? "none" : color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[icon]} />
      </svg>
    </motion.a>
  );
}

// Member card
function MemberCard({ member, index, isInView, dictRole }: {
  member: (typeof teamMembers)[number];
  index: number;
  isInView: boolean;
  dictRole: { role: string; bio: string };
}) {
  const [hovered, setHovered] = useState(false);
  const fromLeft = index === 0;
  const photoSize = 140;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl border p-8 transition-all duration-300 overflow-hidden"
      style={{
        borderColor: hovered ? `${member.color}40` : "rgba(255,255,255,0.06)",
        backgroundColor: hovered ? `${member.color}06` : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Accent top line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${member.color}, transparent)` }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 + index * 0.15 }}
      />

      {/* Background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 20%, ${member.color}0A 0%, transparent 60%)` }} />

      {/* Photo with orbit ring */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: photoSize, height: photoSize }}>
          <OrbitRing color={member.color} size={photoSize} isInView={isInView} />
          <motion.div
            className="absolute inset-3 rounded-full overflow-hidden border-2"
            style={{ borderColor: `${member.color}30` }}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 + index * 0.15 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-1">
        <h3 className="font-heading text-xl font-bold">
          {member.name}
        </h3>
        <span className="text-sm text-muted font-mono">{member.nameCn}</span>
      </div>

      {/* Role */}
      <p className="text-center text-sm font-medium mb-4" style={{ color: member.color }}>
        {dictRole.role}
      </p>

      {/* Bio */}
      <p className="text-xs text-muted leading-relaxed text-center mb-5">
        {dictRole.bio}
      </p>

      {/* Expertise tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {member.expertise.map((skill, j) => (
          <motion.span
            key={skill}
            className="text-xs px-2.5 py-1 rounded-full font-mono border"
            style={{
              color: `${member.color}CC`,
              borderColor: `${member.color}25`,
              backgroundColor: `${member.color}08`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 + index * 0.15 + j * 0.08 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-3">
        <SocialLink href={member.social.github} icon="github" color={member.color} delay={1 + index * 0.15} />
        <SocialLink href={member.social.linkedin} icon="linkedin" color={member.color} delay={1.1 + index * 0.15} />
        <SocialLink href={member.social.email} icon="email" color={member.color} delay={1.2 + index * 0.15} />
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { dictionary } = useLocale();

  const teamDict = (dictionary as unknown as Record<string, Record<string, unknown>>).team;
  const roles = (teamDict?.roles ?? []) as Array<{ role: string; bio: string }>;
  const label = (teamDict?.label ?? "Core Team") as string;
  const heading = (teamDict?.heading ?? "Meet the Team") as string;

  return (
    <SectionWrapper id="team">
      <div ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
          >
            {label}
          </motion.p>

          <TextReveal
            as="h2"
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl justify-center"
          >
            {heading}
          </TextReveal>
        </div>

        {/* Cards */}
        <div className="relative max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConnectionStream isInView={isInView} />
          {teamMembers.map((member, i) => (
            <MemberCard
              key={member.name}
              member={member}
              index={i}
              isInView={isInView}
              dictRole={roles[i] ?? { role: member.role, bio: "" }}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
