# spec-anh-kho.md — KHO TIẾNG ANH: nhập câu, luật vào kho, màn duyệt cho GV Anh

> **Trạng thái 02/10/2026:** bảng + bản đồ ĐÃ ở DB (mig `202610021156`). Trạm đọc tài liệu GV ĐÃ CÓ (`scripts/anh/doc_bai_tap_gv.py`).
> Đang chạy thử trạm kiểm trên Unit 1. Màn Kho cho GV Anh CHƯA làm. Bản đồ: `spec-anh-ban-do-k9.md`. Bối cảnh: `nghien-cuu-mon-anh.md`.
> ⚠ Môn Anh dựng theo cách giới dạy tiếng Anh chia, KHÔNG bê khuôn Toán (CEO 30/09). Chỉ dùng chung hạ tầng hệ thống (registry môn,
> nhãn `mon`, hợp đồng cột kho, cổng ghi "người làm ≠ người kiểm").

## 1. CEO chốt 02/10

1. Câu có đáp án **chắc chắn** ⇒ **đưa thẳng vào kho**. Câu **chưa chắc** ⇒ **chờ duyệt** như Toán.
2. **GV môn nào chỉ thấy câu của môn đó.** Hạ tầng đã có (`useMonScope` — GV/TA/học thuật theo `nhan_su_mon`; admin + team liên môn
   thấy hết). 5 GV đang có nhãn `'Tiếng Anh'`. Màn Kho chỉ cần nhận môn `'Tiếng Anh'` đúng nhãn này.
3. Research thêm nguồn đề (khảo sát/thi thử các trường, các phường) và tài liệu tốt — kết quả §5.

## 2. Luồng nhập

```
file Word bản GV ─► ① TRẠM ĐỌC (máy, code)        ─► câu + ngữ liệu + đáp án GV + cờ lỗi cấu trúc
                    ② BÊN A (AI, KHÔNG thấy đáp án) ─► tự làm câu · phương án đúng thứ 2? · điểm kiến thức · phạm vi
                    ③ BÊN B (AI, thấy đáp án)       ─► điểm kiến thức · phạm vi · nghi đáp án GV
                    ④ CỔNG (máy, code)               ─► CHẮC CHẮN → kho  |  CHƯA CHẮC → chờ duyệt (kèm lý do)  |  NGOÀI PHẠM VI → không nhập
```

- ① đọc **thẳng .docx**: đáp án = phương án tô màu (hoặc chữ cái ghi tại chỗ trống ở dạng điền câu); câu phát âm giữ `<u>…</u>`;
  biển báo lấy ảnh nhúng. Chỉ lấy câu TRẮC NGHIỆM; phần NGHE (để sau) và bài tự luận được ĐẾM, không lấy.
- ② và ③ là 2 lượt độc lập (không đọc file của nhau) — đúng luật "người làm ≠ người kiểm" (`spec-luong-kho.md`).
  ② không được xem đáp án ⇒ đáp án GV được một nhân chứng thứ hai xác nhận, không phải chép lại.

### 2.1 Luật CHẮC CHẮN (đưa thẳng vào kho) — đủ cả 5

| # | Điều kiện | Ai kiểm |
|---|---|---|
| 1 | Cấu trúc sạch: đúng 4 phương án, khác nhau, không rỗng, đúng 1 đáp án GV | ① máy |
| 2 | Bên A tự làm ra **đúng đáp án GV** | ② so ① |
| 3 | Bên A khẳng định **không có phương án thứ 2** chấp nhận được, đề không lỗi | ② |
| 4 | Bên A và B **độc lập chọn trùng 1 điểm kiến thức**, và điểm đó hợp với dạng đề (vd biển báo phải là ĐH-01). Cờ "chắc" tự khai của từng bên KHÔNG dùng (đo Unit 1: phần lớn ca lệch là A=B cùng mã nhưng tự khai "chưa chắc") | ② + ③ + máy |
| 5 | **Trong phạm vi** THCS (cả A và B) và B không nghi đáp án GV | ② + ③ |

