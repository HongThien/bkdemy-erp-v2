# Gói vẽ hình theo ý: K8-g7

Luật: docs/mau-brief-ve-lai-hinh.md §4 (dấu bằng nhau) + §5 (hình theo ý). Tệp ra: `<MA>.png` — HLB… = hình bài, HLY… = hình ý (cộng dồn).

---

## HLB00171 · gốc HHC002647 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** không có hình cũ

**GIẢ THIẾT CHUNG** → `HLB00171.png`:

Một thửa ruộng hình thang cân có đáy bé 26 m, đáy lớn hơn đáy bé 8 m, đáy bé lớn hơn chiều cao 6 m, cạnh bên bằng nửa tổng hai đáy. Biết trung bình cứ $100\ \text{m}^2$ thu hoạch được 70 kg thóc, đến gần vụ thu hoạch để đuổi chim chóc đến ăn lúa họ tính cứ 20 m đặt một con bù nhìn quanh ruộng.

### ý a · HLY00424

**Hỏi:** Hỏi: Số con bù nhìn cần có?

<details><summary>Lời giải</summary>

Đáy lớn của thửa ruộng là $26+8=34$ (m).

Chiều cao của thửa ruộng là $26-6=20$ (m).

Cạnh bên của thửa ruộng là $(26+34):2=30$ (m).

Chu vi thửa ruộng là $26+34+30+30=120$ (m).

Vì cứ 20 m đặt một con bù nhìn quanh ruộng nên số con bù nhìn cần có là $120:20=6$ (con).

</details>

### ý b · HLY00425

**Hỏi:** Hỏi: Tổng số ki-lô-gam thóc thu hoạch được trên thửa ruộng đó?

<details><summary>Lời giải</summary>

Diện tích thửa ruộng là $\dfrac{(26+34) \cdot 20}{2}=600$ ($\text{m}^2$).

Số ki-lô-gam thóc thu hoạch được là $600:100 \cdot 70=420$ (kg).

Vậy cần 6 con bù nhìn và thu hoạch được 420 kg thóc.

</details>

---

## HLB00172 · gốc HHC002659 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00172_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00172.png`:

Cho tam giác $ABC$ vuông tại $A$, $AB<AC$, đường cao $AH$ và trung tuyến $AE$. Gọi $D,\ F$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$; $O$ là giao điểm của $AE$ và $DF$.

### ý a · HLY00426

