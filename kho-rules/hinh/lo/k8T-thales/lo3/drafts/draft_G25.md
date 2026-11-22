### TCHH-4.8 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 8@p184 (giải p184–185)
**sach:** Sách gọi $D$, $J$, $G$, $E$ là hình chiếu của $H$ rồi lập các cặp tam giác có cạnh tương ứng song song và so sánh tỉ số ($HDJ$ với $CPK$, $HDE$ với $OPK$) để suy ra $DJ\parallel PK$, $DE\parallel PK$. Kho thay phần đó bằng định lí Thalès và Thalès đảo (cùng các tỉ số $\dfrac{BH}{BC}$, $\dfrac{AH}{AO}$), không đồng dạng.
**cong_cu:** Thalès · Thalès đảo · hai đường thẳng cùng vuông góc với một đường thì song song
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác nhọn $ABC$ có các đường cao $AH$, $BK$, $CP$. Gọi $D$, $E$ lần lượt là hình chiếu vuông góc của $H$ trên $AB$, $AC$; gọi $J$, $G$ lần lượt là hình chiếu vuông góc của $H$ trên $BK$, $CP$. Chứng minh rằng bốn điểm $D$, $J$, $G$, $E$ thẳng hàng.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Chứng minh $DJ\parallel PK$ và $DE\parallel PK$ nên $D$, $J$, $E$ thẳng hàng, rồi đổi vai $B\leftrightarrow C$ để có $E$, $G$, $D$ thẳng hàng. Các đường song song đều đến từ "cùng vuông góc với một đường" ($HD\parallel CP$, $HJ\parallel CK$, $HD\parallel OP$, $HE\parallel OK$ với $O$ là trực tâm); mỗi cặp cho một tỉ số Thalès, hai tỉ số bằng nhau thì dùng Thalès đảo.

