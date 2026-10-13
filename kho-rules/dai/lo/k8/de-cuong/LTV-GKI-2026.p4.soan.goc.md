# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 2 | B. Hình học (Bài 20–30) | tu_luan

### Bài 20 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, $AB<AC$, đường cao $AH$ và trung tuyến $AE$. Gọi $D,\ F$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$; $O$ là giao điểm của $AE$ và $DF$.
a) Chứng minh $ADEF$ là hình chữ nhật.
b) Chứng minh $DF\parallel BC$.
c) Chứng minh $BDFE$ là hình bình hành.
d) Chứng minh $F$ là trung điểm của $AC$.
e) Chứng minh $DFEH$ là hình thang cân.
f) Lấy $M,\ N$ sao cho $F$ lần lượt là trung điểm của $EM$ và $BN$. Chứng minh $A,\ N,\ M$ thẳng hàng.
**Hình giải:** giai_bai20.png
**Chưa chắc:** ý b, ý d: dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không

**Phần 1. Hướng dẫn**

**Mấu chốt:** trung tuyến $AE$ ứng với cạnh huyền nên $EA=EB=EC$, còn hai đường chéo $AE$, $DF$ của hình chữ nhật $ADEF$ bằng nhau và cắt nhau tại trung điểm $O$ — mọi ý của bài đều mượn hai điều này.

**Bước 1.** Ý a: muốn $ADEF$ là hình chữ nhật, cần nó có bốn góc vuông. Ba góc ở $A$, $D$, $F$ đã vuông theo giả thiết, góc thứ tư ở $E$ suy ra từ tổng bốn góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $DF\parallel BC$, ta tạo hai góc đồng vị bằng nhau khi hai đường thẳng này bị cắt bởi $AC$, tức là cần $\widehat{AFD}=\widehat{C}$. Bắc cầu qua $\widehat{EAC}$: $\widehat{AFD}=\widehat{EAC}$ vì tam giác $OAF$ cân tại $O$, còn $\widehat{EAC}=\widehat{C}$ vì tam giác $EAC$ cân tại $E$.

**Bước 3.** Ý c: muốn $BDFE$ là hình bình hành, ta chỉ ra hai cặp cạnh đối song song. Cặp thứ nhất $DF\parallel BE$ có ngay từ ý b vì $E$ thuộc $BC$; cặp thứ hai $BD\parallel EF$ có vì $AB$ và $EF$ cùng vuông góc với $AC$.

**Bước 4.** Ý d: muốn $F$ là trung điểm của $AC$, ta dùng tam giác $EAC$ cân tại $E$ (đã có ở bước 2). Trong tam giác cân, đường cao $EF$ kẻ xuống cạnh đáy $AC$ đồng thời là đường trung tuyến.

**Bước 5.** Ý e: muốn $DFEH$ là hình thang cân, trước hết cần nó là hình thang: $DF\parallel EH$ vì $DF\parallel BC$ (ý b) và $H$, $E$ đều thuộc $BC$. Sau đó cần hai đường chéo $DE$ và $FH$ bằng nhau: $DE=AF$ vì là hai cạnh đối của hình chữ nhật $ADEF$, còn $FH=AF$ vì $FH$ là trung tuyến ứng với cạnh huyền $AC$ của tam giác vuông $AHC$ và $F$ là trung điểm $AC$ (ý d).

**Bước 6.** Ý f: muốn $A,\ N,\ M$ thẳng hàng, ta chứng minh $AM$ và $AN$ cùng song song với $BC$, rồi dùng tiên đề Euclid (qua $A$ chỉ có một đường thẳng song song với $BC$). Vì $F$ là trung điểm chung của $AC$ và $EM$ nên $AECM$ là hình bình hành; vì $F$ cũng là trung điểm chung của $AC$ và $BN$ nên $ABCN$ là hình bình hành. Hai hình bình hành này cho $AM\parallel EC$ và $AN\parallel BC$.

**Chú ý:** nhờ $AB<AC$ mà $H$ không trùng $E$, nên $DFEH$ là tứ giác thật; nếu $AB=AC$ thì $H$ trùng $E$ và ý e không còn là hình thang.

