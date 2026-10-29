### TL1 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Lấy $D$, $E$, $F$ lần lượt là trung điểm của $AB$, $AC$, $BC$.
Chứng minh tứ giác $BDEF$ là hình bình hành.
**loi_giai:**
**Phần 1. Hướng dẫn**
$BDEF$ là hình bình hành
$\Uparrow$ (dấu hiệu nhận biết: các cặp cạnh đối song song)
$DE\parallel BF$ · $EF\parallel BD$
**Nhánh ①:** $DE\parallel BF$
$\Uparrow$ ($BF$ nằm trên đường thẳng $BC$)
$DE\parallel BC$
$\Uparrow$ (tính chất đường trung bình)
$DE$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$D$ là trung điểm của $AB$ ✓ (gt) · $E$ là trung điểm của $AC$ ✓ (gt)
**Nhánh ②:** $EF\parallel BD$
$\Uparrow$ ($BD$ nằm trên đường thẳng $AB$)
$EF\parallel AB$
$\Uparrow$ (tính chất đường trung bình)
$EF$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$E$ là trung điểm của $AC$ ✓ (gt) · $F$ là trung điểm của $BC$ ✓ (gt)

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$D$ là trung điểm của $AB$ (gt);
$E$ là trung điểm của $AC$ (gt)
nên $DE$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $DE\parallel BC$ (tính chất đường trung bình).
Mà $F$ thuộc $BC$ nên $DE\parallel BF$.
Xét $\triangle ABC$ có:
$E$ là trung điểm của $AC$ (gt);
$F$ là trung điểm của $BC$ (gt)
nên $EF$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $EF\parallel AB$ (tính chất đường trung bình).
Mà $D$ thuộc $AB$ nên $EF\parallel BD$.
Tứ giác $BDEF$ có $DE\parallel BF$ và $EF\parallel BD$
nên $BDEF$ là hình bình hành
(dấu hiệu nhận biết: các cặp cạnh đối song song).
Vậy tứ giác $BDEF$ là hình bình hành.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ (A trên, BC đáy), $D\in AB$, $E\in AC$, $F\in BC$ đều là trung điểm dựng bằng toạ độ (đúng giả thiết, gạch bằng nhau: $AD=DB$ một gạch, $AE=EC$ hai gạch, $BF=FC$ ba gạch); vẽ thêm $DE$, $EF$ (hai cạnh của tứ giác $BDEF$). Không vẽ $DF$. Đề tài liệu không có hình nên hình tự dựng. Không có chữ in sai. Đã verify bằng toạ độ (4 bộ): $DE\parallel BC$, $EF\parallel AB$, $BDEF$ hình bình hành. Chỉ dùng định nghĩa/tính chất đường trung bình + dấu hiệu hình bình hành (trong whitelist).
**hinh:** TL1.png

### TL2 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$. Gọi $M$, $N$, $P$, $Q$ lần lượt là trung điểm của $AB$, $BC$, $CD$, $DA$.
Chứng minh tứ giác $MNPQ$ là hình bình hành.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Kẻ thêm:** đường chéo $AC$
$MNPQ$ là hình bình hành
$\Uparrow$ (dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau)
$MN\parallel PQ$ · $MN=PQ$
$\Uparrow$ (cùng song song với $AC$; cùng bằng $\dfrac12AC$)
$MN\parallel AC$ · $MN=\dfrac12AC$ · $PQ\parallel AC$ · $PQ=\dfrac12AC$
**Nhánh ①:** $MN\parallel AC$ · $MN=\dfrac12AC$
$\Uparrow$ (tính chất đường trung bình)
$MN$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$M$ là trung điểm của $AB$ ✓ (gt) · $N$ là trung điểm của $BC$ ✓ (gt)
**Nhánh ②:** $PQ\parallel AC$ · $PQ=\dfrac12AC$
$\Uparrow$ (tính chất đường trung bình)
$PQ$ là đường trung bình của $\triangle ADC$
$\Uparrow$ (định nghĩa đường trung bình)
$Q$ là trung điểm của $AD$ ✓ (gt) · $P$ là trung điểm của $CD$ ✓ (gt)

