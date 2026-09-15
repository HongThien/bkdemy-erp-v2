# Cầu nối — "Trắc nghiệm 1 phần" = triển khai Phase 2 (Đại) của `spec-dien-o.md`

> Viết 12/09/2026 cho context MỚI mà Thùy sẽ mở riêng để làm việc này (tách khỏi context `form-tn` — context
> đó đi tiếp khối 8-9, chuyên "đưa câu về trắc nghiệm 4 đáp án"). Đọc file này XONG rồi đọc `spec-dien-o.md`
> TOÀN BỘ trước khi code — đây KHÔNG phải spec mới, chỉ là bản đồ nối "trắc nghiệm 1 phần" ↔ spec đã chốt.

---

## 0. Sự thật quan trọng nhất: kiến trúc ĐÃ CHỐT, CHƯA XÂY

**"Trắc nghiệm 1 phần" không phải khái niệm mới cần thiết kế từ đầu.** CEO đã chốt spec này từ **09/09/2026**
trong `spec-dien-o.md` ("Form ĐIỀN Ô"), với đúng ý tưởng: 1 câu tự luận nhiều bước → lời giải chi tiết bỏ
trống 2-3 ô, mỗi ô 4 phương án. Cách sinh 4 phương án cho ô loại **"Giá trị"/"Biểu thức sau chuyển vế"**
(§1 của spec đó) = **dùng LẠI NGUYÊN bảng rule lỗi `dai_mcq_rule` (R01–R84)** đã xây cho form Trắc Nghiệm —
áp rule lỗi lên đúng BIỂU THỨC CON ở bước đó, **100% máy, không cần AI**. Đây chính là hình thức 2 luồng
(4-đáp-án nguyên câu / từng-phần-theo-bước) dùng CHUNG 1 kho rule, không phải 2 hệ thống tách biệt.

**Việc CHƯA làm** (đọc `spec-dien-o.md` §8 "Lộ trình" D1/D2):
- `scripts/mcq-dien.mjs` — **chưa tồn tại**. Cần viết theo khuôn `scripts/mcq-sinh.mjs`/`mcq-auto.mjs`
  (`--list --dang X --out lo.json` → sinh ô + phương án → `--verify` → `--ghi`), tái dùng thẳng các hàm parse
  AST (`parse`, `mathOf`, `ev`, `solve`, `evalRule`, `canonOf`) đã export từ `mcq-auto.mjs`.
- Bảng `dai_cau_form_dien` — **chưa có trong DB** (chỉ có `hinh_form_dien`, bảng SONG SONG nhưng dành riêng
  cho Hình chứng minh, khoá theo `cach_giai_id`/`bien_the_id` chứ không phải `ma_cau` — KHÔNG dùng chung
  bảng đó cho Đại, phải tạo bảng mới đúng theo DDL mẫu ở `spec-dien-o.md` §3).
- `fn_dien_cham(p_key jsonb, p_hs jsonb)` — **ĐÃ CÓ SẴN** trong DB (dùng chung cho mọi kho, kể cả Hình) —
  không cần viết lại, chỉ cần gọi đúng.
- Tab "Điền ô AI" (duyệt) — khung UI đã có (`TracNghiemAiTab.tsx`-style, xem `spec-dien-o.md` §5) nhưng
  route dữ liệu Đại (`dai_cau_form_dien`) chưa nối vào — kiểm lại trước khi giả định UI đã sẵn sàng.

**Có thể tham khảo trực tiếp code đã chạy:**
- `scripts/hinh-dien.mjs` — pipeline Điền Ô cho HÌNH chứng minh, ĐÃ pilot 23 form khối 7 (CEO duyệt hết).
  Không dùng thẳng được cho Đại (khác cách khoá dữ liệu + khác loại ô: "lý do" cần AI đề xuất, không phải
  "giá trị" tính máy) nhưng đáng đọc để thấy khuôn CLI/verify/ghi đã chạy thật trông như thế nào.
- `scripts/_do_dien_o.mjs` — script ĐO đã chạy 09/09 trên 491 câu lớp 7 (61% dòng đọc được, 140 câu có ô) —
  đọc trước khi viết `mcq-dien.mjs`, có thể tái dùng logic tách bước theo `=`.

---

## 1. Hàng đợi dạng đang chờ (khảo sát tới 12/09 — sẽ còn tăng khi khảo sát thêm)

Các dạng sau đã được xác nhận **KHÔNG hợp khuôn "4 đáp án nguyên câu"** (đáp số không phải 1 giá trị/tập rõ
ràng, hoặc cần nhiều bước lập luận) trong lúc làm việc ở context `form-tn`. Đây là ĐIỂM BẮT ĐẦU gợi ý, không
phải danh sách đóng — vẫn còn nhiều dạng khối 6/7 khác (và toàn bộ khối 8-12) chưa khảo sát.

