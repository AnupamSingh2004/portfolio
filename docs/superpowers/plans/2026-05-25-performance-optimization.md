# Performance Optimization — Visibility-Gated RAF Loops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pause all Three.js and Canvas 2D animation loops when their content is off-screen or the browser tab is hidden, eliminating simultaneous-renderer lag without changing any visual output.

**Architecture:** Three targeted edits — one per animated component. Each adds an `IntersectionObserver` to gate its RAF loop and a `visibilitychange` listener to suspend all GPU work when the tab is backgrounded. BgScene additionally caches a DOM read that currently happens inside the hot path and lowers the pixel ratio cap.

**Tech Stack:** Next.js 16, React 19, Three.js 0.184, native browser APIs (`IntersectionObserver`, `document.visibilitychange`, `requestAnimationFrame`).

---

### Task 1: Optimise BgScene.tsx

**Files:**
- Modify: `components/BgScene.tsx`

The `BgScene` component runs a full-screen Three.js scene every frame. Three fixes:

1. `document.body.scrollHeight` is read inside the RAF callback (~60×/sec). Cache it and refresh only on `resize`.
2. `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — lower cap to `1.5`.
3. Suspend the loop on `visibilitychange` (hidden → `cancelAnimationFrame`; visible → restart).

- [ ] **Step 1: Apply all three BgScene fixes**

Replace the relevant section of `components/BgScene.tsx`. The full updated `useEffect` body:

```tsx
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // was 2
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const clock = new THREE.Clock();

  // --- Particle field ---
  const count = 600;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random() * 1.5 + 0.3;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const particleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      uniform float uPixelRatio;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * uPixelRatio * (200.0 / -mv.z);
      }
    `,
    fragmentShader: `
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * 0.35;
        gl_FragColor = vec4(0.91, 0.91, 0.87, a);
      }
    `,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // --- Wireframe globe ---
  const globeGroup = new THREE.Group();
  const globeRadius = 2.4;

  const wireGeo = new THREE.SphereGeometry(globeRadius, 40, 24);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x7aaac4, transparent: true, opacity: 0.22 });
  globeGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo, 0.1), wireMat));

  const solidGeo = new THREE.SphereGeometry(globeRadius * 0.98, 48, 32);
  const solidMat = new THREE.ShaderMaterial({
    transparent: true,
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
        float diff = max(dot(N, normalize(vec3(0.4, 1.0, 0.8))), 0.0);
        float f = pow(1.0 - max(dot(N, vec3(0.0,0.0,1.0)), 0.0), 2.5);
        vec3 col = mix(vec3(0.102, 0.184, 0.431), vec3(0.13, 0.22, 0.55), diff);
        col += vec3(1.0, 0.596, 0.416) * f * 0.35;
        gl_FragColor = vec4(col, 0.9);
      }
    `,
  });
  globeGroup.add(new THREE.Mesh(solidGeo, solidMat));

  // Surface dots (fibonacci distribution)
  const dotCount = 1400;
  const dotGeo = new THREE.BufferGeometry();
  const dotPos = new Float32Array(dotCount * 3);
  const dotSize = new Float32Array(dotCount);
  const golden = Math.PI * (3 - Math.sqrt(5));
  let k = 0;
  for (let i = 0; i < dotCount * 3; i++) {
    const t = i / dotCount;
    const y = 1 - 2 * t;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const mask = Math.sin(x * 5.3 + 1.1) * Math.cos(y * 4.7 + 0.3) * Math.sin(z * 3.9 + 2.2);
    if (mask > 0.15) {
      dotPos[k * 3]     = x * globeRadius * 1.005;
      dotPos[k * 3 + 1] = y * globeRadius * 1.005;
      dotPos[k * 3 + 2] = z * globeRadius * 1.005;
      dotSize[k] = 1.2 + Math.random() * 1.0;
      k++;
      if (k >= dotCount) break;
    }
  }
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos.slice(0, k * 3), 3));
  dotGeo.setAttribute('size', new THREE.BufferAttribute(dotSize.slice(0, k), 1));
  const dotMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader: `
      attribute float size;
      uniform float uPixelRatio;
      varying float vDepth;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * uPixelRatio;
      }
    `,
    fragmentShader: `
      varying float vDepth;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        float fade = smoothstep(13.0, 7.0, vDepth);
        gl_FragColor = vec4(0.733, 0.878, 0.937, a * fade * 0.8);
      }
    `,
  });
  globeGroup.add(new THREE.Points(dotGeo, dotMat));

  // Halo ring
  const ringGeo = new THREE.RingGeometry(globeRadius * 1.25, globeRadius * 1.27, 128);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x7aaac4, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.45;
  globeGroup.add(ring);

  globeGroup.position.set(4.2, 0.2, 0);
  globeGroup.rotation.z = -0.15;
  scene.add(globeGroup);

  // Mouse / scroll tracking
  let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
  let scrollYVal = 0, targetScrollY = 0;
  // Cache scrollable height — refreshed on resize, not every frame
  let docScrollH = Math.max(1, document.body.scrollHeight - window.innerHeight);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    docScrollH = Math.max(1, document.body.scrollHeight - window.innerHeight);
  };
  const onMouse = (e: MouseEvent) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onScroll = () => { targetScrollY = window.scrollY; };

  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouse);
  window.addEventListener('scroll', onScroll, { passive: true });

  let rafId: number;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollYVal += (targetScrollY - scrollYVal) * 0.08;

    const progress = scrollYVal / docScrollH; // uses cached value

    particles.rotation.y = t * 0.01;
    particles.rotation.x = mouseY * 0.05;

    globeGroup.rotation.y = t * 0.08 + mouseX * 0.15;
    globeGroup.rotation.x = mouseY * 0.08 - 0.1;
    const gx = 4.2 - progress * 8;
    const gy = 0.2 - Math.sin(progress * 3.5) * 0.8;
    const gz = -progress * 3;
    globeGroup.position.set(gx, gy, gz);
    globeGroup.scale.setScalar(1 - progress * 0.2);

    camera.position.x = mouseX * 0.25;
    camera.position.y = -mouseY * 0.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouse);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.dispose();
  };
}, []);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/anupam/code/Portfolio/portfolio-next && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/BgScene.tsx
git commit -m "perf: cache scrollHeight + lower pixelRatio cap + tab visibility gate in BgScene"
```

---

### Task 2: Optimise SkillsGlobe.tsx

**Files:**
- Modify: `components/SkillsGlobe.tsx`

Two fixes:
1. `IntersectionObserver` on the wrapper div — stop the RAF loop when the Stack section scrolls off screen, restart when it comes back.
2. `mouseMoved` dirty flag — `updateHover()` (which iterates all sprites for projection) only runs when the mouse has actually moved since the last frame.

- [ ] **Step 1: Apply SkillsGlobe fixes**

Replace the full `useEffect` (the second one, starting at line 113) in `components/SkillsGlobe.tsx` with:

```tsx
useEffect(() => {
  const wrap = wrapRef.current;
  if (!wrap) return;

  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.copy(CAM_POS);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

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

  const wg = new THREE.SphereGeometry(1.5, 20, 14);
  globe.add(new THREE.Points(
    wg,
    new THREE.PointsMaterial({ color: 0x7aaac4, size: 0.028, transparent: true, opacity: 0.55, sizeAttenuation: true })
  ));
  globe.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(wg),
    new THREE.LineBasicMaterial({ color: 0x7aaac4, transparent: true, opacity: 0.12 })
  ));

  const count = ALL_SKILLS.length;
  const sprites: THREE.Sprite[] = [];
  const textures: THREE.CanvasTexture[] = [];

  const COL_DEFAULT = new THREE.Color(0.733, 0.878, 0.937);
  const COL_ACTIVE  = new THREE.Color(1.0, 0.596, 0.416);
  const COL_HOVERED = new THREE.Color(1.0, 0.82, 0.72);
  const COL_DIM     = new THREE.Color(0.086, 0.118, 0.329);

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
  let mouseMoved = false; // dirty flag

  const onMouse = (e: MouseEvent) => {
    const r = wrap.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
    mouseMoved = true;
  };
  const onLeave = () => { mx = -1; my = -1; hoveredRef.current = -1; mouseMoved = true; };
  wrap.addEventListener('mousemove', onMouse);
  wrap.addEventListener('mouseleave', onLeave);

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
    if (mouseMoved) {
      updateHover();
      mouseMoved = false;
    }
    updateSprites();
    renderer.render(scene, camera);
  }

  let isVisible = false;

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        loop();
      } else if (!entry.isIntersecting && isVisible) {
        isVisible = false;
        cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0.05 }
  );
  io.observe(wrap);

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else if (isVisible) {
      loop();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    window.removeEventListener('resize', sizeWrap);
    wrap.removeEventListener('mousemove', onMouse);
    wrap.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    textures.forEach(t => t.dispose());
    sprites.forEach(s => (s.material as THREE.SpriteMaterial).dispose());
    renderer.dispose();
    canvas.remove();
  };
}, []);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/anupam/code/Portfolio/portfolio-next && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/SkillsGlobe.tsx
git commit -m "perf: gate SkillsGlobe RAF on viewport visibility + mouseMoved dirty flag"
```

---

### Task 3: Optimise AboutPortrait.tsx

**Files:**
- Modify: `components/AboutPortrait.tsx`

The dot-grid canvas RAF loop currently runs from mount to unmount regardless of scroll position. Add `IntersectionObserver` on the card wrapper to pause/resume it, and add `visibilitychange` to suspend it when the tab is hidden.

- [ ] **Step 1: Apply AboutPortrait fixes**

Replace the `useEffect` body in `components/AboutPortrait.tsx` (the main render/event-listener effect starting at line 9):

```tsx
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

  const render = () => {
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
  };

  const onMove = (e: MouseEvent) => {
    const r = card.getBoundingClientRect();
    targetMx = e.clientX - r.left;
    targetMy = e.clientY - r.top;
    targetInfluence = 1;
  };
  const onLeave = () => { targetInfluence = 0; };

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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/anupam/code/Portfolio/portfolio-next && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/AboutPortrait.tsx
git commit -m "perf: gate AboutPortrait canvas RAF on viewport visibility + tab visibility"
```

---

### Task 4: Final verification

- [ ] **Step 1: Full TypeScript check**

```bash
cd /home/anupam/code/Portfolio/portfolio-next && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 2: Build check**

```bash
cd /home/anupam/code/Portfolio/portfolio-next && npm run build
```
Expected: build succeeds, no warnings about the modified files

- [ ] **Step 3: Manual smoke test**

Run `npm run dev`, open the site, and verify:
- Background particles and globe still animate on the hero section
- Scrolling to the About section starts the dot-grid canvas (check DevTools Performance tab — RAF should be idle before reaching About)
- Scrolling to the Stack section starts the SkillsGlobe
- Hovering skills still highlights them on the globe
- Switching to another browser tab and back — no console errors, animations resume correctly
