=== NDB01819
@@mo_ta
Đề cho một đại lượng không đổi (tổng số tiền, quãng đường, khối lượng công việc) và hai đại lượng biến thiên ngược chiều, ví dụ giá một gói bánh và số gói mua được. Biết một cặp giá trị ban đầu, hỏi giá trị còn lại khi đại lượng kia đổi sang số mới. Cách giải gọn là tính đại lượng không đổi trước rồi chia cho giá trị mới. Khác tỉ lệ kép ở chỗ chỉ có một đại lượng thay đổi.
@@ly_thuyet
##ĐN
Hai đại lượng gọi là tỉ lệ nghịch khi đại lượng này tăng lên bao nhiêu lần thì đại lượng kia giảm đi bấy nhiêu lần, và tích của hai đại lượng luôn không đổi.

##TC
Giá một gói $\times$ số gói mua được $=$ số tiền không đổi. Vì vậy biết số tiền thì: số gói $=$ số tiền $:$ giá một gói.
Tương tự: vận tốc $\times$ thời gian $=$ quãng đường; số người $\times$ số ngày $=$ khối lượng công việc.

##PP
Nhận ra đại lượng nào không đổi (số tiền, quãng đường, công việc).
Tính đại lượng không đổi bằng cách nhân hai giá trị của cặp đã biết.
Lấy đại lượng không đổi chia cho giá trị mới để tìm giá trị cần hỏi.
Đối chiếu: giá giảm thì mua được nhiều hơn, giá tăng thì mua được ít hơn.

##CY
Không dùng cách tính của tỉ lệ thuận (giá giảm mà số gói cũng giảm là sai chiều).
Luôn kiểm lại hướng thay đổi của đáp số trước khi viết đáp số.
@@vi_du
##VD
Một người mua 12 gói bánh, giá 10 000 đồng một gói thì vừa hết số tiền đang có. Cũng với số tiền đó nếu mua gói bánh với giá 8 000 đồng một gói thì người đó mua được bao nhiêu gói bánh?
**Hướng dẫn giải:**
Số tiền người đó có là: $10000\times 12=120000$ (đồng)
Với giá $8000$ đồng một gói, người đó mua được số gói bánh là: $120000:8000=15$ (gói)
Đáp số: $15$ gói bánh

=== NDB01820
@@mo_ta
Đề cho một nhóm người làm trong một số ngày được một khối lượng việc nào đó, rồi đổi cả số người và số ngày cùng lúc, hỏi làm được bao nhiêu sản phẩm (hoặc cần bao nhiêu ngày, bao nhiêu người). Năng suất mỗi người như nhau. Giải bằng cách rút về đơn vị hai lần để tìm một người làm một ngày. Khác tỉ lệ nghịch cơ bản ở chỗ hai đại lượng thay đổi cùng lúc.
@@ly_thuyet
##ĐN
Bài toán tỉ lệ kép là bài toán trong đó kết quả phụ thuộc vào hai đại lượng cùng thay đổi, ví dụ số sản phẩm phụ thuộc cả số người và số ngày làm việc.

##TC
Khi năng suất mỗi người như nhau: số sản phẩm $=$ năng suất của 1 người trong 1 ngày $\times$ số người $\times$ số ngày.
Số sản phẩm tỉ lệ thuận với số người và tỉ lệ thuận với số ngày. Còn số người tỉ lệ nghịch với số ngày khi khối lượng công việc không đổi.

##PP
Rút về một người: lấy số sản phẩm chia cho số người để biết 1 người làm trong số ngày đã cho được bao nhiêu.
Rút về một ngày: lấy kết quả trên chia cho số ngày để biết 1 người làm trong 1 ngày được bao nhiêu.
Nhân năng suất của 1 người trong 1 ngày với số người mới rồi nhân với số ngày mới.
Nếu đề hỏi số ngày hoặc số người thì lấy khối lượng công việc chia cho phần việc của 1 người trong 1 ngày rồi chia tiếp cho đại lượng còn lại.

##CY
Phải rút về đơn vị đủ hai lần (một người, một ngày) rồi mới nhân lên, không được nhân chéo ngay.
Hỏi số ngày hoặc số người thì cuối cùng là phép chia, không phải phép nhân.
@@vi_du
##VD
Một tổ công nhân có 9 người trong 4 ngày làm được 72 sản phẩm. Hỏi nếu tổ có 12 người trong 5 ngày thì làm được bao nhiêu sản phẩm? Biết năng suất mỗi người như nhau.
**Hướng dẫn giải:**
1 người làm trong 4 ngày được số sản phẩm là: $72:9=8$ (sản phẩm)
1 người làm trong 1 ngày được số sản phẩm là: $8:4=2$ (sản phẩm)
12 người làm trong 5 ngày được số sản phẩm là: $2\times 12\times 5=120$ (sản phẩm)
Đáp số: 120 sản phẩm

##VD
Một đội có 8 người làm xong một công việc trong 15 ngày. Hỏi nếu đội có 10 người, năng suất mỗi người như nhau, thì làm xong công việc đó trong bao nhiêu ngày?
**Hướng dẫn giải:**
Công việc cần số ngày làm của 1 người là: $8\times 15=120$ (ngày)
10 người làm xong công việc trong: $120:10=12$ (ngày)
Đáp số: 12 ngày

=== NDB01821
@@mo_ta
Đề cho dự định (số người, số sản phẩm) rồi nói thực tế có người chuyển đi hoặc nhận thêm nên số sản phẩm thay đổi, hỏi số người bớt đi hoặc thêm vào. Mức làm của mỗi người như nhau nên số sản phẩm tỉ lệ thuận với số người. Giải bằng cách rút về một người, tìm số người lúc sau rồi so với lúc đầu. Khác tỉ lệ kép ở chỗ thời gian không đổi.
@@ly_thuyet
##TC
Khi mức làm của mỗi người như nhau và thời gian làm như nhau thì số sản phẩm tỉ lệ thuận với số người: số người gấp lên bao nhiêu lần thì số sản phẩm gấp lên bấy nhiêu lần.
Số sản phẩm của 1 người $=$ số sản phẩm của cả nhóm $:$ số người của nhóm.

##PP
Dựa vào dự định hoặc dữ kiện lúc đầu, chia số sản phẩm cho số người để tìm 1 người làm được bao nhiêu sản phẩm.
Chia số sản phẩm lúc sau cho số sản phẩm của 1 người để tìm số người lúc sau.
So sánh số người lúc sau với số người lúc đầu: lấy số người lớn trừ số người nhỏ.
Đọc lại câu hỏi để biết cần số người chuyển đi, số người nhận thêm hay số người còn lại.

##CY
Số người tìm được sau phép chia thứ hai là số người lúc sau, chưa chắc là đáp số.
Nếu sản phẩm tăng thì người nhận thêm, nếu sản phẩm giảm thì người chuyển đi: dùng để kiểm tra kết quả.
@@vi_du
##VD
Một nhà máy dự định cứ 15 người sản xuất được 450 sản phẩm. Nhưng thực tế có một số người chuyển đi làm việc khác nên đã sản xuất được 360 sản phẩm. Hỏi có bao nhiêu người chuyển đi? Biết mức làm của mỗi người là như nhau.
**Hướng dẫn giải:**
Một người sản xuất được số sản phẩm là: $450:15=30$ (sản phẩm)
Số người sản xuất được $360$ sản phẩm là: $360:30=12$ (người)
Số người chuyển đi làm việc khác là: $15-12=3$ (người)
Đáp số: $3$ người

##VD
Một tổ công nhân có 21 người nhận làm 273 sản phẩm. Nhưng khi bắt đầu làm tổ đó đã nhận thêm một số người nữa nên đã làm được 312 sản phẩm. Hỏi tổ đó đã nhận thêm bao nhiêu người? Biết năng suất làm việc của mỗi người trong một ngày như nhau.
**Hướng dẫn giải:**
Một người làm được số sản phẩm là: $273:21=13$ (sản phẩm)
Số người làm được $312$ sản phẩm là: $312:13=24$ (người)
Số người tổ đó đã nhận thêm là: $24-21=3$ (người)
Đáp số: $3$ người

=== NDB01822
@@mo_ta
Đề cho thời gian mỗi người (hoặc mỗi vòi nước) làm riêng xong cả công việc, hỏi phần việc làm chung trong một đơn vị thời gian hoặc thời gian làm chung xong; cũng có thể cho thời gian làm chung và một người, hỏi người còn lại, hoặc có vòi tháo nước ra. Giải bằng cách coi cả công việc là 1 và tính phần việc mỗi người làm trong một đơn vị thời gian. Khác dạng đổi người giữa chừng ở chỗ mọi người làm cùng một lúc.
@@ly_thuyet
##TC
Coi cả công việc (cả bể) là $1$. Nếu làm một mình xong trong $a$ giờ thì mỗi giờ làm được $1:a=\dfrac{1}{a}$ công việc.
Cùng làm một lúc thì phần việc mỗi giờ của cả nhóm $=$ tổng các phần việc mỗi giờ của từng người (vòi chảy vào thì cộng, vòi tháo ra thì trừ).
Thời gian làm xong $=1:$ phần việc làm trong 1 giờ.

##PP
Coi cả công việc là $1$, tính mỗi người (mỗi vòi) làm trong 1 giờ được mấy phần công việc.
Cộng các phần việc trong 1 giờ (trừ đi nếu là vòi tháo nước) để được phần việc làm chung trong 1 giờ.
Lấy $1$ chia cho phần việc làm chung trong 1 giờ để tìm thời gian làm chung xong.
Nếu biết làm chung và một người thì lấy phần việc chung trừ phần việc của người đó để tìm người còn lại.

