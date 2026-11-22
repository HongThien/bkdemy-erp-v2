### TCHH-4.1 → KHAC (HH00093)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 1@p178 (giải p179)
**noi_dung:** Cho hình vuông $ABCD$. Trên tia đối của tia $CB$ lấy điểm $M$, trên tia đối của tia $DC$ lấy điểm $N$ sao cho $DN=BM$. Các đường thẳng qua $M$ song song với $AN$ và qua $N$ song song với $AM$ cắt nhau tại $F$. Gọi $O$ là trung điểm của $FA$. Chứng minh rằng ba điểm $B$, $O$, $D$ thẳng hàng.
**ly_do:** Lời giải sách chỉ dùng tam giác vuông bằng nhau ($\triangle AND=\triangle ABM$), hình bình hành $AMFN$ có hai cạnh kề bằng nhau và một góc vuông nên là hình vuông, trung tuyến ứng cạnh huyền ($OC=OM=OA$), rồi $B$, $D$ cùng nằm trên đường trung trực của $AC$. Không dùng Thalès, đường trung bình hay công cụ nào của chuyên đề này: thuộc kiến thức hình vuông và tam giác bằng nhau. Đã kiểm số (4 bộ số): $OA=OC$ và $B$, $O$, $D$ thẳng hàng.

### TCHH-4.2 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 2@p179 (giải p180)
**sach:** Coi $F$ là giao hai tia phân giác ngoài tại $A$ và $B$ của $\triangle ADB$ nên $DF$ là phân giác trong của góc $D$ (ý a); coi $E$ là giao của phân giác ngoài tại $B$ và phân giác trong tại $C$ của $\triangle BCD$ nên $DE$ là phân giác ngoài tại $D$, từ đó thẳng hàng (ý b). Kho giải ý a bằng khoảng cách tới ba đường thẳng (tự chứng minh phần "giao ba đường phân giác"), ý b bằng Mê-nê-la-uýt đảo cho $\triangle ABC$.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $\widehat{ABC}=120^\circ$. Hai đường phân giác trong $BD$ và $CE$ ($D$ thuộc cạnh $AC$, $E$ thuộc cạnh $AB$). Tia phân giác của góc ngoài tại đỉnh $A$ cắt đường thẳng $BC$ tại $F$.
**hinh:** TCHH-4-2.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\widehat{ADF}=\widehat{BDF}$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Muốn $DF$ là phân giác của $\widehat{ADB}$ ta chứng minh $F$ cách đều hai đường thẳng $DA$, $DB$. $F$ nằm trên phân giác ngoài tại $A$ nên cách đều $AB$, $AC$; $F$ nằm trên phân giác của $\widehat{ABx}$ ($Bx$ là tia đối của tia $BD$) nên cách đều $BA$, $BD$.

- n1 | - | $B$ nằm giữa $F$ và $C$ | gt | $\widehat{ABC}=120^\circ$ là góc lớn nhất nên $AC>AB$, rồi tính chất đường phân giác ngoài
- n2 | - | $BF$ là tia phân giác của $\widehat{ABx}$ ($Bx$ là tia đối của tia $BD$) | n1, gt | $\widehat{ABF}=60^\circ$ (kề bù) và $\widehat{FBx}=60^\circ$ (đối đỉnh)
- n3 | - | $F$ cách đều ba đường thẳng $AB$, $AC$, $BD$ | n2, gt | tính chất tia phân giác của một góc, cho $AF$ và $BF$
- n4 | - | $F$ nằm trong góc $\widehat{ADB}$ | n1, gt | vị trí của $F$ đối với hai đường thẳng $AC$, $BD$
- n5 | - | $DF$ là tia phân giác của $\widehat{ADB}$, tức $\widehat{ADF}=\widehat{BDF}$ | n3, n4 | điểm nằm trong góc và cách đều hai cạnh của góc

**Phần 2. Trình bày**

