// tinh-trang.mjs — SỔ QUẢN LÝ BATCH toanmath, SUY TỪ TỆP (không đọc DB, không sửa tay).
//   node kho-rules/dai/lo/toanmath/tinh-trang.mjs            — dựng TINH-TRANG.md + in tóm tắt
//   node kho-rules/dai/lo/toanmath/tinh-trang.mjs B044       — in thêm chi tiết từng đề của batch đó
// Luật (spec-giai-bai.md §C8): chạy lại SAU MỖI việc làm trên batch (chuẩn bị · soạn · soát · ghép khúc · ghi) và commit TINH-TRANG.md cùng việc đó.
// Trạng thái một ĐỀ suy từ tệp:  batch/<B>/<MA>.soan.md · .k<N>.soan.md · .soat.md (dòng KẾT LUẬN) · .soan.goc.md
//   + dấu đã ghi: <LV>/<MA>/da-ghi.txt (máy này) được chép sang batch/<B>/da-ghi.json (theo git ⇒ máy khác cũng thấy; chỉ THÊM, không bớt)
//   + treo có chủ đích: batch/<B>/treo.json { "<MA>": "lý do — chờ ai quyết" } (tệp DUY NHẤT được ghi tay) ⇒ đề hiện 'TREO'.
//   + batch cũ không còn dấu ở máy: bao-cao.json trang_thai='xong' ⇒ mọi đề coi là đã ghi.
import fs from 'node:fs'; import path from 'node:path'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const LVG = `${process.env.BK_LV || 'C:/Users/WBPC/bk-kho-lam-viec'}/de-thi/toanmath`
const CHI = process.argv[2]
const B = JSON.parse(fs.readFileSync(path.join(HERE, 'batch.json'), 'utf8'))
const doc = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null)
const json = (p) => { const s = doc(p); return s ? JSON.parse(s) : null }
const ketLuan = (s) => (s == null ? null : /KẾT LUẬN:\**\s*ĐẠT/.test(s) ? 'dat' : /KẾT LUẬN/.test(s) ? 'khong_dat' : 'do')
const demCau = (s) => (s ? [...s.matchAll(/^### .+? \| kho=\w+ \| loai=\w+/gm)].length : 0)
const demNghi = (s) => (s ? (s.match(/\*\*Chưa chắc:\*\*/g) || []).length : 0)

const NHAN = { chua_cb: 'chưa chuẩn bị', cho_soan: 'chờ soạn', dang_soan: 'đang soạn (khúc)', cho_soat: 'chờ soát', dang_soat: 'đang soát', khong_dat: 'soát CHƯA ĐẠT',
  cho_ghep: 'khúc ĐẠT — chờ ghép', cho_ghi: 'ĐẠT — chờ ghi', da_ghi: 'đã ghi', treo: 'TREO — chờ quyết' }

function deCua(b) {
  const D = path.join(HERE, 'batch', b.ma)
  const ds = json(path.join(D, 'ds-de.json'))
  if (!ds) return null
  const xong = json(path.join(D, 'bao-cao.json'))?.trang_thai === 'xong'
  const soGhi = json(path.join(D, 'da-ghi.json')) || {}, treo = json(path.join(D, 'treo.json')) || {}
  let doi = false
  const tep = fs.readdirSync(D)
  const rows = ds.map((d) => {
    const f = (x) => path.join(D, `${d.ma}.${x}`)
    const dau = doc(path.join(LVG, b.ma, d.ma, 'da-ghi.txt'))?.trim()
    if (dau && soGhi[d.ma] !== dau) { soGhi[d.ma] = dau; doi = true }
    const soan = doc(f('soan.md')), soat = ketLuan(doc(f('soat.md')))
    const khuc = [...new Set(tep.map((t) => t.match(new RegExp(`^${d.ma}\\.k(\\d+)\\.`))?.[1]).filter(Boolean))].sort((a, c) => a - c)
    const kSoan = khuc.filter((k) => fs.existsSync(f(`k${k}.soan.md`))), kDat = khuc.filter((k) => ketLuan(doc(f(`k${k}.soat.md`))) === 'dat')
    const kKhong = khuc.filter((k) => ketLuan(doc(f(`k${k}.soat.md`))) === 'khong_dat')
    let tt
    if (soGhi[d.ma] || xong) tt = 'da_ghi'
    else if (treo[d.ma]) tt = 'treo'
    else if (soan && soat === 'dat') tt = 'cho_ghi'
    else if (soan && soat === 'khong_dat') tt = 'khong_dat'
    else if (soan && soat === 'do') tt = 'dang_soat'
    else if (soan) tt = fs.existsSync(f('kiem.md')) ? 'dang_soat' : 'cho_soat'
    else if (khuc.length) tt = kKhong.length ? 'khong_dat' : kDat.length === khuc.length ? 'cho_ghep' : kSoan.length === khuc.length ? 'cho_soat' : 'dang_soan'
    else tt = 'cho_soan'
    const cau = soan ? demCau(soan) : kSoan.reduce((a, k) => a + demCau(doc(f(`k${k}.soan.md`))), 0)
    const nghi = soan ? demNghi(soan) : kSoan.reduce((a, k) => a + demNghi(doc(f(`k${k}.soan.md`))), 0)
    return { ma: d.ma, don_vi: d.don_vi || d.ten_bai, loai: d.loai, tt, cau, uoc: d.uoc_cau ?? null, nghi, sua: fs.existsSync(f('soan.goc.md')),
      khuc: khuc.length ? `${kDat.length}/${khuc.length} khúc ĐẠT (soạn ${kSoan.length})` : '', ghi: soGhi[d.ma] || (xong ? 'theo bao-cao.json' : ''), ly_do: treo[d.ma] || '' }
  })
  if (doi) fs.writeFileSync(path.join(D, 'da-ghi.json'), JSON.stringify(soGhi, null, 1) + '\n')
  return rows
}

const KHOI = (b) => (b.bai?.[0]?.khoi || b.ten.match(/K\d+/)?.[0] || '?')
const all = B.map((b) => {
  const de = deCua(b)
  const dem = {}; for (const r of de || []) dem[r.tt] = (dem[r.tt] || 0) + 1
  const ghi = dem.da_ghi || 0, tr = dem.treo || 0
  const tt = !de ? 'chưa chuẩn bị' : !de.length ? 'BỎ — trùng kho (bo.md)' : ghi === de.length ? 'XONG'
    : ghi + tr === de.length ? `hết phần làm được · ${tr} đề TREO` : `đang làm ${ghi}/${de.length} đề đã ghi`
  return { b, de, dem, tt, cau: (de || []).reduce((a, r) => a + r.cau, 0), cauGhi: (de || []).filter((r) => r.tt === 'da_ghi').reduce((a, r) => a + r.cau, 0) }
})

const ngay = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ')
let md = `# TÌNH TRẠNG batch toanmath\n\n> Tự sinh bởi \`tinh-trang.mjs\` lúc ${ngay} (giờ VN) — KHÔNG sửa tay. Luật cập nhật: \`spec-giai-bai.md\` §C8.\n> Số câu đếm từ tệp soạn (dòng \`### … | kho= | loai=\`); đề chưa soạn thì chưa có số.\n\n`
// tổng theo chặng × khối
const g = {}
for (const x of all) { const k = `${x.b.giai_doan || '?'} | ${KHOI(x.b)}`; g[k] ??= { batch: 0, xong: 0, dang: 0, chua: 0, de: 0, deGhi: 0, cauGhi: 0, choGhi: 0 }
  const o = g[k]; o.batch++; if (!x.de) o.chua++; else if (x.tt === 'XONG' || x.tt.startsWith('BỎ')) o.xong++; else o.dang++
  o.de += x.de?.length || 0; o.deGhi += x.dem.da_ghi || 0; o.cauGhi += x.cauGhi; o.choGhi += x.dem.cho_ghi || 0 }
md += `## 1. Tổng theo chặng × khối\n\n| Chặng | Khối | Batch | Xong | Đang làm | Chưa chuẩn bị | Đề đã ghi / đã chuẩn bị | Câu đã ghi | Đề ĐẠT chờ ghi |\n|---|---|---|---|---|---|---|---|---|\n`
for (const [k, o] of Object.entries(g)) md += `| ${k} | ${o.batch} | ${o.xong} | ${o.dang} | ${o.chua} | ${o.deGhi} / ${o.de} | ${o.cauGhi} | ${o.choGhi} |\n`
const T = Object.values(g).reduce((a, o) => { for (const k in o) a[k] = (a[k] || 0) + o[k]; return a }, {})
md += `| **Tổng** | | **${T.batch}** | **${T.xong}** | **${T.dang}** | **${T.chua}** | **${T.deGhi} / ${T.de}** | **${T.cauGhi}** | **${T.choGhi}** |\n`

// việc đang dở — phần quan trọng nhất
const dang = all.filter((x) => x.de && x.tt !== 'XONG' && !x.tt.startsWith('BỎ'))
md += `\n## 2. Đang dở — từng đề (việc kế tiếp)\n`
for (const x of dang) {
  md += `\n### ${x.b.ma} — ${x.b.ten} · ${x.tt}\n\n| Đề | Đơn vị | Tình trạng | Câu | Chưa chắc | Soát có sửa | Khúc |\n|---|---|---|---|---|---|---|\n`
  for (const r of x.de.filter((r) => r.tt !== 'da_ghi')) md += `| ${r.ma} | ${r.don_vi} | **${NHAN[r.tt]}** | ${r.cau || (r.uoc ? `~${r.uoc}` : '—')} | ${r.nghi || ''} | ${r.sua ? 'có' : ''} | ${r.khuc}${r.ly_do} |\n`
}
if (!dang.length) md += `\n(không có batch nào đang dở)\n`

md += `\n## 3. Mọi batch\n\n| Batch | Chặng | Nội dung | Bài | Đề | Tình trạng | Chờ soạn | Đang soạn | Chờ soát | Đang soát | Chưa đạt | Chờ ghép | Chờ ghi | Đã ghi | Câu đã ghi |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`
const o = (v) => v || ''
for (const x of all) md += `| ${x.b.ma} | ${(x.b.giai_doan || '?').slice(0, 1)} | ${x.b.ten} | ${x.b.so_bai} | ${x.de?.length ?? '—'} | ${x.tt} | ${o(x.dem.cho_soan)} | ${o(x.dem.dang_soan)} | ${o(x.dem.cho_soat)} | ${o(x.dem.dang_soat)} | ${o(x.dem.khong_dat)} | ${o(x.dem.cho_ghep)} | ${o(x.dem.cho_ghi)} | ${o(x.dem.da_ghi)} | ${o(x.cauGhi)} |\n`
fs.writeFileSync(path.join(HERE, 'TINH-TRANG.md'), md)

console.log(`Batch ${T.batch}: xong ${T.xong} · đang làm ${T.dang} · chưa chuẩn bị ${T.chua} | đề đã ghi ${T.deGhi}/${T.de} đã chuẩn bị · câu đã ghi ${T.cauGhi} · đề ĐẠT chờ ghi ${T.choGhi}`)
for (const x of dang) console.log(' ', x.b.ma, x.tt, '|', Object.entries(x.dem).filter(([k]) => k !== 'da_ghi').map(([k, v]) => `${NHAN[k]} ${v}`).join(' · '))
if (CHI) for (const r of all.find((x) => x.b.ma === CHI)?.de || []) console.log(r.ma, NHAN[r.tt], r.cau, 'câu', r.khuc, r.ghi)
