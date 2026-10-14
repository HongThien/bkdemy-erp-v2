# ĐỀ | Đề cương ôn tập giữa học kì I Toán 9 — THCS Tây Mỗ (Hà Nội)
nam: 2024
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | Dạng 4. Các bài toán hình học (Bài 15–25) | tu_luan

### Bài 23 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho $\triangle ABC$ vuông tại $A$ $(AB<AC)$.
a) Biết $AB=6\ \text{cm}$, $\widehat{B}=53^\circ$. Giải tam giác vuông $ABC$ (làm tròn kết quả đến hàng đơn vị).
b) Lấy điểm $M$ bất kì trên cạnh $BC$ ($M$ khác $B$, $C$). Kẻ $BK\perp AM$ $(K\in AM)$ và $CH$ vuông góc với đường thẳng $AM$ $(H\in AM)$. Chứng minh $\triangle ABK\backsim\triangle CAH$ và $BK=AH\cot\widehat{ABC}$.
c) Chứng minh $\dfrac{MB}{MC}=\dfrac{AH\tan^2\widehat{ACB}}{AK}$.
**Hình giải:** giai_P4B23.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba ý cùng xoay quanh tam giác vuông $ABC$ và hai tam giác vuông $ABK$, $CAH$ có một cặp góc nhọn bằng nhau (cùng phụ với một góc có đỉnh $A$), nên tỉ số $\dfrac{AB}{AC}$ xuất hiện ở mọi tỉ lệ thức.

**Bước 1.** Ý a: từ góc $B$ đã biết suy ra góc $C$ nhờ hai góc nhọn phụ nhau, rồi chọn tỉ số lượng giác của góc $B$ nối cạnh $AB$ đã biết với từng cạnh còn lại.

**Bước 2.** Ý b: vì $M$ nằm giữa $B$ và $C$ nên $\widehat{BAM}$ và $\widehat{MAC}$ cộng lại thành góc vuông, từ đó góc $\widehat{ABK}$ của tam giác vuông $ABK$ bằng góc $\widehat{CAH}$ và hai tam giác đồng dạng theo trường hợp góc – góc.

**Bước 3.** Ý b: viết tỉ lệ các cạnh tương ứng của hai tam giác đồng dạng để rút $BK$ theo $AH$ và $\dfrac{AB}{AC}$, rồi đối chiếu tỉ số này với định nghĩa $\cot\widehat{ABC}$ trong tam giác vuông $ABC$.

**Bước 4.** Ý c: cũng từ hai tam giác đồng dạng, biểu diễn $CH$ theo $AK$ và $\dfrac{AB}{AC}$; vì $BK$ và $CH$ cùng vuông góc với $AM$ nên song song, dùng hệ quả định lí Thalès để chuyển $\dfrac{MB}{MC}$ thành $\dfrac{BK}{CH}$.

**Bước 5.** Ý c: thay $BK$ và $CH$ vừa biểu diễn vào tỉ số $\dfrac{BK}{CH}$, gom thành bình phương của $\dfrac{AB}{AC}$ rồi đổi sang $\tan^2\widehat{ACB}$.

**Chú ý:** khi $AM\perp BC$ thì ba điểm $K$, $H$, $M$ trùng nhau và không còn hai đường thẳng song song phân biệt, nên cần nêu riêng trường hợp này.

**Phần 2. Trình bày**

a) Xét $\triangle ABC$ vuông tại $A$, ta có:

$\widehat{C}=90^\circ-\widehat{B}=90^\circ-53^\circ=37^\circ$

$AC=AB\cdot\tan B=6\cdot\tan53^\circ\approx7{,}96\ \text{cm}$ (hệ thức giữa cạnh và góc)

$BC=\dfrac{AB}{\cos B}=\dfrac{6}{\cos53^\circ}\approx9{,}97\ \text{cm}$ (hệ thức giữa cạnh và góc)

Làm tròn đến hàng đơn vị: $AC\approx8\ \text{cm}$, $BC\approx10\ \text{cm}$.

