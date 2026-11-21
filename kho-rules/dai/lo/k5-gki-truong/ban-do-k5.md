# BẢN ĐỒ KHỐI 5 (truy vấn 2026-11-21T01:56Z — đầu batch, §A3) — 102 dạng

Mã dạng chép ĐÚNG; mỗi dạng: tên · vị trí · mô tả · lý thuyết + ví dụ.


## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 1. Ôn tập số tự nhiên

### NDB02071 — Đọc và viết số tự nhiên
**Mô tả:** Đề cho cách gọi theo hàng (vd 4 chục nghìn, 2 nghìn, 5 trăm…) và yêu cầu viết thành số, hoặc cho số và yêu cầu đọc; công cụ: bảng hàng – lớp, hàng nào không có thì điền chữ số $0$.

1. Cách đọc số
Đọc các số tự nhiên theo thứ tự các hàng từ trái qua phải: hàng chục nghìn, hàng nghìn, hàng trăm, hàng chục, hàng đơn vị.
Khi đọc số có 5 chữ số cần chú ý:
Số 0 ở hàng chục, hàng trăm, hàng nghìn có thể đọc là linh (khi cần thiết).
Các số 1, 4, 5 ở hàng đơn vị có cách đọc đặc biệt:
Số 1: đọc là một hoặc mốt (sau hàng chục)
Số 4: đọc là bốn hoặc tư (sau hàng chục)
Số 5: đọc là năm hoặc lăm (sau hàng chục)
Ví dụ: Số 40 205
4 thuộc hàng chục nghìn.
0 thuộc hàng nghìn.
2 thuộc hàng trăm.
0 thuộc hàng chục.
5 thuộc hàng đơn vị.
Đọc theo thứ tự từ trái qua phải: Bốn mươi nghìn hai trăm linh năm.
Phân tích số: 40205=40000+200+5
2. Cách viết số
Từ cách đọc số, xác định chữ số tương ứng với từng hàng rồi ghép lại để được số cần viết.
Nếu một hàng không có giá trị thì viết chữ số 0 vào hàng đó.
Ví dụ: Số đọc là: Sáu mươi tám nghìn bốn trăm hai mươi ba
6 thuộc hàng chục nghìn.
8 thuộc hàng nghìn.
4 thuộc hàng trăm.
2 thuộc hàng chục.
3 thuộc hàng đơn vị.
Viết số: 68423

### NDB02072 — Cấu trúc hàng và lớp của số tự nhiên
**Mô tả:** Đề cho một số và hỏi chữ số nào thuộc hàng nào, lớp nào, lớp đó gồm những chữ số nào hoặc giá trị của một chữ số; công cụ: bảng hàng – lớp, đếm hàng từ phải sang trái.

1. Hàng và lớp
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0bc3e4b2-123c-47ac-b3f3-d31c502177ca.png)
Viết số: 352 168
Đọc số: Ba trăm năm mươi hai nghìn một trăm sáu mươi tám.
Viết số thành tổng theo các hàng:
352 168 = 300 000 + 50 000 + 2 000 + 100 + 60 + 8
Hàng đơn vị, hàng chục, hàng trăm tạo thành lớp đơn vị.
Hàng nghìn, hàng chục nghìn, hàng trăm nghìn tạo thành lớp nghìn.
2. Lớp triệu
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/7badd20a-a4db-476d-be4b-038db7f95111.png)
Lớp triệu gồm các hàng: triệu, chục triệu, trăm triệu.
• Viết số: 3 897 900
Đọc số: Ba triệu tám trăm chín mươi bảy nghìn chín trăm.
Viết số thành tổng theo các hàng:3 897 900 = 3 000 000 + 800 000 + 90 000 + 7 000 + 900
• Viết số: 15 000 648
Đọc số: Mười lăm triệu không nghìn sáu trăm bốn mươi tám
Viết số thành tổng theo các hàng: 15 000 648 = 10 000 000 + 5 000 000 + 600 + 40 + 8
• Viết số: 102 781 030
Đọc số: Một linh hai triệu bảy trăm tám mươi mốt nghìn không trăm ba mươi
Viết số thành tổng theo các hàng: 192 781 020 = 100 000 000 + 90 000 000 + 2 000

### NDB02073 — So sánh số tự nhiên
**Mô tả:** Đề cho hai hay nhiều số tự nhiên, hỏi số lớn nhất – bé nhất, điền dấu $>$, $<$, $=$ hoặc tìm chữ số còn thiếu để so sánh đúng; công cụ: số chữ số rồi so từng hàng từ trái sang phải.

Các dấu hiệu so sánh số:
- Số có nhiều chữ số hơn thì lớn hơn
- Số có ít chữ số hơn thì nhỏ hơn
- So sánh các số có cùng số chữ số thì so sánh các hàng tương ứng từ trái sang phải
- Nếu hai số có cùng số chữ số và từng cặp chữ số ở cùng một hàng đều giống nhau thì hai số đó bằng nhau

### NDB02074 — Tìm số tự nhiên lớn nhất - nhỏ nhất từ các chữ số cho trước
**Mô tả:** Đề cho một nhóm chữ số và yêu cầu lập số lớn nhất, bé nhất, số chẵn – lẻ lớn nhất (bé nhất), hoặc đếm số lập được; mỗi chữ số dùng một lần, công cụ: xếp chữ số theo thứ tự từ lớn đến bé (hoặc ngược lại).

Bước 1: Xác định số cần lập là số chẵn hay số lẻ → chọn chữ số hàng đơn vị.
Bước 2: Chọn các chữ số còn lại để điền vào các hàng phía trước.
Bước 3: Kiểm tra điều kiện đề bài:
+ Có đủ số chữ số không?
+ Chữ số đầu tiên có khác 0 không?
+ Các chữ số có bị lặp không (nếu đề yêu cầu khác nhau)?

### NDB02075 — Ôn tập làm tròn số tự nhiên; số liền trước, liền sau
**Mô tả:** Đề yêu cầu làm tròn một số đến hàng cho trước, hoặc tìm số liền trước, liền sau, số chẵn – lẻ bé nhất (lớn nhất) có số chữ số cho trước; công cụ: nhìn chữ số bên phải hàng làm tròn; liền trước – liền sau hơn kém $1$.

##PP Làm tròn và tìm số liền trước, liền sau
Xác định hàng cần làm tròn rồi nhìn chữ số ngay bên phải hàng đó.
Chữ số đó bé hơn $5$ thì giữ nguyên chữ số hàng làm tròn; từ $5$ trở lên thì tăng chữ số hàng làm tròn thêm $1$.
Thay mọi chữ số bên phải hàng làm tròn bằng $0$.
Số liền trước thì trừ $1$, số liền sau thì cộng $1$.

##CY
Chữ số hàng làm tròn là $9$ mà phải tăng thêm $1$ thì "nhớ" sang hàng bên trái (vd $39986$ làm tròn đến hàng nghìn là $40000$).
Số liền trước của $100$ là $99$, không phải $90$.
Chỉ nhìn đúng một chữ số bên phải hàng làm tròn, không nhìn các chữ số xa hơn.


## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 2. Ôn tập các phép tính với số tự nhiên

### NDB02076 — Các phép tính đơn lẻ dạng đặt tính
**Mô tả:** Đề chỉ có một phép cộng, trừ, nhân hoặc chia các số tự nhiên nhiều chữ số, yêu cầu đặt tính rồi tính; công cụ: tính từng hàng (cộng, trừ, nhân từ phải sang trái; chia từ trái sang phải).

##PP Đặt tính rồi tính
Viết các số thẳng hàng với nhau (đơn vị thẳng đơn vị, chục thẳng chục…).
Cộng, trừ, nhân: tính từ hàng đơn vị sang trái, nhớ sang hàng bên cạnh khi cần.
Chia: lấy dần từng chữ số từ trái sang phải, mỗi lần chia được một chữ số của thương rồi hạ chữ số tiếp theo.
Kiểm tra lại bằng phép tính ngược (cộng thử bằng trừ, nhân thử bằng chia).

##CY
Quên cộng số "nhớ" vào hàng kế tiếp.
Khi chia, hạ một chữ số xuống mà số đó vẫn bé hơn số chia thì phải viết $0$ vào thương rồi hạ tiếp chữ số sau.

### NDB02077 — Tính giá trị của biểu thức hỗn hợp
**Mô tả:** Đề cho một biểu thức có nhiều phép tính (cộng, trừ, nhân, chia, có thể có ngoặc) và yêu cầu tính giá trị; công cụ: thứ tự thực hiện phép tính.

**1. Tính giá trị của biểu thức**
- Nếu trong biểu thức có chứa các phép tính cộng, trừ, nhân, chia ta thực hiện các phép tính nhân, chia trước, thực hiện các phép tính cộng trừ sau.
- Nếu trong biểu thức chỉ có phép tính cộng, trừ hoặc chỉ có phép tính nhân, chia ta thực hiện các phép tính theo thứ tự từ trái sang phải.
**2. Tính giá trị của biểu thức có dấu ngoặc**
Nếu trong biểu thức có dấu ngoặc thì ta thực hiện các phép tính ở trong ngoặc trước.

### NDB02078 — Tính thuận tiện dạng tổng với số tự nhiên
**Mô tả:** Đề cho một dãy chỉ gồm cộng và trừ nhiều số lớn, yêu cầu tính nhanh; công cụ: giao hoán, kết hợp để ghép các số có tổng hoặc hiệu là số tròn chục, tròn trăm, tròn nghìn.

##PP Ghép cặp tạo số tròn
Tìm những cặp số cộng lại (hoặc trừ đi) được số tròn chục, tròn trăm, tròn nghìn.
Đổi chỗ, nhóm các số vào cùng một ngoặc, nhớ mang theo dấu đứng trước mỗi số.
Tính từng ngoặc rồi cộng các kết quả lại.

##CY
Đổi chỗ số hạng mà bỏ quên dấu đứng trước số đó: số đứng sau dấu trừ phải vẫn bị trừ.
Chỉ nhóm các cặp có tổng (hiệu) tròn thật sự, không nhóm theo thứ tự đề bài cho một cách máy móc.

### NDB02079 — Tính thuận tiện dạng tổng tích, hiệu tích với số tự nhiên
**Mô tả:** Đề có các tích chứa cùng một thừa số, nối với nhau bằng dấu cộng hoặc trừ, yêu cầu tính nhanh; công cụ: $a \times b + a \times c = a \times (b + c)$ (hiệu tương tự).

##PP Đặt thừa số chung ra ngoài
Tìm thừa số xuất hiện ở tất cả các tích.
Viết thừa số chung nhân với tổng (hiệu) của các thừa số còn lại.
Tính trong ngoặc, thường được số tròn $10$, $100$, $1000$, rồi nhân.

##CY
Một số hạng đứng riêng chính là tích với $1$ (vd $48 = 48 \times 1$); quên điều này thì tính sai tổng trong ngoặc.
Số trừ phải đứng sau dấu trừ trong ngoặc, không đổi thành dấu cộng.

### NDB02080 — Bài toán thực tế áp dụng các phép tính với số tự nhiên
**Mô tả:** Đề là bài toán lời văn cho các số liệu thực tế (tiền, khối lượng, số lượng…), giải bằng một hoặc nhiều phép tính cộng, trừ, nhân, chia với số tự nhiên, kể cả bài tìm hai số khi biết tổng và hiệu.

##PP Giải bài toán lời văn
Đọc đề, xác định cái đã cho và cái cần tìm.
Tìm các bước trung gian cần tính trước, chọn phép tính cho từng bước.
Mỗi bước viết một câu lời giải rồi phép tính kèm đơn vị.
Kiểm tra đáp số có hợp lý với đề, rồi viết "Đáp số".

##CY
Đề hỏi nhiều ý mà chỉ trả lời một ý.
Quên đổi đơn vị trước khi tính.
Bài tổng – hiệu: quên chia đôi phần còn lại sau khi bớt hiệu (hoặc quên cộng hiệu vào số bé).

### NDB02671 — Bài toán trung bình cộng
**Mô tả:** Bài toán lời văn cho trung bình cộng của các số (hoặc các đại lượng) và yêu cầu tìm tổng, tìm một số chưa biết, hoặc kết hợp với tổng – hiệu; công cụ: tổng = trung bình cộng × số các số hạng.




## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 3. Ôn tập phân số

### NDB02081 — Nhận biết phân số
**Mô tả:** Đề cho một hình hoặc một nhóm vật, trong đó có một số phần được tô màu hoặc được chọn, yêu cầu viết phân số chỉ phần đó so với cả hình (cả nhóm). Công cụ: mẫu số là tổng số phần bằng nhau, tử số là số phần được lấy; chưa phải biến đổi phân số.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/68002bfe-dff3-4077-bccc-c48fa67aaa14.png)

**1. Xác định mẫu số**
Mẫu số là tổng số phần hoặc tổng số hình có trong khung.
Ví dụ:
Trong khung có 8 quả táo thì mẫu số là 8.
**2. Xác định tử số**
Tử số là số phần hoặc số hình được tô màu.
Ví dụ:
Có 4 quả táo được tô màu thì tử số là 4.

### NDB02082 — Quy đồng phân số
**Mô tả:** Đề cho hai (hoặc ba) phân số khác mẫu số, yêu cầu viết chúng thành các phân số cùng mẫu số mà giá trị không đổi. Công cụ: tìm mẫu số chung rồi nhân cả tử số và mẫu số. Khác dạng so sánh ở chỗ đề chỉ đòi quy đồng, chưa hỏi phân số nào lớn hơn.

Khi quy đồng mẫu số hai phân số có thể làm như sau:
- Chọn mẫu số chung
- Nhân cả tử số và mẫu số với cùng một số tự nhiên khác 0 để được một phân số mới có mẫu số bằng mẫu số chung.
Chú ý: ta thường lấy mẫu số chung là số tự nhiên nhỏ nhất khác 0 và cùng chia hết cho tất cả các mẫu số.

### NDB02083 — Rút gọn phân số
**Mô tả:** Đề cho một phân số (hoặc phân số có tử số, mẫu số là các tích) và yêu cầu rút gọn thành phân số tối giản, hoặc nhận ra phân số nào đã tối giản. Công cụ: dấu hiệu chia hết cho $2$; $3$; $5$; $9$ và chia cả tử số, mẫu số cho số chung.

* Phương pháp rút gọn phân số
- Xem tử số và mẫu số có cùng chia hết cho số tự nhiên nào lớn hơn 1
- Chia tử số và mẫu số cho số đó
Chú ý: Khi rút gọn phân số, ta nên rút gọn cho đến khi nhận được phân số tối giản

### NDB02084 — So sánh phân số sử dụng quy đồng
**Mô tả:** Đề cho hai hoặc nhiều phân số khác mẫu số (có thể kèm số tự nhiên), yêu cầu điền dấu $>$; $<$; $=$, tìm phân số lớn hơn, bé hơn hoặc sắp xếp thứ tự. Công cụ: quy đồng mẫu số rồi so sánh các tử số. Khác dạng quy đồng ở chỗ đề hỏi kết quả so sánh.

Quy tắc: Trong hai phân số có cùng mẫu số:
+) Phân số nào có tử số bé hơn thì phân số đó bé hơn.
+) Phân số nào có tử số lớn hơn thì phân số đó lớn hơn.
+) Nếu tử số bằng nhau thì hai phân số đó bằng nhau.


## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 4. Phân số thập phân

### NDB02090 — Nhận biết phân số thập phân
**Mô tả:** Đề cho một nhóm phân số và hỏi phân số nào là phân số thập phân, hoặc cho số đo và yêu cầu viết phân số thập phân thích hợp khi đổi đơn vị (cm sang m, g sang kg). Công cụ: nhận ra mẫu số là $10$; $100$; $1000$; … Chưa cần biến đổi phân số.

##PP Nhận biết và viết phân số thập phân
Nhìn mẫu số: là $10$; $100$; $1000$; … thì đó là phân số thập phân
Đổi đơn vị: lấy số đo cần đổi làm tử số, mẫu số là $10$; $100$; $1000$ theo quan hệ giữa hai đơn vị (ví dụ $1$ m $=100$ cm thì mẫu số là $100$)

##CY
Phân số có tử số lớn hơn mẫu số vẫn là phân số thập phân nếu mẫu số là $10$; $100$; $1000$; …
Nhầm phân số có số $100$ ở tử số (như $\dfrac{100}{9}$) hoặc mẫu số $20$ là phân số thập phân; chỉ mẫu số mới quyết định.

