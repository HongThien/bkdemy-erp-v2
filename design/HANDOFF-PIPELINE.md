# PIPELINE THIẾT KẾ UI: ChatGPT (vẽ) → Claude Code (dựng)

> Mục đích: Thùy thiết kế trên ChatGPT, ChatGPT đóng gói, Claude dựng lại ĐÚNG như đã thiết kế.
> Dùng lại cho MỌI màn, MỌI app (HS / PH / TA / GV / OPS).
> **Phiên bản 1.1 — chốt 08/09/2026** sau 4 vòng thật (STUDENT_HOME v1→v4). Gói mẫu ĐẠT CHUẨN để đối chiếu:
> `design/handoff/hs-home-v4/`. Lịch sử vì sao có từng luật: mục 8.

---

## 0. Quy trình 1 trang (đọc cái này là đủ để chạy)

| Bước | Ai | Làm gì | Ra gì |
|---|---|---|---|
| 0. Mở context | Thùy | Context ChatGPT mới → dán nguyên **`design/CHATGPT-UI-KIT.md`** + điền "Đơn đặt hàng" (mục 1 của file đó). Đó là file DUY NHẤT ChatGPT cần; file này (HANDOFF-PIPELINE) là của Thùy + Claude, không gửi | |
| 1. Concept | Thùy ↔ ChatGPT | Vẽ mockup NGUYÊN MÀN, lặp đến khi ưng. **Một bố cục chuẩn**; biến thể (nam/nữ…) và trạng thái (có banner, quá hạn…) đều vẽ trên ĐÚNG bố cục đó | `reference/*.png` |
| 2. Kiểm kê + xuất asset | ChatGPT | Lập **bảng kiểm kê** mọi phần tử (mỗi phần tử = 1 dòng, gắn 1 trong 7 loại TEXT/SHAPE/GLYPH/ILLUST/CHAR/DECOR/BACKDROP) → Thùy duyệt danh sách → sinh từng asset bằng **công cụ tạo ảnh**, điền `DESIGN.md` | zip = KIT |
| 3. Nhận hàng | Claude | `node scripts/design-check.mjs <thư mục>` + **mở từng ảnh nhìn**. Rớt → trả lại đúng dòng. Đạt → dựng trên app thật, chụp cạnh reference | màn chạy data thật |
| 4. Duyệt | Thùy | So app với reference, chỉ chỗ lệch. Claude sửa code. Chỉ quay lại ChatGPT khi THIẾU asset | chốt |
| 5. Rút kinh nghiệm (BẮT BUỘC, CEO 08/09) | Claude | Sau MỖI vòng: ① ghi vấn đề vào §8 + DEVLOG · ② sửa `CHATGPT-UI-KIT.md` để lần sau ChatGPT giao đúng · ③ lỗi bắt được bằng máy → thêm phép đo vào `design-check.mjs`. Chưa làm 3 việc này = chưa xong vòng | md tốt hơn |

**Chữ nào cũng là CODE** (kể cả chữ viết tay → font Pacifico ở app HS, Itim ở app TA). ChatGPT **không viết** JSX/CSS/layout.json/manifest.
**Không đưa script kiểm cho ChatGPT.**

**Hai file, hai người đọc — đừng trộn:**
- `design/CHATGPT-UI-KIT.md` — gửi ChatGPT. Tự chứa, không trỏ tới repo. Chứa: đơn đặt hàng, 4 pha, **logic
  phân loại 7 loại phần tử**, bảng kiểm kê, quy tắc asset + prompt mẫu, mẫu DESIGN.md, cấu trúc zip, 8 câu tự
  kiểm, mẫu trả hàng. Sửa quy tắc cho ChatGPT thì sửa Ở ĐÓ.
- `design/HANDOFF-PIPELINE.md` (file này) — Thùy + Claude: quy trình, luật + lý do, bước nhận hàng, script,
  lịch sử. Mục 3–5 dưới đây chỉ tóm tắt; nội dung gửi ChatGPT lấy từ CHATGPT-UI-KIT.md.

---

## 1. Nguyên tắc (8 luật, mỗi luật đã trả giá 1 lần)

1. **ChatGPT là HOẠ SĨ CONCEPT, không phải công cụ thiết kế.** Nó vẽ ra ảnh phẳng, KHÔNG có layer, không có
   vector, không có font. Mọi thứ nó "xuất" từ ảnh tổng đều là crop + phóng to + inpaint.
2. **Ảnh mockup đã duyệt = NGUỒN CHÂN LÝ DUY NHẤT.** Claude đo bố cục, cỡ chữ, khoảng cách từ ảnh đó.
   Không cần layout.json, JSX/CSS mẫu, manifest, spec — Claude tự suy và tự đối chiếu; mấy thứ đó chỉ lệch ảnh.
