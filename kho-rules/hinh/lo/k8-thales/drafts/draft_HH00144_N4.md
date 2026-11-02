### VNt1 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 6
**noi_dung:**
Cho tam giác $ABC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$).
Biết $AB=15$, $AC=10$, $BD=9$.
Tính $x=DC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ chia cạnh đối diện $BC$
thành hai đoạn $DB$, $DC$ tỉ lệ với hai cạnh kề $AB$, $AC$.

**Bước 1.** Nhận ra tia phân giác.
$AD$ là tia phân giác của góc $A$, $D$ nằm trên cạnh đối diện $BC$
nên dùng được tính chất đường phân giác.

**Bước 2.** Viết tỉ lệ thức.
Đoạn nào chứa đỉnh $B$ thì đi với cạnh $AB$,
đoạn nào chứa đỉnh $C$ thì đi với cạnh $AC$.

**Bước 3.** Thay số rồi tìm $x$.
Thay $BD$, $AB$, $AC$ đã cho và $DC=x$ vào tỉ lệ thức,
tìm $x$ bằng tính chất của tỉ lệ thức.

**Chú ý:** Ở hình này $AB$ dài hơn $AC$ nên $DB$ cũng phải dài hơn $DC$;
nếu kết quả không thoả điều này thì đã ghép chéo.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Thay số: $\dfrac{9}{x}=\dfrac{15}{10}$ (gt).
Suy ra $x=\dfrac{9\cdot 10}{15}=6$ (tính chất tỉ lệ thức).
Vậy $DC=6$.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; chỉ thêm "$x=DC$" cho khớp hình (ghi $x$ trên $DC$, không ghi đáp số). Tam giác $ABC$ dựng đúng $AB=15$, $AC=10$, $BC=15$ ($BD=9$, $DC=6$ vẽ đúng tỉ lệ); $B$ trái, $C$ phải, $A$ ở trên và lệch về phía $C$ nên $AB$ dài hơn $AC$ (khác hình trên lớp). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$. Đã verify bằng toạ độ (kiem_N4.mjs, $D$ dựng bằng véc-tơ đơn vị, không dùng công thức tỉ số): $BD=9$, $DC=6$, $\widehat{BAD}=\widehat{DAC}$, $DB/DC=AB/AC$, $D$ nằm trong đoạn $BC$. Chỉ dùng tính chất đường phân giác + tỉ lệ thức, không có công cụ ngoài whitelist. Nhận xét: $BC=15=AB$ nên tam giác cân tại $B$ (ngẫu nhiên do số liệu CTO chọn, không ảnh hưởng lời giải). Không có nghi vấn.
**hinh:** VNt1.png

### VNt2 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** BD=6; DC=8
**noi_dung:**
Cho tam giác $ABC$ có $AB=21$ cm, $AC=28$ cm, $BC=14$ cm.
Tia phân giác của góc $A$ cắt cạnh $BC$ tại $D$.
Tính $x=BD$ và $y=DC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ chia cạnh $BC$ thành $DB$, $DC$
tỉ lệ với $AB$, $AC$; hai đoạn đó cộng lại bằng cả cạnh $BC$.

**Bước 1.** Nhận ra tia phân giác.
$AD$ phân giác góc $A$, hai cạnh kề là $AB$, $AC$,
cạnh bị chia là $BC$.

**Bước 2.** Viết tỉ lệ thức.
$\dfrac{DB}{DC}=\dfrac{AB}{AC}$, rồi rút gọn tỉ số hai cạnh cho đơn giản.

**Bước 3.** Đổi thành dãy tỉ số.
Tỉ số rút gọn được là $\dfrac{3}{4}$, viết $\dfrac{DB}{3}=\dfrac{DC}{4}$
để dùng được tổng $DB+DC$.

**Bước 4.** Dùng tổng bằng cả cạnh $BC$.
$D$ nằm giữa $B$ và $C$ nên $DB+DC=BC$;
áp dụng tính chất dãy tỉ số bằng nhau tìm giá trị chung.

**Bước 5.** Tính $BD$ và $DC$.
Nhân giá trị chung với từng mẫu số.

