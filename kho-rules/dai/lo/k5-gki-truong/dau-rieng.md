Batch: **K5-GKI-TRUONG — LÔ MẪU (khối 5 × giữa kì I, đề / đề cương của trường)** · 21/11/2026 · KHÔNG vào kho tự động (§C3: lô mẫu luôn làn 🟡 tới khi quản lý môn duyệt mẫu).

Khối 5 THƯỜNG (KNTT) — KHÁC khối 5T. Giữa kì I = phạm vi phần đầu HK1 Toán 5: ôn số tự nhiên · phân số · số thập phân (đọc, viết, so sánh, làm tròn, cộng trừ nhân chia STP ở mức đề in) · đơn vị đo (độ dài, khối lượng, diện tích) · hình học đã học (góc, đường thẳng song song / vuông góc, hình thang…). Không dùng kiến thức HK2.

## Đề trong lô (2 đề — mỗi đề MỘT trạm soạn riêng, cùng đọc luật + bản đồ)

| Mã | Nguồn ảnh (150 dpi, đọc từ ảnh — không có lớp chữ) | Tên đề trong tệp soạn | Tệp ra |
|---|---|---|---|
| ND-ON9 | `kho-rules/dai/lo/k5-gki-truong/anh/ND-ON9-1.png`, `ND-ON9-2.png` | `# ĐỀ | Đề ôn tập giữa kì I số 9 — Toán 5 (TH Nguyễn Du)` | `kho-rules/dai/lo/k5-gki-truong/ND-ON9.soan.md` |
| TM-D1 | `kho-rules/dai/lo/k5-gki-truong/anh/TM-D1-01.png`, `TM-D1-02.png` | `# ĐỀ | Đề cương giữa kì I số 1 — Toán 5 (TH Tây Mỗ)` | `kho-rules/dai/lo/k5-gki-truong/TM-D1.soan.md` |

Đầu tệp mỗi đề (đúng §A10): dòng 1 `luat: <mã>` (mã ở dòng đầu brief này) · `# ĐỀ | …` · `nam: 2026` · `bo_sach: KNTT` · `kieu: de_cuong` (cả hai là đề ôn / đề cương, bỏ `thoi_gian_phut`).

## Bản đồ khối 5 (§A3 — truy vấn đầu batch 21/11)

`kho-rules/dai/lo/k5-gki-truong/ban-do-k5.md` — 102 dạng, mỗi dạng có mô tả + lý thuyết + ví dụ. **Đọc mô tả + lý thuyết + ví dụ của các dạng ứng viên rồi mới gán** (không chỉ đọc tên). Mỗi dòng câu ghi `dang=<NDB…|—>` và `chac=<cao|vua|—>` (§A10). Không khớp rõ dạng nào ⇒ `dang=—` `chac=—` (không ép). Câu Đúng/Sai (ghi Đ/S vào ô) nhập dạng `tu_luan` ⇒ `dang=—`, `chac=—` (chưa có kho Đúng/Sai cấp chủ đề cho khối 5 thường; ghi `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`). Không tự thêm dạng; thấy dạng thiếu ⇒ ghi vào `## GHI CHÚ CHO NGƯỜI DUYỆT` một dòng "đề xuất dạng: …".

## Điểm riêng của lô này

- **Không có đáp án in** (đề ôn / đề cương trống, không nhân chứng) ⇒ mọi câu Opus giải mù 100% (§C5). Trạm soạn: tự thử đáp số bằng script Node (Write ra thư mục tạm của batch `kho-rules/dai/lo/k5-gki-truong/tam-<mã>/`, không heredoc), ghi số phép thử + FAIL vào báo cáo.
- **Đề ảnh chụp trang (scan)**: hay lẫn vết viết tay / khoanh / gạch của học sinh trên ảnh ⇒ BỎ QUA hết, chỉ lấy chữ in. Bẫy đọc (§A11, mục khối 5 (c)): hỗn số (`2\dfrac{8}{9}` ≠ `2-\dfrac{8}{9}`), hàng của số thập phân, đơn vị mũ, `,` ↔ `.`, "linh" trong cách đọc số. Mọi hỗn số / phân số / đơn vị mũ / số nhiều chữ số: phóng to 300 dpi bằng `pdftoppm` từ PDF gốc (đường dẫn ở dưới) hoặc cắt ảnh trang trước khi chép.
- PDF gốc (chỉ để phóng to; đừng sửa): ND → `E:\BK ACADEMY\Tài liệu tham khảo\K5\GKI - 5A - TH Nguyễn Du.pdf` (2 trang) · TM → `E:\BK ACADEMY\Tài liệu tham khảo\K5\Giữa kỳ I 5A - TH Tây Mỗ.pdf` (trang 1–2 là Đề số 1; Đề số 2 bắt đầu từ trang 3 — KHÔNG làm).
- **Nhãn câu giữ ĐÚNG như bản in**: ND dùng `Câu 1…Câu 8`, `Bài 1…` (xem ảnh); TM-D1 dùng `Câu 1…Câu 7`, `Bài 1…Bài 6` + `Câu 6` ở phần tự luận (trùng nhãn "Câu 6" giữa hai phần ⇒ đổi nhãn phần tự luận thành `Bài 6` và ghi `**Ghi chú:**` — nhãn trong tệp phải duy nhất). Câu có ý a) b) c) trong CÙNG một câu trắc nghiệm / điền chỗ chấm: giữ MỘT câu (§mục khối 5: chỉ tách "Đặt tính rồi tính / Tính / Tính thuận tiện / Tìm x"); bài "Đặt tính rồi tính" nhiều phép ⇒ tách mỗi phép một câu `Bài 1a`, `Bài 1b`…
- **Câu "Nối"** (nối số thập phân với phân số thập phân bằng nhau, TM-D1 không có — chỉ Đề số 2): không áp dụng ở lô này.
- **Hình trong đề**: hình mang số liệu (hình thang ABCD có H, G — TM-D1 Câu 7.3; bảng, biểu đồ) ⇒ `**Hình:** <tệp> | nguon=goc` (cắt từ ảnh trang 150 dpi, mở ảnh kiểm tra, đặt tên có tiền tố mã đề, vd `TM-D1_c7_hinh.png`, lưu vào thư mục `kho-rules/dai/lo/k5-gki-truong/anh/` — `dung-de-tu-soan.mjs` đọc từ thư mục `img/` của thư mục làm việc: trạm soạn KHÔNG tự ghi ra đó; chỉ khai tên tệp + cắt hình vào `kho-rules/dai/lo/k5-gki-truong/anh/`, điều phối chép sang `img/`). **Ảnh trang trí** (hai tấm ảnh chụp hồ trong TM-D1 Câu 3) KHÔNG đưa vào; số liệu của câu đã có đủ trong chữ.
- Bài yêu cầu VẼ ⇒ vẫn nhập, lời giải tả từng bước vẽ, `**Ghi chú:** lời giải chưa có hình vẽ`.
- Cổng của trạm soạn: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k5-gki-truong/<MÃ>.soan.md --lam-viec "$HOME/bk-kho-lam-viec/de-thi/K5-gki-truong/<MÃ>" --khoi 5 --chi-kiem` ⇒ sửa tới "✔ đạt cổng". (Thư mục làm việc có thể chưa tồn tại với `--chi-kiem`; nếu cổng đòi, tạo thư mục rỗng — chỉ thư mục đó.)
- Không ghi DB, không commit, không xoá tệp (§A16). Chỉ ghi tệp của mình (`<MÃ>.soan.md`, ảnh cắt, thư mục `tam-<mã>/`).
