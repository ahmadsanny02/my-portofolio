'use client';

import { Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier';
import * as THREE from 'three';
import { profile } from '@/data/profile';
import { useDisposable } from '../hooks';
import { createCardTextures, type CardTextures } from './cardTexture';

const CARD = {
  width: 1.6,
  height: 2.25,
  cornerRadius: 0.12,
  thickness: 0.03,
  /** Height above the card centre where the strap attaches (top of the clip). */
  anchorY: 1.45,
} as const;

const BAND = { segments: 32, halfWidth: 0.075 } as const;
/** Cursor sway: velocity change (m/s) per frame at the fastest registered pointer speed. */
const SWAY = { gain: 0.55, maxPointerDelta: 0.08, threshold: 0.0015 } as const;
/** Strap joints are low-pass filtered for rendering; faster when they are far from their target. */
const JOINT_SMOOTHING = { min: 10, max: 50 } as const;
const GRAVITY: [number, number, number] = [0, -40, 0];

const SEGMENT_PROPS: RigidBodyProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 2,
  linearDamping: 2,
};

interface PointerState {
  /** The cursor is over the canvas. */
  inside: boolean;
  /** Ignore the next pointer delta (the cursor just entered; its last position is stale). */
  skipNext: boolean;
}

function createLanyardAssets() {
  const { width, height, cornerRadius: r } = CARD;
  const x = -width / 2;
  const y = -height / 2;

  const outline = new THREE.Shape();
  outline.moveTo(x + r, y);
  outline.lineTo(x + width - r, y);
  outline.quadraticCurveTo(x + width, y, x + width, y + r);
  outline.lineTo(x + width, y + height - r);
  outline.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  outline.lineTo(x + r, y + height);
  outline.quadraticCurveTo(x, y + height, x, y + height - r);
  outline.lineTo(x, y + r);
  outline.quadraticCurveTo(x, y, x + r, y);

  // ShapeGeometry emits UVs in shape units; remap them to 0..1 across the card
  const face = new THREE.ShapeGeometry(outline, 6);
  const uv = face.getAttribute('uv') as THREE.BufferAttribute;
  for (let index = 0; index < uv.count; index++) {
    uv.setXY(index, (uv.getX(index) + width / 2) / width, (uv.getY(index) + height / 2) / height);
  }

  const body = new THREE.ExtrudeGeometry(outline, {
    depth: CARD.thickness,
    bevelEnabled: false,
    curveSegments: 6,
  });
  body.translate(0, 0, -CARD.thickness / 2);

  const clip = new THREE.BoxGeometry(0.36, 0.22, 0.07);
  const ring = new THREE.TorusGeometry(0.085, 0.022, 8, 20);

  // Strap: a camera-facing ribbon whose vertices are rewritten every frame.
  // The buffer is allocated once and flagged dynamic, so updating it neither
  // allocates memory nor creates new GPU buffers.
  const ribbon = new THREE.BufferGeometry();
  const ribbonPositions = new THREE.BufferAttribute(
    new Float32Array((BAND.segments + 1) * 2 * 3),
    3,
  );
  ribbonPositions.setUsage(THREE.DynamicDrawUsage);
  ribbon.setAttribute('position', ribbonPositions);
  const indices: number[] = [];
  for (let segment = 0; segment < BAND.segments; segment++) {
    const a = segment * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  ribbon.setIndex(indices);

  const edgeMaterial = new THREE.MeshLambertMaterial({ color: '#0f172a' });
  const metalMaterial = new THREE.MeshLambertMaterial({ color: '#cbd5e1' });
  const bandMaterial = new THREE.MeshBasicMaterial({ color: '#0ea5e9', side: THREE.DoubleSide });

  return {
    face,
    body,
    clip,
    ring,
    ribbon,
    ribbonPositions,
    edgeMaterial,
    metalMaterial,
    bandMaterial,
    dispose() {
      [face, body, clip, ring, ribbon].forEach((geometry) => geometry.dispose());
      [edgeMaterial, metalMaterial, bandMaterial].forEach((material) => material.dispose());
    },
  };
}

interface BandProps {
  textures: CardTextures;
  pointerRef: RefObject<PointerState>;
  onReady: () => void;
}

/**
 * The physical lanyard: a fixed anchor, three strap segments linked by rope
 * joints, and the card hanging from a spherical joint. The card can be
 * dragged (it becomes kinematic while held) and is nudged by cursor movement
 * so it sways as the pointer passes.
 */
function Band({ textures, pointerRef, onReady }: BandProps) {
  const assets = useDisposable(createLanyardAssets);
  // Rewritten every frame; held in a ref because it is a mutable GPU buffer, not render state
  const ribbonPositions = useRef(assets.ribbonPositions);

  const fixed = useRef<RapierRigidBody>(null!);
  const jointA = useRef<RapierRigidBody>(null!);
  const jointB = useRef<RapierRigidBody>(null!);
  const jointC = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  /** Offset between the grab point and the card origin while dragging. */
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null);
  const [hovered, setHovered] = useState(false);

  // Scratch objects reused every frame (no per-frame allocations)
  const scratch = useRef({
    curve: new THREE.CatmullRomCurve3(
      [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
      false,
      'chordal',
    ),
    samples: Array.from({ length: BAND.segments + 1 }, () => new THREE.Vector3()),
    smoothA: new THREE.Vector3(),
    smoothB: new THREE.Vector3(),
    pointerWorld: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    tangent: new THREE.Vector3(),
    side: new THREE.Vector3(),
    lastPointerX: 0,
    initialised: false,
    announced: false,
  });

  useRopeJoint(fixed, jointA, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(jointA, jointB, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(jointB, jointC, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(jointC, card, [[0, 0, 0], [0, CARD.anchorY, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragOffset ? 'grabbing' : 'grab';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragOffset]);

  useFrame((state, rawDelta) => {
    const bodies = {
      fixed: fixed.current,
      a: jointA.current,
      b: jointB.current,
      c: jointC.current,
      card: card.current,
    };
    if (!bodies.fixed || !bodies.a || !bodies.b || !bodies.c || !bodies.card) return;

    const delta = Math.min(rawDelta, 0.05);
    const s = scratch.current;
    const pointerState = pointerRef.current;

    if (dragOffset) {
      // Project the pointer onto a plane facing the camera and move the card there
      s.pointerWorld.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      s.direction.copy(s.pointerWorld).sub(state.camera.position).normalize();
      s.pointerWorld.add(s.direction.multiplyScalar(state.camera.position.length()));
      Object.values(bodies).forEach((body) => body.wakeUp());
      bodies.card.setNextKinematicTranslation({
        x: s.pointerWorld.x - dragOffset.x,
        y: s.pointerWorld.y - dragOffset.y,
        z: s.pointerWorld.z - dragOffset.z,
      });
    } else if (pointerState.inside && !pointerState.skipNext) {
      // Cursor "wind": push the card along the pointer's horizontal motion
      const pointerDelta = THREE.MathUtils.clamp(
        state.pointer.x - s.lastPointerX,
        -SWAY.maxPointerDelta,
        SWAY.maxPointerDelta,
      );
      if (Math.abs(pointerDelta) > SWAY.threshold) {
        const impulse = bodies.card.mass() * SWAY.gain * (pointerDelta / SWAY.maxPointerDelta);
        bodies.card.applyImpulse({ x: impulse, y: 0, z: -Math.abs(impulse) * 0.35 }, true);
        bodies.card.applyTorqueImpulse({ x: 0, y: impulse * 0.08, z: 0 }, true);
      }
    }
    s.lastPointerX = state.pointer.x;
    pointerState.skipNext = false;

    // Smooth the two middle joints so the rendered strap does not jitter
    const targetA = bodies.a.translation();
    const targetB = bodies.b.translation();
    if (!s.initialised) {
      s.smoothA.copy(targetA);
      s.smoothB.copy(targetB);
      s.initialised = true;
    }
    for (const [smooth, target] of [
      [s.smoothA, targetA],
      [s.smoothB, targetB],
    ] as const) {
      const distance = THREE.MathUtils.clamp(smooth.distanceTo(target), 0.1, 1);
      const rate = JOINT_SMOOTHING.min + distance * (JOINT_SMOOTHING.max - JOINT_SMOOTHING.min);
      smooth.lerp(target, Math.min(1, delta * rate));
    }

    // Rebuild the ribbon along a curve through the joints, facing the camera
    s.curve.points[0].copy(bodies.c.translation());
    s.curve.points[1].copy(s.smoothB);
    s.curve.points[2].copy(s.smoothA);
    s.curve.points[3].copy(bodies.fixed.translation());
    for (let index = 0; index <= BAND.segments; index++) {
      s.curve.getPoint(index / BAND.segments, s.samples[index]);
    }
    const positions = ribbonPositions.current;
    for (let index = 0; index <= BAND.segments; index++) {
      const point = s.samples[index];
      const next = s.samples[Math.min(index + 1, BAND.segments)];
      const previous = s.samples[Math.max(index - 1, 0)];
      s.tangent.copy(next).sub(previous);
      s.direction.copy(state.camera.position).sub(point);
      s.side.crossVectors(s.tangent, s.direction).normalize().multiplyScalar(BAND.halfWidth);
      positions.setXYZ(index * 2, point.x - s.side.x, point.y - s.side.y, point.z - s.side.z);
      positions.setXYZ(index * 2 + 1, point.x + s.side.x, point.y + s.side.y, point.z + s.side.z);
    }
    positions.needsUpdate = true;

    // Gently steer the card back to face the viewer
    const angularVelocity = bodies.card.angvel();
    const rotation = bodies.card.rotation();
    bodies.card.setAngvel(
      { x: angularVelocity.x, y: angularVelocity.y - rotation.y * 0.25, z: angularVelocity.z },
      false,
    );

    if (!s.announced) {
      s.announced = true;
      onReady();
    }
  });

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);
    setDragOffset(new THREE.Vector3().copy(event.point).sub(card.current.translation()));
  };
  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    (event.target as Element).releasePointerCapture(event.pointerId);
    setDragOffset(null);
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEGMENT_PROPS} type="fixed" />
        <RigidBody ref={jointA} position={[0.5, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={jointB} position={[1, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={jointC} position={[1.5, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={card}
          position={[2, 0, 0]}
          {...SEGMENT_PROPS}
          type={dragOffset ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD.width / 2, CARD.height / 2, 0.01]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={startDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <mesh geometry={assets.body} material={assets.edgeMaterial} />
            <mesh geometry={assets.face} position={[0, 0, CARD.thickness / 2 + 0.002]}>
              <meshStandardMaterial map={textures.front} roughness={0.55} metalness={0} />
            </mesh>
            <mesh
              geometry={assets.face}
              position={[0, 0, -CARD.thickness / 2 - 0.002]}
              rotation={[0, Math.PI, 0]}
            >
              <meshStandardMaterial map={textures.back} roughness={0.55} metalness={0} />
            </mesh>
            <mesh geometry={assets.clip} material={assets.metalMaterial} position={[0, CARD.height / 2 + 0.1, 0]} />
            <mesh geometry={assets.ring} material={assets.metalMaterial} position={[0, CARD.anchorY - 0.07, 0]} />
          </group>
        </RigidBody>
      </group>

      {/* World-space ribbon: vertices come straight from the physics bodies */}
      <mesh geometry={assets.ribbon} material={assets.bandMaterial} frustumCulled={false} />
    </>
  );
}

interface LanyardCanvasProps {
  /** Render and simulate only while the lanyard is on screen. */
  active: boolean;
  onReady: () => void;
}

/**
 * Self-contained WebGL canvas for the About section's ID card.
 * The physics engine (Rapier, WebAssembly) is part of this lazily loaded
 * chunk, so it is never downloaded by visitors who do not reach the section.
 */
export default function LanyardCanvas({ active, onReady }: LanyardCanvasProps) {
  const [textures, setTextures] = useState<CardTextures | null>(null);
  const pointer = useRef<PointerState>({ inside: false, skipNext: true });

  useEffect(() => {
    let cancelled = false;
    let created: CardTextures | null = null;

    createCardTextures({
      name: profile.fullName,
      role: profile.role,
      brand: `${profile.brand.primary} ${profile.brand.accent}`,
      location: profile.location,
      experience: `${profile.about.experience.value} Years`,
      handle: `@${profile.socials.github.split('/').pop() ?? ''}`,
      photoUrl: profile.photo,
    }).then((result) => {
      if (cancelled) {
        result.front.dispose();
        result.back.dispose();
        return;
      }
      created = result;
      setTextures(result);
    });

    return () => {
      cancelled = true;
      created?.front.dispose();
      created?.back.dispose();
    };
  }, []);

  return (
    <Canvas
      role="img"
      aria-label={`ID card of ${profile.fullName}, ${profile.role}. Drag it or move the pointer to make it swing.`}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 11.5], fov: 25 }}
      // Vertical swipes keep scrolling the page; horizontal drags reach the card
      style={{ touchAction: 'pan-y' }}
      onPointerEnter={() => {
        pointer.current.inside = true;
        pointer.current.skipNext = true;
      }}
      onPointerLeave={() => {
        pointer.current.inside = false;
      }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 5, 8]} intensity={1.5} />
      <Suspense fallback={null}>
        <Physics gravity={GRAVITY} timeStep={1 / 60} paused={!active}>
          {textures && <Band textures={textures} pointerRef={pointer} onReady={onReady} />}
        </Physics>
      </Suspense>
    </Canvas>
  );
}
