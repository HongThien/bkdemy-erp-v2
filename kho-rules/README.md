# kho-rules/ — ĐƯỜNG ĐI của một tài liệu từ file → bộ luật theo khối → lời giải chuẩn → kho

> **Đọc file này trước khi gán dạng / giải bài cho BẤT KỲ khối nào.** Thùy chốt 07/10: *"mỗi khối cần có quy tắc riêng… nhiệm vụ
> là thiết kế đường đi chứ không chỉ giải bài."* File này là đường đi; mỗi khối là một file luật riêng bên dưới.

## 1. Bố cục thư mục

```
kho-rules/
  README.md                 ← đường đi chung (file này)
  dai/
    k4T.md                  ← luật GÁN DẠNG + GIẢI + TRÌNH BÀY khối 4T   (từ sách Toán arc 4 quyển 1, 07/10)
    k4T-mau-thu.md          ← lô giải thử đang/đã duyệt của 4T (lô 1: 13 câu)
    k5T.md · k5T-mau-thu.md ← khối 5T (04/10)
    k6.md … k12.md          ← mỗi khối một file khi tới lượt (chưa có)
    so-do/                  ← mô tả JSON + SVG sơ đồ đoạn thẳng của các câu mẫu
  hgt/ · khtn/ · anh/ …     ← nhánh khác, cùng khuôn
```

**Một khối = một file `k<khối>.md`**, không gộp nhiều khối vào một file: luật tiểu học (cấm ẩn, sơ đồ đoạn thẳng) và luật THPT
(cho phép đạo hàm, logic) mâu thuẫn nhau; gộp lại thì agent phải tự lọc theo khối và sẽ lọc sai. Luật **chung cho mọi khối**
(định dạng LaTeX, 2 phần Hướng dẫn / Trình bày, kiểm trước khi ghi) viết ở §3 dưới đây, file khối **chỉ ghi phần khác**.

## 2. Đường đi — 7 bước, lặp cho tới khi CEO không còn sửa

| Bước | Ai | Làm gì | Ra gì |
|---|---|---|---|
| **B1 Đọc** | máy | Word MathType ⇒ `scripts/kho/mathtype-thu/doc-docx.mjs <docx> --ra <thư mục>` (0 OMML thì `docx-doc.mjs` KHÔNG dùng được). Word OMML ⇒ `scripts/docx-doc.mjs`. PDF ⇒ `scripts/kho/de-thi/boc-pdf.mjs`. Đọc **toàn bộ**, không đọc mẫu | `goc.txt` + báo cáo công thức hỏng (phải = 0 hoặc liệt kê) |
| **B2 Hồ sơ sách** | Claude | Cấu trúc (chuyên đề / ví dụ có lời giải / luyện tập / phiếu) · đếm bài · ảnh · **chuyên đề sách ↔ chủ đề bản đồ** · chỗ bản đồ thiếu dạng | §5–§6 của `k<khối>.md` |
| **B3 Rút luật từ lời giải mẫu** | Claude | Lời giải mẫu của **chính sách** (phần "Bài làm") là chuẩn trình bày của khối. Rút: cấm/cho phép · khuôn Phần 2 theo chuyên đề · mấu chốt/bẫy theo chuyên đề | §0–§2 của `k<khối>.md` (nháp v0) |
| **B4 Lô giải thử** | Claude | 10–15 câu, phủ nhiều khuôn, **ưu tiên dạng đang 0 câu**. Mỗi câu: Phần 1 → Phần 2 → thử ngược đáp số (gán dạng là lượt riêng — §3). Sơ đồ ⇒ vẽ bằng `scripts/kho/so-do-doan-thang.mjs` | `k<khối>-mau-thu.md` + gửi trong chat |
| **B5 CEO duyệt trong chat** | Thùy | Chỉ nói chỗ sai, theo số câu | — |
| **B6 Ghi nhật ký → nâng luật** | Claude | Mỗi chỗ sửa ⇒ 1 dòng §7 (ngày · câu · CEO sửa gì · luật rút ra) ⇒ sửa §1–§3 ⇒ sửa lại câu trong lô. **Không sửa câu mà không ghi luật** | `k<khối>.md` bản mới |
| **B7 Lặp** | — | Lô kế tiếp 15–30 câu theo luật mới. Một lô đi qua CEO **không sửa gì** ⇒ `k<khối>.md` lên **v1** ⇒ được giải hàng loạt + ghi kho | v1 ⇒ mở cổng ghi |

Sau v1: giải hàng loạt vẫn qua **cổng ghi** (`scripts/kho/cong-ghi.mjs`): câu + biên bản kiểm (đáp số thử ngược / máy tính lại /
so đáp án gốc) ⇒ ghi `dai_cau_hoi` với `nguon_giai='ai'`, `giai_method='claude_code'`, `da_duyet=false`, dạng vào `dang_chinh`
(nếu chắc) hoặc `dang_ai_de_xuat` (nếu không), sơ đồ ⇒ `anh_dap_an`. Người duyệt ở màn Duyệt lời giải; mỗi lần người sửa
⇒ trigger `kho_sua_log` ghi khâu nào ⇒ đó là **thước đo** (skill 7): tỉ lệ người sửa theo lô, theo khối, theo khâu.

## 3. Luật CHUNG mọi khối (file khối không lặp lại)

