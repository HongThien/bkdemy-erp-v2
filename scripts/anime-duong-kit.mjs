// Dò TÂM ĐƯỜNG THẬT trên nền từng kit lục địa (DESIGN.md của kit ghi tuyến "xấp xỉ, cần đối chiếu khi tích hợp"): mặt nạ màu đường đất → Dijkstra (rẻ nhất trên lòng đường, đắt khi băng qua rừng)
// giữa các mốc theo thứ tự, làm mượt ⇒ sinh src/screens/hocsinh/phieuluu/ban2d/kitLucDia.duong.ts (x%, y%) + chỉ số điểm mốc. Mốc = chân công trình trong kitLucDia.ts (không đổi).
// Ảnh soi: scratchpad/duong_<biome>.png (mặt nạ + đường). Chạy lại được.
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const OUT = process.argv[2] ?? '.'
const KIT = {
  rung: { nen: 'public/bk-ui/hs/skin/rpg/lucdia/rung/nen.jpg', vao: [0, 50], ra: [100, 50], moc: [[12, 72], [19, 25], [36, 56], [40, 31], [55, 77], [63, 30], [80, 67], [90, 35]] },
  thanh_co: { nen: 'public/bk-ui/hs/skin/rpg/lucdia/thanh_co/nen.jpg', vao: [0, 53], ra: [100, 53], moc: [[10.5, 52], [23.5, 33.5], [36, 63], [46, 39], [63, 38], [60, 69], [82, 73], [88, 44]] },
  anh_dao: { nen: 'public/bk-ui/hs/skin/rpg/lucdia/anh_dao/nen.jpg', vao: [0, 44], ra: [100, 62], moc: [[8.5, 42], [26, 61], [32, 45], [47, 47], [59, 36], [69, 67], [80, 29], [89, 63]] },
}
// kit sa mạc: đường LÁT ĐÁ nhạt (hue 41–49, s .26–.39, v>.95) khác cát (s ≥ .43) · kit đầm lầy: đường đất cam (hue 27–38, s .5–.66)
KIT.sa_mac = { nen: 'public/bk-ui/hs/skin/rpg/lucdia/sa_mac/nen.jpg', vao: [0, 88], ra: [100, 34], moc: [[14, 84], [19, 33], [41, 85], [55, 28], [82, 85], [88, 34]], mau: (h, s, v) => h > 40 && h < 50 && s > 0.26 && s < 0.39 && v > 0.95 }
KIT.dam_lay = { nen: 'public/bk-ui/hs/skin/rpg/lucdia/dam_lay/nen.jpg', vao: [0, 38], ra: [100, 48], moc: [[11, 38], [21, 72], [35, 40], [48, 59], [69, 81], [58, 34], [83, 61], [90, 35]], mau: (h, s, v) => h > 26 && h < 39 && s > 0.5 && s < 0.67 && v > 0.85 }
const W = 1672, H = 941

function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  let h = 0; if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360 }
  return [h, mx ? d / mx : 0, mx / 255]
}
class Heap {
  constructor() { this.k = new Float64Array(1 << 20); this.v = new Int32Array(1 << 20); this.n = 0 }
  push(key, val) {
    if (this.n === this.k.length) { const k2 = new Float64Array(this.n * 2), v2 = new Int32Array(this.n * 2); k2.set(this.k); v2.set(this.v); this.k = k2; this.v = v2 }
    let i = this.n++; const k = this.k, v = this.v
    while (i > 0) { const p = (i - 1) >> 1; if (k[p] <= key) break; k[i] = k[p]; v[i] = v[p]; i = p }
    k[i] = key; v[i] = val
  }
  pop() {
    const k = this.k, v = this.v, tk = k[0], tv = v[0], lk = k[--this.n], lv = v[this.n]; let i = 0
    for (;;) { let m = 2 * i + 1; if (m >= this.n) break; if (m + 1 < this.n && k[m + 1] < k[m]) m++; if (k[m] >= lk) break; k[i] = k[m]; v[i] = v[m]; i = m }
    k[i] = lk; v[i] = lv; return [tk, tv]
  }
}

