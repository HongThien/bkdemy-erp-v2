# ĐỀ | Đề kiểm tra cuối học kì 1 Toán 9 năm 2025-2026 — THCS Trưng Vương
nam: 2025
bo_sach: KNTT

## PHẦN 1 | Tự luận | tu_luan

### Bài 1 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho hai biểu thức $A=\dfrac{\sqrt{x}-1}{\sqrt{x}-2}$ và $B=\dfrac{3x+1}{x-1}-\dfrac{2\sqrt{x}}{\sqrt{x}+1}-\dfrac{1}{\sqrt{x}-1}$ với $x\ge0$, $x\ne4$, $x\ne1$.
1) Tính giá trị của biểu thức $A$ khi $x=16$.
2) Chứng minh $B=\dfrac{\sqrt{x}}{\sqrt{x}-1}$.
3) Xét biểu thức $P=A\cdot B$. Tìm $x$ để $|P|-P=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu của phân thức đầu trong $B$ là $x-1=(\sqrt{x}-1)(\sqrt{x}+1)$, nên quy đồng được về một mẫu; còn ở ý 3, điều kiện $|P|-P=0$ chỉ là một điều kiện về **dấu** của $P$.

**Bước 1.** Ý 1: kiểm tra $x=16$ thoả mãn điều kiện xác định rồi thay vào $A$, nhớ $\sqrt{16}=4$.

**Bước 2.** Ý 2: phân tích mẫu $x-1$ thành $(\sqrt{x}-1)(\sqrt{x}+1)$ và quy đồng ba phân thức của $B$ về mẫu chung đó.

**Bước 3.** Ý 2: cộng trừ các tử (chú ý dấu trừ trước hai phân thức sau), thu gọn, phân tích tử thành nhân tử rồi rút gọn cho $\sqrt{x}+1$.

**Bước 4.** Ý 3: nhân $A$ với $B$, rút gọn thừa số chung $\sqrt{x}-1$ (khác $0$ vì $x\ne1$) để được $P$ gọn hơn.

**Bước 5.** Ý 3: nhận ra $|P|-P=0$ xảy ra khi $P\ge0$ (còn $P<0$ thì $|P|-P\ne0$), rồi xét riêng trường hợp tử bằng $0$ và trường hợp tử dương; đối chiếu điều kiện của $x$.

**Chú ý:** ở ý 3 đừng bỏ sót giá trị làm tử $\sqrt{x}=0$, vì khi đó $P=0$ vẫn thoả mãn.

**Phần 2. Trình bày**

1) Với $x=16$ (thoả mãn điều kiện) ta có $\sqrt{x}=4$.

$A=\dfrac{4-1}{4-2}$

$A=\dfrac{3}{2}$

Vậy $A=\dfrac{3}{2}$ khi $x=16$.

2) Với $x\ge0$, $x\ne1$, ta có $x-1=(\sqrt{x}-1)(\sqrt{x}+1)$ nên:

$B=\dfrac{3x+1}{(\sqrt{x}-1)(\sqrt{x}+1)}-\dfrac{2\sqrt{x}(\sqrt{x}-1)}{(\sqrt{x}+1)(\sqrt{x}-1)}-\dfrac{\sqrt{x}+1}{(\sqrt{x}-1)(\sqrt{x}+1)}$

$B=\dfrac{3x+1-2\sqrt{x}(\sqrt{x}-1)-(\sqrt{x}+1)}{(\sqrt{x}-1)(\sqrt{x}+1)}$

$B=\dfrac{3x+1-2x+2\sqrt{x}-\sqrt{x}-1}{(\sqrt{x}-1)(\sqrt{x}+1)}$

$B=\dfrac{x+\sqrt{x}}{(\sqrt{x}-1)(\sqrt{x}+1)}$

$B=\dfrac{\sqrt{x}(\sqrt{x}+1)}{(\sqrt{x}-1)(\sqrt{x}+1)}$

$B=\dfrac{\sqrt{x}}{\sqrt{x}-1}$

Vậy $B=\dfrac{\sqrt{x}}{\sqrt{x}-1}$.

3) Với $x\ge0$, $x\ne1$, $x\ne4$, ta có:

$P=A\cdot B=\dfrac{\sqrt{x}-1}{\sqrt{x}-2}\cdot\dfrac{\sqrt{x}}{\sqrt{x}-1}$

$P=\dfrac{\sqrt{x}}{\sqrt{x}-2}$

