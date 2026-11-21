=== V2B.402@p51
- bai: 402 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: làm trội · làm giảm · nhân hai tích so le để triệt tiêu
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách làm đủ phần A<20; với A>14 chỉ nêu bất đẳng thức làm giảm, phần còn lại tự giải. Máy (Fraction): A=17,7467...; A·A'=400 và A·B=201 khớp.
## DE
Cho $A=\dfrac{2}{1}\cdot\dfrac{4}{3}\cdot\dfrac{6}{5}\cdot\ldots\cdot\dfrac{200}{199}$. Chứng minh rằng $14<A<20$.
## SACH
Để chứng minh $A<20$, ta làm trội mỗi phân số của $A$ bằng cách dùng bất đẳng thức $\dfrac{n+1}{n}<\dfrac{n}{n-1}$. Ta có:

$A=\dfrac{2}{1}\cdot\dfrac{4}{3}\cdot\dfrac{6}{5}\cdot\ldots\cdot\dfrac{200}{199}$

$A<\dfrac{2}{1}\cdot\dfrac{3}{2}\cdot\dfrac{5}{4}\cdot\ldots\cdot\dfrac{199}{198}$.

Suy ra $A^2<\dfrac{2\cdot4\cdot6\cdot\ldots\cdot200}{1\cdot3\cdot5\cdot\ldots\cdot199}\cdot\dfrac{2\cdot3\cdot5\cdot\ldots\cdot199}{1\cdot2\cdot4\cdot\ldots\cdot198}=\dfrac{200}{1}\cdot\dfrac{2}{1}=400\Rightarrow A<20$.

Để chứng minh $A>14$, ta làm giảm mỗi phân số của $A$ bằng cách dùng bất đẳng thức $\dfrac{n+1}{n}>\dfrac{n+2}{n+1}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $A$ là tích 100 thừa số dạng $\dfrac{n+1}{n}$ khó tính thẳng; thay mỗi thừa số bằng thừa số lớn hơn (hoặc bé hơn) ở vị trí kề bên sao cho khi nhân $A$ với tích mới thì các số so le triệt tiêu gần hết, rồi so sánh bình phương của $A$ với một hằng số.

**Bước 1.** Làm trội từng thừa số bằng $\dfrac{n+1}{n}<\dfrac{n}{n-1}$ (giữ nguyên thừa số đầu) để thu được một tích $A'$ lớn hơn $A$ và lệch $A$ đúng một nhịp.

**Bước 2.** Nhân $A$ với $A'$ để tử của tích này triệt tiêu mẫu của tích kia, nhờ đó $A^2<AA'$ rút gọn thành một số cụ thể và chặn được $A$ từ trên.

**Bước 3.** Làm giảm từng thừa số bằng $\dfrac{n+1}{n}>\dfrac{n+2}{n+1}$ để có tích $B$ nhỏ hơn $A$ và cũng lệch một nhịp so với $A$.

**Bước 4.** Nhân $A$ với $B$ để triệt tiêu tương tự rồi so sánh kết quả với $14^2=196$ để chặn $A$ từ dưới.

**Phần 2. Trình bày**

Với $n\ge2$: $\dfrac{n+1}{n}<\dfrac{n}{n-1}$ vì $(n+1)(n-1)=n^2-1<n^2$. Áp dụng cho các thừa số $\dfrac{4}{3},\dfrac{6}{5},\ldots,\dfrac{200}{199}$:

$A=\dfrac{2}{1}\cdot\dfrac{4}{3}\cdot\dfrac{6}{5}\cdot\ldots\cdot\dfrac{200}{199}<\dfrac{2}{1}\cdot\dfrac{3}{2}\cdot\dfrac{5}{4}\cdot\ldots\cdot\dfrac{199}{198}=A'$

Vì $A,A'>0$ nên $A^2<AA'=\dfrac{2\cdot4\cdot6\cdot\ldots\cdot200}{1\cdot3\cdot5\cdot\ldots\cdot199}\cdot\dfrac{2\cdot3\cdot5\cdot\ldots\cdot199}{1\cdot2\cdot4\cdot\ldots\cdot198}=200\cdot2=400$

Suy ra $A<20$.

Với $n\ge1$: $\dfrac{n+1}{n}>\dfrac{n+2}{n+1}$ vì $(n+1)^2=n^2+2n+1>n(n+2)$. Áp dụng cho từng thừa số của $A$:

$A=\dfrac{2}{1}\cdot\dfrac{4}{3}\cdot\ldots\cdot\dfrac{200}{199}>\dfrac{3}{2}\cdot\dfrac{5}{4}\cdot\ldots\cdot\dfrac{201}{200}=B$

Vì $A,B>0$ nên $A^2>AB=\dfrac{2\cdot4\cdot\ldots\cdot200}{1\cdot3\cdot\ldots\cdot199}\cdot\dfrac{3\cdot5\cdot\ldots\cdot201}{2\cdot4\cdot\ldots\cdot200}=201>196=14^2$

Suy ra $A>14$.

Vậy $14<A<20$.

=== V2B.403@p51
- bai: 403 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội · nhân hai tích so le để triệt tiêu
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Ảnh trang 167 ở dòng chép lại A in thừa số cuối là 208/201, đề in 208/210 (in sai, đã theo đề). Máy: A=0,02194... < 0,04; A·C=1/630 khớp.
## DE
Chứng minh bất đẳng thức: $\dfrac{1}{3}\cdot\dfrac{4}{6}\cdot\dfrac{7}{9}\cdot\dfrac{10}{12}\cdot\ldots\cdot\dfrac{208}{210}<\dfrac{1}{25}$.
## SACH
Gọi $A$ là vế trái của bất đẳng thức. Ta làm trội $A$ để được một biểu thức $C$ dễ rút gọn hơn. Muốn vậy biểu thức $C$ phải có nhiều thừa số giống nhau ở tử và ở mẫu.

Nhận xét hai phân số cạnh nhau, chẳng hạn $\dfrac{1}{3}$ và $\dfrac{4}{6}$, ta thấy $4$ hơn $3$ là $1$, còn $6$ hơn $4$ là $2$. Ta làm trội: $\dfrac{n}{n+2}<\dfrac{n-1}{n}$ (vì $n^2<n^2+n-2$ với mọi $n>2$). Do đó:

$A=\dfrac{1}{3}\cdot\dfrac{4}{6}\cdot\dfrac{7}{9}\cdot\dfrac{10}{12}\cdot\ldots\cdot\dfrac{208}{201}$

$A<\dfrac{1}{3}\cdot\dfrac{3}{4}\cdot\dfrac{6}{7}\cdot\dfrac{9}{10}\cdot\ldots\cdot\dfrac{207}{208}$ $(=C)$.

Suy ra

$A^2<\dfrac{1\cdot4\cdot7\cdot10\cdot\ldots\cdot208}{3\cdot6\cdot9\cdot12\cdot\ldots\cdot210}\cdot\dfrac{1\cdot3\cdot6\cdot9\cdot\ldots\cdot207}{3\cdot4\cdot7\cdot10\cdot\ldots\cdot208}=\dfrac{1}{210}\cdot\dfrac{1}{3}=\dfrac{1}{630}<\dfrac{1}{625}=\left(\dfrac{1}{25}\right)^2$.

Do đó $A<\dfrac{1}{25}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tích 70 phân số có mẫu hơn tử $2$ (kiểu $\dfrac{n}{n+2}$) nên khó rút gọn; phải làm trội để tử của thừa số này trùng mẫu của thừa số kề nó, rồi nhân với tích gốc để triệt tiêu.

**Bước 1.** So sánh $\dfrac{n}{n+2}$ với $\dfrac{n-1}{n}$ bằng cách nhân chéo, thấy bất đẳng thức đúng với mọi $n>2$, nên thay mỗi thừa số (trừ $\dfrac{1}{3}$) bằng thừa số lớn hơn.

**Bước 2.** Gọi tích mới là $C$ và nhận ra $A<C$, đồng thời $A$ và $C$ đều dương nên có thể bình phương rồi nhân vế với nhau.

**Bước 3.** Viết $AC$ thành tích hai phân số có tử và mẫu là các dãy cách đều $3$ rồi gạch các thừa số chung để chỉ còn một phân số đơn giản.

**Bước 4.** So sánh số thu được với $\left(\dfrac{1}{25}\right)^2=\dfrac{1}{625}$ rồi lấy căn bậc hai hai vế dương.

**Phần 2. Trình bày**

Với $n>2$: $\dfrac{n}{n+2}<\dfrac{n-1}{n}$ vì $n^2<(n-1)(n+2)=n^2+n-2$. Áp dụng cho các thừa số $\dfrac{4}{6},\dfrac{7}{9},\ldots,\dfrac{208}{210}$ (ứng với $n=4,7,\ldots,208$):

$A=\dfrac{1}{3}\cdot\dfrac{4}{6}\cdot\dfrac{7}{9}\cdot\ldots\cdot\dfrac{208}{210}<\dfrac{1}{3}\cdot\dfrac{3}{4}\cdot\dfrac{6}{7}\cdot\ldots\cdot\dfrac{207}{208}=C$

Vì $A,C>0$ nên $A^2<AC$:

$AC=\dfrac{1\cdot4\cdot7\cdot\ldots\cdot208}{3\cdot6\cdot9\cdot\ldots\cdot210}\cdot\dfrac{1\cdot3\cdot6\cdot\ldots\cdot207}{3\cdot4\cdot7\cdot\ldots\cdot208}=\dfrac{1}{210}\cdot\dfrac{1}{3}=\dfrac{1}{630}<\dfrac{1}{625}$

