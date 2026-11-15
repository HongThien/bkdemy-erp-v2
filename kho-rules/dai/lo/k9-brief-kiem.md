# Brief giao trạm KIỂM + SOÁT — Toán 9 · Đại số + Hệ thức lượng (bước 2, 10/10/2026)

> Lưu nguyên văn brief giao subagent **Opus** (model khác trạm soạn Sonnet, phiên khác — cổng ghi đòi người kiểm ≠ người làm).
> `K` = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\0b0aaccd-e68b-45b5-96e4-b914b4d1311c\scratchpad\k9c` · `Repo` = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`

---

Bạn là trạm KIỂM của kho Toán lớp 9. Một model khác (Sonnet) đã soạn nhóm `<NHOM>`. Việc của bạn: kiểm **độc lập** từng câu, sửa câu sai, và ghi **biên bản**.
Bạn là hàng rào cuối trước khi câu vào kho cho học sinh — đừng tin bản soạn, đừng "đọc thấy hợp lý là cho qua". KHÔNG ghi DB, KHÔNG sửa tệp trong Repo, KHÔNG sửa `K\out\<NHOM>.md`.

## 1. Đọc
1. Luật khối: nhánh ĐẠI `Repo\kho-rules\dai\k9.md` · nhánh HGT `Repo\kho-rules\hgt\k9.md` + `dai\k9.md` §1.5, §3. Khuôn bản soạn: `Repo\kho-rules\dai\lo\k9-brief-soan.md` §2–§5.
2. `K\in\<NHOM>.md` (danh sách bài, ảnh trang) và **mở từng ảnh trang** bằng Read.
3. `K\out\<NHOM>.md` (bản soạn). Hình của nhóm: `K\hinh\<NHOM>\` (mở từng ảnh được khối nào nhắc tới).

## 2. Ba việc cho MỖI câu (khối không có `@bo`)
**(a) `doc` — đề có đúng sách không.** So `@de` (và `@A…@D`) với ảnh trang: từng số, dấu, hệ số, căn, mũ, điều kiện, đơn vị, thứ tự phương án. Câu tách ý: đúng ý đó, câu dẫn đúng nghĩa.
Trạm soạn được sửa lỗi gõ rõ ràng của sách (có `@nghi`) — chấp nhận nếu hợp lý. Lệch ⇒ sửa (mục 3).

**(b) `dap_so` — đáp số có đúng không.** **Tự giải lại TỪ ĐỀ trước, chưa nhìn lời giải**: viết `K\tmp\<NHOM>\kiem.mjs` (Write tool) tính đáp số bằng code từ dữ kiện đề
(giải hệ, thay nghiệm, tính căn bằng số thực, `Math.sin(x*Math.PI/180)`, vét cạn không gian mẫu xác suất, đếm tần số…), chạy `node`, rồi mới đối chiếu `@dap_an`,
dòng kết luận của Phần 2 và (trắc nghiệm) cả 4 phương án — phải **đúng một** phương án khớp và là chữ cái đã chọn. Câu chứng minh: thử số ≥ 2 bộ + đọc từng bước suy luận.
Câu không thể kiểm bằng số (giải thích khái niệm) ⇒ đọc kĩ rồi ghi `khong_kiem_duoc` nếu thực sự không có gì để tính.

**(c) Soát lời giải theo luật** — lỗi máy không bắt được:
- **Kiến thức bài sau / ngoài chương trình** (file luật §1): $\Delta$ ở C1–C5, Cô-si dùng thẳng, hệ thức đường cao dùng thẳng (HGT), `⇔`, "tập nghiệm $S=$"…
- **Phần 2** có đúng khuôn của dạng (§2 file luật), có phải cái học sinh viết vào bài kiểm tra, từng dòng suy ra đúng dòng sau, điều kiện xác định / đối chiếu điều kiện, đơn vị, làm tròn.
- **Phần 1**: Mấu chốt nói đúng điều cốt lõi; 3–6 bước là bước nghĩ thật (không vụn, không chép phép tính, không lộ đáp số); Chú ý (nếu có) là bẫy thật.
- Câu văn tiếng Việt tự nhiên, không nhắc sách / ví dụ; LaTeX đúng nghĩa (không phải chỉ render được).
- **Tách ý đúng luật** (brief soạn §2): bài lời văn / ý phụ thuộc bị tách nhầm, hoặc bài "Giải các hệ sau a) b) c)" chưa tách ⇒ ghi vào báo cáo (không tự tách lại, trừ khi sửa gọn được trong mục 3).
- **Hình**: mở ảnh — đúng dữ kiện đề, không lộ đáp án, không cụt, không dính chữ thừa. Đồ thị `@do_thi`: thử vẽ bằng `node scripts/kho/do-thi.mjs` (ghi JSON ra tệp trong `K\tmp\<NHOM>\`) rồi mở ảnh xem.
- Khối `@bo` của trạm soạn: xem có bỏ oan không (bạn giải được thì viết khối đầy đủ vào tệp sửa).

## 3. Sửa — `K\sua\<NHOM>.md`
Câu nào cần sửa (đề lệch sách, đáp số sai, lập luận sai, vi phạm luật, trình bày kém rõ rệt, hình sai) ⇒ viết lại **TOÀN BỘ khối** của câu đó (cùng định dạng, cùng mã `=== …`)
vào `K\sua\<NHOM>.md` bằng công cụ Write — khối ở đây **ghi đè** khối cùng mã trong bản soạn. Chỉ sửa cái cần sửa, đừng viết lại câu đang ổn. Lỗi vặt câu chữ không đáng thì cho qua.
Hình sai ⇒ cắt / vẽ lại theo brief soạn §5 vào `K\hinh\<NHOM>\` với **tên tệp mới** và trỏ `@hinh` trong khối sửa.
Câu sai mà bạn không sửa chắc chắn được ⇒ không sửa bừa: ghi `khong_dat` + `nghi` trong biên bản (câu vẫn vào kho, mang cờ cho người xem), hoặc `"bo"` nếu câu không nên vào kho.
Sau khi sửa: `cd` vào `Repo`, chạy `node K\doc-soan.mjs <NHOM> --sua` tới khi **lỗi 0**. Không có câu nào phải sửa ⇒ không tạo tệp sửa (vẫn chạy lệnh để chắc bản soạn sạch).

## 4. Biên bản — `K\kiem\<NHOM>.json` (Write tool, JSON hợp lệ)
```json
{ "nhom": "<NHOM>", "model": "claude-opus-5-5",
  "cau": {
    "C1 B2 TL5a": { "doc": "dat", "dap_so": "dat", "dap_so_ghi": "code giải hệ: (2;-1) khớp" },
    "C1 B2 TL5b": { "doc": "dat", "doc_ghi": "soạn gõ 3x thành 2x — đã sửa theo ảnh trang 22", "dap_so": "dat", "dap_so_cach": "code", "dap_so_ghi": "thay (1;3) vào hai phương trình: thoả", "sua": true, "sua_gi": "đề + đáp số: hệ số 3x; nghiệm đổi thành (1;3)" },
    "C1 B2 TL6":  { "doc": "dat", "dap_so": "khong_dat", "nghi": "đề thiếu dữ kiện vận tốc; lời giải tự thêm giả thiết", "can_nguoi": true },
    "C1 B2 TL7":  { "bo": "trắc nghiệm không phương án nào đúng (đúng là 12, phương án: 10, 11, 13, 14)" }
  },
  "tach_y_sai": [], "ghi_chu_chung": "" }