for (const [biome, kit] of Object.entries(KIT)) {
  const im = await loadImage(kit.nen), c = createCanvas(W, H), g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H)
  const px = g.getImageData(0, 0, W, H).data, mask = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) { const [h, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); mask[i] = (kit.mau ? kit.mau(h, s, v) : h > 24 && h < 46 && s > 0.30 && s < 0.62 && v > 0.74) ? 1 : 0 }
  // khoảng cách tới ngoài đường (chamfer 2 lượt) ⇒ ưu tiên tâm đường
  const dt = new Float32Array(W * H).fill(0)
  for (let i = 0; i < W * H; i++) dt[i] = mask[i] ? 1e4 : 0
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!mask[i]) continue; dt[i] = Math.min(dt[i], dt[i - 1] + 1, dt[i - W] + 1, dt[i - W - 1] + 1.41, dt[i - W + 1] + 1.41) }
  for (let y = H - 2; y > 0; y--) for (let x = W - 2; x > 0; x--) { const i = y * W + x; if (!mask[i]) continue; dt[i] = Math.min(dt[i], dt[i + 1] + 1, dt[i + W] + 1, dt[i + W + 1] + 1.41, dt[i + W - 1] + 1.41) }
  const mxd = 22
  const cost = (i) => (mask[i] ? 1 + 5 * (1 - Math.min(dt[i], mxd) / mxd) ** 2 : 14)
  const gan = (xp, yp) => { // chân công trình / mép ảnh → điểm gần nhất trong bán kính 60px (ưu tiên đường); không có ⇒ chính nó
    const cx = Math.round((xp / 100) * (W - 1)), cy = Math.round((yp / 100) * (H - 1)); return [cx, cy]
  }
  const duong = (a, b) => {
    const [ax, ay] = a, [bx, by] = b, M = 140
    const x0 = Math.max(0, Math.min(ax, bx) - M), x1 = Math.min(W - 1, Math.max(ax, bx) + M), y0 = Math.max(0, Math.min(ay, by) - M), y1 = Math.min(H - 1, Math.max(ay, by) + M)
    const dist = new Map(), cha = new Map(), h = new Heap(), A = ay * W + ax
    dist.set(A, 0); h.push(Math.hypot(bx - ax, by - ay), A)
    while (h.n) {
      const [, u] = h.pop(); const d = dist.get(u), ux = u % W, uy = (u / W) | 0
      if (ux === bx && uy === by) break
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue; const vx = ux + dx, vy = uy + dy; if (vx < x0 || vy < y0 || vx > x1 || vy > y1) continue
        const v = vy * W + vx, nd = d + cost(v) * (dx && dy ? 1.414 : 1); if (nd < (dist.get(v) ?? 1e12)) { dist.set(v, nd); cha.set(v, u); h.push(nd + Math.hypot(bx - vx, by - vy), v) }
      }
    }
    const p = []; for (let u = by * W + bx; u !== undefined; u = cha.get(u)) p.push([u % W, (u / W) | 0]); return p.reverse()
  }
  const diem = [gan(...kit.vao), ...kit.moc.map((m) => gan(...m)), gan(...kit.ra)]
  let all = [], moc = []
  for (let i = 0; i < diem.length - 1; i++) { const seg = duong(diem[i], diem[i + 1]); all = all.concat(i ? seg.slice(1) : seg); if (i < diem.length - 2) moc.push(all.length - 1) }
  // làm mượt (trung bình trượt 25 điểm) giữ nguyên các mốc, rồi thưa còn mỗi ~14 điểm
  const sm = all.map((p, i) => { if (moc.includes(i)) return p; let sx = 0, sy = 0, n = 0; for (let k = -12; k <= 12; k++) { const q = all[Math.max(0, Math.min(all.length - 1, i + k))]; sx += q[0]; sy += q[1]; n++ } return [sx / n, sy / n] })
  const giu = []; sm.forEach((p, i) => { if (i === 0 || i === sm.length - 1 || moc.includes(i) || i % 14 === 0) giu.push(i) })
  // bỏ điểm thường quá sát mốc (tránh nhấp nhô)
  const ket = giu.filter((i, k, a) => moc.includes(i) || !a.some((j) => moc.includes(j) && Math.abs(j - i) < 7))
  const dd = ket.map((i) => [+((sm[i][0] / (W - 1)) * 100).toFixed(2), +((sm[i][1] / (H - 1)) * 100).toFixed(2)])
  const dm = moc.map((i) => ket.indexOf(i))
  // ảnh soi
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, W, H)
  const id = g.getImageData(0, 0, W, H); for (let i = 0; i < W * H; i++) if (mask[i]) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 230; id.data[i * 4 + 2] = 120; id.data[i * 4 + 3] = 255 } g.putImageData(id, 0, 0)
  g.strokeStyle = 'magenta'; g.lineWidth = 3; g.beginPath(); ket.forEach((i, k) => (k ? g.lineTo(sm[i][0], sm[i][1]) : g.moveTo(sm[i][0], sm[i][1]))); g.stroke()
  g.fillStyle = 'cyan'; for (const [x, y] of kit.moc) { g.beginPath(); g.arc((x / 100) * W, (y / 100) * H, 8, 0, 7); g.fill() }
  fs.writeFileSync(`${OUT}/duong_${biome}.png`, c.toBuffer('image/png'))
  console.log(biome, 'mask', ((mask.reduce((a, b) => a + b, 0) / (W * H)) * 100).toFixed(1) + '%', 'điểm', dd.length, 'mốc', dm.join(','))
  fs.writeFileSync(`${OUT}/duong_${biome}.json`, JSON.stringify({ duong: dd, diemMoc: dm }))
}

// ghi file dữ liệu cho app
const ts = {}
for (const b of Object.keys(KIT)) ts[b] = JSON.parse(fs.readFileSync(`${OUT}/duong_${b}.json`, 'utf8'))
fs.writeFileSync('src/screens/hocsinh/phieuluu/ban2d/kitLucDia.duong.ts',
  `// SINH TỰ ĐỘNG bởi scripts/anime-duong-kit.mjs — đừng sửa tay. Tâm đường THẬT dò từ nền từng kit (x%, y% khung 16:9) + chỉ số điểm là mốc của 8 công trình.\nexport const DUONG_DO: Record<string, { duong: [number, number][]; diemMoc: number[] }> = ${JSON.stringify(ts)}\n`)
