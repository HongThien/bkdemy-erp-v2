# spec-luong-kho.md — LUỒNG KHO: tài liệu vào → bản đồ + câu đạt chuẩn

> **Trạng thái: THIẾT KẾ — CEO đã trả lời 3 vòng (28/09). Đang BÀN KIẾN TRÚC (§5). Sau kiến trúc mới tới cách build
> skill/agent/flow (§9, chưa viết).** Chưa build gì. Khi chốt ⇒ chép intent lên Notion, file này thành spec build.
> **Đích vận hành (CEO):** đoạn đầu người tham gia nhiều để xây logic; **về sau phần lớn phải TỰ ĐỘNG.**

## 0. Đích (CEO 28/09)

Đưa tài liệu (PDF/Word) vào ⇒ hệ tự: đọc · đề xuất cập nhật bản đồ nếu có dạng mới · gán dạng/cụm từng câu ·
giải bài đúng phạm vi · vẽ hình · chuyển form (chủ yếu MCQ) ⇒ **câu vào kho đạt chuẩn**; đề thi được
**lưu có cấu trúc** thành đề online cho HS thi thử.

6 skill: ① đọc tài liệu · ② tư duy bản đồ (**làm CÙNG CEO, không solo**) · ③ gán nhãn · ④ giải bài đúng phạm vi ·
⑤ vẽ hình · ⑥ chuyển form.

## 1. Quyết định đã chốt (CEO 28/09)

| # | Quyết định | Hệ quả thiết kế |
|---|---|---|
| A1 | Mỗi môn/nhánh logic riêng. **Làm TOÁN ĐẠI trước.** | Khung chung + skill theo nhánh; nhánh khác cắm sau qua registry (§1.6 CLAUDE.md). |
| A2 | **Chạy trên máy CEO.** Vài trăm PDF, mấy chục nghìn câu. Cần **liên tục + ổn định**, không cần nhanh. | Không server. Mọi bước idempotent, đứt giữa chừng chạy lại không nhân đôi. |
| A3 | PDF chữ · PDF scan · Word. **~50% có đáp án.** | Giải bài là đường CHÍNH. Word MathType phải qua PDF. |
| B1 | Luật phân tầng dạng / cụm / biến thể — §2. | |
| B5 | **Làm theo LÔ, trả kết quả 3 làn:** rất tự tin ⇒ phân dạng, chờ duyệt · không thấy trong kho ⇒ **đề xuất dạng mới** · không tự tin ⇒ **trao đổi với CEO**. | Mỗi câu mang `làn` + lý do. Báo cáo lô 1 trang. |
| B6 | **Học thuật được duyệt** (bản đồ lẫn câu). Thời gian duyệt không phải ràng buộc (G19). | Quyền duyệt theo role học thuật, không riêng CEO. |
| B7 | SGK **Kết nối tri thức**. | |
| C8 | Phạm vi = **chỉ dùng kiến thức của chủ đề đó và các chủ đề PHÍA TRƯỚC.** | Cần **thứ tự chủ đề** tường minh — hiện CHƯA có (§3). |
| C9 | **Máy kiểm độc lập + người duyệt.** Khi tỉ lệ đạt **>95% liên tục** ⇒ máy tự duyệt. | Phải ĐO được "người có sửa không" ở từng khâu — hiện chưa đo được (§3). |
| C10 | Chuẩn giải/trình bày **xây dần**: sai lầm tổng kết vào **md riêng từng khối**. AI giải theo **lý thuyết + ví dụ của dạng** là chính. | File `kho-rules/dai/k<khối>.md` — skill giải BẮT BUỘC đọc trước khi giải. |
| D11 | Hình: **AI sinh → AI kiểm 2 lần độc lập → người duyệt.** Nới dần theo ngưỡng 95% (cách hiểu của CTO ở §6, chờ xác nhận). | |
| D12 | **Ảnh cắt từ PDF KHÔNG đạt chuẩn — phải vẽ lại.** | Vẽ hình nằm NGAY trong đợt Đại (3.112 câu Đại đang dùng ảnh cắt). Ảnh cắt chỉ còn là *tham chiếu* để vẽ + để kiểm. |
| D13 | Có hình không gian. | Làm sau hình phẳng/đồ thị. |
| E14 | Hai mức: **chuẩn kho** (đề · đáp án · lời giải · dạng · hình · đã duyệt) / **chuẩn online** (thêm form MCQ/điền ô). | |
| F15 | **Chỉ ĐỀ THI lưu cấu trúc.** Tài liệu khác chỉ là nguồn câu. | Không dựng mô hình lưu trữ cho sách/phiếu. Giữ `ten_de_goc` + sha file để truy nguồn. |
| F16 | Câu mới hay biến thể **không quan trọng** — cùng cụm thì vai trò như nhau. | Không cần quan hệ cha–con giữa câu gần giống; chỉ lọc trùng y hệt. |
| F17 | Không ràng buộc bản quyền. | |
| G18 | **Folder để quét** như hiện tại; CEO thả file rồi báo. Ổn định rồi mới cron. | Giai đoạn đầu chạy có người ngồi cùng (attended). |
| G20 | **Rẻ hơn thì dùng.** Đọc/OCR = **Gemini (API)**. Còn lại = **Claude (quota subscription)**. | |
| V3-1 | **Khối 12 trước** (sẵn tài liệu có đáp án). | Đổi thứ tự build §7: bản đồ K12 → đọc + gán dạng → giải sau. Nền đo K12 mỏng (589 câu đã duyệt). |
| V3-2 | "Chủ đề phía trước" gồm mọi khối dưới, không gồm nhánh Hình. **Thứ tự chủ đề sẽ làm lại 1 lượt.** | Thứ tự chủ đề là việc của lớp Tri thức (§5.0), làm cùng bản đồ K12. |
| V3-3 | **Lý thuyết dạng sẽ bổ sung trong đợt này.** | Hồ sơ dạng xây song song với nhập tài liệu. |
| V3-4 | **Đại số KHÔNG làm nhiều ý — mỗi bài là 1 ý.** Sau này có hệ tiền đề như Hình để ghép bài. | Đề gốc có câu a/b/c ⇒ tách thành các câu riêng lúc đọc. Giữ **khoá nguồn** (tài liệu + số câu gốc + ý) để sau ghép — lưu bây giờ không tốn gì. |
| V3-5 | Folder nguồn: `G:\Other computers\My Computer\BK ACADEMY` (máy này); `E:\BK ACADEMY` (máy gốc). | Gốc folder là CẤU HÌNH theo máy, không viết cứng trong script. |
| V3-6 | Luật 3 giai đoạn của hình: đúng ý CEO, **CEO yêu cầu CTO phản biện** ⇒ §5.5. | |

