// Nén bộ CHẠY BỘ 2D của nhân vật chính (Thùy giao 02/10: design/bk-ui-src/AppHS/Animation/ANIMATION.md) vào public/bk-ui/hs/skin/rpg/chay/<nam|nu>/ (f1..f6.webp + dung.webp, GIỮ NGUYÊN khổ canvas 1024×1536 thu còn 360×540 —
// không cắt, vì neo tính theo canvas gốc) và sinh src/screens/hocsinh/skin/heroChay.ts: neo trục thân x=0,55 · neo ĐẤT từng khung (bảng ANIMATION.md) · đỉnh tóc (đo alpha>40) để quy ra cỡ thân.
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'
const J = (...a) => path.join(...a).split(path.sep).join('/') // loadImage trên Windows cần dấu /

const SRC = 'design/bk-ui-src/AppHS/Animation', OUT = 'public/bk-ui/hs/skin/rpg/chay'
// Thùy đổi tên + khung 02/10 tối (ANIMATION.md còn bản cũ): 00 đứng yên + 6 khung chạy
const KHUNG = ['01_chay_buoc_trai', '02_chay_ha_nguoi_trai', '03_chay_nang_goi_phai', '04_chay_buoc_phai', '05_chay_ha_nguoi_phai', '06_chay_nang_goi_trai']
// neo đất MỖI KHUNG = ĐÁY hộp alpha (alpha>40) đo trên chính ảnh — bộ khung mới đổi so với bảng neo trong ANIMATION.md (chân thấp nhất = chân trụ chạm đất)
const W = 360, H = 540
const meta = {}

for (const g of ['nam', 'nu']) {
  const out = path.join(OUT, g); fs.mkdirSync(out, { recursive: true })
  const files = [...KHUNG.map((k) => `${g}/${g}_${k}.png`), `${g}/${g}_00_dung_yen.png`]
  let top = 1, ayDung = 0.95; const ay = []
  for (const [i, f] of files.entries()) {
    const im = await loadImage(J(SRC, f)), c = createCanvas(W, H), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, W, H)
    const d = x.getImageData(0, 0, W, H).data; let y0 = H, y1 = 0
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (d[(y * W + xx) * 4 + 3] > 40) { if (y < y0) y0 = y; if (y > y1) y1 = y }
    top = Math.min(top, y0 / H)
    if (i === 6) ayDung = +((y1 + 1) / H).toFixed(3); else ay.push(+((y1 + 1) / H).toFixed(3))
    fs.writeFileSync(path.join(out, i < 6 ? `f${i + 1}.webp` : 'dung.webp'), await c.encode('webp', 84))
  }
  meta[g] = { w: W, h: H, ax: 0.55, ay, ayDung, top: +top.toFixed(3) }
}
fs.writeFileSync('src/screens/hocsinh/skin/heroChay.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-chay-2d.mjs — đừng sửa tay. Bộ CHẠY 2D nhân vật chính (6 khung × 100ms, delta thời gian) + khung đứng yên; ảnh ở public/bk-ui/hs/skin/rpg/chay/<giới>/.
// ax = trục thân (tỉ lệ ngang canvas) · ay[i] = neo ĐẤT khung i+1 · ayDung = neo khung đứng · top = đỉnh tóc (tỉ lệ dọc) ⇒ cao thân = (ay − top) × cao canvas.
export interface HeroChay { w: number; h: number; ax: number; ay: number[]; ayDung: number; top: number }
export const HERO_CHAY: Record<'nam' | 'nu', HeroChay> = ${JSON.stringify(meta, null, 2)}
export const CHU_KY_MS = 600 // 6 khung × 100ms
export const anhChay = (g: 'nam' | 'nu', i: number | 'dung') => \`/bk-ui/hs/skin/rpg/chay/\${g}/\${i === 'dung' ? 'dung' : 'f' + (i + 1)}.webp\`
/** Khung đang hiện theo thời gian trôi (ms) — dùng DELTA thời gian, không đếm rAF. */
export const khungTheoMs = (ms: number) => Math.floor(ms / (CHU_KY_MS / 6)) % 6
/** Kích thước + vị trí vẽ để THÂN (đỉnh tóc → đất) cao đúng \`cao\` px, đế chân ở (x, y). \`i\` = khung (0–5) hoặc 'dung'. */
export function hopVe(g: 'nam' | 'nu', i: number | 'dung', cao: number, x: number, y: number) {
  // CÙNG một tỉ lệ cho mọi khung (theo neo trung bình của 6 khung chạy) — neo riêng từng khung chỉ dùng để đặt chân, không đổi cỡ ⇒ không giật cỡ giữa các khung
  const m = HERO_CHAY[g], ay = i === 'dung' ? m.ayDung : m.ay[i], ref = m.ay.reduce((s, v) => s + v, 0) / m.ay.length, H = cao / (ref - m.top), Wd = H * (m.w / m.h)
  return { left: x - m.ax * Wd, top: y - ay * H, width: Wd, height: H }
}
`)
console.log(JSON.stringify(meta))
