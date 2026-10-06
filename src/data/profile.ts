// All hand-written portfolio content lives here (sourced from the resume).
// GitHub stats and Medium articles are fetched live; see src/lib.
//
// Keep this file free of runtime imports: scripts/update-fallbacks.mts loads it
// directly with Node.

export type Social = {
  label: string;
  href: string;
  handle: string;
};

export type Experience = {
  company: string;
  role: string;
  focus?: string;
  period: string;
  mode: "Remote" | "Onsite" | "Hybrid";
  current?: boolean;
  points: string[];
  stack: string[];
};

export type FeaturedProject = {
  repo: string; // GitHub repository name, used to merge live stats
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  pipeline: string[]; // stages drawn in the animated agent graph
  demo?: string; // overrides the repo's homepage field
  accent: string;
  fromResume?: boolean;
};

export const profile = {
  name: "Padala Venkata Sai Varun Kumar",
  shortName: "Varun Padala",
  firstName: "Varun",
  lastName: "Padala",
  initials: "VP",
  role: "Agentic AI Engineer",
  roles: [
    "Agentic AI Engineer",
    "Multi-Agent Systems Builder",
    "RAG & Knowledge Graph Engineer",
    "Full-Stack Developer",
    "Event-Driven Systems Engineer",
  ],
  tagline: "I build autonomous AI agents that think, plan, and act.",
  intro:
    "Building autonomous AI agents that think, plan, and act — that's the obsession. I specialize in Agentic AI, LangGraph, RAG, and Knowledge Graphs, architecting multi-agent systems that connect codebases, tools, and data into self-learning, reasoning-capable pipelines.",
  about: [
    "I'm an AI engineer and a B.Tech student in Artificial Intelligence at Vignan's Institute of Information Technology. Right now I'm an Associate Consultant Intern at Utrecht IT Consulting, building an AI-native project-management platform on LangGraph, Neo4j, and Solace event streams.",
    "Before that I shipped a MERN e-commerce platform with an LLM shopping assistant at ZenithYuga Tech, and an LLM-powered nutrition analysis system at Cloud Eye Technologies. Outside work I lead tech at GDG VIIT, organize hackathons, and write about agents, memory, and event-driven systems on Medium.",
  ],
  location: "India",
  availability: "Open to full-time AI / software engineering roles",
  email: "varunpadala137@gmail.com",
  resume: "/resume.pdf",
  // Optional: drop a square photo in /public and set e.g. "/profile.jpg".
  photo: null as string | null,
  githubUser: "Padala-Varun",
  mediumUser: "varun2004varun2004",
};

export const socials = {
  github: {
    label: "GitHub",
    href: "https://github.com/Padala-Varun",
    handle: "Padala-Varun",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/padala-venkata-sai-varun-kumar-37b844291/",
    handle: "padala-venkata-sai-varun-kumar",
  },
  medium: {
    label: "Medium",
    href: "https://medium.com/@varun2004varun2004",
    handle: "@varun2004varun2004",
  },
  leetcode: {
    label: "LeetCode",
    href: "https://leetcode.com/u/varun2004varun2004/",
    handle: "varun2004varun2004",
  },
  codechef: {
    label: "CodeChef",
    href: "https://www.codechef.com/users/padala_varun",
    handle: "padala_varun",
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/dayzerodev._",
    handle: "dayzerodev._",
  },
} satisfies Record<string, Social>;

export type SocialKey = keyof typeof socials;

export const stats = [
  { value: 3, suffix: "", label: "AI & full-stack internships" },
  { value: 8.65, decimals: 2, suffix: "", label: "CGPA in B.Tech AI" },
  { value: 3, suffix: "×", label: "Hackathon winner" },
  { value: 70, suffix: "%", label: "Less manual PM effort with agents" },
];

