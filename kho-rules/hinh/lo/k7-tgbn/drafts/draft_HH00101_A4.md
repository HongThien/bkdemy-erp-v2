### TL2.1 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $M$ là trung điểm của $BC$.
Trên tia đối của tia $MA$ lấy điểm $D$ sao cho $MA=MD$.
Chứng minh $\triangle AMB=\triangle DMC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Đề cho $M$ là trung điểm $BC$ và $MA=MD$: hai cặp cạnh bằng nhau cùng đi qua $M$. Cặp góc xen giữa là hai góc đối đỉnh, nên dùng trường hợp c.g.c cho $\triangle AMB$ và $\triangle DMC$.

**Bước 1.** Từ "$M$ là trung điểm của $BC$" suy ra $MB=MC$.

**Bước 2.** Đề cho sẵn $MA=MD$.

**Bước 3.** $D$ nằm trên tia đối của tia $MA$ nên $\widehat{AMB}$ và $\widehat{DMC}$ là hai góc đối đỉnh, do đó bằng nhau.

**Bước 4.** Ghép ba điều kiện theo đúng thứ tự đỉnh $A\to D$, $M\to M$, $B\to C$ rồi kết luận theo c.g.c.

**Chú ý:** Góc bằng nhau phải là góc XEN GIỮA hai cạnh đã cho ($\widehat{AMB}$ nằm giữa $MA$ và $MB$).

**Phần 2. Trình bày**
Xét $\triangle AMB$ và $\triangle DMC$ có:
$MA=MD$ (gt);
$\widehat{AMB}=\widehat{DMC}$ (hai góc đối đỉnh);
$MB=MC$ ($M$ là trung điểm của $BC$)
nên $\triangle AMB=\triangle DMC$ (c.g.c).
**cấu hình hình / nghi vấn:**
Ảnh gốc t-08 KHÔNG có hình cho bài này; hình tự dựng đúng đề: $M$ trung điểm $BC$, $D=2M-A$, vẽ thêm đoạn $DC$ (cạnh của $\triangle DMC$). Tam giác $ABC$ lệch (không cân). Có gạch $MB=MC$ (2 gạch), $MA=MD$ (1 gạch) vì đều là dữ kiện đề.
Verify (kiem_A4.mjs): 2 bộ toạ độ; $MA=MD$, $MB=MC$, góc đối đỉnh, $A,M,D$ và $B,M,C$ thẳng hàng $M$ ở giữa, $AB=DC$, $\widehat{B}=\widehat{C}$ — PASS.
Chỉ dùng c.g.c, góc đối đỉnh, trung điểm (trong whitelist). Không có nghi vấn.
**hinh:** HH00101_TL2-1.png

### TL2.2 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $AB=AC$.
Kẻ tia phân giác $AD$ của góc $A$ ($D$ thuộc $BC$).
a) Chứng minh $\triangle ABD=\triangle ACD$.
b) Chứng minh $D$ là trung điểm của $BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Có $AB=AC$, $AD$ là tia phân giác của góc $A$ (cho hai góc bằng nhau) và $AD$ là cạnh chung của hai tam giác $ABD$, $ACD$: đủ c.g.c. Ý b) lấy từ hai cạnh tương ứng $BD$, $CD$.

**Bước 1.** Ý a) Viết hai cạnh $AB=AC$ (đề cho) và cạnh chung $AD$.

**Bước 2.** Ý a) Từ tia phân giác $AD$ suy ra $\widehat{BAD}=\widehat{CAD}$, đây là góc xen giữa hai cạnh vừa nêu; kết luận theo c.g.c.

**Bước 3.** Ý b) Từ $\triangle ABD=\triangle ACD$ suy ra $BD=CD$ (hai cạnh tương ứng).

**Bước 4.** Ý b) Vì $D$ thuộc cạnh $BC$ nên $D$ nằm giữa $B$ và $C$; kết hợp $BD=CD$ ta được $D$ là trung điểm của $BC$.