##CY
Không lấy tổng thời gian chia cho 2 hoặc cộng thời gian của hai người.
Quy đồng mẫu số trước khi cộng, trừ các phân số.
Vòi tháo nước ra thì phải trừ chứ không cộng.
@@vi_du
##VD
Người ta mở hai vòi nước cùng chảy vào một bể không có nước. Nếu mở riêng vòi thứ nhất thì sau 15 giờ đầy bể, nếu mở riêng vòi thứ hai thì sau 10 giờ đầy bể. Hỏi sau một giờ mở cả hai vòi thì bao nhiêu phần bể có nước?
**Hướng dẫn giải:**
Trong $1$ giờ, vòi thứ nhất chảy được: $1:15=\dfrac{1}{15}$ (bể)
Trong $1$ giờ, vòi thứ hai chảy được: $1:10=\dfrac{1}{10}$ (bể)
Sau $1$ giờ mở cả hai vòi thì lượng nước chiếm: $\dfrac{1}{15}+\dfrac{1}{10}=\dfrac{2}{30}+\dfrac{3}{30}=\dfrac{5}{30}=\dfrac{1}{6}$ (bể)
Đáp số: $\dfrac{1}{6}$ bể

##VD
Một bể có hai cái vòi, vòi A chảy vào bể và vòi B tháo nước ra. Khi bể đang cạn, nếu chỉ mở vòi A thì sau 5 giờ đầy bể. Khi bể đang đầy, nếu chỉ mở vòi B thì sau 6 giờ bể cạn. Hỏi khi bể đang cạn, nếu mở cả hai vòi thì sau bao lâu đầy bể?
**Hướng dẫn giải:**
Trong $1$ giờ, vòi A chảy vào được: $1:5=\dfrac{1}{5}$ (bể)
Trong $1$ giờ, vòi B tháo ra được: $1:6=\dfrac{1}{6}$ (bể)
Trong $1$ giờ, mở cả hai vòi thì lượng nước trong bể tăng thêm: $\dfrac{1}{5}-\dfrac{1}{6}=\dfrac{1}{30}$ (bể)
Thời gian để bể đầy là: $1:\dfrac{1}{30}=30$ (giờ)
Đáp số: $30$ giờ

=== NDB01823
@@mo_ta
Công việc được chia thành hai đoạn với những người làm khác nhau: lúc đầu cả nhóm cùng làm, sau đó một người nghỉ hoặc có người mới đến. Đề cho thời gian từng đoạn và hỏi một người làm riêng xong sau bao lâu. Giải bằng cách tính phần việc đã làm ở đoạn đầu, lấy 1 trừ đi để ra phần việc đoạn sau, suy ra phần việc mỗi giờ của người cần tìm.
@@ly_thuyet
##TC
Coi cả công việc là $1$. Phần việc đã làm $=$ phần việc mỗi giờ $\times$ số giờ làm.
Phần việc còn lại $=1-$ phần việc đã làm.
Phần việc của một người trong 1 giờ $=$ phần việc chung trong 1 giờ $-$ phần việc của người kia trong 1 giờ.

##PP
Đọc kỹ từng đoạn: ai làm, làm bao lâu.
Tính phần việc mỗi giờ của người hoặc nhóm đã biết, rồi nhân với số giờ để được phần việc đoạn đó.
Lấy $1$ trừ phần việc đã làm để được phần việc còn lại, chia cho số giờ đoạn sau để được phần việc mỗi giờ của người làm đoạn sau.
Tìm người còn lại bằng cách lấy phần việc chung trừ phần việc của người đã biết.
Lấy $1$ chia cho phần việc mỗi giờ để tìm thời gian làm một mình.

##CY
Phần việc làm được ở đoạn đầu và đoạn sau cộng lại phải bằng $1$: dùng để kiểm lại kết quả.
Đoạn sau chỉ một người làm thì chia phần việc còn lại cho thời gian của đoạn đó, không chia cho cả nhóm.
@@vi_du
##VD
Hai người thợ cùng làm chung một công việc thì sau 5 giờ sẽ xong. Sau khi làm được 3 giờ thì người thợ cả bận nên để người thợ phụ hoàn thành nốt việc đó trong 6 giờ. Hỏi người thợ phụ làm một mình thì sau bao lâu sẽ xong việc đó?
**Hướng dẫn giải:**
Trong $1$ giờ, hai thợ cùng làm được: $1:5=\dfrac{1}{5}$ (công việc)
Trong $3$ giờ, hai thợ cùng làm được: $\dfrac{1}{5}\times 3=\dfrac{3}{5}$ (công việc)
Phần việc thợ phụ làm nốt là: $1-\dfrac{3}{5}=\dfrac{2}{5}$ (công việc)
Trong $1$ giờ, thợ phụ làm được: $\dfrac{2}{5}:6=\dfrac{2}{30}=\dfrac{1}{15}$ (công việc)
Thợ phụ làm một mình thì xong việc sau: $1:\dfrac{1}{15}=15$ (giờ)
Đáp số: $15$ giờ

##VD
Anh dọn nhà một mình thì sau 10 phút sẽ xong. Khi người anh làm được 5 phút thì em đến làm cùng nên cả hai anh em làm tiếp trong 3 phút là xong. Hỏi nếu em làm một mình thì sau bao lâu sẽ xong việc dọn nhà?
**Hướng dẫn giải:**
Trong $1$ phút, anh làm được: $1:10=\dfrac{1}{10}$ (công việc)
Trong $5$ phút, anh làm được: $\dfrac{1}{10}\times 5=\dfrac{1}{2}$ (công việc)
Phần việc hai anh em cùng làm là: $1-\dfrac{1}{2}=\dfrac{1}{2}$ (công việc)
Trong $1$ phút, hai anh em cùng làm được: $\dfrac{1}{2}:3=\dfrac{1}{6}$ (công việc)
Trong $1$ phút, em làm được: $\dfrac{1}{6}-\dfrac{1}{10}=\dfrac{1}{15}$ (công việc)
Nếu em làm một mình thì xong việc dọn nhà sau: $1:\dfrac{1}{15}=15$ (phút)
Đáp số: $15$ phút

=== NDB01824
@@mo_ta
Đề cho phần việc làm chung của từng cặp (A và B, B và C, C và A), hoặc cho hai tình huống làm việc có số giờ khác nhau của hai người, rồi hỏi thời gian làm riêng của một người hoặc của cả ba người. Giải bằng cách cộng hoặc trừ các dòng dữ kiện để khử bớt một đại lượng chưa biết, chỉ còn lại đại lượng cần tìm. Khác bài công việc chung riêng cơ bản ở chỗ không có ai cho riêng thời gian làm một mình.
@@ly_thuyet
##TC
Phương pháp khử là so sánh hoặc cộng, trừ các dữ kiện để loại bỏ dần các đại lượng chưa biết, chỉ giữ lại một đại lượng rồi tính ngược trở lại các đại lượng còn lại.
Nếu biết phần việc của từng cặp trong một giờ thì cộng cả ba cặp, mỗi người được tính hai lần, nên phần việc cả nhóm trong 1 giờ bằng tổng đó chia cho $2$.

##PP
Tính phần việc mỗi giờ của từng nhóm hai người: lấy $1$ chia cho thời gian đề cho.
Cộng ba phần việc đó lại (mỗi người xuất hiện hai lần) rồi chia cho $2$ để được phần việc cả ba người làm trong 1 giờ.
Lấy phần việc cả ba trừ phần việc của cặp không có người cần tìm để ra phần việc mỗi giờ của người đó.
Lấy $1$ chia cho phần việc mỗi giờ để tìm thời gian làm một mình.
Với bài hai người và hai tình huống: đưa hai tình huống về cùng số giờ của một người rồi lấy hiệu hai dòng để khử người đó.

##CY
Đừng quên chia cho $2$ sau khi cộng ba cặp, vì mỗi người được tính hai lần.
Sau khi tìm xong từng người, thử lại bằng cách cộng hai người xem có đúng phần việc của cặp đề cho không.
@@vi_du
##VD
Ba đội A, B, C cùng sửa một đoạn đường. Nếu đội A và đội B cùng làm thì sau 12 ngày xong; đội B và đội C cùng làm thì sau 15 ngày xong; đội C và đội A cùng làm thì sau 20 ngày xong. Hỏi nếu một mình đội A làm thì sau bao nhiêu ngày xong đoạn đường?
**Hướng dẫn giải:**
Trong $1$ ngày, đội A và đội B làm được: $1:12=\dfrac{1}{12}$ (đoạn đường)
Trong $1$ ngày, đội B và đội C làm được: $1:15=\dfrac{1}{15}$ (đoạn đường)
Trong $1$ ngày, đội C và đội A làm được: $1:20=\dfrac{1}{20}$ (đoạn đường)
Hai lần phần việc của ba đội làm trong $1$ ngày là: $\dfrac{1}{12}+\dfrac{1}{15}+\dfrac{1}{20}=\dfrac{5}{60}+\dfrac{4}{60}+\dfrac{3}{60}=\dfrac{12}{60}=\dfrac{1}{5}$ (đoạn đường)
Trong $1$ ngày, cả ba đội làm được: $\dfrac{1}{5}:2=\dfrac{1}{10}$ (đoạn đường)
Trong $1$ ngày, đội A làm được: $\dfrac{1}{10}-\dfrac{1}{15}=\dfrac{3}{30}-\dfrac{2}{30}=\dfrac{1}{30}$ (đoạn đường)
Một mình đội A làm xong đoạn đường sau: $1:\dfrac{1}{30}=30$ (ngày)
Đáp số: $30$ ngày

