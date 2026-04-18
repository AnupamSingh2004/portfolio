export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-meta">
        <div>
          <div>Portfolio</div>
          <b>2026 — Edition 01</b>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>Based in</div>
          <b>Jabalpur, IN · 23.18°N</b>
        </div>
      </div>

      <h1>
        <span className="line"><span className="word">Software <em>engineer</em>,</span></span>
        <span className="line"><span className="word">building backend &amp;</span></span>
        <span className="line"><span className="word">cloud <em>at scale.</em></span></span>
      </h1>

      <div className="hero-sub">
        <p>
          <span>Anupam Singh</span> — CS undergrad at IIIT Jabalpur designing distributed
          services in Go, shipping full-stack products for international clients, and sending
          the occasional hackathon home with first place.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn primary">
            See the work{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="mailto:sanupam2004@gmail.com" className="btn">Get in touch</a>
        </div>
      </div>

      <div className="scroll-hint">
        Scroll
        <div className="line"></div>
        01 / 07
      </div>
    </section>
  );
}
