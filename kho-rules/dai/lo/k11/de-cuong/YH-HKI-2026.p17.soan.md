# ĐỀ | Đề cương ôn tập học kì I Toán 11 năm 2026–2027 — Trường THPT Yên Hòa, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 10 | Chương 4 — B. Tự luận | tu_luan

### Câu 91 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tứ diện $ABCD$. Gọi $M$, $N$ lần lượt là trung điểm của các cạnh $AB$ và $AC$. Chứng minh rằng $MN\parallel(BCD)$.
**Hình giải:** giai_P10C91.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn chứng minh một đường thẳng song song với mặt phẳng, ta tìm trong mặt phẳng đó một đường thẳng song song với nó và chỉ ra đường thẳng ban đầu không nằm trong mặt phẳng.

**Bước 1.** Hai điểm $M$, $N$ là trung điểm của hai cạnh của tam giác $ABC$, nên dùng tính chất đường trung bình để tìm đường thẳng song song với $MN$.

**Bước 2.** Kiểm tra đường thẳng vừa tìm được có nằm trong mặt phẳng $(BCD)$ hay không, vì đây là điều kiện để dùng dấu hiệu song song.

**Bước 3.** Chứng tỏ $MN$ không nằm trong $(BCD)$ bằng cách xét giao điểm của đường thẳng $AB$ (chứa $M$) với mặt phẳng $(BCD)$, rồi kết luận theo dấu hiệu đường thẳng song song mặt phẳng.

**Phần 2. Trình bày**

Trong $\triangle ABC$, $M$ và $N$ lần lượt là trung điểm của $AB$ và $AC$ nên $MN$ là đường trung bình của tam giác, suy ra $MN\parallel BC$.

Mà $BC\subset(BCD)$ nên $MN$ song song với một đường thẳng nằm trong $(BCD)$.

Ta chứng minh $MN\not\subset(BCD)$. Giả sử $MN\subset(BCD)$, khi đó $M\in(BCD)$. Đường thẳng $AB$ có $A\notin(BCD)$ nên chỉ cắt $(BCD)$ tại điểm $B$, suy ra $M=B$. Điều này vô lí vì $M$ là trung điểm của $AB$.

Vậy $MN\parallel(BCD)$.

### Câu 92 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tứ diện $ABCD$ với $M$, $N$ lần lượt là trọng tâm các tam giác $ABD$, $ACD$. Chứng minh rằng: $MN\parallel(ABC)$.
**Hình giải:** giai_P10C92.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** trung tuyến kẻ từ $B$ của tam giác $ABD$ và trung tuyến kẻ từ $C$ của tam giác $ACD$ cùng đi qua trung điểm của $AD$, nên $MN$ cắt hai cạnh của một tam giác theo cùng một tỉ lệ.

**Bước 1.** Gọi $E$ là trung điểm của $AD$ rồi xác định vị trí của $M$ trên trung tuyến $BE$ và của $N$ trên trung tuyến $CE$ theo tính chất trọng tâm.

**Bước 2.** Lập hai tỉ số $\dfrac{EM}{EB}$ và $\dfrac{EN}{EC}$ rồi so sánh chúng, sau đó dùng định lí Thales đảo trong tam giác $EBC$ để tìm đường thẳng song song với $MN$.

**Bước 3.** Chỉ ra đường thẳng tìm được nằm trong mặt phẳng $(ABC)$.

**Bước 4.** Chứng minh $MN$ không nằm trong $(ABC)$ bằng phản chứng, rồi kết luận theo dấu hiệu đường thẳng song song mặt phẳng.

**Phần 2. Trình bày**

Gọi $E$ là trung điểm của $AD$.

Vì $M$ là trọng tâm $\triangle ABD$ nên $M$ nằm trên trung tuyến $BE$ và $EM=\dfrac{1}{3}EB$.

Vì $N$ là trọng tâm $\triangle ACD$ nên $N$ nằm trên trung tuyến $CE$ và $EN=\dfrac{1}{3}EC$.

Trong $\triangle EBC$ có $\dfrac{EM}{EB}=\dfrac{EN}{EC}=\dfrac{1}{3}$ nên $MN\parallel BC$ (định lí Thales đảo).

Mà $BC\subset(ABC)$.

Giả sử $MN\subset(ABC)$, khi đó $M\in(ABC)$. Đường thẳng $BE$ có hai điểm phân biệt $B$, $M$ cùng thuộc $(ABC)$ nên $BE\subset(ABC)$, suy ra $E\in(ABC)$. Khi đó đường thẳng $AE$ (tức là $AD$) có hai điểm $A$, $E$ thuộc $(ABC)$ nên $D\in(ABC)$. Điều này vô lí vì $ABCD$ là tứ diện.

Vậy $MN\not\subset(ABC)$ và $MN\parallel(ABC)$.

### Câu 93 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ với đáy $ABCD$ là hình bình hành. Gọi $F$, $G$ lần lượt là trung điểm các cạnh $SA$ và $BC$. Chứng minh rằng: $FG\parallel(SCD)$.
**Hình giải:** giai_P10C93.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** thêm trung điểm $H$ của $SD$ để dựng một hình bình hành có $FG$ là một cạnh, cạnh đối diện nằm trong mặt phẳng $(SCD)$.

**Bước 1.** Gọi $H$ là trung điểm của $SD$ rồi dùng đường trung bình của tam giác $SAD$ để so sánh $FH$ với $AD$ về phương và độ dài.

**Bước 2.** So sánh $GC$ với $AD$ nhờ tính chất hình bình hành $ABCD$, từ đó so sánh $FH$ với $GC$.

**Bước 3.** Suy ra tứ giác $FGCH$ là hình bình hành, từ đó tìm đường thẳng song song với $FG$ nằm trong $(SCD)$.

**Bước 4.** Chứng minh $FG$ không nằm trong $(SCD)$ rồi kết luận theo dấu hiệu song song.

**Phần 2. Trình bày**

Gọi $H$ là trung điểm của $SD$.

Trong $\triangle SAD$, $F$ và $H$ là trung điểm của $SA$ và $SD$ nên $FH\parallel AD$ và $FH=\dfrac{1}{2}AD$.

Vì $ABCD$ là hình bình hành nên $BC\parallel AD$ và $BC=AD$. Mà $G$ là trung điểm của $BC$ nên $GC\parallel AD$ và $GC=\dfrac{1}{2}AD$.

Suy ra $FH\parallel GC$ và $FH=GC$. Hai đoạn thẳng này cùng hướng nên tứ giác $FGCH$ là hình bình hành, do đó $FG\parallel HC$.

Mà $HC\subset(SCD)$ vì $H\in SD$.

