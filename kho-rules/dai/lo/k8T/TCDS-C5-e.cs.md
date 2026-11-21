=== C5V.1@p171
- bai: VD1 · y: - · trang: 171 · tang: nang_cao
- nguon_de: Tạp chí toán tuổi thơ số 87+88
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng bình phương ≥0 (xét hiệu) · đánh giá từng phân số rồi cộng · nhân cả tử và mẫu để dùng điều kiện xyz=1
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTLN=\dfrac{1}{2}$ khi $x=y=z=1$
- ghi_chu_nghi: Máy vét lưới mịn xyz=1: cực đại 0,49993 ≈ 1/2, đạt gần (1;1;1). Khớp sách.
## DE
(Tạp chí toán tuổi thơ số 87+88) Cho ba số thực dương $x,y,z$ thỏa mãn $xyz=1$. Tìm giá trị lớn nhất của $B=\dfrac{1}{2x^2+y^2+3}+\dfrac{1}{2y^2+z^2+3}+\dfrac{1}{2z^2+x^2+3}$.
## SACH
Giải:

$(x-y)^2+(x-1)^2\ge0\Rightarrow2x^2+y^2+3\ge2(xy+x+1)\Rightarrow\dfrac{1}{2x^2+y^2+3}\le\dfrac{1}{2(xy+x+1)}$.

Tương tự ta có: $\dfrac{1}{2y^2+z^2+3}\le\dfrac{1}{2(yz+y+1)}$.

Tương tự ta có: $\dfrac{1}{2z^2+x^2+3}\le\dfrac{1}{2(xz+z+1)}$

Cộng ba bất đẳng thức trên ta có:

$B=\dfrac{1}{2x^2+y^2+3}+\dfrac{1}{2y^2+z^2+3}+\dfrac{1}{2z^2+x^2+3}\le\dfrac{1}{2(xy+x+1)}+\dfrac{1}{2(yz+y+1)}+\dfrac{1}{2(xz+z+1)}$

Mà ta có với $xyz=1$ thì:

$\dfrac{1}{2(xy+x+1)}+\dfrac{1}{2(yz+y+1)}+\dfrac{1}{2(xz+z+1)}=\dfrac{1}{2}\left(\dfrac{1}{xy+x+1}+\dfrac{1}{yz+y+1}+\dfrac{1}{xz+z+1}\right)=\dfrac{1}{2}$

Nên suy ra $B\le\dfrac{1}{2}$. Giá trị lớn nhất của $B$ là $\dfrac{1}{2}$. Dấu bằng xảy ra khi và chỉ khi $x=y=z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi mẫu có dạng "bình phương cộng hằng số" nên chặn được từ dưới bằng một biểu thức bậc hai theo $xy+x+1$; điều kiện $xyz=1$ gợi ý nhân tử và mẫu để ba mẫu mới cộng lại thành một số cố định, còn đề đối xứng vòng nên dấu "=" dự đoán tại $x=y=z$.

**Bước 1.** Tách mẫu thứ nhất thành tổng hai bình phương cộng với $2(xy+x+1)$ để thấy mẫu luôn không nhỏ hơn $2(xy+x+1)$, từ đó chặn từ trên phân số thứ nhất.

**Bước 2.** Hoán vị vòng $x\to y\to z\to x$ để có đánh giá tương tự cho hai phân số còn lại rồi cộng ba bất đẳng thức.

**Bước 3.** Dùng $xyz=1$ nhân cả tử và mẫu của hai phân số sau với $x$ và với $xy$ cho ba mẫu cùng trở thành $xy+x+1$, khi đó tổng ba phân số là một hằng số.

**Bước 4.** Kiểm tra mọi bình phương dùng ở bước 1 đồng thời bằng $0$ có xảy ra được không để khẳng định dấu "=" đạt được.

**Chú ý:** Đánh giá từng phân số chỉ có giá trị khi mẫu dương; phải nêu đẳng thức phụ khi $xyz=1$ chứ không viết "dễ thấy".

**Phần 2. Trình bày**

Ta có $2x^2+y^2+3=(x-y)^2+(x-1)^2+2(xy+x+1)\ge2(xy+x+1)>0$, nên $\dfrac{1}{2x^2+y^2+3}\le\dfrac{1}{2(xy+x+1)}$.

Tương tự $\dfrac{1}{2y^2+z^2+3}\le\dfrac{1}{2(yz+y+1)}$ và $\dfrac{1}{2z^2+x^2+3}\le\dfrac{1}{2(zx+z+1)}$.

Cộng ba bất đẳng thức: $B\le\dfrac{1}{2}\left(\dfrac{1}{xy+x+1}+\dfrac{1}{yz+y+1}+\dfrac{1}{zx+z+1}\right)$ (1)

Vì $xyz=1$ nên $\dfrac{1}{yz+y+1}=\dfrac{x}{xyz+xy+x}=\dfrac{x}{xy+x+1}$ và $\dfrac{1}{zx+z+1}=\dfrac{xy}{x^2yz+xyz+xy}=\dfrac{xy}{x+1+xy}$.

Do đó $\dfrac{1}{xy+x+1}+\dfrac{1}{yz+y+1}+\dfrac{1}{zx+z+1}=\dfrac{1+x+xy}{xy+x+1}=1$.

Thay vào (1): $B\le\dfrac{1}{2}$.

Dấu "=" xảy ra khi $x=y$, $y=z$, $z=x$ và $x=1$, $y=1$, $z=1$, tức $x=y=z=1$ (thỏa $xyz=1$; khi đó $B=3\cdot\dfrac{1}{6}=\dfrac{1}{2}$).

Vậy giá trị lớn nhất của $B$ là $\dfrac{1}{2}$, đạt khi $x=y=z=1$.

=== C5V.2@p171
- bai: VD2 · y: - · trang: 171 · tang: nang_cao
- nguon_de: Tạp chí toán tuổi thơ số 87
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng bình phương ≥0 (xét hiệu) · đánh giá từng phân số rồi cộng · nhân cả tử và mẫu để dùng điều kiện xyz=1
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTLN=\dfrac{1}{2}$ khi $x=y=z=1$
- ghi_chu_nghi: Sách in vế phải của bất đẳng thức thứ hai là 2(yz+z+1), đúng phải là 2(yz+y+1) (dòng cộng ngay sau đó dùng yz+y+1). Đã soạn theo bản đúng. Máy vét lưới xyz=1: cực đại 0,49995 ≈ 1/2. Khớp sách.
## DE
(Tạp chí toán tuổi thơ số 87) Cho ba số thực dương thỏa mãn $xyz=1$. Tìm giá trị lớn nhất của $B=\dfrac{1}{(x+1)^2+y^2+1}+\dfrac{1}{(y+1)^2+z^2+1}+\dfrac{1}{(z+1)^2+x^2+1}$.
## SACH
Giải: Ta có: $(x+1)^2+y^2+1=(x-y)^2+2(xy+x+1)\ge2(xy+x+1)$.

Nên suy ra ta có: $\dfrac{1}{(x+1)^2+y^2+1}\le\dfrac{1}{2(xy+x+1)}$

Tương tự ta có: $\dfrac{1}{(y+1)^2+z^2+1}\le\dfrac{1}{2(yz+z+1)}$; $\dfrac{1}{(z+1)^2+x^2+1}\le\dfrac{1}{2(xz+z+1)}$

Mà ta có với $xyz=1$ thì:

$\dfrac{1}{2(xy+x+1)}+\dfrac{1}{2(yz+y+1)}+\dfrac{1}{2(xz+z+1)}=\dfrac{1}{2}\left(\dfrac{1}{(xy+x+1)}+\dfrac{1}{(yz+y+1)}+\dfrac{1}{(xz+z+1)}\right)=\dfrac{1}{2}$

Cộng ba bất đẳng thức trên ta có:

$B=\dfrac{1}{(x+1)^2+y^2+1}+\dfrac{1}{(y+1)^2+z^2+1}+\dfrac{1}{(z+1)^2+x^2+1}\le\dfrac{1}{2}\left(\dfrac{1}{(xy+x+1)}+\dfrac{1}{(yz+y+1)}+\dfrac{1}{(xz+z+1)}\right)=\dfrac{1}{2}$

Giá trị lớn nhất của $B$ là $\dfrac{1}{2}$. Dấu bằng xảy ra khi và chỉ khi $x=y=z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $(x+1)^2+y^2+1$ khai triển ra $x^2+y^2+2x+2$, đúng bằng một bình phương $(x-y)^2$ cộng $2(xy+x+1)$ — nhân tử $xy+x+1$ là dấu hiệu quen của điều kiện $xyz=1$, nên chặn mẫu từ dưới rồi dùng tổng ba phân số có mẫu $xy+x+1$, $yz+y+1$, $zx+z+1$.

**Bước 1.** Khai triển mẫu thứ nhất và ghép thành $(x-y)^2$ cộng $2(xy+x+1)$ để đánh giá phân số thứ nhất từ trên.

