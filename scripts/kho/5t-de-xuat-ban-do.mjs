// 5t-de-xuat-ban-do.mjs — dựng trang HTML ĐỀ XUẤT bản đồ kiến thức 5T (chỉ ĐỌC DB, không ghi gì). Thùy 21/11.
//   node scripts/kho/5t-de-xuat-ban-do.mjs            → docs/de-xuat-5T-ban-do.html + kho-rules/dai/lo/me5-250/ME-gan-dang-so-bo.json
// Nguồn: dai_bdm_* (bản đồ 5T hiện hành) · kho-rules/dai/lo/me5-250/ME-CDxx.json (328 mục sách ME) · 720 câu CLC trong dai_cau_hoi
// (117 câu chưa có dạng được xếp sơ bộ ở CLC_MAP). Mọi "gán" ở đây là SƠ BỘ theo đầu đề — người gán xem lại khi nhập.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import pg from 'pg'

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
await db.query(`set statement_timeout='60s'`)

// ---------------------------------------------------------------- bản đồ hiện hành
const dang = (await db.query(`
 select cd.id cd_id, cd.ten cd_ten, nh.id nh_id, nh.ten nh_ten, d.id, d.ten, d.mo_ta, d.thu_tu,
  (select count(*) from bdm_cau_dang x join dai_cau_hoi q on q.ma_cau=x.ma_cau where x.dang_bai_id=d.id and x.kho='dai' and q.xoa_at is null) n_cau,
  (select count(*) from bdm_cau_dang x join dai_cau_hoi q on q.ma_cau=x.ma_cau where x.dang_bai_id=d.id and x.kho='dai' and q.xoa_at is null and q.ten_de_goc like 'Đề thi vào l%') n_clc,
  (select count(*) from bdm_cau_dang x join dai_cau_hoi q on q.ma_cau=x.ma_cau where x.dang_bai_id=d.id and x.kho='dai' and q.xoa_at is null and q.kho_chuan
     and not (q.noi_dung ~* '[[]\\s*hình' and coalesce(q.anh_de,'')='') and public._bdm_du_dap_an(q.loai_cau,q.dap_an,q.menh_de,q.loi_giai)) dung_duoc
  from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id
  where cd.khoi='5T' order by cd.id, nh.thu_tu, d.thu_tu`)).rows
const clc = (await db.query(`
 select q.ma_cau, left(q.noi_dung,300) nd, q.ten_de_goc, x.dang_bai_id, x.nguon
 from dai_cau_hoi q left join bdm_cau_dang x on x.ma_cau=q.ma_cau and x.kho='dai'
 where q.ma_cau like 'T15T%' and q.xoa_at is null and q.ten_de_goc like 'Đề thi vào l%' order by q.ma_cau`)).rows
await db.end()
const chuaDang = clc.filter((x) => !x.dang_bai_id)
const nChac = clc.filter((x) => x.nguon === 'gan_cau').length
const nDeXuat = clc.filter((x) => x.nguon === 'de_xuat').length

// ---------------------------------------------------------------- dạng MỚI đề xuất (khoá '+…')
const CD_MOI = 'Suy luận – Đếm – Thống kê'
const NEW = {
  '+TH2': { cd: 'Bài toán tỉ số', nhom: 'Tổng – hiệu hai số (nền, chưa có tỉ số)', nhomMoi: true, ten: 'Tổng – hiệu hai số', mo_ta: 'Đề cho tổng và hiệu của hai số (kể cả: hiệu + thương có dư, "gấp lên k lần thì hiệu là…", anh cho em k cái thì hơn nhau…), tìm từng số. Nền cho mọi bài tổng–tỉ về sau.' },
  '+LT': { cd: 'Bài toán tỉ số', nhom: 'Tổng – hiệu hai số (nền, chưa có tỉ số)', ten: 'Số liên tiếp – biết tổng, tìm số', mo_ta: 'Hai/ba số tự nhiên (chẵn, lẻ, tròn chục) liên tiếp biết tổng; "giữa hai số lẻ có k số lẻ khác". Quy về tổng–hiệu.' },
  '+BD': { cd: 'Bài toán tỉ số', nhom: 'Tỉ lệ thuận - Tỉ lệ nghịch', ten: 'Tỉ lệ bản đồ – bóng nắng', mo_ta: 'Đổi khoảng cách / diện tích giữa bản đồ và thực tế (tỉ lệ 1 : n); bóng nắng của cột và cọc cùng lúc (tỉ lệ thuận hình học).' },
  '+DK': { cd: 'Chuyển động', nhom: 'Vận tốc – quãng đường – thời gian', ten: 'Dự định – thực tế (đến sớm / muộn, đổi vận tốc giữa đường)', mo_ta: 'Đi theo dự định rồi thực tế đến sớm / muộn a phút; quay về giữa đường, nghỉ rồi đi tiếp; hai phương án vận tốc.' },
  '+TC': { cd: 'Chuyển động', nhom: 'Vận tốc – quãng đường – thời gian', ten: 'Thi chạy – cùng thời gian, quãng đường tỉ lệ vận tốc', mo_ta: 'Cùng một lúc, người về đích trước hơn người kia a km; ốc sên / rùa–thỏ (bước chân). Cùng thời gian ⇒ quãng đường tỉ lệ thuận với vận tốc.' },
  '+HT': { cd: 'Hình học', nhom: 'Diện tích gián tiếp', ten: 'Hình thang: hai đường chéo cắt nhau', mo_ta: 'Hình thang có hai đường chéo cắt nhau tạo 4 tam giác; tỉ số hai đáy ⇒ tỉ số diện tích các cặp tam giác (chung đáy / chung đường cao).' },
  '+TICH': { cd: 'Cấu tạo số - Số tự nhiên', nhom: 'Số và các chữ số của nó', ten: 'Tìm số khi biết tích (phân tích ra thừa số)', mo_ta: 'Tìm các số liên tiếp có tích cho trước (24 024); tìm a, b khi a×b×(a+b)=30; số có tích các chữ số bằng 7. Phân tích thừa số rồi thử chọn.' },
  '+TANG': { cd: 'Phân số - Số thập phân', nhom: 'Dãy phân số đặc biệt', ten: 'Phân số xếp tầng (tử 1+2+…, mẫu là tổng tích đối xứng)', mo_ta: 'M = [1+(1+2)+(1+2+3)+…] : [1×n+2×(n−1)+…]; tổng các dãy phân số xếp theo tầng 1/2+…+1/20, 2/3+…; đổi cách nhóm rồi rút gọn.' },
  '+LG': { cd: CD_MOI, nhom: 'Lô-gic – suy luận', nhomMoi: true, ten: 'Lô-gic: đúng–sai, xếp hạng, so sánh, hỏi–đáp', mo_ta: 'Dự đoán xếp hạng, "ai nói thật", so sánh cân nặng / chiều cao, đếm theo điều kiện ngồi bàn, mật khẩu — chỉ cần suy luận, không cần công thức.' },
  '+DIR': { cd: CD_MOI, nhom: 'Nguyên lí Dirichlet', nhomMoi: true, ten: 'Lấy ít nhất bao nhiêu để chắc chắn có…', mo_ta: 'Bốc bi / bút không nhìn, tính trường hợp xấu nhất: "ít nhất bao nhiêu để chắc chắn có 2 bi xanh", thử mật mã ít nhất bao nhiêu lần.' },
  '+BB': { cd: CD_MOI, nhom: 'Trò chơi – thao tác lặp – bất biến', nhomMoi: true, ten: 'Thao tác thay số, dồn đống, trò chơi bốc vật', mo_ta: 'Xoá 2 số thay bằng 1 số, dồn hai đống, chuyển bi giữa các hộp, bóng đèn bật–tắt vòng tròn, trò chơi bốc bi hai người (chiến thuật thắng): tìm đại lượng không đổi.' },
  '+LICH': { cd: CD_MOI, nhom: 'Lịch và đồng hồ', nhomMoi: true, ten: 'Thứ – ngày – tháng; kim đồng hồ', mo_ta: '"Ngày 7/5 là thứ Ba, 4 năm sau là thứ mấy"; sinh nhật năm sau là thứ mấy; bây giờ 3 giờ, bao lâu nữa hai kim trùng nhau; đồng hồ điện tử 24 giờ.' },
  '+TK': { cd: CD_MOI, nhom: 'Thống kê – xác suất – đếm theo nhóm', nhomMoi: true, ten: 'Thống kê, xác suất thực nghiệm, đếm theo nhóm giao nhau', mo_ta: 'Gieo xúc xắc / đồng xu rồi tính tỉ số lần; đọc bảng số liệu; "22 bạn thích táo, 23 bạn thích xoài" (đếm hai nhóm giao nhau).' },
  '+CT': { cd: CD_MOI, nhom: 'Cực trị – xếp, ghép', nhomMoi: true, ten: 'Nhiều nhất / ít nhất khi xếp, ghép, chia', mo_ta: '7 que diêm xếp tối đa mấy tam giác; 20 miếng bìa vuông xếp hình chữ nhật chu vi nhỏ nhất; chia 18 lít vào chai nhiều nhất bao nhiêu chai 600 ml.' },
}

