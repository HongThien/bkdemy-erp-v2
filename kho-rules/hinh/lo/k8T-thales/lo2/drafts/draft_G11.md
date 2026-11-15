### TCHH-3.II.1 → TRUNG (TCHH-3.II.VD9)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 1@p143
**ly_do:** Đề giống hệt VD9 (BC bằng trung bình cộng AC, AB ⇒ AB+AC=2BC; I tâm đường phân giác, G trọng tâm; chứng minh IG ∥ BC), chỉ khác lời dẫn.

### TCHH-3.II.2 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 2@p144 · Đề thi HSG tỉnh An Giang 2012-2013
**sach:** Qua $M$ kẻ $MN\parallel IE$ rồi nhân một chuỗi tỉ số Thalès; cách của kho gọn hơn: viết $BK$, $ID$, $IE$ cùng theo $AB$ và $x=BI/BC$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, trung tuyến $AM$. Gọi $I$ là một điểm bất kì trên cạnh $BC$ ($I$ khác $B$, $M$, $C$). Đường thẳng qua $I$ song song với $AC$ cắt $AB$ ở $K$; đường thẳng qua $I$ song song với $AB$ cắt $AC$, $AM$ theo thứ tự ở $D$, $E$. Chứng minh rằng $DE=BK$. (Đề thi học sinh giỏi tỉnh An Giang, 2012–2013)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $x=\dfrac{BI}{BC}$. Ba đường thẳng $IK\parallel AC$, $ID\parallel AB$, $IE\parallel AB$ cho $BK$, $ID$, $IE$ đều là bội của $AB$ theo $x$. $D$, $E$ cùng nằm trên một đường thẳng qua $I$ nên $DE$ là hiệu hoặc tổng của $ID$ và $IE$, tuỳ $I$ thuộc đoạn $BM$ hay đoạn $MC$.

