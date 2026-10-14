# Gói vẽ hình theo ý: K8-g6

Luật: docs/mau-brief-ve-lai-hinh.md §4 (dấu bằng nhau) + §5 (hình theo ý). Tệp ra: `<MA>.png` — HLB… = hình bài, HLY… = hình ý (cộng dồn).

---

## HLB00159 · gốc HHC002627 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai

**Tham chiếu:** hình lời giải cũ: HLB00159_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00159.png`:

Cho tam giác $ABC$ vuông tại $A$ $(AB>AC)$. Gọi $E$ là trung điểm của $BC$. $D,\ H$ lần lượt là chân đường vuông góc kẻ từ $E$ xuống $AB,\ AC$.

### ý a · HLY00394

**Hỏi:** Chứng minh tứ giác $ADEH$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Xét tứ giác $ADEH$ có:

$\widehat{DAH}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ADE}=90^\circ$ (vì $ED\perp AB$)

$\widehat{AHE}=90^\circ$ (vì $EH\perp AC$)

Suy ra $\widehat{DEH}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEH$ có bốn góc vuông nên $ADEH$ là hình chữ nhật.

</details>

### ý b · HLY00395

**Hỏi:** Chứng minh $D$ là trung điểm $AB$.

<details><summary>Lời giải</summary>

Vì $ED\perp AB$ và $AC\perp AB$ (tam giác $ABC$ vuông tại $A$) nên $ED\parallel AC$.

Xét $\triangle ABC$ có $E$ là trung điểm của $BC$ và $ED\parallel AC$ ($D\in AB$).

Suy ra $D$ là trung điểm của $AB$ (đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba).

</details>

### ý c · HLY00396

**Hỏi:** Lấy điểm $F$ sao cho $D$ là trung điểm của $EF$. Kẻ $EI$ vuông góc với $AF$ tại $I$. Chứng minh $IH$ vuông góc với $ID$.

<details><summary>Lời giải</summary>

Vì $ADEH$ là hình chữ nhật nên hai đường chéo $AE$ và $DH$ bằng nhau và cắt nhau tại trung điểm của mỗi đường.

Gọi $O$ là giao điểm của $AE$ và $DH$. Khi đó $O$ là trung điểm của $AE$ và của $DH$, và $AE=DH$.

Xét $\triangle AIE$ vuông tại $I$ (vì $EI\perp AF$) có $IO$ là đường trung tuyến ứng với cạnh huyền $AE$ nên $IO=\dfrac{1}{2}AE$.

Mà $AE=DH$ nên $IO=\dfrac{1}{2}DH$.

Xét $\triangle DIH$ có trung tuyến $IO$ ($O$ là trung điểm của $DH$) bằng nửa cạnh $DH$ nên $\triangle DIH$ vuông tại $I$.

Vậy $IH\perp ID$.

</details>

### ý d · HLY00397

**Hỏi:** Chứng minh $\widehat{IAD}=\widehat{IHD}$.

<details><summary>Lời giải</summary>

Vì $D$ là trung điểm của $EF$ và $ED\perp AB$ nên $E$, $D$, $F$ thẳng hàng và $\widehat{ADF}=90^\circ$.

Xét $\triangle ADE$ và $\triangle ADF$ có:

$DE=DF$ ($D$ là trung điểm của $EF$)

$\widehat{ADE}=\widehat{ADF}=90^\circ$

$AD$ là cạnh chung

Do đó $\triangle ADE=\triangle ADF$ (c.g.c), suy ra $\widehat{DAE}=\widehat{DAF}$.

Vì $AB>AC$ nên $\widehat{B}<\widehat{C}$, mà $\widehat{B}+\widehat{C}=90^\circ$ nên $\widehat{B}<45^\circ$.

Vì $E$ là trung điểm cạnh huyền $BC$ nên $EA=EB$, suy ra $\widehat{DAE}=\widehat{B}<45^\circ$. Do đó $\widehat{EAF}=2\cdot\widehat{DAE}<90^\circ$, nên chân đường vuông góc $I$ kẻ từ $E$ xuống $AF$ nằm trên tia $AF$.

Suy ra $\widehat{IAD}=\widehat{FAD}=\widehat{DAE}$.

Xét $\triangle ADE$ và $\triangle HED$ có:

$AD=HE$ (hai cạnh đối của hình chữ nhật $ADEH$)

$\widehat{ADE}=\widehat{HED}=90^\circ$

$DE$ là cạnh chung

Do đó $\triangle ADE=\triangle HED$ (c.g.c), suy ra $\widehat{DAE}=\widehat{EHD}$.

Xét $\triangle EIF$ vuông tại $I$ có $ID$ là đường trung tuyến ứng với cạnh huyền $EF$ nên $ID=\dfrac{1}{2}EF=DE$.

Xét $\triangle DIH$ vuông tại $I$ (câu c) và $\triangle DEH$ vuông tại $E$ có:

$DI=DE$ (chứng minh trên)

$DH$ là cạnh huyền chung

Do đó $\triangle DIH=\triangle DEH$ (cạnh huyền – cạnh góc vuông), suy ra $\widehat{IHD}=\widehat{EHD}$.

Vậy $\widehat{IAD}=\widehat{DAE}=\widehat{EHD}=\widehat{IHD}$.

</details>

---

## HLB00160 · gốc HHC002628 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai

**Tham chiếu:** hình lời giải cũ: HLB00160_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00160.png`:

