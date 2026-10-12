# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | IV. Hình học | tu_luan

### Bài 16 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$. Kẻ $BH$ vuông góc với $AC$ ($H$ thuộc $AC$). Gọi $M,\ N,\ P$ lần lượt là trung điểm của $AB,\ AH,\ CD$.
a) Chứng minh tứ giác $MBCP$ là hình chữ nhật.
b) Chứng minh $MN$ vuông góc với $AC$.
c) Kẻ $NK\parallel AB$ ($K$ thuộc $BH$). Chứng minh $NP=CK$.
d) Chứng minh $NP$ vuông góc với $NB$.
**Hình giải:** giai_bai16.png
**Chưa chắc:** ý b, c: dữ kiện đúng là bài đường trung bình ($M$, $N$ là trung điểm $AB$, $AH$ nên $MN\parallel BH$; $NK\parallel AB$ nên $K$ là trung điểm $BH$) — lời giải không dùng đường trung bình: ý b đi qua trung tuyến ứng với cạnh huyền và tam giác cân, ý c đi qua hình bình hành $MNKB$; CEO quyết có cho dùng đường trung bình ở đề cương này không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ý c và ý d liên kết với nhau: $NKCP$ là hình bình hành nên $NP\parallel CK$, còn $K$ là trực tâm của $\triangle NBC$ nên $CK\perp NB$.

**Bước 1.** Ý a: muốn $MBCP$ là hình chữ nhật, cần nó là hình bình hành và có một góc vuông; hình bình hành có được từ $MB\parallel PC$ và $MB=PC$ (hai nửa của hai cạnh đối $AB$, $CD$), góc vuông chính là góc $B$ của hình chữ nhật $ABCD$.

**Bước 2.** Ý b: muốn $MN\perp AC$, thấy $N$ là trung điểm của $AH$ nên cần $\triangle MAH$ cân tại $M$ (khi đó trung tuyến $MN$ cũng là đường cao); $MA=MH$ vì $HM$ là trung tuyến ứng với cạnh huyền $AB$ của tam giác vuông $ABH$.

**Bước 3.** Ý c: muốn $NP=CK$, cần $NKCP$ là hình bình hành, tức là $NK\parallel PC$ và $NK=PC$; phần song song có từ $NK\parallel AB\parallel CD$.

**Bước 4.** Ý c (tiếp): muốn $NK=PC$, đổi sang $NK=MB$ vì $PC=MB$ ở ý a; điều này cần $MNKB$ là hình bình hành, mà $MN\parallel BK$ có được vì cùng vuông góc với $AC$ (nhờ ý b) và $NK\parallel MB$ theo đề.

**Bước 5.** Ý d: muốn $NP\perp NB$, ta có $NP\parallel CK$ (ý c) nên chỉ cần $CK\perp NB$; hai đường cao $BH$ và $NK$ của $\triangle NBC$ cắt nhau tại $K$ nên $K$ là trực tâm và $CK$ là đường cao thứ ba.

**Chú ý:** bài này chưa được dùng đường trung bình (học sau) nên ý b, ý c phải đi vòng qua tam giác cân và hình bình hành.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình chữ nhật nên $AB\parallel CD$, $AB=CD$ và $\widehat{ABC}=90^\circ$.

Vì $M$ là trung điểm của $AB$ nên $MB=\dfrac{1}{2}AB$.

Vì $P$ là trung điểm của $CD$ nên $PC=\dfrac{1}{2}CD$.

Mà $AB=CD$ nên $MB=PC$.

Lại có $M\in AB$, $P\in CD$ và $AB\parallel CD$ nên $MB\parallel PC$.

Tứ giác $MBCP$ có $MB\parallel PC$ và $MB=PC$ nên $MBCP$ là hình bình hành (dấu hiệu nhận biết).

Vì $M$ nằm trên cạnh $AB$ nên $\widehat{MBC}=\widehat{ABC}=90^\circ$.

Hình bình hành $MBCP$ có một góc vuông nên $MBCP$ là hình chữ nhật (dấu hiệu nhận biết).

b) Vì $BH\perp AC$ nên $\triangle ABH$ vuông tại $H$.