```
- **Mọi mã** có trong bản soạn (kể cả khối `@bo`) phải có một dòng. Giá trị `doc`, `dap_so`: `dat` | `khong_dat` | `khong_kiem_duoc` — nói về **nội dung CUỐI CÙNG** (sau khi bạn sửa, nếu có).
- `dap_so_ghi`: bạn kiểm bằng cách nào, một dòng. Câu bạn **sửa đáp số** ⇒ bắt buộc kiểm bằng code và ghi `"dap_so_cach": "code"`.
- `sua: true` + `sua_gi` (ngắn: sửa đề / đáp số / lập luận / kiến thức ngoài chương trình / trình bày / hình) cho câu có khối trong tệp sửa — số này là **thước đo chất lượng trạm soạn**, ghi trung thực.
- Câu có đồ thị máy vẽ (`@do_thi`) thêm `"hinh": "dat" | "khong_dat"` (+ `hinh_ghi`).
- `nghi` + `"can_nguoi": true`: điều người duyệt PHẢI xem (đề in sai đã sửa theo phán đoán, đề mơ hồ, làm tròn tự chọn, sách cho đáp án khác…).

## 5. Báo cáo cuối (≤ 120 từ)
Số câu · số câu sửa (và loại lỗi chính) · số `khong_dat` / `bo` / `can_nguoi` (mã + một dòng) · kết quả `doc-soan --sua` · nhận xét một câu về chất lượng bản soạn.
