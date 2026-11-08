# Biên bản ĐỐI CHIẾU ĐỀ — NTH-GKI-2026 (THCS Ngọc Thụy, Toán 6 GKI 2026–2027) — 20/10

- Nguồn: `<LV>\anh\t-1..8.png` (130 dpi) + phóng to `z\p3*,p4*,p7*,p8a`, `z\dmh2d.png` (400 dpi) + toạ độ chữ `pdftotext -bbox` trang 7.
- Trang 1 = bìa + lịch kiểm tra (không đề). Đề thực trang 2–8.
- Danh sách tự lập trước khi mở build: Ví dụ 1 · Bài 1, 2(a,b), 3 · Ví dụ 2 (a,b) · Bài 4 a–d · Bài 5 a–d · Ví dụ 3 · Bài 6 a–c · Bài 7 a–c · Ví dụ 4 · Bài 8, 9, 10 · Bài 11 (= Ví dụ 5) · Bài 12 a–d · Bài 13–16 · ĐMH Bài 1 (a,b) · ĐMH 2 a–d · ĐMH 3 a–d · ĐMH 4 (1., 2.) · ĐMH 5 (1), 2), chọn 1 trong 2). Khớp build về số bài/ý.
- **Số câu: trước 47 → sau 44** (gộp Bài 12a–d thành một câu). Trạm: 5 trước, 5 sau (10 · 11 · 6 · 9 · 8). Không có tệp `.p<N>.soan.md` thừa.

## Đối chiếu từng câu

Mọi chữ, số, số mũ, dấu trừ, ngoặc, ký hiệu (∈ ∉ ℕ* ≤ □ …), dấu `.` (nhân) và `:` (chia) của 44 câu khớp ảnh, trừ các mục dưới.

| Câu | Lỗi | Sửa gì |
|---|---|---|
| Bài 12a–d | tách ý | Bài "Vẽ hình theo các yêu cầu sau" thuộc Chương IV (kho hgt). `k6.md` §1.5 (CEO 09/10): **chỉ tách bài Tính và Tìm $x$**; `brief-go-de.md` §3.3: bài hình giữ nguyên. ⇒ gộp lại thành **một câu `Bài 12`** chứa đủ a)–d) (nội dung giữ nguyên chữ). Thêm ghi chú thường: ý c), d) không cho góc ⇒ hình không duy nhất, lời giải vẽ một hình và nói góc tự chọn. |
| ĐMH Bài 2d | ghi chú (bỏ CHƯA CHẮC) | Ảnh hiện `20 − [30 − 5 − 1²]` vì pdftoppm thiếu phông Symbol ("No display font for 'Symbol'") ⇒ mất glyph ngoặc tròn. Đã giải thử cả hai cách hiểu: nguyên văn $20-[30-5-1^2]=20-24<0$ (ngoài $\mathbb{N}$, Chương I chỉ có số tự nhiên); có ngoặc $20-[30-(5-1)^2]=20-14=6$. Nhân chứng thứ hai độc lập = toạ độ chữ trong PDF: khoảng "30"→"5" rộng 17,1pt so với 12,6pt của " − " thường (thừa ≈ 1 dấu "("), số mũ 2 cách chữ "1" 3,3pt trong khi số mũ ở ĐMH 3d dính sát cơ số (chỗ trống = 1 dấu ")"). ⇒ giữ $20-[30-(5-1)^2]$, đổi cảnh báo thành ghi chú thường ghi rõ lí do. |
| Đầu tệp (comment) | ghi chú | Cập nhật dòng "Tách ý" và "Chỗ nghi" theo hai sửa trên. |

Các điểm đã soát, KHÔNG phải lỗi:
- Nhãn: "VD Bài 1", "VD Bài 2a/2b", "VD Bài 3", "VD Bài 4" (Ví dụ 1–4), "Bài 11" (= Ví dụ 5), "ĐMH Bài N", "ĐMH Bài 4.1/4.2", "ĐMH Bài 5.1/5.2" — duy nhất, đọc được số, hợp lý.
- Tách ý còn lại đúng luật: VD 2, Bài 4, 5 (Tính), Bài 6, 7, ĐMH 3 (Tìm $x$), ĐMH 2 (Tính) tách; Bài 2, VD 1, ĐMH 1 (tập hợp), Bài 11, 13–16 (hình), ĐMH 4, 5 (lời văn) giữ cả bài.
- Ví dụ in sẵn lời giải: chỉ gõ đề, có ghi chú LGM. Đã tính lại lời giải mẫu: VD 1 $M=\{8;9;10\}$, $5\notin M$, $10\in M$ ✓ · VD 2a $=10$ ✓, 2b $=47$ ✓ · VD 3 $x=15$ ✓ · VD 4 $2000<3000$ kg ✓ · **Bài 11 (Ví dụ 5)**: $4.15^2=900$ dm², $60^2=3600$, lát gạch $2700$ dm² $=27$ m²; hoa $9.65000=585000$, gạch $27.165000=4455000$, tổng $5040000$ đồng ✓ — "lỗi in: không thấy" đúng.
- Giải thử nhanh các bài Tính / Tìm $x$ / thực tế: đều ra số tự nhiên (Bài 5: 122 · 146 · 17 · 90; Bài 6: 44 · 2 · 252; Bài 7: 2 · 4 · 14; ĐMH 3: 25 · 6 · 6 · 6; Bài 8: 50000; Bài 9: 20 xe; ĐMH 4.2: 600 viên; ĐMH 5.2: 100 m, 20 m/giây) — không đề nào thiếu dữ kiện.
- Hình đề `de_bai11, 13, 14, 15, 16.png`: đủ khung, đúng bài, không dính chữ bài khác; dòng `Đọc hình:` khớp hình (6 m / 15 dm; 16 m × 10 m, hình thoi đỉnh ở trung điểm cạnh; 7 m × 4 m, cửa sổ 20dm; 30m, lối đi 3m cạnh phải + đáy; thang cân 15 m / 25 m / cao 10 m).
- Trạm: 10 · 11 · 6 · 9 · 8 câu (≤ 12).

## CHƯA CHẮC cuối cùng (3)

1. **Bài 15** — ý b) in "ở 1 một góc vườn rau" (thừa chữ "1"); gõ đúng như in, nghĩa không đổi (cửa ở MỘT góc).
2. **ĐMH Bài 3b** — in thừa dấu ":" sau "$=20$"; gõ đúng như in, không ảnh hưởng cách giải ($x=6$).
3. **ĐMH Bài 5.2** — bài chuyển động (kiến thức tiểu học, ngoài Chương I); đề không nói đơn vị vận tốc cần trả lời (m/giây hay km/giờ).

## Điều nghi, không tự quyết

- **ĐMH 3b / Bài 15b**: CEO có muốn bỏ hẳn dấu ":" thừa và chữ "1" thừa khỏi `noi_dung` trước khi lên app không (luật gõ hiện tại bắt giữ như in).
- **Mẫu `TC-GKI-2026.build.mjs` dòng 178** cũng tách bài "Vẽ hình" theo ý (kho hgt) — cùng lỗi tách ý như Bài 12 ở đây; ngoài phạm vi trạm này, báo để trạm đối chiếu TC xem.
