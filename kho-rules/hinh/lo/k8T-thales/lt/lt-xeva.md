##ĐN Cát tuyến của tam giác
Cho tam giác $ABC$.
Đường thẳng $d$ không đi qua đỉnh nào của tam giác và cắt các đường thẳng $BC$, $CA$, $AB$ lần lượt tại $M$, $N$, $P$ gọi là một cát tuyến của tam giác.
Ba điểm $M$, $N$, $P$ nằm trên các đường thẳng chứa ba cạnh,
có thể nằm trên cạnh hoặc nằm ngoài cạnh (trên phần kéo dài của cạnh).

##TC Nhận xét về vị trí các giao điểm
Đường thẳng $d$ không đi qua đỉnh nào chia mặt phẳng thành hai nửa mặt phẳng.
Hai đỉnh nằm cùng phía đối với $d$
thì $d$ không cắt cạnh nối hai đỉnh ấy; hai đỉnh nằm khác phía
thì $d$ cắt cạnh nối chúng.
Ba đỉnh được chia vào hai nửa mặt phẳng theo kiểu $3+0$ hoặc $2+1$,
nên $d$ cắt đúng $0$ hoặc $2$ cạnh của tam giác.
Vậy trong ba giao điểm $M$, $N$, $P$ có $1$ hoặc $3$ điểm nằm ngoài cạnh (số điểm nằm ngoài cạnh là số lẻ).

##ĐL Định lí Mê-nê-la-uýt
Cho tam giác $ABC$ và một đường thẳng $d$ không đi qua đỉnh nào của tam giác,
cắt các đường thẳng $BC$, $CA$, $AB$ lần lượt tại $M$, $N$, $P$.
Khi đó $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$.

{{HINH:menelaus|Mê-nê-la-uýt: cát tuyến d cắt cạnh AB tại P, cạnh AC tại N, đường thẳng BC tại M}}

{{HINH:menelaus_ba_ngoai|Mê-nê-la-uýt: cát tuyến d cắt cả ba đường thẳng BC, CA, AB ở phần kéo dài}}

##TC Chứng minh Định lí Mê-nê-la-uýt
Vì $d$ cắt $AB$ tại $P$ nên $d$ không song song với $AB$.
Qua $C$ kẻ đường thẳng song song với $AB$, cắt $d$ tại $K$.
Vì $CK\parallel BP$ và hai đường thẳng $BC$, $PK$ cắt nhau tại $M$
nên theo hệ quả của định lí Thalès: $\dfrac{MB}{MC}=\dfrac{BP}{CK}$.
Vì $CK\parallel AP$ và hai đường thẳng $CA$, $KP$ cắt nhau tại $N$
nên theo hệ quả của định lí Thalès: $\dfrac{NC}{NA}=\dfrac{CK}{AP}$.
Nhân hai đẳng thức theo từng vế: $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}=\dfrac{BP}{CK}\cdot\dfrac{CK}{AP}=\dfrac{BP}{AP}$.
Suy ra $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=\dfrac{BP}{AP}\cdot\dfrac{PA}{PB}=1$ (đpcm).

{{HINH:menelaus_cm|Chứng minh: qua C kẻ CK song song AB, K thuộc d}}

##ĐL Định lí Mê-nê-la-uýt đảo
Cho tam giác $ABC$,
các điểm $M$, $N$, $P$ lần lượt thuộc các đường thẳng $BC$, $CA$, $AB$ và khác các đỉnh,
trong đó có $1$ hoặc $3$ điểm nằm ngoài cạnh.
Nếu $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ thì ba điểm $M$, $N$, $P$ thẳng hàng.

##TC Chứng minh Định lí Mê-nê-la-uýt đảo
Vì $M$, $N$ khác các đỉnh và nằm trên hai đường thẳng $BC$, $CA$ khác nhau
nên đường thẳng $MN$ không đi qua đỉnh nào của tam giác.
Chẳng hạn nếu $MN$ đi qua $A$
thì $MN$ trùng $CA$,
suy ra $M$ là giao điểm của $CA$ và $BC$,
tức $M\equiv C$, vô lí; các trường hợp đi qua $B$, $C$ tương tự.
Trường hợp 1: $MN$ không song song với $AB$.
Gọi $P'$ là giao điểm của $MN$ và $AB$.
Theo định lí Mê-nê-la-uýt cho cát tuyến $MNP'$: $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{P'A}{P'B}=1$.
So với giả thiết suy ra $\dfrac{P'A}{P'B}=\dfrac{PA}{PB}$.
Theo nhận xét ở trên,
trong ba điểm $M$, $N$, $P'$ có số lẻ điểm nằm ngoài cạnh; theo giả thiết trong ba điểm $M$, $N$, $P$ cũng vậy.
Hai bộ ba cùng chứa $M$, $N$
nên $P$ và $P'$ cùng nằm trong đoạn $AB$ hoặc cùng nằm ngoài đoạn $AB$.
Trên đường thẳng $AB$,
với một tỉ số $k$ cho trước chỉ có đúng một điểm nằm trong đoạn $AB$ và nhiều nhất một điểm nằm ngoài đoạn $AB$ thoả $XA:XB=k$.
Vậy $P\equiv P'$, tức $M$, $N$, $P$ thẳng hàng.
Trường hợp 2: $MN\parallel AB$.
Theo hệ quả của định lí Thalès: $\dfrac{CM}{CB}=\dfrac{CN}{CA}$,
suy ra $\dfrac{MB}{MC}=\dfrac{NA}{NC}$,
tức $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}=1$.
Từ giả thiết suy ra $\dfrac{PA}{PB}=1$,
nên $P$ là trung điểm của $AB$, nằm trong đoạn $AB$.
Mặt khác $M$, $N$ cùng nằm trong cạnh hoặc cùng nằm ngoài cạnh (vì $\dfrac{CM}{CB}=\dfrac{CN}{CA}$ cùng chiều),
nên số điểm nằm ngoài cạnh trong ba điểm $M$, $N$, $P$ là $0$ hoặc $2$,
trái với giả thiết.
Vậy trường hợp 2 không xảy ra (đpcm).