- n1 | - | $\dfrac{BD}{BP}=\dfrac{BJ}{BK}$ | gt | $HD\parallel CP$, $HJ\parallel CK$; định lí Thalès trong $\triangle BCP$, $\triangle BCK$ cùng cho $\dfrac{BH}{BC}$
- n2 | - | $DJ\parallel PK$ | n1 | định lí Thalès đảo cho $\triangle BPK$
- n3 | - | $\dfrac{AD}{AP}=\dfrac{AE}{AK}$ | gt | $HD\parallel OP$, $HE\parallel OK$; định lí Thalès trong $\triangle AOP$, $\triangle AOK$ cùng cho $\dfrac{AH}{AO}$
- n4 | - | $DE\parallel PK$ | n3 | định lí Thalès đảo cho $\triangle APK$
- n5 | - | $D$, $J$, $E$ thẳng hàng | n2, n4 | qua $D$ chỉ kẻ được một đường thẳng song song với $PK$
- n6 | - | $\dfrac{CG}{CP}=\dfrac{CE}{CK}$ | gt | $HG\parallel BP$, $HE\parallel BK$; định lí Thalès trong $\triangle CBP$, $\triangle CBK$ cùng cho $\dfrac{CH}{CB}$
- n7 | - | $GE\parallel PK$ | n6 | định lí Thalès đảo cho $\triangle CPK$
- n8 | - | $E$, $G$, $D$ thẳng hàng | n4, n7 | qua $E$ chỉ kẻ được một đường thẳng song song với $PK$
- n9 | - | $D$, $J$, $G$, $E$ thẳng hàng | n5, n8 | cùng thuộc đường thẳng $DE$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $HD\perp AB$ và $CP\perp AB$ (gt)
nên $HD\parallel CP$.
Xét $\triangle BCP$ có $H\in BC$, $D\in BP$ và $HD\parallel CP$
nên $\dfrac{BD}{BP}=\dfrac{BH}{BC}$ (định lí Thalès). (1)
Vì $HJ\perp BK$ (gt) và $CK\perp BK$ ($BK\perp AC$, $K\in AC$)
nên $HJ\parallel CK$.
Xét $\triangle BCK$ có $H\in BC$, $J\in BK$ và $HJ\parallel CK$
nên $\dfrac{BJ}{BK}=\dfrac{BH}{BC}$ (định lí Thalès). (2)
Từ (1) và (2) suy ra $\dfrac{BD}{BP}=\dfrac{BJ}{BK}$. (3)
[[so-do:n2]]
Xét $\triangle BPK$ có $D\in BP$, $J\in BK$ và $\dfrac{BD}{BP}=\dfrac{BJ}{BK}$ (3)
nên $DJ\parallel PK$ (định lí Thalès đảo).
[[so-do:n3]]
Gọi $O$ là giao điểm của $BK$ và $CP$,
thì $O$ thuộc $AH$ (ba đường cao của tam giác đồng quy).
Vì $HD\perp AB$ (gt) và $OP\perp AB$ ($O\in CP$)
nên $HD\parallel OP$.
Xét $\triangle AOP$ có $H$ thuộc tia $AO$, $D$ thuộc đường thẳng $AP$ và $HD\parallel OP$
nên $\dfrac{AD}{AP}=\dfrac{AH}{AO}$ (định lí Thalès). (4)
Vì $HE\perp AC$ (gt) và $OK\perp AC$ ($O\in BK$)
nên $HE\parallel OK$.
Xét $\triangle AOK$ có $H$ thuộc tia $AO$, $E$ thuộc đường thẳng $AK$ và $HE\parallel OK$
nên $\dfrac{AE}{AK}=\dfrac{AH}{AO}$ (định lí Thalès). (5)
Từ (4) và (5) suy ra $\dfrac{AD}{AP}=\dfrac{AE}{AK}$. (6)
[[so-do:n4]]
Vì $H$ và $O$ nằm cùng phía đối với $A$ (cùng thuộc tia $AH$)
nên $D$, $P$ nằm cùng phía đối với $A$ và $E$, $K$ nằm cùng phía đối với $A$.
Xét $\triangle APK$ có $D\in$ tia $AP$, $E\in$ tia $AK$ và $\dfrac{AD}{AP}=\dfrac{AE}{AK}$ (6)
nên $DE\parallel PK$ (định lí Thalès đảo).
[[so-do:n5]]
Qua $D$ có $DJ\parallel PK$ (cmt) và $DE\parallel PK$ (cmt),
mà qua một điểm chỉ kẻ được một đường thẳng song song với $PK$
nên hai đường thẳng $DJ$, $DE$ trùng nhau.
Vậy $D$, $J$, $E$ thẳng hàng.
[[so-do:n6]]
Đổi vai $B$ và $C$ (khi đó $K\leftrightarrow P$, $D\leftrightarrow E$, $J\leftrightarrow G$).
Vì $HG\perp CP$ (gt) và $BP\perp CP$ ($CP\perp AB$, $P\in AB$)
nên $HG\parallel BP$.
Xét $\triangle CBP$ có $H\in CB$, $G\in CP$ và $HG\parallel BP$
nên $\dfrac{CG}{CP}=\dfrac{CH}{CB}$ (định lí Thalès). (7)
Vì $HE\parallel BK$ ($HE\perp AC$, $BK\perp AC$)
nên xét $\triangle CBK$ có $H\in CB$, $E\in CK$ và $HE\parallel BK$
suy ra $\dfrac{CE}{CK}=\dfrac{CH}{CB}$ (định lí Thalès). (8)
Từ (7) và (8) suy ra $\dfrac{CG}{CP}=\dfrac{CE}{CK}$. (9)
[[so-do:n7]]
Xét $\triangle CPK$ có $G\in CP$, $E\in CK$ và $\dfrac{CG}{CP}=\dfrac{CE}{CK}$ (9)
nên $GE\parallel PK$ (định lí Thalès đảo).
[[so-do:n8]]
Qua $E$ có $ED\parallel PK$ (cmt) và $EG\parallel PK$ (cmt)
nên hai đường thẳng $ED$, $EG$ trùng nhau.
Vậy $E$, $G$, $D$ thẳng hàng.
[[so-do:n9]]
Vì $D$, $J$, $E$ thẳng hàng (cmt) và $E$, $G$, $D$ thẳng hàng (cmt)
nên $J$ và $G$ cùng thuộc đường thẳng $DE$.
Vậy bốn điểm $D$, $J$, $G$, $E$ thẳng hàng.
**hinh:** TCHH-4-8.png
**hinh_lg:** TCHH-4-8_lg.png
**nghi_van:** Đề sách ghi "tam giác $ABC$" (hình trong sách là tam giác nhọn); kho thêm "nhọn" để $H$, $K$, $P$ nằm trong các cạnh và $O$ nằm trong tam giác, khi đó các vị trí điểm trong lời giải (cùng phía đối với $A$…) đúng. Sách dùng đồng dạng; lời giải kho đổi hẳn sang Thalès (đã kiểm toạ độ 6 bộ tam giác nhọn lệch).

