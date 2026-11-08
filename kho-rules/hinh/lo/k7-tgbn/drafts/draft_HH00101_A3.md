### TL1.1 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình cho hai cạnh và góc ở giữa hai cạnh đó bằng nhau, nên dùng trường hợp c.g.c cho hai tam giác $ABC$ và $MNP$.

**Bước 1.** Ý a) Đọc kí hiệu: cạnh cùng số gạch thì bằng nhau ($AB$ và $MN$ cùng 1 gạch; $AC$ và $MP$ cùng 2 gạch), góc cùng cung thì bằng nhau ($\widehat{A}$ và $\widehat{M}$).

**Bước 2.** Ý b) Kiểm tra góc đánh dấu có nằm giữa hai cạnh bằng nhau không: $\widehat{A}$ nằm giữa $AB$, $AC$; $\widehat{M}$ nằm giữa $MN$, $MP$ nên là trường hợp c.g.c.

**Bước 3.** Ý b) Ghép đỉnh theo cặp cạnh bằng nhau: $A\to M$, $B\to N$ (vì $AB=MN$), $C\to P$ (vì $AC=MP$). Viết $\triangle ABC=\triangle MNP$.

**Bước 4.** Ý c) Từ hai tam giác bằng nhau, suy ra mọi cặp còn lại: cạnh $BC$ với $NP$, góc $B$ với $N$, góc $C$ với $P$.

**Chú ý:** $AB$ ứng với $MN$ (cùng 1 gạch), không phải $MP$. Viết sai thứ tự đỉnh ($\triangle ABC=\triangle MPN$) là sai tương ứng.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=MN$ (gt);
$\widehat{A}=\widehat{M}$ (gt);
$AC=MP$ (gt).

b) Xét $\triangle ABC$ và $\triangle MNP$ có:
$AB=MN$ (gt);
$\widehat{BAC}=\widehat{NMP}$ (gt);
$AC=MP$ (gt)
nên $\triangle ABC=\triangle MNP$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle ABC=\triangle MNP$ (cmt) nên
$BC=NP$ (hai cạnh tương ứng);
$\widehat{ABC}=\widehat{MNP}$ (hai góc tương ứng);
$\widehat{ACB}=\widehat{MPN}$ (hai góc tương ứng).
**cấu hình hình / nghi vấn:**
Hình: hai tam giác $ABC$ ($A$ trên, $B$ trái dưới, $C$ phải dưới) và $MPN$ ($M$ trên, $P$ trái dưới, $N$ phải dưới), đối xứng gương như ảnh gốc. Kí hiệu đúng ảnh phóng to: $AB$ 1 gạch, $AC$ 2 gạch; $MN$ 1 gạch, $MP$ 2 gạch; góc $A$ và góc $M$ mỗi góc 1 cung. KHÔNG ghi $BC=NP$ (điều suy ra).
NGHI VẤN ĐÃ SỬA: `de-nguon.md` ghi "$AB=MP$, $AC=MN$" — ảnh phóng to cho thấy $AB$ (1 gạch) ứng $MN$ (1 gạch), $AC$ (2 gạch) ứng $MP$ (2 gạch); nên tam giác viết là $\triangle ABC=\triangle MNP$ (đã chốt theo ảnh; ghép theo de-nguon sẽ sai tương ứng — kiểm toạ độ: $AB\neq MP$).
Verify (kiem_A3.mjs, 2 bộ toạ độ): $AB=MN$, $AC=MP$, góc $A=M$, suy ra $BC=NP$, $B=N$, $C=P$ — PASS. Chỉ dùng c.g.c, hai cạnh/góc tương ứng (trong whitelist).
**hinh:** HH00101_TL1-1.png

### TL1.2 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình cho $AB=AC$ và hai góc cùng đỉnh $A$ bằng nhau, lại có cạnh $AD$ dùng chung, nên xét $\triangle ABD$ và $\triangle ACD$ theo c.g.c.

**Bước 1.** Ý a) Đọc kí hiệu: $AB$ và $AC$ cùng 1 gạch; hai góc ở đỉnh $A$ cùng 1 cung, tức $\widehat{BAD}=\widehat{CAD}$.

