### VHB2-VD31 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 VD31@p075 (giải p075-076)
**sach:** Thalès cho $ED\parallel BC$ và $DF\parallel AB$ (cạnh đối hình thoi); ý b kẻ thêm $K$ trên tia đối của $BC$ sao cho $BK=BA$ để có $BD\parallel KA$ rồi Thalès cho $\triangle CAK$ + bất đẳng thức tam giác. Kho tách ý a của sách (số + tổng quát) thành hai ý a, b nên các ý sau đánh lại c, d.
**loai:** nhieu_y
**loi_dan:**
Cho hình thoi $BEDF$ nội tiếp tam giác $ABC$ ($E$ thuộc $AB$, $D$ thuộc $AC$, $F$ thuộc $BC$).
**hinh:** VHB2-VD31.png
#### y a
**loai_cau:** tra_loi_ngan
**dap_an:** 2,4
**cau_hoi:** Cho $AB=4$ cm, $BC=6$ cm. Tính độ dài cạnh hình thoi.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai cạnh đối $ED$ và $BF$ của hình thoi song song, tức $ED\parallel BC$; Thalès cho $\triangle ABC$ nối cạnh hình thoi với $AE=AB-BE$.
**Bước 1.** Đặt cạnh hình thoi là $x$; vì $ED\parallel BF$ nên $ED\parallel BC$, đó là dấu hiệu để dùng định lí Thalès.
**Bước 2.** Biểu thị $AE$ qua $x$: $E$ nằm giữa $A$, $B$ và $BE=x$ nên $AE=AB-x$.
**Bước 3.** Lập tỉ lệ thức $\dfrac{ED}{BC}=\dfrac{AE}{AB}$ rồi giải phương trình ẩn $x$.
**Chú ý:** cạnh hình thoi được đo cả trên $ED$ lẫn $BE$, nhờ vậy cùng một ẩn $x$ xuất hiện ở hai vế.

**Phần 2. Trình bày**
Gọi $x$ (cm) là cạnh hình thoi $BEDF$ thì $ED=BE=x$.
Vì $BEDF$ là hình thoi nên $ED\parallel BF$, tức là $ED\parallel BC$.
Xét $\triangle ABC$ có $ED\parallel BC$ ($E\in AB$, $D\in AC$)
nên $\dfrac{ED}{BC}=\dfrac{AE}{AB}$ (hệ quả của định lí Thalès).
Mà $AE=AB-BE=4-x$ nên $\dfrac{x}{6}=\dfrac{4-x}{4}$.
Suy ra $4x=24-6x$, hay $10x=24$, do đó $x=2{,}4$.
Vậy cạnh hình thoi bằng $2{,}4$ cm.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Cho $AB=c$, $BC=a$. Tính độ dài cạnh hình thoi theo $a$ và $c$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** làm như ý a nhưng với các chữ $a$, $c$: Thalès cho $\triangle ABC$ với $ED\parallel BC$ rồi giải phương trình ẩn $x$.
**Bước 1.** Đặt cạnh hình thoi là $x$ và nhận ra $ED\parallel BC$ (hai cạnh đối của hình thoi).
**Bước 2.** Viết $AE=c-x$ rồi lập tỉ lệ thức $\dfrac{ED}{BC}=\dfrac{AE}{AB}$ với các độ dài $x$, $a$, $c-x$, $c$.
**Bước 3.** Nhân chéo, gom các số hạng chứa $x$ về một vế và rút $x$ theo $a$, $c$.
**Chú ý:** thay $a=6$, $c=4$ vào kết quả phải ra đúng đáp số của ý a, đó là cách tự kiểm tra.

**Phần 2. Trình bày**
Gọi $x$ là cạnh hình thoi $BEDF$ thì $ED=BE=x$ và $ED\parallel BC$.
Xét $\triangle ABC$ có $ED\parallel BC$ ($E\in AB$, $D\in AC$)
nên $\dfrac{ED}{BC}=\dfrac{AE}{AB}$ (hệ quả của định lí Thalès).
Mà $AE=AB-BE=c-x$ nên $\dfrac{x}{a}=\dfrac{c-x}{c}$.
Suy ra $cx=ac-ax$, hay $x(a+c)=ac$.
Vậy cạnh hình thoi bằng $x=\dfrac{ac}{a+c}$.
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Cho $AB=c$, $BC=a$. Chứng minh rằng $BD<\dfrac{2ac}{a+c}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** lấy $K$ trên tia đối của tia $BC$ sao cho $BK=BA$ để có $BD\parallel KA$ ($BD$ là phân giác của $\widehat{ABC}$ còn $\triangle ABK$ cân); Thalès cho $\triangle CAK$ đưa $BD$ về $AK$, rồi bất đẳng thức tam giác cho $AK<2c$.

- n1 | - | $BD\parallel KA$ | gt | $\widehat{BKA}=\dfrac12\widehat{ABC}=\widehat{DBC}$ (góc ngoài của tam giác cân $ABK$, $BD$ là phân giác), hai góc đồng vị
- n2 | - | $\dfrac{BD}{AK}=\dfrac{a}{a+c}$ | n1 | hệ quả của định lí Thalès cho $\triangle CAK$
- n3 | - | $AK<2c$ | gt | bất đẳng thức tam giác cho $\triangle ABK$ với $BK=BA=c$
- n4 | - | $BD<\dfrac{2ac}{a+c}$ | n2, n3 | thay $AK<2c$ vào $BD=\dfrac{a}{a+c}\cdot AK$

**Phần 2. Trình bày**

