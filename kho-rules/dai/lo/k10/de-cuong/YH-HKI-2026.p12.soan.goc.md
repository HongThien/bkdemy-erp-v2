# ĐỀ | Đề cương ôn tập học kì I Toán 10 năm 2026–2027 — THPT Yên Hòa (Hà Nội)
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 12 | Chương IV Vectơ — Tự luận | tu_luan

### Câu 61 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Nếu $G$ và $G'$ lần lượt là trọng tâm tam giác $ABC$ và $A'B'C'$ thì $k\overrightarrow{GG'}=\overrightarrow{AA'}+\overrightarrow{BB'}+\overrightarrow{CC'}$, khi đó $k=\,?$

**Phần 1. Hướng dẫn**

**Mấu chốt:** chèn hai trọng tâm $G$, $G'$ vào từng vectơ $\overrightarrow{AA'}$, $\overrightarrow{BB'}$, $\overrightarrow{CC'}$ bằng quy tắc ba điểm rồi dùng tính chất tổng ba vectơ từ trọng tâm tới ba đỉnh bằng vectơ không.

**Bước 1.** Tách mỗi vectơ như $\overrightarrow{AA'}$ thành ba đoạn đi qua $G$ rồi qua $G'$ bằng quy tắc ba điểm, làm tương tự cho hai vectơ còn lại.

**Bước 2.** Cộng ba đẳng thức theo vế rồi nhóm các số hạng cùng loại: nhóm các vectơ có đầu mút là đỉnh tam giác $ABC$, nhóm các vectơ có đầu mút là đỉnh tam giác $A'B'C'$ và nhóm các vectơ $\overrightarrow{GG'}$.

**Bước 3.** Dùng tính chất của trọng tâm cho từng tam giác để thu gọn hai nhóm đầu về vectơ không.

**Bước 4.** So sánh kết quả thu được với đẳng thức đề cho để suy ra hệ số $k$.

**Phần 2. Trình bày**

Theo quy tắc ba điểm:

$\overrightarrow{AA'}=\overrightarrow{AG}+\overrightarrow{GG'}+\overrightarrow{G'A'}$

$\overrightarrow{BB'}=\overrightarrow{BG}+\overrightarrow{GG'}+\overrightarrow{G'B'}$

$\overrightarrow{CC'}=\overrightarrow{CG}+\overrightarrow{GG'}+\overrightarrow{G'C'}$

Cộng ba đẳng thức theo vế:

$\overrightarrow{AA'}+\overrightarrow{BB'}+\overrightarrow{CC'}=\left(\overrightarrow{AG}+\overrightarrow{BG}+\overrightarrow{CG}\right)+3\overrightarrow{GG'}+\left(\overrightarrow{G'A'}+\overrightarrow{G'B'}+\overrightarrow{G'C'}\right)$

Vì $G$ là trọng tâm tam giác $ABC$ nên $\overrightarrow{GA}+\overrightarrow{GB}+\overrightarrow{GC}=\vec{0}$, suy ra $\overrightarrow{AG}+\overrightarrow{BG}+\overrightarrow{CG}=\vec{0}$.

Vì $G'$ là trọng tâm tam giác $A'B'C'$ nên $\overrightarrow{G'A'}+\overrightarrow{G'B'}+\overrightarrow{G'C'}=\vec{0}$.

Do đó $\overrightarrow{AA'}+\overrightarrow{BB'}+\overrightarrow{CC'}=3\overrightarrow{GG'}$.

Đối chiếu với $k\overrightarrow{GG'}=\overrightarrow{AA'}+\overrightarrow{BB'}+\overrightarrow{CC'}$ ta được $k=3$.

Vậy $k=3$.

### Câu 62 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho $\triangle ABC$ vuông tại $B$ có $\widehat{A}=30^\circ$, $AB=1$. Gọi $I$ là trung điểm của $AC$. Tính $\left|\overrightarrow{AB}+\overrightarrow{AC}\right|$, (kết quả làm tròn đến hàng phần mười).
**Hình giải:** giai_P12C62.png
**Ghi chú:** điểm $I$ trong đề không được dùng đến; hình giải có thêm trung điểm $M$ của $BC$ và điểm $D$ sao cho $\overrightarrow{AD}=\overrightarrow{AB}+\overrightarrow{AC}$ để minh hoạ lời giải.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tổng hai vectơ chung gốc $A$ có đầu mút $B$, $C$ bằng hai lần vectơ nối $A$ với trung điểm của $BC$, nên bài toán đưa về tính độ dài trung tuyến trong tam giác vuông.

