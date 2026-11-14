### NDT-H3.10 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.10@p169 · tầng cơ bản
**sach:** Kiểm tra từng cặp tỉ số bằng định lí Thalès đảo (AD/DB với AE/EC; BD/DA với BF/FC). Không có đường phụ.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** $DE\parallel BC$ và $DF\parallel AC$
**noi_dung:**
Cho tam giác $ABC$. Lấy điểm $D$ trên cạnh $AB$, điểm $E$ trên cạnh $AC$, điểm $F$ trên cạnh $BC$ sao cho $AD=12$, $DB=10$, $AE=13{,}2$, $EC=11$, $BF=9$, $FC=10{,}8$. Nối $D$ với $E$ và $D$ với $F$. Tìm các cặp đường thẳng song song trong các đường thẳng $DE$, $DF$, $AB$, $BC$, $CA$ và giải thích vì sao.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** muốn biết một đường thẳng nối hai điểm trên hai cạnh của tam giác có song song với cạnh còn lại hay không, ta so sánh hai tỉ số các đoạn thẳng tương ứng mà nó chia ra trên hai cạnh đó. Hai tỉ số bằng nhau thì song song (định lí Thalès đảo).
**Bước 1.** $DE$ nối $D\in AB$ với $E\in AC$ nên là ứng viên song song với $BC$. Cần so sánh $\dfrac{AD}{DB}$ với $\dfrac{AE}{EC}$ (hai đoạn cùng tính từ đỉnh $A$ trên mỗi cạnh).
**Bước 2.** $DF$ nối $D\in AB$ với $F\in BC$ nên là ứng viên song song với $AC$. Lúc này đỉnh chung của hai cạnh là $B$, nên so sánh $\dfrac{BD}{DA}$ với $\dfrac{BF}{FC}$ (cùng tính từ đỉnh $B$).
**Bước 3.** Mỗi lần chỉ đổi tên đỉnh chung, giữ đúng thứ tự "đoạn gần đỉnh trên đoạn xa đỉnh". Các cặp còn lại trong $DE$, $DF$, $AB$, $BC$, $CA$ đều có điểm chung nên cắt nhau, không cần xét.
**Chú ý:** rút gọn hai tỉ số về phân số tối giản rồi mới so sánh để khỏi nhầm.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $D\in AB$, $E\in AC$ và:
$\dfrac{AD}{DB}=\dfrac{12}{10}=\dfrac65$;
$\dfrac{AE}{EC}=\dfrac{13{,}2}{11}=\dfrac65$.
Suy ra $\dfrac{AD}{DB}=\dfrac{AE}{EC}$
nên $DE\parallel BC$ (định lí Thalès đảo).
Xét $\triangle ABC$ có $D\in AB$, $F\in BC$ và:
$\dfrac{BD}{DA}=\dfrac{10}{12}=\dfrac56$;
$\dfrac{BF}{FC}=\dfrac{9}{10{,}8}=\dfrac56$.
Suy ra $\dfrac{BD}{DA}=\dfrac{BF}{FC}$
nên $DF\parallel AC$ (định lí Thalès đảo).
Các cặp đường thẳng còn lại đều có điểm chung nên không song song.
Vậy có hai cặp đường thẳng song song là $DE\parallel BC$ và $DF\parallel AC$.
**hinh:** NDT-H3-10.png
**nghi_van:** Đề sách chỉ có hình (không nêu bằng lời việc lấy $D,E,F$ và nối $DE$, $DF$); đã chuyển từ hình sang chữ. Hình sách không ghi đơn vị nên không ghi đơn vị.

### NDT-H3.11 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.11@p169 · tầng cơ bản
**sach:** Hệ quả của định lí Thalès với $DE\parallel BC$: $\dfrac{DE}{BC}=\dfrac{AD}{AB}$, sau khi tính $AB=AD+DB$. Không có đường phụ.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** $16$
**noi_dung:**
Cho tam giác $ABC$. Lấy điểm $D$ trên cạnh $AB$, điểm $E$ trên cạnh $AC$ sao cho $DE\parallel BC$, biết $AD=5$, $DB=7{,}5$, $DE=6{,}4$. Tính độ dài $x=BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $DE\parallel BC$ nên hệ quả của định lí Thalès cho ta một tỉ lệ thức nối $DE$ với $BC$. Phải chọn đúng đoạn tỉ lệ: tỉ số của $DE$ và $BC$ bằng tỉ số của $AD$ và $AB$ (đoạn từ đỉnh $A$ đến $D$ trên đoạn từ $A$ đến $B$), chứ không phải $\dfrac{AD}{DB}$.
**Bước 1.** Đề cho $AD$ và $DB$ nhưng tỉ lệ thức cần $AB$. Vì $D$ nằm giữa $A$ và $B$ nên $AB=AD+DB$.
**Bước 2.** Áp dụng hệ quả của định lí Thalès cho $\triangle ABC$ có $DE\parallel BC$, lập tỉ lệ thức $\dfrac{DE}{BC}=\dfrac{AD}{AB}$.
**Bước 3.** Thay số rồi tính $BC$ từ tỉ lệ thức.
**Chú ý:** $\dfrac{DE}{BC}$ phải đi với $\dfrac{AD}{AB}$ (cùng là "phần" so với cả đoạn); đi với $\dfrac{AD}{DB}$ là nhầm.

