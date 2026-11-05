// hh_lop_chep.mjs — CHÉP câu kho luyện Hình–Học (hinh_hoc_cau_hoi) sang KHO TRÊN LỚP (hinh_hoc_cau_lop) của cùng bài, đúng thứ tự truyền vào.
// Dùng khi tài liệu gốc ghi câu là "Bài trên lớp" mà câu đã nằm sẵn ở kho luyện (vd lô Thales 28/10 nhập trước khi có kho trên lớp — mig 202611051603).
//
//   node scripts/anh/hh_lop_chep.mjs <ma_bai> <ma_cau1> [ma_cau2 …] [--vai giang|luyen] [--ghi]
//
// Câu chép là đối tượng MỚI (mã HHL…, nhớ nguồn ở nguon_ma_cau) — câu gốc ở kho luyện giữ nguyên, không xoá.
// Không có --ghi: chạy thử (kiểm câu thuộc đúng bài, còn sống, chưa từng chép sang kho trên lớp). Có --ghi: 1 transaction qua fn_hh_lop_chep_tu_kho.
import pg from 'pg'
import fs from 'node:fs'

const argv = process.argv.slice(2)
const gt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null }
const vai = gt('--vai') ?? 'giang', GHI = argv.includes('--ghi')
const pos = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--vai')
const [maBai, ...maCaus] = pos
if (!/^HH\d{5}$/.test(maBai ?? '') || !maCaus.length || !['giang', 'luyen'].includes(vai)) {
  console.error('Dùng: node scripts/anh/hh_lop_chep.mjs HH00xxx <ma_cau…> [--vai giang|luyen] [--ghi]'); process.exit(2)
}
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const co = (await c.query(`select q.ma_cau, q.dang_chinh, q.xoa_at is null song,
    exists (select 1 from hinh_hoc_cau_lop l where l.nguon_ma_cau = q.ma_cau and l.xoa_at is null) da_chep
  from hinh_hoc_cau_hoi q where q.ma_cau = any($1)`, [maCaus])).rows
let loi = 0
for (const m of maCaus) {
  const r = co.find((x) => x.ma_cau === m)
  const v = !r ? 'KHÔNG CÓ' : r.dang_chinh !== maBai ? `thuộc bài ${r.dang_chinh}` : !r.song ? 'đã vào kho rác' : r.da_chep ? 'đã chép rồi' : null
  if (v) { loi++; console.log(`  ✘ ${m}: ${v}`) }
}
console.log(`${maBai}: ${maCaus.length} câu → kho trên lớp (vai ${vai}). Lỗi: ${loi}. ${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}`)
if (loi || !GHI) { await c.end(); process.exit(loi ? 1 : 0) }
await c.query('begin')
try {
  const r = (await c.query(`select ma_cau, nguon_ma_cau, thu_tu from fn_hh_lop_chep_tu_kho($1, $2, $3)`, [maBai, vai, maCaus])).rows
  await c.query('commit')
  for (const x of r) console.log(`  #${String(x.thu_tu).padStart(2)} ${x.nguon_ma_cau} → ${x.ma_cau}`)
} catch (e) { await c.query('rollback'); throw e } finally { await c.end() }
