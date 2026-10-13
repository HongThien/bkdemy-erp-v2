# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 8 | B. Hình học | tu_luan

### Bài 41 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, đường trung tuyến $AM$. Dựng điểm $H$ sao cho $AB$ là đường trung trực của $MH$, $E$ là giao điểm của $MH$ và $AB$. Dựng điểm $K$ sao cho $AC$ là đường trung trực của $MK$, $F$ là giao điểm của $MK$ và $AC$. Xác định dạng của tứ giác $AEMF,\ AMBH,\ AMCK$.
**Hình giải:** giai_bai41.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đề cho hai đường trung trực nên có sẵn các góc vuông ($MH\perp AB$, $MK\perp AC$) và các cặp đoạn bằng nhau (mỗi điểm trên đường trung trực cách đều hai đầu đoạn thẳng); ghép với $AM$ là trung tuyến ứng với cạnh huyền để nhận ra dạng từng tứ giác.

**Bước 1.** Tứ giác $AEMF$: đọc dữ kiện, $AB$ là trung trực của $MH$ nên $ME\perp AB$ tại $E$, $AC$ là trung trực của $MK$ nên $MF\perp AC$ tại $F$; cùng với góc $A$ vuông, tứ giác đã có ba góc vuông, dự đoán nó là hình chữ nhật.

**Bước 2.** Tứ giác $AEMF$ (tiếp): muốn kết luận, cần cả bốn góc vuông; tổng các góc của tứ giác bằng $360^\circ$ nên từ ba góc vuông suy ra góc thứ tư cũng vuông (ba góc vuông chưa phải dấu hiệu nhận biết trong sách).

**Bước 3.** Tứ giác $AMBH$: dự đoán là hình thoi; muốn vậy cần bốn cạnh bằng nhau, tức $AM=MB=BH=HA$.

**Bước 4.** Tứ giác $AMBH$ (tiếp): $A$ và $B$ cùng nằm trên đường trung trực của $MH$ nên cách đều hai đầu: $AH=AM$ và $BH=BM$; còn $AM=MB$ vì $AM$ là trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$.

**Bước 5.** Tứ giác $AMCK$: làm hoàn toàn tương tự với đường trung trực của $MK$, đổi vai $B$ thành $C$ và $H$ thành $K$.

**Chú ý:** chọn "tứ giác có bốn cạnh bằng nhau" (định nghĩa hình thoi) vì bốn đoạn bằng nhau có ngay từ đường trung trực và trung tuyến ứng với cạnh huyền, không phải chứng minh thêm $E$ là trung điểm của $AB$.

**Phần 2. Trình bày**

Xét tứ giác $AEMF$:

Vì $AB$ là đường trung trực của $MH$ nên $MH\perp AB$ tại $E$, do đó $\widehat{AEM}=90^\circ$.

Vì $AC$ là đường trung trực của $MK$ nên $MK\perp AC$ tại $F$, do đó $\widehat{AFM}=90^\circ$.

Vì $E\in AB$, $F\in AC$ và $\triangle ABC$ vuông tại $A$ nên $\widehat{EAF}=\widehat{BAC}=90^\circ$.

Tứ giác $AEMF$ có $\widehat{EAF}+\widehat{AEM}+\widehat{EMF}+\widehat{AFM}=360^\circ$ nên $\widehat{EMF}=360^\circ-3\cdot 90^\circ=90^\circ$.

Tứ giác $AEMF$ có bốn góc vuông nên $AEMF$ là hình chữ nhật (định nghĩa).

Xét tứ giác $AMBH$:

Vì $A$ nằm trên đường trung trực của $MH$ nên $AH=AM$.

Vì $B$ nằm trên đường trung trực của $MH$ nên $BH=BM$.

Vì $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AM=\dfrac{1}{2}BC=MB$.

Do đó $AM=MB=BH=HA$.

Tứ giác $AMBH$ có bốn cạnh bằng nhau nên $AMBH$ là hình thoi (định nghĩa).

Xét tứ giác $AMCK$:

Vì $A$ nằm trên đường trung trực của $MK$ nên $AK=AM$.

Vì $C$ nằm trên đường trung trực của $MK$ nên $CK=CM$.

Vì $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AM=\dfrac{1}{2}BC=MC$.

Do đó $AM=MC=CK=KA$.

Tứ giác $AMCK$ có bốn cạnh bằng nhau nên $AMCK$ là hình thoi (định nghĩa).

Vậy $AEMF$ là hình chữ nhật; $AMBH$ và $AMCK$ là hình thoi.

