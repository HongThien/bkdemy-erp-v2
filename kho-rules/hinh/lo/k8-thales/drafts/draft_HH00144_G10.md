### VN1 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $AD$, $BE$, $CF$ lần lượt là các đường phân giác của góc $A$, $B$, $C$ ($D\in BC$, $E\in AC$, $F\in AB$).
a) Chứng minh $\dfrac{CD}{DB}=\dfrac{AC}{AB}$.
b) Chứng minh $\dfrac{AE}{EC}\cdot\dfrac{CD}{DB}\cdot\dfrac{BF}{FA}=1$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $\dfrac{CD}{DB}=\dfrac{AC}{AB}$
$\Uparrow$ (tính chất đường phân giác, đảo hai tỉ số)
$AD$ là phân giác của $\widehat{BAC}$ ✓ (gt) · $D\in BC$ ✓ (gt)

b) $\dfrac{AE}{EC}\cdot\dfrac{CD}{DB}\cdot\dfrac{BF}{FA}=1$
$\Uparrow$ (thay ba tỉ số, rồi rút gọn)
$\dfrac{AE}{EC}=\dfrac{AB}{BC}$ · $\dfrac{BF}{FA}=\dfrac{BC}{AC}$ · $\dfrac{CD}{DB}=\dfrac{AC}{AB}$ ✓ (câu a)
**Nhánh ①:** $\dfrac{AE}{EC}=\dfrac{AB}{BC}$
$\Uparrow$ (tính chất đường phân giác)
$BE$ là phân giác của $\widehat{ABC}$ ✓ (gt) · $E\in AC$ ✓ (gt)
**Nhánh ②:** $\dfrac{BF}{FA}=\dfrac{BC}{AC}$
$\Uparrow$ (tính chất đường phân giác, đảo hai tỉ số)
$CF$ là phân giác của $\widehat{ACB}$ ✓ (gt) · $F\in AB$ ✓ (gt)

**Phần 2. Trình bày**
a) Vì $AD$ là phân giác của $\widehat{BAC}$ (gt), $D\in BC$ (gt)
nên $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Suy ra $\dfrac{CD}{DB}=\dfrac{AC}{AB}$ (đảo hai tỉ số).

b) Vì $BE$ là phân giác của $\widehat{ABC}$ (gt), $E\in AC$ (gt)
nên $\dfrac{EA}{EC}=\dfrac{BA}{BC}$ (tính chất đường phân giác). (1)
Vì $CF$ là phân giác của $\widehat{ACB}$ (gt), $F\in AB$ (gt)
nên $\dfrac{FA}{FB}=\dfrac{CA}{CB}$ (tính chất đường phân giác).
Suy ra $\dfrac{BF}{FA}=\dfrac{CB}{CA}$ (đảo hai tỉ số). (2)
Mặt khác $\dfrac{CD}{DB}=\dfrac{AC}{AB}$ (câu a). (3)
Nhân (1), (2), (3) vế theo vế, ta được:
$\dfrac{AE}{EC}\cdot\dfrac{BF}{FA}\cdot\dfrac{CD}{DB}=\dfrac{AB}{BC}\cdot\dfrac{BC}{AC}\cdot\dfrac{AC}{AB}=1$ (rút gọn).
Vậy $\dfrac{AE}{EC}\cdot\dfrac{CD}{DB}\cdot\dfrac{BF}{FA}=1$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ (A ở đỉnh trên, B trái dưới, C phải dưới), ba đường phân giác $AD$ ($D\in BC$), $BE$ ($E\in AC$), $CF$ ($F\in AB$) vẽ đúng phân giác bằng toạ độ (đồng quy tại tâm nội tiếp); đánh dấu các cặp góc bằng nhau do phân giác (1 cung ở A, 2 cung ở B, 3 cung ở C). Không vẽ điều phải chứng minh.
Đề: thêm "$D\in BC$, $E\in AC$, $F\in AB$" cho tự đủ dữ kiện; không có lỗi in. Tài liệu (t-19) viết "Bài 2. Bài 2." — thừa chữ, bỏ.
Verify (kiem_G10.mjs): 3 tam giác bất kì, kiểm D,E,F nằm đúng cạnh, từng góc phân giác bằng nhau, $CD/DB=AC/AB$, $AE/EC=AB/BC$, $BF/FA=BC/AC$, tích bằng 1 — PASS hết.
Công cụ: chỉ "tính chất đường phân giác" (whitelist HH00144); không dùng gì ngoài.
**hinh:** VN1.png

