### TCHH-3.II.VD1 → KHAC (HH8T000000)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD1@p136
**noi_dung:**
Cho ba điểm $A$, $B$, $C$ và hai tia $Ax$, $Cy$ cùng nằm về một phía của đường thẳng $AC$ (phía không chứa $B$) sao cho $\widehat{xAB}=140^\circ$, $\widehat{ABC}=70^\circ$, $\widehat{BCy}=150^\circ$. Chứng minh rằng $Ax\parallel Cy$.
**ly_do:** sách kẻ $Bz\parallel Cy$ rồi cộng góc, chỉ dùng hai đường thẳng song song và góc trong cùng phía (kiến thức lớp 7), không Thalès, không đường trung bình.

### TCHH-3.II.VD2 → KHAC (HH00091)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD2@p137
**noi_dung:**
Cho góc vuông $xOy$, điểm $A$ thuộc tia $Ox$, điểm $B$ thuộc tia $Oy$. Gọi $D$, $E$ theo thứ tự là trung điểm của $OA$, $OB$. Đường vuông góc với $OA$ tại $D$ và đường vuông góc với $OB$ tại $E$ cắt nhau ở $C$. Chứng minh rằng $CA\parallel DE$.
**ly_do:** $ODCE$ là hình chữ nhật nên $EC=OD=DA$ và $EC\parallel DA$, suy ra $ECAD$ là hình bình hành (sách ghi nhầm tên tứ giác là $ECDA$); chỉ cần hình chữ nhật và hình bình hành (Tứ giác), không Thalès.

### TCHH-3.II.VD3 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD3@p138
**sach:** Cách 1: tính chất đường phân giác cho $AM$, $CN$ rồi Thalès đảo trong $\triangle BAC$. Cách 2 (hai tam giác bằng nhau $\triangle AMB=\triangle CNB$, $BM=BN$, $BO\perp$ cả $MN$ lẫn $AC$) không dùng; giữ cách 1 vì đúng chủ đề phân giác – Thalès đảo, không đường phụ.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $B$ có $BA=BC=a$, $AC=b$. Đường phân giác của góc $A$ cắt $BC$ tại $M$, đường phân giác của góc $C$ cắt $BA$ tại $N$. Chứng minh rằng $MN\parallel AC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai lần tính chất đường phân giác (đường $CN$ và $AM$ trong $\triangle ABC$) cho $\dfrac{NB}{NA}$ và $\dfrac{MB}{MC}$ cùng bằng một tỉ số nhờ $BA=BC$; rồi định lí Thalès đảo trong $\triangle BAC$, không cần kẻ thêm đường.

- n1 | - | $\dfrac{NB}{NA}=\dfrac{CB}{CA}$ | gt | $CN$ là tia phân giác của góc $C$ trong $\triangle ABC$, tính chất đường phân giác
- n2 | - | $\dfrac{MB}{MC}=\dfrac{AB}{AC}$ | gt | $AM$ là tia phân giác của góc $A$ trong $\triangle ABC$, tính chất đường phân giác
- n3 | - | $\dfrac{BN}{BA}=\dfrac{BM}{BC}$ | n1, n2, gt | $BA=BC$ nên $\dfrac{CB}{CA}=\dfrac{AB}{AC}$, rồi tính chất tỉ lệ thức
- n4 | - | $MN\parallel AC$ | n3 | định lí Thalès đảo cho $\triangle BAC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle ABC$ có $CN$ là tia phân giác của $\widehat{ACB}$ ($N\in AB$)
nên $\dfrac{NB}{NA}=\dfrac{CB}{CA}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $AM$ là tia phân giác của $\widehat{BAC}$ ($M\in BC$)
nên $\dfrac{MB}{MC}=\dfrac{AB}{AC}$ (tính chất đường phân giác). (2)
[[so-do:n3]]
Vì $BA=BC$ (gt) nên $\dfrac{CB}{CA}=\dfrac{AB}{AC}$. (3)
Từ (1), (2), (3) suy ra $\dfrac{NB}{NA}=\dfrac{MB}{MC}$,
nên $\dfrac{NB}{NB+NA}=\dfrac{MB}{MB+MC}$ (tính chất tỉ lệ thức)
hay $\dfrac{BN}{BA}=\dfrac{BM}{BC}$ ($N$ nằm giữa $B$ và $A$, $M$ nằm giữa $B$ và $C$).
[[so-do:n4]]
Xét $\triangle BAC$ có $N\in BA$, $M\in BC$ và $\dfrac{BN}{BA}=\dfrac{BM}{BC}$
nên $MN\parallel AC$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-VD3.png
**nghi_van:**

