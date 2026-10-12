# ĐỀ | Đề cương ôn tập giữa học kì 1 Toán 7 — THCS Ngôi Sao Hoàng Mai (MathCare)
kieu: de_cuong
bo_sach: KNTT

## PHẦN 2 | Phần II. Tự luận — Dạng 2: tìm x nâng cao (Bài 7–8) | tu_luan

### Bài 7a | kho=dai | loai=tra_loi_ngan | dap_an=2026
**Đề:** Tìm $x$, biết: $\dfrac{1}{1.2}+\dfrac{1}{2.3}+\dfrac{1}{3.4}+\dots+\dfrac{1}{x(x+1)}=\dfrac{2026}{2027}$;
**Chưa chắc:** kĩ thuật tách $\dfrac{1}{n(n+1)}=\dfrac{1}{n}-\dfrac{1}{n+1}$ rồi triệt tiêu liên tiếp nằm ngoài lý thuyết trên bản đồ K7 (bản đồ chỉ có cộng trừ phân số thông thường, chưa có dạng "tổng dãy phân số có quy luật"); lời giải ngầm hiểu $x$ là số tự nhiên khác 0 vì mẫu cuối là $x(x+1)$. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi số hạng có dạng $\dfrac{1}{n(n+1)}$ nên tách được thành hiệu hai phân số liên tiếp, và cả dãy chỉ còn lại số hạng đầu với số hạng cuối.

**Bước 1.** Nhìn quy luật vế trái: tử luôn là 1, mẫu là tích của hai số tự nhiên liên tiếp, số hạng cuối có mẫu $x(x+1)$.

**Bước 2.** Kiểm tra bằng quy đồng rằng $\dfrac{1}{n}-\dfrac{1}{n+1}$ đúng bằng $\dfrac{1}{n(n+1)}$, rồi viết từng số hạng thành hiệu hai phân số.

**Bước 3.** Cộng cả dãy: số trừ của số hạng này đối với số cộng của số hạng kế tiếp nên triệt tiêu từng cặp, chỉ còn số hạng đầu và số cuối.

**Bước 4.** Chuyển vế để cô lập $\dfrac{1}{x+1}$, sau đó so sánh hai phân số có cùng tử để tìm $x+1$ rồi $x$.

**Chú ý:** các phân số $\dfrac{1}{n}$ ở giữa xuất hiện hai lần với dấu ngược nhau nên mới triệt tiêu hết.

**Phần 2. Trình bày**

Với mọi số tự nhiên $n$ khác 0 ta có $\dfrac{1}{n}-\dfrac{1}{n+1}=\dfrac{n+1}{n(n+1)}-\dfrac{n}{n(n+1)}=\dfrac{1}{n(n+1)}$.

$\dfrac{1}{1.2}+\dfrac{1}{2.3}+\dfrac{1}{3.4}+\dots+\dfrac{1}{x(x+1)}=\dfrac{2026}{2027}$

$\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\left(\dfrac{1}{3}-\dfrac{1}{4}\right)+\dots+\left(\dfrac{1}{x}-\dfrac{1}{x+1}\right)=\dfrac{2026}{2027}$

$1-\dfrac{1}{x+1}=\dfrac{2026}{2027}$

$\dfrac{1}{x+1}=1-\dfrac{2026}{2027}$

$\dfrac{1}{x+1}=\dfrac{1}{2027}$

$x+1=2027$

$x=2026$

Thử lại: với $x=2026$ vế trái bằng $1-\dfrac{1}{2027}=\dfrac{2026}{2027}$ đúng với vế phải.

### Bài 7b | kho=dai | loai=tra_loi_ngan | dap_an=6
**Đề:** Tìm $x$, biết: $\dfrac{1}{3}+\dfrac{1}{3^2}+\dfrac{1}{3^3}+\dfrac{1}{3^4}+\dots+\dfrac{1}{3^x}=\dfrac{364}{729}$;
**Chưa chắc:** kĩ thuật "nhân tổng với 3 rồi trừ tổng ban đầu" để tính tổng dãy luỹ thừa nằm ngoài lý thuyết trên bản đồ K7 (bản đồ chỉ có các phép tính với luỹ thừa, chưa có tổng dãy luỹ thừa cùng cơ số); lời giải ngầm hiểu $x$ là số tự nhiên khác 0. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi số hạng bằng số hạng đứng trước chia cho 3, nên nhân cả tổng với 3 rồi trừ đi tổng ban đầu thì hầu hết số hạng triệt tiêu.

**Bước 1.** Nhận ra quy luật: mẫu của mỗi số hạng gấp 3 lần mẫu của số hạng đứng trước, số hạng cuối là $\dfrac{1}{3^x}$.