| Khối | Mã dạng | Tên | Số câu | Vì sao rơi vào nhóm này | Có vẻ hợp ô loại |
|---|---|---|---|---|---|
| 6 | T106030401 | Tìm n để an+b ⋮ cn+d | 139 | 9 khuôn đại số khác nhau, cần biến đổi nhiều bước (nhân chéo, quy về N⋮(cn+d)) trước khi ra tập nghiệm | **Giá trị** (máy) — lời giải có chuỗi `=` rõ |
| 6 | T106020601 | Dãy luỹ thừa cơ số (tổng hình học) | 44 | Trộn ≥3 kiểu đáp số (công thức đóng / tổng đan dấu / giải ngược ra số mũ) trong cùng `dang_chinh` | **Giá trị** (máy) — lời giải kiểu `3B=..., 3B-B=..., 2B=..., B=...` cực khớp mẫu tách-bước-theo-`=` |
| 6 | T106030102 | Tính chất chia hết tổng/hiệu/tích | 67 | Đáp số kho là "Có"/"Không" (chứng minh Đúng-Sai), không phải giá trị | Có thể cần ô **"lý do"** (như Hình) thay vì "giá trị" — CẦN ĐỌC LỜI GIẢI KỸ trước, có thể không hợp Điền Ô kiểu máy |
| 6 | T106030403 | Chia hết dãy tổng luỹ thừa | 26 | Cùng lý do T106030102 | Cùng ghi chú T106030102 |
| 6 | T106020304 | Toán thực tế (cộng trừ nhân chia) | 39 | Bài toán ngữ cảnh nhiều bước, không phải 1 phép tính | **Giá trị** (máy), nếu lời giải kho đã viết đúng khuôn `=` |
| 7 | T107010205 | Toán thực tế liên quan số hữu tỉ | 66 | Cùng lý do T106020304 | Cùng ghi chú T106020304 |
| 7 | 077022220401 | GTLN-GTNN ứng dụng Căn bậc hai + GTTĐ | 87 | Nhiều bước biến đổi để tìm GTLN/GTNN, không phải 1 phép tính | **Giá trị** (máy), engine đã có sẵn hàm xử lý √/\|…\| (mcq-auto.mjs) nên tách bước nên thuận lợi |
| 7 | 0770222204220402 | Tính giá trị biểu thức ứng dụng GTLN-GTNN | 27 | Cùng lý do 077022220401 | Cùng ghi chú 077022220401 |
| 7 | T107010501–508 | Nhóm "Dãy phân số" (hiệu tích, đổi tử/mẫu, mẫu liên tiếp, luỹ thừa…) | ~120 (7 mã dạng con) | **CHƯA khảo sát kỹ** — nghi có nhiều bước biến đổi (kiểu "tách 1/(n(n+1)) = 1/n − 1/(n+1)") nên nhiều khả năng cũng rơi vào nhóm này, nhưng chưa đọc lời giải thật để xác nhận | Chưa xác định — khảo sát trước |

**Việc đầu tiên nên làm ở context mới**: chạy `scripts/_do_dien_o.mjs` (hoặc viết lại tương tự) nhắm riêng
vào các `dang_chinh` ở bảng trên để đo % câu có lời giải đúng khuôn `=` (đọc được) trước khi bắt tay viết
`mcq-dien.mjs` — đúng tinh thần "đo trước khi build" mà spec đã làm cho pool 1 (09/09: 61%/140 câu).

---

## 2. Quy ước CHUNG với luồng "4 đáp án" (bắt buộc đọc để tránh đụng độ)

- **Chung 1 bảng `dai_mcq_rule`.** Rule lỗi cho ô "Giá trị" dùng LẠI rule đã có (R01–R84) — không tạo rule
  trùng khái niệm. Nếu cần rule mới, `select max(ma) from dai_mcq_rule` trước khi đặt mã (2 context có thể
  chạy song song, xem `spec-mcq-quy-trinh-sinh.md` §0).
- **Không đụng `scripts/mcq-auto.mjs`/`mcq-sinh.mjs` nếu không cần** — `mcq-dien.mjs` nên là file MỚI, tái
  dùng các hàm `export` sẵn có (`parse`, `mathOf`, `ev`, `solve`, `evalRule`, `canonOf`, và các mini-solver
  trong `mini-dang.mjs`) thay vì sửa 2 file đó. Nếu BẮT BUỘC phải sửa (vd thêm 1 hàm dùng chung), đọc kỹ
  diff trước khi merge — 2 luồng cùng sửa 1 file dễ đụng độ.
- **Migration timestamp riêng** — không trùng giờ phút với migration bên luồng kia (rất khó xảy ra tự nhiên
  vì dùng giờ thật lúc chạy `new-migration.mjs`, nhưng nhắc để không tưởng nhầm "trùng file = an toàn").
- Đọc `spec-mcq-quy-trinh-sinh.md` mục 7 ("Bẫy kỹ thuật hay gặp") — các bẫy regex/`$…$`/rule-trùng-công-thức
  đã gặp ở luồng 4-đáp-án nhiều khả năng cũng gặp lại khi tách bước cho Điền Ô.

---

## 3. Tham chiếu

- `spec-dien-o.md` — SPEC GỐC, đọc TOÀN BỘ trước khi code (đặc biệt §0b phạm vi Phase 1 vs Phase 2, §1 định
  nghĩa ô bằng máy, §3 schema, §4 pipeline, §8 lộ trình D1-D4).
- `spec-mcq-quy-trinh-sinh.md` — quy trình chung (đọc lời giải trước, phân loại rõ-ràng/mơ-hồ, quy ước rule
  ID, bẫy kỹ thuật) — áp dụng chung cho cả 2 luồng.
- `scripts/hinh-dien.mjs` / `scripts/_do_dien_o.mjs` — code mẫu đã chạy thật (Hình + đo lường), tham khảo
  cấu trúc CLI/verify trước khi viết `mcq-dien.mjs`.
- `DEVLOG.md` (mục 11-12/09) — chi tiết từng lần phát hiện 1 dạng "không hợp 4 đáp án" trong quá trình làm
  ở context `form-tn`, kèm lý do cụ thể — đọc nếu cần hiểu SÂU hơn bảng ở mục 1.