- n1 | - | $BK=x\cdot AB$ | gt | hệ quả của định lí Thalès cho $\triangle ABC$ với $IK\parallel AC$
- n2 | - | $ID=(1-x)\cdot AB$ | gt | hệ quả của định lí Thalès cho $\triangle ABC$ với $ID\parallel AB$
- n3 | - | $\dfrac{IE}{AB}=\dfrac{MI}{MB}$ | gt | hệ quả của định lí Thalès với $IE\parallel AB$ cắt $MB$, $MA$
- n4 | - | $DE=x\cdot AB$ khi $I$ thuộc đoạn $BM$ | n2, n3 | $E$ nằm giữa $I$ và $D$ nên $DE=ID-IE$
- n5 | - | $DE=x\cdot AB$ khi $I$ thuộc đoạn $MC$ | n2, n3 | $I$ nằm giữa $D$ và $E$ nên $DE=ID+IE$
- n6 | - | $DE=BK$ | n1, n4, n5 | cùng bằng $x\cdot AB$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $x=\dfrac{BI}{BC}$ ($0<x<1$).
Xét $\triangle ABC$ có $IK\parallel AC$ ($K\in AB$, $I\in BC$)
nên $\dfrac{BK}{BA}=\dfrac{BI}{BC}=x$ (hệ quả của định lí Thalès),
suy ra $BK=x\cdot AB$. (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $ID\parallel AB$ ($D\in AC$, $I\in BC$)
nên $\dfrac{ID}{AB}=\dfrac{CI}{CB}=1-x$ (hệ quả của định lí Thalès),
suy ra $ID=(1-x)\cdot AB$. (2)
[[so-do:n3]]
$M$ là trung điểm của $BC$ (gt) nên $MB=\dfrac{BC}{2}$.
Đường thẳng $IE\parallel AB$ cắt hai đường thẳng $MB$, $MA$ tại $I$, $E$
nên $\dfrac{IE}{AB}=\dfrac{MI}{MB}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
**Trường hợp 1: $I$ thuộc đoạn $BM$** ($x<\dfrac12$).
Khi đó $MI=BM-BI$ nên $\dfrac{MI}{MB}=1-\dfrac{BI}{BM}=1-2x$.
Từ (3): $IE=(1-2x)\cdot AB$.
$D$, $E$ cùng nằm trên một tia gốc $I$ (cùng phía $BC$ với $A$) và $IE<ID$ (vì $1-2x<1-x$)
nên $E$ nằm giữa $I$ và $D$.
Suy ra $DE=ID-IE=(1-x)AB-(1-2x)AB=x\cdot AB$. (4)
[[so-do:n5]]
**Trường hợp 2: $I$ thuộc đoạn $MC$** ($x>\dfrac12$).
Khi đó $MI=BI-BM$ nên $\dfrac{MI}{MB}=2x-1$.
Từ (3): $IE=(2x-1)\cdot AB$.
$M$ nằm giữa $B$ và $I$ nên $M$ nằm giữa $A$ và $E$ ($IE\parallel AB$),
tức $E$ khác phía $A$ đối với $BC$, còn $D$ thuộc cạnh $AC$ cùng phía với $A$.
Vậy $I$ nằm giữa $D$ và $E$, suy ra
$DE=ID+IE=(1-x)AB+(2x-1)AB=x\cdot AB$. (5)
[[so-do:n6]]
Từ (1), (4), (5): trong cả hai trường hợp $DE=x\cdot AB=BK$.
**hinh:** TCHH-3-II-2.png
**hinh_lg:** TCHH-3-II-2_lg.png
**nghi_van:** Đề sách ghi "$I$ bất kì trên cạnh $BC$"; kho thêm "khác $B$, $M$, $C$" vì các vị trí đó suy biến ($I=B$: $K=B$, $D=E=A$; $I=M$: $E\equiv I$, vẫn đúng nhưng Thalès suy biến). Lời giải sách còn ghi lẫn $IE\parallel AC$ và $N$, hình sách vẽ không khớp lời; kho đọc đề như trên và đã kiểm số.

### TCHH-3.II.3 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 3@p144 (giải p144–145) · Đề thi HSG tỉnh Kiên Giang 2012-2013
**sach:** Kẻ $AE$, $BF$ cùng song song $CD$ ($E$, $F$ thuộc $MN$), $\triangle AME=\triangle BMF$ nên $AE=BF$, rồi hai lần Thalès. Kho thay tam giác bằng nhau bằng một hệ quả Thalès cho gọn.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$. Đường thẳng đi qua trung điểm $M$ của $AB$ và trung điểm $N$ của $CD$ cắt các đường thẳng $AD$, $BC$ theo thứ tự ở $I$, $K$. Chứng minh rằng $IA\cdot KC=ID\cdot KB$. (Đề thi học sinh giỏi tỉnh Kiên Giang, 2012–2013)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $A$, $B$ kẻ hai đường thẳng song song với $CD$ cắt $MN$ tại $E$, $F$. Vì $M$ là trung điểm $AB$ nên $AE=BF$; hai lần Thalès cho $\dfrac{IA}{ID}=\dfrac{AE}{DN}$ và $\dfrac{KB}{KC}=\dfrac{BF}{CN}$, mà $DN=CN$.

- n1 | - | $AE=BF$ | gt | $AE\parallel BF$, $AB$ và $EF$ cắt nhau ở trung điểm $M$ của $AB$
- n2 | - | $\dfrac{IA}{ID}=\dfrac{AE}{DN}$ | gt | hệ quả của định lí Thalès cho $\triangle IDN$ với $AE\parallel DN$
- n3 | - | $\dfrac{KB}{KC}=\dfrac{BF}{CN}$ | gt | hệ quả của định lí Thalès cho $\triangle KCN$ với $BF\parallel CN$
- n4 | - | $\dfrac{IA}{ID}=\dfrac{KB}{KC}$ | n1, n2, n3 | $AE=BF$, $DN=CN$
- n5 | - | $IA\cdot KC=ID\cdot KB$ | n4 | nhân chéo

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $A$ kẻ đường thẳng song song với $CD$ cắt $MN$ tại $E$; qua $B$ kẻ đường thẳng song song với $CD$ cắt $MN$ tại $F$
($MN$ cắt $CD$ tại $N$ nên không song song với $CD$, do đó $E$, $F$ tồn tại).
Vì $AE\parallel CD$ và $BF\parallel CD$ nên $AE\parallel BF$.
Hai đường thẳng $AB$, $EF$ cắt nhau tại $M$ và $AE\parallel BF$
nên $\dfrac{AE}{BF}=\dfrac{MA}{MB}=1$ (hệ quả của định lí Thalès, $M$ là trung điểm $AB$).
Suy ra $AE=BF$. (1)
[[so-do:n2]]
Xét $\triangle IDN$ có $AE\parallel DN$ ($A\in ID$, $E\in IN$)
nên $\dfrac{IA}{ID}=\dfrac{AE}{DN}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Xét $\triangle KCN$ có $BF\parallel CN$ ($B\in KC$, $F\in KN$)
nên $\dfrac{KB}{KC}=\dfrac{BF}{CN}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
$N$ là trung điểm của $CD$ (gt) nên $DN=CN$.
Từ (1), (2), (3) suy ra $\dfrac{IA}{ID}=\dfrac{AE}{DN}=\dfrac{BF}{CN}=\dfrac{KB}{KC}$. (4)
[[so-do:n5]]
Từ (4) suy ra $IA\cdot KC=ID\cdot KB$.
**hinh:** TCHH-3-II-3.png
**nghi_van:** Giả sử đường thẳng $MN$ khác $AB$ (nếu không thì $I=A$, $K=B$ và đề tầm thường).

### TCHH-3.II.4 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 4@p145 · Đề thi HSG tỉnh Hậu Giang 2012-2013
**sach:** Kẻ phân giác $Oz$ cắt $AB$ ở $C$, $CD\parallel OA$; tam giác $COD$ cân, Thalès cho $\dfrac{CD}{OA}+\dfrac{CD}{OB}=1$. Giữ nguyên.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho góc $xOy$ (khác góc bẹt). Các điểm $A$, $B$ theo thứ tự chuyển động trên các tia $Ox$, $Oy$ sao cho $\dfrac1{OA}+\dfrac1{OB}=\dfrac1k$ ($k$ là độ dài không đổi cho trước). Chứng minh rằng đường thẳng $AB$ luôn đi qua một điểm cố định. (Đề thi học sinh giỏi tỉnh Hậu Giang, 2012–2013)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $C$ là giao của phân giác $Oz$ với $AB$, kẻ $CD\parallel OA$ ($D\in OB$). Tam giác $COD$ cân nên $DO=DC$; Thalès cho $CD\left(\dfrac1{OA}+\dfrac1{OB}\right)=1$, tức $CD=k$. Khi đó $D$ và $C$ được xác định chỉ bởi góc $xOy$ và $k$.

- n1 | - | $DO=DC$ | gt | $Oz$ là phân giác, $CD\parallel OA$ nên $\triangle COD$ cân tại $D$
- n2 | - | $\dfrac{CD}{OA}+\dfrac{CD}{OB}=1$ | n1 | hệ quả của định lí Thalès cho $\triangle OAB$ với $CD\parallel OA$, $BD=OB-CD$
- n3 | - | $CD=k$ | n2, gt | $\dfrac1{OA}+\dfrac1{OB}=\dfrac1k$
- n4 | - | $C$ là điểm cố định và $AB$ đi qua $C$ | n1, n3 | $D\in Oy$ với $OD=k$ cố định, $C$ là giao của $Oz$ với đường thẳng qua $D$ song song $Ox$

**Phần 2. Trình bày**

[[so-do:n1]]
Kẻ tia phân giác $Oz$ của $\widehat{xOy}$, $Oz$ cắt đoạn $AB$ tại $C$.
Qua $C$ kẻ đường thẳng song song với $OA$ cắt $OB$ tại $D$ ($D$ thuộc đoạn $OB$ vì $C$ thuộc đoạn $AB$).
Vì $CD\parallel OA$ nên $\widehat{DCO}=\widehat{COA}$ (so le trong).
Mà $\widehat{DOC}=\widehat{COA}$ ($Oz$ là tia phân giác).
Suy ra $\widehat{DCO}=\widehat{DOC}$, nên $\triangle DOC$ cân tại $D$, do đó $DO=DC$. (1)
[[so-do:n2]]
Xét $\triangle OAB$ có $CD\parallel OA$ ($C\in AB$, $D\in OB$)
nên $\dfrac{CD}{OA}=\dfrac{BD}{BO}$ (hệ quả của định lí Thalès).
Vì $D$ nằm giữa $O$ và $B$ nên $BD=OB-OD=OB-CD$ (theo (1)),
suy ra $\dfrac{CD}{OA}=\dfrac{OB-CD}{OB}=1-\dfrac{CD}{OB}$,
tức $CD\left(\dfrac1{OA}+\dfrac1{OB}\right)=1$. (2)
[[so-do:n3]]
Theo giả thiết $\dfrac1{OA}+\dfrac1{OB}=\dfrac1k$ nên từ (2) có $CD=k$. (3)
[[so-do:n4]]
Từ (1) và (3): $OD=k$, $D$ thuộc tia $Oy$, nên $D$ là một điểm cố định (chỉ phụ thuộc góc $xOy$ và $k$).
$C$ thuộc tia $Oz$ cố định và thuộc đường thẳng qua $D$ song song với $Ox$ cố định,
nên $C$ là điểm cố định (giao của hai đường thẳng đó).
Vậy đường thẳng $AB$ luôn đi qua điểm cố định $C$.
**hinh:** TCHH-3-II-4.png
**hinh_lg:** TCHH-3-II-4_lg.png
**nghi_van:**

### TCHH-3.II.5 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 5@p146 · Đề thi HSG tỉnh Bến Tre 2012-2013
**sach:** Qua $O$ kẻ song song $AB$ cắt $CM$, $DM$ ở $I$, $K$; Thalès cho tổng $=\dfrac{IK}{CD}$, rồi đổi sang $\dfrac{FO}{MQ}$ bằng khoảng cách. Kho dùng Thalès ba đường song song để ra luôn hằng số $\dfrac{OA}{AD}$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$, $AB<CD$), $O$ là giao điểm của hai đường thẳng $DA$, $CB$. Điểm $M$ di động trên đoạn $AB$ ($M$ khác $A$, $B$); gọi $G$ là giao điểm của $OA$ và $CM$, $H$ là giao điểm của $OB$ và $DM$. Chứng minh rằng khi $M$ di động trên $AB$ thì tổng $\dfrac{OG}{GD}+\dfrac{OH}{HC}$ không đổi. (Đề thi học sinh giỏi tỉnh Bến Tre, 2012–2013)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $O$ kẻ đường thẳng song song với $AB$ cắt $CM$, $DM$ tại $I$, $K$. Thalès cho $\dfrac{OG}{GD}=\dfrac{OI}{CD}$, $\dfrac{OH}{HC}=\dfrac{OK}{CD}$ nên tổng $=\dfrac{IK}{CD}$; rồi $\dfrac{IK}{CD}=\dfrac{MI}{MC}=\dfrac{OA}{AD}$ (ba đường thẳng song song) là hằng số.