**Bước 2.** Đặt cả tổng ở vế trái là $A$, rồi nhân hai vế với 3: các số hạng từ thứ hai trở đi của $3A$ trùng với các số hạng của $A$.

**Bước 3.** Lấy $3A$ trừ $A$ để các số hạng trùng nhau triệt tiêu, chỉ còn số hạng đầu của $3A$ và số hạng cuối của $A$.

**Bước 4.** Thay $A$ bằng giá trị đã cho ở vế phải, chuyển vế để tìm $\dfrac{1}{3^x}$, đưa về $3^x$ rồi so sánh với luỹ thừa của 3 để tìm $x$.

**Chú ý:** hai luỹ thừa cùng cơ số lớn hơn 1 mà bằng nhau thì có cùng số mũ.

**Phần 2. Trình bày**

Đặt $A=\dfrac{1}{3}+\dfrac{1}{3^2}+\dfrac{1}{3^3}+\dots+\dfrac{1}{3^x}$.

$3A=1+\dfrac{1}{3}+\dfrac{1}{3^2}+\dots+\dfrac{1}{3^{x-1}}$

$3A-A=1-\dfrac{1}{3^x}$

$2A=1-\dfrac{1}{3^x}$

Mà $A=\dfrac{364}{729}$ nên $2.\dfrac{364}{729}=1-\dfrac{1}{3^x}$

$\dfrac{728}{729}=1-\dfrac{1}{3^x}$

$\dfrac{1}{3^x}=1-\dfrac{728}{729}$

$\dfrac{1}{3^x}=\dfrac{1}{729}$

$3^x=729$

$3^x=3^6$

$x=6$

Thử lại: $\dfrac{1}{3}+\dfrac{1}{3^2}+\dots+\dfrac{1}{3^6}=\dfrac{3^6-1}{2.3^6}=\dfrac{728}{1458}=\dfrac{364}{729}$.

### Bài 7c | kho=dai | loai=tra_loi_ngan | dap_an=2026
**Đề:** Tìm $x$, biết: $\dfrac{1}{1+2}+\dfrac{1}{1+2+3}+\dfrac{1}{1+2+3+4}+\dots+\dfrac{1}{1+2+3+\dots+x}=\dfrac{2025}{2027}$;
**Chưa chắc:** dùng hai kĩ thuật nằm ngoài lý thuyết trên bản đồ K7: công thức tổng $1+2+\dots+n=\dfrac{n(n+1)}{2}$ (kiến thức lớp 6, ngoài bản đồ K7) và tách $\dfrac{1}{n(n+1)}=\dfrac{1}{n}-\dfrac{1}{n+1}$ để triệt tiêu như Bài 7a; ngầm hiểu $x$ là số tự nhiên $x\ge2$. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu mỗi số hạng là tổng $1+2+\dots+n$ nên bằng $\dfrac{n(n+1)}{2}$, do đó số hạng bằng $\dfrac{2}{n(n+1)}$ và tách được thành hiệu hai phân số.

**Bước 1.** Quan sát quy luật: mẫu của số hạng thứ nhất là tổng đến 2, số hạng thứ hai là tổng đến 3, …, số hạng cuối là tổng đến $x$.

**Bước 2.** Tính mỗi mẫu bằng công thức tổng các số tự nhiên liên tiếp từ 1, nên mỗi số hạng được viết thành 2 chia cho tích hai số tự nhiên liên tiếp.

**Bước 3.** Tách $\dfrac{2}{n(n+1)}$ thành hiệu hai phân số có tử 2, đặt 2 làm thừa số chung rồi cộng cả dãy để các số hạng ở giữa triệt tiêu.

**Bước 4.** Đưa phương trình về dạng chỉ còn $\dfrac{2}{x+1}$, chuyển vế rồi so sánh hai phân số cùng tử để tìm $x+1$ và $x$.

**Chú ý:** số hạng đầu ứng với $n=2$ nên sau khi triệt tiêu còn lại $\dfrac{1}{2}$ chứ không phải 1.

**Phần 2. Trình bày**

Với $n\ge2$ ta có $1+2+3+\dots+n=\dfrac{n(n+1)}{2}$.

Suy ra $\dfrac{1}{1+2+3+\dots+n}=\dfrac{2}{n(n+1)}=2.\left(\dfrac{1}{n}-\dfrac{1}{n+1}\right)$.

Vế trái $=2.\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+2.\left(\dfrac{1}{3}-\dfrac{1}{4}\right)+\dots+2.\left(\dfrac{1}{x}-\dfrac{1}{x+1}\right)$

$=2.\left(\dfrac{1}{2}-\dfrac{1}{x+1}\right)$

$=1-\dfrac{2}{x+1}$

