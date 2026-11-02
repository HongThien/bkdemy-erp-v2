### TLt1 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** 14
**noi_dung:**
Cho tam giác $ABC$.
Gọi $M$, $N$ lần lượt là trung điểm của $AB$ và $AC$.
Biết $MN=7$ cm.
Tính độ dài $BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đoạn nối trung điểm hai cạnh là đường trung bình,
và đường trung bình bằng nửa cạnh thứ ba.

**Bước 1.** Nhận ra đường trung bình.
$M$, $N$ là trung điểm của hai cạnh $AB$, $AC$
nên $MN$ là đường trung bình của $\triangle ABC$.

**Bước 2.** Tìm cạnh thứ ba.
Cạnh không chứa $M$, $N$ chính là $BC$,
nên $MN$ là đường trung bình ứng với cạnh $BC$.

**Bước 3.** Viết hệ thức độ dài.
Đường trung bình bằng nửa cạnh thứ ba: $MN=\dfrac12BC$.

**Bước 4.** Thay số rồi tìm $BC$.
Thay $MN=7$, suy ra $BC$ gấp đôi $MN$.

**Chú ý:** $MN$ chỉ bằng NỬA $BC$,
nên phải nhân đôi $MN$, không chia đôi.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $AC$ (gt)
nên $MN$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Suy ra $MN=\dfrac12BC$ (tính chất đường trung bình).
Do đó $BC=2\cdot MN=2\cdot 7=14$ (cm).
Vậy $BC=14$ cm.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ (A trên, BC đáy ngang), $M\in AB$, $N\in AC$ là trung điểm dựng bằng toạ độ; gạch bằng nhau $AM=MB$ (1 gạch), $AN=NC$ (2 gạch) — đều là giả thiết; vẽ $MN$ ghi "7 cm"; $BC$ không ghi số (đoạn cần tìm). Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; chỉ xuống dòng. Verify (kiem_N1.mjs, 3 bộ toạ độ): $MN\parallel BC$, $MN=\frac12BC$, từ toạ độ co về $MN=7$ cho $BC=14$ khớp dap_an. Chỉ dùng định nghĩa + tính chất đường trung bình (trong whitelist). Không có nghi vấn.
**hinh:** TLt1.png

### TLt2 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** 7,5
**noi_dung:**
Cho tam giác $MNP$.
Gọi $I$, $K$ lần lượt là trung điểm của $MN$ và $MP$.
Biết $NP=15$ cm.
Tính độ dài $IK$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đoạn nối trung điểm hai cạnh là đường trung bình,
và đường trung bình bằng nửa cạnh thứ ba.

**Bước 1.** Nhận ra đường trung bình.
$I$, $K$ là trung điểm của hai cạnh $MN$, $MP$
nên $IK$ là đường trung bình của $\triangle MNP$.

**Bước 2.** Tìm cạnh thứ ba.
Cạnh không chứa $I$, $K$ chính là $NP$,
dù tam giác nằm nghiêng vẫn xác định như vậy.

**Bước 3.** Viết hệ thức độ dài.
Đường trung bình bằng nửa cạnh thứ ba: $IK=\dfrac12NP$.

**Bước 4.** Thay số rồi tính $IK$.
Thay $NP=15$, suy ra $IK$ bằng một nửa của $15$.

**Chú ý:** Lần này cho cạnh đáy $NP$ và cần tìm đường trung bình,
nên phải CHIA ĐÔI, không nhân đôi.

