=== C4B.27@p134
- bai: 27 · y: - · trang: 134 · tang: nang_cao
- nguon_de: HSG tỉnh Cà Mau 2016 – 2017
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si ba số (a+b+c)(1/a+1/b+1/c)≥9 · a²+b²+c²≥ab+bc+ca · Cô-si hai số u+1/u≥2 · đặt ẩn phụ
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(HSG tỉnh Cà Mau 2016 – 2017) Cho $a,b,c>0$. Chứng minh: $\dfrac{ab+bc+ca}{a^2+b^2+c^2}+\dfrac{(a+b+c)^3}{abc}\ge28$.
## SACH
Với $x,y,z>0$. Ta có:

$\dfrac{x}{y}+\dfrac{y}{x}\ge2$ (1); $\dfrac1x+\dfrac1y+\dfrac1z\ge\dfrac{9}{x+y+z}$ (2);

$x^2+y^2+z^2\ge xy+yz+zx\Leftrightarrow\dfrac{x^2+y^2+z^2}{xy+yz+zx}\ge1$ (3)

Xảy ra đẳng thức ở (1), (2), (3) $\Leftrightarrow x=y=z$. Ta có:

$P=\dfrac{ab+bc+ca}{a^2+b^2+c^2}+(a+b+c)^2\cdot\dfrac{a+b+c}{abc}$

$=\dfrac{ab+bc+ca}{a^2+b^2+c^2}+(a^2+b^2+c^2+2ab+2bc+2ca)\dfrac{a+b+c}{abc}$

Áp dụng các bất đẳng thức (1), (2), (3) ta được:

$P\ge\dfrac{ab+bc+ca}{a^2+b^2+c^2}+(a^2+b^2+c^2)\cdot\dfrac{9}{ab+bc+ca}+2\cdot9$

$=\left(\dfrac{ab+bc+ca}{a^2+b^2+c^2}+\dfrac{a^2+b^2+c^2}{ab+bc+ca}\right)+8\cdot\dfrac{a^2+b^2+c^2}{ab+bc+ca}+18$

$\ge2+8+18=28$

Dấu "=" xảy ra $\Leftrightarrow\begin{cases}a^2+b^2+c^2=ab+bc+ca\\ab=bc=ca\end{cases}\Leftrightarrow a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hạng tử $\dfrac{(a+b+c)^3}{abc}$ chứa thừa số $\dfrac{a+b+c}{abc}=\dfrac1{ab}+\dfrac1{bc}+\dfrac1{ca}$ nên dùng được hệ quả Cô-si $(p+q+r)\left(\dfrac1p+\dfrac1q+\dfrac1r\right)\ge9$ cho ba số $ab,bc,ca$; sau đó mọi thứ quy về đại lượng $u=\dfrac{a^2+b^2+c^2}{ab+bc+ca}\ge1$, và dấu "=" xảy ra ở $u=1$, tức $a=b=c$.

**Bước 1.** Viết $(a+b+c)^3=(a+b+c)\cdot\left[(a^2+b^2+c^2)+2(ab+bc+ca)\right]$ để hạng tử thứ hai tách thành hai phần, mỗi phần đều chứa nhân tử $\dfrac{a+b+c}{abc}$.

**Bước 2.** Chặn dưới $\dfrac{a+b+c}{abc}$ bằng $\dfrac{9}{ab+bc+ca}$ nhờ hệ quả Cô-si áp dụng cho ba số dương $ab,bc,ca$, rồi nhân với các nhân tử dương $a^2+b^2+c^2$ và $2(ab+bc+ca)$.

**Bước 3.** Đặt $u=\dfrac{a^2+b^2+c^2}{ab+bc+ca}$ để cả bất đẳng thức chỉ còn một biến, và ghi nhận $u\ge1$ vì $a^2+b^2+c^2\ge ab+bc+ca$.

**Bước 4.** Tách $9u=u+8u$, dùng Cô-si hai số cho nhóm $\dfrac1u+u$ và dùng $u\ge1$ cho nhóm $8u$; cả hai đều đạt dấu "=" khi $u=1$.

**Chú ý:** Phải nêu rõ $ab,bc,ca>0$ khi dùng hệ quả Cô-si ba số, và $u\ge1$ chứ không chỉ $u>0$, nếu không bước $8u\ge8$ không có.

**Phần 2. Trình bày**

Với $a,b,c>0$, đặt $u=\dfrac{a^2+b^2+c^2}{ab+bc+ca}$. Vì $a^2+b^2+c^2\ge ab+bc+ca$ nên $u\ge1$.

Áp dụng hệ quả của bất đẳng thức Cô-si cho ba số dương $ab,bc,ca$: $(ab+bc+ca)\left(\dfrac1{ab}+\dfrac1{bc}+\dfrac1{ca}\right)\ge9$. Mà $\dfrac1{ab}+\dfrac1{bc}+\dfrac1{ca}=\dfrac{a+b+c}{abc}$ nên $\dfrac{a+b+c}{abc}\ge\dfrac{9}{ab+bc+ca}$ (1)

Ta có $\dfrac{(a+b+c)^3}{abc}=\dfrac{a+b+c}{abc}\cdot\left[(a^2+b^2+c^2)+2(ab+bc+ca)\right]$

Dùng (1) (hai nhân tử trong ngoặc đều dương): $\dfrac{(a+b+c)^3}{abc}\ge\dfrac{9(a^2+b^2+c^2)}{ab+bc+ca}+18=9u+18$

Do đó vế trái $\ge\dfrac1u+9u+18=\left(u+\dfrac1u\right)+8u+18$

Theo Cô-si hai số, $u+\dfrac1u\ge2$ (vì $u>0$); lại có $u\ge1$ nên $8u\ge8$.

Suy ra vế trái $\ge2+8+18=28$.

Dấu "=" xảy ra khi $a=b=c$ (khi đó $u=1$ và mọi bất đẳng thức dùng ở trên đều thành đẳng thức).

Vậy $\dfrac{ab+bc+ca}{a^2+b^2+c^2}+\dfrac{(a+b+c)^3}{abc}\ge28$.

=== C4B.28@p135
- bai: 28 · y: - · trang: 135 · tang: nang_cao
- nguon_de: HSG tỉnh Hải Dương 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/(p+q)≤(1/4)(1/p+1/q) · hệ quả (a+b)²≥4ab
- kiem: khong
- ket_qua_sach: \dfrac{1}{8}
- dap_an: $GTLN=\dfrac{1}{8}$ khi $x=y=z=3$
- ghi_chu_nghi: 
## DE
(HSG tỉnh Hải Dương 2014 – 2015) Cho các số dương $x,y,z$ thay đổi thỏa mãn: $xy+yz+zx=xyz$. Tìm giá trị lớn nhất của biểu thức: $M=\dfrac{1}{4x+3y+z}+\dfrac{1}{x+4y+3z}+\dfrac{1}{3x+y+4z}$.
## SACH
Có $xy+yz+zx=xyz\Leftrightarrow\dfrac1x+\dfrac1y+\dfrac1z=1$ (1)

Ta chứng minh với $x,y$ dương: $\dfrac{a^2}{x}+\dfrac{b^2}{y}\ge\dfrac{(a+b)^2}{x+y}$ (*)

$\Leftrightarrow\left(\dfrac{a^2}{x}+\dfrac{b^2}{y}\right)(x+y)\ge(a+b)^2\Leftrightarrow a^2\dfrac{y}{x}+b^2\dfrac{x}{y}\ge2ab$

$(ay-bx)^2\ge0$ luôn đúng; Dấu "=" $\Leftrightarrow ay=bx=0\Leftrightarrow a=b\dfrac{x}{y}$.

Áp dụng (*) ta có: $\dfrac{1^2}{y}+\dfrac{1^2}{z}\ge\dfrac{(1+1)^2}{y+z}=\dfrac{2^2}{y+z}$ (Dấu "=" $\Leftrightarrow y:z=1$)

$\Rightarrow\dfrac{2^2}{2y}+\dfrac{2^2}{y+z}\ge\dfrac{(2+2)^2}{3y+z}=\dfrac{4^2}{3y+z}$ (Dấu "=" $\Leftrightarrow2y=y+z\Leftrightarrow y=z$)

$\Rightarrow\dfrac{4^2}{4x}+\dfrac{4^2}{3y+z}\ge\dfrac{(4+4)^2}{4x+3y+z}=\dfrac{64}{4x+3y+z}$ (Dấu "=" $\Leftrightarrow4x=3y+z$)

$\Rightarrow\dfrac{64}{4x+3y+z}\le\dfrac{4^2}{4x}+\dfrac{2^2}{2y}+\dfrac{1^2}{y}+\dfrac{1^2}{z}=\dfrac4x+\dfrac3y+\dfrac1z$

(Dấu "=" $\Leftrightarrow4x=3y+z$ và $y=z\Leftrightarrow x=y=z$)

Tương tự: $\dfrac{64}{x+4y+3z}\le\dfrac1x+\dfrac4y+\dfrac3z$ (Dấu "=" $\Leftrightarrow x=y=z$)

$\dfrac{64}{3x+y+4z}\le\dfrac3x+\dfrac1y+\dfrac4z$ (Dấu "=" $\Leftrightarrow x=y=z$)

$M=\dfrac{1}{4x+3y+z}+\dfrac{1}{x+4y+3z}+\dfrac{1}{3x+y+4z}\le\dfrac18\left(\dfrac1x+\dfrac1y+\dfrac1z\right)=\dfrac18$ (theo (1) khi $x=y=z=3$)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho tổng các nghịch đảo $\dfrac1x+\dfrac1y+\dfrac1z=1$ còn $M$ gồm các nghịch đảo của tổng nhiều biến, nên phải chặn $\dfrac{1}{4x+3y+z}$ từ trên bằng tổng các $\dfrac1x,\dfrac1y,\dfrac1z$ nhờ hệ quả Cô-si $\dfrac1{p+q}\le\dfrac14\left(\dfrac1p+\dfrac1q\right)$ dùng liên tiếp.

