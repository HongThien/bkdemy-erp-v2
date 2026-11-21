=== C4B.11@p123
- bai: 11 · y: - · trang: 123 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 57
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si ba số dạng (x+y+z)(1/x+1/y+1/z)≥9 · tách mẫu thành tổng ba số hạng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách có hai bài cùng nhãn "Bài 11"; đây là bài thứ nhất (Toán học tuổi thơ số 57), bài thứ hai là C4B.11x
## DE
(Toán học tuổi thơ số 57) Cho $a,b,c$ là $3$ số thực dương. Chứng minh rằng: $\dfrac{ab}{a+3b+2c}+\dfrac{bc}{b+3c+2a}+\dfrac{ca}{c+3a+2b}\le\dfrac{a+b+c}{6}$ $(1)$.
## SACH
Hướng dẫn giải:

Áp dụng BĐT $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ với $x,y,z$ dương.

Ta có $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9\Rightarrow\dfrac{1}{x+y+z}\le\dfrac{1}{9}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$ $(*)$

Áp dụng BĐT $(*)$ ta có:

$\dfrac{ab}{a+3b+2c}+\dfrac{bc}{b+3c+2a}+\dfrac{ca}{c+3a+2b}\le\dfrac{bc+ca}{9(a+b)}+\dfrac{ab+ac}{9(c+b)}+\dfrac{ab+bc}{9(a+c)}+\dfrac{a+b+c}{18}=\dfrac{a+b+c}{6}$

Dấu bằng xảy ra khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu mỗi phân thức là tổng của nhiều số dương, nên dùng $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ để chặn $\dfrac{1}{x+y+z}$ từ trên, với cách tách mẫu thành ba số hạng sao cho chúng bằng nhau khi $a=b=c$ (đúng chỗ ta cần dấu "=").

**Bước 1.** Suy ra bất đẳng thức phụ $\dfrac{1}{x+y+z}\le\dfrac{1}{9}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$ từ bất đẳng thức Cô-si cho ba số dương.

**Bước 2.** Tách mẫu $a+3b+2c$ thành ba số hạng $(a+c)$, $(b+c)$, $2b$ để cả ba cùng bằng nhau khi $a=b=c$, đồng thời hai mẫu mới có dạng tổng hai biến trùng với mẫu sẽ xuất hiện ở các phân thức còn lại.

**Bước 3.** Áp dụng cách tách này cho từng phân thức bằng phép hoán vị vòng $a\to b\to c\to a$, mỗi phân thức nhận được hai phân thức nhỏ có mẫu là tổng hai biến và một số hạng bậc nhất.

**Bước 4.** Cộng ba bất đẳng thức rồi nhóm các số hạng cùng mẫu $a+b$, $b+c$, $c+a$, tử của mỗi nhóm đều chia hết cho mẫu nên rút gọn được thành một biến.

**Chú ý:** Cách tách mẫu là chỗ khó nhất: phải thử sao cho ba số hạng bằng nhau tại $a=b=c$ và mẫu mới còn "đẹp" để cộng được.

**Phần 2. Trình bày**

Với $x,y,z>0$, theo Cô-si ba số có $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$, suy ra $\dfrac{1}{x+y+z}\le\dfrac{1}{9}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$ $(*)$, dấu "=" khi $x=y=z$.

Vì $a+3b+2c=(a+c)+(b+c)+2b$ nên theo $(*)$ với ba số dương $a+c,\ b+c,\ 2b$:

$\dfrac{ab}{a+3b+2c}\le\dfrac{ab}{9}\left(\dfrac{1}{a+c}+\dfrac{1}{b+c}+\dfrac{1}{2b}\right)=\dfrac{ab}{9(a+c)}+\dfrac{ab}{9(b+c)}+\dfrac{a}{18}$

Tương tự, vì $b+3c+2a=(b+a)+(c+a)+2c$ và $c+3a+2b=(c+b)+(a+b)+2a$:

$\dfrac{bc}{b+3c+2a}\le\dfrac{bc}{9(a+b)}+\dfrac{bc}{9(c+a)}+\dfrac{b}{18}$

$\dfrac{ca}{c+3a+2b}\le\dfrac{ca}{9(b+c)}+\dfrac{ca}{9(a+b)}+\dfrac{c}{18}$

Cộng ba bất đẳng thức và nhóm theo mẫu: $\dfrac{bc+ca}{9(a+b)}=\dfrac{c}{9}$, $\dfrac{ab+ca}{9(b+c)}=\dfrac{a}{9}$, $\dfrac{ab+bc}{9(c+a)}=\dfrac{b}{9}$, nên

$\dfrac{ab}{a+3b+2c}+\dfrac{bc}{b+3c+2a}+\dfrac{ca}{c+3a+2b}\le\dfrac{a+b+c}{9}+\dfrac{a+b+c}{18}=\dfrac{a+b+c}{6}$

Dấu "=" xảy ra khi $a+c=b+c=2b$, tức $a=b=c$. Vậy bất đẳng thức $(1)$ được chứng minh.

=== C4B.11x@p123
- bai: 11 · y: - · trang: 123 · tang: nang_cao
- nguon_de: Tuyển sinh Hải Dương 2013 – 2014
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: A^2+B^2≥2AB · hệ quả (a+b)^2≥4ab · đưa về tổng các bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách đánh số trùng (hai bài đều là "Bài 11"); bản này là bài thứ hai. Sách in "(a+b)^2≥2ab → ab≤(a+b)^2/2" rồi dòng sau lại ghi "ab≤(a+b)^2/4"; đúng phải là (a+b)^2≥4ab (hệ quả Cô-si), phần GIAI dùng bản đúng
## DE
(Tuyển sinh Hải Dương 2013 – 2014) Cho $a,b$ là các số dương thay đổi thoả mãn $a+b=2$. Chứng minh rằng: $Q=2(a^2+b^2)-6\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+9\left(\dfrac{1}{a^2}+\dfrac{1}{b^2}\right)\ge10$.
## SACH
Hướng dẫn giải:

$Q=2(a^2+b^2)-6\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+9\left(\dfrac{1}{a^2}+\dfrac{1}{b^2}\right)$

$=\left(a^2-2\cdot a\cdot\dfrac{3}{b}+\dfrac{9}{b^2}\right)+\left(b^2-2\cdot b\cdot\dfrac{3}{a}+9\cdot\dfrac{1}{a^2}\right)+a^2+b^2$

$=\left(a-\dfrac{3}{b}\right)^2+\left(b-\dfrac{3}{a}\right)^2+a^2+b^2\ge2\left(a-\dfrac{3}{b}\right)\left(b-\dfrac{3}{a}\right)+a^2+b^2$ (áp dụng $A^2+B^2\ge2AB$)

$=2\left(ab-3-3+\dfrac{9}{ab}\right)+(a+b)^2-2ab=2\left(ab-6+\dfrac{9}{ab}\right)+(a+b)^2-2ab$

Thay $a+b=2$ ta có:

$Q\ge2\left(ab-6+\dfrac{9}{ab}\right)+4-2ab=-12+4+\dfrac{18}{ab}=-8+\dfrac{18}{ab}$

Ta có: $(a+b)^2\ge2ab\to ab\le\dfrac{(a+b)^2}{2}$

$\to ab\le\dfrac{(a+b)^2}{4}=\dfrac{4}{4}=1$ nên $\dfrac{1}{ab}\ge1\to\dfrac{18}{ab}\ge18\to-8+\dfrac{18}{ab}\ge-8+18=10$ (vì $ab$ là số dương).

Dấu "=" xảy ra khi $\begin{cases}a-\dfrac{3}{b}=b-\dfrac{3}{a}\\a=b\end{cases}\Leftrightarrow\begin{cases}\dfrac{ab-3}{b}=\dfrac{ab-3}{a}\\a=b\end{cases}$

$\to a=b$, vì $a+b=2\to a=b=1$. Dấu bằng xảy ra khi và chỉ khi $a=b=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các hạng tử $\dfrac{9}{b^2}$, $-\dfrac{6a}{b}$ cùng $a^2$ gợi ngay bình phương $\left(a-\dfrac{3}{b}\right)^2$, nên $Q$ ghép được thành tổng hai bình phương cộng $a^2+b^2$, sau đó chỉ còn lại biến $ab$ và dấu "=" xảy ra ở $a=b=1$.

**Bước 1.** Tách $2(a^2+b^2)$ thành $(a^2+b^2)+a^2+b^2$ rồi nhóm $a^2-\dfrac{6a}{b}+\dfrac{9}{b^2}$ và $b^2-\dfrac{6b}{a}+\dfrac{9}{a^2}$ để viết $Q$ thành hai bình phương cộng $a^2+b^2$.

**Bước 2.** Dùng $A^2+B^2\ge2AB$ cho hai bình phương, rồi khai triển tích $\left(a-\dfrac{3}{b}\right)\left(b-\dfrac{3}{a}\right)$ để chỉ còn lại $ab$ và $\dfrac{9}{ab}$.

**Bước 3.** Thay $a^2+b^2=(a+b)^2-2ab=4-2ab$ nhờ giả thiết, các hạng tử $2ab$ triệt tiêu và biểu thức chỉ còn chứa $\dfrac{1}{ab}$.

**Bước 4.** Dùng $(a+b)^2\ge4ab$ để chặn $ab$ từ trên, từ đó chặn được $\dfrac{18}{ab}$ từ dưới và kết thúc bài toán.

**Chú ý:** Dấu "=" phải xảy ra đồng thời ở hai bất đẳng thức đã dùng; cả hai cùng thoả khi $a=b=1$.

**Phần 2. Trình bày**

$Q=\left(a^2-\dfrac{6a}{b}+\dfrac{9}{b^2}\right)+\left(b^2-\dfrac{6b}{a}+\dfrac{9}{a^2}\right)+a^2+b^2$

$=\left(a-\dfrac{3}{b}\right)^2+\left(b-\dfrac{3}{a}\right)^2+a^2+b^2$

$\ge2\left(a-\dfrac{3}{b}\right)\left(b-\dfrac{3}{a}\right)+a^2+b^2$ (vì $A^2+B^2\ge2AB$)

$=2\left(ab-6+\dfrac{9}{ab}\right)+(a+b)^2-2ab$

Thay $a+b=2$: $Q\ge2ab-12+\dfrac{18}{ab}+4-2ab=\dfrac{18}{ab}-8$

Vì $a,b>0$ nên $4ab\le(a+b)^2=4$, suy ra $0<ab\le1$, do đó $\dfrac{1}{ab}\ge1$

Vậy $Q\ge18-8=10$.

Dấu "=" xảy ra khi $a-\dfrac{3}{b}=b-\dfrac{3}{a}$ và $a=b$, tức $a=b=1$ (khi đó $ab=1$ và cả hai điều kiện đều đúng).

=== C4B.12@p124
- bai: 12 · y: - · trang: 124 · tang: nang_cao
- nguon_de: Tuyển sinh Hải Dương 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số a+1/a≥2 · a^2+b^2≥2ab
- kiem: khong
- ket_qua_sach: 6
- dap_an: $GTNN=6$ khi $x=y$
- ghi_chu_nghi: đề in ngay sau biểu thức S chữ "≥ 6" (gợi ý đáp số in thừa trong đề tìm GTNN); chép đúng như sách in
## DE
(Tuyển sinh Hải Dương 2014 – 2015) Cho $x;y$ là hai số dương thay đổi. Tìm giá trị nhỏ nhất của biểu thức: $S=\dfrac{(x+y)^2}{x^2+y^2}+\dfrac{(x+y)^2}{xy}\ge6$.
## SACH
Hướng dẫn giải:

Ta có: $S=\dfrac{(x+y)^2}{x^2+y^2}+\dfrac{(x+y)^2}{xy}$

$=\left(1+\dfrac{2xy}{x^2+y^2}+\dfrac{x^2+y^2}{xy}+2\right)=3+\left(\dfrac{2xy}{x^2+y^2}+\dfrac{x^2+y^2}{2xy}\right)+\dfrac{x^2+y^2}{2xy}$

Do $x;y$ là các số dương suy ra $\dfrac{2xy}{x^2+y^2}+\dfrac{x^2+y^2}{2xy}\ge2$

$\Leftrightarrow\dfrac{x^2+y^2}{2xy}=\dfrac{2xy}{x^2+y^2}\Leftrightarrow(x^2+y^2)^2=4x^2y^2\Leftrightarrow(x^2-y^2)^2=0$

$\Leftrightarrow x^2=y^2\Leftrightarrow x=y$ $(x;y>0)$

$x^2+y^2\ge2xy\Rightarrow\dfrac{x^2+y^2}{2xy}\ge1\Leftrightarrow x=y$.

Cộng các BĐT ta được $S\ge6$, $S=6\Leftrightarrow x=y$.

Dấu bằng xảy ra khi và chỉ khi $x=y$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai tử đều là $(x+y)^2=x^2+y^2+2xy$ nên tách được các cặp $\dfrac{2xy}{x^2+y^2}$ và $\dfrac{x^2+y^2}{2xy}$ có tích bằng $1$ (dạng Cô-si $t+\dfrac{1}{t}\ge2$), và mọi dấu "=" cùng xảy ra ở $x=y$.

**Bước 1.** Khai triển tử $(x+y)^2=x^2+y^2+2xy$ ở từng phân thức để được $1+\dfrac{2xy}{x^2+y^2}$ và $\dfrac{x^2+y^2}{xy}+2$.

**Bước 2.** Tách $\dfrac{x^2+y^2}{xy}$ thành hai phần bằng nhau $\dfrac{x^2+y^2}{2xy}$ để một phần ghép với $\dfrac{2xy}{x^2+y^2}$ thành cặp hai số nghịch đảo.

**Bước 3.** Dùng Cô-si cho cặp nghịch đảo và dùng $x^2+y^2\ge2xy$ cho phần còn lại, rồi cộng các cận dưới lại.

**Bước 4.** Thử $x=y$ vào biểu thức để chỉ ra cận dưới đạt được, từ đó kết luận giá trị nhỏ nhất.

**Chú ý:** Bài tìm giá trị nhỏ nhất phải có đủ hai việc: bất đẳng thức đúng với mọi $x,y>0$ và một giá trị của biến để dấu "=" xảy ra.

**Phần 2. Trình bày**

$S=\left(1+\dfrac{2xy}{x^2+y^2}\right)+\left(\dfrac{x^2+y^2}{xy}+2\right)=3+\left(\dfrac{2xy}{x^2+y^2}+\dfrac{x^2+y^2}{2xy}\right)+\dfrac{x^2+y^2}{2xy}$

Vì $x,y>0$, theo Cô-si cho hai số dương có tích bằng $1$: $\dfrac{2xy}{x^2+y^2}+\dfrac{x^2+y^2}{2xy}\ge2$

Lại có $x^2+y^2\ge2xy$ nên $\dfrac{x^2+y^2}{2xy}\ge1$

Do đó $S\ge3+2+1=6$ với mọi $x,y>0$.

Khi $x=y$: $S=\dfrac{4x^2}{2x^2}+\dfrac{4x^2}{x^2}=2+4=6$.

Vậy giá trị nhỏ nhất của $S$ là $6$, đạt được khi $x=y$.

=== C4B.13@p125
- bai: 13 · y: - · trang: 125 · tang: nang_cao
- nguon_de: Tuyển sinh Chuyên Toán Thái Bình 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số a/b+b/a≥2 · quy đồng, biến đổi tương đương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Tuyển sinh Chuyên Toán Thái Bình 2014 – 2015) Cho $a,b,c$ là ba số thực dương và có tổng bằng $1$. Chứng minh: $\dfrac{a-bc}{a+bc}+\dfrac{b-ca}{b+ca}+\dfrac{c-ab}{c+ab}\le\dfrac{3}{2}$.
## SACH
Hướng dẫn giải: Ta có:

$\dfrac{a-bc}{a+bc}=1-\dfrac{2bc}{a+bc}=1-\dfrac{2bc}{a(a+b+c)+bc}=1-\dfrac{2bc}{(a+b)(a+c)}$ (vì $a+b+c=1$)

Tương tự: $\dfrac{b-ca}{b+ca}=1-\dfrac{2ca}{(b+c)(b+a)}$; $\dfrac{c-ab}{c+ab}=1-\dfrac{2ab}{(c+a)(c+b)}$.

$\Rightarrow\dfrac{a-bc}{a+bc}+\dfrac{b-ca}{b+ca}+\dfrac{c-ab}{c+ab}=3-2\left(\dfrac{bc}{(a+b)(a+c)}+\dfrac{ca}{(b+c)(b+a)}+\dfrac{ab}{(c+a)(c+b)}\right)$

Từ đó:

$\dfrac{a-bc}{a+bc}+\dfrac{b-ca}{b+ca}+\dfrac{c-ab}{c+ab}\le\dfrac{3}{2}$

$\Leftrightarrow3-2\left(\dfrac{bc}{(a+b)(a+c)}+\dfrac{ca}{(b+c)(b+a)}+\dfrac{ab}{(c+a)(c+b)}\right)\le\dfrac{3}{2}$

$\Leftrightarrow\dfrac{bc}{(a+b)(a+c)}+\dfrac{ca}{(b+c)(b+a)}+\dfrac{ab}{(c+a)(c+b)}\ge\dfrac{3}{4}$

$\Leftrightarrow4bc(b+c)+4ca(c+a)+4ab(a+b)\ge3(a+b)(b+c)(c+a)$

$\Leftrightarrow4b^2c+4bc^2+4c^2a+4ca^2+4a^2b+4ab^2\ge6abc+3a^2b+3ab^2+3b^2c+3bc^2+3ca^2+3c^2a$

$\Leftrightarrow b^2c+bc^2+c^2a+ca^2+a^2b+ab^2\ge6abc$

$\Leftrightarrow\dfrac{b}{a}+\dfrac{c}{a}+\dfrac{c}{b}+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{c}\ge6$ (vì $abc>0$)

$\Leftrightarrow\left(\dfrac{b}{a}+\dfrac{a}{b}-2\right)+\left(\dfrac{c}{b}+\dfrac{b}{c}-2\right)+\left(\dfrac{c}{a}+\dfrac{a}{c}-2\right)\ge0$

$\Leftrightarrow\dfrac{(a-b)^2}{ab}+\dfrac{(b-c)^2}{bc}+\dfrac{(c-a)^2}{ca}\ge0$

Bất đẳng thức này luôn đúng vì $(a-b)^2\ge0$, $(b-c)^2\ge0$, $(c-a)^2\ge0$ và $ab,bc,ca>0$. Vậy $\dfrac{a-bc}{a+bc}+\dfrac{b-ca}{b+ca}+\dfrac{c-ab}{c+ab}\le\dfrac{3}{2}$.

Dấu bằng xảy ra $\Leftrightarrow a=b=c=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khi $a+b+c=1$ thì $a+bc=a(a+b+c)+bc=(a+b)(a+c)$ phân tích được thành tích, nên ba phân thức có chung mẫu $(a+b)(b+c)(c+a)$ và bài toán thành một bất đẳng thức đối xứng bậc ba.

**Bước 1.** Viết $\dfrac{a-bc}{a+bc}=1-\dfrac{2bc}{a+bc}$ rồi thay $1=a+b+c$ vào mẫu để mẫu thành $(a+b)(a+c)$, làm tương tự cho hai phân thức còn lại.

**Bước 2.** Chuyển bất đẳng thức cần chứng minh về dạng tổng ba phân thức $\dfrac{bc}{(a+b)(a+c)}$ lớn hơn hoặc bằng một hằng số, rồi quy đồng với mẫu chung $(a+b)(b+c)(c+a)$ và khai triển.

**Bước 3.** Sau khi gộp các hạng tử giống nhau còn lại sáu hạng tử dạng $a^2b$ không nhỏ hơn $6abc$, ta chia hai vế cho $abc>0$ để chỉ còn các cặp nghịch đảo.

**Bước 4.** Ghép từng cặp $\dfrac{a}{b}+\dfrac{b}{a}$ và dùng Cô-si cho hai số dương để kết thúc, kèm điều kiện xảy ra dấu "=".

**Chú ý:** Có thể dùng thẳng $b(a^2+c^2)\ge2abc$ cho từng cặp hạng tử thay cho việc chia hai vế cho $abc$.

**Phần 2. Trình bày**

Vì $a+b+c=1$ nên $a+bc=a(a+b+c)+bc=(a+b)(a+c)$, do đó $\dfrac{a-bc}{a+bc}=1-\dfrac{2bc}{a+bc}=1-\dfrac{2bc}{(a+b)(a+c)}$

Tương tự $\dfrac{b-ca}{b+ca}=1-\dfrac{2ca}{(b+c)(b+a)}$ và $\dfrac{c-ab}{c+ab}=1-\dfrac{2ab}{(c+a)(c+b)}$

Bất đẳng thức cần chứng minh $\Leftrightarrow3-2\left[\dfrac{bc}{(a+b)(a+c)}+\dfrac{ca}{(b+c)(b+a)}+\dfrac{ab}{(c+a)(c+b)}\right]\le\dfrac{3}{2}$

$\Leftrightarrow\dfrac{bc(b+c)+ca(c+a)+ab(a+b)}{(a+b)(b+c)(c+a)}\ge\dfrac{3}{4}$

$\Leftrightarrow4\left(b^2c+bc^2+c^2a+ca^2+a^2b+ab^2\right)\ge3\left(b^2c+bc^2+c^2a+ca^2+a^2b+ab^2+2abc\right)$ (vì $(a+b)(b+c)(c+a)=b^2c+bc^2+c^2a+ca^2+a^2b+ab^2+2abc$)

$\Leftrightarrow b^2c+bc^2+c^2a+ca^2+a^2b+ab^2\ge6abc$

$\Leftrightarrow\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)+\left(\dfrac{c}{a}+\dfrac{a}{c}\right)\ge6$ (chia hai vế cho $abc>0$)

Bất đẳng thức cuối đúng vì theo Cô-si cho hai số dương, mỗi cặp trong ngoặc đều $\ge2$.

Vậy $\dfrac{a-bc}{a+bc}+\dfrac{b-ca}{b+ca}+\dfrac{c-ab}{c+ab}\le\dfrac{3}{2}$. Dấu "=" xảy ra khi $a=b=c=\dfrac{1}{3}$.

