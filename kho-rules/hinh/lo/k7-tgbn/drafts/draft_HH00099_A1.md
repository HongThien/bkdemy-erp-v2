### TL1.1 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hình có đủ ba cặp cạnh được đánh dấu bằng nhau, không có góc nào được đánh dấu, nên hai tam giác bằng nhau theo trường hợp c.c.c.

**Bước 1.** Đọc kí hiệu: các cạnh cùng số gạch thì bằng nhau. Ghi ba đẳng thức: cạnh 1 gạch, cạnh 2 gạch, cạnh 3 gạch.

**Bước 2.** Ghép đỉnh tương ứng theo cạnh bằng nhau. Đỉnh chung của cạnh 1 gạch và cạnh 2 gạch là $A$ ở tam giác thứ nhất, là $D$ ở tam giác thứ hai, nên $A$ ứng với $D$. Tương tự $B$ ứng với $E$, $C$ ứng với $H$.

**Bước 3.** Viết $\triangle ABC=\triangle DEH$ theo đúng thứ tự đỉnh tương ứng rồi nêu trường hợp c.c.c.

**Bước 4.** Từ hai tam giác bằng nhau suy ra các góc tương ứng bằng nhau. Góc tương ứng là hai góc đối diện với hai cạnh bằng nhau.

**Chú ý:** Phải viết đúng thứ tự đỉnh: $\triangle ABC=\triangle DEH$, không viết $\triangle DHE$.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=DE$ (gt);
$AC=DH$ (gt);
$BC=EH$ (gt).

b) Xét $\triangle ABC$ và $\triangle DEH$ có:
$AB=DE$ (gt);
$AC=DH$ (gt);
$BC=EH$ (gt).
Do đó $\triangle ABC=\triangle DEH$ (c.c.c).

c) Tính chất suy ra:
$\widehat{A}=\widehat{D}$ (hai góc tương ứng);
$\widehat{B}=\widehat{E}$ (hai góc tương ứng);
$\widehat{C}=\widehat{H}$ (hai góc tương ứng).
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-02: $\triangle ABC$ nền xám ($A$ trên, $B$ trái dưới, $C$ phải dưới), $\triangle DEH$ ($D$ trái trên, $H$ phải trên, $E$ dưới). Gạch: $AB$ 2, $AC$ 1, $BC$ 3; $DE$ 2, $DH$ 1, $HE$ 3. Dựng đúng $AB=DE=100$, $AC=DH=130$, $BC=HE=140$ (tam giác lệch, không cân). Không có kí hiệu góc.
Ở c) chỉ liệt kê 3 cặp góc vì ba cặp cạnh đã có ở a). Đã verify (kiem_A1.mjs): 3 cặp cạnh, 3 cặp góc tương ứng bằng nhau — PASS. Chỉ dùng c.c.c, trong whitelist. Không nghi vấn.
**hinh:** HH00099_TL1-1.png

### TL1.2 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Điểm $H$ nằm trên $BC$, đoạn $AH$ chia $\triangle ABC$ thành $\triangle ABH$ và $\triangle ACH$. Hai tam giác này có hai cặp cạnh được đánh dấu và một cạnh chung $AH$, nên dùng c.c.c.

**Bước 1.** Đọc kí hiệu trên hình: cạnh 1 gạch là $AB$, $AC$; cạnh 2 gạch là $BH$, $HC$.

**Bước 2.** Tìm cạnh chung không có kí hiệu: $AH$ thuộc cả hai tam giác $ABH$ và $ACH$.

**Bước 3.** Viết $\triangle ABH=\triangle ACH$ theo thứ tự đỉnh tương ứng ($B$ ứng với $C$, $H$ ứng với $H$) và nêu trường hợp c.c.c.

**Bước 4.** Suy ra các góc tương ứng bằng nhau. Vì $H$ nằm trên $BC$ nên còn rút ra được tia phân giác và vuông góc.

**Chú ý:** Cạnh chung $AH$ không có gạch trên hình, phải tự nhận ra và ghi "(cạnh chung)".

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=AC$ (gt);
$BH=HC$ (gt).

b) Xét $\triangle ABH$ và $\triangle ACH$ có:
$AB=AC$ (gt);
$BH=CH$ (gt);
$AH$ chung (cạnh chung).
Do đó $\triangle ABH=\triangle ACH$ (c.c.c).

