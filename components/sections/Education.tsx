export default function Education() {
  return (
    <section id="education">
      <div className="container">
        <div className="section-label"><span className="num">06</span> Education &amp; Credentials</div>

        <div className="edu-grid">
          <div className="edu-card reveal">
            <div>
              <div className="edu-date">AUG 2023 — MAY 2027</div>
              <div className="edu-inst">IIIT <em>Jabalpur</em></div>
              <div className="edu-deg">
                Indian Institute of Information Technology — Bachelor of Technology in
                Computer Science &amp; Engineering. Systems-oriented coursework in distributed
                computing, algorithms, and ML.
              </div>
            </div>
            <div className="edu-crest">as</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.2em', color: 'var(--ink-dim)', textTransform: 'uppercase', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
              <span>B.TECH · CSE</span>
              <span>YEAR 03 / 04</span>
            </div>
          </div>

          <div className="cert-card reveal">
            <div>
              <div className="cert-ribbon">Certified</div>
              <div className="cert-title">Introduction to DevOps Professional Certificate</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.55, marginTop: '10px' }}>
                IBM via Coursera — foundations in CI/CD, container orchestration, and automation workflows.
              </div>
            </div>
            <div className="cert-meta">
              <span>IBM · COURSERA</span>
              <span>MAR 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
