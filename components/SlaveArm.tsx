"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface SlaveArmProps {
  scrollProgress: number;
}

export default function SlaveArm({ scrollProgress }: SlaveArmProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const [hovered, setHovered] = useState(false);

  // Load the Draco-compressed GLB model
  const { scene } = useGLTF("/slave-arm.glb");

  // Dynamically extract the geometry from the loaded GLB mesh
  const geometry = useMemo<THREE.BufferGeometry | null>(() => {
    let geom: THREE.BufferGeometry | null = null;
    scene.traverse((node) => {
      if (node.type === "Mesh" || (node as any).isMesh) {
        geom = (node as THREE.Mesh).geometry;
      }
    });
    return geom;
  }, [scene]);

  // Center the geometry bounds and calculate raw max dimension
  const { originalMaxDim } = useMemo(() => {
    if (!geometry) return { originalMaxDim: 1.0 };

    const geom = geometry as THREE.BufferGeometry;

    // Compute normals & bounds
    geom.computeVertexNormals();
    geom.computeBoundingBox();

    // Center geometry around origin pivot
    const center = new THREE.Vector3();
    geom.boundingBox!.getCenter(center);

    const size = new THREE.Vector3();
    geom.boundingBox!.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    console.log("📐 [SlaveArm] Raw Geometry Info:", {
      center: [center.x, center.y, center.z],
      dimensions: [size.x, size.y, size.z],
      maxDimension: maxDim
    });

    geom.translate(-center.x, -center.y, -center.z);

    // Recompute bounding box after translate
    geom.computeBoundingBox();

    return { originalMaxDim: maxDim };
  }, [geometry]);

  // Precompute target colors (davidlangarica.dev inspired palette)
  const baseColor = useMemo(() => new THREE.Color("#bca5e6"), []); // Highly reflective silver-lavender
  const hoverColor = useMemo(() => new THREE.Color("#f3e8ff"), []); // Glowing near-white lavender
  const currentColor = useMemo(() => new THREE.Color("#bca5e6"), []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current || !geometry) return;

    const time = state.clock.getElapsedTime();
    const camera = state.camera;
    const pointer = state.pointer;
    const { width, height } = state.viewport;

    // Detect mobile viewport (R3F viewport width is small on mobile)
    const isMobile = width < 7.5;

    // ── Color interpolation on hover (only on desktop) ──────────────
    const targetColor = hovered && !isMobile ? hoverColor : baseColor;
    currentColor.lerp(targetColor, 0.08);
    materialRef.current.color.copy(currentColor);

    // ── Dynamic Responsive Scale ──────────────────────────────────────
    const baseScaleVal = isMobile
      ? (height * 0.45) / originalMaxDim // Occupy 45% of height on mobile
      : (height * 0.65) / originalMaxDim; // Occupy 65% of height on desktop

    const hoverBoost = hovered && !isMobile ? 1.05 : 1.0;
    const targetScale = baseScaleVal * hoverBoost;

    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);

    // ── Dynamic Material overrides for Mobile (Background Silhouetting) ──
    materialRef.current.roughness = isMobile ? 0.45 : 0.15;
    materialRef.current.envMapIntensity = isMobile ? 0.4 : 1.4;

    // ── Camera and Mesh target transforms based on scroll ──────────
    let camTargetX = 0;
    let camTargetY = 0;
    let camTargetZ = 8;

    let targetRotY = 0;
    let targetRotX = 0.1;
    let targetPosX = 0;
    let targetPosY = 0;
    let targetPosZ = 0;

    const idleSpin = time * 0.12; // Slow ambient spin

    if (isMobile) {
      // ── MOBILE LAYOUT (Centered behind text, non-interactive) ────────
      targetPosX = 0;
      targetPosY = Math.sin(time * 0.6) * 0.1 - 0.2; // float lower down
      targetPosZ = -1.2; // pushed back into background

      targetRotY = idleSpin;
      targetRotX = 0.1;

      camTargetX = 0;
      camTargetY = 0;
      camTargetZ = 8.5; // pull camera slightly further back
    } else {
      // ── DESKTOP LAYOUT (Locked to the right side box) ────────────────
      // Dynamically cap targetPosX relative to viewport width to prevent overflow
      targetPosX = Math.min(width * 0.22, 2.6);

      if (scrollProgress < 0.33) {
        // Phase 1: Hero
        const phase = scrollProgress / 0.33;
        targetRotY = idleSpin + phase * 0.4;
        targetPosY = Math.sin(time * 0.8) * 0.15;
        
        camTargetX = -0.3; // camera offset left moves model right in view
        camTargetY = 0;
        camTargetZ = 8;
      } else if (scrollProgress < 0.66) {
        // Phase 2: Product
        const phase = (scrollProgress - 0.33) / 0.33;
        targetRotY = idleSpin + 0.4 + phase * Math.PI;
        targetRotX = 0.2; // forward tilt
        targetPosY = Math.sin(time * 0.6) * 0.08;

        camTargetX = -0.5;
        camTargetY = 0.1;
        camTargetZ = 7.5;
      } else {
        // Phase 3: Team / Contacts
        const phase = (scrollProgress - 0.66) / 0.34;
        targetRotY = idleSpin + 0.4 + Math.PI + phase * 1.8;
        targetRotX = 0.2 + phase * 0.35;
        targetPosY = Math.sin(time * 0.5) * 0.06 - phase * 0.5;
        targetPosZ = phase * -1.0;

        camTargetX = -0.4;
        camTargetY = phase * 1.8;
        camTargetZ = 7.5 + phase * 3.0;
      }
    }

    // ── Mouse Pointer Parallax (Only active on desktop) ──────────────
    const mouseStrength = isMobile ? 0 : 0.6;
    const parallaxX = pointer.x * mouseStrength;
    const parallaxY = pointer.y * mouseStrength;

    // Smoothly interpolate camera position
    const camLerpSpeed = 0.04;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX + parallaxX, camLerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY + parallaxY, camLerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, camLerpSpeed);

    // Look at a target point centered on the model's Y height
    const lookTarget = new THREE.Vector3(0, targetPosY * 0.4, 0);
    camera.lookAt(lookTarget);

    // Smoothly interpolate all transforms on the mesh
    const lerpSpeed = 0.04;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, lerpSpeed);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, lerpSpeed);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, lerpSpeed);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, lerpSpeed * 2);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosZ, lerpSpeed);
  });

  if (!geometry) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={(e) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#bca5e6"
        metalness={0.95}
        roughness={0.15}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

// Preload the model for performance
useGLTF.preload("/slave-arm.glb");
