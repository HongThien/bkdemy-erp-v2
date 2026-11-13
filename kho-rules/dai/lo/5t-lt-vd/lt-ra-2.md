=== NDB02949
@@mo_ta
Đề cho một tổng nhiều số hạng, mỗi số hạng là một tích có quy luật (1×2 + 3×4 + 5×6 + … hoặc 1 + 1×2 + 1×2×3 + …) và hỏi chữ số tận cùng của tổng. Chỉ xét chữ số tận cùng của từng tích rồi cộng lại: tổng ghép theo nhóm lặp lại, còn tích có thừa số 2 và 5 thì tận cùng 0 nên bỏ qua. Khác dạng đếm chữ số 0 tận cùng ở chỗ hỏi chữ số cuối cùng của một tổng, không hỏi có bao nhiêu chữ số 0.
@@ly_thuyet
##TC
Chữ số tận cùng của một tổng bằng chữ số tận cùng của tổng các chữ số tận cùng của từng số hạng.
Chữ số tận cùng của một tích bằng chữ số tận cùng của tích các chữ số tận cùng của từng thừa số.
Tích $1\times2\times3\times4\times5$ có thừa số 2 và thừa số 5 nên tận cùng là 0; mọi tích $1\times2\times3\times\ldots\times k$ với $k$ từ 5 trở lên đều tận cùng là 0.

##PP
Viết ra vài số hạng đầu, chỉ ghi chữ số tận cùng của từng số hạng.
Tìm xem các chữ số tận cùng có lặp lại theo nhóm không (thường lặp sau mỗi 5 số hạng hoặc 10 thừa số).
Cộng chữ số tận cùng của một nhóm, lấy chữ số tận cùng của kết quả.
Chia số số hạng cho số số hạng của một nhóm để biết có bao nhiêu nhóm trọn vẹn và còn dư mấy số hạng.
Chữ số tận cùng của tổng bằng chữ số tận cùng của (tổng các nhóm trọn vẹn + các số hạng còn dư).
Với tổng các tích $1\times2\times3\times\ldots$ thì chỉ cần cộng các tích đầu chưa tận cùng 0, từ tích có thừa số 5 trở đi bỏ qua.

##CY
Đừng quên các số hạng còn dư sau khi chia nhóm.
Số số hạng khác số thừa số: ở tổng 1×2 + 3×4 + … + 2031×2032 thì số số hạng là 2032 : 2, không phải 2032.
Chỉ lấy tận cùng của từng tích, không cần tính cả tích.
@@vi_du
##VD
Tìm chữ số tận cùng của $S=1\times2+3\times4+5\times6+\ldots+2031\times2032$.
**Hướng dẫn giải:**
Chữ số tận cùng của các tích đầu: $1\times2=2$; $3\times4=12$ tận cùng 2; $5\times6=30$ tận cùng 0; $7\times8=56$ tận cùng 6; $9\times10=90$ tận cùng 0.
Tổng chữ số tận cùng của 5 tích đầu: $2+2+0+6+0=10$, tận cùng là 0.
Các thừa số tiếp theo lặp lại chữ số tận cùng nên cứ 5 tích liên tiếp lại có tổng tận cùng 0.
Số tích trong tổng: $2032:2=1016$ (tích).
Chia nhóm: $1016:5=203$ dư 1, tức 203 nhóm trọn vẹn và còn 1 tích.
203 nhóm trọn vẹn có tổng tận cùng 0.
Tích còn dư là $2031\times2032$ có tận cùng là chữ số tận cùng của $1\times2=2$.
Chữ số tận cùng của $S$ là $0+2=2$.
Đáp số: 2.

##VD
Tìm chữ số tận cùng của $A=1+1\times2+1\times2\times3+1\times2\times3\times4+\ldots+1\times2\times3\times\ldots\times100$.
**Hướng dẫn giải:**
Các tích từ $1\times2\times3\times4\times5$ trở đi đều có thừa số 2 và thừa số 5 nên tận cùng là 0, không ảnh hưởng chữ số tận cùng của tổng.
Chỉ cần cộng 4 số hạng đầu: $1+1\times2+1\times2\times3+1\times2\times3\times4=1+2+6+24=33$.
Chữ số tận cùng của $A$ là 3.
Đáp số: 3.

=== NDB02950
@@mo_ta
Đề cho một tích nhiều thừa số liên tiếp hoặc cách đều (1×2×…×100, 13×14×…×22, 5×10×15×…×500) và hỏi tích tận cùng bằng bao nhiêu chữ số 0. Mỗi chữ số 0 ứng với một cặp thừa số 2 và 5; vì thừa số 2 luôn nhiều hơn thừa số 5 nên chỉ cần đếm tổng số thừa số 5, kể cả số chia hết cho 25, 125 phải đếm thêm. Khác dạng tìm n ngược: ở đây biết tích, hỏi số chữ số 0.
@@ly_thuyet
##TC
Mỗi chữ số 0 tận cùng của một tích ứng với một cặp thừa số $2\times5$ (vì $2\times5=10$).
Trong tích các số tự nhiên liên tiếp, thừa số 2 luôn nhiều hơn thừa số 5, nên số chữ số 0 tận cùng bằng số thừa số 5 của tích.
Số chia hết cho 5 có ít nhất 1 thừa số 5; số chia hết cho 25 (25, 50, 75…) có 2 thừa số 5; số chia hết cho 125 có 3 thừa số 5.

##PP
Đếm các thừa số chia hết cho 5 trong tích, mỗi số tính 1 thừa số 5.
Đếm thêm các thừa số chia hết cho 25, mỗi số có thêm 1 thừa số 5 nữa.
Đếm thêm các thừa số chia hết cho 125 (nếu có), mỗi số thêm 1 thừa số 5 nữa.
Cộng lại được tổng số thừa số 5.
Kiểm tra số thừa số 2 không ít hơn số thừa số 5 rồi kết luận số chữ số 0 bằng số thừa số 5.

##CY
Tích từ 1 đến 100: số chia hết cho 5 là $100:5=20$ số, số chia hết cho 25 là $100:25=4$ số.
Số 25 phải tính 2 thừa số 5, số 125 phải tính 3 thừa số 5; đừng đếm mỗi số chia hết cho 5 chỉ 1 thừa số.
Nếu tích chỉ gồm các số lẻ thì không có thừa số 2, tích không tận cùng bằng 0 (xem dạng gạch bớt thừa số).
@@vi_du
##VD
Tích $20\times21\times22\times\ldots\times29$ tận cùng bằng bao nhiêu chữ số 0?
**Hướng dẫn giải:**
Mỗi chữ số 0 tận cùng ứng với một cặp thừa số $2\times5$; thừa số 2 trong tích nhiều nên chỉ cần đếm thừa số 5.
Trong các số từ 20 đến 29 chỉ có 20 và 25 chia hết cho 5.
Số $20=4\times5$ có 1 thừa số 5.
Số $25=5\times5$ có 2 thừa số 5.
Tổng số thừa số 5 là $1+2=3$.
Tích có nhiều hơn 3 thừa số 2 (chẳng hạn $20=2\times2\times5$, $24=2\times2\times2\times3$) nên tạo được 3 cặp $2\times5$.
Vậy tích tận cùng bằng 3 chữ số 0.
Đáp số: 3 chữ số 0.

##VD
Tích $1\times2\times3\times\ldots\times100$ tận cùng bằng bao nhiêu chữ số 0?
**Hướng dẫn giải:**
Chữ số 0 tận cùng bằng số thừa số 5 của tích (thừa số 2 luôn nhiều hơn).
Số các số chia hết cho 5 từ 1 đến 100: $100:5=20$ (số), mỗi số có ít nhất 1 thừa số 5.
Số các số chia hết cho 25 từ 1 đến 100: $100:25=4$ (số: 25; 50; 75; 100), mỗi số có thêm 1 thừa số 5 nữa.
Từ 1 đến 100 không có số nào chia hết cho 125.
Tổng số thừa số 5: $20+4=24$.
Đáp số: 24 chữ số 0.

=== NDB02951
@@mo_ta
Đề cho tích 1×2×3×…×n (n chưa biết) có đúng một số chữ số 0 tận cùng cho trước và hỏi n nhỏ nhất, lớn nhất hoặc mọi giá trị của n. Làm ngược dạng đếm: cho số thừa số 5 cần có, dùng tổng (n:5 + n:25 + n:125) để thử và dò n, rồi xét các số liền sau không chia hết cho 5 vẫn giữ nguyên số chữ số 0.
@@ly_thuyet
##TC
Số chữ số 0 tận cùng của $1\times2\times3\times\ldots\times n$ bằng số thừa số 5 của tích, tức bằng: (số các số chia hết cho 5) + (số các số chia hết cho 25) + (số các số chia hết cho 125) + …, mỗi số tính bằng phép chia lấy phần nguyên của $n$.
Khi $n$ tăng thì số chữ số 0 không giảm; chỉ tăng thêm khi gặp số chia hết cho 5.

