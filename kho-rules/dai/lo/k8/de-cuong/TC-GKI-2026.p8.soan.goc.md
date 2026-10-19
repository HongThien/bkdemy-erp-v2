# ĐỀ | Đề cương giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Thành Công, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | B2. Hình học — Tự luận (Bài 1–12) | tu_luan

### Hình Bài 2 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình bình hành $ABCD$. Gọi $E$ là trung điểm của $AB$, $F$ là trung điểm của $CD$.
a) Chứng minh: Tứ giác $AECF$ là hình bình hành.
b) $AF$ cắt $DE$ tại $M$, $BF$ cắt $CE$ tại $N$. Chứng minh: Tứ giác $EMFN$ là hình bình hành.
c) Chứng minh: $AC,\ EF,\ MN$ đồng quy.
d) Tìm điều kiện của hình bình hành $ABCD$ để tứ giác $AECF$ là hình thoi.
**Hình giải:** giai_hinh2.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** cả bốn ý đều xoay quanh các hình bình hành tạo bởi hai trung điểm $E$, $F$: ý a là mắt xích đầu tiên, các ý sau dùng lại kết quả của nó.

**Bước 1.** Ý a: muốn $AECF$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn cặp $AE$ và $CF$ vì chúng nằm trên hai cạnh đối $AB$, $CD$ của $ABCD$ và đều là một nửa cạnh (do $E$, $F$ là trung điểm).

**Bước 2.** Ý b: muốn $EMFN$ là hình bình hành, cần hai cặp cạnh đối song song; cặp $FM$, $EN$ nằm trên $AF$ và $CE$ nên lấy từ ý a, còn cặp $EM$, $FN$ nằm trên $DE$ và $BF$ nên cần thêm một hình bình hành mới là $DEBF$.

**Bước 3.** Ý b (tiếp): muốn $DEBF$ là hình bình hành, làm giống ý a với cặp cạnh đối $DF$ và $EB$, cùng song song và bằng nhau vì là hai nửa của hai cạnh đối bằng nhau.

**Bước 4.** Ý c: muốn $AC$, $EF$, $MN$ đồng quy, cần chỉ ra một điểm chung của cả ba đường; $AC$ và $EF$ là hai đường chéo của hình bình hành ở ý a, còn $EF$ và $MN$ là hai đường chéo của hình bình hành ở ý b, nên cả hai cặp đều cắt nhau tại trung điểm của $EF$.

**Bước 5.** Ý d: muốn hình bình hành $AECF$ là hình thoi, cần thêm một dấu hiệu nhận biết hình thoi; chọn "hai đường chéo vuông góc" vì $AC$ là đường chéo có sẵn của $ABCD$ nên điều kiện cần tìm sẽ nói về hình $ABCD$.

**Bước 6.** Ý d (tiếp): đường chéo $EF$ chưa thuộc $ABCD$, nên tìm xem nó song song với cạnh nào của $ABCD$ (qua một hình bình hành nữa) để đổi điều kiện về $AC$ và $EF$ thành điều kiện về $AC$ và một cạnh của $ABCD$; xét cả hai chiều để chắc điều kiện vừa đủ.

**Chú ý:** ý b và ý c không cần đường trung bình, mọi quan hệ song song đều lấy từ các hình bình hành $AECF$, $DEBF$ vừa chứng minh.

**Phần 2. Trình bày**

a) Vì $ABCD$ là hình bình hành nên $AB\parallel CD$ và $AB=CD$.

Vì $E$ là trung điểm của $AB$ nên $AE=\dfrac{1}{2}AB$.

Vì $F$ là trung điểm của $CD$ nên $CF=\dfrac{1}{2}CD$.

Mà $AB=CD$ nên $AE=CF$.

Lại có $AB\parallel CD$ nên $AE\parallel CF$.

Tứ giác $AECF$ có $AE\parallel CF$ và $AE=CF$ nên $AECF$ là hình bình hành (dấu hiệu nhận biết).

b) Vì $F$ là trung điểm của $CD$ nên $DF=\dfrac{1}{2}CD$.

Vì $E$ là trung điểm của $AB$ nên $EB=\dfrac{1}{2}AB$.

Mà $AB=CD$ nên $DF=EB$. Lại có $DF\parallel EB$ (vì $AB\parallel CD$).

Tứ giác $DEBF$ có $DF\parallel EB$ và $DF=EB$ nên $DEBF$ là hình bình hành, do đó $DE\parallel BF$.

Vì $M\in DE$ và $N\in BF$ nên $EM\parallel FN$.