### Bài 42 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ cân tại $A$. Từ một điểm $D$ trên đáy $BC$, vẽ đường thẳng vuông góc với $BC$ cắt các đường thẳng $AC,\ AB$ lần lượt tại $M$ và $N$. Gọi $H$ và $K$ lần lượt là trung điểm của $BC$ và $MN$. Chứng minh rằng tứ giác $AKDH$ là hình chữ nhật.
**Ghi chú:** Đề cương không đặt tên điểm trên đáy $BC$ ("Từ một điểm trên đáy $BC$"); theo tứ giác $AKDH$ ở kết luận đã gọi điểm đó là $D$.
**Hình giải:** giai_bai42.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tứ giác $AKDH$ có sẵn góc vuông tại $D$ và (nhờ tam giác cân) tại $H$; tổng bốn góc bằng $360^\circ$ nên chỉ cần thêm một góc vuông nữa, và chỗ khó là $AK\perp MN$, tức tam giác $AMN$ phải cân tại $A$.

**Bước 1.** Muốn $AKDH$ là hình chữ nhật, cần tứ giác có bốn góc vuông; vì tổng bốn góc của tứ giác bằng $360^\circ$ nên chỉ cần chứng minh ba góc vuông, chọn $\widehat{KDH}$, $\widehat{AHD}$ và $\widehat{AKD}$.

**Bước 2.** $\widehat{KDH}=90^\circ$ có ngay từ đề ($MN\perp BC$); $\widehat{AHD}=90^\circ$ vì $H$ là trung điểm đáy $BC$ của tam giác cân $ABC$ nên $AH$ là trung tuyến ứng với cạnh đáy, đồng thời là đường cao (chứng minh bằng hai tam giác bằng nhau).

**Bước 3.** Muốn $\widehat{AKD}=90^\circ$, tức $AK\perp MN$: vì $K$ là trung điểm của $MN$, chỉ cần $\triangle AMN$ cân tại $A$, khi đó trung tuyến $AK$ cũng là đường cao.

**Bước 4.** Muốn $\triangle AMN$ cân tại $A$, cần $\widehat{AMN}=\widehat{ANM}$; mỗi góc này là góc nhọn của một tam giác vuông ($DMC$ và $DNB$), bằng $90^\circ$ trừ góc $C$ hoặc góc $B$ của $\triangle ABC$, mà hai góc đáy $\widehat{B}=\widehat{C}$.

**Chú ý:** đề không nói $D$ khác $H$; nếu $D\equiv H$ thì $M,\ N,\ K$ cùng trùng $A$ và không có tứ giác $AKDH$, nên lấy $D\neq H$. Hình vẽ lấy $D$ nằm giữa $H$ và $C$; $D$ nằm giữa $B$ và $H$ thì lập luận như nhau (hai góc ở $M$ và $N$ vẫn bằng $90^\circ-\widehat{C}$ và $90^\circ-\widehat{B}$).

**Phần 2. Trình bày**

Vì $\triangle ABC$ cân tại $A$ nên $AB=AC$ và $\widehat{B}=\widehat{C}$.

Xét $\triangle AHB$ và $\triangle AHC$ có:

$AB=AC$ (chứng minh trên)

$HB=HC$ ($H$ là trung điểm của $BC$)

$AH$ là cạnh chung

Do đó $\triangle AHB=\triangle AHC$ (c.c.c).

Suy ra $\widehat{AHB}=\widehat{AHC}$ (hai góc tương ứng).

Mà $\widehat{AHB}+\widehat{AHC}=180^\circ$ (hai góc kề bù) nên $\widehat{AHC}=90^\circ$, hay $AH\perp BC$.

Vì $D$ nằm trên đoạn $HC$ nên $\widehat{AHD}=\widehat{AHC}=90^\circ$.

Vì $MN\perp BC$ tại $D$ nên $\widehat{KDH}=90^\circ$ và các tam giác $DMC$, $DNB$ vuông tại $D$.

Trong $\triangle DMC$ vuông tại $D$ có $\widehat{DMC}=90^\circ-\widehat{C}$.

Trong $\triangle DNB$ vuông tại $D$ có $\widehat{DNB}=90^\circ-\widehat{B}$.

Theo hình vẽ, $M$ nằm giữa $A$ và $C$, $A$ nằm giữa $B$ và $N$, $M$ nằm giữa $N$ và $D$ nên $\widehat{AMN}=\widehat{DMC}$ (hai góc đối đỉnh) và $\widehat{ANM}=\widehat{DNB}$ (hai tia $NA,\ NB$ trùng nhau, hai tia $NM,\ ND$ trùng nhau).