**Phần 2. Trình bày**
Vì $D$ nằm giữa $A$ và $B$ nên $AB=AD+DB=5+7{,}5=12{,}5$.
Xét $\triangle ABC$ có $DE\parallel BC$ (gt)
nên $\dfrac{DE}{BC}=\dfrac{AD}{AB}$ (hệ quả của định lí Thalès).
Hay $\dfrac{6{,}4}{x}=\dfrac{5}{12{,}5}$.
Suy ra $x=\dfrac{6{,}4\cdot12{,}5}{5}=16$.
Vậy $x=16$.
**hinh:** NDT-H3-11.png
**nghi_van:**

### NDT-H3.12 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.12@p169 · tầng cơ bản
**sach:** Thalès đảo từ $\dfrac{AD}{DB}=\dfrac{AE}{EC}$ ra $DE\parallel BC$, rồi hệ quả của định lí Thalès. Không có đường phụ.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Lấy điểm $D$ trên cạnh $AB$, điểm $E$ trên cạnh $AC$ sao cho $\dfrac{AD}{DB}=\dfrac{AE}{EC}$. Chứng minh rằng $\dfrac{AD}{AB}=\dfrac{DE}{BC}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** từ $\dfrac{AD}{DB}=\dfrac{AE}{EC}$ dùng định lí Thalès đảo để có $DE\parallel BC$, rồi hệ quả của định lí Thalès cho $\dfrac{AD}{AB}=\dfrac{DE}{BC}$.

- n1 | - | $DE\parallel BC$ | gt | định lí Thalès đảo
- n2 | - | $\dfrac{AD}{AB}=\dfrac{DE}{BC}$ | n1 | hệ quả của định lí Thalès

**Phần 2. Trình bày**
[[so-do:n1]]
Xét $\triangle ABC$ có:
$D\in AB$, $E\in AC$ (gt);
$\dfrac{AD}{DB}=\dfrac{AE}{EC}$ (gt)
nên $DE\parallel BC$ (định lí Thalès đảo).
[[so-do:n2]]
Xét $\triangle ABC$ có $DE\parallel BC$ (cmt)
nên $\dfrac{AD}{AB}=\dfrac{DE}{BC}$ (hệ quả của định lí Thalès).
**hinh:** NDT-H3-12.png
**nghi_van:** Sách ghi "(h.42)" trong lời giải; đã bỏ. Hình đề vẽ $DE\parallel BC$ vì điều đó là hệ quả trực tiếp của giả thiết.

