# ĐỀ | Đề cương ôn tập giữa học kì I Toán 9 — THCS Thành Công (Hà Nội)
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 3 | C. Một số bài tập nâng cao (Bài 1–4) | tu_luan

### Bài 1 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm các số nguyên $x$ và $y$ thỏa mãn phương trình $x^2+xy-2y-x-5=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa vế trái về dạng tích của hai nhân tử nguyên bằng một số nguyên cho trước, rồi xét các ước của số đó.

**Bước 1.** Nhóm các hạng tử có chung nhân tử (ở đây là các hạng tử cho nhóm chứa $x-2$) để phân tích vế trái thành tích, phần hằng số dư chuyển sang vế phải.

**Bước 2.** Vì $x$ và $y$ nguyên nên mỗi nhân tử của tích là một số nguyên, suy ra mỗi nhân tử là ước của số ở vế phải.

**Bước 3.** Liệt kê mọi cách phân tích số ở vế phải thành tích hai số nguyên, mỗi cách cho một hệ hai phương trình bậc nhất để tìm $x$ và $y$.

**Bước 4.** Thử lại từng cặp vào phương trình ban đầu rồi kết luận đủ các cặp số nguyên.

**Phần 2. Trình bày**

Ta có $x^2+xy-2y-x-5=0$.

Suy ra $x^2+xy-x-2y-2=3$.

Ta có $x^2+xy-x-2y-2=(x^2-2x)+(x-2)+(xy-2y)$

$=x(x-2)+(x-2)+y(x-2)$

$=(x-2)(x+y+1)$.

Do đó $(x-2)(x+y+1)=3$.

Vì $x$, $y$ là các số nguyên nên $x-2$ và $x+y+1$ là các số nguyên có tích bằng $3$.

Suy ra $x-2$ là ước của $3$, tức là $x-2$ bằng $1$, $-1$, $3$ hoặc $-3$.

Trường hợp 1: $x-2=1$ và $x+y+1=3$. Suy ra $x=3$; thay vào $3+y+1=3$ ta được $y=-1$.

Trường hợp 2: $x-2=-1$ và $x+y+1=-3$. Suy ra $x=1$; thay vào $1+y+1=-3$ ta được $y=-5$.

Trường hợp 3: $x-2=3$ và $x+y+1=1$. Suy ra $x=5$; thay vào $5+y+1=1$ ta được $y=-5$.

Trường hợp 4: $x-2=-3$ và $x+y+1=-1$. Suy ra $x=-1$; thay vào $-1+y+1=-1$ ta được $y=-1$.

Thử lại: với $(x;y)=(3;-1)$ ta có $(3-2)(3-1+1)=1\cdot3=3$; với $(1;-5)$ ta có $(1-2)(1-5+1)=(-1)\cdot(-3)=3$; với $(5;-5)$ ta có $(5-2)(5-5+1)=3\cdot1=3$; với $(-1;-1)$ ta có $(-1-2)(-1-1+1)=(-3)\cdot(-1)=3$. Cả bốn cặp đều thỏa mãn.

Vậy các cặp số nguyên $(x;y)$ thỏa mãn phương trình là $(3;-1)$, $(1;-5)$, $(5;-5)$ và $(-1;-1)$.

### Bài 2 | kho=dai | loai=tra_loi_ngan | dap_an=-3,5
**Đề:** Giải phương trình $\dfrac{x+1}{x(x+2)}+\dfrac{x+6}{x^2+12x+35}=\dfrac{x+2}{x^2+4x+3}+\dfrac{x+5}{x^2+10x+24}$.
**Ghi chú:** phương trình có nghiệm duy nhất $x=-\dfrac{7}{2}=-3{,}5$ nên đặt trả lời ngắn (đã thử bằng máy: quét $x\in[-30;30]$ chỉ có đúng một nghiệm).

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi phân thức có tử bằng nửa tổng hai nhân tử của mẫu nên tách được thành nửa tổng hai phân thức tử $1$; sau đó ghép cặp để xuất hiện nhân tử chung.

**Bước 1.** Phân tích các mẫu bậc hai thành tích hai nhân tử bậc nhất rồi nêu điều kiện xác định: mọi nhân tử ở mẫu đều khác $0$.

**Bước 2.** Với từng phân thức, kiểm tra tử bằng một nửa tổng hai nhân tử ở mẫu, từ đó viết nó thành một nửa tổng hai phân thức đơn giản.

**Bước 3.** Ghép các phân thức theo cặp sao cho tổng hai nhân tử của mọi cặp bằng nhau; mỗi cặp quy đồng lên đều cho cùng một tử, nên đặt được nhân tử chung ra ngoài.