### TCHH-4.9 → KHAC (HH00093)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 9@p185 (giải p185–186)
**noi_dung:**
Cho hình vuông $EFGH$. Từ $E$ vẽ góc vuông $xEy$ sao cho tia $Ex$ cắt các đường thẳng $FG$, $HG$ theo thứ tự tại $M$, $N$, còn tia $Ey$ cắt hai đường thẳng đó theo thứ tự tại $P$, $Q$. Hai đường thẳng $QM$ và $NP$ cắt nhau tại $R$. Gọi $I$, $K$ theo thứ tự là trung điểm của $PN$, $QM$. Chứng minh rằng bốn điểm $F$, $H$, $I$, $K$ thẳng hàng.
**ly_do:** Lời giải sách chỉ dùng hình vuông và tam giác bằng nhau / tam giác vuông: $\triangle EFM=\triangle EHQ$ (cạnh góc vuông – góc nhọn) nên $EM=EQ$, tương tự $EN=EP$; đường trung tuyến ứng cạnh huyền cho $KE=KG=\dfrac12QM$, $IE=IG=\dfrac12NP$; do đó $IK$ và $HF$ cùng là đường trung trực của $EG$. Không dùng Thalès, đường trung bình hay công cụ chuyên đề này (kiểm số: 8 bộ góc $xEy$, đạt).

### TCHH-4.10 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 10@p186 (giải p186)
**sach:** Gọi $K=MC\cap DI$; Mê-nê-la-uýt cho $\triangle MCN$ (cát tuyến $D$, $K$, $I$), nhân với $\dfrac{PC}{PB}\cdot\dfrac{AB}{AM}$ để được $1$, rồi Mê-nê-la-uýt đảo kết luận $A$, $P$, $K$ thẳng hàng. Kho giữ cách này; đổi chỗ hai đẳng thức $IM=PB$, $IN=PC$ (sách ghi ngược tên điểm), thêm các chỗ còn thiếu (các hình bình hành, vị trí các điểm trong / ngoài cạnh).
**cong_cu:** Mê-nê-la-uýt · Mê-nê-la-uýt đảo · hình bình hành
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình bình hành $ABCD$ và điểm $I$ nằm bên trong hình bình hành. Qua $I$ kẻ $MN\parallel BC$ ($M\in AB$, $N\in DC$) và $PQ\parallel AB$ ($P\in BC$, $Q\in AD$). Chứng minh rằng ba đường thẳng $MC$, $AP$, $DI$ đồng quy.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $K$ là giao điểm của $MC$ và $DI$, rồi chứng minh $A$, $P$, $K$ thẳng hàng. Mê-nê-la-uýt cho $\triangle MCN$ với cát tuyến $DKI$ cho $\dfrac{KM}{KC}$; các hình bình hành $MBPI$, $IPCN$, $MBCN$ đổi $\dfrac{IN}{IM}$, $\dfrac{DC}{DN}$ về $\dfrac{PC}{PB}$, $\dfrac{AB}{AM}$; tích ba tỉ số trong $\triangle MBC$ bằng $1$ nên dùng Mê-nê-la-uýt đảo.

