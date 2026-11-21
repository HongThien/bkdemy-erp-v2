// ============================================================================
// ghi-ban-do-4t-me.mjs — GHI bản đồ kiến thức 4T (dai_bdm_*) theo đề xuất ME ĐÃ DUYỆT (Thùy 21/11: "P1 đến P31 theo m đề xuất").
//   Nguồn đề xuất: docs/de-xuat-4T-me-ban-do-va-spec.html (mã dòng P01–P31 ghi trong từng khối dưới đây).
//
//   node scripts/kho/sach/ghi-ban-do-4t-me.mjs [--ghi]
//
// CHỈ THÊM + ĐỔI TÊN + CHUYỂN NHÓM của MỘT dạng (NDB01625 → nhóm Tuổi, mã giữ nguyên) + gộp NDB01527 (Đ6, Thùy gật):
//   · chuyển đề xuất của câu T14T000000035 sang NDB00649, trỏ dòng đối ứng dạng cũ T14T070101 về NHÓM NNB01716, rồi xoá dạng rỗng NDB01527
//     (chỉ khi mọi bảng trỏ vào nó đã về 0 — nếu còn thì DỪNG, rollback).
//   · KHÔNG đụng câu nào khác; KHÔNG đổi mã nào. Câu cũ của NDB01540 / NDB01625 xếp lại vào dạng tách mới: việc RIÊNG, sau.
// Chạy lại an toàn (tìm theo tên trước khi tạo). Không --ghi: chạy thử trong transaction rồi ROLLBACK. Mã gốc bất biến: mã mới do DB cấp.
// ============================================================================
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const CD = { so: 'NCD00202', logic: 'NCD00204', cautao: 'NCD00205', loivan: 'NCD00206', phanso: 'NCD00207' }