**Bước 4.** Đặt ẩn phụ cho biểu thức lặp lại ở mẫu của các cặp rồi quy đồng phần còn lại; dùng hoàn thành bình phương để chứng minh phần này không thể bằng $0$.

**Bước 5.** Giải nhân tử còn lại rồi đối chiếu nghiệm với điều kiện xác định.

**Phần 2. Trình bày**

Ta có $x^2+12x+35=(x+5)(x+7)$, $x^2+4x+3=(x+1)(x+3)$, $x^2+10x+24=(x+4)(x+6)$.

Điều kiện xác định: $x$ khác $0$, $-1$, $-2$, $-3$, $-4$, $-5$, $-6$, $-7$.

Khi đó phương trình trở thành $\dfrac{x+1}{x(x+2)}+\dfrac{x+6}{(x+5)(x+7)}=\dfrac{x+2}{(x+1)(x+3)}+\dfrac{x+5}{(x+4)(x+6)}$.

Ta có $\dfrac{1}{x}+\dfrac{1}{x+2}=\dfrac{2(x+1)}{x(x+2)}$ nên $\dfrac{x+1}{x(x+2)}=\dfrac{1}{2}\left(\dfrac{1}{x}+\dfrac{1}{x+2}\right)$.

Tương tự, vì $(x+5)+(x+7)=2(x+6)$ nên $\dfrac{x+6}{(x+5)(x+7)}=\dfrac{1}{2}\left(\dfrac{1}{x+5}+\dfrac{1}{x+7}\right)$.

Vì $(x+1)+(x+3)=2(x+2)$ nên $\dfrac{x+2}{(x+1)(x+3)}=\dfrac{1}{2}\left(\dfrac{1}{x+1}+\dfrac{1}{x+3}\right)$.

Vì $(x+4)+(x+6)=2(x+5)$ nên $\dfrac{x+5}{(x+4)(x+6)}=\dfrac{1}{2}\left(\dfrac{1}{x+4}+\dfrac{1}{x+6}\right)$.

Nhân hai vế của phương trình với $2$, ta được $\dfrac{1}{x}+\dfrac{1}{x+2}+\dfrac{1}{x+5}+\dfrac{1}{x+7}=\dfrac{1}{x+1}+\dfrac{1}{x+3}+\dfrac{1}{x+4}+\dfrac{1}{x+6}$.

Ghép cặp: $\left(\dfrac{1}{x}+\dfrac{1}{x+7}\right)+\left(\dfrac{1}{x+2}+\dfrac{1}{x+5}\right)=\left(\dfrac{1}{x+1}+\dfrac{1}{x+6}\right)+\left(\dfrac{1}{x+3}+\dfrac{1}{x+4}\right)$.

Suy ra $\dfrac{2x+7}{x(x+7)}+\dfrac{2x+7}{(x+2)(x+5)}=\dfrac{2x+7}{(x+1)(x+6)}+\dfrac{2x+7}{(x+3)(x+4)}$.

Chuyển vế và đặt nhân tử chung: $(2x+7)\left[\dfrac{1}{x(x+7)}+\dfrac{1}{(x+2)(x+5)}-\dfrac{1}{(x+1)(x+6)}-\dfrac{1}{(x+3)(x+4)}\right]=0$.

Đặt $t=x^2+7x$. Khi đó $x(x+7)=t$; $(x+2)(x+5)=t+10$; $(x+1)(x+6)=t+6$; $(x+3)(x+4)=t+12$.

Biểu thức trong ngoặc vuông là $\dfrac{1}{t}+\dfrac{1}{t+10}-\dfrac{1}{t+6}-\dfrac{1}{t+12}$

$=\left(\dfrac{1}{t}-\dfrac{1}{t+6}\right)+\left(\dfrac{1}{t+10}-\dfrac{1}{t+12}\right)$

$=\dfrac{6}{t(t+6)}+\dfrac{2}{(t+10)(t+12)}$

$=\dfrac{6(t+10)(t+12)+2t(t+6)}{t(t+6)(t+10)(t+12)}$

$=\dfrac{6t^2+132t+720+2t^2+12t}{t(t+6)(t+10)(t+12)}$

$=\dfrac{8t^2+144t+720}{t(t+6)(t+10)(t+12)}$

$=\dfrac{8(t^2+18t+90)}{t(t+6)(t+10)(t+12)}$.

Ta có $t^2+18t+90=(t+9)^2+9\ge9>0$ với mọi $t$.