Cho tam giác $ABC$ vuông tại $A$ $(AB<AC)$. Gọi $M,\ N,\ Q$ lần lượt là trung điểm của $AB,\ BC,\ AC$. Kẻ $AI$ vuông góc với $BC$ tại $I$.

### ý a · HLY00398

**Hỏi:** Chứng minh tứ giác $AMNQ$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Vì $\triangle ABC$ vuông tại $A$ có $AN$ là trung tuyến ứng với cạnh huyền $BC$ nên $NA=NB=NC=\dfrac{1}{2}BC$.

Xét $\triangle NMA$ và $\triangle NMB$ có:

$NA=NB$ (chứng minh trên)

$MA=MB$ ($M$ là trung điểm của $AB$)

$NM$ chung

Do đó $\triangle NMA=\triangle NMB$ (c.c.c).

Suy ra $\widehat{NMA}=\widehat{NMB}$. Mà hai góc này kề bù nên $\widehat{NMA}=\widehat{NMB}=90^\circ$.

Chứng minh tương tự, với $NA=NC$ và $QA=QC$, ta được $\widehat{NQA}=90^\circ$.

Tứ giác $AMNQ$ có $\widehat{MAQ}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AMN}=90^\circ$, $\widehat{AQN}=90^\circ$.

Suy ra $\widehat{MNQ}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AMNQ$ có bốn góc vuông nên là hình chữ nhật.

</details>

### ý b · HLY00399

**Hỏi:** Qua $A$ kẻ đường thẳng song song với $BC$ và cắt $NQ$ tại điểm $K$. Chứng minh rằng $AK\parallel MQ$.

<details><summary>Lời giải</summary>

Xét $\triangle ABC$ có $M$ là trung điểm của $AB$ và $Q$ là trung điểm của $AC$ nên $MQ$ là đường trung bình của $\triangle ABC$.

Suy ra $MQ\parallel BC$.

Mà $AK\parallel BC$ (giả thiết) nên $AK\parallel MQ$.

</details>

### ý c · HLY00400

**Hỏi:** Chứng minh tứ giác $INQM$ là hình thang cân.

<details><summary>Lời giải</summary>

Vì $MQ\parallel BC$ (câu b) mà $I$, $N$ thuộc $BC$ ($I$ không trùng $N$ vì $AB<AC$) nên $MQ\parallel IN$, do đó $INQM$ là hình thang.

Vì $AMNQ$ là hình chữ nhật nên $MN=AQ$ (1).

Vì $AI\perp BC$ nên $\triangle AIC$ vuông tại $I$, có $IQ$ là trung tuyến ứng với cạnh huyền $AC$ nên $IQ=\dfrac{1}{2}AC=AQ$ (2).

Từ (1) và (2) suy ra $IQ=MN$.

Hình thang $INQM$ có hai đường chéo $IQ$ và $NM$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

</details>

### ý d · HLY00401

**Hỏi:** Chứng minh $MI$ vuông góc với $QI$.

<details><summary>Lời giải</summary>

Gọi $O$ là giao điểm của $AN$ và $MQ$.

Vì $AMNQ$ là hình chữ nhật nên $AN=MQ$ và $O$ là trung điểm của mỗi đường chéo, do đó $OM=OQ=\dfrac{1}{2}MQ$.

Vì $AI\perp BC$ và $N$ thuộc $BC$ nên $\triangle AIN$ vuông tại $I$ ($I$ không trùng $N$ vì $AB<AC$).

Tam giác vuông $AIN$ có $IO$ là trung tuyến ứng với cạnh huyền $AN$ nên $IO=\dfrac{1}{2}AN=\dfrac{1}{2}MQ$.

Tam giác $MIQ$ có trung tuyến $IO$ ứng với cạnh $MQ$ và $IO=\dfrac{1}{2}MQ$ nên $\triangle MIQ$ vuông tại $I$.

Vậy $MI\perp QI$.

</details>

---

## HLB00161 · gốc HHC002629 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai

**Tham chiếu:** hình lời giải cũ: HLB00161_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00161.png`:

Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Kẻ $HI$ vuông góc với $AB$ tại $I$. Kẻ $HK$ vuông góc với $AC$ tại $K$.

### ý a · HLY00402

**Hỏi:** Chứng minh $AH=IK$.

<details><summary>Lời giải</summary>

Tứ giác $AIHK$ có $\widehat{IAK}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AIH}=90^\circ$ (vì $HI\perp AB$), $\widehat{AKH}=90^\circ$ (vì $HK\perp AC$).

Suy ra $\widehat{IHK}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AIHK$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AH$ và $IK$ bằng nhau, tức là $AH=IK$.

</details>

### ý b · HLY00403

**Hỏi:** Gọi $M$ là trung điểm của $BC$. Chứng minh $BC\ge 2IK$.

<details><summary>Lời giải</summary>

Vì $\triangle ABC$ vuông tại $A$ có $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $AM=\dfrac{1}{2}BC$, hay $BC=2AM$.

Vì $AH\perp BC$ và $M$ thuộc $BC$ nên $AH$ là đường vuông góc, $AM$ là đường xiên kẻ từ $A$ đến $BC$, do đó $AH\le AM$.

Mà $AH=IK$ (câu a) nên $IK\le AM$.

Suy ra $2IK\le 2AM=BC$.

Vậy $BC\ge 2IK$.

</details>

### ý c · HLY00404

**Hỏi:** Chứng minh $AM$ vuông góc với $IK$.

<details><summary>Lời giải</summary>

Gọi $O$ là giao điểm của $AH$ và $IK$, $E$ là giao điểm của $AM$ và $IK$.

Vì $AIHK$ là hình chữ nhật nên $O$ là trung điểm của mỗi đường chéo và $AH=IK$, suy ra $OA=OK$.

Do đó $\triangle OAK$ cân tại $O$, suy ra $\widehat{OAK}=\widehat{OKA}$, tức là $\widehat{HAC}=\widehat{AKI}$ (1).

Vì $MA=MC$ (cùng bằng $\dfrac{1}{2}BC$) nên $\triangle MAC$ cân tại $M$, suy ra $\widehat{MAC}=\widehat{C}$ (2).

Vì $\triangle AHC$ vuông tại $H$ nên $\widehat{HAC}+\widehat{C}=90^\circ$ (3).

Từ (1), (2), (3) suy ra $\widehat{AKI}+\widehat{MAC}=90^\circ$, hay $\widehat{AKE}+\widehat{KAE}=90^\circ$.

Xét $\triangle AEK$ có $\widehat{AEK}=180^\circ-(\widehat{AKE}+\widehat{KAE})=180^\circ-90^\circ=90^\circ$.

Vậy $AM\perp IK$.

</details>

---

## HLB00162 · gốc HHC002630 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai

**Tham chiếu:** hình lời giải cũ: HLB00162_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00162.png`:

Cho hình chữ nhật $ABCD$. Điểm $I,\ K$ thuộc cạnh $CD$ sao cho $DI=CK$ ($I$ khác $D$). Qua $I$ kẻ đường thẳng vuông góc với $AI$, cắt đường thẳng $BC$ tại $N$. Gọi $O$ là trung điểm của $AN$.

### ý a · HLY00405

**Hỏi:** Chứng minh $OC=OD$.

<details><summary>Lời giải</summary>

Gọi $F$ là giao điểm của $DO$ và đường thẳng $BC$.

Vì $ABCD$ là hình chữ nhật nên $AD\parallel BC$, do đó $AD\parallel NF$.

Xét $\triangle OAD$ và $\triangle ONF$ có:

$\widehat{OAD}=\widehat{ONF}$ (so le trong, vì $AD\parallel NF$)

$OA=ON$ ($O$ là trung điểm của $AN$)

$\widehat{AOD}=\widehat{NOF}$ (đối đỉnh)

Do đó $\triangle OAD=\triangle ONF$ (g.c.g), suy ra $OD=OF$.

Vậy $O$ là trung điểm của $DF$.

Vì $DC\perp BC$ nên $\triangle DCF$ vuông tại $C$ ($F$ khác $C$ vì $O$ không nằm trên $DC$).

Tam giác vuông $DCF$ có $CO$ là trung tuyến ứng với cạnh huyền $DF$ nên $OC=\dfrac{1}{2}DF=OD$.

Vậy $OC=OD$.

</details>

### ý b · HLY00406

**Hỏi:** Chứng minh tam giác $AKN$ vuông tại $K$.

<details><summary>Lời giải</summary>

Vì $AI\perp IN$ nên $\triangle AIN$ vuông tại $I$, có $IO$ là trung tuyến ứng với cạnh huyền $AN$ nên $IO=\dfrac{1}{2}AN$ (1).

Vì $OC=OD$ (câu a) nên $\triangle ODC$ cân tại $O$, suy ra $\widehat{ODC}=\widehat{OCD}$.

Mà $I$, $K$ thuộc $CD$ nên $\widehat{ODI}=\widehat{OCK}$.

Xét $\triangle ODI$ và $\triangle OCK$ có:

$OD=OC$ (câu a)

$\widehat{ODI}=\widehat{OCK}$ (chứng minh trên)

$DI=CK$ (giả thiết)

Do đó $\triangle ODI=\triangle OCK$ (c.g.c), suy ra $OI=OK$ (2).

Từ (1) và (2) suy ra $OK=\dfrac{1}{2}AN$.

Tam giác $AKN$ có trung tuyến $KO$ ứng với cạnh $AN$ và $KO=\dfrac{1}{2}AN$ nên $\triangle AKN$ vuông tại $K$.

