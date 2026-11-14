export type QualityTier = 'low' | 'medium' | 'high';

export interface QualityProfile {
  tier: QualityTier;
  /** Upper bound for the renderer pixel ratio. */
  maxDpr: number;
  /** Floor the adaptive governor may drop to under sustained load. */
  minDpr: number;
  shadows: boolean;
  antialias: boolean;
}

export interface DeviceSignals {
  /** navigator.hardwareConcurrency */
  cores: number;
  /** navigator.deviceMemory in GiB (Chromium only). */
  memory: number | undefined;
  /** Primary pointer is touch. */
  coarsePointer: boolean;
  devicePixelRatio: number;
}

/**
 * Maps coarse device signals to a starting render budget.
 *
 * This is only the *initial* guess: the scene's performance governor lowers
 * or raises the pixel ratio at runtime based on measured frame rate.
 * Unknown memory (Safari/Firefox) is not treated as low to avoid penalising
 * capable devices that simply do not report it.
 */
export function resolveQuality(signals: DeviceSignals): QualityProfile {
  const { cores, memory, coarsePointer, devicePixelRatio } = signals;

  const low =
    memory !== undefined ? memory <= 2 || (memory <= 4 && cores <= 4) : cores <= 2;

  if (low) {
    return { tier: 'low', maxDpr: 1, minDpr: 0.75, shadows: false, antialias: false };
  }
  if (coarsePointer) {
    return {
      tier: 'medium',
      maxDpr: Math.min(devicePixelRatio, 1.5),
      minDpr: 0.75,
      shadows: false,
      antialias: true,
    };
  }
  return {
    tier: 'high',
    maxDpr: Math.min(devicePixelRatio, 2),
    minDpr: 1,
    shadows: true,
    antialias: true,
  };
}

export function detectQuality(): QualityProfile {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return resolveQuality({
    cores: nav.hardwareConcurrency || 4,
    memory: nav.deviceMemory,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    devicePixelRatio: window.devicePixelRatio || 1,
  });
}
