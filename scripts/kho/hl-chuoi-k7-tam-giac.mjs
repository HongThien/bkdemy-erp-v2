// Dựng CHUỖI Hình–Luyện KHỐI 7 · chủ đề "Tam giác bằng nhau" (bản đồ MỚI, phan='luyen') từ các mô hình CŨ MH.061–064 (75 bài toán, bản đồ cũ phan IS NULL).
// Khung mới do Thùy dựng 07/11: nhóm NMH00011/14/15/16 · mô hình MH.126 · MH.130 · MH.131 · MH.132 · MH.133 (giả thiết gốc của Thùy GIỮ NGUYÊN, chỉ bọc LaTeX chỗ thiếu).
// Chuẩn hoá: gộp chuỗi trùng (MH.061 có 3 bản cùng đề: BT.…10–12, 13–16, 21–24), đổi tên điểm cho khớp giả thiết gốc (D = chân phân giác / M = trung điểm…),
// các chuỗi "M là trung điểm BC" của tam giác cân gộp vào giả thiết gốc AD phân giác (D ≡ trung điểm), mỗi chuỗi → nhánh giả thiết + bài nối bài (tiền đề).
// Mọi khẳng định được kiểm bằng toạ độ số (≥4 bộ ngẫu nhiên) TRƯỚC khi ghi; sai ⇒ dừng.
//   node scripts/kho/hl-chuoi-k7-tam-giac.mjs          ⇒ chạy thử trong 1 transaction rồi ROLLBACK
//   node scripts/kho/hl-chuoi-k7-tam-giac.mjs --ghi    ⇒ commit
// Chỉ THÊM (fn_hl_them_gia_thiet / fn_hl_them_bai) + bọc LaTeX giả thiết gốc MH.126/MH.133 (có chốt chặn nội dung cũ). Mô hình cũ KHÔNG đụng. Mô hình đã có nhánh ⇒ từ chối.
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const T = String.raw