## 2. Luật phân tầng Dạng / Cụm / Biến thể (CEO 28/09)

- **DẠNG** = các bài có **kiến thức + kĩ năng + phương pháp làm** giống nhau cực nhiều.
- **DẠNG "CƠ BẢN"** = các bài **quá dễ / đơn giản** của một phần ⇒ gộp chung 1 dạng "cơ bản" của phần đó.
- **CỤM BÀI** = các **hình thái** của cùng một dạng: cùng kiến thức–kĩ năng–phương pháp, **hình dạng đề cho khác nhau**.
  Vd: tìm x với tổng = 1 cụm · với hiệu = 1 cụm · với tích = 1 cụm.
- **BIẾN THỂ ĐỔI SỐ** ≠ cụm mới. Cùng cụm thì mọi câu vai trò như nhau.

Đứng trên vai (R7): *deep vs surface structure* (Chi, Feltovich & Glaser 1981) · *Knowledge Component* (Koedinger, KLI) = dạng ·
*item model / item family* (Automatic Item Generation — Gierl & Haladyna) = cụm, *isomorph* = biến thể.

### Phép thử vận hành cho agent (đề xuất CTO)

1. **Dạng:** lời giải chuẩn dùng kiến thức/kĩ năng/phương pháp nào? Trùng dạng có sẵn trong chuyên đề ⇒ cùng dạng.
2. **Cụm:** thay số vào KHUÔN ĐỀ của một cụm có sẵn mà ra được câu này ⇒ cùng cụm. Không ⇒ đề xuất cụm mới.
3. **Không dạng nào khớp:** bài dễ (≤2 bước, áp thẳng 1 định nghĩa/tính chất) ⇒ dạng "cơ bản" của chuyên đề;
   còn lại ⇒ **đề xuất dạng mới** kèm câu làm chứng + dạng gần nhất + vì sao không gộp được.

### GIẢI là nhân chứng thứ hai của GÁN DẠNG

Dạng định nghĩa bằng *phương pháp*, phương pháp chỉ lộ trong *lời giải*. Vòng: đề ⇒ **vài dạng ứng viên** ⇒ giải theo
phương pháp chuẩn của ứng viên ⇒ giải được bằng đúng phương pháp đó = xác nhận dạng; không ⇒ ứng viên kế ⇒ hết thì
"đề xuất dạng mới". Lời giải sinh ra đã bám phương pháp của dạng ⇒ đúng phạm vi.

