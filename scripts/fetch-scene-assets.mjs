// Tải + chuẩn hoá asset cho tranh 2 game "Tìm" (Thùy 25/09 đồng ý tải):
//  · Đồ vật: Microsoft Fluent Emoji 3D (MIT) — chỉ các tên trong scripts/scene-items.mjs → 160px WebP
//  · Nền: Kenney Background Elements Redux (CC0) — giải nén sẵn ở thư mục truyền vào → WebP
// Ra: games-site/assets/scene/{obj,bg}/*.webp + games-site/lib/bk-scenes-data.js (danh mục cho game đọc).
// Chạy: node scripts/fetch-scene-assets.mjs <thư_mục_kenney_đã_giải_nén>
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { WORLDS } from './scene-items.mjs'

const ROOT = process.cwd(), OUT = join(ROOT, 'games-site', 'assets', 'scene'), OBJ = join(OUT, 'obj'), BG = join(OUT, 'bg')
mkdirSync(OBJ, { recursive: true }); mkdirSync(BG, { recursive: true })
const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ---------- 1. đồ vật Fluent ----------
const names = [...new Set(Object.values(WORLDS).flatMap(w => w.items.map(i => i[0])))]
const tree = JSON.parse(execSync('gh api repos/microsoft/fluentui-emoji/git/trees/main?recursive=1', { maxBuffer: 1 << 28 }).toString())
if (tree.truncated) console.warn('⚠ cây repo bị cắt — có thể thiếu hình')
const paths = tree.tree.map(t => t.path).filter(p => p.startsWith('assets/') && p.endsWith('.png') && p.includes('/3D/'))
const SIZE = 160
let ok = 0, fail = []
for (const n of names) {
  const f = join(OBJ, slug(n) + '.webp')
  if (existsSync(f)) { ok++; continue }
  const p = paths.find(x => x.startsWith(`assets/${n}/3D/`)) || paths.find(x => x.startsWith(`assets/${n}/Default/3D/`))
  if (!p) { fail.push(n + ' (không có 3D)'); continue }
  try {
    const url = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/' + p.split('/').map(encodeURIComponent).join('/')
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    const img = await loadImage(buf), c = createCanvas(SIZE, SIZE), g = c.getContext('2d')
    g.drawImage(img, 0, 0, SIZE, SIZE)
    writeFileSync(f, await c.encode('webp', 88)); ok++
    if (ok % 25 === 0) console.log('…', ok, '/', names.length)
  } catch (e) { fail.push(n + ' (' + e.message + ')') }
}
console.log(`đồ vật: ${ok}/${names.length} xong`, fail.length ? '· lỗi: ' + fail.join(', ') : '')

// ---------- 2. nền Kenney ----------
const K = process.argv[2]
if (K) {
  const conv = async (src, dst, maxW) => { const img = await loadImage(readFileSync(src)); const k = Math.min(1, maxW / img.width); const c = createCanvas(Math.round(img.width * k), Math.round(img.height * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); writeFileSync(dst, await c.encode('webp', 88)) }
  for (const f of readdirSync(join(K, 'Backgrounds')).filter(f => f.endsWith('.png'))) await conv(join(K, 'Backgrounds', f), join(BG, f.replace('.png', '.webp')), 1024)
  for (const f of readdirSync(join(K, 'Backgrounds', 'Elements')).filter(f => f.endsWith('.png'))) await conv(join(K, 'Backgrounds', 'Elements', f), join(BG, 'el-' + f.replace('.png', '.webp')), 1024)
  for (const f of readdirSync(join(K, 'PNG', 'Retina')).filter(f => f.endsWith('.png'))) await conv(join(K, 'PNG', 'Retina', f), join(BG, 'sp-' + f.replace('.png', '.webp')), 400)
  console.log('nền:', readdirSync(BG).length, 'file')
}

// ---------- 2b. đo từng hình: lật/xoay/đổi màu có NHÌN RA không (cho Tìm Điểm Khác Nhau) ----------
// lật: khác biệt ảnh ↔ ảnh soi gương · xoay: ảnh ↔ ảnh xoay 60° · màu: độ bão hoà trung bình của phần có hình
const FLAG = {}
for (const f of readdirSync(OBJ).filter(f => f.endsWith('.webp'))) {
  const img = await loadImage(readFileSync(join(OBJ, f))), N = 64
  const px = draw => { const c = createCanvas(N, N), g = c.getContext('2d'); draw(g); return g.getImageData(0, 0, N, N).data }
  const A = px(g => g.drawImage(img, 0, 0, N, N))
  const M = px(g => { g.translate(N, 0); g.scale(-1, 1); g.drawImage(img, 0, 0, N, N) })
  const R = px(g => { g.translate(N / 2, N / 2); g.rotate(Math.PI / 3); g.drawImage(img, -N / 2, -N / 2, N, N) })
  const diff = (X, Y) => { let d = 0, n = 0; for (let i = 0; i < X.length; i += 4) { const a = Math.max(X[i + 3], Y[i + 3]); if (a < 40) continue; n++; d += (Math.abs(X[i] - Y[i]) + Math.abs(X[i + 1] - Y[i + 1]) + Math.abs(X[i + 2] - Y[i + 2])) / 3 + Math.abs(X[i + 3] - Y[i + 3]) } return n ? d / n : 0 }
  let sat = 0, n = 0; for (let i = 0; i < A.length; i += 4) { if (A[i + 3] < 128) continue; const mx = Math.max(A[i], A[i + 1], A[i + 2]), mn = Math.min(A[i], A[i + 1], A[i + 2]); sat += mx ? (mx - mn) / mx : 0; n++ }
  FLAG[f.replace('.webp', '')] = (diff(A, M) > 38 ? 'f' : '') + (diff(A, R) > 38 ? 'r' : '') + (n && sat / n > .32 ? 'c' : '')
}

// ---------- 3. danh mục cho game ----------
const data = {}
for (const [k, w] of Object.entries(WORLDS)) data[k] = { vn: w.vn, bg: w.bg, items: w.items.filter(i => existsSync(join(OBJ, slug(i[0]) + '.webp'))).map(([n, vn, z]) => [slug(n), vn, z, FLAG[slug(n)] || '']) }
writeFileSync(join(ROOT, 'games-site', 'lib', 'bk-scenes-data.js'),
  `/* Danh mục tranh cho Tìm Nhân Vật Ẩn + Tìm Điểm Khác Nhau — sinh bởi scripts/fetch-scene-assets.mjs, KHÔNG sửa tay.\n   Hình: Microsoft Fluent Emoji 3D (MIT) · nền: Kenney Background Elements Redux (CC0). */\nwindow.BK_SCENE_DATA=${JSON.stringify(data)};\n`)
console.log('danh mục:', Object.keys(data).length, 'chủ đề')