Giả sử $FG\subset(SCD)$, khi đó $F\in(SCD)$. Đường thẳng $SA$ chỉ cắt $(SCD)$ tại $S$ (vì $A\notin(SCD)$) nên $F=S$, vô lí vì $F$ là trung điểm của $SA$. Vậy $FG\not\subset(SCD)$.

Vậy $FG\parallel(SCD)$.

### Câu 94 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$. Gọi $M$, $N$ lần lượt là trung điểm của $AB$ và $BC$; $G$, $G'$ lần lượt là trọng tâm các tam giác $SAB$ và $SBC$.
a) Chứng minh $MN\parallel(SAC)$.
b) Chứng minh $GG'\parallel(SAC)$.
**Hình giải:** giai_P10C94.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đường trung bình của tam giác $ABC$ cho $MN$ song song với $AC$, còn hai trọng tâm chia hai trung tuyến $SM$, $SN$ theo cùng một tỉ số nên $GG'$ song song với $MN$.

**Bước 1.** Ý a: dùng đường trung bình của tam giác $ABC$ để tìm đường thẳng song song với $MN$ nằm trong mặt phẳng $(SAC)$.

**Bước 2.** Ý a: chứng tỏ $M$ không thuộc $(SAC)$ bằng cách xét giao của đường thẳng $AB$ với $(SAC)$, rồi kết luận theo dấu hiệu song song.

**Bước 3.** Ý b: viết $G$, $G'$ lần lượt nằm trên trung tuyến $SM$, $SN$ với cùng tỉ số $\dfrac{SG}{SM}$ và $\dfrac{SG'}{SN}$ rồi dùng định lí Thales đảo trong tam giác $SMN$.

**Bước 4.** Ý b: từ $GG'$ song song với $MN$ suy ra $GG'$ song song với đường thẳng nằm trong $(SAC)$, rồi chứng minh $GG'$ không nằm trong $(SAC)$ nhờ kết quả của ý a.

**Phần 2. Trình bày**

a) Trong $\triangle ABC$, $M$ và $N$ là trung điểm của $AB$ và $BC$ nên $MN\parallel AC$.

Mà $AC\subset(SAC)$.

Đường thẳng $AB$ cắt $(SAC)$ tại điểm duy nhất $A$ nên $M\notin(SAC)$ (vì $M\neq A$). Suy ra $MN\not\subset(SAC)$.

Vậy $MN\parallel(SAC)$.

b) $G$ là trọng tâm $\triangle SAB$ nên $G$ nằm trên trung tuyến $SM$ và $\dfrac{SG}{SM}=\dfrac{2}{3}$. $G'$ là trọng tâm $\triangle SBC$ nên $G'$ nằm trên trung tuyến $SN$ và $\dfrac{SG'}{SN}=\dfrac{2}{3}$.

Trong $\triangle SMN$ có $\dfrac{SG}{SM}=\dfrac{SG'}{SN}$ nên $GG'\parallel MN$. Mà $MN\parallel AC$ nên $GG'\parallel AC$, với $AC\subset(SAC)$.

Giả sử $GG'\subset(SAC)$, khi đó $G\in(SAC)$. Hai điểm $S$, $G$ phân biệt cùng thuộc $(SAC)$ nên đường thẳng $SG$ (tức là $SM$) nằm trong $(SAC)$, suy ra $M\in(SAC)$, mâu thuẫn với ý a. Vậy $GG'\not\subset(SAC)$.

Vậy $GG'\parallel(SAC)$.

### Câu 95 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hai hình bình hành $ABCD$ và $ABEF$ không cùng nằm trong một mặt phẳng có tâm lần lượt là $O$ và $O'$.
a) Chứng minh rằng $OO'$ song song với các mặt phẳng $(ADF)$ và $(BCE)$.
b) Gọi $M$, $N$ lần lượt là hai điểm trên các cạnh $AE$, $BD$ sao cho $AM=\dfrac{1}{3}AE$, $BN=\dfrac{1}{3}BD$. Chứng minh rằng $MN$ song song với mặt phẳng $(CDEF)$.
**Hình giải:** giai_P10C95.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** các tâm $O$, $O'$ là trung điểm của các đường chéo nên đường thẳng $OO'$ là đường trung bình của hai tam giác khác nhau, còn ý b dùng hai mặt phẳng song song để chuyển $MN$ vào một mặt phẳng song song với $(CDEF)$.

**Bước 1.** Ý a: nhận ra $O$ là trung điểm của cả $AC$ và $BD$, $O'$ là trung điểm của cả $AE$ và $BF$, rồi chọn tam giác thích hợp để dùng đường trung bình tìm đường thẳng song song với $OO'$.

**Bước 2.** Ý a: chỉ ra hai đường thẳng tìm được lần lượt nằm trong $(ADF)$ và $(BCE)$, rồi chứng minh $OO'$ không nằm trong hai mặt phẳng đó.

**Bước 3.** Ý b: trong mặt phẳng $(ABEF)$ kẻ qua $M$ đường thẳng song song với $AB$ cắt $BE$ tại $P$, tính tỉ số $\dfrac{BP}{BE}$ bằng định lí Thales.

**Bước 4.** Ý b: so sánh $\dfrac{BP}{BE}$ với $\dfrac{BN}{BD}$ để tìm đường thẳng $PN$ song song với một cạnh của $(CDEF)$.

**Bước 5.** Ý b: chứng minh mặt phẳng $(MPN)$ chứa hai đường thẳng cắt nhau cùng song song với $(CDEF)$, suy ra hai mặt phẳng song song rồi kết luận về $MN$.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình bình hành tâm $O$ nên $O$ là trung điểm của $AC$ và $BD$. Vì $ABEF$ là hình bình hành tâm $O'$ nên $O'$ là trung điểm của $AE$ và $BF$.

Trong $\triangle BDF$, $O$ và $O'$ là trung điểm của $BD$ và $BF$ nên $OO'\parallel DF$. Mà $DF\subset(ADF)$.

Trong $\triangle ACE$, $O$ và $O'$ là trung điểm của $AC$ và $AE$ nên $OO'\parallel CE$. Mà $CE\subset(BCE)$.

Giả sử $OO'\subset(ADF)$, khi đó $O\in(ADF)$. Mà $O\in(ABCD)$ và $(ADF)\cap(ABCD)=AD$ nên $O\in AD$, vô lí vì $O$ là tâm của hình bình hành $ABCD$. Vậy $OO'\not\subset(ADF)$.

Tương tự, nếu $OO'\subset(BCE)$ thì $O\in(BCE)\cap(ABCD)=BC$, vô lí. Vậy $OO'\not\subset(BCE)$.

Vậy $OO'$ song song với $(ADF)$ và $(BCE)$.