## 3. Số đo hiện trạng — kho ĐẠI (DB live 28/09, phiên read-only)

| Hạng mục | Số |
|---|---|
| Dạng (trừ dạng chờ) / câu chưa xoá | **685** / **26.760** (TLN 14.612 · TN 7.960 · tự luận 3.148 · Đ/S 1.040) |
| Dạng 0 câu | 160 |
| Dạng có `mo_ta_ngan` | **~0** ⇒ gán dạng hiện chỉ dựa vào TÊN dạng |
| Dạng có lý thuyết | **365 / 685 (53%)** — lệch với "mỗi dạng đều có lý thuyết + ví dụ" (đó là ĐÍCH, chưa phải hiện tại) |
| Tiền đề dạng (`dai_dang_tien_de`) | 0 dòng |
| **Thứ tự chủ đề** | **KHÔNG có cột thứ tự.** Thứ tự mã ≠ thứ tự học (K9 có "Ôn tập 8", "Đề thi đầu vào", "Các dạng nâng cao" là chủ đề-thùng, không phải chủ đề kiến thức) |
| Cụm bài | 288 cụm trên 106/685 dạng; 19% câu có cụm; khối 3·4·5 = 0 cụm; **176 dạng ≥50 câu chưa có cụm** |
| Câu ở dạng chờ | 1.836 (K12 1.516 · K11 307 · 5T 13) |
| Thiếu đáp án / lời giải | 1.394 / 1.796 |
| K12 | 6.056 câu, 589 đã duyệt ⇒ ổ nợ lớn nhất |
| **Ảnh cắt trong câu Đại** | **3.112 câu** (K12 2.104). Đoán loại theo chữ trong đề: đồ thị 1.191 · bảng biến thiên 472 · bảng xét dấu 71 (**3 loại này = 56%, vẽ được bằng máy từ mô tả hàm**) · hình phẳng 229 · không gian 128 · "hình vẽ" chưa rõ 495 · khác 521. Ảnh trong lời giải: 1.013 |
| Form MCQ đã duyệt | TLN 9.613/14.612 · tự luận 1.102/3.148 |
| Đề thi đã lưu (đường A) | 345 |

### Luồng nhập kho đã chạy (11–27/09) — trả lời câu "đề vàng"

| Kênh | File | Câu Đại | Đã duyệt | Ở dạng chờ | Thiếu lời giải |
|---|---|---|---|---|---|
| Noctorium (script, 0 AI) | 343 | 5.638 | **15** | 1.779 | 934 |
| Claude `/nhap-kho co_giai` | 9 | 488 | 354 | 70 | 1 |
| Claude `/nhap-kho khong_giai` | 1 tài liệu, 11 lượt | 97 | 54 | 0 | 0 |

- **390 dòng log nhưng Claude mới đọc 10 tài liệu Đại.** Phần lớn là Noctorium, gần như chưa ai duyệt.
- **Gán dạng trên câu Claude nhập đã được người duyệt: khớp 242 / 326 = 74%.** 84 câu người đổi sang dạng khác
  (Số thập phân 60/131 · Cấp số nhân 24/83 · Toán lời văn số thập phân 18/35). Cảnh báo: một phần có thể do bản đồ
  được chuyển/gộp dạng sau khi nhập chứ không hẳn AI sai — chưa tách được. Dù vậy **còn xa mốc 95%**.
- `dang_ai_de_xuat` toàn kho khớp 98,6% và `kho_tag_log` khớp 96,7% **KHÔNG dùng được**: cột được ghi bằng chính
  `dang_chinh` lúc insert / 361 trên 362 dòng chưa verify.
- **Đề vàng thật sự = chính kho đã duyệt** (§7 P0): che dạng/lời giải của câu người đã duyệt, cho agent làm lại, so.

### Nguồn tài liệu thật trong folder (đếm 28/09)

| Thư mục | PDF | Word | Khác |
|---|---|---|---|
| Kho đề | 1.072 | 175 | |
| Kho dạng bài | 535 | 320 | **51 file GeoGebra `.ggb`** (học thuật đang vẽ hình bằng GeoGebra) |
| Tài liệu tham khảo | 76 | 888 | 192 `.rar` chưa giải nén |
| Giáo trình Toán | 33 | 30 | |
| **Riêng K12** | **358 đề** (171 đề có file đáp án riêng, ghép cặp theo "De so N") | **361** (NBV · PNL · Toán Từ Tâm; NBV tách sẵn cặp `CH`/`DA` theo loại câu) | 87 `.rar` |

