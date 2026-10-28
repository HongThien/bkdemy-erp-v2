### TL1a → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 4
**noi_dung:**
Cho tam giác $ABC$ có $AB=6$, $AC=8$.
Tia phân giác của góc $A$ cắt cạnh $BC$ tại $D$, biết $BD=3$.
Tính $x=DC$.
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

**Bước 3.** Thay số rồi tìm $x$.
Thay $DB=3$, $AB=6$, $AC=8$, $DC=x$ vào tỉ lệ thức,
tìm $x$ bằng tính chất của tỉ lệ thức.

**Chú ý:** Đoạn $DB$ đi với cạnh $AB$ (cùng chứa đỉnh $B$),
đoạn $DC$ đi với cạnh $AC$; đừng ghép chéo.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Thay số: $\dfrac{3}{x}=\dfrac{6}{8}$ (gt).
Suy ra $x=\dfrac{3\cdot 8}{6}=4$ (tính chất tỉ lệ thức).
Vậy $DC=4$.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ dựng đúng $AB=6$, $AC=8$, $BC=7$ ($BD=3$, $DC=x=4$ vẽ đúng tỉ lệ; $D$ là chân phân giác dựng bằng toạ độ). $A$ ở trên, $BC$ nằm ngang dưới; hai cung đánh dấu hai góc $BAD$, $DAC$ bằng nhau (bán kính khác nhau); ghi 6, 8, 3 và $x$ (không ghi đáp số 4). Đúng bố cục ảnh t-16. Đã verify bằng toạ độ (kiem_G8.mjs): $BD=3$, $DC=4$, $\widehat{BAD}=\widehat{DAC}$. Chỉ dùng tính chất đường phân giác + tỉ lệ thức, không có công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TL1a.png

### TL1b → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 28/3
**noi_dung:**
Cho tam giác $ABC$ có $AB=14$, $BC=16$, $AC=20$.
Tia phân giác của góc $B$ cắt cạnh $AC$ tại $E$.
Tính $x=AE$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $BE$ của góc $B$ chia cạnh đối diện $AC$
thành hai đoạn $EA$, $EC$ tỉ lệ với hai cạnh kề $BA$, $BC$
(đỉnh phân giác là $B$ chứ không phải $A$).

**Bước 1.** Xác định đỉnh của góc được chia.
Đỉnh là $B$ nên hai cạnh kề là $BA=14$ và $BC=16$,
còn cạnh bị chia là $AC$.

**Bước 2.** Viết tỉ lệ thức.
$\dfrac{EA}{EC}=\dfrac{BA}{BC}$, rút gọn được $\dfrac{EA}{EC}=\dfrac{7}{8}$.

**Bước 3.** Đổi thành dãy tỉ số.
$\dfrac{EA}{7}=\dfrac{EC}{8}$ để dùng được tổng $EA+EC$;
tổng đó chính là cạnh $AC$ vì $E$ nằm giữa $A$ và $C$.

**Bước 4.** Tìm $EA$.
Áp dụng tính chất dãy tỉ số bằng nhau tìm giá trị chung,
từ đó suy ra $EA$.

**Chú ý:** Số $20$ là độ dài cả cạnh $AC$, không phải độ dài $EC$.

