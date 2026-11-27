export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const OWNER_INFO = {
  name: "Ajithkumar E",
  role: "Software Developer",
  specialization: "Full-Stack Development & AI Systems",
  tagline: "Building production-grade web applications & AI agent workflows with React, Node.js, and modern LLM orchestration.",
  bio: "Full-stack developer with hands-on experience building scalable web applications using React.js, Node.js, Express.js, MySQL, and MongoDB. Specialized in developing production-ready AI solutions using LangChain, LangGraph, RAG, and the Google Gemini API, coupled with secure RESTful architectures, JWT authentication, and Role-Based Access Control (RBAC).",
  email: "ajithkumare101@gmail.com",
  phone: "+91 6380644382",
  phoneRaw: "+916380644382",
  location: "Pattambi, Kerala, India",
  linkedin: "https://www.linkedin.com/in/ajithkumar-e-27894028b",
  github: "https://github.com/ajithkumarf2",
  instagram: "https://www.instagram.com/ajithkumar_indhira/",
  resumeUrl: "/resume.pdf"
};

export const PROJECTS = [
  {
    id: "ai-task-manager",
    title: "AI Task Manager",
    subtitle: "AI-Powered Task Management Platform",
    description: "Built a production-ready task management platform with Google Gemini LLM and LangChain.js, enabling AI-driven task prioritization, workload summarization, and productivity recommendations via multi-agent LangGraph workflows. Implemented RAG with ChromaDB vector storage to query uploaded PDFs.",
    impact: "Automated task prioritization & workload summarization via multi-agent LangGraph workflows",
    techStack: ["React.js", "Node.js", "Express.js", "MySQL", "ChromaDB", "LangChain.js", "LangGraph", "Google Gemini API", "JWT", "Tailwind CSS"],
    highlights: [
      "Multi-agent LangGraph architecture for workload analysis",
      "RAG with ChromaDB vector storage and semantic PDF querying",
      "Normalized MySQL schema with modular MVC service layers"
    ],
    github: "https://github.com/ajithkumarf2",
    live: "https://ai-task-manager-demo.vercel.app",
    featured: true
  },
  {
    id: "grocery-ecommerce",
    title: "Full-Stack Grocery E-Commerce",
    subtitle: "High-Throughput Inventory & Order System",
    description: "Feature-rich e-commerce platform with product catalog, cart management, and order workflows for 500+ items. Implemented JWT authentication, RBAC, and an admin dashboard. Optimized frontend state management using React Context API.",
    impact: "Reduced unnecessary re-renders by ~25% through optimized Context API architecture",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Context API", "JWT", "RBAC"],
    highlights: [
      "Catalog and order management for 500+ grocery products",
      "~25% re-render reduction with custom state partitioning",
      "Comprehensive Admin dashboard with role-based access"
    ],
    github: "https://github.com/ajithkumarf2",
    live: "https://grocery-app-demo.vercel.app",
    featured: true
  },
  {
    id: "clueless-closet",
    title: "Clueless Closet",
    subtitle: "AI Fashion & Wardrobe Platform",
    description: "Full-stack wardrobe management app featuring an interactive outfit builder, JWT auth, and image upload pipeline. Integrated a mix-and-match engine and AI-driven outfit scheduling for personalized wardrobe recommendations.",
    impact: "Interactive visual mix-and-match canvas with AI outfit scheduling algorithms",
    techStack: ["React.js", "Node.js", "Express.js", "MySQL", "JWT", "Figma", "Tailwind CSS"],
    highlights: [
      "Visual outfit canvas and image processing pipeline",
      "Intelligent outfit recommendations based on occasion",
      "Strict data isolation with JWT token authentication"
    ],
    github: "https://github.com/ajithkumarf2",
    live: "https://clueless-closet-demo.vercel.app",
    featured: true
  },
  {
    id: "quick-ai",
    title: "Quick.ai",
    subtitle: "AI SaaS Article Platform (V-Net Internship)",
    description: "Built at V-Net Technology as a full-stack AI SaaS article platform using asynchronous Node.js and Express.js to support concurrent multi-user sessions. Integrated Clerk auth with RBAC and deployed with automated CI/CD pipelines.",
    impact: "Cut API response latency by ~20% through async Node.js stream optimization",
    techStack: ["Node.js", "Express.js", "React.js", "Clerk Auth", "RBAC", "Vercel", "CI/CD"],
    highlights: [
      "~20% latency reduction with async I/O handling",
      "Enterprise Clerk authentication with RBAC rules",
      "Automated Vercel production deployment pipeline"
    ],
    github: "https://github.com/ajithkumarf2",
    live: "https://quick-ai-demo.vercel.app",
    featured: false
  },
  {
    id: "library-management",
    title: "Library Management System",
    subtitle: "Catalog & Circulation Analytics (V-Net Internship)",
    description: "Engineered a modular backend system with JWT authentication, reusable React.js components, and an analytics dashboard. Developed book management APIs for 100+ catalog records with issue tracking and wishlist features.",
    impact: "Managed 100+ book inventory records with real-time circulation tracking",
    techStack: ["React.js", "Node.js", "Express.js", "JWT", "REST APIs", "Analytics Dashboard"],
    highlights: [
      "100+ book inventory management with issue tracking",
      "Real-time analytics dashboard on library circulation",
      "Modular RESTful micro-endpoints with JWT protection"
    ],
    github: "https://github.com/ajithkumarf2",
    live: "https://library-system-demo.vercel.app",
    featured: false
  }
];

