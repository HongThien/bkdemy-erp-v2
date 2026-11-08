// chuyen-dang-hinh-hoc.mjs [--ghi] — K9 bản đồ mới (Thùy 23/10): chuyển dạng Hình học "Cho chu vi, thay đổi kích thước dẫn đến thay đổi diện tích" (NDB00736)
// từ nhóm "Bài toán Diện tích" (chuyên đề Giải toán bằng cách lập phương trình) sang nhóm "Bài toán liên quan đến quan hệ Tích hai đối tượng" (NNB01401,
// chuyên đề Giải toán bằng cách lập Hệ phương trình — nơi đã có dạng "Bài toán có nội dung Hình học"). Dùng RPC của app fn_bdm_chuyen_dang_bai: giữ nguyên mô tả / lý thuyết / ví dụ / câu gán.
import pg from 'pg'
import { bien } from '../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('begin')
const dem = async (nhom) => (await c.query(`select d.id, d.ten, (select count(*) from dai_bdm_gan_cau g where g.dang_bai_id=d.id)::int gan, (select count(*) from dai_bdm_de_xuat g where g.dang_bai_id=d.id)::int dx from dai_bdm_dang_bai d where d.nhom_id=$1 order by d.thu_tu`, [nhom])).rows
console.log('TRƯỚC — nhóm Diện tích:', await dem('NNB01051')); console.log('TRƯỚC — nhóm Tích hai đối tượng:', await dem('NNB01401'))
const ok = (await c.query(`select 1 from dai_bdm_dang_bai where id='NDB00736' and nhom_id='NNB01051'`)).rowCount
if (!ok) { console.log('⚠ NDB00736 không còn ở NNB01051 — dừng'); await c.query('rollback'); await c.end(); process.exit(0) }
await c.query(`select fn_bdm_chuyen_dang_bai('NDB00736','NNB01401',null)`)
console.log('SAU — nhóm Diện tích:', await dem('NNB01051')); console.log('SAU — nhóm Tích hai đối tượng:', await dem('NNB01401'))
if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('Chạy thử — ROLLBACK. Thêm --ghi để ghi thật.') }
await c.end()
