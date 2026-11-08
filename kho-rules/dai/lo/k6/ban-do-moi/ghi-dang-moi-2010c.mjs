// ghi-dang-moi-2010c.mjs — đợt 3 (Thùy thêm 21/10): điền MÔ TẢ (4 dạng hình + 2 nhóm) + LÝ THUYẾT + VÍ DỤ cho 9 dạng bài mới + LÝ THUYẾT 3 nhóm mới.
//   Dạng: NDB01225–01228 (nhóm NNB01597 So sánh lũy thừa) · NDB01229–01230 (NNB01598 Đẳng thức dạng tích) · NDB01231 (NNB00902 chứng minh chính phương) · NDB01232–01233 (NNB01599 Chữ số tận cùng)
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2010c.mjs [--ghi]   (mặc định chạy thử, ROLLBACK)
// Chỉ ghi ô RỖNG (điều kiện trong CÙNG câu UPDATE ⇒ không đè nếu Thùy vừa gõ). Dấu nhân chấm; không (a^m)^n làm quy tắc — viết "tích của n thừa số".
import pg from 'pg'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const R = String.raw

// ───────── MÔ TẢ ─────────
const MO_TA_DANG = {
  NDB01220: 'Đề cho đặc điểm của hình (số cạnh, các cạnh bằng nhau, góc vuông, cạnh song song, đường chéo) hoặc hình vẽ, yêu cầu gọi tên hình hoặc chọn hình đúng',
  NDB01221: 'Đề cho một hình cụ thể, yêu cầu chọn hoặc nhận định tính chất đúng/sai, hoặc dùng tính chất (cạnh đối, đường chéo, ...) để suy ra độ dài',
  NDB01218: 'Tính chu vi, diện tích (hoặc cạnh, chiều cao) của một hình khi đề cho sẵn số đo, không có bối cảnh thực tế',
  NDB01219: 'Bài toán lời văn có bối cảnh thực tế (sân, vườn, nền nhà, ...) cần tính chu vi hoặc diện tích rồi tính tiếp số gạch, số cây, số tiền, ...',
}
const MO_TA_NHOM = {
  NNB01597: 'So sánh hai biểu thức chứa lũy thừa có số mũ lớn mà không tính trực tiếp giá trị',
  NNB01599: 'Tìm chữ số tận cùng của một lũy thừa hoặc một biểu thức chứa lũy thừa có số mũ lớn',
}