Nếu $P\ge0$ thì $|P|=P$ nên $|P|-P=0$.

Nếu $P<0$ thì $|P|=-P$ nên $|P|-P=-2P\ne0$.

Do đó $|P|-P=0$ khi và chỉ khi $P\ge0$.

Trường hợp $x=0$: $P=0$ nên thoả mãn.

Trường hợp $x>0$: $\sqrt{x}>0$ nên $P\ge0$ khi mẫu $\sqrt{x}-2>0$, tức là $\sqrt{x}>2$, suy ra $x>4$ (thoả mãn điều kiện).

Vậy $|P|-P=0$ khi $x=0$ hoặc $x>4$.

### Bài 2.1 | kho=dai | loai=tra_loi_ngan | dap_an=17
**Đề:** Trong khuôn khổ sự kiện Trưng Vương Fiesta, các lớp tổ chức vòng loại để chọn ra những học sinh xuất sắc tham gia cuộc thi "Rung Chuông Vàng" cấp trường.
Mỗi thí sinh phải trả lời $20$ câu hỏi. Quy định chấm điểm như sau:
- Mỗi câu trả lời đúng được cộng $5$ điểm.
- Mỗi câu trả lời sai hoặc không trả lời bị trừ $2$ điểm.
Một thí sinh được chọn vào vòng thi cấp trường nếu đạt ít nhất $74$ điểm. Hỏi thí sinh cần trả lời đúng tối thiểu bao nhiêu câu để đủ điều kiện vào vòng trường?

**Phần 1. Hướng dẫn**

**Mấu chốt:** chỉ cần một ẩn là số câu trả lời đúng, vì số câu còn lại là $20$ trừ đi số đó; "ít nhất $74$ điểm" cho ta một bất phương trình bậc nhất.

**Bước 1.** Gọi $x$ là số câu trả lời đúng và biểu diễn số câu sai hoặc bỏ trống qua $x$, vì tổng số câu là $20$.

**Bước 2.** Viết tổng điểm bằng cách cộng điểm các câu đúng và trừ điểm các câu còn lại, rồi thu gọn thành biểu thức bậc nhất của $x$.

**Bước 3.** Lập bất phương trình "tổng điểm không nhỏ hơn $74$" và giải, chú ý chuyển vế và chia hai vế cho số dương.

**Bước 4.** Vì $x$ là số tự nhiên nên chọn số nguyên nhỏ nhất thoả bất phương trình, rồi thử lại bằng cách tính điểm của hai giá trị liền kề.

**Phần 2. Trình bày**

Gọi $x$ là số câu thí sinh trả lời đúng ($x$ là số tự nhiên, $x\le20$).

Số câu trả lời sai hoặc không trả lời là $20-x$.

Số điểm thí sinh đạt được là $5x-2(20-x)=7x-40$.

Để được chọn vào vòng thi cấp trường thì $7x-40\ge74$.

$7x\ge114$

$x\ge\dfrac{114}{7}$

Vì $7\cdot16=112<114\le119=7\cdot17$ và $x$ là số tự nhiên nên $x\ge17$.

Thử lại: trả lời đúng $17$ câu được $5\cdot17-2\cdot3=79\ge74$; trả lời đúng $16$ câu chỉ được $5\cdot16-2\cdot4=72<74$.

Vậy thí sinh cần trả lời đúng tối thiểu $17$ câu.

### Bài 2.2 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Dọc hai bờ sông Hồng là gần $30$ di tích lịch sử - văn hóa và hàng chục làng nghề truyền thống. Để đánh thức du lịch sông Hồng, thủ đô Hà Nội đã ra mắt nhiều tour du thuyền trên sông.
- Tour "Chào Đón Ánh Dương" du thuyền xuôi dòng $25$ km, ngược dòng $15$ km hết $2$ giờ $45$ phút.
- Tour "Vệt Nắng Hoàng Hôn" du thuyền xuôi dòng $30$ km, ngược dòng $20$ km hết $3$ giờ $30$ phút.
Tính vận tốc riêng của du thuyền và vận tốc dòng nước chảy (biết vận tốc riêng của du thuyền và vận tốc dòng nước chảy không đổi).

**Phần 1. Hướng dẫn**

**Mấu chốt:** thời gian bằng quãng đường chia vận tốc, mà vận tốc xuôi dòng là $x+y$ còn ngược dòng là $x-y$; hai vận tốc này nằm ở mẫu nên đặt ẩn phụ là nghịch đảo của chúng để được hệ bậc nhất.