b) Trong mặt phẳng $(ABEF)$, kẻ $MP\parallel AB$ với $P\in BE$. Trong $\triangle EAB$ có $MP\parallel AB$ nên $\dfrac{EP}{EB}=\dfrac{EM}{EA}=\dfrac{2}{3}$, suy ra $\dfrac{BP}{BE}=\dfrac{1}{3}$.

Trong $\triangle BED$ có $\dfrac{BP}{BE}=\dfrac{1}{3}=\dfrac{BN}{BD}$ nên $PN\parallel ED$. Mà $ED\subset(CDEF)$.

Vì $MP\parallel AB$ và $AB\parallel CD$ (do $ABCD$ là hình bình hành) nên $MP\parallel CD$. Mà $CD\subset(CDEF)$.

Hai đường thẳng $MP$ và $PN$ cắt nhau tại $P$, cùng nằm trong $(MPN)$ và cùng song song với các đường thẳng $CD$, $ED$ nằm trong $(CDEF)$.

Mặt phẳng $(MPN)$ khác $(CDEF)$: nếu $P\in(CDEF)$ thì đường thẳng $BE$ có hai điểm $P$, $E$ thuộc $(CDEF)$ nên $B\in(CDEF)$. Khi đó $(CDEF)$ chứa $B$, $C$, $D$ không thẳng hàng nên trùng $(ABCD)$ và chứa $E$, suy ra $E\in(ABCD)\cap(ABEF)=AB$, vô lí.

Do đó $(MPN)\parallel(CDEF)$. Mà $MN\subset(MPN)$ nên $MN\parallel(CDEF)$.

### Câu 96 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình bình hành. Gọi $G$ là trọng tâm tam giác $SAB$, $I$ là trung điểm của $AB$ và $M$ là điểm trên cạnh $AD$ sao cho $AM=\dfrac{1}{3}AD$. Đường thẳng đi qua $M$ và song song với $AB$ cắt $CI$ tại $N$. Chứng minh rằng $MG\parallel(SCD)$.
**Hình giải:** giai_P10C96.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** chỉ ra hai đường thẳng cắt nhau tại $N$ trong mặt phẳng $(GMN)$ lần lượt song song với hai đường thẳng của $(SCD)$, từ đó hai mặt phẳng song song và $MG$ nằm trong $(GMN)$.

**Bước 1.** Nhận xét $MN$ song song với $AB$ nên song song với $CD$, đó là đường thẳng thứ nhất của $(SCD)$.

**Bước 2.** Gọi $K$ là giao điểm của $MN$ với $BC$, tính $BK$ theo $BC$ rồi dùng định lí Thales trong tam giác $CIB$ để tính tỉ số $\dfrac{CN}{CI}$.

**Bước 3.** Từ vị trí của $G$ trên trung tuyến $SI$ và của $N$ trên $CI$, so sánh hai tỉ số để tìm đường thẳng $GN$ song song với $SC$.

**Bước 4.** Dùng dấu hiệu hai mặt phẳng song song cho $(GMN)$ và $(SCD)$, chứng minh hai mặt phẳng không trùng nhau rồi kết luận về $MG$.

**Phần 2. Trình bày**

Vì $MN\parallel AB$ và $AB\parallel CD$ nên $MN\parallel CD$, mà $CD\subset(SCD)$.

Gọi $K$ là giao điểm của $MN$ với $BC$. Tứ giác $ABKM$ có $MK\parallel AB$ và $AM\parallel BK$ (vì $AD\parallel BC$) nên là hình bình hành, suy ra $BK=AM=\dfrac{1}{3}AD=\dfrac{1}{3}BC$. Do đó $CK=\dfrac{2}{3}CB$.

Trong $\triangle CIB$ có $NK\parallel IB$ nên $\dfrac{CN}{CI}=\dfrac{CK}{CB}=\dfrac{2}{3}$, suy ra $\dfrac{IN}{IC}=\dfrac{1}{3}$.

$G$ là trọng tâm $\triangle SAB$ nên $G$ nằm trên trung tuyến $SI$ và $\dfrac{IG}{IS}=\dfrac{1}{3}$.

Trong $\triangle ISC$ có $\dfrac{IG}{IS}=\dfrac{IN}{IC}=\dfrac{1}{3}$ nên $GN\parallel SC$, mà $SC\subset(SCD)$.

Hai đường thẳng $GN$ và $MN$ cắt nhau tại $N$, cùng nằm trong $(GMN)$ và lần lượt song song với $SC$, $CD$ là hai đường thẳng cắt nhau của $(SCD)$ nên $(GMN)\parallel(SCD)$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau vì $M\in AD$, $M\neq D$ và $(SCD)\cap(ABCD)=CD$ nên $M\notin(SCD)$ trong khi $M\in(GMN)$.

Do đó $(GMN)\parallel(SCD)$. Mà $MG\subset(GMN)$ nên $MG\parallel(SCD)$.

### Câu 97 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình thang, đáy lớn là $AD$ thỏa mãn $AD=2BC$. Gọi $O$ là giao điểm $AC$ và $BD$, $G$ là trọng tâm tam giác $SCD$. Chứng minh rằng $OG\parallel(SBC)$.
**Hình giải:** giai_P10C97.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** dựng thêm điểm $E$ trên $CD$ sao cho $OE\parallel BC$, rồi chứng minh $GE\parallel SC$ để $OG$ nằm trong mặt phẳng $(OGE)$ song song với $(SBC)$.

**Bước 1.** Dùng hai đáy song song với tỉ số $AD=2BC$ để tính tỉ số $\dfrac{DO}{DB}$ trong hình thang.

**Bước 2.** Kẻ qua $O$ đường thẳng song song với $BC$ cắt $CD$ tại $E$, rồi dùng định lí Thales trong tam giác $DBC$ để tính tỉ số $\dfrac{DE}{DC}$.

**Bước 3.** Xét trung tuyến $DJ$ của tam giác $SCD$ (với $J$ là trung điểm của $SC$), so sánh $\dfrac{DG}{DJ}$ với $\dfrac{DE}{DC}$ để tìm đường thẳng $GE$ song song với $SC$.

**Bước 4.** Dùng dấu hiệu hai mặt phẳng song song cho $(OGE)$ và $(SBC)$, kiểm tra hai mặt phẳng phân biệt rồi kết luận về $OG$.

**Phần 2. Trình bày**

Vì $AD\parallel BC$ nên $\triangle OAD$ đồng dạng với $\triangle OCB$, suy ra $\dfrac{OD}{OB}=\dfrac{AD}{BC}=2$, do đó $\dfrac{DO}{DB}=\dfrac{2}{3}$.

Trong mặt phẳng $(ABCD)$, kẻ $OE\parallel BC$ với $E\in CD$. Trong $\triangle DBC$ có $OE\parallel BC$ nên $\dfrac{DE}{DC}=\dfrac{DO}{DB}=\dfrac{2}{3}$.