**Chú ý:** Số $14$ là độ dài cả cạnh $BC$, không phải độ dài $DC$ hay $BD$;
tính xong phải có $DB+DC=BC$.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Mà $AB=21$ cm, $AC=28$ cm (gt)
nên $\dfrac{DB}{DC}=\dfrac{21}{28}=\dfrac{3}{4}$.
Suy ra $\dfrac{DB}{3}=\dfrac{DC}{4}$ (tính chất tỉ lệ thức).
Vì $D$ thuộc cạnh $BC$ nên $DB+DC=BC=14$ cm (gt).
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{DB}{3}=\dfrac{DC}{4}=\dfrac{DB+DC}{3+4}=\dfrac{14}{7}=2$.
Do đó $x=BD=3\cdot 2=6$ (cm)
và $y=DC=4\cdot 2=8$ (cm).
Vậy $BD=6$ cm, $DC=8$ cm.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; thêm đặt tên $x=BD$, $y=DC$ cho khớp nhãn trên hình (đáp án vẫn viết theo `dap_an`: BD=6; DC=8). Tam giác $ABC$ dựng đúng $AB=21$, $AC=28$, $BC=14$ (góc $B$ tù); để hình cân đối đặt $AC$ nằm ngang ($A$ trái, $C$ phải, $B$ ở trên), $D\in BC$ dựng là giao của phân giác góc $A$ với $BC$ nên $BD=6$, $DC=8$ đúng tỉ lệ (không ghi đáp số). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$; cung đứt nét từ $B$ tới $C$ ghi $14$ (cả cạnh $BC$); ghi $21$, $28$, $x$ trên $BD$, $y$ trên $DC$. Đã verify bằng toạ độ (kiem_N4.mjs): $BD=6$, $DC=8$, $DB/DC=3/4$, $BD+DC=14$, phân giác đúng, tam giác tồn tại. Dùng "tính chất dãy tỉ số bằng nhau" (lớp 7, trong whitelist chung); không có công cụ ngoài whitelist. Không có nghi vấn toán.
**hinh:** VNt2.png

### VNt3 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** BD=3,6; DC=5,4
**noi_dung:**
Cho tam giác $ABC$ có $AB=4$ cm, $AC=6$ cm, $BC=9$ cm.
Tia phân giác của góc $A$ cắt cạnh $BC$ tại $D$.
Tính $x=BD$ và $y=DC$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $AD$ chia cạnh $BC$ thành $DB$, $DC$
tỉ lệ với $AB$, $AC$; hai đoạn đó cộng lại bằng cả cạnh $BC$.

**Bước 1.** Nhận ra tia phân giác.
$AD$ phân giác góc $A$, hai cạnh kề là $AB$, $AC$,
cạnh bị chia là $BC$.

**Bước 2.** Viết tỉ lệ thức và rút gọn.
$\dfrac{DB}{DC}=\dfrac{AB}{AC}$, rút gọn tỉ số hai cạnh
về hai số nguyên nhỏ nhất.

**Bước 3.** Đổi thành dãy tỉ số.
Tỉ số rút gọn được là $\dfrac{2}{3}$, viết $\dfrac{DB}{2}=\dfrac{DC}{3}$
để dùng được tổng $DB+DC$.

**Bước 4.** Dùng tổng bằng cả cạnh $BC$.
$D$ nằm giữa $B$ và $C$ nên $DB+DC=BC$;
áp dụng tính chất dãy tỉ số bằng nhau tìm giá trị chung.

**Bước 5.** Tính $BD$ và $DC$.
Nhân giá trị chung với từng mẫu số.

**Chú ý:** Kết quả có thể là số thập phân, đừng làm tròn;
$BC=9$ là cả cạnh, không phải $BD$ hay $DC$,
và đoạn $DB$ đi với cạnh ngắn hơn ($AB$).

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Mà $AB=4$ cm, $AC=6$ cm (gt)
nên $\dfrac{DB}{DC}=\dfrac{4}{6}=\dfrac{2}{3}$.
Suy ra $\dfrac{DB}{2}=\dfrac{DC}{3}$ (tính chất tỉ lệ thức).
Vì $D$ thuộc cạnh $BC$ nên $DB+DC=BC=9$ cm (gt).
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{DB}{2}=\dfrac{DC}{3}=\dfrac{DB+DC}{2+3}=\dfrac{9}{5}=1{,}8$.
Do đó $x=BD=2\cdot 1{,}8=3{,}6$ (cm)
và $y=DC=3\cdot 1{,}8=5{,}4$ (cm).
Vậy $BD=3{,}6$ cm, $DC=5{,}4$ cm.
**cấu hình hình / nghi vấn:**
Đề do CTO soạn theo yêu cầu tài liệu (de-moi.md), giữ nguyên số liệu; thêm đặt tên $x=BD$, $y=DC$ cho khớp nhãn trên hình (đáp án vẫn viết theo `dap_an`: BD=3,6; DC=5,4). Kiểm tam giác tồn tại: $4+6>9$ nên là tam giác (khá "bẹt": đường cao từ $A$ chỉ khoảng $2{,}1$). Dựng đúng $AB=4$, $AC=6$, $BC=9$ ($B$ trái, $C$ phải, $A$ ở trên, gần $B$ hơn); $D$ dựng là giao của phân giác góc $A$ với $BC$ nên $BD=3{,}6$, $DC=5{,}4$ đúng tỉ lệ (không ghi đáp số). Hai cung đánh dấu $\widehat{BAD}=\widehat{DAC}$ (bán kính khác nhau); cung đứt nét từ $B$ tới $C$ ghi $9$ (cả cạnh $BC$); ghi $4$, $6$, $x$ trên $BD$, $y$ trên $DC$. Đã verify bằng toạ độ (kiem_N4.mjs): $BD=3{,}6$, $DC=5{,}4$, $DB/DC=2/3$, $BD+DC=9$, phân giác đúng. Dùng "tính chất dãy tỉ số bằng nhau" (lớp 7); không có công cụ ngoài whitelist. Không có nghi vấn toán.
**hinh:** VNt3.png
