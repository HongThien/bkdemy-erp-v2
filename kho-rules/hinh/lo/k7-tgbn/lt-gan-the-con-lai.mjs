// Thùy 05/11 "Chuyển hết đi chứ": gắn thẻ spec-format cho MỌI lý thuyết Hình–Học còn lại (ngoài 8 bài đã làm ở lt-gan-the.mjs).
// · 10 bài lý thuyết thật (K11 HH00087 · K7 HH00001, HH00112 · K8 HH00111 · K9 HH00105–110): khung **1. …** gõ tay ⇒ ##ĐN/##ĐL/##TC/##CY/##NX,
//   giữ nguyên câu chữ (chỉ sửa 2 lỗi gõ hiển nhiên: "mỗi mặt phẳng các," · "tại đỉnh $\widehat{C}$"); ảnh = đoạn riêng ngoài khung.
// · 19 bài "mô hình" mà ô lý thuyết chỉ là CẤU HÌNH chung của bài ("Cho hai tia Ox, Oy đối nhau…" + ảnh) ⇒ ##TC Cấu hình của bài + ảnh riêng.
// · 2 bài thử (HH00066 "Hình học Test", HH00085 "test") ⇒ để nguyên.
// Bản cũ lưu lt-cu-con-lai-05-11.json TRƯỚC khi ghi. Kiểm: mọi đoạn có thẻ (trừ ảnh) + in chữ của bản cũ không còn trong bản mới.
//   node kho-rules/hinh/lo/k7-tgbn/lt-gan-the-con-lai.mjs [--ghi]
import pg from 'pg'
import fs from 'node:fs'

