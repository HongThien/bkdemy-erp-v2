### VN5 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $A$ có đường trung tuyến $AM$.
Qua $M$ kẻ đường thẳng song song với $AB$ cắt $AC$ tại $D$.
a) Chứng minh $D$ là trung điểm của $AC$.
b) Qua $D$ kẻ đường thẳng vuông góc với $AM$ tại $I$.
Chứng minh $DI$ là đường trung bình của tam giác $AMC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $D$ là trung điểm của $AC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$M$ là trung điểm của $BC$ ✓ · $MD\parallel AB$ ✓

b) $DI$ là đường trung bình của $\triangle AMC$
$\Uparrow$ (định nghĩa đường trung bình)
$D$ là trung điểm của $AC$ (câu a) ✓ · $I$ là trung điểm của $AM$
**Nhánh ①:** $I$ là trung điểm của $AM$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$D$ là trung điểm của $AC$ (câu a) ✓ · $DI\parallel MC$
$\Uparrow$ (cùng vuông góc với $AM$ thì song song)
$DI\perp AM$ ✓ · $MC\perp AM$
$\Uparrow$ (hai góc kề bù bằng nhau thì mỗi góc bằng $90^\circ$)
$\widehat{AMB}=\widehat{AMC}$ · $\widehat{AMB}$ và $\widehat{AMC}$ là hai góc kề bù ✓
$\Uparrow$ (hai góc tương ứng của hai tam giác bằng nhau)
$\triangle ABM=\triangle ACM$
$\Uparrow$ (c.c.c)
$AB=AC$ ✓ · $BM=CM$ ✓ · $AM$ chung ✓

**Phần 2. Trình bày**
a) Xét $\triangle ABC$ có:
$M$ là trung điểm của $BC$ (gt);
$MD\parallel AB$ (gt)
nên đường thẳng $MD$ đi qua trung điểm của $AC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $MD$ cắt $AC$ tại $D$ (gt)
nên $D$ là trung điểm của $AC$.

b) Xét $\triangle ABM$ và $\triangle ACM$ có:
$AB=AC$ (gt);
$BM=CM$ ($M$ là trung điểm của $BC$);
$AM$ chung.
Do đó $\triangle ABM=\triangle ACM$ (c.c.c).
Suy ra $\widehat{AMB}=\widehat{AMC}$ (hai góc tương ứng).
Mà $\widehat{AMB}+\widehat{AMC}=180^\circ$ (hai góc kề bù)
nên $\widehat{AMC}=90^\circ$, tức là $MC\perp AM$.
Ta có $DI\perp AM$ (gt) và $MC\perp AM$ (cmt)
nên $DI\parallel MC$ (cùng vuông góc với $AM$).
Xét $\triangle AMC$ có:
$D$ là trung điểm của $AC$ (câu a);
$DI\parallel MC$ (cmt)
nên đường thẳng $DI$ đi qua trung điểm của $AM$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $DI$ cắt $AM$ tại $I$ (gt)
nên $I$ là trung điểm của $AM$.
Vậy $DI$ nối trung điểm $D$ của $AC$ với trung điểm $I$ của $AM$
nên $DI$ là đường trung bình của $\triangle AMC$ (định nghĩa đường trung bình).
**cấu hình hình / nghi vấn:**
Hình đề: tam giác $ABC$ cân tại $A$ ([SOÁT] đánh dấu hai góc đáy $\widehat{B}=\widehat{C}$ bằng cung — bản đầu gạch trên đoạn $AD$ ngụ ý sai $AD=AB$; vẽ lại bằng `ve_G7_soat.mjs`), $M$ trung điểm $BC$ (gạch hai đoạn $BM$, $MC$ bằng nhau), trung tuyến $AM$, đoạn $MD$ ($D\in AC$, $MD\parallel AB$), đoạn $DI$ với góc vuông tại $I$ trên $AM$. KHÔNG gạch $D$ là trung điểm $AC$ / $I$ là trung điểm $AM$ (là điều phải chứng minh).
Đề tài liệu chỉ viết "Qua $D$ kẻ đường thẳng vuông góc với $AM$ tại $I$" — giữ nguyên; đề không in sai.
Nghi vấn công cụ: ý b cần $AM\perp BC$. Tính chất "trong tam giác cân, trung tuyến ứng với cạnh đáy cũng là đường cao" có thể đã học ở lớp 7 nhưng không chắc có trong whitelist bài này, nên đã chứng minh bằng $\triangle ABM=\triangle ACM$ (c.c.c) + hai góc kề bù — chỉ dùng kiến thức lớp 7 chắc chắn. Nếu Thùy cho phép dùng thẳng tính chất tam giác cân thì rút gọn được hai tầng sơ đồ.
Verify: toạ độ số 3 bộ tam giác cân (kiem_G7.mjs) — $D$ trung điểm $AC$, $AM\perp BC$, $DI\parallel BC$, $I$ trung điểm $AM$, $DI=\tfrac12MC$: PASS.
**hinh:** VN5.png