[[so-do:n1]]
Trong $\triangle ABC$ có $\widehat{ABC}=120^\circ$
nên $\widehat{A}+\widehat{C}=60^\circ$ (tổng ba góc của tam giác).
Suy ra $\widehat{ABC}$ là góc lớn nhất của tam giác,
nên $AC>AB$ (cạnh đối diện với góc lớn hơn thì lớn hơn).
Tia phân giác của góc ngoài tại $A$ cắt $BC$ tại $F$
nên $\dfrac{FB}{FC}=\dfrac{AB}{AC}<1$ (tính chất đường phân giác ngoài),
suy ra $FB<FC$.
Mà $F$ nằm ngoài đoạn $BC$ (tính chất đường phân giác ngoài)
nên $F$ nằm về phía $B$.
Vậy $B$ nằm giữa $F$ và $C$.
[[so-do:n2]]
Gọi $Bx$ là tia đối của tia $BD$.
Vì $BD$ là tia phân giác của $\widehat{ABC}$ (gt)
nên $\widehat{DBC}=\dfrac{1}{2}\cdot120^\circ=60^\circ$.
Mà $\widehat{FBx}=\widehat{DBC}$ (hai góc đối đỉnh)
nên $\widehat{FBx}=60^\circ$.
Vì $B$ nằm giữa $F$ và $C$ (cmt)
nên $\widehat{ABF}=180^\circ-\widehat{ABC}=60^\circ$ (hai góc kề bù).
Mặt khác $\widehat{ABx}=180^\circ-\widehat{ABD}=120^\circ$ (hai góc kề bù)
nên $\widehat{ABF}+\widehat{FBx}=\widehat{ABx}$.
Do đó tia $BF$ nằm giữa hai tia $BA$, $Bx$
và $\widehat{ABF}=\widehat{FBx}$.
Vậy $BF$ là tia phân giác của $\widehat{ABx}$.
[[so-do:n3]]
Kẻ $FP\perp AB$, $FQ\perp AC$, $FR\perp BD$
($P$, $Q$, $R$ thuộc các đường thẳng $AB$, $AC$, $BD$).
Vì $AF$ là tia phân giác của góc ngoài tại $A$ (gt)
nên $FP=FQ$ (tính chất tia phân giác của một góc).
Vì $BF$ là tia phân giác của $\widehat{ABx}$ (cmt)
nên $FP=FR$ (tính chất tia phân giác của một góc).
Suy ra $FP=FQ=FR$.
[[so-do:n4]]
Vì $F$ thuộc tia $CB$ (cmt)
nên $F$ và $B$ nằm cùng phía đối với đường thẳng $AC$.
Đường thẳng $BD$ cắt đoạn $FC$ tại $B$ (cmt)
nên $F$ và $C$ nằm khác phía đối với $BD$.
Mà $D$ nằm giữa $A$ và $C$
nên $A$ và $C$ nằm khác phía đối với $BD$.
Do đó $F$ và $A$ nằm cùng phía đối với $BD$.
Vậy $F$ nằm trong góc $\widehat{ADB}$.
[[so-do:n5]]
Điểm $F$ nằm trong góc $\widehat{ADB}$ (cmt)
và cách đều hai cạnh $DA$, $DB$ vì $FQ=FR$ (cmt)
nên $DF$ là tia phân giác của $\widehat{ADB}$
(điểm trong góc cách đều hai cạnh của góc).
Vậy $\widehat{ADF}=\widehat{BDF}$.
**hinh_lg:** TCHH-4-2_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng ba điểm $D$, $E$, $F$ thẳng hàng.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Ba điểm $F\in BC$, $D\in CA$, $E\in AB$ là chân hai đường phân giác trong và một đường phân giác ngoài của $\triangle ABC$; mỗi chân chia cạnh theo tỉ số hai cạnh kề, nên tích ba tỉ số theo thứ tự vòng quanh bằng $1$, rồi dùng Mê-nê-la-uýt đảo.

