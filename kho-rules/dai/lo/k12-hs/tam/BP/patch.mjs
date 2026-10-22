// Vá bỏ trùng phương (22/10). Chạy: node kho-rules/dai/lo/k12-hs/tam/BP/patch.mjs
import { readFileSync, writeFileSync } from 'node:fs'
const DIR = 'kho-rules/dai/lo/k12-hs/ra/'
function vá(tep, cac) {
  const raw = readFileSync(DIR + tep, 'utf8')
  const crlf = raw.includes('\r\n')
  let t = raw.replace(/\r\n/g, '\n')
  for (const [a, b] of cac) {
    const n = t.split(a).length - 1
    if (n !== 1) throw new Error(`${tep}: cụm tìm thấy ${n} lần: ${a.slice(0, 60)}`)
    t = t.replace(a, () => b)
  }
  writeFileSync(DIR + tep, crlf ? t.replace(/\n/g, '\r\n') : t)
  console.log('ok', tep)
}

// ---------- J1 H1.2.2 ví dụ 2 ----------
vá('J1.txt', [[
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Tìm các khoảng đồng biến của hàm số và cho biết hàm số có đồng biến trên $(-1;1)$ hay không.
[[HINH {"loai":"dothi","x":[-2,2],"y":[-3,2],"f":[{"e":"2*x^2-x^4","ten":"y=f(x)"}]}]]

Bài giải:
Đồ thị có hai đỉnh tại các điểm có hoành độ $x=-1$ và $x=1$ (cùng tung độ $1$) và một đáy tại điểm có hoành độ $x=0$ (tung độ $0$).
Đồ thị đi lên trên $(-\\infty;-1)$ và $(0;1)$; đi xuống trên $(-1;0)$ và $(1;+\\infty)$.
Hàm số không đồng biến trên $(-1;1)$ vì trên $(-1;0)$ đồ thị đi xuống.
Vậy hàm số đồng biến trên $(-\\infty;-1)$ và $(0;1)$; hàm số không đồng biến trên $(-1;1)$.`,
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Tìm các khoảng đồng biến, nghịch biến của hàm số và cho biết hàm số có nghịch biến trên $(0;2)$ hay không.
[[HINH {"loai":"dothi","x":[-3,5],"y":[-6,6],"f":[{"e":"(x^2-2*x+2)/(x-1)","ten":"y=f(x)"}],"duong":[{"dung":1,"ten":"x=1"}]}]]

Bài giải:
Đồ thị có tiệm cận đứng $x=1$ nên hàm số không xác định tại $x=1$ và đồ thị gồm hai nhánh ở hai bên đường đó.
Nhánh bên trái có đỉnh tại điểm có hoành độ $x=0$ (tung độ $-2$); nhánh bên phải có đáy tại điểm có hoành độ $x=2$ (tung độ $2$).
Đồ thị đi lên trên $(-\\infty;0)$ và $(2;+\\infty)$; đi xuống trên $(0;1)$ và $(1;2)$.
Khoảng $(0;2)$ chứa điểm $x=1$ không thuộc tập xác định nên hàm số không nghịch biến trên $(0;2)$.
Vậy hàm số đồng biến trên $(-\\infty;0)$ và $(2;+\\infty)$, nghịch biến trên $(0;1)$ và $(1;2)$; hàm số không nghịch biến trên $(0;2)$.`]])

