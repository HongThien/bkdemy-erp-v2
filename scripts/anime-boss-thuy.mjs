// Nén 3 FORM boss cuối THÙY (design/bk-ui-src/AppHS/Animation/final-boss-form-{1,2,3}, PNG RGBA 1024×1024, Thùy duyệt)
// → public/bk-ui/hs/skin/rpg/boss/{thuy,thuy2,thuy3}/<tên>.webp  +  src/screens/hocsinh/skin/styles/rpgBossThuyMeta.ts (SỐ ĐO sinh tự động — đừng sửa tay).
//
// Cùng khuôn scripts/anime-boss-trang-cuong.mjs: mỗi pose có pivot (điểm chân) + scaleHint riêng ⇒ "chuẩn hoá": đặt pivot vào 1 điểm neo CHUNG, nhân tỉ lệ cho thân cao bằng nhau,
// cắt theo hộp bao chung (khung nhỏ hơn 1024² mà không mất pixel), rồi LẬT NGANG (kit vẽ boss nhìn PHẢI; app để boss đứng bên PHẢI nhìn TRÁI).
// Khác Trang/Cường: kit Thùy không có điểm "sách" (chỉ `hand`), Form 2/3 không có scaleHint (=1) và chỉ có 3–5 pose.
// Chạy: node scripts/anime-boss-thuy.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const GOC = 'design/bk-ui-src/AppHS/Animation'
const RA = 'public/bk-ui/hs/skin/rpg/boss'
const THAN = 528 // chiều cao thân (px khung) ≈ Minh Quân (520) / Trang (528) để dùng chung công thức hiển thị ở BossSan.tsx
const LE = 3 // viền trong suốt quanh khung
const KB = (n) => Math.round(n / 1024) + 'KB'

// pose nào là ảnh TĨNH vuông của từng tư thế (đường lùi khi chưa nạp hoạt ảnh + cảnh 3D cũ dùng sprite vuông)
const BO = [
  {
    id: 'thuy', thuMuc: 'final-boss-form-1', ref: 'idle_1',
    tinh: { dung: 'idle_1', noi: 'talk_1', chieu: 'point_prepare', trung: 'hit_2', gian: 'taunt_1', ha: 'defeat' },
    fx: [['missile', 'missile', 1], ['fire', 'fire', 0.5], ['ice', 'ice', 0.5]], // [tên file, khoá trong D.fx, tỉ lệ thu]; tỉ lệ 1/0.5 = cả khung (không cắt)
    chanDung: 'portrait',
  },
  {
    id: 'thuy2', thuMuc: 'final-boss-form-2', ref: 'idle',
    tinh: { dung: 'idle', noi: 'talk', chieu: 'cast', trung: 'idle', gian: 'talk', ha: 'idle' },
    fx: [], chanDung: 'crop',
  },
  {
    id: 'thuy3', thuMuc: 'final-boss-form-3', ref: 'idle',
    tinh: { dung: 'idle', noi: 'idle', chieu: 'cast', trung: 'rage', gian: 'rage', ha: 'idle' },
    fx: [['btvn', 'btvn', 0.6, 'cat'], ['test', 'test_12_pages', 0.6, 'cat']], chanDung: 'crop',
  },
]
// FX riêng: Form 2 dùng lại ảnh chữ BTVN của Form 3 (Form 2 vẽ chữ bằng canvas, kit không có PNG)
const FX_MUON = { thuy2: [['btvn', `${GOC}/final-boss-form-3/assets/fx/btvn.png`, 0.6]] }

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
async function catNoiDung(im, k) {
  const c0 = createCanvas(im.width, im.height); c0.getContext('2d').drawImage(im, 0, 0)
  const bx = hopAlpha(c0.getContext('2d'), im.width, im.height)
  const c = createCanvas(Math.round((bx.r - bx.l) * k), Math.round((bx.b - bx.t) * k)), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
  g.drawImage(im, bx.l, bx.t, bx.r - bx.l, bx.b - bx.t, 0, 0, c.width, c.height)
  return c
}

