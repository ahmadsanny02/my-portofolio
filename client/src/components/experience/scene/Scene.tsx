'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useDisposable, usePageVisible } from '../hooks';
import { useExperience } from '../store';
import { AssetsContext, createSceneAssets } from './assets';
import Computer from './Computer';
import DeskLamp from './DeskLamp';
import FollowCamera from './FollowCamera';
import { CAMERA } from './layout';
import Lighting from './Lighting';
import Player from './Player';
import Room from './Room';

/** Frames rendered before the scene is considered presentable (shaders compiled, buffers uploaded). */
const WARM_UP_FRAMES = 3;

function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current >= WARM_UP_FRAMES) return;
    frames.current += 1;
    if (frames.current === WARM_UP_FRAMES) useExperience.getState().markSceneReady();
  });
  return null;
}

/**
 * Falls back to the classic page if the GPU drops the context (driver reset,
 * memory pressure on mobile). The listener is detached on unmount so the
 * renderer's own teardown does not trigger it.
 */
function ContextGuard() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      useExperience.getState().enterClassic('context-lost', true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    return () => canvas.removeEventListener('webglcontextlost', onContextLost);
  }, [gl]);

  return null;
}

function World() {
  const assets = useDisposable(createSceneAssets);

  return (
    <AssetsContext.Provider value={assets}>
      <Lighting />
      <Room />
      <Computer />
      <DeskLamp />
      <Player />
      <FollowCamera />
      <ReadySignal />
      <ContextGuard />
    </AssetsContext.Provider>
  );
}

/**
 * WebGL canvas for the room.
 *
 * Render budget:
 * - Pixel ratio starts at the device tier's cap and is lowered/raised by a
 *   frame-rate governor, so slow GPUs trade resolution for smoothness.
 * - The render loop is suspended while the portfolio overlay covers the
 *   canvas and while the tab is hidden.
 */
export default function Scene() {
  const quality = useExperience((state) => state.quality);
  const paused = useExperience((state) => state.view === 'portfolio' && state.overlaySettled);
  const pageVisible = usePageVisible();
  const [dpr, setDpr] = useState(() => quality?.maxDpr ?? 1);

  if (!quality) return null;
  const { minDpr, maxDpr } = quality;

  return (
    <Canvas
      className="xp-canvas"
      role="img"
      aria-label="Interactive 3D room. Use the on-screen buttons to open the portfolio or switch the lights."
      dpr={dpr}
      shadows={quality.shadows}
      frameloop={paused || !pageVisible ? 'never' : 'always'}
      gl={{
        antialias: quality.antialias,
        alpha: false,
        stencil: false,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: CAMERA.fov, near: 0.1, far: 80, position: [0.4, 11, 17.5] }}
    >
      <PerformanceMonitor
        factor={1}
        step={0.34}
        flipflops={3}
        onChange={({ factor }) => {
          const next = minDpr + (maxDpr - minDpr) * factor;
          setDpr(Math.round(next * 20) / 20);
        }}
        // Oscillating between levels means the device sits on the edge: settle on the floor
        onFallback={() => setDpr(minDpr)}
      />
      <World />
    </Canvas>
  );
}
