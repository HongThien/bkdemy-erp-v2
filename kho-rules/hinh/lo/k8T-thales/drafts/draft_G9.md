### TCHH-5.13 → HH00161
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 13@p200
**sach:** Sách kẻ thêm $N=CF\cap AB$ (tam giác $ACN$ cân) rồi dùng đường trung bình của $\triangle CBN$ cho ý a; ý b dựa vào "Bài toán 12" (điểm trên trung tuyến, không chứng minh lại); ý c suy từ ý b. Bản này lấy $N$ trên tia $AB$ sao cho $AN=AC$ và chứng minh lại tại chỗ phần "Bài toán 12" bằng hệ quả Thalès; không dùng đồng dạng.
**loai:** nhieu_y
**loi_dan:**
Cho $\triangle ABC$ có $AB>AC$. Gọi $D$ là trung điểm của $BC$, tia phân giác của góc $A$ cắt cạnh $BC$ tại $E$. Từ $C$ kẻ đường thẳng vuông góc với $AE$, cắt $AE$ và $AD$ lần lượt tại $F$ và $G$.
**hinh:** TCHH-5-13.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $DF\parallel AB$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ đường phụ: lấy $N$ trên tia $AB$ sao cho $AN=AC$ (dấu hiệu: $AE$ vừa là phân giác vừa vuông góc $CF$ nên nghĩ tới tam giác cân đỉnh $A$). Khi đó $F$ là trung điểm $CN$ và $DF$ là đường trung bình của $\triangle CBN$.

- n1 | - | $F$ là trung điểm của $CN$ ($N\in AB$, $AN=AC$) | gt | phân giác góc ở đỉnh của tam giác cân $ACN$ là đường trung trực của đáy
- n2 | - | $DF\parallel AB$ | n1, gt | $DF$ là đường trung bình của $\triangle CBN$

**Phần 2. Trình bày**

[[so-do:n1]]
Trên tia $AB$ lấy điểm $N$ sao cho $AN=AC$.
Vì $AC<AB$ nên $N$ nằm giữa $A$ và $B$.
Xét $\triangle ACN$ có $AN=AC$
nên $\triangle ACN$ cân tại $A$ (định nghĩa tam giác cân).
Có $AE$ là phân giác của $\widehat{CAN}$ (gt)
nên $AE$ là đường trung trực của $CN$ (tính chất tam giác cân).
Do đó $AE\perp CN$ tại trung điểm của $CN$.
Qua $C$ chỉ có một đường thẳng vuông góc với $AE$, mà $CF\perp AE$ (gt)
nên $C$, $F$, $N$ thẳng hàng và $F$ là trung điểm của $CN$.
[[so-do:n2]]
Xét $\triangle CBN$ có:
$D$ là trung điểm của $CB$ (gt);
$F$ là trung điểm của $CN$ (cmt)
nên $DF$ là đường trung bình của $\triangle CBN$ (định nghĩa đường trung bình).
Suy ra $DF\parallel BN$ (tính chất đường trung bình).
Mà $N\in AB$ nên $DF\parallel AB$.
**hinh_lg:** TCHH-5-13_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $GE\parallel AC$.
**da_biet:** Biết $DF\parallel AB$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $M=DF\cap AC$ (trung điểm $AC$) và kẻ qua $F$ đường thẳng song song $AC$ cắt $DA$, $DC$ tại $P$, $Q$: vì $F$ nằm trên trung tuyến $DM$ của $\triangle DAC$ nên $PF=FQ$; so hai tỉ số $\dfrac{GF}{GC}$ và $\dfrac{EF}{EA}$ qua cùng một tỉ số thứ ba rồi dùng Thalès đảo.

