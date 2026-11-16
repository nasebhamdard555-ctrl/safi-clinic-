import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Palette,
  Eye,
  Info,
} from 'lucide-react';

interface Apothecary3DSceneProps {
  className?: string;
}

export const Apothecary3DScene: React.FC<Apothecary3DSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [materialTheme, setMaterialTheme] = useState<'gold_marble' | 'imperial_jade' | 'antique_bronze'>('gold_marble');
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activePartInfo, setActivePartInfo] = useState<string>('Classical Unani Botanical Mortar & Pestle with Herb Grinding Chamber');

  // Mutable refs for Three.js animation and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const explodedRef = useRef<number>(0);
  const explodedGroupRefs = useRef<{
    pestle?: THREE.Group;
    herbs?: THREE.Group;
    alembic?: THREE.Group;
    bowl?: THREE.Group;
    base?: THREE.Group;
  }>({});
  const materialsRef = useRef<{ [key: string]: THREE.MeshPhysicalMaterial }>({});

  useEffect(() => {
    explodedRef.current = explodedRatio;
  }, [explodedRatio]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 2. Setup Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06120d);
    scene.fog = new THREE.FogExp2(0x06120d, 0.045);
    sceneRef.current = scene;

    // 3. Setup Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);

    // 4. Setup Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 5. Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera dipping too far below ground
    controls.target.set(0, 1.2, 0);

    // 6. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 7. Balanced 3-Point Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.8);
    keyLight.position.set(4, 7, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Cool Fill Light (Hemisphere)
    const hemiLight = new THREE.HemisphereLight(0x78ab92, 0x0a1c14, 1.1);
    scene.add(hemiLight);

    // Warm Gold Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 8. Ground & Soft Radial Contact Shadow Plane
    // Procedural Marble Pedestal Floor
    const floorGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.12, 64);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fctx = floorCanvas.getContext('2d')!;
    fctx.fillStyle = '#0a1a12';
    fctx.fillRect(0, 0, 512, 512);
    // Subtle circular gold concentric inlay lines
    fctx.strokeStyle = '#d4af37';
    fctx.lineWidth = 3;
    fctx.beginPath();
    fctx.arc(256, 256, 230, 0, Math.PI * 2);
    fctx.stroke();
    fctx.lineWidth = 1;
    fctx.beginPath();
    fctx.arc(256, 256, 215, 0, Math.PI * 2);
    fctx.stroke();

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.colorSpace = THREE.SRGBColorSpace;
    floorTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1a12,
      roughness: 0.35,
      metalness: 0.2,
      map: floorTex,
      clearcoat: 0.4,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.06;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Contact shadow texture (procedural radial gradient)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    scene.add(contactShadow);

    // 9. Procedural 3-12 Part Composite 3D Model:
    // "The Apothecary's Royal Unani Mortar, Botanical Alembic, & Spagyric Vessel"
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Create shared PBR materials
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.5,
      anisotropy: 0.8,
    });

    const marbleMat = new THREE.MeshPhysicalMaterial({
      color: 0x11281e,
      metalness: 0.08,
      roughness: 0.65,
      clearcoat: 0.3,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x59ad85,
      metalness: 0.1,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 1,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const herbMat = new THREE.MeshPhysicalMaterial({
      color: 0x2d6945,
      metalness: 0.05,
      roughness: 0.85,
    });

    materialsRef.current = { gold: goldMat, marble: marbleMat, glass: glassMat, herb: herbMat };

    // --- Part 1: Stepped Base & Pedestal ---
    const baseGroup = new THREE.Group();
    const basePlinthGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.22, 48);
    const basePlinth = new THREE.Mesh(basePlinthGeo, marbleMat);
    basePlinth.position.y = 0.11;
    basePlinth.castShadow = !isSoftwareGl;
    basePlinth.receiveShadow = !isSoftwareGl;
    baseGroup.add(basePlinth);

    const baseRingGeo = new THREE.TorusGeometry(1.22, 0.035, 16, 48);
    const baseRing = new THREE.Mesh(baseRingGeo, goldMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.22;
    baseRing.castShadow = !isSoftwareGl;
    baseGroup.add(baseRing);
    rootGroup.add(baseGroup);
    explodedGroupRefs.current.base = baseGroup;

    // --- Part 2: Mortar Bowl (Primary Silhouette) ---
    const bowlGroup = new THREE.Group();
    // Lathe geometry for classical chalice/mortar profile
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.35, 0.22));
    points.push(new THREE.Vector2(0.5, 0.35));
    points.push(new THREE.Vector2(0.95, 0.75));
    points.push(new THREE.Vector2(1.15, 1.2));
    points.push(new THREE.Vector2(1.2, 1.35));
    // Interior hollow
    points.push(new THREE.Vector2(1.02, 1.35));
    points.push(new THREE.Vector2(0.85, 0.8));
    points.push(new THREE.Vector2(0.45, 0.4));
    points.push(new THREE.Vector2(0.2, 0.38));
    const bowlGeo = new THREE.LatheGeometry(points, 48);
    bowlGeo.computeVertexNormals();
    const bowlMesh = new THREE.Mesh(bowlGeo, marbleMat);
    bowlMesh.castShadow = !isSoftwareGl;
    bowlMesh.receiveShadow = !isSoftwareGl;
    bowlGroup.add(bowlMesh);

    // Filigree Gold Rim & Handles
    const rimGeo = new THREE.TorusGeometry(1.18, 0.045, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.35;
    rimMesh.castShadow = !isSoftwareGl;
    bowlGroup.add(rimMesh);

    // Twin ornate side handles
    const handleGeo = new THREE.TorusGeometry(0.25, 0.04, 16, 32, Math.PI);
    const leftHandle = new THREE.Mesh(handleGeo, goldMat);
    leftHandle.position.set(-1.18, 1.05, 0);
    leftHandle.rotation.y = Math.PI / 2;
    leftHandle.rotation.z = Math.PI / 2;
    bowlGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMat);
    rightHandle.position.set(1.18, 1.05, 0);
    rightHandle.rotation.y = -Math.PI / 2;
    rightHandle.rotation.z = -Math.PI / 2;
    bowlGroup.add(rightHandle);

    rootGroup.add(bowlGroup);
    explodedGroupRefs.current.bowl = bowlGroup;

    // --- Part 3: Crushed Botanical Herb Mixture (Inner Chamber) ---
    const herbsGroup = new THREE.Group();
    // Instanced clusters of dried herbs / saffron / nigella seeds inside bowl
    const herbCount = 28;
    const leafGeo = new THREE.SphereGeometry(0.065, 8, 8);
    leafGeo.scale(1.8, 0.4, 0.9);
    const herbInstanced = new THREE.InstancedMesh(leafGeo, herbMat, herbCount);
    herbInstanced.castShadow = !isSoftwareGl;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < herbCount; i++) {
      const radius = 0.15 + Math.random() * 0.48;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.52 + radius * 0.35 + (Math.random() - 0.5) * 0.08;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.75 + Math.random() * 0.5);
      dummy.updateMatrix();
      herbInstanced.setMatrixAt(i, dummy.matrix);
    }
    herbInstanced.instanceMatrix.needsUpdate = true;
    herbInstanced.computeBoundingSphere();
    herbsGroup.add(herbInstanced);
    rootGroup.add(herbsGroup);
    explodedGroupRefs.current.herbs = herbsGroup;

    // --- Part 4: Heavy Pestle with Brass Collar (Secondary Read & Accent) ---
    const pestleGroup = new THREE.Group();
    // Head / Grinding pestle tip
    const pestleHeadGeo = new THREE.SphereGeometry(0.24, 24, 24);
    pestleHeadGeo.scale(1, 1.3, 1);
    const pestleHead = new THREE.Mesh(pestleHeadGeo, marbleMat);
    pestleHead.position.set(0, 0, 0);
    pestleHead.castShadow = !isSoftwareGl;
    pestleGroup.add(pestleHead);

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, marbleMat);
    shaftMesh.position.y = 0.7;
    shaftMesh.castShadow = !isSoftwareGl;
    pestleGroup.add(shaftMesh);

    // Decorative Brass Ring / Collar
    const collarGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.22, 32);
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.position.y = 0.65;
    collarMesh.castShadow = !isSoftwareGl;
    pestleGroup.add(collarMesh);

    // Top Crown Finial
    const finialGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const finialMesh = new THREE.Mesh(finialGeo, goldMat);
    finialMesh.position.y = 1.45;
    finialMesh.castShadow = !isSoftwareGl;
    pestleGroup.add(finialMesh);

    // Angle the pestle resting inside the mortar
    pestleGroup.position.set(0.25, 0.6, 0.15);
    pestleGroup.rotation.z = -0.38;
    pestleGroup.rotation.x = 0.22;
    rootGroup.add(pestleGroup);
    explodedGroupRefs.current.pestle = pestleGroup;

    // --- Part 5: Botanical Spagyric Alembic Flask (Glass & Condenser Tube) ---
    const alembicGroup = new THREE.Group();
    // Glass flask sphere
    const flaskBodyGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const flaskBody = new THREE.Mesh(flaskBodyGeo, glassMat);
    flaskBody.position.set(-1.8, 0.6, 0.6);
    flaskBody.castShadow = !isSoftwareGl;
    alembicGroup.add(flaskBody);

    // Flask neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.5, 32);
    const flaskNeck = new THREE.Mesh(neckGeo, glassMat);
    flaskNeck.position.set(-1.8, 1.05, 0.6);
    alembicGroup.add(flaskNeck);

    // Brass spout collar
    const spoutCollar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 16, 32), goldMat);
    spoutCollar.rotation.x = Math.PI / 2;
    spoutCollar.position.set(-1.8, 1.28, 0.6);
    alembicGroup.add(spoutCollar);

    // Curved condenser tube (CatmullRomCurve3 with TubeGeometry)
    const curvePoints = [
      new THREE.Vector3(-1.8, 1.25, 0.6),
      new THREE.Vector3(-1.4, 1.35, 0.45),
      new THREE.Vector3(-1.1, 1.05, 0.35),
      new THREE.Vector3(-0.9, 0.8, 0.2),
    ];
    const condenserCurve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(condenserCurve, 32, 0.035, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, goldMat);
    tubeMesh.castShadow = !isSoftwareGl;
    alembicGroup.add(tubeMesh);

    // Liquid meniscus inside flask
    const liquidGeo = new THREE.SphereGeometry(0.44, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xaa8222,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(-1.8, 0.58, 0.6);
    alembicGroup.add(liquidMesh);

    rootGroup.add(alembicGroup);
    explodedGroupRefs.current.alembic = alembicGroup;

    // Center root pivot at bottom-center
    rootGroup.position.set(0, 0, 0);

    // Track user drag interaction
    let isUserInteracting = false;
    controls.addEventListener('start', () => {
      isUserInteracting = true;
    });
    controls.addEventListener('end', () => {
      isUserInteracting = false;
    });

    // 10. Lossless 60fps Animation Loop with exponential damping & software WebGL pacing
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth autorotation if active and user not dragging
      if (autoRotate && !isUserInteracting) {
        rootGroup.rotation.y += delta * 0.25;
      }

      // Smoothly interpolate exploded view separation
      const targetExp = explodedRef.current;
      const currentExp = THREE.MathUtils.damp(
        pestleGroup.position.y - 0.6,
        targetExp * 1.5,
        4.0,
        delta
      );

      // Part offsets
      if (explodedGroupRefs.current.pestle) {
        explodedGroupRefs.current.pestle.position.y = 0.6 + currentExp * 1.6;
        explodedGroupRefs.current.pestle.position.x = 0.25 + currentExp * 0.4;
      }
      if (explodedGroupRefs.current.herbs) {
        explodedGroupRefs.current.herbs.position.y = currentExp * 0.9;
      }
      if (explodedGroupRefs.current.alembic) {
        explodedGroupRefs.current.alembic.position.x = -currentExp * 0.8;
      }

      // Gentle floating herbs oscillation
      if (explodedGroupRefs.current.herbs && targetExp > 0.05) {
        explodedGroupRefs.current.herbs.rotation.y = time * 0.5;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  // Handle Theme Switching
  useEffect(() => {
    const mats = materialsRef.current;
    if (!mats.marble || !mats.gold) return;

    if (materialTheme === 'gold_marble') {
      mats.marble.color.setHex(0x11281e); // Dark emerald marble
      mats.marble.roughness = 0.65;
      mats.gold.color.setHex(0xd4af37); // Royal Gold
      mats.gold.roughness = 0.18;
      mats.gold.metalness = 0.92;
      setActivePartInfo('Royal Gold & Afghan Green Onyx — Classical Unani Apothecary Vessel');
    } else if (materialTheme === 'imperial_jade') {
      mats.marble.color.setHex(0x0e3b28); // Deep Jade
      mats.marble.roughness = 0.35;
      mats.gold.color.setHex(0xf3e5ab); // Pale Champagne Gold
      mats.gold.roughness = 0.25;
      mats.gold.metalness = 0.85;
      setActivePartInfo('Imperial Jade & White Gold — Botanical Maceration & Tincture Vessel');
    } else if (materialTheme === 'antique_bronze') {
      mats.marble.color.setHex(0x1a1a1a); // Black Basalt
      mats.marble.roughness = 0.8;
      mats.gold.color.setHex(0xb87333); // Hammered Copper / Antique Bronze
      mats.gold.roughness = 0.35;
      mats.gold.metalness = 0.9;
      setActivePartInfo('Basalt & Ancient Bronze — Classical Phytotherapy Herb Pulverizer');
    }
  }, [materialTheme]);

  const resetCamera = () => {
    if (sceneRef.current) {
      setExplodedRatio(0);
      setAutoRotate(true);
    }
  };

  return (
    <div className={`relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden bg-[#040e08] border border-[#d4af37]/30 shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Spec Card (Minimal footprint) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none flex flex-col gap-1.5 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081810]/90 border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider backdrop-blur-none shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Botanical Apothecary</span>
        </div>
        <p className="text-xs text-[#a6b6ad] bg-[#05110a]/85 px-3 py-1.5 rounded-xl border border-[#1b3b2f] shadow-sm">
          {activePartInfo}
        </p>
      </div>

      {/* Top Right Quick View Actions */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            autoRotate
              ? 'bg-[#d4af37] text-black border-[#d4af37]'
              : 'bg-[#081810] text-[#a6b6ad] border-[#234b3c] hover:border-[#d4af37]'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        <button
          onClick={resetCamera}
          className="px-3 py-1.5 rounded-lg bg-[#081810] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset Camera & Exploded View"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Unified Bottom Control Dock (<= 15% viewport footprint, Collapsible) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl transition-all duration-300 ${
          isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-4 py-1 rounded-full bg-[#081810] border border-[#d4af37]/60 text-[#d4af37] hover:text-[#f5f3ec] text-[11px] font-semibold flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls (Cinema View)</span>
              </>
            )}
          </button>
        </div>

        {/* Control Dock Surface (No backdrop-filter to prevent WebGL GPU stalls) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#071710] border border-[#d4af37]/50 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Exploded View Separation Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a6b6ad] flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Exploded Anatomy</span>
                </span>
                <span className="text-[#d4af37] font-mono text-[11px] font-semibold">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedRatio}
                onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0e2419] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
              <div className="flex justify-between text-[10px] text-[#6b8275]">
                <span>Assembled</span>
                <span>Component Inspection</span>
              </div>
            </div>

            {/* Material Finishes */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#a6b6ad] flex items-center gap-1.5 font-medium">
                <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Artisanal Finish</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setMaterialTheme('gold_marble')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer truncate ${
                    materialTheme === 'gold_marble'
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#0a1e14] text-[#a6b6ad] border-[#1b3b2f] hover:border-[#d4af37]'
                  }`}
                >
                  Gold & Onyx
                </button>
                <button
                  onClick={() => setMaterialTheme('imperial_jade')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer truncate ${
                    materialTheme === 'imperial_jade'
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#0a1e14] text-[#a6b6ad] border-[#1b3b2f] hover:border-[#d4af37]'
                  }`}
                >
                  Jade & Silver
                </button>
                <button
                  onClick={() => setMaterialTheme('antique_bronze')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer truncate ${
                    materialTheme === 'antique_bronze'
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#0a1e14] text-[#a6b6ad] border-[#1b3b2f] hover:border-[#d4af37]'
                  }`}
                >
                  Ancient Bronze
                </button>
              </div>
            </div>
          </div>

          {/* Botanical Chamber Info Footer */}
          <div className="pt-2 border-t border-[#1b3b2f] flex flex-wrap items-center justify-between text-[11px] text-[#8da396] gap-2">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Drag to rotate · Scroll to zoom · Inspect internal spagyric chamber</span>
            </span>
            <span className="text-[#d4af37] font-semibold">
              Kabul Dispensary Equipment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
