// Nén 2 boss Trang (phù thủy sách phép) + Cường (kiếm sư không gian) — design/bk-ui-src/AppHS/Animation/{trang,cuong}-boss (kit 07/10, PNG RGBA 1024×1024)
// → public/bk-ui/hs/skin/rpg/boss/{trang,cuong}/<tên>.webp  +  src/screens/hocsinh/skin/styles/rpgBossMeta.ts (SỐ ĐO sinh tự động — đừng sửa tay).
//
// Khác Minh Quân (44 khung đã cùng neo sẵn): 14 pose của kit này KHÔNG cùng neo (pivot mỗi pose một chỗ, scaleHint mỗi pose một tỉ lệ — player.js đặt từng pose theo pivot+scaleHint).
// Nên script "chuẩn hoá" lại: mỗi pose được đặt sao cho PIVOT (điểm chân) rơi đúng 1 điểm neo CHUNG, nhân scaleHint (thân cao bằng nhau), cắt theo hộp bao chung của mọi pose
// (khung nhỏ hơn nhiều so với 1024² mà không mất pixel nào), rồi LẬT NGANG (kit vẽ boss bên TRÁI nhìn sang phải; app để boss bên PHẢI nhìn sang trái).
// Tất cả pose cùng 1 boss ⇒ cùng cỡ khung + cùng neo ⇒ ClipBoss {rong, cao, px, py} dùng chung, đổi pose không nhảy.
// Điểm "tay" (nòng phóng) và "sách" mỗi pose cũng quy về toạ độ khung đã lật (so với neo) để ghi vào rpgBossMeta.ts.
// Chạy: node scripts/anime-boss-trang-cuong.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const GOC = 'design/bk-ui-src/AppHS/Animation'
const RA = 'public/bk-ui/hs/skin/rpg/boss'
const Q = 0.54 // pixel nguồn → pixel khung: thân ~978px ⇒ ~528px, cùng cỡ Minh Quân (~520px) để dùng chung công thức hiển thị ở BossSan.tsx
const LE = 3 // viền trong suốt quanh khung
const BO = [
  { id: 'trang', thuMuc: 'trang-boss', fx: ['btvn', 'fireball', 'desk'] },
  { id: 'cuong', thuMuc: 'cuong-boss', fx: ['btvn', 'fireball', 'chicken'] },
]
// pose dùng làm ảnh TĨNH vuông (đường lùi khi chưa nạp hoạt ảnh + cảnh 3D cũ: sprite vuông)
const TINH = { dung: 'idle', noi: 'talk_1', chieu: 'cast_prepare', trung: 'hit', gian: 'taunt', ha: 'defeat' }
const KB = (n) => Math.round(n / 1024) + 'KB'

function hopAlpha(g, w, h) {
  const d = g.getImageData(0, 0, w, h).data
  let l = w, r = -1, t = h, b = -1
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 8) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y }
  return { l, r: r + 1, t, b: b + 1 }
}
function veLai(im, k) {
  const c = createCanvas(Math.max(1, Math.round(im.width * k)), Math.max(1, Math.round(im.height * k))), g = c.getContext('2d')
  g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, c.width, c.height)
  return c
}
const luu = (c, ten, q = 95) => { const buf = c.toBuffer('image/webp', q); fs.writeFileSync(ten, buf); return buf.length }

