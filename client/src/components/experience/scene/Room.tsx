import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAssets } from './assets';
import { BED, CHAIR, DESK, OTTOMAN, PLANT, ROOM, RUG, SHELF } from './layout';

type Vec3 = [number, number, number];

interface PartProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: Vec3;
  scale?: Vec3;
  rotation?: Vec3;
  /** Casts a shadow (only has an effect on tiers with shadow maps enabled). */
  cast?: boolean;
  receive?: boolean;
}

const UNIT: Vec3 = [1, 1, 1];
const NO_ROTATION: Vec3 = [0, 0, 0];

/** One scaled instance of a shared unit primitive. */
function Part({
  geometry,
  material,
  position,
  scale = UNIT,
  rotation = NO_ROTATION,
  cast = true,
  receive = false,
}: PartProps) {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow={cast}
      receiveShadow={receive}
    />
  );
}

// ── Bookshelf contents ──────────────────────────────────────────────────────

const BOOK_COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
/** Height of each shelf board's top surface. */
const SHELF_LEVELS = [0.075, 0.675, 1.275];
const BOOKS_PER_SHELF = 10;

/** Deterministic pseudo-variation keeps the layout identical on every render. */
const BOOKS = SHELF_LEVELS.flatMap((levelY, level) =>
  Array.from({ length: BOOKS_PER_SHELF }, (_, slot) => {
    const seed = level * BOOKS_PER_SHELF + slot;
    const height = 0.32 + ((seed * 37) % 11) * 0.014;
    const thickness = 0.085 + ((seed * 13) % 4) * 0.012;
    return {
      x: SHELF.x + 0.02,
      y: levelY + height / 2,
      z: SHELF.z - 0.7 + slot * 0.145,
      height,
      thickness,
      color: BOOK_COLORS[seed % BOOK_COLORS.length],
    };
  }),
).filter((_, index) => index % 7 !== 6); // leave a few gaps on the shelves

/**
 * All books are drawn with a single instanced draw call; per-book colour is
 * supplied through the instance colour attribute.
 */