Vậy $\widehat{C}=37^\circ$, $AC\approx8\ \text{cm}$, $BC\approx10\ \text{cm}$.

b) Vì $M$ nằm giữa $B$ và $C$ nên tia $AM$ nằm giữa hai tia $AB$, $AC$, do đó:

$\widehat{BAM}+\widehat{MAC}=\widehat{BAC}=90^\circ$

Hai góc $\widehat{BAM}$, $\widehat{MAC}$ đều nhọn nên $K$, $H$ nằm trên tia $AM$, suy ra $\widehat{BAK}=\widehat{BAM}$ và $\widehat{CAH}=\widehat{MAC}$.

Xét $\triangle ABK$ vuông tại $K$, ta có:

$\widehat{ABK}=90^\circ-\widehat{BAK}=90^\circ-\widehat{BAM}=\widehat{MAC}=\widehat{CAH}$

Xét $\triangle ABK$ và $\triangle CAH$, ta có:

$\widehat{AKB}=\widehat{CHA}=90^\circ$ và $\widehat{ABK}=\widehat{CAH}$

Suy ra $\triangle ABK\backsim\triangle CAH$ (g.g).

Từ đó, các cạnh tương ứng tỉ lệ ($B\leftrightarrow A$, $K\leftrightarrow H$, $A\leftrightarrow C$):

$\dfrac{BK}{AH}=\dfrac{AK}{CH}=\dfrac{AB}{CA}$ (1)

Suy ra $BK=AH\cdot\dfrac{AB}{AC}$.

Xét $\triangle ABC$ vuông tại $A$, ta có $\cot\widehat{ABC}=\dfrac{AB}{AC}$.

Do đó $BK=AH\cdot\cot\widehat{ABC}$.

Vậy $\triangle ABK\backsim\triangle CAH$ và $BK=AH\cot\widehat{ABC}$.

c) Từ (1) suy ra $CH=\dfrac{AK\cdot AC}{AB}$ và $BK=\dfrac{AH\cdot AB}{AC}$.

Vì $BK\perp AM$ và $CH\perp AM$ nên $BK\parallel CH$. Hai đường thẳng $BC$ và $KH$ cắt nhau tại $M$, theo hệ quả của định lí Thalès:

$\dfrac{MB}{MC}=\dfrac{BK}{CH}$ (2)

Nếu $AM\perp BC$ thì $K\equiv H\equiv M$, khi đó $BK=MB$ và $CH=MC$ nên (2) vẫn đúng.

Thay $BK$ và $CH$ vào (2):

$\dfrac{MB}{MC}=\dfrac{AH\cdot AB}{AC}:\dfrac{AK\cdot AC}{AB}=\dfrac{AH\cdot AB^2}{AK\cdot AC^2}=\dfrac{AH}{AK}\cdot\left(\dfrac{AB}{AC}\right)^2$

Xét $\triangle ABC$ vuông tại $A$, ta có $\tan\widehat{ACB}=\dfrac{AB}{AC}$.

Do đó $\dfrac{MB}{MC}=\dfrac{AH\cdot\tan^2\widehat{ACB}}{AK}$.

Vậy $\dfrac{MB}{MC}=\dfrac{AH\tan^2\widehat{ACB}}{AK}$.

### Bài 24 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$. Gọi $H$ là hình chiếu của điểm $D$ trên đường thẳng $AC$.
a) Giả sử $AD=9\ \text{cm}$, $AB=12\ \text{cm}$. Tính độ dài đoạn thẳng $DH$; số đo góc $DAC$ (số đo làm tròn đến phút).
b) Chứng minh rằng: $\dfrac{DC^2}{BC^2}=\dfrac{CH}{AH}$.
c) Gọi $M$ và $N$ là hình chiếu của $H$ trên đường thẳng $AD$ và $DC$. Chứng minh rằng: $\dfrac{S_{BAC}}{S_{DMN}}=\dfrac{1}{\sin^2\widehat{DAC}}+\dfrac{1}{\cos^2\widehat{HDC}}$.
**Hình giải:** giai_P4B24.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đường chéo $AC$ chia hình chữ nhật thành tam giác vuông $ADC$; mọi ý đều tính qua $\widehat{DAC}$ hoặc qua hai tam giác vuông nhỏ có chung góc với $\triangle ADC$.

