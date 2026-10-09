# kho-rules/ — ĐƯỜNG ĐI của một tài liệu từ file → bộ luật theo khối → lời giải chuẩn → kho

> **Đọc file này trước khi gán dạng / giải bài cho BẤT KỲ khối nào.** Thùy chốt 07/10: *"mỗi khối cần có quy tắc riêng… nhiệm vụ
> là thiết kế đường đi chứ không chỉ giải bài."* File này là đường đi; mỗi khối là một file luật riêng bên dưới.

## 0. ⭐ QUY TRÌNH 3 BƯỚC — KHỐI NÀO CŨNG LÀM THẾ NÀY (CEO chốt 08/10)

| Bước | Ai | Làm gì | Xong khi | Chi tiết |
|---|---|---|---|---|
| **1. Rút luật giải** | Claude đọc sách + giải thử · **CEO duyệt** | Đọc sách của khối → **giải MỘT LƯỢT QUA CÁC DẠNG BÀI của sách** (mỗi dạng ít nhất 1 câu) để học cách giải → CEO duyệt trong chat → mỗi chỗ CEO sửa rút thành **luật giải** → ghi vào `k<khối>.md` để lô sau giải tốt hơn | Đã đi qua **đủ các dạng bài** và luật **đủ tốt**: lô cuối qua CEO không sửa gì ⇒ `k<khối>.md` lên **v1** | §2 (B1–B7) |
| **2. Giải toàn bộ tài liệu** | Claude (dây chuyền trạm) | Giải **hết** tài liệu theo luật v1 → đưa lên DB **chờ sẵn**: câu nằm ở **dạng chờ** `…000000` của khối (`ghi-lo.mjs --chua-gan-dang`), `da_duyet=false` | Mọi bài của tài liệu đã vào DB, hoặc nằm trong danh sách treo có lý do | §2b |
| **3. Xếp vào bản đồ** | **CEO làm bản đồ** · Claude xếp bài · **CEO duyệt** | Khi CEO làm xong bản đồ kiến thức của khối ⇒ Claude xếp từng câu đã giải vào bản đồ (đọc lý thuyết · ví dụ · mô tả nhận biết của bản đồ) → CEO duyệt | CEO duyệt xong việc xếp của khối | `k<khối>.md` mục GÁN DẠNG · `spec-ban-do-4-tang.md` §0 (B3–B4) |

- **Bản chất bước 1 (CEO 08/10):** *"m đi giải 1 lượt các dạng bài để học cách giải để giải toàn bộ bài đấy."* Lô thử không phải
  mẫu ngẫu nhiên — là một vòng phủ mọi dạng bài trong sách (theo chuyên đề + các mục "Tóm tắt lí thuyết" / VÍ DỤ), để khi sang bước 2
  không còn dạng nào giải lần đầu mà chưa có luật. Dạng nào bước 2 mới gặp ⇒ dừng dạng đó, giải thử cho CEO duyệt như bước 1.
- **Câu đã giải xong thì duyệt luôn** (CEO 08/10, ca 271 câu STP của 5T): câu đã có dạng trong bản đồ cũ không phải chờ bước 3 mới duyệt.
  Câu ở dạng chờ thì vẫn chưa bấm duyệt được (dòng dưới).
- **Bản đồ kiến thức là việc của CEO.** Claude KHÔNG tự dựng / tự sửa bản đồ, không đặt câu hỏi "bản đồ nên chia thế nào" trong
  bước 1–2. Thứ Claude đưa được cho bản đồ: hồ sơ sách (danh sách chuyên đề, chỗ bản đồ hiện có thiếu dạng) — làm tư liệu, không làm quyết định.
- **Bước 1–2 không chờ bản đồ, bước 3 không chờ bước 2 xong hết** — giải và xếp là 2 việc độc lập; câu giải xong thì nằm dạng chờ
  tới khi bản đồ khối đó xong. Hệ quả DB: câu dạng chờ chưa bấm duyệt lời giải được (`_kho_la_dang_cho`) ⇒ lời giải được duyệt sau bước 3.
- Thứ tự cũ "bản đồ → gán dạng → giải" (`spec-luong-kho.md` V3-1, §7) **không còn đúng** — theo bảng trên.
- Đang ở đâu từng khối: §5.

## 1. Bố cục thư mục

