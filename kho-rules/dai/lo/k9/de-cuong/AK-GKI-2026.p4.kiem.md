# AK-GKI-2026 — PHẦN 4 (ĐỀ 4) — trạm SOÁT, Pha 1: giải MÙ

Nguồn: `trang/p-3.png` nửa dưới (Đề 4 Câu 1–5a) + `trang/p-4.png` đầu (Câu 5b, 6). Kiểm bằng máy: `<LV>\tam\soat_p4.mjs` (thay nghiệm, quét lưới, thử hai phía biên, toạ độ số, 200 000 bộ ngẫu nhiên cho Bài 6).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1a | $(x-5)(2x+4)=0$ ⇒ $x=5$ hoặc $x=-2$ (quét lưới không sót) · `tu_luan` | Không |
| Bài 1b | ĐKXĐ $x\ne0$, $x\ne3$; khử mẫu $x(x-3)$: $x(x+3)-(x-3)=3$ ⇒ $x^2+2x=0$ ⇒ $x=0$ (loại), $x=-2$ (nhận) ⇒ `tra_loi_ngan`, `-2` | Không |
| Bài 2a | Thế $y=2x-5$ ⇒ $7x=14$ ⇒ $(x;y)=(2;-1)$ · `tu_luan` | Không |
| Bài 2b | $x-6\le3x+12$ ⇒ $-2x\le18$ ⇒ chia $-2<0$ đổi chiều ⇒ $x\ge-9$ (thử $-9{,}01$ sai, $-9$ đúng) · `tu_luan` | Đề in "$3.(x+4)$" — dấu chấm là dấu nhân |
| Bài 3 | Số HS dự thi A: $x$, B: $y$; $x+y=250$, $0{,}8x+0{,}9y=210$ ⇒ A $150$, B $100$ học sinh · `tu_luan` | Không |
| Bài 4 | $AH=AB\sin40^\circ\approx2{,}57$ cm; $BH=AB\cos40^\circ\approx3{,}06$ cm; $HC=BC-BH\approx1{,}44$; $AC=\sqrt{AH^2+HC^2}\approx2{,}94$ cm; $\tan C=\dfrac{AH}{HC}\approx1{,}7907$ ⇒ $\widehat{C}\approx60^\circ49'$ · `tu_luan` | $\widehat B=40^\circ$ nhọn, $BH\approx3{,}06<BC$ ⇒ $H$ nằm giữa $B$, $C$. Tính từ số đã tròn ($2{,}57$; $1{,}44$) ra $AC\approx2{,}95$ — phải giữ giá trị đúng |
| Bài 5 | a) độ sâu $=250\sin21^\circ\approx89{,}59\approx90$ m; b) quãng $=\dfrac{200}{\sin21^\circ}\approx558{,}09$ m $\approx0{,}558$ km, thời gian $\approx0{,}0620$ h $\approx3{,}72$ phút $\approx4$ phút · `tu_luan` | Trùng nguyên văn Đề 3 Câu 5. Hình đề là hình minh hoạ |
| Bài 6 | $\dfrac{a^3}{a^2+b^2}=a-\dfrac{ab^2}{a^2+b^2}\ge a-\dfrac b2$ (vì $a^2+b^2\ge2ab$) ⇒ $P\ge(a+b+c)-\dfrac{a+b+c}2=\dfrac32$; dấu "=" khi $a=b=c=1$ ⇒ min $P=\dfrac32$ · `tra_loi_ngan`, `1,5` | Không (máy: min ngẫu nhiên $1{,}500000$ tại $(1;1;1)$, bước tách đúng ở mọi bộ) |
