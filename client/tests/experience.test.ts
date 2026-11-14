import { describe, expect, it } from 'vitest';
import { BOOT_SCRIPT, VIEW_STORAGE_KEY } from '../src/components/experience/boot';
import { resolveQuality } from '../src/components/experience/quality';
import { clampToRoom, resolveCircleCollisions, type Aabb } from '../src/components/experience/scene/collision';
import {
  findNearbyInteractable,
  INTERACTABLES,
  monitorClipPath,
  monitorFraming,
  OBSTACLES,
  PLAYER,
  ROOM,
} from '../src/components/experience/scene/layout';
import { isSoftwareRenderer } from '../src/components/experience/webgl';

const box: Aabb = { minX: -1, maxX: 1, minZ: -1, maxZ: 1 };

describe('resolveCircleCollisions', () => {
  it('leaves a circle that does not touch the box untouched', () => {
    expect(resolveCircleCollisions({ x: 3, z: 0 }, 0.5, [box])).toEqual({ x: 3, z: 0 });
  });

  it('pushes an overlapping circle out along the face normal', () => {
    const position = resolveCircleCollisions({ x: 1.2, z: 0 }, 0.5, [box]);
    expect(position.x).toBeCloseTo(1.5);
    expect(position.z).toBeCloseTo(0);
  });

  it('resolves corner contacts to exactly one radius from the corner', () => {
    const position = resolveCircleCollisions({ x: 1.2, z: 1.2 }, 0.5, [box]);
    expect(Math.hypot(position.x - 1, position.z - 1)).toBeCloseTo(0.5);
  });

  it('ejects a centre that ended up inside the box through the nearest face', () => {
    const position = resolveCircleCollisions({ x: 0.8, z: 0.1 }, 0.5, [box]);
    expect(position).toEqual({ x: 1.5, z: 0.1 });
  });

  it('lets the circle slide along a wall instead of sticking', () => {
    // Moving diagonally into the +X face: only the X component is cancelled
    const position = resolveCircleCollisions({ x: 1.4, z: 0.3 }, 0.5, [box]);
    expect(position.x).toBeCloseTo(1.5);
    expect(position.z).toBeCloseTo(0.3);
  });

  it('settles between two adjacent obstacles without overlapping either', () => {
    const neighbours: Aabb[] = [box, { minX: 1.6, maxX: 3, minZ: -1, maxZ: 1 }];
    const position = resolveCircleCollisions({ x: 1.3, z: 1.2 }, 0.5, neighbours, 4);
    for (const obstacle of neighbours) {
      const dx = position.x - Math.max(obstacle.minX, Math.min(position.x, obstacle.maxX));
      const dz = position.z - Math.max(obstacle.minZ, Math.min(position.z, obstacle.maxZ));
      expect(Math.hypot(dx, dz)).toBeGreaterThanOrEqual(0.5 - 1e-6);
    }
  });
});

describe('room layout', () => {
  it('keeps the circle inside the walls', () => {
    const position = clampToRoom({ x: 99, z: -99 }, PLAYER.radius, ROOM.halfWidth, ROOM.halfDepth);
    expect(position).toEqual({ x: ROOM.halfWidth - PLAYER.radius, z: -ROOM.halfDepth + PLAYER.radius });
  });

  it('spawns the player clear of every obstacle', () => {
    const spawn = { ...PLAYER.spawn };
    expect(resolveCircleCollisions({ ...spawn }, PLAYER.radius, OBSTACLES)).toEqual(spawn);
  });

  it('makes every interactable reachable: standing spot is collision-free and in range', () => {
    for (const item of INTERACTABLES) {
      // Closest the player can stand: directly in front of the desk edge
      const spot = resolveCircleCollisions({ x: item.x, z: item.z + 0.01 }, PLAYER.radius, OBSTACLES);
      expect(findNearbyInteractable(spot.x, spot.z)).toBe(item.id);
    }
  });

  it('reports nothing when the player is far from all interactables', () => {
    expect(findNearbyInteractable(PLAYER.spawn.x, PLAYER.spawn.z)).toBeNull();
  });
});

describe('monitor framing', () => {
  it('fits the screen inside the viewport for landscape and portrait', () => {
    for (const aspect of [21 / 9, 16 / 9, 4 / 3, 1, 9 / 16, 9 / 20]) {
      const { widthFraction, heightFraction, distance } = monitorFraming(aspect);
      expect(distance).toBeGreaterThan(0);
      expect(widthFraction).toBeLessThanOrEqual(0.82 + 1e-9);
      expect(heightFraction).toBeLessThanOrEqual(0.56 + 1e-9);
    }
  });

  it('produces a valid CSS inset() matching the open state format', () => {
    expect(monitorClipPath(16 / 9)).toMatch(/^inset\(\d+\.\d{2}% \d+\.\d{2}% \d+\.\d{2}% \d+\.\d{2}% round 12px\)$/);
  });
});

