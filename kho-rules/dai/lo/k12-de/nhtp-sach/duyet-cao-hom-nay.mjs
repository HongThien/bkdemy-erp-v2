// duyet-cao-hom-nay.mjs — DUYỆT (da_duyet=true, duyet_nguon='ai') câu NH-TP K12 đã được GÁN mức cao / vào kho Đ/S chủ đề NCD00095 trong NGÀY (VN) + ví dụ trên lớp nguon=sach. Thùy 04/11: "đẩy vào bản đồ thì auto duyệt". Mặc định chạy thử; --ghi để duyệt.
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: GHI ? (process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL) : (process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL) }); await c.connect()
const Q = async (s, p) => (await c.query(s, p)).rows
const NGAY = "(now() at time zone 'Asia/Ho_Chi_Minh')::date"
const set = await Q(`
  select distinct q.ma_cau, q.loai_cau from dai_cau_hoi q where q.xoa_at is null and q.da_duyet = false and (
    exists (select 1 from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id=g.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id
             where g.ma_cau=q.ma_cau and n.chu_de_id='NCD00095' and g.nguon='ai' and (g.at at time zone 'Asia/Ho_Chi_Minh')::date = ${NGAY})
    or exists (select 1 from dai_bdm_kho_ds k where k.ma_cau=q.ma_cau and k.chu_de_id='NCD00095' and k.nguon='ai' and (k.at at time zone 'Asia/Ho_Chi_Minh')::date = ${NGAY}))`)
const by = {}; for (const x of set) by[x.loai_cau] = (by[x.loai_cau] || 0) + 1
console.log('câu cần duyệt (đã gán cao / kho Đ/S, nay chưa duyệt):', set.length, by)
const lop = await Q(`select count(*) n from dai_cau_lop l join dai_bdm_dang_bai d on d.id=l.dang_bai_id join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id='NCD00095' and l.nguon='sach' and l.da_duyet=false and l.xoa_at is null`)
console.log('ví dụ trên lớp chưa duyệt:', lop[0].n)
if (GHI) {
  await c.query('begin')
  try {
    const r = await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau = any($1) and da_duyet=false`, [set.map((x) => x.ma_cau)])
    const l = await c.query(`update dai_cau_lop l set da_duyet=true, duyet_at=now() from dai_bdm_dang_bai d, dai_bdm_nhom n where d.id=l.dang_bai_id and n.id=d.nhom_id and n.chu_de_id='NCD00095' and l.nguon='sach' and l.da_duyet=false and l.xoa_at is null`)
    console.log('duyệt câu:', r.rowCount, '· ví dụ lớp:', l.rowCount)
    if (r.rowCount !== set.length) throw new Error('lệch số dòng')
    await c.query('commit'); console.log('✔ ĐÃ COMMIT')
  } catch (e) { await c.query('rollback'); console.error('ROLLBACK', e.message) }
}
await c.end()