Trong $\triangle ABH$, $HM$ là đường trung tuyến ứng với cạnh huyền $AB$ nên $HM=\dfrac{1}{2}AB=MA$.

Xét $\triangle MNA$ và $\triangle MNH$ có:

$MA=MH$ (chứng minh trên)

$NA=NH$ ($N$ là trung điểm của $AH$)

$MN$ là cạnh chung

Do đó $\triangle MNA=\triangle MNH$ (c.c.c).

Suy ra $\widehat{MNA}=\widehat{MNH}$ (hai góc tương ứng).

Mà $\widehat{MNA}+\widehat{MNH}=180^\circ$ (hai góc kề bù) nên $\widehat{MNA}=\widehat{MNH}=90^\circ$.

Vậy $MN\perp AH$, mà $AH$ nằm trên $AC$ nên $MN\perp AC$.

c) Vì $MN\perp AC$ và $BH\perp AC$ nên $MN\parallel BH$ (cùng vuông góc với một đường thẳng). Mà $K\in BH$ nên $MN\parallel BK$.

Vì $NK\parallel AB$ và $M\in AB$ nên $NK\parallel MB$.

Tứ giác $MNKB$ có $MN\parallel BK$ và $NK\parallel MB$ nên $MNKB$ là hình bình hành (định nghĩa).

Suy ra $NK=MB$ (hai cạnh đối của hình bình hành).

Mà $MB=PC$ (câu a) nên $NK=PC$.

Vì $NK\parallel AB$ và $AB\parallel CD$ nên $NK\parallel CD$, suy ra $NK\parallel PC$.

Tứ giác $NKCP$ có $NK\parallel PC$ và $NK=PC$ nên $NKCP$ là hình bình hành (dấu hiệu nhận biết).

Suy ra $NP=CK$ (hai cạnh đối của hình bình hành).

d) Xét $\triangle NBC$ có:

$BH\perp NC$ (vì $N$, $H$, $C$ cùng nằm trên $AC$ và $BH\perp AC$) nên $BH$ là đường cao.

$NK\perp BC$ (vì $NK\parallel AB$ và $AB\perp BC$) nên $NK$ là đường cao.

Hai đường cao $BH$ và $NK$ cắt nhau tại $K$ nên $K$ là trực tâm của $\triangle NBC$.

Do đó $CK$ là đường cao thứ ba của tam giác (ba đường cao đồng quy), suy ra $CK\perp NB$.

Vì $NKCP$ là hình bình hành (câu c) nên $NP\parallel CK$.

Mà $CK\perp NB$ nên $NP\perp NB$.

### Bài 17 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$. Kẻ $AN$ và $CM$ cùng vuông góc với $BD$ ($N,\ M$ thuộc $BD$).
a) Chứng minh $DN=BM$.
b) Chứng minh tứ giác $ANCM$ là hình bình hành.
c) Trên tia đối của tia $NA$ lấy điểm $K$ sao cho $NK=NA$. Tứ giác $DKCB$ là hình gì? Vì sao?
d) Tia $AM$ cắt tia $KC$ tại điểm $P$. Chứng minh rằng $PN,\ AC,\ KM$ đồng quy.
**Hình giải:** giai_bai17.png
**Chưa chắc:** đề không cho $AB>AD$ và không loại trừ hình vuông. Nếu $ABCD$ là hình vuông thì $N\equiv M$ nên ý b, c, d không còn nghĩa; lời giải và hình vẽ lấy $AB>AD$ (khi đó $DKCB$ là tứ giác lồi, đáy $KC$ và $DB$). Nếu $AB<AD$ thì bốn điểm $D,\ K,\ C,\ B$ vẫn tạo thành một hình thang cân nhưng đúng thứ tự đỉnh phải là $DCKB$ (đáy $CK$ và $DB$), tứ giác $DKCB$ khi đó tự cắt — CEO xem đề gốc có kèm hình $AB>AD$ không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tam giác vuông $AND$ và $CMB$ bằng nhau cho $DN=BM$ và $AN=CM$; vì $AN\parallel CM$ nên liên tiếp sinh ra các hình bình hành $ANCM$, $NKCM$, $NMPC$.

