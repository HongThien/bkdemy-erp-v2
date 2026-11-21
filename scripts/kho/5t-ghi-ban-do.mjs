// 5t-ghi-ban-do.mjs — ghi bản đồ 5T theo trang đề xuất Thùy đã gật 21/11 (docs/de-xuat-5T-ban-do.html):
//   · 1 CHUYÊN ĐỀ mới "Suy luận – Đếm – Thống kê" (chủ đề giữ nguyên: nằm trong "Cấu tạo số - Số tự nhiên")
//   · 7 NHÓM mới (1 ở "Bài toán tỉ số" + 6 ở chuyên đề mới) · 14 DẠNG mới (8 vào nhóm có sẵn/nhóm mới, 6 ở chuyên đề mới)
//   · 2 sửa chính tả (đổi tên, mã giữ nguyên): nhóm "phầm" → "phần trăm"; dạng "chưa số thập phân" → "chứa"
// Chỉ THÊM + đổi tên; không đổi/xoá dạng nào đang có câu. Mô tả lấy từ kho-rules/dai/lo/me5-250/ME-gan-dang-so-bo.json (dang_moi).
// Lý thuyết / ví dụ của 14 dạng mới để TRỐNG (chưa soạn) ⇒ câu gán vào đó chưa được coi là "chắc" (§C6) cho tới khi có.
//   node scripts/kho/5t-ghi-ban-do.mjs [--ghi]     (mặc định chạy thử rồi ROLLBACK; idempotent: dạng/nhóm đã có theo tên thì bỏ qua)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const NEW = JSON.parse(readFileSync('kho-rules/dai/lo/me5-250/ME-gan-dang-so-bo.json', 'utf8')).dang_moi
const CD_MOI = 'Suy luận – Đếm – Thống kê'
const NHOM_MO_TA = {
  'Tổng – hiệu hai số (nền, chưa có tỉ số)': 'Bài toán tìm hai số khi biết tổng và hiệu (chưa có tỉ số): nền cho mọi bài tổng–tỉ, hiệu–tỉ phía sau.',
  'Lô-gic – suy luận': 'Bài chỉ cần suy luận chặt chẽ từ các dữ kiện (đúng–sai, xếp hạng, so sánh), không cần công thức.',
  'Nguyên lí Dirichlet': 'Bài "lấy ít nhất bao nhiêu để chắc chắn có…": xét trường hợp xấu nhất rồi cộng thêm 1.',
  'Trò chơi – thao tác lặp – bất biến': 'Bài thực hiện lặp một thao tác (xoá, thay, dồn, chuyển) hoặc trò chơi hai người: tìm đại lượng không đổi hoặc chiến thuật.',
  'Lịch và đồng hồ': 'Bài về thứ – ngày – tháng – năm và kim đồng hồ: dùng phép chia có dư và chu kỳ.',
  'Thống kê – xác suất – đếm theo nhóm': 'Bài đọc bảng số liệu, gieo xúc xắc / đồng xu, đếm hai nhóm giao nhau.',
  'Cực trị – xếp, ghép': 'Bài tìm giá trị nhiều nhất / ít nhất khi xếp, ghép, chia.',
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const dem = async () => (await c.query(`select (select count(*) from dai_bdm_chuyen_de ch where ch.id in (select distinct nh.chuyen_de_id from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T'))::int chuyen_de,
  (select count(*) from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int nhom,
  (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int dang`)).rows[0]
try {
  await c.query('begin')
  const truoc = await dem()
  const one = async (sql, p) => { const r = await c.query(sql, p); if (r.rowCount !== 1) throw new Error(`mong 1 dòng, được ${r.rowCount}: ${p.join(' | ')}`); return r.rows[0] }
  const cdBTS = await one(`select id from dai_bdm_chu_de where khoi='5T' and ten='Bài toán tỉ số'`, [])
  const cdCTS = await one(`select id from dai_bdm_chu_de where khoi='5T' and ten='Cấu tạo số - Số tự nhiên'`, [])
  const chTiSo = await one(`select ch.id from dai_bdm_chuyen_de ch where ch.ten='Các bài toán về tỉ số' and ch.id in (select chuyen_de_id from dai_bdm_nhom where chu_de_id=$1)`, [cdBTS.id])
  // chuyên đề mới (nếu chưa có)
  let chMoi = (await c.query(`select id from dai_bdm_chuyen_de where ten=$1 and id in (select chuyen_de_id from dai_bdm_nhom where chu_de_id=$2)`, [CD_MOI, cdCTS.id])).rows[0]
  let nChMoi = 0
  if (!chMoi) { chMoi = (await c.query(`insert into dai_bdm_chuyen_de (ten, mo_ta) values ($1, $2) returning id`, [CD_MOI, 'Bài suy luận, đếm, thống kê, trò chơi và bất biến thường gặp trong đề thi vào lớp 6 chất lượng cao và sách chọn lọc lớp 5.'])).rows[0]; nChMoi = 1 }
  // ô (chủ đề × chuyên đề) — khoá ngoại của nhóm trỏ vào đây
  await c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id) values ($1,$2) on conflict do nothing`, [cdCTS.id, chMoi.id])
  let nNhom = 0, nDang = 0
  const nhomId = {}
  for (const v of Object.values(NEW)) {
    const isCdMoi = v.cd === CD_MOI
    const cdId = isCdMoi ? cdCTS.id : (await one(`select id from dai_bdm_chu_de where khoi='5T' and ten=$1`, [v.cd])).id
    const chId = isCdMoi ? chMoi.id : null
    let nh = (await c.query(`select id from dai_bdm_nhom where chu_de_id=$1 and ten=$2`, [cdId, v.nhom])).rows[0]
    if (!nh) {
      if (!v.nhomMoi) throw new Error('Không thấy nhóm có sẵn: ' + v.nhom)
      nh = (await c.query(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1,$2,$3,$4) returning id`, [cdId, isCdMoi ? chId : chTiSo.id, v.nhom, NHOM_MO_TA[v.nhom] ?? ''])).rows[0]; nNhom++
    }
    nhomId[v.nhom] = nh.id
    const co = (await c.query(`select id from dai_bdm_dang_bai where nhom_id=$1 and ten=$2`, [nh.id, v.ten])).rows[0]
    if (!co) { await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta) values ($1,$2,$3)`, [nh.id, v.ten, v.mo_ta]); nDang++ }
  }
  // sửa chính tả (chỉ đổi tên, mã giữ nguyên)
  const s1 = await c.query(`update dai_bdm_nhom set ten='Phép toán với tỉ số phần trăm' where ten='Phép toán với tỉ số phầm trăm' and chu_de_id=$1 returning id`, [cdBTS.id])
  const s2 = await c.query(`update dai_bdm_dang_bai set ten='Bài toán tính biểu thức hỗn hợp chứa số thập phân' where ten='Bài toán tính biểu thức hỗn hợp chưa số thập phân' returning id`)
  const sau = await dem()
  console.log({ truoc, sau, them: { chuyen_de: nChMoi, nhom: nNhom, dang: nDang }, doi_ten: { nhom: s1.rowCount, dang: s2.rowCount } })
  if (sau.dang !== truoc.dang + nDang || sau.nhom !== truoc.nhom + nNhom || sau.chuyen_de !== truoc.chuyen_de + nChMoi) throw new Error('số đếm sau không khớp — ROLLBACK')
  if (nDang !== 14 || nNhom !== 7 || nChMoi !== 1) console.warn(`⚠ khác kế hoạch (14 dạng / 7 nhóm / 1 chuyên đề): ${nDang}/${nNhom}/${nChMoi}${GHI ? '' : ' — (lần đầu mới phải đủ)'}`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