// ---------------------------------------------------------------- tra dạng hiện có theo (một phần) tên
const byTen = (s) => {
  const ex = dang.filter((d) => d.ten === s)
  if (ex.length === 1) return ex[0]
  const c = dang.filter((d) => d.ten.includes(s))
  if (c.length !== 1) throw new Error(`Tên dạng "${s}" khớp ${c.length} dạng: ${c.map((x) => x.ten).join(' | ')}`)
  return c[0]
}
const keyOf = (t) => (t.startsWith('+') ? t : byTen(t).id)

// ---------------------------------------------------------------- 328 mục ME → dạng (SƠ BỘ theo đầu đề)
const ME_RAW = {
  1: [['Chuyển chữ số cuối lên đầu', 'V1.1'], ['Thêm/bớt chữ số bên trái', 'V1.2 B1.2 B1.7 B1.8'], ['Thêm/bớt chữ số bên phải', 'B1.1 B1.5 B1.6 B1.16'], ['Thêm chữ số ở hai đầu', 'B1.3 B1.9 B1.10'], ['Số chia cho tổng các chữ số', 'B1.4 B1.13 B1.14 B1.15'], ['Viết thêm chữ số vào giữa', 'B1.11 B1.18'], ['Số gấp k lần tổng', 'B1.12 B1.17 B1.22 B1.23'], ['Đảo thứ tự các chữ số', 'B1.19'], ['abcd + abc + ab + a = N', 'B1.20 B1.21'], ['Có phần thập phân', 'B1.24'], ['Cực trị: thương số ÷ tổng chữ số', 'B1.25 B1.26']],
  2: [['Tìm chữ số thứ k', 'V2.1 B2.9 B2.10 B2.15'], ['Đếm số chữ số của dãy 1 → N', 'V2.2 B2.6 B2.7'], ['Số sau = tổng hai số liền trước', 'B2.1'], ['Số hạng thứ n · số hạng đầu · số hạng cuối', 'B2.2 B2.3 B2.5 B2.14'], ['Số hạng theo số thứ tự', 'B2.4'], ['Biết số chữ số, tìm số trang', 'B2.8'], ['Đếm chữ số loại cụ thể', 'B2.11 B2.17'], ['Đếm số chia hết trong dãy', 'B2.12 B2.13'], ['Tìm số hạng cuối khi biết tổng', 'B2.16'], ['Tìm vị trí xuất hiện của một dãy chữ số', 'B2.18'], ['Chu kỳ lặp (chữ, màu): chia dư', 'B2.19 B2.20'], ['Xếp số vào bảng zigzag', 'B2.21 B2.22']],
  3: [['Kiểm tra phép tính bằng chẵn–lẻ', 'V3.1'], ['Tận cùng của tổng / hiệu / tích', 'V3.2 B3.1'], ['Tận cùng của tổng các tích / giai thừa', 'B3.2 B3.14'], ['+TICH', 'B3.3 B3.15'], ['Đếm số chữ số 0 tận cùng của tích', 'B3.4 B3.7 B3.10'], ['Gạch bớt thừa số để tích tận cùng cho trước', 'B3.5 B3.9'], ['Tìm n để tích 1×2×…×n có đúng k chữ số 0', 'B3.6'], ['Tìm chữ số thoả điều kiện chia hết', 'B3.8'], ['Chứng minh "có hay không tồn tại" bằng chẵn–lẻ', 'B3.11 B3.12 B3.13']],
  4: [['Bài toán cơ bản về tỉ lệ thuận', 'V4.1 B4.1 B4.2 B4.6 B4.8 B4.9 B4.10'], ['Bài toán cơ bản về tỉ lệ nghịch', 'V4.2 B4.17 B4.18'], ['Bài toán tỉ lệ kép', 'B4.3 B4.4 B4.5 B4.12 B4.13 B4.14 B4.15'], ['Bài toán thay đổi số người', 'B4.16 B4.20 B4.21 B4.22 B4.23 B4.25'], ['Dạng biết một phần', 'B4.7'], ['+BD', 'B4.11'], ['Cùng quãng đường: vận tốc ↔ thời gian', 'B4.19'], ['Bài toán công việc chung riêng cơ bản', 'B4.24']],
  5: [['Mẫu sau gấp mẫu trước k lần', 'V5.1 B5.5'], ['Triệt tiêu lẫn nhau', 'V5.2 B5.9 B5.10 B5.11 B5.13'], ['Cộng trừ nhiều phân số', 'B5.1'], ['Tính thuận tiện', 'B5.2'], ['Tích phân số có tử/mẫu lặp', 'B5.3'], ['Tìm y có phân số', 'B5.4 B5.6 B5.7'], ['So sánh gián tiếp', 'B5.8'], ['+TANG', 'B5.12 B5.14 B5.15']],
  6: [['Chữ số được lặp lại', 'V6.1 B6.2'], ['Chữ số phải khác nhau', 'V6.2 B6.1'], ['Tổng tất cả các số lập được', 'B6.3 B6.4 B6.9 B6.10 B6.20'], ['Đếm theo điều kiện', 'B6.5 B6.6 B6.7 B6.8 B6.11 B6.12 B6.13 B6.14 B6.15 B6.16 B6.17 B6.18 B6.19'], ['Bài bắt tay / số trận đấu vòng tròn', 'B6.21 B6.22 B6.23'], ['Đếm cách xếp / tô màu / đường đi', 'B6.24 B6.25 B6.26']],
  7: [['Bài toán tìm phân số của một số', ''], ['Bài toán tìm một số khi biết phân số của nó - Bài toán phần còn lại', 'V7.1 B7.3 B7.4 B7.5 B7.6 B7.22'], ['Dạng biết tổng hiệu các phần', 'V7.2 B7.1'], ['Dạng biết một phần', 'B7.2'], ['Tổng tuổi / tỉ số tuổi ở hai thời điểm', 'V7.3 B7.16 B7.18'], ['Bài toán 3 đại lượng có tỉ số đôi một', 'B7.7 B7.8 B7.9 B7.10'], ['Dạng tổng không đổi', 'B7.12 B7.13 B7.14'], ['Dạng hiệu không đổi', 'B7.15 B7.17'], ['Dạng một đại lượng không đổi', 'B7.11 B7.19 B7.20 B7.21 B7.23 B7.24']],
  8: [['Bài toán tổng tỉ - hiệu tỉ cơ bản', 'V8.1 V8.2 B8.5 B8.6 B8.8'], ['Bài toán tổng tỉ có sự thay đổi', 'B8.1 B8.11'], ['Dạng tổng không đổi', 'B8.2 B8.3 B8.4 B8.7 B8.19 B8.20'], ['Dạng một đại lượng không đổi', 'B8.15 B8.17'], ['Bài toán 3 đại lượng có tỉ số đôi một', 'B8.9 B8.13'], ['Bài toán 3 đại lượng có dãy tỉ số', 'B8.10'], ['Bài bài toán cơ bản về tỉ lệ nghịch', 'B8.12'], ['Các bài toán tổng hợp', 'B8.16 B8.18'], ['CHUA', 'B8.14']],
  9: [['Bài toán tính thuận tiện với số thập phân', 'V9.1 B9.1'], ['Bài toán tìm x với số thập phân', 'B9.2'], ['Bài toán lời văn liên quan số thập phân', 'V9.2 B9.3 B9.4 B9.5 B9.6 B9.7 B9.8 B9.9 B9.10 B9.11 B9.12 B9.13'], ['Bài toán tính biểu thức hỗn hợp chưa số thập phân', 'B9.14 B9.15'], ['Một số bài toán nâng cao liên quan đến cấu tạo số thập phân', 'B9.16 B9.17 B9.18 B9.19 B9.20 B9.21 B9.22']],
  10: [['Pha loãng / cô đặc', 'V10.1 B10.7 B10.8 B10.11'], ['Bài toán cơ bản về bán hàng', 'V10.2 B10.3 B10.12 B10.14'], ['Bài toán giảm giá', 'B10.1 B10.13'], ['Tìm một số khi biết phần trăm của nó', 'B10.2 B10.4 B10.5 B10.6'], ['Hạt tươi – hạt khô', 'B10.9 B10.10'], ['Tăng / giảm liên tiếp một đại lượng', 'B10.15 B10.17'], ['Bài toán về diện tích', 'B10.16'], ['Bài toán cho số liệu theo giá bán', 'B10.18'], ['Tìm phần trăm của một số', 'B10.19 B10.20']],
  11: [['Trung điểm / điểm chia cạnh theo tỉ số', 'V11.1 V11.2 V11.3 B11.3 B11.22'], ['Suy ngược đáy / chiều cao từ diện tích', 'B11.1 B11.2'], ['Hai đoạn nối đỉnh cắt nhau trong tam giác', 'B11.4 B11.15 B11.16 B11.17 B11.23'], ['Tính diện tích tam giác dùng tỉ lệ cạnh', 'B11.5'], ['Quy về phần bằng nhau bằng sơ đồ phần', 'B11.6 B11.10 B11.11 B11.14'], ['+HT', 'B11.7 B11.8 B11.9 B11.20 B11.21'], ['Tính diện tích tam giác dùng tỉ lệ đường cao', 'B11.12'], ['Chia hình thành các miếng ghép', 'B11.13 B11.18 B11.19']],
  12: [['Hình vành khăn', 'V12.1'], ['Tính S, V; tìm kích thước ngược lại', 'V12.2 B12.14 B12.16'], ['Đếm khối được sơn 0 / 1 / 2 / 3 mặt', 'V12.3 B12.18 B12.19'], ['Hình hoa, cắt ghép, nửa/một phần tư hình tròn', 'B12.1 B12.3 B12.5 B12.6 B12.7 B12.8 B12.9'], ['Hình vuông nội/ngoại tiếp hình tròn', 'B12.2 B12.4'], ['Chu vi nhiều hình tròn chia từ đường kính', 'B12.10'], ['Hộp từ tấm bìa', 'B12.11'], ['Nước tràn / vật chìm / mực nước', 'B12.12'], ['Xếp xen kẽ màu, xếp theo lớp / bậc thang', 'B12.13 B12.15'], ['Ghép khối từ hộp: cạnh khối lớn nhất', 'B12.17 B12.20']],
  13: [['Tìm quãng đường / thời gian gặp', 'V13.1 B13.14 B13.18 B13.19'], ['Cùng quãng đường: vận tốc ↔ thời gian', 'V13.2'], ['+DK', 'B13.1 B13.6 B13.15'], ['Công thức s = v × t, đổi đơn vị', 'B13.2'], ['+TC', 'B13.3 B13.7 B13.16'], ['Vận tốc trung bình', 'B13.4'], ['Đuổi kịp', 'B13.5 B13.20'], ['Xuất phát lệch giờ', 'B13.8 B13.9 B13.13'], ['Hai xe cùng/ngược chiều trên đường tròn', 'B13.10 B13.11 B13.12'], ['Xuôi dòng – ngược dòng', 'B13.17']],
  14: [['Quan hệ của một số với trung bình cộng', 'B14.1 B14.8'], ['Đếm khối được sơn 0 / 1 / 2 / 3 mặt', 'B14.2'], ['CHUA', 'B14.3 B14.11'], ['Chia hình thành các miếng ghép', 'B14.4'], ['Hình vuông nội/ngoại tiếp hình tròn', 'B14.5'], ['Hiệu tuổi không đổi', 'B14.6'], ['Bài bắt tay / số trận đấu vòng tròn', 'B14.7'], ['Bài toán trộn A và B để tìm hỗn hợp', 'B14.9'], ['+BB', 'B14.10 B14.13 B14.14'], ['Chứng minh "có hay không tồn tại" bằng chẵn–lẻ', 'B14.15'], ['+LG', 'B14.16 B14.18'], ['Trung điểm / điểm chia cạnh theo tỉ số', 'B14.17'], ['Tổng tất cả các số lập được', 'B14.19'], ['+HT', 'B14.20'], ['Xuất phát lệch giờ', 'B14.21'], ['Xếp số vào bảng zigzag', 'B14.12']],
}
// CĐ7 / CĐ8 dùng chung tên dạng "Hai tỉ số" — chỉ định rõ:
const HAI_TI = { 'Dạng tổng không đổi': 'Bài toán Hai tỉ số - Dạng tổng không đổi', 'Dạng hiệu không đổi': 'Bài toán Hai tỉ số - Dạng hiệu không đổi', 'Dạng một đại lượng không đổi': 'Bài toán Hai tỉ số - Dạng một đại lượng không đổi', 'Dạng biết tổng hiệu các phần': 'Bài toán tìm một số khi biết phân số của nó - Dạng biết tổng hiệu các phần', 'Dạng biết một phần': 'Bài toán tìm một số khi biết phân số của nó - Dạng biết một phần', 'Bài bài toán cơ bản về tỉ lệ nghịch': 'Bài toán cơ bản về tỉ lệ nghịch' }

