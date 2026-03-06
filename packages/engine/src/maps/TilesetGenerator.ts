import Phaser from 'phaser';

export const LOBBY_TILESET_KEY = 'lobby_tiles';

/** 0-based tile index → GID = index + 1 (firstgid is always 1). */
export const TILE_IDX = {
  FLOOR_DARK: 0,
  FLOOR_LIGHT: 1,
  WALL: 2,
  WALL_CORNER: 3,
  TERMINAL: 4,
  DOOR_CLOSED: 5,
  DOOR_OPEN: 6,
  ELEVATOR: 7,
  DESK: 8,
  CHAIR: 9,
  PLANTER: 10,
  RECEPTION_DESK: 11,
  NEON_STRIP: 12,
  VENT: 13,
  CABLE: 14,
  // New tiles — row 1-3 of the 8×8 tileset
  FLOOR_VARIANT: 15,
  FLOOR_GRATE: 16,
  SERVER_RACK: 17,
  FILING_CABINET: 18,
  PIPE_H: 19,
  WALL_SCREEN: 20,
  CAUTION_STRIPE: 21,
  OIL_STAIN: 22,
  CARPET: 23,
  CEILING_LIGHT: 24,
} as const;

/** GIDs for use in tilemap layer data (TILE_IDX + 1, firstgid = 1). */
export const LOBBY_GID = Object.fromEntries(
  Object.entries(TILE_IDX).map(([k, v]) => [k, v + 1]),
) as Record<keyof typeof TILE_IDX, number>;

const TILE_SIZE = 32;
const TILESET_COLS = 8;
const TILESET_ROWS = 8;
const TILESET_W = TILESET_COLS * TILE_SIZE; // 256
const TILESET_H = TILESET_ROWS * TILE_SIZE; // 256

type DrawFn = (ctx: CanvasRenderingContext2D, tx: number, ty: number) => void;

function drawAt(ctx: CanvasRenderingContext2D, idx: number, draw: DrawFn): void {
  const col = idx % TILESET_COLS;
  const row = Math.floor(idx / TILESET_COLS);
  draw(ctx, col * TILE_SIZE, row * TILE_SIZE);
}

// ─── Texture helpers ──────────────────────────────────────────────────────────

/** Applies deterministic pixel-level noise to an already-drawn tile region. */
function applyNoise(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  variance: number,
  seedOffset = 0,
): void {
  const imageData = ctx.getImageData(tx, ty, TILE_SIZE, TILE_SIZE);
  const data = imageData.data;
  const total = TILE_SIZE * TILE_SIZE;
  for (let i = 0; i < total; i++) {
    const px = i % TILE_SIZE;
    const py = Math.floor(i / TILE_SIZE);
    const s = Math.sin((px * 127.1 + py * 311.7 + seedOffset) * 0.1) * 43758.5453;
    const n = (s - Math.floor(s) - 0.5) * 2 * variance;
    const base = i * 4;
    data[base] = Math.max(0, Math.min(255, (data[base] ?? 0) + n)) | 0;
    data[base + 1] = Math.max(0, Math.min(255, (data[base + 1] ?? 0) + n)) | 0;
    data[base + 2] = Math.max(0, Math.min(255, (data[base + 2] ?? 0) + n)) | 0;
  }
  ctx.putImageData(imageData, tx, ty);
}

/** Draws panel groove lines (cross-hatch) every `spacing` pixels. */
function addGrooves(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  spacing: number,
  alpha = 0.15,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  for (let gy = spacing; gy < TILE_SIZE; gy += spacing) {
    ctx.beginPath();
    ctx.moveTo(tx, ty + gy - 0.5);
    ctx.lineTo(tx + TILE_SIZE, ty + gy - 0.5);
    ctx.stroke();
  }
  for (let gx = spacing; gx < TILE_SIZE; gx += spacing) {
    ctx.beginPath();
    ctx.moveTo(tx + gx - 0.5, ty);
    ctx.lineTo(tx + gx - 0.5, ty + TILE_SIZE);
    ctx.stroke();
  }
  ctx.restore();
}

