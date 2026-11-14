import { create } from 'zustand';
import { prefersReducedMotion } from './boot';
import type { QualityProfile } from './quality';

export type ExperienceMode = 'boot' | 'classic' | '3d';
export type ExperienceView = 'room' | 'portfolio';
export type CameraFocus = 'player' | 'computer';
export type InteractableId = 'computer' | 'lamp';
export type ThemeName = 'light' | 'dark';
export type FallbackReason =
  | 'unsupported'
  | 'software-rendering'
  | 'reduced-motion'
  | 'save-data'
  | 'user-choice'
  | 'context-lost'
  | 'error';

/** Scroll offset in px, or the id of an element to bring into view. */
export type ScrollTarget = number | string;

/** Time the camera travels towards the monitor before the overlay opens. */
export const CAMERA_TRAVEL_MS = 750;

interface OpenOptions {
  /** Skip the camera travel and the reveal animation (deep links, back navigation). */
  immediate?: boolean;
  scrollTo?: ScrollTarget;
}

interface ExperienceState {
  /** `boot` until the client has decided between the 3D room and the classic page. */
  mode: ExperienceMode;
  /** WebGL exists, so the classic page may offer a way into the 3D room. */
  canEnter3d: boolean;
  fallbackReason: FallbackReason | null;
  quality: QualityProfile | null;
  /** The first frames have been rendered; the loading cover can be dismissed. */
  sceneReady: boolean;
  view: ExperienceView;
  cameraFocus: CameraFocus;
  /** The overlay fully covers the canvas, so the render loop can be suspended. */
  overlaySettled: boolean;
  overlayInstant: boolean;
  pendingScroll: ScrollTarget | null;
  nearby: InteractableId | null;
  hasMoved: boolean;
  theme: ThemeName;
  themeToggler: (() => void) | null;

  enter3d: (quality: QualityProfile) => void;
  enterClassic: (reason: FallbackReason, canEnter3d: boolean) => void;
  markSceneReady: () => void;
  openPortfolio: (options?: OpenOptions) => void;
  closePortfolio: () => void;
  setOverlaySettled: (settled: boolean) => void;
  takePendingScroll: () => ScrollTarget | null;
  setNearby: (id: InteractableId | null) => void;
  markMoved: () => void;
  syncTheme: (theme: ThemeName, toggler: () => void) => void;
  toggleTheme: () => void;
  activate: (id: InteractableId) => void;
  reset: () => void;
}

const SESSION_DEFAULTS = {
  sceneReady: false,
  view: 'room' as ExperienceView,
  cameraFocus: 'player' as CameraFocus,
  overlaySettled: false,
  overlayInstant: false,
  pendingScroll: null as ScrollTarget | null,
  nearby: null as InteractableId | null,
  hasMoved: false,
};

let openTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Single source of truth shared by the WebGL scene and the DOM.
 *
 * React Three Fiber renders in its own reconciler, so React context from the
 * page does not reach scene components reliably. A module-level store is
 * reachable from both sides and lets per-frame code read state through
 * `getState()` without subscribing to re-renders.
 */
export const useExperience = create<ExperienceState>()((set, get) => ({
  mode: 'boot',
  canEnter3d: false,
  fallbackReason: null,
  quality: null,
  theme: 'light',
  themeToggler: null,
  ...SESSION_DEFAULTS,

  enter3d: (quality) => {
    clearTimeout(openTimer);
    set({ ...SESSION_DEFAULTS, mode: '3d', quality, canEnter3d: true, fallbackReason: null });
  },

  enterClassic: (reason, canEnter3d) => {
    clearTimeout(openTimer);
    set({ ...SESSION_DEFAULTS, mode: 'classic', fallbackReason: reason, canEnter3d });
  },

  markSceneReady: () => {
    if (!get().sceneReady) set({ sceneReady: true });
  },

  openPortfolio: (options) => {
    const state = get();
    if (state.mode !== '3d' || state.view !== 'room' || state.cameraFocus !== 'player') return;

    const immediate = options?.immediate === true || prefersReducedMotion();
    set({
      cameraFocus: 'computer',
      nearby: null,
      overlayInstant: immediate,
      pendingScroll: options?.scrollTo ?? null,
    });

    clearTimeout(openTimer);
    if (immediate) set({ view: 'portfolio' });
    else openTimer = setTimeout(() => set({ view: 'portfolio' }), CAMERA_TRAVEL_MS);
  },

  closePortfolio: () => {
    clearTimeout(openTimer);
    set({ view: 'room', cameraFocus: 'player', overlaySettled: false, overlayInstant: false });
  },

  setOverlaySettled: (settled) => {
    if (get().overlaySettled !== settled) set({ overlaySettled: settled });
  },

  takePendingScroll: () => {
    const target = get().pendingScroll;
    if (target !== null) set({ pendingScroll: null });
    return target;
  },

  setNearby: (id) => {
    if (get().nearby !== id) set({ nearby: id });
  },

  markMoved: () => {
    if (!get().hasMoved) set({ hasMoved: true });
  },

  syncTheme: (theme, toggler) => set({ theme, themeToggler: toggler }),

  toggleTheme: () => get().themeToggler?.(),

  activate: (id) => {
    if (id === 'computer') get().openPortfolio();
    else get().toggleTheme();
  },

  reset: () => {
    clearTimeout(openTimer);
    set({
      ...SESSION_DEFAULTS,
      mode: 'boot',
      canEnter3d: false,
      fallbackReason: null,
      quality: null,
    });
  },
}));
