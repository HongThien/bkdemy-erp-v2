=== PA.34@p247
- bai: 34 · y: - · trang: 247 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040202
- cong_cu: số chính phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c,d$ là các số nguyên dương khác nhau thỏa mãn: $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+d}+\dfrac{d}{d+a}=2$. Chứng minh rằng tích $abcd$ là một số chính phương.
## SACH
Ta có: $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+d}+\dfrac{d}{d+a}=2$
$\Leftrightarrow1-\dfrac{a}{a+b}-\dfrac{b}{b+c}+1-\dfrac{c}{c+d}-\dfrac{d}{d+a}=0$
$\Leftrightarrow\dfrac{b}{a+b}-\dfrac{b}{b+c}+\dfrac{d(a-c)}{(c+d)(d+a)}=0$
$\Leftrightarrow\dfrac{b}{(a+b)(b+c)}+\dfrac{-d}{(c+d)(d+a)}=0$ (vì $c\ne a$)
$\Leftrightarrow b(c+d)(d+a)-d(a+b)(b+c)=0$
$\Leftrightarrow bcd+abc+bd^2+abd-abd-acd-b^2d-bcd=0$
$\Leftrightarrow abc-acd+bd^2-b^2d=0$
$\Leftrightarrow ac(b-d)-bd(b-d)=0$
$\Leftrightarrow ac-bd=0$ (vì $b\ne d$)
Do vậy $abcd=(ac)(bd)=(ac)^2$ là một số chính phương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện "các số khác nhau" cho phép chia cho $c-a$ và $b-d$; viết $2=1+1$ rồi ghép các phân số theo từng cặp sẽ làm xuất hiện nhân tử $c-a$, sau đó còn lại tích $(b-d)(ac-bd)=0$.

**Bước 1.** Viết $2=1+1$ rồi dùng $1-\dfrac{a}{a+b}=\dfrac{b}{a+b}$ và $1-\dfrac{c}{c+d}=\dfrac{d}{c+d}$ để chuyển điều kiện về dạng một tổng bằng $0$.

**Bước 2.** Ghép từng cặp phân số có cùng tử số rồi quy đồng, tử số của hai cặp lần lượt chứa $c-a$ và $a-c$.

**Bước 3.** Đặt $c-a$ làm nhân tử chung và chia cho $c-a\ne0$, rồi quy đồng, khai triển để rút gọn về một tích hai nhân tử bằng $0$.

**Bước 4.** Dùng điều kiện $b\ne d$ để loại một nhân tử, từ nhân tử còn lại biểu diễn $abcd$ thành bình phương của một số nguyên.

**Chú ý:** Giả thiết "khác nhau" được dùng hai lần ($a\ne c$ và $b\ne d$); thiếu một trong hai thì không chia được.

**Phần 2. Trình bày**

Từ giả thiết, ta có $\left(1-\dfrac{a}{a+b}\right)-\dfrac{b}{b+c}+\left(1-\dfrac{c}{c+d}\right)-\dfrac{d}{d+a}=0$

$\Leftrightarrow\dfrac{b}{a+b}-\dfrac{b}{b+c}+\dfrac{d}{c+d}-\dfrac{d}{d+a}=0$

$\Leftrightarrow\dfrac{b(c-a)}{(a+b)(b+c)}+\dfrac{d(a-c)}{(c+d)(d+a)}=0$

$\Leftrightarrow(c-a)\left[\dfrac{b}{(a+b)(b+c)}-\dfrac{d}{(c+d)(d+a)}\right]=0$

Vì $c\ne a$ nên $\dfrac{b}{(a+b)(b+c)}=\dfrac{d}{(c+d)(d+a)}$

$\Leftrightarrow b(c+d)(d+a)=d(a+b)(b+c)$

$\Leftrightarrow bcd+abc+bd^2+abd=abd+acd+b^2d+bcd$

$\Leftrightarrow abc-acd+bd^2-b^2d=0$

$\Leftrightarrow ac(b-d)-bd(b-d)=0$

$\Leftrightarrow(b-d)(ac-bd)=0$

Vì $b\ne d$ nên $ac=bd$.

Do đó $abcd=(ac)(bd)=(ac)^2$ với $ac$ là số nguyên dương, nên $abcd$ là một số chính phương.

=== PA.35@p247
- bai: 35 · y: - · trang: 247 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040101
- cong_cu: $a^k+b^k$ chia hết cho $a+b$ với $k$ lẻ · ghép cặp · tính chẵn lẻ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách viết "có $2n$ số hạng là số lẻ" — đáng ra là $2m$ (với $n=4m$ chỉ có $2m$ số lẻ trong $n$ số hạng); lỗi in, kết luận không đổi. Lời giải kho dùng $2m$.
## DE
Cho $n$ là số nguyên dương chia hết cho $4$ và $k$ là số tự nhiên lẻ. Chứng minh rằng: $\dfrac{1^k+2^k+3^k+\dots+n^k}{2}$ là số tự nhiên chia hết cho $n+1$.
## SACH
Vì $n\vdots4$, $n\in\mathbb{N}^*$, đặt $n=4m$ ($m\in\mathbb{N}^*$)
Tổng $1^k+2^k+\dots+n^k=1^k+2^k+\dots+(4m)^k$ có $2n$ số hạng là số lẻ, $2m$ số hạng là số chẵn nên tổng là số chẵn
Vậy $1^k+2^k+\dots+n^k\vdots2$
Mặt khác:
$1^k+(4m)^k=(4m)^k-(-1)^k\vdots4m-(-1)$. Nên $1^k+(4m)^k\vdots n+1$
$2^k+(4m-1)^k=(4m-1)^k-(-2)^k\vdots4m-1-(-2)$. Nên $2^k+(4m-1)^k\vdots n+1$
$\dots$
$(2m)^k+(2m+1)^k=(2m+1)^k-(-2m)^k\vdots2m+1-(-2m)$. Nên $(2m)^k+(2m+1)^k\vdots n+1$
Do đó: $1^k+2^k+\dots+n^k\vdots n+1$
$n\vdots4$ nên ƯCLN$(n+1;2)=1$
Ta có: $1^k+2^k+\dots+n^k\vdots2(n+1)$
Vậy $\dfrac{1^k+2^k+\dots+n^k}{2}\vdots n+1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $k$ lẻ thì $a^k+b^k\vdots a+b$; ghép các số hạng cách đều hai đầu thành từng cặp có tổng cơ số bằng $n+1$, còn thừa số $2$ lấy từ việc tổng là số chẵn và $n+1$ là số lẻ.

**Bước 1.** Đặt $n=4m$ và $S=1^k+2^k+\dots+n^k$, chứng minh $S$ chẵn nhờ nhận xét $i^k$ cùng tính chẵn lẻ với $i$ (vì $k$ lẻ) và trong $n$ số hạng có đúng $2m$ số lẻ.

**Bước 2.** Ghép các số hạng thành $2m$ cặp $i^k+(n+1-i)^k$, trong đó mỗi cặp gồm hai cơ số có tổng bằng $n+1$.

**Bước 3.** Dùng tính chất $a^k+b^k\vdots a+b$ khi $k$ lẻ để chứng tỏ mỗi cặp chia hết cho $n+1$, từ đó suy ra cả tổng $S$ chia hết cho $n+1$.

**Bước 4.** Vì $n+1$ là số lẻ nên $n+1$ và $2$ nguyên tố cùng nhau; kết hợp $S\vdots2$ và $S\vdots n+1$ để kết luận về $\dfrac{S}{2}$.

**Chú ý:** Vì $n+1$ lẻ nên $i\ne n+1-i$ với mọi $i$, do đó cách ghép cặp không bỏ sót và không dùng một số hạng hai lần.

**Phần 2. Trình bày**

Vì $n\vdots4$ nên đặt $n=4m$ ($m\in\mathbb{N}^*$). Đặt $S=1^k+2^k+\dots+n^k$.

Vì $k$ lẻ nên $i^k$ cùng tính chẵn lẻ với $i$. Trong $4m$ số hạng của $S$ có $2m$ số hạng lẻ và $2m$ số hạng chẵn.

Tổng của $2m$ số lẻ là số chẵn, tổng các số chẵn là số chẵn, nên $S\vdots2$.

Với $k$ lẻ ta có $a^k+b^k=a^k-(-b)^k\vdots a-(-b)=a+b$.

Ghép $S$ thành $2m$ cặp: $1^k+(4m)^k$, $2^k+(4m-1)^k$, $\dots$, $(2m)^k+(2m+1)^k$, tức các cặp $i^k+(n+1-i)^k$ với $i=1;2;\dots;2m$.