**Bước 2.** Hoán vị vòng các biến để được hai đánh giá còn lại rồi cộng ba vế lại.

**Bước 3.** Dùng $xyz=1$ để đưa ba mẫu $xy+x+1$, $yz+y+1$, $zx+z+1$ về cùng một mẫu và tính được tổng của chúng.

**Bước 4.** Chỉ ra bộ giá trị làm mọi bình phương bằng $0$ đồng thời để kết luận dấu "=" xảy ra.

**Phần 2. Trình bày**

Ta có $(x+1)^2+y^2+1=x^2+y^2+2x+2=(x-y)^2+2(xy+x+1)\ge2(xy+x+1)>0$, nên $\dfrac{1}{(x+1)^2+y^2+1}\le\dfrac{1}{2(xy+x+1)}$.

Tương tự $\dfrac{1}{(y+1)^2+z^2+1}\le\dfrac{1}{2(yz+y+1)}$ và $\dfrac{1}{(z+1)^2+x^2+1}\le\dfrac{1}{2(zx+z+1)}$.

Cộng ba bất đẳng thức: $B\le\dfrac{1}{2}\left(\dfrac{1}{xy+x+1}+\dfrac{1}{yz+y+1}+\dfrac{1}{zx+z+1}\right)$ (1)

Vì $xyz=1$ nên $\dfrac{1}{yz+y+1}=\dfrac{x}{xyz+xy+x}=\dfrac{x}{xy+x+1}$ và $\dfrac{1}{zx+z+1}=\dfrac{xy}{x^2yz+xyz+xy}=\dfrac{xy}{x+1+xy}$.

Suy ra tổng trong ngoặc ở (1) bằng $\dfrac{1+x+xy}{xy+x+1}=1$, do đó $B\le\dfrac{1}{2}$.

Dấu "=" xảy ra khi $x=y$, $y=z$, $z=x$ (từ ba bình phương $(x-y)^2$, $(y-z)^2$, $(z-x)^2$ bằng $0$), cùng $xyz=1$, tức $x=y=z=1$; khi đó $B=3\cdot\dfrac{1}{6}=\dfrac{1}{2}$.

Vậy giá trị lớn nhất của $B$ là $\dfrac{1}{2}$, đạt khi $x=y=z=1$.

=== C5V.3@p172
- bai: VD3 · y: - · trang: 172 · tang: nang_cao
- nguon_de: Tạp chí toán tuổi thơ số 88
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng bình phương ≥0 (xét hiệu) · đánh giá từng phân số rồi cộng · nhân cả tử và mẫu để dùng điều kiện xyz=2 · chọn hệ số theo điểm rơi
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTLN=\dfrac{1}{2}$ khi $x=y=1$, $z=2$
- ghi_chu_nghi: Sách in hai bất đẳng thức phụ thứ hai và thứ ba với vế phải y/(yz+y+1) và 2z/(xz+2z+2) (lệch hệ số 2 so với dòng cộng có nhân thừa số 1/2; hai vế phải đúng phải là y/(2(yz+y+1)) và z/(xz+2z+2)). Đã soạn theo bản đúng. Máy vét lưới xyz=2: cực đại 0,49995 ≈ 1/2, đạt gần (1;1;2). Khớp sách.
## DE
(Tạp chí toán tuổi thơ số 88) Cho ba số thực dương thỏa mãn $xyz=2$. Tìm giá trị lớn nhất của $B=\dfrac{x}{2x^2+y^2+5}+\dfrac{2y}{6y^2+z^2+6}+\dfrac{4z}{3z^2+4x^2+16}$.
## SACH
Giải:

Ta có: $\dfrac{x}{2x^2+y^2+5}\le\dfrac{x}{2(xy+x+2)}$.

Tương tự ta có: $\dfrac{2y}{6y^2+z^2+6}\le\dfrac{y}{yz+y+1}$ ; $\dfrac{4z}{3z^2+4x^2+16}\le\dfrac{2z}{xz+2z+2}$

Mà ta có với $xyz=2$ thì: $\dfrac{x}{(xy+x+2)}+\dfrac{y}{(yz+y+1)}+\dfrac{2z}{(xz+2z+2)}=1$

Cộng ba bất đẳng thức trên ta có: $\dfrac{x}{2x^2+y^2+5}+\dfrac{2y}{6y^2+z^2+6}+\dfrac{4z}{3z^2+4x^2+16}\le\dfrac{1}{2}\left(\dfrac{x}{(xy+x+2)}+\dfrac{y}{(yz+y+1)}+\dfrac{2z}{(xz+2z+2)}\right)=\dfrac{1}{2}$

Giá trị lớn nhất của $B$ là $\dfrac{1}{2}$. Dấu bằng xảy ra khi và chỉ khi $x=y=1$; $z=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $xyz=2$ cùng các hệ số lạ ($6y^2$, $3z^2$, $4x^2$, các hằng $5,6,16$) cho thấy đề được "gài" cho một điểm rơi đẹp (thử $x=y=1$, $z=2$ thấy $xyz=2$); vì thế mỗi mẫu phải được chặn bằng một tổng bình phương triệt tiêu đúng tại điểm đó, sao cho ba phân số mới có mẫu dạng $xy+x+2$ và cộng lại được nhờ $xyz=2$.

**Bước 1.** Chặn mẫu thứ nhất bởi $2(xy+x+2)$ nhờ $(x-y)^2+(x-1)^2\ge0$, vì $2x^2+y^2+5-2(xy+x+2)$ chính là tổng hai bình phương đó.

**Bước 2.** Chặn mẫu thứ hai bởi $4(yz+y+1)$ và mẫu thứ ba bởi $4(xz+2z+2)$ bằng cách viết hiệu thành tổng các bình phương triệt tiêu tại $y=1,z=2$ và $x=1,z=2$.

**Bước 3.** Dùng $xyz=2$ nhân cả tử và mẫu để ba phân số mới cùng mẫu $xy+x+2$ và tính tổng chúng.

**Bước 4.** Đối chiếu điểm rơi: các bình phương ở bước 1 và 2 cùng bằng $0$ khi $x=y=1$, $z=2$, thỏa $xyz=2$.

**Chú ý:** Nếu dùng đánh giá lỏng hơn (không khớp điểm rơi) thì tổng vượt quá $\dfrac{1}{2}$ và không kết luận được.

**Phần 2. Trình bày**

Ta có $2x^2+y^2+5-2(xy+x+2)=(x-y)^2+(x-1)^2\ge0$, nên $\dfrac{x}{2x^2+y^2+5}\le\dfrac{x}{2(xy+x+2)}$.

Ta có $6y^2+z^2+6-4(yz+y+1)=(2y-z)^2+2(y-1)^2\ge0$, nên $\dfrac{2y}{6y^2+z^2+6}\le\dfrac{2y}{4(yz+y+1)}=\dfrac{y}{2(yz+y+1)}$.

Ta có $3z^2+4x^2+16-4(xz+2z+2)=(2x-z)^2+2(z-2)^2\ge0$, nên $\dfrac{4z}{3z^2+4x^2+16}\le\dfrac{4z}{4(xz+2z+2)}=\dfrac{z}{xz+2z+2}$.

Cộng ba bất đẳng thức: $B\le\dfrac{1}{2}\left(\dfrac{x}{xy+x+2}+\dfrac{y}{yz+y+1}+\dfrac{2z}{xz+2z+2}\right)$ (1)

Vì $xyz=2$ nên $\dfrac{y}{yz+y+1}=\dfrac{xy}{xyz+xy+x}=\dfrac{xy}{xy+x+2}$ và $\dfrac{2z}{xz+2z+2}=\dfrac{2xyz}{x^2yz+2xyz+2xy}=\dfrac{4}{2x+4+2xy}=\dfrac{2}{xy+x+2}$.

Suy ra tổng trong ngoặc ở (1) bằng $\dfrac{x+xy+2}{xy+x+2}=1$, do đó $B\le\dfrac{1}{2}$.

Dấu "=" xảy ra khi $x=y$, $x=1$, $2y=z$, $y=1$, $z=2$, tức $x=y=1$, $z=2$ (thỏa $xyz=2$; khi đó $B=\dfrac{1}{8}+\dfrac{1}{8}+\dfrac{1}{4}=\dfrac{1}{2}$).

Vậy giá trị lớn nhất của $B$ là $\dfrac{1}{2}$, đạt khi $x=y=1$, $z=2$.

=== C5V.4@p173
- bai: VD4 · y: - · trang: 173 · tang: nang_cao
- nguon_de: Tạp chí toán học & tuổi trẻ số 418
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/a+1/b ≥ 4/(a+b) · Cô-si hai số u+1/u ≥ 2 · xy ≤ ((x+y)/2)² · thế điều kiện x+y=1
- kiem: khong
- ket_qua_sach: 2017
- dap_an: $GTNN=2017$ khi $x=y=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét x trong (0;1) bước 1e-5: cực tiểu 2017,0 tại x=0,5. Khớp sách.
## DE
(Tạp chí toán học & tuổi trẻ số 418) Tìm giá trị nhỏ nhất của $B=\dfrac{1}{x^3+xy+y^3}+\dfrac{4x^2y^2+2}{xy}+2006$, trong đó $x,y$ là các số thực dương và $x+y=1$.
## SACH
Giải:

Nhận xét rằng với $a,b$ là số thực dương thì $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$ (1)

Thật vậy $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}\Leftrightarrow\dfrac{(a-b)^2}{ab(a+b)}\ge0$ với $a,b$ là số thực dương.

Do $x+y=1$ nên biến đổi ta có:

$B=\dfrac{1}{x^3+xy+y^3}+\dfrac{4x^2y^2+2}{xy}+2006=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(\dfrac{1}{4xy}+4xy\right)+\dfrac{5}{4xy}+2006$

Ta có: $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\ge\dfrac{4}{(x+y)^2}=4$ (2). Và $\dfrac{1}{4xy}+4xy=\dfrac{1}{4xy}+\dfrac{4xy}{1}\ge2$

Mặt khác ta có: $xy\le\left(\dfrac{x+y}{2}\right)^2\Rightarrow\dfrac{5}{4xy}\ge5$ (3)

Từ đó suy ra $B=\dfrac{1}{x^3+xy+y^3}+\dfrac{4x^2y^2+2}{xy}+2006\ge2017$

Vậy giá trị nhỏ nhất của $B$ là $2017$ khi $x=y=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^3+xy+y^3$ kết hợp với $x+y=1$ gợi ngay hằng đẳng thức $x^3+y^3=(x+y)(x^2-xy+y^2)$ làm mẫu gọn lại thành $x^2+y^2$; sau đó cả biểu thức chỉ còn $x^2+y^2$ và $xy$, đề đối xứng nên dự đoán dấu "=" tại $x=y=\dfrac{1}{2}$, và hệ số các hạng tử tách sao cho từng cặp đều cân bằng ở điểm đó.

**Bước 1.** Dùng $x+y=1$ để rút gọn $x^3+xy+y^3$ về $x^2+y^2$ và chia tử cho mẫu để $\dfrac{4x^2y^2+2}{xy}=4xy+\dfrac{2}{xy}$.

**Bước 2.** Tách $\dfrac{2}{xy}=\dfrac{1}{2xy}+\dfrac{1}{4xy}+\dfrac{5}{4xy}$ để lập ba nhóm, mỗi nhóm có một công cụ chặn dưới riêng và đều đạt dấu "=" khi $x=y=\dfrac{1}{2}$.

**Bước 3.** Với nhóm $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}$ dùng bất đẳng thức phụ $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$ (tổng hai mẫu là $(x+y)^2=1$); nhóm $4xy+\dfrac{1}{4xy}$ dùng Cô-si hai số.

**Bước 4.** Với số hạng $\dfrac{5}{4xy}$ dùng $xy\le\left(\dfrac{x+y}{2}\right)^2=\dfrac{1}{4}$ rồi cộng ba đánh giá và kiểm tra dấu "=".

**Chú ý:** Bất đẳng thức phụ $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$ phải được chứng minh (hoặc nêu rõ là hệ quả Cô-si) và chỉ đúng với $a,b>0$.

**Phần 2. Trình bày**

Với $x,y>0$ và $x+y=1$: $x^3+y^3=(x+y)(x^2-xy+y^2)=x^2-xy+y^2$, nên $x^3+xy+y^3=x^2+y^2$.

$B=\dfrac{1}{x^2+y^2}+4xy+\dfrac{2}{xy}+2006$

$=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\left(\dfrac{1}{4xy}+4xy\right)+\dfrac{5}{4xy}+2006$

Với $a,b>0$: $\dfrac{1}{a}+\dfrac{1}{b}-\dfrac{4}{a+b}=\dfrac{(a-b)^2}{ab(a+b)}\ge0$, nên $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$.

Áp dụng với $a=x^2+y^2$, $b=2xy$ (cả hai dương): $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\ge\dfrac{4}{(x+y)^2}=4$.

Theo Cô-si hai số dương: $\dfrac{1}{4xy}+4xy\ge2$.

Vì $xy\le\dfrac{(x+y)^2}{4}=\dfrac{1}{4}$ nên $\dfrac{5}{4xy}\ge5$.

Cộng lại: $B\ge4+2+5+2006=2017$.

Dấu "=" xảy ra khi $x^2+y^2=2xy$, $4xy=1$ và $xy=\dfrac{1}{4}$, tức $x=y=\dfrac{1}{2}$ (thỏa $x+y=1$).

Vậy giá trị nhỏ nhất của $B$ là $2017$, đạt khi $x=y=\dfrac{1}{2}$.

=== C5V.5@p173
- bai: VD5 · y: - · trang: 173 · tang: nang_cao
- nguon_de: Chuyên Hà Tĩnh 2012 – 2013
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/a+1/b ≥ 4/(a+b) · c(a+b) ≤ ((a+b+c)/2)² · thế điều kiện a+b+c=1
- kiem: khong
- ket_qua_sach: \dfrac{16}{2017}
- dap_an: $GTNN=\dfrac{16}{2017}$ khi $a=b=\dfrac{1}{4}$, $c=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới a,b (N=400): cực tiểu 0,0079326 = 16/2017 tại (0,25; 0,25; 0,5). Khớp sách.
## DE
(Chuyên Hà Tĩnh 2012 – 2013) Cho ba số thực dương $a,b,c$ thỏa mãn $a+b+c=1$. Tìm giá trị nhỏ nhất của $\dfrac{1}{2017ac}+\dfrac{1}{2017bc}$.
## SACH
Giải:

Nhận xét rằng với $a,b$ là số thực dương thì $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$ (1)

Thật vậy $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}\Leftrightarrow\dfrac{(a-b)^2}{ab(a+b)}\ge0$ với $a,b$ là số thực dương.

Ta có:

$\dfrac{1}{2017ac}+\dfrac{1}{2017bc}=\dfrac{1}{2017c}\left(\dfrac{1}{a}+\dfrac{1}{b}\right)\ge\dfrac{4}{2017c}\cdot\dfrac{1}{a+b}\ge\dfrac{4}{2017}\cdot\dfrac{1}{\left(\dfrac{a+b+c}{2}\right)^2}=\dfrac{16}{2017}$

Vậy giá trị nhỏ nhất của $\dfrac{1}{2017ac}+\dfrac{1}{2017bc}$ là $\dfrac{16}{2017}$.

Dấu bằng xảy ra khi và chỉ khi $c=\dfrac{1}{2}$, $a=b=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai phân số có chung nhân tử $\dfrac{1}{2017c}$ nên đưa về $\dfrac{1}{2017c}\left(\dfrac{1}{a}+\dfrac{1}{b}\right)$; tổng nghịch đảo hai số gợi bất đẳng thức $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$, và tích $c(a+b)$ của hai đại lượng có tổng $a+b+c=1$ không đổi gợi bất đẳng thức $(p+q)^2\ge4pq$.

**Bước 1.** Đặt $\dfrac{1}{2017c}$ làm nhân tử chung để chỉ còn tổng $\dfrac{1}{a}+\dfrac{1}{b}$, rồi chặn tổng này từ dưới bằng $\dfrac{4}{a+b}$.

**Bước 2.** Gộp thành $\dfrac{4}{2017\,c(a+b)}$ và nhận ra $c$ cùng $a+b$ là hai số dương có tổng $c+(a+b)=1$ không đổi.

**Bước 3.** Chặn $c(a+b)$ từ trên bằng $\dfrac{(c+(a+b))^2}{4}=\dfrac{1}{4}$ để chặn phân số từ dưới, rồi tìm điều kiện để hai bất đẳng thức cùng xảy ra dấu "=": $a=b$ và $c=a+b$.

**Phần 2. Trình bày**

Với $a,b>0$: $\dfrac{1}{a}+\dfrac{1}{b}-\dfrac{4}{a+b}=\dfrac{(a-b)^2}{ab(a+b)}\ge0$, nên $\dfrac{1}{a}+\dfrac{1}{b}\ge\dfrac{4}{a+b}$ (1)

$\dfrac{1}{2017ac}+\dfrac{1}{2017bc}=\dfrac{1}{2017c}\left(\dfrac{1}{a}+\dfrac{1}{b}\right)\ge\dfrac{4}{2017c(a+b)}$ (theo (1))

Vì $c,\ a+b>0$ nên $c(a+b)\le\dfrac{(c+a+b)^2}{4}=\dfrac{1}{4}$, suy ra $\dfrac{4}{2017c(a+b)}\ge\dfrac{4\cdot4}{2017}=\dfrac{16}{2017}$.

Vậy $\dfrac{1}{2017ac}+\dfrac{1}{2017bc}\ge\dfrac{16}{2017}$.

Dấu "=" xảy ra khi $a=b$ và $c=a+b$; kết hợp $a+b+c=1$ ta được $c=\dfrac{1}{2}$, $a=b=\dfrac{1}{4}$.