Vì $AECF$ là hình bình hành (câu a) nên $AF\parallel CE$.

Vì $M\in AF$ và $N\in CE$ nên $FM\parallel EN$.

Tứ giác $EMFN$ có $EM\parallel FN$ và $FM\parallel EN$ nên $EMFN$ là hình bình hành (định nghĩa).

c) Gọi $I$ là giao điểm của $AC$ và $EF$.

Vì $AECF$ là hình bình hành (câu a) nên hai đường chéo $AC$ và $EF$ cắt nhau tại trung điểm của mỗi đường, do đó $I$ là trung điểm của $EF$.

Vì $EMFN$ là hình bình hành (câu b) nên hai đường chéo $EF$ và $MN$ cắt nhau tại trung điểm của mỗi đường, do đó $MN$ đi qua trung điểm của $EF$, tức là đi qua $I$.

Vậy $AC,\ EF,\ MN$ cùng đi qua $I$ nên chúng đồng quy.

d) Vì $E$ là trung điểm của $AB$ nên $AE=\dfrac{1}{2}AB$; vì $F$ là trung điểm của $CD$ nên $DF=\dfrac{1}{2}CD$. Mà $AB=CD$ nên $AE=DF$.

Lại có $AE\parallel DF$ (vì $AB\parallel CD$) nên tứ giác $AEFD$ là hình bình hành (dấu hiệu nhận biết), do đó $EF\parallel AD$.

Hình bình hành $AECF$ (câu a) có hai đường chéo là $AC$ và $EF$.

Nếu $AECF$ là hình thoi thì $AC\perp EF$ (tính chất hình thoi). Mà $EF\parallel AD$ nên $AC\perp AD$.

Ngược lại, nếu $AC\perp AD$ thì vì $EF\parallel AD$ nên $AC\perp EF$. Hình bình hành $AECF$ có hai đường chéo vuông góc nên $AECF$ là hình thoi (dấu hiệu nhận biết).

Vậy $AECF$ là hình thoi khi và chỉ khi $AC\perp AD$, tức là $\widehat{CAD}=90^\circ$ (cũng là $AC\perp BC$ vì $AD\parallel BC$).

### Hình Bài 3 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình bình hành $ABCD$, đường phân giác của góc $ADC$ cắt $AB$ tại $M$, phân giác của góc $ABC$ cắt $CD$ tại $N$. Chứng minh:
a) $AM=AD$.
b) Tứ giác $MBND$ là hình bình hành.
c) $AC$ đi qua trung điểm $O$ của $MN$.
d) Tứ giác $ANCM$ là hình bình hành.
**Hình giải:** giai_hinh3.png
**Chưa chắc:** đề không cho $AB>AD$ nên không rõ $M$, $N$ có nằm trong đoạn $AB$, $CD$ hay không ($AB=AD$ thì $M\equiv B$, $N\equiv D$ và $MBND$ suy biến; $AB<AD$ thì $M$, $N$ nằm ngoài đoạn); hình và lời giải làm với $AB>AD$ — CEO quyết có thêm điều kiện $AB>AD$ vào đề không (như Bài 17 của đề cương Ngôi Sao Hoàng Mai).

**Phần 1. Hướng dẫn**

**Mấu chốt:** tia phân giác kết hợp với hai đường thẳng song song luôn cho một tam giác cân, tam giác cân cho hai cạnh bằng nhau, từ đó dựng dần các hình bình hành và dùng tính chất đường chéo.

**Bước 1.** Ý a: muốn $AM=AD$, cần $\triangle AMD$ cân tại $A$, tức là cần $\widehat{ADM}=\widehat{AMD}$; góc thứ nhất bằng $\widehat{MDC}$ nhờ $DM$ là tia phân giác, góc thứ hai cũng bằng $\widehat{MDC}$ nhờ $AB\parallel CD$ (so le trong).

**Bước 2.** Ý b: muốn $MBND$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn $MB$ và $DN$, song song vì cùng nằm trên $AB$ và $CD$, còn độ dài so qua $MB=AB-AM$ và $DN=CD-CN$.

**Bước 3.** Ý b (tiếp): $AM=AD$ đã có ở ý a; để $DN$ cũng liên hệ được với $AD$, cần làm tương tự cho $\triangle CBN$ (cân tại $C$ nhờ $BN$ là tia phân giác và $AB\parallel CD$), rồi so sánh $MB$ với $DN$.

**Bước 4.** Ý c: muốn $AC$ đi qua trung điểm $O$ của $MN$, cần $O$ trùng một điểm quen thuộc nằm trên $AC$; hình bình hành $MBND$ ở ý b cho $O$ cũng là trung điểm của $BD$, mà trung điểm của $BD$ là giao điểm hai đường chéo của $ABCD$.

