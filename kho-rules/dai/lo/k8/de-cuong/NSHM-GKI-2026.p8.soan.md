# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | IV. Hình học | tu_luan

### Bài 13 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chữ nhật $ABCD$ có $AD<AB$. Gọi $M,\ N$ lần lượt là trung điểm của $AD,\ BC$.
a) Chứng minh $ABNM$ là hình chữ nhật.
b) Qua $B$ kẻ đường thẳng vuông góc với $BM$ cắt tia $DC$ tại $K$. Trên đoạn $DC$ lấy điểm $P$ sao cho $DP=CK$. Chứng minh tứ giác $APKB$ là hình bình hành.
c) Kẻ $KH$ vuông góc với đường thẳng $AB$ tại $H$. Chứng minh $AN$ vuông góc với $HC$.
**Hình giải:** giai_bai13.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** cả ba ý đều xuất phát từ hình chữ nhật $ABNM$ và điều kiện $BK\perp BM$; ý b quy về so sánh $PK$ với $AB$, ý c quy về việc cộng hai góc nhọn được $90^\circ$ nhờ các tam giác vuông bằng nhau.

**Bước 1.** Ý a: muốn $ABNM$ là hình chữ nhật, cần nó là hình bình hành có một góc vuông; cặp cạnh đối $AM$ và $BN$ vừa song song vừa bằng nhau vì mỗi đoạn là một nửa của hai cạnh đối $AD$, $BC$ của hình chữ nhật $ABCD$.

**Bước 2.** Ý b: muốn $APKB$ là hình bình hành, cần $PK$ song song và bằng $AB$; vì $AB\parallel DC$ nên chỉ cần $PK=DC$, mà điều đó đòi hỏi biết thứ tự các điểm $D$, $P$, $C$, $K$ trên đường thẳng, nên trước hết phải chứng minh $K$ nằm ngoài đoạn $DC$ từ điều kiện $BK\perp BM$.

**Bước 3.** Ý b: khi $C$ nằm giữa $D$ và $K$, cộng đoạn thẳng để có $PK=PC+CK$, rồi thay $CK=DP$ để so sánh $PK$ với $DC$ và với $AB$.

**Bước 4.** Ý c: muốn $AN\perp HC$, gọi $Q$ là giao điểm của chúng; cần $\widehat{QAH}+\widehat{QHA}=90^\circ$, tức $\widehat{BAN}+\widehat{BHC}=90^\circ$, nên phải tìm các góc bằng $\widehat{BAN}$ rồi ghép với góc nhọn của tam giác vuông $HKC$.

**Bước 5.** Ý c: chuyển $\widehat{BAN}$ sang $\widehat{ABM}$ nhờ hai tam giác vuông $ABN$ và $BAM$ bằng nhau, sang $\widehat{CBK}$ vì cùng phụ với $\widehat{MBC}$, rồi sang $\widehat{CHK}$ nhờ hai tam giác vuông $KBC$ và $CHK$ bằng nhau (chung cạnh $KC$ và $HK=BC$).

**Chú ý:** ở ý b, nếu bỏ qua việc chứng minh $C$ nằm giữa $D$ và $K$ thì phép cộng $PK=PC+CK$ chưa có cơ sở; đây là chỗ dễ bị bỏ sót.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình chữ nhật nên $AD\parallel BC$ và $AD=BC$.

Vì $M$ là trung điểm của $AD$ nên $AM=\dfrac{1}{2}AD$; vì $N$ là trung điểm của $BC$ nên $BN=\dfrac{1}{2}BC$. Mà $AD=BC$ nên $AM=BN$.

Vì $M\in AD$, $N\in BC$ và $AD\parallel BC$ nên $AM\parallel BN$.

Tứ giác $ABNM$ có $AM\parallel BN$ và $AM=BN$ nên $ABNM$ là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $ABNM$ có $\widehat{MAB}=\widehat{DAB}=90^\circ$ nên $ABNM$ là hình chữ nhật (dấu hiệu nhận biết).

b) Vì $BK\perp BM$ nên $\widehat{MBK}=90^\circ$.