##VD
Hai người thợ cùng làm chung thì sau 12 giờ xong một công việc. Nếu người thứ nhất làm 2 giờ và người thứ hai làm 3 giờ thì được $\dfrac{1}{5}$ công việc. Hỏi nếu làm riêng thì người thứ hai làm xong công việc đó sau bao lâu?
**Hướng dẫn giải:**
Trong $1$ giờ, hai người cùng làm được: $1:12=\dfrac{1}{12}$ (công việc)
Trong $2$ giờ, hai người cùng làm được: $\dfrac{1}{12}\times 2=\dfrac{1}{6}$ (công việc)
Phần việc của người thứ hai làm trong $1$ giờ là: $\dfrac{1}{5}-\dfrac{1}{6}=\dfrac{6}{30}-\dfrac{5}{30}=\dfrac{1}{30}$ (công việc)
Người thứ hai làm một mình xong công việc sau: $1:\dfrac{1}{30}=30$ (giờ)
Đáp số: $30$ giờ

=== NDB02767
@@mo_ta
Đề yêu cầu tính giá trị biểu thức chỉ gồm các tỉ số phần trăm (cộng, trừ, nhân, chia hai hoặc ba tỉ số phần trăm), thường yêu cầu viết kết quả dưới dạng số thập phân hoặc phần trăm. Cộng trừ thì tính trực tiếp trên phần số, nhân chia thì đổi ra số thập phân trước. Khác dạng tính thuận tiện ở chỗ chỉ cần tính trực tiếp, không cần nhóm số.
@@ly_thuyet
##TC
Một tỉ số phần trăm là một phân số có mẫu số $100$: $a\%=\dfrac{a}{100}$. Đổi ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số, chẳng hạn $77\%=0,77$.
Cộng, trừ hai tỉ số phần trăm: cộng, trừ hai số rồi giữ dấu $\%$, chẳng hạn $25\%+15\%=40\%$.

##PP
Với phép cộng, trừ: tính phần số rồi viết dấu $\%$ vào kết quả.
Với phép nhân, chia: đổi từng tỉ số phần trăm ra số thập phân.
Nhân hoặc chia hai số thập phân.
Viết kết quả đúng dạng đề yêu cầu: số thập phân thì không có dấu $\%$, phần trăm thì nhân kết quả với $100$ rồi thêm dấu $\%$.

##CY
Chia hai tỉ số phần trăm cho nhau ra một số bình thường, không còn dấu $\%$, vì $77\%:10\%=0,77:0,1=7,7$.
Nhân hai tỉ số phần trăm thì không nhân phần số rồi giữ dấu $\%$: $50\%\times 50\%=0,5\times 0,5=0,25=25\%$, không phải $2500\%$.
@@vi_du
##VD
Điền vào chỗ trống (viết kết quả dưới dạng số thập phân):
$77\%:10\%$
**Hướng dẫn giải:**
$77\%:10\%$
$=0,77:0,1$
$=7,7$

##VD
Điền vào chỗ trống (viết kết quả dưới dạng số thập phân):
$170\%\times 50\%$
**Hướng dẫn giải:**
$170\%\times 50\%$
$=1,7\times 0,5$
$=0,85$

=== NDB02768
@@mo_ta
Đề yêu cầu tính nhanh hoặc tính bằng cách thuận tiện một biểu thức có chứa tỉ số phần trăm, trong đó có thể nhóm các số hoặc đặt thừa số chung để được tổng $100\%$ hay tích tròn. Dựa vào các cặp như $25\%$ và $4$, $12,5\%$ và $8$, hoặc hai tỉ số có tổng bằng $100\%$. Khác dạng tính trực tiếp ở chỗ phải nhìn ra cách nhóm để tính ít bước.
@@ly_thuyet
##TC
Tính chất phân phối: $a\times m+b\times m=(a+b)\times m$. Với tỉ số phần trăm có thể đặt thừa số chung rồi cộng hai tỉ số phần trăm.
Một số cặp đáng nhớ: $25\%\times 4=1$ · $50\%\times 2=1$ · $12,5\%\times 8=1$ · $20\%\times 5=1$ · $10\%\times 10=1$ · hai tỉ số có tổng $100\%$ thì tổng bằng $1$ lần số chung.

##PP
Quan sát biểu thức để tìm thừa số chung hoặc hai số nhân với nhau được $1$, $10$, $100$.
Dùng tính chất giao hoán, kết hợp để nhóm hai số đó lại.
Tính phần đã nhóm trước, sau đó nhân với các số còn lại.

##CY
Khi cộng hai tỉ số phần trăm đặt thừa số chung, nhớ đổi $100\%=1$.
Nhìn kỹ dấu của biểu thức, chỉ nhóm khi các phép tính cùng loại.
@@vi_du
##VD
Tính bằng cách thuận tiện: $35\%\times 48+65\%\times 48$
**Hướng dẫn giải:**
$35\%\times 48+65\%\times 48$
$=(35\%+65\%)\times 48$
$=100\%\times 48$
$=1\times 48=48$

##VD
Tính bằng cách thuận tiện: $12,5\%\times 3,7\times 8$
**Hướng dẫn giải:**
$12,5\%\times 3,7\times 8$
$=3,7\times(12,5\%\times 8)$
$=3,7\times(0,125\times 8)$
$=3,7\times 1=3,7$

=== NDB02769
@@mo_ta
Đề cho một số (số tiền, khối lượng, quãng đường...) và một tỉ số phần trăm, hỏi giá trị bằng tỉ số phần trăm đó của số đã cho: lệ phí, tiền lãi, số học sinh giỏi... Giải bằng phép nhân số đã cho với tỉ số phần trăm. Khác dạng tìm một số biết phần trăm của nó ở chỗ đã biết cả số lớn, cần tìm phần.
@@ly_thuyet
##TC
Tìm $a\%$ của số $M$: lấy $M\times a\%$. Vì $a\%=\dfrac{a}{100}$ nên có thể đổi $a\%$ ra số thập phân (dịch dấu phẩy sang trái hai chữ số) rồi nhân.
Chẳng hạn $15\%$ của $345$ là $345\times 15\%=345\times 0,15=51,75$.

##PP
Xác định số đã cho (cả) và tỉ số phần trăm cần lấy.
Viết phép nhân: số đã cho nhân với tỉ số phần trăm.
Đổi tỉ số phần trăm ra số thập phân rồi nhân.
Viết kết quả kèm đơn vị của số đã cho.

##CY
Cụm từ "của" trong đề báo hiệu phép nhân.
Nếu đề hỏi số tiền cả giá lẫn lệ phí thì phải cộng thêm phần vừa tìm vào số ban đầu.
@@vi_du
##VD
Giá tiền của một chiếc xe ô tô Honda Civic E là 730 000 000 đồng. Lệ phí trước bạ là 10%. Tính lệ phí trước bạ cần trả cho chiếc xe trên.
**Hướng dẫn giải:**
Lệ phí trước bạ cần trả cho chiếc xe là: $730000000\times 10\%=73000000$ (đồng)
Đáp số: $73000000$ đồng

##VD
Tính:
$15\%$ của 345 km
**Hướng dẫn giải:**
$15\%$ của $345$ km
$=345\times 15\%$
$=345\times 0,15$
$=51,75$ (km)

=== NDB02770
@@mo_ta
Đề cho giá trị của một phần (số kg dầu, số gà trống, số học sinh nữ...) và tỉ số phần trăm mà phần đó chiếm trong cả, hỏi giá trị của cả. Giải bằng phép chia giá trị của phần cho tỉ số phần trăm. Khác dạng tìm phần trăm của một số ở chỗ phép tính là phép chia, không phải phép nhân.
@@ly_thuyet
##TC
Biết $b\%$ của một số là $M$ thì số đó bằng $M:b\%$.
Chẳng hạn $12$ con gà trống chiếm $25\%$ cả đàn thì cả đàn có $12:25\%=48$ con.

##PP
Đọc đề để tìm giá trị của phần đã biết và tỉ số phần trăm của nó so với cả.
Viết phép chia: giá trị của phần chia cho tỉ số phần trăm.
Đổi tỉ số phần trăm ra số thập phân rồi chia.
Đổi đơn vị nếu đề hỏi bằng đơn vị khác, rồi viết đáp số.

##CY
Không nhân giá trị đã biết với tỉ số phần trăm: $12\times 25\%=3$ là sai vì $12$ không phải cả đàn.
Thử lại: lấy kết quả nhân với tỉ số phần trăm phải ra giá trị của phần.
@@vi_du
##VD
Đậu phộng đem ép thì được 35% dầu ăn. Hỏi để có 70 kg dầu ăn thì phải đem ép bao nhiêu tạ đậu phộng?
**Hướng dẫn giải:**
Số đậu phộng cần đem ép là: $70:35\%=200$ (kg)
Đổi: $200$ kg $=2$ tạ
Đáp số: $2$ tạ đậu phộng

