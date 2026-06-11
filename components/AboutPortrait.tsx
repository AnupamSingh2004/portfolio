'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function AboutPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const card = wrapRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const ctx = canvas.getContext('2d')!;
    const spacing = 20;
    let w = 0, h = 0;
    let dots: { x: number; y: number }[] = [];

    const resize = () => {
      w = card.offsetWidth;
      h = card.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      dots = [];
      for (let x = 10; x < w; x += spacing)
        for (let y = 10; y < h; y += spacing)
          dots.push({ x, y });
    };
    resize();

    let mx = -999, my = -999;
    let targetMx = -999, targetMy = -999;
    let influence = 0, targetInfluence = 0;
    let rafId: number;

    function render() {
      rafId = requestAnimationFrame(render);
      mx += (targetMx - mx) * 0.1;
      my += (targetMy - my) * 0.1;
      influence += (targetInfluence - influence) * 0.07;
      ctx.clearRect(0, 0, w, h);
      const radius = 100;
      ctx.shadowBlur = 0;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,152,106,0.28)';
        ctx.fill();
      }
      if (influence > 0.01) {
        for (const dot of dots) {
          const dx = dot.x - mx, dy = dot.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= radius) continue;
          const t = (1 - dist / radius) * influence;
          ctx.shadowBlur = t * 12;
          ctx.shadowColor = '#FF986A';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 1 + t * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,152,106,${0.28 + t * 0.72})`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      targetMx = e.clientX - r.left;
      targetMy = e.clientY - r.top;
      targetInfluence = 1;
    };
    const onLeave = () => {
      targetInfluence = 0;
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    let isVisible = false;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;
          render();
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(card);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (isVisible) {
        render();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className="about-portrait">
      {/* Dark gradient background */}
      <div className="ap-bg" />

      {/* Dot grid canvas — behind the image */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

      {/* Profile image — above the dot grid */}
      <Image
        src="/images/myself/myself-no-bg.png"
        alt="Anupam Singh"
        fill
        sizes="(max-width: 900px) 100vw, 40vw"
        style={{ objectFit: 'contain', objectPosition: 'center bottom', zIndex: 2 }}
        priority
      />

      {/* Name label */}
      <div className="ap-back-label" style={{ zIndex: 3 }}>
        <span className="ap-back-name">Anupam <em>Singh</em></span>
        <span className="ap-back-title">Software Engineer</span>
      </div>

      {/* Bottom tag */}
      <div className="tag" style={{ zIndex: 3 }}><span className="num">■</span> IDX.001 — ANUPAM SINGH — 2026</div>
    </div>
  );
}