const meDS = []
for (let cdn = 1; cdn <= 14; cdn++) {
  const f = join(GOC, 'kho-rules/dai/lo/me5-250', `ME-CD${String(cdn).padStart(2, '0')}.json`)
  const j = JSON.parse(readFileSync(f, 'utf8'))
  const gan = {}
  for (const [dich, ds] of ME_RAW[cdn]) for (const m of ds.split(/\s+/).filter(Boolean)) {
    const ma = (m[0] === 'V' ? 'VD ' : 'BT ') + m.slice(1)
    if (gan[ma]) throw new Error('trùng ' + ma)
    gan[ma] = dich
  }
  for (const x of j) {
    const d = gan[x.ma]
    if (!d) throw new Error('ME chưa gán: ' + x.ma)
    const t = d === 'CHUA' ? null : HAI_TI[d] ?? d
    meDS.push({ ma: x.ma, cd: cdn, nd: x.noi_dung.replace(/\s+/g, ' ').slice(0, 160), chua_chac: !!x.chua_chac, co_hinh: !!x.co_hinh, dang: t ? keyOf(t) : null })
  }
}
if (meDS.length !== 328) throw new Error('ME ' + meDS.length)

// ---------------------------------------------------------------- 117 câu CLC chưa dạng → dạng (SƠ BỘ)
const CLC_RAW = [
  ['+LG', '001430 001523 001350 001321 001762 001768 001348'], ['+DIR', '001273 001289 001335 001362'], ['+BB', '001367 001543 001473 001553 001751 001477'],
  ['+LICH', '001052 001199 001319 001602 001712 001375 001724'], ['+TK', '001325 001585 001668 001591 001468 001596 001172'], ['+CT', '001750 001632 001291 001142 001376'],
  ['+TH2', '001198 001228 001445 001448 001455 001482 001704 001188'], ['+LT', '001259 001399 001450 001639'], ['+BD', '001118 001277 001441 001583'],
  ['+DK', '001279 001519'], ['+TC', '001725'], ['+TICH', '001580 001711'], ['+TANG', '001337'],
  ['Hình chữ nhật, vuông, bình hành, thoi', '001057 001190 001425 001730 001592'], ['Tính S, V; tìm kích thước ngược lại', '001065 001690'], ['Hộp từ tấm bìa', '001761'],
  ['Chu vi, diện tích, tìm bán kính từ chu vi', '001120'], ['Chia hình thành các miếng ghép', '001059'], ['So sánh phân số', '001056'], ['Tìm y có phân số', '001202'],
  ['Số hạng theo số thứ tự', '001220 001251 001266 001737'], ['Số lớn nhất / nhỏ nhất / lẻ lớn nhất lập được', '001116 001152'], ['Nhận biết số chia hết cho 2, 3, 5, 9', '001107'],
  ['Đếm cách xếp / tô màu / đường đi', '001096'], ['Chia có dư: tìm số dư / số chia / số bị chia', '001559'], ['Đảo thứ tự các chữ số', '001749'], ['Số gấp k lần tổng', '001736'],
  ['Một số bài toán nâng cao liên quan đến cấu tạo số thập phân', '001726'], ['Giả sử tất cả là một loại', '001104'], ['Bài toán tổng tỉ có sự thay đổi', '001740 001550'],
  ['Bài toán tổng tỉ - hiệu tỉ cơ bản', '001563 001593'], ['Bài toán Hai tỉ số - Dạng một đại lượng không đổi', '001623'], ['Tuổi và phân số', '001624 001727'],
  ['Bài toán Hai tỉ số - Dạng tổng không đổi', '001642 001597'], ['Bài toán tìm một số khi biết phân số của nó - Dạng biết tổng hiệu các phần', '001722'],
  ['Bài toán 3 đại lượng có tỉ số đôi một', '001373'], ['Tính tỉ số % của hai đại lượng', '001618'], ['Bài toán cơ bản về bán hàng', '001329'], ['Bài toán cho số liệu theo giá bán', '001741'],
  ['Bài toán cơ bản về tỉ lệ thuận', '001546'], ['Bài toán tìm x với số thập phân', '001352'], ['Công thức s = v × t, đổi đơn vị', '001320'], ['Vận tốc trung bình', '001571'],
  ['Chứng minh "có hay không tồn tại" bằng chẵn–lẻ', '001431'],
  ['CHUA', '001050 001432 001090 001125 001208 001263 001341 001340 001361 001444 001475 001478 001480 001753 001524'],
]
const clcGan = {}
for (const [dich, ds] of CLC_RAW) for (const s of ds.split(/\s+/)) { if (clcGan[s]) throw new Error('CLC trùng ' + s); clcGan[s] = dich === 'CHUA' ? null : keyOf(dich) }
const clcCho = []
for (const q of chuaDang) {
  const s = q.ma_cau.slice(-6)
  if (!(s in clcGan)) { clcCho.push(s); continue }
  q.dang = clcGan[s]
}
if (clcCho.length) throw new Error('CLC chưa xếp: ' + clcCho.join(','))
if (chuaDang.length !== 117) console.warn('Cảnh báo: số câu CLC chưa dạng =', chuaDang.length)