Mỗi cặp có tổng cơ số bằng $i+(n+1-i)=n+1$ nên chia hết cho $n+1$.

Các cặp chứa mỗi số hạng của $S$ đúng một lần, do đó $S\vdots n+1$.

Vì $n$ chẵn nên $n+1$ lẻ, suy ra ƯCLN$(n+1;2)=1$.

Mà $S\vdots2$ và $S\vdots n+1$ nên $S\vdots2(n+1)$.

Vậy $\dfrac{S}{2}$ là số tự nhiên chia hết cho $n+1$.

=== PA.36@p248
- bai: 36 · y: - · trang: 248 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu:
- kiem: khong
- ket_qua_sach: \dfrac{a^4+18a^2+16+16a^2}{4a(a^2+4)}
- dap_an: $M=\dfrac{a^4+24a^2+16}{4a(a^2+4)}$
- ghi_chu_nghi: Sách in kết quả cuối $\dfrac{a^4+18a^2+16+16a^2}{4a(a^2+4)}$ — sai ở hệ số: $(a^2+4)^2=a^4+8a^2+16$ (không phải $a^4+18a^2+16$). Kết quả đúng là $\dfrac{a^4+24a^2+16}{4a(a^2+4)}$ (đã thử số: $x=2$, $y=1$ cho $a=\dfrac{10}{3}$, $M=\dfrac{514}{255}$ khớp công thức đúng). Nhóm chưa chắc: đặt ở $T18T010301$ (tính biểu thức theo một đại lượng cho trước), có thể là $T18T010501$.
## DE
Cho $x,y$ thỏa mãn $x\ne\pm y$. Đặt $\dfrac{x+y}{x-y}+\dfrac{x-y}{x+y}=a$. Tính giá trị của biểu thức $M=\dfrac{x^4+y^4}{x^4-y^4}+\dfrac{x^4-y^4}{x^4+y^4}$ theo $a$.
## SACH
Ta có: • $a=\dfrac{(x+y)^2+(x-y)^2}{x^2-y^2}=\dfrac{2(x^2+y^2)}{x^2-y^2}$
• $\dfrac{x^4+y^4}{x^4-y^4}=\dfrac{(x^2+y^2)^2+(x^2-y^2)^2}{2(x^2-y^2)(x^2+y^2)}=\dfrac{x^2+y^2}{2(x^2-y^2)}+\dfrac{x^2-y^2}{2(x^2+y^2)}$
$=\dfrac{a}{4}+\dfrac{1}{a}=\dfrac{a^2+4}{4a}$
Do đó $M=\dfrac{x^4+y^4}{x^4-y^4}+\dfrac{x^4-y^4}{x^4+y^4}=\dfrac{a^2+4}{4a}+\dfrac{4a}{a^2+4}=\dfrac{a^4+18a^2+16+16a^2}{4a(a^2+4)}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai số hạng của $M$ là hai phân thức nghịch đảo của nhau, nên chỉ cần biểu diễn $P=\dfrac{x^4+y^4}{x^4-y^4}$ theo $a$; mà $a=2\cdot\dfrac{x^2+y^2}{x^2-y^2}$ nên $\dfrac{x^2+y^2}{x^2-y^2}$ biết ngay theo $a$.

**Bước 1.** Quy đồng hai phân số trong định nghĩa của $a$ và rút gọn để tìm mối liên hệ giữa $a$ với tỉ số $\dfrac{x^2+y^2}{x^2-y^2}$.

**Bước 2.** Đặt $u=x^2+y^2$, $v=x^2-y^2$, rồi dùng $x^4-y^4=uv$ và $x^4+y^4=\dfrac{u^2+v^2}{2}$ để tách $P$ thành tổng của $\dfrac{u}{v}$ và $\dfrac{v}{u}$ (mỗi số chia cho $2$).

**Bước 3.** Thay $\dfrac{u}{v}$ và $\dfrac{v}{u}$ bằng biểu thức theo $a$ để thu gọn $P$ thành một phân thức chỉ chứa $a$.

**Bước 4.** Nhận ra $M=P+\dfrac{1}{P}$ rồi quy đồng, thu gọn để biểu diễn $M$ theo $a$.

**Chú ý:** $a\ne0$ vì $x^2+y^2>0$ (do $x\ne\pm y$ nên $x,y$ không cùng bằng $0$), nên được viết $\dfrac{1}{a}$; khi khai triển phải nhớ $(a^2+4)^2=a^4+8a^2+16$ — rất dễ viết nhầm hệ số của $a^2$.

**Phần 2. Trình bày**

Vì $x\ne\pm y$ nên $x^2-y^2\ne0$ và $x^2+y^2>0$.

$a=\dfrac{(x+y)^2+(x-y)^2}{x^2-y^2}=\dfrac{2(x^2+y^2)}{x^2-y^2}$

Suy ra $a\ne0$, $\dfrac{x^2+y^2}{x^2-y^2}=\dfrac{a}{2}$ và $\dfrac{x^2-y^2}{x^2+y^2}=\dfrac{2}{a}$.

Đặt $P=\dfrac{x^4+y^4}{x^4-y^4}$. Ta có $2(x^4+y^4)=(x^2+y^2)^2+(x^2-y^2)^2$ và $x^4-y^4=(x^2-y^2)(x^2+y^2)$ nên

$P=\dfrac{(x^2+y^2)^2+(x^2-y^2)^2}{2(x^2-y^2)(x^2+y^2)}$

$=\dfrac{1}{2}\left(\dfrac{x^2+y^2}{x^2-y^2}+\dfrac{x^2-y^2}{x^2+y^2}\right)$

$=\dfrac{1}{2}\left(\dfrac{a}{2}+\dfrac{2}{a}\right)=\dfrac{a^2+4}{4a}$

Khi đó $M=P+\dfrac{1}{P}=\dfrac{a^2+4}{4a}+\dfrac{4a}{a^2+4}$

$=\dfrac{(a^2+4)^2+16a^2}{4a(a^2+4)}$

$=\dfrac{a^4+24a^2+16}{4a(a^2+4)}$

Vậy $M=\dfrac{a^4+24a^2+16}{4a(a^2+4)}$.

=== PA.37@p248
- bai: 37 · y: - · trang: 248 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010501
- cong_cu: hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề sách in điều kiện "$a\ne b$" (cùng $b\ne-c$, $c\ne-a$); các mẫu số của đẳng thức là $a+b$, $b+c$, $c+a$ nên điều kiện cần là $a\ne-b$ — có vẻ in thiếu dấu trừ. Ở dòng "Tương tự có" của sách, các mẫu số của vài phân thức in lệch so với phép tách đúng (đúng là $\dfrac{c-b}{a+b}$ và $\dfrac{a-c}{b+c}$ — theo bản scan sách in $\dfrac{c-b}{a+c}$ và $\dfrac{a-c}{a+b}$; nếu mẫu như in thì tổng không ra vế phải). Lời giải kho soạn theo phép tách đúng. Nhóm chưa chắc: có thể $T18T010101$.
## DE
Cho $a\ne-b$, $b\ne-c$, $c\ne-a$. Chứng minh rằng: $\dfrac{b^2-c^2}{(a+b)(a+c)}+\dfrac{c^2-a^2}{(b+c)(b+a)}+\dfrac{a^2-b^2}{(c+a)(c+b)}=\dfrac{b-c}{b+c}+\dfrac{c-a}{c+a}+\dfrac{a-b}{a+b}$
## SACH
Ta có: $\dfrac{b^2-c^2}{(a+b)(a+c)}=\dfrac{b^2-a^2}{(a+b)(a+c)}+\dfrac{a^2-c^2}{(a+b)(a+c)}=\dfrac{b-a}{a+c}+\dfrac{a-c}{a+b}$
Tương tự có: $\dfrac{c^2-a^2}{(b+c)(b+a)}=\dfrac{c-b}{a+c}+\dfrac{b-a}{b+c}$, $\dfrac{a^2-b^2}{(c+a)(c+b)}=\dfrac{a-c}{a+b}+\dfrac{c-b}{c+a}$
Do vậy ta có: $\dfrac{b^2-c^2}{(a+b)(a+c)}+\dfrac{c^2-a^2}{(b+c)(b+a)}+\dfrac{a^2-b^2}{(c+a)(c+b)}=\dfrac{b-c}{b+c}+\dfrac{c-a}{c+a}+\dfrac{a-b}{a+b}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi tử số vế trái là hiệu hai bình phương; chèn bình phương của chữ có mặt ở cả hai nhân tử của mẫu để tách thành hai hiệu bình phương, mỗi hiệu triệt tiêu một nhân tử của mẫu.

