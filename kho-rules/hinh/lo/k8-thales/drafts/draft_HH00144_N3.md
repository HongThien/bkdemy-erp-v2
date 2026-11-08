### TLt1 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 8
**noi_dung:**
Cho tam giác $ABC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$).
Biết $AB=9$, $AC=12$, $BD=6$.
Tính $DC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ chia cạnh đối diện $BC$
thành hai đoạn $DB$, $DC$ tỉ lệ với hai cạnh kề $AB$, $AC$.

**Bước 1.** Nhận ra tia phân giác.
$AD$ là tia phân giác của góc $A$, $D$ nằm trên cạnh đối diện $BC$
nên dùng được tính chất đường phân giác.

**Bước 2.** Viết tỉ lệ thức.
Tỉ số hai đoạn trên $BC$ bằng tỉ số hai cạnh kề:
$\dfrac{DB}{DC}=\dfrac{AB}{AC}$.

**Bước 3.** Thay số rồi tìm $DC$.
Thay $DB=6$, $AB=9$, $AC=12$ vào tỉ lệ thức,
tìm $DC$ bằng tính chất của tỉ lệ thức.

**Chú ý:** Đoạn $DB$ đi với cạnh $AB$ (cùng chứa đỉnh $B$),
đoạn $DC$ đi với cạnh $AC$; đừng ghép chéo.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Thay số: $\dfrac{6}{DC}=\dfrac{9}{12}$ (gt).
Suy ra $DC=\dfrac{6\cdot 12}{9}=8$ (tính chất tỉ lệ thức).
Vậy $DC=8$.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; chỉ chỉnh câu chữ. Hình: tam giác $ABC$ dựng đúng $AB=9$, $AC=12$, $BC=14$ ($BD=6$, $DC=8$ vẽ đúng tỉ lệ; $D$ dựng bằng toạ độ là giao của tia phân giác góc $A$ với $BC$). $A$ ở trên, $BC$ nằm ngang dưới, $B$ trái, $C$ phải; hai cung đánh dấu hai góc $BAD$, $DAC$ bằng nhau (bán kính khác nhau); ghi 9 trên $AB$, 12 trên $AC$, 6 trên $BD$ (không ghi độ dài $DC$, không ghi $BC$). Đã verify bằng toạ độ (kiem_N3.mjs): $BD=6$, $DC=8$, $\widehat{BAD}=\widehat{DAC}$, $DB/DC=AB/AC$, $D$ nằm trong $BC$, bất đẳng thức tam giác. Chỉ dùng tính chất đường phân giác + tính chất tỉ lệ thức, không có công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TLt1.png

### TLt2 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** BD=8; DC=12
**noi_dung:**
Cho tam giác $ABC$ có $AB=10$ cm, $AC=15$ cm, $BC=20$ cm.
$AD$ là tia phân giác của góc $A$ ($D\in BC$).
Tính độ dài $BD$ và $DC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ chia cạnh $BC$ thành $BD$, $DC$ tỉ lệ với $AB$, $AC$;
hai đoạn này cộng lại bằng cả cạnh $BC$ nên dùng dãy tỉ số bằng nhau.

**Bước 1.** Nhận ra tia phân giác.
$AD$ là tia phân giác của góc $A$, hai cạnh kề là $AB=10$ và $AC=15$,
cạnh bị chia là $BC$.

**Bước 2.** Viết tỉ lệ thức.
$\dfrac{BD}{DC}=\dfrac{AB}{AC}$, rút gọn được $\dfrac{BD}{DC}=\dfrac{2}{3}$.

**Bước 3.** Đổi thành dãy tỉ số.
$\dfrac{BD}{2}=\dfrac{DC}{3}$ để dùng được tổng $BD+DC$;
tổng đó chính là cạnh $BC$ vì $D$ nằm giữa $B$ và $C$.

**Bước 4.** Tìm giá trị chung rồi suy ra $BD$, $DC$.
Áp dụng tính chất dãy tỉ số bằng nhau tìm giá trị chung,
từ đó tính $BD$ và $DC$.

