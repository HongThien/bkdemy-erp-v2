# spec-anh-kho.md — KHO TIẾNG ANH: nhập câu, luật vào kho, màn duyệt cho GV Anh

> **Trạng thái 02/10/2026 (tối):** bảng + bản đồ ở DB (mig `202610021156`). **Đã nhập đủ 12 unit** bài tập bổ trợ GV (Form 2025) qua
> trạm đọc → bên A → bên B → cổng — số liệu §2.3. Màn Kho + màn Duyệt kho cho GV Anh ĐÃ LÀM (chưa thử bằng phiên đăng nhập thật).
> Bản đồ: `spec-anh-ban-do-k9.md`. Bối cảnh: `nghien-cuu-mon-anh.md`.
> **Công cụ:** `scripts/anh/doc_bai_tap_gv.py` (trạm đọc) · `cong_ghi_anh.mjs` (cổng nhập lô) · `kiem_lai_anh.mjs` (kiểm lại câu đã có
> khi trạm đọc sửa nội dung) · `luat_chac_chan.mjs` (luật §2.1 — MỘT nguồn cho cả hai).
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

- **CEO 02/10 tối: "Các câu tiếng anh ko nghi ngờ m tự duyệt luôn. ko cần duyệt lại nữa."** ⇒ chỉ giữ cho GV khi có NGHI về ĐÁP ÁN:
  - "Đề lỗi" bên A ghi chỉ chặn khi lỗi **chạm đáp án** (đáp án viết sai, có thể không duy nhất, HS không làm được như đang hiện:
    phát âm thiếu gạch chân, đề thiếu chỗ trống, chú thích lộ nghĩa…). Lỗi chính tả/diễn đạt ở thân câu hay phương án nhiễu ⇒ duyệt, giữ
    ghi chú trong `kiem_may_ghi` để dọn chính tả sau. Từ lượt sau, bên A khai thêm cờ `de_loi_cham_dap_an` (true/false); kết quả cũ
    không có cờ ⇒ cổng vẫn chặn, người lọc tay (02/10: 125 ghi chú ⇒ 86 duyệt, 39 giữ).
  - Chỉ MỘT bên thấy ngoài phạm vi ⇒ ghi chú, không chặn.
  - A và B lệch điểm kiến thức ⇒ **bên C** gán nhãn thứ ba độc lập (thấy đáp án, không biết A/B chọn gì), đa số 2/3 ⇒ duyệt ở điểm đó;
    ba bên ba mã ⇒ để GV chọn. File `ra_C.json` trong thư mục kiểm — cổng và `kiem_lai_anh.mjs` tự đọc.
- Đủ 5 ⇒ `da_duyet = true`, `duyet_nguon = 'ai'`, `kiem_may = 'khop'`, `kiem_may_boi = 'claude_code'`, `kiem_may_ghi` = tóm tắt.
- Thiếu bất kỳ điều nào ⇒ `da_duyet = false`, `kiem_may = 'nghi'`, `kiem_may_ghi` = LÝ DO cụ thể (vd "A thấy B cũng đúng").
  Điểm kiến thức chưa thống nhất ⇒ câu nằm ở **điểm chờ `E09000000`** + `dang_ai_de_xuat` = đề xuất; trigger chặn duyệt tới khi GV chọn điểm thật.
- Ngoài phạm vi (cả A và B cùng thấy) ⇒ **không nhập** (CEO/GV: phần này loại khỏi kho luyện thi vào 10), ghi vào báo cáo lô.
  Chỉ một bên thấy ⇒ nhập vào chờ duyệt để GV quyết.
  **Ngoại lệ** — điểm "ngoài phạm vi" lại chính là điểm GV dạy trong unit (Unit 11: `suggest/recommend + S + V nguyên mẫu`, bỏ "should")
  ⇒ cổng chạy với `--ngoai-pham-vi-cho-duyet`: vào CHỜ DUYỆT kèm lý do, GV quyết. **Câu hỏi treo cho GV** (§6).