### NDB02091 — Viết phân số thành số thập phân
**Mô tả:** Đề cho phân số có mẫu số như $2$; $4$; $5$; $25$; $40$; $500$ (chưa phải $10$; $100$; $1000$), yêu cầu biến đổi thành phân số thập phân rồi viết thành số thập phân, hoặc điền số vào bước nhân (chia) cả tử số và mẫu số. Khác dạng nhận biết ở chỗ phải biến đổi phân số.

##PP Đổi phân số thành số thập phân
Tìm số cần nhân (hoặc chia) với mẫu số để được $10$; $100$ hoặc $1000$
Nhân (hoặc chia) cả tử số và mẫu số với số đó để được phân số thập phân
Viết thành số thập phân: số chữ số sau dấu phẩy bằng số chữ số $0$ ở mẫu số

##CY
Chỉ nhân (hoặc chia) mẫu số mà quên tử số, làm phân số bị đổi giá trị.
Thiếu chữ số $0$ khi tử số ít chữ số hơn số chữ số $0$ ở mẫu số: $\dfrac{6}{100}=0{,}06$ chứ không phải $0{,}6$.


## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 5–6. Ôn tập các phép tính với phân số. Cộng, trừ hai phân số khác mẫu số

### NDB02085 — Các phép toán đơn lẻ với phân số
**Mô tả:** Đề chỉ có một phép tính (cộng, trừ, nhân hoặc chia) giữa hai phân số hoặc giữa phân số và số tự nhiên, yêu cầu tính và rút gọn kết quả nếu được. Khác dạng biểu thức nhiều phép tính ở chỗ chỉ có một dấu phép tính.

**1. Phép cộng hai phân số**
Muốn cộng hai phân số cùng mẫu số, ta cộng hai tử số với nhau và giữ nguyên mẫu số.
$$\dfrac{a}{c} + \dfrac{b}{c} = \dfrac{a+b}{c}$$
**Ví dụ:** $\dfrac{3}{7} + \dfrac{2}{7} = \dfrac{5}{7}$

Muốn cộng hai phân số khác mẫu số, ta quy đồng mẫu số hai phân số, rồi cộng hai phân số đó.
**Ví dụ:** $\dfrac{2}{3} + \dfrac{4}{5} = \dfrac{10}{15} + \dfrac{12}{15} = \dfrac{22}{15}$

**2. Phép trừ hai phân số**
Muốn trừ hai phân số cùng mẫu số, ta trừ tử số của phân số thứ nhất cho tử số của phân số thứ hai và giữ nguyên mẫu số.
$$\dfrac{a}{c} - \dfrac{b}{c} = \dfrac{a-b}{c}$$
**Ví dụ:** $\dfrac{7}{9} - \dfrac{2}{9} = \dfrac{5}{9}$

Muốn trừ hai phân số khác mẫu số, ta quy đồng mẫu số hai phân số, rồi trừ hai phân số đó.
**Ví dụ:** $\dfrac{5}{8} - \dfrac{1}{3} = \dfrac{15}{24} - \dfrac{8}{24} = \dfrac{7}{24}$

**3. Phép nhân phân số**
$$\dfrac{a}{b} \times \dfrac{c}{d} = \dfrac{a \times c}{b \times d}$$
Muốn nhân hai phân số ta lấy tử số nhân với tử số, mẫu số nhân với mẫu số.
**Ví dụ:** $\dfrac{5}{12} \times \dfrac{3}{10} = \dfrac{5 \times 3}{12 \times 10} = \dfrac{15}{120} = \dfrac{1}{8}$
Hoặc $\dfrac{5}{12} \times \dfrac{3}{10} = \dfrac{5 \times 3}{12 \times 10} = \dfrac{5 \times 3}{4 \times 3 \times 5 \times 2} = \dfrac{1}{8}$

**4. Phép chia phân số**
Quy tắc: Muốn chia hai phân số ta lấy phân số thứ nhất nhân với phân số thứ hai đảo ngược.
$$\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{a}{b} \times \dfrac{d}{c} = \dfrac{a \times d}{b \times c}$$
**Ví dụ:** $\dfrac{7}{15} : \dfrac{2}{3} = \dfrac{7}{15} \times \dfrac{3}{2} = \dfrac{21}{30} = \dfrac{7}{10}

### NDB02086 — Tính giá trị của biểu thức chứa phân số chứa nhiều phép tính
**Mô tả:** Biểu thức có từ hai phép tính trở lên giữa các phân số (có thể có số tự nhiên, dấu ngoặc), yêu cầu tính giá trị. Công cụ: thứ tự thực hiện các phép tính, mỗi bước làm một phép và rút gọn dần.

**1. Tính giá trị của biểu thức**
- Nếu trong biểu thức có chứa các phép tính cộng, trừ, nhân, chia ta thực hiện các phép tính nhân, chia trước, thực hiện các phép tính cộng trừ sau.
- Nếu trong biểu thức chỉ có phép tính cộng, trừ hoặc chỉ có phép tính nhân, chia ta thực hiện các phép tính theo thứ tự từ trái sang phải.
**2. Tính giá trị của biểu thức có dấu ngoặc**
Nếu trong biểu thức có dấu ngoặc thì ta thực hiện các phép tính ở trong ngoặc trước.

### NDB02087 — Tính thuận tiện dạng tổng với phân số
**Mô tả:** Dãy phép cộng, trừ nhiều phân số, trong đó có những cặp cùng mẫu số (hoặc rút gọn rồi cùng mẫu số) và tổng của từng nhóm cho ra $1$ hay số tròn; yêu cầu tính nhanh. Công cụ: giao hoán, kết hợp để nhóm các phân số. Chỉ có cộng, trừ, khác dạng tổng tích có dấu nhân.

##PP Nhóm các phân số để tính nhanh
Rút gọn các phân số rút gọn được để nhìn ra những phân số cùng mẫu số
Nhóm các phân số cùng mẫu số, hoặc các phân số có tổng bằng $1$, vào cùng một ngoặc
Tính từng nhóm rồi cộng (trừ) các kết quả

##CY
Khi đổi chỗ các số hạng phải mang theo dấu đứng trước nó, không bỏ sót dấu trừ.
Chưa rút gọn nên không nhìn ra cặp cùng mẫu số, rồi quy đồng cả dãy làm bài dài và dễ sai.

### NDB02088 — Tính thuận tiện dạng tổng tích, hiệu tích với phân số
**Mô tả:** Biểu thức là tổng hoặc hiệu của các tích phân số có chung một thừa số, yêu cầu tính bằng cách thuận tiện. Công cụ: nhân một số với một tổng (hiệu), đặt thừa số chung ra ngoài ngoặc. Khác dạng tổng ở chỗ các số hạng là tích.

##PP Đặt thừa số chung ra ngoài ngoặc
Tìm thừa số chung có mặt trong mọi tích, đổi chỗ các thừa số nếu thừa số chung đang đứng khác vị trí
Viết thừa số chung nhân với tổng (hiệu) các thừa số còn lại đặt trong ngoặc
Tính trong ngoặc trước (thường ra $1$ hoặc số tròn) rồi nhân

##CY
Hai tích có thừa số giống nhau nhưng đứng khác vị trí: phải đổi chỗ trước khi đặt ra ngoài ngoặc.
Quên dấu ngoặc khi đặt thừa số chung ra ngoài nên tính sai thứ tự phép tính.

### NDB02089 — Tìm phân số của 1 số, nhiều hơn, ít hơn
**Mô tả:** Đề cho một số (một cả) và một phân số chỉ phần của nó, hỏi phần đó là bao nhiêu, hoặc số khác nhiều hơn, ít hơn phần đó, hoặc cộng các phần của cùng một đơn vị. Công cụ: lấy số gốc nhân với phân số. Không phải bài biết một phần để tìm cả.

##PP Tìm phân số của một số
Xác định số gốc (thường đứng sau chữ "của", "so với") và phân số chỉ phần của nó
Tìm phần cần tính bằng cách lấy số gốc nhân với phân số
Đề hỏi số nhiều hơn, ít hơn hoặc số còn lại thì cộng hoặc trừ với phần vừa tìm, hay lấy cả trừ đi phần đã tìm

##CY
Nhầm số gốc: "A bằng $\dfrac{2}{3}$ số B" thì lấy số B nhân $\dfrac{2}{3}$ chứ không phải số A.
Trả lời số phần vừa tìm trong khi đề hỏi phần còn lại hoặc hỏi hơn kém bao nhiêu.

### NDB02674 — Tìm một số khi biết giá trị phân số của số đó (nâng cao)
**Mô tả:** Đề cho giá trị của một phần (hoặc phần còn lại sau khi đã lấy đi một số phần) và phân số chỉ phần đó so với cả, hỏi cả là bao nhiêu (tổng số cây, tổng quãng đường, số tiền thực tế…); công cụ: lấy giá trị của phần chia cho phân số tương ứng, nếu cho phần còn lại thì tìm phân số chỉ phần còn lại trước. Khác dạng tìm phân số của 1 số ở chỗ biết phần, tìm cả.




## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 7. Hỗn số

### NDB02092 — Chuyển từ hỗn số sang phân số, phân số thập phân và ngược lại
**Mô tả:** Đề cho hỗn số và yêu cầu viết thành phân số (hoặc phân số thập phân), hoặc cho phân số có tử số lớn hơn mẫu số và yêu cầu viết thành hỗn số. Công cụ: phần nguyên nhân mẫu số rồi cộng tử số; phép chia có dư. Khác dạng viết, đọc hỗn số ở chỗ phải biến đổi giữa hai cách viết.

**1. Cách chuyển hỗn số thành phân số**
+ Để chuyển một hỗn số thành phân số, ta thực hiện các bước sau:
- Bước 1: Lấy phần nguyên nhân với mẫu số, kết quả nhận được đem cộng với tử số
- Bước 2: Thay kết quả ở bước 1 thành tử số mới, giữ nguyên mẫu số. Ta được một phân số mới được chuyển từ hỗn số đã cho
**Ví dụ:** Chuyển các hỗn số thành phân số: $2\dfrac{1}{6}$; $5\dfrac{3}{4}$; $2\dfrac{2}{9}$
**Lời giải:**
$2\dfrac{1}{6} = \dfrac{2\times 6+1}{6} = \dfrac{13}{6}$
$5\dfrac{3}{4} = \dfrac{5\times 4+3}{4} = \dfrac{23}{4}$ 
$2\dfrac{2}{9} = \dfrac{2\times 9+2}{9} = \dfrac{20}{9}$
**2. Cách chuyển phân số thành hỗn số**
 Cách 1: Để chuyển một phân số sang hỗn số, ta thực hiện theo các bước sau:
- Bước 1: Lấy tử số chia cho mẫu số
- Bước 2: Phần nguyên là số nguyên trong hỗn số
- Bước 3: Phần dư là tử số mới trong hỗn số
- Bước 4: Phần mẫu số giữ nguyên giá trị
**Ví dụ:** Chuyển các phân số thành hỗn số: $\dfrac{9}{2}$; $\dfrac{16}{3}$; $\dfrac{27}{5}$
**Lời giải:**
Ta có:
$9 : 2 = 4$ (dư 1); $16 : 3 = 5$ (dư 1) và $27 : 5 = 5$ (dư 2)
Vậy các phân số đã cho được viết dưới dạng hỗn số là:
$\dfrac{9}{2}=4\dfrac{1}{2}$; $\dfrac{16}{3}=5\dfrac{1}{3}$; $\dfrac{27}{5}=5\dfrac{2}{5}$
* Chú ý: Bất kỳ phân số nào có tử số lớn hơn mẫu số đều có thể đổi thành hỗn số và ngược lại. Tuy nhiên nếu tử số bằng hoặc nhỏ hơn mẫu số thì không thể thực hiện được việc chuyển phân số thành hỗn số.
Cách 2: 
Các bước:
* Bước 1: Tách tử số thành một số chia hết cho mẫu số và phần còn lại.
* Bước 2: Viết thành tổng của hai phân số.
* Bước 3: Viết dưới dạng hỗn số.
Ví dụ:
$$ \dfrac{46}{10} = \dfrac{40 + 6}{10} = \dfrac{40}{10} + \dfrac{6}{10} = 4\dfrac{6}{10} $$

### NDB02093 — Viết, đọc hỗn số, biểu diễn hỗn số trên tia số
**Mô tả:** Đề yêu cầu viết hỗn số từ lời đọc (hoặc đọc hỗn số), viết hỗn số chỉ số đơn vị khi mỗi đơn vị chia thành các phần bằng nhau, hoặc tìm hỗn số ứng với một vạch trên tia số. Công cụ: phần nguyên là số đơn vị trọn vẹn, phần phân số là phần lẻ so với một đơn vị.

##PP Viết hỗn số từ hình, tia số hoặc lời đọc
Tìm số đơn vị trọn vẹn: đó là phần nguyên
Xem một đơn vị được chia thành mấy phần bằng nhau: đó là mẫu số
Đếm số phần lẻ còn lại chưa đủ một đơn vị: đó là tử số
Trên tia số lấy vạch số nguyên bên trái gần nhất làm phần nguyên rồi đếm số khoảng từ vạch đó đến vạch cần tìm
Viết phần nguyên rồi viết phân số bên cạnh; đọc là "… và … phần …"

##CY
Nhầm tử số với mẫu số, hoặc đọc "ba phần năm" thành "ba năm".
Trên tia số đếm số vạch thay vì đếm số khoảng, làm tử số và mẫu số lệch một đơn vị.

### NDB02094 — Cộng - trừ hỗn số
**Mô tả:** Phép cộng hoặc trừ hai (hay ba) hỗn số, kết quả viết lại thành hỗn số tối giản. Công cụ: cộng (trừ) riêng phần nguyên và phần phân số, hoặc đổi ra phân số; khi trừ mà phần phân số số bị trừ bé hơn thì rút $1$ đơn vị ở phần nguyên.

**1 Cách cộng hỗn số**
Phương pháp giải:
Khi cộng hai hỗn số: có thể viết chúng dưới dạng phân số rồi thực hiện phép cộng phân số. Ta cũng có thể cộng phần nguyên với nhau, cộng phần phân số với nhau (khi hai hỗn số đều dương).
Ví dụ:
$$2\dfrac{1}{2} + 3\dfrac{1}{4} = (2+3) + \left(\dfrac{1}{2} + \dfrac{1}{4}\right) = 5 + \dfrac{3}{4} = 5\dfrac{3}{4}.$$
**2 Cách trừ hỗn số**
Phương pháp giải:
Khi trừ hai hỗn số: có thể viết chúng dưới dạng phân số rồi thực hiện phép trừ phân số. Ta cũng có thể lấy phần nguyên của số bị trừ trừ phần nguyên của số trừ, phần phân số của số bị trừ trừ phần phân số của số trừ, rồi cộng hai kết quả với nhau (khi hai hỗn số đều dương, số bị trừ lớn hơn hoặc bằng số trừ).
Ví dụ:
$$6\dfrac{3}{4} - 2\dfrac{1}{4} = (6-2) + \left(\dfrac{3}{4} - \dfrac{1}{4}\right) = 4 + \dfrac{2}{4} = 4 + \dfrac{1}{2} = 4\dfrac{1}{2}.$$
Khi hai hỗn số đều dương, số bị trừ lớn hơn hoặc bằng số trừ, nhưng phần phân số của số bị trừ nhỏ hơn phần phân số của số trừ, phải thực rút một đơn vị ở phần nguyên của số bị trừ để thêm vào phần phân số, sau đó tiếp tục trừ như trên.
Ví dụ:
$$5\dfrac{1}{3} - 2\dfrac{2}{3} = 4\dfrac{4}{3} - 2\dfrac{2}{3} = (4-2) + \left(\dfrac{4}{3} - \dfrac{2}{3}\right) = 2 + \dfrac{2}{3} = 2\dfrac{2}{3}.$$

### NDB02095 — Nhân, chia hỗn số
**Mô tả:** Phép nhân hoặc chia giữa hai hỗn số, hoặc giữa hỗn số và số tự nhiên, yêu cầu tính và viết kết quả dưới dạng phân số hoặc hỗn số. Công cụ: đổi hỗn số ra phân số rồi nhân (chia) hai phân số, rút gọn kết quả.

- Để thực hiện phép nhân (hoặc chia) hai hỗn số, ta chuyển hai hỗn số đó về dạng phân số rồi nhân (hoặc chia) hai phân số vừa chuyển đổi.
- Nếu nhân hỗn số với một số tự nhiên, ta chỉ cần nhân số tự nhiên đó lần lượt với phần nguyên và phần thập phân của hỗn số.

