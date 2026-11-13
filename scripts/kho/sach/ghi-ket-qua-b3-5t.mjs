// ============================================================================
// ghi-ket-qua-b3-5t.mjs — GHI kết quả B3 (bdm-b3-gop-lo.mjs ⇒ ket_qua.json) của khối 5T vào bản đồ mới.
//
//   node scripts/kho/sach/ghi-ket-qua-b3-5t.mjs <ket_qua.json> [--ghi]
//
// Luật (spec-ban-do-4-tang §13, luật 05/11 "mức cao tự duyệt vào kho"):
//   cao   ⇒ dai_bdm_gan_cau (nguon 'ai') — DB TỰ duyệt qua trigger _bdm_tu_duyet_sau_gan nếu có đáp án đầy đủ
//   vừa   ⇒ dai_bdm_de_xuat (hàng duyệt, chờ người)
//   trống ⇒ dai_bdm_cau_thieu_dang (chờ người tạo dạng)
//   Câu kiem_may = 'nghi' mà máy xếp 'cao' ⇒ HẠ xuống đề xuất (trigger không xét cờ nghi ⇒ không để nó tự duyệt).
//   Không đè gán đã có / quyết định của người (nguon 'nguoi') ; chỉ câu còn sống, khối 5T, KHÔNG Đúng/Sai ; dạng bài phải thuộc khối 5T.
// Một transaction. Không --ghi: chạy thử rồi ROLLBACK.
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const a = process.argv.slice(2), GHI = a.includes('--ghi'), tep = a.find((x) => !x.startsWith('--'))
if (!tep) { console.error('Dùng: node scripts/kho/sach/ghi-ket-qua-b3-5t.mjs <ket_qua.json> [--ghi]'); process.exit(2) }
const kq = JSON.parse(readFileSync(tep, 'utf8'))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const { rows: dg } = await db.query(`select d.id, d.ten from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '5T' and cd.nhanh = 'toan'`)
  const ten = new Map(dg.map((r) => [r.id, r.ten]))
  const { rows: cau } = await db.query(`select c.ma_cau, c.dang_chinh, c.xoa_at, c.loai_cau, c.kiem_may, c.da_duyet, c.dap_an, c.loi_giai,
      exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau) co_gan,
      (select nguon from dai_bdm_de_xuat x where x.ma_cau = c.ma_cau) dx, (select nguon from dai_bdm_cau_thieu_dang t where t.ma_cau = c.ma_cau) td
    from dai_cau_hoi c where c.ma_cau = any($1)`, [kq.map((r) => r.ma_cau)])
  const m = new Map(cau.map((r) => [r.ma_cau, r]))
  const tuChoi = [], cao = [], vua = [], trong = [], ha = []
  for (const r of kq) {
    const c = m.get(r.ma_cau)
    if (!c || c.xoa_at) { tuChoi.push(`${r.ma_cau}: không có / đã xoá`); continue }
    if (!c.dang_chinh.startsWith('T15T')) { tuChoi.push(`${r.ma_cau}: không phải câu 5T (${c.dang_chinh})`); continue }
    if (c.loai_cau === 'dung_sai') { tuChoi.push(`${r.ma_cau}: Đúng/Sai`); continue }
    if (c.co_gan) { tuChoi.push(`${r.ma_cau}: đã có gán — không đè`); continue }
    if (c.dx === 'nguoi' || c.td === 'nguoi') { tuChoi.push(`${r.ma_cau}: người đã quyết ở hàng duyệt — không đè`); continue }
    if (r.dang_bai_id && !ten.has(r.dang_bai_id)) { tuChoi.push(`${r.ma_cau}: dạng ${r.dang_bai_id} không thuộc khối 5T`); continue }
    if (!r.dang_bai_id) trong.push(r)
    else if (r.chac === 'cao' && c.kiem_may !== 'nghi') cao.push(r)
    else { if (r.chac === 'cao') ha.push(r.ma_cau); vua.push(r) }
  }
  const ds = (x) => x.map((r) => r.ma_cau)
  const gn = await db.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) select t.ma, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma, db) on conflict (ma_cau) do nothing returning ma_cau`, [ds(cao), cao.map((r) => r.dang_bai_id)])
  await db.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [gn.rows.map((r) => r.ma_cau)])
  await db.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [gn.rows.map((r) => r.ma_cau)])
  const haSet = new Set(ha)   // máy xếp 'cao' nhưng câu có cờ nghi ⇒ vào đề xuất, GIỮ chac 'cao' để người thấy
  const dx = await db.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) select t.ma, t.db, t.ch, t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[], $4::text[]) t(ma, db, ly, ch)
     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = excluded.chac, ly_do = excluded.ly_do, at = now() where dai_bdm_de_xuat.nguon = 'ai' returning ma_cau`,
    [ds(vua), vua.map((r) => r.dang_bai_id), vua.map((r) => (haSet.has(r.ma_cau) ? '[câu có cờ nghi — không tự duyệt] ' : '') + (r.ly_do ?? '').slice(0, 760)), vua.map((r) => (haSet.has(r.ma_cau) ? 'cao' : 'vua'))])
  await db.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [dx.rows.map((r) => r.ma_cau)])
  const td = await db.query(`insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) select t.ma, coalesce(nullif(btrim(t.ly), ''), 'AI không xếp được'), 'ai' from unnest($1::text[], $2::text[]) t(ma, ly)
     on conflict (ma_cau) do update set ly_do = excluded.ly_do, at = now() where dai_bdm_cau_thieu_dang.nguon = 'ai' returning ma_cau`, [ds(trong), trong.map((r) => (r.ly_do ?? '').slice(0, 800))])
  await db.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [td.rows.map((r) => r.ma_cau)])

  const { rows: sau } = await db.query(`select d.id, d.ten, count(*) n, count(*) filter (where h.da_duyet) duyet from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id = g.dang_bai_id join dai_cau_hoi h on h.ma_cau = g.ma_cau
     where g.ma_cau = any($1) group by 1, 2 order by 1`, [ds(cao)])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· ${kq.length} câu · gán chắc +${gn.rowCount} · đề xuất ${dx.rowCount} (hạ từ cao vì cờ nghi: ${ha.length}) · thiếu dạng ${td.rowCount} · từ chối ${tuChoi.length}`)
  for (const s of sau) console.log(`   ${String(s.n).padStart(3)} (duyệt ${String(s.duyet).padStart(3)})  ${s.id}  ${s.ten}`)
  const tong = sau.reduce((x, s) => x + +s.n, 0), tongDuyet = sau.reduce((x, s) => x + +s.duyet, 0)
  console.log(`   Tổng gán chắc ${tong} · trong đó đã duyệt ${tongDuyet}`)
  if (tuChoi.length) { console.log(`  TỪ CHỐI (${tuChoi.length}):`); for (const t of tuChoi.slice(0, 20)) console.log('    ' + t) }
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