const META = {}
let tongAll = 0
for (const b of BO) {
  const src = `${GOC}/${b.thuMuc}`, ra = `${RA}/${b.id}`
  fs.mkdirSync(ra, { recursive: true })
  const D = JSON.parse(fs.readFileSync(`${src}/animation-data.json`, 'utf8'))
  // pose dùng trong clip (bỏ jump — app không có trạng thái "nhảy"; bỏ dialogue_upper — chân dung riêng)
  const dung = new Set(); for (const [k, c] of Object.entries(D.clips)) if (k !== 'jump') for (const [p] of c.seq) dung.add(p)
  const ten = [...dung]
  const anh = {}, box = {}
  for (const p of ten) {
    const im = await loadImage(`${src}/${D.poses[p].file}`); anh[p] = im
    const c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0)
    box[p] = hopAlpha(g, im.width, im.height)
    const m = D.poses[p].bounds
    if (Math.abs(box[p].l - m.left) > 3 || Math.abs(box[p].r - m.right) > 3 || Math.abs(box[p].t - m.top) > 3 || Math.abs(box[p].b - m.bottom) > 3)
      console.warn(`  ! ${b.id}/${p}: hộp alpha đo ${JSON.stringify(box[p])} lệch metadata ${m.left},${m.right},${m.top},${m.bottom}`)
  }
  // hệ toạ độ "người chơi" (như player.js, boss nhìn PHẢI): pivot hiệu dụng sau flipX, sc = scaleHint·Q
  const hd = {}
  for (const p of ten) {
    const P = D.poses[p], f = !!P.flipX, sc = P.scaleHint * Q, W0 = P.frame[0]
    const px = f ? W0 - P.pivot.x : P.pivot.x, py = P.pivot.y
    const bl = f ? W0 - box[p].r : box[p].l, br = f ? W0 - box[p].l : box[p].r
    hd[p] = { f, sc, px, py, bl, br, bt: box[p].t, bb: box[p].b, hx: f ? W0 - P.hand.x : P.hand.x, hy: P.hand.y, sx: f ? W0 - P.book.x : P.book.x, sy: P.book.y }
  }
  let L = 0, R = 0, T = 0, B = 0
  for (const p of ten) { const h = hd[p]; L = Math.max(L, (h.px - h.bl) * h.sc); R = Math.max(R, (h.br - h.px) * h.sc); T = Math.max(T, (h.py - h.bt) * h.sc); B = Math.max(B, (h.bb - h.py) * h.sc) }
  const W = Math.ceil(L + R) + 2 * LE, H = Math.ceil(T + B) + 2 * LE, Ax = L + LE, Ay = T + LE // neo trong hệ "người chơi"
  const px = W - Ax, py = Ay // neo trong khung ĐÃ LẬT NGANG
  let tong = 0
  const diem = {}
  for (const p of ten) {
    const h = hd[p], c = createCanvas(W, H), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
    g.translate(W, 0); g.scale(-1, 1) // lật cả khung: từ đây vẽ theo hệ người chơi
    const x = Ax - h.px * h.sc, y = Ay - h.py * h.sc, S = anh[p].width * h.sc
    if (h.f) { g.save(); g.translate(x + S, y); g.scale(-1, 1); g.drawImage(anh[p], 0, 0, S, S); g.restore() } else g.drawImage(anh[p], x, y, S, S)
    tong += luu(c, `${ra}/${p}.webp`)
    // tay + sách: so với neo, trong khung ĐÃ LẬT (x đổi dấu)
    diem[p] = { tay: [Math.round(-(h.hx - h.px) * h.sc), Math.round((h.hy - h.py) * h.sc)], sach: [Math.round(-(h.sx - h.px) * h.sc), Math.round((h.sy - h.py) * h.sc)] }
  }
  // chân dung hội thoại (cạnh 512)
  const cd = await loadImage(`${src}/${D.poses.dialogue_upper.file}`)
  tong += luu(veLai(cd, 512 / Math.max(cd.width, cd.height)), `${ra}/dialogue_upper.webp`)
  // ảnh tĩnh vuông (cạnh 640, q88)
  for (const [k, p] of Object.entries(TINH)) {
    const im = anh[p] ?? (await loadImage(`${src}/${D.poses[p].file}`))
    tong += luu(veLai(im, 640 / im.width), `${ra}/tinh_${k}.webp`, 88)
  }
  // FX: cắt sát nội dung (BTVN/bàn/gà), cầu lửa thu nhỏ
  const meta = { W, H, px: Math.round(px * 10) / 10, py: Math.round(py * 10) / 10, diem, fx: {} }
  for (const f of b.fx) {
    const im = await loadImage(`${src}/${D.fx[f === 'btvn' ? 'homework' : f]}`)
    let c, g
    if (f === 'fireball') { c = veLai(im, 0.5); meta.fx[f] = { w: c.width, h: c.height } } // mũi (cầu sáng) ở bên PHẢI ảnh
    else {
      const c0 = createCanvas(im.width, im.height); c0.getContext('2d').drawImage(im, 0, 0)
      const bx = hopAlpha(c0.getContext('2d'), im.width, im.height), k = f === 'chicken' ? 0.5 : f === 'desk' ? Q * 0.9 : 0.6
      c = createCanvas(Math.round((bx.r - bx.l) * k), Math.round((bx.b - bx.t) * k)); g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
      g.drawImage(im, bx.l, bx.t, bx.r - bx.l, bx.b - bx.t, 0, 0, c.width, c.height)
      meta.fx[f] = { w: c.width, h: c.height }
    }
    tong += luu(c, `${ra}/fx_${f}.webp`, 92)
  }
  META[b.id] = meta
  tongAll += tong
  console.log(`${b.id}: khung ${W}×${H} neo (${meta.px},${meta.py}) · ${ten.length} pose · ${KB(tong)}`)
}
const ts = `// SINH TỰ ĐỘNG bởi scripts/anime-boss-trang-cuong.mjs (đừng sửa tay) — số đo khung đã chuẩn hoá của boss Trang + Cường.
// W×H = cỡ mọi khung của boss · (px,py) = neo chân trong khung (đã lật ngang: boss đứng phải nhìn trái) · diem[pose].tay/sach = điểm nòng/sách so với neo (px, ĐÃ lật) · fx[…] = cỡ ảnh FX.
export type DiemPose = { tay: [number, number]; sach: [number, number] }
export type MetaBossTC = { W: number; H: number; px: number; py: number; diem: Record<string, DiemPose>; fx: Record<string, { w: number; h: number }> }
export const META_BOSS_TC: Record<'trang' | 'cuong', MetaBossTC> = ${JSON.stringify(META, null, 2)}
`
fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgBossMeta.ts', ts)
console.log('xong', KB(tongAll))