### NDB02096 — Biểu thức hỗn hợp
**Mô tả:** Biểu thức có từ hai phép tính trở lên với hỗn số (có thể kèm phân số, số tự nhiên, dấu ngoặc), yêu cầu tính giá trị. Công cụ: thứ tự thực hiện phép tính; chỉ cộng, trừ thì nhóm phần nguyên và phần phân số; có nhân, chia thì đổi ra phân số.

##PP Tính biểu thức có hỗn số
Xem biểu thức chỉ có cộng, trừ hay có cả nhân, chia, có ngoặc hay không
Chỉ có cộng, trừ: tính riêng phần nguyên, tính riêng phần phân số rồi gộp lại
Có nhân, chia: đổi mọi hỗn số ra phân số rồi làm theo thứ tự trong ngoặc trước, nhân chia trước, cộng trừ sau
Rút gọn từng bước và viết kết quả cuối thành phân số tối giản hoặc hỗn số

##CY
Nhầm hỗn số $2\dfrac{1}{3}$ là $2\times\dfrac{1}{3}$; thực ra $2\dfrac{1}{3}=2+\dfrac{1}{3}=\dfrac{7}{3}$.
Dấu trừ đứng trước một hỗn số tác dụng lên cả phần nguyên lẫn phần phân số.


## Chủ đề 1. Ôn tập và bổ sung › Ôn tập và bổ sung › Bài 8. Ôn tập hình học và đo lường

### NDB02139 — Đổi đơn vị đo lường
**Mô tả:** Đề cho số đo độ dài, khối lượng hoặc thời gian (tấn, tạ, yến, kg, giờ, phút, thế kỉ, năm...) và yêu cầu điền số vào chỗ chấm để đổi sang đơn vị khác; công cụ: bảng quan hệ giữa các đơn vị. Khác nhóm đơn vị đo diện tích ở chỗ đơn vị không có số mũ.

##PP Đổi đơn vị đo lường
Viết ra quan hệ giữa hai đơn vị cần đổi (ví dụ $1\text{ giờ} = 60\text{ phút}$).
Đổi sang đơn vị bé hơn thì nhân với số lần đó, đổi sang đơn vị lớn hơn thì chia.
Số đo có hai đơn vị thì đổi từng phần về đơn vị cần tìm rồi cộng lại.
Thử lại bằng phép đổi ngược để kiểm tra kết quả.

##CY
Nhầm hướng đổi: đổi sang đơn vị bé hơn mà lại đem chia.
Thời gian không gấp 10 lần: $1\text{ giờ} = 60\text{ phút}$, không phải $100\text{ phút}$.
Nhầm giữa yến, tạ, tấn: $1\text{ tạ} = 10\text{ yến}$ nhưng $1\text{ tấn} = 100\text{ yến}$.

### NDB02808 — Một số bài toán có lời văn liên quan đến đơn vị đo đại lượng
**Mô tả:** Bài toán có lời văn cho số đo độ dài, khối lượng, diện tích (thường gồm hai tên đơn vị như 1 tấn 250 kg, 1 tạ 25 kg, hoặc kích thước khác đơn vị như cạnh viên gạch tính bằng cm còn nền nhà tính bằng m) và hỏi một đại lượng thực tế: khối lượng mỗi loại, con vật nặng bao nhiêu, mỗi phần đất rộng bao nhiêu, cần bao nhiêu viên gạch; công cụ: đổi các số đo về cùng một đơn vị rồi lập phép tính (cộng, trừ, nhân, chia, tìm phân số của một số). Khác dạng Đổi đơn vị đo lường ở chỗ phải giải bài toán, không chỉ điền số đo đã đổi.

##PP Giải bài toán có lời văn liên quan đến đơn vị đo
Đọc đề, gạch chân các số đo và xem đề hỏi kết quả theo đơn vị nào.
Đổi tất cả số đo về cùng một đơn vị (thường là đơn vị đề hỏi). Số đo có hai tên đơn vị thì đổi phần đơn vị lớn rồi cộng phần còn lại.
Lập phép tính theo câu hỏi: cộng, trừ, nhân, chia, hoặc tìm phân số của một số.
Viết lời giải cho từng phép tính, ghi đơn vị trong ngoặc và đáp số đúng đơn vị đề hỏi.

##CY
Tính khi các số đo chưa cùng đơn vị: lấy $1$ tạ $25$ kg cộng thẳng với $150$ kg là sai.
Diện tích phải đổi theo đơn vị diện tích: $1\text{ m}^2 = 10000\text{ cm}^2$, không phải $100\text{ cm}^2$.
Đáp số phải ghi theo đơn vị đề hỏi (đề hỏi ki-lô-gam thì không trả lời bằng tạ).

### NDB02140 — Góc, đường thẳng, hình thoi, hình bình hành
**Mô tả:** Đề cho hình vẽ hoặc hình ghép và hỏi đếm hay gọi tên: số góc nhọn, góc vuông, góc tù, số cặp cạnh song song, vuông góc, số hình thoi, hình bình hành; hoặc yêu cầu VẼ đường thẳng song song, vuông góc với đường thẳng đã cho bằng ê ke; công cụ: quan sát hình, so với góc vuông, kiểm tra cạnh đối song song và các cạnh bằng nhau. Khác dạng tam giác, hình thang ở chỗ chỉ nhận biết hình, không tính diện tích.

##PP Nhận biết góc, cạnh song song, hình thoi, hình bình hành
Xác định các điểm và đoạn thẳng có trong hình, gọi tên từng góc, từng hình theo các đỉnh.
So sánh góc với góc vuông để biết góc nhọn, vuông hay tù.
Kiểm tra từng cặp cạnh: cạnh đối diện song song, độ dài các cạnh bằng nhau thì mới kết luận hình thoi hay hình bình hành.
Đếm theo thứ tự (từng đỉnh, từng hình nhỏ rồi hình ghép) để không sót, không đếm lặp.

##CY
Hình ghép từ nhiều hình nhỏ cũng là một hình cần đếm, nên hay bị bỏ sót.
Hai cạnh kề nhau (chung một đỉnh) không phải cặp cạnh đối diện, nên không xét song song theo cặp này.
Hai cạnh trông như song song chưa chắc song song, phải dựa vào dữ kiện của đề hoặc hình vẽ.

### NDB02672 — Bài toán thực tế về diện tích hình chữ nhật, hình vuông
**Mô tả:** Bài toán lời văn cho kích thước (hoặc quan hệ giữa chiều dài và chiều rộng, ví dụ chiều rộng bằng một phân số của chiều dài) của mảnh đất, thửa ruộng hình chữ nhật / hình vuông; tính diện tích rồi dùng diện tích để trả lời câu hỏi thực tế (sản lượng thu hoạch theo mỗi 100 m², số cây trồng…), có thể phải đổi đơn vị đo diện tích.




## Chủ đề 2. Số thập phân › Số thập phân › Bài 10. Khái niệm số thập phân

### NDB02097 — Biểu diễn số thập phân trên tia số
**Mô tả:** Đề cho một dãy vạch cách đều nhau trên tia số, đã biết số ở một vài vạch và yêu cầu điền số ở các vạch còn lại; công cụ: tìm khoảng cách giữa hai vạch liên tiếp rồi cộng dần (hoặc trừ dần). Khác dạng sắp xếp ở chỗ các vạch cách đều và phải tìm số còn thiếu.

##PP Tìm số còn thiếu trên tia số
Lấy số ở hai vạch đã biết, lấy số lớn trừ số bé để được hiệu của hai vạch.
Chia hiệu đó cho số khoảng giữa hai vạch để tìm khoảng cách giữa hai vạch liên tiếp.
Muốn tìm số ở vạch bên phải thì cộng khoảng cách, muốn tìm số ở vạch bên trái thì trừ khoảng cách.
Thử lại: hai vạch liên tiếp bất kì đều cách nhau đúng khoảng cách đã tìm.

##CY
Đếm nhầm số khoảng: từ vạch thứ hai đến vạch thứ năm chỉ có 3 khoảng, không phải 4 khoảng.
Khi đi qua số tròn dễ viết sai, ví dụ sau 4,8 là 5 chứ không phải 4,10.

### NDB02098 — Chuyển từ phân số thập phân, hỗn số sang số thập phân và ngược lại
**Mô tả:** Đề cho phân số thập phân, phân số hoặc hỗn số và yêu cầu viết thành số thập phân, hoặc cho số thập phân và yêu cầu viết lại thành phân số (hỗn số); công cụ: đưa phân số về mẫu số $10$, $100$, $1000$ rồi dịch dấu phẩy.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f71678d7-30c0-49a0-a8e6-c7adadc24ccd.png)
– Nếu phân số đã cho chưa là phân số thập phân thì ta chuyển các phân số thành phân số thập phân.
– Đếm xem mẫu số có bao nhiêu chữ số 0, thì dịch chuyển dấu phẩy về bên trái bấy nhiêu chữ số.

### NDB02100 — Đọc, viết số thập phân
**Mô tả:** Đề cho số thập phân ở dạng lời đọc hoặc dạng cấu tạo (mấy trăm, mấy chục, mấy đơn vị, mấy phần mười, phần trăm, phần nghìn) và yêu cầu viết thành số, hoặc cho số và yêu cầu đọc; công cụ: bảng hàng của phần nguyên và phần thập phân, hàng nào không nhắc tới thì viết chữ số 0.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/5b142593-95c6-474b-85b3-86c6f2af4c47.png)
Số gồm 4 trăm, 7 chục, 2 đơn vị, 5 phần mười, 8 phần trăm, 6 phần nghìn.
Viết là: 472,586. Đọc là: Bốn trăm bảy mươi hai phẩy năm trăm tám mươi sáu.
- Muốn viết một số thập phân, trước hết viết phần nguyên, viết dấu phẩy, sau đó viết phần thập phân.
- Muốn đọc một số thập phân, trước hết đọc phần nguyên, đọc dấu phẩy, sau đó đọc phần thập phân.

### NDB02105 — Lập số thập phân từ các chữ số đã cho
**Mô tả:** Đề cho một số thẻ chữ số và thẻ dấu phẩy, yêu cầu lập số thập phân lớn nhất, bé nhất hoặc tất cả các số thập phân thoả điều kiện (phần nguyên mấy chữ số, phần thập phân mấy chữ số, bé hơn một số cho trước); công cụ: đặt chữ số lớn (bé) ở hàng cao rồi liệt kê có thứ tự.

Khi lập số thập phân từ các thẻ chữ số và thẻ dấu phẩy, ta cần chú ý yêu cầu của đề bài.
Nếu đề yêu cầu lập số thập phân lớn nhất, ta xếp các chữ số lớn hơn ở phần nguyên hoặc ở vị trí bên trái.
Nếu đề yêu cầu lập số thập phân bé nhất, ta xếp các chữ số bé hơn ở phần nguyên hoặc ở vị trí bên trái.
Nếu đề yêu cầu phần nguyên có một chữ số, ta đặt dấu phẩy sau chữ số đầu tiên.
Nếu đề yêu cầu phần thập phân có hai chữ số, ta đặt hai chữ số sau dấu phẩy.
Ví dụ.Cho các thẻ chữ số và thẻ dấu phẩy sau: 3; 5; 8; dấu phẩy.
a) Lập số thập phân lớn nhất có một chữ số ở phần nguyên và hai chữ số ở phần thập phân.
b) Làm tròn số vừa lập được đến hàng phần mười.
Lời giải.
a) Để lập số thập phân lớn nhất, ta chọn chữ số lớn nhất làm phần nguyên.
Chữ số lớn nhất là 8.
Hai chữ số còn lại là 5 và 3, xếp ở phần thập phân theo thứ tự giảm dần.
Số thập phân lớn nhất lập được là: 8,53.
b) Làm tròn số 8,53 đến hàng phần mười:
Chữ số hàng phần trăm là 3.
Vì 3 bé hơn 5 nên ta giữ nguyên chữ số hàng phần mười.
Vậy: $8,53 \approx 8,5$.

### NDB02106 — Giá trị của các chữ số trong số thập phân
**Mô tả:** Đề cho một số thập phân và hỏi phần nguyên, phần thập phân, chữ số ở một hàng nào đó, một chữ số đứng ở hàng nào hoặc có giá trị bao nhiêu; công cụ: bảng hàng, lấy dấu phẩy làm mốc. Khác dạng đọc – viết ở chỗ số đã cho sẵn, chỉ cần xác định hàng và giá trị.

##PP Xác định hàng và giá trị của chữ số
Tìm dấu phẩy: bên trái là phần nguyên, bên phải là phần thập phân.
Gọi tên hàng của chữ số: bên trái dấu phẩy đếm đơn vị, chục, trăm,... từ phải sang trái; bên phải dấu phẩy đếm phần mười, phần trăm, phần nghìn,... từ trái sang phải.
Giá trị của chữ số bằng chữ số đó nhân với đơn vị của hàng, ví dụ chữ số 5 ở hàng phần trăm có giá trị $\dfrac{5}{100}$.
Đối chiếu với yêu cầu của đề để trả lời hoặc chọn đáp án.

##CY
Nhầm hàng phần mười với hàng chục, hàng phần trăm với hàng trăm vì tên gọi giống nhau.
Quên đếm chữ số 0 giữ chỗ nên gọi sai tên hàng của các chữ số đứng sau nó.


## Chủ đề 2. Số thập phân › Số thập phân › Bài 11. So sánh các số thập phân

### NDB02099 — So sánh số thập phân
**Mô tả:** Đề cho hai số thập phân (hoặc một số thập phân với một số có chữ số còn thiếu) yêu cầu điền dấu $>$, $<$, $=$ hoặc tìm chữ số thích hợp; công cụ: so sánh phần nguyên rồi từng hàng phần thập phân từ trái sang phải. Khác dạng sắp xếp ở chỗ chỉ so sánh một cặp số.

**- Muốn so sánh hai số thập phân, ta có thể làm như sau:**
+ Nếu phần nguyên của hai số đó khác nhau thì số thập phân nào có phần nguyên lớn hơn thì số đó lớn hơn.
+ Nếu phần nguyên của hai số đó bằng nhau thì so sánh phần thập phân, lần lượt từ hàng phần mười, hàng phần trăm, hàng phần nghìn,..., đến một hàng nào đó, số thập phân có chữ số ở hàng tương ứng lớn hơn thì số đó lớn hơn.
+ Nếu phần nguyên và phần thập phân của hai số thập phân bằng nhau thì hai số đó bằng nhau.
**- Chú ý:**
+ Nếu viết thêm (hoặc bớt) chữ số 0 ở tận cùng bên phải phần thập phân của một số thập phân thì được một số thập phân bằng nó.

### NDB02101 — Sắp xếp dãy số thập phân theo thứ tự
**Mô tả:** Đề cho từ ba số thập phân trở lên và yêu cầu xếp theo thứ tự từ bé đến lớn hoặc từ lớn đến bé, hoặc tìm các số thập phân nằm giữa hai số cho trước; công cụ: so sánh từng hàng từ trái sang phải. Khác dạng so sánh ở chỗ phải xếp cả một dãy số.

Ví dụ: 
Sắp xếp các số $4,208;3,975;4,082;3,957$ theo thứ tự từ bé đến lớn.
**Lời giải: **
So sánh các số thập phân, ta có:
Trong hai số có phần nguyên là $3: 3,957 < 3,975$.
Trong hai số có phần nguyên là $4: 4,082 < 4,208$.
Vậy thứ tự từ bé đến lớn là:
$3,957 < 3,975 < 4,082 < 4,208$.


## Chủ đề 2. Số thập phân › Số thập phân › Bài 12. Viết số đo đại lượng dưới dạng số thập phân

### NDB02102 — Viết số đo đại lượng dưới dạng số thập phân
**Mô tả:** Đề cho số đo độ dài, khối lượng (có thể gồm hai tên đơn vị) và yêu cầu viết thành số thập phân theo một đơn vị cho trước; công cụ: bảng đơn vị đo, đổi phần lẻ thành phân số thập phân rồi viết thành số thập phân. Khác dạng số đo diện tích ở chỗ hai đơn vị liền nhau hơn kém $10$ lần chứ không phải $100$ lần.

**Ví dụ 1:**
2 m 15 cm = $2\dfrac{15}{100}$ m = 2,15 m. Vậy: 2 m 15 cm = 2,15 m.
1 kg 250 g = $1\dfrac{250}{1000}$ kg = 1,250 kg. Vậy: 1 kg 250 g = 1,250 kg.
**Ví dụ 2:**
$275 \text{ g} =  ? \text{ kg}$ 
$275 \text{ g} = \dfrac{275}{1\,000} \text{ kg} = 0,275 \text{ kg}$. Vậy: $275 \text{ g} = 0,275 \text{ kg}$.
$125 \text{ m} =  ? \text{ km}$
$125 \text{ m} = \dfrac{125}{1\,000} \text{ km} = 0,125 \text{ km}$. Vậy: $125 \text{ m} = 0,125 \text{ km}$.

