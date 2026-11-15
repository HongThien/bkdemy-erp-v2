### TCHH-3.II.10 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 10@p150 (giải p150)
**sach:** Hai lần tính chất đường phân giác trong $\triangle AMB$, $\triangle AMC$ rồi dùng $MB=MC$ và Thalès đảo.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trung tuyến $AM$. Các tia phân giác của các góc $\widehat{AMB}$, $\widehat{AMC}$ cắt $AB$, $AC$ theo thứ tự ở $D$ và $E$. Chứng minh rằng $DE\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai tia phân giác $MD$, $ME$ cho hai tỉ số cùng bằng $\dfrac{MA}{MB}=\dfrac{MA}{MC}$ nên $\dfrac{DA}{DB}=\dfrac{EA}{EC}$; rồi dùng định lí Thalès đảo trong $\triangle ABC$.

- n1 | - | $\dfrac{DA}{DB}=\dfrac{MA}{MB}$ | gt | $MD$ là phân giác của $\widehat{AMB}$, tính chất đường phân giác
- n2 | - | $\dfrac{EA}{EC}=\dfrac{MA}{MC}$ | gt | $ME$ là phân giác của $\widehat{AMC}$, tính chất đường phân giác
- n3 | - | $\dfrac{DA}{DB}=\dfrac{EA}{EC}$ | n1, n2, gt | $MB=MC$ vì $M$ là trung điểm của $BC$
- n4 | - | $DE\parallel BC$ | n3 | định lí Thalès đảo trong $\triangle ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle AMB$ có $MD$ là phân giác của $\widehat{AMB}$ (gt)
nên $\dfrac{DA}{DB}=\dfrac{MA}{MB}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Xét $\triangle AMC$ có $ME$ là phân giác của $\widehat{AMC}$ (gt)
nên $\dfrac{EA}{EC}=\dfrac{MA}{MC}$ (tính chất đường phân giác). (2)
[[so-do:n3]]
Vì $AM$ là trung tuyến của $\triangle ABC$ (gt) nên $MB=MC$. (3)
Từ (1), (2), (3) suy ra $\dfrac{DA}{DB}=\dfrac{EA}{EC}$.
[[so-do:n4]]
Từ đó $\dfrac{DA}{DA+DB}=\dfrac{EA}{EA+EC}$, tức $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ ($D$ thuộc cạnh $AB$, $E$ thuộc cạnh $AC$).
Xét $\triangle ABC$ có $D\in AB$, $E\in AC$ và $\dfrac{AD}{AB}=\dfrac{AE}{AC}$
nên $DE\parallel BC$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-10.png
**nghi_van:** Sách viết $\dfrac{DA}{DB}=\dfrac{MB}{MA}$ (đảo tỉ số); đúng phải là $\dfrac{DA}{DB}=\dfrac{MA}{MB}$ — đã sửa (kết luận không đổi vì $MB=MC$).

### TCHH-3.II.11 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 11@p150 (giải p150)
**sach:** Ý a: tính chất đường phân giác hai lần, Thalès cho $DK\parallel BC$, so sánh tỉ số. Ý b: so sánh góc rồi cạnh đối diện trong tam giác.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $AB<AC$ và các đường phân giác $BD$, $CE$ ($D\in AC$, $E\in AB$).
**hinh:** TCHH-3-II-11.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Đường thẳng qua $D$ và song song với $BC$ cắt $AB$ ở $K$. Chứng minh rằng $E$ nằm giữa $B$ và $K$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** So sánh hai tỉ số $\dfrac{AK}{KB}=\dfrac{AD}{DC}=\dfrac{AB}{BC}$ và $\dfrac{AE}{EB}=\dfrac{AC}{BC}$ (nhỏ hơn vì $AB<AC$), rồi cộng $1$ vào hai vế để so sánh $KB$ với $EB$.

- n1 | - | $\dfrac{AD}{DC}=\dfrac{AB}{BC}$ | gt | $BD$ là phân giác của $\widehat{ABC}$, tính chất đường phân giác
- n2 | - | $\dfrac{AE}{EB}=\dfrac{AC}{BC}$ | gt | $CE$ là phân giác của $\widehat{ACB}$, tính chất đường phân giác
- n3 | - | $\dfrac{AK}{KB}<\dfrac{AE}{EB}$ | n1, n2, gt | $DK\parallel BC$ nên $\dfrac{AK}{KB}=\dfrac{AD}{DC}$ (Thalès); $AB<AC$
- n4 | - | $KB>EB$ | n3 | cộng $1$ vào hai vế
- n5 | - | $E$ nằm giữa $B$ và $K$ | n4 | $E$, $K$ cùng thuộc tia $BA$ và $BE<BK$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $BD$ là phân giác của $\widehat{ABC}$ (gt)
nên $\dfrac{AD}{DC}=\dfrac{AB}{BC}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Vì $CE$ là phân giác của $\widehat{ACB}$ (gt)
nên $\dfrac{AE}{EB}=\dfrac{AC}{BC}$ (tính chất đường phân giác). (2)
[[so-do:n3]]
Xét $\triangle ABC$ có $DK\parallel BC$ ($D\in AC$, $K\in AB$)
nên $\dfrac{AK}{KB}=\dfrac{AD}{DC}$ (định lí Thalès). (3)
Vì $AB<AC$ (gt) nên $\dfrac{AB}{BC}<\dfrac{AC}{BC}$. (4)
Từ (1), (2), (3), (4) suy ra $\dfrac{AK}{KB}<\dfrac{AE}{EB}$.
[[so-do:n4]]
Cộng $1$ vào hai vế: $\dfrac{AK}{KB}+1<\dfrac{AE}{EB}+1$
hay $\dfrac{AK+KB}{KB}<\dfrac{AE+EB}{EB}$.
Vì $K$, $E$ cùng thuộc cạnh $AB$ nên $AK+KB=AE+EB=AB$.
Do đó $\dfrac{AB}{KB}<\dfrac{AB}{EB}$, suy ra $KB>EB$.
[[so-do:n5]]
$E$ và $K$ cùng nằm trên tia $BA$ mà $BE<BK$
nên $E$ nằm giữa $B$ và $K$.
**hinh_lg:** TCHH-3-II-11_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $CD>DE>BE$.
**da_biet:** Biết $K$ là giao điểm của $AB$ với đường thẳng qua $D$ song song với $BC$, và $E$ nằm giữa $B$ và $K$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Dùng quan hệ giữa góc và cạnh đối diện trong tam giác: so sánh hai góc của $\triangle EBD$ để được $DE>BE$; rồi gọi $I=BD\cap CE$, cộng góc để so sánh hai góc của $\triangle CDE$ và được $CD>DE$.

