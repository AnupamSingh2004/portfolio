'use client';
import { useEffect, useState } from 'react';

const R = 22;
const CIRC = 2 * Math.PI * R;

export default function ScrollTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? scrolled / max : 0);
      setVisible(scrolled > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const dash = CIRC * progress;

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`scroll-top${visible ? ' visible' : ''}`}
    >
      <svg width="56" height="56" viewBox="0 0 56 56">
        {/* Track */}
        <circle
          cx="28" cy="28" r={R}
          fill="none"
          stroke="rgba(187,224,239,0.12)"
          strokeWidth="1.5"
        />
        {/* Progress arc */}
        <circle
          cx="28" cy="28" r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ transition: 'stroke-dasharray 0.1s linear' }}
        />
        {/* Arrow up */}
        <path
          d="M28 34 L28 22 M22 28 L28 22 L34 28"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