##PP
Ước lượng $n$: cứ 5 số liên tiếp thì có 1 số chia hết cho 5 nên $n$ gần bằng 5 lần số chữ số 0 (trừ phần thêm do 25, 125).
Thử một giá trị $n$ là bội của 5, tính số thừa số 5 bằng cách chia $n$ cho 5, 25, 125.
Điều chỉnh $n$ cho đến khi số thừa số 5 đúng bằng số chữ số 0 đề cho; đó là $n$ nhỏ nhất.
Các số liền sau không chia hết cho 5 không thêm thừa số 5 nên vẫn đúng; $n$ lớn nhất là số đứng ngay trước số chia hết cho 5 kế tiếp.

##CY
Đề hỏi "lớn nhất" hay "nhỏ nhất" thì mỗi câu một đáp số khác nhau; có tới 5 giá trị $n$ liên tiếp cho cùng số chữ số 0.
Đừng quên cộng thêm thừa số 5 của số 25, 50, 75, 100, 125…
@@vi_du
##VD
Tìm số tự nhiên $n$ lớn nhất sao cho tích $1\times2\times3\times\ldots\times n$ tận cùng bằng đúng 31 chữ số 0.
**Hướng dẫn giải:**
Tích có đúng 31 chữ số 0 khi có đúng 31 thừa số 5.
Thử $n=125$: các số chia hết cho 5 là $125:5=25$ (số); các số chia hết cho 25 là $125:25=5$ (số); các số chia hết cho 125 là $125:125=1$ (số).
Số thừa số 5 là $25+5+1=31$, đúng bằng số cần có.
Các số 126; 127; 128; 129 không chia hết cho 5 nên không thêm thừa số 5, tích vẫn có 31 chữ số 0.
Số 130 chia hết cho 5 nên tích có thêm 1 thừa số 5, thành 32 chữ số 0 (quá nhiều).
Vậy $n$ lớn nhất là 129.
Đáp số: 129.

##VD
Tìm số tự nhiên $n$ nhỏ nhất và lớn nhất sao cho tích $1\times2\times3\times\ldots\times n$ tận cùng bằng đúng 6 chữ số 0.
**Hướng dẫn giải:**
Cần đúng 6 thừa số 5.
Thử $n=24$: các số chia hết cho 5 là 5; 10; 15; 20 (4 số), không có số chia hết cho 25, được 4 thừa số 5, chưa đủ.
Thử $n=25$: có 5 số chia hết cho 5 và 1 số chia hết cho 25, được $5+1=6$ thừa số 5, vừa đủ nên $n$ nhỏ nhất là 25.
Các số 26; 27; 28; 29 không chia hết cho 5 nên vẫn là 6 thừa số 5.
Số 30 chia hết cho 5 nên thành 7 thừa số 5.
Vậy $n$ lớn nhất là 29.
Đáp số: nhỏ nhất 25; lớn nhất 29.

=== NDB02952
@@mo_ta
Đề cho một tích các số tự nhiên liên tiếp (1×2×…×20, 1×2×…×300) và hỏi phải gạch bớt ít nhất bao nhiêu thừa số để tích còn lại có chữ số tận cùng khác 0 hoặc đúng bằng một chữ số cho trước (thường là 5), có thể kèm hỏi chữ số tận cùng đó. Cần nhận ra tận cùng 0 do cặp thừa số 2 và 5, rồi chọn cách gạch ít nhất: gạch hết thừa số 5 hoặc gạch hết thừa số chẵn.
@@ly_thuyet
##TC
Tích có tận cùng 0 khi trong tích có đủ một thừa số 2 và một thừa số 5. Tích chẵn (có thừa số chẵn) mà tận cùng 5 là không thể; tích lẻ có thừa số 5 thì tận cùng 5; tích chẵn không có thừa số 5 thì tận cùng là 2, 4, 6 hoặc 8.
Để tích còn lại không tận cùng 0 thì phải làm mất hết thừa số 5 hoặc làm mất hết thừa số chẵn.
Để tích còn lại tận cùng 5 thì phải gạch hết các thừa số chẵn và giữ lại ít nhất một số lẻ chia hết cho 5.

##PP
Xác định chữ số tận cùng cần có và tìm điều kiện: không còn cặp (2; 5), hay không còn số chẵn, hay không còn số chia hết cho 5.
Đếm số cách gạch: số thừa số chia hết cho 5 (kể cả 25, 125… cũng chỉ gạch một lần mỗi số) hoặc số thừa số chẵn.
Chọn cách gạch ít số hơn.
Nếu hỏi chữ số tận cùng của tích còn lại thì chỉ giữ chữ số tận cùng của từng thừa số còn lại và nhân dần, mỗi bước chỉ giữ chữ số cuối.

##CY
Phải gạch cả những số vừa chia hết cho 5 vừa chẵn (10; 20; 30…), số chia hết cho 25 chỉ cần gạch một lần.
Khi tìm tận cùng của tích còn lại, các nhóm thừa số lặp lại theo từng chục nên dùng chữ số tận cùng của một nhóm rồi nhân các nhóm với nhau.
@@vi_du
##VD
Cho tích $A=1\times2\times3\times\ldots\times20$. Phải gạch ít nhất bao nhiêu thừa số để tích còn lại có tận cùng khác 0? Khi đó tích còn lại tận cùng bằng chữ số nào?
**Hướng dẫn giải:**
Tích tận cùng 0 do có cặp thừa số $2\times5$ nên phải làm mất hết thừa số 5 hoặc hết thừa số chẵn.
Các thừa số chia hết cho 5 là 5; 10; 15; 20, có 4 số.
Các thừa số chẵn có $20:2=10$ số, nhiều hơn.
Gạch ít nhất 4 thừa số là 5; 10; 15; 20 thì không còn thừa số 5.
Các thừa số còn lại là 1; 2; 3; 4; 6; 7; 8; 9; 11; 12; 13; 14; 16; 17; 18; 19.
Nhóm 1; 2; 3; 4; 6; 7; 8; 9 có chữ số tận cùng của tích là: $2\times3=6$; $6\times4=24$ (tận cùng 4); $4\times6=24$ (tận cùng 4); $4\times7=28$ (tận cùng 8); $8\times8=64$ (tận cùng 4); $4\times9=36$ (tận cùng 6).
Nhóm 11; 12; 13; 14; 16; 17; 18; 19 có các chữ số tận cùng giống nhóm trên nên cũng tận cùng 6.
Tích còn lại tận cùng bằng chữ số tận cùng của $6\times6=36$, tức là 6.
Đáp số: gạch ít nhất 4 thừa số; tận cùng là 6.

##VD
Cho tích $B=1\times2\times3\times\ldots\times15$. Phải gạch ít nhất bao nhiêu thừa số để tích còn lại có tận cùng là 5?
**Hướng dẫn giải:**
Tích tận cùng 5 thì phải là số lẻ nên không còn thừa số chẵn nào.
Các thừa số chẵn từ 1 đến 15 là 2; 4; 6; 8; 10; 12; 14, có $15:2=7$ (số, lấy phần nguyên).
Gạch 7 thừa số chẵn, tích còn lại là $1\times3\times5\times7\times9\times11\times13\times15$: tích các số lẻ và có thừa số 5 nên tận cùng 5.
Không thể gạch ít hơn 7 vì còn một thừa số chẵn thì tích là số chẵn, không thể tận cùng 5.
Đáp số: 7 thừa số.

=== NDB02953
@@mo_ta
Đề cho một hay nhiều số tự nhiên và hỏi số nào chia hết cho 2, 3, 5, 9 (hoặc 4, 6, 10, 15), hoặc kiểm tra một số có chia hết không mà không đặt phép chia. Giải bằng dấu hiệu chia hết: nhìn chữ số tận cùng (2, 5, 10) hoặc cộng các chữ số (3, 9). Khác dạng tìm chữ số thoả điều kiện ở chỗ số đã cho đủ chữ số, không có chữ số cần điền.
@@ly_thuyet
##TC
Chia hết cho 2: chữ số tận cùng là 0; 2; 4; 6; 8.
Chia hết cho 5: chữ số tận cùng là 0 hoặc 5.
Chia hết cho 3: tổng các chữ số chia hết cho 3.
Chia hết cho 9: tổng các chữ số chia hết cho 9.
Chia hết cho 4: số tạo bởi hai chữ số tận cùng chia hết cho 4.

##TC
Chia hết cho cả 2 và 5 thì tận cùng là 0 (chia hết cho 10).
Chia hết cho cả 2 và 3 thì chia hết cho 6.
Chia hết cho cả 3 và 5 thì chia hết cho 15.
Số chia hết cho 9 thì chia hết cho 3; ngược lại số chia hết cho 3 chưa chắc chia hết cho 9.

##PP
Với dấu hiệu theo chữ số tận cùng (2; 5; 4; 10): nhìn thẳng chữ số cuối (hoặc hai chữ số cuối).
Với dấu hiệu theo tổng chữ số (3; 9): cộng tất cả các chữ số của số, rồi kiểm tra tổng có chia hết cho 3 hoặc 9 không.
Số cần chia hết cho nhiều số cùng lúc thì kiểm tra từng điều kiện rồi kết hợp.

