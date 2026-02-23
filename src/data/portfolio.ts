import { Project, SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    name: "Programming",
    icon: "Monitor",
    skills: ["C", "Python", "Java"],
  },
  {
    id: "webdev",
    name: "Web Development",
    icon: "Server",
    skills: ["HTML", "CSS", "Node.js", "REST APIs"],
  },
  {
    id: "tools",
    name: "Databases & Tools",
    icon: "Cloud",
    skills: ["Git", "GitHub", "Postman", "SEO", "Selenium", "Manual Testing", "Automation Testing"],
  },
  {
    id: "embedded",
    name: "Embedded Systems",
    icon: "Cpu",
    skills: ["Microcontroller Architecture", "PCB Testing", "Circuit Design", "Arduino", "IoT Sensors", "Embedded C"],
  },
  {
    id: "softskills",
    name: "Soft Skills",
    icon: "Brain",
    skills: ["Problem Solving", "Communication", "Leadership", "Adaptability"],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "AI-Based Competitive Exam Mock Test Platform",
    description: "MVP for AI-powered mock tests with adaptive feedback and analytics dashboards",
    problem: "Students lack personalized feedback on competitive exam preparation, making it hard to identify weak areas efficiently.",
    solution: "Designed a platform with individual mock tests per topic (aptitude, reasoning, mathematics) and AI-based feedback that recommends re-tests and focus areas.",
    techDecisions: "Planned and designed the UI/UX flow for mock tests, results, and analysis dashboards. Structured topics with individual assessments for targeted practice.",
    challenges: "Building an intelligent recommendation engine that accurately identifies knowledge gaps and suggests focused study paths.",
    techStack: ["AI", "UI/UX", "Analytics", "Dashboard"],
    githubUrl: "#",
  },
  {
    id: "2",
    title: "AI-Powered Resume Builder & ATS Optimization",
    description: "Smart resume builder with AI scoring and ATS compatibility analysis",
    problem: "Job seekers struggle to create ATS-friendly resumes, leading to qualified candidates being filtered out by automated screening systems.",
    solution: "Built a complete resume builder workflow with templates, preview, edit, and export features. Integrated AI-driven resume scoring and content suggestions.",
    techDecisions: "Designed and integrated backend APIs for authentication, resume storage, ATS analysis, and AI tools. Chose a template-driven approach for flexibility.",
    challenges: "Implementing accurate ATS scoring that reflects real-world applicant tracking systems while providing actionable improvement suggestions.",
    techStack: ["Python", "REST APIs", "AI", "Node.js"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "3",
    title: "Smart Helmet for Coal Mine Workers",
    description: "IoT-enabled safety helmet — Awarded 3rd Prize at State-Level Project Expo 2025",
    problem: "Coal mine workers face life-threatening hazards from toxic gases, extreme temperatures, and lack of real-time emergency tracking.",
    solution: "Built an IoT-enabled helmet that monitors toxic gases, temperature, and humidity in real time with GPS/RF tracking for emergency response.",
    techDecisions: "Used Arduino with Embedded C for the microcontroller, integrated multiple IoT sensors for environmental monitoring, and GPS/RF modules for location tracking.",
    challenges: "Ensuring reliable sensor readings in harsh underground environments and maintaining low-latency data transmission for emergency alerts.",
    techStack: ["Arduino", "Embedded C", "IoT Sensors", "GPS", "RF"],
    githubUrl: "#",
  },
];

export const experiences = [
  {
    id: "1",
    role: "Embedded Systems Developer Intern",
    period: "Feb 2021 – Dec 2022",
    highlights: [
      "Optimized IoT device firmware, reducing power consumption by 20%",
      "Performed PCB testing and functional validation with 95% accuracy",
    ],
  },
  {
    id: "2",
    role: "Pre-fabricated Hardware Circuit Designer",
    period: "Jul 2022 – Jan 2023",
    highlights: [
      "Conducted functional and circuit testing for reliability and compliance",
      "Documented circuit workflows and collaborated with project teams",
    ],
  },
];

export const education = [
  {
    degree: "B.Tech, Electronics & Communication Engineering",
    institution: "P.B.R. Visvodaya Institute of Technology and Science (PBR VITS), Kavali",
    university: "JNTUA",
    period: "2023 – Present",
  },
  {
    degree: "Diploma in Electronics & Communication Engineering",
    institution: "Government Polytechnic College, Kalyandurgam",
    period: "2020 – 2023",
  },
];

export const suggestedPrompts = [
  "What are your key technical skills?",
  "Tell me about your IoT projects.",
  "What problems have you solved?",
  "What is your educational background?",
];
