### VHB2-VD36 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 VD36@p086 (giải p087)
**sach:** Ý a: tính chất đường phân giác trong $\triangle ABC$ rồi dãy tỉ số. Ý b: $BI$ là phân giác của $\triangle ABD$. Ý c: $\dfrac{AI}{ID}=\dfrac{b+c}{a}=2$ và $\dfrac{AG}{GM}=2$ rồi Thalès đảo trong $\triangle ADM$ (cách thứ hai của sách dùng tỉ số diện tích — không dùng).
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $BC=a$, $AC=b$, $AB=c$, đường phân giác $AD$ ($D\in BC$).
**hinh:** VHB2-VD36.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Tính các độ dài $BD$, $DC$ theo $a$, $b$, $c$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $AD$ là phân giác trong nên $BD$ và $DC$ tỉ lệ với $AB$ và $AC$; chỉ cần thêm tổng $BD+DC=a$ là tìm được cả hai đoạn.
**Bước 1.** Viết tỉ lệ thức của tính chất đường phân giác trong $\triangle ABC$ để có $\dfrac{BD}{DC}$ theo hai cạnh kề $c$ và $b$.
**Bước 2.** Cộng tử với mẫu của tỉ lệ thức để dùng được tổng $BD+DC=a$, rồi rút ra $BD$.
**Bước 3.** Lấy $a$ trừ đi $BD$ để có $DC$.
**Chú ý:** Chân đường phân giác trong luôn nằm giữa $B$ và $C$ nên $BD+DC=BC$.

**Phần 2. Trình bày**
Vì $AD$ là phân giác của $\widehat{BAC}$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}=\dfrac{c}{b}$ (tính chất đường phân giác).
Suy ra $\dfrac{BD}{BD+DC}=\dfrac{c}{c+b}$ (tính chất tỉ lệ thức).
Mà $BD+DC=BC=a$ ($D$ nằm giữa $B$ và $C$)
nên $\dfrac{BD}{a}=\dfrac{c}{b+c}$,
do đó $BD=\dfrac{ac}{b+c}$.
Suy ra $DC=a-BD=a-\dfrac{ac}{b+c}=\dfrac{ab}{b+c}$.
Vậy $BD=\dfrac{ac}{b+c}$ và $DC=\dfrac{ab}{b+c}$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Tia phân giác của góc $B$ cắt $AD$ ở $I$. Tính tỉ số $AI:ID$ theo $a$, $b$, $c$.
**da_biet:** Biết $BD=\dfrac{ac}{b+c}$ (ý a).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $I$ nằm trên $AD$ nên $BI$ chính là đường phân giác trong của $\triangle ABD$, nó chia $AD$ theo tỉ lệ $AB:BD$; độ dài $BD$ đã có ở ý a.
**Bước 1.** Chỉ ra $BI$ là phân giác của góc $B$ trong $\triangle ABD$, vì góc $ABD$ chính là góc $ABC$.
**Bước 2.** Viết tính chất đường phân giác trong $\triangle ABD$ để có $AI:ID$ bằng $AB:BD$.
**Bước 3.** Thay $BD$ ở ý a vào rồi rút gọn thương hai phân thức.
**Chú ý:** Phải xét $\triangle ABD$ (không phải $\triangle ABC$) vì điểm $I$ nằm trên cạnh $AD$.

**Phần 2. Trình bày**
Vì $D\in BC$ nên $\widehat{ABD}=\widehat{ABC}$,
mà $BI$ là tia phân giác của $\widehat{ABC}$ (gt)
nên $BI$ là phân giác của $\widehat{ABD}$ ($I\in AD$).
Xét $\triangle ABD$ có $BI$ là phân giác của $\widehat{ABD}$
nên $\dfrac{AI}{ID}=\dfrac{AB}{BD}$ (tính chất đường phân giác).
Thay $AB=c$ và $BD=\dfrac{ac}{b+c}$ (ý a) ta có $\dfrac{AI}{ID}=c:\dfrac{ac}{b+c}=\dfrac{b+c}{a}$.
Vậy $AI:ID=\dfrac{b+c}{a}$.
**hinh_lg:** VHB2-VD36_b_lg.png
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Cho $BC$ bằng trung bình cộng của $AB$ và $AC$ ($AB\ne AC$). Gọi $G$ là trọng tâm của tam giác $ABC$. Chứng minh rằng $IG\parallel BC$.
**da_biet:** Biết $I$ là giao điểm của $AD$ và tia phân giác của góc $B$, và $\dfrac{AI}{ID}=\dfrac{b+c}{a}$ (ý b).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Khi $a=\dfrac{b+c}{2}$ thì tỉ số $\dfrac{AI}{ID}$ ở ý b bằng $2$; trọng tâm cũng chia trung tuyến $AM$ theo tỉ số $2$; hai tỉ số bằng nhau nên dùng định lí Thalès đảo trong $\triangle ADM$.

