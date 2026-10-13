# Brief — VẼ LẠI HÌNH cho kho Hình học (thay ảnh cắt từ sách/tài liệu bằng hình vẽ bằng code)

> Thùy giao 13/10: *"Rất nhiều bài Hình trong kho là hình cắt từ sách ra. Đọc đề và vẽ lại toàn bộ các hình đó."*
> Bạn là một TRẠM VẼ. Bạn nhận một hoặc vài **gói việc**; mỗi gói có vài hình. Việc của bạn: viết code vẽ lại từng hình, dựng ra PNG, tự soát, báo cáo.
> Bạn KHÔNG đụng cơ sở dữ liệu, KHÔNG tải gì lên, KHÔNG sửa đề hay lời giải.

## 1. Đọc trước (theo thứ tự)

1. `scripts/anh/ve_hinh_lib.mjs` — đọc HẾT. Đây là bộ vẽ: dựng điểm (`ray`, `rot`, `mid`, `lerp`, `foot`, `inter`, `bisector`, `reflect`, `doiXung`, `ngoaiTiep`, `noiTiep`, `goc`), nét (`seg`, `segDash`, `lineExt`, `circle`, `arc`, `poly`, `fill`, `sector`), ký hiệu (`tick`, `angleMark`, `rightAngle`), chữ (`label` = tên điểm/tia, chữ nghiêng · `num` = số đo, chữ đứng · `bien` = ẩn số x, 2y · `angleText`/`angleBien` · `sideText` · `labelOut`), xuất (`hinh(ten, pts, body)` + `await xuatTat(dir)`).
2. `scripts/anh/ve_lai/HH00021-1.mjs` — tệp MẪU. Tệp của bạn viết y khuôn này.
3. `C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/<gói>/viec.md` — đề, đáp án, lời giải và **tên tệp ra** của từng hình.
4. Từng ảnh cũ ghi trong `viec.md` (mở bằng công cụ đọc ảnh). Ảnh cũ cho biết: có những điểm/tia/đường nào, nhãn gì, số đo nào ghi trên hình, ký hiệu nào (gạch bằng nhau, góc vuông, cung góc, góc đánh số 1-2-3-4).

## 2. Làm ra cái gì

- Mỗi gói một tệp: `scripts/anh/ve_lai/<gói>.mjs` (vd `scripts/anh/ve_lai/HH00023-1.mjs`), thư mục ra mặc định `C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/<gói>/moi`.
- Chạy `node scripts/anh/ve_lai/<gói>.mjs` (từ thư mục repo) ⇒ ra `<gói>/moi/<tên tệp ra>.png` cho MỌI hình trong gói. Tên phải đúng từng ký tự như `viec.md` ghi (kể cả `+`, `_de`, `_lg`).
- Rồi chạy `node scripts/anh/ve_lai_bang.mjs C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/<gói>` ⇒ `<gói>/bang-1.png`… (trái = ảnh cũ, phải = hình mới). **Mở từng bảng ra xem**, sửa tới khi đạt mục 3.

## 3. Luật vẽ (vi phạm = hình bị trả lại)

1. **Hình phải ĐÚNG dữ kiện đề — dựng, không ước mắt.** Đề/hình ghi góc 65° thì dựng tia bằng `ray`/`rot` đúng 65°; trung điểm dùng `mid`; vuông góc dùng `foot`; phân giác dùng `bisector`; song song = cùng véc-tơ chỉ phương; cân/đều/hình bình hành/chữ nhật dựng đúng. Không chép toạ độ đo bằng mắt từ ảnh cũ cho những thứ đề đã ràng buộc. Viết `console.assert(Math.abs(goc(...) - 65) < 0.5)` cho các số đo quan trọng.
   - Trường hợp số đo trên hình **không thể đồng thời đúng** (đề cố ý cho hình "không đúng tỉ lệ", hoặc ẩn `x`, `2x`, `x + 10°`): giải ra giá trị thật rồi dựng theo giá trị thật; chỉ khi đề vô nghiệm/mâu thuẫn mới vẽ áng chừng và **ghi vào báo cáo**.
