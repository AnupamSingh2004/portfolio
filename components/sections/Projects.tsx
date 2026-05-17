'use client';
import { useEffect, useRef } from 'react';
import { projects } from '@/data/projects';

/* ── Terminal mock kept only for Orkait (no screenshot) ── */
function MockOrkait() {
  return (
    <div className="mock mock-orkait">
      <div className="term-head"><span></span><span></span><span></span></div>
      <div className="l"><span className="p">~/orkait</span> <span className="k">$</span> go run services/gateway.go</div>
      <div className="l"><span className="s">[INFO]</span> Spawning <span className="k">128</span> goroutines · channel-buffer=<span className="k">1024</span></div>
      <div className="l"><span className="s">[INFO]</span> CI/CD pipeline: <span className="p">aws-ecs-prod</span> → <span className="p">healthy</span></div>
      <div className="l"><span className="s">[INFO]</span> Auto-scaling target: <span className="k">cpu &lt; 70%</span></div>
      <div className="l"><span className="p">✓</span> Deploy <span className="k">v2.14.0</span> in <span className="k">41s</span></div>
      <div className="flow">
        <div className="node">COMMIT</div>
        <span className="arrow">→</span>
        <div className="node active">BUILD</div>
        <span className="arrow">→</span>
        <div className="node active">TEST</div>
        <span className="arrow">→</span>
        <div className="node">DEPLOY</div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = section.querySelectorAll<HTMLElement>('.project-row');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    rows.forEach((row) => observer.observe(row));

    /* Orkait terminal line animation */
    const orkaitCard = section.querySelector('.mock-orkait');
    if (orkaitCard) {
      const orkaitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lines = entry.target.querySelectorAll<HTMLElement>('.l');
              lines.forEach((l, i) => {
                l.style.opacity = '0';
                setTimeout(() => {
                  l.style.transition = 'opacity .3s ease';
                  l.style.opacity = '1';
                }, 300 + i * 120);
              });
              orkaitObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      orkaitObserver.observe(orkaitCard);
    }

    return () => observer.disconnect();
  }, []);

  /* Group projects into pairs */
  const rows: (typeof projects[number])[][] = [];
  for (let i = 0; i < projects.length; i += 2) {
    rows.push(projects.slice(i, i + 2));
  }

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <div className="container" style={{ padding: '0 40px' }}>
        <div className="section-label"><span className="num">03</span> Featured Projects</div>
        <h2 className="section-title reveal">Things I&apos;ve <em>built</em>.</h2>

        <div className="projects-grid">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="project-row">
              {row.map((project) => (
                <div key={project.id} className="project-card">
                  {/* ── Visual ── */}
                  <div className={`project-visual${project.type === 'app' ? ' app-visual' : ''}`}>
                    {project.type === 'terminal' ? (
                      <MockOrkait />
                    ) : project.image ? (
                      project.type === 'app' ? (
                        <div className="app-frame">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={project.image} alt={`${project.title} screenshot`} className="web-screenshot" loading="lazy" />
                      )
                    ) : null}
                  </div>

                  {/* ── Info ── */}
                  <div className="project-info">
                    <div>
                      <div className="project-num">PROJECT / {project.displayNumber}</div>
                      <div className="project-title">{project.title}</div>
                      <div className="project-subtitle">{project.subtitle}</div>
                      <div className="project-desc">{project.description}</div>
                      <div className="project-tags">
                        {project.techStack.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a key={link.label} href={link.url} className="btn" target="_blank" rel="noopener noreferrer">
                          {link.label}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17l10-10M7 7h10v10" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
