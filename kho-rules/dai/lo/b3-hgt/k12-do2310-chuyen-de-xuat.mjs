// Đợt mastery 23/10 (câu đã có HS làm): chuyển 2 câu HGT K12 từ hàng THIẾU DẠNG sang hàng ĐỀ XUẤT (chac 'vua', nguon 'ai') —
// Claude (Opus) xếp tay theo đề + lời giải; CHƯA gán chắc (luật Thùy 20/10). Chỉ đụng dòng nguon='ai'.
//   node kho-rules/dai/lo/b3-hgt/k12-do2310-chuyen-de-xuat.mjs [--ghi]   (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const DS = [
  ['T312010103001', 'NDB00851', 'Mặt phẳng qua M cắt 3 tia theo tỉ lệ OA=2OB=4OC (đoạn chắn) — bản đồ chưa có dạng đoạn chắn riêng, gần nhất "biết 2 quan hệ hình học".'],
  ['T312010202025', 'NDB00873', 'Hình chiếu của đường thẳng lên mặt phẳng: dựng qua hình chiếu điểm; hợp cả NDB00853 ⇒ dạng sau thắng.'],
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const ma = DS.map((x) => x[0])
  const nguoi = (await c.query(`select ma_cau from hgt_bdm_cau_thieu_dang where ma_cau = any($1) and nguon <> 'ai' union select ma_cau from hgt_bdm_gan_cau where ma_cau = any($1)`, [ma])).rows
  if (nguoi.length) throw new Error('có câu đã do người quyết / đã gán: ' + nguoi.map((r) => r.ma_cau).join(','))
  const xoa = await c.query(`delete from hgt_bdm_cau_thieu_dang where ma_cau = any($1) and nguon = 'ai'`, [ma])
  const them = await c.query(`insert into hgt_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon)
    select t.ma, t.db, 'vua', t.ly, 'ai' from unnest($1::text[], $2::text[], $3::text[]) t(ma, db, ly)
    on conflict (ma_cau) do nothing`, [ma, DS.map((x) => x[1]), DS.map((x) => x[2])])
  console.log(`rút thiếu dạng ${xoa.rowCount} · thêm đề xuất ${them.rowCount}/${DS.length}`)
  if (them.rowCount !== DS.length) throw new Error('lệch số dòng')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