**Phần 2. Trình bày**

a) Tứ giác $ADEF$ có $\widehat{DAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{ADE}=90^\circ$ (vì $ED\perp AB$), $\widehat{AFE}=90^\circ$ (vì $EF\perp AC$).

Suy ra $\widehat{DEF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEF$ có bốn góc vuông nên là hình chữ nhật.

b) Vì $ADEF$ là hình chữ nhật nên $AE=DF$ và $O$ là trung điểm của mỗi đường chéo, suy ra $OA=OF$.

Do đó $\triangle OAF$ cân tại $O$, suy ra $\widehat{OAF}=\widehat{OFA}$, tức là $\widehat{EAC}=\widehat{AFD}$ (1).

Vì $\triangle ABC$ vuông tại $A$ có $AE$ là trung tuyến ứng với cạnh huyền $BC$ nên $EA=EB=EC=\dfrac{1}{2}BC$.

Do đó $\triangle EAC$ cân tại $E$, suy ra $\widehat{EAC}=\widehat{C}$ (2).

Từ (1) và (2) suy ra $\widehat{AFD}=\widehat{C}$.

Hai góc $\widehat{AFD}$ và $\widehat{ACB}$ ở vị trí đồng vị nên $DF\parallel BC$.

c) Vì $DF\parallel BC$ (câu b) và $E$ thuộc $BC$ nên $DF\parallel BE$.

Vì $AB\perp AC$ và $EF\perp AC$ nên $AB\parallel EF$; mà $B$, $D$ thuộc $AB$ nên $BD\parallel EF$.

Tứ giác $BDFE$ có $DF\parallel BE$ và $BD\parallel EF$ nên là hình bình hành (định nghĩa).

d) Vì $EA=EC$ (chứng minh ở câu b) nên $\triangle EAC$ cân tại $E$.

Tam giác $EAC$ cân tại $E$ có $EF\perp AC$ tại $F$ nên $EF$ là đường cao ứng với cạnh đáy $AC$, đồng thời là đường trung tuyến.

Suy ra $F$ là trung điểm của $AC$.

e) Vì $DF\parallel BC$ (câu b), $H$ và $E$ thuộc $BC$ nên $DF\parallel EH$ ($H$ không trùng $E$ vì nếu trùng thì $AE$ vừa là trung tuyến vừa là đường cao nên $AB=AC$, trái với $AB<AC$).

Do đó $DFEH$ là hình thang.

Vì $ADEF$ là hình chữ nhật nên $DE=AF$ (1).

Vì $F$ là trung điểm của $AC$ (câu d) nên $AF=\dfrac{1}{2}AC$.

Vì $AH\perp BC$ nên $\triangle AHC$ vuông tại $H$, có $HF$ là trung tuyến ứng với cạnh huyền $AC$ nên $HF=\dfrac{1}{2}AC=AF$ (2).

Từ (1) và (2) suy ra $DE=FH$.

Hình thang $DFEH$ có hai đường chéo $DE$ và $FH$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

f) Tứ giác $AECM$ có hai đường chéo $AC$ và $EM$ cắt nhau tại $F$, mà $F$ là trung điểm của $EM$ (giả thiết) và của $AC$ (câu d).

Suy ra $AECM$ là hình bình hành (dấu hiệu nhận biết), do đó $AM\parallel EC$, tức là $AM\parallel BC$.

Tứ giác $ABCN$ có hai đường chéo $AC$ và $BN$ cắt nhau tại $F$, mà $F$ là trung điểm của $BN$ (giả thiết) và của $AC$ (câu d).

Suy ra $ABCN$ là hình bình hành (dấu hiệu nhận biết), do đó $AN\parallel BC$.

Qua $A$ chỉ có một đường thẳng song song với $BC$ nên hai đường thẳng $AM$ và $AN$ trùng nhau.

Vậy $A,\ N,\ M$ thẳng hàng.