c) Tính chất suy ra:
$\widehat{BAH}=\widehat{CAH}$ (hai góc tương ứng);
$\widehat{ABH}=\widehat{ACH}$ (hai góc tương ứng);
$\widehat{AHB}=\widehat{AHC}$ (hai góc tương ứng).
Tia $AH$ nằm giữa hai tia $AB$, $AC$ (theo hình)
và $\widehat{BAH}=\widehat{CAH}$ (cmt)
nên $AH$ là tia phân giác của $\widehat{BAC}$ (tia phân giác).
Ta có $\widehat{AHB}+\widehat{AHC}=180^\circ$ (hai góc kề bù)
mà $\widehat{AHB}=\widehat{AHC}$ (cmt)
nên $\widehat{AHB}=\widehat{AHC}=90^\circ$.
Vậy $AH\perp BC$.
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-03 bảng 1: $A$ trên, $B$, $C$ dưới, $H$ trên $BC$, đoạn $AH$. Gạch: $AB$ 1, $AC$ 1, $BH$ 2, $HC$ 2; $AH$ không gạch. Dựng $H$ là trung điểm $BC$, $A$ thẳng phía trên $H$ (như ảnh; hình đối xứng nên $AH\perp BC$ đúng, nhưng KHÔNG vẽ ô vuông ở $H$).
Hai dòng cuối của c) (phân giác, vuông góc) là suy thêm theo ý tài liệu ngầm định, mỗi bước đều có lý do trong whitelist (tia phân giác, kề bù). Không dùng tính chất tam giác cân. Đã verify: các cặp cạnh/góc bằng nhau, $\widehat{AHB}=90^\circ$, $H$ nằm giữa, tổng hai góc $BAH+CAH=BAC$ — PASS.
**hinh:** HH00099_TL1-2.png

### TL1.3 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Tứ giác $ABDC$ có đường chéo $AD$ chia thành $\triangle ABD$ và $\triangle ACD$. Hai tam giác có hai cặp cạnh được đánh dấu và cạnh chung $AD$, nên dùng c.c.c.

**Bước 1.** Đọc kí hiệu: cạnh 1 gạch là $AB$, $AC$; cạnh 2 gạch là $BD$, $CD$.

**Bước 2.** Nhận ra cạnh chung $AD$ (đường chéo, không có gạch) của hai tam giác $ABD$ và $ACD$.

**Bước 3.** Viết $\triangle ABD=\triangle ACD$ theo thứ tự đỉnh tương ứng ($B$ ứng với $C$) và nêu trường hợp c.c.c.

**Bước 4.** Suy ra các góc tương ứng bằng nhau, rồi nhận xét $AD$ là tia phân giác của hai góc $\widehat{BAC}$ và $\widehat{BDC}$.

**Chú ý:** Đỉnh $A$ và $D$ ở vị trí giống nhau trong hai tam giác nên viết $A$ trước, $D$ sau cả hai bên.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=AC$ (gt);
$BD=CD$ (gt).

b) Xét $\triangle ABD$ và $\triangle ACD$ có:
$AB=AC$ (gt);
$BD=CD$ (gt);
$AD$ chung (cạnh chung).
Do đó $\triangle ABD=\triangle ACD$ (c.c.c).

c) Tính chất suy ra:
$\widehat{BAD}=\widehat{CAD}$ (hai góc tương ứng);
$\widehat{ABD}=\widehat{ACD}$ (hai góc tương ứng);
$\widehat{ADB}=\widehat{ADC}$ (hai góc tương ứng).
Tia $AD$ nằm giữa hai tia $AB$, $AC$ (theo hình)
và $\widehat{BAD}=\widehat{CAD}$ (cmt)
nên $AD$ là tia phân giác của $\widehat{BAC}$ (tia phân giác).
Tia $DA$ nằm giữa hai tia $DB$, $DC$ (theo hình)
và $\widehat{ADB}=\widehat{ADC}$ (cmt)
nên $DA$ là tia phân giác của $\widehat{BDC}$ (tia phân giác).
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-03 bảng 2: $A$ trên, $B$ trái, $C$ phải, $D$ dưới, có đường chéo $AD$ (hình tứ giác lồi, $B$, $C$ ở hai phía $AD$). Gạch: $AB$ 1, $AC$ 1, $BD$ 2, $CD$ 2. Dựng đối xứng qua $AD$.
Hai nhận xét phân giác ở cuối c) suy thêm (chắc chắn: tia nằm giữa theo hình, hai góc bằng nhau — đã verify cộng góc). Đã verify: các cặp cạnh/góc, $B$, $C$ khác phía $AD$ — PASS. Không nghi vấn.
**hinh:** HH00099_TL1-3.png

