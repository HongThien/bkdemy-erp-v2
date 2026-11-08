### TL6 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $I$ là trung điểm của $BC$.
Trên $AC$ lấy $D$, $E$ sao cho $AD=DE=EC$.
Gọi $F$ là giao của $BD$ và $AI$.
a) Chứng minh $IE\parallel FD$.
b) Chứng minh $F$ là trung điểm của $AI$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $IE\parallel FD$
$\Uparrow$ ($F$ thuộc $BD$)
$IE\parallel BD$
$\Uparrow$ (tính chất đường trung bình)
$IE$ là đường trung bình của $\triangle BDC$
$\Uparrow$ (định nghĩa đường trung bình)
$I$ là trung điểm của $BC$ ✓ · $E$ là trung điểm của $DC$
$\Uparrow$ (định nghĩa trung điểm)
$E$ nằm giữa $D$, $C$ ✓ · $DE=EC$ ✓

b) $F$ là trung điểm của $AI$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$\triangle AIE$ có $D$ là trung điểm của $AE$ · $DF\parallel IE$ (câu a) ✓ · $F\in AI$ ✓
**Nhánh ①:** $D$ là trung điểm của $AE$
$\Uparrow$ (định nghĩa trung điểm)
$D$ nằm giữa $A$, $E$ ✓ · $AD=DE$ ✓

**Phần 2. Trình bày**
a) Vì $E$ nằm giữa $D$ và $C$, $DE=EC$ (gt)
nên $E$ là trung điểm của $DC$ (định nghĩa trung điểm).
Xét $\triangle BDC$ có:
$I$ là trung điểm của $BC$ (gt);
$E$ là trung điểm của $DC$ (cmt)
nên $IE$ là đường trung bình của $\triangle BDC$ (định nghĩa đường trung bình).
Suy ra $IE\parallel BD$ (tính chất đường trung bình).
Mà $F$ thuộc $BD$ (gt) nên $IE\parallel FD$.

b) Vì $D$ nằm giữa $A$ và $E$, $AD=DE$ (gt)
nên $D$ là trung điểm của $AE$ (định nghĩa trung điểm).
Xét $\triangle AIE$ có:
$D$ là trung điểm của $AE$ (cmt);
$DF\parallel IE$ (câu a);
$F$ thuộc $AI$ (gt)
nên $F$ là trung điểm của $AI$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Vậy $F$ là trung điểm của $AI$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ (A trên cùng, BC đáy ngang), $I$ trung điểm $BC$ (gạch 2 gạch), $D$, $E$ chia $AC$ làm ba phần bằng nhau (gạch 1 gạch), $F = BD\cap AI$, vẽ thêm đoạn $IE$ (đề nhắc $IE\parallel FD$). KHÔNG gạch $AF=FI$ (điều phải chứng minh). Dựng bằng toạ độ.
Đề tài liệu không có hình; đề đúng như bản in (t-13 Bài 3, t-10 Bài 4 chính là ý b); không có lỗi in.
Verify bằng toạ độ (1 bộ theo hình vẽ + 5 bộ ngẫu nhiên): $E$ trung điểm $DC$; $IE\parallel BD$ và $IE=\tfrac12BD$; $D$ trung điểm $AE$; $DF\parallel IE$; $F$ trung điểm $AI$; $F\ne D$ — đều PASS.
Công cụ dùng: đường trung bình (định nghĩa, tính chất), chú ý "qua trung điểm một cạnh, song song cạnh thứ hai" — đều trong whitelist HH00143. Không dùng công cụ ngoài.
**hinh:** TL6.png

### TL7 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$).
Lấy $H$, $K$, $I$ lần lượt là trung điểm của $AD$, $BC$, $AC$.
Chứng minh:
a) $IK\parallel AB$.
b) $HI\parallel AB$, từ đó suy ra $H$, $K$, $I$ thẳng hàng.
c) $HK=\dfrac{AB+CD}{2}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $IK\parallel AB$
$\Uparrow$ (tính chất đường trung bình)
$IK$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$I$ là trung điểm của $AC$ ✓ · $K$ là trung điểm của $BC$ ✓

b) $H$, $I$, $K$ thẳng hàng
$\Uparrow$ (tiên đề Ơ-clit)
$HI\parallel AB$ · $IK\parallel AB$ (câu a) ✓
**Nhánh ①:** $HI\parallel AB$
$\Uparrow$ (cùng song song với đường thẳng thứ ba)
$HI\parallel CD$ · $CD\parallel AB$ ✓
**Nhánh ①.1:** $HI\parallel CD$
$\Uparrow$ (tính chất đường trung bình)
$HI$ là đường trung bình của $\triangle ACD$
$\Uparrow$ (định nghĩa đường trung bình)
$H$ là trung điểm của $AD$ ✓ · $I$ là trung điểm của $AC$ ✓

