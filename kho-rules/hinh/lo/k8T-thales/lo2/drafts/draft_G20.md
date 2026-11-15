### VHB2-VD34 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 VD34@p083 (giải p083)
**sach:** Ba lần Thalès (tam giác ABD, ADC, BCD) cho dây chuyền tỉ số, Thalès đảo cho MH ∥ AC; ý b chia đoạn trên hai đường chéo. Bản này ý b dùng hệ quả Thalès trực tiếp trong ABD và BAC.
**loai:** nhieu_y
**loi_dan:**
Cho tứ giác $ABCD$, điểm $M$ thuộc cạnh $AB$ ($M$ khác $A$, $B$). Lần lượt vẽ $ME\parallel BD$ ($E$ thuộc $AD$), $EG\parallel AC$ ($G$ thuộc $CD$), $GH\parallel BD$ ($H$ thuộc $BC$).
**hinh:** VHB2-VD34.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $MEGH$ là hình bình hành.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Ba cặp song song $ME\parallel BD$, $EG\parallel AC$, $GH\parallel BD$ cho dây chuyền tỉ số bằng nhau đi từ $M$ sang $H$; tỉ số đầu và cuối cho $MH\parallel AC$ nhờ định lí Thalès đảo, từ đó $MH\parallel EG$.

- n1 | - | $\dfrac{AM}{MB}=\dfrac{AE}{ED}$ | gt | $ME\parallel BD$, định lí Thalès cho $\triangle ABD$
- n2 | - | $\dfrac{AE}{ED}=\dfrac{CG}{GD}$ | gt | $EG\parallel AC$, định lí Thalès cho $\triangle DAC$
- n3 | - | $\dfrac{CG}{GD}=\dfrac{CH}{HB}$ | gt | $GH\parallel BD$, định lí Thalès cho $\triangle CDB$
- n4 | - | $MH\parallel AC$ | n1, n2, n3 | $\dfrac{BM}{BA}=\dfrac{BH}{BC}$, định lí Thalès đảo cho $\triangle BAC$
- n5 | - | $MEGH$ là hình bình hành | n4, gt | $MH\parallel EG$ và $ME\parallel GH$

