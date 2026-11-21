// 5t-don-ban-do-2.mjs — dọn bản đồ 5T đợt 2 (Thùy 21/11 "làm đi"):
//   P25  thêm dạng «Bảng loại trừ ghép đối tượng» vào nhóm «Suy luận lô-gic» (dữ liệu: 5T-dang-moi-chi-tiet.json)
//   S05  KHÔNG gộp/xoá: phân định hai dạng đổi thời gian NDB02986 ↔ NDB03047 (nối câu "Phân biệt với …" vào mô tả hai phía)
//   S04  xoá chuyên đề RỖNG «Các phép tính toán cơ bản» (NCH00546: 0 nhóm, 0 dạng, 0 câu; chỉ còn dòng ô dai_bdm_o) — giao dịch riêng, kiểm rỗng ngay trước khi xoá
//   node scripts/kho/5t-don-ban-do-2.mjs [--ghi]     (mặc định chạy thử rồi ROLLBACK; chạy lại an toàn)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const P25 = JSON.parse(readFileSync('kho-rules/dai/lo/me5-250/5T-dang-moi-chi-tiet.json', 'utf8')).p.P25
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL }); await c.connect()
const fin = async (ten) => { await c.query(GHI ? 'commit' : 'rollback'); console.log(ten, GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)') }
try {
  // ---- P25 + S05
  await c.query('begin')
  const nh = (await c.query(`select n.id from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='5T' and n.ten='Suy luận lô-gic'`)).rows
  if (nh.length !== 1) throw new Error('nhóm «Suy luận lô-gic»: ' + nh.length)
  const co = (await c.query(`select id from dai_bdm_dang_bai where nhom_id=$1 and ten=$2`, [nh[0].id, P25.ten])).rows[0]
  if (co) await c.query(`update dai_bdm_dang_bai set mo_ta=$2, ly_thuyet=$3, vi_du=$4 where id=$1`, [co.id, P25.mo_ta, P25.lt, P25.vd])
  else await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, vi_du) values ($1,$2,$3,$4,$5)`, [nh[0].id, P25.ten, P25.mo_ta, P25.lt, P25.vd])
  const PD = [
    ['NDB02986', 'Phân biệt với «Đổi đơn vị thời gian» (NDB03047): đề đổi MỘT số đo sang một đơn vị khác (giờ ra phút, phút ra giây…) thuộc NDB03047; dạng này dành cho đề đổi qua lại giữa dạng phức (giờ–phút) và dạng số thập phân của cùng đơn vị (3 giờ 36 phút ↔ 3,6 giờ), hoặc có phép tính với số đo thời gian.'],
    ['NDB03047', 'Phân biệt với «Thời gian (giờ–phút–giây) · dạng STP» (NDB02986): đề đổi qua lại giữa dạng phức và dạng số thập phân của cùng đơn vị (3 giờ 36 phút ↔ 3,6 giờ) thuộc NDB02986.'],
  ]
  let pd = 0
  for (const [id, cau] of PD) { const d = (await c.query(`select mo_ta from dai_bdm_dang_bai where id=$1`, [id])).rows[0]; if (d.mo_ta.includes('Phân biệt với')) continue; await c.query(`update dai_bdm_dang_bai set mo_ta=$2 where id=$1`, [id, d.mo_ta.trimEnd() + ' ' + cau]); pd++ }
  console.log({ P25: co ? 'cập nhật' : 'thêm mới', S05_mo_ta: pd })
  await fin('P25 + S05')
  // ---- S04 (giao dịch riêng)
  await c.query('begin')
  const ch = 'NCH00546'
  const r = (await c.query(`select (select count(*) from dai_bdm_nhom where chuyen_de_id=$1)::int nhom, (select count(*) from dai_bdm_o where chuyen_de_id=$1)::int o, (select count(*) from dai_bdm_chuyen_de where id=$1 and ten='Các phép tính toán cơ bản')::int co`, [ch])).rows[0]
  if (!r.co) { console.log('S04: chuyên đề không còn — bỏ qua'); await fin('S04'); } else {
    if (r.nhom) throw new Error('chuyên đề còn nhóm — KHÔNG xoá')
    await c.query(`delete from dai_bdm_o where chuyen_de_id=$1`, [ch])
    await c.query(`delete from dai_bdm_chuyen_de where id=$1`, [ch])
    console.log('S04: xoá dòng ô', r.o, '+ chuyên đề', ch, '(0 nhóm)')
    await fin('S04')
  }
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
