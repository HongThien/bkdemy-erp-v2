# MẪU nội dung một dạng bài đã chuẩn (đúng kí hiệu thẻ)

Kí hiệu: ##TC (kiến thức cần nhớ / công thức) · ##PP (phương pháp giải, mỗi dòng 1 trường hợp/bước) · ##CY (chú ý, mỗi dòng 1 ý, bắt đầu bằng •) · ##VD (ví dụ; sau đề là dòng "Bài giải:" rồi từng bước một dòng, KHÔNG dòng trống trong lời giải). Dòng trống chỉ để cắt khối. Công thức LaTeX trong $…$ (không $$), phân số dfrac, nhân cdot, vectơ overrightarrow{...}. 

=== NDB02593 · Nhận biết dạng phương trình mặt phẳng, đường thẳng
--- mo_ta:
Đề hỏi "phương trình nào là phương trình tổng quát của mặt phẳng / chính tắc của đường thẳng" hoặc "mặt phẳng (Oxy)/(Oyz)/(Oxz) có phương trình là". Việc làm: nhớ dạng Ax+By+Cz+D=0 với (A;B;C)≠0, dạng chính tắc (mẫu khác 0), và (Oxy): z=0, (Oyz): x=0, (Oxz): y=0. Mức 1, gặp nhiều ở đề giữa kì theo SGK mới.
--- ly_thuyet:
##TC Dạng phương trình mặt phẳng
• Phương trình tổng quát của mặt phẳng: $Ax+By+Cz+D=0$ với $A^2+B^2+C^2>0$ (ba hệ số $A,B,C$ không đồng thời bằng $0$), vectơ pháp tuyến $\overrightarrow{n}=(A;B;C)$.
• Các biến $x,y,z$ chỉ xuất hiện ở bậc nhất, không có bình phương, không có tích hai biến, không nằm ở mẫu số.
• Phương trình thiếu một hay hai biến vẫn là phương trình mặt phẳng, ví dụ $2x-3z+1=0$, $x-1=0$.
• Mặt phẳng toạ độ: $(Oxy):z=0$, $(Oyz):x=0$, $(Oxz):y=0$.

##TC Dạng chính tắc của đường thẳng
• Đường thẳng đi qua $M_0(x_0;y_0;z_0)$ có vectơ chỉ phương $\overrightarrow{u}=(a;b;c)$ với $abc\ne0$ có phương trình chính tắc $\dfrac{x-x_0}{a}=\dfrac{y-y_0}{b}=\dfrac{z-z_0}{c}$.
• Tử số là $x-x_0$, $y-y_0$, $z-z_0$ với $x_0,y_0,z_0$ là hằng số; ba mẫu số $a,b,c$ là hằng số và đều khác $0$.

##PP Nhận biết phương trình đã cho thuộc dạng nào
Phương trình một vế bằng $0$ hoặc bằng hằng số, chỉ có $x,y,z$ bậc nhất: đối chiếu với $Ax+By+Cz+D=0$ và kiểm tra $A,B,C$ không đồng thời bằng $0$.
Phương trình có hai dấu bằng, ba phân thức: đối chiếu với dạng chính tắc, kiểm tra tử là $x-x_0$, $y-y_0$, $z-z_0$ và mẫu là ba số khác $0$.
Gặp $x^2$, $xz$, $\dfrac{1}{x}$ hoặc biến nằm ở mẫu: loại ngay, không phải mặt phẳng và không phải chính tắc.
Với mặt phẳng toạ độ: mặt phẳng chứa hai trục nào thì biến còn lại bằng $0$.