- n1 | - | $\dfrac{AI}{ID}=2$ | gt | thay $b+c=2a$ vào kết quả ý b
- n2 | - | $\dfrac{AG}{GM}=2$ | gt | $G$ là trọng tâm, $M$ là trung điểm $BC$
- n3 | - | $IG\parallel BC$ | n1, n2 | Thalès đảo cho $\triangle ADM$, $D\ne M$ vì $AB\ne AC$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $BC=\dfrac{AB+AC}{2}$ (gt) nên $a=\dfrac{b+c}{2}$, tức $b+c=2a$.
Từ ý b: $\dfrac{AI}{ID}=\dfrac{b+c}{a}=\dfrac{2a}{a}=2$. (1)
[[so-do:n2]]
Gọi $M$ là trung điểm của $BC$ thì $AM$ là trung tuyến và $G\in AM$.
Vì $G$ là trọng tâm của $\triangle ABC$ nên $AG=\dfrac23AM$ (tính chất trọng tâm),
suy ra $GM=\dfrac13AM$, do đó $\dfrac{AG}{GM}=2$. (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{AI}{ID}=\dfrac{AG}{GM}$,
nên $\dfrac{AI}{AI+ID}=\dfrac{AG}{AG+GM}$ (tính chất tỉ lệ thức),
hay $\dfrac{AI}{AD}=\dfrac{AG}{AM}$.
Vì $AB\ne AC$ nên $BD\ne DC$ (tính chất đường phân giác),
do đó $D\ne M$.
Xét $\triangle ADM$ có $I\in AD$, $G\in AM$ và $\dfrac{AI}{AD}=\dfrac{AG}{AM}$
nên $IG\parallel DM$ (định lí Thalès đảo).
Mà $D$, $M$ thuộc $BC$ nên $IG\parallel BC$.
**hinh_lg:** VHB2-VD36_c_lg.png
**nghi_van:** Ý c: đề sách không loại trường hợp $AB=AC$ (khi đó tam giác đều, $I\equiv G$ và "$IG\parallel BC$" vô nghĩa) — đã thêm điều kiện $AB\ne AC$ vào đề. Ý c cùng giả thiết, kết luận với TCHH-3.II.VD9 (ở đó cho $AB+AC=2BC$); giữ vì ý c nối tiếp ý b của bài này, lô sau lọc nếu muốn.

### VHB2-219 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT219@p087 (giải p202)
**sach:** Tính chất đường phân giác cho $\dfrac{AB}{BC}=\dfrac{AD}{DC}=\dfrac35$, đặt $AB=3y$, $BC=5y$, Pythagore. Giữ nguyên.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** AB=6; BC=10
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$, đường phân giác $BD$ ($D\in AC$). Biết $AD=3$ cm, $DC=5$ cm. Tính các độ dài $AB$, $BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Phân giác $BD$ cho $\dfrac{AB}{BC}=\dfrac{AD}{DC}$ nên hai cạnh cần tìm tỉ lệ với hai số đã biết; cạnh $AC$ cũng đã biết nên định lí Pythagore biến tỉ lệ đó thành số cụ thể.
**Bước 1.** Áp dụng tính chất đường phân giác trong $\triangle ABC$ với phân giác $BD$ để có tỉ số $\dfrac{AB}{BC}$.
**Bước 2.** Đặt $AB$ và $BC$ theo một ẩn chung $y$ đúng với tỉ số vừa tìm được.
**Bước 3.** Tính $AC=AD+DC$ rồi áp dụng định lí Pythagore cho tam giác vuông $ABC$ để tìm $y$.
**Bước 4.** Thay $y$ vào hai biểu thức để có $AB$ và $BC$.
**Chú ý:** $D$ nằm giữa $A$ và $C$ nên $AC=AD+DC$; ẩn $y$ là độ dài nên $y>0$.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $BD$ là phân giác của $\widehat{ABC}$ ($D\in AC$)
nên $\dfrac{AB}{BC}=\dfrac{AD}{DC}=\dfrac35$ (tính chất đường phân giác).
Đặt $AB=3y$, $BC=5y$ ($y>0$).
Vì $D$ nằm giữa $A$ và $C$ nên $AC=AD+DC=3+5=8$ (cm).
Vì $\triangle ABC$ vuông tại $A$
nên $BC^2=AB^2+AC^2$ (định lí Pythagore),
tức $25y^2=9y^2+64$.
Suy ra $16y^2=64$, $y^2=4$,
mà $y>0$ nên $y=2$.
Vậy $AB=3\cdot2=6$ cm, $BC=5\cdot2=10$ cm.
**hinh:** VHB2-219.png
**nghi_van:**

### VHB2-220 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT220@p088 (giải p202)
**sach:** Tính chất đường phân giác $\dfrac{DB}{DC}=\dfrac{AB}{AC}$, thay $DB=BM$, $DC=CN$, được $\dfrac{BM}{AB}=\dfrac{CN}{AC}$ rồi Thalès đảo. Giữ nguyên (thêm bước đổi sang $\dfrac{AM}{AB}=\dfrac{AN}{AC}$ cho đúng dạng Thalès đảo).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, đường phân giác $AD$ ($D\in BC$). Điểm $M$ thuộc cạnh $AB$, điểm $N$ thuộc cạnh $AC$ sao cho $BM=BD$, $CN=CD$. Chứng minh rằng $MN\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Thay $BM$, $CN$ bằng $BD$, $CD$ trong tỉ lệ thức của tính chất đường phân giác để có $\dfrac{BM}{AB}=\dfrac{CN}{AC}$ (hai tỉ số cùng tính từ $B$ và $C$); đổi sang các đoạn $AM$, $AN$ rồi dùng định lí Thalès đảo.

- n1 | - | $\dfrac{BD}{DC}=\dfrac{AB}{AC}$ | gt | $AD$ là phân giác trong $\triangle ABC$, tính chất đường phân giác
- n2 | - | $\dfrac{BM}{AB}=\dfrac{CN}{AC}$ | n1, gt | thay $BM=BD$, $CN=CD$ rồi dùng tính chất tỉ lệ thức
- n3 | - | $\dfrac{AM}{AB}=\dfrac{AN}{AC}$ | n2, gt | $AM=AB-BM$, $AN=AC-CN$
- n4 | - | $MN\parallel BC$ | n3 | định lí Thalès đảo cho $\triangle ABC$

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle ABC$ có $AD$ là phân giác của $\widehat{BAC}$ (gt)
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác). (1)
[[so-do:n2]]
Mà $BM=BD$ và $CN=CD$ (gt)
nên từ (1) ta có $\dfrac{BM}{CN}=\dfrac{AB}{AC}$,
suy ra $\dfrac{BM}{AB}=\dfrac{CN}{AC}$ (tính chất tỉ lệ thức). (2)
[[so-do:n3]]
Vì $M$ thuộc cạnh $AB$, $N$ thuộc cạnh $AC$
nên $AM=AB-BM$ và $AN=AC-CN$.
Từ (2) suy ra $1-\dfrac{BM}{AB}=1-\dfrac{CN}{AC}$,
tức $\dfrac{AB-BM}{AB}=\dfrac{AC-CN}{AC}$,
hay $\dfrac{AM}{AB}=\dfrac{AN}{AC}$.
[[so-do:n4]]
Xét $\triangle ABC$ có $M\in AB$, $N\in AC$ và $\dfrac{AM}{AB}=\dfrac{AN}{AC}$
nên $MN\parallel BC$ (định lí Thalès đảo).
**hinh:** VHB2-220.png
**nghi_van:**

