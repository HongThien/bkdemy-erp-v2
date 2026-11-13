# ⚠️⚠️ BẢN ÁP DỤNG BATCH B018 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 7 TẢI TỪ TOANMATH (3 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ đề GIỮA kì 1 Toán 7 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, cổng, bẫy đọc ảnh, cách giải / trình bày: GIỮ NGUYÊN.
Chỉ khác những điểm sau (đây là đề **CUỐI** kì 1 — phạm vi rộng hơn đề giữa kì):

- `<MA>` = `B018-NN` (01–03). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B018\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong `goc.pdf`), `hd` (trang HƯỚNG DẪN CHẤM, rỗng nếu file không có).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B018\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B018\<MA>.soan.md`; tệp kiểm (trạm soát): `…\B018\<MA>.kiem.md`.
- **Chỉ trang ĐỀ (`de`) là đề.** `goc.pdf` là nguyên file tải về: bỏ qua trang ma trận / đặc tả, hướng dẫn chấm, trang quảng cáo cuối ("Xem thêm …toanmath.com").
  B018-02 Đỗ Ngọc Du: trang 1–2 là MA TRẬN, trang 3–4 là ĐỀ, trang 5–7 hướng dẫn chấm, trang 8 quảng cáo.
- **⭐ Hướng dẫn chấm CHỈ để tham khảo. Mục tiêu vẫn là lời giải CHI TIẾT đầy đủ** (đúng khuôn 2 phần), không viết bản sơ lược, KHÔNG chép nguyên văn hướng dẫn chấm.
  Trạm soạn và trạm soát đều **tự giải trước**, chỉ SAU ĐÓ mới mở trang `hd` để đối chiếu. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; hướng dẫn chấm sai thì giữ đáp án đúng +
  `**Ghi chú:** hướng dẫn chấm ghi … , đúng là …`. Trả lời cuối của trạm nói rõ: có hướng dẫn chấm không, khớp bao nhiêu câu.
  **Chỉ B018-02 có hướng dẫn chấm.** B018-01 Phúc Diễn và B018-03 Nguyễn Trường Tộ **KHÔNG có** — tự giải toàn bộ, mọi đáp số thử lại bằng máy;
  chỗ nào chưa tự kiểm chứng được bằng máy ⇒ `**Chưa chắc:**`.
- **Tên đề (dòng `# ĐỀ |`):** `Đề kiểm tra cuối học kì 1 Toán 7 năm <năm học> — <don_vi> (<mã đề nếu có>)` — **"cuối học kì 1", KHÔNG phải "giữa học kì 1"** như khuôn bên dưới.
  `nam:` lấy từ `ds-de.json`. `bo_sach: KNTT` (3 đề đã được trạm chuẩn bị kiểm là KNTT tập 1). `thoi_gian_phut: 90`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Đề scan** (không có lớp chữ): B018-01 Phúc Diễn, B018-03 Nguyễn Trường Tộ. B018-02 có lớp chữ nhưng font hỏng (mất dấu, mất công thức) — **vẫn chép từ ảnh trang**.
  Chữ nhỏ / số mũ / chỉ số thì phóng 300–400 dpi từ `goc.pdf`, không đoán.
- **⭐ `kho` của khối 7 — ĐÈ mục 3.4 bên dưới:** câu Hình (góc, song song, tam giác) ghi **`kho=hinh_hoc`** (KHÔNG phải `hgt` — từ 12/10 hình K7 vào kho Hình học,
  dạng chờ `HH07000000`, `k7.md` §7 Q2; cổng khối 7 chỉ nhận `dai` | `hinh_hoc`). Câu Đại **và** câu thống kê / biểu đồ (Ch V) ⇒ `kho=dai` (như bộ CKI-7 ngày 14/10).
