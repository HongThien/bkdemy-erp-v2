// Đưa 2 dạng cũ K4 còn sót vào bản đồ mới + mang câu gốc theo (Thùy 03/11 "Chuyển 2 dạng K4").
//   T104020207 «Tính chất phân phối…» -> nhóm NNB01782 «Phép nhân chia số tự nhiên» (cùng chuyên đề cũ «Phép nhân và phép chia»)
//   T104010501 «Ôn tập các số đến lớp triệu» -> nhóm NNB01779 «Số có nhiều chữ số» (chuyên đề cũ «Ôn tập học kỳ I» không có nhóm tương ứng; chọn theo nội dung câu — chuyển lại được)
//   node scripts/chuyen-2-dang-k4-bdm.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const DANG = [
  { cu: 'T104020207', nhom: 'NNB01782', mo_ta: 'Đề cho hai biểu thức dạng a × (b + c) và a × b + a × c (hoặc với phép trừ), yêu cầu tính rồi so sánh giá trị, hoặc điền số theo tính chất phân phối của phép nhân đối với phép cộng, trừ. Khác dạng «Tính thuận tiện áp dụng tính chất phân phối» ở chỗ chỉ nhận biết/kiểm chứng tính chất chứ chưa tính thuận tiện một biểu thức dài.' },
  { cu: 'T104010501', nhom: 'NNB01779', mo_ta: 'Ôn tập số đến lớp triệu: viết số thành tổng các hàng, xác định giá trị của chữ số, các chữ số thuộc từng lớp, đọc số; công cụ: bảng hàng – lớp.' },
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  for (const d of DANG) {
    if ((await q(`select 1 from dai_bdm_doi_ung where ma_dang_cu=$1`, [d.cu])).length) throw new Error(`${d.cu} đã có đối ứng — dừng`)
    const cu = (await q(`select ten_dang, muc_do, bac_toi_thieu from dai_ban_do where ma_dang=$1 and xoa_at is null`, [d.cu]))[0]
    if (!cu) throw new Error(`không thấy ${d.cu}`)
    if (!(await q(`select 1 from dai_bdm_nhom n join dai_bdm_chu_de c on c.id=n.chu_de_id where n.id=$1 and c.khoi='4'`, [d.nhom])).length) throw new Error(`nhóm ${d.nhom} không thuộc K4`)
    const db = (await q(`insert into dai_bdm_dang_bai(nhom_id, ten, mo_ta, muc_do, bac_toi_thieu) values ($1,$2,$3,$4,$5) returning id`, [d.nhom, cu.ten_dang, d.mo_ta, cu.muc_do, cu.bac_toi_thieu]))[0].id
    await c.query(`insert into dai_bdm_doi_ung(ma_dang_cu, dich_dang_bai) values ($1,$2)`, [d.cu, db])
    const g = await c.query(`insert into dai_bdm_gan_cau(ma_cau, dang_bai_id, nguon)
      select q.ma_cau, $2, 'doi_ung' from dai_cau_hoi q where q.dang_chinh=$1 and q.parent_ma_cau is null and q.xoa_at is null and q.loai_cau<>'dung_sai'
        and not exists (select 1 from dai_bdm_gan_cau x where x.ma_cau=q.ma_cau) on conflict (ma_cau) do nothing`, [d.cu, db])
    const sao = (await q(`select count(*) n from dai_cau_hoi s join dai_bdm_gan_cau g on g.ma_cau=s.parent_ma_cau where s.dang_chinh=$1 and s.xoa_at is null`, [d.cu]))[0].n
    console.log(`${d.cu} «${cu.ten_dang}» -> dạng mới ${db} trong ${d.nhom} · gán gốc ${g.rowCount} · bản sao theo gốc ${sao}`)
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
