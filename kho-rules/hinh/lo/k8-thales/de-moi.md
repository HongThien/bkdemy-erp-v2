# ĐỀ SOẠN MỚI (Thùy 02/11: "Đấy là yêu cầu đề bài — m tự cho đề theo yêu cầu đấy")

Các dòng yêu cầu trong tài liệu (không có đề sẵn) ⇒ CTO soạn đề theo đúng yêu cầu, số liệu đã chọn cho đáp số đẹp. Người soạn lời giải: giữ NGUYÊN số liệu và yêu cầu; chỉ chỉnh câu chữ cho tự đủ dữ kiện. Mọi câu đều phải có hình đề (vẽ bằng code, dựng đúng số liệu — câu số: đoạn cần tìm ghi chữ, không ghi đáp số). Luật, khuôn, định dạng, verify: xem `BRIEF.md` (cùng thư mục). Nhãn: `TLt…` = trên lớp, phần Tính; `VNt…` = về nhà, phần Tính. Tên file hình: `TLt1.png`…

## HH00143 — Đường trung bình (whitelist: định nghĩa + tính chất đường trung bình, Thalès, Tứ giác; CẤM tính chất đường phân giác, đồng dạng, Pythagore, lượng giác)

### TLt1 — "cho độ dài đường trung bình, tính cạnh đáy" — tra_loi_ngan, dap_an `14`
Cho tam giác $ABC$. Gọi $M$, $N$ lần lượt là trung điểm của $AB$ và $AC$. Biết $MN=7$ cm. Tính độ dài $BC$.

### TLt2 — "cho cạnh đáy, tính độ dài đường trung bình" — tra_loi_ngan, dap_an `7,5`
Cho tam giác $MNP$. Gọi $I$, $K$ lần lượt là trung điểm của $MN$ và $MP$ (vẽ tam giác nằm nghiêng, không đặt đáy nằm ngang). Biết $NP=15$ cm. Tính độ dài $IK$.

### TLt3 — bài toán thực tế 1 — tra_loi_ngan, dap_an `72`
Để đo khoảng cách giữa hai điểm $B$ và $C$ ở hai bên bờ của một cái ao, bạn An chọn một điểm $A$ (không thẳng hàng với $B$, $C$) rồi xác định $M$, $N$ lần lượt là trung điểm của $AB$ và $AC$. Đo được $MN=36$ m. Tính khoảng cách $BC$ (m). (Hình: ao nằm giữa $B$ và $C$ như hình cái ao, $A$ ngoài ao.)

### TLt4 — bài toán thực tế 2 — tra_loi_ngan, dap_an `60`
Một mảnh đất hình tam giác $ABC$ có $AB=40$ m, $BC=50$ m, $CA=30$ m. Người ta lấy $M$, $N$, $P$ lần lượt là trung điểm của $AB$, $BC$, $CA$ và làm đường đi bao quanh tam giác $MNP$. Tính độ dài đường đi (chu vi tam giác $MNP$) (m).

### VNt1 — về nhà, "cho cạnh đáy, tính đường trung bình" — tra_loi_ngan, dap_an `4,8`
Cho tam giác $MNP$. Gọi $A$, $B$ lần lượt là trung điểm của $MP$ và $NP$. Biết $MN=9{,}6$ cm. Tính độ dài $AB$. (Hình: tam giác nghiêng, đường trung bình KHÔNG nằm ngang.)

### VNt2 — về nhà, bài toán thực tế — tra_loi_ngan, dap_an `MN=2; chu vi=9`
Mái nhà hình tam giác cân $ABC$ ($AB=AC=3$ m), đáy $BC=4$ m. Người ta làm thanh giằng $MN$ nối trung điểm $M$ của $AB$ với trung điểm $N$ của $AC$. Tính độ dài thanh giằng $MN$ và chu vi tứ giác $BCNM$ (m).

## HH00144 — Tính chất đường phân giác (whitelist: định lí tia phân giác + chú ý đảo, Thalès, đường trung bình, Tứ giác; CẤM đồng dạng, Pythagore, lượng giác)

