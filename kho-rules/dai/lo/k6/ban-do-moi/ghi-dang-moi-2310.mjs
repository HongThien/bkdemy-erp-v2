// ghi-dang-moi-2310.mjs — đợt 5 (Thùy sửa bản đồ 22–23/10): điền MÔ TẢ + LÝ THUYẾT + VÍ DỤ cho 6 dạng Đại mới (NDB01410–01415) + 2 nhóm (NNB01668, NNB01669),
//   và 2 dạng HÌNH mới (NDB01417, NDB01418) + 2 nhóm (NNB01670, NNB01671).
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2310.mjs [--ghi]   (mặc định chạy thử, ROLLBACK)
// Chỉ ghi ô RỖNG (điều kiện trong CÙNG câu UPDATE). Dấu nhân chấm. Số liệu kiểm bằng BigInt / vét cạn trước khi ghi.
import pg from 'pg'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const R = String.raw

const MO_TA_NHOM = {
  NNB01668: 'Tìm x (hoặc x, y) trong đẳng thức chứa lũy thừa có x ở số mũ ở mức nâng cao: đưa các lũy thừa về cùng số mũ, hoặc dùng tích các số tự nhiên liên tiếp',
  NNB01669: 'Tính tổng các dãy số có quy luật ở mức nâng cao: tổng các tích số tự nhiên liên tiếp hoặc cách đều, tổng các lũy thừa có cùng số mũ',
  NNB01670: 'Nhận biết hình có tâm đối xứng, xác định tâm đối xứng và chọn các hình có tâm đối xứng',
  NNB01671: 'Nhận biết hình có trục đối xứng, tìm số trục đối xứng của các hình phẳng quen thuộc và các chữ cái',
}

const MO_TA_DANG = {
  NDB01410: 'Đẳng thức có tích các lũy thừa khác cơ số mà số mũ chứa x, bằng một số cho trước; tách để các lũy thừa cùng số mũ x, gộp thành một lũy thừa rồi tìm x',
  NDB01411: 'Đẳng thức có tổng các lũy thừa khác cơ số nhưng cùng số mũ x ở hai vế; đặt lũy thừa chung làm thừa số, rút gọn rồi so sánh hai lũy thừa cùng số mũ',
  NDB01412: 'Đẳng thức có tích các số tự nhiên liên tiếp mà mỗi thừa số chứa lũy thừa của x (như $2^x$, $2^x+1$, $2^x+2$); phân tích vế phải thành tích các số liên tiếp rồi so sánh',
  NDB01413: 'Tính tổng $1.2+2.3+3.4+\\dots$ hoặc $1.2.3+2.3.4+\\dots$: các số hạng là tích của các số tự nhiên liên tiếp, nhân tổng với một số thích hợp để các tích ở giữa triệt tiêu',
  NDB01414: 'Tính tổng các tích có hai thừa số hơn kém nhau $2$ hoặc $3$ đơn vị (như $2.4+4.6+\\dots$, $1.4+4.7+\\dots$), thừa số sau của số hạng này là thừa số đầu của số hạng kế tiếp',
  NDB01415: 'Tính tổng các lũy thừa có cùng số mũ, cơ số là các số tự nhiên liên tiếp (như $1^2+2^2+\\dots+n^2$, $1^3+2^3+\\dots+n^3$): viết mỗi số hạng thành tích các số liên tiếp cộng một số',
  NDB01417: 'Đề cho một hình hoặc một chữ cái, hỏi hình có trục đối xứng không, có bao nhiêu trục đối xứng, hoặc chọn hình có trục đối xứng',
  NDB01418: 'Đề cho một hình hoặc một chữ cái, hỏi hình có tâm đối xứng không, tâm đối xứng nằm ở đâu, hoặc chọn hình có tâm đối xứng',
}