- n1 | - | $\dfrac{FB}{FC}=\dfrac{AB}{AC}$ và $F$ nằm ngoài đoạn $BC$ | gt | tính chất đường phân giác ngoài tại $A$ ($AB\ne AC$)
- n2 | - | $\dfrac{DC}{DA}=\dfrac{BC}{BA}$ | gt | tính chất đường phân giác trong $BD$
- n3 | - | $\dfrac{EA}{EB}=\dfrac{CA}{CB}$ | gt | tính chất đường phân giác trong $CE$
- n4 | - | $\dfrac{FB}{FC}\cdot\dfrac{DC}{DA}\cdot\dfrac{EA}{EB}=1$ | n1, n2, n3 | nhân ba đẳng thức theo từng vế
- n5 | - | $D$, $E$, $F$ thẳng hàng | n4 | định lí Mê-nê-la-uýt đảo ($D$, $E$ trong cạnh, $F$ ngoài cạnh)

**Phần 2. Trình bày**

[[so-do:n1]]
Trong $\triangle ABC$ có $\widehat{ABC}=120^\circ$
nên $\widehat{A}+\widehat{C}=60^\circ$ (tổng ba góc của tam giác).
Suy ra $\widehat{ABC}$ là góc lớn nhất,
nên $AC>AB$, tức $AB\ne AC$.
Do đó phân giác ngoài tại $A$ cắt đường thẳng $BC$ tại $F$ ngoài đoạn $BC$
và $\dfrac{FB}{FC}=\dfrac{AB}{AC}$ (tính chất đường phân giác ngoài). (1)
[[so-do:n2]]
$BD$ là tia phân giác của $\widehat{ABC}$ ($D\in AC$)
nên $\dfrac{DA}{DC}=\dfrac{BA}{BC}$ (tính chất đường phân giác),
suy ra $\dfrac{DC}{DA}=\dfrac{BC}{BA}$. (2)
[[so-do:n3]]
$CE$ là tia phân giác của $\widehat{ACB}$ ($E\in AB$)
nên $\dfrac{EA}{EB}=\dfrac{CA}{CB}$ (tính chất đường phân giác). (3)
[[so-do:n4]]
Nhân (1), (2), (3) theo từng vế:
$\dfrac{FB}{FC}\cdot\dfrac{DC}{DA}\cdot\dfrac{EA}{EB}=\dfrac{AB}{AC}\cdot\dfrac{BC}{BA}\cdot\dfrac{CA}{CB}=1$.
[[so-do:n5]]
Xét $\triangle ABC$ có $F\in BC$, $D\in CA$, $E\in AB$ (khác các đỉnh).
$D$, $E$ nằm trong cạnh $CA$, $AB$ còn $F$ nằm ngoài cạnh $BC$ (cmt)
nên trong ba điểm $F$, $D$, $E$ có đúng một điểm nằm ngoài cạnh.
Mà tích ba tỉ số theo thứ tự vòng quanh tam giác bằng $1$ (cmt)
nên theo định lí Mê-nê-la-uýt đảo, $F$, $D$, $E$ thẳng hàng.
Vậy $D$, $E$, $F$ thẳng hàng.
**hinh_lg:** TCHH-4-2_b_lg.png
**nghi_van:** (1) Sách để "tia phân giác góc ngoài tại $A$ cắt $BC$ tại $F$"; vì $F$ nằm trên phần kéo dài của $CB$ nên kho ghi "cắt đường thẳng $BC$" (khớp hình sách). (2) Ý b làm bằng Mê-nê-la-uýt đảo (không cần $\widehat{ABC}=120^\circ$, chỉ cần $AB\ne AC$) thay cho cách "tâm đường tròn bàng tiếp" của sách, nên cả bài xếp HH00131; ý a cần $120^\circ$ và dùng khoảng cách tới ba đường thẳng (tính chất tia phân giác). (3) Ở ý a, "tia $BF$ nằm giữa $BA$, $Bx$" suy từ $\widehat{ABF}+\widehat{FBx}=\widehat{ABx}$ (hai góc $60^\circ$ cộng $120^\circ$); đã kiểm số 5 tam giác khác nhau.

