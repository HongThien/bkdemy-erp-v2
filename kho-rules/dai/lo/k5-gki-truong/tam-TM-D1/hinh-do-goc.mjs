// Do goc tren hinh hinh thang ABCD (TM-D1 Cau 7.3) tu anh cat: khop duong thang vao cac pixel den.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { PNG } = require('pngjs');

const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
const { width: W, height: H, data } = png;
const dark = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (g < 100) dark.push([x, y]);
  }
}
// toa do xap xi (pixel, y xuong) doc tu anh: chi dung de chon pixel gan moi doan
const P = { A: [340, 208], B: [980, 192], C: [1162, 730], D: [145, 738], G: [772, 732], H: [1060, 462] };
const SEGS = [['A', 'B'], ['A', 'D'], ['A', 'G'], ['D', 'C'], ['B', 'C'], ['G', 'H']];

function fit(p, q) {
  const [x1, y1] = p, [x2, y2] = q;
  const L = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  const pts = [];
  for (const [x, y] of dark) {
    const t = (x - x1) * ux + (y - y1) * uy;
    const d = Math.abs(-(x - x1) * uy + (y - y1) * ux);
    if (t > 45 && t < L - 45 && d < 9) pts.push([x, y]);
  }
  const n = pts.length;
  const mx = pts.reduce((s, a) => s + a[0], 0) / n;
  const my = pts.reduce((s, a) => s + a[1], 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [a, b] of pts) { sxx += (a - mx) ** 2; syy += (b - my) ** 2; sxy += (a - mx) * (b - my); }
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  let dx = Math.cos(th), dy = Math.sin(th);
  if (dx * ux + dy * uy < 0) { dx = -dx; dy = -dy; }
  return { m: [mx, my], d: [dx, dy], n };
}
const lines = {};
for (const [a, b] of SEGS) { lines[a + b] = fit(P[a], P[b]); console.log(a + b, 'so pixel', lines[a + b].n); }

function inter(l1, l2) {
  const [x1, y1] = l1.m, [dx1, dy1] = l1.d, [x2, y2] = l2.m, [dx2, dy2] = l2.d;
  const det = dx1 * -dy2 - dy1 * -dx2;
  const t = ((x2 - x1) * -dy2 - (y2 - y1) * -dx2) / det;
  return [x1 + t * dx1, y1 + t * dy1];
}
const V = {
  A: inter(lines.AB, lines.AD), B: inter(lines.AB, lines.BC), C: inter(lines.DC, lines.BC),
  D: inter(lines.AD, lines.DC), G: inter(lines.AG, lines.DC), H: inter(lines.BC, lines.GH),
};
for (const k in V) console.log(k, V[k].map((v) => v.toFixed(1)).join(', '));

function ang(o, a, b) {
  const [ox, oy] = V[o];
  const ax = V[a][0] - ox, ay = V[a][1] - oy, bx = V[b][0] - ox, by = V[b][1] - oy;
  const c = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}
// cac tia xuat phat tu moi dinh (H nam tren BC, G nam tren DC)
const rays = { A: ['B', 'G', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'], G: ['D', 'A', 'H', 'C'], H: ['B', 'G', 'C'] };
let bet = 0, tu = 0, nhon = 0, vuong = 0;
for (const o in rays) {
  const rs = rays[o];
  for (let i = 0; i < rs.length; i++) {
    for (let j = i + 1; j < rs.length; j++) {
      const a = ang(o, rs[i], rs[j]);
      let loai = a > 179 ? 'bet' : a > 91 ? 'tu' : a < 89 ? 'nhon' : 'vuong?';
      if (loai === 'bet') bet++; else if (loai === 'tu') tu++; else if (loai === 'nhon') nhon++; else vuong++;
      console.log(`goc ${rs[i]}${o}${rs[j]} = ${a.toFixed(1)}  ${loai}`);
    }
  }
}
console.log({ bet, tu, nhon, vuong });
