'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { skillCategories } from '@/data/skills';

interface Props {
  activeCategory?: string | null;
}

const ALL_SKILLS = skillCategories.flatMap(cat =>
  [...cat.highlighted, ...cat.skills].map(s => ({ name: s, category: cat.name }))
);
const HIGHLIGHTED = new Set(skillCategories.flatMap(c => c.highlighted));
const CAM_POS = new THREE.Vector3(0, 0, 4.6);

function fibSphere(count: number, r: number): THREE.Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r);
  });
}

const NODE_POS = fibSphere(ALL_SKILLS.length, 1.53);

export default function SkillsGlobe({ activeCategory = null }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLCanvasElement>(null);
  const activeCatRef = useRef(activeCategory);
  const hoveredRef = useRef(-1);

  useEffect(() => { activeCatRef.current = activeCategory ?? null; }, [activeCategory]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const labelCanvas = labelRef.current;
    if (!wrap || !labelCanvas) return;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.copy(CAM_POS);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const lctx = labelCanvas.getContext('2d')!;
    let cw = 0, ch = 0;

    const sizeWrap = () => {
      const r = wrap.getBoundingClientRect();
      cw = r.width; ch = r.height;
      renderer.setSize(cw, ch, false);
      labelCanvas.width = cw;
      labelCanvas.height = ch;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    };
    sizeWrap();
    window.addEventListener('resize', sizeWrap);

    const globe = new THREE.Group();

    // Wire sphere
    const wg = new THREE.SphereGeometry(1.5, 36, 22);
    globe.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(wg, 0.1),
      new THREE.LineBasicMaterial({ color: 0xcdd6b0, transparent: true, opacity: 0.3 })
    ));

    // Solid inner
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.48, 48, 32),
      new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vN; void main(){vN=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vN; void main(){vec3 N=normalize(vN);float d=max(dot(N,normalize(vec3(.5,1.,.8))),0.);float f=pow(1.-max(dot(N,vec3(0,0,1)),0.),2.);vec3 c=mix(vec3(.09,.10,.12),vec3(.16,.18,.20),d);c+=vec3(.80,.84,.69)*f*.5;gl_FragColor=vec4(c,1.);}`,
      })
    ));

    // Skill nodes
    const count = ALL_SKILLS.length;
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);
    const szArr  = new Float32Array(count);

    NODE_POS.forEach((v, i) => {
      posArr[i*3]=v.x; posArr[i*3+1]=v.y; posArr[i*3+2]=v.z;
      colArr[i*3]=0.8; colArr[i*3+1]=0.84; colArr[i*3+2]=0.69;
      szArr[i] = HIGHLIGHTED.has(ALL_SKILLS[i].name) ? 4 : 2.5;
    });

    const nodegeo = new THREE.BufferGeometry();
    nodegeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    nodegeo.setAttribute('aColor',   new THREE.BufferAttribute(colArr, 3));
    nodegeo.setAttribute('aSize',    new THREE.BufferAttribute(szArr,  1));

    const nodemat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uPR: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize;
        varying vec3 vC; varying float vD;
        uniform float uPR;
        void main() {
          vC = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vD = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPR * (5.5 / max(-mv.z, 0.1));
        }
      `,
      fragmentShader: `
        varying vec3 vC; varying float vD;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.1, d);
          float fade = smoothstep(7.0, 4.0, vD);
          gl_FragColor = vec4(vC, a * fade);
        }
      `,
    });

    globe.add(new THREE.Points(nodegeo, nodemat));
    scene.add(globe);

    const clock = new THREE.Clock();
    let rafId: number;
    let mx = -1, my = -1;

    const onMouse = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -1; my = -1; hoveredRef.current = -1; };
    wrap.addEventListener('mousemove', onMouse);
    wrap.addEventListener('mouseleave', onLeave);

    // Reusable vectors — avoid per-frame GC
    const tmp = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    const toc = new THREE.Vector3();

    function project(local: THREE.Vector3): { x: number; y: number; visible: boolean } {
      tmp.copy(local).applyMatrix4(globe.matrixWorld);
      nrm.copy(tmp).normalize();
      toc.subVectors(CAM_POS, tmp).normalize();
      const visible = nrm.dot(toc) > 0.05;
      tmp.project(camera);
      return { x: (tmp.x + 1) / 2 * cw, y: (-tmp.y + 1) / 2 * ch, visible };
    }

    function updateColors() {
      const ac = activeCatRef.current;
      const hov = hoveredRef.current;
      const buf = nodegeo.attributes.aColor as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        if (hov === i) {
          buf.setXYZ(i, 1, 1, 0.55);
        } else if (ac === null) {
          buf.setXYZ(i, 0.8, 0.84, 0.69);
        } else if (ALL_SKILLS[i].category === ac) {
          buf.setXYZ(i, 0.776, 1.0, 0.239);
        } else {
          buf.setXYZ(i, 0.14, 0.16, 0.13);
        }
      }
      buf.needsUpdate = true;
    }

    function updateHover() {
      if (mx < 0) return;
      let nearest = -1, minD = 26;
      for (let i = 0; i < count; i++) {
        const { x, y, visible } = project(NODE_POS[i]);
        if (!visible) continue;
        const dx = x - mx, dy = y - my;
        if (dx*dx + dy*dy < minD*minD && Math.sqrt(dx*dx + dy*dy) < minD) {
          minD = Math.sqrt(dx*dx + dy*dy); nearest = i;
        }
      }
      hoveredRef.current = nearest;
    }

    function drawLabels() {
      lctx.clearRect(0, 0, cw, ch);
      const ac = activeCatRef.current;
      const hov = hoveredRef.current;

      for (let i = 0; i < count; i++) {
        const skill = ALL_SKILLS[i];
        const inActive = ac === null || skill.category === ac;
        const isHov = hov === i;
        if (!inActive && !isHov) continue;

        const { x, y, visible } = project(NODE_POS[i]);
        if (!visible) continue;

        const isHL = HIGHLIGHTED.has(skill.name);
        lctx.font = `${isHL ? '500' : '400'} ${isHL ? 10 : 9}px "Courier New", monospace`;
        lctx.fillStyle = isHov ? '#ffffff' : (ac !== null ? '#c6ff3d' : '#cdd6b0');
        lctx.globalAlpha = isHov ? 1.0 : (ac !== null ? 0.88 : 0.45);
        lctx.fillText(skill.name.toUpperCase(), x + 7, y + 4);
      }
      lctx.globalAlpha = 1;
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      globe.rotation.y = t * 0.18;
      globe.rotation.x = Math.sin(t * 0.14) * 0.08;
      globe.updateMatrixWorld(true);
      updateHover();
      updateColors();
      renderer.render(scene, camera);
      drawLabels();
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', sizeWrap);
      wrap.removeEventListener('mousemove', onMouse);
      wrap.removeEventListener('mouseleave', onLeave);
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={labelRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
}
