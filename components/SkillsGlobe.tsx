'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { skillCategories } from '@/data/skills';
import {
  siGo, siTypescript, siPython, siDart, siCplusplus, siOpenjdk, siJavascript, siC,
  siGnubash, siNextdotjs, siReact, siFlutter, siNodedotjs, siExpress, siDjango,
  siDocker, siKubernetes, siTerraform, siGooglecloud, siAnsible, siJenkins,
  siGithubactions, siApachemaven, siGit, siPostgresql, siRedis, siMysql, siMongodb,
  siPrometheus, siGrafana, siTensorflow, siOllama, siPostman,
} from 'simple-icons';

interface Props {
  activeCategory?: string | null;
}

// Map skill names to simple-icons path data (all have 24x24 viewBox)
const ICON_PATHS: Record<string, string> = {
  'Go': siGo.path,
  'TypeScript': siTypescript.path,
  'Python': siPython.path,
  'Dart': siDart.path,
  'C++': siCplusplus.path,
  'Java': siOpenjdk.path,
  'JavaScript': siJavascript.path,
  'C': siC.path,
  'Bash': siGnubash.path,
  'Next.js': siNextdotjs.path,
  'React': siReact.path,
  'Flutter': siFlutter.path,
  'Node.js': siNodedotjs.path,
  'Express': siExpress.path,
  'Django': siDjango.path,
  'DRF': siDjango.path,
  'Docker': siDocker.path,
  'Kubernetes': siKubernetes.path,
  'Terraform': siTerraform.path,
  'GCP': siGooglecloud.path,
  'Ansible': siAnsible.path,
  'Jenkins': siJenkins.path,
  'GH Actions': siGithubactions.path,
  'Maven': siApachemaven.path,
  'Git': siGit.path,
  'PostgreSQL': siPostgresql.path,
  'Redis': siRedis.path,
  'MySQL': siMysql.path,
  'MongoDB': siMongodb.path,
  'Prometheus': siPrometheus.path,
  'Grafana': siGrafana.path,
  'TensorFlow': siTensorflow.path,
  'Ollama': siOllama.path,
  'Postman': siPostman.path,
};

const ALL_SKILLS = skillCategories.flatMap(cat =>
  [...cat.highlighted, ...cat.skills].map(s => ({ name: s, category: cat.name }))
);
const HIGHLIGHTED = new Set(skillCategories.flatMap(c => c.highlighted));

function fibSphere(count: number, r: number): THREE.Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r);
  });
}

const NODE_POS = fibSphere(ALL_SKILLS.length, 1.52);
const CAM_POS = new THREE.Vector3(0, 0, 4.6);