Do đó $1-\dfrac{2}{x+1}=\dfrac{2025}{2027}$

$\dfrac{2}{x+1}=1-\dfrac{2025}{2027}$

$\dfrac{2}{x+1}=\dfrac{2}{2027}$

$x+1=2027$

$x=2026$

Thử lại: với $x=2026$ vế trái bằng $1-\dfrac{2}{2027}=\dfrac{2025}{2027}$.

### Bài 7d | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tìm $x$, biết: $2^x+2^{x+1}+2^{x+2}+\dots+2^{x+2017}=2^{2020}-4$;
**Chưa chắc:** kĩ thuật "nhân tổng với 2 rồi trừ" để tính $1+2+2^2+\dots+2^{2017}$ và đặt thừa số chung $2^x$ nằm ngoài lý thuyết trên bản đồ K7 (bản đồ có $a^m.a^n$ và đặt $3^x$ chung ở dạng $3^{x+1}-3^x$, chưa có tổng dãy luỹ thừa). CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết mỗi số hạng thành $2^x$ nhân một luỹ thừa của 2 để đặt $2^x$ làm thừa số chung, rồi tính tổng dãy luỹ thừa còn lại bằng cách nhân 2 và trừ.

**Bước 1.** Tách mỗi số hạng $2^{x+k}$ thành tích $2^x.2^k$ theo quy tắc nhân hai luỹ thừa cùng cơ số, rồi đặt $2^x$ làm thừa số chung.

**Bước 2.** Tính tổng $1+2+2^2+\dots+2^{2017}$ bằng cách nhân nó với 2 và lấy kết quả trừ đi tổng ban đầu để số hạng ở giữa triệt tiêu.

**Bước 3.** Viết vế phải $2^{2020}-4$ thành tích có thừa số $2^{2018}-1$, bằng cách tách $2^{2020}$ thành $2^2.2^{2018}$ rồi đặt $2^2$ chung.

**Bước 4.** Hai vế có cùng thừa số $2^{2018}-1$ khác 0 nên chia hai vế cho thừa số đó, rồi so sánh hai luỹ thừa cùng cơ số 2 để tìm $x$.

**Chú ý:** viết $4=2^2$ trước khi đặt thừa số chung ở vế phải.

**Phần 2. Trình bày**

$2^x+2^{x+1}+2^{x+2}+\dots+2^{x+2017}=2^x.\left(1+2+2^2+\dots+2^{2017}\right)$

Đặt $B=1+2+2^2+\dots+2^{2017}$.

$2B=2+2^2+2^3+\dots+2^{2017}+2^{2018}$

$2B-B=2^{2018}-1$

$B=2^{2018}-1$

Vế trái $=2^x.\left(2^{2018}-1\right)$.

Vế phải: $2^{2020}-4=2^2.2^{2018}-2^2=2^2.\left(2^{2018}-1\right)$.

Do đó $2^x.\left(2^{2018}-1\right)=2^2.\left(2^{2018}-1\right)$

Vì $2^{2018}-1\ne0$ nên $2^x=2^2$

$x=2$

Thử lại: với $x=2$ vế trái bằng $2^2.\left(2^{2018}-1\right)=2^{2020}-2^2=2^{2020}-4$.

### Bài 7e | kho=dai | loai=tra_loi_ngan | dap_an=100
**Đề:** Tìm $x$, biết: $5^2+5^4+5^6+\dots+5^x=\dfrac{5^{102}-25}{24}$.
**Chưa chắc:** kĩ thuật "nhân tổng với $5^2$ rồi trừ" để tính tổng dãy luỹ thừa cách đều số mũ nằm ngoài lý thuyết trên bản đồ K7; lời giải ngầm hiểu $x$ là số tự nhiên chẵn (số mũ chạy 2; 4; 6; …). CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số mũ tăng đều 2 đơn vị nên số hạng sau gấp số hạng trước 25 lần; nhân tổng với 25 rồi trừ đi tổng ban đầu để triệt tiêu các số hạng ở giữa.

**Bước 1.** Nhận ra quy luật: các số mũ $2;4;6;\dots;x$ cách nhau 2 nên mỗi số hạng gấp $5^2=25$ lần số hạng đứng trước.

**Bước 2.** Đặt tổng ở vế trái là $C$ và nhân với 25: số mũ của mỗi số hạng tăng thêm 2, nên phần lớn số hạng trùng với số hạng của $C$.

**Bước 3.** Lấy $25C$ trừ $C$ để các số hạng trùng nhau triệt tiêu, rồi chia cho 24 để biểu thị $C$ theo $x$.

**Bước 4.** Cho biểu thức của $C$ bằng vế phải đề bài, loại hai mẫu giống nhau để còn hai luỹ thừa cùng cơ số 5, rồi so sánh số mũ để tìm $x$.

