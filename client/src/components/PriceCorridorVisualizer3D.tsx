import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Asset {
  id: string;
  name: string;
  price: number;
  medianPrice: number;
  provenanceScore: number;  // 0-1
  hypeScore: number;  // 0-1
  liquidityScore: number;  // 0-1
  position: { x: number; y: number; z: number };
}

interface PriceCorridorVisualizerProps {
  assets: Asset[];
  corridorData?: {
    median: number;
    lowerBound: number;
    upperBound: number;
  };
}

const PriceCorridorVisualizer3D: React.FC<PriceCorridorVisualizerProps> = ({ 
  assets, 
  corridorData 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 30, 50);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Add grid
    const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Draw median plane (Z=0 plane)
    if (corridorData) {
      const medianGeometry = new THREE.PlaneGeometry(100, 100);
      const medianMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const medianPlane = new THREE.Mesh(medianGeometry, medianMaterial);
      medianPlane.rotation.x = -Math.PI / 2;
      medianPlane.position.y = 0;
      scene.add(medianPlane);

      // Upper bound plane
      const upperGeometry = new THREE.PlaneGeometry(100, 100);
      const upperMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      const upperPlane = new THREE.Mesh(upperGeometry, upperMaterial);
      upperPlane.rotation.x = -Math.PI / 2;
      const upperDistance = ((corridorData.upperBound - corridorData.median) / corridorData.median) * 20;
      upperPlane.position.y = upperDistance;
      scene.add(upperPlane);

      // Lower bound plane
      const lowerGeometry = new THREE.PlaneGeometry(100, 100);
      const lowerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      const lowerPlane = new THREE.Mesh(lowerGeometry, lowerMaterial);
      lowerPlane.rotation.x = -Math.PI / 2;
      const lowerDistance = ((corridorData.lowerBound - corridorData.median) / corridorData.median) * 20;
      lowerPlane.position.y = lowerDistance;
      scene.add(lowerPlane);
    }

    // Add assets as spheres
    assets.forEach((asset) => {
      const deviation = (asset.price - asset.medianPrice) / asset.medianPrice;
      const yPosition = deviation * 20; // Scale for visualization

      // Asset sphere
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
      
      // Color based on pressure
      let color: number;
      if (deviation < -0.2) {
        color = 0xff0000; // Red - undervalued
      } else if (deviation < -0.1) {
        color = 0xff6600; // Orange
      } else if (deviation < 0.1) {
        color = 0xffff00; // Yellow - neutral
      } else if (deviation < 0.2) {
        color = 0x00ccff; // Light blue
      } else {
        color = 0x0000ff; // Blue - overvalued
      }

      const sphereMaterial = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100
      });

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(asset.position.x, yPosition, asset.position.z);
      sphere.userData = { asset };
      scene.add(sphere);

      // Add glow effect for undervalued assets
      if (deviation < -0.15) {
        const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(sphere.position);
        scene.add(glow);
      }

      // Add three force vectors
      // F1: Provenance (institutional backing) - Steel thread
      const f1Height = asset.provenanceScore * 5;
      const f1Geometry = new THREE.CylinderGeometry(0.05, 0.05, f1Height);
      const f1Material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
      const f1Vector = new THREE.Mesh(f1Geometry, f1Material);
      f1Vector.position.set(
        asset.position.x - 2,
        yPosition - f1Height / 2,
        asset.position.z
      );
      scene.add(f1Vector);

      // F2: Hype (media buzz) - Yellow spring
      const f2Height = asset.hypeScore * 8;
      const f2Geometry = new THREE.CylinderGeometry(0.08, 0.08, f2Height);
      const f2Material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
      const f2Vector = new THREE.Mesh(f2Geometry, f2Material);
      f2Vector.position.set(
        asset.position.x,
        yPosition + f2Height / 2,
        asset.position.z + 2
      );
      scene.add(f2Vector);

      // F3: Liquidity (time-to-sale) - Magnetic field (torus)
      const f3Geometry = new THREE.TorusGeometry(1.5 * asset.liquidityScore, 0.1, 16, 100);
      const f3Material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
      const f3Vector = new THREE.Mesh(f3Geometry, f3Material);
      f3Vector.position.set(asset.position.x, yPosition, asset.position.z);
      f3Vector.rotation.x = Math.PI / 2;
      scene.add(f3Vector);

      // Add label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = '#ffffff';
        context.font = 'Bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(asset.name, 128, 32);
        context.fillText(`$${asset.price.toLocaleString()}`, 128, 52);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(asset.position.x, yPosition + 3, asset.position.z);
        sprite.scale.set(5, 1.25, 1);
        scene.add(sprite);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.asset) {
          setSelectedAsset(object.userData.asset);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [assets, corridorData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '800px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Info Panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '20px',
          borderRadius: '10px',
          minWidth: '250px',
          maxWidth: '350px'
        }}
      >
        <h3 style={{ marginTop: 0 }}>Price Corridor Legend</h3>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ff0000', marginRight: '10px' }} />
            <span>Red: Undervalued (Buy Signal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ffff00', marginRight: '10px' }} />
            <span>Yellow: Fair Value (Median)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#0000ff', marginRight: '10px' }} />
            <span>Blue: Overvalued (Sell Signal)</span>
          </div>
        </div>

        <h4>Force Vectors:</h4>
        <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
          <li><strong>F1 (Gray)</strong>: Provenance strength</li>
          <li><strong>F2 (Yellow)</strong>: Market hype level</li>
          <li><strong>F3 (Cyan Ring)</strong>: Liquidity indicator</li>
        </ul>

        {selectedAsset && (
          <>
            <h4>Selected Asset:</h4>
            <div style={{ fontSize: '14px' }}>
              <p><strong>{selectedAsset.name}</strong></p>
              <p>Price: ${selectedAsset.price.toLocaleString()}</p>
              <p>Median: ${selectedAsset.medianPrice.toLocaleString()}</p>
              <p>
                Deviation: {(((selectedAsset.price - selectedAsset.medianPrice) / selectedAsset.medianPrice) * 100).toFixed(1)}%
              </p>
              <p>Provenance: {(selectedAsset.provenanceScore * 100).toFixed(0)}%</p>
              <p>Hype: {(selectedAsset.hypeScore * 100).toFixed(0)}%</p>
              <p>Liquidity: {(selectedAsset.liquidityScore * 100).toFixed(0)}%</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceCorridorVisualizer3D;