### VN2 → HH00144
**loai_cau:** tra_loi_ngan
**dap_an:** IM=2; IN=1,5
**noi_dung:**
Cho hình vuông $ABCD$.
Điểm $M$, $N$ lần lượt thuộc các đoạn thẳng $AB$ và $BC$ sao cho $\dfrac{BM}{BN}=\dfrac43$.
Đoạn thẳng $BD$ cắt $MN$ tại $I$.
Tính độ dài các đoạn thẳng $IM$, $IN$ biết $MN=3{,}5$ cm.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $BD$ là phân giác của góc $B$ trong $\triangle BMN$
nên $I$ chia $MN$ thành hai đoạn tỉ lệ với hai cạnh kề $BM$, $BN$.

**Bước 1.** Nhận ra tia phân giác.
$BD$ là đường chéo hình vuông nên là phân giác của $\widehat{ABC}$.
Mà $M\in AB$, $N\in BC$ nên $BI$ là phân giác của $\widehat{MBN}$ trong $\triangle BMN$.

**Bước 2.** Viết tỉ lệ theo tính chất đường phân giác.
$\dfrac{IM}{IN}=\dfrac{BM}{BN}=\dfrac43$.

**Bước 3.** Đổi tỉ số thành tổng hai đoạn.
Từ $\dfrac{IM}{4}=\dfrac{IN}{3}$, dùng dãy tỉ số bằng nhau:
$\dfrac{IM}{4}=\dfrac{IN}{3}=\dfrac{IM+IN}{7}$.

**Bước 4.** Dùng độ dài đã cho.
$I$ nằm giữa $M$ và $N$ nên $IM+IN=MN=3{,}5$ cm.
Tính tỉ số chung rồi suy ra từng đoạn.

**Chú ý:** tỉ số $\dfrac{BM}{BN}$ là tỉ số hai cạnh kề của góc $B$.
Phải nêu rõ $BI$ là phân giác của $\widehat{MBN}$ trước khi dùng tính chất.

**Phần 2. Trình bày**
Vì $ABCD$ là hình vuông (gt)
nên $BD$ là phân giác của $\widehat{ABC}$ (tính chất đường chéo hình vuông).
Mà $M\in AB$, $N\in BC$ (gt)
nên $BI$ là phân giác của $\widehat{MBN}$.
Xét $\triangle BMN$ có:
$BI$ là phân giác của $\widehat{MBN}$ (cmt);
$I\in MN$ (gt)
nên $\dfrac{IM}{IN}=\dfrac{BM}{BN}$ (tính chất đường phân giác).
Mà $\dfrac{BM}{BN}=\dfrac43$ (gt) nên $\dfrac{IM}{4}=\dfrac{IN}{3}$.
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{IM}{4}=\dfrac{IN}{3}=\dfrac{IM+IN}{4+3}$.
Vì $I$ nằm giữa $M$ và $N$
nên $IM+IN=MN=3{,}5$ cm (gt).
Do đó $\dfrac{IM}{4}=\dfrac{IN}{3}=\dfrac{3{,}5}{7}=0{,}5$.
Suy ra $IM=4\cdot0{,}5=2$ (cm); $IN=3\cdot0{,}5=1{,}5$ (cm).
Vậy $IM=2$ cm, $IN=1{,}5$ cm.
**cấu hình hình / nghi vấn:**
Hình: hình vuông $ABCD$ (A trên-trái, B trên-phải, C dưới-phải, D dưới-trái), $M\in AB$, $N\in BC$ dựng đúng $BM:BN=4:3$ ($BM=180$, $BN=135$ trên hình), đường chéo $BD$, đoạn $MN$ cắt $BD$ tại $I$; đánh dấu bốn cạnh bằng nhau + bốn góc vuông (đều là dữ kiện "hình vuông"). Không ghi $MN$ hay đáp số lên hình.
Đề: tài liệu (t-19, Bài 3) không có hình, không lỗi in; $MN=3{,}5$ cm ghi trong đề. Tài liệu in phân số $BM/BN=4/3$ — đúng như đề.
Verify (kiem_G10.mjs): 3 cỡ hình vuông / 3 cặp ($BM$,$BN$) — kiểm $M\in AB$, $N\in BC$, $I\in MN\cap BD$, $\widehat{ABD}=\widehat{DBC}=45^\circ$, $IM/IN=4/3$, quy về $MN=3{,}5$: $IM=2$, $IN=1{,}5$ — PASS hết, khớp `dap_an`.
Công cụ: tính chất đường chéo hình vuông (chương Tứ giác) + tính chất đường phân giác + dãy tỉ số bằng nhau (lớp 7) — đều trong whitelist.
**hinh:** VN2.png

