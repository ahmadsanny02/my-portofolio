/** Axis-aligned box on the ground plane (XZ). */
export interface Aabb {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface GroundPoint {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Pushes a circle (the player's footprint) out of every overlapping obstacle.
 *
 * A full physics engine is unnecessary for a kinematic character among static
 * boxes: this closest-point test is allocation-free and costs a handful of
 * comparisons per obstacle per frame. Two passes settle corner cases where
 * resolving one box pushes the circle into a neighbour.
 *
 * Mutates and returns `position`.
 */
export function resolveCircleCollisions<T extends GroundPoint>(
  position: T,
  radius: number,
  obstacles: readonly Aabb[],
  passes = 2,
): T {
  const radiusSq = radius * radius;

  for (let pass = 0; pass < passes; pass++) {
    let corrected = false;

    for (const box of obstacles) {
      const closestX = clamp(position.x, box.minX, box.maxX);
      const closestZ = clamp(position.z, box.minZ, box.maxZ);
      const dx = position.x - closestX;
      const dz = position.z - closestZ;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq >= radiusSq) continue;

      if (distanceSq > 1e-10) {
        // Centre is outside the box: push out along the contact normal.
        const distance = Math.sqrt(distanceSq);
        const push = (radius - distance) / distance;
        position.x += dx * push;
        position.z += dz * push;
      } else {
        // Centre is inside the box: eject through the nearest face.
        const toMinX = position.x - box.minX;
        const toMaxX = box.maxX - position.x;
        const toMinZ = position.z - box.minZ;
        const toMaxZ = box.maxZ - position.z;
        const nearest = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
        if (nearest === toMinX) position.x = box.minX - radius;
        else if (nearest === toMaxX) position.x = box.maxX + radius;
        else if (nearest === toMinZ) position.z = box.minZ - radius;
        else position.z = box.maxZ + radius;
      }
      corrected = true;
    }

    if (!corrected) break;
  }

  return position;
}

/** Keeps a circle inside a rectangular room centred on the origin. */
export function clampToRoom<T extends GroundPoint>(
  position: T,
  radius: number,
  halfWidth: number,
  halfDepth: number,
): T {
  position.x = clamp(position.x, -halfWidth + radius, halfWidth - radius);
  position.z = clamp(position.z, -halfDepth + radius, halfDepth - radius);
  return position;
}
