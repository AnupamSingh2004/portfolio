'use client';
import dynamic from 'next/dynamic';
import { skillCategories } from '@/data/skills';

const SkillsGlobe = dynamic(() => import('@/components/SkillsGlobe'), { ssr: false });

export default function Stack() {
  return (
    <section id="stack">
      <div className="container">
        <div className="section-label"><span className="num">04</span> The Stack</div>
        <h2 className="section-title reveal">Tools of the <em>trade</em>.</h2>

        <div className="skills-wrap">
          <div className="skills-3d" id="skills-3d-wrap">
            <div className="overlay">
              <span>TOPOLOGY / ICOSAHEDRON.4K</span>
              <span className="live">● RENDERING</span>
            </div>
            <SkillsGlobe />
          </div>

          <div className="skills-cats">
            {skillCategories.map((cat) => (
              <div key={cat.name} className="skill-cat">
                <div className="skill-cat-head">
                  <div className="skill-cat-name">{cat.name}</div>
                  <div className="skill-cat-num">{cat.count}</div>
                </div>
                <div className="skill-items">
                  {cat.highlighted.map((s) => <span key={s} className="hl">{s}</span>)}
                  {cat.skills.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