- n1 | - | $IM=BP$, $IN=PC$, $AM=DN$ | gt | các hình bình hành $MBPI$, $IPCN$, $MBCN$ và $AB=DC$
- n2 | - | $\dfrac{KM}{KC}\cdot\dfrac{DC}{DN}\cdot\dfrac{IN}{IM}=1$ | gt | định lí Mê-nê-la-uýt cho $\triangle MCN$ với cát tuyến $DKI$
- n3 | - | $\dfrac{KM}{KC}\cdot\dfrac{AB}{AM}\cdot\dfrac{PC}{PB}=1$ | n1, n2 | thay $IM=BP$, $IN=PC$, $DC=AB$, $DN=AM$
- n4 | - | $A$, $P$, $K$ thẳng hàng | n3 | định lí Mê-nê-la-uýt đảo cho $\triangle MBC$
- n5 | - | $MC$, $AP$, $DI$ đồng quy | n4 | cùng đi qua $K$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $MN\parallel BC$ (gt) và $MB\parallel NC$ ($AB\parallel CD$)
nên $MBCN$ là hình bình hành,
suy ra $MB=NC$.
Vì $PQ\parallel AB$ (gt) nên $IP\parallel MB$.
Vì $MN\parallel BC$ (gt) nên $IM\parallel BP$.
Do đó $MBPI$ là hình bình hành,
suy ra $IM=BP$.
Vì $IP\parallel NC$ ($PQ\parallel AB\parallel CD$) và $IN\parallel PC$ ($MN\parallel BC$)
nên $IPCN$ là hình bình hành,
suy ra $IN=PC$.
Vì $I$ nằm bên trong hình bình hành nên $M$ nằm giữa $A$, $B$ và $N$ nằm giữa $D$, $C$.
Mà $AB=DC$ (hình bình hành $ABCD$) và $MB=NC$ (cmt)
nên $AM=AB-MB=DC-NC=DN$.
[[so-do:n2]]
Nếu $DI\parallel MC$ thì theo định lí Thalès (dạng đồng hồ cát tại $N$, $N$ nằm giữa $D$ và $C$)
$I$ phải nằm trên tia đối của tia $NM$,
trái với $I$ thuộc đoạn $MN$.
Vậy $DI$ cắt $MC$, gọi giao điểm là $K$.
Đường thẳng $DI$ không đi qua $M$, $C$, $N$ (vì $I$ nằm bên trong hình bình hành).
Xét $\triangle MCN$ với cát tuyến $DKI$ ($D\in CN$, $K\in MC$, $I\in NM$)
nên $\dfrac{KM}{KC}\cdot\dfrac{DC}{DN}\cdot\dfrac{IN}{IM}=1$ (định lí Mê-nê-la-uýt). (1)
Trong ba điểm $D$, $K$, $I$: $D$ nằm ngoài đoạn $CN$ ($N$ nằm giữa $D$ và $C$), $I$ nằm trong đoạn $MN$,
mà số điểm nằm ngoài cạnh là số lẻ
nên $K$ nằm trong đoạn $MC$.
[[so-do:n3]]
Thay $IM=BP$, $IN=PC$, $DC=AB$, $DN=AM$ (cmt) vào (1):
$\dfrac{KM}{KC}\cdot\dfrac{AB}{AM}\cdot\dfrac{PC}{PB}=1$,
nên $\dfrac{PB}{PC}\cdot\dfrac{KC}{KM}\cdot\dfrac{AM}{AB}=1$. (2)
[[so-do:n4]]
Xét $\triangle MBC$ có $P\in BC$, $K\in CM$, $A\in MB$.
$P$ nằm trong đoạn $BC$, $K$ nằm trong đoạn $CM$ (cmt),
$A$ nằm ngoài đoạn $MB$ ($M$ nằm giữa $A$ và $B$)
nên có đúng một điểm nằm ngoài cạnh.
Mà $\dfrac{PB}{PC}\cdot\dfrac{KC}{KM}\cdot\dfrac{AM}{AB}=1$ (2)
nên $A$, $P$, $K$ thẳng hàng (định lí Mê-nê-la-uýt đảo).
[[so-do:n5]]
Vì $A$, $P$, $K$ thẳng hàng nên $K$ thuộc $AP$.
Mà $K$ thuộc $MC$ và $DI$ (cách gọi $K$)
nên ba đường thẳng $MC$, $AP$, $DI$ cùng đi qua $K$.
Vậy $MC$, $AP$, $DI$ đồng quy.
**hinh:** TCHH-4-10.png
**hinh_lg:** TCHH-4-10_lg.png
**nghi_van:** Sách viết "$IM=PC$, $PB=IN$" nhưng theo hình và hình bình hành đúng là $IM=PB$, $IN=PC$ (đã kiểm toạ độ, 8 bộ); lời giải kho dùng bản đúng. Sách viết "$M\subset AB$" nhưng ý là $M\in AB$.

### TCHH-4.11 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 11@p187
**sach:** Tiếp điểm của đường tròn nội tiếp cho $AE=AF$, $BF=BD$, $CD=CE$ nên tích ba tỉ số Xê-va bằng $1$, rồi định lí Xê-va (đảo). Kho giữ nguyên hướng này.
**cong_cu:** Xê-va đảo · tính chất hai tiếp tuyến cắt nhau, đường tròn nội tiếp (lớp 9)
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có đường tròn nội tiếp tiếp xúc với các cạnh $BC$, $CA$, $AB$ lần lượt tại $D$, $E$, $F$. Chứng minh rằng ba đường thẳng $AD$, $BE$, $CF$ đồng quy.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai tiếp tuyến kẻ từ một điểm đến đường tròn thì bằng nhau (kiến thức lớp 9, sách dùng): $AE=AF$, $BF=BD$, $CD=CE$. Thay vào tích ba tỉ số của định lí Xê-va thì các đoạn bằng nhau triệt tiêu, tích bằng $1$; kết luận bằng định lí Xê-va đảo.