const NHOM_LT = {
  NNB01668: R`##TC
Nhân hai lũy thừa cùng cơ số: $a^m.a^n=a^{m+n}$; vì vậy $a^{x+k}=a^x.a^k$.
Nhân hai lũy thừa cùng số mũ: $a^n.b^n=(a.b)^n$.
Hai lũy thừa cùng cơ số lớn hơn $1$ bằng nhau thì số mũ bằng nhau; hai lũy thừa cùng số mũ khác $0$ bằng nhau thì cơ số bằng nhau.
Tích của ba số tự nhiên liên tiếp tăng khi thừa số đầu tăng: nếu $a.(a+1).(a+2)=b.(b+1).(b+2)$ thì $a=b$.

##PP
Tách mọi lũy thừa dạng $a^{x+k}$ thành $a^x.a^k$ để các lũy thừa chứa $x$ có cùng số mũ $x$, rồi gộp thành $(a.b.c)^x$ và tính hằng số.
Viết vế còn lại thành lũy thừa cùng cơ số (hoặc cùng số mũ) với vế chứa $x$ rồi so sánh.
Với tích các số liên tiếp: phân tích số đã cho thành tích các số tự nhiên liên tiếp, đối chiếu từng thừa số.

##CY
Chỉ so sánh số mũ khi cơ số giống nhau và lớn hơn $1$; chỉ so sánh cơ số khi số mũ giống nhau và khác $0$.
Sau khi tìm được $x$, thay lại vào đẳng thức để kiểm tra.`,

  NNB01669: R`##TC
Với $a$ là số tự nhiên: $a.(a+1).(a+2)-(a-1).a.(a+1)=3.a.(a+1)$.
Hai thừa số hơn kém nhau $d$ đơn vị: $a.(a+d).(a+2d)-(a-d).a.(a+d)=3d.a.(a+d)$.
Với $k\ge 1$: $k^2=k.(k+1)-k$ và $k^3=(k-1).k.(k+1)+k$.
Tổng $1+2+3+\dots+n$ có $n$ số hạng; viết ngược lại rồi cộng từng cặp: $1+2+\dots+n=\dfrac{n.(n+1)}{2}$.

##PP
Quan sát quy luật: số hạng thứ $k$ có dạng nào, thừa số đầu và thừa số sau hơn kém nhau bao nhiêu.
Nhân cả tổng với một số thích hợp ($3$, $6$, $9$, $4$, ...) để mỗi số hạng viết được thành hiệu hai tích; các tích ở giữa triệt tiêu, chỉ còn tích cuối, rồi chia lại.
Với tổng các lũy thừa cùng số mũ, viết mỗi số hạng thành tích các số liên tiếp cộng thêm một số, tính hai tổng riêng rồi cộng lại.

##CY
Nhớ chia lại cho số đã nhân thêm để ra tổng ban đầu.
Số hạng đầu có thừa số $(a-d)$ bằng $0$ hoặc không là số tự nhiên: tách số hạng đầu ra tính riêng.
Đếm đúng số số hạng của dãy trước khi ghép cặp.`,

  NNB01670: R`##TC
Điểm $O$ là tâm đối xứng của một hình nếu khi quay hình nửa vòng quanh $O$ thì hình trùng khít với chính nó.
Tâm đối xứng của hình chữ nhật, hình vuông, hình thoi, hình bình hành là giao điểm hai đường chéo; của hình tròn là tâm; của lục giác đều là tâm của nó.
Tam giác đều, tam giác cân, hình thang cân không có tâm đối xứng.
Các chữ cái có tâm đối xứng: $\text{H}$, $\text{I}$, $\text{N}$, $\text{O}$, $\text{S}$, $\text{X}$, $\text{Z}$; chữ $\text{A}$, $\text{T}$ không có tâm đối xứng.

##PP
Tưởng tượng quay hình nửa vòng quanh điểm cần xét, xem hình có trùng khít với vị trí ban đầu không.
Với đa giác: kiểm tra các đỉnh có đối nhau qua điểm đó không (mỗi đỉnh có một đỉnh "đối", cùng cách đều điểm).

##CY
Hình thang cân có trục đối xứng nhưng không có tâm đối xứng; không lẫn tâm đối xứng với trục đối xứng.
Hình có tâm đối xứng thì tâm đó là một điểm duy nhất của hình.`,

  NNB01671: R`##TC
Đường thẳng $d$ là trục đối xứng của một hình nếu khi gấp hình theo $d$ thì hai phần của hình trùng khít nhau.
Số trục đối xứng: tam giác đều $3$; hình vuông $4$; lục giác đều $6$; hình chữ nhật (không là hình vuông) $2$; hình thoi (không là hình vuông) $2$; tam giác cân (không đều) $1$; hình thang cân $1$.
Hình tròn có vô số trục đối xứng (mọi đường thẳng đi qua tâm).
Hình bình hành (không là hình chữ nhật, không là hình thoi) không có trục đối xứng.

##PP
Tưởng tượng gấp đôi hình theo đường thẳng cần xét, xem hai phần có trùng khít nhau không.
Với đa giác: trục đối xứng đi qua một đỉnh và trung điểm cạnh đối diện, hoặc đi qua trung điểm của hai cạnh đối nhau.

##CY
Đường chéo của hình chữ nhật (không là hình vuông) không phải trục đối xứng; trục đối xứng của nó đi qua trung điểm các cạnh đối.
Hình bình hành thông thường không có trục đối xứng dù có hai cặp cạnh đối bằng nhau.`,
}

