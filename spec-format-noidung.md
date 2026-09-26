# spec-format-noidung.md — Đóng khung nội dung lý thuyết (định lý · định nghĩa · tính chất · chú ý · phương pháp giải · ví dụ · nhận xét)

> ĐỌC trước khi đụng `LyThuyetModal` (src/screens/kho/BanDo.tsx) hoặc `LyThuyetBody`/PrintView.
> Trạng thái: **ĐÃ CODE + DEPLOY (24–26/09).** Thêm `##TC` (Tính chất) và đóng khung `##VD` ngày 26/09.
>
> **⭐ 26/09 — bug đã vá: KHÔNG PHẢI chỉ 1 chỗ render.** Ngoài `LyThuyetBody`
> (src/screens/tailieu/PrintView.tsx, dùng chung Đại/HGT/KHTN), nhánh **Hình** có `HinhPrintView.tsx`
> (src/screens/kho/hinh/) render "Lý thuyết mô hình" (`hp-box-lt`) BẰNG 1 ĐƯỜNG RIÊNG, gọi thẳng
> `<MathText>` KHÔNG qua parser — builder Hình vẫn hiện `##TC` trần cho tới khi vá (26/09, cùng
> lúc thêm `LT_CORE_CSS` vào CSS của `HinhPrintView.tsx` + `MTPrintView.tsx`, nơi tái dùng
> `MucsBlock` của Hình). **Trước khi coi 1 luồng "đã xong" phải grep `hp-box-lt`/`MathText` quanh
> chữ "Lý thuyết" trong TOÀN REPO, không chỉ sửa đúng 1 file rồi coi là đủ.**
>
> **Chưa vá (phát hiện thêm 26/09, ngoài phạm vi PDF nên chưa đụng):** app học sinh cũng render
> lý thuyết trực tiếp bằng `<MathText>` không qua parser — `src/screens/hocsinh/HocTuDau.tsx:230`
> và `src/screens/hocsinh/HocSinhApp.tsx:670`. HS sẽ thấy `##TC` trần nếu lý thuyết có kí hiệu mà
> app HS mở tới. Cần CEO xác nhận có muốn áp cùng chuẩn box này cho app HS không trước khi sửa
> (khác bundle Vercel, khác đối tượng xem — HS thấy khung "Chú ý"/"Định lý" có thể cần thiết kế
> responsive riêng, không bê nguyên CSS in ấn `LT_CORE_CSS` sang).
>
> **⭐ 26/09 — bỏ khung/nhãn "Lý thuyết · Ví dụ" bọc NGOÀI (CEO chốt, thấy 2 lớp lặp nhau:**
> nền xanh nhạt + nhãn "LÝ THUYẾT · VÍ DỤ" bọc ngoài, rồi bên trong lại có khung "Ví dụ" riêng
> của chính khối đó — thừa). Bỏ hẳn `<div className="pv-box-lt"><div className="pv-box-label">
> Lý thuyết · Ví dụ</div>...</div>` ở `DangBlock` (PrintView.tsx) và `<div className="hp-box-lt">
> <div className="hp-box-lt-t">Lý thuyết · {ten}</div>...</div>` ở `HinhPrintView.tsx` — giờ
> `LyThuyetBody`/các khối `##XX` render THẲNG trong thân card, không còn lớp bọc ngoài nào.
> Nền (nếu có) CHỈ nằm trong từng khung riêng (`pv-lt-chuy` nền cam nhạt...), không có nền
> chung nào phủ cả đoạn lý thuyết nữa. `LtBlock` (lý thuyết CẤP CHUYÊN ĐỀ, tiêu đề `<h2>` to)
> KHÔNG đụng — đó là tiêu đề mục lớn, khác bản chất với combo nhãn-lặp bị bỏ ở đây.
> **Verify:** chỉ `tsc` sạch, KHÔNG kịp click-through 1 tài liệu PDF thật (cần ghi dữ liệu test
> vào 1 dạng thật rồi dọn lại, tốn công hơn giá trị biên) — rủi ro thấp vì chỉ bỏ 2 lớp div bọc
> ngoài, không đổi logic bên trong `LyThuyetBlockView`/`LyThuyetBody` (đã verify nhiều lần).