**Bước 2.** Ý b) Tìm cạnh thứ hai của mỗi tam giác kẹp góc đó: cạnh $AD$ nằm trong cả hai tam giác, nên là cạnh chung.

**Bước 3.** Ý b) Góc $\widehat{BAD}$ nằm giữa $AB$, $AD$; góc $\widehat{CAD}$ nằm giữa $AC$, $AD$ nên là c.g.c. Ghép đỉnh $A\to A$, $B\to C$, $D\to D$.

**Bước 4.** Ý c) Liệt kê các cặp còn lại: cạnh $BD$ với $CD$, góc $B$ với $C$, góc $D$ với $D$ (đều hai đỉnh tương ứng).

**Chú ý:** cạnh $AD$ không có kí hiệu trên hình, phải tự nhận ra đó là cạnh chung.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=AC$ (gt);
$\widehat{BAD}=\widehat{CAD}$ (gt).

b) Xét $\triangle ABD$ và $\triangle ACD$ có:
$AB=AC$ (gt);
$\widehat{BAD}=\widehat{CAD}$ (gt);
$AD$ là cạnh chung
nên $\triangle ABD=\triangle ACD$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle ABD=\triangle ACD$ (cmt) nên
$BD=CD$ (hai cạnh tương ứng);
$\widehat{ABD}=\widehat{ACD}$ (hai góc tương ứng);
$\widehat{ADB}=\widehat{ADC}$ (hai góc tương ứng).
**cấu hình hình / nghi vấn:**
Hình: tứ giác $ABDC$ ($A$ trên, $B$ trái, $C$ phải, $D$ dưới) có đoạn $AD$; $AB$, $AC$ mỗi cạnh 1 gạch; hai góc $BAD$, $CAD$ mỗi góc 1 cung (hai bán kính khác nhau). Dựng $B$, $C$ đối xứng qua $AD$. Không vẽ gạch trên $BD$, $CD$.
Verify (kiem_A3.mjs, 2 bộ toạ độ): $AB=AC$, $\widehat{BAD}=\widehat{CAD}$, $BD=CD$, $\widehat{ABD}=\widehat{ACD}$, $\widehat{ADB}=\widehat{ADC}$, $B$, $C$ khác phía $AD$ — PASS. Không có nghi vấn.
**hinh:** HH00101_TL1-2.png

### TL1.3 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình cho $BC=BD$ và hai góc cùng đỉnh $B$ (một bên là $C$, một bên là $D$) bằng nhau, cạnh $AB$ dùng chung, nên xét $\triangle ABC$ và $\triangle ABD$ theo c.g.c.

**Bước 1.** Ý a) Đọc kí hiệu: $BC$ và $BD$ cùng 1 gạch; góc $\widehat{ABC}$ và $\widehat{ABD}$ cùng cung nên bằng nhau.

**Bước 2.** Ý b) Cạnh $AB$ thuộc cả hai tam giác, không có kí hiệu: đó là cạnh chung.

**Bước 3.** Ý b) Góc $\widehat{ABC}$ nằm giữa $AB$, $BC$; góc $\widehat{ABD}$ nằm giữa $AB$, $BD$ nên là c.g.c. Ghép đỉnh $A\to A$, $B\to B$, $C\to D$.

**Bước 4.** Ý c) Suy ra cặp còn lại: cạnh $AC$ với $AD$, góc $\widehat{BAC}$ với $\widehat{BAD}$, góc $\widehat{ACB}$ với $\widehat{ADB}$.

**Chú ý:** viết thứ tự $\triangle ABC=\triangle ABD$ để $C$ ứng với $D$ (vì $BC=BD$). Cung vẽ ở $B$ chỉ hai góc $\widehat{ABC}$, $\widehat{ABD}$ ở hai bên tia $BA$.

**Phần 2. Trình bày**
a) Đề bài cho:
$BC=BD$ (gt);
$\widehat{ABC}=\widehat{ABD}$ (gt).

