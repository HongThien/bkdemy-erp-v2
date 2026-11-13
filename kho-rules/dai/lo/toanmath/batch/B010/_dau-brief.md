# ⚠️⚠️ BẢN ÁP DỤNG BATCH B010 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 8 TẢI TỪ TOANMATH (17 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ 40 đề **giữa** kì 1 Toán 8 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, khuôn lời giải 2 phần, định dạng (`\cdot`), cổng, bẫy: GIỮ NGUYÊN.
**Riêng PHẠM VI KIẾN THỨC thì KHÁC: đây là đề CUỐI học kì 1** — mục "Phạm vi kiến thức" dưới đây THAY cho mọi chỗ bên dưới nói "tới giữa học kì 1".
Chỉ khác những điểm sau:

- `<MA>` = `B010-NN` (01–17). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B010\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong file gốc), `hd` (trang HƯỚNG DẪN CHẤM trong `goc.pdf`, rỗng nếu không có), `tach` (đề lấy riêng từ file nhiều mã/nhiều đề).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B010\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B010\<MA>.soan.md`; tệp kiểm (trạm soát): `…\B010\<MA>.kiem.md`.
  **Không có `<LV>\de.json`** (bản máy gõ lại mà brief gốc nhắc) — `de.boc.json` chỉ là nhãn nguồn; gõ đề từ ảnh trang (đề có lớp chữ thì `pdftotext -layout` từ `goc.pdf` để đỡ gõ, lệch thì ảnh đúng).
  Đề mẫu khuôn tệp vẫn là `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (đề giữa kì — chỉ học KHUÔN, không học phạm vi kiến thức).
- **Chỉ trang ĐỀ (`de`) là đề.** File tải về có thể kèm ma trận / bản đặc tả (đứng TRƯỚC đề), hướng dẫn chấm, trang quảng cáo cuối ("Xem thêm …toanmath.com")
  — bỏ qua ma trận và quảng cáo, KHÔNG chép vào đề. `goc.pdf` là nguyên file với các đề không `tach`:
  B010-01 trang 1 ma trận, **trang 2 là đề**, 3–4 hướng dẫn chấm · B010-05 trang 1–5 ma trận + đặc tả, **6–8 đề**, 9–11 hướng dẫn chấm, 12 quảng cáo (12 trang ⇒ ảnh tên `p-01.png` … `p-12.png`) ·
  B010-02 trang 9, B010-16 trang 5 là quảng cáo · B010-17 trang 4–5 trắng.
- **Đề nhiều mã: chỉ lấy MỘT mã** (luật Thùy 13/11). Đã chọn sẵn, `goc.pdf` CHỈ chứa trang đề đã chọn (không có hướng dẫn chấm — soạn từ ảnh, tự giải):
  B010-04 Ngọc Lâm = mã T801 · B010-08 Phúc Đồng 2025 = mã 801 · B010-13 Phúc Đồng 2024 = mã 801 · B010-14 Giang Biên = Đề 01.
  Đề ghi "Đề số 02" (B010-03), "ĐỀ 2" (B010-16), "ĐỀ 01" (B010-17), mã T8-C1-801 (B010-07), T801 (B010-15), 101 (B010-02): file chỉ có đúng đề đó — ghi mã vào tên đề.
- **⭐ Hướng dẫn chấm CHỈ để tham khảo. Mục tiêu vẫn là lời giải CHI TIẾT đầy đủ** (đúng khuôn 2 phần của brief), không viết bản sơ lược, KHÔNG chép nguyên văn hướng dẫn chấm.
  Trạm soạn và trạm soát đều **tự giải trước**, chỉ SAU ĐÓ mới mở trang `hd` để đối chiếu. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; hướng dẫn chấm sai thì giữ đáp án đúng +
  `**Ghi chú:** hướng dẫn chấm ghi … , đúng là …`. Hướng dẫn chấm hay dùng kiến thức ngoài phạm vi (vd gọi tên "đường trung bình", "Pythagore") — KHÔNG chép theo, giải trong phạm vi dưới đây.
  Trả lời cuối của trạm nói rõ: có hướng dẫn chấm không, khớp bao nhiêu câu.
  **Có hướng dẫn chấm (7 đề):** B010-01, 02, 05, 06, 12, 16, 17. **KHÔNG có (10 đề):** B010-03, 04, 07, 08, 09, 10, 11, 13, 14, 15 — tự giải toàn bộ,
  mọi đáp số thử lại bằng máy; chỗ nào chưa tự kiểm chứng được bằng máy ⇒ `**Chưa chắc:**`.