=== C4B.14@p126
- bai: 14 · y: - · trang: 126 · tang: nang_cao
- nguon_de: Tuyển sinh Chuyên toán Thái Bình 2015 – 2016
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hiệu hai lập phương, hiệu hai bình phương · đưa về bình phương của một tổng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề không nói rõ các hệ số và $m,n$ là số thực; lời giải ngầm hiểu là số thực (cần để bình phương không âm)
## DE
(Tuyển sinh Chuyên toán Thái Bình 2015 – 2016) Cho đa thức: $P(x)=ax^3+bx^2+cx+d$ $(a\ne0)$. Biết rằng $P(m)=P(n)$ $(m\ne n)$. Chứng minh rằng: $mn\ge\dfrac{4ac-b^2}{4a^2}$.
## SACH
Hướng dẫn giải:

Do $P(m)=P(n)$ nên $am^3+bm^2+cm+d=an^3+bn^2+cn+d$

$\Leftrightarrow a(m^3-n^3)+b(m^2-n^2)+c(m-n)=0$

$\Leftrightarrow(m-n)\left[a(m+n)^2+b(m+n)-amn+c\right]=0$

$\Leftrightarrow a(m+n)^2+b(m+n)-amn+c=0$ (vì $m\ne n$)

$\Rightarrow mn=(m+n)^2+\dfrac{b}{a}(m+n)+\dfrac{c}{a}$

$\Rightarrow mn-\dfrac{4ac-b^2}{4a^2}=(m+n)^2+\dfrac{b}{a}(m+n)+\dfrac{c}{a}-\dfrac{c}{a}+\left(\dfrac{b}{2a}\right)^2$

$=\left(m+n+\dfrac{b}{2a}\right)^2\ge0$

$\Rightarrow mn\ge\dfrac{4ac-b^2}{4a^2}$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $P(m)=P(n)$ với $m\ne n$ cho một hệ thức giữa $m+n$ và $mn$ sau khi chia cho $m-n$, còn vế phải $\dfrac{4ac-b^2}{4a^2}$ có dạng "phần bù" để một tam thức bậc hai theo $m+n$ trở thành bình phương đủ.

**Bước 1.** Chuyển vế $P(m)-P(n)=0$ rồi nhóm theo từng hệ số $a$, $b$, $c$ để tách hiệu hai lập phương, hiệu hai bình phương và đặt nhân tử chung $m-n$.

**Bước 2.** Vì $m\ne n$ nên chia được cho $m-n$, rồi viết $m^2+mn+n^2=(m+n)^2-mn$ để rút $mn$ theo $m+n$.

**Bước 3.** Lập hiệu $mn-\dfrac{4ac-b^2}{4a^2}$, thay $mn$ vừa rút ra và nhận thấy các hạng tử ghép thành bình phương của một tổng.

**Chú ý:** Bài này chỉ đúng khi các hệ số và $m,n$ là số thực, vì kết luận dựa vào một bình phương không âm.

**Phần 2. Trình bày**

$P(m)=P(n)\Leftrightarrow a(m^3-n^3)+b(m^2-n^2)+c(m-n)=0$

$\Leftrightarrow(m-n)\left[a(m^2+mn+n^2)+b(m+n)+c\right]=0$

Vì $m\ne n$ nên $a(m^2+mn+n^2)+b(m+n)+c=0$, mà $m^2+mn+n^2=(m+n)^2-mn$, suy ra $a(m+n)^2+b(m+n)-amn+c=0$

Chia hai vế cho $a\ne0$: $mn=(m+n)^2+\dfrac{b}{a}(m+n)+\dfrac{c}{a}$

Do đó $mn-\dfrac{4ac-b^2}{4a^2}=(m+n)^2+\dfrac{b}{a}(m+n)+\dfrac{c}{a}-\dfrac{c}{a}+\dfrac{b^2}{4a^2}$

$=\left(m+n+\dfrac{b}{2a}\right)^2\ge0$

Vậy $mn\ge\dfrac{4ac-b^2}{4a^2}$. Dấu "=" xảy ra khi $m+n=-\dfrac{b}{2a}$.

=== C4B.15@p127
- bai: 15 · y: - · trang: 127 · tang: nang_cao
- nguon_de: Tuyển sinh Chuyên Toán Thái Bình 2015 – 2016 vòng 1
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si dạng 1/(x+y)≤(1/4)(1/x+1/y) · Cô-si ba số (x+y+z)(1/x+1/y+1/z)≥9
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách đi vòng (đánh giá 1/(a+2b) hai lần qua 1/(2a+b) rồi giải ra); GIAI đi thẳng bằng (a+b+b)(1/a+1/b+1/b)≥9, cùng ra bất đẳng thức (1),(2),(3) của sách
## DE
(Tuyển sinh Chuyên Toán Thái Bình 2015 – 2016 vòng 1) Cho $3$ số dương $a,b,c$ thoả mãn: $ab+bc+ca=3abc$. Chứng minh: $\dfrac{1}{a+2b+3c}+\dfrac{1}{2a+3b+c}+\dfrac{1}{3a+b+2c}\le\dfrac{1}{2}$.
## SACH
Hướng dẫn giải: Với $a,b>0$ ta có: $4ab\le(a+b)^2$

$\Leftrightarrow\dfrac{1}{a+b}\le\dfrac{a+b}{4ab}\Leftrightarrow\dfrac{1}{a+b}\le\dfrac{1}{4}\left(\dfrac{1}{a}+\dfrac{1}{b}\right)$. Dấu bằng có $\Leftrightarrow a=b$.

Áp dụng kết quả trên, ta có: $\dfrac{1}{a+2b+3c}=\dfrac{1}{(a+2b)+3c}\le\dfrac{1}{4}\left(\dfrac{1}{a+2b}+\dfrac{1}{3c}\right)$.

Lại có: $\dfrac{1}{a+2b}=\dfrac{1}{\left(a+\frac{b}{2}\right)+\frac{3b}{2}}\le\dfrac{1}{4}\left(\dfrac{1}{a+\frac{b}{2}}+\dfrac{1}{\frac{3b}{2}}\right)=\dfrac{1}{2}\cdot\dfrac{1}{2a+b}+\dfrac{1}{6b}$.

Tương tự: $\dfrac{1}{b+2a}\le\dfrac{1}{2}\cdot\dfrac{1}{a+2b}+\dfrac{1}{6a}$

$\Rightarrow\dfrac{1}{a+2b}\le\dfrac{1}{2}\cdot\dfrac{1}{2a+b}+\dfrac{1}{6b}\le\dfrac{1}{4}\cdot\dfrac{1}{a+2b}+\dfrac{1}{12a}+\dfrac{1}{6b}$

$\Rightarrow\dfrac{3}{4}\cdot\dfrac{1}{a+2b}\le\dfrac{1}{12a}+\dfrac{1}{6b}\Leftrightarrow\dfrac{1}{a+2b}\le\dfrac{1}{9a}+\dfrac{2}{9b}$

Suy ra: $\dfrac{1}{a+2b+3c}\le\dfrac{1}{4}\left(\dfrac{1}{a+2b}+\dfrac{1}{3c}\right)\le\dfrac{1}{4}\left(\dfrac{1}{9a}+\dfrac{2}{9b}+\dfrac{1}{3c}\right)$ $(1)$

Tương tự: $\dfrac{1}{2a+3b+c}\le\dfrac{1}{4}\left(\dfrac{2}{9a}+\dfrac{1}{3b}+\dfrac{1}{9c}\right)$ $(2)$

$\dfrac{1}{3a+b+2c}\le\dfrac{1}{4}\left(\dfrac{1}{3a}+\dfrac{1}{9b}+\dfrac{2}{9c}\right)$ $(3)$

Suy ra: $\dfrac{1}{a+2b+3c}+\dfrac{1}{2a+3b+c}+\dfrac{1}{3a+b+2c}\le\dfrac{1}{4}\left(\dfrac{2}{3a}+\dfrac{2}{3b}+\dfrac{2}{3c}\right)=\dfrac{1}{6}\cdot\dfrac{ab+bc+ca}{abc}=\dfrac{1}{6}\cdot3=\dfrac{1}{2}$ $(4)$

Các bất đẳng thức $(1)$, $(2)$ và $(3)$ có dấu bằng xảy ra $\Leftrightarrow a=b=c$.

Còn bất đẳng thức $(4)$ có dấu bằng xảy ra $\Leftrightarrow a=b=c=1$

Vậy $\dfrac{1}{a+2b+3c}+\dfrac{1}{2a+3b+c}+\dfrac{1}{3a+b+2c}\le\dfrac{1}{2}\Leftrightarrow a=b=c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết chia hai vế cho $abc$ thành $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=3$, còn mỗi mẫu là một tổng bậc nhất, nên phải chặn từng phân thức bằng một tổ hợp của $\dfrac{1}{a},\dfrac{1}{b},\dfrac{1}{c}$ nhờ các bất đẳng thức Cô-si dạng nghịch đảo.

**Bước 1.** Chia hai vế của giả thiết cho $abc>0$ để được tổng các nghịch đảo $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$ bằng một hằng số.

**Bước 2.** Tách $a+2b+3c=(a+2b)+3c$ và dùng $\dfrac{1}{x+y}\le\dfrac{1}{4}\left(\dfrac{1}{x}+\dfrac{1}{y}\right)$ cho hai số dương $a+2b$ và $3c$.

**Bước 3.** Chặn tiếp $\dfrac{1}{a+2b}$ bằng $\dfrac{1}{9}\left(\dfrac{1}{a}+\dfrac{2}{b}\right)$ nhờ bất đẳng thức $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ với $x=a$, $y=z=b$, rồi làm tương tự cho hai mẫu còn lại bằng cách đổi vai các biến.

**Bước 4.** Cộng ba bất đẳng thức thì hệ số của $\dfrac{1}{a}$, $\dfrac{1}{b}$, $\dfrac{1}{c}$ bằng nhau, nên dùng giả thiết để kết thúc.

**Chú ý:** Điểm rơi $a=b=c$ cùng với giả thiết cho $a=b=c=1$; đó là chỗ để kiểm tra cách tách mẫu có đúng hay không.

**Phần 2. Trình bày**

Chia hai vế giả thiết cho $abc>0$: $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=3$.

Với $x,y>0$: $(x+y)^2\ge4xy$ nên $\dfrac{1}{x+y}\le\dfrac{1}{4}\left(\dfrac{1}{x}+\dfrac{1}{y}\right)$ $(1)$.

Với $u,v>0$: theo Cô-si ba số $(u+v+v)\left(\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{v}\right)\ge9$ nên $\dfrac{1}{u+2v}\le\dfrac{1}{9}\left(\dfrac{1}{u}+\dfrac{2}{v}\right)$ $(2)$.

Áp dụng $(1)$ với $a+2b$ và $3c$, rồi $(2)$ với $u=a$, $v=b$:

$\dfrac{1}{a+2b+3c}\le\dfrac{1}{4}\left(\dfrac{1}{a+2b}+\dfrac{1}{3c}\right)\le\dfrac{1}{4}\left[\dfrac{1}{9}\left(\dfrac{1}{a}+\dfrac{2}{b}\right)+\dfrac{1}{3c}\right]=\dfrac{1}{36}\left(\dfrac{1}{a}+\dfrac{2}{b}+\dfrac{3}{c}\right)$

Tương tự, với $2a+3b+c=(2a+c)+3b$ và $3a+b+2c=(b+2c)+3a$:

