##ĐN Các điểm đặc biệt của hình thang
Cho hình thang $ABCD$ có hai đáy $AB\parallel CD$. Gọi $I$ là giao điểm của hai đường thẳng chứa cạnh bên $AD$ và $BC$, gọi $O$ là giao điểm của hai đường chéo $AC$ và $BD$. Ba bổ đề dưới đây nói về các đường thẳng đi qua $I$ hoặc $O$ và cắt hai đáy.

##ĐL Bổ đề 1 (đường thẳng qua giao điểm hai cạnh bên)
Cho hình thang $ABCD$ ($AB\parallel CD$), $AD$ cắt $BC$ tại $I$. Qua $I$ kẻ một đường thẳng cắt $AB$, $CD$ lần lượt tại $M$, $N$. Khi đó $M$, $N$ chia $AB$, $CD$ thành các đoạn thẳng tỉ lệ: $\dfrac{MA}{MB}=\dfrac{ND}{NC}$.

{{HINH:bode_mot|Bổ đề 1: đường thẳng qua I cắt AB tại M, cắt CD tại N}}

##TC Chứng minh Bổ đề 1
Vì $AB\parallel CD$ nên $AM\parallel DN$. Trong tam giác $IAM$ có $DN\parallel AM$ ($D$ thuộc đường thẳng $IA$, $N$ thuộc đường thẳng $IM$) nên theo hệ quả của định lí Thalès: $\dfrac{ND}{AM}=\dfrac{IN}{IM}$.
Vì $AB\parallel CD$ nên $BM\parallel CN$. Trong tam giác $IBM$ có $CN\parallel BM$ ($C$ thuộc đường thẳng $IB$, $N$ thuộc đường thẳng $IM$) nên theo hệ quả của định lí Thalès: $\dfrac{NC}{BM}=\dfrac{IN}{IM}$.
Suy ra $\dfrac{ND}{AM}=\dfrac{NC}{BM}$, do đó $\dfrac{ND}{NC}=\dfrac{AM}{BM}$, tức $\dfrac{MA}{MB}=\dfrac{ND}{NC}$ (đpcm).

##ĐL Bổ đề 2 (đường thẳng qua giao điểm hai đường chéo)
Cho hình thang $ABCD$ ($AB\parallel CD$), $AC$ cắt $BD$ tại $O$. Qua $O$ kẻ một đường thẳng bất kì cắt $AB$, $CD$ lần lượt tại $M$, $N$. Khi đó $M$, $N$ cũng chia $AB$, $CD$ thành các đoạn thẳng tỉ lệ nhưng so le: $\dfrac{MA}{MB}=\dfrac{NC}{ND}$.

{{HINH:bode_hai|Bổ đề 2: đường thẳng qua O cắt AB tại M, cắt CD tại N}}

##TC Chứng minh Bổ đề 2
Vì $AB\parallel CD$ nên $AM\parallel CN$. Hai đường thẳng $AC$ và $MN$ cắt nhau tại $O$ nằm giữa $A$, $C$ và nằm giữa $M$, $N$ (dạng đồng hồ cát) nên theo hệ quả của định lí Thalès: $\dfrac{AM}{CN}=\dfrac{OM}{ON}$.
Vì $AB\parallel CD$ nên $BM\parallel DN$. Hai đường thẳng $BD$ và $MN$ cắt nhau tại $O$ nằm giữa $B$, $D$ và nằm giữa $M$, $N$ nên theo hệ quả của định lí Thalès: $\dfrac{BM}{DN}=\dfrac{OM}{ON}$.
Suy ra $\dfrac{AM}{CN}=\dfrac{BM}{DN}$, do đó $\dfrac{AM}{BM}=\dfrac{CN}{DN}$, tức $\dfrac{MA}{MB}=\dfrac{NC}{ND}$ (đpcm).

##ĐL Bổ đề 3 (đường thẳng IO đi qua trung điểm hai đáy)
Cho hình thang $ABCD$ ($AB\parallel CD$), $AD$ cắt $BC$ tại $I$, $AC$ cắt $BD$ tại $O$. Đường thẳng $IO$ cắt $AB$, $CD$ lần lượt tại $M$, $N$. Khi đó $M$, $N$ là trung điểm của $AB$, $CD$.

{{HINH:bode_ba|Bổ đề 3: đường thẳng IO cắt AB tại M, cắt CD tại N}}

