import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { profile } from '@/data/profile';
import { useDisposable } from '../hooks';
import { useExperience } from '../store';
import { useAssets } from './assets';
import { DESK, MONITOR } from './layout';
import Marker from './Marker';

const SCREEN_TEXTURE = { width: 640, height: 362 } as const; // matches the 1.2 × 0.68 m screen

/** Draws the idle screen: a small "desktop" inviting the visitor to open the portfolio. */
function drawScreen(ctx: CanvasRenderingContext2D): void {
  const { width, height } = SCREEN_TEXTURE;
  const font = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#0f172a');
  background.addColorStop(1, '#1e293b');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Window chrome
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, width, 44);
  ['#f87171', '#fbbf24', '#34d399'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(26 + index * 24, 22, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#64748b';
  ctx.font = `600 16px ${font}`;
  ctx.textAlign = 'center';
  ctx.fillText('portfolio.app', width / 2, 28);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = `800 18px ${font}`;
  ctx.fillText('HELLO, I AM', 44, 112);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = `800 44px ${font}`;
  ctx.fillText(profile.fullName, 44, 164, width - 88);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 24px ${font}`;
  ctx.fillText(profile.role, 44, 204);

  // Call-to-action pill
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(44, 248, 300, 58, 29);
  else ctx.rect(44, 248, 300, 58);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 22px ${font}`;
  ctx.textAlign = 'center';
  ctx.fillText('OPEN PORTFOLIO  →', 194, 285);
}

function createScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_TEXTURE.width;
  canvas.height = SCREEN_TEXTURE.height;
  const ctx = canvas.getContext('2d');
  if (ctx) drawScreen(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  // Unlit and excluded from tone mapping: the screen is its own light source
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });

  return {
    material,
    dispose() {
      texture.dispose();
      material.dispose();
    },
  };
}

/** Local origin: where the monitor stand meets the desk surface. */
const ORIGIN: [number, number, number] = [MONITOR.x, DESK.height, MONITOR.z - 0.12];
const SCREEN_HEIGHT = MONITOR.y - DESK.height;

/**
 * Desktop computer. Clicking it (or pressing the interact key nearby) zooms
 * the camera into the monitor and opens the portfolio overlay — it replaces
 * the site's primary navigation.
 */
export default function Computer() {
  const { geo, mat } = useAssets();
  const screen = useDisposable(createScreen);
  const monitor = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const focused = useExperience((state) => state.cameraFocus === 'computer');

  useCursor(hovered);

  useFrame((_, delta) => {
    const group = monitor.current;
    if (!group) return;
    const scale = THREE.MathUtils.damp(group.scale.x, hovered ? 1.05 : 1, 10, delta);
    group.scale.setScalar(scale);
  });

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    useExperience.getState().activate('computer');
  };
  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  return (
    <>
      <group position={ORIGIN} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={() => setHovered(false)}>
        <group ref={monitor}>
          <mesh geometry={geo.box} material={mat.metal} position={[0, 0.015, 0]} scale={[0.46, 0.03, 0.28]} castShadow />
          <mesh geometry={geo.box} material={mat.metal} position={[0, 0.18, -0.02]} scale={[0.08, 0.34, 0.06]} castShadow />
          <mesh geometry={geo.box} material={mat.plastic} position={[0, SCREEN_HEIGHT, 0.085]} scale={[MONITOR.width + 0.1, MONITOR.height + 0.1, 0.06]} castShadow />
          <mesh geometry={geo.plane} material={screen.material} position={[0, SCREEN_HEIGHT, 0.12]} scale={[MONITOR.width, MONITOR.height, 1]} />
        </group>

        {/* Keyboard and mouse */}
        <mesh geometry={geo.box} material={mat.trim} position={[-0.05, 0.015, 0.55]} scale={[0.7, 0.03, 0.24]} castShadow />
        <mesh geometry={geo.box} material={mat.trim} position={[0.5, 0.015, 0.55]} scale={[0.1, 0.03, 0.15]} castShadow />

        {/* Generous invisible hit area so the monitor is easy to tap on touch screens */}
        <mesh geometry={geo.box} position={[0, 0.55, 0.2]} scale={[1.6, 1.2, 0.9]} visible={false} />
      </group>

      <Marker position={[MONITOR.x, MONITOR.y + 0.68, MONITOR.z]} visible={!focused} />
    </>
  );
}