**Bước 1.** Ý a: muốn $DN=BM$, cần hai tam giác vuông $AND$ và $CMB$ bằng nhau; hai tam giác này có cạnh huyền $AD=CB$ (cạnh đối của hình chữ nhật) và góc nhọn $\widehat{ADN}=\widehat{CBM}$ (so le trong vì $AD\parallel BC$).

**Bước 2.** Ý b: muốn $ANCM$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn $AN$ và $CM$: song song vì cùng vuông góc với $BD$, bằng nhau vì là hai cạnh tương ứng của hai tam giác bằng nhau ở ý a.

**Bước 3.** Ý c: dự đoán $DKCB$ là hình thang cân; muốn là hình thang cần $KC\parallel DB$, tức $NKCM$ là hình bình hành (có $NK\parallel CM$ và $NK=NA=CM$); muốn là hình thang cân cần hai đường chéo $DC$ và $KB$ bằng nhau, vì cùng bằng $AB$.

**Bước 4.** Ý d: muốn $PN$, $AC$, $KM$ đồng quy, nhận ra chúng là ba đường trung tuyến của $\triangle AKP$; $N$ đã là trung điểm của $AK$ nên cần $C$ là trung điểm của $KP$ và $M$ là trung điểm của $AP$.

**Bước 5.** Ý d (tiếp): muốn có hai trung điểm đó, dựng hình bình hành $NMPC$ (có $MP\parallel NC$ vì $AM\parallel NC$, và $CP\parallel NM$ vì $KC\parallel NM$), rồi so các cạnh bằng nhau với hai hình bình hành $ANCM$ và $NKCM$.

**Chú ý:** $ANCM$ chỉ là tứ giác khi $N$ khác $M$, tức là $ABCD$ không phải hình vuông.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình chữ nhật nên $AD=BC$ và $AD\parallel BC$.

Xét $\triangle AND$ và $\triangle CMB$ có:

$\widehat{AND}=\widehat{CMB}=90^\circ$ (vì $AN\perp BD$, $CM\perp BD$)

$AD=CB$ (chứng minh trên)

$\widehat{ADN}=\widehat{CBM}$ (so le trong, vì $AD\parallel BC$)

Do đó $\triangle AND=\triangle CMB$ (cạnh huyền – góc nhọn).

Suy ra $DN=BM$ (hai cạnh tương ứng).

b) Vì $\triangle AND=\triangle CMB$ (câu a) nên $AN=CM$.

Vì $AN\perp BD$ và $CM\perp BD$ nên $AN\parallel CM$.

Tứ giác $ANCM$ có $AN\parallel CM$ và $AN=CM$ nên $ANCM$ là hình bình hành (dấu hiệu nhận biết).

c) Tứ giác $DKCB$ là hình thang cân.

Thật vậy, $K$ nằm trên tia đối của tia $NA$ nên $A$, $N$, $K$ thẳng hàng. Mà $AN\parallel CM$ nên $NK\parallel CM$.

Lại có $NK=NA$ (giả thiết) và $NA=CM$ (câu b) nên $NK=CM$.

Tứ giác $NKCM$ có $NK\parallel CM$ và $NK=CM$ nên $NKCM$ là hình bình hành (dấu hiệu nhận biết).

Suy ra $KC\parallel NM$. Mà $N$, $M$ thuộc $BD$ nên $KC\parallel DB$.

Do đó tứ giác $DKCB$ là hình thang (đáy $KC$ và $DB$).

Xét $\triangle ABN$ và $\triangle KBN$ có:

$NA=NK$ (giả thiết)

$\widehat{ANB}=\widehat{KNB}=90^\circ$ (vì $AK\perp BD$)

$BN$ là cạnh chung

Do đó $\triangle ABN=\triangle KBN$ (c.g.c), suy ra $BA=BK$.

Mà $BA=DC$ (hai cạnh đối của hình chữ nhật $ABCD$) nên $BK=DC$.

Hình thang $DKCB$ có hai đường chéo $DC$ và $KB$ bằng nhau nên $DKCB$ là hình thang cân (dấu hiệu nhận biết).

d) Vì $ANCM$ là hình bình hành (câu b) nên $AM\parallel NC$ và $AM=NC$.

Vì $NKCM$ là hình bình hành (câu c) nên $KC\parallel NM$ và $KC=NM$.