### TCHH-4.3 → KHAC (HH8T000000)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 3@p180 (giải p181)
**noi_dung:** Cho tam giác $ABC$. Vẽ ra phía ngoài tam giác hai tam giác vuông cân $ABD$ (vuông tại $B$) và $ACE$ (vuông tại $C$). Vẽ đường cao $AH$ ($H$ thuộc $BC$). Chứng minh rằng ba đường thẳng $AH$, $BE$, $CD$ đồng quy.
**ly_do:** Lời giải sách đưa ba đường thẳng về ba đường cao của một tam giác: kẻ $BN\perp CD$ cắt $HA$ tại $I$, chứng minh $\triangle IAB=\triangle CBD$ (g.c.g), rồi $\triangle IAC=\triangle BCE$ (c.g.c) để có $CI\perp BE$, nên $AH$, $BE$, $CD$ là ba đường cao của $\triangle IBC$. Chỉ dùng tam giác bằng nhau, tam giác vuông cân và tính chất ba đường cao đồng quy; không dùng Thalès hay công cụ nào sau. Đã kiểm số: đề đúng, $IA=BC$, $CI\perp BE$ (6 bộ số).

### TCHH-4.4 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 4@p181 (giải p181–182)
**sach:** Hai lần Mê-nê-la-uýt (cho tam giác $BFE$ và tam giác $BCE$), nhân vế được $\dfrac{IE}{IF}=\dfrac{DE}{FB}$ ($I$ là giao của $CG$ với $EF$); hai lần Thalès đổi thành $\dfrac{CE^2}{CF^2}$; rồi so với chân đường cao hạ từ $C$ của tam giác vuông $CEF$ bằng hệ thức lượng. Kho thay phần hệ thức lượng bằng định lí Pythagore (tính $KE$, $KF$ theo $CE$, $CF$, $EF$) và dùng Mê-nê-la-uýt đảo thay cho việc "so hai điểm chia cùng tỉ số".
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vuông $ABCD$. Điểm $F$ nằm trên cạnh $BC$ ($F$ khác $B$, $C$). Đường thẳng $AF$ cắt đường thẳng $DC$ tại $E$, đường thẳng $DF$ cắt đường thẳng $BE$ tại $G$. Chứng minh rằng $AE\perp CG$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $K$ là chân đường vuông góc hạ từ $C$ xuống $EF$ ($EF$ trùng $AE$); chứng minh $C$, $K$, $G$ thẳng hàng bằng Mê-nê-la-uýt đảo cho $\triangle EBF$ với cát tuyến $CKG$. Ba tỉ số cần có: $\dfrac{KE}{KF}$ tính bằng định lí Pythagore, $\dfrac{GE}{GB}$ tính bằng Mê-nê-la-uýt cho $\triangle EBC$ với cát tuyến $FGD$, và $\dfrac{DE}{FB}$ đổi bằng hai lần hệ quả của định lí Thalès.