- **Lớn hơn "vài trăm":** ~1.700 PDF + ~1.400 Word. Vẫn chạy được trên 1 máy, nhưng là việc nhiều tháng ⇒ ổn định + chạy lại được quan trọng hơn tốc độ.
- **Word K12 = 100% MathType** (6/6 file mẫu: 0 công thức Word, 153–1.269 công thức MathType mỗi file). Máy chạy phiên này
  **không có Word, LibreOffice, `pdftoppm`** ⇒ chưa đọc được file Word nào.
- **Drive là ổ streaming:** đọc 6 file Word mất >4 phút. Trạm đầu phải chép file về đĩa local rồi mới xử lý.
- **Mục lục sách PNL chỉ có 38 "dạng" cho K12**, bản đồ BK có 77 ⇒ hạt của BK mịn hơn; mục lục sách chỉ làm khung
  chuyên đề, dạng phải rút từ chính câu hỏi.

## 4. Hiện trạng 6 skill (tóm tắt)

| Skill | Đã có | Lỗ |
|---|---|---|
| ① Đọc | 4 đường nhập (`/nhap-kho` Claude · NhapKhoScreen Gemini · DeThiScreen Gemini · Noctorium DOCX) | Quy ước lệch nhau; Word MathType không đọc được |
| ② Bản đồ | Cây + mã chuẩn hoá Đại, UI chuyển/gộp/xoá | Không có luồng đề xuất dạng/cụm mới; không có hồ sơ dạng; không có thứ tự chủ đề |
| ③ Gán nhãn | Dạng chờ sentinel; `kho_doi_dang_log` (trigger) | Chưa gán CỤM; thước đo không tin được |
| ④ Giải | `spec-giai-bai-ai.md`, `hangdoi-giai.mjs`, scheduler | Không kiểm soát phạm vi; verify là lời dặn, script không ép; chưa log "người sửa lời giải" |
| ⑤ Vẽ hình | Cắt ảnh từ nguồn | 0 công cụ vẽ |
| ⑥ Form | `mcq-auto/sinh/dien` | Phủ theo từng dạng; 25 dạng chưa có MCQ |
| Đề thi | Đường A + thi online trên lớp | `/nhap-de-thi` còn ghi đường B đã ngừng; P4 tự luyện chưa làm |

## 5. Kiến trúc đề xuất

### 5.0 Ba lớp + bánh đà (đây là thứ biến "người làm nhiều" thành "tự động")

| Lớp | Là gì | Ai làm | Nhịp |
|---|---|---|---|
| **TRI THỨC** | Bản đồ · thứ tự chủ đề · hồ sơ dạng · `kho-rules/dai/k<khối>.md` | Học thuật + Claude, **ngồi cùng nhau** (sparring) | Theo đợt |
| **DÂY CHUYỀN** | Các trạm T0–T6: đọc → gán → giải → kiểm → hình → form → đề | **Script điều phối**, AI là thợ ở từng trạm | Chạy nền, liên tục |
| **ĐO** | Trigger ghi người sửa gì · bộ chấm · luật lên cấp | DB | Tự động |

**Bánh đà:** người sửa 1 câu ở màn duyệt ⇒ lớp ĐO ghi lại sửa khâu nào ⇒ cuối lô, Claude gom các lần sửa thành *đề xuất
luật* (bổ sung hồ sơ dạng / `kho-rules`) ⇒ học thuật gật ⇒ lớp TRI THỨC dày lên ⇒ lô sau dây chuyền sai ít hơn ⇒ khâu đó
lên cấp. **Không có bánh đà thì người duyệt sửa cùng một lỗi mãi** — đó là chỗ các luồng nhập hiện tại đang đứng.

**Dây chuyền là WORKFLOW, không phải AGENT tự do.** Đường đi đã biết trước ⇒ script quyết thứ tự, AI chỉ được gọi cho đúng
phần cần phán đoán, mỗi lần một việc hẹp, trả về JSON theo khuôn. (Đứng trên vai: phân biệt *workflow vs agent* trong
"Building effective agents" của Anthropic — đường đi biết trước thì dùng workflow: rẻ hơn, đoán trước được, đo được.)
Agent tự do chỉ dùng ở lớp TRI THỨC, nơi cần bàn bạc.

