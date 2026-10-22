// cau-truc.mjs — cây 4 tầng v3 (22/10/2026 tối) theo LOGIC CỦA THÙY: 4 phần. v3: Phần 2 đi theo từng loại hàm; bỏ dạng khảo sát (bài giảng); mỗi dạng có độ khó + nguồn (phan-loai-dang.mjs).
//  Phần 1  Các phương diện khảo sát hàm số (đơn điệu · cực trị · GTLN–GTNN · tiệm cận): tính được cho MỌI hàm; bài cơ bản. Gom 1 chuyên đề, không tách vụn.
//  Phần 2  Các loại hàm quan trọng: đặc trưng riêng suy từ phần 1; các bài KHÓ của 4 phương diện rơi vào đây.
//  Phần 3  Tương giao · tiếp tuyến · khoảng cách (ôn từ lớp 11).
//  Phần 4  Bài toán thực tế.
// Nội dung (lý thuyết dạng + ví dụ) giữ nguyên từ bản v1 đã soát (`cau-truc-v1.mjs`, mã H…, tệp ra/J*.txt): mỗi dạng v2 trỏ về dạng v1 bằng trường `cu`.
// Lý thuyết NHÓM: nhóm có `cu` thì dùng lại lý thuyết nhóm v1 cùng mã; nhóm không có `cu` thì có tệp riêng ra/N*.txt (khối `=== N P…`).
import { CAY as V1 } from './cau-truc-v1.mjs'
import { DO_KHO, nguonCua } from './phan-loai-dang.mjs'
export { CHU_DE } from './cau-truc-v1.mjs'

const DANG1 = Object.fromEntries(V1.flatMap((c) => c.nhom.flatMap((n) => n.dang.map((d) => [d[0], { ten: d[1], mo_ta: d[2], hinh: d[3] }]))))
const NHOM1 = Object.fromEntries(V1.flatMap((c) => c.nhom.map((n) => [n.id, n])))

