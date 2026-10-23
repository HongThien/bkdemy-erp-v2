# Bản đồ mới khối 11 — ghi chú khi điền lý thuyết + ví dụ (15/10/2026)

Thùy: *"bản đồ lớp 11 mới đã xong dạng bài và mô tả. M điền lý thuyết và ví dụ nhé. Tham khảo từ bản đồ cũ và các quyển sách mà t gửi"*.

- **Đã ghi (DB live 15/10):** khối 11 (Toán) có 98 dạng có mô tả ⇒ lý thuyết MỚI 94 dạng (4 dạng đã có lý thuyết giữ nguyên) · ví dụ 98 dạng × 2 = 196 ví dụ có lời giải.
  Sau khi ghi: 98/98 dạng có mô tả đều có lý thuyết + ví dụ. **Không đụng:** 2 dạng chưa có mô tả (NDB01023, NDB01025), `ten`, `mo_ta`, lý thuyết nhóm, lý thuyết dạng có sẵn.
- **Phạm vi:** mới 2 chủ đề trong bản đồ mới (Lượng giác `NCD00090` · Dãy số–CSC–CSN `NCD00093`). 7 chương còn lại (Số đặc trưng, QHSS, Giới hạn, Mũ–log, Đạo hàm, QHVG, Xác suất) chưa có bản đồ ⇒ chưa làm.
- **Nguồn:** mô tả của Thùy · lý thuyết bản đồ cũ (`dai_dang_ly_thuyet` qua `dai_bdm_doi_ung` + theo tên) · PNL 2026 (GV) · Từ Tâm (P1–P3) · NBV 11-1…11-4 · luật `kho-rules/dai/k11.md` §3.
- **Dây chuyền:** 6 lượt B1–B6 → Sonnet soạn (`lo/k11/ban-do/brief-soan.md`) → Opus soát có kiểm số bằng máy (`brief-soat.md`; 6/6 ĐẠT, 0 ví dụ sai đáp số, ~65 chỗ sửa trình bày / phạm vi / lạc dạng) → `kiem.mjs` lỗi 0 → `ghi.mjs --ghi` (chỉ ô trống; trigger tự lưu `dai_bdm_log`).
- **Trang duyệt:** `kho-rules/dai/k11-ban-do-moi-duyet.html`. Bản soạn/gốc/biên bản: `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11\ra\B*.txt|.goc.txt|.soat.md`.

## Cần Thùy quyết / xác nhận

### A. Tên / mô tả lệch (đã làm theo nhóm chứa dạng, KHÔNG sửa tên)
- **NDB01027** ghi "cấp số **cộng**" nhưng nằm nhóm Nhận diện cấp số **nhân** · **NDB00618** ghi "u1, d" trong nhóm CSN (hiểu là công bội q).
- **NDB00999 / NDB01000:** mô tả nói tan/cot = t thì t ∈ [−1;1] — sai (t không bị chặn); ví dụ làm theo hướng đúng.
- **NDB00584** "dựa vào đồ thị" hiểu là giải phương trình hoành độ giao điểm, gần trùng NDB00583.
- **NDB00569 / NDB00946:** 00569 = điểm biểu diễn / tia cuối, 00946 = xét dấu — xác nhận ranh giới.
- **NDB00598** (tên mơ hồ) hiểu là câu hỏi đúng/sai về khái niệm tăng giảm / bị chặn · **NDB01019** làm theo mô tả (tìm $u_n$ từ lời mô tả) dù nhóm ghi "xác định số hạng hoặc thứ tự".
- **Nhóm NNB01539** tên "Rút gọn … công thức cộng" nhưng chứa cả nhân đôi, tổng↔tích — nên đổi tên nhóm.
- **NDB00958/NDB00968:** NDB00968 ví dụ 2 cho giá trị của hai góc ($\sin a$, $\cos b$) — chuẩn SGK, giữ.

### B. Cách hiểu của trạm soạn (ít chắc)
- **NDB00619** ví dụ 2: làm tròn 34 002 211 → 34 002 000 đồng (hàng nghìn); chị muốn làm tròn xuống hay lên để chắc trả hết nợ?
- **NDB00954:** hai ví dụ chỉ dùng cặp góc phụ nhau, chưa có góc bù / đối / hơn kém π như mô tả nêu · **NDB00953:** ví dụ 2 chỉ hơi khó hơn ví dụ 1.
- **NDB01024** ("dạng khác"): chọn bài bậc thang và so sánh hai phương án lương · **NDB00995** ví dụ 2 chỉ khó hơn một chút · **NDB01003** ví dụ 2 đề bằng bảng giá trị "đường cong trơn hình sin".
- **NDB00565, các dạng đồ thị / đường tròn LG** (NDB01002–01005, 01022, 00581–00584): bản đồ nói "cho bởi hình vẽ / đồ thị" nhưng chưa có hình ⇒ đề mô tả bằng lời / bảng giá trị. Muốn hình thật cần máy vẽ (làm riêng).
- **NDB01006:** chưa có ví dụ tan/cot · **NDB00964** ví dụ 2 / **NDB00959**: công thức tan 3x và sin 2a, cos 2a theo tan a không có sẵn trong SGK 11 — lời giải tự suy từ công thức cộng + nhân đôi.

### C. Lỗi trong nội dung CÓ SẴN (chưa sửa — không đè chữ của Thùy)
- **Tên:** NDB00566 "Chales" → Chasles · NDB00599 "tặng giảm" → tăng giảm.
- **Lý thuyết nhóm:** nhiều nhóm có "Ví dụ minh họa" chép từ bản cũ nằm TRONG lý thuyết nhóm (không khung `##VD`), dùng `\Leftrightarrow`; nhóm NNB01160 chỉ thử 5 số hạng đầu rồi kết luận (chưa chặt); lý thuyết cũ T111060104 cùng lỗi.
- **13 nhóm trống lý thuyết nhóm** (chuyên đề Công thức LG 4 nhóm, "Rút gọn, tính giá trị biểu thức LG", các nhóm "Bài toán thực tế …", "Phương trình LG mở rộng", "Một số dạng toán khác về PTLG", "Đồ thị hàm số LG", CSN nhóm 5, NNB01142): công thức nền đang nằm trong `##TC` từng dạng ⇒ có lặp. Điền lý thuyết nhóm = việc riêng nếu Thùy gật.