Giả sử $K$ thuộc đoạn $DC$. Vì $M$ nằm giữa $A$ và $D$ nên $\widehat{ABM}<\widehat{ABD}$; vì $K$ thuộc đoạn $DC$ nên $\widehat{ABD}\le\widehat{ABK}\le\widehat{ABC}=90^\circ$. Suy ra tia $BM$ nằm giữa hai tia $BA$, $BK$ và $\widehat{MBK}=\widehat{ABK}-\widehat{ABM}<90^\circ$, mâu thuẫn với $\widehat{MBK}=90^\circ$.

Vậy $K$ không thuộc đoạn $DC$. Mà $K$ thuộc tia $DC$ nên $C$ nằm giữa $D$ và $K$.

Vì $P$ thuộc đoạn $DC$ và $C$ nằm giữa $D$ và $K$ nên $PK=PC+CK$.

Mà $CK=DP$ nên $PK=PC+DP=DC$ (vì $P$ nằm giữa $D$ và $C$).

Lại có $DC=AB$ (hai cạnh đối của hình chữ nhật $ABCD$) nên $PK=AB$.

Vì $P$, $K$ thuộc đường thẳng $DC$ và $DC\parallel AB$ nên $PK\parallel AB$.

Tứ giác $APKB$ có $PK\parallel AB$ và $PK=AB$ nên $APKB$ là hình bình hành (dấu hiệu nhận biết).

c) Vì $KH\perp AB$ và $BC\perp AB$ nên $KH\parallel BC$. Vì $H\in AB$, $K\in DC$ và $AB\parallel DC$ nên $BH\parallel CK$.

Tứ giác $BCKH$ có hai cặp cạnh đối song song nên là hình bình hành, suy ra $HK=BC$. Vì $K$ nằm sau $C$ trên tia $DC$ nên $H$ nằm trên tia $AB$ ở phía sau $B$.

Vì $BC\perp DC$ nên $\widehat{BCK}=90^\circ$. Vì $KH\perp AB$ và $AB\parallel DC$ nên $KH\perp DC$, do đó $\widehat{HKC}=90^\circ$.

Xét $\triangle KBC$ và $\triangle CHK$ có:

$KC$ chung;

$\widehat{BCK}=\widehat{HKC}=90^\circ$;

$BC=HK$.

Do đó $\triangle KBC=\triangle CHK$ (c.g.c), suy ra $\widehat{KBC}=\widehat{CHK}$ (1).

Xét $\triangle ABN$ và $\triangle BAM$ có:

$AB$ chung;

$\widehat{ABN}=\widehat{BAM}=90^\circ$ (vì $ABNM$ là hình chữ nhật);

$BN=AM$ (câu a).

Do đó $\triangle ABN=\triangle BAM$ (c.g.c), suy ra $\widehat{BAN}=\widehat{ABM}$ (2).

Vì tia $BM$ nằm trong góc $ABC$ nên $\widehat{ABM}+\widehat{MBC}=\widehat{ABC}=90^\circ$.

Vì $M$ thuộc cạnh $AD$ và $C$ nằm giữa $D$ và $K$ nên $M$, $K$ nằm khác phía đối với đường thẳng $BC$ và cùng phía với $C$ đối với đường thẳng $AB$, do đó tia $BC$ nằm giữa hai tia $BM$, $BK$. Suy ra $\widehat{MBC}+\widehat{CBK}=\widehat{MBK}=90^\circ$.

Suy ra $\widehat{ABM}=\widehat{CBK}$ (3).

Từ (1), (2), (3) ta có $\widehat{BAN}=\widehat{ABM}=\widehat{CBK}=\widehat{CHK}$.

Tam giác $HKC$ vuông tại $K$ nên $\widehat{CHK}+\widehat{HCK}=90^\circ$.

Vì $BH\parallel CK$ nên $\widehat{BHC}=\widehat{HCK}$ (so le trong).

Do đó $\widehat{BAN}+\widehat{BHC}=\widehat{CHK}+\widehat{HCK}=90^\circ$.

Vì $N$ và $C$ nằm cùng phía đối với đường thẳng $AB$ và tổng hai góc $\widehat{NAH}+\widehat{CHA}=90^\circ<180^\circ$ nên $AN$ cắt $HC$; gọi $Q$ là giao điểm.