**Bước 1.** Biến đổi điều kiện bằng cách chia hai vế cho $xyz>0$ để được $\dfrac1x+\dfrac1y+\dfrac1z=1$, dạng trùng với thứ mà các đánh giá sau sẽ sinh ra.

**Bước 2.** Tách mẫu $4x+3y+z$ thành từng cặp hai số có thể dùng hệ quả $(p+q)^2\ge4pq$: $4x+(3y+z)$, rồi $3y+z=2y+(y+z)$, rồi $y+z$.

**Bước 3.** Thay ngược từ trong ra ngoài để chặn $\dfrac{1}{4x+3y+z}$ bằng $\dfrac1{64}\left(\dfrac4x+\dfrac3y+\dfrac1z\right)$, rồi hoán vị vòng quanh $x\to y\to z\to x$ để có hai đánh giá còn lại.

**Bước 4.** Cộng ba đánh giá để các hệ số của $\dfrac1x,\dfrac1y,\dfrac1z$ cùng bằng $8$, dùng điều kiện ở bước 1, rồi kiểm tra dấu "=" tại $x=y=z=3$.

**Chú ý:** Muốn dấu "=" xảy ra thì mỗi lần dùng hệ quả phải có hai số bằng nhau: $4x=3y+z$, $2y=y+z$, $y=z$; hệ này cho $x=y=z$, hợp với điều kiện ở bước 1.

**Phần 2. Trình bày**

Vì $x,y,z>0$, chia hai vế của $xy+yz+zx=xyz$ cho $xyz$: $\dfrac1x+\dfrac1y+\dfrac1z=1$ (1)

Với $p,q>0$, từ $(p+q)^2\ge4pq$ suy ra $\dfrac1{p+q}\le\dfrac14\left(\dfrac1p+\dfrac1q\right)$ (*), dấu "=" khi $p=q$.

Áp dụng (*): $\dfrac1{y+z}\le\dfrac14\left(\dfrac1y+\dfrac1z\right)$

$\dfrac1{3y+z}=\dfrac1{2y+(y+z)}\le\dfrac14\left(\dfrac1{2y}+\dfrac1{y+z}\right)\le\dfrac1{8y}+\dfrac1{16}\left(\dfrac1y+\dfrac1z\right)=\dfrac{3}{16y}+\dfrac1{16z}$

$\dfrac1{4x+3y+z}\le\dfrac14\left(\dfrac1{4x}+\dfrac1{3y+z}\right)\le\dfrac1{16x}+\dfrac{3}{64y}+\dfrac1{64z}=\dfrac1{64}\left(\dfrac4x+\dfrac3y+\dfrac1z\right)$

Hoán vị vòng quanh $x\to y\to z\to x$: $\dfrac1{x+4y+3z}\le\dfrac1{64}\left(\dfrac1x+\dfrac4y+\dfrac3z\right)$ và $\dfrac1{3x+y+4z}\le\dfrac1{64}\left(\dfrac3x+\dfrac1y+\dfrac4z\right)$

Cộng ba bất đẳng thức: $M\le\dfrac1{64}\cdot8\left(\dfrac1x+\dfrac1y+\dfrac1z\right)=\dfrac18$ (theo (1))

Dấu "=" xảy ra khi $4x=3y+z$, $y=z$, kéo theo $x=y=z$; kết hợp (1) được $x=y=z=3$ (thỏa điều kiện đề, khi đó $M=3\cdot\dfrac1{24}=\dfrac18$).

Vậy $GTLN=\dfrac18$, đạt khi $x=y=z=3$.

=== C4B.29@p136
- bai: 29 · y: - · trang: 136 · tang: nang_cao
- nguon_de: HSG tỉnh Nam Định 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số dạng 1/p+1/q≥4/(p+q) · đổi biến a=x+1, b=y+1, c=z+4
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(HSG tỉnh Nam Định 2014 – 2015) Xét các số thực $x,y,z$ thỏa mãn điều kiện $x+y+z=0$; $x+1>0$; $y+1>0$; $z+4>0$. Chứng minh rằng: $Q=\dfrac{xy-1}{(x+1)(y+1)}+\dfrac{z}{z+4}\le\dfrac{-2}{3}$.
## SACH
$Q=\dfrac{xy-1}{(x+1)(y+1)}+1+\dfrac{z}{z+4}-1=\dfrac{x}{x+1}+\dfrac{y}{y+1}+\dfrac{z}{z+4}-1$.

Đặt $a=x+1$; $b=y+1$; $c=z+4$, ta có $a;b;c>0$ và $a+b+c=6$

$Q=\dfrac{a-1}{a}+\dfrac{b-1}{b}+\dfrac{c-4}{c}-1=2-\left(\dfrac1a+\dfrac1b+\dfrac4c\right)$.

Xét $S=\dfrac1a+\dfrac1b+\dfrac4c\ge\dfrac{4}{a+b}+\dfrac4c\ge\dfrac{16}{a+b+c}=\dfrac83$.

Suy ra $Q=2-S\le2-\dfrac83=-\dfrac23$.

Vậy $Q=\dfrac{xy-1}{(x+1)(y+1)}+\dfrac{z}{z+4}\le-\dfrac23$ khi $x=y=\dfrac12$; $z=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cộng thêm $1$ vào hạng tử đầu thì tử trở thành $2xy+x+y$, đúng bằng $x(y+1)+y(x+1)$, nên biểu thức tách được thành $\dfrac{x}{x+1}+\dfrac{y}{y+1}$; khi đặt các mẫu làm biến mới thì tổng ba biến cố định ($=6$) và chỉ còn phải chặn một tổng nghịch đảo.

**Bước 1.** Viết $Q=\left[\dfrac{xy-1}{(x+1)(y+1)}+1\right]+\dfrac{z}{z+4}-1$ rồi quy đồng ngoặc để thấy nó bằng $\dfrac{x}{x+1}+\dfrac{y}{y+1}$.

**Bước 2.** Đặt $a=x+1$, $b=y+1$, $c=z+4$ để mỗi phân thức có dạng $1-\dfrac{k}{a}$ (với $k$ là hằng số, $a$ là biến mới), đồng thời điều kiện $x+y+z=0$ trở thành $a+b+c=6$ với $a,b,c>0$.

**Bước 3.** Chuyển bài toán thành chặn dưới $S=\dfrac1a+\dfrac1b+\dfrac4c$, bằng cách dùng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ hai lần để các mẫu gộp thành $a+b+c$.

**Bước 4.** Tìm điểm dấu "=" từ hai điều kiện $a=b$ và $a+b=c$ cùng $a+b+c=6$, rồi trả về $x,y,z$.

**Chú ý:** Hệ số $4$ trên tử của $\dfrac4c$ phải đúng như vậy để $\dfrac4{a+b}+\dfrac4c$ ghép được thành $\dfrac{16}{a+b+c}$.

**Phần 2. Trình bày**

$\dfrac{xy-1}{(x+1)(y+1)}+1=\dfrac{2xy+x+y}{(x+1)(y+1)}=\dfrac{x}{x+1}+\dfrac{y}{y+1}$

Do đó $Q=\dfrac{x}{x+1}+\dfrac{y}{y+1}+\dfrac{z}{z+4}-1$

Đặt $a=x+1$, $b=y+1$, $c=z+4$ thì $a,b,c>0$ và $a+b+c=x+y+z+6=6$.

$Q=\left(1-\dfrac1a\right)+\left(1-\dfrac1b\right)+\left(1-\dfrac4c\right)-1=2-S$, với $S=\dfrac1a+\dfrac1b+\dfrac4c$

Với $p,q>0$ có $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (hệ quả của Cô-si, dấu "=" khi $p=q$). Áp dụng hai lần:

$S\ge\dfrac4{a+b}+\dfrac4c=4\left(\dfrac1{a+b}+\dfrac1c\right)\ge4\cdot\dfrac{4}{a+b+c}=\dfrac{16}{6}=\dfrac83$

Suy ra $Q=2-S\le2-\dfrac83=-\dfrac23$.

Dấu "=" xảy ra khi $a=b$ và $a+b=c$, kết hợp $a+b+c=6$ được $a=b=\dfrac32$, $c=3$, tức $x=y=\dfrac12$, $z=-1$ (thỏa các điều kiện của đề).

Vậy $Q\le-\dfrac23$.

=== C4B.30@p137
- bai: 30 · y: - · trang: 137 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Hải Dương 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số p+q≥2√(pq) · đổi biến x=(b+c−a)/2… · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach: 11
- dap_an: $GTNN=11$ khi $a=\dfrac{5}{6};\ b=\dfrac{2}{3};\ c=\dfrac{1}{2}$
- ghi_chu_nghi: Đề in có "≥ 11" ngay sau biểu thức S dù đề hỏi tìm giá trị nhỏ nhất; tôi bỏ "≥ 11" khỏi ## DE (vì lộ đáp số, đề không còn nhất quán), ## SACH giữ nguyên.
## DE
(Chuyên vòng 1 Hải Dương 2014 – 2015) Cho tam giác $ABC$ có chu vi bằng $2$. Kí hiệu $a,b,c$ là độ dài ba cạnh của tam giác. Tìm giá trị nhỏ nhất của biểu thức $S=\dfrac{a}{b+c-a}+\dfrac{4b}{c+a-b}+\dfrac{9c}{a+b-c}$.
## SACH
Đặt $x=\dfrac{b+c-a}{2}$, $y=\dfrac{c+a-b}{2}$, $z=\dfrac{a+b-c}{2}\Rightarrow x,y,z>0$ thỏa mãn.

Ta có: $x+y+z=\dfrac{a+b+c}{2}=1$ và $a=y+z$, $b=z+x$, $c=x+y$.

Khi đó:

$S=\dfrac{y+z}{2x}+\dfrac{4(z+x)}{2y}+\dfrac{9(x+y)}{2z}=\dfrac12\left[\left(\dfrac yx+\dfrac{4x}{y}\right)+\left(\dfrac zx+\dfrac{9x}{z}\right)+\left(\dfrac{4z}{y}+\dfrac{9y}{z}\right)\right]$.