##VD
Một đàn gà có số gà trống là 12 con, chiếm 25% tổng số gà trong đàn. Tính tổng số gà của đàn gà đó.
**Hướng dẫn giải:**
Tổng số gà của đàn gà là: $12:25\%=48$ (con)
Đáp số: $48$ con

=== NDB03000
@@mo_ta
Đề yêu cầu viết một số thập phân hoặc phân số dưới dạng tỉ số phần trăm, hoặc ngược lại viết một tỉ số phần trăm dưới dạng phân số (tối giản) hay số thập phân. Dùng quan hệ $a\%=\dfrac{a}{100}$ để đổi qua lại. Khác dạng tính tỉ số phần trăm của hai đại lượng ở chỗ đề cho sẵn số, không có hai đại lượng để so sánh.
@@ly_thuyet
##TC
$a\%=\dfrac{a}{100}$. Đổi tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số: $35\%=0,35$.
Đổi số thập phân ra tỉ số phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số rồi viết thêm dấu $\%$: $0,45=45\%$.
Đổi phân số ra tỉ số phần trăm: viết phân số thành số thập phân (chia tử cho mẫu), rồi đổi ra phần trăm.

##PP
Số thập phân sang phần trăm: dịch dấu phẩy sang phải hai chữ số, thêm dấu $\%$.
Phân số sang phần trăm: chia tử số cho mẫu số ra số thập phân, hoặc quy đồng về mẫu $100$ nếu được, rồi đổi sang phần trăm.
Phần trăm sang phân số: viết $a\%=\dfrac{a}{100}$ rồi rút gọn về phân số tối giản.
Phần trăm sang số thập phân: dịch dấu phẩy sang trái hai chữ số.

##CY
Số lớn hơn $1$ khi đổi ra phần trăm sẽ lớn hơn $100\%$, chẳng hạn $1,2=120\%$.
Tỉ số phần trăm có phần thập phân (như $6,25\%$) khi đổi ra phân số phải đổi $6,25\%=0,0625$ rồi mới viết phân số.
@@vi_du
##VD
Viết các số sau dưới dạng tỉ số phần trăm:
a) $0,45$
b) $\dfrac{3}{20}$
c) $\dfrac{7}{8}$
d) $1,2$
**Hướng dẫn giải:**
a) $0,45=45\%$

b) $\dfrac{3}{20}=\dfrac{15}{100}=15\%$

c) $\dfrac{7}{8}=7:8=0,875=87,5\%$

d) $1,2=120\%$

##VD
Viết các tỉ số phần trăm sau dưới dạng phân số tối giản và dưới dạng số thập phân:
a) $35\%$
b) $6,25\%$
**Hướng dẫn giải:**
a) $35\%=\dfrac{35}{100}=\dfrac{7}{20}=0,35$

b) $6,25\%=0,0625=\dfrac{625}{10000}=\dfrac{1}{16}$

=== NDB03001
@@mo_ta
Đề cho hai số (đại lượng) và hỏi số này chiếm bao nhiêu phần trăm số kia, hoặc số này bằng bao nhiêu phần trăm số kia, hơn kém nhau bao nhiêu phần trăm. Giải bằng cách lấy số được so sánh chia cho số gốc rồi đổi kết quả ra phần trăm. Khác dạng tìm phần trăm của một số ở chỗ biết cả hai số, tìm tỉ số.
@@ly_thuyet
##TC
Tỉ số phần trăm của $a$ và $b$ là $a:b$ rồi nhân với $100$ và viết thêm dấu $\%$: $a:b=0,85=85\%$.
Số gốc (số đứng sau từ "của", "so với") là số chia.
Hơn kém nhau bao nhiêu phần trăm: lấy tỉ số phần trăm của hai số rồi so với $100\%$.

##PP
Xác định số được so sánh và số gốc (số làm chuẩn).
Chia số được so sánh cho số gốc, được thương là số thập phân (nếu chia chưa hết thì lấy đến hai chữ số thập phân hoặc đổi sang phân số).
Đổi thương ra phần trăm: dịch dấu phẩy sang phải hai chữ số, thêm dấu $\%$.
Nếu đề hỏi hơn hoặc kém bao nhiêu phần trăm thì lấy kết quả trừ $100\%$ (hoặc $100\%$ trừ kết quả).

##CY
Chia đúng thứ tự: số được so sánh chia cho số gốc, không đảo lại.
"Nhiều hơn bao nhiêu phần trăm" khác với "bằng bao nhiêu phần trăm": phải trừ $100\%$.
@@vi_du
##VD
Lớp 5A có 40 học sinh, trong đó có 34 học sinh đạt danh hiệu học sinh giỏi. Hỏi số học sinh giỏi chiếm bao nhiêu phần trăm số học sinh cả lớp?
**Hướng dẫn giải:**
Số học sinh giỏi chiếm số phần trăm số học sinh cả lớp là: $34:40=0,85=85\%$
Đáp số: $85\%$

##VD
Năm ngoái một thửa ruộng thu hoạch được 1 200 kg thóc, năm nay thu hoạch được 1 560 kg thóc. Hỏi năm nay thu hoạch bằng bao nhiêu phần trăm năm ngoái? Năm nay thu hoạch nhiều hơn năm ngoái bao nhiêu phần trăm?
**Hướng dẫn giải:**
Năm nay thu hoạch bằng số phần trăm năm ngoái là: $1560:1200=1,3=130\%$
Năm nay thu hoạch nhiều hơn năm ngoái số phần trăm là: $130\%-100\%=30\%$
Đáp số: $130\%$ và nhiều hơn $30\%$

=== NDB02771
@@mo_ta
Đề xoay quanh giá vốn (giá nhập), tiền lãi, giá bán và tỉ lệ lãi so với giá vốn: cho hai đại lượng và hỏi đại lượng còn lại. Lãi hoặc lỗ tính theo giá vốn. Giải bằng quan hệ giá bán bằng giá vốn cộng tiền lãi (hoặc trừ tiền lỗ). Khác dạng cho số liệu theo giá bán ở chỗ tỉ số phần trăm luôn lấy giá vốn làm gốc.
@@ly_thuyet
##TC
Giá bán $=$ giá vốn $+$ tiền lãi. Tiền lãi $=$ giá bán $-$ giá vốn.
Bán lỗ: giá bán $=$ giá vốn $-$ tiền lỗ.
Khi đề không nói rõ thì tỉ lệ lãi (hay lỗ) là tỉ số phần trăm so với giá vốn: tiền lãi $=$ giá vốn $\times$ tỉ lệ lãi. Giá bán $=$ giá vốn $\times(100\%+$ tỉ lệ lãi$)$.

##PP
Xác định giá vốn là $100\%$ và đại lượng đề cho (tiền lãi hoặc tỉ lệ lãi).
Nếu đề cho tỉ lệ lãi thì tính tiền lãi bằng cách nhân giá vốn với tỉ lệ lãi.
Tính giá bán hoặc giá vốn theo quan hệ giá bán $=$ giá vốn $+$ tiền lãi.
Kiểm tra giá bán lớn hơn giá vốn khi có lãi, nhỏ hơn giá vốn khi bán lỗ.

##CY
Giá bán và giá vốn khác nhau, đừng nhầm "giá nhập" với "giá bán".
Hỏi tiền lãi và hỏi giá bán là hai kết quả khác nhau, đọc kỹ câu hỏi.
@@vi_du
##VD
Một siêu thị nhập chiếc áo sơ mi với giá vốn 200 000 đồng và muốn lãi 50 000 đồng cho mỗi chiếc. Hỏi cửa hàng phải bán chiếc áo sơ mi đó với giá bao nhiêu tiền?
**Hướng dẫn giải:**
Giá bán chiếc áo sơ mi là: $200000+50000=250000$ (đồng)
Đáp số: $250000$ đồng

##VD
Một cửa hàng mua một chiếc mũ với giá vốn 80 000 đồng và bán lãi 25% so với giá vốn. Hỏi cửa hàng bán chiếc mũ đó với giá bao nhiêu tiền?
**Hướng dẫn giải:**
Tiền lãi của một chiếc mũ là: $80000\times 25\%=20000$ (đồng)
Giá bán chiếc mũ là: $80000+20000=100000$ (đồng)
Đáp số: $100000$ đồng

=== NDB02772
@@mo_ta
Đề cho tiền lãi (hoặc giá vốn) bằng một tỉ số phần trăm của giá bán chứ không phải của giá vốn, hoặc hỏi tiền lãi bằng bao nhiêu phần trăm giá bán. Phải lấy giá bán làm gốc ($100\%$): giá vốn bằng giá bán trừ tiền lãi. Khác bài bán hàng cơ bản ở chỗ gốc so sánh là giá bán.
@@ly_thuyet
##TC
Khi đề nói "lãi $a\%$ giá bán" thì giá bán là $100\%$, tiền lãi là $a\%$ giá bán, giá vốn là $(100\%-a\%)$ giá bán.
Tiền lãi bằng bao nhiêu phần trăm giá bán $=$ tiền lãi $:$ giá bán.
Biết giá bán $B$ và lãi $a\%$ giá bán thì tiền lãi $=B\times a\%$, giá vốn $=B-$ tiền lãi.

##PP
Xác định gốc so sánh là giá bán.
Nếu hỏi tỉ lệ: tính tiền lãi bằng giá bán trừ giá vốn, rồi chia cho giá bán, đổi ra phần trăm.
Nếu cho tỉ lệ: tính tiền lãi bằng cách nhân giá bán với tỉ lệ, rồi lấy giá bán trừ tiền lãi để ra giá vốn.
Đối chiếu với giá vốn hoặc giá bán đã biết để kiểm tra.

