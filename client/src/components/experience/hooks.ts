import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Creates a GPU-backed resource once and releases it when the owner unmounts.
 *
 * three.js objects hold WebGL buffers/programs/textures that the garbage
 * collector cannot reclaim; they must be disposed explicitly. A disposed
 * resource that is used again (React StrictMode re-runs effects in
 * development) is transparently re-uploaded by the renderer.
 */
export function useDisposable<T extends { dispose(): void }>(factory: () => T): T {
  const [resource] = useState(factory);
  useEffect(() => () => resource.dispose(), [resource]);
  return resource;
}

function subscribeToVisibility(onChange: () => void): () => void {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** False while the tab is in the background, so render loops can be suspended. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  );
}

/** Tracks a CSS media query. Returns `false` during server rendering. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