**Bước 1.** Tính cạnh $BC$ từ góc $A$ và cạnh $AB$ bằng tỉ số lượng giác của góc nhọn trong tam giác vuông $ABC$.

**Bước 2.** Gọi $M$ là trung điểm của $BC$ rồi dùng tính chất trung điểm để viết tổng hai vectơ đề cho thành một vectơ có gốc $A$, đầu $M$.

**Bước 3.** Tính độ dài $AM$ bằng định lí Pythagore trong tam giác vuông $ABM$ với hai cạnh góc vuông đã biết.

**Bước 4.** Suy ra độ dài của tổng hai vectơ rồi làm tròn theo yêu cầu của đề.

**Phần 2. Trình bày**

Trong tam giác $ABC$ vuông tại $B$: $BC=AB\cdot\tan A=1\cdot\tan30^\circ=\dfrac{1}{\sqrt{3}}$.

Gọi $M$ là trung điểm của $BC$. Khi đó $\overrightarrow{AB}+\overrightarrow{AC}=2\overrightarrow{AM}$.

Ta có $BM=\dfrac{BC}{2}=\dfrac{1}{2\sqrt{3}}$.

Tam giác $ABM$ vuông tại $B$ nên $AM^2=AB^2+BM^2=1+\dfrac{1}{12}=\dfrac{13}{12}$.

Suy ra $\left|\overrightarrow{AB}+\overrightarrow{AC}\right|=2AM=2\sqrt{\dfrac{13}{12}}=\sqrt{\dfrac{13}{3}}\approx2{,}1$.

Vậy $\left|\overrightarrow{AB}+\overrightarrow{AC}\right|\approx2{,}1$.

### Câu 63 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho hình bình hành $ABCD$. Gọi $E$ và $F$ là $2$ điểm thỏa $\overrightarrow{BE}=\dfrac{1}{3}\overrightarrow{BC}$, $\overrightarrow{BF}=\dfrac{1}{4}\overrightarrow{BD}$. Khi đó $\overrightarrow{AE}=k\overrightarrow{AF}$. Vậy $k=\,?$ (Kết quả làm tròn đến hàng phần chục)
**Hình giải:** giai_P12C63.png
**Ghi chú:** đề in thừa dấu ngoặc "(" ở cuối câu, bỏ qua.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn cả $\overrightarrow{AE}$ và $\overrightarrow{AF}$ qua hai vectơ không cùng phương $\overrightarrow{AB}$, $\overrightarrow{BC}$ rồi đồng nhất hệ số của hai vế.

**Bước 1.** Chọn hai vectơ không cùng phương $\overrightarrow{AB}$ và $\overrightarrow{BC}$ làm cơ sở, viết $\overrightarrow{AE}$ bằng quy tắc ba điểm qua $B$.

**Bước 2.** Viết $\overrightarrow{AF}$ cũng qua $B$, rồi dùng quy tắc hình bình hành để thay $\overrightarrow{BD}$ bằng tổng hai vectơ cơ sở.

**Bước 3.** Thay hai biểu diễn vào đẳng thức $\overrightarrow{AE}=k\overrightarrow{AF}$ và đồng nhất hệ số của từng vectơ cơ sở ở hai vế.

**Bước 4.** Giải hệ hai phương trình ẩn $k$, kiểm tra hai giá trị trùng nhau rồi làm tròn theo đề.

**Phần 2. Trình bày**

Vì $ABCD$ là hình bình hành nên $\overrightarrow{BD}=\overrightarrow{BA}+\overrightarrow{BC}=-\overrightarrow{AB}+\overrightarrow{BC}$.

$\overrightarrow{AE}=\overrightarrow{AB}+\overrightarrow{BE}=\overrightarrow{AB}+\dfrac{1}{3}\overrightarrow{BC}$.