##CY
Chia cho giá bán chứ không chia cho giá vốn: lãi $20\%$ giá bán khác với lãi $20\%$ giá vốn.
Nếu tính nhầm gốc, giá vốn tìm được sẽ sai, hãy thử lại bằng phép nhân.
@@vi_du
##VD
Một đại lý mua chiếc váy với giá 300 000 đồng rồi bán lại với giá 750 000 đồng. Hỏi tiền lãi bằng bao nhiêu phần trăm giá bán?
**Hướng dẫn giải:**
Tiền lãi là: $750000-300000=450000$ (đồng)
Tiền lãi bằng: $450000:750000=0,6=60\%$ (giá bán)
Đáp số: $60\%$

##VD
Một cửa hàng bán một chiếc cặp với giá 250 000 đồng và lãi 20% so với giá bán. Hỏi giá vốn của chiếc cặp đó là bao nhiêu tiền?
**Hướng dẫn giải:**
Tiền lãi của chiếc cặp là: $250000\times 20\%=50000$ (đồng)
Giá vốn của chiếc cặp là: $250000-50000=200000$ (đồng)
Đáp số: $200000$ đồng

=== NDB02773
@@mo_ta
Đề cho giá vốn, mức lãi ngày thường, rồi giảm giá một lần theo phần trăm trên giá bán ngày thường (hoặc giá niêm yết), hỏi giá sau giảm hoặc tiền lãi (lỗ) thực tế. Tiền giảm tính trên giá bán chứ không phải giá vốn. Khác dạng giảm giá kép ở chỗ chỉ giảm một lần.
@@ly_thuyet
##TC
Giảm giá $a\%$ thì giá sau khi giảm bằng $(100\%-a\%)$ giá trước khi giảm.
Giá bán ngày thường $=$ giá vốn $\times(100\%+$ tỉ lệ lãi$)$.
Lãi thực tế $=$ giá sau khi giảm $-$ giá vốn (nếu âm thì là lỗ).

##PP
Tìm giá bán ngày thường: giá vốn nhân $(100\%+$ tỉ lệ lãi$)$.
Tìm giá sau khi giảm: giá bán ngày thường nhân $(100\%-$ tỉ lệ giảm$)$.
Lấy giá sau khi giảm trừ giá vốn để biết còn lãi bao nhiêu tiền.
Nếu đề hỏi giá trước khi giảm thì làm ngược: lấy giá sau giảm chia cho $(100\%-$ tỉ lệ giảm$)$.

##CY
Không tính phần trăm giảm trên giá vốn: tiền giảm tính trên giá bán ngày thường.
Giảm $25\%$ nghĩa là còn $75\%$, nhân thẳng với $75\%$ cho gọn.
@@vi_du
##VD
Một siêu thị điện máy nhập một mặt hàng với giá vốn 100 000 đồng. Ngày thường cửa hàng bán lãi 40% so với giá vốn. Để dọn kho, cửa hàng giảm giá 25% so với giá bán ngày thường. Hỏi khi đó, bán mặt hàng này cửa hàng còn lãi bao nhiêu tiền?
**Hướng dẫn giải:**
Giá bán ngày thường là: $100000\times 140\%=140000$ (đồng)
Giá sau khi giảm là: $140000\times 75\%=105000$ (đồng)
Số tiền cửa hàng còn lãi là: $105000-100000=5000$ (đồng)
Đáp số: $5000$ đồng

##VD
Một chiếc áo được niêm yết giá 240 000 đồng, nay giảm giá 15%. Hỏi phải trả bao nhiêu tiền để mua chiếc áo đó?
**Hướng dẫn giải:**
Sau khi giảm giá, giá chiếc áo bằng: $100\%-15\%=85\%$ (giá niêm yết)
Số tiền phải trả để mua chiếc áo là: $240000\times 85\%=204000$ (đồng)
Đáp số: $204000$ đồng

=== NDB02774
@@mo_ta
Đề cho hai lần giảm giá liên tiếp, lần sau tính theo giá đã giảm của lần trước, hỏi giá cuối cùng hoặc (làm ngược) giá ban đầu khi biết giá cuối. Không cộng dồn hai tỉ lệ giảm mà phải nhân hoặc làm từng lần. Khác dạng giảm giá một lần ở chỗ gốc của lần sau là giá mới.
@@ly_thuyet
##TC
Mỗi lần giảm $a\%$ thì giá còn lại $(100\%-a\%)$ giá trước đó. Giảm hai lần: giá cuối $=$ giá đầu $\times(100\%-a\%)\times(100\%-b\%)$.
Giảm giá hai lần $10\%$ không bằng giảm một lần $20\%$ ($0,9\times0,9=0,81$ nên còn $81\%$, không phải $80\%$).
Biết giá sau khi giảm và tỉ lệ còn lại thì giá trước khi giảm bằng giá sau chia cho tỉ lệ còn lại.

##PP
Tính xuôi: tìm số tiền giảm lần 1 hoặc nhân giá với tỉ lệ còn lại, được giá sau lần 1.
Lấy giá sau lần 1 làm gốc, tính tiếp giá sau lần 2.
Tính ngược khi hỏi giá ban đầu: lấy giá cuối chia cho tỉ lệ còn lại của lần 2 được giá sau lần 1.
Lấy giá sau lần 1 chia cho tỉ lệ còn lại của lần 1 được giá ban đầu.

##CY
Không cộng $50\%+20\%=70\%$ rồi tính tiếp, vì hai lần giảm tính trên hai mức giá khác nhau.
Tính ngược thì mỗi bước là phép chia cho tỉ số phần trăm còn lại.
@@vi_du
##VD
Một cửa hàng định bán một chiếc tủ lạnh với giá 19 200 000 đồng. Tuy nhiên để thu hút khách hàng, cửa hàng quyết định giảm giá hai lần liên tiếp, mỗi lần giảm 10% so với giá bán trước đó. Hỏi sau hai lần giảm giá thì giá chiếc tủ lạnh là bao nhiêu?
**Hướng dẫn giải:**
Lần giảm giá thứ nhất, giá tủ lạnh giảm đi: $19200000\times 10\%=1920000$ (đồng)
Giá tủ lạnh sau lần giảm thứ nhất là: $19200000-1920000=17280000$ (đồng)
Lần giảm giá thứ hai, giá tủ lạnh giảm đi: $17280000\times 10\%=1728000$ (đồng)
Giá tủ lạnh sau hai lần giảm là: $17280000-1728000=15552000$ (đồng)
Đáp số: $15552000$ đồng

##VD
Một cửa hàng quần áo giảm giá 50% áo sơ mi để nhập hàng mới. Sau 1 tuần vẫn còn một số chiếc chưa bán được nên tiếp tục giảm giá 20% so với giá trước đó và đã bán được với giá 76 000 đồng/chiếc. Hỏi ban đầu giá của chiếc áo sơ mi đó là bao nhiêu?
**Hướng dẫn giải:**
Sau lần giảm giá thứ hai, giá áo còn: $100\%-20\%=80\%$ (giá sau lần giảm thứ nhất)
Giá áo sau lần giảm giá thứ nhất là: $76000:80\%=95000$ (đồng)
Sau lần giảm giá thứ nhất, giá áo còn: $100\%-50\%=50\%$ (giá ban đầu)
Giá ban đầu của chiếc áo sơ mi là: $95000:50\%=190000$ (đồng)
Đáp số: $190000$ đồng

=== NDB02775
@@mo_ta
Đề cho doanh thu (hoặc chi phí) và giá bán, số lượng bán ra thay đổi theo phần trăm, hỏi đại lượng còn lại thay đổi bao nhiêu phần trăm. Dựa vào doanh thu bằng giá bán nhân số lượng và chia hai tỉ số phần trăm cho nhau. Khác bài diện tích ở chỗ đại lượng là tiền bán hàng, không có hình.
@@ly_thuyet
##TC
Doanh thu $=$ giá bán một đơn vị $\times$ số lượng bán ra. Lợi nhuận $=$ doanh thu $-$ chi phí.
Nếu hai đại lượng có tích là doanh thu thì tỉ số phần trăm của tích bằng tích hai tỉ số phần trăm của hai đại lượng.
Biết tỉ số doanh thu và tỉ số giá thì tỉ số số lượng $=$ tỉ số doanh thu $:$ tỉ số giá.

##PP
Viết các tỉ số phần trăm theo cùng một đối tượng làm gốc (cùng một phim, cùng một năm).
Đổi tỉ số giá về cùng chiều với tỉ số doanh thu nếu đề cho ngược chiều: lấy $100\%$ chia cho tỉ số đó.
Chia tỉ số doanh thu cho tỉ số giá bằng cách đổi ra số thập phân rồi chia.
So kết quả với $100\%$ để biết tăng hay giảm bao nhiêu phần trăm.

##CY
Không trừ trực tiếp hai tỉ số phần trăm: $136\%-125\%$ là sai, phải chia.
Nếu đề cho ngược chiều (B bằng $125\%$ A) mà hỏi A so với B thì phải đảo bằng $100\%:125\%$.
@@vi_du
##VD
Sau một tuần công chiếu phim thì doanh thu của phim A bằng 136% doanh thu của phim B mặc dù giá vé của phim B bằng 125% giá vé của phim A. Hỏi số lượng vé bán được của phim A nhiều hơn hay ít hơn bao nhiêu phần trăm số lượng vé bán được của phim B?
**Hướng dẫn giải:**
Giá vé phim A bằng: $100\%:125\%=1:1,25=0,8=80\%$ (giá vé phim B)
Số vé bán được của phim A bằng: $136\%:80\%=1,36:0,8=1,7=170\%$ (số vé bán được của phim B)
Số vé bán được của phim A nhiều hơn phim B: $170\%-100\%=70\%$
Đáp số: Nhiều hơn $70\%$