##CY
Dấu hiệu chia hết cho 3 và 9 dùng tổng các chữ số, không dùng chữ số tận cùng.
Số 0 chia hết cho mọi số; số có tổng chữ số 18 chia hết cho cả 3 và 9.
@@vi_du
##VD
Trong các số 1260; 3475; 8109; 5742; 9045; 2023, hãy chỉ ra các số:
a) Chia hết cho 2.
b) Chia hết cho 5.
c) Chia hết cho 3.
d) Chia hết cho 9.
e) Chia hết cho cả 2 và 5.
**Hướng dẫn giải:**
a) Số chia hết cho 2 có chữ số tận cùng chẵn nên đó là các số 1260 và 5742.

b) Số chia hết cho 5 có chữ số tận cùng 0 hoặc 5 nên đó là các số 1260; 3475; 9045.

c) Tổng các chữ số: $1+2+6+0=9$; $3+4+7+5=19$; $8+1+0+9=18$; $5+7+4+2=18$; $9+0+4+5=18$; $2+0+2+3=7$.
Tổng chia hết cho 3 là 9; 18; 18; 18 nên các số chia hết cho 3 là 1260; 8109; 5742; 9045.

d) Tổng chia hết cho 9 là 9; 18; 18; 18 nên các số chia hết cho 9 là 1260; 8109; 5742; 9045.

e) Số chia hết cho cả 2 và 5 có chữ số tận cùng là 0 nên đó là số 1260.
Đáp số: a) 1260; 5742. b) 1260; 3475; 9045. c) 1260; 8109; 5742; 9045. d) 1260; 8109; 5742; 9045. e) 1260.

=== NDB02954
@@mo_ta
Đề cho một số còn thiếu một hay hai chữ số được thay bằng chữ cái (như $\overline{234a4b}$, $\overline{22aab}$) và yêu cầu tìm chữ số đó để số chia hết cho 2, 3, 5, 9 (có thể kèm chia 5 dư 3, chia hết cho 4). Giải: dùng điều kiện chữ số tận cùng để tìm chữ số hàng đơn vị trước, sau đó dùng tổng các chữ số (chia hết cho 3 hoặc 9) để tìm chữ số còn lại; có thể có nhiều đáp án.
@@ly_thuyet
##TC
Chia hết cho 2: tận cùng chẵn. Chia hết cho 5: tận cùng 0 hoặc 5. Chia hết cho cả 2 và 5: tận cùng 0.
Chia hết cho 3 (9): tổng các chữ số chia hết cho 3 (9).
Chia cho 5 dư 3: chữ số tận cùng là 3 hoặc 8.

##PP
Dùng điều kiện về chữ số tận cùng (chia hết cho 2, 5, hay chia 5 dư mấy) để tìm chữ số hàng đơn vị.
Tính tổng các chữ số đã biết, cộng thêm các chữ số cần tìm còn lại.
Liệt kê các giá trị của tổng có thể có (mỗi chữ số từ 0 đến 9) rồi chọn các giá trị chia hết cho 3 hoặc 9.
Từ mỗi giá trị của tổng tìm chữ số còn lại, loại trường hợp không phải chữ số (lớn hơn 9) hoặc trái điều kiện (chữ số đầu tiên của số khác 0).
Viết đầy đủ mọi cặp chữ số tìm được và thử lại.

##CY
Phải tìm hết mọi cặp (a; b), không dừng ở cặp đầu tiên.
Chữ số a, b chỉ nhận giá trị từ 0 đến 9; nếu hai chữ cái giống nhau ($\overline{22aab}$) thì thay hai chữ số bằng nhau.
@@vi_du
##VD
Thay các chữ cái $a$, $b$ bằng chữ số thích hợp để số $\overline{234a4b}$ chia hết cho 2, 3 và 5.
**Hướng dẫn giải:**
Số chia hết cho cả 2 và 5 thì tận cùng là 0, vậy $b=0$.
Số có dạng $\overline{234a40}$ có tổng các chữ số là $2+3+4+a+4+0=13+a$.
Số chia hết cho 3 nên $13+a$ chia hết cho 3.
Vì $a$ là chữ số nên $13+a$ nằm từ 13 đến 22; các số chia hết cho 3 là 15; 18; 21.
Với $13+a=15$ thì $a=2$.
Với $13+a=18$ thì $a=5$.
Với $13+a=21$ thì $a=8$.
Thử lại: 234240; 234540; 234840 đều tận cùng 0 và có tổng các chữ số lần lượt là 15; 18; 21 chia hết cho 3.
Đáp số: $b=0$ và $a=2$ hoặc $a=5$ hoặc $a=8$.

##VD
Thay các chữ cái $a$, $b$ bằng chữ số thích hợp để số $\overline{22aab}$ chia hết cho 2, 5 và 9.
**Hướng dẫn giải:**
Số chia hết cho cả 2 và 5 nên tận cùng là 0, vậy $b=0$.
Số có dạng $\overline{22aa0}$ có tổng các chữ số là $2+2+a+a+0=4+a+a$.
Số chia hết cho 9 nên $4+a+a$ chia hết cho 9.
Vì $a$ là chữ số nên $4+a+a$ nằm từ 4 đến 22; các số chia hết cho 9 là 9 và 18.
Nếu $4+a+a=9$ thì $a+a=5$, không có chữ số nào thoả vì $a+a$ là số chẵn.
Nếu $4+a+a=18$ thì $a+a=14$ nên $a=7$.
Thử lại: số 22770 tận cùng 0 và có tổng các chữ số là 18 chia hết cho 9.
Đáp số: $a=7$; $b=0$ (số 22770).

=== NDB02955
@@mo_ta
Đề cho phép chia có dư và hai trong các đại lượng số bị chia, số chia, thương, số dư, hỏi đại lượng còn lại (hoặc số dư lớn nhất, số bị chia lớn nhất, nhỏ nhất). Sử dụng đẳng thức số bị chia = số chia × thương + số dư với số dư luôn nhỏ hơn số chia; khác với dạng chia hết ở chỗ có số dư khác 0 và phải kiểm lại điều kiện số dư nhỏ hơn số chia.
@@ly_thuyet
##TC
Số bị chia = số chia × thương + số dư, trong đó số dư nhỏ hơn số chia.
Số dư lớn nhất của phép chia cho một số bằng số chia trừ 1 (chia cho 8 thì dư lớn nhất là 7).
Số dư nhỏ nhất khác 0 là 1.

##PP
Tìm số bị chia: lấy số chia nhân với thương rồi cộng số dư.
Tìm số chia: lấy số bị chia trừ số dư, rồi chia cho thương.
Tìm thương: lấy số bị chia trừ số dư, rồi chia cho số chia.
Tìm số dư: lấy số bị chia trừ tích của số chia và thương.
Kiểm tra lại số dư vừa tìm có nhỏ hơn số chia không; nếu không thì kết quả sai.

##CY
Muốn tìm số chia hay thương thì phải trừ số dư trước, vì khi bỏ số dư đi thì phép chia mới chia hết.
Bài hỏi số lớn nhất hoặc nhỏ nhất của số bị chia: cho số dư lớn nhất hoặc nhỏ nhất rồi cộng với tích số chia nhân thương.
@@vi_du
##VD
Chia số 157 cho một số, được thương là 7 và số dư là 3. Tìm số chia.
**Hướng dẫn giải:**
Bỏ số dư đi thì phép chia chia hết: $157-3=154$ (là tích của số chia và thương).
Số chia là $154:7=22$.
Thử lại: $22\times7+3=154+3=157$, số dư 3 nhỏ hơn số chia 22, đúng.
Đáp số: 22.

##VD
Trong một phép chia có số chia là 9, thương là 25 và số dư khác 0. Tìm số bị chia lớn nhất và số bị chia nhỏ nhất.
**Hướng dẫn giải:**
Số dư nhỏ hơn số chia (9) và khác 0 nên số dư lớn nhất là 8, nhỏ nhất là 1.
Tích của số chia và thương: $9\times25=225$.
Số bị chia lớn nhất: $225+8=233$.
Số bị chia nhỏ nhất: $225+1=226$.
Đáp số: lớn nhất 233; nhỏ nhất 226.

=== NDB02956
@@mo_ta
Đề cho một dãy cách đều có số hạng đầu, số hạng cuối (các số tự nhiên hoặc thập phân, có thể là dãy giảm) và hỏi dãy có bao nhiêu số hạng. Dùng công thức: số số hạng bằng (số cuối trừ số đầu) chia khoảng cách, rồi cộng 1. Khác dạng tính tổng ở chỗ chỉ hỏi số lượng số hạng.
@@ly_thuyet
##ĐN
Dãy số cách đều là dãy mà hiệu của hai số hạng liền nhau luôn bằng nhau; hiệu đó gọi là khoảng cách.

##TC
Số số hạng = (số hạng cuối − số hạng đầu) : khoảng cách + 1.
Với dãy giảm, lấy số lớn trừ số bé trước: (số đầu − số cuối) : khoảng cách + 1.
Dãy các số tự nhiên liên tiếp có khoảng cách là 1; dãy chẵn (hoặc lẻ) liên tiếp có khoảng cách là 2.