Ta có: $\dfrac yx+\dfrac{4x}y\ge4$; $\dfrac zx+\dfrac{9x}z\ge6$; $\dfrac{4z}y+\dfrac{9y}z\ge12$.

Ta có: $S=\dfrac{a}{b+c-a}+\dfrac{4b}{c+a-b}+\dfrac{9c}{a+b-c}\ge11$

Đẳng thức xảy ra $\Leftrightarrow\dfrac yx=\dfrac{4x}y$, $\dfrac zx=\dfrac{9x}z$, $\dfrac{4z}y=\dfrac{9y}z$

$\Leftrightarrow y=2x$, $z=3x$, $2z=3y\Rightarrow x+y+z=6x=1\Rightarrow x=\dfrac16$, $y=\dfrac13$, $z=\dfrac12$

$\Rightarrow a=\dfrac56$, $b=\dfrac23$, $c=\dfrac12$.

Vậy $S=\dfrac{a}{b+c-a}+\dfrac{4b}{c+a-b}+\dfrac{9c}{a+b-c}\ge11$ khi $a=\dfrac56$; $b=\dfrac23$; $c=\dfrac12$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $b+c-a$, $c+a-b$, $a+b-c$ đều dương (bất đẳng thức tam giác) và có tổng $a+b+c=2$; đặt chúng làm biến mới thì $a,b,c$ là tổng của hai biến, còn $S$ trở thành tổng các tỉ số $\dfrac{\text{biến}}{\text{biến}}$ để ghép cặp Cô-si.

**Bước 1.** Đặt $x=\dfrac{b+c-a}{2}$, $y=\dfrac{c+a-b}{2}$, $z=\dfrac{a+b-c}{2}$, chỉ ra $x,y,z>0$ nhờ bất đẳng thức tam giác và tìm được $a=y+z$, $b=z+x$, $c=x+y$ cùng $x+y+z=1$.

**Bước 2.** Thay vào $S$ rồi gom sáu phân thức thành ba cặp có dạng $\dfrac{p}{q}+\dfrac{k\,q}{p}$, mỗi cặp có tích hai số hạng là một hằng số.

**Bước 3.** Chặn mỗi cặp bằng Cô-si hai số: tích hai số hạng lần lượt là $4$, $9$, $36$ nên các cặp $\ge4$, $\ge6$, $\ge12$; cộng lại rồi chia đôi.

**Bước 4.** Tìm điểm dấu "=" bằng cách cho mỗi cặp có hai số hạng bằng nhau, giải $y=2x$, $z=3x$ rồi dùng $x+y+z=1$ để quay về $a,b,c$.

**Chú ý:** Ba đẳng thức tại bước 4 phải tương thích với nhau ($2z=3y$ suy ra từ $y=2x$ và $z=3x$) thì giá trị nhỏ nhất mới đạt được, nếu không chỉ có bất đẳng thức mà chưa có GTNN.

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh tam giác nên $b+c-a$, $c+a-b$, $a+b-c$ đều dương. Đặt $x=\dfrac{b+c-a}{2}$, $y=\dfrac{c+a-b}{2}$, $z=\dfrac{a+b-c}{2}$, thì $x,y,z>0$, $x+y+z=\dfrac{a+b+c}{2}=1$ và $a=y+z$, $b=z+x$, $c=x+y$.

$S=\dfrac{y+z}{2x}+\dfrac{4(z+x)}{2y}+\dfrac{9(x+y)}{2z}=\dfrac12\left[\left(\dfrac yx+\dfrac{4x}y\right)+\left(\dfrac zx+\dfrac{9x}z\right)+\left(\dfrac{4z}y+\dfrac{9y}z\right)\right]$

Theo bất đẳng thức Cô-si hai số dương: $\dfrac yx+\dfrac{4x}y\ge2\sqrt{4}=4$; $\dfrac zx+\dfrac{9x}z\ge2\sqrt9=6$; $\dfrac{4z}y+\dfrac{9y}z\ge2\sqrt{36}=12$

Suy ra $S\ge\dfrac12(4+6+12)=11$.

Dấu "=" xảy ra khi $y=2x$, $z=3x$, $2z=3y$ (ba điều kiện này tương thích nhau). Khi đó $x+y+z=6x=1$ nên $x=\dfrac16$, $y=\dfrac13$, $z=\dfrac12$, suy ra $a=\dfrac56$, $b=\dfrac23$, $c=\dfrac12$ (thỏa bất đẳng thức tam giác và chu vi bằng $2$).

Vậy $GTNN=11$, đạt khi $a=\dfrac56$, $b=\dfrac23$, $c=\dfrac12$.

=== C4B.31@p137
- bai: 31 · y: - · trang: 137 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Khánh Hòa 2015 – 2016
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/p+1/q≥4/(p+q) · tổng bình phương không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Chuyên vòng 1 Khánh Hòa 2015 – 2016) Cho ba số dương $a,b,c$ thỏa mãn $a^2+b^2+c^2=12$. Chứng minh rằng: $\dfrac{1}{a+b}+\dfrac{1}{b+c}+\dfrac{1}{c+a}\ge\dfrac{8}{a^2+28}+\dfrac{8}{b^2+28}+\dfrac{8}{c^2+28}$.
## SACH
Ta có: $\dfrac{1}{a+b}+\dfrac{1}{b+c}\ge\dfrac{4}{a+2b+c}$.

Chứng minh tương tự ta có $\dfrac{1}{b+c}+\dfrac{1}{a+c}\ge\dfrac{4}{a+2c+b}$, $\dfrac{1}{a+b}+\dfrac{1}{a+c}\ge\dfrac{4}{b+2a+c}$.

Suy ra $\dfrac{1}{a+b}+\dfrac{1}{c+b}+\dfrac{1}{a+c}\ge2\left(\dfrac{1}{b+2a+c}+\dfrac{1}{a+2b+c}+\dfrac{1}{b+2c+a}\right)$.

Ta chứng minh $\dfrac{1}{b+2a+c}\ge\dfrac{4}{a^2+28}$

$\dfrac{1}{b+2a+c}\ge\dfrac{4}{a^2+28}$

$\Leftrightarrow a^2+28\ge4b+8a+4c\Leftrightarrow2a^2+b^2+c^2+16-4b-8a-4c\ge0$

$\Leftrightarrow2(a-2)^2+(b-2)^2+(c-2)^2\ge0$

(Điều này luôn đúng).

Vậy $\dfrac{1}{b+2a+c}+\dfrac{1}{a+2b+c}+\dfrac{1}{b+2c+a}\ge\dfrac{4}{a^2+28}+\dfrac{4}{b^2+28}+\dfrac{4}{c^2+28}$.

Suy ra $\dfrac{1}{a+b}+\dfrac{1}{b+c}+\dfrac{1}{c+a}\ge\dfrac{8}{a^2+28}+\dfrac{8}{b^2+28}+\dfrac{8}{c^2+28}$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tổng các nghịch đảo của tổng hai biến, còn vế phải là các nghịch đảo của $a^2+28$; dùng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ để gộp vế trái thành các nghịch đảo của $2a+b+c$,… rồi dùng điều kiện $a^2+b^2+c^2=12$ (tức $28=12+16$) để so sánh với $a^2+28$ bằng tổng bình phương.

**Bước 1.** Ghép từng cặp hai phân thức của vế trái bằng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (với $p,q>0$), và cộng ba kết quả để vế trái được chặn dưới bởi hai lần tổng các nghịch đảo $\dfrac1{2a+b+c}$, $\dfrac1{a+2b+c}$, $\dfrac1{a+b+2c}$.

**Bước 2.** Muốn so sánh $\dfrac1{2a+b+c}$ với $\dfrac4{a^2+28}$ thì chuyển về so sánh hai mẫu: cần $a^2+28\ge4(2a+b+c)$.

**Bước 3.** Thay $28=12+16$ và $12=a^2+b^2+c^2$ để vế trái bất đẳng thức mẫu có dạng $2a^2+b^2+c^2+16$, rồi chuyển vế gom thành tổng các bình phương.

**Bước 4.** Kết luận bằng cách cộng ba bất đẳng thức dạng $\dfrac1{2a+b+c}\ge\dfrac4{a^2+28}$ và kiểm tra dấu "=" tại $a=b=c=2$.

**Chú ý:** Số $28$ không có sẵn trong điều kiện; nó chỉ xuất hiện khi viết $28=(a^2+b^2+c^2)+16$ — dấu hiệu của tổng bình phương $(a-2)^2$,… với điểm rơi $a=b=c=2$.

**Phần 2. Trình bày**

Với $p,q>0$ có $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (hệ quả của Cô-si). Áp dụng cho các cặp:

$\dfrac1{a+b}+\dfrac1{b+c}\ge\dfrac4{a+2b+c}$; $\dfrac1{b+c}+\dfrac1{c+a}\ge\dfrac4{a+b+2c}$; $\dfrac1{c+a}+\dfrac1{a+b}\ge\dfrac4{2a+b+c}$

Cộng ba bất đẳng thức: $2\left(\dfrac1{a+b}+\dfrac1{b+c}+\dfrac1{c+a}\right)\ge4\left(\dfrac1{2a+b+c}+\dfrac1{a+2b+c}+\dfrac1{a+b+2c}\right)$

Suy ra $\dfrac1{a+b}+\dfrac1{b+c}+\dfrac1{c+a}\ge2\left(\dfrac1{2a+b+c}+\dfrac1{a+2b+c}+\dfrac1{a+b+2c}\right)$ (1)

Vì $a^2+b^2+c^2=12$ nên $a^2+28=a^2+(a^2+b^2+c^2)+16=2a^2+b^2+c^2+16$

$a^2+28-4(2a+b+c)=2a^2-8a+b^2-4b+c^2-4c+16=2(a-2)^2+(b-2)^2+(c-2)^2\ge0$

