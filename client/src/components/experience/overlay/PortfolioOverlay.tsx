'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useAnimate, useReducedMotion } from 'framer-motion';
import { monitorClipPath } from '../scene/layout';
import { runtime } from '../scene/runtime';
import { useExperience, type ScrollTarget } from '../store';

type Phase = 'closed' | 'opening' | 'open' | 'closing';

const FULL_VIEWPORT = 'inset(0% 0% 0% 0% round 0px)';

function applyScroll(target: ScrollTarget | null): void {
  if (typeof target === 'number') window.scrollTo(0, target);
  else if (typeof target === 'string') document.getElementById(target)?.scrollIntoView();
  else window.scrollTo(0, 0);
}

/**
 * Hosts the portfolio content (the server-rendered classic page).
 *
 * - Classic mode: a plain wrapper; the content is simply the page.
 * - 3D mode: the same DOM becomes a full-screen overlay above the canvas. It
 *   is revealed with a clip-path that grows out of the monitor's on-screen
 *   rectangle, so the 3D screen appears to expand into the page.
 *
 * Keeping a single content tree means crawlers, the no-WebGL fallback and
 * the overlay all read the exact same markup, and form state survives
 * closing and reopening the overlay.
 */
export default function PortfolioOverlay({ children }: { children: ReactNode }) {
  const mode = useExperience((state) => state.mode);
  const wantsOpen = useExperience((state) => state.mode === '3d' && state.view === 'portfolio');
  const [scopeRef, animate] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('closed');
  const hasBeenOpen = useRef(false);

  // Step the phase machine towards the requested state
  useEffect(() => {
    if (wantsOpen && (phase === 'closed' || phase === 'closing')) {
      setPhase('opening');
    } else if (!wantsOpen && (phase === 'open' || phase === 'opening')) {
      // Leaving 3D mode altogether skips the fade: the content must stay visible
      setPhase(mode === '3d' ? 'closing' : 'closed');
    }
  }, [wantsOpen, phase, mode]);

  // Run the transition for the current phase before the browser paints it
  useLayoutEffect(() => {
    const element = scopeRef.current;
    if (!element) return;

    const root = document.documentElement;
    if (mode === '3d') root.setAttribute('data-xp-view', phase === 'closed' ? 'room' : 'portfolio');
    else root.removeAttribute('data-xp-view');

    const clearInlineStyles = () => {
      element.style.clipPath = '';
      element.style.opacity = '';
    };

    if (phase === 'opening') {
      const store = useExperience.getState();
      applyScroll(store.takePendingScroll());

      if (store.overlayInstant || reducedMotion) {
        clearInlineStyles();
        setPhase('open');
        return;
      }

      let cancelled = false;
      const controls = animate(
        element,
        {
          clipPath: [monitorClipPath(window.innerWidth / window.innerHeight), FULL_VIEWPORT],
          opacity: [0.35, 1],
        },
        { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      );
      controls.then(() => {
        if (cancelled) return;
        clearInlineStyles();
        setPhase('open');
      });
      return () => {
        cancelled = true;
        controls.stop();
      };
    }

    if (phase === 'closing') {
      let cancelled = false;
      const controls = animate(
        element,
        { opacity: 0 },
        { duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' },
      );
      controls.then(() => {
        if (!cancelled) setPhase('closed');
      });
      return () => {
        cancelled = true;
        controls.stop();
      };
    }

    clearInlineStyles();
  }, [phase, mode, animate, reducedMotion, scopeRef]);

  // Side effects of being fully open / fully closed
  useEffect(() => {
    if (phase === 'open') {
      hasBeenOpen.current = true;
      // The canvas is now completely covered: its render loop can stop
      useExperience.getState().setOverlaySettled(true);
      scopeRef.current?.focus({ preventScroll: true });

      const trackScroll = () => {
        runtime.overlayScrollY = window.scrollY;
      };
      trackScroll();
      window.addEventListener('scroll', trackScroll, { passive: true });
      return () => window.removeEventListener('scroll', trackScroll);
    }

    if (phase === 'closed' && hasBeenOpen.current && mode === '3d') {
      hasBeenOpen.current = false;
      document
        .querySelector<HTMLElement>('[data-xp-return-focus]')
        ?.focus({ preventScroll: true });
    }
  }, [phase, mode, scopeRef]);

  // Escape returns to the room
  useEffect(() => {
    if (phase !== 'open' && phase !== 'opening') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        useExperience.getState().closePortfolio();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  useEffect(() => () => document.documentElement.removeAttribute('data-xp-view'), []);

  // `closed` during boot keeps the server HTML hidden under html[data-xp='3d'];
  // without that attribute (classic / no JavaScript) the rule does not apply.
  const displayed = mode === 'classic' || phase !== 'closed';

  return (
    <div
      ref={scopeRef}
      className="xp-classic"
      data-overlay={displayed ? 'open' : 'closed'}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