## 0. Vấn đề

Nội dung lý thuyết của 1 dạng hiện là **1 chuỗi text phẳng** (cột `noi_dung: text` ở
`dai_dang_ly_thuyet` / `hgt_dang_ly_thuyet` / `khtn_dang_ly_thuyet` / `hinh_hoc_bai_ly_thuyet`
— cùng 1 shape cho cả 4 môn). Soạn qua `<textarea>` thô trong `LyThuyetModal`
(src/screens/kho/BanDo.tsx:518-705), không dùng RichMath, không có JSON/block nào.
Khi ghép ra PDF, `LyThuyetBody` (src/screens/tailieu/PrintView.tsx:577-590) chỉ lo
**ngắt trang** (né mồ côi dòng cuối) — không hiểu ngữ nghĩa "đây là định lý/chú ý".

Cần: **7 loại khối** — định lý, định nghĩa, tính chất, chú ý, phương pháp giải, ví dụ,
nhận xét — đúng cấu trúc chuẩn 1 dạng toán hay có trong sách/tài liệu (lý thuyết →
phương pháp giải → ví dụ → nhận xét). KHÔNG đổi cách soạn (vẫn gõ text liền mạch trong
textarea đó), KHÔNG cần UI chọn block riêng (không có màn "build tài liệu thủ công" —
tài liệu do hệ tự ghép từ kho). Hình vẽ KHÔNG thuộc phạm vi file này — xem §5.

## 1. Cú pháp đánh dấu — kí hiệu đầu dòng, kiểu admonition (MkDocs/Docusaurus)

Người soạn gõ như cũ, chỉ thêm 1 dòng kí hiệu NGAY TRƯỚC đoạn muốn đóng khung:

```
##ĐL Định lý 1 — Công thức nghiệm
Nếu Δ = b² − 4ac ≥ 0 thì phương trình có nghiệm x = (−b ± √Δ) / 2a.

##ĐN Định nghĩa 1
Phương trình bậc hai một ẩn là phương trình có dạng ax² + bx + c = 0...

##TC Tính chất giao hoán
Nếu a = b thì a + c = b + c với mọi c.

##CY
Luôn kiểm tra a ≠ 0 trước khi áp dụng công thức nghiệm...

##PP
Xác định a, b, c.
Tính Δ = b² − 4ac.
Xét dấu Δ và kết luận nghiệm.

##VD Ví dụ 1. Giải phương trình 2x² − 5x + 2 = 0.
Lời giải. Ta có a = 2, b = −5, c = 2 ⇒ Δ = 9 > 0. Vậy x₁ = 2, x₂ = 1/2.

##NX
Δ là số chính phương nên nghiệm là số hữu tỉ — có thể thử nhẩm nghiệm trước.
```

- `##ĐL` / `##ĐN` / `##TC` / `##CY` / `##PP` / `##VD` / `##NX`, đứng đầu dòng, có thể kèm
  tiêu đề ngay trên cùng dòng.
- Nội dung khối = mọi dòng sau đó **tới dòng trống kế tiếp** (đúng quy ước ngắt đoạn đã có
  sẵn trong lý thuyết hiện tại — không đổi thói quen soạn).
- **`##PP` riêng 1 quy tắc khác:** mỗi DÒNG không trống bên trong khối = 1 bước, tự đánh số
  thứ tự + nối bằng đường kẻ dọc (timeline) khi render — không cần gõ số ①②③ tay như trước.
