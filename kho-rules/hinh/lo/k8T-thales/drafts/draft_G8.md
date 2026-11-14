### TCHH-5.7 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 7@p197
**sach:** Kẻ $DE\parallel AC$ ($E\in AB$) được tam giác $ADE$ cân tại $E$ (sách gọi là "bài toán 6"), hệ quả Thalès cho $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$, bất đẳng thức tam giác $AE+ED>AD$; làm tương tự cho hai phân giác còn lại rồi cộng.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ có $AB=c$, $BC=a$, $CA=b$. Gọi $AD$, $BM$, $CN$ là ba đường phân giác trong của tam giác ($D\in BC$, $M\in CA$, $N\in AB$) và đặt $l_a=AD$, $l_b=BM$, $l_c=CN$.
Chứng minh rằng $\dfrac1{l_a}+\dfrac1{l_b}+\dfrac1{l_c}\ge\dfrac1a+\dfrac1b+\dfrac1c$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $D$ kẻ $DE\parallel AC$: phân giác và so le trong cho tam giác $AED$ cân, rồi Thalès và bất đẳng thức tam giác $AE+ED>AD$ cho $\dfrac1{l_a}>\dfrac12\left(\dfrac1b+\dfrac1c\right)$; làm tương tự hai phân giác còn lại và cộng vế.

- n1 | - | $EA=ED$ | gt | $\triangle EAD$ cân tại $E$ (phân giác, so le trong)
- n2 | - | $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$ | n1, gt | hệ quả định lí Thalès cho $DE\parallel AC$
- n3 | - | $\dfrac1{l_a}>\dfrac12\left(\dfrac1b+\dfrac1c\right)$ | n1, n2 | bất đẳng thức tam giác $AE+ED>AD$
- n4 | - | $\dfrac1{l_b}>\dfrac12\left(\dfrac1c+\dfrac1a\right)$ và $\dfrac1{l_c}>\dfrac12\left(\dfrac1a+\dfrac1b\right)$ | n3 | làm tương tự, đổi vai trò các đỉnh
- n5 | - | $\dfrac1{l_a}+\dfrac1{l_b}+\dfrac1{l_c}\ge\dfrac1a+\dfrac1b+\dfrac1c$ | n3, n4 | cộng vế ba bất đẳng thức