// ---------- J2 H2.2.2 ví dụ 1 + H2.3.3 ví dụ 2 ----------
vá('J2.txt', [[
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Hàm số có bao nhiêu điểm cực trị? Tìm giá trị cực đại và các điểm cực tiểu của đồ thị.
[[HINH {"loai":"dothi","x":[-4,4],"y":[-5,3],"f":[{"e":"x^4/4-2*x^2","ten":"y=f(x)"}]}]]

Bài giải:
Đồ thị có một đỉnh tại $O(0;0)$ và hai đáy tại các điểm có hoành độ $x=-2$ và $x=2$, cùng tung độ $y=-4$.
Vậy hàm số có $3$ điểm cực trị, giá trị cực đại $y_{\\text{CĐ}}=0$ và hai điểm cực tiểu của đồ thị là $(-2;-4)$, $(2;-4)$.`,
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Hàm số có bao nhiêu điểm cực trị? Tìm giá trị cực đại và điểm cực tiểu của đồ thị.
[[HINH {"loai":"dothi","x":[-3,3],"y":[-4,4],"f":[{"e":"-x^3+3*x","ten":"y=f(x)"}]}]]

Bài giải:
Đồ thị có một đỉnh tại điểm có hoành độ $x=1$ (tung độ $2$) và một đáy tại điểm có hoành độ $x=-1$ (tung độ $-2$).
Vậy hàm số có $2$ điểm cực trị, giá trị cực đại $y_{\\text{CĐ}}=2$ và điểm cực tiểu của đồ thị là $(-1;-2)$.`],
[
`[[HINH {"loai":"dothi","x":[-2,2],"y":[-2,3],"f":[{"e":"x^4-2*x^2","ten":"y=f'(x)"}]}]]

Bài giải:
Đồ thị $y=f'(x)$ có hai đáy tại $(-1;-1)$ và $(1;-1)$, một đỉnh tại $O(0;0)$; hai nhánh ngoài đi lên mãi.
a) $g'(x)=f'(x)+1=0\\Leftrightarrow f'(x)=-1$. Đường thẳng $y=-1$ chạm đồ thị đúng tại hai đáy $(-1;-1)$ và $(1;-1)$ (tiếp xúc), không cắt thêm nên $g'\\ge0$ và không đổi dấu: $g$ không có cực trị.
b) $h'(x)=f'(x)-1=0\\Leftrightarrow f'(x)=1$. Đường thẳng $y=1$ nằm cao hơn đỉnh $O(0;0)$ nên chỉ cắt hai nhánh ngoài của đồ thị $y=f'(x)$, tại hai điểm ở hai phía của trục $Oy$; tại cả hai điểm $h'$ đổi dấu.
Hai điểm đó có $h'>0$ ở ngoài và $h'<0$ ở giữa: cực đại ở điểm bên trái, cực tiểu ở điểm bên phải.
Vậy hàm số $g(x)$ không có điểm cực trị nào, hàm số $h(x)$ có $2$ điểm cực trị.`,
`[[HINH {"loai":"dothi","x":[-1,3.4],"y":[-5,5],"f":[{"e":"x^3-3*x^2","ten":"y=f'(x)"}]}]]

Bài giải:
Đồ thị $y=f'(x)$ có một đỉnh tại $O(0;0)$ và một đáy tại $(2;-4)$; nhánh bên trái đi xuống mãi, nhánh bên phải đi lên mãi.
a) $g'(x)=f'(x)+1=0\\Leftrightarrow f'(x)=-1$. Đường thẳng $y=-1$ nằm giữa đáy ($y=-4$) và đỉnh ($y=0$) nên cắt đồ thị $y=f'(x)$ tại ba điểm phân biệt, và $g'$ đổi dấu tại cả ba điểm (từ trái sang phải: $-$, $+$, $-$, $+$).
b) $h'(x)=f'(x)-1=0\\Leftrightarrow f'(x)=1$. Đường thẳng $y=1$ nằm cao hơn đỉnh $O(0;0)$ nên chỉ cắt nhánh bên phải của đồ thị $y=f'(x)$ tại một điểm; tại đó $h'$ đổi dấu từ $-$ sang $+$.
Vậy hàm số $g(x)$ có $3$ điểm cực trị (hai cực tiểu, một cực đại), hàm số $h(x)$ có $1$ điểm cực trị (cực tiểu).`]])