// ───────────────────────── DỮ LIỆU ─────────────────────────
// nodes: k, cha ('goc' | khoá nhánh), chinh, ten, gt · bai: k, l (nhánh chứa bài), pb, td (khoá tiền đề — phải nằm ở nhánh tổ tiên hoặc chính nhánh đó)
const MH = {
  'MH.126': {
    gtCu: 'Cho tam giác ABC vuông tại A, kẻ BD là phân giác của góc B (D thuộc AC)',
    gtMoi: T`Cho tam giác $ABC$ vuông tại $A$, kẻ $BD$ là phân giác của góc $B$ ($D$ thuộc $AC$).`,
    baiCoSan: 2, // BT.07.126.01/.02 Thùy gõ 30/10 (cùng đề, 3 ý a-b-c) — GIỮ, báo Thùy
    nodes: [
      { k: 'N1', cha: 'goc', chinh: true, ten: 'E trên BC, BE = BA', gt: T`Trên cạnh $BC$ lấy điểm $E$ sao cho $BE=BA$.` },
      { k: 'N1a', cha: 'N1', chinh: true, ten: 'F trên tia đối AB, AF = CE', gt: T`Trên tia đối của tia $AB$ lấy điểm $F$ sao cho $AF=CE$.` },
      { k: 'N2', cha: 'goc', chinh: false, ten: 'DE ⊥ BC', gt: T`Kẻ $DE\perp BC$ tại $E$ ($E\in BC$).` },
      { k: 'N2a', cha: 'N2', chinh: true, ten: 'BA cắt ED tại Q', gt: T`Tia $BA$ cắt tia $ED$ tại $Q$.` },
      { k: 'N2b', cha: 'N2a', chinh: true, ten: 'M là trung điểm QC', gt: T`Gọi $M$ là trung điểm của đoạn thẳng $QC$.` },
    ],
    bai: [
      { k: 'B1', l: 'N1', pb: T`Chứng minh $\triangle ABD=\triangle EBD$.`, td: [] },
      { k: 'B2', l: 'N1', pb: T`Chứng minh $DE=DA$ và $DE\perp BC$.`, td: ['B1'] },
      { k: 'B3', l: 'N1', pb: T`Chứng minh $BD\perp AE$.`, td: ['B1'] },
      { k: 'B4', l: 'N1', pb: T`Chứng minh $BD$ là đường trung trực của đoạn thẳng $AE$.`, td: ['B3', 'B1'] },
      { k: 'B5', l: 'N1a', pb: T`Chứng minh ba điểm $F, D, E$ thẳng hàng.`, td: ['B2', 'B1'] },
      { k: 'B6', l: 'N2', pb: T`Chứng minh $\triangle ABD=\triangle EBD$.`, td: [] },
      { k: 'B7', l: 'N2a', pb: T`Chứng minh $DQ=DC$.`, td: ['B6'] },
      { k: 'B8', l: 'N2b', pb: T`Chứng minh ba điểm $B, D, M$ thẳng hàng.`, td: ['B7', 'B6'] },
    ],
  },
  'MH.130': {
    nodes: [
      { k: 'N1', cha: 'goc', chinh: true, ten: 'O = AI ∩ BK', gt: T`Gọi $O$ là giao điểm của $AI$ và $BK$.` },
      { k: 'N2', cha: 'N1', chinh: true, ten: 'E = AB ∩ KI', gt: T`Gọi $E$ là giao điểm của $AB$ và $KI$.` },
      { k: 'N3', cha: 'N2', chinh: true, ten: 'H là trung điểm EC', gt: T`Gọi $H$ là trung điểm của $EC$.` },
    ],
    bai: [
      { k: 'B1', l: 'goc', pb: T`Chứng minh $\triangle ABI=\triangle AKI$.`, td: [] },
      { k: 'B2', l: 'N1', pb: T`Chứng minh $AI\perp BK$ tại $O$.`, td: ['B1'] },
      { k: 'B3', l: 'N2', pb: T`Chứng minh $\triangle BIE=\triangle KIC$.`, td: ['B1'] },
      { k: 'B4', l: 'N2', pb: T`Chứng minh $BK\parallel EC$.`, td: ['B2', 'B1'] },
      { k: 'B5', l: 'N3', pb: T`Chứng minh ba điểm $A, I, H$ thẳng hàng.`, td: ['B3'] },
    ],
  },
  'MH.131': {
    nodes: [
      { k: 'N1', cha: 'goc', chinh: true, ten: 'MI ⊥ AC, MK ⊥ BD', gt: T`Qua $M$ vẽ đường thẳng vuông góc với $AC$ tại $I$ và đường thẳng vuông góc với $BD$ tại $K$.` },
      { k: 'N2', cha: 'goc', chinh: false, ten: 'AH ⊥ BC, DK ⊥ BC', gt: T`Kẻ $AH\perp BC$, $DK\perp BC$ ($H, K$ thuộc $BC$).` },
      { k: 'N3', cha: 'goc', chinh: false, ten: 'I trung điểm AC, I trung điểm BE', gt: T`Gọi $I$ là trung điểm của $AC$. Vẽ điểm $E$ sao cho $I$ là trung điểm của $BE$.` },
      { k: 'N4', cha: 'goc', chinh: false, ten: 'E trên tia đối CD, CE = CD', gt: T`Trên tia đối của tia $CD$ lấy điểm $E$ sao cho $CE=CD$.` },
      { k: 'N4a', cha: 'N4', chinh: true, ten: 'F là trung điểm AC', gt: T`Gọi $F$ là trung điểm của $AC$.` },
      { k: 'N5', cha: 'goc', chinh: false, ten: 'Tam giác ABC vuông tại A', gt: T`Cho thêm $\triangle ABC$ vuông tại $A$.` },
      { k: 'N6', cha: 'goc', chinh: false, ten: 'N trung điểm AB, K đối xứng C qua N', gt: T`Gọi $N$ là trung điểm của $AB$. Trên tia đối của tia $NC$ lấy điểm $K$ sao cho $NC=NK$.` },
      { k: 'N7', cha: 'goc', chinh: false, ten: 'CE ⊥ BD, BF ⊥ AC', gt: T`Vẽ $CE\perp BD$ ($E\in BD$) và $BF\perp AC$ ($F\in AC$).` },
    ],
    bai: [
      { k: 'B1', l: 'goc', pb: T`Chứng minh $\triangle AMB=\triangle DMC$ và $AB=DC$.`, td: [] },
      { k: 'B2', l: 'goc', pb: T`Chứng minh $BD\parallel AC$.`, td: ['B1'] },
      { k: 'B3', l: 'goc', pb: T`Chứng minh $\triangle ABC=\triangle DCB$.`, td: ['B2', 'B1'] },
      { k: 'B4', l: 'N1', pb: T`Chứng minh ba điểm $I, M, K$ thẳng hàng.`, td: ['B2'] },
      { k: 'B5', l: 'N2', pb: T`Chứng minh $AH=DK$.`, td: ['B1'] },
      { k: 'B6', l: 'N3', pb: T`Chứng minh ba điểm $E, C, D$ thẳng hàng.`, td: ['B2', 'B1'] },
      { k: 'B7', l: 'N4', pb: T`Chứng minh $AE=BC$.`, td: ['B2', 'B1'] },
      { k: 'B8', l: 'N4a', pb: T`Chứng minh ba điểm $B, F, E$ thẳng hàng.`, td: ['B7'] },
      { k: 'B9', l: 'N5', pb: T`Chứng minh $AC\perp CD$.`, td: ['B1'] },
      { k: 'B10', l: 'N5', pb: T`Chứng minh $BC=2AM$.`, td: ['B9', 'B1'] },
      { k: 'B11', l: 'N6', pb: T`Chứng minh ba điểm $D, B, K$ thẳng hàng.`, td: ['B2'] },
      { k: 'B12', l: 'N7', pb: T`Chứng minh $DE=AF$.`, td: ['B3', 'B2'] },
    ],
  },
  'MH.132': {
    nodes: [
      { k: 'Na', cha: 'goc', chinh: true, ten: 'DM ⊥ AB, AN = AM', gt: T`Vẽ $DM\perp AB$ tại $M$. Trên cạnh $AC$ lấy điểm $N$ sao cho $AN=AM$.` },
      { k: 'Na1', cha: 'Na', chinh: true, ten: 'K trung điểm CN, E đối xứng D qua K', gt: T`Gọi $K$ là trung điểm của $CN$. Trên tia đối của tia $KD$ lấy điểm $E$ sao cho $KE=KD$.` },
      { k: 'Nb', cha: 'goc', chinh: false, ten: 'DE ⊥ AB, DF ⊥ AC', gt: T`Từ $D$ kẻ $DE\perp AB$ tại $E$ và $DF\perp AC$ tại $F$.` },
      { k: 'Nb1', cha: 'Nb', chinh: true, ten: 'I là trung điểm EF', gt: T`Gọi $I$ là trung điểm của $EF$.` },
      { k: 'Nb2', cha: 'Nb', chinh: false, ten: 'K = AD ∩ EF', gt: T`Gọi $K$ là giao điểm của $AD$ và $EF$.` },
      { k: 'Nb3', cha: 'goc', chinh: false, ten: 'Qua C kẻ đường song song AD', gt: T`Từ $C$ kẻ đường thẳng song song với $AD$ cắt tia $BA$ tại $G$.` },
      { k: 'Nd', cha: 'goc', chinh: false, ten: 'P bất kì trên AD', gt: T`Lấy điểm $P$ bất kỳ trên đoạn thẳng $AD$.` },
      { k: 'Ne', cha: 'goc', chinh: false, ten: 'AH = AK, I = HK ∩ AD', gt: T`Trên cạnh $AB$ lấy điểm $H$, trên cạnh $AC$ lấy điểm $K$ sao cho $AH=AK$. Gọi $I$ là giao điểm của $HK$ và $AD$.` },
      { k: 'Nf', cha: 'goc', chinh: false, ten: 'E, F trên hai tia đối, BE = CF', gt: T`Trên tia đối của tia $BC$ lấy điểm $E$, trên tia đối của tia $CB$ lấy điểm $F$ sao cho $BE=CF$.` },
      { k: 'Ng', cha: 'goc', chinh: false, ten: 'Cx ⊥ BC, Ay ∥ BC', gt: T`Trên nửa mặt phẳng bờ $BC$ chứa điểm $A$ vẽ tia $Cx\perp BC$. Trên nửa mặt phẳng bờ $AB$ chứa điểm $C$ vẽ tia $Ay\parallel BC$.` },
      { k: 'Ng1', cha: 'Ng', chinh: true, ten: 'I trung điểm AC, K = Ay ∩ Cx', gt: T`Gọi $I$ là trung điểm của $AC$, $K$ là giao điểm của hai tia $Ay$ và $Cx$.` },
      { k: 'Nh', cha: 'goc', chinh: false, ten: 'P, Q trung điểm AC, AB', gt: T`Gọi $P, Q$ lần lượt là trung điểm của $AC, AB$.` },
      { k: 'Nh1', cha: 'Nh', chinh: true, ten: 'M, N đối xứng B, C qua P, Q', gt: T`Lấy các điểm $M, N$ sao cho $P$ là trung điểm của $BM$, $Q$ là trung điểm của $CN$.` },
      { k: 'Nh2', cha: 'Nh', chinh: false, ten: 'G = BP ∩ CQ', gt: T`Gọi $G$ là giao điểm của $BP$ và $CQ$.` },
    ],
    bai: [
      { k: 'B1', l: 'goc', pb: T`Chứng minh $\triangle ABD=\triangle ACD$.`, td: [] },
      { k: 'B2', l: 'goc', pb: T`Chứng minh $D$ là trung điểm của $BC$ và $AD\perp BC$.`, td: ['B1'] },
      { k: 'B3', l: 'goc', pb: T`Chứng minh $AD$ là đường trung trực của $BC$.`, td: ['B2'] },
      { k: 'B4', l: 'goc', pb: T`Chứng minh $\widehat{ABC}=\widehat{ACB}$.`, td: ['B1'] },
      { k: 'B5', l: 'Na', pb: T`Chứng minh $\triangle ADM=\triangle ADN$ và $DN\perp AC$.`, td: ['B1'] },
      { k: 'B6', l: 'Na1', pb: T`Chứng minh ba điểm $M, N, E$ thẳng hàng.`, td: ['B5', 'B3'] },
      { k: 'B7', l: 'Nb', pb: T`Chứng minh $DE=DF$.`, td: ['B1'] },
      { k: 'B8', l: 'Nb', pb: T`Chứng minh $AE=AF$.`, td: ['B7'] },
      { k: 'B9', l: 'Nb1', pb: T`Chứng minh ba điểm $A, I, D$ thẳng hàng.`, td: ['B7'] },
      { k: 'B10', l: 'Nb2', pb: T`Chứng minh $AK\perp EF$.`, td: ['B8'] },
      { k: 'B11', l: 'Nb2', pb: T`Chứng minh $EF\parallel BC$.`, td: ['B10', 'B2'] },
      { k: 'B12', l: 'Nb3', pb: T`Chứng minh $A$ là trung điểm của $BG$.`, td: ['B2'] },
      { k: 'B13', l: 'Nd', pb: T`Chứng minh $PB=PC$.`, td: ['B3'] },
      { k: 'B14', l: 'Ne', pb: T`Chứng minh $AI\perp HK$.`, td: ['B1'] },
      { k: 'B15', l: 'Ne', pb: T`Chứng minh $HK\parallel BC$.`, td: ['B14', 'B2'] },
      { k: 'B16', l: 'Nf', pb: T`Chứng minh $AE=AF$.`, td: ['B4'] },
      { k: 'B17', l: 'Nf', pb: T`Chứng minh $AD$ là tia phân giác của $\widehat{EAF}$.`, td: ['B16', 'B1'] },
      { k: 'B18', l: 'Ng', pb: T`Chứng minh $\widehat{yAC}=\widehat{ABC}$.`, td: ['B4'] },
      { k: 'B19', l: 'Ng', pb: T`Chứng minh $AD\parallel Cx$.`, td: ['B2'] },
      { k: 'B20', l: 'Ng1', pb: T`Chứng minh $I$ là trung điểm của $DK$.`, td: ['B19', 'B18'] },
      { k: 'B21', l: 'Nh', pb: T`Chứng minh $BP=CQ$.`, td: ['B1'] },
      { k: 'B22', l: 'Nh1', pb: T`Chứng minh $A$ là trung điểm của $MN$.`, td: ['B21'] },
      { k: 'B23', l: 'Nh2', pb: T`Chứng minh ba điểm $A, G, D$ thẳng hàng.`, td: ['B21'] },
    ],
  },
  'MH.133': {
    gtCu: 'Cho tam giác $ABC$, gọi D là trung điểm của đoạn thẳng $AC$, E là trung điểm của đoạn thẳng $AB$. Trên tia đối của tia $DB$ lấy điểm $M$ sao cho $DM = DB$. Trên tia đối của tia $EC$ lấy điểm $N$ sao cho $EN = EC$.',
    gtMoi: T`Cho tam giác $ABC$, gọi $D$ là trung điểm của đoạn thẳng $AC$, $E$ là trung điểm của đoạn thẳng $AB$. Trên tia đối của tia $DB$ lấy điểm $M$ sao cho $DM = DB$. Trên tia đối của tia $EC$ lấy điểm $N$ sao cho $EN = EC$.`,
    nodes: [],
    bai: [
      { k: 'B1', l: 'goc', pb: T`Chứng minh $AM=BC$.`, td: [] },
      { k: 'B2', l: 'goc', pb: T`Chứng minh $AM\parallel BC$.`, td: ['B1'] },
      { k: 'B3', l: 'goc', pb: T`Chứng minh $A$ là trung điểm của đoạn thẳng $MN$.`, td: ['B2', 'B1'] },
    ],
  },
}

