# GKI-18 — Pha 1: giải MÙ (trạm soát, chưa mở bản soạn)

Đề: THCS Nguyễn Du (phường Hoàn Kiếm), giữa học kì 1 Toán 8, 2025–2026, kiểm tra 07/11/2025 · 1 trang · 6 bài tự luận (Bài 5 gồm hai bài toán hình 1. và 2.). Đề không có bảng đáp án.
Đề đọc từ `trang/p-1.png` (có lớp chữ, `lop-chu.txt` khớp) + ảnh cắt 300 dpi hình Bài 5.1 (`tam/soat_hinh51.png`). Số kiểm bằng `tam/soat-kiem.mjs` (thay số ngẫu nhiên / dựng toạ độ 3 bộ, tất cả ok).

| Nhãn | Đáp án / đáp số / hướng chứng minh | Ghi chú về đề |
|---|---|---|
| Bài 1a | $97^2-9=97^2-3^2=(97-3)(97+3)=94\cdot 100=9400$ | "Tính nhanh" ⇒ hiệu hai bình phương |
| Bài 1b | $28^2+72^2+28\cdot 144=28^2+2\cdot 28\cdot 72+72^2=(28+72)^2=100^2=10000$ | Đề in "28.144" (dấu chấm = dấu nhân); $144=2\cdot 72$ |
| Bài 2a | $A=2x^2-2xy+2xy+2y^2-(x^2-y^2)=x^2+3y^2$ | |
| Bài 2b | $B=x^2-8x+16+x^2+4x+4-2x^2+2x=-2x+20$ | |
| Bài 2c | $C=16-x^2+x^2-2x+3=-2x+19$ | Phép chia cho $3x^2$ ngầm $x\ne 0$ — đề không nêu, không cần nêu |
| Bài 3a | $3x^2-3x-3x^2-18=0\Rightarrow -3x=18\Rightarrow x=-6$ | |
| Bài 3b | $4x^2+4x+1-4(x^2-2x+1)=17\Rightarrow 12x-3=17\Rightarrow x=\dfrac{5}{3}$ | |
| Bài 3c | $4(x+1)^2=16\Rightarrow (x+1)^2=4\Rightarrow x+1=2$ hoặc $x+1=-2\Rightarrow x=1$ hoặc $x=-3$ | Hai giá trị |
| Bài 4a | $15x+5y$ (nghìn đồng) | |
| Bài 4b | Mua hết $15\cdot 10+5\cdot 12=210$ (nghìn đồng); còn lại $300-210=90$ (nghìn đồng) | Ý b thay số vào biểu thức ý a ⇒ không tách |
| Bài 5.1 | $\widehat{C}=360^\circ-(105^\circ+90^\circ+86^\circ)=79^\circ$ (tổng các góc của tứ giác) | Hình: góc vuông tại $B$, $\widehat{A}=105^\circ$, $\widehat{D}=86^\circ$ (đọc ở ảnh 300 dpi) |
| Bài 5.2a | $\widehat{DAE}=\widehat{ADM}=\widehat{AEM}=90^\circ$ ⇒ góc thứ tư $\widehat{DME}=360^\circ-3\cdot 90^\circ=90^\circ$ ⇒ $ADME$ có bốn góc vuông ⇒ hình chữ nhật | Đề không cho hình |
| Bài 5.2b | $AD\parallel ME$ (cạnh đối hình chữ nhật), $F$ thuộc đường thẳng $ME$ ⇒ $AD\parallel EF$; $AF\parallel DE$ (gt) ⇒ $ADEF$ là hình bình hành (định nghĩa). Trung điểm: $DG=DM=AE$, $DG\parallel AE$ ⇒ $AEDG$ là hình bình hành ⇒ $AG\parallel DE$, $AG=DE$; mà $AF\parallel DE$, $AF=DE$ ⇒ $G, A, F$ thẳng hàng (tiên đề Euclid) và $AG=AF$ ⇒ $A$ là trung điểm $GF$ | Toạ độ: $F$ đối xứng với $M$ qua $E$, $G$ đối xứng với $M$ qua $D$; trung điểm $GF$ trùng $A$ (3 bộ số) |
| Bài 5.2c | $\widehat{DHE}=90^\circ$. $O$ là trung điểm $AM$ và $DE$, $AM=DE$ (đường chéo hình chữ nhật). $\triangle AHM$ vuông tại $H$, $HO$ là trung tuyến ứng cạnh huyền ⇒ $HO=\dfrac{1}{2}AM=\dfrac{1}{2}DE$ ⇒ $\triangle DHE$ có trung tuyến $HO$ bằng nửa cạnh $DE$ ⇒ vuông tại $H$ | Dùng trung tuyến ứng cạnh huyền + chiều đảo (thuộc bài Hình chữ nhật — đề có hỏi hình chữ nhật). Khi $M\equiv H$ thì $\triangle AHM$ suy biến, $\widehat{DHE}=\widehat{DME}=90^\circ$ vẫn đúng — đề không xét riêng |
| Bài 6 | $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=0\Rightarrow a=b=c=0\Rightarrow A=(-1)^{2023}+0^{2024}+1^{2025}=-1+0+1=0$ | $(a+b+c)^2$ không phải hằng đẳng thức trong SGK ⇒ lời giải phải nhân ra (hoặc nhóm $[(a+b)+c]^2$) |

Phạm vi đề chạm tới: Chương I (nhân, chia đa thức cho đơn thức) · Chương II hằng đẳng thức (bình phương của tổng / hiệu, hiệu hai bình phương) · Chương III tới hình chữ nhật (tổng góc tứ giác, hình bình hành, hình chữ nhật). Không có câu phân tích đa thức thành nhân tử. Bộ sách: KNTT.
