import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '../store';
import { useAssets } from './assets';
import { DESK, LAMP } from './layout';
import Marker from './Marker';

const ORIGIN: [number, number, number] = [LAMP.x, DESK.height, LAMP.z];

/**
 * Desk lamp. Clicking it toggles the site theme: switching to dark mode fades
 * the daylight out and leaves the lamp as the room's light source. The
 * emission of the bulb and shade is animated in `Lighting`.
 */
export default function DeskLamp() {
  const { geo, mat } = useAssets();
  const lamp = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const focused = useExperience((state) => state.cameraFocus === 'computer');

  useCursor(hovered);

  useFrame((_, delta) => {
    const group = lamp.current;
    if (!group) return;
    const scale = THREE.MathUtils.damp(group.scale.x, hovered ? 1.1 : 1, 10, delta);
    group.scale.setScalar(scale);
  });

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    useExperience.getState().activate('lamp');
  };
  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  return (
    <>
      <group position={ORIGIN} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={() => setHovered(false)}>
        <group ref={lamp}>
          <mesh geometry={geo.cylinder} material={mat.metal} position={[0, 0.02, 0]} scale={[0.3, 0.04, 0.3]} castShadow />
          <mesh geometry={geo.cylinder} material={mat.metal} position={[0, 0.28, 0]} scale={[0.04, 0.5, 0.04]} castShadow />
          <mesh geometry={geo.sphere} material={mat.bulb} position={[0, 0.55, 0]} scale={[0.13, 0.13, 0.13]} />
          <mesh geometry={geo.shade} material={mat.shade} position={[0, 0.6, 0]} scale={[0.5, 0.26, 0.5]} castShadow />
        </group>
        <mesh geometry={geo.box} position={[0, 0.4, 0]} scale={[0.7, 0.95, 0.7]} visible={false} />
      </group>

      <Marker position={[LAMP.x, DESK.height + 1.02, LAMP.z]} visible={!focused} />
    </>
  );
}
