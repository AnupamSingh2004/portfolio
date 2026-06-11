export interface Experience {
  company: string;
  role: string;
  period: string;
  bulletPoints: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Prepelo · Backend',
    role: 'Backend Engineer Intern',
    period: '2026 · 05 — PRESENT',
    bulletPoints: [
      'Building a RAG-based text extraction pipeline in Python (FastAPI) for book knowledge ingestion, integrating LLM APIs for intelligent Q&A processing.',
      'Developing and containerizing backend services using Django REST Framework and Docker across a multi-service architecture.',
      'Designing the core backend infrastructure from scratch for an early-stage startup.',
    ],
    tags: ['FastAPI', 'Django', 'Docker', 'RAG', 'LLMs'],
  },
  {
    company: 'Orkait · Backend & Cloud',
    role: 'SDE Intern',
    period: '2026 · 01 — 03',
    bulletPoints: [
      'Engineered high-performance Golang backends using goroutines and channels for concurrent throughput.',
      'Architected and deployed end-to-end CI/CD on AWS with auto-scaling infrastructure.',
      'Designed distributed services focused on fault tolerance and modular architecture.',
    ],
    tags: ['Go', 'AWS', 'Kubernetes', 'CI/CD'],
  },
  {
    company: 'Upwork · International Clients',
    role: 'Full-Stack Freelancer',
    period: '2025 · 01 — 12',
    bulletPoints: [
      'Delivered 2 enterprise applications, both rated 5 stars.',
      'Built AI-powered Google Ads platform reducing manual workflows by 60%.',
      'Architected multi-language CMS (5+ languages) using Next.js, Prisma, and PostgreSQL.',
    ],
    tags: ['Next.js', 'Prisma', 'Postgres', 'AI'],
  },
  {
    company: 'IIIT Jabalpur · Undergraduate',
    role: 'B.Tech CSE',
    period: '2023 — PRESENT',
    bulletPoints: [
      'Bachelor of Technology, Computer Science & Engineering.',
      '350+ DSA problems solved across LeetCode and CodeChef.',
      'Multiple hackathon wins including 1st place at BitByBit, IIT Roorkee.',
    ],
    tags: ['DSA', 'Systems', 'ML'],
  },
];