Do đó $A^2<\left(\dfrac{1}{25}\right)^2$, mà $A>0$ nên $A<\dfrac{1}{25}$.

=== V2B.404a@p51
- bai: 404 · y: a · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách phân số thành hiệu rồi triệt tiêu liên tiếp
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: tổng đúng bằng $1-\dfrac{1}{(n+1)^2}$ với n=1..39.
## DE
Chứng minh bất đẳng thức, với $n$ nguyên dương: $A=\dfrac{3}{4}+\dfrac{5}{36}+\dfrac{7}{144}+\ldots+\dfrac{2n+1}{n^2(n+1)^2}<1$.
## SACH
Viết $\dfrac{2n+1}{n^2(n+1)^2}$ thành $\dfrac{1}{n^2}-\dfrac{1}{(n+1)^2}$.

$A=1-\dfrac{1}{2^2}+\dfrac{1}{2^2}-\dfrac{1}{3^2}+\ldots+\dfrac{1}{n^2}-\dfrac{1}{(n+1)^2}=1-\dfrac{1}{(n+1)^2}<1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $2n+1=(n+1)^2-n^2$ đúng bằng hiệu hai bình phương của hai thừa số ở mẫu, nên mỗi số hạng tách được thành hiệu hai phân số liên tiếp và cả tổng triệt tiêu dần.

**Bước 1.** Nhận ra các mẫu $4,36,144$ lần lượt là $1^2\cdot2^2,\ 2^2\cdot3^2,\ 3^2\cdot4^2$ nên số hạng tổng quát là $\dfrac{2k+1}{k^2(k+1)^2}$.

**Bước 2.** Viết $2k+1=(k+1)^2-k^2$ rồi chia cho $k^2(k+1)^2$ để tách số hạng thành hiệu hai phân số.

**Bước 3.** Cộng lại cho $k=1,2,\ldots,n$ để các số hạng liền nhau triệt tiêu, chỉ còn số hạng đầu và số hạng cuối.

**Bước 4.** Nhận xét phần bị trừ còn lại là một số dương để chặn tổng từ trên.

**Phần 2. Trình bày**

Với mỗi số nguyên dương $k$: $\dfrac{2k+1}{k^2(k+1)^2}=\dfrac{(k+1)^2-k^2}{k^2(k+1)^2}=\dfrac{1}{k^2}-\dfrac{1}{(k+1)^2}$

$A=\left(1-\dfrac{1}{2^2}\right)+\left(\dfrac{1}{2^2}-\dfrac{1}{3^2}\right)+\ldots+\left(\dfrac{1}{n^2}-\dfrac{1}{(n+1)^2}\right)$

$=1-\dfrac{1}{(n+1)^2}$

Vì $\dfrac{1}{(n+1)^2}>0$ nên $A<1$.

=== V2B.404b@p51
- bai: 404 · y: b · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tách phân số thành hiệu rồi triệt tiêu liên tiếp
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: tổng đúng bằng $1-\dfrac{1}{n!}$ với n=2..39.
## DE
Chứng minh bất đẳng thức, với $n\in\mathbb{N}$, $n\ge2$: $B=\dfrac{1}{2!}+\dfrac{2}{3!}+\dfrac{3}{4!}+\ldots+\dfrac{n-1}{n!}<1$.
## SACH
Viết $\dfrac{n-1}{n!}$ thành $\dfrac{1}{(n-1)!}-\dfrac{1}{n!}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng $\dfrac{k-1}{k!}$ có tử $k-1$ bằng $k$ trừ đi $1$, mà $\dfrac{k}{k!}=\dfrac{1}{(k-1)!}$ nên số hạng tách thành hiệu hai nghịch đảo giai thừa liên tiếp và cả tổng triệt tiêu dần.

**Bước 1.** Nhận ra số hạng tổng quát có dạng $\dfrac{k-1}{k!}$ với $k$ chạy từ $2$ đến $n$.

**Bước 2.** Tách tử thành $k-1$ rồi chia từng phần cho $k!$ để mỗi số hạng thành hiệu của $\dfrac{1}{(k-1)!}$ và $\dfrac{1}{k!}$.

**Bước 3.** Cộng các hiệu này lại để các số liền nhau triệt tiêu, chỉ còn số hạng đầu và số hạng cuối.

**Bước 4.** Nhận xét phần bị trừ còn lại là một số dương để chặn tổng từ trên.

**Phần 2. Trình bày**

Với $k\ge2$: $\dfrac{k-1}{k!}=\dfrac{k}{k!}-\dfrac{1}{k!}=\dfrac{1}{(k-1)!}-\dfrac{1}{k!}$

$B=\left(\dfrac{1}{1!}-\dfrac{1}{2!}\right)+\left(\dfrac{1}{2!}-\dfrac{1}{3!}\right)+\ldots+\left(\dfrac{1}{(n-1)!}-\dfrac{1}{n!}\right)$

$=1-\dfrac{1}{n!}$

Vì $\dfrac{1}{n!}>0$ nên $B<1$.

=== V2B.405@p51
- bai: 405 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách phân số thành hiệu rồi triệt tiêu · bỏ phần bị trừ dương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng khai triển đầu của sách (trang 168) in số hạng cuối là ngoặc vuông với dấu cộng giữa $\dfrac{1}{(n-1)!}$ và $\dfrac{1}{(n+1)!}$, đúng phải là ngoặc tròn với dấu trừ; đã chép đúng như in. Máy: tổng đúng bằng $2-\dfrac{1}{n!}-\dfrac{1}{(n+1)!}$ với n=1..39.
## DE
Chứng minh bất đẳng thức, với $n$ nguyên dương: $C=\dfrac{1}{2!}+\dfrac{5}{3!}+\dfrac{11}{4!}+\ldots+\dfrac{n^2+n-1}{(n+1)!}<2$.
## SACH
$\dfrac{n^2+n-1}{(n+1)!}=\dfrac{n(n+1)}{(n+1)!}-\dfrac{1}{(n+1)!}=\dfrac{1}{(n-1)!}-\dfrac{1}{(n+1)!}$. Ta có:

$\dfrac{1}{2!}+\left(\dfrac{1}{1!}-\dfrac{1}{3!}\right)+\left(\dfrac{1}{2!}-\dfrac{1}{4!}\right)+\left(\dfrac{1}{3!}-\dfrac{1}{5!}\right)+\ldots+\left[\dfrac{1}{(n-1)!}+\dfrac{1}{(n+1)!}\right]=$

$=\dfrac{1}{2!}+\left[\dfrac{1}{1!}+\dfrac{1}{2!}+\dfrac{1}{3!}+\ldots+\dfrac{1}{(n-1)!}\right]-\left[\dfrac{1}{3!}+\dfrac{1}{4!}+\dfrac{1}{5!}+\ldots+\dfrac{1}{(n+1)!}\right]=$

$=\dfrac{1}{2!}+\dfrac{1}{1!}+\dfrac{1}{2!}-\dfrac{1}{n!}-\dfrac{1}{(n+1)!}=2-\dfrac{1}{n!}-\dfrac{1}{(n+1)!}<2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử của số hạng tổng quát $n^2+n-1=n(n+1)-1$ chứa thừa số $n(n+1)$ trùng với phần của mẫu $(n+1)!$, nên số hạng tách thành hiệu hai nghịch đảo giai thừa cách nhau hai bậc và cả tổng triệt tiêu từng đoạn.

**Bước 1.** Nhận ra số hạng thứ $k$ là $\dfrac{k^2+k-1}{(k+1)!}$ (số hạng đầu ứng với $k=1$ cho $\dfrac{1}{2!}$) để biết tổng chạy theo $k$ từ $1$ đến $n$.

**Bước 2.** Tách tử thành $k(k+1)-1$ rồi rút gọn $\dfrac{k(k+1)}{(k+1)!}$ thành $\dfrac{1}{(k-1)!}$ để mỗi số hạng thành hiệu hai phân số.

**Bước 3.** Cộng lại theo $k$ để hai dãy nghịch đảo giai thừa triệt tiêu phần chung, chỉ còn vài số hạng ở hai đầu.

**Bước 4.** Nhận xét hai số hạng còn lại ở cuối là số dương bị trừ đi để suy ra tổng nhỏ hơn hằng số.

**Phần 2. Trình bày**

Với $k\ge1$: $\dfrac{k^2+k-1}{(k+1)!}=\dfrac{k(k+1)}{(k+1)!}-\dfrac{1}{(k+1)!}=\dfrac{1}{(k-1)!}-\dfrac{1}{(k+1)!}$

$C=\sum_{k=1}^{n}\left(\dfrac{1}{(k-1)!}-\dfrac{1}{(k+1)!}\right)=\left(\dfrac{1}{0!}+\dfrac{1}{1!}+\dfrac{1}{2!}+\ldots+\dfrac{1}{(n-1)!}\right)-\left(\dfrac{1}{2!}+\dfrac{1}{3!}+\ldots+\dfrac{1}{(n+1)!}\right)$

$=\dfrac{1}{0!}+\dfrac{1}{1!}-\dfrac{1}{n!}-\dfrac{1}{(n+1)!}$

$=2-\dfrac{1}{n!}-\dfrac{1}{(n+1)!}$

Vì $\dfrac{1}{n!}>0$ và $\dfrac{1}{(n+1)!}>0$ nên $C<2$.

