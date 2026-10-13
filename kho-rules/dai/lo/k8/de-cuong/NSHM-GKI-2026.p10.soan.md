# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | IV. Hình học | tu_luan

### Bài 19 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ $(AB<AC)$. Gọi $M,\ N,\ Q$ lần lượt là trung điểm của $AB,\ BC,\ AC$. Kẻ $AI$ vuông góc với $BC$ tại $I$.
a) Chứng minh tứ giác $AMNQ$ là hình chữ nhật.
b) Qua $A$ kẻ đường thẳng song song với $BC$ và cắt $NQ$ tại điểm $K$. Chứng minh rằng $AK\parallel MQ$.
c) Chứng minh tứ giác $INQM$ là hình thang cân.
d) Chứng minh $MI$ vuông góc với $QI$.
**Hình giải:** giai_bai19.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hình chữ nhật $AMNQ$ ở ý a cho các cặp cạnh đối bằng nhau ($MN=AQ$) và hai đường chéo $AN$, $MQ$ bằng nhau, cắt nhau tại trung điểm $O$; còn $MQ$ là đường trung bình của tam giác $ABC$ nên song song $BC$ — hai điều này giải quyết ý b, c, d, và $O$ lại là trung điểm cạnh huyền của tam giác vuông $AIN$ ở ý d.

**Bước 1.** Ý a: muốn $AMNQ$ là hình chữ nhật, cần nó có bốn góc vuông; góc $A$ đã vuông nên chỉ cần thêm hai góc vuông ở $M$ và $Q$ (góc thứ tư suy ra từ tổng bốn góc của tứ giác). Muốn $MN\perp AB$, cần $N$ cách đều $A$ và $B$ để tam giác $NAB$ cân có $M$ là trung điểm cạnh đáy; điều này có từ tính chất trung tuyến ứng với cạnh huyền của tam giác vuông $ABC$.

**Bước 2.** Ý b: muốn $AK\parallel MQ$, ta thấy $AK$ được dựng song song với $BC$, nên chỉ cần $MQ$ cũng song song với $BC$. Điều này có ngay vì $M$, $Q$ là trung điểm hai cạnh $AB$, $AC$ của tam giác $ABC$, tức $MQ$ là đường trung bình ứng với cạnh $BC$.

**Bước 3.** Ý c: muốn $INQM$ là hình thang cân, trước hết cần nó là hình thang: $IN$ nằm trên $BC$ mà $MQ\parallel BC$ (ý b) nên $IN\parallel MQ$. Sau đó cần hai đường chéo $IQ$, $NM$ bằng nhau: $NM$ bằng $AQ$ vì là hai cạnh đối của hình chữ nhật $AMNQ$, còn $IQ$ bằng $AQ$ vì $IQ$ là trung tuyến ứng với cạnh huyền $AC$ của tam giác vuông $AIC$.

**Bước 4.** Ý d: muốn $MI\perp QI$, cần trung tuyến $IO$ của tam giác $MIQ$ bằng nửa cạnh $MQ$, trong đó $O$ là trung điểm $MQ$ và cũng là trung điểm đường chéo $AN$. Điều đó có được vì $IO$ là trung tuyến ứng với cạnh huyền $AN$ của tam giác vuông $AIN$ và $AN=MQ$.

**Chú ý:** nhờ $AB<AC$ mà $I$ không trùng $N$, nên $AIN$ là một tam giác thật; nếu $AB=AC$ thì $I$ trùng $N$ và ý d phải xét riêng.

**Phần 2. Trình bày**

a) Vì $\triangle ABC$ vuông tại $A$ có $AN$ là trung tuyến ứng với cạnh huyền $BC$ nên $NA=NB=NC=\dfrac{1}{2}BC$.

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

b) Xét $\triangle ABC$ có $M$ là trung điểm của $AB$ và $Q$ là trung điểm của $AC$ nên $MQ$ là đường trung bình của $\triangle ABC$.

Suy ra $MQ\parallel BC$.

Mà $AK\parallel BC$ (giả thiết) nên $AK\parallel MQ$.

c) Vì $MQ\parallel BC$ (câu b) mà $I$, $N$ thuộc $BC$ ($I$ không trùng $N$ vì $AB<AC$) nên $MQ\parallel IN$, do đó $INQM$ là hình thang.

Vì $AMNQ$ là hình chữ nhật nên $MN=AQ$ (1).