**Bước 1.** Ở số hạng đầu, mẫu là $(a+b)(a+c)$ nên viết $b^2-c^2=(b^2-a^2)+(a^2-c^2)$ và rút gọn từng phân thức.

**Bước 2.** Làm tương tự cho số hạng thứ hai (chèn $b^2$ vì mẫu chứa $b+c$ và $b+a$) và số hạng thứ ba (chèn $c^2$).

**Bước 3.** Cộng sáu phân thức nhận được rồi nhóm theo mẫu $a+b$, $b+c$, $c+a$; tử số mỗi nhóm thu gọn thành tử của một phân thức ở vế phải.

**Chú ý:** Dễ nhầm dấu khi rút gọn, ví dụ $\dfrac{b^2-a^2}{(a+b)(a+c)}=\dfrac{b-a}{a+c}$ chứ không phải $\dfrac{a-b}{a+c}$.

**Phần 2. Trình bày**

Các mẫu số $a+b$, $b+c$, $c+a$ đều khác $0$. Ta có:

$\dfrac{b^2-c^2}{(a+b)(a+c)}=\dfrac{b^2-a^2}{(a+b)(a+c)}+\dfrac{a^2-c^2}{(a+b)(a+c)}=\dfrac{b-a}{a+c}+\dfrac{a-c}{a+b}$

$\dfrac{c^2-a^2}{(b+c)(b+a)}=\dfrac{c^2-b^2}{(b+c)(b+a)}+\dfrac{b^2-a^2}{(b+c)(b+a)}=\dfrac{c-b}{a+b}+\dfrac{b-a}{b+c}$

$\dfrac{a^2-b^2}{(c+a)(c+b)}=\dfrac{a^2-c^2}{(c+a)(c+b)}+\dfrac{c^2-b^2}{(c+a)(c+b)}=\dfrac{a-c}{b+c}+\dfrac{c-b}{c+a}$

Cộng ba đẳng thức theo vế rồi nhóm các phân thức cùng mẫu:

Vế trái $=\dfrac{(b-a)+(c-b)}{c+a}+\dfrac{(a-c)+(c-b)}{a+b}+\dfrac{(b-a)+(a-c)}{b+c}$

$=\dfrac{c-a}{c+a}+\dfrac{a-b}{a+b}+\dfrac{b-c}{b+c}$

Đây chính là vế phải. Vậy đẳng thức được chứng minh.

=== PA.38@p249
- bai: 38 · y: - · trang: 249 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: đặt ẩn phụ · bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề sách (theo bản scan) in số hạng thứ hai là $\dfrac{1}{(a^2+1)^2}$ (lặp lại số hạng thứ nhất), trong khi lời giải sách đặt $\dfrac{1}{b^2+1}=y$ và dùng $x^2+y^2+z^2+t^2\le1$ — nên đúng ra số hạng thứ hai phải là $\dfrac{1}{(b^2+1)^2}$. Kho ghi đề có $b$ (đã ghi sach_in_sai). Ở lời giải sách, dòng "$[(x^2+2xy+y^2)-2(x+y)+2xy]+(z^2-2zt+t^2)$" cũng in thừa $2xy$ và thiếu $1$ (đúng: $[(x+y)^2-2(x+y)+1]+(z-t)^2$); không ảnh hưởng kết luận.
## DE
Cho $a,b,c,d>0$ thỏa mãn: $\dfrac{1}{(a^2+1)^2}+\dfrac{1}{(b^2+1)^2}+\dfrac{1}{(c^2+1)^2}+\dfrac{1}{(d^2+1)^2}\le1$. Chứng minh rằng: $abcd\ge1$
## SACH
Đặt $\dfrac{1}{a^2+1}=x$, $\dfrac{1}{b^2+1}=y$, $\dfrac{1}{c^2+1}=z$, $\dfrac{1}{d^2+1}=t$
Kết hợp với điều kiện của đề toán, ta có: $0<x,y,z,t<1$; $x^2+y^2+z^2+t^2\le1$; $a^2=\dfrac{1-x}{x}$, $b^2=\dfrac{1-y}{y}$, $c^2=\dfrac{1-z}{z}$, $d^2=\dfrac{1-t}{t}$.
Do đó, ta có: $2[(1-x)(1-y)-zt]=2-2(x+y)+2xy-2zt\ge1+x^2+y^2+z^2+t^2-2(x+y)+2xy-2zt$
$=[(x^2+2xy+y^2)-2(x+y)+2xy]+(z^2-2zt+t^2)$
$=(x+y-1)^2+(z-t)^2\ge0$
Nên $(1-x)(1-y)-zt\ge0$. Do đó: $\dfrac{(1-x)(1-y)}{zt}\ge1$ (1)
Chứng minh tương tự có: $\dfrac{(1-z)(1-t)}{xy}\ge1$ (2)
Từ (1) và (2) ta có: $\dfrac{(1-x)(1-y)}{zt}\cdot\dfrac{(1-z)(1-t)}{xy}\ge1$
$\Leftrightarrow\dfrac{1-x}{x}\cdot\dfrac{1-y}{y}\cdot\dfrac{1-z}{z}\cdot\dfrac{1-t}{t}\ge1$
Nên $a^2\cdot b^2\cdot c^2\cdot d^2\ge1$
Vậy $abcd\ge1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt mỗi phân thức $\dfrac{1}{a^2+1}$, $\dfrac{1}{b^2+1}$, $\dfrac{1}{c^2+1}$, $\dfrac{1}{d^2+1}$ làm một ẩn mới thì giả thiết thành $x^2+y^2+z^2+t^2\le1$ và $a^2=\dfrac{1-x}{x}$; khi đó phải chứng minh tích bốn phân thức $\dfrac{1-x}{x}$ lớn hơn hoặc bằng $1$, và tích đó tách được thành hai nhóm $(x,y)$ và $(z,t)$.

**Bước 1.** Đặt bốn ẩn phụ, xác định khoảng giá trị $0<x,y,z,t<1$ và biểu diễn $a^2,b^2,c^2,d^2$ theo chúng.

**Bước 2.** Dùng $x^2+y^2+z^2+t^2\le1$ để chặn dưới $2[(1-x)(1-y)-zt]$ bằng một tổng hai bình phương, từ đó suy ra $(1-x)(1-y)\ge zt$.

**Bước 3.** Đổi vai hai nhóm $(x,y)$ và $(z,t)$ để có bất đẳng thức thứ hai cùng dạng.

**Bước 4.** Nhân hai bất đẳng thức (vế nào cũng dương) để thu được tích bốn phân thức $\dfrac{1-x}{x}$ lớn hơn hoặc bằng $1$, rồi trở lại $a,b,c,d$.

**Chú ý:** Dấu "=" xảy ra khi $a=b=c=d=1$ (lúc đó $x=y=z=t=\dfrac{1}{2}$).

**Phần 2. Trình bày**

Đặt $x=\dfrac{1}{a^2+1}$, $y=\dfrac{1}{b^2+1}$, $z=\dfrac{1}{c^2+1}$, $t=\dfrac{1}{d^2+1}$.

Vì $a,b,c,d>0$ nên $0<x,y,z,t<1$ và $a^2=\dfrac{1-x}{x}$, $b^2=\dfrac{1-y}{y}$, $c^2=\dfrac{1-z}{z}$, $d^2=\dfrac{1-t}{t}$. Điều kiện của đề trở thành $x^2+y^2+z^2+t^2\le1$.

$2[(1-x)(1-y)-zt]=2-2(x+y)+2xy-2zt$

$\ge1+x^2+y^2+z^2+t^2-2(x+y)+2xy-2zt$ (vì $x^2+y^2+z^2+t^2\le1$)

$=[(x+y)^2-2(x+y)+1]+(z-t)^2$

$=(x+y-1)^2+(z-t)^2\ge0$

Suy ra $(1-x)(1-y)\ge zt>0$, do đó $\dfrac{(1-x)(1-y)}{zt}\ge1$ (1)

Hoán đổi vai $(x,y)$ và $(z,t)$, ta được $\dfrac{(1-z)(1-t)}{xy}\ge1$ (2)

Nhân (1) với (2) (hai vế đều dương): $\dfrac{1-x}{x}\cdot\dfrac{1-y}{y}\cdot\dfrac{1-z}{z}\cdot\dfrac{1-t}{t}\ge1$

Tức là $a^2b^2c^2d^2\ge1$. Vì $abcd>0$ nên $abcd\ge1$. Dấu "=" xảy ra khi $a=b=c=d=1$.