// [pid, chủ đề, chuyên đề (mã | {moi}), nhóm (mã | {moi}), [[tên dạng, mô tả], …]]
const THEM = [
  ['P01', CD.so, 'NCH00501', { moi: 'Xoá bớt chữ số' }, [
    ['Xoá bớt chữ số của một số (hoặc dãy số chẵn liên tiếp) để được số lớn nhất, nhỏ nhất', 'Ví dụ: xoá 6 chữ số của số tạo bởi các số chẵn liên tiếp để số còn lại lớn nhất / nhỏ nhất'],
    ['Xoá bớt chữ số của dãy số tự nhiên viết liền', 'Ví dụ: viết liền 1 đến 15 (1234…1415) rồi xoá 6 chữ số; dãy 20 19 18 … 11'],
    ['Xoá chữ số để được số chẵn lớn nhất / số lẻ nhỏ nhất', 'Có thêm điều kiện về chữ số tận cùng']]],
  ['P02', CD.so, 'NCH00501', 'NNB01708', [
    ['Viết số lớn nhất theo quy luật giữa các chữ số liền nhau', 'Hai chữ số liền nhau hơn kém 2 đơn vị; từ chữ số thứ ba bằng tổng hai chữ số đứng liền trước']]],
  ['P04', CD.so, 'NCH00502', { moi: 'Đếm số theo điều kiện' }, [
    ['Đếm số chia hết cho 5, 3, 15 hoặc tận cùng bằng 5', 'Chọn hàng bị ràng buộc (hàng đơn vị) trước, chia Trường hợp 1 / 2 nếu có chữ số 0'],
    ['Đếm số có tổng các chữ số (hoặc hiệu hai chữ số) cho trước', 'Liệt kê các cách chọn chữ số rồi đếm'],
    ['Đếm số có ít nhất một chữ số cho trước (đếm phần bù)', 'Ví dụ: có ít nhất một chữ số 6 = tất cả − không có chữ số 6'],
    ['Đếm số có đúng một chữ số cho trước (chia trường hợp vị trí)', 'Ví dụ: có đúng một chữ số 5']]],
  ['P05', CD.so, 'NCH00502', { moi: 'Tổng các số lập được' }, [
    ['Tổng tất cả các số lập từ các chữ số khác nhau cho trước', 'Mỗi chữ số xuất hiện đều nhau ở mỗi hàng'],
    ['Biết tổng các số lập được, tìm chữ số chưa biết', 'Ví dụ: tổng các số lập được bằng 66660'],
    ['Biết tổng các chữ số, tính tổng các số lập được', 'Ví dụ: a + b + c + d = 15']]],
  ['P06', CD.logic, { moi: 'Đếm cách, bắt tay, đường đi' }, { moi: 'Đếm cách, bắt tay, đường đi' }, [
    ['Bắt tay giữa n người', 'Cộng dần: 29 + 28 + … + 1'],
    ['Bắt tay có điều kiện (trừ vợ chồng, trừ người quen)', 'Tổng số cái bắt tay trừ đi những cặp không bắt tay'],
    ['Đếm đường đi, đếm cách xếp chữ trên sơ đồ', 'Cộng dần số đường vào mỗi nút; cần hình đề (chữ MATH, đường kiến đi)']]],
  ['P07', CD.loivan, 'NCH00516', 'NNB01724', [
    ['Tìm nhiều số khi biết trung bình cộng của các nhóm con', 'Ví dụ: 5 số chẵn liên tiếp trung bình 126; trung bình 4 số, 3 số đầu, 3 số cuối']]],
  ['P08', CD.so, 'NCH00504', { moi: 'Tìm x' }, [
    ['Tìm x: một đến hai phép tính, có ngoặc', 'Ví dụ: x − 140 : 35 = 270; 357 : (87 : x) = 119'],
    ['Tìm x: nhiều phép tính, nhiều chữ x cùng lúc', 'Ví dụ: (x+1)+(x+3)+(x+5)=30; x : 8 × 32 + x : 3 × 18 − x : 5 × 10 = 120'],
    ['Tìm x dùng tính chất phân phối', 'Ví dụ: 1358 × x − 358 × x = 25000']]],
  ['P09', CD.so, 'NCH00505', 'NNB01713', [
    ['Thay đổi thừa số, số bị chia, số chia', 'Tích, thương đổi thế nào khi một thành phần gấp lên / giảm đi'],
    ['Tổng của số bị trừ, số trừ và hiệu', 'Ví dụ: tổng của số bị trừ, số trừ và hiệu bằng 2000']]],
  ['P10', CD.so, 'NCH00505', { moi: 'Làm sai khi tính' }, [
    ['Trừ hoặc cộng viết sai chữ số', 'Ví dụ: viết 49 thành 94; 107 thành 1007'],
    ['Nhân đặt tích riêng thẳng cột như phép cộng', 'Ví dụ: 46 × …, 901 × …'],
    ['Nhân viết nhầm, thêm hoặc đổi chữ số của thừa số', 'Ví dụ: thêm chữ số 3 vào 25; đổi chỗ hàng nghìn và hàng trăm']]],
  ['P11', CD.so, 'NCH00505', { moi: 'Phép chia có dư đặc biệt' }, [
    ['Số dư lớn nhất, số chia nhỏ nhất', 'Số dư luôn nhỏ hơn số chia'],
    ['Tìm số bị chia hoặc số chia bé nhất khi biết thương và số dư', ''],
    ['Thêm hoặc bớt bao nhiêu để chia hết; biết tổng các thành phần', 'Ví dụ: tổng số bị chia, số chia, thương và dư bằng 969']]],
  ['P12', CD.loivan, 'NCH00515', 'NNB01723', [
    ['Tổng hiệu với số hai chữ số đổi chỗ', 'Ví dụ: hiệu hai chữ số bằng 5, tổng số đã cho và số đảo bằng 143']]],
  ['P13', CD.cautao, 'NCH00512', 'NNB01720', [
    ['Tìm chữ số để số chia hết cho 4, 8, 25, 125', ''],
    ['Tìm hoặc viết thêm chữ số để chia hết cho 6, 12, 15, 18, 36, 45, 225', 'Ví dụ: viết thêm một chữ số vào bên phải và bên trái 1996'],
    ['Không làm phép chia, nhận biết số 11…1, 33…3 chia hết cho 2, 3, 5, 9', 'Ví dụ: số gồm 2010 chữ số 1'],
    ['Giải thích "có thể hay không" bằng tính chất chia hết', 'Ví dụ: xé giấy; CHAMHOC − HOCCHAM = 102386; 200 quyển vở thưởng đều']]],
  ['P15', CD.cautao, 'NCH00514', { moi: 'Chuyển, đổi chỗ chữ số' }, [
    ['Chuyển chữ số cuối lên đầu số', 'Ví dụ: số mới hơn số cũ 765 đơn vị'],
    ['Đổi chỗ hai chữ số của một số', '']]],
  ['P16', CD.cautao, 'NCH00514', 'NNB01722', [
    ['Viết thêm chữ số vào giữa số cho trước', ''],
    ['Xoá một chữ số của số (hàng đơn vị, hàng trăm…) rồi so với số ban đầu', 'Giảm k đơn vị hoặc giảm k lần'],
    ['Gạch bỏ chữ số, số còn lại có hai chữ số', '']]],
  ['P17', CD.cautao, 'NCH00514', { moi: 'Số và tổng, tích, thương các chữ số' }, [
    ['Số bằng k lần chữ số hàng đơn vị của nó', ''],
    ['Số chia cho tổng các chữ số được thương và số dư cho trước', ''],
    ['Số gấp k lần tích các chữ số của nó', '']]],
  ['P18', CD.cautao, 'NCH00514', { moi: 'Phép tính với số viết bằng chữ' }, [
    ['Cộng theo hàng với số viết bằng chữ', 'Ví dụ: abcd + abc + ab + a = 11106'],
    ['Tích hai số viết bằng chữ', 'Ví dụ: aa × bc = 1001; ab × cd = bbb'],
    ['Cộng, trừ viết chồng bằng chữ', 'Ví dụ: ABC + BAC = 1660, tìm A + B + C'],
    ['Tìm x là chữ số trong biểu thức có số viết bằng chữ', 'Ví dụ: xx + x + 5 = 101'],
    ['So sánh hai biểu thức có số viết bằng chữ', 'Ví dụ: aa × b với bb × a'],
    ['Số đảo ngược: abcd − dcba, số liên tiếp tăng dần viết ngược', '']]],
  ['P19', CD.logic, 'NCH00507', { moi: 'Quy luật dãy số và điền ô' }, [
    ['Tìm quy luật dãy số không cách đều, viết thêm số hạng', 'Ví dụ: mỗi số bằng tổng hai số liền trước; nhân 3; cộng 1 rồi 2 rồi 3'],
    ['Điền ô sao cho tổng ba ô liên tiếp bằng nhau', ''],
    ['Xếp số vào bảng ngoằn ngoèo, số cho trước nằm ở cột nào', 'Ví dụ: số 2023 ở bảng 4 cột']]],
  ['P19', CD.logic, 'NCH00507', { moi: 'Viết liền các số' }, [
    ['Đếm số chữ số khi viết liền các số (đánh số trang sách)', 'Ví dụ: 150 trang cần 342 chữ số; biết 234 chữ số tìm số trang'],
    ['Đếm riêng chữ số 0, 1, 5 và tìm chữ số thứ n của dãy viết liền', '']]],
  ['P20', CD.phanso, 'NCH00518', { moi: 'Thêm (bớt) cùng một số vào tử số và mẫu số' }, [
    ['Thêm (bớt) cùng một số tự nhiên vào tử số và mẫu số để được phân số cho trước', 'Ví dụ: 39/64 thêm x thành 3/4; 31/61 thêm a thành 4/7']]],
  ['P21', CD.loivan, 'NCH00517', 'NNB01725', [
    ['Tìm tỉ số hai hoặc ba đại lượng khi biết quan hệ phân số', 'Ví dụ: 3/4 số cam bằng 2/5 số quýt'],
    ['Một phần bằng phân số của tổng các phần còn lại', 'Ví dụ: số bi xanh bằng 3/7 tổng số bi cả hộp']]],
  ['P22', CD.loivan, { moi: 'Bài toán hai hiệu số' }, { moi: 'Chia đều: thừa – thừa, thừa – thiếu, thiếu – thiếu' }, [
    ['Hai hiệu số: thừa – thừa', 'Ví dụ: chia mỗi người 2 quả thừa 12 quả, chia mỗi người 3 quả thừa 2 quả; sơ đồ hai đoạn, phần chênh nét đứt'],
    ['Hai hiệu số: thừa – thiếu', ''],
    ['Hai hiệu số: thiếu – thiếu', '']]],
  ['P22', CD.loivan, { moi: 'Bài toán hai hiệu số' }, { moi: 'Hai đại lượng cùng đổi theo thời gian' }, [
    ['Hai người làm cùng số sản phẩm, mỗi ngày làm khác nhau', 'Ví dụ: dệt chiếu, dệt khăn mặt'],
    ['Hai bể nước chảy hoặc rút cùng lúc (hiệu thay đổi đều)', '']]],
  ['P23', CD.loivan, 'NCH00515', { moi: 'Bài toán về tuổi' }, [
    // dạng (a) "Tuổi: hiệu tuổi không đổi" = NDB01625 chuyển vào + đổi tên (xem CHUYEN_TUOI), không tạo mới
    ['Tuổi: tổng, hiệu hoặc tỉ số tại một thời điểm', ''],
    ['Tuổi: sau (cách đây) bao nhiêu năm thì gấp k lần', ''],
    ['Tuổi: hai thời điểm có hai tỉ số khác nhau', ''],
    ['Tuổi: tổng tuổi nhiều người', 'Ví dụ: tuổi mẹ bằng 4/3 tổng tuổi ba con']]],
  ['P24', CD.loivan, 'NCH00517', 'NNB01727', [
    ['Hai tỉ số: hiệu không đổi', 'Ví dụ: hiệu số hoa của hai bạn không đổi khi cùng hái thêm']]],
  ['P25', CD.loivan, { moi: 'Bài toán công việc chung' }, { moi: 'Làm chung và làm riêng' }, [
    ['Hai người làm chung, tìm thời gian làm xong', 'Quy về số phần bằng nhau (bội chung nhỏ nhất), không chia cho phân số'],
    ['Vòi nước chảy vào cùng vòi tháo ra', ''],
    ['Biết làm chung và một người làm riêng, tìm thời gian người kia', '']]],
  ['P25', CD.loivan, { moi: 'Bài toán công việc chung' }, { moi: 'Làm theo giai đoạn, nhiều người' }, [
    ['Công việc làm theo giai đoạn (cùng làm rồi một người làm tiếp hoặc nghỉ)', ''],
    ['Nhiều người làm chung, khoán theo tuần', 'Ví dụ: ba người, người thứ tư làm thay']]],
  ['P29', CD.phanso, 'NCH00518', { moi: 'Phân số bằng nhau' }, [
    ['Tìm x, y, a, b trong các phân số bằng nhau', 'Ví dụ: 3/7 = x/21; 2/x = y/6 = 12/18'],
    ['Tìm các phân số bằng phân số cho trước theo điều kiện về tử số, mẫu số', 'Ví dụ: tử số là 3; 12; 24; mẫu số lớn hơn 15 nhưng nhỏ hơn 50; lập phân số bằng 1/2 từ các chữ số cho trước']]],
  ['P30', CD.phanso, 'NCH00519', { moi: 'Tìm x và phân số xen giữa' }, [
    ['Tìm số tự nhiên x thoả bất đẳng thức giữa các phân số', 'Ví dụ: 2/x > 1/2; 1 < 11/x < 2; tìm x để 156/(327 − x) lớn nhất'],
    ['Tìm các phân số nằm giữa hai phân số cho trước', 'Ví dụ: 7 phân số nằm giữa 7/9 và 8/9']]],
  ['P31', CD.phanso, 'NCH00521', { moi: 'Dãy phân số mẫu nhân đôi, nhân ba' }, [
    ['Tính tổng dãy phân số có mẫu nhân đôi hoặc nhân ba', 'Ví dụ: 1/2 + 1/4 + … + 1/2048; 1 + 1/5 + 1/25 + …'],
    ['Chứng tỏ tổng dãy phân số nhỏ hơn 1 (hoặc nhỏ hơn 1/2)', '']]],
]