- n1 | - | $\widehat{KBD}=\widehat{KDB}$ | gt | $\widehat{KDB}=\widehat{DBC}$ (so le trong, $DK\parallel BC$) và $\widehat{DBC}=\widehat{KBD}$ ($BD$ là phân giác)
- n2 | - | $\widehat{EBD}>\widehat{EDB}$ | n1, gt | $E$ nằm giữa $K$ và $B$ nên tia $DE$ nằm trong $\widehat{KDB}$
- n3 | - | $DE>BE$ | n2 | trong $\triangle EBD$, cạnh đối diện góc lớn hơn thì lớn hơn
- n4 | - | $\widehat{DEC}>\widehat{DCE}$ | n1, n2, gt | gọi $I=BD\cap CE$: $\widehat{CBD}+\widehat{ECB}=\widehat{EDB}+\widehat{DEC}$ và $\widehat{CBD}>\widehat{EDB}$
- n5 | - | $CD>DE$ | n4 | trong $\triangle CDE$, cạnh đối diện góc lớn hơn thì lớn hơn
- n6 | - | $CD>DE>BE$ | n3, n5 | ghép hai kết quả

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $DK\parallel BC$ (gt) nên $\widehat{KDB}=\widehat{DBC}$ (so le trong).
Vì $BD$ là phân giác của $\widehat{ABC}$ (gt) nên $\widehat{DBC}=\widehat{KBD}$ ($K$ thuộc tia $BA$).
Suy ra $\widehat{KBD}=\widehat{KDB}$. (1)
[[so-do:n2]]
Vì $E$ nằm giữa $K$ và $B$ (ý a) nên tia $DE$ nằm trong $\widehat{KDB}$.
Do đó $\widehat{KDB}>\widehat{EDB}$. (2)
Lại có $\widehat{EBD}=\widehat{KBD}$ ($E$ thuộc tia $BK$). (3)
Từ (1), (2), (3) suy ra $\widehat{EBD}>\widehat{EDB}$.
[[so-do:n3]]
Xét $\triangle EBD$ có $\widehat{EBD}>\widehat{EDB}$
nên $ED>EB$ (cạnh đối diện góc lớn hơn thì lớn hơn). (4)
[[so-do:n4]]
Gọi $I$ là giao điểm của $BD$ và $CE$.
Hai góc $\widehat{BIC}$ và $\widehat{DIE}$ đối đỉnh nên bằng nhau.
Tổng ba góc của $\triangle IBC$ và của $\triangle IDE$ đều bằng $180^\circ$
nên $\widehat{CBD}+\widehat{ECB}=\widehat{EDB}+\widehat{DEC}$.
Mà $\widehat{CBD}=\widehat{KBD}=\widehat{EBD}>\widehat{EDB}$ (cmt)
nên $\widehat{DEC}>\widehat{ECB}$.
Lại có $\widehat{ECB}=\widehat{DCE}$ ($CE$ là phân giác của $\widehat{ACB}$, $D$ thuộc tia $CA$).
Suy ra $\widehat{DEC}>\widehat{DCE}$.
[[so-do:n5]]
Xét $\triangle CDE$ có $\widehat{DEC}>\widehat{DCE}$
nên $CD>DE$ (cạnh đối diện góc lớn hơn thì lớn hơn). (5)
[[so-do:n6]]
Từ (4) và (5) suy ra $CD>DE>BE$.
**hinh_lg:** TCHH-3-II-11_b_lg.png
**nghi_van:**

### TCHH-3.II.12 → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 12@p151 (giải p151)
**sach:** Ý a: nhân ba tỉ số của tính chất đường phân giác. Ý b: kẻ $CH\parallel AD$, Thalès và bất đẳng thức tam giác (sách không chứng minh $AH=AC$; kho chứng minh).
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có ba đường phân giác $AD$, $BE$, $CF$ ($D\in BC$, $E\in CA$, $F\in AB$).
**hinh:** TCHH-3-II-12.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Mỗi đường phân giác cho tỉ số hai cạnh kề của tam giác; nhân ba tỉ số thì các cạnh triệt tiêu.

- n1 | - | $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ | gt | $AD$ là phân giác của $\widehat{BAC}$, tính chất đường phân giác
- n2 | - | $\dfrac{EC}{EA}=\dfrac{BC}{BA}$ | gt | $BE$ là phân giác của $\widehat{ABC}$
- n3 | - | $\dfrac{FA}{FB}=\dfrac{CA}{CB}$ | gt | $CF$ là phân giác của $\widehat{ACB}$
- n4 | - | $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ | n1, n2, n3 | nhân ba đẳng thức, tử và mẫu triệt tiêu

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $AD$ là phân giác của $\widehat{BAC}$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Vì $BE$ là phân giác của $\widehat{ABC}$ (gt)
nên $\dfrac{EC}{EA}=\dfrac{BC}{BA}$ (tính chất đường phân giác). (2)
[[so-do:n3]]
Vì $CF$ là phân giác của $\widehat{ACB}$ (gt)
nên $\dfrac{FA}{FB}=\dfrac{CA}{CB}$ (tính chất đường phân giác). (3)
[[so-do:n4]]
Nhân vế với vế của (1), (2), (3):
$\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=\dfrac{AB}{AC}\cdot\dfrac{BC}{BA}\cdot\dfrac{CA}{CB}=1$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac1{AD}+\dfrac1{BE}+\dfrac1{CF}>\dfrac1{BC}+\dfrac1{CA}+\dfrac1{AB}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $BC=a$, $CA=b$, $AB=c$. Qua $C$ kẻ $CH\parallel AD$ cắt đường thẳng $BA$ tại $H$: phân giác cho $AH=AC$, Thalès cho $AD=\dfrac{c\cdot CH}{b+c}$, bất đẳng thức tam giác $CH<2b$ cho $\dfrac1{AD}>\dfrac12\left(\dfrac1b+\dfrac1c\right)$; làm tương tự cho hai phân giác còn lại rồi cộng.

- n1 | - | $A$ nằm giữa $B$ và $H$, $AH=AC=b$, $BH=b+c$ | gt | $AD\parallel CH$ và $AD$ là phân giác nên $\triangle ACH$ cân tại $A$
- n2 | - | $AD=\dfrac{c\cdot CH}{b+c}$ | n1, gt | $AD\parallel CH$ nên $\dfrac{AD}{CH}=\dfrac{BA}{BH}$ (hệ quả Thalès)
- n3 | - | $AD<\dfrac{2bc}{b+c}$ | n1, n2 | $CH<CA+AH=2b$ (bất đẳng thức tam giác)
- n4 | - | $\dfrac1{AD}>\dfrac12\left(\dfrac1b+\dfrac1c\right)$ | n3 | nghịch đảo hai vế
- n5 | - | $\dfrac1{BE}>\dfrac12\left(\dfrac1a+\dfrac1c\right)$ và $\dfrac1{CF}>\dfrac12\left(\dfrac1a+\dfrac1b\right)$ | gt | làm tương tự cho $BE$, $CF$
- n6 | - | $\dfrac1{AD}+\dfrac1{BE}+\dfrac1{CF}>\dfrac1a+\dfrac1b+\dfrac1c$ | n4, n5 | cộng ba bất đẳng thức

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $BC=a$, $CA=b$, $AB=c$.
Qua $C$ kẻ đường thẳng song song với $AD$, cắt đường thẳng $BA$ tại $H$.
Xét $\triangle BCH$ có $AD\parallel CH$ ($A\in BH$, $D\in BC$)
nên $\dfrac{AD}{CH}=\dfrac{BA}{BH}=\dfrac{BD}{BC}<1$ (hệ quả của định lí Thalès). (1)
Suy ra $BH>BA$, tức $A$ nằm giữa $B$ và $H$.
Vì $AD\parallel CH$ nên $\widehat{ACH}=\widehat{CAD}$ (so le trong) và $\widehat{AHC}=\widehat{BAD}$ (đồng vị).
Mà $\widehat{BAD}=\widehat{CAD}$ ($AD$ là phân giác của $\widehat{BAC}$).
Suy ra $\widehat{ACH}=\widehat{AHC}$, nên $\triangle ACH$ cân tại $A$ và $AH=AC=b$.
Do đó $BH=BA+AH=b+c$.
[[so-do:n2]]
Từ (1) và $BH=b+c$ suy ra $\dfrac{AD}{CH}=\dfrac{c}{b+c}$, tức $AD=\dfrac{c\cdot CH}{b+c}$.
[[so-do:n3]]
Trong $\triangle ACH$ có $CH<CA+AH=2b$ (bất đẳng thức tam giác; $A$, $C$, $H$ không thẳng hàng).
Do đó $AD<\dfrac{c}{b+c}\cdot 2b=\dfrac{2bc}{b+c}$.
[[so-do:n4]]
Suy ra $\dfrac1{AD}>\dfrac{b+c}{2bc}=\dfrac12\left(\dfrac1b+\dfrac1c\right)$. (2)
[[so-do:n5]]
Chứng minh tương tự (kẻ qua $A$ đường thẳng song song với $BE$, qua $B$ đường thẳng song song với $CF$) ta có:
$\dfrac1{BE}>\dfrac12\left(\dfrac1a+\dfrac1c\right)$ (3) và $\dfrac1{CF}>\dfrac12\left(\dfrac1a+\dfrac1b\right)$. (4)
[[so-do:n6]]
Cộng vế với vế của (2), (3), (4):
$\dfrac1{AD}+\dfrac1{BE}+\dfrac1{CF}>\dfrac12\left[\left(\dfrac1b+\dfrac1c\right)+\left(\dfrac1a+\dfrac1c\right)+\left(\dfrac1a+\dfrac1b\right)\right]=\dfrac1a+\dfrac1b+\dfrac1c$.
**hinh_lg:** TCHH-3-II-12_b_lg.png
**nghi_van:**