### TLt1 — trên lớp, Dạng 1, "cho AB, AC, BD, tính DC" — tra_loi_ngan, dap_an `8`
Cho tam giác $ABC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Biết $AB=9$, $AC=12$, $BD=6$. Tính $DC$.

### TLt2 — trên lớp, Dạng 1, "cho AB, AC, BC, tính BD và DC" — tra_loi_ngan, dap_an `BD=8; DC=12`
Cho tam giác $ABC$ có $AB=10$ cm, $AC=15$ cm, $BC=20$ cm, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Tính độ dài $BD$ và $DC$.

### TLt3 — trên lớp, bài toán thực tế 1 — tra_loi_ngan, dap_an `BD=24; DC=40`
Một mảnh vườn hình tam giác $ABC$ có $AB=30$ m, $AC=50$ m, $BC=64$ m. Người ta làm lối đi thẳng $AD$ ($D\in BC$) sao cho $AD$ là tia phân giác của góc $A$. Tính khoảng cách $BD$ và $DC$ (m).

### TLt4 — trên lớp, bài toán thực tế 2 — tra_loi_ngan, dap_an `140`
Một công viên hình tam giác $ABC$ có $AB=150$ m, $AC=200$ m. Đài phun nước đặt ở điểm $D$ trên $BC$ sao cho $AD$ là tia phân giác của góc $A$ và $DC$ dài hơn $DB$ là $20$ m. Tính chiều dài $BC$ (m). (Gợi cách giải: $DB/DC=AB/AC=3/4$ ⇒ đặt $DB=3k$, $DC=4k$.)

### VNt1 — về nhà, "cho AB, AC, BD, tính DC" — tra_loi_ngan, dap_an `6`
Cho tam giác $ABC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Biết $AB=15$, $AC=10$, $BD=9$. Tính $DC$. (Hình: vẽ $AB$ dài hơn $AC$ — khác hình trên lớp.)

### VNt2 — về nhà, "cho AB, AC, BC, tính BD và DC" (1) — tra_loi_ngan, dap_an `BD=6; DC=8`
Cho tam giác $ABC$ có $AB=21$ cm, $AC=28$ cm, $BC=14$ cm, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Tính $BD$ và $DC$.

### VNt3 — về nhà, "cho AB, AC, BC, tính BD và DC" (2) — tra_loi_ngan, dap_an `BD=3,6; DC=5,4`
Cho tam giác $ABC$ có $AB=4$ cm, $AC=6$ cm, $BC=9$ cm, $AD$ là tia phân giác của góc $A$ ($D\in BC$). Tính $BD$ và $DC$.
(Kiểm tam giác tồn tại: 4+6>9 ✓ — vẫn là tam giác, hình dựng theo toạ độ.)

---
## HH00142 Thales — BỔ SUNG ý b) của VN5 (TL "Thales VN5", câu `HHC004391`)
Đề bản sửa (Thùy xác nhận 02/11 "đúng rồi"): thêm ý **b) Chứng minh $\dfrac{MN}{MB}+\dfrac{MP}{MC}=3$.** (ý a) giữ nguyên: $\dfrac{MC}{MP}=\dfrac{MG}{MF}$.)
Gợi hướng: Thalès (tam giác $MNE$ có $BG\parallel NE$; tam giác $MPF$ có $CG\parallel PF$) ⇒ $\dfrac{MN}{MB}=\dfrac{ME}{MG}$, $\dfrac{MP}{MC}=\dfrac{MF}{MG}$; $\triangle ANE=\triangle APF$ (g.c.g: $AN=AP$, hai góc so le trong $\widehat{ANE}=\widehat{APF}$, hai góc đối đỉnh) ⇒ $AE=AF$ ⇒ $ME+MF=2MA$; trọng tâm: $MG=\dfrac23MA$ (lớp 7) ⇒ tổng $=\dfrac{2MA}{\frac23MA}=3$. Lưu ý thứ tự điểm: $E$ nằm giữa $M$ và $A$, $F$ nằm trên tia đối của $AM$ (F ngoài đoạn MA) — nếu thứ tự khác trong hình dựng thì ghi rõ cơ sở.