[[so-do:n1]]
Trên tia đối của tia $BC$ lấy điểm $K$ sao cho $BK=BA=c$.
Vì $BEDF$ là hình thoi nên đường chéo $BD$ là tia phân giác của $\widehat{EBF}$,
mà $E\in AB$, $F\in BC$ nên $\widehat{DBC}=\dfrac12\widehat{ABC}$.
$\triangle ABK$ cân tại $B$ nên $\widehat{BKA}=\widehat{BAK}$.
$\widehat{ABC}$ là góc ngoài của $\triangle ABK$ tại $B$ nên $\widehat{ABC}=\widehat{BKA}+\widehat{BAK}=2\widehat{BKA}$.
Suy ra $\widehat{BKA}=\dfrac12\widehat{ABC}=\widehat{DBC}$.
Hai góc $\widehat{BKA}$ và $\widehat{DBC}$ ở vị trí đồng vị ($K$, $B$, $C$ thẳng hàng) nên $BD\parallel KA$.
[[so-do:n2]]
Xét $\triangle CAK$ có $BD\parallel KA$ ($B\in CK$, $D\in CA$)
nên $\dfrac{BD}{AK}=\dfrac{CB}{CK}$ (hệ quả của định lí Thalès).
Mà $CB=a$ và $CK=CB+BK=a+c$ nên $\dfrac{BD}{AK}=\dfrac{a}{a+c}$. (1)
[[so-do:n3]]
Ba điểm $A$, $B$, $K$ không thẳng hàng nên trong $\triangle ABK$ có
$AK<AB+BK=c+c=2c$ (bất đẳng thức tam giác). (2)
[[so-do:n4]]
Từ (1) suy ra $BD=\dfrac{a}{a+c}\cdot AK$.
Kết hợp với (2) ta được $BD<\dfrac{a}{a+c}\cdot 2c=\dfrac{2ac}{a+c}$.
**hinh_lg:** VHB2-VD31_c_lg.png
#### y d
**loai_cau:** tu_luan
**cau_hoi:** Cho $AD=m$, $DC=n$ và cạnh hình thoi bằng $d$. Tính độ dài $AB$ và $BC$ theo $m$, $n$, $d$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai cặp cạnh đối của hình thoi song song với hai cạnh của tam giác: $ED\parallel BC$ cho ra $BC$, $DF\parallel AB$ cho ra $AB$.
**Bước 1.** Nhận ra $ED\parallel BC$ và $DF\parallel AB$ (cạnh đối của hình thoi), mỗi cặp song song cho một lần dùng Thalès.
**Bước 2.** Với $ED\parallel BC$: lập tỉ lệ thức $\dfrac{ED}{BC}=\dfrac{AD}{AC}$ với $AC=m+n$ rồi rút $BC$.
**Bước 3.** Với $DF\parallel AB$: lập tỉ lệ thức $\dfrac{DF}{AB}=\dfrac{CD}{CA}$ rồi rút $AB$.
**Chú ý:** cả hai cạnh hình thoi $ED$ và $DF$ đều bằng $d$.

**Phần 2. Trình bày**
Vì $BEDF$ là hình thoi cạnh $d$ nên $ED=DF=d$, $ED\parallel BC$ và $DF\parallel AB$.
Vì $D$ nằm trên cạnh $AC$ nên $AC=AD+DC=m+n$.
Xét $\triangle ABC$ có $ED\parallel BC$ ($E\in AB$, $D\in AC$)
nên $\dfrac{ED}{BC}=\dfrac{AD}{AC}$ (hệ quả của định lí Thalès),
tức là $\dfrac{d}{BC}=\dfrac{m}{m+n}$, suy ra $BC=\dfrac{d(m+n)}{m}$.
Xét $\triangle ABC$ có $DF\parallel AB$ ($D\in AC$, $F\in BC$)
nên $\dfrac{DF}{AB}=\dfrac{CD}{CA}$ (hệ quả của định lí Thalès),
tức là $\dfrac{d}{AB}=\dfrac{n}{m+n}$, suy ra $AB=\dfrac{d(m+n)}{n}$.
Vậy $AB=\dfrac{d(m+n)}{n}$ và $BC=\dfrac{d(m+n)}{m}$.
**nghi_van:**

### VHB2-VD32 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 VD32@p076 (giải p076-077; "Gợi ý cách giải" 3 cách)
**sach:** Cách 1 của sách: qua $D$ kẻ $DG\parallel AC$ ($G\in BC$); hai hệ quả Thalès ($\triangle KDG$ với $EC\parallel DG$ và $\triangle BAC$ với $DG\parallel AC$) cho $\dfrac{KE}{KD}=\dfrac{EC}{DG}=\dfrac{BD}{DG}=\dfrac{AB}{AC}$. Kho viết cách 1 đủ bước; cách 2 (kẻ $EH\parallel AB$) tương tự, cách 3 sách để bạn đọc.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ ($AC>AB$). Lấy các điểm $D$, $E$ tuỳ ý theo thứ tự nằm trên các cạnh $AB$, $AC$ sao cho $BD=CE$. Gọi $K$ là giao điểm của các đường thẳng $DE$, $BC$. Chứng minh rằng tỉ số $\dfrac{KE}{KD}$ không phụ thuộc vào cách chọn các điểm $D$ và $E$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** muốn chứng minh tỉ số không đổi thì tìm một giá trị chỉ phụ thuộc tam giác $ABC$ (đó là $\dfrac{AB}{AC}$). Qua $D$ kẻ $DG\parallel AC$ cắt $BC$ tại $G$: hệ quả Thalès đưa $\dfrac{KE}{KD}$ về $\dfrac{EC}{DG}$, thay $EC=BD$ rồi Thalès lần nữa cho $\dfrac{BD}{DG}$ trong $\triangle BAC$.

- n1 | - | $\dfrac{KE}{KD}=\dfrac{EC}{DG}$ | gt | hệ quả của định lí Thalès cho $\triangle KDG$ với $EC\parallel DG$
- n2 | - | $\dfrac{BD}{DG}=\dfrac{AB}{AC}$ | gt | hệ quả của định lí Thalès cho $\triangle BAC$ với $DG\parallel AC$
- n3 | - | $\dfrac{KE}{KD}=\dfrac{AB}{AC}$ | n1, n2 | $EC=BD$ (gt), tỉ số $\dfrac{AB}{AC}$ chỉ phụ thuộc tam giác $ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $D$ kẻ đường thẳng song song với $AC$, cắt $BC$ tại $G$.
Vì $E$, $C$ cùng thuộc đường thẳng $AC$ nên $EC\parallel DG$.
Xét $\triangle KDG$ có $EC\parallel DG$ ($E\in KD$, $C\in KG$)
nên $\dfrac{KE}{KD}=\dfrac{EC}{DG}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle BAC$ có $DG\parallel AC$ ($D\in BA$, $G\in BC$)
nên $\dfrac{BD}{BA}=\dfrac{DG}{AC}$ (hệ quả của định lí Thalès),
suy ra $\dfrac{BD}{DG}=\dfrac{AB}{AC}$. (2)
[[so-do:n3]]
Vì $EC=BD$ (gt) nên từ (1) và (2) ta có $\dfrac{KE}{KD}=\dfrac{EC}{DG}=\dfrac{BD}{DG}=\dfrac{AB}{AC}$.
Tỉ số $\dfrac{AB}{AC}$ chỉ phụ thuộc tam giác $ABC$, không phụ thuộc vị trí của $D$, $E$.
Vậy $\dfrac{KE}{KD}$ không phụ thuộc vào cách chọn các điểm $D$ và $E$.
**hinh:** VHB2-VD32.png
**hinh_lg:** VHB2-VD32_lg.png
**nghi_van:**