- **Tên đề (dòng `# ĐỀ |`):** `Đề kiểm tra cuối học kì 1 Toán 8 năm <năm học> — <don_vi> (<mã đề nếu có>)`. `nam:` lấy từ `ds-de.json`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh +
  `## GHI CHÚ CHO NGƯỜI DUYỆT` (vd B010-12 in "Đề kiểm tra khảo sát cuối kì I"; B010-01 không in năm học — năm 2024-2025 lấy theo tên file toanmath; B010-02 chỉ có logo "bms", không in tên trường).
- **Đề SCAN (không có lớp chữ):** B010-03 Lô-mô-nô-xốp, 04 Ngọc Lâm, 08 Phúc Đồng 2025, 09 Thăng Long, 13 Phúc Đồng 2024 — chữ nhỏ thì phóng 300 dpi, không đoán.
  B010-07 Ngọc Thụy có chữ chìm chéo trang; B010-14 Giang Biên lớp chữ hỏng ở vài ký hiệu (tên góc, $x\ne\pm3$) — đọc theo ảnh.
- **Câu "chọn một trong hai" / phần riêng theo chương trình ⇒ nhập CẢ HAI** (như B005), mỗi phần một câu, `**Ghi chú:**` nói câu dành cho ai:
  B010-02 Bài 5a (hệ chuẩn) + Bài 5b (hệ T) · B010-03 Bài V ý 1) + ý 2) · B010-11 Câu 4A (sách KNTT) + Câu 4B (sách Cánh Diều) — câu của 4B giải theo kiến thức Cánh Diều (phân thức, hình chóp).
- **Câu Đúng/Sai nhiều mệnh đề** (B010-05 Câu 13) ⇒ `tu_luan` như luật brief; **trả lời ngắn** (B010-05 Câu 14 a–d) ⇒ `tra_loi_ngan` chỉ khi đáp số vừa 4 ô, không thì `tu_luan`.
- Vài bài trùng gần nguyên văn giữa các đề trong batch (B010-17 Bài 4.2 ≈ B010-11 Câu 3 · B010-08 Bài 4–5 ≈ B010-13 Bài 3–4 · B010-15 Bài 4a–b ≈ B010-07 Bài 4.2a–b): vẫn soạn đủ, chép đúng đề của mình.

## ⭐ PHẠM VI KIẾN THỨC — CUỐI HỌC KÌ 1 KHỐI 8 (THAY mục "Kiến thức" của brief gốc và luật "tới giữa học kì 1" của `k8.md` §10)

Khối 8 chưa từng chạy đề cuối kì 1 ⇒ áp luật `k8.md` §10 đổi mốc: **whitelist = những gì ĐỀ ĐÓ kiểm tra tới, theo bộ sách của trường, tính tới HẾT học kì 1.**
Nhìn TOÀN BỘ đề (cả trắc nghiệm) để biết đề chạm tới chương nào; kiến thức một chương chỉ được dùng ở đề CÓ câu kiểm tra chương đó.
Dấu hiệu bộ sách (chính đề Chương Mỹ B010-11 tách Câu 4A "sách KNTT" = dữ liệu + Thalès, Câu 4B "sách Cánh Diều" = phân thức + hình chóp; ma trận đề Phúc Đồng 2024 = đa thức, HĐT, phân thức, tứ giác, Pythagore):

| Nhóm | Đề | Kiến thức đề kiểm tra tới (ngoài Ch I đa thức + Ch II HĐT/phân tích nhân tử + Ch III tứ giác tới hình vuông, có ở mọi đề) | `bo_sach` |
|---|---|---|---|
| KNTT Tập 1 trọn | 01 Thanh Trì · 05 Hát Môn · 09 Thăng Long · 10 Tân Triều · 12 Nguyễn Công Trứ · 11 Chương Mỹ (phần chung + 4A) | **Ch IV:** định lí Thalès (thuận, đảo) · đường trung bình tam giác · tính chất đường phân giác · **Ch V:** thu thập, phân loại dữ liệu, bảng, biểu đồ (tranh, cột, cột kép, đoạn thẳng, quạt tròn) | KNTT |
| Có phân thức / hàm số / hình chóp / Pythagore (bộ sách khác hoặc KNTT dạy đảo thứ tự) | 02 Ban Mai · 03 Lô-mô-nô-xốp · 04 Ngọc Lâm · 14 Giang Biên · 17 Việt Hưng (đều có **hàm số**) — 06 Ngô Sĩ Liên · 07 Ngọc Thụy · 08 Phúc Đồng 2025 · 13 Phúc Đồng 2024 · 15 Lý Sơn · 16 Ngô Gia Tự | **Phân thức đại số:** khái niệm, điều kiện xác định, tính chất cơ bản, rút gọn, quy đồng, cộng trừ nhân chia, phân thức đối / nghịch đảo, viết phân thức biểu thị đại lượng thực tế · **hàm số bậc nhất** (chỉ đề có): giá trị $f(a)$, toạ độ, đồ thị, hệ số góc, hai đường thẳng song song / cắt nhau (chỉ khi đề hỏi) · **hình chóp tam giác đều, tứ giác đều** (chỉ đề có): trung đoạn, diện tích xung quanh, thể tích · **định lí Pythagore** thuận + đảo (chỉ đề có câu Pythagore) | Đoán: có hàm số ⇒ `Cánh Diều`; không ⇒ `CTST`. Ghi rõ "đoán" trong GHI CHÚ |

