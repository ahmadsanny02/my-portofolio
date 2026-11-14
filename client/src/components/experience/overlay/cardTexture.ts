import * as THREE from 'three';

export interface CardContent {
  name: string;
  role: string;
  brand: string;
  location: string;
  experience: string;
  handle: string;
  photoUrl: string;
}

export interface CardTextures {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
}

/** Texture resolution; the aspect ratio matches the 1.6 × 2.25 card mesh. */
const SIZE = { width: 640, height: 900 } as const;

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

/** Uses the site's font (loaded through next/font) when available. */
function fontFamily(): string {
  const geist = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-sans').trim();
  return geist ? `${geist}, system-ui, sans-serif` : 'system-ui, sans-serif';
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE.width;
  canvas.height = SIZE.height;
  return [canvas, canvas.getContext('2d')];
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function paintBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, SIZE.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE.width, SIZE.height);
}

function paintHeader(ctx: CanvasRenderingContext2D, brand: string, font: string) {
  const band = ctx.createLinearGradient(0, 0, SIZE.width, 0);
  band.addColorStop(0, '#0ea5e9');
  band.addColorStop(1, '#a78bfa');
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, SIZE.width, 150);

  // Punched slot for the clip
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  roundedRect(ctx, SIZE.width / 2 - 60, 26, 120, 26, 13);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `800 34px ${font}`;
  ctx.fillText(brand.toUpperCase(), SIZE.width / 2, 112);
}

function paintPhoto(ctx: CanvasRenderingContext2D, photo: HTMLImageElement | null, initials: string, font: string) {
  const size = 290;
  const x = (SIZE.width - size) / 2;
  const y = 190;

  ctx.fillStyle = '#f8fafc';
  roundedRect(ctx, x - 7, y - 7, size + 14, size + 14, 38);
  ctx.fill();

  ctx.save();
  roundedRect(ctx, x, y, size, size, 32);
  ctx.clip();
  if (photo) {
    // Centre-crop to a square ("object-fit: cover")
    const side = Math.min(photo.naturalWidth, photo.naturalHeight);
    const sx = (photo.naturalWidth - side) / 2;
    const sy = (photo.naturalHeight - side) / 2;
    ctx.drawImage(photo, sx, sy, side, side, x, y, size, size);
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.font = `800 110px ${font}`;
    ctx.fillText(initials, SIZE.width / 2, y + size / 2 + 38);
  }
  ctx.restore();
}

function paintFront(ctx: CanvasRenderingContext2D, content: CardContent, photo: HTMLImageElement | null, font: string) {
  paintBackground(ctx);
  paintHeader(ctx, content.brand, font);

  const initials = content.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  paintPhoto(ctx, photo, initials, font);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 46px ${font}`;
  ctx.fillText(content.name, SIZE.width / 2, 566, SIZE.width - 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = `700 28px ${font}`;
  ctx.fillText(content.role, SIZE.width / 2, 612);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 654);
  ctx.lineTo(SIZE.width - 60, 654);
  ctx.stroke();

  const columns: [string, string, number][] = [
    ['LOCATION', content.location, 60],
    ['EXPERIENCE', content.experience, SIZE.width / 2 + 30],
  ];
  ctx.textAlign = 'left';
  for (const [label, value, x] of columns) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = `700 17px ${font}`;
    ctx.fillText(label, x, 698);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `700 25px ${font}`;
    ctx.fillText(value, x, 734, SIZE.width / 2 - 80);
  }

  // Decorative barcode: deterministic bar widths so the texture is stable
  let x = 60;
  for (let index = 0; x < SIZE.width - 250; index++) {
    const width = 3 + ((index * 7) % 5) * 2;
    ctx.fillStyle = index % 2 === 0 ? '#e2e8f0' : 'transparent';
    ctx.fillRect(x, 782, width, 62);
    x += width + 3;
  }
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'right';
  ctx.font = `600 20px ${font}`;
  ctx.fillText(content.handle, SIZE.width - 60, 822);
}

function paintBack(ctx: CanvasRenderingContext2D, content: CardContent, font: string) {
  paintBackground(ctx);

  // Dot grid
  ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
  for (let y = 50; y < SIZE.height; y += 40) {
    for (let x = 40; x < SIZE.width; x += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const mark = ctx.createLinearGradient(220, 330, 420, 530);
  mark.addColorStop(0, '#0ea5e9');
  mark.addColorStop(1, '#a78bfa');
  ctx.fillStyle = mark;
  roundedRect(ctx, 220, 330, 200, 200, 48);
  ctx.fill();

  // Terminal prompt glyph
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(272, 392);
  ctx.lineTo(318, 430);
  ctx.lineTo(272, 468);
  ctx.moveTo(336, 470);
  ctx.lineTo(372, 470);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 44px ${font}`;
  ctx.fillText(content.brand, SIZE.width / 2, 610);
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 24px ${font}`;
  ctx.fillText(content.role, SIZE.width / 2, 652);
}

/**
 * Renders both faces of the ID card into canvas textures.
 * The caller owns the returned textures and must dispose them.
 */
export async function createCardTextures(content: CardContent): Promise<CardTextures> {
  const [photo] = await Promise.all([loadImage(content.photoUrl), document.fonts.ready]);
  const font = fontFamily();

  const [frontCanvas, frontCtx] = createCanvas();
  if (frontCtx) paintFront(frontCtx, content, photo, font);

  const [backCanvas, backCtx] = createCanvas();
  if (backCtx) paintBack(backCtx, content, font);

  return { front: toTexture(frontCanvas), back: toTexture(backCanvas) };
}