### NDB02103 — Viết số đo diện tích dưới dạng số thập phân
**Mô tả:** Đề cho số đo diện tích (có thể gồm hai tên đơn vị) và yêu cầu viết thành số thập phân theo một đơn vị diện tích cho trước; công cụ: bảng đơn vị đo diện tích, hai đơn vị liền nhau hơn kém $100$ lần (ha và m$^2$ hơn kém $10000$ lần). Khác dạng số đo độ dài, khối lượng ở hệ số $100$.

• **Ví dụ 1:** Viết $1 m^2 60 dm^2$ dưới dạng số thập phân với đơn vị mét vuông.
$1 m^2 60 dm^2 = 1\dfrac{60}{100} m^2 = 1,6 m^2$. Vậy: $1 m^2 60 dm^2 = 1,6 m^2$.
• **Ví dụ 2:** Viết $56 dm^2$ dưới dạng số thập phân với đơn vị mét vuông.
$56 dm^2 = \dfrac{56}{100} m^2 = 0,56 m^2$. Vậy: $56 dm^2 = 0,56 m^2$.


## Chủ đề 2. Số thập phân › Số thập phân › Bài 13. Làm tròn số thập phân

### NDB02104 — Làm tròn số thập phân
**Mô tả:** Đề yêu cầu làm tròn một số thập phân đến hàng đơn vị, phần mười, phần trăm,... hoặc hỏi số đã được làm tròn đến hàng nào; công cụ: nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn, từ $5$ trở lên thì tăng thêm $1$, nhỏ hơn $5$ thì giữ nguyên.

**1. Làm tròn số thập phân đến hàng đơn vị:**
- Nếu chữ số hàng phần mười là 0; 1; 2; 3; 4 thì giữ nguyên chữ số hàng đơn vị.
- Nếu chữ số hàng phần mười là 5; 6; 7; 8; 9 thì thêm 1 vào chữ số hàng đơn vị.
- Sau khi làm tròn số đến hàng đơn vị thì phần thập phân là 0.
**Ví dụ:**
$7,06; 7,15; 7,27; 7,31; 7,48. \to 7$
$3,52; 3,68; 3,74; 3,85; 3,93. \to 4$
**2. Làm tròn số thập phân đến hàng phần mười.**
- Nếu chữ số hàng phần trăm là 0; 1; 2; 3; 4 thì giữ nguyên chữ số hàng phần mười.
- Nếu chữ số hàng phần trăm là 5; 6; 7; 8; 9 thì thêm 1 vào chữ số hàng phần mười.
- Sau khi làm tròn số đến hàng phần mười thì các chữ số sau chữ số hàng phần mười đó đều là 0.
Ví dụ:
$5,407; 5,416; 5,422; 5,434; 5,448. \rightarrow 5,4$
$8,157; 8,162; 8,174; 8,183; 8,195. \rightarrow 8,2$
**3. Làm tròn số thập phân đến hàng phần trăm.**
- Nếu chữ số hàng phần nghìn là 0; 1; 2; 3; 4 thì giữ nguyên chữ số hàng phần trăm.
- Nếu chữ số hàng phần nghìn là 5; 6; 7; 8; 9 thì thêm 1 vào chữ số hàng phần trăm.
- Sau khi làm tròn số đến hàng phần trăm thì các chữ số sau chữ số hàng phần trăm đó đều là 0.
Ví dụ:
$0,9605; 0,9617; 0,9624; 0,9638; 0,9649. \rightarrow 0,96$
$0,7258; 0,7261; 0,7272; 0,7285; 0,7294. \rightarrow 0,73$


## Chủ đề 3. Một số đơn vị đo diện tích › Một số đơn vị đo diện tích › Bài 15. Ki-lô-mét vuông. Héc-ta

### NDB02141 — Ki-lô-mét vuông. Héc-ta
**Mô tả:** Bài 15 SGK. Câu chỉ dùng các đơn vị km², ha, m²: đọc, viết số đo; đổi giữa km², ha, m² (một hay hai tên đơn vị đều được); so sánh, sắp xếp số đo; chọn số đo phù hợp với diện tích địa danh; bài toán khu đất, vùng đất tính ra ha hoặc km². Công cụ: 1 km² = 100 ha = 1 000 000 m²; 1 ha = 10 000 m². Câu có dm², cm², mm² thuộc dạng Các đơn vị đo diện tích.

##ĐN Ki-lô-mét vuông
Ki-lô-mét vuông là diện tích của hình vuông có cạnh $1\text{ km}$, viết tắt là $\text{km}^2$. Dùng để đo diện tích lớn như thành phố, khu rừng, vùng biển.
$1\text{ km}^2 = 1000000\text{ m}^2$.

##ĐN Héc-ta
Héc-ta là diện tích của hình vuông có cạnh $100\text{ m}$, viết tắt là $\text{ha}$. Dùng để đo diện tích đất trong nông nghiệp, lâm nghiệp.
$1\text{ ha} = 10000\text{ m}^2$; $1\text{ km}^2 = 100\text{ ha}$.

##PP Đổi giữa km², ha, m²
Đổi sang đơn vị bé hơn thì nhân (km² ra ha nhân 100, ha ra m² nhân 10 000), đổi sang đơn vị lớn hơn thì chia.
Số đo có hai tên đơn vị: đổi phần đơn vị lớn rồi cộng phần còn lại.
So sánh, sắp xếp: đổi các số đo về cùng một đơn vị rồi so sánh hai số.

##CY
Nhầm $1\text{ km}^2 = 1000\text{ m}^2$ (đúng là $1000000\text{ m}^2$).
Nhầm $1\text{ ha} = 100\text{ m}^2$ (đúng là $10000\text{ m}^2$).


## Chủ đề 3. Một số đơn vị đo diện tích › Một số đơn vị đo diện tích › Bài 16. Các đơn vị đo diện tích

### NDB02143 — Các đơn vị đo diện tích
**Mô tả:** Bài 16 SGK. Câu có dùng dm², cm² hoặc mm² (có thể kèm km², ha, m²): đổi số đo diện tích một hay hai tên đơn vị về đơn vị khác theo bảng đơn vị đo diện tích; so sánh, sắp xếp số đo; chọn số đo phù hợp với diện tích đồ vật; bài toán đổi đơn vị diện tích. Công cụ: hai đơn vị liền nhau hơn kém nhau 100 lần (km², ha, m², dm², cm², mm²). Câu chỉ có km², ha, m² thuộc dạng Ki-lô-mét vuông. Héc-ta.

##TC Bảng đơn vị đo diện tích
Từ lớn đến bé: $\text{km}^2$, $\text{ha}$, $\text{m}^2$, $\text{dm}^2$, $\text{cm}^2$, $\text{mm}^2$.
$1\text{ km}^2 = 100\text{ ha}$; $1\text{ ha} = 10000\text{ m}^2$; $1\text{ m}^2 = 100\text{ dm}^2$; $1\text{ dm}^2 = 100\text{ cm}^2$; $1\text{ cm}^2 = 100\text{ mm}^2$.
Mỗi đơn vị bằng $\dfrac{1}{100}$ đơn vị liền trước (riêng $1\text{ m}^2 = \dfrac{1}{10000}\text{ ha}$).

##PP Đổi số đo diện tích
Đổi sang đơn vị bé hơn thì nhân, sang đơn vị lớn hơn thì chia; từ $\text{m}^2$ trở xuống, mỗi bậc gấp 100 lần.
Số đo có hai tên đơn vị (vd $2\text{ m}^2\,5\text{ dm}^2$): đổi phần đơn vị lớn rồi cộng phần còn lại.
So sánh, sắp xếp: đưa về cùng một đơn vị rồi so sánh.
Chọn số đo phù hợp: đồ vật nhỏ dùng $\text{cm}^2$, $\text{dm}^2$; phòng, sân dùng $\text{m}^2$; vùng đất dùng $\text{ha}$, $\text{km}^2$.

##CY
Diện tích hơn kém 100 lần mỗi bậc, không phải 10 lần như độ dài: $2\text{ m}^2\,5\text{ dm}^2 = 205\text{ dm}^2$ chứ không phải $25\text{ dm}^2$.


## Chủ đề 3. Một số đơn vị đo diện tích › Một số đơn vị đo diện tích › Bài 17. Thực hành và trải nghiệm với một số đơn vị đo đại lượng

### NDB02142 — Thực hành và trải nghiệm với một số đơn vị đo đại lượng
**Mô tả:** Bài 17 SGK. Bài toán thực hành: đo và tính diện tích mặt sàn phòng học, lát nền bằng gạch hình vuông (tính số viên gạch, số hộp gạch, số tiền mua gạch), có đổi đơn vị độ dài và diện tích. Khác hai dạng đổi đơn vị ở chỗ phải giải bài toán thực tế nhiều bước.

##PP Bài toán lát sàn, lát nền
Tính diện tích mặt sàn (hình chữ nhật: chiều dài $\times$ chiều rộng).
Tính diện tích một viên gạch; đổi về cùng đơn vị với diện tích mặt sàn ($1\text{ m}^2 = 10000\text{ cm}^2$).
Số viên gạch $=$ diện tích mặt sàn $:$ diện tích một viên gạch.
Gạch đóng hộp: số hộp $=$ số viên $:$ số viên mỗi hộp; số tiền $=$ số hộp $\times$ giá một hộp.

##CY
Phải đổi cùng đơn vị trước khi chia: mặt sàn tính bằng $\text{m}^2$, viên gạch tính bằng $\text{cm}^2$.
Phần mạch vữa không đáng kể (bỏ qua khi tính).


## Chủ đề 4. Các phép tính với số thập phân › Các phép tính với số thập phân › Bài 19–20. Phép cộng, phép trừ số thập phân

### NDB02107 — Cộng, trừ số thập phân
**Mô tả:** Đề cho đúng một phép cộng hoặc một phép trừ giữa các số thập phân (có thể có số tự nhiên) và yêu cầu đặt tính rồi tính; công cụ: đặt tính thẳng cột dấu phẩy. Khác dạng biểu thức hỗn hợp ở chỗ chỉ có một phép tính.

**1. Muốn cộng hai số thập phân ta làm như sau:**
- Viết số hạng này dưới số hạng kia sao cho các chữ số ở cùng hàng đặt thẳng cột với nhau.
- Cộng như cộng hai số tự nhiên.
- Viết dấu phẩy ở tổng thẳng cột với các dấu phẩy ở hai số hạng.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3d094f34-fc69-4824-af38-cd1d1f3de13f.png)
**2. Muốn trừ hai số thập phân ta làm như sau:**
- Viết số trừ bên dưới số bị trừ sao cho các chữ số ở cùng hàng đặt thẳng cột với nhau.
- Trừ như trừ hai số tự nhiên.
- Viết dấu phẩy ở hiệu thẳng cột với dấu phẩy của số bị trừ và số trừ.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ea885d28-64c3-4a13-8718-4b99e864a4f7.png)


## Chủ đề 4. Các phép tính với số thập phân › Các phép tính với số thập phân › Bài 21. Phép nhân số thập phân

### NDB02108 — Phép nhân số thập phân
**Mô tả:** Đề cho phép nhân giữa số thập phân với số tự nhiên hoặc giữa hai số thập phân, yêu cầu đặt tính rồi tính; công cụ: nhân như số tự nhiên rồi đếm chữ số thập phân của các thừa số để đặt dấu phẩy ở tích.

**1. Muốn nhân một số thập phân với một số tự nhiên ta làm như sau:**
+ Đặt tính và thực hiện phép nhân như nhân hai số tự nhiên.
+ Đếm trong phần thập phân của số thập phân có bao nhiêu chữ số thì dùng dấu phẩy tách ở tích ra bấy nhiêu chữ số kể từ phải sang trái.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f2aae176-54ce-42cb-98a9-6cb11e663d36.png)
**2. Muốn nhân một số thập phân với một số thập phân ta làm như sau:**
- Đặt tính và thực hiện phép nhân như nhân hai số tự nhiên.
- Đếm trong phần thập phân của cả hai thừa số có bao nhiêu chữ số thì dùng dấu phẩy tách ở tích ra bấy nhiêu chữ số kể từ phải sang trái.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/67eccf37-6a1b-4059-8cfa-966c7d7af96f.png)


## Chủ đề 4. Các phép tính với số thập phân › Các phép tính với số thập phân › Bài 22. Phép chia số thập phân

### NDB02109 — Phép chia số thập phân
**Mô tả:** Đề cho phép chia số thập phân cho số tự nhiên, hoặc chia số tự nhiên cho số tự nhiên mà thương là số thập phân, yêu cầu đặt tính rồi tính; công cụ: đặt dấu phẩy ở thương khi lấy chữ số đầu tiên ở phần thập phân, còn dư thì viết thêm chữ số $0$ vào số dư để chia tiếp.

**1. Muốn chia một số thập phân cho một số tự nhiên ta làm như sau:**
- Chia phần nguyên của số bị chia cho số chia.
- Viết dấu phẩy vào bên phải thương đã tìm được trước khi lấy chữ số đầu tiên ở phần thập phân của số bị chia để tiếp tục thực hiện phép chia.
- Tiếp tục chia với từng chữ số ở phần thập phân của số bị chia.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/97687476-391d-4de6-a69a-49b13e84c7f5.png)
**2. Khi chia một số tự nhiên cho một số tự nhiên mà còn dư, ta tiếp tục chia như sau:**
- Viết dấu phẩy vào bên phải thương.
- Viết thêm vào bên phải số dư một chữ số 0 rồi chia tiếp.
- Nếu còn dư nữa, ta lại viết thêm vào bên phải số dư một chữ số 0 rồi tiếp tục chia, và có thể cứ làm như thế mãi.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ae4d585c-bede-4261-8abc-1c2afb0999d3.png)
**3. Muốn chia một số tự nhiên cho một số thập phân ta làm như sau:**
- Đếm xem có bao nhiêu chữ số ở phần thập phân của số chia thì viết thêm vào bên phải số bị chia bấy nhiêu chữ số 0.
- Bỏ dấu phẩy ở số chia rồi thực hiện phép chia như chia các số tự nhiên.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/844c7ce3-4a00-4239-b6f2-4dbcebf4c7ea.png)
VD: Tính rồi so sánh kết quả:
$4,5 : 9$ và $(4,5 \times 10) : (9 \times 10)$.
$4,5 : 9 = 0,5$
$(4,5 \times 10) : (9 \times 10) = 45 : 90$
$= 0,5$
Vậy: $4,5 : 9 = (4,5 \times 10) : (9 \times 10)$.
**Nhận xét:** Khi nhân số bị chia và số chia với cùng một số khác $0$ thì thương không thay đổi.
** 4. Muốn chia một số thập phân cho một số thập phân ta làm như sau:**
- Đếm xem có bao nhiêu chữ số ở phần thập phân của số chia thì chuyển dấu phẩy ở số bị chia sang bên phải bấy nhiêu chữ số.
- Nếu số chữ số ở phần thập phân của số bị chia ít hơn số chữ số ở phần thập phân của số chia thì ta viết thêm các chữ số 0 vào bên phải số bị chia cho đủ.
- Bỏ dấu phẩy ở số chia rồi thực hiện phép chia như chia cho số tự nhiên.
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/00d68236-c19c-4e15-91cd-bbfebbefbc7d.png)


## Chủ đề 4. Các phép tính với số thập phân › Các phép tính với số thập phân › Bài 23. Nhân, chia số thập phân với 10; 100; 1 000;… hoặc với 0,1; 0,01; 0,001;…

### NDB02113 — Nhân số thập phân với số 10; 100; 1000; ..... hoặc 0,1; 0,01; 0,001;.....
**Mô tả:** Đề yêu cầu tính nhẩm số thập phân nhân với $10$; $100$; $1000$ hoặc nhân với $0{,}1$; $0{,}01$; $0{,}001$; công cụ: dịch dấu phẩy sang phải (nhân $10$; $100$;...) hoặc sang trái (nhân $0{,}1$; $0{,}01$;...), không đặt tính.

**1. Nhân số thập phân với 10; 100; 1000;.....**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1a1b1631-f6da-44e5-8373-893f83cb5547.png)
**Nhận xét:** Nếu chuyển dấu phẩy của số 27,86 sang bên phải một chữ số thì ta được 278,6.
**Kết luận:** Muốn nhân một số thập phân với 10; 100; 1 000;... ta chuyển dấu phẩy của số đó lần lượt sang bên phải một; hai; ba;... chữ số.
**2. Nhân số thập phân với 0,1; 0,01; 0,001;....**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d47d8ff4-1d62-47b5-a0fb-40403e15f5ac.png)
Nhận xét: Nếu chuyển dấu phẩy của số 79,6 sang bên trái hai chữ số thì ta được 0,796.
**Kết luận: ** Muốn nhân một số thập phân với 0,1; 0,01; 0,001;... ta chuyển dấu phẩy của số đó lần lượt sang bên trái một; hai; ba;... chữ số.

