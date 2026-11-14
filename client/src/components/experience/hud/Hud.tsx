'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LayoutList, Lightbulb, LightbulbOff, MonitorPlay, Terminal } from 'lucide-react';
import { profile } from '@/data/profile';
import { storeViewPreference } from '../boot';
import { useMediaQuery } from '../hooks';
import { useExperience } from '../store';
import InteractPrompt from './InteractPrompt';
import Joystick from './Joystick';

const controlClass =
  'pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-secondary/15 bg-surface/85 px-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-colors hover:text-primary';

/**
 * Heads-up display layered over the canvas.
 *
 * Everything the 3D objects do is also reachable from here with ordinary
 * buttons, so the room stays usable with a keyboard, a screen reader, or
 * when the visitor simply does not find the objects.
 */
export default function Hud() {
  const visible = useExperience(
    (state) => state.sceneReady && state.view === 'room' && state.cameraFocus === 'player',
  );
  const theme = useExperience((state) => state.theme);
  const touch = useMediaQuery('(pointer: coarse)');

  const openPortfolio = () => useExperience.getState().openPortfolio();
  const toggleTheme = () => useExperience.getState().toggleTheme();
  const useClassicView = () => {
    storeViewPreference('classic');
    useExperience.getState().enterClassic('user-choice', true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hud"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-10"
        >
          <header className="flex items-start justify-between gap-3 p-4 sm:p-6">
            <div className="flex items-center gap-2 rounded-xl bg-surface/70 px-3 py-2 backdrop-blur-md">
              <span className="rounded-lg bg-primary p-1.5">
                <Terminal size={18} className="text-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                {profile.brand.primary}
                <span className="text-primary"> {profile.brand.accent}</span>
              </span>
            </div>

            <nav aria-label="Room controls" className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                data-xp-return-focus
                onClick={openPortfolio}
                className={`${controlClass} !border-primary !bg-primary !text-white hover:!bg-primary-dark`}
              >
                <MonitorPlay size={18} aria-hidden="true" />
                <span>Portfolio</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label={theme === 'dark' ? 'Turn the lights on (light theme)' : 'Turn the lights off (dark theme)'}
                className={controlClass}
              >
                {theme === 'dark' ? (
                  <LightbulbOff size={18} aria-hidden="true" />
                ) : (
                  <Lightbulb size={18} aria-hidden="true" />
                )}
              </button>
              <button type="button" onClick={useClassicView} className={controlClass}>
                <LayoutList size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Classic view</span>
                <span className="sr-only sm:hidden">Classic view</span>
              </button>
            </nav>
          </header>

          {touch && <Joystick />}
          <InteractPrompt touch={touch} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