### TCHH-3.II.13 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 13@p152 (giải p152)
**sach:** Gọi $O=AC\cap BD$; hệ quả Thalès hai lần rồi nhân vế (ý a, Thalès đảo); ý b dùng chuỗi tỉ số bằng nhau.
**loai:** nhieu_y
**loi_dan:**
Cho tứ giác lồi $ABCD$. Đường thẳng qua $A$ song song với $BC$ cắt $BD$ ở $E$, đường thẳng qua $B$ song song với $AD$ cắt $AC$ ở $G$. Gọi $O$ là giao điểm của $AC$ và $BD$.
**hinh:** TCHH-3-II-13.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $EG\parallel CD$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai lần hệ quả Thalès cho $\dfrac{OE}{OB}=\dfrac{OA}{OC}$ và $\dfrac{OB}{OD}=\dfrac{OG}{OA}$; nhân vế với vế được $\dfrac{OE}{OD}=\dfrac{OG}{OC}$, rồi Thalès đảo trong $\triangle OCD$.

- n1 | - | $\dfrac{OE}{OB}=\dfrac{OA}{OC}$ | gt | $AE\parallel BC$, hệ quả của định lí Thalès
- n2 | - | $\dfrac{OB}{OD}=\dfrac{OG}{OA}$ | gt | $BG\parallel AD$, hệ quả của định lí Thalès
- n3 | - | $\dfrac{OE}{OD}=\dfrac{OG}{OC}$ | n1, n2 | nhân vế với vế
- n4 | - | $EG\parallel CD$ | n3 | định lí Thalès đảo trong $\triangle OCD$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $O$ nằm giữa $A$ và $C$ (tứ giác lồi) và $AE\parallel BC$ nên $E$ và $B$ nằm về hai phía của $O$, tức $E$ thuộc tia $OD$.
Hai cát tuyến $AC$, $BE$ cắt nhau tại $O$ và $AE\parallel BC$
nên $\dfrac{OE}{OB}=\dfrac{OA}{OC}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Tương tự, $O$ nằm giữa $B$ và $D$ và $BG\parallel AD$ nên $G$ thuộc tia $OC$,
và $\dfrac{OB}{OD}=\dfrac{OG}{OA}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân vế với vế của (1) và (2): $\dfrac{OE}{OB}\cdot\dfrac{OB}{OD}=\dfrac{OA}{OC}\cdot\dfrac{OG}{OA}$
hay $\dfrac{OE}{OD}=\dfrac{OG}{OC}$.
[[so-do:n4]]
Xét $\triangle OCD$ có $E\in$ tia $OD$, $G\in$ tia $OC$ và $\dfrac{OE}{OD}=\dfrac{OG}{OC}$
nên $EG\parallel CD$ (định lí Thalès đảo).
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Giả sử $AB\parallel CD$. Chứng minh rằng $AB^2=CD\cdot EG$.
**da_biet:** Biết $EG\parallel CD$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Khi $AB\parallel CD$ thì $AB$, $EG$, $CD$ song song với nhau. Ba tỉ số $\dfrac{AB}{EG}=\dfrac{OA}{OG}$, $\dfrac{OA}{OG}=\dfrac{OD}{OB}$, $\dfrac{OD}{OB}=\dfrac{CD}{AB}$ cho $\dfrac{AB}{EG}=\dfrac{CD}{AB}$.

- n1 | - | $\dfrac{AB}{EG}=\dfrac{OA}{OG}$ | gt | $AB\parallel EG$ (cùng song song với $CD$), hệ quả Thalès
- n2 | - | $\dfrac{OA}{OG}=\dfrac{OD}{OB}$ | gt | $BG\parallel AD$, hệ quả Thalès
- n3 | - | $\dfrac{OD}{OB}=\dfrac{CD}{AB}$ | gt | $AB\parallel CD$, hệ quả Thalès
- n4 | - | $AB^2=CD\cdot EG$ | n1, n2, n3 | ghép ba tỉ số bằng nhau

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $AB\parallel CD$ (gt) và $EG\parallel CD$ (ý a) nên $AB\parallel EG$.
Hai cát tuyến $AG$ ($=AC$) và $BE$ ($=BD$) cắt nhau tại $O$, $A$ và $G$ ở hai phía của $O$, $B$ và $E$ ở hai phía của $O$
nên $\dfrac{AB}{EG}=\dfrac{OA}{OG}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Vì $BG\parallel AD$ nên $\dfrac{OB}{OD}=\dfrac{OG}{OA}$ (hệ quả của định lí Thalès),
suy ra $\dfrac{OA}{OG}=\dfrac{OD}{OB}$. (2)
[[so-do:n3]]
Vì $AB\parallel CD$ nên $\dfrac{OD}{OB}=\dfrac{CD}{AB}$ (hệ quả của định lí Thalès, hai cát tuyến $AC$, $BD$ cắt nhau tại $O$). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{AB}{EG}=\dfrac{CD}{AB}$.
Vậy $AB^2=CD\cdot EG$.
**hinh_lg:** TCHH-3-II-13_b_lg.png
**nghi_van:** Sách không ghi "lồi" nhưng hình vẽ và lời giải (điểm $O$ nằm trong hai đường chéo) cho thấy tứ giác lồi — đã thêm vào đề.

