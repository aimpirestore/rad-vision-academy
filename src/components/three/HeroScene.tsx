"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useMemo, Suspense, useEffect } from "react";
import type { Mesh, Group } from "three";
import * as THREE from "three";
import { detectDevice, type PerfTier } from "@/lib/performance/detect";

/**
 * Lightweight abstract radiology scene built from primitive geometry.
 * No external GLTF — everything is generated, so the bundle stays small
 * and the scene is GPU-friendly on modest hardware.
 *
 * Quality scales with the detected performance tier:
 *   Tier 1 — full:  particles=60, shadows, studio HDRI, DPR [1, 2]
 *   Tier 2 — medium: particles=30, shadows, studio HDRI, DPR [1, 1.5]
 *
 * (Tiers 3–4 never reach this component — HeroSceneLoader renders a
 * static fallback for them.)
 */

function ScannerRings() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.08;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <group ref={group}>
      {[1.6, 1.3, 1.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.015, 16, 96]} />
          <meshStandardMaterial
            color="#B11226"
            metalness={0.7}
            roughness={0.25}
            transparent
            opacity={0.85 - i * 0.18}
          />
        </mesh>
      ))}
      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial
          color="#1A1A1A"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color="#B11226" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function BrainHologram() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.15;
  });
  return (
    <mesh ref={mesh} position={[1.8, 0.4, 0]} scale={0.5}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color="#B11226" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#B11226" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function DicomPanel({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh>
          <planeGeometry args={[1.1, 0.8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            metalness={0.2}
            roughness={0.3}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Scan line */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.0, 0.015]} />
          <meshBasicMaterial color="#B11226" transparent opacity={0.7} />
        </mesh>
        {/* Border */}
        <lineSegments position={[0, 0, 0.001]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 0.8)]} />
          <lineBasicMaterial color="#1A1A1A" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </Float>
  );
}

function Scene({ tier }: { tier: PerfTier }) {
  const particleCount = tier === 1 ? 60 : 30;
  const showShadows = tier === 1;
  const showEnv = tier <= 2;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#B11226" />

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <ScannerRings />
      </Float>

      <BrainHologram />

      <DicomPanel position={[-2.1, 1.0, 0.4]} rotation={[0, 0.4, 0.05]} />
      <DicomPanel position={[2.2, -0.8, -0.3]} rotation={[0, -0.5, -0.05]} />
      <DicomPanel position={[-1.8, -1.1, -0.2]} rotation={[0.1, 0.3, 0.08]} />

      <ParticleField count={particleCount} />

      {showShadows && (
        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.25}
          scale={8}
          blur={2.6}
          far={3}
          color="#7A0A19"
        />
      )}
      {showEnv && <Environment preset="studio" />}
    </>
  );
}

/**
 * Listens for the WebGL context being lost (e.g. GPU crash, driver reset,
 * tab backgrounded on mobile) and logs it. The parent ErrorBoundary will
 * catch hard render failures; context-loss is handled gracefully by R3F.
 */
function ContextLossMonitor() {
  useEffect(() => {
    const handler = (e: Event) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[HeroScene] WebGL context lost — recovering.", e);
      }
    };
    window.addEventListener("webglcontextlost", handler);
    return () => window.removeEventListener("webglcontextlost", handler);
  }, []);
  return null;
}

export function HeroScene() {
  const { tier } = detectDevice();
  // Cap DPR per tier to save GPU fill-rate on retina mobiles.
  const dpr: [number, number] = tier === 1 ? [1, 2] : [1, 1.5];

  return (
    <div className="absolute inset-0">
      <ContextLossMonitor />
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: tier === 1, alpha: true, powerPreference: "high-performance" }}
        // 'demand' frameloop would freeze the scene; 'always' is required for
        // continuous rotation. We keep 'always' but R3F pauses it when the
        // tab is backgrounded automatically.
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  );
}