### NDT-H3.13 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.13@p169-170 · tầng cơ bản
**sach:** Hệ quả của định lí Thalès hai lần, ở $\triangle MDK$ ($AB\parallel DK$) và $\triangle MAD$ ($BN\parallel AD$); ý b rút từ hai tỉ lệ thức ở ý a. Không có đường phụ; cũng không dùng đồng dạng.
**loai:** nhieu_y
**loi_dan:**
Cho hình bình hành $ABCD$. Qua $A$ vẽ tia $Ax$ cắt $BD$ tại $M$, cắt cạnh $BC$ tại $N$ và cắt đường thẳng $CD$ tại $K$.
**hinh:** NDT-H3-13.png
#### y a
**loai_cau:** tra_loi_ngan
**dap_an:** $\dfrac{MB}{MD}=\dfrac{MA}{MK}$ và $\dfrac{MB}{MD}=\dfrac{MN}{MA}$
**cau_hoi:** So sánh $\dfrac{MB}{MD}$ với $\dfrac{MA}{MK}$ và so sánh $\dfrac{MB}{MD}$ với $\dfrac{MN}{MA}$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hình bình hành cho hai cặp cạnh đối song song, $AB\parallel CD$ và $AD\parallel BC$. Mỗi cặp song song cắt hai đường thẳng đi qua $M$ nên cho một tỉ lệ thức theo hệ quả của định lí Thalès, với $M$ là đỉnh chung.
**Bước 1.** Chọn tam giác có đỉnh $M$ chứa $MB$, $MD$, $MA$, $MK$: đó là $\triangle MDK$. Đường thẳng $AB$ cắt hai đường thẳng $MD$, $MK$ tại $B$, $A$. Vì $K\in CD$ nên $AB\parallel DK$, đủ điều kiện dùng hệ quả.
**Bước 2.** Chọn tam giác có đỉnh $M$ chứa $MB$, $MD$, $MN$, $MA$: đó là $\triangle MAD$. Đường thẳng $BN$ cắt hai đường thẳng $MD$, $MA$ tại $B$, $N$. Vì $N\in BC$ nên $BN\parallel AD$.
**Bước 3.** Hai tỉ số $\dfrac{MB}{MD}$ lập ra ở hai tam giác là cùng một tỉ số, nên so sánh được với $\dfrac{MA}{MK}$ và $\dfrac{MN}{MA}$.
**Chú ý:** ở cả hai tam giác, đường thẳng song song cắt phần kéo dài của hai cạnh về phía đỉnh $M$ ($M$ nằm giữa $B$ và $D$, giữa $A$ và $N$, giữa $A$ và $K$). Hệ quả của định lí Thalès vẫn đúng trong trường hợp này.

**Phần 2. Trình bày**
Vì $ABCD$ là hình bình hành nên $AB\parallel CD$ và $AD\parallel BC$ (định nghĩa hình bình hành).
Mà $K\in CD$ nên $AB\parallel DK$;
mà $N\in BC$ nên $AD\parallel BN$.
Xét $\triangle MDK$ có $AB\parallel DK$ ($A\in MK$, $B\in MD$)
nên $\dfrac{MB}{MD}=\dfrac{MA}{MK}$ (hệ quả của định lí Thalès). (1)
Xét $\triangle MAD$ có $BN\parallel AD$ ($B\in MD$, $N\in MA$)
nên $\dfrac{MB}{MD}=\dfrac{MN}{MA}$ (hệ quả của định lí Thalès). (2)
Vậy $\dfrac{MB}{MD}=\dfrac{MA}{MK}$ và $\dfrac{MB}{MD}=\dfrac{MN}{MA}$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $MA^2=MN\cdot MK$.
**da_biet:** Biết $\dfrac{MB}{MD}=\dfrac{MA}{MK}$ và $\dfrac{MB}{MD}=\dfrac{MN}{MA}$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** ý a cho $\dfrac{MA}{MK}$ và $\dfrac{MN}{MA}$ cùng bằng $\dfrac{MB}{MD}$; nối hai tỉ số lại rồi nhân chéo ra $MA^2=MN\cdot MK$.

- n1 | - | $\dfrac{MA}{MK}=\dfrac{MN}{MA}$ | gt | kết quả ý a: hai tỉ số cùng bằng $\dfrac{MB}{MD}$
- n2 | - | $MA^2=MN\cdot MK$ | n1 | tính chất tỉ lệ thức

**Phần 2. Trình bày**
[[so-do:n1]]
Ta có $\dfrac{MA}{MK}=\dfrac{MB}{MD}$ (ý a) và $\dfrac{MN}{MA}=\dfrac{MB}{MD}$ (ý a).
Suy ra $\dfrac{MA}{MK}=\dfrac{MN}{MA}$.
[[so-do:n2]]
Do đó $MA\cdot MA=MN\cdot MK$ (tính chất tỉ lệ thức).
Vậy $MA^2=MN\cdot MK$.
**nghi_van:** Đề sách ghi tia $Ax$ "cắt $CD$ ở $K$"; thực ra $K$ nằm trên đường thẳng $CD$, ngoài đoạn $CD$ (phía $C$) — hình sách và lời giải cùng cho thấy vậy; đã sửa thành "đường thẳng $CD$" và "cạnh $BC$" cho $N$. Ý a của sách gồm hai lần so sánh; giữ thành một ý.