**Bước 1.** Gọi vận tốc riêng của du thuyền và vận tốc dòng nước là hai ẩn, nêu điều kiện (du thuyền còn đi ngược dòng được nên vận tốc riêng lớn hơn vận tốc dòng nước), rồi viết vận tốc xuôi dòng và ngược dòng.

**Bước 2.** Đổi thời gian của hai tour ra giờ, rồi mỗi tour lập một phương trình: thời gian xuôi dòng cộng thời gian ngược dòng bằng tổng thời gian.

**Bước 3.** Hệ có ẩn ở mẫu nên đặt hai ẩn phụ là nghịch đảo của vận tốc xuôi và ngược; giải hệ bậc nhất hai ẩn mới bằng phương pháp cộng đại số.

**Bước 4.** Trở lại hai ẩn ban đầu bằng cách giải hệ gồm tổng và hiệu hai ẩn, đối chiếu điều kiện rồi trả lời đủ hai câu hỏi kèm đơn vị.

**Phần 2. Trình bày**

Gọi $x$ (km/h) là vận tốc riêng của du thuyền, $y$ (km/h) là vận tốc dòng nước, điều kiện $x>y>0$.

Vận tốc khi xuôi dòng là $x+y$ (km/h); vận tốc khi ngược dòng là $x-y$ (km/h).

Đổi $2$ giờ $45$ phút $=\dfrac{11}{4}$ giờ; $3$ giờ $30$ phút $=\dfrac{7}{2}$ giờ.

Theo đề bài ta có hệ phương trình:

$\begin{cases} \dfrac{25}{x+y}+\dfrac{15}{x-y}=\dfrac{11}{4} \\ \dfrac{30}{x+y}+\dfrac{20}{x-y}=\dfrac{7}{2} \end{cases}$

Đặt $u=\dfrac{1}{x+y}$, $v=\dfrac{1}{x-y}$ ($u>0$, $v>0$). Hệ trở thành:

$\begin{cases} 25u+15v=\dfrac{11}{4} \\ 30u+20v=\dfrac{7}{2} \end{cases}$

Nhân hai vế của phương trình thứ nhất với $4$, của phương trình thứ hai với $2$, ta được:

$\begin{cases} 100u+60v=11 \\ 60u+40v=7 \end{cases}$

Nhân hai vế của phương trình thứ nhất với $2$, của phương trình thứ hai với $3$, ta được:

$\begin{cases} 200u+120v=22 \\ 180u+120v=21 \end{cases}$

Trừ từng vế hai phương trình của hệ mới, ta được $20u=1$ nên $u=\dfrac{1}{20}$.

Thay $u=\dfrac{1}{20}$ vào $60u+40v=7$, ta được $3+40v=7$ nên $v=\dfrac{1}{10}$.

Suy ra $x+y=20$ và $x-y=10$.

Cộng từng vế hai phương trình này, ta được $2x=30$ nên $x=15$; khi đó $y=20-15=5$.

Hai giá trị $x=15$, $y=5$ thoả mãn điều kiện $x>y>0$.

Vậy vận tốc riêng của du thuyền là $15$ km/h và vận tốc dòng nước chảy là $5$ km/h.

### Bài 3 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Một chiếc đồng hồ quả lắc có thanh treo con lắc dài $60$ cm. Khi hoạt động ổn định, đầu con lắc dao động qua lại trên một mặt phẳng và quét nên một cung tròn có tâm là điểm treo con lắc với góc ở tâm là $30^\circ$.
1) Tính độ dài quãng đường con lắc di chuyển từ điểm $A$ đến điểm $B$ (lấy $\pi\approx3{,}14$).
2) Khi sửa chiếc đồng hồ này, các thiết bị kiểm tra chuyên dụng cho biết: con lắc bắt đầu di chuyển từ điểm $A$ được $339{,}12$ cm thì đột ngột dừng lại tại điểm $D$. Hỏi lúc này con lắc lệch bao nhiêu độ so với phương thẳng đứng?
**Hình:** p1c3.png
**Chưa chắc:** đề tự dùng "góc ở tâm $30^\circ$" và hỏi độ dài cung, tức cần kiến thức độ dài cung – số đo cung (nằm trong danh sách cấm của bản áp dụng nhưng không thể tránh). Đã làm bằng tỉ lệ với chu vi đường tròn, không dùng công thức $\dfrac{\pi Rn}{180}$ — CEO quyết có cho dùng công thức độ dài cung ở đề này không. Ý 2 hiểu: con lắc đi qua lại giữa $A$ và $B$ (mỗi lượt $31{,}4$ cm), phương thẳng đứng $OC$ chia đôi góc $AOB$ như hình vẽ.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cung có góc ở tâm $30^\circ$ chiếm $\dfrac{30}{360}$ đường tròn nên độ dài cung tỉ lệ với góc ở tâm; ở ý 2, quãng đường $339{,}12$ cm gồm một số lượt đi qua lại trọn vẹn cộng một đoạn lẻ.

