/**
 * DirecTokunbo - Three.js Hero Particle System
 * Gold particle field with mouse-reactive rotation
 */

import * as THREE from 'three';

export function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Setup renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  // Particle count — kept intentionally low so they're a subtle bg accent
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 300 : 900;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const gold = new THREE.Color('#f6cb12');
  const dimGold = new THREE.Color('#d4a900');
  const white = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    // Spread across a wide volume
    positions[i * 3]     = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    // Vary color: mostly dim gold, some bright gold, few white
    const r = Math.random();
    const c = r < 0.6 ? dimGold.clone() : r < 0.9 ? gold.clone() : white.clone();
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Vary particle sizes
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.018,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Secondary smaller particle layer for depth
  const count2 = isMobile ? 100 : 300;
  const positions2 = new Float32Array(count2 * 3);
  for (let i = 0; i < count2; i++) {
    positions2[i * 3]     = (Math.random() - 0.5) * 20;
    positions2[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions2[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const geo2 = new THREE.BufferGeometry();
  geo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  const mat2 = new THREE.PointsMaterial({
    size: 0.008,
    color: '#f6cb12',
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles2 = new THREE.Points(geo2, mat2);
  scene.add(particles2);

  // Mouse tracking
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const onMouseMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 0.3;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Touch support
  const onTouchMove = (e) => {
    targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.3;
    targetY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 0.2;
  };
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Animation loop
  let animFrame;
  let elapsed = 0;
  let lastTime = performance.now();

  function animate() {
    animFrame = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    elapsed += delta;

    // Smooth mouse follow
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    // Slow organic rotation + mouse offset
    particles.rotation.y  = elapsed * 0.025 + currentX * 0.8;
    particles.rotation.x  = elapsed * 0.015 + currentY * 0.5;
    particles2.rotation.y = elapsed * 0.015 + currentX * 0.4;
    particles2.rotation.x = elapsed * 0.010 + currentY * 0.25;

    // Gentle float on Y axis
    particles.position.y = Math.sin(elapsed * 0.3) * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // Cleanup
  return () => {
    cancelAnimationFrame(animFrame);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('resize', onResize);
    geometry.dispose();
    material.dispose();
    geo2.dispose();
    mat2.dispose();
    renderer.dispose();
  };
}