function makeIconTexture(name: string, size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const pathData = ICON_PATHS[name];
  if (pathData) {
    const path = new Path2D(pathData);
    ctx.save();
    // Scale from 24x24 viewBox to canvas size with padding
    const pad = size * 0.12;
    const s = (size - pad * 2) / 24;
    ctx.translate(pad, pad);
    ctx.scale(s, s);
    ctx.fillStyle = 'white';
    ctx.fill(path);
    ctx.restore();
  } else {
    // Text fallback for skills without icons (AWS, Azure, SQL, REST, etc.)
    const abbr = name.substring(0, 3).toUpperCase();
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.28}px "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(abbr, size / 2, size / 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function SkillsGlobe({ activeCategory = null }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const activeCatRef = useRef(activeCategory);
  const hoveredRef = useRef(-1);

  useEffect(() => { activeCatRef.current = activeCategory ?? null; }, [activeCategory]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.copy(CAM_POS);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let cw = 0, ch = 0;
    const sizeWrap = () => {
      const r = wrap.getBoundingClientRect();
      cw = r.width; ch = r.height;
      renderer.setSize(cw, ch, false);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    };
    sizeWrap();
    window.addEventListener('resize', sizeWrap);

    const globe = new THREE.Group();

    // Sparse grid sphere — dots + connecting edges, no solid fill
    const wg = new THREE.SphereGeometry(1.5, 20, 14);
    // Dots at each vertex
    globe.add(new THREE.Points(
      wg,
      new THREE.PointsMaterial({ color: 0xcdd6b0, size: 0.028, transparent: true, opacity: 0.55, sizeAttenuation: true })
    ));
    // Thin connecting lines
    globe.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(wg),
      new THREE.LineBasicMaterial({ color: 0xcdd6b0, transparent: true, opacity: 0.12 })
    ));

    // Build sprites
    const count = ALL_SKILLS.length;
    const sprites: THREE.Sprite[] = [];
    const textures: THREE.CanvasTexture[] = [];

    const COL_DEFAULT = new THREE.Color(0.78, 0.82, 0.72);
    const COL_ACTIVE  = new THREE.Color(0.776, 1.0, 0.239);
    const COL_HOVERED = new THREE.Color(1.0, 1.0, 0.6);
    const COL_DIM     = new THREE.Color(0.10, 0.12, 0.09);

    for (let i = 0; i < count; i++) {
      const skill = ALL_SKILLS[i];
      const tex = makeIconTexture(skill.name);
      textures.push(tex);

      const mat = new THREE.SpriteMaterial({
        map: tex,
        color: COL_DEFAULT,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const sprite = new THREE.Sprite(mat);
      const pos = NODE_POS[i];
      sprite.position.copy(pos);

      const baseScale = HIGHLIGHTED.has(skill.name) ? 0.24 : 0.17;
      sprite.scale.setScalar(baseScale);
      sprite.userData = { baseScale };

      globe.add(sprite);
      sprites.push(sprite);
    }

    scene.add(globe);

    const timer = new THREE.Timer();
    let rafId: number;
    let mx = -1, my = -1;

    const onMouse = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -1; my = -1; hoveredRef.current = -1; };
    wrap.addEventListener('mousemove', onMouse);
    wrap.addEventListener('mouseleave', onLeave);

    // Reusable vectors
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

    function updateHover() {
      if (mx < 0) return;
      let nearest = -1, minD = 30;
      for (let i = 0; i < count; i++) {
        const { x, y, visible } = project(NODE_POS[i]);
        if (!visible) continue;
        const dx = x - mx, dy = y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minD) { minD = d; nearest = i; }
      }
      hoveredRef.current = nearest;
    }

    function updateSprites() {
      const ac = activeCatRef.current;
      const hov = hoveredRef.current;
      for (let i = 0; i < count; i++) {
        const sprite = sprites[i];
        const mat = sprite.material as THREE.SpriteMaterial;
        const skill = ALL_SKILLS[i];
        const base = sprite.userData.baseScale as number;

        if (hov === i) {
          mat.color.copy(COL_HOVERED);
          mat.opacity = 1.0;
          sprite.scale.setScalar(base * 1.45);
        } else if (ac === null) {
          mat.color.copy(COL_DEFAULT);
          mat.opacity = 0.72;
          sprite.scale.setScalar(base);
        } else if (skill.category === ac) {
          mat.color.copy(COL_ACTIVE);
          mat.opacity = 1.0;
          sprite.scale.setScalar(base * 1.2);
        } else {
          mat.color.copy(COL_DIM);
          mat.opacity = 0.18;
          sprite.scale.setScalar(base * 0.85);
        }
        mat.needsUpdate = true;
      }
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      timer.update();
      const t = timer.getElapsed();
      globe.rotation.y = t * 0.18;
      globe.rotation.x = Math.sin(t * 0.14) * 0.08;
      globe.updateMatrixWorld(true);
      updateHover();
      updateSprites();
      renderer.render(scene, camera);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', sizeWrap);
      wrap.removeEventListener('mousemove', onMouse);
      wrap.removeEventListener('mouseleave', onLeave);
      textures.forEach(t => t.dispose());
      sprites.forEach(s => (s.material as THREE.SpriteMaterial).dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
  );
}