**Bước 1.** Ý 1: đầu con lắc vạch cung của đường tròn tâm $O$ bán kính $60$ cm, nên tính chu vi đường tròn đó rồi lấy phần ứng với góc ở tâm $30^\circ$.

**Bước 2.** Ý 2: chia $339{,}12$ cho độ dài cung $AB$ để biết con lắc đã đi qua lại trọn mấy lượt; số lượt chẵn thì con lắc đang trở về đúng điểm xuất phát $A$.

**Bước 3.** Ý 2: đoạn đường lẻ còn lại tính từ $A$ là cung $AD$; đổi độ dài cung này thành góc ở tâm bằng cách so với chu vi đường tròn.

**Bước 4.** Ý 2: phương thẳng đứng $OC$ chia đôi góc $AOB$, nên so góc $AOD$ với góc $AOC$ để biết $D$ ở phía nào của $C$ và lệch bao nhiêu độ.

**Chú ý:** ở ý 2 phải đổi thành số lượt đi qua lại trước, không lấy $339{,}12$ đem chia thẳng cho chu vi cả đường tròn.

**Phần 2. Trình bày**

1) Chu vi đường tròn tâm $O$ bán kính $60$ cm là $2\cdot3{,}14\cdot60=376{,}8$ (cm).

Cung $AB$ có góc ở tâm $30^\circ$ nên bằng $\dfrac{30}{360}=\dfrac{1}{12}$ đường tròn.

Độ dài cung $AB$ là $376{,}8:12=31{,}4$ (cm).

Vậy quãng đường con lắc di chuyển từ $A$ đến $B$ dài $31{,}4$ cm.

2) Ta có $339{,}12:31{,}4=10{,}8$ nên con lắc đã đi qua lại trọn $10$ lượt ($A$ đến $B$, rồi $B$ về $A$, …) với quãng đường $10\cdot31{,}4=314$ (cm).

Sau $10$ lượt (số chẵn) con lắc trở về điểm $A$.

Quãng đường con lắc đi tiếp từ $A$ là $339{,}12-314=25{,}12$ (cm), tức cung $AD$ dài $25{,}12$ cm.

Vì $25{,}12:376{,}8=\dfrac{1}{15}$ nên cung $AD$ bằng $\dfrac{1}{15}$ đường tròn, do đó $\widehat{AOD}=\dfrac{1}{15}\cdot360^\circ=24^\circ$.

Phương thẳng đứng $OC$ chia đôi góc $AOB$ nên $\widehat{AOC}=30^\circ:2=15^\circ$.

Vì $24^\circ>15^\circ$ nên $D$ nằm giữa $C$ và $B$, do đó $\widehat{COD}=24^\circ-15^\circ=9^\circ$.

Vậy lúc này con lắc lệch $9^\circ$ so với phương thẳng đứng (về phía $B$).

### Bài 4 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O;R)$ đường kính $AB$. Từ $A$ kẻ tiếp tuyến $Ax$ với đường tròn $(O)$. Trên tia $Ax$ lấy điểm $M$ sao cho $MA>R$. Từ $M$ kẻ tiếp tuyến $MC$ với đường tròn $(O)$ ($C$ là tiếp điểm).
1) Chứng minh bốn điểm $A, O, C, M$ cùng thuộc một đường tròn.
2) Gọi $E$ là giao điểm của $MB$ với đường tròn tâm $O$. Chứng minh $OM$ song song với $BC$ và $\widehat{BMO}=\widehat{CAE}$.
3) Từ $B$ kẻ tiếp tuyến $By$ với đường tròn $(O)$. Đường thẳng qua $O$ và song song với $AC$ cắt $By$ tại $D$. Gọi $I$ là trung điểm của $OB$. Chứng minh $MB$ vuông góc với $ID$.
**Hình giải:** giai_bai4.png
**Ghi chú:** ở ý 2, $E$ là giao điểm thứ hai của $MB$ với $(O)$ (khác $B$).
**Chưa chắc:** ý 2 (chứng minh $\widehat{BMO}=\widehat{CAE}$) thông thường làm bằng góc nội tiếp (cùng chắn cung $CE$), mà góc nội tiếp bị cấm ở bản áp dụng. Đã tự chứng minh bằng tam giác vuông, tam giác đồng dạng và góc ngoài của tam giác — CEO quyết có cho dùng góc nội tiếp ở đề này không. Hình giải dựng với $MA=1{,}6R$, chỉ để minh hoạ.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tiếp tuyến vuông góc với bán kính tại tiếp điểm, và hai tiếp tuyến cắt nhau tại $M$ cho $MA=MC$, $MO\perp AC$; từ đó mọi ý đều quy về các tam giác vuông và đồng dạng.