### VHB2-VD33 → HH00162
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 VD33@p077 (giải cùng trang)
**sach:** Ý a: hai hệ quả Thalès cho $\triangle KDN$, $\triangle KNC$ với $AB\parallel CD$, cùng ra tỉ số $\dfrac{KM}{KN}$. Ý b: tương tự cho $\triangle ONC$, $\triangle OND$ với tỉ số $\dfrac{OM}{ON}$. Ý c: nhân vế với vế hai đẳng thức. Sách gọi kết quả này là bổ đề hình thang.
**loai:** nhieu_y
**loi_dan:**
Cho hình thang $ABCD$ có $AB\parallel CD$, $AB<CD$. Gọi $O$ là giao điểm của hai đường chéo, $K$ là giao điểm của $AD$ và $BC$. Đường thẳng $KO$ cắt $AB$, $CD$ theo thứ tự ở $M$, $N$.
**hinh:** VHB2-VD33.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{MA}{ND}=\dfrac{MB}{NC}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** hai tam giác $KDN$ và $KNC$ có chung đường thẳng $KN$ và bị cắt bởi $AB\parallel CD$; hai lần hệ quả Thalès cùng cho tỉ số $\dfrac{KM}{KN}$.

- n1 | - | $\dfrac{MA}{ND}=\dfrac{KM}{KN}$ | gt | hệ quả của định lí Thalès cho $\triangle KDN$ với $AM\parallel DN$
- n2 | - | $\dfrac{MB}{NC}=\dfrac{KM}{KN}$ | gt | hệ quả của định lí Thalès cho $\triangle KNC$ với $MB\parallel NC$
- n3 | - | $\dfrac{MA}{ND}=\dfrac{MB}{NC}$ | n1, n2 | cùng bằng $\dfrac{KM}{KN}$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $AB\parallel CD$ ($M\in AB$, $N\in CD$) nên $AM\parallel DN$ và $MB\parallel NC$.
Xét $\triangle KDN$ có $AM\parallel DN$ ($A\in KD$, $M\in KN$)
nên $\dfrac{MA}{ND}=\dfrac{KM}{KN}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle KNC$ có $MB\parallel NC$ ($M\in KN$, $B\in KC$)
nên $\dfrac{MB}{NC}=\dfrac{KM}{KN}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{MA}{ND}=\dfrac{MB}{NC}$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{MA}{NC}=\dfrac{MB}{ND}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** lần này dùng hai tam giác $ONC$ và $OND$ (đỉnh $O$ là giao điểm hai đường chéo); hai lần hệ quả Thalès cùng cho tỉ số $\dfrac{OM}{ON}$.

- n1 | - | $\dfrac{MA}{NC}=\dfrac{OM}{ON}$ | gt | hệ quả của định lí Thalès cho $\triangle ONC$ với $MA\parallel NC$
- n2 | - | $\dfrac{MB}{ND}=\dfrac{OM}{ON}$ | gt | hệ quả của định lí Thalès cho $\triangle OND$ với $MB\parallel ND$
- n3 | - | $\dfrac{MA}{NC}=\dfrac{MB}{ND}$ | n1, n2 | cùng bằng $\dfrac{OM}{ON}$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $AB\parallel CD$ nên $MA\parallel NC$ và $MB\parallel ND$.
Xét $\triangle ONC$ có $MA\parallel NC$ ($M\in ON$, $A\in OC$)
nên $\dfrac{MA}{NC}=\dfrac{OM}{ON}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle OND$ có $MB\parallel ND$ ($M\in ON$, $B\in OD$)
nên $\dfrac{MB}{ND}=\dfrac{OM}{ON}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{MA}{NC}=\dfrac{MB}{ND}$.
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $MA=MB$ và $NC=ND$.
**da_biet:** Biết $\dfrac{MA}{ND}=\dfrac{MB}{NC}$ (ý a) và $\dfrac{MA}{NC}=\dfrac{MB}{ND}$ (ý b).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** nhân vế với vế hai đẳng thức của ý a và ý b để hai mẫu $ND\cdot NC$ triệt tiêu, chỉ còn $MA^2=MB^2$; rồi thay lại vào ý a.

- n1 | - | $\dfrac{MA^2}{ND\cdot NC}=\dfrac{MB^2}{NC\cdot ND}$ | gt | nhân vế với vế hai đẳng thức đã biết
- n2 | - | $MA=MB$ | n1 | $MA^2=MB^2$ và $MA$, $MB$ là độ dài dương
- n3 | - | $NC=ND$ | n2, gt | thay $MA=MB$ vào $\dfrac{MA}{ND}=\dfrac{MB}{NC}$

**Phần 2. Trình bày**

[[so-do:n1]]
Nhân từng vế của $\dfrac{MA}{ND}=\dfrac{MB}{NC}$ với $\dfrac{MA}{NC}=\dfrac{MB}{ND}$ ta được
$\dfrac{MA^2}{ND\cdot NC}=\dfrac{MB^2}{NC\cdot ND}$.
[[so-do:n2]]
Suy ra $MA^2=MB^2$.
Mà $MA>0$, $MB>0$ nên $MA=MB$.
[[so-do:n3]]
Thay $MA=MB$ vào $\dfrac{MA}{ND}=\dfrac{MB}{NC}$ ta có $\dfrac{MA}{ND}=\dfrac{MA}{NC}$.
Vì $MA>0$ nên $ND=NC$.
Vậy $MA=MB$ và $NC=ND$.
**nghi_van:**

### VHB2-171 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT171@p078 (giải p186)
**sach:** Kẻ $AK\parallel BC$ ($K\in CD$), $I=AK\cap EF$; hệ quả Thalès cho $\triangle ADK$ ra $EI=30$; $AIFB$ là hình bình hành nên $IF=AB=28$; $EF=58$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 58
**noi_dung:**
Trong hình thang $ABCD$ ($AB\parallel CD$) có $AB=28$ cm, $CD=70$ cm, $AD=35$ cm, vẽ một đường thẳng song song với hai cạnh đáy, cắt $AD$, $BC$ theo thứ tự ở $E$ và $F$. Tính độ dài $EF$, biết rằng $DE=10$ cm.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** kẻ $AK\parallel BC$ để tách hình thang thành hình bình hành $ABCK$ và tam giác $ADK$; đường thẳng $EF$ bị $AK$ chia thành hai đoạn, mỗi đoạn tính riêng.
**Bước 1.** Kẻ $AK\parallel BC$ ($K\in CD$): $ABCK$ có hai cặp cạnh đối song song nên là hình bình hành, từ đó $CK=AB$ và tính được $DK=CD-AB$.
**Bước 2.** Gọi $I$ là giao điểm của $AK$ và $EF$, tính $AE=AD-DE$ rồi dùng Thalès trong $\triangle ADK$ (có $EI\parallel DK$) để tìm $EI$.
**Bước 3.** Chứng minh $AIFB$ là hình bình hành để có $IF=AB$.
**Bước 4.** Cộng hai đoạn $EI$ và $IF$ để được $EF$.
**Chú ý:** $E$ và $F$ nằm về hai phía của $AK$ nên $I$ nằm giữa $E$ và $F$, cộng đoạn được.

