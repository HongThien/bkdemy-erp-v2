// Đưa bản đồ Hình–Học 8T lên BẢN ĐỒ MỚI (Thùy 14/11: "chưa thấy bản đồ hình lên sóng khối 8T à").
//   Bản đồ mới đọc bài Hình–Học qua hinh_hoc_bai.chu_de_id → dai_bdm_chu_de (nhanh='hinh') — như khối 8 (NCD00178 Tứ giác, NCD00209 Định lý Thales).
//   8T mới chỉ có ma_chuyen_de/ten_chuyen_de (bản đồ cũ) nên không hiện. Script: thêm 5 chủ đề Hình khối 8T (= 5 chuyên đề đã chốt 14/11, cùng thứ tự)
//   rồi gắn chu_de_id cho 20 bài theo ma_chuyen_de. Không xoá, không đổi mã bài. 1 transaction; lệch số ⇒ ROLLBACK.
//   node scripts/hinh-k8t-len-ban-do-moi.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const CD = [['HH8T01', 'Tứ giác'], ['HH8T03', 'Định lí Thalès'], ['HH8T07', 'Tam giác đồng dạng'], ['HH8T05', 'Đa giác và diện tích'], ['HH8T06', 'Cực trị, quỹ tích, dựng hình']]
try {
  await c.query('begin')
  const da = (await c.query(`select count(*)::int n from dai_bdm_chu_de where khoi='8T' and nhanh='hinh'`)).rows[0].n
  if (da) throw new Error(`khối 8T đã có ${da} chủ đề Hình — dừng, xem tay`)
  let gan = 0
  for (const [ma, ten] of CD) {
    const id = (await c.query(`insert into dai_bdm_chu_de (khoi, ten, nhanh, kho) values ('8T', $1, 'hinh', 'dai') returning id, thu_tu`, [ten])).rows[0]
    const r = await c.query(`update hinh_hoc_bai set chu_de_id = $1 where khoi='8T' and ma_chuyen_de = $2 and chu_de_id is null`, [id.id, ma])
    console.log(`${id.id} (thứ tự ${id.thu_tu}) ${ten} ← ${r.rowCount} bài`); gan += r.rowCount
  }
  const sau = (await c.query(`select count(*)::int n from hinh_hoc_bai where khoi='8T' and ma_bai <> 'HH8T000000' and chu_de_id is null`)).rows[0].n
  console.log(`gắn ${gan} bài · còn chưa xếp ${sau}`)
  if (gan !== 20 || sau !== 0) throw new Error('lệch số — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