Gọi $J$ là trung điểm của $SC$. Vì $G$ là trọng tâm $\triangle SCD$ nên $G$ nằm trên trung tuyến $DJ$ và $\dfrac{DG}{DJ}=\dfrac{2}{3}$.

Trong $\triangle DJC$ có $\dfrac{DG}{DJ}=\dfrac{DE}{DC}=\dfrac{2}{3}$ nên $GE\parallel JC$, tức là $GE\parallel SC$.

Hai đường thẳng $OE$ và $GE$ cắt nhau tại $E$, cùng nằm trong $(OGE)$ và lần lượt song song với $BC$, $SC$ là hai đường thẳng cắt nhau của $(SBC)$ nên $(OGE)\parallel(SBC)$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau vì $E\in CD$, $E\neq C$ và $(SBC)\cap(ABCD)=BC$ nên $E\notin(SBC)$ trong khi $E\in(OGE)$.

Do đó $(OGE)\parallel(SBC)$. Mà $OG\subset(OGE)$ nên $OG\parallel(SBC)$.

### Câu 98 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình thang, đáy lớn là $AD$ thỏa mãn $AD=2BC$. Gọi $M$ là trung điểm của $SD$. Chứng minh rằng $CM\parallel(SAB)$.
**Hình giải:** giai_P10C98.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** lấy thêm trung điểm $I$ của $AD$ để tạo hai đường thẳng $CI$, $MI$ cắt nhau tại $I$, lần lượt song song với $AB$ và $SA$, từ đó hai mặt phẳng song song.

**Bước 1.** Gọi $I$ là trung điểm của $AD$ rồi dùng điều kiện $AD=2BC$ để chứng minh tứ giác $ABCI$ là hình bình hành.

**Bước 2.** Từ đó rút ra đường thẳng $CI$ song song với $AB$, là một đường thẳng của mặt phẳng $(SAB)$.

**Bước 3.** Dùng đường trung bình của tam giác $SAD$ để tìm đường thẳng $MI$ song song với $SA$.

**Bước 4.** Kết luận $(CMI)\parallel(SAB)$ bằng dấu hiệu hai mặt phẳng song song rồi suy ra $CM$ song song với $(SAB)$.

**Phần 2. Trình bày**

Gọi $I$ là trung điểm của $AD$. Vì $AD=2BC$ nên $AI=BC$. Lại có $AI\parallel BC$ (do $AD\parallel BC$) nên tứ giác $ABCI$ là hình bình hành, suy ra $CI\parallel AB$.

Trong $\triangle SAD$, $M$ và $I$ là trung điểm của $SD$ và $AD$ nên $MI\parallel SA$.

Hai đường thẳng $CI$ và $MI$ cắt nhau tại $I$, cùng nằm trong $(CMI)$ và lần lượt song song với $AB$, $SA$ là hai đường thẳng cắt nhau của $(SAB)$ nên $(CMI)\parallel(SAB)$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau vì $I\in AD$, $I\neq A$ và $(SAB)\cap(ABCD)=AB$ nên $I\notin(SAB)$ trong khi $I\in(CMI)$.

Do đó $(CMI)\parallel(SAB)$. Mà $CM\subset(CMI)$ nên $CM\parallel(SAB)$.

### Câu 99 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình bình hành. Tìm giao tuyến của hai mặt phẳng $(SAB)$ và $(SCD)$.
**Hình giải:** giai_P10C99.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng có một điểm chung rõ ràng, và mỗi mặt phẳng chứa một cạnh đáy; quan hệ giữa hai cạnh đáy đó quyết định phương của giao tuyến.

**Bước 1.** Tìm một điểm chung dễ thấy của hai mặt phẳng $(SAB)$ và $(SCD)$.

**Bước 2.** Chọn trong mỗi mặt phẳng một đường thẳng nằm ở đáy, rồi xét vị trí tương đối của hai đường thẳng đó nhờ tính chất của hình bình hành.

**Bước 3.** Dùng định lí về giao tuyến của hai mặt phẳng chứa hai đường thẳng như thế để xác định giao tuyến đi qua điểm chung đã tìm.

**Phần 2. Trình bày**

Ta có $S\in(SAB)$ và $S\in(SCD)$ nên $S$ là điểm chung của hai mặt phẳng.

Vì $ABCD$ là hình bình hành nên $AB\parallel CD$, với $AB\subset(SAB)$ và $CD\subset(SCD)$. Hai mặt phẳng $(SAB)$ và $(SCD)$ phân biệt.

Theo định lí về giao tuyến của hai mặt phẳng lần lượt chứa hai đường thẳng song song, giao tuyến của $(SAB)$ và $(SCD)$ là đường thẳng $Sx$ đi qua $S$ và song song với $AB$ (cũng song song với $CD$).

Vậy giao tuyến của $(SAB)$ và $(SCD)$ là đường thẳng $Sx$ qua $S$, song song với $AB$ và $CD$.

### Câu 100 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy là hình thang với các cạnh đáy là $AB$ và $CD$. Gọi $I$, $J$ lần lượt là trung điểm của $AD$ và $BC$, $G$ là trọng tâm của tam giác $SAB$. Tìm giao tuyến của hai mặt phẳng $(SAB)$ và $(IJG)$.
**Hình giải:** giai_P10C100.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng có điểm chung $G$, và đoạn $IJ$ nối trung điểm hai cạnh bên của hình thang liên hệ với cạnh đáy $AB$ chứa trong $(SAB)$.

**Bước 1.** Chỉ ra điểm chung $G$ của hai mặt phẳng $(SAB)$ và $(IJG)$.

**Bước 2.** Nhận xét đoạn $IJ$ trong hình thang $ABCD$ rồi so sánh $IJ$ với cạnh đáy $AB$ nằm trong $(SAB)$.

**Bước 3.** Áp dụng định lí về giao tuyến của hai mặt phẳng chứa hai đường thẳng đó để biết phương của giao tuyến đi qua $G$.

**Bước 4.** Trong tam giác $SAB$, dùng tỉ lệ của trọng tâm để xác định hai giao điểm của giao tuyến với các cạnh $SA$, $SB$.

**Phần 2. Trình bày**

Vì $I$, $J$ là trung điểm của hai cạnh bên $AD$ và $BC$ của hình thang $ABCD$ nên $IJ$ là đường trung bình, suy ra $IJ\parallel AB$ (và $IJ\parallel CD$).

Ta có $G\in(SAB)$ và $G\in(IJG)$ nên $G$ là điểm chung của hai mặt phẳng. Hai mặt phẳng phân biệt vì $I\notin(SAB)$.

