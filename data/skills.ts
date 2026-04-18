export interface SkillCategory {
  name: string;
  count: string;
  highlighted: string[];
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    count: '/ 10',
    highlighted: ['Go', 'TypeScript', 'Python'],
    skills: ['Dart', 'C++', 'Java', 'JavaScript', 'C', 'SQL', 'Bash'],
  },
  {
    name: 'Frameworks',
    count: '/ 07',
    highlighted: ['Next.js', 'React', 'Flutter'],
    skills: ['Node.js', 'Express', 'Django', 'DRF'],
  },
  {
    name: 'Cloud & DevOps',
    count: '/ 11',
    highlighted: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    skills: ['GCP', 'Azure', 'Ansible', 'Jenkins', 'GH Actions', 'Maven', 'Git'],
  },
  {
    name: 'Data & Monitoring',
    count: '/ 06',
    highlighted: ['PostgreSQL', 'Redis'],
    skills: ['MySQL', 'MongoDB', 'Prometheus', 'Grafana'],
  },
  {
    name: 'AI / Testing',
    count: '/ 06',
    highlighted: ['TensorFlow', 'Ollama'],
    skills: ['Postman', 'REST', 'Unit Testing', 'Debug'],
  },
];