**Phần 2. Trình bày**
Kẻ đường chéo $AC$.
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $BC$ (gt)
nên $MN$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $MN\parallel AC$ và $MN=\dfrac12AC$ (tính chất đường trung bình).
Xét $\triangle ADC$ có:
$Q$ là trung điểm của $AD$ (gt);
$P$ là trung điểm của $CD$ (gt)
nên $PQ$ là đường trung bình của $\triangle ADC$ (định nghĩa đường trung bình).
Suy ra $PQ\parallel AC$ và $PQ=\dfrac12AC$ (tính chất đường trung bình).
Do đó $MN\parallel PQ$ (cùng song song với $AC$)
và $MN=PQ$ (cùng bằng $\dfrac12AC$).
Tứ giác $MNPQ$ có $MN\parallel PQ$ và $MN=PQ$
nên $MNPQ$ là hình bình hành
(dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau).
Vậy tứ giác $MNPQ$ là hình bình hành.
**cấu hình hình / nghi vấn:**
Hình đề: tứ giác lồi $ABCD$ bất kì (không đặc biệt), $M,N,P,Q$ trung điểm dựng bằng toạ độ, gạch bằng nhau: $AM=MB$ một gạch, $BN=NC$ hai gạch, $CP=PD$ ba gạch, $DQ=QA$ dấu ×; vẽ thêm tứ giác $MNPQ$. Hình lời giải = hình đề + đường chéo $AC$ nét đứt. Lời giải đúng cho tứ giác bất kì (đã verify 4 bộ toạ độ, gồm tứ giác không lồi): $MN\parallel AC$, $MN=\frac12AC$, $PQ\parallel AC$, $PQ=\frac12AC$, $MNPQ$ hình bình hành. Dấu hiệu dùng "một cặp cạnh đối song song và bằng nhau" (chương Tứ giác, trong whitelist).
**hinh:** TL2.png
**hinh_lg:** TL2_lg.png

### TL3 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có đường trung tuyến $AM$. Gọi $I$ là trung điểm của $AM$.
Trên $AC$ lấy $E$, $F$ sao cho $AE=EF=FC$.
Chứng minh:
a) $FM$ là đường trung bình của tam giác $BEC$.
b) $IE=\dfrac14BE$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $FM$ là đường trung bình của $\triangle BEC$
$\Uparrow$ (định nghĩa đường trung bình)
$F$ là trung điểm của $EC$ · $M$ là trung điểm của $BC$ ✓ (gt)
**Nhánh ①:** $F$ là trung điểm của $EC$
$\Uparrow$ (định nghĩa trung điểm)
$F$ nằm giữa $E$, $C$ ✓ · $EF=FC$ ✓ (gt)

b) $IE=\dfrac14BE$
$\Uparrow$ (bắc cầu: $IE=\dfrac12FM$ và $FM=\dfrac12BE$)
$IE=\dfrac12FM$ · $FM=\dfrac12BE$
**Nhánh ①:** $IE=\dfrac12FM$
$\Uparrow$ (tính chất đường trung bình)
$IE$ là đường trung bình của $\triangle AFM$
$\Uparrow$ (định nghĩa đường trung bình)
$I$ là trung điểm của $AM$ ✓ (gt) · $E$ là trung điểm của $AF$
$\Uparrow$ (định nghĩa trung điểm)
$E$ nằm giữa $A$, $F$ ✓ · $AE=EF$ ✓ (gt)
**Nhánh ②:** $FM=\dfrac12BE$
$\Uparrow$ (tính chất đường trung bình)
$FM$ là đường trung bình của $\triangle BEC$ (câu a) ✓