=== V2B.406@p51
- bai: 406 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: nhân 2 rồi trừ vế (tổng số mũ) · tổng cấp số nhân
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: $A=2-\dfrac{102}{2^{100}}<2$ (Fraction, chính xác).
## DE
Chứng minh bất đẳng thức: $A=\dfrac{1}{2}+\dfrac{2}{2^2}+\dfrac{3}{2^3}+\dfrac{4}{2^4}+\ldots+\dfrac{100}{2^{100}}<2$.
## SACH
$2A=1+\dfrac{2}{2}+\dfrac{3}{2^2}+\dfrac{4}{2^3}+\ldots+\dfrac{100}{2^{99}}$ (1)

$A=\dfrac{1}{2}+\dfrac{2}{2^2}+\dfrac{3}{2^3}+\ldots+\dfrac{99}{2^{99}}+\dfrac{100}{2^{100}}$ (2)

Lấy (1) trừ (2) được:

$A=\left(1+\dfrac{1}{2}+\dfrac{1}{2^2}+\dfrac{1}{2^3}+\ldots+\dfrac{1}{2^{99}}\right)-\dfrac{100}{2^{100}}$

Hãy chứng minh biểu thức trong dấu ngoặc nhỏ hơn $2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử tăng dần $1,2,3,\ldots$ còn mẫu là luỹ thừa của $2$ nên nhân $A$ với $2$ rồi trừ đi $A$ sẽ làm mỗi tử chỉ còn $1$, đưa tổng về tổng các luỹ thừa của $\dfrac{1}{2}$.

**Bước 1.** Nhân hai vế với $2$ để mỗi số hạng $\dfrac{k}{2^k}$ trở thành $\dfrac{k}{2^{k-1}}$, cùng mẫu với số hạng đứng trước nó trong $A$.

**Bước 2.** Lấy $2A$ trừ $A$ rồi ghép các số hạng cùng mẫu, mỗi cặp có tử hơn kém nhau $1$ nên còn lại tổng các $\dfrac{1}{2^k}$ và một số hạng lẻ ở cuối.

**Bước 3.** Tính tổng các luỹ thừa của $\dfrac{1}{2}$ bằng cách nhân với $2$ rồi trừ để chặn nó dưới $2$.

**Bước 4.** Bỏ số hạng $\dfrac{100}{2^{100}}$ dương bị trừ để kết luận cho $A$.

**Phần 2. Trình bày**

$2A=1+\dfrac{2}{2}+\dfrac{3}{2^2}+\ldots+\dfrac{100}{2^{99}}$

$2A-A=1+\left(\dfrac{2}{2}-\dfrac{1}{2}\right)+\left(\dfrac{3}{2^2}-\dfrac{2}{2^2}\right)+\ldots+\left(\dfrac{100}{2^{99}}-\dfrac{99}{2^{99}}\right)-\dfrac{100}{2^{100}}$

$A=S-\dfrac{100}{2^{100}}$ với $S=1+\dfrac{1}{2}+\dfrac{1}{2^2}+\ldots+\dfrac{1}{2^{99}}$

Ta có $2S=2+1+\dfrac{1}{2}+\ldots+\dfrac{1}{2^{98}}=2+S-\dfrac{1}{2^{99}}$, nên $S=2-\dfrac{1}{2^{99}}<2$.

Vì $\dfrac{100}{2^{100}}>0$ nên $A<S<2$.

=== V2B.407@p51
- bai: 407 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: làm trội 1/k³ < 1/((k-1)k(k+1)) · tách phân số thành hiệu rồi triệt tiêu
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ ghi "Giải tương tự ví dụ 96" (không có trong đoạn đã đọc); tự giải. Máy: tổng < $\dfrac{1}{12}-\dfrac{1}{2n(n+1)}$ với n=3..199.
## DE
Chứng minh bất đẳng thức, với $n\in\mathbb{N}$, $n\ge3$: $B=\dfrac{1}{3^3}+\dfrac{1}{4^3}+\dfrac{1}{5^3}+\ldots+\dfrac{1}{n^3}<\dfrac{1}{12}$.
## SACH
Giải tương tự ví dụ 96.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng nghịch đảo lập phương không tính trực tiếp được, nên làm trội mỗi số hạng $\dfrac{1}{k^3}$ bằng một phân số có mẫu là tích ba số liên tiếp $(k-1)k(k+1)$ rồi tách thành hiệu để triệt tiêu; hằng số $\dfrac{1}{12}$ gợi tổng bắt đầu từ $k=3$ vì $\dfrac{1}{2\cdot3}\cdot\dfrac{1}{2}=\dfrac{1}{12}$.

**Bước 1.** So sánh $k^3$ với $(k-1)k(k+1)=k^3-k$ để thấy mẫu nhỏ hơn, nên $\dfrac{1}{k^3}<\dfrac{1}{(k-1)k(k+1)}$ với mọi $k\ge2$.

**Bước 2.** Tách $\dfrac{1}{(k-1)k(k+1)}$ thành $\dfrac{1}{2}\left(\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}\right)$ bằng cách quy đồng hiệu trong ngoặc.

**Bước 3.** Cộng các bất đẳng thức cho $k=3,4,\ldots,n$ để vế phải triệt tiêu còn hai số hạng đầu và cuối.

**Bước 4.** Bỏ số hạng cuối dương bị trừ rồi so sánh với $\dfrac{1}{12}$.

**Phần 2. Trình bày**

Với $k\ge3$: $k^3>k^3-k=(k-1)k(k+1)>0$ nên $\dfrac{1}{k^3}<\dfrac{1}{(k-1)k(k+1)}=\dfrac{1}{2}\left(\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}\right)$

$B<\dfrac{1}{2}\left[\left(\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}\right)+\left(\dfrac{1}{3\cdot4}-\dfrac{1}{4\cdot5}\right)+\ldots+\left(\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right)\right]$

$=\dfrac{1}{2}\left(\dfrac{1}{6}-\dfrac{1}{n(n+1)}\right)<\dfrac{1}{12}$

=== V2B.408@p51
- bai: 408 · y: - · trang: 51 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: nhân 3 rồi trừ vế · tổng cấp số nhân
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Máy: $C=\dfrac{3}{4}-\dfrac{203}{4\cdot3^{100}}<\dfrac{3}{4}$ (Fraction, chính xác).
## DE
Chứng minh bất đẳng thức: $C=\dfrac{1}{3}+\dfrac{2}{3^2}+\dfrac{3}{3^3}+\ldots+\dfrac{100}{3^{100}}<\dfrac{3}{4}$.
## SACH
$3C=1+\dfrac{2}{3}+\dfrac{3}{3^2}+\ldots+\dfrac{99}{3^{98}}+\dfrac{100}{3^{99}}$

$C=\dfrac{1}{3}+\dfrac{2}{3^2}+\ldots+\dfrac{99}{3^{99}}+\dfrac{100}{3^{100}}$

Suy ra: $2C=\left(1+\dfrac{1}{3}+\dfrac{1}{3^2}+\ldots+\dfrac{1}{3^{99}}\right)-\dfrac{100}{3^{100}}$ (1)

Hãy chứng minh biểu thức trong dấu ngoặc nhỏ hơn $\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử tăng dần $1,2,3,\ldots$ còn mẫu là luỹ thừa của $3$ nên nhân $C$ với $3$ rồi trừ đi $C$ làm mỗi tử còn $1$; hằng số $\dfrac{3}{4}$ xuất hiện vì kết quả chia thêm cho $2$ là $\dfrac{3}{2}\cdot\dfrac{1}{2}$.

**Bước 1.** Nhân hai vế với $3$ để mỗi số hạng $\dfrac{k}{3^k}$ trở thành $\dfrac{k}{3^{k-1}}$, cùng mẫu với số hạng đứng trước nó trong $C$.

**Bước 2.** Lấy $3C$ trừ $C$ rồi ghép các số hạng cùng mẫu, mỗi cặp có tử hơn kém nhau $1$ nên còn lại tổng các $\dfrac{1}{3^k}$ và số hạng cuối $\dfrac{100}{3^{100}}$.

**Bước 3.** Tính tổng các luỹ thừa của $\dfrac{1}{3}$ bằng cách nhân với $3$ rồi trừ để chặn nó dưới $\dfrac{3}{2}$.

**Bước 4.** Bỏ số hạng dương bị trừ và chia hai vế cho $2$ để kết luận cho $C$.

**Phần 2. Trình bày**

$3C=1+\dfrac{2}{3}+\dfrac{3}{3^2}+\ldots+\dfrac{100}{3^{99}}$

$3C-C=1+\left(\dfrac{2}{3}-\dfrac{1}{3}\right)+\left(\dfrac{3}{3^2}-\dfrac{2}{3^2}\right)+\ldots+\left(\dfrac{100}{3^{99}}-\dfrac{99}{3^{99}}\right)-\dfrac{100}{3^{100}}$

$2C=S-\dfrac{100}{3^{100}}$ với $S=1+\dfrac{1}{3}+\dfrac{1}{3^2}+\ldots+\dfrac{1}{3^{99}}$

Ta có $3S=3+1+\dfrac{1}{3}+\ldots+\dfrac{1}{3^{98}}=3+S-\dfrac{1}{3^{99}}$, nên $2S=3-\dfrac{1}{3^{99}}$, tức $S<\dfrac{3}{2}$.

Vì $\dfrac{100}{3^{100}}>0$ nên $2C<S<\dfrac{3}{2}$, suy ra $C<\dfrac{3}{4}$.