- n1 | - | $\dfrac{OG}{GD}=\dfrac{OI}{CD}$ | gt | hệ quả của định lí Thalès, $OI\parallel DC$ với hai đường thẳng $OD$, $IC$ cắt nhau ở $G$
- n2 | - | $\dfrac{OH}{HC}=\dfrac{OK}{CD}$ | gt | hệ quả của định lí Thalès, $OK\parallel CD$ với hai đường thẳng $OC$, $KD$ cắt nhau ở $H$
- n3 | - | $\dfrac{OG}{GD}+\dfrac{OH}{HC}=\dfrac{IK}{CD}$ | n1, n2 | $O$ nằm giữa $I$ và $K$ nên $OI+OK=IK$
- n4 | - | $\dfrac{IK}{CD}=\dfrac{MI}{MC}$ | gt | hệ quả của định lí Thalès cho $\triangle MCD$ với $IK\parallel CD$
- n5 | - | $\dfrac{MI}{MC}=\dfrac{OA}{AD}$ | gt | định lí Thalès cho ba đường thẳng song song $IK$, $AB$, $CD$
- n6 | - | $\dfrac{OG}{GD}+\dfrac{OH}{HC}=\dfrac{OA}{AD}$ không đổi | n3, n4, n5 | $OA$, $AD$ cố định

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $O$ kẻ đường thẳng song song với $AB$, cắt $CM$, $DM$ lần lượt tại $I$, $K$.
Vì $AB\parallel CD$ nên $OI\parallel CD$ và $OK\parallel CD$.
Hai đường thẳng $OD$ và $IC$ cắt nhau tại $G$, $OI\parallel DC$
nên $\dfrac{OG}{GD}=\dfrac{OI}{CD}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Hai đường thẳng $OC$ và $KD$ cắt nhau tại $H$, $OK\parallel CD$
nên $\dfrac{OH}{HC}=\dfrac{OK}{CD}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
$M$ thuộc đoạn $AB$ nên $G$ thuộc đoạn $OA$ và $H$ thuộc đoạn $OB$, tức $G$ nằm giữa $O$ và $D$, $H$ nằm giữa $O$ và $C$.
Vì $G$ nằm giữa $O$ và $D$ nên $\overrightarrow{OI}$ ngược hướng với $\overrightarrow{DC}$;
vì $H$ nằm giữa $O$ và $C$ nên $\overrightarrow{OK}$ ngược hướng với $\overrightarrow{CD}$, tức cùng hướng với $\overrightarrow{DC}$.
Do đó $O$ nằm giữa $I$ và $K$, $OI+OK=IK$.
Cộng (1) và (2): $\dfrac{OG}{GD}+\dfrac{OH}{HC}=\dfrac{OI+OK}{CD}=\dfrac{IK}{CD}$. (3)
[[so-do:n4]]
Xét $\triangle MCD$ có $IK\parallel CD$ ($I\in MC$, $K\in MD$)
nên $\dfrac{IK}{CD}=\dfrac{MI}{MC}$ (hệ quả của định lí Thalès). (4)
[[so-do:n5]]
Ba đường thẳng song song $IK$ (qua $O$), $AB$, $CD$ chắn trên hai cát tuyến $IC$ và $OD$ các đoạn thẳng tỉ lệ:
$\dfrac{MI}{MC}=\dfrac{OA}{AD}$ (định lí Thalès). (5)
[[so-do:n6]]
Từ (3), (4), (5): $\dfrac{OG}{GD}+\dfrac{OH}{HC}=\dfrac{OA}{AD}$.
$OA$ và $AD$ là hai đoạn cố định (không phụ thuộc vị trí của $M$)
nên tổng đó không đổi khi $M$ di động trên $AB$.
**hinh:** TCHH-3-II-5.png
**nghi_van:** Đề sách cho $M$ di động trên đáy nhỏ $AB$; kho loại hai đầu mút ($M=A$ hoặc $M=B$ làm $G$ hay $H$ trùng $O$), kết quả vẫn đúng (khi $M=A$ tổng $=\dfrac{OA}{AD}$). Hằng số $\dfrac{OA}{AD}$ sách không nêu.