### NDB02114 — Chia số thập phân với số 10; 100; 1000; ..... hoặc 0,1; 0,01; 0,001;.....
**Mô tả:** Đề yêu cầu tính nhẩm số thập phân chia cho $10$; $100$; $1000$ hoặc chia cho $0{,}1$; $0{,}01$; $0{,}001$; công cụ: dịch dấu phẩy sang trái (chia $10$; $100$;...) hoặc sang phải (chia $0{,}1$; $0{,}01$;...), không đặt tính.

**1. Chia số thập phân với 10; 100; 1000;....**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/7ce150e7-c7db-4e01-8652-3f491e59600d.png)
Nhận xét: Nếu chuyển dấu phẩy của số $534,28$ sang bên trái hai chữ số thì ta được $5,3428$.
**Kết luận: **Muốn chia một số thập phân cho $10$; $100$; $1000$;... ta chuyển dấu phẩy của số đó lần lượt sang bên trái một; hai; ba;... chữ số.
**2. Chia số thập phân với 0,1; 0,01; 0,001; .....**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9faba795-db9f-4ed4-9394-a5e69d2cc0ef.jpg)
Nhận xét: Nếu chuyển dấu phẩy của số $534,28$ sang bên phải một chữ số thì ta được $5342,8$.
**Kết luận: **Muốn chia một số thập phân cho 0,1; 0,01; 0,001;... ta chuyển dấu phẩy của số đó lần lượt sang bên phải một; hai; ba;... chữ số.


## Chủ đề 4. Các phép tính với số thập phân › Các phép tính với số thập phân › Bài 24. Luyện tập chung

### NDB02110 — Tính biểu thức hỗn hợp số thập phân
**Mô tả:** Đề cho biểu thức có từ hai phép tính trở lên với số thập phân (cộng, trừ, nhân, chia, có thể có dấu ngoặc) và yêu cầu tính giá trị; công cụ: thứ tự thực hiện phép tính. Khác dạng tính thuận tiện ở chỗ cứ tính theo thứ tự, không cần biến đổi khéo.

##PP Tính giá trị biểu thức số thập phân
Xác định thứ tự: tính trong ngoặc trước, rồi nhân chia từ trái sang phải, cuối cùng cộng trừ từ trái sang phải.
Chép lại biểu thức, mỗi dòng chỉ thực hiện một nhóm phép tính và chép lại phần chưa tính.
Phép nhân, chia với $10$; $100$;... hoặc $0{,}1$; $0{,}01$;... thì dịch dấu phẩy thay cho đặt tính.
Kiểm tra lại kết quả từng dòng bằng phép tính ngược.

##CY
Cộng trừ trước nhân chia vì đứng bên trái.
Làm xong một bước lại bỏ sót phần chưa tính khi chép sang dòng sau.
Quên viết dấu phẩy ở thương hoặc đặt sai chỗ.

### NDB02111 — Tính thuận tiện với biểu thức số thập phân
**Mô tả:** Đề ghi "tính bằng cách thuận tiện" với biểu thức chỉ gồm số thập phân và số tự nhiên; cần nhận ra các cặp số cho tích tròn (như $2{,}5 \times 4$; $0{,}25 \times 4$; $1{,}25 \times 8$) hoặc thừa số chung để nhóm lại. Khác dạng sau ở chỗ không có hỗn số, phân số, phần trăm.

Ví dụ: Tính bằng cách thuận tiện nhất: 
36,5 × 28 + 3,65 × 320 + 73 × 20.
Lời giải.
36,5 × 28 + 3,65 × 320 + 73 × 20
= 36,5 × 28 + 3,65 × 10 × 32 + 36,5 × 2 × 20
= 36,5 × 28 + 36,5 × 32 + 36,5 × 40
= 36,5 × (28 + 32 + 40)
= 36,5 × 100

### NDB02112 — Tính thuận tiện biểu thức hỗn hợp số thập phân và hỗn số (nâng cao)
**Mô tả:** Đề ghi "tính bằng cách thuận tiện" với biểu thức trộn hỗn số, phân số, phần trăm và số thập phân; cần đổi tất cả về số thập phân rồi nhóm các số tạo thành số tròn. Khác dạng tính thuận tiện số thập phân ở bước đổi hỗn số, phần trăm ra số thập phân.

**Đề. Tính bằng cách thuận tiện nhất.**
$$8\dfrac{1}{8} + 5\dfrac{1}{4} - 225\% + 1,875$$
**Lời giải.**
$$8\dfrac{1}{8} + 5\dfrac{1}{4} - 225\% + 1,875$$
$$= 8,125 + 5,25 - 2,25 + 1,875$$
$$= (8,125 + 1,875) + (5,25 - 2,25)$$
$$= 10 + 3$$
$$= 13$$

### NDB02115 — 1 số bài toán lời văn liên quan số thập phân
**Mô tả:** Bài toán lời văn có số liệu là số thập phân (độ dài, khối lượng, tiền, chu vi, diện tích, tìm một số chưa biết,...), giải bằng một hoặc nhiều bước tính cộng, trừ, nhân, chia; công cụ: tóm tắt đề, chọn phép tính cho từng bước. Khác các dạng tính ở chỗ phải tự lập phép tính từ đề và ghi lời giải, đơn vị.

##PP Giải bài toán lời văn có số thập phân
Đọc đề, xác định cái đã cho và cái phải tìm, đổi các số đo về cùng một đơn vị nếu cần.
Chọn phép tính cho từng bước: gấp lên nhiều lần hoặc nhiều phần bằng nhau thì nhân, chia đều thì chia, hơn kém thì cộng trừ.
Mỗi bước viết một câu lời giải, một phép tính và đơn vị trong ngoặc.
Kết thúc bằng đáp số và kiểm tra kết quả có hợp lý (không âm, đúng đơn vị).

##CY
Tính khi các số đo chưa cùng đơn vị (m với cm, kg với g).
Chu vi hình chữ nhật: cộng chiều dài với chiều rộng rồi quên nhân $2$.
Viết sai đơn vị diện tích (viết m thay vì m$^2$).


## Chủ đề 5. Một số hình phẳng › Một số hình phẳng › Bài 25. Hình tam giác. Diện tích hình tam giác

### NDB02146 — Nhận diện các loại tam giác, Xác định đường cao hình tam giác
**Mô tả:** Đề hỏi gọi tên các cạnh, đỉnh, góc của tam giác, phân loại tam giác theo góc (nhọn, vuông, tù), chỉ ra hoặc VẼ đường cao ứng với một cạnh đáy cho trước (kể cả trên lưới ô vuông, kể cả đường cao nằm ngoài tam giác tù); công cụ: so góc với góc vuông, ê ke, đường cao vuông góc với đáy. Khác dạng diện tích tam giác ở chỗ chưa tính toán.

**1. Hình tam giác**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/2737d464-1c4c-42cc-8fda-5ba7607d0194.png)
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/6b652869-11a9-4696-bc37-b42c0513beec.png)
**2. Đáy và đường cao của hình tam giác**
![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/7e1c33af-83d3-4eec-80d0-6514418ae15d.png)

### NDB02147 — Diện tích hình tam giác
**Mô tả:** Đề cho độ dài đáy và chiều cao tương ứng của hình tam giác (có thể khác đơn vị, hoặc là tam giác vuông với hai cạnh góc vuông) và yêu cầu tính diện tích; công cụ: $S = a \times h : 2$. Khác dạng nhận diện tam giác ở chỗ phải tính ra số đo diện tích.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d53accf7-a71d-4de9-b20c-ad9543c38520.png)

### NDB02675 — Tìm đáy hoặc chiều cao khi biết diện tích tam giác
**Mô tả:** Đề cho diện tích hình tam giác và một trong hai yếu tố (độ dài đáy hoặc chiều cao tương ứng), yêu cầu tìm yếu tố còn lại; công cụ: đáy = diện tích nhân 2 rồi chia cho chiều cao, chiều cao = diện tích nhân 2 rồi chia cho đáy. Khác dạng diện tích hình tam giác ở chỗ diện tích đã biết, phải tính ngược.

##PP Tìm đáy hoặc chiều cao khi biết diện tích tam giác
Từ công thức $S = a \times h : 2$ suy ra:
Độ dài đáy bằng diện tích nhân 2 rồi chia cho chiều cao: $a = S \times 2 : h$.
Chiều cao bằng diện tích nhân 2 rồi chia cho độ dài đáy: $h = S \times 2 : a$.
Đổi diện tích và độ dài đã biết về cùng một hệ đơn vị trước khi tính.
Bài kéo dài đáy làm diện tích tăng thêm: phần tăng thêm là một tam giác có đáy bằng đoạn kéo dài và cùng chiều cao, từ đó tìm chiều cao.

##CY
Quên nhân diện tích với 2 trước khi chia.
Diện tích tính bằng $\text{m}^2$ mà độ dài đáy tính bằng dm, không đổi đơn vị trước.


## Chủ đề 5. Một số hình phẳng › Một số hình phẳng › Bài 26. Hình thang. Diện tích hình thang

### NDB02148 — Nhận diện hình thang, xác định đường cao hình thang
**Mô tả:** Đề hỏi nhận ra hình thang trong các hình đã cho, VẼ hình thang theo yêu cầu (vd trên lưới ô vuông, cho trước hai đáy), hoặc chỉ ra đường cao, đáy của hình thang (kể cả hình thang vuông); dấu hiệu: tứ giác có đúng một cặp cạnh đối song song, chiều cao vuông góc với hai đáy. Khác dạng diện tích hình thang ở chỗ chưa tính toán.

##PP Nhận biết hình thang và đường cao
Tìm trong tứ giác cặp cạnh đối diện song song; có cặp đó thì là hình thang, hai cạnh ấy là hai đáy.
Đường cao là đoạn thẳng nối hai đáy và vuông góc với cả hai đáy.
Hình thang vuông có một cạnh bên vuông góc với hai đáy, cạnh bên đó chính là chiều cao.

##CY
Cạnh bên (không vuông góc với đáy) không phải chiều cao.
Hai cạnh trông như song song chưa chắc song song; phải dựa vào dữ kiện của đề.

### NDB02149 — Diện tích hình thang
**Mô tả:** Đề cho độ dài hai đáy và chiều cao của hình thang (có thể khác đơn vị, hoặc số thập phân) và yêu cầu tính diện tích; công cụ: $S = (a + b) \times h : 2$. Khác dạng nhận diện hình thang ở chỗ phải tính ra số đo diện tích.

##PP Tính diện tích hình thang
Đổi các độ dài về cùng một đơn vị đo.
Tính tổng độ dài hai đáy.
Lấy tổng đó nhân với chiều cao rồi chia cho 2.
Viết đơn vị diện tích (cm², dm², m²...).

##CY
Quên chia cho 2 ở cuối.
Chỉ lấy một đáy thay vì cộng cả hai đáy.
Chiều cao khác đơn vị với hai đáy mà không đổi trước khi tính.

### NDB02796 — Tìm đáy hoặc chiều cao khi biết diện tích hình thang
**Mô tả:** Đề cho diện tích hình thang và các yếu tố còn lại (hai đáy hoặc tổng hai đáy, hoặc chiều cao và một đáy), yêu cầu tìm chiều cao, tổng hai đáy hoặc một đáy; công cụ: chiều cao = diện tích nhân 2 rồi chia cho tổng hai đáy, tổng hai đáy = diện tích nhân 2 rồi chia cho chiều cao, một đáy = tổng hai đáy trừ đáy kia. Khác dạng diện tích hình thang ở chỗ diện tích đã biết, phải tính ngược.

##PP Tìm đáy hoặc chiều cao khi biết diện tích hình thang
Từ công thức $S = (a + b) \times h : 2$ suy ra:
Chiều cao bằng diện tích nhân 2 rồi chia cho tổng hai đáy: $h = S \times 2 : (a + b)$.
Tổng hai đáy bằng diện tích nhân 2 rồi chia cho chiều cao: $a + b = S \times 2 : h$.
Biết tổng hai đáy và một đáy thì lấy tổng trừ đáy đã biết; biết tổng và hiệu hai đáy thì dùng cách tìm hai số khi biết tổng và hiệu.
Bài kéo dài đáy làm diện tích tăng thêm: phần tăng thêm là một tam giác có đáy bằng đoạn kéo dài và cùng chiều cao với hình thang, từ đó tìm chiều cao.

##CY
Quên nhân diện tích với 2 trước khi chia.
Chia cho một đáy thay vì chia cho tổng hai đáy.


## Chủ đề 5. Một số hình phẳng › Một số hình phẳng › Bài 27. Đường tròn. Chu vi và diện tích hình tròn

### NDB02150 — Vẽ đường tròn
**Mô tả:** Đề yêu cầu vẽ đường tròn với tâm và bán kính hoặc đường kính cho trước (có thể cho bằng mm hay cm), hoặc xác định tâm, bán kính, đường kính của hình tròn đã vẽ; công cụ: com pa. Khác dạng chu vi, diện tích hình tròn ở chỗ không tính chu vi hay diện tích.

##PP Vẽ đường tròn bằng com pa
Xác định bán kính cần vẽ (nếu đề cho đường kính thì lấy đường kính chia 2).
Dùng thước mở com pa một khoảng đúng bằng bán kính.
Đặt đầu kim tại tâm, giữ cố định rồi quay đầu bút chì một vòng.

##CY
Mở com pa bằng đường kính thay vì bán kính.
Quên đổi đơn vị khi đề cho mm mà thước đọc cm.

### NDB02151 — Chu vi, diện tích hình tròn
**Mô tả:** Đề cho bán kính hoặc đường kính của hình tròn (vật tròn như đĩa, bàn, miệng giếng) và yêu cầu tính chu vi hoặc diện tích; công cụ: $C = d \times 3{,}14$, $S = r \times r \times 3{,}14$, phép nhân số thập phân. Cần phân biệt bán kính với đường kính trước khi tính.

##PP Tính chu vi, diện tích hình tròn
Xác định đề cho bán kính hay đường kính; đổi qua lại bằng $d = r \times 2$ nếu cần.
Tính chu vi bằng đường kính nhân $3{,}14$.
Tính diện tích bằng bán kính nhân bán kính rồi nhân $3{,}14$.
Viết đơn vị: chu vi là độ dài (cm, m), diện tích là cm², m².

##CY
Dùng đường kính thay cho bán kính khi tính diện tích.
Quên nhân bán kính hai lần: viết $r \times 3{,}14$ cho diện tích.
Nhầm đơn vị: chu vi là độ dài, không có số mũ.

### NDB02797 — Tìm bán kính, đường kính khi biết chu vi hoặc diện tích hình tròn
**Mô tả:** Đề cho chu vi (hoặc diện tích) của hình tròn, vật tròn, yêu cầu tìm đường kính, bán kính, hoặc tìm tiếp diện tích khi biết chu vi; công cụ: đường kính = chu vi chia cho 3,14, bán kính = đường kính chia 2; biết diện tích thì tìm số nhân với chính nó bằng diện tích chia 3,14. Khác dạng chu vi, diện tích hình tròn ở chỗ phải tính ngược từ chu vi hoặc diện tích.

##PP Tìm bán kính, đường kính khi biết chu vi hoặc diện tích hình tròn
Từ công thức $C = d \times 3{,}14$ suy ra: đường kính bằng chu vi chia cho $3{,}14$; bán kính bằng đường kính chia cho 2.
Biết chu vi, muốn tính diện tích thì tìm bán kính trước rồi dùng $S = r \times r \times 3{,}14$.
Biết diện tích thì lấy diện tích chia cho $3{,}14$ được $r \times r$, rồi tìm số nhân với chính nó bằng kết quả đó.

##CY
Lấy chu vi chia $3{,}14$ rồi coi luôn là bán kính (quên chia 2).
Lấy chu vi chia 2 rồi chia $3{,}14$ để ra đường kính.


## Chủ đề 5. Một số hình phẳng › Một số hình phẳng › Bài 28. Thực hành và trải nghiệm đo, vẽ, lắp ghép, tạo hình