**Chú ý:** số hạng cuối $5^x$ nhân với 25 thành $5^{x+2}$ chứ không phải $5^{2x}$.

**Phần 2. Trình bày**

Đặt $C=5^2+5^4+5^6+\dots+5^x$.

$25C=5^4+5^6+\dots+5^x+5^{x+2}$

$25C-C=5^{x+2}-5^2$

$24C=5^{x+2}-25$

$C=\dfrac{5^{x+2}-25}{24}$

Mà $C=\dfrac{5^{102}-25}{24}$ nên $\dfrac{5^{x+2}-25}{24}=\dfrac{5^{102}-25}{24}$

$5^{x+2}-25=5^{102}-25$

$5^{x+2}=5^{102}$

$x+2=102$

$x=100$

Thử lại: $x=100$ chẵn, dãy có 50 số hạng $5^2;5^4;\dots;5^{100}$ và $24.C=5^{102}-25$.

### Bài 8a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $\left(\dfrac{1}{2}+\dfrac{1}{3}+\dfrac{1}{4}+\dots+\dfrac{1}{2024}+\dfrac{1}{2025}\right)\sqrt{x}=\dfrac{1}{2024}+\dfrac{2}{2023}+\dfrac{3}{2022}+\dots+\dfrac{2023}{2}+\dfrac{2024}{1}$;
**Chưa chắc:** kĩ thuật "cộng thêm 1 vào từng số hạng rồi bù lại" để biến dãy $\dfrac{k}{2025-k}$ về tổng $2025.\left(\dfrac{1}{2}+\dots+\dfrac{1}{2025}\right)$ và phép chia hai vế cho một tổng dài nằm ngoài lý thuyết trên bản đồ K7; chỉ bước $\sqrt{x}=a\Rightarrow x=a^2$ có trong nhóm tìm $x$ căn (NNB00967). Quy luật vế phải: tử chạy $1;2;\dots;2024$, mẫu chạy $2024;2023;\dots;1$, tổng tử và mẫu của mỗi số hạng luôn bằng 2025, có 2024 số hạng. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu của mỗi số hạng vế phải cộng lại luôn bằng 2025, nên cộng thêm 1 vào mỗi số hạng thì tử đều thành 2025 và vế phải trở về cùng một tổng với ngoặc ở vế trái.

**Bước 1.** Tìm quy luật vế phải: tử tăng dần từ 1, mẫu giảm dần từ 2024 và tử cộng mẫu của mọi số hạng đều bằng một số cố định; đếm số số hạng.

**Bước 2.** Cộng thêm 1 vào từng số hạng của vế phải để tử thành số cố định đó, đồng thời trừ đi đúng số số hạng để giá trị không đổi.

**Bước 3.** Gộp số hạng cuối với phần vừa trừ thành một phân số mẫu cố định, rồi đặt thừa số chung để thấy vế phải là tích của số cố định với tổng ở ngoặc vế trái.

**Bước 4.** Chia hai vế cho tổng ở ngoặc (là tổng các số dương nên khác 0) để được $\sqrt{x}$, rồi bình phương để tìm $x$.

**Chú ý:** số số hạng vế phải là 2024 nên phải trừ đi 2024, không phải 2025.

**Phần 2. Trình bày**

Vế phải gồm 2024 số hạng, số hạng thứ $k$ là $\dfrac{k}{2025-k}$ với $k=1;2;\dots;2024$.

$\dfrac{1}{2024}+\dfrac{2}{2023}+\dots+\dfrac{2023}{2}+\dfrac{2024}{1}$

$=\left(\dfrac{1}{2024}+1\right)+\left(\dfrac{2}{2023}+1\right)+\dots+\left(\dfrac{2023}{2}+1\right)+\left(\dfrac{2024}{1}+1\right)-2024$

$=\dfrac{2025}{2024}+\dfrac{2025}{2023}+\dots+\dfrac{2025}{2}+\dfrac{2025}{1}-2024$

$=\dfrac{2025}{2024}+\dfrac{2025}{2023}+\dots+\dfrac{2025}{2}+1$

$=\dfrac{2025}{2024}+\dfrac{2025}{2023}+\dots+\dfrac{2025}{2}+\dfrac{2025}{2025}$

$=2025.\left(\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{2024}+\dfrac{1}{2025}\right)$

Đặt $S=\dfrac{1}{2}+\dfrac{1}{3}+\dfrac{1}{4}+\dots+\dfrac{1}{2024}+\dfrac{1}{2025}$, ta có $S>0$.

Phương trình trở thành $S.\sqrt{x}=2025.S$

$\sqrt{x}=2025$ (chia hai vế cho $S\ne0$)