export const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["JavaScript", "Python", "SQL", "C#"]
  },
  {
    category: "Frontend",
    skills: ["React.js", "Tailwind CSS", "HTML5", "CSS3", "Context API"]
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT", "MVC Architecture", "ASP.NET"]
  },
  {
    category: "Databases",
    skills: ["MySQL (Certified)", "MongoDB", "ChromaDB"]
  },
  {
    category: "AI & LLM Orchestration",
    skills: [
      "LangChain.js & Python LangChain",
      "LangGraph State Machines",
      "Retrieval-Augmented Generation (RAG)",
      "Vector Embeddings",
      "Semantic Search",
      "Prompt Engineering",
      "AI Agents",
      "Google Gemini API",
      "OpenAI API",
      "Claude API"
    ]
  },
  {
    category: "Tools & DevOps",
    skills: ["Git", "GitHub", "Postman", "Vercel", "CI/CD", "VS Code", "Agile / Scrum"]
  },
  {
    category: "Core Computer Science",
    skills: [
      "Object-Oriented Programming (OOP)",
      "Database Management Systems (DBMS)",
      "Operating Systems (OS)",
      "Computer Networks (CN)"
    ]
  }
];

export const EXPERIENCES = [
  {
    role: "Software Developer Intern",
    company: "V-Net Technology",
    location: "Coimbatore, India",
    period: "Jul 2024 – Aug 2024",
    type: "Internship",
    bullets: [
      "Built Quick.ai, a full-stack AI SaaS article platform, using async Node.js and Express.js to support concurrent multi-user sessions, cutting API latency by ~20%.",
      "Integrated Clerk authentication with role-based access control (RBAC) and deployed the app on Vercel with a CI/CD pipeline and production environment configuration.",
      "Built a Library Management System with a modular backend, JWT authentication, reusable React.js components, and an analytics dashboard; developed book management APIs for 100+ records, including issue tracking, wishlist, and recommendations."
    ]
  }
];

export const EDUCATION = [
  {
    degree: "B.E. in Computer Science and Engineering",
    institution: "PPG Institute of Technology, Saravanampatti, Coimbatore",
    period: "Aug 2021 – Jun 2025",
    grade: "CGPA: 6.7 / 10",
    coursework: "OOP, Operating Systems, DBMS, Computer Networks"
  },
  {
    degree: "Higher Secondary School",
    institution: "St. Antony’s Hr. Sec. School, Elathagiri, Krishnagiri",
    period: "Jun 2019 – Mar 2021",
    grade: "70%"
  },
  {
    degree: "SSLC",
    institution: "St. John’s High School, Kovilur, Dharmapuri",
    period: "Jun 2018 – Mar 2019",
    grade: "64%"
  }
];

export const CERTIFICATIONS = [
  {
    title: "MySQL Certification",
    issuer: "Learnz Development Hub",
    badge: "Relational Databases"
  },
  {
    title: "JavaScript Fundamentals",
    issuer: "Learnz Development Hub",
    badge: "Modern ES6+ & Async"
  },
  {
    title: "React Hooks",
    issuer: "Great Stack",
    badge: "State & Lifecycle Architecture"
  }
];
