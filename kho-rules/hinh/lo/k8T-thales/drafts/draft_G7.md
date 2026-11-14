### TCHH-5.1 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 1@p194
**noi_dung:** Cho tam giác $ABC$ vuông tại $C$. Trên cạnh góc vuông $BC$ lấy các điểm $D$ và $E$ sao cho $BD=DE=EC$. Chứng minh rằng nếu $BC=3AC$ thì $\widehat{AEC}+\widehat{ADC}+\widehat{ABC}=90^\circ$.
**ly_do:** lời giải cần hai tam giác đồng dạng $\triangle EAD\backsim\triangle EBA$ (c.g.c, vì $EA^2=ED\cdot EB$) để có $\widehat{DAE}=\widehat{ABC}$ rồi cộng góc ngoài; sách dựng thêm điểm $F$ và hai tam giác vuông đồng dạng $BFA$, $ACD$. Không tìm được cách gọn chỉ bằng Thalès (điều kiện $EA^2=ED\cdot EB$ không phải quan hệ song song).
**hinh:** TCHH-5-1.png

### TCHH-5.2 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 2@p194
**sach:** Kẻ qua $A$ đường thẳng song song $BC$ (cắt $BO$, $CO$, $DE$, $DF$ tại $P$, $Q$, $I$, $H$), dùng định lí Thalès nhiều lần để có $AH=AI$, rồi $DA$ là trung tuyến của $\triangle DHI$. Chỉ Thalès, không đồng dạng. Bản này làm gọn hơn: so sánh $OM$, $ON$ với $AH$, $AI$ ngay bằng Thalès (không cần trung tuyến).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, $O$ là một điểm nằm trong tam giác. Các đường thẳng $AO$, $BO$, $CO$ cắt các cạnh $BC$, $CA$, $AB$ lần lượt tại $D$, $E$, $F$. Qua $O$ kẻ đường thẳng song song với $BC$ cắt $DE$, $DF$ lần lượt tại $N$ và $M$. Chứng minh rằng $OM=ON$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ qua $A$ đường thẳng $m\parallel BC$ cắt $BO$, $CO$, $DE$, $DF$ tại $P$, $Q$, $I$, $H$ để đưa $OM$, $ON$ về hai đoạn $AH$, $AI$ cùng nằm trên $m$, rồi so sánh chúng bằng định lí Thalès.

- n1 | - | $\dfrac{OM}{AH}=\dfrac{ON}{AI}$ | gt | hệ quả định lí Thalès trong $\triangle DAH$, $\triangle DAI$ với $MN\parallel m$
- n2 | - | $AH=\dfrac{BD\cdot AQ}{BC}$ | gt | hệ quả định lí Thalès trong $\triangle FBD$, $\triangle FBC$
- n3 | - | $AI=\dfrac{DC\cdot AP}{BC}$ | gt | hệ quả định lí Thalès trong $\triangle ECD$, $\triangle ECB$
- n4 | - | $\dfrac{AQ}{AP}=\dfrac{DC}{DB}$ | gt | hệ quả định lí Thalès trong $\triangle ODC$, $\triangle ODB$
- n5 | - | $AH=AI$ | n2, n3, n4 | thay (4) vào tỉ số $\dfrac{AH}{AI}$
- n6 | - | $OM=ON$ | n1, n5 | từ (1) và $AH=AI$