**Chú ý:** Muốn kết luận "trung điểm" cần đủ HAI điều: $D$ nằm giữa $B$, $C$ và $DB=DC$.

**Phần 2. Trình bày**
a) Xét $\triangle ABD$ và $\triangle ACD$ có:
$AB=AC$ (gt);
$\widehat{BAD}=\widehat{CAD}$ ($AD$ là tia phân giác của góc $A$);
$AD$ là cạnh chung
nên $\triangle ABD=\triangle ACD$ (c.g.c).

b) Vì $\triangle ABD=\triangle ACD$ (cmt)
nên $BD=CD$ (hai cạnh tương ứng).
Mà $D$ nằm giữa $B$ và $C$ ($D$ thuộc cạnh $BC$)
nên $D$ là trung điểm của $BC$.
**cấu hình hình / nghi vấn:**
Ảnh gốc t-08 KHÔNG có hình cho bài này; hình tự dựng: $AB=AC$ (1 gạch mỗi cạnh), hai cung bằng nhau ở $A$ (tia phân giác $AD$ là dữ kiện đề), $D$ trên $BC$. KHÔNG gạch $BD$, $CD$ và không vẽ ô vuông ở $D$ (điều cần chứng minh / không cho). Đề nói "$D$ thuộc $BC$" hiểu là thuộc cạnh $BC$ (phân giác trong của góc $A$); ghi rõ ở lời giải "thuộc cạnh $BC$".
Verify (kiem_A4.mjs): 2 bộ toạ độ; $AB=AC$, $\widehat{BAD}=\widehat{CAD}$, $BD=CD$, $D$ nằm giữa $B,C$ và là trung điểm — PASS.
Chỉ dùng c.g.c, tia phân giác, trung điểm (trong whitelist; không dùng tính chất tam giác cân). Không có nghi vấn.
**hinh:** HH00101_TL2-2.png

### TL2.3 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ bên.
Biết $MN=PQ$ và $MN\parallel PQ$.
Chứng minh $\triangle MNP=\triangle PQM$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hình có $MN=PQ$ (cặp cạnh bằng nhau), $MP$ là cạnh chung, còn $MN\parallel PQ$ cho cặp góc so le trong xen giữa hai cạnh đó: dùng c.g.c cho $\triangle MNP$ và $\triangle PQM$.

**Bước 1.** Ghi cặp cạnh bằng nhau $MN=PQ$ (đề cho) và cạnh chung $MP$.

**Bước 2.** Vì $MN\parallel PQ$, cát tuyến $MP$ tạo hai góc so le trong $\widehat{NMP}$ và $\widehat{QPM}$, nên chúng bằng nhau.

**Bước 3.** Ghép theo đúng thứ tự đỉnh $M\to P$, $N\to Q$, $P\to M$ rồi kết luận c.g.c.

**Chú ý:** Thứ tự đỉnh phải khớp: $\triangle MNP=\triangle PQM$ (không viết $\triangle MNP=\triangle PMQ$).

**Phần 2. Trình bày**
Vì $MN\parallel PQ$ (gt)
nên $\widehat{NMP}=\widehat{QPM}$ (hai góc so le trong).
Xét $\triangle MNP$ và $\triangle PQM$ có:
$MN=PQ$ (gt);
$\widehat{NMP}=\widehat{QPM}$ (cmt);
$MP$ là cạnh chung
nên $\triangle MNP=\triangle PQM$ (c.g.c).
**cấu hình hình / nghi vấn:**
Hình theo ảnh gốc: $M$ trái trên, $N$ phải trên, $P$ phải dưới, $Q$ trái dưới, đường chéo $MP$; gạch 1 mỗi cạnh $MN$ và $PQ$; dựng đúng $MN\parallel PQ$, $MN=PQ$. KHÔNG đánh dấu góc.
Đề bản in chỉ ghi "Biết $MN\parallel PQ$", còn $MN=PQ$ chỉ có trên hình (gạch) — đã ghi cả hai vào đề cho tự đủ dữ kiện.
Verify (kiem_A4.mjs): 2 bộ toạ độ; $MN\parallel PQ$, $MN=PQ$, $N$ và $Q$ khác phía $MP$, $\widehat{NMP}=\widehat{QPM}$, $NP=QM$, $\widehat{N}=\widehat{Q}$ — PASS.
Chỉ dùng c.g.c, hai góc so le trong (trong whitelist). Không có nghi vấn.
**hinh:** HH00101_TL2-3.png