### VN6 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$).
Lấy $M$ là trung điểm của $AD$.
Qua $M$ kẻ đường thẳng song song với $AB$ cắt $AC$, $BC$ lần lượt tại $N$, $P$.
a) Chứng minh $N$ là trung điểm của $AC$.
b) Chứng minh $NP$ là đường trung bình của tam giác $ABC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $N$ là trung điểm của $AC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$M$ là trung điểm của $AD$ ✓ · $MN\parallel CD$
**Nhánh ①:** $MN\parallel CD$
$\Uparrow$ (cùng song song với $AB$)
$MN\parallel AB$ ✓ · $AB\parallel CD$ ✓

b) $NP$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$N$ là trung điểm của $AC$ (câu a) ✓ · $P$ là trung điểm của $BC$
**Nhánh ①:** $P$ là trung điểm của $BC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$N$ là trung điểm của $AC$ (câu a) ✓ · $NP\parallel AB$ ✓

**Phần 2. Trình bày**
a) Vì $MN\parallel AB$ (gt) và $AB\parallel CD$ (gt)
nên $MN\parallel CD$ (cùng song song với $AB$).
Xét $\triangle ACD$ có:
$M$ là trung điểm của $AD$ (gt);
$MN\parallel CD$ (cmt)
nên đường thẳng $MN$ đi qua trung điểm của $AC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $MN$ cắt $AC$ tại $N$ (gt)
nên $N$ là trung điểm của $AC$.

b) Xét $\triangle ABC$ có:
$N$ là trung điểm của $AC$ (câu a);
$NP\parallel AB$ (gt)
nên đường thẳng $NP$ đi qua trung điểm của $BC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $NP$ cắt $BC$ tại $P$ (gt)
nên $P$ là trung điểm của $BC$.
Vậy $NP$ nối trung điểm $N$ của $AC$ với trung điểm $P$ của $BC$
nên $NP$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
**cấu hình hình / nghi vấn:**
Hình đề: hình thang $ABCD$ đáy $AB$ (trên, ngắn) và $CD$ (dưới, dài), $M$ trung điểm $AD$ (gạch $AM=MD$), đường ngang qua $M$ song song $AB$, cắt đường chéo $AC$ tại $N$ và cạnh $BC$ tại $P$ (đoạn vẽ từ $M$ tới $P$). Vẽ thêm đường chéo $AC$ vì đề có điểm $N\in AC$. KHÔNG gạch $N$, $P$ là trung điểm.
Sửa lỗi đề: bản in "song song với $BC$" đã sửa thành "song song với $AB$" (như ghi chú giao việc; qua $M$ song song $BC$ không thể cắt $BC$).
Verify: 4 bộ hình thang (kể cả đáy nghiêng) — $MN\parallel CD$, $N$, $P$ trung điểm $AC$, $BC$, $NP\parallel AB$ và $NP=\tfrac12AB$: PASS.
**hinh:** VN6.png

### VN7 → HH00143
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $A$ có đường trung tuyến $AM$.
Gọi $I$ là trung điểm của $AM$.
Qua $I$ kẻ đường thẳng song song với $AC$ cắt $BC$ tại $E$.
a) Chứng minh $E$ là trung điểm của $MC$.
b) Qua $E$ kẻ đường thẳng song song với $AB$ cắt $AC$ tại $F$.
Chứng minh $CF=\dfrac14AC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $E$ là trung điểm của $MC$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$I$ là trung điểm của $AM$ ✓ · $IE\parallel AC$ ✓

