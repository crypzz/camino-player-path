import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Pitch() {
  return (
    <group rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -0.5, 0]}>
      {/* Pitch surface */}
      <mesh receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#0a1a2e" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(10, 6)]} />
        <lineBasicMaterial color="#E8B400" transparent opacity={0.5} />
      </lineSegments>
      {/* Center circle */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.9, 0.92, 64]} />
        <meshBasicMaterial color="#E8B400" transparent opacity={0.4} />
      </mesh>
      {/* Center line */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[0.02, 6]} />
        <meshBasicMaterial color="#E8B400" transparent opacity={0.3} />
      </mesh>
      {/* Penalty boxes */}
      {[-1, 1].map(side => (
        <lineSegments key={side} position={[side * 4.1, 0, 0.01]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 3)]} />
          <lineBasicMaterial color="#E8B400" transparent opacity={0.4} />
        </lineSegments>
      ))}
    </group>
  );
}

interface PlayerNodeProps {
  path: [number, number][];
  color: string;
  speed: number;
  offset: number;
}

function PlayerNode({ path, color, speed, offset }: PlayerNodeProps) {
  const ref = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * speed + offset) % path.length);
    const i = Math.floor(t);
    const next = (i + 1) % path.length;
    const frac = t - i;
    const x = path[i][0] + (path[next][0] - path[i][0]) * frac;
    const z = path[i][1] + (path[next][1] - path[i][1]) * frac;
    ref.current.position.set(x, 0.05, z);
    if (trailRef.current) {
      trailRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3 + offset) * 0.3);
    }
  });

  return (
    <group ref={ref}>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={1.2} distance={1.5} />
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.15,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.08,
      0.04
    );
  });

  // Passing patterns - paths around the pitch
  const paths = useMemo<[number, number][][]>(() => [
    [[-3, -2], [-1, -1.5], [1, -2], [3, -1], [2, 1], [0, 0], [-2, 1.5], [-3, 0]],
    [[3, 2], [1, 1.5], [-1, 2], [-3, 1], [-2, -1], [0, 0], [2, -1.5], [3, 0]],
    [[0, -2.5], [2.5, -1], [3.5, 1], [1.5, 2.5], [-1.5, 2], [-3.5, 0.5], [-2.5, -1.5], [-1, -2.8]],
    [[-2.5, 2.5], [0, 1], [2.5, 2], [3, -0.5], [1, -2], [-2, -2.5], [-3.5, -0.5], [-2, 1.2]],
  ], []);

  const colors = ['#E8B400', '#E8B400', '#3B82F6', '#10B981'];

  return (
    <group ref={groupRef}>
      <Pitch />
      {paths.map((path, i) => (
        <PlayerNode key={i} path={path} color={colors[i]} speed={0.4 + i * 0.05} offset={i * 1.7} />
      ))}
    </group>
  );
}

export function Hero3DPitch() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.8, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 2]} intensity={0.6} color="#E8B400" />
          <Scene />
          <fog attach="fog" args={['#0D1117', 6, 14]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