**Hỏi:** Chứng minh $ADEF$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Tứ giác $ADEF$ có $\widehat{DAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{ADE}=90^\circ$ (vì $ED\perp AB$), $\widehat{AFE}=90^\circ$ (vì $EF\perp AC$).

Suy ra $\widehat{DEF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEF$ có bốn góc vuông nên là hình chữ nhật.

</details>

### ý b · HLY00427

**Hỏi:** Chứng minh $DF\parallel BC$.

<details><summary>Lời giải</summary>

Vì $ADEF$ là hình chữ nhật nên $AE=DF$ và $O$ là trung điểm của mỗi đường chéo, suy ra $OA=OF$.

Do đó $\triangle OAF$ cân tại $O$, suy ra $\widehat{OAF}=\widehat{OFA}$, tức là $\widehat{EAC}=\widehat{AFD}$ (1).

Vì $\triangle ABC$ vuông tại $A$ có $AE$ là trung tuyến ứng với cạnh huyền $BC$ nên $EA=EB=EC=\dfrac{1}{2}BC$.

Do đó $\triangle EAC$ cân tại $E$, suy ra $\widehat{EAC}=\widehat{C}$ (2).

Từ (1) và (2) suy ra $\widehat{AFD}=\widehat{C}$.

Hai góc $\widehat{AFD}$ và $\widehat{ACB}$ ở vị trí đồng vị nên $DF\parallel BC$.

</details>

### ý c · HLY00428

**Hỏi:** Chứng minh $BDFE$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $DF\parallel BC$ (câu b) và $E$ thuộc $BC$ nên $DF\parallel BE$.

Vì $AB\perp AC$ và $EF\perp AC$ nên $AB\parallel EF$; mà $B$, $D$ thuộc $AB$ nên $BD\parallel EF$.

Tứ giác $BDFE$ có $DF\parallel BE$ và $BD\parallel EF$ nên là hình bình hành (định nghĩa).

</details>

### ý d · HLY00429

**Hỏi:** Chứng minh $F$ là trung điểm của $AC$.

<details><summary>Lời giải</summary>

Vì $EA=EC$ (chứng minh ở câu b) nên $\triangle EAC$ cân tại $E$.

Tam giác $EAC$ cân tại $E$ có $EF\perp AC$ tại $F$ nên $EF$ là đường cao ứng với cạnh đáy $AC$, đồng thời là đường trung tuyến.

Suy ra $F$ là trung điểm của $AC$.

</details>

### ý e · HLY00430

**Hỏi:** Chứng minh $DFEH$ là hình thang cân.

<details><summary>Lời giải</summary>

Vì $DF\parallel BC$ (câu b), $H$ và $E$ thuộc $BC$ nên $DF\parallel EH$ ($H$ không trùng $E$ vì nếu trùng thì $AE$ vừa là trung tuyến vừa là đường cao nên $AB=AC$, trái với $AB<AC$).

Do đó $DFEH$ là hình thang.

Vì $ADEF$ là hình chữ nhật nên $DE=AF$ (1).

Vì $F$ là trung điểm của $AC$ (câu d) nên $AF=\dfrac{1}{2}AC$.

Vì $AH\perp BC$ nên $\triangle AHC$ vuông tại $H$, có $HF$ là trung tuyến ứng với cạnh huyền $AC$ nên $HF=\dfrac{1}{2}AC=AF$ (2).

Từ (1) và (2) suy ra $DE=FH$.

Hình thang $DFEH$ có hai đường chéo $DE$ và $FH$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

</details>

### ý f · HLY00431

**Hỏi:** Lấy $M,\ N$ sao cho $F$ lần lượt là trung điểm của $EM$ và $BN$. Chứng minh $A,\ N,\ M$ thẳng hàng.

<details><summary>Lời giải</summary>

Tứ giác $AECM$ có hai đường chéo $AC$ và $EM$ cắt nhau tại $F$, mà $F$ là trung điểm của $EM$ (giả thiết) và của $AC$ (câu d).

Suy ra $AECM$ là hình bình hành (dấu hiệu nhận biết), do đó $AM\parallel EC$, tức là $AM\parallel BC$.

Tứ giác $ABCN$ có hai đường chéo $AC$ và $BN$ cắt nhau tại $F$, mà $F$ là trung điểm của $BN$ (giả thiết) và của $AC$ (câu d).

Suy ra $ABCN$ là hình bình hành (dấu hiệu nhận biết), do đó $AN\parallel BC$.

Qua $A$ chỉ có một đường thẳng song song với $BC$ nên hai đường thẳng $AM$ và $AN$ trùng nhau.

Vậy $A,\ N,\ M$ thẳng hàng.

</details>

---

## HLB00173 · gốc HHC002660 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00173_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00173.png`:

Cho tam giác $ABC$ vuông tại $A$ ($AC<AB$), gọi $M$ là trung điểm của $BC$. Kẻ $ME\perp AB$ tại $E$, kẻ $MF\perp AC$ tại $F$.

### ý a · HLY00432

**Hỏi:** Chứng minh tứ giác $AEMF$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Tứ giác $AEMF$ có $\widehat{EAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AEM}=90^\circ$ (vì $ME\perp AB$), $\widehat{AFM}=90^\circ$ (vì $MF\perp AC$).

Suy ra $\widehat{EMF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AEMF$ có bốn góc vuông nên là hình chữ nhật.

</details>

### ý b · HLY00433

**Hỏi:** Lấy điểm $H$ trên tia $MF$ sao cho $FM=FH$. Chứng minh tứ giác $AHFE$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $AEMF$ là hình chữ nhật nên $AE\parallel FM$ và $AE=FM$ (hai cạnh đối).

Vì $H$ thuộc tia $MF$ nên $H$ nằm trên đường thẳng $FM$, do đó $AE\parallel HF$.

Mà $FM=FH$ (giả thiết) nên $AE=HF$.

Tứ giác $AHFE$ có $AE\parallel HF$ và $AE=HF$ nên là hình bình hành (dấu hiệu nhận biết).

</details>

### ý c · HLY00434

**Hỏi:** Gọi $I$ là giao điểm của $EH$ và $AF$; $J$ là trung điểm của $ME$. Chứng minh $I$ là trung điểm của $AF,\ EH$ và $IJ\perp ME$.

<details><summary>Lời giải</summary>

Vì $AHFE$ là hình bình hành nên hai đường chéo $AF$ và $EH$ cắt nhau tại trung điểm của mỗi đường.

Mà $I$ là giao điểm của $EH$ và $AF$ nên $I$ là trung điểm của $AF$ và của $EH$.

Vì $AEMF$ là hình chữ nhật nên $AF\parallel EM$ và $AF=EM$ (hai cạnh đối).

Vì $I$ là trung điểm của $AF$ và $J$ là trung điểm của $EM$ nên $AI=\dfrac{1}{2}AF$ và $EJ=\dfrac{1}{2}EM$, suy ra $AI=EJ$.

Mà $I$ thuộc $AF$, $J$ thuộc $EM$ nên $AI\parallel EJ$.

Tứ giác $AIJE$ có $AI\parallel EJ$ và $AI=EJ$ nên là hình bình hành (dấu hiệu nhận biết), suy ra $IJ\parallel AE$.

Mà $AE\perp ME$ (vì $AEMF$ là hình chữ nhật) nên $IJ\perp ME$.

Vậy $I$ là trung điểm của $AF,\ EH$ và $IJ\perp ME$.

</details>

---

## HLB00174 · gốc HHC002661 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00174_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00174.png`:

Cho hình chữ nhật $ABCD$ với $AB>AD$. Kẻ $AN\perp BD,\ CM\perp BD$ ($N,\ M\in BD$).

### ý a · HLY00435

**Hỏi:** Chứng minh $DN=BM$.

<details><summary>Lời giải</summary>

Xét $\triangle ADN$ và $\triangle CBM$ có:

$\widehat{AND}=\widehat{CMB}=90^\circ$ (vì $AN\perp BD$, $CM\perp BD$)

$AD=CB$ (hai cạnh đối của hình chữ nhật $ABCD$)

$\widehat{ADN}=\widehat{CBM}$ (so le trong, vì $AD\parallel BC$)

Do đó $\triangle ADN=\triangle CBM$ (cạnh huyền – góc nhọn).

Suy ra $DN=BM$ và $AN=CM$ (hai cạnh tương ứng).

</details>

### ý b · HLY00436

**Hỏi:** Chứng minh $ANCM$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $AN\perp BD$ và $CM\perp BD$ nên $AN\parallel CM$.

Mà $AN=CM$ (câu a).

Tứ giác $ANCM$ có $AN\parallel CM$ và $AN=CM$ nên là hình bình hành (dấu hiệu nhận biết).

</details>

### ý c · HLY00437

**Hỏi:** Trên tia đối của tia $NA$ lấy $K$ sao cho $NK=NA$. Chứng minh $BA=BK$ và $DA=DK$.

<details><summary>Lời giải</summary>

Vì $K$ thuộc đường thẳng $AN$ và $AN\perp BD$ tại $N$ nên $\widehat{BNA}=\widehat{BNK}=90^\circ$.

Xét $\triangle BNA$ và $\triangle BNK$ có:

$NA=NK$ (giả thiết)

$\widehat{BNA}=\widehat{BNK}=90^\circ$ (chứng minh trên)

$BN$ chung

Do đó $\triangle BNA=\triangle BNK$ (c.g.c), suy ra $BA=BK$.

Chứng minh tương tự, $\triangle DNA=\triangle DNK$ (c.g.c) nên $DA=DK$.

</details>

### ý d · HLY00438

**Hỏi:** Chứng minh $DKCB$ là hình thang cân.

<details><summary>Lời giải</summary>

Vì $K$ thuộc đường thẳng $AN$ và $AN\parallel CM$ (câu b) nên $KN\parallel CM$.

Mà $KN=NA$ (giả thiết) và $NA=CM$ (câu a) nên $KN=CM$.

Tứ giác $KNMC$ có $KN\parallel CM$ và $KN=CM$ nên là hình bình hành (dấu hiệu nhận biết).

Suy ra $KC\parallel NM$; mà $N$, $M$ thuộc $BD$ nên $KC\parallel BD$.

Do đó $DKCB$ là hình thang (đáy $KC$ và $DB$).

Vì $ABCD$ là hình chữ nhật nên $DC=AB$.

Mà $BK=BA$ (câu c) nên $DC=BK$.

Hình thang $DKCB$ có hai đường chéo $DC$ và $KB$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

</details>

---

## HLB00175 · gốc HHC002662 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00175_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00175.png`:

Cho tam giác $ABC$ vuông tại $A$. Lấy $D\in BC$. Gọi $M,\ N$ lần lượt là hình chiếu của $D$ trên $AB,\ AC$.

### ý a · HLY00439

**Hỏi:** Chứng minh $AD=MN$.

<details><summary>Lời giải</summary>

Tứ giác $AMDN$ có $\widehat{MAN}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AMD}=90^\circ$ (vì $DM\perp AB$), $\widehat{AND}=90^\circ$ (vì $DN\perp AC$).

Suy ra $\widehat{MDN}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AMDN$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AD$ và $MN$ bằng nhau, tức là $AD=MN$.

</details>

### ý b · HLY00440

**Hỏi:** Kẻ đường cao $AH$ của tam giác $ABC$. Chứng minh $\widehat{MHN}=90^\circ$.

<details><summary>Lời giải</summary>

Nếu $D$ trùng $H$ thì $\widehat{MHN}=\widehat{MDN}=90^\circ$ (vì $AMDN$ là hình chữ nhật).

Xét $D$ khác $H$. Gọi $O$ là giao điểm của $AD$ và $MN$.

Vì $AMDN$ là hình chữ nhật nên $O$ là trung điểm của mỗi đường chéo, do đó $OM=ON=\dfrac{1}{2}MN$ và $OA=OD=\dfrac{1}{2}AD$.

Vì $AH\perp BC$, $D$ thuộc $BC$ và $D$ khác $H$ nên $\triangle AHD$ vuông tại $H$.

Tam giác $AHD$ vuông tại $H$ có $HO$ là trung tuyến ứng với cạnh huyền $AD$ nên $HO=\dfrac{1}{2}AD$.

Mà $AD=MN$ (câu a) nên $HO=\dfrac{1}{2}MN$.

Tam giác $MHN$ có trung tuyến $HO$ ứng với cạnh $MN$ và $HO=\dfrac{1}{2}MN$ nên $\triangle MHN$ vuông tại $H$.

Vậy $\widehat{MHN}=90^\circ$.

</details>

---

## HLB00176 · gốc HHC002663 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00176_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00176.png`:

Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), lấy điểm $M$ bất kỳ thuộc $BC$ ($M\neq B,\ M\neq C$). Kẻ $MD\perp AB$ tại $D$, $ME\perp AC$ tại $E$.

### ý a · HLY00441

**Hỏi:** Chứng minh tứ giác $ADME$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Tứ giác $ADME$ có $\widehat{DAE}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$, $D\in AB$, $E\in AC$), $\widehat{ADM}=90^\circ$ (vì $MD\perp AB$), $\widehat{AEM}=90^\circ$ (vì $ME\perp AC$).