$x=2025^2$

$x=4100625$

Thử lại: với $\sqrt{x}=2025$ vế trái bằng $2025.S$ và vế phải cũng bằng $2025.S$.

### Bài 8b | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm $x$, biết: $\dfrac{2026\sqrt{x}-2000}{26}+\dfrac{2026\sqrt{x}-1990}{36}+\dfrac{2026\sqrt{x}-1980}{46}=3$;
**Chưa chắc:** kĩ thuật "trừ 1 vào từng phân số rồi đặt thừa số chung" để gom các phân số có chung $2026\sqrt{x}-2026$ nằm ngoài lý thuyết trên bản đồ K7; chỉ có $\sqrt{x}=a\Rightarrow x=a^2$ trong nhóm tìm $x$ căn. Quy luật: số trừ ở tử giảm 10 (2000; 1990; 1980), mẫu tăng 10 (26; 36; 46), tổng mỗi cặp bằng 2026 là hệ số của $\sqrt{x}$. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số trừ ở tử cộng với mẫu của mỗi phân số đều bằng 2026, nên trừ 1 vào từng phân số thì tử xuất hiện chung thừa số $2026\sqrt{x}-2026$.

**Bước 1.** Tìm quy luật: cộng số trừ ở tử với mẫu của từng phân số, cả ba cặp đều cho cùng một số và số đó trùng với hệ số của $\sqrt{x}$.

**Bước 2.** Trừ 1 vào mỗi phân số ở vế trái, đồng thời trừ 3 ở vế phải (vì có ba phân số) để phương trình không đổi.

**Bước 3.** Đưa mỗi tử về cùng biểu thức rồi đặt thừa số chung ra ngoài, trong ngoặc còn tổng ba phân số có tử 1.

**Bước 4.** Tích bằng 0 mà một thừa số là tổng các số dương nên thừa số chứa $\sqrt{x}$ phải bằng 0, từ đó tìm $\sqrt{x}$ rồi $x$.

**Chú ý:** vế phải $3-3=0$ nên phương trình đưa về dạng tích bằng 0.

**Phần 2. Trình bày**

$\dfrac{2026\sqrt{x}-2000}{26}+\dfrac{2026\sqrt{x}-1990}{36}+\dfrac{2026\sqrt{x}-1980}{46}=3$

$\left(\dfrac{2026\sqrt{x}-2000}{26}-1\right)+\left(\dfrac{2026\sqrt{x}-1990}{36}-1\right)+\left(\dfrac{2026\sqrt{x}-1980}{46}-1\right)=3-3$

$\dfrac{2026\sqrt{x}-2026}{26}+\dfrac{2026\sqrt{x}-2026}{36}+\dfrac{2026\sqrt{x}-2026}{46}=0$

$2026.\left(\sqrt{x}-1\right).\left(\dfrac{1}{26}+\dfrac{1}{36}+\dfrac{1}{46}\right)=0$

Vì $2026.\left(\dfrac{1}{26}+\dfrac{1}{36}+\dfrac{1}{46}\right)>0$ nên $\sqrt{x}-1=0$

$\sqrt{x}=1$

$x=1^2=1$

Thử lại: với $x=1$ ba phân số là $\dfrac{26}{26}$, $\dfrac{36}{36}$, $\dfrac{46}{46}$, tổng bằng $1+1+1=3$.

### Bài 8c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $\dfrac{59-\sqrt{x}}{41}+\dfrac{57-\sqrt{x}}{43}+\dfrac{55-\sqrt{x}}{45}+\dfrac{53-\sqrt{x}}{47}+\dfrac{51-\sqrt{x}}{49}=-5$;
**Chưa chắc:** kĩ thuật "cộng 1 vào từng phân số rồi đặt thừa số chung" nằm ngoài lý thuyết trên bản đồ K7; chỉ có $\sqrt{x}=a\Rightarrow x=a^2$ trong nhóm tìm $x$ căn. Quy luật: số hạng đầu ở tử giảm 2 (59; 57; 55; 53; 51), mẫu tăng 2 (41; 43; 45; 47; 49), tổng mỗi cặp bằng 100. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số hạng đầu ở tử cộng với mẫu của mỗi phân số đều bằng 100, nên cộng thêm 1 vào từng phân số thì tử xuất hiện chung thừa số $100-\sqrt{x}$.

**Bước 1.** Tìm quy luật: tử giảm 2 còn mẫu tăng 2 qua từng phân số, nên tổng số hạng đầu của tử với mẫu luôn là một số cố định.

**Bước 2.** Cộng thêm 1 vào mỗi phân số ở vế trái và cộng thêm 5 vào vế phải (vì có năm phân số) để phương trình không đổi.