### VHB2-221 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT221@p088 (giải p203)
**sach:** Kẻ $DE\parallel BK$; $\dfrac{AK}{KC}=\dfrac{AK}{KE}\cdot\dfrac{KE}{KC}$ với $\dfrac{AK}{KE}=2$ (Thalès trong $\triangle ADE$) và $\dfrac{KE}{KC}=\dfrac25$ (phân giác cho $\dfrac{DB}{DC}$, Thalès trong $\triangle CBK$). Đáp số sách $\dfrac45$. Giữ nguyên.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 4/5
**noi_dung:**
Cho tam giác $ABC$ có $AB=4$ cm, $AC=6$ cm, đường phân giác $AD$ ($D\in BC$). Điểm $O$ nằm trên đoạn thẳng $AD$ sao cho $OA:OD=2:1$. Gọi $K$ là giao điểm của $BO$ và $AC$. Tính tỉ số $AK:KC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Tỉ số $OA:OD$ nằm trên đường $AD$ còn tỉ số cần tìm nằm trên $AC$; kẻ $DE\parallel BK$ để chuyển tỉ số $OA:OD$ sang $AK:KE$ rồi nối tiếp với $KE:KC$.
**Bước 1.** Kẻ $DE\parallel BK$ với $E\in AC$; trong $\triangle ADE$ đường $OK\parallel DE$ cho $\dfrac{AK}{KE}$ bằng $\dfrac{AO}{OD}$.
**Bước 2.** Dùng tính chất đường phân giác $AD$ để tìm $\dfrac{DB}{DC}$ từ hai cạnh $AB$, $AC$, rồi suy ra $\dfrac{DC}{BC}$.
**Bước 3.** Trong $\triangle CBK$ có $DE\parallel BK$ nên $\dfrac{CE}{CK}=\dfrac{CD}{CB}$; từ đó suy ra $\dfrac{KE}{KC}$.
**Bước 4.** Viết $\dfrac{AK}{KC}=\dfrac{AK}{KE}\cdot\dfrac{KE}{KC}$ rồi thay hai tỉ số đã có.
**Chú ý:** $E$ nằm giữa $K$ và $C$ nên $KE=KC-CE$; đề cho $O$ chia $AD$ theo tỉ số $2:1$ tính từ đỉnh $A$.

**Phần 2. Trình bày**
Kẻ $DE\parallel BK$ với $E\in AC$.
Xét $\triangle ADE$ có $OK\parallel DE$ ($O\in AD$, $K\in AE$)
nên $\dfrac{AK}{KE}=\dfrac{AO}{OD}=2$ (định lí Thalès). (1)
Xét $\triangle ABC$ có $AD$ là phân giác của $\widehat{BAC}$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}=\dfrac46=\dfrac23$ (tính chất đường phân giác),
suy ra $\dfrac{DC}{BC}=\dfrac35$ ($D$ nằm giữa $B$ và $C$).
Xét $\triangle CBK$ có $DE\parallel BK$ ($D\in CB$, $E\in CK$)
nên $\dfrac{CE}{CK}=\dfrac{CD}{CB}=\dfrac35$ (định lí Thalès).
Do đó $\dfrac{KE}{KC}=\dfrac{CK-CE}{CK}=1-\dfrac35=\dfrac25$ ($E$ nằm giữa $K$ và $C$). (2)
Từ (1) và (2) suy ra $\dfrac{AK}{KC}=\dfrac{AK}{KE}\cdot\dfrac{KE}{KC}=2\cdot\dfrac25=\dfrac45$.
Vậy $AK:KC=4:5$.
**hinh:** VHB2-221.png
**hinh_lg:** VHB2-221_lg.png
**nghi_van:** Đề sách ghi "O chia trong AD theo tỉ số 2 : 1" — hiểu là $OA:OD=2:1$ (cách hiểu duy nhất khớp đáp số sách $\dfrac45$; đọc ngược $OD:OA=2:1$ cho đáp số khác).

### VHB2-222 → DE_SAU (HH00135)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT222@p088 (giải p203)
**noi_dung:**
Cho tam giác $ABC$, đường trung tuyến $AM$. Các tia phân giác của các góc $\widehat{AMB}$, $\widehat{AMC}$ cắt $AB$, $AC$ theo thứ tự ở $D$, $E$.
a) Chứng minh rằng $DE$ song song với $BC$.
b) Cho $BC=a$, $AM=m$. Tính độ dài $DE$.
c) Giao điểm $I$ của $AM$ và $DE$ chuyển động trên đường nào nếu tam giác $ABC$ có $BC$ cố định, đường trung tuyến $AM$ bằng $m$ không đổi?
d) Tam giác $ABC$ có điều kiện gì để $DE$ là đường trung bình của tam giác đó?
**ly_do:** ý c là bài toán quỹ tích (tập hợp điểm $I$ trên đường tròn tâm $M$ bán kính $\dfrac{am}{a+2m}$, trừ giao điểm với $BC$) nên cả bài chờ chuyên đề cực trị – quỹ tích; ý a, b, d giải được gọn bằng tính chất phân giác: $\dfrac{DA}{DB}=\dfrac{MA}{MB}=\dfrac{EA}{EC}$ nên $DE\parallel BC$, $DE=\dfrac{2am}{a+2m}$, $DE$ là đường trung bình $\Leftrightarrow$ $MA=MB$ $\Leftrightarrow$ tam giác vuông tại $A$ (đã kiểm số, kho đã có ý a ở TCHH-3.II.10).