**Bước 5.** Ý d: muốn $ANCM$ là hình bình hành, cần hai đường chéo $AC$ và $MN$ cắt nhau tại trung điểm của mỗi đường; $O$ đã là trung điểm của $MN$ ở ý b, và theo ý c cũng là trung điểm của $AC$.

**Chú ý:** hình vẽ và lời giải lấy $AB>AD$ để $M$, $N$ nằm trong đoạn $AB$, $CD$ (phép trừ độ dài ở ý b cần điều đó).

**Phần 2. Trình bày**

a) Vì $DM$ là tia phân giác của $\widehat{ADC}$ nên $\widehat{ADM}=\widehat{MDC}$.

Vì $AB\parallel CD$ nên $\widehat{AMD}=\widehat{MDC}$ (hai góc so le trong).

Do đó $\widehat{ADM}=\widehat{AMD}$.

Tam giác $AMD$ có hai góc bằng nhau nên cân tại $A$ (dấu hiệu nhận biết tam giác cân).

Vậy $AM=AD$.

b) Vì $BN$ là tia phân giác của $\widehat{ABC}$ nên $\widehat{ABN}=\widehat{NBC}$.

Vì $AB\parallel CD$ nên $\widehat{BNC}=\widehat{ABN}$ (hai góc so le trong).

Do đó $\widehat{BNC}=\widehat{NBC}$ nên $\triangle CBN$ cân tại $C$, suy ra $CN=CB$.

Vì $ABCD$ là hình bình hành nên $CB=AD$ và $AB=CD$.

Do đó $CN=AD$. Mà $AM=AD$ (câu a) nên $AM=CN$.

Khi đó $MB=AB-AM=CD-CN=DN$.

Lại có $MB\parallel DN$ (vì $AB\parallel CD$).

Tứ giác $MBND$ có $MB\parallel DN$ và $MB=DN$ nên $MBND$ là hình bình hành (dấu hiệu nhận biết).

c) Vì $MBND$ là hình bình hành (câu b) nên hai đường chéo $MN$ và $BD$ cắt nhau tại trung điểm của mỗi đường. Do đó $O$ là trung điểm của $MN$ và cũng là trung điểm của $BD$.

Vì $ABCD$ là hình bình hành nên hai đường chéo $AC$ và $BD$ cắt nhau tại trung điểm của mỗi đường, do đó trung điểm của $BD$ cũng là trung điểm của $AC$.

Mà $O$ là trung điểm của $BD$ nên $O$ là trung điểm của $AC$.

Vậy $AC$ đi qua trung điểm $O$ của $MN$.

d) Tứ giác $ANCM$ có hai đường chéo $AC$ và $MN$.

$O$ là trung điểm của $MN$ (câu b) và $O$ là trung điểm của $AC$ (câu c) nên hai đường chéo $AC$ và $MN$ cắt nhau tại trung điểm của mỗi đường.

Vậy $ANCM$ là hình bình hành (dấu hiệu nhận biết).

### Hình Bài 4 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình thang $ABCD$ ($AB\parallel CD$), $AB=2CD$. Hai tia $AD$ và $BC$ cắt nhau tại $I$. Gọi $M,\ N$ lần lượt là trung điểm của $AB,\ CD$. Chứng minh:
a) Các tứ giác $ADCM,\ BCDM,\ CIDM$ là hình bình hành.
b) Ba điểm $M,\ N,\ I$ thẳng hàng.
**Hình giải:** giai_hinh4.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** $M$ là trung điểm của $AB$ mà $AB=2CD$ nên $AM=MB=CD$; nhờ đó hai hình bình hành đầu tiên xuất hiện từ các cạnh đáy, hình bình hành thứ ba rút ra từ hai hình đầu, và hình thứ ba cho ngay ý b.

**Bước 1.** Ý a: muốn $ADCM$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn $AM$ và $DC$, song song vì $AB\parallel CD$, bằng nhau vì $AM$ là một nửa của $AB$ mà $AB=2CD$.

**Bước 2.** Ý a (tiếp): muốn $BCDM$ là hình bình hành, làm tương tự với cặp cạnh đối $MB$ và $CD$, vì $MB$ cũng là một nửa của $AB$.

