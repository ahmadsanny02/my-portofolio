'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { prefersReducedData, prefersReducedMotion } from '../boot';
import { usePageVisible } from '../hooks';
import { useExperience } from '../store';

const LanyardCanvas = dynamic(() => import('./LanyardCanvas'), { ssr: false });

class LanyardBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[lanyard] falling back to the static card:', error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Progressive enhancement for the About photo.
 *
 * `children` is the static, server-rendered photo card. When the device can
 * run it, a physics-driven ID card on a lanyard is loaded the first time the
 * section approaches the viewport and replaces the static card. Reduced
 * motion, data-saver, missing WebGL or any runtime failure keep the static
 * version.
 */
export default function Lanyard({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  // Needs a GPU-backed context: a software rasteriser would stutter through the simulation
  const webglAvailable = useExperience(
    (state) => state.canEnter3d && state.fallbackReason !== 'software-rendering',
  );
  const pageVisible = usePageVisible();

  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAllowed(!prefersReducedMotion() && !prefersReducedData());
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element || !allowed || !webglAvailable) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setActivated(true);
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [allowed, webglAvailable]);

  const interactive = allowed && webglAvailable && activated && !failed;
  const showCanvas = interactive && ready;

  return (
    <div ref={container} className="relative">
      <div
        className={cn('transition-opacity duration-500', showCanvas && 'pointer-events-none opacity-0')}
        aria-hidden={showCanvas || undefined}
      >
        {children}
      </div>

      {interactive && (
        <LanyardBoundary onError={() => setFailed(true)}>
          {/* Extends up into the section padding so the strap hangs from the section's top edge */}
          <div
            className={cn(
              'absolute inset-x-0 -top-24 -bottom-6 transition-opacity duration-500',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          >
            <LanyardCanvas active={inView && pageVisible} onReady={() => setReady(true)} />
          </div>
        </LanyardBoundary>
      )}
    </div>
  );
}