Mà $\widehat{B}=\widehat{C}$ nên $\widehat{AMN}=\widehat{ANM}$.

Do đó $\triangle AMN$ cân tại $A$, suy ra $AM=AN$.

Xét $\triangle AKM$ và $\triangle AKN$ có:

$AM=AN$ (chứng minh trên)

$KM=KN$ ($K$ là trung điểm của $MN$)

$AK$ là cạnh chung

Do đó $\triangle AKM=\triangle AKN$ (c.c.c).

Suy ra $\widehat{AKM}=\widehat{AKN}$ (hai góc tương ứng).

Mà $\widehat{AKM}+\widehat{AKN}=180^\circ$ (hai góc kề bù) nên $\widehat{AKN}=90^\circ$, hay $AK\perp MN$.

Vì $D$ nằm trên đường thẳng $MN$ và $D\neq K$ nên $\widehat{AKD}=90^\circ$.

Tứ giác $AKDH$ có $\widehat{AHD}=\widehat{KDH}=\widehat{AKD}=90^\circ$ nên $\widehat{KAH}=360^\circ-3\cdot 90^\circ=90^\circ$.

Tứ giác $AKDH$ có bốn góc vuông nên $AKDH$ là hình chữ nhật (định nghĩa).

### Bài 43 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$, các đường trung tuyến $BD$ và $CE$ cắt nhau ở $G$. Gọi $H$ là trung điểm của $GB$, $K$ là trung điểm của $GC$.
a) Chứng minh rằng tứ giác $DEHK$ là hình bình hành.
b) Tam giác $ABC$ có điều kiện gì thì tứ giác $DEHK$ là hình chữ nhật?
**Hình giải:** giai_bai43.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** $G$ là trọng tâm nên $GB=2GD$ và $GC=2GE$; $H$, $K$ là trung điểm của $GB$, $GC$ nên $GH=GD$, $GK=GE$ — $G$ trở thành trung điểm của cả hai đường chéo $DH$ và $EK$.

**Bước 1.** Ý a: muốn $DEHK$ là hình bình hành, dùng dấu hiệu hai đường chéo cắt nhau tại trung điểm của mỗi đường; hai đường chéo $DH$ và $EK$ nằm trên hai trung tuyến $BD$, $CE$ nên cắt nhau tại $G$, vậy cần $G$ là trung điểm của $DH$ và của $EK$.

**Bước 2.** Ý a (tiếp): muốn $G$ là trung điểm của $DH$, dùng tính chất trọng tâm $GB=2GD$ và $GH=\dfrac{1}{2}GB$ để suy ra $GH=GD$, chú ý $G$ nằm giữa $D$ và $H$; đoạn $EK$ làm tương tự với $GC=2GE$.

**Bước 3.** Ý b: $DEHK$ đã là hình bình hành nên chỉ cần thêm một dấu hiệu, chọn hai đường chéo bằng nhau $DH=EK$; đổi sang độ dài quanh $G$: $DH=2GD=GB$ và $EK=2GE=GC$, nên cần $GB=GC$.

**Bước 4.** Ý b (tiếp): dự đoán điều kiện là tam giác $ABC$ cân tại $A$; chiều "hình chữ nhật $\Rightarrow$ $AB=AC$": từ $GB=GC$ suy ra $GD=GE$, rồi hai tam giác $GBE$ và $GCD$ bằng nhau (c.g.c) cho $BE=CD$, tức $AB=AC$.

**Bước 5.** Ý b (tiếp): chiều ngược lại "$AB=AC$ $\Rightarrow$ hình chữ nhật": hai tam giác $ABD$ và $ACE$ bằng nhau (c.g.c) cho $BD=CE$, mà $BD=3GD$, $CE=3GE$ nên $GD=GE$, rồi $GB=GC$ và $DH=EK$.

**Chú ý:** nghĩ tới $DE$, $HK$ là đường trung bình của hai tam giác sẽ giải nhanh hơn, nhưng đường trung bình học sau; dùng tính chất trọng tâm (lớp 7) thay thế. Điều kiện phải đủ cả hai chiều: "nếu $DEHK$ là hình chữ nhật thì $ABC$ cân" và "nếu $ABC$ cân thì $DEHK$ là hình chữ nhật".

**Phần 2. Trình bày**

a) Vì $BD$ và $CE$ là hai đường trung tuyến của $\triangle ABC$ cắt nhau tại $G$ nên $G$ là trọng tâm của tam giác, do đó $GB=2GD$ và $GC=2GE$.

