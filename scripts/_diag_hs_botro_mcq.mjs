// Read-only: 1 HS đang bổ trợ yếu — dạng trong case có MCQ chưa, bài đã sinh trong ca là loại câu gì. argv[2] = ma_hs (vd HS0520)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ma = (process.argv[2] ?? 'HS0520').toUpperCase()
const [hs] = await q(`select id, ho_ten, ma_hs, khoi from hoc_sinh where upper(ma_hs) = $1`, [ma])
if (!hs) { console.log('không thấy', ma); process.exit(0) }
console.log('HS:', hs.ho_ten, hs.ma_hs, 'khối', hs.khoi)
const cases = await q(`select id, mon, trang_thai, created_at::date::text ngay from bo_tro_yeu where hoc_sinh_id=$1 order by created_at desc`, [hs.id])
console.log('case:', JSON.stringify(cases))
for (const cs of cases.filter((x) => x.trang_thai === 'dang_xu')) {
  const [{ t }] = await q(`select public._kho_cau_tbl($1) t`, [cs.mon]); const [{ f }] = await q(`select public._kho_form_tn_cua($1) f`, [t])
  const dk = (await q(`select public._kho_dk_mcq_sql($1) s`, [t]))[0].s
  const ds = await q(`select d.ma_dang, d.day_at is not null da_day, d.dong_at is not null da_dong,
      (select count(*)::int from ${t} c where c.dang_chinh=d.ma_dang and c.xoa_at is null and ${dk}) mcq,
      (select count(*)::int from ${t} c where c.dang_chinh=d.ma_dang and c.xoa_at is null and c.kho_chuan and c.loai_cau='tra_loi_ngan') tln
    from bo_tro_yeu_dang d where d.bo_tro_yeu_id=$1`, [cs.id])
  console.log(`\ncase ${cs.mon} (${cs.ngay}) — dạng:`)
  for (const d of ds) {
    const [{ pick }] = await q(`select public._btyeu_chon_cau($1, $2, null, '{}', 3) pick`, [t, d.ma_dang])
    const loai = await q(`select c.ma_cau, c.loai_cau, exists(select 1 from ${f} x where x.ma_cau=c.ma_cau and x.da_duyet and x.xoa_at is null) form from ${t} c where c.ma_cau = any($1)`, [pick])
    console.log(`  ${d.ma_dang} ${d.da_dong ? '(đã đóng)' : d.da_day ? '(đã dạy)' : ''} · MCQ ${d.mcq} câu · TLN ${d.tln} → thử chọn 3: ${loai.map((l) => `${l.ma_cau}[${l.form ? 'MCQ-form' : l.loai_cau}]`).join(' ')}`)
  }
  const buoi = await q(`select b.id, b.ngay::text, b.gio_bat_dau::text gio, b.trang_thai, hh.diem_danh from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id=b.id where hh.bo_tro_yeu_id=$1 order by b.ngay desc limit 5`, [cs.id])
  console.log('  buổi:', JSON.stringify(buoi))
  const bai = await q(`select t.loai, (t.created_at at time zone 'Asia/Ho_Chi_Minh')::text tao, k.loai_cau, (k.form_tn_id is not null) tu_form, count(*)::int n
    from bai_test t join bai_test_cau k on k.bai_test_id=t.id where t.hoc_sinh_id=$1 and t.loai in ('bo_tro','bo_tro_test','retest') group by 1,2,3,4 order by 2 desc limit 12`, [hs.id])
  console.log('  bài đã sinh (mới → cũ):'); for (const b of bai) console.log(`    ${b.tao.slice(0, 16)} ${b.loai.padEnd(11)} ${b.loai_cau}${b.tu_form ? ' (từ form MCQ)' : ''} × ${b.n}`)
}
await c.end()