// ───────────────────────── KIỂM BẰNG TOẠ ĐỘ ─────────────────────────
const E = 1e-7
const P = (x, y) => [x, y]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const dot = (u, v) => u[0] * v[0] + u[1] * v[1]
const crs = (u, v) => u[0] * v[1] - u[1] * v[0]
const mid = (a, b) => mul(add(a, b), 0.5)
const dx = (p, o) => sub(mul(o, 2), p) // đối xứng p qua o
const coll = (a, b, c) => Math.abs(crs(sub(b, a), sub(c, a))) < E * (1 + dist(a, b) * dist(a, c))
const par = (a, b, c, d) => Math.abs(crs(sub(b, a), sub(d, c))) < E * (1 + dist(a, b) * dist(c, d))
const perp = (a, b, c, d) => Math.abs(dot(sub(b, a), sub(d, c))) < E * (1 + dist(a, b) * dist(c, d))
const eq = (x, y) => Math.abs(x - y) < E * (1 + Math.abs(x) + Math.abs(y))
const same = (p, q) => dist(p, q) < E
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, dot(sub(p, a), d) / dot(d, d)) }
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c); const t = crs(sub(c, a), s) / crs(r, s); return add(a, mul(r, t)) }
const gocDo = (v, p, q) => { const u = sub(p, v), w = sub(q, v); return Math.acos(Math.max(-1, Math.min(1, dot(u, w) / (Math.hypot(...u) * Math.hypot(...w))))) * 180 / Math.PI }
const cc = (t1, t2) => eq(dist(t1[0], t1[1]), dist(t2[0], t2[1])) && eq(dist(t1[1], t1[2]), dist(t2[1], t2[2])) && eq(dist(t1[0], t1[2]), dist(t2[0], t2[2])) // hai tam giác bằng nhau theo thứ tự đỉnh (SSS)
const rnd = (a, b) => a + Math.random() * (b - a)
const onSeg = (p, a, b) => coll(a, p, b) && dot(sub(p, a), sub(p, b)) < 0