- n1 | - | $\dfrac{DE}{FB}=\dfrac{CE^2}{CF^2}$ | gt | hệ quả của định lí Thalès cho $\triangle EAD$ ($FC\parallel AD$) và cho hai đường thẳng $AE$, $BC$ cắt nhau tại $F$ ($AB\parallel CE$), $AD=AB$
- n2 | - | $\dfrac{GE}{GB}=\dfrac{FC}{FB}\cdot\dfrac{DE}{DC}$ | gt | định lí Mê-nê-la-uýt cho $\triangle EBC$ với cát tuyến $FGD$
- n3 | - | $\dfrac{KE}{KF}=\dfrac{CE^2}{CF^2}$ | gt | định lí Pythagore cho $\triangle CKE$, $\triangle CKF$, $\triangle CEF$ ($K$ là chân đường cao từ $C$)
- n4 | - | $\dfrac{CB}{CF}\cdot\dfrac{KF}{KE}\cdot\dfrac{GE}{GB}=1$ | n1, n2, n3 | thay ba kết quả trên, $CB=CD$
- n5 | - | $C$, $K$, $G$ thẳng hàng | n4 | định lí Mê-nê-la-uýt đảo cho $\triangle EBF$ ($C$ ngoài cạnh $BF$, $K$ và $G$ trong cạnh)
- n6 | - | $AE\perp CG$ | n5, gt | $CK\perp EF$ và $EF$ trùng $AE$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $ABCD$ là hình vuông nên $AB=BC=CD=DA$, $AB\parallel CD$, $AD\parallel BC$ (gt).
Xét $\triangle EAD$ có $FC\parallel AD$ ($F$ thuộc đường thẳng $EA$, $C$ thuộc đường thẳng $ED$)
nên $\dfrac{EC}{ED}=\dfrac{CF}{DA}$ (hệ quả của định lí Thalès),
suy ra $DE=\dfrac{EC\cdot AD}{CF}$. (1)
Hai đường thẳng $AE$ và $BC$ cắt nhau tại $F$, $AB\parallel CE$
nên $\dfrac{FB}{FC}=\dfrac{AB}{CE}$ (hệ quả của định lí Thalès),
suy ra $FB=\dfrac{FC\cdot AB}{CE}$. (2)
Chia (1) cho (2), với $AD=AB$:
$\dfrac{DE}{FB}=\dfrac{EC\cdot AD}{CF}\cdot\dfrac{CE}{FC\cdot AB}=\dfrac{CE^2}{CF^2}$. (3)
[[so-do:n2]]
Xét $\triangle EBC$ có $F\in BC$, $D\in CE$, $G\in EB$
và $F$, $G$, $D$ thẳng hàng (gt)
nên theo định lí Mê-nê-la-uýt cho $\triangle EBC$ với cát tuyến $FGD$:
$\dfrac{FB}{FC}\cdot\dfrac{DC}{DE}\cdot\dfrac{GE}{GB}=1$,
suy ra $\dfrac{GE}{GB}=\dfrac{FC}{FB}\cdot\dfrac{DE}{DC}$. (4)
[[so-do:n3]]
Vì $CD\perp CB$ nên $\triangle CEF$ vuông tại $C$.
Gọi $K$ là chân đường vuông góc hạ từ $C$ xuống $EF$.
Vì $\widehat{E}$, $\widehat{F}$ của tam giác vuông $CEF$ là các góc nhọn
nên $K$ nằm giữa $E$ và $F$.
Theo định lí Pythagore:
$CE^2=CK^2+KE^2$, $CF^2=CK^2+KF^2$ và $EF^2=CE^2+CF^2$.
Trừ hai đẳng thức đầu theo vế:
$CE^2-CF^2=KE^2-KF^2=(KE-KF)(KE+KF)=(KE-KF)\cdot EF$.
Suy ra $KE-KF=\dfrac{CE^2-CF^2}{EF}$.
Lại có $KE+KF=EF=\dfrac{CE^2+CF^2}{EF}$.
Cộng và trừ hai đẳng thức này theo vế được
$KE=\dfrac{CE^2}{EF}$ và $KF=\dfrac{CF^2}{EF}$.
Vậy $\dfrac{KE}{KF}=\dfrac{CE^2}{CF^2}$. (5)
[[so-do:n4]]
Với $CB=CD$, từ (4):
$\dfrac{CB}{CF}\cdot\dfrac{KF}{KE}\cdot\dfrac{GE}{GB}=\dfrac{CB}{CF}\cdot\dfrac{KF}{KE}\cdot\dfrac{FC}{FB}\cdot\dfrac{DE}{DC}=\dfrac{DE}{FB}\cdot\dfrac{KF}{KE}$.
Thay (3) và (5):
$\dfrac{DE}{FB}\cdot\dfrac{KF}{KE}=\dfrac{CE^2}{CF^2}\cdot\dfrac{CF^2}{CE^2}=1$.
[[so-do:n5]]
Xét $\triangle EBF$ có $C\in BF$, $K\in FE$, $G\in EB$ (khác các đỉnh).
$F$ nằm giữa $B$ và $C$ nên $C$ nằm ngoài cạnh $BF$.
$K$ nằm trong cạnh $FE$ (cmt).
Từ (2) có $CE=\dfrac{FC\cdot AB}{FB}$,
thay vào (1): $DE=\dfrac{AB\cdot AD}{FB}=\dfrac{AB^2}{FB}$.
Mà $AB-FC=BC-FC=FB$ ($F$ nằm giữa $B$ và $C$)
nên $DE-CE=\dfrac{AB\,(AB-FC)}{FB}=AB=DC$.
Do đó $DE=DC+CE$,
suy ra $C$ nằm giữa $D$ và $E$.
Đường thẳng $DF$ cắt đoạn $BC$ tại $F$
nên $B$ và $C$ nằm khác phía đối với $DF$.
$C$ và $E$ nằm cùng phía đối với $DF$ (cùng thuộc tia $DC$, cmt)
nên $B$ và $E$ nằm khác phía đối với $DF$.
Do đó $G$ nằm giữa $B$ và $E$, tức $G$ nằm trong cạnh $EB$.
Vậy trong ba điểm $C$, $K$, $G$ có đúng một điểm nằm ngoài cạnh.
Mà tích ba tỉ số theo thứ tự vòng quanh bằng $1$ (cmt)
nên theo định lí Mê-nê-la-uýt đảo cho $\triangle EBF$,
ba điểm $C$, $K$, $G$ thẳng hàng.
[[so-do:n6]]
Vì $C$ không thuộc $EF$ nên $C\ne K$,
suy ra đường thẳng $CG$ trùng đường thẳng $CK$.
Mà $CK\perp EF$ (cách dựng)
và $EF$ là đường thẳng $AE$ ($A$, $F$, $E$ thẳng hàng).
Vậy $AE\perp CG$.
**hinh:** TCHH-4-4.png
**hinh_lg:** TCHH-4-4_lg.png
**nghi_van:** (1) Đề sách "$AF$ cắt $DC$ kéo dài tại $E$, $DF$ kéo dài cắt $BE$ tại $G$" giữ nghĩa; kho thêm "$F$ khác $B$, $C$" để $E$, $G$ xác định ($F\equiv B$ thì $AF\parallel DC$; $F\equiv C$ thì $E\equiv C$). (2) Lời giải sách có hai chỗ in nhầm: cát tuyến ghi "$I,E,G$" (phải là $C,I,G$) và kết quả "$\dfrac{DE}{FB}=\dfrac{CF^2}{CE^2}$" (phải là $\dfrac{CE^2}{CF^2}$); đã kiểm số (5 bộ) cho đúng $\dfrac{DE}{FB}=\dfrac{CE^2}{CF^2}$ và $\dfrac{KE}{KF}=\dfrac{CE^2}{CF^2}$. (3) Bài sách dùng "hệ thức lượng quen thuộc" cho $\dfrac{KE}{KF}$; kho thay bằng Pythagore nên vẫn thuộc chuyên đề Thalès. (4) Hình đề vẽ $F$ ở khoảng một phần ba cạnh $BC$ tính từ $C$ cho khỏi cân đối đặc biệt. (5) Người soát (Opus) sửa: bản trạm suy "$C$ nằm giữa $D$ và $E$" từ "$A$, $E$ khác phía đối với $BC$" mà không có căn cứ (vòng quanh); nay dùng hệ quả Thalès dạng đường thẳng (đúng cả khi cắt phần kéo dài) rồi suy vị trí từ độ dài $DE=DC+CE$.