Vì $AI\perp BC$ nên $\triangle AIC$ vuông tại $I$, có $IQ$ là trung tuyến ứng với cạnh huyền $AC$ nên $IQ=\dfrac{1}{2}AC=AQ$ (2).

Từ (1) và (2) suy ra $IQ=MN$.

Hình thang $INQM$ có hai đường chéo $IQ$ và $NM$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

d) Gọi $O$ là giao điểm của $AN$ và $MQ$.

Vì $AMNQ$ là hình chữ nhật nên $AN=MQ$ và $O$ là trung điểm của mỗi đường chéo, do đó $OM=OQ=\dfrac{1}{2}MQ$.

Vì $AI\perp BC$ và $N$ thuộc $BC$ nên $\triangle AIN$ vuông tại $I$ ($I$ không trùng $N$ vì $AB<AC$).

Tam giác vuông $AIN$ có $IO$ là trung tuyến ứng với cạnh huyền $AN$ nên $IO=\dfrac{1}{2}AN=\dfrac{1}{2}MQ$.

Tam giác $MIQ$ có trung tuyến $IO$ ứng với cạnh $MQ$ và $IO=\dfrac{1}{2}MQ$ nên $\triangle MIQ$ vuông tại $I$.

Vậy $MI\perp QI$.

### Bài 20 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Kẻ $HI$ vuông góc với $AB$ tại $I$. Kẻ $HK$ vuông góc với $AC$ tại $K$.
a) Chứng minh $AH=IK$.
b) Gọi $M$ là trung điểm của $BC$. Chứng minh $BC\ge 2IK$.
c) Chứng minh $AM$ vuông góc với $IK$.
**Hình giải:** giai_bai20.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tứ giác $AIHK$ có ba góc vuông nên là hình chữ nhật, hai đường chéo $AH$ và $IK$ của nó bằng nhau và cắt nhau tại trung điểm $O$ — mọi ý của bài đều xuất phát từ đây.

**Bước 1.** Ý a: muốn $AH=IK$, ta thấy $AH$ và $IK$ là hai đường chéo của tứ giác $AIHK$, nên cần $AIHK$ là hình chữ nhật. Muốn vậy cần bốn góc vuông: ba góc ở $A$, $I$, $K$ đã cho sẵn, góc thứ tư suy ra từ tổng bốn góc của tứ giác.

**Bước 2.** Ý b: muốn $BC\ge 2IK$, ta đưa hai vế về hai đoạn cùng xuất phát từ $A$: $IK$ bằng $AH$ nhờ ý a, còn $BC$ gấp đôi trung tuyến $AM$ ứng với cạnh huyền. Khi đó chỉ cần $AH\le AM$, đúng là quan hệ giữa đường vuông góc $AH$ và đường xiên $AM$ kẻ từ $A$ đến $BC$.

**Bước 3.** Ý c: muốn $AM\perp IK$, gọi $E$ là giao điểm của $AM$ và $IK$; cần tam giác $AEK$ có hai góc $\widehat{EAK}$ và $\widehat{AKE}$ cộng lại bằng $90^\circ$, khi đó góc còn lại $\widehat{AEK}$ vuông theo tổng ba góc của tam giác.

**Bước 4.** Ý c: tìm hai góc đó. Góc $\widehat{EAK}$ chính là $\widehat{MAC}$, bằng $\widehat{C}$ vì tam giác $MAC$ cân tại $M$. Góc $\widehat{AKI}$ bằng $\widehat{HAC}$ vì tam giác $OAK$ cân tại $O$, với $O$ là giao điểm hai đường chéo của hình chữ nhật $AIHK$.

**Bước 5.** Ý c: ghép hai kết quả với tam giác vuông $AHC$, trong đó hai góc nhọn $\widehat{HAC}$ và $\widehat{C}$ phụ nhau; nhờ đó tổng hai góc cần tìm ở bước 3 bằng $90^\circ$.

**Chú ý:** dấu bằng ở ý b xảy ra khi $H$ trùng $M$, tức là khi tam giác $ABC$ vuông cân tại $A$.

**Phần 2. Trình bày**

a) Tứ giác $AIHK$ có $\widehat{IAK}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AIH}=90^\circ$ (vì $HI\perp AB$), $\widehat{AKH}=90^\circ$ (vì $HK\perp AC$).