Tam giác $AQH$ có $\widehat{QAH}+\widehat{QHA}=\widehat{BAN}+\widehat{BHC}=90^\circ$ nên $\widehat{AQH}=180^\circ-90^\circ=90^\circ$.

Vậy $AN\perp HC$.

### Bài 14 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Từ $H$ kẻ các đường thẳng $HM\perp AB\ (M\in AB)$, $HN\perp AC\ (N\in AC)$. Gọi $O$ là giao điểm của $AH$ và $MN$.
a) Chứng minh tứ giác $AMHN$ là hình chữ nhật.
b) Trên tia $NC$ lấy điểm $P$ sao cho $AN=PN$. Gọi $I$ là giao điểm của $MP$ và $HN$. Chứng minh rằng tứ giác $HMNP$ là hình bình hành và $OI=\dfrac{1}{2}AN$.
c) Qua $C$ kẻ đường thẳng song song với $AH$ và cắt đường thẳng $MH$ tại điểm $E$, cắt đường thẳng $MN$ tại điểm $F$. Hỏi tam giác $ABC$ cần thêm điều kiện gì để tam giác $MFE$ là tam giác vuông cân?
**Hình giải:** giai_bai14.png
**Chưa chắc:** ý b, hệ thức OI = 1/2 AN có dữ kiện đúng là bài đường trung bình (O, I là trung điểm hai cạnh MN, HN của tam giác MNH), lời giải tự chứng minh bằng hai hình bình hành — CEO quyết có cho dùng đường trung bình ở đề cương này không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hình chữ nhật $AMHN$ mở ra mọi ý: ý a cần bốn góc vuông, ý b dùng cạnh đối và đường chéo của nó, ý c hỏi khi nào hai đường chéo $AH$, $MN$ của nó vuông góc.

**Bước 1.** Ý a: muốn $AMHN$ là hình chữ nhật, cần tứ giác có bốn góc vuông; ba góc ở $A$, $M$, $N$ vuông theo giả thiết, góc thứ tư suy ra từ tổng các góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $HMNP$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn $HM$ và $NP$, vì $HM$ song song và bằng $AN$ (cạnh đối của hình chữ nhật $AMHN$) còn $AN$ nằm trên $AC$ và bằng $NP$ theo đề.

**Bước 3.** Ý b: $O$ là trung điểm của $MN$ (đường chéo hình chữ nhật) và $I$ là trung điểm của $HN$ (đường chéo hình bình hành), nên $OI$ nối trung điểm hai cạnh của tam giác $MNH$ và bằng nửa $MH$, mà $MH=AN$; bài này chưa được dùng đường trung bình nên ta tự chứng minh.

**Bước 4.** Ý b: lấy $T$ sao cho $I$ là trung điểm của $OT$, rồi chứng minh lần lượt $ONTH$ và $MOTH$ là hình bình hành để suy ra $OT=MH$ và $OI=\dfrac{1}{2}OT$.

**Bước 5.** Ý c: muốn tam giác $MFE$ vuông cân, trước hết tìm đỉnh có thể là góc vuông: góc tại $M$ và góc tại $E$ đều liên quan đến một góc nhọn của tam giác vuông ($MHN$ hoặc $AMH$) nên không thể vuông, chỉ còn đỉnh $F$.

**Bước 6.** Ý c: góc ở $F$ vuông khi $MN\perp EF$ mà $EF\parallel AH$, tức hai đường chéo của hình chữ nhật $AMHN$ vuông góc; từ đó suy ra hình dạng của $AMHN$, rồi của tam giác $ABC$, và cuối cùng phải kiểm tra lại điều kiện tìm được thật sự cho tam giác cân.

**Chú ý:** không viết "$OI$ là đường trung bình của tam giác $MNH$" vì đường trung bình học ở chương sau; ở ý c phải kiểm tra cả chiều ngược lại (điều kiện đủ), không chỉ suy ra điều kiện cần.

**Phần 2. Trình bày**

a) Xét tứ giác $AMHN$ có:

$\widehat{MAN}=90^\circ$ (tam giác $ABC$ vuông tại $A$);

$\widehat{AMH}=90^\circ$ (vì $HM\perp AB$);

$\widehat{ANH}=90^\circ$ (vì $HN\perp AC$).

Tổng các góc của tứ giác bằng $360^\circ$ nên $\widehat{MHN}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$.

Tứ giác $AMHN$ có bốn góc vuông nên là hình chữ nhật.

b) Vì $AMHN$ là hình chữ nhật (câu a) nên $HM\parallel AN$ và $HM=AN$.

Mà $P$, $N$ thuộc đường thẳng $AC$ nên $HM\parallel NP$.

Vì $AN=PN$ nên $HM=NP$.

Tứ giác $HMNP$ có $HM\parallel NP$ và $HM=NP$ nên là hình bình hành (dấu hiệu nhận biết).

Vì $HMNP$ là hình bình hành nên hai đường chéo $HN$ và $MP$ cắt nhau tại trung điểm của mỗi đường. Mà $I$ là giao điểm của $MP$ và $HN$ nên $I$ là trung điểm của $HN$.

Vì $AMHN$ là hình chữ nhật nên hai đường chéo $AH$ và $MN$ cắt nhau tại trung điểm của mỗi đường. Mà $O$ là giao điểm của $AH$ và $MN$ nên $O$ là trung điểm của $MN$.

Trên tia $OI$ lấy điểm $T$ sao cho $I$ là trung điểm của $OT$.

Tứ giác $ONTH$ có hai đường chéo $OT$ và $NH$ cắt nhau tại $I$ là trung điểm của mỗi đường nên $ONTH$ là hình bình hành, suy ra $HT\parallel ON$ và $HT=ON$.

Vì $O$ là trung điểm của $MN$ nên $M$, $O$, $N$ thẳng hàng và $OM=ON$. Do đó $HT\parallel OM$ và $HT=OM$.

Tứ giác $MOTH$ có $HT\parallel OM$ và $HT=OM$ nên là hình bình hành, suy ra $OT=MH$.

Mà $MH=AN$ nên $OT=AN$.

Vì $I$ là trung điểm của $OT$ nên $OI=\dfrac{1}{2}OT=\dfrac{1}{2}AN$.

c) Vì $E\in MH$ nên đường thẳng $EM$ trùng đường thẳng $MH$; vì $F\in MN$ nên đường thẳng $FM$ trùng đường thẳng $MN$.

Tam giác $MHN$ vuông tại $H$ (câu a) nên $\widehat{NMH}<90^\circ$; do đó $\widehat{FME}$ bằng $\widehat{NMH}$ hoặc bù với $\widehat{NMH}$, nên $\widehat{FME}\ne 90^\circ$.

Tam giác $AMH$ vuông tại $M$ nên $\widehat{AHM}<90^\circ$. Vì $EF\parallel AH$ nên $\widehat{MEF}$ bằng $\widehat{AHM}$ hoặc bù với $\widehat{AHM}$, do đó $\widehat{MEF}\ne 90^\circ$.

Vậy nếu tam giác $MFE$ vuông thì chỉ có thể vuông tại $F$.

Điều kiện cần. Giả sử tam giác $MFE$ vuông cân. Khi đó $\widehat{MFE}=90^\circ$ nên $MN\perp EF$. Mà $EF\parallel AH$ nên $MN\perp AH$.

Hình chữ nhật $AMHN$ có hai đường chéo $AH$ và $MN$ vuông góc nên là hình vuông (dấu hiệu nhận biết).

Do đó $AH$ là tia phân giác của góc $MAN$, tức $\widehat{BAH}=\widehat{CAH}=45^\circ$.

Tam giác $ABH$ vuông tại $H$ có $\widehat{BAH}=45^\circ$ nên $\widehat{B}=90^\circ-45^\circ=45^\circ$. Tam giác $ABC$ vuông tại $A$ nên $\widehat{C}=90^\circ-45^\circ=45^\circ$.

Vì $\widehat{B}=\widehat{C}$ nên tam giác $ABC$ cân tại $A$, tức $AB=AC$.