### Bài 21 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ ($AC<AB$), gọi $M$ là trung điểm của $BC$. Kẻ $ME\perp AB$ tại $E$, kẻ $MF\perp AC$ tại $F$.
a) Chứng minh tứ giác $AEMF$ là hình chữ nhật.
b) Lấy điểm $H$ trên tia $MF$ sao cho $FM=FH$. Chứng minh tứ giác $AHFE$ là hình bình hành.
c) Gọi $I$ là giao điểm của $EH$ và $AF$; $J$ là trung điểm của $ME$. Chứng minh $I$ là trung điểm của $AF,\ EH$ và $IJ\perp ME$.
**Hình giải:** giai_bai21.png
**Chưa chắc:** ý c ($IJ\perp ME$): dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không

**Phần 1. Hướng dẫn**

**Mấu chốt:** hình chữ nhật $AEMF$ cho hai cặp cạnh đối song song và bằng nhau ($AE\parallel FM$, $AE=FM$; $AF\parallel EM$, $AF=EM$), mọi ý sau đều mượn các cặp cạnh này.

**Bước 1.** Ý a: muốn $AEMF$ là hình chữ nhật, cần nó có bốn góc vuông. Ba góc ở $A$, $E$, $F$ đã vuông theo giả thiết, góc thứ tư ở $M$ suy ra từ tổng bốn góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $AHFE$ là hình bình hành, ta tìm một cặp cạnh đối vừa song song vừa bằng nhau, chọn $AE$ và $HF$. Vì $H$ nằm trên đường thẳng $MF$ nên $AE\parallel HF$ có từ cạnh đối $AE\parallel FM$ của hình chữ nhật; còn $AE=FM=FH$ nhờ giả thiết $FM=FH$.

**Bước 3.** Ý c, phần $I$ là trung điểm: $I$ là giao điểm của hai đường chéo $AF$ và $EH$ của hình bình hành $AHFE$ (ý b), nên là trung điểm của cả hai đường chéo.

**Bước 4.** Ý c, phần $IJ\perp ME$: vì $AE\perp ME$ (hình chữ nhật) nên chỉ cần $IJ\parallel AE$. Muốn vậy ta chứng minh $AIJE$ là hình bình hành: $AI\parallel EJ$ vì $AF\parallel EM$, và $AI=EJ$ vì chúng lần lượt là nửa của hai cạnh đối bằng nhau $AF$ và $EM$.

**Phần 2. Trình bày**

a) Tứ giác $AEMF$ có $\widehat{EAF}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AEM}=90^\circ$ (vì $ME\perp AB$), $\widehat{AFM}=90^\circ$ (vì $MF\perp AC$).

Suy ra $\widehat{EMF}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AEMF$ có bốn góc vuông nên là hình chữ nhật.

b) Vì $AEMF$ là hình chữ nhật nên $AE\parallel FM$ và $AE=FM$ (hai cạnh đối).

Vì $H$ thuộc tia $MF$ nên $H$ nằm trên đường thẳng $FM$, do đó $AE\parallel HF$.

Mà $FM=FH$ (giả thiết) nên $AE=HF$.

Tứ giác $AHFE$ có $AE\parallel HF$ và $AE=HF$ nên là hình bình hành (dấu hiệu nhận biết).

c) Vì $AHFE$ là hình bình hành nên hai đường chéo $AF$ và $EH$ cắt nhau tại trung điểm của mỗi đường.

Mà $I$ là giao điểm của $EH$ và $AF$ nên $I$ là trung điểm của $AF$ và của $EH$.

Vì $AEMF$ là hình chữ nhật nên $AF\parallel EM$ và $AF=EM$ (hai cạnh đối).

Vì $I$ là trung điểm của $AF$ và $J$ là trung điểm của $EM$ nên $AI=\dfrac{1}{2}AF$ và $EJ=\dfrac{1}{2}EM$, suy ra $AI=EJ$.

Mà $I$ thuộc $AF$, $J$ thuộc $EM$ nên $AI\parallel EJ$.

Tứ giác $AIJE$ có $AI\parallel EJ$ và $AI=EJ$ nên là hình bình hành (dấu hiệu nhận biết), suy ra $IJ\parallel AE$.