```
kho-rules/
  README.md                 ← đường đi chung (file này)
  dai/
    k4T.md                  ← luật GÁN DẠNG + GIẢI + TRÌNH BÀY khối 4T   (từ sách Toán arc 4 quyển 1, 07/10)
    k4T-mau-thu.md          ← lô giải thử đang/đã duyệt của 4T (lô 1: 13 câu)
    k5T.md · k5T-mau-thu.md ← khối 5T (v0 04/10; 08/10 thêm hồ sơ sách 31 CĐ + bản đồ hiện có + kế hoạch §7)
    k6.md … k12.md          ← mỗi khối một file khi tới lượt (chưa có)
    so-do/                  ← mô tả JSON + SVG sơ đồ đoạn thẳng của các câu mẫu
    lo/                     ← LÔ đã ghi / sắp ghi của từng khối (sự thật về câu đã ghi vẫn là DB):
                               k<khối>-<lô>.json (lô qua cổng) · .soan.json (bản model soạn) · .sua.json (bản sửa của người soát —
                               đo tỉ lệ phải sửa) · .kiem-ngoai.json (biên bản model khác) · k<khối>-kiem.mjs (bộ kiểm đáp số của khối)
  hgt/ · khtn/ · anh/ …     ← nhánh khác, cùng khuôn
```

**Một khối = một file `k<khối>.md`**, không gộp nhiều khối vào một file: luật tiểu học (cấm ẩn, sơ đồ đoạn thẳng) và luật THPT
(cho phép đạo hàm, logic) mâu thuẫn nhau; gộp lại thì agent phải tự lọc theo khối và sẽ lọc sai. Luật **chung cho mọi khối**
(định dạng LaTeX, 2 phần Hướng dẫn / Trình bày, kiểm trước khi ghi) viết ở §3 dưới đây, file khối **chỉ ghi phần khác**.

## 2. Bước 1 (rút luật giải) — 7 bước nhỏ, lặp cho tới khi CEO không còn sửa

| Bước | Ai | Làm gì | Ra gì |
|---|---|---|---|
| **B1 Đọc** | máy | Word MathType ⇒ `scripts/kho/mathtype-thu/doc-docx.mjs <docx> --ra <thư mục>` (0 OMML thì `docx-doc.mjs` KHÔNG dùng được). Word OMML ⇒ `scripts/docx-doc.mjs`. PDF ⇒ `scripts/kho/de-thi/boc-pdf.mjs`. Đọc **toàn bộ**, không đọc mẫu | `goc.txt` + báo cáo công thức hỏng (phải = 0 hoặc liệt kê) |
| **B2 Hồ sơ sách** | Claude | Cấu trúc (chuyên đề / ví dụ có lời giải / luyện tập / phiếu) · đếm bài · ảnh · **chuyên đề sách ↔ chủ đề bản đồ** · chỗ bản đồ thiếu dạng | §5–§6 của `k<khối>.md` |
| **B3 Rút luật từ lời giải mẫu** | Claude | Lời giải mẫu của **chính sách** (phần "Bài làm") là chuẩn trình bày của khối. Rút: cấm/cho phép · khuôn Phần 2 theo chuyên đề · mấu chốt/bẫy theo chuyên đề | §0–§2 của `k<khối>.md` (nháp v0) |
| **B4 Lô giải thử** | Claude | Mỗi lô 10–20 câu; các lô cộng lại **phủ MỌI dạng bài của sách** (lập bảng dạng ↔ lô ở `k<khối>.md`, đánh dấu dạng đã qua CEO), **ưu tiên dạng đang 0 câu**. Mỗi câu: Phần 1 → Phần 2 → thử ngược đáp số (gán dạng là lượt riêng — §3). Sơ đồ ⇒ vẽ bằng `scripts/kho/so-do-doan-thang.mjs` | `k<khối>-mau-thu.md` + gửi trong chat |
| **B5 CEO duyệt trong chat** | Thùy | Chỉ nói chỗ sai, theo số câu | — |
| **B6 Ghi nhật ký → nâng luật** | Claude | Mỗi chỗ sửa ⇒ 1 dòng §7 (ngày · câu · CEO sửa gì · luật rút ra) ⇒ sửa §1–§3 ⇒ sửa lại câu trong lô. **Không sửa câu mà không ghi luật** | `k<khối>.md` bản mới |
| **B7 Lặp** | — | Lô kế tiếp theo luật mới, sang các dạng chưa qua. Đã phủ đủ dạng **và** lô cuối qua CEO **không sửa gì** ⇒ `k<khối>.md` lên **v1** ⇒ được giải hàng loạt + ghi kho | v1 ⇒ mở cổng ghi |

## 2b. Bước 2 (giải toàn bộ tài liệu) — DÂY CHUYỀN giải hàng loạt sau v1 (đã chạy 4T lô 5–7, 287 câu, 08/10)

Người làm ≠ người kiểm ở mọi trạm. Một lô = 1 nhóm khu sách (vd CĐ8–13 + PTL 2–3), chia 3 phần A/B/C chạy song song.