- **Hai phần** `**Phần 1. Hướng dẫn**` (mấu chốt · vì sao nghĩ ra · các bước theo mạch nghĩ · chú ý bẫy) và `**Phần 2. Trình bày**`
  (đúng cái HS viết vào bài thi). CEO 04/10, giữ cho mọi khối. Phần 1 là phần quan trọng nhất. **Mọi câu** đủ 2 phần, kể cả câu
  trắc nghiệm mà sách chỉ đòi ghi đáp số (CEO 08/10).
- **Mỗi câu lời giải / mỗi phép tính một dòng**, cách nhau dòng trống (CEO 07/10). Phần 2 bài tính mở bằng dòng chép lại đề.
- **⭐ GIẢI và GÁN DẠNG là 2 việc ĐỘC LẬP (CEO 08/10):** *"giải trước rồi up lên DB ở trạng thái chưa gán dạng; sau này hoàn thiện
  bản đồ thì có 1 lần chạy gán các bài đó vào bản đồ."* Lượt giải ghi câu vào **dạng chờ** `…000000` (`ghi-lo.mjs --chua-gan-dang`),
  khuôn trình bày theo CHUYÊN ĐỀ của sách (không cần dạng). Lượt gán dạng chạy riêng theo §5 file khối, kiểm bằng model khác gán mù.
  Hệ quả DB: câu dạng chờ chưa bấm duyệt được (`_kho_la_dang_cho`) ⇒ duyệt lời giải sau khi gán dạng.
  *(Lô thử 1–4 của 4T có gán dạng — dạng đề xuất lưu ở `kho-rules/dai/lo/k4T-lo1-4.json`, KHÔNG ghi DB.)* Không khớp dạng ⇒ dạng chờ, không ép. Bài nhiều ý độc lập ⇒ tách câu,
  mỗi câu đủ 2 phần (CEO 07/10).
- **Giải theo lời giải mẫu của khối**, không theo thói quen của Claude. Khối chưa có file luật ⇒ **không giải hàng loạt**, làm B1–B7 trước.
- Định dạng: `\dfrac`, `\times`, chia `:`, số không chèn dấu cách hàng nghìn, `$…$` mỗi công thức, `\overline{abc}` không `\text`.
- **Kiểm trước khi ghi**: đáp số thử ngược vào đề; lệch đáp án gốc ⇒ không ghi, báo người. Không chắc ⇒ để trống (CLAUDE.md §1.5).
- **Sơ đồ / hình**: AI viết mô tả có cấu trúc, máy render (không để AI vẽ điểm ảnh). Hiện có: sơ đồ đoạn thẳng
  (`scripts/kho/so-do-doan-thang.mjs`) — **vẽ đúng tỉ lệ số liệu** (bắt buộc `gia_tri_phan`), máy tự kiểm tổng/hiệu khớp đề
  rồi mới vẽ (CEO 08/10). Hình nào máy vẽ sau này cũng theo luật này: số liệu ⇒ kích thước thật, máy kiểm. Chưa có: đồ thị, hình phẳng, bảng biến thiên (skill 5, làm khi tới K12).

## 4. Việc kỹ thuật còn treo để đường đi chạy trơn

| # | Việc | Vì sao |
|---|---|---|
| 1 | App HS hiển thị `anh_dap_an` **dưới** lời giải; cần cú pháp chèn ảnh **đúng chỗ** trong `loi_giai` (vd `[[anh:so-do]]`) để sơ đồ nằm ngay sau "Ta có sơ đồ:" | Sách tiểu học đặt sơ đồ giữa bài giải; để dưới cùng là sai khuôn |
| 2 | ✅ 08/10 `scripts/kho/sach/tach-bai.mjs`: `goc.txt` → bài có danh tính (sách · khu · số · ý), báo mã trùng / nhãn ý lặp / dòng lạc. 4T: 910 bài (VD 60 · LT 366 · PTL 30 · PCT 454), 0 dòng lạc, 1 bài cần người (LT 11.3 sách thiếu nhãn 11.4) | Để lô giải sau v1 không chép tay đề; danh tính bám số bài trong sách |
| 3 | ✅ 08/10 `scripts/kho/sach/lo-tu-md.mjs` (md đã duyệt → lô JSON, đề lấy nguyên văn sách) + `ghi-lo.mjs` (cổng ghi: kiem-doc/kiem-dap-so/kiem-hinh-a bằng code, kiem-dang/kiem-hinh-b bằng model khác gán mù; mặc định chạy thử ROLLBACK). Bộ kiểm đáp số theo khối: `kho-rules/dai/lo/k4T-kiem.mjs` | Hiện lô thử chỉ nằm trong md |
| 4 | Báo cáo thước đo theo khối: % câu người sửa theo khâu (`kho_sua_log`), % dạng người đổi (`kho_doi_dang_log`) | Để biết v1 của một khối có "đứng" không |

## 5. Trạng thái từng khối

| Khối | File | Phiên bản | Lô đã duyệt | Nguồn luật |
|---|---|---|---|---|
| 4T | `dai/k4T.md` | **v1 (08/10)** | lô 1: 13 câu, CEO sửa 2 chỗ · lô 2: 20 câu, chốt 2 luật gán dạng · lô 3: 20 câu, sửa sơ đồ (đúng tỉ lệ) + mọi câu 2 phần · **lô 4: 20 câu, không sửa ⇒ v1** | Toán arc 4 quyển 1 (Archimedes 2023) |
| 5T | `dai/k5T.md` | v0 (04/10) | lô 1: 12 câu | kho 5T sẵn có (chuyên đề Số thập phân) |
| 6–12 | — | chưa | — | chờ CEO đưa sách mẫu từng khối |