// mỗi hàm trả về danh sách [nhãn, đúng?]; chạy 5 bộ toạ độ ngẫu nhiên
function kiem126() {
  const A = P(0, 0), b = rnd(2, 4), c = rnd(b * 1.05, 7), B = P(0, b), C = P(c, 0)
  const AB = dist(A, B), BC = dist(B, C), D = lerp(A, C, AB / (AB + BC))
  const r = []
  r.push(['D là chân phân giác (∠ABD=∠DBC)', eq(gocDo(B, A, D), gocDo(B, D, C))])
  const E1 = lerp(B, C, AB / BC)
  r.push(['B1: △ABD=△EBD', cc([A, B, D], [E1, B, D])])
  r.push(['B2: DE=DA, DE⊥BC', eq(dist(D, E1), dist(D, A)) && perp(D, E1, B, C)])
  r.push(['B3: BD⊥AE', perp(B, D, A, E1)])
  r.push(['B4: BD trung trực AE', perp(B, D, A, E1) && coll(B, D, mid(A, E1))])
  const F = add(A, mul(sub(A, B), dist(C, E1) / AB))
  r.push(['B5: F,D,E thẳng hàng (F trên tia đối AB, AF=CE)', coll(F, D, E1) && dot(sub(F, A), sub(B, A)) < 0 && eq(dist(A, F), dist(C, E1))])
  const E2 = foot(D, B, C)
  r.push(['N2: E là chân đường vuông góc từ D lên BC, trong đoạn BC', onSeg(E2, B, C)])
  r.push(['B6: △ABD=△EBD (DE⊥BC)', cc([A, B, D], [E2, B, D])])
  const Q = inter(B, A, E2, D)
  r.push(['N2a: Q thuộc TIA BA và TIA ED', dot(sub(Q, B), sub(A, B)) > 0 && dot(sub(Q, E2), sub(D, E2)) > 0])
  r.push(['B7: DQ=DC', eq(dist(D, Q), dist(D, C))])
  r.push(['B8: B,D,M thẳng hàng (M trung điểm QC)', coll(B, D, mid(Q, C))])
  return r
}
function kiem130() {
  const A = P(0, 0), t1 = rnd(0, 1), t2 = rnd(1.3, 2.4), r1 = rnd(2, 3), r2 = rnd(r1 * 1.15, 6)
  const B = P(r1 * Math.cos(t1), r1 * Math.sin(t1)), C = P(r2 * Math.cos(t2), r2 * Math.sin(t2))
  const AB = dist(A, B), AC = dist(A, C), I = lerp(B, C, AB / (AB + AC)), K = lerp(A, C, AB / AC)
  const r = []
  r.push(['AB<AC, K thuộc đoạn AC, AK=AB, AI phân giác', AB < AC && onSeg(K, A, C) && eq(dist(A, K), AB) && eq(gocDo(A, B, I), gocDo(A, I, C))])
  r.push(['B1: △ABI=△AKI', cc([A, B, I], [A, K, I])])
  const O = inter(A, I, B, K)
  r.push(['B2: AI⊥BK tại O', perp(A, I, B, K) && coll(A, I, O) && coll(B, K, O)])
  const E_ = inter(A, B, K, I)
  r.push(['B3: △BIE=△KIC', cc([B, I, E_], [K, I, C])])
  r.push(['B4: BK∥EC', par(B, K, E_, C)])
  r.push(['B5: A,I,H thẳng hàng (H trung điểm EC)', coll(A, I, mid(E_, C))])
  return r
}
function kiem131(vuong) {
  let A, B, C
  if (vuong) { const b = rnd(2, 4), c = rnd(2, 5); A = P(0, 0); B = P(0, b); C = P(c, 0) } else { A = P(rnd(-1, 1), rnd(2, 4)); B = P(rnd(-4, -1), 0); C = P(rnd(1, 4), rnd(-0.5, 0.5)) }
  const M = mid(B, C), D = dx(A, M), r = []
  if (!vuong) {
    r.push(['B1: △AMB=△DMC và AB=DC', cc([A, M, B], [D, M, C]) && eq(dist(A, B), dist(D, C))])
    r.push(['B2: BD∥AC', par(B, D, A, C)])
    r.push(['B3: △ABC=△DCB', cc([A, B, C], [D, C, B])])
    const I = foot(M, A, C), K = foot(M, B, D)
    r.push(['B4: I,M,K thẳng hàng', coll(I, M, K)])
    r.push(['B5: AH=DK', eq(dist(A, foot(A, B, C)), dist(D, foot(D, B, C)))])
    const I2 = mid(A, C), E1 = dx(B, I2)
    r.push(['B6: E,C,D thẳng hàng', coll(E1, C, D)])
    const E2 = dx(D, C)
    r.push(['B7: AE=BC', eq(dist(A, E2), dist(B, C))])
    r.push(['B8: B,F,E thẳng hàng (F trung điểm AC)', coll(B, mid(A, C), E2)])
    const N = mid(A, B), K2 = dx(C, N)
    r.push(['B11: D,B,K thẳng hàng', coll(D, B, K2)])
    const E3 = foot(C, B, D), F = foot(B, A, C)
    r.push(['B12: DE=AF', eq(dist(D, E3), dist(A, F))])
  } else {
    r.push(['N5: ∠A=90°', Math.abs(gocDo(A, B, C) - 90) < 1e-6])
    r.push(['B9: AC⊥CD', perp(A, C, C, D)])
    r.push(['B10: BC=2AM', eq(dist(B, C), 2 * dist(A, M))])
  }
  return r
}
function kiem132() {
  const w = rnd(1.5, 3), h = rnd(2, 4), A = P(0, h), B = P(-w, 0), C = P(w, 0), D = P(0, 0), r = []
  r.push(['gốc: AB=AC, D thuộc BC, AD phân giác', eq(dist(A, B), dist(A, C)) && eq(gocDo(A, B, D), gocDo(A, D, C)) && coll(B, D, C)])
  r.push(['B1: △ABD=△ACD', cc([A, B, D], [A, C, D])])
  r.push(['B2/B3: D trung điểm BC và AD⊥BC', same(D, mid(B, C)) && perp(A, D, B, C)])
  r.push(['B4: ∠ABC=∠ACB', eq(gocDo(B, A, C), gocDo(C, A, B))])
  const M = foot(D, A, B), N = lerp(A, C, dist(A, M) / dist(A, C))
  r.push(['B5: △ADM=△ADN, DN⊥AC', cc([A, D, M], [A, D, N]) && perp(D, N, A, C)])
  const K = mid(C, N), E1 = dx(D, K)
  r.push(['B6: M,N,E thẳng hàng', coll(M, N, E1)])
  const Eb = foot(D, A, B), Fb = foot(D, A, C)
  r.push(['B7,B8: DE=DF, AE=AF', eq(dist(D, Eb), dist(D, Fb)) && eq(dist(A, Eb), dist(A, Fb))])
  r.push(['B9: A,I,D thẳng hàng (I trung điểm EF)', coll(A, mid(Eb, Fb), D)])
  const Kb = inter(A, D, Eb, Fb)
  r.push(['B10,B11: AK⊥EF, EF∥BC', perp(A, Kb, Eb, Fb) && par(Eb, Fb, B, C)])
  const G = inter(C, add(C, sub(D, A)), B, A)
  r.push(['N: G thuộc TIA BA; B12: A trung điểm BG', dot(sub(G, B), sub(A, B)) > 0 && same(mid(B, G), A)])
  let ok = true
  for (let i = 0; i < 4; i++) { const t = rnd(0, 1), Pp = lerp(A, D, t); ok = ok && eq(dist(Pp, B), dist(Pp, C)) }
  r.push(['B13: PB=PC (P bất kì trên AD)', ok])
  const s = rnd(0.2, 0.9), H = lerp(A, B, s), K2 = lerp(A, C, s), I = inter(H, K2, A, D)
  r.push(['B14,B15: AI⊥HK, HK∥BC', perp(A, I, H, K2) && par(H, K2, B, C)])
  const u = rnd(0.3, 2), Ef = add(B, mul(sub(B, C), u)), Ff = add(C, mul(sub(C, B), u))
  r.push(['B16,B17: AE=AF, AD phân giác ∠EAF', eq(dist(A, Ef), dist(A, Ff)) && eq(gocDo(A, Ef, D), gocDo(A, D, Ff))])
  const Ay = add(A, sub(C, B)), Cx = add(C, P(0, 1))
  r.push(['N: tia Ay nằm cùng phía C so với AB; Cx cùng phía A so với BC', crs(sub(B, A), sub(Ay, A)) * crs(sub(B, A), sub(C, A)) > 0 && Cx[1] > 0])
  r.push(['B18: ∠yAC=∠ABC', eq(gocDo(A, Ay, C), gocDo(B, A, C))])
  r.push(['B19: AD∥Cx', par(A, D, C, Cx)])
  const Kx = inter(A, Ay, C, Cx)
  r.push(['B20: I trung điểm DK (I trung điểm AC)', same(mid(D, Kx), mid(A, C))])
  const Pm = mid(A, C), Qm = mid(A, B)
  r.push(['B21: BP=CQ', eq(dist(B, Pm), dist(C, Qm))])
  r.push(['B22: A trung điểm MN', same(mid(dx(B, Pm), dx(C, Qm)), A)])
  const Gc = inter(B, Pm, C, Qm)
  r.push(['B23: A,G,D thẳng hàng', coll(A, Gc, D)])
  return r
}
function kiem133() {
  const A = P(rnd(-1, 1), rnd(2, 4)), B = P(rnd(-4, -1), 0), C = P(rnd(1, 4), rnd(-0.5, 0.5))
  const D = mid(A, C), Ee = mid(A, B), M = dx(B, D), N = dx(C, Ee)
  return [['B1: AM=BC', eq(dist(A, M), dist(B, C))], ['B2: AM∥BC', par(A, M, B, C)], ['B3: A trung điểm MN', same(mid(M, N), A)]]
}
const KIEM = { 'MH.126': [kiem126], 'MH.130': [kiem130], 'MH.131': [() => kiem131(false), () => kiem131(true)], 'MH.132': [kiem132], 'MH.133': [kiem133] }

