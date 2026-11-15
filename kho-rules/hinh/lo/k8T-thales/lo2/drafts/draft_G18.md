### VHB2-188 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 188@p80 (giải p190–191)
**sach:** Hệ quả của định lí Thalès hai lần: $\triangle HAC$ có $BD\parallel AC$ cho $\dfrac{AH}{HB}=\dfrac{AC}{BD}$, $\triangle KAB$ có $CF\parallel AB$ cho $\dfrac{AK}{KC}=\dfrac{AB}{CF}$; đặt $AB=c$, $AC=b$.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ vuông tại $A$. Vẽ ra phía ngoài tam giác đó các tam giác $ABD$ vuông cân tại $B$, $ACF$ vuông cân tại $C$. Gọi $H$ là giao điểm của $AB$ và $CD$, $K$ là giao điểm của $AC$ và $BF$.
**hinh:** VHB2-188.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $AH=AK$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $AB=c$, $AC=b$. $BD$ và $AC$ cùng vuông góc với $AB$ nên song song và $BD=c$; hệ quả của định lí Thalès cho $\dfrac{AH}{HB}=\dfrac bc$, từ đó $AH=\dfrac{bc}{b+c}$. Tương tự ($CF\parallel AB$, $CF=b$) được $AK=\dfrac{bc}{b+c}$.