**Phần 2. Trình bày**
Kẻ $AK\parallel BC$ ($K\in CD$), gọi $I$ là giao điểm của $AK$ và $EF$.
Tứ giác $ABCK$ có $AB\parallel CK$ (gt) và $AK\parallel BC$ (cách kẻ) nên là hình bình hành.
Suy ra $CK=AB=28$ cm, do đó $DK=CD-CK=70-28=42$ cm.
Vì $E\in AD$ và $DE=10$ cm nên $AE=AD-DE=35-10=25$ cm.
Vì $EF\parallel CD$ nên $EI\parallel DK$.
Xét $\triangle ADK$ có $EI\parallel DK$ ($E\in AD$, $I\in AK$)
nên $\dfrac{EI}{DK}=\dfrac{AE}{AD}$ (hệ quả của định lí Thalès).
Suy ra $EI=\dfrac{25}{35}\cdot 42=30$ cm.
Tứ giác $AIFB$ có $AB\parallel IF$ (cùng song song với $CD$) và $AI\parallel BF$ (vì $AK\parallel BC$) nên là hình bình hành.
Suy ra $IF=AB=28$ cm.
Vì $E$, $F$ nằm về hai phía của đường thẳng $AK$ nên $I$ nằm giữa $E$ và $F$.
Do đó $EF=EI+IF=30+28=58$ cm.
Vậy $EF=58$ cm.
**hinh:** VHB2-171.png
**hinh_lg:** VHB2-171_lg.png
**nghi_van:**

### VHB2-172 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT172@p078 (giải p186; gợi ý dùng các tỉ số trung gian $\dfrac{CO}{CB}$, $\dfrac{DO}{DA}$)
**sach:** $\dfrac{OM}{AB}=\dfrac{CO}{CB}$ (hệ quả Thalès cho $\triangle CAB$), $\dfrac{ON}{AB}=\dfrac{DO}{DA}$ (cho $\triangle DAB$), và $\dfrac{CO}{CB}=\dfrac{DO}{DA}$ do $CD\parallel AB$. Chỉ cần Thalès (không dùng bổ đề hình thang) nên để ở HH00127.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Gọi $O$ là giao điểm của các đường thẳng chứa hai cạnh bên $AD$, $BC$ của hình thang $ABCD$ ($AB\parallel CD$). Đường thẳng đi qua $O$ và song song với $AB$ cắt các đường thẳng $AC$, $BD$ theo thứ tự ở $M$, $N$. Chứng minh rằng $OM=ON$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** đưa $OM$ và $ON$ về cùng một tỉ số nhân với $AB$: $OM=AB\cdot\dfrac{CO}{CB}$ và $ON=AB\cdot\dfrac{DO}{DA}$; hai tỉ số $\dfrac{CO}{CB}$, $\dfrac{DO}{DA}$ bằng nhau vì $CD\parallel AB$.