Suy ra $\widehat{IHK}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AIHK$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AH$ và $IK$ bằng nhau, tức là $AH=IK$.

b) Vì $\triangle ABC$ vuông tại $A$ có $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $AM=\dfrac{1}{2}BC$, hay $BC=2AM$.

Vì $AH\perp BC$ và $M$ thuộc $BC$ nên $AH$ là đường vuông góc, $AM$ là đường xiên kẻ từ $A$ đến $BC$, do đó $AH\le AM$.

Mà $AH=IK$ (câu a) nên $IK\le AM$.

Suy ra $2IK\le 2AM=BC$.

Vậy $BC\ge 2IK$.

c) Gọi $O$ là giao điểm của $AH$ và $IK$, $E$ là giao điểm của $AM$ và $IK$.

Vì $AIHK$ là hình chữ nhật nên $O$ là trung điểm của mỗi đường chéo và $AH=IK$, suy ra $OA=OK$.

Do đó $\triangle OAK$ cân tại $O$, suy ra $\widehat{OAK}=\widehat{OKA}$, tức là $\widehat{HAC}=\widehat{AKI}$ (1).

Vì $MA=MC$ (cùng bằng $\dfrac{1}{2}BC$) nên $\triangle MAC$ cân tại $M$, suy ra $\widehat{MAC}=\widehat{C}$ (2).

Vì $\triangle AHC$ vuông tại $H$ nên $\widehat{HAC}+\widehat{C}=90^\circ$ (3).

Từ (1), (2), (3) suy ra $\widehat{AKI}+\widehat{MAC}=90^\circ$, hay $\widehat{AKE}+\widehat{KAE}=90^\circ$.

Xét $\triangle AEK$ có $\widehat{AEK}=180^\circ-(\widehat{AKE}+\widehat{KAE})=180^\circ-90^\circ=90^\circ$.

Vậy $AM\perp IK$.

### Bài 21 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$. Điểm $I,\ K$ thuộc cạnh $CD$ sao cho $DI=CK$ ($I$ khác $D$). Qua $I$ kẻ đường thẳng vuông góc với $AI$, cắt đường thẳng $BC$ tại $N$. Gọi $O$ là trung điểm của $AN$.
a) Chứng minh $OC=OD$.
b) Chứng minh tam giác $AKN$ vuông tại $K$.
c) Kẻ $NM$ vuông góc với $AD$ tại $M$. Chứng minh tam giác $BKM$ vuông tại $K$.
**Hình giải:** giai_bai21.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tam giác vuông nào có cạnh huyền $AN$ thì đỉnh góc vuông cách trung điểm $O$ của $AN$ đúng $\dfrac{1}{2}AN$; chiều ngược lại (tam giác có trung tuyến bằng nửa cạnh tương ứng thì vuông) chứng minh được tam giác vuông ở ý b, và ở ý c sau khi thấy $O$ cũng là trung điểm của $BM$.

**Bước 1.** Ý a: $O$, $C$, $D$ chưa nằm trong tam giác vuông nào sẵn có, nên nối $DO$ cắt đường thẳng $BC$ tại $F$. Muốn $OC=OD$, cần $O$ là trung điểm của $DF$, khi đó $CO$ là trung tuyến ứng với cạnh huyền $DF$ của tam giác vuông $DCF$ (vuông tại $C$ vì $DC\perp BC$).

**Bước 2.** Ý a: muốn $O$ là trung điểm của $DF$, cần hai tam giác $OAD$ và $ONF$ bằng nhau. Có $OA=ON$ theo đề, hai góc ở $O$ đối đỉnh, và hai góc ở $A$, $N$ so le trong vì $AD\parallel BC$, đủ để dùng trường hợp góc – cạnh – góc.

**Bước 3.** Ý b: muốn tam giác $AKN$ vuông tại $K$, cần $KO=\dfrac{1}{2}AN$ với $O$ là trung điểm $AN$. Từ tam giác vuông $AIN$ ta đã biết $IO=\dfrac{1}{2}AN$, nên chỉ cần chứng minh $OK=OI$.

**Bước 4.** Ý b: muốn $OK=OI$, cần hai tam giác $ODI$ và $OCK$ bằng nhau. Có $OD=OC$ nhờ ý a, $DI=CK$ theo đề, và hai góc ở $D$, $C$ bằng nhau vì tam giác $ODC$ cân tại $O$.

