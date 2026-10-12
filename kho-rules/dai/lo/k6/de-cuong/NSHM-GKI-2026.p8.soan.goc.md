# ĐỀ | Đề cương ôn tập giữa học kì I Toán 6 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai (Toán cô Hương – CLB Toán học Pi)
nam: 2026
bo_sach: KNTT

## PHẦN 3 | III. Tìm x | tu_luan

### Bài 11a | kho=dai | loai=tra_loi_ngan | dap_an=5
**Đề:** Tìm số tự nhiên $x$, biết: $2^x+2^{x+1}+2^{x+2}+2^{x+3}=480$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bốn số hạng đều có dạng $2^x$ nhân với một số, nên tách ra rồi **đặt $2^x$ làm thừa số chung**.

**Bước 1.** Nhận ra mỗi số hạng là $2^{x+k}$, viết thành $2^x.2^k$ nhờ quy tắc nhân hai luỹ thừa cùng cơ số.

**Bước 2.** Đặt $2^x$ ra ngoài ngoặc rồi tính tổng các số còn lại trong ngoặc.

**Bước 3.** Coi $2^x$ là thừa số chưa biết: lấy tích đã cho chia cho thừa số đã biết.

**Bước 4.** Viết số vừa tìm thành luỹ thừa của 2, rồi so sánh số mũ hai vế để tìm $x$.

Thử lại: $2^5+2^6+2^7+2^8=32+64+128+256=480$ (đúng).

**Phần 2. Trình bày**

$2^x+2^{x+1}+2^{x+2}+2^{x+3}=480$

$2^x+2^x.2+2^x.2^2+2^x.2^3=480$

$2^x.(1+2+4+8)=480$

$2^x.15=480$

$2^x=480:15$

$2^x=32$

$2^x=2^5$

$x=5$

Vậy $x=5$.

### Bài 11b | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm số tự nhiên $x$, biết: $5^{x+1}-5^x=2.2^x+8.2^x$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vế trái đặt thừa số chung $5^x$, vế phải đặt thừa số chung $2^x$, được dạng $4.5^x=10.2^x$ rồi so sánh hai luỹ thừa khác cơ số.

**Bước 1.** Viết $5^{x+1}=5^x.5$ rồi đặt $5^x$ ra ngoài ở vế trái; ở vế phải đặt $2^x$ ra ngoài.

**Bước 2.** Tính các số trong ngoặc để đưa phương trình về dạng $4.5^x=10.2^x$.

**Bước 3.** Xét riêng trường hợp $x=0$ xem có thoả không; với $x\ge 1$ thì tách mỗi luỹ thừa $5^x$, $2^x$ thành tích có thừa số $5^{x-1}$, $2^{x-1}$ rồi rút gọn hai vế.

**Bước 4.** Hai luỹ thừa cùng số mũ mà cơ số khác nhau thì chỉ bằng nhau khi số mũ bằng 0, từ đó tìm $x$.

**Chú ý:** nếu số mũ $k\ge 1$ thì $5^k>2^k$ vì cơ số 5 lớn hơn cơ số 2.

Thử lại: $5^2-5=20$ và $2.2+8.2=20$ (đúng).

**Phần 2. Trình bày**

$5^{x+1}-5^x=2.2^x+8.2^x$

$5^x.5-5^x=(2+8).2^x$

$5^x.(5-1)=10.2^x$

$4.5^x=10.2^x$

Với $x=0$ thì $4.5^0=4$ còn $10.2^0=10$, hai vế không bằng nhau nên $x\ne 0$, tức $x\ge 1$.

Với $x\ge 1$ ta có $5^x=5.5^{x-1}$ và $2^x=2.2^{x-1}$ nên:

$4.5.5^{x-1}=10.2.2^{x-1}$

$20.5^{x-1}=20.2^{x-1}$

$5^{x-1}=2^{x-1}$

Vì $5>2$ nên nếu $x-1\ge 1$ thì $5^{x-1}>2^{x-1}$. Hai luỹ thừa chỉ bằng nhau khi $x-1=0$.

$x=1$

Vậy $x=1$.

### Bài 11c | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tìm số tự nhiên $x$, biết: $6^x+6^{x+1}=2^x+2.2^x+4.2^x$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vế trái đặt $6^x$, vế phải đặt $2^x$ — hai ngoặc cùng ra số 7 nên rút gọn được, chỉ còn so sánh $6^x$ với $2^x$.

**Bước 1.** Ở vế trái viết $6^{x+1}=6^x.6$ rồi đặt $6^x$ ra ngoài ngoặc.