// ───────── LÝ THUYẾT NHÓM ─────────
const NHOM_LT = {
  NNB01597: R`##TC
Nếu $a>1$ và $m>n$ thì $a^m>a^n$ (cùng cơ số lớn hơn $1$: số mũ lớn hơn thì lớn hơn).
Nếu $a>b$ và $n\ne 0$ thì $a^n>b^n$ (cùng số mũ: cơ số lớn hơn thì lớn hơn).
Nếu $A<B$ và $B<C$ thì $A<C$ (bắc cầu). Nếu $A<C$ và $B<D$ (các số khác $0$) thì $A.B<C.D$.
$a^n$ là tích của $n$ thừa số $a$; do đó $a^{10}$ cũng là tích của $5$ nhóm, mỗi nhóm $2$ thừa số $a$.

##PP
Đưa hai biểu thức về cùng cơ số hoặc cùng số mũ, hoặc so sánh qua một biểu thức trung gian, hoặc tách thành tích rồi so sánh từng thừa số.
Chọn cách theo dấu hiệu: các cơ số là lũy thừa của cùng một số ($4; 8; 16; 32$ cùng là lũy thừa của $2$) ⇒ cùng cơ số; hai số mũ có ước chung lớn ⇒ cùng số mũ; hai biểu thức không đưa được về hai dạng trên ⇒ trung gian; biểu thức đã là tích các lũy thừa ⇒ tách thành tích.
Kết luận bằng dấu $<$, $>$ hoặc $=$ cho biểu thức ban đầu.

##CY
Không tính trực tiếp giá trị của lũy thừa lớn, và không nhìn riêng cơ số hay riêng số mũ để kết luận.
Khi viết lại $27^{11}$ theo cơ số $3$, mỗi thừa số $27$ là $3.3.3$ nên có $11.3=33$ thừa số $3$.`,

  NNB01598: R`##TC
Nếu tích của hai số tự nhiên bằng số $k>0$ thì mỗi thừa số là một ước của $k$ và thừa số kia là thương: $A.B=k$ ⇒ $A\in\text{Ư}(k)$ và $B=k:A$.
Nếu $A.B=0$ thì $A=0$ hoặc $B=0$.
Với $x, y\in\mathbb{N}$: $x+a\ge a$, và $2y-1$ chỉ thực hiện được khi $y\ge 1$, khi đó là số lẻ; những điều này giúp loại bớt cặp ước.

##PP
Đưa đẳng thức về dạng tích hai biểu thức của $x$, $y$ bằng một số $k$ (nếu là tổng thì tách số hạng để đặt thừa số chung).
Liệt kê các ước của $k$, ghép thành các cặp thừa số $(A;B)$ với $A.B=k$.
Với mỗi cặp, tìm $x$ từ $A$ và $y$ từ $B$ (tìm thành phần chưa biết); loại cặp cho $x$ hoặc $y$ không là số tự nhiên.
Thử lại và kết luận các cặp $(x;y)$.

##CY
Phải xét hết các cặp ước, không bỏ sót cặp nào và không bỏ sót trường hợp một thừa số bằng $0$ khi $k=0$.
Một thừa số như $x+3$ không thể nhỏ hơn $3$ vì $x\in\mathbb{N}$; dùng điều này để loại cặp sớm.`,

  NNB01599: R`##TC
Chữ số tận cùng của một tích chỉ phụ thuộc chữ số tận cùng của các thừa số; vì vậy chữ số tận cùng của $a^n$ chỉ phụ thuộc chữ số tận cùng của $a$ và $n$.
Cơ số tận cùng $0; 1; 5; 6$: mọi lũy thừa (số mũ khác $0$) giữ nguyên chữ số tận cùng.
Cơ số tận cùng $4$: lũy thừa có chữ số tận cùng lần lượt $4; 6; 4; 6; \dots$. Cơ số tận cùng $9$: $9; 1; 9; 1; \dots$.
Cơ số tận cùng $2; 3; 7; 8$: chữ số tận cùng lặp lại sau $4$ lũy thừa — $2: 2;4;8;6$ · $3: 3;9;7;1$ · $7: 7;9;3;1$ · $8: 8;4;2;6$.

##PP
Xác định chữ số tận cùng của cơ số, liệt kê chữ số tận cùng của $a^1; a^2; a^3; \dots$ đến khi lặp lại để tìm chu kì.
Chia số mũ cho chu kì rồi xét số dư $r$: $r\ge 1$ ứng với vị trí thứ $r$ trong chu kì, $r=0$ ứng với vị trí cuối chu kì.
Với biểu thức gồm nhiều lũy thừa: tìm chữ số tận cùng của từng lũy thừa, rồi cộng, trừ hoặc nhân các chữ số tận cùng đó.

##CY
Khi trừ mà chữ số tận cùng của số bị trừ nhỏ hơn số trừ thì "mượn" $10$ (số bị trừ phải lớn hơn số trừ).
Số mũ là một lũy thừa (như $5^{67}$): chỉ cần biết số mũ chẵn hay lẻ, hoặc dư khi chia cho chu kì.`,
}