let hong = 0, phep = 0
for (const [ma, fs_] of Object.entries(KIEM)) {
  for (const f of fs_) for (let l = 0; l < 6; l++) for (const [ten, ok] of f()) { phep++; if (!ok) { hong++; console.error(`✗ ${ma}: ${ten} (lần ${l + 1})`) } }
}
console.log(`kiểm toạ độ: ${phep} phép, sai ${hong}`)
if (hong) { console.error('Có khẳng định sai ⇒ DỪNG, không ghi gì.'); process.exit(1) }

// kiểm cấu trúc dữ liệu: khoá tiền đề tồn tại, tiền đề nằm ở nhánh tổ tiên/chính nhánh, mỗi cha ≤ 1 nhánh chính, LaTeX sạch
for (const [ma, d] of Object.entries(MH)) {
  const cha = Object.fromEntries(d.nodes.map((n) => [n.k, n.cha]))
  const duong = (k) => { const o = []; while (k !== 'goc') { o.push(k); k = cha[k] } o.push('goc'); return o }
  const bai = Object.fromEntries(d.bai.map((b) => [b.k, b]))
  const chinh = {}
  for (const n of d.nodes) { if (n.cha !== 'goc' && !cha[n.cha]) throw new Error(`${ma}: nhánh ${n.k} có cha ${n.cha} không tồn tại`); if (n.chinh) { if (chinh[n.cha]) throw new Error(`${ma}: ${n.cha} có 2 nhánh chính`); chinh[n.cha] = n.k } }
  d.bai.forEach((b, i) => {
    if (b.l !== 'goc' && !cha[b.l]) throw new Error(`${ma}.${b.k}: nhánh ${b.l} không tồn tại`)
    for (const t of b.td) {
      if (!bai[t] || d.bai.indexOf(bai[t]) >= i) throw new Error(`${ma}.${b.k}: tiền đề ${t} chưa có`)
      if (!duong(b.l).includes(bai[t].l)) throw new Error(`${ma}.${b.k}: tiền đề ${t} ở nhánh ${bai[t].l} không nằm trên đường của ${b.l} (sai nhánh)`)
    }
  })
  for (const s of [...d.nodes.map((n) => n.gt), ...d.bai.map((b) => b.pb), d.gtMoi ?? '']) {
    if ((s.match(/\$/g) || []).length % 2) throw new Error(`${ma}: số dấu $ lẻ ở "${s.slice(0, 50)}"`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) if (/(?<![\\a-zA-Z])(triangle|widehat|perp|parallel|angle)\b/.test(m[1])) throw new Error(`${ma}: lệnh LaTeX mất \\ ở ${m[1]}`)
  }
}

