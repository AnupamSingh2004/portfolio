'use client';
import { useEffect, useState } from 'react';

function scrollTo(id: string) {
  const el = id === 'top' ? document.documentElement : document.getElementById(id);
  if (!el) return;
  const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <nav className={`top${scrolled ? ' scrolled' : ''}`}>
      <a href="#top" className="brand" onClick={e => handleNav(e, 'top')}>Anupam<em>*</em></a>
      <div className="links">
        <a href="#about" data-num="01" onClick={e => handleNav(e, 'about')}>About</a>
        <a href="#work" data-num="02" onClick={e => handleNav(e, 'work')}>Work</a>
        <a href="#projects" data-num="03" onClick={e => handleNav(e, 'projects')}>Projects</a>
        <a href="#stack" data-num="04" onClick={e => handleNav(e, 'stack')}>Stack</a>
        <a href="#contact" data-num="05" onClick={e => handleNav(e, 'contact')}>Contact</a>
      </div>
      <div className="status">Available · IN</div>
    </nav>
  );
}