=== V2B.409@p52
- bai: 409 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: ghép cặp cách đều hai đầu · làm trội · làm giảm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ làm đủ vế trái; vế phải chỉ nêu hướng, phần còn lại tự giải. Máy: bất đẳng thức đúng với n=1..149.
## DE
Chứng minh bất đẳng thức, với $n$ nguyên dương: $1<\dfrac{1}{n+1}+\dfrac{1}{n+2}+\dfrac{1}{n+3}+\ldots+\dfrac{1}{3n+1}<2$.
## SACH
Gọi $A=\dfrac{1}{n+1}+\dfrac{1}{n+2}+\ldots+\dfrac{1}{2n+1}+\ldots+\dfrac{1}{3n}+\dfrac{1}{3n+1}$.

Tổng $A$ có $2n+1$ số, ghép thành $n$ cặp các phân số cách đều hai đầu, còn lại một phân số ở giữa là $\dfrac{1}{2n+1}$.

Mỗi cặp bằng:

$\dfrac{1}{2n+1-k}+\dfrac{1}{2n+1+k}=\dfrac{4n+2}{(2n+1)^2-k^2}>\dfrac{4n+2}{(2n+1)^2}=\dfrac{2}{2n+1}$.

Vậy $A>\dfrac{2}{2n+1}\cdot n+\dfrac{1}{2n+1}=1$.

Để chứng minh $A<2$, làm trội $A$ bằng cách thay mỗi phân số của $A$ bởi phân số lớn nhất.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng có $2n+1$ số hạng nên có số hạng chính giữa $\dfrac{1}{2n+1}$; hai số hạng đối xứng qua nó có tổng mẫu không đổi, mà tổng hai nghịch đảo với tổng mẫu cố định luôn lớn hơn khi hai mẫu khác nhau, từ đó đưa mỗi cặp về cùng một hằng số.

**Bước 1.** Đếm số hạng của tổng thấy có $2n+1$ số hạng, số hạng giữa là $\dfrac{1}{2n+1}$, và $n$ cặp còn lại đối xứng qua nó.

**Bước 2.** Quy đồng mỗi cặp $\dfrac{1}{2n+1-k}+\dfrac{1}{2n+1+k}$ để tử là $4n+2$ còn mẫu là $(2n+1)^2-k^2$ rồi bỏ $k^2$ ở mẫu để làm giảm.

**Bước 3.** Cộng $n$ cặp cùng với số hạng giữa để có tổng lớn hơn $1$.

**Bước 4.** Với vế phải, thay mỗi số hạng bằng số hạng lớn nhất $\dfrac{1}{n+1}$ để làm trội rồi đếm số số hạng.

**Phần 2. Trình bày**

Vế trái: $A=\dfrac{1}{2n+1}+\sum_{k=1}^{n}\left(\dfrac{1}{2n+1-k}+\dfrac{1}{2n+1+k}\right)$.

Với $1\le k\le n$: $\dfrac{1}{2n+1-k}+\dfrac{1}{2n+1+k}=\dfrac{4n+2}{(2n+1)^2-k^2}>\dfrac{4n+2}{(2n+1)^2}=\dfrac{2}{2n+1}$

Suy ra $A>n\cdot\dfrac{2}{2n+1}+\dfrac{1}{2n+1}=\dfrac{2n+1}{2n+1}=1$.

Vế phải: mỗi số hạng của $A$ không vượt quá số hạng lớn nhất $\dfrac{1}{n+1}$ và $A$ có $2n+1$ số hạng nên $A\le\dfrac{2n+1}{n+1}<\dfrac{2n+2}{n+1}=2$.

Vậy $1<A<2$.

=== V2B.410@p52
- bai: 410 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: ghép cặp cách đều hai đầu · làm giảm · làm trội · tổng hai nghịch đảo với tổng mẫu không đổi
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Ảnh trang 170 ở dòng đầu của phần $A<\dfrac{3}{4}$ in số hạng cuối là $\dfrac{1}{n(n-2)}$, đúng phải là $\dfrac{1}{2n-2}$ (với n=2004 thì $2n-2=4006$); đã chép đúng như in. Máy: A=0,69302... nằm trong $(\dfrac{3}{5};\dfrac{3}{4})$.
## DE
Chứng minh bất đẳng thức: $\dfrac{3}{5}<\dfrac{1}{2004}+\dfrac{1}{2005}+\dfrac{1}{2006}+\ldots+\dfrac{1}{4006}<\dfrac{3}{4}$.
## SACH
Gọi $A=\dfrac{1}{2004}+\dfrac{1}{2005}+\dfrac{1}{2006}+\ldots+\dfrac{1}{4006}$.

Chứng minh $A>\dfrac{3}{5}$: Tổng $A$ có $2003$ số, ghép thành $1001$ cặp phân số cách đều hai đầu, còn lại một phân số ở giữa là $\dfrac{1}{3005}$.

Mỗi cặp bằng: $\dfrac{1}{3005-k}+\dfrac{1}{3005+k}>\dfrac{6010}{3005^2}=\dfrac{2}{3005}$.

Do đó $A>\dfrac{2}{3005}\cdot1001=\dfrac{2002}{3005}>\dfrac{3}{5}$.

Chứng minh $A<\dfrac{3}{4}$: Đặt $2004=n$, ta có:

$A=\dfrac{1}{n}+\dfrac{1}{n+1}+\ldots+\dfrac{1}{n(n-2)}$.

$A=\dfrac{1}{n+(n-2)}+\dfrac{1}{n+(n-3)}+\ldots+\dfrac{1}{n}$.

Cộng lại: $2A=\left(\dfrac{1}{n}+\dfrac{1}{2n-2}\right)+\left(\dfrac{1}{n+1}+\dfrac{1}{2n-3}\right)+\ldots+\left(\dfrac{1}{2n-2}+\dfrac{1}{n}\right)$

Ta sẽ chứng minh nhóm đầu và nhóm cuối có giá trị lớn hơn các nhóm khác bằng cách chứng minh:

$\dfrac{1}{n}+\dfrac{1}{2n-2}>\dfrac{1}{n+k}+\dfrac{1}{2n-2-k}$ (1) với $0<k<n-2$.

$(1)\Leftrightarrow\dfrac{3n-2}{n(2n-2)}>\dfrac{3n-2}{(n+k)(2n-2-k)}$

$\Leftrightarrow n(2n-2)<(n+k)(2n-2-k)$

$\Leftrightarrow2n^2-2n<2n^2-2n-kn+2kn-2k-k^2$

$\Leftrightarrow k^2<kn-2k\Leftrightarrow k<n-2$: đúng.

Vậy $2A<\left(\dfrac{1}{n}+\dfrac{1}{2n-2}\right)\cdot(n-1)=\dfrac{3n-2}{n(2n-2)}\cdot(n-1)=\dfrac{3n-2}{2n}<\dfrac{3}{2}$.

Do đó $A<\dfrac{3}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng nghịch đảo của hai số có tổng không đổi càng nhỏ khi hai số càng gần nhau, nên ghép các số hạng đối xứng qua giữa dãy để mỗi cặp bị chặn bởi giá trị ở cặp giữa (khi cần chặn dưới) hoặc cặp ngoài cùng (khi cần chặn trên).

**Bước 1.** Với vế trái, nhận ra dãy $2004,\ldots,4006$ có $2003$ số hạng nên có số hạng giữa $\dfrac{1}{3005}$ và $1001$ cặp đối xứng qua nó.

**Bước 2.** Quy đồng mỗi cặp $\dfrac{1}{3005-k}+\dfrac{1}{3005+k}$ rồi bỏ $k^2$ ở mẫu để làm giảm, cộng $1001$ cặp với số hạng giữa rồi so với $\dfrac{3}{5}$.

**Bước 3.** Với vế phải, viết $A$ theo thứ tự thuận và ngược rồi cộng để ghép số hạng thứ $j$ từ đầu với số hạng thứ $j$ từ cuối, hai mẫu có tổng không đổi $3n-2$.

**Bước 4.** So sánh tích hai mẫu ở mỗi cặp với tích ở cặp ngoài cùng để làm trội mọi cặp bằng cặp đầu, rồi đếm số cặp để chặn $2A$.

**Phần 2. Trình bày**

Vế trái. Dãy $2004,2005,\ldots,4006$ có $2003$ số hạng, số hạng giữa là $\dfrac{1}{3005}$, và

$A=\dfrac{1}{3005}+\sum_{k=1}^{1001}\left(\dfrac{1}{3005-k}+\dfrac{1}{3005+k}\right)$

Với $1\le k\le1001$: $\dfrac{1}{3005-k}+\dfrac{1}{3005+k}=\dfrac{6010}{3005^2-k^2}>\dfrac{6010}{3005^2}=\dfrac{2}{3005}$

Suy ra $A>1001\cdot\dfrac{2}{3005}+\dfrac{1}{3005}=\dfrac{2003}{3005}>\dfrac{3}{5}$ (vì $5\cdot2003=10015>9015=3\cdot3005$).

Vế phải. Đặt $n=2004$, khi đó $4006=2n-2$ và $A=\sum_{j=0}^{n-2}\dfrac{1}{n+j}=\sum_{j=0}^{n-2}\dfrac{1}{2n-2-j}$. Cộng hai cách viết:

$2A=\sum_{j=0}^{n-2}\left(\dfrac{1}{n+j}+\dfrac{1}{2n-2-j}\right)=\sum_{j=0}^{n-2}\dfrac{3n-2}{(n+j)(2n-2-j)}$