// ───────────────────────── GHI DB ─────────────────────────
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  let tN = 0, tB = 0
  for (const [ma, d] of Object.entries(MH)) {
    const goc = (await q(`select id, gia_thiet, phan, khoi, chu_de_id from hinh_mo_hinh where ma = $1 and khoi = '7' and phan = 'luyen' and la_mo_hinh`, [ma]))[0]
    if (!goc) throw new Error(`Không thấy ${ma} (khối 7, luyen)`)
    if (goc.chu_de_id !== 'NCD00210') throw new Error(`${ma} không thuộc NCD00210`)
    const nBai = +(await q(`select count(*) n from hinh_baitoan where mo_hinh_id = $1`, [goc.id]))[0].n
    const nCon = +(await q(`select count(*) n from hinh_mo_hinh_cha where cha_id = $1`, [goc.id]))[0].n
    if (nCon || nBai > (d.baiCoSan ?? 0)) throw new Error(`${ma} đã có ${nBai} bài, ${nCon} nhánh — đã dựng rồi hoặc Thùy đang dựng? Không chạy đè.`)
    if (d.gtMoi) {
      const r = await q(`update hinh_mo_hinh set gia_thiet = $2, updated_at = now() where id = $1 and gia_thiet = $3 returning id`, [goc.id, d.gtMoi, d.gtCu])
      console.log(`${ma}: giả thiết gốc ${r.length ? 'đã bọc LaTeX' : 'KHÔNG đổi (nội dung đã khác bản lúc đọc — Thùy vừa sửa?)'}`)
    }
    const id = { goc: goc.id }
    for (const n of d.nodes) {
      await q(`select fn_hl_them_gia_thiet($1, $2, $3, $4)`, [id[n.cha], n.ten, n.gt, n.chinh])
      id[n.k] = (await q(`select m.id from hinh_mo_hinh m join hinh_mo_hinh_cha h on h.mo_hinh_id = m.id where h.cha_id = $1 and m.gia_thiet_them = $2`, [id[n.cha], n.gt]))[0].id
    }
    const bai = {}
    for (const b of d.bai) {
      bai[b.k] = (await q(`select fn_hl_them_bai($1, $2, null, null, null, $3::uuid[]) v`, [id[b.l], b.pb, b.td.map((x) => bai[x])]))[0].v.bai_moi
    }
    const so = new Map((await q(`select baitoan_id, so, ma from fn_hl_so_hien_thi($1)`, [goc.id])).map((r) => [r.baitoan_id, r]))
    console.log(`\n${ma}: +${d.nodes.length} nhánh · +${d.bai.length} bài (đã có sẵn ${nBai})`)
    console.log('  ' + d.bai.map((b) => `${b.k}→${so.get(bai[b.k])?.so}`).join('  '))
    const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [goc.id])
    if (sai.length) throw new Error(`${ma}: có bài sai nhánh: ` + JSON.stringify(sai))
    tN += d.nodes.length; tB += d.bai.length
  }
  console.log(`\nTỔNG: +${tN} nhánh giả thiết · +${tB} bài · sai nhánh 0`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
