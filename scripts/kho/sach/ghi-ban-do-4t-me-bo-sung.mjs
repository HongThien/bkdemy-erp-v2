// ghi-ban-do-4t-me-bo-sung.mjs — BỔ SUNG 9 dạng cho bản đồ 4T (Thùy duyệt 21/11 "Duyệt thêm 9 dạng") sau khi nhập sách ME:
// các dạng mà 2 trạm gán dạng (làm + mù) cùng báo là bản đồ chưa có. CHỈ THÊM (2 nhóm + 9 dạng), không đổi mã nào. Chạy lại an toàn.
//   node scripts/kho/sach/ghi-ban-do-4t-me-bo-sung.mjs [--ghi]      (không --ghi: chạy thử trong transaction rồi ROLLBACK)
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const CD_SO = 'NCD00202', CD_LOGIC = 'NCD00204', CD_LOIVAN = 'NCD00206', CD_PS = 'NCD00207'
// [chủ đề, chuyên đề, nhóm (mã | {moi}), [[tên, mô tả]]]
const THEM = [
  [CD_SO, 'NCH00504', { moi: 'Tính thuận tiện' }, [
    ['Tính thuận tiện bằng tính chất giao hoán, kết hợp của phép cộng và phép trừ', 'Ví dụ: 687 + 969 + 313; 186 − 65 − 35; 1024 − (1024 − 15); 3145 − 246 + 2347 − 145 + 4246 − 347'],
    ['Tính thuận tiện bằng cách nhóm thừa số cho tích tròn chục, tròn trăm', 'Ví dụ: 4 × 125 × 25 × 8; 25 × 20 × 125 × 8 − 8 × 20 × 5 × 125']]],
  [CD_SO, 'NCH00505', 'NNB01713', [
    ['Thay đổi số bị trừ, số trừ: hiệu thay đổi thế nào', 'Ví dụ: thêm vào số bị trừ, bớt ở số trừ; biết hiệu mới tìm số ban đầu'],
    ['Tìm hai số biết quan hệ giữa thương với số bị chia, số chia', 'Ví dụ: thương bằng 1/5 số lớn; thương bằng 1/9 số bé']]],
  [CD_SO, 'NCH00502', 'NNB02271', [
    ['Đếm số theo điều kiện so sánh hai nửa của số (hoặc tổng hai cặp chữ số đầu, cuối)', 'Ví dụ: số có 4 chữ số mà số tạo bởi hai chữ số đầu nhỏ hơn số tạo bởi hai chữ số cuối; tổng hai chữ số đầu bằng tổng hai chữ số cuối']]],
  [CD_LOIVAN, 'NCH00517', 'NNB01727', [
    ['Hai tỉ số: cả hai đại lượng cùng thay đổi, không đại lượng nào giữ nguyên', 'Đề không cho tổng, không cho hiệu; thêm hoặc bớt số khác nhau ở từng đại lượng']]],
  [CD_PS, 'NCH00520', { moi: 'Tìm x với phân số' }, [
    ['Tìm x trong biểu thức có phân số', 'Ví dụ: (1/2 + 1/3 + 1/4) × x = 1 + 2/3 + 1/2; 6/5 − x : 1/2 = 1/2']]],
  [CD_PS, 'NCH00519', 'NNB01731', [
    ['So sánh phân số lớn hơn 1 bằng phương pháp phần hơn', 'Ví dụ: 100/99 và 101/100; 27/13 và 41/27']]],
  [CD_LOGIC, 'NCH00507', 'NNB01715', [
    ['Tìm quy luật của dãy cách đều và viết thêm số hạng', 'Ví dụ: 1; 3; 5; 7; … viết thêm 3 số hạng; dãy 12; 16; 20; 24; …']]],
]

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
const dem = { nhom: 0, dang: 0 }
let ma = 0
try {
  await db.query('begin')
  const one = async (sql, p) => (await db.query(sql, p)).rows[0]
  for (const [cdId, chId, nh, dang] of THEM) {
    let nhId = nh
    if (typeof nh !== 'string') {
      nhId = (await one(`select id from dai_bdm_nhom where chu_de_id = $1 and chuyen_de_id = $2 and ten = $3`, [cdId, chId, nh.moi]))?.id
      if (!nhId) {
        const tt = (await one(`select coalesce(max(thu_tu), 0) + 1 t from dai_bdm_nhom where chu_de_id = $1 and chuyen_de_id = $2`, [cdId, chId])).t
        nhId = (await one(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values ($1, $2, $3, $4) returning id`, [cdId, chId, nh.moi, tt])).id
        dem.nhom++
      }
    } else if (!(await one(`select 1 x from dai_bdm_nhom where id = $1 and chu_de_id = $2 and chuyen_de_id = $3`, [nhId, cdId, chId]))) throw new Error(`nhóm ${nhId} không nằm ở ${cdId}/${chId}`)
    const co = new Set((await db.query(`select ten from dai_bdm_dang_bai where nhom_id = $1`, [nhId])).rows.map((r) => r.ten.toLowerCase()))
    let tt = (await one(`select coalesce(max(thu_tu), 0) t from dai_bdm_dang_bai where nhom_id = $1`, [nhId])).t
    for (const [ten, mo_ta] of dang) {
      if (co.has(ten.toLowerCase())) continue
      const id = (await one(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4) returning id`, [nhId, ten, mo_ta, ++tt])).id
      console.log(`  + ${id} (${nhId}) ${ten}`); dem.dang++
    }
  }
  const tong = await one(`select count(d.id) d from dai_bdm_chu_de cd join dai_bdm_nhom n on n.chu_de_id = cd.id left join dai_bdm_dang_bai d on d.nhom_id = n.id where cd.khoi = '4T' and cd.kho = 'dai'`)
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(dem), `· bản đồ 4T: ${tong.d} dạng`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