- n1 | - | $AE=AF$, $BF=BD$, $CD=CE$ | gt | tính chất hai tiếp tuyến cắt nhau (lớp 9)
- n2 | - | $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ | n1 | thay các đoạn bằng nhau rồi rút gọn
- n3 | - | $AD$, $BE$, $CF$ đồng quy | n2, gt | định lí Xê-va đảo cho $\triangle ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $AE$, $AF$ là hai tiếp tuyến kẻ từ $A$ đến đường tròn nội tiếp (gt)
nên $AE=AF$ (tính chất hai tiếp tuyến cắt nhau).
Tương tự $BF=BD$ và $CD=CE$.
[[so-do:n2]]
Do đó $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=\dfrac{FB}{EC}\cdot\dfrac{EC}{EA}\cdot\dfrac{EA}{FB}=1$.
[[so-do:n3]]
Vì đường tròn nội tiếp tiếp xúc với các cạnh $BC$, $CA$, $AB$ (gt)
nên $D$, $E$, $F$ nằm trên các cạnh $BC$, $CA$, $AB$ và khác các đỉnh.
Xét $\triangle ABC$ có $D\in BC$, $E\in CA$, $F\in AB$
và $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ (cmt)
nên $AD$, $BE$, $CF$ đồng quy (định lí Xê-va đảo).
**hinh:** TCHH-4-11.png
**hinh_lg:** TCHH-4-11_lg.png
**nghi_van:** Bài dùng đường tròn nội tiếp và tính chất hai tiếp tuyến (kiến thức lớp 9, sách tự ghi) nên đánh dấu `lớp 9` theo [8T-9]. Đề sách có thêm chú thích "điểm này có tên là điểm Gergonne", kho bỏ khỏi đề (không cần để giải).

### TCHH-4.12 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 12@p187 (giải p187–188)
**noi_dung:**
Cho hình bình hành $ABCD$. Gọi $P$, $Q$ lần lượt là hình chiếu vuông góc của $C$ trên $AB$, $AD$. Gọi $M$ là giao điểm của $PQ$ và $BD$. Chứng minh rằng $CM\perp CA$.
**ly_do:** Lời giải sách đi qua hai cặp tam giác đồng dạng ($\triangle MQC$ với $\triangle MCP$ và $\triangle DPC$ với $\triangle BQC$, từ $MC^2=MQ\cdot MP$ và tỉ số $\dfrac{DP}{BQ}$) rồi mới dùng Mê-nê-la-uýt đảo; chưa tìm được lời giải Thalès / Mê-nê-la-uýt gọn và tự nhiên, nên để lô đồng dạng. Lưu ý đề in "hình thang $ABCD$" nhưng lời giải và hình sách đều dùng hình bình hành ($O$ là tâm hình bình hành); kiểm số: hình bình hành thì $CM\perp CA$ đúng, hình thang thường thì sai ⇒ đề đã sửa thành hình bình hành.

### TCHH-4.13 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 13@p188 (giải p188)
**sach:** Mê-nê-la-uýt cho $\triangle AIJ$ (cát tuyến $D$, $G$, $M$) được $M$ là trung điểm $IJ$, tương tự $CE$ đi qua trung điểm $IJ$ nên ba đường đồng quy; Mê-nê-la-uýt cho $\triangle ADG$ (cát tuyến $I$, $M$, $J$) được $\dfrac{MD}{MG}=3$, tương tự $\dfrac{MC}{ME}=3$, rồi Thalès đảo cho $GE\parallel CD$. Kho giữ hướng này, tách thành hai ý và viết đủ điều kiện (cát tuyến không song song cạnh, vị trí điểm trong / ngoài cạnh).
**cong_cu:** Mê-nê-la-uýt · Thalès đảo (đồng hồ cát) · tính chất trọng tâm
**loai:** nhieu_y
**loi_dan:**
Cho tứ giác lồi $ABCD$. Gọi $I$, $J$ lần lượt là trung điểm của $AD$ và $BC$; gọi $G$, $E$ lần lượt là trọng tâm của các tam giác $ABC$ và $ABD$.
**hinh:** TCHH-4-13.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng ba đường thẳng $DG$, $CE$, $IJ$ đồng quy.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $M$ là giao điểm của $DG$ và $IJ$. Mê-nê-la-uýt cho $\triangle AIJ$ với cát tuyến $DGM$ (tính chất trọng tâm cho $\dfrac{GJ}{GA}=\dfrac12$, trung điểm $I$ cho $\dfrac{DA}{DI}=2$) suy ra $M$ là trung điểm của $IJ$. Đổi vai $A\leftrightarrow B$, $D\leftrightarrow C$, $I\leftrightarrow J$, $G\leftrightarrow E$ thì $CE$ cũng đi qua trung điểm của $IJ$.