Suy ra $a^2+28\ge4(2a+b+c)>0$, nên $\dfrac1{2a+b+c}\ge\dfrac4{a^2+28}$. Tương tự $\dfrac1{a+2b+c}\ge\dfrac4{b^2+28}$, $\dfrac1{a+b+2c}\ge\dfrac4{c^2+28}$.

Thay vào (1): $\dfrac1{a+b}+\dfrac1{b+c}+\dfrac1{c+a}\ge2\left(\dfrac4{a^2+28}+\dfrac4{b^2+28}+\dfrac4{c^2+28}\right)=\dfrac8{a^2+28}+\dfrac8{b^2+28}+\dfrac8{c^2+28}$

Dấu "=" xảy ra khi $a=b=c$ và $a=b=c=2$, thỏa $a^2+b^2+c^2=12$.

Vậy bất đẳng thức được chứng minh.

=== C4B.32@p138
- bai: 32 · y: - · trang: 138 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Khánh Hòa 2015 – 2016
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/a+1/b≥4/(a+b) · hệ quả (x+y)²≥4xy · Cô-si hai số t+1/t≥2
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Chuyên vòng 1 Khánh Hòa 2015 – 2016) Cho $x,y$ là các số thực dương thỏa mãn điều kiện $x+y=1$. Chứng minh rằng: $A=\dfrac{1}{x^2+y^2}+\dfrac{2}{xy}+4xy\ge11$. Đẳng thức xảy ra khi nào?
## SACH
Trước hết ta có bất đẳng thức $\dfrac1a+\dfrac1b\ge\dfrac{4}{a+b}$ (*) với $\forall a,b>0$. Dấu "=" xảy ra khi và chỉ khi $a=b$.

Thật vậy, BĐT (*) $\Leftrightarrow\dfrac{a+b}{ab}\ge\dfrac{4}{a+b}\Leftrightarrow(a+b)^2\ge4ab\Leftrightarrow(a-b)^2\ge0$ (đúng).

Dấu "=" của BĐT (*) xảy ra khi $a-b=0\Leftrightarrow a=b$.

Vì $(x+y)^2\ge4xy$, $x+y=1$ nên ta có $1\ge4xy\Rightarrow\dfrac{1}{xy}\ge4$ (**)

Dấu "=" xảy ra khi $x=y=\dfrac12$

Ta có $A=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(4xy+\dfrac{1}{4xy}\right)+\dfrac{5}{4xy}$.

Áp dụng BĐT (*) và (**) ta được:

$A\ge\left(\dfrac{4}{x^2+y^2+2xy}\right)+2+\dfrac54\cdot4=\dfrac{4}{(x+y)^2}+7=4+7=11$.

Dấu "=" xảy ra khi $\begin{cases}x^2+y^2=2xy\\4xy=\dfrac{1}{4xy}\\xy=\dfrac14\\x+y=1\end{cases}\Leftrightarrow x=y=\dfrac12$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y=1$ cho $x^2+y^2+2xy=1$ và $xy\le\dfrac14$; ba hạng tử $\dfrac1{x^2+y^2}$, $\dfrac2{xy}$, $4xy$ phải được chia khéo thành các cặp để dùng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (mẫu cộng lại ra $(x+y)^2=1$) và $t+\dfrac1t\ge2$ (với $t=4xy$), điểm rơi $x=y=\dfrac12$.

**Bước 1.** Tìm điểm rơi $x=y=\dfrac12$, khi đó $xy=\dfrac14$, $4xy=1$, $x^2+y^2=2xy$; điều này cho thấy nên ghép $\dfrac1{x^2+y^2}$ với $\dfrac1{2xy}$ (hai mẫu bằng nhau) và $4xy$ với $\dfrac1{4xy}$ (hai số hạng bằng nhau).

**Bước 2.** Tách $\dfrac2{xy}=\dfrac1{2xy}+\dfrac1{4xy}+\dfrac5{4xy}$ để lấy đủ phần cho hai cặp ghép ở bước 1, phần dư $\dfrac5{4xy}$ sẽ được chặn riêng.

**Bước 3.** Chặn dưới từng nhóm: cặp thứ nhất bằng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ với $p+q=(x+y)^2$, cặp thứ hai bằng Cô-si hai số, phần dư dùng $xy\le\dfrac14$ suy từ $(x+y)^2\ge4xy$.

**Bước 4.** Cộng ba kết quả, rồi kiểm tra dấu "=" thỏa mọi điều kiện đã dùng cùng lúc tại $x=y=\dfrac12$.

**Chú ý:** Đừng dùng Cô-si cho $\dfrac1{x^2+y^2}+\dfrac2{xy}$ ngay mà không chú ý điểm rơi: hai số hạng này không bằng nhau tại $x=y=\dfrac12$ nên sẽ mất dấu "=".

**Phần 2. Trình bày**

Vì $x,y>0$ và $x+y=1$ nên $(x+y)^2\ge4xy$ cho $1\ge4xy$, suy ra $\dfrac1{xy}\ge4$ (1), dấu "=" khi $x=y=\dfrac12$.

Với $p,q>0$ có $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (2), vì $\dfrac{p+q}{pq}\ge\dfrac4{p+q}\Leftrightarrow(p-q)^2\ge0$; dấu "=" khi $p=q$.

$A=\left(\dfrac1{x^2+y^2}+\dfrac1{2xy}\right)+\left(4xy+\dfrac1{4xy}\right)+\dfrac5{4xy}$

Theo (2): $\dfrac1{x^2+y^2}+\dfrac1{2xy}\ge\dfrac4{x^2+y^2+2xy}=\dfrac4{(x+y)^2}=4$

Theo Cô-si hai số dương: $4xy+\dfrac1{4xy}\ge2$

Theo (1): $\dfrac5{4xy}=\dfrac54\cdot\dfrac1{xy}\ge\dfrac54\cdot4=5$

Suy ra $A\ge4+2+5=11$.

Dấu "=" xảy ra khi $x^2+y^2=2xy$, $4xy=\dfrac1{4xy}$, $xy=\dfrac14$ và $x+y=1$, tức $x=y=\dfrac12$.

Vậy $A\ge11$, đẳng thức xảy ra khi và chỉ khi $x=y=\dfrac12$.

=== C4B.33@p139
- bai: 33 · y: - · trang: 139 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đổi biến theo mẫu thức · hệ quả Cô-si p/q+q/p≥2
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "Chứng ming rằng" (lỗi chính tả, ## DE sửa thành "Chứng minh"); trong dòng VT sách in ngoặc thứ hai là $\dfrac yz+\dfrac zx$, đúng phải là $\dfrac yz+\dfrac zy$. ## SACH chép nguyên văn như in, ## GIAI theo bản đúng.
## DE
(Diễn đàn toán học) Cho $a,b,c$ là các số thực dương. Chứng minh rằng: $\dfrac{a+b+3c}{3a+3b+2c}+\dfrac{a+3b+c}{3a+2b+3c}+\dfrac{3a+b+c}{2a+3b+3c}\ge\dfrac{15}{8}$
## SACH
Bằng cách tương tự và rất tự nhiên khi nhìn vào mẫu thức ta có cách đổi biến sau.

Đặt: $x=3b+3c+2a$, $y=3a+3c+2b$, $z=3a+3b+2c$. Khi đó vế trái BĐT cần chứng minh là:

$VT=\dfrac78\left(\dfrac xz+\dfrac zx\right)+\dfrac78\left(\dfrac yz+\dfrac zx\right)+\dfrac78\left(\dfrac xy+\dfrac yx\right)-\dfrac{27}{8}\ge\dfrac78(2+2+2)-\dfrac{27}{8}=\dfrac{15}{8}$ (đpcm).

Dấu bằng xảy ra khi và chỉ khi $x=y=z\Leftrightarrow a=b=c$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $3a+3b+2c$, $3a+2b+3c$, $2a+3b+3c$ đều có dạng $3(a+b+c)$ trừ đi một biến, nên đặt chúng làm biến mới thì $a,b,c$ biểu diễn được qua $x,y,z$ và mỗi phân thức trở thành tổ hợp của $\dfrac{x+y}{z}$, từ đó ghép được các cặp $\dfrac pq+\dfrac qp\ge2$.

**Bước 1.** Đặt $z=3a+3b+2c$, $x=2a+3b+3c$, $y=3a+2b+3c$ (ứng với ba mẫu), cộng lại được $x+y+z=8(a+b+c)$, từ đó biểu diễn $a+b+c$ và từng biến qua $x,y,z$.

**Bước 2.** Biểu diễn tử số $a+b+3c$ theo $x,y,z$ bằng cách viết $a+b+3c=(a+b+c)+2c$, để mỗi phân thức thành một biểu thức dạng $\dfrac78\cdot\dfrac{x+y}z$ trừ một hằng số.

**Bước 3.** Gom tổng thành ba cặp $\dfrac xy+\dfrac yx$, $\dfrac yz+\dfrac zy$, $\dfrac zx+\dfrac xz$ và dùng $\dfrac pq+\dfrac qp\ge2$ cho $p,q>0$ để chặn dưới.

**Bước 4.** Kiểm tra dấu "=" khi $x=y=z$, tức $a=b=c$, và đổi về điều kiện của đề.

**Chú ý:** Dấu "=" phải thỏa cả ba cặp cùng lúc, nên cần $x=y=z$ — điều này chỉ có khi $a=b=c$.

**Phần 2. Trình bày**

Đặt $x=2a+3b+3c$, $y=3a+2b+3c$, $z=3a+3b+2c$; $x,y,z>0$ và $x+y+z=8(a+b+c)$.

Gọi $s=a+b+c=\dfrac{x+y+z}8$. Vì $z=3s-c$ nên $c=3s-z=\dfrac{3x+3y-5z}8$, do đó $a+b+3c=s+2c=\dfrac{x+y+z}8+\dfrac{3x+3y-5z}4=\dfrac{7x+7y-9z}8$

Suy ra $\dfrac{a+b+3c}{3a+3b+2c}=\dfrac{7x+7y-9z}{8z}=\dfrac78\cdot\dfrac{x+y}z-\dfrac98$

Tương tự $\dfrac{a+3b+c}{3a+2b+3c}=\dfrac78\cdot\dfrac{x+z}y-\dfrac98$ và $\dfrac{3a+b+c}{2a+3b+3c}=\dfrac78\cdot\dfrac{y+z}x-\dfrac98$

Vế trái $=\dfrac78\left[\left(\dfrac xz+\dfrac zx\right)+\left(\dfrac yz+\dfrac zy\right)+\left(\dfrac xy+\dfrac yx\right)\right]-\dfrac{27}8$

Với $p,q>0$ có $\dfrac pq+\dfrac qp\ge2$ nên vế trái $\ge\dfrac78\cdot6-\dfrac{27}8=\dfrac{15}8$.

Dấu "=" xảy ra khi $x=y=z$, tức $a=b=c$.

Vậy bất đẳng thức được chứng minh.

=== C4B.34@p139
- bai: 34 · y: - · trang: 139 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đổi biến x=1/a · hệ quả Cô-si ba số (p+q+r)(1/p+1/q+1/r)≥9 (bất đẳng thức Nesbitt)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Diễn đàn toán học) Với các số dương $a,b,c$ thỏa mãn $abc=1$, chứng minh rằng: $\dfrac{1}{a^2(b+c)}+\dfrac{1}{b^2(c+a)}+\dfrac{1}{c^2(a+b)}\ge\dfrac32$. Đẳng thức xảy ra khi nào?
## SACH
Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$, ta thu được: $xyz=1$.

