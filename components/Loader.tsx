'use client';
import { useEffect } from 'react';

export default function Loader() {
  useEffect(() => {
    const fill = document.getElementById('loader-fill') as HTMLElement;
    const pctEl = document.getElementById('loader-pct') as HTMLElement;
    const statusEl = document.getElementById('loader-status') as HTMLElement;
    const stages = Array.from(
      document.querySelectorAll<HTMLElement>('#loader-stages .stage')
    );
    const stageLabels = [
      'Booting kernel',
      'Rendering typography',
      'Initializing WebGL globe',
      'Loading projects',
      'Calibrating experience',
    ];
    const stageTargets = [15, 35, 55, 78, 100];

    function start() {
      stages.forEach((s, i) => {
        setTimeout(() => s.classList.add('show'), 400 + i * 300);
      });
      let stage = 0;
      let p = 0;
      const startAt = Date.now() + 1800;

      function tick() {
        const now = Date.now();
        if (now < startAt) { requestAnimationFrame(tick); return; }
        const target = stageTargets[stage];
        p += (target - p) * 0.04;
        if (p < target - 0.3) {
          pctEl.textContent = String(Math.floor(p)).padStart(2, '0');
          fill.style.transform = `scaleX(${p / 100})`;
          statusEl.textContent = stageLabels[stage];
          stages[stage]?.classList.add('active');
          requestAnimationFrame(tick);
        } else {
          p = target;
          pctEl.textContent = String(target).padStart(2, '0');
          fill.style.transform = `scaleX(${target / 100})`;
          stages[stage]?.classList.remove('active');
          stages[stage]?.classList.add('done');
          const mark = stages[stage]?.querySelector('.mark');
          if (mark) mark.textContent = '●';
          stage++;
          if (stage < stageTargets.length) {
            setTimeout(() => requestAnimationFrame(tick), 400);
          } else {
            statusEl.textContent = 'Ready';
            setTimeout(() => {
              document.getElementById('loader')?.classList.add('done');
              document.body.classList.add('loaded');
            }, 900);
          }
        }
      }
      requestAnimationFrame(tick);
    }

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }
  }, []);

  return (
    <div id="loader">
      <div className="loader-top">
        <span><span className="live">SYSTEM BOOT</span></span>
        <span>PORTFOLIO v.2026.04</span>
      </div>

      <div className="loader-mark" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <g className="ring-text">
            <defs>
              <path id="circ" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text fill="#8a8f98" fontFamily="Geist Mono" fontSize="7" letterSpacing="3">
              <textPath href="#circ">ANUPAM · SINGH · SOFTWARE · ENGINEER · </textPath>
            </text>
          </g>
          <circle cx="50" cy="50" r="4" fill="#cdd6b0" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#cdd6b0" strokeOpacity=".3" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#cdd6b0" strokeOpacity=".15" />
        </svg>
      </div>

      <div className="loader-center">
        <div className="loader-small">PORTFOLIO · <span>EDITION 01</span> · 2026</div>
        <div className="loader-name">
          <span className="w">Anupam&nbsp;</span><span className="w"><em>Singh</em>.</span>
        </div>
        <div className="loader-stages" id="loader-stages">
          <div className="stage" data-stage="0"><span>01 · Booting kernel</span><span className="mark">○</span></div>
          <div className="stage" data-stage="1"><span>02 · Rendering typography</span><span className="mark">○</span></div>
          <div className="stage" data-stage="2"><span>03 · Initializing WebGL globe</span><span className="mark">○</span></div>
          <div className="stage" data-stage="3"><span>04 · Loading projects &amp; assets</span><span className="mark">○</span></div>
          <div className="stage" data-stage="4"><span>05 · Calibrating experience</span><span className="mark">○</span></div>
        </div>
      </div>

      <div className="loader-bottom">
        <div className="loader-bar">
          <div className="loader-bar-fill" id="loader-fill"></div>
        </div>
        <div className="loader-meta">
          <span id="loader-status">Preparing interface</span>
          <span className="big"><span id="loader-pct">00</span><span>%</span></span>
        </div>
      </div>
    </div>
  );
}