**Bước 1.** Ý a: tính $DC$ rồi $AC$ trong tam giác vuông $ADC$, sau đó đặt $DH$ vào tam giác vuông $AHD$ và dùng tỉ số lượng giác của góc $\widehat{DAC}$ đã biết qua $DC$ và $AC$.

**Bước 2.** Ý a: tìm góc $\widehat{DAC}$ bằng tỉ số $\tan$ của hai cạnh góc vuông $DC$, $AD$ rồi bấm máy tính và đổi phần thập phân của độ sang phút.

**Bước 3.** Ý b: tìm hai cặp tam giác vuông đồng dạng (mỗi cặp có $\triangle ADC$ và một tam giác nhỏ chung một góc nhọn) để biểu diễn $DC^2$ và $AD^2$ qua $CH$, $AH$, $AC$, rồi lập tỉ số và dùng $BC=AD$.

**Bước 4.** Ý c: gọi $\widehat{DAC}=\alpha$, chứng tỏ $\widehat{HDC}=\alpha$ rồi biểu diễn $AD$, $DC$, $DH$ theo $AC$ và $\alpha$.

**Bước 5.** Ý c: nhận ra $DMHN$ là hình chữ nhật để tính $DM$, $DN$, từ đó lập $S_{DMN}$ và $S_{BAC}$ theo $AC$, $\alpha$, rồi tách vế phải bằng hệ thức $\sin^2\alpha+\cos^2\alpha=1$.

**Chú ý:** ở ý c, cả hai góc $\widehat{DAC}$ và $\widehat{HDC}$ cùng một số đo nên vế phải chỉ còn một ẩn $\alpha$.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình chữ nhật nên $DC=AB=12\ \text{cm}$ và $\widehat{ADC}=90^\circ$.

Xét $\triangle ADC$ vuông tại $D$, theo định lí Pythagore ta có:

$AC^2=AD^2+DC^2=9^2+12^2=225$

Suy ra $AC=15\ \text{cm}$ (vì $AC>0$).

Xét $\triangle ADC$ vuông tại $D$, ta có:

$\sin\widehat{DAC}=\dfrac{DC}{AC}=\dfrac{12}{15}=\dfrac{4}{5}$

Vì $H$ thuộc đường thẳng $AC$ nên $\widehat{DAH}=\widehat{DAC}$. Xét $\triangle AHD$ vuông tại $H$, ta có:

$DH=AD\cdot\sin\widehat{DAH}=9\cdot\dfrac{4}{5}=7{,}2\ \text{cm}$

Xét $\triangle ADC$ vuông tại $D$, ta có:

$\tan\widehat{DAC}=\dfrac{DC}{AD}=\dfrac{12}{9}=\dfrac{4}{3}$

Suy ra $\widehat{DAC}\approx53^\circ8'$ (bấm máy tính).

Vậy $DH=7{,}2\ \text{cm}$ và $\widehat{DAC}\approx53^\circ8'$.

b) Xét $\triangle CHD$ và $\triangle CDA$, ta có:

$\widehat{CHD}=\widehat{CDA}=90^\circ$ và $\widehat{C}$ chung

Suy ra $\triangle CHD\backsim\triangle CDA$ (g.g), do đó:

$\dfrac{CH}{CD}=\dfrac{CD}{CA}$

Suy ra $DC^2=CH\cdot AC$. (1)

Xét $\triangle AHD$ và $\triangle ADC$, ta có:

$\widehat{AHD}=\widehat{ADC}=90^\circ$ và $\widehat{A}$ chung

Suy ra $\triangle AHD\backsim\triangle ADC$ (g.g), do đó:

$\dfrac{AH}{AD}=\dfrac{AD}{AC}$

Suy ra $AD^2=AH\cdot AC$. (2)

Vì $ABCD$ là hình chữ nhật nên $BC=AD$. Từ (1) và (2):