Ta có: $\dfrac{1}{a^2(b+c)}=\dfrac{x^2}{\dfrac1y+\dfrac1z}=\dfrac{x^2yz}{y+z}=\dfrac{x}{y+z}$

Biến đổi tương tự, ta được: $\dfrac{1}{b^2(c+a)}=\dfrac{y}{z+x}$, $\dfrac{1}{c^2(a+b)}=\dfrac{z}{x+y}$.

Bất đẳng thức cần chứng minh có dạng:

$\dfrac{x}{y+z}+\dfrac{y}{z+x}+\dfrac{z}{x+y}\ge\dfrac32\Leftrightarrow\left(\dfrac{x}{y+z}+1\right)+\left(\dfrac{y}{z+x}+1\right)+\left(\dfrac{z}{x+y}+1\right)\ge\dfrac92$

$\Leftrightarrow(x+y+z)\left(\dfrac1{y+z}+\dfrac1{z+x}+\dfrac1{x+y}\right)\ge\dfrac92$

Áp dụng bất đẳng thức $(a+b+c)\left(\dfrac1a+\dfrac1b+\dfrac1c\right)\ge9$ với $a,b,c$ dương, ta có:

$(x+y+z)\left(\dfrac1{x+y}+\dfrac1{y+z}+\dfrac1{z+x}\right)=\dfrac{(x+y+y+z+z+x)}{2}\left(\dfrac1{x+y}+\dfrac1{y+z}+\dfrac1{z+x}\right)\ge\dfrac92$

Do đó, ta có điều phải chứng minh.

Đẳng thức xảy ra khi và chỉ khi $x+y=y+z=z+x\Leftrightarrow x=y=z\Leftrightarrow a=b=c$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $abc=1$ cùng mẫu $a^2(b+c)$ gợi đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$: khi đó $\dfrac1{a^2(b+c)}=\dfrac{x^2yz}{y+z}=\dfrac{x}{y+z}$ vì $xyz=1$, bài toán thành bất đẳng thức Nesbitt, giải được bằng hệ quả Cô-si ba số.

**Bước 1.** Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$ rồi biến đổi $\dfrac1{a^2(b+c)}$ về dạng $\dfrac{x}{y+z}$ nhờ $xyz=1$, và làm tương tự cho hai phân thức còn lại.

**Bước 2.** Cộng $1$ vào mỗi phân thức để thấy $\dfrac{x}{y+z}+1=\dfrac{x+y+z}{y+z}$, nhờ vậy tổng ba phân thức thành $(x+y+z)\left(\dfrac1{y+z}+\dfrac1{z+x}+\dfrac1{x+y}\right)-3$.

**Bước 3.** Đặt $p=y+z$, $q=z+x$, $r=x+y$ để $x+y+z=\dfrac{p+q+r}2$, rồi dùng hệ quả Cô-si $(p+q+r)\left(\dfrac1p+\dfrac1q+\dfrac1r\right)\ge9$.

**Bước 4.** Tìm điểm dấu "=" ($p=q=r$ nên $x=y=z$), kết hợp $xyz=1$ để suy ra $a=b=c=1$.

**Chú ý:** Hệ quả Cô-si ba số chỉ dùng được khi cả ba số dương; ở đây $p,q,r>0$ vì $x,y,z>0$.

**Phần 2. Trình bày**

Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$ thì $x,y,z>0$ và $xyz=1$.

$\dfrac1{a^2(b+c)}=\dfrac{x^2}{\dfrac1y+\dfrac1z}=\dfrac{x^2yz}{y+z}=\dfrac{x}{y+z}$

Tương tự $\dfrac1{b^2(c+a)}=\dfrac{y}{z+x}$, $\dfrac1{c^2(a+b)}=\dfrac{z}{x+y}$.

Vế trái $=\dfrac{x}{y+z}+\dfrac{y}{z+x}+\dfrac{z}{x+y}=(x+y+z)\left(\dfrac1{y+z}+\dfrac1{z+x}+\dfrac1{x+y}\right)-3$

Đặt $p=y+z$, $q=z+x$, $r=x+y>0$ thì $x+y+z=\dfrac{p+q+r}2$.

Theo hệ quả của bất đẳng thức Cô-si cho ba số dương: $(p+q+r)\left(\dfrac1p+\dfrac1q+\dfrac1r\right)\ge9$, suy ra $(x+y+z)\left(\dfrac1p+\dfrac1q+\dfrac1r\right)\ge\dfrac92$

Do đó vế trái $\ge\dfrac92-3=\dfrac32$.

Dấu "=" xảy ra khi $p=q=r$, tức $x=y=z$; kết hợp $xyz=1$ được $x=y=z=1$, tức $a=b=c=1$.

Vậy bất đẳng thức được chứng minh, đẳng thức xảy ra khi và chỉ khi $a=b=c=1$.

=== C4B.35@p140
- bai: 35 · y: - · trang: 140 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đổi biến x=1/a · Cô-si hai số x²/(y+z)+(y+z)/4≥x · Cô-si ba số x+y+z≥3 khi xyz=1
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ ghi "dễ dàng chứng minh bằng BĐT AM – GM" cho bước cuối; ## GIAI viết đủ.
## DE
Cho $a,b,c$ là các số thực dương thỏa mãn $abc=1$. Chứng minh rằng: $\dfrac{1}{a^3(b+c)}+\dfrac{1}{b^3(c+a)}+\dfrac{1}{c^3(a+b)}\ge\dfrac32$
## SACH
Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$, ta thu được: $xyz=1$.

Khi đó BĐT cần chứng minh tương đương với: $\dfrac{x^2}{y+z}+\dfrac{y^2}{z+x}+\dfrac{z^2}{x+y}\ge\dfrac32$.

BĐT trên dễ dàng chứng minh bằng BĐT AM – GM. Dấu đẳng thức xảy ra khi và chỉ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $x=\dfrac1a$,… thì $xyz=1$ và $\dfrac1{a^3(b+c)}=\dfrac{x^2}{y+z}$; mẫu $y+z$ trong phân thức này được khử bằng cách cộng thêm $\dfrac{y+z}4$, vì tích hai số hạng $\dfrac{x^2}{y+z}$ và $\dfrac{y+z}4$ là $\left(\dfrac x2\right)^2$ nên Cô-si hai số cho ra $x$.

**Bước 1.** Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$ và chứng tỏ $\dfrac1{a^3(b+c)}=\dfrac{x^2}{y+z}$ nhờ $xyz=1$; bất đẳng thức đã cho thành $\dfrac{x^2}{y+z}+\dfrac{y^2}{z+x}+\dfrac{z^2}{x+y}\ge\dfrac32$.

**Bước 2.** Cộng vào mỗi phân thức đúng lượng $\dfrac{y+z}4$ để dùng Cô-si hai số, được $\dfrac{x^2}{y+z}+\dfrac{y+z}4\ge x$ với điểm rơi $y+z=2x$.

**Bước 3.** Cộng ba bất đẳng thức, rồi chuyển các lượng đã cộng thêm sang vế phải để nhận một đánh giá theo $x+y+z$.

**Bước 4.** Dùng Cô-si ba số với $xyz=1$ để chặn $x+y+z\ge3$, và kiểm tra dấu "=" khi $x=y=z=1$.

**Chú ý:** Bất đẳng thức $x+y+z\ge3$ chỉ đúng nhờ điều kiện $xyz=1$ (Cô-si ba số cho $x+y+z\ge3\sqrt[3]{xyz}$).

**Phần 2. Trình bày**

Đặt $x=\dfrac1a$, $y=\dfrac1b$, $z=\dfrac1c$ thì $x,y,z>0$, $xyz=1$.

$\dfrac1{a^3(b+c)}=\dfrac{x^3}{\dfrac1y+\dfrac1z}=\dfrac{x^3yz}{y+z}=\dfrac{x^2}{y+z}$, tương tự cho hai phân thức còn lại.

Bất đẳng thức cần chứng minh trở thành $\dfrac{x^2}{y+z}+\dfrac{y^2}{z+x}+\dfrac{z^2}{x+y}\ge\dfrac32$.

Theo Cô-si hai số dương: $\dfrac{x^2}{y+z}+\dfrac{y+z}4\ge2\sqrt{\dfrac{x^2}4}=x$, dấu "=" khi $y+z=2x$. Tương tự $\dfrac{y^2}{z+x}+\dfrac{z+x}4\ge y$ và $\dfrac{z^2}{x+y}+\dfrac{x+y}4\ge z$.

