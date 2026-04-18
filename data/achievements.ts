export interface Achievement {
  metric: string;
  label: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    metric: '350+',
    label: 'DSA · LeetCode + CodeChef',
    description: 'Competitive programming across 250+ LeetCode & 20+ CodeChef problems.',
  },
  {
    metric: '92%',
    label: 'Juris-Lead AI Accuracy',
    description: 'Custom fine-tuned Ollama model across 500+ IPC case classifications.',
  },
  {
    metric: '60%',
    label: 'Workflow Reduction',
    description: 'AI-powered Google Ads platform automating repetitive client workflows.',
  },
];