Vì $P$ thuộc tia $AM$ nên $MP\parallel NC$. Vì $P$ thuộc tia $KC$ nên $CP\parallel NM$.

Tứ giác $NMPC$ có $MP\parallel NC$ và $CP\parallel NM$ nên $NMPC$ là hình bình hành (định nghĩa).

Suy ra $MP=NC$ và $CP=NM$ (các cạnh đối).

Mà $MA=NC$ nên $MP=MA$. Vì $P$ thuộc tia $AM$ nên $M$ là trung điểm của $AP$.

Mà $KC=NM$ nên $CP=KC$. Vì $P$ thuộc tia $KC$ nên $C$ là trung điểm của $KP$.

Lại có $N$ là trung điểm của $AK$ (vì $N$ nằm giữa $A$, $K$ và $NK=NA$).

Trong $\triangle AKP$, các đoạn $PN$, $AC$, $KM$ nối mỗi đỉnh với trung điểm cạnh đối diện nên là ba đường trung tuyến.

Vậy $PN$, $AC$, $KM$ đồng quy tại trọng tâm của $\triangle AKP$.

### Bài 18 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ $(AB>AC)$. Gọi $E$ là trung điểm của $BC$. $D,\ H$ lần lượt là chân đường vuông góc kẻ từ $E$ xuống $AB,\ AC$.
a) Chứng minh tứ giác $ADEH$ là hình chữ nhật.
b) Chứng minh $D$ là trung điểm $AB$.
c) Lấy điểm $F$ sao cho $D$ là trung điểm của $EF$. Kẻ $EI$ vuông góc với $AF$ tại $I$. Chứng minh $IH$ vuông góc với $ID$.
d) Chứng minh $\widehat{IAD}=\widehat{IHD}$.
**Hình giải:** giai_bai18.png
**Chưa chắc:** ý b: dữ kiện đúng là bài đường trung bình ($E$ là trung điểm $BC$ và $ED\parallel AC$ nên $D$ là trung điểm $AB$) — lời giải tự chứng minh bằng hai tam giác vuông bằng nhau, không dùng đường trung bình; CEO quyết có cho dùng đường trung bình ở đề cương này không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $O$ là tâm của hình chữ nhật $ADEH$ nên $OA=OE=OD=OH$; ý c dùng đúng điều này kèm trung tuyến ứng với cạnh huyền của tam giác $AIE$, ý d dùng $DI=DE$ để ghép hai tam giác vuông bằng nhau.

**Bước 1.** Ý a: muốn $ADEH$ là hình chữ nhật, cần tứ giác có đủ bốn góc vuông; ba góc $A$, $D$, $H$ đã vuông theo đề, góc $E$ có được từ tổng các góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $D$ là trung điểm của $AB$, cần $AD=DB$; vì $AD=HE$ (cạnh đối hình chữ nhật) nên chỉ cần $HE=DB$, tức là hai tam giác vuông $CHE$ và $EDB$ bằng nhau (cạnh huyền $EC=EB$, góc nhọn $\widehat{CEH}=\widehat{EBD}$ vì $EH\parallel AB$).

**Bước 3.** Ý c: muốn $IH\perp ID$, cần $\triangle DIH$ vuông tại $I$, tức là trung tuyến $IO$ bằng nửa cạnh $DH$ ($O$ là tâm hình chữ nhật $ADEH$); điều đó có vì $IO$ cũng là trung tuyến ứng với cạnh huyền $AE$ của tam giác vuông $AIE$ và $AE=DH$.

**Bước 4.** Ý d: muốn $\widehat{IAD}=\widehat{IHD}$, bắc cầu qua $\widehat{DAE}$ và $\widehat{EHD}$; trước hết $\widehat{IAD}=\widehat{DAE}$ vì $\triangle ADF=\triangle ADE$ và $I$ nằm trên tia $AF$ (điều kiện $AB>AC$ đảm bảo điều này).

**Bước 5.** Ý d (tiếp): $\widehat{DAE}=\widehat{EHD}$ vì $\triangle ADE=\triangle HED$, và $\widehat{EHD}=\widehat{IHD}$ vì $\triangle DEH=\triangle DIH$ (có $DI=DE$, do $DI$ là trung tuyến ứng với cạnh huyền $EF$ của tam giác $EIF$ vuông tại $I$).