</details>

### ý c · HLY00407

**Hỏi:** Kẻ $NM$ vuông góc với $AD$ tại $M$. Chứng minh tam giác $BKM$ vuông tại $K$.

<details><summary>Lời giải</summary>

Tứ giác $ABNM$ có $\widehat{BAM}=90^\circ$ (vì $ABCD$ là hình chữ nhật), $\widehat{AMN}=90^\circ$ (vì $NM\perp AD$), $\widehat{ABN}=90^\circ$ (vì $N$ thuộc $BC$ và $AB\perp BC$).

Suy ra $\widehat{BNM}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ABNM$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AN$ và $BM$ bằng nhau và cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là trung điểm của $AN$ nên $O$ là trung điểm của $BM$ và $BM=AN$.

Theo câu b, $KO=\dfrac{1}{2}AN$ nên $KO=\dfrac{1}{2}BM$.

Tam giác $BKM$ có trung tuyến $KO$ ứng với cạnh $BM$ và $KO=\dfrac{1}{2}BM$ nên $\triangle BKM$ vuông tại $K$.

</details>

---

## HLB00163 · gốc HHC002631 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai

**Tham chiếu:** hình lời giải cũ: HLB00163_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00163.png`:

Cho tam giác $ABC$ vuông tại $A$, $M$ là trung điểm của $BC$. Điểm $D$ thuộc đoạn thẳng $AM$. Kẻ $DE,\ DF$ vuông góc với $AB,\ AC$ tại $E,\ F$.

### ý a · HLY00408

**Hỏi:** Chứng minh tứ giác $AEDF$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Tứ giác $AEDF$ có $\widehat{EAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AED}=90^\circ$ (vì $DE\perp AB$), $\widehat{AFD}=90^\circ$ (vì $DF\perp AC$).

Suy ra $\widehat{EDF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AEDF$ có bốn góc vuông nên là hình chữ nhật.

</details>

### ý b · HLY00409

**Hỏi:** Chứng minh $EF\parallel BC$.

<details><summary>Lời giải</summary>

Gọi $O$ là giao điểm của $AD$ và $EF$.

Vì $AEDF$ là hình chữ nhật nên $AD=EF$ và $O$ là trung điểm của mỗi đường chéo, suy ra $OA=OF$.

Do đó $\triangle OAF$ cân tại $O$, suy ra $\widehat{OAF}=\widehat{OFA}$, tức là $\widehat{DAF}=\widehat{AFE}$ (1).

Vì $\triangle ABC$ vuông tại $A$ có $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $MA=MC=\dfrac{1}{2}BC$.

Do đó $\triangle MAC$ cân tại $M$, suy ra $\widehat{MAC}=\widehat{C}$.

Mà $D$ thuộc $AM$ và $F$ thuộc $AC$ nên $\widehat{DAF}=\widehat{MAC}$, suy ra $\widehat{DAF}=\widehat{C}$ (2).

Từ (1) và (2) suy ra $\widehat{AFE}=\widehat{C}$.

Hai góc $\widehat{AFE}$ và $\widehat{ACB}$ ở vị trí đồng vị nên $EF\parallel BC$.

</details>

### ý c · HLY00410

**Hỏi:** Tìm vị trí điểm $D$ trên $AM$ để $BC=4EF$.

<details><summary>Lời giải</summary>

Vì $AEDF$ là hình chữ nhật nên $EF=AD$.

Vì $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $BC=2AM$.

Khi đó $BC=4EF$ trở thành $2AM=4AD$, suy ra $AD=\dfrac{1}{2}AM$.

Mà $D$ thuộc đoạn thẳng $AM$ nên $D$ là trung điểm của $AM$.

Vậy khi $D$ là trung điểm của $AM$ thì $BC=4EF$.

</details>

---

## HLB00164 · gốc HHC002640 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00164_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00164.png`:

(bài một ý — đề nằm trong ý)

### ý · · HLY00411

**Hỏi:** Cho tam giác $ABC$ vuông tại $A$, đường trung tuyến $AM$. Dựng điểm $H$ sao cho $AB$ là đường trung trực của $MH$, $E$ là giao điểm của $MH$ và $AB$. Dựng điểm $K$ sao cho $AC$ là đường trung trực của $MK$, $F$ là giao điểm của $MK$ và $AC$. Xác định dạng của tứ giác $AEMF,\ AMBH,\ AMCK$.

<details><summary>Lời giải</summary>

Xét tứ giác $AEMF$:

Vì $AB$ là đường trung trực của $MH$ nên $MH\perp AB$ tại $E$, do đó $\widehat{AEM}=90^\circ$.

Vì $AC$ là đường trung trực của $MK$ nên $MK\perp AC$ tại $F$, do đó $\widehat{AFM}=90^\circ$.

Vì $E\in AB$, $F\in AC$ và $\triangle ABC$ vuông tại $A$ nên $\widehat{EAF}=\widehat{BAC}=90^\circ$.