##VD
Một cửa hàng tăng giá bán một mặt hàng lên 20% thì số lượng bán ra giảm 10%. Hỏi doanh thu của cửa hàng tăng hay giảm bao nhiêu phần trăm?
**Hướng dẫn giải:**
Giá bán mới bằng: $100\%+20\%=120\%$ (giá cũ)
Số lượng bán mới bằng: $100\%-10\%=90\%$ (số lượng cũ)
Doanh thu mới bằng: $120\%\times 90\%=1,2\times 0,9=1,08=108\%$ (doanh thu cũ)
Doanh thu tăng: $108\%-100\%=8\%$
Đáp số: Tăng $8\%$

=== NDB02776
@@mo_ta
Đề cho hình chữ nhật có chiều dài, chiều rộng thay đổi theo phần trăm hoặc theo số đo, hỏi diện tích thay đổi bao nhiêu phần trăm hoặc hỏi chiều dài, chiều rộng mới. Dựa vào diện tích bằng chiều dài nhân chiều rộng, nên tỉ số phần trăm diện tích bằng tích hai tỉ số phần trăm. Khác dạng doanh thu ở chỗ đại lượng là số đo hình.
@@ly_thuyet
##TC
Diện tích hình chữ nhật $=$ chiều dài $\times$ chiều rộng. Nếu chiều dài mới bằng $m\%$ chiều dài cũ, chiều rộng mới bằng $n\%$ chiều rộng cũ thì diện tích mới bằng $m\%\times n\%$ diện tích cũ.
Biết tỉ số diện tích và tỉ số một cạnh thì tỉ số cạnh còn lại bằng tỉ số diện tích chia cho tỉ số cạnh đã biết.

##PP
Coi ban đầu mỗi đại lượng là $100\%$, đổi tăng thành $100\%+$ và giảm thành $100\%-$.
Nhân hai tỉ số phần trăm bằng cách đổi ra số thập phân: nhân rồi đổi ngược về phần trăm.
So diện tích mới với $100\%$ để biết tăng hay giảm bao nhiêu phần trăm.
Nếu đề cho số đo bị bớt đi thì tìm tỉ số phần trăm bị bớt, rồi chia số đo đó cho tỉ số để tìm số đo cũ và mới.

##CY
Tăng $25\%$ rồi giảm $25\%$ không làm diện tích giữ nguyên: phần trăm nhân với nhau, không bù trừ.
Đề cho tăng hay giảm bao nhiêu phần trăm thì phải đổi thành tỉ số so với ban đầu rồi mới nhân.
@@vi_du
##VD
Cho một hình chữ nhật. Khi giảm chiều dài đi 4,5 cm và tăng 20% chiều rộng thì diện tích mới hơn diện tích ban đầu là 8%. Tính chiều dài mới.
**Hướng dẫn giải:**
Chiều rộng mới bằng: $100\%+20\%=120\%$ (chiều rộng cũ)
Diện tích mới bằng: $100\%+8\%=108\%$ (diện tích cũ)
Chiều dài mới bằng: $108\%:120\%=1,08:1,2=0,9=90\%$ (chiều dài cũ)
Chiều dài đã giảm đi: $100\%-90\%=10\%$ (chiều dài cũ)
Chiều dài cũ là: $4,5:10\%=45$ (cm)
Chiều dài mới là: $45-4,5=40,5$ (cm)
Đáp số: $40,5$ cm

##VD
Nếu tăng chiều dài của hình chữ nhật thêm 25% và bớt chiều rộng của hình chữ nhật đi 25% thì diện tích của hình chữ nhật sẽ tăng hay giảm bao nhiêu phần trăm?
**Hướng dẫn giải:**
Chiều dài mới bằng: $100\%+25\%=125\%$ (chiều dài cũ)
Chiều rộng mới bằng: $100\%-25\%=75\%$ (chiều rộng cũ)
Diện tích mới bằng: $125\%\times 75\%=1,25\times 0,75=0,9375=93,75\%$ (diện tích cũ)
Diện tích hình chữ nhật giảm đi: $100\%-93,75\%=6,25\%$
Đáp số: Giảm $6,25\%$

=== NDB03002
@@mo_ta
Đề cho năng suất, thời gian hoàn thành hoặc số người thay đổi theo phần trăm, hỏi đại lượng kia thay đổi bao nhiêu phần trăm hoặc là bao nhiêu. Khối lượng công việc không đổi nên các đại lượng tỉ lệ nghịch: tăng năng suất thì thời gian giảm, tỉ số thời gian là $100\%$ chia cho tỉ số năng suất. Khác bài doanh thu, diện tích ở chỗ tích không đổi, nên dùng phép chia.
@@ly_thuyet
##TC
Khối lượng công việc $=$ năng suất $\times$ thời gian. Với cùng một công việc, tích này không đổi nên năng suất và thời gian tỉ lệ nghịch.
Nếu năng suất (hoặc số người) mới bằng $m\%$ cũ thì thời gian mới bằng $100\%:m\%$ thời gian cũ.
Tương tự: vận tốc $\times$ thời gian $=$ quãng đường không đổi.

##PP
Nhận ra đại lượng tích không đổi (công việc, quãng đường).
Viết tỉ số phần trăm mới của đại lượng đã cho thay đổi (tăng hay giảm so với $100\%$).
Tìm tỉ số của đại lượng kia: lấy $100\%$ chia cho tỉ số vừa viết, đổi ra số thập phân rồi chia.
Kết luận tăng hay giảm bao nhiêu phần trăm, hoặc nhân với số liệu cũ để ra số mới.

##CY
Năng suất tăng $25\%$ thì thời gian chỉ giảm $20\%$, không giảm $25\%$.
Không dùng phép nhân cho hai đại lượng tỉ lệ nghịch.
@@vi_du
##VD
Một đội công nhân tăng số người lên 25% so với dự định, mỗi người làm việc với năng suất như nhau. Hỏi thời gian hoàn thành công việc giảm bao nhiêu phần trăm so với dự định?
**Hướng dẫn giải:**
Số người mới bằng: $100\%+25\%=125\%$ (số người dự định)
Thời gian mới bằng: $100\%:125\%=1:1,25=0,8=80\%$ (thời gian dự định)
Thời gian hoàn thành giảm đi: $100\%-80\%=20\%$
Đáp số: Giảm $20\%$

##VD
Một đội dự kiến làm xong một công việc trong 30 ngày. Nhờ cải tiến kĩ thuật, năng suất tăng 50% so với dự kiến. Hỏi đội đó làm xong công việc trong bao nhiêu ngày?
**Hướng dẫn giải:**
Năng suất mới bằng: $100\%+50\%=150\%$ (năng suất dự kiến)
Thời gian mới bằng: $100\%:150\%=1:1,5=\dfrac{2}{3}$ (thời gian dự kiến)
Đội đó làm xong công việc trong: $30\times\dfrac{2}{3}=20$ (ngày)
Đáp số: $20$ ngày

=== NDB03003
@@mo_ta
Đề cho hình hộp chữ nhật (hoặc hộp, bể, khối) có chiều dài, chiều rộng, chiều cao thay đổi theo phần trăm, hỏi thể tích thay đổi bao nhiêu phần trăm hoặc thể tích mới; có thể cho thể tích ban đầu. Dựa vào thể tích bằng tích ba kích thước, nên tỉ số thể tích bằng tích ba tỉ số phần trăm. Khác dạng diện tích ở chỗ có ba thừa số.
@@ly_thuyet
##TC
Thể tích hình hộp chữ nhật $=$ chiều dài $\times$ chiều rộng $\times$ chiều cao.
Nếu ba kích thước mới lần lượt bằng $m\%$, $n\%$, $p\%$ kích thước cũ thì thể tích mới bằng $m\%\times n\%\times p\%$ thể tích cũ.
Kích thước giữ nguyên tính là $100\%$ (nhân với $1$).

##PP
Viết tỉ số phần trăm của từng kích thước mới so với cũ: tăng thì $100\%+$, giảm thì $100\%-$, giữ nguyên thì $100\%$.
Đổi từng tỉ số ra số thập phân rồi nhân lần lượt, từng hai thừa số một.
Đổi tích về phần trăm để biết thể tích mới bằng bao nhiêu phần trăm thể tích cũ.
So với $100\%$ để biết tăng hay giảm; nếu biết thể tích cũ thì nhân với tỉ số để tìm thể tích mới.

##CY
Không cộng các phần trăm thay đổi của ba kích thước.
Nhân thừa số tròn trước để tính nhanh (như $1,25\times 0,8=1$).
@@vi_du
##VD
Một hình hộp chữ nhật, nếu tăng chiều dài thêm 20%, tăng chiều rộng thêm 25% và giảm chiều cao đi 20% thì thể tích của hình hộp thay đổi như thế nào?
**Hướng dẫn giải:**
Chiều dài mới bằng: $100\%+20\%=120\%$ (chiều dài cũ)
Chiều rộng mới bằng: $100\%+25\%=125\%$ (chiều rộng cũ)
Chiều cao mới bằng: $100\%-20\%=80\%$ (chiều cao cũ)
Thể tích mới bằng: $120\%\times 125\%\times 80\%=1,2\times 1,25\times 0,8=1,2=120\%$ (thể tích cũ)
Thể tích tăng: $120\%-100\%=20\%$
Đáp số: Tăng $20\%$