**4 cấp tự động của MỖI khâu** (đứng trên vai: *levels of automation*, Sheridan & Verplank):

| Cấp | Máy | Người |
|---|---|---|
| 1 | Làm | Duyệt 100% |
| 2 | Làm + tự kiểm | Duyệt 100%, nhưng máy đã xếp câu nghi lên đầu |
| 3 | Làm + tự kiểm + tự duyệt | Xem mẫu 10% + câu máy nghi |
| 4 | Như cấp 3 | Chỉ xem khi hậu kiểm từ bài làm HS nêu cờ |

Mỗi khâu × mỗi khối đứng ở một cấp riêng. Đáp số trắc nghiệm có thể lên cấp 3 rất sớm; vẽ hình không gian có thể ở cấp 1 rất lâu.

### 5.1 Nguyên tắc

1. **Trạng thái pure-derive, không bảng job.** `fn_kho_thieu(...)` trả từng câu thiếu gì (dạng · cụm · đáp án · lời giải ·
   hình · form). Việc = must-exist − does-exist. Mẫu: `fn_de_thi_thieu`.
2. **Tài liệu MỚI và NỢ CŨ chung một hàng đợi** — cùng trạm lấp cùng loại lỗ.
3. **Một cửa vào** thay 4 đường. Noctorium/NhapKhoScreen/DeThiScreen giữ nguyên tới khi cửa mới chạy ổn rồi mới bàn gỡ (Luật xoá).
4. **Người làm và người kiểm phải KHÁC CÁCH, không chỉ khác lượt.** Hai lượt cùng một model dễ sai giống nhau ⇒ "độc lập"
   = (a) máy tính lại bằng code, hoặc (b) model khác (Gemini ↔ Claude), hoặc (c) cùng model nhưng ngữ cảnh sạch + không
   thấy bài của người làm. Ưu tiên (a) > (b) > (c).
5. **Mỗi khâu có thước đo riêng**, ghi bằng TRIGGER lúc người duyệt (§4 CLAUDE.md) — app/agent không tự nhớ ghi.

### 5.2 Các trạm

| Trạm | Ai làm | Vào → Ra | Kiểm độc lập |
|---|---|---|---|
| **T0 Cửa vào** | script | File trong folder → **chép về đĩa local** → sha256, loại (đề thi / nguồn câu), khối, ghép cặp đề ↔ đáp án | — |
| **T1 Đọc** | 3 đường theo loại file (dưới bảng) | Trang → câu thô (đề, phương án, đáp án/lời giải gốc nếu có, khung hình); câu a/b/c tách thành câu riêng, giữ khoá nguồn | Claude nhìn ảnh trang, so từng câu đã bóc (khác model) |
| **T2 Gán + Giải** | Claude | Câu → dạng ứng viên → lời giải theo phương pháp dạng → dạng, cụm, đáp án, lời giải, **làn** | T3 |
| **T3 Kiểm** | code + model khác | Tính lại đáp số bằng code; giải lại không nhìn bài T2; so đáp án gốc nếu có; soi phạm vi kiến thức | — |
| **T4 Hình** | Claude | Ảnh cắt + đề → **bản mô tả hình có cấu trúc** → máy render SVG (AI không vẽ điểm ảnh) | 2 lượt kiểm: (1) code kiểm tính chất hình học/hàm số; (2) model khác so ảnh render với ảnh gốc + đề |
| **T5 Form** | pipeline MCQ sẵn có | Câu chuẩn kho → form MCQ/điền ô theo dạng | Máy kiểm distractor (đã có) |
| **T6 Đề thi** | script | Tài liệu là đề ⇒ ghi cấu trúc vào `tai_lieu*` (đường A) | `fn_de_thi_thieu` |
| **T7 Duyệt** | Học thuật | Màn Duyệt sẵn có + báo cáo lô 3 làn | — |
| **T8 Đo** | trigger DB | Mỗi lần duyệt: khâu nào bị người sửa | — |

**T1 — ba đường đọc:**

| Loại file | Đường đọc | Ghi chú |
|---|---|---|
| PDF (chữ hoặc scan) | Ảnh trang → Gemini | Đường hiện có, đã chạy |
| Word, công thức Word | `docx-doc.mjs` đọc thẳng | Đã có. Chính xác tuyệt đối, không tốn AI |
| **Word, công thức MathType** | **(a)** đọc thẳng dữ liệu MathType nhúng trong file → LaTeX, không qua OCR · **(b)** đổi sang PDF rồi đi đường Gemini | (a) chính xác + miễn phí nhưng **chưa kiểm chứng làm được** — cần thử trên 3 file trước khi tin. (b) chắc chắn chạy nhưng cần cài LibreOffice/Word. **Thử (a) trước, (b) là đường lùi.** |