Mà $AE\perp ME$ (vì $AEMF$ là hình chữ nhật) nên $IJ\perp ME$.

Vậy $I$ là trung điểm của $AF,\ EH$ và $IJ\perp ME$.

### Bài 22 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$ với $AB>AD$. Kẻ $AN\perp BD,\ CM\perp BD$ ($N,\ M\in BD$).
a) Chứng minh $DN=BM$.
b) Chứng minh $ANCM$ là hình bình hành.
c) Trên tia đối của tia $NA$ lấy $K$ sao cho $NK=NA$. Chứng minh $BA=BK$ và $DA=DK$.
d) Chứng minh $DKCB$ là hình thang cân.
**Hình giải:** giai_bai22.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tam giác vuông $ADN$ và $CBM$ bằng nhau cho $DN=BM$ và $AN=CM$; $AN$, $CM$ lại cùng vuông góc với $BD$ nên $ANCM$ là hình bình hành, và điểm $K$ đối xứng với $A$ qua $N$ cho các ý còn lại.

**Bước 1.** Ý a: muốn $DN=BM$, ta ghép chúng vào hai tam giác $ADN$ và $CBM$. Hai tam giác vuông này có cạnh huyền $AD=CB$ (cạnh đối của hình chữ nhật) và góc nhọn $\widehat{ADN}=\widehat{CBM}$ (so le trong vì $AD\parallel BC$), đủ để dùng trường hợp cạnh huyền – góc nhọn.

**Bước 2.** Ý b: muốn $ANCM$ là hình bình hành, ta tìm một cặp cạnh đối vừa song song vừa bằng nhau, chọn $AN$ và $CM$. Chúng song song vì cùng vuông góc với $BD$, và bằng nhau vì là hai cạnh tương ứng của hai tam giác bằng nhau ở ý a.

**Bước 3.** Ý c: muốn $BA=BK$, ta xét hai tam giác $BNA$ và $BNK$: có $NA=NK$ theo giả thiết, hai góc ở $N$ cùng bằng $90^\circ$ vì $K$ nằm trên đường thẳng $AN\perp BD$, và chung cạnh $BN$. Cách làm hệt như vậy với hai tam giác $DNA$, $DNK$ cho $DA=DK$.

**Bước 4.** Ý d: muốn $DKCB$ là hình thang cân, trước hết cần một cặp cạnh đối song song; ta chọn $KC\parallel BD$. Muốn vậy chứng minh $KNMC$ là hình bình hành: $KN\parallel CM$ vì $K$ nằm trên đường thẳng $AN\parallel CM$, và $KN=NA=CM$.

**Bước 5.** Ý d: khi đã là hình thang, cần hai đường chéo $DC$ và $KB$ bằng nhau. Cả hai đều bằng $AB$: $DC=AB$ vì cạnh đối của hình chữ nhật, và $KB=AB$ theo ý c.

**Chú ý:** điều kiện $AB>AD$ cho biết $K$ nằm cùng phía với $C$ đối với đường thẳng $BD$ và $DKCB$ là tứ giác lồi với hai đáy $KC$, $DB$; nếu $AB<AD$ thì tên của hình thang phải đổi thành $DKBC$.

**Phần 2. Trình bày**

a) Xét $\triangle ADN$ và $\triangle CBM$ có:

$\widehat{AND}=\widehat{CMB}=90^\circ$ (vì $AN\perp BD$, $CM\perp BD$)

$AD=CB$ (hai cạnh đối của hình chữ nhật $ABCD$)

$\widehat{ADN}=\widehat{CBM}$ (so le trong, vì $AD\parallel BC$)

Do đó $\triangle ADN=\triangle CBM$ (cạnh huyền – góc nhọn).

Suy ra $DN=BM$ và $AN=CM$ (hai cạnh tương ứng).

b) Vì $AN\perp BD$ và $CM\perp BD$ nên $AN\parallel CM$.

Mà $AN=CM$ (câu a).

Tứ giác $ANCM$ có $AN\parallel CM$ và $AN=CM$ nên là hình bình hành (dấu hiệu nhận biết).

