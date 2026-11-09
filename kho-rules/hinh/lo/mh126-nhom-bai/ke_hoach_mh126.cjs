// KẾ HOẠCH GOM MH.126 (một nguồn cho cả HTML duyệt lẫn script ghi sau này).
const R = String.raw
const CGC = R`Xét $\triangle ABD$ và $\triangle EBD$ có:
$BA=BE$ (gt)
$\widehat{ABD}=\widehat{EBD}$ ($BD$ là phân giác của góc $B$)
$BD$ là cạnh chung
Do đó $\triangle ABD=\triangle EBD$ (c.g.c).
Suy ra $DA=DE$ (hai cạnh tương ứng).`
module.exports = {
  suKien: [R`$BD$ là phân giác của góc $B$ ($D\in AC$)`, R`$E\in BC$, $BE=BA$`, R`$DE\perp BC$ ($E\in BC$)`],
  dauRa: R`Cho tam giác $ABC$ vuông tại $A$, $BD$ là phân giác của góc $B$ ($D\in AC$), $E$ thuộc cạnh $BC$ sao cho $BE=BA$ và $DE\perp BC$.`,
  tv: [
    { nut: 'MH.166', cho: [0, 1], hoi: [2], gt: R`Cho tam giác $ABC$ vuông tại $A$, $BD$ là phân giác của góc $B$ ($D\in AC$). Trên cạnh $BC$ lấy điểm $E$ sao cho $BE=BA$.`, not: ['BT.07.126.03', 'BT.07.126.04'] },
    { nut: 'MH.168', cho: [0, 2], hoi: [1], gt: R`Cho tam giác $ABC$ vuông tại $A$, $BD$ là phân giác của góc $B$ ($D\in AC$). Kẻ $DE\perp BC$ ($E\in BC$).`, not: ['BT.07.126.08'] },
    { nut: null, ten: 'BE = BA, I trung điểm AE', cho: [1], hoi: [0, 2],
      gt: R`Cho tam giác $ABC$ vuông tại $A$ có $AB<AC$. Trên cạnh $BC$ lấy điểm $E$ sao cho $BA=BE$. Gọi $I$ là trung điểm của $AE$.`,
      not: ['BT.07.061.17', 'BT.07.061.18', 'BT.07.061.19'], tuMH: 'MH.061' },
  ],
  // nốt dời lên thẳng nút nhóm (đi tiếp ngay từ đầu ra)
  diTiepGoc: ['BT.07.126.05', 'BT.07.126.06'],
  // nhánh đi tiếp: dời cha sang nút nhóm (KHÔNG xoá nhánh nào)
  nhanhDoi: [{ ten: 'F trên tia đối AB, AF = CE', chinh: true }, { ten: 'BA cắt ED tại Q', chinh: false }],
  nhanhMoi: [{ ten: 'H trên tia đối DE, DH = DC', gtThem: R`Trên tia đối của tia $DE$ lấy điểm $H$ sao cho $DH=DC$.`, not: ['BT.07.061.20'], tuMH: 'MH.061' }],
  // 2 nốt cũ ở gốc chứa nguyên đề a) b) c) (tên K, chưa chuẩn hoá) — trùng chuỗi BT.07.061.10–12 ⇒ trả về mô hình cũ MH.061, KHÔNG xoá
  veMH061: ['BT.07.126.01', 'BT.07.126.02'],
  // đổi tiền đề (chỉ dựa vào đầu ra / bài đi tiếp trước nó)
  tienDe: { 'BT.07.126.05': [], 'BT.07.126.06': ['BT.07.126.05'], 'BT.07.126.07': [], 'BT.07.126.09': [], 'BT.07.126.10': ['BT.07.126.09'], 'BT.07.061.20': [] },
  // đổi chữ: phát biểu / lời giải (thay đoạn cũ → mới). Chuẩn hoá điểm cho 4 nốt từ MH.061: M→E, E→I, K→D.
  doiChu: {
    'BT.07.126.07': { lg: [[R`Vì $DE\perp BC$ (theo B4), $E$ thuộc $BC$`, R`Vì $DE\perp BC$ (gt), $E$ thuộc $BC$`],
      [R`Xét $\triangle DAF$ và $\triangle DEC$ có:
$DA=DE$ (theo B4)`, CGC + '\n' + R`Xét $\triangle DAF$ và $\triangle DEC$ có:
$DA=DE$ (cmt)`]] },
    'BT.07.126.09': { lg: [[R`Vì $\triangle ABD=\triangle EBD$ (theo B8)
nên $DA=DE$ (hai cạnh tương ứng).`, CGC]] },
    'BT.07.126.10': { lg: [[R`Vì $\triangle ABD=\triangle EBD$ (theo B8)
nên $BE=BA$ (hai cạnh tương ứng).`, R`Ta có $BE=BA$ (gt).`]] },
    'BT.07.061.17': { pb: R`Chứng minh $\triangle ABI = \triangle EBI$.`, lg: 'MAP' },
    'BT.07.061.18': { pb: R`Chứng minh $BI$ là tia phân giác của góc $ABC$`, lg: 'MAP' },
    'BT.07.061.19': { pb: R`Gọi $D$ là giao điểm của $BI$ và $AC$. Chứng minh $DE \perp BC$.`, lg: 'MAP' },
    'BT.07.061.20': { pb: R`Chứng minh ba điểm $B, A, H$ thẳng hàng.`, rieng: null, lg: 'MAP',
      lgThayDau: [[R`Theo kết quả trên, $\triangle ABD = \triangle EBD$ nên $DA = DE$ (hai cạnh tương ứng).`, CGC.replace(/\n/g, '\n\n')],
                  [R`Mà $DE \perp BC$ (kết quả câu trên)`, R`Mà $DE \perp BC$ (gt)`]] },
  },
}
// Đổi tên điểm M→E, E→I, K→D cho lời giải 4 nốt MH.061 (chỉ trong công thức/chữ tên điểm — làm 1 lượt qua ký tự tạm).
module.exports.doiTenDiem = (s) => s
  // tên điểm = chữ HOA không dính chữ thường (giữ "Mà", "Mặt", lệnh \…); "BMK", "AM" vẫn đổi
  .replace(/(?<![\p{Ll}\\])E(?!\p{Ll})/gu, '\u0001').replace(/(?<![\p{Ll}\\])M(?!\p{Ll})/gu, '\u0002').replace(/(?<![\p{Ll}\\])K(?!\p{Ll})/gu, '\u0003')
  .replace(/\u0001/g, 'I').replace(/\u0002/g, 'E').replace(/\u0003/g, 'D')