- n1 | - | $AH=\dfrac{bc}{b+c}$ | gt | $BD\parallel AC$, $BD=c$; hệ quả của định lí Thalès cho $\triangle HAC$
- n2 | - | $AK=\dfrac{bc}{b+c}$ | gt | $CF\parallel AB$, $CF=b$; hệ quả của định lí Thalès cho $\triangle KAB$
- n3 | - | $AH=AK$ | n1, n2 | cùng bằng $\dfrac{bc}{b+c}$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $AB=c$, $AC=b$.
Vì $\triangle ABD$ vuông cân tại $B$ nên $BD\perp AB$ và $BD=AB=c$.
Mà $AC\perp AB$ (gt) nên $BD\parallel AC$ (cùng vuông góc với $AB$).
$C$, $D$ nằm khác phía đối với đường thẳng $AB$ nên $H$ thuộc đoạn $CD$.
Đoạn $CD$ nằm trong dải giữa hai đường thẳng song song $AC$ và $BD$,
mà $AB$ vuông góc với cả hai nên $H$ nằm giữa $A$ và $B$.
Xét $\triangle HAC$ có $BD\parallel AC$ ($B\in HA$, $D\in HC$)
nên $\dfrac{HB}{HA}=\dfrac{BD}{AC}=\dfrac cb$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{AH}{HB}=\dfrac bc$, do đó $\dfrac{AH}{AH+HB}=\dfrac{b}{b+c}$.
Mà $AH+HB=AB=c$ nên $AH=\dfrac{bc}{b+c}$. (1)
[[so-do:n2]]
Vì $\triangle ACF$ vuông cân tại $C$ nên $CF\perp AC$ và $CF=AC=b$.
Mà $AB\perp AC$ (gt) nên $CF\parallel AB$ (cùng vuông góc với $AC$).
Lập luận tương tự trên, $K$ nằm giữa $A$ và $C$.
Xét $\triangle KAB$ có $CF\parallel AB$ ($C\in KA$, $F\in KB$)
nên $\dfrac{KC}{KA}=\dfrac{CF}{AB}=\dfrac bc$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{AK}{KC}=\dfrac cb$, do đó $\dfrac{AK}{AK+KC}=\dfrac{c}{b+c}$.
Mà $AK+KC=AC=b$ nên $AK=\dfrac{bc}{b+c}$. (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $AH=AK$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $AH^2=BH\cdot CK$.
**da_biet:** Biết $AH=AK$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai hệ quả của định lí Thalès cho $\dfrac{AH}{HB}=\dfrac{AC}{BD}$ và $\dfrac{KC}{AK}=\dfrac{CF}{AB}$; vì $BD=AB$, $CF=AC$ nên hai tỉ số bằng nhau, rồi thay $AK=AH$.

- n1 | - | $\dfrac{AH}{HB}=\dfrac{AC}{AB}$ | gt | $BD\parallel AC$, $BD=AB$; hệ quả của định lí Thalès cho $\triangle HAC$
- n2 | - | $\dfrac{KC}{AK}=\dfrac{AC}{AB}$ | gt | $CF\parallel AB$, $CF=AC$; hệ quả của định lí Thalès cho $\triangle KAB$
- n3 | - | $\dfrac{AH}{HB}=\dfrac{KC}{AK}$ | n1, n2 | cùng bằng $\dfrac{AC}{AB}$
- n4 | - | $AH^2=BH\cdot CK$ | n3, gt | thay $AK=AH$ (ý a)

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $\triangle ABD$ vuông cân tại $B$ nên $BD\perp AB$ và $BD=AB$.
Mà $AC\perp AB$ (gt) nên $BD\parallel AC$.
Xét $\triangle HAC$ có $BD\parallel AC$ ($B\in HA$, $D\in HC$)
nên $\dfrac{HA}{HB}=\dfrac{AC}{BD}=\dfrac{AC}{AB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Vì $\triangle ACF$ vuông cân tại $C$ nên $CF\perp AC$ và $CF=AC$.
Mà $AB\perp AC$ (gt) nên $CF\parallel AB$.
Xét $\triangle KAB$ có $CF\parallel AB$ ($C\in KA$, $F\in KB$)
nên $\dfrac{KC}{KA}=\dfrac{CF}{AB}=\dfrac{AC}{AB}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{AH}{HB}=\dfrac{KC}{AK}$.
[[so-do:n4]]
Mà $AK=AH$ (ý a) nên $\dfrac{AH}{HB}=\dfrac{KC}{AH}$.
Vậy $AH^2=BH\cdot CK$.
**nghi_van:**

### VHB2-189 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 189@p80 (giải p191)
**sach:** Gọi $E$, $F$ là giao của $AM$, $AN$ với $BD$; $G$, $H$ là giao của $MN$ với $AD$, $AB$; chứng minh $GM=MN=NH$ (Thalès cho chùm đồng quy tại $A$). Lời giải sách dừng ở đó; phần còn lại tự viết: đường trung bình $MN\parallel BD$ và hai cặp tam giác bằng nhau.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Tứ giác $ABCD$ có $M$ là trung điểm của $CD$, $N$ là trung điểm của $CB$. Biết rằng $AM$ và $AN$ cắt đường chéo $BD$ lần lượt tại $E$, $F$ sao cho $BD$ bị chia thành ba đoạn bằng nhau $DE=EF=FB$. Chứng minh rằng $ABCD$ là hình bình hành.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $MN$ là đường trung bình của $\triangle CBD$ nên $MN\parallel BD$. Gọi $G$, $H$ là giao của $MN$ với $AD$, $AB$: định lí Thalès cho chùm $AD$, $AM$, $AN$, $AB$ cắt hai đường song song $BD$, $GH$ được $GM=MN=NH$. Khi đó $\triangle MDG=\triangle MCN$ và $\triangle NCM=\triangle NBH$ cho $AD\parallel BC$, $AB\parallel CD$.

- n1 | - | $MN\parallel BD$ | gt | $MN$ là đường trung bình của $\triangle CBD$
- n2 | - | $GM=MN=NH$ | n1, gt | hệ quả của định lí Thalès cho $\triangle ADE$, $\triangle AEF$, $\triangle AFB$ và $DE=EF=FB$
- n3 | - | $AD\parallel BC$ | n2, gt | $\triangle MDG=\triangle MCN$ (c.g.c)
- n4 | - | $AB\parallel CD$ | n2, gt | $\triangle NCM=\triangle NBH$ (c.g.c)
- n5 | - | $ABCD$ là hình bình hành | n3, n4 | hai cặp cạnh đối song song

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle CBD$ có $M$, $N$ lần lượt là trung điểm của $CD$, $CB$ (gt)
nên $MN$ là đường trung bình của $\triangle CBD$.
Do đó $MN\parallel BD$. (1)
[[so-do:n2]]
Gọi $G$, $H$ lần lượt là giao điểm của $MN$ với $AD$, $AB$.
Từ (1) ta có $GM\parallel DE$, $MN\parallel EF$, $NH\parallel FB$.
Xét $\triangle ADE$ có $GM\parallel DE$ ($G\in AD$, $M\in AE$)
nên $\dfrac{GM}{DE}=\dfrac{AM}{AE}$ (hệ quả của định lí Thalès).
Xét $\triangle AEF$ có $MN\parallel EF$ ($M\in AE$, $N\in AF$)
nên $\dfrac{MN}{EF}=\dfrac{AM}{AE}=\dfrac{AN}{AF}$ (hệ quả của định lí Thalès).
Xét $\triangle AFB$ có $NH\parallel FB$ ($N\in AF$, $H\in AB$)
nên $\dfrac{NH}{FB}=\dfrac{AN}{AF}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{GM}{DE}=\dfrac{MN}{EF}=\dfrac{NH}{FB}$.
Mà $DE=EF=FB$ (gt) nên $GM=MN=NH$. (2)
Các đường thẳng $AD$, $AM$, $AN$, $AB$ cắt hai đường thẳng song song $BD$ và $GH$
nên $G$, $M$, $N$, $H$ xếp theo thứ tự giống $D$, $E$, $F$, $B$:
$M$ nằm giữa $G$ và $N$, $N$ nằm giữa $M$ và $H$.
[[so-do:n3]]
Xét $\triangle MDG$ và $\triangle MCN$ có:
$MD=MC$ ($M$ là trung điểm của $CD$),
$\widehat{DMG}=\widehat{CMN}$ (đối đỉnh),
$MG=MN$ (theo (2)).
Do đó $\triangle MDG=\triangle MCN$ (c.g.c).
Suy ra $\widehat{MDG}=\widehat{MCN}$.
Hai góc này ở vị trí so le trong ($G$, $N$ nằm khác phía đối với $CD$)
nên $DG\parallel CN$, tức là $AD\parallel BC$. (3)
[[so-do:n4]]
Xét $\triangle NCM$ và $\triangle NBH$ có:
$NC=NB$ ($N$ là trung điểm của $CB$),
$\widehat{CNM}=\widehat{BNH}$ (đối đỉnh),
$NM=NH$ (theo (2)).
Do đó $\triangle NCM=\triangle NBH$ (c.g.c).
Suy ra $\widehat{NCM}=\widehat{NBH}$.
Hai góc này ở vị trí so le trong ($M$, $H$ nằm khác phía đối với $BC$)
nên $CM\parallel BH$, tức là $CD\parallel AB$. (4)
[[so-do:n5]]
Từ (3) và (4), tứ giác $ABCD$ có $AD\parallel BC$ và $AB\parallel CD$.
Vậy $ABCD$ là hình bình hành.
**hinh:** VHB2-189.png
**nghi_van:** Đề sách không nói thứ tự $E$, $F$; kho ghi rõ $AM$, $AN$ cắt $BD$ lần lượt ở $E$, $F$ với $DE=EF=FB$ (hình sách $E$ gần $D$). Dữ kiện buộc $ABCD$ là hình bình hành nên hình vẽ bắt buộc có dạng đó (đã kiểm: giải hệ từ giả thiết ra đúng $C=B+D-A$).

### VHB2-190 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 190@p80 (giải p191)
**sach:** Kéo dài $AE$ cắt $DC$ ở $G$ ($CG=12$, $FG=9$), Thalès cho $BH=2$ với $H=CM\cap AB$, rồi $\triangle BAE=\triangle BCH$. Đáp số $90^\circ$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 90
**noi_dung:**
Trên cạnh $BC$ của hình vuông $ABCD$ cạnh $6$, lấy điểm $E$ sao cho $BE=2$. Trên tia đối của tia $CD$ lấy điểm $F$ sao cho $CF=3$. Gọi $M$ là giao điểm của $AE$ và $BF$. Tính $\widehat{AMC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** đoán $\widehat{AMC}=90^\circ$. Muốn chứng minh, lấy $H$ trên tia đối của tia $BA$ với $BH=BE=2$ rồi chứng tỏ $C$, $M$, $H$ thẳng hàng; khi đó hai tam giác vuông $BAE$ và $BCH$ bằng nhau cho góc cần tìm.
**Bước 1.** Kéo dài $AE$ cắt $DC$ ở $G$. Vì $AB\parallel CG$ nên hệ quả của định lí Thalès cho $CG$, từ đó có $FG$.
**Bước 2.** Hai đoạn $AB$ và $FG$ song song nên hệ quả của định lí Thalès cho tỉ số $\dfrac{MB}{MF}$.
**Bước 3.** Lấy $H$ như trên. Vì $BH\parallel CF$, đường thẳng $CH$ cắt $BF$ tại điểm chia $BF$ cùng tỉ số $\dfrac{BH}{CF}$, nên điểm đó trùng $M$.
**Bước 4.** $\triangle BAE=\triangle BCH$ cho các góc bằng nhau, rồi cộng góc trong tam giác $EMC$.
**Chú ý:** không đo trên hình; mọi bước dùng tỉ số và tam giác bằng nhau.

**Phần 2. Trình bày**
Gọi $G$ là giao điểm của $AE$ và $DC$.
Xét $\triangle EGC$ có $AB\parallel CG$ ($A\in EG$, $B\in EC$)
nên $\dfrac{EB}{EC}=\dfrac{AB}{CG}$ (hệ quả của định lí Thalès).
Mà $EB=2$, $EC=6-2=4$, $AB=6$ nên $CG=12$.
$F$ nằm giữa $C$ và $G$ nên $FG=CG-CF=12-3=9$.
Xét $\triangle MGF$ có $AB\parallel GF$ ($A\in MG$, $B\in MF$)
nên $\dfrac{MB}{MF}=\dfrac{AB}{GF}=\dfrac69=\dfrac23$ (hệ quả của định lí Thalès).
$M$ là giao điểm hai đường chéo $AG$, $BF$ của hình thang $ABGF$ nên $M$ nằm giữa $B$ và $F$.
Lấy $H$ thuộc tia đối của tia $BA$ sao cho $BH=BE=2$, gọi $M'$ là giao điểm của $CH$ và $BF$.
Xét $\triangle M'FC$ có $BH\parallel FC$ ($B\in M'F$, $H\in M'C$)
nên $\dfrac{M'B}{M'F}=\dfrac{BH}{FC}=\dfrac23$ (hệ quả của định lí Thalès).
$M'$ là giao điểm hai đường chéo của hình thang $BHFC$ nên $M'$ nằm giữa $B$ và $F$.
Trên đoạn $BF$ chỉ có một điểm chia $BF$ theo tỉ số $2:3$ tính từ $B$ nên $M'\equiv M$,
tức là $C$, $M$, $H$ thẳng hàng.
Xét $\triangle BAE$ và $\triangle BCH$ có:
$BA=BC$ (cạnh hình vuông), $\widehat{ABE}=\widehat{CBH}=90^\circ$, $BE=BH$.
Do đó $\triangle BAE=\triangle BCH$ (c.g.c).
Suy ra $\widehat{BAE}=\widehat{BCH}$ và $\widehat{BEA}+\widehat{BAE}=90^\circ$.
$M$ cùng phía với $F$ đối với $BC$ nên $E$ nằm giữa $A$ và $M$.
Trong $\triangle EMC$: $\widehat{MEC}=\widehat{BEA}$ (đối đỉnh), $\widehat{MCE}=\widehat{BCH}=\widehat{BAE}$.
Do đó $\widehat{MEC}+\widehat{MCE}=\widehat{BEA}+\widehat{BAE}=90^\circ$.
Suy ra $\widehat{EMC}=90^\circ$, mà $E$ nằm giữa $A$ và $M$ nên $\widehat{AMC}=90^\circ$.
Vậy $\widehat{AMC}=90^\circ$.
**hinh:** VHB2-190.png
**hinh_lg:** VHB2-190_lg.png
**nghi_van:**

### VHB2-191 → TRUNG (TCHH-5.14)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 191@p80 (giải p191–192)
**ly_do:** Giống hệt TCHH-5.14 (cho $\triangle ABC$, đường thẳng cắt $BC$, $AC$ ở $D$, $E$ và $BA$ ở $F$, hình bình hành $BDEH$, $FI\parallel BC$ cắt $HA$ ở $I$, chứng minh $FI=DC$); chỉ khác lời dẫn.

### VHB2-192 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 192@p80 (giải p192)
**sach:** Qua $N$ kẻ $EF\parallel BC$ ($NE=NF$), kẻ $EG\parallel HK$ ($GK=KF$), $AH=AK$, $AE=AG$ nên $EH=GK=KF$, rồi $\triangle IHE=\triangle IKF$, $IE=IF$ và $IN\perp EF$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, đường phân giác $AD$, đường trung tuyến $AM$. Qua điểm $I$ thuộc đoạn thẳng $AD$, kẻ $IH$ vuông góc với $AB$, $IK$ vuông góc với $AC$. Gọi $N$ là giao điểm của $HK$ và $AM$. Chứng minh rằng $NI$ vuông góc với $BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $N$ kẻ $EF\parallel BC$ ($E\in AB$, $F\in AC$) rồi chứng minh $IE=IF$ để $\triangle IEF$ cân có trung tuyến $IN$. Muốn có $HE=KF$ kẻ thêm $EG\parallel HK$ ($G\in AC$): $K$ là trung điểm $FG$ và $AE=AG$.

- n1 | - | $AH=AK$ và $IH=IK$ | gt | $\triangle AHI=\triangle AKI$ (cạnh huyền – góc nhọn)
- n2 | - | $NE=NF$ | gt | hệ quả của định lí Thalès cho $\triangle ABM$, $\triangle ACM$ và $BM=MC$
- n3 | - | $AE=AG$ | n1 | $EG\parallel HK$, hệ quả của định lí Thalès cho $\triangle AHK$
- n4 | - | $KF=KG$ | n2 | $K$ là trung điểm $FG$ (đường thẳng qua trung điểm $N$ của $EF$, song song $EG$)
- n5 | - | $HE=KF$ | n1, n3, n4 | $HE=KG=KF$
- n6 | - | $IE=IF$ | n1, n5 | định lí Pythagore cho $\triangle IHE$, $\triangle IKF$
- n7 | - | $NI\perp BC$ | n2, n6 | $\triangle IEF$ cân tại $I$ có trung tuyến $IN$, $EF\parallel BC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle AHI$ và $\triangle AKI$ vuông tại $H$, $K$ có:
$AI$ chung, $\widehat{HAI}=\widehat{KAI}$ ($AD$ là phân giác của góc $A$).
Do đó $\triangle AHI=\triangle AKI$ (cạnh huyền – góc nhọn).
Suy ra $AH=AK$ và $IH=IK$. (1)
[[so-do:n2]]
Qua $N$ kẻ đường thẳng song song với $BC$, cắt $AB$, $AC$ lần lượt tại $E$, $F$.
Xét $\triangle ABM$ có $NE\parallel BM$ ($E\in AB$, $N\in AM$)
nên $\dfrac{NE}{BM}=\dfrac{AN}{AM}$ (hệ quả của định lí Thalès).
Xét $\triangle ACM$ có $NF\parallel MC$ ($F\in AC$, $N\in AM$)
nên $\dfrac{NF}{MC}=\dfrac{AN}{AM}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{NE}{BM}=\dfrac{NF}{MC}$.
Mà $BM=MC$ ($AM$ là trung tuyến) nên $NE=NF$.
$E$, $F$ nằm khác phía đối với $AM$ nên $N$ là trung điểm của $EF$. (2)
[[so-do:n3]]
Qua $E$ kẻ đường thẳng song song với $HK$, cắt $AC$ tại $G$.
Xét $\triangle AHK$ có $EG\parallel HK$ ($E\in AH$, $G\in AK$)
nên $\dfrac{AE}{AH}=\dfrac{AG}{AK}$ (hệ quả của định lí Thalès).
Mà $AH=AK$ (theo (1)) nên $AE=AG$. (3)
[[so-do:n4]]
Xét $\triangle EFG$ có $N$ là trung điểm của $EF$ (theo (2)), $NK\parallel EG$ ($N$, $K$ thuộc $HK$), $K\in FG$.
Đường thẳng qua trung điểm một cạnh và song song với cạnh thứ hai đi qua trung điểm cạnh thứ ba
nên $K$ là trung điểm của $FG$, tức là $KF=KG$. (4)
[[so-do:n5]]
$E$, $H$ cùng thuộc tia $AB$; $G$, $K$ cùng thuộc tia $AC$ nên $HE=|AH-AE|$ và $KG=|AK-AG|$.
Từ (1) và (3) suy ra $HE=KG$.
Kết hợp với (4) ta được $HE=KF$. (5)
[[so-do:n6]]
Xét $\triangle IHE$ vuông tại $H$ có $IE^2=IH^2+HE^2$ (định lí Pythagore).
Xét $\triangle IKF$ vuông tại $K$ có $IF^2=IK^2+KF^2$ (định lí Pythagore).
Từ (1) và (5): $IH=IK$, $HE=KF$ nên $IE^2=IF^2$.
Do đó $IE=IF$.
[[so-do:n7]]
$\triangle IEF$ cân tại $I$ ($IE=IF$) có $IN$ là trung tuyến (theo (2))
nên $IN\perp EF$.
Mà $EF\parallel BC$ nên $NI\perp BC$.
**hinh:** VHB2-192.png
**hinh_lg:** VHB2-192_lg.png
**nghi_van:** Sách giải bằng ba đường phụ ($EF$, $EG$ và thứ tự điểm); kho thay "$EH=GK$" bằng $HE=|AH-AE|$ để không phụ thuộc vị trí $E$ trước hay sau $H$ (đã kiểm số 8 tam giác khác nhau).

### VHB2-193 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 193@p80 (giải p192)
**sach:** Hướng dẫn của sách: qua $C$ kẻ đường song song $PQ$ cắt $AB$ ở $N$, cắt $AH$ ở $K$; $KN=KC$ nên $KM$ là đường trung bình của $\triangle CBN$; $M$ là trực tâm của $\triangle CHK$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có ba góc nhọn, trực tâm $H$. Một đường thẳng đi qua $H$ cắt $AB$, $AC$ theo thứ tự ở $P$, $Q$ sao cho $HP=HQ$. Gọi $M$ là trung điểm của $BC$. Chứng minh rằng $HM$ vuông góc với $PQ$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $C$ kẻ đường thẳng song song với $PQ$, cắt $AB$ ở $N$ và cắt $AH$ ở $K$. Thalès cho $K$ là trung điểm của $NC$, nên $KM$ là đường trung bình của $\triangle CBN$; khi đó $M$ là trực tâm của $\triangle CHK$ và $HM\perp CK$.

- n1 | - | $K$ là trung điểm của $NC$ | gt | $NC\parallel PQ$, hệ quả của định lí Thalès cho $\triangle ANK$, $\triangle AKC$ và $HP=HQ$
- n2 | - | $KM\parallel AB$ và $KM\perp CH$ | n1, gt | $KM$ là đường trung bình của $\triangle CBN$; $CH\perp AB$
- n3 | - | $M$ là trực tâm của $\triangle CHK$ | n2, gt | $KM\perp CH$ và $CM\perp HK$
- n4 | - | $HM\perp PQ$ | n3 | $HM\perp CK$ và $CK\parallel PQ$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $C$ kẻ đường thẳng song song với $PQ$, cắt $AB$ tại $N$, cắt $AH$ tại $K$.
Xét $\triangle ANK$ có $PH\parallel NK$ ($P\in AN$, $H\in AK$)
nên $\dfrac{PH}{NK}=\dfrac{AH}{AK}$ (hệ quả của định lí Thalès).
Xét $\triangle AKC$ có $HQ\parallel KC$ ($H\in AK$, $Q\in AC$)
nên $\dfrac{HQ}{KC}=\dfrac{AH}{AK}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{PH}{NK}=\dfrac{HQ}{KC}$.
Mà $HP=HQ$ (gt) nên $NK=KC$.
Vậy $K$ là trung điểm của $NC$.
[[so-do:n2]]
Xét $\triangle CBN$ có $K$, $M$ lần lượt là trung điểm của $NC$, $BC$
nên $KM$ là đường trung bình của $\triangle CBN$.
Do đó $KM\parallel NB$, tức là $KM\parallel AB$.
Vì $H$ là trực tâm của $\triangle ABC$ nên $CH\perp AB$.
Suy ra $KM\perp CH$.
[[so-do:n3]]
Vì $H$ là trực tâm của $\triangle ABC$ nên $AH\perp BC$.
Mà $K\in AH$, $M\in BC$ nên $HK\perp CM$.
Xét $\triangle CHK$ có $KM\perp CH$ nên $KM$ là đường cao kẻ từ $K$.
$CM\perp HK$ nên $CM$ là đường cao kẻ từ $C$.
Hai đường cao này cắt nhau tại $M$ nên $M$ là trực tâm của $\triangle CHK$.
[[so-do:n4]]
Vì $M$ là trực tâm của $\triangle CHK$ nên $HM\perp CK$.
Mà $CK\parallel PQ$ nên $HM\perp PQ$.
**hinh:** VHB2-193.png
**hinh_lg:** VHB2-193_lg.png
**nghi_van:**

### VHB2-194 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 194@p80 (giải p192)
**sach:** Gọi $I=MN\cap AC$, $H=KN\cap DC$; $MI=IN$ nên $EC=CH$, $\triangle NEH$ cân tại $N$, từ đó $NM$ là phân giác góc $KNE$ (sách tóm tắt, kho viết đủ).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Hình chữ nhật $ABCD$ có $M$, $N$ theo thứ tự là trung điểm của $AD$, $BC$. Gọi $E$ là một điểm bất kì thuộc tia đối của tia $DC$, $K$ là giao điểm của $EM$ và $AC$. Chứng minh rằng $NM$ là tia phân giác của góc $KNE$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $I=MN\cap AC$ và $H=KN\cap DC$. $MN\parallel DC$ nên $MI=IN$; Thalès cho chùm từ $K$ cho $\dfrac{MI}{EC}=\dfrac{IN}{CH}$, suy ra $C$ là trung điểm $EH$. $NC\perp EH$ nên $\triangle NEH$ cân, rồi dùng các cặp góc so le trong, đồng vị để so sánh $\widehat{MNK}$ với $\widehat{MNE}$.

- n1 | - | $MI=IN$ | gt | $MI$, $IN$ là đường trung bình của $\triangle ADC$, $\triangle ABC$ và $AB=CD$
- n2 | - | $CE=CH$ | n1 | $\dfrac{MI}{CE}=\dfrac{IN}{CH}$ (hệ quả của định lí Thalès từ $K$)
- n3 | - | $NE=NH$ | n2, gt | $NC\perp EH$ tại trung điểm $C$
- n4 | - | $NM$ là tia phân giác của $\widehat{KNE}$ | n3 | $\widehat{MNK}=\widehat{NHE}=\widehat{NEH}=\widehat{MNE}$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $I$ là giao điểm của $MN$ và $AC$, $H$ là giao điểm của $KN$ và $DC$.
Vì $AM=BN$ và $AM\parallel BN$ nên $ABNM$ là hình bình hành.
Do đó $MN\parallel AB$, mà $AB\parallel CD$ nên $MN\parallel CD$.
Xét $\triangle ADC$ có $M$ là trung điểm của $AD$, $MI\parallel DC$
nên $I$ là trung điểm của $AC$ và $MI=\dfrac12DC$.
Xét $\triangle ABC$ có $I$, $N$ lần lượt là trung điểm của $AC$, $BC$
nên $IN=\dfrac12AB$.
Mà $AB=CD$ nên $MI=IN$. (1)
[[so-do:n2]]
Xét $\triangle KEC$ có $MI\parallel EC$ ($M\in KE$, $I\in KC$)
nên $\dfrac{MI}{EC}=\dfrac{KI}{KC}$ (hệ quả của định lí Thalès).
Xét $\triangle KCH$ có $IN\parallel CH$ ($I\in KC$, $N\in KH$)
nên $\dfrac{IN}{CH}=\dfrac{KI}{KC}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{MI}{EC}=\dfrac{IN}{CH}$.
Kết hợp với (1) ta được $EC=CH$.
$E$ và $H$ nằm ở hai phía của $C$ trên đường thẳng $DC$ nên $C$ là trung điểm của $EH$. (2)
[[so-do:n3]]
Vì $BC\perp DC$ nên $NC\perp EH$.
Từ (2), $NC$ là đường trung trực của $EH$.
Do đó $NE=NH$. (3)
[[so-do:n4]]
Từ (3), $\triangle NEH$ cân tại $N$ nên $\widehat{NEH}=\widehat{NHE}$.
Vì $MN\parallel EH$ nên $\widehat{MNE}=\widehat{NEH}$ (so le trong) và $\widehat{MNK}=\widehat{NHE}$ (đồng vị).
Suy ra $\widehat{MNK}=\widehat{MNE}$.
$K$ và $E$ nằm khác phía đối với đường thẳng $MN$ nên tia $NM$ nằm giữa hai tia $NK$, $NE$.
Vậy $NM$ là tia phân giác của góc $KNE$.
**hinh:** VHB2-194.png
**hinh_lg:** VHB2-194_lg.png
**nghi_van:**

### VHB2-195 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 195@p80 (giải p193)
**sach:** $NM=BC=AD$ nên $ADMN$ là hình bình hành, $AN\parallel DM$; hệ quả Thalès cho $\dfrac{AE}{EF}=\dfrac{EN}{ED}=\dfrac{EB}{EA}$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình bình hành $ABCD$, điểm $M$ thuộc cạnh $BC$, điểm $N$ thuộc tia đối của tia $BC$ sao cho $BN=CM$. Các đường thẳng $DN$, $DM$ cắt $AB$ theo thứ tự ở $E$, $F$. Chứng minh rằng $AE^2=EB\cdot EF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $NM=BC=AD$ và $NM\parallel AD$ nên $ADMN$ là hình bình hành, $AN\parallel DM$. Hai lần hệ quả của định lí Thalès cho cùng tỉ số $\dfrac{EN}{ED}$.

- n1 | - | $AN\parallel DM$ | gt | $ADMN$ là hình bình hành ($NM=AD$, $NM\parallel AD$)
- n2 | - | $\dfrac{EA}{EF}=\dfrac{EN}{ED}$ | n1 | hệ quả của định lí Thalès cho $\triangle EDF$ có $AN\parallel DF$
- n3 | - | $\dfrac{EB}{EA}=\dfrac{EN}{ED}$ | gt | hệ quả của định lí Thalès cho $\triangle EAD$ có $BN\parallel AD$
- n4 | - | $AE^2=EB\cdot EF$ | n2, n3 | cùng bằng $\dfrac{EN}{ED}$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $N$ thuộc tia đối của tia $BC$, $M\in BC$ và $BN=CM$ nên
$NM=NB+BM=CM+BM=BC$.
Mà $BC=AD$ (hình bình hành) nên $NM=AD$.
Lại có $NM\parallel AD$ ($N$, $M\in BC$ và $BC\parallel AD$).
Do đó $ADMN$ là hình bình hành.
Suy ra $AN\parallel DM$, tức là $AN\parallel DF$.
[[so-do:n2]]
Xét $\triangle EDF$ có $AN\parallel DF$ ($A\in EF$, $N\in ED$)
nên $\dfrac{EA}{EF}=\dfrac{EN}{ED}$ (hệ quả của định lí Thalès). (1)
[[so-do:n3]]
Xét $\triangle EAD$ có $BN\parallel AD$ ($B\in EA$, $N\in ED$)
nên $\dfrac{EB}{EA}=\dfrac{EN}{ED}$ (hệ quả của định lí Thalès). (2)
[[so-do:n4]]
Từ (1) và (2) suy ra $\dfrac{EA}{EF}=\dfrac{EB}{EA}$.
Vậy $AE^2=EB\cdot EF$.
**hinh:** VHB2-195.png
**hinh_lg:** VHB2-195_lg.png
**nghi_van:**

### VHB2-196 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 196@p80–81 (giải p193)
**sach:** Hệ quả của định lí Thalès với $AD\parallel BK$ và $AB\parallel DG$ (các tỉ số $\dfrac{EB}{ED}$); ý c dùng $\triangle KCG$ và $\triangle GAD$ rồi nhân hai đẳng thức.
**loai:** nhieu_y
**loi_dan:**
Một đường thẳng đi qua đỉnh $A$ của hình bình hành $ABCD$ cắt $BD$, $BC$, $DC$ theo thứ tự ở $E$, $K$, $G$.
**hinh:** VHB2-196.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $AE^2=EK\cdot EG$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai hệ quả của định lí Thalès ($BK\parallel AD$ và $AB\parallel DG$) cùng cho tỉ số $\dfrac{EB}{ED}$.

- n1 | - | $\dfrac{EK}{EA}=\dfrac{EB}{ED}$ | gt | $BK\parallel AD$, hệ quả của định lí Thalès cho $\triangle EAD$
- n2 | - | $\dfrac{EA}{EG}=\dfrac{EB}{ED}$ | gt | $AB\parallel DG$, hệ quả của định lí Thalès cho $\triangle EDG$
- n3 | - | $AE^2=EK\cdot EG$ | n1, n2 | cùng bằng $\dfrac{EB}{ED}$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $ABCD$ là hình bình hành nên $AD\parallel BC$, tức là $BK\parallel AD$.
Xét $\triangle EAD$ có $BK\parallel AD$ ($K\in EA$, $B\in ED$)
nên $\dfrac{EK}{EA}=\dfrac{EB}{ED}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Vì $AB\parallel CD$ nên $AB\parallel DG$.
Xét $\triangle EDG$ có $AB\parallel DG$ ($A\in EG$, $B\in ED$)
nên $\dfrac{EA}{EG}=\dfrac{EB}{ED}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{EK}{EA}=\dfrac{EA}{EG}$.
Vậy $AE^2=EK\cdot EG$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $\dfrac1{AE}=\dfrac1{AK}+\dfrac1{AG}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Chia hai vế cho $\dfrac1{AE}$, đưa về $\dfrac{AE}{AK}+\dfrac{AE}{AG}=1$; mỗi tỉ số bằng một tỉ số trên $BD$ nhờ hệ quả của định lí Thalès, cộng lại được $\dfrac{DE+BE}{BD}=1$.

- n1 | - | $\dfrac{AE}{AK}=\dfrac{DE}{DB}$ | gt | $AD\parallel BK$, hệ quả của định lí Thalès cho $\triangle EAD$
- n2 | - | $\dfrac{AE}{AG}=\dfrac{BE}{BD}$ | gt | $AB\parallel DG$, hệ quả của định lí Thalès cho $\triangle EDG$
- n3 | - | $\dfrac1{AE}=\dfrac1{AK}+\dfrac1{AG}$ | n1, n2 | $\dfrac{DE+BE}{BD}=1$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle EAD$ có $BK\parallel AD$ ($K\in EA$, $B\in ED$)
nên $\dfrac{EK}{EA}=\dfrac{EB}{ED}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{EA+EK}{EA}=\dfrac{ED+EB}{ED}$ ($E$ nằm giữa $A$, $K$ và giữa $D$, $B$),
tức là $\dfrac{AK}{AE}=\dfrac{DB}{DE}$.
Do đó $\dfrac{AE}{AK}=\dfrac{DE}{DB}$. (1)
[[so-do:n2]]
Xét $\triangle EDG$ có $AB\parallel DG$ ($A\in EG$, $B\in ED$)
nên $\dfrac{EA}{EG}=\dfrac{EB}{ED}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{EG}{EA}=\dfrac{ED}{EB}$, rồi $\dfrac{EA+EG}{EA}=\dfrac{EB+ED}{EB}$ ($E$ nằm giữa $A$, $G$ và giữa $B$, $D$),
tức là $\dfrac{AG}{AE}=\dfrac{BD}{BE}$.
Do đó $\dfrac{AE}{AG}=\dfrac{BE}{BD}$. (2)
[[so-do:n3]]
Cộng (1) và (2): $\dfrac{AE}{AK}+\dfrac{AE}{AG}=\dfrac{DE+BE}{BD}=\dfrac{BD}{BD}=1$ ($E$ nằm giữa $B$, $D$).
Chia hai vế cho $AE$ ta được $\dfrac1{AK}+\dfrac1{AG}=\dfrac1{AE}$.
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng khi đường thẳng thay đổi vị trí nhưng vẫn đi qua $A$ thì tích $BK\cdot DG$ có giá trị không đổi.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $AB=a$, $AD=b$ (không đổi). Hai hệ quả của định lí Thalès cho $\dfrac{BK}{KC}=\dfrac a{CG}$ và $\dfrac{KC}b=\dfrac{CG}{DG}$; nhân hai đẳng thức, $KC$ và $CG$ cùng triệt tiêu.

- n1 | - | $\dfrac{BK}{KC}=\dfrac a{CG}$ | gt | $AB\parallel CG$, hệ quả của định lí Thalès cho $\triangle KCG$
- n2 | - | $\dfrac{KC}b=\dfrac{CG}{DG}$ | gt | $CK\parallel AD$, hệ quả của định lí Thalès cho $\triangle GAD$
- n3 | - | $BK\cdot DG=ab$ | n1, n2 | nhân hai đẳng thức vế theo vế

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $AB=a$, $AD=b$; hai số $a$, $b$ không đổi khi đường thẳng thay đổi.
Xét $\triangle KCG$ có $AB\parallel CG$ ($B\in KC$, $A\in KG$)
nên $\dfrac{KB}{KC}=\dfrac{AB}{CG}=\dfrac a{CG}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle GAD$ có $CK\parallel AD$ ($C\in GD$, $K\in GA$)
nên $\dfrac{GC}{GD}=\dfrac{CK}{AD}$ (hệ quả của định lí Thalès).
Hay $\dfrac{KC}b=\dfrac{CG}{DG}$. (2)
[[so-do:n3]]
Nhân từng vế của (1) và (2): $\dfrac{BK}{KC}\cdot\dfrac{KC}b=\dfrac a{CG}\cdot\dfrac{CG}{DG}$.
Suy ra $\dfrac{BK}b=\dfrac a{DG}$.
Do đó $BK\cdot DG=ab$ không đổi.
**nghi_van:** Hình và lời giải theo trường hợp sách vẽ: $K$ thuộc cạnh $BC$, $G$ thuộc tia $DC$ phía $C$, thứ tự $A,E,K,G$ (đã kiểm số 10 vị trí đường thẳng).

### VHB2-197 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 197@p81 (giải p193)
**sach:** $CD=BE$ ($\triangle ACD=\triangle CBE$) và hai hệ quả của định lí Thalès cho $\dfrac{MH}{CD}=\dfrac{BM}{BC}$, $\dfrac{MK}{BE}=\dfrac{CM}{BC}$; cộng lại $MH+MK=CD$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác đều $ABC$. Các điểm $D$, $E$ theo thứ tự thuộc các cạnh $AB$, $AC$ sao cho $AD=CE$. Gọi $M$ là một điểm bất kì thuộc cạnh $BC$. Vẽ $MH$ song song với $CD$ ($H$ thuộc $AB$), vẽ $MK$ song song với $BE$ ($K$ thuộc $AC$). Chứng minh rằng khi điểm $M$ chuyển động trên cạnh $BC$ thì tổng $MH+MK$ có giá trị không đổi.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai hệ quả của định lí Thalès cho $\dfrac{MH}{CD}=\dfrac{BM}{BC}$ và $\dfrac{MK}{BE}=\dfrac{CM}{BC}$; vì $CD=BE$ nên cộng lại được $MH+MK=CD$, mà $CD$ không phụ thuộc $M$.

- n1 | - | $CD=BE$ | gt | $\triangle ACD=\triangle CBE$ (c.g.c)
- n2 | - | $\dfrac{MH}{CD}=\dfrac{BM}{BC}$ | gt | $MH\parallel CD$, hệ quả của định lí Thalès cho $\triangle BCD$
- n3 | - | $\dfrac{MK}{BE}=\dfrac{CM}{BC}$ | gt | $MK\parallel BE$, hệ quả của định lí Thalès cho $\triangle CBE$
- n4 | - | $MH+MK=CD$ | n1, n2, n3 | $\dfrac{BM+CM}{BC}=1$ và $CD$ không đổi

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle ACD$ và $\triangle CBE$ có:
$AC=CB$ ($\triangle ABC$ đều), $\widehat{CAD}=\widehat{BCE}=60^\circ$, $AD=CE$ (gt).
Do đó $\triangle ACD=\triangle CBE$ (c.g.c).
Suy ra $CD=BE$. (1)
[[so-do:n2]]
Xét $\triangle BCD$ có $MH\parallel CD$ ($M\in BC$, $H\in BD$)
nên $\dfrac{MH}{CD}=\dfrac{BM}{BC}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Xét $\triangle CBE$ có $MK\parallel BE$ ($M\in CB$, $K\in CE$)
nên $\dfrac{MK}{BE}=\dfrac{CM}{BC}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3): $\dfrac{MH}{CD}+\dfrac{MK}{CD}=\dfrac{BM}{BC}+\dfrac{CM}{BC}=\dfrac{BC}{BC}=1$ ($M$ nằm giữa $B$, $C$).
Suy ra $MH+MK=CD$.
Vì $D$ cố định nên $CD$ không đổi.
Vậy khi $M$ chuyển động trên cạnh $BC$ thì $MH+MK$ có giá trị không đổi (bằng $CD$).
**hinh:** VHB2-197.png
**nghi_van:**
