'use client';
import { useState, useRef } from 'react';

const SYSTEM = `You are Anupam Singh's portfolio AI assistant. Anupam is a Computer Science student at IIIT Jabalpur (2023-2027). He is a Software Engineer focused on Backend & Cloud. Experience: SDE Intern at Orkait (Golang backend, AWS CI/CD, distributed services); Freelance Full-Stack Developer on Upwork (delivered 2 enterprise apps, 5-star rated; built AI-powered Google Ads platform reducing manual work by 60%; architected multi-language CMS with Next.js/Prisma/PostgreSQL). Key projects: Juris-Lead (AI legal-tech platform, 92% accuracy, Next.js + Flutter + Django + Ollama); AarogyaRekha (AI healthcare, satellite data, 89% accuracy for malaria/dengue prediction). Skills: Dart, Go, Python, C++, Java, TypeScript, Flutter, React/Next.js, Django, AWS, Docker, K8s, Terraform. Achievements: 1st place BitByBit Hackathon IIT Roorkee; Top 10 Hack4Health (400+ teams); 350+ DSA problems solved. Answer succinctly (2-3 sentences max). Write in first person as if you are Anupam. Be confident, warm, technical. Never invent facts beyond these.`;

const SUGGESTIONS = [
  "What's your favorite project?",
  'How do you approach backend design?',
  'Tell me about Juris-Lead',
  'Why Golang?',
];

export default function PlaygroundPage() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ask(q: string) {
    if (!q.trim()) return;
    setOutput('');
    setLoading(true);
    try {
      // TODO: wire up to real API route
      console.log('AI call stubbed:', q, SYSTEM);
      await new Promise((r) => setTimeout(r, 500));
      setOutput('Hmm, my brain is offline right now. Try the email below — sanupam2004@gmail.com.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="playground" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="section-label"><span className="num">07</span> Playground</div>
        <h2 className="section-title">Ask the <em>portfolio</em>.</h2>

        <div className="play-intro">
          <p>
            This is a tiny Claude-powered assistant trained on my resume. Ask about my{' '}
            <em>projects</em>, <em>stack</em>, or <em>how I&apos;d approach</em> a problem.
            It answers in my voice.
          </p>
        </div>

        <div className="play-ask">
          <div className="play-ask-head">
            <span>// ANUPAM.AI</span>
            <span className="live">ONLINE</span>
          </div>
          <div className="play-ask-prompt">
            Hey — <em>I&apos;m an AI version of Anupam</em>. What do you want to know?
          </div>
          <div className="play-ask-suggest">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = s;
                  ask(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div id="ask-output" className={`play-ask-output${loading ? ' caret' : ''}`}>
            {output}
          </div>
          <div className="play-ask-input">
            <input
              ref={inputRef}
              id="ask-input"
              placeholder="Type a question..."
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputRef.current) ask(inputRef.current.value);
              }}
            />
            <button
              id="ask-send"
              disabled={loading}
              onClick={() => { if (inputRef.current) ask(inputRef.current.value); }}
            >
              Send →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