// ---------------------------------------------------------------- tổng hợp theo dạng
const dangById = Object.fromEntries(dang.map((d) => [d.id, d]))
const cnt = {} // key → {me, meCC, meHinh, clc}
const get = (k) => (cnt[k] ??= { me: 0, meCC: 0, meHinh: 0, clc: 0, meMa: [], clcMa: [] })
for (const m of meDS) if (m.dang) { const c = get(m.dang); c.me++; c.meMa.push(m.ma.replace('VD ', 'VD').replace('BT ', 'BT')); if (m.chua_chac) c.meCC++; if (m.co_hinh) c.meHinh++ }
for (const q of chuaDang) if (q.dang) { const c = get(q.dang); c.clc++; c.clcMa.push(q.ma_cau.slice(-6)) }
const meLe = meDS.filter((m) => !m.dang)
const clcLe = chuaDang.filter((q) => !q.dang)
writeFileSync(join(GOC, 'kho-rules/dai/lo/me5-250/ME-gan-dang-so-bo.json'), JSON.stringify({
  ghi_chu: 'Gán SƠ BỘ theo đầu đề (21/11, phiên 5T) — ĐỀ XUẤT, chưa phải quyết định; khoá "+XXX" = dạng MỚI chưa có trong bản đồ, chờ Thùy gật. Người gán xem lại khi nhập.',
  dang_moi: NEW, me: meDS.map((m) => ({ ma: m.ma, dang: m.dang && !m.dang.startsWith('+') ? dangById[m.dang].ten : m.dang, dang_id: m.dang && !m.dang.startsWith('+') ? m.dang : null })),
  clc_chua_dang: chuaDang.map((q) => ({ ma_cau: q.ma_cau, dang: q.dang && !q.dang.startsWith('+') ? dangById[q.dang].ten : q.dang, dang_id: q.dang && !q.dang.startsWith('+') ? q.dang : null })),
}, null, 1))