$\overrightarrow{AF}=\overrightarrow{AB}+\overrightarrow{BF}=\overrightarrow{AB}+\dfrac{1}{4}\left(-\overrightarrow{AB}+\overrightarrow{BC}\right)=\dfrac{3}{4}\overrightarrow{AB}+\dfrac{1}{4}\overrightarrow{BC}$.

Từ $\overrightarrow{AE}=k\overrightarrow{AF}$ ta có $\overrightarrow{AB}+\dfrac{1}{3}\overrightarrow{BC}=\dfrac{3k}{4}\overrightarrow{AB}+\dfrac{k}{4}\overrightarrow{BC}$.

Vì $\overrightarrow{AB}$ và $\overrightarrow{BC}$ không cùng phương nên $\begin{cases} 1=\dfrac{3k}{4} \\ \dfrac{1}{3}=\dfrac{k}{4} \end{cases}$.

Cả hai phương trình cùng cho $k=\dfrac{4}{3}\approx1{,}3$.

Vậy $k\approx1{,}3$.

### Câu 64 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Một vật đang ở vị trí $O$ chịu hai lực tác dụng ngược chiều nhau là $\overrightarrow{F_1}$ và $\overrightarrow{F_2}$, trong đó độ lớn lực $\overrightarrow{F_2}$ lớn gấp đôi độ lớn lực $\overrightarrow{F_1}$. Người ta muốn vật dừng lại nên cần tác dụng vào vật hai lực $\overrightarrow{F_3}$, $\overrightarrow{F_4}$ có phương hợp với lực $\overrightarrow{F_1}$ các góc $45^\circ$ như hình vẽ, chúng có độ lớn bằng nhau và bằng $20\,N$. Tính tổng độ lớn của các lực $\overrightarrow{F_1}$, $\overrightarrow{F_2}$. (Kết quả làm tròn đến hàng đơn vị)
**Hình:** de_P12C64.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** vật đứng yên nên tổng bốn lực bằng vectơ không, do đó hợp của $\overrightarrow{F_3}$, $\overrightarrow{F_4}$ phải triệt tiêu hợp của $\overrightarrow{F_1}$, $\overrightarrow{F_2}$.

**Bước 1.** Đặt ẩn là độ lớn của $\overrightarrow{F_1}$, từ quan hệ gấp đôi và ngược chiều viết được $\overrightarrow{F_2}$ theo $\overrightarrow{F_1}$, từ đó tìm hợp của $\overrightarrow{F_1}$ và $\overrightarrow{F_2}$.

**Bước 2.** Tính hợp của $\overrightarrow{F_3}$ và $\overrightarrow{F_4}$: hai lực bằng nhau, đối xứng qua đường thẳng chứa $\overrightarrow{F_1}$ nên hợp lực nằm trên đường thẳng đó, độ lớn tính bằng tổng hình chiếu lên đường thẳng ấy.

**Bước 3.** Viết điều kiện cân bằng bằng cách cho hợp của $\overrightarrow{F_1}$, $\overrightarrow{F_2}$ và hợp của $\overrightarrow{F_3}$, $\overrightarrow{F_4}$ có độ lớn bằng nhau, hướng ngược nhau.

**Bước 4.** Giải phương trình tìm độ lớn $\overrightarrow{F_1}$, suy ra độ lớn $\overrightarrow{F_2}$ rồi cộng lại và làm tròn.

**Phần 2. Trình bày**

Đặt $\left|\overrightarrow{F_1}\right|=x$ (đơn vị $N$). Vì $\overrightarrow{F_2}$ ngược chiều $\overrightarrow{F_1}$ và $\left|\overrightarrow{F_2}\right|=2x$ nên $\overrightarrow{F_2}=-2\overrightarrow{F_1}$.

Do đó $\overrightarrow{F_1}+\overrightarrow{F_2}=-\overrightarrow{F_1}$, có độ lớn $x$ và ngược chiều $\overrightarrow{F_1}$.

$\overrightarrow{F_3}$ và $\overrightarrow{F_4}$ có cùng độ lớn $20$, cùng hợp với $\overrightarrow{F_1}$ góc $45^\circ$ về hai phía. Thành phần vuông góc với $\overrightarrow{F_1}$ của hai lực triệt tiêu nhau.