2. **Giữ ĐỦ thông tin của ảnh cũ.** Câu "Cho hình vẽ…" sống nhờ hình: thiếu một số đo, một gạch bằng nhau, một ký hiệu góc vuông, một nhãn là hỏng câu. Mọi nhãn điểm, tên tia, số đo, ẩn (`x`, `?`), góc đánh số, ký hiệu bằng nhau/vuông góc/song song trên ảnh cũ đều phải có trên hình mới, đúng vị trí tương đối (điểm nào trên, dưới, trái, phải giữ như ảnh cũ để lời giải "tia Oz nằm giữa…" còn đúng).
3. **Không thêm thông tin.** Không vẽ sẵn điều phải chứng minh/đáp án (đề hỏi "tính góc B" thì không ghi số đo góc B; đề hỏi "cần thêm điều kiện gì" thì không đánh dấu điều kiện đó). Không thêm ký hiệu mà cả đề lẫn ảnh cũ không có. Riêng tệp `_lg` (hình lời giải) thì vẽ thêm đường phụ, điểm phụ mà lời giải dùng — như ảnh lời giải cũ.
4. **Đề và ảnh cũ vênh nhau** (ảnh ghi 60°, đề ghi 70°; ảnh đặt sai tên điểm…): vẽ theo ĐỀ, ghi vào báo cáo. Nếu không tự phân xử được bên nào đúng ⇒ KHÔNG vẽ hình đó, ghi vào báo cáo. Thà bỏ trống còn hơn vẽ sai.
5. **Ảnh cũ chứa nhiều hình con** (Hình 1, Hình 2… hoặc a, b, c): vẽ đủ các hình con trong MỘT tệp, xếp hàng ngang (nhiều quá thì 2 hàng), ghi chú thích "Hình 1" / "a)" bằng `num` dưới mỗi hình con. Ảnh cũ là 4 phương án A/B/C/D dạng hình thì cũng vậy, chú thích "A.", "B."…
6. **Phong cách thống nhất:** nét đen `#222` dày 2 (mặc định của `svgDoc`), nền trắng, tên điểm/tia chữ nghiêng (`label`), số đo/độ dài chữ đứng (`num`/`angleText`/`sideText`), chỉ tô xám nhạt (`sector`/`fill`) khi ảnh cũ có tô. Không màu, không lưới ô, không hoạ tiết. Điểm có tên thì có chấm `dot`; đầu mút tia (x, y, z…) không chấm.
   - Dấu phẩy trên: ký tự `′` (U+2032), vd `'x′'`. Chỉ số dưới: `'A<tspan dy="6" font-size="17">1</tspan>'`. Dấu độ: `°`. Mũ góc không cần (hình không ghi mũ).
   - Ảnh cũ là tranh minh hoạ thực tế (ngôi nhà, cái cây, cái thang…): vẽ sơ đồ hình học tối giản — vật thể thay bằng điểm + chữ đứng ghi tên (vd "Nhà An"), giữ đủ số đo. Nếu câu hỏi cần chính bức tranh (đếm vật, nhận dạng đồ vật) ⇒ không vẽ, ghi báo cáo.
7. **Khung hình GỌN — chữ phải đọc được trên điện thoại:** một hình đơn rộng **≤ 520px, cao ≤ 400px** (cạnh dài nhất của tam giác/tứ giác khoảng 260–380px); chỉ ảnh nhiều hình con mới được rộng tới 760px. `xuatTat` in cảnh báo ⚠ khi vượt 560 × 420 — gặp ⚠ thì THU NHỎ toạ độ (nhân mọi độ dài với một hệ số), không được lờ đi: app hiện hình trong khung hẹp, khung càng to chữ càng bé. Cỡ chữ giữ mặc định của thư viện (không tự hạ `size`). Ẩn số trên hình (x, y, 2x, x + 10°) viết bằng `bien`/`angleBien` (chữ cái nghiêng), số đo (65°, 5 cm) viết bằng `num`/`angleText`/`sideText`. Chữ không đè lên nét, không đè nhau, không cụt mép. Hai góc kề nhau cùng đánh dấu ⇒ hai bán kính khác nhau. Cung đánh dấu góc nhỏ (< 25°) ⇒ tăng bán kính để còn thấy.
8. **Phạm vi:** chỉ TẠO tệp `scripts/anh/ve_lai/<gói>.mjs` của gói mình. Không sửa `ve_hinh_lib.mjs` (cần hàm phụ thì viết ngay trong tệp gói), không sửa tệp nào khác trong repo, không chạy lệnh git, không đụng DB, không xoá gì.