c) Vì $K$ thuộc đường thẳng $AN$ và $AN\perp BD$ tại $N$ nên $\widehat{BNA}=\widehat{BNK}=90^\circ$.

Xét $\triangle BNA$ và $\triangle BNK$ có:

$NA=NK$ (giả thiết)

$\widehat{BNA}=\widehat{BNK}=90^\circ$ (chứng minh trên)

$BN$ chung

Do đó $\triangle BNA=\triangle BNK$ (c.g.c), suy ra $BA=BK$.

Chứng minh tương tự, $\triangle DNA=\triangle DNK$ (c.g.c) nên $DA=DK$.

d) Vì $K$ thuộc đường thẳng $AN$ và $AN\parallel CM$ (câu b) nên $KN\parallel CM$.

Mà $KN=NA$ (giả thiết) và $NA=CM$ (câu b) nên $KN=CM$.

Tứ giác $KNMC$ có $KN\parallel CM$ và $KN=CM$ nên là hình bình hành (dấu hiệu nhận biết).

Suy ra $KC\parallel NM$; mà $N$, $M$ thuộc $BD$ nên $KC\parallel BD$.

Do đó $DKCB$ là hình thang (đáy $KC$ và $DB$).

Vì $ABCD$ là hình chữ nhật nên $DC=AB$.

Mà $BK=BA$ (câu c) nên $DC=BK$.

Hình thang $DKCB$ có hai đường chéo $DC$ và $KB$ bằng nhau nên là hình thang cân (dấu hiệu nhận biết).

### Bài 23 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$. Lấy $D\in BC$. Gọi $M,\ N$ lần lượt là hình chiếu của $D$ trên $AB,\ AC$.
a) Chứng minh $AD=MN$.
b) Kẻ đường cao $AH$ của tam giác $ABC$. Chứng minh $\widehat{MHN}=90^\circ$.
**Hình giải:** giai_bai23.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** $AMDN$ là hình chữ nhật nên hai đường chéo $AD$, $MN$ bằng nhau và có chung trung điểm $O$; chính $O$ này cách $H$ đúng một nửa $AD$, tức là một nửa $MN$, nên trung tuyến $HO$ của tam giác $MHN$ bằng nửa cạnh $MN$ và góc $MHN$ vuông.

**Bước 1.** Ý a: muốn $AD=MN$, ta thấy $AD$ và $MN$ là hai đường chéo của tứ giác $AMDN$, nên cần $AMDN$ là hình chữ nhật. Ba góc ở $A$, $M$, $N$ đã vuông theo giả thiết, góc thứ tư ở $D$ suy ra từ tổng bốn góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $\widehat{MHN}=90^\circ$, ta dùng chiều đảo của tính chất trung tuyến ứng với cạnh huyền: tam giác $MHN$ có trung tuyến $HO$ ứng với cạnh $MN$, nên chỉ cần $HO=\dfrac{1}{2}MN$, với $O$ là trung điểm của $MN$.

**Bước 3.** Ý b: để tính $HO$, ta nhớ $O$ cũng là trung điểm của $AD$ (hai đường chéo của hình chữ nhật). Vì $AH\perp BC$ và $D$ thuộc $BC$ nên tam giác $AHD$ vuông tại $H$, có $HO$ là trung tuyến ứng với cạnh huyền $AD$, suy ra $HO=\dfrac{1}{2}AD$; kết hợp $AD=MN$ ở ý a ta có điều cần tìm.

**Chú ý:** nếu $D$ trùng $H$ thì không còn tam giác $AHD$, nhưng $O$ khi đó là trung điểm của $AH$ nên $HO=\dfrac{1}{2}AD$ vẫn đúng; còn $D$ trùng $B$ hoặc $C$ thì $AMDN$ suy biến nên coi $D$ khác $B$, $C$.

**Phần 2. Trình bày**

a) Tứ giác $AMDN$ có $\widehat{MAN}=90^\circ$ (vì $\triangle ABC$ vuông tại $A$), $\widehat{AMD}=90^\circ$ (vì $DM\perp AB$), $\widehat{AND}=90^\circ$ (vì $DN\perp AC$).