| # | Trạm | Ai | Lệnh / việc | Bẫy đã cắn |
|---|---|---|---|---|
| 0 | Tách bài (1 lần / sách) | máy | `node scripts/kho/sach/tach-bai.mjs <goc.txt> --sach "<sách>" --ra bai.json` | Sách thiếu nhãn / nhãn ý lặp ⇒ báo, không đoán. Hình trong `Bài làm` (sơ đồ) ≠ hình của đề — tách riêng, sơ đồ máy vẽ lại |
| 1 | Đầu vào | máy | `node scripts/kho/sach/dau-vao-soan.mjs bai.json --sach "<sách>" --khu "LT 8,LT 9,PTL 2" --ra in.json` — đọc DB bỏ bài đã có, bỏ đề trùng kho (sau chuẩn hoá), để riêng bài có hình / bài cần người | Lọc trùng nguyên văn để lọt "5 và 9" ↔ "$5$ và $9$" ⇒ khoá `chuanDe` |
| 2 | Bộ kiểm đáp số | Claude (Opus) | Viết hàm vào `kho-rules/dai/lo/k<khối>-kiem.mjs` **TỪ ĐỀ, TRƯỚC khi mở bản soạn** (vét cạn / thay ngược / mô phỏng); đối chứng với VD sách + câu CEO đã duyệt | Hàm rỗng trả "đạt" giả ⇒ cấm, để `khong_kiem_duoc` thật. Lệch khuôn đáp án ("a=8; b=6" vs 86) là lỗi HÀM KIỂM, sửa hàm không sửa câu |
| 3 | Soạn | **Sonnet** (subagent, 3 song song) | Đọc `k<khối>.md` v1 + lô mẫu đã duyệt ⇒ ra `.soan.json` `[{ma_nguon, dap_an, loi_giai, so_do_mo_ta?, ghi_chu_nghi?}]`. Câu mơ hồ ⇒ `ghi_chu_nghi`, không tự chọn im lặng | Haiku không đạt (đo ở Hình kiểu 1). Brief soạn **chưa nằm trong repo** — §4 việc #5 |
| 4 | Soát | **Opus** (≠ model soạn) | Đọc từng câu theo luật khối; sửa ⇒ ghi vào `.sua.json` (không sửa đè bản soạn); xem ảnh sơ đồ ⇒ biên bản `kiem-hinh-b` vào `.kiem-ngoai.json` | Sơ đồ do chính người soát vẽ thêm ⇒ không ai ký `kiem-hinh-b` độc lập ⇒ cổng chặn (đúng) — phải nhờ model thứ ba |
| 5 | Dựng lô | máy | `node scripts/kho/sach/lo-tu-soan.mjs x.soan.json bai.json --khoi 4T --lo 7 --sua x.sua.json --so-do-dir kho-rules/dai/so-do --ra x.json` — đề lấy nguyên văn sách, chuẩn hoá định dạng bằng máy (tách câu một dòng, `\\"` thừa, chữ `\n\n`) · **cổng KaTeX**: công thức nào không render / số `$` lẻ ⇒ từ chối cả lô | `chuanDinhDang` từng biến `\times\text{m}` thành `\timesm` (lệnh không có ⇒ chữ đỏ trên app) — đã vá + có cổng |
| 6 | Cổng ghi | máy + biên bản | `node scripts/kho/sach/ghi-lo.mjs x.json --sach "<sách>" --kiem kho-rules/dai/lo/k<khối>-kiem.mjs --so-do kho-rules/dai/so-do [--kiem-ngoai x.kiem-ngoai.json] --chua-gan-dang --model-lam claude-sonnet-5-5` ⇒ chạy thử (ROLLBACK) ⇒ đọc báo cáo ⇒ thêm `--ghi` | Upload sơ đồ phải SAU khi lọc câu đã có (lỗi đã sửa, để lại 1 SVG mồ côi) · **KHÔNG chạy 2 lượt `--ghi` song song** (cấp mã câu va nhau) |
| 7 | Máy vẽ đổi | máy | `node scripts/kho/sach/ve-lai-so-do.mjs --sach "<sách>" --so-do kho-rules/dai/so-do <lô…> [--ghi]` — so ảnh đang lưu, chỉ thay ảnh khác | Ảnh cũ để lại bucket, xoá phải CEO gật |