### TCHH-3.II.VD4 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD4@p139
**sach:** Sách xét $\triangle OEB=\triangle OMC$ (đưa ra $\triangle OEM$ vuông cân) rồi Thalès; phần tam giác bằng nhau không dùng tới ở bước kết luận. Kho giữ phần Thalès: $AB\parallel CN$ cho $\dfrac{AM}{MN}=\dfrac{BM}{MC}$, thay $AE=BM$, $EB=CM$ rồi Thalès đảo trong $\triangle ABN$. Không đường phụ.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vuông $ABCD$ có $AC$ cắt $BD$ tại $O$. Gọi $M$ là điểm bất kì thuộc cạnh $BC$ ($M$ khác $B$, $C$). Tia $AM$ cắt đường thẳng $CD$ tại $N$. Trên cạnh $AB$ lấy điểm $E$ sao cho $BE=CM$. Chứng minh rằng $ME\parallel BN$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Không cần điểm $O$. $AB\parallel CN$ cho tỉ số $\dfrac{AM}{MN}=\dfrac{BM}{MC}$; vì $AE=BM$ và $EB=CM$ nên tỉ số đó cũng là $\dfrac{AE}{EB}$; kết luận bằng định lí Thalès đảo trong $\triangle ABN$.

- n1 | - | $AE=BM$ | gt | $AE=AB-BE=BC-CM=BM$ (cạnh hình vuông bằng nhau)
- n2 | - | $\dfrac{AM}{MN}=\dfrac{BM}{MC}$ | gt | $AB\parallel CN$, hệ quả của định lí Thalès cho $\triangle MAB$
- n3 | - | $\dfrac{AE}{EB}=\dfrac{AM}{MN}$ | n1, n2, gt | thay $AE=BM$ và $EB=CM$
- n4 | - | $ME\parallel BN$ | n3 | định lí Thalès đảo cho $\triangle ABN$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $ABCD$ là hình vuông nên $AB=BC$.
Vì $BE=CM<BC=AB$ nên $E$ nằm giữa $A$ và $B$,
do đó $AE=AB-BE=BC-CM=BM$ ($M$ nằm giữa $B$ và $C$). (1)
[[so-do:n2]]
Vì $ABCD$ là hình vuông nên $AB\parallel CD$, tức $AB\parallel CN$.
$M$ nằm giữa hai đường thẳng song song $AB$, $CD$ nên $M$ nằm giữa $A$ và $N$.
Xét $\triangle MAB$ có $CN\parallel AB$ ($C$, $N$ lần lượt thuộc tia đối của tia $MB$, $MA$)
nên $\dfrac{AM}{MN}=\dfrac{BM}{MC}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và $EB=CM$ (gt) suy ra $\dfrac{AE}{EB}=\dfrac{BM}{CM}$. (3)
Từ (2) và (3) suy ra $\dfrac{AE}{EB}=\dfrac{AM}{MN}$.
[[so-do:n4]]
Từ đó $\dfrac{AE}{AE+EB}=\dfrac{AM}{AM+MN}$ (tính chất tỉ lệ thức), hay $\dfrac{AE}{AB}=\dfrac{AM}{AN}$.
Xét $\triangle ABN$ có $E\in AB$, $M\in AN$ và $\dfrac{AE}{AB}=\dfrac{AM}{AN}$
nên $ME\parallel BN$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-VD4.png
**nghi_van:** Đề có $AC\cap BD=O$ nhưng lời giải không dùng $O$ (sách dùng $O$ ở phần tam giác bằng nhau, không cần cho kết luận). Giữ $O$ trong đề cho đúng sách.