- n1 | - | $\dfrac{OM}{AB}=\dfrac{CO}{CB}$ | gt | hệ quả của định lí Thalès cho $\triangle CAB$ với $OM\parallel AB$
- n2 | - | $\dfrac{ON}{AB}=\dfrac{DO}{DA}$ | gt | hệ quả của định lí Thalès cho $\triangle DAB$ với $ON\parallel AB$
- n3 | - | $\dfrac{CO}{CB}=\dfrac{DO}{DA}$ | gt | định lí Thalès cho hai đường thẳng $OB$, $OA$ cắt hai đường song song $CD$, $AB$, rồi biến đổi tỉ lệ thức
- n4 | - | $OM=ON$ | n1, n2, n3 | $OM$, $ON$ cùng bằng $AB$ nhân với cùng một tỉ số

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle CAB$ có $OM\parallel AB$ ($O\in CB$, $M\in CA$)
nên $\dfrac{OM}{AB}=\dfrac{CO}{CB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle DAB$ có $ON\parallel AB$ ($O\in DA$, $N\in DB$)
nên $\dfrac{ON}{AB}=\dfrac{DO}{DA}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Vì $CD\parallel AB$ nên các đường thẳng $OB$, $OA$ cắt hai đường song song $CD$, $AB$ cho $\dfrac{OC}{OB}=\dfrac{OD}{OA}=k$ (định lí Thalès).
Khi đó $OC=k\cdot OB$ và $OD=k\cdot OA$.
$O$ là giao điểm của các đường thẳng chứa hai cạnh bên nên nằm ngoài các đoạn $BC$, $AD$,
do đó $B$, $C$ nằm cùng phía đối với $O$ và $A$, $D$ nằm cùng phía đối với $O$.
Suy ra $CB=\lvert OC-OB\rvert=OB\cdot\lvert k-1\rvert$ và $DA=\lvert OD-OA\rvert=OA\cdot\lvert k-1\rvert$ ($k\neq 1$ vì $C\neq B$).
Vậy $\dfrac{CO}{CB}=\dfrac{k\cdot OB}{OB\cdot\lvert k-1\rvert}=\dfrac{k}{\lvert k-1\rvert}$ và $\dfrac{DO}{DA}=\dfrac{k\cdot OA}{OA\cdot\lvert k-1\rvert}=\dfrac{k}{\lvert k-1\rvert}$.
Do đó $\dfrac{CO}{CB}=\dfrac{DO}{DA}$. (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{OM}{AB}=\dfrac{ON}{AB}$.
Vậy $OM=ON$.
**hinh:** VHB2-172.png
**nghi_van:** Hồ sơ lô ghi bài 172–174 là bổ đề hình thang; lời giải thật sự chỉ cần Thalès (không dùng tính chất "đường thẳng qua giao điểm hai đường chéo và giao điểm hai cạnh bên đi qua trung điểm hai đáy") nên theo luật "kiến thức muộn nhất lời giải cần" để ở HH00127. Nếu người xếp bản đồ muốn gom theo chủ đề hình thang thì chuyển HH00162.

### VHB2-173 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT173@p078 (giải p186)
**sach:** Thalès cho $\triangle DAB$ và $\triangle ADC$: $\dfrac{OE}{a}=\dfrac{DE}{DA}$, $\dfrac{OE}{b}=\dfrac{AE}{AD}$; cộng lại được $1$. Với $OG$ làm tương tự (sách ghi "tương tự").
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ có các cạnh đáy $AB=a$, $CD=b$. Qua giao điểm $O$ của hai đường chéo, kẻ đường thẳng song song với $AB$, cắt $AD$ và $BC$ theo thứ tự ở $E$ và $G$. Chứng minh rằng $\dfrac{1}{OE}=\dfrac{1}{OG}=\dfrac{1}{a}+\dfrac{1}{b}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** viết $\dfrac{OE}{a}$ theo $\dfrac{DE}{DA}$ (Thalès với đáy $AB$) và $\dfrac{OE}{b}$ theo $\dfrac{AE}{AD}$ (Thalès với đáy $CD$); hai tỉ số này cộng lại bằng $\dfrac{DE+AE}{AD}=1$. $OG$ làm tương tự với cạnh bên $BC$.

- n1 | - | $\dfrac{OE}{a}=\dfrac{DE}{DA}$ | gt | hệ quả của định lí Thalès cho $\triangle DAB$ với $OE\parallel AB$
- n2 | - | $\dfrac{OE}{b}=\dfrac{AE}{AD}$ | gt | hệ quả của định lí Thalès cho $\triangle ADC$ với $OE\parallel DC$
- n3 | - | $\dfrac{1}{OE}=\dfrac1a+\dfrac1b$ | n1, n2 | cộng hai tỉ số: $\dfrac{DE+AE}{AD}=1$
- n4 | - | $\dfrac{OG}{a}=\dfrac{CG}{CB}$ | gt | hệ quả của định lí Thalès cho $\triangle CAB$ với $OG\parallel AB$
- n5 | - | $\dfrac{OG}{b}=\dfrac{BG}{BC}$ | gt | hệ quả của định lí Thalès cho $\triangle BDC$ với $OG\parallel DC$
- n6 | - | $\dfrac{1}{OG}=\dfrac1a+\dfrac1b$ | n4, n5 | cộng hai tỉ số: $\dfrac{CG+BG}{BC}=1$
- n7 | - | $\dfrac{1}{OE}=\dfrac{1}{OG}=\dfrac1a+\dfrac1b$ | n3, n6 | ghép hai kết quả

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $OE\parallel AB$ nên $OE\parallel AB\parallel CD$.
Xét $\triangle DAB$ có $OE\parallel AB$ ($O\in DB$, $E\in DA$)
nên $\dfrac{OE}{AB}=\dfrac{DE}{DA}$, tức là $\dfrac{OE}{a}=\dfrac{DE}{DA}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ADC$ có $OE\parallel DC$ ($E\in AD$, $O\in AC$)
nên $\dfrac{OE}{DC}=\dfrac{AE}{AD}$, tức là $\dfrac{OE}{b}=\dfrac{AE}{AD}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Cộng (1) và (2): $\dfrac{OE}{a}+\dfrac{OE}{b}=\dfrac{DE+AE}{AD}=1$ (vì $E$ nằm giữa $A$ và $D$).
Do đó $OE\left(\dfrac1a+\dfrac1b\right)=1$, hay $\dfrac{1}{OE}=\dfrac1a+\dfrac1b$. (3)
[[so-do:n4]]
Xét $\triangle CAB$ có $OG\parallel AB$ ($O\in CA$, $G\in CB$)
nên $\dfrac{OG}{AB}=\dfrac{CG}{CB}$, tức là $\dfrac{OG}{a}=\dfrac{CG}{CB}$ (hệ quả của định lí Thalès). (4)
[[so-do:n5]]
Xét $\triangle BDC$ có $OG\parallel DC$ ($O\in BD$, $G\in BC$)
nên $\dfrac{OG}{DC}=\dfrac{BG}{BC}$, tức là $\dfrac{OG}{b}=\dfrac{BG}{BC}$ (hệ quả của định lí Thalès). (5)
[[so-do:n6]]
Cộng (4) và (5): $\dfrac{OG}{a}+\dfrac{OG}{b}=\dfrac{CG+BG}{BC}=1$ (vì $G$ nằm giữa $B$ và $C$).
Do đó $\dfrac{1}{OG}=\dfrac1a+\dfrac1b$. (6)
[[so-do:n7]]
Từ (3) và (6) suy ra $\dfrac{1}{OE}=\dfrac{1}{OG}=\dfrac1a+\dfrac1b$.
**hinh:** VHB2-173.png
**nghi_van:**

### VHB2-174a → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT174a@p078 (giải p187)
**sach:** Chuỗi hệ quả Thalès $\dfrac{MH}{AB}=\dfrac{DM}{DA}=\dfrac{CK}{CA}=\dfrac{KN}{AB}$. Ý b của bài (dựng đường thẳng $d$ sao cho $MH=HK=KN$) tách riêng, xếp DE_SAU.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$). Một đường thẳng $d$ song song với hai cạnh đáy cắt hai cạnh bên $AD$, $BC$ theo thứ tự ở $M$, $N$ và cắt hai đường chéo $BD$, $AC$ theo thứ tự ở $H$, $K$. Chứng minh rằng $MH=KN$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** viết $\dfrac{MH}{AB}$ và $\dfrac{KN}{AB}$ qua hai tỉ số $\dfrac{DM}{DA}$, $\dfrac{CK}{CA}$ rồi chứng tỏ hai tỉ số này bằng nhau nhờ $MK\parallel DC$.

- n1 | - | $\dfrac{MH}{AB}=\dfrac{DM}{DA}$ | gt | hệ quả của định lí Thalès cho $\triangle DAB$ với $MH\parallel AB$
- n2 | - | $\dfrac{DM}{DA}=\dfrac{CK}{CA}$ | gt | định lí Thalès cho $\triangle ADC$ với $MK\parallel DC$, rồi tính chất tỉ lệ thức
- n3 | - | $\dfrac{KN}{AB}=\dfrac{CK}{CA}$ | gt | hệ quả của định lí Thalès cho $\triangle CAB$ với $KN\parallel AB$
- n4 | - | $MH=KN$ | n1, n2, n3 | $MH$, $KN$ cùng bằng $AB$ nhân với cùng một tỉ số

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle DAB$ có $MH\parallel AB$ ($M\in DA$, $H\in DB$)
nên $\dfrac{MH}{AB}=\dfrac{DM}{DA}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ADC$ có $MK\parallel DC$ ($M\in AD$, $K\in AC$)
nên $\dfrac{AM}{AD}=\dfrac{AK}{AC}$ (định lí Thalès),
suy ra $1-\dfrac{AM}{AD}=1-\dfrac{AK}{AC}$, tức là $\dfrac{DM}{DA}=\dfrac{CK}{CA}$. (2)
[[so-do:n3]]
Xét $\triangle CAB$ có $KN\parallel AB$ ($K\in CA$, $N\in CB$)
nên $\dfrac{KN}{AB}=\dfrac{CK}{CA}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{MH}{AB}=\dfrac{KN}{AB}$.
Vậy $MH=KN$.
**hinh:** VHB2-174a.png
**nghi_van:**

### VHB2-174b → DE_SAU (HH00136)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT174b@p078 (giải p187)
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$). Một đường thẳng $d$ song song với hai cạnh đáy cắt hai cạnh bên $AD$, $BC$ theo thứ tự ở $M$, $N$ và cắt hai đường chéo $BD$, $AC$ theo thứ tự ở $H$, $K$. Hãy nêu cách dựng đường thẳng $d$ sao cho $MH=HK=KN$.
**ly_do:** yêu cầu là một bài toán dựng hình (nêu cách dựng + chứng minh cách dựng đúng); chuyên đề dựng hình học sau (HH00136). Phần Thalès của bài (ý a) đã làm riêng ở VHB2-174a.

