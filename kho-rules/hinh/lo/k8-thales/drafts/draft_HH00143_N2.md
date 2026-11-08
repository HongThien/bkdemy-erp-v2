### TLt4 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** 60
**noi_dung:**
Một mảnh đất hình tam giác $ABC$ có $AB=40$ m, $BC=50$ m, $CA=30$ m.
Người ta lấy $M$, $N$, $P$ lần lượt là trung điểm của $AB$, $BC$, $CA$.
Người ta làm đường đi bao quanh tam giác $MNP$.
Tính độ dài đường đi đó (chu vi tam giác $MNP$) (đơn vị: m).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi cạnh của $\triangle MNP$ nối trung điểm hai cạnh của $\triangle ABC$
nên là đường trung bình, bằng nửa cạnh thứ ba của $\triangle ABC$.

**Bước 1.** Nhận ra $M$, $N$, $P$ là trung điểm của $AB$, $BC$, $CA$:
mỗi cạnh của $\triangle MNP$ nối trung điểm của hai cạnh của $\triangle ABC$.

**Bước 2.** $MN$ nối trung điểm của $AB$ và $BC$
nên là đường trung bình của $\triangle ABC$ ứng với cạnh thứ ba $AC$;
do đó $MN=\dfrac12AC$.

**Bước 3.** Làm tương tự:
$NP$ nối trung điểm của $BC$ và $CA$ nên $NP=\dfrac12AB$;
$PM$ nối trung điểm của $CA$ và $AB$ nên $PM=\dfrac12BC$.

**Bước 4.** Cộng ba độ dài vừa tính
để được chu vi $\triangle MNP$ (đường đi bao quanh).

**Chú ý:** Đường trung bình bằng nửa cạnh KHÔNG chứa hai trung điểm
(cạnh thứ ba), không phải nửa cạnh chứa chúng.
Kiểm tra: chu vi $\triangle MNP$ phải bằng nửa chu vi $\triangle ABC$.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $BC$ (gt)
nên $MN$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Do đó $MN=\dfrac12AC=\dfrac12\cdot30=15$ (m) (tính chất đường trung bình).
Tương tự, $N$ là trung điểm của $BC$ (gt);
$P$ là trung điểm của $CA$ (gt)
nên $NP$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Do đó $NP=\dfrac12AB=\dfrac12\cdot40=20$ (m) (tính chất đường trung bình).
Tương tự, $P$ là trung điểm của $CA$ (gt);
$M$ là trung điểm của $AB$ (gt)
nên $PM$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Do đó $PM=\dfrac12BC=\dfrac12\cdot50=25$ (m) (tính chất đường trung bình).
Chu vi $\triangle MNP$ là $MN+NP+PM=15+20+25=60$ (m).
Vậy đường đi dài $60$ m.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ dựng đúng tỉ lệ $AB:BC:CA=40:50:30$ (6 px/m), $BC$ nằm ngang đáy; $M$, $N$, $P$ là trung điểm dựng bằng toạ độ, gạch bằng nhau theo từng cặp ($AM=MB$ một gạch, $BN=NC$ hai gạch, $CP=PA$ ba gạch — là dữ kiện đề "trung điểm", không phải điều cần chứng minh); ghi số 40, 50, 30 trên ba cạnh (soát 02/11, `ve_N2_soat.mjs`: mỗi số đặt trên một cung đứt nét ôm CẢ cạnh — bản đầu đặt "40" sát đoạn $AM$, "50" dưới $BN$, "30" cạnh $PC$, dễ đọc nhầm $AM=40$…); không ghi đáp số. Tam giác $MNP$ vẽ cùng nét. Đề đã gom số đo từ chữ sang đủ dữ kiện, thêm câu giải thích "đường đi bao quanh $\triangle MNP$" (không đổi số liệu CTO). Verify: `kiem_N2.mjs` PASS (3 bộ toạ độ đặt vị trí khác nhau: $MN\parallel AC$, $NP\parallel AB$, $PM\parallel BC$, $MN=15$, $NP=20$, $PM=25$, chu vi $=60$). Chỉ dùng định nghĩa + tính chất đường trung bình (đúng whitelist); không dùng Pythagore dù số đo 30-40-50 là bộ ba Pythagore.
**hinh:** TLt4.png

### VNt1 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** 4,8
**noi_dung:**
Cho tam giác $MNP$.
Gọi $A$, $B$ lần lượt là trung điểm của $MP$ và $NP$.
Biết $MN=9{,}6$ cm.
Tính $x=AB$ (đơn vị: cm).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** $AB$ nối trung điểm hai cạnh $MP$ và $NP$
nên là đường trung bình của $\triangle MNP$, bằng nửa cạnh thứ ba $MN$.

**Bước 1.** Xác định hai trung điểm:
$A$ là trung điểm của $MP$, $B$ là trung điểm của $NP$
(hai cạnh cùng đi qua đỉnh $P$).

**Bước 2.** Vì $AB$ nối hai trung điểm đó
nên $AB$ là đường trung bình của $\triangle MNP$;
cạnh thứ ba (không chứa $A$, $B$) là $MN$.

**Bước 3.** Áp dụng tính chất đường trung bình: $AB=\dfrac12MN$,
rồi thay $MN=9{,}6$.