### VN3 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thoi $ABCD$.
Trên cạnh $BC$, $BA$ lần lượt lấy điểm $E$ và $F$ sao cho $\dfrac{BF}{BE}=\dfrac45$.
Đoạn thẳng $FE$ cắt đoạn thẳng $BD$ tại $I$.
a) Tính $\dfrac{IE}{IF}$.
b) Giả sử $FE=18$ cm. Tính độ dài các đoạn $IE$, $IF$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $BD$ là phân giác của góc $B$ trong $\triangle BFE$
nên $\dfrac{IF}{IE}=\dfrac{BF}{BE}$.

**Bước 1.** Nhận ra tia phân giác.
$BD$ là đường chéo hình thoi nên là phân giác của $\widehat{ABC}$.
Mà $F\in BA$, $E\in BC$ nên $BI$ là phân giác của $\widehat{FBE}$ trong $\triangle BFE$.

**Bước 2.** Viết tỉ lệ theo tính chất đường phân giác (ý a).
$\dfrac{IF}{IE}=\dfrac{BF}{BE}=\dfrac45$.
Đảo hai tỉ số để được $\dfrac{IE}{IF}$.

**Bước 3.** Đổi tỉ số thành tổng hai đoạn (ý b).
Từ $\dfrac{IE}{5}=\dfrac{IF}{4}$, dùng dãy tỉ số bằng nhau:
$\dfrac{IE}{5}=\dfrac{IF}{4}=\dfrac{IE+IF}{9}$.

**Bước 4.** Dùng độ dài đã cho.
$I$ nằm giữa $F$ và $E$ nên $IE+IF=FE=18$ cm.
Tính tỉ số chung rồi suy ra $IE$, $IF$.

**Chú ý:** đề cho $\dfrac{BF}{BE}=\dfrac45$ (đỉnh $F$ đứng trước)
nên tỉ số tìm được là $\dfrac{IF}{IE}$, còn câu hỏi là $\dfrac{IE}{IF}$: phải đảo lại.

**Phần 2. Trình bày**
a) Vì $ABCD$ là hình thoi (gt)
nên $BD$ là phân giác của $\widehat{ABC}$ (tính chất đường chéo hình thoi).
Mà $F\in BA$, $E\in BC$ (gt)
nên $BI$ là phân giác của $\widehat{FBE}$.
Xét $\triangle BFE$ có:
$BI$ là phân giác của $\widehat{FBE}$ (cmt);
$I\in FE$ (gt)
nên $\dfrac{IF}{IE}=\dfrac{BF}{BE}$ (tính chất đường phân giác).
Mà $\dfrac{BF}{BE}=\dfrac45$ (gt) nên $\dfrac{IF}{IE}=\dfrac45$.
Vậy $\dfrac{IE}{IF}=\dfrac54$.