Vậy giá trị nhỏ nhất là $\dfrac{16}{2017}$, đạt khi $a=b=\dfrac{1}{4}$, $c=\dfrac{1}{2}$.

=== C5B.1@p174
- bai: 1 · y: - · trang: 174 · tang: nang_cao
- nguon_de: HSG tỉnh Bắc Ninh 2014 – 2015
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki · n²+p² ≥ (n+p)²/2 · đưa điều kiện về dạng tổng bình phương
- kiem: khong
- ket_qua_sach: Max S=\sqrt{2} khi m=n=p=\dfrac{\sqrt{2}}{3}; Min S=-\sqrt{2} khi m=n=p=-\dfrac{\sqrt{2}}{3}
- dap_an: $GTLN=\sqrt{2}$ khi $m=n=p=\dfrac{\sqrt{2}}{3}$; $GTNN=-\sqrt{2}$ khi $m=n=p=-\dfrac{\sqrt{2}}{3}$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới m, n, p trên ellipse điều kiện: cực đại 1,41421 và cực tiểu -1,41421. Khớp sách.
## DE
(HSG tỉnh Bắc Ninh 2014 – 2015) Cho số thực $m,n,p$ sao cho $n^2+np+p^2=1-\dfrac{3m^2}{2}$. Tìm giá trị nhỏ nhất, lớn nhất của $S=m+n+p$.
## SACH
Hướng dẫn giải:

$\operatorname{Max}S=\sqrt{2}$ khi $m=n=p=\dfrac{\sqrt{2}}{3}$; $\operatorname{Min}S=-\sqrt{2}$ khi $m=n=p=-\dfrac{\sqrt{2}}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện chứa $m^2$ và dạng $n^2+np+p^2$ (đối xứng theo $n,p$) còn $S$ là tổng bậc nhất của $m$ và $n+p$; hai dạng bậc hai và bậc nhất đi cùng nhau gợi bất đẳng thức Bu-nhi-a-cốp-xki để chặn $S^2$ bằng một biểu thức theo điều kiện đã cho.

**Bước 1.** Nhân hai vế điều kiện với $2$ để mất phân số, rồi tách $2n^2+2np+2p^2=(n+p)^2+n^2+p^2$ để làm xuất hiện $n+p$.

**Bước 2.** Dùng $n^2+p^2\ge\dfrac{(n+p)^2}{2}$ để chặn điều kiện thành một bất đẳng thức chỉ chứa $m$ và $u=n+p$.

**Bước 3.** Viết $S=m+u$ và áp dụng Bu-nhi-a-cốp-xki với các hệ số chọn sao cho tích hai tổng bình phương vừa khớp với bất đẳng thức ở bước 2.

**Bước 4.** Tìm điều kiện dấu "=" ($n=p$ và tỉ lệ giữa $m$ với $u$) rồi giải ra giá trị cụ thể của $m,n,p$ cho cả hai cực trị.

**Chú ý:** Bài hỏi cả nhỏ nhất lẫn lớn nhất nên phải chỉ ra hai bộ giá trị khác nhau; bất đẳng thức $S^2\le\dots$ cho cả hai phía của $S$.

**Phần 2. Trình bày**

Từ giả thiết: $2n^2+2np+2p^2+3m^2=2$ (1)

Vì $n^2+p^2\ge\dfrac{(n+p)^2}{2}$ nên $2n^2+2np+2p^2=(n+p)^2+n^2+p^2\ge\dfrac{3}{2}(n+p)^2$.

Thay vào (1): $3m^2+\dfrac{3}{2}(n+p)^2\le2$ (2)

Theo Bu-nhi-a-cốp-xki: $S^2=\left(m+(n+p)\right)^2=\left(\sqrt{3}\,m\cdot\dfrac{1}{\sqrt{3}}+\sqrt{\dfrac{3}{2}}(n+p)\cdot\sqrt{\dfrac{2}{3}}\right)^2\le\left(3m^2+\dfrac{3}{2}(n+p)^2\right)\left(\dfrac{1}{3}+\dfrac{2}{3}\right)\le2$ (theo (2)).

Suy ra $-\sqrt{2}\le S\le\sqrt{2}$.

Dấu "=" xảy ra khi $n=p$, $n+p=2m$ (tỉ lệ trong Bu-nhi-a-cốp-xki) và (2) thành đẳng thức, tức $m=n=p$ với $9m^2=2$, $m=\pm\dfrac{\sqrt{2}}{3}$. Thử lại: $m=n=p=\dfrac{\sqrt{2}}{3}$ thì $n^2+np+p^2=\dfrac{2}{3}=1-\dfrac{3m^2}{2}$ thỏa điều kiện và $S=\sqrt{2}$; $m=n=p=-\dfrac{\sqrt{2}}{3}$ cũng thỏa và $S=-\sqrt{2}$.

Vậy giá trị lớn nhất của $S$ là $\sqrt{2}$ khi $m=n=p=\dfrac{\sqrt{2}}{3}$; giá trị nhỏ nhất của $S$ là $-\sqrt{2}$ khi $m=n=p=-\dfrac{\sqrt{2}}{3}$.

=== C5B.2@p174
- bai: 2 · y: - · trang: 174 · tang: nang_cao
- nguon_de: HSG Huyện Tư Nghĩa Quảng Ngãi 2014 – 2015
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: thế điều kiện x+y=1 (x-1=-y) · xy ≤ ((x+y)/2)² (hệ quả Cô-si)
- kiem: khong
- ket_qua_sach: 9
- dap_an: $GTNN=9$ khi $x=y=\dfrac{1}{2}$
- ghi_chu_nghi: Sách chỉ ghi đáp số (gọi biểu thức là A); tự giải. Máy vét x trong (0;1): cực tiểu 9,0 tại x=0,5. Khớp sách.
## DE
(HSG Huyện Tư Nghĩa Quảng Ngãi 2014 – 2015) Cho hai số dương $x,y$ có tổng bằng $1$, tìm giá trị nhỏ nhất của: $\left(1-\dfrac{1}{x^2}\right)\left(1-\dfrac{1}{y^2}\right)$.
## SACH
Hướng dẫn giải: GTNN của $A$ là $9$ khi $x=y=\dfrac{1}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi ngoặc là hiệu của hai bình phương nên phân tích được thành $\dfrac{(x-1)(x+1)}{x^2}$, và điều kiện $x+y=1$ cho $x-1=-y$, $y-1=-x$ — các nhân tử triệt tiêu chéo, tích rút gọn còn một biểu thức theo $xy$ mà ta chặn được bằng $xy\le\dfrac{1}{4}$.

**Bước 1.** Quy đồng từng ngoặc và phân tích tử thành $(x-1)(x+1)$, $(y-1)(y+1)$ để dùng được điều kiện $x+y=1$.

**Bước 2.** Thay $x-1=-y$ và $y-1=-x$ vào tích, rút gọn $x^2y^2$ ở mẫu với $xy$ ở tử, đưa tích về dạng $\dfrac{(x+1)(y+1)}{xy}$ rồi khai triển bằng $x+y=1$.

**Bước 3.** Biểu thức còn lại có dạng hằng số cộng một phân số có mẫu $xy$, nên dùng $xy\le\left(\dfrac{x+y}{2}\right)^2$ để chặn từ dưới và tìm dấu "=" khi $x=y$.

**Phần 2. Trình bày**

Với $x,y>0$, $x+y=1$ (nên $x-1=-y$, $y-1=-x$):

$\left(1-\dfrac{1}{x^2}\right)\left(1-\dfrac{1}{y^2}\right)=\dfrac{(x-1)(x+1)}{x^2}\cdot\dfrac{(y-1)(y+1)}{y^2}$

$=\dfrac{(-y)(x+1)(-x)(y+1)}{x^2y^2}=\dfrac{(x+1)(y+1)}{xy}$

$=\dfrac{xy+(x+y)+1}{xy}=\dfrac{xy+2}{xy}=1+\dfrac{2}{xy}$

Vì $xy\le\dfrac{(x+y)^2}{4}=\dfrac{1}{4}$ nên $\dfrac{2}{xy}\ge8$, do đó biểu thức $\ge9$.

Dấu "=" xảy ra khi $x=y$, kết hợp $x+y=1$ được $x=y=\dfrac{1}{2}$.

Vậy giá trị nhỏ nhất là $9$, đạt khi $x=y=\dfrac{1}{2}$.