const LT = {
  NDB01410: R`##PP
Tách mỗi lũy thừa dạng $a^{x+k}$ thành $a^x.a^k$ để mọi lũy thừa chứa $x$ có cùng số mũ $x$.
Gộp các lũy thừa cùng số mũ: $a^x.b^x.c^x=(a.b.c)^x$, và nhân các hằng số thu được ở ngoài.
Chia hai vế cho hằng số rồi viết vế phải thành lũy thừa cùng cơ số với vế trái để suy ra $x$.

##CY
Phải tính đúng hằng số: $a^{x+2}=a^x.a^2$, không phải $a^x.2$.
Khi số mũ bằng nhau và khác $0$ thì cơ số bằng nhau; khi cơ số giống nhau và lớn hơn $1$ thì số mũ bằng nhau.`,

  NDB01411: R`##PP
Ở mỗi vế, tách lũy thừa dạng $a^{x+k}=a^x.a^k$ rồi đặt lũy thừa chung $a^x$ làm thừa số.
Tính số trong ngoặc ở mỗi vế; nếu hai vế có cùng hệ số, chia hai vế cho hệ số đó.
Còn lại hai lũy thừa cùng số mũ $x$ nhưng khác cơ số bằng nhau; tìm $x$ bằng cách xét $x=0$ (hai vế cùng bằng $1$) và $x\ge 1$ (cơ số lớn hơn thì lũy thừa lớn hơn).

##CY
Hai lũy thừa khác cơ số, cùng số mũ $x\ge 1$ chỉ bằng nhau khi hai cơ số bằng nhau; vì cơ số khác nhau nên chỉ còn trường hợp $x=0$.
Đừng bỏ sót trường hợp $x=0$ khi chia hai vế cho một lũy thừa của $x$.`,

  NDB01412: R`##PP
Đặt $t=2^x$ (hoặc lũy thừa chứa $x$ ở thừa số đầu) để vế trái là tích ba số tự nhiên liên tiếp $t.(t+1).(t+2)$.
Phân tích vế phải thành tích ba số tự nhiên liên tiếp (thử phân tích ra thừa số nguyên tố rồi ghép), ví dụ $720=8.9.10$.
Tích ba số liên tiếp tăng khi thừa số đầu tăng nên suy ra thừa số đầu, rồi viết thừa số đầu thành lũy thừa để tìm $x$.
Với đẳng thức có thêm lũy thừa khác: ước lượng khoảng giá trị của thừa số đầu để chỉ còn vài trường hợp, thử từng trường hợp.

##CY
Phải thử đủ các giá trị thừa số đầu có thể và loại các giá trị không thoả; chỉ giá trị thoả mới được nhận.
Thừa số đầu là lũy thừa của $2$ nên chỉ nhận các giá trị $1; 2; 4; 8; 16; \dots$.`,

  NDB01413: R`##PP
Nhận ra mỗi số hạng là tích của các số tự nhiên liên tiếp: $a.(a+1)$ hoặc $a.(a+1).(a+2)$.
Với tổng hai thừa số: nhân cả tổng với $3$, viết $3=(a+2)-(a-1)$ để mỗi số hạng thành hiệu hai tích ba số liên tiếp, các tích ở giữa triệt tiêu; với tổng ba thừa số: nhân với $4$.
Chia lại cho số đã nhân để ra tổng; nếu đề cần, kiểm tra tính chia hết hoặc các tính chất của kết quả.

##CY
Số hạng đầu có $a-1=0$ nên tích bị trừ bằng $0$, không ảnh hưởng.
Nhớ chia kết quả cho $3$ (hoặc $4$) sau khi triệt tiêu.`,

  NDB01414: R`##PP
Gọi $d$ là hiệu hai thừa số của mỗi số hạng, nhận ra thừa số sau của số hạng này là thừa số đầu của số hạng kế tiếp (các số hạng cách đều $d$).
Nhân cả tổng với $3d$ (với $d=2$ nhân $6$; với $d=3$ nhân $9$), viết $3d=(a+2d)-(a-d)$ để các tích ba thừa số triệt tiêu.
Nếu số hạng đầu có $(a-d)$ không là số tự nhiên thì tách số hạng đầu ra tính riêng.

##CY
Hiệu hai thừa số quyết định số cần nhân: không lấy $3$ cho mọi trường hợp.
Số hạng đầu thường phải tách riêng khi $a<d$.`,

  NDB01415: R`##PP
Viết mỗi số hạng thành tích các số liên tiếp cộng một số: $k^2=k.(k+1)-k$ và $k^3=(k-1).k.(k+1)+k$.
Tính tổng các tích liên tiếp bằng cách nhân với $3$ (tích hai số) hoặc $4$ (tích ba số) rồi triệt tiêu; tính tổng $1+2+\dots+n$ bằng cách viết ngược lại rồi cộng từng cặp.
Cộng hai kết quả để có tổng ban đầu.

##CY
Chú ý số hạng đầu: $1^3=0.1.2+1$, nên tổng các tích ba số bắt đầu từ $1.2.3$.
Kiểm tra bằng cách thử với hai ba số hạng đầu.`,

  NDB01417: R`##PP
Tưởng tượng gấp hình theo đường thẳng đang xét; hai phần trùng khít nhau thì đường thẳng đó là trục đối xứng.
Với các hình quen thuộc, nhớ số trục đối xứng: tam giác đều $3$, hình vuông $4$, hình chữ nhật $2$, hình thoi $2$, tam giác cân $1$, hình thang cân $1$, hình tròn vô số.
Đếm số trục rồi kết luận.

##CY
Hình bình hành thông thường không có trục đối xứng.
Hình chữ nhật (không là hình vuông) chỉ có $2$ trục, không tính hai đường chéo.`,

  NDB01418: R`##PP
Tưởng tượng quay hình nửa vòng quanh điểm đang xét; hình trùng khít với chính nó thì điểm đó là tâm đối xứng.
Với các hình quen thuộc: hình chữ nhật, hình thoi, hình vuông, hình bình hành, hình tròn, lục giác đều có tâm đối xứng; tam giác đều, tam giác cân, hình thang cân không có.
Với tứ giác: tâm đối xứng là giao điểm hai đường chéo.

##CY
Hình thang cân có trục đối xứng nhưng không có tâm đối xứng.
Tam giác nào cũng không có tâm đối xứng.`,
}

