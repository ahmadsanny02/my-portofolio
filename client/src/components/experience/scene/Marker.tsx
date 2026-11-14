import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { useAssets } from './assets';

interface MarkerProps {
  position: [number, number, number];
  visible?: boolean;
}

/** Bobbing diamond that points out an interactive object (also on touch devices, which have no hover). */
export default function Marker({ position, visible = true }: MarkerProps) {
  const { geo, mat } = useAssets();
  const ref = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh || !mesh.visible) return;
    time.current += delta;
    mesh.position.y = position[1] + Math.sin(time.current * 2.4) * 0.06;
    mesh.rotation.y = time.current * 1.6;
  });

  return <mesh ref={ref} geometry={geo.marker} material={mat.marker} position={position} visible={visible} />;
}