$\dfrac{1}{2a+3b+c}\le\dfrac{1}{36}\left(\dfrac{2}{a}+\dfrac{3}{b}+\dfrac{1}{c}\right)$

$\dfrac{1}{3a+b+2c}\le\dfrac{1}{36}\left(\dfrac{3}{a}+\dfrac{1}{b}+\dfrac{2}{c}\right)$

Cộng ba bất đẳng thức: $\dfrac{1}{a+2b+3c}+\dfrac{1}{2a+3b+c}+\dfrac{1}{3a+b+2c}\le\dfrac{6}{36}\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=\dfrac{1}{6}\cdot3=\dfrac{1}{2}$

Dấu "=" xảy ra khi $a=b=c$ (mọi bất đẳng thức đều đạt dấu "=" ở đó); kết hợp giả thiết $3a^2=3a^3$ được $a=b=c=1$.

=== C4B.16@p128
- bai: 16 · y: - · trang: 128 · tang: nang_cao
- nguon_de: Tuyển sinh Chuyên Toán Thái Bình 2014 – 2015 vòng 1
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số 1/t+t/25≥2/5 · 3(x^2+y^2+z^2)≥(x+y+z)^2
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách dùng kí hiệu $B$ (vế trái) mà không định nghĩa
## DE
(Tuyển sinh Chuyên Toán Thái Bình 2014 – 2015 vòng 1) Cho các số dương $x,y,z$ thỏa mãn $x(x+1)+y(y+1)+z(z+1)\le18$. Chứng minh $\dfrac{1}{x+y+1}+\dfrac{1}{y+z+1}+\dfrac{1}{z+x+1}\ge\dfrac{3}{5}$.
## SACH
Hướng dẫn giải:

$x(x+1)+y(y+1)+z(z+1)\le18\Leftrightarrow x^2+y^2+z^2+(x+y+z)\le18$

$(x-y)^2+(y-z)^2+(z-x)^2\ge0\Rightarrow3(x^2+y^2+z^2)\ge(x+y+z)^2,\ \forall x,y,z$

$54\ge(x+y+z)^2+3(x+y+z)\Leftrightarrow-9\le x+y+z\le6\Rightarrow0<x+y+z\le6$

$\dfrac{1}{x+y+1}+\dfrac{x+y+1}{25}\ge\dfrac{2}{5}$; $\dfrac{1}{y+z+1}+\dfrac{y+z+1}{25}\ge\dfrac{2}{5}$;

$\dfrac{1}{z+x+1}+\dfrac{z+x+1}{25}\ge\dfrac{2}{5}$

$\Rightarrow B+\dfrac{2(x+y+z)+3}{25}\ge\dfrac{6}{5}\Rightarrow B\ge\dfrac{27}{25}-\dfrac{2}{25}(x+y+z)\ge\dfrac{15}{25}=\dfrac{3}{5}$

Dấu bằng xảy ra khi: $\begin{cases}x=y=z>0;\ x+y+z=6\\(x+y+1)^2=(y+z+1)^2=(z+x+1)^2=25\end{cases}\Leftrightarrow x=y=z=2$.

Vậy $\dfrac{1}{x+y+1}+\dfrac{1}{y+z+1}+\dfrac{1}{z+x+1}\ge\dfrac{3}{5}$ khi $x=y=z=2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $x+y+1$, $y+z+1$, $z+x+1$ cộng lại bằng $2(x+y+z)+3$, nên chỉ cần một cận trên của $x+y+z$ từ giả thiết; phân thức dạng $\dfrac{1}{t}$ được chặn dưới bằng Cô-si khi ghép với $\dfrac{t}{25}$ vì giả thiết đạt dấu "=" ở $x=y=z=2$, lúc đó mỗi mẫu bằng $5$.

**Bước 1.** Đặt $s=x+y+z$ và dùng $3(x^2+y^2+z^2)\ge s^2$ để từ giả thiết suy ra bất phương trình bậc hai theo $s$, từ đó chặn được $s$ từ trên.

**Bước 2.** Nhận ra giả thiết đạt dấu "=" khi $x=y=z=2$, tức mỗi mẫu bằng $5$, nên ghép mỗi phân thức $\dfrac{1}{t}$ với $\dfrac{t}{25}$ để dùng Cô-si.

**Bước 3.** Cộng ba bất đẳng thức Cô-si để có chặn dưới của tổng cần chứng minh theo $s$.

**Bước 4.** Dùng cận trên của $s$ để chặn tiếp rồi kiểm tra dấu "=" tại $x=y=z=2$.

**Chú ý:** Hệ số $\dfrac{1}{25}$ không tự nhiên mà có: nó được chọn sao cho dấu "=" của Cô-si ($t^2=25$) trùng với điểm rơi của giả thiết.

**Phần 2. Trình bày**

Đặt $s=x+y+z>0$ và gọi $B$ là vế trái cần chứng minh. Giả thiết $\Leftrightarrow x^2+y^2+z^2+s\le18$.

Vì $3(x^2+y^2+z^2)-s^2=(x-y)^2+(y-z)^2+(z-x)^2\ge0$ nên $3(x^2+y^2+z^2)\ge s^2$

$54\ge3(x^2+y^2+z^2)+3s\ge s^2+3s\Rightarrow(s+9)(s-6)\le0\Rightarrow s\le6$ (vì $s+9>0$)

Theo Cô-si cho hai số dương: $\dfrac{1}{x+y+1}+\dfrac{x+y+1}{25}\ge2\sqrt{\dfrac{1}{25}}=\dfrac{2}{5}$, tương tự cho $y+z+1$ và $z+x+1$

Cộng ba bất đẳng thức: $B+\dfrac{2s+3}{25}\ge\dfrac{6}{5}$

$\Rightarrow B\ge\dfrac{6}{5}-\dfrac{2s+3}{25}=\dfrac{27}{25}-\dfrac{2s}{25}\ge\dfrac{27}{25}-\dfrac{12}{25}=\dfrac{3}{5}$ (vì $s\le6$)

Dấu "=" xảy ra khi $x=y=z$ và $s=6$, tức $x=y=z=2$ (khi đó $x+y+1=5$ và giả thiết đúng bằng $18$). Vậy $B\ge\dfrac{3}{5}$.

=== C4B.17@p128
- bai: 17 · y: - · trang: 128 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: kĩ thuật SOS (tổng các hiệu bình phương có hệ số) · Cô-si hai số · a^2+b^2≥2ab · sắp thứ tự x≥y≥z
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách in dấu bằng x=y=z=√(2/3), nhưng với x^2+y^2+z^2=√2 phải là x=y=z=√(√2/3) (3x^2=√2); dấu bằng còn xảy ra khi một biến bằng ⁴√2, hai biến kia bằng 0. Sách ghi S_y+S_x=(y+z-4xyz)/(4xyz), đúng ra là (x+y-4xyz)/(4xyz); ý "S_y≥0" sách không giải thích (GIAI chứng minh xz≤1/2). GIAI theo hướng SOS của sách nhưng nhân thêm xyz để không phải chia
## DE
Cho $3$ số thực không âm $x,y,z$ thỏa mãn $x^2+y^2+z^2=\sqrt2$. Chứng minh rằng: $(x+y)(y+z)(z+x)+4xyz(xy+yz+zx-2)\ge4xyz(x^2+y^2+z^2)$.
## SACH
Hướng dẫn giải: Ta chứng minh bổ đề sau:

Xét biểu thức $S=(x-y)^2S_z+(y-z)^2S_x+(x-z)^2S_y$.

Nếu $x\ge y\ge z$ và $S_y$; $S_y+S_z$; $S_y+S_x\ge0$ thì $S\ge0$.

$S=(x-y)^2S_z+(y-z)^2S_x+(x-z)^2S_y$

$=(S_z+S_y)(x-y)^2+(S_y+S_x)(y-z)^2+2(x-y)(y-z)S_y\ge0$

Nếu $xyz=0$. Bất đẳng thức luôn đúng.

Nếu $xyz\ne0$. Ta có:

$(x+y)(y+z)(z+x)+4xyz(xy+yz+zx-2)\ge4xyz(x^2+y^2+z^2)$

$\Leftrightarrow\dfrac{(x+y)(y+z)(z+x)}{4xyz}+xy+yz+zx\ge2+\sqrt2$

$\Leftrightarrow\dfrac{(x+y)(y+z)(z+x)}{4xyz}+xy+yz+zx-2-\sqrt2\ge0$ $(1)$

Ta có $\dfrac{(x+y)(y+z)(z+x)}{4xyz}-2=\dfrac{x(y-z)^2+y(z-x)^2+z(x-y)^2}{4xyz}$

$\sqrt2\left(1-\dfrac{xy+yz+zx}{x^2+y^2+z^2}\right)=\dfrac12\left[(x-y)^2+(y-z)^2+(z-x)^2\right]$.

Từ $(1)\Leftrightarrow(x-y)^2\left(\dfrac{1}{4xy}-\dfrac12\right)+(y-z)^2\left(\dfrac{1}{4yz}-\dfrac12\right)+(z-x)^2\left(\dfrac{1}{4zx}-\dfrac12\right)\ge0$

Đặt $S_z=\left(\dfrac{1}{4xy}-\dfrac12\right)$; $S_x=\left(\dfrac{1}{4yz}-\dfrac12\right)$; $S_y=\left(\dfrac{1}{4xz}-\dfrac12\right)$.

Giả sử $x\ge y\ge z\Rightarrow S_y=\left(\dfrac{1}{4xz}-\dfrac12\right)\ge0$.

Mà $S_y+S_x=\dfrac{1}{4xz}-\dfrac12+\dfrac{1}{4yz}-\dfrac12=\dfrac{y+z-4xyz}{4xyz}$

$=\dfrac{(y+z)(x^2+y^2+z^2)-4\sqrt2xyz}{4\sqrt2xyz}\ge\dfrac{2\sqrt{yz}(x^2+2yz)-4\sqrt2xyz}{4\sqrt2xyz}\ge0$

Tương tự $S_y+S_z\ge0$. Áp dụng bổ đề suy ra điều cần chứng minh.

Đẳng thức xảy ra khi $x=y=z=\sqrt{\dfrac23}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề không đồng bậc nên chưa dùng ngay được Cô-si; chuyển vế rồi dùng hai đồng nhất thức đối xứng thì hiệu hai vế thành tổng ba số hạng dạng (hệ số)$\cdot$(hiệu hai biến)$^2$ trong đó hệ số có thể âm, vì vậy phải sắp thứ tự $x\ge y\ge z$ để xử lí hệ số âm (kĩ thuật SOS của sách), còn giả thiết $x^2+y^2+z^2=\sqrt2$ chỉ dùng để đánh giá các hệ số.

**Bước 1.** Dùng $(x+y)(y+z)(z+x)-8xyz=\sum x(y-z)^2$ và $x^2+y^2+z^2-(xy+yz+zx)=\dfrac12\sum(y-z)^2$ để viết hiệu hai vế $D$ thành $A_x(y-z)^2+A_y(z-x)^2+A_z(x-y)^2$ với $A_x=x(1-2yz)$ và các hệ số tương tự.

