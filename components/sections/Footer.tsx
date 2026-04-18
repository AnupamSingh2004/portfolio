'use client';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [time, setTime] = useState('00:00 UTC');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      setTime(`${h}:${m} UTC`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer>
      <span>© 2026 · Anupam Singh · All rights reserved</span>
      <span id="foot-time">{time}</span>
      <span>Built with <span style={{ color: 'var(--accent)' }}>♥</span> · Three.js</span>
    </footer>
  );
}