// ---------- J3 nhóm H2.4 (bỏ gạch đầu dòng trùng phương) + nhóm H2.5 (CY) ----------
vá('J3.txt', [[
`- Hàm trùng phương $y=ax^4+bx^2+c$ ($a\\ne0$): $y'=2x(2ax^2+b)$; có ba cực trị ⇔ $ab<0$; chỉ có một cực trị (tại $x=0$) ⇔ $ab\\ge0$.
`, ``],
[
`- Hàm trùng phương có ba cực trị không thẳng hàng nên không có "đường thẳng qua các điểm cực trị"; lấy phần dư của phép chia $y$ cho $y'$ dùng cho hàm bậc ba, còn hàm phân thức bậc hai trên bậc nhất dùng $y=\\dfrac{u'}{v'}$.`,
`- Đường thẳng qua hai điểm cực trị: hàm bậc ba lấy phần dư của phép chia $y$ cho $y'$, còn hàm phân thức bậc hai trên bậc nhất dùng $y=\\dfrac{u'}{v'}$; không dùng lẫn hai cách.`]])

// ---------- J4 H3.1.1 ví dụ 2 + H3.2.1 ----------
vá('J4.txt', [[
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Tìm giá trị lớn nhất $M$, giá trị nhỏ nhất $m$ của $f(x)$ trên đoạn $[-1;2]$ và tính $M-m$.
[[HINH {"loai":"dothi","x":[-2.5,2.5],"y":[-8,3],"f":[{"e":"-(x^4)+2*x^2+1","ten":"y=f(x)"}]}]]

Bài giải:
Trên đoạn $[-1;2]$, đồ thị bắt đầu tại $(-1;2)$, đi xuống đáy $(0;1)$, lên đỉnh $(1;2)$ rồi đi xuống điểm cuối $(2;-7)$.
Điểm cao nhất có tung độ $2$ (đạt tại $x=-1$ và $x=1$) nên $M=2$.
Điểm thấp nhất không phải đáy $(0;1)$ mà là đầu mút $(2;-7)$ nên $m=-7$.
Vậy $M=2$, $m=-7$ và $M-m=9$.`,
`Cho hàm số $y=f(x)$ có đồ thị như hình vẽ. Tìm giá trị lớn nhất $M$, giá trị nhỏ nhất $m$ của $f(x)$ trên đoạn $[0;5]$ và tính $M-m$.
[[HINH {"loai":"dothi","x":[-1,5.5],"y":[-6,18],"f":[{"e":"x^3-6*x^2+9*x-4","ten":"y=f(x)"}]}]]

Bài giải:
Trên đoạn $[0;5]$, đồ thị bắt đầu tại $(0;-4)$, đi lên đỉnh $(1;0)$, xuống đáy $(3;-4)$ rồi đi lên điểm cuối $(5;16)$.
Điểm cao nhất không phải đỉnh $(1;0)$ mà là đầu mút $(5;16)$ nên $M=16$.
Điểm thấp nhất có tung độ $-4$ (đạt tại $x=0$ và $x=3$) nên $m=-4$.
Vậy $M=16$, $m=-4$ và $M-m=20$.`],
[
`- $y'$ của hàm bậc ba là tam thức bậc hai, của hàm trùng phương $y=ax^4+bx^2+c$ là $y'=2x(2ax^2+b)$.`,
`- $y'$ của hàm bậc ba là tam thức bậc hai (giải bằng phân tích nhân tử hoặc $\\Delta$); của hàm bậc bốn là đa thức bậc ba.`],
[
`- Với hàm trùng phương, nghiệm $x=\\pm\\sqrt{k}$ có thể có một nghiệm nằm ngoài đoạn: kiểm tra từng nghiệm.`,
`- Đoạn $[a;b]$ có thể chỉ chứa một trong hai nghiệm của $y'=0$: kiểm tra từng nghiệm có thuộc đoạn hay không.`],
[
`Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y=x^4-4x^2+3$ trên đoạn $[-1;3]$.

Bài giải:
Hàm số liên tục trên $[-1;3]$ và $y'=4x^3-8x=4x(x^2-2)$.
$y'=0$ khi $x=0$ hoặc $x=\\pm\\sqrt{2}$; trong đoạn $[-1;3]$ chỉ nhận $x=0$ và $x=\\sqrt{2}$ (loại $x=-\\sqrt{2}\\approx-1{,}41$).
Ta có $y(-1)=0$, $y(0)=3$, $y(\\sqrt{2})=4-8+3=-1$, $y(3)=81-36+3=48$.
Vậy $\\max_{[-1;3]}y=48$ tại $x=3$ và $\\min_{[-1;3]}y=-1$ tại $x=\\sqrt{2}$.`,
`Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y=2x^3-3x^2-12x+5$ trên đoạn $[0;3]$.

Bài giải:
Hàm số liên tục trên $[0;3]$ và $y'=6x^2-6x-12=6(x+1)(x-2)$.
$y'=0$ khi $x=-1$ hoặc $x=2$; trong đoạn $[0;3]$ chỉ nhận $x=2$ (loại $x=-1$).
Ta có $y(0)=5$, $y(2)=16-12-24+5=-15$, $y(3)=54-27-36+5=-4$.
Vậy $\\max_{[0;3]}y=5$ tại $x=0$ và $\\min_{[0;3]}y=-15$ tại $x=2$.`]])

// ---------- J9 H7.3.2 ví dụ 1 ----------
vá('J9.txt', [[
`Tìm khoảng cách ngắn nhất từ điểm $A(0;3)$ đến một điểm $M$ nằm trên parabol $y=x^2$.

Bài giải:
Điểm $M(x;x^2)$ nên $d^2=AM^2=x^2+(x^2-3)^2=x^4-5x^2+9$ với $x\\in\\mathbb{R}$.
Đặt $g(x)=x^4-5x^2+9$ thì $g'(x)=4x^3-10x=2x(2x^2-5)$.
$g'(x)=0\\Leftrightarrow x=0$ hoặc $x=\\pm\\sqrt{\\dfrac52}$.
$g(0)=9$ và $g\\left(\\pm\\sqrt{\\dfrac52}\\right)=\\dfrac{25}{4}-\\dfrac{25}{2}+9=\\dfrac{11}{4}$; $g(x)\\to+\\infty$ khi $x\\to\\pm\\infty$ nên giá trị nhỏ nhất của $g$ là $\\dfrac{11}{4}$.
Vậy $d_{\\min}=\\sqrt{\\dfrac{11}{4}}=\\dfrac{\\sqrt{11}}{2}$, đạt khi $M\\left(\\pm\\sqrt{\\dfrac52};\\dfrac52\\right)$.`,
`Tìm khoảng cách ngắn nhất từ điểm $A(3;0)$ đến một điểm $M$ nằm trên đồ thị hàm số $y=\\sqrt{x}$.

Bài giải:
Điểm $M(x;\\sqrt{x})$ với $x\\ge0$ nên $d^2=AM^2=(x-3)^2+(\\sqrt{x})^2=x^2-5x+9$.
Đặt $g(x)=x^2-5x+9$ với $x\\in[0;+\\infty)$ thì $g'(x)=2x-5$.
$g'(x)=0\\Leftrightarrow x=\\dfrac52$; $g'<0$ trên $\\left[0;\\dfrac52\\right)$ và $g'>0$ trên $\\left(\\dfrac52;+\\infty\\right)$ nên $g$ nhỏ nhất tại $x=\\dfrac52$.
$g\\left(\\dfrac52\\right)=\\dfrac{25}{4}-\\dfrac{25}{2}+9=\\dfrac{11}{4}$.
Vậy $d_{\\min}=\\sqrt{\\dfrac{11}{4}}=\\dfrac{\\sqrt{11}}{2}$, đạt khi $M\\left(\\dfrac52;\\sqrt{\\dfrac52}\\right)$.`]])
