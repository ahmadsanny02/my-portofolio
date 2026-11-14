import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../store';
import { CAMERA, MONITOR, monitorFraming, PLAYER } from './layout';
import { runtime } from './runtime';

/** Smoothing rates (1/s). The monitor zoom is snappier so it settles before the overlay opens. */
const FOLLOW_RATE = 4.5;
const FOCUS_RATE = 6.5;
/** Metres the look-at point moves towards the camera per unit of portrait pull-back. */
const PORTRAIT_LOOK_AHEAD = 1.6;
/** How much of the player's lateral offset the camera follows (keeps the room framed). */
const LATERAL_FOLLOW = 0.85;

/**
 * Camera rig with two targets: a fixed-angle third-person follow, and a
 * close-up of the monitor used as the transition into the portfolio overlay.
 * Both are reached through exponential damping, so interrupting one with the
 * other never produces a jump.
 */
export default function FollowCamera() {
  const lookAt = useRef(new THREE.Vector3(PLAYER.spawn.x, CAMERA.lookHeight, PLAYER.spawn.z));
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredLookAt = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const aspect = state.size.width / state.size.height;
    const focus = useExperience.getState().cameraFocus;
    let rate: number;

    if (focus === 'computer') {
      const { distance } = monitorFraming(aspect);
      desiredPosition.current.set(MONITOR.x, MONITOR.y, MONITOR.z + distance);
      desiredLookAt.current.set(MONITOR.x, MONITOR.y, MONITOR.z);
      rate = FOCUS_RATE;
    } else {
      // Portrait viewports have a narrow horizontal field of view: pull back to keep context
      const pullBack = THREE.MathUtils.clamp(1.25 / aspect, 1, 1.7);
      const { x, z } = runtime.player;
      desiredPosition.current.set(
        x * LATERAL_FOLLOW,
        CAMERA.followHeight * pullBack,
        z + CAMERA.followDistance * pullBack,
      );
      // …and aim slightly in front of the character so the room fills the tall frame
      const lookAhead = (pullBack - 1) * PORTRAIT_LOOK_AHEAD;
      desiredLookAt.current.set(x * LATERAL_FOLLOW, CAMERA.lookHeight, z + lookAhead);
      rate = FOLLOW_RATE;
    }

    const blend = 1 - Math.exp(-rate * delta);
    state.camera.position.lerp(desiredPosition.current, blend);
    lookAt.current.lerp(desiredLookAt.current, blend);
    state.camera.lookAt(lookAt.current);
  });

  return null;
}