Thành phần dọc theo $\overrightarrow{F_1}$ của mỗi lực bằng $20\cdot\cos45^\circ=10\sqrt{2}$, nên $\overrightarrow{F_3}+\overrightarrow{F_4}$ cùng hướng $\overrightarrow{F_1}$ và có độ lớn $2\cdot10\sqrt{2}=20\sqrt{2}$.

Vật dừng lại nên $\overrightarrow{F_1}+\overrightarrow{F_2}+\overrightarrow{F_3}+\overrightarrow{F_4}=\vec{0}$, suy ra $x=20\sqrt{2}$.

Tổng độ lớn của hai lực: $x+2x=3x=60\sqrt{2}\approx84{,}85\approx85$ (N).

Vậy tổng độ lớn của $\overrightarrow{F_1}$ và $\overrightarrow{F_2}$ xấp xỉ $85\,N$.

### Câu 65 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho hình thang vuông $ABCD$ có đáy lớn $AB=8$; đáy nhỏ $CD=4$; đường cao $AD=6$; $I$ là trung điểm của $AD$. Tính $\left(\overrightarrow{IA}+\overrightarrow{IB}\right)\cdot\overrightarrow{ID}$.
**Hình giải:** giai_P12C65.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** khai triển tích vô hướng thành hai tích rồi dùng hai dữ kiện: $I$ là trung điểm của $AD$ và $AB\perp AD$.

**Bước 1.** Khai triển tích vô hướng đề cho thành tổng của hai tích vô hướng cùng nhân với $\overrightarrow{ID}$.

**Bước 2.** Dùng tính chất trung điểm để biểu diễn $\overrightarrow{IA}$ qua $\overrightarrow{ID}$ rồi tính tích thứ nhất theo độ dài $ID$.

**Bước 3.** Với tích thứ hai, tách $\overrightarrow{IB}$ bằng quy tắc ba điểm qua $A$ và dùng hai đường thẳng $AB$, $AD$ vuông góc nhau.

**Bước 4.** Cộng hai kết quả và tính độ dài $ID$ từ $AD$ đã cho.

**Phần 2. Trình bày**

Vì $I$ là trung điểm của $AD$ nên $ID=\dfrac{AD}{2}=3$ và $\overrightarrow{IA}=-\overrightarrow{ID}$.

$\overrightarrow{IA}\cdot\overrightarrow{ID}=-\overrightarrow{ID}\cdot\overrightarrow{ID}=-ID^2=-9$.

$\overrightarrow{IB}\cdot\overrightarrow{ID}=\left(\overrightarrow{IA}+\overrightarrow{AB}\right)\cdot\overrightarrow{ID}=\overrightarrow{IA}\cdot\overrightarrow{ID}+\overrightarrow{AB}\cdot\overrightarrow{ID}$.

Vì $AB\perp AD$ nên $\overrightarrow{AB}\cdot\overrightarrow{ID}=0$, do đó $\overrightarrow{IB}\cdot\overrightarrow{ID}=-9$.

$\left(\overrightarrow{IA}+\overrightarrow{IB}\right)\cdot\overrightarrow{ID}=\overrightarrow{IA}\cdot\overrightarrow{ID}+\overrightarrow{IB}\cdot\overrightarrow{ID}=-9+(-9)=-18$.

Vậy $\left(\overrightarrow{IA}+\overrightarrow{IB}\right)\cdot\overrightarrow{ID}=-18$.

### Câu 66 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ có $AB=1$, $AC=2\sqrt{3}$ và $AM$ là trung tuyến. Tính tích vô hướng $\overrightarrow{BA}\cdot\overrightarrow{AM}$.
**Hình giải:** giai_P12C66.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn $\overrightarrow{AM}$ qua hai vectơ $\overrightarrow{AB}$, $\overrightarrow{AC}$ vuông góc nhau rồi khai triển tích vô hướng.

**Bước 1.** Dùng tính chất trung điểm $M$ của $BC$ để viết $\overrightarrow{AM}$ theo $\overrightarrow{AB}$ và $\overrightarrow{AC}$.

