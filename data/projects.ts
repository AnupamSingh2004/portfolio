export interface Project {
  id: string;
  title: string;
  subtitle: string;
  displayNumber: string;
  description: string;
  metrics: { value: string; label: string }[];
  techStack: string[];
  links: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: 'juris-lead',
    title: 'Juris-Lead',
    subtitle: 'AI Legal-Tech Platform · 2025',
    displayNumber: '01',
    description:
      'AI-powered IPC case consultation platform with custom fine-tuned Ollama model, full-stack across Next.js, Flutter, and Django REST — all orchestrated with Docker.',
    metrics: [
      { value: '92%', label: 'Accuracy' },
      { value: '500+', label: 'Cases' },
      { value: '25+', label: 'Endpoints' },
    ],
    techStack: ['Next.js', 'Flutter', 'Django', 'Ollama', 'Docker', 'PostgreSQL'],
    links: [
      { label: 'GitHub', url: '#' },
      { label: 'Live Demo', url: '#' },
    ],
  },
  {
    id: 'aarogya-rekha',
    title: 'AarogyaRekha',
    subtitle: 'AI Preventive Healthcare · 2025',
    displayNumber: '02',
    description:
      'AI-driven disease-outbreak prediction integrating MODIS, Sentinel-2, and ISRO Bhuvan satellite data with real-time environmental monitoring for malaria & dengue.',
    metrics: [
      { value: '89%', label: 'Accuracy' },
      { value: '3', label: 'Satellites' },
      { value: '2', label: 'Diseases' },
    ],
    techStack: ['Flutter', 'Django', 'TensorFlow', 'Satellite APIs', 'OCR'],
    links: [{ label: 'GitHub', url: '#' }],
  },
  {
    id: 'orkait-backend',
    title: 'Orkait Backend',
    subtitle: 'Go Services · AWS · 2026',
    displayNumber: '03',
    description:
      'Distributed Golang services with goroutine-powered concurrency, AWS auto-scaling, and CI/CD pipelines that turned a 10-minute manual deploy into a 41-second push-to-prod.',
    metrics: [
      { value: '41s', label: 'Deploy Time' },
      { value: '128', label: 'Goroutines' },
      { value: '99.9%', label: 'Uptime' },
    ],
    techStack: ['Go', 'AWS ECS', 'Docker', 'GitHub Actions', 'Terraform'],
    links: [{ label: 'Case Study', url: '#' }],
  },
  {
    id: 'freelance-suite',
    title: 'Freelance Suite',
    subtitle: 'Upwork · Enterprise Clients · 2025',
    displayNumber: '04',
    description:
      'Two enterprise-grade applications for international clients — an AI-powered Google Ads platform reducing manual work by 60%, and a multi-language CMS across Next.js, Prisma, and Postgres.',
    metrics: [
      { value: '60%', label: 'Less Manual' },
      { value: '5+', label: 'Languages' },
      { value: '5★', label: 'Avg Rating' },
    ],
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'OpenAI', 'i18n'],
    links: [{ label: 'View Portfolio', url: '#' }],
  },
];
