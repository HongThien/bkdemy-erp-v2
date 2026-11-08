# Đối chiếu đề — TX-GKI-2026 (THCS Thanh Xuân, Toán 8 GKI 2026–2027) — 24/10

Trạm đối chiếu (Opus). Nguồn: `<LV>\anh\t-1..4.png` (130 dpi) + phóng 260 dpi `<LV>\z\dc-*.png` (Phần đơn thức Bài 1–5, Bài 7–8, HĐT Bài 3, Tìm x Bài 1–3, Nâng cao Bài 1–2). Không ghi DB, không commit.

- **Số câu:** trước 48 · sau 48 (không thêm/bớt ý). **Trạm:** 5 trước · 5 sau (p1 11 · p2 9 · p3 11 · p4 9 · p5 8) — không có tệp `.soan.md` thừa.
- **Nội dung đề (chữ, số, số mũ, dấu, ngoặc):** khớp ảnh ở cả 48 câu; không tìm thấy lỗi chép số / ký hiệu. Hình học: đề không có hình sẵn ⇒ không có `img/de_*`.
- Danh sách tự lập theo ảnh trước khi mở build: Phần ĐT-ĐT Bài 1(a,b) 2(a,b) 3(a,b) 4(a–d) 5(a–c) 6(a,b) 7(a,b,b) 8(a,b) · HĐT Bài 1(a–d) 2(a–c) 3(mục 1 a,b · mục 2 · mục 3 a,b) · Tìm x Bài 1(a–c) 2(a–c) 3(a–i) · Hình Bài 1–5 · Nâng cao Bài 1(a,b) 2(a–c) 3 4 5 — khớp build.

## Bảng lỗi / sửa

| Câu | Lỗi | Sửa gì |
|---|---|---|
| Dạng 2 Bài 3 (mục 1, 2, 3a, 3b) | nhãn — người gõ đặt "Dạng 2 Bài 3a / Bài 4 / Bài 5a / Bài 5b": "Bài 4", "Bài 5" không có trong đề; "3a" lại chứa cả ý a, b | Đổi thành "Dạng 2 Bài 3.1 / 3.2 / 3.3a / 3.3b" (tiền lệ "Bài 4.1a" NQ-K6, "ĐMH Bài 2.2" GV2-K6); sửa ghi chú tương ứng. Lưu ý: `nhom-bai.mjs` (RE_Y) không gom "3.3a/3.3b" thành nhóm — hai câu hiện riêng với lời dẫn "Thu gọn:", chấp nhận được |
| Dạng 1 Bài 7 | ghi chú — đề in hai ý "b)"; người gõ đổi ý 2 thành "c)" + CHƯA CHẮC | Giữ "c)", hạ thành ghi chú thường (lỗi in nhãn hiển nhiên, không ảnh hưởng bài toán; đã kiểm $M=\tfrac32x^2y^4+1>0$ khớp ý c) |
| Dạng 1 Bài 8 | ghi chú — CHƯA CHẮC vì gọi "đa thức" có $\lvert y-3\rvert$, và "lớn nhất (hoặc nhỏ nhất)" | Hạ thành ghi chú: đề sai thuật ngữ, giải bình thường; biểu thức không bị chặn trên ⇒ chỉ có GTNN, lời giải nói rõ (quy ước Thùy 24/10) |
| Dạng 3 Bài 3a, c, d, f, i | ghi chú — khôi phục ngoặc đúng; CHƯA CHẮC thừa | Ảnh 260 dpi: ngoặc mất do font, chỗ ngoặc để khoảng trắng, vị trí rõ. Nhân chứng thứ hai: phương trình khôi phục phân tích gọn — a $(x+3)(x-2)$ · c $(x-2)(5x-3)$ · d $(x^2-9)(x^3+8)$ · f $[(x-2)-(x+1)]^2=9$ ⇒ $x=-2$ · i $(t-2)(t-12)$, $t=x^2+x$. Hạ thành ghi chú thường |
| Dạng 3 Bài 3b | — (giữ CHƯA CHẮC, viết rõ lí do) | Khôi phục $\tfrac54(2x+1)^2+2(x^2-4)-5(x-2)=0$ theo khoảng trắng là cách đọc duy nhất hợp lí, nhưng rút gọn ra $7x^2+\tfrac{13}{4}=0$ (vô nghiệm) — nghi bản gốc khác |
| Dạng 3 Bài 3e, g, h | không mất ngoặc | — (khớp) |
| Dạng 3 Bài 2b | ghi chú | Ảnh 260 dpi xác nhận in đúng $(12x-5)(4x-1)-(3x-1)(16x-1)=81$; nghiệm không nguyên ($-77/13$). Thêm ghi chú "đã kiểm, giữ như in" |
| Dạng 2 Bài 3.3b | ghi chú | Ảnh 260 dpi: dấu trước phân số là "+" (kết quả $5^{128}-3^{128}$, không phải 0) — thêm ghi chú đã kiểm |
| Khác Bài 2c | ghi chú — CHƯA CHẮC vì có $z$ mà lệnh "Tìm x, y" | Hạ thành ghi chú: đề in thiếu, giải tìm cả $x,y,z$ ($(x-y)^2+(y-2z)^2+(z-1)^2=0$ khớp đúng) |
| Dạng 1 Bài 5a–c | — | Số mũ khớp ảnh 260 dpi: $y^{7-n}$, $x^ny^3$; $3x^{n-1}y^{n+1}$ (in không ngoặc); $2x^{n-1}y^7+6x^{n+1}y^8$, $\tfrac12x^3y^n$. Cả ba có $n$ thoả (5a $0\le n\le4$, 5b $1\le n\le2$, 5c $4\le n\le7$) |
| Dạng 1 Bài 4a–d | — | Dấu chấm giữa đơn thức/ngoặc và $N$ = nhân, đã `\cdot` + ghi chú: đúng |
| Tách ý Dạng 1 Bài 1–2 · Dạng 2 Bài 1–2 | — | Giữ cả bài: đúng (ý sau dùng kết quả ý trước / chung biểu thức) |
| Tách ý Dạng 3 Bài 1–2 | — | Tách từng phương trình: đúng (dữ kiện độc lập) |