**Trạng thái trung gian** (câu thô từng trang, dạng ứng viên, phán quyết của người kiểm, bản mô tả hình) nằm ở **thư mục làm
việc trên đĩa local**, khoá bằng sha256 của file — là bộ đệm, dựng lại được từ file gốc. **DB chỉ nhận dòng khi có kết quả thật**
(§1.5 CLAUDE.md): câu đã đọc + đã qua kiểm đọc. Mọi thứ NGƯỜI cần nhìn/duyệt thì ở DB.

### 5.3 Bản đồ — 3 làn của mỗi lô (B5)

| Làn | Điều kiện | Hệ làm gì | Người làm gì |
|---|---|---|---|
| 🟢 Tự tin | Có dạng khớp + giải được bằng phương pháp của dạng + T3 khớp | Ghi câu `da_duyet=false`, gán dạng/cụm | Duyệt |
| 🟡 Đề xuất mới | Không dạng/cụm nào khớp phép thử §2 | Ghi **đề xuất** (tên, mô tả, thuộc chuyên đề nào, câu làm chứng, dạng gần nhất, vì sao không gộp). Câu nằm dạng chờ | Gật / sửa / gộp vào dạng cũ |
| 🔴 Cần trao đổi | Hai ứng viên ngang nhau, hoặc T3 lệch, hoặc nghi đề sai | Câu nằm dạng chờ, kèm câu hỏi cụ thể | Trả lời; câu trả lời được chép vào hồ sơ dạng / `kho-rules` |

Đề xuất dạng/cụm **không ghi thẳng vào bản đồ** — nằm ở bảng đề xuất tới khi học thuật duyệt (canonical không bị measurement làm bẩn, §5 CLAUDE.md).

### 5.4 Hồ sơ dạng + luật phạm vi

- **Hồ sơ dạng** = kiến thức · kĩ năng · phương pháp chuẩn · dấu hiệu nhận biết · câu mẫu · dạng hay nhầm · các cụm.
  Agent nháp từ lý thuyết dạng + câu đã duyệt; học thuật duyệt. Là đầu vào của T2 và T3.
- **Thứ tự chủ đề** (cho C8): thêm thứ tự học tường minh cho chủ đề trong khối; chủ đề-thùng ("nâng cao", "đề thi", "ôn tập")
  đánh dấu riêng — phạm vi = cả khối. Học thuật xếp 1 lần / khối.
- **`kho-rules/dai/k<khối>.md`** (C10): bài học giải + trình bày của khối, tích luỹ từ mỗi lần người sửa.

### 5.5 Luật lên cấp — PHẢN BIỆN luật "95%" (CEO yêu cầu 28/09)

Khung 3 giai đoạn của CEO **giữ nguyên**. Cái cần sửa là **thước đo** — đo như phát biểu ban đầu thì hệ sẽ tự lên cấp trong khi vẫn sai.

| # | Lỗ hổng | Vì sao nguy | Sửa thành |
|---|---|---|---|
| 1 | **"Hai lượt kiểm trùng nhau ≥95%" đo sự ĐỒNG THUẬN, không đo ĐÚNG.** | Hai lượt cùng một model mù cùng một chỗ ⇒ trùng nhau 100% khi cả hai cùng sai. | Bỏ lượt kiểm B khi **B không bắt thêm được lỗi nào mà A sót** (đo trên các câu người đã sửa), không phải khi B trùng A. |
| 2 | **"Máy khớp người ≥95%" bị tỉ lệ nền đánh lừa.** | Nếu người làm vốn đúng 97% thì một người kiểm **luôn nói "đạt"** cũng khớp 97%. Người kiểm vô dụng vẫn qua ngưỡng. | Đo **tỉ lệ LỌT** = trong các câu máy cho đạt, bao nhiêu câu người vẫn phải sửa. Và **tỉ lệ BẮT** = trong các câu người sửa, máy đã nêu cờ được bao nhiêu. |
| 3 | **Người duyệt không phải chân lý.** Máy đúng 90% thì người duyệt quen tay bấm gật. | Đã xảy ra: 13/09 ~60 câu lệch dạng được duyệt kế thừa luôn. Người gật bừa ⇒ số đẹp ⇒ máy tự lên cấp. | **Cài câu bẫy:** trộn vào hàng duyệt một ít câu máy cố ý làm sai. Lô nào người duyệt không bắt được bẫy thì **không tính** vào chuỗi lên cấp. |
| 4 | **Một ngưỡng 95% cho mọi loại lỗi.** | 5% lọt trên 26.760 câu = ~1.300 câu sai tới tay HS. Đáp số sai ⇒ chấm sai ⇒ mastery sai; trình bày xấu thì không. | Ngưỡng theo mức nặng: **đáp số / đáp án / hình sai về toán: lọt ≤1%** · dạng, cụm, trình bày, hình xấu: lọt ≤5%. |
| 5 | **"Liên tục" không chống được đổi nguồn.** | 95% trên Hàm số không nói gì về Xác suất; 95% trên PDF chữ không nói gì về PDF scan. | Lên cấp theo **khâu × chủ đề × loại nguồn**. Dạng mới, nguồn mới ⇒ bắt đầu lại ở cấp 1. |
| 6 | **Sau khi tự duyệt thì ai canh?** | Mẫu 10% vẫn là người xem, vẫn dính lỗ #3. | Thêm nhân chứng không phải người: **bài làm của HS**. Câu mà HS giỏi sai nhiều bất thường ⇒ nghi đáp án sai ⇒ tự rút khỏi kho chuẩn, về hàng duyệt. |

