// Kiểm app HS có theo STYLE không (design/STYLE-HS.md) — Thùy 29/09: "sau này có thêm tính năng mới cũng phải tự cập nhật
// UI theo style này". Chạy: npm run check:style-hs  ·  ghi mốc mới sau khi SỬA BỚT màu gõ tay: npm run check:style-hs -- --ghi-moc
// 3 phép kiểm (exit 1 nếu có RỚT):
//  ① MÀU GÕ TAY theo kiểu RATCHET (chỉ được giảm): mỗi file src/screens/hocsinh/**/*.tsx đếm mã hex, bg-white/text-white,
//     token cũ ph-*/bg-ios, font-hand/font-bubble, THEME theo giới tính. Số > mốc trong check-style-hs.moc.json ⇒ RỚT
//     (màn/tính năng mới phải dùng skin/KhungHS: MAU/THE/HEAD/ManHS…). File mới chưa có mốc ⇒ mốc = 0.
//     Màu CÓ NGHĨA còn lại (huy chương, bậc Rank, ô vòng quay, nền trắng sau ảnh đề) nằm sẵn trong mốc.
//  ② ICON Ô: mọi id ô trong KHU / KHU_CAP2 / 'hoc_tu_dau' (HocSinhApp.tsx) phải có trong `anhO` của MỌI style (skin/styles/*.ts).
//  ③ FILE HÌNH: mọi đường dẫn `${A}/…` trong style phải có file thật ở public/.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const GOC = 'src/screens/hocsinh'
const MOC = 'scripts/check-style-hs.moc.json'
// Không quét: bản thân style/khung (nơi ĐỊNH NGHĨA màu) · HomeHS.tsx = Home v4 cũ, chỉ còn cho HS không xác định được khối.
const BO_QUA = [/\/skin\//, /\/HomeHS\.tsx$/]
const MAU_CUNG = [
  [/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])/g, 'mã hex'],
  [/\bbg-white\b|\btext-white\b/g, 'bg/text-white'],
  [/\b(?:bg|text|border|ring|from|to)-(?:ph-[a-z0-9-]+|ios|brand)\b/g, 'token cũ ph-*/ios/brand'],
  [/\bfont-hand\b|\bfont-bubble\b/g, 'font Home v4'],
  [/THEME\[gioiTinh/g, 'THEME theo giới tính'],
]

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })
const rel = (p) => relative('.', p).replace(/\\/g, '/')
const ghiMoc = process.argv.includes('--ghi-moc')
const rot = [], chuY = []

// ① màu gõ tay
const files = walk(GOC).filter((p) => p.endsWith('.tsx')).map(rel).filter((p) => !BO_QUA.some((r) => r.test(p)))
const dem = {}
for (const f of files) {
  const s = readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n') // bỏ dòng chú thích
  dem[f] = MAU_CUNG.reduce((n, [re]) => n + (s.match(re) ?? []).length, 0)
}
const moc = existsSync(MOC) ? JSON.parse(readFileSync(MOC, 'utf8')) : {}
for (const f of files) {
  const m = moc[f] ?? 0
  if (dem[f] > m) rot.push(`${f}: ${dem[f]} màu gõ tay > mốc ${m} — dùng MAU/THE/HEAD/ManHS… của skin/KhungHS (design/STYLE-HS.md)`)
  else if (dem[f] < m) chuY.push(`${f}: còn ${dem[f]} < mốc ${m} — tốt, chạy --ghi-moc để siết mốc`)
  const src = readFileSync(f, 'utf8')
  if (/return\s*\(?\s*</.test(src) && !/from '\.{1,2}\/(?:\.\.\/)?(?:hocsinh\/)?skin\/KhungHS'|from '\.\/skin\/KhungHS'/.test(src) && dem[f] > 0)
    chuY.push(`${f}: có vẽ giao diện mà không dùng skin/KhungHS`)
}

// ② icon ô  ③ file hình
const app = readFileSync(`${GOC}/HocSinhApp.tsx`, 'utf8')
const khoiDs = (ten) => { const i = app.indexOf(`const ${ten}`); if (i < 0) return []; const j = app.indexOf(']\n', i); return [...app.slice(i, j).matchAll(/\{\s*id:\s*'([a-z_0-9]+)'/g)].map((m) => m[1]) }
const oCan = [...new Set([...khoiDs('KHU:'), ...khoiDs('KHU_CAP2'), 'hoc_tu_dau'])]
const DIR_STYLE = `${GOC}/skin/styles`
for (const f of readdirSync(DIR_STYLE).filter((x) => x.endsWith('.ts'))) {
  const s = readFileSync(join(DIR_STYLE, f), 'utf8')
  const A = (s.match(/const A = '([^']+)'/) ?? [])[1]
  const khoiAnh = s.slice(s.indexOf('anhO:'), s.indexOf('},', s.indexOf('anhO:')))
  const coO = new Set([...khoiAnh.matchAll(/\b([a-z_0-9]+):\s*`/g)].map((m) => m[1]))
  const thieu = oCan.filter((o) => !coO.has(o))
  if (s.includes('anhO:') && thieu.length) rot.push(`style ${f}: thiếu icon cho ô ${thieu.join(', ')} — đặt hình (design/STYLE-HS.md §Thêm tính năng) rồi khai vào anhO`)
  if (A) for (const m of s.matchAll(/\$\{A\}\/([A-Za-z0-9_.\-]+)/g)) {
    const ten = m[1].includes('.') ? [m[1]] : [`${m[1]}.jpg`, `${m[1]}.png`] // nen('bg_x') không kèm đuôi
    if (!ten.some((t) => existsSync(join('public', A, t)))) rot.push(`style ${f}: không có file public${A}/${m[1]}`)
  }
  for (const m of s.matchAll(/nen\('([a-z_0-9]+)'\)/g)) if (A && !existsSync(join('public', A, `${m[1]}.jpg`))) rot.push(`style ${f}: không có file public${A}/${m[1]}.jpg`)
}

if (ghiMoc) {
  writeFileSync(MOC, JSON.stringify(Object.fromEntries(files.filter((f) => dem[f] > 0).sort().map((f) => [f, dem[f]])), null, 2) + '\n')
  console.log(`Đã ghi mốc ${MOC} (${files.filter((f) => dem[f] > 0).length} file còn màu gõ tay).`)
}
for (const c of chuY) console.log(`CHÚ Ý ${c}`)
for (const r of rot) console.log(`RỚT  ${r}`)
console.log(rot.length ? `\n✖ ${rot.length} chỗ RỚT — sửa theo design/STYLE-HS.md trước khi commit.` : `\n✔ App HS theo đúng style (${files.length} file, ${oCan.length} ô).`)
process.exit(rot.length && !ghiMoc ? 1 : 0)