**Bước 3.** Ý a (tiếp): muốn $CIDM$ là hình bình hành, cần hai cặp cạnh đối song song; cặp $ID$, $CM$ lấy từ $AD\parallel CM$ của hình $ADCM$ (vì $I$ nằm trên đường thẳng $AD$), cặp $CI$, $DM$ lấy từ $BC\parallel DM$ của hình $BCDM$ (vì $I$ nằm trên đường thẳng $BC$).

**Bước 4.** Ý b: muốn $M$, $N$, $I$ thẳng hàng, cần $N$ là trung điểm của đoạn thẳng $IM$, vì trung điểm của một đoạn thẳng nằm trên đoạn thẳng đó.

**Bước 5.** Ý b (tiếp): $CD$ và $IM$ là hai đường chéo của hình bình hành $CIDM$ ở ý a nên cắt nhau tại trung điểm của mỗi đường; trung điểm của $CD$ chính là $N$, từ đó suy ra $N$ cũng là trung điểm của $IM$.

**Chú ý:** bài này chưa được dùng đường trung bình, nên mọi quan hệ song song và bằng nhau đều đến từ các hình bình hành $ADCM$, $BCDM$, $CIDM$.

**Phần 2. Trình bày**

a) Vì $M$ là trung điểm của $AB$ nên $AM=MB=\dfrac{1}{2}AB$.

Mà $AB=2CD$ nên $AM=MB=CD$.

Vì $AB\parallel CD$ nên $AM\parallel CD$ và $MB\parallel CD$.

Tứ giác $ADCM$ có $AM\parallel CD$ và $AM=CD$ nên $ADCM$ là hình bình hành (dấu hiệu nhận biết).

Tứ giác $BCDM$ có $MB\parallel CD$ và $MB=CD$ nên $BCDM$ là hình bình hành (dấu hiệu nhận biết).

Vì $ADCM$ là hình bình hành nên $AD\parallel CM$. Mà $I$ nằm trên đường thẳng $AD$ nên $ID\parallel CM$.

Vì $BCDM$ là hình bình hành nên $BC\parallel DM$. Mà $I$ nằm trên đường thẳng $BC$ nên $CI\parallel DM$.

Tứ giác $CIDM$ có $ID\parallel CM$ và $CI\parallel DM$ nên $CIDM$ là hình bình hành (định nghĩa).

b) Vì $CIDM$ là hình bình hành (câu a) nên hai đường chéo $CD$ và $IM$ cắt nhau tại trung điểm của mỗi đường.

Trung điểm của $CD$ là $N$ nên $N$ là trung điểm của $IM$.

Vậy ba điểm $M,\ N,\ I$ thẳng hàng.

### Hình Bài 5 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình bình hành $ABCD$. Hạ $AH$ và $CK$ vuông góc với $BD$ ($H,\ K$ thuộc $BD$).
a) Chứng minh: $\triangle AHD=\triangle CKB$.
b) Tứ giác $AHCK$ là hình bình hành.
c) $AH$ cắt $CD$ tại $M$, $CK$ cắt $AB$ tại $N$. Chứng minh: Tứ giác $AMCN$ là hình bình hành.
d) Chứng minh: $AC,\ BD,\ MN$ đồng quy.
**Hình giải:** giai_hinh5.png
**Ghi chú:** đề ghi $H,\ K$ thuộc $BD$ — hình vẽ với $\widehat{ADB}$ và $\widehat{ABD}$ nhọn nên $H$, $K$ nằm trong đoạn $BD$; lời giải dùng đúng cách đặt này.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai đường cao $AH$, $CK$ cùng hạ xuống đường chéo $BD$ nên song song và bằng nhau; từ đó lần lượt xuất hiện các hình bình hành $AHCK$, $AMCN$, và tâm của $ABCD$ là điểm chung của ba đường ở ý d.

**Bước 1.** Ý a: muốn $\triangle AHD=\triangle CKB$, tìm ba yếu tố bằng nhau: hai góc vuông ở $H$, $K$, hai cạnh huyền $AD=CB$ (cạnh đối của hình bình hành) và cặp góc nhọn $\widehat{ADH}=\widehat{CBK}$ nhờ $AD\parallel BC$ (so le trong), rồi chọn trường hợp cạnh huyền – góc nhọn của tam giác vuông.

**Bước 2.** Ý b: muốn $AHCK$ là hình bình hành, cần cặp cạnh đối $AH$, $CK$ vừa song song vừa bằng nhau; song song vì cùng vuông góc với $BD$, còn bằng nhau vì là hai cạnh tương ứng của hai tam giác bằng nhau ở ý a.

