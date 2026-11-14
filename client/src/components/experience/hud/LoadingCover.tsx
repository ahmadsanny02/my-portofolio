'use client';

import { storeViewPreference } from '../boot';
import { useExperience } from '../store';

/**
 * Full-screen cover shown while the 3D room downloads and warms up.
 *
 * It is part of the server-rendered HTML and revealed purely by CSS
 * (`html[data-xp='3d']`, set by the boot script before first paint), so
 * WebGL-capable visitors see it immediately instead of a flash of the
 * classic layout.
 */
export default function LoadingCover() {
  const hidden = useExperience(
    (state) =>
      state.mode === 'classic' ||
      (state.mode === '3d' && (state.sceneReady || state.view === 'portfolio')),
  );

  const skip = () => {
    storeViewPreference('classic');
    useExperience.getState().enterClassic('user-choice', true);
  };

  return (
    <div className="xp-cover" data-state={hidden ? 'hidden' : 'visible'}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" aria-hidden="true" />
      <p role="status" className="text-sm font-bold tracking-widest text-secondary">
        LOADING 3D ROOM
      </p>
      <button
        type="button"
        onClick={skip}
        className="min-h-[44px] rounded-xl border border-secondary/20 px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        Skip to classic view
      </button>
    </div>
  );
}