Suy ra $\widehat{DME}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADME$ có bốn góc vuông nên là hình chữ nhật.

</details>

### ý b · HLY00442

**Hỏi:** Qua $A$ kẻ tia $Ax\parallel DE$; $Ax$ cắt tia $ME$ tại $F$. Trên tia $MD$ lấy điểm $G$ sao cho $D$ là trung điểm của $MG$. Chứng minh tứ giác $ADEF$ là hình bình hành và $A$ là trung điểm của đoạn thẳng $GF$.

<details><summary>Lời giải</summary>

Vì $ADME$ là hình chữ nhật nên $AD\parallel ME$, $AE\parallel DM$ và $AE=DM$.

Vì $F$ thuộc đường thẳng $ME$ nên $AD\parallel EF$.

Lại có $AF\parallel DE$ (theo cách kẻ tia $Ax$).

Tứ giác $ADEF$ có hai cặp cạnh đối song song nên là hình bình hành.

Suy ra $AF=DE$.

Vì $D$ là trung điểm của $MG$ nên $DG=DM$. Mà $DM=AE$ nên $DG=AE$.

Vì $G$ thuộc đường thẳng $DM$ và $AE\parallel DM$ nên $AE\parallel DG$.

Tứ giác $AEDG$ có $AE\parallel DG$ và $AE=DG$ nên là hình bình hành (dấu hiệu nhận biết).