### TCHH-4.5 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 5@p182
**sach:** Hai lần Mê-nê-la-uýt: cho $\triangle ABA'$ với cát tuyến $COC'$ và cho $\triangle AA'C$ với cát tuyến $BOB'$, rồi cộng hai đẳng thức theo vế ($CA'+BA'=BC$).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $A'$, $B'$, $C'$ lần lượt thuộc các cạnh $BC$, $CA$, $AB$ (khác các đỉnh) sao cho ba đường thẳng $AA'$, $BB'$, $CC'$ đồng quy tại điểm $O$. Chứng minh rằng $\dfrac{OA}{OA'}=\dfrac{B'A}{B'C}+\dfrac{C'A}{C'B}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Dùng Mê-nê-la-uýt cho $\triangle ABA'$ với cát tuyến $COC'$ để có $\dfrac{OA}{OA'}\cdot\dfrac{CA'}{CB}=\dfrac{C'A}{C'B}$, cho $\triangle AA'C$ với cát tuyến $BOB'$ để có $\dfrac{OA}{OA'}\cdot\dfrac{BA'}{BC}=\dfrac{B'A}{B'C}$; cộng hai đẳng thức thì $CA'+BA'=BC$ gộp thành $\dfrac{OA}{OA'}$.

- n1 | - | $\dfrac{OA}{OA'}\cdot\dfrac{CA'}{CB}=\dfrac{C'A}{C'B}$ | gt | định lí Mê-nê-la-uýt cho $\triangle ABA'$ với cát tuyến $COC'$
- n2 | - | $\dfrac{OA}{OA'}\cdot\dfrac{BA'}{BC}=\dfrac{B'A}{B'C}$ | gt | định lí Mê-nê-la-uýt cho $\triangle AA'C$ với cát tuyến $BOB'$
- n3 | - | $\dfrac{OA}{OA'}=\dfrac{B'A}{B'C}+\dfrac{C'A}{C'B}$ | n1, n2 | cộng hai đẳng thức theo vế, $CA'+BA'=BC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle ABA'$ có $C$ thuộc đường thẳng $BA'$, $O$ thuộc $A'A$, $C'$ thuộc $AB$
và $C$, $O$, $C'$ thẳng hàng (gt).
Theo định lí Mê-nê-la-uýt cho $\triangle ABA'$ với cát tuyến $COC'$:
$\dfrac{CB}{CA'}\cdot\dfrac{OA'}{OA}\cdot\dfrac{C'A}{C'B}=1$.
Suy ra $\dfrac{OA}{OA'}\cdot\dfrac{CA'}{CB}=\dfrac{C'A}{C'B}$. (1)
[[so-do:n2]]
Xét $\triangle AA'C$ có $B$ thuộc đường thẳng $A'C$, $B'$ thuộc $CA$, $O$ thuộc $AA'$
và $B$, $O$, $B'$ thẳng hàng (gt).
Theo định lí Mê-nê-la-uýt cho $\triangle AA'C$ với cát tuyến $BOB'$:
$\dfrac{BA'}{BC}\cdot\dfrac{B'C}{B'A}\cdot\dfrac{OA}{OA'}=1$.
Suy ra $\dfrac{OA}{OA'}\cdot\dfrac{BA'}{BC}=\dfrac{B'A}{B'C}$. (2)
[[so-do:n3]]
Cộng (1) và (2) theo từng vế:
$\dfrac{OA}{OA'}\cdot\left(\dfrac{CA'}{CB}+\dfrac{BA'}{BC}\right)=\dfrac{C'A}{C'B}+\dfrac{B'A}{B'C}$.
Vì $A'$ nằm giữa $B$ và $C$ nên $CA'+BA'=BC$,
suy ra $\dfrac{CA'}{CB}+\dfrac{BA'}{BC}=1$.
Vậy $\dfrac{OA}{OA'}=\dfrac{B'A}{B'C}+\dfrac{C'A}{C'B}$.
**hinh:** TCHH-4-5.png
**nghi_van:** Đề sách ghi "đồng quy tại điểm $O$ trong tam giác" với $A'\in BC$, $B'\in CA$, $C'\in AB$; kho giữ đúng cấu hình ba điểm nằm trong cạnh (khi đó $O$ nằm trong tam giác). Hình đề vẽ $O$ lệch khỏi trọng tâm để không gợi ba trung tuyến.

### TCHH-4.6 → KHAC (HH8T000000)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 6@p182 (giải p183)
**noi_dung:** Cho tam giác $ABC$ nhọn có $\widehat{BAC}=60^\circ$. Gọi $H$ là trực tâm của tam giác $ABC$. Gọi $M$, $N$ lần lượt là giao điểm của các đường trung trực của $BH$ và $CH$ với $AB$ và $AC$. Chứng minh rằng ba điểm $M$, $N$, $H$ thẳng hàng.
**ly_do:** Lời giải sách chỉ truy góc: $\widehat{BHC}=120^\circ$, $\widehat{ABH}=\widehat{ACH}=30^\circ$, hai tam giác $MBH$, $NCH$ cân (điểm trên đường trung trực) nên $\widehat{MHB}=\widehat{NHC}=30^\circ$, rồi $\widehat{MHN}=30^\circ+120^\circ+30^\circ=180^\circ$. Chỉ dùng tam giác vuông, tam giác cân và tổng góc; không dùng Thalès hay công cụ nào sau. Đã kiểm số (4 bộ số): $\widehat{BHC}=120^\circ$ và $M$, $H$, $N$ thẳng hàng với $H$ nằm giữa $M$ và $N$.

### TCHH-4.7 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ4 Bài 7@p183 (giải p183–184)
**noi_dung:** Bốn đường thẳng đôi một cắt nhau tạo thành bốn tam giác. Chứng minh rằng trực tâm của bốn tam giác này thẳng hàng.
**ly_do:** Lời giải sách chứng minh một bổ đề (ba điểm thẳng hàng $A$, $B$, $C$ và ba điểm $A_1$, $B_1$, $C_1$ có $AB_1\parallel BA_1$, $BC_1\parallel CB_1$, $CA_1\parallel AC_1$ thì $A_1$, $B_1$, $C_1$ thẳng hàng) bằng các cặp tam giác đồng dạng, rồi áp bổ đề cho ba trực tâm và lặp lại cho bốn trực tâm. Hướng không đồng dạng (dựng hình thang $ACDE$ với $AE\parallel CD$ rồi dùng bổ đề hình thang) phải xét nhiều vị trí tương đối của các điểm, thêm bước "mọi bộ ba trong bốn điểm thẳng hàng nên cả bốn thẳng hàng", dài và gượng hơn hẳn; để lô sau. Đã kiểm số (6 bộ bốn đường thẳng): bốn trực tâm thẳng hàng. Đề không nói "không ba đường nào đồng quy" (cần có để có bốn tam giác).
**nghi_van:** (người soát) Bổ đề của sách CÓ lời giải chỉ bằng Thalès: $D=AB_1\cap CA_1$, $E=CB_1\cap AC_1$ thì $AE\parallel CD$, $B_1=AD\cap CE$; Thalès cho $\dfrac{AC_1}{AE}=\dfrac{AB}{AC}$, $\dfrac{DA_1}{DC}=\dfrac{AB}{AC}$, đồng hồ cát tại $B_1$ cho $\dfrac{B_1A}{B_1D}=\dfrac{AE}{CD}=\dfrac{AC_1}{DA_1}$ ⇒ $C_1$, $B_1$, $A_1$ thẳng hàng. Phần nặng còn lại là vị trí điểm và bước áp cho trực tâm; giữ `DE_SAU` nhưng Thùy có thể muốn chuyển về HH00127 sau.
