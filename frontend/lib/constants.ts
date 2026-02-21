export const ALL_SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "C++", "Java", "SQL",
  "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "Linux", "TensorFlow",
  "PyTorch", "scikit-learn", "Pandas", "TypeScript", "Flutter", "Firebase",
  "GraphQL", "Redis", "Figma", "MATLAB", "R", "Tableau", "Django",
  "FastAPI", "Vue", "Next.js"
] as const

export const DOMAINS = [
  { id: "AI/ML", label: "AI / ML", description: "Machine Learning, Deep Learning, NLP" },
  { id: "Web Development", label: "Web Dev", description: "Frontend, Backend, Full-stack" },
  { id: "Data Science", label: "Data Science", description: "Analytics, Visualization, Statistics" },
  { id: "Cloud/DevOps", label: "Cloud / DevOps", description: "AWS, Docker, CI/CD" },
  { id: "Cybersecurity", label: "Cybersecurity", description: "Security, Networking, Ethical Hacking" },
  { id: "Core Engineering", label: "Core Eng.", description: "Embedded, VLSI, Systems" },
] as const

export const DOMAIN_SKILLS: Record<string, string[]> = {
  "AI/ML": ["Python", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Keras", "OpenCV"],
  "Web Development": ["JavaScript", "React", "Node.js", "HTML", "CSS", "TypeScript", "Vue", "Next.js"],
  "Data Science": ["Python", "R", "SQL", "Pandas", "Tableau", "Power BI", "Statistics"],
  "Cloud/DevOps": ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "CI/CD", "Azure"],
  "Cybersecurity": ["Networking", "Linux", "Python", "Ethical Hacking", "Wireshark", "Cryptography"],
  "Core Engineering": ["C", "C++", "Embedded Systems", "MATLAB", "VLSI", "Microcontrollers"],
}

export const ROLE_SUGGESTIONS = [
  "ML Engineer", "Data Scientist", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Cloud Architect", "Cybersecurity Analyst",
  "Embedded Systems Engineer", "AI Researcher", "Mobile Developer", "Data Analyst",
  "Software Engineer", "Product Manager", "UX Designer",
]