Đứng trên vai: *acceptance sampling / skip-lot* (Dodge–Romig) · *error seeding* (Mills) và *gold questions* trong chấm chéo ·
*automation bias* · *item analysis* của lý thuyết trắc nghiệm cổ điển (độ khó, độ phân biệt) cho lỗ #6.

**Luật sau phản biện:**

- Đo theo **khâu × chủ đề × loại nguồn**; khâu = đọc · gán dạng · gán cụm · đáp số · lời giải · hình.
- Lên cấp khi **3 lô liên tiếp**, mỗi lô ≥50 câu, tỉ lệ lọt dưới ngưỡng của khâu đó, **và** người duyệt bắt được câu bẫy của lô.
- Lên cấp rồi vẫn rút mẫu 10%. Mẫu vượt ngưỡng lọt ⇒ tự rơi về cấp dưới.
- Câu ở làn 🟡/🔴 không bao giờ tự duyệt.
- **Lượt kiểm bằng code không bao giờ bị bỏ** — nó miễn phí và không biết mệt.

### 5.6 Hình (D11–D13)

Hai lượt kiểm của hình **không phải hai lượt giống nhau** mà kiểm hai thứ khác nhau, nên không thay được cho nhau:

| Lượt | Kiểm cái gì | Ai |
|---|---|---|
| A | Hình render ra có ĐÚNG với bản mô tả không (cực trị đúng chỗ, tiệm cận đúng, thẳng hàng, vuông góc) | **Code** — tính lại bằng toạ độ |
| B | Bản mô tả có ĐÚNG với đề + ảnh gốc không (đọc nhầm số, thiếu nhãn, sót điểm) | **Model khác** người vẽ |

| Giai đoạn | Điều kiện chuyển | Quy trình |
|---|---|---|
| 1 | khởi đầu | AI viết bản mô tả → máy render → kiểm A + kiểm B → **người duyệt tất cả** |
| 2 | lượt B thứ hai không bắt thêm lỗi nào so với lượt B thứ nhất | còn 1 lượt B (lượt A giữ nguyên) → người duyệt |
| 3 | tỉ lệ lọt ≤1% (sai toán) và ≤5% (xấu), người duyệt bắt được bẫy | máy tự duyệt, người xem mẫu 10% |

Thứ tự làm: đồ thị hàm số · bảng biến thiên · bảng xét dấu (1.734 câu, vẽ được từ mô tả hàm) → hình phẳng → không gian → minh hoạ tiểu học.

**Chưa chốt — định dạng bản mô tả hình:** học thuật đang vẽ bằng GeoGebra (51 file `.ggb` trong Kho dạng bài). Nếu bản mô tả
mở được bằng GeoGebra thì người duyệt **sửa hình bằng công cụ quen tay** thay vì trả về cho AI vẽ lại.

### 5.7 Hình hài trong Claude Code

- 1 lệnh điều phối `/kho` (quét folder, chạy các trạm theo `fn_kho_thieu`, in báo cáo lô).
- Skill riêng từng trạm (`kho-doc`, `kho-ban-do`, `kho-gan-giai`, `kho-hinh`, `kho-form`), mỗi skill tự mang rule + script.
- Agent riêng cho người kiểm (`kho-kiem`, `kho-hinh-kiem`) — ngữ cảnh sạch, không thấy bài của người làm.

