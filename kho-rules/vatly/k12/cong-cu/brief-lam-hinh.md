# Brief trạm LÀM HÌNH MINH HOẠ lý thuyết Vật lý 12 (KHÔNG ghi DB, KHÔNG upload)

Bối cảnh: lý thuyết bản đồ Vật lý 12 (chép từ sách "Nắm trọn kiến thức Vật lí 12" – Đỗ Ngọc Hà) chưa có hình. CEO chốt cách làm từng khối: **1 = cắt từ sách · 2 = ảnh thật trên mạng · 3 = vẽ lại bằng code**. Hình sẽ hiện trong app học sinh (khung hẹp ~360 px ngang, cao tối đa ~288 px) ⇒ hình phải GỌN, chữ to rõ.

Thư mục làm việc: `D = C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\vatly\k12\hinh-lt`. Chạy node TỪ GỐC REPO `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` (để import được `pg`, `puppeteer-core`, `@napi-rs/canvas`).
Danh sách việc của bạn: `D\viec-<TRAM>.json` — mỗi mục: `ma` (H001…), `tieu_de`, `noi_dung` (nguyên văn khối lý thuyết — hình phải minh hoạ ĐÚNG nội dung này), `so_hinh`, `hinh_sach` (hình trong sách: trang PDF, chú thích, chất lượng), `ly_do`.
Sách: Tập 1 `E:\BK ACADEMY\Vật Lý\VL12\841497160-EBOOK-NẮM-TRỌN-KIẾN-THỨC-MON-VẬT-LI-12-SGK-MỚI-TẬP-1-VẬT-LI-NHIỆT-VA-KHI-LI-TƯỞNG-THẦY-ĐỖ-NGỌC-HA-2 (1).pdf` (mục `phan` = p1) · Tập 2 `E:\BK ACADEMY\Vật Lý\VL12\Nắm Trọn Kiến Thức Môn Vật Lý 12 2026 - Tập 2 Từ Trường Và Vật Lý Hạt Nhân (Thầy Đỗ Ngọc Hà).pdf` (p2, p3). Xem trang bằng Read `pages`.

**Tên file ra:** `D\anh\<ma>.png` (1 hình) hoặc `<ma>_1.png`, `<ma>_2.png`… (nhiều hình). Không ghi file nào khác ngoài `D\anh\` và manifest của bạn.
**Manifest:** `D\lam-<TRAM>.json` = `[{ "ma":"H001", "file":"H001.png", "cach":1|2|3, "chu_thich":"câu chú thích ngắn tiếng Việt hiện dưới hình", "nguon":"…", "ghi":"…" }]`. Mục bỏ không làm ⇒ `{ "ma", "bo": "lý do" }`.

## Cách 1 — CẮT TỪ SÁCH (trạm CAT)
- `node kho-rules/vatly/k12/cong-cu/cat-anh.mjs trang <tap 1|2> <trang_pdf>` → dựng `D\trang\t<tap>-p<trang>.png` (200 dpi). Read file đó để nhìn.
- `node kho-rules/vatly/k12/cong-cu/cat-anh.mjs cat <tap> <trang_pdf> <x0> <y0> <x1> <y1> <ten>` — khung theo PHÂN SỐ 0..1 của trang. Cắt sát hình, GIỮ phần nhãn trong hình, BỎ chữ đoạn văn bên cạnh, BỎ dòng "Hình 1-2 …" của sách (chú thích ta tự ghi trong manifest), bỏ logo/watermark nếu cắt được.
- Read lại file đã cắt để kiểm: đủ hình, không lẹm, không dính chữ thừa. Sai thì cắt lại (cùng tên, ghi đè file của chính bạn).
- `nguon` = "Sách Tập X, trang PDF n, Hình a-b".

## Cách 2 — ẢNH THẬT TRÊN MẠNG (trạm WEB)
- CHỈ lấy ảnh **Wikimedia Commons** có giấy phép tự do (Public domain / CC0 / CC BY / CC BY-SA). Không lấy ảnh báo, shop, stock có bản quyền.
- Ảnh phải rõ, đúng chủ đề, độ phân giải ≥ 800 px cạnh dài; tải bản thu nhỏ ~1000–1200 px (URL dạng `https://upload.wikimedia.org/.../thumb/.../1200px-…`), không cần bản gốc chục MB.
- Tải bằng `curl -L -A "BKdemy-edu-image-fetch/1.0" -o "<D>\anh\<ma>.jpg" <url>` (đuôi đúng định dạng: .jpg/.png). Read lại ảnh để kiểm.
- `nguon` = URL trang Commons (File:…) + tác giả + giấy phép (bắt buộc đủ 3 thứ). Không tìm được ảnh tự do đạt chuẩn ⇒ `bo` kèm lý do (đừng lấy ảnh kém).

