import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../store';
import { useAssets } from './assets';
import { LAMP, MONITOR } from './layout';
import { runtime } from './runtime';

const DAY = {
  background: new THREE.Color('#dbeafe'),
  ambient: new THREE.Color('#ffffff'),
  glass: new THREE.Color('#bfe3ff'),
  bulb: new THREE.Color('#94a3b8'),
  ambientIntensity: 1.25,
  hemisphereIntensity: 0.9,
  sunIntensity: 2.1,
};

const NIGHT = {
  background: new THREE.Color('#0b1120'),
  ambient: new THREE.Color('#7c8fd1'),
  glass: new THREE.Color('#16224a'),
  bulb: new THREE.Color('#fff1c2'),
  ambientIntensity: 0.3,
  hemisphereIntensity: 0.12,
  lampIntensity: 20,
  screenGlowIntensity: 2.4,
  shadeGlow: 0.9,
};

/** Smoothing rate (1/s) of the day/night transition. */
const TRANSITION_RATE = 3.2;

/**
 * Scene lighting driven by the site theme.
 *
 * Light theme = daylight (ambient + sun). Dark theme = night: the sun fades
 * out and the desk lamp and monitor become the light sources. All values are
 * interpolated every frame from a single smoothed factor, so toggling the
 * lamp produces a continuous transition instead of a hard switch.
 */
export default function Lighting() {
  const assets = useAssets();
  const shadows = useExperience((state) => state.quality?.shadows ?? false);

  const ambient = useRef<THREE.AmbientLight>(null);
  const hemisphere = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const lamp = useRef<THREE.PointLight>(null);
  const screenGlow = useRef<THREE.PointLight>(null);
  const initialised = useRef(false);
  // Materials animated with the day/night cycle. They are mutable GPU-side
  // objects rather than render state, hence the ref.
  const animated = useRef({
    glass: assets.mat.windowGlass,
    bulb: assets.mat.bulb,
    shade: assets.mat.shade,
  });

  useFrame((state, rawDelta) => {
    const target = useExperience.getState().theme === 'dark' ? 1 : 0;
    if (initialised.current) {
      runtime.night = THREE.MathUtils.damp(runtime.night, target, TRANSITION_RATE, Math.min(rawDelta, 0.1));
    } else {
      // Start in the correct state instead of animating from daylight on load
      runtime.night = target;
      initialised.current = true;
    }
    const night = runtime.night;
    const { lerp } = THREE.MathUtils;

    if (ambient.current) {
      ambient.current.intensity = lerp(DAY.ambientIntensity, NIGHT.ambientIntensity, night);
      ambient.current.color.lerpColors(DAY.ambient, NIGHT.ambient, night);
    }
    if (hemisphere.current) {
      hemisphere.current.intensity = lerp(DAY.hemisphereIntensity, NIGHT.hemisphereIntensity, night);
    }
    if (sun.current) {
      sun.current.intensity = lerp(DAY.sunIntensity, 0, night);
      // Skip the shadow pass entirely once the sun no longer contributes
      sun.current.visible = night < 0.995;
    }
    if (lamp.current) lamp.current.intensity = NIGHT.lampIntensity * night;
    if (screenGlow.current) screenGlow.current.intensity = NIGHT.screenGlowIntensity * night;

    animated.current.glass.color.lerpColors(DAY.glass, NIGHT.glass, night);
    animated.current.bulb.color.lerpColors(DAY.bulb, NIGHT.bulb, night);
    animated.current.shade.emissiveIntensity = NIGHT.shadeGlow * night;

    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.lerpColors(DAY.background, NIGHT.background, night);
    }
  });

  return (
    <>
      <color attach="background" args={['#dbeafe']} />
      <ambientLight ref={ambient} intensity={DAY.ambientIntensity} />
      <hemisphereLight ref={hemisphere} args={['#ffffff', '#b89b7a', DAY.hemisphereIntensity]} />
      <directionalLight
        ref={sun}
        position={[4.5, 9, 6]}
        intensity={DAY.sunIntensity}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.5, 30]} />
      </directionalLight>
      <pointLight
        ref={lamp}
        position={[LAMP.x, 1.36, LAMP.z + 0.14]}
        color="#ffbf73"
        intensity={0}
        distance={11}
        decay={2}
      />
      <pointLight
        ref={screenGlow}
        position={[MONITOR.x, MONITOR.y, MONITOR.z + 0.55]}
        color="#7dd3fc"
        intensity={0}
        distance={5}
        decay={2}
      />
    </>
  );
}