##CY
• Dạng đoạn chắn $\dfrac{x}{a}+\dfrac{y}{b}+\dfrac{z}{c}=1$ là cách viết khác của mặt phẳng, nhưng đề hỏi "phương trình tổng quát" thì chọn dạng $Ax+By+Cz+D=0$.
• Phương trình có hai dấu bằng liên kết ba phân thức là đường thẳng, không phải mặt phẳng.
• Mẫu số bằng $0$ hoặc chứa biến thì không phải phương trình chính tắc.
• $(Oxy)$ có phương trình $z=0$ (không phải $x=0$ hay $y=0$): nhớ biến vắng mặt trong tên mặt phẳng.
--- vi_du:
##VD
a) Trong các phương trình sau, phương trình nào là phương trình tổng quát của một mặt phẳng?
(1) $2x-y+3=0$ (2) $x^2+y+z-1=0$ (3) $\dfrac{1}{x}+\dfrac{2}{y}+\dfrac{3}{z}=1$ (4) $3x+4z=0$ (5) $\dfrac{x-1}{2}=\dfrac{y}{3}=\dfrac{z+1}{1}$
b) Viết phương trình mặt phẳng $(Oyz)$.

Bài giải:
a) (1) có dạng $Ax+By+Cz+D=0$ với $A=2$, $B=-1$, $C=0$, $D=3$ và $A,B,C$ không đồng thời bằng $0$ nên là mặt phẳng.
(2) có $x^2$ nên không phải mặt phẳng; (3) có biến ở mẫu số nên không phải mặt phẳng.
(4) có $A=3$, $B=0$, $C=4$, $D=0$ nên là mặt phẳng.
(5) có hai dấu bằng và ba phân thức nên là phương trình chính tắc của đường thẳng, không phải mặt phẳng.
b) Mặt phẳng $(Oyz)$ chứa trục $Oy$ và $Oz$ nên mọi điểm của nó có hoành độ $x=0$.
Vậy các phương trình (1) và (4) là phương trình mặt phẳng; $(Oyz)$ có phương trình $x=0$.

##VD
a) Phương trình nào sau đây là phương trình chính tắc của một đường thẳng?
(1) $\dfrac{x-1}{2}=\dfrac{y+3}{-4}=\dfrac{z}{5}$ (2) $\dfrac{x-1}{2}=\dfrac{y+3}{y}=\dfrac{z}{5}$ (3) $\dfrac{x-1}{2}=\dfrac{y+3}{0}=\dfrac{z}{5}$ (4) $\dfrac{x}{2}=\dfrac{y-1}{3}=\dfrac{z+2}{1}$
b) Trong các phương trình sau, phương trình nào **không** phải là phương trình tổng quát của một mặt phẳng?
(1) $x+2y+yz-3=0$ (2) $z-1=0$ (3) $\dfrac{x}{2}+\dfrac{y}{3}+\dfrac{z}{-1}=1$ (4) $4x-z=0$ (5) $x-y+z^2=0$

Bài giải:
a) (1) có tử $x-1$, $y+3$, $z-0$ và ba mẫu $2,-4,5$ đều khác $0$ nên là phương trình chính tắc.
(2) có mẫu $y$ chứa biến nên không phải chính tắc.
(3) có một mẫu bằng $0$ nên không thuộc dạng chính tắc với $abc\ne0$.
(4) có tử $x-0$, $y-1$, $z+2$ và mẫu $2,3,1$ khác $0$ nên là phương trình chính tắc.
b) (1) có tích $yz$ của hai biến nên không phải phương trình mặt phẳng; (5) có $z^2$ nên cũng không phải.
(2) có $A=B=0$, $C=1$ nên là phương trình tổng quát; (4) có $A=4$, $B=0$, $C=-1$, $D=0$ nên là phương trình tổng quát.
(3) là phương trình đoạn chắn của một mặt phẳng nhưng chưa viết ở dạng $Ax+By+Cz+D=0$; quy đồng mới được $3x+2y-6z-6=0$.
Vậy (1) và (4) là phương trình chính tắc; ở câu b) các phương trình (1), (3), (5) không phải là phương trình tổng quát của mặt phẳng.

