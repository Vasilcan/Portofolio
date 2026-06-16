(function () {
  // Protecție pentru utilizatorii care preferă mișcare redusă
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  // Inițializare Scenă
  const scene = new THREE.Scene();
  
  // Cameră
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 120;

  // Renderer cu fundal transparent
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Sistem de scalare și distanțare pentru ecrane de telefon vs PC
  let offset = 65; // Distanța stânga-dreapta
  let scale = 1;
  if (window.innerWidth < 768) {
    offset = 35;
    scale = 0.6;
    camera.position.z = 140;
  }

  // MATERIALE
  // 1. Material pentru marginile laterale (Strălucitor, Magenta)
  const sideMaterial = new THREE.MeshBasicMaterial({
    color: 0xd946ef,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });

  // 2. Material pentru centru (Foarte subtil, Violet închis, nu strică textul)
  const centerMaterial = new THREE.MeshBasicMaterial({
    color: 0x4c1d95,
    wireframe: true,
    transparent: true,
    opacity: 0.07, // Opacitate extrem de mică
    blending: THREE.AdditiveBlending
  });

  // GEOMETRII
  const sideGeometry = new THREE.TorusKnotGeometry(20 * scale, 6 * scale, 100, 16);
  const centerGeometry = new THREE.TorusKnotGeometry(28 * scale, 8 * scale, 120, 16);

  // MESH-URI (Obiectele)
  const leftMesh = new THREE.Mesh(sideGeometry, sideMaterial);
  leftMesh.position.x = -offset;
  scene.add(leftMesh);

  const rightMesh = new THREE.Mesh(sideGeometry, sideMaterial);
  rightMesh.position.x = offset;
  scene.add(rightMesh);

  const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
  centerMesh.position.x = 0;
  centerMesh.position.z = -25; // Împins în spate
  scene.add(centerMesh);

  // Logica de urmărire a mouse-ului
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // Bucla de Animație (Render Loop)
  function animate() {
    requestAnimationFrame(animate);

    // Rotații individuale pentru dinamism
    leftMesh.rotation.x += 0.003; 
    leftMesh.rotation.y += 0.004;
    
    rightMesh.rotation.x -= 0.003; 
    rightMesh.rotation.y -= 0.004;
    
    centerMesh.rotation.x += 0.001; 
    centerMesh.rotation.y += 0.002;

    // Parallax
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    leftMesh.position.x = -offset + targetX * 0.4;
    leftMesh.position.y = -targetY * 0.4;
    
    rightMesh.position.x = offset + targetX * 0.4;
    rightMesh.position.y = -targetY * 0.4;

    // Centrul se mișcă mai puțin pentru a păstra focalizarea
    centerMesh.position.x = targetX * 0.15;
    centerMesh.position.y = -targetY * 0.15;

    renderer.render(scene, camera);
  }

  // Redimensionare automată
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
})();