Cộng ba bất đẳng thức: $\dfrac{x^2}{y+z}+\dfrac{y^2}{z+x}+\dfrac{z^2}{x+y}\ge(x+y+z)-\dfrac{2(x+y+z)}4=\dfrac{x+y+z}2$

Theo Cô-si ba số dương: $x+y+z\ge3\sqrt[3]{xyz}=3$, nên vế trái $\ge\dfrac32$.

Dấu "=" xảy ra khi $y+z=2x$, $z+x=2y$, $x+y=2z$ và $x=y=z$ (để $x+y+z=3$), tức $x=y=z=1$, hay $a=b=c=1$.

Vậy bất đẳng thức được chứng minh.

=== C4B.36@p141
- bai: 36 · y: - · trang: 141 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đổi biến x=(1−a)/(1+a) · biến đổi tương đương · (x+y+z)²≥0
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Bài này sách xếp trong mục Cô-si nhưng lời giải không dùng Cô-si; dấu "=" sách không nêu, theo lời giải xảy ra khi một trong ba số bằng 1 và hai số còn lại có tích bằng 1 (đã kiểm bằng số, vd a=1, b=2, c=1/2).
## DE
(Diễn đàn toán học) Cho ba số dương $a,b,c$ thỏa mãn $abc=1$. Chứng minh: $\dfrac{a}{(a+1)^2}+\dfrac{b}{(b+1)^2}+\dfrac{c}{(c+1)^2}-\dfrac{4}{(a+1)(b+1)(c+1)}\le\dfrac14$ (*)
## SACH
Đặt $x=\dfrac{1-a}{1+a}$; $y=\dfrac{1-b}{1+b}$; $z=\dfrac{1-c}{1+c}$

$\Rightarrow-1<x,y,z<1$ và $a=\dfrac{1-x}{1+x}$; $b=\dfrac{1-y}{1+y}$; $c=\dfrac{1-z}{1+z}$.

Từ $abc=1\Rightarrow(1-x)(1-y)(1-z)=(1+x)(1+y)(1+z)\Rightarrow x+y+z+xyz=0$.

Mặt khác: $\dfrac{4a}{(a+1)^2}=1-x^2$; $\dfrac{2}{a+1}=1+x$.

Tương tự: $\dfrac{4b}{(b+1)^2}=1-y^2$; $\dfrac{2}{b+1}=1+y$ và $\dfrac{4c}{(c+1)^2}=1-z^2$; $\dfrac{2}{c+1}=1+z$

Nên: $(*)\Leftrightarrow\dfrac{4a}{(a+1)^2}+\dfrac{4b}{(b+1)^2}+\dfrac{4c}{(c+1)^2}\le1+2\cdot\dfrac{2}{(a+1)}\cdot\dfrac{2}{(b+1)}\cdot\dfrac{2}{(c+1)}$

$\Leftrightarrow x^2+y^2+z^2+2(xy+yz+zx)+2(x+y+z+xyz)\ge0\Leftrightarrow(x+y+z)^2\ge0$.

Đây là bất đẳng thức luôn đúng nên bài toán được chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức cần chứng minh có các hạng tử $\dfrac{a}{(a+1)^2}$ và $\dfrac{1}{a+1}$ đều biểu diễn đẹp qua $x=\dfrac{1-a}{1+a}$ (cụ thể $\dfrac{4a}{(a+1)^2}=1-x^2$, $\dfrac{2}{a+1}=1+x$), đồng thời $abc=1$ trở thành điều kiện gọn $x+y+z+xyz=0$ để khử bậc ba.

**Bước 1.** Đặt $x=\dfrac{1-a}{1+a}$,… rồi giải ngược $a=\dfrac{1-x}{1+x}$ để có $-1<x,y,z<1$ vì $a,b,c>0$.

**Bước 2.** Chuyển giả thiết $abc=1$ sang $x,y,z$: nhân chéo được $(1-x)(1-y)(1-z)=(1+x)(1+y)(1+z)$, khai triển rồi rút gọn để có một hệ thức giữa $x+y+z$ và $xyz$.

**Bước 3.** Nhân hai vế bất đẳng thức với $4$ để các hạng tử trở thành $\dfrac{4a}{(a+1)^2}$ và $\dfrac{16}{(a+1)(b+1)(c+1)}$, rồi viết chúng bằng $x,y,z$.

**Bước 4.** Thay vào, chuyển vế, và dùng hệ thức ở bước 2 để mọi thứ chỉ còn $(x+y+z)^2\ge0$.

**Chú ý:** Bài này không giải được bằng Cô-si trực tiếp; chìa khóa là đổi biến để $abc=1$ thành $x+y+z+xyz=0$. Dấu "=" xảy ra khi $x+y+z=0$, tức một trong ba số bằng $1$ và hai số còn lại có tích bằng $1$.

**Phần 2. Trình bày**

Vì $a,b,c>0$ nên đặt $x=\dfrac{1-a}{1+a}$, $y=\dfrac{1-b}{1+b}$, $z=\dfrac{1-c}{1+c}$ thì $-1<x,y,z<1$ và $a=\dfrac{1-x}{1+x}$, $b=\dfrac{1-y}{1+y}$, $c=\dfrac{1-z}{1+z}$.

Từ $abc=1$: $(1-x)(1-y)(1-z)=(1+x)(1+y)(1+z)$, khai triển được $1-(x+y+z)+(xy+yz+zx)-xyz=1+(x+y+z)+(xy+yz+zx)+xyz$, suy ra $x+y+z+xyz=0$ (1)

Ta có $a+1=\dfrac{2}{1+x}$ nên $\dfrac{4a}{(a+1)^2}=4\cdot\dfrac{1-x}{1+x}\cdot\dfrac{(1+x)^2}{4}=1-x^2$ và $\dfrac{2}{a+1}=1+x$. Tương tự với $b$, $c$.

Nhân hai vế của (*) với $4$: $(*)\Leftrightarrow\dfrac{4a}{(a+1)^2}+\dfrac{4b}{(b+1)^2}+\dfrac{4c}{(c+1)^2}-\dfrac{16}{(a+1)(b+1)(c+1)}\le1$

Vì $\dfrac{16}{(a+1)(b+1)(c+1)}=2\cdot\dfrac{2}{a+1}\cdot\dfrac{2}{b+1}\cdot\dfrac{2}{c+1}=2(1+x)(1+y)(1+z)$ nên

$(*)\Leftrightarrow(1-x^2)+(1-y^2)+(1-z^2)-2(1+x)(1+y)(1+z)\le1$

$\Leftrightarrow3-(x^2+y^2+z^2)-2-2(x+y+z)-2(xy+yz+zx)-2xyz\le1$

$\Leftrightarrow x^2+y^2+z^2+2(xy+yz+zx)+2(x+y+z+xyz)\ge0$

Theo (1), $x+y+z+xyz=0$, nên bất đẳng thức trên $\Leftrightarrow(x+y+z)^2\ge0$ (luôn đúng).

Vậy bất đẳng thức (*) được chứng minh.

=== C4B.37@p141
- bai: 37 · y: - · trang: 141 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đổi biến a=x³, b=y³, c=z³ · Cô-si hai số x²+y²≥2xy (dạng (x+y)(x−y)²≥0)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: ĐỀ SÁCH IN NGHI SAI: ba mẫu in là $a+b+c$, $b+c+a$, $c+a+b$ (giống hệt nhau) và nói "số thực"; lời giải sách đặt $a=x^3,b=y^3,c=z^3$ với $x,y,z>0$ và dùng mẫu $x^3+y^3+1$, tức đề đúng là $a,b,c$ dương và mẫu $a+b+1$, $b+c+1$, $c+a+1$ (đây cũng là bài gốc trên diễn đàn). ## DE chép đúng như sách in; ## SACH nguyên văn; ## GIAI giải bản đúng (a,b,c>0, mẫu a+b+1…). Người duyệt cần quyết định đề kho dùng bản nào. Với a,b,c dương và đề in sách thì bài tầm thường: $\dfrac3{a+b+c}\le1$ vì $a+b+c\ge3$ (Cô-si ba số).
## DE
(Diễn đàn toán học) Cho $a,b,c$ là các số thực thỏa mãn $abc=1$. Chứng minh rằng: $\dfrac{1}{a+b+c}+\dfrac{1}{b+c+a}+\dfrac{1}{c+a+b}\le1$
## SACH
Đặt: $a=x^3$, $b=y^3$, $c=z^3$ ($x,y,z>0$) và $xyz=1$

Bđt cần chứng minh tương đương với $\dfrac{1}{x^3+y^3+1}+\dfrac{1}{y^3+z^3+1}+\dfrac{1}{z^3+x^3+1}\le1$

Áp dụng BĐT AM – GM ta có:

$x^3+y^3+1=(x+y)(x^2+y^2-xy)+xyz\ge(x+y)xy+xyz=xy(x+y+z)$

$\Rightarrow\dfrac{1}{x^3+y^3+1}\le\dfrac{1}{xy(x+y+z)}$

Tương tự $\dfrac{1}{y^3+z^3+1}\le\dfrac{1}{yz(x+y+z)}$; $\dfrac{1}{z^3+x^3+1}\le\dfrac{1}{zx(x+y+z)}$

Cộng từng vế ba bđt trên ta có:

$\dfrac{1}{x^3+y^3+1}+\dfrac{1}{y^3+z^3+1}+\dfrac{1}{z^3+x^3+1}\le\dfrac{1}{xy(x+y+z)}+\dfrac{1}{yz(x+y+z)}+\dfrac{1}{zx(x+y+z)}$

$=\dfrac{1}{x+y+z}\left(\dfrac1{xy}+\dfrac1{yz}+\dfrac1{zx}\right)=\dfrac{1}{x+y+z}\cdot\dfrac{x+y+z}{xyz}=\dfrac{1}{xyz}=1$ (đpcm).