## Cách 3 — VẼ LẠI BẰNG CODE (trạm VE1…VE5)
- Viết MỘT tệp `D\ve\<TRAM>.mjs` vẽ mọi hình của bạn bằng SVG, xuất PNG 2x bằng `luu(dir, ten, w, h, svg)` hoặc `hinh(...)`+`xuatTat(dir)` của `scripts/anh/ve_hinh_lib.mjs` (import bằng đường dẫn tương đối từ tệp của bạn: `../../../../../scripts/anh/ve_hinh_lib.mjs`). Chạy: `node kho-rules/vatly/k12/hinh-lt/ve/<TRAM>.mjs`. Thư mục ra: `D\anh`.
- Có `hinh_sach` ⇒ Read trang sách đó trước, vẽ lại CÙNG Ý nhưng sạch, chuẩn. Không có ⇒ vẽ theo đúng `noi_dung`.
- **Đúng vật lí là bắt buộc** — kiểm từng hình: chiều đường sức (ra Bắc vào Nam), quy tắc nắm tay phải / bàn tay trái / bàn tay phải đúng chiều I–B–F, kí hiệu ⊙ (ra) ⊗ (vào), đồ thị đúng dạng hàm (đẳng nhiệt là hypebol, T₂ > T₁ nằm xa gốc hơn; sin/cos đúng pha; N = N₀·2^(−t/T) giảm mũ, sau T còn một nửa), tỉ lệ hợp lí. Không chắc một chi tiết vật lí ⇒ vẽ bản đơn giản không có chi tiết đó, ghi `ghi`.
- **Phong cách thống nhất (mọi trạm như nhau):** nền trắng; nét chính `#222` dày 2; đường sức từ/ điện trường `#2f5bd3`; dòng điện `#d33a2c`; lực `#1f7a4d`; vận tốc `#b35c00`; cực Bắc N đỏ `#d33a2c` / Nam S xanh `#2f5bd3` (chữ trắng trên khối màu); mặt cắt tô nhạt `#e6ecf5`; mũi tên tam giác đặc nhỏ gọn; font `Arial, sans-serif`, nhãn ≥ 18 px (sau khi hiện ở 360 px vẫn đọc được), chữ nghiêng cho đại lượng (B, I, F, v, p, V, T). Nhãn tiếng Việt ngắn. KHÔNG ghi tiêu đề trong hình (chú thích để trong manifest). Kích thước khung ≤ 560 × 420; nhiều ý ⇒ tách thành nhiều hình (`_1`, `_2`) thay vì nhồi.
- Read lại từng PNG để tự kiểm (đúng vật lí, không chữ đè, không bị cắt mép). Sai thì sửa code, chạy lại.
- `nguon` = "Vẽ lại theo Hình a-b sách Tập X tr.n" hoặc "Vẽ theo nội dung lý thuyết".

## Trả lời cuối (≤ 80 từ)
Số mục xong / bỏ (mã + lý do) · số file · chỗ không chắc về vật lí hoặc giấy phép.