Do đó tử của phân thức trên luôn khác $0$, nên biểu thức trong ngoặc vuông khác $0$ với mọi $x$ thỏa mãn điều kiện xác định.

Suy ra $2x+7=0$, nên $x=-\dfrac{7}{2}$.

Giá trị $x=-\dfrac{7}{2}$ khác $0$, $-1$, $-2$, $-3$, $-4$, $-5$, $-6$, $-7$ nên thỏa mãn điều kiện xác định.

Vậy phương trình đã cho có nghiệm duy nhất $x=-\dfrac{7}{2}$ (tức $-3{,}5$).

### Bài 3 | kho=dai | loai=tra_loi_ngan | dap_an=15
**Đề:** Một người nông dân muốn rào một khu đất hình chữ nhật có chu vi $60\ \text{m}$ để xây dựng một vườn hoa. Với chiều rộng của khu đất là $x$ ($\text{m}$), tìm $x$ để diện tích vườn hoa xây được lớn nhất.
**Hình giải:** giai_P3B3.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn diện tích theo $x$ rồi viết thành một số trừ đi một bình phương để thấy giá trị lớn nhất.

**Bước 1.** Dùng chu vi để tính nửa chu vi, từ đó biểu diễn chiều dài theo $x$ và nêu điều kiện để cả hai kích thước đều dương.

**Bước 2.** Lập biểu thức diện tích bằng chiều rộng nhân chiều dài và khai triển thành đa thức theo $x$.

**Bước 3.** Hoàn thành bình phương để đưa diện tích về dạng một hằng số trừ đi bình phương của một biểu thức chứa $x$.

**Bước 4.** Vì bình phương không âm, đánh giá diện tích không vượt quá hằng số đó, tìm $x$ làm dấu bằng xảy ra và đối chiếu điều kiện.

**Phần 2. Trình bày**

Nửa chu vi khu đất là $60:2=30\ \text{m}$.

Chiều dài khu đất là $30-x$ (m).

Điều kiện: $0<x<30$.

Diện tích vườn hoa là $S=x(30-x)=30x-x^2$.

Ta có $S=-(x^2-30x)$

$=-(x^2-2\cdot15\cdot x+15^2)+15^2$

$=225-(x-15)^2$.

Vì $(x-15)^2\ge0$ với mọi $x$ nên $S\le225$.

Dấu "$=$" xảy ra khi $x-15=0$, tức là $x=15$ (thỏa mãn điều kiện $0<x<30$). Khi đó chiều dài cũng bằng $15\ \text{m}$ nên khu đất là hình vuông, vẫn là một hình chữ nhật.

Vậy diện tích vườn hoa lớn nhất là $225\ \text{m}^2$, đạt được khi $x=15$.

### Bài 4 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Mảnh đất của nhà bác An có dạng hình tam giác vuông với hai cạnh góc vuông dài $60\ \text{m}$ và $40\ \text{m}$ (như hình vẽ bên). Bác An muốn làm một khu vườn có dạng hình chữ nhật để trồng hoa, sao cho một đỉnh của hình chữ nhật trùng với đỉnh góc vuông, hai cạnh nằm trên hai cạnh góc vuông của tam giác và đỉnh đối diện với đỉnh đó nằm trên cạnh huyền. Tìm kích thước của khu vườn hình chữ nhật để diện tích của nó đạt giá trị lớn nhất.
**Hình:** de_PCB4.png
**Hình giải:** giai_P3B4.png
**Ghi chú:** hình đề vẽ không đúng tỉ lệ (cạnh $60\ \text{m}$ và cạnh $40\ \text{m}$ dài gần bằng nhau) — trạm soát vẽ thêm hình giải đúng tỉ lệ, $AB$ đứng, $AC$ ngang; đáp số không đổi.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dùng tam giác đồng dạng để tìm mối quan hệ giữa hai cạnh của hình chữ nhật, đưa diện tích về một ẩn rồi hoàn thành bình phương.

**Bước 1.** Gọi hai cạnh của hình chữ nhật nằm trên hai cạnh góc vuông là $x$ và $y$, nêu điều kiện của chúng theo kích thước mảnh đất.

**Bước 2.** Nhận ra cạnh đối diện của hình chữ nhật song song với một cạnh góc vuông, nên có một tam giác vuông nhỏ đồng dạng với tam giác vuông ban đầu.

**Bước 3.** Viết tỉ số cạnh tương ứng của hai tam giác đồng dạng để rút $y$ theo $x$, rồi thay vào công thức diện tích $S=xy$.

**Bước 4.** Hoàn thành bình phương để đưa $S$ về dạng một hằng số trừ đi một bình phương, từ đó tìm $x$ làm $S$ lớn nhất.