// ───────── LÝ THUYẾT + VÍ DỤ CẤP DẠNG ─────────
const LT = {
  NDB01225: R`##PP
Viết các cơ số về lũy thừa của cùng một số nhỏ (ví dụ $16=2^4$, $32=2^5$; $9=3^2$, $27=3^3$, $81=3^4$).
Một lũy thừa như $16^{45}$ là tích của $45$ thừa số $16$, mỗi thừa số $16$ lại là tích của $4$ thừa số $2$ nên $16^{45}$ là tích của $4.45=180$ thừa số $2$, tức $16^{45}=2^{180}$.
Khi hai biểu thức đã cùng cơ số lớn hơn $1$, so sánh hai số mũ rồi kết luận.

##CY
Khi nhân số mũ phải nhân đúng hai số mũ (số mũ của cơ số mới và số mũ ban đầu), không cộng nhầm.
Chỉ so sánh số mũ khi cơ số giống nhau và lớn hơn $1$.`,

  NDB01226: R`##PP
Tìm ước chung lớn nhất của hai số mũ (hoặc một ước chung đủ lớn) để chia mỗi lũy thừa thành các nhóm có cùng số thừa số.
Ví dụ $3^{400}$ là tích của $400$ thừa số $3$; chia thành $100$ nhóm, mỗi nhóm $4$ thừa số $3$ thì $3^{400}=3^4.3^4.\dots.3^4=81^{100}$.
Hai biểu thức đã có cùng số mũ thì so sánh hai cơ số.

##CY
Số nhóm chính là số mũ chung, số thừa số trong mỗi nhóm là số mũ cũ chia cho số mũ chung.
Chỉ so sánh cơ số khi hai số mũ bằng nhau và khác $0$.`,

  NDB01227: R`##PP
Khi không thể đưa thẳng về cùng cơ số hoặc cùng số mũ, tìm một biểu thức trung gian $C$ sao cho $A<C$ và $C<B$.
Thường tăng hoặc giảm số mũ một vài đơn vị ở một biểu thức (ví dụ $2^{91}>2^{90}$) để số mũ chia hết cho số mũ của biểu thức kia, rồi đưa về cùng số mũ.
Chuỗi so sánh $A>C>B$ cho $A>B$ (bắc cầu).

##CY
Mỗi bước phải đúng chiều: dùng "lớn hơn" ở biểu thức bị thu nhỏ rồi mới so sánh tiếp, và giữ cùng một chiều cho cả chuỗi.
Chọn trung gian có số mũ chia hết cho số mũ còn lại để việc so sánh cơ số làm được ngay.`,

  NDB01228: R`##PP
Viết mỗi biểu thức thành tích $A.B$ và $C.D$ sao cho các thừa số cùng loại đặt đối diện nhau (cùng cơ số, hoặc cùng số mũ).
So sánh $A$ với $C$ và $B$ với $D$: nếu $A<C$ và $B<D$ thì $A.B<C.D$; nếu một cặp bằng nhau thì kết quả do cặp còn lại quyết định.
Dùng tính chất giao hoán, kết hợp để gộp các thừa số bằng nhau, ví dụ $21^{15}$ là tích của $15$ thừa số $21=3.7$ nên có $15$ thừa số $3$ và $15$ thừa số $7$.

##CY
Chỉ tách thành tích khi hai thừa số của mỗi biểu thức đều khác $0$.
Chú ý đặt đúng cặp thừa số cùng cơ số để so sánh số mũ, đừng ghép lẫn cơ số.`,

  NDB01229: R`##PP
Với $A.B=k$ ($k>0$): liệt kê các ước của $k$ rồi ghép thành các cặp $(A;B)$.
Biết $A$ hoặc $B$ chứa $x$, $y$ và các điều kiện $x, y\in\mathbb{N}$ để loại bớt cặp (ví dụ $x+3\ge 3$ nên loại $A=1; 2$; $2y-1$ phải là số lẻ).
Với mỗi cặp còn lại, giải tìm $x$ và $y$, thử lại rồi kết luận.

##CY
Liệt kê đủ các cặp ước, cả hai thứ tự $(A;B)$ và $(B;A)$ nếu chúng khác nhau.
Kiểm tra $y-2$, $2y-1$ có thực hiện được trong tập số tự nhiên.`,

  NDB01230: R`##PP
Biến đổi vế trái thành tích bằng cách tách một số hạng sao cho xuất hiện thừa số chung: ví dụ $x(y+2)+3y=x(y+2)+3.(y+2)-6$ vì $3.(y+2)=3y+6$.
Đặt thừa số chung: $x(y+2)+3.(y+2)=(x+3)(y+2)$, rồi tìm số bị trừ để được dạng $(x+3)(y+2)=k$ (không chuyển vế: $(x+3)(y+2)-6=18$ thì $(x+3)(y+2)=18+6$).
Giải tiếp như bài đẳng thức dạng tích: liệt kê ước của $k$, ghép cặp, tìm $x$, $y$.

##CY
Hệ số thêm vào để tạo thừa số chung phải được bù lại ở vế còn lại (số bị trừ bằng hiệu cộng số trừ).
Xét điều kiện $x, y\in\mathbb{N}$ cho từng cặp ước.`,

  NDB01231: R`##PP
Tính tổng dãy lũy thừa cùng cơ số bằng cách nhân với cơ số rồi trừ (như nhóm Dãy lũy thừa cơ số): $4A-A=4^{n+1}-1$ khi $A=1+4+4^2+\dots+4^n$.
Từ đó rút ra biểu thức đề yêu cầu chứng minh bằng một lũy thừa của cơ số: $3A+1=4^{n+1}$.
Số chính phương là bình phương của một số tự nhiên: viết lũy thừa dưới dạng tích hai thừa số bằng nhau, chẳng hạn $4^{n+1}=2^{n+1}.2^{n+1}$ vì $4^{n+1}=2^{2(n+1)}$.

##CY
Muốn là số chính phương, số mũ của cơ số (sau khi viết dưới dạng lũy thừa của số nguyên tố) phải là số chẵn.
Viết rõ biểu thức nào bằng lũy thừa nào trước khi kết luận.`,

  NDB01232: R`##PP
Tìm chữ số tận cùng của cơ số, rồi liệt kê chữ số tận cùng của các lũy thừa liên tiếp đến khi thấy chu kì (xem lý thuyết nhóm).
Chia số mũ cho chu kì; số dư $r\ge 1$ ứng với lũy thừa thứ $r$ trong chu kì, số dư $0$ ứng với lũy thừa cuối chu kì.
Nếu số mũ là một lũy thừa, chỉ cần xét tính chẵn lẻ hoặc số dư khi chia cho chu kì rồi suy ra.

##CY
Chu kì phụ thuộc chữ số tận cùng của cơ số: $0; 1; 5; 6$ không đổi, $4$ và $9$ chu kì $2$, $2; 3; 7; 8$ chu kì $4$.
Số mũ là tích của các số lẻ thì là số lẻ.`,

  NDB01233: R`##PP
Tìm chữ số tận cùng của từng lũy thừa trong biểu thức bằng cách ở dạng trên.
Thực hiện phép tính (cộng, trừ, nhân) với các chữ số tận cùng đó rồi lấy chữ số tận cùng của kết quả.
Kết luận chữ số tận cùng của biểu thức.

##CY
Khi trừ, nếu chữ số tận cùng của số bị trừ nhỏ hơn số trừ thì mượn $10$ (ví dụ chữ số tận cùng $3$ trừ $7$ thì lấy $13-7=6$); biểu thức phải có số bị trừ lớn hơn số trừ.
Với tổng, chỉ lấy chữ số hàng đơn vị của tổng các chữ số tận cùng.`,
}