- n1 | - | $G$ nằm giữa $A$, $J$ và $\dfrac{GJ}{GA}=\dfrac12$; $\dfrac{DA}{DI}=2$ | gt | tính chất trọng tâm; $I$ là trung điểm của $AD$
- n2 | - | $DG$ cắt $IJ$ tại trung điểm $M$ của $IJ$ | n1 | định lí Mê-nê-la-uýt cho $\triangle AIJ$ với cát tuyến $DGM$
- n3 | - | $E$ nằm giữa $B$, $I$ và $\dfrac{EI}{EB}=\dfrac12$; $\dfrac{CB}{CJ}=2$ | gt | tính chất trọng tâm; $J$ là trung điểm của $BC$
- n4 | - | $CE$ cắt $IJ$ tại trung điểm của $IJ$ | n3 | định lí Mê-nê-la-uýt cho $\triangle BJI$ với cát tuyến $CEM'$
- n5 | - | $DG$, $CE$, $IJ$ đồng quy | n2, n4 | cùng đi qua trung điểm $M$ của $IJ$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $G$ là trọng tâm của $\triangle ABC$ và $J$ là trung điểm của $BC$ (gt)
nên $G$ nằm giữa $A$ và $J$, $AG=2GJ$ (tính chất trọng tâm),
suy ra $\dfrac{GJ}{GA}=\dfrac12$. (1)
Vì $I$ là trung điểm của $AD$ (gt)
nên $D$ nằm ngoài đoạn $AI$ và $\dfrac{DA}{DI}=2$. (2)
[[so-do:n2]]
Vì $ABCD$ là tứ giác lồi nên $B$, $C$ nằm cùng phía đối với $AD$,
suy ra trung điểm $J$ của $BC$ không thuộc $AD$,
nên $A$, $I$, $J$ không thẳng hàng.
Nếu $DG\parallel IJ$ thì trong $\triangle ADG$, đường thẳng $IJ$ đi qua trung điểm $I$ của $AD$ và song song $DG$
nên đi qua trung điểm của $AG$ (tính chất đường trung bình),
tức $J$ là trung điểm của $AG$, trái với (1).
Vậy $DG$ cắt $IJ$, gọi giao điểm là $M$.
Đường thẳng $DG$ không đi qua $A$, $I$, $J$ (nếu đi qua một trong ba điểm đó thì $J$ thuộc $AD$, vô lí).
Xét $\triangle AIJ$ với cát tuyến $DGM$ ($D\in AI$, $G\in JA$, $M\in IJ$)
nên $\dfrac{MI}{MJ}\cdot\dfrac{GJ}{GA}\cdot\dfrac{DA}{DI}=1$ (định lí Mê-nê-la-uýt).
Thay (1), (2): $\dfrac{MI}{MJ}\cdot\dfrac12\cdot2=1$,
suy ra $MI=MJ$.
Mà $M$ thuộc đường thẳng $IJ$
nên $M$ là trung điểm của $IJ$.
[[so-do:n3]]
Vì $E$ là trọng tâm của $\triangle ABD$ và $I$ là trung điểm của $AD$ (gt)
nên $E$ nằm giữa $B$ và $I$, $BE=2EI$ (tính chất trọng tâm),
suy ra $\dfrac{EI}{EB}=\dfrac12$. (3)
Vì $J$ là trung điểm của $BC$ (gt)
nên $\dfrac{CB}{CJ}=2$. (4)
[[so-do:n4]]
Vì $ABCD$ là tứ giác lồi nên $A$, $D$ cùng phía đối với $BC$,
suy ra $I$ không thuộc $BC$,
nên $B$, $J$, $I$ không thẳng hàng.
Nếu $CE\parallel IJ$ thì trong $\triangle BCE$, đường thẳng $IJ$ đi qua trung điểm $J$ của $BC$ và song song $CE$
nên đi qua trung điểm của $BE$ (tính chất đường trung bình),
tức $I$ là trung điểm của $BE$, trái với (3).
Vậy $CE$ cắt $IJ$, gọi giao điểm là $M'$.
Đường thẳng $CE$ không đi qua $B$, $J$, $I$ (nếu đi qua một trong ba điểm đó thì $I$ thuộc $BC$, vô lí).
Xét $\triangle BJI$ với cát tuyến $CEM'$ ($C\in BJ$, $E\in IB$, $M'\in JI$)
nên $\dfrac{M'J}{M'I}\cdot\dfrac{EI}{EB}\cdot\dfrac{CB}{CJ}=1$ (định lí Mê-nê-la-uýt).
Thay (3), (4): $\dfrac{M'J}{M'I}\cdot\dfrac12\cdot2=1$,
suy ra $M'J=M'I$,
nên $M'$ là trung điểm của $IJ$.
[[so-do:n5]]
Vì $M$ và $M'$ cùng là trung điểm của $IJ$ (cmt)
nên $M\equiv M'$.
Mà $M$ thuộc $DG$ và $IJ$, $M'$ thuộc $CE$ và $IJ$
nên $DG$, $CE$, $IJ$ cùng đi qua $M$.
Vậy $DG$, $CE$, $IJ$ đồng quy.
**hinh_lg:** TCHH-4-13_a_lg.png
**nghi_van:** Đề sách ghi "tứ giác $ABCD$" (hình trong sách là tứ giác lồi); kho thêm "lồi" để bảo đảm $J$ không thuộc $AD$ và $I$ không thuộc $BC$ (hai điều kiện để các tam giác $AIJ$, $BJI$ có thật). Phần "tương tự" của sách đã viết đủ bằng cách đổi vai $A\leftrightarrow B$, $D\leftrightarrow C$, $I\leftrightarrow J$, $G\leftrightarrow E$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $GE\parallel CD$.
**da_biet:** Biết $DG$, $CE$, $IJ$ đồng quy tại điểm $M$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $M$ thuộc cả $DG$, $CE$, $IJ$. Mê-nê-la-uýt cho $\triangle ADG$ với cát tuyến $IMJ$ cho $\dfrac{MD}{MG}=3$; Mê-nê-la-uýt cho $\triangle BCE$ với cát tuyến $JMI$ cho $\dfrac{MC}{ME}=3$. Hai tỉ số bằng nhau và $M$ nằm giữa $D$, $G$ cũng như giữa $C$, $E$ nên dùng Thalès đảo (dạng đồng hồ cát).