Mặt phẳng $(IJG)$ chứa $IJ$, mặt phẳng $(SAB)$ chứa $AB$ và $IJ\parallel AB$. Theo định lí về giao tuyến, giao tuyến của hai mặt phẳng là đường thẳng đi qua $G$ và song song với $AB$.

Trong mặt phẳng $(SAB)$, gọi $K$ là trung điểm của $AB$. Đường thẳng qua $G$ song song với $AB$ cắt $SA$, $SB$ lần lượt tại $M$, $N$. Vì $G$ là trọng tâm nên $\dfrac{SG}{SK}=\dfrac{2}{3}$, do đó $\dfrac{SM}{SA}=\dfrac{SN}{SB}=\dfrac{2}{3}$.

Vậy giao tuyến của $(SAB)$ và $(IJG)$ là đường thẳng $MN$ đi qua $G$, song song với $AB$, với $M\in SA$, $N\in SB$ thỏa mãn $SM=\dfrac{2}{3}SA$, $SN=\dfrac{2}{3}SB$.

### Câu 101 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tứ diện $ABCD$. Gọi $G_1$ và $G_2$ theo thứ tự là trọng tâm tam giác $ABD$ và tam giác $ACD$. Tìm giao tuyến của mặt phẳng $(AG_1G_2)$ với mặt phẳng $(ABC)$.
**Hình giải:** giai_P10C101.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng có điểm chung $A$, và đoạn $G_1G_2$ liên hệ với một cạnh của mặt phẳng $(ABC)$ thông qua trung tuyến chung kẻ từ trung điểm của $AD$.

**Bước 1.** Chỉ ra điểm chung $A$ của hai mặt phẳng $(AG_1G_2)$ và $(ABC)$.

**Bước 2.** Gọi $E$ là trung điểm của $AD$ rồi xác định $G_1$, $G_2$ trên các trung tuyến $BE$, $CE$ bằng tính chất trọng tâm.

**Bước 3.** Dùng định lí Thales đảo trong tam giác $EBC$ để so sánh $G_1G_2$ với một cạnh của mặt phẳng $(ABC)$.

**Bước 4.** Áp dụng định lí về giao tuyến của hai mặt phẳng chứa hai đường thẳng đó, đồng thời kiểm tra hai mặt phẳng phân biệt, để kết luận.

**Phần 2. Trình bày**

Ta có $A\in(AG_1G_2)$ và $A\in(ABC)$ nên $A$ là điểm chung của hai mặt phẳng.

Gọi $E$ là trung điểm của $AD$. Vì $G_1$ là trọng tâm $\triangle ABD$ nên $G_1\in BE$ và $EG_1=\dfrac{1}{3}EB$. Vì $G_2$ là trọng tâm $\triangle ACD$ nên $G_2\in CE$ và $EG_2=\dfrac{1}{3}EC$.

Trong $\triangle EBC$ có $\dfrac{EG_1}{EB}=\dfrac{EG_2}{EC}=\dfrac{1}{3}$ nên $G_1G_2\parallel BC$.

Hai mặt phẳng $(AG_1G_2)$ và $(ABC)$ phân biệt vì $G_1\notin(ABC)$ (nếu $G_1\in(ABC)$ thì $BE\subset(ABC)$, kéo theo $E\in(ABC)$ và $D\in(ABC)$, vô lí).

Mặt phẳng $(AG_1G_2)$ chứa $G_1G_2$, mặt phẳng $(ABC)$ chứa $BC$ và $G_1G_2\parallel BC$. Theo định lí về giao tuyến, giao tuyến của hai mặt phẳng là đường thẳng đi qua $A$ và song song với $BC$.

Vậy giao tuyến của $(AG_1G_2)$ và $(ABC)$ là đường thẳng $Ax$ qua $A$, song song với $BC$ (và với $G_1G_2$).

### Câu 102 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình bình hành. $Sx$ là giao tuyến của hai mặt phẳng $(SAD)$ và $(SBD)$. $M$, $N$ lần lượt là trung điểm của $AB$ và $DC$. Chứng minh $MN$ song song với giao tuyến của hai mặt phẳng $(SAD)$ và $(SBC)$.
**Hình giải:** giai_P10C102.png
**Ghi chú:** đề sai ở câu dẫn: giao tuyến của $(SAD)$ và $(SBD)$ là đường thẳng $SD$ (hai mặt phẳng cùng chứa $S$, $D$), không có vai trò gì ở yêu cầu chứng minh; đề có thể muốn nói $Sx$ là giao tuyến của $(SAD)$ và $(SBC)$. Giải theo yêu cầu chính của đề (giao tuyến của $(SAD)$ và $(SBC)$), gọi giao tuyến đó là $Sy$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giao tuyến của $(SAD)$ và $(SBC)$ song song với hai đáy $AD$, $BC$ của hai mặt phẳng, còn $MN$ cũng song song với hai cạnh đó nhờ tính chất hình bình hành.

**Bước 1.** Xác định giao tuyến của $(SAD)$ và $(SBC)$ bằng một điểm chung và quan hệ của hai cạnh đáy $AD$, $BC$ nằm trong hai mặt phẳng.

**Bước 2.** Chứng tỏ tứ giác $AMND$ là hình bình hành bằng cách so sánh $AM$ và $DN$ cùng với hướng của chúng, để suy ra phương của $MN$.

**Bước 3.** So sánh phương của $MN$ với phương của giao tuyến vừa tìm rồi loại trường hợp hai đường thẳng trùng nhau.

**Phần 2. Trình bày**

Lưu ý: đề sai ở câu dẫn vì giao tuyến của $(SAD)$ và $(SBD)$ là $SD$ và không dùng ở yêu cầu chính; ta giải yêu cầu chứng minh với giao tuyến của $(SAD)$ và $(SBC)$.

Ta có $S$ là điểm chung của $(SAD)$ và $(SBC)$. Vì $ABCD$ là hình bình hành nên $AD\parallel BC$, với $AD\subset(SAD)$ và $BC\subset(SBC)$. Theo định lí về giao tuyến, giao tuyến của hai mặt phẳng là đường thẳng $Sy$ đi qua $S$ và song song với $AD$, $BC$.

Vì $ABCD$ là hình bình hành nên $AB\parallel DC$ và $AB=DC$. Mà $M$, $N$ là trung điểm của $AB$, $DC$ nên $AM\parallel DN$ và $AM=DN$, hai đoạn cùng hướng. Suy ra $AMND$ là hình bình hành, do đó $MN\parallel AD$.

Từ $MN\parallel AD$ và $Sy\parallel AD$ suy ra $MN\parallel Sy$ (hai đường thẳng không trùng nhau vì $S\notin(ABCD)$ còn $MN\subset(ABCD)$).