=== PA.39@p250
- bai: 39 · y: - · trang: 250 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: bất đẳng thức tam giác · phân tích nhân tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác. Chứng minh rằng: $\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert<1$
## SACH
Ta có: $\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert$
$=\left\lvert\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}\right\rvert=\left\lvert\dfrac{ac(a-c)+ab(b-a)+bc(c-b)}{abc}\right\rvert$
$=\left\lvert\dfrac{ac(a-c)+ab(b-c+c-a)+bc(c-b)}{abc}\right\rvert$
$=\left\lvert\dfrac{ac(a-c)+ab(b-c)+ab(c-a)+bc(c-b)}{abc}\right\rvert$
$=\left\lvert\dfrac{a(a-c)(c-b)+b(b-c)(a-c)}{abc}\right\rvert$
$=\left\lvert\dfrac{(a-c)(c-b)(a-b)}{abc}\right\rvert=\left\lvert\dfrac{\lvert a-c\rvert}{b}\cdot\dfrac{\lvert a-b\rvert}{c}\cdot\dfrac{\lvert c-b\rvert}{a}\right\rvert<1\cdot1\cdot1=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép các số hạng cùng mẫu rồi quy đồng thì tử số phân tích được thành tích ba hiệu $(a-c)(c-b)(a-b)$; bất đẳng thức tam giác cho mỗi hiệu có giá trị tuyệt đối nhỏ hơn cạnh còn lại, tức mỗi phân thức của tích có giá trị tuyệt đối nhỏ hơn $1$.

**Bước 1.** Ghép $\dfrac{a}{b}$ với $\dfrac{c}{b}$, $\dfrac{b}{c}$ với $\dfrac{a}{c}$, $\dfrac{c}{a}$ với $\dfrac{b}{a}$ để biểu thức trong dấu giá trị tuyệt đối thành tổng ba phân thức rồi quy đồng.

**Bước 2.** Phân tích tử số thành nhân tử bằng cách tách hạng tử và nhóm lại, được tích $(a-c)(c-b)(a-b)$.

**Bước 3.** Tách giá trị tuyệt đối của tích thành tích ba phân thức dạng $\dfrac{\lvert a-c\rvert}{b}$ rồi dùng bất đẳng thức tam giác để đánh giá từng phân thức.

**Chú ý:** Chỗ duy nhất dùng giả thiết "ba cạnh tam giác" là bất đẳng thức $\lvert a-c\rvert<b$ (hiệu hai cạnh nhỏ hơn cạnh thứ ba) cùng hai bất đẳng thức tương tự.

**Phần 2. Trình bày**

$\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)=\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}$

$=\dfrac{ac(a-c)+ab(b-a)+bc(c-b)}{abc}$

Biến đổi tử số: $ab(b-a)=ab(b-c)+ab(c-a)$ nên

$ac(a-c)+ab(b-a)+bc(c-b)=[ac(a-c)-ab(a-c)]+[ab(b-c)+bc(c-b)]$

$=a(a-c)(c-b)+b(b-c)(a-c)$

$=(a-c)[a(c-b)-b(c-b)]=(a-c)(c-b)(a-b)$

Do đó $\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert=\dfrac{\lvert a-c\rvert}{b}\cdot\dfrac{\lvert a-b\rvert}{c}\cdot\dfrac{\lvert c-b\rvert}{a}$

Vì $a,b,c$ là ba cạnh của một tam giác nên $\lvert a-c\rvert<b$, $\lvert a-b\rvert<c$, $\lvert c-b\rvert<a$.

Suy ra mỗi phân thức trong tích thuộc nửa khoảng $[0;1)$, nên tích của chúng nhỏ hơn $1$.

Vậy $\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert<1$.

=== PA.40@p250
- bai: 40 · y: - · trang: 250 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Bu-nhi-a-cốp-xki dạng phân thức · đánh giá từng số hạng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách dùng bước $\dfrac{(a+b)^2}{2(a^2+c^2+b^2+c^2)}\le\dfrac{a^2}{2(a^2+c^2)}+\dfrac{b^2}{2(b^2+c^2)}$ mà không chứng minh; lời giải kho chứng minh bổ đề này bằng xét hiệu. Đề không nêu điều kiện $1-ab>0$ nhưng suy ra được từ $a^2+b^2+c^2=1$.
## DE
Cho $a,b,c>0$ thỏa mãn: $a^2+b^2+c^2=1$. Chứng minh: $\dfrac{1}{1-ab}+\dfrac{1}{1-bc}+\dfrac{1}{1-ca}\le\dfrac{9}{2}$
## SACH
Ta có: $\dfrac{1}{1-ab}=\dfrac{4}{4-4ab}\le\dfrac{4}{4-(a+b)^2}$
$=1+\dfrac{(a+b)^2}{4-(a+b)^2}\le1+\dfrac{(a+b)^2}{4-2(a^2+b^2)}=1+\dfrac{(a+b)^2}{2(2-a^2-b^2)}$
$=1+\dfrac{(a+b)^2}{2(2a^2+2b^2+2c^2-a^2-b^2)}$
$=1+\dfrac{(a+b)^2}{2(a^2+c^2+b^2+c^2)}\le1+\dfrac{a^2}{2(a^2+c^2)}+\dfrac{b^2}{2(b^2+c^2)}$
Như vậy: $\dfrac{1}{1-ab}\le1+\dfrac{a^2}{2(a^2+c^2)}+\dfrac{b^2}{2(b^2+c^2)}$ (1),
Tương tự có: $\dfrac{1}{1-bc}\le1+\dfrac{b^2}{2(b^2+a^2)}+\dfrac{c^2}{2(c^2+a^2)}$ (2)
$\dfrac{1}{1-ca}\le1+\dfrac{c^2}{2(c^2+b^2)}+\dfrac{a^2}{2(a^2+b^2)}$ (3)
Từ (1), (2), (3) có: $\dfrac{1}{1-ab}+\dfrac{1}{1-bc}+\dfrac{1}{1-ca}\le\dfrac{9}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Dùng $4ab\le(a+b)^2$ để đưa $\dfrac{1}{1-ab}$ về biểu thức chỉ chứa $a+b$; nhờ $a^2+b^2+c^2=1$ mẫu số trở thành tổng $(a^2+c^2)+(b^2+c^2)$, và bất đẳng thức dạng Bu-nhi-a-cốp-xki $\dfrac{(a+b)^2}{X+Y}\le\dfrac{a^2}{X}+\dfrac{b^2}{Y}$ tách phân thức đó thành hai phân thức đơn giản, ba bất đẳng thức cộng lại thì các phân thức ghép từng cặp thành $\dfrac{1}{2}$.

**Bước 1.** Chứng minh bổ đề $\dfrac{(a+b)^2}{X+Y}\le\dfrac{a^2}{X}+\dfrac{b^2}{Y}$ với $X,Y>0$ bằng cách xét hiệu hai vế, hiệu này là một bình phương chia cho số dương.

**Bước 2.** Kiểm tra các mẫu số đều dương, rồi dùng $4ab\le(a+b)^2$ để chặn trên $\dfrac{1}{1-ab}$ bằng $\dfrac{4}{4-(a+b)^2}$.

**Bước 3.** Tách $\dfrac{4}{4-(a+b)^2}=1+\dfrac{(a+b)^2}{4-(a+b)^2}$, thay mẫu bằng mẫu nhỏ hơn nhờ $(a+b)^2\le2(a^2+b^2)$ và viết mẫu mới theo $a^2+c^2$, $b^2+c^2$ nhờ $a^2+b^2+c^2=1$.

**Bước 4.** Áp dụng bổ đề để thu được bất đẳng thức (1), viết hai bất đẳng thức tương tự bằng cách hoán vị vòng quanh rồi cộng ba bất đẳng thức lại.

**Chú ý:** Dấu "=" xảy ra khi $a=b=c$ (khi đó $a^2=\dfrac{1}{3}$ và mỗi phân thức bằng $\dfrac{3}{2}$).

**Phần 2. Trình bày**

Bổ đề: với $X,Y>0$ thì $\dfrac{(a+b)^2}{X+Y}\le\dfrac{a^2}{X}+\dfrac{b^2}{Y}$ (*).

Thật vậy, $\dfrac{a^2}{X}+\dfrac{b^2}{Y}-\dfrac{(a+b)^2}{X+Y}=\dfrac{(aY-bX)^2}{XY(X+Y)}\ge0$.

