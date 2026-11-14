import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../store';
import { useAssets } from './assets';
import { clampToRoom, resolveCircleCollisions } from './collision';
import { readMoveIntent } from './input';
import { findNearbyInteractable, OBSTACLES, PLAYER, ROOM } from './layout';
import { runtime } from './runtime';

/** Longest simulation step. Clamping keeps collisions stable after a stalled frame or a resumed tab. */
const MAX_STEP = 1 / 20;
const PROXIMITY_INTERVAL = 0.12;
const MOVING_SPEED = 0.35;

/**
 * Placeholder character: a capsule with a visor that shows its heading.
 *
 * Movement is kinematic — input drives a smoothed velocity, the position is
 * integrated, then corrected against the static room colliders. No physics
 * engine is involved, which keeps the initial bundle and per-frame cost low.
 */
export default function Player() {
  const { geo, mat } = useAssets();
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  // Simulation state lives in a ref: it changes every frame and must not re-render.
  const sim = useRef({
    x: PLAYER.spawn.x as number,
    z: PLAYER.spawn.z as number,
    vx: 0,
    vz: 0,
    yaw: 0,
    stride: 0,
    presence: 1,
    proximityTimer: 0,
    intent: { x: 0, z: 0 },
  });

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_STEP);
    const state = sim.current;
    const store = useExperience.getState();
    const controllable = store.view === 'room' && store.cameraFocus === 'player';

    // 1. Input → target velocity (camera yaw is fixed, so intent is already in world space)
    const intent = readMoveIntent(state.intent);
    const targetVx = controllable ? intent.x * PLAYER.speed : 0;
    const targetVz = controllable ? intent.z * PLAYER.speed : 0;
    state.vx = THREE.MathUtils.damp(state.vx, targetVx, PLAYER.acceleration, delta);
    state.vz = THREE.MathUtils.damp(state.vz, targetVz, PLAYER.acceleration, delta);

    // 2. Integrate, then resolve against furniture and walls
    state.x += state.vx * delta;
    state.z += state.vz * delta;
    resolveCircleCollisions(state, PLAYER.radius, OBSTACLES);
    clampToRoom(state, PLAYER.radius, ROOM.halfWidth, ROOM.halfDepth);

    const speed = Math.hypot(state.vx, state.vz);
    const moving = speed > MOVING_SPEED;

    // 3. Turn towards the direction of travel along the shortest arc
    if (moving) {
      const targetYaw = Math.atan2(state.vx, state.vz);
      const difference = Math.atan2(Math.sin(targetYaw - state.yaw), Math.cos(targetYaw - state.yaw));
      state.yaw += difference * (1 - Math.exp(-PLAYER.turnRate * delta));
      if (controllable) store.markMoved();
    }

    // 4. Publish for the camera rig and interaction prompts
    runtime.player.x = state.x;
    runtime.player.z = state.z;

    state.proximityTimer += delta;
    if (state.proximityTimer >= PROXIMITY_INTERVAL) {
      state.proximityTimer = 0;
      store.setNearby(controllable ? findNearbyInteractable(state.x, state.z) : null);
    }

    // 5. Presentation: stride bob, forward lean, and a pop-out while the
    //    camera is zoomed into the monitor (the character would block the view)
    state.stride = moving ? state.stride + delta * speed * 3.2 : 0;
    state.presence = THREE.MathUtils.damp(state.presence, store.cameraFocus === 'computer' ? 0 : 1, 12, delta);

    if (root.current) {
      root.current.position.set(state.x, 0, state.z);
      root.current.rotation.y = state.yaw;
      root.current.scale.setScalar(Math.max(state.presence, 0.0001));
      root.current.visible = state.presence > 0.02;
    }
    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(state.stride)) * 0.07;
      body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, moving ? 0.14 : 0, 10, delta);
    }
  });

  return (
    <group ref={root} position={[PLAYER.spawn.x, 0, PLAYER.spawn.z]}>
      {/* Blob shadow: grounds the character on tiers without shadow maps and at night */}
      <mesh geometry={geo.disc} material={mat.blobShadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} scale={[0.95, 0.95, 1]} />
      <group ref={body}>
        <mesh geometry={geo.capsule} material={mat.player} position={[0, 0.65, 0]} castShadow />
        <mesh geometry={geo.box} material={mat.visor} position={[0, 0.94, 0.24]} scale={[0.36, 0.14, 0.14]} />
      </group>
    </group>
  );
}
