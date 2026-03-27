"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { TextReveal } from "@/components/effects/text-reveal";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { useLocale } from "@/components/providers/locale-provider";
import { siteConfig } from "@/config/site";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const { dictionary } = useLocale();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <SectionWrapper id="contact">
      <div ref={ref}>
        {/* Big CTA heading */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-accent tracking-[0.2em] uppercase mb-4"
          >
            {dictionary.contact.label}
          </motion.p>

          <TextReveal
            as="h2"
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl justify-center mb-6"
          >
            {dictionary.contact.heading}
          </TextReveal>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted text-lg max-w-xl mx-auto"
          >
            {dictionary.contact.description}
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </motion.div>
              <h3 className="font-heading text-2xl font-semibold mb-2">
                {dictionary.contact.success.title}
              </h3>
              <p className="text-muted">
                {dictionary.contact.success.message}
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-xs text-muted mb-2 font-mono tracking-wider uppercase group-focus-within:text-accent transition-colors"
                  >
                    {dictionary.contact.form.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 text-foreground placeholder:text-muted/30 focus:border-primary focus:outline-none transition-colors text-lg"
                    placeholder={dictionary.contact.form.namePlaceholder}
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-xs text-muted mb-2 font-mono tracking-wider uppercase group-focus-within:text-accent transition-colors"
                  >
                    {dictionary.contact.form.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 text-foreground placeholder:text-muted/30 focus:border-primary focus:outline-none transition-colors text-lg"
                    placeholder={dictionary.contact.form.emailPlaceholder}
                  />
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-xs text-muted mb-2 font-mono tracking-wider uppercase group-focus-within:text-accent transition-colors"
                >
                  {dictionary.contact.form.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-transparent border-b-2 border-border px-0 py-3 text-foreground placeholder:text-muted/30 focus:border-primary focus:outline-none transition-colors resize-none text-lg"
                  placeholder={dictionary.contact.form.messagePlaceholder}
                />
              </div>

              <div className="pt-4 flex justify-center">
                <MagneticButton
                  type="submit"
                  className="rounded-full bg-primary px-12 py-4 text-sm font-medium text-white hover:bg-primary-light transition-colors duration-300"
                  strength={0.2}
                >
                  {dictionary.contact.form.submitButton}
                </MagneticButton>
              </div>
            </motion.form>
          )}

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 text-muted hover:text-foreground transition-colors font-mono text-sm"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {siteConfig.email}
            </a>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