Đẳng thức xảy ra khi và chỉ khi $x=y=z=1\Leftrightarrow a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** (Giải bản đúng của đề: $a,b,c>0$, $abc=1$, các mẫu $a+b+1$, $b+c+1$, $c+a+1$.) Có $abc=1$ và các lập phương $a=x^3$ xuất hiện qua $a+b+1=x^3+y^3+xyz$, mà $x^3+y^3\ge xy(x+y)$ nên mẫu được chặn dưới bởi biểu thức có nhân tử chung $x+y+z$; sau khi nghịch đảo và cộng thì $x+y+z$ rút gọn hết.

**Bước 1.** Đặt $a=x^3$, $b=y^3$, $c=z^3$ với $x,y,z>0$ (lấy căn bậc ba) và $xyz=1$, rồi viết lại ba mẫu thành $x^3+y^3+1$,… và thay $1=xyz$.

**Bước 2.** Chứng minh $x^3+y^3\ge xy(x+y)$ bằng cách phân tích $x^3+y^3-xy(x+y)=(x+y)(x-y)^2$ không âm, từ đó $x^3+y^3+xyz\ge xy(x+y+z)$.

**Bước 3.** Lấy nghịch đảo các mẫu dương để đổi chiều bất đẳng thức, viết tương tự cho hai mẫu còn lại, rồi cộng ba bất đẳng thức.

**Bước 4.** Rút gọn tổng bằng $\dfrac1{xy}+\dfrac1{yz}+\dfrac1{zx}=\dfrac{x+y+z}{xyz}$ và $xyz=1$, rồi kiểm tra dấu "=" khi $x=y=z=1$.

**Chú ý:** Đề in có chỗ nghi sai (xem ghi chú); lời giải ở đây theo bản đúng với mẫu $a+b+1$,…

**Phần 2. Trình bày**

Vì $a,b,c>0$, đặt $x=\sqrt[3]{a}$, $y=\sqrt[3]{b}$, $z=\sqrt[3]{c}$ thì $x,y,z>0$, $a=x^3$, $b=y^3$, $c=z^3$ và $xyz=1$.

Với $x,y>0$: $x^3+y^3-xy(x+y)=(x+y)(x^2-2xy+y^2)=(x+y)(x-y)^2\ge0$, nên $x^3+y^3\ge xy(x+y)$.

Suy ra $a+b+1=x^3+y^3+xyz\ge xy(x+y)+xyz=xy(x+y+z)>0$

Do đó $\dfrac1{a+b+1}\le\dfrac1{xy(x+y+z)}$. Tương tự $\dfrac1{b+c+1}\le\dfrac1{yz(x+y+z)}$ và $\dfrac1{c+a+1}\le\dfrac1{zx(x+y+z)}$

Cộng ba bất đẳng thức: $\dfrac1{a+b+1}+\dfrac1{b+c+1}+\dfrac1{c+a+1}\le\dfrac1{x+y+z}\left(\dfrac1{xy}+\dfrac1{yz}+\dfrac1{zx}\right)=\dfrac1{x+y+z}\cdot\dfrac{x+y+z}{xyz}=\dfrac1{xyz}=1$

Dấu "=" xảy ra khi $x=y$, $y=z$, $z=x$, tức $x=y=z=1$, hay $a=b=c=1$.

Vậy bất đẳng thức được chứng minh.

=== C4B.38@p142
- bai: 38 · y: - · trang: 142 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: biến đổi tương đương theo S=a+b+c, R=ab+bc+ca, P=abc · giả sử c lớn nhất (đối xứng)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Bài này sách xếp trong mục Cô-si nhưng không dùng Cô-si; bất đẳng thức chặt nên không có dấu "=". Dòng "(1)" trong lời giải sách ám chỉ bất đẳng thức của đề. Sách không có bài 39 (nhảy từ 38 sang 40). Dòng cuối lời giải sách in "ab(9ac-4a-4b)", đúng phải là $ab(9c-4a-4b)$ (## SACH chép như in).
## DE
(Diễn đàn toán học) Cho ba số dương $a,b,c$. Chứng minh rằng: $\left(\dfrac{4a}{b+c}+1\right)\left(\dfrac{4b}{c+a}+1\right)\left(\dfrac{4c}{a+b}+1\right)>25$
## SACH
Không giảm tổng quát, giả sử $c$ là số lớn nhất trong ba số $a,b,c$. Đặt $S=a+b+c$, $R=ab+bc+ca$, $P=abc$.

$(1)\Leftrightarrow(S+3a)(S+3b)(S+3c)>25(S-a)(S-b)(S-c)$

$\Leftrightarrow S^3+3S^2(a+b+c)+9S(ab+bc+ca)+27abc$

$>25\left[S^3-S^2(a+b+c)+S(ab+bc+ca)-abc\right]$

$\Leftrightarrow4S^3+9SR+27P>25(SR-P)$

$\Leftrightarrow S^3-4SR+13P>0$. (2)

Ta chứng minh (2) đúng. Thật vậy:

$VT(2)=(a+b+c)^3-4(a+b+c)(ab+bc+ca)+13abc$

$=(a+b+c)\left[(a+b+c)^2-4(ab+bc+ca)\right]+13abc$

$=(a+b+c)\left[(a+b-c)^2-4ab\right]+13abc$

$=(a+b+c)(a+b-c)^2-4ab(a+b+c)+13abc$

$=(a+b+c)(a+b-c)^2+ab(9ac-4a-4b)>0$

(Do $9c-4a-4b>c>0$)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi nhân tử $\dfrac{4a}{b+c}+1=\dfrac{S+3a}{S-a}$ với $S=a+b+c$, nên bất đẳng thức quy đồng được thành bất đẳng thức đối xứng theo $S,R,P$; vì đối xứng nên được giả sử $c$ lớn nhất, để đánh giá được dấu của hệ số $9c-4a-4b$ cuối cùng.

**Bước 1.** Đặt $S=a+b+c$, $R=ab+bc+ca$, $P=abc$ và viết $\dfrac{4a}{b+c}+1=\dfrac{S+3a}{S-a}$, rồi nhân hai vế với tích các mẫu dương $(S-a)(S-b)(S-c)$.

**Bước 2.** Khai triển hai vế theo $S,R,P$ để đưa bất đẳng thức về $S^3-4SR+13P>0$.

**Bước 3.** Viết $S^3-4SR=S\left[(a+b+c)^2-4(ab+bc+ca)\right]=S\left[(a+b-c)^2-4ab\right]$ để tách ra một bình phương.

**Bước 4.** Gom các số hạng chứa $ab$: $-4abS+13abc=ab(9c-4a-4b)$, rồi dùng $c$ lớn nhất để chứng tỏ hệ số này dương.

**Chú ý:** Việc giả sử $c$ lớn nhất chỉ hợp lệ vì cả hai vế đối xứng theo $a,b,c$; và để kết luận bất đẳng thức chặt cần $ab(9c-4a-4b)>0$ thật sự dương, không chỉ không âm.

**Phần 2. Trình bày**

Vì bất đẳng thức đối xứng theo $a,b,c$ nên không mất tổng quát, giả sử $c\ge a$ và $c\ge b$. Đặt $S=a+b+c$, $R=ab+bc+ca$, $P=abc$.

Vì $\dfrac{4a}{b+c}+1=\dfrac{4a+b+c}{b+c}=\dfrac{S+3a}{S-a}$ và các mẫu $S-a,S-b,S-c$ dương nên bất đẳng thức cần chứng minh tương đương

$(S+3a)(S+3b)(S+3c)>25(S-a)(S-b)(S-c)$

Khai triển: $(S+3a)(S+3b)(S+3c)=S^3+3S^2\cdot S+9SR+27P=4S^3+9SR+27P$

và $(S-a)(S-b)(S-c)=S^3-S^2\cdot S+SR-P=SR-P$

Do đó bất đẳng thức tương đương $4S^3+9SR+27P>25(SR-P)\Leftrightarrow S^3-4SR+13P>0$ (2)

Ta có $S^2-4R=(a+b+c)^2-4(ab+bc+ca)=(a+b-c)^2-4ab$

nên vế trái của (2) $=S\left[(a+b-c)^2-4ab\right]+13abc=S(a+b-c)^2+ab(13c-4S)=S(a+b-c)^2+ab(9c-4a-4b)$

Vì $a\le c$, $b\le c$ nên $9c-4a-4b\ge9c-8c=c>0$, suy ra $ab(9c-4a-4b)>0$; còn $S(a+b-c)^2\ge0$.

Vậy vế trái của (2) dương, nên bất đẳng thức (2), và do đó bất đẳng thức của đề, đúng.

=== C4B.40@p142
- bai: 40 · y: - · trang: 142 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ số 422
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/a+1/b≥4/(a+b) · Cô-si hai số t+1/t≥2 · hệ quả (x+y)²≥4xy · hằng đẳng thức x³+y³=(x+y)(x²−xy+y²)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Toán học & tuổi trẻ số 422) Cho $x,y$ là các số thực dương thỏa mãn $x+y=1$. Chứng minh rằng $A=\dfrac{1}{x^3+xy+y^3}+\dfrac{4y^2x^2+2}{xy}\ge11$
## SACH
Ta có: $(a+b)^2\ge4ab\Rightarrow\dfrac1a+\dfrac1b\ge\dfrac{4}{a+b}$ với $a,b$ dương.

Do $x+y=1$ nên ta có:

$A=\dfrac{1}{x^3+xy+y^3}+\dfrac{4y^2x^2+2}{xy}=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(4xy+\dfrac{1}{4xy}\right)+\dfrac{5}{4xy}$.

Ta có: $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\ge\dfrac{4}{(x+y)^2}=4$.

Ta sử dụng bđt $\dfrac ab+\dfrac ba\ge2$ với $a,b>0$ thì $4xy+\dfrac{1}{4xy}=\dfrac{4xy}{1}+\dfrac{1}{4xy}\ge2$.

Mặt khác $1=(x+y)^2\ge4xy\Rightarrow xy\le\dfrac14\Rightarrow\dfrac{5}{4xy}\ge5$.