function Books() {
  const assets = useAssets();
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const color = new THREE.Color();

    BOOKS.forEach((book, index) => {
      position.set(book.x, book.y, book.z);
      scale.set(0.3, book.height, book.thickness);
      mesh.setMatrixAt(index, matrix.compose(position, rotation, scale));
      mesh.setColorAt(index, color.set(book.color));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);

  return <instancedMesh ref={ref} args={[assets.geo.box, assets.mat.book, BOOKS.length]} castShadow />;
}

// ── Room ────────────────────────────────────────────────────────────────────

const WALL_Y = ROOM.wallHeight / 2;
const BACK_WALL_Z = -ROOM.halfDepth - ROOM.wallThickness / 2;
const SIDE_WALL_X = ROOM.halfWidth + ROOM.wallThickness / 2;
const ROOM_WIDTH = ROOM.halfWidth * 2 + ROOM.wallThickness * 2;
const ROOM_DEPTH = ROOM.halfDepth * 2 + ROOM.wallThickness * 2;
/** Surfaces mounted on the back wall sit just in front of it. */
const WALL_SURFACE_Z = -ROOM.halfDepth + 0.02;

const WINDOW = { x: 1.3, y: 1.9, width: 1.9, height: 1.4 } as const;
const CHAIR_LEG_OFFSETS: [number, number][] = [
  [-0.22, -0.22],
  [0.22, -0.22],
  [-0.22, 0.22],
  [0.22, 0.22],
];

/**
 * Static room shell and furniture, built entirely from shared unit
 * primitives. These are placeholders: each group can later be swapped for a
 * modelled asset without touching the collision data in `layout.ts`.
 */
export default function Room() {
  const { geo, mat } = useAssets();

  return (
    <group>
      {/* Shell */}
      <Part geometry={geo.box} material={mat.floor} position={[0, -0.1, 0]} scale={[ROOM_WIDTH, 0.2, ROOM_DEPTH]} cast={false} receive />
      <Part geometry={geo.box} material={mat.wall} position={[0, WALL_Y, BACK_WALL_Z]} scale={[ROOM_WIDTH, ROOM.wallHeight, ROOM.wallThickness]} cast={false} receive />
      <Part geometry={geo.box} material={mat.wall} position={[-SIDE_WALL_X, WALL_Y, 0]} scale={[ROOM.wallThickness, ROOM.wallHeight, ROOM_DEPTH]} cast={false} receive />
      <Part geometry={geo.box} material={mat.wall} position={[SIDE_WALL_X, WALL_Y, 0]} scale={[ROOM.wallThickness, ROOM.wallHeight, ROOM_DEPTH]} cast={false} receive />
      <Part geometry={geo.box} material={mat.trim} position={[0, 0.06, -ROOM.halfDepth + 0.02]} scale={[ROOM.halfWidth * 2, 0.12, 0.04]} cast={false} />
      <Part geometry={geo.box} material={mat.trim} position={[-ROOM.halfWidth + 0.02, 0.06, 0]} scale={[0.04, 0.12, ROOM.halfDepth * 2]} cast={false} />
      <Part geometry={geo.box} material={mat.trim} position={[ROOM.halfWidth - 0.02, 0.06, 0]} scale={[0.04, 0.12, ROOM.halfDepth * 2]} cast={false} />

      {/* Rug */}
      <Part geometry={geo.box} material={mat.accent} position={[RUG.x, 0.011, RUG.z]} scale={[RUG.width, 0.02, RUG.depth]} cast={false} receive />
      <Part geometry={geo.box} material={mat.accentSoft} position={[RUG.x, 0.013, RUG.z]} scale={[RUG.width - 0.5, 0.02, RUG.depth - 0.5]} cast={false} receive />

      {/* Desk */}
      <Part geometry={geo.box} material={mat.wood} position={[DESK.x, DESK.height - 0.03, DESK.z]} scale={[DESK.width, 0.06, DESK.depth]} receive />
      <Part geometry={geo.box} material={mat.woodDark} position={[DESK.x - DESK.width / 2 + 0.06, 0.375, DESK.z]} scale={[0.06, 0.75, DESK.depth - 0.1]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[DESK.x + DESK.width / 2 - 0.06, 0.375, DESK.z]} scale={[0.06, 0.75, DESK.depth - 0.1]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[DESK.x, 0.5, DESK.z - DESK.depth / 2 + 0.06]} scale={[DESK.width - 0.18, 0.42, 0.04]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[DESK.x + 0.98, 0.36, DESK.z]} scale={[0.62, 0.62, DESK.depth - 0.2]} />
      {/* PC tower under the desk */}
      <Part geometry={geo.box} material={mat.plastic} position={[DESK.x - 1, 0.3, DESK.z]} scale={[0.3, 0.6, 0.62]} />

      {/* Chair */}
      <group position={[CHAIR.x, 0, CHAIR.z]} rotation={[0, CHAIR.rotation, 0]}>
        <Part geometry={geo.box} material={mat.primary} position={[0, 0.48, 0]} scale={[0.55, 0.07, 0.55]} />
        <Part geometry={geo.box} material={mat.primary} position={[0, 0.8, 0.26]} scale={[0.55, 0.56, 0.07]} />
        {CHAIR_LEG_OFFSETS.map(([x, z]) => (
          <Part key={`${x}:${z}`} geometry={geo.box} material={mat.metal} position={[x, 0.23, z]} scale={[0.05, 0.46, 0.05]} />
        ))}
      </group>

      {/* Bookshelf */}
      <Part geometry={geo.box} material={mat.woodDark} position={[SHELF.x - SHELF.width / 2 + 0.03, SHELF.height / 2, SHELF.z]} scale={[0.06, SHELF.height, SHELF.depth]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[SHELF.x, SHELF.height / 2, SHELF.z - SHELF.depth / 2 + 0.03]} scale={[SHELF.width, SHELF.height, 0.06]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[SHELF.x, SHELF.height / 2, SHELF.z + SHELF.depth / 2 - 0.03]} scale={[SHELF.width, SHELF.height, 0.06]} />
      {[...SHELF_LEVELS, SHELF.height].map((top) => (
        <Part key={top} geometry={geo.box} material={mat.wood} position={[SHELF.x, top - 0.025, SHELF.z]} scale={[SHELF.width, 0.05, SHELF.depth - 0.1]} />
      ))}
      <Books />

      {/* Bed */}
      <Part geometry={geo.box} material={mat.wood} position={[BED.x, 0.15, BED.z]} scale={[BED.width, 0.3, BED.depth]} />
      <Part geometry={geo.box} material={mat.woodDark} position={[BED.x, 0.5, BED.z - BED.depth / 2 + 0.06]} scale={[BED.width, 1, 0.12]} />
      <Part geometry={geo.box} material={mat.fabric} position={[BED.x, 0.41, BED.z + 0.03]} scale={[BED.width - 0.15, 0.22, BED.depth - 0.2]} receive />
      <Part geometry={geo.box} material={mat.primary} position={[BED.x, 0.53, BED.z + 0.56]} scale={[BED.width - 0.11, 0.08, 1.9]} receive />
      <Part geometry={geo.box} material={mat.fabric} position={[BED.x, 0.59, BED.z - 1.12]} scale={[1.3, 0.14, 0.5]} />

      {/* Plant */}
      <Part geometry={geo.cylinder} material={mat.terracotta} position={[PLANT.x, 0.225, PLANT.z]} scale={[0.5, 0.45, 0.5]} />
      <Part geometry={geo.foliage} material={mat.leaf} position={[PLANT.x, 0.95, PLANT.z]} scale={[0.9, 0.9, 0.9]} />
      <Part geometry={geo.foliage} material={mat.leafDark} position={[PLANT.x + 0.2, 1.36, PLANT.z + 0.1]} scale={[0.6, 0.6, 0.6]} />
      <Part geometry={geo.foliage} material={mat.leafDark} position={[PLANT.x - 0.18, 1.26, PLANT.z - 0.05]} scale={[0.5, 0.5, 0.5]} />

      {/* Ottoman */}
      <Part geometry={geo.cylinder} material={mat.pink} position={[OTTOMAN.x, 0.2, OTTOMAN.z]} scale={[OTTOMAN.radius * 2, 0.4, OTTOMAN.radius * 2]} />

      {/* Window — the glass colour follows the day/night cycle (see Lighting) */}
      <Part geometry={geo.box} material={mat.fabric} position={[WINDOW.x, WINDOW.y, WALL_SURFACE_Z]} scale={[WINDOW.width, WINDOW.height, 0.06]} cast={false} />
      <Part geometry={geo.plane} material={mat.windowGlass} position={[WINDOW.x, WINDOW.y, WALL_SURFACE_Z + 0.035]} scale={[WINDOW.width - 0.2, WINDOW.height - 0.2, 1]} cast={false} />
      <Part geometry={geo.box} material={mat.fabric} position={[WINDOW.x, WINDOW.y, WALL_SURFACE_Z + 0.04]} scale={[0.05, WINDOW.height - 0.2, 0.02]} cast={false} />
      <Part geometry={geo.box} material={mat.fabric} position={[WINDOW.x, WINDOW.y, WALL_SURFACE_Z + 0.04]} scale={[WINDOW.width - 0.2, 0.05, 0.02]} cast={false} />
      <Part geometry={geo.box} material={mat.trim} position={[WINDOW.x, WINDOW.y - WINDOW.height / 2 - 0.03, WALL_SURFACE_Z + 0.08]} scale={[WINDOW.width + 0.1, 0.05, 0.16]} />

      {/* Wall art */}
      <Part geometry={geo.box} material={mat.plastic} position={[BED.x, 2.2, WALL_SURFACE_Z]} scale={[1.05, 0.72, 0.04]} cast={false} />
      <Part geometry={geo.plane} material={mat.accent} position={[BED.x, 2.2, WALL_SURFACE_Z + 0.025]} scale={[0.9, 0.57, 1]} cast={false} />
      <Part geometry={geo.box} material={mat.plastic} position={[-3.75, 2.05, WALL_SURFACE_Z]} scale={[0.72, 0.95, 0.04]} cast={false} />
      <Part geometry={geo.plane} material={mat.primary} position={[-3.75, 2.05, WALL_SURFACE_Z + 0.025]} scale={[0.58, 0.81, 1]} cast={false} />
    </group>
  );
}