##TC Chứng minh Bổ đề 3
Đường thẳng $IO$ đi qua $I$ và đi qua $O$ nên có thể áp dụng cả hai bổ đề trên với cùng hai điểm $M$, $N$.
Theo Bổ đề 1 (đường thẳng $IMN$ qua $I$): $\dfrac{MA}{MB}=\dfrac{ND}{NC}$. (1)
Theo Bổ đề 2 (đường thẳng $MNO$ qua $O$): $\dfrac{MA}{MB}=\dfrac{NC}{ND}$. (2)
Nhân (1) với (2) theo từng vế: $\left(\dfrac{MA}{MB}\right)^{2}=\dfrac{ND}{NC}\cdot\dfrac{NC}{ND}=1$, suy ra $\dfrac{MA}{MB}=1$, tức $MA=MB$. Mà $M$ thuộc $AB$ nên $M$ là trung điểm của $AB$.
Thay $\dfrac{MA}{MB}=1$ vào (1) ta được $\dfrac{ND}{NC}=1$, tức $ND=NC$. Mà $N$ thuộc $CD$ nên $N$ là trung điểm của $CD$ (đpcm).

##ĐL Hệ quả (đảo của Bổ đề 3): bốn điểm thẳng hàng
Cho hình thang $ABCD$ ($AB\parallel CD$), $AD$ cắt $BC$ tại $I$, $AC$ cắt $BD$ tại $O$. Nếu $M$, $N$ lần lượt là trung điểm của $AB$, $CD$ thì bốn điểm $I$, $M$, $O$, $N$ thẳng hàng.

{{HINH:bode_dao|Hệ quả: M, N là trung điểm của AB, CD thì I, M, O, N thẳng hàng}}

##TC Chứng minh Hệ quả
Vì $I$ không thuộc đường thẳng $AB$ nên đường thẳng $IM$ khác $AB$ và cắt $AB$ tại $M$; do $AB\parallel CD$ nên $IM$ cắt $CD$ tại một điểm $N_1$.
Theo Bổ đề 1: $\dfrac{N_1D}{N_1C}=\dfrac{MA}{MB}=1$, nên $N_1D=N_1C$, tức $N_1$ là trung điểm của $CD$. Vậy $N_1\equiv N$, do đó $I$, $M$, $N$ thẳng hàng.
Tương tự, $O$ không thuộc đường thẳng $AB$ nên đường thẳng $OM$ cắt $CD$ tại một điểm $N_2$. Theo Bổ đề 2: $\dfrac{N_2C}{N_2D}=\dfrac{MA}{MB}=1$, nên $N_2$ là trung điểm của $CD$. Vậy $N_2\equiv N$, do đó $O$, $M$, $N$ thẳng hàng.
Hai đường thẳng $IM$ và $OM$ cùng đi qua $M$ và $N$ ($M\ne N$ vì $M$, $N$ nằm trên hai đường thẳng song song phân biệt) nên chúng trùng nhau. Vậy $I$, $M$, $O$, $N$ thẳng hàng (đpcm).

##TC Tóm tắt ba bổ đề và hệ quả
- Qua $I$: $\dfrac{MA}{MB}=\dfrac{ND}{NC}$ (cùng thứ tự: $A$ với $D$, $B$ với $C$).
- Qua $O$: $\dfrac{MA}{MB}=\dfrac{NC}{ND}$ (so le: $A$ với $C$, $B$ với $D$).
- $I$, $O$, trung điểm $M$ của $AB$ và trung điểm $N$ của $CD$ cùng nằm trên một đường thẳng; đường thẳng ấy cắt hai đáy tại trung điểm của chúng.

##PP Cách dùng ba bổ đề
Kiểm tra $ABCD$ là hình thang có hai đáy song song, xác định đường thẳng cần xét đi qua $I$ hay đi qua $O$
Đi qua $I$: viết $\dfrac{MA}{MB}=\dfrac{ND}{NC}$; đi qua $O$: viết $\dfrac{MA}{MB}=\dfrac{NC}{ND}$
Muốn chứng minh trung điểm: dùng Bổ đề 3, hoặc cho tỉ số bằng $1$ ở Bổ đề 1 hoặc Bổ đề 2
Muốn chứng minh ba hoặc bốn điểm thẳng hàng: gọi giao điểm của đường thẳng đã biết với đáy, chứng minh giao điểm ấy là trung điểm rồi dùng Hệ quả
Nếu đề không cho sẵn bổ đề, trình bày lại phần chứng minh ngắn gọn bằng định lí Thalès rồi mới áp dụng

##CY Lưu ý
- Cả ba bổ đề đều cần $AB\parallel CD$.
- Bổ đề 1 và Bổ đề 2 chỉ khác nhau ở thứ tự: qua $I$ thì $\dfrac{ND}{NC}$, qua $O$ thì $\dfrac{NC}{ND}$. Tránh viết nhầm hai tỉ số này.
- Ở Bổ đề 3, hai điểm $M$, $N$ là giao điểm của cùng một đường thẳng $IO$ với hai đáy nên phải dùng đồng thời cả hai bổ đề trước.
- Khi hình thang là hình bình hành thì $I$ không tồn tại ($AD\parallel BC$); lúc đó chỉ dùng được Bổ đề 2.
- Các bổ đề này chỉ dùng định lí Thalès, chưa dùng tam giác đồng dạng.