**Dùng được ở MỌI đề:** nền lớp 6–7 (bảng `k8.md` §1.2 dòng "Nền đã học trước lớp 8": tam giác bằng nhau, tam giác cân, **trọng tâm & tỉ số $\tfrac23$**, đường vuông góc–đường xiên…; hình hộp chữ nhật, hình lập phương lớp 7)
· toàn bộ Ch I–III KNTT (đơn thức → hình vuông, gồm trung tuyến ứng cạnh huyền khi đề có hình chữ nhật trở lên)
· hằng đẳng thức + phân tích nhân tử (đặt nhân tử chung, hằng đẳng thức, nhóm, tách hạng tử) · $A\cdot B=0\Rightarrow A=0$ hoặc $B=0$ · GTLN/GTNN bằng hoàn thành bình phương.

**CẤM ở MỌI đề (học kì 2 của mọi bộ sách):** tam giác đồng dạng, hình đồng dạng · tỉ số lượng giác · xác suất · tên gọi "phương trình bậc nhất", "tập nghiệm $S=\{…\}$",
"giải bài toán bằng cách lập phương trình" — tìm $x$ / tìm $m$ vẫn biến đổi từng dòng bằng quy tắc chuyển vế; đề có ẩn ở mẫu (vd B010-15 Bài 1.2a) thì nêu điều kiện xác định,
nhân chéo theo tỉ lệ thức (lớp 7), đối chiếu điều kiện · bất đẳng thức Cô-si (AM–GM) — GTLN/GTNN dùng $(a-b)^2\ge 0$.

**Chỉ dùng khi chính đề đó kiểm tra tới (không thì CẤM, cần thì tự chứng minh trong lời giải — `k8.md` §1.1 luật 3):**
- **Định lí Thalès, tính chất đường phân giác** — chỉ ở đề nhóm KNTT (có câu về chúng). **Hệ quả Thalès** $\dfrac{DE}{BC}=\dfrac{AD}{AB}$ không có trong lý thuyết `k8.md` §1.2 ⇒ tự chứng minh
  (kẻ song song, hình bình hành — mẫu HDG C4 B1 6A/6B) rồi mới dùng.
- **⚠️ Đường trung bình của tam giác — CHƯA CÓ QUYẾT ĐỊNH cho đề cuối kì 1.** KNTT dạy ở Ch IV (học kì 1), nhưng Thùy 20/10 chốt cho đề GIỮA kì: "chỉ dùng ở đề Ngôi Sao Hoàng Mai".
  Áp tạm: **dùng được nếu đề kiểm tra tới** (đề có câu mà dữ kiện / câu hỏi đúng là đường trung bình — vd B010-05 Câu 2 và Bài 3a, B010-12 Câu 4.1 và 4.2a, B010-10 Câu 4.2a);
  **câu nào dùng ⇒ thêm `**Chưa chắc:** dùng đường trung bình (KNTT Ch IV, học kì 1) — chờ Thùy quyết cho đề cuối kì`**. Đề KHÔNG kiểm tra tới (cả nhóm phân thức / hàm số)
  ⇒ CẤM, tự chứng minh bằng hình bình hành / tam giác bằng nhau / trọng tâm như brief gốc (§7 "Bẫy đã cắn thật"), và vẫn ghi `**Chưa chắc:**` nếu dữ kiện đúng là bài đường trung bình.
- **Định lí Pythagore** — chỉ ở đề có câu Pythagore (vd B010-06 Câu 8, Bài 3 · 13 Câu 7, Bài 5 · 14 Câu 7 · 16 Câu 7; các đề còn lại tự xem). Đề khác cần độ dài ⇒ không dùng Pythagore.
- **Phân thức, hàm số, hình chóp** — chỉ ở đề có (bảng trên). Đề KNTT nhóm 1 gặp biểu thức có biến ở mẫu ⇒ xử lí như chia cho số khác 0, nêu điều kiện.
- Đề nhóm phân thức / hàm số mà KHÔNG có câu Thalès ⇒ Thalès và tính chất phân giác cũng CẤM.

Kiến thức nào đề cần mà bảng trên và `k8.md` không nói rõ ⇒ giải bằng cách gần nền nhất, thêm `**Chưa chắc:**` nói rõ đã dùng gì — KHÔNG tự quyết thay Thùy.
Năm học 2024–2025 hay 2025–2026 đều theo cùng phạm vi này.
