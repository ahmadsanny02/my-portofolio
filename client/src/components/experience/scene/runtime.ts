import { PLAYER } from './layout';

/**
 * Per-frame mutable state shared between scene systems.
 *
 * These values change every frame, so they deliberately live outside React
 * and the store: writing them must never schedule a render.
 */
export const runtime = {
  player: { x: PLAYER.spawn.x as number, z: PLAYER.spawn.z as number },
  /** 0 = daylight, 1 = night. Smoothed towards the active theme. */
  night: 0,
  /** Last known scroll offset of the open portfolio overlay. */
  overlayScrollY: 0,
};

export function resetRuntime(): void {
  runtime.player.x = PLAYER.spawn.x;
  runtime.player.z = PLAYER.spawn.z;
  runtime.overlayScrollY = 0;
}
