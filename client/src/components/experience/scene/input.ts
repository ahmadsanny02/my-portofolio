import { useEffect } from 'react';
import { useExperience } from '../store';

type MoveKey = 'forward' | 'backward' | 'left' | 'right';

const keys: Record<MoveKey, boolean> = { forward: false, backward: false, left: false, right: false };
const joystick = { x: 0, y: 0 };

const MOVE_KEYS: Record<string, MoveKey> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};
const INTERACT_KEYS = new Set(['KeyE', 'Enter', 'Space']);

/** Joystick deflection in [-1, 1]; `y` is positive when pushed away from the user. */
export function setJoystick(x: number, y: number): void {
  joystick.x = x;
  joystick.y = y;
}

export function resetInput(): void {
  keys.forward = keys.backward = keys.left = keys.right = false;
  joystick.x = 0;
  joystick.y = 0;
}

/**
 * Writes the combined keyboard + joystick intent into `out` as a ground-plane
 * vector (x = right, z = towards the camera), clamped to unit length so
 * diagonals are not faster than straight movement.
 */
export function readMoveIntent(out: { x: number; z: number }): { x: number; z: number } {
  let x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + joystick.x;
  let forward = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0) + joystick.y;
  const length = Math.hypot(x, forward);
  if (length > 1) {
    x /= length;
    forward /= length;
  }
  out.x = x;
  out.z = -forward;
  return out;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function isNativelyActivatable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['BUTTON', 'A', 'SUMMARY'].includes(target.tagName) || target.getAttribute('role') === 'button';
}

/**
 * Binds keyboard controls for the room: WASD / arrow keys to move,
 * E / Enter / Space to use the nearby object. Input is ignored while the
 * portfolio is open or a form field has focus, so typing never moves the
 * character.
 */
export function useKeyboardInput(): void {
  useEffect(() => {
    const acceptsInput = () => {
      const state = useExperience.getState();
      return state.mode === '3d' && state.view === 'room' && state.cameraFocus === 'player';
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!acceptsInput() || isEditable(event.target)) return;

      const move = MOVE_KEYS[event.code];
      if (move) {
        keys[move] = true;
        // Arrow keys would otherwise scroll the document under the canvas
        if (event.code.startsWith('Arrow')) event.preventDefault();
        return;
      }

      if (INTERACT_KEYS.has(event.code) && !event.repeat) {
        // Enter/Space on a focused button or link must keep its native meaning
        if (event.code !== 'KeyE' && isNativelyActivatable(event.target)) return;
        const { nearby, activate } = useExperience.getState();
        if (nearby) {
          event.preventDefault();
          activate(nearby);
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const move = MOVE_KEYS[event.code];
      if (move) keys[move] = false;
    };

    // A key released while the window is unfocused never fires keyup
    const releaseAll = () => resetInput();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', releaseAll);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
      document.removeEventListener('visibilitychange', releaseAll);
      resetInput();
    };
  }, []);
}