=== C5B.3@p174
- bai: 3 · y: - · trang: 174 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: bất đẳng thức phụ 1/(1+a²)+1/(1+b²) ≥ 2/(1+ab) khi ab≥1 (chứng minh bằng xét hiệu) · đặt ẩn phụ b=y/2
- kiem: khong
- ket_qua_sach: 3
- dap_an: $GTNN=3$ khi $xy=2$
- ghi_chu_nghi: Sách chỉ ghi đáp số "A nhỏ nhất bằng 3 khi xy=2"; đề không nêu x,y dương (xy≥2 chỉ buộc x,y cùng dấu), lời giải đúng cho mọi x,y thực. Máy vét x∈(0,02; 60), xy từ 2 trở lên: cực tiểu 3,0 tại mọi điểm xy=2. Khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\dfrac{1}{1+x^2}+\dfrac{4}{4+y^2}+xy$ với $xy\ge2$.
## SACH
Hướng dẫn giải: Giá trị nhỏ nhất của $A=3$ khi $xy=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $\dfrac{4}{4+y^2}=\dfrac{1}{1+\left(\dfrac{y}{2}\right)^2}$ thì hai phân số đầu cùng dạng $\dfrac{1}{1+t^2}$, và điều kiện $xy\ge2$ chính là $x\cdot\dfrac{y}{2}\ge1$ — đúng điều kiện của bất đẳng thức phụ $\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}\ge\dfrac{2}{1+ab}$ khi $ab\ge1$; phần còn lại là một biến duy nhất $t=\dfrac{xy}{2}$.

**Bước 1.** Đặt $a=x$, $b=\dfrac{y}{2}$ và $t=ab=\dfrac{xy}{2}$, khi đó $A=\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}+2t$ và điều kiện là $t\ge1$.

**Bước 2.** Chứng minh bổ đề $\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}\ge\dfrac{2}{1+ab}$ với $ab\ge1$ bằng cách xét hiệu hai vế và quy đồng, phân tích tử thành tích có nhân tử $(ab-1)(a-b)^2$.

**Bước 3.** Dùng bổ đề để quy $A$ về hàm một biến $\dfrac{2}{1+t}+2t$, rồi so sánh với một hằng số bằng cách xét hiệu và phân tích thành nhân tử.

**Bước 4.** Tìm điều kiện để hai bất đẳng thức cùng xảy ra dấu "=": $t=1$ làm triệt tiêu thừa số $ab-1$ nên không cần thêm điều kiện nào khác.

**Chú ý:** Bổ đề chỉ đúng khi $ab\ge1$; với $ab<1$ chiều bất đẳng thức đảo ngược.

**Phần 2. Trình bày**

Đặt $a=x$, $b=\dfrac{y}{2}$, $t=ab=\dfrac{xy}{2}\ge1$. Khi đó $\dfrac{4}{4+y^2}=\dfrac{1}{1+b^2}$ và $xy=2t$.

Bổ đề: với $ab\ge1$ thì $\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}\ge\dfrac{2}{1+ab}$.

Thật vậy $\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}-\dfrac{2}{1+ab}=\dfrac{(ab-1)(a-b)^2}{(1+a^2)(1+b^2)(1+ab)}\ge0$ vì $ab-1\ge0$ và $1+ab>0$.

Áp dụng: $A\ge\dfrac{2}{1+t}+2t$.

Xét hiệu: $\dfrac{2}{1+t}+2t-3=\dfrac{2+(2t-3)(1+t)}{1+t}=\dfrac{2t^2-t-1}{1+t}=\dfrac{(2t+1)(t-1)}{1+t}\ge0$ vì $t\ge1$.

Do đó $A\ge3$.

Dấu "=" xảy ra khi $t=1$ (khi đó $ab-1=0$ nên bổ đề thành đẳng thức), tức $xy=2$. Thử lại: với $x=2,\ y=1$ thì $A=\dfrac{1}{5}+\dfrac{4}{5}+2=3$.

Vậy giá trị nhỏ nhất của $A$ là $3$, đạt khi $xy=2$.

=== C5B.4@p174
- bai: 4 · y: - · trang: 174 · tang: nang_cao
- nguon_de: HSG tỉnh Hải Dương 2014 – 2015
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/(p+q) ≤ (1/4)(1/p+1/q) dùng liên tiếp · điều kiện chuyển về tổng các nghịch đảo
- kiem: khong
- ket_qua_sach: \dfrac{1}{8}
- dap_an: $GTLN=\dfrac{1}{8}$ khi $x=y=z=3$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới (1/x,1/y,1/z) trên mặt tổng bằng 1: cực đại 0,125 tại (3;3;3). Khớp sách.
## DE
(HSG tỉnh Hải Dương 2014 – 2015) Cho các số dương $x,y,z$ thay đổi thỏa mãn: $xy+yz+zx=xyz$. Tìm giá trị lớn nhất của biểu thức: $M=\dfrac{1}{4x+3y+z}+\dfrac{1}{x+4y+3z}+\dfrac{1}{3x+y+4z}$.
## SACH
Hướng dẫn giải:

$M$ đạt GTLN là $\dfrac{1}{8}$ khi $x=y=z=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho tổng các nghịch đảo $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=1$ còn $M$ gồm các nghịch đảo của tổng nhiều biến, nên phải chặn từ trên mỗi $\dfrac{1}{4x+3y+z}$ bằng tổ hợp của $\dfrac{1}{x},\dfrac{1}{y},\dfrac{1}{z}$ nhờ hệ quả Cô-si $\dfrac{1}{p+q}\le\dfrac{1}{4}\left(\dfrac{1}{p}+\dfrac{1}{q}\right)$ dùng liên tiếp.

**Bước 1.** Chia hai vế điều kiện cho $xyz>0$ để được $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=1$, dạng trùng với thứ mà các đánh giá sau sẽ sinh ra.

**Bước 2.** Tách mẫu $4x+3y+z$ thành các cặp có thể dùng hệ quả trên: $4x+(3y+z)$, rồi $3y+z=2y+(y+z)$, và chọn các số hạng sao cho khi dấu "=" ta có $4x=3y+z$, $2y=y+z$, $y=z$.

**Bước 3.** Thay ngược từ trong ra ngoài để chặn $\dfrac{1}{4x+3y+z}$ bằng một tổ hợp tuyến tính của $\dfrac{1}{x},\dfrac{1}{y},\dfrac{1}{z}$, rồi hoán vị vòng $x\to y\to z\to x$ để có hai đánh giá còn lại.

**Bước 4.** Cộng ba đánh giá để các hệ số của $\dfrac{1}{x},\dfrac{1}{y},\dfrac{1}{z}$ cùng bằng nhau, dùng điều kiện ở bước 1 và kiểm tra dấu "=".

**Chú ý:** Chọn sai cách tách (không để hai số trong mỗi cặp bằng nhau ở điểm rơi) thì dấu "=" không đạt được và đánh giá chỉ là chặn lỏng.

**Phần 2. Trình bày**

Vì $x,y,z>0$, chia hai vế điều kiện cho $xyz$: $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=1$ (1)

Bổ đề: với $p,q>0$ thì $\dfrac{1}{p+q}\le\dfrac{1}{4}\left(\dfrac{1}{p}+\dfrac{1}{q}\right)$, vì $\dfrac{1}{p}+\dfrac{1}{q}-\dfrac{4}{p+q}=\dfrac{(p-q)^2}{pq(p+q)}\ge0$.

Áp dụng liên tiếp: $\dfrac{1}{y+z}\le\dfrac{1}{4}\left(\dfrac{1}{y}+\dfrac{1}{z}\right)$.

$\dfrac{1}{3y+z}=\dfrac{1}{2y+(y+z)}\le\dfrac{1}{4}\left(\dfrac{1}{2y}+\dfrac{1}{y+z}\right)\le\dfrac{1}{8y}+\dfrac{1}{16}\left(\dfrac{1}{y}+\dfrac{1}{z}\right)=\dfrac{3}{16y}+\dfrac{1}{16z}$.

$\dfrac{1}{4x+3y+z}=\dfrac{1}{4x+(3y+z)}\le\dfrac{1}{4}\left(\dfrac{1}{4x}+\dfrac{1}{3y+z}\right)\le\dfrac{1}{16x}+\dfrac{3}{64y}+\dfrac{1}{64z}=\dfrac{1}{64}\left(\dfrac{4}{x}+\dfrac{3}{y}+\dfrac{1}{z}\right)$.

Hoán vị vòng: $\dfrac{1}{x+4y+3z}\le\dfrac{1}{64}\left(\dfrac{1}{x}+\dfrac{4}{y}+\dfrac{3}{z}\right)$ và $\dfrac{1}{3x+y+4z}\le\dfrac{1}{64}\left(\dfrac{3}{x}+\dfrac{1}{y}+\dfrac{4}{z}\right)$.

Cộng ba bất đẳng thức: $M\le\dfrac{1}{64}\cdot8\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)=\dfrac{1}{8}$ (theo (1)).

Dấu "=" xảy ra khi $4x=3y+z$, $2y=y+z$, $y=z$ (và các điều kiện tương tự khi hoán vị), tức $x=y=z$; kết hợp (1) được $x=y=z=3$.

Vậy giá trị lớn nhất của $M$ là $\dfrac{1}{8}$, đạt khi $x=y=z=3$.