b) Xét $\triangle ABC$ và $\triangle ABD$ có:
$AB$ là cạnh chung;
$\widehat{ABC}=\widehat{ABD}$ (gt);
$BC=BD$ (gt)
nên $\triangle ABC=\triangle ABD$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle ABC=\triangle ABD$ (cmt) nên
$AC=AD$ (hai cạnh tương ứng);
$\widehat{BAC}=\widehat{BAD}$ (hai góc tương ứng);
$\widehat{ACB}=\widehat{ADB}$ (hai góc tương ứng).
**cấu hình hình / nghi vấn:**
Hình "mũi tên": $A$ trên, $B$ ở trong trên trục, $C$ trái dưới, $D$ phải dưới, đoạn $AB$, $AC$, $AD$, $BC$, $BD$; $BC$, $BD$ mỗi cạnh 1 gạch; ở $B$ có hai cung cùng loại cho $\widehat{ABC}$ và $\widehat{ABD}$ (ảnh gốc vẽ MỘT cung liền bao cả hai góc, hai bên tia $BA$; tôi đọc là hai góc $\widehat{ABC}=\widehat{ABD}$ — mỗi góc $116^\circ$ trên hình, theo de-nguon). Hai cung vẽ 2 bán kính khác nhau theo luật brief nên nhìn hơi khác ảnh gốc một chút. CHỜ XÁC NHẬN nếu ý gốc là góc $\widehat{CBD}$ (lõm) thì cách đọc này khác.
Verify (kiem_A3.mjs, 2 bộ toạ độ): $C$, $D$ đối xứng qua $AB$; $BC=BD$, $\widehat{ABC}=\widehat{ABD}$, $AC=AD$, $\widehat{BAC}=\widehat{BAD}$, $\widehat{ACB}=\widehat{ADB}$, $\widehat{ABC}>90^\circ$ — PASS.
**hinh:** HH00101_TL1-3.png

### TL1.4 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai đoạn $AB$, $CD$ cắt nhau tại $O$ với hai cặp cạnh bằng nhau, góc ở giữa là hai góc đối đỉnh, nên xét $\triangle OAC$ và $\triangle OBD$ theo c.g.c.

**Bước 1.** Ý a) Đọc kí hiệu: $OA$ và $OB$ cùng 2 gạch; $OC$ và $OD$ cùng 1 gạch.

**Bước 2.** Ý b) Hình không đánh dấu góc, nên phải tự tìm góc xen giữa: $\widehat{AOC}$ và $\widehat{BOD}$ là hai góc đối đỉnh nên bằng nhau.

**Bước 3.** Ý b) Góc $\widehat{AOC}$ nằm giữa $OA$, $OC$; góc $\widehat{BOD}$ nằm giữa $OB$, $OD$ nên là c.g.c. Ghép đỉnh $O\to O$, $A\to B$, $C\to D$.

**Bước 4.** Ý c) Suy ra các cặp còn lại: $AC$ với $BD$, $\widehat{OAC}$ với $\widehat{OBD}$, $\widehat{OCA}$ với $\widehat{ODB}$. Hai góc $\widehat{OAC}$, $\widehat{OBD}$ ở vị trí so le trong nên suy thêm $AC\parallel BD$.

**Chú ý:** hai góc đối đỉnh không được đánh dấu trên hình, đừng quên ghi vào bài.

**Phần 2. Trình bày**
a) Đề bài cho:
$OA=OB$ (gt);
$OC=OD$ (gt).

b) Xét $\triangle OAC$ và $\triangle OBD$ có:
$OA=OB$ (gt);
$\widehat{AOC}=\widehat{BOD}$ (hai góc đối đỉnh);
$OC=OD$ (gt)
nên $\triangle OAC=\triangle OBD$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle OAC=\triangle OBD$ (cmt) nên
$AC=BD$ (hai cạnh tương ứng);
$\widehat{OAC}=\widehat{OBD}$ (hai góc tương ứng);
$\widehat{OCA}=\widehat{ODB}$ (hai góc tương ứng).
Ta có $\widehat{OAC}=\widehat{OBD}$ (cmt)
mà hai góc này ở vị trí so le trong
nên $AC\parallel BD$ (hai góc so le trong bằng nhau).
**cấu hình hình / nghi vấn:**
Hình: $AB$ và $CD$ cắt nhau tại $O$ ($A$ trái trên, $C$ phải trên, $D$ trái dưới, $B$ phải dưới), có đoạn $AC$, $DB$ nằm ngang; $OA$, $OB$ 2 gạch; $OC$, $OD$ 1 gạch (đúng ảnh phóng to). Dựng $O$ là trung điểm của cả $AB$ và $CD$. Không vẽ dấu góc đối đỉnh (ảnh gốc không có).
Dòng $AC\parallel BD$ ở c) là phần thêm (so le trong, trong whitelist), đã verify. Nếu muốn khuôn đúng như tài liệu thì bỏ 3 dòng cuối.
Verify (kiem_A3.mjs, 2 bộ toạ độ): $OA=OB$, $OC=OD$, góc đối đỉnh, $AC=BD$, $\widehat{OAC}=\widehat{OBD}$, $\widehat{OCA}=\widehat{ODB}$, $AC\parallel BD$, $C$ và $D$ khác phía $AB$ — PASS.
**hinh:** HH00101_TL1-4.png