##VD
Một hình hộp chữ nhật có thể tích 360 cm khối. Giữ nguyên chiều dài, tăng chiều rộng thêm 50% và giảm chiều cao đi 40%. Hỏi thể tích mới là bao nhiêu xăng-ti-mét khối?
**Hướng dẫn giải:**
Chiều rộng mới bằng: $100\%+50\%=150\%$ (chiều rộng cũ)
Chiều cao mới bằng: $100\%-40\%=60\%$ (chiều cao cũ)
Thể tích mới bằng: $100\%\times 150\%\times 60\%=1\times 1,5\times 0,6=0,9=90\%$ (thể tích cũ)
Thể tích mới là: $360\times 90\%=324$ (cm khối)
Đáp số: $324$ cm khối

=== NDB02777
@@mo_ta
Đề cho khối lượng và tỉ lệ phần trăm chất tan (muối, đường, cồn...) của từng phần rồi trộn hoặc thêm, đổ vào nhau, hỏi tỉ lệ phần trăm chất tan của hỗn hợp mới. Giải bằng cách tính lượng chất tan của từng phần, cộng lại, rồi chia cho tổng khối lượng hỗn hợp. Khác dạng tìm ngược ở chỗ đề cho hết và hỏi tỉ lệ sau cùng.
@@ly_thuyet
##TC
Lượng chất tan $=$ khối lượng dung dịch $\times$ tỉ lệ phần trăm chất tan.
Tỉ lệ phần trăm chất tan của hỗn hợp $=$ tổng lượng chất tan $:$ tổng khối lượng hỗn hợp.
Khi thêm nước cất vào dung dịch thì lượng chất tan không đổi, chỉ có khối lượng hỗn hợp tăng.

##PP
Tính lượng chất tan trong từng phần: lấy khối lượng nhân với tỉ lệ phần trăm.
Cộng các lượng chất tan lại thành lượng chất tan của hỗn hợp (nước cất thì lượng chất tan là $0$).
Cộng các khối lượng lại thành khối lượng hỗn hợp.
Lấy lượng chất tan chia cho khối lượng hỗn hợp, đổi ra phần trăm.

##CY
Không cộng hai tỉ số phần trăm rồi chia cho $2$ nếu khối lượng hai phần khác nhau.
Thêm nước thì tỉ lệ chất tan phải nhỏ hơn lúc đầu, bớt nước thì phải lớn hơn: dùng để kiểm kết quả.
@@vi_du
##VD
Người ta đổ thêm 100 g nước cất vào 200 g dung dịch nước muối có 3% muối. Hỏi dung dịch mới có bao nhiêu phần trăm muối?
**Hướng dẫn giải:**
Khối lượng muối không đổi.
Khối lượng muối trong $200$ g dung dịch là: $200\times 3\%=6$ (g)
Khối lượng dung dịch mới là: $200+100=300$ (g)
Tỉ số phần trăm muối trong dung dịch mới là: $6:300=0,02=2\%$
Đáp số: $2\%$

##VD
Trộn 200 g dung dịch nước muối chứa 5% muối với 300 g dung dịch nước muối chứa 10% muối. Hỏi dung dịch mới có bao nhiêu phần trăm muối?
**Hướng dẫn giải:**
Khối lượng muối trong $200$ g dung dịch $5\%$ là: $200\times 5\%=10$ (g)
Khối lượng muối trong $300$ g dung dịch $10\%$ là: $300\times 10\%=30$ (g)
Khối lượng muối trong dung dịch mới là: $10+30=40$ (g)
Khối lượng dung dịch mới là: $200+300=500$ (g)
Tỉ số phần trăm muối trong dung dịch mới là: $40:500=0,08=8\%$
Đáp số: $8\%$

=== NDB02778
@@mo_ta
Đề cho dung dịch ban đầu (khối lượng và tỉ lệ chất tan) cùng tỉ lệ sau cùng mong muốn, hỏi lượng nước cất, lượng chất tan cần thêm vào hoặc lượng nước cần bay hơi. Giải bằng cách giữ lại phần không đổi (chất tan hoặc nước) rồi tìm khối lượng dung dịch mới bằng phép chia cho tỉ lệ, sau đó trừ khối lượng cũ. Khác dạng tìm tỉ lệ sau trộn ở chỗ ẩn số là lượng cần thêm.
@@ly_thuyet
##TC
Thêm nước cất hoặc đun bay hơi nước: lượng chất tan không đổi.
Thêm chất tan: lượng nước (dung môi) không đổi.
Biết lượng chất tan chiếm $b\%$ khối lượng dung dịch mới thì khối lượng dung dịch mới $=$ lượng chất tan $:b\%$.

##PP
Xác định phần nào không đổi (chất tan hay nước) theo việc thêm vào.
Tính lượng phần không đổi trong dung dịch ban đầu.
Phần không đổi đó chiếm tỉ lệ phần trăm đã cho trong dung dịch mới, nên chia lượng đó cho tỉ lệ để ra khối lượng dung dịch mới.
Lấy khối lượng dung dịch mới trừ khối lượng cũ (hoặc ngược lại khi bay hơi) để ra lượng cần thêm hoặc cần bớt.

##CY
Tỉ lệ mới là phần trăm của khối lượng dung dịch lúc sau, không phải của khối lượng lúc đầu.
Thử lại: nhân khối lượng mới với tỉ lệ mới phải bằng lượng chất tan đã tính.
@@vi_du
##VD
Cần thêm vào 250 g dung dịch nước đường chứa 3% đường bao nhiêu gam nước cất để được dung dịch nước đường mới chứa 2,5% đường?
**Hướng dẫn giải:**
Khối lượng đường không đổi.
Khối lượng đường trong $250$ g dung dịch $3\%$ đường là: $250\times 3\%=7,5$ (g)
Khối lượng dung dịch mới là: $7,5:2,5\%=300$ (g)
Khối lượng nước cất cần thêm vào là: $300-250=50$ (g)
Đáp số: $50$ g

##VD
Cần phải đổ thêm bao nhiêu gam nước cất vào 300 g nước muối 4% muối để thu được nước muối có 2% muối?
**Hướng dẫn giải:**
Khối lượng muối không đổi.
Khối lượng muối trong $300$ g nước muối $4\%$ là: $300\times 4\%=12$ (g)
Khối lượng nước muối lúc sau là: $12:2\%=600$ (g)
Khối lượng nước cất cần đổ thêm là: $600-300=300$ (g)
Đáp số: $300$ g

=== NDB03004
@@mo_ta
Đề cho một dung dịch (nước muối, nước đường...) rồi thêm nước, đun cho bay hơi bớt nước hoặc thêm chất tan, hỏi tỉ lệ phần trăm mới hoặc lượng cần thêm, cần bay hơi để đạt tỉ lệ mong muốn. Điểm mấu chốt là xác định đại lượng không đổi: lượng chất tan khi thêm hoặc bớt nước, lượng nước khi thêm chất tan. Khác bài hạt tươi – hạt khô ở chỗ đề dùng dung dịch.
@@ly_thuyet
##TC
Pha loãng (thêm nước) hoặc cô đặc (đun cho bay hơi nước): lượng chất tan không đổi.
Thêm chất tan (muối, đường): lượng nước không đổi.
Lượng chất tan $=$ khối lượng dung dịch $\times$ tỉ lệ chất tan. Nếu chất tan chiếm $b\%$ dung dịch thì nước chiếm $100\%-b\%$ dung dịch.

##PP
Chọn đại lượng không đổi (chất tan hay nước) theo đề.
Tính đại lượng không đổi bằng cách nhân khối lượng dung dịch cũ với tỉ lệ tương ứng.
Dùng tỉ lệ mới để tìm khối lượng dung dịch mới bằng phép chia đại lượng không đổi cho tỉ lệ mới.
So sánh khối lượng dung dịch mới với cũ để ra lượng nước cần bay hơi hoặc lượng chất thêm vào.

##CY
Cô đặc thì dung dịch nhẹ đi nên khối lượng mới nhỏ hơn khối lượng cũ.
Thêm chất tan thì dung dịch nặng thêm đúng bằng lượng chất tan thêm vào.
@@vi_du
##VD
Có 400 g nước muối chứa 6% muối. Cần đun cho bay hơi bớt bao nhiêu gam nước để được nước muối chứa 8% muối?
**Hướng dẫn giải:**
Khối lượng muối không đổi.
Khối lượng muối trong $400$ g nước muối là: $400\times 6\%=24$ (g)
Khối lượng nước muối sau khi đun là: $24:8\%=300$ (g)
Khối lượng nước đã bay hơi là: $400-300=100$ (g)
Đáp số: $100$ g

##VD
Có 200 g nước đường chứa 10% đường. Hỏi cần thêm bao nhiêu gam đường để được nước đường chứa 20% đường?
**Hướng dẫn giải:**
Khối lượng nước không đổi.
Khối lượng đường trong $200$ g nước đường là: $200\times 10\%=20$ (g)
Khối lượng nước trong dung dịch là: $200-20=180$ (g)
Nước chiếm trong dung dịch mới: $100\%-20\%=80\%$ (khối lượng dung dịch mới)
Khối lượng dung dịch mới là: $180:80\%=225$ (g)
Khối lượng đường cần thêm là: $225-200=25$ (g)
Đáp số: $25$ g