Suy ra $AG\parallel DE$ và $AG=DE$.

Vì $AG\parallel DE$ và $AF\parallel DE$ nên $G$, $A$, $F$ thẳng hàng (qua $A$ chỉ có một đường thẳng song song với $DE$).

Vì $D$ nằm giữa $M$ và $G$ nên $G$ và $M$ nằm về hai phía của đường thẳng $AB$. Vì $F$ thuộc đường thẳng $ME\parallel AB$ nên $F$ và $M$ nằm cùng phía của $AB$. Do đó $G$ và $F$ nằm về hai phía của $AB$, mà $A$ là điểm chung của $AB$ và đường thẳng $GF$ nên $A$ nằm giữa $G$ và $F$.

Lại có $AG=DE=AF$.

Vậy $A$ là trung điểm của đoạn thẳng $GF$.

</details>

### ý c · HLY00443

**Hỏi:** $AM$ cắt $DE$ tại $O$, kẻ đường cao $AH$ của tam giác $ABC$. Tính số đo góc $DHE$.

<details><summary>Lời giải</summary>

Vì $ADME$ là hình chữ nhật nên $AM=DE$ và $O$ là trung điểm của mỗi đường chéo, do đó $OA=OM=\dfrac{1}{2}AM$ và $OD=OE=\dfrac{1}{2}DE$.

Trường hợp $H$ trùng $M$: $\widehat{DHE}=\widehat{DME}=90^\circ$.

Trường hợp $H$ khác $M$: vì $M\neq B$ nên $D\neq B$, mà $H$ thuộc $BC$ còn $D$ thuộc $AB$ nên $H\neq D$; tương tự $M\neq C$ nên $H\neq E$.

Vì $AH\perp BC$ và $M$ thuộc $BC$ nên $\triangle AHM$ vuông tại $H$.

Tam giác vuông $AHM$ có $HO$ là trung tuyến ứng với cạnh huyền $AM$ nên $HO=\dfrac{1}{2}AM=\dfrac{1}{2}DE$.

Do đó $OH=OD=OE$.