**Bước 1.** Ý 1: muốn bốn điểm cùng thuộc một đường tròn, tìm một điểm cách đều cả bốn; hai tam giác vuông $MAO$ và $MCO$ có chung cạnh huyền $OM$ nên trung điểm của $OM$ là điểm cần tìm.

**Bước 2.** Ý 2 (song song): muốn $OM\parallel BC$, chỉ ra cả hai cùng vuông góc với $AC$; $OM\perp AC$ nhờ tính chất hai tiếp tuyến cắt nhau, còn $BC\perp AC$ chứng minh bằng hai tam giác cân $OAC$, $OBC$.

**Bước 3.** Ý 2 (hai góc): muốn $\widehat{BMO}=\widehat{CAE}$, viết $\widehat{CAE}=\widehat{MAC}-\widehat{MAE}$; $\widehat{MAC}$ bằng $\widehat{AOM}$ và $\widehat{MAE}$ bằng $\widehat{ABM}$ (các cặp góc cùng phụ với một góc), rồi dùng góc ngoài của tam giác $OMB$ tại $O$.

**Bước 4.** Ý 3: muốn $MB\perp ID$, ta có $AE\perp MB$ (vì $E$ thuộc đường tròn đường kính $AB$) nên chỉ cần chứng minh $ID\parallel AE$, tức là $\widehat{BID}=\widehat{BAE}$ (đồng vị).

**Bước 5.** Ý 3: các góc này cùng phụ với $\widehat{BDI}$ và $\widehat{ABM}$, nên cần $\widehat{ABM}=\widehat{BDI}$; muốn vậy chứng minh hai tam giác vuông $MAB$ và $IBD$ đồng dạng, và cần có $MA\cdot BD=R^2$.

**Bước 6.** Ý 3: hệ thức $MA\cdot BD=R^2$ có từ hai tam giác vuông $MAO$ và $OBD$ đồng dạng, với $\widehat{BOD}=\widehat{AMO}$ nhờ $OD\parallel AC$ (đồng vị) và $OM\perp AC$.

**Phần 2. Trình bày**

1) Vì $Ax$ là tiếp tuyến của $(O)$ tại $A$ nên $Ax\perp OA$, suy ra $\triangle MAO$ vuông tại $A$.

Vì $MC$ là tiếp tuyến của $(O)$ tại $C$ nên $MC\perp OC$, suy ra $\triangle MCO$ vuông tại $C$.

Gọi $K$ là trung điểm của $OM$.

Tam giác $MAO$ vuông tại $A$ có $K$ là trung điểm của cạnh huyền $OM$ nên $K$ là tâm đường tròn ngoại tiếp tam giác đó, do đó $KA=KO=KM$.

Tương tự, tam giác $MCO$ vuông tại $C$ nên $KC=KO=KM$.

Suy ra $KA=KO=KC=KM$.

Vậy bốn điểm $A, O, C, M$ cùng thuộc đường tròn tâm $K$ đường kính $OM$.

2) Chứng minh $OM\parallel BC$.

Vì $MA$, $MC$ là hai tiếp tuyến của $(O)$ cắt nhau tại $M$ nên $MA=MC$. Lại có $OA=OC=R$. Do đó $MO$ là đường trung trực của $AC$.

Gọi $H$ là giao điểm của $MO$ và $AC$, khi đó $H$ là trung điểm của $AC$ và $MO\perp AC$ tại $H$. (1)

Xét tam giác $ABC$: $OA=OB=OC=R$.

$\triangle OAC$ cân tại $O$ nên $\widehat{OAC}=\widehat{OCA}$.