**Bước 3.** Mỗi tử thành cùng một biểu thức chứa $\sqrt{x}$, đặt biểu thức đó làm thừa số chung, trong ngoặc còn tổng năm phân số có tử 1.

**Bước 4.** Vế phải thành 0 và thừa số còn lại là tổng các số dương nên $\sqrt{x}$ phải bằng số cố định đó, rồi bình phương để tìm $x$.

**Phần 2. Trình bày**

$\dfrac{59-\sqrt{x}}{41}+\dfrac{57-\sqrt{x}}{43}+\dfrac{55-\sqrt{x}}{45}+\dfrac{53-\sqrt{x}}{47}+\dfrac{51-\sqrt{x}}{49}=-5$

$\left(\dfrac{59-\sqrt{x}}{41}+1\right)+\left(\dfrac{57-\sqrt{x}}{43}+1\right)+\left(\dfrac{55-\sqrt{x}}{45}+1\right)+\left(\dfrac{53-\sqrt{x}}{47}+1\right)+\left(\dfrac{51-\sqrt{x}}{49}+1\right)=-5+5$

$\dfrac{100-\sqrt{x}}{41}+\dfrac{100-\sqrt{x}}{43}+\dfrac{100-\sqrt{x}}{45}+\dfrac{100-\sqrt{x}}{47}+\dfrac{100-\sqrt{x}}{49}=0$

$\left(100-\sqrt{x}\right).\left(\dfrac{1}{41}+\dfrac{1}{43}+\dfrac{1}{45}+\dfrac{1}{47}+\dfrac{1}{49}\right)=0$

Vì $\dfrac{1}{41}+\dfrac{1}{43}+\dfrac{1}{45}+\dfrac{1}{47}+\dfrac{1}{49}>0$ nên $100-\sqrt{x}=0$

$\sqrt{x}=100$

$x=100^2$

$x=10000$

Thử lại: với $\sqrt{x}=100$ các tử là $-41$; $-43$; $-45$; $-47$; $-49$ nên mỗi phân số bằng $-1$ và tổng bằng $-5$.

### Bài 8d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $\sqrt{x}+\dfrac{2}{3}\left(1+\dfrac{1}{2.4}\right)\left(1+\dfrac{1}{3.5}\right)\left(1+\dfrac{1}{4.6}\right)\dots\left(1+\dfrac{1}{2024.2026}\right)=1$.
**Chưa chắc:** (1) kĩ thuật viết $1+\dfrac{1}{n(n+2)}=\dfrac{(n+1).(n+1)}{n(n+2)}$ rồi rút gọn tích dãy phân số (triệt tiêu dạng "tích") nằm ngoài lý thuyết trên bản đồ K7; (2) đề in không có ngoặc nên lời giải hiểu $\dfrac{2}{3}$ nhân với cả tích (cách hiểu cho đáp số gọn); nếu hiểu $\left(\sqrt{x}+\dfrac{2}{3}\right)$ nhân tích thì đáp số khác. Quy luật: các thừa số là $1+\dfrac{1}{n(n+2)}$ với $n=2;3;4;\dots;2024$, hai số trong mẫu hơn kém nhau 2. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi thừa số $1+\dfrac{1}{n(n+2)}$ quy đồng được thành phân số có tử là tích hai số bằng nhau $(n+1).(n+1)$, nên khi nhân cả dãy các số ở giữa rút gọn gần hết.

**Bước 1.** Nhận ra quy luật: thừa số thứ nhất ứng với $n=2$, mỗi thừa số sau tăng $n$ thêm 1, thừa số cuối ứng với $n=2024$ và hai số trong mẫu luôn hơn kém nhau 2.

**Bước 2.** Quy đồng từng thừa số rồi biến đổi tử bằng tính chất phân phối để thấy tử là tích của hai số tự nhiên bằng nhau.

**Bước 3.** Viết tích cả dãy thành tử gồm các số liền nhau mỗi số hai lần, mẫu gồm hai dãy số liền nhau, rồi tách thành hai tích phân số và rút gọn các thừa số giống nhau.

**Bước 4.** Nhân kết quả với $\dfrac{2}{3}$ để được số hạng thứ hai của vế trái, rồi chuyển vế để tìm $\sqrt{x}$ và bình phương để tìm $x$.

**Chú ý:** trong mẫu có hai dãy bắt đầu khác nhau (từ 2 và từ 4), nên phần dư lại ở đầu và ở cuối mỗi dãy không giống nhau.

**Phần 2. Trình bày**

Với số tự nhiên $n\ge2$: $n(n+2)+1=n.n+n+n+1=n.(n+1)+(n+1)=(n+1).(n+1)$.

