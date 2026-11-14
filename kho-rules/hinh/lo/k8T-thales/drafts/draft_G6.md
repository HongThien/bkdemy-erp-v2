### NDT-H3.15 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.15@p170 · tầng nâng cao
**sach:** Chương III §2 bài 15. Ý a: hai lần hệ quả Thalès (ME ∥ AC, EN ∥ BC) rồi Thalès đảo trong tam giác DAB. Ý b: gọi F = AC ∩ BD, chứng minh AF = AC, rồi hai hệ quả Thalès trong tam giác DAC và DAF.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$ cân tại $A$. Đường thẳng vuông góc với $BC$ tại $B$ cắt đường thẳng vuông góc với $AC$ tại $C$ ở $D$. Vẽ $BE\perp CD$ tại $E$, gọi $M$ là giao điểm của $AD$ và $BE$. Vẽ $EN\perp BD$ tại $N$.
**hinh:** NDT-H3-15.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $MN\parallel AB$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hai lần hệ quả Thalès ($ME\parallel AC$ trong $\triangle DAC$, $NE\parallel BC$ trong $\triangle DBC$) cho hai tỉ số cùng bằng $\dfrac{DE}{DC}$, rồi Thalès đảo trong $\triangle DAB$.

- n1 | - | $\dfrac{DM}{DA}=\dfrac{DE}{DC}$ | gt | $ME\parallel AC$ (cùng vuông góc với $CD$), hệ quả của định lí Thalès
- n2 | - | $\dfrac{DN}{DB}=\dfrac{DE}{DC}$ | gt | $NE\parallel BC$ (cùng vuông góc với $BD$), hệ quả của định lí Thalès
- n3 | - | $MN\parallel AB$ | n1, n2 | định lí Thalès đảo cho $\triangle DAB$

**Phần 2. Trình bày**

[[so-do:n1]]
Vì $BE\perp CD$ (gt) và $AC\perp CD$ (gt)
nên $BE\parallel AC$ (cùng vuông góc với $CD$).
Mà $M\in BE$ nên $ME\parallel AC$.
Xét $\triangle DAC$ có $ME\parallel AC$ ($M\in DA$, $E\in DC$)
nên $\dfrac{DM}{DA}=\dfrac{DE}{DC}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Vì $EN\perp BD$ (gt) và $BC\perp BD$ (gt)
nên $EN\parallel BC$ (cùng vuông góc với $BD$).
Xét $\triangle DBC$ có $NE\parallel BC$ ($N\in DB$, $E\in DC$)
nên $\dfrac{DN}{DB}=\dfrac{DE}{DC}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $\dfrac{DM}{DA}=\dfrac{DN}{DB}$.
Xét $\triangle DAB$ có $M\in DA$, $N\in DB$ và $\dfrac{DM}{DA}=\dfrac{DN}{DB}$
nên $MN\parallel AB$ (định lí Thalès đảo).
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh $M$ là trung điểm của $BE$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ đường phụ $F=AC\cap BD$ để có $AF=AC$ (trung tuyến ứng với cạnh huyền), rồi hai hệ quả Thalès trong $\triangle DAC$ và $\triangle DAF$ cùng cho tỉ số $\dfrac{DM}{DA}$.

- n1 | - | $AF=AC$ | gt | $A$ là trung điểm cạnh huyền $FC$ của $\triangle FBC$ vuông tại $B$ ($AB=AC$)
- n2 | - | $\dfrac{ME}{AC}=\dfrac{MB}{AF}$ | gt | $BE\parallel AC$, hệ quả của định lí Thalès cho $\triangle DAC$ và $\triangle DAF$
- n3 | - | $M$ là trung điểm của $BE$ | n1, n2 | $ME=MB$ và $M\in BE$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $F$ là giao điểm của $AC$ và $BD$.
Vì $BD\perp BC$ (gt) nên $\triangle FBC$ vuông tại $B$.
Gọi $I$ là trung điểm của $FC$.
Khi đó $IB=IC$ (trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền).
Lại có $AB=AC$ (gt).
Vậy $A$ và $I$ cùng nằm trên đường trung trực của $BC$.
Hai điểm này cùng nằm trên đường thẳng $FC$,
mà $FC$ không vuông góc với $BC$ nên cắt trung trực của $BC$ tại một điểm duy nhất.
Do đó $A\equiv I$, tức $A$ là trung điểm của $FC$ và $AF=AC$. (1)
[[so-do:n2]]
Vì $BE\perp CD$ (gt) và $AC\perp CD$ (gt)
nên $BE\parallel AC$ (cùng vuông góc với $CD$).
Mà $M\in BE$, $F\in AC$ nên $ME\parallel AC$ và $MB\parallel AF$.
Xét $\triangle DAC$ có $ME\parallel AC$ ($M\in DA$, $E\in DC$)
nên $\dfrac{ME}{AC}=\dfrac{DM}{DA}$ (hệ quả của định lí Thalès). (2)
Xét $\triangle DAF$ có $MB\parallel AF$ ($M\in DA$, $B\in DF$)
nên $\dfrac{MB}{AF}=\dfrac{DM}{DA}$ (hệ quả của định lí Thalès). (3)
Từ (2) và (3) suy ra $\dfrac{ME}{AC}=\dfrac{MB}{AF}$.
[[so-do:n3]]
Kết hợp với (1) ($AF=AC$) ta được $ME=MB$.
Mà $M$ nằm trên đường thẳng $BE$ nên $M$ là trung điểm của $BE$.
**hinh_lg:** NDT-H3-15_b_lg.png
**nghi_van:** Sách in "$AC\perp BE$" ở ý a; đúng phải là $AC\perp CD$ (cùng suy ra $BE\parallel AC$) — đã sửa. Ở ý b sách tính góc, coi ngầm $A$ nằm giữa $F$ và $C$; kho thay bằng lập luận trung tuyến ứng với cạnh huyền để không phải xét vị trí điểm.