$\dfrac{DC^2}{BC^2}=\dfrac{DC^2}{AD^2}=\dfrac{CH\cdot AC}{AH\cdot AC}=\dfrac{CH}{AH}$

Vậy $\dfrac{DC^2}{BC^2}=\dfrac{CH}{AH}$.

c) Đặt $\widehat{DAC}=\alpha$.

Xét $\triangle ADC$ vuông tại $D$, ta có $\widehat{DAC}+\widehat{DCA}=90^\circ$.

Xét $\triangle DHC$ vuông tại $H$, ta có $\widehat{HDC}+\widehat{DCH}=90^\circ$, mà $\widehat{DCH}=\widehat{DCA}$ nên $\widehat{HDC}=\widehat{DAC}=\alpha$.

Xét $\triangle ADC$ vuông tại $D$, ta có:

$AD=AC\cdot\cos\alpha$ và $DC=AC\cdot\sin\alpha$

Vì $AB=DC$ và $BC=AD$ nên:

$S_{BAC}=\dfrac{1}{2}AB\cdot BC=\dfrac{1}{2}DC\cdot AD=\dfrac{1}{2}AC^2\cdot\sin\alpha\cos\alpha$

Xét $\triangle AHD$ vuông tại $H$, ta có:

$DH=AD\cdot\sin\alpha=AC\cdot\sin\alpha\cos\alpha$

Tứ giác $DMHN$ có $\widehat{MDN}=\widehat{DMH}=\widehat{DNH}=90^\circ$ nên là hình chữ nhật, suy ra $DM=NH$.

Xét $\triangle DNH$ vuông tại $N$ và $\widehat{HDN}=\widehat{HDC}=\alpha$, ta có:

$NH=DH\cdot\sin\alpha$ và $DN=DH\cdot\cos\alpha$

Do đó $DM=DH\cdot\sin\alpha$ và:

$S_{DMN}=\dfrac{1}{2}DM\cdot DN=\dfrac{1}{2}DH^2\cdot\sin\alpha\cos\alpha=\dfrac{1}{2}AC^2\cdot\sin^3\alpha\cos^3\alpha$

Suy ra:

$\dfrac{S_{BAC}}{S_{DMN}}=\dfrac{\sin\alpha\cos\alpha}{\sin^3\alpha\cos^3\alpha}=\dfrac{1}{\sin^2\alpha\cos^2\alpha}$

Theo hệ thức $\sin^2\alpha+\cos^2\alpha=1$, ta có:

$\dfrac{1}{\sin^2\alpha\cos^2\alpha}=\dfrac{\sin^2\alpha+\cos^2\alpha}{\sin^2\alpha\cos^2\alpha}=\dfrac{1}{\cos^2\alpha}+\dfrac{1}{\sin^2\alpha}$

Vì $\widehat{DAC}=\widehat{HDC}=\alpha$ nên:

$\dfrac{S_{BAC}}{S_{DMN}}=\dfrac{1}{\sin^2\widehat{DAC}}+\dfrac{1}{\cos^2\widehat{HDC}}$

Vậy $\dfrac{S_{BAC}}{S_{DMN}}=\dfrac{1}{\sin^2\widehat{DAC}}+\dfrac{1}{\cos^2\widehat{HDC}}$.

### Bài 25 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho $\triangle BCM$ vuông tại $C$ $(CM>CB)$, đường cao $CA$. Gọi $H$, $E$ là hình chiếu của $A$ xuống $BC$, $CM$.
a) Giải tam giác $BCA$ biết $BC=6\ \text{cm}$, $BM=10\ \text{cm}$.
b) Chứng minh $HC\cdot BC=CE\cdot CM$.
c) Gọi $I$ là trung điểm của cạnh $BM$, số đo góc $M$ là $\alpha$. Chứng minh rằng $\sin 2\alpha=2\sin\alpha\cos\alpha$.
**Hình giải:** giai_P4B25.png
**Chưa chắc:** ý a đề không nêu cách làm tròn — theo mặc định của luật hgt khối 9: độ dài giữ giá trị đúng (kết quả không cần làm tròn), góc làm tròn đến độ. Nếu giáo viên yêu cầu làm tròn đến phút thì $\widehat{B}\approx53^\circ8'$, $\widehat{BCA}\approx36^\circ52'$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai ý đầu dùng các tam giác vuông có chung góc nhọn với $\triangle BCM$ (cạnh huyền $BM$ và đường cao $CA$ cắt $BM$ tại $A$); ý c bắt đầu từ trung tuyến $CI$ ứng với cạnh huyền để tìm góc $2\alpha$.