**Bước 5.** Tính cạnh còn lại ứng với $x$ vừa tìm, đối chiếu điều kiện và trả lời đủ hai kích thước.

**Phần 2. Trình bày**

Gọi khu vườn hình chữ nhật là $AEHF$ với $E$ thuộc $AB$, $F$ thuộc $AC$, $H$ thuộc $BC$.

Tam giác $ABC$ vuông tại $A$ có $AB=60\ \text{m}$, $AC=40\ \text{m}$.

Đặt $AE=x$ (m) và $AF=y$ (m). Điều kiện: $0<x<60$, $0<y<40$.

Diện tích khu vườn là $S=xy$.

Vì $AEHF$ là hình chữ nhật nên $EH\parallel AF$ và $EH=AF=y$, đồng thời $\widehat{AEH}=90^\circ$.

Vì $E$ nằm giữa $A$ và $B$ nên $BE=AB-AE=60-x$ và $\widehat{BEH}=90^\circ$ (kề bù với $\widehat{AEH}$).

Xét $\triangle BEH$ và $\triangle BAC$ có:

$\widehat{B}$ chung;

$\widehat{BEH}=\widehat{BAC}=90^\circ$.

Do đó $\triangle BEH\backsim\triangle BAC$ (g.g).

Suy ra $\dfrac{EH}{AC}=\dfrac{BE}{BA}$, hay $\dfrac{y}{40}=\dfrac{60-x}{60}$.

Suy ra $y=\dfrac{40(60-x)}{60}$

$=\dfrac{2(60-x)}{3}$

$=40-\dfrac{2}{3}x$.

Do đó $S=xy=x\left(40-\dfrac{2}{3}x\right)=40x-\dfrac{2}{3}x^2$.

Ta có $S=-\dfrac{2}{3}(x^2-60x)$

$=-\dfrac{2}{3}\left[(x^2-2\cdot30\cdot x+30^2)-30^2\right]$

$=-\dfrac{2}{3}\left[(x-30)^2-900\right]$

$=600-\dfrac{2}{3}(x-30)^2$.

Vì $(x-30)^2\ge0$ với mọi $x$ nên $S\le600$.

Dấu "$=$" xảy ra khi $x-30=0$, tức là $x=30$ (thỏa mãn điều kiện $0<x<60$).

Khi đó $y=40-\dfrac{2}{3}\cdot30=20$ (thỏa mãn điều kiện $0<y<40$).

Vậy khu vườn hình chữ nhật có hai cạnh dài $30\ \text{m}$ (nằm trên cạnh $AB$) và $20\ \text{m}$ (nằm trên cạnh $AC$) thì diện tích lớn nhất, bằng $600\ \text{m}^2$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 1: $(x-2)(x+y+1)=3$, bốn cặp nguyên $(3;-1)$, $(1;-5)$, $(5;-5)$, $(-1;-1)$ (máy quét $|x|\le400$, $|y|\le4000$ chỉ ra đúng bốn cặp này).
- Bài 2: đáp số một nghiệm $x=-\dfrac72$ nên đặt `tra_loi_ngan` với `dap_an=-3,5` (4 kí tự); đã thử bằng máy (thay nghiệm, quét lưới tìm đổi dấu, kiểm đồng nhất thức tách phân thức bằng 2000 điểm ngẫu nhiên). Không dùng $\Delta$: nhân tử còn lại chứng minh khác $0$ bằng $(t+9)^2+9>0$.
- Bài 3: đề hỏi đúng $x$ nên `tra_loi_ngan` `15`; dùng hoàn thành bình phương. Hình giải `giai_P3B3.png` (hình chữ nhật cạnh $x$ và $30-x$). Khi $x=15$ khu đất là hình vuông, ghi rõ trong lời giải; không xét ràng buộc "rộng không lớn hơn dài" để kết quả không bị đổi.
- Bài 4: hình đề (`de_PCB4.png`) có đủ điểm $A,B,C,E,F,H$ nhưng vẽ sai tỉ lệ ⇒ trạm soát vẽ thêm hình giải `giai_P3B4.png` đúng tỉ lệ (brief: C Bài 4 cần hình giải tam giác vuông đủ điểm); $AE=x$ (trên $AB=60$), $AF=y$ (trên $AC=40$) đúng theo hình. Đáp số $30\ \text{m}\times20\ \text{m}$, $S_{\max}=600\ \text{m}^2$ đã thử bằng máy. Dùng tam giác đồng dạng $BEH\backsim BAC$, không dùng đường trung bình.
- Không có câu `Chưa chắc`.