**Phần 2. Trình bày**
a) Vì $E$, $F$ thuộc $AC$ và $AE=EF=FC$ (gt)
nên $A$, $E$, $F$, $C$ nằm theo thứ tự đó trên $AC$.
Do đó $F$ nằm giữa $E$ và $C$, mà $EF=FC$ (gt)
nên $F$ là trung điểm của $EC$ (định nghĩa trung điểm).
$M$ là trung điểm của $BC$ ($AM$ là đường trung tuyến, gt).
Xét $\triangle BEC$ có:
$F$ là trung điểm của $EC$ (cmt);
$M$ là trung điểm của $BC$ (cmt)
nên $FM$ là đường trung bình của $\triangle BEC$ (định nghĩa đường trung bình).

b) Vì $E$ nằm giữa $A$ và $F$, mà $AE=EF$ (gt)
nên $E$ là trung điểm của $AF$ (định nghĩa trung điểm).
Xét $\triangle AFM$ có:
$I$ là trung điểm của $AM$ (gt);
$E$ là trung điểm của $AF$ (cmt)
nên $IE$ là đường trung bình của $\triangle AFM$ (định nghĩa đường trung bình).
Suy ra $IE=\dfrac12FM$ (tính chất đường trung bình).
Vì $FM$ là đường trung bình của $\triangle BEC$ (câu a)
nên $FM=\dfrac12BE$ (tính chất đường trung bình).
Do đó $IE=\dfrac12\cdot\dfrac12BE=\dfrac14BE$.
Vậy $IE=\dfrac14BE$.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$, $M\in BC$ (trung điểm), $I$ trung điểm $AM$, $E,F\in AC$ chia $AC$ thành ba phần bằng nhau (thứ tự $A,E,F,C$); vẽ $AM$, $BE$, $FM$. Gạch: $AE=EF=FC$ một gạch, $BM=MC$ hai gạch, $AI=IM$ ba gạch (đều là giả thiết). Chữ in sai "FN" ở tài liệu đã sửa thành $FM$ (theo de-nguon.md). Đề giữ đúng cấu trúc tài liệu (một câu hai ý, không tách). Verify 4 bộ toạ độ: $F$ trung điểm $EC$, $FM\parallel BE$, $FM=\frac12BE$, $E$ trung điểm $AF$, $IE=\frac12FM=\frac14BE$. Nhận xét thêm (không dùng trong lời giải): $B,I,E$ thẳng hàng (đã kiểm), nên trên hình đề đường $BE$ đi qua $I$ — đúng với dựng. Lưu ý lời giải ngầm hiểu $E,F$ nằm trên cạnh $AC$ theo thứ tự $A,E,F,C$ (đã nêu trong Phần 2 a).
**hinh:** TL3.png