### TCHH-3.II.6 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 6@p146 (giải p146–147)
**sach:** Chứng minh $AE=AF$ (tam giác cân), rồi kẻ $BP\parallel AG$, $CQ\parallel AG$, $\triangle BPK=\triangle CQK$ để có $CI=BD$; bước "$CQ=BP$" của sách thiếu căn cứ. Kho làm khác: kẻ $BK\parallel AD$ ($AK=AB$), hai lần Thalès cho $NF=AM$, suy ra $AF=AC-AB$.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $AB<AC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Trên cạnh $AB$ lấy điểm $M$ (khác $A$, $B$), trên cạnh $AC$ lấy điểm $N$ sao cho $BM=CN$. Gọi $O$ là giao điểm của $CM$ và $BN$. Qua $O$ vẽ đường thẳng song song với $AD$, cắt đường thẳng $AB$ ở $E$ và đường thẳng $AC$ ở $F$.
**hinh:** TCHH-3-II-6.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $CF=AB$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ $BK\parallel AD$ ($K\in AC$): tam giác $ABK$ cân nên $AK=AB$. Kẻ $BP\parallel AC$ ($P\in CM$) để tính $\dfrac{BO}{ON}=\dfrac{AC}{AM}$. Trong $\triangle NBK$, đường thẳng $OF\parallel BK$ cho $NF=AM$; từ $BM=CN$ suy ra $AF=AC-AB$, tức $CF=AB$.