Nên ta suy ra:

$A=\dfrac{1}{x^3+xy+y^3}+\dfrac{4y^2x^2+2}{xy}=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(4xy+\dfrac{1}{4xy}\right)+\dfrac{5}{4xy}\ge4+2+5=11$

Dấu bằng xảy ra khi và chỉ khi $x=y=\dfrac12$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^3+xy+y^3$ trông khó, nhưng vì $x+y=1$ nên $x^3+y^3=(x+y)(x^2-xy+y^2)=x^2-xy+y^2$ và mẫu thu về $x^2+y^2$; khi đó $A$ giống hệt bài trước, chia khéo thành các cặp có điểm rơi $x=y=\dfrac12$.

**Bước 1.** Dùng $x^3+y^3=(x+y)(x^2-xy+y^2)$ cùng $x+y=1$ để đưa $x^3+xy+y^3$ về $x^2+y^2$, và tách $\dfrac{4x^2y^2+2}{xy}=4xy+\dfrac{2}{xy}$.

**Bước 2.** Ghép $\dfrac1{x^2+y^2}$ với $\dfrac1{2xy}$ (hai mẫu bằng nhau tại điểm rơi) và $4xy$ với $\dfrac1{4xy}$, rồi tách $\dfrac2{xy}=\dfrac1{2xy}+\dfrac1{4xy}+\dfrac5{4xy}$ để có đủ phần cho các cặp.

**Bước 3.** Chặn dưới từng nhóm: nhóm đầu bằng $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$, nhóm hai bằng Cô-si hai số, phần dư dùng $xy\le\dfrac14$.

**Bước 4.** Cộng các kết quả và kiểm tra dấu "=" tại $x=y=\dfrac12$.

**Chú ý:** Cách tách $\dfrac2{xy}=\dfrac1{2xy}+\dfrac1{4xy}+\dfrac5{4xy}$ phải đúng hệ số mới có điểm rơi chung; không tách mà dùng Cô-si trực tiếp thì mất dấu "=".

**Phần 2. Trình bày**

Vì $x+y=1$ nên $x^3+y^3=(x+y)(x^2-xy+y^2)=x^2-xy+y^2$, suy ra $x^3+xy+y^3=x^2+y^2$.

Do đó $A=\dfrac{1}{x^2+y^2}+\dfrac{4x^2y^2+2}{xy}=\dfrac1{x^2+y^2}+4xy+\dfrac2{xy}=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(4xy+\dfrac{1}{4xy}\right)+\dfrac{5}{4xy}$

Với $p,q>0$ có $\dfrac1p+\dfrac1q\ge\dfrac4{p+q}$ (hệ quả của $(p+q)^2\ge4pq$), nên $\dfrac1{x^2+y^2}+\dfrac1{2xy}\ge\dfrac4{x^2+y^2+2xy}=\dfrac4{(x+y)^2}=4$

Theo Cô-si hai số dương: $4xy+\dfrac1{4xy}\ge2$

Vì $1=(x+y)^2\ge4xy$ nên $xy\le\dfrac14$, suy ra $\dfrac5{4xy}\ge5$.

Cộng lại: $A\ge4+2+5=11$.

Dấu "=" xảy ra khi $x^2+y^2=2xy$, $4xy=\dfrac1{4xy}$, tức $x=y=\dfrac12$.

Vậy $A\ge11$.

=== C4B.41@p143
- bai: 41 · y: - · trang: 143 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ số 393
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si p/q+q/p≥2 · biến đổi tương đương (nhân với mẫu dương)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Đề in có dấu "+" thừa ngay trước dấu ≥ ("...+ ≥ ...") và nhãn (1); ## DE bỏ hai chỗ đó. Lời giải sách chuyển (1) sang (2) mà không nêu phép nhân với $xyz+(1-x)(1-y)(1-z)$ và các phép tách; ## GIAI viết đủ.
## DE
(Toán học & tuổi trẻ số 393) Cho $x,y,z$ là các số thực thuộc khoảng $(0;1)$. Chứng minh rằng: $\dfrac{1}{x(1-y)}+\dfrac{1}{y(1-z)}+\dfrac{1}{z(1-x)}\ge\dfrac{3}{xyz+(1-x)(1-y)(1-z)}$
## SACH
Ta sử dụng bđt $\dfrac ab+\dfrac ba\ge2$.

Do $x,y,z$ là các số thực thuộc khoảng $(0;1)$ nên $1-x$; $1-y$; $1-z$ dương.

$(1)\Leftrightarrow\dfrac{1-z}{x}+\dfrac{z}{1-y}+\dfrac{1-x}{y}+\dfrac{x}{1-z}+\dfrac{1-y}{z}+\dfrac{y}{1-x}\ge6$ (2)

Áp dụng BĐT $\dfrac ab+\dfrac ba\ge2$ với $a,b>0$

Ta có: $\dfrac{1-z}{x}+\dfrac{x}{1-z}\ge2$; $\dfrac{z}{1-y}+\dfrac{1-y}{z}\ge2$; $\dfrac{y}{1-x}+\dfrac{1-x}{y}\ge2$

Nên lúc đó $\dfrac{1-z}{x}+\dfrac{z}{1-y}+\dfrac{1-x}{y}+\dfrac{x}{1-z}+\dfrac{1-y}{z}+\dfrac{y}{1-x}\ge6$.

Dấu bằng xảy ra khi và chỉ khi $x=y=z=\dfrac12$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu bên phải $D=xyz+(1-x)(1-y)(1-z)$ xuất hiện trong mọi hạng tử khi nhân hai vế với $D$; chia $D$ cho $x(1-y)$ thì $xyz$ và $(1-x)(1-y)(1-z)$ lần lượt rút gọn được một nhân tử, và mỗi hạng tử trở thành tổng hai phân thức dạng $\dfrac{1-z}{x}$ và $\dfrac{z}{1-y}$ rồi ghép với nghịch đảo của chúng để dùng $\dfrac pq+\dfrac qp\ge2$.

**Bước 1.** Chỉ ra $D>0$ vì $x,y,z$ và $1-x,1-y,1-z$ đều dương, để nhân hai vế với $D$ mà không đổi chiều.

**Bước 2.** Tính $\dfrac{D}{x(1-y)}=\dfrac{yz}{1-y}+\dfrac{(1-x)(1-z)}{x}$, rồi dùng $\dfrac{y}{1-y}=\dfrac1{1-y}-1$ và $\dfrac{1-x}{x}=\dfrac1x-1$ để đưa về $\dfrac{1-z}{x}+\dfrac{z}{1-y}-1$.

**Bước 3.** Làm tương tự (hoán vị vòng $x\to y\to z\to x$) cho hai hạng tử còn lại, cộng ba kết quả để bất đẳng thức thành tổng sáu phân thức không nhỏ hơn $6$.

**Bước 4.** Ghép sáu phân thức thành ba cặp nghịch đảo của nhau rồi dùng $\dfrac pq+\dfrac qp\ge2$ cho từng cặp, và tìm điểm dấu "=" từ ba điều kiện cùng lúc.

**Chú ý:** $D$ là biểu thức đối xứng nên bất đẳng thức giữ nguyên khi hoán vị vòng; cách ghép cặp phải đúng (ví dụ $\dfrac{1-z}{x}$ ghép với $\dfrac{x}{1-z}$) chứ không phải ghép hai số hạng đứng cạnh nhau.

**Phần 2. Trình bày**

Vì $x,y,z\in(0;1)$ nên $x,y,z,1-x,1-y,1-z>0$ và $D=xyz+(1-x)(1-y)(1-z)>0$.

Ta có $\dfrac{D}{x(1-y)}=\dfrac{xyz}{x(1-y)}+\dfrac{(1-x)(1-y)(1-z)}{x(1-y)}=\dfrac{yz}{1-y}+\dfrac{(1-x)(1-z)}{x}$

Vì $\dfrac{y}{1-y}=\dfrac1{1-y}-1$ và $\dfrac{1-x}{x}=\dfrac1x-1$ nên $\dfrac{yz}{1-y}=\dfrac{z}{1-y}-z$ và $\dfrac{(1-x)(1-z)}{x}=\dfrac{1-z}{x}-(1-z)$

Suy ra $\dfrac{D}{x(1-y)}=\dfrac{1-z}{x}+\dfrac{z}{1-y}-1$

Vì $D$ không đổi khi hoán vị vòng $x\to y\to z\to x$ nên $\dfrac{D}{y(1-z)}=\dfrac{1-x}{y}+\dfrac{x}{1-z}-1$ và $\dfrac{D}{z(1-x)}=\dfrac{1-y}{z}+\dfrac{y}{1-x}-1$

Nhân hai vế bất đẳng thức của đề với $D>0$, bất đẳng thức tương đương

$\left(\dfrac{1-z}{x}+\dfrac{z}{1-y}+\dfrac{1-x}{y}+\dfrac{x}{1-z}+\dfrac{1-y}{z}+\dfrac{y}{1-x}\right)-3\ge3$

$\Leftrightarrow\dfrac{1-z}{x}+\dfrac{z}{1-y}+\dfrac{1-x}{y}+\dfrac{x}{1-z}+\dfrac{1-y}{z}+\dfrac{y}{1-x}\ge6$ (2)

Theo bất đẳng thức $\dfrac pq+\dfrac qp\ge2$ với $p,q>0$: $\dfrac{1-z}{x}+\dfrac{x}{1-z}\ge2$; $\dfrac{z}{1-y}+\dfrac{1-y}{z}\ge2$; $\dfrac{1-x}{y}+\dfrac{y}{1-x}\ge2$

Cộng ba bất đẳng thức được (2) nên bất đẳng thức của đề đúng.

Dấu "=" xảy ra khi $x=1-z$, $z=1-y$, $y=1-x$, tức $x+z=y+z=x+y=1$, suy ra $x=y=z=\dfrac12$.

Vậy bất đẳng thức được chứng minh.