##PP
Tìm khoảng cách bằng hiệu hai số hạng liền nhau, kiểm tra các cặp khác để chắc dãy cách đều.
Tính hiệu giữa số hạng cuối và số hạng đầu.
Chia hiệu đó cho khoảng cách để được số khoảng.
Cộng thêm 1 vì số số hạng nhiều hơn số khoảng đúng 1.

##CY
Không quên cộng thêm 1: đếm cả số hạng đầu và số hạng cuối.
Với số thập phân, chia cho 0,1 là nhân với 10; nhớ đổi các số về cùng số chữ số thập phân khi tìm hiệu.
@@vi_du
##VD
Dãy số $10;\ 12;\ 14;\ \ldots;\ 138$ có bao nhiêu số hạng?
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau: $12-10=2$.
Số số hạng của dãy: $(138-10):2+1=128:2+1=64+1=65$ (số hạng).
Đáp số: 65 số hạng.

##VD
Dãy số $2,1;\ 2,2;\ 2,3;\ \ldots;\ 6,9;\ 7$ có bao nhiêu số hạng?
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau: $2,2-2,1=0,1$.
Số số hạng của dãy: $(7-2,1):0,1+1=4,9:0,1+1=49+1=50$ (số hạng).
Đáp số: 50 số hạng.

=== NDB02957
@@mo_ta
Đề cho một dãy cách đều (số tự nhiên, số thập phân) viết đầy đủ đầu và cuối, hoặc đề bảo cộng nhiều số liên tiếp (ví dụ 110 số tự nhiên liên tiếp từ 85), hỏi tổng các số hạng. Trước hết tìm số số hạng, sau đó dùng công thức tổng bằng (số đầu cộng số cuối) nhân số số hạng rồi chia 2. Khác dạng chỉ hỏi số hạng ở chỗ phải tính tổng.
@@ly_thuyet
##TC
Tổng các số hạng của dãy cách đều = (số hạng đầu + số hạng cuối) × số số hạng : 2.
Cách nghĩ: ghép số đầu với số cuối, số thứ hai với số kế cuối, … thì mỗi cặp có tổng bằng nhau (bằng số đầu cộng số cuối); số cặp là số số hạng chia 2.

##PP
Tính số số hạng của dãy: (số cuối − số đầu) : khoảng cách + 1.
Tính tổng của số đầu và số cuối.
Nhân tổng đó với số số hạng rồi chia cho 2.
Kiểm tra bằng cách tính lại bằng đúng cách ghép cặp ở vài số hạng đầu và cuối.

##CY
Chia cho 2 ở cuối; chia sớm cho 2 nếu có thể để phép nhân gọn hơn.
Nếu đề cho "110 số liên tiếp bắt đầu từ 85" thì số cuối là $85+109=194$, không phải $85+110$.
@@vi_du
##VD
Tính tổng $10+12+14+\ldots+138$.
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau là 2.
Số số hạng của dãy: $(138-10):2+1=65$ (số hạng).
Tổng của dãy: $(10+138)\times65:2=148\times65:2=9620:2=4810$.
Đáp số: 4810.

##VD
Tính tổng $0,1+0,2+0,3+\ldots+4,9+5$.
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau là 0,1.
Số số hạng của dãy: $(5-0,1):0,1+1=49+1=50$ (số hạng).
Tổng của dãy: $(0,1+5)\times50:2=5,1\times50:2=255:2=127,5$.
Đáp số: 127,5.

=== NDB02958
@@mo_ta
Đề cho một dãy cách đều có vài số hạng đầu (hoặc số hạng cuối) và hỏi số hạng ở một vị trí thứ mấy, hoặc cho số số hạng rồi tìm số hạng đầu, số hạng cuối, hoặc hỏi một số có thuộc dãy không và nếu có thì ở vị trí thứ mấy. Dùng công thức liên hệ số hạng đầu, khoảng cách và vị trí: (số thứ tự − 1) × khoảng cách + số hạng đầu. Khác dạng đếm số số hạng ở chỗ biết vị trí, tìm số.
@@ly_thuyet
##TC
Số hạng thứ mấy = (số thứ tự − 1) × khoảng cách + số hạng đầu.
Số cuối = (số số hạng − 1) × khoảng cách + số hạng đầu.
Số hạng đầu = số cuối − (số số hạng − 1) × khoảng cách.
Với dãy giảm: số hạng thứ mấy = số hạng đầu − (số thứ tự − 1) × khoảng cách; số hạng đầu = số cuối + (số số hạng − 1) × khoảng cách.

##PP
Tìm khoảng cách của dãy bằng hiệu hai số hạng liền nhau.
Chọn công thức phù hợp với đại lượng cần tìm (số thứ n, số cuối hay số đầu), nhớ trừ 1 ở phần số khoảng.
Thay số và tính.
Kiểm tra bằng cách thử cộng hoặc trừ khoảng cách vài lần ở đầu hoặc đuôi dãy.
Hỏi một số có thuộc dãy không: xem số đó có cùng dạng (cùng số dư khi chia cho khoảng cách) với số hạng đầu không; nếu có thì vị trí là (số đó − số đầu) : khoảng cách + 1.

##CY
Luôn có "− 1" ở số khoảng giữa số đầu và vị trí đang xét: thứ 211 thì có 210 khoảng.
Số thuộc dãy phải nằm trong khoảng giữa số đầu và số cuối của dãy (nếu dãy có hạn).
@@vi_du
##VD
Cho dãy số $2;\ 5;\ 8;\ 11;\ 14;\ \ldots$
a) Tìm số hạng thứ 211 của dãy.
b) Trong các số 2022; 2023; 2024, số nào thuộc dãy? Nếu thuộc thì là số hạng thứ mấy?
**Hướng dẫn giải:**
Khoảng cách của dãy: $5-2=3$.

a) Số hạng thứ 211: $(211-1)\times3+2=210\times3+2=630+2=632$.

b) Mỗi số hạng của dãy đều chia cho 3 dư 2 (vì số đầu là 2 và mỗi lần cộng thêm 3).
$2022:3=674$ dư 0; $2023:3=674$ dư 1; $2024:3=674$ dư 2.
Vậy chỉ có số 2024 thuộc dãy.
Vị trí của 2024: $(2024-2):3+1=674+1=675$.
Đáp số: a) 632. b) 2024 là số hạng thứ 675.

##VD
Tìm số hạng đầu của dãy cách đều có 20 số hạng: $\ldots;\ 96;\ 99;\ 102$.
**Hướng dẫn giải:**
Khoảng cách của dãy: $99-96=3$.
Số hạng đầu: $102-(20-1)\times3=102-19\times3=102-57=45$.
Thử lại: $45+(20-1)\times3=45+57=102$.
Đáp số: 45.

=== NDB02959
@@mo_ta
Đề cho dãy cách đều có số hạng cuối chưa biết (ghi bằng chữ x) và cho tổng của dãy, hỏi số hạng cuối, ví dụ 10 + 11 + 12 + … + x = 5106. Lấy tổng nhân 2 được tích của (số đầu + số cuối) và số số hạng, hai số này hơn kém nhau một số cố định nên thử chọn rồi suy ra số cuối. Khác dạng tính tổng ở chỗ tổng đã biết, số hạng cuối chưa biết.
@@ly_thuyet
##TC
Tổng của dãy cách đều × 2 = (số hạng đầu + số hạng cuối) × số số hạng.
Số cuối = số đầu + (số số hạng − 1) × khoảng cách, nên (số đầu + số cuối) hơn số số hạng một số xác định (tính được từ số đầu và khoảng cách).
Tổng các số lẻ liên tiếp bắt đầu từ 1 bằng số số hạng nhân với chính nó.

##PP
Lấy tổng đã cho nhân 2 để được tích của hai đại lượng: (đầu + cuối) và số số hạng.
Tìm hiệu của hai đại lượng đó (tính từ số đầu và khoảng cách, không phụ thuộc số cuối chưa biết).
Tìm hai số có hiệu đó và tích đó bằng cách thử chọn: thử hai số có tích gần bằng tích cần tìm (chẳng hạn gần $100\times100$ nếu tích khoảng 10000), điều chỉnh đến khi đúng.
Từ số số hạng vừa tìm tính số hạng cuối bằng công thức số cuối.
Thử lại bằng cách tính tổng của dãy vừa tìm.

##CY
Trong dãy số lẻ liên tiếp từ 1 thì (1 + cuối) gấp đôi số số hạng nên tích bằng hai lần "số số hạng nhân số số hạng".
Phải thử lại tổng, vì thử chọn có thể ra hai số gần nhau nhưng chưa khớp.
@@vi_du
##VD
Tìm $x$, biết $10+11+12+13+\ldots+x=5106$ (các số hạng là các số tự nhiên liên tiếp).
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau là 1.
Tổng nhân 2 bằng tích của (số đầu + số cuối) và số số hạng: $5106\times2=10212$.
Số số hạng bằng số cuối trừ 9, còn (số đầu + số cuối) bằng số cuối cộng 10 nên (số đầu + số cuối) hơn số số hạng $10+9=19$.
Tìm hai số hơn kém nhau 19 có tích bằng 10212: thử $90\times109=9810$ (nhỏ hơn); thử $92\times111=10212$ (đúng).
Số số hạng là 92.
Số cuối: $10+(92-1)\times1=10+91=101$.
Thử lại: $(10+101)\times92:2=111\times46=5106$.
Đáp số: $x=101$.