### TCHH-3.II.VD5 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD5@p139 (giải p140)
**sach:** Hai hình bình hành $ABCK$, $ABID$ cho $DK=IC=CD-AB$; hai hệ quả Thalès cho $\dfrac{AE}{EK}$, $\dfrac{AF}{FC}$ cùng bằng $\dfrac{AB}{DK}$; Thalès đảo trong $\triangle AKC$. Giữ nguyên.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$, $AB<CD$). Qua $A$ vẽ đường thẳng song song với $BC$ cắt $BD$ ở $E$ và cắt $CD$ ở $K$. Qua $B$ kẻ đường thẳng song song với $AD$ cắt $AC$ ở $F$ và cắt $CD$ ở $I$. Chứng minh rằng $EF\parallel CD$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $ABCK$ và $ABID$ là hình bình hành nên $DK=IC=CD-AB$. Hai hệ quả Thalès (trong $\triangle EDK$ và $\triangle FIC$ có cạnh $AB$ song song đáy) đưa $\dfrac{AE}{EK}$ và $\dfrac{AF}{FC}$ về cùng $\dfrac{AB}{DK}$; kết luận bằng định lí Thalès đảo trong $\triangle AKC$.

- n1 | - | $DK=IC$ | gt | $ABCK$, $ABID$ là hình bình hành nên $CK=DI=AB$, suy ra $DK=IC=CD-AB$
- n2 | - | $\dfrac{AE}{EK}=\dfrac{AB}{DK}$ | gt | $AB\parallel DK$ ($E=AK\cap BD$), hệ quả của định lí Thalès cho $\triangle EDK$
- n3 | - | $\dfrac{AF}{FC}=\dfrac{AB}{IC}$ | gt | $AB\parallel IC$ ($F=AC\cap BI$), hệ quả của định lí Thalès cho $\triangle FIC$
- n4 | - | $\dfrac{AE}{EK}=\dfrac{AF}{FC}$ | n1, n2, n3 | cùng bằng $\dfrac{AB}{DK}$ vì $DK=IC$
- n5 | - | $EF\parallel CD$ | n4 | định lí Thalès đảo cho $\triangle AKC$, $KC\subset CD$

**Phần 2. Trình bày**

[[so-do:n1]]
Tứ giác $ABCK$ có $AB\parallel CK$ ($AB\parallel CD$, $K\in CD$) và $AK\parallel BC$ (gt)
nên $ABCK$ là hình bình hành, suy ra $CK=AB$.
Tứ giác $ABID$ có $AB\parallel DI$ ($I\in CD$) và $BI\parallel AD$ (gt)
nên $ABID$ là hình bình hành, suy ra $DI=AB$.
Vì $K$, $I$ thuộc đoạn $CD$ nên $DK=CD-CK=CD-AB$ và $IC=CD-DI=CD-AB$.
Do đó $DK=IC$. (1)
[[so-do:n2]]
$AK$ và $BD$ là hai đường chéo của hình thang $ABKD$ ($AB\parallel DK$) nên cắt nhau tại $E$ nằm giữa $A$ và $K$, giữa $B$ và $D$.
Xét $\triangle EDK$ có $AB\parallel DK$ ($A$, $B$ lần lượt thuộc tia đối của tia $EK$, $ED$)
nên $\dfrac{AE}{EK}=\dfrac{AB}{DK}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
$AC$ và $BI$ là hai đường chéo của hình thang $ABCI$ ($AB\parallel IC$) nên cắt nhau tại $F$ nằm giữa $A$ và $C$, giữa $B$ và $I$.
Xét $\triangle FIC$ có $AB\parallel IC$ ($A$, $B$ lần lượt thuộc tia đối của tia $FC$, $FI$)
nên $\dfrac{AF}{FC}=\dfrac{AB}{IC}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{AE}{EK}=\dfrac{AF}{FC}$.
[[so-do:n5]]
Do đó $\dfrac{AE}{AE+EK}=\dfrac{AF}{AF+FC}$ (tính chất tỉ lệ thức), hay $\dfrac{AE}{AK}=\dfrac{AF}{AC}$.
Xét $\triangle AKC$ có $E\in AK$, $F\in AC$ và $\dfrac{AE}{AK}=\dfrac{AF}{AC}$
nên $EF\parallel KC$ (định lí Thalès đảo).
Mà $K$, $C$ thuộc $CD$ nên $EF\parallel CD$.
**hinh:** TCHH-3-II-VD5.png
**nghi_van:**