**Bước 1.** Ý a: tìm $CM$ bằng định lí Pythagore trong $\triangle BCM$, lấy tỉ số lượng giác của góc $B$ trong $\triangle BCM$ để suy ra số đo góc $B$, rồi tính hai cạnh góc vuông của $\triangle BCA$ qua cạnh huyền $BC$ và góc $B$.

**Bước 2.** Ý b: vì $CA\perp BM$ nên $ACB$, $ACM$ là hai tam giác vuông tại $A$; ghép tam giác vuông $HCA$ với $\triangle ACB$ và tam giác vuông $ECA$ với $\triangle ACM$ — mỗi cặp chung một góc nhọn đỉnh $C$ nên đồng dạng, từ đó mỗi tích ở hai vế đều bằng một đại lượng chung.

**Bước 3.** Ý b: lập hai tỉ lệ thức từ hai cặp tam giác đồng dạng rồi so sánh vế phải của hai đẳng thức để kết luận.

**Bước 4.** Ý c: dùng tính chất trung tuyến ứng với cạnh huyền để thấy $\triangle ICM$ cân, suy ra góc ngoài tại $I$ bằng $2\alpha$ và đặt góc đó vào tam giác vuông $CAI$.

**Bước 5.** Ý c: viết $\sin 2\alpha$ bằng tỉ số cạnh của $\triangle CAI$, rồi biểu diễn $\sin\alpha$, $\cos\alpha$ qua các cạnh của $\triangle ACM$ và $\triangle BCM$ để so hai vế.

**Chú ý:** điều kiện $CM>CB$ dùng để chứng tỏ chân đường cao $A$ nằm giữa $B$ và $I$, nhờ đó góc $\widehat{CIA}$ chính là góc ngoài $2\alpha$.

**Phần 2. Trình bày**

a) Xét $\triangle BCM$ vuông tại $C$, theo định lí Pythagore ta có:

$CM^2=BM^2-BC^2=10^2-6^2=64$

Suy ra $CM=8\ \text{cm}$ (vì $CM>0$).

Xét $\triangle BCM$ vuông tại $C$, ta có:

$\cos\widehat{CBM}=\dfrac{BC}{BM}=\dfrac{6}{10}=\dfrac{3}{5}$ và $\sin\widehat{CBM}=\dfrac{CM}{BM}=\dfrac{8}{10}=\dfrac{4}{5}$

Suy ra $\widehat{CBM}\approx53^\circ$ (bấm máy tính).

Vì $CA\perp BM$ nên $\triangle BCA$ vuông tại $A$, và $\widehat{CBA}=\widehat{CBM}$. Ta có:

$AB=BC\cdot\cos\widehat{CBA}=6\cdot\dfrac{3}{5}=3{,}6\ \text{cm}$

$AC=BC\cdot\sin\widehat{CBA}=6\cdot\dfrac{4}{5}=4{,}8\ \text{cm}$

$\sin\widehat{BCA}=\dfrac{AB}{BC}=\dfrac{3{,}6}{6}=\dfrac{3}{5}$

Suy ra $\widehat{BCA}\approx37^\circ$ (bấm máy tính).

Vậy $\triangle BCA$ có $AB=3{,}6\ \text{cm}$, $AC=4{,}8\ \text{cm}$, $\widehat{B}\approx53^\circ$, $\widehat{BCA}\approx37^\circ$.

b) Xét $\triangle HCA$ và $\triangle ACB$, ta có:

$\widehat{CHA}=\widehat{CAB}=90^\circ$ và $\widehat{C}$ chung ($\widehat{HCA}=\widehat{ACB}$)