### TL4 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $D$, $E$ là trung điểm của $AB$, $AC$. $BE$ cắt $CD$ tại $G$.
Lấy $M$, $N$ là trung điểm của $GB$, $GC$.
Chứng minh $DMNE$ là hình bình hành.
**loi_giai:**
**Phần 1. Hướng dẫn**
$DMNE$ là hình bình hành
$\Uparrow$ (dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau)
$DE\parallel MN$ · $DE=MN$
$\Uparrow$ (cùng song song với $BC$; cùng bằng $\dfrac12BC$)
$DE\parallel BC$ · $DE=\dfrac12BC$ · $MN\parallel BC$ · $MN=\dfrac12BC$
**Nhánh ①:** $DE\parallel BC$ · $DE=\dfrac12BC$
$\Uparrow$ (tính chất đường trung bình)
$DE$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$D$ là trung điểm của $AB$ ✓ (gt) · $E$ là trung điểm của $AC$ ✓ (gt)
**Nhánh ②:** $MN\parallel BC$ · $MN=\dfrac12BC$
$\Uparrow$ (tính chất đường trung bình)
$MN$ là đường trung bình của $\triangle GBC$
$\Uparrow$ (định nghĩa đường trung bình)
$M$ là trung điểm của $GB$ ✓ (gt) · $N$ là trung điểm của $GC$ ✓ (gt)

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$D$ là trung điểm của $AB$ (gt);
$E$ là trung điểm của $AC$ (gt)
nên $DE$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $DE\parallel BC$ và $DE=\dfrac12BC$ (tính chất đường trung bình).
Xét $\triangle GBC$ có:
$M$ là trung điểm của $GB$ (gt);
$N$ là trung điểm của $GC$ (gt)
nên $MN$ là đường trung bình của $\triangle GBC$ (định nghĩa đường trung bình).
Suy ra $MN\parallel BC$ và $MN=\dfrac12BC$ (tính chất đường trung bình).
Do đó $DE\parallel MN$ (cùng song song với $BC$)
và $DE=MN$ (cùng bằng $\dfrac12BC$).
Tứ giác $DMNE$ có $DE\parallel MN$ và $DE=MN$
nên $DMNE$ là hình bình hành
(dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau).
Vậy tứ giác $DMNE$ là hình bình hành.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ không đặc biệt, $D,E$ trung điểm $AB,AC$; $G=BE\cap CD$ (trọng tâm, dựng bằng giao điểm); $M,N$ trung điểm $GB,GC$. Vẽ $BE$, $CD$, tứ giác $DMNE$ (các cạnh $DM$, $MN$, $NE$, $ED$). Gạch: $AD=DB$ một gạch, $AE=EC$ hai gạch, $GM=MB$ ba gạch, $GN=NC$ dấu ×. Không vẽ $G$ là trọng tâm bằng ký hiệu riêng. Verify 4 bộ toạ độ: $DE\parallel BC$, $DE=\frac12BC$, $MN\parallel BC$, $MN=\frac12BC$, $DMNE$ hình bình hành ($\vec{DM}=\vec{EN}$), $G\in BE,CD$. Không cần tính chất trọng tâm, chỉ dùng đường trung bình của $\triangle ABC$ và $\triangle GBC$ (whitelist).
**hinh:** TL4.png

### TL5 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $D$ là trung điểm của $AB$.
Qua $D$ kẻ đường thẳng song song với $BC$ cắt $AC$ tại $E$.
Qua $E$ kẻ đường thẳng song song với $AB$ cắt $BC$ tại $F$.
Chứng minh $DF\parallel AC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$DF\parallel AC$
$\Uparrow$ (tính chất đường trung bình)
$DF$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$D$ là trung điểm của $AB$ ✓ (gt) · $F$ là trung điểm của $BC$
**Nhánh ①:** $F$ là trung điểm của $BC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$E$ là trung điểm của $AC$ · $EF\parallel AB$ ✓ (gt)
**Nhánh ②:** $E$ là trung điểm của $AC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$D$ là trung điểm của $AB$ ✓ (gt) · $DE\parallel BC$ ✓ (gt)

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$D$ là trung điểm của $AB$ (gt);
$DE\parallel BC$ (gt)
nên $E$ là trung điểm của $AC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Xét $\triangle ABC$ có:
$E$ là trung điểm của $AC$ (cmt);
$EF\parallel AB$ (gt)
nên $F$ là trung điểm của $BC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Xét $\triangle ABC$ có:
$D$ là trung điểm của $AB$ (gt);
$F$ là trung điểm của $BC$ (cmt)
nên $DF$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $DF\parallel AC$ (tính chất đường trung bình).
Vậy $DF\parallel AC$.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ không đặc biệt, $D$ trung điểm $AB$ (gạch $AD=DB$), $E\in AC$ và $F\in BC$ dựng bằng GIAO ĐIỂM thật theo đề ($DE\parallel BC$, $EF\parallel AB$), vẽ $DE$, $EF$ và $DF$ (đoạn nêu trong kết luận); không đánh dấu $E$, $F$ là trung điểm. Verify 4 bộ toạ độ: giao điểm dựng được có $E$ trung điểm $AC$, $F$ trung điểm $BC$, $DF\parallel AC$, $DF=\frac12AC$. Chỉ dùng "chú ý" của bài (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai) và đường trung bình — trong whitelist.
**hinh:** TL5.png