// nhóm: [mã v2, tên, bắt buộc?, mô tả, cu (nhóm v1 dùng lại lý thuyết, hoặc null), [mã dạng v1…]]
const PHAN = [
  { id: 'P1', ten: 'Các phương diện khảo sát hàm số', mo_ta: 'Bốn phương diện — đơn điệu, cực trị, giá trị lớn nhất–nhỏ nhất, tiệm cận — tính toán được cho mọi hàm số. Bài cơ bản: đề cho công thức hoặc cho hình (bảng biến thiên, đồ thị, f′).', nhom: [
    ['P1.1', 'Xét tính đơn điệu khi biết hàm số', true, 'Đề cho công thức y=f(x), hỏi khoảng đồng biến, nghịch biến; quy trình tập xác định, y′, bảng biến thiên.', 'H1.1', ['H1.1.1', 'H1.1.2']],
    ['P1.2', 'Đọc tính đơn điệu từ bảng biến thiên, đồ thị, f′', true, 'Đề cho hình (bảng biến thiên, đồ thị của f) hoặc dữ kiện về f′ (bảng xét dấu, đồ thị, biểu thức), hỏi tính đơn điệu của f.', null, ['H1.2.1', 'H1.2.2', 'H1.3.1', 'H1.3.2']],
    ['P1.3', 'Tìm cực trị khi biết hàm số', true, 'Đề cho công thức; tìm điểm cực trị, giá trị cực trị, số điểm cực trị; quy trình y′ → bảng biến thiên.', 'H2.1', ['H2.1.1', 'H2.1.2', 'H2.1.3', 'H2.1.4']],
    ['P1.4', 'Đọc cực trị từ bảng biến thiên, đồ thị, f′', true, 'Đề cho hình của f hoặc dữ kiện về f′; phân biệt điểm cực trị (x), giá trị cực trị (y), điểm cực trị của đồ thị (x;y).', null, ['H2.2.1', 'H2.2.2', 'H2.3.1', 'H2.3.2']],
    ['P1.5', 'Tìm GTLN, GTNN khi biết hàm số', true, 'Đề cho công thức; tìm GTLN, GTNN trên đoạn, khoảng hoặc nửa khoảng; ba bước: nghiệm y′, giá trị tại nghiệm và hai đầu mút, so sánh.', 'H3.2', ['H3.2.1', 'H3.2.2', 'H3.2.3', 'H3.2.4', 'H3.2.5']],
    ['P1.6', 'Đọc GTLN, GTNN từ bảng biến thiên, đồ thị', true, 'Đề cho hình của f trên đoạn/khoảng; đọc GTLN, GTNN, tính M±m, nhận mệnh đề đúng.', null, ['H3.1.1', 'H3.1.2']],
    ['P1.7', 'Tiệm cận đứng và tiệm cận ngang khi biết hàm số', true, 'Đề cho công thức; tìm hoặc đếm tiệm cận đứng, tiệm cận ngang bằng giới hạn.', 'H4.1', ['H4.1.1', 'H4.1.2', 'H4.1.3']],
    ['P1.8', 'Tiệm cận xiên khi biết hàm số', true, 'Đề cho công thức có tiệm cận xiên y=ax+b; tìm phương trình hoặc tính biểu thức theo a, b.', 'H4.2', ['H4.2.1', 'H4.2.2', 'H4.2.3']],
    ['P1.9', 'Đọc tiệm cận từ bảng biến thiên, đồ thị, giới hạn', true, 'Đề cho hình hoặc giới hạn của hàm; đọc, đếm tiệm cận; chọn mệnh đề đúng.', null, ['H4.3.1', 'H4.3.2', 'H4.3.3']],
  ] },
  { id: 'P2', ten: 'Các loại hàm số', mo_ta: 'Đi theo TỪNG LOẠI HÀM: bậc ba, trùng phương, bậc nhất trên bậc nhất, bậc hai trên bậc nhất. Mỗi nhóm là các bài toán ĐẶC TRƯNG của loại hàm đó — phải dùng đồ thị và các hệ số để giải (dấu của a, b, c, d, điểm uốn, tâm đối xứng, đường thẳng đi qua hai điểm cực trị…). Bài đơn giản trên một hàm cho sẵn (tìm cực trị, xét đơn điệu, tìm tiệm cận) thuộc Phần 1; khảo sát và vẽ đồ thị là bài giảng, không phải dạng bài.', nhom: [
    ['P2.1', 'Hàm bậc ba', true, 'Các bài toán đặc trưng của y=ax³+bx²+cx+d: nhận dạng đồ thị, dấu các hệ số, điểm uốn là tâm đối xứng, số nghiệm của f(x)=m, đường thẳng qua hai điểm cực trị, tham số để hàm đơn điệu hoặc có cực trị thoả điều kiện.', null, ['H5.2.1', 'H5.3.1', 'H5.3.4', 'H5.4.1', 'H5.4.2', 'H5.4.3', 'H1.5.1', 'H2.4.1', 'H2.4.2', 'H2.4.3', 'H2.4.4', 'H2.5.1', 'H2.5.2', 'H2.5.3']],
    ['P2.2', 'Hàm trùng phương', true, 'Các bài toán đặc trưng của y=ax⁴+bx²+c: đồ thị nhận Oy làm trục đối xứng, chỉ có một hoặc ba cực trị, ba điểm cực trị tạo thành tam giác cân.', null, [
      'H2.4.5',
      { id: 'M2.2.1', ten: 'Nhận dạng đồ thị, dấu của a, b, c (hàm trùng phương)', mo_ta: 'Đề cho đồ thị hoặc bảng biến thiên của hàm trùng phương; xác định dấu của a, b, c, chọn công thức đúng.', hinh: 'dothi' },
      { id: 'M2.2.2', ten: 'Số điểm cực trị và điều kiện của tham số m (hàm trùng phương)', mo_ta: 'Tìm m để hàm có một cực trị hoặc ba cực trị; so sánh vị trí các điểm cực trị với trục.', hinh: 'khong' },
      { id: 'M2.2.3', ten: 'Đọc đồ thị hàm trùng phương, số nghiệm của f(x)=m', mo_ta: 'Cho đồ thị hàm trùng phương; đọc đơn điệu, cực trị, giá trị; đếm nghiệm f(x)=m.', hinh: 'dothi' },
    ]],
    ['P2.3', 'Hàm bậc nhất trên bậc nhất', true, 'Các bài toán đặc trưng của y=(ax+b)/(cx+d): hai tiệm cận cắt nhau tại tâm đối xứng, dấu của ad−bc quyết định đồng biến hay nghịch biến, đọc các hệ số từ vị trí tiệm cận và giao điểm với trục.', null, ['H5.2.2', 'H5.3.2', 'H4.5.1', 'H1.5.2', 'H1.5.3', 'H4.4.1', 'H4.4.2']],
    ['P2.4', 'Hàm bậc hai trên bậc nhất', true, 'Các bài toán đặc trưng của y=(ax²+bx+c)/(dx+e): tiệm cận xiên, cực đại và cực tiểu nằm hai bên tiệm cận đứng, nhận dạng đồ thị và hệ số.', null, ['H5.2.3', 'H5.3.3', 'H1.5.4', 'H2.4.6']],
    ['P2.5', 'Hàm hợp, hàm ẩn: tính đơn điệu', false, 'Nâng cao: đơn điệu của g=f(u(x)) khi biết f′, đổi biến t=u(x) với hàm lượng giác/logarit/căn, hàm ẩn có tham số.', null, ['H1.4.1', 'H1.4.2', 'H1.5.5', 'H1.5.6']],
    ['P2.6', 'Hàm hợp, hàm chứa trị tuyệt đối: cực trị', false, 'Nâng cao: số cực trị của f(x)+ax, |f(x)|, f(|x|), f(u(x)) và tìm m để có số cực trị cho trước.', null, ['H2.3.3', 'H2.6.1', 'H2.6.2', 'H2.6.3']],
    ['P2.7', 'Hàm hợp, hàm ẩn, hàm có tham số: GTLN, GTNN', false, 'Nâng cao: GTLN, GTNN có tham số m (kể cả |f(x)+m|), phương trình–bất phương trình dùng max–min, hàm hợp, biểu thức nhiều biến.', null, ['H3.1.3', 'H3.3.1', 'H3.3.2', 'H3.3.3', 'H3.4.1', 'H3.4.2']],
    ['P2.8', 'Hàm hợp: tiệm cận và phương trình', false, 'Nâng cao: tiệm cận của 1/(f(x)+m); đếm nghiệm f(f(x))=m, f(u(x))=m, |f(x)|=m, f(|x|)=m từ đồ thị.', null, ['H4.3.4', 'H6.4.1', 'H6.4.2']],
  ] },
  { id: 'P3', ten: 'Tương giao, tiếp tuyến, khoảng cách', mo_ta: 'Các bài toán trên đồ thị đã quen từ lớp 11, nay dùng với các hàm ở phần 2.', nhom: [
    ['P3.1', 'Tương giao của đồ thị với đường thẳng, với trục', false, 'Số giao điểm, điều kiện về hoành độ giao điểm, hình học trên các giao điểm.', 'H6.1', ['H6.1.1', 'H6.1.2', 'H6.1.3']],
    ['P3.2', 'Tiếp tuyến của đồ thị', false, 'Viết phương trình tiếp tuyến theo các điều kiện khác nhau, tính đại lượng gắn với tiếp tuyến.', 'H6.2', ['H6.2.1', 'H6.2.2', 'H6.2.3']],
    ['P3.3', 'Khoảng cách, điểm di động và hình học của tiệm cận', false, 'Khoảng cách nhỏ nhất từ điểm trên đồ thị, cặp điểm đối xứng, điểm nguyên; khoảng cách tới hai tiệm cận, diện tích hình tạo bởi tiệm cận và trục, góc.', null, ['H6.3.1', 'H6.3.2', 'H6.3.3', 'H4.5.2', 'H4.5.3', 'H4.5.4']],
  ] },
  { id: 'P4', ten: 'Bài toán thực tế', mo_ta: 'Ứng dụng đạo hàm giải quyết vấn đề thực tiễn, tách theo loại mô hình.', nhom: [
    ['P4.1', null, true, null, 'H7.1', ['H7.1.1', 'H7.1.2', 'H7.1.3']],
    ['P4.2', null, true, null, 'H7.2', ['H7.2.1', 'H7.2.2', 'H7.2.3', 'H7.2.4']],
    ['P4.3', null, true, null, 'H7.3', ['H7.3.1', 'H7.3.2', 'H7.3.3', 'H7.3.4']],
    ['P4.4', null, true, null, 'H7.4', ['H7.4.1', 'H7.4.2', 'H7.4.3', 'H7.4.4']],
    ['P4.5', null, true, null, 'H7.5', ['H7.5.1', 'H7.5.2']],
    ['P4.6', null, true, null, 'H7.6', ['H7.6.1', 'H7.6.2']],
    ['P4.7', null, false, null, 'H7.7', ['H7.7.1', 'H7.7.2']],
    ['P4.8', null, true, null, 'H7.8', ['H7.8.1', 'H7.8.2', 'H7.8.3']],
  ] },
]

