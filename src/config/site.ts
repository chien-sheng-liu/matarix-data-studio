export const siteConfig = {
  name: "Mentarix Data Studio",
  description:
    "We transform complex data into actionable intelligence. Big Data architecture, AI/ML solutions, and data-driven strategies for forward-thinking enterprises.",
  tagline: "Turning Data into Decisions",
  subtitle: "大數據分析 · AI 解決方案 · 數據驅動策略",
  url: "https://mentarix.studio",
  email: "hello@mentarix.studio",
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const services = [
  {
    title: "Big Data Architecture",
    description:
      "Design and implement scalable data infrastructure that handles petabyte-scale workloads with real-time processing capabilities.",
    icon: "database",
  },
  {
    title: "AI / ML Development",
    description:
      "Build custom machine learning models and AI systems tailored to your business challenges, from NLP to computer vision.",
    icon: "brain",
  },
  {
    title: "Data Visualization",
    description:
      "Transform raw data into intuitive, interactive dashboards that enable faster and smarter decision-making.",
    icon: "chart",
  },
  {
    title: "Data Strategy Consulting",
    description:
      "Develop comprehensive data strategies aligned with your business goals, from governance to monetization.",
    icon: "strategy",
  },
  {
    title: "Automated Data Pipelines",
    description:
      "Engineer robust ETL/ELT pipelines that automate data collection, transformation, and delivery across your organization.",
    icon: "pipeline",
  },
  {
    title: "AI Integration Solutions",
    description:
      "Seamlessly integrate AI capabilities into your existing systems, from chatbots to predictive analytics engines.",
    icon: "integration",
  },
] as const;

export const projects = [
  {
    title: "Predictive Analytics Platform",
    category: "AI / Machine Learning",
    description:
      "Built a real-time predictive analytics engine processing 2M+ events/day for a fintech company, reducing risk assessment time by 73%.",
    color: "#6366F1",
  },
  {
    title: "Smart City Data Hub",
    category: "Big Data Architecture",
    description:
      "Designed a citywide IoT data platform integrating 50K+ sensors, enabling real-time traffic optimization and energy management.",
    color: "#06B6D4",
  },
  {
    title: "E-Commerce Intelligence Suite",
    category: "Data Visualization",
    description:
      "Created an interactive analytics dashboard that increased conversion rates by 34% through real-time customer behavior insights.",
    color: "#8B5CF6",
  },
  {
    title: "Healthcare NLP System",
    category: "AI Integration",
    description:
      "Developed a medical document analysis system using NLP, automating 85% of clinical data extraction for a hospital network.",
    color: "#10B981",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "Deep dive into your data landscape, business goals, and technical requirements.",
  },
  {
    step: "02",
    title: "Analysis",
    description:
      "Assess data quality, identify patterns, and design the optimal architecture.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Engineer robust solutions with iterative development and continuous validation.",
  },
  {
    step: "04",
    title: "Deploy",
    description:
      "Launch with comprehensive testing, monitoring, and performance optimization.",
  },
  {
    step: "05",
    title: "Iterate",
    description:
      "Continuously improve models and systems based on real-world performance data.",
  },
] as const;

export const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 10, suffix: "PB+", label: "Data Processed" },
  { value: 99.9, suffix: "%", label: "System Uptime" },
  { value: 30, suffix: "+", label: "Enterprise Clients" },
] as const;