Vậy $MN$ song song với giao tuyến của $(SAD)$ và $(SBC)$.

### Câu 103 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có $ABCD$ là hình bình hành tâm $O$. Gọi $M$, $N$ lần lượt là trung điểm của $SA$ và $SD$.
a) Chứng minh $(SBC)\parallel(OMN)$.
b) Gọi $P$, $Q$, $R$ lần lượt là trung điểm của $AB$, $ON$, $SB$. Chứng minh $PQ\parallel(SBC)$ và $(OMR)\parallel(SCD)$.
**Hình giải:** giai_P10C103.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** $O$ là trung điểm của hai đường chéo nên các đoạn $OM$, $ON$, $OR$ là đường trung bình của các tam giác có đỉnh $S$; các đường này song song với các cạnh bên của hình chóp.

**Bước 1.** Ý a: dùng đường trung bình của các tam giác $SAC$ và $SBD$ để tìm hai đường thẳng $OM$, $ON$ song song với hai cạnh bên nằm trong $(SBC)$.

**Bước 2.** Ý a: áp dụng dấu hiệu hai mặt phẳng song song cho $(OMN)$ và $(SBC)$, kiểm tra hai mặt phẳng phân biệt.

**Bước 3.** Ý b: chứng minh $P$ nằm trong $(OMN)$ bằng cách so sánh phương của $PO$ và $MN$ với $AD$, từ đó đưa $PQ$ vào mặt phẳng $(OMN)$ rồi dùng kết quả ý a.

**Bước 4.** Ý b: dùng đường trung bình của tam giác $SBD$ và kết quả $OM\parallel SC$ để chứng minh $(OMR)\parallel(SCD)$.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình bình hành tâm $O$ nên $O$ là trung điểm của $AC$ và $BD$.

Trong $\triangle SAC$, $M$ và $O$ là trung điểm của $SA$ và $AC$ nên $OM\parallel SC$, mà $SC\subset(SBC)$.

Trong $\triangle SBD$, $N$ và $O$ là trung điểm của $SD$ và $BD$ nên $ON\parallel SB$, mà $SB\subset(SBC)$.

Hai đường thẳng $OM$, $ON$ cắt nhau tại $O$, cùng nằm trong $(OMN)$ và lần lượt song song với $SC$, $SB$ là hai đường thẳng cắt nhau của $(SBC)$. Hai mặt phẳng không trùng nhau vì $O\in(ABCD)$ và $(SBC)\cap(ABCD)=BC$, mà $O\notin BC$ nên $O\notin(SBC)$.

Vậy $(OMN)\parallel(SBC)$.

b) Trong $\triangle SAD$, $M$ và $N$ là trung điểm của $SA$ và $SD$ nên $MN\parallel AD$. Trong $\triangle ABC$, $P$ và $O$ là trung điểm của $AB$ và $AC$ nên $PO\parallel BC$, suy ra $PO\parallel AD$.

Do đó $PO\parallel MN$. Hai đường thẳng song song $PO$ và $MN$ cùng nằm trong một mặt phẳng, mặt phẳng đó chứa $O$ và $MN$ nên là $(OMN)$. Vậy $P\in(OMN)$.

Lại có $Q\in ON\subset(OMN)$ nên $PQ\subset(OMN)$. Theo ý a, $(OMN)\parallel(SBC)$ nên $PQ\parallel(SBC)$.

Tiếp theo, $OM\parallel SC$ với $SC\subset(SCD)$. Trong $\triangle SBD$, $R$ và $O$ là trung điểm của $SB$ và $BD$ nên $OR\parallel SD$, với $SD\subset(SCD)$.

Hai đường thẳng $OM$, $OR$ cắt nhau tại $O$, cùng nằm trong $(OMR)$ và lần lượt song song với $SC$, $SD$ là hai đường thẳng cắt nhau của $(SCD)$. Hai mặt phẳng không trùng nhau vì $O\in(ABCD)$, $(SCD)\cap(ABCD)=CD$ và $O\notin CD$ nên $O\notin(SCD)$.

Vậy $(OMR)\parallel(SCD)$.

### Câu 104 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABC$ có $M$, $N$, $P$ lần lượt là trung điểm $SA$, $SB$, $SC$.
a) Chứng minh $(MNP)\parallel(ABC)$.
b) Gọi $H$, $G$, $L$ lần lượt là trọng tâm tam giác $SAB$, $SAC$, $SBC$. Chứng minh $(HGL)\parallel(MNP)$.
**Hình giải:** giai_P10C104.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** các cặp cạnh của hai tam giác $MNP$ và $HGL$ đều song song với các cạnh tương ứng của tam giác $ABC$, nên dùng dấu hiệu hai mặt phẳng song song cho từng cặp mặt phẳng.

**Bước 1.** Ý a: dùng đường trung bình của các tam giác $SAB$ và $SBC$ để tìm hai đường thẳng của $(MNP)$ song song với hai cạnh của $(ABC)$.

**Bước 2.** Ý a: kết luận $(MNP)\parallel(ABC)$ bằng dấu hiệu hai mặt phẳng song song, kiểm tra hai mặt phẳng phân biệt.

**Bước 3.** Ý b: gọi $E$, $F$, $K$ là trung điểm $AB$, $AC$, $BC$, đặt $H$, $G$, $L$ lên các trung tuyến $SE$, $SF$, $SK$ rồi dùng định lí Thales đảo để tìm các đường thẳng song song với cạnh của $(ABC)$.

**Bước 4.** Ý b: so sánh các đường thẳng này với các cạnh của tam giác $MNP$, chứng minh $(HGL)\parallel(MNP)$ và hai mặt phẳng không trùng nhau.

**Phần 2. Trình bày**

a) Trong $\triangle SAB$, $M$ và $N$ là trung điểm của $SA$ và $SB$ nên $MN\parallel AB$. Trong $\triangle SBC$, $N$ và $P$ là trung điểm của $SB$ và $SC$ nên $NP\parallel BC$.

Hai đường thẳng $MN$, $NP$ cắt nhau tại $N$, cùng nằm trong $(MNP)$ và lần lượt song song với $AB$, $BC$ là hai đường thẳng cắt nhau của $(ABC)$. Hai mặt phẳng không trùng nhau vì $M\in SA$, $M\neq A$ nên $M\notin(ABC)$.

Vậy $(MNP)\parallel(ABC)$.

b) Gọi $E$, $F$, $K$ lần lượt là trung điểm của $AB$, $AC$, $BC$. Vì $H$, $G$, $L$ là trọng tâm các tam giác $SAB$, $SAC$, $SBC$ nên $H\in SE$, $G\in SF$, $L\in SK$ và $\dfrac{SH}{SE}=\dfrac{SG}{SF}=\dfrac{SL}{SK}=\dfrac{2}{3}$.