##VD
Tìm $x$, biết $1+3+5+7+\ldots+x=400$ (các số hạng là các số lẻ liên tiếp).
**Hướng dẫn giải:**
Khoảng cách giữa hai số hạng liền nhau là 2.
Tổng nhân 2: $400\times2=800$, bằng tích của (1 + số cuối) và số số hạng.
Số cuối bằng $1$ cộng $2$ nhân (số số hạng trừ $1$), nên ($1$ + số cuối) gấp đôi số số hạng.
Vậy $800$ bằng 2 lần (số số hạng $\times$ số số hạng), suy ra số số hạng $\times$ số số hạng $=800:2=400$.
Vì $20\times20=400$ nên số số hạng là 20.
Số cuối: $1+(20-1)\times2=1+38=39$.
Thử lại: $(1+39)\times20:2=40\times10=400$.
Đáp số: $x=39$.

=== NDB02960
@@mo_ta
Đề cho dãy số tự nhiên liên tiếp (hoặc dãy chẵn, dãy lẻ) từ 1 (hoặc một số) đến N, đánh số trang sách từ 1 đến N, và hỏi phải dùng bao nhiêu chữ số để viết hết. Chia theo nhóm số có 1, 2, 3, 4 chữ số, đếm số số của từng nhóm nhân với số chữ số, cộng lại. Khác dạng tìm số trang ở chỗ cho N, hỏi số chữ số.
@@ly_thuyet
##TC
Từ 1 đến 9 có 9 số, mỗi số 1 chữ số, tổng cộng 9 chữ số.
Từ 10 đến 99 có 90 số, mỗi số 2 chữ số, tổng cộng 180 chữ số.
Từ 100 đến 999 có 900 số, mỗi số 3 chữ số, tổng cộng 2700 chữ số.
Số các số tự nhiên liên tiếp từ $a$ đến $b$ là $b-a+1$.

##PP
Chia các số cần viết thành nhóm theo số chữ số: 1 chữ số, 2 chữ số, 3 chữ số, …
Đếm số số của từng nhóm (nhóm cuối đếm từ số đầu của nhóm đến N).
Nhân số số của mỗi nhóm với số chữ số của mỗi số trong nhóm.
Cộng các tích lại được tổng số chữ số.
Dãy chẵn hoặc lẻ thì đếm số số của mỗi nhóm theo công thức số số hạng của dãy cách đều.

##CY
Nhóm 1 chữ số của dãy bắt đầu từ 0 thì có thêm số 0.
Nhóm cuối đếm từ số đầu của nhóm (100, 1000…) đến N, không đếm từ 1.
@@vi_du
##VD
Một cuốn sách dày 150 trang. Để đánh số trang từ 1 đến 150 cần dùng bao nhiêu chữ số?
**Hướng dẫn giải:**
Từ trang 1 đến trang 9 có 9 trang, mỗi trang 1 chữ số: $9\times1=9$ (chữ số).
Từ trang 10 đến trang 99 có $99-10+1=90$ trang, mỗi trang 2 chữ số: $90\times2=180$ (chữ số).
Từ trang 100 đến trang 150 có $150-100+1=51$ trang, mỗi trang 3 chữ số: $51\times3=153$ (chữ số).
Tổng số chữ số: $9+180+153=342$ (chữ số).
Đáp số: 342 chữ số.

##VD
Viết liên tiếp các số chẵn $0;\ 2;\ 4;\ \ldots;\ 2024$. Dùng bao nhiêu chữ số?
**Hướng dẫn giải:**
Số chẵn có 1 chữ số: 0; 2; 4; 6; 8 có 5 số: $5\times1=5$ (chữ số).
Số chẵn có 2 chữ số từ 10 đến 98 có $(98-10):2+1=45$ (số): $45\times2=90$ (chữ số).
Số chẵn có 3 chữ số từ 100 đến 998 có $(998-100):2+1=450$ (số): $450\times3=1350$ (chữ số).
Số chẵn có 4 chữ số từ 1000 đến 2024 có $(2024-1000):2+1=513$ (số): $513\times4=2052$ (chữ số).
Tổng số chữ số: $5+90+1350+2052=3497$ (chữ số).
Đáp số: 3497 chữ số.

=== NDB02961
@@mo_ta
Đề cho tổng số chữ số đã dùng để đánh số trang (hoặc viết dãy số tự nhiên liên tiếp từ 1) và hỏi sách có bao nhiêu trang (hoặc số cuối của dãy). Làm ngược dạng đếm chữ số: trừ dần số chữ số của nhóm 1 chữ số, 2 chữ số, phần còn lại chia cho số chữ số của nhóm kế tiếp để biết nhóm đó có bao nhiêu số.
@@ly_thuyet
##TC
Để đánh số trang từ 1 đến 9 cần 9 chữ số; từ 10 đến 99 cần 180 chữ số; vậy từ 1 đến 99 cần $9+180=189$ chữ số.
Mỗi trang từ 100 đến 999 cần 3 chữ số.
Biết số chữ số thì số trang bằng (số chữ số còn lại sau khi trừ 189) chia 3, cộng với 99 (khi sách có từ 100 đến 999 trang).

##PP
So sánh số chữ số đề cho với 9 và 189 để biết sách có mấy chữ số ở trang cuối (nhóm nào).
Trừ đi số chữ số đã dùng cho các nhóm đầy đủ (9; 180).
Lấy số chữ số còn lại chia cho số chữ số của nhóm cuối để biết nhóm cuối có bao nhiêu số.
Cộng với số cuối của nhóm đầy đủ trước đó để được số trang.
Thử lại bằng cách đếm số chữ số từ 1 đến số trang vừa tìm.

##CY
Số chữ số còn lại phải chia hết cho số chữ số của nhóm cuối; nếu không chia hết thì đề sai hoặc tính nhầm.
Số trang là số cuối, không phải số các trang của nhóm cuối.
@@vi_du
##VD
Để đánh số trang một cuốn sách (từ trang 1) người ta dùng tất cả 234 chữ số. Hỏi cuốn sách có bao nhiêu trang?
**Hướng dẫn giải:**
Từ trang 1 đến trang 99 dùng $9+90\times2=189$ (chữ số).
Vì $234>189$ nên sách có trang 3 chữ số.
Số chữ số dùng cho các trang 3 chữ số: $234-189=45$ (chữ số).
Số trang có 3 chữ số: $45:3=15$ (trang), đó là các trang từ 100 đến 114.
Số trang của sách: $99+15=114$ (trang).
Đáp số: 114 trang.

##VD
Để đánh số trang một cuốn sách (từ trang 1) người ta dùng tất cả 1392 chữ số. Hỏi cuốn sách có bao nhiêu trang?
**Hướng dẫn giải:**
Từ trang 1 đến trang 99 dùng 189 chữ số.
Số chữ số dùng cho các trang 3 chữ số: $1392-189=1203$ (chữ số).
Số trang có 3 chữ số: $1203:3=401$ (trang).
Số trang của sách: $99+401=500$ (trang).
Thử lại: $9+90\times2+401\times3=9+180+1203=1392$.
Đáp số: 500 trang.

=== NDB02962
@@mo_ta
Đề cho dãy số tự nhiên liên tiếp (1 đến 200, 1 đến 2025…) và hỏi viết dãy đó có bao nhiêu chữ số 1 (hoặc chữ số 0, chữ số 9…), hoặc tổng tất cả các chữ số của dãy. Đếm riêng từng hàng (đơn vị, chục, trăm) rồi cộng; tổng các chữ số dùng cách ghép cặp hai số có tổng bằng 99, 999. Khác dạng đếm tất cả chữ số ở chỗ hỏi một loại chữ số cụ thể hoặc tổng giá trị các chữ số.
@@ly_thuyet
##PP
Đếm chữ số cụ thể: đếm riêng từng hàng (đơn vị, chục, trăm, …).
Với mỗi hàng, đếm có bao nhiêu số trong dãy mà chữ số ở hàng đó là chữ số cần đếm.
Cộng số lượng của các hàng lại.
Tổng các chữ số: ghép cặp hai số có tổng bằng 99 (hoặc 999…), mỗi cặp có tổng các chữ số bằng $9+9=18$ (hoặc $9+9+9$…).

##TC
Từ 1 đến 100 có 21 chữ số 1: hàng đơn vị 10 chữ số (1; 11; …; 91), hàng chục 10 chữ số (10 đến 19), hàng trăm 1 chữ số (100).
Hai số có tổng 99 thì hàng đơn vị cộng lại 9 và hàng chục cộng lại 9 (không có nhớ), nên tổng các chữ số của hai số là 18.

