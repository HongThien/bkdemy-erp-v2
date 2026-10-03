// ============================================================================
// BỔ SUNG thẻ Toán 12 theo KHUÔN MỤC SỔ TAY chung (Thùy 03/10: "Toán cũng kiểu thế" — như mục KHTN Pocket):
//   tom_tat → noi_dung (1 câu) · công thức cũ (noi_dung) → cong_thuc · vd {de, buoc[], kq} · nham[] · bien (kí hiệu) · lq (mục liên quan).
// Mọi ví dụ đã tự tính lại (ghi kết quả kiểm ở comment khi có phép tính). Sinh migration bằng `sinh-bo-sung.mjs`.
// SAU KHI NẠP: DB là chân lý (sửa trên ERP) — file này chỉ là đầu vào lịch sử.
// ============================================================================
const R = String.raw

export const BO_SUNG = {
  // ══ HS — ỨNG DỤNG ĐẠO HÀM ══
  'CT12-HS-01': {
    tom_tat: 'Dấu của đạo hàm cho biết hàm số tăng hay giảm trên từng khoảng.',
    vd: { de: R`Xét tính đơn điệu của $y=x^3-3x$.`, buoc: [R`$y'=3x^2-3=3(x-1)(x+1)$`, R`$y'>0\Leftrightarrow x<-1$ hoặc $x>1$; $y'<0\Leftrightarrow -1<x<1$`],
      kq: R`Đồng biến trên $(-\infty;-1)$ và $(1;+\infty)$; nghịch biến trên $(-1;1)$.` },
    nham: [R`Viết "đồng biến trên $(-\infty;-1)\cup(1;+\infty)$" — phải nêu TỪNG khoảng, không dùng dấu hợp.`],
    lq: ['CT12-HS-02', 'CT12-HS-03'],
  },
  'CT12-HS-02': {
    tom_tat: R`Hàm bậc ba đơn điệu trên cả $\mathbb{R}$ khi $y'$ không đổi dấu.`,
    // kiểm: a=1, b=3, c=m ⇒ b²−3ac = 9−3m ≤ 0 ⇔ m ≥ 3
    vd: { de: R`Tìm $m$ để $y=x^3+3x^2+mx+1$ đồng biến trên $\mathbb{R}$.`, buoc: [R`$y'=3x^2+6x+m$, hệ số $a=1>0$`, R`Cần $b^2-3ac=9-3m\le 0$`], kq: R`$m\ge 3$` },
    nham: [R`Dùng $b^2-3ac<0$ (bỏ mất dấu $=$) — khi $b^2-3ac=0$ hàm vẫn đồng biến.`, 'Quên xét riêng trường hợp hệ số của $x^3$ bằng $0$ khi hệ số đó chứa tham số.'],
    lq: ['CT12-HS-01', 'CT12-HS-05'],
  },
  'CT12-HS-03': {
    tom_tat: R`Hàm $y=\dfrac{ax+b}{cx+d}$ luôn đơn điệu trên từng khoảng xác định; chiều phụ thuộc dấu của $ad-bc$.`,
    vd: { de: R`Tìm $m$ để $y=\dfrac{x+m}{x+1}$ đồng biến trên từng khoảng xác định.`, buoc: [R`$ad-bc=1\cdot 1-m\cdot 1=1-m$`, R`Cần $1-m>0$`], kq: R`$m<1$` },
    nham: [R`Viết "đồng biến trên $\mathbb{R}$" — hàm không xác định tại $x=-\dfrac{d}{c}$.`, R`Lấy $ad-bc\ge 0$: khi $ad-bc=0$ hàm là hằng, không đồng biến.`],
    lq: ['CT12-HS-11', 'CT12-HS-15'],
  },
  'CT12-HS-04': {
    tom_tat: 'Xét dấu đạo hàm cấp hai tại điểm có đạo hàm bằng 0 để biết đó là cực đại hay cực tiểu.',
    // kiểm: y(1)=1−3+2=0, y(−1)=−1+3+2=4
    vd: { de: R`Tìm cực trị của $y=x^3-3x+2$.`, buoc: [R`$y'=3x^2-3=0\Leftrightarrow x=\pm 1$`, R`$y''=6x$: $y''(1)=6>0$, $y''(-1)=-6<0$`],
      kq: R`Cực tiểu tại $x=1$ (giá trị $0$); cực đại tại $x=-1$ (giá trị $4$).` },
    nham: [R`Thấy $f''(x_0)=0$ rồi kết luận "không có cực trị" — phải lập bảng biến thiên.`, R`Nhầm điểm cực trị ($x_0$) với giá trị cực trị ($f(x_0)$).`],
    lq: ['CT12-HS-05', 'CT12-HS-06'],
  },
  'CT12-HS-05': {
    tom_tat: R`Hàm bậc ba có cực trị khi $y'=0$ có hai nghiệm phân biệt.`,
    // kiểm: a=1, b=−3, c=m ⇒ 9−3m > 0 ⇔ m < 3
    vd: { de: R`Tìm $m$ để $y=x^3-3x^2+mx$ có hai điểm cực trị.`, buoc: [R`$a=1,\ b=-3,\ c=m$`, R`Cần $b^2-3ac=9-3m>0$`], kq: R`$m<3$` },
    nham: [R`Lấy $b^2-3ac\ge 0$ — nghiệm kép của $y'$ không tạo ra cực trị.`],
    lq: ['CT12-HS-02', 'CT12-HS-04'],
  },
  'CT12-HS-06': {
    tom_tat: R`Hàm trùng phương luôn có cực trị tại $x=0$; có thêm 2 cực trị khi $a$ và $b$ trái dấu.`,
    vd: { de: R`Tìm $m$ để $y=x^4-2mx^2+1$ có ba điểm cực trị.`, buoc: [R`$a=1,\ b=-2m$`, R`Cần $ab=-2m<0$`], kq: R`$m>0$` },
    nham: [R`Quên điều kiện $a\ne 0$ khi $a$ chứa tham số (khi $a=0$ hàm thành bậc hai, chỉ 1 cực trị).`],
    lq: ['CT12-HS-04'],
  },
  'CT12-HS-07': {
    tom_tat: 'Trên một đoạn, GTLN và GTNN chỉ có thể đạt ở hai đầu mút hoặc tại điểm đạo hàm bằng 0.',
    // kiểm: y(0)=1, y(1)=1−3+1=−1, y(2)=8−6+1=3
    vd: { de: R`Tìm GTLN, GTNN của $y=x^3-3x+1$ trên $[0;2]$.`, buoc: [R`$y'=3x^2-3=0\Leftrightarrow x=1$ (nhận) hoặc $x=-1$ (loại vì $\notin[0;2]$)`, R`$y(0)=1,\ y(1)=-1,\ y(2)=3$`],
      kq: R`$\max=3$ tại $x=2$; $\min=-1$ tại $x=1$.` },
    nham: ['Đem cả nghiệm nằm ngoài đoạn $[a;b]$ ra so sánh.', 'Quên tính giá trị tại hai đầu mút.'],
  },
  'CT12-HS-08': {
    tom_tat: R`Tiệm cận ngang là đường $y=y_0$ mà đồ thị tiến sát khi $x\to\pm\infty$.`,
    vd: { de: R`Tìm tiệm cận ngang của $y=\dfrac{2x+1}{x-3}$.`, buoc: [R`$\lim\limits_{x\to\pm\infty}\dfrac{2x+1}{x-3}=2$`], kq: R`$y=2$` },
    nham: [R`Chỉ xét $x\to+\infty$ — có hàm có hai tiệm cận ngang khác nhau ở hai phía.`],
    lq: ['CT12-HS-09', 'CT12-HS-10', 'CT12-HS-11'],
  },
  'CT12-HS-09': {
    tom_tat: R`Tiệm cận đứng là đường $x=x_0$ mà đồ thị đi lên hoặc xuống vô hạn khi $x$ tiến tới $x_0$.`,
    // kiểm: x→3⁺: tử → 7, mẫu → 0⁺ ⇒ +∞
    vd: { de: R`Tìm tiệm cận đứng của $y=\dfrac{2x+1}{x-3}$.`, buoc: [R`$\lim\limits_{x\to 3^+}\dfrac{2x+1}{x-3}=+\infty$`], kq: R`$x=3$` },
    nham: [R`Lấy mọi nghiệm của mẫu làm tiệm cận đứng — nếu cũng là nghiệm của tử thì có thể không phải (vd $y=\dfrac{x^2-1}{x-1}$ không có tiệm cận đứng).`],
    lq: ['CT12-HS-08', 'CT12-HS-11'],
  },
  'CT12-HS-10': {
    tom_tat: R`Tiệm cận xiên là đường $y=ax+b\ (a\ne 0)$ mà đồ thị tiến sát khi $x\to\pm\infty$.`,
    vd: { de: R`Tìm tiệm cận xiên của $y=\dfrac{x^2+1}{x}$.`, buoc: [R`$y=x+\dfrac1x$`, R`$\lim\limits_{x\to\pm\infty}(y-x)=\lim\limits_{x\to\pm\infty}\dfrac1x=0$`], kq: R`$y=x$` },
    nham: ['Ở cùng một phía ($x\\to+\\infty$ hoặc $x\\to-\\infty$) đồ thị không thể vừa có tiệm cận ngang vừa có tiệm cận xiên.'],
    lq: ['CT12-HS-12', 'CT12-HS-08'],
  },
  'CT12-HS-11': {
    tom_tat: R`Hàm $y=\dfrac{ax+b}{cx+d}$ có đúng 1 tiệm cận đứng và 1 tiệm cận ngang, đọc thẳng từ hệ số.`,
    vd: { de: R`Tìm các tiệm cận của $y=\dfrac{3x-1}{2x+4}$.`, buoc: [R`Tiệm cận đứng: $2x+4=0\Leftrightarrow x=-2$`, R`Tiệm cận ngang: $y=\dfrac{a}{c}=\dfrac32$`], kq: R`$x=-2$ và $y=\dfrac32$` },
    nham: [R`Lấy tiệm cận ngang bằng $\dfrac{b}{d}$ (tỉ số hệ số tự do) thay vì $\dfrac{a}{c}$.`],
    lq: ['CT12-HS-03', 'CT12-HS-13', 'CT12-HS-15'],
  },
  'CT12-HS-12': {
    tom_tat: R`Chia tử cho mẫu: phần đa thức bậc nhất chính là tiệm cận xiên.`,
    // kiểm: (x−1)(x+2) = x²+x−2 ⇒ x²+x+2 = (x−1)(x+2) + 4
    vd: { de: R`Tìm các tiệm cận của $y=\dfrac{x^2+x+2}{x-1}$.`, buoc: [R`Chia: $x^2+x+2=(x-1)(x+2)+4$`, R`$y=x+2+\dfrac{4}{x-1}$`], kq: R`Tiệm cận đứng $x=1$; tiệm cận xiên $y=x+2$.` },
    nham: [R`Chia đa thức sai phần dư ⇒ sai hệ số tự do của tiệm cận xiên.`],
    lq: ['CT12-HS-10', 'CT12-HS-16'],
  },
  'CT12-HS-13': {
    tom_tat: 'Đồ thị bậc ba và đồ thị phân thức đều có một tâm đối xứng.',
    // kiểm: y(1) = 1−3+2 = 0
    vd: { de: R`Tìm tâm đối xứng của đồ thị $y=x^3-3x^2+2$.`, buoc: [R`$y''=6x-6=0\Leftrightarrow x=1$`, R`$y(1)=0$`], kq: R`$I(1;0)$` },
    nham: [R`Lấy $x_0=-\dfrac{b}{a}$ (thiếu số 3 ở mẫu).`],
    lq: ['CT12-HS-14', 'CT12-HS-11'],
  },
  'CT12-HS-14': {
    tom_tat: R`Nhìn dấu của $a$ (nhánh bên phải) và số cực trị để nhận dạng đồ thị bậc ba.`,
    vd: { de: R`Đồ thị bậc ba đi lên ở bên phải và có 2 điểm cực trị. Dấu của $a$ và $b^2-3ac$?`,
      buoc: [R`Nhánh phải đi lên ⇒ $a>0$`, R`Có 2 cực trị ⇒ $y'=0$ có 2 nghiệm phân biệt ⇒ $b^2-3ac>0$`], kq: R`$a>0$ và $b^2-3ac>0$` },
    nham: [R`Nhìn nhánh TRÁI để xét dấu $a$ — phải nhìn nhánh phải (khi $x\to+\infty$).`],
    lq: ['CT12-HS-05', 'CT12-HS-13'],
  },
  'CT12-HS-15': {
    tom_tat: R`Đồ thị hàm $y=\dfrac{ax+b}{cx+d}$ gồm 2 nhánh, cùng đi lên hoặc cùng đi xuống.`,
    // kiểm: a=1,b=1,c=1,d=−1 ⇒ ad−bc = −1−1 = −2 < 0; tiệm cận x=1, y=1
    vd: { de: R`Đồ thị $y=\dfrac{x+1}{x-1}$ có hai nhánh đi lên hay đi xuống? Tâm đối xứng?`, buoc: [R`$ad-bc=1\cdot(-1)-1\cdot 1=-2<0$`], kq: R`Hai nhánh đi xuống; tâm đối xứng $I(1;1)$.` },
    nham: [R`Đọc ngược tọa độ tâm: $I\left(-\dfrac dc;\ \dfrac ac\right)$ — hoành độ là tiệm cận đứng.`],
    lq: ['CT12-HS-03', 'CT12-HS-11'],
  },
  'CT12-HS-16': {
    tom_tat: R`Đồ thị $y=\dfrac{ax^2+bx+c}{mx+n}$ có tiệm cận đứng và tiệm cận xiên, 2 nhánh đối xứng qua giao điểm của chúng.`,
    // kiểm: y = x + 1/x ⇒ y' = 1 − 1/x² = (x²−1)/x²
    vd: { de: R`Đồ thị $y=\dfrac{x^2+1}{x}$ có cực trị không?`, buoc: [R`$y'=\dfrac{x^2-1}{x^2}=0\Leftrightarrow x=\pm1$`], kq: R`Có 2 cực trị, tại $x=-1$ và $x=1$.` },
    nham: [R`Xét dấu $y'$ mà quên điểm làm mẫu bằng 0 (không thuộc tập xác định).`],
    lq: ['CT12-HS-12'],
  },
  'CT12-HS-17': {
    tom_tat: 'Số giao điểm của hai đồ thị bằng số nghiệm của phương trình hoành độ giao điểm.',
    vd: { de: R`Đồ thị $y=x^3-3x$ cắt trục hoành tại mấy điểm?`, buoc: [R`$x^3-3x=0\Leftrightarrow x(x^2-3)=0$`, R`$x=0,\ x=\pm\sqrt3$`], kq: '3 giao điểm.' },
    nham: ['Đếm nghiệm kép thành 2 giao điểm — tiếp xúc vẫn chỉ là 1 điểm chung.'],
    lq: ['CT12-HS-18'],
  },
  'CT12-HS-18': {
    tom_tat: R`Cô lập $m$ về một vế: số nghiệm = số giao điểm của đồ thị với đường thẳng nằm ngang $y=m$.`,
    // kiểm: f(x)=x³−3x có f(−1)=2 (CĐ), f(1)=−2 (CT)
    vd: { de: R`Tìm $m$ để $x^3-3x=m$ có 3 nghiệm phân biệt.`, buoc: [R`$f(x)=x^3-3x$ có cực đại $f(-1)=2$, cực tiểu $f(1)=-2$`, R`$y=m$ cắt đồ thị tại 3 điểm khi nằm giữa hai giá trị cực trị`], kq: R`$-2<m<2$` },
    nham: [R`Chưa cô lập $m$ (còn $m$ dính với $x$) đã dùng đồ thị.`, R`Lấy cả dấu $=$: khi $m=\pm2$ phương trình chỉ có 2 nghiệm.`],
    lq: ['CT12-HS-17', 'CT12-HS-04'],
  },

  // ══ VT — VECTƠ & TỌA ĐỘ ══
  'CT12-VT-01': {
    tom_tat: 'Tổng ba vectơ cạnh xuất phát từ một đỉnh của hình hộp bằng vectơ đường chéo từ đỉnh đó.',
    vd: { de: R`Hình hộp $ABCD.A'B'C'D'$. Rút gọn $\overrightarrow{AB}+\overrightarrow{AD}+\overrightarrow{AA'}$.`,
      buoc: [R`$\overrightarrow{AB}+\overrightarrow{AD}=\overrightarrow{AC}$ (quy tắc hình bình hành)`, R`$\overrightarrow{AC}+\overrightarrow{AA'}=\overrightarrow{AC}+\overrightarrow{CC'}=\overrightarrow{AC'}$`], kq: R`$\overrightarrow{AC'}$` },
    nham: ['Ba vectơ phải CÙNG xuất phát từ một đỉnh mới cộng theo quy tắc hình hộp.'],
  },
  'CT12-VT-02': {
    tom_tat: 'Tích vô hướng là một SỐ, bằng tích hai độ dài nhân cosin góc giữa hai vectơ.',
    vd: { de: R`$|\vec a|=2,\ |\vec b|=3,\ (\vec a,\vec b)=60^\circ$. Tính $\vec a\cdot\vec b$.`, buoc: [R`$\vec a\cdot\vec b=2\cdot 3\cdot\cos 60^\circ$`], kq: R`$3$` },
    nham: [R`Góc giữa hai vectơ phải đặt CHUNG GỐC; góc nằm trong $[0^\circ;180^\circ]$ (có thể tù).`],
    lq: ['CT12-VT-07'],
  },
  'CT12-VT-03': {
    tom_tat: R`Mỗi điểm, mỗi vectơ trong không gian ứng với đúng một bộ ba số $(x;y;z)$.`,
    vd: { de: R`Cho $\vec u=2\vec i-\vec j+3\vec k$. Tìm tọa độ $\vec u$.`, kq: R`$\vec u=(2;-1;3)$` },
    nham: [R`Bỏ sót thành phần bằng 0: $\vec u=2\vec i+3\vec k$ thì $\vec u=(2;0;3)$, không phải $(2;3)$.`],
    lq: ['CT12-VT-04', 'CT12-VT-09'],
  },
  'CT12-VT-04': {
    tom_tat: 'Cộng, trừ, nhân số với vectơ: làm riêng trên từng tọa độ.',
    // kiểm: 2a = (2;4;−2), 2a − b = (2−3; 4−0; −2−2) = (−1;4;−4)
    vd: { de: R`$\vec a=(1;2;-1),\ \vec b=(3;0;2)$. Tính $2\vec a-\vec b$.`, buoc: [R`$2\vec a=(2;4;-2)$`], kq: R`$2\vec a-\vec b=(-1;4;-4)$` },
    nham: ['Nhân hệ số vào 1–2 tọa độ mà quên tọa độ còn lại.'],
    lq: ['CT12-VT-05'],
  },
  'CT12-VT-05': {
    tom_tat: R`Tọa độ vectơ $\overrightarrow{AB}$ = tọa độ điểm CUỐI trừ điểm ĐẦU; độ dài là căn tổng bình phương.`,
    // kiểm: AB = (2;−2;1), |AB| = √(4+4+1) = 3
    vd: { de: R`$A(1;2;3),\ B(3;0;4)$. Tính độ dài $AB$.`, buoc: [R`$\overrightarrow{AB}=(2;-2;1)$`], kq: R`$AB=\sqrt{4+4+1}=3$` },
    nham: [R`Lấy tọa độ đầu trừ tọa độ cuối — $\overrightarrow{AB}$ là CUỐI trừ ĐẦU.`],
    lq: ['CT12-VT-06'],
  },
  'CT12-VT-06': {
    tom_tat: 'Trung điểm: trung bình cộng tọa độ 2 điểm; trọng tâm: trung bình cộng tọa độ 3 đỉnh.',
    // kiểm: (1+3+2)/3=2, (0+2+4)/3=2, (2+0+1)/3=1
    vd: { de: R`$A(1;0;2),\ B(3;2;0),\ C(2;4;1)$. Tìm trọng tâm $G$ của tam giác $ABC$.`, buoc: [R`$x_G=\dfrac{1+3+2}{3}=2,\ y_G=\dfrac{0+2+4}{3}=2,\ z_G=\dfrac{2+0+1}{3}=1$`], kq: R`$G(2;2;1)$` },
    nham: ['Chia 2 (công thức trung điểm) khi tính trọng tâm — trọng tâm chia 3.'],
    lq: ['CT12-VT-05'],
  },
  'CT12-VT-07': {
    tom_tat: 'Tích vô hướng theo tọa độ: nhân từng cặp tọa độ rồi cộng lại; dùng để tính góc và xét vuông góc.',
    // kiểm: a·b = 2−2+4 = 4; |a| = |b| = 3; cos = 4/9 ⇒ ≈ 63,6°
    vd: { de: R`$\vec a=(1;2;2),\ \vec b=(2;-1;2)$. Tính góc giữa hai vectơ.`, buoc: [R`$\vec a\cdot\vec b=2-2+4=4$`, R`$|\vec a|=3,\ |\vec b|=3$`, R`$\cos(\vec a,\vec b)=\dfrac49$`], kq: R`$(\vec a,\vec b)\approx 63{,}6^\circ$` },
    nham: [R`Lấy trị tuyệt đối như góc giữa hai ĐƯỜNG THẲNG — góc giữa hai VECTƠ có thể tù.`],
    lq: ['CT12-VT-02', 'CT12-OX-13'],
  },
  'CT12-VT-08': {
    tom_tat: R`Hai vectơ cùng phương khi vectơ này bằng $k$ lần vectơ kia.`,
    vd: { de: R`$\vec a=(2;-4;6)$ và $\vec b=(1;-2;3)$ có cùng phương không?`, kq: R`Có, vì $\vec a=2\vec b$.` },
    nham: [R`Dùng dạng tỉ số khi có tọa độ bằng 0 (chia cho 0) — khi đó kiểm tra trực tiếp $\vec a=k\vec b$.`],
    lq: ['CT12-VT-10'],
  },
  'CT12-VT-09': {
    tom_tat: 'Chiếu lên trục: giữ 1 tọa độ; chiếu lên mặt phẳng tọa độ: giữ 2 tọa độ, tọa độ còn lại bằng 0.',
    vd: { de: R`$M(2;-3;5)$. Tìm hình chiếu của $M$ lên trục $Oy$ và lên mặt phẳng $(Oxz)$.`, kq: R`Lên $Oy$: $(0;-3;0)$; lên $(Oxz)$: $(2;0;5)$.` },
    nham: ['Nhầm "chiếu lên trục" với "chiếu lên mặt phẳng tọa độ".'],
    lq: ['CT12-VT-03'],
  },
  'CT12-VT-10': {
    tom_tat: 'Tích có hướng của hai vectơ là một VECTƠ vuông góc với cả hai.',
    // kiểm: (2·1−3·0; 3·2−1·1; 1·0−2·2) = (2;5;−4); (2;5;−4)·(1;2;3)=0, ·(2;0;1)=0
    vd: { de: R`$\vec a=(1;2;3),\ \vec b=(2;0;1)$. Tính $[\vec a,\vec b]$.`, buoc: [R`Thành phần 1: $2\cdot 1-3\cdot 0=2$`, R`Thành phần 2: $3\cdot 2-1\cdot 1=5$`, R`Thành phần 3: $1\cdot 0-2\cdot 2=-4$`], kq: R`$[\vec a,\vec b]=(2;5;-4)$` },
    nham: [R`Sai dấu thành phần thứ hai: đúng là $a_3b_1-a_1b_3$, không phải $a_1b_3-a_3b_1$.`],
    lq: ['CT12-VT-11', 'CT12-OX-02'],
  },
  'CT12-VT-11': {
    tom_tat: 'Độ lớn tích có hướng cho diện tích; tích hỗn tạp cho thể tích và xét đồng phẳng.',
    // kiểm: AB=(1;0;0), AC=(0;2;0) ⇒ [AB,AC]=(0;0;2); ·AD(0;0;3)=6 ⇒ V=1
    vd: { de: R`$A(0;0;0),\ B(1;0;0),\ C(0;2;0),\ D(0;0;3)$. Tính thể tích tứ diện $ABCD$.`, buoc: [R`$[\overrightarrow{AB},\overrightarrow{AC}]=(0;0;2)$`, R`$[\overrightarrow{AB},\overrightarrow{AC}]\cdot\overrightarrow{AD}=6$`], kq: R`$V=\dfrac16\cdot 6=1$` },
    nham: [R`Quên hệ số $\dfrac16$ (tứ diện) hoặc $\dfrac12$ (tam giác).`, 'Quên trị tuyệt đối ⇒ ra thể tích âm.'],
    lq: ['CT12-VT-10'],
  },

  // ══ TK — THỐNG KÊ GHÉP NHÓM ══
  'CT12-TK-01': {
    tom_tat: 'Khoảng biến thiên đo độ trải rộng của cả mẫu: từ đầu nhóm đầu tới cuối nhóm cuối.',
    vd: { de: R`Mẫu ghép nhóm có các nhóm $[40;45),\ [45;50),\ [50;55),\ [55;60)$. Tính khoảng biến thiên.`, kq: R`$R=60-40=20$` },
    nham: ['Lấy hiệu GIÁ TRỊ ĐẠI DIỆN (trung điểm) của nhóm cuối và nhóm đầu.'],
    lq: ['CT12-TK-03'],
  },
  'CT12-TK-02': {
    tom_tat: 'Tìm nhóm chứa tứ phân vị rồi nội suy tuyến tính bên trong nhóm đó.',
    bien: [['$n$', 'cỡ mẫu'], ['$[a_p;a_{p+1})$', 'nhóm chứa tứ phân vị'], ['$m_p$', 'tần số của nhóm đó'], ['$C$', 'tổng tần số các nhóm đứng TRƯỚC nhóm đó']],
    // kiểm: n/4 = 10; tích luỹ 8, 20 ⇒ nhóm [10;20), C=8, m=12 ⇒ Q1 = 10 + 2/12·10 = 35/3 ≈ 11,67
    vd: { de: R`Nhóm $[0;10),\ [10;20),\ [20;30),\ [30;40)$ có tần số $8,\ 12,\ 14,\ 6$ ($n=40$). Tính $Q_1$.`,
      buoc: [R`$\dfrac n4=10$; tần số tích lũy $8,\ 20,\dots$ ⇒ $Q_1$ thuộc nhóm $[10;20)$`, R`$C=8,\ m_p=12$`], kq: R`$Q_1=10+\dfrac{10-8}{12}\cdot 10=\dfrac{35}{3}\approx 11{,}67$` },
    nham: [R`Lấy $C$ đã cộng cả tần số của nhóm chứa $Q$ — $C$ chỉ là tổng các nhóm đứng TRƯỚC.`, 'Nhân với độ dài sai nhóm.'],
    lq: ['CT12-TK-03'],
  },
  'CT12-TK-03': {
    tom_tat: 'Khoảng tứ phân vị đo độ trải rộng của nửa giữa mẫu số liệu.',
    // kiểm (mẫu ở thẻ TK-02): Q1 = 35/3; 3n/4=30, tích luỹ 8,20,34 ⇒ nhóm [20;30), C=20, m=14 ⇒ Q3 = 20+10/14·10 = 190/7; ΔQ = 190/7 − 35/3 = 325/21 ≈ 15,48
    vd: { de: R`Mẫu: nhóm $[0;10),\ [10;20),\ [20;30),\ [30;40)$, tần số $8,\ 12,\ 14,\ 6$. Tính $\Delta_Q$.`,
      buoc: [R`$Q_1=\dfrac{35}{3}$ (xem thẻ Tứ phân vị)`, R`$\dfrac{3n}{4}=30$ ⇒ $Q_3$ thuộc $[20;30)$: $Q_3=20+\dfrac{30-20}{14}\cdot 10=\dfrac{190}{7}$`], kq: R`$\Delta_Q=\dfrac{190}{7}-\dfrac{35}{3}=\dfrac{325}{21}\approx 15{,}48$` },
    nham: [R`Lấy $Q_3-Q_1$ từ giá trị đại diện thay vì tính $Q_1, Q_3$ bằng công thức nội suy.`],
    lq: ['CT12-TK-02', 'CT12-TK-01'],
  },
  'CT12-TK-04': {
    tom_tat: 'Thay mỗi nhóm bằng giá trị đại diện (trung điểm) rồi lấy trung bình có trọng số theo tần số.',
    bien: [['$c_i$', 'giá trị đại diện (trung điểm) nhóm $i$'], ['$m_i$', 'tần số nhóm $i$'], ['$n$', 'cỡ mẫu']],
    // kiểm: (2·5 + 5·15 + 3·25)/10 = 160/10 = 16
    vd: { de: R`Nhóm $[0;10),\ [10;20),\ [20;30)$ có tần số $2,\ 5,\ 3$. Tính số trung bình.`, buoc: [R`Giá trị đại diện: $5,\ 15,\ 25$`], kq: R`$\overline{x}=\dfrac{2\cdot 5+5\cdot 15+3\cdot 25}{10}=16$` },
    nham: ['Dùng đầu mút của nhóm thay cho trung điểm.'],
    lq: ['CT12-TK-05'],
  },
  'CT12-TK-05': {
    tom_tat: 'Phương sai đo độ phân tán quanh số trung bình.',
    bien: [['$c_i$', 'giá trị đại diện nhóm $i$'], ['$m_i$', 'tần số nhóm $i$'], [R`$\overline{x}$`, 'số trung bình']],
    // kiểm: (2·25 + 5·225 + 3·625)/10 = 3050/10 = 305; 305 − 16² = 49
    vd: { de: R`Nhóm $[0;10),\ [10;20),\ [20;30)$, tần số $2,\ 5,\ 3$ ($\overline{x}=16$). Tính phương sai.`, buoc: [R`$\dfrac{2\cdot 25+5\cdot 225+3\cdot 625}{10}=305$`], kq: R`$s^2=305-16^2=49$` },
    nham: [R`Quên trừ $\overline{x}^2$, hoặc trừ $\overline{x}$ chưa bình phương.`],
    lq: ['CT12-TK-04', 'CT12-TK-06'],
  },
  'CT12-TK-06': {
    tom_tat: 'Độ lệch chuẩn là căn bậc hai của phương sai, cùng đơn vị với dữ liệu.',
    vd: { de: R`Mẫu ở thẻ Phương sai có $s^2=49$. Tính độ lệch chuẩn.`, kq: R`$s=\sqrt{49}=7$` },
    nham: ['Ghi phương sai thay cho độ lệch chuẩn (quên lấy căn).'],
    lq: ['CT12-TK-05'],
  },

  // ══ NH — NGUYÊN HÀM, TÍCH PHÂN ══
  'CT12-NH-01': {
    tom_tat: R`Nguyên hàm là phép ngược của đạo hàm; các nguyên hàm của một hàm chỉ khác nhau hằng số $C$.`,
    vd: { de: R`Chứng tỏ $F(x)=x^3+2$ là một nguyên hàm của $f(x)=3x^2$.`, kq: R`$F'(x)=3x^2=f(x)$.` },
    nham: [R`Quên $+C$ khi viết họ nguyên hàm.`],
    lq: ['CT12-NH-03'],
  },
  'CT12-NH-02': {
    tom_tat: 'Nguyên hàm tách được qua phép cộng, trừ và đưa hằng số ra ngoài.',
    vd: { de: R`Tính $\displaystyle\int(2x+\cos x)\,dx$.`, kq: R`$x^2+\sin x+C$` },
    nham: ['Dùng "nguyên hàm của tích bằng tích các nguyên hàm" — không có tính chất đó.'],
    lq: ['CT12-NH-03'],
  },
  'CT12-NH-03': {
    tom_tat: 'Bảng nguyên hàm của các hàm sơ cấp thường gặp — học thuộc để tính nhanh.',
    vd: { de: R`Tính $\displaystyle\int\left(x^2+\dfrac1x+e^x\right)dx$.`, kq: R`$\dfrac{x^3}{3}+\ln|x|+e^x+C$` },
    nham: [R`$\displaystyle\int\sin x\,dx=\cos x$ — sai dấu, đúng là $-\cos x+C$.`, R`Quên trị tuyệt đối trong $\ln|x|$.`],
    lq: ['CT12-NH-04', 'CT12-NH-02'],
  },
  'CT12-NH-04': {
    tom_tat: R`Thay $x$ bằng $ax+b$ trong bảng nguyên hàm rồi nhân thêm $\dfrac1a$.`,
    vd: { de: R`Tính $\displaystyle\int e^{2x+1}\,dx$.`, kq: R`$\dfrac12e^{2x+1}+C$` },
    nham: [R`Quên nhân $\dfrac1a$.`],
    lq: ['CT12-NH-03'],
  },
  'CT12-NH-05': {
    tom_tat: 'Tích phân = hiệu giá trị một nguyên hàm tại cận trên và cận dưới.',
    vd: { de: R`Tính $\displaystyle\int_1^2 2x\,dx$.`, kq: R`$x^2\Big|_1^2=4-1=3$` },
    nham: [R`Tính $F(a)-F(b)$ (ngược thứ tự cận).`],
    lq: ['CT12-NH-06'],
  },
  'CT12-NH-06': {
    tom_tat: 'Tích phân cộng được theo cận và đổi dấu khi đảo cận.',
    vd: { de: R`Biết $\displaystyle\int_0^2 f(x)\,dx=3$ và $\displaystyle\int_2^5 f(x)\,dx=4$. Tính $\displaystyle\int_0^5 f(x)\,dx$.`, kq: R`$3+4=7$` },
    nham: ['Đảo cận mà quên đổi dấu.'],
    lq: ['CT12-NH-05'],
  },
  'CT12-NH-07': {
    tom_tat: 'Diện tích giữa đồ thị và trục hoành là tích phân của TRỊ TUYỆT ĐỐI hàm số.',
    // kiểm: ∫₀¹(1−x²)=2/3; ∫₁²(x²−1)=4/3 ⇒ S=2
    vd: { de: R`Tính diện tích hình phẳng giới hạn bởi $y=x^2-1$, trục hoành, $x=0$, $x=2$.`,
      buoc: [R`$x^2-1$ đổi dấu tại $x=1$`, R`$S=\displaystyle\int_0^1(1-x^2)\,dx+\int_1^2(x^2-1)\,dx=\dfrac23+\dfrac43$`], kq: R`$S=2$` },
    nham: [R`Bỏ trị tuyệt đối: $\displaystyle\int_0^2(x^2-1)\,dx=\dfrac23$ — sai vì hàm đổi dấu trên đoạn.`],
    lq: ['CT12-NH-08'],
  },
  'CT12-NH-08': {
    tom_tat: 'Diện tích giữa hai đồ thị là tích phân trị tuyệt đối của hiệu hai hàm.',
    // kiểm: ∫₀¹(x−x²) = 1/2 − 1/3 = 1/6
    vd: { de: R`Tính diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.`, buoc: [R`Giao điểm: $x^2=x\Leftrightarrow x=0$ hoặc $x=1$`, R`$S=\displaystyle\int_0^1|x-x^2|\,dx=\dfrac12-\dfrac13$`], kq: R`$S=\dfrac16$` },
    nham: [R`Đề không cho $x=a,\ x=b$ mà quên giải phương trình hoành độ giao điểm để tìm cận.`],
    lq: ['CT12-NH-07'],
  },
  'CT12-NH-09': {
    tom_tat: 'Thể tích vật thể = tích phân diện tích thiết diện vuông góc với trục.',
    // kiểm: ∫₀² x² dx = 8/3
    vd: { de: R`Vật thể nằm giữa $x=0$ và $x=2$; thiết diện vuông góc với $Ox$ tại $x$ là hình vuông cạnh $x$. Tính thể tích.`, buoc: [R`$S(x)=x^2$`], kq: R`$V=\displaystyle\int_0^2x^2\,dx=\dfrac83$` },
    nham: [R`Dùng $\pi\displaystyle\int f^2(x)\,dx$ cho vật thể không phải khối tròn xoay.`],
    lq: ['CT12-NH-10'],
  },
  'CT12-NH-10': {
    tom_tat: R`Quay quanh $Ox$: mỗi thiết diện là hình tròn bán kính $|f(x)|$.`,
    // kiểm: π∫₀⁴ x dx = π·8
    vd: { de: R`Quay hình phẳng giới hạn bởi $y=\sqrt x$, trục $Ox$, $x=0$, $x=4$ quanh $Ox$. Tính thể tích.`, kq: R`$V=\pi\displaystyle\int_0^4 x\,dx=8\pi$` },
    nham: [R`Quên $\pi$ hoặc quên bình phương $f(x)$.`],
    lq: ['CT12-NH-09'],
  },
  'CT12-NH-11': {
    tom_tat: 'Tích phân của tốc độ thay đổi cho lượng thay đổi — vd tích phân vận tốc cho quãng đường.',
    // kiểm: ∫₀² 3t² dt = t³|₀² = 8
    vd: { de: R`Vật chuyển động với vận tốc $v(t)=3t^2$ (m/s). Tính quãng đường từ $t=0$ đến $t=2$ (s).`, kq: R`$s=\displaystyle\int_0^2 3t^2\,dt=8$ (m)` },
    nham: [R`Lấy $v(2)\times 2$ — chỉ đúng khi vận tốc không đổi.`],
  },
  'CT12-NH-12': {
    tom_tat: 'Tách biểu thức thành $u\\,dv$, chuyển việc tính về $\\int v\\,du$ dễ hơn.',
    // kiểm: xeˣ|₀¹ − ∫₀¹eˣ = e − (e−1) = 1
    vd: { de: R`Tính $\displaystyle\int_0^1 xe^x\,dx$.`, buoc: [R`Đặt $u=x,\ dv=e^x dx$ ⇒ $du=dx,\ v=e^x$`, R`$=xe^x\Big|_0^1-\displaystyle\int_0^1 e^x\,dx=e-(e-1)$`], kq: R`$1$` },
    nham: [R`Đặt $u=e^x$ ⇒ tích phân mới còn khó hơn.`],
    lq: ['CT12-NH-13'],
  },
  'CT12-NH-13': {
    tom_tat: 'Đặt biến mới để đưa tích phân về dạng có trong bảng — nhớ đổi cả cận.',
    // kiểm: t=x²+1, dt=2x dx, cận 1→2: ∫₁² t³ dt = (16−1)/4 = 15/4
    vd: { de: R`Tính $\displaystyle\int_0^1 2x(x^2+1)^3\,dx$.`, buoc: [R`Đặt $t=x^2+1$ ⇒ $dt=2x\,dx$; $x=0\to t=1,\ x=1\to t=2$`, R`$=\displaystyle\int_1^2 t^3\,dt=\dfrac{t^4}{4}\Big|_1^2$`], kq: R`$\dfrac{15}{4}$` },
    nham: ['Đổi biến mà quên đổi cận.'],
    lq: ['CT12-NH-12'],
  },

  // ══ OX — TỌA ĐỘ KHÔNG GIAN ══
  'CT12-OX-01': {
    tom_tat: 'Viết phương trình mặt phẳng cần 1 điểm đi qua và 1 vectơ pháp tuyến.',
    // kiểm: 2(x−1) − (y−2) + 3(z+1) = 2x − y + 3z + 3
    vd: { de: R`Viết phương trình mặt phẳng qua $M(1;2;-1)$, có VTPT $\vec n=(2;-1;3)$.`, buoc: [R`$2(x-1)-(y-2)+3(z+1)=0$`], kq: R`$2x-y+3z+3=0$` },
    nham: ['Nhầm VTPT (vuông góc mặt phẳng) với VTCP (nằm trong mặt phẳng).', R`Sai dấu khi thay tọa độ âm: $z-(-1)=z+1$.`],
    lq: ['CT12-OX-02', 'CT12-OX-03'],
  },
  'CT12-OX-02': {
    tom_tat: 'Biết hai vectơ nằm trong mặt phẳng (không cùng phương) thì VTPT là tích có hướng của chúng.',
    // kiểm: [(1;0;1),(0;1;1)] = (0·1−1·1; 1·0−1·1; 1·1−0·0) = (−1;−1;1)
    vd: { de: R`Viết phương trình mặt phẳng qua $O$, có cặp VTCP $\vec a=(1;0;1),\ \vec b=(0;1;1)$.`, buoc: [R`$\vec n=[\vec a,\vec b]=(-1;-1;1)$`], kq: R`$x+y-z=0$` },
    nham: [R`Lấy $\vec a+\vec b$ làm VTPT.`],
    lq: ['CT12-VT-10', 'CT12-OX-03'],
  },
  'CT12-OX-03': {
    tom_tat: 'Mặt phẳng qua 3 điểm: VTPT là tích có hướng của hai vectơ nối các điểm.',
    // kiểm: AB=(−1;2;0), AC=(−1;0;3) ⇒ [AB,AC]=(6;3;2); qua A: 6x+3y+2z−6=0 (≡ x/1+y/2+z/3=1)
    vd: { de: R`Viết phương trình mặt phẳng qua $A(1;0;0),\ B(0;2;0),\ C(0;0;3)$.`, buoc: [R`$\overrightarrow{AB}=(-1;2;0),\ \overrightarrow{AC}=(-1;0;3)$`, R`$\vec n=[\overrightarrow{AB},\overrightarrow{AC}]=(6;3;2)$`], kq: R`$6x+3y+2z-6=0$` },
    nham: [R`Ba điểm thẳng hàng thì không xác định được mặt phẳng (tích có hướng bằng $\vec 0$).`],
    lq: ['CT12-OX-04', 'CT12-OX-02'],
  },
  'CT12-OX-04': {
    tom_tat: 'Mặt phẳng cắt ba trục tọa độ tại ba điểm khác gốc: viết nhanh bằng đoạn chắn.',
    vd: { de: R`Mặt phẳng cắt các trục tại $A(2;0;0),\ B(0;-1;0),\ C(0;0;4)$.`, kq: R`$\dfrac x2-y+\dfrac z4=1$` },
    nham: ['Dùng dạng đoạn chắn khi mặt phẳng đi qua gốc tọa độ — khi đó không có đoạn chắn.'],
    lq: ['CT12-OX-03'],
  },
  'CT12-OX-05': {
    tom_tat: 'Mặt phẳng tọa độ THIẾU biến nào thì biến đó bằng 0.',
    vd: { de: R`Phương trình mặt phẳng $(Oxz)$ và một VTPT của nó?`, kq: R`$y=0$; VTPT $\vec j=(0;1;0)$.` },
    nham: [R`Viết $(Oxy)$ là $x=0$ — đúng là $z=0$.`],
  },
  'CT12-OX-06': {
    tom_tat: 'Song song: dùng chung VTPT. Mặt phẳng trung trực: qua trung điểm, VTPT là vectơ nối hai điểm.',
    // kiểm: I(2;1;2), AB=(2;−2;−2) ⇒ 2(x−2)−2(y−1)−2(z−2)=0 ⇔ x−y−z+1=0; thử I: 2−1−2+1=0
    vd: { de: R`Viết phương trình mặt phẳng trung trực của $AB$ với $A(1;2;3),\ B(3;0;1)$.`, buoc: [R`Trung điểm $I(2;1;2)$; $\overrightarrow{AB}=(2;-2;-2)$`, R`$2(x-2)-2(y-1)-2(z-2)=0$`], kq: R`$x-y-z+1=0$` },
    nham: [R`Lấy $A$ (thay vì trung điểm $I$) làm điểm đi qua.`],
    lq: ['CT12-OX-01', 'CT12-VT-06'],
  },
  'CT12-OX-07': {
    tom_tat: 'So tỉ số các hệ số $A, B, C$ (và $D$) để biết hai mặt phẳng song song, trùng hay cắt nhau.',
    vd: { de: R`$(P): x+2y-z+1=0$ và $(Q): 2x+4y-2z+5=0$. Xét vị trí tương đối.`, buoc: [R`$\dfrac12=\dfrac24=\dfrac{-1}{-2}\ne\dfrac15$`], kq: R`$(P)\parallel(Q)$` },
    nham: [R`So tỉ số $A,B,C$ mà quên so $D$ ⇒ nhầm song song với trùng nhau.`],
    lq: ['CT12-OX-17'],
  },
  'CT12-OX-08': {
    tom_tat: 'Phương trình tham số: điểm đi qua + $t$ lần vectơ chỉ phương.',
    vd: { de: R`Viết phương trình tham số của đường thẳng qua $A(1;-1;2)$, VTCP $\vec u=(2;1;-3)$.`, kq: R`$\begin{cases} x=1+2t \\ y=-1+t \\ z=2-3t \end{cases}$` },
    nham: [R`Đảo vai trò: lấy tọa độ điểm làm hệ số của $t$.`],
    lq: ['CT12-OX-09', 'CT12-OX-10'],
  },
  'CT12-OX-09': {
    tom_tat: 'Phương trình chính tắc: ba tỉ số bằng nhau, mẫu là tọa độ VTCP.',
    vd: { de: R`Viết phương trình chính tắc của đường thẳng qua $A(1;0;-2)$, VTCP $(3;-1;2)$.`, kq: R`$\dfrac{x-1}{3}=\dfrac{y}{-1}=\dfrac{z+2}{2}$` },
    nham: ['Viết dạng chính tắc khi VTCP có tọa độ bằng 0 (mẫu bằng 0).'],
    lq: ['CT12-OX-08'],
  },
  'CT12-OX-10': {
    tom_tat: 'Đường thẳng vuông góc mặt phẳng nhận VTPT của mặt phẳng làm VTCP.',
    vd: { de: R`Viết phương trình đường thẳng qua $A(1;2;3)$ và vuông góc với $(P): 2x-y+z-1=0$.`, kq: R`$\begin{cases} x=1+2t \\ y=2-t \\ z=3+t \end{cases}$` },
    nham: [R`Lấy một vectơ nằm trong $(P)$ làm VTCP.`],
    lq: ['CT12-OX-08', 'CT12-OX-20'],
  },
  'CT12-OX-11': {
    tom_tat: R`Thay phương trình tham số vào mặt phẳng: số nghiệm $t$ cho vị trí tương đối.`,
    // kiểm: (1+t)+2t+(3−t)−6 = 2t−2 = 0 ⇔ t=1 ⇒ (2;2;2); thử: 2+2+2−6=0
    vd: { de: R`$d: x=1+t,\ y=2t,\ z=3-t$ và $(P): x+y+z-6=0$. Tìm giao điểm.`, buoc: [R`$(1+t)+2t+(3-t)-6=0\Leftrightarrow 2t-2=0\Leftrightarrow t=1$`], kq: R`$d$ cắt $(P)$ tại $(2;2;2)$.` },
    nham: [R`Thấy $\vec u\cdot\vec n=0$ rồi kết luận song song — còn có thể nằm trong mặt phẳng, phải thử thêm 1 điểm.`],
    lq: ['CT12-OX-14'],
  },
  'CT12-OX-12': {
    tom_tat: 'Dùng tích có hướng của hai VTCP và vectơ nối hai điểm để phân biệt song song, cắt nhau, chéo nhau.',
    // kiểm: [(1;0;0),(0;1;0)] = (0;0;1); AB=(0;1;1) ⇒ tích = 1 ≠ 0
    vd: { de: R`$d_1$ qua $A(0;0;0)$, VTCP $(1;0;0)$; $d_2$ qua $B(0;1;1)$, VTCP $(0;1;0)$. Xét vị trí tương đối.`, buoc: [R`$[\vec u_1,\vec u_2]=(0;0;1)$`, R`$\overrightarrow{AB}=(0;1;1)$; $[\vec u_1,\vec u_2]\cdot\overrightarrow{AB}=1\ne 0$`], kq: 'Chéo nhau.' },
    nham: ['Thấy hai VTCP không cùng phương rồi kết luận "cắt nhau" — còn có thể chéo nhau.'],
    lq: ['CT12-OX-19', 'CT12-VT-10'],
  },
  'CT12-OX-13': {
    tom_tat: 'Góc giữa hai đường thẳng tính qua góc giữa hai VTCP, luôn lấy trị tuyệt đối.',
    // kiểm: |0+1+0| / (√2·√2) = 1/2 ⇒ 60°
    vd: { de: R`Tính góc giữa hai đường thẳng có VTCP $\vec u_1=(1;1;0),\ \vec u_2=(0;1;1)$.`, buoc: [R`$\cos=\dfrac{|0+1+0|}{\sqrt2\cdot\sqrt2}=\dfrac12$`], kq: R`$60^\circ$` },
    nham: ['Bỏ trị tuyệt đối ⇒ ra góc tù.'],
    lq: ['CT12-OX-14', 'CT12-OX-15', 'CT12-VT-07'],
  },
  'CT12-OX-14': {
    tom_tat: 'Góc giữa đường thẳng và mặt phẳng dùng SIN, vì VTPT vuông góc với mặt phẳng.',
    // kiểm: |0+0+1| / (√2·1) = √2/2 ⇒ 45°
    vd: { de: R`Đường thẳng có VTCP $\vec u=(1;0;1)$, mặt phẳng có VTPT $\vec n=(0;0;1)$. Tính góc giữa chúng.`, buoc: [R`$\sin\varphi=\dfrac{|1|}{\sqrt2\cdot 1}=\dfrac{\sqrt2}{2}$`], kq: R`$\varphi=45^\circ$` },
    nham: [R`Dùng $\cos$ thay cho $\sin$ ⇒ ra góc phụ ($90^\circ-\varphi$).`],
    lq: ['CT12-OX-13', 'CT12-OX-15'],
  },
  'CT12-OX-15': {
    tom_tat: 'Góc giữa hai mặt phẳng tính qua góc giữa hai VTPT, luôn lấy trị tuyệt đối.',
    // kiểm: n_P=(1;−1;0), n_Q=(1;0;0): |1|/(√2·1) = √2/2 ⇒ 45°
    vd: { de: R`Tính góc giữa $(P): x-y+1=0$ và $(Q): x-3=0$.`, buoc: [R`$\vec n_P=(1;-1;0),\ \vec n_Q=(1;0;0)$`, R`$\cos=\dfrac{|1|}{\sqrt2\cdot 1}=\dfrac{\sqrt2}{2}$`], kq: R`$45^\circ$` },
    nham: [R`Góc giữa hai mặt phẳng không vượt quá $90^\circ$ — phải lấy trị tuyệt đối.`],
    lq: ['CT12-OX-13', 'CT12-OX-14'],
  },
  'CT12-OX-16': {
    tom_tat: 'Thay tọa độ điểm vào vế trái phương trình mặt phẳng, lấy trị tuyệt đối, chia độ dài VTPT.',
    // kiểm: |2−2+6−3| / √9 = 3/3 = 1
    vd: { de: R`Tính khoảng cách từ $M(1;2;3)$ đến $(P): 2x-y+2z-3=0$.`, buoc: [R`$d=\dfrac{|2-2+6-3|}{\sqrt{4+1+4}}$`], kq: R`$d=1$` },
    nham: ['Quên trị tuyệt đối ở tử hoặc quên lấy căn ở mẫu.'],
    lq: ['CT12-OX-17', 'CT12-OX-20'],
  },
  'CT12-OX-17': {
    tom_tat: 'Khoảng cách giữa hai mặt phẳng song song = khoảng cách từ một điểm của mặt này đến mặt kia.',
    // kiểm: |−1−8| / √(1+4+4) = 9/3 = 3
    vd: { de: R`Tính khoảng cách giữa $(P): x+2y+2z-1=0$ và $(Q): x+2y+2z+8=0$.`, kq: R`$d=\dfrac{|-1-8|}{\sqrt{1+4+4}}=3$` },
    nham: [R`Dùng công thức $|D_1-D_2|$ khi hệ số $A,B,C$ hai mặt chưa giống hệt (vd $2x+4y+4z+16=0$ phải chia 2 trước).`],
    lq: ['CT12-OX-16', 'CT12-OX-07'],
  },
  'CT12-OX-18': {
    tom_tat: 'Khoảng cách từ điểm đến đường thẳng = độ lớn tích có hướng chia độ dài VTCP.',
    // kiểm: OM=(1;1;1), u=(1;0;0) ⇒ [OM,u]=(0;1;−1), |·|=√2, |u|=1 ⇒ √2 (= khoảng cách từ (1;1;1) tới Ox)
    vd: { de: R`Tính khoảng cách từ $M(1;1;1)$ đến trục $Ox$ (qua $O$, VTCP $\vec u=(1;0;0)$).`, buoc: [R`$\overrightarrow{OM}=(1;1;1)$, $[\overrightarrow{OM},\vec u]=(0;1;-1)$`], kq: R`$d=\dfrac{\sqrt2}{1}=\sqrt2$` },
    nham: [R`Chia cho $|\overrightarrow{M_0M}|$ thay vì $|\vec u|$.`],
    lq: ['CT12-OX-19'],
  },
  'CT12-OX-19': {
    tom_tat: 'Khoảng cách giữa hai đường thẳng chéo nhau = |tích hỗn tạp| chia độ lớn tích có hướng hai VTCP.',
    // kiểm: [u1,u2]=(0;0;1), M1M2=(0;1;1) ⇒ |1|/1 = 1
    vd: { de: R`$d_1$ qua $O$, VTCP $(1;0;0)$; $d_2$ qua $B(0;1;1)$, VTCP $(0;1;0)$. Tính khoảng cách.`, buoc: [R`$[\vec u_1,\vec u_2]=(0;0;1)$, $\overrightarrow{OB}=(0;1;1)$`], kq: R`$d=\dfrac{|0+0+1|}{1}=1$` },
    nham: ['Quên trị tuyệt đối ở tử.'],
    lq: ['CT12-OX-12', 'CT12-OX-18'],
  },
  'CT12-OX-20': {
    tom_tat: 'Hình chiếu của điểm lên mặt phẳng = giao của mặt phẳng với đường thẳng vuông góc qua điểm đó.',
    // kiểm: (1+t)+(2+t)+(3+t)−3 = 3t+3 = 0 ⇔ t=−1 ⇒ H(0;1;2); M' = 2H−M = (−1;0;1)
    vd: { de: R`Tìm hình chiếu của $M(1;2;3)$ lên $(P): x+y+z-3=0$ và điểm đối xứng của $M$ qua $(P)$.`,
      buoc: [R`$d$ qua $M$, VTCP $(1;1;1)$: $x=1+t,\ y=2+t,\ z=3+t$`, R`$(1+t)+(2+t)+(3+t)-3=0\Leftrightarrow t=-1$`], kq: R`$H(0;1;2)$; điểm đối xứng $M'(-1;0;1)$.` },
    nham: [R`Lấy $M'=H-M$ — đúng là $M'=2H-M$ (vì $H$ là trung điểm $MM'$).`],
    lq: ['CT12-OX-10', 'CT12-OX-16'],
  },
  'CT12-OX-21': {
    tom_tat: 'Viết phương trình mặt cầu cần tâm và bán kính.',
    vd: { de: R`Viết phương trình mặt cầu tâm $I(1;-2;0)$, bán kính $3$.`, kq: R`$(x-1)^2+(y+2)^2+z^2=9$` },
    nham: [R`Viết $R$ thay vì $R^2$ ở vế phải.`],
    lq: ['CT12-OX-22', 'CT12-OX-23'],
  },
  'CT12-OX-22': {
    tom_tat: 'Từ dạng khai triển: tâm lấy từ hệ số bậc nhất (đổi dấu, chia 2), bán kính tính bằng căn.',
    // kiểm: −2a=−2 ⇒ a=1; −2b=4 ⇒ b=−2; −2c=−6 ⇒ c=3; R=√(1+4+9−5)=3
    vd: { de: R`Tìm tâm và bán kính mặt cầu $x^2+y^2+z^2-2x+4y-6z+5=0$.`, buoc: [R`$a=1,\ b=-2,\ c=3,\ d=5$`], kq: R`Tâm $I(1;-2;3)$, $R=\sqrt{1+4+9-5}=3$.` },
    nham: [R`Lấy tâm cùng dấu với hệ số (tâm là $(1;-2;3)$, không phải $(-1;2;-3)$).`, R`Quên kiểm tra $a^2+b^2+c^2-d>0$.`],
    lq: ['CT12-OX-21'],
  },
  'CT12-OX-23': {
    tom_tat: 'Ba cách hay gặp để có tâm và bán kính: đường kính, đi qua một điểm, tiếp xúc mặt phẳng.',
    // kiểm: I(2;2;2), AB=√(4+16+0)=√20 ⇒ R=√5
    vd: { de: R`Viết phương trình mặt cầu đường kính $AB$ với $A(1;0;2),\ B(3;4;2)$.`, buoc: [R`Tâm $I(2;2;2)$`, R`$R=\dfrac{AB}{2}=\dfrac{\sqrt{4+16+0}}{2}=\sqrt5$`], kq: R`$(x-2)^2+(y-2)^2+(z-2)^2=5$` },
    nham: [R`Lấy $R=AB$ (quên chia 2).`],
    lq: ['CT12-OX-21', 'CT12-OX-16'],
  },
  'CT12-OX-24': {
    tom_tat: 'So khoảng cách từ tâm đến mặt phẳng với bán kính để biết mặt phẳng cắt, tiếp xúc hay không cắt mặt cầu.',
    // kiểm: d=3 < R=5 ⇒ r=√(25−9)=4
    vd: { de: R`Mặt cầu tâm $O$, bán kính $5$ và mặt phẳng $(P): z=3$. Xét vị trí tương đối.`, buoc: [R`$d(O,(P))=3<5$`], kq: R`Cắt nhau theo đường tròn bán kính $r=\sqrt{25-9}=4$.` },
    nham: [R`Tính $r=R-d$ thay vì $r=\sqrt{R^2-d^2}$.`],
    lq: ['CT12-OX-16', 'CT12-OX-21'],
  },

  // ══ XS — XÁC SUẤT CÓ ĐIỀU KIỆN ══
  'CT12-XS-01': {
    tom_tat: 'Xác suất của A khi đã biết B xảy ra: thu hẹp không gian mẫu về B.',
    vd: { de: 'Gieo một con xúc xắc. Biết đã ra mặt chẵn, tính xác suất ra mặt 6.', buoc: [R`$B$ = "mặt chẵn": $n(B)=3$; $A\cap B=\{6\}$`], kq: R`$P(A\mid B)=\dfrac13$` },
    nham: [R`Nhầm $P(A\mid B)$ với $P(B\mid A)$.`, R`Chia cho $n(\Omega)$ thay vì $n(B)$.`],
    lq: ['CT12-XS-02', 'CT12-XS-04'],
  },
  'CT12-XS-02': {
    tom_tat: 'Xác suất hai biến cố cùng xảy ra = xác suất cái trước nhân xác suất cái sau khi đã biết cái trước.',
    // kiểm: 5/8 · 4/7 = 20/56 = 5/14
    vd: { de: 'Hộp có 5 bi đỏ, 3 bi xanh. Lấy lần lượt 2 bi, không hoàn lại. Tính xác suất cả hai bi đều đỏ.', kq: R`$\dfrac58\cdot\dfrac47=\dfrac{5}{14}$` },
    nham: [R`Không hoàn lại mà vẫn nhân $\dfrac58\cdot\dfrac58$.`],
    lq: ['CT12-XS-01', 'CT12-XS-03'],
  },
  'CT12-XS-03': {
    tom_tat: 'Chia trường hợp theo B và không-B, cộng xác suất từng nhánh của sơ đồ cây.',
    // kiểm: 0,6·0,02 + 0,4·0,05 = 0,012 + 0,02 = 0,032
    vd: { de: 'Máy A làm 60%, máy B làm 40% sản phẩm; tỉ lệ lỗi lần lượt 2% và 5%. Lấy ngẫu nhiên 1 sản phẩm, tính xác suất sản phẩm đó lỗi.',
      buoc: [R`Gọi $L$: "sản phẩm lỗi". $P(L)=P(A)\cdot P(L\mid A)+P(B)\cdot P(L\mid B)$`], kq: R`$0{,}6\cdot 0{,}02+0{,}4\cdot 0{,}05=0{,}032$` },
    nham: [R`Cộng thẳng $2\%+5\%$ mà không nhân tỉ lệ sản phẩm của từng máy.`],
    lq: ['CT12-XS-04', 'CT12-XS-02'],
  },
  'CT12-XS-04': {
    tom_tat: 'Bayes: biết kết quả A đã xảy ra, tính ngược xác suất của nguyên nhân B.',
    // kiểm: 0,4·0,05 / 0,032 = 0,02/0,032 = 0,625
    vd: { de: 'Tiếp ví dụ máy A/B: lấy được một sản phẩm lỗi. Tính xác suất sản phẩm đó do máy B làm.', buoc: [R`Gọi $L$: "sản phẩm lỗi"; $P(L)=0{,}032$ (công thức toàn phần)`], kq: R`$P(B\mid L)=\dfrac{0{,}4\cdot 0{,}05}{0{,}032}=0{,}625$` },
    nham: [R`Lấy $P(L\mid B)=5\%$ làm đáp số — đề hỏi chiều ngược lại $P(B\mid L)$.`],
    lq: ['CT12-XS-03', 'CT12-XS-01'],
  },
  'CT12-XS-05': {
    tom_tat: 'Hai biến cố độc lập khi việc xảy ra của biến cố này không ảnh hưởng xác suất biến cố kia.',
    vd: { de: 'Gieo 2 đồng xu. A: đồng thứ nhất sấp; B: đồng thứ hai sấp. A và B có độc lập không?', kq: R`$P(A\cap B)=\dfrac14=\dfrac12\cdot\dfrac12=P(A)\cdot P(B)$ ⇒ độc lập.` },
    nham: [R`Nhầm "độc lập" với "xung khắc" (xung khắc là $P(A\cap B)=0$).`],
    lq: ['CT12-XS-02'],
  },
}
