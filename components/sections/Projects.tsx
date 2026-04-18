'use client';
import { useEffect } from 'react';
import { projects } from '@/data/projects';

function MockJuris() {
  return (
    <div className="mock mock-juris">
      <div className="chip">● JURIS-LEAD · LIVE</div>
      <div className="head">IPC Case Analysis</div>
      <div className="card">
        <div className="label">QUERY / 14:22</div>
        <div className="val">Property dispute — Section 406</div>
      </div>
      <div className="card">
        <div className="label">CONFIDENCE · 500+ CASES</div>
        <div className="val" style={{ color: '#c6ff3d' }}><em>92%</em></div>
        <div className="bars">
          <div style={{ height: '40%' }}></div><div style={{ height: '70%' }}></div>
          <div style={{ height: '92%' }}></div><div style={{ height: '55%' }}></div>
          <div style={{ height: '80%' }}></div><div style={{ height: '65%' }}></div>
          <div style={{ height: '88%' }}></div><div style={{ height: '45%' }}></div>
        </div>
      </div>
    </div>
  );
}

function MockAarogya() {
  return (
    <div className="mock mock-aarogya">
      <div className="readout">
        <span>AAROGYA-REKHA / SAT-01</span>
        <span className="live">● LIVE FEED</span>
      </div>
      <div className="globe"></div>
      <div className="dot" style={{ top: '42%', left: '35%' }}></div>
      <div className="dot" style={{ top: '55%', left: '60%' }}></div>
      <div className="dot" style={{ top: '38%', left: '55%' }}></div>
      <div className="pulse" style={{ top: '42%', left: '35%' }}></div>
      <div className="pulse" style={{ top: '55%', left: '60%', animationDelay: '.8s' }}></div>
      <div className="stats">
        <div><div className="v"><em>89</em>%</div>PREDICTION</div>
        <div><div className="v">MODIS</div>SATELLITE</div>
        <div><div className="v">SENTINEL-2</div>IMAGERY</div>
      </div>
    </div>
  );
}

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

function MockUpwork() {
  return (
    <div className="mock mock-upwork">
      <div className="grid-bg"></div>
      <div className="content">
        <div className="rating">★★★★★</div>
        <div className="big">Delivered <br /><em>2</em> apps,<br />both <em>5★</em>.</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-dim)', letterSpacing: '.15em', marginTop: '12px' }}>
          MULTI-LANG CMS · 5+ LOCALES
        </div>
        <div className="lang">
          <div>EN</div><div>ES</div><div>FR</div><div>DE</div><div>JA</div>
        </div>
      </div>
    </div>
  );
}

const mocks: Record<string, React.FC> = {
  'juris-lead': MockJuris,
  'aarogya-rekha': MockAarogya,
  'orkait-backend': MockOrkait,
  'freelance-suite': MockUpwork,
};

export default function Projects() {
  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>('.projects-wrap');
    if (!wrap) return;
    const track = wrap.querySelector<HTMLElement>('.projects-track');
    const counter = wrap.querySelector<HTMLElement>('.projects-progress .idx');
    const bar = wrap.querySelector<HTMLElement>('.projects-progress .bar');
    if (!track || !bar) return;

    const sizeWrap = () => {
      const trackW = track.scrollWidth;
      const extra = trackW - window.innerWidth;
      wrap.style.height = `${extra + window.innerHeight}px`;
    };
    sizeWrap();
    window.addEventListener('resize', sizeWrap);

    const cards = track.querySelectorAll('.project-card').length;
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const max = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, scrolled / max));
      const move = (track.scrollWidth - window.innerWidth) * p;
      track.style.transform = `translateX(${-move}px)`;
      bar.style.setProperty('--p', `${p * 100}%`);
      if (counter) {
        counter.textContent =
          String(Math.min(cards, Math.floor(p * cards) + 1)).padStart(2, '0') +
          ' / ' +
          String(cards).padStart(2, '0');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const lines = document.querySelectorAll<HTMLElement>('.mock-orkait .l');
    lines.forEach((l, i) => {
      l.style.opacity = '0';
      setTimeout(() => {
        l.style.transition = 'opacity .3s ease';
        l.style.opacity = '1';
      }, 300 + i * 120);
    });

    return () => {
      window.removeEventListener('resize', sizeWrap);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <section id="projects" style={{ padding: '120px 0 0' }}>
        <div className="container" style={{ padding: '0 40px' }}>
          <div className="section-label"><span className="num">03</span> Featured Projects</div>
          <h2 className="section-title reveal">Things I&apos;ve <em>built</em>.</h2>
        </div>
      </section>

      <div className="projects-wrap">
        <div className="sticky-inner">
          <div className="projects-track">
            <div className="project-intro">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.2em', color: 'var(--ink-dim)', textTransform: 'uppercase', marginBottom: '18px' }}>
                // Scroll →
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,4.5vw,72px)', lineHeight: 1, letterSpacing: '-.03em' }}>
                Four projects. <br /><em>One engineer.</em>
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '15px', color: 'var(--ink-dim)', lineHeight: 1.6, marginTop: '24px', maxWidth: '420px' }}>
                From AI-powered legal platforms to satellite-driven healthcare, each one is a systems problem dressed up as a product.
              </div>
            </div>

            {projects.map((project) => {
              const Mock = mocks[project.id];
              return (
                <div key={project.id} className="project-card">
                  <div className="project-visual">
                    {Mock && <Mock />}
                  </div>
                  <div className="project-info">
                    <div>
                      <div className="project-num">PROJECT / {project.displayNumber}</div>
                      <div className="project-title">{project.title}</div>
                      <div className="project-subtitle">{project.subtitle}</div>
                      <div className="project-desc">{project.description}</div>
                      <div className="project-metrics">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="val"><em>{m.value}</em></div>
                            <div className="lbl">{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="project-tags">
                        {project.techStack.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a key={link.label} href={link.url} className="btn">
                          {link.label}
                          {link.label === 'GitHub' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 17l10-10M7 7h10v10" />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ minWidth: '40px' }}></div>
          </div>

          <div className="projects-progress">
            <span className="idx">01 / 04</span>
            <div className="bar"></div>
            <span>Drag / scroll</span>
          </div>
        </div>
      </div>
    </>
  );
}
