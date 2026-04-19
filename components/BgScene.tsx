'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BgScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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

      const docH = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = scrollYVal / docH;

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

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