**Bước 3.** Ý c: muốn $AMCN$ là hình bình hành, cần hai cặp cạnh đối song song; cặp $AM$, $CN$ nằm trên $AH$ và $CK$ đã song song ở ý b, còn cặp $AN$, $MC$ nằm trên $AB$ và $CD$ của hình bình hành $ABCD$.

**Bước 4.** Ý d: muốn $AC$, $BD$, $MN$ đồng quy, cần chỉ ra một điểm chung của ba đường; hai đường chéo $AC$, $BD$ của $ABCD$ đã cắt nhau tại trung điểm $O$ của $AC$, nên chỉ còn phải chứng minh $MN$ cũng đi qua $O$.

**Bước 5.** Ý d (tiếp): $AC$ và $MN$ là hai đường chéo của hình bình hành $AMCN$ ở ý c, nên chúng cắt nhau tại trung điểm của $AC$, và trung điểm đó chính là $O$.

**Phần 2. Trình bày**

a) Xét $\triangle AHD$ và $\triangle CKB$ có:

$\widehat{AHD}=\widehat{CKB}=90^\circ$ (vì $AH\perp BD$, $CK\perp BD$)

$AD=CB$ (hai cạnh đối của hình bình hành $ABCD$)

$\widehat{ADH}=\widehat{ADB}$ và $\widehat{CBK}=\widehat{CBD}$ (vì $H$ nằm trên tia $DB$, $K$ nằm trên tia $BD$)

$\widehat{ADB}=\widehat{CBD}$ (hai góc so le trong, $AD\parallel BC$) nên $\widehat{ADH}=\widehat{CBK}$

Do đó $\triangle AHD=\triangle CKB$ (cạnh huyền – góc nhọn).

b) Vì $\triangle AHD=\triangle CKB$ (câu a) nên $AH=CK$ (hai cạnh tương ứng).

Vì $AH\perp BD$ và $CK\perp BD$ nên $AH\parallel CK$ (cùng vuông góc với $BD$).

Tứ giác $AHCK$ có $AH\parallel CK$ và $AH=CK$ nên $AHCK$ là hình bình hành (dấu hiệu nhận biết).

c) Vì $AB\parallel CD$, $N\in AB$ và $M\in CD$ nên $AN\parallel MC$.

Vì $AH\parallel CK$ (câu b), $M\in AH$ và $N\in CK$ nên $AM\parallel CN$.

Tứ giác $AMCN$ có $AN\parallel MC$ và $AM\parallel CN$ nên $AMCN$ là hình bình hành (định nghĩa).

d) Gọi $O$ là giao điểm của $AC$ và $BD$.

Vì $ABCD$ là hình bình hành nên $O$ là trung điểm của $AC$ và của $BD$.

Vì $AMCN$ là hình bình hành (câu c) nên hai đường chéo $AC$ và $MN$ cắt nhau tại trung điểm của mỗi đường, tức là $MN$ đi qua trung điểm $O$ của $AC$.

Vậy $AC,\ BD,\ MN$ cùng đi qua $O$ nên chúng đồng quy.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Có 1 câu `Chưa chắc`: Hình Bài 3 — đề không cho $AB>AD$; hình giải và lời giải làm với $AB>AD$ ($M$, $N$ nằm trong đoạn $AB$, $CD$; phép trừ $MB=AB-AM$, $DN=CD-CN$ ở ý b cần điều này). CEO quyết có ghi thêm điều kiện vào đề không.
- Hình Bài 2d: đáp án là $AC\perp AD$ (tương đương $AC\perp BC$, $\widehat{ACB}=90^\circ$); đã kiểm bằng toạ độ cả hai chiều. Không phải điều kiện "hình chữ nhật".
- Hình Bài 5: đề ghi $H,\ K$ thuộc $BD$ — hiểu là thuộc đoạn $BD$ ($\widehat{ADB}$, $\widehat{ABD}$ nhọn), ghi ở `Ghi chú`.
- Không dùng đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác. "Đồng quy" (Bài 2c, 5d) và "thẳng hàng" (Bài 4b) đều làm bằng hình bình hành có hai đường chéo cắt nhau tại trung điểm của mỗi đường. Bài 2d dùng dấu hiệu / tính chất hình thoi (Chương III, trong phạm vi TC).
- Bốn hình giải vẽ bằng code (`<LV>\tam\ve_p8.mjs`, điểm dựng bằng `dung_p8.mjs`), đã mở từng ảnh kiểm; không đánh dấu điều phải chứng minh (chỉ gạch trung điểm, góc phân giác, góc vuông cho trước). Mọi khẳng định đã thử bằng `kiem_p8.mjs` (toạ độ ngẫu nhiên nhiều bộ + bộ của hình vẽ).