// đổi tên (mã giữ nguyên): [bảng, mã, tên mới, pid]
const DOI_TEN = [
  ['dai_bdm_dang_bai', 'NDB01507', 'Viết số tự nhiên lớn nhất / nhỏ nhất khi biết tích các chữ số và số chữ số', 'P03'],
  ['dai_bdm_dang_bai', 'NDB00652', 'Chọn các số chia hết cho 2, 3, 5, 9 trong một danh sách (kể cả "chia hết cho A nhưng không chia hết cho B")', 'P14'],
  ['dai_bdm_dang_bai', 'NDB00653', 'Tìm một chữ số a để số chia hết cho 3, 4, 9…', 'P14'],
  ['dai_bdm_dang_bai', 'NDB00654', 'Tìm hai chữ số để số chia hết đồng thời cho nhiều số', 'P14'],
  ['dai_bdm_dang_bai', 'NDB00655', 'Tìm chữ số * (kèm giải thích): hai dấu *, tích không nhân trực tiếp', 'P14'],
  ['dai_bdm_dang_bai', 'NDB00656', 'Viết các số từ các chữ số cho trước chia hết cho 3, 5, 9', 'P14'],
  ['dai_bdm_nhom', 'NNB01722', 'Viết thêm, xoá, gạch chữ số', 'P16'],
  ['dai_bdm_dang_bai', 'NDB01540', 'Viết thêm chữ số vào bên trái (bên phải) số cho trước', 'P16'],
  ['dai_bdm_nhom', 'NNB01713', 'Thay đổi các thành phần của phép tính', 'P09'],
  ['dai_bdm_nhom', 'NNB01727', 'Bài toán hai tỉ số', 'P24'],
  ['dai_bdm_dang_bai', 'NDB01550', 'Hai tỉ số: tổng không đổi (chuyển giữa các đại lượng)', 'P24'],
  ['dai_bdm_dang_bai', 'NDB01551', 'Hai tỉ số: một đại lượng không đổi (tăng giảm các đại lượng)', 'P24'],
  ['dai_bdm_dang_bai', 'NDB01561', 'So sánh phân số bằng phần bù (mẫu số và tử số hơn kém nhau 1 đơn vị)', 'P28'],
  ['dai_bdm_dang_bai', 'NDB01562', 'So sánh phân số bằng phần bù (hai phân số có cùng hiệu mẫu số và tử số)', 'P28'],
]
const CHUYEN_TUOI = { dang: 'NDB01625', ten: 'Tuổi: hiệu tuổi không đổi', nhomTen: 'Bài toán về tuổi', cd: CD.loivan, ch: 'NCH00515' }
const GOP_TRONG_CAY = { bo: 'NDB01527', ve: 'NDB00649', nhom: 'NNB01716', cau: 'T14T000000035', cuCode: 'T14T070101' }

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
const dem = { chuyen_de: 0, nhom: 0, dang: 0, doi_ten: 0, chuyen: 0 }
const tomTat = {}
let ma = 0
try {
  await db.query('begin')
  const one = async (sql, p) => (await db.query(sql, p)).rows[0]

  const chuyenDe = async (cdId, ch) => {
    if (typeof ch === 'string') return ch
    let id = (await one(`select ch.id from dai_bdm_chuyen_de ch join dai_bdm_o o on o.chuyen_de_id = ch.id where o.chu_de_id = $1 and ch.ten = $2`, [cdId, ch.moi]))?.id
    if (!id) {
      id = (await one(`insert into dai_bdm_chuyen_de (ten) values ($1) returning id`, [ch.moi])).id
      const tt = (await one(`select coalesce(max(thu_tu), 0) + 1 t from dai_bdm_o where chu_de_id = $1`, [cdId])).t
      await db.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values ($1, $2, $3)`, [cdId, id, tt])
      dem.chuyen_de++
    }
    return id
  }
  const nhom = async (cdId, chId, nh) => {
    if (typeof nh === 'string') return nh
    let id = (await one(`select id from dai_bdm_nhom where chu_de_id = $1 and chuyen_de_id = $2 and ten = $3`, [cdId, chId, nh.moi]))?.id
    if (!id) {
      const tt = (await one(`select coalesce(max(thu_tu), 0) + 1 t from dai_bdm_nhom where chu_de_id = $1 and chuyen_de_id = $2`, [cdId, chId])).t
      id = (await one(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values ($1, $2, $3, $4) returning id`, [cdId, chId, nh.moi, tt])).id
      dem.nhom++
    }
    return id
  }
  const themDang = async (pid, nhId, dang) => {
    const co = new Set((await db.query(`select ten from dai_bdm_dang_bai where nhom_id = $1`, [nhId])).rows.map((r) => r.ten.toLowerCase()))
    let tt = (await one(`select coalesce(max(thu_tu), 0) t from dai_bdm_dang_bai where nhom_id = $1`, [nhId])).t
    for (const [ten, mo_ta] of dang) {
      if (co.has(ten.toLowerCase())) continue
      await db.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4)`, [nhId, ten, mo_ta, ++tt])
      co.add(ten.toLowerCase()); dem.dang++; tomTat[pid] = (tomTat[pid] ?? 0) + 1
    }
  }

  // 1) thêm chuyên đề / nhóm / dạng
  const nhomTuoi = {}
  for (const [pid, cdId, ch, nh, dang] of THEM) {
    const chId = await chuyenDe(cdId, ch)
    const nhId = await nhom(cdId, chId, nh)
    if (pid === 'P23') nhomTuoi.id = nhId
    await themDang(pid, nhId, dang)
  }

  // 2) đổi tên (mã giữ nguyên)
  for (const [bang, id, ten] of DOI_TEN) {
    const r = await db.query(`update ${bang} set ten = $2, updated_at = now() where id = $1 and ten is distinct from $2`, [id, ten])
    if (!(await one(`select 1 x from ${bang} where id = $1`, [id]))) throw new Error(`${id} không còn trong ${bang}`)
    dem.doi_ten += r.rowCount
  }

  // 3) P23: NDB01625 chuyển sang nhóm "Bài toán về tuổi" (mã giữ nguyên) + đổi tên; xếp đầu nhóm
  {
    const r = await db.query(`update dai_bdm_dang_bai set nhom_id = $2, ten = $3, thu_tu = 0, updated_at = now() where id = $1 and (nhom_id is distinct from $2 or ten is distinct from $3)`, [CHUYEN_TUOI.dang, nhomTuoi.id, CHUYEN_TUOI.ten])
    dem.chuyen += r.rowCount
  }

  // 4) Đ6 — gộp NDB01527 vào NDB00649
  const g = GOP_TRONG_CAY
  const truoc = {
    de_xuat: +(await one(`select count(*) c from dai_bdm_de_xuat where dang_bai_id = $1`, [g.bo])).c,
    doi_ung: +(await one(`select count(*) c from dai_bdm_doi_ung where dich_dang_bai = $1`, [g.bo])).c,
  }
  await db.query(`update dai_bdm_de_xuat set dang_bai_id = $2 where dang_bai_id = $1 and ma_cau = $3`, [g.bo, g.ve, g.cau])
  await db.query(`update dai_bdm_doi_ung set dich_dang_bai = null, dich_nhom = $2 where dich_dang_bai = $1 and ma_dang_cu = $3`, [g.bo, g.nhom, g.cuCode])
  const fk = (await db.query(`select conrelid::regclass::text t, a.attname c from pg_constraint k join pg_attribute a on a.attrelid = k.conrelid and a.attnum = any(k.conkey) where confrelid = 'dai_bdm_dang_bai'::regclass`)).rows
  const con = []
  for (const { t, c } of fk) { const n = +(await one(`select count(*) c from ${t} where ${c} = $1`, [g.bo])).c; if (n) con.push(`${t}.${c}=${n}`) }
  if (con.length) throw new Error(`NDB01527 còn được trỏ tới: ${con.join(', ')} — DỪNG, không xoá`)
  await db.query(`delete from dai_bdm_dang_bai where id = $1`, [g.bo])

  const tong = (await one(`select count(d.id) d, count(distinct n.id) n from dai_bdm_chu_de cd join dai_bdm_nhom n on n.chu_de_id = cd.id left join dai_bdm_dang_bai d on d.nhom_id = n.id where cd.khoi = '4T' and cd.kho = 'dai'`))
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(dem))
  console.log('dạng mới theo dòng đề xuất:', JSON.stringify(tomTat))
  console.log('Đ6 trước khi gộp:', JSON.stringify(truoc), '· sau gộp: NDB01527 đã xoá, đề xuất câu', g.cau, '→', g.ve)
  console.log('Bản đồ 4T sau:', `${tong.n} nhóm, ${tong.d} dạng`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