Điều kiện đủ. Giả sử $AB=AC$. Tam giác $ABC$ cân tại $A$ có $AH$ là đường cao nên $AH$ là tia phân giác của góc $BAC$, suy ra $\widehat{MAH}=45^\circ$.

Tam giác $AMH$ vuông tại $M$ có $\widehat{MAH}=45^\circ$ nên $\widehat{AHM}=45^\circ$, do đó $MA=MH$.

Hình chữ nhật $AMHN$ có hai cạnh kề $MA=MH$ nên là hình vuông, suy ra $AH\perp MN$ và $\widehat{NMH}=45^\circ$.

Vì $EF\parallel AH$ và $AH\perp MN$ nên $EF\perp MN$ tại $F$, tức $\widehat{MFE}=90^\circ$.

Trong tam giác $MFE$ vuông tại $F$ có $\widehat{FME}<90^\circ$ mà $\widehat{FME}$ bằng $45^\circ$ hoặc $135^\circ$ nên $\widehat{FME}=45^\circ$. Suy ra $\widehat{MEF}=90^\circ-45^\circ=45^\circ$.

Tam giác $MFE$ có $\widehat{FME}=\widehat{MEF}$ nên $FM=FE$. Vậy tam giác $MFE$ vuông cân tại $F$.

Vậy tam giác $ABC$ cần thêm điều kiện $AB=AC$, tức tam giác $ABC$ vuông cân tại $A$.

### Bài 15 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ $(AB>AC)$. Gọi $M$ là trung điểm cạnh $BC$, trên tia đối của tia $MA$ lấy điểm $D$ sao cho $MD=MA$.
a) Chứng minh tứ giác $ABDC$ là hình chữ nhật và $AM=\dfrac{1}{2}BC$.
b) Gọi $E$ là chân đường vuông góc hạ từ $D$ xuống $BC$, lấy điểm $F$ sao cho $E$ là trung điểm của $FD$. Chứng minh $CF=AB$ và $AF$ vuông góc với $FD$.
c) Qua $F$ kẻ các đường thẳng vuông góc với các đường thẳng $AB$ và $AC$ lần lượt tại $H$ và $K$. Chứng minh $H,\ K,\ E$ thẳng hàng.
**Hình giải:** giai_bai15.png
**Chưa chắc:** ý c, bước chứng minh OE song song AD (O, E là trung điểm AF, FD của tam giác AFD) có dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh bằng hình bình hành — CEO quyết có cho dùng đường trung bình ở đề cương này không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $E$ là trung điểm của $FD$ và $DE\perp BC$ nên $BC$ là đường trung trực của $FD$; từ đó $C$ và $M$ cách đều $F$, $D$ — đây là chìa khoá của ý b và là nền của ý c.

**Bước 1.** Ý a: muốn $ABDC$ là hình chữ nhật, cần nó là hình bình hành có một góc vuông; hai đường chéo $AD$, $BC$ cắt nhau tại $M$ là trung điểm của cả hai đường nên là hình bình hành, góc $A$ vuông có sẵn; sau đó dùng tính chất hai đường chéo bằng nhau để so $AM$ với $BC$.

**Bước 2.** Ý b: muốn $CF=AB$, nhận ra $CF=CD$ nhờ $BC$ là đường trung trực của $FD$, rồi $CD=AB$ là hai cạnh đối của hình chữ nhật $ABDC$.

**Bước 3.** Ý b: muốn $AF\perp FD$, xét tam giác $AFD$ có trung tuyến $FM$; $MF=MD$ vì $M$ cũng nằm trên đường trung trực $BC$, mà $MD=\dfrac{1}{2}AD$, nên trung tuyến bằng nửa cạnh tương ứng thì tam giác vuông.

**Bước 4.** Ý c: muốn $H$, $K$, $E$ thẳng hàng, gọi $O$ là tâm hình chữ nhật $AHFK$ rồi chứng minh hai đường thẳng $HK$, $OE$ cùng đi qua $O$ và cùng song song với $AD$ nên trùng nhau.