**Bước 2.** Chứng minh tổng của hai hệ số bất kì không âm, chẳng hạn $A_y+A_z=y+z-4xyz\ge0$, bằng cách thay $1=\dfrac{x^2+y^2+z^2}{\sqrt2}$ rồi dùng Cô-si hai lần để triệt tiêu $4\sqrt2xyz$.

**Bước 3.** Sắp thứ tự $x\ge y\ge z$ vì $D$ đối xứng, rồi chứng minh hệ số ở giữa $A_y\ge0$ nhờ $xz\le\dfrac12$, suy ra từ $x^2+2z^2\le x^2+y^2+z^2=\sqrt2$ và Cô-si cho hai số $x^2$ và $2z^2$.

**Bước 4.** Dùng $(z-x)^2\ge(x-y)^2+(y-z)^2$ (vì $y$ nằm giữa $z$ và $x$) nhân với $A_y\ge0$ để gộp thành hai số hạng có hệ số là tổng hai $A$, mỗi số hạng đều không âm.

**Chú ý:** Dấu "=" đạt tại $x=y=z=\sqrt{\dfrac{\sqrt2}{3}}$ và cả khi một biến bằng $\sqrt[4]{2}$, hai biến còn lại bằng $0$; trường hợp $xyz=0$ nằm gọn trong lập luận trên nên không phải xét riêng.

**Phần 2. Trình bày**

Gọi $D$ là vế trái trừ vế phải. Vì $4xyz(xy+yz+zx-2)=4xyz(xy+yz+zx)-8xyz$ nên

$D=\left[(x+y)(y+z)(z+x)-8xyz\right]-4xyz\left[x^2+y^2+z^2-(xy+yz+zx)\right]$

Mà $(x+y)(y+z)(z+x)-8xyz=x(y-z)^2+y(z-x)^2+z(x-y)^2$ và $x^2+y^2+z^2-xy-yz-zx=\dfrac12\left[(x-y)^2+(y-z)^2+(z-x)^2\right]$, nên

$D=A_x(y-z)^2+A_y(z-x)^2+A_z(x-y)^2$, với $A_x=x(1-2yz)$, $A_y=y(1-2zx)$, $A_z=z(1-2xy)$

Chứng minh $A_y+A_z\ge0$: $A_y+A_z=y+z-4xyz$, và với $x^2+y^2+z^2=\sqrt2$ thì $\sqrt2(y+z-4xyz)=(y+z)(x^2+y^2+z^2)-4\sqrt2xyz$

$\ge2\sqrt{yz}\,(x^2+2yz)-4\sqrt2xyz$ (Cô-si: $y+z\ge2\sqrt{yz}$ và $y^2+z^2\ge2yz$)

$\ge2\sqrt{yz}\cdot2\sqrt2\,x\sqrt{yz}-4\sqrt2xyz=0$ (Cô-si: $x^2+2yz\ge2\sqrt{x^2\cdot2yz}=2\sqrt2\,x\sqrt{yz}$)

Vậy $A_y+A_z\ge0$; đổi vai các biến thì tương tự $A_x+A_y=x+y-4xyz\ge0$.

Vì $D$ đối xứng theo $x,y,z$ nên giả sử $x\ge y\ge z\ge0$. Do $y\ge z$ nên $2\sqrt2\,xz\le x^2+2z^2\le x^2+y^2+z^2=\sqrt2$, suy ra $xz\le\dfrac12$ và $A_y=y(1-2xz)\ge0$.

Vì $x\ge y\ge z$ nên $(x-z)^2=\left[(x-y)+(y-z)\right]^2\ge(x-y)^2+(y-z)^2$. Nhân với $A_y\ge0$:

$D\ge(A_x+A_y)(y-z)^2+(A_y+A_z)(x-y)^2\ge0$

Vậy bất đẳng thức được chứng minh.

=== C4B.18@p130
- bai: 18 · y: - · trang: 130 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: 1/u+1/v≥4/(u+v) · hệ quả (x+y)^2≥4xy · tách hạng tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: ở dòng "≥" đầu tiên sách in số hạng giữa là 2017·xy/(2xy), thiếu hệ số 4 so với dòng sau (2017·4xy/(2xy)); kết quả cuối của sách đúng
## DE
(Diễn đàn toán học) Cho các số dương $x,y$. Chứng minh: $\dfrac{2017(x+y)^2}{x^2+y^2}+\dfrac{2018(x+y)^2}{xy}\ge12106$.
## SACH
Hướng dẫn giải:

Ta có: $A=\dfrac{2017(x+y)^2}{x^2+y^2}+\dfrac{2018(x+y)^2}{xy}$

$=\left(\dfrac{2017(x+y)^2}{x^2+y^2}+\dfrac{2017(x+y)^2}{2xy}\right)+\dfrac{2017(x+y)^2}{2xy}+\dfrac{(x+y)^2}{xy}$

Sử dụng BĐT: $(x+y)^2\ge4xy\Rightarrow\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y$ dương.

Lúc đó ta có: $A=\left(\dfrac{2017(x+y)^2}{x^2+y^2}+\dfrac{2017(x+y)^2}{2xy}\right)+\dfrac{2017(x+y)^2}{2xy}+\dfrac{(x+y)^2}{xy}$

$\ge\dfrac{2017\cdot4(x+y)^2}{(x+y)^2}+\dfrac{2017\cdot xy}{2xy}+\dfrac{4xy}{xy}$

Hay $A\ge\dfrac{2017\cdot4\cdot(x+y)^2}{(x+y)^2}+\dfrac{2017\cdot4xy}{2xy}+\dfrac{4xy}{xy}=2017\cdot4+2017\cdot2+4=12106$.

Dấu bằng xảy ra $\Leftrightarrow x=y$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai mẫu $x^2+y^2$ và $2xy$ cộng lại đúng bằng $(x+y)^2$, chính là tử của hai phân thức, nên bất đẳng thức $\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$ làm tử và mẫu triệt tiêu nhau.

**Bước 1.** Tách $\dfrac{2018(x+y)^2}{xy}$ thành $\dfrac{2017(x+y)^2}{2xy}+\dfrac{2017(x+y)^2}{2xy}+\dfrac{(x+y)^2}{xy}$ để một phần ghép với phân thức thứ nhất thành cặp có chung hệ số $2017$.

**Bước 2.** Với cặp đầu, dùng $\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$ cho $u=x^2+y^2$ và $v=2xy$ để mẫu trở thành $(x+y)^2$ và triệt tiêu tử.

**Bước 3.** Với hai phân thức còn lại, dùng $(x+y)^2\ge4xy$ để tử bị mẫu triệt tiêu và chỉ còn các hằng số.

**Bước 4.** Cộng các cận dưới bằng hằng số và kiểm tra dấu "=" của mọi bất đẳng thức đã dùng đều xảy ra cùng lúc ở $x=y$.

**Chú ý:** Hệ số $2017$ của phân thức thứ nhất quyết định cách tách $2018=2017+1$ ở phân thức thứ hai; tách sai hệ số thì tử không triệt tiêu được.

**Phần 2. Trình bày**

Gọi $A$ là vế trái. Ta có $A=2017(x+y)^2\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\dfrac{2017(x+y)^2}{2xy}+\dfrac{(x+y)^2}{xy}$

Với $u,v>0$: $(u+v)^2\ge4uv\Rightarrow\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$. Lấy $u=x^2+y^2$, $v=2xy$: $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\ge\dfrac{4}{(x+y)^2}$

Vì $(x+y)^2\ge4xy$ nên $\dfrac{(x+y)^2}{2xy}\ge2$ và $\dfrac{(x+y)^2}{xy}\ge4$

Do đó $A\ge2017\cdot4+2017\cdot2+4=8068+4034+4=12106$

Dấu "=" xảy ra khi $x^2+y^2=2xy$ và $x=y$, tức $x=y$. Vậy bất đẳng thức được chứng minh.

=== C4B.19@p130
- bai: 19 · y: - · trang: 130 · tang: nang_cao
- nguon_de: Diễn đàn toán học
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: 1/u+1/v≥4/(u+v) · hệ quả (u+v)^2≥4uv · thay 2017=a+b+c
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: dòng gộp của sách in tử số của phân thức thứ hai là "ab+bc" (đúng phải là ab+ca); GIAI dùng bản đúng
## DE
(Diễn đàn toán học) Cho các số dương $a,b,c$ có tổng bằng $2017$. Chứng minh: $\dfrac{ab}{c+2017}+\dfrac{bc}{a+2017}+\dfrac{ca}{b+2017}\le\dfrac{2017}{4}$.
## SACH
Hướng dẫn giải:

Ta có: $\dfrac{ab}{c+2017}+\dfrac{bc}{a+2017}+\dfrac{ca}{b+2017}=\dfrac{ab}{a+b+2c}+\dfrac{bc}{c+b+2a}+\dfrac{ac}{a+2b+c}$.

Sử dụng BĐT: $(x+y)^2\ge4xy\Rightarrow\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y$ dương. Ta có

$\dfrac{ab}{a+b+2c}+\dfrac{bc}{c+b+2a}+\dfrac{ac}{a+2b+c}\le\dfrac14\left(\dfrac{ab+bc}{a+c}+\dfrac{ab+bc}{b+c}+\dfrac{bc+ac}{a+b}\right)=\dfrac14(a+b+c)$.

Suy ra $\dfrac{ab}{c+2017}+\dfrac{bc}{a+2017}+\dfrac{ca}{b+2017}\le\dfrac{2017}{4}$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c=\dfrac{2017}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thay $2017=a+b+c$ vào mẫu thì $c+2017=a+b+2c=(a+c)+(b+c)$ là tổng của hai số dương, nên chặn từ trên bằng $\dfrac{1}{u+v}\le\dfrac{1}{4}\left(\dfrac{1}{u}+\dfrac{1}{v}\right)$ và mẫu mới chỉ là tổng của hai biến.

**Bước 1.** Thay $2017=a+b+c$ vào các mẫu để mỗi mẫu thành tổng của hai biểu thức dạng $a+b$, $b+c$ hoặc $c+a$.

**Bước 2.** Dùng $\dfrac{1}{u+v}\le\dfrac{1}{4}\left(\dfrac{1}{u}+\dfrac{1}{v}\right)$ cho từng phân thức, mỗi phân thức tách thành hai phân thức có mẫu là tổng hai biến.

**Bước 3.** Cộng ba bất đẳng thức rồi nhóm theo mẫu $a+b$, $b+c$, $c+a$; tử của mỗi nhóm có nhân tử chung chính là mẫu nên rút gọn được.

**Chú ý:** Tách đúng cặp mẫu để các nhóm sau khi cộng có tử chia hết cho mẫu; chẳng hạn mẫu $a+c$ nhận $ab$ từ phân thức thứ nhất và $bc$ từ phân thức thứ hai, cộng lại được $b(a+c)$.

**Phần 2. Trình bày**

Vì $a+b+c=2017$ nên $c+2017=(a+c)+(b+c)$, $a+2017=(a+b)+(a+c)$, $b+2017=(a+b)+(b+c)$

Với $u,v>0$: $(u+v)^2\ge4uv\Rightarrow\dfrac{1}{u+v}\le\dfrac{1}{4}\left(\dfrac{1}{u}+\dfrac{1}{v}\right)$. Do đó

$\dfrac{ab}{c+2017}\le\dfrac{ab}{4}\left(\dfrac{1}{a+c}+\dfrac{1}{b+c}\right)$

