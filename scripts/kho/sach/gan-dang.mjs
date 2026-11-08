// ============================================================================
// gan-dang.mjs — LƯỢT GÁN DẠNG (README §0 bước 3): chuyển câu đang ở DẠNG CHỜ của khối sang dạng thật trong bản đồ (`dai_ban_do`).
//
//   node scripts/kho/sach/gan-dang.mjs <gan.json> [--ghi]
//
// gan.json = { khoi, lan_chay, model, kiem: { model, lan_chay },
//              cau: [ { ma_cau, ma_nguon, dang, ly_do, dang_mu, ly_do_mu } ] }
//   dang     = dạng trạm LÀM chọn (đọc đề + lời giải + bản đồ)
//   dang_mu  = dạng trạm KIỂM gán MÙ (model khác, không thấy `dang`) — biên bản `kiem-dang`
// Luật (README §3 "GIẢI và GÁN DẠNG là 2 việc độc lập", k4T.md §5):
//   · hai trạm ra CÙNG dạng ⇒ gán; LỆCH ⇒ KHÔNG gán, câu ở lại dạng chờ, in ra cho người chốt ("không khớp ⇒ dạng chờ, không ép")
//   · chỉ đụng câu ĐANG ở dạng chờ của đúng khối, chưa duyệt, chưa xoá; dạng đích phải có trong bản đồ khối đó và chưa bị xoá
//   · chỉ đổi `dang_chinh` + nối biên bản vào `kiem_may_ghi`; KHÔNG đổi mã câu, đề, lời giải, đáp án, `da_duyet`
// Trigger DB tự ghi vết đổi dạng (`kho_doi_dang_log`). Không --ghi: chạy thử trong transaction rồi ROLLBACK.
// ⭐ 26/10 BẢN ĐỒ MỚI (khối chạy bản đồ mới — DB quyết, hiện K6–12): `dang` / `dang_mu` là DẠNG BÀI (NDB…) của khối; hai trạm khớp ⇒
//   ghi ĐỀ XUẤT `dai_bdm_de_xuat` (nguon 'ai', chac 'cao', lý do = biên bản) chờ người duyệt — luật "đề xuất trước, ghi sau";
//   KHÔNG đổi dang_chinh (câu ở nguyên dạng chờ), không đè gán / đề xuất đã có. Cấp 1 giữ y cũ (đổi dang_chinh).
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { maDangCho } from '../../_kho_insert.mjs'

const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const a = process.argv.slice(2), GHI = a.includes('--ghi'), tep = a.find((x) => !x.startsWith('--'))
if (!tep) { console.error('Dùng: node scripts/kho/sach/gan-dang.mjs <gan.json> [--ghi]'); process.exit(2) }
const docEnv = (f) => existsSync(f) ? Object.fromEntries(readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])) : {}
const env = docEnv(join(GOC_REPO, '.env'))
const g = JSON.parse(readFileSync(tep, 'utf8'))
const loi = []
if (!g.khoi || !g.lan_chay || !g.model || !g.kiem?.model || !g.kiem?.lan_chay) loi.push('thiếu khoi / lan_chay / model / kiem.model / kiem.lan_chay')
if (g.kiem?.model && g.kiem.model === g.model) loi.push('trạm kiểm cùng model với trạm làm — không phải "model khác"')
if (g.kiem?.lan_chay && g.kiem.lan_chay === g.lan_chay) loi.push('trạm kiểm cùng lượt chạy với trạm làm')
const maTrung = g.cau.map((c) => c.ma_cau).filter((m, i, x) => x.indexOf(m) !== i)
if (maTrung.length) loi.push(`ma_cau lặp: ${maTrung.join(', ')}`)
if (loi.length) { console.error('❌ ' + loi.join('\n❌ ')); process.exit(2) }