**Bước 5.** Ý c: để có $HK\parallel AD$, đưa về hai góc so le trong bằng nhau: $AF\parallel BC$ (cùng vuông góc $FD$) cho $\widehat{FAB}=\widehat{ABC}$, $MA=MB$ cho $\widehat{DAB}=\widehat{ABC}$, và $OA=OH$ cho $\widehat{AHK}=\widehat{FAB}$.

**Bước 6.** Ý c: để có $OE\parallel AD$, bài này chưa được dùng đường trung bình nên tự chứng minh: tam giác $MAF$ cân có $MO\perp AF$, từ đó $MOFE$ rồi $AOEM$ là hình bình hành.

**Chú ý:** điều kiện $AB>AC$ bảo đảm $E$ khác $M$; nếu $AB=AC$ thì $F$ trùng $A$ và hệ thức $AF\perp FD$ ở ý b mất nghĩa.

**Phần 2. Trình bày**

a) Vì $M$ là trung điểm của $BC$ nên $MB=MC$. Vì $D$ thuộc tia đối của tia $MA$ và $MD=MA$ nên $M$ là trung điểm của $AD$.

Tứ giác $ABDC$ có hai đường chéo $AD$ và $BC$ cắt nhau tại $M$ là trung điểm của mỗi đường nên $ABDC$ là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $ABDC$ có $\widehat{BAC}=90^\circ$ nên $ABDC$ là hình chữ nhật (dấu hiệu nhận biết).

Vì $ABDC$ là hình chữ nhật nên hai đường chéo bằng nhau: $AD=BC$.

Mà $AM=\dfrac{1}{2}AD$ (vì $M$ là trung điểm của $AD$) nên $AM=\dfrac{1}{2}BC$.

b) Vì $DE\perp BC$ tại $E$ và $E$ là trung điểm của $FD$ nên $BC$ là đường trung trực của đoạn thẳng $FD$.

Vì $C$ thuộc $BC$ nên $CF=CD$ (tính chất đường trung trực).

Vì $ABDC$ là hình chữ nhật nên $CD=AB$ (hai cạnh đối). Vậy $CF=AB$.

Vì $M$ thuộc $BC$ nên $MF=MD$ (tính chất đường trung trực).

Mà $MD=\dfrac{1}{2}AD$ (vì $M$ là trung điểm của $AD$) nên $MF=\dfrac{1}{2}AD$.

Tam giác $AFD$ có đường trung tuyến $FM$ bằng nửa cạnh $AD$ nên tam giác $AFD$ vuông tại $F$.

Vậy $AF\perp FD$.

c) Tứ giác $AHFK$ có $\widehat{HAK}=90^\circ$ (vì $AB\perp AC$), $\widehat{AHF}=90^\circ$ (vì $FH\perp AB$), $\widehat{AKF}=90^\circ$ (vì $FK\perp AC$).

Tổng các góc của tứ giác bằng $360^\circ$ nên $\widehat{HFK}=90^\circ$. Tứ giác $AHFK$ có bốn góc vuông nên là hình chữ nhật.

Gọi $O$ là giao điểm của hai đường chéo $AF$ và $HK$. Khi đó $O$ là trung điểm của $AF$ và của $HK$, và $OA=OH$ (hai đường chéo của hình chữ nhật bằng nhau, cắt nhau tại trung điểm của mỗi đường).

Chứng minh $HK\parallel AD$.

Vì $AF\perp FD$ (câu b) và $BC\perp FD$ nên $AF\parallel BC$. Suy ra $\widehat{FAB}=\widehat{ABC}$ (so le trong).

Tam giác $ABC$ vuông tại $A$ có $M$ là trung điểm của $BC$ nên $MA=MB=\dfrac{1}{2}BC$ (câu a). Tam giác $MAB$ cân tại $M$ nên $\widehat{MAB}=\widehat{MBA}$. Mà $D$ thuộc tia $AM$ nên $\widehat{DAB}=\widehat{ABC}$.

Tam giác $OAH$ có $OA=OH$ nên cân tại $O$, suy ra $\widehat{OHA}=\widehat{OAH}$. Mà $O$ nằm trên $HK$ và trên $AF$ nên $\widehat{AHK}=\widehat{FAB}$.

Từ đó $\widehat{AHK}=\widehat{FAB}=\widehat{ABC}=\widehat{DAB}$.

