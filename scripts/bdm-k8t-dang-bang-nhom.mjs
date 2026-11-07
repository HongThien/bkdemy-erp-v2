// Bản đồ mới KHỐI 8T — TẦNG 4 (dạng bài) GIỐNG TẦNG 3 (nhóm bài) (Thùy 07/11: "cho tầng 4 giống tầng 3 trước đi. Sau đó duyệt kho hiện tại luôn nhé,
// vì đang thiếu tầng dạng bài, nên cho tầng dạng bài giống tầng nhóm bài").
//   mỗi nhóm bài 8T CHƯA có dạng bài ⇒ 1 dạng bài trùng tên (mang theo mô tả + lý thuyết) — MÃ MỚI NDB…
//   đối ứng dạng cũ (T18T…) ⇒ dạng bài mới (dich_dang_bai; dich_nhom = null, như K4)
//   "duyệt kho hiện tại": câu GỐC sống của dạng cũ ⇒ dai_bdm_gan_cau (nguon 'doi_ung') — xác định 1–1 theo bản đồ cũ, không phải máy đoán.
//   KHÔNG xoá gì. Nhóm đã có dạng (AM–GM do Thùy dựng) giữ nguyên. Câu dạng chờ T18T000000 (không có đối ứng) không đụng.
//   1 transaction; lệch số ⇒ ROLLBACK.      node scripts/bdm-k8t-dang-bang-nhom.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const one = async (s, p) => (await q(s, p))[0]
try {
  await c.query('begin')
  const nhom = await q(`select n.* from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where cd.khoi = '8T' and not exists (select 1 from dai_bdm_dang_bai x where x.nhom_id = n.id) order by cd.thu_tu, n.thu_tu`)
  if (!nhom.length) throw new Error('không còn nhóm 8T nào thiếu dạng bài — dừng')
  const moi = {}
  for (const n of nhom) {
    moi[n.id] = (await one(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
      values ($1, $2, coalesce($3, ''), coalesce($4, ''), $5, $6, 1) returning id`, [n.id, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file])).id
  }
  let du = 0
  for (const [nh, db] of Object.entries(moi)) du += (await c.query(`update dai_bdm_doi_ung set dich_dang_bai = $2, dich_nhom = null where dich_nhom = $1`, [nh, db])).rowCount
  const gan = await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
    select q.ma_cau, d.dich_dang_bai, 'doi_ung' from dai_bdm_doi_ung d join dai_cau_hoi q on q.dang_chinh = d.ma_dang_cu
     where d.dich_dang_bai = any($1) and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau <> 'dung_sai'
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = q.ma_cau)
    on conflict (ma_cau) do nothing`, [Object.values(moi)])
  const cauDoiUng = +(await one(`select count(*) n from dai_cau_hoi q join dai_bdm_doi_ung d on d.ma_dang_cu = q.dang_chinh
     where d.dich_dang_bai = any($1) and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau <> 'dung_sai'`, [Object.values(moi)])).n
  const sau = await one(`select
     (select count(*) from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '8T') nhom,
     (select count(*) from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '8T' and not exists (select 1 from dai_bdm_dang_bai x where x.nhom_id = n.id)) nhom_thieu_dang,
     (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '8T') dang_bai,
     (select count(*) from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau = g.ma_cau where left(q.dang_chinh, 4) = 'T18T') cau_da_gan,
     (select count(*) from dai_cau_hoi q where q.xoa_at is null and left(q.dang_chinh, 4) = 'T18T' and q.dang_chinh <> 'T18T000000') cau_co_dang_cu,
     (select count(*) from dai_cau_hoi q where q.xoa_at is null and left(q.dang_chinh, 4) = 'T18T' and q.dang_chinh <> 'T18T000000' and not q.da_duyet) chua_duyet_co_dang`)
  console.log(`dạng bài tạo mới ${Object.keys(moi).length} (cho ${nhom.length} nhóm) · đối ứng nối lại ${du} · gán câu mới ${gan.rowCount} (kỳ vọng ${cauDoiUng})`)
  console.log('sau:', sau)
  const ok = Object.keys(moi).length === nhom.length && gan.rowCount === cauDoiUng && +sau.nhom_thieu_dang === 0
  if (!ok) throw new Error('lệch số — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
