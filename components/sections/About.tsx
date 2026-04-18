export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-label"><span className="num">01</span> About</div>
        <div className="about-grid">
          <div className="about-portrait">
            <svg
              viewBox="0 0 400 500"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="por" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1a2a0d" />
                  <stop offset="1" stopColor="#050505" />
                </linearGradient>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#c6ff3d" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#por)" />
              <rect width="400" height="500" fill="url(#dots)" />
              <g transform="translate(200,220)">
                <circle r="90" fill="none" stroke="#c6ff3d" strokeOpacity="0.6" strokeWidth="1" />
                <circle r="70" fill="none" stroke="#f5f5f0" strokeOpacity="0.2" strokeWidth="1" />
                <circle r="50" fill="#c6ff3d" opacity="0.12" />
                <text y="8" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="64" fill="#f5f5f0">as</text>
              </g>
              <g transform="translate(40,440)" fill="#8a8a85" fontFamily="Geist Mono" fontSize="10" letterSpacing="2">
                <text>LAT 23.1815</text>
                <text y="14">LON 79.9864</text>
              </g>
              <g transform="translate(360,40)" textAnchor="end" fill="#c6ff3d" fontFamily="Geist Mono" fontSize="10" letterSpacing="2">
                <text>● LIVE</text>
              </g>
            </svg>
            <div className="tag"><span className="num">■</span> IDX.001 — ANUPAM SINGH — 2026</div>
          </div>

          <div className="about-body reveal" style={{ paddingTop: '160px' }}>
            <p>
              I&apos;m a computer science undergraduate who treats <em>systems thinking</em> like
              a craft — designing backends that don&apos;t break under load, deploying infrastructure
              that self-heals, and shipping products people actually use.
            </p>
            <p>
              <span>At Orkait I architect Go services on AWS with goroutines, channels, and a
              distaste for flaky pipelines. On Upwork I&apos;ve delivered enterprise-grade platforms
              for international clients — 5-star rated, 60% less manual toil.</span>
            </p>
            <p>
              I believe the best engineering <em>looks</em> boring and <em>feels</em> effortless.
              Let&apos;s build something like that.
            </p>

            <div className="about-stats">
              <div><div className="num"><em>2</em>+</div><div className="lbl">Years Shipping</div></div>
              <div><div className="num"><em>350</em>+</div><div className="lbl">DSA Problems</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