Suy ra $\widehat{MDN}=360^\circ-3\cdot 90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $AMDN$ có bốn góc vuông nên là hình chữ nhật.

Do đó hai đường chéo $AD$ và $MN$ bằng nhau, tức là $AD=MN$.

b) Gọi $O$ là giao điểm của $AD$ và $MN$.

Vì $AMDN$ là hình chữ nhật nên $O$ là trung điểm của mỗi đường chéo, do đó $OM=ON=\dfrac{1}{2}MN$ và $OA=OD=\dfrac{1}{2}AD$.

Vì $AH\perp BC$ và $D$ thuộc $BC$ nên $\triangle AHD$ vuông tại $H$ (nếu $D$ trùng $H$ thì $O$ là trung điểm của $AH$).

Tam giác $AHD$ vuông tại $H$ có $HO$ là trung tuyến ứng với cạnh huyền $AD$ nên $HO=\dfrac{1}{2}AD$.

Mà $AD=MN$ (câu a) nên $HO=\dfrac{1}{2}MN$.

Tam giác $MHN$ có trung tuyến $HO$ ứng với cạnh $MN$ và $HO=\dfrac{1}{2}MN$ nên $\triangle MHN$ vuông tại $H$.

Vậy $\widehat{MHN}=90^\circ$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 20 (ý b, d) và Bài 21 (ý c): dữ kiện đúng là bài đường trung bình ($D$, $F$ là trung điểm $AB$, $AC$ nên $DF\parallel BC$; $I$, $J$ là trung điểm $EH$, $EM$ của tam giác $EMH$ nên $IJ\parallel MH$). Theo luật khối 8 lời giải tự chứng minh bằng đường chéo hình chữ nhật + tam giác cân (Bài 20) và hình bình hành $AIJE$ (Bài 21) — CEO xem có cho dùng đường trung bình ở đề cương này không; nếu cho, Bài 20 ý b, d và Bài 21 ý c chỉ còn 2–3 dòng.
- Bài 20 ý e: cần $AB<AC$ để $H$ khác $E$; lời giải ghi rõ lí do. Ý d dùng tính chất "đường cao ứng với cạnh đáy của tam giác cân đồng thời là trung tuyến" (Hình 7).
- Bài 22: cần $AB>AD$ để tên $DKCB$ đúng thứ tự đỉnh (nếu $AB<AD$ phải gọi $DKBC$); đề cho sẵn điều kiện này nên không có gì sai. Lời giải ý d chứng minh $KC\parallel BD$ qua hình bình hành $KNMC$, không dùng đường trung bình.
- Bài 23: $D$ trùng $H$ vẫn đúng ($HO=\dfrac{1}{2}AD$ vì $O$ là trung điểm $AH$), đã ghi ở Chú ý; $D$ trùng $B$ hoặc $C$ thì $AMDN$ suy biến nên coi $D$ khác $B$, $C$.
- Cả bốn bài chỉ dùng: hình chữ nhật (định nghĩa, tính chất, dấu hiệu), hình bình hành (dấu hiệu), hình thang cân (dấu hiệu hai đường chéo bằng nhau), trung tuyến ứng với cạnh huyền và chiều đảo, tam giác bằng nhau, tam giác cân — không đường trung bình, Thalès, đồng dạng, Pythagore; không dùng hình thoi hay hình vuông (chưa học ở LTV).
- Hình giải (`giai_bai20` … `giai_bai23`) vẽ bằng code, dựng đúng dữ kiện bằng toạ độ; điểm phụ $O$ (Bài 20, 23) có mặt vì lời giải dùng; Bài 22 vẽ cả $DK$, $BK$, $KC$ (các cạnh của $DKCB$). Đã kiểm toạ độ số 400 hình ngẫu nhiên mỗi bài (có quay, tịnh tiến): mọi khẳng định song song, vuông góc, bằng nhau, thẳng hàng, hình bình hành, hình thang cân và các bước trung gian của lời giải đều đúng; Bài 22 kiểm thêm nếu $AB<AD$ thì $DKCB$ không còn lồi.