**Phần 2. Trình bày**
Xét $\triangle MNP$ có:
$I$ là trung điểm của $MN$ (gt);
$K$ là trung điểm của $MP$ (gt)
nên $IK$ là đường trung bình của $\triangle MNP$
(định nghĩa đường trung bình).
Suy ra $IK=\dfrac12NP$ (tính chất đường trung bình).
Do đó $IK=\dfrac12\cdot 15=7{,}5$ (cm).
Vậy $IK=7{,}5$ cm.
**cấu hình hình / nghi vấn:**
Tam giác $MNP$ nằm NGHIÊNG (NP không ngang, hạ xuống phải ~20°; M trên cùng), $I\in MN$, $K\in MP$ là trung điểm dựng bằng toạ độ; gạch $MI=IN$ (1 gạch), $MK=KP$ (2 gạch) — giả thiết; vẽ $IK$ không ghi số (đoạn cần tìm), $NP$ ghi "15 cm". Đề do CTO soạn (de-moi.md); bỏ chú thích "(vẽ tam giác nằm nghiêng…)" khỏi đề vì là chỉ dẫn vẽ hình, đã thực hiện ở hình. Verify (kiem_N1.mjs, 3 bộ toạ độ): $IK\parallel NP$, $IK=\frac12NP$, co về $NP=15$ cho $IK=7{,}5$ khớp dap_an. Chỉ dùng định nghĩa + tính chất đường trung bình. Không có nghi vấn.
**hinh:** TLt2.png

### TLt3 → HH00143
**loai_cau:** tra_loi_ngan
**dap_an:** 72
**noi_dung:**
Để đo khoảng cách giữa hai điểm $B$ và $C$ ở hai bên bờ của một cái ao,
bạn An chọn một điểm $A$ (không thẳng hàng với $B$, $C$).
Bạn An xác định $M$, $N$ lần lượt là trung điểm của $AB$ và $AC$.
Đo được $MN=36$ m.
Tính khoảng cách $BC$ (đơn vị: mét).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Không đo trực tiếp $BC$ vì có ao chắn,
nên đo đường trung bình $MN$ rồi suy ra $BC$.

**Bước 1.** Đưa bài toán về hình học.
$A$, $B$, $C$ không thẳng hàng nên tạo thành tam giác $ABC$,
trong đó $BC$ nằm chắn qua ao.

**Bước 2.** Nhận ra đường trung bình.
$M$, $N$ là trung điểm của $AB$, $AC$
nên $MN$ là đường trung bình của $\triangle ABC$.

**Bước 3.** Viết hệ thức độ dài.
Đường trung bình bằng nửa cạnh thứ ba: $MN=\dfrac12BC$.

**Bước 4.** Thay số rồi tìm $BC$.
Thay $MN=36$ m, suy ra $BC$ gấp đôi $MN$.

**Chú ý:** Đo được $MN$ ở phần đất liền là đủ,
$BC$ gấp đôi $MN$ chứ không bằng $MN$.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $AC$ (gt)
nên $MN$ là đường trung bình của $\triangle ABC$
(định nghĩa đường trung bình).
Suy ra $MN=\dfrac12BC$ (tính chất đường trung bình).
Do đó $BC=2\cdot MN=2\cdot 36=72$ (m).
Vậy khoảng cách giữa $B$ và $C$ là $72$ m.
**cấu hình hình / nghi vấn:**
Hình: ao (elip xanh nhạt) nằm giữa $B$ và $C$ (hai điểm nằm trên hai bờ ao), $A$ ngoài ao ở phía trên; $BC$ vẽ nét đứt xuyên ao (không đo trực tiếp được, không ghi số); $M$, $N$ trung điểm $AB$, $AC$ (gạch bằng nhau 1 gạch, 2 gạch — giả thiết) và đoạn $MN$ ghi "36 m". Đề do CTO soạn (de-moi.md): giữ số liệu, tách thành các dòng ngắn; ghi chú "(Hình: ao nằm giữa…)" chuyển thành chỉ dẫn vẽ hình, không để trong đề. Verify (kiem_N1.mjs, 3 bộ toạ độ + kiểm vị trí): $MN\parallel BC$, $BC=2MN$, co về $MN=36$ cho $BC=72$ khớp dap_an; $B$, $C$ nằm trên bờ ao, $A$ ngoài ao, $A$, $B$, $C$ không thẳng hàng. Chỉ dùng định nghĩa + tính chất đường trung bình. Không có nghi vấn.
**hinh:** TLt3.png
