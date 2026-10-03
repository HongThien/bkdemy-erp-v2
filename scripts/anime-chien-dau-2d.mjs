// Nén bộ CHIẾN ĐẤU 2D của nhân vật chính (Thùy giao 02/10: design/bk-ui-src/AppHS/Animation/chien_dau/ — README.md · nam|nu/DESIGN.md · combat-data.json)
// vào public/bk-ui/hs/skin/rpg/dau_truong/: <nam|nu>/<tư thế>.webp (GIỮ NGUYÊN khổ canvas 1024×1536 thu còn 512×768 — không cắt, vì neo/điểm tay tính theo canvas gốc)
// + fx_<loại>.webp (đạn/lớp băng, alpha) + nen_san_dau.jpg; rồi sinh src/screens/hocsinh/skin/heroDau.ts (neo đất · điểm tay · cao thân đứng · chuỗi tư thế theo DESIGN.md).
// Không bao giờ ship PNG gốc (~2MB/ảnh).
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'
const J = (...a) => path.join(...a).split(path.sep).join('/') // loadImage trên Windows cần dấu /

const SRC = 'design/bk-ui-src/AppHS/Animation/chien_dau', OUT = 'public/bk-ui/hs/skin/rpg/dau_truong'
const data = JSON.parse(fs.readFileSync(J(SRC, 'combat-data.json'), 'utf8'))
const W = 512, H = 768

async function nen(file, w, h, out, kieu = 'webp', q = 82) {
  const im = await loadImage(J(SRC, file)), c = createCanvas(w, h ?? Math.round(w * im.height / im.width)), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height)
  const buf = await c.encode(kieu === 'jpg' ? 'jpeg' : 'webp', q)
  fs.writeFileSync(J(OUT, out), buf); return buf.length
}

let tong = 0
const meta = {}
for (const g of ['nam', 'nu']) {
  fs.mkdirSync(J(OUT, g), { recursive: true }); meta[g] = {}
  for (const p of data.poses) {
    tong += await nen(`${g}/assets/characters/chinh_${g}_${p}.png`, W, H, `${g}/${p}.webp`)
    const m = data.meta[g][p]
    meta[g][p] = { ay: +m.anchor[1].toFixed(4), tay: m.hands.map(([a, b]) => [+a.toFixed(3), +b.toFixed(3)]) }
  }
}
// FX + nền dùng chung 2 giới (md5 trùng nhau) — lấy bản trong nam/
for (const [f, w] of [['fx_cau_lua', 640], ['fx_cau_bang', 640], ['fx_dan_ma', 512], ['fx_thien_thach', 400], ['fx_bang_boc', 400]]) tong += await nen(`nam/assets/fx/${f}.png`, w, null, `${f}.webp`)
tong += await nen('nam/assets/backdrop/backdrop_san_dau.png', 1600, null, 'nen_san_dau.jpg', 'jpg', 80)

const cao = Object.fromEntries(Object.entries(data.standingHeight).map(([g, v]) => [g, +(v / 1536).toFixed(4)]))
fs.writeFileSync('src/screens/hocsinh/skin/heroDau.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-chien-dau-2d.mjs — đừng sửa tay. Bộ CHIẾN ĐẤU 2D nhân vật chính (15 tư thế × nam/nữ, Thùy 02/10); ảnh ở public/bk-ui/hs/skin/rpg/dau_truong/.
// Mọi tư thế CÙNG khổ canvas, trục thân x = 50%. ay = neo ĐẤT (tỉ lệ dọc canvas) · tay = điểm tay/tâm cầu (tỉ lệ canvas) · thanDung = cao thân tư thế đứng / cao canvas
// ⇒ CÙNG một tỉ lệ cho mọi tư thế (theo tư thế đứng) — không phóng tư thế gục theo hộp bao (DESIGN.md).
export type TuTheDau = ${data.poses.map((p) => `'${p}'`).join(' | ')}
export interface NeoTuThe { ay: number; tay: number[][] }
export const TU_THE_DAU: TuTheDau[] = ${JSON.stringify(data.poses)}
export const HERO_DAU: Record<'nam' | 'nu', Record<TuTheDau, NeoTuThe>> = ${JSON.stringify(meta, null, 2)}
export const THAN_DUNG: Record<'nam' | 'nu', number> = ${JSON.stringify(cao)}
export const KHO_DAU = { w: ${W}, h: ${H} }
const G = '/bk-ui/hs/skin/rpg/dau_truong'
export const anhDau = (g: 'nam' | 'nu', p: TuTheDau) => \`\${G}/\${g}/\${p}.webp\`
export type FxDau = 'fx_cau_lua' | 'fx_cau_bang' | 'fx_dan_ma' | 'fx_thien_thach' | 'fx_bang_boc'
export const anhFx = (f: FxDau) => \`\${G}/\${f}.webp\`
/** Hộp vẽ để THÂN đứng cao đúng \`cao\` px, chân tư thế \`p\` chạm (x, y). */
export function hopDau(g: 'nam' | 'nu', p: TuTheDau, cao: number, x: number, y: number) {
  const h = cao / THAN_DUNG[g], w = h * (KHO_DAU.w / KHO_DAU.h)
  return { left: x - 0.5 * w, top: y - HERO_DAU[g][p].ay * h, width: w, height: h }
}
`)
console.log('xong, tổng', (tong / 1024).toFixed(0), 'KB')
