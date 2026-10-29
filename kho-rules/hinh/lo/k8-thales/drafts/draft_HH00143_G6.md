### VN1 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $B$.
Gọi $H$, $M$ lần lượt là trung điểm của $AC$ và $BC$.
a) Chứng minh $HM\parallel AB$ và $CH\cdot CB=CM\cdot CA$.
b) Lấy điểm $K$ sao cho $M$ là trung điểm của $HK$.
Chứng minh tứ giác $AHKB$ là hình bình hành.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $HM\parallel AB$ (1)
$\Uparrow$ (tính chất đường trung bình)
$HM$ là đường trung bình của $\triangle CAB$
$\Uparrow$ (định nghĩa đường trung bình)
$H$ là trung điểm của $CA$ ✓ · $M$ là trung điểm của $CB$ ✓
$CH\cdot CB=CM\cdot CA$ (2)
$\Uparrow$ (cùng bằng $\dfrac12CA\cdot CB$)
$CH=\dfrac12CA$ · $CM=\dfrac12CB$
$\Uparrow$ (tính chất trung điểm)
$H$ là trung điểm của $CA$ ✓ · $M$ là trung điểm của $CB$ ✓

b) $AHKB$ là hình bình hành
$\Uparrow$ (dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau)
$HK\parallel AB$ · $HK=AB$
**Nhánh ①:** $HK\parallel AB$
$\Uparrow$ ($H$, $M$, $K$ thẳng hàng vì $M$ là trung điểm của $HK$)
$HM\parallel AB$ (câu a) ✓
**Nhánh ②:** $HK=AB$
$\Uparrow$ (bắc cầu: cùng bằng $2HM$)
$HK=2HM$ ($M$ là trung điểm của $HK$) ✓ · $AB=2HM$
$\Uparrow$ (tính chất đường trung bình)
$HM=\dfrac12AB$ ($HM$ là đường trung bình của $\triangle CAB$, câu a) ✓

**Phần 2. Trình bày**
a) Xét $\triangle CAB$ có:
$H$ là trung điểm của $CA$ (gt);
$M$ là trung điểm của $CB$ (gt)
nên $HM$ là đường trung bình của $\triangle CAB$ (định nghĩa đường trung bình).
Do đó $HM\parallel AB$ và $HM=\dfrac12AB$ (tính chất đường trung bình).
Vì $H$ là trung điểm của $CA$ (gt)
nên $CH=\dfrac12CA$ (tính chất trung điểm).
Vì $M$ là trung điểm của $CB$ (gt)
nên $CM=\dfrac12CB$ (tính chất trung điểm).
Suy ra $CH\cdot CB=\dfrac12CA\cdot CB$.
Và $CM\cdot CA=\dfrac12CB\cdot CA=\dfrac12CA\cdot CB$.
Vậy $CH\cdot CB=CM\cdot CA$.

b) Vì $M$ là trung điểm của $HK$ (gt)
nên $H$, $M$, $K$ thẳng hàng.
Mà $HM\parallel AB$ (cmt)
nên $HK\parallel AB$.
Lại có $HK=2HM$ ($M$ là trung điểm của $HK$, gt).
Mà $HM=\dfrac12AB$ (cmt)
nên $AB=2HM$.
Suy ra $HK=AB$.
Xét tứ giác $AHKB$ có:
$HK\parallel AB$ (cmt);
$HK=AB$ (cmt).
Vậy $AHKB$ là hình bình hành
(dấu hiệu: một cặp cạnh đối song song và bằng nhau).
**cấu hình hình / nghi vấn:**
Hình đề: tam giác $ABC$ cân tại $B$ ([SOÁT] đánh dấu hai góc đáy $\widehat{A}=\widehat{C}$ bằng cung — bản đầu đánh × trên $BA$ và trên đoạn $BM$, ngụ ý sai $BM=BA$; vẽ lại bằng `ve_G6_soat.mjs`; quay 12° cho khỏi đứng thẳng), $H$ trung điểm $AC$ (1 gạch), $M$ trung điểm $BC$ (2 gạch), $K$ đối xứng $H$ qua $M$ (3 gạch cho $HM=MK$), vẽ thêm đoạn $HK$ và $BK$ (là cạnh của tứ giác $AHKB$). Không đánh dấu $AH=BK$, không đánh dấu song song (đó là điều phải chứng minh). Không cần hình lời giải riêng.
Verify (kiem_G6.mjs): hình đề + 6 bộ toạ độ ngẫu nhiên (tam giác cân tại $B$ bất kì) — kiểm $HM\parallel AB$, $HM=AB/2$, $CH\cdot CB=CM\cdot CA$, $HK\parallel AB$, $HK=AB$, $AHKB$ lồi và là hình bình hành. PASS hết.
Ghi chú: (1) giả thiết "cân tại $B$" KHÔNG dùng trong lời giải (cả hai ý đúng cho mọi tam giác); (2) hệ thức $CH\cdot CB=CM\cdot CA$ trong tài liệu gốc thường chứng minh bằng tam giác đồng dạng (cấm theo whitelist) — ở đây suy thẳng từ $CH=\frac12CA$, $CM=\frac12CB$ (tính chất trung điểm), không dùng công cụ ngoài whitelist; (3) ý b) dùng đường trung bình (HM ∥ AB, HM = AB/2) thay vì $BHCK$ hình bình hành — cả hai đều trong whitelist.
**hinh:** VN1.png

