import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { ProjectsSection } from "@/components/sections/projects";
import { ProcessSection } from "@/components/sections/process";
import { TeamSection } from "@/components/sections/team";
import { ContactSection } from "@/components/sections/contact";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ProcessSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
