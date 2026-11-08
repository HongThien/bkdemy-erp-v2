KẾT LUẬN: ĐẠT

# NTL-NC-2026 · trạm 21 (Đề tham khảo số 1 — Tự luận Bài 2–5) — biên bản soát (Opus, 24/10)

- Số câu: **7** (0 TN · 3 trả lời ngắn · 4 tự luận; 1 câu HGT có hình đề).
- Khớp Pha 1 (`NTL-NC-2026.p21.kiem.md`) ngay từ đầu: **7/7** đáp án / kết luận.
- Phải sửa: **4 câu** (không câu nào sai đáp số; 2 lập luận, 1 hình/lập luận, 1 định dạng). Đề chép đúng ảnh cả 7 câu (Bài 2c phóng to 400 dpi: đúng kí hiệu ⋮).
- Bản gốc: `NTL-NC-2026.p21.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

## Hai điểm được dặn kiểm riêng

- **TK1 Bài 4 — "đoạn dịch chuyển":** mở `de_tk1-bai4.png` — E trên AB, F và G trên DC, $FG=50$ m, đường $EBGF$ có $EF\parallel BG$. Dịch EF về phía AD giữ song song ⇒ E trượt trên AB, F trượt trên DC, đáy tăng đúng bằng đoạn trượt: $9000:120=75$, $75-50=25$ m. Khoảng cách **vuông góc** giữa EF cũ và mới **không tính được** (đề không cho AE hay DF nên không biết độ nghiêng) ⇒ cách hiểu "trượt dọc cạnh" là cách duy nhất cho đáp số, đồng ý với trạm soạn. Hình không đúng tỉ lệ (đo pixel $EB\approx 56$, $FG\approx 66$) — không ảnh hưởng vì lời giải dùng số đề cho. Không cần `Chưa chắc`.
- **TK1 Bài 3 — 10 chiếc/lần:** giải mù ra cùng kết quả: a) chỉ cách hiểu "mỗi lần nướng dùng cả hai khay" mới ra một đáp số ($11.10.6000=660000$ đồng) — đồng ý. b) Bản soạn chứng minh bằng $10.n$, chỉ đúng với cách hiểu đó; đã đổi sang $4.a+6.b$ (chia hết của tổng cho 2) — đúng với MỌI cách hiểu, kết luận vẫn "đếm sai".

## Bảng sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| TK1 Bài 2a | định dạng | Dòng lẻ "Thử lại: …" sau chuỗi bước ⇒ `**Chú ý:** tìm xong nên thử lại …` | Phần 1 chỉ có Mấu chốt / Bước k / Chú ý; dòng trần không thuộc card nào. |
| TK1 Bài 3 | lập luận | Ý b: thay "số bánh $=10.n$" bằng "số bánh $=4.a+6.b$; $4.a\vdots 2$, $6.b\vdots 2$ ⇒ tổng $\vdots 2$; $123\not\vdots 2$" + viết lại Mấu chốt, Bước 3–4, Chú ý cho khớp | Đề ý b ("mỗi lần nướng, mỗi khay đều xếp đủ") đọc được cả kiểu một lần dùng nhiều khay / không đủ cặp; lập luận $10.n$ gãy ở cách hiểu đó, lập luận chia hết của tổng (NNB00905) đúng mọi cách hiểu. Đáp số không đổi. |
| TK1 Bài 4 | hình / lập luận | Thêm câu "Khi dịch $EF$ về phía $AD$ ($E$ trượt trên $AB$, $F$ trượt trên $DC$), đáy $FG$ dài thêm đúng bằng đoạn dịch chuyển" trước phép $75-50$ | Bản soạn nhảy từ "đáy mới 75" sang "dịch 25" không nói đoạn dịch chuyển đo ở đâu, vì sao bằng hiệu hai đáy. |
| TK1 Bài 5.1 | lập luận | Thay dòng "$2S-S=2024.2^{2025}-2.2^2-(\dots)$" bằng 3 dòng: viết $S=2S-S=(\dots)-(\dots)$ → gom từng cặp cùng luỹ thừa $[(3-2).2^3+(4-3).2^4+\dots]$ → $S=2024.2^{2025}-2.2^2-(2^3+\dots+2^{2024})$ | Bước gom cặp bị nhảy — HS lớp 6 không thấy vì sao còn lại tổng các luỹ thừa; khuôn NNB00902 ghi rõ `$2A-A=(\dots)-(\dots)$`. Kết quả $S=2023.2^{2025}$ kiểm bằng BigInt đúng. |

Các câu không sửa: 2b, 2c, 5.2 — đề, đáp số, lời giải, phân loại, khuôn đều đúng. Các dòng `Ghi chú` của người gõ đề (2c kí hiệu ⋮; Bài 4 Đọc hình + ý b gồm 2 yêu cầu — đã đối chiếu hình, khớp; 5.2 đề tiếng Anh / chọn 1 trong 2) giữ nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
