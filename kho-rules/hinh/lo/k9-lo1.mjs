// k9-lo1.mjs — LÔ THỬ 1 khối 9 (Hình · Đường tròn) — bước 1 "rút luật giải" (kho-rules/README.md §0, §2 B4).
// 22 câu, mỗi câu một dạng (bảng dạng ↔ lô ở kho-rules/hgt/k9.md §6). CHƯA ghi DB — chờ CEO duyệt trong chat.
// Mỗi câu: đề (nguyên văn sách, thêm dữ kiện chỉ có trên hình vào đề) · Phần 1 · Phần 2 · hinh(): toạ độ dựng THEO ĐỀ
// ⇒ cùng bộ toạ độ: máy KIỂM mệnh đề/đáp số (kiem) + VẼ hình (spec). Điểm "bất kì" thử ≥2 cấu hình (cauHinh).
// Chạy: node scripts/kho/hinh-lo.mjs kho-rules/hgt/lo/k9-lo1.mjs --ra kho-rules/hgt/hinh
import {
  P, sub, add, mul, mid, kc, tren, chieu, giaoDT, giaoDTvaTron, giaoHaiTron, tiepDiem, goc, thangHang, vuongGoc, gan, doiXungTam,
} from '../../../scripts/kho/hinh-toado.mjs'

export const KHOI = '9'
export const SACH = {
  NDT: 'Ngô Đức Tài · Lý thuyết và phân dạng Toán 9 · Chương V Đường tròn',
  TC: 'Thầy Cường Pleiku · Tài liệu học thêm Toán 9 HK2 · Hình học',
  NT: 'THCS Nguyễn Trãi · Tài liệu học tập Toán 9 HK1 2025–2026',
}
const S = String.raw
const pTiep = (O, M, t = 1) => add(M, mul(P(-(M.y - O.y), M.x - O.x), t)) // điểm thứ hai trên tiếp tuyến tại M

