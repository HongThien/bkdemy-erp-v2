# ⚠️⚠️ BẢN ÁP DỤNG BATCH B011 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 8 TẢI TỪ TOANMATH (16 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ 40 đề **giữa** kì 1 Toán 8 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, cổng, cách phân kho / tách ý / loại câu,
khuôn 2 phần, hình giải, bẫy: GIỮ NGUYÊN. **Riêng LUẬT KIẾN THỨC thì THAY bằng mục "Phạm vi kiến thức cuối học kì 1" dưới đây** (brief gốc viết cho giữa kì).
Chỗ nào bên dưới ghi "giữa học kì 1" thì đọc là "cuối học kì 1". Những điểm khác:

- `<MA>` = `B011-NN` (01–16). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B011\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong `goc.pdf`), `hd` (trang HƯỚNG DẪN CHẤM, rỗng nếu file không có), `tach` (đề lấy riêng từ file có nhiều mã).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B011\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
  **KHÔNG có `de.json` gõ sẵn và `img\` còn trống** — gõ đề từ ảnh trang; hình có sẵn trong đề thì tự cắt từ `<LV>\goc.pdf` (`pdftoppm -r 150 -x -y -W -H`,
  đặt tên `p1c7.png`, `p2b4.png`…), mở ảnh kiểm rồi khai `**Hình:**`.
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B011\<MA>.soan.md`; tệp kiểm (trạm soát): `…\B011\<MA>.kiem.md`.
- **Chỉ trang ĐỀ (`de`) là đề.** Bỏ qua trang hướng dẫn chấm khi chép đề, trang ma trận / đặc tả (B011-10 Giảng Võ 2: trang 6–7) và trang quảng cáo cuối
  ("Xem thêm …toanmath.com", B011-01 Thạch Thất: trang 6) — KHÔNG chép vào đề.
- **Đề nhiều mã: chỉ lấy MỘT mã** (luật Thùy 13/11). Ngọc Lâm (B011-08) = **mã đề 801**: `goc.pdf` chỉ chứa 2 trang của mã 801 (mã 802 bỏ), không có hướng dẫn chấm.
  Nguyễn Bỉnh Khiêm (B011-14): file chỉ có **mã đề 801** — ghi mã vào tên đề.
- **⭐ Hướng dẫn chấm CHỈ để tham khảo. Mục tiêu vẫn là lời giải CHI TIẾT đầy đủ** (đúng khuôn 2 phần của brief), không viết bản sơ lược, KHÔNG chép nguyên văn hướng dẫn chấm.
  Trạm soạn và trạm soát đều **tự giải trước**, chỉ SAU ĐÓ mới mở trang `hd` để đối chiếu. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; hướng dẫn chấm sai thì giữ đáp án đúng +
  `**Ghi chú:** hướng dẫn chấm ghi … , đúng là …`. Hướng dẫn chấm hay dùng tắt kiến thức (vd "chứng minh được NH là đường trung bình", "theo định lí Thalès suy ra …") —
  KHÔNG theo đó mà bỏ luật kiến thức dưới đây. Trả lời cuối của trạm nói rõ: có hướng dẫn chấm không, khớp bao nhiêu câu.
  **Đề KHÔNG có `hd` (7 đề):** B011-04 Phúc Diễn · 05 Amsterdam 2024-25 · 06 Đông Mỹ · 08 Ngọc Lâm · 14 Nguyễn Bỉnh Khiêm · 15 Nguyễn Trường Tộ · 16 Amsterdam 2025-26 —
  tự giải, đánh dấu `**Chưa chắc:**` chỗ nào chưa tự kiểm chứng được bằng máy.
- **Tên đề (dòng `# ĐỀ |`):** `Đề kiểm tra cuối học kì 1 Toán 8 năm <năm học> — <don_vi> (<mã đề nếu có>)`. `nam:` lấy từ `ds-de.json`. Đối chiếu tiêu đề trên ảnh;
  lệch thì theo ảnh + `## GHI CHÚ CHO NGƯỜI DUYỆT`. B011-03 Phan Đình Giót ghi thêm "(đề dành cho học sinh 8A1–8A5)" như đề in.
- **Đề scan (10 đề, không có lớp chữ):** B011-02 Phan Chu Trinh 2024-25 (trang đề scan, trang hướng dẫn chấm có chữ) · 04 · 05 · 06 · 08 · 12 Lương Thế Vinh (ảnh sạch nhưng không có lớp chữ) ·
  13 · 14 · 15 · 16. Chữ nhỏ / số mũ / dấu thì phóng 300 dpi, không đoán. Đề có lớp chữ: 01, 03, 07, 09, 10, 11 (lớp chữ hỏng dấu tiếng Việt và công thức — vẫn đọc từ ẢNH).