$\triangle OBC$ cân tại $O$ nên $\widehat{OBC}=\widehat{OCB}$.

Vì $O$ nằm giữa $A$ và $B$ nên $\widehat{ACB}=\widehat{OCA}+\widehat{OCB}=\widehat{CAB}+\widehat{CBA}$.

Tổng ba góc của tam giác $ABC$ bằng $180^\circ$ nên $2\widehat{ACB}=180^\circ$, suy ra $\widehat{ACB}=90^\circ$, tức là $BC\perp AC$. (2)

Từ (1) và (2) suy ra $OM\parallel BC$ (cùng vuông góc với $AC$).

Chứng minh $\widehat{BMO}=\widehat{CAE}$.

Vì $E$ thuộc $(O)$ nên $OE=OA=OB$. Lập luận như ở (2) cho tam giác $ABE$ ta được $\widehat{AEB}=90^\circ$, tức là $AE\perp MB$ tại $E$. (3)

Tam giác $MAO$ vuông tại $A$ nên $\widehat{AMO}+\widehat{AOM}=90^\circ$.

Tam giác $MAH$ vuông tại $H$ (theo (1)) nên $\widehat{AMH}+\widehat{MAH}=90^\circ$.

Vì $H$ thuộc đoạn $MO$ nên $\widehat{AMH}=\widehat{AMO}$, suy ra $\widehat{MAH}=\widehat{AOM}$.

Vì $H$ thuộc đoạn $AC$ nên $\widehat{MAC}=\widehat{MAH}$. Vậy $\widehat{MAC}=\widehat{AOM}$. (4)

Vì $E$ nằm trên đoạn $MB$ nên tia $AE$ nằm trong góc $\widehat{MAB}=90^\circ$, do đó $\widehat{MAE}+\widehat{EAB}=90^\circ$.

Tam giác $AEB$ vuông tại $E$ (theo (3)) nên $\widehat{EAB}+\widehat{ABE}=90^\circ$.

Suy ra $\widehat{MAE}=\widehat{ABE}=\widehat{ABM}$. (5)

Góc $\widehat{AOM}$ là góc ngoài của tam giác $OMB$ tại $O$ (vì $A$, $O$, $B$ thẳng hàng) nên $\widehat{AOM}=\widehat{OMB}+\widehat{OBM}$.

Mà $\widehat{OBM}=\widehat{ABM}$ nên $\widehat{AOM}-\widehat{ABM}=\widehat{OMB}$. (6)

Từ (4), (5), (6) ta có $\widehat{MAC}-\widehat{MAE}=\widehat{OMB}>0$, nên $\widehat{MAC}>\widehat{MAE}$.

Hai tia $AC$, $AE$ cùng nằm trong góc $\widehat{MAB}$ nên tia $AE$ nằm giữa hai tia $AM$ và $AC$. Do đó $\widehat{CAE}=\widehat{MAC}-\widehat{MAE}=\widehat{OMB}$.

Vậy $\widehat{BMO}=\widehat{CAE}$.

3) Vì $OD\parallel AC$ và $OM\perp AC$ (theo (1)) nên $OM\perp OD$.

Vì $By$ là tiếp tuyến của $(O)$ tại $B$ nên $By\perp AB$, suy ra $\triangle OBD$ vuông tại $B$.

Vì $OD\parallel AC$ nên $\widehat{BOD}=\widehat{BAC}$ (hai góc đồng vị, $D$ và $C$ cùng phía đối với $AB$).

Trong tam giác $OAH$ vuông tại $H$: $\widehat{BAC}=\widehat{OAH}=90^\circ-\widehat{AOH}=90^\circ-\widehat{AOM}$.

Trong tam giác $MAO$ vuông tại $A$: $90^\circ-\widehat{AOM}=\widehat{AMO}$.

Suy ra $\widehat{BOD}=\widehat{AMO}$. (7)

Xét $\triangle MAO$ và $\triangle OBD$ có:

$\widehat{MAO}=\widehat{OBD}=90^\circ$

$\widehat{AMO}=\widehat{BOD}$ (theo (7))

Do đó $\triangle MAO\backsim\triangle OBD$ (g.g), suy ra $\dfrac{MA}{OB}=\dfrac{AO}{BD}$, tức là $MA\cdot BD=OA\cdot OB=R^2$. (8)

Vì $I$ là trung điểm của $OB$ nên $IB=\dfrac{R}{2}$, lại có $AB=2R$.

