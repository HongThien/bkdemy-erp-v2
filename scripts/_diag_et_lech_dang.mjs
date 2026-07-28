// Quét TOÀN BỘ buổi có ET: so CHUỖI DẠNG của đề (tai_lieu_cau→dang_chinh) vs của lưới chấm
// (gami_session_problems.ma_dang theo problem_no). Lệch = điểm đang gắn SAI dạng → mastery sai.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

// dang_chinh của câu nằm ở bảng kho theo môn → lấy qua ma_cau. Dùng chính ma_dang đã seed để so
// thì vòng quanh; nên lấy dạng thật của câu từ bảng kho câu hỏi của môn.
const { rows: docs } = await c.query(`
  select tl.id doc_id, tl.mon, l.ten_lop, tl.ngay::text ngay, b.id buoi_id,
         tl.created_at, tl.updated_at
  from tai_lieu tl
  join lop l on l.id = tl.lop_id
  join buoi_hoc b on b.lop_id = tl.lop_id and b.ngay = tl.ngay and b.loai='thuong' and b.trang_thai <> 'huy'
  where tl.loai='et' and tl.lop_id is not null and tl.ngay is not null
  order by tl.ngay desc`)

const TBL = { 'Toán': ['dai_cau_hoi', 'hinh_bai'], 'KHTN': ['khtn_cau_hoi'] }
async function dangCuaCau(mon, maCaus) {
  if (!maCaus.length) return {}
  const out = {}
  for (const t of (TBL[mon] ?? [])) {
    try {
      const { rows } = await c.query(`select ma_cau, dang_chinh from ${t} where ma_cau = any($1)`, [maCaus])
      rows.forEach(r => { out[r.ma_cau] = r.dang_chinh })
    } catch { /* bảng không có cột → bỏ qua */ }
  }
  return out
}

let nLech = 0, nCheck = 0
for (const d of docs) {
  const { rows: caus } = await c.query(
    `select tc.ma_cau, tc.thu_tu from tai_lieu_cau tc join tai_lieu_phan tp on tp.id=tc.phan_id
     where tp.tai_lieu_id=$1 order by tp.thu_tu, tc.thu_tu`, [d.doc_id])
  const { rows: probs } = await c.query(
    `select p.problem_no, p.ma_dang, (select count(*) from gami_grades g where g.problem_id=p.id) n
     from gami_session_problems p where p.buoi_hoc_id=$1 and p.phase='et' order by p.problem_no`, [d.buoi_id])
  if (!probs.length || !caus.length) continue
  nCheck++
  const map = await dangCuaCau(d.mon, caus.map(x => x.ma_cau))
  const dangDe = caus.map(x => map[x.ma_cau] ?? '?')
  const dangLuoi = probs.map(p => p.ma_dang ?? '?')
  if (dangDe.some(x => x === '?')) continue // không tra được dạng → bỏ, tránh báo động giả
  const same = dangDe.length === dangLuoi.length && dangDe.every((x, i) => x === dangLuoi[i])
  if (!same) {
    nLech++
    const daCham = probs.reduce((s, p) => s + Number(p.n), 0)
    console.log(`LỆCH · ${d.ten_lop} ${d.ngay} · đã chấm ${daCham} ô · sửa đề: ${d.updated_at > d.created_at ? d.updated_at.toISOString().slice(0,16) : 'không'}`)
    console.log(`   đề  (${dangDe.length}): ${dangDe.join(' ')}`)
    console.log(`   lưới(${dangLuoi.length}): ${dangLuoi.join(' ')}   [chấm/câu: ${probs.map(p=>p.n).join(',')}]`)
  }
}
console.log(`\nĐã đối chiếu ${nCheck} buổi (tra được dạng) · LỆCH DẠNG: ${nLech}`)
await c.end()