- **`##VD` — CHỈ ĐỀ BÀI nằm trong khung, "Lời giải" đứng NGOÀI khung** (CEO chốt 26/09, 2
  lần đổi ý: ban đầu định để nhẹ không khung → rồi định đóng khung nguyên cả đề+lời giải →
  chốt cuối là tách: khung (viền tím-hồng `#b23a72` + tag nổi trên viền, cùng họ `dinh_ly`/
  `tinh_chat`) chỉ bọc đề bài; dòng bắt đầu bằng "Lời giải"/"Bài giải"/"Giải" + dấu `.`/`:`
  ngay sau (né khớp nhầm câu kiểu "Giải phương trình...") được tách ra render PHẲNG bên dưới
  khung, không viền — xem `splitViDu()` trong `lythuyetBlocks.ts`.
- **Tiêu đề khung TỰ BÓC từ nhãn có sẵn trong nội dung** (vd nội dung đã viết sẵn "Ví dụ 1.",
  "Định lý 2:"...) khi kí hiệu KHÔNG có tiêu đề riêng trên cùng dòng (`##VD` trần) — parser
  tự nhận diện nhãn đó, đưa lên làm tag khung, XOÁ khỏi thân để không hiện lặp 2 lần (bug đã
  gặp thật: box hiện "Ví dụ" ở tag VÀ "Ví dụ 1." lặp lại ngay trong đề — xem `LEADING_LABEL_RE`).
  Prompt Gemini (`buildLyThuyetPrompt`/`buildTheoryIngestPrompt`) cũng được dặn: nếu tài liệu
  gốc đã có nhãn kiểu này, viết nhãn NGAY sau kí hiệu trên CÙNG dòng (`##VD Ví dụ 1`) thay vì
  để trần — 2 cơ chế (prompt + parser tự bóc) bổ trợ nhau, không cái nào bắt buộc phải đúng.
- **`##TC` (Tính chất)** dùng khi nội dung là 1 tính chất/hệ quả (gần giống định lý nhưng
  không phải định lý được chứng minh hình thức) — cùng kiểu khung với `dinh_ly` (viền + tag
  nổi trên viền), chỉ khác màu (tím `#7c5cbf` — phân biệt mắt với xanh của `dinh_ly`).
- Đoạn KHÔNG có kí hiệu → render y như cũ (text phẳng, không khung).
- **KHÔNG có `##HV`/hình ở đây** — xem §5 "Ngoài phạm vi": hình vẽ không thuộc lý thuyết.

## 2. Parser dùng chung — không phân biệt môn

1 hàm (`src/lib/lythuyetBlocks.ts`) tách chuỗi `noi_dung` thành mảng:
`{ loai: 'text' | 'dinh_ly' | 'dinh_nghia' | 'tinh_chat' | 'chu_y' | 'phuong_phap' | 'vi_du' | 'nhan_xet', tieuDe: string, noiDung: string }[]`.

Vì cả 4 bảng lý thuyết dùng chung shape `noi_dung: text`, parser này **không cần biết đang
ở môn nào** — đúng luật đối xứng §1.6 CLAUDE.md (1 cơ chế chạy y hệt mọi môn).

## 3. 2 nơi cắm parser — core CSS lấy nguyên từ mockup đã duyệt

Mockup đã CEO duyệt: https://claude.ai/artifact/8Q1AZwDGR14f7AjzX67Vcw (2 trang minh hoạ
6 kiểu khung, cả 6 đều thuộc scope file này — trừ "Kiến thức cần nhớ" trong mockup, cái
đó CEO không nhắc tới nên tạm để ngoài, không tự thêm).

- **Preview trong `LyThuyetModal`** — đổi từ `<MathText>{noiDung}</MathText>` sang: parse
  rồi render từng đoạn qua core CSS (copy CSS từ mockup, đặt cùng chỗ với core đầu phiếu
  `bkPrint.tsx`). Người soạn thấy khung NGAY lúc gõ, không cần export PDF mới biết đẹp/xấu
  — CEO đã xác nhận hướng này hợp lý hơn cho người dùng (22/09).