**Phần 2. Trình bày**
[[so-do:n1]]
Kẻ qua $A$ đường thẳng $m\parallel BC$; $m$ cắt $BO$, $CO$, $DE$, $DF$ lần lượt tại $P$, $Q$, $I$, $H$.
Vì $MN\parallel BC$ nên $MN\parallel m$.
Xét $\triangle DAH$ có $OM\parallel AH$ ($O\in DA$, $M\in DH$)
nên $\dfrac{OM}{AH}=\dfrac{DO}{DA}$ (hệ quả định lí Thalès).
Xét $\triangle DAI$ có $ON\parallel AI$ ($O\in DA$, $N\in DI$)
nên $\dfrac{ON}{AI}=\dfrac{DO}{DA}$ (hệ quả định lí Thalès).
Suy ra $\dfrac{OM}{AH}=\dfrac{ON}{AI}$. (1)
[[so-do:n2]]
Xét $\triangle FBD$ có $AH\parallel BD$ ($A$, $H$ thuộc các tia đối của tia $FB$, $FD$)
nên $\dfrac{AH}{BD}=\dfrac{FA}{FB}$ (hệ quả định lí Thalès).
Xét $\triangle FBC$ có $AQ\parallel BC$ ($A$, $Q$ thuộc các tia đối của tia $FB$, $FC$)
nên $\dfrac{AQ}{BC}=\dfrac{FA}{FB}$ (hệ quả định lí Thalès).
Suy ra $\dfrac{AH}{BD}=\dfrac{AQ}{BC}$, tức $AH=\dfrac{BD\cdot AQ}{BC}$. (2)
[[so-do:n3]]
Xét $\triangle ECD$ có $AI\parallel DC$ ($A$, $I$ thuộc các tia đối của tia $EC$, $ED$)
nên $\dfrac{AI}{DC}=\dfrac{EA}{EC}$ (hệ quả định lí Thalès).
Xét $\triangle ECB$ có $AP\parallel CB$ ($A$, $P$ thuộc các tia đối của tia $EC$, $EB$)
nên $\dfrac{AP}{BC}=\dfrac{EA}{EC}$ (hệ quả định lí Thalès).
Suy ra $\dfrac{AI}{DC}=\dfrac{AP}{BC}$, tức $AI=\dfrac{DC\cdot AP}{BC}$. (3)
[[so-do:n4]]
Xét $\triangle ODC$ có $AQ\parallel DC$ ($A$, $Q$ thuộc các tia đối của tia $OD$, $OC$)
nên $\dfrac{AQ}{DC}=\dfrac{OA}{OD}$ (hệ quả định lí Thalès).
Xét $\triangle ODB$ có $AP\parallel DB$ ($A$, $P$ thuộc các tia đối của tia $OD$, $OB$)
nên $\dfrac{AP}{DB}=\dfrac{OA}{OD}$ (hệ quả định lí Thalès).
Suy ra $\dfrac{AQ}{DC}=\dfrac{AP}{DB}$, tức $\dfrac{AQ}{AP}=\dfrac{DC}{DB}$. (4)
[[so-do:n5]]
Từ (2), (3): $\dfrac{AH}{AI}=\dfrac{BD}{DC}\cdot\dfrac{AQ}{AP}$.
Thay (4): $\dfrac{AH}{AI}=\dfrac{BD}{DC}\cdot\dfrac{DC}{DB}=1$, nên $AH=AI$.
[[so-do:n6]]
Từ (1) suy ra $OM=ON$ (đpcm).
**hinh:** TCHH-5-2.png
**hinh_lg:** TCHH-5-2_lg.png
**nghi_van:**

### TCHH-5.3 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 3@p195
**sach:** Kẻ $BB'\parallel MN$, $CC'\parallel MN$ cắt $AD$ tại $B'$, $C'$; Thalès cho $\dfrac{AB}{AM}=\dfrac{AB'}{AG}$, $\dfrac{AC}{AN}=\dfrac{AC'}{AG}$; $\triangle BB'D=\triangle CC'D$ (g.c.g) nên $B'D=DC'$. Chỉ Thalès + tam giác bằng nhau. Bản này thay "tam giác bằng nhau" bằng đối xứng tâm $D$ cho khỏi phụ thuộc vị trí $B'$, $C'$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trung tuyến $AD$. Gọi $G$ là trọng tâm của tam giác $ABC$. Một cát tuyến đi qua $G$ cắt $AB$, $AC$ lần lượt tại $M$, $N$. Chứng minh rằng $\dfrac{AB}{AM}+\dfrac{AC}{AN}=3$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ $BB'\parallel MN$, $CC'\parallel MN$ ($B'$, $C'$ thuộc đường thẳng $AD$) để đưa $\dfrac{AB}{AM}$, $\dfrac{AC}{AN}$ về các tỉ số cùng mẫu $AG$; phép đối xứng tâm $D$ cho $D$ là trung điểm $B'C'$.

- n1 | - | $\dfrac{AB}{AM}+\dfrac{AC}{AN}=\dfrac{AB'+AC'}{AG}$ | gt | hệ quả định lí Thalès trong $\triangle ABB'$, $\triangle ACC'$
- n2 | - | $D$ là trung điểm của $B'C'$ | gt | phép đối xứng tâm $D$
- n3 | - | $AB'+AC'=2AD$ | n2 | $B'$, $C'$ cùng nằm trên tia $AD$
- n4 | - | $2AD=3AG$ | gt | $G$ là trọng tâm nên $AG=\dfrac23AD$
- n5 | - | $\dfrac{AB}{AM}+\dfrac{AC}{AN}=3$ | n1, n3, n4 | thay vào kết quả của n1

