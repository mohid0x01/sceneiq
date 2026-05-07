"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/stores/sceneStore";

// Entity data with positions per event
const entityData = [
  {
    name: "Ahmed",
    role: "suspect" as const,
    color: "#ef4444",
    positions: [
      [0, 0, -8], [0, 0, -4], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 8],
    ],
  },
  {
    name: "Imran",
    role: "victim" as const,
    color: "#3b82f6",
    positions: [
      [4, 0, 2], [3, 0, 1], [1, 0, 0], [1, 0.05, -0.5], [1, 0.05, -0.5], [1, 0.05, -0.5],
    ],
  },
  {
    name: "Rizwan",
    role: "witness" as const,
    color: "#22c55e",
    positions: [
      [8, 0, 6], [8, 0, 6], [8, 0, 6], [8, 0, 5], [7, 0, 4], [7, 0, 4],
    ],
  },
];

const locationBeacons = [
  { name: "Bazaar Road Crossing", pos: [0, 0, 0] as [number, number, number] },
  { name: "Atta Flour Mill", pos: [4, 0, 2] as [number, number, number] },
  { name: "Pir Jo Goth Chowk", pos: [8, 0, 6] as [number, number, number] },
];

function EntityFigure({ name, color, positions }: { name: string; color: string; positions: number[][] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentEvent = useSceneStore((s) => s.currentEvent);
  const targetPos = useMemo(() => {
    const p = positions[Math.min(currentEvent, positions.length - 1)];
    return new THREE.Vector3(p[0], p[1] + 0.75, p[2]);
  }, [currentEvent, positions]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos, 0.08);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[positions[0][0], positions[0][1] + 0.75, positions[0][2]]}>
        {/* Body */}
        <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.85} />
        {/* Head */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.85} />
        </mesh>
        <Html distanceFactor={12} position={[0, 1.2, 0]} center>
          <div className="rounded-[2px] bg-background/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm whitespace-nowrap" style={{ color }}>
            {name}
          </div>
        </Html>
      </mesh>
      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[positions[0][0], 0.01, positions[0][2]]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function LocationBeacon({ name, pos }: { name: string; pos: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={pos}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color="#C9A84C" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#C9A84C" transparent opacity={0.7} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0.5, 0]} center>
        <div className="rounded-[2px] bg-gold/10 px-2 py-0.5 text-[9px] font-semibold text-gold backdrop-blur-sm whitespace-nowrap border border-gold/20">
          {name}
        </div>
      </Html>
    </group>
  );
}

function MovementTrails() {
  const currentEvent = useSceneStore((s) => s.currentEvent);
  return (
    <group>
      {entityData.map((entity) => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= Math.min(currentEvent, entity.positions.length - 1); i++) {
          const p = entity.positions[i];
          points.push(new THREE.Vector3(p[0], 0.05, p[2]));
        }
        if (points.length < 2) return null;
        const curve = new THREE.CatmullRomCurve3(points);
        return (
          <mesh key={entity.name}>
            <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
            <meshBasicMaterial color={entity.color} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Scene3DCanvas() {
  return (
    <Canvas
      camera={{ position: [12, 10, 12], fov: 50, near: 0.1, far: 200 }}
      style={{ background: "#050810" }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={0.6} color="#ffeedd" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#C9A84C" />

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#C9A84C"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#C9A84C"
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid
        position={[0, 0, 0]}
      />

      {entityData.map((e) => (
        <EntityFigure key={e.name} name={e.name} color={e.color} positions={e.positions} />
      ))}

      {locationBeacons.map((l) => (
        <LocationBeacon key={l.name} name={l.name} pos={l.pos} />
      ))}

      <MovementTrails />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.2}
      />

      <fog attach="fog" args={["#050810", 20, 50]} />
    </Canvas>
  );
}