- **Câu Đúng/Sai** (Ngọc Lâm Câu 5, 6 · Cụm 14 Câu 5) ⇒ `tu_luan` theo brief gốc. **Câu trả lời ngắn của đề** (Ngọc Lâm Câu 7, 8 · Cụm 14 Câu 6, 7) ⇒ `tra_loi_ngan`
  chỉ khi đáp số vừa 4 ô, không thì `tu_luan`.
- **Phân kho thêm cho cuối kì:** hình chóp tam giác đều / tứ giác đều (thể tích, diện tích xung quanh) ⇒ `hinh_hoc`. Dữ liệu – biểu đồ – thống kê, hàm số – đồ thị – mặt phẳng toạ độ,
  phân thức ⇒ `dai`.
- **Câu yêu cầu VẼ biểu đồ / VẼ đồ thị** (B011-05 Bài 3.1 · B011-16 Bài 3.1b · B011-07 Bài II a …) ⇒ vẽ bằng code (`ve_hinh_lib.mjs`: trục, cột, đường, nhãn) thành `**Hình giải:**`,
  mở ảnh kiểm như hình hình học. Câu chỉ ĐỌC biểu đồ in sẵn ⇒ cắt hình biểu đồ làm `**Hình:**`.

## ⭐ Phạm vi kiến thức CUỐI HỌC KÌ 1 (thay mục "Kiến thức" §4 và các dòng cấm của §7 brief gốc)

Luật gốc giữ nguyên (k8.md §1.1 luật 5, §10): **whitelist = những gì ĐỀ ĐÓ kiểm tra tới theo bộ sách của trường, tính tới HẾT học kì 1.** Nhìn TOÀN BỘ đề để biết bộ sách.
Cần một kết quả ngoài whitelist ⇒ tự chứng minh ngay trong lời giải bằng cái đã học; không làm được ⇒ `**Chưa chắc:**`. Năm học 2024–2025 hay 2025–2026 cùng phạm vi.

**KNTT (Tập 1 = Chương I–V)** — B011-02, 03, 04, 05, 06, 09, 10, 12, 15, 16 (`bo_sach: KNTT`):
- Được dùng: **Ch I** đa thức (đơn thức … chia đa thức cho đơn thức) · **Ch II** bảy hằng đẳng thức + **phân tích đa thức thành nhân tử** (mọi phương pháp: hằng đẳng thức, nhóm,
  đặt nhân tử chung; "$A\cdot B=0\Rightarrow A=0$ hoặc $B=0$" được dùng) · **Ch III** tứ giác → hình thang cân → hình bình hành → hình chữ nhật (kể cả trung tuyến ứng với
  cạnh huyền) → hình thoi, hình vuông · **Ch IV** định lí Thalès thuận + đảo (Bài 15), tính chất đường phân giác của tam giác (Bài 17) · **Ch V** dữ liệu, bảng, biểu đồ
  (thu thập, phân loại, số liệu rời rạc / liên tục, chọn biểu đồ, vẽ, phân tích số liệu).
  Nền lớp 7 vẫn dùng được, trong đó có **phép chia đa thức một biến (kể cả chia có dư)** — Amsterdam B011-05 Bài 2.2, B011-16 Bài 2.2 dùng cái này.
- **Dùng được nếu đề kiểm tra tới; câu nào DÙNG ⇒ thêm `**Chưa chắc:**` nêu rõ đã dùng gì** (repo chưa nói rõ được hay cấm ở cuối kì 1 — chờ Thùy):
  - **đường trung bình của tam giác** (Ch IV Bài 16 — luật Thùy 20/10 "chỉ đề Ngôi Sao Hoàng Mai" mới ghi cho giữa kì);
  - **hệ quả định lí Thalès** ($\dfrac{AD}{AB}=\dfrac{AE}{AC}=\dfrac{DE}{BC}$ — k8.md §1.2 ghi "không có trong lý thuyết, tự chứng minh"; các bài đo chiều cao cây / toà nhà /
    khoảng cách qua sông thường cần cái này).
  Đề hỏi thẳng (vd trắc nghiệm "EF là đường trung bình của $\triangle MNP$", "$ME$ là đường trung bình") vẫn ghi `Chưa chắc` — một dòng ngắn là đủ.