**Chú ý:** Số $20$ là độ dài cả cạnh $BC$, không phải độ dài $DC$;
trả lời đủ cả hai đoạn $BD$ và $DC$.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Mà $AB=10$, $AC=15$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{10}{15}=\dfrac{2}{3}$.
Suy ra $\dfrac{BD}{2}=\dfrac{DC}{3}$ (tính chất tỉ lệ thức).
Vì $D$ thuộc cạnh $BC$ nên $BD+DC=BC=20$ (gt).
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{BD}{2}=\dfrac{DC}{3}=\dfrac{BD+DC}{2+3}=\dfrac{20}{5}=4$.
Do đó $BD=2\cdot 4=8$ (cm) và $DC=3\cdot 4=12$ (cm).
Vậy $BD=8$ cm, $DC=12$ cm.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; chỉ chỉnh câu chữ. Hình: tam giác $ABC$ dựng đúng $AB=10$, $AC=15$, $BC=20$ ($A$ ở trên-trái, $BC$ nằm ngang); $D$ dựng bằng toạ độ là giao của tia phân giác góc $A$ với $BC$ (nên $BD=8$, $DC=12$ đúng tỉ lệ). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$; ghi 10 trên $AB$, 15 trên $AC$, 20 dưới $BC$ (không ghi $BD$, $DC$). Đã verify bằng toạ độ: $BD=8$, $DC=12$, $BD+DC=BC$, $DB/DC=AB/AC=2/3$, $\widehat{BAD}=\widehat{DAC}$, giá trị chung của dãy tỉ số $=4$. Dùng thêm "tính chất dãy tỉ số bằng nhau" (kiến thức lớp 7, trong whitelist chung lớp 6–7); không dùng công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TLt2.png

### TLt3 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** BD=24; DC=40
**noi_dung:**
Một mảnh vườn hình tam giác $ABC$ có $AB=30$ m, $AC=50$ m, $BC=64$ m.
Người ta làm lối đi thẳng $AD$ ($D\in BC$) sao cho $AD$ là tia phân giác của góc $A$.
Tính khoảng cách $BD$ và $DC$ (m).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Lối đi $AD$ là tia phân giác của góc $A$ nên chia $BC$ thành $BD$, $DC$
tỉ lệ với $AB$, $AC$; $BD+DC=BC$ nên dùng dãy tỉ số bằng nhau.

**Bước 1.** Chuyển bài toán thực tế về hình.
Mảnh vườn là tam giác $ABC$, lối đi $AD$ là tia phân giác của góc $A$
nên dùng được tính chất đường phân giác với hai cạnh kề $AB=30$, $AC=50$.

**Bước 2.** Viết tỉ lệ thức.
$\dfrac{BD}{DC}=\dfrac{AB}{AC}$, rút gọn được $\dfrac{BD}{DC}=\dfrac{3}{5}$.

**Bước 3.** Đổi thành dãy tỉ số.
$\dfrac{BD}{3}=\dfrac{DC}{5}$; tổng $BD+DC$ chính là cạnh $BC$
vì $D$ nằm giữa $B$ và $C$.

**Bước 4.** Tìm giá trị chung rồi suy ra $BD$, $DC$.
Áp dụng tính chất dãy tỉ số bằng nhau để tìm giá trị chung,
từ đó tính $BD$ và $DC$.