const VD = {
  NDB01225: R`##VD
So sánh $27^{11}$ và $81^8$.
**Hướng dẫn giải:**
Ta có $27=3.3.3$ nên $27^{11}$ là tích của $11.3=33$ thừa số $3$, tức $27^{11}=3^{33}$.

Ta có $81=3.3.3.3$ nên $81^8$ là tích của $8.4=32$ thừa số $3$, tức $81^8=3^{32}$.

Vì $33>32$ nên $3^{33}>3^{32}$.

Vậy $27^{11}>81^8$.

##VD
So sánh $625^5$ và $125^7$.
**Hướng dẫn giải:**
Ta có $625=5^4$ nên $625^5$ là tích của $5.4=20$ thừa số $5$, tức $625^5=5^{20}$.

Ta có $125=5^3$ nên $125^7$ là tích của $7.3=21$ thừa số $5$, tức $125^7=5^{21}$.

Vì $20<21$ nên $5^{20}<5^{21}$.

Vậy $625^5<125^7$.`,

  NDB01226: R`##VD
So sánh $3^{400}$ và $4^{300}$.
**Hướng dẫn giải:**
Hai số mũ $400$ và $300$ cùng chia hết cho $100$.

$3^{400}$ là tích của $400$ thừa số $3$, chia thành $100$ nhóm, mỗi nhóm $4$ thừa số $3$: $3^{400}=3^4.3^4.\dots.3^4=81^{100}$.

$4^{300}$ là tích của $300$ thừa số $4$, chia thành $100$ nhóm, mỗi nhóm $3$ thừa số $4$: $4^{300}=4^3.4^3.\dots.4^3=64^{100}$.

Vì $81>64$ nên $81^{100}>64^{100}$.

Vậy $3^{400}>4^{300}$.

##VD
So sánh $17^{15}$ và $31^{10}$.
**Hướng dẫn giải:**
Hai số mũ $15$ và $10$ cùng chia hết cho $5$.

$17^{15}$ chia thành $5$ nhóm, mỗi nhóm $3$ thừa số $17$: $17^{15}=17^3.17^3.17^3.17^3.17^3$ với $17^3=4913$, nên $17^{15}=4913^5$.

$31^{10}$ chia thành $5$ nhóm, mỗi nhóm $2$ thừa số $31$: $31^{10}=961^5$ vì $31^2=961$.

Vì $4913>961$ nên $4913^5>961^5$.

Vậy $17^{15}>31^{10}$.`,

  NDB01227: R`##VD
So sánh $2^{91}$ và $5^{35}$.
**Hướng dẫn giải:**
Ta có $2^{91}>2^{90}$ và $2^{90}$ là tích của $18$ nhóm, mỗi nhóm $5$ thừa số $2$ nên $2^{90}=32^{18}$.

Ta có $5^{35}<5^{36}$ và $5^{36}$ là tích của $18$ nhóm, mỗi nhóm $2$ thừa số $5$ nên $5^{36}=25^{18}$.

Vì $32>25$ nên $32^{18}>25^{18}$.

Do đó $2^{91}>2^{90}=32^{18}>25^{18}=5^{36}>5^{35}$.

Vậy $2^{91}>5^{35}$.

##VD
So sánh $3^{34}$ và $5^{20}$.
**Hướng dẫn giải:**
Ta có $3^{34}>3^{30}$ và $3^{30}$ là tích của $10$ nhóm, mỗi nhóm $3$ thừa số $3$ nên $3^{30}=27^{10}$.

Ta có $5^{20}$ là tích của $10$ nhóm, mỗi nhóm $2$ thừa số $5$ nên $5^{20}=25^{10}$.

Vì $27>25$ nên $27^{10}>25^{10}$.

Do đó $3^{34}>3^{30}=27^{10}>25^{10}=5^{20}$.

Vậy $3^{34}>5^{20}$.`,

  NDB01228: R`##VD
So sánh $21^{15}$ và $27^5.49^8$.
**Hướng dẫn giải:**
Ta có $21^{15}$ là tích của $15$ thừa số $21=3.7$ nên $21^{15}=3^{15}.7^{15}$.

Ta có $27^5=3^{15}$ và $49^8=7^{16}$ nên $27^5.49^8=3^{15}.7^{16}$.

Hai tích có cùng thừa số $3^{15}$, mà $7^{15}<7^{16}$ nên $3^{15}.7^{15}<3^{15}.7^{16}$.

Vậy $21^{15}<27^5.49^8$.

##VD
So sánh $2^{30}.3^{20}$ và $6^{20}.2^{12}$.
**Hướng dẫn giải:**
Ta có $6^{20}$ là tích của $20$ thừa số $6=2.3$ nên $6^{20}=2^{20}.3^{20}$.

Do đó $6^{20}.2^{12}=2^{20}.3^{20}.2^{12}=2^{32}.3^{20}$.

Hai tích có cùng thừa số $3^{20}$, mà $2^{30}<2^{32}$ nên $2^{30}.3^{20}<2^{32}.3^{20}$.

Vậy $2^{30}.3^{20}<6^{20}.2^{12}$.`,

  NDB01229: R`##VD
Tìm các số tự nhiên $x$, $y$ biết $(x+3)(2y-1)=6$.
**Hướng dẫn giải:**
Vì $x\in\mathbb{N}$ nên $x+3\ge 3$; vì $2y-1$ là số tự nhiên nên $y\ge 1$ và $2y-1$ là số lẻ.

Các ước của $6$ là $1; 2; 3; 6$. Cặp $(x+3;\ 2y-1)$ có $x+3\ge 3$ nên $x+3\in\{3; 6\}$.

Nếu $x+3=3$ thì $2y-1=2$, loại vì $2y-1$ là số lẻ.

Nếu $x+3=6$ thì $2y-1=1$, suy ra $x=3$ và $y=1$.

Vậy $(x;y)=(3;1)$.

##VD
Tìm các số tự nhiên $x$, $y$ biết $(x+1)(y-2)=7$.
**Hướng dẫn giải:**
Vì $y-2$ là số tự nhiên nên $y\ge 2$. Các ước của $7$ là $1; 7$.

Nếu $x+1=1$ và $y-2=7$ thì $x=0$ và $y=9$.

Nếu $x+1=7$ và $y-2=1$ thì $x=6$ và $y=3$.

Vậy $(x;y)\in\{(0;9);\ (6;3)\}$.`,

  NDB01230: R`##VD
Tìm các số tự nhiên $x$, $y$ biết $x(y+2)+3y=18$.
**Hướng dẫn giải:**
Ta có $3y=3.(y+2)-6$ nên $x(y+2)+3y=x(y+2)+3.(y+2)-6=(x+3)(y+2)-6$.

Do đó $(x+3)(y+2)-6=18$, suy ra $(x+3)(y+2)=18+6=24$.

Vì $x+3\ge 3$ và $y+2\ge 2$ nên ta xét các ước của $24$ là $3; 4; 6; 8; 12$ cho $x+3$:

$x+3=3$, $y+2=8$ ⇒ $x=0$, $y=6$;

$x+3=4$, $y+2=6$ ⇒ $x=1$, $y=4$;

$x+3=6$, $y+2=4$ ⇒ $x=3$, $y=2$;

$x+3=8$, $y+2=3$ ⇒ $x=5$, $y=1$;

$x+3=12$, $y+2=2$ ⇒ $x=9$, $y=0$.

Vậy $(x;y)\in\{(0;6);\ (1;4);\ (3;2);\ (5;1);\ (9;0)\}$.

##VD
Tìm các số tự nhiên $x$, $y$ biết $xy+2x+y=14$.
**Hướng dẫn giải:**
Ta có $xy+2x+y=x(y+2)+y$ và $y=(y+2)-2$ nên $x(y+2)+y=x(y+2)+(y+2)-2=(x+1)(y+2)-2$.

Do đó $(x+1)(y+2)-2=14$, suy ra $(x+1)(y+2)=14+2=16$.

Vì $y+2\ge 2$ nên $y+2\in\{2; 4; 8; 16\}$:

$y+2=16$, $x+1=1$ ⇒ $y=14$, $x=0$;

$y+2=8$, $x+1=2$ ⇒ $y=6$, $x=1$;

$y+2=4$, $x+1=4$ ⇒ $y=2$, $x=3$;

$y+2=2$, $x+1=8$ ⇒ $y=0$, $x=7$.

Vậy $(x;y)\in\{(0;14);\ (1;6);\ (3;2);\ (7;0)\}$.`,

  NDB01231: R`##VD
Cho $A=1+4+4^2+\dots+4^{20}$. Chứng minh $3A+1$ là số chính phương.
**Hướng dẫn giải:**
Ta có $4A=4.(1+4+4^2+\dots+4^{20})=4+4^2+4^3+\dots+4^{21}$.

Suy ra $4A-A=(4+4^2+\dots+4^{21})-(1+4+\dots+4^{20})$, tức $3A=4^{21}-1$.

Do đó $3A+1=4^{21}$.

Vì $4=2.2$ nên $4^{21}=2^{42}=2^{21}.2^{21}$.

Vậy $3A+1=2^{21}.2^{21}$ là số chính phương.

##VD
Cho $B=1+5+5^2+\dots+5^{2025}$. Chứng minh $4B+1$ là số chính phương.
**Hướng dẫn giải:**
Ta có $5B=5+5^2+\dots+5^{2026}$.

Suy ra $5B-B=(5+5^2+\dots+5^{2026})-(1+5+\dots+5^{2025})$, tức $4B=5^{2026}-1$.

Do đó $4B+1=5^{2026}=5^{1013}.5^{1013}$.

Vậy $4B+1$ là số chính phương.`,

  NDB01232: R`##VD
Tìm chữ số tận cùng của $7^{2025}$.
**Hướng dẫn giải:**
Ta có $7^1=7$; $7^2=49$ tận cùng $9$; $7^3=343$ tận cùng $3$; $7^4=2401$ tận cùng $1$; $7^5$ tận cùng $7$, rồi lặp lại. Chu kì là $4$.

Ta có $2025:4=506$ dư $1$ nên $7^{2025}$ có chữ số tận cùng giống $7^1$.

Vậy chữ số tận cùng của $7^{2025}$ là $7$.

##VD
Tìm chữ số tận cùng của $4^{5^{67}}$.
**Hướng dẫn giải:**
Chữ số tận cùng của các lũy thừa của $4$ là $4; 6; 4; 6; \dots$: số mũ lẻ thì tận cùng $4$, số mũ chẵn thì tận cùng $6$.

Số mũ $5^{67}$ là tích của $67$ thừa số $5$ đều lẻ nên là số lẻ.

Vậy chữ số tận cùng của $4^{5^{67}}$ là $4$.`,

  NDB01233: R`##VD
Tìm chữ số tận cùng của $S=2^{2024}+3^{2024}$.
**Hướng dẫn giải:**
Chữ số tận cùng của $2^n$ lặp lại $2; 4; 8; 6$ (chu kì $4$). Ta có $2024:4=506$ dư $0$ nên $2^{2024}$ tận cùng $6$.

Chữ số tận cùng của $3^n$ lặp lại $3; 9; 7; 1$ (chu kì $4$). Vì $2024:4=506$ dư $0$ nên $3^{2024}$ tận cùng $1$.

Chữ số tận cùng của $S$ bằng chữ số tận cùng của $6+1=7$.

Vậy chữ số tận cùng của $S$ là $7$.

##VD
Tìm chữ số tận cùng của $T=9^{2025}-4^{2025}$.
**Hướng dẫn giải:**
Chữ số tận cùng của $9^n$ là $9; 1; 9; 1; \dots$, số mũ lẻ thì tận cùng $9$ nên $9^{2025}$ tận cùng $9$.

Chữ số tận cùng của $4^n$ là $4; 6; 4; 6; \dots$, số mũ lẻ thì tận cùng $4$ nên $4^{2025}$ tận cùng $4$.

Vì $9^{2025}>4^{2025}$ nên phép trừ thực hiện được, chữ số tận cùng của $T$ là chữ số tận cùng của $9-4=5$.

Vậy chữ số tận cùng của $T$ là $5$.`,
}

