import { achievements } from '@/data/achievements';

export default function Achievements() {
  return (
    <section id="achievements">
      <div className="container">
        <div className="section-label"><span className="num">05</span> Wins &amp; Milestones</div>
        <h2 className="section-title reveal">A few <em>receipts</em>.</h2>

        <div className="ach-grid">
          <div className="ach hero-card span-7 reveal">
            <div>
              <div className="tag">● 1ST PLACE · BITBYBIT HACKATHON</div>
              <h3>IIT Roorkee picked our build <em>first</em>, out of hundreds.</h3>
            </div>
            <div className="meta">BITBYBIT · IIT ROORKEE · 2025</div>
          </div>

          <div className="ach span-5 reveal">
            <div className="ach-num"><em>10</em></div>
            <div className="ach-lbl">Rank · Hack4Health</div>
            <div className="ach-desc">Top 10 finisher out of 400+ teams competing globally.</div>
          </div>

          {achievements.map((a) => (
            <div key={a.label} className="ach span-4 reveal">
              <div className="ach-num"><em>{a.metric}</em></div>
              <div className="ach-lbl">{a.label}</div>
              <div className="ach-desc">{a.description}</div>
            </div>
          ))}

          <div
            className="ach span-12 reveal"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}
          >
            <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px,2.2vw,36px)', lineHeight: 1.1, letterSpacing: '-.01em', maxWidth: '60%' }}>
              Also showed up for <em>HackByte 3.0</em>, <em>HACKJMI</em>, and every late-night build in between.
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.2em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
              + MANY MORE<br />ONGOING / 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
