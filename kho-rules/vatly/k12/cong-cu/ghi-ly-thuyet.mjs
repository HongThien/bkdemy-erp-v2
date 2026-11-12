// Ghi mô tả nhóm · lý thuyết nhóm · ví dụ dạng (ebook Nắm trọn kiến thức Vật lí 12 Tập 1) vào bản đồ Vật lý khối 12.
// Thùy duyệt 12/11 ("Ghi đi") theo trang de-xuat-ly-thuyet-vi-du-nhiet-khi.html. Nguồn: ../ebook-tap1/gop.json (đã chốt).
//   CHỈ điền ô đang TRỐNG (trim = '') — ô Thùy đã sửa trên màn giữ nguyên.
//   mo_ta nhóm = bản dài nhất (như HTML) · ly_thuyet = các phần ebook nối bằng dòng trống · vi_du = các ##VD nối bằng dòng trống.
// Chạy (từ gốc repo): node kho-rules/vatly/k12/cong-cu/ghi-ly-thuyet.mjs [--ghi]
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const G = JSON.parse(fs.readFileSync(path.join(DIR, '..', 'ebook-tap1', 'gop.json'), 'utf8'))

// kiểm định dạng lại trước khi ghi
const loi = []
const kiemLT = (id, s) => { for (const d of s.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean)) {
  if (!/^##(ĐN|ĐL|TC|CY|PP|NX)/.test(d)) loi.push(`${id}: đoạn thiếu thẻ «${d.slice(0, 50)}»`)
  if (/##VD|Bài giải/.test(d)) loi.push(`${id}: lý thuyết chứa ví dụ`) } }
const kiemVD = (id, s) => { if (!/^##VD/.test(s)) loi.push(`${id}: VD không mở bằng ##VD`)
  if (!/\n\s*\nBài giải:/.test(s)) loi.push(`${id}: VD thiếu Bài giải`)
  if (/\n\s*\n/.test(s.split(/\n\s*\nBài giải:/)[0])) loi.push(`${id}: đề VD có dòng trống`) }

const nhom = Object.entries(G.nhom).map(([id, x]) => {
  const mo = [...x.mo_ta].sort((a, b) => b.v.length - a.v.length)[0]?.v.trim() || ''
  const lt = x.lt.map(l => l.v.trim()).filter(Boolean).join('\n\n')
  kiemLT(id, lt); return { id, mo, lt }
})
const dang = Object.entries(G.dang).filter(([, x]) => x.vd.length).map(([id, x]) => {
  x.vd.forEach(v => kiemVD(id, v.v.trim())); return { id, vd: x.vd.map(v => v.v.trim()).join('\n\n') }
})
if (loi.length) { console.error('✖ lỗi định dạng:\n' + loi.join('\n')); process.exit(1) }
console.log(`nguồn: ${nhom.filter(n => n.mo).length} mô tả · ${nhom.filter(n => n.lt).length} lý thuyết · ${dang.length} dạng có VD (${Object.values(G.dang).reduce((a, x) => a + x.vd.length, 0)} VD)`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const dem = { mo_ta: 0, ly_thuyet: 0, vi_du: 0, bo_qua_da_co: [] }
  for (const n of nhom) {
    const [r] = await q(`select n.mo_ta, n.ly_thuyet from vatly_bdm_nhom n join vatly_bdm_chu_de c on c.id = n.chu_de_id where n.id = $1 and c.khoi = '12'`, [n.id])
    if (!r) throw new Error(`không thấy nhóm ${n.id} ở khối 12`)
    if (n.mo) { if (r.mo_ta.trim()) dem.bo_qua_da_co.push(n.id + '.mo_ta'); else { await q('update vatly_bdm_nhom set mo_ta = $2, updated_at = now() where id = $1', [n.id, n.mo]); dem.mo_ta++ } }
    if (n.lt) { if (r.ly_thuyet.trim()) dem.bo_qua_da_co.push(n.id + '.ly_thuyet'); else { await q('update vatly_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1', [n.id, n.lt]); dem.ly_thuyet++ } }
  }
  for (const d of dang) {
    const [r] = await q(`select d.vi_du from vatly_bdm_dang_bai d join vatly_bdm_nhom n on n.id = d.nhom_id join vatly_bdm_chu_de c on c.id = n.chu_de_id where d.id = $1 and c.khoi = '12'`, [d.id])
    if (!r) throw new Error(`không thấy dạng ${d.id} ở khối 12`)
    if (r.vi_du.trim()) dem.bo_qua_da_co.push(d.id + '.vi_du'); else { await q('update vatly_bdm_dang_bai set vi_du = $2 where id = $1', [d.id, d.vd]); dem.vi_du++ }
  }
  console.log('đã điền:', dem)
  // đối chiếu: nội dung trên DB đúng bằng nguồn
  let lech = 0
  for (const n of nhom) { const [r] = await q('select mo_ta, ly_thuyet from vatly_bdm_nhom where id = $1', [n.id])
    if (n.mo && !dem.bo_qua_da_co.includes(n.id + '.mo_ta') && r.mo_ta !== n.mo) lech++
    if (n.lt && !dem.bo_qua_da_co.includes(n.id + '.ly_thuyet') && r.ly_thuyet !== n.lt) lech++ }
  for (const d of dang) { const [r] = await q('select vi_du from vatly_bdm_dang_bai where id = $1', [d.id])
    if (!dem.bo_qua_da_co.includes(d.id + '.vi_du') && r.vi_du !== d.vd) lech++ }
  if (lech) throw new Error(`lệch ${lech} ô — ROLLBACK`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '(chạy thử — đã ROLLBACK; thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✖', e.message); process.exitCode = 1 }
await c.end()