**Bước 2.** Đổi $\overrightarrow{BA}$ thành vectơ đối của $\overrightarrow{AB}$ rồi thay vào tích vô hướng cần tính.

**Bước 3.** Khai triển tích, dùng $\overrightarrow{AB}\cdot\overrightarrow{AB}=AB^2$ và $\overrightarrow{AB}\cdot\overrightarrow{AC}=0$ vì tam giác vuông tại $A$.

**Bước 4.** Thay độ dài $AB$ đã cho để ra giá trị của tích vô hướng.

**Phần 2. Trình bày**

Vì $M$ là trung điểm của $BC$ nên $\overrightarrow{AM}=\dfrac{1}{2}\left(\overrightarrow{AB}+\overrightarrow{AC}\right)$.

Ta có $\overrightarrow{BA}=-\overrightarrow{AB}$, nên $\overrightarrow{BA}\cdot\overrightarrow{AM}=-\dfrac{1}{2}\overrightarrow{AB}\cdot\left(\overrightarrow{AB}+\overrightarrow{AC}\right)$.

$\overrightarrow{BA}\cdot\overrightarrow{AM}=-\dfrac{1}{2}\left(\overrightarrow{AB}\cdot\overrightarrow{AB}+\overrightarrow{AB}\cdot\overrightarrow{AC}\right)$.

Tam giác $ABC$ vuông tại $A$ nên $\overrightarrow{AB}\cdot\overrightarrow{AC}=0$ và $\overrightarrow{AB}\cdot\overrightarrow{AB}=AB^2=1$.

Do đó $\overrightarrow{BA}\cdot\overrightarrow{AM}=-\dfrac{1}{2}\left(1+0\right)=-\dfrac{1}{2}$.

Vậy $\overrightarrow{BA}\cdot\overrightarrow{AM}=-\dfrac{1}{2}$.

### Câu 67 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Một người dùng một lực $\vec{F}$ có độ lớn $90\,N$ làm một vật dịch chuyển một đoạn $100\,m$. Biết lực $\vec{F}$ hợp với hướng dịch chuyển một góc $60^\circ$. Công sinh ra bởi lực $\vec{F}$ là bao nhiêu Jun?
**Hình:** de_P12C67.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** công của lực là tích vô hướng của vectơ lực và vectơ độ dịch chuyển, tức tích hai độ lớn nhân côsin góc giữa chúng.

**Bước 1.** Nhận ra công sinh ra bởi lực là tích vô hướng của vectơ lực $\vec{F}$ và vectơ dịch chuyển $\overrightarrow{OM}$.

**Bước 2.** Xác định các đại lượng trong công thức tích vô hướng từ đề: độ lớn lực, độ dài dịch chuyển và góc giữa hai vectơ.

**Bước 3.** Thay số vào công thức rồi tính, ghi đơn vị Jun.

**Phần 2. Trình bày**

Công của lực $\vec{F}$ là $A=\vec{F}\cdot\overrightarrow{OM}=\left|\vec{F}\right|\cdot\left|\overrightarrow{OM}\right|\cdot\cos\left(\vec{F},\overrightarrow{OM}\right)$.

Thay số: $A=90\cdot100\cdot\cos60^\circ=90\cdot100\cdot\dfrac{1}{2}=4500$ (J).

Vậy công sinh ra bởi lực $\vec{F}$ là $4500$ Jun.

### Câu 68 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ có cạnh $AC=7\,cm$ và $BC=14\,cm$. Tính côsin của góc giữa hai vectơ $\overrightarrow{AC}$ và $\overrightarrow{CB}$.
**Hình giải:** giai_P12C68.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai vectơ $\overrightarrow{AC}$ và $\overrightarrow{CB}$ không chung gốc nên phải dời về chung gốc, khi đó góc giữa chúng là góc bù với một góc của tam giác.

**Bước 1.** Tính côsin của góc $C$ trong tam giác vuông $ABC$ bằng tỉ số cạnh kề trên cạnh huyền để biết số đo góc $C$.