### TL2.4 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ bên.
Biết $FG=HG$ và $EG$ là tia phân giác của góc $FGH$.
a) Chứng minh $\triangle EFG=\triangle EHG$.
b) Chứng minh $EF=EH$.
c) Chứng minh $EG$ là tia phân giác của góc $FEH$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Có $FG=HG$, tia phân giác $EG$ cho hai góc bằng nhau ở đỉnh $G$ và $EG$ là cạnh chung: dùng c.g.c cho $\triangle EFG$, $\triangle EHG$. Hai ý sau suy từ các yếu tố tương ứng.

**Bước 1.** Ý a) Nêu $FG=HG$ (đề cho), $\widehat{FGE}=\widehat{HGE}$ (tia phân giác $GE$ của góc $FGH$) và cạnh chung $EG$; kết luận c.g.c.

**Bước 2.** Ý b) $EF$ và $EH$ là hai cạnh tương ứng của hai tam giác vừa bằng nhau.

**Bước 3.** Ý c) $\widehat{FEG}$ và $\widehat{HEG}$ là hai góc tương ứng nên bằng nhau.

**Bước 4.** Ý c) Tia $EG$ nằm giữa hai tia $EF$, $EH$ (theo hình) và tạo hai góc bằng nhau, nên là tia phân giác của góc $FEH$.

**Chú ý:** Ở ý c) đừng quên nêu tia $EG$ nằm giữa $EF$ và $EH$; chỉ có hai góc bằng nhau là chưa đủ.

**Phần 2. Trình bày**
a) Xét $\triangle EFG$ và $\triangle EHG$ có:
$FG=HG$ (gt);
$\widehat{FGE}=\widehat{HGE}$ ($GE$ là tia phân giác của góc $FGH$);
$EG$ là cạnh chung
nên $\triangle EFG=\triangle EHG$ (c.g.c).

b) Vì $\triangle EFG=\triangle EHG$ (cmt)
nên $EF=EH$ (hai cạnh tương ứng).

c) Vì $\triangle EFG=\triangle EHG$ (cmt)
nên $\widehat{FEG}=\widehat{HEG}$ (hai góc tương ứng).
Mà tia $EG$ nằm giữa hai tia $EF$ và $EH$ (theo hình)
nên $EG$ là tia phân giác của góc $FEH$.
**cấu hình hình / nghi vấn:**
Hình theo ảnh gốc: $E$ trái, $F$ trên, $G$ phải, $H$ dưới, đoạn $EG$; gạch 1 trên $FG$ và $HG$; cung góc ở $G$ (hai cung bằng nhau, bán kính bằng nhau như một cung liền trong ảnh). KHÔNG đánh dấu $EF=EH$ hay góc ở $E$. Hình đối xứng qua $EG$ nên tam giác $EFG$ không cân/đều.
Verify (kiem_A4.mjs): 2 bộ toạ độ; $FG=HG$, $\widehat{FGE}=\widehat{HGE}$, $EF=EH$, $\widehat{FEG}=\widehat{HEG}$, $F,H$ khác phía $EG$, góc $FEG$ + $GEH$ = góc $FEH$ (tia $EG$ nằm giữa) — PASS.
Chỉ dùng c.g.c, tia phân giác (trong whitelist). Không có nghi vấn.
**hinh:** HH00101_TL2-4.png
