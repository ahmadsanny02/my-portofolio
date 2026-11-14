import type { InteractableId } from '../store';
import type { Aabb } from './collision';

/**
 * Room blueprint in metres. Both the rendered meshes and the collision data
 * derive from these constants so visuals and colliders cannot drift apart.
 * The room is centred on the origin; the camera looks from +Z towards -Z.
 */
export const ROOM = { halfWidth: 5, halfDepth: 4, wallHeight: 3.2, wallThickness: 0.2 } as const;

export const PLAYER = {
  radius: 0.34,
  /** Top speed in metres per second. */
  speed: 3.6,
  /** Exponential smoothing rates (1/s) for velocity and heading. */
  acceleration: 12,
  turnRate: 14,
  spawn: { x: 0.4, z: 1.2 },
} as const;

export const CAMERA = {
  fov: 42,
  followHeight: 6.4,
  followDistance: 8.6,
  lookHeight: 0.9,
} as const;

export const DESK = { x: -1.6, z: -3.35, width: 2.8, depth: 1.1, height: 0.78 } as const;
/** Centre of the monitor's screen surface. */
export const MONITOR = { x: -1.6, y: 1.42, z: -3.48, width: 1.2, height: 0.68 } as const;
export const LAMP = { x: -0.5, z: -3.5 } as const;
export const CHAIR = { x: -2.65, z: -2.3, rotation: 0.45 } as const;
export const SHELF = { x: -4.7, z: -1.5, width: 0.5, depth: 1.8, height: 2 } as const;
export const BED = { x: 3.75, z: -2.35, width: 2.2, depth: 3.2 } as const;
export const PLANT = { x: -4.3, z: -3.4 } as const;
export const OTTOMAN = { x: 3.6, z: 2.2, radius: 0.45 } as const;
export const RUG = { x: 0.6, z: 0.5, width: 3.8, depth: 2.6 } as const;

function footprint(x: number, z: number, width: number, depth: number): Aabb {
  return { minX: x - width / 2, maxX: x + width / 2, minZ: z - depth / 2, maxZ: z + depth / 2 };
}

/** Static colliders. Walls are handled by clamping to the room bounds. */
export const OBSTACLES: readonly Aabb[] = [
  // Desk, extended back to the wall so the player cannot slip behind it
  { ...footprint(DESK.x, DESK.z, DESK.width, DESK.depth), minZ: -ROOM.halfDepth },
  footprint(CHAIR.x, CHAIR.z, 0.78, 0.78),
  footprint(SHELF.x, SHELF.z, SHELF.width + 0.1, SHELF.depth),
  footprint(BED.x, BED.z, BED.width, BED.depth),
  footprint(PLANT.x, PLANT.z, 0.64, 0.64),
  footprint(OTTOMAN.x, OTTOMAN.z, OTTOMAN.radius * 2, OTTOMAN.radius * 2),
];

export interface Interactable {
  id: InteractableId;
  /** Ground position the player has to approach. */
  x: number;
  z: number;
  range: number;
}

const DESK_FRONT_Z = DESK.z + DESK.depth / 2;

export const INTERACTABLES: readonly Interactable[] = [
  { id: 'computer', x: MONITOR.x, z: DESK_FRONT_Z, range: 1.35 },
  { id: 'lamp', x: LAMP.x, z: DESK_FRONT_Z, range: 1.35 },
];

/** Nearest interactable within reach of the given ground position, if any. */
export function findNearbyInteractable(x: number, z: number): InteractableId | null {
  let nearest: InteractableId | null = null;
  let nearestDistanceSq = Infinity;
  for (const item of INTERACTABLES) {
    const distanceSq = (item.x - x) ** 2 + (item.z - z) ** 2;
    if (distanceSq <= item.range * item.range && distanceSq < nearestDistanceSq) {
      nearest = item.id;
      nearestDistanceSq = distanceSq;
    }
  }
  return nearest;
}

const TAN_HALF_FOV = Math.tan((CAMERA.fov * Math.PI) / 360);
/** Share of the viewport the monitor should occupy once the camera has zoomed in. */
const MONITOR_FILL = { height: 0.56, width: 0.82 } as const;

/**
 * Camera distance that frames the monitor for a given viewport aspect ratio,
 * plus the fraction of the viewport the screen then covers. Portrait
 * viewports are width-limited, landscape ones height-limited.
 */
export function monitorFraming(aspect: number) {
  const distance = Math.max(
    MONITOR.height / (2 * TAN_HALF_FOV * MONITOR_FILL.height),
    MONITOR.width / (2 * TAN_HALF_FOV * aspect * MONITOR_FILL.width),
  );
  return {
    distance,
    widthFraction: MONITOR.width / (2 * TAN_HALF_FOV * distance * aspect),
    heightFraction: MONITOR.height / (2 * TAN_HALF_FOV * distance),
  };
}

/**
 * CSS clip-path matching the monitor's on-screen rectangle after the camera
 * zoom. The portfolio overlay expands from this shape to the full viewport,
 * which visually hands over from the 3D screen to the DOM.
 */
export function monitorClipPath(aspect: number): string {
  const { widthFraction, heightFraction } = monitorFraming(aspect);
  const vertical = (((1 - heightFraction) / 2) * 100).toFixed(2);
  const horizontal = (((1 - widthFraction) / 2) * 100).toFixed(2);
  return `inset(${vertical}% ${horizontal}% ${vertical}% ${horizontal}% round 12px)`;
}
