=== C7.1a@p303
- bai: 1 · y: a · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020101
- cong_cu: tách hằng số để các tử có nhân tử chung · đặt nhân tử chung
- kiem: nghiem | \dfrac{x-15}{2000}+\dfrac{x-14}{2001}+\dfrac{x-13}{2002} = \dfrac{x-12}{2003}+2 | x
- ket_qua_sach: 2015
- dap_an: $S=\{2015\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $\dfrac{x-15}{2000}+\dfrac{x-14}{2001}+\dfrac{x-13}{2002}=\dfrac{x-12}{2003}+2$.
## SACH
$\dfrac{x-15}{2000}+\dfrac{x-14}{2001}+\dfrac{x-13}{2002}=\dfrac{x-12}{2003}+2$
$\Leftrightarrow\dfrac{x-15}{2000}-1+\dfrac{x-14}{2001}-1+\dfrac{x-13}{2002}-1=\dfrac{x-12}{2003}-1$
$\Leftrightarrow(x-2015)\left(\dfrac{1}{2000}+\dfrac{1}{2001}+\dfrac{1}{2002}-\dfrac{1}{2003}\right)=0$
$\Leftrightarrow x=2015$ vì $\dfrac{1}{2000}+\dfrac{1}{2001}+\dfrac{1}{2002}-\dfrac{1}{2003}\neq0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với mỗi phân số, tử trừ mẫu đều cho cùng một biểu thức, nên bớt $1$ ở từng phân số thì cả bốn tử số thành một biểu thức giống nhau — dấu hiệu để chuyển vế rồi đặt nhân tử chung, không cần quy đồng.

**Bước 1.** Nhận ra rằng $(x-15)-2000$ và $(x-14)-2001$ cùng bằng một biểu thức (các phân số còn lại cũng vậy), nên bớt $1$ ở mỗi phân số thì tử số của chúng trùng nhau.

**Bước 2.** Trừ hai vế đi $3$: ba phân số ở vế trái mỗi phân số bớt $1$, còn vế phải là $\dfrac{x-12}{2003}-1$; cả bốn tử số đều thành $x-2015$.

**Bước 3.** Chuyển vế phải sang trái và đặt $x-2015$ làm nhân tử chung, được tích hai thừa số bằng $0$.

**Bước 4.** Chỉ ra thừa số trong ngoặc khác $0$ (so sánh hai phân số có cùng tử $1$) để chỉ còn một thừa số phải bằng $0$.

**Chú ý:** Khi các phân số cùng dạng "$x$ trừ một số, chia cho một số", cộng hoặc trừ cùng một hằng số cho mỗi phân số thường tạo ra nhân tử chung; quy đồng bốn mẫu $2000,2001,2002,2003$ là con đường rất dài.

**Phần 2. Trình bày**

$\dfrac{x-15}{2000}+\dfrac{x-14}{2001}+\dfrac{x-13}{2002}=\dfrac{x-12}{2003}+2$

$\Leftrightarrow\left(\dfrac{x-15}{2000}-1\right)+\left(\dfrac{x-14}{2001}-1\right)+\left(\dfrac{x-13}{2002}-1\right)=\dfrac{x-12}{2003}-1$

$\Leftrightarrow\dfrac{x-2015}{2000}+\dfrac{x-2015}{2001}+\dfrac{x-2015}{2002}-\dfrac{x-2015}{2003}=0$

$\Leftrightarrow(x-2015)\left(\dfrac{1}{2000}+\dfrac{1}{2001}+\dfrac{1}{2002}-\dfrac{1}{2003}\right)=0$

Vì $\dfrac{1}{2000}>\dfrac{1}{2003}$ nên thừa số trong ngoặc dương, do đó $x-2015=0$.

Vậy $S=\{2015\}$.

=== C7.1b@p303
- bai: 1 · y: b · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: đưa về bình phương cộng hằng số · đánh giá hai vế
- kiem: khong
- ket_qua_sach: x=3; y=-1; z=2
- dap_an: $(x;y;z)=(3;-1;2)$
- ghi_chu_nghi: Chưa chắc nhóm: T18T010102 (đưa về bình phương, đánh giá hai vế) hay T18T020101 (đề bảo giải phương trình, nhưng là phương trình ba ẩn). Đề gốc ghi chung "Giải các phương trình sau" cho cả ý a, b; ở đây ghi "ẩn x,y,z" cho rõ.
## DE
Giải phương trình (ẩn $x,y,z$): $(x^2-6x+11)(y^2+2y+4)=2+4z-z^2$.
## SACH
Ta có $(x^2-6x+11)(y^2+2y+4)$
$=[(x-3)^2+2][(y+1)^2+3]\ge2\cdot3=6$
$2+4z-z^2=6-(z-2)^2\le6$
Vậy $(x^2-6x+11)(y^2+2y+4)=2+4z-z^2$
$\Leftrightarrow\begin{cases}(x^2-6x+11)(y^2+2y+4)=6\\2+4z-z^2=6\end{cases}\Leftrightarrow(x=3;y=-1;z=2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tích hai tam thức bậc hai luôn dương có giá trị nhỏ nhất, vế phải là tam thức bậc hai có giá trị lớn nhất — đánh giá được hai vế về cùng một số thì phương trình chỉ xảy ra khi cả hai vế cùng đạt đúng số đó.

**Bước 1.** Viết mỗi tam thức ở vế trái thành bình phương cộng một hằng số dương để tìm giá trị nhỏ nhất của từng thừa số, từ đó chặn dưới cả tích.

**Bước 2.** Làm tương tự với vế phải: viết thành hằng số trừ một bình phương để chặn trên.

**Bước 3.** Vế trái không nhỏ hơn một số, vế phải không lớn hơn đúng số ấy, nên hai vế bằng nhau khi và chỉ khi cả hai cùng bằng số đó.

**Bước 4.** Cho các bình phương bằng $0$ ở từng chỗ dấu bằng xảy ra để tìm $x,y,z$.

**Chú ý:** Trước khi nhân hai bất đẳng thức cùng chiều phải chắc cả hai thừa số đều dương; ở đây hai tam thức luôn lớn hơn hằng số dương nên nhân được.

**Phần 2. Trình bày**

$(x^2-6x+11)(y^2+2y+4)=[(x-3)^2+2][(y+1)^2+3]$

Vì $(x-3)^2+2\ge2>0$ và $(y+1)^2+3\ge3>0$ nên vế trái $\ge2\cdot3=6$, dấu bằng xảy ra khi $x=3$ và $y=-1$.

Vế phải: $2+4z-z^2=6-(z-2)^2\le6$, dấu bằng xảy ra khi $z=2$.

Vậy phương trình xảy ra khi và chỉ khi hai vế cùng bằng $6$, tức là $x=3$; $y=-1$; $z=2$.

Vậy $(x;y;z)=(3;-1;2)$.

=== C7.2a@p303
- bai: 2 · y: a · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: nhóm hạng tử · luỹ thừa bậc lẻ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a^2+b^2=c^2+d^2=5$; $ad+bc=0$. Chứng minh rằng $a^{2017}b^{2017}+c^{2017}d^{2017}=0$.
## SACH
$5(ab+cd)=ab(c^2+d^2)+cd(a^2+b^2)$
$=abc^2+abd^2+a^2cd+b^2cd$
$=(abc^2+a^2cd)+(abd^2+b^2cd)$
$=ac(bc+ad)+bd(ad+bc)$
$=ac\cdot 0+bd\cdot 0$
$\Rightarrow ab+cd=0\Rightarrow ab=-cd$
$\Rightarrow(ab)^{2017}=(-cd)^{2017}\Rightarrow a^{2017}b^{2017}=-c^{2017}d^{2017}$
$\Rightarrow a^{2017}b^{2017}+c^{2017}d^{2017}=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần chứng tỏ $ab+cd=0$: nhân nó với $5$, viết $5$ bằng $c^2+d^2$ ở hạng tử này và $a^2+b^2$ ở hạng tử kia để khi nhóm lại lộ ra nhân tử $ad+bc=0$; có $ab=-cd$ thì nâng lên luỹ thừa lẻ $2017$ là xong.

**Bước 1.** Viết $5(ab+cd)=5ab+5cd$ rồi thay $5$ lần lượt bằng $c^2+d^2$ và $a^2+b^2$ (cả hai đều bằng $5$ theo giả thiết).

**Bước 2.** Khai triển, rồi nhóm bốn hạng tử thành hai nhóm sao cho mỗi nhóm đều chứa nhân tử $bc+ad$.

**Bước 3.** Dùng $ad+bc=0$ để suy ra $ab+cd=0$, tức $ab=-cd$.

**Bước 4.** Nâng hai vế lên luỹ thừa $2017$ (số mũ lẻ nên dấu trừ vẫn còn) rồi chuyển vế để được điều phải chứng minh.

**Chú ý:** Chỉ luỹ thừa bậc lẻ mới giữ nguyên dấu: $(-cd)^{2017}=-(cd)^{2017}$; với số mũ chẵn thì hai vế sẽ bằng nhau chứ không đối nhau.

**Phần 2. Trình bày**

$5(ab+cd)=ab(c^2+d^2)+cd(a^2+b^2)$

$=abc^2+abd^2+a^2cd+b^2cd$

$=ac(bc+ad)+bd(ad+bc)$

$=(ad+bc)(ac+bd)=0$

Suy ra $ab+cd=0$, tức $ab=-cd$.

Do đó $(ab)^{2017}=(-cd)^{2017}=-c^{2017}d^{2017}$, hay $a^{2017}b^{2017}+c^{2017}d^{2017}=0$.

Vậy $a^{2017}b^{2017}+c^{2017}d^{2017}=0$.

=== C7.2b@p303
- bai: 2 · y: b · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: quy đồng mẫu · nhóm hạng tử đa thức hoán vị vòng
- kiem: gia_tri | \dfrac{yz}{(x-y)(x-z)}+\dfrac{zx}{(y-x)(y-z)}+\dfrac{xy}{(z-x)(z-y)} | x=3; y=6; z=-2
- ket_qua_sach: 1
- dap_an: $1$
- ghi_chu_nghi: Điều kiện 1/x+1/y+1/z=0 không cần dùng: A=1 với mọi x,y,z đôi một khác nhau (kiểm bằng cách thế x=3,y=6,z=-2 thỏa điều kiện, và bằng biến đổi không dùng điều kiện). Sách có suy ra x²+2yz=(x-y)(x-z) nhưng sau đó không dùng đến. Dòng thứ tư của sách in "z(y-z)(y-z)+z(y-x)(z-y)" không suy ra được từ dòng trên (đúng phải gom thành z(y-z)(y-x)+x(x-y)(y-z)), và dòng cuối "(x-y)(y-z)(-z+x)" mới đúng là tử.
## DE
Cho $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=0$. Tính giá trị của biểu thức $A=\dfrac{yz}{(x-y)(x-z)}+\dfrac{zx}{(y-x)(y-z)}+\dfrac{xy}{(z-x)(z-y)}$.
## SACH
Ta có $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=0$. Do đó $xy+yz+zx=0$
Nên $x^2+2yz=x^2+yz-xy-zx=x(x-y)-z(x-y)=(x-y)(x-z)$
Tương tự $y^2+2zx=(y-x)(y-z)$; $z^2+2xy=(z-x)(z-y)$
Do đó $A=\dfrac{yz}{(x-y)(x-z)}+\dfrac{zx}{(y-x)(y-z)}+\dfrac{xy}{(z-x)(z-y)}$
$=\dfrac{yz(y-z)+zx(z-x)+xy(x-y)}{(x-y)(x-z)(y-z)}$
$=\dfrac{yz(y-z)+zx(z-y+y-x)+xy(x-y)}{(x-y)(x-z)(y-z)}$
$=\dfrac{yz(y-z)+zx(z-y)+zx(y-x)+xy(x-y)}{(x-y)(x-z)(y-z)}$
$=\dfrac{z(y-z)(y-z)+z(y-x)(z-y)}{(x-y)(x-z)(y-z)}$
$=\dfrac{(x-y)(y-z)(-z+x)}{(x-y)(x-z)(y-z)}=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu số chỉ khác nhau về dấu của các nhân tử $x-y$, $x-z$, $y-z$; đổi dấu cho cùng một dạng rồi quy đồng, tử số là đa thức hoán vị vòng nên phân tích được thành tích và rút gọn hết.

**Bước 1.** Đổi dấu các nhân tử ở phân số thứ hai và thứ ba để cả ba mẫu cùng gồm các nhân tử $x-y$, $x-z$, $y-z$.

**Bước 2.** Quy đồng ba phân số về mẫu chung $(x-y)(x-z)(y-z)$, giữ nguyên tử số dưới dạng tổng ba hạng tử.

**Bước 3.** Tách $z-x=(z-y)+(y-x)$ trong tử số để nhóm các hạng tử thành hai cụm, mỗi cụm đều chứa nhân tử $(x-y)(y-z)$ sau khi đổi dấu hợp lí.

**Bước 4.** Đặt $(x-y)(y-z)$ làm nhân tử chung ở tử số rồi rút gọn với mẫu.

**Chú ý:** Phép rút gọn này đúng với mọi $x,y,z$ đôi một khác nhau; điều kiện $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=0$ chỉ bảo đảm ba số đều khác $0$ và không cần dùng đến khi biến đổi.

**Phần 2. Trình bày**

$A=\dfrac{yz}{(x-y)(x-z)}-\dfrac{zx}{(x-y)(y-z)}+\dfrac{xy}{(x-z)(y-z)}$

$=\dfrac{yz(y-z)-zx(x-z)+xy(x-y)}{(x-y)(x-z)(y-z)}$

$=\dfrac{yz(y-z)+zx(z-y)+zx(y-x)+xy(x-y)}{(x-y)(x-z)(y-z)}$

$=\dfrac{z(y-z)(y-x)+x(x-y)(y-z)}{(x-y)(x-z)(y-z)}$

$=\dfrac{(x-y)(y-z)(x-z)}{(x-y)(x-z)(y-z)}$

$=1$

Vậy $A=1$.

=== C7.3a@p303
- bai: 3 · y: a · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: hiệu hai bình phương · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in nhầm ở dòng kết luận: "(x+y-z)(x+z-y)(y-z+x)>0", thừa số thứ ba đúng phải là (y+z-x).
## DE
Cho $x,y,z$ là độ dài ba cạnh của một tam giác và $A=4x^2y^2-(x^2+y^2-z^2)^2$. Chứng minh rằng $A>0$.
## SACH
Với $x,y,z$ là độ dài ba cạnh tam giác, ta có:
$A=4x^2y^2-(x^2+y^2-z^2)^2=(2xy+x^2+y^2-z^2)(2xy-x^2-y^2+z^2)$
$=[(x+y)^2-z^2][z^2-(x-y)^2]$
$=(x+y-z)(x+y+z)(z+x-y)(z-x+y)$
Theo bất đẳng thức tam giác, ta được:
$\begin{cases}x+y>z\\x+z>y\\y+z>x\end{cases}\Rightarrow\begin{cases}x+y-z>0\\x+z-y>0\\y+z-x>0\end{cases}\Rightarrow(x+y-z)(x+z-y)(y-z+x)>0$
Kết hợp với $x+y+z>0$ cho $A>0$ (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $A$ có dạng hiệu hai bình phương $(2xy)^2-(x^2+y^2-z^2)^2$, phân tích được thành tích bốn nhân tử bậc nhất mà mỗi nhân tử đều dương nhờ bất đẳng thức tam giác.

**Bước 1.** Viết $4x^2y^2=(2xy)^2$ và dùng hiệu hai bình phương để tách $A$ thành tích hai thừa số.

**Bước 2.** Nhận ra mỗi thừa số lại là hiệu hai bình phương: $2xy+x^2+y^2=(x+y)^2$ và $2xy-x^2-y^2=-(x-y)^2$, rồi phân tích tiếp thành bốn nhân tử bậc nhất.

**Bước 3.** Dùng bất đẳng thức tam giác để xét dấu ba nhân tử có chứa $z$ trừ đi các cạnh kia, nhân tử còn lại là chu vi nên dương.

**Chú ý:** Ba nhân tử $x+y-z$, $z+x-y$, $z-x+y$ dương chính là ba bất đẳng thức tam giác; đề cho độ dài cạnh nên không thể bỏ giả thiết này.

**Phần 2. Trình bày**

$A=(2xy)^2-(x^2+y^2-z^2)^2=(2xy+x^2+y^2-z^2)(2xy-x^2-y^2+z^2)$

$=[(x+y)^2-z^2][z^2-(x-y)^2]$

$=(x+y-z)(x+y+z)(z+x-y)(z-x+y)$

Vì $x,y,z$ là độ dài ba cạnh của một tam giác nên theo bất đẳng thức tam giác: $x+y-z>0$, $z+x-y>0$, $z-x+y>0$; ngoài ra $x+y+z>0$.

Vậy $A>0$.

=== C7.3b@p303
- bai: 3 · y: b · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: thế biến · khử mẫu · phân tích đa thức bậc ba
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in sai ở dòng khai triển: "...-12x+9x≥7-7x" (đúng là +8x, vì vế trái có +8x) và dòng kế "-27x+2+63x^2-33x+5≥0" bị lỗi (đúng là -27x^3+63x^2-33x+5≥0, khớp với các dòng sau). Kết luận của sách đúng.
## DE
Cho $x,y$ là hai số dương thỏa mãn $x+y=1$. Chứng minh rằng $3(3x-2)^2+\dfrac{8x}{y}\ge7$.
## SACH
Từ $x+y=1$, ta có $y=1-x>0$, $x<1$
Do đó $3(3x-2)^2+\dfrac{8x}{y}\ge7\Leftrightarrow3(9x^2-12x+4)+\dfrac{8x}{1-x}\ge7$
$\Leftrightarrow(27x^2-36x+12)(1-x)+8x\ge7(1-x)$
$\Leftrightarrow27x^2-27x^3-36x+36x^2+12-12x+9x\ge7-7x$
$\Leftrightarrow-27x+2+63x^2-33x+5\ge0$
$\Leftrightarrow-27x+9x^2+54x^2-18x-15x+5\ge0$
$\Leftrightarrow(-3x+1)(9x^2-18x+5)\ge0$
$\Leftrightarrow(-3x+1)(9x^2-3x-15x+5)\ge0$
$\Leftrightarrow(-3x+1)^2(-3x+5)\ge0$ (Bất đẳng thức đúng, vì $(-3x+1)^2\ge0$; $x<1$ nên $-3x+5>0$)
Vậy có $3(3x-2)^2+\dfrac{8x}{y}\ge7$
Dấu "=" xảy ra $\Leftrightarrow x=\dfrac{1}{3}$ và $y=\dfrac{2}{3}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có $x+y=1$ nên thay $y=1-x$ rồi khử mẫu bằng cách nhân với $1-x>0$, đưa bất đẳng thức về một đa thức bậc ba của $x$ không âm; đa thức này có nghiệm kép nên phân tích được thành bình phương nhân một nhân tử dương.

**Bước 1.** Thay $y=1-x$, ghi lại điều kiện $0<x<1$, rồi nhân hai vế với $1-x>0$ để khử mẫu mà không đổi chiều bất đẳng thức.

**Bước 2.** Khai triển và chuyển hết sang vế trái được một đa thức bậc ba $-27x^3+63x^2-33x+5\ge0$.

**Bước 3.** Nhẩm nghiệm $x=\dfrac{1}{3}$ rồi tách hạng tử để đặt $1-3x$ làm nhân tử chung, phân tích tiếp tam thức bậc hai còn lại.

**Bước 4.** Nhận ra tích có dạng (bình phương) nhân với một nhân tử dương nhờ $x<1$, từ đó kết luận và tìm dấu bằng.

**Chú ý:** Nhân hai vế với một biểu thức chỉ được giữ chiều bất đẳng thức khi biểu thức đó dương; ở đây $1-x=y>0$.

**Phần 2. Trình bày**

Vì $x,y>0$ và $x+y=1$ nên $y=1-x$ và $0<x<1$.

Bất đẳng thức cần chứng minh $\Leftrightarrow3(9x^2-12x+4)+\dfrac{8x}{1-x}\ge7$

$\Leftrightarrow(27x^2-36x+12)(1-x)+8x\ge7(1-x)$ (nhân hai vế với $1-x>0$)

$\Leftrightarrow-27x^3+63x^2-33x+5\ge0$

$\Leftrightarrow9x^2(1-3x)-18x(1-3x)+5(1-3x)\ge0$

$\Leftrightarrow(1-3x)(9x^2-18x+5)\ge0$

$\Leftrightarrow(1-3x)(3x-1)(3x-5)\ge0$

$\Leftrightarrow(1-3x)^2(5-3x)\ge0$

Bất đẳng thức cuối đúng vì $(1-3x)^2\ge0$ và $5-3x>0$ (do $x<1$). Vậy $3(3x-2)^2+\dfrac{8x}{y}\ge7$.

Dấu "=" xảy ra khi $x=\dfrac{1}{3}$, khi đó $y=\dfrac{2}{3}$.

=== C7.6a@p303
- bai: 6 · y: a · trang: 303 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040102
- cong_cu: dấu hiệu chia hết cho 3 và 9 · số chính phương chia hết cho số nguyên tố
- kiem: khong
- ket_qua_sach: không
- dap_an: Không
- ghi_chu_nghi: Chưa chắc nhóm: T18T040102 (số dư, đồng dư mod 9) hay T18T040202 (số chính phương).
## DE
Tổng các chữ số của một số chính phương có thể là $2019$ được không? Hãy giải thích.
## SACH
Giả sử tồn tại số chính phương $a^2$ ($a\in\mathbb N$) có tổng các chữ số là $2019$
Vì $2019\vdots3$ nên $a^2\vdots3$, $3$ là số nguyên tố
Do đó $a\vdots3$. Ta có $a^2\vdots9\Rightarrow$ Tổng các chữ số của số $a^2$ là số chia hết cho $9$
Mà $2019\not\vdots9$. Điều giả sử ở trên sai
Vậy không tồn tại số chính phương có tổng các chữ số là $2019$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Một số và tổng các chữ số của nó cùng chia hết hoặc cùng không chia hết cho $3$ và cho $9$; số chính phương mà chia hết cho $3$ thì chia hết cho $9$, trong khi $2019$ chia hết cho $3$ nhưng không chia hết cho $9$.

**Bước 1.** Giả sử có số chính phương $a^2$ với $a\in\mathbb N$ mà tổng các chữ số bằng $2019$, rồi tìm hệ quả của điều đó.

**Bước 2.** Dùng dấu hiệu chia hết cho $3$: tổng chữ số $2019$ chia hết cho $3$ nên $a^2$ chia hết cho $3$, rồi suy ra $a$ chia hết cho $3$ vì $3$ là số nguyên tố.

**Bước 3.** Từ $a\vdots3$ suy ra $a^2\vdots9$, nên theo dấu hiệu chia hết cho $9$ tổng các chữ số của $a^2$ cũng chia hết cho $9$.

**Bước 4.** Đối chiếu với $2019$ để thấy mâu thuẫn và kết luận.

**Chú ý:** Với $p$ nguyên tố, $a^2\vdots p$ thì $a\vdots p$; với hợp số điều này không còn đúng (chẳng hạn $2^2\vdots4$ nhưng $2\not\vdots4$).

**Phần 2. Trình bày**

Giả sử tồn tại số chính phương $a^2$ ($a\in\mathbb N$) có tổng các chữ số là $2019$.

Vì $2019\vdots3$ nên $a^2\vdots3$ (dấu hiệu chia hết cho $3$); do $3$ là số nguyên tố nên $a\vdots3$.

Suy ra $a^2\vdots9$, nên tổng các chữ số của $a^2$ chia hết cho $9$ (dấu hiệu chia hết cho $9$).

Nhưng $2019=9\cdot224+3$ nên $2019\not\vdots9$. Mâu thuẫn với giả sử.

Vậy không tồn tại số chính phương nào có tổng các chữ số là $2019$.

=== C7.6b@p304
- bai: 6 · y: b · trang: 304 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: chặn bằng bất đẳng thức · tính chẵn lẻ
- kiem: khong
- ket_qua_sach: x=1; y=2
- dap_an: $(x;y)=(1;2)$
- ghi_chu_nghi:
## DE
Tìm các số nguyên dương $x,y$ thỏa mãn phương trình: $(x+y)^5=120y+3$.
## SACH
Vì $x,y\in\mathbb N^*$. Do đó $(x+y)^5=120y+3<120y+120x=120(x+y)$
Suy ra $(x+y)^4<120$. Mà $120<256=4^4$
Nên $(x+y)^4<4^4\Rightarrow x+y<4$
Do đó $2\le x+y<4$
Mặt khác $120y+3$ là số lẻ nên $(x+y)^5$ là số lẻ
$\Rightarrow x+y$ là số lẻ
$2\le x+y<4$, $x+y$ là số lẻ $\Rightarrow x+y=3$
Do đó $(x;y)=(2;1)$, $(x;y)=(1;2)$
Thử lại chỉ có $(x;y)=(1;2)$ thích hợp
Vậy $x=1$; $y=2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải $120y+3$ chỉ hơn $120y$ một chút nên bị chặn trên bởi $120(x+y)$; chia cho $x+y$ được một luỹ thừa bậc bốn bị chặn bởi $4^4$, cộng thêm tính lẻ của vế phải thì chỉ còn rất ít khả năng để thử.

**Bước 1.** Dùng $x\ge1$ để có $3<120x$, từ đó $(x+y)^5<120(x+y)$, rồi chia hai vế cho $x+y>0$ để hạ bậc xuống $(x+y)^4<120$.

**Bước 2.** So sánh $120$ với $4^4=256$ để suy ra $x+y<4$, kết hợp $x,y\ge1$ để thu hẹp tổng $x+y$ vào một khoảng nhỏ.

**Bước 3.** Nhận xét vế phải $120y+3$ là số lẻ nên $x+y$ phải là số lẻ, từ đó cố định được giá trị của $x+y$.

**Bước 4.** Liệt kê các cặp $(x;y)$ có tổng đó rồi thử lại vào phương trình, loại cặp không thỏa mãn.

**Chú ý:** Các bước chặn chỉ cho điều kiện cần, nên cuối cùng bắt buộc thử lại từng cặp.

**Phần 2. Trình bày**

Vì $x,y\in\mathbb N^*$ nên $(x+y)^5=120y+3<120y+120x=120(x+y)$.

Suy ra $(x+y)^4<120<256=4^4$, do đó $x+y<4$. Lại có $x+y\ge2$.

Mặt khác $120y+3$ là số lẻ nên $(x+y)^5$ lẻ, suy ra $x+y$ là số lẻ.

Từ $2\le x+y<4$ và $x+y$ lẻ ta được $x+y=3$, nên $(x;y)=(2;1)$ hoặc $(x;y)=(1;2)$.

Thử lại: với $(2;1)$ có $3^5=243\ne120\cdot1+3=123$, loại; với $(1;2)$ có $3^5=243=120\cdot2+3$, thỏa mãn.

Vậy $(x;y)=(1;2)$.

=== C8.1a@p307
- bai: 1 · y: a · trang: 307 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: tách hạng tử
- kiem: bang | 3x^2-10x-8
- ket_qua_sach: (x-4)(3x+2)
- dap_an: $(x-4)(3x+2)$
- ghi_chu_nghi:
## DE
Phân tích đa thức sau thành nhân tử: $3x^2-10x-8$.
## SACH
$3x^2-10x-8=3x^2-12x+2x-8=3x(x-4)+2(x-4)$
$=(x-4)(3x+2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hệ số đầu khác $1$ nên phải tách hạng tử bậc nhất thành hai hạng tử có hệ số nhân với nhau bằng tích $3\cdot(-8)$ của hệ số đầu và hệ số tự do.

**Bước 1.** Tìm hai số có tích $-24$ và tổng $-10$, đó là $-12$ và $2$, rồi tách hạng tử bậc nhất theo hai số này.

**Bước 2.** Nhóm hai cặp hạng tử và đặt nhân tử chung riêng ở từng cặp để lộ ra cùng một thừa số.

**Bước 3.** Đặt thừa số chung ấy ra ngoài, được tích hai nhân tử bậc nhất không phân tích tiếp được.

**Chú ý:** Nên nhân lại hai nhân tử để kiểm tra có trở về đa thức đề cho hay không.

**Phần 2. Trình bày**

$3x^2-10x-8=3x^2-12x+2x-8$

$=3x(x-4)+2(x-4)$

$=(x-4)(3x+2)$

=== C8.1b@p307
- bai: 1 · y: b · trang: 307 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010201
- cong_cu:
- kiem: bang | 18x^3-\dfrac{8}{25}x
- ket_qua_sach: 2x(3x-\dfrac{2}{5})(3x+\dfrac{2}{5})
- dap_an: $2x\left(3x-\dfrac{2}{5}\right)\left(3x+\dfrac{2}{5}\right)$
- ghi_chu_nghi:
## DE
Phân tích đa thức sau thành nhân tử: $18x^3-\dfrac{8}{25}x$.
## SACH
$18x^3-\dfrac{8}{25}x=2x\left(9x^2-\dfrac{4}{25}\right)=2x\left(3x-\dfrac{2}{5}\right)\left(3x+\dfrac{2}{5}\right)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai hạng tử cùng chứa $x$ và có hệ số $18=2\cdot9$, $\dfrac{8}{25}=2\cdot\dfrac{4}{25}$, nên đặt $2x$ ra ngoài thì trong ngoặc còn hiệu hai bình phương.

**Bước 1.** Tìm nhân tử chung của hai hạng tử: cả hai cùng chứa $x$ và cùng chứa thừa số $2$ trong hệ số.

**Bước 2.** Đặt $2x$ ra ngoài; trong ngoặc còn hai hạng tử mà hệ số đều là bình phương của một số.

**Bước 3.** Viết mỗi hạng tử trong ngoặc thành bình phương rồi dùng hằng đẳng thức hiệu hai bình phương.

**Chú ý:** Nên đặt nhân tử chung trước rồi mới nhìn hằng đẳng thức; có thể viết gọn hệ số phân số thành $\dfrac{2}{25}x(15x-2)(15x+2)$, hai cách đều đúng.

**Phần 2. Trình bày**

$18x^3-\dfrac{8}{25}x=2x\left(9x^2-\dfrac{4}{25}\right)$

$=2x\left(3x-\dfrac{2}{5}\right)\left(3x+\dfrac{2}{5}\right)$

=== C8.2a@p307
- bai: 2 · y: a · trang: 307 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: hiệu hai bình phương · cộng vế theo vế, các số hạng triệt tiêu
- kiem: khong
- ket_qua_sach: 25502500
- dap_an: $S=25502500$
- ghi_chu_nghi: Chưa chắc nhóm: T18T010502 (tổng có quy luật, triệt tiêu từng cặp) hay T18T010101 (ứng dụng hằng đẳng thức). Đề gồm chứng minh đẳng thức rồi tính tổng dùng đẳng thức đó nên giữ một câu.
## DE
Chứng minh rằng: $4n^3=n^2(n+1)^2-(n-1)^2n^2$.

Từ đẳng thức trên tính tổng: $S=1^3+2^3+3^3+\dots+100^3$
## SACH
$n^2(n+1)^2-(n-1)^2n^2=n^2[(n+1)^2-(n-1)^2]$
$=n^2(n^2+2n+1-n^2+2n-1)=4n^3$
Áp dụng trên, ta có:
$4\cdot1^3=1^2\cdot2^2-0^2\cdot1^2$
$4\cdot2^3=2^2\cdot3^2-1^2\cdot2^2$
$\dots$
$4\cdot100^3=100^2\cdot101^2-99^2\cdot100^2$
Suy ra: $4S=100^2\cdot101^2$. Do đó: $S=25502500$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải là hiệu của cùng một biểu thức $f(n)=n^2(n+1)^2$ tính tại $n$ và tại $n-1$, nên khi cộng các đẳng thức ứng với $n=1,2,\dots,100$ thì các số hạng triệt tiêu từng đôi một.

**Bước 1.** Đặt $n^2$ làm nhân tử chung ở vế phải rồi dùng hiệu hai bình phương (hoặc khai triển) trong ngoặc để chứng minh đẳng thức.

**Bước 2.** Viết đẳng thức cho $n=1,2,\dots,100$ và quan sát: số hạng bị trừ của lần $n$ chính là số hạng được cộng của lần $n-1$.

**Bước 3.** Cộng vế theo vế: vế trái thành $4$ lần tổng cần tính, vế phải chỉ còn số hạng cuối của lần $n=100$ trừ số hạng đầu của lần $n=1$.

**Bước 4.** Tính vế phải rồi chia cho $4$ để được $S$.

**Chú ý:** Cách cộng triệt tiêu này cũng cho công thức tổng quát $1^3+2^3+\dots+n^3=\left[\dfrac{n(n+1)}{2}\right]^2$; số hạng $0^2\cdot1^2$ của lần $n=1$ bằng $0$.

**Phần 2. Trình bày**

$n^2(n+1)^2-(n-1)^2n^2=n^2[(n+1)^2-(n-1)^2]$

$=n^2(n^2+2n+1-n^2+2n-1)=n^2\cdot4n=4n^3$

Vậy $4n^3=n^2(n+1)^2-(n-1)^2n^2$.

Áp dụng với $n=1,2,\dots,100$:

$4\cdot1^3=1^2\cdot2^2-0^2\cdot1^2$

$4\cdot2^3=2^2\cdot3^2-1^2\cdot2^2$

$\dots$

$4\cdot100^3=100^2\cdot101^2-99^2\cdot100^2$

Cộng vế theo vế, các số hạng ở giữa triệt tiêu từng đôi một và $0^2\cdot1^2=0$, nên $4S=100^2\cdot101^2$.

Do đó $S=\dfrac{100^2\cdot101^2}{4}=5050^2=25502500$.

=== C8.2b@p308
- bai: 2 · y: b · trang: 308 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T050101
- cong_cu: sắp thứ tự (cực hạn)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: T18T050101 (sắp thứ tự, xét số nhỏ nhất) hay T18T030103 (kĩ thuật bất đẳng thức khác). Đề không nói rõ loại số; hiểu là số thực.
## DE
Cho $5$ số thỏa mãn điều kiện tổng của $2$ số bất kì trong chúng nhỏ hơn tổng $3$ số còn lại. Chứng minh rằng tích của $5$ số đã cho là một số dương.
## SACH
Giả sử có $5$ số $a,b,c,d,e$ và $a\ge b\ge c\ge d\ge e$ $(*)$
Từ giả thiết ta có: $c+d+e>a+b\Rightarrow e>(a-c)+(b-d)\ge0$
Do đó $abcde>0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện giống nhau với mọi cặp số nên được sắp thứ tự năm số; chỉ cần dùng điều kiện cho hai số lớn nhất để chứng tỏ số nhỏ nhất đã dương, khi đó cả năm số dương.

**Bước 1.** Gọi năm số là $a,b,c,d,e$ và sắp xếp $a\ge b\ge c\ge d\ge e$; việc này hợp lệ vì giả thiết không phụ thuộc thứ tự các số.

**Bước 2.** Áp dụng giả thiết cho cặp hai số lớn nhất $a,b$: tổng của chúng nhỏ hơn tổng ba số còn lại.

**Bước 3.** Chuyển vế để biểu diễn $e$ lớn hơn tổng hai hiệu $a-c$ và $b-d$, rồi dùng thứ tự để thấy tổng đó không âm, suy ra $e>0$.

**Bước 4.** Vì $e$ là số nhỏ nhất nên cả năm số đều dương, từ đó tích dương.

**Chú ý:** Đề không cho sẵn các số là dương; chính điều kiện về tổng buộc số nhỏ nhất phải dương.

**Phần 2. Trình bày**

Gọi năm số là $a,b,c,d,e$. Giả thiết không đổi khi hoán vị các số nên có thể giả sử $a\ge b\ge c\ge d\ge e$.

Theo giả thiết, tổng hai số $a,b$ nhỏ hơn tổng ba số còn lại: $a+b<c+d+e$.

Suy ra $e>(a-c)+(b-d)$.

Vì $a\ge c$ và $b\ge d$ nên $(a-c)+(b-d)\ge0$, do đó $e>0$.

Mà $e$ là số nhỏ nhất nên cả năm số $a,b,c,d,e$ đều dương, suy ra $abcde>0$.

Vậy tích của năm số đã cho là một số dương.

=== C8.3a@p308
- bai: 3 · y: a · trang: 308 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040201
- cong_cu: tính chất số nguyên tố (p chia hết tích thì p chia hết một thừa số)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "a>a+b hoặc b>a+b (vì a,b thuộc N*)": đúng phải là a<a+b hoặc b<a+b (một số nguyên dương nhỏ hơn a+b thì không chia hết cho a+b). Dấu giữa 1/b và 1/c ở dòng đầu bị mờ, theo đề chép là dấu "=".
## DE
Cho các số nguyên dương $a,b,c$ sao cho $\dfrac{1}{a}+\dfrac{1}{b}=\dfrac{1}{c}$. Chứng minh rằng $a+b$ không thể là số nguyên tố.
## SACH
$\Leftrightarrow\dfrac{1}{a}+\dfrac{1}{b}=\dfrac{1}{c}\Leftrightarrow\dfrac{a+b}{ab}=\dfrac{1}{c}\Leftrightarrow ab=c(a+b)$. Ta có $ab\vdots(a+b)$
Nếu $a+b$ là số nguyên tố thì $a\vdots(a+b)$ hoặc $b\vdots(a+b)$
$\Rightarrow a>a+b$ hoặc $b>a+b$ (vì $a,b\in\mathbb N^*$) (Điều này vô lí)
Như vậy $a+b$ là số nguyên tố là sai
Vậy $a+b$ không thể là số nguyên tố
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Quy đồng đưa giả thiết về $ab=c(a+b)$ nên $a+b$ là ước của tích $ab$; nếu $a+b$ nguyên tố thì nó phải là ước của $a$ hoặc của $b$, nhưng $a+b$ lớn hơn cả $a$ lẫn $b$.

**Bước 1.** Quy đồng vế trái rồi nhân chéo để được $ab=c(a+b)$, suy ra $ab$ chia hết cho $a+b$.

**Bước 2.** Giả sử $a+b$ là số nguyên tố, rồi dùng tính chất của số nguyên tố để suy ra $a$ hoặc $b$ chia hết cho $a+b$.

**Bước 3.** So sánh độ lớn: $a,b$ là số nguyên dương nên mỗi số nhỏ hơn $a+b$, mà một số nguyên dương nhỏ hơn $a+b$ không thể chia hết cho $a+b$; từ đó có mâu thuẫn.

**Chú ý:** Tính chất dùng ở bước 2: nếu số nguyên tố $p$ chia hết tích $mn$ thì $p$ chia hết $m$ hoặc $p$ chia hết $n$.

**Phần 2. Trình bày**

Từ $\dfrac{1}{a}+\dfrac{1}{b}=\dfrac{1}{c}$ ta có $\dfrac{a+b}{ab}=\dfrac{1}{c}$, tức $ab=c(a+b)$. Vậy $ab\vdots(a+b)$.

Giả sử $a+b$ là số nguyên tố. Khi đó $a\vdots(a+b)$ hoặc $b\vdots(a+b)$.

Nhưng $a,b$ là số nguyên dương nên $0<a<a+b$ và $0<b<a+b$, do đó $a\not\vdots(a+b)$ và $b\not\vdots(a+b)$. Mâu thuẫn.

Vậy $a+b$ không thể là số nguyên tố.

=== C8.3b@p308
- bai: 3 · y: b · trang: 308 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040201
- cong_cu: tính chất ước của tích hai số nguyên tố
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ở dòng (2) của sách, kí hiệu giữa (a+c)(b+c) và c bị mất nét; chép là "không chia hết" theo mạch lập luận (đối lập với (1)). Sách chưa nêu lí do (a+c)(b+c) không chia hết cho c; lời giải kho bổ sung (ước của tích hai số nguyên tố chỉ là 1, hai số đó và tích của chúng).
## DE
Cho các số nguyên dương $a,b,c$ sao cho $\dfrac{1}{a}+\dfrac{1}{b}=\dfrac{1}{c}$. Chứng minh rằng nếu $c>1$ thì $a+c$ và $b+c$ không thể đồng thời là số nguyên tố.
## SACH
Ta có: $(a+c)(b+c)=ab+ac+bc+c^2=ab+(a+b)c+c^2$
$=2(a+b)c+c^2=c(2a+2b+c)$. Nên $(a+c)(b+c)\vdots c$ $(1)$
Nếu $a+c$ và $b+c$ đồng thời là số nguyên tố
Mà $a+c>c$, $b+c>c$. Do đó $(a+c)(b+c)\not\vdots c$ $(2)$
$(1)$ và $(2)$ mâu thuẫn
Như vậy $a+c$ và $b+c$ không đồng thời là số nguyên tố
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ giả thiết $ab=c(a+b)$ tính được $(a+c)(b+c)$ là bội của $c$; nhưng nếu $a+c$ và $b+c$ đều nguyên tố thì các ước của tích chúng rất ít và không có ước nào nằm giữa $1$ và hai số đó, trong khi $1<c<a+c$ và $c<b+c$.

**Bước 1.** Quy đồng giả thiết về $ab=c(a+b)$ để có $ab$ ở dạng bội của $c$.

**Bước 2.** Khai triển $(a+c)(b+c)$, thay $ab=c(a+b)$ vào để chứng tỏ tích này chia hết cho $c$.

**Bước 3.** Giả sử $a+c$ và $b+c$ đều là số nguyên tố, rồi liệt kê tất cả ước dương của tích hai số nguyên tố ấy.

**Bước 4.** So sánh $c$ với các ước vừa liệt kê, thấy $c$ không trùng ước nào, từ đó mâu thuẫn với bước 2.

**Chú ý:** Trường hợp hai số nguyên tố bằng nhau ($a=b$) các ước của tích là $1$, $p$ và $p^2$, vẫn không có ước nào lớn hơn $1$ mà nhỏ hơn $p$.

**Phần 2. Trình bày**

Từ giả thiết ta có $ab=c(a+b)$.

$(a+c)(b+c)=ab+(a+b)c+c^2=c(a+b)+(a+b)c+c^2=c(2a+2b+c)$, nên $(a+c)(b+c)\vdots c$. $(1)$

Giả sử $a+c=p$ và $b+c=q$ đều là số nguyên tố. Các ước dương của $pq$ chỉ là $1$, $p$, $q$, $pq$ (nếu $p=q$ thì là $1$, $p$, $p^2$).

Mà $1<c<p$ và $c<q$ (vì $a,b>0$) nên $c$ không là ước nào trong các số đó, tức $pq\not\vdots c$. $(2)$

$(1)$ và $(2)$ mâu thuẫn. Vậy $a+c$ và $b+c$ không thể đồng thời là số nguyên tố.

=== C8.6a@p308
- bai: 6 · y: a · trang: 308 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050101
- cong_cu: loại dần những người không quen
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: T18T050101 (suy luận) — bài tổ hợp đồ thị "quen biết" không có nhóm riêng. Hiểu "quen" là quan hệ hai chiều.
## DE
Trong phòng có $100$ người mỗi người quen với ít nhất $67$ người khác. Chứng tỏ rằng trong phòng phải có $4$ người từng đôi một quen nhau.
## SACH
Gọi $A$ là một người bất kỳ trong phòng. Mời các người không quen $A$ ra ngoài, trong phòng còn lại ít nhất $1+67=68$ người.
Gọi $B$ ($B\ne A$) là người bất kỳ trong $68$ người này. Tiếp tục mời các người không quen $B$ ra ngoài, trong phòng còn lại ít nhất:
$68-(100-68)=36$ người
Gọi $C$ ($C\ne B,A$) là người bất kỳ trong $36$ người này, lại mời các người không quen $C$ ra ngoài, trong phòng còn lại ít nhất:
$36-(100-68)=4$ người
Như vậy ngoài $A,B,C$ còn có ít nhất một người (giả sử $D$). Bốn người $A,B,C,D$ đôi một quen nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chọn lần lượt từng người rồi "mời ra ngoài" những ai không quen người vừa chọn; mỗi người chỉ không quen nhiều nhất $100-1-67=32$ người nên sau ba lần loại vẫn còn ít nhất một người nữa, người đó quen cả ba người đã chọn.

**Bước 1.** Chọn một người $A$ tùy ý và giữ lại $A$ cùng những người quen $A$; đếm số người còn lại bằng cách dùng giả thiết mỗi người quen ít nhất $67$ người.

**Bước 2.** Chọn $B$ khác $A$ trong nhóm đó, loại những người không quen $B$ (không quá $32$ người), đếm số người còn lại.

**Bước 3.** Chọn $C$ khác $A,B$ trong nhóm vừa còn lại, lại loại những người không quen $C$ rồi đếm tiếp.

**Bước 4.** Chỉ ra nhóm cuối còn ít nhất một người $D$ khác $A,B,C$ và kiểm tra $D$ quen cả ba người kia, cũng như ba người đầu quen nhau từng đôi.

**Chú ý:** Con số $32$ lấy từ $100-1-67$: mỗi người trừ bản thân và ít nhất $67$ người quen thì chỉ còn nhiều nhất $32$ người lạ; luôn nhớ trừ chính người được chọn khi đếm.

**Phần 2. Trình bày**

Mỗi người trong phòng không quen với nhiều nhất $100-1-67=32$ người khác.

Chọn một người $A$ bất kì. Gọi $N_1$ là nhóm gồm $A$ và những người quen $A$; nhóm này có ít nhất $1+67=68$ người.

Chọn $B\in N_1$, $B\ne A$ (khi đó $B$ quen $A$). Loại khỏi $N_1$ những người không quen $B$ (không quá $32$ người), ta được nhóm $N_2$ có ít nhất $68-32=36$ người, chứa $A,B$; mọi người trong $N_2$ khác $A$ đều quen $A$, mọi người khác $B$ đều quen $B$.

Chọn $C\in N_2$, $C\ne A,B$. Loại khỏi $N_2$ những người không quen $C$ (không quá $32$ người), ta được nhóm $N_3$ có ít nhất $36-32=4$ người, chứa $A,B,C$ và mọi người khác $C$ trong $N_3$ đều quen $C$.

Vì $N_3$ có ít nhất $4$ người nên tồn tại $D\in N_3$, $D\ne A,B,C$. Người $D$ quen $A$, quen $B$ và quen $C$. Ngoài ra $B$ quen $A$, còn $C$ quen cả $A$ và $B$.

Vậy bốn người $A,B,C,D$ đôi một quen nhau.

=== C8.6b@p308
- bai: 6 · y: b · trang: 308 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050101
- cong_cu: đếm số trận hòa theo tổng điểm · xét các trường hợp
- kiem: khong
- ket_qua_sach: hòa nhau
- dap_an: Hòa nhau
- ghi_chu_nghi: Chưa chắc nhóm: T18T050101 (suy luận); bài toán bảng đấu không có nhóm riêng.
## DE
Trong một bảng có $4$ đội bóng đá thi đấu với nhau theo thể thức vòng tròn, đội thắng được $3$ điểm, đội hòa được $1$ điểm, đội thua được $0$ điểm. Kết thúc, kết quả của bảng như sau:

1. Tổng số điểm của cả $4$ đội trong bảng là $16$.

2. Đội nhất bảng là đội duy nhất được $6$ điểm.

Hỏi kết quả trận đấu giữa đội nhì bảng và cuối bảng?

Biết rằng nếu hai đội có số điểm bằng nhau thì xét theo hiệu số bàn thắng thua và trường hợp này nếu vẫn chưa quyết định được thì bốc thăm để xếp thứ hạng.
## SACH
Tổng số trận đấu của bảng là:
$\dfrac{4\cdot3}{2}=6$ (trận)
Mỗi trận đấu không hòa $3$ điểm, hòa $2$ điểm
Số trận hòa có là:
$(3\cdot6-16):(3-2)=2$ (trận)
Gọi bốn đội bóng của bảng đó là $A,B,C,D$ và $A$ là đội đầu bảng được $6$ điểm
Vậy $A$ thắng $2$ trận và thua $1$ trận
Không mất tính tổng quát giả sử $A$ thắng $C,D$ thua $B$. Kết quả của $3$ trận còn lại là $2$ trận hòa và $1$ không hòa.
Có thể xảy ra hai trường hợp:
1. $B$ hòa $C$ và $D$, $C$ thắng $D$ (hoặc $D$ thắng $C$)
Khi đó $B$ được $3+1+1=5$ (điểm), $C$ được $3+1=4$ (điểm), $D$ được $1$ điểm (hoặc $D$ được $4$ điểm, $C$ được $1$ điểm)
2. $B$ thua $C$ (hoặc $D$) và hòa $D$ (hoặc $C$) $C$ hòa $D$. Khi đó $B$ được $3+1=4$ (điểm) (hoặc $D$ được $3+1=4$ (điểm)), còn $D$ được $2$ điểm (hoặc $C$ được $2$ điểm)
Cả hai trường hợp đều cho kết quả trận đấu giữa đội nhì bảng và đội cuối bảng là hòa nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số trận hòa tính được từ tổng điểm (mỗi trận có người thắng cộng $3$ điểm, mỗi trận hòa cộng $2$ điểm); đội nhất đúng $6$ điểm chỉ có thể thắng $2$ thua $1$, từ đó chia các trận còn lại thành ít trường hợp để tính điểm từng đội.

**Bước 1.** Đếm số trận của bảng rồi gọi $d$ là số trận hòa, lập phương trình theo tổng điểm $16$ để tìm $d$.

**Bước 2.** Giải $3w+h=6$ với $w+h\le3$ (số trận thắng, hòa của đội nhất) để biết đội nhất thắng bao nhiêu, thua bao nhiêu, rồi đặt tên các đội để mô tả ba trận của nó.

**Bước 3.** Hai trận hòa nằm trong ba trận không có đội nhất; chia ba trường hợp theo trận duy nhất có thắng thua, tính điểm từng đội.

**Bước 4.** Loại trường hợp có đội vượt quá $6$ điểm (khi đó đội nhất không còn duy nhất), rồi đọc kết quả giữa đội nhì và đội cuối của các trường hợp còn lại.

**Chú ý:** Khi hai đội cùng điểm cùng tranh nhì, cả hai đều có kết quả giống hệt nhau với đội cuối, nên quy tắc xét hiệu số hay bốc thăm không ảnh hưởng đến đáp án.

**Phần 2. Trình bày**

Bảng có $\dfrac{4\cdot3}{2}=6$ trận. Gọi $d$ là số trận hòa thì tổng điểm là $3(6-d)+2d=18-d=16$, nên $d=2$.

Gọi $A$ là đội nhất bảng, có đúng $6$ điểm. Gọi $w$, $h$ là số trận thắng, hòa của $A$ thì $3w+h=6$ và $w+h\le3$, nên $w=2$, $h=0$: đội $A$ thắng $2$ trận, thua $1$ trận, không hòa trận nào.

Gọi $B$ là đội thắng $A$, còn $C$, $D$ là hai đội thua $A$. Khi đó sau các trận với $A$: $A$ có $6$ điểm, $B$ có $3$ điểm, $C$ và $D$ có $0$ điểm.

Hai trận hòa thuộc ba trận $BC$, $BD$, $CD$, tức trong ba trận này có đúng một trận phân thắng thua.

Trường hợp 1: $BC$ và $BD$ hòa, $CD$ phân thắng thua. Giả sử $C$ thắng $D$: $B$ có $3+1+1=5$ điểm, $C$ có $0+1+3=4$ điểm, $D$ có $0+1+0=1$ điểm. Đội nhì là $B$, đội cuối là $D$, trận $BD$ hòa. (Nếu $D$ thắng $C$ thì đội cuối là $C$ và trận $BC$ hòa.)

Trường hợp 2: $CD$ hòa và $B$ hòa một trong hai đội $C$, $D$; giả sử $BD$ hòa và $BC$ phân thắng thua. Nếu $B$ thắng $C$ thì $B$ có $3+3+1=7>6$ điểm, loại. Vậy $C$ thắng $B$: $B$ có $3+0+1=4$ điểm, $C$ có $0+3+1=4$ điểm, $D$ có $0+1+1=2$ điểm. Đội cuối là $D$; đội nhì là $B$ hoặc $C$ (cùng $4$ điểm), và trận của đội nhì với $D$ ($BD$ hoặc $CD$) đều hòa. (Trường hợp $BC$ hòa và $BD$ phân thắng thua làm tương tự, đổi vai $C$ và $D$.)

Vậy trong mọi trường hợp, trận giữa đội nhì bảng và đội cuối bảng hòa nhau.