$\dfrac{bc}{a+2017}\le\dfrac{bc}{4}\left(\dfrac{1}{a+b}+\dfrac{1}{a+c}\right)$

$\dfrac{ca}{b+2017}\le\dfrac{ca}{4}\left(\dfrac{1}{a+b}+\dfrac{1}{b+c}\right)$

Cộng ba bất đẳng thức và nhóm theo mẫu: $\dfrac{ab}{c+2017}+\dfrac{bc}{a+2017}+\dfrac{ca}{b+2017}\le\dfrac{1}{4}\left[\dfrac{ab+bc}{a+c}+\dfrac{ab+ca}{b+c}+\dfrac{bc+ca}{a+b}\right]$

$=\dfrac{1}{4}(b+a+c)=\dfrac{2017}{4}$

Dấu "=" xảy ra khi $a+c=b+c$, $a+b=a+c$ và $a+b=b+c$, tức $a=b=c=\dfrac{2017}{3}$.

=== C4B.20@p131
- bai: 20 · y: - · trang: 131 · tang: nang_cao
- nguon_de: Chuyên Yên Bái 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ a=x+1,b=y+2,c=z+3 · nhân thêm a+b+c=1 · Cô-si hai số a/b+b/a≥2
- kiem: khong
- ket_qua_sach: x=-\dfrac{5}{6}; y=-\dfrac{5}{3}; z=-\dfrac{5}{2}
- dap_an: Chứng minh; dấu "=" xảy ra khi $x=-\dfrac{5}{6}$, $y=-\dfrac{5}{3}$, $z=-\dfrac{5}{2}$
- ghi_chu_nghi:
## DE
(Chuyên Yên Bái 2014 – 2015) Cho $x>-1$; $y>-2$; $z>-3$ và $x+y+z=-5$. Chứng minh rằng: $\dfrac{1}{x+1}+\dfrac{4}{y+2}+\dfrac{9}{z+3}\ge36$. Dấu "=" xảy ra khi nào?
## SACH
Hướng dẫn giải: Đặt $A=\dfrac{1}{x+1}+\dfrac{4}{y+2}+\dfrac{9}{z+3}$;

Với $x+y+z=-5\Leftrightarrow(x+1)+(y+2)+(z+3)=1$

Đặt $a=x+1$, $b=y+2$, $c=z+3\Rightarrow a,b,c>0$ và $a+b+c=1$

Khi đó:

$A=\dfrac{1}{a}+\dfrac{4}{b}+\dfrac{9}{c}=(a+b+c)\left(\dfrac{1}{a}+\dfrac{4}{b}+\dfrac{9}{c}\right)=14+\left(\dfrac{4a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{9a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{4c}{b}+\dfrac{9b}{c}\right)$

Có $\dfrac{4a}{b}+\dfrac{b}{a}\ge4$; $\dfrac{9a}{c}+\dfrac{c}{a}\ge6$; $\dfrac{4c}{b}+\dfrac{9b}{c}\ge12\Rightarrow A\ge36$

Dấu "=" xảy ra $\Leftrightarrow\begin{cases}b=2a\\c=3a\\a+b+c=1\end{cases}\Leftrightarrow\begin{cases}a=\dfrac{1}{6}\\b=\dfrac{1}{3}\\c=\dfrac{1}{2}\end{cases}\Leftrightarrow\begin{cases}x=-\dfrac{5}{6}\\y=-\dfrac{5}{3}\\z=-\dfrac{5}{2}\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $x+1$, $y+2$, $z+3$ cộng lại đúng bằng $1$ (do $x+y+z=-5$), nên đặt $a,b,c$ dương có tổng bằng $1$ rồi nhân biểu thức với $a+b+c=1$ để mỗi tử $1,4,9$ gặp đủ ba biến, tạo ra các cặp Cô-si dạng $\dfrac{ka}{b}+\dfrac{b}{a}$.

**Bước 1.** Đặt $a=x+1$, $b=y+2$, $c=z+3$ rồi kiểm tra từ điều kiện của đề rằng $a,b,c>0$ và $a+b+c=1$.

**Bước 2.** Nhân vế trái với $a+b+c=1$ và khai triển thành một hằng số cộng sáu phân thức chéo.

**Bước 3.** Ghép sáu phân thức chéo thành ba cặp có tích bằng hằng số rồi dùng Cô-si cho hai số dương ở từng cặp để có cận dưới.

**Bước 4.** Giải hệ điều kiện dấu "=" của ba cặp cùng với $a+b+c=1$ để tìm $a,b,c$ rồi quay về $x,y,z$.

**Chú ý:** Có thể dùng Bu-nhi-a-cốp-xki: $\left(\dfrac{1}{a}+\dfrac{4}{b}+\dfrac{9}{c}\right)(a+b+c)\ge(1+2+3)^2$, cùng một kết quả.

**Phần 2. Trình bày**

Đặt $a=x+1$, $b=y+2$, $c=z+3$. Khi đó $a,b,c>0$ và $a+b+c=x+y+z+6=1$.

Gọi $A$ là vế trái: $A=\dfrac{1}{a}+\dfrac{4}{b}+\dfrac{9}{c}=(a+b+c)\left(\dfrac{1}{a}+\dfrac{4}{b}+\dfrac{9}{c}\right)$

$=14+\left(\dfrac{4a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{9a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{4c}{b}+\dfrac{9b}{c}\right)$

Theo Cô-si cho hai số dương: $\dfrac{4a}{b}+\dfrac{b}{a}\ge2\sqrt{4}=4$, $\ \dfrac{9a}{c}+\dfrac{c}{a}\ge2\sqrt{9}=6$, $\ \dfrac{4c}{b}+\dfrac{9b}{c}\ge2\sqrt{36}=12$

Vậy $A\ge14+4+6+12=36$.

Dấu "=" xảy ra khi $b=2a$, $c=3a$ và $a+b+c=1$, suy ra $6a=1$, tức $a=\dfrac{1}{6}$, $b=\dfrac{1}{3}$, $c=\dfrac{1}{2}$.

Vậy dấu "=" xảy ra khi $x=-\dfrac{5}{6}$, $y=-\dfrac{5}{3}$, $z=-\dfrac{5}{2}$.

=== C4B.21@p131
- bai: 21 · y: - · trang: 131 · tang: nang_cao
- nguon_de: Chuyên Phan Bội Châu – Nghệ An 2014 – 2015
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đổi biến x=a√2 · A^2+B^2≥2AB · (x+y)^2≤2(x^2+y^2)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách chỉ nêu dấu bằng khi a=b=c=1/√2; thực tế còn xảy ra khi a=b=c=-1/√2 (xy=1, x=y, (x+y)z=2 cho x=y=z=±1)
## DE
(Chuyên Phan Bội Châu – Nghệ An 2014 – 2015) Cho $a,b,c$ là các số thực. Chứng minh: $(a^2+1)(b^2+1)(c^2+1)\ge\dfrac{3(a+b+c)^2}{4}$.
## SACH
Hướng dẫn giải: Đặt $x=a\sqrt2,\ y=b\sqrt2,\ z=c\sqrt2$.

Ta cần chứng minh $(x^2+2)(y^2+2)(z^2+2)\ge3(x+y+z)^2$

Ta có $(x^2+2)(y^2+2)=(x^2+1)(y^2+1)+x^2+y^2+3=x^2y^2+1+2x^2+2y^2+3$

$\Rightarrow(x^2+2)(y^2+2)\ge2xy+x^2+y^2+\dfrac{(x+y)^2}{2}+3=\dfrac{3}{2}\left[(x+y)^2+2\right]$

$\Rightarrow(x^2+2)(y^2+2)(z^2+2)\ge\dfrac{3}{2}\left[(x+y)^2z^2+4+2(x+y)^2+2z^2\right]$

$\ge\dfrac{3}{2}\left[4(x+y)z+2(x+y)^2+2z^2\right]=3(x+y+z)^2$

$\Rightarrow(a^2+1)(b^2+1)(c^2+1)\ge\dfrac{3(a+b+c)^2}{4}$. Dấu đẳng thức xảy ra khi $a=b=c=\dfrac{1}{\sqrt2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thử $a=b=c=t$ thì dấu "=" xảy ra ở $t^2=\dfrac12$, nên đặt $x=a\sqrt2$ để điểm rơi thành $x=y=z=\pm1$ và các hằng số $2$ trong $x^2+2$ trở nên "tròn"; sau đó nhân từng cặp thừa số, rồi gộp với thừa số thứ ba.

**Bước 1.** Đổi biến $x=a\sqrt2$, $y=b\sqrt2$, $z=c\sqrt2$ để bất đẳng thức trở thành $(x^2+2)(y^2+2)(z^2+2)\ge3(x+y+z)^2$ không còn căn.

**Bước 2.** Khai triển $(x^2+2)(y^2+2)$ rồi dùng $x^2y^2+1\ge2xy$ và $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ để chặn dưới bằng một biểu thức chỉ chứa $x+y$.

**Bước 3.** Nhân bất đẳng thức vừa có với $z^2+2>0$ rồi dùng $u^2+4\ge4u$ với $u=(x+y)z$ để tạo ra các hạng tử của $(x+y+z)^2$.

**Bước 4.** Quay về $a,b,c$ và xác định dấu "=" từ các điều kiện $xy=1$, $x=y$, $(x+y)z=2$.

**Chú ý:** Nhớ rằng $a,b,c$ là số thực bất kì, nên điểm rơi có hai bộ $\pm$; kiểm lại bằng cách thay $a=b=c=-\dfrac{1}{\sqrt2}$.

**Phần 2. Trình bày**

Đặt $x=a\sqrt2$, $y=b\sqrt2$, $z=c\sqrt2$. Vì $a^2+1=\dfrac{x^2+2}{2}$ và $(a+b+c)^2=\dfrac{(x+y+z)^2}{2}$ nên bất đẳng thức tương đương với

$(x^2+2)(y^2+2)(z^2+2)\ge3(x+y+z)^2$ $(*)$

Ta có $(x^2+2)(y^2+2)=(x^2y^2+1)+(x^2+y^2)+(x^2+y^2)+3$

$\ge2xy+(x^2+y^2)+\dfrac{(x+y)^2}{2}+3$ (vì $x^2y^2+1\ge2xy$ và $x^2+y^2\ge\dfrac{(x+y)^2}{2}$)

$=(x+y)^2+\dfrac{(x+y)^2}{2}+3=\dfrac{3}{2}\left[(x+y)^2+2\right]$

Nhân với $z^2+2>0$: $(x^2+2)(y^2+2)(z^2+2)\ge\dfrac{3}{2}\left[(x+y)^2z^2+4+2(x+y)^2+2z^2\right]$

Vì $(x+y)^2z^2+4\ge4(x+y)z$ (do $\left[(x+y)z-2\right]^2\ge0$) nên

$\ge\dfrac{3}{2}\left[4(x+y)z+2(x+y)^2+2z^2\right]=3\left[(x+y)^2+2(x+y)z+z^2\right]=3(x+y+z)^2$

Vậy $(*)$ đúng, tức $(a^2+1)(b^2+1)(c^2+1)\ge\dfrac{3(a+b+c)^2}{4}$.

Dấu "=" xảy ra khi $xy=1$, $x=y$ và $(x+y)z=2$, tức $x=y=z=\pm1$, hay $a=b=c=\pm\dfrac{1}{\sqrt2}$.

=== C4B.22@p132
- bai: 22 · y: - · trang: 132 · tang: nang_cao
- nguon_de: HSG tỉnh Gia Lai 2016 – 2017
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: sắp thứ tự x≥y≥z · (a-b)(b-c)≥0 · đánh giá nhờ điều kiện chặn 1≤a,b,c≤2
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách in bất đẳng thức thứ hai là "a/c+1 ≥ c/b+b/a"; đúng phải là "c/a+1 ≥ c/b+b/a" (suy từ chia ab+bc≥b^2+ca cho ab) — dòng "Suy ra" sau đó của sách đúng với bản này. GIAI dùng bản đúng
## DE
(HSG tỉnh Gia Lai 2016 – 2017) Cho các số thực $a,b,c$ sao cho $1\le a,b,c\le2$. Chứng minh rằng: $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\le10$.
## SACH
Hướng dẫn giải:

Ta có: $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\le10\Leftrightarrow\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{b}{a}+\dfrac{c}{b}+\dfrac{a}{c}\le7$

Không mất tính tổng quát, giả sử $a\ge b\ge c$.

Khi đó ta có $(a-b)(b-c)\ge0$ suy ra $ab+bc\ge b^2+ca$.

Từ đó suy ra $\dfrac{a}{c}+1\ge\dfrac{a}{b}+\dfrac{b}{c}$; $\dfrac{a}{c}+1\ge\dfrac{c}{b}+\dfrac{b}{a}$.

Suy ra $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{b}{a}+\dfrac{c}{b}+\dfrac{a}{c}\le2+2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)$.

Ta cần chứng minh $2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)\le5$. Tức là chứng minh $\left(\dfrac{2a}{c}-1\right)\left(1-\dfrac{2c}{a}\right)\le0$ $(*)$

Bất đẳng thức $(*)$ luôn đúng vì $2\ge a\ge c\ge1\Rightarrow\dfrac{a}{c}\ge1;\dfrac{c}{a}\ge\dfrac{1}{2}$. Từ đó suy ra đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái đối xứng và có điều kiện chặn hai đầu $1\le a,b,c\le2$; dấu "=" xảy ra ở biên (chẳng hạn bộ $(1,1,2)$) chứ không ở $a=b=c$, nên Cô-si không đủ; phải sắp thứ tự $a\ge b\ge c$ và dùng tích $(a-b)(b-c)\ge0$ cùng điều kiện biên.

**Bước 1.** Khai triển vế trái thành $3$ cộng sáu phân thức dạng $\dfrac{a}{b}$ để đưa bất đẳng thức về dạng tổng sáu phân thức không vượt quá một hằng số.

**Bước 2.** Sắp thứ tự $a\ge b\ge c$ vì biểu thức đối xứng, rồi từ $(a-b)(b-c)\ge0$ rút ra $ab+bc\ge b^2+ca$ và chia cho $bc$, cho $ab$ để được hai bất đẳng thức giữa các phân thức.

**Bước 3.** Cộng hai bất đẳng thức đó để loại các phân thức chứa $b$, khi đó tổng sáu phân thức bị chặn trên bởi một biểu thức chỉ có $\dfrac{a}{c}$ và $\dfrac{c}{a}$.

**Bước 4.** Dùng điều kiện $1\le c\le a\le2$ để chứng minh tích $\left(\dfrac{2a}{c}-1\right)\left(1-\dfrac{2c}{a}\right)$ không dương, tức $2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)\le5$.

**Chú ý:** Dấu "=" xảy ra chẳng hạn khi $(a,b,c)$ là hoán vị của $(1,1,2)$ hoặc của $(1,2,2)$; vì dấu "=" ở biên nên mọi cách dùng Cô-si với $a=b=c$ đều bất lực.

**Phần 2. Trình bày**

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=3+\dfrac{a}{b}+\dfrac{b}{a}+\dfrac{b}{c}+\dfrac{c}{b}+\dfrac{c}{a}+\dfrac{a}{c}$ nên bất đẳng thức tương đương với $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{b}{a}+\dfrac{c}{b}+\dfrac{a}{c}\le7$ $(*)$

Vế trái của $(*)$ đối xứng nên giả sử $a\ge b\ge c$. Khi đó $(a-b)(b-c)\ge0$, tức $ab+bc\ge b^2+ca$.

Chia hai vế cho $bc>0$: $\dfrac{a}{c}+1\ge\dfrac{b}{c}+\dfrac{a}{b}$. Chia hai vế cho $ab>0$: $1+\dfrac{c}{a}\ge\dfrac{b}{a}+\dfrac{c}{b}$.

Cộng hai bất đẳng thức: $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{b}{a}+\dfrac{c}{b}\le2+\dfrac{a}{c}+\dfrac{c}{a}$

Cộng thêm $\dfrac{a}{c}+\dfrac{c}{a}$ vào hai vế: vế trái của $(*)$ $\le2+2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)$

Do đó chỉ cần $2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)\le5$, tức $\left(\dfrac{2a}{c}-1\right)\left(1-\dfrac{2c}{a}\right)\le0$ (vì khai triển tích bằng $2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)-5$).