**Bước 2.** Ở vế phải coi số hạng $2^x$ là $2^x.1$ rồi đặt $2^x$ ra ngoài, trong ngoặc là $1+2+4$.

**Bước 3.** Hai vế cùng nhân với một số 7, nên lấy hai tích bằng nhau chia cho thừa số chung đó để được $6^x=2^x$.

**Bước 4.** Hai luỹ thừa cùng số mũ mà cơ số khác nhau thì chỉ bằng nhau khi số mũ bằng 0, từ đó tìm $x$.

Thử lại: $6^0+6^1=1+6=7$ và $2^0+2.2^0+4.2^0=1+2+4=7$ (đúng).

**Phần 2. Trình bày**

$6^x+6^{x+1}=2^x+2.2^x+4.2^x$

$6^x+6^x.6=2^x.(1+2+4)$

$6^x.(1+6)=2^x.7$

$6^x.7=2^x.7$

$6^x=2^x$

Vì $6>2$ nên nếu $x\ge 1$ thì $6^x>2^x$. Hai luỹ thừa chỉ bằng nhau khi $x=0$.

$x=0$

Vậy $x=0$.

### Bài 11d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số tự nhiên $x$, biết: $3^x+25=26.2^3+2.3^0$.
**Chưa chắc:** đề in $26.2^3$ thì $3^x=185$, không là luỹ thừa của 3 nên không có $x$ nào (kiểm lại ảnh 300 dpi: số mũ đúng là 3). Nhiều khả năng đề gốc là $26.2^2$: khi đó vế phải $=26.4+2=106$, $3^x=81=3^4$, $x=4$. Lời giải dưới đây giải ĐÚNG như đề in; CEO quyết định có sửa đề thành $26.2^2$ hay không.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính vế phải thành một số cụ thể rồi tìm $3^x$ như tìm số hạng chưa biết, sau đó đối chiếu với các luỹ thừa của 3.

**Bước 1.** Tính vế phải: tính hai luỹ thừa $2^3$ và $3^0$ trước, rồi nhân, rồi cộng.

**Bước 2.** Coi $3^x$ là số hạng chưa biết: lấy tổng đã tính trừ đi số hạng $25$ đã biết.

**Bước 3.** Liệt kê các luỹ thừa của 3 gần giá trị vừa tìm để xem giá trị đó có phải luỹ thừa của 3 hay không.

**Chú ý:** $3^0=1$ chứ không phải 0, nên $2.3^0=2$.

**Phần 2. Trình bày**

$3^x+25=26.2^3+2.3^0$

$3^x+25=26.8+2.1$

$3^x+25=208+2$

$3^x+25=210$

$3^x=210-25$

$3^x=185$

Ta có $3^4=81$ và $3^5=243$, mà $81<185<243$ nên $185$ không phải là luỹ thừa của $3$ với số mũ tự nhiên.

Vậy không có số tự nhiên $x$ nào thoả mãn đề bài.

### Bài 11e | kho=dai | loai=tra_loi_ngan | dap_an=3
**Đề:** Tìm số tự nhiên $x$, biết: $3^x+3^{x+1}+3^{x+2}+3^{x+3}=1080$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bốn số hạng đều là $3^x$ nhân với một số, nên **đặt $3^x$ làm thừa số chung**.

**Bước 1.** Tách mỗi số hạng $3^{x+k}$ thành $3^x.3^k$ nhờ quy tắc nhân hai luỹ thừa cùng cơ số.

**Bước 2.** Đặt $3^x$ ra ngoài ngoặc rồi tính tổng các số còn lại trong ngoặc.

**Bước 3.** Tìm thừa số chưa biết $3^x$ bằng cách lấy tích chia cho thừa số đã biết.

**Bước 4.** Viết số vừa tìm thành luỹ thừa của 3 rồi so sánh số mũ hai vế.

Thử lại: $3^3+3^4+3^5+3^6=27+81+243+729=1080$ (đúng).

**Phần 2. Trình bày**

$3^x+3^{x+1}+3^{x+2}+3^{x+3}=1080$

$3^x+3^x.3+3^x.3^2+3^x.3^3=1080$

$3^x.(1+3+9+27)=1080$

$3^x.40=1080$

$3^x=1080:40$

$3^x=27$

$3^x=3^3$

$x=3$

Vậy $x=3$.

### Bài 11f | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tìm số tự nhiên $x$, biết: $5^x+5^{x+1}+5^{x+2}+5^{x+3}=1+2+3+\dots+87+88-4^2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vế phải là tổng một dãy số liên tiếp trừ đi $4^2$ nên phải tính ra số cụ thể trước; vế trái đặt $5^x$ làm thừa số chung.

