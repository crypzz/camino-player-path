import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, targets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // random start in sphere
      const r = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // target = ring/disc shape
      const rt = 1.4 + Math.random() * 0.3;
      const at = Math.random() * Math.PI * 2;
      targets[i * 3] = Math.cos(at) * rt;
      targets[i * 3 + 1] = Math.sin(at) * rt;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return { positions, targets };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = Math.min(1, (clock.elapsedTime * 0.18) % 1.6);
    const ease = 1 - Math.pow(1 - Math.min(1, t), 3);
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count * 3; i++) {
      arr[i] = positions[i] + (targets[i] - positions[i]) * ease;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = clock.elapsedTime * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E8B400"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Particles count={900} />
        </Suspense>
      </Canvas>
    </div>
  );
}