Tứ giác $AEMF$ có $\widehat{EAF}+\widehat{AEM}+\widehat{EMF}+\widehat{AFM}=360^\circ$ nên $\widehat{EMF}=360^\circ-3\cdot 90^\circ=90^\circ$.

Tứ giác $AEMF$ có bốn góc vuông nên $AEMF$ là hình chữ nhật (định nghĩa).

Xét tứ giác $AMBH$:

Vì $A$ nằm trên đường trung trực của $MH$ nên $AH=AM$.

Vì $B$ nằm trên đường trung trực của $MH$ nên $BH=BM$.

Vì $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AM=\dfrac{1}{2}BC=MB$.

Do đó $AM=MB=BH=HA$.

Tứ giác $AMBH$ có bốn cạnh bằng nhau nên $AMBH$ là hình thoi (định nghĩa).

Xét tứ giác $AMCK$:

Vì $A$ nằm trên đường trung trực của $MK$ nên $AK=AM$.

Vì $C$ nằm trên đường trung trực của $MK$ nên $CK=CM$.

Vì $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AM=\dfrac{1}{2}BC=MC$.

Do đó $AM=MC=CK=KA$.

Tứ giác $AMCK$ có bốn cạnh bằng nhau nên $AMCK$ là hình thoi (định nghĩa).

Vậy $AEMF$ là hình chữ nhật; $AMBH$ và $AMCK$ là hình thoi.

</details>

---

## HLB00165 · gốc HHC002641 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00165_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00165.png`:

(bài một ý — đề nằm trong ý)

### ý · · HLY00412

**Hỏi:** Cho tam giác $ABC$ cân tại $A$. Từ một điểm $D$ trên đáy $BC$, vẽ đường thẳng vuông góc với $BC$ cắt các đường thẳng $AC,\ AB$ lần lượt tại $M$ và $N$. Gọi $H$ và $K$ lần lượt là trung điểm của $BC$ và $MN$. Chứng minh rằng tứ giác $AKDH$ là hình chữ nhật.

<details><summary>Lời giải</summary>

Vì $\triangle ABC$ cân tại $A$ nên $AB=AC$ và $\widehat{B}=\widehat{C}$.

Xét $\triangle AHB$ và $\triangle AHC$ có:

$AB=AC$ (chứng minh trên)

$HB=HC$ ($H$ là trung điểm của $BC$)

$AH$ là cạnh chung

Do đó $\triangle AHB=\triangle AHC$ (c.c.c).

Suy ra $\widehat{AHB}=\widehat{AHC}$ (hai góc tương ứng).

Mà $\widehat{AHB}+\widehat{AHC}=180^\circ$ (hai góc kề bù) nên $\widehat{AHC}=90^\circ$, hay $AH\perp BC$.

Vì $D$ nằm trên đoạn $HC$ nên $\widehat{AHD}=\widehat{AHC}=90^\circ$.

Vì $MN\perp BC$ tại $D$ nên $\widehat{KDH}=90^\circ$ và các tam giác $DMC$, $DNB$ vuông tại $D$.

Trong $\triangle DMC$ vuông tại $D$ có $\widehat{DMC}=90^\circ-\widehat{C}$.

Trong $\triangle DNB$ vuông tại $D$ có $\widehat{DNB}=90^\circ-\widehat{B}$.

Theo hình vẽ, $M$ nằm giữa $A$ và $C$, $A$ nằm giữa $B$ và $N$, $M$ nằm giữa $N$ và $D$ nên $\widehat{AMN}=\widehat{DMC}$ (hai góc đối đỉnh) và $\widehat{ANM}=\widehat{DNB}$ (hai tia $NA,\ NB$ trùng nhau, hai tia $NM,\ ND$ trùng nhau).

Mà $\widehat{B}=\widehat{C}$ nên $\widehat{AMN}=\widehat{ANM}$.

Do đó $\triangle AMN$ cân tại $A$, suy ra $AM=AN$.

Xét $\triangle AKM$ và $\triangle AKN$ có:

$AM=AN$ (chứng minh trên)

$KM=KN$ ($K$ là trung điểm của $MN$)

$AK$ là cạnh chung

Do đó $\triangle AKM=\triangle AKN$ (c.c.c).

Suy ra $\widehat{AKM}=\widehat{AKN}$ (hai góc tương ứng).

Mà $\widehat{AKM}+\widehat{AKN}=180^\circ$ (hai góc kề bù) nên $\widehat{AKN}=90^\circ$, hay $AK\perp MN$.

Vì $D$ nằm trên đường thẳng $MN$ và $D\neq K$ nên $\widehat{AKD}=90^\circ$.

Tứ giác $AKDH$ có $\widehat{AHD}=\widehat{KDH}=\widehat{AKD}=90^\circ$ nên $\widehat{KAH}=360^\circ-3\cdot 90^\circ=90^\circ$.

Tứ giác $AKDH$ có bốn góc vuông nên $AKDH$ là hình chữ nhật (định nghĩa).

</details>

---

## HLB00166 · gốc HHC002642 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00166_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00166.png`:

Cho tam giác $ABC$, các đường trung tuyến $BD$ và $CE$ cắt nhau ở $G$. Gọi $H$ là trung điểm của $GB$, $K$ là trung điểm của $GC$.

### ý a · HLY00413

**Hỏi:** Chứng minh rằng tứ giác $DEHK$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $BD$ và $CE$ là hai đường trung tuyến của $\triangle ABC$ cắt nhau tại $G$ nên $G$ là trọng tâm của tam giác, do đó $GB=2GD$ và $GC=2GE$.

Vì $H$ là trung điểm của $GB$ nên $GH=\dfrac{1}{2}GB=GD$.

Vì $G$ nằm giữa $B$ và $D$, $H$ nằm trên đoạn $GB$ nên $G$ nằm giữa $D$ và $H$. Do đó $G$ là trung điểm của $DH$.

Vì $K$ là trung điểm của $GC$ nên $GK=\dfrac{1}{2}GC=GE$.

Vì $G$ nằm giữa $C$ và $E$, $K$ nằm trên đoạn $GC$ nên $G$ nằm giữa $E$ và $K$. Do đó $G$ là trung điểm của $EK$.

Tứ giác $DEHK$ có hai đường chéo $DH$ và $EK$ cắt nhau tại trung điểm $G$ của mỗi đường nên $DEHK$ là hình bình hành (dấu hiệu nhận biết).

</details>

### ý b · HLY00414

**Hỏi:** Tam giác $ABC$ có điều kiện gì thì tứ giác $DEHK$ là hình chữ nhật?

<details><summary>Lời giải</summary>

Trả lời: tam giác $ABC$ cân tại $A$.

Vì $DEHK$ là hình bình hành (câu a) nên $DEHK$ là hình chữ nhật khi và chỉ khi hai đường chéo $DH$ và $EK$ bằng nhau (tính chất và dấu hiệu nhận biết hình chữ nhật).

Ta có $DH=DG+GH=2GD=GB$ và $EK=EG+GK=2GE=GC$.

Chiều thuận: nếu $DEHK$ là hình chữ nhật thì $DH=EK$, suy ra $GB=GC$ và $2GD=2GE$, tức $GD=GE$.

Xét $\triangle GBE$ và $\triangle GCD$ có:

$GB=GC$ (chứng minh trên)

$GE=GD$ (chứng minh trên)

$\widehat{BGE}=\widehat{CGD}$ (hai góc đối đỉnh)

Do đó $\triangle GBE=\triangle GCD$ (c.g.c).

Suy ra $BE=CD$ (hai cạnh tương ứng).

Mà $E$, $D$ là trung điểm của $AB$, $AC$ nên $AB=2BE=2CD=AC$.

Vậy $\triangle ABC$ cân tại $A$.

Chiều đảo: nếu $\triangle ABC$ cân tại $A$ thì $AB=AC$, suy ra $AE=\dfrac{1}{2}AB=\dfrac{1}{2}AC=AD$.

Xét $\triangle ABD$ và $\triangle ACE$ có:

$AB=AC$ (giả thiết)

$\widehat{BAD}=\widehat{CAE}$ (cùng là góc $A$)

$AD=AE$ (chứng minh trên)

Do đó $\triangle ABD=\triangle ACE$ (c.g.c), suy ra $BD=CE$.

Mà $BD=GB+GD=3GD$ và $CE=GC+GE=3GE$ nên $GD=GE$.

Suy ra $GB=2GD=2GE=GC$, do đó $DH=EK$.

Hình bình hành $DEHK$ có hai đường chéo bằng nhau nên $DEHK$ là hình chữ nhật (dấu hiệu nhận biết).

Vậy $DEHK$ là hình chữ nhật khi và chỉ khi tam giác $ABC$ cân tại $A$.

</details>

---

## HLB00167 · gốc HHC002643 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00167_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00167.png`:

Cho $\triangle ABC$ vuông tại $A$, $M$ là một điểm thuộc cạnh $BC$. Qua $M$ vẽ các đường thẳng song song với $AB$ và $AC$, chúng cắt các cạnh $AC,\ AB$ theo thứ tự tại $E$ và $F$.

### ý a · HLY00415

**Hỏi:** Tứ giác $AFME$ là hình gì? Vì sao?

<details><summary>Lời giải</summary>

Vì $F\in AB$ và $ME\parallel AB$ nên $AF\parallel ME$.

Vì $E\in AC$ và $MF\parallel AC$ nên $AE\parallel MF$.

Tứ giác $AFME$ có $AF\parallel ME$ và $AE\parallel MF$ nên $AFME$ là hình bình hành (định nghĩa).

Vì $F\in AB$, $E\in AC$ và $\triangle ABC$ vuông tại $A$ nên $\widehat{FAE}=\widehat{BAC}=90^\circ$.

Hình bình hành $AFME$ có một góc vuông nên $AFME$ là hình chữ nhật (dấu hiệu nhận biết).

</details>

### ý b · HLY00416

**Hỏi:** Xác định vị trí điểm $M$ trên cạnh $BC$ để tứ giác $AFME$ là hình vuông.