describe('resolveQuality', () => {
  it('uses the full budget on desktop', () => {
    expect(resolveQuality({ cores: 8, memory: 8, coarsePointer: false, devicePixelRatio: 2.5 })).toEqual({
      tier: 'high',
      maxDpr: 2,
      minDpr: 1,
      shadows: true,
      antialias: true,
    });
  });

  it('caps the pixel ratio and drops shadow maps on phones', () => {
    const profile = resolveQuality({ cores: 8, memory: 8, coarsePointer: true, devicePixelRatio: 3 });
    expect(profile).toMatchObject({ tier: 'medium', maxDpr: 1.5, shadows: false });
  });

  it('classifies low-memory devices as low tier', () => {
    expect(resolveQuality({ cores: 8, memory: 2, coarsePointer: true, devicePixelRatio: 2 }).tier).toBe('low');
    expect(resolveQuality({ cores: 4, memory: 4, coarsePointer: true, devicePixelRatio: 2 })).toMatchObject({
      tier: 'low',
      maxDpr: 1,
      antialias: false,
    });
  });

  it('does not penalise browsers that hide device memory', () => {
    // Safari / Firefox: memory is undefined
    expect(resolveQuality({ cores: 4, memory: undefined, coarsePointer: true, devicePixelRatio: 3 }).tier).toBe('medium');
    expect(resolveQuality({ cores: 2, memory: undefined, coarsePointer: true, devicePixelRatio: 3 }).tier).toBe('low');
  });
});

describe('isSoftwareRenderer', () => {
  it('recognises CPU rasterisers', () => {
    for (const name of [
      'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
      'llvmpipe (LLVM 15.0.7, 256 bits)',
      'Microsoft Basic Render Driver',
      'Software Rasterizer',
    ]) {
      expect(isSoftwareRenderer(name)).toBe(true);
    }
  });

  it('accepts real GPUs and masked renderer names', () => {
    for (const name of ['ANGLE (AMD, AMD Radeon 680M, OpenGL ES 3.2)', 'Apple GPU', 'Adreno (TM) 650', 'Mali-G78', '']) {
      expect(isSoftwareRenderer(name)).toBe(false);
    }
  });
});

describe('BOOT_SCRIPT', () => {
  interface Env {
    search?: string;
    stored?: string | null;
    webgl?: boolean;
    reducedMotion?: boolean;
    saveData?: boolean;
    storageThrows?: boolean;
  }

  /** Runs the inline script against fake browser globals; returns the data-xp attribute it set. */
  function run(env: Env): string | null {
    let attribute: string | null = null;
    const windowLike = env.webgl === false ? {} : { WebGLRenderingContext: function () {} };
    const execute = new Function(
      'document',
      'location',
      'localStorage',
      'window',
      'matchMedia',
      'navigator',
      BOOT_SCRIPT,
    );
    execute(
      { documentElement: { setAttribute: (_name: string, value: string) => (attribute = value) } },
      { search: env.search ?? '' },
      {
        getItem: (key: string) => {
          if (env.storageThrows) throw new Error('blocked');
          return key === VIEW_STORAGE_KEY ? (env.stored ?? null) : null;
        },
      },
      windowLike,
      () => ({ matches: env.reducedMotion === true }),
      { connection: env.saveData ? { saveData: true } : undefined },
    );
    return attribute;
  }

  it('selects the 3D room by default when WebGL exists', () => {
    expect(run({})).toBe('3d');
  });

  it('keeps the classic page without WebGL, on opt-out, reduced motion or data saver', () => {
    expect(run({ webgl: false })).toBeNull();
    expect(run({ stored: 'classic' })).toBeNull();
    expect(run({ search: '?view=classic' })).toBeNull();
    expect(run({ reducedMotion: true })).toBeNull();
    expect(run({ saveData: true })).toBeNull();
  });

  it('lets an explicit 3D choice override reduced motion, and the query override storage', () => {
    expect(run({ stored: '3d', reducedMotion: true })).toBe('3d');
    expect(run({ search: '?view=3d', stored: 'classic' })).toBe('3d');
  });

  it('never throws when storage is blocked (falls back to the classic page)', () => {
    expect(() => run({ storageThrows: true })).not.toThrow();
    expect(run({ storageThrows: true })).toBeNull();
  });
});
