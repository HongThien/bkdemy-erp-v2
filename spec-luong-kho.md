# spec-luong-kho.md — LUỒNG KHO: tài liệu vào → bản đồ + câu đạt chuẩn

> **Trạng thái: THIẾT KẾ — CEO đã trả lời 2 vòng (28/09), CTO đề xuất kiến trúc §5–§7, chờ CEO gật + 6 câu §8.**
> Chưa build gì. Khi chốt ⇒ chép intent lên Notion, file này thành spec build.

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
| **T0 Cửa vào** | script | File trong folder → sha256, loại (đề thi / nguồn câu), khối | — |
| **T1 Đọc** | **Gemini API** | Trang PDF → câu thô (đề, phương án, đáp án/lời giải gốc nếu có, khung hình) | Claude nhìn ảnh trang, so từng câu đã bóc (khác model) |
| **T2 Gán + Giải** | Claude | Câu → dạng ứng viên → lời giải theo phương pháp dạng → dạng, cụm, đáp án, lời giải, **làn** | T3 |
| **T3 Kiểm** | code + model khác | Tính lại đáp số bằng code; giải lại không nhìn bài T2; so đáp án gốc nếu có; soi phạm vi kiến thức | — |
| **T4 Hình** | Claude | Ảnh cắt + đề → **bản mô tả hình có cấu trúc** → máy render SVG (AI không vẽ điểm ảnh) | 2 lượt kiểm: (1) code kiểm tính chất hình học/hàm số; (2) model khác so ảnh render với ảnh gốc + đề |
| **T5 Form** | pipeline MCQ sẵn có | Câu chuẩn kho → form MCQ/điền ô theo dạng | Máy kiểm distractor (đã có) |
| **T6 Đề thi** | script | Tài liệu là đề ⇒ ghi cấu trúc vào `tai_lieu*` (đường A) | `fn_de_thi_thieu` |
| **T7 Duyệt** | Học thuật | Màn Duyệt sẵn có + báo cáo lô 3 làn | — |
| **T8 Đo** | trigger DB | Mỗi lần duyệt: khâu nào bị người sửa | — |

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

### 5.5 Luật lên cấp tự duyệt (C9, D11) — đề xuất cách đo

Đứng trên vai: *acceptance sampling / skip-lot* (Dodge–Romig), *statistical process control*.

- Đo theo **(khâu × khối)**; khâu = đọc · gán dạng · gán cụm · đáp số · lời giải · hình.
- **Đạt** = người duyệt mà KHÔNG sửa khâu đó.
- **">95% liên tục"** = 3 lô liên tiếp, mỗi lô ≥50 câu, mỗi lô ≥95% ⇒ khâu đó của khối đó lên cấp.
- Lên cấp ⇒ máy tự duyệt, **vẫn rút ngẫu nhiên 10%** cho người xem. Mẫu tụt <95% ⇒ tự rơi về chế độ người duyệt.
- Câu ở làn 🟡/🔴 **không bao giờ** tự duyệt.

### 5.6 Hình (D11–D13) — cách hiểu của CTO, chờ xác nhận

| Giai đoạn | Điều kiện chuyển | Quy trình |
|---|---|---|
| 1 | khởi đầu | AI sinh → kiểm A → kiểm B → **người duyệt tất cả** |
| 2 | kiểm A và kiểm B cho kết quả trùng nhau ≥95% | bỏ bớt 1 lượt kiểm → AI sinh → 1 lượt kiểm → người duyệt |
| 3 | kết quả kiểm của máy khớp người duyệt ≥95% | máy tự duyệt, người xem mẫu 10% |

Thứ tự làm: đồ thị hàm số · bảng biến thiên · bảng xét dấu (1.734 câu, vẽ được từ mô tả hàm) → hình phẳng → không gian → minh hoạ tiểu học.

### 5.7 Hình hài trong Claude Code

- 1 lệnh điều phối `/kho` (quét folder, chạy các trạm theo `fn_kho_thieu`, in báo cáo lô).
- Skill riêng từng trạm (`kho-doc`, `kho-ban-do`, `kho-gan-giai`, `kho-hinh`, `kho-form`), mỗi skill tự mang rule + script.
- Agent riêng cho người kiểm (`kho-kiem`, `kho-hinh-kiem`) — ngữ cảnh sạch, không thấy bài của người làm.

## 6. Ngoài phạm vi đợt này

Văn/Anh · KHTN · Hình học/HGT (cắm sau khi Đại chạy ổn) · cron tự động · thư viện đề tự luyện (P4 `spec-de-thi.md`) ·
gỡ 3 đường nhập cũ.

## 7. Thứ tự build đề xuất (Đại)

| Pha | Làm gì | Xong khi |
|---|---|---|
| **P0 Nền đo** | Trigger log "người sửa khâu nào" · bộ chấm chạy trên kho đã duyệt (che dạng/lời giải → agent làm lại → so) · hồ sơ dạng + thứ tự chủ đề cho khối pilot | Có con số gốc gán dạng / đáp số cho khối pilot, chạy lại ra đúng số đó |
| **P1 Một cửa** | `/kho`: T0 → T1 (Gemini) → T2 → T3, báo cáo lô 3 làn | 5 tài liệu pilot đi hết luồng, học thuật duyệt trên màn sẵn có |
| **P2 Bản đồ** | Bảng + màn đề xuất dạng/cụm mới · chia cụm cho dạng cũ | 1 lô có dạng mới được duyệt và câu tự về đúng dạng |
| **P3 Hình Đại** | Đồ thị · bảng biến thiên · bảng xét dấu | Vẽ lại 100 câu K12, 2 lượt kiểm + người duyệt |
| **P4 Đề thi + form** | `/kho` ghi đề vào đường A · nối pipeline MCQ | 1 đề vào → phát hành thi online được |
| **P5 Lên cấp** | Luật §5.5 chạy thật · cron | Một khâu của một khối tự duyệt, mẫu 10% giữ ≥95% |

## 8. Câu còn mở

1. ⛔ **Khối pilot.** Đề xuất: **K7** (46 dạng, 1.500 câu, 95% đã duyệt — nền sạch để đo). Hay CEO cần K9/K12 trước vì đề thi?
2. ⛔ **"Chủ đề phía trước"** có gồm (a) mọi khối dưới, (b) nhánh Hình đã học trước đó không? Mặc định: (a) có, (b) không.
3. ⛔ **Bài nhiều ý / bài dùng 2 phương pháp**: mỗi ý 1 dạng, hay 1 dạng chính cho cả bài?
4. ⛔ **Folder nguồn:** `E:\BK ACADEMY\…` không có trên máy đang chạy phiên này. Luồng chạy ở máy nào, đường dẫn nào?
5. **§5.5 cách đo 95%** và **§5.6 ba giai đoạn hình** — đúng ý chưa?
6. **Ranh "quá dễ"** (≤2 bước) và **chia cụm cho 176 dạng cũ** — mặc định: dùng ranh này; agent đề xuất cụm cho cả dạng cũ.
