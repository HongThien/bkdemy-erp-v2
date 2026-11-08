KẾT LUẬN: ĐẠT

# NTL-GKI-2026 — phần 19 (Đề số 02, Tự luận Bài 2–6) — biên bản trạm SOÁT (Opus, 27/10)

- Số câu: **9** (2 trả lời ngắn: Bài 2a `8`, Bài 6a `24` · 7 tự luận; Đại 8 · Hình 1).
- Khớp Pha 1 (giải mù, `NTL-GKI-2026.p19.kiem.md`) ngay từ đầu: **9/9** đáp số / hướng chứng minh. Phân loại TLN / tự luận: 9/9 đúng.
- Số câu phải sửa: **2** — **0 câu sửa vì lỗi toán**; cả 2 chỉ sửa trình bày / ghi chú (Bài 5 trình bày Hình, Bài 4 bổ sung ghi chú đề sai). Bản trước khi sửa: `NTL-GKI-2026.p19.soan.goc.md`.
- Máy kiểm: `<LV>/tam/kiem_soat_p19.mjs` (đồng nhất thức 3a, 3b, 4 cả hai bản, nghiệm 2a–2c, lưới số 6a, mô phỏng 2023 bước 6b) · `<LV>/tam/kiem_soat_p19_hinh.mjs` (Bài 5 trên 2 hình bình hành toạ độ: $G$, $K$ trùng trọng tâm; $O$ là trung điểm $GK$ và $MN$).
- Hình giải `giai_de2_bai5.png`: mở xem — đúng dữ kiện, đủ điểm $A,B,C,D,M,N,O,G,K$, gạch trung điểm là giả thiết, không đánh dấu điều phải chứng minh, nhãn không đè, đủ lề. Không sửa.
- Kiến thức: không dùng đường trung bình / Thalès / đồng dạng / Pythagore / phân thức / "phương trình". Bài 2c tách hạng tử (NTL được dùng). Bài 5 chỉ hình bình hành + trọng tâm lớp 7 (đúng phạm vi NTL: hình thang, thang cân, hình bình hành).
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: **✔ đạt cổng** (9 câu, 2 TLN, 7 tự luận, hình 2, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 2 Bài 5 | định dạng — trình bày Hình (**chỉ trình bày, không đổi toán**) | Phần 2: **bỏ mọi dòng trống giữa các bước** (đính chính CEO 27/10: giãn dòng là việc hiển thị của app), chỉ giữ dòng trống trước `b)`, `c)` và trước `**Phần 2. Trình bày**`; tách dòng dài (> ~60 kí tự) thành dòng ngắn: "(tính chất cạnh đối…)", "cắt nhau tại trung điểm mỗi đường (tính chất…)", "Do đó $G$ là trọng tâm… (tính chất ba đường trung tuyến)", "$G$ nằm trên đoạn $DO$ và $OG=\dfrac13 OD$", câu kết ý c; thêm chú thích còn thiếu: (định nghĩa hình bình hành) cho $AB\parallel CD$, (tính chất hình bình hành) cho $AB=CD$, (định nghĩa trung điểm) cho $AN=\dfrac12AB$, $CM=\dfrac12CD$, (định nghĩa đường trung tuyến) cho 4 trung tuyến; ý c thêm "Vì … (gt)" mở câu. Phần 1: các bước viết dòng ngắn nối bằng xuống dòng đơn (mỗi `**Bước k.**` vẫn là một đoạn riêng — khuôn card 3–6 bước của cổng `kiem-p1-card` cần dòng trống giữa các bước) | LUẬT TRÌNH BÀY HÌNH 7·8·9 rule 1 (dòng ngắn) + rule 3 (mọi kiến thức có chú thích) + đính chính rule 2 |
| Đề 2 Bài 4 | ghi chú đề sai (**chỉ ghi chú / dòng Lưu ý, không đổi đáp số**) | Ghi chú "Đề sai": thêm kết quả phóng to + lí lẽ hình đáng tin hơn + câu hỏi cho người duyệt. Dòng "Lưu ý" đầu Phần 2: thêm đáp số theo hình ($100x^2-25y^2-120x+36$; $6831\ \text{m}^2$) để học sinh nhìn theo hình vẫn đối chiếu được | Đề mâu thuẫn lời–hình; xem mục dưới |

## Đề 2 Bài 4 — lời đề vs hình (CẦN NGƯỜI DUYỆT CHỌN)

- Phóng to 260 dpi (`<LV>/z/soat_p19_b4de-11.png`, `soat_p19_b4hinh-12.png`): lời đề in **rõ** "chiều dài $15x+5y$ (m)"; hình (đầu trang 12) in **rõ** "$10x+5y$ (m)"; chiều rộng $10x-5y$ khớp hai nơi. Không phải lỗi đọc ảnh.
- Hai đáp số (máy kiểm cả hai): theo lời đề $S=150x^2-25xy-25y^2-150x+36$, b) $144\cdot 69=9936\ \text{m}^2$ (bản soạn đang giữ) · theo hình $S=100x^2-25y^2-120x+36$, b) $99\cdot 69=6831\ \text{m}^2$.
- **Nhận định của trạm soát: HÌNH đáng tin hơn.** Với $x=9$, $y=3$: theo hình sân dài $105$ m × rộng $75$ m — $105$ m đúng chiều dài sân bóng tiêu chuẩn ($105\times 68$); theo lời đề sân dài $150$ m, vượt mức tối đa $120$ m của luật bóng đá ⇒ lời đề nhiều khả năng in nhầm $15x$ thay $10x$. Phụ lục 24/10 ("lệch ảnh thì ảnh đúng / giải theo số liệu hình") nghiêng về hình; nhưng người gõ đề và trạm soạn đều chọn lời đề và hai cách đều nhất quán, nên trạm soát **KHÔNG tự đổi đáp số** — giữ 9936, cả hai đáp số đã ghi ở Ghi chú và dòng Lưu ý. Nếu người duyệt chọn hình: thay $15x+5y$ → $10x+5y$ trong Phần 2, đáp số ý a $100x^2-25y^2-120x+36$, ý b $6831\ \text{m}^2$, sửa câu Lưu ý / Chú ý.

## Câu còn `Chưa chắc`

Không có. ("Đề sai" Bài 4 ghi theo luật 24/10 ở Ghi chú + dòng Lưu ý, không treo Chưa chắc; chỉ còn việc người duyệt chọn bản lời / bản hình như trên.)

## Ghi nhận khác (không sửa)

- Bài 6b: đề giữ nguyên tiếng Anh, lời giải tiếng Việt — đúng luật; chỉ ra đủ cả hai cốc 2 và 4 đạt được (cặp lượt đi–về).
- Bài 6a: có kiểm dấu "=" xảy ra ($(2;-2)$, $(-2;2)$) — đủ.
- Bài 3a: phóng to xác nhận "$(a^2+b)$" và "$+3b^5$" đúng ảnh.