=== C5B.5@p174
- bai: 5 · y: - · trang: 174 · tang: nang_cao
- nguon_de: Đề thi chọn HSG Nam Định 2014 – 2015
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: thế điều kiện x+y+z=0 · (x+1)(y+1) ≤ ((x+y+2)/2)² · uv ≤ ((u+v)/2)² với u+v không đổi
- kiem: khong
- ket_qua_sach: -\dfrac{2}{3}
- dap_an: $GTLN=-\dfrac{2}{3}$ khi $x=y=\dfrac{1}{2}$, $z=-1$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới x,y miền ràng buộc: cực đại -0,6667 tại (0,5; 0,5; -1). Khớp sách.
## DE
(Đề thi chọn HSG Nam Định 2014 – 2015) Xét các số thực $x,y,z$ thỏa mãn điều kiện $x+y+z=0$; $x+1>0$; $y+1>0$; $z+4>0$. Tìm giá trị lớn nhất của biểu thức $Q=\dfrac{xy-1}{(x+1)(y+1)}+\dfrac{z}{z+4}$.
## SACH
Hướng dẫn giải:

Vậy $\operatorname{Max}Q=-\dfrac{2}{3}$ khi $x=y=\dfrac{1}{2}$; $z=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y+z=0$ cho phép thay $z=-(x+y)$ nên $Q$ chỉ còn phụ thuộc $s=x+y$ sau khi bỏ được tích $xy$; và vì $xy-1=(x+1)(y+1)-(x+y+2)$ nên phân số đầu tách được thành $1$ trừ một phân số có tử là $x+y+2$, mà $(x+1)(y+1)$ là tích của hai số dương nên chặn được bằng Cô-si.

**Bước 1.** Tách $xy-1=(x+1)(y+1)-(x+y+2)$ để phân số đầu thành $1-\dfrac{x+y+2}{(x+1)(y+1)}$, chỉ còn tích $(x+1)(y+1)$ ở mẫu.

**Bước 2.** Chặn tích $(x+1)(y+1)$ từ trên bằng $\left(\dfrac{x+y+2}{2}\right)^2$ (hai thừa số dương) để biến phân số đầu thành hàm của $s=x+y$.

**Bước 3.** Thay $z=-s$ vào phân số thứ hai rồi tách hằng số ra để có hai phân số mẫu $s+2$ và $4-s$, có tổng hai mẫu bằng $6$ không đổi.

**Bước 4.** Chặn tích $(s+2)(4-s)$ từ trên bằng $9$ rồi lần lượt xét dấu "=" ở hai bất đẳng thức đã dùng.

**Chú ý:** Phải kiểm tra $s+2=(x+1)+(y+1)>0$ và $4-s=z+4>0$ — chính là các điều kiện của đề — trước khi dùng Cô-si và chặn nghịch đảo.

**Phần 2. Trình bày**

Đặt $s=x+y$, khi đó $z=-s$; từ điều kiện của đề: $s+2=(x+1)+(y+1)>0$ và $4-s=z+4>0$.

Vì $xy-1=(x+1)(y+1)-(x+y+2)$ nên $\dfrac{xy-1}{(x+1)(y+1)}=1-\dfrac{s+2}{(x+1)(y+1)}$.

Do $x+1>0$, $y+1>0$ nên $(x+1)(y+1)\le\dfrac{(s+2)^2}{4}$, suy ra $\dfrac{s+2}{(x+1)(y+1)}\ge\dfrac{4}{s+2}$.

Vậy $\dfrac{xy-1}{(x+1)(y+1)}\le1-\dfrac{4}{s+2}$.

Mặt khác $\dfrac{z}{z+4}=1-\dfrac{4}{z+4}=1-\dfrac{4}{4-s}$.

Cộng lại: $Q\le2-\dfrac{4}{s+2}-\dfrac{4}{4-s}=2-\dfrac{4\left[(s+2)+(4-s)\right]}{(s+2)(4-s)}=2-\dfrac{24}{(s+2)(4-s)}$.

Vì $s+2>0$, $4-s>0$ nên $(s+2)(4-s)\le\dfrac{\left[(s+2)+(4-s)\right]^2}{4}=9$, suy ra $\dfrac{24}{(s+2)(4-s)}\ge\dfrac{24}{9}=\dfrac{8}{3}$.

Do đó $Q\le2-\dfrac{8}{3}=-\dfrac{2}{3}$.

Dấu "=" xảy ra khi $x+1=y+1$ và $s+2=4-s$, tức $x=y$ và $s=1$, suy ra $x=y=\dfrac{1}{2}$, $z=-1$ (thỏa mọi điều kiện của đề; khi đó $Q=-\dfrac{1}{3}-\dfrac{1}{3}=-\dfrac{2}{3}$).

Vậy giá trị lớn nhất của $Q$ là $-\dfrac{2}{3}$, đạt khi $x=y=\dfrac{1}{2}$, $z=-1$.

=== C5B.6@p175
- bai: 6 · y: - · trang: 175 · tang: nang_cao
- nguon_de: Đề thi chọn HSG Quảng Bình 2015 – 2016
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki (hoặc xét hiệu) (a+b²)(a+1) ≥ (a+b)² · đánh giá theo t=a+b≥2
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTLN=1$ khi $a=b=1$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới log a,b>0 với a+b>=2: cực đại 0,99994 ≈ 1 gần (1;1). Khớp sách.
## DE
(Đề thi chọn HSG Quảng Bình 2015 – 2016) Cho $a,b>0$ thỏa mãn $a+b\ge2$. Tìm giá trị lớn nhất của biểu thức: $M=\dfrac{1}{a+b^2}+\dfrac{1}{b+a^2}$.
## SACH
Hướng dẫn giải:

Giá trị lớn nhất của $M$ bằng $1$ khi $a=b=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần chặn từ trên một tổng nghịch đảo, nên không dùng được $\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$ (chiều ngược); thay vào đó dùng Bu-nhi-a-cốp-xki cho mẫu $(a+b^2)(a+1)\ge(a+b)^2$, nhờ đó mỗi phân số bị chặn bằng một phân số cùng mẫu $(a+b)^2$ và điều kiện $a+b\ge2$ xử lý được bằng một biến $t=a+b$.

**Bước 1.** Nhân mẫu $a+b^2$ với $a+1$ để dùng Bu-nhi-a-cốp-xki, được $(a+b^2)(a+1)\ge(a+b)^2$ và suy ra $\dfrac{1}{a+b^2}\le\dfrac{a+1}{(a+b)^2}$.

**Bước 2.** Làm tương tự cho phân số thứ hai rồi cộng để $M$ bị chặn bởi một biểu thức chỉ phụ thuộc $t=a+b$.

**Bước 3.** Dùng điều kiện $t\ge2$ để chứng minh biểu thức đó không vượt quá hằng số bằng cách quy về một tích $(t-2)(t+1)\ge0$.

**Bước 4.** Tìm dấu "=": Bu-nhi-a-cốp-xki xảy ra đẳng thức ở hai nơi và $t=2$ phải đồng thời đúng.

**Chú ý:** Bước cuối dùng $t\ge2$ (chứ không phải $t\le2$): biểu thức $\dfrac{t+2}{t^2}$ giảm khi $t$ tăng.

**Phần 2. Trình bày**

Ta có $(a+b^2)(a+1)-(a+b)^2=a+ab^2-2ab=a(b-1)^2\ge0$ (đây là Bu-nhi-a-cốp-xki), nên $\dfrac{1}{a+b^2}\le\dfrac{a+1}{(a+b)^2}$.

Tương tự $(b+a^2)(b+1)-(a+b)^2=b(a-1)^2\ge0$ nên $\dfrac{1}{b+a^2}\le\dfrac{b+1}{(a+b)^2}$.

Cộng hai bất đẳng thức, đặt $t=a+b\ge2$: $M\le\dfrac{a+b+2}{(a+b)^2}=\dfrac{t+2}{t^2}$.

Mà $1-\dfrac{t+2}{t^2}=\dfrac{t^2-t-2}{t^2}=\dfrac{(t-2)(t+1)}{t^2}\ge0$ vì $t\ge2$, nên $\dfrac{t+2}{t^2}\le1$.

Vậy $M\le1$.

Dấu "=" xảy ra khi $b=1$, $a=1$ (từ hai bất đẳng thức đầu) và $t=2$; bộ $a=b=1$ thỏa $a+b=2\ge2$ và khi đó $M=\dfrac{1}{2}+\dfrac{1}{2}=1$.

Vậy giá trị lớn nhất của $M$ là $1$, đạt khi $a=b=1$.

=== C5B.7@p175
- bai: 7 · y: - · trang: 175 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki dạng 4/u+9/v+4/w ≥ (2+3+2)²/(u+v+w) · đặt ẩn phụ nghịch đảo p=1/a, q=1/b, r=1/c
- kiem: khong
- ket_qua_sach: 7
- dap_an: $GTNN=7$ khi $a=2$, $b=1$, $c=1$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới a,b>0 (c suy từ ràng buộc): cực tiểu 7,00005 gần (2;1;1). Khớp sách.
## DE
Cho $a,b,c$ là các số thực dương thỏa mãn $2ab+6bc+2ac=7abc$. Tìm giá trị nhỏ nhất của biểu thức $C=\dfrac{4ab}{a+2b}+\dfrac{9ac}{a+4c}+\dfrac{4bc}{b+c}$.
## SACH
Hướng dẫn giải:

Vậy GTNN của $C$ là $7$ khi $a=2$; $b=1$; $c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện chia cho $abc$ thành tổng các nghịch đảo, còn mỗi số hạng của $C$ dạng $\dfrac{4ab}{a+2b}$ đảo lại là $\dfrac{4}{\dfrac{1}{b}+\dfrac{2}{a}}$ — nên đặt $p=\dfrac{1}{a}$, $q=\dfrac{1}{b}$, $r=\dfrac{1}{c}$ thì $C$ là tổng ba phân số tử cố định, và tổng ba mẫu mới trùng đúng vế trái của điều kiện.

**Bước 1.** Chia hai vế điều kiện cho $abc>0$ và đặt $p=\dfrac{1}{a}$, $q=\dfrac{1}{b}$, $r=\dfrac{1}{c}$ để có một đẳng thức tuyến tính của $p,q,r$.

**Bước 2.** Viết lại từng số hạng của $C$ bằng cách chia tử và mẫu cho tích hai biến, được $C=\dfrac{4}{2p+q}+\dfrac{9}{4p+r}+\dfrac{4}{q+r}$.

**Bước 3.** Nhận ra tổng ba mẫu $(2p+q)+(4p+r)+(q+r)$ đúng bằng vế trái của điều kiện, tức một hằng số, rồi dùng Bu-nhi-a-cốp-xki cho tổng nghịch đảo có tử là bình phương.

**Bước 4.** Giải hệ để tìm $p,q,r$ từ điều kiện dấu "=" (ba mẫu tỉ lệ với $2,3,2$) rồi suy ra $a,b,c$.

**Chú ý:** Hệ phương trình ở bước 4 phải có nghiệm dương, nếu không thì chưa chứng tỏ giá trị nhỏ nhất đạt được.

**Phần 2. Trình bày**

Chia hai vế điều kiện cho $abc>0$: $\dfrac{6}{a}+\dfrac{2}{b}+\dfrac{2}{c}=7$. Đặt $p=\dfrac{1}{a}$, $q=\dfrac{1}{b}$, $r=\dfrac{1}{c}$ (dương) thì $6p+2q+2r=7$.

Ta có $\dfrac{4ab}{a+2b}=\dfrac{4}{\dfrac{1}{b}+\dfrac{2}{a}}=\dfrac{4}{2p+q}$, tương tự $\dfrac{9ac}{a+4c}=\dfrac{9}{4p+r}$ và $\dfrac{4bc}{b+c}=\dfrac{4}{q+r}$.

Đặt $u=2p+q$, $v=4p+r$, $w=q+r$ (đều dương) thì $u+v+w=6p+2q+2r=7$ và $C=\dfrac{4}{u}+\dfrac{9}{v}+\dfrac{4}{w}$.

Theo Bu-nhi-a-cốp-xki: $\left(\dfrac{4}{u}+\dfrac{9}{v}+\dfrac{4}{w}\right)(u+v+w)\ge(2+3+2)^2=49$.

Suy ra $C\ge\dfrac{49}{7}=7$.

Dấu "=" xảy ra khi $\dfrac{u}{2}=\dfrac{v}{3}=\dfrac{w}{2}$, cùng $u+v+w=7$ nên $u=2$, $v=3$, $w=2$. Giải $2p+q=2$, $4p+r=3$, $q+r=2$ được $p=\dfrac{1}{2}$, $q=1$, $r=1$, tức $a=2$, $b=1$, $c=1$ (thỏa điều kiện: $2\cdot2+6+2\cdot2=14=7\cdot2$).

Vậy giá trị nhỏ nhất của $C$ là $7$, đạt khi $a=2$, $b=1$, $c=1$.

=== C5B.8@p175
- bai: 8 · y: - · trang: 175 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đặt ẩn phụ u=2/x (uvw=1) · quy đồng, biến đổi tương đương, tổng và tích đối xứng p=u+v+w, q=uv+vw+wu
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTNN=1$ khi $x=y=z=2$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Đề nói số thực (không bảo dương); lời giải đúng cho mọi số thực khác 0 vì mẫu x²+2x+4>0. Máy vét lưới cả bốn tổ hợp dấu của x,y (z=8/(xy)): cực tiểu 1,00001 gần (2;2;2). Khớp sách.
## DE
Cho $x,y,z$ là các số thực thỏa mãn $xyz=8$. Tìm giá trị nhỏ nhất của: $P=\dfrac{x^2}{x^2+2x+4}+\dfrac{y^2}{y^2+2y+4}+\dfrac{z^2}{z^2+2z+4}$.
## SACH
Hướng dẫn giải:

Vậy GTNN của $P$ là $1$ khi $x=y=z=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi phân số có tử $x^2$ trùng hạng tử bậc hai ở mẫu, nên chia cả tử và mẫu cho $x^2$ (được vì $xyz=8$ nên $x\ne0$) thì mẫu thành $1+\dfrac{2}{x}+\dfrac{4}{x^2}$; đặt $u=\dfrac{2}{x}$ thì phân số là $\dfrac{1}{u^2+u+1}$ và điều kiện $xyz=8$ thành $uvw=1$.

**Bước 1.** Chia tử và mẫu mỗi phân số cho $x^2$ (tương ứng $y^2$, $z^2$) rồi đặt $u=\dfrac{2}{x}$, $v=\dfrac{2}{y}$, $w=\dfrac{2}{z}$ để chuyển bài sang dạng $\sum\dfrac{1}{u^2+u+1}$ với $uvw=1$.

**Bước 2.** Quy đồng và so sánh tử với mẫu chung bằng cách xét hiệu, vì ba mẫu $u^2+u+1=\left(u+\dfrac{1}{2}\right)^2+\dfrac{3}{4}$ luôn dương nên quy đồng không đổi chiều.

**Bước 3.** Khai triển tử và mẫu theo $p=u+v+w$, $q=uv+vw+wu$ và dùng $uvw=1$ để hiệu chỉ còn một biểu thức đối xứng đơn giản.

**Bước 4.** Nhận ra hiệu bằng một tổng bình phương, từ đó chặn được tổng ba phân số và tìm điều kiện dấu "=" là $u=v=w$.

**Chú ý:** Không được giả sử $x,y,z>0$ nếu đề không cho; ở đây bất đẳng thức đúng với mọi số thực vì các mẫu luôn dương.

**Phần 2. Trình bày**

Vì $xyz=8$ nên $x,y,z\ne0$. Đặt $u=\dfrac{2}{x}$, $v=\dfrac{2}{y}$, $w=\dfrac{2}{z}$ thì $uvw=\dfrac{8}{xyz}=1$ và $\dfrac{x^2}{x^2+2x+4}=\dfrac{1}{1+\dfrac{2}{x}+\dfrac{4}{x^2}}=\dfrac{1}{u^2+u+1}$; tương tự cho $y,z$.

Vậy $P=\dfrac{1}{u^2+u+1}+\dfrac{1}{v^2+v+1}+\dfrac{1}{w^2+w+1}$ với $uvw=1$.

