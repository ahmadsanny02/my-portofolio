'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperience, type InteractableId, type ThemeName } from '../store';

function labelFor(id: InteractableId, theme: ThemeName): string {
  if (id === 'computer') return 'Open portfolio';
  return theme === 'dark' ? 'Turn the lights on' : 'Turn the lights off';
}

/**
 * Bottom-centre prompt. Near an interactive object it becomes a real button
 * (keyboard: E, touch: tap); before the visitor has moved it shows how to
 * get around.
 */
export default function InteractPrompt({ touch }: { touch: boolean }) {
  const nearby = useExperience((state) => state.nearby);
  const hasMoved = useExperience((state) => state.hasMoved);
  const theme = useExperience((state) => state.theme);
  const activate = useExperience((state) => state.activate);

  return (
    <div
      className={cn(
        'absolute flex px-6',
        // Touch layouts keep the bottom-left corner free for the joystick: the
        // action button sits under the right thumb, the hint above the stick.
        !touch && 'inset-x-0 bottom-8 justify-center',
        touch && nearby && 'bottom-12 right-0 justify-end',
        touch && !nearby && 'inset-x-0 bottom-48 justify-center',
      )}
    >
      <AnimatePresence mode="wait">
        {nearby ? (
          <motion.button
            key={nearby}
            type="button"
            onClick={() => activate(nearby)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex min-h-[52px] items-center gap-3 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary-dark"
          >
            {!touch && (
              <kbd className="rounded-md bg-white/20 px-2 py-0.5 font-mono text-xs">E</kbd>
            )}
            {labelFor(nearby, theme)}
          </motion.button>
        ) : !hasMoved ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="max-w-md rounded-2xl border border-secondary/15 bg-surface/85 px-5 py-3 text-center text-sm font-medium text-foreground shadow-lg backdrop-blur-md"
          >
            {touch ? 'Use the joystick to walk around.' : 'Walk around with WASD or the arrow keys.'}{' '}
            <span className="text-secondary">
              {touch ? 'Tap' : 'Click'} the computer to open my portfolio, or the lamp to switch the lights.
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
