'use client';
import { useRef, useEffect } from 'react';

export default function AboutPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!card || !canvas || !layer) return;

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

    // Lerped values
    let mx = -999, my = -999;
    let targetMx = -999, targetMy = -999;
    let influence = 0, targetInfluence = 0;
    let rafId: number;

    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth lerp
      mx += (targetMx - mx) * 0.1;
      my += (targetMy - my) * 0.1;
      influence += (targetInfluence - influence) * 0.07;

      ctx.clearRect(0, 0, w, h);

      const radius = 100;

      // Base dots pass
      ctx.shadowBlur = 0;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,152,106,0.28)';
        ctx.fill();
      }

      // Glow pass — only dots near cursor
      if (influence > 0.01) {
        for (const dot of dots) {
          const dx = dot.x - mx;
          const dy = dot.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= radius) continue;

          const t = (1 - dist / radius) * influence;
          const size = 1 + t * 3;
          const alpha = 0.28 + t * 0.72;

          ctx.shadowBlur = t * 12;
          ctx.shadowColor = '#FF986A';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,152,106,${alpha})`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };
    render();

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      targetMx = e.clientX - r.left;
      targetMy = e.clientY - r.top;
      targetInfluence = 1;
      // Parallax on SVG layer
      const px = ((e.clientX - r.left) / r.width - 0.5) * 22;
      const py = ((e.clientY - r.top) / r.height - 0.5) * 22;
      layer.style.transform = `translate(${px}px, ${py}px)`;
    };
    const onLeave = () => {
      targetInfluence = 0;
      layer.style.transform = 'translate(0,0)';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={cardRef} className="about-portrait" style={{ cursor: 'crosshair' }}>
      <style>{`
        .ap-layer { transition: transform 0.18s ease-out; }
        .ap-scanline {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, #FF986A88 50%, transparent 100%);
          pointer-events: none;
          animation: ap-scan 6s linear infinite;
        }
        @keyframes ap-scan {
          0%   { top: 0%;   opacity: 0; }
          4%   { opacity: 0.7; }
          96%  { opacity: 0.25; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes ap-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .ap-live { animation: ap-blink 1.4s step-end infinite; }
        .ap-corner-tl, .ap-corner-br {
          position: absolute; width: 14px; height: 14px;
          border-color: #FF986A; border-style: solid; opacity: 0.5;
        }
        .ap-corner-tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
        .ap-corner-br { bottom: 48px; right: 16px; border-width: 0 1px 1px 0; }
      `}</style>

      {/* Scanline */}
      <div className="ap-scanline" />

      {/* Corner brackets */}
      <div className="ap-corner-tl" />
      <div className="ap-corner-br" />

      {/* Background gradient */}
      <svg viewBox="0 0 400 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="por" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0d1848" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#por)" />
      </svg>

      {/* Interactive dots canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Circles + radar + text on top */}
      <svg viewBox="0 0 400 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        <g ref={layerRef} className="ap-layer">
          {/* Ping rings */}
          <circle cx="200" cy="220" r="90" fill="none" stroke="#FF986A" strokeWidth="1">
            <animate attributeName="r" values="90;150" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.55;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="220" r="90" fill="none" stroke="#FF986A" strokeWidth="1">
            <animate attributeName="r" values="90;150" dur="3s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.55;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Static rings */}
          <circle cx="200" cy="220" r="90" fill="none" stroke="#FF986A" strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="200" cy="220" r="70" fill="none" stroke="#f5f5f0" strokeOpacity="0.2" strokeWidth="1" />
          <circle cx="200" cy="220" r="50" fill="#FF986A" opacity="0.12" />

          {/* Radar sweep */}
          <line x1="200" y1="220" x2="290" y2="220" stroke="#FF986A" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 200 220" to="360 200 220" dur="4s" repeatCount="indefinite" />
          </line>

          <text x="200" y="220" textAnchor="middle" dominantBaseline="central" fontFamily="Instrument Serif" fontStyle="italic" fontSize="64" fill="#f5f5f0">DEV</text>
        </g>

        <g transform="translate(40,440)" fill="#8a8a85" fontFamily="Geist Mono" fontSize="10" letterSpacing="2">
          <text>LAT 23.1815</text>
          <text y="14">LON 79.9864</text>
        </g>

        <text x="360" y="40" textAnchor="end" fontFamily="Geist Mono" fontSize="10" letterSpacing="2" fill="#FF986A">
          <tspan className="ap-live">●</tspan>
          <tspan> LIVE</tspan>
        </text>
      </svg>

      <div className="tag"><span className="num">■</span> IDX.001 — ANUPAM SINGH — 2026</div>
    </div>
  );
}