3. **MỘT bố cục chuẩn cho mọi biến thể.** Nam/nữ, sáng/tối… chỉ đổi **bảng màu + nhân vật + câu chữ**. Ảnh
   trạng thái (có banner, có cảnh báo…) = bố cục chuẩn + phần tử thêm. Ba ảnh reference mà là ba thiết kế
   thì Claude không dựng được cái nào (v4).
4. **Chỉ xuất asset mà CODE KHÔNG VẼ ĐƯỢC:** nhân vật, minh hoạ có khối/bóng, tranh nền, trang trí. Nút,
   thẻ, mũi tên, badge, gradient, bóng, MỌI CHỮ (kể cả viết tay) = code vẽ.
5. **Mỗi asset = 1 lần SINH ẢNH MỚI bằng công cụ tạo ảnh, nền trong suốt, độ phân giải cao.** CẤM crop từ ảnh
   tổng. CẤM "xoá nền" bằng Python/PIL xoá màu trắng (áo, tóc, giấy, cốc trắng thành lỗ thủng; icon xám và
   doodle nhạt bị xoá sạch). Không sinh được nền trong suốt thì sinh trên **nền xanh lá phẳng #00FF00**,
   Claude tự khoá màu.
6. **Minh hoạ = PNG sinh bằng công cụ tạo ảnh, KHÔNG phải SVG gõ tay.** SVG gõ tay chỉ cho glyph đơn giản
   (mũi tên, chuông, chìa khoá, badge, vương miện). Icon ô chức năng gõ tay thành vài hình chữ nhật phẳng,
   khác hẳn mockup (v4).
7. **Tranh nền = KHÔNG chữ, KHÔNG card, KHÔNG nhân vật.** Chỉ mây / màu / mảng. Mọi thứ khác đè lên bằng code.
8. **Mọi phần tử ĐỘNG phải có mặt trong mockup** (badge số, "quá hạn", banner tạm thời, chuông thông báo…).
   Mockup thiếu phần tử ⇒ vẽ mockup MỚI trên bố cục chuẩn, không gửi lại ảnh cũ.

Luật phụ: **không đưa `scripts/design-check.mjs` cho ChatGPT** — có script trong tay nó làm asset để QUA
script, không để ĐÚNG (v3: ảnh rỗng 100% tự chấm PASS). ChatGPT chỉ nhận 6 câu tự kiểm ở mục 4.3.

---

## 2. Thư mục chuẩn (ChatGPT đóng zip đúng cấu trúc này)

```
design/handoff/<app>-<man>-v<N>/          ví dụ: design/handoff/hs-home-v4/
├── DESIGN.md                              1 trang, theo mẫu mục 5
├── reference/
│   ├── reference_<variant>.png            mockup NGUYÊN MÀN đã duyệt, 1 file / biến thể, CÙNG bố cục
│   └── reference_<variant>_<state>.png    trạng thái đặc biệt (có banner, quá hạn…), CÙNG bố cục
└── assets/
    ├── backdrop/  backdrop_<variant>.png  tranh nền KHÔNG chữ/card/nhân vật, ≥1080×1920 (941×1672 chấp nhận)
    ├── characters/ character_<variant>.png nhân vật cutout, nền trong suốt, cao ≥800px
    ├── illustrations/ ill_<ten>.png       minh hoạ từng ô/chức năng, PNG cutout, ≥512px
    ├── decor/     decor_<ten>_<variant>.png trang trí (sách, cốc, cây, mascot…), nền trong suốt
    └── svg/       <ten>.svg               glyph đơn giản gõ tay bằng text SVG (không bọc ảnh)
```

- Tên file: `snake_case`, không dấu, không khoảng trắng. `<variant>` = `male` / `female` / `default`.
- **PNG có alpha** cho mọi thứ trừ backdrop. Không WebP (Claude tự tối ưu lúc đưa vào build).
- KHÔNG có `example/`, `spec/`, `scripts/`, `*_REPORT.md`. Có là bỏ, không đọc.
- File gốc để `design/handoff/`, KHÔNG để `public/` (quy ước 07/09 — `design/README.md`). Claude xuất bản
  tối ưu (WebP/JPG đúng cỡ) vào `public/bk-ui/` khi dựng.

---

## 3–5. Phần gửi ChatGPT — xem `design/CHATGPT-UI-KIT.md`

Toàn bộ nội dung ChatGPT cần (đơn đặt hàng, 4 pha, logic phân loại 7 loại phần tử, bảng kiểm kê, quy tắc asset,
prompt mẫu, mẫu DESIGN.md, cấu trúc zip, 8 câu tự kiểm, mẫu trả hàng) nằm **một nơi duy nhất** ở file đó để
không trôi 2 bản. Tóm tắt để Thùy nhớ luồng:

- **Đơn đặt hàng** (mục 1 file đó): app · màn · mô tả · phần tử ĐỘNG · trạng thái · biến thể · phong cách ·
  giữ nguyên · phiên bản. Trống chỗ nào ChatGPT phải hỏi trước khi vẽ.
- **Pha B:** 1 bố cục chuẩn → duyệt → biến thể/trạng thái trên đúng bố cục.
- **Pha C:** bảng kiểm kê — mỗi phần tử nhìn thấy = 1 dòng, gắn 1 loại: `TEXT`/`SHAPE` = code · `GLYPH` = SVG gõ
  tay · `ILLUST`/`CHAR`/`DECOR` = PNG cutout sinh bằng công cụ tạo ảnh · `BACKDROP` = không khí thuần. Thùy duyệt
  danh sách asset TRƯỚC khi nó sinh ảnh.
- **Pha D:** sinh từng asset, DESIGN.md 6 mục (mục 3 = bảng kiểm kê), tự kiểm 8 câu, zip `<app>-<man>-v<N>.zip`.

## 6. BƯỚC 3 — Claude nhận hàng và dựng

1. Giải nén vào `design/handoff/<app>-<man>-v<N>/` (PowerShell `Expand-Archive`; `mv` trong bash hay bị
   Permission denied khi cwd đang nằm trong thư mục đó).
2. Chạy kiểm cơ học, in bảng đạt/rớt, **rớt thì trả lại đúng dòng cho ChatGPT làm lại, chưa code**:
   ```bash
   node scripts/design-check.mjs design/handoff/hs-home-v4
   ```
   Script kiểm: kích thước tối thiểu · PNG có alpha THẬT (đếm pixel trong suốt) · ảnh RỖNG (>95% trong suốt) ·
   ảnh THỦNG (lỗ trong suốt bị bao kín bởi pixel đục >4% — dấu hiệu xoá nền bằng xoá màu trắng) · backdrop có
   CHỮ/CARD nướng (mật độ cạnh sắc >0.5%) · backdrop các biến thể có KHÁC nhau không (so pixel) · SVG không bọc
   `<image>`, không `<text>` · có `DESIGN.md` + `reference/`.
   **Script chỉ là lưới thô — vẫn phải MỞ ẢNH nhìn** (v3 qua script bản đầu 100% mà mắt thấy hỏng ngay).
   Mở ảnh kiểm thêm 2 thứ script không đo được: **các reference có cùng bố cục không** · **minh hoạ có đúng
   style mockup không**.
3. Đạt → Claude tối ưu ảnh vào `public/bk-ui/` (WebP/JPG nhẹ, đúng cỡ dùng), dựng màn trong app thật
   (route/data/hành vi có sẵn), đo bố cục từ `reference/`. Chữ viết tay dựng bằng font Itim.
4. Claude chụp app cạnh ảnh `reference/` → Thùy duyệt. Lệch chỗ nào nói chỗ đó, Claude chỉnh code, không
   quay lại ChatGPT trừ khi THIẾU asset.

**Definition of Done:** mọi phần tử động chạy data thật · các biến thể cùng 1 component · nhìn cạnh reference
không lệch bố cục · không chữ nào bị raster hoá · tsc + build sạch.

---

## 7. Ranh giới trách nhiệm (để 2 bên hiểu nhau)

| Việc | ChatGPT | Claude |
|---|---|---|
| Ý tưởng, bố cục, phong cách, mockup nguyên màn (1 bố cục chuẩn) | ✔ | đọc |
| Nhân vật, minh hoạ, tranh nền, trang trí — PNG cutout sinh riêng | ✔ | tối ưu, đặt vào |
| SVG glyph đơn giản (mũi tên, chuông, khoá, badge, vương miện) | ✔ gõ tay | có thể tự vẽ nếu thiếu |
| Chữ viết tay, doodle, câu chào, quote, sticker | ✘ chỉ ghi nội dung + màu | ✔ font Itim |
| Font, bảng màu, danh sách động/tĩnh (DESIGN.md) | ✔ | áp |
| Toạ độ, cỡ chữ, khoảng cách, responsive | ✘ | ✔ đo từ reference |
| JSX / CSS / layout.json / manifest / spec / report | ✘ không viết | ✔ |
| Nối route, data, RLS, hành vi | ✘ | ✔ |
| Kiểm asset đạt chuẩn | tự kiểm 6 câu, KHÔNG có script | script + mắt |

---

## 8. Vì sao có các luật trên (4 vòng thật, STUDENT_HOME 07–08/09/2026)

- **v1:** "SVG" là PNG bọc trong thẻ svg, chìa khoá 9×14 px, mũi tên 12×23 px → vỡ trên màn 3x. Thiếu thư mục
  `assets/svg/` mà guide trỏ tới, manifest rỗng. 6 doodle có trong mockup nhưng không có asset. Backdrop nướng
  sẵn hero + nhân vật. → luật 1, 2, 7.