### NDB02152 — Tính diện tích các hình kì dị bằng phương pháp chia hình
**Mô tả:** Đề cho một hình ghép hoặc hình có phần bị khoét (mảnh đất nhiều cạnh, hình vuông khoét hình tròn, hình thang bỏ đi một tam giác...) và hỏi diện tích; công cụ: chia hình thành các hình quen thuộc (chữ nhật, tam giác, thang, tròn) rồi cộng hoặc lấy hình lớn trừ phần bị bỏ. Khác các dạng trên ở chỗ phải tự nghĩ cách chia hình hoặc ghép các hình KHÁC LOẠI. Hình gồm nhiều hình giống hệt nhau đã chia sẵn (vd mặt bàn ghép từ 6 hình thang bằng nhau) hoặc bản thân hình đã là hình thang, tam giác chỉ cần tìm thêm một cạnh thì vẫn thuộc dạng diện tích của hình đó.

##PP Tính diện tích hình ghép bằng cách chia hình
Quan sát hình, chia thành các hình đã biết công thức hoặc nhận ra hình lớn bị khoét bớt một phần.
Tìm các độ dài còn thiếu từ dữ kiện của đề (hai cạnh đối của hình chữ nhật bằng nhau...).
Tính diện tích từng hình nhỏ.
Cộng các diện tích (hình ghép) hoặc lấy diện tích hình lớn trừ phần bị bỏ (hình khoét).

##CY
Chia hình rồi quên tính một phần nên thiếu diện tích.
Dùng nhầm chiều cao (lấy cạnh bên thay cho đường cao).
Đề cho hình tròn nội tiếp hình vuông: bán kính bằng nửa cạnh hình vuông.

### NDB02676 — Nhận biết, đếm hình trong hình ghép; lắp ghép hình
**Mô tả:** Đề cho một bức tranh hoặc hình ghép từ nhiều miếng (tam giác, hình tròn, hình thang, hình chữ nhật...) và hỏi đếm số hình của một loại, hình nào có dùng miếng ghép loại đó, hoặc từ các miếng cho trước ghép được hình nào; công cụ: quan sát hình dạng và kích thước từng miếng, đếm theo từng nhóm để không sót, không lặp. Khác dạng góc, đường thẳng, hình thoi, hình bình hành ở chỗ đối tượng là các miếng ghép nhiều loại, không chỉ góc và cạnh.




## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 36. Tỉ số. Tỉ số phần trăm

### NDB02116 — Tỉ số của 2 đại lượng
**Mô tả:** Đề cho hai số hoặc hai đại lượng cùng loại (có khi khác đơn vị đo) và hỏi tỉ số của chúng; công cụ: viết thương $a : b$ thành phân số $\dfrac{a}{b}$, rút gọn nếu có thể.

##PP Lập tỉ số của hai đại lượng
Xác định số thứ nhất và số thứ hai: "tỉ số của A và B" thì A là số thứ nhất (tử số), B là số thứ hai (mẫu số).
Đổi hai đại lượng về cùng một đơn vị nếu chúng khác đơn vị.
Viết $a : b$ rồi viết thành phân số $\dfrac{a}{b}$, rút gọn đến tối giản.

##CY
Viết ngược thứ tự: hỏi tỉ số của A và B mà lại lấy B chia cho A.
Quên đổi về cùng đơn vị (vd $3$ m và $60$ cm).
Viết kèm đơn vị vào tỉ số.

### NDB02118 — Viết tỉ số thành tỉ số phần trăm
**Mô tả:** SGK Bài 36. Đề cho tỉ số có mẫu số 100 hoặc đưa được về mẫu số 100 bằng cách nhân (phân số, số thập phân), hoặc tình huống «trong 100 … có a …», yêu cầu viết, đọc tỉ số phần trăm hoặc nêu ý nghĩa của a%; công cụ: a phần 100 viết là a%. Đề cho hai số bất kì phải chia rồi nhân 100 thì sang dạng Tính tỉ số phần trăm của 2 đại lượng (Bài 40).

##PP Viết tỉ số thành tỉ số phần trăm
Phân số: đổi về phân số có mẫu số $100$ nếu được; nếu không thì chia tử cho mẫu rồi nhân thương với $100$.
Số thập phân: nhân với $100$ (dịch dấu phẩy sang phải hai chữ số).
Dạng $a : b$: viết thành phân số $\dfrac{a}{b}$ rồi làm như trên.
Viết thêm $\%$ vào bên phải.

##CY
Dịch dấu phẩy sai: $0{,}5 = 50\%$ chứ không phải $5\%$.
Số lớn hơn $1$ thì tỉ số phần trăm lớn hơn $100\%$ (vd $2 = 200\%$).


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 37. Tỉ lệ bản đồ và ứng dụng

### NDB02122 — Tìm độ dài trên bản đồ khi biết độ dài thật và tỉ lệ bản đồ
**Mô tả:** Đề cho tỉ lệ bản đồ và độ dài thật, hỏi độ dài tương ứng trên bản đồ (số bé hơn); công cụ: đổi độ dài thật ra cm rồi chia cho $n$.

##PP Tìm độ dài trên bản đồ
Đổi độ dài thật ra xăng-ti-mét.
Lấy độ dài thật chia cho $n$ (số thứ hai của tỉ lệ $1 : n$).
Viết kết quả kèm đơn vị cm.

##CY
Nhân thay vì chia: độ dài trên bản đồ luôn bé hơn độ dài thật.
Quên đổi đơn vị (vd $1$ km là $100000$ cm chứ không phải $1000$ cm).

### NDB02123 — Tìm độ dài thật khi biết tỉ lệ bản đồ và độ dài trên bản đồ
**Mô tả:** Đề cho tỉ lệ bản đồ và độ dài đo trên bản đồ, hỏi độ dài thật (số lớn hơn), thường phải đổi sang m hoặc km; công cụ: nhân với $n$.

##PP Tìm độ dài thật
Lấy độ dài trên bản đồ (cm) nhân với $n$ (số thứ hai của tỉ lệ $1 : n$), được độ dài thật tính bằng cm.
Đổi kết quả sang đơn vị đề yêu cầu (m, km).

##CY
Chia thay vì nhân.
Quên đổi từ cm sang m, km nên đáp số quá lớn; $100$ cm $= 1$ m, $100000$ cm $= 1$ km.


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 38. Tìm hai số khi biết tổng và tỉ số của hai số đó

### NDB01854 — Bài toán tổng tỉ 2 đại lượng
**Mô tả:** Đề cho trực tiếp tổng của hai đại lượng và tỉ số của chúng (dạng "gấp mấy lần" hoặc "bằng một phân số"); yêu cầu tìm từng đại lượng. Đây là dạng cơ bản nhất, các dạng anh em chỉ khác ở chỗ tổng không được cho thẳng.

##PP Tổng – tỉ hai đại lượng
Vẽ sơ đồ: đại lượng bé là một số phần bằng nhau, đại lượng lớn là số phần tương ứng với tỉ số.
Cộng số phần của hai đại lượng để được tổng số phần.
Lấy tổng chia cho tổng số phần để tìm giá trị một phần.
Nhân giá trị một phần với số phần của từng đại lượng.
Thử lại bằng cách cộng hai kết quả.

##CY
Đề cho tỉ số theo thứ tự nào thì xếp số phần theo đúng thứ tự đó: "A bằng $\dfrac{3}{5}$ B" thì A có $3$ phần, B có $5$ phần, không được xếp ngược.
Tỉ số cho bằng phần trăm thì đổi ra phân số trước ($25\% = \dfrac{1}{4}$) rồi mới chia số phần.

### NDB01855 — Bài toán tổng tỉ ẩn tổng qua chu vi của hình chữ nhật (nâng cao)
**Mô tả:** Cho chu vi và tỉ số 2 cạnh

##PP Tổng ẩn qua chu vi hình chữ nhật
Nửa chu vi chính là tổng chiều dài và chiều rộng: lấy chu vi chia cho $2$.
Vẽ sơ đồ chiều dài, chiều rộng theo tỉ số, tìm tổng số phần.
Lấy nửa chu vi chia cho tổng số phần để tìm giá trị một phần.
Tính chiều dài, chiều rộng rồi làm tiếp yêu cầu còn lại (diện tích nếu đề hỏi).

##CY
Dùng nguyên chu vi làm tổng mà quên chia $2$ là lỗi hay gặp nhất.
Đề hỏi diện tích thì sau khi tìm hai cạnh còn phải nhân chiều dài với chiều rộng, đơn vị là đơn vị diện tích.

### NDB01856 — Bài toán tổng tỉ ẩn tổng bằng trung bình cộng (nâng cao)
**Mô tả:** Cho trung bình cộng và tỉ số của 2 số

##PP Tổng ẩn qua trung bình cộng
Tìm tổng hai số: trung bình cộng nhân với $2$.
Vẽ sơ đồ theo tỉ số, tìm tổng số phần bằng nhau.
Lấy tổng chia cho tổng số phần để được giá trị một phần.
Nhân giá trị một phần với số phần của từng số.

##CY
Lấy luôn trung bình cộng làm tổng rồi chia số phần là sai, vì tổng hai số gấp đôi trung bình cộng.
Trung bình cộng của hai số nằm giữa hai số đó, dùng để thử lại kết quả.

### NDB01857 — Bài toán tổng tỉ ẩn tổng qua số tuổi (nâng cao)
**Mô tả:** Đề cho tổng số tuổi của hai người ở một thời điểm khác hiện nay (sau hoặc trước vài năm) và tỉ số tuổi hiện nay; phải đưa tổng về thời điểm hiện nay (cộng hoặc trừ số năm của cả hai người) rồi mới chia theo tỉ số.

##PP Tổng ẩn qua số tuổi
Xác định thời điểm của tổng đề cho: sau $n$ năm nữa hay cách đây $n$ năm.
Đưa tổng về hiện nay: hai người cùng thay đổi $n$ tuổi nên tổng thay đổi $n \times 2$ tuổi (sau $n$ năm thì trừ đi, cách đây $n$ năm thì cộng thêm).
Vẽ sơ đồ theo tỉ số tuổi hiện nay, chia tổng hiện nay theo số phần.
Kết luận tuổi hiện nay, nếu đề hỏi thời điểm khác thì cộng hoặc trừ số năm.

##CY
Chỉ cộng hoặc trừ số năm một lần mà quên rằng có hai người, nên tổng thay đổi gấp đôi số năm.
Tỉ số tuổi đề cho là ở thời điểm nào thì chia tổng ở đúng thời điểm đó, không trộn lẫn.

### NDB01858 — Bài toán tổng tỉ ẩn tỉ - miêu tả tỉ lệ 2 số (nâng cao)
**Mô tả:** Ví dụ cho 5 lần A bằng 4 lần B

##PP Tổng tỉ, tỉ số được mô tả
Đặt hai vế bằng nhau cùng bằng một giá trị chung, coi giá trị chung đó là một số phần bằng nhau.
Từ đó suy ra số phần của mỗi số: số lần lớn thì số phần ít, số lần nhỏ thì số phần nhiều.
Viết lại tỉ số rõ ràng rồi giải như bài tổng – tỉ thông thường.
Thử lại bằng cách nhân từng số với số lần đề cho, hai kết quả phải bằng nhau.

##CY
"5 lần số thứ nhất bằng 4 lần số thứ hai" thì số thứ nhất BÉ hơn (có $4$ phần), số thứ hai LỚN hơn (có $5$ phần). Rất dễ viết ngược.
"$\dfrac{1}{3}$ số thứ nhất bằng $\dfrac{1}{5}$ số thứ hai" thì số thứ nhất có $3$ phần, số thứ hai có $5$ phần.

### NDB02125 — Bài toán tổng tỉ 3 đại lượng (nâng cao)
**Mô tả:** Đề cho tổng của ba đại lượng và quan hệ tỉ số giữa chúng (cùng so với một đại lượng, hoặc nối tiếp từng cặp); yêu cầu tìm cả ba. Khác tổng tỉ hai đại lượng ở chỗ phải gom ba đại lượng vào cùng một sơ đồ.

##PP Tổng tỉ ba đại lượng
Chọn đại lượng "chung" xuất hiện ở các tỉ số, lấy nó làm mốc.
Biểu diễn cả ba đại lượng bằng số phần bằng nhau trên cùng một sơ đồ.
Hai tỉ số nối tiếp mà đại lượng chung có số phần khác nhau thì đưa số phần của nó về cùng một số rồi nhân các số phần còn lại tương ứng.
Cộng số phần của ba đại lượng, chia tổng cho tổng số phần rồi nhân lại từng đại lượng.

##CY
Đại lượng chung phải có CÙNG số phần ở hai tỉ số thì mới ghép sơ đồ được; chưa bằng nhau thì phải đưa về bằng nhau trước.
Cộng đủ số phần của cả ba đại lượng, không bỏ sót đại lượng mốc.


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 39. Tìm hai số khi biết hiệu và tỉ số của hai số đó

### NDB02126 — Tìm hai số khi biết hiệu và tỉ số của hai số đó
**Mô tả:** Đề cho trực tiếp hiệu của hai đại lượng ("hơn", "kém" bao nhiêu) và tỉ số của chúng; yêu cầu tìm từng đại lượng. Khác dạng tổng tỉ ở chỗ chia hiệu cho hiệu số phần chứ không chia tổng cho tổng số phần.

##PP Hiệu – tỉ cơ bản
Vẽ sơ đồ: số bé là một số phần, số lớn là số phần tương ứng với tỉ số, phần dư ra là hiệu.
Tính hiệu số phần bằng nhau bằng cách lấy số phần số lớn trừ số phần số bé.
Lấy hiệu chia cho hiệu số phần để tìm giá trị một phần.
Nhân giá trị một phần với số phần của từng số rồi thử lại bằng phép trừ.

##CY
Nhầm sang cộng số phần (làm kiểu tổng tỉ) là lỗi hay gặp: bài hiệu – tỉ phải TRỪ số phần.
Đề cho "số bé bằng $\dfrac{4}{9}$ số lớn" thì số bé $4$ phần, số lớn $9$ phần, hiệu số phần là $9 - 4 = 5$.

### NDB02127 — Bài toán hiệu tỉ ẩn hiệu (nâng cao)
**Mô tả:** Đề không cho hiệu thẳng mà phải tự tìm hiệu từ dữ kiện khác (hiệu số tuổi không đổi, thêm vào hoặc bớt đi để hai số bằng nhau...) rồi mới giải bằng hiệu – tỉ.

##PP Hiệu – tỉ có hiệu ẩn
Tìm hiệu từ dữ kiện đề cho: hiệu số tuổi của hai người không đổi theo thời gian; thêm vào số bé bao nhiêu để hai số bằng nhau thì hiệu bấy nhiêu.
Vẽ sơ đồ theo tỉ số rồi tính hiệu số phần bằng nhau.
Lấy hiệu vừa tìm chia cho hiệu số phần để được giá trị một phần.
Tính từng số rồi thử lại với dữ kiện ban đầu.

##CY
Hiệu số tuổi không đổi, còn tỉ số tuổi thì thay đổi theo thời gian, nên phải dùng tỉ số đúng thời điểm đề nói.
Khi thêm vào hay bớt đi ở một số, hiệu thay đổi; chỉ khi cả hai số cùng thay đổi một lượng bằng nhau thì hiệu mới giữ nguyên.


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 40. Tìm tỉ số phần trăm của hai số

### NDB02117 — Tính tỉ số phần trăm của 2 đại lượng
**Mô tả:** SGK Bài 40. Đề cho hai số hoặc hai đại lượng cùng loại (số sau không phải 100) và hỏi số thứ nhất bằng (chiếm) bao nhiêu phần trăm số thứ hai, kể cả bài thực tế (muối trong nước biển, thực hiện / vượt kế hoạch); công cụ: chia số thứ nhất cho số thứ hai, nhân thương với 100 rồi viết thêm %. Tình huống «trong 100 … có a …» thuộc dạng Viết tỉ số thành tỉ số phần trăm (Bài 36).

##PP Tìm tỉ số phần trăm của hai đại lượng
Xác định số được so sánh (thường đứng trước "chiếm", "so với", "của") và số làm chuẩn (số đứng sau "so với", "của").
Chia số được so sánh cho số làm chuẩn, tính thương dưới dạng số thập phân.
Nhân thương với $100$ (dịch dấu phẩy sang phải hai chữ số) và viết thêm $\%$.

##CY
Lấy nhầm số làm chuẩn: "A bằng bao nhiêu phần trăm của B" thì chia A cho B.
Quên viết $\%$ ở kết quả.
Số được so sánh lớn hơn số làm chuẩn thì kết quả lớn hơn $100\%$, đó là bình thường.