**Phần 2. Trình bày**
Vì $BE$ là tia phân giác của góc $B$ (gt)
nên $\dfrac{EA}{EC}=\dfrac{BA}{BC}$ (tính chất đường phân giác).
Mà $BA=14$, $BC=16$ (gt)
nên $\dfrac{EA}{EC}=\dfrac{14}{16}=\dfrac{7}{8}$.
Suy ra $\dfrac{EA}{7}=\dfrac{EC}{8}$ (tính chất tỉ lệ thức).
Vì $E$ thuộc cạnh $AC$ nên $EA+EC=AC=20$ (gt).
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{EA}{7}=\dfrac{EC}{8}=\dfrac{EA+EC}{7+8}=\dfrac{20}{15}=\dfrac{4}{3}$.
Do đó $x=EA=7\cdot\dfrac{4}{3}=\dfrac{28}{3}$.
Vậy $AE=\dfrac{28}{3}$.
**cấu hình hình / nghi vấn:**
Tam giác $ABC$ dựng đúng $AB=14$, $BC=16$, $AC=20$ (toạ độ; $A$ ở trên-trái, $BC$ nằm ngang); $E$ dựng là giao của tia phân giác góc $B$ với $AC$, nên $AE=28/3$ đúng tỉ lệ (không ghi đáp số). Hai cung đánh dấu $\widehat{ABE}=\widehat{EBC}$; cung đứt nét từ $A$ tới $C$ ghi 20 (độ dài cả cạnh $AC$); ghi 14, 16, $x$ trên đoạn $AE$. Đúng bố cục ảnh t-16 (hình a). Đã verify bằng toạ độ: $AE=28/3$, $EC=32/3$, $AE/EC=7/8$, $\widehat{ABE}=\widehat{EBC}$. Dùng thêm "tính chất dãy tỉ số bằng nhau" (kiến thức lớp 7, trong whitelist chung lớp 6–7); không dùng công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TL1b.png

### TL1c → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** 8,25
**noi_dung:**
Cho tam giác $MNP$ có $MP=10$, $NP=12$.
Tia phân giác của góc $P$ cắt cạnh $MN$ tại $I$, biết $IN=4{,}5$.
Tính $x=MN$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tia phân giác $PI$ chia cạnh $MN$ thành $IM$, $IN$
tỉ lệ với hai cạnh kề $PM$, $PN$;
tìm $IM$ rồi cộng với $IN$ để được cả cạnh $MN$.

**Bước 1.** Nhận ra tia phân giác.
$PI$ là tia phân giác của góc $P$, hai cạnh kề là $PM=10$, $PN=12$,
cạnh bị chia là $MN$.

**Bước 2.** Viết tỉ lệ thức.
$\dfrac{IM}{IN}=\dfrac{PM}{PN}$.

**Bước 3.** Tính $IM$.
Thay $PM=10$, $PN=12$, $IN=4{,}5$ vào tỉ lệ thức.

**Bước 4.** Tính $MN$.
$I$ nằm giữa $M$ và $N$ nên cộng $IM$ với $IN$.

**Chú ý:** Ẩn $x$ là cả cạnh $MN$, không phải đoạn $IM$;
tính xong $IM$ chưa được dừng.

**Phần 2. Trình bày**
Vì $PI$ là tia phân giác của góc $P$ (gt)
nên $\dfrac{IM}{IN}=\dfrac{PM}{PN}$ (tính chất đường phân giác).
Thay số: $\dfrac{IM}{4{,}5}=\dfrac{10}{12}$ (gt).
Suy ra $IM=\dfrac{4{,}5\cdot 10}{12}=3{,}75$ (tính chất tỉ lệ thức).
Vì $I$ thuộc cạnh $MN$ nên $MN=MI+IN$.
Do đó $x=MN=3{,}75+4{,}5=8{,}25$.
Vậy $MN=8{,}25$.
**cấu hình hình / nghi vấn:**
Tam giác $MNP$ dựng đúng $MP=10$, $NP=12$, $MN=8{,}25$ ($M$ ở trên, $NP$ nằm ngang đáy, $N$ trái, $P$ phải); $I\in MN$ dựng với $IN=4{,}5$ (đúng tỉ lệ). Hai cung đánh dấu $\widehat{MPI}=\widehat{IPN}$ tại $P$; cung đứt nét từ $M$ tới $N$ ghi $x$; ghi 10, 12, 4,5 (không ghi 8,25). Đúng bố cục ảnh t-16 (hình b). Đã verify bằng toạ độ: bộ ba cạnh $(10; 12; 8{,}25)$ cho chân phân giác $I$ có $IN=4{,}5$, $IM=3{,}75$ và $\widehat{MPI}=\widehat{IPN}$. Không dùng công cụ ngoài whitelist. Không có nghi vấn.
**hinh:** TL1c.png