<details><summary>Lời giải</summary>

$AFME$ là hình chữ nhật có đường chéo $AM$.

Nếu $AFME$ là hình vuông thì đường chéo $AM$ là đường phân giác của góc $A$ (tính chất hình vuông).

Ngược lại, nếu $AM$ là đường phân giác của $\widehat{BAC}$ thì hình chữ nhật $AFME$ có một đường chéo là đường phân giác của một góc nên $AFME$ là hình vuông (dấu hiệu nhận biết).

Vậy $AFME$ là hình vuông khi và chỉ khi $AM$ là tia phân giác của $\widehat{BAC}$, tức là $M$ là giao điểm của tia phân giác góc $A$ với cạnh $BC$.

</details>

---

## HLB00168 · gốc HHC002644 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00168_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00168.png`:

Cho tam giác $ABC$ vuông ở $A$. Gọi $E,\ G,\ F$ lần lượt là trung điểm của $AB,\ BC,\ AC$. Từ $E$ kẻ đường thẳng song song với $BF$, đường thẳng này cắt $GF$ tại $I$.

### ý a · HLY00417

**Hỏi:** Tứ giác $AEGF$ là hình gì? Vì sao?

<details><summary>Lời giải</summary>

Tam giác $ABC$ vuông tại $A$ có $AG$ là đường trung tuyến ứng với cạnh huyền $BC$ nên $GA=\dfrac{1}{2}BC=GB=GC$.

Xét $\triangle GAB$ có $GA=GB$ nên cân tại $G$.

Có $GE$ là đường trung tuyến ($E$ là trung điểm của $AB$) nên $GE$ cũng là đường cao, suy ra $GE\perp AB$, tức là $\widehat{AEG}=90^\circ$.

Tương tự, $\triangle GAC$ cân tại $G$ có $GF$ là đường trung tuyến nên $GF\perp AC$, tức là $\widehat{AFG}=90^\circ$.

Tứ giác $AEGF$ có $\widehat{EAF}=\widehat{AEG}=\widehat{AFG}=90^\circ$.

Suy ra $\widehat{EGF}=360^\circ-3 \cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AEGF$ có bốn góc vuông nên $AEGF$ là hình chữ nhật.

</details>

### ý b · HLY00418

**Hỏi:** Chứng minh tứ giác $BEIF$ là hình bình hành.

<details><summary>Lời giải</summary>

Vì $AEGF$ là hình chữ nhật (câu a) nên $AE\parallel GF$, mà $E\in AB$ nên $AB\parallel GF$.

Mà $B,\ E\in AB$ và $F,\ I\in GF$ nên $BE\parallel IF$.

Lại có $EI\parallel BF$ (theo đề).

Tứ giác $BEIF$ có $BE\parallel IF$ và $EI\parallel BF$ nên $BEIF$ là hình bình hành (định nghĩa).

</details>

### ý c · HLY00419

**Hỏi:** Chứng minh tứ giác $AGCI$ là hình thoi.

<details><summary>Lời giải</summary>

Vì $BEIF$ là hình bình hành (câu b) nên hai đường chéo $BI$ và $EF$ cắt nhau tại trung điểm $O$ của mỗi đường.

Vì $AEGF$ là hình chữ nhật (câu a) nên hai đường chéo $AG$ và $EF$ cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là trung điểm của $EF$ nên $O$ cũng là trung điểm của $AG$.

Tứ giác $ABGI$ có hai đường chéo $AG$ và $BI$ cắt nhau tại trung điểm $O$ của mỗi đường nên $ABGI$ là hình bình hành.

Suy ra $AI\parallel BG$ và $AI=BG$.

Vì $G$ là trung điểm của $BC$ nên $BG=GC$ và $B,\ G,\ C$ thẳng hàng, do đó $AI\parallel GC$ và $AI=GC$.

Tứ giác $AGCI$ có $AI\parallel GC$ và $AI=GC$ nên $AGCI$ là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $AGCI$ có hai cạnh kề $GA=GC$ (câu a) nên $AGCI$ là hình thoi (dấu hiệu nhận biết).

</details>

---

## HLB00169 · gốc HHC002645 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00169_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00169.png`:

Cho hình chữ nhật $ABCD$ có $AB=2BC$. Gọi $I$ là trung điểm của $AB$ và $K$ là trung điểm của $DC$.

### ý a · HLY00420

**Hỏi:** Chứng minh $AIKD$ và $BIKC$ là hình vuông.

<details><summary>Lời giải</summary>

Vì $ABCD$ là hình chữ nhật nên $AB\parallel CD$, $AB=CD$ và $\widehat{DAB}=\widehat{ABC}=90^\circ$.

Vì $I$ là trung điểm của $AB$ nên $AI=IB=\dfrac{1}{2}AB$.

Vì $K$ là trung điểm của $DC$ nên $DK=KC=\dfrac{1}{2}DC$.

Mà $AB=CD$ nên $AI=IB=DK=KC$.