### VHB2-175 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT175@p078 (giải p187)
**sach:** Gọi $M$ là trung điểm $BC$, $AH\perp BC$ nên $MN\parallel AH$; hệ quả Thalès cho $\triangle CAH$: $\dfrac{CN}{CA}=\dfrac{CM}{CH}$. Xét hai trường hợp $\widehat B<90^\circ$ và $\widehat B>90^\circ$ cho hai đáp số $35$ cm và $10$ cm.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 35 hoặc 10
**noi_dung:**
Tam giác $ABC$ có $AC>AB$, $AC=45$ cm. Hình chiếu của $AC$ và $AB$ trên $BC$ theo thứ tự là $27$ cm và $15$ cm. Đường trung trực của $BC$ cắt $AC$ tại $N$. Tính độ dài $CN$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** đường trung trực của $BC$ và đường cao $AH$ cùng vuông góc với $BC$ nên song song; Thalès cho $\triangle CAH$ nối $CN$ với $CM$, $CH$. Vị trí của $H$ trên đường thẳng $BC$ có hai khả năng nên $CM$ có hai giá trị.
**Bước 1.** Gọi $H$ là chân đường cao hạ từ $A$, $M$ là trung điểm $BC$: các hình chiếu cho $HC=27$, $HB=15$, và $MN\parallel AH$ (cùng vuông góc với $BC$).
**Bước 2.** Xét vị trí của $H$: nằm giữa $B$, $C$ thì $BC=27+15$; $B$ nằm giữa $H$, $C$ thì $BC=27-15$. Từ đó tính $CM=\dfrac12BC$ ở mỗi trường hợp.
**Bước 3.** Lập tỉ lệ thức $\dfrac{CN}{CA}=\dfrac{CM}{CH}$ từ hệ quả Thalès trong $\triangle CAH$ rồi tính $CN$ mỗi trường hợp.
**Chú ý:** cả hai trường hợp đều có $AB<AC$ (vì $HB<HC$) nên không loại được trường hợp nào; bài có hai đáp số.

**Phần 2. Trình bày**
Gọi $H$ là chân đường cao hạ từ $A$ xuống $BC$ và $M$ là trung điểm của $BC$.
Hình chiếu của $AC$ trên $BC$ là $HC=27$ cm, hình chiếu của $AB$ trên $BC$ là $HB=15$ cm.
Đường trung trực của $BC$ đi qua $M$ và vuông góc với $BC$ nên $MN\perp BC$.
Mà $AH\perp BC$ nên $MN\parallel AH$.
Vì $HB<HC$ nên $C$ không nằm giữa $H$ và $B$. Có hai trường hợp.
**Trường hợp 1:** $H$ nằm giữa $B$ và $C$ ($\widehat B<90^\circ$).
$BC=HB+HC=15+27=42$ cm nên $CM=21$ cm.
Vì $CM<CH$ nên $M$ thuộc đoạn $CH$.
Xét $\triangle CAH$ có $MN\parallel AH$ ($M\in CH$, $N\in CA$)
nên $\dfrac{CN}{CA}=\dfrac{CM}{CH}$ (hệ quả của định lí Thalès).
Suy ra $CN=45\cdot\dfrac{21}{27}=35$ cm.
**Trường hợp 2:** $B$ nằm giữa $H$ và $C$ ($\widehat B>90^\circ$).
$BC=HC-HB=27-15=12$ cm nên $CM=6$ cm.
Vì $CM<CH$ nên $M$ thuộc đoạn $CH$.
Xét $\triangle CAH$ có $MN\parallel AH$ ($M\in CH$, $N\in CA$)
nên $\dfrac{CN}{CA}=\dfrac{CM}{CH}$ (hệ quả của định lí Thalès).
Suy ra $CN=45\cdot\dfrac{6}{27}=10$ cm.
Vậy $CN=35$ cm hoặc $CN=10$ cm.
**hinh:** VHB2-175.png
**hinh_lg:** VHB2-175_lg.png
**nghi_van:** Đề không nói $\widehat B$ nhọn hay tù nên có hai đáp số $35$ và $10$ (sách cũng cho cả hai). Hình đề vẽ trường hợp $B$ nhọn; hình lời giải vẽ cả hai.