##CY
Chữ số 0 không đứng ở hàng cao nhất: số 100 có hai chữ số 0 nhưng 0 ở hàng chục chỉ tính với số có từ ba chữ số trở lên.
Khi ghép cặp để tính tổng chữ số phải thêm số 0 ở đầu dãy nếu dãy bắt đầu từ 1 (số 0 không làm đổi tổng).
@@vi_du
##VD
Viết liên tiếp các số tự nhiên từ 1 đến 200. Có bao nhiêu chữ số 1? Có bao nhiêu chữ số 0?
**Hướng dẫn giải:**
Đếm chữ số 1:
Hàng đơn vị: các số tận cùng 1 là 1; 11; …; 191 có $(191-1):10+1=20$ (số), được 20 chữ số 1.
Hàng chục: các số có chữ số hàng chục 1 là 10 đến 19 và 110 đến 119, có $10+10=20$ (số), được 20 chữ số 1.
Hàng trăm: các số có chữ số hàng trăm 1 là 100 đến 199, có 100 số, được 100 chữ số 1.
Tổng số chữ số 1: $20+20+100=140$ (chữ số).

Đếm chữ số 0:
Hàng đơn vị: các số tận cùng 0 là 10; 20; …; 200 có $(200-10):10+1=20$ (số), được 20 chữ số 0.
Hàng chục: các số có chữ số hàng chục 0 là 100 đến 109 (10 số) và 200 (1 số), được $10+1=11$ chữ số 0.
Không có chữ số 0 ở hàng trăm.
Tổng số chữ số 0: $20+11=31$ (chữ số).
Đáp số: 140 chữ số 1; 31 chữ số 0.

##VD
Tính tổng các chữ số của dãy số $1;\ 2;\ 3;\ \ldots;\ 99$.
**Hướng dẫn giải:**
Thêm số 0 vào đầu dãy (không làm đổi tổng): dãy $0;\ 1;\ 2;\ \ldots;\ 99$ có 100 số.
Ghép thành các cặp có tổng bằng 99: 0 và 99; 1 và 98; …; 49 và 50, được $100:2=50$ (cặp).
Trong mỗi cặp, hàng đơn vị cộng lại bằng 9 và hàng chục cộng lại bằng 9, nên tổng các chữ số của mỗi cặp là $9+9=18$.
Tổng các chữ số của dãy: $50\times18=900$.
Đáp số: 900.

=== NDB02963
@@mo_ta
Đề cho một dãy số (1; 2; 3; … hoặc dãy chẵn 10; 12; 14; …) viết liền nhau thành một dãy chữ số dài, và hỏi chữ số thứ k (thứ 103, thứ 2000…) là chữ số nào. Chia theo nhóm số có 1, 2, 3 chữ số, trừ dần số chữ số, phần còn lại chia cho số chữ số của nhóm cuối: thương cho biết đã viết xong bao nhiêu số, số dư cho biết vị trí trong số kế tiếp.
@@ly_thuyet
##PP
Đếm số chữ số của các nhóm số trọn vẹn (1 chữ số, 2 chữ số, …) cho tới khi vượt vị trí cần tìm.
Lấy vị trí cần tìm trừ số chữ số của các nhóm đã dùng hết, được số chữ số còn lại nằm trong nhóm cuối.
Chia số chữ số còn lại cho số chữ số của mỗi số trong nhóm: thương là số các số đã viết trọn vẹn, số dư là vị trí của chữ số cần tìm trong số kế tiếp.
Tìm số kế tiếp (số thứ mấy của nhóm), rồi lấy chữ số ở đúng vị trí số dư (dư 0 thì lấy chữ số cuối của số cuối cùng vừa viết trọn vẹn).

##CY
Số dư 0 nghĩa là chữ số cần tìm là chữ số cuối cùng của số vừa viết trọn vẹn, không phải chữ số đầu của số kế.
Dãy chẵn (hoặc lẻ) thì số thứ mấy của nhóm tính theo khoảng cách 2, không phải tăng dần từng số.
@@vi_du
##VD
Viết liên tiếp các số $10;\ 12;\ 14;\ \ldots;\ 138$ thành một dãy chữ số. Chữ số thứ 103 của dãy là chữ số nào?
**Hướng dẫn giải:**
Số chẵn có 2 chữ số từ 10 đến 98 có $(98-10):2+1=45$ (số), dùng $45\times2=90$ (chữ số).
Số chữ số còn lại: $103-90=13$ (chữ số) nằm trong các số có 3 chữ số 100; 102; 104; …
Ta có $13:3=4$ dư 1: viết trọn vẹn 4 số 100; 102; 104; 106 rồi chữ số thứ 13 là chữ số đầu tiên của số kế tiếp.
Số kế tiếp là số thứ 5 của nhóm: $100+(5-1)\times2=108$.
Chữ số đầu tiên của 108 là 1.
Đáp số: 1.

##VD
Viết liên tiếp các số tự nhiên $1;\ 2;\ 3;\ \ldots$ thành dãy chữ số $123456789101112\ldots$ Chữ số thứ 2000 của dãy là chữ số nào?
**Hướng dẫn giải:**
Các số từ 1 đến 99 dùng $9+90\times2=189$ (chữ số).
Số chữ số còn lại: $2000-189=1811$ (chữ số), nằm trong các số có 3 chữ số.
Ta có $1811:3=603$ dư 2: viết trọn vẹn 603 số có 3 chữ số, đó là các số từ 100 đến $100+603-1=702$.
Chữ số thứ 2000 là chữ số thứ hai của số kế tiếp là 703.
Chữ số thứ hai của 703 là 0.
Đáp số: 0.

=== NDB02964
@@mo_ta
Đề cho dãy chữ số tạo bởi viết liền các số tự nhiên (123456789101112…) và hỏi một dãy chữ số liền nhau cho trước (như 2021, ba chữ số 9) xuất hiện lần đầu bắt đầu từ chữ số thứ mấy, hoặc có xuất hiện không. Xét chỗ nối giữa hai số liền nhau, tìm vị trí nhỏ nhất rồi tính vị trí bằng số chữ số đã viết trước đó. Khác dạng tìm chữ số thứ k ở chỗ cho dãy chữ số, hỏi vị trí.
@@ly_thuyet
##PP
Xem dãy chữ số cần tìm có thể nằm gọn trong một số hay phải nằm ở chỗ nối hai (hay nhiều) số liền nhau.
Liệt kê các khả năng cho số nhỏ nhất (nhỏ nhất thì xuất hiện sớm nhất vì các số được viết theo thứ tự tăng dần).
Chọn khả năng nhỏ nhất, kiểm tra bằng cách viết ra các chữ số của các số liền nhau.
Đếm số chữ số của các số từ 1 đến số liền trước đó (theo từng nhóm 1; 2; 3 chữ số) để tính vị trí.

##CY
Một số có nhiều chữ số giống nhau chưa chắc đã chứa dãy cần tìm (99 chỉ có hai chữ số 9).
Phải xét chỗ nối giữa hai số liền nhau: chữ số cuối của số trước và các chữ số đầu của số sau.
@@vi_du
##VD
Viết liên tiếp các số tự nhiên $1;\ 2;\ 3;\ \ldots$ thành dãy chữ số $123456789101112\ldots$ Ba chữ số 9 liền nhau xuất hiện lần đầu tiên bắt đầu từ chữ số thứ mấy?
**Hướng dẫn giải:**
Các số nhỏ hơn 999 chỉ có tối đa hai chữ số 9 liền nhau, nên ba chữ số 9 liền nhau phải nằm ở chỗ nối hai số liền nhau.
Có hai khả năng: số trước tận cùng bằng 99 và số sau bắt đầu bằng 9; hoặc số trước tận cùng bằng 9 và số sau bắt đầu bằng 99.
Khả năng thứ nhất nhỏ nhất ở cặp 899 và 900; khả năng thứ hai nhỏ nhất ở cặp 989 và 990, lớn hơn.
Vậy lần đầu xuất hiện ở chỗ nối 899 và 900: dãy chữ số là 8 9 9 | 9 0 0.
Số chữ số dùng để viết từ 1 đến 899: $9+90\times2+(899-99)\times3=9+180+2400=2589$.
Chữ số 9 ở hàng chục của 899 là chữ số thứ 2588, chữ số 9 ở hàng đơn vị của 899 là chữ số thứ 2589, chữ số 9 đầu tiên của 900 là chữ số thứ 2590.
Ba chữ số 9 liền nhau bắt đầu từ chữ số thứ 2588.
Đáp số: chữ số thứ 2588.

##VD
Viết liên tiếp các số tự nhiên $1;\ 2;\ 3;\ \ldots$ thành dãy chữ số $123456789101112\ldots$ Dãy chữ số $2021$ (bốn chữ số liền nhau) xuất hiện lần đầu bắt đầu từ chữ số thứ mấy?
**Hướng dẫn giải:**
Dãy 2021 có chữ số 0 ở giữa hai chữ số 2.
Chữ số 0 đầu tiên của dãy nằm ở số 10, đứng sau chữ số 1 nên không thể là dãy cần tìm.
Chữ số 0 kế tiếp nằm ở số 20; sau số 20 là số 21 nên có ngay đoạn $\ldots 19\ 20\ 21\ldots$ chứa dãy 2021, bắt đầu từ chữ số 2 của số 20.
Số chữ số dùng để viết từ 1 đến 19: $9+10\times2=29$ (chữ số).
Chữ số 2 của số 20 là chữ số thứ $29+1=30$.
Đáp số: chữ số thứ 30.