### TL1.5 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình cho $AB=CD$ và $\widehat{BAC}=\widehat{DCA}$, hai góc này nằm giữa cạnh đã cho và cạnh chung $AC$, nên xét $\triangle ABC$ và $\triangle CDA$ theo c.g.c.

**Bước 1.** Ý a) Đọc kí hiệu: $AB$ và $CD$ cùng 1 gạch; $\widehat{BAC}$ và $\widehat{DCA}$ cùng 1 cung.

**Bước 2.** Ý b) Cạnh $AC$ thuộc cả hai tam giác, không có kí hiệu: đó là cạnh chung.

**Bước 3.** Ý b) Ghép đỉnh theo cặp góc bằng nhau: $A\to C$, $B\to D$, $C\to A$. Góc $\widehat{BAC}$ nằm giữa $AB$, $AC$; góc $\widehat{DCA}$ nằm giữa $CD$, $CA$ nên là c.g.c, viết $\triangle ABC=\triangle CDA$.

**Bước 4.** Ý c) Suy ra các cặp còn lại: $BC$ với $DA$, $\widehat{ABC}$ với $\widehat{CDA}$, $\widehat{ACB}$ với $\widehat{CAD}$. Hai góc $\widehat{ACB}$, $\widehat{CAD}$ so le trong nên suy thêm $BC\parallel AD$.

**Chú ý:** hai tam giác chung cạnh $AC$ nhưng đỉnh $A$ của tam giác này ứng với đỉnh $C$ của tam giác kia, nên phải viết $\triangle ABC=\triangle CDA$, không viết $\triangle ABC=\triangle ADC$.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=CD$ (gt);
$\widehat{BAC}=\widehat{DCA}$ (gt).

b) Xét $\triangle ABC$ và $\triangle CDA$ có:
$AB=CD$ (gt);
$\widehat{BAC}=\widehat{DCA}$ (gt);
$AC$ là cạnh chung
nên $\triangle ABC=\triangle CDA$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle ABC=\triangle CDA$ (cmt) nên
$BC=DA$ (hai cạnh tương ứng);
$\widehat{ABC}=\widehat{CDA}$ (hai góc tương ứng);
$\widehat{ACB}=\widehat{CAD}$ (hai góc tương ứng).
Ta có $\widehat{ACB}=\widehat{CAD}$ (cmt)
mà hai góc này ở vị trí so le trong
nên $BC\parallel AD$ (hai góc so le trong bằng nhau).
**cấu hình hình / nghi vấn:**
Hình: tứ giác $ABCD$ ($A$ trái trên, $B$ phải trên, $C$ phải dưới, $D$ trái dưới) với đường chéo $AC$; $AB$, $CD$ mỗi cạnh 1 gạch; góc $\widehat{BAC}$ (ở $A$) và $\widehat{DCA}$ (ở $C$) mỗi góc 1 cung. Dựng đúng hình bình hành ($D\to C = A\to B$) vì hai góc so le trong bằng nhau và $AB=CD$ ép hình này. Không ghi $BC=AD$.
Dòng $BC\parallel AD$ ở c) là phần thêm (so le trong, trong whitelist), đã verify. Có thể bỏ 3 dòng cuối nếu muốn đúng khuôn tối giản.
Verify (kiem_A3.mjs, 2 bộ toạ độ): $AB=CD$, $\widehat{BAC}=\widehat{DCA}$, $BC=DA$, $\widehat{ABC}=\widehat{CDA}$, $\widehat{ACB}=\widehat{CAD}$, $BC\parallel AD$, $B$, $D$ khác phía $AC$ — PASS.
**hinh:** HH00101_TL1-5.png