- Cấm (học kì 2 của KNTT): phân thức (Ch VI) · "phương trình", "tập nghiệm $S=\{…\}$", hàm số – đồ thị (Ch VII) · xác suất (Ch VIII) · tam giác đồng dạng, **định lí Pythagore**
  (Ch IX) · hình chóp (Ch X) · đường trung bình hình thang (KNTT 8 không có). Đề KNTT mà có câu chạm tới mấy thứ này ⇒ dùng đúng cái đề kiểm tra + `**Ghi chú:**`.

**Cánh Diều (Tập 1 = Chương I–V)** — B011-01 Thạch Thất, 07 Đức Giang, 08 Ngọc Lâm, 11 Cụm 14 (đề ghi rõ "Cánh diều"), 14 Nguyễn Bỉnh Khiêm (`bo_sach: Cánh Diều`):
- Được dùng: **Ch I** đa thức nhiều biến, hằng đẳng thức, phân tích nhân tử · **Ch II** phân thức đại số (điều kiện xác định, tính chất cơ bản, rút gọn, cộng trừ nhân chia,
  tìm $x$ nguyên để biểu thức nguyên) · **Ch III** hàm số, mặt phẳng toạ độ, đồ thị, hàm số bậc nhất $y=ax+b$, hệ số góc, hai đường thẳng song song / cắt nhau ·
  **Ch IV** hình chóp tam giác đều, hình chóp tứ giác đều (diện tích xung quanh, thể tích) · **Ch V** **định lí Pythagore** (thuận, đảo), tứ giác, hình thang cân, hình bình hành,
  hình chữ nhật (trung tuyến ứng với cạnh huyền), hình thoi, hình vuông.
- Cấm (học kì 2 của Cánh Diều): **định lí Thalès, đường trung bình, tính chất phân giác** (Ch VIII) · tam giác đồng dạng · "phương trình – tập nghiệm" · thống kê – xác suất.
  Bài có dữ kiện kiểu đường trung bình ⇒ tự chứng minh bằng hình bình hành / tam giác bằng nhau / trọng tâm (lớp 7). Bài cần tỉ số kiểu Thalès ⇒ trọng tâm tam giác (tỉ số $\tfrac23$,
  lớp 7) hoặc tam giác bằng nhau; không được ⇒ `**Chưa chắc:**`.

**CTST hoặc Cánh Diều — B011-13 Chu Văn An** (phân thức + hình chóp + Pythagore, không có hàm số): ghi `bo_sach: CTST` nếu không thấy dấu hiệu Cánh Diều; dùng đúng kiến thức đề
kiểm tra (phân thức, hình chóp, Pythagore, tứ giác); cấm Thalès / đường trung bình / đồng dạng / hàm số (CTST học kì 2). Bộ sách các đề Cánh Diều trên (trừ Cụm 14) là ĐOÁN theo
nội dung (phân thức + hàm số + hình chóp + Pythagore cùng lúc ⇒ Cánh Diều) — ghi trong `## GHI CHÚ CHO NGƯỜI DUYỆT`.

## Ghi riêng từng đề (đã xem ảnh khi chuẩn bị)

- B011-01 Thạch Thất: đề 2 trang (trang 1–2), "Học sinh làm trực tiếp vào bài kiểm tra"; Bài 4.1 hình chóp có hình in sẵn.
- B011-03 Phan Đình Giót: 1 trang; Bài 3 đọc biểu đồ lượng mưa – nhiệt độ (cắt hình); Bài 4.1 có hình thuyền – cây dừa.
- B011-05, B011-16 Amsterdam: trường chuyên, 1 trang, không hướng dẫn chấm; "không sử dụng máy tính cầm tay" (B011-05). Bài 5 số nguyên / GTNN — giải sơ cấp, kiểm bằng máy.
- B011-09 Phan Chu Trinh 2025-26: "Học sinh được sử dụng máy tính cầm tay".
- B011-10 Giảng Võ 2: trang 6–7 là ma trận (bỏ). B011-12 Lương Thế Vinh: Bài 3 có biểu đồ cột kép in sẵn (cắt hình).
- B011-13 Chu Văn An: đề 1 trang, chữ nhỏ (Bài IV.1 có ảnh đèn kim tự tháp + kích thước) — phóng 300 dpi.
- B011-15 Nguyễn Trường Tộ: Bài 3 biểu đồ lượng khí thải CO₂ in mờ — cắt hình, đọc số ở 300 dpi.