## 3b. Gói phần LUYỆN (`BT-MH…` = bài toán · `BV-MH…` = biến thể) — đọc thêm khi nhận gói tên như vậy

Phần Luyện của kho Hình xếp theo **mô hình** (một cấu hình hình học, vd "Tam giác vuông có đường cao AH"); mỗi mô hình có một **chuỗi bài toán** nối nhau (bài sau dựng thêm điểm trên hình của bài trước), mỗi bài toán có thể có **biến thể** (cùng bài, đổi số hoặc đổi tên điểm). Ảnh cũ là ảnh chụp GeoGebra (điểm xanh) hoặc ảnh cắt từ tài liệu.

1. **Đề đầy đủ = "Giả thiết đầy đủ" + "Câu hỏi" trong `viec.md`.** Câu hỏi (`phat_bieu`) hay dựng thêm điểm ("Gọi I là trung điểm AC…", "Trên tia đối của tia AB lấy F sao cho…") — những điểm đó thuộc ĐỀ, phải vẽ. Mục "Bài đứng trước trong chuỗi" và "Lời giải" chỉ để hiểu hình; điểm phụ chỉ lời giải mới kẻ thì KHÔNG vẽ (trừ tệp `_lg`).
2. **Vẽ đúng những gì ảnh cũ có, theo đề của CHÍNH bài đó.** Ảnh cũ có điểm/đoạn nào thì hình mới có điểm/đoạn đó (dựng lại cho đúng đề); ảnh cũ không có điểm của bài sau thì không thêm. Ảnh cũ thiếu hẳn một điểm mà đề của chính bài này dựng ⇒ vẽ thêm cho đủ đề và **ghi báo cáo**. Ảnh cũ CÓ SẴN một đoạn/điểm mà đề không nhắc (thường là đường phụ của lời giải, hoặc điểm của bài sau trong chuỗi) ⇒ **GIỮ như ảnh cũ** và ghi báo cáo — việc này là vẽ lại, không phải biên tập lại hình; "không vẽ điểm phụ của lời giải" ở mục 1 chỉ áp cho thứ ảnh cũ KHÔNG có.
3. **Không đánh dấu thêm.** Ảnh GeoGebra thường không có gạch bằng nhau / cung góc / ô vuông góc: ảnh cũ không có thì hình mới cũng không có (riêng **ô vuông góc cho góc vuông đề cho sẵn** — "tam giác ABC vuông tại A", "AH ⊥ BC" trong giả thiết — thì vẽ). Không tự THÊM ký hiệu của điều phải chứng minh; nhưng thứ **ảnh cũ đã có** (cung ở hai góc cần so, đường nét đứt nối ba điểm cần chứng minh thẳng hàng, điểm/đoạn của bài sau trong chuỗi…) thì **giữ nguyên** — chỉ dựng lại cho đúng, không bỏ bớt.
4. **Hình trong cùng một mô hình phải nhất quán:** các bài cùng chuỗi dùng CHUNG một bộ điểm gốc (cùng tam giác ABC, cùng tỉ lệ) — viết một hàm dựng chung trong tệp gói rồi mỗi hình thêm điểm của mình; không để bài 1 tam giác nhọn, bài 2 tam giác tù. Hướng hình (đỉnh nào trên, dưới, trái, phải) giữ như ảnh cũ.
5. **Hình tổng quát không được "đặc biệt thêm":** đề cho tam giác thường thì đừng vẽ cân/vuông; tam giác vuông đừng vẽ vuông cân; hình bình hành đừng vẽ thành hình chữ nhật/thoi; `AB < AC` thì vẽ lệch hẳn. Đề cho số đo (góc 60°, `AB = 6, AC = 8`, `Â = 3D̂`) thì dựng đúng số/tỉ lệ đó (giải ra giá trị thật nếu cần), nhưng **không ghi lên hình** số đo mà ảnh cũ không ghi.
6. **Biến thể (`BV-…`):** vẽ theo ĐỀ CỦA BIẾN THỂ (tên điểm, số đo của biến thể), không theo bài gốc. Ảnh cũ của biến thể đôi khi chính là ảnh bài gốc (viec.md có dòng ⚠) nên tên điểm/số trên ảnh cũ có thể không khớp — theo đề, ghi báo cáo. Tên tệp ra của biến thể là một chuỗi uuid dài: **chép nguyên từ `viec.md`**, đừng gõ lại.
7. **"Cho hình vẽ" mà số đo chỉ có trên ảnh:** ảnh cũ là nguồn duy nhất của các số đo/nhãn đó ⇒ đọc kỹ ảnh, giữ đủ từng số, từng nhãn, từng ký hiệu (góc đánh số 1-2-3, ô vuông góc, dấu song song).

