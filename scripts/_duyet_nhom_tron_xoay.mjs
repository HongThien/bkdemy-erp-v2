// Duyệt toàn bộ câu của NHÓM "Thể tích khối tròn xoay" (NNB01227, K12) — Thùy 22/10: "tạm thời duyệt toàn bộ các câu liên quan tới
// nhóm bài thể tích khối tròn xoay". Câu liên quan = đã gán (AI/người) hoặc AI đề xuất vào 1 dạng bài của nhóm.
//   · DẠNG: xác nhận dạng bài đang có (đề xuất / AI gán) ⇒ fn_bdm_khop_quyet 'gan' (nguon 'nguoi'). Câu Đúng/Sai KHÔNG gán dạng
//     (kho Đ/S cấp chủ đề — Thùy 18/10).
//   · NỘI DUNG: da_duyet (như fn_de_thi_duyet: bật kho.duyet_noi_dung để không đòi dạng; Đ/S duyệt cả mệnh đề).
//   · Câu TN / TLN còn TRỐNG đáp án ⇒ bỏ qua cả hai bước, liệt kê (CLAUDE.md §1.5).
//   node scripts/_duyet_nhom_tron_xoay.mjs [--ghi]   (không --ghi = ROLLBACK)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const GHI = process.argv.includes('--ghi')
const NHOM = 'NNB01227'
try {
  await q('begin')
  const [ad] = await q("select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const ds = await q(`with k as (
      select g.ma_cau, g.dang_bai_id, 'gan_' || g.nguon nguon from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = $1
      union all select x.ma_cau, x.dang_bai_id, 'de_xuat' from dai_bdm_de_xuat x join dai_bdm_dang_bai d on d.id = x.dang_bai_id where d.nhom_id = $1)
    select k.*, c.loai_cau, c.da_duyet,
           (c.loai_cau in ('trac_nghiem', 'tra_loi_ngan') and coalesce(btrim(c.dap_an), '') = '') thieu_da
      from k join dai_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null order by k.ma_cau`, [NHOM])
  const bo = ds.filter((x) => x.thieu_da)
  const lam = ds.filter((x) => !x.thieu_da)
  let ganDang = 0, duyetND = 0
  for (const x of lam) {
    if (x.loai_cau !== 'dung_sai' && x.nguon !== 'gan_nguoi') { await q(`select fn_bdm_khop_quyet($1, 'gan', $2)`, [x.ma_cau, x.dang_bai_id]); ganDang++ }
  }
  await q(`select set_config('kho.duyet_noi_dung', 'on', true)`)
  const chua = lam.filter((x) => !x.da_duyet).map((x) => x.ma_cau)
  duyetND = (await q(`update dai_cau_hoi set da_duyet = true, duyet_boi = $2, duyet_at = now() where ma_cau = any($1) and not da_duyet returning ma_cau`, [chua, ad.nhan_su_id])).length
  const md = (await q(`update dai_cau_menh_de set da_duyet = true, duyet_boi = $2, duyet_at = now() where ma_cau_cha = any($1) and xoa_at is null and not da_duyet returning 1`,
    [lam.filter((x) => x.loai_cau === 'dung_sai').map((x) => x.ma_cau), ad.nhan_su_id])).length
  await q(`select set_config('kho.duyet_noi_dung', 'off', true)`)
  console.log(`${ds.length} câu thuộc nhóm · xác nhận dạng ${ganDang} · duyệt nội dung ${duyetND} (+${md} mệnh đề Đ/S) · bỏ qua ${bo.length} câu thiếu đáp án`)
  for (const x of bo) console.log('  ✘ thiếu đáp án:', x.ma_cau, x.loai_cau, x.nguon)
  if (GHI) { await q('commit'); console.log('ĐÃ GHI.') } else { await q('rollback'); console.log('THỬ ⇒ ROLLBACK') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