### NDT-H3.16a → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.16a@p171 · tầng nâng cao
**sach:** Ba hệ quả Thalès: $OM\parallel CD$ trong $\triangle ACD$, $ON\parallel CD$ trong $\triangle BCD$, $OM\parallel AB$ trong $\triangle ABD$; ghép thành $OM=ON$ (cùng bằng một tỉ số nhân $CD$).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$), $O$ là giao điểm của $AC$ và $BD$. Đường thẳng qua $O$ song song với $AB$, $CD$ cắt $AD$, $BC$ lần lượt ở $M$, $N$. Chứng minh rằng $OM=ON$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Ba hệ quả Thalès cho $\dfrac{OM}{CD}=\dfrac{AM}{AD}$, $\dfrac{AM}{AD}=\dfrac{BO}{BD}$, $\dfrac{ON}{CD}=\dfrac{BO}{BD}$; hai đoạn cùng bằng $CD$ nhân với cùng một tỉ số.

- n1 | - | $\dfrac{OM}{CD}=\dfrac{AM}{AD}$ | gt | hệ quả của định lí Thalès cho $\triangle ACD$
- n2 | - | $\dfrac{AM}{AD}=\dfrac{BO}{BD}$ | gt | định lí Thalès cho $\triangle ABD$, tính chất tỉ lệ thức
- n3 | - | $\dfrac{ON}{CD}=\dfrac{BO}{BD}$ | gt | hệ quả của định lí Thalès cho $\triangle BCD$
- n4 | - | $OM=ON$ | n1, n2, n3 | cùng bằng $CD$ nhân với cùng một tỉ số

**Phần 2. Trình bày**

[[so-do:n1]]
Xét $\triangle ACD$ có $OM\parallel CD$ ($O\in AC$, $M\in AD$)
nên $\dfrac{OM}{CD}=\dfrac{AM}{AD}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle ABD$ có $OM\parallel AB$ ($M\in AD$, $O\in BD$)
nên $\dfrac{AM}{MD}=\dfrac{BO}{OD}$ (định lí Thalès),
suy ra $\dfrac{AM}{AD}=\dfrac{BO}{BD}$ (tính chất tỉ lệ thức). (2)
[[so-do:n3]]
Xét $\triangle BCD$ có $ON\parallel CD$ ($N\in BC$, $O\in BD$)
nên $\dfrac{ON}{CD}=\dfrac{BO}{BD}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{OM}{CD}=\dfrac{ON}{CD}$.
Vậy $OM=ON$.
**hinh:** NDT-H3-16a.png
**nghi_van:** Sách viết "$\triangle NCD$" ở dòng thứ hai của lời giải; đúng là $\triangle BCD$ — đã sửa.

### NDT-H3.16b → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.16b@p171 · tầng nâng cao
**sach:** Qua $H$ kẻ đường thẳng song song $BC$ cắt $AB$, $DF$, $DE$, $AC$ tại $M$, $N$, $I$, $K$; sáu hệ quả Thalès cho $NH=HI$; tam giác $DNI$ có $DH$ vừa là đường cao vừa là trung tuyến nên cân tại $D$. Giữ cách này.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác nhọn $ABC$, $AD$ là đường cao. $H$ là một điểm trên đoạn thẳng $AD$ ($H$ khác $A$ và $D$). Gọi $E$ là giao điểm của $BH$ và $AC$, $F$ là giao điểm của $CH$ và $AB$. Chứng minh rằng $DA$ là tia phân giác của góc $EDF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $H$ kẻ đường thẳng song song với $BC$ cắt $AB$, $DF$, $DE$, $AC$ tại $M$, $N$, $I$, $K$. Vì $AD\perp NI$ nên chỉ cần $HN=HI$: khi đó $DH$ vừa là đường cao vừa là trung tuyến của $\triangle DNI$, tam giác cân và $DH$ là phân giác.

