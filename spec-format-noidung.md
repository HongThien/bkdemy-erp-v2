# spec-format-noidung.md — Đóng khung nội dung lý thuyết (định lý · định nghĩa · chú ý · phương pháp giải · ví dụ · nhận xét)

> ĐỌC trước khi đụng `LyThuyetModal` (src/screens/kho/BanDo.tsx) hoặc `LyThuyetBody`/PrintView.
> Trạng thái: **CHỐT XONG (24/09) — sẵn sàng code.**

## 0. Vấn đề

Nội dung lý thuyết của 1 dạng hiện là **1 chuỗi text phẳng** (cột `noi_dung: text` ở
`dai_dang_ly_thuyet` / `hgt_dang_ly_thuyet` / `khtn_dang_ly_thuyet` / `hinh_hoc_bai_ly_thuyet`
— cùng 1 shape cho cả 4 môn). Soạn qua `<textarea>` thô trong `LyThuyetModal`
(src/screens/kho/BanDo.tsx:518-705), không dùng RichMath, không có JSON/block nào.
Khi ghép ra PDF, `LyThuyetBody` (src/screens/tailieu/PrintView.tsx:577-590) chỉ lo
**ngắt trang** (né mồ côi dòng cuối) — không hiểu ngữ nghĩa "đây là định lý/chú ý".

Cần: **6 loại khối** — định lý, định nghĩa, chú ý, phương pháp giải, ví dụ, nhận xét —
đúng cấu trúc chuẩn 1 dạng toán hay có trong sách/tài liệu (lý thuyết → phương pháp giải
→ ví dụ → nhận xét). KHÔNG đổi cách soạn (vẫn gõ text liền mạch trong textarea đó), KHÔNG
cần UI chọn block riêng (không có màn "build tài liệu thủ công" — tài liệu do hệ tự ghép
từ kho). Hình vẽ KHÔNG thuộc phạm vi file này — xem §5.

## 1. Cú pháp đánh dấu — kí hiệu đầu dòng, kiểu admonition (MkDocs/Docusaurus)

Người soạn gõ như cũ, chỉ thêm 1 dòng kí hiệu NGAY TRƯỚC đoạn muốn đóng khung:

```
##ĐL Định lý 1 — Công thức nghiệm
Nếu Δ = b² − 4ac ≥ 0 thì phương trình có nghiệm x = (−b ± √Δ) / 2a.

##ĐN Định nghĩa 1
Phương trình bậc hai một ẩn là phương trình có dạng ax² + bx + c = 0...

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

- `##ĐL` / `##ĐN` / `##CY` / `##PP` / `##VD` / `##NX`, đứng đầu dòng, có thể kèm tiêu đề
  ngay trên cùng dòng.
- Nội dung khối = mọi dòng sau đó **tới dòng trống kế tiếp** (đúng quy ước ngắt đoạn đã có
  sẵn trong lý thuyết hiện tại — không đổi thói quen soạn).
- **`##PP` riêng 1 quy tắc khác:** mỗi DÒNG không trống bên trong khối = 1 bước, tự đánh số
  thứ tự + nối bằng đường kẻ dọc (timeline) khi render — không cần gõ số ①②③ tay như trước.
- Đoạn KHÔNG có kí hiệu → render y như cũ (text phẳng, không khung).
- **KHÔNG có `##HV`/hình ở đây** — xem §5 "Ngoài phạm vi": hình vẽ không thuộc lý thuyết.

## 2. Parser dùng chung — không phân biệt môn

1 hàm (`src/lib/lythuyetBlocks.ts`, chưa tạo) tách chuỗi `noi_dung` thành mảng:
`{ loai: 'text' | 'dinh_ly' | 'dinh_nghia' | 'chu_y' | 'phuong_phap' | 'vi_du' | 'nhan_xet', tieuDe?: string, noiDung: string }[]`.

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
  - Đoạn có khung (`dinh_ly`/`dinh_nghia`/`chu_y`/`phuong_phap`/`vi_du`/`nhan_xet`) → render
    qua core CSS với `break-inside: avoid` — **ngược hẳn** logic phía trên (khung TUYỆT ĐỐI
    không vỡ giữa 2 trang, thà đẩy nguyên khối sang trang sau). Đây là chỗ dễ lẫn nhất khi
    code, phải tách rõ nhánh, không dùng chung 1 logic ngắt trang cho cả 2 loại.
    `phuong_phap` (timeline nhiều bước) dài hơn các khối khác — nếu 1 khối `##PP` quá dài
    tự nó tràn quá 1 trang thì vẫn phải cho vỡ giữa các BƯỚC (không vỡ giữa 1 bước), khác
    với `dinh_ly`/`dinh_nghia`/`chu_y`/`vi_du`/`nhan_xet` (luôn nguyên khối, không có "bước"
    con bên trong nên không có chỗ để vỡ hợp lý).

## 4. Phạm vi môn (CEO chốt 24/09)

**Áp dụng chung cho cả 4 bảng lý thuyết luôn** (`dai_dang_ly_thuyet` / `hgt_dang_ly_thuyet` /
`khtn_dang_ly_thuyet` / `hinh_hoc_bai_ly_thuyet`) — KHÔNG làm từng môn riêng rồi rollout dần.
Hợp lý vì parser/core CSS vốn đã không phân biệt môn (§2) — code 1 lần, cắm vào cả 4 nơi
`LyThuyetModal`/`LyThuyetBody` đọc/ghi 4 bảng đó cùng lúc.

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
