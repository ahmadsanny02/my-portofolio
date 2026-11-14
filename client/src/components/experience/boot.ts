/**
 * Boot-time view selection shared by the render-blocking inline script and
 * the client runtime. Kept dependency-free so it can be inlined as a string.
 */

export const VIEW_STORAGE_KEY = 'portfolio:view';
export const RESUME_STORAGE_KEY = 'portfolio:resume-scroll';
export const VIEW_QUERY_PARAM = 'view';

export type ViewPreference = 'classic' | '3d';

/**
 * Runs before first paint. When the 3D room is the likely outcome it tags
 * <html data-xp="3d"> so CSS can hide the server-rendered classic page and
 * show the loading cover immediately — avoiding a flash of the classic layout
 * on WebGL-capable devices. The precise capability probe happens after
 * hydration; this is only the cheap pre-decision.
 */
export const BOOT_SCRIPT =
  `(function(){try{var d=document.documentElement,` +
  `q=new URLSearchParams(location.search).get('${VIEW_QUERY_PARAM}'),` +
  `p=q||localStorage.getItem('${VIEW_STORAGE_KEY}');` +
  `if(p==='classic'||!window.WebGLRenderingContext)return;` +
  `if(p!=='3d'){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;` +
  `var c=navigator.connection;if(c&&c.saveData)return}` +
  `d.setAttribute('data-xp','3d')}catch(e){}})();`;

function isViewPreference(value: string | null): value is ViewPreference {
  return value === 'classic' || value === '3d';
}

/** Explicit view choice: `?view=` wins over the stored preference. */
export function readViewPreference(): ViewPreference | null {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get(VIEW_QUERY_PARAM);
    if (isViewPreference(fromQuery)) return fromQuery;
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return isViewPreference(stored) ? stored : null;
  } catch {
    return null; // storage blocked (private mode / disabled cookies)
  }
}

export function storeViewPreference(preference: ViewPreference): void {
  try {
    window.localStorage.setItem(VIEW_STORAGE_KEY, preference);
  } catch {
    /* preference simply will not persist */
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersReducedData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/** Mirrors BOOT_SCRIPT for client-side navigations, where inline scripts do not run. */
export function isLikely3d(): boolean {
  const preference = readViewPreference();
  if (preference === 'classic' || !('WebGLRenderingContext' in window)) return false;
  if (preference === '3d') return true;
  return !prefersReducedMotion() && !prefersReducedData();
}