const CHO = maDangCho('dai', g.khoi)
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const MOI = (await db.query('select $1 = any(public._bdm_ds_khoi_chay()) m', [String(g.khoi)])).rows[0].m
  const { rows: bd } = MOI
    ? await db.query(`select ma_dang, ten_dang, ten_chuyen_de from bdm_ban_do where khoi = $1 and nhanh_bdm = 'toan'`, [g.khoi])
    : await db.query(`select ma_dang, ten_dang, ten_chuyen_de from dai_ban_do where khoi = $1 and xoa_at is null`, [g.khoi])
  const banDo = new Map(bd.map((r) => [r.ma_dang, r]))
  const { rows: cau } = await db.query(`select ma_cau, dang_chinh, da_duyet, xoa_at, ten_de_goc, kiem_may, kiem_may_ghi, loai_cau,
       exists (select 1 from dai_bdm_gan_cau x where x.ma_cau in (c.ma_cau, c.parent_ma_cau)) co_gan,
       exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = c.ma_cau) co_dx
     from dai_cau_hoi c where ma_cau = any($1::text[])`, [g.cau.map((c) => c.ma_cau)])
  const theoMa = new Map(cau.map((r) => [r.ma_cau, r]))
  const gan = [], lech = [], tuChoi = []
  for (const c of g.cau) {
    const r = theoMa.get(c.ma_cau), nhan = `${c.ma_cau} (${c.ma_nguon ?? '?'})`
    if (!r) { tuChoi.push(`${nhan}: không có trong kho`); continue }
    if (r.xoa_at) { tuChoi.push(`${nhan}: câu đã xoá`); continue }
    if (c.ma_nguon && r.ten_de_goc && !r.ten_de_goc.endsWith(`· ${c.ma_nguon}`)) { tuChoi.push(`${nhan}: ma_nguon lệch với ten_de_goc «${r.ten_de_goc}» — danh tính không khớp`); continue }
    if (r.dang_chinh !== CHO) { tuChoi.push(`${nhan}: không còn ở dạng chờ (đang ${r.dang_chinh})`); continue }
    if (r.da_duyet && !MOI) { tuChoi.push(`${nhan}: đã duyệt`); continue }   // bản đồ mới: duyệt nội dung trước, phân dạng bài sau — được
    if (MOI && r.loai_cau === 'dung_sai') { tuChoi.push(`${nhan}: câu Đúng/Sai không gán dạng bài (kho Đ/S của chủ đề)`); continue }
    if (MOI && (r.co_gan || r.co_dx)) { tuChoi.push(`${nhan}: đã có ${r.co_gan ? 'gán' : 'đề xuất'} dạng bài — không đè`); continue }
    if (!banDo.has(c.dang) || c.dang === CHO) { tuChoi.push(`${nhan}: dạng đích ${c.dang} không có trong bản đồ khối ${g.khoi}`); continue }
    if (!c.dang_mu) { tuChoi.push(`${nhan}: thiếu biên bản gán mù (dang_mu)`); continue }
    if (c.dang_mu !== c.dang) { lech.push({ c, r }); continue }
    gan.push({ c, r })
  }
  for (const { c, r } of gan) {
    const bb = `kiem-dang=dat/model_khac (${g.kiem.model} gán mù ra cùng dạng ${c.dang}; lượt ${g.kiem.lan_chay}; làm: ${g.model}, lượt ${g.lan_chay})`
    if (MOI) {
      await db.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'cao', $3, 'ai') on conflict (ma_cau) do nothing`,
        [c.ma_cau, c.dang, [c.ly_do, bb].filter(Boolean).join(' · ').slice(0, 1500)])
      continue
    }
    await db.query(`update dai_cau_hoi set dang_chinh = $2, kiem_may_ghi = $3 where ma_cau = $1 and dang_chinh = $4 and xoa_at is null`,
      [c.ma_cau, c.dang, [r.kiem_may_ghi, bb].filter(Boolean).join(' · '), CHO])
  }
  const { rows: sau } = MOI
    ? await db.query(`select x.dang_bai_id dang_chinh, b.ten_dang, count(*) n from dai_bdm_de_xuat x join bdm_ban_do b on b.ma_dang = x.dang_bai_id
         where x.ma_cau = any($1::text[]) group by 1, 2 order by 1`, [g.cau.map((c) => c.ma_cau)])
    : await db.query(`select c.dang_chinh, b.ten_dang, count(*) n from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
     where c.ma_cau = any($1::text[]) group by 1, 2 order by 1`, [g.cau.map((c) => c.ma_cau)])
  const { rows: [log] } = await db.query(`select count(*) n from kho_doi_dang_log where ma_cau = any($1::text[]) and dang_cu = $2 and doi_at > now() - interval '5 minutes'`, [gan.map((x) => x.c.ma_cau), CHO])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', MOI ? '· BẢN ĐỒ MỚI: "gán" = ĐỀ XUẤT dạng bài chờ duyệt' : '', `· khối ${g.khoi} · ${g.cau.length} câu · gán ${gan.length} · lệch hai trạm (ở lại dạng chờ) ${lech.length} · từ chối ${tuChoi.length} · vết đổi dạng DB ghi ${log.n}`)
  for (const s of sau) console.log(`   ${s.dang_chinh}  ${String(s.n).padStart(3)} câu  ${s.ten_dang}`)
  if (lech.length) { console.log('  LỆCH — chờ người chốt:'); for (const { c } of lech) console.log(`    ${c.ma_cau} (${c.ma_nguon}): làm ${c.dang} — ${c.ly_do} · mù ${c.dang_mu} — ${c.ly_do_mu ?? ''}`.slice(0, 330)) }
  if (tuChoi.length) { console.log('  TỪ CHỐI:'); for (const t of tuChoi) console.log('    ' + t) }
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  ma = 1
  await db.query('rollback').catch(() => {})
  console.error('LỖI — đã rollback:', e.message)
} finally { await db.end() }
process.exit(ma)