- n1 | - | $M$ là trung điểm của $AC$ | gt | đường thẳng qua trung điểm $D$ của $BC$ và song song $AB$ (ý a)
- n2 | - | $F$ nằm trong $\triangle ADC$ (giữa $A$, $E$ và giữa $C$, $G$) | n1, gt | tia $CN$ nằm giữa hai tia $CA$, $CB$ cắt đoạn $DM$
- n3 | - | $PF=FQ$ | n1, n2 | hệ quả Thalès cho $\triangle DAM$, $\triangle DMC$ và $AM=MC$
- n4 | - | $\dfrac{GF}{GC}=\dfrac{EF}{EA}$ | n2, n3 | hệ quả Thalès cho $\triangle GAC$, $\triangle EAC$
- n5 | - | $GE\parallel AC$ | n4 | định lí Thalès đảo cho hai đường thẳng $CG$, $AE$ cắt nhau tại $F$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $M$ là giao điểm của $DF$ và $AC$.
Vì $D$ là trung điểm của $BC$ (gt) và $DM\parallel AB$ (ý a)
nên $M$ là trung điểm của $AC$ (đường thẳng qua trung điểm một cạnh, song song với cạnh thứ hai).
[[so-do:n2]]
Vì $N$ nằm giữa $A$ và $B$ nên tia $CN$ nằm giữa hai tia $CA$, $CB$
nên $CN$ cắt đoạn $DM$ tại một điểm nằm giữa $D$ và $M$; điểm đó chính là $F$.
Vậy $F$ nằm giữa $D$ và $M$, tức $F$ nằm trong $\triangle ADC$.
Do đó $F$ nằm giữa $A$ và $E$, nằm giữa $C$ và $G$.
[[so-do:n3]]
Qua $F$ kẻ đường thẳng song song với $AC$, cắt $DA$ tại $P$, cắt $DC$ tại $Q$.
Xét $\triangle DAM$ có $PF\parallel AM$
nên $\dfrac{PF}{AM}=\dfrac{DF}{DM}$ (hệ quả của định lí Thalès).
Xét $\triangle DMC$ có $FQ\parallel MC$
nên $\dfrac{FQ}{MC}=\dfrac{DF}{DM}$ (hệ quả của định lí Thalès).
Mà $AM=MC$ (cmt) nên $PF=FQ$. (1)
[[so-do:n4]]
Xét $\triangle GAC$ có $PF\parallel AC$ ($P\in GA$, $F\in GC$)
nên $\dfrac{GF}{GC}=\dfrac{PF}{AC}$ (hệ quả của định lí Thalès). (2)
Xét $\triangle EAC$ có $FQ\parallel AC$ ($F\in EA$, $Q\in EC$)
nên $\dfrac{EF}{EA}=\dfrac{FQ}{AC}$ (hệ quả của định lí Thalès). (3)
Từ (1), (2), (3) suy ra $\dfrac{GF}{GC}=\dfrac{EF}{EA}$.
[[so-do:n5]]
Vì $GC=GF+FC$ và $EA=EF+FA$ nên
$\dfrac{GF}{GF+FC}=\dfrac{EF}{EF+FA}$
suy ra $GF\cdot FA=EF\cdot FC$, tức $\dfrac{FG}{FC}=\dfrac{FE}{FA}$.
Qua $G$ kẻ đường thẳng song song với $AC$, cắt đường thẳng $AE$ tại $E'$.
Theo hệ quả của định lí Thalès: $\dfrac{FE'}{FA}=\dfrac{FG}{FC}=\dfrac{FE}{FA}$ nên $FE'=FE$.
Mà $E$, $E'$ cùng nằm trên tia đối của tia $FA$ nên $E'\equiv E$.
Vậy $GE\parallel AC$.
**hinh_lg:** TCHH-5-13_b_lg.png
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Từ đó suy ra $DF$ đi qua trung điểm của $GE$.
**da_biet:** Biết $DF\parallel AB$ (ý a) và $GE\parallel AC$ (ý b).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Trong $\triangle DAC$ có trung tuyến $DM$ ($M$ trung điểm $AC$) và $GE\parallel AC$: so hai tỉ số $\dfrac{GK}{AM}$ và $\dfrac{KE}{MC}$ cùng bằng $\dfrac{DK}{DM}$.

- n1 | - | $M$ là trung điểm của $AC$ | gt | đường thẳng qua trung điểm $D$ của $BC$ và song song $AB$ (ý a)
- n2 | - | $\dfrac{GK}{AM}=\dfrac{KE}{MC}$ | n1, gt | hệ quả Thalès cho $\triangle DAM$, $\triangle DMC$ ($GE\parallel AC$)
- n3 | - | $GK=KE$ ($DF$ đi qua trung điểm của $GE$) | n1, n2 | $AM=MC$ nên hai tỉ số bằng nhau cho $GK=KE$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $M$ là giao điểm của $DF$ và $AC$, $K$ là giao điểm của $DF$ và $GE$.
Vì $D$ là trung điểm của $BC$ (gt) và $DM\parallel AB$ (ý a)
nên $M$ là trung điểm của $AC$ (đường thẳng qua trung điểm một cạnh, song song với cạnh thứ hai).
Suy ra $AM=MC$. (1)
[[so-do:n2]]
Vì $GE\parallel AC$ (ý b) nên $GK\parallel AM$ và $KE\parallel MC$.
Xét $\triangle DAM$ có $GK\parallel AM$ ($G\in DA$, $K\in DM$)
nên $\dfrac{GK}{AM}=\dfrac{DK}{DM}$ (hệ quả của định lí Thalès).
Xét $\triangle DMC$ có $KE\parallel MC$ ($E\in DC$, $K\in DM$)
nên $\dfrac{KE}{MC}=\dfrac{DK}{DM}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{GK}{AM}=\dfrac{KE}{MC}$. (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $GK=KE$.
Vậy $K$ là trung điểm của $GE$, tức $DF$ đi qua trung điểm của $GE$.
**hinh_lg:** TCHH-5-13_c_lg.png
**nghi_van:** (1) Sách viện dẫn "Bài toán 12" cho ý b; bản này chứng minh lại tại chỗ (không viện dẫn sách). (2) Sách giải "DF qua trung điểm EG" bằng tính chất hình thang; bản này dùng thẳng hệ quả Thalès nên bài ở lại HH00161 (đường trung bình ở ý a, c). (3) Đề sách là một câu có hai kết luận + "Từ đó suy ra": tách thành ba ý a, b, c (ý b dùng kết quả ý a, ý c dùng a và b). Đã verify số trên 4 bộ toạ độ.

### TCHH-5.14 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 14@p201
**sach:** Chỉ dùng hệ quả định lí Thalès: gọi $K=AC\cap FI$, $M=AB\cap EH$, viết ba đẳng thức tỉ số (1), (2), (3) rồi ghép lại. Không có đường phụ nào ngoài $K$, $M$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$. Một đường thẳng cắt các cạnh $BC$, $AC$ lần lượt tại $D$, $E$ và cắt tia đối của tia $AB$ tại $F$. Vẽ hình bình hành $BDEH$. Đường thẳng đi qua $F$ và song song với $BC$ cắt đường thẳng $HA$ tại $I$. Chứng minh rằng $FI=DC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $K=AC\cap FI$, $M=AB\cap EH$: $FI$, $EH$, $BC$ song song nhau nên mọi tỉ số đoạn thẳng đưa về hệ quả Thalès; cùng chia cho $FK$ rồi ghép ba tỉ số.

- n1 | - | $\dfrac{FI}{FK}=\dfrac{MH}{ME}$ (1) | gt | hệ quả Thalès cho $\triangle AMH$, $\triangle AME$ (cùng bằng $\dfrac{AF}{AM}$)
- n2 | - | $\dfrac{DC}{FK}=\dfrac{DE}{FE}$ (2) | n1, gt | hệ quả Thalès cho $\triangle EDC$ ($FK\parallel DC$)
- n3 | - | $\dfrac{MH}{ME}=\dfrac{DE}{FE}$ (3) | n1, gt | hệ quả Thalès cho $\triangle FBD$ ($ME\parallel BD$) rồi trừ 1 hai vế, $BD=EH$
- n4 | - | $FI=DC$ | n1, n2, n3 | từ (1), (2), (3)

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $K$ là giao điểm của $AC$ và $FI$, $M$ là giao điểm của $AB$ và $EH$.
Vì $BDEH$ là hình bình hành (gt) nên $EH\parallel BD$ và $EH=BD$ (tính chất hình bình hành).
Mà $FI\parallel BC$ (gt) nên $FI\parallel EH$ và $FK\parallel BC$.
$F$ và $D$ nằm về hai phía của đường thẳng $AC$ ($F$ thuộc tia đối của tia $AB$)
nên $E$ nằm giữa $F$ và $D$.
Do $EH\parallel BD$ nên $EH$ cắt đoạn $FB$ tại $M$, và $M$, $H$ cùng nằm trên tia $E H$ (cùng phía $B$ so với $DE$).
Xét $\triangle AMH$ có $FI\parallel MH$ ($F\in AM$, $I\in AH$)
nên $\dfrac{FI}{MH}=\dfrac{AF}{AM}$ (hệ quả của định lí Thalès).
Xét $\triangle AME$ có $FK\parallel ME$ ($F\in AM$, $K\in AE$)
nên $\dfrac{FK}{ME}=\dfrac{AF}{AM}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{FI}{FK}=\dfrac{MH}{ME}$. (1)
[[so-do:n2]]
Xét $\triangle EDC$ có $FK\parallel DC$ ($F\in ED$, $K\in EC$)
nên $\dfrac{DC}{FK}=\dfrac{ED}{EF}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Xét $\triangle FBD$ có $ME\parallel BD$ ($M\in FB$, $E\in FD$)
nên $\dfrac{BD}{ME}=\dfrac{FD}{FE}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{BD-ME}{ME}=\dfrac{FD-FE}{FE}$.
Vì $E$ nằm giữa $F$, $D$ nên $FD-FE=ED$.
Vì $M$ nằm giữa $E$, $H$ và $EH=BD$ nên $BD-ME=EH-EM=MH$.
Do đó $\dfrac{MH}{ME}=\dfrac{ED}{FE}$. (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{FI}{FK}=\dfrac{DC}{FK}$.
Vậy $FI=DC$.
**hinh:** TCHH-5-14.png
**hinh_lg:** TCHH-5-14_lg.png
**nghi_van:** Đề sách ghi "cắt đường thẳng $BA$ ở $F$" (không nói $F$ ở phía nào); hình sách và lời giải chỉ đúng cho $F$ thuộc tia đối của tia $AB$ (thứ tự $F,E,D$) nên đề ở đây ghi rõ như vậy. Verify số: $FI=DC$ cũng đúng khi $F$ ở phía $B$ nhưng lời giải trên (thứ tự điểm, dấu trừ) chưa phủ trường hợp đó; hình vẽ + lời giải theo trường hợp sách.

### TCHH-5.15 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 15@p201-202
**noi_dung:** Cho ngũ giác $ABCDE$ thỏa mãn $\widehat{BAC}=\widehat{CAD}=\widehat{DAE}$ và $\widehat{ABC}=\widehat{ACD}=\widehat{ADE}$. Đường thẳng $BD$ cắt $CE$ tại $M$. Chứng minh rằng $AM$ đi qua trung điểm của $CD$.
**ly_do:** Giả thiết chỉ cho các GÓC bằng nhau, nên phải dùng tam giác đồng dạng g.g ($\triangle ABC$, $\triangle ACD$, $\triangle ADE$), rồi $\triangle ABD$ đồng dạng $\triangle ACE$ (c.g.c) để có tỉ lệ đoạn thẳng; sau đó mới dùng tính chất phân giác và Thalès đảo ($PQ\parallel CD$) và bổ đề hình thang. Không có cách ngắn nào chỉ bằng Thalès (không thể đổi góc bằng nhau thành tỉ lệ đoạn thẳng khi chưa có đồng dạng).
**hinh:** TCHH-5-15.png
**nghi_van:** Đã dựng hình theo xoắn ốc đồng dạng và verify số: $AM$ đi qua trung điểm $CD$ đúng (kết luận của đề).

### TCHH-5.16 → HH00162
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 16@p202-203
**sach:** Hệ quả Thalès cho tỉ số $\dfrac13$ ở ý a; ý b: $ONMP$ là hình bình hành nên $MO$ qua trung điểm $NP$, rồi dùng tính chất hình thang ($NPGH$) để suy ra trung điểm $HG$ (đó là bổ đề hình thang, nên bài vào HH00162). Sách gọi giao điểm khác; bản này đặt $I=HG\cap BD$, $K=HG\cap CE$, $N=HM\cap BD$, $P=GM\cap CE$.
**loai:** nhieu_y
**loi_dan:**
Cho $\triangle ABC$ có hai đường trung tuyến $BD$, $CE$ ($D$ thuộc $AC$, $E$ thuộc $AB$). Gọi $M$ là điểm bất kì thuộc cạnh $BC$ ($M$ khác $B$, $C$). Qua $M$ kẻ đường thẳng song song với $BD$ cắt $AC$ tại $G$, kẻ đường thẳng song song với $CE$ cắt $AB$ tại $H$.
**hinh:** TCHH-5-16.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $BD$ và $CE$ chia đoạn thẳng $HG$ thành ba phần bằng nhau.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $O$ là trọng tâm, $N=HM\cap BD$, $P=GM\cap CE$, $I=HG\cap BD$, $K=HG\cap CE$: $BD\parallel MG$ và $CE\parallel MH$ nên $\triangle HMG$ bị cắt bởi các đường song song với hai cạnh của nó; mỗi phần là $\dfrac13HG$.

- n1 | - | $\dfrac{HN}{HM}=\dfrac13$ | gt | hệ quả Thalès cho $\triangle BEC$, $\triangle BEO$ và $EO=\dfrac13EC$
- n2 | - | $HI=\dfrac13HG$ | n1, gt | hệ quả Thalès cho $\triangle HMG$, $NI\parallel MG$
- n3 | - | $\dfrac{GP}{GM}=\dfrac13$ | gt | hệ quả Thalès cho $\triangle CDB$, $\triangle CDO$ và $DO=\dfrac13DB$
- n4 | - | $GK=\dfrac13HG$ | n3, gt | hệ quả Thalès cho $\triangle HMG$, $KP\parallel HM$
- n5 | - | $HI=IK=KG$ | n2, n4 | $HI=GK=\dfrac13HG$ nên $IK=\dfrac13HG$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $O$ là giao điểm của $BD$ và $CE$ thì $O$ là trọng tâm của $\triangle ABC$ (gt: $BD$, $CE$ là trung tuyến).
Suy ra $OE=\dfrac13CE$ và $OD=\dfrac13BD$ (tính chất đường trung tuyến).
Gọi $N=HM\cap BD$, $P=GM\cap CE$, $I=HG\cap BD$, $K=HG\cap CE$.
Xét $\triangle BEC$ có $HM\parallel EC$ ($H\in BE$, $M\in BC$)
nên $\dfrac{HM}{EC}=\dfrac{BH}{BE}$ (hệ quả của định lí Thalès).
Xét $\triangle BEO$ có $HN\parallel EO$ ($H\in BE$, $N\in BO$)
nên $\dfrac{HN}{EO}=\dfrac{BH}{BE}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{HN}{HM}=\dfrac{EO}{EC}=\dfrac13$. (1)
[[so-do:n2]]
Xét $\triangle HMG$ có $NI\parallel MG$ ($N\in HM$, $I\in HG$; vì $BD\parallel MG$)
nên $\dfrac{HI}{HG}=\dfrac{HN}{HM}=\dfrac13$ (hệ quả của định lí Thalès).
Do đó $HI=\dfrac13HG$.
[[so-do:n3]]
Xét $\triangle CDB$ có $GM\parallel DB$ ($G\in CD$, $M\in CB$)
nên $\dfrac{GM}{DB}=\dfrac{CG}{CD}$ (hệ quả của định lí Thalès).
Xét $\triangle CDO$ có $GP\parallel DO$ ($G\in CD$, $P\in CO$)
nên $\dfrac{GP}{DO}=\dfrac{CG}{CD}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{GP}{GM}=\dfrac{DO}{DB}=\dfrac13$. (2)
[[so-do:n4]]
Xét $\triangle HMG$ có $KP\parallel HM$ ($P\in GM$, $K\in GH$; vì $CE\parallel HM$)
nên $\dfrac{GK}{GH}=\dfrac{GP}{GM}=\dfrac13$ (hệ quả của định lí Thalès).
Do đó $GK=\dfrac13HG$.
[[so-do:n5]]
Vì $H$, $G$ nằm về hai phía của $BD$ và của $CE$ nên $I$, $K$ thuộc đoạn $HG$.
Mà $HI=GK=\dfrac13HG$ nên $IK=HG-HI-GK=\dfrac13HG$.
Vậy $HI=IK=KG$, tức $BD$ và $CE$ chia $HG$ thành ba phần bằng nhau.
**hinh_lg:** TCHH-5-16_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Gọi $O$ là trọng tâm của $\triangle ABC$. Chứng minh rằng $OM$ đi qua trung điểm của $HG$.
**da_biet:** Biết (ý a): với $N=HM\cap BD$, $P=GM\cap CE$ thì $\dfrac{HN}{HM}=\dfrac{GP}{GM}=\dfrac13$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Dùng bổ đề hình thang cho hình thang $NPGH$ (hai cạnh bên cắt nhau tại $M$): đường thẳng nối $M$ với trung điểm $L$ của $NP$ đi qua trung điểm $HG$; và $L$ nằm trên $OM$ vì $ONMP$ là hình bình hành.

- n1 | - | $NP\parallel HG$ ($NPGH$ là hình thang) | gt | Thalès đảo cho $\triangle MHG$ vì $\dfrac{MN}{MH}=\dfrac{MP}{MG}=\dfrac23$ (từ ý a)
- n2 | - | $L$ là trung điểm của $NP$ nằm trên $OM$ ($ONMP$ là hình bình hành) | gt | hai đường chéo của hình bình hành cắt nhau tại trung điểm mỗi đường
- n3 | - | $OM$ đi qua trung điểm $J$ của $HG$ | n1, n2 | bổ đề hình thang cho $NPGH$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $N=HM\cap BD$, $P=GM\cap CE$; theo ý a: $\dfrac{HN}{HM}=\dfrac{GP}{GM}=\dfrac13$.
Vì $N$ nằm giữa $H$, $M$ và $P$ nằm giữa $G$, $M$ nên $\dfrac{MN}{MH}=\dfrac{MP}{MG}=\dfrac23$.
Xét $\triangle MHG$ có $\dfrac{MN}{MH}=\dfrac{MP}{MG}$ ($N\in MH$, $P\in MG$)
nên $NP\parallel HG$ (định lí Thalès đảo).
Tứ giác $NPGH$ có $NP\parallel HG$ nên là hình thang (đáy $NP$, $HG$).
Hai cạnh bên $HN$ và $GP$ cắt nhau tại $M$.
[[so-do:n2]]
Tứ giác $ONMP$ có:
$ON\parallel MP$ (vì $BD\parallel MG$);
$OP\parallel MN$ (vì $CE\parallel MH$)
nên $ONMP$ là hình bình hành (dấu hiệu nhận biết).
Gọi $L$ là giao điểm của $OM$ và $NP$.
Suy ra $L$ là trung điểm của $NP$ (tính chất hai đường chéo của hình bình hành).
[[so-do:n3]]
Gọi $J$ là trung điểm của $HG$.
Theo bổ đề hình thang cho hình thang $NPGH$: $M$, $L$, $J$ thẳng hàng.
Mà $L$ thuộc $OM$ và $L\neq M$ nên đường thẳng $ML$ chính là đường thẳng $OM$.
Suy ra $J\in OM$.
Vậy $OM$ đi qua trung điểm của $HG$.
**hinh_lg:** TCHH-5-16_b_lg.png
**nghi_van:** Bài vào HH00162 vì ý b dùng bổ đề hình thang (gọi đúng tên). Nếu Thùy muốn giữ ở chuyên đề Thalès thuần thì ý b có thể chứng minh bổ đề tại chỗ bằng hệ quả Thalès (thêm ~6 dòng). Đã verify số trên 3 bộ toạ độ (M ở 0,15 / 0,40 / 0,75 trên BC).

### TCHH-5.17 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 17@p203
**sach:** Sách kẻ $ME\parallel AC$, $QF\parallel BD$ cắt $CD$, dùng Thalès chứng minh $N$, $P$ là trung điểm $OJ$, $OK$, rồi lập luận phản chứng "$E\equiv F$". Bản này chỉ dùng hệ quả Thalès + dấu hiệu trung điểm, đưa về hai đẳng thức $x=k(1-2y)$, $y=k(1-2x)$ (không phản chứng).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$, $AB<CD$). Một đường thẳng $d$ không song song với $AB$ cắt các đoạn thẳng $AD$, $DB$, $CA$, $CB$ lần lượt tại $M$, $N$, $P$, $Q$ (bốn điểm nằm trên $d$ theo thứ tự $M$, $N$, $P$, $Q$) sao cho $MN=NP=PQ$. Chứng minh rằng $CD=2AB$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ $MJ\parallel AC$, $QK\parallel BD$: vì $N$, $P$ là trung điểm của $MP$, $NQ$ nên $N$, $P$ là trung điểm $OJ$, $OK$; từ đó $M\in AD$ và $Q\in BC$ cho hai hệ thức $x=k(1-2y)$, $y=k(1-2x)$ giữa các tỉ số $x=\dfrac{OP}{OC}$, $y=\dfrac{ON}{OD}$, $k=\dfrac{OA}{OC}$; trừ vế được $k=\dfrac12$ vì $x\neq y$.

- n1 | - | $N$ là trung điểm của $OJ$ và $MJ=OP$ | gt | hệ quả Thalès, $N$ là trung điểm $MP$, $MJ\parallel PO$
- n2 | - | $P$ là trung điểm của $OK$ và $QK=ON$ | gt | hệ quả Thalès, $P$ là trung điểm $NQ$, $QK\parallel NO$
- n3 | - | $x=k(1-2y)$ (1) | n1 | hệ quả Thalès cho $\triangle DAO$, $MJ\parallel AO$
- n4 | - | $y=k(1-2x)$ (2) | n2 | hệ quả Thalès cho $\triangle CBO$, $QK\parallel BO$
- n5 | - | $x\neq y$ | n3, n4, gt | nếu $x=y$ thì $NP\parallel CD$ nên $d\parallel AB$, trái giả thiết
- n6 | - | $CD=2AB$ | n3, n4, n5 | $(x-y)(1-2k)=0$ và $x\neq y$ nên $k=\dfrac12$, $k=\dfrac{AB}{CD}$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $O$ là giao điểm của $AC$ và $BD$.
Vì $AB\parallel CD$ nên $\dfrac{OA}{OC}=\dfrac{OB}{OD}=\dfrac{AB}{CD}=k$ (hệ quả của định lí Thalès).
Đoạn $MQ$ đi từ cạnh $AD$ sang cạnh $BC$ và lần lượt cắt $BD$ tại $N$, rồi $AC$ tại $P$
nên $N$ thuộc đoạn $OD$ và $P$ thuộc đoạn $OC$.
Đặt $x=\dfrac{OP}{OC}$, $y=\dfrac{ON}{OD}$.
Qua $M$ kẻ $MJ\parallel AC$ ($J\in BD$); qua $Q$ kẻ $QK\parallel BD$ ($K\in AC$).
Vì $MN=NP$ (gt) và $N$ nằm giữa $M$, $P$ nên $N$ là trung điểm của $MP$.
Hai đường thẳng $MP$ và $JO$ cắt nhau tại $N$ và $MJ\parallel PO$
nên $\dfrac{NJ}{NO}=\dfrac{NM}{NP}=\dfrac{MJ}{PO}$ (hệ quả của định lí Thalès).
Do đó $NJ=NO$ và $MJ=OP$.
Suy ra $N$ là trung điểm của $OJ$, nên $J$ thuộc tia $OD$ và $OJ=2ON$.
[[so-do:n2]]
Vì $NP=PQ$ (gt) nên $P$ là trung điểm của $NQ$.
Hai đường thẳng $NQ$ và $OK$ cắt nhau tại $P$ và $QK\parallel NO$
nên $\dfrac{PK}{PO}=\dfrac{PQ}{PN}=\dfrac{QK}{NO}$ (hệ quả của định lí Thalès).
Do đó $PK=PO$ và $QK=ON$.
Suy ra $P$ là trung điểm của $OK$, nên $K$ thuộc tia $OC$ và $OK=2OP$.
[[so-do:n3]]
Vì $M$ nằm trong đoạn $AD$ và $MJ\parallel AO$ nên $J$ nằm trong đoạn $DO$.
Xét $\triangle DAO$ có $MJ\parallel AO$ ($M\in DA$, $J\in DO$)
nên $\dfrac{MJ}{AO}=\dfrac{DJ}{DO}$ (hệ quả của định lí Thalès).
Mà $MJ=OP$ và $DJ=DO-OJ=DO-2ON$ nên $\dfrac{OP}{OA}=1-2y$.
Vì $OP=x\cdot OC$ và $OA=k\cdot OC$ nên $\dfrac xk=1-2y$, tức $x=k(1-2y)$. (1)
[[so-do:n4]]
Tương tự, $K$ nằm trong đoạn $CO$; xét $\triangle CBO$ có $QK\parallel BO$
nên $\dfrac{QK}{BO}=\dfrac{CK}{CO}$ (hệ quả của định lí Thalès).
Mà $QK=ON$ và $CK=CO-2OP$ nên $\dfrac{ON}{OB}=1-2x$.
Vì $ON=y\cdot OD$ và $OB=k\cdot OD$ nên $y=k(1-2x)$. (2)
[[so-do:n5]]
Trừ (1) cho (2) vế theo vế: $x-y=2k(x-y)$, tức $(x-y)(1-2k)=0$.
Nếu $x=y$ thì $\dfrac{ON}{OD}=\dfrac{OP}{OC}$ nên $NP\parallel CD$ (định lí Thalès đảo cho $\triangle ODC$),
suy ra $d\parallel CD\parallel AB$, trái với giả thiết.
[[so-do:n6]]
Vậy $x\neq y$, nên $1-2k=0$, tức $k=\dfrac12$.
Do đó $\dfrac{AB}{CD}=\dfrac12$, hay $CD=2AB$.
**hinh:** TCHH-5-17.png
**hinh_lg:** TCHH-5-17_lg.png
**nghi_van:** ĐỀ SÁCH THIẾU ĐIỀU KIỆN: nếu $d\parallel AB$ thì kết luận SAI. Phản ví dụ: $D(0;0)$, $C(10;0)$, $A(3;6)$, $B(7;6)$ ($AB=4$, $CD=10$), đường thẳng $y=\dfrac{10}{3}$ cắt $AD$, $DB$, $CA$, $CB$ tại điểm có hoành độ $\dfrac53$, $\dfrac{35}{9}$, $\dfrac{55}{9}$, $\dfrac{25}{3}$, có $MN=NP=PQ=\dfrac{20}{9}$ nhưng $CD\ne2AB$. Lập luận "$E\neq F$ thì vô lý" của sách đúng là đã gạt ca song song này mà không nói; bản này thêm "$d$ không song song $AB$" vào đề. Phần "$N\in OD$, $P\in OC$" suy từ thứ tự $M,N,P,Q$ trên đoạn $MQ$ trong hình thang (đường thẳng cắt hai đường chéo trước-sau); đã verify số trên 3 bộ toạ độ ($k=\dfrac12$).