### VN2 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$ có $AB=CD$ và $AB$ không song song với $CD$.
Gọi $E$, $F$, $G$, $H$ lần lượt là trung điểm của $AC$, $BD$, $AD$, $BC$.
Chứng minh tứ giác $EGFH$ là hình thoi.
**loi_giai:**
**Phần 1. Hướng dẫn**
$EGFH$ là hình thoi
$\Uparrow$ (tứ giác có bốn cạnh bằng nhau là hình thoi)
$EG=GF=FH=HE$
$\Uparrow$ (bắc cầu: $EG=FH=\dfrac12CD$ · $GF=HE=\dfrac12AB$ · $AB=CD$)
$EG=\dfrac12CD$ · $FH=\dfrac12CD$ · $GF=\dfrac12AB$ · $HE=\dfrac12AB$ · $AB=CD$ (gt) ✓
**Nhánh ①:** $EG=\dfrac12CD$
$\Uparrow$ (tính chất đường trung bình)
$EG$ là đường trung bình của $\triangle ACD$
$\Uparrow$ (định nghĩa đường trung bình)
$E$ là trung điểm của $AC$ ✓ · $G$ là trung điểm của $AD$ ✓
**Nhánh ②:** $FH=\dfrac12CD$
$\Uparrow$ (tính chất đường trung bình)
$FH$ là đường trung bình của $\triangle BCD$
$\Uparrow$ (định nghĩa đường trung bình)
$F$ là trung điểm của $BD$ ✓ · $H$ là trung điểm của $BC$ ✓
**Nhánh ③:** $GF=\dfrac12AB$
$\Uparrow$ (tính chất đường trung bình)
$GF$ là đường trung bình của $\triangle ABD$
$\Uparrow$ (định nghĩa đường trung bình)
$G$ là trung điểm của $AD$ ✓ · $F$ là trung điểm của $BD$ ✓
**Nhánh ④:** $HE=\dfrac12AB$
$\Uparrow$ (tính chất đường trung bình)
$HE$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$H$ là trung điểm của $BC$ ✓ · $E$ là trung điểm của $AC$ ✓