**Phần 2. Trình bày**
[[so-do:n1]]
Qua $D$ kẻ $DE\parallel AC$ ($E\in AB$; $E$ nằm giữa $A$ và $B$ vì $D$ nằm giữa $B$ và $C$).
Vì $DE\parallel AC$ nên $\widehat{EDA}=\widehat{DAC}$ (hai góc so le trong).
Mà $\widehat{EAD}=\widehat{DAC}$ ($AD$ là phân giác góc $A$).
Suy ra $\widehat{EAD}=\widehat{EDA}$ nên $\triangle EAD$ cân tại $E$, do đó $EA=ED$. (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $DE\parallel AC$ nên $\dfrac{DE}{AC}=\dfrac{BE}{BA}$ (hệ quả của định lí Thalès).
Thay $DE=AE$ (1) và $BE=AB-AE$:
$\dfrac{AE}{AC}=\dfrac{AB-AE}{AB}=1-\dfrac{AE}{AB}$.
Suy ra $\dfrac{AE}{AB}+\dfrac{AE}{AC}=1$, tức là $\dfrac1{AB}+\dfrac1{AC}=\dfrac1{AE}$. (2)
[[so-do:n3]]
Trong $\triangle AED$ có $AE+ED>AD$ (bất đẳng thức tam giác).
Mà $ED=AE$ (1) nên $2AE>AD$, suy ra $\dfrac1{AE}<\dfrac2{AD}$. (3)
Từ (2) và (3): $\dfrac1{AB}+\dfrac1{AC}<\dfrac2{AD}$.
Do đó $\dfrac1{l_a}>\dfrac12\left(\dfrac1b+\dfrac1c\right)$. (4)
[[so-do:n4]]
Làm tương tự với phân giác $BM$ và $CN$ (đổi vai trò các đỉnh) ta được:
$\dfrac1{l_b}>\dfrac12\left(\dfrac1c+\dfrac1a\right)$; (5)
$\dfrac1{l_c}>\dfrac12\left(\dfrac1a+\dfrac1b\right)$. (6)
[[so-do:n5]]
Cộng vế với vế của (4), (5), (6):
$\dfrac1{l_a}+\dfrac1{l_b}+\dfrac1{l_c}>\dfrac12\cdot2\left(\dfrac1a+\dfrac1b+\dfrac1c\right)=\dfrac1a+\dfrac1b+\dfrac1c$.
Vậy $\dfrac1{l_a}+\dfrac1{l_b}+\dfrac1{l_c}\ge\dfrac1a+\dfrac1b+\dfrac1c$ (thực ra bất đẳng thức xảy ra chặt).
**hinh:** TCHH-5-7.png
**hinh_lg:** TCHH-5-7_lg.png
**nghi_van:** (1) Lời giải chỉ dùng hệ quả Thalès + hai góc so le trong + bất đẳng thức tam giác, KHÔNG dùng tính chất đường phân giác ⇒ nếu coi "kiến thức cần" thì bài có thể ở HH00127; đặt HH00128 vì chủ đề là độ dài đường phân giác và kỹ thuật kẻ song song tạo tam giác cân chính là cách chứng minh tính chất phân giác — người xếp bản đồ chốt. (2) Sách ghi "$E\in AC$" khi kẻ $DE\parallel AC$: in sai (phải $E\in AB$), đã sửa. (3) Sách viện "bài toán 6" — đã chứng minh lại tại chỗ.

### TCHH-5.8 → DE_SAU (HH00129)
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 8@p198
**noi_dung:** Cho $\triangle ABC$ nhọn, ba đường cao $AD$, $BE$, $CF$. Chứng minh rằng nếu $H$ là tâm đường tròn nội tiếp $\triangle DEF$ thì $H$ là trực tâm của $\triangle ABC$.
**ly_do:** (1) Đề dùng "tâm đường tròn nội tiếp" (kiến thức lớp 9, sách tự ghi) và bản chất là định lí "trực tâm là tâm nội tiếp của tam giác chân đường cao", mà chứng minh gọn cần các cặp tam giác đồng dạng ($\triangle AEF\backsim\triangle ABC$, …) hoặc tứ giác nội tiếp. Cách chỉ dùng trung tuyến ứng cạnh huyền + tam giác cân thì phải chạy góc qua ba trung điểm, dài và gượng. (2) Lời giải của sách có hổng: dòng "$\dfrac{HI}{CD}=\dfrac{FH}{FC}$" ngầm coi $H$ nằm trên $CF$ (điều cần chứng minh), nên KHÔNG chép theo được. Đã kiểm số: trực tâm của tam giác nhọn đúng là tâm nội tiếp tam giác chân đường cao (mệnh đề đúng).
**hinh:** TCHH-5-8.png

### TCHH-5.9 → HH00131
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 9@p198 (lời giải vắt sang p199) · Định lí Mê-nê-la-uýt
**sach:** Qua $A$ kẻ $AQ\parallel BC$ cắt $MN$ tại $Q$, hai lần Thalès đưa các tỉ số về $QA$ rồi rút gọn (thuận); giả sử $NP$ cắt $BC$ tại $M'$, dùng chiều thuận để suy ra $M'\equiv M$ (đảo).
**loai:** nhieu_y
**loi_dan:**
Cho $\triangle ABC$. Trên các đường thẳng $BC$, $CA$, $AB$ lần lượt lấy các điểm $M$, $N$, $P$ (không điểm nào trùng với đỉnh của tam giác).
**hinh:** TCHH-5-9.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng nếu $M$, $N$, $P$ thẳng hàng thì $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $A$ kẻ $AQ\parallel BC$ cắt $MN$ tại $Q$ để mọi tỉ số đổi thành tỉ số với cùng đoạn $QA$ rồi triệt tiêu.

- n1 | - | $\dfrac{PA}{PB}=\dfrac{QA}{MB}$ | gt | hệ quả định lí Thalès cho $AQ\parallel BM$
- n2 | - | $\dfrac{NC}{NA}=\dfrac{MC}{QA}$ | gt | hệ quả định lí Thalès cho $AQ\parallel MC$
- n3 | - | $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ | n1, n2 | nhân vế với vế, rút gọn $QA$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $M\in BC$ nên đường thẳng $MN$ không song song với $BC$, nên đường thẳng qua $A$ song song với $BC$ cắt $MN$ tại một điểm $Q$ ($Q\ne A$ vì $A\notin MN$).
$AQ\parallel BM$, hai đường thẳng $AB$ và $QM$ cắt nhau tại $P$ nên $\dfrac{PA}{PB}=\dfrac{QA}{MB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
$AQ\parallel MC$, hai đường thẳng $AC$ và $QM$ cắt nhau tại $N$ nên $\dfrac{NC}{NA}=\dfrac{MC}{QA}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Nhân vế với vế của (1) và (2):
$\dfrac{PA}{PB}\cdot\dfrac{NC}{NA}=\dfrac{QA}{MB}\cdot\dfrac{MC}{QA}=\dfrac{MC}{MB}$.
Suy ra $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=\dfrac{MB}{MC}\cdot\dfrac{MC}{MB}=1$.
**hinh_lg:** TCHH-5-9_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng ngược lại, nếu $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ và trong ba điểm $M$, $N$, $P$ có một hoặc ba điểm nằm ngoài cạnh tương ứng (trên phần kéo dài của cạnh, không thuộc đoạn thẳng cạnh đó) thì $M$, $N$, $P$ thẳng hàng.
**da_biet:** Biết nếu $M$, $N$, $P$ thẳng hàng thì $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Lấy $M'=NP\cap BC$ rồi chứng minh $M'\equiv M$: cùng chia $BC$ theo một tỉ số (nhờ ý a) và cùng ở trong hoặc cùng ở ngoài đoạn $BC$ (nhờ số điểm ngoài cạnh là số lẻ).

- n1 | - | Đường thẳng không qua đỉnh nào cắt đúng 0 hoặc 2 cạnh, nên số điểm ngoài cạnh là số lẻ (X) | gt | xét ba đỉnh ở hai nửa mặt phẳng
- n2 | - | $NP\not\parallel BC$ | n1, gt | giả sử $NP\parallel BC$ thì số điểm ngoài cạnh là 0 hoặc 2, trái giả thiết
- n3 | - | $NP$ cắt $BC$ tại $M'$, $M'$ không trùng $B$, $C$ | n2, gt | nếu $M'=B$ thì $N=A$, vô lí
- n4 | - | $\dfrac{M'B}{M'C}=\dfrac{MB}{MC}$ | n3, gt | kết quả ý a cho $M'$, $N$, $P$ và giả thiết
- n5 | - | $M'$ và $M$ cùng ở trong hoặc cùng ở ngoài đoạn $BC$ | n1, n3, gt | số điểm ngoài cạnh là lẻ ở cả hai bộ ba, chung $N$, $P$
- n6 | - | $M\equiv M'$, nên $M$, $N$, $P$ thẳng hàng | n4, n5 | cùng tỉ số và cùng trạng thái thì trùng nhau

**Phần 2. Trình bày**
[[so-do:n1]]
Ta dùng nhận xét sau (X): một đường thẳng không đi qua đỉnh nào của $\triangle ABC$ cắt đúng 0 hoặc 2 cạnh của tam giác (tại điểm nằm trong cạnh).
Thật vậy, đường thẳng chia mặt phẳng thành hai nửa mặt phẳng; ba đỉnh nằm ở hai nửa ấy; một cạnh bị cắt khi hai đầu mút nằm khác nửa mặt phẳng; ba đỉnh vào hai nửa nên số cạnh có hai đầu khác nửa là 0 hoặc 2. Suy ra số giao điểm nằm ngoài cạnh là 3 hoặc 1, tức là số lẻ.
[[so-do:n2]]
Bước 1. Trước hết $NP\not\parallel BC$.
Giả sử $NP\parallel BC$. Theo định lí Thalès, $\dfrac{PA}{PB}=\dfrac{NA}{NC}$, nên $\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$.
Từ giả thiết suy ra $\dfrac{MB}{MC}=1$, tức $M$ là trung điểm của $BC$ (nằm trong cạnh $BC$).
Vì $NP\parallel BC$ nên $B$, $C$ nằm cùng một phía đối với $NP$.
Khi đó $P$ nằm trong đoạn $AB$ $\Leftrightarrow$ $A$, $B$ khác phía đối với $NP$ $\Leftrightarrow$ $A$, $C$ khác phía đối với $NP$ $\Leftrightarrow$ $N$ nằm trong đoạn $AC$.
Vậy $N$, $P$ cùng nằm trong hoặc cùng nằm ngoài cạnh, và $M$ nằm trong cạnh: số điểm ngoài cạnh là 0 hoặc 2, trái với giả thiết.
[[so-do:n3]]
Vậy $NP$ cắt $BC$ tại một điểm $M'$.
$M'$ không trùng $B$: nếu $M'=B$ thì $NP$ đi qua $B$ và $P$ ($P\ne B$) nên $NP=AB$, suy ra $N\in AB\cap AC$, tức $N=A$, vô lí.
Tương tự $M'$ không trùng $C$.
[[so-do:n4]]
Bước 2. Vì $M'$, $N$, $P$ thẳng hàng nên theo ý a): $\dfrac{M'B}{M'C}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$.
So với giả thiết $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ suy ra $\dfrac{M'B}{M'C}=\dfrac{MB}{MC}=k$. (1)
[[so-do:n5]]
Bước 3. Đường thẳng $NP$ không đi qua đỉnh nào (đã chứng minh $M'\ne B$, $C$, và $N$, $P$ khác đỉnh) nên theo (X), trong ba điểm $M'$, $N$, $P$ số điểm nằm ngoài cạnh là lẻ.
Trong ba điểm $M$, $N$, $P$ số đó cũng là lẻ (giả thiết).
Hai bộ có chung $N$, $P$ nên $M'$ và $M$ cùng nằm trong đoạn $BC$ hoặc cùng nằm ngoài đoạn $BC$.
[[so-do:n6]]
Bước 4. Nếu $M$, $M'$ cùng nằm trong đoạn $BC$: từ (1), $\dfrac{M'B}{BC-M'B}=\dfrac{MB}{BC-MB}$, suy ra $M'B=MB$, mà cả hai thuộc đoạn $BC$ nên $M'\equiv M$.
Nếu $M$, $M'$ cùng nằm ngoài đoạn $BC$: $k\ne1$ (vì $MB\ne MC$).
Khi $k<1$ thì $MB<MC$ nên $M$ nằm ở phía $B$ (ngoài đoạn $BC$, $B$ nằm giữa $M$ và $C$), và $M'$ cũng vậy; khi $k>1$ thì cả hai nằm ở phía $C$.
Giả sử $k<1$: $\dfrac{MB}{MB+BC}=k=\dfrac{M'B}{M'B+BC}$, suy ra $MB=M'B$ nên $M'\equiv M$. Trường hợp $k>1$ làm tương tự (đổi vai trò $B$ và $C$).
Vậy $M\equiv M'$, nên $M$ nằm trên đường thẳng $NP$: $M$, $N$, $P$ thẳng hàng.
**hinh_lg:** TCHH-5-9_b_lg.png
**nghi_van:** (1) Đề sách để nguyên ("$M$, $N$, $P$ thẳng hàng khi và chỉ khi tích $=1$") là chưa đủ với độ dài không dấu: ba điểm đều nằm trong cạnh cũng có thể cho tích $=1$ (định lí Xê-va), còn $M$ và điểm "liên hợp điều hòa" của nó trên $BC$ cho cùng tỉ số $MB:MC$; lời giải đảo của sách ("$\dfrac{M'B}{M'C}=\dfrac{MB}{MC}\Leftrightarrow\dfrac{M'B}{BC}=\dfrac{MB}{BC}$") chỉ đúng khi $M$, $M'$ cùng nằm trong đoạn $BC$. Đã bổ sung điều kiện "có một hoặc ba điểm nằm ngoài cạnh" và đã kiểm số (400 bộ ngẫu nhiên: bộ liên hợp có tích $=1$ nhưng không thẳng hàng). (2) Hình sách đặt nhãn lẫn ($M$ nằm ngoài tam giác, $P$ nằm trên $AB$ nhưng nhãn đỉnh lệch); hình đã vẽ lại theo đề: $M$ trên phần kéo dài của $CB$ về phía $B$, $N$ ∈ $CA$, $P$ ∈ $AB$ (trong cạnh). (3) Nhận xét (X) là kiến thức quen thuộc nhưng không có tên định lí; đã chứng minh tại chỗ bằng nửa mặt phẳng. Hình ý b vẽ $M\ne M'$ chỉ để minh hoạ phép giả sử, không phải cấu hình của bài.

### TCHH-5.10 → HH00161
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 10@p199
**sach:** Lấy $D$ là trung điểm $EC$: $HD$ là đường trung bình của $\triangle BEC$ nên $HD\parallel BE$; $OD$ là đường trung bình của $\triangle HEC$ nên $OD\parallel BC\perp AH$; $O$ là trực tâm $\triangle AHD$ nên $AO\perp HD$.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ cân tại $A$. Gọi $H$ là trung điểm của cạnh $BC$, kẻ $HE\perp AC$ ($E\in AC$). Gọi $O$ là trung điểm của đoạn thẳng $HE$.
Chứng minh rằng $AO\perp BE$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $D$ là trung điểm của $EC$: $HD\parallel BE$ (đường trung bình) và $O$ là trực tâm của $\triangle AHD$ nên $AO\perp HD$, suy ra $AO\perp BE$.

- n1 | - | $HD\parallel BE$ | gt | $HD$ là đường trung bình của $\triangle BEC$
- n2 | - | $OD\perp AH$ | gt | $OD\parallel BC$ (đường trung bình $\triangle EHC$), $AH\perp BC$ (tam giác cân)
- n3 | - | $AO\perp HD$ | n2, gt | $O$ là trực tâm của $\triangle AHD$
- n4 | - | $AO\perp BE$ | n1, n3 | vuông góc với một trong hai đường thẳng song song

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $D$ là trung điểm của $EC$. Vì $E\in AC$ nên $D\in AC$.
Xét $\triangle BEC$ có:
$H$ là trung điểm của $BC$ (gt);
$D$ là trung điểm của $EC$ (cách gọi)
nên $HD$ là đường trung bình của $\triangle BEC$ (định nghĩa đường trung bình).
Suy ra $HD\parallel BE$ (tính chất đường trung bình). (1)
[[so-do:n2]]
Xét $\triangle EHC$ có:
$O$ là trung điểm của $HE$ (gt);
$D$ là trung điểm của $EC$ (cách gọi)
nên $OD$ là đường trung bình của $\triangle EHC$.
Suy ra $OD\parallel HC$, tức $OD\parallel BC$ (tính chất đường trung bình). (2)
$\triangle ABC$ cân tại $A$ có $AH$ là trung tuyến (gt)
nên $AH\perp BC$ (tính chất tam giác cân). (3)
Từ (2) và (3) suy ra $OD\perp AH$.
[[so-do:n3]]
Xét $\triangle AHD$ có:
$HO\perp AD$ (vì $O\in HE$, $HE\perp AC$ (gt) và $D\in AC$);
$DO\perp AH$ (cmt).
Hai đường cao từ $H$ và từ $D$ của $\triangle AHD$ cắt nhau tại $O$
nên $O$ là trực tâm của $\triangle AHD$ (ba đường cao của tam giác đồng quy).
Do đó $AO$ là đường cao thứ ba, suy ra $AO\perp HD$. (4)
[[so-do:n4]]
Từ (1) và (4) suy ra $AO\perp BE$.
**hinh:** TCHH-5-10.png
**hinh_lg:** TCHH-5-10_lg.png
**nghi_van:** Chữ trong lời giải sách "DO song song với HC nên $DO\perp BC$" in sai (phải là $DO\parallel BC$, từ đó $DO\perp AH$); đã sửa theo hình.

### TCHH-5.11 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 11@p199 (lời giải p200)
**sach:** Thalès cho $AM\parallel BP$ trong $\triangle CBP$ và $AM\parallel CQ$ trong $\triangle BCQ$, cộng hai tỉ số có tổng bằng 1.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$, $M$ là một điểm nằm trên cạnh $BC$ ($M$ khác $B$ và $C$). Qua $B$ kẻ đường thẳng song song với $AM$ cắt đường thẳng $AC$ tại $P$; qua $C$ kẻ đường thẳng song song với $AM$ cắt đường thẳng $AB$ tại $Q$.
Chứng minh rằng $\dfrac1{AM}=\dfrac1{PB}+\dfrac1{QC}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $AM$, $PB$, $QC$ song song nhau nên mỗi tỉ số $\dfrac{AM}{PB}$, $\dfrac{AM}{QC}$ đọc ngay từ Thalès; hai tỉ số ấy cộng lại bằng 1.

- n1 | - | $\dfrac{AM}{PB}=\dfrac{CM}{CB}$ | gt | hệ quả định lí Thalès trong $\triangle CBP$
- n2 | - | $\dfrac{AM}{QC}=\dfrac{BM}{BC}$ | gt | hệ quả định lí Thalès trong $\triangle BCQ$
- n3 | - | $\dfrac1{AM}=\dfrac1{PB}+\dfrac1{QC}$ | n1, n2 | cộng vế, $CM+BM=BC$, chia cho $AM$

**Phần 2. Trình bày**
[[so-do:n1]]
Xét $\triangle CBP$ có $AM\parallel BP$ ($A\in CP$, $M\in CB$) nên $\dfrac{AM}{PB}=\dfrac{CM}{CB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Xét $\triangle BCQ$ có $AM\parallel CQ$ ($A\in BQ$, $M\in BC$) nên $\dfrac{AM}{QC}=\dfrac{BM}{BC}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Cộng vế với vế của (1) và (2):
$\dfrac{AM}{PB}+\dfrac{AM}{QC}=\dfrac{CM+BM}{BC}=\dfrac{BC}{BC}=1$ (vì $M$ nằm giữa $B$ và $C$).
Chia hai vế cho $AM$: $\dfrac1{PB}+\dfrac1{QC}=\dfrac1{AM}$.
**hinh:** TCHH-5-11.png
**nghi_van:** Đề sách ghi "$M$ là điểm trên cạnh $BC$"; đã ghi rõ "khác $B$ và $C$" (nếu $M=B$ thì đường thẳng qua $B$ song song $AM$ trùng $AB$, không xác định $P$). Hai đường thẳng $AC$, $AB$ được ghi là "đường thẳng" vì $P$, $Q$ nằm trên phần kéo dài về phía $A$ (đúng như hình sách).

### TCHH-5.12 → HH00127
**nguon:** Tuyển chọn CĐ BD HSG Toán 8 – Hình học · CĐ5 Bài 12@p200
**sach:** Qua $E$ kẻ song song $BC$ cắt $AB$, $AC$ ở $P$, $Q$; Thalès cho $PE=EQ$ (vì $BD=DC$), rồi Thalès hai lần nữa cho $\dfrac{NE}{NC}=\dfrac{ME}{MB}$ và kết luận $MN\parallel BC$ (Thalès đảo).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ có $AD$ là đường trung tuyến ($D$ là trung điểm của $BC$). Lấy điểm $E$ bất kì trên đoạn $AD$ ($E$ khác $A$ và $D$). Đường thẳng $BE$ cắt $AC$ tại $M$, đường thẳng $CE$ cắt $AB$ tại $N$.
Chứng minh rằng $MN\parallel BC$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $E$ kẻ đường thẳng song song $BC$ cắt $AB$, $AC$ tại $P$, $Q$; $E$ nằm trên trung tuyến nên $PE=EQ$, đưa các tỉ số của $M$ và của $N$ về cùng $\dfrac{PE}{BC}$, rồi Thalès đảo.

- n1 | - | $PE=EQ$ | gt | hệ quả định lí Thalès trong $\triangle ABD$, $\triangle ACD$, $BD=DC$
- n2 | - | $\dfrac{NE}{NC}=\dfrac{PE}{BC}$ | gt | hệ quả định lí Thalès trong $\triangle NBC$
- n3 | - | $\dfrac{ME}{MB}=\dfrac{EQ}{BC}$ | gt | hệ quả định lí Thalès trong $\triangle MBC$
- n4 | - | $\dfrac{EN}{EC}=\dfrac{EM}{EB}$ | n1, n2, n3 | bắc cầu và tính chất tỉ lệ thức
- n5 | - | $MN\parallel BC$ | n4 | định lí Thalès đảo

**Phần 2. Trình bày**
[[so-do:n1]]
Qua $E$ kẻ đường thẳng song song với $BC$, cắt $AB$, $AC$ lần lượt tại $P$, $Q$.
Xét $\triangle ABD$ có $PE\parallel BD$ nên $\dfrac{PE}{BD}=\dfrac{AE}{AD}$ (hệ quả của định lí Thalès).
Xét $\triangle ACD$ có $EQ\parallel DC$ nên $\dfrac{EQ}{DC}=\dfrac{AE}{AD}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{PE}{BD}=\dfrac{EQ}{DC}$.
Mà $BD=DC$ (gt) nên $PE=EQ$. (1)
[[so-do:n2]]
$E$ nằm trong tam giác nên $E$ nằm giữa $N$ và $C$, giữa $M$ và $B$.
Xét $\triangle NBC$ có $PE\parallel BC$ ($P\in NB$, $E\in NC$) nên $\dfrac{NE}{NC}=\dfrac{PE}{BC}$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Xét $\triangle MBC$ có $EQ\parallel BC$ ($E\in MB$, $Q\in MC$) nên $\dfrac{ME}{MB}=\dfrac{EQ}{BC}$ (hệ quả của định lí Thalès). (3)
[[so-do:n4]]
Từ (1), (2), (3) suy ra $\dfrac{NE}{NC}=\dfrac{ME}{MB}$, tức là $\dfrac{NE}{NE+EC}=\dfrac{ME}{ME+EB}$.
Biến đổi: $NE\cdot(ME+EB)=ME\cdot(NE+EC)$, suy ra $NE\cdot EB=ME\cdot EC$, tức $\dfrac{EN}{EC}=\dfrac{EM}{EB}$.
[[so-do:n5]]
$M$ và $N$ nằm trên phần kéo dài của $BE$, $CE$ về phía $E$ nên theo định lí Thalès đảo, $MN\parallel BC$.
**hinh:** TCHH-5-12.png
**hinh_lg:** TCHH-5-12_lg.png
**nghi_van:** (1) Đề sách ghi "lấy điểm $F$ bất kì … $BE$ cắt $AC$ … $CE$ cắt $AB$" — in lẫn $F$/$E$; đã sửa thành $E$ cho khớp lời giải và hình. (2) Bước cuối dùng định lí Thalès đảo ở trường hợp "chữ X" ($M$, $N$ nằm trên các tia đối của tia $EB$, $EC$) — sách làm đúng thế; nếu khối muốn chỉ dùng dạng $N$, $M$ cùng phía thì cần thêm bước đối xứng tâm $E$ (người soát quyết). (3) Đã ghi "$E$ khác $A$, $D$" để $M$, $N$ tồn tại.