- n1 | - | $\dfrac{MD}{MG}=3$ và $M$ nằm giữa $D$, $G$ | gt | định lí Mê-nê-la-uýt cho $\triangle ADG$ với cát tuyến $IMJ$
- n2 | - | $\dfrac{MC}{ME}=3$ và $M$ nằm giữa $C$, $E$ | gt | định lí Mê-nê-la-uýt cho $\triangle BCE$ với cát tuyến $JMI$
- n3 | - | $GE\parallel CD$ | n1, n2 | định lí Thalès đảo (dạng đồng hồ cát) cho hai đường thẳng $DG$, $CE$ cắt nhau tại $M$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $G$ là trọng tâm của $\triangle ABC$ và $J$ là trung điểm của $BC$ (gt)
nên $G$ nằm giữa $A$ và $J$, $\dfrac{JG}{JA}=\dfrac13$ (tính chất trọng tâm).
Vì $I$ là trung điểm của $AD$ (gt)
nên $\dfrac{IA}{ID}=1$.
Vì $ABCD$ là tứ giác lồi nên $J$ không thuộc $AD$,
suy ra đường thẳng $IJ$ không đi qua $A$, $D$, $G$.
Xét $\triangle ADG$ với cát tuyến $IMJ$ ($I\in AD$, $M\in DG$, $J\in GA$)
nên $\dfrac{IA}{ID}\cdot\dfrac{MD}{MG}\cdot\dfrac{JG}{JA}=1$ (định lí Mê-nê-la-uýt).
Thay số: $1\cdot\dfrac{MD}{MG}\cdot\dfrac13=1$,
suy ra $\dfrac{MD}{MG}=3$.
Trong ba điểm $I$, $M$, $J$: $I$ nằm trong đoạn $AD$, $J$ nằm ngoài đoạn $AG$ ($G$ nằm giữa $A$ và $J$),
mà số điểm nằm ngoài cạnh là số lẻ
nên $M$ nằm trong đoạn $DG$, tức $M$ nằm giữa $D$ và $G$.
[[so-do:n2]]
Vì $E$ là trọng tâm của $\triangle ABD$ và $I$ là trung điểm của $AD$ (gt)
nên $E$ nằm giữa $B$ và $I$, $\dfrac{IE}{IB}=\dfrac13$ (tính chất trọng tâm).
Vì $J$ là trung điểm của $BC$ (gt)
nên $\dfrac{JB}{JC}=1$.
Vì $I$ không thuộc $BC$ (do $A$, $D$ cùng phía đối với $BC$)
nên đường thẳng $IJ$ không đi qua $B$, $C$, $E$.
Xét $\triangle BCE$ với cát tuyến $JMI$ ($J\in BC$, $M\in CE$, $I\in EB$)
nên $\dfrac{MC}{ME}\cdot\dfrac{IE}{IB}\cdot\dfrac{JB}{JC}=1$ (định lí Mê-nê-la-uýt).
Thay số: $\dfrac{MC}{ME}\cdot\dfrac13\cdot1=1$,
suy ra $\dfrac{MC}{ME}=3$.
Trong ba điểm $J$, $M$, $I$: $J$ nằm trong đoạn $BC$, $I$ nằm ngoài đoạn $EB$ ($E$ nằm giữa $B$ và $I$),
mà số điểm nằm ngoài cạnh là số lẻ
nên $M$ nằm trong đoạn $CE$, tức $M$ nằm giữa $C$ và $E$.
[[so-do:n3]]
Từ $\dfrac{MD}{MG}=3$ và $\dfrac{MC}{ME}=3$ (cmt)
suy ra $\dfrac{MG}{MD}=\dfrac{ME}{MC}$.
Hai đường thẳng $DG$, $CE$ cắt nhau tại $M$,
$M$ nằm giữa $D$ và $G$, giữa $C$ và $E$ (cmt)
nên theo định lí Thalès đảo (dạng đồng hồ cát): $GE\parallel DC$.
**hinh_lg:** TCHH-4-13_b_lg.png
**nghi_van:**

