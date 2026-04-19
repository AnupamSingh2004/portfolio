import AboutPortrait from '@/components/AboutPortrait';

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-label"><span className="num">01</span> About</div>
        <h2 className="section-title reveal">The <em>person</em> behind the code.</h2>
        <div className="about-grid">
          <AboutPortrait />

          <div className="about-body reveal" style={{ paddingTop: '160px' }}>
            <p>
              I&apos;m a computer science undergraduate who treats <em>systems thinking </em>     like
              a craft  designing backends that don&apos;t break under load, deploying infrastructure
              that self-heals, and shipping products people actually use.
            </p>
            <p>
              <span>At Orkait I architect Go services on AWS with goroutines, channels, and a
              distaste for flaky pipelines. On Upwork I&apos;ve delivered Full-Stack platforms
              for international clients, 60% less manual toil.</span>
            </p>
            <p>
              I believe the best engineering <em>looks</em> boring and <em>feels </em> effortless.
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