Kiểm nhanh khả giải (node/tay): Dạng 1 Bài 3a = 76, 3b = 2 · Bài 6 $Q=5n+5$ · Dạng 2 Bài 1 $B=2$, $x=\tfrac13$ · Dạng 3 Bài 1: $-\tfrac{10}{3}$, $5$, $4$ · Bài 2a $-2$, 2c $-11$ · Hình 1c ($D$ trọng tâm $\triangle AHC$ ⇒ $AK=3AD$) · Nâng cao 1a min > 0 (≈1,61), 1b $=1+\dots$, 2a $(3;\tfrac32)$, 2b $(2;1)$, 3 min 8, 4 min $-27$, 5 min 1 — đều giải được.

## CHƯA CHẮC cuối cùng

- **Dạng 3 Bài 3b** — bản in mất ngoặc; khôi phục $\tfrac54(2x+1)^2+2(x^2-4)-5(x-2)=0$ ⇒ $7x^2+\tfrac{13}{4}=0$ vô nghiệm; nghi đề gốc in khác (hệ số/dấu). Nếu giữ: lời giải kết luận vô nghiệm và ghi rõ.

## Nghi mà không quyết

- Dạng 3 Bài 3b như trên — không có nhân chứng để chọn bản "đúng" khác, nên giữ cách đọc theo khoảng trắng.
- Dạng 3 Bài 2b: có thể bản gốc phổ biến là $(12x-5)(4x-1)+(3x-7)(1-16x)=81$ ($x=1$), nhưng ảnh in rõ như đã gõ ⇒ giữ như in, không treo cờ.
- Nhãn "Dạng 2 Bài 3.3a/3.3b" không được `nhom-bai.mjs` gom nhóm (regex chỉ nhận `Bài \d+` + một chữ) — nếu muốn hiện thành một nhóm "Bài 3.3" trên ERP thì cần nới RE_Y (việc ngoài trạm này).
