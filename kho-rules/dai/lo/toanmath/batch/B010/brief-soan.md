# ⚠️⚠️ BẢN ÁP DỤNG BATCH B010 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 8 TẢI TỪ TOANMATH (17 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ 40 đề **giữa** kì 1 Toán 8 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, khuôn lời giải 2 phần, định dạng (`\cdot`), cổng, bẫy: GIỮ NGUYÊN.
**Riêng PHẠM VI KIẾN THỨC thì KHÁC: đây là đề CUỐI học kì 1** — mục "Phạm vi kiến thức" dưới đây THAY cho mọi chỗ bên dưới nói "tới giữa học kì 1".
Chỉ khác những điểm sau:

- `<MA>` = `B010-NN` (01–17). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B010\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong file gốc), `hd` (trang HƯỚNG DẪN CHẤM trong `goc.pdf`, rỗng nếu không có), `tach` (đề lấy riêng từ file nhiều mã/nhiều đề).
- `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B010\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
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

---

# Brief giao trạm SOẠN — khối 8, bộ đề giữa kì 1 (40 đề, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). Khuôn chép từ `k6-brief-soan.md` (dây chuyền đề khối 6), đổi các chỗ riêng của khối 8.
> `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B010\<MA>`.
> Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k8-brief-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa học kì 1 Toán 8: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\toanmath\batch\B010\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k8.md` — luật khối 8: **§1 luật kiến thức theo thứ tự bài** (quan trọng nhất), §1.5–§1.6 hai phần, §2 khuôn Phần 2 Đại, §3 định dạng, **§10 luật riêng cho bộ đề**.
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **đề mẫu**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2 (cả câu Đại lẫn câu Hình).

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`… — **ảnh từng trang, NGUỒN CHÍNH**. Mở HẾT mọi trang bằng công cụ Read (ảnh 150 dpi). Một số đề là ảnh SCAN, chữ nhỏ:
  chỗ nào không đọc chắc (số mũ, dấu âm, chỉ số, tên điểm) ⇒ cắt phóng to từ PDF rồi đọc lại, không đoán:
  `pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/tam/<tên>"` (toạ độ tính theo 300 dpi = gấp đôi toạ độ ảnh 150 dpi).
- `<LV>\de.json` — bản máy gõ lại, CHỈ để đỡ công gõ. Máy hay sai: số mũ, dấu, phân số, sót câu, gộp câu. **Lệch nhau thì ảnh đúng.**
- `<LV>\img\*.png` — hình máy đã cắt. Mở xem TỪNG hình: đúng hình của câu, không cụt, không dính chữ của câu khác.

## 3. Việc phải làm

1. **Soát đề** từng câu so với ảnh: chữ, số, công thức, đủ 4 phương án, đủ các ý, không sót không thừa câu.
2. **Lỗi in của đề** (sai chính tả, lệch tên điểm, thiếu dấu) ⇒ sửa tối thiểu cho đề đúng nghĩa + ghi dòng `**Ghi chú:** …` nói đã sửa gì.
   `Ghi chú` chỉ dành cho lỗi của ĐỀ GỐC và điều người duyệt cần biết — **không** ghi "bản máy gõ nhầm …".
3. **Phân kho** từng câu: `kho=hinh_hoc` = hình học (tứ giác, hình thang, hình bình hành, hình chữ nhật, thoi, vuông, góc, định lí Pythagore, hình chóp,
   bài hình có vẽ / chứng minh / tính góc – cạnh trên hình); `kho=dai` = còn lại (đơn thức, đa thức, hằng đẳng thức, phân tích nhân tử, phân thức,
   tìm $x$, chia hết, giá trị lớn nhất – nhỏ nhất, bài thực tế viết / tính biểu thức đại số — kể cả khi bối cảnh là mảnh vườn hình chữ nhật).
4. **Tách ý — CHỈ bài "Thực hiện phép tính / Tính / Rút gọn / Tính giá trị / Phân tích đa thức thành nhân tử" và "Tìm $x$"** có nhiều ý a) b) c) độc lập:
   mỗi ý một câu, nhãn `Câu 9a` / `Bài 1b`… (giữ đúng chữ "Câu" hay "Bài" của đề); đề của câu = lời dẫn của bài + biểu thức của ý.
   **Mọi bài khác GIỮ CHUNG một câu** (bài cho sẵn đa thức rồi hỏi nhiều ý, bài lời văn, bài hình, chứng minh — kể cả khi có a) b) c)); Phần 2 ghi `a)` `b)`.
   **Bài hình: TUYỆT ĐỐI không tách ý.** "Bài" chỉ là cái vỏ gom 2 BÀI TOÁN KHÁC HẲN NHAU (đánh số 1) 2), mỗi bài toán một bộ dữ kiện riêng) ⇒ mỗi bài
   toán MỘT câu, nhãn `Bài 4.1`, `Bài 4.2`, `kho` theo từng bài toán.