- n1 | - | $AK=AB$, $K$ thuộc tia đối của tia $AC$ | gt | $BK\parallel AD$, $AD$ phân giác nên $\triangle ABK$ cân tại $A$
- n2 | - | $\dfrac{BO}{ON}=\dfrac{AC}{AM}$ | gt | hai lần hệ quả của định lí Thalès với $BP\parallel AC$, $BM=CN$
- n3 | - | $\dfrac{NO}{NB}=\dfrac{NF}{NK}$ | gt | hệ quả của định lí Thalès cho $\triangle NBK$ với $OF\parallel BK$
- n4 | - | $NF=AM$ | n1, n2, n3 | $AN+AB=AM+AC$ do $BM=CN$
- n5 | - | $AF=AC-AB$, $F$ nằm giữa $A$ và $N$ | n4 | $AN-AM=AC-AB>0$
- n6 | - | $CF=AB$ | n5 | $CF=CA-AF$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $B$ kẻ đường thẳng song song với $AD$ cắt đường thẳng $AC$ tại $K$.
$AD$ chia hai điểm $B$, $C$ về hai phía mà $BK\parallel AD$ nên $K$ không thuộc tia $AC$, tức $K$ thuộc tia đối của tia $AC$.
Vì $BK\parallel AD$ nên $\widehat{AKB}=\widehat{DAC}$ (đồng vị) và $\widehat{ABK}=\widehat{BAD}$ (so le trong).
Mà $\widehat{BAD}=\widehat{DAC}$ ($AD$ là tia phân giác) nên $\widehat{ABK}=\widehat{AKB}$,
suy ra $\triangle ABK$ cân tại $A$, $AK=AB$. (1)
[[so-do:n2]]
Qua $B$ kẻ đường thẳng song song với $AC$ cắt $CM$ tại $P$.
Hai đường thẳng $AB$, $CP$ cắt nhau tại $M$ và $BP\parallel AC$
nên $\dfrac{MB}{MA}=\dfrac{BP}{AC}$ (hệ quả của định lí Thalès), suy ra $BP=\dfrac{AC\cdot MB}{MA}$.
Hai đường thẳng $BN$, $PC$ cắt nhau tại $O$ và $BP\parallel NC$
nên $\dfrac{BO}{ON}=\dfrac{BP}{NC}$ (hệ quả của định lí Thalès).
Mà $NC=BM$ (gt) nên $\dfrac{BO}{ON}=\dfrac{AC\cdot MB}{MA\cdot BM}=\dfrac{AC}{AM}$. (2)
[[so-do:n3]]
$O$ nằm giữa $B$ và $N$ (hai đoạn $BN$, $CM$ cắt nhau trong tam giác).
Từ (2): $\dfrac{NO}{NB}=\dfrac{ON}{BO+ON}=\dfrac{AM}{AC+AM}$. (3)
Xét $\triangle NBK$ có $OF\parallel BK$ ($O\in NB$, $F\in NK$)
nên $\dfrac{NF}{NK}=\dfrac{NO}{NB}$ (hệ quả của định lí Thalès). (4)
[[so-do:n4]]
Từ $BM=CN$ ta có $AB-AM=AC-AN$, nên $AN+AB=AM+AC$. (5)
Theo (1), $NK=NA+AK=AN+AB=AM+AC$.
Từ (3), (4): $NF=NK\cdot\dfrac{AM}{AC+AM}=AM$. (6)
[[so-do:n5]]
Từ (5): $AN-AM=AC-AB>0$ (vì $AB<AC$), nên $NF=AM<AN$.
Mà $F$ thuộc đoạn $NK$ (vì $O$ thuộc đoạn $NB$) nên $F$ nằm giữa $N$ và $A$.
Do đó $AF=AN-NF=AN-AM=AC-AB$. (7)
[[so-do:n6]]
$F$ thuộc đoạn $AC$ nên $CF=CA-AF=CA-(AC-AB)=AB$. (đpcm)
**hinh_lg:** TCHH-3-II-6_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $BE=CA$.
**da_biet:** Biết $F$ thuộc đoạn $AC$ và $CF=AB$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Tam giác $AEF$ cân tại $A$ (hai góc đáy bằng nửa góc $A$ vì $EF\parallel AD$), nên $AE=AF$; mà $AF=AC-AB$ nên $BE=BA+AE=AC$.

- n1 | - | $AE=AF$ | gt | $EF\parallel AD$ nên $\widehat{AEF}=\widehat{BAD}=\widehat{DAC}=\widehat{AFE}$
- n2 | - | $AF=AC-AB$ | gt | $F$ thuộc đoạn $AC$, $CF=AB$
- n3 | - | $BE=CA$ | n1, n2 | $E$ thuộc tia đối của tia $AB$ nên $BE=BA+AE$

**Phần 2. Trình bày**

[[so-do:n1]]
$F$ thuộc đoạn $AC$ và $AF=AC-CF=AC-AB>0$ nên $F\neq A$, do đó $E\neq A$.
Nếu $E$ thuộc tia $AB$ thì tia $AD$ nằm trong góc $EAF$ và cắt đoạn $EF$, trái với $EF\parallel AD$.
Vậy $E$ thuộc tia đối của tia $AB$.
Vì $EF\parallel AD$ nên $\widehat{AEF}=\widehat{BAD}$ (đồng vị) và $\widehat{AFE}=\widehat{FAD}=\widehat{DAC}$ (so le trong).
Mà $\widehat{BAD}=\widehat{DAC}$ ($AD$ là tia phân giác) nên $\widehat{AEF}=\widehat{AFE}$,
suy ra $\triangle AEF$ cân tại $A$, $AE=AF$. (1)
[[so-do:n2]]
$F$ thuộc đoạn $AC$ và $CF=AB$ (ý a) nên $AF=AC-CF=AC-AB$. (2)
[[so-do:n3]]
$E$ thuộc tia đối của tia $AB$ nên $A$ nằm giữa $B$ và $E$, do đó
$BE=BA+AE=AB+AF=AB+(AC-AB)=AC$. (đpcm)
**nghi_van:** Đề sách ghi "cắt $AC$, $AB$ tại $E$ và $F$" nhưng hình và lời giải sách dùng $E$ trên đường thẳng $AB$ (ngoài đoạn, phía $A$), $F$ trên $AC$ (vì chứng minh $CF=AB$, $BE=CA$); kho đã sửa đề cho khớp. Kho thêm "$M$ khác $A$, $B$". Cách chứng minh của kho khác sách vì bước "$CQ=BP$" của sách không có căn cứ.

### TCHH-3.II.7 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 7@p147 (giải p147–148)
**sach:** a) hai hệ quả Thalès cộng lại. b) sách dùng tam giác đồng dạng; kho giải bằng hệ quả Thalès cho $AK\parallel BD$ và $AK\parallel CD$ rồi dùng kết quả ý a.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có trung tuyến $AM$. Qua điểm $D$ thuộc cạnh $BC$ ($D$ khác $B$, $M$, $C$) vẽ đường thẳng song song với $AM$, cắt đường thẳng $AB$ ở $E$ và đường thẳng $AC$ ở $F$.
**hinh:** TCHH-3-II-7.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $DE+DF$ không đổi khi $D$ di động trên cạnh $BC$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $DE\parallel AM$ trong góc $B$ và $DF\parallel AM$ trong góc $C$ cho $DE$, $DF$ theo $AM$; cộng lại thì $BD+CD=BC=2BM$.

