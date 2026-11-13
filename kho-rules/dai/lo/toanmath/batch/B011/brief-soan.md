# ⚠️⚠️ BẢN ÁP DỤNG BATCH B011 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 8 TẢI TỪ TOANMATH (16 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief đã chạy thật cho bộ 40 đề **giữa** kì 1 Toán 8 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, cổng, cách phân kho / tách ý / loại câu,
khuôn 2 phần, hình giải, bẫy: GIỮ NGUYÊN. **Riêng LUẬT KIẾN THỨC thì THAY bằng mục "Phạm vi kiến thức cuối học kì 1" dưới đây** (brief gốc viết cho giữa kì).
Chỗ nào bên dưới ghi "giữa học kì 1" thì đọc là "cuối học kì 1". Những điểm khác:

- `<MA>` = `B011-NN` (01–16). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B011\ds-de.json` — mỗi đề có `don_vi` (trường/phòng),
  `nam` (năm đầu năm học), `de` (trang ĐỀ trong `goc.pdf`), `hd` (trang HƯỚNG DẪN CHẤM, rỗng nếu file không có), `tach` (đề lấy riêng từ file có nhiều mã).
- `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B011\<MA>` (đã có `goc.pdf`, `trang\p-N.png` 150 dpi, `img\`, `tam\`, `de.boc.json`).
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

---

# Brief giao trạm SOẠN — khối 8, bộ đề giữa kì 1 (40 đề, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). Khuôn chép từ `k6-brief-soan.md` (dây chuyền đề khối 6), đổi các chỗ riêng của khối 8.
> `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B011\<MA>`.
> Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k8-brief-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa học kì 1 Toán 8: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\toanmath\batch\B011\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

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
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B011/<MA>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem
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