### TCHH-3.II.VD6 → KHAC (HH8T000000)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD6@p140
**noi_dung:**
Cho $\triangle ABC$ vuông tại $A$, đường cao $AH$. Kẻ đường phân giác $AD$ của $\widehat{HAC}$ và đường phân giác $BK$ của $\widehat{ABC}$ ($D\in BC$, $K\in AC$). $BK$ cắt $AH$, $AD$ lần lượt tại $E$ và $F$. Chứng minh rằng $KD\parallel AH$.
**ly_do:** sách dùng tính chất phân giác rồi đẳng thức $\dfrac{BC}{AB}=\dfrac{AC}{AH}$ lấy từ tam giác đồng dạng (cấm); cách không đồng dạng chỉ cần cộng góc ($BA=BD$), hai tam giác bằng nhau $\triangle BAK=\triangle BDK$ nên $KD\perp BC$, không cần Thalès (kiểm số 5 bộ).

### TCHH-3.II.VD7 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD7@p140
**sach:** Tính chất đường phân giác trong $\triangle AMB$ và $\triangle AMC$; $MB=MC$; Thalès đảo trong $\triangle ABC$. Giữ nguyên.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trung tuyến $AM$. Tia phân giác của góc $AMC$ cắt $AC$ tại $H$, tia phân giác của góc $AMB$ cắt $AB$ tại $K$. Chứng minh rằng $HK\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Tính chất đường phân giác trong $\triangle AMB$ và $\triangle AMC$ cho hai tỉ số có cùng tử $MA$; mẫu $MB$ và $MC$ bằng nhau vì $AM$ là trung tuyến; rồi định lí Thalès đảo trong $\triangle ABC$.

- n1 | - | $\dfrac{AK}{KB}=\dfrac{MA}{MB}$ | gt | $MK$ là tia phân giác của góc $AMB$ trong $\triangle AMB$, tính chất đường phân giác
- n2 | - | $\dfrac{AH}{HC}=\dfrac{MA}{MC}$ | gt | $MH$ là tia phân giác của góc $AMC$ trong $\triangle AMC$, tính chất đường phân giác
- n3 | - | $\dfrac{AK}{KB}=\dfrac{AH}{HC}$ | n1, n2, gt | $MB=MC$ vì $AM$ là trung tuyến
- n4 | - | $HK\parallel BC$ | n3 | định lí Thalès đảo cho $\triangle ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle AMB$ có $MK$ là tia phân giác của $\widehat{AMB}$ ($K\in AB$)
nên $\dfrac{AK}{KB}=\dfrac{MA}{MB}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Xét $\triangle AMC$ có $MH$ là tia phân giác của $\widehat{AMC}$ ($H\in AC$)
nên $\dfrac{AH}{HC}=\dfrac{MA}{MC}$ (tính chất đường phân giác). (2)
[[so-do:n3]]
Vì $AM$ là trung tuyến của $\triangle ABC$ nên $MB=MC$ (gt). (3)
Từ (1), (2), (3) suy ra $\dfrac{AK}{KB}=\dfrac{AH}{HC}$.
[[so-do:n4]]
Do đó $\dfrac{AK}{AK+KB}=\dfrac{AH}{AH+HC}$ (tính chất tỉ lệ thức), hay $\dfrac{AK}{AB}=\dfrac{AH}{AC}$.
Xét $\triangle ABC$ có $K\in AB$, $H\in AC$ và $\dfrac{AK}{AB}=\dfrac{AH}{AC}$
nên $HK\parallel BC$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-VD7.png
**nghi_van:**

### TCHH-3.II.VD8 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD8@p141
**sach:** Hai hệ quả Thalès cho $\dfrac{OB}{OF}$ và $\dfrac{OE}{OC}$ cùng bằng $\dfrac{OM}{ON}$ (hai cặp song song $MB\parallel NF$, $ME\parallel NC$), rồi Thalès đảo. Giữ nguyên, thêm lập luận về vị trí điểm $O$ (giữa hai cặp điểm).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$ có hai đường chéo $AC$, $BD$ cắt nhau tại $O$. Qua $O$ kẻ một đường thẳng bất kì cắt cạnh $AB$ tại $M$ và cạnh $CD$ tại $N$. Đường thẳng qua $M$ song song với $CD$ cắt $AC$ ở $E$, đường thẳng qua $N$ song song với $AB$ cắt $BD$ ở $F$. Chứng minh rằng $BE\parallel CF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai cặp song song $AB\parallel NF$ và $ME\parallel CD$ cho hai hệ quả Thalès: $\dfrac{OB}{OF}$ và $\dfrac{OE}{OC}$ cùng bằng $\dfrac{OM}{ON}$; hai tỉ số bằng nhau nên $BE\parallel CF$ theo định lí Thalès đảo, không cần đường phụ.