- Đủ 5 ⇒ `da_duyet = true`, `duyet_nguon = 'ai'`, `kiem_may = 'khop'`, `kiem_may_boi = 'claude_code'`, `kiem_may_ghi` = tóm tắt.
- Thiếu bất kỳ điều nào ⇒ `da_duyet = false`, `kiem_may = 'nghi'`, `kiem_may_ghi` = LÝ DO cụ thể (vd "A thấy B cũng đúng").
  Điểm kiến thức chưa thống nhất ⇒ câu nằm ở **điểm chờ `E09000000`** + `dang_ai_de_xuat` = đề xuất; trigger chặn duyệt tới khi GV chọn điểm thật.
- Ngoài phạm vi (cả A và B cùng thấy) ⇒ **không nhập** (CEO/GV: phần này loại khỏi kho luyện thi vào 10), ghi vào báo cáo lô.
  Chỉ một bên thấy ⇒ nhập vào chờ duyệt để GV quyết.
- Hậu kiểm: câu "chắc chắn" vẫn có thể bị báo sai về sau ⇒ rút khỏi kho (cùng luật hậu kiểm `spec-luong-kho.md` §5.7).

### 2.2 Số đo trạm đọc (12 unit "BTBT Form 2025", 02/10)

- **1.969 câu trắc nghiệm** (phát âm 120 · trọng âm 118 · hoàn thành câu 778 · đồng/trái nghĩa 114 · biển báo 59 · điền thông báo 122 ·
  điền đoạn văn 194 · đọc hiểu 191 · điền câu vào đoạn 96 · nối câu 28 · câu gần nghĩa 110 · sắp xếp đoạn 39).
- **38 câu bị cờ lỗi cấu trúc** ⇒ chắc chắn vào chờ duyệt: 16 phương án trùng · 8 điền câu vào đoạn không ghi đáp án tại chỗ trống (Unit 7) ·
  còn lại là nhãn gõ sai (A–C–B–D, 2 nhãn C) hoặc thiếu tô màu.
- Bỏ qua: phần nghe (khoảng 10 dòng phương án mỗi unit) và bài tự luận.

## 3. Việc ở MÀN KHO để GV Anh duyệt (chưa làm — khảo sát 02/10)

Khoảng 8–9 file + 1–2 migration, ~300–500 dòng. Rủi ro lớn nhất: **nhiều chỗ chọn bảng lặng lẽ rơi về Toán** (TypeScript không báo).

- **DB (bắt buộc trước):**
  - `count_cau_by_dang` chỉ nhận danh sách bảng cố định ⇒ thêm `anh_cau_hoi` (không thì bản đồ Anh báo "Lỗi").
  - `fn_kho_hang_duyet` luôn `left join <tiền tố>_cum_bai` ⇒ Anh chưa có bảng cụm ⇒ phải bỏ join khi bảng không tồn tại.
  - `fn_kho_duyet_cau` bỏ qua sửa `lua_chon` ⇒ cho nhận `lua_chon` (môn Anh sửa phương án là việc thường).
  - **CEO dán SQL Editor:** `202610021200_anh_kho_sua_log_mon_check.sql` (bảng `kho_sua_log` thuộc `postgres`) — chưa chạy thì sửa nội dung câu Anh bị chặn.
- **TS:**
  - `src/lib/kho/api.ts`: `KhoMon` + `khoTbls` + `NHANH_LABEL` + `KHO_TIEN_TO`/`RE_TIEN_TO` (thêm `E`) + `BAN_DO_OF` + `KHO_MON` + bộ hàm `listAnhMap`…
  - `branches.ts` (`anhBranch`: Mảng / Chuyên đề / Điểm kiến thức).
  - `KhoScreen.tsx` (tab `'Tiếng Anh'`, `readMon`; vá lỗi :104 thanh công cụ mất khi tab='mcq').
  - `BanDo.tsx`, `DangHub.tsx` (ẩn Clone/Nhập AI/Đúng-Sai vì viết cho Toán; đưa "chỉ câu chưa duyệt" ra ngoài khối cụm).
  - `DuyetLoiGiaiScreen.tsx` + `DuyetCauTab.tsx` (tab riêng cho Anh, không có "chưa có lời giải"/"đúng-sai"/"trắc nghiệm AI").
  - `lib/tailieu.ts` `khoCuaMon` (bộ chọn điểm kiến thức đang rơi về bản đồ Toán).