- n1 | - | $DE=\dfrac{BD}{BM}\cdot AM$ | gt | hệ quả của định lí Thalès với $DE\parallel AM$ cắt $BA$, $BM$
- n2 | - | $DF=\dfrac{CD}{CM}\cdot AM$ | gt | hệ quả của định lí Thalès với $DF\parallel AM$ cắt $CA$, $CM$
- n3 | - | $DE+DF=2AM$ | n1, n2 | $BM=CM$, $BD+CD=BC$

**Phần 2. Trình bày**

[[so-do:n1]]
Đường thẳng $DE\parallel AM$ cắt hai đường thẳng $BA$, $BM$ tại $E$, $D$
nên $\dfrac{DE}{AM}=\dfrac{BD}{BM}$ (hệ quả của định lí Thalès),
suy ra $DE=\dfrac{BD}{BM}\cdot AM$. (1)
[[so-do:n2]]
Đường thẳng $DF\parallel AM$ cắt hai đường thẳng $CA$, $CM$ tại $F$, $D$
nên $\dfrac{DF}{AM}=\dfrac{CD}{CM}$ (hệ quả của định lí Thalès),
suy ra $DF=\dfrac{CD}{CM}\cdot AM$. (2)
[[so-do:n3]]
$M$ là trung điểm của $BC$ nên $BM=CM=\dfrac{BC}{2}$; $D$ thuộc cạnh $BC$ nên $BD+CD=BC$.
Cộng (1) và (2): $DE+DF=\dfrac{BD+CD}{BM}\cdot AM=\dfrac{BC}{BM}\cdot AM=2AM$.
Vì $AM$ không đổi nên $DE+DF$ không đổi khi $D$ di động trên $BC$.
**hinh_lg:**
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Qua $A$ vẽ đường thẳng song song với $BC$, cắt $FE$ tại $K$. Chứng minh rằng $K$ là trung điểm của $FE$.
**da_biet:** Biết $DE=\dfrac{BD}{BM}\cdot AM$ và $DF=\dfrac{CD}{CM}\cdot AM$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $AK\parallel BD$ và $AK\parallel CD$ cho $EK$, $FK$ theo $ED$, $FD$; thay $ED$, $FD$ từ ý a ta được $EK=\dfrac{AM\cdot AK}{BM}$ và $FK=\dfrac{AM\cdot AK}{CM}$, bằng nhau vì $BM=CM$; $E$, $F$ khác phía $AK$ nên $K$ nằm giữa.

- n1 | - | $EK=\dfrac{AM\cdot AK}{BM}$ | gt | hệ quả của định lí Thalès với $AK\parallel BD$ và $DE$ ở ý a
- n2 | - | $FK=\dfrac{AM\cdot AK}{CM}$ | gt | hệ quả của định lí Thalès với $AK\parallel CD$ và $DF$ ở ý a
- n3 | - | $KE=KF$ | n1, n2 | $BM=CM$
- n4 | - | $K$ nằm giữa $E$ và $F$ | gt | $E$, $F$ ở hai phía của đường thẳng $AK$
- n5 | - | $K$ là trung điểm của $FE$ | n3, n4 | $K$ nằm giữa và $KE=KF$

**Phần 2. Trình bày**

[[so-do:n1]]
Không mất tổng quát, giả sử $D$ thuộc đoạn $BM$ (trường hợp $D$ thuộc đoạn $MC$ làm tương tự, đổi vai $B$ và $C$).
Vì $AK\parallel BC$ nên $AK\parallel BD$.
Hai đường thẳng $EB$, $ED$ cắt nhau tại $E$ ($A\in EB$, $K\in ED$) và $AK\parallel BD$
nên $\dfrac{EK}{ED}=\dfrac{AK}{BD}$ (hệ quả của định lí Thalès).
Do đó $EK=ED\cdot\dfrac{AK}{BD}=\dfrac{BD}{BM}\cdot AM\cdot\dfrac{AK}{BD}=\dfrac{AM\cdot AK}{BM}$ (ý a). (1)
[[so-do:n2]]
Hai đường thẳng $FC$, $FD$ cắt nhau tại $F$ ($A\in FC$, $K\in FD$) và $AK\parallel CD$
nên $\dfrac{FK}{FD}=\dfrac{AK}{CD}$ (hệ quả của định lí Thalès).
Do đó $FK=FD\cdot\dfrac{AK}{CD}=\dfrac{CD}{CM}\cdot AM\cdot\dfrac{AK}{CD}=\dfrac{AM\cdot AK}{CM}$ (ý a). (2)
[[so-do:n3]]
$BM=CM$ (gt) nên từ (1) và (2) suy ra $KE=KF$. (3)
[[so-do:n4]]
$D$ thuộc đoạn $BM$ nên $\dfrac{BE}{BA}=\dfrac{BD}{BM}<1$ (hệ quả của định lí Thalès), do đó $E$ thuộc đoạn $AB$ ($E\neq A$ vì $D\neq M$);
và $\dfrac{CF}{CA}=\dfrac{CD}{CM}>1$ nên $A$ nằm giữa $C$ và $F$.
$F$ và $C$ ở hai phía của $AK$ (đường thẳng $FC$ cắt $AK$ tại $A$ nằm giữa), $E$ và $B$ ở cùng phía của $AK$, mà $B$, $C$ cùng phía $AK$ (vì $AK\parallel BC$).
Vậy $E$ và $F$ ở hai phía của $AK$, nên $K$ nằm giữa $E$ và $F$. (4)
[[so-do:n5]]
Từ (3) và (4): $K$ là trung điểm của $FE$.
**hinh_lg:** TCHH-3-II-7_b_lg.png
**nghi_van:** Đề sách ghi "cắt $AB$, $AC$ tại $E$, $F$"; theo hình sách $F$ nằm ngoài đoạn $AC$ (phía $A$) nên kho ghi "đường thẳng". Kho thêm "$D$ khác $B$, $M$, $C$" (các vị trí đó suy biến).