## 6. Ngoài phạm vi đợt này

Văn/Anh · KHTN · Hình học/HGT (cắm sau khi Đại chạy ổn) · cron tự động · thư viện đề tự luyện (P4 `spec-de-thi.md`) ·
gỡ 3 đường nhập cũ.

## 7. Thứ tự build đề xuất (Đại, **K12 trước** — CEO 28/09)

K12 trước đổi thứ tự so với bản nháp cũ ở 2 điểm: **bản đồ phải đi trước dây chuyền** (K12 đang có 1.516 câu nằm dạng chờ vì
thiếu dạng; `spec-de-thi.md` quyết định #10 cũng chốt "bản đồ làm trước rồi mới nhập đề"), và **giải bài lùi ra sau** vì nguồn
K12 có sẵn đáp án — lời giải gốc còn là nhân chứng tốt nhất cho việc gán dạng (phương pháp lộ ngay trong lời giải).

| Pha | Làm gì | Xong khi |
|---|---|---|
| **P0 Nền** | Trigger log "người sửa khâu nào" · T0 (chép local, sha, ghép cặp đề ↔ đáp án) · thử đọc thẳng MathType trên 3 file · gốc folder thành cấu hình | Biết chắc đọc được Word K12 bằng đường nào; mỗi lần người sửa đều có vết |
| **P1 Bản đồ K12** | Sparring: khung chuyên đề (SGK Kết nối tri thức + mục lục NBV/PNL/Từ Tâm) → thứ tự chủ đề → dạng rút từ câu → hồ sơ dạng. Bảng + màn đề xuất dạng/cụm | Học thuật chốt bản đồ K12; 1.516 câu dạng chờ có chỗ để về |
| **P2 Đọc + gán** | T1 → T2 (chỉ gán dạng/cụm, dùng lời giải gốc làm nhân chứng) → T3 kiểm, báo cáo lô 3 làn. Nguồn đầu: 171 đề có đáp án + bộ NBV | 10 tài liệu đi hết luồng, học thuật duyệt trên màn sẵn có, có con số lọt/bắt đầu tiên |
| **P3 Bánh đà** | Gom các lần người sửa → đề xuất luật cho hồ sơ dạng / `kho-rules/dai/k12.md` | Lô sau có tỉ lệ lọt thấp hơn lô trước, đo được |
| **P4 Giải** | T2 đầy đủ (giải theo phương pháp dạng, trong phạm vi) cho nửa tài liệu không đáp án + 1.394 câu nợ đáp án | Đáp số qua kiểm bằng code; lời giải qua người duyệt |
| **P5 Hình** | Đồ thị · bảng biến thiên · bảng xét dấu (K12 có 2.104 câu ảnh cắt) | Vẽ lại 100 câu, kiểm A + B + người duyệt |
| **P6 Đề thi + form** | Ghi đề vào đường A · nối pipeline MCQ | 1 đề vào → phát hành thi online được |
| **P7 Lên cấp + cron** | Luật §5.5 chạy thật, câu bẫy, hậu kiểm từ bài làm HS | Một khâu tự duyệt mà tỉ lệ lọt giữ dưới ngưỡng |

## 8. Câu còn mở

Đã đóng ở vòng 3: khối pilot (K12) · "phía trước" · bài nhiều ý · folder nguồn.

1. ⛔ **Sáu điểm sửa thước đo ở §5.5** — CEO nhận điểm nào? Đặc biệt: ngưỡng lọt 1% cho đáp số/hình sai toán, và **câu bẫy** cho người duyệt.
2. ⛔ **Máy chạy dây chuyền là máy nào?** Máy phiên này không có Word/LibreOffice; folder ở đây là ổ streaming. Máy gốc (`E:\`) có Word không?
3. ⛔ **Hình sửa bằng GeoGebra?** Học thuật có muốn mở hình AI vẽ bằng GeoGebra để sửa tay không?
4. **Dây chuyền là workflow (script điều phối), agent tự do chỉ ở lớp Tri thức** (§5.0) — CEO đồng ý hướng này không?
5. *(CEO hoãn, bàn sau kiến trúc)* ranh "quá dễ" (≤2 bước) · chia cụm cho 176 dạng cũ.

## 9. Cách build skill / agent / flow

*(Chưa viết — bàn sau khi chốt kiến trúc §5.)*