b) Theo câu a) $\dfrac{IF}{IE}=\dfrac45$ nên $\dfrac{IE}{5}=\dfrac{IF}{4}$.
Áp dụng tính chất dãy tỉ số bằng nhau:
$\dfrac{IE}{5}=\dfrac{IF}{4}=\dfrac{IE+IF}{5+4}$.
Vì $I$ nằm giữa $F$ và $E$
nên $IE+IF=FE=18$ cm (gt).
Do đó $\dfrac{IE}{5}=\dfrac{IF}{4}=\dfrac{18}{9}=2$.
Suy ra $IE=5\cdot2=10$ (cm); $IF=4\cdot2=8$ (cm).
Vậy $IE=10$ cm, $IF=8$ cm.
**cấu hình hình / nghi vấn:**
Hình: hình thoi $ABCD$ (B ở trái, A phía trên-phải, C phía dưới-phải, D đỉnh đối B), bốn cạnh bằng nhau (đánh dấu 1 gạch) — dựng đúng $|BA|=|BC|=230$; $F\in BA$ với $BF=92$, $E\in BC$ với $BE=115$ (tỉ lệ $4:5$); đường chéo $BD$, đoạn $FE$ cắt $BD$ tại $I$. Không ghi $FE=18$ hay đáp số lên hình.
Đề: tài liệu (t-19, Bài 4) không có hình; $BF/BE=4/5$ và "Giả sử $FE=18$ cm" chép đúng, không lỗi in.
Verify (kiem_G10.mjs): 3 hình thoi khác nhau (góc $B$ khác nhau) — kiểm bốn cạnh bằng nhau, $BD$ phân giác góc $B$, $BF/BE=4/5$, $I\in FE\cap BD$, $IF/IE=4/5$, $IE/IF=5/4$, quy về $FE=18$: $IE=10$, $IF=8$ — PASS hết.
Công cụ: tính chất đường chéo hình thoi (chương Tứ giác) + tính chất đường phân giác + dãy tỉ số bằng nhau — trong whitelist.
**hinh:** VN3.png

### VN4 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ ($AB<AC$), tia phân giác góc $A$ cắt cạnh $BC$ tại $D$.
Gọi $M$ là trung điểm cạnh $BC$.
Qua $M$ kẻ đường thẳng song song với $AD$, đường thẳng này cắt tia đối của tia $AB$ tại $E$ và cắt cạnh $AC$ tại $F$.
Chứng minh $BE=FC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$BE=FC$
$\Uparrow$ (hai phân số bằng nhau, mẫu bằng nhau thì tử bằng nhau)
$\dfrac{BE}{BM}=\dfrac{FC}{CM}$ · $BM=CM$ ✓ ($M$ là trung điểm của $BC$)
**Nhánh ①:** $\dfrac{BE}{BM}=\dfrac{FC}{CM}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AB}{BD}$ và $\dfrac{AC}{CD}$)
$\dfrac{BE}{BM}=\dfrac{AB}{BD}$ · $\dfrac{AB}{BD}=\dfrac{AC}{CD}$ · $\dfrac{AC}{CD}=\dfrac{FC}{CM}$
**Nhánh ①.1:** $\dfrac{BE}{BM}=\dfrac{AB}{BD}$
$\Uparrow$ (tính chất tỉ lệ thức)
$\dfrac{AB}{BE}=\dfrac{BD}{BM}$
$\Uparrow$ (định lí Thalès trong $\triangle BEM$)
$AD\parallel EM$ ✓ (gt) · $A\in BE$ ✓ · $D\in BM$ ✓ (vì $AB<AC$ nên $BD<DC$)
**Nhánh ①.2:** $\dfrac{AB}{BD}=\dfrac{AC}{CD}$
$\Uparrow$ (tính chất tỉ lệ thức)
$\dfrac{BD}{CD}=\dfrac{AB}{AC}$
$\Uparrow$ (tính chất đường phân giác)
$AD$ là phân giác của $\widehat{BAC}$ ✓ (gt) · $D\in BC$ ✓ (gt)
**Nhánh ①.3:** $\dfrac{AC}{CD}=\dfrac{FC}{CM}$
$\Uparrow$ (tính chất tỉ lệ thức)
$\dfrac{CM}{CD}=\dfrac{CF}{CA}$
$\Uparrow$ (định lí Thalès trong $\triangle CAD$)
$MF\parallel AD$ ✓ (gt) · $M\in CD$ ✓ (vì $BD<BM$) · $F\in CA$ ✓ (gt)

