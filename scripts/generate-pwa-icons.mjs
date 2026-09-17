/**
 * Generate solid-color PNG icons (no deps) so the PWA is installable on
 * Windows (Edge/Chrome) and Android. Runs at build time.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../public/icons");
mkdirSync(dir, { recursive: true });

const BG = [12, 13, 18, 255];
const ACCENT = [74, 111, 74, 255];
const FG = [232, 240, 228, 255];
const INK = [12, 13, 18, 255];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngRGBA(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const compressed = deflateSync(raw);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function paint(size, maskable) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const pad = maskable ? size * 0.18 : size / 10;
  const rOuter = size / 2 - pad;
  const rInner = maskable ? size * 0.18 : size / 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      let c = BG;
      if (d <= rOuter) c = ACCENT;
      if (d <= rInner) c = FG;
      rgba[i] = c[0];
      rgba[i + 1] = c[1];
      rgba[i + 2] = c[2];
      rgba[i + 3] = c[3];
    }
  }

  const unit = size / 16;
  const ox = size / 2 - unit * 2;
  const oy = size / 2 - unit * 3;
  const bars = [
    [0, 0, 4, 1],
    [0, 0, 1, 2.5],
    [0, 2.2, 4, 1],
    [3, 2.5, 1, 2.5],
    [0, 4.5, 4, 1],
  ];
  for (const [bx, by, bw, bh] of bars) {
    const x0 = Math.floor(ox + bx * unit);
    const y0 = Math.floor(oy + by * unit);
    const x1 = Math.floor(ox + (bx + bw) * unit);
    const y1 = Math.floor(oy + (by + bh) * unit);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const i = (y * size + x) * 4;
        rgba[i] = INK[0];
        rgba[i + 1] = INK[1];
        rgba[i + 2] = INK[2];
        rgba[i + 3] = 255;
      }
    }
  }

  return pngRGBA(size, size, rgba);
}

const targets = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-180.png", 180, false],
  ["icon-192-maskable.png", 192, true],
  ["icon-512-maskable.png", 512, true],
];

for (const [name, size, maskable] of targets) {
  const buf = paint(size, maskable);
  writeFileSync(join(dir, name), buf);
  console.log("wrote", name, buf.length);
}