**Phần 2. Trình bày**
Xét $\triangle ACD$ có:
$E$ là trung điểm của $AC$ (gt);
$G$ là trung điểm của $AD$ (gt)
nên $EG$ là đường trung bình của $\triangle ACD$ (định nghĩa đường trung bình).
Do đó $EG=\dfrac12CD$ (tính chất đường trung bình).
Xét $\triangle BCD$ có:
$F$ là trung điểm của $BD$ (gt);
$H$ là trung điểm của $BC$ (gt)
nên $FH$ là đường trung bình của $\triangle BCD$ (định nghĩa đường trung bình).
Do đó $FH=\dfrac12CD$ (tính chất đường trung bình).
Xét $\triangle ABD$ có:
$G$ là trung điểm của $AD$ (gt);
$F$ là trung điểm của $BD$ (gt)
nên $GF$ là đường trung bình của $\triangle ABD$ (định nghĩa đường trung bình).
Do đó $GF=\dfrac12AB$ (tính chất đường trung bình).
Xét $\triangle ABC$ có:
$H$ là trung điểm của $BC$ (gt);
$E$ là trung điểm của $AC$ (gt)
nên $HE$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Do đó $HE=\dfrac12AB$ (tính chất đường trung bình).
Mà $AB=CD$ (gt)
nên $\dfrac12AB=\dfrac12CD$.
Suy ra $EG=GF=FH=HE$.
Vậy $EGFH$ là hình thoi
(dấu hiệu: tứ giác có bốn cạnh bằng nhau).
**cấu hình hình / nghi vấn:**
Hình đề: tứ giác lồi $ABCD$ ($A$ trên-trái, $B$ trên-phải, $C$ dưới-phải, $D$ dưới-trái), dựng $AB=CD$ đúng độ dài, $AB$ không song song $CD$. Vẽ đường chéo $AC$, $BD$ nét đứt; $E$, $F$ trung điểm hai đường chéo, $G$, $H$ trung điểm $AD$, $BC$; vẽ tứ giác $EGFH$ nét liền. Gạch: $AB=CD$ (1 gạch), $AE=EC$ (2), $BF=FD$ (3), $AG=GD$ (×), $BH=HC$ (× kèm 1 gạch). Không đánh dấu bốn cạnh $EGFH$ bằng nhau (điều phải chứng minh).
Verify (kiem_G6.mjs): hình đề + 6 bộ toạ độ ngẫu nhiên có $AB=CD$ — kiểm bốn $EG,FH=CD/2$ (song song $CD$), $GF,HE=AB/2$ (song song $AB$), bốn cạnh bằng nhau, tứ giác $EGFH$ lồi, hai đường chéo $EF\perp GH$ chung trung điểm. PASS hết.
Ghi chú: nếu $AB\parallel CD$ (khi đó $ABCD$ là hình bình hành vì $AB=CD$) thì $E$ trùng $F$, tứ giác $EGFH$ suy biến. [SOÁT] Đã thêm vào đề điều kiện "$AB$ không song song với $CD$" (bản in không có) để mệnh đề đúng — lời giải không đổi. Không dùng công cụ ngoài whitelist.
**hinh:** VN2.png

### VN3 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $I$ là trung điểm của $BC$.
Gọi $E$ là trung điểm của $AI$, $BE$ cắt $AC$ tại $F$.
Chứng minh $EF=\dfrac14BF$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Kẻ thêm:** qua $I$ kẻ $IK\parallel BF$ ($K\in AC$)
$EF=\dfrac14BF$
$\Uparrow$ (bắc cầu: $EF=\dfrac12IK$ và $IK=\dfrac12BF$)
$EF=\dfrac12IK$ · $IK=\dfrac12BF$
**Nhánh ①:** $IK=\dfrac12BF$
$\Uparrow$ (tính chất đường trung bình)
$IK$ là đường trung bình của $\triangle CBF$
$\Uparrow$ (định nghĩa đường trung bình)
$I$ là trung điểm của $CB$ ✓ · $K$ là trung điểm của $CF$
**Nhánh ①.1:** $K$ là trung điểm của $CF$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$I$ là trung điểm của $CB$ ✓ · $IK\parallel BF$ ✓ · $K\in CF$ ✓
**Nhánh ②:** $EF=\dfrac12IK$
$\Uparrow$ (tính chất đường trung bình)
$EF$ là đường trung bình của $\triangle AIK$
$\Uparrow$ (định nghĩa đường trung bình)
$E$ là trung điểm của $AI$ ✓ · $F$ là trung điểm của $AK$
**Nhánh ②.1:** $F$ là trung điểm của $AK$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$E$ là trung điểm của $AI$ ✓ · $F\in AK$ ✓
$EF\parallel IK$ (vì $IK\parallel BF$) ✓