export const experience: Experience[] = [
  {
    company: "Utrecht IT Consulting",
    role: "Associate Consultant Intern",
    focus: "Solace / Event-Driven Systems / Integration",
    period: "Jan 2026 — Present",
    mode: "Remote",
    current: true,
    points: [
      "Engineered an AI-native CRM platform on a LangGraph multi-agent architecture that unifies GitHub, codebases, coding agents, and meeting transcripts into a single context layer for intelligent project-management automation.",
      "Designed a Neo4j knowledge graph modelling repositories, tasks, commits, and meetings, so agents can reason over project state and keep documentation and task tracking updated in real time.",
      "Built a self-learning, event-driven agent pipeline on GitHub webhooks and Solace PubSub+ / MQTT for real-time task sync, cutting manual project-management effort by ~70%.",
      "Developed specialized agents for code analysis, documentation, and orchestration with cross-session learning, raising task-classification accuracy from 75% to 92% through continuous PM feedback.",
    ],
    stack: ["LangGraph", "Neo4j", "Solace PubSub+", "MQTT", "GitHub Webhooks", "Multi-Agent Systems"],
  },
  {
    company: "ZenithYuga Tech",
    role: "Full Stack Developer Intern",
    focus: "MERN + AI",
    period: "Jun 2024 — Dec 2024",
    mode: "Remote",
    points: [
      "Built and deployed a full-stack e-commerce platform with MongoDB, Express, React, and Node.js, focused on scalability and clean API design.",
      "Implemented product listing and detail pages, user sign-up / login, and add-to-cart / remove-from-cart flows.",
      "Integrated an LLM-based chatbot that answers product-related questions for shoppers.",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "LLM Chatbot"],
  },
  {
    company: "Cloud Eye Technologies",
    role: "Generative AI Engineer Intern",
    period: "Apr 2024 — May 2024",
    mode: "Onsite",
    points: [
      "Built an AI-driven nutrition analysis platform that analyzes diet details from free-text input, with a React.js frontend.",
      "Designed a LangChain LLM inference pipeline to extract food information, evaluate nutritional balance, and generate personalized health feedback.",
      "Automated diet-quality scoring, nutrient-deficiency detection, and improvement recommendations with prompt-engineered LLM workflows — end to end from input ingestion to a visual health report.",
    ],
    stack: ["LangChain", "LLMs", "Prompt Engineering", "React.js"],
  },
];

export const education = [
  {
    school: "Vignan's Institute of Information Technology",
    degree: "Bachelor of Technology in Artificial Intelligence",
    period: "2022 — 2026",
    cgpa: 8.65,
  },
];

export const achievements = [
  { title: "Top 4 — National Tech Entrepreneurship Summit 2024", detail: "BBIC Bengaluru" },
  { title: "3× Hackathon Winner", detail: "Full-stack developer of team Caffeinated Coders" },
  { title: "Technical Lead", detail: "Google Developer Groups (GDG) VIIT" },
  { title: "Hackathon Organizer", detail: "IWD Hackathon · Sushacks Hackathon 2025 · Supersus Hackathon 4.0" },
  { title: "Winner — CodeQuest 3.0", detail: "JNTU-V" },
  { title: "Semi-Finalist — TechGig Coding Gladiators", detail: "National coding competition" },
  { title: "Competitive Programming", detail: "2★ on CodeChef · 1539 rating on LeetCode" },
];

export const skillGroups = [
  {
    title: "Generative & Agentic AI",
    items: ["LangGraph", "LangChain", "CrewAI", "RAG", "AI Agents", "Multi-Agent Systems", "Knowledge Graphs", "Mistral & Gemini APIs"],
  },
  {
    title: "Languages",
    items: ["Python", "JavaScript", "C++", "C"],
  },
  {
    title: "Frameworks & Backend",
    items: ["React", "Next.js", "Node.js", "Express", "FastAPI", "MongoDB", "Microservices"],
  },
  {
    title: "Event-Driven & Messaging",
    items: ["Solace PubSub+", "Event-Driven Architecture", "Publish / Subscribe", "Queues & Topics", "MQTT", "Async Messaging"],
  },
  {
    title: "Vector & Graph Stores",
    items: ["Qdrant", "Pinecone", "ChromaDB", "FAISS", "Neo4j"],
  },
  {
    title: "CS Core & Tools",
    items: ["Data Structures & Algorithms", "OOP", "Complexity Analysis", "Git", "Firebase", "Clerk"],
  },
];