const VD = {
  NDB01410: R`##VD
Tìm số tự nhiên $x$, biết: $2^{x+2}.3^{x+1}.5^x=10800$.
**Hướng dẫn giải:**
Tách các lũy thừa để cùng số mũ $x$:

$2^{x+2}.3^{x+1}.5^x=2^x.2^2.3^x.3.5^x$

$=4.3.(2^x.3^x.5^x)$

$=12.(2.3.5)^x$

$=12.30^x$

Do đó $12.30^x=10800$, suy ra $30^x=10800:12=900$.

Mà $900=30^2$ nên $30^x=30^2$, suy ra $x=2$.

Vậy $x=2$.

##VD
Tìm số tự nhiên $x$, biết: $4^{x+3}.5^{x+1}.6^x=38400$.
**Hướng dẫn giải:**
$4^{x+3}.5^{x+1}.6^x=4^x.4^3.5^x.5.6^x$

$=64.5.(4^x.5^x.6^x)$

$=320.(4.5.6)^x$

$=320.120^x$

Do đó $320.120^x=38400$, suy ra $120^x=38400:320=120$.

Mà $120=120^1$ nên $x=1$.

Vậy $x=1$.`,

  NDB01411: R`##VD
Tìm số tự nhiên $x$, biết: $6^x+6^{x+1}=2^x+2.2^x+4.2^x$.
**Hướng dẫn giải:**
Vế trái: $6^x+6^{x+1}=6^x.(1+6)=7.6^x$.

Vế phải: $2^x+2.2^x+4.2^x=2^x.(1+2+4)=7.2^x$.

Do đó $7.6^x=7.2^x$, suy ra $6^x=2^x$.

Nếu $x\ge 1$ thì $6^x>2^x$ (cùng số mũ, cơ số $6$ lớn hơn cơ số $2$), không thoả mãn.

Nếu $x=0$ thì $6^0=2^0=1$ (đúng).

Vậy $x=0$.

##VD
Tìm số tự nhiên $x$, biết: $2^x+2^{x+1}=3^x+3^x$.
**Hướng dẫn giải:**
Vế trái: $2^x+2^{x+1}=2^x.(1+2)=3.2^x$.

Vế phải: $3^x+3^x=2.3^x$.

Do đó $3.2^x=2.3^x$.

Với $x=0$: $3.1=3$ và $2.1=2$, hai vế khác nhau, loại.

Với $x\ge 1$: viết $2^x=2.2^{x-1}$ và $3^x=3.3^{x-1}$ thì $3.2.2^{x-1}=2.3.3^{x-1}$, suy ra $2^{x-1}=3^{x-1}$.

Hai lũy thừa cùng số mũ, cơ số khác nhau chỉ bằng nhau khi số mũ bằng $0$, nên $x-1=0$, tức $x=1$.

Thử lại: $2^1+2^2=6$ và $3^1+3^1=6$ (đúng).

Vậy $x=1$.`,

  NDB01412: R`##VD
Tìm số tự nhiên $x$, biết: $2^x.(2^x+1).(2^x+2)=720$.
**Hướng dẫn giải:**
Vế trái là tích ba số tự nhiên liên tiếp có thừa số đầu là $2^x$.

Phân tích $720=8.90=8.9.10$, đây cũng là tích ba số tự nhiên liên tiếp.

Tích ba số tự nhiên liên tiếp tăng khi thừa số đầu tăng nên $2^x=8$.

Mà $8=2^3$ nên $x=3$.

Vậy $x=3$.

##VD
Tìm số tự nhiên $x$, $y$, biết: $2^x.(2^x+1).(2^x+2)+4^y=721$.
**Hướng dẫn giải:**
Vì $4^y\ge 1$ nên $2^x.(2^x+1).(2^x+2)\le 720$.

Nếu $2^x\ge 16$ thì $2^x.(2^x+1).(2^x+2)\ge 16.17.18=4896>720$, loại. Vậy $2^x\in\{1;2;4;8\}$.

Với $2^x=1$: $1.2.3=6$, $4^y=721-6=715$, không là lũy thừa của $4$.

Với $2^x=2$: $2.3.4=24$, $4^y=697$, không là lũy thừa của $4$.

Với $2^x=4$: $4.5.6=120$, $4^y=601$, không là lũy thừa của $4$.

Với $2^x=8$: $8.9.10=720$, $4^y=1=4^0$, nên $y=0$ và $x=3$.

Vậy $x=3$ và $y=0$.`,

  NDB01413: R`##VD
Tính tổng: $A=1.2+2.3+3.4+\dots+99.100$.
**Hướng dẫn giải:**
Nhân cả hai vế với $3$, mỗi số hạng $a.(a+1)$ viết $3=(a+2)-(a-1)$:

$3A=1.2.(3-0)+2.3.(4-1)+3.4.(5-2)+\dots+99.100.(101-98)$

$3A=(1.2.3-0.1.2)+(2.3.4-1.2.3)+(3.4.5-2.3.4)+\dots+(99.100.101-98.99.100)$

Các tích ở giữa triệt tiêu, còn lại:

$3A=99.100.101=999900$

$A=999900:3=333300$.

Vậy $A=333300$.

##VD
Tính tổng: $C=1.2.3+2.3.4+3.4.5+\dots+98.99.100$.
**Hướng dẫn giải:**
Nhân cả hai vế với $4$, mỗi số hạng $a.(a+1).(a+2)$ viết $4=(a+3)-(a-1)$:

$4C=(1.2.3.4-0.1.2.3)+(2.3.4.5-1.2.3.4)+\dots+(98.99.100.101-97.98.99.100)$

Các tích ở giữa triệt tiêu, còn lại:

$4C=98.99.100.101=97990200$

$C=97990200:4=24497550$.

Vậy $C=24497550$.`,

  NDB01414: R`##VD
Tính tổng: $B=2.4+4.6+6.8+\dots+100.102$.
**Hướng dẫn giải:**
Hai thừa số của mỗi số hạng hơn kém nhau $2$, nên nhân cả hai vế với $6$. Với số hạng $a.(a+2)$ viết $6=(a+4)-(a-2)$:

$6B=2.4.(6-0)+4.6.(8-2)+6.8.(10-4)+\dots+100.102.(104-98)$

$6B=(2.4.6-0.2.4)+(4.6.8-2.4.6)+(6.8.10-4.6.8)+\dots+(100.102.104-98.100.102)$

Các tích ở giữa triệt tiêu, còn lại:

$6B=100.102.104=1060800$

$B=1060800:6=176800$.

Vậy $B=176800$.

##VD
Tính tổng: $S=1.3+3.5+5.7+\dots+99.101$.
**Hướng dẫn giải:**
Tách số hạng đầu: $S=1.3+(3.5+5.7+\dots+99.101)$.

Đặt $T=3.5+5.7+\dots+99.101$. Hai thừa số hơn kém nhau $2$, nhân hai vế với $6$:

$6T=3.5.(7-1)+5.7.(9-3)+\dots+99.101.(103-97)$

$6T=(3.5.7-1.3.5)+(5.7.9-3.5.7)+\dots+(99.101.103-97.99.101)$

Các tích ở giữa triệt tiêu, còn lại:

$6T=99.101.103-1.3.5=1029897-15=1029882$

$T=1029882:6=171647$.

Vậy $S=3+171647=171650$.`,

  NDB01415: R`##VD
Tính tổng: $D=1^2+2^2+3^2+\dots+30^2$.
**Hướng dẫn giải:**
Với mỗi số tự nhiên $k$ ta có $k^2=k.(k+1)-k$. Do đó:

$D=(1.2-1)+(2.3-2)+\dots+(30.31-30)$

$D=(1.2+2.3+\dots+30.31)-(1+2+\dots+30)$

Đặt $P=1.2+2.3+\dots+30.31$. Nhân hai vế với $3$ và triệt tiêu:

$3P=30.31.32=29760$, nên $P=9920$.

Tổng $1+2+\dots+30=\dfrac{30.31}{2}=465$ (viết ngược lại rồi cộng từng cặp).

Vậy $D=9920-465=9455$.

##VD
Tính tổng: $H=1^3+2^3+3^3+\dots+20^3$.
**Hướng dẫn giải:**
Với mỗi số tự nhiên $k\ge 1$ ta có $k^3=(k-1).k.(k+1)+k$. Do đó:

$H=(1.2.3+2.3.4+\dots+19.20.21)+(1+2+\dots+20)$

Đặt $U=1.2.3+2.3.4+\dots+19.20.21$. Nhân hai vế với $4$ và triệt tiêu:

$4U=19.20.21.22=175560$, nên $U=43890$.

Tổng $1+2+\dots+20=\dfrac{20.21}{2}=210$.

Vậy $H=43890+210=44100$.`,

  NDB01417: R`##VD
Hình chữ nhật có chiều dài khác chiều rộng có bao nhiêu trục đối xứng?
**Hướng dẫn giải:**
Hình chữ nhật có hai trục đối xứng, mỗi trục là đường thẳng đi qua trung điểm của hai cạnh đối nhau.

Hai đường chéo không phải trục đối xứng vì gấp theo đường chéo thì hai phần không trùng khít.

Vậy hình chữ nhật có $2$ trục đối xứng.

##VD
Trong các hình: tam giác đều, hình bình hành (không là hình chữ nhật hay hình thoi), hình thoi, hình thang cân, hình nào không có trục đối xứng?
**Hướng dẫn giải:**
Tam giác đều có $3$ trục đối xứng; hình thoi có $2$ trục; hình thang cân có $1$ trục đi qua trung điểm hai đáy.

Hình bình hành thông thường gấp theo đường thẳng nào cũng không trùng khít nên không có trục đối xứng.

Vậy hình bình hành là hình không có trục đối xứng.`,

  NDB01418: R`##VD
Tìm tâm đối xứng của hình thoi $ABCD$.
**Hướng dẫn giải:**
Quay hình thoi $ABCD$ nửa vòng quanh giao điểm $O$ của hai đường chéo $AC$ và $BD$ thì $A$ trùng $C$, $B$ trùng $D$ nên hình thoi trùng khít với chính nó.

Vậy tâm đối xứng của hình thoi $ABCD$ là giao điểm $O$ của hai đường chéo.

##VD
Trong các hình: tam giác đều, hình vuông, hình bình hành, hình thang cân, hình nào có tâm đối xứng?
**Hướng dẫn giải:**
Hình vuông và hình bình hành có tâm đối xứng là giao điểm hai đường chéo.

Tam giác đều và hình thang cân quay nửa vòng quanh bất kì điểm nào cũng không trùng khít với chính nó, nên không có tâm đối xứng.

Vậy hình vuông và hình bình hành có tâm đối xứng.`,
}

