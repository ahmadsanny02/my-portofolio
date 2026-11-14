export interface WebGLSupport {
  /** A WebGL context can be created at all. */
  supported: boolean;
  /** The context is GPU-backed (not a software rasteriser such as SwiftShader). */
  accelerated: boolean;
}

type AnyWebGLContext = WebGL2RenderingContext | WebGLRenderingContext;

/** CPU rasterisers: they pass capability checks but cannot hold an interactive frame rate. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** Pure so it can be unit tested without a GPU. */
export function isSoftwareRenderer(renderer: string): boolean {
  return SOFTWARE_RENDERER.test(renderer);
}

function createContext(requireAcceleration: boolean): AnyWebGLContext | null {
  const canvas = document.createElement('canvas');
  try {
    const attributes: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: requireAcceleration,
      powerPreference: 'high-performance',
    };
    return (canvas.getContext('webgl2', attributes) ??
      canvas.getContext('webgl', attributes)) as AnyWebGLContext | null;
  } catch {
    return null;
  }
}

function rendererName(gl: AnyWebGLContext): string {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name: unknown = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  return typeof name === 'string' ? name : '';
}

/** Releases a probe context right away; browsers cap the number of live contexts per page. */
function release(gl: AnyWebGLContext): void {
  gl.getExtension('WEBGL_lose_context')?.loseContext();
}

/**
 * Probes real WebGL availability by creating (and releasing) a context.
 *
 * Acceleration is established from two signals because neither is reliable
 * alone: `failIfMajorPerformanceCaveat` (not honoured in every browser
 * configuration) and the reported renderer name (masked in some browsers).
 */
export function probeWebGL(): WebGLSupport {
  if (typeof window === 'undefined' || !('WebGLRenderingContext' in window)) {
    return { supported: false, accelerated: false };
  }

  const strict = createContext(true);
  if (strict) {
    const accelerated = !isSoftwareRenderer(rendererName(strict));
    release(strict);
    return { supported: true, accelerated };
  }

  const relaxed = createContext(false);
  if (!relaxed) return { supported: false, accelerated: false };
  release(relaxed);
  return { supported: true, accelerated: false };
}