Tam giác $OHD$ có $OH=OD$ nên cân tại $O$, suy ra $\widehat{ODH}=\widehat{OHD}$.

Tam giác $OHE$ có $OH=OE$ nên cân tại $O$, suy ra $\widehat{OEH}=\widehat{OHE}$.

Vì $O$ nằm giữa $D$ và $E$ nên $\widehat{DHE}=\widehat{OHD}+\widehat{OHE}=\widehat{ODH}+\widehat{OEH}=\widehat{HDE}+\widehat{HED}$.

Xét $\triangle DHE$ có $\widehat{DHE}+\widehat{HDE}+\widehat{HED}=180^\circ$ (tổng ba góc của tam giác).

Suy ra $2\cdot\widehat{DHE}=180^\circ$, hay $\widehat{DHE}=90^\circ$.

Vậy $\widehat{DHE}=90^\circ$.

</details>

---

## HLB00177 · gốc HHC002664 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00177_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00177.png`:

Cho hình chữ nhật $ABCD$. Gọi $H$ là hình chiếu của $B$ trên $AC$. Gọi $M,\ N,\ P$ lần lượt là trung điểm của $AB,\ AH,\ DC$.

### ý a · HLY00444

**Hỏi:** Chứng minh $MBCP$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Vì $ABCD$ là hình chữ nhật nên $AB\parallel DC$ và $AB=DC$.

Vì $M$ thuộc $AB$ và $P$ thuộc $DC$ nên $MB\parallel PC$.

Vì $M$, $P$ là trung điểm của $AB$, $DC$ nên $MB=\dfrac{1}{2}AB=\dfrac{1}{2}DC=PC$.

Tứ giác $MBCP$ có $MB\parallel PC$ và $MB=PC$ nên là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $MBCP$ có $\widehat{MBC}=\widehat{ABC}=90^\circ$ (vì $M$ thuộc $AB$) nên là hình chữ nhật (dấu hiệu nhận biết).

</details>

### ý b · HLY00445

**Hỏi:** Chứng minh $MN\perp AC$.

<details><summary>Lời giải</summary>

Vì $BH\perp AC$ và $H$ thuộc $AC$ nên $\triangle ABH$ vuông tại $H$.

Tam giác vuông $ABH$ có $HM$ là trung tuyến ứng với cạnh huyền $AB$ nên $MH=\dfrac{1}{2}AB=MA$.

Xét $\triangle MNA$ và $\triangle MNH$ có:

$MA=MH$ (chứng minh trên)

$NA=NH$ ($N$ là trung điểm của $AH$)

$MN$ chung

Do đó $\triangle MNA=\triangle MNH$ (c.c.c), suy ra $\widehat{MNA}=\widehat{MNH}$.

Mà hai góc này kề bù nên $\widehat{MNA}=\widehat{MNH}=90^\circ$, tức là $MN\perp AH$.

Vì $N$ thuộc $AH$ và $H$ thuộc $AC$ nên đường thẳng $AH$ trùng với đường thẳng $AC$, do đó $MN\perp AC$.

</details>

### ý c · HLY00446

**Hỏi:** Kẻ $NK\parallel AB$ ($K\in BH$). Chứng minh $NKCP$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $MN\perp AC$ (câu b) và $BH\perp AC$ nên $MN\parallel BH$. Mà $K$ thuộc $BH$ nên $MN\parallel BK$.

Vì $NK\parallel AB$ và $M$ thuộc $AB$ nên $NK\parallel MB$.

Tứ giác $MBKN$ có hai cặp cạnh đối song song nên là hình bình hành.

Suy ra $NK=MB$ và $BK=MN$.

Mà $MB=PC$ (câu a) nên $NK=PC$.

Vì $NK\parallel AB$ và $PC\parallel AB$ nên $NK\parallel PC$.

Tứ giác $NKCP$ có $NK\parallel PC$ và $NK=PC$ nên là hình bình hành (dấu hiệu nhận biết).

</details>

### ý d · HLY00447

**Hỏi:** Chứng minh $K$ là trung điểm của $BH$.

<details><summary>Lời giải</summary>

Xét $\triangle ANM$ và $\triangle NHK$ có:

$\widehat{NAM}=\widehat{HNK}$ (đồng vị, vì $AM\parallel NK$)

$AN=NH$ ($N$ là trung điểm của $AH$)

$\widehat{ANM}=\widehat{NHK}=90^\circ$ ($MN\perp AH$ ở câu b; $NH\perp HK$ vì $N$ thuộc $AH$, $K$ thuộc $HB$ và $AH\perp HB$)

Do đó $\triangle ANM=\triangle NHK$ (g.c.g), suy ra $MN=HK$.

Mà $BK=MN$ (câu c) nên $BK=KH$.

Vì $K$ thuộc đoạn thẳng $BH$ và $BK=KH$ nên $K$ là trung điểm của $BH$.

