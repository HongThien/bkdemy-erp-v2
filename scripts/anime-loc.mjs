// Nén 15 animation của LỘC (tinh linh dẫn truyện — kit design/bk-ui-src/AppHS/Animation/loc-narrator, Thùy 07/10) cho style RPG.
//  · 15 × 8 khung PNG 768×768 → CẮT chung 1 hộp quanh nhân vật (neo chân giữ nguyên giữa các khung) → webp ~336×358.
//  · Ghi public/bk-ui/hs/skin/rpg/loc/<anim>_<NN>.webp + SINH src/screens/hocsinh/skin/styles/rpgLoc.ts (LOC) — KHÔNG sửa tay file đó.
//  · `giu` = khung giữ lại với động tác "phát một lần": khung CUỐI (08) của nhiều động tác không còn đúng động tác (thinking/winking/laughing → dang tay cười, surprised → trung tính,
//    goodbye → chắp tay) ⇒ giữ ở khung đỉnh động tác (xem memory loc-narrator-tutorial).
// Chạy: node scripts/anime-loc.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const KIT = 'design/bk-ui-src/AppHS/Animation/loc-narrator/animation-frames-v1'
const OUT = 'public/bk-ui/hs/skin/rpg/loc'
const URL = '/bk-ui/hs/skin/rpg/loc'
const data = JSON.parse(fs.readFileSync(`${KIT}/animation-data.json`, 'utf8'))
const ds = Array.isArray(data.animations) ? data.animations : Object.entries(data.animations).map(([name, v]) => ({ name, ...v }))

// Hộp cắt chung (đo từ validation.json: nhân vật nằm trong x 148–663, y 70–678) + lề an toàn cho cánh/cánh tay giơ cao
const CX = 96, CY = 48, CW = 608, CH = 648
const F = 0.56
const W = Math.round(CW * F), H = Math.round(CH * F)
// khung giữ lại với động tác phát một lần (chỉ số 1-based); mặc định 8
const GIU = { thinking: 5, winking: 5, laughing: 5, surprised: 4, goodbye: 5, greeting: 8, open_book: 8, point_left: 8, point_right: 8, point_up: 8, cheering: 8 }

fs.mkdirSync(OUT, { recursive: true })
let tong = 0
const anim = {}
for (const a of ds) {
  const src = []
  for (let i = 1; i <= 8; i++) {
    const nn = String(i).padStart(2, '0')
    const im = await loadImage(`${KIT}/${a.name}/${a.name}_${nn}.png`)
    const c = createCanvas(W, H), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
    g.drawImage(im, CX, CY, CW, CH, 0, 0, W, H)
    const buf = c.toBuffer('image/webp', 88)
    fs.writeFileSync(`${OUT}/${a.name}_${nn}.webp`, buf); tong += buf.length
    src.push(`${URL}/${a.name}_${nn}.webp`)
  }
  anim[a.name] = { src, lap: !!a.loop, ...(a.loop ? {} : { giu: GIU[a.name] ?? 8 }) }
}
const LOC = { rong: W, cao: H, fps: 8, anim }
fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgLoc.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-loc.mjs (Lộc — người dẫn truyện, 15 động tác × 8 khung, 07/10) — KHÔNG sửa tay.
import type { NguoiDanAnh } from '../anhGiaoDien'
export const LOC: NguoiDanAnh = ${JSON.stringify(LOC, null, 1)}
`)
console.log('xong', Math.round(tong / 1024) + 'KB', W + 'x' + H, Object.keys(anim).length + ' động tác')