5. **Loại câu:** `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · `tra_loi_ngan` CHỈ khi đáp số là MỘT số nguyên hoặc số thập phân viết được trong 4 ô
   (chữ số, dấu `-` đầu, dấu `,`; vd `31`, `-12`, `2,5`) **theo đúng dạng đề hỏi** — đáp số là biểu thức, phân số, nhiều giá trị ($x=1$ hoặc $x=-2$), số có đơn vị
   phải đổi ⇒ KHÔNG · còn lại `tu_luan` (`dap_an=—`).
   Câu Đúng/Sai nhiều mệnh đề ⇒ nhập `tu_luan`, đề giữ đủ các mệnh đề a) b) c) d), lời giải xét từng mệnh đề, thêm `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
   Câu "trả lời ngắn" của đề mà đáp số không vừa 4 ô ⇒ `tu_luan`.
6. **Giải** mọi câu theo `k8.md`, lời giải 2 phần (mục 4 dưới). **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write,
   KHÔNG heredoc): đa thức / hằng đẳng thức / phân tích nhân tử ⇒ thay ≥ 3 bộ số ngẫu nhiên vào hai vế; tìm $x$ ⇒ thay ngược vào đề; hình ⇒ dựng toạ độ số,
   kiểm từng khẳng định (song song, bằng nhau, vuông góc, thẳng hàng, số đo). Đừng nhẩm.
7. **Hình có sẵn trong đề:** thêm dòng `**Hình:** <tên tệp trong img>` (một tệp). Hình máy cắt hỏng / thiếu ⇒ tự cắt lại từ PDF (lệnh `pdftoppm` ở mục 2, `-r 150`),
   đặt tên mới kiểu `p1c5_lai`, mở ảnh vừa cắt để kiểm.
8. **Bài hình tự luận mà đề KHÔNG cho hình** (học sinh tự vẽ): **vẽ hình cho lời giải bằng code** rồi thêm dòng `**Hình giải:** giai_<nhãn>.png`
   (hình này chỉ hiện ở lời giải, không hiện ở đề). Viết `<LV>\tam\ve.mjs`, import
   `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
   chạy `node "<LV>/tam/ve.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'giai_cau12', w, h, svgDoc(w, h, T(dx, dy, body)))`.
   Mẫu cách vẽ: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`. Hình phải **dựng đúng dữ kiện bằng toạ độ** (trung điểm, song song, vuông góc tính bằng phép tính),
   đủ mọi điểm của mọi ý, đánh dấu GIẢ THIẾT (gạch bằng nhau, góc vuông cho trước), **không đánh dấu điều phải chứng minh**; canvas cao ≤ 450px, chừa ≥ 35px
   dưới nhãn đáy, nhãn không đè đường. Vẽ xong mở ảnh bằng Read để kiểm, sai thì sửa.
   Bài yêu cầu VẼ hình (vd "Vẽ hình thang cân…") cũng làm như vậy.
   **Đề có IN SẴN bảng đáp án / hướng dẫn chấm** (vài đề có, vd Quế Thuận in bảng đáp án trắc nghiệm ở trang 2): vẫn tự giải trước, rồi đối chiếu;
   lệch ⇒ tính lại bằng máy, bảng in sai thì giữ đáp án đúng + `**Ghi chú:**`. Không chép bảng đáp án vào đề; nói trong trả lời cuối là đề có bảng đáp án.
9. **Không chắc 100% thì NÓI RA** — thêm dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó. CEO sẽ xem kĩ đúng những câu này, nên đừng giấu và đừng
   ghi tràn lan. Ghi khi: ảnh mờ không đọc chắc · đề có hai cách hiểu · đề in lỗi làm không có / có hai phương án đúng (vẫn chọn phương án hợp lí nhất và
   nói rõ) · không giải được trong phạm vi kiến thức của đề (xem mục 4 "Kiến thức") · đề thiếu điều kiện làm hình suy biến.
10. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu đã bỏ (vì sao), nhận xét chung về đề (bộ sách, phạm vi kiến thức đề chạm tới). Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp:

```
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 8 năm 2025-2026 — THCS <tên trường>, <phường / xã / quận, tỉnh nếu đề ghi> (mã đề …)
nam: 2025
bo_sach: KNTT