=== NDB02965
@@mo_ta
Đề cho một dãy số mà mỗi số hạng (kể từ số hạng thứ ba) bằng tổng của hai số hạng liền ngay trước nó (kiểu 5; 6; 11; 17; 28; …), yêu cầu viết thêm các số hạng tiếp theo, điền số còn thiếu hoặc tìm số hạng ở vị trí xa. Cách làm: cộng thử hai số đầu có ra số thứ ba không, kiểm tra thêm vài cặp để chắc quy luật, rồi tính tiếp. Khác dạng hiệu tăng đều ở chỗ phép cộng hai số hạng liền nhau.
@@ly_thuyet
##TC
Quy luật: số hạng đứng sau bằng tổng hai số hạng đứng liền trước nó (kể từ số hạng thứ ba).
Dãy 1; 2; 3; 5; 8; 13; 21; 34; … là dãy rất quen thuộc theo quy luật này.

##PP
Cộng hai số hạng đầu tiên, xem có bằng số hạng thứ ba không.
Kiểm tra ít nhất thêm một cặp số hạng nữa để chắc đó là quy luật.
Số hạng cần viết tiếp bằng tổng của hai số hạng đứng ngay trước.
Để điền số thiếu ở giữa dãy: cộng hai số liền trước nó, rồi kiểm tra bằng số liền sau.

##CY
Một cặp thoả quy luật chưa đủ để kết luận; phải kiểm tra thêm ít nhất một cặp nữa.
Dãy đạt quy luật cộng hai số liền trước thì không thể là dãy cách đều (hiệu hai số liền nhau thay đổi).
@@vi_du
##VD
Tìm quy luật rồi viết thêm 3 số hạng của dãy: $5;\ 6;\ 11;\ 17;\ 28;\ \ldots$
**Hướng dẫn giải:**
Ta thấy $5+6=11$; $6+11=17$; $11+17=28$.
Quy luật: kể từ số hạng thứ ba, mỗi số hạng bằng tổng của hai số hạng liền trước.
Số hạng thứ sáu: $17+28=45$.
Số hạng thứ bảy: $28+45=73$.
Số hạng thứ tám: $45+73=118$.
Đáp số: 45; 73; 118.

##VD
Điền số thích hợp vào chỗ trống: $4;\ 7;\ 11;\ 18;\ \ldots;\ 47;\ 76$.
**Hướng dẫn giải:**
Ta thấy $4+7=11$; $7+11=18$ nên mỗi số hạng bằng tổng hai số hạng liền trước.
Số cần điền: $11+18=29$.
Kiểm tra: $18+29=47$; $29+47=76$, đúng.
Đáp số: 29.

=== NDB02966
@@mo_ta
Đề cho dãy số không cách đều mà hiệu của hai số hạng liền nhau tăng đều (hiệu lần lượt 1; 2; 3; … hoặc 9; 18; 27; … hoặc 3; 5; 7; …), yêu cầu viết thêm số hạng hoặc tìm số hạng đầu, số hạng cuối khi biết số lượng số hạng. Giải bằng cách lập dãy các hiệu và xem hiệu tăng thêm bao nhiêu mỗi lần. Khác dạng cộng hai số liền trước ở chỗ quy luật nằm ở dãy hiệu.
@@ly_thuyet
##TC
Nếu hiệu của hai số hạng liền nhau không bằng nhau thì dãy không cách đều; hãy viết dãy các hiệu ra.
Khi dãy các hiệu tăng đều (cộng thêm một số không đổi mỗi lần) thì số hạng sau bằng số hạng trước cộng với hiệu tiếp theo.
Dãy 0; 1; 3; 6; 10; 15; 21; … có hiệu lần lượt 1; 2; 3; 4; 5; 6; …

##PP
Tính hiệu của từng cặp số hạng liền nhau và viết dãy các hiệu.
Tìm quy luật của dãy hiệu (tăng đều bao nhiêu mỗi lần).
Viết tiếp các hiệu cần thiết rồi cộng vào số hạng cuối để được số hạng tiếp theo.
Tìm số hạng đầu: lùi dần, mỗi bước trừ đi hiệu tương ứng (hiệu phía trước nhỏ hơn hiệu phía sau).

##CY
Đếm đúng số lần lùi hoặc tiến; dãy có 10 số hạng thì có 9 hiệu.
Khi lùi về phía trước, các hiệu giảm dần theo đúng quy luật tăng đều, không đảo thứ tự.
@@vi_du
##VD
Viết thêm 3 số hạng của dãy: $0;\ 1;\ 3;\ 6;\ 10;\ 15;\ \ldots$
**Hướng dẫn giải:**
Hiệu của hai số hạng liền nhau: $1-0=1$; $3-1=2$; $6-3=3$; $10-6=4$; $15-10=5$.
Các hiệu tăng dần 1; 2; 3; 4; 5 nên các hiệu tiếp theo là 6; 7; 8.
Số hạng tiếp theo: $15+6=21$.
Số hạng tiếp theo: $21+7=28$.
Số hạng tiếp theo: $28+8=36$.
Đáp số: 21; 28; 36.

##VD
Dãy số có 10 số hạng, ba số hạng cuối là $\ldots;\ 63;\ 80;\ 99$ và hiệu của hai số hạng liền nhau tăng đều. Tìm số hạng đầu tiên của dãy.
**Hướng dẫn giải:**
Hiệu của hai số hạng liền nhau: $80-63=17$; $99-80=19$. Mỗi lần hiệu tăng thêm 2.
Dãy có 10 số hạng nên có 9 hiệu: 3; 5; 7; 9; 11; 13; 15; 17; 19.
Số hạng thứ 8 là 63. Lùi về phía đầu, trừ lần lượt các hiệu 15; 13; 11; 9; 7; 5; 3.
$63-15=48$
$48-13=35$
$35-11=24$
$24-9=15$
$15-7=8$
$8-5=3$
$3-3=0$
Vậy dãy là 0; 3; 8; 15; 24; 35; 48; 63; 80; 99.
Đáp số: 0.

=== NDB02967
@@mo_ta
Đề cho một dãy không cách đều mà mỗi số hạng được tính bằng số thứ tự của nó (1×1, 2×2, 3×3 hoặc 1×2, 2×3, 3×4, hoặc tích số thứ tự cộng/trừ một số cố định), hỏi số hạng thứ 50, thứ 100. Nhận ra mối liên hệ giữa số hạng và số thứ tự rồi thay số thứ tự cần tìm; khác dạng hiệu tăng đều ở chỗ không cần lần lượt qua các hiệu mà tính thẳng từ số thứ tự.
@@ly_thuyet
##TC
Dãy 1; 4; 9; 16; 25; … có số hạng thứ mấy bằng số thứ tự đó nhân với chính nó ($1\times1$; $2\times2$; $3\times3$; …).
Dãy 2; 6; 12; 20; 30; 42; … có số hạng thứ mấy bằng số thứ tự đó nhân với số liền sau ($1\times2$; $2\times3$; $3\times4$; …).
Một số dãy khác là các dãy trên cộng hoặc trừ một số cố định, ví dụ 2; 5; 10; 17; 26; … bằng $1\times1+1$; $2\times2+1$; $3\times3+1$; …

##PP
Lập bảng gồm số thứ tự và số hạng tương ứng cho vài số hạng đầu.
Tìm mối liên hệ giữa số thứ tự và số hạng (nhân với chính nó, nhân với số liền sau, rồi cộng hay trừ một số).
Kiểm tra mối liên hệ đó trên ít nhất 3 số hạng.
Thay số thứ tự cần tìm vào để tính số hạng.

##CY
Phải kiểm tra mối liên hệ trên mọi số hạng đã biết, không chỉ một hai số.
Cẩn thận số hạng nhân với số liền sau: thứ 50 là $50\times51$, không phải $50\times50$.
@@vi_du
##VD
Cho dãy số $1;\ 4;\ 9;\ 16;\ 25;\ \ldots$ Tìm số hạng thứ 100 của dãy.
**Hướng dẫn giải:**
Ta thấy $1=1\times1$; $4=2\times2$; $9=3\times3$; $16=4\times4$; $25=5\times5$.
Quy luật: số hạng thứ mấy bằng số thứ tự đó nhân với chính nó.
Số hạng thứ 100: $100\times100=10000$.
Đáp số: 10000.

##VD
Cho dãy số $2;\ 6;\ 12;\ 20;\ 30;\ 42;\ \ldots$ Tìm số hạng thứ 50 của dãy.
**Hướng dẫn giải:**
Ta thấy $2=1\times2$; $6=2\times3$; $12=3\times4$; $20=4\times5$; $30=5\times6$; $42=6\times7$.
Quy luật: số hạng thứ mấy bằng số thứ tự đó nhân với số liền sau của nó.
Số hạng thứ 50: $50\times51=2550$.
Đáp số: 2550.