**Bước 1.** Tính tổng $1+2+\dots+88$ bằng cách ghép số đầu với số cuối, số thứ hai với số kế cuối, để mỗi cặp có cùng một tổng, rồi đếm số cặp.

**Bước 2.** Tính $4^2$ rồi trừ khỏi tổng vừa tìm để vế phải thành một số cụ thể.

**Bước 3.** Tách mỗi số hạng ở vế trái $5^{x+k}$ thành $5^x.5^k$, đặt $5^x$ ra ngoài rồi tính tổng trong ngoặc.

**Bước 4.** Tìm thừa số chưa biết $5^x$ bằng phép chia, rồi viết kết quả thành luỹ thừa của 5 để so sánh số mũ.

**Phần 2. Trình bày**

$5^x+5^{x+1}+5^{x+2}+5^{x+3}=1+2+3+\dots+87+88-4^2$

Dãy $1+2+3+\dots+88$ có $88$ số hạng, ghép đầu với cuối được $44$ cặp, mỗi cặp bằng $89$:

$1+2+3+\dots+88=(1+88)+(2+87)+\dots+(44+45)=44.89=3916$

$3916-4^2=3916-16=3900$

$5^x+5^x.5+5^x.5^2+5^x.5^3=3900$

$5^x.(1+5+25+125)=3900$

$5^x.156=3900$

$5^x=3900:156$

$5^x=25$

$5^x=5^2$

$x=2$

Vậy $x=2$.

### Bài 11g | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tìm số tự nhiên $x$, biết: $2^{x+2}.3^{x+1}.5^x=10800$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** phân tích $10800$ ra thừa số nguyên tố để thấy số mũ của 2, 3, 5 lần lượt giảm dần một đơn vị — đúng kiểu $x+2$, $x+1$, $x$ — rồi thử và chứng tỏ giá trị đó là duy nhất.

**Bước 1.** Phân tích $10800$ ra thừa số nguyên tố bằng cách tách thành $108.100$ rồi phân tích từng thừa số.

**Bước 2.** So sánh các số mũ $x+2$, $x+1$, $x$ ở vế trái với các số mũ tìm được ở bước 1 để đoán giá trị của $x$.

**Bước 3.** Thay giá trị đoán được vào vế trái và tính xem có đúng bằng $10800$ không.

**Bước 4.** Chứng tỏ giá trị đó là duy nhất: khi $x$ tăng thì mỗi luỹ thừa ở vế trái đều tăng nên vế trái tăng theo.

**Phần 2. Trình bày**

$2^{x+2}.3^{x+1}.5^x=10800$

$10800=108.100=(2^2.3^3).(2^2.5^2)=2^4.3^3.5^2$

Thử $x=2$: $2^{2+2}.3^{2+1}.5^2=2^4.3^3.5^2=16.27.25=10800$ (đúng).

Khi $x$ tăng thì cả ba thừa số $2^{x+2}$, $3^{x+1}$, $5^x$ đều tăng nên vế trái tăng; còn khi $x=1$ thì vế trái là $2^3.3^2.5=360<10800$. Do đó chỉ có $x=2$.

Vậy $x=2$.

### Bài 11h | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm số tự nhiên $x$, biết: $4^{x+3}.5^{x+1}.6^x=38400$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vế phải $38400$ chỉ có hai thừa số 5, mà trong vế trái chỉ luỹ thừa $5^{x+1}$ chứa thừa số 5, nên số mũ $x+1$ phải nhỏ — thử các số tự nhiên bé.

**Bước 1.** Phân tích $38400$ ra thừa số nguyên tố bằng cách tách thành $384.100$ rồi phân tích từng thừa số, để đếm xem có bao nhiêu thừa số 5.

**Bước 2.** Nhận ra cơ số 4 và cơ số 6 không có thừa số 5, nên số mũ của 5 ở vế trái là $x+1$ phải bằng số thừa số 5 đã đếm — từ đó đoán giá trị $x$.

**Bước 3.** Thay giá trị đoán được vào vế trái, tính từng luỹ thừa rồi nhân để so với $38400$.

**Bước 4.** Chứng tỏ giá trị đó là duy nhất: khi $x$ tăng thì vế trái tăng theo, nên chỉ một giá trị thoả mãn.

**Phần 2. Trình bày**

$4^{x+3}.5^{x+1}.6^x=38400$

$38400=384.100=(2^7.3).(2^2.5^2)=2^9.3.5^2$

Với $x=0$: $4^3.5^1.6^0=64.5.1=320<38400$.

Với $x=1$: $4^4.5^2.6^1=256.25.6=38400$ (đúng).

