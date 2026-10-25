// ============================================================================
// gan-bdm-nhom.mjs — ĐƯA câu (đã giải, đang ở dạng chờ) vào MỘT NHÓM của BẢN ĐỒ MỚI (dai_bdm_*) và TỰ DUYỆT câu gán chắc.
//
//   node scripts/kho/sach/gan-bdm-nhom.mjs <gan.json> [--ghi]
//
// gan.json = { khoi, nhom_id, lan_chay, kiem: { model, lan_chay },
//              cau: [ { ma_cau, ma_nguon, dang_bai_id | null, chac: 'cao' | 'vua' | null, ly_do } ] }
// Theo luồng B3 của spec-ban-do-4-tang.md (cùng ràng buộc với bdm-b3-khop-lai-hang.mjs):
//   cao   ⇒ dai_bdm_gan_cau (nguon 'ai'); rút dòng de_xuat / thieu_dang nguon 'ai' của câu
//   vừa   ⇒ dai_bdm_de_xuat (hàng duyệt, chờ người)
//   trống ⇒ dai_bdm_cau_thieu_dang (chờ người tạo dạng)
//   Không đè quyết định của NGƯỜI (nguon 'nguoi'), không đè câu đã có gan_cau. `dang_chinh` của câu KHÔNG đổi (vẫn dạng chờ — gán nằm ở bảng bdm).
// TỰ DUYỆT (Thùy 25/10: "đưa bài vào kho… tự động duyệt"): câu vừa được gán CAO ⇒ da_duyet = true, duyet_nguon = 'ai' (duyet_boi để trống — không ai bấm),
//   bật cờ phiên kho.duyet_noi_dung như `_duyet_nhom_tron_xoay.mjs` (câu còn ở dạng chờ vẫn duyệt được NỘI DUNG, phân dạng nằm ở bdm). KHÔNG tự duyệt:
//   câu cổng gắn cờ kiem_may = 'nghi' · câu thiếu đáp án / lời giải 2 phần · câu Đúng–Sai (kho Đ/S cấp chủ đề, không gán dạng cả câu — Thùy 18/10) · câu vừa / trống.
// Một transaction. Không --ghi: chạy thử, ROLLBACK.
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const a = process.argv.slice(2), GHI = a.includes('--ghi'), tep = a.find((x) => !x.startsWith('--'))
if (!tep) { console.error('Dùng: node scripts/kho/sach/gan-bdm-nhom.mjs <gan.json> [--ghi]'); process.exit(2) }
const g = JSON.parse(readFileSync(tep, 'utf8'))
if (!g.khoi || !g.nhom_id || !Array.isArray(g.cau)) { console.error('gan.json thiếu khoi / nhom_id / cau'); process.exit(2) }
const trung = g.cau.map((c) => c.ma_cau).filter((m, i, x) => x.indexOf(m) !== i)
if (trung.length) { console.error('❌ ma_cau lặp: ' + trung.join(', ')); process.exit(2) }

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const { rows: dangNhom } = await db.query(`select d.id, d.ten from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.nhom_id = $1 and cd.khoi = $2 order by d.thu_tu`, [g.nhom_id, g.khoi])
  if (!dangNhom.length) throw new Error(`nhóm ${g.nhom_id} không có dạng bài nào thuộc khối ${g.khoi}`)
  const idHopLe = new Set(dangNhom.map((d) => d.id))
  const { rows: cau } = await db.query(`select ma_cau, dang_chinh, da_duyet, kiem_may, loai_cau, dap_an, loi_giai, ten_de_goc, xoa_at,
       exists (select 1 from dai_bdm_gan_cau x where x.ma_cau = c.ma_cau) co_gan,
       (select nguon from dai_bdm_de_xuat x where x.ma_cau = c.ma_cau) dx_nguon,
       (select nguon from dai_bdm_cau_thieu_dang x where x.ma_cau = c.ma_cau) td_nguon
     from dai_cau_hoi c where ma_cau = any($1::text[])`, [g.cau.map((c) => c.ma_cau)])
  const theoMa = new Map(cau.map((r) => [r.ma_cau, r]))
  const tuChoi = [], cao = [], vua = [], trong = []
  for (const c of g.cau) {
    const r = theoMa.get(c.ma_cau), nhan = `${c.ma_cau} (${c.ma_nguon ?? '?'})`
    if (!r || r.xoa_at) { tuChoi.push(`${nhan}: không có / đã xoá`); continue }
    if (!r.dang_chinh.startsWith(`T1${g.khoi}`) && !r.dang_chinh.startsWith(`T${g.khoi}`)) { tuChoi.push(`${nhan}: dạng cũ ${r.dang_chinh} không thuộc khối ${g.khoi}`); continue }
    if (c.ma_nguon && r.ten_de_goc && !r.ten_de_goc.endsWith(`· ${c.ma_nguon}`)) { tuChoi.push(`${nhan}: ma_nguon lệch với ten_de_goc «${r.ten_de_goc}»`); continue }
    if (r.co_gan) { tuChoi.push(`${nhan}: đã có dai_bdm_gan_cau — không đè`); continue }
    if (r.dx_nguon === 'nguoi' || r.td_nguon === 'nguoi') { tuChoi.push(`${nhan}: người đã quyết ở hàng duyệt — không đè`); continue }
    if (r.loai_cau === 'dung_sai') { tuChoi.push(`${nhan}: câu Đúng–Sai không gán dạng cả câu (kho Đ/S cấp chủ đề)`); continue }
    if (c.dang_bai_id && !idHopLe.has(c.dang_bai_id)) { tuChoi.push(`${nhan}: dạng ${c.dang_bai_id} không thuộc nhóm ${g.nhom_id}`); continue }
    if (!c.dang_bai_id) trong.push(c)
    else if (c.chac === 'cao') cao.push(c)
    else vua.push(c)
  }
  const ds = (m) => m.map((x) => x.ma_cau)
  const gn = await db.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) select t.ma, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma, db) on conflict (ma_cau) do nothing returning ma_cau`, [ds(cao), cao.map((x) => x.dang_bai_id)])
  await db.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [gn.rows.map((r) => r.ma_cau)])
  await db.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [gn.rows.map((r) => r.ma_cau)])
  const dx = await db.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) select t.ma, t.db, 'vua', t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[]) t(ma, db, ly)
     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = excluded.chac, ly_do = excluded.ly_do, at = now() where dai_bdm_de_xuat.nguon = 'ai' returning ma_cau`,
    [ds(vua), vua.map((x) => x.dang_bai_id), vua.map((x) => x.ly_do ?? '')])
  await db.query(`delete from dai_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [dx.rows.map((r) => r.ma_cau)])
  const td = await db.query(`insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) select t.ma, coalesce(nullif(btrim(t.ly), ''), 'AI không xếp được'), 'ai' from unnest($1::text[], $2::text[]) t(ma, ly)
     on conflict (ma_cau) do update set ly_do = excluded.ly_do, at = now() where dai_bdm_cau_thieu_dang.nguon = 'ai' returning ma_cau`, [ds(trong), trong.map((x) => x.ly_do ?? '')])
  await db.query(`delete from dai_bdm_de_xuat where ma_cau = any($1) and nguon = 'ai'`, [td.rows.map((r) => r.ma_cau)])

  // tự duyệt câu vừa gán cao
  const daGan = new Set(gn.rows.map((r) => r.ma_cau))
  const duyet = [], khongDuyet = []
  for (const c of cao) {
    if (!daGan.has(c.ma_cau)) continue
    const r = theoMa.get(c.ma_cau), nhan = `${c.ma_cau} (${c.ma_nguon})`
    if (r.da_duyet) continue
    if (r.kiem_may === 'nghi') { khongDuyet.push(`${nhan}: cổng gắn cờ nghi`); continue }
    if (!String(r.dap_an ?? '').trim()) { khongDuyet.push(`${nhan}: thiếu đáp án`); continue }
    if (!/\*\*Phần 2\. Trình bày\*\*/.test(r.loi_giai ?? '')) { khongDuyet.push(`${nhan}: lời giải không đủ 2 phần`); continue }
    duyet.push(c.ma_cau)
  }
  await db.query(`select set_config('kho.duyet_noi_dung', 'on', true)`)
  const dd = await db.query(`update dai_cau_hoi set da_duyet = true, duyet_nguon = 'ai' where ma_cau = any($1) and not da_duyet and xoa_at is null returning ma_cau`, [duyet])
  await db.query(`select set_config('kho.duyet_noi_dung', 'off', true)`)

  const { rows: sau } = await db.query(`select d.ten, g2.ma_cau is not null co, count(*) n, count(*) filter (where h.da_duyet) duyet from dai_bdm_dang_bai d
      left join dai_bdm_gan_cau g2 on g2.dang_bai_id = d.id left join dai_cau_hoi h on h.ma_cau = g2.ma_cau and h.xoa_at is null where d.nhom_id = $1 group by 1, 2 order by 1`, [g.nhom_id])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· nhóm ${g.nhom_id} khối ${g.khoi} · ${g.cau.length} câu · gán chắc +${gn.rowCount} (tự duyệt ${dd.rowCount}) · đề xuất ${dx.rowCount} · thiếu dạng ${td.rowCount} · từ chối ${tuChoi.length}`)
  for (const s of sau) if (s.co) console.log(`   ${String(s.n).padStart(3)} câu (duyệt ${s.duyet})  ${s.ten}`)
  if (khongDuyet.length) { console.log(`  Gán chắc nhưng KHÔNG tự duyệt (${khongDuyet.length}):`); for (const k of khongDuyet) console.log('    ' + k) }
  if (tuChoi.length) { console.log(`  TỪ CHỐI (${tuChoi.length}):`); for (const t of tuChoi) console.log('    ' + t) }
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  ma = 1
  await db.query('rollback').catch(() => {})
  console.error('LỖI — đã rollback:', e.message)
} finally { await db.end() }
process.exit(ma)