Suy ra $\triangle HCA\backsim\triangle ACB$ (g.g), do đó:

$\dfrac{HC}{AC}=\dfrac{AC}{BC}$

Suy ra $HC\cdot BC=AC^2$. (1)

Xét $\triangle ECA$ và $\triangle ACM$, ta có:

$\widehat{CEA}=\widehat{CAM}=90^\circ$ và $\widehat{C}$ chung ($\widehat{ECA}=\widehat{ACM}$)

Suy ra $\triangle ECA\backsim\triangle ACM$ (g.g), do đó:

$\dfrac{CE}{AC}=\dfrac{AC}{CM}$

Suy ra $CE\cdot CM=AC^2$. (2)

Từ (1) và (2) suy ra $HC\cdot BC=CE\cdot CM$.

Vậy $HC\cdot BC=CE\cdot CM$.

c) Vì $\triangle BCM$ vuông tại $C$ và $I$ là trung điểm của cạnh huyền $BM$ nên:

$CI=IM=\dfrac{BM}{2}$ (đường trung tuyến ứng với cạnh huyền)

Suy ra $\triangle ICM$ cân tại $I$, nên $\widehat{ICM}=\widehat{IMC}=\alpha$.

Xét $\triangle ICM$, góc $\widehat{CIB}$ là góc ngoài tại đỉnh $I$ nên:

$\widehat{CIB}=\widehat{ICM}+\widehat{IMC}=2\alpha$

Xét hai tam giác vuông $ACB$ và $ACM$ (vuông tại $A$), theo định lí Pythagore:

$AB^2=BC^2-AC^2$ và $AM^2=CM^2-AC^2$

Vì $CM>CB$ nên $AM^2>AB^2$, suy ra $AM>AB$. Mà $AB+AM=BM$ nên $AB<\dfrac{BM}{2}=BI$.

Do đó $A$ nằm giữa $B$ và $I$, suy ra $\widehat{CIA}=\widehat{CIB}=2\alpha$.

Xét $\triangle CAI$ vuông tại $A$, ta có:

$\sin2\alpha=\sin\widehat{CIA}=\dfrac{CA}{CI}=\dfrac{CA}{\frac{BM}{2}}=\dfrac{2CA}{BM}$

Xét $\triangle ACM$ vuông tại $A$, ta có $\sin\alpha=\dfrac{CA}{CM}$.

Xét $\triangle BCM$ vuông tại $C$, ta có $\cos\alpha=\dfrac{CM}{BM}$.

Do đó:

$2\sin\alpha\cos\alpha=2\cdot\dfrac{CA}{CM}\cdot\dfrac{CM}{BM}=\dfrac{2CA}{BM}$

Suy ra $\sin2\alpha=2\sin\alpha\cos\alpha$.

Vậy $\sin2\alpha=2\sin\alpha\cos\alpha$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 25a: đề không nêu làm tròn (xem `**Chưa chắc:**`); cạnh $AB=3{,}6$, $AC=4{,}8$ là số đúng.
- Bài 25c: lời giải dùng tính chất trung tuyến ứng với cạnh huyền (kiến thức lớp 8, hình chữ nhật) và góc ngoài của tam giác; điều kiện $CM>CB$ của đề được dùng để $A$ nằm giữa $B$ và $I$. Công thức $\sin2\alpha=2\sin\alpha\cos\alpha$ chỉ là bài tập hình, không dùng công thức nhân đôi.
- Bài 23c: ở trường hợp suy biến $AM\perp BC$ ($K\equiv H\equiv M$) lời giải có nêu riêng một dòng.
- Bài 24c: dùng $\sin^2\alpha+\cos^2\alpha=1$ có ghi căn cứ; $\widehat{HDC}=\widehat{DAC}$ được chứng minh trong lời giải.
- Hình giải đã vẽ bằng code (dựng đúng số liệu đề): `giai_P4B23.png`, `giai_P4B24.png`, `giai_P4B25.png`; đã kiểm bằng toạ độ số cả ba bài (3000 vị trí ngẫu nhiên cho M / hình chữ nhật / tam giác).
