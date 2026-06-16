(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Poziționare și mărire (Am crescut scale-ul și offset-ul ca să încapă mai bine)
  let offset = 68;
  let scale = 1.7; // Mărite de la 1.3
  if (window.innerWidth < 768) {
    offset = 35;
    scale = 1.0; // Mărite pe mobil
    camera.position.z = 120;
  }

  // MATERIALE
  const sideMaterial = new THREE.MeshBasicMaterial({
    color: 0xd946ef, // Magenta strălucitor
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });

  const centerMaterial = new THREE.MeshBasicMaterial({
    color: 0x4c1d95, // Violet închis
    wireframe: true,
    transparent: true,
    opacity: 0.08, 
    blending: THREE.AdditiveBlending
  });

  // CONSTRUIRE LITERA D
  const dShape = new THREE.Shape();
  dShape.moveTo(-4, -10);
  dShape.lineTo(-4, 10);
  dShape.lineTo(1, 10);
  dShape.quadraticCurveTo(9, 5, 9, 0);
  dShape.quadraticCurveTo(9, -5, 1, -10);
  dShape.lineTo(-4, -10);

  // CONSTRUIRE LITERA V
  const vShape = new THREE.Shape();
  vShape.moveTo(-8, 10);
  vShape.lineTo(-2, -10);
  vShape.lineTo(2, -10);
  vShape.lineTo(8, 10);
  vShape.lineTo(4, 10);
  vShape.lineTo(0, -2);
  vShape.lineTo(-4, 10);

  const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };

  const dGeometry = new THREE.ExtrudeGeometry(dShape, extrudeSettings);
  dGeometry.center(); 
  
  const vGeometry = new THREE.ExtrudeGeometry(vShape, extrudeSettings);
  vGeometry.center();

  // CUBURI
  const centerCubeGeometry = new THREE.BoxGeometry(22, 22, 22);
  const topCubeGeometry = new THREE.BoxGeometry(14, 14, 14); // Cubul mai mic de sus

  // Creare Mesh-uri
  const leftMesh = new THREE.Mesh(dGeometry, sideMaterial);
  leftMesh.position.x = -offset;
  leftMesh.scale.set(scale, scale, scale);
  scene.add(leftMesh);

  const rightMesh = new THREE.Mesh(vGeometry, sideMaterial);
  rightMesh.position.x = offset;
  rightMesh.scale.set(scale, scale, scale);
  scene.add(rightMesh);

  const centerMesh = new THREE.Mesh(centerCubeGeometry, centerMaterial);
  centerMesh.position.set(0, 0, -20);
  centerMesh.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
  scene.add(centerMesh);

  const topCubeMesh = new THREE.Mesh(topCubeGeometry, sideMaterial);
  topCubeMesh.position.set(0, 38, -10); // Așezat deasupra textului
  scene.add(topCubeMesh);

  // Logica Mouse (Parallax)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotații
    leftMesh.rotation.x += 0.003;
    leftMesh.rotation.y += 0.005;
    
    rightMesh.rotation.x += 0.004;
    rightMesh.rotation.y += 0.003;
    
    centerMesh.rotation.x += 0.002;
    centerMesh.rotation.y += 0.002;

    topCubeMesh.rotation.x -= 0.003;
    topCubeMesh.rotation.y -= 0.005;

    // Mișcare lină după mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05; 

    leftMesh.position.x = -offset + targetX * 0.3;
    leftMesh.position.y = -targetY * 0.3;
    
    rightMesh.position.x = offset + targetX * 0.3;
    rightMesh.position.y = -targetY * 0.3;

    centerMesh.position.x = targetX * 0.1;
    centerMesh.position.y = -targetY * 0.1;

    topCubeMesh.position.x = targetX * 0.2;
    topCubeMesh.position.y = 38 - targetY * 0.2; // Parallax pe Y având baza la 38

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
})();
