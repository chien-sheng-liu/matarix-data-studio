export const siteConfig = {
  name: "Mentarix Data Studio",
  description:
    "We transform complex data into actionable intelligence. Big Data architecture, AI/ML solutions, and data-driven strategies for forward-thinking enterprises.",
  tagline: "Turning Data into Decisions",
  subtitle: "大數據分析 · AI 解決方案 · 數據驅動策略",
  url: "https://mentarix.studio",
  email: "contact@mentarix.studio",
  linkedin: "https://www.linkedin.com/in/chienshengliu/",
  calendar: "https://calendar.app.google/MANJXP2ZZiaWF5T26",
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Team", href: "#team" },
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
    title: "Stock Multi-Agent Financial Analyzer",
    category: "LLM",
    description:
      "Financial analysis platform combining an LLM Gateway with Playwright browser automation. Multi-agent collaboration across news, finance, trader, and data agents with Safety Guard and full artifact traceability.",
    color: "#6366F1",
    technologies: ["FastAPI", "Playwright", "React", "OpenAI", "Claude", "Docker", "Python"],
    metrics: ["4 Agents", "5 Safety Layers", "3+ LLM Providers"],
  },
  {
    title: "Maritime High-Risk & Anomaly Prediction",
    category: "Deep Learning",
    description:
      "Integrated national weather, vessel static data, and real-time AIS streams into ClickHouse and deep learning to predict grounding and anomalous behaviors and help prevent maritime incidents.",
    color: "#06B6D4",
    technologies: ["Deep Learning", "ClickHouse", "Streaming SQL", "AIS", "Python"],
    metrics: ["15+ Sources", "20TB+ Data", "On-prem Deploy"],
  },
  {
    title: "Disrupted Time-Series Forecasting",
    category: "Deep Learning",
    description:
      "Compared SARIMA, Holt-Winters, and Prophet under COVID-19 disruptions. Designed three experimental groups to quantify the impact of external shocks on time-series forecasting accuracy.",
    color: "#8B5CF6",
    technologies: ["Python", "SARIMA", "Prophet", "Holt-Winters", "pandas", "statsmodels"],
    metrics: ["3 Models", "3 Experiments", "Uni Mannheim"],
  },
  {
    title: "Slot Game Engine & Probability Optimizer",
    category: "Algorithm",
    description:
      "3×3 slot game engine combining Monte Carlo simulation with heuristic search to auto-optimize reel configurations under RTP 95% and win rate ≥55% constraints. Full-stack with FastAPI backend and React frontend.",
    color: "#F59E0B",
    technologies: ["Python", "FastAPI", "React", "Monte Carlo", "NumPy", "Vite"],
    metrics: ["95% Target RTP", "100K Simulations", "5 Win Patterns"],
  },
  {
    title: "AutoLLM — No-Code RAG Chatbot Platform",
    category: "LLM",
    description:
      "Production-grade RAG platform with document upload, vector retrieval, multi-LLM switching, dual-layer Redis + PostgreSQL storage, and Docker microservice deployment.",
    color: "#EC4899",
    technologies: ["FastAPI", "Next.js", "PostgreSQL", "pgvector", "Redis", "Docker", "OpenAI"],
    metrics: ["3+ LLM Providers", "15+ API Endpoints", "Docker Deploy"],
  },
] as const;

export const teamMembers = [
  {
    name: "Morris Liu",
    nameCn: "劉建聖",
    role: "Founder & AI Strategist",
    color: "#6366F1",
    photo: "https://chien-sheng-liu.github.io/profile.png",
    expertise: ["AI Strategy", "Data Science", "NLP & LLM", "BI & Analytics"],
    social: {
      github: "https://github.com/chien-sheng-liu",
      linkedin: "https://www.linkedin.com/in/chienshengliu/",
      email: "liu_chiensheng@outlook.com",
    },
  },
  {
    name: "Alex Lin",
    nameCn: "林力宇",
    role: "Senior Data Engineer",
    color: "#06B6D4",
    photo: "https://alexstartw.github.io/personal-website/avatar.jpg",
    expertise: ["Data Engineering", "GenAI / RAG", "Event-Driven Arch", "Cloud Infra"],
    social: {
      github: "https://github.com/alexstartw",
      linkedin: "https://www.linkedin.com/in/liyu-lin-alex",
      email: "alexstartw@gmail.com",
    },
  },
] as const;

export const processSteps = [
  { step: "01", title: "Consulting", description: "Initial consultation to understand your business context, data maturity, and strategic objectives." },
  { step: "02", title: "Requirements Interview", description: "In-depth stakeholder interviews to capture detailed functional and technical requirements." },
  { step: "03", title: "Requirements Specification", description: "Formalize requirements into a comprehensive specification document with acceptance criteria and project scope." },
  { step: "04", title: "Implementation", description: "Agile development with iterative delivery, continuous testing, and regular progress reviews." },
  { step: "05", title: "Final Analysis Report", description: "Comprehensive project closure report with performance metrics, insights, and recommendations for future optimization." },
] as const;

export const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Clients Handled" },
  { value: 10, suffix: "PB+", label: "Data Processed" },
  { value: 10, suffix: "+", label: "Industries Covered" },
] as const;
