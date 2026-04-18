export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-label"><span className="num">07</span> Get in touch</div>
        <h2>Let&apos;s build <em>something</em>.</h2>

        <div>
          <a href="mailto:sanupam2004@gmail.com" className="contact-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 7 9-7" />
            </svg>
            sanupam2004@gmail.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="contact-grid">
          <a className="contact-link" href="https://github.com/AnupamSingh2004" target="_blank" rel="noopener noreferrer">
            <span className="lbl">Code</span>
            <span className="val">github.com/<br />AnupamSingh2004</span>
          </a>
          <a className="contact-link" href="#" target="_blank" rel="noopener noreferrer">
            <span className="lbl">Network</span>
            <span className="val">LinkedIn /<br />Anupam Singh</span>
          </a>
          <a className="contact-link" href="https://leetcode.com/sanupam2004" target="_blank" rel="noopener noreferrer">
            <span className="lbl">Grind</span>
            <span className="val">leetcode.com/<br />sanupam2004</span>
          </a>
          <a className="contact-link" href="tel:+918085734659">
            <span className="lbl">Direct</span>
            <span className="val">+91 80857<br />34659</span>
          </a>
          <a className="contact-link" href="/playground">
            <span className="lbl">AI</span>
            <span className="val">Open Playground →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