**Phần 2. Trình bày**
[[so-do:n1]]
Xét $\triangle ABD$ có $ME\parallel BD$ ($M\in AB$, $E\in AD$) (gt)
nên $\dfrac{AM}{MB}=\dfrac{AE}{ED}$ (định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle DAC$ có $EG\parallel AC$ ($E\in DA$, $G\in DC$) (gt)
nên $\dfrac{DE}{EA}=\dfrac{DG}{GC}$ (định lí Thalès),
suy ra $\dfrac{AE}{ED}=\dfrac{CG}{GD}$. (2)
[[so-do:n3]]
Xét $\triangle CDB$ có $GH\parallel DB$ ($G\in CD$, $H\in CB$) (gt)
nên $\dfrac{CG}{GD}=\dfrac{CH}{HB}$ (định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{AM}{MB}=\dfrac{CH}{HB}$,
do đó $\dfrac{AM+MB}{MB}=\dfrac{CH+HB}{HB}$, tức $\dfrac{AB}{MB}=\dfrac{CB}{HB}$,
suy ra $\dfrac{BM}{BA}=\dfrac{BH}{BC}$.
Xét $\triangle BAC$ có $M\in BA$, $H\in BC$ và $\dfrac{BM}{BA}=\dfrac{BH}{BC}$
nên $MH\parallel AC$ (định lí Thalès đảo).
[[so-do:n5]]
Mà $EG\parallel AC$ (gt) nên $MH\parallel EG$.
Lại có $ME\parallel BD$ và $GH\parallel BD$ (gt) nên $ME\parallel GH$.
Tứ giác $MEGH$ có hai cặp cạnh đối song song
nên $MEGH$ là hình bình hành.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Tính chu vi tứ giác $MEGH$, nếu $ABCD$ là hình chữ nhật có đường chéo bằng $m$.
**da_biet:** Biết $MEGH$ là hình bình hành (ý a).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai cạnh kề $ME$, $MH$ lần lượt song song với hai đường chéo $BD$, $AC$, nên mỗi cạnh bằng đường chéo nhân một tỉ số cắt trên $AB$; hai tỉ số đó cộng lại bằng 1.
**Bước 1.** Chu vi hình bình hành bằng $2(ME+MH)$, nên chỉ cần tính tổng hai cạnh kề.
**Bước 2.** Trong $\triangle ABD$ có $ME\parallel BD$: viết $ME$ qua $BD$ và tỉ số $\dfrac{AM}{AB}$.
**Bước 3.** Trong $\triangle BAC$ có $MH\parallel AC$ (ý a): viết $MH$ qua $AC$ và tỉ số $\dfrac{BM}{BA}$.
**Bước 4.** Hai đường chéo hình chữ nhật bằng nhau ($=m$) nên cộng lại, hai tỉ số có tổng bằng 1.
**Chú ý:** chỉ cần $AC=BD=m$, không dùng đến góc vuông.

**Phần 2. Trình bày**
Xét $\triangle ABD$ có $ME\parallel BD$ ($M\in AB$, $E\in AD$)
nên $\dfrac{ME}{BD}=\dfrac{AM}{AB}$ (hệ quả của định lí Thalès).
Xét $\triangle BAC$ có $MH\parallel AC$ ($M\in BA$, $H\in BC$)
nên $\dfrac{MH}{AC}=\dfrac{BM}{BA}$ (hệ quả của định lí Thalès).
Vì $ABCD$ là hình chữ nhật nên $AC=BD=m$.
Do đó $ME+MH=m\cdot\dfrac{AM}{AB}+m\cdot\dfrac{BM}{AB}=m\cdot\dfrac{AM+BM}{AB}=m$ ($M$ nằm giữa $A$, $B$).
Vì $MEGH$ là hình bình hành (ý a) nên $EG=MH$ và $GH=ME$.
Chu vi $MEGH$ bằng $2(ME+MH)=2m$.
Vậy chu vi tứ giác $MEGH$ bằng $2m$.
**hinh_lg:** VHB2-VD34_b_lg.png
**nghi_van:** Đề sách không loại trường hợp $M\equiv A$, $B$ (khi đó tứ giác suy biến): thêm "$M$ khác $A$, $B$".

### VHB2-VD35 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 VD35@p083-084 (giải p084)
**sach:** Cách 1: lấy M, N chia BD, FC theo 1:2; Thalès đảo ba lần (MI ∥ BE, NK ∥ EC, MN ∥ BC) rồi tiên đề Ơ-clit. Cách 2: M trung điểm AF, N = DM ∩ EF, Thalès đảo. Bản này trình bày Cách 1.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $D$, $E$, $F$ theo thứ tự chia trong các cạnh $AB$, $BC$, $CA$ theo tỉ số $1:2$, nghĩa là $AD:DB=BE:EC=CF:FA=1:2$. Các điểm $I$, $K$ theo thứ tự chia trong các đoạn thẳng $ED$, $FE$ theo tỉ số $1:2$, nghĩa là $EI:ID=FK:KE=1:2$. Chứng minh rằng $IK\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Lấy $M$ chia $BD$ và $N$ chia $FC$ theo tỉ số $1:2$ để có ba đoạn $MI$, $MN$, $NK$ cùng song song $BC$ (Thalès đảo cho $\triangle DBE$, $\triangle ABC$, $\triangle FEC$); qua một điểm chỉ có một đường song song nên $M$, $I$, $K$, $N$ thẳng hàng. (Cách khác: lấy $M$ là trung điểm $AF$, $N=DM\cap EF$, chứng minh $DM\parallel BC$ rồi $IK\parallel DN$ bằng Thalès đảo.)

- n1 | - | $MI\parallel BE$ | gt | $\dfrac{DM}{DB}=\dfrac{DI}{DE}=\dfrac23$, Thalès đảo cho $\triangle DBE$
- n2 | - | $NK\parallel EC$ | gt | $\dfrac{FN}{FC}=\dfrac{FK}{FE}=\dfrac13$, Thalès đảo cho $\triangle FEC$
- n3 | - | $MN\parallel BC$ | gt | $\dfrac{BM}{BA}=\dfrac{CN}{CA}=\dfrac29$, Thalès đảo cho $\triangle ABC$
- n4 | - | $IK\parallel BC$ | n1, n2, n3 | $M$, $I$, $K$, $N$ cùng nằm trên đường thẳng qua $M$ song song $BC$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $M$ thuộc $BD$ với $BM:MD=1:2$ và $N$ thuộc $FC$ với $FN:NC=1:2$.
Khi đó $\dfrac{DM}{DB}=\dfrac23$; từ $EI:ID=1:2$ suy ra $\dfrac{DI}{DE}=\dfrac23$.
Xét $\triangle DBE$ có $M\in DB$, $I\in DE$ và $\dfrac{DM}{DB}=\dfrac{DI}{DE}$
nên $MI\parallel BE$ (định lí Thalès đảo).
[[so-do:n2]]
Từ $FN:NC=1:2$ suy ra $\dfrac{FN}{FC}=\dfrac13$; từ $FK:KE=1:2$ suy ra $\dfrac{FK}{FE}=\dfrac13$.
Xét $\triangle FEC$ có $N\in FC$, $K\in FE$ và $\dfrac{FN}{FC}=\dfrac{FK}{FE}$
nên $NK\parallel EC$ (định lí Thalès đảo).
[[so-do:n3]]
Từ $AD:DB=1:2$ suy ra $\dfrac{BD}{BA}=\dfrac23$; từ $BM:MD=1:2$ suy ra $\dfrac{BM}{BD}=\dfrac13$.
Do đó $\dfrac{BM}{BA}=\dfrac{BM}{BD}\cdot\dfrac{BD}{BA}=\dfrac13\cdot\dfrac23=\dfrac29$.
Từ $CF:FA=1:2$ suy ra $\dfrac{CF}{CA}=\dfrac13$; từ $FN:NC=1:2$ suy ra $\dfrac{CN}{CF}=\dfrac23$.
Do đó $\dfrac{CN}{CA}=\dfrac{CN}{CF}\cdot\dfrac{CF}{CA}=\dfrac23\cdot\dfrac13=\dfrac29$.
Xét $\triangle ABC$ có $M\in BA$, $N\in CA$ và $\dfrac{BM}{BA}=\dfrac{CN}{CA}$
nên $MN\parallel BC$ (định lí Thalès đảo).
[[so-do:n4]]
Vì $B$, $E$, $C$ thẳng hàng nên $MI\parallel BC$ và $NK\parallel BC$.
Qua $M$ chỉ có một đường thẳng song song với $BC$, mà $MI$ và $MN$ đều như vậy
nên $I$ thuộc đường thẳng $MN$.
Qua $N$ chỉ có một đường thẳng song song với $BC$, mà $NK$ và $NM$ đều như vậy
nên $K$ thuộc đường thẳng $MN$.
Vậy $M$, $I$, $K$, $N$ thẳng hàng; vì $I\ne K$ ($I\in ED$, $K\in FE$, cả hai khác $E$)
nên $IK\parallel BC$.
**hinh:** VHB2-VD35.png
**hinh_lg:** VHB2-VD35_lg.png
**nghi_van:** Sách viết "chia trong theo tỉ số 1:2" không nói chiều; hiểu theo hình và lời giải sách: $AD:DB$, $BE:EC$, $CF:FA$, $EI:ID$, $FK:KE$ đều $=1:2$ — đã ghi tường minh vào đề.

### VHB2-208 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT208@p084-085 (giải p199)
**sach:** Hệ quả Thalès cho cặp song song AB ∥ DM, AB ∥ CM (cắt phần kéo dài) rồi Thalès đảo; ý b hệ quả Thalès trong các tam giác AMD, AMC.
**loai:** nhieu_y
**loi_dan:**
Cho hình thang $ABCD$ ($AB\parallel CD$), $M$ là trung điểm của $CD$. Gọi $I$ là giao điểm của $AM$ và $BD$, $K$ là giao điểm của $BM$ và $AC$.
**hinh:** VHB2-208.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $IK\parallel AB$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $AB\parallel DM$ và $AB\parallel CM$ cho hai tỉ số $\dfrac{MI}{IA}$, $\dfrac{MK}{KB}$ cùng bằng $\dfrac{DM}{AB}$ (vì $DM=CM$); từ đó Thalès đảo trong $\triangle MAB$.

- n1 | - | $\dfrac{MI}{IA}=\dfrac{DM}{AB}$ | gt | $AB\parallel DM$, hệ quả của định lí Thalès cho $\triangle IAB$ (cắt phần kéo dài hai cạnh)
- n2 | - | $\dfrac{MK}{KB}=\dfrac{CM}{AB}$ | gt | $AB\parallel CM$, hệ quả của định lí Thalès cho $\triangle KAB$
- n3 | - | $\dfrac{MI}{IA}=\dfrac{MK}{KB}$ | n1, n2 | $DM=CM$
- n4 | - | $IK\parallel AB$ | n3 | định lí Thalès đảo cho $\triangle MAB$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $AB\parallel CD$ (gt) nên $AB\parallel DM$.
Xét $\triangle IAB$ có $DM\parallel AB$ ($M$, $D$ thuộc phần kéo dài của $IA$, $IB$)
nên $\dfrac{IM}{IA}=\dfrac{ID}{IB}=\dfrac{DM}{AB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Tương tự $AB\parallel CM$; xét $\triangle KAB$ có $CM\parallel AB$ ($M$, $C$ thuộc phần kéo dài của $KB$, $KA$)
nên $\dfrac{KM}{KB}=\dfrac{KC}{KA}=\dfrac{CM}{AB}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Vì $M$ là trung điểm của $CD$ nên $DM=CM$.
Từ (1) và (2) suy ra $\dfrac{MI}{IA}=\dfrac{MK}{KB}$.
[[so-do:n4]]
Từ đó $\dfrac{MI+IA}{IA}=\dfrac{MK+KB}{KB}$, tức $\dfrac{MA}{IA}=\dfrac{MB}{KB}$, suy ra $\dfrac{MI}{MA}=\dfrac{MK}{MB}$.
Xét $\triangle MAB$ có $I\in MA$, $K\in MB$ và $\dfrac{MI}{MA}=\dfrac{MK}{MB}$
nên $IK\parallel AB$ (định lí Thalès đảo).
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Đường thẳng $IK$ cắt $AD$, $BC$ theo thứ tự ở $E$, $F$. Chứng minh rằng $EI=IK=KF$.
**da_biet:** Biết $IK\parallel AB$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $IK\parallel AB\parallel CD$ nên $EI\parallel DM$, $IK\parallel DM\parallel MC$, $KF\parallel MC$; mỗi đoạn $EI$, $IK$, $KF$ bằng $DM$ (hay $MC$) nhân một tỉ số, và các tỉ số đó trùng nhau.

- n1 | - | $\dfrac{EI}{DM}=\dfrac{AI}{AM}$ | gt | $EI\parallel DM$, hệ quả của định lí Thalès cho $\triangle AMD$
- n2 | - | $\dfrac{IK}{MC}=\dfrac{AI}{AM}$ | gt | $IK\parallel MC$, hệ quả của định lí Thalès cho $\triangle AMC$
- n3 | - | $EI=IK$ | n1, n2 | $DM=MC$
- n4 | - | $\dfrac{IK}{DM}=\dfrac{BK}{BM}$ | gt | $IK\parallel DM$, hệ quả của định lí Thalès cho $\triangle BDM$
- n5 | - | $\dfrac{KF}{MC}=\dfrac{BK}{BM}$ | gt | $KF\parallel MC$, hệ quả của định lí Thalès cho $\triangle BMC$
- n6 | - | $IK=KF$ | n4, n5 | $DM=MC$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $IK\parallel AB$ và $AB\parallel CD$ nên $EI\parallel DM$.
Xét $\triangle AMD$ có $EI\parallel DM$ ($E\in AD$, $I\in AM$)
nên $\dfrac{EI}{DM}=\dfrac{AI}{AM}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle AMC$ có $IK\parallel MC$ ($I\in AM$, $K\in AC$)
nên $\dfrac{IK}{MC}=\dfrac{AI}{AM}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{EI}{DM}=\dfrac{IK}{MC}$.
Mà $DM=MC$ ($M$ là trung điểm $CD$) nên $EI=IK$.
[[so-do:n4]]
Xét $\triangle BDM$ có $IK\parallel DM$ ($I\in BD$, $K\in BM$)
nên $\dfrac{IK}{DM}=\dfrac{BK}{BM}$ (hệ quả của định lí Thalès). (3)
[[so-do:n5]]
Xét $\triangle BMC$ có $KF\parallel MC$ ($K\in BM$, $F\in BC$)
nên $\dfrac{KF}{MC}=\dfrac{BK}{BM}$ (hệ quả của định lí Thalès). (4)
[[so-do:n6]]
Từ (3) và (4) suy ra $\dfrac{IK}{DM}=\dfrac{KF}{MC}$, mà $DM=MC$ nên $IK=KF$.
Vậy $EI=IK=KF$.
**hinh_lg:** VHB2-208_b_lg.png
**nghi_van:**

### VHB2-209 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT209@p085 (giải p199)
**sach:** Gọi M = AB ∩ KC, N = AE ∩ BK; hai hệ quả Thalès cho AN/NE = MK/KC, rồi = KA/KD (AM ∥ CD); Thalès đảo cho △ADE.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Điểm $E$ thuộc cạnh bên $BC$ của hình thang $ABCD$ ($AB\parallel CD$). Vẽ đường thẳng đi qua $C$ và song song với $AE$, cắt $AD$ ở $K$. Chứng minh rằng $BK\parallel DE$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $M=AB\cap KC$, $N=AE\cap BK$. Hai cặp song song $AN\parallel MK$, $NE\parallel KC$ cho $\dfrac{AN}{NE}=\dfrac{MK}{KC}$; $AM\parallel DC$ cho $\dfrac{MK}{KC}=\dfrac{KA}{KD}$; hai tỉ số trùng nhau nên Thalès đảo trong $\triangle ADE$ cho $KN\parallel DE$.

- n1 | - | $\dfrac{AN}{MK}=\dfrac{BN}{BK}=\dfrac{NE}{KC}$ | gt | $AN\parallel MK$, $NE\parallel KC$, hệ quả của định lí Thalès cho $\triangle BMK$, $\triangle BKC$
- n2 | - | $\dfrac{AN}{NE}=\dfrac{MK}{KC}$ | n1 | chia hai vế
- n3 | - | $\dfrac{MK}{KC}=\dfrac{KA}{KD}$ | gt | $AM\parallel DC$, hệ quả của định lí Thalès cho $\triangle KDC$
- n4 | - | $\dfrac{AN}{NE}=\dfrac{AK}{KD}$ | n2, n3 | bắc cầu
- n5 | - | $BK\parallel DE$ | n4 | định lí Thalès đảo cho $\triangle ADE$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $M$ là giao điểm của $AB$ và $KC$, $N$ là giao điểm của $AE$ và $BK$.
Vì $AE\parallel KC$ (gt) nên $AN\parallel MK$ và $NE\parallel KC$.
Xét $\triangle BMK$ có $AN\parallel MK$ ($A\in BM$, $N\in BK$)
nên $\dfrac{AN}{MK}=\dfrac{BN}{BK}$ (hệ quả của định lí Thalès).
Xét $\triangle BKC$ có $NE\parallel KC$ ($N\in BK$, $E\in BC$)
nên $\dfrac{NE}{KC}=\dfrac{BN}{BK}$ (hệ quả của định lí Thalès).
[[so-do:n2]]
Suy ra $\dfrac{AN}{MK}=\dfrac{NE}{KC}$, tức $\dfrac{AN}{NE}=\dfrac{MK}{KC}$. (1)
[[so-do:n3]]
Vì $AB\parallel CD$ nên $AM\parallel DC$.
Xét $\triangle KDC$ có $AM\parallel DC$ ($A\in$ đường thẳng $KD$, $M\in$ đường thẳng $KC$)
nên $\dfrac{KM}{KC}=\dfrac{KA}{KD}$ (hệ quả của định lí Thalès). (2)
[[so-do:n4]]
Từ (1) và (2) suy ra $\dfrac{AN}{NE}=\dfrac{AK}{KD}$.
[[so-do:n5]]
Xét $\triangle ADE$ có $K\in AD$, $N\in AE$ và $\dfrac{AK}{KD}=\dfrac{AN}{NE}$,
nên $\dfrac{AK}{AD}=\dfrac{AN}{AE}$, suy ra $KN\parallel DE$ (định lí Thalès đảo).
Mà $B$ thuộc đường thẳng $KN$ nên $BK\parallel DE$.
**hinh:** VHB2-209.png
**hinh_lg:** VHB2-209_lg.png
**nghi_van:** Đề sách không ghi $AB\parallel CD$; suy từ "cạnh bên $BC$" và lời giải sách ($AM\parallel CD$) — đã thêm vào đề.

### VHB2-210 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT210@p085 (giải p199)
**sach:** Hai hệ quả Thalès (NK ∥ IC, IM ∥ BK), nhân vế, Thalès đảo.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, điểm $I$ thuộc cạnh $AB$, điểm $K$ thuộc cạnh $AC$. Vẽ $IM\parallel BK$ ($M\in AC$), vẽ $KN\parallel CI$ ($N\in AB$). Chứng minh rằng $MN\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai cặp song song cho hai tỉ lệ thức có chung đoạn $AI$ và $AK$; nhân vế khử chúng, còn $\dfrac{AN}{AB}=\dfrac{AM}{AC}$.

- n1 | - | $\dfrac{AN}{AI}=\dfrac{AK}{AC}$ | gt | $NK\parallel IC$, hệ quả của định lí Thalès cho $\triangle AIC$
- n2 | - | $\dfrac{AI}{AB}=\dfrac{AM}{AK}$ | gt | $IM\parallel BK$, hệ quả của định lí Thalès cho $\triangle ABK$
- n3 | - | $\dfrac{AN}{AB}=\dfrac{AM}{AC}$ | n1, n2 | nhân vế với vế
- n4 | - | $MN\parallel BC$ | n3 | định lí Thalès đảo cho $\triangle ABC$

**Phần 2. Trình bày**
[[so-do:n1]]
Xét $\triangle AIC$ có $NK\parallel IC$ ($N\in AI$, $K\in AC$)
nên $\dfrac{AN}{AI}=\dfrac{AK}{AC}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ABK$ có $IM\parallel BK$ ($I\in AB$, $M\in AK$)
nên $\dfrac{AI}{AB}=\dfrac{AM}{AK}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân từng vế (1) và (2): $\dfrac{AN}{AI}\cdot\dfrac{AI}{AB}=\dfrac{AK}{AC}\cdot\dfrac{AM}{AK}$,
tức $\dfrac{AN}{AB}=\dfrac{AM}{AC}$.
[[so-do:n4]]
Xét $\triangle ABC$ có $N\in AB$, $M\in AC$ và $\dfrac{AN}{AB}=\dfrac{AM}{AC}$
nên $MN\parallel BC$ (định lí Thalès đảo).
**hinh:** VHB2-210.png
**nghi_van:**

### VHB2-211 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT211@p085 (giải p200)
**sach:** Gọi O = AC ∩ BD; hai hệ quả Thalès (AE ∥ BC, BG ∥ AD) nhân vế rồi Thalès đảo cho EG ∥ DC; ý b là dây chuyền tỉ số qua O.
**loai:** nhieu_y
**loi_dan:**
Cho tứ giác lồi $ABCD$. Đường thẳng đi qua $A$ và song song với $BC$ cắt $BD$ ở $E$. Đường thẳng đi qua $B$ và song song với $AD$ cắt $AC$ ở $G$.
**hinh:** VHB2-211.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $EG\parallel DC$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $O$ là giao điểm của $AC$ và $BD$. Hai cặp song song $AE\parallel BC$, $BG\parallel AD$ cho hai tỉ lệ thức chứa $OB$ và $OA$; nhân vế khử chúng được $\dfrac{OE}{OD}=\dfrac{OG}{OC}$.

- n1 | - | $\dfrac{OE}{OB}=\dfrac{OA}{OC}$ | gt | $AE\parallel BC$, hệ quả của định lí Thalès cho $\triangle OBC$ (cắt phần kéo dài hai cạnh)
- n2 | - | $\dfrac{OB}{OD}=\dfrac{OG}{OA}$ | gt | $BG\parallel AD$, hệ quả của định lí Thalès cho $\triangle ODA$
- n3 | - | $\dfrac{OE}{OD}=\dfrac{OG}{OC}$ | n1, n2 | nhân vế với vế
- n4 | - | $EG\parallel DC$ | n3 | định lí Thalès đảo cho $\triangle ODC$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $O$ là giao điểm của $AC$ và $BD$ ($O$ nằm giữa $A$, $C$ và giữa $B$, $D$ vì $ABCD$ lồi).
Xét $\triangle OBC$ có $AE\parallel BC$ ($E$ thuộc tia $OD$, $A$ thuộc tia đối của tia $OC$)
nên $\dfrac{OE}{OB}=\dfrac{OA}{OC}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ODA$ có $BG\parallel AD$ ($B$ thuộc tia đối của tia $OD$, $G$ thuộc tia đối của tia $OA$)
nên $\dfrac{OB}{OD}=\dfrac{OG}{OA}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân từng vế (1) và (2): $\dfrac{OE}{OB}\cdot\dfrac{OB}{OD}=\dfrac{OA}{OC}\cdot\dfrac{OG}{OA}$,
tức $\dfrac{OE}{OD}=\dfrac{OG}{OC}$.
[[so-do:n4]]
Xét $\triangle ODC$ có $E$ thuộc tia $OD$, $G$ thuộc tia $OC$ và $\dfrac{OE}{OD}=\dfrac{OG}{OC}$
nên $EG\parallel DC$ (định lí Thalès đảo).
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Giả sử $AB\parallel CD$. Chứng minh rằng $AB^2=EG\cdot DC$.
**da_biet:** Biết $EG\parallel DC$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Chứng minh $\dfrac{AB}{EG}=\dfrac{DC}{AB}$ bằng dây chuyền tỉ số cùng qua $O$: $AB\parallel EG$ cho $\dfrac{AB}{EG}=\dfrac{OA}{OG}$, rồi $\dfrac{OA}{OG}=\dfrac{OD}{OB}$ (từ $BG\parallel AD$) và $\dfrac{OD}{OB}=\dfrac{DC}{AB}$ (từ $AB\parallel DC$).

- n1 | - | $\dfrac{AB}{EG}=\dfrac{OA}{OG}$ | gt | $AB\parallel EG$ (cùng song song $DC$), hệ quả của định lí Thalès cho $\triangle OGE$
- n2 | - | $\dfrac{OA}{OG}=\dfrac{OD}{OB}$ | gt | $BG\parallel AD$, hệ quả của định lí Thalès cho $\triangle ODA$
- n3 | - | $\dfrac{OD}{OB}=\dfrac{DC}{AB}$ | gt | $AB\parallel DC$, hệ quả của định lí Thalès cho $\triangle OAB$
- n4 | - | $\dfrac{AB}{EG}=\dfrac{DC}{AB}$ | n1, n2, n3 | bắc cầu
- n5 | - | $AB^2=EG\cdot DC$ | n4 | nhân chéo

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $O$ là giao điểm của $AC$ và $BD$.
Vì $EG\parallel DC$ (ý a) và $AB\parallel DC$ (gt) nên $AB\parallel EG$.
Xét $\triangle OGE$ có $AB\parallel GE$ ($A$, $B$ thuộc phần kéo dài của $OG$, $OE$)
nên $\dfrac{AB}{EG}=\dfrac{OA}{OG}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ODA$ có $BG\parallel AD$ (gt)
nên $\dfrac{OG}{OA}=\dfrac{OB}{OD}$, suy ra $\dfrac{OA}{OG}=\dfrac{OD}{OB}$. (2)
[[so-do:n3]]
Xét $\triangle OAB$ có $DC\parallel AB$ ($D$, $C$ thuộc phần kéo dài của $OB$, $OA$)
nên $\dfrac{OD}{OB}=\dfrac{DC}{AB}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{AB}{EG}=\dfrac{DC}{AB}$.
[[so-do:n5]]
Nhân chéo: $AB^2=EG\cdot DC$ (đpcm).
**hinh_lg:** VHB2-211_b_lg.png
**nghi_van:** Đề sách "tứ giác $ABCD$": thêm "lồi" (hình sách lồi) để $O$ nằm giữa hai đường chéo.

### VHB2-212 → DE_SAU (HH00127)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT212@p084 (giải p200)
**noi_dung:** Tứ giác $ABCD$ có $AC$ vuông góc và bằng $BD$. Các điểm $E$, $F$, $G$, $H$ theo thứ tự chia trong các cạnh $AB$, $BC$, $CD$, $DA$ theo tỉ số $1:2$. Chứng minh rằng $EG=FH$, $EG$ vuông góc với $FH$.
**ly_do:** Thalès cho $EM\parallel AC$, $MG\parallel BD$ ($M$ trung điểm $CF$) rất gọn, nhưng $EG\perp FH$ cần hai tam giác vuông bằng nhau mà cạnh tương ứng vuông góc từng đôi với đúng chiều (thực chất phép quay 90°/vectơ); lập luận sơ cấp phải xét vị trí giao điểm, dài và gượng — để lô sau.

### VHB2-213 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT213@p084 (giải p200)
**sach:** Gọi H là trực tâm; ba lần Thalès đảo cho IK ∥ FE, MN ∥ FE, IN ∥ FE rồi tiên đề Ơ-clit.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác nhọn $ABC$, các đường cao $AD$, $BE$, $CF$. Gọi $I$, $K$, $M$, $N$ theo thứ tự là chân các đường vuông góc kẻ từ $D$ đến $BA$, $BE$, $CF$, $CA$. Chứng minh rằng bốn điểm $I$, $K$, $M$, $N$ thẳng hàng.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $H$ là trực tâm. Ba đường thẳng $IK$, $MN$, $IN$ đều song song với $FE$: hai đường đầu nhờ các cặp song song cùng vuông góc ($DI\parallel CF$, $DK\parallel AC$, $DM\parallel AB$, $DN\parallel BE$), đường thứ ba nhờ $DI\parallel HF$, $DN\parallel HE$; qua $N$ chỉ có một đường song song với $FE$ nên bốn điểm thẳng hàng.

- n1 | - | $\dfrac{BI}{IF}=\dfrac{BD}{DC}=\dfrac{BK}{KE}$ | gt | $DI\parallel CF$, $DK\parallel EC$, định lí Thalès cho $\triangle BFC$, $\triangle BEC$
- n2 | - | $IK\parallel FE$ | n1 | định lí Thalès đảo cho $\triangle BFE$
- n3 | - | $\dfrac{CM}{MF}=\dfrac{CD}{DB}=\dfrac{CN}{NE}$ | gt | $DM\parallel BF$, $DN\parallel BE$, định lí Thalès cho $\triangle CBF$, $\triangle CBE$
- n4 | - | $MN\parallel FE$ | n3 | định lí Thalès đảo cho $\triangle CFE$
- n5 | - | $\dfrac{IF}{FA}=\dfrac{DH}{HA}=\dfrac{NE}{EA}$ | gt | $FH\parallel ID$, $EH\parallel ND$, định lí Thalès cho $\triangle AID$, $\triangle AND$
- n6 | - | $IN\parallel FE$ | n5 | định lí Thalès đảo cho $\triangle AIN$
- n7 | - | $I$, $K$, $M$, $N$ thẳng hàng | n2, n4, n6 | qua một điểm chỉ có một đường thẳng song song với $FE$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $DI\perp AB$ và $CF\perp AB$ nên $DI\parallel CF$.
Xét $\triangle BFC$ có $DI\parallel CF$ ($I\in BF$, $D\in BC$)
nên $\dfrac{BI}{IF}=\dfrac{BD}{DC}$ (định lí Thalès). (1)
Vì $DK\perp BE$ và $AC\perp BE$ nên $DK\parallel AC$, mà $E\in AC$ nên $DK\parallel EC$.
Xét $\triangle BEC$ có $DK\parallel EC$ ($K\in BE$, $D\in BC$)
nên $\dfrac{BK}{KE}=\dfrac{BD}{DC}$ (định lí Thalès). (2)
[[so-do:n2]]
Từ (1) và (2) suy ra $\dfrac{BI}{IF}=\dfrac{BK}{KE}$, tức $\dfrac{BI}{BF}=\dfrac{BK}{BE}$.
Xét $\triangle BFE$ có $I\in BF$, $K\in BE$
nên $IK\parallel FE$ (định lí Thalès đảo). (3)
[[so-do:n3]]
Vì $DM\perp CF$ và $AB\perp CF$ nên $DM\parallel AB$, mà $F\in AB$ nên $DM\parallel BF$.
Xét $\triangle CBF$ có $DM\parallel BF$ ($D\in CB$, $M\in CF$)
nên $\dfrac{CM}{MF}=\dfrac{CD}{DB}$ (định lí Thalès). (4)
Vì $DN\perp CA$ và $BE\perp CA$ nên $DN\parallel BE$.
Xét $\triangle CBE$ có $DN\parallel BE$ ($D\in CB$, $N\in CE$)
nên $\dfrac{CN}{NE}=\dfrac{CD}{DB}$ (định lí Thalès). (5)
[[so-do:n4]]
Từ (4) và (5) suy ra $\dfrac{CM}{MF}=\dfrac{CN}{NE}$.
Xét $\triangle CFE$ có $M\in CF$, $N\in CE$
nên $MN\parallel FE$ (định lí Thalès đảo). (6)
[[so-do:n5]]
Gọi $H$ là giao điểm của $AD$, $BE$, $CF$ (trực tâm).
Vì $DI\parallel CF$ nên $DI\parallel HF$. Xét $\triangle AID$ có $FH\parallel ID$ ($F\in AI$, $H\in AD$)
nên $\dfrac{AF}{AI}=\dfrac{AH}{AD}$ (hệ quả của định lí Thalès).
Tam giác nhọn nên $F$ nằm giữa $A$, $B$ và $H$ nằm giữa $A$, $D$; theo (1) $I$ nằm giữa $F$, $B$; do đó $F$ nằm giữa $A$, $I$,
suy ra $\dfrac{AF}{AF+FI}=\dfrac{AH}{AH+HD}$, tức $\dfrac{IF}{FA}=\dfrac{DH}{HA}$. (7)
Vì $DN\parallel BE$ nên $DN\parallel HE$. Xét $\triangle AND$ có $EH\parallel ND$ ($E\in AN$, $H\in AD$)
nên $\dfrac{AE}{AN}=\dfrac{AH}{AD}$. Tương tự ($E$ nằm giữa $A$, $N$), $\dfrac{NE}{EA}=\dfrac{DH}{HA}$. (8)
[[so-do:n6]]
Từ (7) và (8) suy ra $\dfrac{IF}{FA}=\dfrac{NE}{EA}$, do đó $\dfrac{AI}{AF}=\dfrac{AN}{AE}$, tức $\dfrac{AF}{AI}=\dfrac{AE}{AN}$.
Xét $\triangle AIN$ có $F\in AI$, $E\in AN$
nên $FE\parallel IN$ (định lí Thalès đảo). (9)
[[so-do:n7]]
Từ (3) và (9): $IK$ và $IN$ cùng đi qua $I$ và cùng song song với $FE$ nên trùng nhau, do đó $K\in IN$.
Từ (6) và (9): $MN$ và $IN$ cùng đi qua $N$ và cùng song song với $FE$ nên trùng nhau, do đó $M\in IN$.
Vậy bốn điểm $I$, $K$, $M$, $N$ thẳng hàng.
**hinh:** VHB2-213.png
**hinh_lg:** VHB2-213_lg.png
**nghi_van:**

### VHB2-214 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT214@p084 (giải p200-201)
**sach:** Gọi N trung điểm AM, tính $\dfrac{AN}{ND}$ qua hai hệ quả Thalès; NI, NK là đường trung bình của △MAB, △MAC.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, điểm $D$ thuộc cạnh $BC$ ($D$ khác $B$, $C$), điểm $M$ nằm giữa $A$ và $D$. Gọi $I$, $K$ theo thứ tự là trung điểm của $MB$, $MC$. Gọi $E$ là giao điểm của $DI$ và $AB$, gọi $F$ là giao điểm của $DK$ và $AC$. Chứng minh rằng $EF\parallel IK$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $N$ là trung điểm của $AM$: $NI$, $NK$ là đường trung bình của $\triangle MAB$, $\triangle MAC$ nên $NI\parallel AB$, $NK\parallel AC$. Hai tam giác $DAE$, $DAF$ cho $\dfrac{EI}{ID}=\dfrac{AN}{ND}=\dfrac{FK}{KD}$; Thalès đảo trong $\triangle DEF$.

- n1 | - | $NI\parallel AB$, $NK\parallel AC$ | gt | $NI$, $NK$ là đường trung bình của $\triangle MAB$, $\triangle MAC$
- n2 | - | $\dfrac{EI}{ID}=\dfrac{AN}{ND}$ | n1 | $NI\parallel AE$, định lí Thalès cho $\triangle DAE$
- n3 | - | $\dfrac{FK}{KD}=\dfrac{AN}{ND}$ | n1 | $NK\parallel AF$, định lí Thalès cho $\triangle DAF$
- n4 | - | $\dfrac{EI}{ID}=\dfrac{FK}{KD}$ | n2, n3 | bắc cầu
- n5 | - | $EF\parallel IK$ | n4 | định lí Thalès đảo cho $\triangle DEF$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $N$ là trung điểm của $AM$.
Xét $\triangle MAB$ có $N$, $I$ là trung điểm của $MA$, $MB$
nên $NI$ là đường trung bình, suy ra $NI\parallel AB$.
Xét $\triangle MAC$ có $N$, $K$ là trung điểm của $MA$, $MC$
nên $NK$ là đường trung bình, suy ra $NK\parallel AC$.
[[so-do:n2]]
Xét $\triangle DAE$ có $NI\parallel AE$ ($N\in DA$, $I\in DE$)
nên $\dfrac{DN}{DA}=\dfrac{DI}{DE}$ (định lí Thalès),
suy ra $\dfrac{DA-DN}{DN}=\dfrac{DE-DI}{DI}$, tức $\dfrac{AN}{ND}=\dfrac{EI}{ID}$. (1)
[[so-do:n3]]
Xét $\triangle DAF$ có $NK\parallel AF$ ($N\in DA$, $K\in DF$)
nên $\dfrac{DN}{DA}=\dfrac{DK}{DF}$ (định lí Thalès),
suy ra tương tự $\dfrac{AN}{ND}=\dfrac{FK}{KD}$. (2)
[[so-do:n4]]
Từ (1) và (2) suy ra $\dfrac{EI}{ID}=\dfrac{FK}{KD}$.
[[so-do:n5]]
Do đó $\dfrac{DI}{DE}=\dfrac{DK}{DF}$.
Xét $\triangle DEF$ có $I\in DE$, $K\in DF$
nên $IK\parallel EF$ (định lí Thalès đảo).
**hinh:** VHB2-214.png
**hinh_lg:** VHB2-214_lg.png
**nghi_van:** Đề sách không loại $D\equiv B$, $C$ (khi đó $E$ hoặc $F$ suy biến): thêm "$D$ khác $B$, $C$".

### VHB2-215 → TRUNG (TCHH-5.16)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT215@p084 (giải p201)
**ly_do:** giống hệt TCHH-5.16 (hai ý a: BD, CE chia HG thành ba phần bằng nhau; b: OM đi qua trung điểm HG), chỉ khác tên điểm.

### VHB2-216 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT216@p084 (giải p201)
**sach:** Ý a: Thalès cho DH/HC = DM/MA = BN/NC rồi Thalès đảo. Ý b: gọi G = HM ∩ BD, Q = HN ∩ AC; GQ ∥ MN; OGHQ là hình bình hành.
**loai:** nhieu_y
**loi_dan:**
Cho hình thang $ABCD$ ($AB\parallel CD$). Các điểm $M$, $N$ thuộc các cạnh $AD$, $BC$ sao cho $\dfrac{AM}{MD}=\dfrac{CN}{NB}$. Gọi các giao điểm của $MN$ với $BD$, $AC$ theo thứ tự là $E$, $F$. Qua $M$ kẻ đường thẳng song song với $AC$, cắt $DC$ ở $H$.
**hinh:** VHB2-216.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $HN\parallel BD$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $MH\parallel AC$ đổi tỉ số $\dfrac{DM}{MA}$ thành $\dfrac{DH}{HC}$; giả thiết cho $\dfrac{DM}{MA}=\dfrac{BN}{NC}$; hai tỉ số trùng nhau nên Thalès đảo trong $\triangle CDB$.

- n1 | - | $\dfrac{DH}{HC}=\dfrac{DM}{MA}$ | gt | $MH\parallel AC$, định lí Thalès cho $\triangle DAC$
- n2 | - | $\dfrac{DM}{MA}=\dfrac{BN}{NC}$ | gt | nghịch đảo hai vế giả thiết $\dfrac{AM}{MD}=\dfrac{CN}{NB}$
- n3 | - | $\dfrac{CH}{CD}=\dfrac{CN}{CB}$ | n1, n2 | cộng 1 vào hai vế rồi lấy nghịch đảo
- n4 | - | $HN\parallel BD$ | n3 | định lí Thalès đảo cho $\triangle CDB$

**Phần 2. Trình bày**
[[so-do:n1]]
Xét $\triangle DAC$ có $MH\parallel AC$ ($M\in DA$, $H\in DC$)
nên $\dfrac{DH}{HC}=\dfrac{DM}{MA}$ (định lí Thalès). (1)
[[so-do:n2]]
Từ $\dfrac{AM}{MD}=\dfrac{CN}{NB}$ (gt) suy ra $\dfrac{DM}{MA}=\dfrac{BN}{NC}$. (2)
[[so-do:n3]]
Từ (1) và (2): $\dfrac{DH}{HC}=\dfrac{BN}{NC}$,
do đó $\dfrac{DH+HC}{HC}=\dfrac{BN+NC}{NC}$, tức $\dfrac{DC}{HC}=\dfrac{BC}{NC}$,
suy ra $\dfrac{CH}{CD}=\dfrac{CN}{CB}$.
[[so-do:n4]]
Xét $\triangle CDB$ có $H\in CD$, $N\in CB$ và $\dfrac{CH}{CD}=\dfrac{CN}{CB}$
nên $HN\parallel BD$ (định lí Thalès đảo).
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Gọi $O$ là giao điểm hai đường chéo $AC$ và $BD$, $I$ là giao điểm của $HO$ và $MN$. Chứng minh rằng $IE=IF$ và $ME=NF$.
**da_biet:** Biết $HN\parallel BD$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $G=HM\cap BD$, $Q=HN\cap AC$. $OGHQ$ là hình bình hành nên $HO$ qua trung điểm $K$ của $GQ$. Các tỉ số $\dfrac{MG}{GH}$, $\dfrac{NQ}{QH}$ cùng bằng $\dfrac{OA}{OC}=\dfrac{OB}{OD}$ nên $GQ\parallel MN\parallel EF$; chùm đường thẳng $HM$, $HO$, $HN$ và chùm $OG$, $OK$, $OQ$ cắt các đường song song đó cho $I$ là trung điểm của cả $MN$ lẫn $EF$.

- n1 | - | $\dfrac{MG}{GH}=\dfrac{AO}{OC}$ | gt | $MH\parallel AC$, Thalès cho các tam giác $DAO$, $DOC$, $DAC$
- n2 | - | $\dfrac{NQ}{QH}=\dfrac{BO}{OD}$ | gt | $HN\parallel BD$, Thalès cho các tam giác $COD$, $COB$
- n3 | - | $\dfrac{AO}{OC}=\dfrac{BO}{OD}$ | gt | $AB\parallel CD$, hệ quả của định lí Thalès
- n4 | - | $GQ\parallel MN$ | n1, n2, n3 | $\dfrac{HG}{HM}=\dfrac{HQ}{HN}$, định lí Thalès đảo cho $\triangle HMN$
- n5 | - | $K$ là trung điểm của $GQ$ ($K=HO\cap GQ$) | gt | $OGHQ$ là hình bình hành
- n6 | - | $I$ là trung điểm của $MN$ | n4, n5 | Thalès trong góc $\widehat{MHN}$
- n7 | - | $I$ là trung điểm của $EF$ | n4, n5 | Thalès trong góc $\widehat{EOF}$
- n8 | - | $IE=IF$ và $ME=NF$ | n6, n7 | $I$ là trung điểm chung của $MN$ và $EF$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $G=HM\cap BD$ và $Q=HN\cap AC$.
Vì $G\in MH\parallel AC$ nên $MG\parallel AO$ và $GH\parallel OC$.
Xét $\triangle DAC$ có $MH\parallel AC$ nên $\dfrac{DM}{DA}=\dfrac{DH}{DC}$.
Xét $\triangle DAO$ có $MG\parallel AO$ nên $\dfrac{MG}{AO}=\dfrac{DM}{DA}$;
xét $\triangle DOC$ có $GH\parallel OC$ nên $\dfrac{GH}{OC}=\dfrac{DH}{DC}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{MG}{AO}=\dfrac{GH}{OC}$, tức $\dfrac{MG}{GH}=\dfrac{AO}{OC}$. (1)
[[so-do:n2]]
Vì $HN\parallel BD$ (ý a) nên $HQ\parallel DO$ và $NQ\parallel BO$.
Xét $\triangle COD$ có $HQ\parallel DO$ nên $\dfrac{HQ}{DO}=\dfrac{CQ}{CO}$;
xét $\triangle COB$ có $NQ\parallel BO$ nên $\dfrac{NQ}{BO}=\dfrac{CQ}{CO}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{HQ}{DO}=\dfrac{NQ}{BO}$, tức $\dfrac{NQ}{QH}=\dfrac{BO}{OD}$. (2)
[[so-do:n3]]
Vì $AB\parallel CD$ nên $\dfrac{OA}{OC}=\dfrac{OB}{OD}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{MG}{GH}=\dfrac{NQ}{QH}$,
do đó $\dfrac{HG}{HM}=\dfrac{HQ}{HN}$.
Xét $\triangle HMN$ có $G\in HM$, $Q\in HN$
nên $GQ\parallel MN$ (định lí Thalès đảo).
[[so-do:n5]]
Vì $HQ\parallel BD$ nên $HQ\parallel OG$; vì $HG\parallel AC$ nên $HG\parallel OQ$.
Tứ giác $OGHQ$ có hai cặp cạnh đối song song nên là hình bình hành.
Hai đường chéo $HO$ và $GQ$ cắt nhau tại trung điểm $K$ của mỗi đường.
[[so-do:n6]]
Gọi $I=HO\cap MN$; $K\in HI$.
Xét $\triangle HMI$ có $GK\parallel MI$ nên $\dfrac{GK}{MI}=\dfrac{HG}{HM}$;
xét $\triangle HIN$ có $KQ\parallel IN$ nên $\dfrac{KQ}{IN}=\dfrac{HQ}{HN}$ (hệ quả của định lí Thalès).
Mà $\dfrac{HG}{HM}=\dfrac{HQ}{HN}$ và $GK=KQ$ nên $MI=IN$.
[[so-do:n7]]
Vì $EF$ chính là đường thẳng $MN$ nên $EF\parallel GQ$, $E$ thuộc đường thẳng $OG$ ($=BD$), $F$ thuộc đường thẳng $OQ$ ($=AC$), $I$ thuộc đường thẳng $OK$ ($=HO$).
Xét $\triangle OGK$ có $EI\parallel GK$ nên $\dfrac{EI}{GK}=\dfrac{OI}{OK}$;
xét $\triangle OKQ$ có $IF\parallel KQ$ nên $\dfrac{IF}{KQ}=\dfrac{OI}{OK}$ (hệ quả của định lí Thalès).
Mà $GK=KQ$ nên $IE=IF$.
[[so-do:n8]]
$I$ là trung điểm của $MN$ và của $EF$ nên phép đối xứng tâm $I$ biến $M$ thành $N$ và $E$ thành $F$,
suy ra $ME=NF$.
Vậy $IE=IF$ và $ME=NF$.
**hinh_lg:** VHB2-216_b_lg.png
**nghi_van:**

### VHB2-217 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT217@p086 (giải p201-202)
**sach:** G trọng tâm △ABC; MN, BF trung tuyến △ABM; GO ⊥ MN và MO ⊥ EG ⇒ O là trực tâm △MEG.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $A$, đường trung tuyến $BM$. Gọi $O$ là giao điểm các đường trung trực của tam giác $ABC$, $E$ là trọng tâm của tam giác $ABM$. Chứng minh rằng $EO$ vuông góc với $BM$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $G$ là trọng tâm $\triangle ABC$, $N$, $F$ là trung điểm $AB$, $AM$ (nên $E=MN\cap BF$). Chứng minh $O$ là trực tâm của $\triangle MEG$: $GO\perp ME$ (vì $GO\perp BC$ và $MN\parallel BC$) và $MO\perp EG$ (vì $MO\perp AC$ và $EG\parallel AC$).

- n1 | - | $MN\parallel BC$ | gt | $MN$ là đường trung bình của $\triangle ABC$
- n2 | - | $GO\perp ME$ | n1 | $G$, $O$ cùng nằm trên trung trực của $BC$ nên $GO\perp BC$
- n3 | - | $EG\parallel AC$ | gt | $\dfrac{BG}{BM}=\dfrac{BE}{BF}=\dfrac23$, định lí Thalès đảo cho $\triangle BMF$
- n4 | - | $MO\perp EG$ | n3 | $O$ thuộc trung trực của $AC$ nên $MO\perp AC$
- n5 | - | $EO\perp BM$ | n2, n4 | $O$ là trực tâm của $\triangle MEG$; trường hợp $O\equiv G$ xét riêng

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $G$ là trọng tâm $\triangle ABC$ (thuộc $BM$), $N$ là trung điểm $AB$, $F$ là trung điểm $AM$.
Vì $N$, $M$ là trung điểm của $AB$, $AC$ nên $MN$ là đường trung bình của $\triangle ABC$, suy ra $MN\parallel BC$.
Vì $E$ là trọng tâm $\triangle ABM$ nên $E=MN\cap BF$, tức $E$ thuộc đường thẳng $MN$.
[[so-do:n2]]
Vì $AB=AC$ nên đường trung trực của $BC$ là đường trung tuyến kẻ từ $A$, nó chứa $G$; $O$ cũng thuộc đường này.
Giả sử $O\ne G$. Khi đó $GO$ là đường trung trực của $BC$ nên $GO\perp BC$.
Mà $MN\parallel BC$ nên $GO\perp MN$, tức $GO\perp ME$. (1)
[[so-do:n3]]
Vì $G$ là trọng tâm $\triangle ABC$ nên $\dfrac{BG}{BM}=\dfrac23$; vì $E$ là trọng tâm $\triangle ABM$ nên $\dfrac{BE}{BF}=\dfrac23$.
Xét $\triangle BMF$ có $G\in BM$, $E\in BF$ và $\dfrac{BG}{BM}=\dfrac{BE}{BF}$
nên $GE\parallel MF$ (định lí Thalès đảo), tức $EG\parallel AC$.
[[so-do:n4]]
$O$ thuộc đường trung trực của $AC$ nên $OM\perp AC$ ($O\ne M$: nếu $O\equiv M$ thì $MB=MA=MC$, $\triangle ABC$ vuông tại $B$, không thể cân tại $A$).
Mà $EG\parallel AC$ nên $MO\perp EG$. (2)
[[so-do:n5]]
Từ (1) và (2): trong $\triangle MEG$, $O$ là giao của đường cao kẻ từ $G$ và đường cao kẻ từ $M$,
nên $O$ là trực tâm, suy ra $EO\perp MG$, tức $EO\perp BM$.
Nếu $O\equiv G$ thì $OM\perp AC$ chính là $BM\perp AC$ ($G\in BM$), mà $EO=EG\parallel AC$ nên $EO\perp BM$.
Vậy $EO\perp BM$.
**hinh:** VHB2-217.png
**hinh_lg:** VHB2-217_lg.png
**nghi_van:**

### VHB2-218 → DE_SAU (HH00166)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §14 BT218@p086 (giải p202)
**noi_dung:** Chia mỗi cạnh của một tứ giác thành ba phần bằng nhau rồi nối các điểm chia tương ứng trên các cạnh đối diện, ta được bốn đoạn thẳng (hai đoạn thẳng nối các điểm chia tương ứng trên một cặp cạnh đối thì không cắt nhau). Chứng minh rằng: a) Mỗi đoạn thẳng trong bốn đoạn thẳng ấy đều bị chia thành ba phần bằng nhau. b) Diện tích tứ giác ở giữa bằng $\dfrac19$ diện tích tứ giác ban đầu.
**ly_do:** ý a làm được bằng Thalès (NE ∥ BD, NE = BD/3...), nhưng ý b là so sánh diện tích (S_EFIK = 1/3 S_ABCD) — phương pháp diện tích, bị cấm ở chuyên đề Thalès; cả bài để lô Diện tích.