- n1 | - | $DH\perp NI$ | gt | $NI\parallel BC$ và $AD\perp BC$
- n2 | - | $\dfrac{NH}{DC}=\dfrac{MH}{BC}$ | gt | hệ quả của định lí Thalès cho $\triangle FDC$ và $\triangle FBC$
- n3 | - | $\dfrac{HI}{BD}=\dfrac{HK}{BC}$ | gt | hệ quả của định lí Thalès cho $\triangle EBD$ và $\triangle EBC$
- n4 | - | $MH\cdot DC=HK\cdot BD$ | gt | hệ quả của định lí Thalès cho $\triangle ABD$ và $\triangle ACD$
- n5 | - | $NH=HI$ | n2, n3, n4 | cùng bằng $\dfrac{DC\cdot MH}{BC}$ và $\dfrac{BD\cdot HK}{BC}$
- n6 | - | $DA$ là tia phân giác của $\widehat{EDF}$ | n1, n5 | tam giác có đường cao đồng thời là trung tuyến thì cân

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $H$ kẻ đường thẳng song song với $BC$ cắt $AB$, $DF$, $DE$, $AC$ lần lượt tại $M$, $N$, $I$, $K$.
Vì $NI\parallel BC$ (cách vẽ) và $AD\perp BC$ (gt)
nên $AD\perp NI$, tức $DH\perp NI$. (1)
[[so-do:n2]]
Xét $\triangle FDC$ có $NH\parallel DC$ ($N\in FD$, $H\in FC$)
nên $\dfrac{NH}{DC}=\dfrac{FH}{FC}$ (hệ quả của định lí Thalès).
Xét $\triangle FBC$ có $MH\parallel BC$ ($M\in FB$, $H\in FC$)
nên $\dfrac{MH}{BC}=\dfrac{FH}{FC}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{NH}{DC}=\dfrac{MH}{BC}$. (2)
[[so-do:n3]]
Xét $\triangle EBD$ có $HI\parallel BD$ ($H\in EB$, $I\in ED$)
nên $\dfrac{HI}{BD}=\dfrac{EH}{EB}$ (hệ quả của định lí Thalès).
Xét $\triangle EBC$ có $HK\parallel BC$ ($H\in EB$, $K\in EC$)
nên $\dfrac{HK}{BC}=\dfrac{EH}{EB}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{HI}{BD}=\dfrac{HK}{BC}$. (3)
[[so-do:n4]]
Xét $\triangle ABD$ có $MH\parallel BD$ ($M\in AB$, $H\in AD$)
nên $\dfrac{MH}{BD}=\dfrac{AH}{AD}$ (hệ quả của định lí Thalès).
Xét $\triangle ACD$ có $HK\parallel DC$ ($H\in AD$, $K\in AC$)
nên $\dfrac{HK}{DC}=\dfrac{AH}{AD}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{MH}{BD}=\dfrac{HK}{DC}$, tức $MH\cdot DC=HK\cdot BD$. (4)
[[so-do:n5]]
Từ (2): $NH=\dfrac{DC\cdot MH}{BC}$; từ (3): $HI=\dfrac{BD\cdot HK}{BC}$.
Kết hợp với (4) ta được $NH=HI$. (5)
[[so-do:n6]]
$N\in DF$, $I\in DE$ nằm hai phía của $AD$ nên $H$ nằm giữa $N$ và $I$.
Từ (1) và (5): $DH$ là đường trung trực của $NI$,
nên $DN=DI$, $\triangle DNI$ cân tại $D$ và $DH$ là tia phân giác của $\widehat{NDI}$.
Vậy $\widehat{FDA}=\widehat{EDA}$, tức $DA$ là tia phân giác của $\widehat{EDF}$.
**hinh:** NDT-H3-16b.png
**hinh_lg:** NDT-H3-16b_lg.png
**nghi_van:** Sách gộp (2), (3), (4) thành một phép nhân ba tỉ số; kho tách ra từng bước cho gọn kiểm. Sách không ghi $H$ khác $A$, $D$; đã thêm để $E$, $F$ xác định.