- **`LyThuyetBody` trong PrintView.tsx** — tách 2 luồng trong cùng hàm:
  - Đoạn `loai: 'text'` → giữ nguyên logic ngắt trang hiện tại (CHO PHÉP vỡ dòng để né mồ côi).
  - Đoạn có khung (`dinh_ly`/`dinh_nghia`/`tinh_chat`/`chu_y`/`phuong_phap`/`vi_du`/`nhan_xet`)
    → render qua core CSS với `break-inside: avoid` — **ngược hẳn** logic phía trên (khung
    TUYỆT ĐỐI không vỡ giữa 2 trang, thà đẩy nguyên khối sang trang sau). Đây là chỗ dễ lẫn
    nhất khi code, phải tách rõ nhánh, không dùng chung 1 logic ngắt trang cho cả 2 loại.
    `phuong_phap` (timeline nhiều bước) dài hơn các khối khác — nếu 1 khối `##PP` quá dài
    tự nó tràn quá 1 trang thì vẫn phải cho vỡ giữa các BƯỚC (không vỡ giữa 1 bước), khác
    với các khối còn lại (luôn nguyên khối, không có "bước" con bên trong nên không có chỗ
    để vỡ hợp lý).

## 4. Phạm vi môn (CEO chốt 24/09)

**Áp dụng chung cho cả 4 bảng lý thuyết luôn** (`dai_dang_ly_thuyet` / `hgt_dang_ly_thuyet` /
`khtn_dang_ly_thuyet` / `hinh_hoc_bai_ly_thuyet`) — KHÔNG làm từng môn riêng rồi rollout dần.
Hợp lý vì parser/core CSS vốn đã không phân biệt môn (§2) — code 1 lần, cắm vào cả 4 nơi
`LyThuyetModal`/`LyThuyetBody` đọc/ghi 4 bảng đó cùng lúc.

## 5b. AI tự gợi ý gắn kí hiệu lúc bóc OCR (CEO chốt 26/09)

`buildLyThuyetPrompt`/`buildTheoryIngestPrompt` (`src/lib/kho/api.ts`) — dùng khi bấm
"🪄 Bóc chữ"/"🖼 Bóc + hình" trong `LyThuyetModal` — đã được dặn thêm: khối nào AI RÕ RÀNG
nhận ra thuộc 1 trong 7 loại thì tự gắn `##XX` ngay khi bóc, mơ hồ thì để nguyên không đoán.

**Đây KHÔNG phải "máy tự động gắn nhãn không giám sát"** — khác hẳn cách làm bị cấm ở §5:
kết quả AI luôn đổ vào textarea soạn, người soạn NHÌN THẤY khung ngay trong preview
(nhờ đã có ở phần trên) và có thể sửa/xoá kí hiệu sai TRƯỚC khi bấm Lưu — đúng nguyên tắc
"AI gợi ý → người confirm" đã có sẵn ở CLAUDE.md §5 (Principle 6), không phải ngoại lệ mới.

## 5. Ngoài phạm vi (CEO chốt 22/09) — KHÔNG thuộc file này

- **Hình vẽ (khu vực để vẽ)** — CHỈ xuất hiện ở **bài tập về nhà (BTVN)**, không phải lý
  thuyết. Đã có "builder hình" riêng xử lý việc này (module đã tồn tại — không xác định
  lại trong spec này, không dựng thêm cơ chế mới). `##ĐL`/`##ĐN`/`##CY` ở §1 CHỈ dành cho
  soạn lý thuyết + cấu trúc file lý thuyết, không đụng gì tới hình.
- **Các pattern tương lai khác** (ô trống vẽ hình, bảng điền dữ liệu, …) — **KHÔNG** đi theo
  cơ chế kí hiệu-trong-text như §1, và **KHÔNG** tự nhận diện. Đây là **"chức năng bật"**
  (toggle) gắn ở cấp bài tập/câu hỏi (trong builder tương ứng của loại bài tập đó), khác hẳn
  bản chất với việc đánh dấu ngữ nghĩa trong lý thuyết. Mỗi pattern kiểu này là 1 spec riêng,
  không gộp vào file này.