### VHB2-176 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT176@p078 (giải p187)
**sach:** Gọi $E$, $F$ là giao điểm của $AG$, $AK$ với $BD$; hệ quả Thalès cho $\dfrac{DE}{EB}=\dfrac{DG}{AB}=\dfrac13$ và $\dfrac{BF}{FD}=\dfrac{BK}{AD}=\dfrac35$. Sách chỉ ghi kết quả $EF=6$; kho tính đủ ba đoạn $DE=4$, $EF=6$, $FB=6$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** DE=4; EF=6; FB=6
**noi_dung:**
Cho hình bình hành $ABCD$, điểm $G$ chia trong cạnh $DC$ theo tỉ số $1:2$ (tức $GD:GC=1:2$), điểm $K$ chia trong cạnh $BC$ theo tỉ số $3:2$ (tức $KB:KC=3:2$). Tính độ dài ba đoạn thẳng do $AG$, $AK$ định ra trên $BD$, biết rằng $BD=16$ cm.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $AG$ và $AK$ cắt $BD$ tại $E$, $F$ chia $BD$ thành ba đoạn $DE$, $EF$, $FB$; $DE$ tính nhờ $DG\parallel AB$, $FB$ tính nhờ $BK\parallel AD$, còn $EF$ là phần còn lại.
**Bước 1.** Gọi $E=AG\cap BD$, $F=AK\cap BD$ và đổi tỉ số chia thành $DG=\dfrac13DC$, $BK=\dfrac35BC$, $DC=AB$, $BC=AD$.
**Bước 2.** Dùng $DG\parallel AB$ để lập $\dfrac{DE}{EB}=\dfrac{DG}{AB}$, từ đó rút $DE$ theo $BD$.
**Bước 3.** Dùng $BK\parallel AD$ để lập $\dfrac{BF}{FD}=\dfrac{BK}{AD}$, từ đó rút $BF$ theo $BD$.
**Bước 4.** Tính $EF=BD-DE-BF$ và kết luận độ dài ba đoạn.
**Chú ý:** hai đoạn $DE$ và $BF$ cộng lại nhỏ hơn $BD$ nên $E$ nằm trước $F$ trên $DB$, ba đoạn nối tiếp nhau.

**Phần 2. Trình bày**
Gọi $E$, $F$ lần lượt là giao điểm của $AG$, $AK$ với $BD$.
Vì $ABCD$ là hình bình hành nên $AB\parallel DC$, $AB=DC$, $AD\parallel BC$, $AD=BC$.
Vì $GD:GC=1:2$ nên $DG=\dfrac13DC=\dfrac13AB$.
Xét $\triangle EAB$ có $DG\parallel AB$ ($D\in EB$, $G\in EA$)
nên $\dfrac{DE}{EB}=\dfrac{DG}{AB}=\dfrac13$ (hệ quả của định lí Thalès).
Suy ra $DE=\dfrac14DB=\dfrac14\cdot16=4$ cm.
Vì $KB:KC=3:2$ nên $BK=\dfrac35BC=\dfrac35AD$.
Xét $\triangle FAD$ có $BK\parallel AD$ ($B\in FD$, $K\in FA$)
nên $\dfrac{BF}{FD}=\dfrac{BK}{AD}=\dfrac35$ (hệ quả của định lí Thalès).
Suy ra $BF=\dfrac38DB=\dfrac38\cdot16=6$ cm.
Vì $DE+BF=4+6=10<16$ nên $E$ nằm giữa $D$ và $F$.
Do đó $EF=BD-DE-BF=16-4-6=6$ cm.
Vậy ba đoạn thẳng do $AG$, $AK$ định ra trên $BD$ dài $DE=4$ cm, $EF=6$ cm, $FB=6$ cm.
**hinh:** VHB2-176.png
**hinh_lg:** VHB2-176_lg.png
**nghi_van:** Sách ghi "chia trong ... theo tỉ số $1:2$", "$3:2$" mà không nói chiều; đọc theo định nghĩa ở đầu §13 ($GD:GC$, $KB:KC$) khớp với lời giải sách ($DG=\dfrac13DC$, $BK=\dfrac35BC$); đề kho đã viết rõ chiều.

### VHB2-177a → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT177a@p078 (giải p187)
**sach:** Kẻ $DE\parallel AB$ ($E\in AC$): $\triangle ADE$ đều (hai góc $60^\circ$), đặt cạnh $x$ rồi Thalès cho $\triangle CAB$: $\dfrac{x}{3}=\dfrac{6-x}{6}$, $x=2$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 2
**noi_dung:**
Cho tam giác $ABC$ có $\widehat{A}=120^\circ$, $AB=3$ cm, $AC=6$ cm. Tính độ dài đường phân giác $AD$ ($D\in BC$).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** kẻ $DE\parallel AB$ ($E\in AC$): vì $AD$ là phân giác của góc $120^\circ$ nên $\triangle ADE$ có hai góc $60^\circ$, tức là tam giác đều; đặt cạnh $x$ rồi dùng Thalès cho $\triangle CAB$.
**Bước 1.** Chia đôi góc $120^\circ$ được $\widehat{BAD}=\widehat{DAC}=60^\circ$; kẻ $DE\parallel AB$ để tạo ra góc so le trong $\widehat{ADE}=\widehat{BAD}$.
**Bước 2.** Chỉ ra $\triangle ADE$ có hai góc bằng $60^\circ$ nên đều và đặt $AD=DE=EA=x$.
**Bước 3.** Lập hệ quả Thalès $\dfrac{DE}{AB}=\dfrac{CE}{CA}$ với $CE=6-x$ rồi giải phương trình ẩn $x$.
**Chú ý:** đáp số chính là $x=AD$ vì $x$ là cạnh của tam giác đều $ADE$ có một cạnh là $AD$.

**Phần 2. Trình bày**
Vì $AD$ là tia phân giác của $\widehat{BAC}=120^\circ$ nên $\widehat{BAD}=\widehat{DAC}=60^\circ$.
Kẻ $DE\parallel AB$ ($E\in AC$). Khi đó $\widehat{ADE}=\widehat{BAD}=60^\circ$ (so le trong).
$\triangle ADE$ có $\widehat{DAE}=\widehat{ADE}=60^\circ$ nên là tam giác đều.
Đặt $AD=DE=EA=x$ (cm).
Xét $\triangle CAB$ có $DE\parallel AB$ ($D\in CB$, $E\in CA$)
nên $\dfrac{DE}{AB}=\dfrac{CE}{CA}$ (hệ quả của định lí Thalès).
Mà $E$ nằm giữa $A$ và $C$ nên $CE=6-x$, do đó $\dfrac{x}{3}=\dfrac{6-x}{6}$.
Suy ra $6x=18-3x$, hay $9x=18$, do đó $x=2$.
Vậy $AD=2$ cm.
**hinh:** VHB2-177a.png
**nghi_van:**