## 3c. Gói `MH-n` (hình CẤU HÌNH của mô hình) và `CG-n` (hình LỜI GIẢI của cách giải) — đọc thêm khi nhận gói tên như vậy

Hai kiểu hình còn lại của phần Luyện. Mọi luật mục 3 + 3b vẫn áp; thêm:

**Gói `MH-n`** (cột `hinh_mo_hinh.anh_cau_hinh`, tên tệp ra = mã mô hình, vd `MH.045`):
1. **Đề = "Giả thiết đầy đủ của mô hình"** trong `viec.md` (đã leo cây mô hình). Không có "câu hỏi". Hình này hiện ở trang của mô hình, và là hình mà các **bài toán không có ảnh riêng đang MƯỢN** (mục "Các bài toán đang MƯỢN hình này": hình không được mâu thuẫn với đề các bài đó — vd mô hình có điểm D, bài mượn nhắc điểm E thì ảnh cũ phải có E mới được vẽ E).
2. **Dùng CHUNG bộ điểm gốc với hình bài toán đã vẽ lại của CÙNG mô hình.** `viec.md` liệt kê các tệp `scripts/anh/ve_lai/BT-<MH>-*.mjs` đã vẽ: mở ra, chép hàm dựng chung (cùng tam giác/tứ giác, cùng tỉ lệ, cùng hướng, cùng cách đặt nhãn) sang tệp gói của bạn. Hình cấu hình của mô hình = hình ảnh cũ có gì vẽ nấy; đừng thêm điểm của bài toán nào không có trên ảnh cũ.
3. **Ảnh cũ có gì giữ nấy** (đường phụ, điểm của bài sau, nét đứt, cung/gạch bằng nhau, số đo ghi sẵn) — chỉ dựng lại cho đúng đề của mô hình; chỉ THÊM điểm khi giả thiết mô hình nêu tên mà ảnh thiếu, và ô vuông góc cho góc vuông giả thiết cho sẵn. Mọi thứ thêm hoặc khác ảnh cũ ghi vào báo cáo.
4. **Mô hình là hình TỔNG QUÁT** (tam giác thường, tứ giác thường…): không vẽ đặc biệt thêm; mô hình đặc biệt (cân, vuông, bình hành, thang cân) thì dựng đúng loại đó, không hơn. Số đo/độ dài ghi sẵn trên ảnh cũ thì giữ.
5. Một mô hình có hai tên điểm đề với ảnh vênh ⇒ theo đề, ghi báo cáo; không phân xử được ⇒ KHÔNG vẽ hình đó, báo cáo.

**Gói `CG-n`** (cột `hinh_cach_giai.anh_loi_giai`, tên tệp ra = uuid của cách giải): vẽ theo ĐỀ của bài toán + hướng của lời giải cách đó. Hình lời giải = hình đề + đường phụ/điểm phụ mà ảnh cũ có (luật "ảnh cũ có gì giữ nấy"). Dùng chung bộ điểm gốc với hình đề đã vẽ lại. Ảnh cũ là ảnh chụp bài giải viết tay (không phải hình hình học) ⇒ KHÔNG vẽ, báo cáo.

## 4. Báo cáo cuối (ngắn, đúng sự thật)

Một bảng, mỗi hình một dòng: `tên tệp` · **đạt** / **khác ảnh cũ có chủ ý** (nói rõ khác gì, vì sao) / **không vẽ** (vì sao). Sau bảng: mọi chỗ bạn nghi **đề hoặc lời giải trong kho sai** (mã câu + sai gì) — chỉ báo, không sửa. Đừng viết "đã kiểm tra kỹ" — người soát sẽ mở bảng đối chiếu ra xem từng hình.