export const CAU = [
  // ───────────────────────────── BÀI 1. MỞ ĐẦU VỀ ĐƯỜNG TRÒN ─────────────────────────────
  {
    so: 1, sach: 'NDT', ma: 'B1 VD2', dang: 'B1·D1 Chứng minh nhiều điểm cùng thuộc một đường tròn', loai: 'tu_luan',
    de: S`Cho tam giác $ABC$, các đường cao $BD$ và $CE$. Trên cạnh $AC$ lấy điểm $M$. Kẻ tia $Cx$ vuông góc với tia $BM$ tại $F$. Chứng minh rằng năm điểm $B, C, D, E, F$ cùng thuộc một đường tròn.`,
    p1: S`**Mấu chốt:** ba tam giác $BDC$, $BEC$, $BFC$ đều vuông và **chung cạnh huyền $BC$** ⇒ các đỉnh góc vuông $D$, $E$, $F$ đều cách trung điểm của $BC$ một khoảng bằng $\dfrac{BC}{2}$.
**Vì sao nghĩ ra:** đề cho toàn góc vuông có hai cạnh đi qua $B$ và $C$ (đường cao $BD$, $CE$; $CF\perp BM$) — "nhiều góc vuông cùng nhìn một đoạn" là dấu hiệu lấy trung điểm đoạn đó làm tâm.
**Các bước:** gọi $I$ là trung điểm $BC$ → lần lượt xét ba tam giác vuông, dùng "trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" → năm điểm cách đều $I$.
**Chú ý:** mỗi tam giác phải nói rõ góc vuông ở đâu và vì sao (đường cao ⇒ vuông góc).`,
    p2: S`Gọi $I$ là trung điểm của $BC$.
Vì $BD$ là đường cao của $\triangle ABC$ nên $\widehat{BDC}=90^\circ$.
Xét $\triangle BDC$ vuông tại $D$ có $DI$ là đường trung tuyến ứng với cạnh huyền nên $DI=\dfrac{BC}{2}=IB=IC$. (1)
Vì $CE$ là đường cao của $\triangle ABC$ nên $\widehat{BEC}=90^\circ$.
Xét $\triangle BEC$ vuông tại $E$ có $EI$ là đường trung tuyến ứng với cạnh huyền nên $EI=\dfrac{BC}{2}$. (2)
Vì $CF\perp BM$ tại $F$ nên $\widehat{BFC}=90^\circ$.
Xét $\triangle BFC$ vuông tại $F$ có $FI$ là đường trung tuyến ứng với cạnh huyền nên $FI=\dfrac{BC}{2}$. (3)
Từ (1), (2), (3) suy ra $IB=IC=ID=IE=IF=\dfrac{BC}{2}$.
Vậy năm điểm $B, C, D, E, F$ cùng thuộc đường tròn tâm $I$, bán kính $\dfrac{BC}{2}$.`,
    cauHinh: [0.68, 0.85],
    hinh(t = 0.68) {
      const A = P(1.2, 4.4), B = P(0, 0), C = P(6, 0)
      const D = chieu(B, A, C), E = chieu(C, A, B), M = add(A, mul(sub(C, A), t)), F = chieu(C, B, M), I = mid(B, C)
      const xa = (X) => kc(I, X)
      return {
        kiem: [
          { ten: 'ID = IB', a: xa(D), b: xa(B) }, { ten: 'IE = IB', a: xa(E), b: xa(B) }, { ten: 'IF = IB', a: xa(F), b: xa(B) },
          { ten: 'IC = IB', a: xa(C), b: xa(B) },
        ],
        spec: {
          diem: { A, B, C, D, E, M, F, I }, diemPhu: ['I'],
          doan: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['B', 'D'], ['C', 'E'], ['B', kc(B, F) > kc(B, M) ? 'F' : 'M'], ['C', 'F']],
          vuong: [['D', 'B', 'C'], ['E', 'C', 'B'], ['F', 'C', 'B']],
          tron: [{ tam: 'I', qua: 'B', phu: true }],
        },
      }
    },
  },
  {
    so: 2, sach: 'NDT', ma: 'B1 TL3', dang: 'B1·D2 Vị trí tương đối của điểm và đường tròn', loai: 'tra_loi_ngan',
    de: S`Trong mặt phẳng toạ độ $Oxy$, cho các điểm $M(0;2)$, $N(0;-3)$ và $P(2;-1)$. Vẽ hình và cho biết trong các điểm đã cho, điểm nào nằm trên, điểm nào nằm trong, điểm nào nằm ngoài đường tròn $(O;\sqrt5)$? Vì sao?`,
    da: S`$M$ nằm trong, $N$ nằm ngoài, $P$ nằm trên đường tròn $(O;\sqrt5)$`,
    p1: S`**Mấu chốt:** vị trí của một điểm so với đường tròn $(O;R)$ chỉ phụ thuộc **khoảng cách từ điểm đó tới tâm** so với $R$: bằng $R$ ⇒ nằm trên, nhỏ hơn ⇒ nằm trong, lớn hơn ⇒ nằm ngoài.
**Các bước:** tính $OM$, $ON$ (điểm nằm trên trục tung nên đọc ngay từ toạ độ); $OP$ thì kẻ hình chiếu $H$ của $P$ xuống trục $Ox$ để có tam giác vuông $OHP$ rồi dùng định lí Pythagore → so từng khoảng cách với $\sqrt5$.
**Chú ý:** so sánh số với căn bằng cách đưa cả hai vào căn: $2=\sqrt4<\sqrt5$, $3=\sqrt9>\sqrt5$. Lớp 9 chưa học công thức khoảng cách giữa hai điểm theo toạ độ — phải đi qua tam giác vuông.`,
    p2: S`Ta có $OM=2=\sqrt4<\sqrt5$ nên điểm $M$ nằm trong đường tròn $(O;\sqrt5)$.
$ON=3=\sqrt9>\sqrt5$ nên điểm $N$ nằm ngoài đường tròn $(O;\sqrt5)$.
Gọi $H(2;0)$ là hình chiếu của $P$ trên trục $Ox$, ta có $OH=2$, $HP=1$.
Xét $\triangle OHP$ vuông tại $H$ có $OP=\sqrt{OH^2+HP^2}=\sqrt{2^2+1^2}=\sqrt5$ (định lí Pythagore).
Vậy điểm $P$ nằm trên đường tròn $(O;\sqrt5)$.`,
    hinhDe: false,
    hinh() {
      const O = P(0, 0), M = P(0, 2), N = P(0, -3), Pp = P(2, -1), H = P(2, 0), r = Math.sqrt(5)
      return {
        kiem: [{ ten: 'OM < √5', dat: kc(O, M) < r }, { ten: 'ON > √5', dat: kc(O, N) > r }, { ten: 'OP = √5', a: kc(O, Pp), b: r }],
        spec: {
          diem: { O, M, N, P: Pp, H, X1: P(-3.4, 0), X2: P(3.6, 0), Y1: P(0, -3.6), Y2: P(0, 3.2) }, an: ['X1', 'X2', 'Y1', 'Y2'],
          doan: [['X1', 'X2'], ['Y1', 'Y2'], { d: ['P', 'H'], phu: true }, { d: ['O', 'P'], phu: true }],
          tron: [{ tam: 'O', r }], nhanLech: { O: [-14, 16], M: [-16, -6], N: [-16, 8], H: [12, -12] },
          chu: [{ tai: 'X2', text: 'x', dx: 4, dy: 22, nghieng: true }, { tai: 'Y2', text: 'y', dx: 14, dy: 4, nghieng: true }],
        },
      }
    },
  },
  {
    so: 3, sach: 'NDT', ma: 'B1 TN7', dang: 'B1·D3 Tâm đối xứng, trục đối xứng của đường tròn', loai: 'trac_nghiem',
    de: S`Tìm khẳng định sai trong các khẳng định sau:`,
    lc: [
      S`Tâm của đường tròn là tâm đối xứng của đường tròn đó.`,
      S`Bất kì đường kính nào cũng là trục đối xứng của đường tròn đó.`,
      S`Nếu $A$ là một điểm của đường tròn $(O)$ thì ta nói đường tròn $(O)$ đi qua điểm $A$.`,
      S`Hai điểm $M$ và $M'$ gọi là đối xứng nhau qua điểm $I$ nếu $I$ nằm giữa đoạn thẳng $MM'$.`,
    ],
    da: 'D',
    p1: S`**Mấu chốt:** đối chiếu từng phương án với đúng **định nghĩa** trong lý thuyết. Hai điểm đối xứng qua $I$ đòi hỏi $I$ là **trung điểm** của $MM'$ — "nằm giữa" thì chưa đủ (điểm nằm giữa có thể lệch về một phía).
**Các bước:** A, B là hai tính chất đối xứng của đường tròn (đúng); C là cách nói "đường tròn đi qua điểm" (đúng); D thiếu điều kiện trung điểm ⇒ sai.`,
    p2: S`A đúng: tâm của đường tròn là tâm đối xứng của nó.
B đúng: mỗi đường thẳng đi qua tâm (chứa một đường kính) là một trục đối xứng của đường tròn.
C đúng: theo cách nói "đường tròn $(O)$ đi qua điểm $A$" khi $A\in(O)$.
D sai: $M$ và $M'$ đối xứng nhau qua $I$ khi $I$ là trung điểm của $MM'$, không chỉ là nằm giữa $M$ và $M'$.
Chọn D.`,
    hinhDe: false, hinhLG: false,
  },
  // ───────────────────────────── BÀI 2. CUNG VÀ DÂY ─────────────────────────────
  {
    so: 4, sach: 'NDT', ma: 'B2 VD2', dang: 'B2·D1 So sánh hai đoạn thẳng', loai: 'tu_luan',
    de: S`Cho đường tròn đường kính $BC$. Chứng minh rằng với điểm $A$ bất kì (khác $B$ và $C$) nằm trên đường tròn, ta đều có $BC<AB+AC<2BC$.`,
    p1: S`**Mấu chốt:** hai bất đẳng thức đến từ hai nguồn khác nhau: vế trái là **bất đẳng thức tam giác**; vế phải là **"đường kính là dây lớn nhất"** — $AB$, $AC$ là dây không đi qua tâm nên mỗi dây nhỏ hơn đường kính $BC$.
**Vì sao nghĩ ra:** đề so tổng hai dây với đường kính ⇒ nghĩ ngay tới định lí so sánh dây và đường kính (bài Cung và dây).
**Các bước:** chỉ ra $A, B, C$ không thẳng hàng (để có tam giác) → bất đẳng thức tam giác → mỗi dây $AB$, $AC$ nhỏ hơn $BC$ → cộng lại.
**Chú ý:** phải nói vì sao $AB$, $AC$ không đi qua tâm ($A$ khác $B$, $C$) thì mới được dấu "<" chặt.`,
    p2: S`Vì $A$ nằm trên đường tròn và khác $B$, $C$ nên $A$, $B$, $C$ không thẳng hàng.
Xét $\triangle ABC$ có $BC<AB+AC$ (bất đẳng thức tam giác). (1)
Vì $A$ khác $B$ và $C$ nên các dây $AB$, $AC$ không đi qua tâm của đường tròn.
Mà $BC$ là đường kính nên $AB<BC$ và $AC<BC$ (đường kính là dây lớn nhất).
Suy ra $AB+AC<2BC$. (2)
Từ (1) và (2) suy ra $BC<AB+AC<2BC$.`,
    cauHinh: [118, 70, 150],
    hinh(t = 118) {
      const O = P(0, 0), R = 3, B = P(-R, 0), C = P(R, 0), A = tren(O, R, t)
      const ab = kc(A, B), ac = kc(A, C), bc = kc(B, C)
      return {
        kiem: [{ ten: 'BC < AB+AC', dat: bc < ab + ac }, { ten: 'AB+AC < 2BC', dat: ab + ac < 2 * bc }],
        spec: { diem: { O, B, C, A }, tron: [{ tam: 'O', r: R }], doan: [['B', 'C'], ['A', 'B'], ['A', 'C']] },
      }
    },
  },
  {
    so: 5, sach: 'NDT', ma: 'B2 TN7', dang: 'B2·D2 Nhận biết góc ở tâm, cung tròn', loai: 'trac_nghiem',
    de: S`Cho đường tròn $(O)$ và ba điểm $A$, $B$, $C$ nằm trên đường tròn như hình vẽ, biết $\widehat{COA}=50^\circ$, $\widehat{AOB}=30^\circ$ và tia $OA$ nằm giữa hai tia $OC$, $OB$. Số đo cung $CnB$ (cung $CB$ không chứa điểm $A$) là`,
    lc: [S`$280^\circ$.`, S`$100^\circ$.`, S`$80^\circ$.`, S`$60^\circ$.`],
    da: 'A',
    p1: S`**Mấu chốt:** cung $CnB$ là **cung lớn** $CB$ (cung không chứa $A$). Số đo cung lớn $=360^\circ-$ số đo cung nhỏ có cùng hai mút; số đo cung nhỏ $=$ số đo góc ở tâm chắn nó.
**Các bước:** tia $OA$ nằm giữa $OC$, $OB$ ⇒ cộng góc: $\widehat{COB}=50^\circ+30^\circ$ → cung nhỏ $CB$ → lấy $360^\circ$ trừ đi.
**Chú ý:** bẫy chọn $80^\circ$ (là cung nhỏ $CB$, chứa $A$) hoặc $100^\circ$.`,
    p2: S`Vì tia $OA$ nằm giữa hai tia $OC$, $OB$ nên $\widehat{COB}=\widehat{COA}+\widehat{AOB}=50^\circ+30^\circ=80^\circ$.
Suy ra số đo cung nhỏ $CB$ (chứa $A$) bằng $80^\circ$.
Cung $CnB$ là cung lớn $CB$ nên sđ$\overset{\frown}{CnB}=360^\circ-80^\circ=280^\circ$.
Chọn A.`,
    hinh() {
      const O = P(0, 0), R = 3, B = tren(O, R, -12), A = tren(O, R, 18), C = tren(O, R, 68)
      return {
        kiem: [{ ten: 'COA = 50', a: goc(C, O, A), b: 50 }, { ten: 'AOB = 30', a: goc(A, O, B), b: 30 }, { ten: 'cung lớn CB = 280', a: 360 - goc(C, O, B), b: 280 }],
        spec: {
          diem: { O, A, B, C, n: tren(O, R + 0.45, 215) }, an: ['n'],
          tron: [{ tam: 'O', r: R }], doan: [['O', 'A'], ['O', 'B'], ['O', 'C']],
          goc: [{ dinh: 'O', a: 'A', b: 'C', nhan: '50°', r: 30 }, { dinh: 'O', a: 'B', b: 'A', nhan: '30°', r: 46 }],
          chu: [{ tai: 'n', text: 'n', dy: 8, nghieng: true }], nhanLech: { O: [-14, 18] },
        },
      }
    },
  },
  {
    so: 6, sach: 'NDT', ma: 'B2 VD6', dang: 'B2·D3 Tính số đo góc ở tâm, số đo cung', loai: 'tra_loi_ngan',
    de: S`Cho $C$ là điểm trên đường tròn $(O)$. Đường trung trực của đoạn $OC$ cắt $(O)$ tại $A$ và $B$. Tính số đo của các cung $ACB$ và $ABC$.`,
    da: S`sđ$\overset{\frown}{ACB}=120^\circ$; sđ$\overset{\frown}{ABC}=300^\circ$`,
    p1: S`**Mấu chốt:** $A$ nằm trên trung trực của $OC$ nên $AO=AC$; lại có $AO=OC$ (bán kính) ⇒ **tam giác $OAC$ đều** ⇒ $\widehat{AOC}=60^\circ$. Tương tự $\widehat{BOC}=60^\circ$.
**Vì sao nghĩ ra:** "trung trực của một bán kính" luôn sinh ra tam giác có ba cạnh bằng bán kính.
**Các bước:** tam giác $OAC$, $OBC$ đều → hai cung nhỏ $AC$, $CB$ đều $60^\circ$ → cung $ACB$ (đi từ $A$ qua $C$ tới $B$) là tổng hai cung → cung $ABC$ (đi từ $A$ qua $B$ tới $C$) là phần còn lại của cung nhỏ $AC$.
**Chú ý:** đọc tên cung ba chữ: chữ giữa là điểm mà cung **đi qua**. Cung $ABC$ là cung $AC$ chứa $B$, không phải cung $AB$.`,
    p2: S`Vì $A$ nằm trên đường trung trực của $OC$ nên $AO=AC$.
Mà $AO=OC$ (bán kính) nên $AO=AC=OC$, suy ra $\triangle OAC$ đều, do đó $\widehat{AOC}=60^\circ$.
Chứng minh tương tự, $\triangle OBC$ đều nên $\widehat{BOC}=60^\circ$.
Suy ra sđ$\overset{\frown}{AC}=60^\circ$, sđ$\overset{\frown}{CB}=60^\circ$ (các cung nhỏ).
sđ$\overset{\frown}{ACB}=$ sđ$\overset{\frown}{AC}+$ sđ$\overset{\frown}{CB}=60^\circ+60^\circ=120^\circ$.
sđ$\overset{\frown}{ABC}=360^\circ-$ sđ$\overset{\frown}{AC}=360^\circ-60^\circ=300^\circ$.`,
    hinh() {
      const O = P(0, 0), R = 3, C = tren(O, R, 90), Hm = mid(O, C)
      const [B, A] = giaoDTvaTron(add(Hm, P(-5, 0)), add(Hm, P(5, 0)), O, R) // trái = B, phải = A
      return {
        kiem: [
          { ten: 'AOC = 60', a: goc(A, O, C), b: 60 }, { ten: 'BOC = 60', a: goc(B, O, C), b: 60 },
          { ten: 'cung ACB = 120', a: goc(A, O, C) + goc(C, O, B), b: 120 }, { ten: 'cung ABC = 300', a: 360 - goc(A, O, C), b: 300 },
        ],
        spec: {
          diem: { O, C, A, B, H: Hm }, an: ['H'],
          tron: [{ tam: 'O', r: R }], doan: [['O', 'C'], ['A', 'B'], { d: ['O', 'A'], phu: true }, { d: ['A', 'C'], phu: true }, { d: ['O', 'B'], phu: true }, { d: ['B', 'C'], phu: true }],
          vuong: [['H', 'C', 'A']], gach: [{ d: ['O', 'H'] }, { d: ['H', 'C'] }], nhanLech: { O: [0, 24] },
        },
      }
    },
  },
  {
    so: 7, sach: 'NDT', ma: 'B2 TL14', dang: 'B2·D4 Tính độ dài dây, khoảng cách từ tâm đến dây', loai: 'tra_loi_ngan',
    de: S`Cho đường tròn $(O;R)$ có hai dây cung song song $AB=R\sqrt2$ và $CD=R\sqrt3$ nằm về hai phía khác nhau so với tâm $O$. Tính khoảng cách giữa hai dây cung $AB$ và $CD$ theo $R$.`,
    da: S`$\dfrac{(\sqrt2+1)R}{2}$`,
    p1: S`**Mấu chốt:** khoảng cách từ tâm tới một dây tính bằng tam giác vuông "bán kính – nửa dây – khoảng cách". Hai dây song song ở hai phía tâm ⇒ đường vuông góc chung qua $O$, khoảng cách giữa hai dây $=$ tổng hai khoảng cách từ tâm.
**Các bước:** kẻ $OH\perp AB$, $OK\perp CD$ → vì $AB\parallel CD$ nên $H, O, K$ thẳng hàng và $O$ nằm giữa → tam giác $OAB$ cân tại $O$ nên $H$ là trung điểm $AB$ → Pythagore trong $\triangle OHA$ ra $OH$; làm y hệt với $CD$ ra $OK$ → cộng.
**Chú ý:** nếu hai dây **cùng phía** tâm thì khoảng cách là **hiệu** $OH-OK$ — đọc kĩ "hai phía khác nhau".`,
    p2: S`Kẻ $OH\perp AB$ tại $H$, $OK\perp CD$ tại $K$.
Vì $AB\parallel CD$ nên $OK\perp AB$, do đó $H$, $O$, $K$ thẳng hàng.
Vì $AB$, $CD$ nằm về hai phía của $O$ nên $O$ nằm giữa $H$ và $K$, suy ra $HK=OH+OK$.
Xét $\triangle OAB$ cân tại $O$ ($OA=OB=R$) có $OH$ là đường cao nên $OH$ cũng là đường trung tuyến, suy ra $AH=\dfrac{AB}{2}=\dfrac{R\sqrt2}{2}$.
Xét $\triangle OHA$ vuông tại $H$ có $OH=\sqrt{OA^2-AH^2}=\sqrt{R^2-\dfrac{R^2}{2}}=\dfrac{R\sqrt2}{2}$.
Tương tự, $CK=\dfrac{CD}{2}=\dfrac{R\sqrt3}{2}$ và $OK=\sqrt{OC^2-CK^2}=\sqrt{R^2-\dfrac{3R^2}{4}}=\dfrac{R}{2}$.
Vậy khoảng cách giữa hai dây $AB$ và $CD$ là $HK=\dfrac{R\sqrt2}{2}+\dfrac{R}{2}=\dfrac{(\sqrt2+1)R}{2}$.`,
    hinh() {
      const O = P(0, 0), R = 3
      const [A, B] = giaoDTvaTron(P(-5, R * Math.SQRT2 / 2), P(5, R * Math.SQRT2 / 2), O, R)
      const [D, C] = giaoDTvaTron(P(5, -R / 2), P(-5, -R / 2), O, R)
      const H = chieu(O, A, B), K = chieu(O, C, D)
      return {
        kiem: [
          { ten: 'AB = R√2', a: kc(A, B), b: R * Math.SQRT2 }, { ten: 'CD = R√3', a: kc(C, D), b: R * Math.sqrt(3) },
          { ten: 'H, O, K thẳng hàng', dat: thangHang(H, O, K) }, { ten: 'HK = (√2+1)R/2', a: kc(H, K), b: (Math.SQRT2 + 1) * R / 2 },
        ],
        spec: {
          diem: { O, A, B, C, D, H, K }, diemPhu: ['H', 'K'],
          tron: [{ tam: 'O', r: R }], doan: [['A', 'B'], ['C', 'D'], { d: ['H', 'K'], phu: true }, { d: ['O', 'A'], phu: true }, { d: ['O', 'C'], phu: true }],
          vuong: [{ d: ['H', 'B', 'O'], phu: true }, { d: ['K', 'C', 'O'], phu: true }], nhanLech: { O: [16, 6], H: [14, -12], K: [14, 22] },
        },
      }
    },
  },
  // ───────────────────────────── BÀI 3. ĐỘ DÀI CUNG · QUẠT · VÀNH KHUYÊN ─────────────────────────────
  {
    so: 8, sach: 'NDT', ma: 'B3 TL11', dang: 'B3·D1 Độ dài đường tròn, cung tròn', loai: 'tra_loi_ngan',
    de: S`Một đường chạy việt dã hình tròn có bán kính bằng $50$ m. Một vận động viên chạy dọc theo đường chạy đó và vạch nên một cung tròn ứng với góc ở tâm bằng $105^\circ$. Tính quãng đường vận động viên đó đã chạy được (làm tròn kết quả đến hàng phần mười của mét).`,
    da: S`$\approx 91{,}6$ m`,
    p1: S`**Mấu chốt:** quãng đường chạy dọc đường tròn chính là **độ dài cung** $105^\circ$; công thức $l=\dfrac{\pi Rn}{180}$.
**Các bước:** thay $R=50$, $n=105$ → rút gọn phân số trước ($\dfrac{50\cdot105}{180}=\dfrac{175}{6}$) → bấm máy, làm tròn đến hàng phần mười.
**Chú ý:** chia cho $180$ (độ dài cung), không phải $360$ (đó là tỉ lệ với cả đường tròn $2\pi R$ — hai cách ra cùng kết quả nếu không nhầm lẫn).`,
    p2: S`Quãng đường vận động viên chạy được bằng độ dài cung $105^\circ$ của đường tròn bán kính $50$ m:
$l=\dfrac{\pi\cdot50\cdot105}{180}=\dfrac{175\pi}{6}\approx91{,}6$ (m).
Vậy vận động viên đã chạy được khoảng $91{,}6$ m.`,
    hinh() {
      const O = P(0, 0), R = 3, A = tren(O, R, -20), B = tren(O, R, 85)
      return {
        kiem: [{ ten: 'l ≈ 91,6', a: Math.round(Math.PI * 50 * 105 / 180 * 10) / 10, b: 91.6 }, { ten: 'AOB = 105', a: goc(A, O, B), b: 105 }],
        spec: {
          diem: { O, A, B }, an: ['A', 'B'], tron: [{ tam: 'O', r: R }], doan: [['O', 'A'], ['O', 'B']],
          to: [{ kieu: 'quat', tam: 'O', a: 'A', b: 'B' }], goc: [{ dinh: 'O', a: 'A', b: 'B', nhan: '105°', r: 26 }],
          chu: [{ tai: mid(O, A), text: '50 m', dx: 8, dy: 26 }], nhanLech: { O: [-14, 18] },
        },
      }
    },
  },
  {
    so: 9, sach: 'NDT', ma: 'B3 VD2', dang: 'B3·D2 Diện tích hình tròn, hình quạt tròn', loai: 'tra_loi_ngan',
    de: S`Cho hình quạt tròn $AOB$ giới hạn bởi hai bán kính $OA$, $OB$ và cung nhỏ $AmB$ sao cho $OA=AB$. Hãy tìm số đo cung $AmB$ ứng với hình quạt đó.`,
    da: S`$60^\circ$`,
    p1: S`**Mấu chốt:** $OA=OB$ (bán kính) và $OA=AB$ (giả thiết) ⇒ **tam giác $OAB$ đều** ⇒ góc ở tâm $\widehat{AOB}=60^\circ$ ⇒ số đo cung bằng số đo góc ở tâm chắn nó.
**Chú ý:** "dây bằng bán kính" ⇔ cung $60^\circ$ — kết quả hay dùng lại ở nhiều bài.`,
    p2: S`Ta có $OA=OB$ (bán kính) và $OA=AB$ (giả thiết) nên $OA=OB=AB$.
Suy ra $\triangle OAB$ đều, do đó $\widehat{AOB}=60^\circ$.
Vậy sđ$\overset{\frown}{AmB}=\widehat{AOB}=60^\circ$.`,
    hinh() {
      const O = P(0, 0), R = 3, A = tren(O, R, 95), B = tren(O, R, 35)
      return {
        kiem: [{ ten: 'OA = AB', a: kc(O, A), b: kc(A, B) }, { ten: 'AOB = 60', a: goc(A, O, B), b: 60 }],
        spec: {
          diem: { O, A, B, m: tren(O, R + 0.4, 65) }, an: ['m'], cung: [{ tam: 'O', r: R, tu: 35, den: 95 }],
          doan: [['O', 'A'], ['O', 'B'], { d: ['A', 'B'], phu: true }], to: [{ kieu: 'quat', tam: 'O', a: 'B', b: 'A' }],
          gach: [{ d: ['O', 'A'] }, { d: ['A', 'B'], phu: true }], chu: [{ tai: 'm', text: 'm', dy: 6, nghieng: true }], rong: 300, cao: 300,
        },
      }
    },
  },
  {
    so: 10, sach: 'NDT', ma: 'B3 TL15', dang: 'B3·D3 Diện tích hình vành khuyên, hình viên phân, hình ghép', loai: 'tra_loi_ngan',
    de: S`Cho đường tròn $(O)$ có bán kính $R=6$ cm và một dây cung $AB$ sao cho góc ở tâm $\widehat{AOB}=120^\circ$. Tính diện tích hình viên phân giới hạn bởi dây $AB$ và cung nhỏ $AB$ (làm tròn kết quả đến hàng phần trăm của $\text{cm}^2$).`,
    da: S`$\approx 22{,}11\ \text{cm}^2$`,
    p1: S`**Mấu chốt:** hình viên phân $=$ **hình quạt** $OAB$ **trừ tam giác** $OAB$.
**Các bước:** diện tích quạt $\dfrac{\pi R^2n}{360}$ → tam giác $OAB$ cân tại $O$: kẻ đường cao $OH$ (cũng là phân giác, trung tuyến) ⇒ $\widehat{AOH}=60^\circ$ → tỉ số lượng giác trong $\triangle OHA$ vuông ra $OH$, $AH$ → diện tích tam giác → trừ, rồi mới làm tròn.
**Chú ý:** giữ dạng chính xác $12\pi-9\sqrt3$ tới bước cuối, làm tròn một lần — làm tròn giữa chừng dễ lệch chữ số hàng phần trăm.`,
    p2: S`Diện tích hình quạt tròn $OAB$ là $S_q=\dfrac{\pi\cdot6^2\cdot120}{360}=12\pi\ (\text{cm}^2)$.
Kẻ $OH\perp AB$ tại $H$.
Xét $\triangle OAB$ cân tại $O$ có $OH$ là đường cao nên $OH$ cũng là đường phân giác và đường trung tuyến, suy ra $\widehat{AOH}=\dfrac{120^\circ}{2}=60^\circ$ và $AB=2AH$.
Xét $\triangle OHA$ vuông tại $H$ có $OH=OA\cdot\cos60^\circ=6\cdot\dfrac12=3$ (cm), $AH=OA\cdot\sin60^\circ=6\cdot\dfrac{\sqrt3}{2}=3\sqrt3$ (cm).
Suy ra $AB=6\sqrt3$ cm.
Diện tích $\triangle OAB$ là $S_{OAB}=\dfrac12\cdot AB\cdot OH=\dfrac12\cdot6\sqrt3\cdot3=9\sqrt3\ (\text{cm}^2)$.
Diện tích hình viên phân là $S=12\pi-9\sqrt3\approx22{,}11\ (\text{cm}^2)$.`,
    hinh() {
      const O = P(0, 0), R = 6, A = tren(O, R, 150), B = tren(O, R, 30), H = chieu(O, A, B)
      const S = 12 * Math.PI - 9 * Math.sqrt(3), Stg = 0.5 * kc(A, B) * kc(O, H)
      return {
        kiem: [{ ten: 'AOB = 120', a: goc(A, O, B), b: 120 }, { ten: 'S tam giác = 9√3', a: Stg, b: 9 * Math.sqrt(3) },
          { ten: 'S quạt = 12π', a: Math.PI * 36 * 120 / 360, b: 12 * Math.PI }, { ten: 'S ≈ 22,11', a: Math.round(S * 100) / 100, b: 22.11 }],
        spec: {
          diem: { O, A, B, H }, diemPhu: ['H'], tron: [{ tam: 'O', r: R }], doan: [['O', 'A'], ['O', 'B'], ['A', 'B'], { d: ['O', 'H'], phu: true }],
          to: [{ kieu: 'vienphan', tam: 'O', a: 'B', b: 'A' }], goc: [{ dinh: 'O', a: 'B', b: 'A', nhan: '120°', r: 22 }],
          vuong: [{ d: ['H', 'B', 'O'], phu: true }], nhanLech: { O: [0, 24], H: [20, -10] },
        },
      }
    },
  },
  // ───────────────────────────── BÀI 4. ĐƯỜNG THẲNG VÀ ĐƯỜNG TRÒN ─────────────────────────────
  {
    so: 11, sach: 'NDT', ma: 'B4 TL1', dang: 'B4·D1 Vị trí tương đối của đường thẳng và đường tròn', loai: 'tra_loi_ngan',
    de: S`Bạn Thanh cắt $4$ hình tròn bằng giấy có bán kính lần lượt là $4$ cm, $6$ cm, $7$ cm và $8$ cm để dán trang trí trên một mảnh giấy, trên đó có vẽ trước hai đường thẳng $a$ và $b$. Biết rằng $a$ và $b$ là hai đường thẳng song song với nhau và cách nhau một khoảng $6$ cm (nghĩa là mọi điểm trên đường thẳng $b$ đều cách $a$ một khoảng $6$ cm). Hỏi nếu bạn Thanh dán sao cho tâm của cả $4$ hình tròn đều nằm trên đường thẳng $b$ thì hình nào đè lên đường thẳng $a$, hình nào không đè lên đường thẳng $a$?`,
    da: S`Hình bán kính $4$ cm không đè lên $a$; các hình bán kính $6$ cm (chạm $a$ tại một điểm), $7$ cm, $8$ cm đè lên $a$`,
    p1: S`**Mấu chốt:** tâm nằm trên $b$ nên **khoảng cách từ tâm đến $a$ luôn là $d=6$ cm** — chỉ cần so $d$ với từng bán kính: $d>R$ không giao, $d=R$ tiếp xúc, $d<R$ cắt.
**Vì sao nghĩ ra:** đề nói rõ "mọi điểm trên $b$ cách $a$ một khoảng $6$ cm" — đó chính là $d$ trong bảng vị trí tương đối.
**Chú ý:** hình tròn bán kính đúng $6$ cm **tiếp xúc** với $a$ (có đúng một điểm chung) — vẫn chạm lên đường thẳng, nên được tính là đè lên.`,
    p2: S`Vì tâm của các hình tròn nằm trên $b$ nên khoảng cách từ mỗi tâm đến đường thẳng $a$ là $d=6$ cm.
Hình tròn bán kính $4$ cm: $d=6>4$ nên đường tròn và $a$ không giao nhau, hình này không đè lên $a$.
Hình tròn bán kính $6$ cm: $d=6=R$ nên đường tròn tiếp xúc với $a$, hình này chạm $a$ tại đúng một điểm.
Hình tròn bán kính $7$ cm: $d=6<7$ nên đường tròn cắt $a$, hình này đè lên $a$.
Hình tròn bán kính $8$ cm: $d=6<8$ nên đường tròn cắt $a$, hình này đè lên $a$.
Vậy chỉ có hình tròn bán kính $4$ cm không đè lên đường thẳng $a$.`,
    nghi: 'Hình bán kính 6 cm tiếp xúc a: sách không có đáp án — em tính là "đè lên" (chạm tại 1 điểm). Hiểu "đè lên" = cắt qua thì đáp số đổi.',
    hinh() {
      const O1 = P(0, 0), O2 = P(14, 0), O3 = P(29, 0), O4 = P(45.5, 0)
      return {
        kiem: [{ ten: 'R=4: d>R', dat: 6 > 4 }, { ten: 'R=6: d=R', dat: 6 === 6 }, { ten: 'R=7,8: d<R', dat: 6 < 7 && 6 < 8 }],
        spec: {
          diem: { O1, O2, O3, O4, a1: P(-6, 6), a2: P(56, 6), b1: P(-6, 0), b2: P(56, 0) }, an: ['O1', 'O2', 'O3', 'O4', 'a1', 'a2', 'b1', 'b2'],
          doan: [['a1', 'a2'], ['b1', 'b2']], tron: [{ tam: 'O1', r: 4 }, { tam: 'O2', r: 6 }, { tam: 'O3', r: 7 }, { tam: 'O4', r: 8 }],
          chu: [{ tai: 'a2', text: 'a', dx: 4, dy: -8, nghieng: true }, { tai: 'b2', text: 'b', dx: 4, dy: -8, nghieng: true },
            { tai: 'O1', text: '4', dy: 6 }, { tai: 'O2', text: '6', dy: 6 }, { tai: 'O3', text: '7', dy: 6 }, { tai: 'O4', text: '8', dy: 6 }],
          rong: 620, cao: 260,
        },
      }
    },
  },
  {
    so: 12, sach: 'NDT', ma: 'B4 VD1', dang: 'B4·D2 Nhận biết một đường thẳng là tiếp tuyến', loai: 'tu_luan',
    de: S`Cho $AB$ là một dây không đi qua tâm của đường tròn $(O)$. Đường thẳng qua $O$ và vuông góc với $AB$ cắt tiếp tuyến tại $A$ của $(O)$ ở điểm $C$. Chứng minh rằng $CB$ là một tiếp tuyến của $(O)$.`,
    p1: S`**Mấu chốt:** muốn chứng minh $CB$ là tiếp tuyến thì chứng minh $CB\perp OB$ tại $B$ (dấu hiệu nhận biết). Góc $\widehat{OBC}$ được "chuyển" từ góc vuông $\widehat{OAC}$ qua **hai tam giác bằng nhau** $OAC$ và $OBC$.
**Vì sao nghĩ ra:** hình đối xứng qua đường thẳng $OC$ ($OC$ vuông góc với dây $AB$ và đi qua tâm) ⇒ hai tam giác hai bên bằng nhau.
**Các bước:** tam giác $OAB$ cân tại $O$, đường cao cũng là phân giác ⇒ $\widehat{AOC}=\widehat{BOC}$ → $\triangle OAC=\triangle OBC$ (c.g.c) → $\widehat{OBC}=\widehat{OAC}=90^\circ$ → kết luận.
**Chú ý:** câu kết phải đủ hai ý: $CB$ vuông góc với bán kính $OB$ **và** $B$ nằm trên đường tròn.`,
    p2: S`Gọi $H$ là giao điểm của $OC$ và $AB$.
Xét $\triangle OAB$ cân tại $O$ ($OA=OB$) có $OH$ là đường cao nên $OH$ cũng là đường phân giác, suy ra $\widehat{AOC}=\widehat{BOC}$.
Xét $\triangle OAC$ và $\triangle OBC$ có:
$OA=OB$ (bán kính);
$\widehat{AOC}=\widehat{BOC}$ (chứng minh trên);
$OC$ chung.
Do đó $\triangle OAC=\triangle OBC$ (c.g.c).
Suy ra $\widehat{OBC}=\widehat{OAC}$.
Mà $\widehat{OAC}=90^\circ$ (vì $CA$ là tiếp tuyến của $(O)$ tại $A$) nên $\widehat{OBC}=90^\circ$, tức là $CB\perp OB$ tại $B$.
Vậy $CB$ là tiếp tuyến của $(O)$ tại $B$.`,
    cauHinh: [140, 120],
    hinh(t = 140) {
      const O = P(0, 0), R = 3, A = tren(O, R, t), B = tren(O, R, 180 - t + 0) // AB nằm ngang, phía trên tâm
      const H = chieu(O, A, B), C = giaoDT(O, H, A, pTiep(O, A))
      return {
        kiem: [{ ten: 'CB ⊥ OB', dat: vuongGoc(C, B, O, B) }, { ten: 'OC ⊥ AB', dat: vuongGoc(O, C, A, B) }],
        spec: {
          diem: { O, A, B, C, H }, diemPhu: ['H'], tron: [{ tam: 'O', r: R }],
          doan: [['A', 'B'], ['O', 'C'], ['C', 'A'], ['C', 'B'], { d: ['O', 'A'], phu: true }, { d: ['O', 'B'], phu: true }],
          vuong: [['H', 'C', 'B'], { d: ['A', 'C', 'O'], phu: true }], nhanLech: { O: [0, 24], H: [14, 20] },
        },
      }
    },
  },
  {
    so: 13, sach: 'NDT', ma: 'B4 TL8', dang: 'B4·D3 Vận dụng tính chất tiếp tuyến (tính độ dài)', loai: 'tra_loi_ngan',
    de: S`Một người quan sát đặt mắt ở vị trí $A$ có độ cao cách mực nước biển là $AB=5$ m. Cắt bề mặt Trái Đất bởi một mặt phẳng đi qua điểm $A$ và tâm của Trái Đất thì phần chung giữa chúng là một đường tròn lớn tâm $O$ như hình bên. Tầm quan sát tối đa từ vị trí $A$ là đoạn thẳng $AC$, trong đó $C$ là tiếp điểm của tiếp tuyến đi qua $A$ với đường tròn $(O)$. Tính độ dài đoạn thẳng $AC$ (theo đơn vị ki-lô-mét và làm tròn kết quả đến hàng phần mười), biết bán kính Trái Đất là $OB=OC\approx6400$ km.`,
    da: S`$\approx 8{,}0$ km`,
    p1: S`**Mấu chốt:** $AC$ là tiếp tuyến tại $C$ ⇒ $AC\perp OC$ ⇒ **tam giác $OCA$ vuông tại $C$**, biết hai cạnh $OC$, $OA=OB+BA$ ⇒ Pythagore.
**Các bước:** đổi $5$ m ra km (đề hỏi km) → $OA=6400+0{,}005$ → $AC^2=OA^2-OC^2$ → khai căn, làm tròn.
**Chú ý:** quên đổi đơn vị là sai cả bài. Tính $OA^2-OC^2$ bằng hằng đẳng thức $(OA-OC)(OA+OC)=0{,}005\cdot12800{,}005$ cho gọn, đỡ bấm số lớn.`,
    p2: S`Đổi $5$ m $=0{,}005$ km.
Vì $O$, $B$, $A$ thẳng hàng và $B$ nằm giữa $O$, $A$ nên $OA=OB+BA=6400+0{,}005=6400{,}005$ (km).
Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ nên $AC\perp OC$.
Xét $\triangle OCA$ vuông tại $C$ có $AC^2=OA^2-OC^2=6400{,}005^2-6400^2=0{,}005\cdot12800{,}005=64{,}000025$ (định lí Pythagore).
Suy ra $AC=\sqrt{64{,}000025}\approx8{,}0$ (km).`,
    hinh() {
      const O = P(0, 0), R = 3, B = P(0, R), A = P(0, R * 1.45), [, C] = tiepDiem(A, O, R)
      const ac = Math.sqrt(6400.005 ** 2 - 6400 ** 2)
      return {
        kiem: [{ ten: 'AC ⊥ OC', dat: vuongGoc(A, C, O, C) }, { ten: 'AC ≈ 8,0 km', a: Math.round(ac * 10) / 10, b: 8.0 }],
        spec: {
          diem: { O, B, A, C }, tron: [{ tam: 'O', r: R }], doan: [['O', 'A'], ['A', 'C'], ['O', 'C']],
          vuong: [{ d: ['C', 'A', 'O'], phu: true }], nhanLech: { O: [-14, 18], B: [-16, 14] },
        },
      }
    },
  },
  {
    so: 14, sach: 'NDT', ma: 'B4 TL4', dang: 'B4·D4 Vận dụng tính chất hai tiếp tuyến cắt nhau', loai: 'tu_luan',
    de: S`Cho $SA$ và $SB$ là hai tiếp tuyến cắt nhau của đường tròn $(O)$ ($A$ và $B$ là hai tiếp điểm). Gọi $M$ là một điểm tuỳ ý trên cung nhỏ $AB$. Tiếp tuyến của $(O)$ tại $M$ cắt $SA$ tại $E$ và cắt $SB$ tại $F$.
a) Chứng minh rằng chu vi của tam giác $SEF$ bằng $SA+SB$.
b) Giả sử $M$ là giao điểm của đoạn $SO$ với đường tròn $(O)$. Chứng minh rằng $SE=SF$.`,
    p1: S`**Mấu chốt câu a:** từ $E$ có hai tiếp tuyến $EA$, $EM$ ⇒ $EA=EM$; từ $F$ có $FB=FM$. Thay $EM$, $FM$ trong chu vi bằng $EA$, $FB$ thì chu vi "duỗi" thành $SA+SB$.
**Mấu chốt câu b:** khi $M$ nằm trên $SO$ thì tiếp tuyến tại $M$ vuông góc với $SO$, mà $SO$ là phân giác của $\widehat{ASB}$ (tính chất hai tiếp tuyến cắt nhau) ⇒ $SM$ vừa là đường cao vừa là phân giác của $\triangle SEF$.
**Các bước b:** $\widehat{ESM}=\widehat{FSM}$, $SM$ chung, $\widehat{SME}=\widehat{SMF}=90^\circ$ ⇒ hai tam giác bằng nhau (g.c.g) ⇒ $SE=SF$.
**Chú ý:** câu a cần $E$ nằm giữa $S$, $A$ và $M$ nằm giữa $E$, $F$ (vì $M$ trên cung nhỏ $AB$) để cộng đoạn thẳng.`,
    p2: S`a) Vì $EA$, $EM$ là hai tiếp tuyến của $(O)$ cắt nhau tại $E$ nên $EA=EM$.
Vì $FB$, $FM$ là hai tiếp tuyến của $(O)$ cắt nhau tại $F$ nên $FB=FM$.
Chu vi $\triangle SEF$ là $SE+EF+SF=SE+EM+MF+SF=(SE+EA)+(SF+FB)=SA+SB$.

b) Vì $SA$, $SB$ là hai tiếp tuyến của $(O)$ cắt nhau tại $S$ nên $SO$ là tia phân giác của $\widehat{ASB}$, suy ra $\widehat{ESM}=\widehat{FSM}$.
Vì $EF$ là tiếp tuyến của $(O)$ tại $M$ nên $EF\perp OM$, mà $M$ nằm trên $SO$ nên $EF\perp SM$ tại $M$.
Xét $\triangle SME$ và $\triangle SMF$ có:
$\widehat{ESM}=\widehat{FSM}$ (chứng minh trên);
$SM$ chung;
$\widehat{SME}=\widehat{SMF}=90^\circ$.
Do đó $\triangle SME=\triangle SMF$ (g.c.g).
Suy ra $SE=SF$.`,
    cauHinh: [196, 140, 180],
    hinh(t = 196) {
      const O = P(0, 0), R = 2.4, S0 = P(-7, 0), [A, B] = tiepDiem(S0, O, R), M = tren(O, R, t)
      const T = pTiep(O, M), E = giaoDT(M, T, S0, A), F = giaoDT(M, T, S0, B)
      const ck = kc(S0, E) + kc(E, F) + kc(F, S0)
      const k = [{ ten: 'chu vi SEF = SA+SB', a: ck, b: kc(S0, A) + kc(S0, B) }]
      if (Math.abs(t - 180) < 1e-9) k.push({ ten: 'M ∈ SO ⇒ SE = SF', a: kc(S0, E), b: kc(S0, F) })
      return {
        kiem: k,
        spec: {
          diem: { S: S0, O, A, B, M, E, F }, tron: [{ tam: 'O', r: R }],
          doan: [['S', 'A'], ['S', 'B'], ['E', 'F'], { d: ['S', 'O'], phu: true }, { d: ['O', 'M'], phu: true }],
          nhanLech: { O: [16, 6], S: [-14, 6] },
        },
      }
    },
  },
  // ───────────────────────────── BÀI 5. HAI ĐƯỜNG TRÒN ─────────────────────────────
  {
    so: 15, sach: 'NDT', ma: 'B5 TL5', dang: 'B5·D1 Vị trí tương đối của hai đường tròn', loai: 'tra_loi_ngan',
    de: S`Xác định vị trí tương đối của $(O;R)$ và $(O';R')$ trong mỗi trường hợp sau:
a) $OO'=18$; $R=10$; $R'=6$;
b) $OO'=2$; $R=9$; $R'=3$;
c) $OO'=13$; $R=8$; $R'=5$;
d) $OO'=17$; $R=15$; $R'=4$.`,
    da: S`a) ở ngoài nhau; b) $(O)$ đựng $(O')$; c) tiếp xúc ngoài; d) cắt nhau`,
    p1: S`**Mấu chốt:** so **đoạn nối tâm** $OO'$ với **tổng** $R+R'$ và **hiệu** $R-R'$: $OO'>R+R'$ ngoài nhau · $OO'=R+R'$ tiếp xúc ngoài · $R-R'<OO'<R+R'$ cắt nhau · $OO'=R-R'$ tiếp xúc trong · $OO'<R-R'$ đựng nhau.
**Các bước:** mỗi ý tính cả $R+R'$ và $R-R'$ rồi xếp $OO'$ vào đúng khoảng.
**Chú ý:** ý b) $OO'$ rất nhỏ so với bán kính — phải so với hiệu ($9-3=6$), không phải tổng.`,
    p2: S`a) Ta có $R+R'=10+6=16$, mà $OO'=18>16$ nên hai đường tròn ở ngoài nhau.

b) Ta có $R-R'=9-3=6$, mà $OO'=2<6$ nên đường tròn $(O)$ đựng đường tròn $(O')$.

c) Ta có $R+R'=8+5=13=OO'$ nên hai đường tròn tiếp xúc ngoài.

d) Ta có $R-R'=15-4=11$, $R+R'=15+4=19$, mà $11<17<19$ nên hai đường tròn cắt nhau.`,
    hinhDe: false, hinhLG: false,
    hinh() {
      const xep = (d, R, r) => d > R + r ? 'ngoài' : gan(d, R + r) ? 'tx ngoài' : d > R - r ? 'cắt' : gan(d, R - r) ? 'tx trong' : 'đựng'
      return { kiem: [{ ten: 'a ngoài', dat: xep(18, 10, 6) === 'ngoài' }, { ten: 'b đựng', dat: xep(2, 9, 3) === 'đựng' }, { ten: 'c tx ngoài', dat: xep(13, 8, 5) === 'tx ngoài' }, { ten: 'd cắt', dat: xep(17, 15, 4) === 'cắt' }] }
    },
  },
  {
    so: 16, sach: 'NDT', ma: 'B5 VD3', dang: 'B5·D2 Tính độ dài đoạn thẳng (dây chung, tiếp tuyến chung)', loai: 'tra_loi_ngan',
    de: S`Cho hai đường tròn $(O;R)$ và $(O';R')$ tiếp xúc ngoài tại $A$. Kẻ tiếp tuyến chung ngoài $MN$ với $M$ thuộc $(O)$, $N$ thuộc $(O')$. Biết $R=9$ cm, $R'=4$ cm. Tính độ dài đoạn $MN$.`,
    da: S`$12$ cm`,
    p1: S`**Mấu chốt:** $OM\perp MN$ và $O'N\perp MN$ ⇒ $OM\parallel O'N$. Kẻ thêm $O'H\perp OM$ thì được **hình chữ nhật** $MNO'H$ (chuyển $MN$ thành $HO'$) và **tam giác vuông** $OHO'$ có cạnh huyền $OO'=R+R'$, cạnh góc vuông $OH=R-R'$.
**Vì sao nghĩ ra:** $MN$ không nằm trong tam giác vuông nào có sẵn — tịnh tiến nó về đi qua $O'$ để ghép với đoạn nối tâm.
**Các bước:** chứng minh $MNO'H$ là hình chữ nhật → $MN=HO'$, $HM=O'N=4$ → $OH=9-4=5$, $OO'=9+4=13$ → Pythagore.
**Chú ý:** công thức gọn $MN=2\sqrt{RR'}$ chỉ đúng khi hai đường tròn **tiếp xúc ngoài**; bài thi vẫn phải trình bày qua hình chữ nhật.`,
    p2: S`Vì $MN$ là tiếp tuyến chung của hai đường tròn tại $M$ và $N$ nên $OM\perp MN$, $O'N\perp MN$.
Kẻ $O'H\perp OM$ tại $H$.
Xét tứ giác $MNO'H$ có $\widehat{HMN}=\widehat{MNO'}=\widehat{O'HM}=90^\circ$ nên $MNO'H$ là hình chữ nhật.
Suy ra $HO'=MN$ và $HM=O'N=4$ cm, do đó $OH=OM-HM=9-4=5$ (cm).
Vì hai đường tròn tiếp xúc ngoài tại $A$ nên $OO'=R+R'=9+4=13$ (cm).
Xét $\triangle OHO'$ vuông tại $H$ có $HO'=\sqrt{OO'^2-OH^2}=\sqrt{13^2-5^2}=12$ (cm) (định lí Pythagore).
Vậy $MN=12$ cm.`,
    hinh() {
      const O = P(0, 0), O2 = P(13, 0), R = 9, r = 4, c = (R - r) / 13, s = Math.sqrt(1 - c * c)
      const M = P(R * c, R * s), N = P(13 + r * c, r * s), A = P(9, 0), H = chieu(O2, O, M)
      return {
        kiem: [{ ten: 'MN tiếp xúc (O)', dat: vuongGoc(O, M, M, N) }, { ten: 'MN tiếp xúc (O′)', dat: vuongGoc(O2, N, M, N) }, { ten: 'MN = 12', a: kc(M, N), b: 12 }],
        spec: {
          diem: { O, "O'": O2, A, M, N, H }, diemPhu: ['H'], tron: [{ tam: 'O', r: R }, { tam: "O'", r }],
          doan: [['O', "O'"], ['M', 'N'], ['O', 'M'], ["O'", 'N'], { d: ["O'", 'H'], phu: true }],
          vuong: [{ d: ['H', 'M', "O'"], phu: true }], nhanLech: { A: [12, 22], O: [0, 24], "O'": [8, 24], H: [-16, 6] },
        },
      }
    },
  },
  // ───────────────────────────── GÓC NỘI TIẾP · ĐƯỜNG TRÒN NGOẠI/NỘI TIẾP TAM GIÁC ─────────────────────────────
  {
    so: 17, sach: 'TC', ma: 'GNT B18', dang: 'GNT·D1 Tính góc nội tiếp, góc ở tâm', loai: 'tra_loi_ngan',
    de: S`Cho đường tròn tâm $O$, đường kính $BC$. Trên $(O)$ lấy điểm $A$ sao cho $\widehat{ACB}=30^\circ$. Gọi $E$ là điểm chính giữa của cung nhỏ $AC$. Trên nửa đường tròn tâm $O$ không chứa điểm $A$ lấy điểm $T$ bất kì.
a) Tính số đo góc $\widehat{ABC}$;
b) Tính số đo góc $\widehat{ETC}$.`,
    da: S`a) $60^\circ$; b) $30^\circ$`,
    p1: S`**Mấu chốt câu a:** $BC$ là đường kính ⇒ $\widehat{BAC}$ là góc nội tiếp chắn nửa đường tròn ⇒ $90^\circ$ ⇒ tam giác vuông, trừ góc.
**Mấu chốt câu b:** $\widehat{ETC}$ là góc nội tiếp chắn cung nhỏ $EC$ ⇒ cần số đo cung $EC$ $=$ nửa cung nhỏ $AC$; cung nhỏ $AC$ lấy từ góc nội tiếp $\widehat{ABC}$ ở câu a (số đo cung $=2\times$ góc nội tiếp).
**Chú ý:** $T$ "bất kì" trên nửa đường tròn kia — kết quả không phụ thuộc $T$ vì mọi góc nội tiếp chắn cung $EC$ đều bằng nhau.`,
    p2: S`a) Vì $\widehat{BAC}$ là góc nội tiếp chắn nửa đường tròn nên $\widehat{BAC}=90^\circ$.
Xét $\triangle ABC$ vuông tại $A$ có $\widehat{ABC}=90^\circ-\widehat{ACB}=90^\circ-30^\circ=60^\circ$.

b) Vì $\widehat{ABC}$ là góc nội tiếp chắn cung nhỏ $AC$ nên sđ$\overset{\frown}{AC}=2\widehat{ABC}=2\cdot60^\circ=120^\circ$.
Vì $E$ là điểm chính giữa của cung nhỏ $AC$ nên sđ$\overset{\frown}{EC}=\dfrac{120^\circ}{2}=60^\circ$.
Vì $\widehat{ETC}$ là góc nội tiếp chắn cung nhỏ $EC$ nên $\widehat{ETC}=\dfrac12$sđ$\overset{\frown}{EC}=\dfrac12\cdot60^\circ=30^\circ$.`,
    cauHinh: [-70, -40, -150],
    hinh(t = -70) {
      const O = P(0, 0), R = 3, B = P(-R, 0), C = P(R, 0), A = tren(O, R, 120), E = tren(O, R, 60), T = tren(O, R, t)
      return {
        kiem: [{ ten: 'ACB = 30', a: goc(A, C, B), b: 30 }, { ten: 'ABC = 60', a: goc(A, B, C), b: 60 }, { ten: 'E chính giữa cung AC', a: kc(A, E), b: kc(E, C) }, { ten: 'ETC = 30', a: goc(E, T, C), b: 30 }],
        spec: {
          diem: { O, B, C, A, E, T }, tron: [{ tam: 'O', r: R }], doan: [['B', 'C'], ['A', 'B'], ['A', 'C'], ['T', 'E'], ['T', 'C']],
          goc: [{ dinh: 'C', a: 'B', b: 'A', nhan: '30°', r: 34 }], nhanLech: { O: [0, -12] },
        },
      }
    },
  },
  {
    so: 18, sach: 'TC', ma: 'GNT B13', dang: 'GNT·D2 Góc nội tiếp → tam giác đồng dạng, hệ thức', loai: 'tu_luan',
    de: S`Cho $AB$ là đường kính của đường tròn tâm $O$, bán kính $R$. Vẽ hai dây cung $AD$ và $BC$ cắt nhau tại $E$. Vẽ $EF$ vuông góc với $AB$ tại $F$. Chứng minh
a) $\triangle AFE\backsim\triangle ADB$;
b) $\triangle BFE\backsim\triangle BCA$;
c) $EC\cdot EB=EA\cdot ED$.`,
    p1: S`**Mấu chốt:** $AB$ là đường kính ⇒ hai góc nội tiếp chắn nửa đường tròn $\widehat{ADB}=\widehat{ACB}=90^\circ$ — đó là các góc vuông dùng cho mọi cặp tam giác đồng dạng.
**Các bước:** a), b): mỗi cặp có một góc vuông và một góc chung ⇒ (g.g). c): tích $EC\cdot EB=EA\cdot ED$ ⇔ tỉ lệ $\dfrac{EC}{ED}=\dfrac{EA}{EB}$ ⇒ tìm hai tam giác chứa bốn đoạn đó: $\triangle ECA$ và $\triangle EDB$ (góc vuông tại $C$, $D$ + góc đối đỉnh tại $E$).
**Vì sao nghĩ ra (c):** đẳng thức tích của bốn đoạn thẳng chung một đầu mút $E$ ⇒ gần như luôn là cặp tam giác đồng dạng có chung đỉnh $E$.
**Chú ý:** viết đúng thứ tự đỉnh tương ứng ($E\leftrightarrow E$, $C\leftrightarrow D$, $A\leftrightarrow B$) thì tỉ số đọc ra mới đúng.`,
    p2: S`a) Vì $\widehat{ADB}$ là góc nội tiếp chắn nửa đường tròn nên $\widehat{ADB}=90^\circ$.
Xét $\triangle AFE$ và $\triangle ADB$ có:
$\widehat{AFE}=\widehat{ADB}=90^\circ$;
$\widehat{BAD}$ chung.
Do đó $\triangle AFE\backsim\triangle ADB$ (g.g).

b) Vì $\widehat{ACB}$ là góc nội tiếp chắn nửa đường tròn nên $\widehat{ACB}=90^\circ$.
Xét $\triangle BFE$ và $\triangle BCA$ có:
$\widehat{BFE}=\widehat{BCA}=90^\circ$;
$\widehat{ABC}$ chung.
Do đó $\triangle BFE\backsim\triangle BCA$ (g.g).

c) Xét $\triangle ECA$ và $\triangle EDB$ có:
$\widehat{ECA}=\widehat{EDB}=90^\circ$ (vì $\widehat{ACB}=\widehat{ADB}=90^\circ$);
$\widehat{CEA}=\widehat{DEB}$ (hai góc đối đỉnh).
Do đó $\triangle ECA\backsim\triangle EDB$ (g.g).
Suy ra $\dfrac{EC}{ED}=\dfrac{EA}{EB}$, hay $EC\cdot EB=EA\cdot ED$.`,
    cauHinh: [[115, 50], [140, 75], [100, 30]],
    hinh(cd = [115, 50]) {
      const O = P(0, 0), R = 3, A = P(-R, 0), B = P(R, 0), C = tren(O, R, cd[0]), D = tren(O, R, cd[1]), E = giaoDT(A, D, B, C), F = chieu(E, A, B)
      return {
        kiem: [
          { ten: 'ADB = 90', a: goc(A, D, B), b: 90 }, { ten: 'AFE~ADB: AF/AD = AE/AB', a: kc(A, F) / kc(A, D), b: kc(A, E) / kc(A, B) },
          { ten: 'BFE~BCA: BF/BC = BE/BA', a: kc(B, F) / kc(B, C), b: kc(B, E) / kc(B, A) }, { ten: 'EC·EB = EA·ED', a: kc(E, C) * kc(E, B), b: kc(E, A) * kc(E, D) },
        ],
        spec: {
          diem: { O, A, B, C, D, E, F }, tron: [{ tam: 'O', r: R }],
          doan: [['A', 'B'], ['A', 'D'], ['B', 'C'], ['E', 'F'], ['D', 'B'], ['C', 'A']], vuong: [['F', 'B', 'E']], nhanLech: { O: [0, 24], F: [0, 24], E: [0, -16] },
        },
      }
    },
  },
  {
    so: 19, sach: 'TC', ma: 'GNT B6', dang: 'GNT·D3 Đường tròn ngoại tiếp, nội tiếp tam giác', loai: 'tra_loi_ngan',
    de: S`Cho tam giác đều $MNK$ có các cạnh bằng $10$ cm. Tính bán kính của đường tròn ngoại tiếp và bán kính của đường tròn nội tiếp tam giác $MNK$.`,
    da: S`$R=\dfrac{10\sqrt3}{3}$ cm; $r=\dfrac{5\sqrt3}{3}$ cm`,
    p1: S`**Mấu chốt:** trong tam giác đều, tâm đường tròn ngoại tiếp và tâm đường tròn nội tiếp **trùng nhau ở trọng tâm** $G$; đường cao $h=\dfrac{a\sqrt3}{2}$, $R=\dfrac23h=\dfrac{a\sqrt3}{3}$, $r=\dfrac13h=\dfrac{a\sqrt3}{6}$ (công thức trong phần lý thuyết).
**Các bước:** thay $a=10$ vào hai công thức, rút gọn $\dfrac{10\sqrt3}{6}=\dfrac{5\sqrt3}{3}$.
**Chú ý:** $r=\dfrac R2$ — dùng để tự kiểm.`,
    p2: S`Bán kính đường tròn ngoại tiếp tam giác đều $MNK$ cạnh $10$ cm là $R=\dfrac{10\sqrt3}{3}$ (cm).
Bán kính đường tròn nội tiếp tam giác đều $MNK$ cạnh $10$ cm là $r=\dfrac{10\sqrt3}{6}=\dfrac{5\sqrt3}{3}$ (cm).`,
    hinh() {
      const N = P(0, 0), K = P(10, 0), M = P(5, 5 * Math.sqrt(3)), G = P(5, 5 * Math.sqrt(3) / 3), I = mid(N, K)
      return {
        kiem: [{ ten: 'R = GM = 10√3/3', a: kc(G, M), b: 10 * Math.sqrt(3) / 3 }, { ten: 'r = GI = 5√3/3', a: kc(G, I), b: 5 * Math.sqrt(3) / 3 }],
        spec: {
          diem: { M, N, K, G }, diemPhu: ['G'], doan: [['M', 'N'], ['N', 'K'], ['K', 'M']], gach: [{ d: ['M', 'N'] }, { d: ['N', 'K'] }, { d: ['K', 'M'] }],
          tron: [{ tam: 'G', qua: 'M', phu: true }, { tam: 'G', r: kc(G, I), phu: true }], nhanLech: { G: [14, -8] },
        },
      }
    },
  },
  // ───────────────────────────── TỨ GIÁC NỘI TIẾP ─────────────────────────────
  {
    so: 20, sach: 'TC', ma: 'TGNT B1', dang: 'TGNT·D1 Chứng minh tứ giác nội tiếp', loai: 'tu_luan',
    de: S`Từ điểm $A$ nằm ngoài đường tròn $(O)$, vẽ tiếp tuyến $AB$ ($B$ là tiếp điểm) và cát tuyến $ACD$ không đi qua tâm $O$ ($C$ nằm giữa $A$ và $D$, $AD$ không cắt đoạn thẳng $OB$). Gọi $E$ là trung điểm của $CD$. Chứng minh $ABOE$ là tứ giác nội tiếp.`,
    p1: S`**Mấu chốt:** hai góc vuông $\widehat{ABO}$ (tiếp tuyến ⊥ bán kính) và $\widehat{AEO}$ (trung điểm dây ⇒ vuông góc) **cùng nhìn đoạn $AO$** ⇒ $B$, $E$ cách đều trung điểm $I$ của $AO$.
**Vì sao nghĩ ra:** chứng minh bốn điểm cùng thuộc một đường tròn theo cách của tài liệu: tìm các tam giác vuông **chung cạnh huyền** rồi lấy trung điểm cạnh huyền làm tâm.
**Các bước:** $\triangle OCD$ cân ⇒ trung tuyến $OE$ cũng là đường cao ⇒ $\widehat{AEO}=90^\circ$ → $\widehat{ABO}=90^\circ$ → hai tam giác vuông chung cạnh huyền $AO$ → $IA=IB=IO=IE$.
**Chú ý:** không dùng "tổng hai góc đối bằng $180^\circ$ thì nội tiếp" — chương trình hiện hành chỉ có chiều thuận của định lí đó (tứ giác nội tiếp ⇒ tổng hai góc đối $180^\circ$).`,
    p2: S`Xét $\triangle OCD$ cân tại $O$ ($OC=OD$) có $OE$ là đường trung tuyến ($E$ là trung điểm $CD$) nên $OE$ cũng là đường cao, suy ra $OE\perp CD$, do đó $\widehat{AEO}=90^\circ$.
Vì $AB$ là tiếp tuyến của $(O)$ tại $B$ nên $AB\perp OB$, do đó $\widehat{ABO}=90^\circ$.
Gọi $I$ là trung điểm của $AO$.
Xét $\triangle ABO$ vuông tại $B$ có $BI$ là đường trung tuyến ứng với cạnh huyền nên $BI=\dfrac{AO}{2}=IA=IO$. (1)
Xét $\triangle AEO$ vuông tại $E$ có $EI$ là đường trung tuyến ứng với cạnh huyền nên $EI=\dfrac{AO}{2}=IA=IO$. (2)
Từ (1) và (2) suy ra $IA=IB=IO=IE$.
Vậy bốn điểm $A$, $B$, $O$, $E$ cùng thuộc đường tròn tâm $I$, bán kính $\dfrac{AO}{2}$, hay $ABOE$ là tứ giác nội tiếp.`,
    cauHinh: [-1.4, -0.8, -2.2],
    hinh(yq = -1.4) {
      const O = P(0, 0), R = 3, A = P(-7.5, 0), [B] = tiepDiem(A, O, R), [C, D] = giaoDTvaTron(A, P(0, yq), O, R), E = mid(C, D), I = mid(A, O)
      return {
        kiem: [{ ten: 'AEO = 90', a: goc(A, E, O), b: 90 }, { ten: 'ABO = 90', a: goc(A, B, O), b: 90 }, { ten: 'IB = IA', a: kc(I, B), b: kc(I, A) }, { ten: 'IE = IA', a: kc(I, E), b: kc(I, A) }],
        spec: {
          diem: { O, A, B, C, D, E, I }, diemPhu: ['I'], tron: [{ tam: 'O', r: R }, { tam: 'I', qua: 'A', phu: true }],
          doan: [['A', 'B'], ['A', 'D'], ['O', 'B'], ['O', 'E'], { d: ['O', 'C'], phu: true }, { d: ['O', 'D'], phu: true }, { d: ['A', 'O'], phu: true }],
          gach: [{ d: ['C', 'E'] }, { d: ['E', 'D'] }], vuong: [{ d: ['B', 'A', 'O'], phu: true }, { d: ['E', 'D', 'O'], phu: true }], nhanLech: { O: [14, 16], E: [0, 26] },
        },
      }
    },
  },
  {
    so: 21, sach: 'TC', ma: 'TGNT LT-BTTT1', dang: 'TGNT·D2 Tính góc trong tứ giác nội tiếp', loai: 'tra_loi_ngan',
    de: S`Cho tứ giác $DEFG$ nội tiếp đường tròn $(O)$ như hình vẽ, biết $\widehat{DEF}=117^\circ$ và $\widehat{EFG}=134^\circ$. Tính số đo các góc của tứ giác $DEFG$.`,
    da: S`$\widehat{E}=117^\circ$, $\widehat{F}=134^\circ$, $\widehat{G}=63^\circ$, $\widehat{D}=46^\circ$`,
    p1: S`**Mấu chốt:** trong tứ giác nội tiếp, **tổng hai góc đối bằng $180^\circ$**. Góc đối của $\widehat{E}$ là $\widehat{G}$, của $\widehat{F}$ là $\widehat{D}$.
**Chú ý:** đọc đúng cặp đối theo thứ tự đỉnh $D$–$E$–$F$–$G$ (đỉnh cách nhau một đỉnh). Tự kiểm: bốn góc cộng lại phải bằng $360^\circ$.`,
    p2: S`Vì tứ giác $DEFG$ nội tiếp đường tròn $(O)$ nên $\widehat{E}+\widehat{G}=180^\circ$ và $\widehat{F}+\widehat{D}=180^\circ$.
Suy ra $\widehat{G}=180^\circ-\widehat{E}=180^\circ-117^\circ=63^\circ$.
$\widehat{D}=180^\circ-\widehat{F}=180^\circ-134^\circ=46^\circ$.
Vậy $\widehat{D}=46^\circ$, $\widehat{E}=117^\circ$, $\widehat{F}=134^\circ$, $\widehat{G}=63^\circ$.`,
    hinh() {
      const O = P(0, 0), R = 3, D = tren(O, R, 265), E = tren(O, R, 179), F = tren(O, R, 139), G = tren(O, R, 87)
      return {
        kiem: [{ ten: 'E = 117', a: goc(D, E, F), b: 117 }, { ten: 'F = 134', a: goc(E, F, G), b: 134 }, { ten: 'G = 63', a: goc(F, G, D), b: 63 }, { ten: 'D = 46', a: goc(G, D, E), b: 46 }],
        spec: {
          diem: { O, D, E, F, G }, tron: [{ tam: 'O', r: R }], doan: [['D', 'E'], ['E', 'F'], ['F', 'G'], ['G', 'D']],
          goc: [{ dinh: 'E', a: 'D', b: 'F', nhan: '117°', r: 22 }, { dinh: 'F', a: 'E', b: 'G', nhan: '134°', r: 22, n: 2 }], nhanLech: { O: [14, 14] },
        },
      }
    },
  },
  // ───────────────────────────── HÌNH TỔNG HỢP (khuôn đề thi vào 10) ─────────────────────────────
  {
    so: 22, sach: 'NT', ma: 'CĐ10 B6', dang: 'TH·D1 Hình tổng hợp nhiều ý (đề thi vào 10)', loai: 'tu_luan',
    de: S`Cho đường tròn $(O;3\text{ cm})$. Hai điểm $B$, $C$ thuộc $(O)$ sao cho $\widehat{BOC}=120^\circ$. Tiếp tuyến của $(O)$ tại $B$ và $C$ cắt nhau tại $A$.
a) Chứng minh bốn điểm $A$, $B$, $O$, $C$ cùng thuộc một đường tròn và tính bán kính của đường tròn này.
b) Kẻ đường kính $CE$ của $(O)$, $AE$ cắt $(O)$ tại $D$ ($D$ khác $E$). Chứng minh $AC^2=AD\cdot AE$ và $\widehat{ABD}=\widehat{DCB}$.
c) Tính $BD$.`,
    da: S`a) bán kính $3$ cm; c) $BD=\dfrac{3\sqrt{21}}{7}$ cm`,
    p1: S`**Câu a — mấu chốt:** $\widehat{ABO}=\widehat{ACO}=90^\circ$ (tiếp tuyến ⊥ bán kính) cùng nhìn $AO$ ⇒ tâm là trung điểm $AO$; bán kính $=\dfrac{AO}{2}$, tính $AO$ từ $\widehat{BOA}=60^\circ$ ($OA$ là phân giác của $\widehat{BOC}$).
**Câu b — mấu chốt:** $\widehat{CDE}=90^\circ$ (chắn nửa đường tròn) ⇒ $CD$ là đường cao của tam giác $ACE$ vuông tại $C$ ⇒ $\triangle ACD\backsim\triangle AEC$ ⇒ $AC^2=AD\cdot AE$. Vế sau: thay $AC$ bằng $AB$ ($AB=AC$) được $AB^2=AD\cdot AE$ ⇒ $\triangle ABD\backsim\triangle AEB$ (c.g.c) ⇒ $\widehat{ABD}=\widehat{AEB}$, rồi $\widehat{AEB}=\widehat{DCB}$ vì hai góc nội tiếp cùng chắn cung $DB$.
**Câu c — mấu chốt:** dùng lại cặp đồng dạng câu b: $\dfrac{BD}{EB}=\dfrac{AB}{AE}$; $EB=3$ vì $\triangle OBE$ đều ($\widehat{BOE}=60^\circ$ kề bù với $\widehat{BOC}$).
**Chú ý:** chương trình không có "góc tạo bởi tia tiếp tuyến và dây cung" — $\widehat{ABD}=\widehat{DCB}$ phải đi đường vòng qua tam giác đồng dạng như trên.`,
    p2: S`a) Vì $AB$, $AC$ là tiếp tuyến của $(O)$ tại $B$, $C$ nên $\widehat{ABO}=\widehat{ACO}=90^\circ$.
Gọi $I$ là trung điểm của $AO$.
Xét $\triangle ABO$ vuông tại $B$ có $BI$ là đường trung tuyến ứng với cạnh huyền nên $BI=\dfrac{AO}{2}=IA=IO$.
Xét $\triangle ACO$ vuông tại $C$ có $CI$ là đường trung tuyến ứng với cạnh huyền nên $CI=\dfrac{AO}{2}=IA=IO$.
Suy ra $IA=IB=IO=IC$, do đó bốn điểm $A$, $B$, $O$, $C$ cùng thuộc đường tròn tâm $I$, bán kính $\dfrac{AO}{2}$.
Vì $AB$, $AC$ là hai tiếp tuyến cắt nhau tại $A$ nên $OA$ là tia phân giác của $\widehat{BOC}$, suy ra $\widehat{BOA}=\dfrac{120^\circ}{2}=60^\circ$.
Xét $\triangle ABO$ vuông tại $B$ có $OB=OA\cdot\cos\widehat{BOA}$, suy ra $OA=\dfrac{OB}{\cos60^\circ}=\dfrac{3}{\frac12}=6$ (cm).
Vậy bán kính của đường tròn đi qua bốn điểm $A$, $B$, $O$, $C$ là $\dfrac{AO}{2}=3$ cm.

b) Vì $\widehat{CDE}$ là góc nội tiếp chắn nửa đường tròn nên $\widehat{CDE}=90^\circ$, suy ra $\widehat{ADC}=90^\circ$.
Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ nên $\widehat{ACE}=90^\circ$.
Xét $\triangle ACD$ và $\triangle AEC$ có:
$\widehat{ADC}=\widehat{ACE}=90^\circ$;
$\widehat{CAE}$ chung.
Do đó $\triangle ACD\backsim\triangle AEC$ (g.g).
Suy ra $\dfrac{AC}{AE}=\dfrac{AD}{AC}$, hay $AC^2=AD\cdot AE$.
Vì $AB$, $AC$ là hai tiếp tuyến cắt nhau tại $A$ nên $AB=AC$, suy ra $AB^2=AD\cdot AE$, hay $\dfrac{AB}{AD}=\dfrac{AE}{AB}$.
Xét $\triangle ABD$ và $\triangle AEB$ có:
$\dfrac{AB}{AD}=\dfrac{AE}{AB}$ (chứng minh trên);
$\widehat{BAE}$ chung.
Do đó $\triangle ABD\backsim\triangle AEB$ (c.g.c).
Suy ra $\widehat{ABD}=\widehat{AEB}$.
Mà $\widehat{AEB}=\widehat{DCB}$ (hai góc nội tiếp cùng chắn cung $DB$).
Vậy $\widehat{ABD}=\widehat{DCB}$.

c) Vì $C$, $O$, $E$ thẳng hàng nên $\widehat{BOE}=180^\circ-\widehat{BOC}=180^\circ-120^\circ=60^\circ$.
Xét $\triangle OBE$ có $OB=OE$ và $\widehat{BOE}=60^\circ$ nên $\triangle OBE$ đều, suy ra $EB=OB=3$ cm.
Xét $\triangle ACO$ vuông tại $C$ có $AC=\sqrt{OA^2-OC^2}=\sqrt{6^2-3^2}=3\sqrt3$ (cm).
Xét $\triangle ACE$ vuông tại $C$ có $AE=\sqrt{AC^2+CE^2}=\sqrt{27+36}=3\sqrt7$ (cm).
Từ $\triangle ABD\backsim\triangle AEB$ (câu b) suy ra $\dfrac{BD}{EB}=\dfrac{AB}{AE}$, do đó $BD=\dfrac{EB\cdot AB}{AE}=\dfrac{3\cdot3\sqrt3}{3\sqrt7}=\dfrac{3\sqrt{21}}{7}$ (cm).`,
    hinh() {
      const O = P(0, 0), R = 3, B = tren(O, R, 60), C = tren(O, R, -60), A = giaoDT(B, pTiep(O, B), C, pTiep(O, C)), E = doiXungTam(C, O)
      const [D] = giaoDTvaTron(A, E, O, R), I = mid(A, O)
      return {
        kiem: [
          { ten: 'BOC = 120', a: goc(B, O, C), b: 120 }, { ten: 'OA = 6', a: kc(O, A), b: 6 }, { ten: 'IB = IA = 3', a: kc(I, B), b: 3 },
          { ten: 'AC² = AD·AE', a: kc(A, C) ** 2, b: kc(A, D) * kc(A, E) }, { ten: 'ABD = DCB', a: goc(A, B, D), b: goc(D, C, B) },
          { ten: 'AEB = DCB (cùng chắn cung DB)', a: goc(A, E, B), b: goc(D, C, B) }, { ten: 'EB = 3', a: kc(E, B), b: 3 },
          { ten: 'BD = 3√21/7', a: kc(B, D), b: 3 * Math.sqrt(21) / 7 },
        ],
        spec: {
          diem: { O, A, B, C, E, D, I }, diemPhu: ['I'], tron: [{ tam: 'O', r: R }],
          doan: [['A', 'B'], ['A', 'C'], ['O', 'B'], ['O', 'C'], ['C', 'E'], ['A', 'E'], { d: ['B', 'D'], phu: true }, { d: ['C', 'D'], phu: true }, { d: ['B', 'E'], phu: true }, { d: ['B', 'C'], phu: true }, { d: ['A', 'O'], phu: true }],
          vuong: [{ d: ['B', 'A', 'O'], phu: true }, { d: ['C', 'A', 'O'], phu: true }], goc: [{ dinh: 'O', a: 'C', b: 'B', nhan: '120°', r: 18 }],
          nhanLech: { O: [-16, 6], I: [0, 22] },
        },
      }
    },
  },
]
