/* === THREE.JS HERO BACKGROUND ANIMATION === */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // 1. PERFORMANCE SCALING & DEVICE CHECKS
  const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const isLowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particleCount1 = 500;
  let particleCount2 = 300;
  let particleCount3 = 200;

  if (isMobile) {
    // Mobile limit: 150 particles total
    particleCount1 = 75;
    particleCount2 = 45;
    particleCount3 = 30;
  } else if (isLowMemory) {
    // Low-spec desktop limit: 200 particles total
    particleCount1 = 100;
    particleCount2 = 60;
    particleCount3 = 40;
  }

  // 2. SETUP SCENE, RENDERER, CAMERA & FOG
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08050f, 400, 1000);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  // 3. CREATE PARTICLE SETS
  const createParticleSet = (count, colorHex, size, opacity) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      // Distribute random in space: x,y in [-400,400], z in [-200, 200]
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 800;
      const z = (Math.random() - 0.5) * 400;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Small velocities (±0.05 unități/frame)
      velocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: colorHex,
      size: size,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    return { points, velocities, count };
  };

  // Three sets of particles
  const set1 = createParticleSet(particleCount1, 0xd946ef, 1.5, 0.6); // Magenta
  const set2 = createParticleSet(particleCount2, 0x7c3aed, 1.0, 0.4); // Violet
  const set3 = createParticleSet(particleCount3, 0xf8f6ff, 0.8, 0.3); // White

  // 4. LINE CONNECTIONS SETUP (OPTIMIZED INDEX-BASED PARTICLE RETRIEVAL)
  // Calculates connections once at initialization to bypass CPU O(N^2) checks every frame.
  const connectionPairs = [];
  const maxDistance = 80;
  const positions1 = set1.points.geometry.attributes.position.array;

  for (let i = 0; i < set1.count; i++) {
    const xi = positions1[i * 3];
    const yi = positions1[i * 3 + 1];
    const zi = positions1[i * 3 + 2];

    for (let j = i + 1; j < set1.count; j++) {
      const xj = positions1[j * 3];
      const yj = positions1[j * 3 + 1];
      const zj = positions1[j * 3 + 2];

      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < maxDistance) {
        connectionPairs.push({ i, j });
      }
    }
  }

  // Create line geometries using connections list
  let lineSegments = null;
  let linePositions = null;
  let lineColors = null;

  if (connectionPairs.length > 0) {
    const lineGeometry = new THREE.BufferGeometry();
    linePositions = new Float32Array(connectionPairs.length * 2 * 3);
    lineColors = new Float32Array(connectionPairs.length * 2 * 3); // RGB

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);
  }

  // Function to update lines based on indexed moving particles
  const updateLines = () => {
    if (!lineSegments) return;

    const pArray = linePositions;
    const cArray = lineColors;
    const p1Array = set1.points.geometry.attributes.position.array;

    let index = 0;
    for (let k = 0; k < connectionPairs.length; k++) {
      const { i, j } = connectionPairs[k];

      const xi = p1Array[i * 3];
      const yi = p1Array[i * 3 + 1];
      const zi = p1Array[i * 3 + 2];

      const xj = p1Array[j * 3];
      const yj = p1Array[j * 3 + 1];
      const zj = p1Array[j * 3 + 2];

      pArray[index] = xi;
      pArray[index + 1] = yi;
      pArray[index + 2] = zi;

      pArray[index + 3] = xj;
      pArray[index + 4] = yj;
      pArray[index + 5] = zj;

      // Distance calculation to apply fade under Additive blending (brightness simulation)
      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      let brightness = 0;
      if (dist < maxDistance) {
        // Linear fade factor capped at 0.15 max opacity equivalence
        brightness = (1 - dist / maxDistance) * 0.15;
      }

      // Magenta line color (217, 70, 239) scaled by brightness
      const r = (217 / 255) * brightness;
      const g = (70 / 255) * brightness;
      const b = (239 / 255) * brightness;

      cArray[k * 6] = r;
      cArray[k * 6 + 1] = g;
      cArray[k * 6 + 2] = b;

      cArray[k * 6 + 3] = r;
      cArray[k * 6 + 4] = g;
      cArray[k * 6 + 5] = b;

      index += 6;
    }

    lineSegments.geometry.attributes.position.needsUpdate = true;
    lineSegments.geometry.attributes.color.needsUpdate = true;
  };

  // Initial line computation
  updateLines();

  // 5. INTERACTIVITY: MOUSE INTERACTION & TARGETS
  let mouseX = 0;
  let mouseY = 0;
  let targetCameraX = 0;
  let targetCameraY = 0;

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      // Map screen coordinates to range [-1, 1]
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Restrict camera movement range to ±30 units
      targetCameraX = normX * 30;
      targetCameraY = normY * 30;
    });
  }

  // 6. RESIZE HANDLER
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 7. ANIMATION LOOP
  let animationFrameId = null;
  const startTime = Date.now();

  const animateParticles = (set) => {
    const pArray = set.points.geometry.attributes.position.array;
    const v = set.velocities;

    for (let i = 0; i < set.count; i++) {
      let x = pArray[i * 3] + v[i].x;
      let y = pArray[i * 3 + 1] + v[i].y;
      let z = pArray[i * 3 + 2] + v[i].z;

      // Bounce borders: x,y [-400, 400], z [-200, 200]
      if (x < -400 || x > 400) {
        v[i].x = -v[i].x;
        x = Math.max(-400, Math.min(400, x));
      }
      if (y < -400 || y > 400) {
        v[i].y = -v[i].y;
        y = Math.max(-400, Math.min(400, y));
      }
      if (z < -200 || z > 200) {
        v[i].z = -v[i].z;
        z = Math.max(-200, Math.min(200, z));
      }

      pArray[i * 3] = x;
      pArray[i * 3 + 1] = y;
      pArray[i * 3 + 2] = z;
    }

    set.points.geometry.attributes.position.needsUpdate = true;
  };

  const renderLoop = () => {
    animationFrameId = requestAnimationFrame(renderLoop);

    const elapsed = (Date.now() - startTime) * 0.001;

    // Slow rotation around Y axis
    scene.rotation.y += 0.0003;

    // Update particles positions
    animateParticles(set1);
    animateParticles(set2);
    animateParticles(set3);

    // Update dynamic lines between moving set1 particles
    updateLines();

    // Camera slow natural oscillation (amplitude ±15)
    const oscX = Math.sin(elapsed * 0.4) * 15;
    const oscY = Math.cos(elapsed * 0.4) * 15;

    // Target position combines natural movement and mouse lerping
    const finalTargetX = oscX + targetCameraX;
    const finalTargetY = oscY + targetCameraY;

    // Linear interpolation (lerp factor 0.02)
    camera.position.x += (finalTargetX - camera.position.x) * 0.02;
    camera.position.y += (finalTargetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  // Respect user prefers-reduced-motion
  if (prefersReducedMotion) {
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  } else {
    renderLoop();
  }
});
