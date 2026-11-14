'use client';

import { useEffect } from 'react';
import Hud from './hud/Hud';
import { useKeyboardInput } from './scene/input';
import { resetRuntime } from './scene/runtime';
import Scene from './scene/Scene';
import { useExperience } from './store';

/**
 * The 3D room and its HUD. This module (and with it three.js, the renderer
 * and the scene) is only downloaded when the visitor actually gets the 3D
 * experience — see the dynamic import in `Experience`.
 */
export default function Stage() {
  const covered = useExperience((state) => state.view === 'portfolio' && state.overlaySettled);

  useKeyboardInput();
  useEffect(() => resetRuntime, []);

  return (
    <div className="xp-stage" data-covered={covered ? '' : undefined}>
      <Scene />
      <Hud />
    </div>
  );
}