=== NDB03005
@@mo_ta
Đề cho tỉ lệ nước trong hạt (hoặc cỏ, gạo, trái cây) tươi và khô, hỏi khối lượng sau khi phơi khô hoặc khối lượng cần phơi để có một lượng khô, hoặc tỉ lệ nước còn lại. Khi phơi chỉ có nước bay hơi, lượng chất khô không đổi. Giải bằng cách tính lượng chất khô rồi chia cho phần trăm chất khô của mẫu cần tìm. Khác bài pha loãng ở chỗ đối tượng là nông sản.
@@ly_thuyet
##TC
Hạt có chứa nước thì: tỉ lệ chất khô $=100\%-$ tỉ lệ nước.
Phơi khô: chỉ có nước bay hơi, lượng chất khô không đổi.
Lượng chất khô $=$ khối lượng hạt $\times$ tỉ lệ chất khô. Khối lượng hạt $=$ lượng chất khô $:$ tỉ lệ chất khô.

##PP
Tính tỉ lệ chất khô của hạt tươi và hạt khô: lấy $100\%$ trừ tỉ lệ nước.
Tính lượng chất khô: nhân khối lượng đã biết (tươi hoặc khô) với tỉ lệ chất khô của nó.
Lấy lượng chất khô chia cho tỉ lệ chất khô của mẫu cần tìm để ra khối lượng mẫu đó.
Kiểm tra: hạt khô nhẹ hơn hạt tươi.

##CY
Không lấy tỉ lệ nước nhân với khối lượng rồi dùng ngay: phải đổi sang tỉ lệ chất khô.
Chất khô của hạt tươi và hạt khô bằng nhau về khối lượng, nhưng tỉ lệ phần trăm khác nhau.
@@vi_du
##VD
Hạt tươi có tỉ lệ nước là 80%, hạt khô có tỉ lệ nước là 20%. Hỏi nếu phơi khô 60 kg hạt tươi thì thu được bao nhiêu ki-lô-gam hạt khô?
**Hướng dẫn giải:**
Chất khô trong hạt tươi chiếm: $100\%-80\%=20\%$ (khối lượng hạt tươi)
Khối lượng chất khô trong $60$ kg hạt tươi là: $60\times 20\%=12$ (kg)
Chất khô trong hạt khô chiếm: $100\%-20\%=80\%$ (khối lượng hạt khô)
Khối lượng hạt khô thu được là: $12:80\%=15$ (kg)
Đáp số: $15$ kg

##VD
Hạt ngô tươi có tỉ lệ nước là 46%, hạt ngô khô có tỉ lệ nước là 10%. Để có 24 kg hạt ngô khô thì cần đem phơi bao nhiêu ki-lô-gam hạt ngô tươi?
**Hướng dẫn giải:**
Chất khô trong hạt ngô khô chiếm: $100\%-10\%=90\%$ (khối lượng hạt ngô khô)
Khối lượng chất khô trong $24$ kg hạt ngô khô là: $24\times 90\%=21,6$ (kg)
Chất khô trong hạt ngô tươi chiếm: $100\%-46\%=54\%$ (khối lượng hạt ngô tươi)
Khối lượng hạt ngô tươi cần đem phơi là: $21,6:54\%=40$ (kg)
Đáp số: $40$ kg

=== NDB03006
@@mo_ta
Đề cho một đại lượng (giá, số dân, sản lượng) tăng hoặc giảm liên tiếp theo phần trăm qua nhiều tháng, năm, hỏi giá trị cuối hoặc so với ban đầu tăng giảm bao nhiêu phần trăm. Mỗi lần thay đổi tính trên giá trị của lần ngay trước, nên phải nhân các tỉ số phần trăm, không cộng. Khác dạng giảm giá kép ở chỗ có cả tăng lẫn giảm và không nói về bán hàng.
@@ly_thuyet
##TC
Tăng $a\%$ thì giá trị mới bằng $(100\%+a\%)$ giá trị trước, giảm $a\%$ thì bằng $(100\%-a\%)$ giá trị trước.
Thay đổi liên tiếp thì nhân các tỉ số: giá trị cuối $=$ giá trị đầu $\times(100\%\pm a\%)\times(100\%\pm b\%)$.
Tăng $a\%$ rồi giảm $a\%$ không trở về giá trị ban đầu.

##PP
Viết tỉ số phần trăm của từng lần thay đổi so với lần ngay trước.
Nhân lần lượt các tỉ số: đổi ra số thập phân rồi nhân.
Đổi tích về phần trăm của giá trị ban đầu.
So với $100\%$ để kết luận tăng hay giảm bao nhiêu phần trăm; hoặc nhân với giá trị ban đầu để ra giá trị cuối.

##CY
Không cộng trừ các phần trăm: tăng $20\%$ rồi giảm $25\%$ không phải là tăng $-5\%$.
Từng lần phải lấy giá trị ngay trước làm gốc.
@@vi_du
##VD
Giá một mặt hàng tháng 1 là 200 000 đồng. Tháng 2 giá tăng 10% so với tháng 1, tháng 3 giá giảm 10% so với tháng 2. Hỏi giá mặt hàng đó ở tháng 3 là bao nhiêu tiền?
**Hướng dẫn giải:**
Giá tháng 2 là: $200000\times 110\%=220000$ (đồng)
Giá tháng 3 là: $220000\times 90\%=198000$ (đồng)
Đáp số: $198000$ đồng

##VD
Số dân của một thị trấn năm 2024 tăng 20% so với năm 2023, năm 2025 giảm 25% so với năm 2024. Hỏi số dân năm 2025 tăng hay giảm bao nhiêu phần trăm so với năm 2023?
**Hướng dẫn giải:**
Số dân năm 2024 bằng: $100\%+20\%=120\%$ (số dân năm 2023)
Số dân năm 2025 bằng: $100\%-25\%=75\%$ (số dân năm 2024)
Số dân năm 2025 bằng: $120\%\times 75\%=1,2\times 0,75=0,9=90\%$ (số dân năm 2023)
Số dân giảm: $100\%-90\%=10\%$
Đáp số: Giảm $10\%$

=== NDB03007
@@mo_ta
Đề cho số tiền gửi tiết kiệm (hoặc vay) với lãi suất theo tháng hoặc năm, tiền lãi mỗi kì được nhập vào vốn để tính lãi kì sau, hỏi số tiền cả vốn lẫn lãi sau một vài kì, hoặc làm ngược tìm số tiền gửi ban đầu. Mỗi kì lấy tổng tiền kì trước nhân tỉ lệ. Khác bài tăng giảm liên tiếp ở chỗ có đơn vị thời gian và thuật ngữ ngân hàng.
@@ly_thuyet
##ĐN
Lãi suất là tỉ số phần trăm của tiền lãi so với số tiền gửi (vốn) trong một kì (tháng, năm). Lãi nhập vốn là tiền lãi của kì trước được cộng vào vốn để tính lãi cho kì sau.

##TC
Sau một kì: số tiền cả vốn lẫn lãi $=$ vốn $\times(100\%+$ lãi suất$)$.
Lãi nhập vốn thì mỗi kì lại lấy số tiền cả vốn lẫn lãi của kì trước làm vốn mới.

##PP
Tính tiền lãi của kì đầu: vốn nhân với lãi suất.
Cộng vào vốn để được số tiền sau kì đầu.
Lấy số tiền đó làm vốn mới và tính tiếp kì sau.
Làm ngược khi biết số tiền cuối: lấy số tiền cả vốn lẫn lãi chia cho $(100\%+$ lãi suất$)$ để ra vốn.

##CY
Lãi nhập vốn thì lãi kì sau lớn hơn lãi kì đầu, không tính bằng cách nhân lãi kì đầu với số kì.
Đề hỏi tiền lãi thì phải lấy số tiền cuối trừ vốn ban đầu.
@@vi_du
##VD
Một người gửi tiết kiệm 10 triệu đồng với lãi suất 0,5% một tháng. Hỏi sau 2 tháng người đó lĩnh được bao nhiêu tiền cả vốn lẫn lãi? Biết rằng lãi của tháng trước cũng nhập thành vốn của tháng sau.
**Hướng dẫn giải:**
Tiền lãi tháng thứ nhất là: $10000000\times 0,5\%=50000$ (đồng)
Số tiền sau tháng thứ nhất là: $10000000+50000=10050000$ (đồng)
Tiền lãi tháng thứ hai là: $10050000\times 0,5\%=50250$ (đồng)
Số tiền sau 2 tháng là: $10050000+50250=10100250$ (đồng)
Đáp số: $10100250$ đồng

##VD
Bác Hân gửi một số tiền vào ngân hàng với lãi suất 5,6% một năm. Sau 1 năm, bác lấy về số tiền cả gốc lẫn lãi là 126 720 000 đồng. Hỏi lúc đầu bác Hân gửi vào ngân hàng bao nhiêu tiền?
**Hướng dẫn giải:**
Sau 1 năm, số tiền cả gốc lẫn lãi bằng: $100\%+5,6\%=105,6\%$ (số tiền gửi lúc đầu)
Số tiền bác Hân gửi lúc đầu là: $126720000:105,6\%=120000000$ (đồng)
Đáp số: $120000000$ đồng