### VHB2-223 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT223@p088 (giải p203)
**sach:** Vẽ phân giác ngoài tại $A$ cắt $BC$ ở $E$: $\dfrac{EB}{EC}=\dfrac{AB}{AC}=\dfrac{DB}{DC}=\dfrac12$ nên $EB=BC=6$, $ED=8$, $KD=\dfrac{ED}{2}=4$. Sách ghi "cách khác: xem bài 236" — không dùng. Giữ nguyên, bổ sung lí do $K$ là trung điểm $ED$.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 4
**noi_dung:**
Trong tam giác $ABC$, đường phân giác $AD$ chia cạnh đối diện thành các đoạn thẳng $BD=2$ cm, $DC=4$ cm. Đường trung trực của $AD$ cắt đường thẳng $BC$ ở $K$. Tính độ dài $KD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Đường trung trực của $AD$ vuông góc với $AD$, và phân giác ngoài tại $A$ cũng vuông góc với $AD$; hai đường này song song nên trung trực đi qua trung điểm của đoạn nối $D$ với chân phân giác ngoài.
**Bước 1.** Kẻ phân giác ngoài tại $A$ cắt đường thẳng $BC$ ở $E$ và tính $\dfrac{AB}{AC}$ từ phân giác trong $AD$.
**Bước 2.** Dùng tính chất phân giác ngoài để tìm $EB$, rồi tính $ED=EB+BD$.
**Bước 3.** Chỉ ra $AE\perp AD$ nên trung trực của $AD$ song song với $AE$, rồi dùng định lí Thalès trong $\triangle DAE$ để có $K$ là trung điểm của $DE$.
**Bước 4.** Lấy một nửa của $ED$ để được $KD$.
**Chú ý:** Tỉ số $\dfrac{EB}{EC}$ nhỏ hơn $1$ nên $E$ nằm ngoài đoạn $BC$, về phía $B$.

**Phần 2. Trình bày**
Vì $AD$ là phân giác của $\widehat{BAC}$ (gt)
nên $\dfrac{AB}{AC}=\dfrac{DB}{DC}=\dfrac24=\dfrac12$ (tính chất đường phân giác).
Vì $AB\ne AC$ nên phân giác ngoài tại $A$ cắt đường thẳng $BC$ ở $E$.
Vì $AB<AC$ nên $E$ nằm ngoài đoạn $BC$, về phía $B$ (tức $B$ nằm giữa $E$ và $C$).
Theo tính chất đường phân giác ngoài: $\dfrac{EB}{EC}=\dfrac{AB}{AC}=\dfrac12$.
Suy ra $EC=2EB$.
Mà $EC=EB+BC=EB+6$ ($B$ nằm giữa $E$ và $C$)
nên $EB=6$ (cm).
Do đó $ED=EB+BD=6+2=8$ (cm) ($B$ nằm giữa $E$ và $D$).
Vì $AD$, $AE$ là hai tia phân giác của hai góc kề bù
nên $AE\perp AD$.
Gọi $P$ là trung điểm của $AD$, $d$ là đường trung trực của $AD$ thì $d\perp AD$ tại $P$,
nên $d\parallel AE$.
Xét $\triangle DAE$ có $PK\parallel AE$ ($P\in DA$, $K\in DE$)
nên $\dfrac{DK}{DE}=\dfrac{DP}{DA}=\dfrac12$ (định lí Thalès).
Do đó $KD=\dfrac12\cdot ED=\dfrac12\cdot8=4$ (cm).
Vậy $KD=4$ cm.
**hinh:** VHB2-223.png
**hinh_lg:** VHB2-223_lg.png
**nghi_van:**

### VHB2-224 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT224@p088 (giải p203)
**sach:** Ý a: "giải tương tự ví dụ 36" — kho viết đủ: $BD=4$, $\dfrac{AI}{ID}=\dfrac{AB}{BD}=2$, $\dfrac{AG}{GM}=2$, Thalès đảo trong $\triangle ADM$. Ý b: $DM=1$ nên $IG=\dfrac23$ (đáp số sách khớp).
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $AB=8$ cm, $AC=12$ cm, $BC=10$ cm. Gọi $I$ là giao điểm của các đường phân giác, $G$ là trọng tâm của tam giác $ABC$.
**hinh:** VHB2-224.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $IG\parallel BC$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $D$, $M$ là giao điểm của $AI$, $AG$ với $BC$ ($M$ là trung điểm $BC$). Phân giác $AD$ cho $BD$; phân giác $BI$ của $\triangle ABD$ cho $\dfrac{AI}{ID}$; so với $\dfrac{AG}{GM}=2$ để dùng định lí Thalès đảo trong $\triangle ADM$.

- n1 | - | $BD=4$ cm | gt | $AD$ là phân giác của $\widehat{BAC}$, $\dfrac{BD}{DC}=\dfrac{AB}{AC}=\dfrac23$ và $BD+DC=10$
- n2 | - | $\dfrac{AI}{ID}=2$ | n1, gt | $BI$ là phân giác của $\triangle ABD$, $\dfrac{AI}{ID}=\dfrac{AB}{BD}$
- n3 | - | $\dfrac{AG}{GM}=2$ | gt | $G$ là trọng tâm, $M$ là trung điểm $BC$
- n4 | - | $IG\parallel BC$ | n2, n3 | Thalès đảo cho $\triangle ADM$, $D\ne M$ vì $BD=4\ne5=BM$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $D$ là giao điểm của $AI$ và $BC$, $M$ là trung điểm của $BC$.
Vì $I$ là giao điểm các đường phân giác
nên $AD$ là phân giác của $\widehat{BAC}$ ($D\in BC$) và $BI$ là phân giác của $\widehat{ABC}$.
Xét $\triangle ABC$ có $AD$ là phân giác của $\widehat{BAC}$
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}=\dfrac{8}{12}=\dfrac23$ (tính chất đường phân giác).
Suy ra $\dfrac{BD}{BD+DC}=\dfrac25$, tức $\dfrac{BD}{BC}=\dfrac25$ ($D$ nằm giữa $B$ và $C$),
nên $BD=\dfrac25\cdot10=4$ (cm).
[[so-do:n2]]
Vì $D\in BC$ nên $\widehat{ABD}=\widehat{ABC}$,
do đó $BI$ là phân giác của $\widehat{ABD}$ ($I\in AD$).
Xét $\triangle ABD$ có $BI$ là phân giác của $\widehat{ABD}$
nên $\dfrac{AI}{ID}=\dfrac{AB}{BD}=\dfrac84=2$ (tính chất đường phân giác). (1)
[[so-do:n3]]
Vì $G$ là trọng tâm của $\triangle ABC$ nên $G\in AM$ và $AG=\dfrac23AM$ (tính chất trọng tâm),
suy ra $GM=\dfrac13AM$, do đó $\dfrac{AG}{GM}=2$. (2)
[[so-do:n4]]
Từ (1) và (2) suy ra $\dfrac{AI}{ID}=\dfrac{AG}{GM}$,
nên $\dfrac{AI}{AI+ID}=\dfrac{AG}{AG+GM}$ (tính chất tỉ lệ thức),
hay $\dfrac{AI}{AD}=\dfrac{AG}{AM}$.
Vì $BM=5\ne4=BD$ nên $D\ne M$.
Xét $\triangle ADM$ có $I\in AD$, $G\in AM$ và $\dfrac{AI}{AD}=\dfrac{AG}{AM}$
nên $IG\parallel DM$ (định lí Thalès đảo).
Mà $D$, $M$ thuộc $BC$ nên $IG\parallel BC$.
**hinh_lg:** VHB2-224_a_lg.png
#### y b
**loai_cau:** tra_loi_ngan
**dap_an:** 2/3
**cau_hoi:** Tính độ dài $IG$.
**da_biet:** Biết $IG\parallel BC$ (ý a).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Ý a cho $IG\parallel DM$ trong $\triangle ADM$ nên $IG$ và $DM$ tỉ lệ với $AI$ và $AD$; chỉ cần tính $DM$ và tỉ số $\dfrac{AI}{AD}$.
**Bước 1.** Tính $BD$ nhờ phân giác $AD$ rồi tính $DM=BM-BD$ với $M$ là trung điểm của $BC$.
**Bước 2.** Dùng phân giác $BI$ của $\triangle ABD$ để có $\dfrac{AI}{ID}$, từ đó suy ra $\dfrac{AI}{AD}$.
**Bước 3.** Áp dụng hệ quả của định lí Thalès trong $\triangle ADM$ có $IG\parallel DM$ để tính $IG$.
**Chú ý:** Với $IG\parallel DM$ thì tỉ số $\dfrac{IG}{DM}$ bằng $\dfrac{AI}{AD}$, không phải $\dfrac{AI}{ID}$.