## PHẦN 1 | Trắc nghiệm | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** …
A. …
B. …
C. …
D. …
**Hình:** p1c5_1.png
**Hình giải:** giai_cau12.png
**Ghi chú:** …
**Chưa chắc:** …

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …

**Bước 2.** …

**Bước 3.** …

**Chú ý:** …

**Phần 2. Trình bày**

…

Chọn A.
```

- `nam` = năm đầu của năm học. `bo_sach` = `KNTT` / `Cánh Diều` / `CTST` — đoán theo nội dung đề (mục "Kiến thức" dưới); không đoán được ⇒ `KNTT`.
  Đề không ghi tên trường ⇒ ghi theo phòng / huyện đề ghi (vd "Phòng GD&ĐT huyện Xuân Trường"). Tên đề: "giữa học kì 1".
- `## PHẦN <n> | <tên> | <trac_nghiem|tu_luan|tra_loi_ngan>` — theo các phần của đề, đánh số từ 1.
- `### <nhãn gốc của đề: Câu 3 / Bài 2a> | kho=dai|hinh_hoc | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Hình giải:**`, `**Ghi chú:**`, `**Chưa chắc:**`
  là tuỳ chọn, mỗi loại một dòng, đứng SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn đề (đã sửa lỗi in), mọi công thức trong `$…$`. Đề nhiều dòng thì xuống dòng đơn. Bỏ phần "(1,0 điểm)".
- **Phần 1 — khuôn CARD, bắt buộc đúng từng chữ:** đoạn `**Phần 1. Hướng dẫn**` → đoạn `**Mấu chốt:** …` (một câu: điều phải nhận ra) →
  **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn đoạn `**Chú ý:** …` và / hoặc `Thử lại: …`. Các đoạn cách nhau MỘT dòng trống;
  trong một bước không có dòng trống. Mỗi bước là một **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ít nhất 5 chữ ngoài công thức, **không ghi
  đáp số cuối**, không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …", tổng vẫn 3–6 bước.
- **⭐ Phần 1 của bài HÌNH CHỨNG MINH — viết theo chiều PHÂN TÍCH ĐI LÊN** (k8.md §1.6): mỗi bước đi từ điều phải chứng minh lùi về điều đã có:
  "Muốn có X, cần Y (vì dấu hiệu / tính chất nào)" → "Y có được từ Z (giả thiết / câu a)". Phần 2 trình bày **ngược lại**, từ giả thiết tới kết luận,
  mỗi mắt xích của Phần 1 ứng với một bước trình bày. Xem Câu 11, Câu 12 của đề mẫu. Bài hình TÍNH (góc, độ dài) thì Phần 1 viết như bài Đại.
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra. Mỗi dòng viết / mỗi phép tính một đoạn (cách nhau dòng trống). Bài tính / rút gọn mở bằng dòng
  chép lại biểu thức, mỗi bước biến đổi một dòng `$=\dots$`. Tìm $x$: mỗi phép biến đổi một dòng, kết `Vậy $x=\dots$`. Chứng minh hình: mỗi khẳng định kèm lí do
  ("Vì … nên …", "(dấu hiệu nhận biết)", "(câu a)"); hai tam giác bằng nhau viết khuôn "Xét $\triangle…$ và $\triangle…$ có:" → mỗi điều kiện một dòng → "Do đó … (c.g.c)".
  Câu trắc nghiệm: dòng cuối cùng của lời giải phải đúng là `Chọn X.` (X trùng `dap_an`).
- **Định dạng (khác khối 6):** dấu nhân tường minh là **`\cdot`** (`$4 \cdot 90^\circ$`, `$3xyz \cdot y$`, `$A \cdot B$`) — **CẤM `\times` và CẤM dấu chấm làm dấu nhân**;
  hệ số với biến, biến với biến, ngoặc với ngoặc viết liền (`$3x$`, `$(x+1)(x-2)$`) · chia `:` · phân số `\dfrac` · số thập phân dấu phẩy `2{,}5`
  · luỹ thừa của số âm / phân số có ngoặc · `\widehat{ABC}`, `\triangle ABC`, `\parallel` (không `//`), `\perp`, `^\circ`, `\Rightarrow` · chữ tiếng Việt trong
  công thức phải bọc `\text{…}` · đơn vị `(cm)`, `($cm^2$)`.