</details>

---

## HLB00178 · gốc HHC002665 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00178_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00178.png`:

Cho tam giác $ABC$ vuông tại $A$, $AB<AC$, đường cao $AH$. Từ $H$ kẻ $HM\perp AB,\ HN\perp AC$ ($M\in AB,\ N\in AC$). Gọi $I$ là trung điểm của $HC$; lấy $K$ sao cho $I$ là trung điểm của $AK$.

### ý a · HLY00448

**Hỏi:** Chứng minh $AC\parallel HK$.

<details><summary>Lời giải</summary>

Tứ giác $AHKC$ có $I$ là trung điểm của $HC$ và $I$ là trung điểm của $AK$.

Do đó hai đường chéo $AK$ và $HC$ cắt nhau tại trung điểm của mỗi đường nên $AHKC$ là hình bình hành (dấu hiệu nhận biết).

Suy ra $HK\parallel AC$.

Vậy $AC\parallel HK$.

</details>

### ý b · HLY00449

**Hỏi:** $MN$ cắt $AH$ tại $O$. Chứng minh $O$ là trung điểm của $AH$ và $MN$.

<details><summary>Lời giải</summary>

Tứ giác $AMHN$ có $\widehat{MAN}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$, $M\in AB$, $N\in AC$), $\widehat{AMH}=90^\circ$ (vì $HM\perp AB$), $\widehat{ANH}=90^\circ$ (vì $HN\perp AC$).

Suy ra $\widehat{MHN}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AMHN$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AH$ và $MN$ cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là giao điểm của $MN$ và $AH$ nên $O$ là trung điểm của $AH$ và $MN$.

</details>

### ý c · HLY00450

**Hỏi:** Chứng minh $MNCK$ là hình thang cân.

<details><summary>Lời giải</summary>

Vì $HM\perp AB$ và $AC\perp AB$ nên $HM\parallel AC$.

Mà $HK\parallel AC$ (câu a) nên $HM$ và $HK$ cùng là đường thẳng đi qua $H$ song song với $AC$, do đó $M$, $H$, $K$ thẳng hàng.

Suy ra $MK\parallel AC$, hay $MK\parallel NC$ (vì $N$, $C$ thuộc $AC$).

Tứ giác $MNCK$ có $MK\parallel NC$ nên là hình thang.

Xét $\triangle NHK$ và $\triangle MAC$ có:

$NH=MA$ (cạnh đối của hình chữ nhật $AMHN$)

$\widehat{NHK}=\widehat{MAC}=90^\circ$ ($HN\perp AC$ mà $HK\parallel AC$ nên $HN\perp HK$; $\widehat{MAC}=90^\circ$ vì $\triangle ABC$ vuông tại $A$ và $M\in AB$)

$HK=AC$ (cạnh đối của hình bình hành $AHKC$)

Do đó $\triangle NHK=\triangle MAC$ (c.g.c), suy ra $NK=MC$.

Hình thang $MNCK$ có hai đường chéo $MC$ và $NK$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

</details>

---

## HLB00179 · gốc HHC002666 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00179_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00179.png`:

Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), đường cao $AH$. Gọi $M$ là trung điểm của đoạn thẳng $HC$. Trên tia đối của tia $MA$, lấy điểm $D$ sao cho $MD=MA$.

### ý a · HLY00451

**Hỏi:** Chứng minh tứ giác $AHDC$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $M$ là trung điểm của $HC$ nên $MH=MC$.

Vì $D$ thuộc tia đối của tia $MA$ và $MD=MA$ nên $M$ là trung điểm của $AD$.

Tứ giác $AHDC$ có hai đường chéo $AD$ và $HC$ cắt nhau tại $M$, mà $M$ là trung điểm của mỗi đường chéo, nên $AHDC$ là hình bình hành (dấu hiệu nhận biết).

</details>

### ý b · HLY00452

**Hỏi:** Gọi $N,\ K$ lần lượt là trung điểm của các đoạn thẳng $AH$ và $CD$. Chứng minh $HNCK$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $AHDC$ là hình bình hành nên $AH\parallel DC$ và $AH=DC$.

Vì $N$ thuộc $AH$ và $K$ thuộc $CD$ nên $HN\parallel KC$.

Vì $N$, $K$ là trung điểm của $AH$, $CD$ nên $HN=\dfrac{1}{2}AH$ và $KC=\dfrac{1}{2}CD$.

Mà $AH=DC$ nên $HN=KC$.

Tứ giác $HNCK$ có $HN\parallel KC$ và $HN=KC$ nên là hình bình hành (dấu hiệu nhận biết).

</details>

### ý c · HLY00453

**Hỏi:** Chứng minh $M$ là trung điểm của $NK$.

<details><summary>Lời giải</summary>