/** Adds small scratch / rust marks to a tile using deterministic pseudo-random. */
function addScratches(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  count: number,
  seed: number,
): void {
  for (let i = 0; i < count; i++) {
    const s1 = Math.abs(Math.sin((seed + i * 73.1) * 0.3));
    const s2 = Math.abs(Math.sin((seed + i * 137.5) * 0.2));
    const s3 = Math.abs(Math.sin((seed + i * 251.7) * 0.15));
    const px = (s1 * (TILE_SIZE - 6) + 3) | 0;
    const py = (s2 * (TILE_SIZE - 6) + 3) | 0;
    const len = (s3 * 5 + 2) | 0;
    ctx.fillStyle = `rgba(0,0,0,${(0.25 + s3 * 0.2).toFixed(2)})`;
    ctx.fillRect(tx + px, ty + py, len, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(tx + px, ty + py - 1, len, 1);
  }
}

/** Adds a bevel: lighter top/left edges, darker bottom/right edges for 3-D depth. */
function addBevel(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  w: number,
  h: number,
  depth = 2,
): void {
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(tx, ty, w, depth);
  ctx.fillRect(tx, ty, depth, h);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(tx, ty + h - depth, w, depth);
  ctx.fillRect(tx + w - depth, ty, depth, h);
}

/** Draws panel corner rivets (bolts). */
function addRivets(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  const offsets: Array<[number, number]> = [
    [5, 5],
    [TILE_SIZE - 5, 5],
    [5, TILE_SIZE - 5],
    [TILE_SIZE - 5, TILE_SIZE - 5],
  ];
  for (const [rx, ry] of offsets) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(tx + rx + 0.5, ty + ry + 0.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(180,200,220,0.7)';
    ctx.beginPath();
    ctx.arc(tx + rx, ty + ry, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Subtle darkening at the very edges of a tile for depth. */
function addEdgeVignette(ctx: CanvasRenderingContext2D, tx: number, ty: number): void {
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#000000';
  ctx.fillRect(tx, ty, TILE_SIZE, 2);
  ctx.fillRect(tx, ty + TILE_SIZE - 2, TILE_SIZE, 2);
  ctx.fillRect(tx, ty, 2, TILE_SIZE);
  ctx.fillRect(tx + TILE_SIZE - 2, ty, 2, TILE_SIZE);
  ctx.restore();
}

// ─── Main generator ──────────────────────────────────────────────────────────

/**
 * Generates the lobby tileset texture at runtime and registers it with Phaser's
 * TextureManager under the key `LOBBY_TILESET_KEY`. Safe to call multiple times.
 */
export function generateTilesetTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(LOBBY_TILESET_KEY)) return;

  const ct = scene.textures.createCanvas(LOBBY_TILESET_KEY, TILESET_W, TILESET_H);
  if (!ct) return;
  const ctx = ct.getContext();

  // Fill entire canvas with darkest floor colour so empty slots are valid
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, TILESET_W, TILESET_H);

  // ── 0: floor_dark ──────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FLOOR_DARK, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 5, 0);
    addGrooves(c, tx, ty, 8, 0.12);
    addScratches(c, tx, ty, 3, 42);
    addEdgeVignette(c, tx, ty);
  });

  // ── 1: floor_light ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FLOOR_LIGHT, (c, tx, ty) => {
    c.fillStyle = '#16213e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 5, 100);
    addGrooves(c, tx, ty, 8, 0.15);
    // Subtle horizontal highlight band
    c.fillStyle = 'rgba(30,60,100,0.25)';
    c.fillRect(tx, ty + 11, TILE_SIZE, 9);
    addScratches(c, tx, ty, 2, 77);
    addEdgeVignette(c, tx, ty);
  });

  // ── 2: wall ────────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.WALL, (c, tx, ty) => {
    c.fillStyle = '#0f1020';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 4, 200);
    addGrooves(c, tx, ty, 16, 0.2);
    addBevel(c, tx, ty, TILE_SIZE, TILE_SIZE, 3);
    addRivets(c, tx, ty);
    // Subtle neon outline (lower opacity than before)
    c.strokeStyle = 'rgba(0,255,65,0.4)';
    c.lineWidth = 1;
    c.strokeRect(tx + 1.5, ty + 1.5, TILE_SIZE - 3, TILE_SIZE - 3);
    // Inner shadow for depth
    c.strokeStyle = 'rgba(0,0,0,0.5)';
    c.lineWidth = 1;
    c.strokeRect(tx + 4, ty + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  });

  // ── 3: wall_corner ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.WALL_CORNER, (c, tx, ty) => {
    c.fillStyle = '#0d0e1e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 4, 300);
    addBevel(c, tx, ty, TILE_SIZE, TILE_SIZE, 3);
    addRivets(c, tx, ty);
    // Accent outline
    c.strokeStyle = 'rgba(200,0,200,0.5)';
    c.lineWidth = 1;
    c.strokeRect(tx + 1.5, ty + 1.5, TILE_SIZE - 3, TILE_SIZE - 3);
    // Corner bracket accents
    c.strokeStyle = 'rgba(200,0,200,0.8)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx + 3, ty + 10);
    c.lineTo(tx + 3, ty + 3);
    c.lineTo(tx + 10, ty + 3);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 10, ty + 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + 10);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + 3, ty + TILE_SIZE - 10);
    c.lineTo(tx + 3, ty + TILE_SIZE - 3);
    c.lineTo(tx + 10, ty + TILE_SIZE - 3);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 10, ty + TILE_SIZE - 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 10);
    c.stroke();
  });

  // ── 4: terminal ────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.TERMINAL, (c, tx, ty) => {
    c.fillStyle = '#0d0d1a';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Monitor body
    c.fillStyle = '#111122';
    c.fillRect(tx + 3, ty + 2, TILE_SIZE - 6, TILE_SIZE - 10);
    addBevel(c, tx + 3, ty + 2, TILE_SIZE - 6, TILE_SIZE - 10, 2);
    // Monitor screen
    c.fillStyle = '#001800';
    c.fillRect(tx + 5, ty + 4, TILE_SIZE - 10, TILE_SIZE - 16);
    // Screen glow
    c.fillStyle = 'rgba(0,80,0,0.3)';
    c.fillRect(tx + 6, ty + 5, TILE_SIZE - 12, 4);
    // Scan lines
    c.lineWidth = 1;
    const scanWidths = [16, 10, 14, 16] as const;
    for (let i = 0; i < 4; i++) {
      c.globalAlpha = 0.55 + i * 0.1;
      c.strokeStyle = '#00ff41';
      c.beginPath();
      c.moveTo(tx + 7, ty + 7 + i * 4);
      c.lineTo(tx + 7 + (scanWidths[i] ?? 14), ty + 7 + i * 4);
      c.stroke();
    }
    c.globalAlpha = 1;
    c.strokeStyle = 'rgba(0,255,65,0.55)';
    c.lineWidth = 1;
    c.strokeRect(tx + 5, ty + 4, TILE_SIZE - 10, TILE_SIZE - 16);
    // Keyboard dots
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        c.fillStyle = 'rgba(100,120,150,0.6)';
        c.fillRect(tx + 5 + col * 4, ty + TILE_SIZE - 8 + row * 3, 3, 2);
      }
    }
    // Coffee cup
    c.strokeStyle = 'rgba(180,120,60,0.7)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(tx + TILE_SIZE - 7, ty + TILE_SIZE - 6, 3, 0, Math.PI * 2);
    c.stroke();
    // Base stand
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx + 10, ty + TILE_SIZE - 10, 12, 4);
    c.fillRect(tx + 8, ty + TILE_SIZE - 7, 16, 4);
  });

  // ── 5: door_closed ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.DOOR_CLOSED, (c, tx, ty) => {
    c.fillStyle = '#0a1520';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 2;
    c.strokeRect(tx + 2, ty + 1, TILE_SIZE - 4, TILE_SIZE - 2);
    // Dual door panels
    c.fillStyle = '#071520';
    c.fillRect(tx + 4, ty + 3, 11, TILE_SIZE - 6);
    c.fillRect(tx + 17, ty + 3, 11, TILE_SIZE - 6);
    addBevel(c, tx + 4, ty + 3, 11, TILE_SIZE - 6, 1);
    c.strokeStyle = 'rgba(0,229,255,0.35)';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 4, ty + 3, 11, TILE_SIZE - 6);
    c.strokeRect(tx + 17, ty + 3, 11, TILE_SIZE - 6);
    // Door handle indicators
    c.fillStyle = 'rgba(0,200,255,0.6)';
    c.fillRect(tx + 13, ty + TILE_SIZE / 2 - 2, 2, 4);
    c.fillRect(tx + 17, ty + TILE_SIZE / 2 - 2, 2, 4);
    // Center gap glow
    c.strokeStyle = '#00ffff';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx + TILE_SIZE / 2, ty + 3);
    c.lineTo(tx + TILE_SIZE / 2, ty + TILE_SIZE - 3);
    c.stroke();
  });

  // ── 6: door_open ───────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.DOOR_OPEN, (c, tx, ty) => {
    c.fillStyle = '#050e14';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Frame pillars
    c.fillStyle = '#0a1828';
    c.fillRect(tx, ty, 5, TILE_SIZE);
    c.fillRect(tx + TILE_SIZE - 5, ty, 5, TILE_SIZE);
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(tx + 4.5, ty);
    c.lineTo(tx + 4.5, ty + TILE_SIZE);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 4.5, ty);
    c.lineTo(tx + TILE_SIZE - 4.5, ty + TILE_SIZE);
    c.stroke();
    // Threshold glow
    c.fillStyle = 'rgba(0,229,255,0.15)';
    c.fillRect(tx + 5, ty + TILE_SIZE - 5, TILE_SIZE - 10, 4);
    c.strokeStyle = 'rgba(0,255,255,0.6)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx + 5, ty + TILE_SIZE - 3);
    c.lineTo(tx + TILE_SIZE - 5, ty + TILE_SIZE - 3);
    c.stroke();
  });

  // ── 7: elevator ────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.ELEVATOR, (c, tx, ty) => {
    c.fillStyle = '#0a0a1e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 3, 400);
    addBevel(c, tx, ty, TILE_SIZE, TILE_SIZE, 2);
    c.strokeStyle = 'rgba(200,0,200,0.7)';
    c.lineWidth = 2;
    c.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    // Center split glow
    c.strokeStyle = 'rgba(255,100,255,0.3)';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(tx + TILE_SIZE / 2, ty + 4);
    c.lineTo(tx + TILE_SIZE / 2, ty + TILE_SIZE - 4);
    c.stroke();
    c.strokeStyle = 'rgba(200,0,200,0.6)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx + TILE_SIZE / 2, ty + 4);
    c.lineTo(tx + TILE_SIZE / 2, ty + TILE_SIZE - 4);
    c.stroke();
    // Up/down arrows
    c.fillStyle = '#ff00ff';
    c.beginPath();
    c.moveTo(tx + 10, ty + 15);
    c.lineTo(tx + 16, ty + 8);
    c.lineTo(tx + 22, ty + 15);
    c.fill();
    c.beginPath();
    c.moveTo(tx + 10, ty + 19);
    c.lineTo(tx + 16, ty + 26);
    c.lineTo(tx + 22, ty + 19);
    c.fill();
    // Status light
    c.fillStyle = 'rgba(255,100,255,0.85)';
    c.beginPath();
    c.arc(tx + TILE_SIZE - 6, ty + 6, 2, 0, Math.PI * 2);
    c.fill();
  });

  // ── 8: desk ────────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.DESK, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Desk surface
    c.fillStyle = '#2a1a0a';
    c.fillRect(tx + 3, ty + 5, TILE_SIZE - 6, TILE_SIZE - 14);
    applyNoise(c, tx + 3, ty + 5, 4, 500);
    addBevel(c, tx + 3, ty + 5, TILE_SIZE - 6, TILE_SIZE - 14, 1);
    c.strokeStyle = '#3d2a15';
    c.lineWidth = 1;
    c.strokeRect(tx + 3, ty + 5, TILE_SIZE - 6, TILE_SIZE - 14);
    // Monitor screen on desk
    c.fillStyle = '#001a00';
    c.fillRect(tx + 8, ty + 6, 12, 8);
    c.fillStyle = 'rgba(0,255,65,0.25)';
    c.fillRect(tx + 9, ty + 7, 10, 2);
    c.strokeStyle = 'rgba(0,200,80,0.5)';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 8, ty + 6, 12, 8);
    // Keyboard
    c.fillStyle = 'rgba(60,60,80,0.8)';
    c.fillRect(tx + 7, ty + 16, 14, 3);
    // Legs
    c.fillStyle = '#1a0f05';
    c.fillRect(tx + 4, ty + TILE_SIZE - 8, 4, 6);
    c.fillRect(tx + TILE_SIZE - 8, ty + TILE_SIZE - 8, 4, 6);
    c.fillStyle = 'rgba(80,50,20,0.5)';
    c.fillRect(tx + 5, ty + TILE_SIZE - 8, 2, 6);
    c.fillRect(tx + TILE_SIZE - 7, ty + TILE_SIZE - 8, 2, 6);
  });

  // ── 9: chair ───────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CHAIR, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    const cx = tx + TILE_SIZE / 2;
    const cy = ty + TILE_SIZE / 2 + 2;
    // Dark outer rim
    c.fillStyle = '#0f1a28';
    c.beginPath();
    c.arc(cx, cy, 11, 0, Math.PI * 2);
    c.fill();
    // Cushion mid
    c.fillStyle = '#1a2a3a';
    c.beginPath();
    c.arc(cx, cy, 9, 0, Math.PI * 2);
    c.fill();
    // Lighter center highlight
    c.fillStyle = '#253a50';
    c.beginPath();
    c.arc(cx - 1, cy - 1, 5, 0, Math.PI * 2);
    c.fill();
    // Seat outline
    c.strokeStyle = 'rgba(0,200,255,0.5)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(cx, cy, 10, 0, Math.PI * 2);
    c.stroke();
    // Back rest
    c.strokeStyle = '#1a3a5a';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cy, 8, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
    c.strokeStyle = 'rgba(40,80,120,0.7)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(cx, cy, 9, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
    // Chair legs
    c.fillStyle = '#0a0f18';
    const legOffsets: Array<[number, number]> = [
      [-8, 8],
      [8, 8],
      [-8, -6],
      [8, -6],
    ];
    for (const [lx, ly] of legOffsets) {
      c.fillRect(cx + lx - 1, cy + ly - 1, 2, 2);
    }
  });

  // ── 10: planter ────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.PLANTER, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Pot with shading
    c.fillStyle = '#2a1a0a';
    c.fillRect(tx + 9, ty + 18, 14, 10);
    c.fillStyle = 'rgba(80,50,20,0.4)';
    c.fillRect(tx + 9, ty + 18, 14, 3);
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.fillRect(tx + 9, ty + 25, 14, 3);
    c.strokeStyle = '#3a2a1a';
    c.lineWidth = 1;
    c.strokeRect(tx + 9, ty + 18, 14, 10);
    // Soil rim
    c.fillStyle = '#1a0f05';
    c.fillRect(tx + 10, ty + 18, 12, 2);
    // Foliage — multiple circles for leafy texture
    const foliageColors = ['#0a3a0a', '#0d4a0d', '#0a2a0a', '#0f5010'] as const;
    const leaves: Array<[number, number, number, number]> = [
      [0, -2, 7, 0],
      [-5, 0, 4, 1],
      [5, 0, 4, 2],
      [0, 3, 5, 3],
      [-3, -4, 3, 0],
      [3, -4, 3, 1],
    ];
    for (const [lx, ly, lr, ci] of leaves) {
      c.fillStyle = foliageColors[ci % foliageColors.length] ?? '#0a3a0a';
      c.beginPath();
      c.arc(tx + TILE_SIZE / 2 + lx, ty + 14 + ly, lr, 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = 'rgba(0,200,60,0.3)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + 13, 9, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = '#0a2a0a';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx + 16, ty + 19);
    c.lineTo(tx + 16, ty + 23);
    c.stroke();
  });

  // ── 11: reception_desk ─────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.RECEPTION_DESK, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.fillStyle = '#0f1f2f';
    c.fillRect(tx + 2, ty + 4, TILE_SIZE - 4, TILE_SIZE - 8);
    addBevel(c, tx + 2, ty + 4, TILE_SIZE - 4, TILE_SIZE - 8, 2);
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 1.5;
    c.strokeRect(tx + 2, ty + 4, TILE_SIZE - 4, TILE_SIZE - 8);
    c.fillStyle = '#00e5ff';
    c.fillRect(tx + 4, ty + 6, TILE_SIZE - 8, 2);
    c.strokeStyle = 'rgba(0,150,200,0.4)';
    c.lineWidth = 0.5;
    c.beginPath();
    c.moveTo(tx + 4, ty + 12);
    c.lineTo(tx + TILE_SIZE - 4, ty + 12);
    c.stroke();
    // Logo glow + dot
    c.fillStyle = 'rgba(0,229,255,0.2)';
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2 + 2, 6, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#00ffff';
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2 + 2, 3, 0, Math.PI * 2);
    c.fill();
  });

  // ── 12: neon_strip ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.NEON_STRIP, (c, tx, ty) => {
    c.fillStyle = '#0a0a1e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Mounting bracket
    c.fillStyle = '#15152a';
    c.fillRect(tx + 2, ty + 11, TILE_SIZE - 4, 10);
    addBevel(c, tx + 2, ty + 11, TILE_SIZE - 4, 10, 1);
    // Outer glow halo
    c.fillStyle = 'rgba(0,60,60,0.5)';
    c.fillRect(tx + 2, ty + 12, TILE_SIZE - 4, 8);
    // Tube body
    c.fillStyle = '#00cccc';
    c.fillRect(tx + 4, ty + 13, TILE_SIZE - 8, 5);
    c.fillStyle = '#00ffff';
    c.fillRect(tx + 5, ty + 14, TILE_SIZE - 10, 3);
    c.fillStyle = '#ffffff';
    c.fillRect(tx + 7, ty + 15, TILE_SIZE - 14, 1);
    // End caps
    c.fillStyle = '#aaaaff';
    c.fillRect(tx + 4, ty + 13, 2, 5);
    c.fillRect(tx + TILE_SIZE - 6, ty + 13, 2, 5);
  });

  // ── 13: vent ───────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.VENT, (c, tx, ty) => {
    c.fillStyle = '#0f1020';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    addBevel(c, tx, ty, TILE_SIZE, TILE_SIZE, 2);
    c.strokeStyle = '#2a3040';
    c.lineWidth = 1.5;
    c.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    // Horizontal slats with shadow beneath each
    for (let i = 0; i < 5; i++) {
      const slaty = ty + 5 + i * 5;
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.fillRect(tx + 3, slaty + 3, TILE_SIZE - 6, 1);
      c.fillStyle = i % 2 === 0 ? '#1e1e32' : '#181828';
      c.fillRect(tx + 3, slaty, TILE_SIZE - 6, 4);
      c.fillStyle = 'rgba(80,80,120,0.3)';
      c.fillRect(tx + 3, slaty, TILE_SIZE - 6, 1);
    }
    // Corner screws
    c.fillStyle = 'rgba(100,110,150,0.6)';
    c.fillRect(tx + 3, ty + 3, 2, 2);
    c.fillRect(tx + TILE_SIZE - 5, ty + 3, 2, 2);
    c.fillRect(tx + 3, ty + TILE_SIZE - 5, 2, 2);
    c.fillRect(tx + TILE_SIZE - 5, ty + TILE_SIZE - 5, 2, 2);
  });

  // ── 14: cable ──────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CABLE, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    addGrooves(c, tx, ty, 8, 0.08);
    // Cable tray shadow
    c.fillStyle = 'rgba(20,20,40,0.5)';
    c.fillRect(tx, ty + 6, TILE_SIZE, 7);
    c.fillRect(tx, ty + 18, TILE_SIZE, 7);
    // Orange cable trace with highlight
    c.strokeStyle = '#cc5500';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(tx, ty + 10);
    c.lineTo(tx + 16, ty + 10);
    c.lineTo(tx + 16, ty + 22);
    c.lineTo(tx + TILE_SIZE, ty + 22);
    c.stroke();
    c.strokeStyle = 'rgba(255,120,40,0.4)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx, ty + 9);
    c.lineTo(tx + 16, ty + 9);
    c.lineTo(tx + 16, ty + 21);
    c.stroke();
    // Yellow cable trace
    c.strokeStyle = '#ccaa00';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx, ty + 20);
    c.lineTo(tx + 10, ty + 20);
    c.lineTo(tx + 10, ty + 8);
    c.lineTo(tx + TILE_SIZE, ty + 8);
    c.stroke();
    c.strokeStyle = 'rgba(255,220,50,0.35)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx, ty + 19);
    c.lineTo(tx + 10, ty + 19);
    c.lineTo(tx + 10, ty + 7);
    c.stroke();
    // Cable bundle dots
    const bundleColors = ['#cc5500', '#ccaa00', '#0055cc'] as const;
    for (let i = 0; i < 3; i++) {
      c.fillStyle = bundleColors[i % bundleColors.length] ?? '#cc5500';
      c.beginPath();
      c.arc(tx + 6 + i * 4, ty + 27, 1.5, 0, Math.PI * 2);
      c.fill();
    }
  });

  // ── 15: floor_variant ──────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FLOOR_VARIANT, (c, tx, ty) => {
    c.fillStyle = '#1c1820';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 6, 600);
    addGrooves(c, tx, ty, 16, 0.15);
    // Diagonal scratch accents
    c.save();
    c.globalAlpha = 0.08;
    c.strokeStyle = '#ffffff';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx, ty + 8);
    c.lineTo(tx + 8, ty);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + 20, ty + 4);
    c.lineTo(tx + 28, ty + 12);
    c.stroke();
    c.restore();
    addScratches(c, tx, ty, 2, 99);
    addEdgeVignette(c, tx, ty);
  });

  // ── 16: floor_grate ────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FLOOR_GRATE, (c, tx, ty) => {
    // Deep background (visible through grate)
    c.fillStyle = '#050508';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Metal grate bars — horizontal
    for (let gy = 0; gy < 5; gy++) {
      const barY = ty + 2 + gy * 6;
      c.fillStyle = '#252535';
      c.fillRect(tx + 2, barY, TILE_SIZE - 4, 3);
      // Top highlight on each bar
      c.fillStyle = 'rgba(80,80,120,0.5)';
      c.fillRect(tx + 2, barY, TILE_SIZE - 4, 1);
      // Shadow under each bar
      c.fillStyle = 'rgba(0,0,0,0.5)';
      c.fillRect(tx + 2, barY + 3, TILE_SIZE - 4, 1);
    }
    // Metal grate bars — vertical (semi-transparent overlay)
    c.fillStyle = 'rgba(35,35,50,0.65)';
    for (let gx = 0; gx < 5; gx++) {
      c.fillRect(tx + 2 + gx * 6, ty + 2, 3, TILE_SIZE - 4);
    }
    // Frame
    c.strokeStyle = '#303045';
    c.lineWidth = 2;
    c.strokeRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    // Subtle green cast
    c.fillStyle = 'rgba(0,60,20,0.08)';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
  });

  // ── 17: server_rack ────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.SERVER_RACK, (c, tx, ty) => {
    c.fillStyle = '#0a0a18';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Rack body
    c.fillStyle = '#101820';
    c.fillRect(tx + 4, ty + 2, TILE_SIZE - 8, TILE_SIZE - 4);
    addBevel(c, tx + 4, ty + 2, TILE_SIZE - 8, TILE_SIZE - 4, 2);
    c.strokeStyle = '#202838';
    c.lineWidth = 1;
    c.strokeRect(tx + 4, ty + 2, TILE_SIZE - 8, TILE_SIZE - 4);
    // Server units (alternating bands)
    for (let unit = 0; unit < 5; unit++) {
      const unitY = ty + 4 + unit * 5;
      c.fillStyle = unit % 2 === 0 ? '#141e28' : '#111820';
      c.fillRect(tx + 5, unitY, TILE_SIZE - 10, 4);
      c.strokeStyle = 'rgba(30,50,70,0.6)';
      c.lineWidth = 0.5;
      c.strokeRect(tx + 5, unitY, TILE_SIZE - 10, 4);
    }
    // LED column (right side)
    const ledColors = ['#00ff41', '#00ff41', '#ff6600', '#00ff41', '#ff0040'] as const;
    for (let led = 0; led < 5; led++) {
      const ledY = ty + 5 + led * 5;
      const ledColor = ledColors[led % ledColors.length] ?? '#00ff41';
      // Glow halo
      c.save();
      c.globalAlpha = 0.22;
      c.fillStyle = ledColor;
      c.beginPath();
      c.arc(tx + TILE_SIZE - 7, ledY, 4, 0, Math.PI * 2);
      c.fill();
      c.restore();
      // LED dot
      c.fillStyle = ledColor;
      c.beginPath();
      c.arc(tx + TILE_SIZE - 7, ledY, 1.5, 0, Math.PI * 2);
      c.fill();
    }
    // Cable bundle at bottom
    const cableColors = ['#cc5500', '#ccaa00', '#0055cc', '#cc5500'] as const;
    for (let ci = 0; ci < 4; ci++) {
      c.strokeStyle = cableColors[ci % cableColors.length] ?? '#cc5500';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(tx + 7 + ci * 3, ty + TILE_SIZE - 3);
      c.lineTo(tx + 7 + ci * 3, ty + TILE_SIZE);
      c.stroke();
    }
    // Ventilation strip
    c.fillStyle = '#080c10';
    c.fillRect(tx + 5, ty + TILE_SIZE - 6, TILE_SIZE - 10, 3);
    for (let vi = 0; vi < 6; vi++) {
      c.fillStyle = '#101820';
      c.fillRect(tx + 6 + vi * 3, ty + TILE_SIZE - 6, 2, 3);
    }
  });

  // ── 18: filing_cabinet ─────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FILING_CABINET, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Cabinet body
    c.fillStyle = '#1a2030';
    c.fillRect(tx + 6, ty + 3, TILE_SIZE - 12, TILE_SIZE - 6);
    addBevel(c, tx + 6, ty + 3, TILE_SIZE - 12, TILE_SIZE - 6, 2);
    c.strokeStyle = '#252d3a';
    c.lineWidth = 1;
    c.strokeRect(tx + 6, ty + 3, TILE_SIZE - 12, TILE_SIZE - 6);
    // Three drawers
    for (let drawer = 0; drawer < 3; drawer++) {
      const drawerY = ty + 5 + drawer * 8;
      c.fillStyle = '#1e2838';
      c.fillRect(tx + 7, drawerY, TILE_SIZE - 14, 7);
      // Drawer handle
      c.fillStyle = 'rgba(100,130,170,0.8)';
      c.fillRect(tx + TILE_SIZE / 2 - 4, drawerY + 2, 8, 3);
      // Label strip
      c.fillStyle = 'rgba(200,220,255,0.15)';
      c.fillRect(tx + 8, drawerY + 1, TILE_SIZE - 16, 2);
      // Drawer separator
      c.strokeStyle = '#303848';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(tx + 7, drawerY + 7);
      c.lineTo(tx + TILE_SIZE - 7, drawerY + 7);
      c.stroke();
    }
  });

  // ── 19: pipe_h ─────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.PIPE_H, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    const pipeY = ty + TILE_SIZE / 2 - 3;
    const pipeH = 6;
    // Shadow beneath pipe
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.fillRect(tx, pipeY + 2, TILE_SIZE, pipeH + 2);
    // Pipe body
    c.fillStyle = '#202838';
    c.fillRect(tx, pipeY, TILE_SIZE, pipeH);
    // Top highlight
    c.fillStyle = 'rgba(80,100,140,0.6)';
    c.fillRect(tx, pipeY, TILE_SIZE, 2);
    // Bottom shade
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.fillRect(tx, pipeY + pipeH - 2, TILE_SIZE, 2);
    // Center joint bracket
    c.fillStyle = '#2a3040';
    c.fillRect(tx + TILE_SIZE / 2 - 2, pipeY - 1, 4, pipeH + 2);
    c.fillStyle = 'rgba(100,120,160,0.4)';
    c.fillRect(tx + TILE_SIZE / 2 - 2, pipeY - 1, 4, 1);
    // Subtle hazard stripe
    c.save();
    c.globalAlpha = 0.12;
    c.fillStyle = '#ffcc00';
    c.fillRect(tx + 6, pipeY + 1, 3, pipeH - 2);
    c.fillRect(tx + 22, pipeY + 1, 3, pipeH - 2);
    c.restore();
  });

  // ── 20: wall_screen ────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.WALL_SCREEN, (c, tx, ty) => {
    c.fillStyle = '#0a0a18';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Screen bezel
    c.fillStyle = '#0d1525';
    c.fillRect(tx + 3, ty + 4, TILE_SIZE - 6, TILE_SIZE - 10);
    addBevel(c, tx + 3, ty + 4, TILE_SIZE - 6, TILE_SIZE - 10, 2);
    c.strokeStyle = '#1a2540';
    c.lineWidth = 1;
    c.strokeRect(tx + 3, ty + 4, TILE_SIZE - 6, TILE_SIZE - 10);
    // Screen display area
    c.fillStyle = '#000820';
    c.fillRect(tx + 5, ty + 6, TILE_SIZE - 10, TILE_SIZE - 14);
    // Data lines
    c.lineWidth = 0.5;
    const dataWidths = [14, 10, 12] as const;
    for (let row = 0; row < 3; row++) {
      c.strokeStyle = `rgba(0,150,220,${0.5 + row * 0.1})`;
      c.beginPath();
      c.moveTo(tx + 6, ty + 9 + row * 5);
      c.lineTo(tx + 6 + (dataWidths[row % dataWidths.length] ?? 12), ty + 9 + row * 5);
      c.stroke();
    }
    // Data node pixels
    c.fillStyle = '#00aaff';
    c.fillRect(tx + 7, ty + 8, 2, 2);
    c.fillRect(tx + 14, ty + 13, 2, 2);
    c.fillRect(tx + 10, ty + 18, 2, 2);
    // Screen ambient glow
    c.fillStyle = 'rgba(0,100,180,0.1)';
    c.fillRect(tx + 2, ty + 3, TILE_SIZE - 4, TILE_SIZE - 8);
    // Status LED
    c.fillStyle = '#00ff41';
    c.beginPath();
    c.arc(tx + TILE_SIZE - 6, ty + TILE_SIZE - 5, 1.5, 0, Math.PI * 2);
    c.fill();
  });

  // ── 21: caution_stripe ─────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CAUTION_STRIPE, (c, tx, ty) => {
    c.fillStyle = '#0a0a00';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // Diagonal yellow/black stripes
    const stripeW = 8;
    for (let i = -TILE_SIZE; i < TILE_SIZE * 2; i += stripeW * 2) {
      c.fillStyle = 'rgba(200,160,0,0.85)';
      c.save();
      c.beginPath();
      c.rect(tx, ty, TILE_SIZE, TILE_SIZE);
      c.clip();
      c.beginPath();
      c.moveTo(tx + i, ty);
      c.lineTo(tx + i + stripeW, ty);
      c.lineTo(tx + i + stripeW + TILE_SIZE, ty + TILE_SIZE);
      c.lineTo(tx + i + TILE_SIZE, ty + TILE_SIZE);
      c.closePath();
      c.fill();
      c.restore();
    }
    // Worn/dirty overlay
    applyNoise(c, tx, ty, 8, 900);
    // Edge frame
    c.strokeStyle = 'rgba(180,140,0,0.5)';
    c.lineWidth = 1;
    c.strokeRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  });

  // ── 22: oil_stain ──────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.OIL_STAIN, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 4, 700);
    addGrooves(c, tx, ty, 8, 0.1);
    // Oil blob (dark irregular ellipses)
    c.save();
    c.globalAlpha = 0.65;
    c.fillStyle = '#060810';
    c.beginPath();
    c.ellipse(tx + 16, ty + 17, 11, 8, 0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0a0c18';
    c.beginPath();
    c.ellipse(tx + 14, ty + 15, 7, 5, -0.4, 0, Math.PI * 2);
    c.fill();
    c.restore();
    // Iridescent sheen (oil/coolant rainbow)
    c.save();
    c.globalAlpha = 0.2;
    c.fillStyle = '#2040a0';
    c.beginPath();
    c.ellipse(tx + 15, ty + 16, 5, 3, 0.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#200040';
    c.beginPath();
    c.ellipse(tx + 18, ty + 17, 3, 2, -0.3, 0, Math.PI * 2);
    c.fill();
    c.restore();
  });

  // ── 23: carpet ─────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CARPET, (c, tx, ty) => {
    c.fillStyle = '#1a0e15';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 3, 800);
    // Weave cross-hatch
    c.save();
    c.globalAlpha = 0.12;
    c.strokeStyle = '#300020';
    c.lineWidth = 1;
    for (let gy = 2; gy < TILE_SIZE; gy += 4) {
      c.beginPath();
      c.moveTo(tx, ty + gy);
      c.lineTo(tx + TILE_SIZE, ty + gy);
      c.stroke();
    }
    for (let gx = 2; gx < TILE_SIZE; gx += 4) {
      c.beginPath();
      c.moveTo(tx + gx, ty);
      c.lineTo(tx + gx, ty + TILE_SIZE);
      c.stroke();
    }
    c.restore();
    // Trim border
    c.strokeStyle = 'rgba(120,80,90,0.4)';
    c.lineWidth = 1;
    c.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    // Subtle sheen
    c.fillStyle = 'rgba(80,40,60,0.1)';
    c.fillRect(tx + 4, ty + 4, TILE_SIZE / 2, TILE_SIZE / 2);
  });

  // ── 24: ceiling_light ──────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CEILING_LIGHT, (c, tx, ty) => {
    c.fillStyle = '#1c1e2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    applyNoise(c, tx, ty, 5, 1000);
    addGrooves(c, tx, ty, 8, 0.1);
    // Radial light reflection pool
    const cx = tx + TILE_SIZE / 2;
    const cy = ty + TILE_SIZE / 2;
    c.save();
    c.globalAlpha = 0.12;
    c.fillStyle = '#a0c0ff';
    c.beginPath();
    c.arc(cx, cy, 14, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 0.18;
    c.fillStyle = '#c0d8ff';
    c.beginPath();
    c.arc(cx, cy, 9, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 0.28;
    c.fillStyle = '#e0efff';
    c.beginPath();
    c.arc(cx, cy, 5, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 0.45;
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(cx, cy, 2, 0, Math.PI * 2);
    c.fill();
    c.restore();
    addEdgeVignette(c, tx, ty);
  });

  ct.refresh();
}