Từ (8) suy ra $\dfrac{MA}{IB}=\dfrac{2MA}{R}=\dfrac{2R}{BD}=\dfrac{AB}{BD}$.

Xét $\triangle MAB$ và $\triangle IBD$ có:

$\widehat{MAB}=\widehat{IBD}=90^\circ$

$\dfrac{MA}{IB}=\dfrac{AB}{BD}$

Do đó $\triangle MAB\backsim\triangle IBD$ (c.g.c), suy ra $\widehat{ABM}=\widehat{BDI}$. (9)

Tam giác $IBD$ vuông tại $B$ nên $\widehat{BID}=90^\circ-\widehat{BDI}=90^\circ-\widehat{ABM}$.

Tam giác $AEB$ vuông tại $E$ nên $\widehat{BAE}=90^\circ-\widehat{ABE}=90^\circ-\widehat{ABM}$.

Suy ra $\widehat{BID}=\widehat{BAE}$. Hai góc này ở vị trí đồng vị ($I$, $A$ cùng thuộc đường thẳng $AB$; $D$, $E$ cùng phía đối với $AB$) nên $ID\parallel AE$.

Mà $AE\perp MB$ (theo (3)) nên $ID\perp MB$.

Vậy $MB\perp ID$.

### Bài 5 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một mảnh vườn hình chữ nhật có chiều dài $20$ m, chiều rộng $15$ m. Bố An muốn phân hai khu vực hình vuông ở hai góc đối của mảnh vườn để thiết kế trang trí (hình minh họa). Để vừa đảm bảo tính thẩm mĩ, vừa tiết kiệm chi phí, mỗi khu vực có diện tích không nhỏ hơn $1\ \text{m}^2$ và tổng diện tích hai khu vực là $5\ \text{m}^2$. Ngoài ra để phân rõ hai khu vực trên với phần diện tích còn lại, bố An trồng hoa bao quanh cả bốn cạnh của mỗi khu vực:
- Khu vực I trồng hoa mười giờ với chi phí $30\,000$ đồng/mét.
- Khu vực II trồng hoa ngũ sắc với chi phí $70\,000$ đồng/mét.
Hỏi chi phí trồng hoa dao động từ ít nhất bao nhiêu tiền và nhiều nhất bao nhiêu tiền, để bố An có thể chủ động?
**Hình:** p2c5.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** gọi cạnh hai hình vuông là $a$, $b$ thì chi phí là một biểu thức bậc nhất của $a$ và $b$, trong khi điều kiện $a^2+b^2=5$ cùng hai diện tích không nhỏ hơn $1$ giới hạn $a$, $b$ trong một đoạn; bài toán thành tìm giá trị nhỏ nhất và lớn nhất của biểu thức đó.

**Bước 1.** Gọi cạnh khu vực I là $a$, cạnh khu vực II là $b$, viết các điều kiện về diện tích rồi suy ra $a$, $b$ nằm giữa hai số nào.

**Bước 2.** Tính chi phí mỗi khu vực bằng chu vi nhân đơn giá, cộng lại và đặt nhân tử chung để chỉ còn phải tìm giá trị lớn nhất, nhỏ nhất của biểu thức $3a+7b$.

**Bước 3.** Để tìm cận trên, xét hiệu giữa số cần so sánh và $3a+7b$, tách theo $a-1$ và $b-2$, rồi dùng $a^2+b^2=5$ để chuyển hiệu $2-b$ về $a$.

**Bước 4.** Làm tương tự để tìm cận dưới, tách hiệu theo $a-2$ và $b-1$, rồi đánh giá dấu của từng nhân tử nhờ $1\le a\le2$, $1\le b\le2$.

**Bước 5.** Chỉ ra giá trị của $a$, $b$ làm xảy ra dấu bằng ở mỗi cận để chắc các giá trị đó đạt được, rồi nhân với hệ số chung để ra số tiền.

**Chú ý:** hai cận chỉ đúng nếu cả hai khu vực đều có diện tích không nhỏ hơn $1\ \text{m}^2$; nếu bỏ điều kiện này thì $3a+7b$ còn có thể lớn hơn.

**Phần 2. Trình bày**

Gọi $a$ (m) là cạnh của khu vực I, $b$ (m) là cạnh của khu vực II ($a>0$, $b>0$).

Theo đề bài: $a^2\ge1$, $b^2\ge1$ và $a^2+b^2=5$.

Từ $a^2\ge1$ và $b^2\ge1$ ta có $a\ge1$, $b\ge1$.