**Bước 2.** Thay $\overrightarrow{AC}$ bằng vectơ đối $\overrightarrow{CA}$ để hai vectơ có chung gốc $C$ với $\overrightarrow{CB}$, rồi tìm mối quan hệ giữa hai góc.

**Bước 3.** Suy ra số đo góc giữa $\overrightarrow{AC}$ và $\overrightarrow{CB}$ rồi tính côsin của góc ấy.

**Phần 2. Trình bày**

Trong tam giác $ABC$ vuông tại $A$: $\cos C=\dfrac{AC}{BC}=\dfrac{7}{14}=\dfrac{1}{2}$, suy ra $\widehat{C}=60^\circ$.

Ta có $\overrightarrow{AC}=-\overrightarrow{CA}$, mà $\overrightarrow{CA}$ và $\overrightarrow{CB}$ có chung gốc $C$ nên góc giữa hai vectơ $\overrightarrow{CA}$, $\overrightarrow{CB}$ là $\widehat{ACB}=60^\circ$.

Góc giữa $\overrightarrow{AC}$ và $\overrightarrow{CB}$ bù với góc giữa $\overrightarrow{CA}$ và $\overrightarrow{CB}$ nên $\left(\overrightarrow{AC},\overrightarrow{CB}\right)=180^\circ-60^\circ=120^\circ$.

Do đó $\cos\left(\overrightarrow{AC},\overrightarrow{CB}\right)=\cos120^\circ=-\dfrac{1}{2}$.

Vậy côsin của góc giữa hai vectơ $\overrightarrow{AC}$ và $\overrightarrow{CB}$ bằng $-\dfrac{1}{2}$.

### Câu 69 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho hai vectơ $\vec{a}$ và $\vec{b}$. Biết $|\vec{a}|=2$, $|\vec{b}|=\sqrt{3}$ và $\left(\vec{a},\vec{b}\right)=120^\circ$. Tính $\left|\vec{a}+\vec{b}\right|$. (Kết quả làm tròn đến hàng phần chục)

**Phần 1. Hướng dẫn**

**Mấu chốt:** bình phương độ dài tổng hai vectơ rồi dùng công thức tích vô hướng để tính được số hạng chứa $\vec{a}\cdot\vec{b}$.

**Bước 1.** Viết bình phương độ dài của tổng hai vectơ dưới dạng tổng bình phương hai độ dài cộng hai lần tích vô hướng.

**Bước 2.** Tính tích vô hướng $\vec{a}\cdot\vec{b}$ từ hai độ lớn và góc giữa hai vectơ đề cho.

**Bước 3.** Thay các giá trị vào, lấy căn bậc hai rồi làm tròn theo yêu cầu của đề.

**Phần 2. Trình bày**

$\vec{a}\cdot\vec{b}=|\vec{a}|\cdot|\vec{b}|\cdot\cos\left(\vec{a},\vec{b}\right)=2\cdot\sqrt{3}\cdot\cos120^\circ=2\cdot\sqrt{3}\cdot\left(-\dfrac{1}{2}\right)=-\sqrt{3}$.

$\left|\vec{a}+\vec{b}\right|^2=|\vec{a}|^2+|\vec{b}|^2+2\,\vec{a}\cdot\vec{b}=4+3+2\cdot\left(-\sqrt{3}\right)=7-2\sqrt{3}$.

Suy ra $\left|\vec{a}+\vec{b}\right|=\sqrt{7-2\sqrt{3}}\approx1{,}9$.

Vậy $\left|\vec{a}+\vec{b}\right|\approx1{,}9$.

## GHI CHÚ CHO NGƯỜI DUYỆT
- Câu 62: đề cho điểm $I$ (trung điểm $AC$) nhưng không dùng; lời giải không cần $I$.
- Câu 63: đề in thừa dấu "(" ở cuối.
- Câu 64: hiểu $\overrightarrow{F_3}$, $\overrightarrow{F_4}$ nằm cùng phía với $\overrightarrow{F_1}$ như hình đề; kết quả $60\sqrt{2}\approx85\,N$.
- Các câu 61–69 ở mục C (tự luận) của đề cương nhưng đều có đáp số một số, nên để `tu_luan` theo PHẦN; có thể chuyển trả lời ngắn nếu CEO muốn.