// ---------------------------------------------------------------- đo "dưới 30" (cùng cách do-dang-du-cau)
const duoi30 = dang.filter((d) => +d.dung_duoc < 30).length
const rong = dang.filter((d) => +d.n_cau === 0).length

// ---------------------------------------------------------------- HTML
const E = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const chuDe = []
for (const d of dang) { let c = chuDe.find((x) => x.id === d.cd_id); if (!c) chuDe.push((c = { id: d.cd_id, ten: d.cd_ten, nhom: [] })); let n = c.nhom.find((x) => x.id === d.nh_id); if (!n) c.nhom.push((n = { id: d.nh_id, ten: d.nh_ten, ds: [] })); n.ds.push(d) }
const ME_CD = [
  [1, 'Bài toán cấu tạo số', 'Cấu tạo số – Số tự nhiên', 'Khớp: Thêm–bớt chữ số · Đổi chỗ chữ số · Số và các chữ số · Tổng các số cấu tạo. Sách giải bằng đặt số bằng chữ (abc) rồi lập đẳng thức — 5T giữ luật riêng (phân tích theo hàng).'],
  [2, 'Dãy số', 'Cấu tạo số – Số tự nhiên', 'Khớp: Dãy cách đều · Đếm chữ số · Chữ số thứ k · Dãy có quy luật · Dãy tuần hoàn–xếp bảng.'],
  [3, 'Chẵn lẻ. Chữ số tận cùng', 'Cấu tạo số – Số tự nhiên', 'Khớp: Chữ số tận cùng · Chữ số 0 tận cùng · Chẵn–lẻ. Thiếu: tìm số khi biết tích (Đ7).'],
  [4, 'Tỉ lệ thuận – tỉ lệ nghịch', 'Bài toán tỉ số', 'Khớp: Tỉ lệ thuận/nghịch · Tỉ lệ kép · Thay đổi số người. Thiếu: bản đồ – bóng nắng (Đ3).'],
  [5, 'Phép toán phân số – Dãy phân số đặc biệt', 'Phân số – Số thập phân', 'Khớp: Dãy phân số đặc biệt · Phép tính cơ bản. Thiếu: phân số xếp tầng (Đ8).'],
  [6, 'Lập số và quy tắc đếm', 'Cấu tạo số – Số tự nhiên', 'Khớp: Đếm số lập được · Tổng các số lập được · Bắt tay và đếm cách.'],
  [7, 'Các bài toán liên quan đến tỉ số', 'Bài toán tỉ số', 'Khớp: Phân số của số · Phần còn lại · Hai tỉ số · Tuổi · 3 đại lượng.'],
  [8, 'Tổng – tỉ, hiệu – tỉ', 'Bài toán tỉ số', 'Khớp: Tổng–hiệu tỉ cơ bản/thay đổi · Hai tỉ số · 3 đại lượng. 1 bài (8.14) chưa có chỗ.'],
  [9, 'Số thập phân', 'Phân số – Số thập phân', 'Khớp: nhóm Bài toán về số thập phân (dịch dấu phẩy → lời văn theo spec-5t-phan-dang §1).'],
  [10, 'Tỉ số phần trăm', 'Bài toán tỉ số', 'Khớp: Phép toán %, Bán hàng, Hỗn hợp, Tăng giảm liên tiếp.'],
  [11, 'Diện tích tam giác – hình thang', 'Hình học', 'Khớp: Hai tam giác chung đáy · Diện tích gián tiếp. Thiếu: hình thang hai đường chéo (Đ6).'],
  [12, 'Hình tròn và hình khối hộp', 'Hình học', 'Khớp toàn bộ: Chu vi–diện tích hình tròn · Phần tô đậm · S, V · Xếp khối sơn mặt.'],
  [13, 'Toán chuyển động', 'Chuyển động', 'Khớp phần lớn. Thiếu: dự định–thực tế (Đ4), thi chạy (Đ5).'],
  [14, 'Chọn lọc tổng hợp', 'rải nhiều chủ đề', 'Trộn: TBC, hình khối, tuổi, bắt tay… và 9 bài suy luận / trò chơi / bất biến / ma phương → chuyên đề mới (Đ9, Đ11) hoặc để lẻ.'],
]
const CHUYEN = { 1: 'Cấu tạo số', 2: 'Dãy số', 3: 'Chia hết - Chẵn lẻ - Chữ số tận cùng', 4: 'Các bài toán logic thường gặp (nhóm Tỉ lệ thuận - nghịch)', 5: 'Phân số', 6: 'Lập số và quy tắc đếm', 7: 'Các bài toán về tỉ số', 8: 'Các bài toán về tỉ số', 9: 'Số thập phân', 10: 'Tỉ số phầm trăm', 11: 'Tam giác và hình thang', 12: 'Hình tròn + Hình hộp chữ nhật và hình lập phương', 13: 'Chuyển động đều + Hai chuyển động (+ Chuyển động đặc biệt)', 14: 'rải nhiều chuyên đề' }
const meSoCD = (n) => meDS.filter((m) => m.cd === n)

let h = ''
const row = (cls, cells) => `<tr class="${cls}">${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`
const sel = (id) => `<select data-id="${id}"><option value="">—</option><option value="gat">Gật</option><option value="sua">Gật có sửa</option><option value="khong">Không</option></select> <input type="text" data-note="${id}" placeholder="ghi chú" size="14">`