- **v2:** backdrop "nữ" giống backdrop nam 94%, vẫn xanh, vẫn cậu bé. 14 PNG **0% pixel trong suốt** (nền trắng
  248–250), crop phóng to nên nhoè. Guide v2 bảo hero vẽ bằng code + dán nhân vật, nhưng backdrop vẫn nướng
  hero → trùng đôi. Guide v1 nói canvas tuyệt đối, v2 nói flow — ChatGPT không nhìn thấy asset của chính nó
  nên spec và ảnh tự lệch nhau. → luật 5, 7; bỏ hẳn spec/code từ ChatGPT.
- **v3 (đã có pipeline 1.0):** qua script bản đầu 100% ĐẠT, nhưng mở ảnh: backdrop vẫn nướng chào + hero + cậu
  bé; nhân vật, sách, cốc, giấy, bia đích **thủng lỗ** vì "xoá nền" = xoá màu trắng bằng Python; 4 file **rỗng
  100%** mà PIPELINE_REPORT của ChatGPT ghi PASS; reference gửi lại y hệt v2 (md5 trùng), vẫn thiếu chuông +
  banner; vẫn kèm example/spec đã bảo bỏ. ChatGPT có script kiểm trong tay nên tối ưu để QUA script (Goodhart).
  → luật 5, 8, luật phụ; script thêm 3 phép đo rỗng/thủng/cạnh sắc.
- **v4 (pipeline 1.0 + cấm PIL, cấm đưa script):** LẦN ĐẦU ĐẠT: backdrop 2 biến thể là trời mây thật; nhân vật
  nam/nữ cutout 1254px thủng ~0%; decor thật; 18 SVG glyph thật. **Còn lệch:** 3 reference là 3 thiết kế khác
  nhau (nam bố cục cũ, nữ đổi cách xếp ô + hero + footer, ảnh banner là thiết kế thứ 3) → luật 3. Icon 6 ô +
  doodle là SVG gõ tay (hình chữ nhật phẳng; doodle `<text>` Comic Sans) → luật 4, 6, chữ = font Itim.
  Điều làm v4 chạy: nói thẳng "gọi công cụ tạo ảnh, cấm Python", liệt kê từng asset, không đưa script.
- **v4.1 (08/09, vòng nhỏ 7 minh hoạ):** ĐẠT ngay — nhờ đơn liệt kê TỪNG minh hoạ bằng lời (màu, chi tiết) và nhắc
  "đúng cách đã làm nhân vật". Dựng xong màn chính HS cấp 2/3 từ kit v4 + v4.1 (HomeHS.tsx). Bài học phía DỰNG,
  không phải phía kit: ① chữ chào viết tay dài phải VỪA cạnh cụm nút — đo từ reference tỉ lệ 55% bề ngang rồi mới
  chọn cỡ chữ, đừng chọn cỡ trước; ② nhân vật cutout đặt trong hero: quyết định vị trí bằng 3 số (right, height,
  right của khối chữ) đo từ reference, tránh thử-sai; ③ badge và doodle cùng góc trên-phải ⇒ doodle tụt xuống khi
  có badge (mockup chỉ vẽ 1 trạng thái). ④ Resize asset trên Windows không có sharp/Python: PowerShell
  System.Drawing đủ dùng (PNG alpha + JPG q82). ⑤ Kit v4 làm TRƯỚC giao thức 1.1 nên DESIGN.md chưa có bảng kiểm
  kê — script rớt đúng chỗ đó; kit sau phải có.
- **Dựng xong hs-home (08/09 tối), 3 luật CEO chốt trên màn thật:** ① **font chữ tay = Pacifico** (so Itim/Sriracha/
  Mali/Dancing Script/Pacifico bằng `?font=` trên demo — thử font trước, xuất doodle ảnh là ngoại lệ) · ② **Home không
  cuộn** (h-100dvh + overflow-hidden) · ③ **nhưng không kéo giãn cho đầy màn** — "tỉ lệ phải như gốc mới đẹp, scale sai
  tỉ lệ xấu": hero/ô dùng aspect-ratio của mockup (870:280 · 417:280), cỡ chữ clamp theo vw, màn cao để trống dưới.
  Lần đầu mình làm flex-1 chia đều → SE 667 ô bẹp dí, CEO bác ngay. ④ "BK ACADEMY" trên đầu chật → xuống chân trang.
 càng bảo ChatGPT viết spec/code, càng nhiều thứ phải bỏ. Bảo nó vẽ đúng, sinh asset riêng
  từng cái bằng công cụ tạo ảnh, còn lại Claude làm từ ảnh đích.