const MOI = {
  HH00087: `##ĐN Mặt phẳng
Người ta thường biểu diễn một mặt phẳng bằng một hình bình hành và dùng các chữ cái đặt trong dấu ngoặc đơn để đặt tên cho mặt phẳng ấy. Ví dụ: mặt phẳng $(P)$, mặt phẳng $(Q)$, mặt phẳng $(\\alpha)$, mặt phẳng $(\\beta)$,...

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9ea3a705-5426-43d1-abcc-1205085a7c59.png)

##ĐN Điểm thuộc mặt phẳng
Với mỗi điểm $A$ và mặt phẳng $(P)$, chỉ xảy ra một trong hai khả năng sau:
Điểm $A$ thuộc mặt phẳng $(P)$, ta kí hiệu $A \\in (P)$.
Điểm $A$ không thuộc mặt phẳng $(P)$ hay $A$ nằm ngoài $(P)$, ta kí hiệu $A \\notin (P)$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/28725361-1094-45d0-8ee8-15af1de17699.png)

##ĐN Hình biểu diễn của một hình trong không gian
Hình được vẽ trong mặt phẳng để giúp ta hình dung được về một hình trong không gian gọi là hình biểu diễn của hình không gian đó.

##TC Quy tắc vẽ hình biểu diễn của một hình trong không gian
Để việc vẽ hình biểu diễn của một hình trong không gian được thuận lợi và thống nhất, ta quy ước như sau:
Đường thẳng được biểu diễn bởi đường thẳng. Đoạn thẳng được biểu diễn bởi đoạn thẳng.
Hai đường thẳng song song (hoặc cắt nhau) được biểu diễn bởi đường thẳng song song (hoặc cắt nhau).
Hình biểu diễn giữ nguyên tính liên thuộc giữa điểm với đường thẳng hoặc với đoạn thẳng.
Những đường nhìn thấy được vẽ bằng nét liền, những đường không nhìn thấy được vẽ bằng nét đứt.

##TC Các tính chất thừa nhận của hình học không gian
Do thực tiễn, kinh nghiệm và quan sát, người ta thừa nhận một số tính chất sau của hình học không gian.
Tính chất 1: Có một và chỉ một đường thẳng đi qua hai điểm phân biệt cho trước.
Tính chất 2: Có một và chỉ một mặt phẳng đi qua ba điểm không thẳng hàng cho trước.
Tính chất 3: Tồn tại bốn điểm không cùng thuộc một mặt phẳng.
Tính chất 4: Nếu một đường thẳng có hai điểm phân biệt cùng thuộc một mặt phẳng thì mọi điểm của đường thẳng đều thuộc mặt phẳng đó.
Tính chất 5: Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng còn có một điểm chung khác nữa.

##NX
Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung đi qua điểm chung ấy. Đường thẳng đó được gọi là giao tuyến của hai mặt phẳng.

##TC Tính chất 6
Trên mỗi mặt phẳng, các kết quả đã biết trong hình học phẳng đều đúng.

##ĐL Định lí 1
Cho điểm $A$ không thuộc đường thẳng $d$. Khi đó qua điểm $A$ và đường thẳng $d$ có một và chỉ một mặt phẳng, kí hiệu mp $(A,d)$ hoặc $(A,d)$.

##ĐL Định lí 2
Cho hai đường thẳng $a$ và $b$ cắt nhau. Khi đó qua $a$ và $b$ có một và chỉ một mặt phẳng, kí hiệu là mp $(a,b)$.

##TC Một số cách xác định mặt phẳng
Một mặt phẳng hoàn toàn xác định khi biết:
Nó đi qua ba điểm không thẳng hàng.
Nó đi qua một điểm và một đường thẳng không đi qua điểm đó.
Nó chứa hai đường thẳng cắt nhau.

##ĐN Hình chóp
Trong mặt phẳng $(\\alpha)$ cho đa giác lồi $A_1A_2...A_n$ ($n \\ge 3$). Lấy điểm $S$ nằm ngoài $(\\alpha)$. Lần lượt nối $S$ với các đỉnh $A_1, A_2,..., A_n$ ta được $n$ tam giác $SA_1A_2, SA_2A_3,..., SA_nA_1$. Hình gồm đa giác $A_1A_2...A_n$ và $n$ tam giác $SA_1A_2, SA_2A_3,..., SA_nA_1$ được gọi là hình chóp, kí hiệu là $S.A_1A_2...A_n$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9acd51aa-3a40-49e6-8553-a913003502ad.png)

##ĐN Đỉnh, đáy, cạnh bên, cạnh đáy, mặt bên của hình chóp
Ta gọi $S$ là đỉnh, đa giác $A_1A_2...A_n$ là đáy, các đoạn $SA_1,SA_2,...,SA_n$ là các cạnh bên, $A_1A_2,A_2A_3,...,A_nA_1$ là các cạnh đáy, các tam giác $SA_1A_2,SA_2A_3,...,SA_nA_1$ là các mặt bên.
Nếu đáy của hình chóp là một tam giác, tứ giác, ngũ giác,... thì hình chóp tương ứng gọi là hình chóp tam giác, hình chóp tứ giác, hình chóp ngũ giác,...

##ĐN Hình tứ diện
Cho bốn điểm $A,B,C,D$ không cùng nằm trong một mặt phẳng. Hình gồm bốn tam giác $ABC,ABD,ACD$ và $BCD$ được gọi là hình tứ diện $ABCD$ (hay gọi tắt là tứ diện), kí hiệu là $ABCD$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/91c29e8c-c7a5-4be9-a45d-670a64771b85.png)`,

  HH00001: `##ĐL Tổng ba góc của một tam giác
Tổng ba góc của một tam giác bằng $180^\\circ$.
Trong tam giác $ABC$ ta có: $\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/43879837-d322-4287-8078-ac5b2f0617ed.png)

##CY
- Tam giác có ba góc nhọn là tam giác nhọn;
- Tam giác có một góc tù là tam giác tù;
- Tam giác có một góc vuông là tam giác vuông.
Trong tam giác vuông, hai góc nhọn phụ nhau.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/37eaed8c-2d5f-4327-9fac-0cf287209e0e.png)

##TC Hai góc nhọn của tam giác vuông
Tam giác $ABC$ vuông ở $A$.
Suy ra: $\\widehat{B} + \\widehat{C} = 90^\\circ$.

##ĐN Góc ngoài của tam giác
Tam giác $ABC$ có $Cx$ là tia đối của tia $CB$ thì góc $\\widehat{ACx}$ là góc ngoài tại đỉnh $C$ của tam giác $ABC$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/afb2bd17-05ed-4da4-a383-e14cfb700fb4.png)

##ĐL Tính chất góc ngoài của tam giác
Góc ngoài của một tam giác có số đo bằng tổng hai góc trong không kề với nó.
$\\widehat{ACx} = \\widehat{A} + \\widehat{B}$.`,

  HH00112: `##ĐN Hai góc kề bù
Hai góc kề bù là hai góc có một cạnh chung và hai cạnh còn lại là hai tia đối nhau. Hai góc kề bù có tổng bằng $180^\\circ$.

##ĐN Hai góc đối đỉnh
Hai góc đối đỉnh là hai góc mà mỗi cạnh của góc này là tia đối của một cạnh của góc kia. Hai góc đối đỉnh thì bằng nhau.
Hai đường thẳng cắt nhau tạo thành hai cặp góc đối đỉnh và bốn cặp góc kề bù.
Góc bẹt là góc có số đo $180^\\circ$.

##ĐN Tia phân giác của một góc
Tia $Oz$ là tia phân giác của góc $xOy$ nếu $Oz$ nằm giữa hai tia $Ox$, $Oy$ và $\\widehat{xOz}=\\widehat{zOy}=\\dfrac{1}{2}\\widehat{xOy}$.

##TC Tia nằm giữa hai tia
Nếu tia $Oz$ nằm giữa hai tia $Ox$, $Oy$ thì $\\widehat{xOz}+\\widehat{zOy}=\\widehat{xOy}$.

##ĐN Các cặp góc tạo bởi một đường thẳng cắt hai đường thẳng
Khi đường thẳng $c$ cắt hai đường thẳng $a$, $b$ thì tạo ra các cặp góc so le trong, các cặp góc đồng vị và các cặp góc trong cùng phía.

##TC Dấu hiệu nhận biết hai đường thẳng song song
Nếu đường thẳng $c$ cắt hai đường thẳng $a$, $b$ và có một cặp góc so le trong bằng nhau (hoặc một cặp góc đồng vị bằng nhau) thì $a \\parallel b$.

##ĐL Tiên đề Euclid
Qua một điểm nằm ngoài một đường thẳng, chỉ có một đường thẳng song song với đường thẳng đó.

##TC Tính chất của hai đường thẳng song song
Nếu một đường thẳng cắt hai đường thẳng song song thì:
- hai góc so le trong bằng nhau;
- hai góc đồng vị bằng nhau;
- hai góc trong cùng phía bù nhau (có tổng bằng $180^\\circ$).
Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì chúng song song với nhau.
Hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì chúng song song với nhau.
Một đường thẳng vuông góc với một trong hai đường thẳng song song thì cũng vuông góc với đường thẳng còn lại.

##ĐN Định lí và chứng minh định lí
Định lí là một khẳng định được suy ra từ những khẳng định đúng đã biết. Định lí thường được phát biểu dưới dạng "Nếu $\\ldots$ thì $\\ldots$": phần sau chữ "nếu" là giả thiết (GT), phần sau chữ "thì" là kết luận (KL).
Chứng minh một định lí là dùng lập luận để từ giả thiết suy ra kết luận.

##ĐN Hình bình hành
Hình bình hành là tứ giác có các cạnh đối song song.`,

  HH00111: `##ĐN Tứ giác
Tứ giác $ABCD$ là hình gồm bốn đoạn thẳng $AB, BC, CD, DA$, trong đó không có hai đoạn thẳng nào nằm trên cùng một đường thẳng.
Tứ giác lồi là tứ giác mà hai đỉnh thuộc một cạnh bất kì luôn nằm về một phía của đường thẳng đi qua hai đỉnh còn lại. Khi nói đến tứ giác mà không chú thích gì thêm, ta hiểu đó là tứ giác lồi.

##ĐL Tổng các góc của một tứ giác
Tổng các góc của một tứ giác bằng $360^\\circ$.

##ĐN Hình thang. Hình thang cân
Hình thang là tứ giác có hai cạnh đối song song.
Hình thang cân là hình thang có hai góc kề một đáy bằng nhau.

##TC Tính chất và dấu hiệu nhận biết hình thang cân
Trong hình thang cân, hai cạnh bên bằng nhau; hai đường chéo bằng nhau.
Dấu hiệu nhận biết: Hình thang có hai đường chéo bằng nhau là hình thang cân.

##ĐN Hình bình hành
Hình bình hành là tứ giác có các cạnh đối song song.

##TC Tính chất hình bình hành
Trong hình bình hành, các cạnh đối bằng nhau; các góc đối bằng nhau; hai đường chéo cắt nhau tại trung điểm của mỗi đường.

##TC Dấu hiệu nhận biết hình bình hành
- Tứ giác có các cạnh đối bằng nhau là hình bình hành.
- Tứ giác có một cặp cạnh đối song song và bằng nhau là hình bình hành.
- Tứ giác có các góc đối bằng nhau là hình bình hành.
- Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành.

##ĐN Hình chữ nhật
Hình chữ nhật là tứ giác có bốn góc vuông.

##TC Tính chất hình chữ nhật
Trong hình chữ nhật, hai đường chéo bằng nhau và cắt nhau tại trung điểm của mỗi đường.

##TC Dấu hiệu nhận biết hình chữ nhật
- Hình bình hành có một góc vuông là hình chữ nhật.
- Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật.

##ĐL Đường trung tuyến ứng với cạnh huyền
Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.
Ngược lại, nếu một tam giác có một đường trung tuyến bằng nửa cạnh tương ứng thì tam giác đó là tam giác vuông.

##ĐN Hình thoi
Hình thoi là tứ giác có bốn cạnh bằng nhau.

##TC Tính chất hình thoi
Trong hình thoi, hai đường chéo vuông góc với nhau và là các đường phân giác của các góc của hình thoi.

##TC Dấu hiệu nhận biết hình thoi
- Hình bình hành có hai cạnh kề bằng nhau là hình thoi.
- Hình bình hành có hai đường chéo vuông góc với nhau là hình thoi.
- Hình bình hành có một đường chéo là đường phân giác của một góc là hình thoi.

##ĐN Hình vuông
Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau.

##TC Tính chất hình vuông
Trong hình vuông, hai đường chéo bằng nhau, vuông góc với nhau, cắt nhau tại trung điểm của mỗi đường và là các đường phân giác của các góc của hình vuông.

##TC Dấu hiệu nhận biết hình vuông
- Hình chữ nhật có hai cạnh kề bằng nhau là hình vuông.
- Hình chữ nhật có hai đường chéo vuông góc với nhau là hình vuông.
- Hình chữ nhật có một đường chéo là đường phân giác của một góc là hình vuông.
- Hình thoi có một góc vuông là hình vuông.
- Hình thoi có hai đường chéo bằng nhau là hình vuông.`,

  HH00105: `##ĐN Đường tròn
Đường tròn tâm $O$ bán kính $R$ $(R>0)$, kí hiệu $(O;R)$, là hình gồm tất cả các điểm cách điểm $O$ một khoảng bằng $R$. Khi không cần để ý đến bán kính ta kí hiệu là $(O)$.
Nếu $A$ là một điểm của đường tròn $(O)$ ta viết $A\\in(O)$; ta còn nói đường tròn $(O)$ đi qua điểm $A$.

##TC Vị trí của một điểm đối với đường tròn
Cho đường tròn $(O;R)$ và điểm $M$:
- $M$ nằm trên đường tròn $(O;R)$ nếu $OM=R$;
- $M$ nằm trong đường tròn $(O;R)$ nếu $OM<R$;
- $M$ nằm ngoài đường tròn $(O;R)$ nếu $OM>R$.

##ĐN Hình tròn
Hình tròn tâm $O$ bán kính $R$ là hình gồm các điểm nằm trên và nằm trong đường tròn $(O;R)$.

##ĐN Hai điểm đối xứng
Hai điểm $M$ và $M'$ đối xứng với nhau qua điểm $I$ nếu $I$ là trung điểm của đoạn thẳng $MM'$.
Hai điểm $M$ và $M'$ đối xứng với nhau qua đường thẳng $d$ nếu $d$ là đường trung trực của đoạn thẳng $MM'$.

##TC Tính đối xứng của đường tròn
Đường tròn là hình có tâm đối xứng; tâm của đường tròn là tâm đối xứng của nó.
Đường tròn là hình có trục đối xứng; mỗi đường thẳng đi qua tâm (mỗi đường kính) là một trục đối xứng của nó. Đường tròn có vô số trục đối xứng.

##TC Chứng minh nhiều điểm cùng thuộc một đường tròn
Chỉ ra một điểm cách đều tất cả các điểm đó.
Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền ⇒ ba đỉnh của tam giác vuông cùng thuộc đường tròn có tâm là trung điểm cạnh huyền.
Ngược lại, nếu điểm $A$ (khác $B$, $C$) nằm trên đường tròn đường kính $BC$ thì tam giác $ABC$ vuông tại $A$ (đường trung tuyến $AO$ bằng nửa cạnh $BC$).
Bốn đỉnh của hình chữ nhật (hình vuông) cùng thuộc đường tròn có tâm là giao điểm hai đường chéo.

##ĐN Dây và đường kính
Đoạn thẳng nối hai điểm của đường tròn gọi là dây (dây cung). Dây đi qua tâm gọi là đường kính; đường kính của đường tròn bán kính $R$ có độ dài $2R$.

##TC Đường kính là dây lớn nhất
Trong một đường tròn, đường kính là dây lớn nhất: nếu $AB$ là một dây của $(O;R)$ thì $AB\\le2R$; khi $AB$ không đi qua tâm thì $AB<2R$.

##ĐN Góc ở tâm, cung
Góc ở tâm là góc có đỉnh trùng với tâm của đường tròn.
Khi $\\widehat{AOB}$ không bẹt, cung nằm trong góc gọi là cung nhỏ, cung còn lại gọi là cung lớn. Khi $\\widehat{AOB}$ bẹt thì mỗi cung $AB$ là một nửa đường tròn. Ta nói góc $\\widehat{AOB}$ chắn cung $AB$.

##TC Số đo cung
Số đo của cung nhỏ bằng số đo của góc ở tâm chắn cung đó. Số đo của cung lớn bằng $360^\\circ$ trừ số đo cung nhỏ có chung hai mút. Số đo nửa đường tròn bằng $180^\\circ$. Cả đường tròn là cung $360^\\circ$.
Kí hiệu số đo cung $AB$ là sđ$\\overset{\\frown}{AB}$. Hai cung trên một đường tròn bằng nhau nếu chúng có cùng số đo.
Nếu $C$ là một điểm nằm trên cung $AB$ thì sđ$\\overset{\\frown}{AB}=$ sđ$\\overset{\\frown}{AC}+$ sđ$\\overset{\\frown}{CB}$.`,

  HH00106: `##TC Độ dài đường tròn
Tỉ số giữa độ dài đường tròn và đường kính của nó luôn bằng một số không đổi, kí hiệu là $\\pi$ ($\\pi\\approx3{,}14$).
Độ dài (chu vi) $C$ của đường tròn bán kính $R$, đường kính $d=2R$: $C=\\pi d=2\\pi R$.

##TC Độ dài cung tròn
Độ dài $l$ của cung $n^\\circ$ trên đường tròn bán kính $R$: $l=\\dfrac{\\pi Rn}{180}$.
Tỉ số giữa độ dài cung $n^\\circ$ và độ dài đường tròn (cùng bán kính) bằng $\\dfrac{n}{360}$: $l=\\dfrac{n}{360}C$.
Từ công thức suy ra: $R=\\dfrac{180\\,l}{\\pi n}$; $n=\\dfrac{180\\,l}{\\pi R}$.

##CY
Nếu không nói gì thêm thì lấy $\\pi$ theo máy tính; kết quả làm tròn theo yêu cầu đề bài, chỉ làm tròn ở bước cuối.`,

  HH00107: `##TC Diện tích hình tròn
Diện tích hình tròn bán kính $R$: $S=\\pi R^2$.

##ĐN Hình quạt tròn
Hình quạt tròn là phần hình tròn giới hạn bởi một cung tròn và hai bán kính đi qua hai mút của cung đó.

##TC Diện tích hình quạt tròn
Diện tích hình quạt tròn bán kính $R$ ứng với cung $n^\\circ$: $S_q=\\dfrac{\\pi R^2n}{360}=\\dfrac{l\\cdot R}{2}$ ($l$ là độ dài cung).
Tỉ số giữa diện tích hình quạt ứng với cung $n^\\circ$ và diện tích hình tròn (cùng bán kính) bằng $\\dfrac{n}{360}$.

##ĐN Hình viên phân
Hình viên phân là hình giới hạn bởi một cung tròn và dây căng cung đó.

##TC Diện tích hình viên phân
$S_{\\text{viên phân}}=S_{\\text{quạt }OAB}-S_{\\triangle OAB}$.
Diện tích tam giác: $S=\\dfrac12a\\cdot h$ ($h$ là chiều cao ứng với cạnh $a$).

##ĐN Hình vành khuyên
Hình vành khuyên (hình vành khăn) là phần nằm giữa hai đường tròn cùng tâm $(O;R)$ và $(O;r)$ với $R>r$.

##TC Diện tích hình vành khuyên
Diện tích hình vành khuyên: $S=\\pi\\left(R^2-r^2\\right)$.`,

  HH00108: `##TC Vị trí tương đối của đường thẳng và đường tròn
Gọi $d$ là khoảng cách từ tâm $O$ đến đường thẳng $a$ ($d=OH$, $H$ là chân đường vuông góc kẻ từ $O$ đến $a$).
- Đường thẳng $a$ và $(O;R)$ cắt nhau (có đúng hai điểm chung) khi $d<R$.
- Đường thẳng $a$ và $(O;R)$ tiếp xúc nhau (có duy nhất một điểm chung $H$) khi $d=R$. Điểm chung gọi là tiếp điểm, đường thẳng $a$ gọi là tiếp tuyến của $(O)$ tại $H$.
- Đường thẳng $a$ và $(O;R)$ không giao nhau (không có điểm chung) khi $d>R$.

##ĐL Tính chất của tiếp tuyến
Nếu một đường thẳng là tiếp tuyến của đường tròn thì nó vuông góc với bán kính đi qua tiếp điểm.

##ĐL Dấu hiệu nhận biết tiếp tuyến
Nếu một đường thẳng đi qua một điểm nằm trên đường tròn và vuông góc với bán kính đi qua điểm đó thì đường thẳng ấy là một tiếp tuyến của đường tròn.`,

  HH00109: `##ĐL Hai tiếp tuyến cắt nhau của một đường tròn
Nếu hai tiếp tuyến của đường tròn $(O)$ tại $A$ và $B$ cắt nhau tại điểm $P$ thì:
- Điểm $P$ cách đều hai tiếp điểm: $PA=PB$;
- $PO$ là tia phân giác của góc tạo bởi hai tiếp tuyến: $\\widehat{APO}=\\widehat{BPO}$;
- $OP$ là tia phân giác của góc tạo bởi hai bán kính đi qua hai tiếp điểm: $\\widehat{AOP}=\\widehat{BOP}$.

##CY Nhắc lại
Tiếp tuyến vuông góc với bán kính tại tiếp điểm. Đường thẳng đi qua một điểm của đường tròn và vuông góc với bán kính tại điểm đó là tiếp tuyến.
Đường tròn tiếp xúc với ba cạnh của tam giác gọi là đường tròn nội tiếp tam giác; tâm của nó cách đều ba cạnh.`,

  HH00110: `##ĐN Hai đường tròn cắt nhau
Hai đường tròn có đúng hai điểm chung gọi là hai đường tròn cắt nhau; hai điểm chung gọi là hai giao điểm.
$(O;R)$ và $(O';R')$ với $R\\ge R'$ cắt nhau khi $R-R'<OO'<R+R'$.

##ĐN Hai đường tròn tiếp xúc nhau
Hai đường tròn có duy nhất một điểm chung gọi là hai đường tròn tiếp xúc nhau; điểm chung gọi là tiếp điểm.
Tiếp xúc ngoài khi $OO'=R+R'$; tiếp xúc trong khi $OO'=R-R'>0$.
Nếu hai đường tròn tiếp xúc nhau thì tiếp điểm nằm trên đường nối tâm (thẳng hàng với hai tâm).

##ĐN Hai đường tròn không giao nhau
Hai đường tròn không có điểm chung gọi là hai đường tròn không giao nhau.
Ở ngoài nhau khi $OO'>R+R'$; đường tròn $(O)$ đựng đường tròn $(O')$ khi $OO'<R-R'$. Khi $O$ trùng $O'$ và $R\\ne R'$ ta có hai đường tròn đồng tâm.

##TC Bảng tổng kết ($R\\ge R'$)
Cắt nhau: 2 điểm chung, $R-R'<OO'<R+R'$.
Tiếp xúc ngoài: 1 điểm chung, $OO'=R+R'$.
Tiếp xúc trong: 1 điểm chung, $OO'=R-R'>0$.
Ở ngoài nhau: 0 điểm chung, $OO'>R+R'$.
$(O)$ đựng $(O')$: 0 điểm chung, $OO'<R-R'$.

##ĐN Tiếp tuyến chung
Đường thẳng tiếp xúc với cả hai đường tròn gọi là tiếp tuyến chung của hai đường tròn đó.`,
}