- **Kiến thức (luật quan trọng nhất của khối 8 — k8.md §1 và §10):** lời giải chỉ dùng kiến thức **học tới thời điểm giữa học kì 1 theo bộ sách của chính đề đó**.
  Cách xác định: nhìn TOÀN BỘ đề xem đề chạm tới đâu. Đề KNTT thường gồm Chương I (đơn thức, đa thức, phép tính) + một phần Chương II (hằng đẳng thức; có đề
  tới phân tích nhân tử) + Chương III (tứ giác, hình thang cân, hình bình hành; có đề tới hình chữ nhật, thoi, vuông). Đề có định lí Pythagore, hình chóp,
  phân thức ⇒ đề của bộ sách khác (CTST / Cánh Diều) — vẫn giải, dùng đúng các kiến thức ĐỀ ĐÓ kiểm tra.
  **CẤM dùng (dù làm lời giải ngắn hơn) những thứ đề không chạm tới và học sau giữa kì 1:** đường trung bình của tam giác / hình thang, định lí Thalès,
  tam giác đồng dạng, tỉ số lượng giác, phương trình bậc nhất dạng "tập nghiệm $S=\{…\}$", **định lí Pythagore nếu đề không có câu nào về Pythagore**,
  hằng đẳng thức / phân tích nhân tử nếu cả đề không có câu nào về chúng. Hình chữ nhật, thoi, vuông và "trung tuyến ứng với cạnh huyền" chỉ dùng khi đề có
  hỏi tới hình chữ nhật trở lên. Cần một kết quả chưa học ⇒ **tự chứng minh ngay trong lời giải** bằng cái đã học (vd đoạn nối hai trung điểm: chứng minh
  qua hình bình hành / tam giác bằng nhau). Không làm được ⇒ `**Chưa chắc:**` nói rõ, KHÔNG dùng công cụ cấm.
  Tìm $x$: biến đổi từng dòng bằng quy tắc chuyển vế (lớp 7), tích bằng 0 thì một thừa số bằng 0 — được; không viết "phương trình", "tập nghiệm".
  **Ranh giới "phân tích nhân tử":** đặt thừa số chung theo **tính chất phân phối** ($ab+ac=a(b+c)$, vd $9ab+6a+3b=3(3ab+2a+b)$, $-2ax-2bx=-2x(a+b)$)
  là kiến thức lớp 6–7, **luôn được dùng**. Cái bị cấm khi đề chưa chạm tới là các PHƯƠNG PHÁP phân tích nhân tử của Chương II: dùng hằng đẳng thức,
  nhóm hạng tử, tách hạng tử, thêm bớt.

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B010/<MA>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật (đọc kĩ)

- Số mũ, dấu âm trước số, dấu gạch ngang, chỉ số nhỏ ở ảnh 150 dpi (nhất là đề scan): không chắc ⇒ phóng to 300 dpi, không đoán.
- Lời giải Hình ngầm dùng **đường trung bình** mà không gọi tên ("$NP\parallel BC$ vì $N$, $P$ là trung điểm") — vẫn là dùng kiến thức cấm. Phải tự chứng minh.
- **Bài mà dữ kiện đúng là bài đường trung bình** (đo khoảng cách qua hai trung điểm $D$, $E$; đã gặp ở GKI-17, GKI-21): đường trung bình vẫn CẤM ở mọi đề
  giữa kì 1 ⇒ tự chứng minh bằng hình bình hành (lấy điểm $F$ sao cho $E$ là trung điểm $DF$…), và thêm `**Chưa chắc:**` nói rõ "dữ kiện đúng là bài đường
  trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề này không".
- "Tứ giác có ba góc vuông là hình chữ nhật" KHÔNG phải dấu hiệu trong SGK ⇒ viết: tổng các góc của tứ giác bằng $360^\circ$ nên góc thứ tư cũng vuông,
  tứ giác có bốn góc vuông là hình chữ nhật.
- Đề thiếu điều kiện làm hình suy biến hoặc phép cộng góc sai chiều (vd thiếu $AB<AC$) ⇒ thêm điều kiện tối thiểu vào đề + `**Ghi chú:**`.
- App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định ở trên.