**Phần 2. Trình bày**
Gọi $D$ là giao điểm của $AI$ và $BC$, $M$ là trung điểm của $BC$.
Xét $\triangle ABC$ có $AD$ là phân giác của $\widehat{BAC}$
nên $\dfrac{BD}{DC}=\dfrac{AB}{AC}=\dfrac23$ (tính chất đường phân giác),
suy ra $BD=\dfrac25BC=4$ (cm) ($D$ nằm giữa $B$ và $C$).
Vì $BM=\dfrac12BC=5$ cm và $BD<BM$ nên $D$ nằm giữa $B$ và $M$,
do đó $DM=BM-BD=1$ (cm).
Vì $BI$ là phân giác của $\widehat{ABD}$ ($I\in AD$)
nên $\dfrac{AI}{ID}=\dfrac{AB}{BD}=\dfrac84=2$ (tính chất đường phân giác),
suy ra $\dfrac{AI}{AD}=\dfrac23$.
Xét $\triangle ADM$ có $IG\parallel DM$ ($I\in AD$, $G\in AM$) (ý a)
nên $\dfrac{IG}{DM}=\dfrac{AI}{AD}=\dfrac23$ (hệ quả của định lí Thalès).
Suy ra $IG=\dfrac23\cdot1=\dfrac23$ (cm).
Vậy $IG=\dfrac23$ cm.
**hinh_lg:** VHB2-224_b_lg.png
**nghi_van:** (Soát) Ý a: số liệu thoả $AB+AC=2BC$ nên là trường hợp số của TCHH-3.II.VD9 (cùng VHB2-VD36c, NDT-H3.27a); ý b mới — lô sau cân nhắc lọc ý a.

### VHB2-225 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT225@p088 (giải p204)
**sach:** Đặt $AB=a$, $AD=b$; phân giác $AM$ trong $\triangle ABD$ cho $\dfrac{DM}{DO}=\dfrac{2b}{a+b}$, phân giác $BN$ trong $\triangle ABC$ cho $\dfrac{CN}{CO}=\dfrac{2b}{a+b}$ ($O$ là giao hai đường chéo); suy ra $MN\parallel CD$. Kho thêm điều kiện $AB\ne AD$ và xét hai vị trí của $M$, $N$ (cùng phía hoặc khác phía đối với $O$) để dùng đúng định lí Thalès đảo.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình bình hành $ABCD$ ($AB\ne AD$). Tia phân giác của góc $\widehat{BAD}$ cắt $BD$ ở $M$, tia phân giác của góc $\widehat{ABC}$ cắt $AC$ ở $N$. Chứng minh rằng $MN\parallel CD$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $O$ là giao điểm hai đường chéo. Phân giác $AM$ của $\triangle ABD$ và phân giác $BN$ của $\triangle ABC$ đều cho tỉ số $\dfrac{AD}{AB}$ nên $DM=k\cdot DO$ và $CN=k\cdot CO$ cùng một hệ số $k$ (nhờ $DB=2DO$, $CA=2CO$); suy ra $OM$, $ON$ cùng tỉ lệ với $OD$, $OC$ và dùng định lí Thalès đảo trong $\triangle ODC$.