export const CAY = PHAN.map((p) => ({
  id: p.id, ten: p.ten, mo_ta: p.mo_ta,
  nhom: p.nhom.map(([id, ten, bb, mo_ta, cu, dang]) => {
    const g = cu ? NHOM1[cu] : null
    return {
      id, cu, bb: g && ten == null ? g.bb : bb, ten: ten ?? g.ten, mo_ta: mo_ta ?? g.mo_ta,
      // dạng = mã v1 (dùng lại lý thuyết + ví dụ đã soát) hoặc object dạng MỚI { id: 'M…', ten, mo_ta, hinh } (chưa có lý thuyết/ví dụ)
      dang: dang.map((x, i) => {
        const moi = typeof x === 'object'
        const d = moi ? x : DANG1[x]; if (!d) throw new Error('thiếu dạng v1 ' + x)
        const ma = moi ? x.id : x
        if (!DO_KHO[ma]) throw new Error('thiếu độ khó cho ' + ma)
        return [`${id}.${i + 1}`, d.ten, d.mo_ta, d.hinh, moi ? null : x, DO_KHO[ma], nguonCua(ma)]
      }),
    }
  }),
}))

export const THONG_KE = () => ({
  chuyen_de: CAY.length,
  nhom: CAY.reduce((s, c) => s + c.nhom.length, 0),
  dang: CAY.reduce((s, c) => s + c.nhom.reduce((t, n) => t + n.dang.length, 0), 0),
})
// kiểm: mọi dạng v1 xuất hiện đúng 1 lần
const dem = {}
for (const c of CAY) for (const n of c.nhom) for (const d of n.dang) if (d[4]) dem[d[4]] = (dem[d[4]] || 0) + 1
// Thùy 22/10: "Khảo sát hàm số là bài giảng, không phải dạng bài" ⇒ 3 dạng khảo sát/vẽ đồ thị BỎ khỏi bản đồ (lý thuyết + ví dụ v1 giữ lại trong ra/J*.txt cho phần thiết kế bài giảng).
export const BO_RA = ['H5.1.1', 'H5.1.2', 'H5.1.3']
for (const id of Object.keys(DANG1)) { const mong = BO_RA.includes(id) ? 0 : 1; if ((dem[id] || 0) !== mong) throw new Error(`dạng v1 ${id} xuất hiện ${dem[id] || 0} lần (cần ${mong})`) }