Vì $(n+j)(2n-2-j)=n(2n-2)+j(n-2-j)\ge n(2n-2)$ với $0\le j\le n-2$, nên mỗi số hạng không vượt quá $\dfrac{3n-2}{n(2n-2)}$.

Tổng có $n-1$ số hạng nên $2A\le(n-1)\cdot\dfrac{3n-2}{n(2n-2)}=\dfrac{3n-2}{2n}<\dfrac{3}{2}$, suy ra $A<\dfrac{3}{4}$.

Vậy $\dfrac{3}{5}<A<\dfrac{3}{4}$.

=== V2B.411@p52
- bai: 411 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhóm số hạng theo đoạn luỹ thừa của 2 · làm giảm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Giữ cả bài một câu vì câu b dùng kết quả câu a. Sách ở câu b chọn $k=2^{2A}-1$ chỉ là số nguyên khi $2A$ nguyên; bản kho lấy số nguyên $m\ge2A$ rồi chọn $k=2^m-1$. Sách khai triển câu a cho $n\ge2$, bản kho xét riêng $n=1$. Máy: tổng $>\dfrac{n}{2}$ với n=1..14.
## DE
a) Chứng minh bất đẳng thức, với $n$ nguyên dương: $1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{2^n-1}>\dfrac{n}{2}$.

b) Chứng minh rằng với mọi số dương $A$, ta luôn tìm được số tự nhiên $n$ để $1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{n}>A$.
## SACH
a) Gọi $A=1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{2^n-1}$. Ở ví dụ 97, ta đã chứng minh rằng $A<n$. Bây giờ ta chứng minh $A>\dfrac{n}{2}$. Ta có:

$A=1+\dfrac{1}{2}+\left(\dfrac{1}{3}+\dfrac{1}{4}\right)+\left(\dfrac{1}{5}+\ldots+\dfrac{1}{8}\right)+\ldots+\dfrac{1}{2^n-1}=$

$=1+\dfrac{1}{2}+\left(\dfrac{1}{3}+\dfrac{1}{2^2}\right)+\left(\dfrac{1}{2^2+1}+\ldots+\dfrac{1}{2^3}\right)+\ldots+\left(\dfrac{1}{2^{n-1}+1}+\ldots+\dfrac{1}{2^n}\right)-\dfrac{1}{2^n}$.

Thay mỗi phân số trong mỗi dấu ngoặc bởi phân số nhỏ nhất trong dấu ngoặc đó:

$A>1+\dfrac{1}{2}+\dfrac{1}{2^2}\cdot2+\dfrac{1}{2^3}\cdot2^2+\ldots+\dfrac{1}{2^n}\cdot2^{n-1}-\dfrac{1}{2^n}=$

$=1+\dfrac{1}{2}+\dfrac{1}{2}+\dfrac{1}{2}+\ldots+\dfrac{1}{2}-\dfrac{1}{2^n}=1+\dfrac{n}{2}-\dfrac{1}{2^n}>\dfrac{n}{2}$.

b) Áp dụng câu a: $1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{2^n-1}>\dfrac{n}{2}$, nếu ta chọn $k=2^n-1$ thì

$1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{k}>\dfrac{n}{2}$.

Như vậy nếu chọn $k=2^{2A}-1$ thì $1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{k}>\dfrac{2A}{2}=A$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đoạn $2^n-1$ số hạng gợi chia tổng thành các nhóm có $1,2,4,8,\ldots$ số hạng, nhóm thứ $j$ gồm $\dfrac{1}{2^{j-1}+1},\ldots,\dfrac{1}{2^j}$ có $2^{j-1}$ số hạng mỗi số hạng không nhỏ hơn $\dfrac{1}{2^j}$ nên cả nhóm không nhỏ hơn $\dfrac{1}{2}$; câu b chỉ cần chọn $n$ sao cho cận $\dfrac{n}{2}$ ở câu a vượt $A$.

**Bước 1.** Với câu a, xét riêng $n=1$ rồi với $n\ge2$ thêm và bớt $\dfrac{1}{2^n}$ để các số hạng từ $\dfrac{1}{3}$ trở đi chia thành các nhóm đầy đủ.

**Bước 2.** Đếm số số hạng mỗi nhóm bằng hiệu hai luỹ thừa của $2$ để thay mỗi số hạng bằng số hạng nhỏ nhất của nhóm và thu được đúng $\dfrac{1}{2}$ cho mỗi nhóm.

**Bước 3.** Cộng $1$, $\dfrac{1}{2}$ và $n-1$ nhóm rồi bỏ phần bù $\dfrac{1}{2^n}$ để thấy tổng lớn hơn $\dfrac{n}{2}$.

**Bước 4.** Với câu b, chọn số nguyên $m$ không nhỏ hơn $2A$ rồi lấy số hạng cuối của tổng là $2^m-1$ để áp dụng câu a.

**Phần 2. Trình bày**

a) Đặt $S=1+\dfrac{1}{2}+\dfrac{1}{3}+\ldots+\dfrac{1}{2^n-1}$.

Với $n=1$: $S=1>\dfrac{1}{2}$.

Với $n\ge2$: gọi $G_j=\dfrac{1}{2^{j-1}+1}+\ldots+\dfrac{1}{2^j}$ ($2\le j\le n$) là tổng của $2^{j-1}$ số hạng. Khi đó

$S=1+\dfrac{1}{2}+G_2+G_3+\ldots+G_n-\dfrac{1}{2^n}$

Mỗi số hạng của $G_j$ không nhỏ hơn $\dfrac{1}{2^j}$ nên $G_j\ge2^{j-1}\cdot\dfrac{1}{2^j}=\dfrac{1}{2}$.

Suy ra $S\ge1+\dfrac{1}{2}+(n-1)\cdot\dfrac{1}{2}-\dfrac{1}{2^n}=1+\dfrac{n}{2}-\dfrac{1}{2^n}>\dfrac{n}{2}$ (vì $\dfrac{1}{2^n}<1$).

b) Cho $A>0$. Chọn số nguyên dương $m\ge2A$ và đặt $n=2^m-1$ (là số tự nhiên). Theo câu a:

$1+\dfrac{1}{2}+\ldots+\dfrac{1}{n}=1+\dfrac{1}{2}+\ldots+\dfrac{1}{2^m-1}>\dfrac{m}{2}\ge A$

Vậy với mọi $A>0$ luôn tìm được số tự nhiên $n$ để tổng lớn hơn $A$.

=== V2B.412@p52
- bai: 412 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · sắp thứ tự a>b>c>d · đánh giá thương nguyên
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Máy: không có bộ bốn số phân biệt nào thoả đề trong khoảng 1..89; có bộ có hai số bằng nhau (vd 1,1,2,2).
## DE
Cho bốn số nguyên dương $a,b,c,d$, trong đó tổng ba số bất kì chia cho số còn lại đều có thương là một số nguyên khác $1$. Chứng minh rằng trong bốn số $a,b,c,d$ tồn tại hai số bằng nhau.
## SACH
Giả sử $a>b>c>d$. Đặt $\dfrac{b+c+d}{a}=m$, $\dfrac{a+c+d}{b}=n$, $\dfrac{a+b+d}{c}=p$.

Theo giả thiết thì $m>1$; ta lại có $d<c<b<a$ nên $b+c+d<3a$, do đó $m<3$; vậy $m=2$.

Dễ thấy

$m=\dfrac{b+c+d}{a}<\dfrac{b+c+d}{b}<\dfrac{a+c+d}{b}=n$,

$n=\dfrac{a+c+d}{b}<\dfrac{a+c+d}{c}<\dfrac{a+b+d}{c}=p$.

Suy ra $n\ge3$, $p\ge4$.

Ta có $b+c+d=2a$, $a+c+d\ge3b$, $a+b+d\ge4c$.

Cộng từng vế ta được:

$2a+2b+2c+3d\ge2a+3b+4c\Rightarrow3d\ge b+2c>d+2d=3d$, vô lí.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chứng minh có hai số bằng nhau thì giả sử bốn số đôi một khác nhau và sắp xếp $a>b>c>d$; khi đó các thương nguyên của tổng ba số chia cho số còn lại tăng dần theo thứ tự số chia giảm dần, và thương nhỏ nhất bị ép bằng $2$ nên các thương sau buộc phải lớn hơn đến mức mâu thuẫn.

**Bước 1.** Giả sử bốn số đôi một khác nhau và sắp xếp $a>b>c>d$, gọi $m,n,p$ là các thương khi chia tổng ba số khác cho $a,b,c$.

**Bước 2.** Chứng minh $m=2$ bằng cách kẹp $m$ giữa $1$ (vì thương nguyên khác $1$) và $3$ (vì $b+c+d<3a$).

**Bước 3.** So sánh các thương liên tiếp bằng cách thay mẫu nhỏ hơn thì phân số lớn hơn, suy ra $n\ge3$ và $p\ge4$ vì chúng là số nguyên lớn hơn thương trước.

**Bước 4.** Cộng ba hệ thức $b+c+d=2a$, $a+c+d\ge3b$, $a+b+d\ge4c$ để khử $a$ rồi so sánh với $d$ và gặp mâu thuẫn.

**Phần 2. Trình bày**

Giả sử bốn số đôi một khác nhau; không mất tính tổng quát, $a>b>c>d$. Đặt $m=\dfrac{b+c+d}{a}$, $n=\dfrac{a+c+d}{b}$, $p=\dfrac{a+b+d}{c}$; theo đề $m,n,p$ là các số nguyên dương khác $1$.

Vì $m\ne1$ nên $m\ge2$; vì $b+c+d<3a$ nên $m<3$. Vậy $m=2$.