{{HINH:menelaus_dao|Chứng minh đảo: MN cắt AB tại P'}}

##ĐL Định lí Xê-va
Cho tam giác $ABC$ và các điểm $D$, $E$, $F$ lần lượt thuộc các cạnh $BC$, $CA$, $AB$ (khác các đỉnh).
Nếu ba đường thẳng $AD$, $BE$, $CF$ đồng quy thì $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$.

{{HINH:xeva|Xê-va: AD, BE, CF đồng quy tại O}}

##TC Chứng minh Định lí Xê-va
Gọi $O$ là điểm chung của $AD$, $BE$, $CF$.
Xét tam giác $ABD$ với cát tuyến $CFO$ (đường thẳng $CF$ không đi qua $A$, $B$, $D$; cắt $BD$ tại $C$, cắt $DA$ tại $O$, cắt $AB$ tại $F$).
Theo định lí Mê-nê-la-uýt: $\dfrac{CB}{CD}\cdot\dfrac{OD}{OA}\cdot\dfrac{FA}{FB}=1$. (1)
Xét tam giác $ADC$ với cát tuyến $BEO$ (đường thẳng $BE$ không đi qua $A$, $D$, $C$; cắt $DC$ tại $B$, cắt $CA$ tại $E$, cắt $AD$ tại $O$).
Theo định lí Mê-nê-la-uýt: $\dfrac{BD}{BC}\cdot\dfrac{EC}{EA}\cdot\dfrac{OA}{OD}=1$. (2)
Nhân (1) với (2) theo từng vế và rút gọn $\dfrac{OD}{OA}\cdot\dfrac{OA}{OD}=1$, $\dfrac{CB}{CD}\cdot\dfrac{BD}{BC}=\dfrac{BD}{CD}$:
$\dfrac{BD}{CD}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$, tức $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ (đpcm).

##ĐL Định lí Xê-va đảo
Cho tam giác $ABC$ và các điểm $D$, $E$, $F$ lần lượt thuộc các cạnh $BC$, $CA$, $AB$ (khác các đỉnh).
Nếu $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ thì ba đường thẳng $AD$, $BE$, $CF$ đồng quy.

##TC Chứng minh Định lí Xê-va đảo
Hai đoạn thẳng $AD$ và $BE$ cắt nhau tại một điểm $O$ nằm trong tam giác.
Đường thẳng $CO$ cắt cạnh $AB$ tại $F'$.
Theo định lí Xê-va cho ba đường thẳng $AD$, $BE$, $CF'$ đồng quy tại $O$: $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{F'A}{F'B}=1$.
So với giả thiết suy ra $\dfrac{F'A}{F'B}=\dfrac{FA}{FB}$.
Hai điểm $F$, $F'$ cùng nằm trong đoạn $AB$ và có cùng tỉ số $\dfrac{XA}{XB}$
nên $F\equiv F'$.
Vậy $AD$, $BE$, $CF$ đồng quy tại $O$ (đpcm).

{{HINH:xeva_dao|Chứng minh đảo: AD cắt BE tại O, CO cắt AB tại F'}}

##PP Cách dùng hai định lí
Mê-nê-la-uýt: xác định cát tuyến,
gọi tên ba giao điểm $M$, $N$, $P$ trên các đường thẳng $BC$, $CA$, $AB$
Viết tích ba tỉ số theo thứ tự vòng quanh tam giác: $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ rồi thay số để tính độ dài hoặc tỉ số
Chứng minh ba điểm thẳng hàng: kiểm tra tích ba tỉ số bằng $1$ và số điểm nằm ngoài cạnh là số lẻ,
rồi dùng Mê-nê-la-uýt đảo
Xê-va: ba điểm $D$, $E$, $F$ trên ba cạnh; viết $\dfrac{DB}{DC}\cdot\dfrac{EC}{EA}\cdot\dfrac{FA}{FB}=1$ để tính tỉ số khi biết ba đường đồng quy
Chứng minh ba đường đồng quy: tính tích ba tỉ số bằng $1$ rồi dùng Xê-va đảo (ba trung tuyến, ba phân giác trong là hai ví dụ quen thuộc)
Khi dùng, gọi đúng tên: "theo định lí Mê-nê-la-uýt cho tam giác $ABC$ với cát tuyến $MNP$", "theo định lí Xê-va cho tam giác $ABC$ có $AD$, $BE$, $CF$ đồng quy"

##CY Lưu ý
- Cả ba tỉ số lấy theo thứ tự vòng quanh tam giác $A\to B\to C$: mỗi tỉ số là (đoạn tới đỉnh đứng trước) chia (đoạn tới đỉnh đứng sau),
  không đảo ngược.
- Mê-nê-la-uýt dùng cát tuyến cắt cả ba đường thẳng chứa cạnh; cát tuyến song song với một cạnh
  thì chỉ có hai giao điểm, không áp dụng được.
- Chứng minh thẳng hàng bằng độ dài (không có dấu) phải kèm điều kiện có $1$ hoặc $3$ điểm nằm ngoài cạnh; thiếu điều kiện này tích bằng $1$ chưa đủ kết luận.
- Ở bài này Xê-va chỉ xét ba điểm nằm trên ba cạnh.
- Hai định lí chỉ dùng định lí Thalès,
  chưa dùng tam giác đồng dạng hay diện tích.