### TL1.4 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hình "mũi tên" có hai tam giác $ACB$ và $ADB$ chung cạnh $AB$, mỗi tam giác có hai cạnh được đánh dấu, nên dùng c.c.c.

**Bước 1.** Đọc kí hiệu: cạnh 2 gạch là $AC$, $AD$; cạnh 1 gạch là $BC$, $BD$.

**Bước 2.** Nhận ra cạnh chung $AB$ (không có gạch) của hai tam giác $ACB$ và $ADB$.

**Bước 3.** Ghép đỉnh: $C$ ứng với $D$, $A$ và $B$ giữ nguyên. Viết $\triangle ACB=\triangle ADB$ và nêu trường hợp c.c.c.

**Bước 4.** Suy ra các góc tương ứng bằng nhau, rồi nhận xét $AB$ là tia phân giác của $\widehat{CAD}$.

**Chú ý:** Thứ tự đỉnh phải là $A, C, B$ và $A, D, B$ để các cạnh bằng nhau nằm cùng vị trí.

**Phần 2. Trình bày**
a) Đề bài cho:
$AC=AD$ (gt);
$BC=BD$ (gt).

b) Xét $\triangle ACB$ và $\triangle ADB$ có:
$AC=AD$ (gt);
$BC=BD$ (gt);
$AB$ chung (cạnh chung).
Do đó $\triangle ACB=\triangle ADB$ (c.c.c).

c) Tính chất suy ra:
$\widehat{CAB}=\widehat{DAB}$ (hai góc tương ứng);
$\widehat{ACB}=\widehat{ADB}$ (hai góc tương ứng);
$\widehat{CBA}=\widehat{DBA}$ (hai góc tương ứng).
Tia $AB$ nằm giữa hai tia $AC$, $AD$ (theo hình)
và $\widehat{CAB}=\widehat{DAB}$ (cmt)
nên $AB$ là tia phân giác của $\widehat{CAD}$ (tia phân giác).
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-03 bảng 3 ("mũi tên"): $A$ trên, $B$ ở giữa trong, $C$ trái dưới, $D$ phải dưới; đoạn $AB$, $AC$, $AD$, $BC$, $BD$. Gạch (đọc ảnh phóng 250 dpi): $AC$ 2, $AD$ 2, $BC$ 1, $BD$ 1; $AB$ không gạch. Dựng đối xứng qua $AB$.
Không suy "phân giác" cho góc ở $B$ vì tại $B$ hai góc $CBA$, $DBA$ đều tù và $BA$ không nằm trong góc $CBD$ (góc nhỏ) — đã bỏ để khỏi sai. Đã verify: cạnh, góc, cộng góc $CAB+BAD=CAD$, $C$, $D$ khác phía $AB$ — PASS. Không nghi vấn.
**hinh:** HH00099_TL1-4.png

### TL1.5 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Tứ giác $ABCD$ có hai cặp cạnh đối được đánh dấu bằng nhau; đường chéo $AC$ là cạnh chung của $\triangle ABC$ và $\triangle CDA$, nên dùng c.c.c.

**Bước 1.** Đọc kí hiệu: cạnh 1 gạch là $AB$, $DC$; cạnh 2 gạch là $AD$, $BC$.

**Bước 2.** Nhận ra cạnh chung $AC$ (đường chéo, không có gạch).

**Bước 3.** Ghép đỉnh: $AB=CD$ nên $A$ ứng với $C$, $B$ ứng với $D$; $C$ ứng với $A$. Viết $\triangle ABC=\triangle CDA$ và nêu trường hợp c.c.c.

**Bước 4.** Suy ra các góc tương ứng bằng nhau, rồi dùng hai góc so le trong bằng nhau để nhận xét các cặp cạnh đối song song.

**Chú ý:** $AB$ ứng với $CD$ nên đỉnh $A$ của tam giác thứ nhất ứng với đỉnh $C$ của tam giác thứ hai; phải viết $\triangle ABC=\triangle CDA$.

**Phần 2. Trình bày**
a) Đề bài cho:
$AB=DC$ (gt);
$AD=BC$ (gt).

b) Xét $\triangle ABC$ và $\triangle CDA$ có:
$AB=CD$ (gt);
$BC=DA$ (gt);
$AC$ chung (cạnh chung).
Do đó $\triangle ABC=\triangle CDA$ (c.c.c).