$m=\dfrac{b+c+d}{a}<\dfrac{b+c+d}{b}<\dfrac{a+c+d}{b}=n$ nên $n>2$, tức $n\ge3$.

$n=\dfrac{a+c+d}{b}<\dfrac{a+c+d}{c}<\dfrac{a+b+d}{c}=p$ nên $p>3$, tức $p\ge4$.

Do đó $b+c+d=2a$, $a+c+d\ge3b$, $a+b+d\ge4c$. Cộng ba hệ thức:

$2a+2b+2c+3d\ge2a+3b+4c$

$\Rightarrow3d\ge b+2c$

Nhưng $b>d$, $c>d$ nên $b+2c>d+2d=3d$. Mâu thuẫn.

Vậy giả sử sai: trong bốn số $a,b,c,d$ tồn tại hai số bằng nhau.

=== V2B.413@p52
- bai: 413 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số chữ số của x^x kẹp giữa các luỹ thừa của 10 · giả sử x ≥ y (đối xứng) · vét các giá trị nhỏ
- kiem: khong
- ket_qua_sach: x=y=1; x=y=8; x=y=9
- dap_an: $(x;y)=(1;1),\ (8;8),\ (9;9)$
- ghi_chu_nghi: bài *. Sách chỉ nêu "chọn các số $x^x$ ..." và chỉ xét ba trường hợp $x=y$, lược bước loại các cặp $x>y$ (như $(2;1),(3;2)$); bản kho kiểm đủ các cặp. Coi $x,y\ge1$ vì $0^0$ không xác định. Máy vét $x,y<80$: đúng ba cặp.
## DE
Tìm các số tự nhiên $x$ và $y$ sao cho $x^x$ có $y$ chữ số, còn $y^y$ có $x$ chữ số.
## SACH
Ta có $x^x$ có $y$ chữ số $\Rightarrow10^{y-1}\le x^x<10^y$,

$y^y$ có $x$ chữ số $\Rightarrow10^{x-1}\le y^y<10^x$.

Giả sử $x\ge y$. Ta có $x^x<10^y\le10^x\Rightarrow x<10$.

Ta chọn các số $x^x$ sao cho $x<10$ và $x^x\ge10^{y-1}$ với mọi $y-1$ nhỏ hơn $x$. Các số $2^2,3^3,\ldots,7^7$ không thoả mãn (chẳng hạn $2^2<10$, $3^3<10^2,\ldots$). Xét các số $1^1,8^8,9^9$, ta thấy: $10^0<1^1<10^1$, $10^7<8^8<10^8$, $10^8<9^9<10^9$.

Đáp số: $x=y=1$; $x=y=8$; $x=y=9$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chữ số của $x^x$ phải bằng $y$ mà $x^x$ tăng cực nhanh, nên $x$ không thể lớn: giả sử $x\ge y$ thì $x^x<10^y\le10^x$ ép $x<10$, và chỉ còn vét vài giá trị.

**Bước 1.** Nhận ra hai điều kiện đối xứng giữa $x$ và $y$, nên chỉ cần xét $x\ge y$ rồi hoán đổi để có các nghiệm còn lại.

**Bước 2.** Dùng điều kiện số chữ số $x^x<10^y$ để đánh giá $x^x<10^y\le10^x$ và chặn $x$ bởi $9$.

**Bước 3.** Tính số chữ số của $x^x$ cho $x=1,2,\ldots,9$ để biết $y$ duy nhất ứng với mỗi $x$.

**Bước 4.** Với mỗi cặp $(x;y)$ tìm được, kiểm tra $y^y$ có đúng $x$ chữ số hay không, rồi hoán đổi để lấy các cặp có $x<y$.

**Phần 2. Trình bày**

Vì $0^0$ không xác định nên $x,y\ge1$. Hai điều kiện đối xứng giữa $x$ và $y$ nên xét $x\ge y$.

Vì $x^x$ có $y$ chữ số nên $x^x<10^y\le10^x$, suy ra $x<10$ (nếu $x\ge10$ thì $x^x\ge10^x$).

Số chữ số của $x^x$ khi $x=1,2,\ldots,9$: $1^1=1$ (1 chữ số), $2^2=4$ (1), $3^3=27$ (2), $4^4=256$ (3), $5^5=3125$ (4), $6^6=46656$ (5), $7^7=823543$ (6), $8^8=16777216$ (8), $9^9=387420489$ (9).

Do đó $y$ lần lượt là $1,1,2,3,4,5,6,8,9$. Kiểm tra $y^y$ có $x$ chữ số không:

$(x;y)=(2;1)$: $1^1=1$ có $1\ne2$ chữ số, loại. $(3;2)$: $2^2=4$ có $1\ne3$ chữ số, loại. $(4;3)$: $3^3=27$ có $2\ne4$ chữ số, loại. $(5;4)$: $4^4=256$ có $3\ne5$ chữ số, loại. $(6;5)$: $5^5=3125$ có $4\ne6$ chữ số, loại. $(7;6)$: $6^6=46656$ có $5\ne7$ chữ số, loại.

$(1;1)$: $1^1=1$ có $1$ chữ số, thoả. $(8;8)$: $8^8$ có $8$ chữ số, thoả. $(9;9)$: $9^9$ có $9$ chữ số, thoả.

Các nghiệm đều có $x=y$ nên không sinh thêm nghiệm khi hoán đổi vai trò $x,y$.

Vậy $(x;y)=(1;1),\ (8;8),\ (9;9)$.

=== V2B.414@p52
- bai: 414 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhóm cặp thừa số k(n-k+1) · làm giảm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Đề in $(n!)^2>n^2$ nhưng lời giải sách chứng minh mỗi thừa số $k(n-k+1)$ lớn hơn $n$, tức là chặn tích đủ để được $(n!)^2>n^n$ (đề gốc nhiều khả năng là $n^n$, bị in nhầm số mũ). Đã chép đề đúng như in; bản kho chứng minh $(n!)^2>n^n$ rồi suy ra $(n!)^2>n^2$. Máy: $(n!)^2>n^n\ge n^2$ với n=3..299.
## DE
Chứng minh bất đẳng thức $(n!)^2>n^2$ với mọi số tự nhiên $n\ge3$.
## SACH
$n!=1\cdot2\cdot3\cdot\ldots\cdot k\cdot\ldots\cdot n$

$n!=n(n-1)(n-2)\ldots(n-k+1)\ldots1$.

Suy ra $(n!)^2=(1\cdot n)\cdot[2(n-1)]\cdot[3(n-2)]\ldots[k(n-k+1)]\ldots(n\cdot1)$. Ta sẽ chứng minh rằng biểu thức trong mỗi dấu ngoặc vuông đều lớn hơn $n$.

Thật vậy

$k(n-k+1)-n=kn-n-k^2+k=n(k-1)-k(k-1)=$

$=(n-k)(k-1)>0$ vì $n>k>1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $n!$ theo hai chiều (xuôi và ngược) rồi nhân cho nhau từng cặp thừa số cùng vị trí, được các tích $k(n-k+1)$ có tổng hai thừa số không đổi $n+1$ và mỗi tích không nhỏ hơn $n$.

**Bước 1.** Viết $n!$ một lần theo thứ tự tăng và một lần theo thứ tự giảm rồi nhân hai biểu thức để $(n!)^2$ thành tích của $n$ cặp $k(n-k+1)$.

**Bước 2.** Xét hiệu $k(n-k+1)-n$ và phân tích thành nhân tử để biết dấu của nó với $1<k<n$.

**Bước 3.** Chú ý hai cặp ở hai đầu ($k=1$ và $k=n$) đều bằng đúng $n$, còn $n-2\ge1$ cặp giữa đều lớn hơn $n$.

**Bước 4.** Nhân các đánh giá để được $(n!)^2>n^n$ rồi so sánh $n^n$ với $n^2$ để kết luận bất đẳng thức đề cho.

**Phần 2. Trình bày**

$n!=1\cdot2\cdot\ldots\cdot n=n(n-1)\ldots1$ nên

$(n!)^2=\prod_{k=1}^{n}k(n-k+1)=[1\cdot n]\cdot[2(n-1)]\cdot\ldots\cdot[(n-1)\cdot2]\cdot[n\cdot1]$

Với $1<k<n$: $k(n-k+1)-n=kn-k^2+k-n=n(k-1)-k(k-1)=(n-k)(k-1)>0$, nên $k(n-k+1)>n$.

Hai thừa số $k=1$ và $k=n$ đều bằng $n$; với $n\ge3$ còn ít nhất một thừa số $k$ nằm giữa ($2\le k\le n-1$), mỗi thừa số đó lớn hơn $n$. Do đó $(n!)^2>n\cdot n\cdot n^{n-2}=n^n$.

Vì $n\ge3$ nên $n^n\ge n^2$, suy ra $(n!)^2>n^2$.

=== V2B.415@p52
- bai: 415 · y: - · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: định nghĩa phần nguyên
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: bài *. Máy: 200000 cặp số thực ngẫu nhiên, không có phản ví dụ.
## DE
Kí hiệu $[a]$ là số nguyên lớn nhất không vượt quá $a$. Chứng minh rằng $[x]+[y]\le[x+y]$.
## SACH
Ta có $[x]\le x$, $[y]\le y$ nên $[x]+[y]\le x+y$, tức là $[x]+[y]$ là số nguyên không vượt quá

$x+y$ (1)

Mặt khác, theo định nghĩa phần nguyên, $[x+y]$ là số nguyên lớn nhất không vượt quá

