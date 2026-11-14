### NDT-H3.6 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.6@p166 · tầng nâng cao
**sach:** Kéo dài $AG$ cắt $BC$ tại $M$ (trung điểm $BC$, $AG=\frac23AM$ — tính chất trọng tâm); định lí Thalès trong $\triangle MAB$ với $GD\parallel AB$ cho $\frac{BD}{BM}=\frac{AG}{AM}=\frac23$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $G$ là trọng tâm của tam giác $ABC$. Qua $G$ vẽ đường thẳng song song với $AB$, cắt $BC$ tại $D$. Chứng minh rằng $BD=\dfrac13BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** kéo dài $AG$ cắt $BC$ tại $M$ để dùng tính chất trọng tâm ($M$ là trung điểm $BC$, $AG=\dfrac23AM$); vì $GD\parallel AB$ nên định lí Thalès trong $\triangle MAB$ cho $\dfrac{BD}{BM}=\dfrac{AG}{AM}=\dfrac23$.

- n1 | - | $M$ là trung điểm của $BC$ và $\dfrac{AG}{AM}=\dfrac23$ | gt | tính chất trọng tâm
- n2 | - | $\dfrac{BD}{BM}=\dfrac{AG}{AM}$ | n1, gt | định lí Thalès trong $\triangle MAB$ ($GD\parallel AB$)
- n3 | - | $BD=\dfrac13BC$ | n1, n2 | $\dfrac{BD}{BM}=\dfrac23$ và $BM=\dfrac12BC$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $M$ là giao điểm của $AG$ và $BC$.
Vì $G$ là trọng tâm của $\triangle ABC$ (gt)
nên $M$ là trung điểm của $BC$ và $AG=\dfrac23AM$ (tính chất trọng tâm).
Suy ra $BM=\dfrac12BC$ và $\dfrac{AG}{AM}=\dfrac23$. (1)
[[so-do:n2]]
Xét $\triangle MAB$ có:
$G\in MA$, $D\in MB$;
$GD\parallel AB$ (gt)
nên $\dfrac{BD}{BM}=\dfrac{AG}{AM}$ (định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{BD}{BM}=\dfrac23$.
Do đó $BD=\dfrac23BM=\dfrac23\cdot\dfrac12BC=\dfrac13BC$.
Vậy $BD=\dfrac13BC$.
**hinh:** NDT-H3-6.png
**hinh_lg:** NDT-H3-6_lg.png
**nghi_van:**

### NDT-H3.7 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.7@p166 · tầng nâng cao
**sach:** Qua $B$ kẻ $BM\parallel d$ ($M\in AC$), qua $D$ kẻ $DN\parallel d$ ($N\in AC$); $\triangle ABM=\triangle CDN$ (g.c.g) cho $AM=CN$; Thalès trong $\triangle ABM$ và $\triangle AND$; cộng vế.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Đường thẳng $d$ cắt các cạnh $AB$, $AD$ và đường chéo $AC$ của hình bình hành $ABCD$ lần lượt tại $E$, $F$ và $O$. Chứng minh rằng $\dfrac{AB}{AE}+\dfrac{AD}{AF}=\dfrac{AC}{AO}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** qua $B$ kẻ $BM\parallel d$, qua $D$ kẻ $DN\parallel d$ ($M,N\in AC$) để chuyển $\dfrac{AB}{AE}$, $\dfrac{AD}{AF}$ về các đoạn $AM$, $AN$ trên $AC$ (định lí Thalès); tâm $I$ của hình bình hành là trung điểm của $MN$ nên $AM+AN=AC$.

- n1 | - | $\dfrac{AB}{AE}=\dfrac{AM}{AO}$ | gt | định lí Thalès trong $\triangle ABM$ ($OE\parallel BM$)
- n2 | - | $\dfrac{AD}{AF}=\dfrac{AN}{AO}$ | gt | định lí Thalès trong $\triangle ADN$ ($OF\parallel DN$)
- n3 | - | $I$ là trung điểm của $MN$ | gt | phép đối xứng tâm $I$ của hình bình hành
- n4 | - | $AM+AN=AC$ | n3 | $M,N$ cùng thuộc tia $AC$ và $I$ là trung điểm của $AC$
- n5 | - | $\dfrac{AB}{AE}+\dfrac{AD}{AF}=\dfrac{AC}{AO}$ | n1, n2, n4 | cộng hai tỉ số cùng mẫu $AO$

**Phần 2. Trình bày**
[[so-do:n1]]
Qua $B$ kẻ đường thẳng song song với $d$, cắt $AC$ tại $M$.
Qua $D$ kẻ đường thẳng song song với $d$, cắt $AC$ tại $N$.
Vì $E$ nằm trên cạnh $AB$ và $OE\parallel BM$ nên $O$ nằm giữa $A$ và $M$.
Tương tự $O$ nằm giữa $A$ và $N$.
Do đó $M$, $N$ cùng thuộc tia $AC$.
Xét $\triangle ABM$ có:
$E\in AB$, $O\in AM$;
$OE\parallel BM$ (cách kẻ)
nên $\dfrac{AB}{AE}=\dfrac{AM}{AO}$ (định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ADN$ có:
$F\in AD$, $O\in AN$;
$OF\parallel DN$ (cách kẻ)
nên $\dfrac{AD}{AF}=\dfrac{AN}{AO}$ (định lí Thalès). (2)
[[so-do:n3]]
Gọi $I$ là giao điểm của $AC$ và $BD$.
Vì $ABCD$ là hình bình hành nên $I$ là trung điểm của $AC$ và của $BD$ (tính chất hình bình hành).
Phép đối xứng tâm $I$ biến $B$ thành $D$,
nên biến đường thẳng $BM$ thành đường thẳng qua $D$ song song với $BM$, tức là $DN$.
Phép đối xứng tâm $I$ biến đường thẳng $AC$ (đi qua $I$) thành chính nó.
Suy ra $M$ (giao của $BM$ và $AC$) biến thành $N$ (giao của $DN$ và $AC$),
tức $I$ là trung điểm của $MN$.
[[so-do:n4]]
Vì $M$, $N$ cùng thuộc tia $AC$ và $I$ là trung điểm của $MN$ nên $AI=\dfrac{AM+AN}{2}$.
Do đó $AM+AN=2AI=AC$. (3)
[[so-do:n5]]
Từ (1), (2) và (3):
$\dfrac{AB}{AE}+\dfrac{AD}{AF}=\dfrac{AM}{AO}+\dfrac{AN}{AO}=\dfrac{AM+AN}{AO}=\dfrac{AC}{AO}$.
**hinh:** NDT-H3-7.png
**hinh_lg:** NDT-H3-7_lg.png
**nghi_van:** Sách chứng minh $AM=CN$ bằng $\triangle ABM=\triangle CDN$ (g.c.g) rồi cộng độ dài; bản kho dùng đối xứng tâm để khỏi phụ thuộc vị trí $M$, $N$ trên $AC$. Ký hiệu $O$ trong đề là giao điểm của $d$ với $AC$, KHÔNG phải tâm hình bình hành (tâm gọi là $I$ trong lời giải).

### NDT-H3.8 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.8@p166 (lời giải sang p167) · tầng nâng cao
**sach:** Lấy $F$ đối xứng với $N$ qua $M$ ⇒ $BNCF$ là hình bình hành; Thalès trong $\triangle ABF$ và $\triangle ACF$, cả hai tỉ số cùng bằng $\frac{AN}{NF}$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $AM$ là đường trung tuyến. $N$ là điểm trên đoạn thẳng $AM$. Gọi $D$ là giao điểm của $CN$ và $AB$, $E$ là giao điểm của $BN$ và $AC$. Chứng minh rằng $\dfrac{AD}{BD}=\dfrac{AE}{CE}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** lấy $F$ đối xứng với $N$ qua $M$ thì $BNCF$ là hình bình hành, sinh ra $BF\parallel DN$ và $FC\parallel NE$; định lí Thalès trong $\triangle ABF$ và $\triangle ACF$ cho hai tỉ số cần so sánh cùng bằng $\dfrac{AN}{NF}$.

- n1 | - | $BNCF$ là hình bình hành | gt | hai đường chéo cắt nhau tại trung điểm của mỗi đường
- n2 | - | $BF\parallel DN$ và $NE\parallel FC$ | n1 | tính chất hình bình hành
- n3 | - | $\dfrac{AD}{BD}=\dfrac{AN}{NF}$ | n2 | định lí Thalès trong $\triangle ABF$
- n4 | - | $\dfrac{AE}{CE}=\dfrac{AN}{NF}$ | n2 | định lí Thalès trong $\triangle ACF$
- n5 | - | $\dfrac{AD}{BD}=\dfrac{AE}{CE}$ | n3, n4 | cùng bằng $\dfrac{AN}{NF}$

**Phần 2. Trình bày**
[[so-do:n1]]
Lấy $F$ đối xứng với $N$ qua $M$, suy ra $M$ là trung điểm của $NF$.
Xét tứ giác $BNCF$ có:
$M$ là trung điểm của $BC$ (gt);
$M$ là trung điểm của $NF$ (cách lấy $F$)
nên $BNCF$ là hình bình hành (hai đường chéo cắt nhau tại trung điểm của mỗi đường).
[[so-do:n2]]
Suy ra $BF\parallel NC$ và $BN\parallel FC$ (tính chất hình bình hành).
Mà $D\in NC$, $E\in BN$ nên $BF\parallel DN$ và $NE\parallel FC$.
[[so-do:n3]]
Vì $N$ nằm giữa $A$ và $M$, $M$ nằm giữa $N$ và $F$ nên $N$ nằm trên đoạn $AF$.
Xét $\triangle ABF$ có:
$D\in AB$, $N\in AF$;
$DN\parallel BF$ (cmt)
nên $\dfrac{AD}{BD}=\dfrac{AN}{NF}$ (định lí Thalès). (1)
[[so-do:n4]]
Xét $\triangle ACF$ có:
$E\in AC$, $N\in AF$;
$NE\parallel CF$ (cmt)
nên $\dfrac{AE}{CE}=\dfrac{AN}{NF}$ (định lí Thalès). (2)
[[so-do:n5]]
Từ (1) và (2) suy ra $\dfrac{AD}{BD}=\dfrac{AE}{CE}$.
**hinh:** NDT-H3-8.png
**hinh_lg:** NDT-H3-8_lg.png
**nghi_van:** Đề ngầm hiểu $N$ khác $A$ và $M$ (nếu $N=M$ thì $D\equiv B$, $E\equiv C$, tỉ số vô nghĩa; nếu $N=A$ thì $D\equiv E\equiv A$). Giữ nguyên chữ đề sách.

### NDT-H3.9 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.9@p167 (lời giải sang p168) · tầng thi HSG (Đề thi chọn học sinh giỏi Toán lớp 8, THCS Nguyễn Du, Quận 1 – TP. Hồ Chí Minh, 1998–1999)
**sach:** Ý a: qua $A$, $C$ kẻ song song $EF$ cắt $BD$ tại $I$, $L$; $\triangle OAI=\triangle OCL$ cho $OI=OL$; Thalès trong $\triangle BAI$, $\triangle BCL$; $BI+BL=2BO=4BM$. Ý b: dùng ý a cho cả hai đầu $AB$ rồi "bài toán phụ" $\frac1x+\frac1y\ge\frac4{x+y}$.
**loai:** nhieu_y
**loi_dan:**
Cho hình bình hành $ABCD$ tâm $O$. Gọi $M$, $N$ lần lượt là trung điểm của $BO$, $AO$. Lấy điểm $F$ trên cạnh $AB$ sao cho tia $FM$ cắt cạnh $BC$ tại $E$ và tia $FN$ cắt cạnh $AD$ tại $K$.
(Đề thi chọn học sinh giỏi Toán lớp 8, Trường THCS Nguyễn Du, Quận 1 – TP. Hồ Chí Minh, năm học 1998 – 1999)
**hinh:** NDT-H3-9.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $\dfrac{BA}{BF}+\dfrac{BC}{BE}=4$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** qua $A$, $C$ kẻ đường thẳng song song với $EF$ cắt $BD$ tại $I$, $L$; định lí Thalès đưa $\dfrac{BA}{BF}$, $\dfrac{BC}{BE}$ về $\dfrac{BI}{BM}$, $\dfrac{BL}{BM}$; $O$ là trung điểm của $IL$ nên $BI+BL=2BO=4BM$.

- n1 | - | $\dfrac{BA}{BF}=\dfrac{BI}{BM}$ | gt | định lí Thalès trong $\triangle BAI$ ($FM\parallel AI$)
- n2 | - | $\dfrac{BC}{BE}=\dfrac{BL}{BM}$ | gt | định lí Thalès trong $\triangle BCL$ ($EM\parallel CL$)
- n3 | - | $O$ là trung điểm của $IL$ | gt | phép đối xứng tâm $O$ của hình bình hành
- n4 | - | $BI+BL=4BM$ | n3, gt | $BO=\dfrac{BI+BL}{2}$ và $M$ là trung điểm của $BO$
- n5 | - | $\dfrac{BA}{BF}+\dfrac{BC}{BE}=4$ | n1, n2, n4 | cộng hai tỉ số cùng mẫu $BM$

**Phần 2. Trình bày**
[[so-do:n1]]
Qua $A$ kẻ đường thẳng song song với $EF$, cắt $BD$ tại $I$.
Qua $C$ kẻ đường thẳng song song với $EF$, cắt $BD$ tại $L$.
Vì $F$ nằm trên cạnh $BA$ và $FM\parallel AI$ nên $M$ nằm giữa $B$ và $I$.
Tương tự $M$ nằm giữa $B$ và $L$ (vì $E$ nằm trên cạnh $BC$ và $EM\parallel CL$).
Do đó $I$, $L$ thuộc tia $BD$.
Xét $\triangle BAI$ có:
$F\in BA$, $M\in BI$;
$FM\parallel AI$ (cách kẻ)
nên $\dfrac{BA}{BF}=\dfrac{BI}{BM}$ (định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle BCL$ có:
$E\in BC$, $M\in BL$;
$EM\parallel CL$ (cách kẻ)
nên $\dfrac{BC}{BE}=\dfrac{BL}{BM}$ (định lí Thalès). (2)
[[so-do:n3]]
Phép đối xứng tâm $O$ biến $A$ thành $C$,
nên biến đường thẳng $AI$ thành đường thẳng qua $C$ song song với $AI$, tức là $CL$.
Phép đối xứng tâm $O$ biến đường thẳng $BD$ (đi qua $O$) thành chính nó.
Suy ra $I$ (giao của $AI$ và $BD$) biến thành $L$ (giao của $CL$ và $BD$),
tức $O$ là trung điểm của $IL$.
[[so-do:n4]]
Vì $I$, $L$ cùng thuộc tia $BD$ và $O$ là trung điểm của $IL$ nên $BO=\dfrac{BI+BL}{2}$.
Mà $M$ là trung điểm của $BO$ (gt) nên $BO=2BM$.
Do đó $BI+BL=2BO=4BM$. (3)
[[so-do:n5]]
Từ (1), (2) và (3):
$\dfrac{BA}{BF}+\dfrac{BC}{BE}=\dfrac{BI}{BM}+\dfrac{BL}{BM}=\dfrac{BI+BL}{BM}=\dfrac{4BM}{BM}=4$.
**hinh_lg:** NDT-H3-9_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $BE+AK\ge BC$.
**da_biet:** Biết $\dfrac{BA}{BF}+\dfrac{BC}{BE}=4$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** dùng ý a ở hai đầu $B$ và $A$ của cạnh $AB$ (cộng lại được $8$), rồi bất đẳng thức phụ $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$ cho các cặp $BF,AF$ và $BE,AK$.

- n1 | - | $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$ với $x,y>0$ | gt | biến đổi tương đương về $(x-y)^2\ge0$
- n2 | - | $BA\left(\dfrac1{BF}+\dfrac1{AF}\right)+BC\left(\dfrac1{BE}+\dfrac1{AK}\right)=8$ | gt | kết quả ý a (hai đầu $B$ và $A$), $AD=BC$
- n3 | - | $8\ge4+\dfrac{4BC}{BE+AK}$ | n1, n2 | áp dụng bài toán phụ
- n4 | - | $BE+AK\ge BC$ | n3 | biến đổi bất đẳng thức

**Phần 2. Trình bày**
[[so-do:n1]]
Với $x>0$, $y>0$ thì $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$.
Thật vậy, nhân hai vế với $xy(x+y)>0$, bất đẳng thức tương đương với:
$(x+y)^2\ge4xy$
$\Leftrightarrow (x-y)^2\ge0$ (bất đẳng thức đúng).
Dấu "$=$" xảy ra khi $x=y$.
[[so-do:n2]]
Theo ý a): $\dfrac{BA}{BF}+\dfrac{BC}{BE}=4$. (1)
Đề bài đối xứng khi đổi vai $A\leftrightarrow B$, $C\leftrightarrow D$, $M\leftrightarrow N$, $E\leftrightarrow K$:
$BADC$ cũng là hình bình hành tâm $O$; $N$, $M$ là trung điểm của $AO$, $BO$;
tia $FN$ cắt $AD$ tại $K$ và tia $FM$ cắt $BC$ tại $E$.
Lặp lại đúng chứng minh ý a) với vai trò đó, ta được $\dfrac{AB}{AF}+\dfrac{AD}{AK}=4$. (2)
Cộng (1) và (2), với $AD=BC$ (cạnh đối hình bình hành):
$8=\dfrac{BA}{BF}+\dfrac{BA}{AF}+\dfrac{BC}{BE}+\dfrac{BC}{AK}=BA\left(\dfrac1{BF}+\dfrac1{AF}\right)+BC\left(\dfrac1{BE}+\dfrac1{AK}\right)$.
[[so-do:n3]]
Áp dụng bài toán phụ:
$\dfrac1{BF}+\dfrac1{AF}\ge\dfrac4{BF+AF}=\dfrac4{AB}$ (vì $F$ thuộc cạnh $AB$ nên $BF+AF=AB$);
$\dfrac1{BE}+\dfrac1{AK}\ge\dfrac4{BE+AK}$.
Do đó $8\ge BA\cdot\dfrac4{AB}+BC\cdot\dfrac4{BE+AK}=4+\dfrac{4BC}{BE+AK}$.
[[so-do:n4]]
Suy ra $\dfrac{4BC}{BE+AK}\le4$, tức $BC\le BE+AK$ (nhân hai vế với $\dfrac{BE+AK}4>0$).
Vậy $BE+AK\ge BC$.
**nghi_van:** (1) Đề ngầm hiểu $F$ nằm trong đoạn $AB$ với $\dfrac13AB\le AF\le\dfrac23AB$ (đã kiểm bằng toạ độ: ngoài khoảng này $E$ hoặc $K$ rơi ra ngoài cạnh; trong lời giải chỉ dùng $F\ne A,B$ và $E\in BC$, $K\in AD$). (2) Lời giải sách viết "tương tự có $\dfrac{BA}{AF}+\dfrac{AD}{AK}=4$"; bản kho nêu rõ phép đổi vai để không phải chứng minh lại. (3) Hai ý cùng giả thiết, ý b dùng ý a ⇒ giữ một bài hai ý, không tách hai bài độc lập.