Vì $HNCK$ là hình bình hành (câu b) nên hai đường chéo $HC$ và $NK$ cắt nhau tại trung điểm của mỗi đường.

Mà $M$ là trung điểm của $HC$ nên $M$ là trung điểm của $NK$.

</details>

---

## HLB00180 · gốc HHC002667 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00180_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00180.png`:

Cho tam giác $ABC$ vuông tại $A$ ($AB\ge AC$). Gọi $E$ là trung điểm của $BC$; $D,\ H$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$.

### ý a · HLY00454

**Hỏi:** Chứng minh $ADEH$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Xét tứ giác $ADEH$ có:

$\widehat{DAH}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ADE}=90^\circ$ (vì $ED\perp AB$)

$\widehat{AHE}=90^\circ$ (vì $EH\perp AC$)

Suy ra $\widehat{DEH}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEH$ có bốn góc vuông nên $ADEH$ là hình chữ nhật.

</details>

### ý b · HLY00455

**Hỏi:** Chứng minh $D$ là trung điểm của $AB$.

<details><summary>Lời giải</summary>

Tam giác $ABC$ vuông tại $A$ có $AE$ là đường trung tuyến ứng với cạnh huyền $BC$ nên $EA=\dfrac{1}{2}BC$.

Mà $E$ là trung điểm của $BC$ nên $EB=\dfrac{1}{2}BC$.

Do đó $EA=EB$, suy ra $\triangle EAB$ cân tại $E$.

Vì $ED\perp AB$ tại $D$ nên $ED$ là đường cao ứng với đáy $AB$ của tam giác cân $EAB$.

Trong tam giác cân, đường cao ứng với đáy đồng thời là đường trung tuyến nên $D$ là trung điểm của $AB$.

</details>

### ý c · HLY00456

**Hỏi:** Lấy $F$ sao cho $D$ là trung điểm của $EF$. Chứng minh $AHDF$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $ADEH$ là hình chữ nhật (câu a) nên $AH\parallel DE$ và $AH=DE$.

Vì $D$ là trung điểm của $EF$ nên $F$ nằm trên đường thẳng $DE$ và $DF=DE$.

Do đó $AH\parallel DF$ và $AH=DF$.

Tứ giác $AHDF$ có $AH\parallel DF$ và $AH=DF$ nên $AHDF$ là hình bình hành (dấu hiệu nhận biết).

</details>

### ý d · HLY00457

**Hỏi:** Gọi $O$ là giao điểm của $AD$ và $HF$. Chứng minh $O$ là trung điểm của $AD$ và $HF$.

<details><summary>Lời giải</summary>

Vì $AHDF$ là hình bình hành (câu c) nên hai đường chéo $AD$ và $HF$ cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là giao điểm của $AD$ và $HF$ nên $O$ là trung điểm của $AD$ và của $HF$.

</details>

---

## HLB00181 · gốc HHC002668 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00181_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00181.png`:

Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$). Lấy $M\in BC$ sao cho $BM>MC,\ M\neq C$. Gọi $N,\ D$ lần lượt là hình chiếu của $M$ trên $AB,\ AC$.

### ý a · HLY00458

**Hỏi:** Chứng minh $ADMN$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Xét tứ giác $ADMN$ có:

$\widehat{NAD}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ANM}=90^\circ$ (vì $MN\perp AB$)

$\widehat{ADM}=90^\circ$ (vì $MD\perp AC$)

Suy ra $\widehat{DMN}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADMN$ có bốn góc vuông nên $ADMN$ là hình chữ nhật.

</details>

### ý b · HLY00459

**Hỏi:** Trên tia đối của tia $NM$ lấy $P$ sao cho $NM=NP$. Chứng minh $APND$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $ADMN$ là hình chữ nhật (câu a) nên $NM\parallel AD$ và $NM=AD$.

Vì $P$ thuộc tia đối của tia $NM$ nên $P$, $N$, $M$ thẳng hàng, do đó $NP\parallel AD$.

Mà $NP=NM$ (đề) nên $NP=AD$.

Tứ giác $APND$ có $PN\parallel AD$ và $PN=AD$ nên $APND$ là hình bình hành (dấu hiệu nhận biết).

</details>

### ý c · HLY00460

**Hỏi:** Gọi $Q$ là hình chiếu của $M$ trên $AP$, $O$ là giao điểm của $QM$ và $ND$. Chứng minh $O$ là trung điểm của $QM$ và $\widehat{AQN}=\widehat{ADN}$.

<details><summary>Lời giải</summary>

Chứng minh $O$ là trung điểm của $QM$.

Vì $APND$ là hình bình hành (câu b) nên $ND\parallel AP$.

Mà $QM\perp AP$ ($Q$ là hình chiếu của $M$ trên $AP$) nên $QM\perp ND$. Do đó $NO\perp QM$ tại $O$.