### TCHH-3.II.8 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 8@p148 · Đề thi HSG huyện Thạch Hà 2003-2004
**noi_dung:** Cho hình thoi $ABCD$ cạnh $a$ có $\widehat{A}=60^\circ$, một đường thẳng bất kì qua $C$ cắt các tia đối của các tia $BA$, $DA$ tại $M$, $N$. a) Chứng minh rằng tích $BM\cdot DN$ có giá trị không đổi. b) Gọi $K$ là giao điểm của $BN$ và $DM$. Tính số đo của góc $BKD$. (Đề thi HSG huyện Thạch Hà, năm 2003–2004)
**ly_do:** Ý a làm được bằng Thalès ($BM\cdot DN=a^2$) nhưng ý b ($\widehat{BKD}=120^\circ$) cần $\triangle MBD\backsim\triangle BDN$ (c.g.c từ $\dfrac{MB}{BD}=\dfrac{BD}{DN}$); không có cách Thalès hay tam giác bằng nhau gọn, nên cả bài để lô Đồng dạng.

### TCHH-3.II.9 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 9@p149 (giải p149–150)
**sach:** a), b) Thalès; c) sách dùng hai cặp tam giác vuông đồng dạng. Kho thay c) bằng Pythagore cho hai tam giác vuông $AEC$, $BEC$ (và $AFC$, $DFC$).
**loai:** nhieu_y
**loi_dan:**
Cho hình bình hành $ABCD$ có đường chéo lớn $AC$ ($AC>BD$). Tia $Dx$ cắt đường chéo $AC$ ở $I$, cắt cạnh $BC$ ở $M$ ($M$ khác $B$, $C$) và cắt đường thẳng $AB$ ở $N$. Gọi $K$ là điểm đối xứng với $D$ qua $I$. Vẽ $CE$ vuông góc với đường thẳng $AB$ ($E\in AB$), $CF$ vuông góc với đường thẳng $AD$ ($F\in AD$).
**hinh:** TCHH-3-II-9.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $IM\cdot IN=ID^2$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $AD\parallel CM$ và $CD\parallel AN$ cho hai tỉ số cùng bằng $\dfrac{IC}{IA}$; ghép lại được $\dfrac{IM}{ID}=\dfrac{ID}{IN}$.

- n1 | - | $\dfrac{IM}{ID}=\dfrac{IC}{IA}$ | gt | hệ quả của định lí Thalès với $AD\parallel CM$
- n2 | - | $\dfrac{IC}{IA}=\dfrac{ID}{IN}$ | gt | hệ quả của định lí Thalès với $CD\parallel AN$
- n3 | - | $IM\cdot IN=ID^2$ | n1, n2 | nhân chéo

**Phần 2. Trình bày**

[[so-do:n1]]
$ABCD$ là hình bình hành nên $AD\parallel BC$, tức $AD\parallel CM$.
Hai đường thẳng $DM$, $AC$ cắt nhau tại $I$ và $AD\parallel CM$
nên $\dfrac{IM}{ID}=\dfrac{IC}{IA}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
$CD\parallel AB$ nên $CD\parallel AN$.
Hai đường thẳng $DN$, $AC$ cắt nhau tại $I$ và $CD\parallel AN$
nên $\dfrac{IC}{IA}=\dfrac{ID}{IN}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{IM}{ID}=\dfrac{ID}{IN}$, hay $IM\cdot IN=ID^2$.
**hinh_lg:**
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{KM}{KN}=\dfrac{DM}{DN}$.
**da_biet:** Biết $IM\cdot IN=ID^2$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Vế phải: $CD\parallel BN$ cho $\dfrac{DM}{DN}=\dfrac{CM}{CB}$. Vế trái: từ $IK^2=IM\cdot IN$ (vì $IK=ID$) suy ra $\dfrac{KM}{KN}=\dfrac{IM}{IK}=\dfrac{IM}{ID}$, mà $\dfrac{IM}{ID}=\dfrac{CM}{AD}=\dfrac{CM}{CB}$.

- n1 | - | $\dfrac{DM}{DN}=\dfrac{CM}{CB}$ | gt | hệ quả của định lí Thalès với $CD\parallel BN$
- n2 | - | $\dfrac{KM}{KN}=\dfrac{IM}{ID}$ | gt | $IK=ID$ và $IK^2=IM\cdot IN$ (ý a), tính chất tỉ lệ thức
- n3 | - | $\dfrac{IM}{ID}=\dfrac{CM}{CB}$ | gt | hệ quả của định lí Thalès với $AD\parallel CM$, $AD=CB$
- n4 | - | $\dfrac{KM}{KN}=\dfrac{DM}{DN}$ | n1, n2, n3 | cùng bằng $\dfrac{CM}{CB}$