- n1 | - | $\dfrac{OB}{OF}=\dfrac{OM}{ON}$ | gt | $MB\parallel NF$, hệ quả của định lí Thalès cho $\triangle OMB$
- n2 | - | $\dfrac{OE}{OC}=\dfrac{OM}{ON}$ | gt | $ME\parallel NC$, hệ quả của định lí Thalès cho $\triangle OME$
- n3 | - | $\dfrac{OB}{OF}=\dfrac{OE}{OC}$ | n1, n2 | cùng bằng $\dfrac{OM}{ON}$
- n4 | - | $BE\parallel CF$ | n3 | định lí Thalès đảo cho $\triangle OBE$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $O$ nằm trong tứ giác $ABCD$ nên $O$ nằm giữa $M$ và $N$.
Vì $M$ thuộc đường thẳng $AB$, $N$ thuộc đường thẳng $NF$ và $AB\parallel NF$ (gt) nên $O$ nằm giữa hai đường thẳng song song $AB$ và $NF$,
do đó $O$ nằm giữa $B$ và $F$ ($B\in AB$, $F\in NF$, $B$, $O$, $F$ thẳng hàng).
Xét $\triangle OMB$ có $NF\parallel MB$ ($N$, $F$ lần lượt thuộc tia đối của tia $OM$, $OB$)
nên $\dfrac{OB}{OF}=\dfrac{OM}{ON}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Tương tự, $M$ thuộc đường thẳng $ME$, $N$ thuộc đường thẳng $CD$ và $ME\parallel CD$ (gt) nên $O$ nằm giữa hai đường thẳng song song $ME$ và $CD$,
do đó $O$ nằm giữa $E$ và $C$ ($E$, $O$, $C$ thẳng hàng).
Xét $\triangle OME$ có $NC\parallel ME$ ($N$, $C$ lần lượt thuộc tia đối của tia $OM$, $OE$)
nên $\dfrac{OE}{OC}=\dfrac{OM}{ON}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{OB}{OF}=\dfrac{OE}{OC}$,
hay $\dfrac{OF}{OB}=\dfrac{OC}{OE}$.
[[so-do:n4]]
Xét $\triangle OBE$ có $F$, $C$ lần lượt thuộc tia đối của tia $OB$, $OE$ và $\dfrac{OF}{OB}=\dfrac{OC}{OE}$
nên $FC\parallel BE$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-VD8.png
**nghi_van:** Hệ quả và Thalès đảo dùng ở dạng điểm nằm trên tia đối ($O$ nằm giữa hai đường song song); lời giải đã chứng minh vị trí $O$ trước khi dùng.

### TCHH-3.II.VD9 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD9@p141 (giải p142)
**sach:** Gọi $D=AI\cap BC$, $M=AG\cap BC$. Tính chất đường phân giác trong $\triangle ABD$ và $\triangle ACD$ cho $\dfrac{AI}{ID}=\dfrac{AB+AC}{BC}=2$, trọng tâm cho $\dfrac{AG}{GM}=2$; Thalès đảo trong $\triangle ADM$. Giữ nguyên. Phần "Chú ý" (bài đảo, đổi giả thiết thành $AB+AC<2BC$) của sách không đưa vào.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $AB+AC=2BC$. Gọi $I$ là giao điểm ba đường phân giác trong, $G$ là trọng tâm của tam giác $ABC$ ($I$ khác $G$). Chứng minh rằng $IG\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $D$, $M$ là giao điểm của $AI$, $AG$ với $BC$. Tính chất đường phân giác của $BI$ trong $\triangle ABD$ và $CI$ trong $\triangle ACD$ cho $\dfrac{AI}{ID}=\dfrac{AB+AC}{BC}=2$; trọng tâm cho $\dfrac{AG}{GM}=2$; rồi định lí Thalès đảo trong $\triangle ADM$.