// bài "mô hình": ô lý thuyết = cấu hình chung của bài (1–2 câu + ảnh) ⇒ ##TC Cấu hình của bài
const CAU_HINH = ['HH00020', 'HH00021', 'HH00022', 'HH00023', 'HH00024', 'HH00025', 'HH00026', 'HH00027', 'HH00028',
  'HH00058', 'HH00059', 'HH00060', 'HH00061', 'HH00062', 'HH00063', 'HH00064', 'HH00065', 'HH00084', 'HH00086']
const BO_QUA = ['HH00066', 'HH00085'] // bài thử

const GHI = process.argv.includes('--ghi')
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const cu = (await c.query(`select ma_bai, noi_dung, file_url, cap_nhat_at from hinh_hoc_bai_ly_thuyet
  where btrim(noi_dung) <> '' and noi_dung !~ '##(ĐN|ĐL|TC|CY|PP)' order by ma_bai`)).rows
const ds = cu.map((x) => x.ma_bai)
const thieu = ds.filter((m) => !MOI[m] && !CAU_HINH.includes(m) && !BO_QUA.includes(m))
if (thieu.length) throw new Error('Chưa xử lý: ' + thieu.join(', '))

for (const m of CAU_HINH) {
  const x = cu.find((y) => y.ma_bai === m); if (!x) throw new Error('không thấy ' + m)
  const doan = x.noi_dung.replace(/\r\n/g, '\n').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
  const anh = doan.filter((d) => /^!\[/.test(d)), chu = doan.filter((d) => !/^!\[/.test(d)).join('\n').replace(/\.; /g, '.\n').replace(/;\s+(?=[A-ZĐ])/g, '\n')
  MOI[m] = [`##TC Cấu hình của bài\n${chu}`, ...anh].join('\n\n')
}

// kiểm khuôn + chữ không mất
const tu = (s) => new Set(s.replace(/##(ĐN|ĐL|TC|CY|PP|NX)[^\n]*/g, ' ').replace(/\*\*|[-–]|\d+\.|[a-e]\)/g, ' ').toLowerCase().match(/[\p{L}\p{N}\\{}^_$]+/gu) ?? [])
let loi = 0
for (const [m, s] of Object.entries(MOI)) {
  for (const d of s.split(/\n[ \t]*\n/)) {
    const dau = d.trim().split('\n')[0]
    if (!/^##(ĐN|ĐL|TC|CY|PP|NX)\b/.test(dau) && !/^!\[/.test(dau)) { loi++; console.log(`✘ ${m}: đoạn không thẻ: ${dau.slice(0, 60)}`) }
  }
  const x = cu.find((y) => y.ma_bai === m)
  const moi = tu(s), mat = [...tu(x.noi_dung)].filter((w) => !moi.has(w))
  console.log(`${m}: ${x.noi_dung.length} → ${s.length} kí tự${mat.length ? ' · chữ cũ không còn: ' + mat.join(' ') : ''}`)
}
if (loi) { await c.end(); process.exit(1) }
const sao = new URL('./lt-cu-con-lai-05-11.json', import.meta.url)
if (GHI && !fs.existsSync(sao)) fs.writeFileSync(sao, JSON.stringify(cu, null, 1))
await c.query('begin')
try {
  let n = 0
  for (const [m, s] of Object.entries(MOI)) n += (await c.query(`update hinh_hoc_bai_ly_thuyet set noi_dung = $2, cap_nhat_at = now() where ma_bai = $1`, [m, s])).rowCount
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? `ĐÃ GHI ${n} bài (bản cũ: lt-cu-con-lai-05-11.json)` : `CHẠY THỬ ${n} bài — rollback`)
} catch (e) { await c.query('rollback'); throw e } finally { await c.end() }