export const marqueeRows = [
  ["LangGraph", "Multi-Agent Systems", "RAG", "Knowledge Graphs", "Neo4j", "Qdrant", "CrewAI", "LangChain"],
  ["FastAPI", "Next.js", "React", "Node.js", "Solace PubSub+", "MQTT", "MongoDB", "Python"],
];

// Hand-picked from 60+ public repositories — the strongest, most complete work.
export const featuredProjects: FeaturedProject[] = [
  {
    repo: "Major-Project",
    title: "DevCopilot",
    tagline: "Multi-agent AI assistant for complex codebases",
    description:
      "Ingests any GitHub repository into a code knowledge graph and a FAISS vector index, then routes developer questions to four specialized LangGraph agents — Q&A, Code Generation, LLD Planning, and PR Analysis — with a full explainability trace behind every answer.",
    stack: ["LangGraph", "LangChain", "FastAPI", "FAISS", "NetworkX", "React", "Gemini"],
    pipeline: ["Ingest", "Graph", "FAISS", "Router", "Q&A", "CodeGen", "PR Review"],
    accent: "#8b5cf6",
    fromResume: true,
  },
  {
    repo: "MemoraeAi-1",
    title: "MemoraeAI",
    tagline: "Persistent memory infrastructure for AI",
    description:
      "Detects, scores, and classifies what's worth remembering from every conversation — profile, semantic, episodic, and goal memories — with deduplication and conflict resolution, then recalls the right context across Qdrant, Neo4j, and MongoDB. Gmail becomes memory too, via Composio.",
    stack: ["LangGraph", "Mistral", "FastAPI", "Qdrant", "Neo4j", "MongoDB", "Composio"],
    pipeline: ["Detect", "Score", "Classify", "Dedupe", "Qdrant", "Neo4j", "Recall"],
    demo: "https://memorae-ai-1-sb4j.vercel.app/",
    accent: "#22d3ee",
    fromResume: true,
  },
  {
    repo: "TrustLens",
    title: "TrustLens",
    tagline: "AI due-diligence engine for company trust",
    description:
      "Gathers evidence on any company from WHOIS records, its website, GitHub activity, and Tavily web search, normalizes it into an evidence packet, and has Mistral reason over it to produce a trust score with evidence-backed risk signals — streamed live to the UI over SSE.",
    stack: ["Python", "Flask", "Mistral", "Tavily", "PyGithub", "SSE", "Modal"],
    pipeline: ["WHOIS", "Website", "GitHub", "Tavily", "Normalize", "Mistral", "Score"],
    accent: "#34d399",
  },
  {
    repo: "sprintflow",
    title: "SprintFlow",
    tagline: "AI-powered sprint management",
    description:
      "Sprint planning with Kanban boards, AI risk analysis, and team collaboration — a React 19 + React Flow frontend on a FastAPI backend that uses LangGraph and Mistral for analysis, MongoDB for storage, and JWT auth.",
    stack: ["React", "React Flow", "FastAPI", "LangGraph", "Mistral", "MongoDB"],
    pipeline: ["Board", "Tasks", "LangGraph", "Risk", "Mistral", "Team"],
    accent: "#f59e0b",
  },
  {
    repo: "StartUp-Pitch-Agent",
    title: "Startup Pitch Agent",
    tagline: "Six agents turn one idea into an investor-ready pitch",
    description:
      "A LangGraph workflow of six collaborating agents — market research with live web search, founder persona, problem, solution, business model, and pitch composer — that turns a one-line startup idea into a complete, investor-ready pitch.",
    stack: ["LangGraph", "Gemini", "LangChain", "DuckDuckGo Search", "Streamlit"],
    pipeline: ["Market", "Founder", "Problem", "Solution", "Business", "Pitch"],
    accent: "#f472b6",
  },
  {
    repo: "pdf_qa_bot",
    title: "DocuChat AI",
    tagline: "Chat with your documents — with memory",
    description:
      "A RAG app for PDF, DOCX, and TXT files: chunked FAISS retrieval, conversational memory across turns, and source-aware answers you can verify, powered by Gemini through LangChain.",
    stack: ["LangChain", "RAG", "FAISS", "Gemini", "Streamlit"],
    pipeline: ["Upload", "Chunk", "Embed", "FAISS", "Retrieve", "Answer"],
    accent: "#60a5fa",
  },
];