### TCHH-3.II.14 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 14 (hình thang)@p152 (giải p152–153)
**sach:** Hai hình bình hành $AFCD$, $DCBK$ cho $AF=DC=KB$; Thalès hai lần rồi Thalès đảo (ý a); ý b gọi $I=BD\cap CF$, chứng minh $IP\parallel DC$ rồi tiên đề Ơ-clít.
**loai:** nhieu_y
**loi_dan:**
Cho hình thang $ABCD$ ($AB\parallel CD$) có đáy nhỏ $CD$. Từ $D$ vẽ đường thẳng song song với $BC$, cắt $AC$ tại $M$ và $AB$ tại $K$. Từ $C$ vẽ đường thẳng song song với $AD$, cắt $AB$ tại $F$. Qua $F$ vẽ đường thẳng song song với $AC$, cắt $BC$ tại $P$.
**hinh:** TCHH-3-II-14.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $MP\parallel AB$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai hình bình hành $AFCD$, $DCBK$ cho $AF=DC=KB$ và $AK=FB$; nhờ đó $\dfrac{CM}{AM}$ và $\dfrac{CP}{PB}$ cùng bằng $\dfrac{DC}{AK}$, rồi Thalès đảo trong $\triangle CAB$.

- n1 | - | $AF=DC=KB$ và $AK=FB$ | gt | $AFCD$ và $DCBK$ là hình bình hành
- n2 | - | $\dfrac{CM}{AM}=\dfrac{DC}{AK}$ | gt | $DC\parallel AK$, hệ quả Thalès (hai cát tuyến $AC$, $DK$ cắt nhau tại $M$)
- n3 | - | $\dfrac{CP}{PB}=\dfrac{AF}{FB}$ | gt | $FP\parallel AC$, định lí Thalès trong $\triangle ABC$
- n4 | - | $\dfrac{CM}{AM}=\dfrac{CP}{PB}$ | n1, n2, n3 | cùng bằng $\dfrac{DC}{AK}$
- n5 | - | $MP\parallel AB$ | n4 | định lí Thalès đảo trong $\triangle CAB$

**Phần 2. Trình bày**

[[so-do:n1]]
Tứ giác $AFCD$ có $AF\parallel DC$ (vì $AB\parallel CD$) và $AD\parallel CF$ (gt) nên là hình bình hành, suy ra $AF=DC$.
Tứ giác $DCBK$ có $DC\parallel KB$ và $DK\parallel CB$ (gt) nên là hình bình hành, suy ra $KB=DC$.
Do $CD$ là đáy nhỏ nên $AF=KB=DC<AB$, vậy $F$ và $K$ thuộc đoạn $AB$.
Từ $AF=KB$ suy ra $AK=AB-KB=AB-AF=FB$. (1)
[[so-do:n2]]
Hai cát tuyến $AC$ và $DK$ cắt nhau tại $M$, $DC\parallel AK$
nên $\dfrac{CM}{AM}=\dfrac{DC}{AK}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Xét $\triangle ABC$ có $FP\parallel AC$ ($F\in AB$, $P\in BC$)
nên $\dfrac{CP}{PB}=\dfrac{AF}{FB}$ (định lí Thalès). (3)
[[so-do:n4]]
Từ (1) ta có $AF=DC$ và $FB=AK$, nên $\dfrac{AF}{FB}=\dfrac{DC}{AK}$. (4)
Từ (2), (3), (4) suy ra $\dfrac{CM}{AM}=\dfrac{CP}{PB}$.
[[so-do:n5]]
Xét $\triangle CAB$ có $M\in CA$, $P\in CB$ và $\dfrac{CM}{MA}=\dfrac{CP}{PB}$
nên $MP\parallel AB$ (định lí Thalès đảo).
**hinh_lg:** TCHH-3-II-14_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng ba đường thẳng $MP$, $CF$, $DB$ đồng quy.
**da_biet:** Biết $MP\parallel AB$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $I$ là giao điểm của $CF$ và $DB$. Chứng minh $IP\parallel DC\parallel AB$; khi đó $IP$ và $MP$ cùng đi qua $P$ và cùng song song với $AB$ nên trùng nhau, tức $I\in MP$.

