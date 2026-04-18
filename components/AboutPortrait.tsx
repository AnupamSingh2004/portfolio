'use client';
import { useRef, useEffect } from 'react';

export default function AboutPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const layer = layerRef.current;
    if (!card || !layer) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 22;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 22;
      layer.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => { layer.style.transform = 'translate(0,0)'; };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="about-portrait" style={{ cursor: 'crosshair' }}>
      <style>{`
        .ap-layer { transition: transform 0.18s ease-out; }
        .ap-scanline {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, #c6ff3d88 50%, transparent 100%);
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
          border-color: #c6ff3d; border-style: solid; opacity: 0.5;
        }
        .ap-corner-tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
        .ap-corner-br { bottom: 48px; right: 16px; border-width: 0 1px 1px 0; }
      `}</style>

      {/* Scanline */}
      <div className="ap-scanline" />

      {/* Corner brackets */}
      <div className="ap-corner-tl" />
      <div className="ap-corner-br" />

      <svg
        viewBox="0 0 400 500"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="por" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1a2a0d" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#c6ff3d" opacity="0.3" />
          </pattern>
        </defs>

        <rect width="400" height="500" fill="url(#por)" />
        <rect width="400" height="500" fill="url(#dots)" />

        {/* Parallax group */}
        <g ref={layerRef} className="ap-layer">

          {/* Ping rings */}
          <circle cx="200" cy="220" r="90" fill="none" stroke="#c6ff3d" strokeWidth="1">
            <animate attributeName="r" values="90;150" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.55;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="220" r="90" fill="none" stroke="#c6ff3d" strokeWidth="1">
            <animate attributeName="r" values="90;150" dur="3s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.55;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Static rings */}
          <circle cx="200" cy="220" r="90" fill="none" stroke="#c6ff3d" strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="200" cy="220" r="70" fill="none" stroke="#f5f5f0" strokeOpacity="0.2" strokeWidth="1" />
          <circle cx="200" cy="220" r="50" fill="#c6ff3d" opacity="0.12" />

          {/* Radar sweep */}
          <line x1="200" y1="220" x2="290" y2="220" stroke="#c6ff3d" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 200 220" to="360 200 220" dur="4s" repeatCount="indefinite" />
          </line>

          {/* Center text */}
          <text x="200" y="228" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="64" fill="#f5f5f0">as</text>
        </g>

        {/* Coords */}
        <g transform="translate(40,440)" fill="#8a8a85" fontFamily="Geist Mono" fontSize="10" letterSpacing="2">
          <text>LAT 23.1815</text>
          <text y="14">LON 79.9864</text>
        </g>

        {/* LIVE */}
        <text x="360" y="40" textAnchor="end" fontFamily="Geist Mono" fontSize="10" letterSpacing="2" fill="#c6ff3d">
          <tspan className="ap-live">●</tspan>
          <tspan> LIVE</tspan>
        </text>
      </svg>

      <div className="tag"><span className="num">■</span> IDX.001 — ANUPAM SINGH — 2026</div>
    </div>
  );
}