**Bước 5.** Ý c: tứ giác $ABNM$ có ba góc vuông nên là hình chữ nhật, hai đường chéo $AN$ và $BM$ bằng nhau và cắt nhau tại trung điểm $O$ của $AN$. Khi đó $KO$, vốn bằng $\dfrac{1}{2}AN$ ở ý b, cũng bằng nửa $BM$, nên tam giác $BKM$ vuông tại $K$ theo chiều ngược lại của tính chất trung tuyến.

**Phần 2. Trình bày**

a) Gọi $F$ là giao điểm của $DO$ và đường thẳng $BC$.

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

b) Vì $AI\perp IN$ nên $\triangle AIN$ vuông tại $I$, có $IO$ là trung tuyến ứng với cạnh huyền $AN$ nên $IO=\dfrac{1}{2}AN$ (1).

Vì $OC=OD$ (câu a) nên $\triangle ODC$ cân tại $O$, suy ra $\widehat{ODC}=\widehat{OCD}$.

Mà $I$, $K$ thuộc $CD$ nên $\widehat{ODI}=\widehat{OCK}$.

Xét $\triangle ODI$ và $\triangle OCK$ có:

$OD=OC$ (câu a)

$\widehat{ODI}=\widehat{OCK}$ (chứng minh trên)

$DI=CK$ (giả thiết)

Do đó $\triangle ODI=\triangle OCK$ (c.g.c), suy ra $OI=OK$ (2).

Từ (1) và (2) suy ra $OK=\dfrac{1}{2}AN$.

Tam giác $AKN$ có trung tuyến $KO$ ứng với cạnh $AN$ và $KO=\dfrac{1}{2}AN$ nên $\triangle AKN$ vuông tại $K$.

c) Tứ giác $ABNM$ có $\widehat{BAM}=90^\circ$ (vì $ABCD$ là hình chữ nhật), $\widehat{AMN}=90^\circ$ (vì $NM\perp AD$), $\widehat{ABN}=90^\circ$ (vì $N$ thuộc $BC$ và $AB\perp BC$).

Suy ra $\widehat{BNM}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ABNM$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AN$ và $BM$ bằng nhau và cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là trung điểm của $AN$ nên $O$ là trung điểm của $BM$ và $BM=AN$.

Theo câu b, $KO=\dfrac{1}{2}AN$ nên $KO=\dfrac{1}{2}BM$.

Tam giác $BKM$ có trung tuyến $KO$ ứng với cạnh $BM$ và $KO=\dfrac{1}{2}BM$ nên $\triangle BKM$ vuông tại $K$.

### Bài 22 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, $M$ là trung điểm của $BC$. Điểm $D$ thuộc đoạn thẳng $AM$. Kẻ $DE,\ DF$ vuông góc với $AB,\ AC$ tại $E,\ F$.
a) Chứng minh tứ giác $AEDF$ là hình chữ nhật.
b) Chứng minh $EF\parallel BC$.
c) Tìm vị trí điểm $D$ trên $AM$ để $BC=4EF$.
**Hình giải:** giai_bai22.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai đoạn $EF$ và $AD$ là hai đường chéo của hình chữ nhật $AEDF$ nên bằng nhau, và $AM$ bằng nửa $BC$ vì là trung tuyến ứng với cạnh huyền; từ hai điều này suy ra cả ý b lẫn ý c.

**Bước 1.** Ý a: muốn $AEDF$ là hình chữ nhật, cần nó có bốn góc vuông. Ba góc ở $A$, $E$, $F$ đã vuông theo giả thiết, còn góc ở $D$ suy ra từ tổng bốn góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $EF\parallel BC$, ta tạo hai góc đồng vị bằng nhau khi cắt bởi đường thẳng $AC$, tức là cần $\widehat{AFE}=\widehat{C}$.

**Bước 3.** Ý b: để có $\widehat{AFE}=\widehat{C}$, ta bắc cầu qua $\widehat{DAF}$. Một mặt $\widehat{AFE}=\widehat{DAF}$ vì tam giác $OAF$ cân tại $O$, với $O$ là giao điểm hai đường chéo hình chữ nhật. Mặt khác $\widehat{DAF}=\widehat{MAC}=\widehat{C}$ vì tam giác $MAC$ cân tại $M$.

