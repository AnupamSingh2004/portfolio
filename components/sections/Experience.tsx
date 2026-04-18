import { experiences } from '@/data/experience';

export default function Experience() {
  return (
    <section id="work">
      <div className="container">
        <div className="section-label"><span className="num">02</span> Selected Experience</div>
        <h2 className="section-title reveal">Where I&apos;ve <em>built</em>.</h2>

        <div className="exp-list">
          {experiences.map((exp) => (
            <div key={exp.company} className="exp-item reveal">
              <div className="exp-date">{exp.period}</div>
              <div className="exp-role">
                {exp.role} <span className="co">{exp.company}</span>
              </div>
              <div className="exp-desc">
                <ul>
                  {exp.bulletPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="exp-tags">
                {exp.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
