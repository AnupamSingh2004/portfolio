export interface Project {
  id: string;
  title: string;
  subtitle: string;
  displayNumber: string;
  description: string;
  metrics: { value: string; label: string }[];
  techStack: string[];
  links: { label: string; url: string }[];
  image?: string;
  type: 'web' | 'app' | 'terminal';
}

export const projects: Project[] = [
  {
    id: 'sysdes',
    title: 'SysDes',
    subtitle: 'AI System Design Tool · 2026',
    displayNumber: '01',
    description:
      'Intelligent design tool that transforms messy whiteboard sketches into professional system architecture diagrams with AI suggestions and version history.',
    metrics: [
      { value: 'AI', label: 'Powered' },
      { value: '1', label: 'Fork' },
      { value: '∞', label: 'Diagrams' },
    ],
    techStack: ['Next.js', 'TypeScript', 'Canvas API', 'OpenAI', 'Vercel'],
    links: [
      { label: 'GitHub', url: 'https://github.com/AnupamSingh2004/SysDes' },
      { label: 'Live Demo', url: 'https://sys-des.vercel.app/' },
    ],
    image: '/projects/Sysdes.png',
    type: 'web',
  },
  {
    id: 'juris-lead',
    title: 'Juris-Lead',
    subtitle: 'AI Legal-Tech Platform · 2025',
    displayNumber: '02',
    description:
      'AI-powered IPC case consultation platform with custom fine-tuned Ollama model, full-stack across Next.js, Flutter, and Django REST — all orchestrated with Docker.',
    metrics: [
      { value: '92%', label: 'Accuracy' },
      { value: '500+', label: 'Cases' },
      { value: '25+', label: 'Endpoints' },
    ],
    techStack: ['Next.js', 'Flutter', 'Django', 'Ollama', 'Docker', 'PostgreSQL'],
    links: [
      { label: 'GitHub', url: 'https://github.com/AnupamSingh2004/Juris-Lead' },
      { label: 'Live Demo', url: 'https://juris-lead.vercel.app' },
    ],
    image: '/projects/juris-lead.png',
    type: 'web',
  },
  {
    id: 'aarogya-rekha',
    title: 'AarogyaRekha',
    subtitle: 'AI Preventive Healthcare · 2025',
    displayNumber: '03',
    description:
      'AI-driven disease-outbreak prediction integrating MODIS, Sentinel-2, and ISRO Bhuvan satellite data with real-time environmental monitoring for malaria & dengue.',
    metrics: [
      { value: '89%', label: 'Accuracy' },
      { value: '3', label: 'Satellites' },
      { value: '2', label: 'Diseases' },
    ],
    techStack: ['Flutter', 'Django', 'TensorFlow', 'Satellite APIs', 'OCR'],
    links: [{ label: 'GitHub', url: 'https://github.com/AnupamSingh2004/AarogyaRekha' }],
    image: '/projects/aarogyarekha.png',
    type: 'app',
  },
  {
    id: 'safer',
    title: 'Safer',
    subtitle: 'AI Safety & Security App · 2025',
    displayNumber: '04',
    description:
      'Real-time AI safety scoring app with location-based risk assessment, emergency panic features, incident reporting, and smart chatbot — all in a sleek mobile interface.',
    metrics: [
      { value: '87.5', label: 'Safety Score' },
      { value: '6+', label: 'Features' },
      { value: 'Live', label: 'Tracking' },
    ],
    techStack: ['Flutter', 'TypeScript', 'AI/ML', 'Maps API', 'Firebase'],
    links: [{ label: 'GitHub', url: 'https://github.com/AnupamSingh2004/Safer' }],
    image: '/projects/Safer.png',
    type: 'app',
  },
  {
    id: 'bookitzz',
    title: 'BookItzz',
    subtitle: 'Digital Library Platform · 2025',
    displayNumber: '05',
    description:
      'Full-featured digital library management system with book cataloging, borrowing workflows, user authentication, and a beautiful dark-themed reading interface.',
    metrics: [
      { value: '99', label: 'Total Books' },
      { value: '4.9', label: 'Avg Rating' },
      { value: '6+', label: 'Categories' },
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
    links: [{ label: 'GitHub', url: 'https://github.com/AnupamSingh2004/BookItzz' }],
    image: '/projects/Bookitzz.png',
    type: 'web',
  },
  {
    id: 'orkait-backend',
    title: 'Orkait Backend',
    subtitle: 'Go Services · AWS · 2026',
    displayNumber: '06',
    description:
      'Distributed Golang services with goroutine-powered concurrency, AWS auto-scaling, and CI/CD pipelines that turned a 10-minute manual deploy into a 41-second push-to-prod.',
    metrics: [
      { value: '41s', label: 'Deploy Time' },
      { value: '128', label: 'Goroutines' },
      { value: '99.9%', label: 'Uptime' },
    ],
    techStack: ['Go', 'AWS ECS', 'Docker', 'GitHub Actions', 'Terraform'],
    links: [{ label: 'GitHub', url: 'https://github.com/AnupamSingh2004' }],
    type: 'terminal',
  },
];