Do đó $1+\dfrac{1}{n(n+2)}=\dfrac{n(n+2)+1}{n(n+2)}=\dfrac{(n+1).(n+1)}{n(n+2)}$.

Đặt $P=\left(1+\dfrac{1}{2.4}\right)\left(1+\dfrac{1}{3.5}\right)\left(1+\dfrac{1}{4.6}\right)\dots\left(1+\dfrac{1}{2024.2026}\right)$.

$P=\dfrac{3.3}{2.4}.\dfrac{4.4}{3.5}.\dfrac{5.5}{4.6}.\dots.\dfrac{2025.2025}{2024.2026}$

$P=\dfrac{3.4.5.\dots.2025}{2.3.4.\dots.2024}.\dfrac{3.4.5.\dots.2025}{4.5.6.\dots.2026}$

$P=\dfrac{2025}{2}.\dfrac{3}{2026}$

$P=\dfrac{6075}{4052}$

Vế trái $=\sqrt{x}+\dfrac{2}{3}.P=\sqrt{x}+\dfrac{2}{3}.\dfrac{2025}{2}.\dfrac{3}{2026}=\sqrt{x}+\dfrac{2025}{2026}$

Phương trình trở thành $\sqrt{x}+\dfrac{2025}{2026}=1$

$\sqrt{x}=1-\dfrac{2025}{2026}$

$\sqrt{x}=\dfrac{1}{2026}$

$x=\left(\dfrac{1}{2026}\right)^2$

Vì $2026^2=4104676$ nên $x=\dfrac{1}{4104676}$.

Thử lại: với $\sqrt{x}=\dfrac{1}{2026}$ vế trái bằng $\dfrac{1}{2026}+\dfrac{2025}{2026}=1$.

## PHẦN 3 | Hình học — góc, tia phân giác, hai đường thẳng song song (Bài 9–10) | tu_luan

### Bài 9 | kho=hgt | loai=tra_loi_ngan | dap_an=122
**Đề:** Cho $Oa$ và $Ob$ là hai tia đối nhau, tia $Om$ tạo với tia $Oa$ một góc $\widehat{aOm}=58^\circ$. Tính $\widehat{bOm}$.
**Hình:** c_b9.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tia $Oa$, $Ob$ đối nhau nên hai góc $\widehat{aOm}$ và $\widehat{bOm}$ kề bù, tổng số đo của chúng là $180^\circ$.

**Bước 1.** Nhận ra vị trí: $\widehat{aOm}$ và $\widehat{bOm}$ có chung cạnh $Om$, còn hai cạnh kia là hai tia đối nhau $Oa$, $Ob$.

**Bước 2.** Kết luận hai góc này là hai góc kề bù rồi dùng tính chất tổng hai góc kề bù bằng $180^\circ$.

**Bước 3.** Lấy $180^\circ$ trừ số đo góc đã cho để ra số đo góc cần tính.

**Chú ý:** góc $\widehat{bOm}$ là góc tù vì nó kề bù với một góc nhọn.

**Phần 2. Trình bày**

Vì $Oa$ và $Ob$ là hai tia đối nhau nên $\widehat{aOm}$ và $\widehat{bOm}$ là hai góc kề bù.

Do đó $\widehat{aOm}+\widehat{bOm}=180^\circ$ (hai góc kề bù).

$58^\circ+\widehat{bOm}=180^\circ$

$\widehat{bOm}=180^\circ-58^\circ=122^\circ$

Vậy $\widehat{bOm}=122^\circ$.

### Bài 10 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho $Ox$ và $Oy$ là hai tia đối nhau. Vẽ tia $Ot$ và $Oz$ sao cho $\widehat{yOt}=40^\circ$; $\widehat{xOz}=100^\circ$ (tia $Ot$ nằm giữa hai tia $Oy$ và $Oz$).
a) Vẽ hình và tính số đo của $\widehat{zOy}$.
b) Tính $\widehat{zOt}$. Chứng minh $Ot$ là tia phân giác của $\widehat{zOy}$.
**Ghi chú:** lời giải chưa có hình vẽ (đề yêu cầu học sinh tự vẽ hình; Phần 2 có tả cách vẽ từng bước).

**Phần 1. Hướng dẫn**

**Mấu chốt:** ý a) dùng hai góc kề bù $\widehat{xOz}$ và $\widehat{zOy}$; ý b) dùng tia $Ot$ nằm giữa để cộng góc, rồi so sánh hai góc $\widehat{zOt}$ và $\widehat{yOt}$ để kết luận tia phân giác.

**Bước 1.** Ý a) Vẽ hình theo đúng số đo đề cho: vẽ đường thẳng chứa hai tia đối nhau $Ox$, $Oy$, rồi vẽ hai tia $Oz$, $Ot$ về cùng một phía của đường thẳng đó.