c) Tính chất suy ra:
$\widehat{BAC}=\widehat{DCA}$ (hai góc tương ứng);
$\widehat{ACB}=\widehat{CAD}$ (hai góc tương ứng);
$\widehat{ABC}=\widehat{CDA}$ (hai góc tương ứng).
Ta có $\widehat{BAC}=\widehat{DCA}$ (cmt)
mà hai góc này ở vị trí so le trong ($B$, $D$ nằm khác phía đường thẳng $AC$)
nên $AB\parallel CD$.
Ta có $\widehat{ACB}=\widehat{CAD}$ (cmt)
mà hai góc này ở vị trí so le trong
nên $AD\parallel BC$.
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-03 bảng 4: $A$ trái trên, $B$ phải trên, $C$ phải dưới, $D$ trái dưới, đường chéo $AC$. Gạch: $AB$ 1, $DC$ 1, $AD$ 2, $BC$ 2. Dựng đúng hình bình hành lệch ($A(20,20)$, $B(281,20)$, $D(150,215)$, $C(411,215)$), tam giác $ABC$ không cân.
Hai dòng song song ở cuối c) suy thêm (so le trong bằng nhau ⇒ song song, trong whitelist; $B$, $D$ khác phía $AC$ đã verify). Đã verify: cạnh, 3 cặp góc, $AB\parallel CD$, $AD\parallel BC$, $B$, $D$ khác phía — PASS. Không nghi vấn.
**hinh:** HH00099_TL1-5.png

### TL1.6 → HH00099
**loai_cau:** tu_luan
**noi_dung:**
Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau).
a) Viết các yếu tố bằng nhau mà đề bài cho trên hình.
b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau.
c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Tứ giác $MQPN$ có hai cặp cạnh đối được đánh dấu bằng nhau; đường chéo $MP$ là cạnh chung của $\triangle MNP$ và $\triangle PQM$, nên dùng c.c.c.

**Bước 1.** Đọc kí hiệu: cạnh 2 gạch là $MN$, $PQ$; cạnh 1 gạch là $MQ$, $NP$.

**Bước 2.** Nhận ra cạnh chung $MP$ (đường chéo, không có gạch).

**Bước 3.** Ghép đỉnh: $MN=PQ$ nên $M$ ứng với $P$, $N$ ứng với $Q$; $P$ ứng với $M$. Viết $\triangle MNP=\triangle PQM$ và nêu trường hợp c.c.c.

**Bước 4.** Suy ra các góc tương ứng bằng nhau, rồi dùng hai góc so le trong bằng nhau để nhận xét các cặp cạnh đối song song.

**Chú ý:** Thứ tự đỉnh là $M, N, P$ và $P, Q, M$; viết sai thứ tự thì các cạnh, góc tương ứng bị ghép nhầm.

**Phần 2. Trình bày**
a) Đề bài cho:
$MN=PQ$ (gt);
$MQ=NP$ (gt).

b) Xét $\triangle MNP$ và $\triangle PQM$ có:
$MN=PQ$ (gt);
$NP=QM$ (gt);
$MP$ chung (cạnh chung).
Do đó $\triangle MNP=\triangle PQM$ (c.c.c).

c) Tính chất suy ra:
$\widehat{NMP}=\widehat{QPM}$ (hai góc tương ứng);
$\widehat{MPN}=\widehat{PMQ}$ (hai góc tương ứng);
$\widehat{MNP}=\widehat{PQM}$ (hai góc tương ứng).
Ta có $\widehat{NMP}=\widehat{QPM}$ (cmt)
mà hai góc này ở vị trí so le trong ($N$, $Q$ nằm khác phía đường thẳng $MP$)
nên $MN\parallel PQ$.
Ta có $\widehat{MPN}=\widehat{PMQ}$ (cmt)
mà hai góc này ở vị trí so le trong
nên $MQ\parallel NP$.
**cấu hình hình / nghi vấn:**
Hình theo ảnh t-04 (hình đầu): $M$ trên, $Q$ phải giữa, $P$ dưới, $N$ trái giữa, đường chéo $MP$. Gạch (đọc ảnh phóng 250 dpi): $MN$ 2, $QP$ 2, $MQ$ 1, $NP$ 1. Dựng đúng hình bình hành ($MN\parallel QP$ thẳng đứng, $MQ\parallel NP$), tam giác $MNP$ không cân.
Hai dòng song song cuối c) suy thêm, có lý do so le trong (trong whitelist). Đã verify: cạnh, 3 cặp góc, hai cặp song song, $N$, $Q$ khác phía $MP$ — PASS. Không nghi vấn.
**hinh:** HH00099_TL1-6.png