Vì $a^2+b^2+c^2=1$ nên $ab\le\dfrac{a^2+b^2}{2}<\dfrac{1}{2}$ và $(a+b)^2\le2(a^2+b^2)<2$; do đó $1-ab>0$ và $4-(a+b)^2>0$.

Vì $4ab\le(a+b)^2$ nên $4-4ab\ge4-(a+b)^2>0$, suy ra

$\dfrac{1}{1-ab}=\dfrac{4}{4-4ab}\le\dfrac{4}{4-(a+b)^2}$

$=1+\dfrac{(a+b)^2}{4-(a+b)^2}$

$\le1+\dfrac{(a+b)^2}{4-2(a^2+b^2)}$ (vì $(a+b)^2\le2(a^2+b^2)$ nên $4-(a+b)^2\ge4-2(a^2+b^2)>0$)

$=1+\dfrac{(a+b)^2}{2(a^2+c^2)+2(b^2+c^2)}$ (vì $4-2(a^2+b^2)=4(a^2+b^2+c^2)-2a^2-2b^2$)

$\le1+\dfrac{a^2}{2(a^2+c^2)}+\dfrac{b^2}{2(b^2+c^2)}$ (áp dụng (*) với $X=2(a^2+c^2)$, $Y=2(b^2+c^2)$). (1)

Hoán vị vòng quanh $a\to b\to c\to a$ ta được

$\dfrac{1}{1-bc}\le1+\dfrac{b^2}{2(b^2+a^2)}+\dfrac{c^2}{2(c^2+a^2)}$ (2)

$\dfrac{1}{1-ca}\le1+\dfrac{c^2}{2(c^2+b^2)}+\dfrac{a^2}{2(a^2+b^2)}$ (3)

Cộng (1), (2), (3) theo vế và ghép các phân thức cùng mẫu:

$\dfrac{1}{1-ab}+\dfrac{1}{1-bc}+\dfrac{1}{1-ca}\le3+\dfrac{a^2+c^2}{2(a^2+c^2)}+\dfrac{b^2+c^2}{2(b^2+c^2)}+\dfrac{a^2+b^2}{2(a^2+b^2)}=3+\dfrac{1}{2}+\dfrac{1}{2}+\dfrac{1}{2}=\dfrac{9}{2}$

Vậy bất đẳng thức được chứng minh. Dấu "=" xảy ra khi $a=b=c$.

=== PA.41@p251
- bai: 41 · y: - · trang: 251 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Bu-nhi-a-cốp-xki
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ở lời giải sách, bất đẳng thức (3) in $\dfrac{1}{c^2+a^2+1}\le\dfrac{b^2}{a^2+b^2+c^2+6}$ — thiếu $+2$ ở tử số (đúng là $\dfrac{b^2+2}{a^2+b^2+c^2+6}$); lỗi in, không ảnh hưởng kết luận.
## DE
Cho $a,b,c>0$ thỏa mãn $ab+bc+ca=3$. Chứng minh rằng: $\dfrac{1}{a^2+b^2+1}+\dfrac{1}{b^2+c^2+1}+\dfrac{1}{c^2+a^2+1}\le1$
## SACH
Bài toán phụ: Chứng minh rằng: $(ax+by+cz)^2\le(a^2+b^2+c^2)(x^2+y^2+z^2)$ (*)
Giải: $(*)\Leftrightarrow(ay-bx)^2+(bz-cy)^2+(cx-az)^2\ge0$ (BĐT đúng)
Áp dụng bài toán phụ, ta có:
$(a\cdot1+b\cdot1+c\cdot1)^2\le(a^2+b^2+1^2)(1^2+1^2+c^2)$
$\Rightarrow a^2+b^2+c^2+2(ab+bc+ca)\le(a^2+b^2+1)(c^2+2)$
Do đó: $\dfrac{1}{a^2+b^2+1}\le\dfrac{c^2+2}{a^2+b^2+c^2+6}$ (1)
Tương tự, ta có: $\dfrac{1}{b^2+c^2+1}\le\dfrac{a^2+2}{a^2+b^2+c^2+6}$ (2)
$\dfrac{1}{c^2+a^2+1}\le\dfrac{b^2}{a^2+b^2+c^2+6}$ (3)
Từ (1), (2) và (3) ta có điều phải chứng minh
Dấu "=" xảy ra $\Leftrightarrow a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $a^2+b^2+1$ gợi ra bất đẳng thức Bu-nhi-a-cốp-xki với hai bộ số $(a;b;1)$ và $(1;1;c)$: vế trái của nó là $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$ nên dùng được giả thiết $ab+bc+ca=3$.

**Bước 1.** Chứng minh bổ đề $(ax+by+cz)^2\le(a^2+b^2+c^2)(x^2+y^2+z^2)$ bằng cách xét hiệu hai vế, hiệu này là tổng ba bình phương.

**Bước 2.** Áp dụng bổ đề cho hai bộ số $(a;b;1)$ và $(1;1;c)$ rồi thay $ab+bc+ca=3$ để vế trái chỉ còn $a^2+b^2+c^2+6$.

**Bước 3.** Từ bất đẳng thức vừa có, chia hai vế cho tích hai số dương để đánh giá $\dfrac{1}{a^2+b^2+1}$ bằng một phân thức có mẫu chung $a^2+b^2+c^2+6$.

**Bước 4.** Viết hai bất đẳng thức tương tự bằng cách hoán vị vòng quanh rồi cộng lại, tử số cộng thành đúng mẫu chung.

**Chú ý:** Dấu "=" xảy ra khi $a=b=c=1$ (thỏa $ab+bc+ca=3$); khi đó cả ba bất đẳng thức thành đẳng thức.

**Phần 2. Trình bày**

Bổ đề: với mọi số thực $a,b,c,x,y,z$ ta có $(ax+by+cz)^2\le(a^2+b^2+c^2)(x^2+y^2+z^2)$ (*).

Thật vậy, $(a^2+b^2+c^2)(x^2+y^2+z^2)-(ax+by+cz)^2=(ay-bx)^2+(bz-cy)^2+(cx-az)^2\ge0$.

Áp dụng (*) cho hai bộ số $(a;b;1)$ và $(1;1;c)$:

$(a\cdot1+b\cdot1+1\cdot c)^2\le(a^2+b^2+1^2)(1^2+1^2+c^2)$

$\Rightarrow(a+b+c)^2\le(a^2+b^2+1)(c^2+2)$

Vì $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)=a^2+b^2+c^2+6$ nên

$a^2+b^2+c^2+6\le(a^2+b^2+1)(c^2+2)$

$\Rightarrow\dfrac{1}{a^2+b^2+1}\le\dfrac{c^2+2}{a^2+b^2+c^2+6}$ (1)

Hoán vị vòng quanh $a\to b\to c\to a$ ta được

$\dfrac{1}{b^2+c^2+1}\le\dfrac{a^2+2}{a^2+b^2+c^2+6}$ (2)

$\dfrac{1}{c^2+a^2+1}\le\dfrac{b^2+2}{a^2+b^2+c^2+6}$ (3)

Cộng (1), (2), (3) theo vế:

$\dfrac{1}{a^2+b^2+1}+\dfrac{1}{b^2+c^2+1}+\dfrac{1}{c^2+a^2+1}\le\dfrac{(a^2+b^2+c^2)+6}{a^2+b^2+c^2+6}=1$

Vậy bất đẳng thức được chứng minh. Dấu "=" xảy ra khi $a=b=c=1$.

=== PA.42@p251
- bai: 42 · y: - · trang: 251 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: tổng các số không âm bằng 0
- kiem: khong
- ket_qua_sach: x=y=z=0
- dap_an: $x=y=z=0$
- ghi_chu_nghi: Ở lời giải sách (theo bản scan) tử số của hai phân thức sau in $y^2z^2+2y^2+3z^2$ và $z^2x^2+3z^2+4x^2$; tính lại được $y^2z^2+2y^2+z^2$ và $z^2x^2+3z^2+x^2$ (vì $y^2(z^2+3)-(y^2-z^2)=y^2z^2+2y^2+z^2$ và $z^2(x^2+4)-(z^2-x^2)=z^2x^2+3z^2+x^2$) — không ảnh hưởng kết luận $x=y=z=0$. Nhóm chưa chắc: đặt ở $T18T010102$ (tìm các ẩn bằng tổng các số không âm bằng $0$), có thể là $T18T020101$.
## DE
Tìm $x,y,z$ biết: $x^2+y^2+z^2=\dfrac{x^2-y^2}{y^2+2}+\dfrac{y^2-z^2}{z^2+3}+\dfrac{z^2-x^2}{x^2+4}$
## SACH
$x^2+y^2+z^2=\dfrac{x^2-y^2}{y^2+2}+\dfrac{y^2-z^2}{z^2+3}+\dfrac{z^2-x^2}{x^2+4}$
$\Leftrightarrow x^2-\dfrac{x^2-y^2}{y^2+2}+y^2-\dfrac{y^2-z^2}{z^2+3}+z^2-\dfrac{z^2-x^2}{x^2+4}=0$
$\Leftrightarrow\dfrac{x^2y^2+x^2+y^2}{y^2+2}+\dfrac{y^2z^2+2y^2+3z^2}{z^2+3}+\dfrac{z^2x^2+3z^2+4x^2}{x^2+4}=0$
$\Leftrightarrow x=y=z=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển hết sang một vế và ghép mỗi bình phương $x^2$, $y^2$, $z^2$ với phân thức đi cùng, mỗi nhóm thành một phân thức có tử là tổng các số hạng không âm và mẫu dương; tổng ba số không âm bằng $0$ thì từng số bằng $0$.