### NDT-H3.14 → HH00127
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H3.14@p170 · tầng cơ bản
**sach:** Hệ quả của định lí Thalès ở $\triangle ABM$ ($DN\parallel BM$) và $\triangle AMC$ ($NE\parallel MC$); ý b dùng $BM=MC$. Không có đường phụ.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác $ABC$, $AM$ là đường trung tuyến. Đường thẳng song song với $BC$ cắt các đoạn thẳng $AB$, $AM$, $AC$ lần lượt tại $D$, $N$, $E$.
**hinh:** NDT-H3-14.png
#### y a
**loai_cau:** tra_loi_ngan
**dap_an:** $\dfrac{DN}{BM}=\dfrac{AN}{AM}$ và $\dfrac{NE}{MC}=\dfrac{AN}{AM}$
**cau_hoi:** So sánh $\dfrac{DN}{BM}$ với $\dfrac{AN}{AM}$ và so sánh $\dfrac{NE}{MC}$ với $\dfrac{AN}{AM}$.
**da_biet:**
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** đường thẳng $DE$ song song với $BC$ nên cũng song song với $BM$ và $MC$ (các đoạn nằm trên $BC$). Ta thấy hai tam giác có chung đỉnh $A$ và có cạnh $AM$: $\triangle ABM$ và $\triangle AMC$, mỗi tam giác bị $DE$ cắt hai cạnh.
**Bước 1.** Trong $\triangle ABM$, đường thẳng $DE$ cắt $AB$ tại $D$ và $AM$ tại $N$, lại song song với cạnh $BM$. Hệ quả của định lí Thalès cho tỉ số $DN$ trên $BM$.
**Bước 2.** Trong $\triangle AMC$, đường thẳng $DE$ cắt $AM$ tại $N$ và $AC$ tại $E$, song song với cạnh $MC$. Hệ quả của định lí Thalès cho tỉ số $NE$ trên $MC$.
**Bước 3.** Cả hai tỉ số đều viết được qua $\dfrac{AN}{AM}$, vì $N$ là điểm chung trên cạnh $AM$ của hai tam giác.
**Chú ý:** viết đúng thứ tự: đoạn trên đường song song trên cạnh đáy tương ứng.

**Phần 2. Trình bày**
Vì $DE\parallel BC$ (gt) và $B$, $M$, $C$ thẳng hàng nên $DN\parallel BM$ và $NE\parallel MC$.
Xét $\triangle ABM$ có $DN\parallel BM$ ($D\in AB$, $N\in AM$)
nên $\dfrac{DN}{BM}=\dfrac{AN}{AM}$ (hệ quả của định lí Thalès).
Xét $\triangle AMC$ có $NE\parallel MC$ ($N\in AM$, $E\in AC$)
nên $\dfrac{NE}{MC}=\dfrac{AN}{AM}$ (hệ quả của định lí Thalès).
Vậy $\dfrac{DN}{BM}=\dfrac{AN}{AM}$ và $\dfrac{NE}{MC}=\dfrac{AN}{AM}$.
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $N$ là trung điểm của $DE$.
**da_biet:** Biết $\dfrac{DN}{BM}=\dfrac{AN}{AM}$ và $\dfrac{NE}{MC}=\dfrac{AN}{AM}$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** ý a cho $\dfrac{DN}{BM}$ và $\dfrac{NE}{MC}$ cùng bằng $\dfrac{AN}{AM}$; vì $BM=MC$ nên $DN=NE$, rồi $N$ nằm giữa $D$, $E$ nên là trung điểm.

- n1 | - | $\dfrac{DN}{BM}=\dfrac{NE}{MC}$ | gt | kết quả ý a: cùng bằng $\dfrac{AN}{AM}$
- n2 | - | $DN=NE$ | n1, gt | $BM=MC$ ($AM$ là trung tuyến)
- n3 | - | $N$ là trung điểm của $DE$ | n2 | định nghĩa trung điểm ($N$ nằm giữa $D$, $E$)

**Phần 2. Trình bày**
[[so-do:n1]]
Ta có $\dfrac{DN}{BM}=\dfrac{AN}{AM}$ và $\dfrac{NE}{MC}=\dfrac{AN}{AM}$ (ý a)
nên $\dfrac{DN}{BM}=\dfrac{NE}{MC}$.
[[so-do:n2]]
Mà $BM=MC$ ($AM$ là đường trung tuyến) (gt)
nên $DN=NE$.
[[so-do:n3]]
Vì $D\in AB$, $E\in AC$ nằm khác phía đối với đường thẳng $AM$ nên $N$ (giao điểm của $DE$ và $AM$) nằm giữa $D$ và $E$.
Vậy $N$ là trung điểm của $DE$.
**nghi_van:**