### NDT-H3.17a → HH00131
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.17a@p172 · tầng nâng cao
**sach:** Chứng minh định lí Xê-va bằng hệ quả Thalès: qua $A$ kẻ đường thẳng song song $BC$ cắt $BB'$, $CC'$ tại $E$, $D$; nhân ba tỉ số. Chiều đảo: gọi $A_1$ là giao của $AM$ với $BC$ rồi so tỉ số.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $A'$, $B'$, $C'$ lần lượt nằm trên các cạnh $BC$, $CA$, $AB$ (khác các đỉnh). Chứng minh rằng các đường thẳng $AA'$, $BB'$, $CC'$ đồng quy khi và chỉ khi $\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=1$ (định lí Xê-va).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Chiều thuận: qua $A$ kẻ $d\parallel BC$ cắt $BB'$, $CC'$ tại $E$, $D$; đổi mỗi tỉ số thành tỉ số của $AD$, $AE$, $BC$ rồi nhân, các đoạn triệt tiêu. Chiều đảo: gọi $A_1$ là giao của $AM$ với $BC$, dùng chiều thuận cho $A_1$ rồi so tỉ số.

- n1 | - | $\dfrac{BA'}{CA'}=\dfrac{AE}{AD}$ | gt | hệ quả của định lí Thalès cho $\triangle MBA'$ và $\triangle MCA'$
- n2 | - | $\dfrac{AC'}{BC'}=\dfrac{AD}{BC}$ | gt | hệ quả của định lí Thalès cho $\triangle C'BC$
- n3 | - | $\dfrac{CB'}{AB'}=\dfrac{BC}{AE}$ | gt | hệ quả của định lí Thalès cho $\triangle B'BC$
- n4 | - | tích ba tỉ số bằng $1$ (chiều thuận) | n1, n2, n3 | nhân vế theo vế, $AD$, $AE$, $BC$ triệt tiêu
- n5 | - | $\dfrac{AC'}{BC'}\cdot\dfrac{BA_1}{CA_1}\cdot\dfrac{CB'}{AB'}=1$ | n4, gt | chiều thuận cho $AA_1$, $BB'$, $CC'$ đồng quy tại $M$
- n6 | - | $\dfrac{BA'}{CA'}=\dfrac{BA_1}{CA_1}$ | n5, gt | so sánh với giả thiết tích bằng $1$
- n7 | - | $AA'$, $BB'$, $CC'$ đồng quy (chiều đảo) | n6 | $A'\equiv A_1$

**Phần 2. Trình bày**