Từ $2\ge a\ge c\ge1$ có $\dfrac{a}{c}\ge1$ nên $\dfrac{2a}{c}-1>0$, và $\dfrac{c}{a}\ge\dfrac{1}{2}$ nên $1-\dfrac{2c}{a}\le0$. Vậy tích không dương.

Vậy $(*)$ đúng, tức $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\le10$.

=== C4B.23@p132
- bai: 23 · y: - · trang: 132 · tang: nang_cao
- nguon_de: HSG tỉnh Kiên Giang 2016 – 2017
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: 1/u+1/v≥4/(u+v) · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(HSG tỉnh Kiên Giang 2016 – 2017) Cho $a,b,c$ là độ dài $3$ cạnh của một tam giác. Chứng minh rằng: $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$
## SACH
Hướng dẫn giải:

Vì $a,b,c$ là độ dài $3$ cạnh của một tam giác nên

$a+b-c>0$; $b+c-a>0$; $c+a-b>0$, $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y>0$

$\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{2b}=\dfrac{2}{b}$; $\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{2}{c}$; $\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{2}{a}$

Cộng từng vế $3$ bất đẳng thức rồi chia cho $2$ ta được điều phải chứng minh.

Xảy ra dấu đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng hai mẫu bất kì ở vế trái luôn là $2a$, $2b$ hoặc $2c$ (đúng mẫu của vế phải, nhân $2$), và các mẫu đều dương nhờ bất đẳng thức tam giác, nên $\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$ áp dụng được từng cặp.

**Bước 1.** Dùng bất đẳng thức tam giác để khẳng định ba số $a+b-c$, $b+c-a$, $c+a-b$ đều dương, điều kiện cần của bất đẳng thức Cô-si.

**Bước 2.** Tính tổng từng cặp mẫu, chẳng hạn $(a+b-c)+(b+c-a)=2b$, để biết cận dưới của mỗi cặp là $\dfrac{4}{2b}$ và hai cặp còn lại.

**Bước 3.** Cộng ba bất đẳng thức theo vế rồi chia hai vế cho $2$ để nhận được vế phải cần chứng minh.

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh của một tam giác nên $a+b-c>0$, $b+c-a>0$, $c+a-b>0$.

Với $u,v>0$: $(u+v)^2\ge4uv\Rightarrow\dfrac{1}{u}+\dfrac{1}{v}\ge\dfrac{4}{u+v}$. Do đó

$\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{2b}=\dfrac{2}{b}$

$\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{4}{2c}=\dfrac{2}{c}$

$\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{4}{2a}=\dfrac{2}{a}$

Cộng ba bất đẳng thức: $2\left(\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\right)\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$, chia hai vế cho $2$ được điều phải chứng minh.

Dấu "=" xảy ra khi $a+b-c=b+c-a=c+a-b$, tức $a=b=c$.

=== C4B.24@p132
- bai: 24 · y: - · trang: 132 · tang: nang_cao
- nguon_de: HSG tỉnh Bắc Giang 2016 – 2017
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số 1+b^2≥2b · hệ quả a^2+b^2+c^2≥ab+bc+ca (3(ab+bc+ca)≤(a+b+c)^2) · tách phân thức
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(HSG tỉnh Bắc Giang 2016 – 2017) Cho $a,b,c$ là ba số thực dương thỏa mãn: $a+b+c=3$. Chứng minh rằng: $\dfrac{a+1}{1+b^2}+\dfrac{b+1}{1+c^2}+\dfrac{c+1}{1+a^2}\ge3$.
## SACH
Hướng dẫn giải:

Sử dụng BĐT: $1+x^2=1^2+x^2\ge2\cdot x\cdot1=2x$ với $x$ dương nên:

$\dfrac{a+1}{1+b^2}=(a+1)-\dfrac{b^2(a+1)}{b^2+1}\ge(a+1)-\dfrac{b^2(a+1)}{2b}=a+1-\dfrac{ab+b}{2}$

$\Leftrightarrow\dfrac{a+1}{1+b^2}\ge a+1-\dfrac{ab+b}{2}$. $(1)$

Tương tự ta có: $\dfrac{b+1}{1+c^2}\ge b+1-\dfrac{bc+c}{2}$ $(2)$; $\dfrac{c+1}{1+a^2}\ge c+1-\dfrac{ca+a}{2}$ $(3)$

Cộng vế theo vế $(1)$, $(2)$ và $(3)$ ta được:

$\dfrac{a+1}{1+b^2}+\dfrac{b+1}{1+c^2}+\dfrac{c+1}{1+a^2}\ge3+\dfrac{a+b+c-ab-bc-ca}{2}$ $(*)$

Mặt khác: $3(ab+bc+ca)\le(a+b+c)^2=9\Rightarrow\dfrac{a+b+c-ab-bc-ca}{2}\ge0$.

Nên $(*)\Leftrightarrow\dfrac{a+1}{1+b^2}+\dfrac{b+1}{1+c^2}+\dfrac{c+1}{1+a^2}\ge3$ (đpcm).

Dấu "=" xảy ra khi và chỉ khi $a=b=c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $1+b^2$ nằm ở dưới nên Cô-si $1+b^2\ge2b$ chỉ cho cận trên của phân thức; muốn cận dưới phải tách $\dfrac{a+1}{1+b^2}=(a+1)-\dfrac{b^2(a+1)}{1+b^2}$ để phân thức đứng ở phần bị trừ, rồi mới thay mẫu bằng cận dưới $2b$.

**Bước 1.** Tách mỗi phân thức thành $(a+1)$ trừ đi một phân thức có tử $b^2(a+1)$, để mẫu $1+b^2$ nằm ở phần bị trừ.

**Bước 2.** Dùng $1+b^2\ge2b$ cho phần bị trừ nên phần đó không vượt quá $\dfrac{b(a+1)}{2}$, và cả hiệu được chặn dưới bằng một biểu thức đa thức.

**Bước 3.** Cộng ba bất đẳng thức cùng dạng, dùng $a+b+c=3$ để gọn vế phải, rồi chặn $ab+bc+ca$ bằng bất đẳng thức $3(ab+bc+ca)\le(a+b+c)^2$.