**Phần 2. Trình bày**
Vì $AD$ là phân giác của $\widehat{BAC}$ (gt), $D\in BC$ (gt)
nên $\dfrac{BD}{CD}=\dfrac{AB}{AC}$ (tính chất đường phân giác).
Suy ra $\dfrac{AB}{BD}=\dfrac{AC}{CD}$ (tính chất tỉ lệ thức). (1)
Mà $AB<AC$ (gt) nên $\dfrac{BD}{CD}<1$, tức là $BD<CD$.
Lại có $BD+CD=BC=2BM$ ($M$ là trung điểm của $BC$)
nên $BD<BM$.
Do đó $D$ nằm giữa $B$ và $M$, còn $M$ nằm giữa $D$ và $C$.
Vì $E$ thuộc tia đối của tia $AB$ (gt)
nên $A$ nằm giữa $B$ và $E$.
Xét $\triangle BEM$ có:
$A\in BE$, $D\in BM$ (cmt);
$AD\parallel EM$ (gt)
nên $\dfrac{AB}{BE}=\dfrac{BD}{BM}$ (định lí Thalès).
Suy ra $\dfrac{BE}{BM}=\dfrac{AB}{BD}$ (tính chất tỉ lệ thức). (2)
Xét $\triangle CAD$ có:
$M\in CD$ (cmt), $F\in CA$ (gt);
$MF\parallel AD$ (gt)
nên $\dfrac{CM}{CD}=\dfrac{CF}{CA}$ (định lí Thalès).
Suy ra $\dfrac{AC}{CD}=\dfrac{CF}{CM}$ (tính chất tỉ lệ thức). (3)
Từ (2), (1), (3) ta có:
$\dfrac{BE}{BM}=\dfrac{AB}{BD}=\dfrac{AC}{CD}=\dfrac{CF}{CM}$.
Mà $BM=CM$ ($M$ là trung điểm của $BC$)
nên $BE=CF$ (hai phân số bằng nhau, mẫu bằng nhau thì tử bằng nhau).
Vậy $BE=FC$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ ($B$ trái, $C$ phải, $AB<AC$), phân giác $AD$ ($D\in BC$, vẽ đúng phân giác), $M$ trung điểm $BC$ (đánh dấu 1 gạch $BM$, $MC$), đường thẳng qua $M$ song song $AD$ (dựng đúng) cắt đường thẳng $AB$ tại $E$ nằm phía ngoài, sau $A$ (tia đối của tia $AB$), cắt cạnh $AC$ tại $F$. Không đánh dấu $BE=FC$. Thứ tự trên $BC$ như đề kéo theo: $B, D, M, C$ (vì $AB<AC$ nên $BD<DC$).
Đề: tài liệu (t-19, Bài 5) không có hình; không lỗi in.
Verify (kiem_G10.mjs): 3 tam giác bất kì có $AB<AC$ — kiểm $ME\parallel AD$, $MF\parallel AD$, $A$ nằm giữa $B$ và $E$, $F\in$ cạnh $AC$, thứ tự $B,D,M,C$, $BD/DC=AB/AC$, $AB/BE=BD/BM$, $CM/CD=CF/CA$, các tỉ số chuỗi $(2),(1),(3)$ và $BE=CF$ — PASS hết.
Công cụ: chỉ tính chất đường phân giác + định lí Thalès + tính chất tỉ lệ thức (lớp 7) — đều trong whitelist, không dùng đồng dạng / đường trung bình. Lời giải đòi hỏi bước xác định thứ tự điểm $D, M$ (dùng $AB<AC$) để áp dụng Thalès đúng chỗ.
Cách khác không dùng: chứng minh $AE=AF$ (tam giác cân nhờ góc đồng vị / so le trong) rồi tính — dài hơn, không dùng.
**hinh:** VN4.png