**Phần 2. Trình bày**
Qua $I$ kẻ $IK\parallel BF$ với $K\in AC$.
Xét $\triangle CBF$ có:
$I$ là trung điểm của $CB$ (gt);
$IK\parallel BF$ (cách vẽ);
$K$ thuộc đường thẳng $CF$ (cách vẽ)
nên $K$ là trung điểm của $CF$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Do đó $IK$ là đường trung bình của $\triangle CBF$
(định nghĩa đường trung bình).
Suy ra $IK=\dfrac12BF$ (tính chất đường trung bình). (1)
Vì $E$, $F$ thuộc đường thẳng $BF$ và $IK\parallel BF$
nên $EF\parallel IK$.
Xét $\triangle AIK$ có:
$E$ là trung điểm của $AI$ (gt);
$EF\parallel IK$ (cmt);
$F$ thuộc đường thẳng $AK$ (vì $F$, $K$ thuộc $AC$)
nên $F$ là trung điểm của $AK$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Do đó $EF$ là đường trung bình của $\triangle AIK$
(định nghĩa đường trung bình).
Suy ra $EF=\dfrac12IK$ (tính chất đường trung bình). (2)
Từ (1) và (2) suy ra $EF=\dfrac12\cdot\dfrac12BF=\dfrac14BF$.
Vậy $EF=\dfrac14BF$.
**cấu hình hình / nghi vấn:**
Sửa lỗi đề: bản in "E là trung điểm của AD" ($D$ chưa định nghĩa) ⇒ sửa thành "E là trung điểm của AI" (theo lời giao; bài quen thuộc).
Hình đề: tam giác $ABC$ lệch, $I$ trên $BC$ (1 gạch $BI=IC$), $E$ trên $AI$ (2 gạch $AE=EI$), đường $BE$ kéo tới $F$ trên $AC$ ($F$ cách $A$ đúng $\frac13AC$ theo dựng toạ độ; đề không ghi tỉ số này nên hình không ghi). Hình lời giải riêng `VN3_lg.png`: thêm đoạn kẻ phụ $IK$ (nét đứt) với $K\in AC$, $IK\parallel BF$ — hình đề KHÔNG chứa $K$.
Verify (kiem_G6.mjs): hình + 6 tam giác ngẫu nhiên — kiểm $K$ là trung điểm $CF$, $IK=BF/2$, $EF\parallel IK$, $F$ là trung điểm $AK$, $EF=IK/2$, $EF=BF/4$, $E$ nằm giữa $B$ và $F$. PASS hết.
Ghi chú: chú ý đường trung bình dùng cho $\triangle AIK$ và $\triangle CBF$ — "đường thẳng qua trung điểm cạnh, song song cạnh thứ hai, cắt cạnh thứ ba (nằm trên đường thẳng $AC$) thì cắt tại trung điểm". Không dùng công cụ ngoài whitelist (không Thalès).
**hinh:** VN3.png
**hinh_lg:** VN3_lg.png

### VN4 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$ có $AM$ là đường trung tuyến.
Kẻ $ME$ vuông góc với $AC$ ($E\in AC$).
Chứng minh:
a) $ME\parallel AB$.
b) $ME$ là đường trung bình của tam giác $ABC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $ME\parallel AB$
$\Uparrow$ (hai đường thẳng cùng vuông góc với một đường thẳng thì song song)
$ME\perp AC$ (gt) ✓ · $AB\perp AC$ (gt) ✓

b) $ME$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$M$ là trung điểm của $BC$ ✓ ($AM$ là trung tuyến) · $E$ là trung điểm của $AC$
**Nhánh ①:** $E$ là trung điểm của $AC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$M$ là trung điểm của $BC$ ✓ · $ME\parallel AB$ (câu a) ✓ · $E\in AC$ ✓

**Phần 2. Trình bày**
a) Ta có $AB\perp AC$ (gt)
và $ME\perp AC$ (gt).
Vậy $ME\parallel AB$
(hai đường thẳng cùng vuông góc với $AC$).

b) Vì $AM$ là trung tuyến của $\triangle ABC$ (gt)
nên $M$ là trung điểm của $BC$ (định nghĩa đường trung tuyến).
Xét $\triangle ABC$ có:
$M$ là trung điểm của $BC$ (cmt);
$ME\parallel AB$ (câu a);
$E$ thuộc $AC$ (gt)
nên $E$ là trung điểm của $AC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Khi đó $ME$ nối hai trung điểm $M$ của $BC$ và $E$ của $AC$.
Vậy $ME$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
**cấu hình hình / nghi vấn:**
Hình đề: $ABC$ vuông tại $A$ ($AB$ đứng, $AC$ ngang, ký hiệu góc vuông tại $A$), $M$ trung điểm $BC$ (1 gạch $BM=MC$), vẽ trung tuyến $AM$, đoạn $ME$ vuông góc $AC$ tại $E$ (ký hiệu góc vuông tại $E$). Không đánh dấu $AE=EC$ (kết quả của ý b). ($ME$ trông song song $AB$ trên hình chỉ là hệ quả của dựng đúng dữ kiện, không có ký hiệu song song.)
Verify (kiem_G6.mjs): hình + 6 tam giác vuông tại $A$ hướng bất kì — kiểm $AB\perp AC$, $ME\perp AC$, $ME\parallel AB$, $E$ là trung điểm $AC$, $ME=AB/2$. PASS hết.
Ghi chú: ý a) dùng quan hệ vuông góc–song song lớp 7 (cùng vuông góc với một đường thẳng thì song song); không dùng công cụ ngoài whitelist.
**hinh:** VN4.png
