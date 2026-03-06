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
    c.strokeStyle = '#1d2d5a';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  });

  // ── 1: floor_light ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.FLOOR_LIGHT, (c, tx, ty) => {
    c.fillStyle = '#16213e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.strokeStyle = '#1d3060';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 0.5, ty + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    // subtle highlight stripe
    c.strokeStyle = '#20304a';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx + 4, ty + TILE_SIZE / 2);
    c.lineTo(tx + TILE_SIZE - 4, ty + TILE_SIZE / 2);
    c.stroke();
  });

  // ── 2: wall ────────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.WALL, (c, tx, ty) => {
    c.fillStyle = '#0f0f23';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.strokeStyle = '#00ff41';
    c.lineWidth = 1;
    c.strokeRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    c.strokeStyle = '#003a0f';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 5, ty + 5, TILE_SIZE - 10, TILE_SIZE - 10);
  });

  // ── 3: wall_corner ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.WALL_CORNER, (c, tx, ty) => {
    c.fillStyle = '#0f0f23';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.strokeStyle = '#ff00ff';
    c.lineWidth = 1;
    c.strokeRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    // corner bracket accents
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx + 3, ty + 9);
    c.lineTo(tx + 3, ty + 3);
    c.lineTo(tx + 9, ty + 3);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 9, ty + 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + 9);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + 3, ty + TILE_SIZE - 9);
    c.lineTo(tx + 3, ty + TILE_SIZE - 3);
    c.lineTo(tx + 9, ty + TILE_SIZE - 3);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 9, ty + TILE_SIZE - 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 3);
    c.lineTo(tx + TILE_SIZE - 3, ty + TILE_SIZE - 9);
    c.stroke();
  });

  // ── 4: terminal ────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.TERMINAL, (c, tx, ty) => {
    c.fillStyle = '#0d0d1a';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // monitor screen
    c.fillStyle = '#001800';
    c.fillRect(tx + 4, ty + 4, TILE_SIZE - 8, TILE_SIZE - 14);
    // text scan lines
    c.strokeStyle = '#00ff41';
    c.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const lineY = ty + 7 + i * 4;
      const lineW = i === 1 ? 12 : i === 2 ? 16 : 18;
      c.beginPath();
      c.moveTo(tx + 6, lineY);
      c.lineTo(tx + 6 + lineW, lineY);
      c.stroke();
    }
    c.strokeRect(tx + 4, ty + 4, TILE_SIZE - 8, TILE_SIZE - 14);
    // base stand
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
    c.strokeRect(tx + 3, ty + 1, TILE_SIZE - 6, TILE_SIZE - 2);
    // dual panels
    c.fillStyle = '#071520';
    c.fillRect(tx + 5, ty + 3, 10, TILE_SIZE - 6);
    c.fillRect(tx + 17, ty + 3, 10, TILE_SIZE - 6);
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 0.5;
    c.strokeRect(tx + 5, ty + 3, 10, TILE_SIZE - 6);
    c.strokeRect(tx + 17, ty + 3, 10, TILE_SIZE - 6);
    // center gap line
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
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 2;
    // just frame pillars
    c.beginPath();
    c.moveTo(tx + 4, ty);
    c.lineTo(tx + 4, ty + TILE_SIZE);
    c.stroke();
    c.beginPath();
    c.moveTo(tx + TILE_SIZE - 4, ty);
    c.lineTo(tx + TILE_SIZE - 4, ty + TILE_SIZE);
    c.stroke();
    // threshold glow
    c.strokeStyle = '#00ffff';
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
    c.strokeStyle = '#ff00ff';
    c.lineWidth = 2;
    c.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    // center door split
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(tx + TILE_SIZE / 2, ty + 4);
    c.lineTo(tx + TILE_SIZE / 2, ty + TILE_SIZE - 4);
    c.stroke();
    // up/down arrows
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
  });

  // ── 8: desk ────────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.DESK, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.fillStyle = '#2a1a0a';
    c.fillRect(tx + 3, ty + 5, TILE_SIZE - 6, TILE_SIZE - 12);
    c.strokeStyle = '#3a2a1a';
    c.lineWidth = 1;
    c.strokeRect(tx + 3, ty + 5, TILE_SIZE - 6, TILE_SIZE - 12);
    // legs
    c.fillStyle = '#1a0f05';
    c.fillRect(tx + 4, ty + TILE_SIZE - 8, 4, 6);
    c.fillRect(tx + TILE_SIZE - 8, ty + TILE_SIZE - 8, 4, 6);
  });

  // ── 9: chair ───────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CHAIR, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.fillStyle = '#1a2a3a';
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2, 10, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 1;
    c.stroke();
    // backrest suggestion
    c.strokeStyle = '#1a3a5a';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2, 6, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
  });

  // ── 10: planter ────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.PLANTER, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // pot
    c.fillStyle = '#2a1a0a';
    c.fillRect(tx + 8, ty + 18, 16, 10);
    c.strokeStyle = '#3a2a1a';
    c.lineWidth = 1;
    c.strokeRect(tx + 8, ty + 18, 16, 10);
    // foliage
    c.fillStyle = '#0a3a0a';
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + 14, 9, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#00ff41';
    c.lineWidth = 0.5;
    c.stroke();
    // stem
    c.strokeStyle = '#0a2a0a';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx + 16, ty + 18);
    c.lineTo(tx + 16, ty + 23);
    c.stroke();
  });

  // ── 11: reception_desk ─────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.RECEPTION_DESK, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.fillStyle = '#0f1f2f';
    c.fillRect(tx + 2, ty + 4, TILE_SIZE - 4, TILE_SIZE - 8);
    c.strokeStyle = '#00e5ff';
    c.lineWidth = 1.5;
    c.strokeRect(tx + 2, ty + 4, TILE_SIZE - 4, TILE_SIZE - 8);
    // top panel glow line
    c.fillStyle = '#00e5ff';
    c.fillRect(tx + 4, ty + 6, TILE_SIZE - 8, 2);
    // logo dot
    c.fillStyle = '#00ffff';
    c.beginPath();
    c.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2 + 2, 3, 0, Math.PI * 2);
    c.fill();
  });

  // ── 12: neon_strip ─────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.NEON_STRIP, (c, tx, ty) => {
    c.fillStyle = '#0a0a1e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // outer glow
    c.fillStyle = '#003333';
    c.fillRect(tx + 2, ty + 13, TILE_SIZE - 4, 6);
    // bright core
    c.fillStyle = '#00ffff';
    c.fillRect(tx + 4, ty + 14, TILE_SIZE - 8, 4);
    // white hot center
    c.fillStyle = '#ffffff';
    c.fillRect(tx + 6, ty + 15, TILE_SIZE - 12, 2);
  });

  // ── 13: vent ───────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.VENT, (c, tx, ty) => {
    c.fillStyle = '#0f0f1e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    c.strokeStyle = '#2a2a3e';
    c.lineWidth = 1;
    // horizontal slats
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i % 2 === 0 ? '#1a1a2e' : '#141428';
      c.fillRect(tx + 3, ty + 4 + i * 5, TILE_SIZE - 6, 4);
    }
    c.strokeStyle = '#3a3a5e';
    c.lineWidth = 1;
    c.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  });

  // ── 14: cable ──────────────────────────────────────────────────────────────
  drawAt(ctx, TILE_IDX.CABLE, (c, tx, ty) => {
    c.fillStyle = '#1a1a2e';
    c.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
    // orange cable trace
    c.strokeStyle = '#cc5500';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(tx, ty + 10);
    c.lineTo(tx + 16, ty + 10);
    c.lineTo(tx + 16, ty + 22);
    c.lineTo(tx + TILE_SIZE, ty + 22);
    c.stroke();
    // yellow cable trace
    c.strokeStyle = '#ccaa00';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(tx, ty + 20);
    c.lineTo(tx + 10, ty + 20);
    c.lineTo(tx + 10, ty + 8);
    c.lineTo(tx + TILE_SIZE, ty + 8);
    c.stroke();
  });

  ct.refresh();
}