- n1 | - | $DM=k\cdot DO$ với $k=\dfrac{2b}{a+b}$ | gt | $AM$ phân giác của $\triangle ABD$: $\dfrac{DM}{MB}=\dfrac{b}{a}$; $DB=2DO$
- n2 | - | $CN=k\cdot CO$ | gt | $BN$ phân giác của $\triangle ABC$: $\dfrac{CN}{NA}=\dfrac{b}{a}$; $CA=2CO$
- n3 | - | $OM=q\cdot OD$ và $ON=q\cdot OC$ với $q=\dfrac{|a-b|}{a+b}$ | n1, n2 | $OM=|DM-DO|$, $ON=|CN-CO|$
- n4 | - | $MN\parallel CD$ | n3 | Thalès đảo (dạng mở rộng) cho $\triangle ODC$

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $AB=a$, $AD=b$ ($a\ne b$).
Vì $ABCD$ là hình bình hành
nên $BC=AD=b$ và $O$ là trung điểm của $AC$ và $BD$.
Xét $\triangle ABD$ có $AM$ là phân giác của $\widehat{BAD}$ ($M\in BD$)
nên $\dfrac{DM}{MB}=\dfrac{AD}{AB}=\dfrac{b}{a}$ (tính chất đường phân giác).
Suy ra $\dfrac{DM}{DM+MB}=\dfrac{b}{a+b}$, tức $DM=\dfrac{b}{a+b}\cdot DB$ ($M$ nằm giữa $D$ và $B$).
Mà $DB=2DO$ nên $DM=k\cdot DO$ với $k=\dfrac{2b}{a+b}$. (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $BN$ là phân giác của $\widehat{ABC}$ ($N\in AC$)
nên $\dfrac{CN}{NA}=\dfrac{BC}{BA}=\dfrac{b}{a}$ (tính chất đường phân giác).
Suy ra $CN=\dfrac{b}{a+b}\cdot CA$ ($N$ nằm giữa $C$ và $A$).
Mà $CA=2CO$ nên $CN=k\cdot CO$. (2)
[[so-do:n3]]
Ba điểm $D$, $O$, $M$ thẳng hàng nên $OM=|DM-DO|=|k-1|\cdot DO$.
Ba điểm $C$, $O$, $N$ thẳng hàng nên $ON=|CN-CO|=|k-1|\cdot CO$.
Mà $|k-1|=\dfrac{|b-a|}{a+b}=q$ nên $OM=q\cdot OD$ và $ON=q\cdot OC$.
[[so-do:n4]]
Vì $a\ne b$ nên $q>0$, tức $M\ne O$ và $N\ne O$.
Nếu $a>b$ thì $k<1$ nên $M$ nằm giữa $D$ và $O$, $N$ nằm giữa $C$ và $O$,
tức $M$, $N$ thuộc các tia $OD$, $OC$.
Nếu $a<b$ thì $k>1$ nên $O$ nằm giữa $D$ và $M$, giữa $C$ và $N$,
tức $M$, $N$ thuộc các tia đối của tia $OD$, $OC$.
Trong cả hai trường hợp $\dfrac{OM}{OD}=\dfrac{ON}{OC}$,
và $M$, $N$ cùng thuộc các tia $OD$, $OC$
hoặc cùng thuộc hai tia đối của chúng.
Xét $\triangle ODC$ có $M$ thuộc đường thẳng $OD$, $N$ thuộc đường thẳng $OC$
và $\dfrac{OM}{OD}=\dfrac{ON}{OC}$
nên $MN\parallel DC$ (định lí Thalès đảo, dạng mở rộng).
**hinh:** VHB2-225.png
**hinh_lg:** VHB2-225_lg.png
**nghi_van:** Đề sách không loại trường hợp $AB=AD$ (hình thoi): khi đó $M\equiv N\equiv O$ và "$MN\parallel CD$" vô nghĩa — đã thêm điều kiện $AB\ne AD$ vào đề.

### VHB2-226 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT226@p088 (giải p204)
**sach:** Đặt $BC=a$, $CA=b$, $AB=c$; hai lần tính chất đường phân giác cho $\dfrac{BO}{BE}=\dfrac{a+c}{a+b+c}$ và $\dfrac{CO}{CF}=\dfrac{a+b}{a+b+c}$; từ giả thiết suy ra $a^2=b^2+c^2$. Sách ghi "ta chứng minh được" — kho viết đủ phép biến đổi.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có các đường phân giác $BE$, $CF$ ($E\in AC$, $F\in AB$) cắt nhau ở $O$ và $\dfrac{BO}{BE}\cdot\dfrac{CO}{CF}=\dfrac12$. Chứng minh rằng tam giác $ABC$ vuông tại $A$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Đặt $BC=a$, $CA=b$, $AB=c$. Tính $\dfrac{BO}{BE}$ bằng hai lần tính chất đường phân giác ($BE$ cho $CE$, rồi $CO$ trong $\triangle BCE$ cho $\dfrac{BO}{OE}$); làm tương tự cho $\dfrac{CO}{CF}$; thay vào giả thiết để được hệ thức giữa $a$, $b$, $c$ rồi dùng định lí Pythagore đảo.

- n1 | - | $\dfrac{BO}{BE}=\dfrac{a+c}{a+b+c}$ | gt | $CE=\dfrac{ab}{a+c}$ (phân giác $BE$); $\dfrac{BO}{OE}=\dfrac{CB}{CE}$ (phân giác $CO$ của $\triangle BCE$)
- n2 | - | $\dfrac{CO}{CF}=\dfrac{a+b}{a+b+c}$ | gt | $BF=\dfrac{ac}{a+b}$ (phân giác $CF$); $\dfrac{CO}{OF}=\dfrac{BC}{BF}$ (phân giác $BO$ của $\triangle CBF$)
- n3 | - | $\dfrac{(a+c)(a+b)}{(a+b+c)^2}=\dfrac12$ | n1, n2, gt | thay vào giả thiết
- n4 | - | $a^2=b^2+c^2$ | n3 | khai triển $2(a+b)(a+c)=(a+b+c)^2$
- n5 | - | $\triangle ABC$ vuông tại $A$ | n4 | định lí Pythagore đảo

**Phần 2. Trình bày**

[[so-do:n1]]
Đặt $BC=a$, $CA=b$, $AB=c$.
Xét $\triangle ABC$ có $BE$ là phân giác của $\widehat{ABC}$ ($E\in AC$)
nên $\dfrac{CE}{EA}=\dfrac{BC}{BA}=\dfrac{a}{c}$ (tính chất đường phân giác),
suy ra $\dfrac{CE}{CA}=\dfrac{a}{a+c}$, tức $CE=\dfrac{ab}{a+c}$.
Vì $E\in AC$ nên $\widehat{BCE}=\widehat{BCA}$,
do đó $CO$ là phân giác của $\widehat{BCE}$ ($O\in BE$).
Xét $\triangle BCE$ có $CO$ là phân giác của $\widehat{BCE}$
nên $\dfrac{BO}{OE}=\dfrac{CB}{CE}=a:\dfrac{ab}{a+c}=\dfrac{a+c}{b}$ (tính chất đường phân giác).
Suy ra $\dfrac{BO}{BO+OE}=\dfrac{a+c}{a+b+c}$,
tức $\dfrac{BO}{BE}=\dfrac{a+c}{a+b+c}$ ($O$ nằm giữa $B$ và $E$). (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $CF$ là phân giác của $\widehat{ACB}$ ($F\in AB$)
nên $\dfrac{BF}{FA}=\dfrac{CB}{CA}=\dfrac{a}{b}$ (tính chất đường phân giác),
suy ra $\dfrac{BF}{BA}=\dfrac{a}{a+b}$, tức $BF=\dfrac{ac}{a+b}$.
Vì $F\in AB$ nên $\widehat{CBF}=\widehat{CBA}$,
do đó $BO$ là phân giác của $\widehat{CBF}$ ($O\in CF$).
Xét $\triangle CBF$ có $BO$ là phân giác của $\widehat{CBF}$
nên $\dfrac{CO}{OF}=\dfrac{BC}{BF}=a:\dfrac{ac}{a+b}=\dfrac{a+b}{c}$ (tính chất đường phân giác).
Suy ra $\dfrac{CO}{CF}=\dfrac{a+b}{a+b+c}$ ($O$ nằm giữa $C$ và $F$). (2)
[[so-do:n3]]
Từ (1), (2) và giả thiết $\dfrac{BO}{BE}\cdot\dfrac{CO}{CF}=\dfrac12$
ta có $\dfrac{(a+c)(a+b)}{(a+b+c)^2}=\dfrac12$.
[[so-do:n4]]
Suy ra $2(a+b)(a+c)=(a+b+c)^2$,
tức $2a^2+2ab+2ac+2bc=a^2+b^2+c^2+2ab+2ac+2bc$,
nên $a^2=b^2+c^2$.
[[so-do:n5]]
Xét $\triangle ABC$ có $BC^2=AB^2+AC^2$
nên $\triangle ABC$ vuông tại $A$ (định lí Pythagore đảo).
**hinh:** VHB2-226.png
**nghi_van:** (Soát) Đề và lời giải TRÙNG với NDT-H3.26 cùng lô (chỉ đổi tên $BE$, $CF$, $O$ thành $BD$, $CE$, $I$) — chọn giữ một bài, bài kia ghi `TRUNG`.

### VHB2-227 → DE_SAU (HH00132)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT227*@p088 (giải p204)
**noi_dung:**
Tính diện tích tam giác $ABC$, biết rằng $AB=14$ cm, $AC=35$ cm, đường phân giác $AD$ bằng $12$ cm.
**ly_do:** đề hỏi diện tích. Sách kẻ $DE\parallel AB$ ($E\in AC$): $\dfrac{EA}{EC}=\dfrac{BD}{DC}=\dfrac{AB}{AC}$ cho $EA=ED=10$ cm, tính đường cao $EH=8$ cm của tam giác cân $ADE$ rồi suy ra diện tích $ADE$, $ADC$, $ABC$ ($=235{,}2$ cm vuông) bằng công thức diện tích và tỉ số diện tích — cần bài công thức diện tích (HH00132), không thoát được bằng Thalès (đã kiểm số: $S=235{,}2$).

### VHB2-228 → HH00128
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §15 BT228@p088 (giải p204–205)
**sach:** Ý a: tính chất đường phân giác cho $CD=\dfrac{ab}{a+c}$, $BE=\dfrac{ac}{a+b}$ rồi so sánh phân thức. Ý b: hình bình hành $BEKD$ đổi $BE$ thành $DK$ và góc $B_2$ thành $K_2$, so sánh hai góc của $\triangle ECK$. Ý c: thay $EK=BD$. Phần "Nhận xét" của sách không đưa vào. Kho bổ sung phần chứng minh vị trí ($D$ nằm trong $\triangle ECK$) mà sách bỏ qua.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ có $BC=a$, $AC=b$, $AB=c$ ($b>c$), các đường phân giác $BD$, $CE$ ($D\in AC$, $E\in AB$).
**hinh:** VHB2-228.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Tính các độ dài $CD$, $BE$ rồi suy ra $CD>BE$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hai phân giác $BD$, $CE$ chia $AC$, $AB$ theo tỉ lệ cho hai phân thức theo $a$, $b$, $c$; so sánh chúng bằng cách bắc cầu qua một phân thức có cùng tử với phân thức này và cùng mẫu với phân thức kia.
**Bước 1.** Viết tính chất đường phân giác của $BD$ trong $\triangle ABC$ để có $\dfrac{DA}{DC}$, rồi rút $CD$ theo $a$, $b$, $c$.
**Bước 2.** Viết tính chất đường phân giác của $CE$ để có $\dfrac{EA}{EB}$, rồi rút $BE$.
**Bước 3.** Lập phân thức trung gian $\dfrac{ac}{a+c}$ để so sánh từng bước bằng giả thiết $b>c$ và bất đẳng thức giữa hai mẫu.
**Chú ý:** So hai phân thức dương: cùng mẫu thì tử lớn hơn là lớn hơn, cùng tử thì mẫu nhỏ hơn là lớn hơn.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $BD$ là phân giác của $\widehat{ABC}$ ($D\in AC$)
nên $\dfrac{DA}{DC}=\dfrac{BA}{BC}=\dfrac{c}{a}$ (tính chất đường phân giác),
suy ra $\dfrac{DC}{AC}=\dfrac{a}{a+c}$, do đó $CD=\dfrac{ab}{a+c}$.
Xét $\triangle ABC$ có $CE$ là phân giác của $\widehat{ACB}$ ($E\in AB$)
nên $\dfrac{EA}{EB}=\dfrac{CA}{CB}=\dfrac{b}{a}$ (tính chất đường phân giác),
suy ra $\dfrac{EB}{AB}=\dfrac{a}{a+b}$, do đó $BE=\dfrac{ac}{a+b}$.
Vì $b>c$ nên $\dfrac{ab}{a+c}>\dfrac{ac}{a+c}$ (cùng mẫu dương, tử lớn hơn).
Vì $a+c<a+b$ nên $\dfrac{ac}{a+c}>\dfrac{ac}{a+b}$ (cùng tử dương, mẫu nhỏ hơn).
Do đó $\dfrac{ab}{a+c}>\dfrac{ac}{a+b}$, tức $CD>BE$.
Vậy $CD=\dfrac{ab}{a+c}$, $BE=\dfrac{ac}{a+b}$ và $CD>BE$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Dựng điểm $K$ sao cho $BEKD$ là hình bình hành. Chứng minh rằng $CE>EK$.
**da_biet:** Biết $CD>BE$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hình bình hành $BEKD$ đổi $BE$ thành $DK$ và đổi góc $\widehat{EBD}$ (một nửa góc $B$) thành góc $\widehat{EKD}$. Trong $\triangle ECK$ so sánh $\widehat{EKC}$ với $\widehat{ECK}$ bằng cách cộng hai bất đẳng thức góc (một từ $CD>DK$, một từ $\widehat{B}>\widehat{C}$), rồi đổi sang so sánh cạnh đối diện.

- n1 | - | $DK=BE$ và $\widehat{EKD}=\dfrac12\widehat{ABC}$ | gt | $BEKD$ là hình bình hành, $BD$ là phân giác của $\widehat{ABC}$
- n2 | - | $\widehat{DKC}>\widehat{DCK}$ | n1, gt | $CD>BE=DK$; trong $\triangle CDK$ góc đối diện cạnh lớn hơn thì lớn hơn
- n3 | - | $\widehat{EKD}>\widehat{ECD}$ | n1, gt | $AC>AB$ nên $\widehat{ABC}>\widehat{ACB}$, mà $\widehat{ECD}=\dfrac12\widehat{ACB}$
- n4 | - | $D$ nằm trong tam giác $ECK$ | n1, gt | $P=EK\cap AC$ nằm giữa $A$, $D$ (Thalès) và giữa $E$, $K$
- n5 | - | $\widehat{EKC}>\widehat{ECK}$ | n2, n3, n4 | cộng theo vế hai bất đẳng thức góc
- n6 | - | $CE>EK$ | n5 | trong $\triangle ECK$ cạnh đối diện góc lớn hơn thì lớn hơn

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $BEKD$ là hình bình hành
nên $DK=BE$, $EK=BD$, $EK\parallel BD$ và $DK\parallel BE$ (tính chất hình bình hành),
đồng thời $\widehat{EKD}=\widehat{EBD}$ (hai góc đối).
Mà $E$ thuộc tia $BA$ nên $\widehat{EBD}=\widehat{ABD}$.
Vì $BD$ là phân giác của $\widehat{ABC}$ (gt) nên $\widehat{ABD}=\dfrac12\widehat{ABC}$.
Vậy $\widehat{EKD}=\dfrac12\widehat{ABC}$. (1)
[[so-do:n2]]
Vì $DK\parallel AB$ nên $K$ không thuộc đường thẳng $AC$, do đó $C$, $D$, $K$ là ba đỉnh của một tam giác.
Từ $CD>BE$ (ý a) và $BE=DK$ ta có $CD>DK$.
Xét $\triangle CDK$ có $CD>DK$
nên $\widehat{DKC}>\widehat{DCK}$ (góc đối diện cạnh lớn hơn thì lớn hơn). (2)
[[so-do:n3]]
Vì $AC>AB$ (gt, $b>c$)
nên $\widehat{ABC}>\widehat{ACB}$ (góc đối diện cạnh lớn hơn thì lớn hơn).
Mà $\widehat{ECD}=\widehat{ECA}=\dfrac12\widehat{ACB}$ ($D$ thuộc tia $CA$, $CE$ là phân giác của $\widehat{ACB}$).
Từ (1) suy ra $\widehat{EKD}>\widehat{ECD}$. (3)
[[so-do:n4]]
Vì $EK\parallel BD$ nên đường thẳng $EK$ cắt $AD$ tại $P$ nằm giữa $A$ và $D$,
và $\dfrac{EP}{BD}=\dfrac{AE}{AB}<1$ (hệ quả của định lí Thalès cho $\triangle ABD$).
Mà $EK=BD$ nên $EP<EK$.
Vì $DK\parallel AB$ nên $K$ và $D$ cùng phía đối với đường thẳng $AB$,
mà $P$ thuộc tia $AD$ nên $P$ cũng cùng phía đó,
do đó $P$ và $K$ nằm cùng một phía đối với $E$ trên đường thẳng $EK$.
Suy ra $P$ nằm giữa $E$ và $K$.
Lại có $P$ nằm giữa $A$ và $D$, $D$ nằm giữa $A$ và $C$ nên $D$ nằm giữa $P$ và $C$.
Vậy $D$ thuộc đoạn $PC$ với $P$ thuộc cạnh $EK$ của $\triangle ECK$,
nên $D$ nằm trong tam giác $ECK$.
[[so-do:n5]]
Vì $D$ nằm trong $\triangle ECK$ nên tia $KD$ nằm trong $\widehat{EKC}$ và tia $CD$ nằm trong $\widehat{ECK}$.
Do đó $\widehat{EKC}=\widehat{EKD}+\widehat{DKC}$ và $\widehat{ECK}=\widehat{ECD}+\widehat{DCK}$.
Từ (2) và (3) suy ra $\widehat{EKC}>\widehat{ECK}$.
[[so-do:n6]]
Xét $\triangle ECK$ có $\widehat{EKC}>\widehat{ECK}$
nên $CE>EK$ (cạnh đối diện góc lớn hơn thì lớn hơn).
**hinh_lg:** VHB2-228_b_lg.png
#### y c
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $CE>BD$.
**da_biet:** Biết $K$ là điểm sao cho $BEKD$ là hình bình hành và $CE>EK$ (ý b).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Trong hình bình hành $BEKD$ hai cạnh đối $EK$ và $BD$ bằng nhau nên thay $EK$ bằng $BD$ trong kết quả của ý b.

- n1 | - | $EK=BD$ | gt | $BEKD$ là hình bình hành, hai cạnh đối bằng nhau
- n2 | - | $CE>BD$ | n1, gt | thay $EK=BD$ vào $CE>EK$ (ý b)

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $BEKD$ là hình bình hành nên $EK=BD$ (hai cạnh đối).
[[so-do:n2]]
Mà $CE>EK$ (ý b)
nên $CE>BD$.
**hinh_lg:** VHB2-228_c_lg.png
**nghi_van:**