**Bước 1.** Chuyển vế rồi ghép $x^2$ với $\dfrac{x^2-y^2}{y^2+2}$, ghép $y^2$ với $\dfrac{y^2-z^2}{z^2+3}$ và ghép $z^2$ với $\dfrac{z^2-x^2}{x^2+4}$.

**Bước 2.** Quy đồng từng nhóm; tử số của mỗi nhóm khai triển thành tổng các số hạng dạng $x^2y^2$, $x^2$, $y^2$ (đều không âm).

**Bước 3.** Vì các mẫu $y^2+2$, $z^2+3$, $x^2+4$ đều dương nên ba phân thức đều không âm; tổng của chúng bằng $0$ nên cả ba đều bằng $0$.

**Bước 4.** Từ mỗi tử số bằng $0$ suy ra các bình phương tương ứng cùng bằng $0$, rồi kết luận giá trị của $x,y,z$.

**Chú ý:** Phải chỉ rõ mọi số hạng ở tử số không âm — chỉ khi đó mới kết luận được từng phân thức bằng $0$ từ tổng bằng $0$.

**Phần 2. Trình bày**

$x^2+y^2+z^2=\dfrac{x^2-y^2}{y^2+2}+\dfrac{y^2-z^2}{z^2+3}+\dfrac{z^2-x^2}{x^2+4}$

$\Leftrightarrow\left(x^2-\dfrac{x^2-y^2}{y^2+2}\right)+\left(y^2-\dfrac{y^2-z^2}{z^2+3}\right)+\left(z^2-\dfrac{z^2-x^2}{x^2+4}\right)=0$

$\Leftrightarrow\dfrac{x^2y^2+x^2+y^2}{y^2+2}+\dfrac{y^2z^2+2y^2+z^2}{z^2+3}+\dfrac{z^2x^2+3z^2+x^2}{x^2+4}=0$ (*)

Mỗi tử số là tổng các số hạng không âm, mỗi mẫu số dương, nên mỗi phân thức ở vế trái của (*) không âm. Tổng ba số không âm bằng $0$ khi và chỉ khi cả ba số bằng $0$:

$x^2y^2+x^2+y^2=0$, $y^2z^2+2y^2+z^2=0$, $z^2x^2+3z^2+x^2=0$.

Tử số thứ nhất bằng $0$ nên $x^2=y^2=0$; tử số thứ hai bằng $0$ nên $y^2=z^2=0$.

Vậy $x=y=z=0$ (thử lại: hai vế cùng bằng $0$).

=== PA.43@p252
- bai: 43 · y: - · trang: 252 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất biến (tính chẵn lẻ)
- kiem: khong
- ket_qua_sach: Không
- dap_an: Không (hai cặp đỉnh đối xứng $A,D$ và $C,G$ đòi hỏi số lần đổi màu khác tính chẵn lẻ)
- ghi_chu_nghi: Đề gốc có hình lục giác đều $ABCDEG$: đỉnh $A$ ở trên cùng, rồi theo chiều kim đồng hồ là $B$, $C$, $D$ (dưới cùng), $E$, $G$; tâm $O$; các đường chéo $AD$, $GC$ vẽ nét đứt. Lời đề đủ nghĩa không cần hình. Dạng bài bất biến / tô màu — không khớp nhóm nào trong bản đồ, đặt $T18T000000$.
## DE
Cho lục giác đều $ABCDEG$ trong đó đỉnh $A$ được tô đỏ, các đỉnh còn lại được tô xanh. Người ta đổi màu các đỉnh của lục giác theo quy tắc sau: mỗi lần đổi màu đồng thời ba đỉnh liên tiếp (xanh thành đỏ, đỏ thành xanh). Hỏi sau một số lần đổi màu có thể đạt được đỉnh $B$ được tô đỏ, các đỉnh còn lại được tô xanh hay không?
## SACH
Xét hai đỉnh đối xứng qua tâm $O$ của lục giác đều $ABCDEG$.
Mỗi lần đổi màu một và chỉ một trong hai đỉnh đó đổi màu. Lúc đầu $A$ tô đỏ, $D$ tô xanh. Muốn được $A$ và $D$ cùng tô xanh thì cần một số lẻ lần đổi màu. Lúc đầu $C$ tô xanh, $G$ tô xanh. Muốn được $C$ và $G$ cùng tô xanh thì cần một số chẵn lần đổi màu. Như vậy không thể nào xảy ra cả bốn đỉnh $A$, $D$, $C$, $G$ cùng tô màu xanh được.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai đỉnh đối xứng qua tâm cách nhau ba cạnh nên ba đỉnh liên tiếp luôn chứa đúng một đỉnh của mỗi cặp đối xứng; vì vậy số lần đổi màu của hai đỉnh trong cùng một cặp luôn có tổng bằng số lần thực hiện thao tác, và hai cặp khác nhau bị buộc vào cùng một tính chẵn lẻ.

**Bước 1.** Chia sáu đỉnh thành ba cặp đối xứng $(A,D)$, $(B,E)$, $(C,G)$ và chỉ ra ba đỉnh liên tiếp bất kì chứa đúng một đỉnh của mỗi cặp.

**Bước 2.** Gọi $N$ là số lần thực hiện thao tác, suy ra tổng số lần đổi màu của hai đỉnh trong mỗi cặp bằng $N$.

**Bước 3.** Xét cặp $(A,D)$ với trạng thái cuối cùng cần đạt: đối chiếu màu đầu và màu cuối của từng đỉnh để biết tổng số lần đổi màu là chẵn hay lẻ, từ đó suy ra tính chẵn lẻ của $N$.

**Bước 4.** Làm tương tự với cặp $(C,G)$ rồi so sánh hai kết luận về tính chẵn lẻ của $N$.

**Chú ý:** Cách nhìn khác: trong bốn đỉnh $A,C,D,G$, mỗi lần đổi màu đổi màu đúng hai đỉnh, nên số đỉnh đỏ trong bốn đỉnh đó luôn giữ nguyên tính chẵn lẻ (bất biến).

**Phần 2. Trình bày**

Các đỉnh theo thứ tự $A,B,C,D,E,G$; ba cặp đỉnh đối xứng qua tâm là $(A,D)$, $(B,E)$, $(C,G)$.

Hai đỉnh đối xứng cách nhau ba cạnh nên ba đỉnh liên tiếp không chứa cả hai đỉnh của cùng một cặp; ba đỉnh đó thuộc ba cặp khác nhau. Do đó mỗi lần đổi màu, trong mỗi cặp có đúng một đỉnh đổi màu.

Giả sử sau $N$ lần đổi màu ta đạt được trạng thái $B$ đỏ và các đỉnh còn lại xanh. Khi đó tổng số lần đổi màu của hai đỉnh trong mỗi cặp đều bằng $N$.

Cặp $(A,D)$: $A$ đi từ đỏ sang xanh nên đổi màu một số lẻ lần; $D$ đi từ xanh về xanh nên đổi màu một số chẵn lần. Tổng lẻ, do đó $N$ là số lẻ.

Cặp $(C,G)$: $C$ và $G$ đều đi từ xanh về xanh nên mỗi đỉnh đổi màu một số chẵn lần. Tổng chẵn, do đó $N$ là số chẵn.

Hai kết luận mâu thuẫn nhau.

Vậy không thể đạt được trạng thái $B$ đỏ và các đỉnh còn lại xanh.