=== NDB02598 · Mặt phẳng qua điểm cố định: cách gốc xa nhất, chắn ba trục tối ưu
--- mo_ta:
Mặt phẳng qua M cố định: cách O xa nhất (pháp tuyến = OM), hoặc cắt ba trục tại A, B, C để thể tích OABC / diện tích ABC / biểu thức 1/OA²+… nhỏ nhất, hoặc tổng khoảng cách từ hai điểm nhỏ nhất. Việc làm: phương trình đoạn chắn x/a+y/b+z/c=1 qua M rồi AM-GM/Bunhia, hoặc nhận ra pháp tuyến. Nhiều bài thực tế (góc tường, cốt pha, kho mini).
--- ly_thuyet:
##TC Mặt phẳng qua điểm cố định
• Mặt phẳng $(P)$ qua $M$ cách $O$ xa nhất: $d(O,(P))\le OM$, dấu bằng khi $OM\perp(P)$, tức $\overrightarrow{n_P}=\overrightarrow{OM}$ và $d_{\max}=OM$.
• Mặt phẳng cắt $Ox,Oy,Oz$ tại $A(a;0;0)$, $B(0;b;0)$, $C(0;0;c)$ ($abc\ne0$): $\dfrac{x}{a}+\dfrac{y}{b}+\dfrac{z}{c}=1$; thể tích tứ diện $V_{OABC}=\dfrac{|abc|}{6}$ và $\dfrac{1}{d^2(O,(P))}=\dfrac{1}{a^2}+\dfrac{1}{b^2}+\dfrac{1}{c^2}$.
• $M(m;n;p)\in(P)$ nên $\dfrac{m}{a}+\dfrac{n}{b}+\dfrac{p}{c}=1$.
• Với $m,n,p>0$ và $a,b,c>0$ (cắt các tia dương): AM-GM cho $1\ge3\sqrt[3]{\dfrac{mnp}{abc}}$ nên $abc\ge27mnp$, $V_{\min}=\dfrac{9mnp}{2}$ khi $a=3m$, $b=3n$, $c=3p$.
• Bunhia: $\left(\dfrac{\alpha}{a^2}+\dfrac{\beta}{b^2}+\dfrac{\gamma}{c^2}\right)\left(\dfrac{m^2}{\alpha}+\dfrac{n^2}{\beta}+\dfrac{p^2}{\gamma}\right)\ge\left(\dfrac{m}{a}+\dfrac{n}{b}+\dfrac{p}{c}\right)^2=1$ cho biểu thức có hệ số.
• $(P)$ qua $A$ cố định, $B,C$ cùng phía $(P)$: $\alpha\,d(B,(P))+\beta\,d(C,(P))=(\alpha+\beta)\,d(K,(P))\le(\alpha+\beta)AK$ với $K=\dfrac{\alpha B+\beta C}{\alpha+\beta}$ ($\alpha,\beta>0$); lớn nhất khi $(P)$ nhận $\overrightarrow{AK}$ làm vectơ pháp tuyến.

##PP Mặt phẳng qua điểm cố định
Đề hỏi cách gốc xa nhất: lấy pháp tuyến $\overrightarrow{OM}$, viết phương trình qua $M$, rồi tính các giao điểm với trục nếu cần.
Đề hỏi thể tích, diện tích hay biểu thức theo $a,b,c$: viết phương trình đoạn chắn và thay $M$ để được điều kiện $\dfrac{m}{a}+\dfrac{n}{b}+\dfrac{p}{c}=1$.
Áp dụng AM-GM (cho $abc$) hoặc Bunhia (cho tổng nghịch đảo bình phương) rồi tìm điều kiện dấu bằng.
Tìm $a,b,c$ và tính đại lượng đề hỏi (thể tích, tổng $9a+9b+c$...).