c) $HK=\dfrac{AB+CD}{2}$
$\Uparrow$ (thay $HI$, $IK$ vào $HK=HI+IK$)
$HK=HI+IK$ · $HI=\dfrac12CD$ · $IK=\dfrac12AB$
**Nhánh ①:** $HK=HI+IK$
$\Uparrow$ ($I$ nằm giữa $H$ và $K$)
$H$, $I$, $K$ thẳng hàng (câu b) ✓ · $I\in AC$ ✓
$H$, $K$ khác phía đối với $AC$ ✓
**Nhánh ②:** $HI=\dfrac12CD$
$\Uparrow$ (tính chất đường trung bình)
$HI$ là đường trung bình của $\triangle ACD$ (câu b) ✓
**Nhánh ③:** $IK=\dfrac12AB$
$\Uparrow$ (tính chất đường trung bình)
$IK$ là đường trung bình của $\triangle ABC$ (câu a) ✓

**Phần 2. Trình bày**
a) Xét $\triangle ABC$ có:
$I$ là trung điểm của $AC$ (gt);
$K$ là trung điểm của $BC$ (gt)
nên $IK$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $IK\parallel AB$ và $IK=\dfrac12AB$ (tính chất đường trung bình).

b) Xét $\triangle ACD$ có:
$H$ là trung điểm của $AD$ (gt);
$I$ là trung điểm của $AC$ (gt)
nên $HI$ là đường trung bình của $\triangle ACD$ (định nghĩa đường trung bình).
Suy ra $HI\parallel CD$ và $HI=\dfrac12CD$ (tính chất đường trung bình).
Mà $CD\parallel AB$ (gt)
nên $HI\parallel AB$ (cùng song song với đường thẳng thứ ba).
Ta có $HI\parallel AB$ và $IK\parallel AB$ (câu a).
Qua $I$ chỉ kẻ được một đường thẳng song song với $AB$ (tiên đề Ơ-clit)
nên hai đường thẳng $HI$ và $IK$ trùng nhau.
Vậy $H$, $I$, $K$ thẳng hàng.

c) $B$, $D$ nằm khác phía đối với đường chéo $AC$ (hình thang $ABCD$);
$H$ thuộc cạnh $AD$, $K$ thuộc cạnh $BC$
nên $H$, $K$ nằm khác phía đối với $AC$.
Mà $I$ thuộc $AC$ và $H$, $I$, $K$ thẳng hàng (câu b)
nên $I$ nằm giữa $H$ và $K$.
Do đó $HK=HI+IK$.
Mà $HI=\dfrac12CD$ (câu b), $IK=\dfrac12AB$ (câu a)
nên $HK=\dfrac12CD+\dfrac12AB=\dfrac{AB+CD}{2}$.
Vậy $HK=\dfrac{AB+CD}{2}$.
**cấu hình hình / nghi vấn:**
Hình: hình thang $ABCD$ ($AB$ trên ngắn, $CD$ dưới dài, $AB\parallel CD$), $H$, $K$, $I$ là trung điểm $AD$, $BC$, $AC$ (gạch 1 / 2 / 3 gạch), vẽ đường chéo $AC$ và hai đoạn $HI$, $IK$ (trông thẳng hàng vì đúng là thẳng hàng; KHÔNG vẽ nhãn $HK$ hay $HK=\dfrac{AB+CD}{2}$). Dựng bằng toạ độ ($C=D+1{,}6\,\overrightarrow{AB}$).
Đề đúng như bản in (t-10 Bài 5). Chữ "từ đó suy ra" ở ý b) giữ nguyên.
Verify (1 bộ theo hình + 5 bộ ngẫu nhiên hình thang lồi): $IK\parallel AB$, $IK=\tfrac12AB$; $HI\parallel CD$, $HI=\tfrac12CD$, $HI\parallel AB$; $H,I,K$ thẳng hàng; $H,K$ khác phía $AC$; $I$ nằm giữa $H,K$; $HK=HI+IK=(AB+CD)/2$ — đều PASS.
Điểm tinh tế (ý c): "$I$ nằm giữa $H$ và $K$" lời giải chứng minh bằng "$H$, $K$ khác phía $AC$" (vì $B$, $D$ khác phía đường chéo $AC$ của hình thang lồi, $H\in AD$, $K\in BC$) — kiến thức lớp 6–7, không ngoài whitelist; nhiều đáp án sách bỏ qua bước này, giữ lại cho chặt chẽ.
Công cụ: đường trung bình (định nghĩa, tính chất), tiên đề Ơ-clit, "cùng song song với đường thẳng thứ ba" (lớp 7) — đều trong whitelist.
**hinh:** TL7.png