b) $CF=\dfrac14AC$
**Kẻ thêm:** gọi $N$ là trung điểm của $AC$, nối $M$ với $N$
$\Uparrow$ (bắc cầu)
$CF=\dfrac12CN$ · $CN=\dfrac12AC$
**Nhánh ①:** $CF=\dfrac12CN$
$\Uparrow$ (định nghĩa trung điểm)
$F$ là trung điểm của $CN$
$\Uparrow$ (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai)
$E$ là trung điểm của $MC$ (câu a) ✓ · $EF\parallel MN$
$\Uparrow$ (cùng song song với $AB$)
$EF\parallel AB$ ✓ · $MN\parallel AB$
$\Uparrow$ (tính chất đường trung bình)
$MN$ là đường trung bình của $\triangle ABC$
$\Uparrow$ (định nghĩa đường trung bình)
$M$ là trung điểm của $BC$ ✓ · $N$ là trung điểm của $AC$ ✓
**Nhánh ②:** $CN=\dfrac12AC$
$\Uparrow$ (định nghĩa trung điểm)
$N$ là trung điểm của $AC$ ✓

**Phần 2. Trình bày**
a) Xét $\triangle AMC$ có:
$I$ là trung điểm của $AM$ (gt);
$IE\parallel AC$ (gt)
nên đường thẳng $IE$ đi qua trung điểm của $MC$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $IE$ cắt $MC$ tại $E$ (gt)
nên $E$ là trung điểm của $MC$.

b) Gọi $N$ là trung điểm của $AC$, nối $M$ với $N$.
Xét $\triangle ABC$ có:
$M$ là trung điểm của $BC$ (gt);
$N$ là trung điểm của $AC$ (cách gọi).
Do đó $MN$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Suy ra $MN\parallel AB$ (tính chất đường trung bình).
Mà $EF\parallel AB$ (gt)
nên $EF\parallel MN$ (cùng song song với $AB$).
Xét $\triangle CMN$ có:
$E$ là trung điểm của $MC$ (câu a);
$EF\parallel MN$ (cmt)
nên đường thẳng $EF$ đi qua trung điểm của $CN$
(đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai).
Mà $EF$ cắt $AC$ tại $F$ (gt)
nên $F$ là trung điểm của $CN$.
Do đó $CF=\dfrac12CN$ (định nghĩa trung điểm).
Mà $CN=\dfrac12AC$ ($N$ là trung điểm của $AC$).
Suy ra $CF=\dfrac12\cdot\dfrac12AC=\dfrac14AC$.
Vậy $CF=\dfrac14AC$.
**cấu hình hình / nghi vấn:**
Hình đề: tam giác $ABC$ cân tại $A$ ([SOÁT] đánh dấu hai góc đáy bằng cung; KHÔNG gạch $AB$, $AC$, $BM$, $MC$ — bản đầu: gạch $AC$ rơi lên đoạn $AF$ (hình lg: $AN$) ngụ ý $AF=AB$, gạch $MC$ rơi lên đoạn $ME$ ngụ ý $ME=BM$, đều sai; vẽ lại bằng `ve_G7_soat.mjs`), $M$ trung điểm $BC$ (đề nói $AM$ là trung tuyến), $I$ trung điểm $AM$ (gạch $AI$, $IM$), đoạn $IE$ ($E\in BC$, $IE\parallel AC$), đoạn $EF$ ($F\in AC$, $EF\parallel AB$). KHÔNG gạch $E$ là trung điểm $MC$ (điều phải chứng minh).
Hình lời giải riêng (hinh_lg): thêm điểm phụ $N$ (trung điểm $AC$) và đoạn $MN$ vẽ nét đứt.
Công cụ: chỉ dùng chú ý/định nghĩa/tính chất đường trung bình + song song bắc cầu (trong whitelist). Cách khác (cũng trong whitelist, ngắn hơn): định lí Thalès $\dfrac{CF}{CA}=\dfrac{CE}{CB}=\dfrac14$ vì $CE=\tfrac12CM=\tfrac14CB$ — không dùng để khỏi lệ thuộc bài trước.
Tam giác cân KHÔNG được dùng trong lời giải (cả hai ý đúng với tam giác bất kì); đề giữ nguyên "cân tại $A$".
Verify: 3 bộ tam giác cân — $E$ trung điểm $MC$, $CF=\tfrac14AC$, $MN\parallel AB$, $EF\parallel MN$, $F$ trung điểm $CN$, $CE=\tfrac14CB$: PASS.
**hinh:** VN7.png
**hinh_lg:** VN7_lg.png