##CY
• Công thức $V=\dfrac{abc}{6}$ chỉ đúng khi $a,b,c$ dương; lấy $|abc|$.
• Dấu bằng của AM-GM cần $\dfrac{m}{a}=\dfrac{n}{b}=\dfrac{p}{c}=\dfrac13$: phải kiểm tra tồn tại.
• Bài thực tế (góc tường, kho mini): đặt $O$ tại góc nhà, ba cạnh trên ba mép vuông góc; khoảng cách từ điểm đến nền và hai vách là toạ độ của $M$.
• Mặt phẳng "cắt ba tia" khác "cắt ba trục": hệ số có thể âm nếu chỉ cắt các trục.
--- vi_du:
##VD
Trong không gian $Oxyz$ cho điểm $M(2;1;2)$. Gọi $(P)$ là mặt phẳng đi qua $M$ và cách gốc toạ độ $O$ một khoảng lớn nhất. Viết phương trình $(P)$, tính khoảng cách đó và thể tích tứ diện $OABC$ với $A,B,C$ là giao điểm của $(P)$ với các trục $Ox,Oy,Oz$.

Bài giải:
Với mọi mặt phẳng $(P)$ qua $M$: $d(O,(P))\le OM=\sqrt{4+1+4}=3$, dấu bằng khi $(P)\perp OM$.
Vậy $(P)$ nhận $\overrightarrow{OM}=(2;1;2)$ làm vectơ pháp tuyến: $2(x-2)+(y-1)+2(z-2)=0$ hay $2x+y+2z-9=0$.
Cắt các trục: $A\left(\dfrac92;0;0\right)$, $B(0;9;0)$, $C\left(0;0;\dfrac92\right)$.
$V_{OABC}=\dfrac16\cdot\dfrac92\cdot9\cdot\dfrac92=\dfrac{243}{8}$.
Vậy $(P):2x+y+2z-9=0$, khoảng cách lớn nhất bằng $3$ và $V=\dfrac{243}{8}$.

##VD
Một kho chứa dạng tứ diện $OABC$ dựng ở góc nhà ($O$ là góc nhà, $OA,OB,OC$ nằm trên ba mép đôi một vuông góc). Mặt trước $(ABC)$ phải đi qua van thông gió $M$ cách vách thứ nhất $2$ m, cách vách thứ hai $1{,}5$ m và cách nền $1$ m. Chọn hệ trục có $O$ là gốc và ba mép là $Ox,Oy,Oz$, trong đó nền là $(Oxy)$, vách thứ nhất là $(Oyz)$, vách thứ hai là $(Oxz)$. Tìm thể tích nhỏ nhất của kho và phương trình mặt phẳng $(ABC)$ khi đó.

Bài giải:
Với hệ trục đã chọn, $M(2;1{,}5;1)$. Gọi $A(a;0;0)$, $B(0;b;0)$, $C(0;0;c)$ với $a,b,c>0$. Mặt $(ABC):\dfrac{x}{a}+\dfrac{y}{b}+\dfrac{z}{c}=1$ qua $M$ nên $\dfrac{2}{a}+\dfrac{1{,}5}{b}+\dfrac{1}{c}=1$.
Áp dụng AM-GM: $1\ge3\sqrt[3]{\dfrac{2\cdot1{,}5\cdot1}{abc}}$ nên $abc\ge27\cdot3=81$.
Thể tích $V=\dfrac{abc}{6}\ge\dfrac{81}{6}=13{,}5$ (m$^3$).
Dấu bằng khi $\dfrac{2}{a}=\dfrac{1{,}5}{b}=\dfrac{1}{c}=\dfrac13$, tức $a=6$, $b=4{,}5$, $c=3$.
Mặt phẳng $\dfrac{x}{6}+\dfrac{y}{4{,}5}+\dfrac{z}{3}=1$, nhân $18$ được $3x+4y+6z-18=0$.
Vậy thể tích nhỏ nhất của kho bằng $13{,}5$ m$^3$ và $(ABC):3x+4y+6z-18=0$.

