// 3D stream scene behind hero
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const container = document.getElementById("hero3d");
  if (!container || reduced || !window.THREE) return;

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d1015, 10, 40);

  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 6, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambient = new THREE.AmbientLight(0x88aaff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 10, 5);
  dir.castShadow = true;
  scene.add(dir);
  const hemi = new THREE.HemisphereLight(0x88ccff, 0x445522, 0.5);
  scene.add(hemi);

  // Ground (grass)
  const groundGeo = new THREE.PlaneGeometry(40, 40, 20, 20);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a7d44, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Water plane with animated shader
  const waterGeo = new THREE.PlaneGeometry(8, 24, 32, 64);
  const waterMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x1e90ff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElev;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.x * 2.0 + uTime * 2.0) * 0.15 + sin(pos.y * 1.5 + uTime * 1.5) * 0.1;
        pos.z += wave;
        vElev = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      varying float vElev;
      void main() {
        vec3 col = uColor + vec3(0.1) * vElev;
        float alpha = 0.75;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.15, 0);
  scene.add(water);

  // Rocks
  const rockGeo = new THREE.DodecahedronGeometry(0.6, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 });
  for (let i = 0; i < 12; i++) {
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set((Math.random()-0.5)*8, 0.3, (Math.random()-0.5)*20);
    rock.scale.setScalar(0.5 + Math.random()*1.2);
    rock.castShadow = true;
    scene.add(rock);
  }

  // Trees (low-poly cones)
  const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 1.2, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e });
  const leafGeo = new THREE.ConeGeometry(0.8, 1.8, 6);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x14532d });
  for (let i = 0; i < 14; i++) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.6;
    trunk.castShadow = true;
    tree.add(trunk);
    const leaves = new THREE.Mesh(leafGeo, leafMat);
    leaves.position.y = 2.2;
    leaves.castShadow = true;
    tree.add(leaves);
    tree.position.set((Math.random()-0.5)*16, 0, (Math.random()-0.5)*24);
    tree.userData.baseRot = Math.random()*Math.PI*2;
    scene.add(tree);
  }

  // Grass tufts
  const grassGeo = new THREE.ConeGeometry(0.05, 0.4, 4);
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
  for (let i = 0; i < 80; i++) {
    const g = new THREE.Mesh(grassGeo, grassMat);
    g.position.set((Math.random()-0.5)*18, 0.2, (Math.random()-0.5)*24);
    g.rotation.z = (Math.random()-0.5)*0.4;
    scene.add(g);
  }

  // Orbit controls
  let controls = null;
  if (window.OrbitControls) {
    controls = new window.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
  }

  // Wind animation for trees
  const trees = scene.children.filter(c => c instanceof THREE.Group);

  function animate(t) {
    const time = t * 0.001;
    waterMat.uniforms.uTime.value = time;
    trees.forEach((tree, i) => {
      tree.rotation.z = Math.sin(time + i) * 0.03;
    });
    if (controls) controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Resize
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  // Reduced motion: disable animation loop auto-rotate
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (controls) controls.autoRotate = false;
  }
})();