$x+y$ (2)

Từ (1) và (2) suy ra $[x]+[y]\le[x+y]$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề chỉ gồm các phần nguyên nên phải quay về định nghĩa: $[a]$ là số nguyên lớn nhất không vượt quá $a$, tức mọi số nguyên không vượt quá $a$ đều không lớn hơn $[a]$.

**Bước 1.** Viết $[x]\le x$ và $[y]\le y$ rồi cộng để có $[x]+[y]\le x+y$.

**Bước 2.** Nhận ra $[x]+[y]$ là tổng của hai số nguyên nên bản thân nó là một số nguyên không vượt quá $x+y$.

**Bước 3.** Áp dụng tính lớn nhất của $[x+y]$ trong định nghĩa để so sánh số nguyên này với $[x+y]$.

**Phần 2. Trình bày**

Theo định nghĩa, $[x]\le x$ và $[y]\le y$ nên $[x]+[y]\le x+y$.

Mà $[x]+[y]$ là số nguyên nên nó là một số nguyên không vượt quá $x+y$.

Theo định nghĩa, $[x+y]$ là số nguyên lớn nhất không vượt quá $x+y$, nên mọi số nguyên không vượt quá $x+y$ đều không lớn hơn $[x+y]$.

Vậy $[x]+[y]\le[x+y]$.

=== V2B.416a@p52
- bai: 416 · y: a · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ · tổng các bình phương không âm bằng 0
- kiem: khong
- ket_qua_sach: x=-1, y=1
- dap_an: $x=-1,\ y=1$
- ghi_chu_nghi: Máy: lưới ngẫu nhiên 300000 điểm cho $(x+y)^2-(x+1)(y-1)\ge0$, không phản ví dụ; nghiệm duy nhất $(-1;1)$. Coi $x,y$ là số thực.
## DE
Dùng phương pháp bất đẳng thức để giải phương trình: $(x+y)^2=(x+1)(y-1)$.
## SACH
Đặt $x+1=a$, $y-1=b$. Phương trình trở thành $(a+b)^2=ab$. Dễ dàng tính được $a=b=0$.

Đáp số: $x=-1$, $y=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải là tích $(x+1)(y-1)$ còn vế trái là bình phương của $x+y$ mà $x+y=(x+1)+(y-1)$, nên đặt hai nhân tử làm ẩn mới để phương trình thành $(a+b)^2=ab$, một đẳng thức đối xứng đưa được về tổng các bình phương.

**Bước 1.** Đặt $a=x+1$ và $b=y-1$ để vế trái thành $(a+b)^2$ và vế phải thành $ab$.

**Bước 2.** Chuyển vế và khai triển để được $a^2+ab+b^2=0$, một biểu thức bậc hai đồng nhất của $a,b$.

**Bước 3.** Nhân hai vế với $4$ để viết biểu thức thành tổng hai bình phương không âm, từ đó suy ra từng bình phương bằng $0$.

**Bước 4.** Giải ngược để tìm $a,b$ rồi tính $x,y$.

**Phần 2. Trình bày**

Đặt $a=x+1$, $b=y-1$; khi đó $x+y=a+b$ và phương trình trở thành $(a+b)^2=ab$

$\Leftrightarrow a^2+ab+b^2=0$

$\Leftrightarrow4a^2+4ab+4b^2=0$

$\Leftrightarrow(2a+b)^2+3b^2=0$

Vì $(2a+b)^2\ge0$ và $3b^2\ge0$ nên đẳng thức xảy ra khi và chỉ khi $2a+b=0$ và $b=0$, tức $a=b=0$.

Suy ra $x+1=0$ và $y-1=0$, tức $x=-1$, $y=1$.

Vậy $x=-1$, $y=1$.

=== V2B.416b@p52
- bai: 416 · y: b · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: biến đổi về tổng các bình phương không âm bằng 0
- kiem: khong
- ket_qua_sach: x=y=z=t=0
- dap_an: $x=y=z=t=0$
- ghi_chu_nghi: Máy: $4\left(x^2+y^2+z^2+t^2-x(y+z+t)\right)=(x-2y)^2+(x-2z)^2+(x-2t)^2+x^2\ge0$ đúng trên 300000 bộ số ngẫu nhiên. Coi các ẩn là số thực.
## DE
Dùng phương pháp bất đẳng thức để giải phương trình: $x^2+y^2+z^2+t^2=x(y+z+t)$.
## SACH
Biến đổi: $(x-2y)^2+(x-2z)^2+(x-2t)^2+x^2=0$.

Đáp số: $x=y=z=t=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải có các tích $xy,xz,xt$ chung thừa số $x$ nên ghép mỗi $y^2$ với một phần $x^2$ để hiện bình phương dạng $(x-2y)^2$, rồi dùng tính không âm của tổng bình phương.

**Bước 1.** Chuyển hết về một vế và nhân hai vế với $4$ để hệ số của các tích $xy,xz,xt$ thành $-4$.

**Bước 2.** Nhận ra $4y^2-4xy$ cần thêm $x^2$ để thành $(x-2y)^2$, và tương tự với $z,t$, nên tách $4x^2$ thành $3x^2+x^2$.

**Bước 3.** Viết phương trình thành tổng bốn bình phương bằng $0$.

**Bước 4.** Suy ra từng bình phương bằng $0$ rồi giải ra bốn ẩn.

**Phần 2. Trình bày**

Phương trình tương đương $4(x^2+y^2+z^2+t^2)-4x(y+z+t)=0$

$\Leftrightarrow(x^2-4xy+4y^2)+(x^2-4xz+4z^2)+(x^2-4xt+4t^2)+x^2=0$

$\Leftrightarrow(x-2y)^2+(x-2z)^2+(x-2t)^2+x^2=0$

Tổng bốn bình phương bằng $0$ khi và chỉ khi mỗi bình phương bằng $0$: $x=0$, $x=2y$, $x=2z$, $x=2t$.

Vậy $x=y=z=t=0$.

=== V2B.416c@p52
- bai: 416 · y: c · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Cô-si hai số (hoặc (a-b)^2\ge0) · nhân các bất đẳng thức cùng chiều có hai vế dương
- kiem: khong
- ket_qua_sach: x=1, y=2, z=3
- dap_an: $x=1,\ y=2,\ z=3$
- ghi_chu_nghi: Máy: $(x^2+1)(y^2+4)(z^2+9)-48xyz\ge0$ trên 300000 bộ ngẫu nhiên $x,y,z>0$ và bằng $0$ tại $(1;2;3)$ khớp sách.
## DE
Dùng phương pháp bất đẳng thức để giải phương trình: $(x^2+1)(y^2+4)(z^2+9)=48xyz$ ($x,y,z>0$).
## SACH
Đáp số: $x=1$, $y=2$, $z=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi nhân tử ở vế trái có dạng tổng hai bình phương ($x^2+1^2$, $y^2+2^2$, $z^2+3^2$) nên Cô-si cho $x^2+1\ge2x$, $y^2+4\ge4y$, $z^2+9\ge6z$, và tích $2\cdot4\cdot6=48$ trùng hệ số $48$ ở vế phải, báo hiệu đúng hướng.

**Bước 1.** Nhận ra các hằng số $1,4,9$ là bình phương của $1,2,3$ và hệ số $48=2\cdot4\cdot6$ để dự đoán dùng Cô-si cho từng nhân tử.

**Bước 2.** Viết ba bất đẳng thức $x^2+1\ge2x$, $y^2+4\ge4y$, $z^2+9\ge6z$ và chỉ ra điều kiện dấu "=" của từng cái.

**Bước 3.** Nhân ba bất đẳng thức vế theo vế (các vế đều dương vì $x,y,z>0$) để so sánh vế trái với $48xyz$.

**Bước 4.** Dùng phương trình đã cho để buộc cả ba dấu "=" cùng xảy ra rồi suy ra $x,y,z$.

**Phần 2. Trình bày**

Vì $x,y,z>0$, theo bất đẳng thức Cô-si cho hai số dương (hoặc $(a-b)^2\ge0$):

$x^2+1\ge2x$ (dấu "=" khi $x=1$), $y^2+4\ge4y$ (dấu "=" khi $y=2$), $z^2+9\ge6z$ (dấu "=" khi $z=3$).

Các vế đều dương nên nhân vế theo vế: $(x^2+1)(y^2+4)(z^2+9)\ge2x\cdot4y\cdot6z=48xyz$.

Dấu "=" xảy ra khi và chỉ khi cả ba bất đẳng thức đều là đẳng thức (nếu có một bất đẳng thức chặt, vì các nhân tử khác dương nên tích chặt), tức $x=1$, $y=2$, $z=3$.

Phương trình đã cho chính là trường hợp dấu "=" nên $x=1$, $y=2$, $z=3$.

Thử lại: $(1+1)(4+4)(9+9)=2\cdot8\cdot18=288=48\cdot1\cdot2\cdot3$.

Vậy $x=1$, $y=2$, $z=3$.

=== V2B.416d@p52
- bai: 416 · y: d · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: (a+b)^2\ge4ab (hoặc Cô-si hai số không âm) · bình phương hai vế không âm · xét riêng xy=0
- kiem: khong
- ket_qua_sach: x=y=1; x=y=0
- dap_an: $(x;y)=(1;1)$ hoặc $(x;y)=(0;0)$
- ghi_chu_nghi: Sách viện dẫn ví dụ 94 (không chép lại được); đã tự chứng minh bất đẳng thức. Máy: $(x+1)(y+1)(x+y)-8xy\ge0$ trên 300000 cặp ngẫu nhiên $x,y\ge0$; lưới bước $0,05$ trên $[0;6]$ chỉ có nghiệm $(0;0)$ và $(1;1)$.
## DE
Dùng phương pháp bất đẳng thức để giải phương trình: $(x+1)(y+1)(x+y)=8xy$ ($x,y\ge0$).
## SACH
Sử dụng bất đẳng thức $(x+1)(y+1)(x+y)\ge8xy$ (xem ví dụ 94).

