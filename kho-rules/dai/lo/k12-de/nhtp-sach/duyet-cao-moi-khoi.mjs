// duyet-cao-moi-khoi.mjs — DUYỆT (da_duyet=true, duyet_nguon='ai') MỌI câu Đại/HGT đã GÁN mức cao (dai/hgt_bdm_gan_cau nguon 'ai') hoặc vào kho Đ/S chủ đề (nguon 'ai'),
// mọi khối chạy bản đồ mới, MIỄN LÀ có ĐÁP ÁN đầy đủ (TN: A–D · TLN: có đáp số · Đ/S: đủ 4 ý · tự luận: có lời giải) — Thùy 04/11: "duyệt cao thì auto duyệt vào kho luôn".
// + ví dụ trên lớp nguon='sach'. KHÔNG đụng gán nguon cum/doi_ung/nguoi (do người/quy đổi), đề xuất mức vừa, câu thiếu đáp án.
//   node kho-rules/dai/lo/k12-de/nhtp-sach/duyet-cao-moi-khoi.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: GHI ? (process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL) : (process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL) }); await c.connect()
const DU = (a) => `case when ${a}.loai_cau='trac_nghiem' then coalesce(${a}.dap_an,'') ~ '^[A-D]$' when ${a}.loai_cau='tra_loi_ngan' then coalesce(${a}.dap_an,'')<>'' when ${a}.loai_cau='dung_sai' then coalesce((select bool_and(coalesce(m->>'dap_an','') in ('D','S','Đ')) and count(*)=4 from jsonb_array_elements(${a}.menh_de) m), false) else coalesce(${a}.loi_giai,'')<>'' end`
let tong = 0
for (const [kho, cau, gan, ds] of [['dai', 'dai_cau_hoi', 'dai_bdm_gan_cau', 'dai_bdm_kho_ds'], ['hgt', 'hgt_cau_hoi', 'hgt_bdm_gan_cau', 'hgt_bdm_kho_ds']]) {
  const ma = (await c.query(`
    select q.ma_cau from ${cau} q where q.xoa_at is null and q.da_duyet=false and (${DU('q')}) and (
      exists (select 1 from ${gan} g where g.ma_cau=q.ma_cau and g.nguon='ai') or exists (select 1 from ${ds} k where k.ma_cau=q.ma_cau and k.nguon='ai'))`)).rows.map((r) => r.ma_cau)
  console.log(`${kho}: ${ma.length} câu đủ điều kiện duyệt`)
  if (!GHI) { tong += ma.length; continue }
  let n = 0
  for (let i = 0; i < ma.length; i += 500) {
    await c.query('begin')
    try {
      const r = await c.query(`update ${cau} set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau = any($1) and da_duyet=false`, [ma.slice(i, i + 500)])
      await c.query('commit'); n += r.rowCount
    } catch (e) { await c.query('rollback'); console.error(`  lô ${i}: ${e.message.slice(0, 120)}`) }
  }
  console.log(`  ${kho}: đã duyệt ${n}/${ma.length}`); tong += n
}
if (GHI) {
  const l = await c.query(`update dai_cau_lop set da_duyet=true, duyet_at=now() where nguon='sach' and da_duyet=false and xoa_at is null`)
  console.log('ví dụ trên lớp (sách) đã duyệt:', l.rowCount)
}
console.log('TỔNG', tong, GHI ? '✔' : '(chạy thử)')
await c.end()
