'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Box } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import {
  isLikely3d,
  prefersReducedData,
  prefersReducedMotion,
  readViewPreference,
  RESUME_STORAGE_KEY,
  storeViewPreference,
} from './boot';
import LoadingCover from './hud/LoadingCover';
import PortfolioOverlay from './overlay/PortfolioOverlay';
import { detectQuality } from './quality';
import { runtime } from './scene/runtime';
import { useExperience } from './store';
import { probeWebGL } from './webgl';

// three.js, the renderer and the whole scene live in this chunk; it is only
// requested once the visitor is confirmed to get the 3D room.
const Stage = dynamic(() => import('./Stage'), { ssr: false });

/** Chooses between the 3D room and the classic page for this visit. */
function decideExperience(): void {
  const store = useExperience.getState();
  const preference = readViewPreference();
  const support = probeWebGL();

  if (!support.supported) return store.enterClassic('unsupported', false);
  if (preference === 'classic') return store.enterClassic('user-choice', true);
  if (preference !== '3d') {
    // Without an explicit opt-in, respect accessibility and data preferences
    // and do not push a software rasteriser through a 3D scene.
    if (prefersReducedMotion()) return store.enterClassic('reduced-motion', true);
    if (prefersReducedData()) return store.enterClassic('save-data', true);
    if (!support.accelerated) return store.enterClassic('software-rendering', true);
  }

  store.enter3d(detectQuality());

  // Land directly in the portfolio when returning from a project page or
  // following a deep link such as /#projects.
  let resume: string | null = null;
  try {
    resume = window.sessionStorage.getItem(RESUME_STORAGE_KEY);
    // Deferred so React StrictMode's second effect pass still sees the value
    window.setTimeout(() => window.sessionStorage.removeItem(RESUME_STORAGE_KEY), 0);
  } catch {
    /* storage unavailable */
  }
  const hash = decodeURIComponent(window.location.hash.slice(1));

  if (resume !== null) store.openPortfolio({ immediate: true, scrollTo: Number(resume) || 0 });
  else if (hash) store.openPortfolio({ immediate: true, scrollTo: hash });
}

function rememberOverlayPosition(): void {
  const state = useExperience.getState();
  // `overlaySettled` is only true once the overlay has really been shown; this
  // ignores the simulated unmount React StrictMode performs right after mount.
  if (state.mode !== '3d' || state.view !== 'portfolio' || !state.overlaySettled) return;
  try {
    window.sessionStorage.setItem(RESUME_STORAGE_KEY, String(Math.round(runtime.overlayScrollY)));
  } catch {
    /* storage unavailable */
  }
}

/** Mirrors the resolved site theme into the store and exposes a toggle to the scene. */
function ThemeBridge() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
    useExperience.getState().syncTheme(theme, () => setTheme(theme === 'dark' ? 'light' : 'dark'));
  }, [resolvedTheme, setTheme]);

  return null;
}

interface StageBoundaryProps {
  onError: () => void;
  children: ReactNode;
}

/** Catches a failed chunk download or a runtime error inside the 3D tree. */
class StageBoundary extends Component<StageBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[experience] 3D stage failed, falling back to the classic view:', error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const pillClass =
  'fixed bottom-6 z-[55] flex min-h-[48px] items-center gap-2 rounded-2xl px-5 text-sm font-bold shadow-xl transition-colors cursor-pointer';

/** Floating control to move between the room, the portfolio overlay and the classic page. */
function ModeSwitch({ onEnter3d }: { onEnter3d: () => void }) {
  const mode = useExperience((state) => state.mode);
  const view = useExperience((state) => state.view);
  const canEnter3d = useExperience((state) => state.canEnter3d);
  const closePortfolio = useExperience((state) => state.closePortfolio);

  return (
    <AnimatePresence>
      {mode === '3d' && view === 'portfolio' && (
        <motion.button
          key="back"
          type="button"
          onClick={closePortfolio}
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className={`${pillClass} left-1/2 bg-foreground text-background hover:bg-primary hover:text-white`}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to room
          <kbd className="hidden rounded-md bg-background/20 px-1.5 py-0.5 font-mono text-[11px] sm:inline">
            Esc
          </kbd>
        </motion.button>
      )}
      {mode === 'classic' && canEnter3d && (
        <motion.button
          key="enter"
          type="button"
          onClick={onEnter3d}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className={`${pillClass} left-6 bg-primary text-white shadow-primary/30 hover:bg-primary-dark`}
        >
          <Box size={18} aria-hidden="true" />
          Enter 3D room
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * Orchestrates the two presentations of the home page.
 *
 * `children` is the server-rendered classic page. It is always in the DOM
 * (SEO, no-JavaScript and no-WebGL fallback). When the device can run it,
 * the 3D room is loaded on top and the same content becomes the overlay that
 * opens from the in-room computer.
 */
export default function Experience({ children }: { children: ReactNode }) {
  const mode = useExperience((state) => state.mode);
  const fallbackReason = useExperience((state) => state.fallbackReason);
  const [attempt, setAttempt] = useState(0);

  // Client-side navigations do not execute the inline boot script, so repeat
  // its pre-decision before paint to avoid a flash of the classic layout.
  useLayoutEffect(() => {
    if (isLikely3d()) document.documentElement.setAttribute('data-xp', '3d');
  }, []);

  useEffect(() => {
    decideExperience();
    return () => {
      rememberOverlayPosition();
      useExperience.getState().reset();
      document.documentElement.removeAttribute('data-xp');
    };
  }, []);

  // Keep <html data-xp> in sync with the final decision; CSS keys off it
  useLayoutEffect(() => {
    if (mode === '3d') document.documentElement.setAttribute('data-xp', '3d');
    else if (mode === 'classic') document.documentElement.removeAttribute('data-xp');
  }, [mode]);

  useEffect(() => {
    if (fallbackReason === 'context-lost' || fallbackReason === 'error') {
      toast('The 3D room is unavailable right now — showing the classic view.', {
        id: 'xp-fallback',
      });
    }
  }, [fallbackReason]);

  const enter3d = () => {
    storeViewPreference('3d');
    window.scrollTo(0, 0);
    setAttempt((count) => count + 1); // remounts the error boundary for a clean retry
    useExperience.getState().enter3d(detectQuality());
  };

  return (
    <div className="xp-root">
      <ThemeBridge />
      {mode === '3d' && (
        <StageBoundary
          key={attempt}
          onError={() => useExperience.getState().enterClassic('error', true)}
        >
          <Stage />
        </StageBoundary>
      )}
      <LoadingCover />
      <PortfolioOverlay>{children}</PortfolioOverlay>
      <ModeSwitch onEnter3d={enter3d} />
    </div>
  );
}