Trong $\triangle SEF$ có $\dfrac{SH}{SE}=\dfrac{SG}{SF}$ nên $HG\parallel EF$. Mà $EF\parallel BC$ (đường trung bình của $\triangle ABC$) và $NP\parallel BC$ nên $HG\parallel NP$.

Trong $\triangle SEK$ có $\dfrac{SH}{SE}=\dfrac{SL}{SK}$ nên $HL\parallel EK$. Mà $EK\parallel AC$ (đường trung bình của $\triangle ABC$) và $MP\parallel AC$ (đường trung bình của $\triangle SAC$) nên $HL\parallel MP$.

Hai đường thẳng $HG$, $HL$ cắt nhau tại $H$, cùng nằm trong $(HGL)$ và lần lượt song song với $NP$, $MP$ là hai đường thẳng cắt nhau của $(MNP)$ nên $(HGL)\parallel(MNP)$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau: gọi $I$ là giao điểm của $SE$ với $MN$ (là trung điểm của $SE$). Nếu $H\in(MNP)$ thì đường thẳng $SE$ có hai điểm phân biệt $H$, $I$ thuộc $(MNP)$, suy ra $S\in(MNP)$. Khi đó $(MNP)$ chứa $S$ và $M$, $N$, $P$ nên chứa các đường $SA$, $SB$, $SC$, tức là chứa $A$, $B$, $C$ và $S$, vô lí. Vậy $H\notin(MNP)$.

Do đó $(HGL)\parallel(MNP)$.

### Câu 105 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hai hình vuông $ABCD$ và $ABEF$ ở trong hai mặt phẳng phân biệt. Trên các đường chéo $AC$ và $BF$ lần lượt lấy các điểm $M$, $N$ sao cho $AM=BN$. Các đường thẳng song song với $AB$ vẽ từ $M$, $N$ lần lượt cắt $AD$ và $AF$ tại $M'$ và $N'$. Chứng minh:
a) $(ADF)\parallel(BCE)$.
b) $(DEF)\parallel(MM'N'N)$.
**Hình giải:** giai_P10C105.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai hình vuông có chung cạnh $AB$ nên có đường chéo bằng nhau, từ đó các tỉ số $\dfrac{AM}{AC}$ và $\dfrac{BN}{BF}$ bằng nhau và dẫn tới hai cặp đường thẳng song song giữa hai mặt phẳng.

**Bước 1.** Ý a: chỉ ra các cặp cạnh $AD\parallel BC$ và $AF\parallel BE$ nhờ tính chất hình vuông, rồi dùng dấu hiệu hai mặt phẳng song song cho $(ADF)$ và $(BCE)$.

**Bước 2.** Ý b: chứng minh $AC=BF$ rồi suy ra tỉ số $\dfrac{AM}{AC}=\dfrac{BN}{BF}$ từ giả thiết $AM=BN$.

**Bước 3.** Ý b: dùng định lí Thales trong các tam giác $ACD$ và $FAB$ để chuyển hai tỉ số trên thành các tỉ số $\dfrac{AM'}{AD}$ và $\dfrac{AN'}{AF}$, rồi suy ra $M'N'\parallel DF$.

**Bước 4.** Ý b: chỉ ra $MM'\parallel EF$, dùng dấu hiệu hai mặt phẳng song song cho $(MM'N'N)$ và $(DEF)$, kiểm tra hai mặt phẳng phân biệt.

**Phần 2. Trình bày**

a) Vì $ABCD$ và $ABEF$ là hình vuông nên $AD\parallel BC$ và $AF\parallel BE$.

Hai đường thẳng $AD$, $AF$ cắt nhau tại $A$ và nằm trong $(ADF)$; chúng lần lượt song song với $BC$, $BE$ là hai đường thẳng cắt nhau của $(BCE)$. Hai mặt phẳng không trùng nhau vì $A\in(ABCD)$ và $(BCE)\cap(ABCD)=BC$, mà $A\notin BC$ nên $A\notin(BCE)$.

Vậy $(ADF)\parallel(BCE)$.

b) Hai hình vuông có chung cạnh $AB$ nên có cùng độ dài cạnh, suy ra các đường chéo $AC=BF$. Mà $AM=BN$ nên $\dfrac{AM}{AC}=\dfrac{BN}{BF}$.