=== NDB02968
@@mo_ta
Đề cho các chữ cái, màu sắc, hình vẽ… lặp đi lặp lại theo một nhóm cố định (chu kỳ) và hỏi chữ cái, màu hoặc hình ở vị trí thứ k lớn (thứ 2000, thứ 2025), hoặc đếm số lần xuất hiện. Đếm số phần tử của một nhóm, chia vị trí cần tìm cho số đó: số dư cho biết phần tử nào trong nhóm, dư 0 là phần tử cuối nhóm. Khác dạng bảng zigzag ở chỗ không có bảng, chỉ có chu kỳ lặp.
@@ly_thuyet
##TC
Dãy lặp theo nhóm có chu kỳ bằng số phần tử của một nhóm.
Vị trí cần tìm chia cho chu kỳ được thương và số dư; số dư cho biết phần tử đó đứng thứ mấy trong nhóm (dư 1 là phần tử đầu nhóm, dư 0 là phần tử cuối nhóm).

##PP
Viết ra một nhóm đầy đủ và đếm số phần tử của nhóm (chu kỳ).
Chia vị trí cần tìm cho chu kỳ để được thương và số dư.
Số dư khác 0 thì lấy phần tử đứng thứ (số dư) trong nhóm.
Số dư bằng 0 thì lấy phần tử cuối cùng của nhóm.
Nếu đề hỏi số lần xuất hiện thì thương là số nhóm trọn vẹn, nhân với số lần xuất hiện trong mỗi nhóm, rồi xem phần dư thêm nữa.

##CY
Dư 0 là phần tử cuối nhóm, không phải phần tử đầu.
Các cụm chữ ghép (QUYET TAM HOC GIOI) thì đếm tất cả chữ cái của mọi cụm trong một nhóm: 5 + 3 + 3 + 4 = 15.
@@vi_du
##VD
Viết lặp lại các chữ cái của câu QUYET TAM HOC GIOI thành dãy: QUYETTAMHOCGIOIQUYETTAMHOCGIOI… Chữ cái thứ 2000 của dãy là chữ gì?
**Hướng dẫn giải:**
Một nhóm gồm các chữ cái: QUYET (5 chữ), TAM (3 chữ), HOC (3 chữ), GIOI (4 chữ), tất cả $5+3+3+4=15$ (chữ cái).
Ta có $2000:15=133$ dư 5.
Vậy chữ cái thứ 2000 là chữ cái thứ 5 trong một nhóm.
Năm chữ cái đầu của nhóm là Q; U; Y; E; T nên chữ cái thứ 5 là T.
Đáp số: chữ T.

##VD
Tô màu lần lượt các tiếng theo thứ tự màu Xanh, Đỏ, Tím, Vàng, Nâu, rồi lại Xanh, Đỏ, Tím, Vàng, Nâu, … Tiếng thứ 2025 được tô màu gì?
**Hướng dẫn giải:**
Một nhóm có 5 màu: Xanh, Đỏ, Tím, Vàng, Nâu.
Ta có $2025:5=405$ dư 0.
Số dư bằng 0 nên tiếng thứ 2025 là tiếng cuối cùng của một nhóm, tức là màu cuối cùng của nhóm.
Đáp số: màu Nâu.

=== NDB02969
@@mo_ta
Đề cho các số tự nhiên liên tiếp được xếp vào bảng nhiều cột A, B, C, D (E…) theo kiểu rắn: hàng thứ nhất viết từ trái sang phải, hàng thứ hai từ phải sang trái, rồi lại luân phiên, và hỏi một số lớn (2024, 2025…) nằm ở cột nào. Tìm chu kỳ lặp của vị trí cột (gồm một lượt đi và một lượt về), chia số cần tìm cho chu kỳ rồi dựa vào số dư tra cột. Khác dạng chu kỳ chữ, màu ở chỗ phải theo đường đi lên xuống của bảng.
@@ly_thuyet
##TC
Với bảng xếp kiểu rắn, hàng viết từ trái sang phải rồi hàng kế viết từ phải sang trái; một lượt đi và một lượt về gồm số số bằng 2 lần số cột, đó là chu kỳ của vị trí cột.
Trong một chu kỳ, các cột lần lượt là A; B; C; D (đi) rồi D; C; B; A (về) nếu bảng có 4 cột.

##PP
Viết vài hàng đầu của bảng để thấy quy luật và tìm chu kỳ (bằng 2 lần số cột).
Liệt kê thứ tự cột của một chu kỳ.
Chia số cần tìm cho chu kỳ, lấy số dư.
Số dư khác 0 thì lấy cột đứng thứ (số dư) trong thứ tự của chu kỳ; số dư 0 thì lấy cột cuối của chu kỳ.

##CY
Số dư 0 ứng với cột cuối của lượt về (cột A đối với bảng 4 cột).
Phải đọc kỹ hàng thứ nhất viết từ trái sang phải hay từ phải sang trái.
@@vi_du
##VD
Xếp các số tự nhiên liên tiếp từ 1 vào bảng có 4 cột A, B, C, D theo kiểu: hàng 1 viết từ trái sang phải (1; 2; 3; 4), hàng 2 viết từ phải sang trái (5 ở cột D; 6 ở cột C; 7 ở cột B; 8 ở cột A), hàng 3 lại viết từ trái sang phải, … Số 2025 nằm ở cột nào?
**Hướng dẫn giải:**
Hai hàng liên tiếp có $4+4=8$ số, các cột lặp lại theo chu kỳ 8: A; B; C; D; D; C; B; A.
Ta có $2025:8=253$ dư 1.
Số dư 1 nên số 2025 nằm ở vị trí đầu tiên của một chu kỳ, tức là cột A.
Đáp số: cột A.

##VD
Xếp các số tự nhiên liên tiếp từ 1 vào bảng có 5 cột A, B, C, D, E theo kiểu: hàng 1 viết từ trái sang phải (1 đến 5), hàng 2 viết từ phải sang trái (6 ở cột E; 7 ở cột D; …; 10 ở cột A), hàng 3 lại viết từ trái sang phải, … Số 2024 nằm ở cột nào?
**Hướng dẫn giải:**
Hai hàng liên tiếp có $5+5=10$ số, các cột lặp lại theo chu kỳ 10: A; B; C; D; E; E; D; C; B; A.
Ta có $2024:10=202$ dư 4.
Vị trí thứ 4 trong chu kỳ là cột D.
Đáp số: cột D.

=== NDB02970
@@mo_ta
Đề cho dãy số tự nhiên liên tiếp (từ 1 đến 2024, các số hai chữ số…) và hỏi có bao nhiêu số chia hết cho một số nhưng không chia hết cho số khác (chia hết cho 2 mà không chia hết cho 3, chia hết cho 3 mà không chia hết cho 5…). Đếm các số chia hết cho số thứ nhất, trừ đi các số chia hết cho cả hai số (loại trừ). Dùng phép chia lấy phần nguyên hoặc công thức số số hạng của dãy cách đều.
@@ly_thuyet
##TC
Số các số chia hết cho một số trong dãy từ 1 đến một số cho trước bằng thương (bỏ phần dư) của phép chia số cho trước đó cho số kia.
Số các số chia hết cho một số trong khoảng từ số đầu đến số cuối: các số đó lập thành dãy cách đều có khoảng cách bằng chính số đó, dùng công thức số số hạng.
Chia hết cho cả 2 và 3 thì chia hết cho 6; chia hết cho cả 2 và 5 thì chia hết cho 10; chia hết cho cả 3 và 5 thì chia hết cho 15.

##PP
Tìm số các số chia hết cho số thứ nhất (số cần chia hết).
Tìm số các số chia hết cho cả hai số (chia hết cho tích của hai số, khi hai số không có thừa số chung).
Số các số chia hết cho số thứ nhất mà không chia hết cho số thứ hai = số các số chia hết cho số thứ nhất − số các số chia hết cho cả hai.
Bài "xoá hai lần rồi hỏi còn lại" thì vẽ sơ đồ nhóm: chia hết cả hai, chỉ chia hết số thứ nhất, chỉ chia hết số thứ hai, không chia hết số nào.

##CY
Phép chia $2024:6=337$ dư 2 nghĩa là có 337 số chia hết cho 6, bỏ phần dư.
Chỉ ghép "chia hết cho cả hai" thành chia hết cho tích khi hai số không có thừa số chung (2 và 3; 2 và 5; 3 và 5 thì được).
@@vi_du
##VD
Trong các số tự nhiên từ 1 đến 2024, có bao nhiêu số chia hết cho 2 nhưng không chia hết cho 3?
**Hướng dẫn giải:**
Số các số chia hết cho 2: $2024:2=1012$ (số).
Số chia hết cho cả 2 và 3 là số chia hết cho 6; số các số chia hết cho 6: $2024:6=337$ dư 2 nên có 337 số.
Số các số chia hết cho 2 mà không chia hết cho 3: $1012-337=675$ (số).
Đáp số: 675 số.

##VD
Có bao nhiêu số tự nhiên có hai chữ số chia hết cho 3 nhưng không chia hết cho 5?
**Hướng dẫn giải:**
Các số có hai chữ số chia hết cho 3 là 12; 15; …; 99, có $(99-12):3+1=30$ (số).
Các số chia hết cho cả 3 và 5 là các số chia hết cho 15: 15; 30; 45; 60; 75; 90, có $(90-15):15+1=6$ (số).
Số các số chia hết cho 3 mà không chia hết cho 5: $30-6=24$ (số).
Đáp số: 24 số.