### TL1.6 → HH00101
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình có $AB=AC$, $BD=DC$ và $\widehat{B}=\widehat{C}$; góc $\widehat{B}$ nằm giữa $AB$, $BD$ còn góc $\widehat{C}$ nằm giữa $AC$, $CD$, nên xét $\triangle ABD$ và $\triangle ACD$ theo c.g.c.

**Bước 1.** Ý a) Đọc kí hiệu: $AB$ và $AC$ cùng 1 gạch; $BD$ và $DC$ cùng 2 gạch; $\widehat{B}$ và $\widehat{C}$ cùng 1 cung.

**Bước 2.** Ý b) Chọn hai tam giác chứa các yếu tố đó: $\triangle ABD$ (có $AB$, $BD$, góc $B$) và $\triangle ACD$ (có $AC$, $CD$, góc $C$).

**Bước 3.** Ý b) Kiểm tra góc nằm giữa hai cạnh bằng nhau: $\widehat{B}=\widehat{ABD}$ nằm giữa $AB$, $BD$; $\widehat{C}=\widehat{ACD}$ nằm giữa $AC$, $CD$, nên là c.g.c. Ghép đỉnh $A\to A$, $B\to C$, $D\to D$.

**Bước 4.** Ý c) Suy ra các cặp còn lại: góc $\widehat{BAD}$ với $\widehat{CAD}$, góc $\widehat{ADB}$ với $\widehat{ADC}$. Vì $D$ nằm trên $BC$ nên hai góc $\widehat{ADB}$, $\widehat{ADC}$ kề bù, từ đó tính được mỗi góc $90^\circ$.

**Chú ý:** cạnh $AD$ nằm trong cả hai tam giác nhưng không dùng đến vì đã đủ hai cạnh và góc xen giữa.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=AC$ (gt);
$BD=DC$ (gt);
$\widehat{B}=\widehat{C}$ (gt).

b) Xét $\triangle ABD$ và $\triangle ACD$ có:
$AB=AC$ (gt);
$\widehat{ABD}=\widehat{ACD}$ (gt);
$BD=CD$ (gt)
nên $\triangle ABD=\triangle ACD$ (c.g.c).

c) Tính chất suy ra:
Vì $\triangle ABD=\triangle ACD$ (cmt) nên
$\widehat{BAD}=\widehat{CAD}$ (hai góc tương ứng);
$\widehat{ADB}=\widehat{ADC}$ (hai góc tương ứng).
Mà $\widehat{ADB}+\widehat{ADC}=180^\circ$ (hai góc kề bù)
nên $\widehat{ADB}=\widehat{ADC}=90^\circ$, tức $AD\perp BC$.
Lại có $\widehat{BAD}=\widehat{CAD}$ (cmt)
nên $AD$ là tia phân giác của $\widehat{BAC}$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ ($A$ trên, $B$ trái, $C$ phải), $D$ trên $BC$, đoạn $AD$; $AB$, $AC$ mỗi cạnh 1 gạch; $BD$, $DC$ mỗi đoạn 2 gạch; góc $\widehat{B}$ và $\widehat{C}$ mỗi góc 1 cung. KHÔNG vẽ ô vuông ở $D$ (điều suy ra ở c). Dựng $D$ là trung điểm $BC$, $AD\perp BC$ nên $AB=AC$ và $\widehat{B}=\widehat{C}$ đều đúng.
Hai dòng cuối c) (vuông góc, phân giác) là phần thêm trong whitelist (kề bù, phân giác), đã verify; có thể bỏ nếu muốn khuôn tối giản. Không dùng tính chất tam giác cân (bài c.g.c cấm).
Verify (kiem_A3.mjs, 2 bộ toạ độ): $AB=AC$, $BD=DC$, $\widehat{B}=\widehat{C}$, $\widehat{BAD}=\widehat{CAD}$, $\widehat{ADB}=\widehat{ADC}=90^\circ$, $D$ nằm giữa $B$ và $C$, tia $AD$ nằm giữa — PASS.
**hinh:** HH00101_TL1-6.png
