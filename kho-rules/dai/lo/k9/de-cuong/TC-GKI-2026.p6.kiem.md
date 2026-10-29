# TC-GKI-2026 · P6 (PHẦN 3 = C. Nâng cao, Bài 1–4) — trạm SOÁT giải MÙ (Pha 1)

Nguồn: `<LV>\trang\p-4.png` + phóng to 260 dpi `z\p6_C12.png`, `z\p6_C34.png`. Script kiểm: `<LV>\tam\soat_p6.mjs`.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| C Bài 1 | $y(x-2)=-x^2+x+5$; $x=2$ không thoả ($0=3$) ⇒ $y=-(x+1)+\dfrac{3}{x-2}$ ⇒ $x-2\in\{\pm1;\pm3\}$ ⇒ $(x;y)\in\{(3;-1),(1;-5),(5;-5),(-1;-1)\}$ — tự luận (4 cặp). Máy quét $x\in[-2000;2000]$: đúng 4 cặp. | Đề rõ, không lỗi. |
| C Bài 2 | ĐKXĐ $x\ne0;-1;-2;-3;-4;-5;-6;-7$. Tách $\dfrac{x+1}{x(x+2)}=\dfrac12\big(\dfrac1x+\dfrac1{x+2}\big)$ (tương tự 3 phân thức kia) ⇒ ghép cặp ra nhân tử $2x+7$; đặt $t=x^2+7x$, phần còn lại ⇒ $t^2+18t+90=(t+9)^2+9>0$ vô nghiệm ⇒ nghiệm duy nhất $x=-\dfrac72=-3{,}5$ (thoả ĐKXĐ) — `tra_loi_ngan` $-3{,}5$ hợp lệ (4 kí tự). Máy: đổi dấu duy nhất tại $-3{,}5$ trên $[-60;60]$. | Đề rõ. Mẫu đều phân tích được: $(x+5)(x+7)$, $(x+1)(x+3)$, $(x+4)(x+6)$. |
| C Bài 3 | Rộng $x$ (m), dài $30-x$, $0<x<30$ (rộng ≤ dài ⇒ $0<x\le15$); $S=x(30-x)=225-(x-15)^2\le225$, dấu "=" khi $x=15$ ⇒ $x=15$ (diện tích lớn nhất $225\ \text{m}^2$, lúc đó là hình vuông). Đề hỏi chỉ $x$ ⇒ `tra_loi_ngan` $15$ hợp lệ. | Đề rõ. Lúc $x=15$ chiều rộng = chiều dài (hình vuông — vẫn là hình chữ nhật). |
| C Bài 4 | $AE=x$, $AF=y$; $EH\parallel AC$ ⇒ $\triangle BEH\backsim\triangle BAC$ ⇒ $\dfrac{60-x}{60}=\dfrac{y}{40}$ ⇒ $y=40-\dfrac{2x}{3}$; $S=xy=600-\dfrac23(x-30)^2\le600$ ⇒ $x=30$, $y=20$: vườn $30\ \text{m}\times20\ \text{m}$ ($AE=30$ m trên cạnh $60$ m, $AF=20$ m trên cạnh $40$ m), diện tích lớn nhất $600\ \text{m}^2$ — tự luận. | Hình đề vẽ không đúng tỉ lệ ($60$ m và $40$ m vẽ dài gần bằng nhau) nhưng đủ điểm, đúng quan hệ — chỉ là hình minh hoạ, không đổi đáp số. |