**Thước đo một lô** (ghi vào DEVLOG): số câu ghi / trùng bỏ / treo · đáp số khớp bộ kiểm · số câu người soát phải sửa (`.sua.json`) ·
số câu máy chuẩn hoá định dạng. 4T: CĐ1 0/48 sửa · lô 6 1/99 · lô 7 2/151 · lô 8–10 (852 câu) vài câu/lô ⇒ trạm soạn Sonnet đứng được với luật v1.
**4T xong cả sách 08/10: 1250 câu** (1213 + lô 11 = 37 câu từ 32 bài có hình trong đề). Bài học lô 8–10: hàm kiểm vét cạn bắt 3 lần Opus tính nhẩm sai (⇒ đúng lý do viết hàm TỪ ĐỀ);
lỗi Sonnet còn lọt máy kiểm là lỗi DIỄN ĐẠT đúng đáp số mà sai lập luận (vd "mỗi số trong hai số đầu hơn TBC 2") ⇒ Opus vẫn phải đọc từng câu.
*(Vá file bằng `node -e` làm mất dấu `\` trong regex 4 lần ở lô 6–7 ⇒ sửa regex luôn dùng Edit.)*

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
| 5 | Đưa **brief giao Sonnet soạn** vào repo (`kho-rules/mau-brief-soan.md`, khuôn như `docs/mau-brief-soan-hinh-hoc.md`) | Lô 5–7 4T brief chỉ nằm trong phiên làm; 5T phải dùng lại, không viết lại từ trí nhớ |
| 6 | ✅ 08/10 **Đọc sách có công thức là ảnh WMF**: WMF của MathType nhúng sẵn MTEF ⇒ `scripts/kho/mathtype-thu/wmf-mtef.mjs` (5T: 1.031/1.031, KaTeX 0 hỏng, không cần OCR/PDF). `tach-bai.mjs` thêm: "LUYỆN TÂP", sách thiếu tiêu đề LUYỆN TẬP (số bài quay lại), khu Ôn tập `ON` — sách 4T tách ra y hệt trước | Word cũ đã "chuyển công thức thành ảnh" vẫn đọc được chính xác |
| 7 | ✅ 08/10 (4T lô 11, 32 bài) **Câu có hình trong đề** — hình GỐC của sách: `scripts/kho/sach/trich-media.mjs` → manifest `kho-rules/dai/hinh-de/<khối>.json` (PNG nào dựng từ ảnh sách nào) → `dung-hinh-de.ps1` (EMF → PNG; bảng Word chữ + biểu tượng ⇒ ghép ảnh bảng từ ảnh gốc) → `lo-tu-soan --hinh-de` → `ghi-lo --hinh-de` upload `anh_de` TRƯỚC khi băm biên bản + trạm `kiem-hinh-de` (code: đúng ảnh của đúng bài). Còn: 5T CĐ18–24 (công thức cũng là WMF — xem #6) | `anh_de` nằm trong băm nội dung ⇒ gắn hình sau khi ghi (kiểu `gan_hinh.mjs`) làm biên bản mất hiệu lực |

## 5. Trạng thái từng khối

| Khối | File | Đang ở bước (§0) | Phiên bản luật | Lô đã duyệt / đã giải | Nguồn |
|---|---|---|---|---|---|
| 4T | `dai/k4T.md` | **Bước 2** đang chạy · bước 3 chờ CEO xong bản đồ 4T | **v1 (08/10)** | lô 1: 13 câu, CEO sửa 2 chỗ · lô 2: 20 câu, chốt 2 luật gán dạng · lô 3: 20 câu, sửa sơ đồ (đúng tỉ lệ) + mọi câu 2 phần · **lô 4: 20 câu, không sửa ⇒ v1** · giải hàng loạt lô 5–8: số câu đã ghi + phần còn lại ở `k4T.md` §8 | Toán arc 4 quyển 1 (Archimedes 2023) |
| 5T | `dai/k5T.md` | **Bước 1** — chưa đọc sách (B1 vướng công thức WMF) | v0 (04/10, rút từ kho cũ) | lô 1: 12 câu (Số thập phân) · 271 câu STP giải lại, chờ học thuật ký | Sách "Tài liệu tham khảo Toán 5" (31 CĐ) — `k5T.md` §5, §7 |
| 8 | `dai/k8.md` | **Bước 1** — B1–B3 xong (đọc 17 file Word, 4.879 công thức 0 hỏng; luật nháp), chưa lô thử | v0 (09/10) — lõi là **luật kiến thức theo thứ tự bài** (§1) | — | Bộ Word theo bài KNTT (C1 Đa thức · C3 Tứ giác · C4 Thalès; thiếu C2) — `E:\BK ACADEMY\Tài liệu tham khảo\K8` |
| 6, 7, 9–12 | — | chưa | — | — | chờ CEO đưa sách mẫu từng khối |