**Bước 2.** Ý a) Vì $Ox$, $Oy$ đối nhau nên $\widehat{xOz}$ và $\widehat{zOy}$ kề bù, lấy $180^\circ$ trừ $\widehat{xOz}$ để tính $\widehat{zOy}$.

**Bước 3.** Ý b) Tia $Ot$ nằm giữa $Oy$ và $Oz$ nên $\widehat{yOt}$ cộng $\widehat{zOt}$ bằng $\widehat{zOy}$, từ đó tính $\widehat{zOt}$.

**Bước 4.** Ý b) Tia phân giác là tia nằm giữa hai cạnh và chia góc thành hai góc bằng nhau, nên so sánh $\widehat{zOt}$ với $\widehat{yOt}$ để kết luận.

**Chú ý:** phải nêu rõ tia $Ot$ nằm giữa hai tia $Oy$, $Oz$ trước khi cộng góc và trước khi kết luận tia phân giác.

**Phần 2. Trình bày**

a) Cách vẽ: vẽ đường thẳng $xy$ và lấy điểm $O$ trên đường thẳng đó, khi đó $Ox$ và $Oy$ là hai tia đối nhau. Dùng thước đo góc vẽ tia $Oz$ sao cho $\widehat{xOz}=100^\circ$, rồi vẽ tia $Ot$ cùng phía với $Oz$ đối với đường thẳng $xy$ sao cho $\widehat{yOt}=40^\circ$ và $Ot$ nằm giữa $Oy$, $Oz$.

Vì $Ox$ và $Oy$ là hai tia đối nhau nên $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù.

$\widehat{xOz}+\widehat{zOy}=180^\circ$ (hai góc kề bù)

$100^\circ+\widehat{zOy}=180^\circ$

$\widehat{zOy}=180^\circ-100^\circ=80^\circ$

Vậy $\widehat{zOy}=80^\circ$.

b) Vì tia $Ot$ nằm giữa hai tia $Oy$ và $Oz$ nên $\widehat{yOt}+\widehat{zOt}=\widehat{zOy}$.

$40^\circ+\widehat{zOt}=80^\circ$

$\widehat{zOt}=80^\circ-40^\circ=40^\circ$

Vậy $\widehat{zOt}=40^\circ$.

Ta có tia $Ot$ nằm giữa hai tia $Oy$ và $Oz$ (giả thiết) và $\widehat{zOt}=\widehat{yOt}=40^\circ$.

Vậy $Ot$ là tia phân giác của $\widehat{zOy}$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phạm vi: chỉ trang 5/7 (Bài 7, 8, 9, 10). Bài 7 (a–e) và Bài 8 (a–d) tách ý; Bài 9, Bài 10 mỗi bài một câu (Bài 10 giữ chung ý a) b)). Câu bỏ: không có.
- Bộ sách: đề cương không ghi, đoán KNTT theo nội dung (số hữu tỉ, căn bậc hai, góc kề bù, tia phân giác).
- Cả 9 câu Bài 7–8 là dạng nâng cao: đều dùng kĩ thuật triệt tiêu theo quy luật (tách $\dfrac{1}{n(n+1)}$, nhân tổng với cơ số rồi trừ, cộng/trừ 1 vào từng phân số, rút gọn tích dãy phân số) nằm ngoài lý thuyết trên bản đồ K7; mỗi câu đã có dòng `Chưa chắc` nêu rõ kĩ thuật nào để CEO quyết giữ hay loại.
- Bài 8d: đề in không có ngoặc nên hiểu $\dfrac{2}{3}$ nhân với cả tích (cho $\sqrt{x}=\dfrac{1}{2026}$); cách hiểu $\left(\sqrt{x}+\dfrac{2}{3}\right)$ nhân tích cho đáp số khác.
- Mọi đáp số đã thử lại bằng `node` (phân số chính xác bằng BigInt): 7a $x=2026$, 7b $x=6$, 7c $x=2026$, 7d $x=2$, 7e $x=100$, 8a $x=4100625$, 8b $x=1$, 8c $x=10000$, 8d $x=\dfrac{1}{4104676}$.
- Loại câu: 7a–7e, 8b, 9 là `tra_loi_ngan` (đáp số một số vừa 4 ô, kể cả $2026$); 8a ($4100625$, 7 chữ số), 8c ($10000$, 5 chữ số), 8d (phân số) và Bài 10 là `tu_luan`.
- Bài 9: hình c_b9.png cắt từ trang 5/7; số đo $58^\circ$ trên hình đã chép vào Đề. Bài 10: đề yêu cầu vẽ hình nên chưa có hình, lời giải tả cách vẽ.