### TL2.1 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$.
$AD$ là tia phân giác của góc $A$ ($D\in BC$).
Kẻ $DE$ vuông góc với $AC$ ($E\in AC$).
Chứng minh $\dfrac{AB}{AC}=\dfrac{AE}{EC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$\dfrac{AB}{AC}=\dfrac{AE}{EC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{DB}{DC}$)
$\dfrac{AB}{AC}=\dfrac{DB}{DC}$ · $\dfrac{AE}{EC}=\dfrac{DB}{DC}$
**Nhánh ①:** $\dfrac{AB}{AC}=\dfrac{DB}{DC}$
$\Uparrow$ (tính chất đường phân giác)
$AD$ là tia phân giác của góc $A$ (gt) ✓ · $D\in BC$ (gt) ✓
**Nhánh ②:** $\dfrac{AE}{EC}=\dfrac{DB}{DC}$
$\Uparrow$ (định lí Thalès trong $\triangle ABC$)
$DE\parallel AB$ · $D\in BC$ (gt) ✓ · $E\in AC$ (gt) ✓
**Nhánh ②.1:** $DE\parallel AB$
$\Uparrow$ (hai đường thẳng cùng vuông góc với một đường thẳng thứ ba thì song song)
$DE\perp AC$ (gt) ✓ · $AB\perp AC$ (gt) ✓

**Phần 2. Trình bày**
Vì $DE\perp AC$ (gt)
và $AB\perp AC$ (gt)
nên $DE\parallel AB$ (hai đường thẳng cùng vuông góc với một đường thẳng thứ ba).
Xét $\triangle ABC$ có:
$D\in BC$, $E\in AC$ (gt);
$DE\parallel AB$ (cmt)
nên $\dfrac{AE}{EC}=\dfrac{DB}{DC}$ (định lí Thalès).
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Vậy $\dfrac{AB}{AC}=\dfrac{AE}{EC}$ (cùng bằng $\dfrac{DB}{DC}$).
**cấu hình hình / nghi vấn:**
SỬA LỖI ĐỀ: bản in ghi "$DE$ vuông góc với $AB$" ⇒ sửa thành "$DE$ vuông góc với $AC$" (và $E\in AC$ như đề đã ghi). Lý do: nếu $DE\perp AB$ thì $E\in AB$ và hệ thức $\dfrac{AB}{AC}=\dfrac{AE}{EC}$ không đúng khi $AB\ne AC$ (đã thử bằng toạ độ: $AB=3$, $AC=5$ cho $\dfrac{AB}{AC}=0{,}6$ nhưng $\dfrac{AE'}{E'C}\approx 0{,}35$ khi $E'$ là chân vuông góc hạ từ $D$ xuống $AB$); còn $DE\perp AC$ thì $DE\parallel AB$ và hệ thức đúng. Cần Thùy xác nhận việc sửa đề này.
Hình: $\triangle ABC$ vuông tại $A$ ($AB$ đứng, $AC$ ngang, theo quy ước 23/10), $AB=3$, $AC=5$ (chỉ để vẽ, $AB\ne AC$ để $D$ không là trung điểm); $AD$ là phân giác dựng đúng (cắt $BC$ tại $D$, $\widehat{BAD}=\widehat{DAC}=45^\circ$ — hai cung bán kính khác nhau), $DE\perp AC$ tại $E$ (ô vuông tại $E$ và ô vuông tại $A$). Không đánh dấu tỉ số nào bằng nhau, không vẽ sẵn điều phải chứng minh. Đã verify bằng toạ độ trên 6 bộ $(AB,AC)$ khác nhau: $DE\parallel AB$; $CE/EA=CD/DB$; $DB/DC=AB/AC$; $AE/EC=AB/AC$ — tất cả PASS. Lời giải chỉ dùng: hai đường thẳng cùng vuông góc với đường thẳng thứ ba (lớp 7), định lí Thalès, tính chất đường phân giác (đều trong whitelist). Hình không có đường kẻ thêm nên không cần hinh_lg.
**hinh:** TL2-1.png