### TL8 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $D$ là trung điểm của $AB$.
Qua $D$ kẻ đường thẳng song song với $BC$ cắt $AC$ tại $E$.
Chứng minh $E$ là trung điểm của $AC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$E$ là trung điểm của $AC$
$\Uparrow$ (định nghĩa trung điểm)
$E$ thuộc $AC$ ✓ · $AE=\dfrac12AC$
$\Uparrow$ (nhân hai vế với $AC$)
$\dfrac{AE}{AC}=\dfrac12$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AD}{AB}$)
$\dfrac{AE}{AC}=\dfrac{AD}{AB}$ · $\dfrac{AD}{AB}=\dfrac12$
**Nhánh ①:** $\dfrac{AE}{AC}=\dfrac{AD}{AB}$
$\Uparrow$ (định lí Thalès)
$DE\parallel BC$ ✓ · $D\in AB$ ✓ · $E\in AC$ ✓
**Nhánh ②:** $\dfrac{AD}{AB}=\dfrac12$
$\Uparrow$ (định nghĩa trung điểm)
$D$ là trung điểm của $AB$ ✓

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$DE\parallel BC$ (gt);
$D$ thuộc $AB$, $E$ thuộc $AC$ (gt)
nên $\dfrac{AE}{AC}=\dfrac{AD}{AB}$ (định lí Thalès).
Vì $D$ là trung điểm của $AB$ (gt)
nên $AD=\dfrac12AB$, tức $\dfrac{AD}{AB}=\dfrac12$ (định nghĩa trung điểm).
Suy ra $\dfrac{AE}{AC}=\dfrac12$, tức $AE=\dfrac12AC$.
Mà $E$ thuộc $AC$ (gt)
nên $E$ là trung điểm của $AC$ (định nghĩa trung điểm).
Vậy $E$ là trung điểm của $AC$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$, $D$ trung điểm $AB$ (gạch 1 gạch ở $AD$ và $DB$), $DE\parallel BC$ dựng bằng toạ độ, $E$ trên $AC$. KHÔNG gạch $AE=EC$ (điều phải chứng minh); $E$ tất nhiên nằm ở giữa $AC$ vì dựng đúng $DE\parallel BC$.
Đề đúng như bản in (t-13 Bài 1 = bài trên lớp Buổi 2). Đây chính là "Chú ý" trong lý thuyết bài (lý thuyết chỉ nêu, không chứng minh) ⇒ lời giải KHÔNG viện dẫn "Chú ý" (tránh vòng tròn) mà chứng minh bằng định lí Thalès (trong whitelist HH00143: Thalès của bài trước). Cách khác cũng hợp whitelist: gọi $E'$ là trung điểm $AC$, $DE'$ là đường trung bình ⇒ $DE'\parallel BC$, theo tiên đề Ơ-clit $E'\equiv E$ — không dùng vì cần điểm phụ.
Verify (1 bộ theo hình + 5 bộ ngẫu nhiên): $DE\parallel BC$, $E\in AC$ giữa $A,C$, $\tfrac{AE}{AC}=\tfrac{AD}{AB}=\tfrac12$, $E$ trung điểm $AC$ — đều PASS.
**hinh:** TL8.png

### TL9 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho hình bình hành $ABCD$ có $AC$ cắt $BD$ tại $O$.
Trên cạnh $CD$ lấy điểm $E$ sao cho $DE=\dfrac13DC$ và $AE$ cắt $BD$ tại $K$.
Từ $O$ kẻ đường thẳng song song với $AE$ cắt $CD$ tại $F$.
a) Chứng minh $OF$ là đường trung bình của tam giác $ACE$.
b) Chứng minh $KO=KD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $OF$ là đường trung bình của $\triangle ACE$
$\Uparrow$ (định nghĩa đường trung bình)
$O$ là trung điểm của $AC$ · $F$ là trung điểm của $CE$
**Nhánh ①:** $O$ là trung điểm của $AC$
$\Uparrow$ (tính chất hai đường chéo của hình bình hành)
$ABCD$ là hình bình hành ✓ · $AC\cap BD=O$ ✓
**Nhánh ②:** $F$ là trung điểm của $CE$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$\triangle ACE$ có $O$ là trung điểm của $AC$ (nhánh ①) · $OF\parallel AE$ ✓ · $F\in CE$ ✓