const META = {}
let tongAll = 0
for (const b of BO) {
  const src = `${GOC}/${b.thuMuc}`, ra = `${RA}/${b.id}`
  fs.mkdirSync(ra, { recursive: true })
  const D = JSON.parse(fs.readFileSync(`${src}/animation-data.json`, 'utf8'))
  // pose dùng: Form 1 = mọi pose xuất hiện trong clip (bỏ dialogue_upper — chân dung riêng); Form 2/3 = mọi pose trong `poses`
  const ten = b.id === 'thuy' ? [...new Set(Object.values(D.clips).flatMap((c) => c.frames.map((f) => f.pose)))] : Object.keys(D.poses)
  const anh = {}, box = {}
  for (const p of ten) {
    const im = await loadImage(`${src}/${D.poses[p].file}`); anh[p] = im
    const c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0)
    box[p] = hopAlpha(g, im.width, im.height)
    const m = D.poses[p].bounds
    if (Math.abs(box[p].l - m.left) > 3 || Math.abs(box[p].r - m.right) > 3 || Math.abs(box[p].t - m.top) > 3 || Math.abs(box[p].b - m.bottom) > 3)
      console.warn(`  ! ${b.id}/${p}: hộp alpha đo ${JSON.stringify(box[p])} lệch metadata ${m.left},${m.right},${m.top},${m.bottom}`)
  }
  // thân tham chiếu = chiều cao hộp của pose chuẩn (đã nhân scaleHint) ⇒ hệ số Q để thân ≈ THAN px
  const ref = D.poses[b.ref], Q = THAN / ((ref.bounds.height ?? (ref.bounds.bottom - ref.bounds.top)) * (ref.scaleHint ?? 1))
  // hệ toạ độ "người chơi" (như player.js, boss nhìn PHẢI): sc = scaleHint·Q
  const hd = {}
  for (const p of ten) {
    const P = D.poses[p], sc = (P.scaleHint ?? 1) * Q
    hd[p] = { sc, px: P.pivot.x, py: P.pivot.y, bl: box[p].l, br: box[p].r, bt: box[p].t, bb: box[p].b, hx: P.hand.x, hy: P.hand.y }
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
    g.drawImage(anh[p], Ax - h.px * h.sc, Ay - h.py * h.sc, anh[p].width * h.sc, anh[p].height * h.sc)
    tong += luu(c, `${ra}/${p}.webp`)
    // tay: so với neo, trong khung ĐÃ LẬT (x đổi dấu)
    diem[p] = { tay: [Math.round(-(h.hx - h.px) * h.sc), Math.round((h.hy - h.py) * h.sc)] }
  }
  // chân dung hội thoại (cạnh 512): Form 1 có sẵn ảnh nửa người; Form 2/3 cắt phần đầu–ngực từ pose chuẩn
  if (b.chanDung === 'portrait') {
    const cd = await loadImage(`${src}/${D.portrait}`)
    tong += luu(veLai(cd, 512 / Math.max(cd.width, cd.height)), `${ra}/dialogue_upper.webp`)
  } else {
    const im = anh[b.ref], bx = box[b.ref], cao = (bx.b - bx.t) * 0.5, rong = Math.min(cao * 1.1, bx.r - bx.l), cx = (bx.l + bx.r) / 2
    const c = createCanvas(512, 512), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
    const sx = Math.max(0, cx - rong / 2), sy = bx.t
    g.drawImage(im, sx, sy, rong, cao * 1.1, 0, 0, 512, 512)
    tong += luu(c, `${ra}/dialogue_upper.webp`)
  }
  // ảnh tĩnh vuông (cạnh 640, q88)
  for (const [k, p] of Object.entries(b.tinh)) {
    tong += luu(veLai(anh[p], 640 / anh[p].width), `${ra}/tinh_${k}.webp`, 88)
  }
  // FX
  const meta = { W, H, px: Math.round(px * 10) / 10, py: Math.round(py * 10) / 10, diem, fx: {} }
  const dsFx = [...b.fx.map(([f, khoa, k, che]) => [f, `${src}/${D.fx?.[khoa] ?? D.effects?.[khoa] ?? `assets/fx/${khoa}.png`}`, k, che]), ...(FX_MUON[b.id] ?? []).map(([f, p, k]) => [f, p, k, 'cat'])]
  for (const [f, file, k, che] of dsFx) {
    const im = await loadImage(file)
    const c = che === 'cat' ? await catNoiDung(im, k) : veLai(im, k)
    meta.fx[f] = { w: c.width, h: c.height }
    tong += luu(c, `${ra}/fx_${f}.webp`, 92)
  }
  META[b.id] = meta
  tongAll += tong
  console.log(`${b.id}: khung ${W}×${H} neo (${meta.px},${meta.py}) · ${ten.length} pose · ${KB(tong)}`)
}
const ts = `// SINH TỰ ĐỘNG bởi scripts/anime-boss-thuy.mjs (đừng sửa tay) — số đo khung đã chuẩn hoá của 3 form boss cuối Thùy.
// W×H = cỡ mọi khung của form · (px,py) = neo chân trong khung (đã lật ngang: boss đứng phải nhìn trái) · diem[pose].tay = điểm tay/nòng so với neo (px, ĐÃ lật) · fx[…] = cỡ ảnh FX.
export type MetaBossThuy = { W: number; H: number; px: number; py: number; diem: Record<string, { tay: [number, number] }>; fx: Record<string, { w: number; h: number }> }
export const META_BOSS_THUY: Record<'thuy' | 'thuy2' | 'thuy3', MetaBossThuy> = ${JSON.stringify(META, null, 2)}
`
fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgBossThuyMeta.ts', ts)
console.log('xong', KB(tongAll))