// --- đề xuất: bảng các dạng mới
const nhomMoi = []
for (const [k, v] of Object.entries(NEW)) { const c = get(k); v.k = k; v.me = c.me; v.clc = c.clc; v.meMa = c.meMa; v.clcMa = c.clcMa; v.meCC = c.meCC; v.meHinh = c.meHinh; nhomMoi.push(v) }
let tDx = ''
let idx = 0
const theoCD = {}
for (const v of nhomMoi) (theoCD[v.cd] ??= []).push(v)
for (const [cd, ds] of Object.entries(theoCD)) {
  tDx += `<tr><th colspan="7">${E(cd)}${cd === CD_MOI ? ' <span class="tag t-ask">CHUYÊN ĐỀ MỚI trong chủ đề "Cấu tạo số - Số tự nhiên" — đề xuất; chủ đề giữ nguyên</span>' : ' <span class="mut">(chủ đề đã có)</span>'}</th></tr>`
  for (const v of ds) {
    idx++
    const tong = v.me + v.clc
    const duoi = tong < 5 ? ' <span class="tag t-chg">dưới 5 bài</span>' : ''
    tDx += row('add', [`<b>Đ${idx}</b>`, `${v.nhomMoi ? '<span class="tag t-add">NHÓM MỚI</span> ' : nhomMoi.some((u) => u.nhomMoi && u.nhom === v.nhom) ? 'cùng nhóm mới: ' : 'nhóm có sẵn: '}${E(v.nhom)}<br><b>${E(v.ten)}</b>${duoi}`, E(v.mo_ta), `${v.me}${v.meCC ? ` <span class="mut small">(${v.meCC} chưa chắc)</span>` : ''}<br><span class="mut small">${E(v.meMa.join(', '))}</span>`, `${v.clc}<br><span class="mut small">${E(v.clcMa.join(', '))}</span>`, `<b>${tong}</b>`, sel('Đ' + idx)])
    v.dx = 'Đ' + idx
  }
}

// --- thêm: sửa nhẹ & giữ (dạng đã có nhưng nên cân nhắc)
const SUA = [
  ['Phép toán với tỉ số phầm trăm', 'nhóm', 'Sửa chính tả: "phầm" → "phần trăm".'],
  ['Bài toán tính biểu thức hỗn hợp chưa số thập phân', 'dạng', 'Sửa chính tả: "chưa" → "chứa" (đề xuất tên: "Bài toán tính biểu thức hỗn hợp chứa số thập phân").'],
  ['Bài toán đổi tên "Hiệu tuổi không đổi"', 'dạng', 'Không đổi — ghi ra vì ME CĐ7 (Bài 7.16, 7.18) và CLC có bài tuổi theo TỈ SỐ ở hai thời điểm; đã có dạng "Tổng tuổi / tỉ số tuổi ở hai thời điểm" nhận được.'],
]
const dsKhongDoi = dang.filter((d) => +d.n_cau === 0)

// --- bảng hiện trạng theo chủ đề
let tHT = ''
for (const c of chuDe) {
  const ds = c.nhom.flatMap((n) => n.ds)
  tHT += row('', [E(c.ten), c.nhom.length, ds.length, ds.reduce((a, d) => a + +d.n_cau, 0), ds.filter((d) => +d.dung_duoc < 30).length, ds.filter((d) => +d.n_cau === 0).length])
}

// --- bảng ME ↔ bản đồ
let tME = ''
for (const [n, ten, cd, note] of ME_CD) {
  const xs = meSoCD(n)
  tME += row('', [`CĐ${n}`, E(ten), xs.length, `${xs.filter((m) => m.chua_chac).length} / ${xs.filter((m) => m.co_hinh).length}`, E(CHUYEN[n]), E(note)])
}

// --- 117 câu CLC chưa dạng, theo dạng đề xuất
const clcTheoDang = {}
for (const q of chuaDang) (clcTheoDang[q.dang ?? 'LE'] ??= []).push(q)
let tClc = ''
const tenDang = (k) => (k === 'LE' ? 'Chưa có chỗ — để dạng chờ' : k.startsWith('+') ? `<span class="tag t-add">MỚI</span> ${E(NEW[k].ten)} <span class="mut small">(${NEW[k].dx})</span>` : E(dangById[k].ten))
const thuTu = Object.keys(clcTheoDang).sort((a, b) => (a.startsWith('+') ? 0 : a === 'LE' ? 2 : 1) - (b.startsWith('+') ? 0 : b === 'LE' ? 2 : 1) || clcTheoDang[b].length - clcTheoDang[a].length)
for (const k of thuTu) tClc += row(k.startsWith('+') ? 'add' : k === 'LE' ? 'del' : 'chg', [tenDang(k), clcTheoDang[k].length, `<span class="small mut">${clcTheoDang[k].map((q) => q.ma_cau.slice(-6)).join(', ')}</span>`])
const clcMoi = chuaDang.filter((q) => q.dang?.startsWith('+')).length
const clcCu = chuaDang.filter((q) => q.dang && !q.dang.startsWith('+')).length

// --- bản đồ đầy đủ (đối chiếu)
let tBD = ''
for (const c of chuDe) {
  tBD += `<details><summary><b>${E(c.ten)}</b> — ${c.nhom.length} nhóm · ${c.nhom.flatMap((n) => n.ds).length} dạng</summary><table><tr><th>Nhóm</th><th>Dạng</th><th>Mô tả (đã có)</th><th>Câu dùng được<br><span class="mut small">hiện</span></th><th>ME<br><span class="mut small">gán sơ bộ</span></th><th>CLC<br><span class="mut small">cũ + mới</span></th></tr>`
  for (const n of c.nhom) for (const [i, d] of n.ds.entries()) {
    const cc = cnt[d.id] ?? { me: 0, clc: 0, meMa: [], meCC: 0, meHinh: 0 }
    tBD += `<tr class="${+d.dung_duoc < 30 ? '' : ''}">${i === 0 ? `<td rowspan="${n.ds.length}"><b>${E(n.ten)}</b></td>` : ''}<td>${E(d.ten)}</td><td class="small mut">${E((d.mo_ta ?? '').slice(0, 170))}</td><td>${d.dung_duoc}<span class="mut small"> / ${d.n_cau}</span></td><td>${cc.me || ''}${cc.meCC ? `<span class="mut small"> (${cc.meCC}?)</span>` : ''}${cc.meHinh ? `<span class="mut small"> (${cc.meHinh} hình)</span>` : ''}</td><td>${d.n_clc}${cc.clc ? ` <b>+${cc.clc}</b>` : ''}</td></tr>`
  }
  tBD += '</table></details>'
}

const meTrong = meDS.filter((m) => m.dang && !m.dang.startsWith('+')).length
const meMoi = meDS.filter((m) => m.dang?.startsWith('+')).length
const ngay = '21/11/2026'

h = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>5T – đề xuất bản đồ kiến thức (đối chiếu sách ME + đề CLC)</title>
<style>
:root{--bg:#f7f8fa;--card:#fff;--ink:#1c2430;--mut:#5d6b7c;--line:#dfe4ea;--acc:#1f7a4d;--add:#e8f6ee;--chg:#fff6e0;--del:#fde9e9;--ask:#e9f0fd}
@media (prefers-color-scheme:dark){:root{--bg:#12161b;--card:#1a2027;--ink:#e6ebf1;--mut:#94a1b2;--line:#2b3440;--acc:#5fd09a;--add:#16301f;--chg:#35290f;--del:#3a1b1b;--ask:#16253f}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:1180px;margin:0 auto;padding:20px 16px 90px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:18px;margin:34px 0 8px;border-bottom:2px solid var(--acc);padding-bottom:4px}h3{font-size:15px;margin:18px 0 6px}
.sub{color:var(--mut);margin:0 0 14px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:10px 0}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:14px;margin:6px 0}th,td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}th{background:var(--bg)}
.tag{display:inline-block;border-radius:4px;padding:0 6px;font-size:12px;font-weight:600}.t-add{background:var(--add)}.t-chg{background:var(--chg)}.t-del{background:var(--del)}.t-ask{background:var(--ask)}
tr.add td:first-child{border-left:4px solid #2a9d63}tr.chg td:first-child{border-left:4px solid #d9a21b}tr.del td:first-child{border-left:4px solid #d64545}
.mut{color:var(--mut)}.small{font-size:13px}details{margin:8px 0}summary{cursor:pointer;padding:6px 0}
select,input[type=text]{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 6px}
button{font:inherit;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}
#bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:8px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
ul{margin:4px 0 4px 20px;padding:0}.big{font-size:17px}
@media (max-width:720px){table{font-size:13px}}
</style></head><body><main>
<h1>Khối 5T — đề xuất bản đồ kiến thức (đối chiếu sách ME + đề CLC)</h1>
<p class="sub">Soạn ${ngay} · <b>ĐỀ XUẤT để Thùy xem và gật</b>. <b>Chưa ghi gì vào bản đồ DB</b>, chưa nhập câu nào. Mọi chỗ ghi <span class="tag t-add">MỚI</span> / "đề xuất" là chưa phải quyết định; các dạng đang có câu KHÔNG bị đổi/xoá/gộp khi chưa gật (Luật xoá).</p>

<h2>0. Tóm tắt — Thùy cần quyết gì</h2>
<div class="card big">
<ol>
<li><b>Bản đồ 5T hiện có đủ dùng cho phần lớn tài liệu:</b> ${meTrong}/328 mục sách ME và ${clcCu}/117 câu CLC chưa dạng xếp được vào dạng ĐÃ CÓ (xếp sơ bộ theo đầu đề, dạng nào cũng ghi rõ ở bảng 5).</li>
<li><b>Thiếu ${nhomMoi.length} dạng mới</b> (gom ${meMoi} mục ME + ${clcMoi} câu CLC): ${nhomMoi.filter((v) => v.cd !== CD_MOI).length} dạng thêm vào chuyên đề/nhóm đã có và <b>1 chuyên đề mới "${CD_MOI}"</b> trong chủ đề "Cấu tạo số - Số tự nhiên" (${nhomMoi.filter((v) => v.cd === CD_MOI).length} dạng, 6 nhóm). <b>Không thêm / đổi chủ đề nào</b> — bảng 4, chọn từng dòng.</li>
<li>Còn <b>${meLe.length} mục ME + ${clcLe.length} câu CLC</b> chưa có chỗ và chưa đủ số để lập dạng: để "dạng chờ", xem bảng 3.</li>
<li>Sau khi Thùy gật → phiên này mới ghi bản đồ (nhóm/dạng mới) rồi nhập sách ME + gán dạng CLC (bước 2). Dừng ở đây chờ Thùy.</li>
</ol></div>

<h2>1. Bản đồ 5T hiện hành</h2>
<p>Dựng 13/11 từ "Tài liệu tham khảo Toán 5" (bảng gốc ghi 5 chủ đề / 158 dạng; đo lại hôm nay ra <b>${dang.length} dạng</b> — 2 dạng tên có dấu ngoặc kép bị đếm sót ở bản đo cũ). Đo độ đầy 21/11: <b>${duoi30}/${dang.length} dạng dưới 30 câu dùng được</b>, ${rong} dạng chưa có câu nào.</p>
<table><tr><th>Chủ đề</th><th>Nhóm</th><th>Dạng</th><th>Câu gán dạng</th><th>Dưới 30 câu dùng được</th><th>Dạng rỗng</th></tr>${tHT}</table>

<h2>2. Sách ME "250+ Bài toán chọn lọc lớp 5" (14 chuyên đề, 328 mục) ↔ bản đồ</h2>
<p>Đã bóc đủ 328 mục (29 ví dụ + 299 bài tập) ở <code>kho-rules/dai/lo/me5-250/ME-CDxx.json</code>. Cột "chưa chắc / hình" = số mục người phải xem ảnh trang trước khi nhập (tổng 48 chưa chắc, 35 có hình). Bản gán sơ bộ từng mục: <code>kho-rules/dai/lo/me5-250/ME-gan-dang-so-bo.json</code>.</p>
<table><tr><th>CĐ</th><th>Tên chuyên đề</th><th>Mục</th><th>Chưa chắc / hình</th><th>Chuyên đề bản đồ khớp</th><th>Đối chiếu</th></tr>${tME}</table>
<div class="card">Nhận xét: sách ME đi <b>rất sát</b> bản đồ 5T hiện có (14 chuyên đề của sách ↔ 17 chuyên đề của bản đồ: sách nằm ở TẦNG CHUYÊN ĐỀ, không phải tầng chủ đề; CĐ7 + CĐ8 cùng về chuyên đề "Các bài toán về tỉ số", CĐ12 chia hai chuyên đề Hình tròn / Hình hộp). Phần lệch chỉ là: (a) vài kiểu bài chưa có dạng riêng (hình thang 2 đường chéo, bản đồ, dự định–thực tế, thi chạy, phân số xếp tầng, tìm số khi biết tích); (b) <b>CĐ14</b> trộn nhiều bài suy luận / trò chơi / bất biến / ma phương không thuộc chủ đề nào.</div>

<h2>3. Đề CLC: 720 câu đã ghi — 117 câu chưa có dạng</h2>
<p>720 câu = ${nChac} gán chắc (+71 gán chắc nhưng chưa duyệt) · ${nDeXuat} đề xuất chờ duyệt · ${chuaDang.length} chưa có dạng. Cột phải là cách <b>xếp sơ bộ ${chuaDang.length} câu chưa dạng</b> vào bản đồ (mã = 6 số cuối <code>ma_cau T15T…</code>). Chỉ ${clcMoi} câu cần dạng MỚI; ${clcCu} câu vốn khớp dạng đã có nhưng bộ gán tự động không đủ chắc; ${clcLe.length} câu lẻ.</p>
<table><tr><th>Dạng (xếp sơ bộ)</th><th>Số câu</th><th>Mã câu</th></tr>${tClc}</table>
<p class="mut small">Lưu ý: "Chưa có chỗ" gồm các bài như xoá bớt chữ số (2 câu), chọn bao/giỏ có tổng chia hết (2), liên phân số, bậc thang/trồng cây, chia chặng đường chạy, quy đổi vật (bò–ngựa–thỏ), chia tiền liên hoan… mỗi kiểu ≤ 2 bài — chưa đủ lập dạng (ngưỡng spec: ≥ 5 câu không vào dạng nào).</p>

<h2>4. Đề xuất thay đổi bản đồ — chọn từng dòng</h2>
<p>Ngưỡng của spec là ≥ 5 bài không vào dạng nào. Dòng nào dưới 5 được đánh dấu <span class="tag t-chg">dưới 5 bài</span> — vẫn đề xuất vì kiểu bài này hay ra ở đề CLC và sẽ cần clone để đủ 30 câu, nhưng Thùy có thể cho "Không" (khi đó các bài đó để dạng chờ).</p>
<table><tr><th>#</th><th>Nhóm / dạng đề xuất</th><th>Mô tả ngắn</th><th>Sách ME (bài)</th><th>Đề CLC (câu)</th><th>Tổng</th><th>Quyết định</th></tr>${tDx}</table>

<h3>4b. Đề xuất nhỏ — không đụng dạng đang có câu</h3>
<table><tr><th>Mục</th><th>Loại</th><th>Đề xuất</th><th>Quyết định</th></tr>
${row('chg', ['Phép toán với tỉ số phầm trăm', 'nhóm', 'Sửa chính tả "phầm" → "phần trăm" (đổi tên, giữ nguyên id/câu).', sel('S1')])}
${row('chg', ['Bài toán tính biểu thức hỗn hợp chưa số thập phân', 'dạng', 'Sửa chính tả "chưa" → "chứa".', sel('S2')])}
${row('chg', ['Bài toán tìm một số khi biết phân số của nó - Dạng biết tổng hiệu các phần', 'dạng', 'Tên dài, giữ nguyên (chỉ ghi nhận: có 3 dạng cùng tiền tố "Bài toán tìm một số khi biết phân số của nó"; không gộp).', sel('S3')])}
${row('', ['6 nhóm suy luận (Đ9–Đ14) đặt ở đâu?', 'chọn 1', '<b>Chủ đề giữ nguyên.</b> Đề xuất: 1 CHUYÊN ĐỀ mới "' + CD_MOI + '" trong chủ đề "Cấu tạo số - Số tự nhiên" (6 nhóm, 6 dạng). Phương án B: không tạo chuyên đề, nhét 6 nhóm vào chuyên đề "Lập số và quy tắc đếm".', sel('S4')])}
</table>
<p class="small mut">Không đề xuất xoá / gộp dạng nào. ${dsKhongDoi.length} dạng đang rỗng (0 câu) giữ nguyên — ME không bổ sung được cho: ${dsKhongDoi.map((d) => E(d.ten)).join('; ')}.</p>

<h2>5. Bản đồ 5T hiện có — từng dạng: sách ME và CLC sẽ vào dạng nào (xếp sơ bộ)</h2>
<p class="small mut">"Câu dùng được / câu gán" = hiện tại. ME = số mục sách xếp vào dạng (số trong ngoặc: ? chưa chắc, hình). CLC = câu đã gán + <b>(+n)</b> câu chưa dạng xếp thêm. Bấm tên chủ đề để mở.</p>
${tBD}

<h2>6. Câu hỏi cho Thùy</h2>
<div class="card"><ol>
<li>Đồng ý <b>${nhomMoi.filter((v) => v.cd !== CD_MOI).length} dạng mới trong chuyên đề/nhóm cũ</b> + <b>chuyên đề mới "${CD_MOI}"</b> (chủ đề không đổi) như bảng 4? (chọn Gật / Sửa / Không từng dòng).</li>
<li>Các mục dưới 5 bài (đánh dấu vàng): thêm dạng luôn hay để lẻ cho đến khi đủ 5?</li>
<li>Sách ME CĐ1 giải bằng đặt số bằng chữ (abc) và lập đẳng thức — luật 5T cấm. Khi nhập, <b>bài kiểu đó "ghép câu + đáp số sách" nhưng soạn lời giải theo luật 5T</b> (đã ghi ở spec-giai-bai); Thùy xác nhận cách này?</li>
<li>Câu CLC thiếu hình (81 câu / 42 đề trong file Word): hiện trên máy chưa có file <code>TUYỂN TẬP ĐỀ THI CLC 2025-2026.docx</code> → nếu Thùy có file thì đưa vào, nếu không sẽ ghi vào báo cáo và báo phiên vẽ hình.</li>
</ol></div>

<h2>7. Việc kéo theo nếu Thùy gật (bước 2 — chưa làm)</h2>
<div class="card"><ul>
<li>Ghi nhóm/dạng mới vào bản đồ (migration/script riêng, thử ROLLBACK, <code>--only</code>), dạng mới có mô tả ngắn; không đổi dạng nào đang có câu.</li>
<li>Nhập sách ME: ghép câu + đáp án + lời giải sách theo spec (<code>ten_de_goc = "Toán 5 ME · VD n.k / BT n.k"</code>); trước hết các mục không chưa-chắc và không hình (≈ ${328 - meDS.filter((m) => m.chua_chac || m.co_hinh).length} mục), chạy <code>k5T-kiem.mjs</code> kiểm đáp số; 48 mục chưa chắc + 35 hình chờ người xem ảnh trang.</li>
<li>Gán dạng cho ${chuaDang.length} câu CLC chưa dạng theo bảng 3 + chuyển 188 câu đề xuất sang chờ duyệt như cũ.</li>
<li>Đo lại <code>scripts/do-dang-du-cau.mjs</code> sau khi nhập, ghi tình trạng vào <code>spec-giai-bai.md</code> mục 5T.</li>
</ul></div>

<div id="bar"><button id="cp">Sao chép quyết định</button><span id="msg" class="mut small">Chọn xong bấm "Sao chép" rồi dán cho Claude; lựa chọn lưu trong trình duyệt.</span></div>
<script>
const K='5t-dx-21-11';let st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
document.querySelectorAll('select[data-id]').forEach(s=>{s.value=(st[s.dataset.id]||{}).v||'';s.onchange=()=>{(st[s.dataset.id]??={}).v=s.value;sv()}});
document.querySelectorAll('input[data-note]').forEach(i=>{i.value=(st[i.dataset.note]||{}).n||'';i.oninput=()=>{(st[i.dataset.note]??={}).n=i.value;sv()}});
function sv(){try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}
document.getElementById('cp').onclick=()=>{const L=Object.entries(st).filter(([k,v])=>v.v||v.n).map(([k,v])=>k+': '+({gat:'Gật',sua:'Gật có sửa',khong:'Không'}[v.v]||'—')+(v.n?' — '+v.n:''));const t='5T đề xuất bản đồ — quyết định:\\n'+(L.join('\\n')||'(chưa chọn)');navigator.clipboard.writeText(t).then(()=>{document.getElementById('msg').textContent='Đã sao chép '+L.length+' dòng.'}).catch(()=>{document.getElementById('msg').textContent=t})};
</script></main></body></html>`
writeFileSync(join(GOC, 'docs/de-xuat-5T-ban-do.html'), h)
console.log({ dang: dang.length, duoi30, rong, me: meDS.length, meTrongDangCo: meTrong, meMoi, meLe: meLe.map((m) => m.ma), clcChua: chuaDang.length, clcMoi, clcCu, clcLe: clcLe.map((q) => q.ma_cau.slice(-6)), moi: nhomMoi.map((v) => [v.dx, v.ten, v.me, v.clc]) })
