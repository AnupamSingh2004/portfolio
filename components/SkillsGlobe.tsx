'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SkillsGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sizeWrap = () => {
      const rect = wrap.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    sizeWrap();
    window.addEventListener('resize', sizeWrap);

    const skillGlobe = new THREE.Group();

    // Wire sphere
    const wg = new THREE.SphereGeometry(1.5, 36, 22);
    const wm = new THREE.LineBasicMaterial({ color: 0xcdd6b0, transparent: true, opacity: 0.35 });
    skillGlobe.add(new THREE.LineSegments(new THREE.EdgesGeometry(wg, 0.1), wm));

    // Solid inner
    const sgeo = new THREE.SphereGeometry(1.48, 48, 32);
    const smat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          vec3 N = normalize(vNormal);
          float diff = max(dot(N, normalize(vec3(0.5, 1.0, 0.8))), 0.0);
          float f = pow(1.0 - max(dot(N, vec3(0.0,0.0,1.0)), 0.0), 2.0);
          vec3 col = mix(vec3(0.09, 0.10, 0.12), vec3(0.16, 0.18, 0.20), diff);
          col += vec3(0.80, 0.84, 0.69) * f * 0.5;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    skillGlobe.add(new THREE.Mesh(sgeo, smat));

    // Surface dots (fibonacci)
    const dc = 900;
    const dg = new THREE.BufferGeometry();
    const dp = new Float32Array(dc * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    let m = 0;
    for (let i = 0; i < dc * 3; i++) {
      const ty = 1 - 2 * (i / dc);
      const rr = Math.sqrt(1 - ty * ty);
      const th = golden * i;
      const x = Math.cos(th) * rr;
      const z = Math.sin(th) * rr;
      const mask = Math.sin(x * 5.3 + 1.1) * Math.cos(ty * 4.7 + 0.3) * Math.sin(z * 3.9 + 2.2);
      if (mask > 0.15) {
        dp[m * 3] = x * 1.51;
        dp[m * 3 + 1] = ty * 1.51;
        dp[m * 3 + 2] = z * 1.51;
        m++;
        if (m >= dc) break;
      }
    }
    dg.setAttribute('position', new THREE.BufferAttribute(dp.slice(0, m * 3), 3));
    const dmat = new THREE.PointsMaterial({
      color: 0xcdd6b0, size: 0.035, transparent: true, opacity: 0.9, depthWrite: false,
    });
    skillGlobe.add(new THREE.Points(dg, dmat));

    scene.add(skillGlobe);
    const clock = new THREE.Clock();

    let rafId: number;
    function loop() {
      rafId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      skillGlobe.rotation.y = t * 0.2;
      skillGlobe.rotation.x = Math.sin(t * 0.15) * 0.1;
      renderer.render(scene, camera);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', sizeWrap);
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }} />
  );
}