**Chú ý:** $64$ m là độ dài cả cạnh $BC$, không phải độ dài $DC$;
cần trả lời đủ hai khoảng cách $BD$ và $DC$.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Mà $AB=30$, $AC=50$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{30}{50}=\dfrac{3}{5}$.
Suy ra $\dfrac{BD}{3}=\dfrac{DC}{5}$ (tính chất tỉ lệ thức).
Vì $D$ thuộc cạnh $BC$ nên $BD+DC=BC=64$ (gt).
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{BD}{3}=\dfrac{DC}{5}=\dfrac{BD+DC}{3+5}=\dfrac{64}{8}=8$.
Do đó $BD=3\cdot 8=24$ (m) và $DC=5\cdot 8=40$ (m).
Vậy $BD=24$ m, $DC=40$ m.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; chỉ chỉnh câu chữ. Hình: tam giác $ABC$ dựng đúng $AB=30$, $AC=50$, $BC=64$ ($A$ ở trên-trái, $BC$ nằm ngang); $AD$ (lối đi) dựng bằng toạ độ là tia phân giác góc $A$ cắt $BC$ tại $D$ ($BD=24$, $DC=40$ đúng tỉ lệ). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$; ghi 30 trên $AB$, 50 trên $AC$, 64 dưới $BC$ (không ghi $BD$, $DC$). Hình vẽ như hình học thuần (không vẽ cảnh vườn). Đã verify bằng toạ độ: $BD=24$, $DC=40$, $BD+DC=BC$, $DB/DC=AB/AC=3/5$, $\widehat{BAD}=\widehat{DAC}$, bất đẳng thức tam giác ($30+50>64$). Dùng thêm "tính chất dãy tỉ số bằng nhau" (lớp 7); không dùng công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TLt3.png

### TLt4 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 140
**noi_dung:**
Một công viên hình tam giác $ABC$ có $AB=150$ m, $AC=200$ m.
Đài phun nước đặt ở điểm $D$ trên $BC$ sao cho $AD$ là tia phân giác của góc $A$ và $DC$ dài hơn $DB$ là $20$ m.
Tính chiều dài $BC$ (m).
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ cho tỉ số $\dfrac{DB}{DC}=\dfrac{AB}{AC}$;
đặt hai đoạn theo cùng một số $k$, dùng hiệu $DC-DB=20$ tìm $k$,
rồi cộng hai đoạn được $BC$.

**Bước 1.** Lập tỉ số từ tính chất đường phân giác.
$AD$ là tia phân giác của góc $A$ nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$;
thay $AB=150$, $AC=200$ rồi rút gọn tỉ số.

**Bước 2.** Đặt ẩn theo tỉ số.
Từ tỉ số đã rút gọn, đặt $DB$ và $DC$ bằng hai bội của cùng một số $k>0$.

**Bước 3.** Dùng hiệu để tìm $k$.
Viết $DC-DB$ theo $k$ rồi cho bằng $20$ để tìm $k$.

**Bước 4.** Tính $DB$, $DC$ rồi $BC$.
Thay $k$ vào để được $DB$ và $DC$; vì $D$ nằm giữa $B$ và $C$ nên $BC=DB+DC$.

**Chú ý:** Đề cho hiệu $DC-DB$ chứ không cho tổng; đề hỏi cả cạnh $BC$,
không phải đoạn $DB$ hay $DC$.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Mà $AB=150$, $AC=200$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{150}{200}=\dfrac{3}{4}$.
Đặt $DB=3k$, $DC=4k$ ($k>0$).
Vì $DC-DB=20$ (gt)
nên $4k-3k=20$, suy ra $k=20$.
Do đó $DB=3\cdot 20=60$ (m) và $DC=4\cdot 20=80$ (m).
Vì $D$ thuộc cạnh $BC$ nên $BC=DB+DC=60+80=140$ (m).
Vậy $BC=140$ m.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; phần "Gợi cách giải" trong de-moi.md KHÔNG đưa vào đề (đã thể hiện ở Phần 1 của lời giải; đề tự đủ dữ kiện: $AB$, $AC$, phân giác, $DC-DB=20$). Hình: tam giác $ABC$ dựng đúng $AB=150$, $AC=200$, $BC=140$ (tỉ lệ), $D$ dựng bằng toạ độ là giao của tia phân giác góc $A$ với $BC$ ($DB=60$, $DC=80$). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$; chỉ ghi 150 trên $AB$ và 200 trên $AC$ (không ghi $BC$, $DB$, $DC$ vì đó là đáp số / hiệu 20 đã nằm trong đề). Đã verify bằng toạ độ: $DB=60$, $DC=80$, $DC-DB=20$, $BC=140$, $DB/DC=3/4$; quét $BC\in(50;350)$ bước $0{,}5$ chỉ có đúng một giá trị $BC=140$ cho $DC-DB=20$ (đáp số duy nhất). Không dùng công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TLt4.png