[[so-do:n1]]
**Chiều thuận.** Giả sử $AA'$, $BB'$, $CC'$ cắt nhau tại $M$.
Qua $A$ kẻ đường thẳng $d\parallel BC$, cắt $BB'$ tại $E$ và $CC'$ tại $D$.
Xét $\triangle MBA'$ có $AE\parallel BA'$ ($A\in MA'$, $E\in MB$)
nên $\dfrac{MA}{MA'}=\dfrac{AE}{BA'}$ (hệ quả của định lí Thalès). (1)
Xét $\triangle MCA'$ có $AD\parallel CA'$ ($A\in MA'$, $D\in MC$)
nên $\dfrac{MA}{MA'}=\dfrac{AD}{CA'}$ (hệ quả của định lí Thalès). (2)
Từ (1) và (2) suy ra $\dfrac{AE}{BA'}=\dfrac{AD}{CA'}$, hay $\dfrac{BA'}{CA'}=\dfrac{AE}{AD}$. (3)
[[so-do:n2]]
Xét $\triangle C'BC$ có $AD\parallel BC$ ($A\in C'B$, $D\in C'C$)
nên $\dfrac{AC'}{BC'}=\dfrac{AD}{BC}$ (hệ quả của định lí Thalès). (4)
[[so-do:n3]]
Xét $\triangle B'BC$ có $AE\parallel BC$ ($A\in B'C$, $E\in B'B$)
nên $\dfrac{AB'}{CB'}=\dfrac{AE}{BC}$, tức $\dfrac{CB'}{AB'}=\dfrac{BC}{AE}$ (hệ quả của định lí Thalès). (5)
[[so-do:n4]]
Nhân (3), (4), (5) vế theo vế:
$\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=\dfrac{AD}{BC}\cdot\dfrac{AE}{AD}\cdot\dfrac{BC}{AE}=1$.
[[so-do:n5]]
**Chiều đảo.** Giả sử $\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=1$. (6)
Vì $B'$, $C'$ nằm trên các cạnh $CA$, $AB$ nên $BB'$ và $CC'$ cắt nhau tại một điểm $M$ nằm trong tam giác.
Tia $AM$ cắt cạnh $BC$ tại $A_1$.
Ba đường thẳng $AA_1$, $BB'$, $CC'$ đồng quy tại $M$ nên theo chiều thuận:
$\dfrac{AC'}{BC'}\cdot\dfrac{BA_1}{CA_1}\cdot\dfrac{CB'}{AB'}=1$. (7)
[[so-do:n6]]
Từ (6) và (7) suy ra $\dfrac{BA'}{CA'}=\dfrac{BA_1}{CA_1}$.
[[so-do:n7]]
Do đó $\dfrac{BA'+CA'}{CA'}=\dfrac{BA_1+CA_1}{CA_1}$, tức $\dfrac{BC}{CA'}=\dfrac{BC}{CA_1}$
(vì $A'$, $A_1$ đều thuộc đoạn $BC$).
Suy ra $CA'=CA_1$, nên $A'\equiv A_1$.
Vậy $AA'$, $BB'$, $CC'$ đồng quy tại $M$.
**hinh:** NDT-H3-17a.png
**hinh_lg:** NDT-H3-17a_lg.png
**nghi_van:** (1) Đề sách còn cho "hoặc trên các đường thẳng chứa các cạnh"; lập luận của sách (và của kho) chỉ đúng với điểm nằm trong cạnh nên đề đã thu hẹp thành "trên các cạnh (khác đỉnh)". (2) Bài chính là chứng minh định lí Xê-va nên xếp HH00131; lời giải chỉ dùng Thalès nên nếu Thùy muốn giữ ở HH00127 thì đổi mã, không cần sửa lời giải. (3) Hình đề cố ý vẽ ba đường KHÔNG đồng quy (đề chưa cho).

### NDT-H3.17b → HH00131
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.17b@p172 · tầng nâng cao
**sach:** Chứng minh định lí Mê-nê-la-uýt bằng hệ quả Thalès: qua $A$ kẻ $AM\parallel BC$ ($M$ thuộc đường thẳng $A'B'$); hai hệ quả Thalès rồi nhân. Chiều đảo: gọi $A_1$ là giao của $B'C'$ với $BC$ rồi so tỉ số.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $A'$, $B'$ lần lượt nằm trên các cạnh $BC$, $CA$ (khác các đỉnh), điểm $C'$ nằm trên tia đối của tia $AB$. Chứng minh rằng ba điểm $A'$, $B'$, $C'$ thẳng hàng khi và chỉ khi $\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=1$ (định lí Mê-nê-la-uýt).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Chiều thuận: qua $A$ kẻ đường thẳng song song với $BC$ cắt $A'B'$ tại $M$; hai hệ quả Thalès rồi nhân, $AM$, $BA'$, $CA'$ triệt tiêu. Chiều đảo: gọi $A_1$ là giao của $B'C'$ với $BC$, dùng chiều thuận cho $A_1$ rồi so tỉ số.

- n1 | - | $\dfrac{AC'}{BC'}=\dfrac{AM}{BA'}$ | gt | hệ quả của định lí Thalès cho $\triangle C'BA'$
- n2 | - | $\dfrac{CB'}{AB'}=\dfrac{CA'}{AM}$ | gt | hệ quả của định lí Thalès cho $\triangle B'CA'$
- n3 | - | tích ba tỉ số bằng $1$ (chiều thuận) | n1, n2 | nhân với $\dfrac{BA'}{CA'}$, $AM$, $BA'$, $CA'$ triệt tiêu
- n4 | - | $\dfrac{AC'}{BC'}\cdot\dfrac{BA_1}{CA_1}\cdot\dfrac{CB'}{AB'}=1$ | n3, gt | chiều thuận cho $A_1$, $B'$, $C'$ thẳng hàng
- n5 | - | $\dfrac{BA'}{CA'}=\dfrac{BA_1}{CA_1}$ | n4, gt | so sánh với giả thiết tích bằng $1$
- n6 | - | $A'$, $B'$, $C'$ thẳng hàng (chiều đảo) | n5 | $A'\equiv A_1$

**Phần 2. Trình bày**

[[so-do:n1]]
**Chiều thuận.** Giả sử $A'$, $B'$, $C'$ thẳng hàng.
Qua $A$ kẻ đường thẳng song song với $BC$, cắt đường thẳng $A'B'$ tại $M$.
Xét $\triangle C'BA'$ có $AM\parallel BA'$ ($A\in C'B$, $M\in C'A'$)
nên $\dfrac{AC'}{BC'}=\dfrac{AM}{BA'}$ (hệ quả của định lí Thalès). (1)
Xét $\triangle B'CA'$ có $AM\parallel CA'$ ($A\in B'C$, $M\in B'A'$)
[[so-do:n2]]
nên $\dfrac{AB'}{CB'}=\dfrac{AM}{CA'}$, tức $\dfrac{CB'}{AB'}=\dfrac{CA'}{AM}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân (1), (2) với $\dfrac{BA'}{CA'}$:
$\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=\dfrac{AM}{BA'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CA'}{AM}=1$.
[[so-do:n4]]
**Chiều đảo.** Giả sử $\dfrac{AC'}{BC'}\cdot\dfrac{BA'}{CA'}\cdot\dfrac{CB'}{AB'}=1$. (3)
Đường thẳng $C'B'$ cắt cạnh $CA$ tại $B'$ nằm trong cạnh,
và cắt đường thẳng $AB$ tại $C'$ nằm ngoài đoạn $AB$,
nên nó phải cắt cạnh còn lại $BC$ tại một điểm $A_1$ nằm trong cạnh $BC$.
Ba điểm $A_1$, $B'$, $C'$ thẳng hàng nên theo chiều thuận:
$\dfrac{AC'}{BC'}\cdot\dfrac{BA_1}{CA_1}\cdot\dfrac{CB'}{AB'}=1$. (4)
[[so-do:n5]]
Từ (3) và (4) suy ra $\dfrac{BA'}{CA'}=\dfrac{BA_1}{CA_1}$.
[[so-do:n6]]
Do đó $\dfrac{BA'+CA'}{CA'}=\dfrac{BA_1+CA_1}{CA_1}$, tức $\dfrac{BC}{CA'}=\dfrac{BC}{CA_1}$
(vì $A'$, $A_1$ đều thuộc đoạn $BC$).
Suy ra $CA'=CA_1$, nên $A'\equiv A_1$.
Vậy $A'$, $B'$, $C'$ thẳng hàng.
**hinh:** NDT-H3-17b.png
**hinh_lg:** NDT-H3-17b_lg.png
**nghi_van:** Đề sách cho $A'$, $B'$, $C'$ "trên các cạnh hoặc trên đường thẳng chứa các cạnh" (tổng quát, hai trường hợp), nhưng hình và lời giải của sách chỉ có một cấu hình (như hình 49); chiều đảo của sách cũng bỏ qua việc $A_1$ và $A'$ cùng nằm trong hay ngoài cạnh $BC$. Kho thu hẹp đúng cấu hình của hình 49 (hai điểm trong cạnh, một điểm trên tia đối) để lời giải đầy đủ; các cấu hình còn lại (một điểm trên tia đối khác, ba điểm ngoài cạnh) chưa có. Mã HH00131 như bài 17a.

### NDT-H3.18a → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.18a@p173 · bài thi chọn HSG
**sach:** Gọi $O=AC\cap BD$; hai hệ quả Thalès ($AP\parallel BC$, $BQ\parallel AD$), nhân vế được $\dfrac{OQ}{OC}=\dfrac{OP}{OD}$, rồi Thalès đảo trong $\triangle OCD$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác lồi $ABCD$. Đường thẳng qua $A$ song song với $BC$ cắt $BD$ tại $P$ và đường thẳng qua $B$ song song với $AD$ cắt $AC$ ở $Q$. Chứng minh rằng $PQ\parallel CD$.
(Đề thi chọn học sinh giỏi Toán lớp 8, Quận 9 – TP. Hồ Chí Minh, năm học 2000 – 2001)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $O=AC\cap BD$; hai hệ quả Thalès ($AP\parallel BC$, $BQ\parallel AD$) rồi nhân vế, $OA$ và $OB$ triệt tiêu, được $\dfrac{OQ}{OC}=\dfrac{OP}{OD}$; kết thúc bằng Thalès đảo trong $\triangle OCD$.

- n1 | - | $\dfrac{OA}{OC}=\dfrac{OP}{OB}$ | gt | hệ quả của định lí Thalès cho $\triangle OBC$ ($AP\parallel BC$)
- n2 | - | $\dfrac{OQ}{OA}=\dfrac{OB}{OD}$ | gt | hệ quả của định lí Thalès cho $\triangle OAD$ ($BQ\parallel AD$)
- n3 | - | $\dfrac{OQ}{OC}=\dfrac{OP}{OD}$ | n1, n2 | nhân vế theo vế, $OA$ và $OB$ triệt tiêu
- n4 | - | $PQ\parallel CD$ | n3, gt | định lí Thalès đảo cho $\triangle OCD$ ($Q\in$ tia $OC$, $P\in$ tia $OD$)

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $O$ là giao điểm của $AC$ và $BD$.
Vì $ABCD$ là tứ giác lồi nên $O$ nằm giữa $A$, $C$ và nằm giữa $B$, $D$.
Xét $\triangle OBC$ có $AP\parallel BC$ ($A\in$ đường thẳng $OC$, $P\in$ đường thẳng $OB$)
nên $\dfrac{OA}{OC}=\dfrac{OP}{OB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle OAD$ có $BQ\parallel AD$ ($B\in$ đường thẳng $OD$, $Q\in$ đường thẳng $OA$)
nên $\dfrac{OQ}{OA}=\dfrac{OB}{OD}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân (1) với (2) vế theo vế: $\dfrac{OA}{OC}\cdot\dfrac{OQ}{OA}=\dfrac{OP}{OB}\cdot\dfrac{OB}{OD}$,
suy ra $\dfrac{OQ}{OC}=\dfrac{OP}{OD}$. (3)
[[so-do:n4]]
Vì $A$, $C$ nằm khác phía đối với $O$ và $AP\parallel BC$
nên $O$ nằm giữa hai đường thẳng song song $AP$ và $BC$, do đó $O$ nằm giữa $P$ và $B$:
$P$ thuộc tia $OD$.
Tương tự, $B$, $D$ nằm khác phía đối với $O$ và $BQ\parallel AD$
nên $O$ nằm giữa $Q$ và $A$: $Q$ thuộc tia $OC$.
Xét $\triangle OCD$ có $Q\in$ tia $OC$, $P\in$ tia $OD$ và $\dfrac{OQ}{OC}=\dfrac{OP}{OD}$ (3)
nên $PQ\parallel CD$ (định lí Thalès đảo).
**hinh:** NDT-H3-18a.png
**nghi_van:** Đề sách ghi "tứ giác $ABCD$"; kho thêm "lồi" vì hình sách (hình 50) và lời giải ($O$ nằm trong hai đường chéo) chỉ có trường hợp lồi.

### NDT-H3.18b → DE_SAU (HH00166)
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.18b@p174 · bài thi chọn HSG
**noi_dung:** Lấy một điểm $O$ trong tam giác $ABC$, các tia $AO$, $BO$, $CO$ cắt $BC$, $AC$, $AB$ lần lượt tại $P$, $Q$, $R$. Chứng minh rằng $\dfrac{OA}{AP}+\dfrac{OB}{BQ}+\dfrac{OC}{CR}=2$.
(Đề thi chọn học sinh giỏi Toán lớp 8, Quận 1 – TP. Hồ Chí Minh, năm học 1994 – 1995)
**ly_do:** Sách giải bằng phương pháp diện tích (tỉ số $\dfrac{OP}{AP}$ bằng tỉ số diện tích $S_{OBC}$ với $S_{ABC}$ rồi cộng ba tỉ số). Cách thuần Thalès phải đi qua định lí Xê-va hoặc dựng ba đường song song qua $O$ và cộng đoạn thẳng, dài và gượng hơn hẳn. Hình: NDT-H3-18b.png. (Đã kiểm số: $\dfrac{AO}{AP}+\dfrac{BO}{BQ}+\dfrac{CO}{CR}=2$, nên đề đúng khi đọc $OA/AP$ là tỉ số hai độ dài.)
**hinh:** NDT-H3-18b.png

### NDT-H3.18c → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.18c@p174 · bài thi chọn HSG
**sach:** Qua $A$ kẻ đường thẳng song song $BC$ cắt $BB'$, $CC'$ tại $E$, $D$; hệ quả Thalès cho $\dfrac{AM}{A'M}$, $\dfrac{AB'}{CB'}$, $\dfrac{AC'}{BC'}$ theo các đoạn $AD$, $AE$, $BC$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $A'$, $B'$, $C'$ lần lượt nằm trên các cạnh $BC$, $AC$, $AB$ của tam giác $ABC$. Biết rằng $AA'$, $BB'$, $CC'$ đồng quy tại $M$. Chứng minh rằng $\dfrac{AM}{A'M}=\dfrac{AB'}{CB'}+\dfrac{AC'}{BC'}$.
(Đề thi chọn học sinh giỏi Toán lớp 8, Trường chuyên Văn – Toán, huyện Đức Phổ, tỉnh Quảng Ngãi, năm học 1990 – 1991)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $A$ kẻ $d\parallel BC$ cắt $BB'$ tại $E$ và $CC'$ tại $D$; hai vế cùng bằng $\dfrac{DE}{BC}$ (vế trái qua dãy tỉ số bằng nhau, vế phải qua hai hệ quả Thalès rồi cộng).

- n1 | - | $A$ nằm giữa $D$ và $E$, $DE=AD+AE$ | gt | $D$, $E$ khác phía đối với $AA'$
- n2 | - | $\dfrac{AM}{A'M}=\dfrac{DE}{BC}$ | n1, gt | hệ quả của định lí Thalès cho $\triangle MBA'$, $\triangle MCA'$ và tính chất dãy tỉ số bằng nhau
- n3 | - | $\dfrac{AB'}{CB'}+\dfrac{AC'}{BC'}=\dfrac{DE}{BC}$ | n1, gt | hệ quả của định lí Thalès cho $\triangle B'BC$, $\triangle C'BC$, rồi cộng
- n4 | - | $\dfrac{AM}{A'M}=\dfrac{AB'}{CB'}+\dfrac{AC'}{BC'}$ | n2, n3 | cùng bằng $\dfrac{DE}{BC}$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $A$ kẻ đường thẳng $d\parallel BC$, cắt $BB'$ tại $E$ và $CC'$ tại $D$.
$B$, $C$ nằm khác phía đối với $AA'$ nên $D$, $E$ cũng nằm khác phía đối với $AA'$,
do đó $A$ nằm giữa $D$ và $E$, $DE=AD+AE$.
[[so-do:n2]]
Xét $\triangle MBA'$ có $AE\parallel BA'$ ($A\in MA'$, $E\in MB$)
nên $\dfrac{AM}{A'M}=\dfrac{AE}{BA'}$ (hệ quả của định lí Thalès). (1)
Xét $\triangle MCA'$ có $AD\parallel CA'$ ($A\in MA'$, $D\in MC$)
nên $\dfrac{AM}{A'M}=\dfrac{AD}{CA'}$ (hệ quả của định lí Thalès). (2)
Từ (1), (2) và tính chất dãy tỉ số bằng nhau:
$\dfrac{AM}{A'M}=\dfrac{AE+AD}{BA'+CA'}=\dfrac{DE}{BC}$. (3)
[[so-do:n3]]
Xét $\triangle B'BC$ có $AE\parallel BC$ ($A\in B'C$, $E\in B'B$)
nên $\dfrac{AB'}{CB'}=\dfrac{AE}{BC}$ (hệ quả của định lí Thalès). (4)
Xét $\triangle C'BC$ có $AD\parallel BC$ ($A\in C'B$, $D\in C'C$)
nên $\dfrac{AC'}{BC'}=\dfrac{AD}{BC}$ (hệ quả của định lí Thalès). (5)
Cộng (4) và (5): $\dfrac{AB'}{CB'}+\dfrac{AC'}{BC'}=\dfrac{AE+AD}{BC}=\dfrac{DE}{BC}$. (6)
[[so-do:n4]]
Từ (3) và (6) suy ra $\dfrac{AM}{A'M}=\dfrac{AB'}{CB'}+\dfrac{AC'}{BC'}$.
**hinh:** NDT-H3-18c.png
**hinh_lg:** NDT-H3-18c_lg.png
**nghi_van:** Sách ghi sai nhãn tam giác ở hai hệ quả (viết "$\triangle BCC'$ có $DA\parallel BC$, $\dfrac{AB'}{BC'}$…") và nhảy thẳng từ $\dfrac{AE}{BA'}$ sang $\dfrac{DE}{BC}$ mà không chứng minh; kho đã sửa nhãn và bổ sung bước dãy tỉ số bằng nhau (cần thêm $\dfrac{AM}{A'M}=\dfrac{AD}{CA'}$ từ $\triangle MCA'$).

### NDT-H3.18d → DE_SAU (HH00166)
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.18d@p174 · bài thi chọn HSG
**noi_dung:** Cho tam giác $ABC$, trên đường trung tuyến $AD$ lấy điểm $O$. Tia $CO$ cắt $AB$ tại $M$, $BO$ cắt $AC$ tại $N$.
1) Chứng minh $S_{BOM}=S_{CON}$.
2) Tính $S_{BMNC}$, biết $S_{MNO}=16\ \text{cm}^2$, $S_{BCO}=36\ \text{cm}^2$.
(Đề thi chọn học sinh giỏi Toán lớp 8, trường THCS Ngô Quyền, Quận Tân Bình, TP. Hồ Chí Minh, năm học 2010 – 2011)
**ly_do:** Cả hai ý là bài diện tích (so sánh diện tích, tỉ số $\dfrac{S_{BOM}}{S_{MNO}}=\dfrac{S_{BCO}}{S_{CON}}$ theo tỉ số diện tích hai tam giác chung đường cao); phần Thalès ($MN\parallel BC$) chỉ là bước đệm. Chưa học diện tích nên để lô sau (HH00166 phương pháp diện tích). Sách đáp số: $S_{BOM}=S_{CON}=24\ \text{cm}^2$ (từ $24^2=16\cdot36$), suy ra $S_{BMNC}=S_{BOC}+S_{BOM}+S_{MON}+S_{CON}=36+24+16+24=100\ \text{cm}^2$ (đã kiểm số: $S_{BOM}=S_{CON}$ và $24^2=16\cdot36$; đáp số 100 là tính của kho, sách dừng ở 24). Hình: NDT-H3-18d.png.
**hinh:** NDT-H3-18d.png