**Bước 4.** Ý c: muốn biết $D$ ở đâu để $BC=4EF$, đổi cả hai vế về đoạn nằm trên $AM$: $EF=AD$ nhờ hai đường chéo của hình chữ nhật, và $BC=2AM$ nhờ trung tuyến ứng với cạnh huyền.

**Bước 5.** Ý c: thay hai kết quả trên vào đẳng thức đề cho để có quan hệ giữa $AD$ và $AM$; vì $D$ thuộc đoạn $AM$ nên quan hệ đó cho biết đúng vị trí của $D$.

**Phần 2. Trình bày**

a) Tứ giác $AEDF$ có $\widehat{EAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AED}=90^\circ$ (vì $DE\perp AB$), $\widehat{AFD}=90^\circ$ (vì $DF\perp AC$).

Suy ra $\widehat{EDF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AEDF$ có bốn góc vuông nên là hình chữ nhật.

b) Gọi $O$ là giao điểm của $AD$ và $EF$.

Vì $AEDF$ là hình chữ nhật nên $AD=EF$ và $O$ là trung điểm của mỗi đường chéo, suy ra $OA=OF$.

Do đó $\triangle OAF$ cân tại $O$, suy ra $\widehat{OAF}=\widehat{OFA}$, tức là $\widehat{DAF}=\widehat{AFE}$ (1).

Vì $\triangle ABC$ vuông tại $A$ có $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $MA=MC=\dfrac{1}{2}BC$.

Do đó $\triangle MAC$ cân tại $M$, suy ra $\widehat{MAC}=\widehat{C}$.

Mà $D$ thuộc $AM$ và $F$ thuộc $AC$ nên $\widehat{DAF}=\widehat{MAC}$, suy ra $\widehat{DAF}=\widehat{C}$ (2).

Từ (1) và (2) suy ra $\widehat{AFE}=\widehat{C}$.

Hai góc $\widehat{AFE}$ và $\widehat{ACB}$ ở vị trí đồng vị nên $EF\parallel BC$.

c) Vì $AEDF$ là hình chữ nhật nên $EF=AD$.

Vì $AM$ là trung tuyến ứng với cạnh huyền $BC$ nên $BC=2AM$.

Khi đó $BC=4EF$ trở thành $2AM=4AD$, suy ra $AD=\dfrac{1}{2}AM$.

Mà $D$ thuộc đoạn thẳng $AM$ nên $D$ là trung điểm của $AM$.

Vậy khi $D$ là trung điểm của $AM$ thì $BC=4EF$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 19 (ý b, c): dùng thẳng đường trung bình của tam giác ($M$, $Q$ trung điểm $AB$, $AC$ nên $MQ\parallel BC$) theo quyết định của CEO 13/10 cho đề cương này.
- Bài 21 ý a: $OC=OD$ là kết quả quen thuộc của "đường trung bình hình thang" (KNTT 8 không có); lời giải tự chứng minh bằng hai tam giác bằng nhau (điểm $F$) rồi trung tuyến ứng với cạnh huyền.
- Bài 21 ý c: nếu $N$ trùng $B$ thì $M$ trùng $A$ và tam giác $BKM$ suy biến thành $BKA$ — lời giải không xét riêng trường hợp này (đúng vẫn đúng theo ý b).
- Bài 22: coi $D$ khác $A$ (nếu $D$ trùng $A$ thì $E$, $F$ cũng trùng $A$, không còn hình chữ nhật). Ý c đáp: $D$ là trung điểm $AM$.
- Cả bốn bài đều dùng "trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" và chiều đảo (có trong bài Hình chữ nhật); không dùng Pythagore, đồng dạng, Thalès, đường trung bình hình thang. Chỉ Bài 19 (ý b, c) dùng đường trung bình của tam giác.
- Hình giải (`giai_bai19` đến `giai_bai22`) vẽ bằng code, dựng đúng dữ kiện bằng toạ độ; điểm phụ $O$ (Bài 19, 20, 21, 22), $E$ (Bài 20), $F$ (Bài 21) có mặt trong hình vì lời giải dùng đến. Đã kiểm toạ độ số (200–400 hình ngẫu nhiên mỗi bài) mọi khẳng định song song, vuông góc, bằng nhau, thẳng hàng và điều kiện $BC=4EF$ khi và chỉ khi $D$ là trung điểm $AM$.