Tam giác $MQP$ vuông tại $Q$ có $N$ là trung điểm của cạnh huyền $MP$ (vì $NM=NP$) nên $NQ=\dfrac{1}{2}MP=NM$ (trung tuyến ứng với cạnh huyền).

Suy ra $\triangle NQM$ cân tại $N$, có $NO\perp QM$ nên $NO$ là đường cao ứng với đáy $QM$.

Trong tam giác cân, đường cao ứng với đáy đồng thời là đường trung tuyến nên $O$ là trung điểm của $QM$.

Chứng minh $\widehat{AQN}=\widehat{ADN}$.

Trước hết ta chứng minh $A$ nằm giữa $Q$ và $P$.

Gọi $E$ là trung điểm của $BC$. Tam giác $ABC$ vuông tại $A$ có $AE$ là trung tuyến ứng với cạnh huyền nên $EA=EC=\dfrac{1}{2}BC$, suy ra $\triangle EAC$ cân tại $E$ và $\widehat{EAC}=\widehat{C}$.

Vì $AB<AC$ nên $\widehat{C}<\widehat{B}$ (quan hệ giữa góc và cạnh đối diện), mà $\widehat{B}+\widehat{C}=90^\circ$ nên $\widehat{C}<45^\circ$.

Vì $BM>MC$ nên $M$ nằm giữa $E$ và $C$, do đó $\widehat{MAC}<\widehat{EAC}=\widehat{C}<45^\circ$, suy ra $\widehat{MAN}=90^\circ-\widehat{MAC}>45^\circ$.

Vì $AN\perp MP$ tại trung điểm $N$ của $MP$ nên $AN$ là đường trung trực của $MP$, suy ra $AM=AP$; tam giác $AMP$ cân tại $A$ có đường cao $AN$ đồng thời là đường phân giác nên $\widehat{MAP}=2\widehat{MAN}>90^\circ$.

Nếu $Q$ thuộc tia $AP$ thì $Q\ne A$ (vì $\widehat{MAP}\ne 90^\circ$) và tam giác $AQM$ có $\widehat{QAM}+\widehat{AQM}=\widehat{MAP}+90^\circ>180^\circ$, vô lí. Vậy $Q$ thuộc tia đối của tia $AP$, tức $A$ nằm giữa $Q$ và $P$.

Do đó tia $QA$ trùng tia $QP$ và tia $PA$ trùng tia $PQ$, suy ra $\widehat{AQN}=\widehat{PQN}$ và $\widehat{APN}=\widehat{QPN}$.

Vì $\triangle NQP$ cân tại $N$ nên $\widehat{PQN}=\widehat{QPN}$. Do đó $\widehat{AQN}=\widehat{APN}$.

Vì $APND$ là hình bình hành (câu b) nên $\widehat{APN}=\widehat{ADN}$ (hai góc đối).

Vậy $\widehat{AQN}=\widehat{ADN}$.

</details>

---

## HLB00182 · gốc HHC002669 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00182_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00182.png`:

Cho tam giác $ABC$ vuông tại $A$. Gọi $M$ là trung điểm của $BC$; lấy $D$ sao cho $M$ là trung điểm của $AD$.

### ý a · HLY00461

**Hỏi:** Chứng minh $ABDC$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Vì $M$ là trung điểm của $BC$ và là trung điểm của $AD$ nên hai đường chéo $AD$ và $BC$ của tứ giác $ABDC$ cắt nhau tại trung điểm của mỗi đường.

Do đó $ABDC$ là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $ABDC$ có $\widehat{BAC}=90^\circ$ nên $ABDC$ là hình chữ nhật (dấu hiệu nhận biết).

</details>

### ý b · HLY00462

**Hỏi:** Trên tia đối của tia $CA$, lấy $E$ sao cho $CE=CA$. Chứng minh $BDEC$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $ABDC$ là hình chữ nhật (câu a) nên $BD\parallel AC$ và $BD=AC$.

Vì $E$ thuộc tia đối của tia $CA$ nên $E$ nằm trên đường thẳng $AC$, do đó $BD\parallel CE$.

Lại có $CE=CA$ (đề) và $BD=AC$ nên $BD=CE$.

Tứ giác $BDEC$ có $BD\parallel CE$ và $BD=CE$ nên $BDEC$ là hình bình hành (dấu hiệu nhận biết).

</details>

### ý c · HLY00463

**Hỏi:** Gọi $O$ là trung điểm của $CD$. Chứng minh $O$ là trung điểm của $BE$.

<details><summary>Lời giải</summary>

Vì $BDEC$ là hình bình hành (câu b) nên hai đường chéo $BE$ và $CD$ cắt nhau tại trung điểm của mỗi đường.

Do đó trung điểm của $CD$ cũng là trung điểm của $BE$.

Mà $O$ là trung điểm của $CD$ nên $O$ là trung điểm của $BE$.

</details>