### NDB02121 — Các phép toán với tỉ số phần trăm (nâng cao)
**Mô tả:** Đề có các phép cộng, trừ, nhân, chia trực tiếp giữa các tỉ số phần trăm hoặc giữa tỉ số phần trăm và số tự nhiên; công cụ: tính phần số rồi giữ kí hiệu $\%$; nhân (chia) hai tỉ số phần trăm thì đổi sang số thập phân.

##PP Tính với các tỉ số phần trăm
Cộng, trừ: tính phần số của các tỉ số rồi viết $\%$ vào kết quả.
Nhân hoặc chia với số tự nhiên: nhân (chia) phần số rồi viết $\%$.
Nhân hai tỉ số phần trăm: đổi mỗi số ra số thập phân, nhân, rồi đổi kết quả về phần trăm.

##CY
Nhân hai tỉ số phần trăm như hai số thường: $20\% \times 30\%$ không bằng $600\%$ mà bằng $0{,}2 \times 0{,}3 = 0{,}06 = 6\%$.
Chia hai tỉ số phần trăm cho kết quả là một số lần, không viết $\%$: $50\% : 20\% = 0{,}5 : 0{,}2 = 2{,}5$.


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 41. Tìm giá trị phần trăm của một số

### NDB02119 — Tìm phần trăm của 1 số
**Mô tả:** Đề cho một số (toàn thể) và một tỉ số phần trăm, hỏi giá trị phần trăm đó là bao nhiêu (số học sinh nữ, tiền lãi, tiền giảm giá…); công cụ: $M \times a\%$. Khác dạng sau ở chỗ biết toàn thể, tìm phần.

##PP Tìm phần trăm của một số
Xác định số toàn thể $M$ (đại lượng làm chuẩn) và tỉ số phần trăm $a\%$.
Tính $M \times a\%$, tức là $M \times a : 100$.
Bài giảm giá, tăng giá: tính tiền giảm (tăng) trước rồi trừ (cộng) với giá ban đầu nếu đề hỏi giá mới.

##CY
Nhầm với dạng tìm một số biết phần trăm của nó (nhân thay vì chia, hoặc ngược lại).
Đề hỏi giá sau khi giảm mà chỉ tính tiền giảm, quên trừ.


## Chủ đề 7. Tỉ số và các bài toán liên quan › Tỉ số và các bài toán liên quan › Bài 42–43. Máy tính cầm tay. Thực hành và trải nghiệm sử dụng máy tính cầm tay

### NDB03053 — Sử dụng máy tính cầm tay
**Mô tả:** Đề yêu cầu dùng máy tính cầm tay: nhận biết và nối các phím với phép tính, thực hiện phép tính cộng/trừ/nhân/chia rồi kiểm tra kết quả bằng máy, tính tỉ số phần trăm của hai số và giá trị phần trăm của một số bằng phím %.

##ĐN **Máy tính cầm tay** giúp thực hiện các phép tính nhanh hơn.
**Các phím cơ bản:**
- Phím ON/C: bật máy.
- Phím OFF: tắt máy.
- Các phím số từ 0 đến 9: dùng để nhập số.
- Các phím + , − , × , ÷ : các phép tính cộng, trừ, nhân, chia.
- Phím = : hiện kết quả phép tính trên màn hình.
- Phím CE: xoá số vừa nhập nếu nhập sai.
- Phím % : biểu diễn tỉ số phần trăm.
##PP **Cách thực hiện một phép tính bằng máy tính cầm tay:**
- Ấn phím ON/C để bật máy.
- Nhập lần lượt các phím theo phép tính, cuối cùng ấn phím = để xem kết quả.
- Ví dụ: để tính 128 + 136, ấn lần lượt các phím 1 2 8 + 1 3 6 = ; màn hình hiện 264.
##CY Máy tính thực hiện các phép tính theo đúng thứ tự em bấm. Vì vậy với biểu thức có cả nhân (chia) lẫn cộng (trừ) như 5 + 2 × 3, nếu bấm lần lượt 5 + 2 × 3 = thì máy cho 21, trong khi giá trị đúng của biểu thức là 11 (phải nhân trước, cộng sau). Cần xác định thứ tự thực hiện phép tính rồi bấm cho phù hợp.


## Chủ đề 8. Thể tích. Đơn vị đo thể tích › Thể tích. Đơn vị đo thể tích › Bài 45. Thể tích của một hình

### NDB02791 — Thể tích của một hình (đếm hình lập phương đơn vị)
**Mô tả:** Đề cho hình ghép từ các hình lập phương nhỏ cạnh 1 cm (thể tích $1\,cm^3$) và hỏi thể tích của hình, hoặc so sánh thể tích các hình; công cụ: đếm số hình lập phương nhỏ theo từng tầng hoặc từng lớp. Chưa dùng công thức tính thể tích.

##PP Tính thể tích bằng cách đếm hình lập phương đơn vị
Mỗi hình lập phương nhỏ cạnh $1\text{ cm}$ có thể tích $1\text{ cm}^3$.
Đếm số hình lập phương nhỏ theo từng tầng (số hình mỗi tầng nhân số tầng) hoặc theo từng lớp rồi cộng lại.
Hai hình gồm cùng số hình lập phương nhỏ như nhau thì có thể tích bằng nhau.

##CY
Bỏ sót các hình lập phương nhỏ bị che ở phía sau hoặc phía dưới.


## Chủ đề 8. Thể tích. Đơn vị đo thể tích › Thể tích. Đơn vị đo thể tích › Bài 46. Xăng-ti-mét khối. Đề-xi-mét khối

### NDB02792 — Xăng-ti-mét khối. Đề-xi-mét khối
**Mô tả:** Bài 46 SGK. Đề chỉ dùng hai đơn vị $cm^3$ và $dm^3$ (có thể kèm lít, $1~l=1~dm^3$): đọc, viết số đo; đổi giữa $cm^3$ và $dm^3$ (số đo một hay hai đơn vị đều được); so sánh, sắp xếp các số đo. Công cụ: $1~dm^3=1000~cm^3$. Đề có $m^3$ thì sang dạng Mét khối; đề tính cộng, trừ, nhân, chia số đo hoặc ước lượng thì sang dạng Ước lượng và bài toán thực tế.

##ĐN Xăng-ti-mét khối. Đề-xi-mét khối
Xăng-ti-mét khối là thể tích của hình lập phương có cạnh dài $1\text{ cm}$. Xăng-ti-mét khối viết tắt là $\text{cm}^3$.
Đề-xi-mét khối là thể tích của hình lập phương có cạnh dài $1\text{ dm}$. Đề-xi-mét khối viết tắt là $\text{dm}^3$.

##TC Quan hệ giữa xăng-ti-mét khối và đề-xi-mét khối
$1\text{ dm}^3 = 1000\text{ cm}^3$; $1\text{ cm}^3 = 0{,}001\text{ dm}^3$.
$1\text{ l} = 1\text{ dm}^3$.

##PP Đổi, so sánh số đo thể tích
Đổi từ $\text{dm}^3$ sang $\text{cm}^3$ thì nhân với $1000$; đổi từ $\text{cm}^3$ sang $\text{dm}^3$ thì chia cho $1000$.
Số đo có hai đơn vị (vd $3\text{ dm}^3~12\text{ cm}^3$): đổi phần $\text{cm}^3$ sang $\text{dm}^3$ rồi cộng, hoặc đổi phần $\text{dm}^3$ sang $\text{cm}^3$ rồi cộng.
So sánh hai số đo: đổi về cùng một đơn vị rồi so sánh hai số.
Đọc: đọc số trước, rồi đọc tên đơn vị "xăng-ti-mét khối", "đề-xi-mét khối".

##CY
Nhầm "khối" với "vuông": hai đơn vị thể tích liền nhau hơn kém $1000$ lần, không phải $100$ lần.
$3\text{ dm}^3~12\text{ cm}^3 = 3{,}012\text{ dm}^3$, không phải $3{,}12\text{ dm}^3$.


## Chủ đề 8. Thể tích. Đơn vị đo thể tích › Thể tích. Đơn vị đo thể tích › Bài 47. Mét khối

### NDB02144 — Mét khối
**Mô tả:** Bài 47 SGK. Đề có số đo bằng $m^3$ (kèm $dm^3$, $cm^3$): đọc, viết số đo; đổi giữa $m^3$, $dm^3$, $cm^3$ (số đo một hay hai đơn vị đều được); so sánh, sắp xếp các số đo (kể cả khi một vế là phép tính phải làm trước rồi so sánh). Công cụ: $1~m^3=1000~dm^3=1000000~cm^3$. Đề chỉ có $cm^3$, $dm^3$ thì sang dạng Xăng-ti-mét khối. Đề-xi-mét khối; đề chỉ yêu cầu tính hoặc ước lượng thì sang dạng Ước lượng và bài toán thực tế.

##ĐN Mét khối
Mét khối là thể tích của hình lập phương có cạnh dài $1\text{ m}$. Mét khối viết tắt là $\text{m}^3$.

##TC Quan hệ giữa mét khối, đề-xi-mét khối, xăng-ti-mét khối
$1\text{ m}^3 = 1000\text{ dm}^3$; $1\text{ dm}^3 = 0{,}001\text{ m}^3$.
$1\text{ m}^3 = 1000000\text{ cm}^3$.
Hai đơn vị đo thể tích liền nhau hơn kém nhau $1000$ lần.

##PP Đổi, so sánh số đo thể tích
Đổi sang đơn vị bé hơn liền sau thì nhân với $1000$; đổi sang đơn vị lớn hơn liền trước thì chia cho $1000$ (cách hai bậc thì nhân hoặc chia cho $1000000$).
Số đo có hai đơn vị (vd $2\text{ m}^3~25\text{ dm}^3$): đổi phần đơn vị bé sang đơn vị lớn rồi cộng, hoặc đổi phần đơn vị lớn sang đơn vị bé rồi cộng.
So sánh, sắp xếp các số đo: đổi tất cả về cùng một đơn vị rồi so sánh các số.

##CY
$2\text{ m}^3~25\text{ dm}^3 = 2{,}025\text{ m}^3$, không phải $2{,}25\text{ m}^3$ (phần $\text{dm}^3$ phải đủ ba chữ số sau dấu phẩy).
Nhầm hai đơn vị liền nhau hơn kém $100$ lần như đơn vị đo diện tích.


## Chủ đề 8. Thể tích. Đơn vị đo thể tích › Thể tích. Đơn vị đo thể tích › Bài 48. Luyện tập chung

### NDB02793 — Ước lượng và bài toán thực tế với số đo thể tích
**Mô tả:** Đề yêu cầu chọn số đo thể tích phù hợp với đồ vật (ước lượng), tính cộng, trừ, nhân, chia với các số đo thể tích, đổi lít sang $dm^3$, hoặc giải bài toán thực tế như tiền nước sinh hoạt theo số mét khối. Khác các dạng đổi đơn vị ở chỗ phải tính toán hoặc ước lượng, không chỉ đổi.

##PP Ước lượng và giải bài toán thực tế với số đo thể tích
Ước lượng: $1\text{ cm}^3$ cỡ một viên xúc xắc nhỏ; $1\text{ dm}^3$ cỡ một hộp sữa 1 lít; $1\text{ m}^3$ cỡ một thùng lớn cạnh 1 m.
Cộng, trừ, nhân, chia các số đo thể tích cùng đơn vị như với các số, rồi viết đơn vị.
Nhớ: 1 lít $= 1\text{ dm}^3$.
Bài tiền nước tính riêng từng mức giá rồi cộng lại.

##CY
Tính toán khi các số đo chưa cùng đơn vị.
Tính tiền nước cả số mét khối theo một mức giá.


## Chủ đề 9. Diện tích và thể tích của một số hình khối › Diện tích và thể tích của một số hình khối › Bài 49. Hình khai triển của hình lập phương, hình hộp chữ nhật và hình trụ

### NDB02786 — Hình khai triển của hình lập phương, hình hộp chữ nhật, hình trụ
**Mô tả:** Đề cho các tấm bìa hoặc hình vẽ khai triển, hỏi tấm nào gấp được thành hình lập phương, hình hộp chữ nhật hay hình trụ, mặt nào đối diện mặt nào, hoặc cần cắt bỏ mặt nào; công cụ: hình lập phương gồm 6 hình vuông, hình hộp chữ nhật gồm 6 hình chữ nhật từng cặp bằng nhau, hình trụ gồm 1 hình chữ nhật và 2 hình tròn; hai mặt đối diện không có chung cạnh. Chưa tính diện tích hay thể tích.

##PP Nhận biết hình khai triển
Đếm số mặt và hình dạng các mặt: hình lập phương gồm 6 hình vuông bằng nhau; hình hộp chữ nhật gồm 6 hình chữ nhật, từng cặp bằng nhau; hình trụ gồm 1 hình chữ nhật và 2 hình tròn ở hai cạnh đối nhau.
Tưởng tượng gấp tấm bìa lên: các mặt không được chồng lên nhau, không được thiếu mặt.
Trên một hàng thẳng, hai ô cách nhau đúng một ô là hai mặt đối diện.

##CY
Chọn tấm có 4 ô vuông xếp thành hình vuông 2 × 2 — khi gấp sẽ có hai mặt chồng nhau.
Hai hình tròn dán cùng một phía của hình chữ nhật thì không gấp được hình trụ.


## Chủ đề 9. Diện tích và thể tích của một số hình khối › Diện tích và thể tích của một số hình khối › Bài 50. Diện tích xung quanh và diện tích toàn phần của hình hộp chữ nhật

### NDB02787 — Diện tích xung quanh, diện tích toàn phần của hình hộp chữ nhật
**Mô tả:** Đề cho chiều dài, chiều rộng, chiều cao (có thể khác đơn vị hoặc là số thập phân) và hỏi diện tích xung quanh, diện tích toàn phần, hoặc bài thực tế như quét vôi tường và trần phòng (trừ cửa), làm bể kính không nắp, ốp gạch đáy và thành bể; công cụ: $S_{xq}=(a+b)\times 2\times c$, $S_{tp}=S_{xq}+2\times a\times b$, xác định đúng những mặt cần tính. Khác dạng hình lập phương ở chỗ ba kích thước khác nhau.

##PP Tính diện tích xung quanh, diện tích toàn phần của hình hộp chữ nhật
Đổi chiều dài, chiều rộng, chiều cao về cùng một đơn vị đo.
Diện tích xung quanh bằng chu vi mặt đáy nhân với chiều cao: $S_{xq} = (a + b) \times 2 \times c$.
Diện tích toàn phần bằng diện tích xung quanh cộng diện tích hai đáy: $S_{tp} = S_{xq} + a \times b \times 2$.
Bài thực tế: xác định đúng những mặt cần tính — quét vôi tường và trần = diện tích xung quanh + 1 đáy − diện tích cửa; bể không nắp = diện tích xung quanh + 1 đáy.

##CY
Tính cả 6 mặt trong khi đề chỉ cần một số mặt.
Quên trừ diện tích các cửa.
Không đổi ba kích thước về cùng đơn vị trước khi tính.


## Chủ đề 9. Diện tích và thể tích của một số hình khối › Diện tích và thể tích của một số hình khối › Bài 51. Diện tích xung quanh và diện tích toàn phần của hình lập phương

### NDB02788 — Diện tích xung quanh, diện tích toàn phần của hình lập phương
**Mô tả:** Đề cho cạnh hình lập phương (hoặc cho diện tích một mặt, diện tích toàn phần để tìm ngược cạnh) và hỏi diện tích xung quanh, diện tích toàn phần, hoặc bài thực tế như sơn hộp không nắp (5 mặt), bọc hộp quà; công cụ: $S_{xq}=a\times a\times 4$, $S_{tp}=a\times a\times 6$.

##PP Tính diện tích xung quanh, diện tích toàn phần của hình lập phương
Diện tích một mặt bằng cạnh nhân cạnh.
Diện tích xung quanh bằng diện tích một mặt nhân 4: $S_{xq} = a \times a \times 4$.
Diện tích toàn phần bằng diện tích một mặt nhân 6: $S_{tp} = a \times a \times 6$.
Biết diện tích toàn phần thì lấy diện tích toàn phần chia 6 được diện tích một mặt, rồi tìm cạnh.
Hộp không nắp có 5 mặt.

##CY
Nhầm 4 mặt (xung quanh) với 6 mặt (toàn phần).
Hộp không nắp mà vẫn tính 6 mặt.


## Chủ đề 9. Diện tích và thể tích của một số hình khối › Diện tích và thể tích của một số hình khối › Bài 52. Thể tích của hình hộp chữ nhật