**Phần 2. Trình bày**

[[so-do:n1]]
Hai đường thẳng $DN$, $CB$ cắt nhau tại $M$ và $CD\parallel BN$
nên $\dfrac{DM}{MN}=\dfrac{CM}{MB}$ (hệ quả của định lí Thalès).
$M$ nằm giữa $D$, $N$ và giữa $C$, $B$ nên $\dfrac{DM}{DM+MN}=\dfrac{CM}{CM+MB}$, tức $\dfrac{DM}{DN}=\dfrac{CM}{CB}$. (1)
[[so-do:n2]]
Các điểm $D$, $I$, $M$, $N$ nằm trên tia $Dx$ theo thứ tự đó, và từ $IM\cdot IN=ID^2$ ta có $IM<ID<IN$.
$K$ đối xứng với $D$ qua $I$ nên $IK=ID$ và $K$ thuộc tia $IM$; do đó $IM<IK<IN$,
$M$, $K$, $N$ theo thứ tự đó, $KM=IK-IM$, $KN=IN-IK$.
Từ $IM\cdot IN=ID^2=IK^2$ suy ra $\dfrac{IK}{IM}=\dfrac{IN}{IK}$,
nên $\dfrac{IK-IM}{IM}=\dfrac{IN-IK}{IK}$, tức $\dfrac{KM}{IM}=\dfrac{KN}{IK}$.
Suy ra $\dfrac{KM}{KN}=\dfrac{IM}{IK}=\dfrac{IM}{ID}$. (2)
[[so-do:n3]]
Theo (1) ở ý a, $\dfrac{IM}{ID}=\dfrac{CM}{AD}$ ($AD\parallel CM$, hệ quả của định lí Thalès), mà $AD=CB$ (hình bình hành)
nên $\dfrac{IM}{ID}=\dfrac{CM}{CB}$. (3)
[[so-do:n4]]
Từ (1), (2), (3): $\dfrac{KM}{KN}=\dfrac{CM}{CB}=\dfrac{DM}{DN}$.
**hinh_lg:**
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $AB\cdot AE+AD\cdot AF=AC^2$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Tính $AB\cdot AE$ bằng Pythagore cho hai tam giác vuông $AEC$ và $BEC$ chung cạnh $CE$ (với $E$ nằm ngoài đoạn $AB$, phía $B$); tương tự $AD\cdot AF$; cộng hai kết quả.

- n1 | - | $AB\cdot AE=\dfrac{AC^2-BC^2+AB^2}{2}$ | gt | Pythagore cho $\triangle AEC$, $\triangle BEC$ với $AE=AB+BE$
- n2 | - | $AD\cdot AF=\dfrac{AC^2-CD^2+AD^2}{2}$ | n1 | tương tự với $\triangle AFC$, $\triangle DFC$
- n3 | - | $AB\cdot AE+AD\cdot AF=AC^2$ | n1, n2 | $BC=AD$, $CD=AB$

**Phần 2. Trình bày**

[[so-do:n1]]
Hai tam giác $ABC$ và $BAD$ có $AB$ chung, $BC=AD$ và $AC>BD$ nên $\widehat{ABC}>\widehat{BAD}$.
Mà $\widehat{ABC}+\widehat{BAD}=180^\circ$ ($AD\parallel BC$) nên $\widehat{ABC}>90^\circ$.
$\triangle CEB$ vuông tại $E$ nên $\widehat{CBE}$ nhọn; do $\widehat{ABC}$ tù nên $E$ không thuộc tia $BA$, tức $E$ nằm ngoài đoạn $AB$ về phía $B$. Vậy $AE=AB+BE$.
Áp dụng định lí Pythagore: $AC^2=AE^2+CE^2$ và $BC^2=BE^2+CE^2$ (hai tam giác vuông tại $E$).
Suy ra $AC^2-BC^2=AE^2-BE^2=(AE-BE)(AE+BE)=AB\,(2AE-AB)$,
nên $AB\cdot AE=\dfrac{AC^2-BC^2+AB^2}{2}$. (1)
[[so-do:n2]]
$\widehat{ADC}=\widehat{ABC}>90^\circ$ (hình bình hành), lập luận tương tự: $F$ nằm ngoài đoạn $AD$ về phía $D$, $AF=AD+DF$.
Áp dụng định lí Pythagore: $AC^2=AF^2+CF^2$ và $CD^2=DF^2+CF^2$,
suy ra $AC^2-CD^2=AF^2-DF^2=AD\,(2AF-AD)$,
nên $AD\cdot AF=\dfrac{AC^2-CD^2+AD^2}{2}$. (2)
[[so-do:n3]]
Cộng (1) và (2), với $BC=AD$ và $CD=AB$:
$AB\cdot AE+AD\cdot AF=\dfrac{2AC^2-BC^2-CD^2+AB^2+AD^2}{2}=\dfrac{2AC^2}{2}=AC^2$.
**hinh_lg:**
**nghi_van:** Đề sách ghi "tia $Dx$ cắt $SC$, $AB$, $BC$ lần lượt tại $I$, $M$, $N$" (in lỗi); hình và lời giải sách (dùng $AD\parallel CM$, $CD\parallel AN$) cho thứ tự đúng là $AC$, $BC$, $AB$ tại $I$, $M$, $N$ — kho sửa. Kho bỏ điểm $G$ ($BG\perp AC$) vì lời giải của kho không dùng; thêm "$M$ khác $B$, $C$", và nêu rõ $M$ thuộc cạnh $BC$ để thứ tự $D$, $I$, $M$, $N$ đúng.