**Phần 2. Trình bày**
[[so-do:n1]]
Kẻ $BB'\parallel MN$ và $CC'\parallel MN$ với $B'$, $C'$ thuộc đường thẳng $AD$.
(Nếu $MN\parallel BC$ thì $B'=C'=D$, các lập luận dưới đây vẫn đúng.)
Xét $\triangle ABB'$ có $MG\parallel BB'$ ($M\in AB$, $G\in AB'$)
nên $\dfrac{AB}{AM}=\dfrac{AB'}{AG}$ (hệ quả định lí Thalès). (1)
Xét $\triangle ACC'$ có $NG\parallel CC'$ ($N\in AC$, $G\in AC'$)
nên $\dfrac{AC}{AN}=\dfrac{AC'}{AG}$ (hệ quả định lí Thalès). (2)
Từ (1), (2) suy ra $\dfrac{AB}{AM}+\dfrac{AC}{AN}=\dfrac{AB'+AC'}{AG}$. (3)
[[so-do:n2]]
Phép đối xứng tâm $D$ biến $B$ thành $C$ (vì $D$ là trung điểm của $BC$),
biến đường thẳng $BB'$ thành đường thẳng qua $C$ song song với $BB'$, tức là $CC'$,
và biến đường thẳng $AD$ thành chính nó.
Nên nó biến $B'$ thành $C'$, tức $D$ là trung điểm của $B'C'$.
[[so-do:n3]]
Theo (1), (2) các tỉ số $\dfrac{AB'}{AG}$, $\dfrac{AC'}{AG}$ dương, nên $B'$, $C'$ cùng nằm trên tia $AD$;
do đó $AD=\dfrac{AB'+AC'}{2}$, tức $AB'+AC'=2AD$.
[[so-do:n4]]
Vì $G$ là trọng tâm nên $AG=\dfrac23AD$, suy ra $2AD=3AG$.
[[so-do:n5]]
Từ (3): $\dfrac{AB}{AM}+\dfrac{AC}{AN}=\dfrac{3AG}{AG}=3$ (đpcm).
**hinh:** TCHH-5-3.png
**hinh_lg:** TCHH-5-3_lg.png
**nghi_van:**

### TCHH-5.4 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 4@p195
**sach:** Gọi $K=EB\cap FH$, chứng minh $\triangle BHK\backsim\triangle CHF$ bằng chuỗi tỉ số rồi suy ra $CF\parallel BK$. Bản này thay đồng dạng bằng Thalès: $\dfrac{HF}{HK}=\dfrac{HN}{MB}=\dfrac{HC}{HB}$ rồi Thalès đảo trong $\triangle HBK$ (dùng thêm $AMHN$ là hình chữ nhật).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$, $AH$ là đường cao. Gọi $M$, $N$ lần lượt là hình chiếu của $H$ lên $AB$ và $AC$. Đường thẳng đi qua $A$ cắt $HM$ tại $E$ và cắt $HN$ tại $F$. Chứng minh rằng $BE\parallel CF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $K=BE\cap HF$ để đưa $BE\parallel CF$ về so sánh hai tỉ số $\dfrac{HC}{HB}$, $\dfrac{HF}{HK}$ trong $\triangle HBK$ (Thalès đảo); cả hai cùng bằng $\dfrac{HN}{MB}$.

- n1 | - | $AMHN$ là hình chữ nhật nên $MA=HN$, $HM\parallel AC$, $HN\parallel AB$ | gt | tứ giác có ba góc vuông
- n2 | - | $\dfrac{HF}{HK}=\dfrac{HN}{MB}$ | n1, gt | hệ quả định lí Thalès trong $\triangle EHF$, $\triangle EHK$
- n3 | - | $\dfrac{HN}{MB}=\dfrac{CH}{BH}$ | n1 | hệ quả định lí Thalès trong $\triangle ABC$
- n4 | - | $\dfrac{HF}{HK}=\dfrac{HC}{HB}$ | n2, n3 | bắc cầu
- n5 | - | $BE\parallel CF$ | n4 | định lí Thalès đảo trong $\triangle HBK$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $K$ là giao điểm của $BE$ và $HF$.
Tứ giác $AMHN$ có $\widehat{MAN}=\widehat{AMH}=\widehat{ANH}=90^\circ$ nên là hình chữ nhật.
Suy ra $MA=HN$, $HM\parallel AC$, $HN\parallel AB$.
[[so-do:n2]]
Xét $\triangle EHF$ có $AM\parallel HF$ ($M\in EH$, $A\in EF$)
nên $\dfrac{EM}{EH}=\dfrac{MA}{HF}=\dfrac{HN}{HF}$ (hệ quả định lí Thalès và $MA=HN$). (1)
Xét $\triangle EHK$ có $MB\parallel HK$ ($M\in EH$, $B\in EK$; vì $MB\parallel HN$)
nên $\dfrac{EM}{EH}=\dfrac{MB}{HK}$ (hệ quả định lí Thalès). (2)
Từ (1), (2): $\dfrac{HN}{HF}=\dfrac{MB}{HK}$, suy ra $\dfrac{HF}{HK}=\dfrac{HN}{MB}$. (3)
[[so-do:n3]]
Xét $\triangle ABC$ có $HN\parallel AB$ ($N\in AC$, $H\in BC$)
nên $\dfrac{HN}{AB}=\dfrac{CH}{CB}$ (hệ quả định lí Thalès).
Xét $\triangle ABC$ có $HM\parallel AC$ ($M\in AB$, $H\in BC$)
nên $\dfrac{MB}{AB}=\dfrac{BH}{BC}$ (định lí Thalès).
Chia hai đẳng thức: $\dfrac{HN}{MB}=\dfrac{CH}{BH}$. (4)
[[so-do:n4]]
Từ (3), (4): $\dfrac{HF}{HK}=\dfrac{HC}{HB}$.
[[so-do:n5]]
Xét $\triangle HBK$ có $C$, $F$ thuộc các tia đối của tia $HB$, $HK$ và $\dfrac{HC}{HB}=\dfrac{HF}{HK}$
nên $CF\parallel BK$ (định lí Thalès đảo).
Mà $BK$ chính là đường thẳng $BE$, vậy $BE\parallel CF$ (đpcm).
**hinh:** TCHH-5-4.png
**hinh_lg:** TCHH-5-4_lg.png
**nghi_van:** Đề sách không nói đường thẳng qua $A$ có điều kiện gì; kiểm số: $BE\parallel CF$ đúng với MỌI đường thẳng qua $A$. Lời giải trình bày cho vị trí như hình sách (đường thẳng qua $A$ không cắt trong góc $BAC$: $M$ nằm giữa $E$, $H$; $B$ nằm giữa $E$, $K$; $K$, $F$ khác phía $H$); các vị trí khác cần đổi cách chọn tia đối. Bước cuối dùng định lí Thalès đảo với hai tia đối (dạng "đường thẳng cắt phần kéo dài hai cạnh") — cần soát xem lô Thalès đã dạy dạng này chưa.

### TCHH-5.5 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 5@p196
**sach:** Chỉ ra bốn tam giác vuông $BFD$, $DFA$, $CED$, $ABC$ đồng dạng rồi nhân dãy tỉ số. Bản này không dùng đồng dạng: Thalès ($DE\parallel AB$, $DF\parallel AC$) cho $\dfrac{CE}{BF}=\dfrac{AC}{AB}\cdot\dfrac{CD}{BD}$, và $\dfrac{CD}{BD}=\dfrac{AC^2}{AB^2}$ suy ra từ Pythagore (đại số), không cần hệ thức lượng.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $\widehat{A}=90^\circ$. Kẻ $AD\perp BC$, $DE\perp AC$, $DF\perp AB$ ($D\in BC$, $E\in AC$, $F\in AB$). Chứng minh rằng $\dfrac{AC^3}{AB^3}=\dfrac{CE}{BF}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $DE$, $DF$ cùng vuông góc với một cạnh góc vuông nên song song với cạnh góc vuông kia: dùng Thalès cho $\dfrac{CE}{BF}$, rồi đổi $\dfrac{CD}{BD}$ sang $\dfrac{AC^2}{AB^2}$ bằng Pythagore.

- n1 | - | $DE\parallel AB$ và $DF\parallel AC$ | gt | cùng vuông góc với một cạnh góc vuông
- n2 | - | $\dfrac{CE}{BF}=\dfrac{CA}{BA}\cdot\dfrac{CD}{BD}$ | n1 | định lí Thalès trong $\triangle ABC$
- n3 | - | $\dfrac{AC^2}{AB^2}=\dfrac{CD}{BD}$ | gt | định lí Pythagore, đặt $BD=x$, $CD=y$, $AD=h$
- n4 | - | $\dfrac{CE}{BF}=\dfrac{AC^3}{AB^3}$ | n2, n3 | thay (2) vào (1)

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $DE\perp AC$ và $AB\perp AC$ nên $DE\parallel AB$; vì $DF\perp AB$ và $AC\perp AB$ nên $DF\parallel AC$.
[[so-do:n2]]
Xét $\triangle ABC$ có $DE\parallel AB$ ($E\in AC$, $D\in BC$)
nên $\dfrac{CE}{CA}=\dfrac{CD}{CB}$ (định lí Thalès).
Xét $\triangle ABC$ có $DF\parallel AC$ ($F\in AB$, $D\in BC$)
nên $\dfrac{BF}{BA}=\dfrac{BD}{BC}$ (định lí Thalès).
Chia hai đẳng thức: $\dfrac{CE}{BF}=\dfrac{CA}{BA}\cdot\dfrac{CD}{BD}$. (1)
[[so-do:n3]]
Đặt $BD=x$, $CD=y$, $AD=h$ ($D$ nằm giữa $B$, $C$ vì $\widehat{A}=90^\circ$), nên $BC=x+y$.
Theo định lí Pythagore: $AB^2=h^2+x^2$, $AC^2=h^2+y^2$, $BC^2=AB^2+AC^2$.
Do đó $(x+y)^2=2h^2+x^2+y^2$, suy ra $h^2=xy$.
Từ đó $AC^2=xy+y^2=y(x+y)=CD\cdot BC$ và $AB^2=xy+x^2=x(x+y)=BD\cdot BC$.
Suy ra $\dfrac{AC^2}{AB^2}=\dfrac{CD}{BD}$. (2)
[[so-do:n4]]
Thay (2) vào (1): $\dfrac{CE}{BF}=\dfrac{AC}{AB}\cdot\dfrac{AC^2}{AB^2}=\dfrac{AC^3}{AB^3}$ (đpcm).
**hinh:** TCHH-5-5.png
**nghi_van:**

### TCHH-5.6 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 6@p196
**sach:** Góc so le trong $\widehat{A_2}=\widehat{ADE}$ và $\widehat{A_1}=\widehat{A_2}$ nên $\triangle EAD$ cân, $AE=ED$; rồi Thalès/hệ quả cho $\dfrac{AE}{AB}=\dfrac{DC}{BC}$, $\dfrac{AE}{AC}=\dfrac{BD}{BC}$, cộng lại. Chỉ cần ĐỊNH NGHĨA tia phân giác (hai góc bằng nhau), KHÔNG cần tính chất đường phân giác ⇒ để ở HH00127 theo luật "kiến thức muộn nhất lời giải cần"; nếu CEO muốn gom theo chủ đề "phân giác + song song ⇒ tam giác cân" thì chuyển sang HH00128.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ và đường phân giác trong $AD$ ($D\in BC$). Qua $D$ kẻ đường thẳng song song với $AC$ cắt cạnh $AB$ tại $E$. Chứng minh rằng $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Phân giác cho hai góc bằng nhau, song song cho góc so le trong bằng nhau, ghép lại được tam giác cân $EAD$; rồi dùng Thalès cho $DE\parallel AC$ và cộng hai tỉ số có tổng bằng 1.

- n1 | - | $AE=ED$ | gt | $\triangle EAD$ cân tại $E$ (phân giác, so le trong)
- n2 | - | $\dfrac{AE}{AB}=\dfrac{DC}{BC}$ | gt | hệ quả định lí Thalès cho $DE\parallel AC$
- n3 | - | $\dfrac{AE}{AC}=\dfrac{BD}{BC}$ | n1, gt | $AE=ED$ và hệ quả định lí Thalès
- n4 | - | $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$ | n2, n3 | cộng vế rồi chia cho $AE$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $DE\parallel AC$ nên $\widehat{EDA}=\widehat{DAC}$ (so le trong).
Vì $AD$ là phân giác của góc $A$ nên $\widehat{EAD}=\widehat{DAC}$.
Suy ra $\widehat{EAD}=\widehat{EDA}$, nên $\triangle EAD$ cân tại $E$, tức $AE=ED$. (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $DE\parallel AC$ ($E\in AB$, $D\in BC$)
nên $\dfrac{BE}{BA}=\dfrac{BD}{BC}=\dfrac{ED}{AC}$ (hệ quả định lí Thalès). (2)
Từ $\dfrac{BE}{BA}=\dfrac{BD}{BC}$ suy ra $\dfrac{AE}{AB}=\dfrac{AB-BE}{AB}=1-\dfrac{BD}{BC}=\dfrac{DC}{BC}$. (3)
[[so-do:n3]]
Từ (2) và (1): $\dfrac{AE}{AC}=\dfrac{ED}{AC}=\dfrac{BD}{BC}$. (4)
[[so-do:n4]]
Cộng (3) và (4): $\dfrac{AE}{AB}+\dfrac{AE}{AC}=\dfrac{DC+BD}{BC}=1$.
Chia hai vế cho $AE$: $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$ (đpcm).
**hinh:** TCHH-5-6.png
**nghi_van:** Ghi chú phân loại: bài này lời giải gọn nhất không cần tính chất phân giác (xem dòng sach); nếu quy tắc "theo chủ đề" thắng thì chuyển HH00128.