Xảy ra đẳng thức khi và chỉ khi $x=y=1$, $x=y=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải $8xy$ gợi tích ba bất đẳng thức $(x+1)^2\ge4x$, $(y+1)^2\ge4y$, $(x+y)^2\ge4xy$ có các nhân tử đều không âm, và $4\cdot4\cdot4=64=8^2$ nên bình phương hai vế rồi so sánh.

**Bước 1.** Nhận xét ba nhân tử của vế trái đều không âm và tích cần so với $8xy$ nên bình phương để dùng được $(a+b)^2\ge4ab$.

**Bước 2.** Viết ba bất đẳng thức $(x+1)^2\ge4x$, $(y+1)^2\ge4y$, $(x+y)^2\ge4xy$ rồi nhân vế với vế để chặn vế trái bởi $8xy$.

**Bước 3.** Với phương trình, xét riêng trường hợp $xy=0$ vì lúc đó không thể chia hay nhân bất đẳng thức chặt, rồi tìm nghiệm trực tiếp.

**Bước 4.** Với $x,y>0$, dùng điều kiện cả ba dấu "=" cùng xảy ra để tìm nghiệm.

**Phần 2. Trình bày**

Với $x,y\ge0$: $(x+1)^2\ge4x\ge0$, $(y+1)^2\ge4y\ge0$, $(x+y)^2\ge4xy\ge0$ (bất đẳng thức $(a+b)^2\ge4ab$, dấu "=" khi $a=b$). Nhân vế theo vế:

$\left[(x+1)(y+1)(x+y)\right]^2\ge64x^2y^2$

Vì hai vế không âm nên $(x+1)(y+1)(x+y)\ge8xy$ với mọi $x,y\ge0$. Do đó phương trình chỉ xảy ra khi dấu "=" xảy ra.

Trường hợp $xy=0$: nếu $x=0$ phương trình thành $(y+1)y=0$ nên $y=0$ (do $y\ge0$); nếu $y=0$ tương tự $x=0$. Vậy $(0;0)$ thoả mãn: $(0+1)(0+1)\cdot0=0=8\cdot0\cdot0$.

Trường hợp $x,y>0$: ba vế phải $4x,4y,4xy$ đều dương, nên dấu "=" xảy ra khi và chỉ khi cả ba bất đẳng thức đều là đẳng thức:

$(x+1)^2=4x\Leftrightarrow(x-1)^2=0\Leftrightarrow x=1$, $(y+1)^2=4y\Leftrightarrow y=1$, và $(x+y)^2=4xy\Leftrightarrow(x-y)^2=0\Leftrightarrow x=y$.

Vậy $x=y=1$; thử lại: $(1+1)(1+1)(1+1)=8=8\cdot1\cdot1$.

Vậy $(x;y)=(0;0)$ hoặc $(x;y)=(1;1)$.

=== V2B.417a@p52
- bai: 417 · y: a · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đánh giá S(n)\le28 để kẹp n · xét các chữ số
- kiem: khong
- ket_qua_sach: 2008
- dap_an: $n=2008$
- ghi_chu_nghi: Sách đặt $n=\overline{20bc}$ nhưng kết luận "$a=0$, $b=8$", đúng phải là $b=0$, $c=8$ (đổi tên chữ cái); không ảnh hưởng đáp số. Máy vét $n<200000$: duy nhất $n=2008$.
## DE
Kí hiệu $S(n)$ là tổng các chữ số của $n$. Tìm số nguyên dương $n$ sao cho: $n+S(n)=2018$.
## SACH
Ta có $n+S(n)=2018$ (1)

nên $n<2018$ (2)

$S(n)\le1+9\cdot3=28$,

$n\ge2018-28=1990$ (3)

Từ (2) và (3) suy ra $n=\overline{199a}$ hoặc $n=\overline{20bc}$.

Thay $n=\overline{199a}$ vào (1) được $2a=9$, loại.

Thay $n=\overline{20bc}$ vào (1) được $a=0$, $b=8$. Đáp số: $2008$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng chữ số $S(n)$ nhỏ hơn rất nhiều so với $n$, nên từ $n+S(n)=2018$ có thể kẹp $n$ trong khoảng ngắn quanh $2018$, rồi xét từng dạng chữ số của $n$ trong khoảng đó.

**Bước 1.** Chặn $n$ từ trên bằng $n<2018$ vì $S(n)>0$, nên $n$ có tối đa $4$ chữ số.

**Bước 2.** Chặn $S(n)$ từ trên: $n\le2017$ có tối đa $4$ chữ số nên $S(n)\le28$, suy ra $n\ge1990$.

**Bước 3.** Chia khoảng $1990\le n\le2017$ thành hai dạng $\overline{199a}$ và $\overline{20bc}$ rồi viết $n+S(n)$ theo các chữ số.

**Bước 4.** Giải phương trình theo chữ số ở từng dạng, loại nghiệm không là chữ số, rồi thử lại.

**Phần 2. Trình bày**

Vì $S(n)>0$ nên $n<2018$, tức $n\le2017$. Nếu $n\le1999$ thì $S(n)\le1+9+9+9=28$; nếu $2000\le n\le2017$ thì $S(n)\le2+0+1+9=12$. Do đó $S(n)\le28$ và $n=2018-S(n)\ge1990$.

Vậy $1990\le n\le2017$, nên $n=\overline{199a}$ ($0\le a\le9$) hoặc $n=\overline{20bc}$ ($b\in\{0;1\}$).

Với $n=\overline{199a}=1990+a$: $S(n)=19+a$ nên $n+S(n)=2009+2a=2018\Leftrightarrow2a=9$, loại vì $a$ nguyên.

Với $n=\overline{20bc}=2000+10b+c$: $S(n)=2+b+c$ nên $n+S(n)=2002+11b+2c=2018\Leftrightarrow11b+2c=16$.

Nếu $b=0$ thì $c=8$; nếu $b=1$ thì $2c=5$, loại. Vậy $n=2008$.

Thử lại: $2008+(2+0+0+8)=2018$.

Vậy $n=2008$.

=== V2B.417b@p52
- bai: 417 · y: b · trang: 52 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: S(n)\le n · xét khoảng của n · (n-1)(n-2004)\le0 với 1\le n\le2004
- kiem: khong
- ket_qua_sach: 2005
- dap_an: $n=2005$
- ghi_chu_nghi: bài *. Sách viết "$n(n-2005)>n$" ở khoảng $n>2005$, đúng phải là $\ge$ (vì $n-2005\ge1$) nên bản kho dùng $\ge$; kết luận không đổi. Máy vét $n<3000000$: duy nhất $n=2005$.
## DE
Kí hiệu $S(n)$ là tổng các chữ số của $n$. Tìm số nguyên dương $n$ sao cho: $S(n)=n^2-2005n+7$.
## SACH
$S(n)=n^2-2005n+7$ (1)

– Xét $n=2005$ thì $S(n)=7$ và (1) đúng.

– Xét $n>2005$. Ta có $S(n)=n^2-2005n+7>n(n-2005)>n$, tức là $S(n)>n$, vô lí.

– Xét $1\le n\le2004$. Ta có $n-1\ge0$, $n-2004\le0$ nên

$(n-1)(n-2004)\le0\Rightarrow n^2-2005n+2004\le0$

$\Rightarrow n^2-2005n+7\le-1997\Rightarrow S(n)<0$, vô lí.

Đáp số: $n=2005$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái $S(n)$ không âm và không vượt quá $n$ còn vế phải là tam thức bậc hai $n^2-2005n+7=n(n-2005)+7$ đổi dấu quanh $n=2005$; chia khoảng của $n$ để mỗi khoảng chỉ rõ một vế lớn hơn vế kia.

**Bước 1.** Nhớ rằng $S(n)\le n$ vì tổng các chữ số không vượt quá chính số đó, và $S(n)>0$ vì $n$ nguyên dương.

**Bước 2.** Thử $n=2005$ để thấy $S(2005)=7$ trùng với vế phải $2005^2-2005\cdot2005+7=7$, nên $2005$ là nghiệm.

**Bước 3.** Với $n>2005$, đánh giá vế phải lớn hơn $n$, mâu thuẫn với $S(n)\le n$.

**Bước 4.** Với $1\le n\le2004$, đánh giá vế phải âm, mâu thuẫn với $S(n)>0$.

**Phần 2. Trình bày**

Vì $n$ nguyên dương nên $0<S(n)\le n$.

Với $n=2005$: $S(2005)=2+0+0+5=7$ và $n^2-2005n+7=7$, thoả mãn.

Với $n\ge2006$: $n-2005\ge1$ nên $n^2-2005n+7=n(n-2005)+7>n(n-2005)\ge n\ge S(n)$, vế phải lớn hơn vế trái, không thoả mãn.

Với $1\le n\le2004$: $(n-1)(n-2004)\le0$ nên $n^2-2005n+2004\le0$, suy ra $n^2-2005n+7\le-1997<0<S(n)$, không thoả mãn.

Vậy $n=2005$.