- **Bên A phải kiểm ĐÚNG nội dung đang ghi** (đề + phương án + đoạn văn, so vân tay). Trạm đọc sửa sau khi kiểm ⇒ câu về chờ duyệt;
  câu đã ở kho thì chạy lượt A+B mới trên riêng các câu đó rồi `kiem_lai_anh.mjs` (lên kho / giữ / HẠ về chờ duyệt).
  Lượt kiểm lại chỉ đụng dòng máy còn quản (chắc chắn do AI hoặc chờ duyệt do máy ghi) — người đã duyệt/sửa thì để nguyên.
- Câu trùng y hệt (dạng đề + đề + phương án + đoạn văn) trong lô hoặc với kho ⇒ không nhập.
- Hậu kiểm: câu "chắc chắn" vẫn có thể bị báo sai về sau ⇒ rút khỏi kho (cùng luật hậu kiểm `spec-luong-kho.md` §5.7).

### 2.2 Số đo trạm đọc (12 unit "BTBT Form 2025", 02/10)

- **1.968 câu trắc nghiệm** (phát âm 120 · trọng âm 118 · hoàn thành câu 778 · đồng/trái nghĩa 114 · biển báo 59 · điền thông báo 122 ·
  điền đoạn văn 194 · đọc hiểu 190 · điền câu vào đoạn 96 · nối câu 28 · câu gần nghĩa 110 · sắp xếp đoạn 39).
- **63 câu bị cờ lỗi cấu trúc** ⇒ chắc chắn vào chờ duyệt: 24 điền đoạn lệch chỗ trống (file gốc thiếu/thừa dòng) · 16 phương án trùng ·
  10 không đủ 4 phương án (nhãn gõ sai A–C–B–D, 2 nhãn C) · 8 điền câu vào đoạn không ghi đáp án tại chỗ trống (Unit 7) · 6 đề rỗng ·
  3 thiếu tô màu · 2 phương án rỗng.
- Trạm đọc đã vá 02/10 (mỗi lần vá đều so trước/sau CẢ 12 unit): điền từ lấy đúng SỐ chỗ trống trên dòng (không đếm vị trí) · bài đọc
  trong bảng · đoạn mở bài có "?"/":" · dòng ngắn của bài gạch đầu dòng · đề không "?" · **đầu bài đọc thứ 2 trong cùng bài tập**
  (tiêu đề/câu mở bài) · **gạch đầu dòng có "?" trong bài không phải đề** (từng đẻ câu giả U12-C125).
- Kiểm toàn vẹn sau ghi: mọi câu trong kho = đúng nội dung trạm đọc hiện tại (đề · phương án · đáp án · đoạn văn · tiêu đề) — chỉ lệch
  bài **U8-NL12** (5 câu, mã `EC002582..586`): trạm đọc vá sau cùng (câu kết "So why wait?…" + dòng nguồn dính vào đề C124). **Treo:** sau khi
  CEO dán `202610021200` ⇒ sửa đoạn + đề C124 trong DB, kiểm lại 5 câu (`kiem_lai_anh.mjs`). Sửa đề trước đó bị trigger `kho_sua_log` chặn.

### 2.3 Kết quả nhập 12 unit (02/10 tối, sau kiểm lại + áp luật CEO "không nghi thì tự duyệt")

| | Đã duyệt (trong kho) | Chờ GV — nghi đáp án | Chờ GV — chọn điểm kiến thức | Tổng |
|---|---|---|---|---|
| 12 unit | **1.672 (86,6%)** | 235 | 23 | **1.930** |

- Đường đi: cổng 1.430 → kiểm lại 131 câu chấm trên nội dung cũ (+76) → luật CEO "không nghi thì tự duyệt": 98 câu đáp án chắc chỉ vướng
  lỗi ngoài đáp án / phạm vi (lọc tay 125 ghi chú "đề lỗi", giữ 39 câu lỗi chạm đáp án) + 69 câu lệch điểm kiến thức được bên C phân xử 2/3.
- 23 câu chờ điểm: 17 câu ba bên ba mã (10 câu "câu gần nghĩa" U6 diễn đạt lại bằng từ vựng — A và C chọn ĐH-03 nhưng biến đổi câu
  không thuộc mảng Đọc hiểu ⇒ GV chọn) + 6 câu vừa lệch điểm vừa nghi đáp án.