Vì $I\in AB$, $K\in DC$ và $AB\parallel CD$ nên $AI\parallel DK$ và $IB\parallel KC$.

Tứ giác $AIKD$ có $AI\parallel DK$ và $AI=DK$ nên $AIKD$ là hình bình hành (dấu hiệu nhận biết).

Vì $I\in AB$ nên $\widehat{IAD}=\widehat{BAD}=90^\circ$, do đó hình bình hành $AIKD$ là hình chữ nhật.

Vì $AB=2BC$ và $AD=BC$ (hai cạnh đối của hình chữ nhật $ABCD$) nên $AB=2AD$, suy ra $AI=\dfrac{1}{2}AB=AD$.

Hình chữ nhật $AIKD$ có hai cạnh kề $AI=AD$ nên $AIKD$ là hình vuông (dấu hiệu nhận biết).

Tương tự, tứ giác $BIKC$ có $IB\parallel KC$ và $IB=KC$ nên là hình bình hành.

Vì $I\in AB$ nên $\widehat{IBC}=\widehat{ABC}=90^\circ$, do đó $BIKC$ là hình chữ nhật.

Có $IB=\dfrac{1}{2}AB=BC$ nên hình chữ nhật $BIKC$ có hai cạnh kề $BI=BC$, suy ra $BIKC$ là hình vuông.

</details>

### ý b · HLY00421

**Hỏi:** Chứng minh $\triangle DIC$ vuông cân.

<details><summary>Lời giải</summary>

Vì $AIKD$ là hình vuông nên $\widehat{IKD}=90^\circ$, tức là $IK\perp DC$.

Tam giác $DIC$ có $IK\perp DC$ và $K$ là trung điểm của $DC$ nên $IK$ vừa là đường cao vừa là đường trung tuyến.

Suy ra $\triangle DIC$ cân tại $I$ và $IK$ là đường phân giác của $\widehat{DIC}$, do đó $\widehat{DIC}=2\widehat{DIK}$.

Hình vuông $AIKD$ có $ID$ là đường chéo nên $ID$ là đường phân giác của $\widehat{AIK}=90^\circ$, suy ra $\widehat{DIK}=45^\circ$.

Do đó $\widehat{DIC}=2 \cdot 45^\circ=90^\circ$.

Tam giác $DIC$ có $ID=IC$ và $\widehat{DIC}=90^\circ$ nên $\triangle DIC$ vuông cân tại $I$.

</details>

### ý c · HLY00422

**Hỏi:** Gọi $S$ và $R$ lần lượt là tâm các hình vuông $AIKD,\ BIKC$. Chứng minh $ISKR$ là hình vuông.

<details><summary>Lời giải</summary>

$S$ là tâm của hình vuông $AIKD$ nên $S$ là giao điểm của hai đường chéo $AK$ và $ID$.

Hai đường chéo của hình vuông vuông góc với nhau và cắt nhau tại trung điểm của mỗi đường nên $\widehat{ISK}=90^\circ$ và $IS=\dfrac{1}{2}ID$.

Tương tự, $R$ là tâm của hình vuông $BIKC$ nên $\widehat{IRK}=90^\circ$ và $IR=\dfrac{1}{2}IC$.

Vì $S\in ID$ và $R\in IC$ nên $\widehat{SIR}=\widehat{DIC}=90^\circ$ (câu b).

Tứ giác $ISKR$ có $\widehat{ISK}=\widehat{SIR}=\widehat{IRK}=90^\circ$ nên $\widehat{SKR}=360^\circ-3 \cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ISKR$ có bốn góc vuông nên là hình chữ nhật.

Mà $ID=IC$ (câu b) nên $IS=\dfrac{1}{2}ID=\dfrac{1}{2}IC=IR$.

Hình chữ nhật $ISKR$ có hai cạnh kề $IS=IR$ nên $ISKR$ là hình vuông (dấu hiệu nhận biết).

</details>

---

## HLB00170 · gốc HHC002646 · Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội

**Tham chiếu:** hình lời giải cũ: HLB00170_cu_lg1.png

**GIẢ THIẾT CHUNG** → `HLB00170.png`:

(bài một ý — đề nằm trong ý)

### ý · · HLY00423

**Hỏi:** Cho tam giác $ABC$ vuông tại $A$ có $BC=2AB$. Tính góc $\widehat{ACB}$.

<details><summary>Lời giải</summary>

Gọi $M$ là trung điểm của $BC$.

Tam giác $ABC$ vuông tại $A$ có $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ nên $AM=\dfrac{1}{2}BC=BM$.

Mà $BC=2AB$ nên $AB=\dfrac{1}{2}BC$.

Do đó $AB=AM=BM$, suy ra $\triangle ABM$ là tam giác đều.

Vì $M\in BC$ nên $\widehat{ABC}=\widehat{ABM}=60^\circ$.

Tam giác $ABC$ vuông tại $A$ nên $\widehat{ACB}=90^\circ-\widehat{ABC}=90^\circ-60^\circ=30^\circ$.

Vậy $\widehat{ACB}=30^\circ$.

</details>