- n1 | - | $\dfrac{DI}{IB}=\dfrac{DC}{FB}$ | gt | $DC\parallel FB$, hệ quả Thalès (hai cát tuyến $DB$, $CF$ cắt nhau tại $I$)
- n2 | - | $\dfrac{CP}{PB}=\dfrac{DI}{IB}$ | n1, gt | $\dfrac{CP}{PB}=\dfrac{AF}{FB}=\dfrac{DC}{FB}$ ($FP\parallel AC$, $AF=DC$)
- n3 | - | $IP\parallel DC$ | n2 | định lí Thalès đảo trong $\triangle BDC$
- n4 | - | $M$, $I$, $P$ thẳng hàng | n3, gt | $IP\parallel AB$, $MP\parallel AB$: qua $P$ chỉ có một đường song song với $AB$
- n5 | - | $MP$, $CF$, $DB$ đồng quy | n4 | $I$ là giao điểm của $CF$, $DB$ và $I\in MP$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $I$ là giao điểm của $CF$ và $DB$.
Hai cát tuyến $DB$ và $CF$ cắt nhau tại $I$, $DC\parallel FB$
nên $\dfrac{DI}{IB}=\dfrac{DC}{FB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $FP\parallel AC$ nên $\dfrac{CP}{PB}=\dfrac{AF}{FB}$ (định lí Thalès).
Mà $AF=DC$ ($AFCD$ là hình bình hành) nên $\dfrac{CP}{PB}=\dfrac{DC}{FB}$. (2)
Từ (1) và (2) suy ra $\dfrac{CP}{PB}=\dfrac{DI}{IB}$.
[[so-do:n3]]
Từ đó $\dfrac{DI+IB}{IB}=\dfrac{CP+PB}{PB}$ hay $\dfrac{DB}{IB}=\dfrac{CB}{PB}$, tức $\dfrac{BI}{BD}=\dfrac{BP}{BC}$.
Xét $\triangle BDC$ có $I\in BD$, $P\in BC$ và $\dfrac{BI}{BD}=\dfrac{BP}{BC}$
nên $IP\parallel DC$ (định lí Thalès đảo). Do đó $IP\parallel AB$. (3)
[[so-do:n4]]
Qua $P$ có hai đường thẳng $PI$ và $PM$ cùng song song với $AB$ (nhờ (3) và ý a).
Theo tiên đề Ơ-clít, hai đường thẳng này trùng nhau, nên $M$, $I$, $P$ thẳng hàng.
[[so-do:n5]]
Vậy $I$ nằm trên $MP$, mà $I$ là giao điểm của $CF$ và $DB$
nên ba đường thẳng $MP$, $CF$, $DB$ đồng quy tại $I$.
**hinh_lg:** TCHH-3-II-14_b_lg.png
**nghi_van:** Sách viết nhầm "$EP\parallel AC$" ở dòng đầu lời giải (đúng là $FP\parallel AC$) — đã theo đề.

### TCHH-3.II.14bis → HH00128
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 14 (lần hai, tam giác có $BC<BA$)@p153 (giải p153–154)
**sach:** Sách lấy $K=CF\cap AB$, $DF$ là đường trung bình của $\triangle AKC$ rồi biến đổi dài các tỉ số. Kho giữ $K$, $DF$ nhưng tính hai tỉ số $\dfrac{GB}{GD}$, $\dfrac{EC}{ED}$ bằng độ dài ($BC=a$, $BA=c$, $AC=b$) cùng tính chất đường phân giác, ngắn hơn.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $BC<BA$. Qua $C$ kẻ đường thẳng vuông góc với tia phân giác $BE$ của $\widehat{ABC}$ ($E\in AC$); đường thẳng này cắt $BE$ tại $F$ và cắt trung tuyến $BD$ tại $G$. Chứng minh rằng $EG\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $BC=a$, $BA=c$, $AC=b$ ($a<c$). Lấy $K$ trên tia $BA$ với $BK=a$: $BF$ vừa là phân giác vừa là đường cao của $\triangle BKC$ nên $F$ là trung điểm của $CK$, và $DF$ là đường trung bình của $\triangle CAK$. Khi đó $\dfrac{GB}{GD}$ và $\dfrac{EC}{ED}$ cùng bằng $\dfrac{2a}{c-a}$, rồi Thalès đảo trong $\triangle DBC$.

- n1 | - | $F$ là trung điểm của $CK$ và $G\in CK$ | gt | $\triangle BKC$ cân tại $B$, $BE$ là phân giác nên là đường cao và trung tuyến
- n2 | - | $DF\parallel AK$, $DF=\dfrac{c-a}{2}$ | n1, gt | $DF$ là đường trung bình của $\triangle CAK$, $AK=c-a$
- n3 | - | $\dfrac{GB}{GD}=\dfrac{2a}{c-a}$ | n1, n2 | $DF\parallel BK$, hệ quả Thalès
- n4 | - | $\dfrac{EC}{ED}=\dfrac{2a}{c-a}$ | gt | tính chất đường phân giác $\dfrac{EA}{EC}=\dfrac ca$ và $D$ là trung điểm của $AC$
- n5 | - | $EG\parallel BC$ | n3, n4 | định lí Thalès đảo trong $\triangle DBC$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $BC=a$, $BA=c$, $AC=b$; theo gt $a<c$.
Trên tia $BA$ lấy điểm $K$ sao cho $BK=BC=a$. Vì $a<c$ nên $K$ nằm giữa $B$ và $A$, $AK=c-a$.
$\triangle BKC$ cân tại $B$ có $BE$ là phân giác của góc ở đỉnh
nên $BE$ cũng là đường cao và đường trung tuyến, tức $BE\perp CK$ tại trung điểm của $CK$.
Qua $C$ chỉ có một đường thẳng vuông góc với $BE$ nên đường thẳng đó là $CK$,
giao điểm của nó với $BE$ là $F$, và $F$ là trung điểm của $CK$; $G$ thuộc $CK$.
[[so-do:n2]]
Xét $\triangle CAK$ có $D$, $F$ lần lượt là trung điểm của $CA$, $CK$
nên $DF$ là đường trung bình của $\triangle CAK$.
Suy ra $DF\parallel AK$ và $DF=\dfrac12AK=\dfrac{c-a}{2}$.
[[so-do:n3]]
Vì $K$ nằm giữa $A$ và $B$ nên $A$, $B$ ở hai phía của đường thẳng $CK$; $D$ cùng phía với $A$ nên $G$ nằm giữa $B$ và $D$.
Vì $DF\parallel BK$ (do $DF\parallel AK$, $K\in AB$) nên theo hệ quả của định lí Thalès (hai cát tuyến $BD$ và $KF$ cắt nhau tại $G$):
$\dfrac{GB}{GD}=\dfrac{BK}{DF}=\dfrac{a}{(c-a)/2}=\dfrac{2a}{c-a}$. (1)
[[so-do:n4]]
Vì $BE$ là phân giác của $\widehat{ABC}$ (gt) nên $\dfrac{EA}{EC}=\dfrac{BA}{BC}=\dfrac ca$ (tính chất đường phân giác).
Mà $EA+EC=b$ nên $EA=\dfrac{bc}{a+c}$ và $EC=\dfrac{ab}{a+c}$.
Vì $c>a$ nên $EA>EC$, do đó $EA>\dfrac b2=DA$, tức $E$ nằm giữa $D$ và $C$.
Suy ra $ED=EA-DA=\dfrac{bc}{a+c}-\dfrac b2=\dfrac{b(c-a)}{2(a+c)}$.
Vậy $\dfrac{EC}{ED}=\dfrac{ab}{a+c}:\dfrac{b(c-a)}{2(a+c)}=\dfrac{2a}{c-a}$. (2)
[[so-do:n5]]
Từ (1) và (2): $\dfrac{GB}{GD}=\dfrac{EC}{ED}$. Cộng $1$ vào hai vế: $\dfrac{GB+GD}{GD}=\dfrac{EC+ED}{ED}$
hay $\dfrac{BD}{GD}=\dfrac{CD}{ED}$, suy ra $\dfrac{DG}{DB}=\dfrac{DE}{DC}$.
Xét $\triangle DBC$ có $G\in DB$, $E\in DC$ và $\dfrac{DG}{DB}=\dfrac{DE}{DC}$
nên $EG\parallel BC$ (định lí Thalès đảo).
**hinh:** TCHH-3-II-14bis.png
**hinh_lg:** TCHH-3-II-14bis_lg.png
**nghi_van:**

### TCHH-3.II.15 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 15@p154 (giải p154–155) · Đề thi khảo sát học sinh giỏi lớp 9 vòng 1 huyện Tam Dương, 2014–2015
**sach:** Sách dùng hệ thức lượng ($AC^2=CH\cdot BC$) rồi Thalès. Kho thay bằng Pythagore (tính $CH=\dfrac{AC^2}{BC}$) và hệ quả Thalès cho $HE\parallel AB$, $HF\parallel AC$; ý b đặt $t=\dfrac{BD}{BC}$ và dùng Thalès cho $DM\parallel AC$, $DN\parallel AB$.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Gọi $E$, $F$ lần lượt là hình chiếu của $H$ trên $AC$, $AB$. Cho $D$ là một điểm trên cạnh $BC$; gọi $M$, $N$ lần lượt là hình chiếu của $D$ trên $AB$, $AC$. (Đề thi khảo sát học sinh giỏi lớp 9 vòng 1 huyện Tam Dương, 2014–2015)
**hinh:** TCHH-3-II-15.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{CE}{BF}=\dfrac{AC^3}{AB^3}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $BC=a$, $CA=b$, $AB=c$. Pythagore cho $CH=\dfrac{b^2}{a}$, $BH=\dfrac{c^2}{a}$; $HE\parallel AB$ và $HF\parallel AC$ cho $CE=\dfrac{b\cdot CH}{a}$, $BF=\dfrac{c\cdot BH}{a}$; rồi chia hai kết quả.

- n1 | - | $CH=\dfrac{b^2}{a}$ và $BH=\dfrac{c^2}{a}$ | gt | Pythagore cho $\triangle ABC$, $\triangle AHB$, $\triangle AHC$ và $CH+BH=a$
- n2 | - | $\dfrac{CE}{CA}=\dfrac{CH}{CB}$ | gt | $HE\parallel AB$ (cùng vuông góc với $AC$), định lí Thalès
- n3 | - | $\dfrac{BF}{BA}=\dfrac{BH}{BC}$ | gt | $HF\parallel AC$ (cùng vuông góc với $AB$), định lí Thalès
- n4 | - | $CE=\dfrac{b^3}{a^2}$ và $BF=\dfrac{c^3}{a^2}$ | n1, n2, n3 | thay $CH$, $BH$
- n5 | - | $\dfrac{CE}{BF}=\dfrac{AC^3}{AB^3}$ | n4 | chia hai đẳng thức

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $BC=a$, $CA=b$, $AB=c$.
Vì $\triangle ABC$ vuông tại $A$ nên $a^2=b^2+c^2$ (định lí Pythagore).
$\triangle AHB$ vuông tại $H$ nên $c^2=AH^2+BH^2$; $\triangle AHC$ vuông tại $H$ nên $b^2=AH^2+CH^2$.
Trừ vế với vế: $b^2-c^2=CH^2-BH^2=(CH-BH)(CH+BH)=(CH-BH)\cdot a$ ($H$ nằm giữa $B$, $C$).
Suy ra $CH-BH=\dfrac{b^2-c^2}{a}$. Cộng với $CH+BH=a$:
$2CH=\dfrac{a^2+b^2-c^2}{a}=\dfrac{2b^2}{a}$ (vì $a^2=b^2+c^2$).
Vậy $CH=\dfrac{b^2}{a}$, và $BH=a-CH=\dfrac{a^2-b^2}{a}=\dfrac{c^2}{a}$.
[[so-do:n2]]
Vì $HE\perp AC$ và $AB\perp AC$ nên $HE\parallel AB$.
Xét $\triangle CAB$ có $HE\parallel AB$ ($H\in CB$, $E\in CA$)
nên $\dfrac{CE}{CA}=\dfrac{CH}{CB}$ (định lí Thalès). (1)
[[so-do:n3]]
Vì $HF\perp AB$ và $AC\perp AB$ nên $HF\parallel AC$.
Xét $\triangle BAC$ có $HF\parallel AC$ ($H\in BC$, $F\in BA$)
nên $\dfrac{BF}{BA}=\dfrac{BH}{BC}$ (định lí Thalès). (2)
[[so-do:n4]]
Từ (1): $CE=b\cdot\dfrac{b^2/a}{a}=\dfrac{b^3}{a^2}$. Từ (2): $BF=c\cdot\dfrac{c^2/a}{a}=\dfrac{c^3}{a^2}$.
[[so-do:n5]]
Vậy $\dfrac{CE}{BF}=\dfrac{b^3}{c^3}=\dfrac{AC^3}{AB^3}$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $DB\cdot DC=MA\cdot MB+NA\cdot NC$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $AMDN$ có ba góc vuông nên là hình chữ nhật, $DM\parallel AC$, $DN\parallel AB$. Đặt $t=\dfrac{BD}{BC}$; Thalès cho $MB=tc$, $MA=(1-t)c$, $NC=(1-t)b$, $NA=tb$; hai vế cùng bằng $t(1-t)a^2$.

- n1 | - | $DM\parallel AC$ và $DN\parallel AB$ | gt | $AMDN$ có ba góc vuông nên là hình chữ nhật
- n2 | - | $MB=tc$ và $MA=(1-t)c$ | n1, gt | $DM\parallel AC$, Thalès: $\dfrac{BM}{BA}=\dfrac{BD}{BC}=t$
- n3 | - | $NC=(1-t)b$ và $NA=tb$ | n1, gt | $DN\parallel AB$, Thalès: $\dfrac{CN}{CA}=\dfrac{CD}{CB}=1-t$
- n4 | - | $DB\cdot DC=t(1-t)a^2$ | gt | $DB=ta$, $DC=(1-t)a$
- n5 | - | $MA\cdot MB+NA\cdot NC=t(1-t)a^2$ | n2, n3 | $=t(1-t)(c^2+b^2)$ và Pythagore $b^2+c^2=a^2$
- n6 | - | $DB\cdot DC=MA\cdot MB+NA\cdot NC$ | n4, n5 | hai vế cùng bằng $t(1-t)a^2$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $BC=a$, $CA=b$, $AB=c$, $t=\dfrac{BD}{BC}$ ($0\le t\le1$).
Tứ giác $AMDN$ có $\widehat{A}=\widehat{M}=\widehat{N}=90^\circ$ nên là hình chữ nhật.
Suy ra $DM\parallel AC$ và $DN\parallel AB$.
[[so-do:n2]]
Xét $\triangle BAC$ có $DM\parallel AC$ ($M\in BA$, $D\in BC$)
nên $\dfrac{BM}{BA}=\dfrac{BD}{BC}=t$ (hệ quả của định lí Thalès).
Do đó $MB=tc$ và $MA=AB-MB=(1-t)c$.
[[so-do:n3]]
Xét $\triangle CAB$ có $DN\parallel AB$ ($N\in CA$, $D\in CB$)
nên $\dfrac{CN}{CA}=\dfrac{CD}{CB}=1-t$ (hệ quả của định lí Thalès).
Do đó $NC=(1-t)b$ và $NA=AC-NC=tb$.
[[so-do:n4]]
Có $DB=ta$ và $DC=(1-t)a$ nên $DB\cdot DC=t(1-t)a^2$. (1)
[[so-do:n5]]
$MA\cdot MB+NA\cdot NC=(1-t)c\cdot tc+tb\cdot(1-t)b=t(1-t)(b^2+c^2)=t(1-t)a^2$ (định lí Pythagore). (2)
[[so-do:n6]]
Từ (1) và (2) suy ra $DB\cdot DC=MA\cdot MB+NA\cdot NC$.
**hinh_lg:**
**nghi_van:**

### TCHH-3.II.16 → DE_SAU (HH00163)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 16@p155 (giải p155) · Đề thi học sinh giỏi tỉnh Quảng Ngãi, 2012–2013
**noi_dung:** Cho tam giác nhọn $ABC$ có đường cao $AH$. Trên các đoạn $AH$, $AB$, $AC$ lần lượt lấy các điểm $D$, $E$, $F$ sao cho $\widehat{EDC}=\widehat{FDB}=90^\circ$ ($E$ khác $B$). Chứng minh rằng $EF\parallel BC$. (Đề thi học sinh giỏi tỉnh Quảng Ngãi, 2012–2013)
**ly_do:** Sách dùng hệ thức lượng trong tam giác vuông ($HD^2=HM\cdot HC=HB\cdot HN$ với $M$, $N$ là giao của $DE$, $DF$ với $BC$); cách Thalès thuần túy phải tự chứng minh các hệ thức này bằng Pythagore và xét vị trí điểm ($M$, $N$ nằm ngoài đoạn $BC$), dài và gượng hơn hẳn.
**hinh:** TCHH-3-II-16.png

### TCHH-3.II.17 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 17@p156 (giải p156) · Đề thi học sinh giỏi tỉnh Lâm Đồng, 2012–2013
**sach:** Kẻ $BI$, $CS$ song song $EF$ cắt $AM$; hệ quả Thalès cho hai tỉ số; $\triangle BIM=\triangle CSM$ nên $IM=MS$. Kho thay tam giác bằng nhau bằng Thalès: $BI\parallel CS$ và $MB=MC$ cho $MI=MS$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trung tuyến $AM$. Đường thẳng $d$ cắt các cạnh $AB$, $AC$ và trung tuyến $AM$ lần lượt tại $E$, $F$, $N$ ($E\ne A,B$; $F\ne A,C$). Chứng minh rằng $\dfrac{AB}{AE}+\dfrac{AC}{AF}=\dfrac{2AM}{AN}$. (Đề thi học sinh giỏi tỉnh Lâm Đồng, 2012–2013)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $B$ và $C$ kẻ hai đường thẳng song song với $d$, cắt $AM$ tại $I$, $S$. Hệ quả Thalès cho $\dfrac{AB}{AE}=\dfrac{AI}{AN}$, $\dfrac{AC}{AF}=\dfrac{AS}{AN}$; vì $M$ là trung điểm $BC$ nên $M$ là trung điểm $IS$, suy ra $AI+AS=2AM$.

- n1 | - | $\dfrac{AB}{AE}=\dfrac{AI}{AN}$ | gt | $BI\parallel EN$, hệ quả của định lí Thalès
- n2 | - | $\dfrac{AC}{AF}=\dfrac{AS}{AN}$ | gt | $CS\parallel FN$, hệ quả của định lí Thalès
- n3 | - | $M$ là trung điểm của $IS$ | gt | $BI\parallel CS$ và $MB=MC$, hệ quả Thalès
- n4 | - | $AI+AS=2AM$ | n3 | $I$, $S$ thuộc tia $AM$ và $M$ là trung điểm $IS$
- n5 | - | $\dfrac{AB}{AE}+\dfrac{AC}{AF}=\dfrac{2AM}{AN}$ | n1, n2, n4 | cộng hai đẳng thức rồi thay $AI+AS=2AM$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $B$ kẻ đường thẳng song song với $d$, cắt đường thẳng $AM$ tại $I$.
Qua $C$ kẻ đường thẳng song song với $d$, cắt đường thẳng $AM$ tại $S$.
Vì $E$ nằm giữa $A$ và $B$ nên $I$ và $N$ cùng phía đối với $A$; tương tự $S$ và $N$ cùng phía đối với $A$. Vậy $I$, $S$ thuộc tia $AM$.
Xét $\triangle ABI$ có $EN\parallel BI$ ($E\in AB$, $N\in AI$)
nên $\dfrac{AB}{AE}=\dfrac{AI}{AN}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ACS$ có $FN\parallel CS$ ($F\in AC$, $N\in AS$)
nên $\dfrac{AC}{AF}=\dfrac{AS}{AN}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Vì $BI\parallel EF\parallel CS$ nên $BI\parallel CS$.
Hai cát tuyến $BC$ và $IS$ cắt nhau tại $M$ nên $\dfrac{MI}{MS}=\dfrac{MB}{MC}=1$ (hệ quả của định lí Thalès, $M$ nằm giữa $B$ và $C$).
Suy ra $MI=MS$ và $M$ nằm giữa $I$ và $S$, tức $M$ là trung điểm của $IS$.
[[so-do:n4]]
Vì $I$, $S$ cùng thuộc tia $AM$ và $M$ là trung điểm của $IS$
nên $AM=\dfrac{AI+AS}{2}$, tức $AI+AS=2AM$. (3)
[[so-do:n5]]
Cộng vế với vế của (1) và (2): $\dfrac{AB}{AE}+\dfrac{AC}{AF}=\dfrac{AI+AS}{AN}$.
Thay (3): $\dfrac{AB}{AE}+\dfrac{AC}{AF}=\dfrac{2AM}{AN}$.
**hinh:** TCHH-3-II-17.png
**hinh_lg:** TCHH-3-II-17_lg.png
**nghi_van:** Sách ghi "$d$ cắt $AB$, $AC$"; kho hiểu là cắt các cạnh (đúng với $E\ne A,B$; $F\ne A,C$). Nếu $d$ cắt phần kéo dài thì hệ thức đúng với tỉ số có dấu.

### TCHH-3.II.18 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ3 II Bài 18@p156 (giải p156–157) · Đề học sinh giỏi tỉnh Phú Yên, 2012–2013
**sach:** Sách dùng $\triangle ABC\backsim\triangle PHI$ cho ý a và Cô-si cho ý b. Kho thay bằng Thalès: đặt $k=\dfrac{PQ}{AQ}$, hai lần Thalès cho $QH=k\cdot QB$, $QI=k\cdot QC$ và $\dfrac{AN}{AC}=\dfrac{BH}{BC}$, $\dfrac{AM}{AB}=\dfrac{CI}{CB}$. Ý b: Cô-si cho ba số có tổng $1$ rồi hình bình hành $AMPN$.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$. Gọi $Q$ là điểm trên cạnh $BC$ ($Q\ne B$, $Q\ne C$). Trên $AQ$ lấy điểm $P$ ($P\ne A$, $P\ne Q$). Hai đường thẳng qua $P$ song song với $AC$, $AB$ lần lượt cắt $AB$, $AC$ tại $M$, $N$. (Đề học sinh giỏi tỉnh Phú Yên, 2012–2013)
**hinh:** TCHH-3-II-18.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{AM}{AB}+\dfrac{AN}{AC}+\dfrac{PQ}{AQ}=1$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $k=\dfrac{PQ}{AQ}$. Gọi $H$, $I$ là giao của $PN$, $PM$ với $BC$. Hai lần Thalès cho $QH=k\cdot QB$, $QI=k\cdot QC$ nên $BH=(1-k)BQ$, $CI=(1-k)CQ$; lại có $\dfrac{AN}{AC}=\dfrac{BH}{BC}$, $\dfrac{AM}{AB}=\dfrac{CI}{CB}$; cộng lại.

- n1 | - | $QH=k\cdot QB$ và $QI=k\cdot QC$ | gt | $PH\parallel AB$, $PI\parallel AC$, hệ quả Thalès
- n2 | - | $BH=(1-k)BQ$ và $CI=(1-k)CQ$ | n1 | $H$ nằm giữa $B$ và $Q$, $I$ nằm giữa $Q$ và $C$
- n3 | - | $\dfrac{AN}{AC}=\dfrac{BH}{BC}$ | gt | $NH\parallel AB$, định lí Thalès
- n4 | - | $\dfrac{AM}{AB}=\dfrac{CI}{CB}$ | gt | $MI\parallel AC$, định lí Thalès
- n5 | - | $\dfrac{AM}{AB}+\dfrac{AN}{AC}+\dfrac{PQ}{AQ}=1$ | n2, n3, n4 | thay và dùng $BQ+CQ=BC$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $k=\dfrac{PQ}{AQ}$; vì $P$ nằm giữa $A$ và $Q$ nên $0<k<1$.
Đường thẳng qua $P$ song song với $AB$ (đường $PN$) cắt $QB$ tại $H$; đường thẳng qua $P$ song song với $AC$ (đường $PM$) cắt $QC$ tại $I$.
Xét $\triangle QAB$ có $PH\parallel AB$ ($P\in QA$, $H\in QB$)
nên $\dfrac{QH}{QB}=\dfrac{QP}{QA}=k$ (hệ quả của định lí Thalès).
Xét $\triangle QAC$ có $PI\parallel AC$ ($P\in QA$, $I\in QC$)
nên $\dfrac{QI}{QC}=\dfrac{QP}{QA}=k$ (hệ quả của định lí Thalès).
[[so-do:n2]]
Vì $QH=k\cdot QB<QB$ nên $H$ nằm giữa $B$ và $Q$, do đó $BH=BQ-QH=(1-k)BQ$.
Tương tự $I$ nằm giữa $Q$ và $C$ và $CI=(1-k)CQ$.
[[so-do:n3]]
Xét $\triangle CAB$ có $NH\parallel AB$ ($N\in CA$, $H\in CB$)
nên $\dfrac{CN}{CA}=\dfrac{CH}{CB}$ (định lí Thalès).
Suy ra $\dfrac{AN}{AC}=1-\dfrac{CN}{CA}=1-\dfrac{CH}{CB}=\dfrac{BH}{BC}$. (1)
[[so-do:n4]]
Xét $\triangle BAC$ có $MI\parallel AC$ ($M\in BA$, $I\in BC$)
nên $\dfrac{BM}{BA}=\dfrac{BI}{BC}$ (định lí Thalès).
Suy ra $\dfrac{AM}{AB}=1-\dfrac{BM}{BA}=1-\dfrac{BI}{BC}=\dfrac{CI}{CB}$. (2)
[[so-do:n5]]
Từ (1), (2): $\dfrac{AM}{AB}+\dfrac{AN}{AC}+\dfrac{PQ}{AQ}=\dfrac{CI+BH}{BC}+k=\dfrac{(1-k)(CQ+BQ)}{BC}+k$.
Vì $Q$ nằm giữa $B$ và $C$ nên $BQ+CQ=BC$. Do đó tổng bằng $(1-k)+k=1$.
**hinh_lg:** TCHH-3-II-18_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Xác định vị trí của các điểm $Q$ trên $BC$ và $P$ trên $AQ$ để $\dfrac{AM\cdot AN\cdot PQ}{AB\cdot AC\cdot AQ}=\dfrac1{27}$.
**da_biet:** Biết $\dfrac{AM}{AB}+\dfrac{AN}{AC}+\dfrac{PQ}{AQ}=1$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $x=\dfrac{AM}{AB}$, $y=\dfrac{AN}{AC}$, $z=\dfrac{PQ}{AQ}$ dương có $x+y+z=1$ (ý a). Theo Cô-si $xyz\le\dfrac1{27}$, dấu bằng khi $x=y=z=\dfrac13$. Từ $z=\dfrac13$ ra vị trí $P$; từ $x=y$ ra $MN\parallel BC$, rồi nhờ hình bình hành $AMPN$ ra $Q$ là trung điểm $BC$; cuối cùng thử lại.

- n1 | - | $xyz=\dfrac1{27}$ khi và chỉ khi $x=y=z=\dfrac13$ | gt | Cô-si: $xyz\le\left(\dfrac{x+y+z}{3}\right)^3=\dfrac1{27}$, dấu bằng khi $x=y=z$
- n2 | - | $AP=\dfrac23AQ$ | n1 | $\dfrac{PQ}{AQ}=\dfrac13$
- n3 | - | $MN\parallel BC$ | n1 | $\dfrac{AM}{AB}=\dfrac{AN}{AC}$, Thalès đảo
- n4 | - | $Q$ là trung điểm của $BC$ | n3, gt | $AMPN$ là hình bình hành nên $J=AP\cap MN$ là trung điểm của $MN$; Thalès cho $BQ=QC$
- n5 | - | ngược lại, $Q$ là trung điểm $BC$ và $AP=\dfrac23AQ$ thì tích bằng $\dfrac1{27}$ | n2, n4 | dựng $M'$, $N'$ qua trung điểm $J$ của $AP$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $x=\dfrac{AM}{AB}$, $y=\dfrac{AN}{AC}$, $z=\dfrac{PQ}{AQ}$; ba số này dương và $x+y+z=1$ (ý a).
Theo bất đẳng thức Cô-si cho ba số dương: $xyz\le\left(\dfrac{x+y+z}{3}\right)^3=\dfrac1{27}$,
dấu bằng xảy ra khi và chỉ khi $x=y=z$.
Vậy $xyz=\dfrac1{27}$ khi và chỉ khi $x=y=z=\dfrac13$.
[[so-do:n2]]
Từ $z=\dfrac{PQ}{AQ}=\dfrac13$ suy ra $AP=\dfrac23AQ$.
[[so-do:n3]]
Từ $x=y$ ta có $\dfrac{AM}{AB}=\dfrac{AN}{AC}$ ($M\in AB$, $N\in AC$)
nên $MN\parallel BC$ (định lí Thalès đảo).
[[so-do:n4]]
Tứ giác $AMPN$ có $PM\parallel AN$ ($AN\subset AC$) và $PN\parallel AM$ ($AM\subset AB$) nên là hình bình hành.
Gọi $J$ là giao điểm của $AP$ và $MN$; $J$ là trung điểm của $MN$ và của $AP$ (hai đường chéo hình bình hành).
$J$ thuộc $AQ$. Xét $\triangle ABQ$ có $MJ\parallel BQ$ nên $\dfrac{MJ}{BQ}=\dfrac{AJ}{AQ}$;
xét $\triangle ACQ$ có $JN\parallel QC$ nên $\dfrac{JN}{QC}=\dfrac{AJ}{AQ}$ (hệ quả của định lí Thalès).
Mà $MJ=JN$ nên $BQ=QC$, tức $Q$ là trung điểm của $BC$.
[[so-do:n5]]
Ngược lại, giả sử $Q$ là trung điểm của $BC$ và $AP=\dfrac23AQ$.
Gọi $J$ là trung điểm của $AP$ thì $AJ=\dfrac13AQ$. Qua $J$ kẻ đường thẳng song song với $BC$, cắt $AB$, $AC$ tại $M'$, $N'$ ($J$ nằm trong tam giác nên nằm giữa $M'$, $N'$).
Thalès cho $\dfrac{AM'}{AB}=\dfrac{AJ}{AQ}=\dfrac{M'J}{BQ}=\dfrac13$ và $\dfrac{AN'}{AC}=\dfrac{N'J}{QC}=\dfrac13$; vì $BQ=QC$ nên $M'J=N'J$, $J$ là trung điểm của $M'N'$.
Tứ giác $AM'PN'$ có hai đường chéo $AP$, $M'N'$ cắt nhau tại trung điểm $J$ của mỗi đường nên là hình bình hành, suy ra $PM'\parallel AC$ và $PN'\parallel AB$.
Qua $P$ chỉ có một đường song song với $AC$ nên $M'\equiv M$; tương tự $N'\equiv N$.
Vậy $x=y=\dfrac13$, $z=\dfrac{PQ}{AQ}=\dfrac13$ và $xyz=\dfrac1{27}$.
Kết luận: $Q$ là trung điểm của $BC$ và $AP=\dfrac23AQ$ (tức $P$ là trọng tâm của tam giác $ABC$).
**hinh_lg:** TCHH-3-II-18_b_lg.png
**nghi_van:** Sách chỉ hỏi "vị trí điểm $Q$" nhưng biểu thức còn phụ thuộc $P$; đáp án của sách xác định cả $Q$ và $P$ — kho sửa đề thành "xác định vị trí $Q$ và $P$". Ý b dùng bất đẳng thức Cô-si (đại số), không dùng đồng dạng; nếu muốn bỏ hẳn cực trị khỏi chuyên đề Thalès thì chuyển ý b sang $HH00134$.
