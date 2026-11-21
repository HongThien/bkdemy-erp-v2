// me4-duyet-mau-va-gan.mjs — Thùy 21/11 "ME4T duyệt luôn": (1) coi lô mẫu "Toán 4 ME · %" là ĐÃ DUYỆT MẪU (kho_lo_mau.duyet_mau_at), rồi
// (2) chuyển ĐỀ XUẤT dạng mức CAO của câu ME4 thành GÁN (dai_bdm_gan_cau nguon 'ai') — đúng đường scripts/bdm-b3-duyet-cao.mjs. Trigger
// `_bdm_tu_duyet_sau_gan` tự duyệt câu có đáp án + không bị máy nghi (kiem_may ≠ 'nghi') + lô không còn chờ duyệt mẫu (§C6).
// Câu mức vừa / mang cờ nghi / dạng chờ KHÔNG đổi — về hàng duyệt trưởng khối. Không --ghi: chạy thử trong transaction rồi ROLLBACK.
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const MAU = 'Toán 4 ME · %'
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const m = await db.query(`update kho_lo_mau set duyet_mau_at = now() where bang_cau = 'dai_cau_hoi' and mau = $1 and duyet_mau_at is null returning id`, [MAU])
  console.log(`lô mẫu "${MAU}": đánh dấu đã duyệt mẫu ${m.rowCount} dòng`)
  const ds = (await db.query(`select x.ma_cau, x.dang_bai_id from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau = x.ma_cau
      where q.ten_de_goc like $1 and q.xoa_at is null and q.dang_chinh = 'T14T000000' and x.chac = 'cao' and x.nguon = 'ai'
        and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = x.ma_cau) order by x.ma_cau`, [MAU])).rows
  const g = await db.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) select t.ma, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma, db)
      on conflict (ma_cau) do nothing returning ma_cau`, [ds.map((r) => r.ma_cau), ds.map((r) => r.dang_bai_id)])
  const r = await db.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai' and chac = 'cao'`, [g.rows.map((x) => x.ma_cau)])
  if (g.rowCount !== ds.length || r.rowCount !== ds.length) throw new Error(`lệch số dòng: mức cao ${ds.length}, gán ${g.rowCount}, rút đề xuất ${r.rowCount}`)
  const { rows: [t] } = await db.query(`select count(*) tong, count(*) filter (where da_duyet) da_duyet, count(*) filter (where da_duyet and kho_chuan) kho_chuan,
       count(*) filter (where not da_duyet and exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = q.ma_cau)) gan_chua_duyet,
       count(*) filter (where not da_duyet and kiem_may = 'nghi') nghi, count(*) filter (where exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = q.ma_cau)) con_de_xuat
     from dai_cau_hoi q where ten_de_goc like $1 and xoa_at is null`, [MAU])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· mức cao chuyển gán ${g.rowCount}`, JSON.stringify(t))
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