Do $t^2+t+1=\left(t+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ nên $P=\dfrac{S}{\Pi}$ với $\Pi=(u^2+u+1)(v^2+v+1)(w^2+w+1)>0$ và $S=\sum(v^2+v+1)(w^2+w+1)$.

Đặt $p=u+v+w$, $q=uv+vw+wu$; dùng $uvw=1$, khai triển được $\Pi=p^2+pq+q^2$ và $S=2p^2+pq+q^2-3q$.

Suy ra $S-\Pi=p^2-3q=u^2+v^2+w^2-uv-vw-wu=\dfrac{1}{2}\left[(u-v)^2+(v-w)^2+(w-u)^2\right]\ge0$.

Do đó $P=\dfrac{S}{\Pi}\ge1$.

Dấu "=" xảy ra khi $u=v=w$, kết hợp $uvw=1$ được $u=v=w=1$ tức $x=y=z=2$.

Vậy giá trị nhỏ nhất của $P$ là $1$, đạt khi $x=y=z=2$.

=== C5B.9@p175
- bai: 9 · y: - · trang: 175 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Cô-si ba số (a+b+c)(1/a+1/b+1/c) ≥ 9 · bất đẳng thức 1/u+1/v+1/w ≥ 9/(u+v+w) · Cô-si ba số cho (a+b)(b+c)(c+a) · thế điều kiện a+b+c=1
- kiem: khong
- ket_qua_sach: 73
- dap_an: $GTNN=73$ khi $a=b=c=\dfrac{1}{3}$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới a,b,c>0 tổng 1 (N=500): cực tiểu 73,0005 gần (1/3;1/3;1/3). Khớp sách.
## DE
Cho ba số dương $a,b,c$ thỏa mãn điều kiện $a+b+c=1$. Tìm giá trị nhỏ nhất của biểu thức $P=\dfrac{9}{1-2(ab+bc+ca)}+\dfrac{2}{abc}+27abc-27(ab+bc+ca)$.
## SACH
Hướng dẫn giải:

Vậy GTNN của $P=73$ khi $a=b=c=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a+b+c=1$ thì $1-2(ab+bc+ca)=a^2+b^2+c^2$, còn $27abc-27(ab+bc+ca)=-27(a+b)(b+c)(c+a)$ (vì $(a+b+c)(ab+bc+ca)-abc=(a+b)(b+c)(c+a)$); đề vì thế tách thành hai khối độc lập, mỗi khối có một công cụ Cô-si/Bu-nhi-a-cốp-xki riêng và cùng đạt dấu "=" khi $a=b=c$.

**Bước 1.** Dùng $(a+b+c)^2=1$ để viết mẫu của phân số đầu là $a^2+b^2+c^2$ và nhóm $27abc-27(ab+bc+ca)$ thành $-27(a+b)(b+c)(c+a)$.

**Bước 2.** Chặn $-27(a+b)(b+c)(c+a)$ từ dưới bằng Cô-si ba số cho ba thừa số có tổng $2(a+b+c)=2$ không đổi.

**Bước 3.** Chặn $\dfrac{2}{abc}$ nhờ $\dfrac{1}{abc}=\dfrac{a+b+c}{abc}=\dfrac{1}{ab}+\dfrac{1}{bc}+\dfrac{1}{ca}\ge\dfrac{9}{ab+bc+ca}$ rồi gộp với $\dfrac{9}{a^2+b^2+c^2}$.

**Bước 4.** Gộp thành tổng $\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{w}$ với $u=a^2+b^2+c^2$, $v=w=ab+bc+ca$ có $u+v+w=(a+b+c)^2=1$, rồi dùng $\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{w}\ge\dfrac{9}{u+v+w}$.

**Chú ý:** Hai đánh giá phải cùng đạt dấu "=" tại $a=b=c=\dfrac{1}{3}$ thì mới chốt được giá trị nhỏ nhất; nếu một đánh giá lỏng ở điểm đó thì kết quả sẽ lớn hơn thật.

**Phần 2. Trình bày**

Đặt $q=ab+bc+ca$. Vì $(a+b+c)^2=1$ nên $1-2q=a^2+b^2+c^2$.

Ta có $(a+b)(b+c)(c+a)=(a+b+c)(ab+bc+ca)-abc=q-abc$, nên $27abc-27q=-27(a+b)(b+c)(c+a)$.

Theo Cô-si ba số dương: $(a+b)(b+c)(c+a)\le\left(\dfrac{(a+b)+(b+c)+(c+a)}{3}\right)^3=\dfrac{8}{27}$, suy ra $27abc-27q\ge-8$ (1).

Theo Cô-si ba số dương $ab,bc,ca$: $q\left(\dfrac{1}{ab}+\dfrac{1}{bc}+\dfrac{1}{ca}\right)\ge9$. Mà $\dfrac{1}{ab}+\dfrac{1}{bc}+\dfrac{1}{ca}=\dfrac{a+b+c}{abc}=\dfrac{1}{abc}$ nên $\dfrac{2}{abc}\ge\dfrac{18}{q}$ (2).

Từ (2): $\dfrac{9}{a^2+b^2+c^2}+\dfrac{2}{abc}\ge9\left(\dfrac{1}{a^2+b^2+c^2}+\dfrac{1}{q}+\dfrac{1}{q}\right)\ge\dfrac{81}{(a^2+b^2+c^2)+q+q}=\dfrac{81}{(a+b+c)^2}=81$ (3), dùng $\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{w}\ge\dfrac{9}{u+v+w}$ với ba số dương.

Cộng (3) và (1): $P\ge81-8=73$.

Dấu "=" xảy ra khi $a+b=b+c=c+a$ và $ab=bc=ca$ và $a^2+b^2+c^2=ab+bc+ca$, tức $a=b=c=\dfrac{1}{3}$ (khi đó $P=27+54+1-9=73$).

Vậy giá trị nhỏ nhất của $P$ là $73$, đạt khi $a=b=c=\dfrac{1}{3}$.

=== C5B.10@p175
- bai: 10 · y: - · trang: 175 · tang: nang_cao
- nguon_de: Đề thi chọn HSG Phú Yên 2014 – 2015
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: hệ quả Cô-si 1/(p+q) ≤ (1/4)(1/p+1/q) dùng hai lần (Cô-si bốn số) · thế điều kiện tổng nghịch đảo
- kiem: khong
- ket_qua_sach: \dfrac{1005}{2}
- dap_an: $GTLN=\dfrac{1005}{2}$ khi $x=y=z=\dfrac{1}{670}$
- ghi_chu_nghi: Sách chỉ ghi đáp số; tự giải. Máy vét lưới (1/x,1/y,1/z) trên mặt tổng bằng 2010: cực đại 502,5 tại x=y=z=1/670. Khớp sách.
## DE
(Đề thi chọn HSG Phú Yên 2014 – 2015) Cho $3$ số dương $x,y,z$ thỏa mãn $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2010$. Tìm giá trị lớn nhất của biểu thức: $P=\dfrac{1}{2x+y+z}+\dfrac{1}{x+2y+z}+\dfrac{1}{x+y+2z}$.
## SACH
Hướng dẫn giải:

Vậy $\operatorname{Max}P=\dfrac{1005}{2}$ khi $x=y=z=\dfrac{1}{670}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho tổng các nghịch đảo còn $P$ là tổng các nghịch đảo của tổng, nên cần chặn từ trên $\dfrac{1}{2x+y+z}$ bằng một tổ hợp của $\dfrac{1}{x},\dfrac{1}{y},\dfrac{1}{z}$ nhờ hệ quả Cô-si $\dfrac{1}{p+q}\le\dfrac{1}{4}\left(\dfrac{1}{p}+\dfrac{1}{q}\right)$; đề đối xứng nên dự đoán dấu "=" tại $x=y=z$.

**Bước 1.** Tách mẫu $2x+y+z=(x+y)+(x+z)$ thành hai nhóm để dùng hệ quả Cô-si một lần, rồi tiếp tục tách từng nhóm $x+y$ và $x+z$ để dùng thêm lần nữa.

**Bước 2.** Sau hai lần dùng được $\dfrac{1}{2x+y+z}\le\dfrac{1}{16}\left(\dfrac{2}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$, rồi hoán vị vòng để có hai đánh giá còn lại.

**Bước 3.** Cộng ba đánh giá, gom các hệ số của $\dfrac{1}{x},\dfrac{1}{y},\dfrac{1}{z}$ và thay điều kiện $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2010$ để ra một hằng số.

**Bước 4.** Tìm điều kiện dấu "=": hai số trong mỗi cặp phải bằng nhau nên $x=y=z$, rồi dùng điều kiện đề để tính giá trị cụ thể.

**Chú ý:** Dấu "=" phải xảy ra ở cả hai lần dùng Cô-si trong mỗi đánh giá, nên không thể tách mẫu theo cách khác làm hai số trong cặp không bằng nhau ở điểm rơi.

**Phần 2. Trình bày**

Với $p,q>0$ có $\dfrac{1}{p}+\dfrac{1}{q}-\dfrac{4}{p+q}=\dfrac{(p-q)^2}{pq(p+q)}\ge0$, nên $\dfrac{1}{p+q}\le\dfrac{1}{4}\left(\dfrac{1}{p}+\dfrac{1}{q}\right)$ (*).

Áp dụng (*) cho $p=x+y$, $q=x+z$: $\dfrac{1}{2x+y+z}\le\dfrac{1}{4}\left(\dfrac{1}{x+y}+\dfrac{1}{x+z}\right)$.

Áp dụng (*) lần nữa: $\dfrac{1}{x+y}\le\dfrac{1}{4}\left(\dfrac{1}{x}+\dfrac{1}{y}\right)$ và $\dfrac{1}{x+z}\le\dfrac{1}{4}\left(\dfrac{1}{x}+\dfrac{1}{z}\right)$.

Suy ra $\dfrac{1}{2x+y+z}\le\dfrac{1}{16}\left(\dfrac{2}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$.

Tương tự $\dfrac{1}{x+2y+z}\le\dfrac{1}{16}\left(\dfrac{1}{x}+\dfrac{2}{y}+\dfrac{1}{z}\right)$ và $\dfrac{1}{x+y+2z}\le\dfrac{1}{16}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{2}{z}\right)$.

Cộng ba bất đẳng thức: $P\le\dfrac{1}{16}\cdot4\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)=\dfrac{1}{4}\cdot2010=\dfrac{1005}{2}$.

Dấu "=" xảy ra khi $x=y=z$; kết hợp $\dfrac{3}{x}=2010$ được $x=y=z=\dfrac{1}{670}$.

Vậy giá trị lớn nhất của $P$ là $\dfrac{1005}{2}$, đạt khi $x=y=z=\dfrac{1}{670}$.