- Không nhập: 34 câu A+B cùng thấy ngoài phạm vi (quá khứ hoàn thành, bị động… — trừ Unit 11, xem §2.1) · 4 câu trùng. (1.968 đọc = 1.930 + 38.)
- 192 ngữ liệu (đoạn văn/thông báo/biển báo) · 56 ảnh biển báo (bucket `kho-anh`).
- Soát tay ngẫu nhiên câu "chắc chắn": 18 + 15 (U1–4) · 12 (U5–6) · 14 (U7–8) · 16 (U9–12) — **75/75 đúng**.
- Lượt kiểm lại (131 câu bên A chấm trên nội dung cũ): 76 lên kho · 15 giữ · 2 hạ · 38 vẫn chờ.
- **Độ phủ lệch:** 91/100 điểm có câu chắc chắn, nhưng điểm NỀN lớp 6–8 gần như trống (hiện tại đơn, -s/-es, so sánh trạng từ, câu mệnh lệnh,
  V-ing làm chủ ngữ, từ vựng chủ đề lớp 6/7/8: 0–2 câu) — tài liệu GV bám 12 unit lớp 9, trong khi đề HN ~4/5 câu ngữ pháp rơi vào lớp 6–8
  (`spec-anh-ban-do-k9.md`). ⇒ nguồn kế tiếp phải là ĐỀ THI (§5), không phải thêm bài theo unit.
- Bỏ qua: phần nghe (khoảng 10 dòng phương án mỗi unit) và bài tự luận.

## 3. Việc ở MÀN KHO để GV Anh duyệt (khảo sát 02/10 — ĐÃ LÀM cùng ngày, trừ `fn_kho_duyet_cau` nhận `lua_chon` và SQL Editor `202610021200`)

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

## 4. App học sinh — ĐANG MỞ (02/10 chiều)

> **Đã làm:** mig `202610021403` (lọc kho chuẩn mọi môn · gỡ 7 chỗ rơi về Toán trên đường luyện tập · `bai_test_cau.ngu_lieu`) + app
> (`ChuMon`, `NguLieuHS`). **Còn:** mở cổng `_kho_co_mon('Tiếng Anh')` SAU khi deploy app HS (dựng từ định nghĩa đang chạy — xung đột với
> mig TSA 202610021415). Chưa làm (không chặn luyện tập): `_de_thi_kho` · `fn_giaibai_mon` · `_troly_ten_dang` · Thử thách/Rank (không có dòng
> `rank_cau_hinh` ⇒ "Thử thách chưa mở" như KHTN) · chip Đại/Hình ở Sổ tay · lớp Anh khối 5/7/8 thấy danh sách rỗng (kho mới có K9).

### (ghi chú cũ)

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

## 6. Câu hỏi treo cho GV Anh / CEO (02/10)

1. **Unit 11 — `suggest/recommend/advise + S + V nguyên mẫu` (bỏ "should")**: 10 câu (C039…C073). A+B coi là "thức giả định" ⇒ ngoài phạm vi;
   bản đồ ghi NP-18 = "that…should"; nhưng chính GV soạn vào bài Unit 11. Đang ở CHỜ DUYỆT dưới NP-18. GV chốt: trong phạm vi (⇒ duyệt
   10 câu, và luật phạm vi bỏ ca này) hay ngoài (⇒ bỏ khỏi kho)?
2. **Đáp án GV bị nghi sai** (cả bên A lẫn B, hoặc B nêu rõ lý do) — nằm ở chờ duyệt kèm lý do, GV sửa tại màn Duyệt kho. Ca rõ nhất:
   U9-C010 (intention /e/ ⇒ A, không phải D) · U8-C098 (biển "Free parking for customers" ⇒ C) · U6-C088 (đáp án ghi "You shouldn't watch
   your steps" — gõ nhầm) · U4-C100 (3 phương án, không có "most") · U11-C102/C103 (bộ phương án chỗ (1) và (2) bị tráo trong file gốc) ·
   U1-C138 (địa điểm tặng móc khoá: bài suy ra chợ gốm, GV chọn cửa hàng).
3. **92 câu chờ chọn điểm kiến thức** (điểm chờ `E09000000`, có đề xuất của máy) — chủ yếu ranh giới từ vựng unit ↔ collocation ↔ cụm động từ.