Trong $\triangle ACD$ có $MM'\parallel CD$ (vì $MM'\parallel AB\parallel CD$) nên $\dfrac{AM'}{AD}=\dfrac{AM}{AC}$.

Trong $\triangle FAB$ có $NN'\parallel AB$ nên $\dfrac{FN'}{FA}=\dfrac{FN}{FB}$, suy ra $\dfrac{AN'}{AF}=\dfrac{BN}{BF}$.

Do đó $\dfrac{AM'}{AD}=\dfrac{AN'}{AF}$. Trong $\triangle ADF$, suy ra $M'N'\parallel DF$, mà $DF\subset(DEF)$.

Vì $MM'\parallel AB$ và $AB\parallel EF$ (do $ABEF$ là hình vuông) nên $MM'\parallel EF$, mà $EF\subset(DEF)$. Ngoài ra $MM'\parallel NN'$ (cùng song song với $AB$) nên bốn điểm $M$, $M'$, $N'$, $N$ đồng phẳng.

Hai đường thẳng $MM'$, $M'N'$ cắt nhau tại $M'$, cùng nằm trong $(MM'N'N)$ và lần lượt song song với $EF$, $DF$ là hai đường thẳng cắt nhau của $(DEF)$. Hai mặt phẳng không trùng nhau vì đường thẳng $AD$ chỉ cắt $(DEF)$ tại $D$ (do $A\notin(DEF)$), còn $M'\in AD$, $M'\neq D$ (khi $M\neq C$).

Vậy $(DEF)\parallel(MM'N'N)$.

### Câu 106 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình hộp $ABCD{.}A'B'C'D'$. Gọi $G$, $H$, $K$ lần lượt là trọng tâm các tam giác $ABC$, $BCD$, $A'AD'$. Chứng minh rằng $(GHK)\parallel(A'BCD')$.
**Hình giải:** giai_P10C106.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** gọi $I$ là trung điểm của $BC$ và $Q$ là trung điểm của $A'D'$; các trọng tâm $G$, $H$ chia các trung tuyến $AI$, $DI$ theo cùng một tỉ số và $K$ nằm trên trung tuyến $AQ$.

**Bước 1.** Đặt $G$ trên $AI$, $H$ trên $DI$ theo tính chất trọng tâm rồi dùng định lí Thales đảo trong tam giác $IAD$ để tìm đường thẳng $GH$ song song với một cạnh của mặt phẳng $(A'BCD')$.

**Bước 2.** Đặt $K$ trên trung tuyến $AQ$ của tam giác $A'AD'$, so sánh tỉ số $\dfrac{AG}{AI}$ với $\dfrac{AK}{AQ}$ rồi suy ra $GK$ song song với $IQ$.

**Bước 3.** Chứng minh tứ giác $BIQA'$ là hình bình hành để suy ra $IQ$ song song với $A'B$, từ đó tìm đường thẳng $GK$ song song với một cạnh của mặt phẳng $(A'BCD')$.

**Bước 4.** Dùng dấu hiệu hai mặt phẳng song song cho $(GHK)$ và $(A'BCD')$ và loại trường hợp hai mặt phẳng trùng nhau.

**Phần 2. Trình bày**

Vì $A'D'\parallel AD\parallel BC$ nên bốn điểm $A'$, $D'$, $C$, $B$ cùng thuộc một mặt phẳng, đó là $(A'BCD')$.

Gọi $I$ là trung điểm của $BC$ và $Q$ là trung điểm của $A'D'$.

Vì $G$ là trọng tâm $\triangle ABC$ nên $G\in AI$ và $\dfrac{IG}{IA}=\dfrac{1}{3}$. Vì $H$ là trọng tâm $\triangle BCD$ nên $H\in DI$ và $\dfrac{IH}{ID}=\dfrac{1}{3}$.

Trong $\triangle IAD$ có $\dfrac{IG}{IA}=\dfrac{IH}{ID}$ nên $GH\parallel AD$. Mà $AD\parallel BC$ nên $GH\parallel BC$, với $BC\subset(A'BCD')$.

Vì $K$ là trọng tâm $\triangle A'AD'$ nên $K\in AQ$ và $\dfrac{AK}{AQ}=\dfrac{2}{3}$. Lại có $\dfrac{AG}{AI}=\dfrac{2}{3}$.

Trong $\triangle AIQ$ có $\dfrac{AG}{AI}=\dfrac{AK}{AQ}$ nên $GK\parallel IQ$.

Ta có $BI=\dfrac{1}{2}BC$, $A'Q=\dfrac{1}{2}A'D'$ và $BC\parallel A'D'$, $BC=A'D'$ nên $BI\parallel A'Q$ và $BI=A'Q$ (hai đoạn cùng hướng). Suy ra $BIQA'$ là hình bình hành, do đó $IQ\parallel A'B$. Vậy $GK\parallel A'B$, với $A'B\subset(A'BCD')$.

Hai đường thẳng $GH$, $GK$ cắt nhau tại $G$, cùng nằm trong $(GHK)$ và lần lượt song song với $BC$, $A'B$ là hai đường thẳng cắt nhau của $(A'BCD')$ nên $(GHK)\parallel(A'BCD')$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau: nếu trùng thì $G\in(A'BCD')\cap(ABCD)=BC$, vô lí vì $G$ nằm trong tam giác $ABC$ chứ không nằm trên $BC$.

Vậy $(GHK)\parallel(A'BCD')$.

### Câu 107 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình lăng trụ $ABC{.}A'B'C'$. Gọi $M$, $N$, $P$, $Q$ lần lượt là trung điểm các cạnh $AC$, $AA'$, $A'C'$, $BC$. Chứng minh rằng $(MNQ)\parallel(A'B'C)$.
**Hình giải:** giai_P10C107.png
**Ghi chú:** điểm $P$ (trung điểm $A'C'$) được đề nêu nhưng không dùng trong yêu cầu chứng minh.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dùng đường trung bình của hai tam giác khác nhau để tìm hai đường thẳng cắt nhau trong $(MNQ)$ lần lượt song song với hai đường thẳng của $(A'B'C)$.

**Bước 1.** Dùng đường trung bình của tam giác $ABC$ để tìm đường thẳng $MQ$ song song với $AB$, rồi nhờ tính chất lăng trụ so sánh với $A'B'$.

**Bước 2.** Dùng đường trung bình của tam giác $AA'C$ để tìm đường thẳng $MN$ song song với một cạnh của tam giác $A'B'C$.

**Bước 3.** Áp dụng dấu hiệu hai mặt phẳng song song cho $(MNQ)$ và $(A'B'C)$ và kiểm tra hai mặt phẳng không trùng nhau.

**Phần 2. Trình bày**

Trong $\triangle ABC$, $M$ và $Q$ là trung điểm của $AC$ và $BC$ nên $MQ\parallel AB$. Vì $ABC{.}A'B'C'$ là hình lăng trụ nên $AB\parallel A'B'$. Suy ra $MQ\parallel A'B'$, với $A'B'\subset(A'B'C)$.

Trong $\triangle AA'C$, $M$ và $N$ là trung điểm của $AC$ và $AA'$ nên $MN\parallel A'C$, với $A'C\subset(A'B'C)$.

Hai đường thẳng $MQ$, $MN$ cắt nhau tại $M$, cùng nằm trong $(MNQ)$ và lần lượt song song với $A'B'$, $A'C$ là hai đường thẳng cắt nhau của $(A'B'C)$ nên $(MNQ)\parallel(A'B'C)$ hoặc trùng nhau.

Hai mặt phẳng không trùng nhau: nếu $M\in(A'B'C)$ thì đường thẳng $AC$ có hai điểm $M$, $C$ thuộc $(A'B'C)$ nên $A\in(A'B'C)$. Khi đó đường thẳng qua $A$ song song với $A'B'$ cũng nằm trong mặt phẳng này, tức là $AB\subset(A'B'C)$. Mặt phẳng này chứa $A$, $B$, $C$ nên trùng $(ABC)$, mà lại chứa $A'$, vô lí.

Vậy $(MNQ)\parallel(A'B'C)$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Khúc này gồm 17 câu tự luận hình học không gian (Câu 91 đến Câu 107), toàn bộ `kho=hinh_hoc`, tất cả có hình giải vẽ bằng code, đã kiểm toạ độ số các quan hệ song song, trung điểm, trọng tâm chính dùng trong lời giải.
- Câu 102: đề sai ở câu dẫn ($Sx$ là giao tuyến của $(SAD)$ và $(SBD)$ thực ra là $SD$, không dùng ở yêu cầu). Đã giải yêu cầu chính theo giao tuyến của $(SAD)$ và $(SBC)$. Cần CEO xem có muốn sửa chữ đề không.
- Câu 107: điểm $P$ có trong đề nhưng không dùng.
- Các câu nhiều ý có dữ kiện chung (Câu 94, 95, 103, 104, 105) giữ nguyên thành một câu.
- Nhiều chỗ lời giải thêm một câu chứng minh hai mặt phẳng phân biệt (để dấu hiệu hai mặt phẳng song song dùng đúng); nếu lớp chỉ cần mức SGK thì có thể rút gọn.
