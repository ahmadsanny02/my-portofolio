'use client';

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { setJoystick } from '../scene/input';

/** Maximum knob travel in CSS pixels. */
const TRAVEL = 44;
/** Deflection below this fraction is ignored so a resting thumb does not creep. */
const DEAD_ZONE = 0.12;

/**
 * Virtual joystick for touch devices.
 *
 * The knob is moved by writing its transform directly and the deflection is
 * pushed into the input module — no React state changes while dragging, so a
 * moving thumb never triggers a render.
 */
export default function Joystick() {
  const knob = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const centre = useRef({ x: 0, y: 0 });

  useEffect(() => () => setJoystick(0, 0), []);

  const update = (clientX: number, clientY: number) => {
    let dx = clientX - centre.current.x;
    let dy = clientY - centre.current.y;
    const distance = Math.hypot(dx, dy);
    if (distance > TRAVEL) {
      dx *= TRAVEL / distance;
      dy *= TRAVEL / distance;
    }
    if (knob.current) knob.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    const x = dx / TRAVEL;
    const y = dy / TRAVEL;
    if (Math.hypot(x, y) < DEAD_ZONE) setJoystick(0, 0);
    else setJoystick(x, -y); // screen-down is "towards the camera"
  };

  const release = () => {
    activePointer.current = null;
    if (knob.current) knob.current.style.transform = '';
    setJoystick(0, 0);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== null) return;
    event.preventDefault();
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    centre.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    update(event.clientX, event.clientY);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId === activePointer.current) update(event.clientX, event.clientY);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId === activePointer.current) release();
  };

  return (
    <div
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      className="pointer-events-auto absolute bottom-8 left-6 flex h-32 w-32 touch-none select-none items-center justify-center rounded-full border border-secondary/25 bg-surface/50 backdrop-blur-sm"
    >
      <div ref={knob} className="h-14 w-14 rounded-full bg-primary/85 shadow-lg shadow-primary/30 will-change-transform" />
    </div>
  );
}