### TCHH-4.TL1 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 1@p188
**ly_do:** Bài tập tự luyện chỉ có đề, sách không có lời giải hay đáp số (CEO 10/10: chỉ nhập bài có lời giải). Đề: tam giác $ABC$ vuông tại $A$, $BC=2AB$, $\widehat{ABD}=\dfrac13\widehat{ABC}$, $\widehat{ACE}=\dfrac13\widehat{ACB}$, chứng minh $H$, $D$, $G$ thẳng hàng.

### TCHH-4.TL2 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 2@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (chứng minh $AD$, $BI$, $CK$ đồng quy, $AB$, $AC$ là đường trung trực của $DE$, $DF$).

### TCHH-4.TL3 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 3@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (đường thẳng Ơ-le: trực tâm, trọng tâm, tâm đường tròn ngoại tiếp thẳng hàng).

### TCHH-4.TL4 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 4@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (chứng minh $A_0$, $B_0$, $C_0$ thẳng hàng với $A_1$, $B_1$, $C_1$ là chân ba đường qua điểm $M$ trong tam giác).

### TCHH-4.TL5 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 5@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (chứng minh $DM$ là trung tuyến của $\triangle DKH$).

### TCHH-4.TL6 → TRUNG (TCHH-4.13)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 6@p189
**ly_do:** Đề giống hệt Bài 13 ví dụ minh hoạ (tứ giác $ABCD$, $I$, $J$ trung điểm $AD$, $BC$, $G$, $E$ trọng tâm $\triangle ABC$, $\triangle ABD$; chứng minh $DG$, $CE$, $IJ$ đồng quy rồi $GE\parallel CD$) — sách in lại; đã có lời giải ở TCHH-4.13, không nhập lại.

### TCHH-4.TL7 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 7@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (ba điểm thẳng hàng $A$, $B$, $C$; $AA'$, $BB'$, $CC'$ song song; chứng minh $AF$, $CD$, $BE$ đồng quy).

### TCHH-4.TL8 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 8@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (chứng minh $P_1Q$, $P_3R$, $P_2S$ đồng quy).

### TCHH-4.TL9 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 9@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (lục giác lồi, ba đường chéo chính chia lục giác thành hai phần tương đương thì đồng quy).

### TCHH-4.TL10 → KHONG_NHAP
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 III Bài tập tự luyện 10@p189
**ly_do:** Bài tập tự luyện chỉ có đề, không có lời giải hay đáp số (chứng minh $DA_0$, $EB_0$, $FC_0$ đồng quy, $I$ là tâm đường tròn nội tiếp).