Khi $x$ tăng thì cả ba thừa số $4^{x+3}$, $5^{x+1}$, $6^x$ đều tăng nên vế trái tăng theo. Do đó chỉ có $x=1$.

Vậy $x=1$.

### Bài 11i | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tìm số tự nhiên $x$, biết: $(125^3.7^5-175^5:5):2021^{2022}=x^{2022}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa cả $125^3.7^5$ và $175^5:5$ về cùng dạng tích các luỹ thừa của 5 và 7 — hai số này bằng nhau nên hiệu trong ngoặc bằng 0.

**Bước 1.** Viết $125=5^3$ rồi nhân ba lần $5^3$ lại để được luỹ thừa của 5.

**Bước 2.** Viết $175=5^2.7$, nhân năm thừa số $5^2.7$ rồi gom các thừa số 5 và các thừa số 7 lại, sau đó chia cho 5.

**Bước 3.** So sánh hai số vừa tìm: bằng nhau thì hiệu trong ngoặc bằng 0, và 0 chia cho một số khác 0 vẫn bằng 0.

**Bước 4.** Từ $x^{2022}=0$ suy ra $x$: tích của 2022 thừa số $x$ bằng 0 thì chính $x$ phải bằng 0.

**Phần 2. Trình bày**

$(125^3.7^5-175^5:5):2021^{2022}=x^{2022}$

$125^3=125.125.125=5^3.5^3.5^3=5^9$ nên $125^3.7^5=5^9.7^5$.

$175^5=(5^2.7).(5^2.7).(5^2.7).(5^2.7).(5^2.7)=5^{10}.7^5$

$175^5:5=(5.5^9.7^5):5=5^9.7^5$

$125^3.7^5-175^5:5=5^9.7^5-5^9.7^5=0$

$0:2021^{2022}=0$ nên $x^{2022}=0$.

Tích của $2022$ thừa số $x$ bằng $0$ thì $x=0$.

Vậy $x=0$.

### Bài 11j | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tìm số tự nhiên $x$, biết: $(1+2+3+4)^2.(1-x)^{2021}=1^3+2^3+3^3+4^3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai vế đều tính được ra số cụ thể nên đưa về $(1-x)^{2021}$ bằng một số đơn giản, rồi dùng tính chất: luỹ thừa của số tự nhiên bằng 1 thì cơ số bằng 1.

**Bước 1.** Tính tổng trong ngoặc trước rồi mới nâng lên luỹ thừa bậc hai để được hệ số đứng trước $(1-x)^{2021}$.

**Bước 2.** Tính vế phải: tính từng luỹ thừa bậc ba rồi cộng lại, so sánh với hệ số vừa tìm.

**Bước 3.** Coi $(1-x)^{2021}$ là thừa số chưa biết: lấy tích chia cho thừa số đã biết.

**Bước 4.** Xét các cơ số tự nhiên có luỹ thừa bậc 2021 bằng 1, rồi coi $1-x$ là số bị trừ để tìm $x$.

**Chú ý:** $1-x$ phải là số tự nhiên nên $x$ chỉ có thể là $0$ hoặc $1$.

**Phần 2. Trình bày**

$(1+2+3+4)^2.(1-x)^{2021}=1^3+2^3+3^3+4^3$

$10^2.(1-x)^{2021}=1+8+27+64$

$100.(1-x)^{2021}=100$

$(1-x)^{2021}=100:100$

$(1-x)^{2021}=1$

Vì $0^{2021}=0$ và số tự nhiên lớn hơn 1 thì luỹ thừa lớn hơn 1, nên chỉ có $1^{2021}=1$. Do đó $1-x=1$.

$x=1-1$

$x=0$

Vậy $x=0$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 11d: đề in $3^x+25=26.2^3+2.3^0$ vô nghiệm tự nhiên; nhiều khả năng đề gốc là $26.2^2$ (cho $x=4$). Lời giải giải đúng như in.
- Bài 11b, 11c: cần lập luận "hai luỹ thừa cùng số mũ khác cơ số chỉ bằng nhau khi số mũ bằng 0" — đã tự suy ngay trong lời giải bằng so sánh $5^k>2^k$, $6^k>2^k$ khi $k\ge 1$.
- Bài 11g, 11h: không dùng luỹ thừa của tích / luỹ thừa của luỹ thừa; giải bằng phân tích ra thừa số nguyên tố để dự đoán rồi thử và chứng tỏ vế trái tăng theo $x$ (nghiệm duy nhất).
- Bài 11i: $175^5$ viết thành tích năm thừa số $5^2.7$ rồi gom, không dùng $(ab)^n$.