// ───────── KIỂM ─────────
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const loi = []
for (const [grp, tb] of [['LT', LT], ['VD', VD], ['NHOM', NHOM_LT]]) {
  for (const [k, s] of Object.entries(tb)) {
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${grp} ${k}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${grp} ${k}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
      if (/\\cdot|\\times/.test(m[1])) loi.push(`${grp} ${k}: cấm \\cdot/\\times`)
    }
  }
}
const chk = (c, t) => { if (!c) loi.push(t) }
const B = (a, n) => BigInt(a) ** BigInt(n)
chk(B(27, 11) === B(3, 33) && B(81, 8) === B(3, 32) && B(27, 11) > B(81, 8), '27^11 vs 81^8')
chk(B(625, 5) === B(5, 20) && B(125, 7) === B(5, 21) && B(625, 5) < B(125, 7), '625^5 vs 125^7')
chk(B(3, 400) === B(81, 100) && B(4, 300) === B(64, 100) && B(3, 400) > B(4, 300), '3^400 vs 4^300')
chk(B(17, 3) === 4913n && B(31, 2) === 961n && B(17, 15) === B(4913, 5) && B(31, 10) === B(961, 5) && B(17, 15) > B(31, 10), '17^15 vs 31^10')
chk(B(2, 90) === B(32, 18) && B(5, 36) === B(25, 18) && B(2, 91) > B(5, 35), '2^91 vs 5^35')
chk(B(3, 30) === B(27, 10) && B(5, 20) === B(25, 10) && B(3, 34) > B(5, 20), '3^34 vs 5^20')
chk(B(21, 15) === B(3, 15) * B(7, 15) && B(27, 5) === B(3, 15) && B(49, 8) === B(7, 16) && B(21, 15) < B(27, 5) * B(49, 8), '21^15')
chk(B(6, 20) * B(2, 12) === B(2, 32) * B(3, 20) && B(2, 30) * B(3, 20) < B(6, 20) * B(2, 12), '2^30.3^20')
const nghiem = (f, gioiHan = 60) => { const r = []; for (let x = 0; x <= gioiHan; x++) for (let y = 0; y <= gioiHan; y++) if (f(x, y)) r.push(`${x},${y}`); return r.join(' ') }
chk(nghiem((x, y) => y >= 1 && (x + 3) * (2 * y - 1) === 6) === '3,1', '(x+3)(2y-1)=6')
chk(nghiem((x, y) => y >= 2 && (x + 1) * (y - 2) === 7) === '0,9 6,3', '(x+1)(y-2)=7')
chk(nghiem((x, y) => x * (y + 2) + 3 * y === 18) === '0,6 1,4 3,2 5,1 9,0', 'x(y+2)+3y=18')
chk(nghiem((x, y) => x * y + 2 * x + y === 14) === '0,14 1,6 3,2 7,0', 'xy+2x+y=14')
const tc = (a, n) => Number(B(a, n) % 10n)
chk(tc(7, 2025) === 7 && 2025 % 4 === 1, '7^2025')
chk(tc(4, 5) === 4 && tc(4, 6) === 6, 'chu kì 4')
chk((tc(2, 2024) + tc(3, 2024)) % 10 === 7 && tc(2, 2024) === 6 && tc(3, 2024) === 1, '2^2024+3^2024')
chk(tc(9, 2025) === 9 && tc(4, 2025) === 4 && Number((B(9, 2025) - B(4, 2025)) % 10n) === 5, '9^2025-4^2025')
{ // 3A+1 = 4^21 và 4B+1 = 5^2026 (dãy rút gọn)
  let A = 0n; for (let i = 0; i <= 20; i++) A += B(4, i)
  chk(3n * A + 1n === B(4, 21) && B(4, 21) === B(2, 21) * B(2, 21), '3A+1=4^21')
  let C = 0n; for (let i = 0; i <= 2025; i++) C += B(5, i)
  chk(4n * C + 1n === B(5, 2026) && B(5, 2026) === B(5, 1013) * B(5, 1013), '4B+1=5^2026')
}
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
console.log('✔ KaTeX + số liệu (BigInt / vét cạn) đạt')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const kq = (r) => (r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)')
  for (const [id, mt] of Object.entries(MO_TA_DANG)) console.log(`mô tả dạng ${id}: ${kq(await c.query(`update dai_bdm_dang_bai set mo_ta = $2, updated_at = now() where id = $1 and coalesce(btrim(mo_ta), '') = ''`, [id, mt]))}`)
  for (const [id, mt] of Object.entries(MO_TA_NHOM)) console.log(`mô tả nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set mo_ta = $2, updated_at = now() where id = $1 and coalesce(btrim(mo_ta), '') = ''`, [id, mt]))}`)
  for (const id of Object.keys(LT)) console.log(`LT+VD dạng ${id}: ${kq(await c.query(`update dai_bdm_dang_bai set ly_thuyet = $2, vi_du = $3, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = '' and coalesce(btrim(vi_du), '') = ''`, [id, LT[id], VD[id]]))}`)
  for (const id of Object.keys(NHOM_LT)) console.log(`LT nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, NHOM_LT[id]]))}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