- **⭐ Lệnh cổng PHẢI thêm `--khoi 7`** (thiếu thì script chạy luật khối 6 và từ chối `hinh_hoc`) — đè mục 5 brief soạn và mục 8 brief soát:
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B018/<MA>.soan.md --lam-viec "<LV>" --khoi 7 --chi-kiem`
- **⭐ PHẠM VI KIẾN THỨC = CUỐI HỌC KÌ 1, KNTT Toán 7 TẬP 1 (Ch I–V)** — đè mọi chỗ "giữa kì" bên dưới (kể cả `k7.md` §1 luật 1 chỉ nói tới Ch II).
  Đúng phạm vi đã dùng cho bộ 14 đề CKI-7 ngày 14/10 (`lo/k7/CKI-*.soat.md`):
  - **Ch I Số hữu tỉ** và **Ch II Số thực** — như `k7.md` §1–§2 (whitelist Đại = lý thuyết bản đồ K7).
  - **Ch III Góc và đường thẳng song song** — góc kề bù, đối đỉnh, tia phân giác, so le trong / đồng vị / trong cùng phía, dấu hiệu & tính chất hai đường thẳng song song, tiên đề Euclid, định lí – GT/KL.
  - **Ch IV Tam giác bằng nhau** — tổng ba góc; c.c.c, c.g.c, g.c.g; các trường hợp bằng nhau của tam giác vuông (cạnh góc vuông, cạnh huyền – góc nhọn, cạnh huyền – cạnh góc vuông);
    tam giác cân / đều; đường trung trực của đoạn thẳng (điểm cách đều hai mút). Whitelist hình: `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md` (HH00001 · HH00020–28 · HH00096–104 · HH00112).
  - **Ch V Thu thập và biểu diễn dữ liệu** — phân loại dữ liệu (số liệu / không phải số liệu), bảng thống kê, biểu đồ hình quạt tròn, biểu đồ đoạn thẳng, đọc – phân tích số liệu.
  - **NGOÀI phạm vi (KNTT tập 2 — KHÔNG trích dẫn):** Ch VI tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận / nghịch · Ch VII biểu thức đại số, đa thức ·
    Ch VIII biến cố, xác suất · Ch IX quan hệ góc – cạnh đối diện, bất đẳng thức tam giác, đường vuông góc – đường xiên, các đường đồng quy (trọng tâm, trực tâm…) · Ch X hình khối ·
    lớp 8+: hằng đẳng thức, Pytago, đồng dạng, Ta-lét, đường trung bình. Đề có dạng "hai phân số bằng nhau" ⇒ giải bằng Ch I (nhân hai vế với một số khác 0), không trích tính chất
    tỉ lệ thức, thêm `**Chưa chắc:** dạng tỉ lệ thức (KNTT Ch VI, học kì 2)` (tiền lệ CKI-14 Câu 6b). Câu không né được kiến thức tập 2 ⇒ vẫn soạn, `**Chưa chắc:**` nêu rõ chương — KHÔNG tự bỏ câu.
- **Mẫu nội dung đề cuối kì 1 K7 đã soát đạt** (tham khảo cách giải / mức chi tiết, khuôn tệp vẫn theo `lo\k6\GKI-01.soan.md`): `Repo\kho-rules\dai\lo\k7\CKI-02.soan.md`, `CKI-20.soan.md` (có tam giác cân, trung trực, biểu đồ).
- **Bài Hình trình bày theo `k7.md` §3 "LUẬT TRÌNH BÀY HÌNH 7·8·9" (CEO 27/10)** — dòng ngắn, mỗi khẳng định kèm lý do trong ngoặc `(gt)` / `(cmt)` / tên định lí; các dòng của một ý nối bằng
  xuống dòng đơn, KHÔNG chèn dòng trống giữa các bước (dòng trống chỉ trước ý b) c) d)). Luật này mới hơn và đè dòng "mỗi dòng một đoạn" của brief bên dưới cho bài Hình.
- **Biểu đồ / hình là dữ kiện** (B018-01 Bài II, B018-02 Bài 3, B018-03 Câu 3 trả lời ngắn và Bài 3): cắt hình vào `<LV>\img\` + dòng `**Hình:**`, chép đủ số liệu trên hình vào phần Đề.
- **Nhãn bài có số La Mã / bài con** (B018-01 "Bài I: 1) a) b) 2) a) b) c)"): viết số Ả Rập, tách theo luật — vd `Bài 1.1a`, `Bài 1.2c`; phần "TRẢ LỜI NGẮN" của B018-03 là một PHẦN riêng
  (`## PHẦN 2 | Trả lời ngắn | tra_loi_ngan`), câu nào đáp số không vừa 4 ô (phân số…) thì `loai=tu_luan`.
- **Ảnh cho CEO (brief soát):** lưu vào `Repo\kho-rules\dai\lo\toanmath\batch\B018\can-xem\<MA>_<nhãn>.png`; cột "Trang trong PDF gốc" = số trang trong `<LV>\goc.pdf` (= file toanmath gốc).
- Năm học 2024–2025 hay 2025–2026 đều theo **cùng phạm vi kiến thức cuối học kì 1** như trên.