Vì $H$ là trung điểm của $GB$ nên $GH=\dfrac{1}{2}GB=GD$.

Vì $G$ nằm giữa $B$ và $D$, $H$ nằm trên đoạn $GB$ nên $G$ nằm giữa $D$ và $H$. Do đó $G$ là trung điểm của $DH$.

Vì $K$ là trung điểm của $GC$ nên $GK=\dfrac{1}{2}GC=GE$.

Vì $G$ nằm giữa $C$ và $E$, $K$ nằm trên đoạn $GC$ nên $G$ nằm giữa $E$ và $K$. Do đó $G$ là trung điểm của $EK$.

Tứ giác $DEHK$ có hai đường chéo $DH$ và $EK$ cắt nhau tại trung điểm $G$ của mỗi đường nên $DEHK$ là hình bình hành (dấu hiệu nhận biết).

b) Trả lời: tam giác $ABC$ cân tại $A$.

Vì $DEHK$ là hình bình hành (câu a) nên $DEHK$ là hình chữ nhật khi và chỉ khi hai đường chéo $DH$ và $EK$ bằng nhau (tính chất và dấu hiệu nhận biết hình chữ nhật).

Ta có $DH=DG+GH=2GD=GB$ và $EK=EG+GK=2GE=GC$.

Chiều thuận: nếu $DEHK$ là hình chữ nhật thì $DH=EK$, suy ra $GB=GC$ và $2GD=2GE$, tức $GD=GE$.

Xét $\triangle GBE$ và $\triangle GCD$ có:

$GB=GC$ (chứng minh trên)

$GE=GD$ (chứng minh trên)

$\widehat{BGE}=\widehat{CGD}$ (hai góc đối đỉnh)

Do đó $\triangle GBE=\triangle GCD$ (c.g.c).

Suy ra $BE=CD$ (hai cạnh tương ứng).

Mà $E$, $D$ là trung điểm của $AB$, $AC$ nên $AB=2BE=2CD=AC$.

Vậy $\triangle ABC$ cân tại $A$.

Chiều đảo: nếu $\triangle ABC$ cân tại $A$ thì $AB=AC$, suy ra $AE=\dfrac{1}{2}AB=\dfrac{1}{2}AC=AD$.

Xét $\triangle ABD$ và $\triangle ACE$ có:

$AB=AC$ (giả thiết)

$\widehat{BAD}=\widehat{CAE}$ (cùng là góc $A$)

$AD=AE$ (chứng minh trên)

Do đó $\triangle ABD=\triangle ACE$ (c.g.c), suy ra $BD=CE$.

Mà $BD=GB+GD=3GD$ và $CE=GC+GE=3GE$ nên $GD=GE$.

Suy ra $GB=2GD=2GE=GC$, do đó $DH=EK$.

Hình bình hành $DEHK$ có hai đường chéo bằng nhau nên $DEHK$ là hình chữ nhật (dấu hiệu nhận biết).

Vậy $DEHK$ là hình chữ nhật khi và chỉ khi tam giác $ABC$ cân tại $A$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Cả ba bài đều là chứng minh / nhận dạng hình (kho `hinh_hoc`, `tu_luan`, `dap_an=—`); mỗi bài một hình giải vẽ bằng code, dựng đúng dữ kiện bằng toạ độ (đã kiểm số: 200–300 bộ ngẫu nhiên mỗi bài, 0 sai).
- Bài 41, Bài 43 ý a: lời giải không dùng và không cần đường trung bình — Bài 41 đi qua "bốn cạnh bằng nhau" (trung trực + trung tuyến ứng cạnh huyền), Bài 43 đi qua tính chất trọng tâm (tỉ số $\dfrac{2}{3}$, kiến thức lớp 7). Trạm soát đã bỏ cờ `Chưa chắc` về đường trung bình ở hai bài này.
- Bài 42: đề cương không đặt tên điểm $D$ (theo `Ghi chú` có sẵn). Lời giải giả thiết $D\neq H$ (nếu $D\equiv H$ thì $M,\ N,\ K$ trùng $A$, tứ giác suy biến) và nói rõ trường hợp $D$ nằm giữa $B$, $H$ làm tương tự.
- Bài 43 ý b: đáp án "tam giác $ABC$ cân tại $A$" được chứng minh đủ hai chiều (điều kiện cần và đủ); đề không cho thêm điều kiện nào khác (ví dụ không loại trừ trường hợp suy biến).