=== PA.44@p252
- bai: 44 · y: - · trang: 252 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất biến (tính chẵn lẻ) · chia nhóm theo số dư
- kiem: khong
- ket_qua_sach: Không
- dap_an: Không (số dấu "$-$" ở hai nhóm đỉnh $A_2,A_5,A_8,A_{11}$ và $A_3,A_6,A_9,A_{12}$ luôn cùng tính chẵn lẻ)
- ghi_chu_nghi: Dạng bài bất biến — không khớp nhóm nào trong bản đồ, đặt $T18T000000$. Sách in "nhóm II, nhóm III khác đỉnh chẵn lẻ về số dấu" (lỗi in, nghĩa là khác tính chẵn lẻ).
## DE
Tại đỉnh $A_1$ của đa giác đều $12$ cạnh $A_1A_2\dots A_{12}$ ta viết dấu $(-)$, các đỉnh còn lại viết dấu $(+)$. Mỗi lần cho phép lấy ra ba đỉnh liên tiếp và đổi dấu đồng thời các đỉnh đó. Hỏi sau hữu hạn bước có thể nhận được kết quả là đỉnh $A_2$ mang dấu $(-)$ còn các đỉnh khác mang dấu $(+)$ được không?
## SACH
Chia các đỉnh của các đa giác thành ba nhóm: $\{A_1;A_4;A_7;A_{10}\}$, $\{A_2;A_5;A_8;A_{11}\}$, $\{A_3;A_6;A_9;A_{12}\}$
Chọn $3$ đỉnh liên tiếp thì mỗi đỉnh vào $1$ nhóm
Do vậy số dấu "$-$" trong mỗi nhóm $+1$ hoặc $-1$.
Mà nhóm II, nhóm III cùng tính chẵn, lẻ về số dấu "$-$".
Khi bắt đầu thì nhóm II, nhóm III số dấu "$-$" bằng $0$. Nếu đỉnh $A_2$ mang dấu "$-$" các đỉnh còn lại mang dấu "$+$" thì nhóm II, nhóm III khác đỉnh chẵn lẻ về số dấu "$-$". Mâu thuẫn!
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia $12$ đỉnh thành ba nhóm theo số dư của chỉ số khi chia cho $3$; ba đỉnh liên tiếp luôn thuộc ba nhóm khác nhau, nên mỗi lần đổi dấu làm số dấu "$-$" của từng nhóm đổi đúng một đơn vị, tức đổi tính chẵn lẻ của cả ba nhóm cùng lúc.

**Bước 1.** Chia các đỉnh thành ba nhóm theo số dư của chỉ số khi chia cho $3$ (nhóm I: dư $1$, nhóm II: dư $2$, nhóm III: dư $0$).

**Bước 2.** Chỉ ra ba đỉnh liên tiếp bất kì (kể cả các bộ "vòng quanh" như $A_{11},A_{12},A_1$) đều có đúng một đỉnh ở mỗi nhóm, nhờ $12$ chia hết cho $3$.

**Bước 3.** Suy ra mỗi lần đổi dấu, số dấu "$-$" của mỗi nhóm tăng $1$ hoặc giảm $1$, nên tính chẵn lẻ của số dấu "$-$" ở nhóm II và nhóm III cùng đổi sau mỗi bước và luôn giống nhau (đại lượng bất biến).

**Bước 4.** Đối chiếu bất biến đó với trạng thái cần đạt, trong đó hai nhóm II và III có số dấu "$-$" khác tính chẵn lẻ.

**Chú ý:** Việc $12$ chia hết cho $3$ là điều kiện để cách chia nhóm này đúng với cả các bộ ba đỉnh liên tiếp đi vòng qua $A_{12}$ và $A_1$.

**Phần 2. Trình bày**

Chia $12$ đỉnh thành ba nhóm: $\mathrm{I}=\{A_1;A_4;A_7;A_{10}\}$, $\mathrm{II}=\{A_2;A_5;A_8;A_{11}\}$, $\mathrm{III}=\{A_3;A_6;A_9;A_{12}\}$ (đỉnh $A_i$ thuộc nhóm theo số dư của $i$ khi chia cho $3$).

Vì $12$ chia hết cho $3$ nên ba đỉnh liên tiếp bất kì (kể cả $A_{11},A_{12},A_1$ và $A_{12},A_1,A_2$) có chỉ số dư $1,2,0$ theo một thứ tự nào đó, tức gồm đúng một đỉnh của mỗi nhóm.

Mỗi lần đổi dấu, mỗi nhóm có đúng một đỉnh đổi dấu, nên số dấu "$-$" của nhóm đó tăng $1$ hoặc giảm $1$; tính chẵn lẻ của nó đổi.

Cả ba nhóm cùng đổi tính chẵn lẻ sau mỗi bước, mà lúc đầu số dấu "$-$" của nhóm II và nhóm III cùng bằng $0$ (cùng chẵn). Vậy sau mọi bước, số dấu "$-$" của nhóm II và nhóm III luôn cùng tính chẵn lẻ.

Nếu đạt được trạng thái chỉ có $A_2$ mang dấu "$-$" thì nhóm II có $1$ dấu "$-$" (lẻ) còn nhóm III có $0$ dấu "$-$" (chẵn): khác tính chẵn lẻ. Mâu thuẫn.

Vậy không thể nhận được kết quả đó.

=== PA.45@p252
- bai: 45 · y: - · trang: 252 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét các trường hợp · đếm số đỉnh một màu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Giữ cả bài thành một câu vì ý b) dùng kết quả ý a) ("Áp dụng a)"). Đề trải sang trang 253 (từ "các đỉnh đều được tô màu"). Ở lời giải sách, dãy biến đổi cho trường hợp ĐĐXX in "ĐĐXX → ĐVVX → XXVV → XĐĐX → VVĐX → VVVV"; tính lại bước thứ ba phải là XXVX (từ ĐVVX, thao tác trên hai đỉnh đầu Đ,V thành X,X). Cách làm ý a) của sách đi từ hai đỉnh kề $A_1,A_2$ khác màu rồi loại dần các đỉnh vàng; lời giải kho loại màu vàng bằng cách chọn mỗi lần một cặp (vàng, không vàng) kề nhau — cùng ý. Nhóm bất biến / tô màu: đặt $T18T000000$.
## DE
Cho đa giác đều $n$ cạnh. Dùng $3$ màu xanh, đỏ, vàng tô màu các đỉnh đa giác một cách tùy ý (mỗi đỉnh được tô bởi một màu và tất cả các đỉnh đều được tô màu). Cho phép thực hiện thao tác sau đây: chọn hai đỉnh kề nhau bất kì (nghĩa là hai đỉnh liên tiếp) khác màu và thay màu của hai đỉnh đó bằng màu còn lại.

a) Chứng minh rằng bằng cách thực hiện thao tác trên một số lần ta luôn luôn làm cho các đỉnh của đa giác chỉ còn được tô bởi hai màu.