### VHB2-177b → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT177b@p078 (giải p188)
**sach:** Kẻ $DE\parallel AB$ ($E\in AC$): $\triangle EAD$ cân nên $EA=ED=x$; Thalès cho $\triangle CAB$ ra $\dfrac1{AB}+\dfrac1{AC}=\dfrac1x$; so với giả thiết được $x=AD$, $\triangle ADE$ đều, $\widehat{BAC}=120^\circ$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 120
**noi_dung:**
Cho tam giác $ABC$ với đường phân giác $AD$ ($D\in BC$) thoả mãn $\dfrac{1}{AD}=\dfrac{1}{AB}+\dfrac{1}{AC}$. Tính số đo góc $BAC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** kẻ $DE\parallel AB$ ($E\in AC$): vì $AD$ là phân giác nên $\triangle EAD$ cân tại $E$; đặt $EA=ED=x$, Thalès cho $\triangle CAB$ cho $\dfrac1{AB}+\dfrac1{AC}=\dfrac1x$, so với giả thiết ra $x=AD$.
**Bước 1.** Kẻ $DE\parallel AB$ rồi dùng góc so le trong và tia phân giác để chứng minh $\triangle EAD$ cân, từ đó đặt $EA=ED=x$.
**Bước 2.** Lập hệ quả Thalès $\dfrac{DE}{AB}=\dfrac{CE}{CA}$ với $CE=AC-x$ và biến đổi thành $\dfrac1{AB}+\dfrac1{AC}=\dfrac1x$.
**Bước 3.** So sánh với giả thiết $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AD}$ để có $x=AD$, suy ra $\triangle ADE$ đều.
**Bước 4.** Từ $\widehat{DAE}=60^\circ$ và $AD$ là phân giác tính $\widehat{BAC}$.
**Chú ý:** đẳng thức $\dfrac1{AD}=\dfrac1{AB}+\dfrac1{AC}$ chỉ đúng khi góc $A$ bằng $120^\circ$; đó là lí do góc tìm được duy nhất.

**Phần 2. Trình bày**
Kẻ $DE\parallel AB$ ($E\in AC$).
Vì $AD$ là tia phân giác của $\widehat{BAC}$ nên $\widehat{BAD}=\widehat{DAE}$.
Vì $DE\parallel AB$ nên $\widehat{ADE}=\widehat{BAD}$ (so le trong).
Suy ra $\widehat{ADE}=\widehat{DAE}$, do đó $\triangle EAD$ cân tại $E$: $EA=ED$.
Đặt $EA=ED=x$.
Xét $\triangle CAB$ có $DE\parallel AB$ ($D\in CB$, $E\in CA$)
nên $\dfrac{DE}{AB}=\dfrac{CE}{CA}$ (hệ quả của định lí Thalès).
Mà $CE=AC-AE=AC-x$ nên $\dfrac{x}{AB}=\dfrac{AC-x}{AC}=1-\dfrac{x}{AC}$.
Suy ra $\dfrac{x}{AB}+\dfrac{x}{AC}=1$, hay $\dfrac{1}{AB}+\dfrac{1}{AC}=\dfrac{1}{x}$.
Theo đề bài $\dfrac{1}{AB}+\dfrac{1}{AC}=\dfrac{1}{AD}$ nên $\dfrac1x=\dfrac1{AD}$, tức là $x=AD$.
Vậy $AD=DE=EA$ nên $\triangle ADE$ đều, suy ra $\widehat{DAE}=60^\circ$.
Mà $AD$ là tia phân giác của $\widehat{BAC}$ nên $\widehat{BAC}=2\cdot\widehat{DAE}=120^\circ$.
**hinh:** VHB2-177b.png
**nghi_van:**

### VHB2-178 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT178@p078 (giải p188)
**sach:** Kẻ $DG\parallel BC$ ($G\in AC$): $\dfrac{KE}{KD}=\dfrac{CE}{CG}=\dfrac{BD}{CG}=\dfrac{BA}{CA}$, hai lần hệ quả Thalès.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Chứng minh rằng nếu một đường thẳng cắt cạnh $AB$ ở $D$, cắt cạnh $BC$ ở $K$, và cắt tia đối của tia $CA$ ở $E$ sao cho $BD=CE$ thì tỉ số $\dfrac{KE}{KD}$ không đổi.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** giá trị không đổi cần tìm là $\dfrac{AB}{AC}$. Qua $D$ kẻ $DG\parallel BC$ ($G\in AC$): Thalès cho $\triangle ABC$ đổi $\dfrac{BD}{CG}$ thành $\dfrac{AB}{AC}$, Thalès cho $\triangle EDG$ (với $KC\parallel DG$) đổi $\dfrac{KE}{KD}$ thành $\dfrac{CE}{CG}$; thay $CE=BD$.

- n1 | - | $\dfrac{BD}{CG}=\dfrac{AB}{AC}$ | gt | định lí Thalès cho $\triangle ABC$ với $DG\parallel BC$, rồi tính chất tỉ lệ thức
- n2 | - | $\dfrac{KE}{KD}=\dfrac{CE}{CG}$ | gt | định lí Thalès cho $\triangle EDG$ với $KC\parallel DG$
- n3 | - | $\dfrac{KE}{KD}=\dfrac{AB}{AC}$ | n1, n2 | $CE=BD$ (gt), tỉ số $\dfrac{AB}{AC}$ chỉ phụ thuộc tam giác $ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $D$ kẻ đường thẳng song song với $BC$, cắt $AC$ tại $G$ ($G$ thuộc đoạn $AC$ vì $D$ thuộc cạnh $AB$).
Xét $\triangle ABC$ có $DG\parallel BC$ ($D\in AB$, $G\in AC$)
nên $\dfrac{AD}{AB}=\dfrac{AG}{AC}$ (định lí Thalès),
suy ra $1-\dfrac{AD}{AB}=1-\dfrac{AG}{AC}$, tức là $\dfrac{BD}{AB}=\dfrac{CG}{AC}$.
Do đó $\dfrac{BD}{CG}=\dfrac{AB}{AC}$. (1)
[[so-do:n2]]
Vì $DG\parallel BC$ nên $KC\parallel DG$.
Xét $\triangle EDG$ có $KC\parallel DG$ ($K\in ED$, $C\in EG$)
nên $\dfrac{KE}{KD}=\dfrac{CE}{CG}$ (định lí Thalès). (2)
[[so-do:n3]]
Vì $CE=BD$ (gt) nên từ (1) và (2) ta có $\dfrac{KE}{KD}=\dfrac{CE}{CG}=\dfrac{BD}{CG}=\dfrac{AB}{AC}$.
Tỉ số $\dfrac{AB}{AC}$ chỉ phụ thuộc tam giác $ABC$.
Vậy $\dfrac{KE}{KD}$ không đổi.
**hinh:** VHB2-178.png
**hinh_lg:** VHB2-178_lg.png
**nghi_van:**