**Chú ý:** Hình nghiêng, $AB$ không nằm ngang
nhưng vẫn song song với $MN$;
luôn lấy nửa cạnh thứ ba ($MN$), không lấy nửa $MP$ hay $NP$.

**Phần 2. Trình bày**
Xét $\triangle MNP$ có:
$A$ là trung điểm của $MP$ (gt);
$B$ là trung điểm của $NP$ (gt)
nên $AB$ là đường trung bình của $\triangle MNP$
(định nghĩa đường trung bình).
Do đó $AB=\dfrac12MN$ (tính chất đường trung bình).
Mà $MN=9{,}6$ cm (gt)
nên $AB=\dfrac12\cdot9{,}6=4{,}8$ (cm).
Vậy $x=AB=4{,}8$ cm.
**cấu hình hình / nghi vấn:**
Hình: tam giác $MNP$ nghiêng ($P$ ở trên, $MN$ nghiêng xuống phải), $A$, $B$ là trung điểm dựng bằng toạ độ nên $AB\parallel MN$ không nằm ngang; gạch bằng nhau $MA=AP$ (một gạch), $NB=BP$ (hai gạch) theo giả thiết "trung điểm"; ghi $9{,}6$ trên $MN$ và $x$ trên $AB$ (không ghi đáp số). Đề chuyển "Tính độ dài $AB$" thành "Tính $x=AB$" cho khớp hình. Verify: `kiem_N2.mjs` PASS (3 tam giác khác nhau co về $MN=9{,}6$: $AB\parallel MN$, $AB=MN/2=4{,}8$). Chỉ dùng định nghĩa + tính chất đường trung bình.
**hinh:** VNt1.png

### VNt2 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** MN=2; chu vi=9
**noi_dung:**
Mái nhà hình tam giác cân $ABC$ có $AB=AC=3$ m, đáy $BC=4$ m.
Người ta làm thanh giằng $MN$ nối trung điểm $M$ của $AB$ với trung điểm $N$ của $AC$.
Tính độ dài thanh giằng $x=MN$ và chu vi tứ giác $BCNM$ (đơn vị: m).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** $MN$ nối trung điểm hai cạnh $AB$, $AC$
nên là đường trung bình của $\triangle ABC$: $MN=\dfrac12BC$.
Chu vi $BCNM$ gồm bốn cạnh $BC$, $CN$, $NM$, $MB$.

**Bước 1.** Nhận ra $M$ là trung điểm của $AB$ và $N$ là trung điểm của $AC$
nên $MN$ là đường trung bình của $\triangle ABC$;
cạnh thứ ba là $BC$.

**Bước 2.** Dùng tính chất đường trung bình để tính $MN=\dfrac12BC$.

**Bước 3.** Tính hai cạnh bên còn lại của tứ giác:
$MB=\dfrac12AB$ và $NC=\dfrac12AC$ (vì $M$, $N$ là trung điểm).

**Bước 4.** Cộng bốn cạnh $BC$, $CN$, $NM$, $MB$
để được chu vi tứ giác $BCNM$.

**Chú ý:** Chu vi $BCNM$ không có cạnh $AB$, $AC$ nguyên:
chỉ lấy $MB$ và $NC$ (nửa mỗi cạnh bên) cùng với $BC$ và $MN$.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $AC$ (gt)
nên $MN$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Do đó $MN=\dfrac12BC=\dfrac12\cdot4=2$ (m) (tính chất đường trung bình).
Vì $M$ là trung điểm của $AB$ (gt)
nên $MB=\dfrac12AB=\dfrac12\cdot3=1{,}5$ (m) (định nghĩa trung điểm).
Vì $N$ là trung điểm của $AC$ (gt)
nên $NC=\dfrac12AC=\dfrac12\cdot3=1{,}5$ (m) (định nghĩa trung điểm).
Chu vi tứ giác $BCNM$ là:
$BC+CN+NM+MB=4+1{,}5+2+1{,}5=9$ (m).
Vậy $MN=2$ m và chu vi tứ giác $BCNM$ bằng $9$ m.
**cấu hình hình / nghi vấn:**
Hình: tam giác cân $ABC$ dựng đúng $AB=AC=3$, $BC=4$ (70 px/m, đường cao $\sqrt5\approx2{,}24$), $A$ ở trên; $M$, $N$ là trung điểm dựng bằng toạ độ nên $MN\parallel BC$ (đúng theo hệ quả, không cần ghi dấu song song); gạch bằng nhau $AM=MB$ (một gạch), $AN=NC$ (hai gạch); ghi 3, 3, 4 trên ba cạnh và $x$ trên $MN$ (không ghi đáp số); soát 02/11 (`ve_N2_soat.mjs`): hai số "3" đặt trên cung đứt nét ôm cả $AB$, $AC$ (bản đầu đặt sát nửa đoạn $AM$, $AN$ ⇒ dễ đọc nhầm $AM=3$). Đề thêm "$x=MN$" cho khớp hình. Verify: `kiem_N2.mjs` PASS (3 bộ toạ độ khác nhau: $MN\parallel BC$, $MN=2$, $MB=NC=1{,}5$, chu vi $BCNM=9$). Đáp số 2 ý: `MN=2; chu vi=9`. Chỉ dùng định nghĩa + tính chất đường trung bình.
**hinh:** VNt2.png