### NDB02789 — Thể tích hình hộp chữ nhật
**Mô tả:** Đề cho các kích thước của hình hộp chữ nhật (hoặc phải tìm qua tổng–hiệu, tỉ số) và hỏi thể tích, gồm cả bài thực tế: bể nước đổi ra lít, nước chiếm một số phần trăm thể tích bể, tìm mực nước, nước dâng khi thả vật vào bể, xếp hộp vào thùng, khối ghép từ nhiều hình hộp; công cụ: $V=a\times b\times c$ (cùng đơn vị đo), $1\,dm^3=1$ lít.

##PP Tính thể tích hình hộp chữ nhật
Đổi chiều dài, chiều rộng, chiều cao về cùng một đơn vị đo.
Thể tích bằng chiều dài nhân chiều rộng nhân chiều cao: $V = a \times b \times c$.
Đổi ra lít: $1\text{ dm}^3 = 1$ lít.
Chiều cao mực nước bằng thể tích nước chia cho diện tích đáy bể.
Thể tích vật chìm trong bể bằng diện tích đáy bể nhân với độ cao mực nước dâng thêm.

##CY
Không đổi ba kích thước về cùng đơn vị trước khi nhân.
Nhầm $1\text{ m}^3$ với 1 lít — thực ra $1\text{ m}^3 = 1000$ lít.


## Chủ đề 9. Diện tích và thể tích của một số hình khối › Diện tích và thể tích của một số hình khối › Bài 53. Thể tích của hình lập phương

### NDB02790 — Thể tích hình lập phương
**Mô tả:** Đề cho cạnh hình lập phương và hỏi thể tích, hoặc phải tìm cạnh trước từ tổng độ dài các cạnh, chu vi một mặt, diện tích toàn phần; gồm cả bài ghép các hình lập phương nhỏ thành hình lớn; công cụ: $V=a\times a\times a$.

##PP Tính thể tích hình lập phương
Thể tích bằng cạnh nhân cạnh nhân cạnh: $V = a \times a \times a$.
Biết tổng độ dài các cạnh thì cạnh bằng tổng đó chia cho 12 (hình lập phương có 12 cạnh).
Biết diện tích toàn phần thì lấy diện tích toàn phần chia 6 được diện tích một mặt, rồi tìm cạnh.

##CY
Lấy cạnh nhân 3 thay cho cạnh nhân cạnh nhân cạnh.
Chia tổng độ dài các cạnh cho 4 hoặc 6 thay vì 12.


## Chủ đề 10. Số đo thời gian. Vận tốc. Các bài toán liên quan đến chuyển động đều › Số đo thời gian. Vận tốc. Chuyển động đều › Bài 56. Các đơn vị đo thời gian

### NDB02129 — Đổi đơn vị đo thời gian
**Mô tả:** Đề yêu cầu viết số đo thời gian từ đơn vị này sang đơn vị khác (giờ ra phút, phút ra giờ, số đo phức ra số đo đơn, số thập phân ra giờ – phút...); không có phép tính cộng, trừ, nhân, chia hai số đo.

##PP Đổi đơn vị đo thời gian
Xác định đổi từ đơn vị lớn sang bé hay ngược lại.
Đổi lớn sang bé: nhân với $60$ (giờ ra phút, phút ra giây) rồi cộng phần lẻ nếu có.
Đổi bé sang lớn: chia cho $60$ để được số đơn vị lớn và phần dư, hoặc viết phần lẻ dưới dạng phân số, số thập phân của đơn vị lớn.
Số đo ở dạng số thập phân thì phần thập phân nhân với $60$ để đổi ra đơn vị bé.

##CY
$2{,}5$ giờ là $2$ giờ $30$ phút chứ không phải $2$ giờ $50$ phút, vì $0{,}5$ giờ $= 0{,}5 \times 60 = 30$ phút.
Khi đổi phút ra giờ bằng số thập phân phải chia cho $60$, không chia cho $100$.

### NDB02131 — So sánh các đại lượng thời gian
**Mô tả:** Đề cho các đại lượng thời gian ở những đơn vị khác nhau hoặc dạng khác nhau (giờ – phút, số thập phân, giây...) và yêu cầu so sánh, điền dấu, sắp xếp hoặc tìm đại lượng lớn nhất, bé nhất.

##PP So sánh các đại lượng thời gian
Chọn một đơn vị chung phù hợp nhất (thường là đơn vị bé nhất xuất hiện trong đề).
Đổi tất cả các đại lượng về đơn vị đó.
So sánh các số vừa đổi, rồi kết luận theo yêu cầu đề.

##CY
Không so sánh trực tiếp hai số khác đơn vị: $150$ phút nhìn có vẻ lớn hơn $2$ giờ $30$ phút nhưng thật ra hai số đo bằng nhau.
Khi đề hỏi "nhanh nhất" thì thời gian BÉ nhất mới là người nhanh nhất.


## Chủ đề 10. Số đo thời gian. Vận tốc. Các bài toán liên quan đến chuyển động đều › Số đo thời gian. Vận tốc. Chuyển động đều › Bài 57. Cộng, trừ số đo thời gian

### NDB02128 — Cộng trừ số đo thời gian
**Mô tả:** Đề cho hai số đo thời gian gồm nhiều đơn vị (giờ – phút, phút – giây, ngày – giờ...) và yêu cầu cộng hoặc trừ chúng, kể cả khi kết quả phải đổi hoặc phải mượn đơn vị lớn hơn; có thể ở dạng tính thuần hoặc bài toán tính khoảng thời gian.

##PP Cộng, trừ số đo thời gian
Viết các số đo thẳng cột, đơn vị cùng loại cùng cột.
Cộng hoặc trừ từng loại đơn vị, bắt đầu từ đơn vị bé nhất.
Cộng: số đơn vị bé từ $60$ trở lên thì đổi sang đơn vị lớn hơn.
Trừ: không trừ được thì mượn $1$ đơn vị lớn đổi thành $60$ đơn vị bé rồi trừ.

##CY
Đổi $1$ giờ thành $60$ phút, không phải $100$ phút; đổi sai là lỗi phổ biến nhất.
Nhớ trả lại $1$ đơn vị lớn sau khi đã mượn: $5$ giờ $20$ phút phải viết thành $4$ giờ $80$ phút rồi mới trừ.


## Chủ đề 10. Số đo thời gian. Vận tốc. Các bài toán liên quan đến chuyển động đều › Số đo thời gian. Vận tốc. Chuyển động đều › Bài 58. Nhân, chia số đo thời gian với một số

### NDB02130 — Nhân chia số đo thời gian với 1 số
**Mô tả:** Đề cho một số đo thời gian nhiều đơn vị và yêu cầu nhân hoặc chia với một số tự nhiên (tính thời gian của nhiều lần như nhau, hoặc thời gian của một phần); có đổi hoặc chia dư giữa các đơn vị.

##PP Nhân, chia số đo thời gian với một số
Nhân: nhân từng loại đơn vị với số đó, rồi đổi các đơn vị bé từ $60$ trở lên sang đơn vị lớn.
Chia: chia đơn vị lớn nhất trước; phần dư đổi sang đơn vị bé liền sau, cộng với số đơn vị bé đang có rồi chia tiếp.
Thử lại bằng phép tính ngược: nhân kết quả của phép chia với số chia phải ra số ban đầu.

##CY
Nhân xong mà quên đổi $60$ phút ra $1$ giờ sẽ viết kết quả không chuẩn.
Khi chia, số dư của đơn vị lớn phải đổi ra đơn vị bé (nhân với $60$) rồi cộng vào, đừng bỏ phần dư.


## Chủ đề 10. Số đo thời gian. Vận tốc. Các bài toán liên quan đến chuyển động đều › Số đo thời gian. Vận tốc. Chuyển động đều › Bài 59. Vận tốc của một chuyển động đều

### NDB02132 — Làm quen với đại lượng chuyển động
**Mô tả:** Bài làm quen khái niệm vận tốc: hiểu ý nghĩa của vận tốc đã cho và tính vận tốc, quãng đường hay thời gian trong tình huống đơn giản, đơn vị đã khớp hoặc chỉ cần đổi thời gian đơn giản; chưa có đổi đơn vị vận tốc hay nhiều chặng.

##PP Làm quen với vận tốc
Đọc kĩ đại lượng đề cho: quãng đường, thời gian hay vận tốc, và đơn vị của nó.
Chọn công thức tương ứng với đại lượng cần tìm.
Thay số, tính, rồi ghi kèm đơn vị vận tốc: km/giờ, m/phút hay m/giây.

##CY
Vận tốc là quãng đường đi được trong MỘT đơn vị thời gian, không phải tổng quãng đường.
Thời gian ghi giờ và phút phải đổi ra giờ (số thập phân hoặc phân số) trước khi chia: $1$ giờ $30$ phút $= 1{,}5$ giờ.

### NDB02133 — Đổi đơn vị đo vận tốc
**Mô tả:** Đề yêu cầu viết vận tốc từ đơn vị này sang đơn vị khác (km/giờ, m/phút, m/giây); chỉ có đổi đơn vị, không có bài toán lời văn về quãng đường hay thời gian.

##PP Đổi đơn vị đo vận tốc
Viết vận tốc dưới dạng quãng đường đi được trong một đơn vị thời gian.
Đổi đơn vị quãng đường: $1$ km $= 1000$ m.
Đổi đơn vị thời gian: $1$ giờ $= 60$ phút $= 3600$ giây.
Tính lại quãng đường đi được trong đơn vị thời gian mới.

##CY
Đổi km/giờ sang m/giây phải CHIA cho $3600$ sau khi nhân $1000$; đổi m/giây sang km/giờ thì nhân $3600$ rồi chia cho $1000$.
Lẫn lộn giữa $60$ (giờ ra phút) và $3600$ (giờ ra giây) là lỗi hay gặp.


## Chủ đề 10. Số đo thời gian. Vận tốc. Các bài toán liên quan đến chuyển động đều › Số đo thời gian. Vận tốc. Chuyển động đều › Bài 60. Quãng đường, thời gian của một chuyển động đều

### NDB02134 — Bài toán tìm các đại lượng chuyển động
**Mô tả:** Bài toán lời văn một chuyển động đều cho hai trong ba đại lượng (vận tốc, quãng đường, thời gian), tìm đại lượng còn lại; thời gian cho ở dạng giờ – phút hoặc có đơn vị cần đổi, kể cả bài hỏi giờ đến nơi.

##PP Tìm các đại lượng chuyển động
Xác định đề cho hai đại lượng nào và hỏi đại lượng nào.
Đưa các đại lượng về đơn vị khớp nhau (km với giờ, m với phút hoặc giây).
Chọn đúng công thức $v = s : t$, $s = v \times t$ hoặc $t = s : v$ rồi tính.
Đổi kết quả sang đơn vị đề hỏi (ví dụ $3{,}75$ giờ ra giờ phút), cộng với giờ khởi hành nếu hỏi giờ đến nơi.

##CY
Đơn vị chưa khớp mà vẫn nhân, chia: vận tốc km/giờ mà thời gian cho bằng phút.
Hỏi "đến lúc mấy giờ" thì kết quả là thời điểm, phải cộng thời gian đi với giờ khởi hành, không chỉ ghi thời gian đi.

### NDB02135 — Bài toán chuyển động nhiều chặng (nâng cao)
**Mô tả:** Bài toán một chuyển động chia thành nhiều chặng với vận tốc hoặc thời gian khác nhau, phải tính từng chặng rồi cộng quãng đường, thời gian, và có thể hỏi vận tốc trung bình cả hành trình.

##PP Chuyển động nhiều chặng
Gạch đầu dòng từng chặng với vận tốc, thời gian, quãng đường của chặng đó.
Tính quãng đường (hoặc thời gian) của từng chặng bằng công thức thích hợp.
Cộng quãng đường các chặng để được tổng quãng đường; cộng thời gian các chặng để được tổng thời gian.
Vận tốc trung bình cả hành trình bằng tổng quãng đường chia cho tổng thời gian.

##CY
Vận tốc trung bình KHÔNG phải trung bình cộng của các vận tốc: đi $2$ giờ với $50$ km/giờ rồi $3$ giờ với $40$ km/giờ thì vận tốc trung bình là $44$ km/giờ, không phải $45$ km/giờ.
Đề có thời gian nghỉ thì chỉ tính thời gian chuyển động khi tìm vận tốc, trừ khi đề nói rõ tính cả nghỉ.


## Chủ đề 11. Một số yếu tố thống kê và xác suất › Một số yếu tố thống kê và xác suất › Bài 63. Thu thập, phân loại, sắp xếp các số liệu

### NDB02136 — Dựa vào dãy số liệu, hoàn thiện bảng số liệu
**Mô tả:** Đề cho một dãy số liệu (danh sách điểm, môn yêu thích, kết quả điều tra…) chưa sắp xếp và yêu cầu đếm số lần xuất hiện từng giá trị để điền vào bảng; công cụ: kiểm đếm từng giá trị và kiểm tra tổng.

##PP Lập bảng từ dãy số liệu
Liệt kê các giá trị (loại) khác nhau có trong dãy.
Đếm số lần xuất hiện của từng giá trị, vừa đếm vừa gạch kiểm đếm để không sót.
Điền số lần đếm được vào bảng.
Cộng các số lần lại và so với tổng số đối tượng điều tra.

##CY
Đếm sót hoặc đếm trùng một số liệu.
Không cộng kiểm tra tổng nên không phát hiện sai sót.

### NDB02137 — Quan sát bảng số liệu và trả lời câu hỏi
**Mô tả:** Đề cho bảng số liệu đã lập sẵn và đặt câu hỏi đọc, so sánh, tính tổng – hiệu từ các số trong bảng; công cụ: tìm đúng ô theo hàng, cột rồi thực hiện phép tính.

##PP Đọc bảng số liệu và trả lời
Đọc tên các hàng, các cột và đơn vị của bảng.
Tìm đúng những số liệu mà câu hỏi nhắc đến.
Thực hiện phép tính (cộng, trừ, so sánh) theo yêu cầu.
Trả lời đúng điều được hỏi, có kèm đơn vị.

##CY
Đọc nhầm hàng hoặc cột.
Bỏ qua đơn vị của bảng (cái, kg, nghìn đồng…).
Chỉ trả lời một ý trong khi câu hỏi có nhiều ý.


## Chủ đề 11. Một số yếu tố thống kê và xác suất › Một số yếu tố thống kê và xác suất › Bài 64. Biểu đồ hình quạt tròn

### NDB02138 — Bài toán về biểu đồ quạt tròn
**Mô tả:** Đề cho biểu đồ quạt tròn (các loại và tỉ số phần trăm) kèm tổng số hoặc số lượng một loại, hỏi tỉ số phần trăm còn lại, số lượng một loại hoặc tổng số; công cụ: tổng bằng $100\%$ và tìm phần trăm của một số.

##PP Bài toán về biểu đồ quạt tròn
Đọc tên các phần và tỉ số phần trăm của từng phần.
Phần trăm chưa biết thì lấy $100\%$ trừ đi các phần trăm đã biết.
Biết tổng số thì số lượng một loại bằng tổng số nhân với tỉ số phần trăm của loại đó.
Biết số lượng một loại và tỉ số phần trăm của nó thì tổng số bằng số lượng chia cho tỉ số phần trăm.

##CY
Các phần trăm cộng lại không đủ $100\%$ mà không kiểm tra.
Lấy tỉ số phần trăm làm số lượng thật.
So sánh số lượng thật của hai loại thuộc hai biểu đồ khác nhau chỉ bằng phần trăm.


## Chủ đề 11. Một số yếu tố thống kê và xác suất › Một số yếu tố thống kê và xác suất › Bài 65. Tỉ số của số lần lặp lại một sự kiện so với tổng số lần thực hiện

### NDB02795 — Tỉ số mô tả số lần lặp lại của một sự kiện
**Mô tả:** Đề cho bảng kết quả một thí nghiệm lặp lại nhiều lần (tung đồng xu, gieo xúc xắc, lấy tất, bút, kẹo, quay vòng quay) và hỏi tổng số lần thực hiện hoặc tỉ số giữa số lần xảy ra một sự kiện và tổng số lần thực hiện; công cụ: tỉ số = số lần xảy ra : tổng số lần, viết dạng phân số, rút gọn nếu được.

##PP Tìm tỉ số mô tả số lần lặp lại của một sự kiện
Tính tổng số lần thực hiện thí nghiệm bằng cách cộng số lần của tất cả các kết quả.
Tỉ số mô tả số lần lặp lại của một sự kiện bằng số lần xảy ra sự kiện đó chia cho tổng số lần thực hiện, viết dưới dạng phân số.
Rút gọn phân số nếu được.

##CY
Chia cho số lần của một sự kiện khác thay vì chia cho tổng số lần thực hiện.
Quên cộng đủ các kết quả khi tính tổng số lần.

