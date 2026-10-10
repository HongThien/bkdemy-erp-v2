# GKI-24 — Pha 1: giải mù (trạm soát, chưa mở bản soạn)

Đề: THCS Phú Lâm, xã Tiên Du — giữa học kì 1 Toán 8, 2025-2026. 20 câu trắc nghiệm + 4 câu tự luận (Câu 1 có 2 bài toán con). Đề không in đáp án.
Đề có lớp chữ, ảnh rõ; đã phóng to 300 dpi mọi câu có số mũ, 900 dpi hai kí hiệu góc của hình Câu 12.
Bộ sách: có Pythagore (Câu 2, Câu 4 trắc nghiệm), hằng đẳng thức bậc ba, trung tuyến ứng cạnh huyền, thoi, vuông ⇒ CTST / Cánh Diều.
Máy kiểm: `<LV>\tam\soat_kiem.mjs` (viết trước khi mở bản soạn) — tất cả khớp.

## Trắc nghiệm

| Nhãn | Đáp án / hướng (1 dòng) | Ghi chú về đề |
|---|---|---|
| Câu 1 | **B** — $\dfrac{xy}{\sqrt5}$ là số nhân biến; A có căn của biến, C có biến ở mẫu, D là tổng | |
| Câu 2 | **B** — Pythagore: $d^2=a^2+a^2=2a^2\Rightarrow d=a\sqrt2$ | |
| Câu 3 | **C** — thu gọn còn $-xy+\dfrac12$, bậc 2 | bẫy: $x^3$ triệt tiêu |
| Câu 4 | **D** — $3^2+4^2=5^2$ | |
| Câu 5 | **C** — $360^\circ-80^\circ-100^\circ-120^\circ=60^\circ$ | đề viết $D=80^\circ$ (không mũ góc) |
| Câu 6 | **D** — hệ số 1, bậc $1+2+1=4$ | |
| Câu 7 | **D** — hình bình hành có hai đường chéo vuông góc là hình thoi | |
| Câu 8 | **A** — trung tuyến $EK$ bằng nửa cạnh $DF$ ⇒ vuông tại $E$ | B "vuông cân tại $E$" không suy ra được |
| Câu 9 | **C** — 3 đa thức: $x^2+y^2$; $2025$; $\dfrac x2+xyz$ | |
| Câu 10 | **B** — $x^2y^2$ (A thừa $z^3$, C thừa $z^2$ ở hạng tử sau, D thừa $x^3$) | |
| Câu 11 | **B** — hình thang có hai cạnh bên bằng nhau chưa chắc cân (hình bình hành) | |
| Câu 12 | **B** — hình thoi: $\widehat{ABD}=\widehat{BDC}$ (so le trong) ⇒ $AB\parallel DC$, cùng $AB=DC$ ⇒ hình bình hành; $\widehat{ADB}=\widehat{ABD}$ ⇒ $\triangle ABD$ cân tại $A$ ⇒ $AB=AD$ ⇒ hình thoi | Hình có BA kí hiệu góc bằng nhau: một ở $B$ ($\widehat{ABD}$), HAI ở $D$ ($\widehat{ADB}$ và $\widehat{BDC}$, mỗi góc một gạch — đã phóng 900 dpi). Chỉ đọc một góc ở $D$ thì ra "hình bình hành" (D) — sai |
| Câu 13 | **B** — $x^2-4xy+4y^2$ | |
| Câu 14 | **D** — $(x+y)(x-y)=81\cdot25=2025$ | |
| Câu 15 | **Không có phát biểu nào sai.** A: dấu hiệu hình vuông (đúng). B, C: nhận xét SGK về hình thang (đúng). D: tứ giác có hai cặp cạnh song song — hai cạnh kề chung đỉnh nên không thể song song, hai cặp đó buộc là hai cặp cạnh đối ⇒ hình bình hành (đúng). Phương án người ra đề nhiều khả năng nhắm tới: **D** (thiếu chữ "đối" so với câu chữ SGK) | **Đề lỗi** — cần `Chưa chắc`, CEO quyết giữ D hay bỏ câu |
| Câu 16 | **C** — hai góc kề đáy $MN$ bằng nhau | đề viết $M=N$ (không mũ góc); B (hai cạnh bên bằng nhau) không đủ |
| Câu 17 | **A** — $x^3-8y^3=8-8=0$ | |
| Câu 18 | **A** — $3\cdot(2x)^2\cdot(-3y)=-36x^2y$ | |
| Câu 19 | **C** — $BC=2AM=10$ cm | |
| Câu 20 | **C** — $\left(x+\dfrac12\right)^2$ | |