Vì $a^2=5-b^2\le4$ nên $a\le2$; tương tự $b\le2$. Vậy $1\le a\le2$ và $1\le b\le2$.

Chi phí trồng hoa khu vực I là $4a\cdot30\,000=120\,000a$ (đồng).

Chi phí trồng hoa khu vực II là $4b\cdot70\,000=280\,000b$ (đồng).

Tổng chi phí là $T=120\,000a+280\,000b=40\,000(3a+7b)$ (đồng).

Đặt $S=3a+7b$.

Tìm giá trị lớn nhất của $S$:

$17-S=3(1-a)+7(2-b)$

Vì $a^2+b^2=5$ nên $4-b^2=a^2-1$, tức là $(2-b)(2+b)=(a-1)(a+1)$, suy ra $2-b=\dfrac{(a-1)(a+1)}{2+b}$.

$17-S=-3(a-1)+\dfrac{7(a-1)(a+1)}{2+b}$

$17-S=(a-1)\left[\dfrac{7(a+1)}{2+b}-3\right]$

Vì $a+1\ge2$ và $0<2+b\le4$ nên $\dfrac{7(a+1)}{2+b}\ge\dfrac{14}{4}=3{,}5>3$.

Do đó $\dfrac{7(a+1)}{2+b}-3>0$; mà $a-1\ge0$ nên $17-S\ge0$, hay $S\le17$.

Dấu "$=$" xảy ra khi $a=1$, khi đó $b=2$.

Tìm giá trị nhỏ nhất của $S$:

$S-13=3(a-2)+7(b-1)$

Vì $b^2-1=4-a^2$ nên $(b-1)(b+1)=(2-a)(2+a)$, suy ra $b-1=\dfrac{(2-a)(2+a)}{b+1}$.

$S-13=-3(2-a)+\dfrac{7(2-a)(2+a)}{b+1}$

$S-13=(2-a)\left[\dfrac{7(a+2)}{b+1}-3\right]$

Vì $a+2\ge3$ và $0<b+1\le3$ nên $\dfrac{7(a+2)}{b+1}\ge\dfrac{21}{3}=7>3$.

Do đó $\dfrac{7(a+2)}{b+1}-3>0$; mà $2-a\ge0$ nên $S-13\ge0$, hay $S\ge13$.

Dấu "$=$" xảy ra khi $a=2$, khi đó $b=1$.

Hai trường hợp xảy ra dấu bằng đều thoả mãn điều kiện đề bài: $a=1$, $b=2$ (có $1^2+2^2=5$) và $a=2$, $b=1$ (có $2^2+1^2=5$).

Vậy $13\le S\le17$, nên:

Chi phí ít nhất là $T=40\,000\cdot13=520\,000$ (đồng).

Chi phí nhiều nhất là $T=40\,000\cdot17=680\,000$ (đồng).

Vậy chi phí trồng hoa dao động từ $520\,000$ đồng đến $680\,000$ đồng.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bộ sách: KNTT (đoán theo nội dung đề). Đề 90 phút, 5 bài, không có phần trắc nghiệm. Phạm vi chạm tới: Chương III (rút gọn biểu thức chứa căn, Bài 1), Chương I – II (hệ phương trình, bất phương trình, Bài 2), Chương V (độ dài cung, Bài 3; tiếp tuyến, hai tiếp tuyến cắt nhau, Bài 4), bài cực trị thực tế đại số (Bài 5).
- Đề không có bảng đáp án in sẵn. Mọi đáp số đã thử lại bằng máy (script trong thư mục làm việc `tam\`).
- Bài II của đề gồm hai bài toán khác hẳn nhau (1, 2) ⇒ tách thành Bài 2.1 (trả lời ngắn, đáp số $17$) và Bài 2.2. Bài I, Bài III, Bài IV, Bài V giữ nguyên một câu (các ý dùng chung dữ kiện hoặc ý sau dùng ý trước).
- Bài 3 và Bài 4 là chỗ chạm tới phạm vi bị cấm (độ dài cung – góc ở tâm; góc nội tiếp) nên có `Chưa chắc`. Bài 4 đề không cho hình: hình giải vẽ bằng code, không đánh dấu các điều phải chứng minh.
- Bài 5: kết quả $520\,000$ đồng (cạnh $2$ m và $1$ m) và $680\,000$ đồng (cạnh $1$ m và $2$ m); lời giải chỉ dùng biến đổi đại số, không dùng Cô-si hay đạo hàm.