**Chú ý:** Dấu "=" của $1+b^2\ge2b$ là $b=1$, trùng với điểm rơi $a=b=c=1$ của bài toán; đó là lí do bước đánh giá này không làm mất dấu "=".

**Phần 2. Trình bày**

Với $b>0$: $1+b^2\ge2b$ nên $\dfrac{b^2(a+1)}{1+b^2}\le\dfrac{b^2(a+1)}{2b}=\dfrac{b(a+1)}{2}$. Do đó

$\dfrac{a+1}{1+b^2}=(a+1)-\dfrac{b^2(a+1)}{1+b^2}\ge a+1-\dfrac{ab+b}{2}$

Tương tự $\dfrac{b+1}{1+c^2}\ge b+1-\dfrac{bc+c}{2}$ và $\dfrac{c+1}{1+a^2}\ge c+1-\dfrac{ca+a}{2}$

Cộng ba bất đẳng thức: vế trái $\ge(a+b+c)+3-\dfrac{(ab+bc+ca)+(a+b+c)}{2}=3+\dfrac{a+b+c-ab-bc-ca}{2}$

Vì $3(ab+bc+ca)\le(a+b+c)^2=9$ (hệ quả của $a^2+b^2+c^2\ge ab+bc+ca$) nên $ab+bc+ca\le3=a+b+c$, tức $\dfrac{a+b+c-ab-bc-ca}{2}\ge0$

Vậy vế trái $\ge3$. Dấu "=" xảy ra khi $a=b=c=1$.

=== C4B.25@p133
- bai: 25 · y: - · trang: 133 · tang: nang_cao
- nguon_de: HSG tỉnh Ninh Thuận 2016 – 2017
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: a^2+b^2≥2ab · b^2+1≥2b · đặt abc=1 (đổi mẫu cyclic)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách không giải thích bước đổi 1/(bc+c+1) và 1/(ca+a+1) sang mẫu ab+b+1 bằng abc=1 (GIAI viết rõ); không nêu dấu bằng (GIAI: a=b=c=1)
## DE
(HSG tỉnh Ninh Thuận 2016 – 2017) Cho ba số dương $a,b$ và $c$ thoả mãn $abc=1$. Chứng minh rằng: $\dfrac{1}{a^2+2b^2+3}+\dfrac{1}{b^2+2c^2+3}+\dfrac{1}{c^2+2a^2+3}\le\dfrac{1}{2}$.
## SACH
Hướng dẫn giải:

Ta có: $a^2+2b^2+3=(a^2+b^2)+(b^2+1)+2\ge2ab+2b+2$

Tương tự: $b^2+2c^2+3\ge2bc+2c+2$, $c^2+2a^2+3\ge2ac+2a+2$

Suy ra:

$\dfrac{1}{a^2+2b^2+3}+\dfrac{1}{b^2+2c^2+3}+\dfrac{1}{c^2+2a^2+3}\le\dfrac{1}{2}\left(\dfrac{1}{ab+b+1}+\dfrac{1}{bc+c+1}+\dfrac{1}{ac+a+1}\right)$

$=\dfrac{1}{2}\left(\dfrac{1}{ab+b+1}+\dfrac{1}{\frac{1}{a}+\frac{1}{ab}+1}+\dfrac{1}{\frac{1}{b}+a+1}\right)=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $a^2+2b^2+3$ chỉ gồm bình phương và hằng số nên tách được thành $(a^2+b^2)+(b^2+1)+2$ để dùng hai bất đẳng thức Cô-si ra mẫu $2(ab+b+1)$; với $abc=1$ ba mẫu dạng $ab+b+1$, $bc+c+1$, $ca+a+1$ có tổng các nghịch đảo bằng đúng một hằng số.

**Bước 1.** Tách $a^2+2b^2+3=(a^2+b^2)+(b^2+1)+2$ rồi dùng $a^2+b^2\ge2ab$ và $b^2+1\ge2b$ để chặn mẫu từ dưới, làm tương tự cho hai mẫu còn lại.

**Bước 2.** Vì các mẫu dương nên đảo ngược chiều bất đẳng thức, suy ra tổng cần chứng minh không vượt quá một nửa tổng ba phân thức dạng $\dfrac{1}{ab+b+1}$.

**Bước 3.** Dùng $abc=1$ nhân tử và mẫu của hai phân thức còn lại với biểu thức thích hợp để chúng có cùng mẫu $ab+b+1$ rồi cộng lại.

**Chú ý:** Đẳng thức $\dfrac{1}{ab+b+1}+\dfrac{1}{bc+c+1}+\dfrac{1}{ca+a+1}=1$ với $abc=1$ là bổ đề rất hay gặp, nên nhớ.

**Phần 2. Trình bày**

$a^2+2b^2+3=(a^2+b^2)+(b^2+1)+2\ge2ab+2b+2$, tương tự $b^2+2c^2+3\ge2bc+2c+2$ và $c^2+2a^2+3\ge2ca+2a+2$

Các mẫu đều dương nên vế trái $\le\dfrac{1}{2}\left(\dfrac{1}{ab+b+1}+\dfrac{1}{bc+c+1}+\dfrac{1}{ca+a+1}\right)$

Vì $abc=1$, nhân tử và mẫu của $\dfrac{1}{bc+c+1}$ với $ab$: $\dfrac{ab}{ab\cdot bc+abc+ab}=\dfrac{ab}{b+1+ab}$

Nhân tử và mẫu của $\dfrac{1}{ca+a+1}$ với $b$: $\dfrac{b}{abc+ab+b}=\dfrac{b}{1+ab+b}$

Do đó $\dfrac{1}{ab+b+1}+\dfrac{1}{bc+c+1}+\dfrac{1}{ca+a+1}=\dfrac{1+ab+b}{ab+b+1}=1$

Vậy vế trái $\le\dfrac{1}{2}$. Dấu "=" xảy ra khi $a=b=c=1$.

=== C4B.26@p133
- bai: 26 · y: - · trang: 133 · tang: nang_cao
- nguon_de: HSG Hải Dương 2015 – 2016
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ nghịch đảo x=1/a · Cô-si hai số t+k/t≥2√k · thêm bớt hạng tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(HSG Hải Dương 2015 – 2016) Cho $a,b,c$ là các số thực dương thỏa mãn $2ab+6bc+2ac=7abc$. Chứng minh rằng: $C=\dfrac{4ab}{a+2b}+\dfrac{9ac}{a+4c}+\dfrac{4bc}{b+c}\ge7$.
## SACH
Hướng dẫn giải:

Từ giả thiết: $2ab+6bc+2ac=7abc$ và $a,b,c>0$

Chia cả hai vế cho $abc>0\Rightarrow\dfrac{2}{c}+\dfrac{6}{a}+\dfrac{2}{b}=7$

Đặt $x=\dfrac{1}{a},y=\dfrac{1}{b},z=\dfrac{1}{c}\Rightarrow\begin{cases}x,y,z>0\\2z+6x+2y=7\end{cases}$

Khi đó $C=\dfrac{4ab}{a+2b}+\dfrac{9ac}{a+4c}+\dfrac{4bc}{b+c}=\left(\dfrac{4}{2x+y}+\dfrac{9}{4x+z}+\dfrac{4}{y+z}\right)$

$\Rightarrow C=\dfrac{4}{2x+y}+2x+y+\dfrac{9}{4x+z}+4x+z+\dfrac{4}{y+z}+y+z-(2x+y+4x+z+y+z)$.

Ta có: $\dfrac{4}{2x+y}+2x+y\ge4$; $\dfrac{9}{4x+z}+4x+z\ge6$; $\dfrac{4}{y+z}+y+z\ge4$.

Nên: $C=\dfrac{4ab}{a+2b}+\dfrac{9ac}{a+4c}+\dfrac{4bc}{b+c}\ge7$ khi $x=\dfrac{1}{2},y=z=1$ thì $C=7$.

Vậy $C=\dfrac{4ab}{a+2b}+\dfrac{9ac}{a+4c}+\dfrac{4bc}{b+c}\ge7$. Dấu "=" xảy ra khi $a=2;b=1;c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết chia cho $abc$ thành tổng các nghịch đảo, còn $C$ viết theo $x=\dfrac{1}{a}$, $y=\dfrac{1}{b}$, $z=\dfrac{1}{c}$ thành ba phân thức có tử hằng số, và ba mẫu cộng lại đúng bằng $6x+2y+2z$, tức bằng hằng số của giả thiết; vì vậy cộng và trừ chính các mẫu để ghép dạng $\dfrac{k}{t}+t\ge2\sqrt{k}$.

**Bước 1.** Chia hai vế giả thiết cho $abc>0$ rồi đặt $x=\dfrac{1}{a}$, $y=\dfrac{1}{b}$, $z=\dfrac{1}{c}$ để giả thiết thành một đẳng thức tuyến tính theo $x,y,z$.

**Bước 2.** Chia tử và mẫu của từng phân thức trong $C$ cho tích hai biến thích hợp để $C$ trở thành tổng ba phân thức có tử là hằng số và mẫu là biểu thức bậc nhất theo $x,y,z$.

**Bước 3.** Nhận ra tổng ba mẫu bằng vế trái của giả thiết, nên cộng thêm các mẫu vào từng phân thức rồi trừ đi đúng tổng đó, mỗi cặp $\dfrac{k}{t}+t$ dùng Cô-si cho hai số dương.

**Bước 4.** Giải hệ điều kiện dấu "=" của ba cặp, kiểm tra nghiệm thoả giả thiết rồi quay về $a,b,c$.

**Chú ý:** Các mẫu $2x+y$, $4x+z$, $y+z$ phải được chọn thành "$t$" của từng cặp Cô-si; nếu chỉ dùng Cô-si trực tiếp cho $C$ thì không còn biến nào bị triệt tiêu.

**Phần 2. Trình bày**

Chia hai vế giả thiết cho $abc>0$: $\dfrac{2}{c}+\dfrac{6}{a}+\dfrac{2}{b}=7$. Đặt $x=\dfrac{1}{a}$, $y=\dfrac{1}{b}$, $z=\dfrac{1}{c}$ ($x,y,z>0$) thì $6x+2y+2z=7$.

Chia tử và mẫu cho tích hai biến: $\dfrac{4ab}{a+2b}=\dfrac{4}{\frac{1}{b}+\frac{2}{a}}=\dfrac{4}{2x+y}$, $\ \dfrac{9ac}{a+4c}=\dfrac{9}{4x+z}$, $\ \dfrac{4bc}{b+c}=\dfrac{4}{y+z}$

Vì $(2x+y)+(4x+z)+(y+z)=6x+2y+2z=7$ nên

$C=\left[\dfrac{4}{2x+y}+(2x+y)\right]+\left[\dfrac{9}{4x+z}+(4x+z)\right]+\left[\dfrac{4}{y+z}+(y+z)\right]-7$

Theo Cô-si cho hai số dương: $\dfrac{4}{t}+t\ge4$, $\dfrac{9}{t}+t\ge6$, nên $C\ge4+6+4-7=7$.

Dấu "=" xảy ra khi $2x+y=2$, $4x+z=3$, $y+z=2$, suy ra $x=\dfrac{1}{2}$, $y=z=1$ (thoả $6x+2y+2z=7$), tức $a=2$, $b=1$, $c=1$. Khi đó $C=2+3+2=7$.