b) $KO=KD$
$\Uparrow$ (định nghĩa trung điểm)
$K$ là trung điểm của $DO$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$\triangle DOF$ có $E$ là trung điểm của $DF$ · $EK\parallel OF$ ($K\in AE$, $AE\parallel OF$) ✓ · $K\in DO$ ✓
**Nhánh ①:** $E$ là trung điểm của $DF$
$\Uparrow$ (định nghĩa trung điểm)
$E$ nằm giữa $D$, $F$ ✓ · $DE=EF$
$\Uparrow$ (cùng bằng $\dfrac13DC$)
$DE=\dfrac13DC$ ✓ · $EF=\dfrac13DC$
$\Uparrow$ ($EF=\dfrac12EC$ và $EC=\dfrac23DC$)
$F$ là trung điểm của $CE$ (câu a) ✓ · $EC=DC-DE$ ✓

**Phần 2. Trình bày**
a) Vì $ABCD$ là hình bình hành (gt)
và $AC$ cắt $BD$ tại $O$ (gt)
nên $O$ là trung điểm của $AC$
(tính chất hai đường chéo của hình bình hành).
Xét $\triangle ACE$ có:
$O$ là trung điểm của $AC$ (cmt);
$OF\parallel AE$ (gt);
$F$ thuộc $CD$, tức thuộc đường thẳng $CE$ (gt)
nên $F$ là trung điểm của $CE$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Do đó $OF$ là đường trung bình của $\triangle ACE$
(định nghĩa đường trung bình).

b) Vì $E$ nằm giữa $D$ và $C$, $DE=\dfrac13DC$ (gt)
nên $EC=DC-DE=\dfrac23DC$.
Vì $F$ là trung điểm của $CE$ (câu a)
nên $F$ nằm giữa $E$ và $C$, $EF=\dfrac12EC=\dfrac13DC$.
Do đó $E$ nằm giữa $D$ và $F$, $EF=DE$
nên $E$ là trung điểm của $DF$ (định nghĩa trung điểm).
Xét $\triangle DOF$ có:
$E$ là trung điểm của $DF$ (cmt);
$EK\parallel OF$ (vì $K$ thuộc $AE$, $AE\parallel OF$ - gt);
$K$ thuộc $DO$ (vì $K$, $O$ cùng thuộc $BD$)
nên $K$ là trung điểm của $DO$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Vậy $KO=KD$.
**cấu hình hình / nghi vấn:**
Hình: hình bình hành $ABCD$ ($A$ trên-trái, $B$ trên-phải, $D$ dưới-trái, $C$ dưới-phải; $AB\parallel DC$ dựng $C=B+D-A$), hai đường chéo $AC$, $BD$ cắt nhau tại $O$, $E$ trên $CD$ với $DE=\tfrac13DC$ (dựng đúng tỉ lệ), $AE$ cắt $BD$ tại $K$, $OF\parallel AE$ với $F\in CD$. Không đánh dấu trung điểm nào, không ghi $KO=KD$ (điều phải chứng minh); tỉ lệ $DE=\tfrac13DC$ nằm trong đề, không ghi trên hình.
Đề đúng như bản in (t-13 Bài 4 = t-11 Bài 6); bản tài liệu đánh nhãn ý c), d) → đổi thành a), b).
Verify (1 bộ theo hình + 5 bộ ngẫu nhiên hình bình hành): $O$ trung điểm $AC$; $OF\parallel AE$; $F$ trung điểm $CE$, $OF=\tfrac12AE$; $EF=DE=\tfrac13DC$; $E$ trung điểm $DF$; $EK\parallel OF$; $K$ trung điểm $DO$; $KO=KD$ — đều PASS.
Điểm tinh tế: "$F$ trung điểm $CE$" dùng "Chú ý" cho đường thẳng $OF$ (đường thẳng, F là giao với đường thẳng $CD$ chứa $CE$): giao điểm của hai đường thẳng phân biệt là duy nhất nên $F$ trùng trung điểm $CE$. Tương tự $K$ ở ý b) (giao của $AE$ với đường thẳng $DO$). Công cụ đều trong whitelist (hình bình hành lớp 8 chương Tứ giác; đường trung bình; Chú ý).
**hinh:** TL9.png