Hai góc $\widehat{AHK}$ và $\widehat{DAB}$ ở vị trí so le trong và bằng nhau nên $HK\parallel AD$.

Chứng minh $OE\parallel AD$.

Vì $MA=MF$ (câu b) nên tam giác $MAF$ cân tại $M$. Mà $O$ là trung điểm của $AF$ nên $MO\perp AF$.

Vì $MO\perp AF$ và $FD\perp AF$ nên $MO\parallel FD$, tức $MO\parallel FE$.

Vì $M$, $E$ thuộc $BC$ và $AF\parallel BC$ nên $ME\parallel AF$, tức $ME\parallel OF$.

Tứ giác $MOFE$ có $MO\parallel FE$ và $ME\parallel OF$ nên là hình bình hành, suy ra $ME=OF$. Mà $OF=OA$ nên $ME=AO$.

Tứ giác $AOEM$ có $AO\parallel ME$ và $AO=ME$ nên là hình bình hành (dấu hiệu nhận biết). Suy ra $OE\parallel AM$, tức $OE\parallel AD$.

Qua $O$ có hai đường thẳng $HK$ và $OE$ cùng song song với $AD$ nên chúng trùng nhau (tiên đề Euclid).

Vậy ba điểm $H$, $K$, $E$ thẳng hàng.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phần này gồm 3 bài hình (Bài 13, 14, 15), cả ba là tự luận, không có câu trả lời ngắn. Khung đã đối chiếu ảnh đề cương (trang 3 và 4): chữ, số, kí hiệu khớp, không phải sửa đề.
- Hình giải đã vẽ bằng code, dựng đúng dữ kiện bằng toạ độ, mỗi bài một tệp: giai_bai13.png, giai_bai14.png, giai_bai15.png. Không vẽ điều phải chứng minh (không đánh dấu vuông góc của AN và HC, không nối HK ở Bài 15).
- Đã thử số (200 bộ ngẫu nhiên cho mỗi bài, kiểm bằng toạ độ) toàn bộ khẳng định trong lời giải: Bài 13 (K nằm sau C, PK = AB, AN vuông HC, các cặp góc bằng nhau), Bài 14 (HMNP bình hành, OI = 1/2 AN; ở ý c quét tỉ số AB/AC từ 0,05 đến 20 chỉ có AB = AC cho tam giác MFE vuông cân), Bài 15 (CF = AB, AF vuông FD, H, K, E thẳng hàng, HK song song AD, AOEM bình hành).
- CẦN CEO XEM: Bài 14 ý b và Bài 15 ý c có dữ kiện đúng là bài đường trung bình (nối hai trung điểm hai cạnh của một tam giác). Lời giải đã tự chứng minh bằng hình bình hành (không gọi tên đường trung bình), dài hơn bản dùng đường trung bình.
- Bài 13 ý b: để cộng đoạn thẳng PK = PC + CK, lời giải chứng minh trước K nằm ngoài đoạn DC (phản chứng bằng so sánh góc). Nhiều lời giải ngoài thường bỏ qua bước này.
- Bài 15 ý c: vị trí các điểm (H nằm giữa A và B, K và D khác phía đối với AB) lời giải dùng theo hình vẽ, không chứng minh chặt — đúng mức thường gặp ở lớp 8. Trạm soát đã kiểm vị trí này luôn đúng khi AB > AC (F nằm trên đường qua A song song BC, về phía B và khác phía C đối với AB, AF = 2ME < BC), nên không còn là chỗ chưa chắc. Bài 13 ý c cũng dựa vào thứ tự K, H đã chứng minh ở ý b.
- Hình giải (trạm soát bổ sung): Bài 14 thêm điểm phụ T (trung điểm PH) và đoạn OT, dời nhãn I khỏi đường MP; Bài 15 thêm tâm O của hình chữ nhật AHFK và đường chéo HK.
- Bài 14 ý c đáp: tam giác ABC vuông cân tại A (AB = AC); lời giải chứng minh cả điều kiện cần lẫn điều kiện đủ, và chỉ ra tam giác MFE không thể vuông tại M hay E.
