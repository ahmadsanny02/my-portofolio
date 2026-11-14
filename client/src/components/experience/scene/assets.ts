import { createContext, useContext } from 'react';
import * as THREE from 'three';

/**
 * Shared geometries and materials for the room.
 *
 * Every prop in the scene is a scaled instance of a few unit primitives and
 * a small material palette. Sharing them keeps GPU memory flat (one vertex
 * buffer per primitive, one shader program per material type) and makes
 * teardown a single `dispose()` call.
 */
export interface SceneAssets {
  geo: {
    box: THREE.BoxGeometry;
    cylinder: THREE.CylinderGeometry;
    shade: THREE.CylinderGeometry;
    sphere: THREE.SphereGeometry;
    foliage: THREE.IcosahedronGeometry;
    capsule: THREE.CapsuleGeometry;
    marker: THREE.OctahedronGeometry;
    disc: THREE.CircleGeometry;
    plane: THREE.PlaneGeometry;
  };
  mat: {
    floor: THREE.MeshLambertMaterial;
    wall: THREE.MeshLambertMaterial;
    trim: THREE.MeshLambertMaterial;
    wood: THREE.MeshLambertMaterial;
    woodDark: THREE.MeshLambertMaterial;
    metal: THREE.MeshLambertMaterial;
    plastic: THREE.MeshLambertMaterial;
    fabric: THREE.MeshLambertMaterial;
    primary: THREE.MeshLambertMaterial;
    accent: THREE.MeshLambertMaterial;
    accentSoft: THREE.MeshLambertMaterial;
    pink: THREE.MeshLambertMaterial;
    terracotta: THREE.MeshLambertMaterial;
    leaf: THREE.MeshLambertMaterial;
    leafDark: THREE.MeshLambertMaterial;
    shade: THREE.MeshLambertMaterial;
    book: THREE.MeshLambertMaterial;
    player: THREE.MeshLambertMaterial;
    visor: THREE.MeshLambertMaterial;
    /** Unlit materials whose colour is animated with the day/night cycle. */
    windowGlass: THREE.MeshBasicMaterial;
    bulb: THREE.MeshBasicMaterial;
    marker: THREE.MeshBasicMaterial;
    blobShadow: THREE.MeshBasicMaterial;
  };
  dispose(): void;
}

const lambert = (color: string, parameters?: THREE.MeshLambertMaterialParameters) =>
  new THREE.MeshLambertMaterial({ color, ...parameters });

export function createSceneAssets(): SceneAssets {
  const geo: SceneAssets['geo'] = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
    // Open truncated cone used for the lamp shade
    shade: new THREE.CylinderGeometry(0.22, 0.5, 1, 20, 1, true),
    sphere: new THREE.SphereGeometry(0.5, 18, 12),
    foliage: new THREE.IcosahedronGeometry(0.5, 1),
    capsule: new THREE.CapsuleGeometry(0.3, 0.7, 6, 14),
    marker: new THREE.OctahedronGeometry(0.1, 0),
    disc: new THREE.CircleGeometry(0.5, 24),
    plane: new THREE.PlaneGeometry(1, 1),
  };

  const mat: SceneAssets['mat'] = {
    floor: lambert('#d6b48c'),
    wall: lambert('#f1f5f9'),
    trim: lambert('#cbd5e1'),
    wood: lambert('#b0815a'),
    woodDark: lambert('#8a6243'),
    metal: lambert('#334155'),
    plastic: lambert('#1e293b'),
    fabric: lambert('#f8fafc'),
    primary: lambert('#0ea5e9'),
    accent: lambert('#a78bfa'),
    accentSoft: lambert('#c4b5fd'),
    pink: lambert('#f472b6'),
    terracotta: lambert('#c2643c'),
    leaf: lambert('#22c55e'),
    leafDark: lambert('#15803d'),
    shade: lambert('#fbbf24', { side: THREE.DoubleSide, emissive: '#fbbf24', emissiveIntensity: 0 }),
    // White base colour: per-instance colours are multiplied on top
    book: lambert('#ffffff'),
    player: lambert('#0ea5e9'),
    visor: lambert('#0f172a'),
    windowGlass: new THREE.MeshBasicMaterial({ color: '#bfe3ff' }),
    bulb: new THREE.MeshBasicMaterial({ color: '#94a3b8' }),
    marker: new THREE.MeshBasicMaterial({ color: '#0ea5e9' }),
    blobShadow: new THREE.MeshBasicMaterial({
      color: '#000000',
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  };

  return {
    geo,
    mat,
    dispose() {
      Object.values(geo).forEach((geometry) => geometry.dispose());
      Object.values(mat).forEach((material) => material.dispose());
    },
  };
}

export const AssetsContext = createContext<SceneAssets | null>(null);

export function useAssets(): SceneAssets {
  const assets = useContext(AssetsContext);
  if (!assets) throw new Error('useAssets must be used inside the scene');
  return assets;
}