- **Hiển thị:**
  - Khối **NGỮ LIỆU** (đoạn văn/thông báo/ảnh biển báo) phía trên đề — component mới `NguLieuBlock` trong `ui.tsx`.
  - `MathText` đang: escape mọi `<…>` (nên `<u>` hiện nguyên chữ) · tự in đậm từ VIẾT HOA ("NOT", "TV") · hiểu `$5 and $10` thành công thức.
    ⇒ thêm chế độ `plain` (tắt công thức + tự in đậm, cho phép riêng `<u>`), **mặc định TẮT** vì `MathText` dùng khắp app.
- Điểm chờ `E09000000` bị ẩn khỏi cây (bản đồ lọc mã `…000000`) ⇒ câu chờ điểm kiến thức chỉ thấy ở màn Duyệt kho.
- Khối mặc định của màn Kho = 8 ⇒ Anh (chỉ K9) mở ra trống — mặc định theo môn.

## 4. App học sinh (pha sau)

- 16 hàm DB còn "không phải KHTN thì là Toán" (tu_luyen, htd_*, hs_dang_evals, đề thi, trợ lý, giải bài…) ⇒ vá hết rồi mới mở
  `_kho_co_mon('Tiếng Anh')`. Mở sớm = app HS lớp Anh rơi vào kho Toán.
- `_kho_snapshot_cau` chưa mang ngữ liệu sang bài làm ⇒ phải chụp kèm đoạn văn/ảnh để app hiện cả cụm (không xáo — giấy = app).
- Đọc `spec-v1-app-hs.md` + `design/STYLE-HS.md` trước khi đụng app HS.

## 5. Nguồn tài liệu để nhập tiếp (research 02/10 — chi tiết: scratchpad `web/nguon_de_anh9.md`, chưa tải file nào)

- **Quy mô ước:** khoảng 220–350 đề theo cấu trúc mới, gồm 70–100 đề thật của trường/phường (sau khi bỏ trùng) và 150–250 đề GV biên soạn.
  Tức 9.000–14.000 câu thô ⇒ ước **5.000–8.000 câu dùng được** sau khi lọc form cũ, bỏ trùng, kiểm đáp án.
- **Nguồn ưu tiên** (đều phải CEO duyệt trước khi tải/mua):

| # | Nguồn | Có gì | Chi phí |
|---|---|---|---|
| 1 | Thư Viện Học Liệu | khoảng 115 đề Hà Nội, Word, có đáp án | miễn phí |
| 2 | VnDoc | nhiều đề THẬT nhất: khoảng 50 đề phường/trường 2024–26, Word, có đáp án | Pro 79k/tháng (30 lượt) |
| 3 | VietJack | 18 đề thật 2026, chữ web | đáp án qua thi online hoặc bộ Word 400–450k |
| 4 | LoiGiaiHay | 17 đề tham khảo, có lời giải | miễn phí |
| 5 | Tuyensinh247, VietNamNet | đề thật dạng ẢNH | miễn phí; phải OCR, kiểm tay phát âm/biển báo |
| 6 | yopo.vn | bộ 30/50 đề Word | 72–79k |
| 7 | Thư Viện Giảng Dạy | 25 đề có giải chi tiết | 299k — làm mẫu văn giải thích |

- Lý thuyết theo dạng đề Hà Nội: TAK12 (7 bài chiến lược).
- **Rủi ro:**
  - Đáp án đề thi thử chỉ là "tham khảo" ⇒ chính là lý do có bên A.
  - Cùng 1 đề đăng 2–4 trang ⇒ bỏ trùng theo ĐOẠN VĂN trước, rồi theo câu.
  - Đề "2024–25" vẫn có thể là form cũ ⇒ lọc theo dạng.
  - Gạch chân và ảnh mất khi OCR.
  - File Word sách lan trên mạng là bản lậu ⇒ không nhập.
- Mùa 2026–27 chưa có đề thi thử (thường ra tháng 1–5). Từ 7/2025 đề đứng tên PHƯỜNG thay quận.