// ───────── KIỂM ─────────
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const loi = []
const soat = (grp, s) => {
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${grp}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${grp}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${grp}: cấm \\cdot/\\times`)
  }
}
for (const [k, v] of Object.entries(MO_TA_DANG)) soat('mô tả ' + k, v)
for (const [k, v] of Object.entries(MO_TA_NHOM)) soat('mô tả ' + k, v)
for (const [k, v] of Object.entries(NHOM_LT)) soat('nhóm ' + k, v)
for (const [k, v] of Object.entries(LT)) soat('LT ' + k, v)
for (const [k, v] of Object.entries(VD)) soat('VD ' + k, v)
for (const k of ['NDB01410', 'NDB01411', 'NDB01412', 'NDB01413', 'NDB01414', 'NDB01415', 'NDB01417', 'NDB01418']) if (!LT[k] || !VD[k] || !MO_TA_DANG[k]) loi.push('thiếu ' + k)
const chk = (c, t) => { if (!c) loi.push(t) }
const nghiem = (f, g = 40) => { const r = []; for (let x = 0; x <= g; x++) if (f(x)) r.push(x); return r.join(',') }
const B = BigInt
chk(nghiem((x) => B(2) ** B(x + 2) * B(3) ** B(x + 1) * B(5) ** B(x) === 10800n, 30) === '2', '2^(x+2).3^(x+1).5^x')
chk(nghiem((x) => B(4) ** B(x + 3) * B(5) ** B(x + 1) * B(6) ** B(x) === 38400n, 30) === '1', '4^(x+3).5^(x+1).6^x')
chk(nghiem((x) => B(6) ** B(x) + B(6) ** B(x + 1) === B(2) ** B(x) * 7n, 30) === '0', '6^x+6^(x+1)=7.2^x')
chk(nghiem((x) => B(2) ** B(x) + B(2) ** B(x + 1) === 2n * B(3) ** B(x), 30) === '1', '2^x+2^(x+1)=2.3^x')
chk(nghiem((x) => { const t = B(2) ** B(x); return t * (t + 1n) * (t + 2n) === 720n }, 30) === '3', '2^x(2^x+1)(2^x+2)=720')
{ const s = []; for (let x = 0; x <= 12; x++) for (let y = 0; y <= 12; y++) { const t = B(2) ** B(x); if (t * (t + 1n) * (t + 2n) + B(4) ** B(y) === 721n) s.push(`${x},${y}`) } chk(s.join(' ') === '3,0', '2^x(…)+4^y=721') }
chk(720 === 8 * 9 * 10 && 16 * 17 * 18 === 4896, '720, 4896')
{ let A = 0n, C = 0n, Bs = 0n, S = 0n, D = 0n, H = 0n
  for (let a = 1n; a <= 99n; a++) A += a * (a + 1n)
  for (let a = 1n; a <= 98n; a++) C += a * (a + 1n) * (a + 2n)
  for (let a = 2n; a <= 100n; a += 2n) Bs += a * (a + 2n)
  for (let a = 1n; a <= 99n; a += 2n) S += a * (a + 2n)
  for (let k = 1n; k <= 30n; k++) D += k * k
  for (let k = 1n; k <= 20n; k++) H += k ** 3n
  chk(A === 333300n && 99n * 100n * 101n === 999900n, 'A'); chk(C === 24497550n && 98n * 99n * 100n * 101n === 97990200n, 'C'); chk(Bs === 176800n && 100n * 102n * 104n === 1060800n, 'B')
  chk(S === 171650n && 99n * 101n * 103n === 1029897n && (1029897n - 15n) / 6n === 171647n, 'S')
  chk(D === 9455n && 30n * 31n * 32n === 29760n && 29760n / 3n === 9920n, 'D'); chk(H === 44100n && 19n * 20n * 21n * 22n === 175560n && 175560n / 4n === 43890n, 'H') }
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
console.log('✔ KaTeX + số liệu (BigInt / vét cạn) đạt')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const kq = (r) => (r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)')
  for (const [id, mt] of Object.entries(MO_TA_NHOM)) console.log(`mô tả nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set mo_ta = $2, updated_at = now() where id = $1 and coalesce(btrim(mo_ta), '') = ''`, [id, mt]))}`)
  for (const [id, mt] of Object.entries(MO_TA_DANG)) console.log(`mô tả dạng ${id}: ${kq(await c.query(`update dai_bdm_dang_bai set mo_ta = $2, updated_at = now() where id = $1 and coalesce(btrim(mo_ta), '') = ''`, [id, mt]))}`)
  for (const id of Object.keys(LT)) console.log(`LT+VD dạng ${id}: ${kq(await c.query(`update dai_bdm_dang_bai set ly_thuyet = $2, vi_du = $3, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = '' and coalesce(btrim(vi_du), '') = ''`, [id, LT[id], VD[id]]))}`)
  for (const id of Object.keys(NHOM_LT)) console.log(`LT nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, NHOM_LT[id]]))}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