## Tự luận

| Nhãn | Đáp số / hướng chứng minh | Ghi chú về đề |
|---|---|---|
| Câu 1.1 | $P=-(x+y)(x^2-xy+y^2)+x^3=-(x^3+y^3)+x^3=-y^3$ | hai bài toán khác hẳn nhau (rút gọn / tìm $x$) ⇒ hai câu |
| Câu 1.2 | $4x^2-14x-(25+20x+4x^2)=9\Rightarrow-34x=34\Rightarrow x=-1$ | |
| Câu 2 | a) $4a^2$ ($cm^2$). b) Đọc đúng câu chữ — "phần còn lại" của tấm bìa sau khi cắt: $4a^2=1600-4a^2\Rightarrow a^2=200\Rightarrow a=\sqrt{200}=10\sqrt2\approx14{,}1$ (cm), thoả $0<a<20$ | **Phân xử:** câu chữ chỉ cho một cách đọc hợp lệ (phần bìa còn lại $=40^2-4a^2$) ⇒ đáp số $a=\sqrt{200}$. Số không đẹp; nếu người ra đề nghĩ "phần còn lại" là **đáy thùng** $(40-2a)^2$ thì $4a^2=(40-2a)^2\Rightarrow a=10$ (số đẹp, đúng kiểu bài hằng đẳng thức) — nhưng đáy thùng không phải "phần còn lại" theo câu chữ. Giữ `Chưa chắc` cho CEO. Lớp 8 chưa học đưa thừa số ra ngoài dấu căn ⇒ viết $a=\sqrt{200}$, có thể kiểm $(10\sqrt2)^2=200$ |
| Câu 3 | a) $\widehat{DAE}=\widehat{ADH}=\widehat{AEH}=90^\circ$ ⇒ góc thứ tư $=360^\circ-270^\circ=90^\circ$ ⇒ bốn góc vuông ⇒ hình chữ nhật. b) $AM$ là trung tuyến ứng cạnh huyền ⇒ $AM=MB$ ⇒ $\triangle MAB$ cân tại $M$ ⇒ $\widehat{BAM}=\widehat{B}=90^\circ-37^\circ=53^\circ$. c) $O=AH\cap DE$: $OA=OD$ (đường chéo hình chữ nhật) ⇒ $\widehat{ODA}=\widehat{OAD}=\widehat{BAH}=90^\circ-\widehat B=\widehat C$; $\widehat{BAM}=\widehat B$; gọi $I=AM\cap DE$: $\widehat{ADI}+\widehat{DAI}=\widehat C+\widehat B=90^\circ$ ⇒ $\widehat{AID}=90^\circ$ | Kiểm toạ độ 3 bộ: $AM\perp DE$ ✔, $\widehat{BAM}=\widehat B$ ✔. Đề không cho hình ⇒ cần hình giải. Trường hợp $AB=AC$ thì $H\equiv M$, hình suy biến nhưng kết luận vẫn đúng; câu b cho $\widehat C=37^\circ$ nên $AB<AC$ |
| Câu 4 | Hai đoạn $x>y$ (cm), $x+y=200$, cạnh hai hình vuông $\dfrac x4,\dfrac y4$. $S=\dfrac{x^2-y^2}{16}=\dfrac{(x+y)(x-y)}{16}=\dfrac{25}{2}(x-y)$ lớn nhất khi $x-y$ lớn nhất ⇔ $y$ nhỏ nhất $=4$ ⇒ cắt 196 cm và 4 cm, $S_{\max}=49^2-1^2=2400$ ($cm^2$) | $y$ là độ dài một đoạn dây nên $y>0$, chia hết cho 4 ⇒ $y\ge4$. Vét cạn bằng máy ✔ |
