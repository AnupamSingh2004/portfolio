export default function Education() {
  return (
    <section id="education">
      <div className="container">
        <div className="section-label"><span className="num">06</span> Education &amp; Credentials</div>

        <div className="edu-grid">
          {/* Edu card — same structure as cert-card */}
          <div className="cert-card reveal">
            <div className="cert-inner">
              {/* Front */}
              <div className="cert-face cert-front edu-front-content">
                <div>
                  <div className="edu-date">AUG 2023 — MAY 2027</div>
                  <div className="edu-inst">IIITDM <em>Jabalpur</em></div>
                  <div className="edu-degree">
                    Bachelor of Technology
                    <span>Computer Science &amp; Engineering</span>
                  </div>
                  <div className="edu-tags">
                    <span>Distributed Systems</span>
                    <span>Algorithms</span>
                    <span>Machine Learning</span>
                    <span>Systems Design</span>
                  </div>
                </div>
                <div className="edu-footer">
                  <span>IIITDM · JABALPUR</span>
                  <span>YEAR 03 / 04</span>
                </div>
              </div>

              {/* Back — campus photo */}
              <div className="cert-face cert-back">
                <img
                  src="/images/college/iiitdmj.png"
                  alt="IIIT Jabalpur Campus"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
                />
                <div className="edu-back-overlay" />
                <div className="edu-back-content">
                  <div className="edu-back-label">IIITDM · JABALPUR</div>
                  <div className="edu-back-name">Indian Institute of Information Technology,<br /><em>Design &amp; Manufacturing</em></div>
                  <div className="edu-back-city">Jabalpur</div>
                  <div className="edu-back-coords">23.1815° N · 79.9864° E</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cert-card reveal">

            <div className="cert-inner">
              {/* Front */}
              <div className="cert-face cert-front">
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

              {/* Back — certificate image */}
              <div className="cert-face cert-back">
                <img
                  src="/images/certificates/coursera.png"
                  alt="DevOps Certificate"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