- n1 | - | $\dfrac{AI}{ID}=\dfrac{AB+AC}{BC}$ | gt | $BI$, $CI$ là phân giác trong $\triangle ABD$, $\triangle ACD$ ($D=AI\cap BC$), dãy tỉ số bằng nhau
- n2 | - | $\dfrac{AI}{ID}=2$ | n1, gt | $AB+AC=2BC$
- n3 | - | $\dfrac{AG}{GM}=2$ | gt | $G$ là trọng tâm, $M$ là trung điểm $BC$
- n4 | - | $IG\parallel BC$ | n2, n3 | định lí Thalès đảo cho $\triangle ADM$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $D$ là giao điểm của $AI$ và $BC$, $M$ là giao điểm của $AG$ và $BC$.
Vì $G$ là trọng tâm của $\triangle ABC$ nên $AM$ là trung tuyến, $M$ là trung điểm của $BC$.
Vì $I$ là giao điểm ba đường phân giác trong nên $AD$ là tia phân giác của $\widehat{BAC}$, $BI$ là tia phân giác của $\widehat{ABD}$ và $CI$ là tia phân giác của $\widehat{ACD}$.
Xét $\triangle ABD$ có $BI$ là tia phân giác của $\widehat{ABD}$ ($I\in AD$)
nên $\dfrac{AI}{ID}=\dfrac{AB}{BD}$ (tính chất đường phân giác).
Xét $\triangle ACD$ có $CI$ là tia phân giác của $\widehat{ACD}$ ($I\in AD$)
nên $\dfrac{AI}{ID}=\dfrac{AC}{CD}$ (tính chất đường phân giác).
Suy ra $\dfrac{AI}{ID}=\dfrac{AB}{BD}=\dfrac{AC}{CD}=\dfrac{AB+AC}{BD+CD}=\dfrac{AB+AC}{BC}$ (tính chất dãy tỉ số bằng nhau, $D$ nằm giữa $B$ và $C$). (1)
[[so-do:n2]]
Mà $AB+AC=2BC$ (gt) nên từ (1) suy ra $\dfrac{AI}{ID}=2$. (2)
[[so-do:n3]]
Vì $G$ là trọng tâm của $\triangle ABC$ và $AM$ là trung tuyến nên $AG=\dfrac23AM$,
suy ra $\dfrac{AG}{GM}=2$. (3)
[[so-do:n4]]
Từ (2) và (3) suy ra $\dfrac{AI}{ID}=\dfrac{AG}{GM}$,
nên $\dfrac{AI}{AI+ID}=\dfrac{AG}{AG+GM}$ (tính chất tỉ lệ thức), hay $\dfrac{AI}{AD}=\dfrac{AG}{AM}$.
Vì $I\ne G$ nên $D\ne M$, do đó $\triangle ADM$ có $I\in AD$, $G\in AM$ và $\dfrac{AI}{AD}=\dfrac{AG}{AM}$
nên $IG\parallel DM$ (định lí Thalès đảo).
Mà $D$, $M$ thuộc $BC$ nên $IG\parallel BC$.
**hinh:** TCHH-3-II-VD9.png
**nghi_van:**

### TCHH-3.II.VD10 → DE_SAU (HH00163)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II VD10@p142 (giải p143–144) · Toán học tuổi trẻ số 438
**noi_dung:**
Cho tam giác $ABC$ nhọn có hai đường cao $BE$ và $CF$. Kẻ $FH$ và $EK$ cùng vuông góc với $BC$ ($H$, $K$ thuộc $BC$). Kẻ $HM$ song song với $AC$, $KN$ song song với $AB$ ($M$ thuộc $AB$, $N$ thuộc $AC$). Chứng minh rằng $EF\parallel MN$.
**ly_do:** lời giải cần hệ thức lượng $BE^2=BK\cdot BC$, $CF^2=CH\cdot CB$ và $\triangle ABE\backsim\triangle ACF$; Thalès chỉ cho $\dfrac{AM}{AB}=\dfrac{CH}{CB}$, $\dfrac{AN}{AC}=\dfrac{BK}{BC}$, còn tỉ số $\dfrac{AF}{AE}=\dfrac{AC}{AB}$ cũng đòi đồng dạng.