**Chú ý:** bài này chưa được dùng đường trung bình (học sau) nên ý b phải tự chứng minh bằng hai tam giác bằng nhau.

**Phần 2. Trình bày**

a) Xét tứ giác $ADEH$ có:

$\widehat{DAH}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ADE}=90^\circ$ (vì $ED\perp AB$)

$\widehat{AHE}=90^\circ$ (vì $EH\perp AC$)

Suy ra $\widehat{DEH}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEH$ có bốn góc vuông nên $ADEH$ là hình chữ nhật.

b) Vì $ADEH$ là hình chữ nhật (câu a) nên $EH\parallel AD$, tức là $EH\parallel AB$, và $AD=HE$.

Xét $\triangle CHE$ và $\triangle EDB$ có:

$\widehat{CHE}=\widehat{EDB}=90^\circ$ (vì $EH\perp AC$, $ED\perp AB$)

$EC=BE$ ($E$ là trung điểm của $BC$)

$\widehat{CEH}=\widehat{EBD}$ (hai góc đồng vị, vì $EH\parallel AB$)

Do đó $\triangle CHE=\triangle EDB$ (cạnh huyền – góc nhọn).

Suy ra $HE=DB$ (hai cạnh tương ứng).

Mà $AD=HE$ nên $AD=DB$.

Lại có $D$ nằm trên $AB$ nên $D$ là trung điểm của $AB$.

c) Vì $ADEH$ là hình chữ nhật nên hai đường chéo $AE$ và $DH$ bằng nhau và cắt nhau tại trung điểm của mỗi đường.

Gọi $O$ là giao điểm của $AE$ và $DH$. Khi đó $O$ là trung điểm của $AE$ và của $DH$, và $AE=DH$.

Xét $\triangle AIE$ vuông tại $I$ (vì $EI\perp AF$) có $IO$ là đường trung tuyến ứng với cạnh huyền $AE$ nên $IO=\dfrac{1}{2}AE$.

Mà $AE=DH$ nên $IO=\dfrac{1}{2}DH$.

Xét $\triangle DIH$ có trung tuyến $IO$ ($O$ là trung điểm của $DH$) bằng nửa cạnh $DH$ nên $\triangle DIH$ vuông tại $I$.

Vậy $IH\perp ID$.

d) Vì $D$ là trung điểm của $EF$ và $ED\perp AB$ nên $E$, $D$, $F$ thẳng hàng và $\widehat{ADF}=90^\circ$.

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

## GHI CHÚ CHO NGƯỜI DUYỆT

- Cả ba bài là bài hình chứng minh, không tách ý, nhập `tu_luan`; cả ba có hình giải vẽ bằng code (`giai_bai16.png`, `giai_bai17.png`, `giai_bai18.png`), chỉ hiện ở lời giải. Hình dựng bằng toạ độ và đã đối chiếu số các khẳng định chính (song song, vuông góc, hình bình hành, đồng quy, góc bằng nhau) trên nhiều bộ số.
- Câu cần CEO xem: Bài 16 (ý b, c — dữ kiện là bài đường trung bình, lời giải đi vòng qua tam giác cân + hình bình hành), Bài 17 (thứ tự đỉnh $DKCB$ chỉ đúng khi $AB>AD$, loại hình vuông), Bài 18 (ý b — đường trung bình đảo, tự chứng minh bằng hai tam giác vuông bằng nhau).
- Kiến thức dùng: Chương III (hình bình hành, hình chữ nhật, hình thang cân, trung tuyến ứng với cạnh huyền và chiều đảo) cùng nền lớp 7 (tam giác bằng nhau, tam giác cân, ba đường cao đồng quy, ba đường trung tuyến đồng quy, quan hệ góc – cạnh đối diện). Không dùng đường trung bình, Thalès, đồng dạng, Pythagore.
- Bài 18 ý d có một đoạn chứng minh $I$ nằm trên tia $AF$ (dùng điều kiện $AB>AC$); đề cương không ghi mục đích của điều kiện này, đây là chỗ nó được dùng.