b) Chứng minh rằng với $n=4$ và $n=8$, bằng cách thực hiện thao tác trên một số lần ta có thể làm cho các đỉnh của đa giác chỉ còn được tô bởi một màu.
## SACH
a) Giả sử có đa giác đều $n$ cạnh là $A_1A_2\dots A_n$ (ta sắp xếp các đỉnh trên một đường tròn, các đỉnh thứ tự theo chiều quay của kim đồng hồ). Vì dùng $3$ màu nên tìm được $2$ đỉnh kề nhau khác màu.
Không mất tính tổng quát giả sử đó là $A_1,A_2$ và được tô màu xanh, màu vàng. Thao tác tô lần I ta được $A_1,A_2$ tô màu đỏ chúng ta sẽ chứng tỏ bằng cách thực hiện thao tác tô màu này sẽ làm cho các đỉnh của đa giác chỉ còn tô bởi hai màu đỏ và xanh. Thật vậy, xét các đỉnh $A_3,A_4,\dots,A_n$ đến đỉnh được tô màu vàng đầu tiên là $A_j$ ($3\le j\le n$), ta có đỉnh $A_{j-1},A_j$ sẽ có màu xanh hoặc màu đỏ. Cứ như thế tiếp tục đối với các đỉnh tô màu vàng tiếp theo cho đến đỉnh tô vàng cuối cùng. Như vậy, chúng ta có được đa giác mà các đỉnh chỉ còn được tô bởi hai màu xanh và đỏ.
b) * Với $n=4$
Áp dụng a) ta có được các đỉnh $A_1,A_2,A_3,A_4$ chỉ còn được tô bởi hai màu. Không mất tính tổng quát đó là xanh và đỏ. Xảy ra các kiểu bộ $4$ đỉnh liên tiếp là ĐXĐX, ĐĐXX, ĐĐĐX, ĐĐXĐ (Đ là đỏ, X là xanh, V là vàng)
• Xét trường hợp ĐXĐX. Thao tác tô như sau: ĐXĐX → VVĐX → VVVV
• Xét trường hợp ĐĐXX. Thao tác tô như sau: ĐĐXX → ĐVVX → XXVV → XĐĐX → VVĐX → VVVV
• Xét trường hợp ĐĐĐX. Thao tác tô như sau: ĐĐĐX → ĐĐVV → XXXX (theo trường hợp 2)
• Xét trường hợp ĐĐXĐ. Thao tác tô như sau: ĐĐXĐ → ĐVVĐ → XXVĐ → XXXX
Như vậy chúng ta đã chuyển màu của $4$ đỉnh liên tiếp về cùng $1$ màu.
* Với $n=8$. Chia $8$ đỉnh thành $2$ bộ, mỗi bộ $4$ đỉnh
Áp dụng trên, ta có được mỗi bộ $4$ đỉnh được tô cùng $1$ màu
– Nếu màu của hai bộ $4$ đỉnh giống nhau. Ta có $8$ đỉnh tô cùng màu
– Nếu màu của hai bộ $4$ đỉnh khác nhau. Giả sử là ĐĐĐĐXXXX. Thao tác tô như sau: ĐĐĐĐXXXX → ĐĐĐVVXXX → VVVVVVVV theo $n=4$).
Như vậy chúng ta đã chuyển màu của $8$ đỉnh về cùng $1$ màu.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thao tác biến hai đỉnh kề khác màu thành màu thứ ba; chọn cặp gồm một đỉnh vàng và một đỉnh không vàng thì cả hai thành màu không vàng, nên số đỉnh vàng giảm đúng $1$ — lặp lại để loại hẳn một màu; còn với bốn đỉnh liên tiếp chỉ có hai màu, ta liệt kê các dạng và đưa từng dạng về một màu bằng các thao tác ngay trong bốn đỉnh đó.

**Bước 1.** Ý a): nếu mới chỉ có hai màu thì xong; nếu đủ ba màu thì chỉ ra luôn có hai đỉnh kề nhau, một vàng một không vàng, rồi thực hiện thao tác trên cặp đó để số đỉnh vàng giảm một.

**Bước 2.** Lặp lại thao tác ở bước 1 đến khi không còn đỉnh vàng, và giải thích vì sao luôn còn tìm được cặp (vàng, không vàng) kề nhau.

**Bước 3.** Ý b): chứng minh bổ đề rằng bốn đỉnh liên tiếp chỉ tô hai màu thì dùng thao tác ngay trong bốn đỉnh đó đưa được về một màu, bằng cách xét các dạng tô màu của bốn đỉnh.

**Bước 4.** Với $n=4$: dùng ý a) để còn hai màu rồi áp dụng bổ đề cho cả bốn đỉnh.

**Bước 5.** Với $n=8$: dùng ý a), áp dụng bổ đề cho hai nửa $A_1A_2A_3A_4$ và $A_5A_6A_7A_8$; nếu hai nửa khác màu thì một thao tác ở chỗ nối biến mỗi nửa thành dạng "ba đỉnh một màu, một đỉnh màu kia" rồi dùng lại bổ đề.

**Chú ý:** Ở bốn đỉnh liên tiếp không được dùng cặp $(u_4,u_1)$ (đỉnh cuối với đỉnh đầu) vì với $n=8$ hai đỉnh này không kề nhau; mọi dãy thao tác trong bổ đề chỉ dùng các cặp $(u_1,u_2)$, $(u_2,u_3)$, $(u_3,u_4)$.

**Phần 2. Trình bày**

**a)** Gọi ba màu là xanh, đỏ, vàng. Nếu đa giác đã chỉ dùng không quá hai màu thì xong. Giả sử cả ba màu đều xuất hiện; ta sẽ loại dần màu vàng.

Khi còn đỉnh vàng và có đỉnh không vàng, đi một vòng quanh đa giác ta gặp hai đỉnh kề nhau mà một đỉnh vàng, một đỉnh không vàng (xanh hoặc đỏ). Hai đỉnh này khác màu nên được phép thao tác trên chúng.

Nếu cặp là (vàng, xanh) thì cả hai thành đỏ; nếu cặp là (vàng, đỏ) thì cả hai thành xanh. Trong cả hai trường hợp, cả hai đỉnh đều thành màu không vàng. Vậy sau thao tác, số đỉnh vàng giảm đúng $1$ và số đỉnh không vàng tăng $1$ (nên luôn còn đỉnh không vàng).

Lặp lại thao tác đó, sau hữu hạn bước không còn đỉnh vàng. Khi đó đa giác chỉ được tô bởi hai màu xanh và đỏ.

**b)** Bổ đề. Bốn đỉnh liên tiếp $u_1,u_2,u_3,u_4$ (theo thứ tự trên đa giác) chỉ được tô bởi hai màu. Chỉ dùng thao tác trên các cặp $(u_1,u_2)$, $(u_2,u_3)$, $(u_3,u_4)$ ta đưa được cả bốn đỉnh về một màu. Hơn nữa, nếu ba đỉnh cùng màu $P$ còn một đỉnh màu $Q$ thì màu cuối cùng là $Q$.

Chứng minh. Gọi hai màu đang dùng là $P$, $Q$ và màu còn lại là $R$; ghi màu bốn đỉnh theo thứ tự, ví dụ $PPQQ$. Mỗi thao tác trên cặp $(P,Q)$ biến cả hai thành $R$; trên cặp $(P,R)$ thành $Q$; trên cặp $(Q,R)$ thành $P$.

(i) Nếu $u_1,u_2$ khác màu và $u_3,u_4$ khác màu (các dạng $PQPQ$, $PQQP$, $QPPQ$, $QPQP$): thao tác trên $(u_1,u_2)$ rồi trên $(u_3,u_4)$ cho cả bốn đỉnh màu $R$. Ví dụ $PQQP\to RRQP\to RRRR$.

(ii) Dạng $PPQQ$: $PPQQ\to PRRQ\to QQRQ\to QPPQ\to RRPQ\to RRRR$. Dạng $QQPP$ làm tương tự (đổi vai $P$ và $Q$): $QQPP\to QRRP\to PPRP\to PQQP\to RRQP\to RRRR$.

(iii) Dạng "ba một", đỉnh lẻ màu $Q$ và ba đỉnh còn lại màu $P$:

$QPPP$ và $PQPP$: thao tác trên $(u_1,u_2)$ cho $RRPP$, đó là dạng (ii) với hai màu $R,P$ nên về màu thứ ba là $Q$.

$PPQP$: thao tác trên $(u_2,u_3)$ cho $PRRP$, đó là dạng (i) với hai màu $P,R$ nên về màu thứ ba là $Q$.

$PPPQ$: thao tác trên $(u_3,u_4)$ cho $PPRR$, đó là dạng (ii) với hai màu $P,R$ nên về màu thứ ba là $Q$.

Vậy mọi dạng có hai màu (kể cả khi đổi vai $P$ và $Q$) đều được đưa về một màu, và dạng "ba một" cho màu của đỉnh lẻ. Bổ đề được chứng minh.

Với $n=4$: theo a), các đỉnh chỉ còn được tô bởi không quá hai màu; áp dụng bổ đề cho bốn đỉnh $A_1,A_2,A_3,A_4$ ta đưa được cả bốn đỉnh về một màu.

Với $n=8$: theo a), tám đỉnh chỉ còn được tô bởi không quá hai màu. Áp dụng bổ đề lần lượt cho $A_1A_2A_3A_4$ và $A_5A_6A_7A_8$, mỗi bộ bốn đỉnh được tô cùng một màu.

Nếu hai bộ cùng màu thì xong.

Nếu hai bộ khác màu, gọi $P$ là màu của bộ đầu, $Q$ là màu của bộ sau và $R$ là màu còn lại; ta có $PPPPQQQQ$. Thao tác trên hai đỉnh kề $A_4,A_5$ (màu $P,Q$) cho $PPPRRQQQ$.

Bộ $A_1A_2A_3A_4$ khi đó có dạng $PPPR$ ("ba một" với đỉnh lẻ màu $R$) nên theo bổ đề được đưa về màu $R$; bộ $A_5A_6A_7A_8$ có dạng $RQQQ$ ("ba một" với đỉnh lẻ màu $R$) cũng được đưa về màu $R$.

Vậy cả tám đỉnh đều được tô cùng màu $R$. Như vậy với $n=4$ và $n=8$ ta đều đưa được các đỉnh về một màu.

