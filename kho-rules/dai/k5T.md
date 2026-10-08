# kho-rules/dai/k5T.md — Luật GIẢI + TRÌNH BÀY (+ GÁN DẠNG) khối 5T (Toán 5 nâng cao)

> **Trạng thái: NHÁP v0 (04/10) · cập nhật 08/10 theo bài học 4T.** Theo `spec-luong-kho.md` C10: mọi lần giải / gán dạng câu 5T
> PHẢI đọc file này trước. Mỗi lần CEO sửa ⇒ ghi §9 (nhật ký) rồi nâng luật ở §1–§4.
> **Đi theo đường 7 bước ở `kho-rules/README.md` §2, khuôn đã chạy trọn ở 4T** (`k4T.md` v1 — đọc §1.5, §7 của nó để biết CEO đã
> sửa những gì; các luật đó áp luôn cho 5T trừ chỗ ghi khác ở đây).
>
> **Đang ở đâu (08/10):** v0 mới rút từ 1 chuyên đề (Số thập phân, 12 câu mẫu `k5T-mau-thu.md`). Nguồn chuẩn **đổi sang sách**
> "Tài liệu tham khảo Toán 5" (31 chuyên đề — §5). Chưa làm B1–B2 trên sách. Bản đồ 5T mới phủ ~9/31 chuyên đề (§6).
> **Việc kế tiếp + câu hỏi chờ CEO: §7.**

## 0. Nguyên tắc gốc

Lời giải viết **như một học sinh lớp 5 giỏi viết vào vở**, dùng **đúng kiến thức tiểu học**. Phụ huynh tiểu học đọc
phải hiểu được. Nếu một bước chỉ giải được bằng cách "gọi ẩn rồi lập phương trình" ⇒ đổi sang phương pháp tiểu học
(sơ đồ đoạn thẳng / số phần / thử chọn / hiệu không đổi / giả thiết tạm / khử…). Không đổi được ⇒ đưa câu về làn 🔴 hỏi người.

## 1. CẤM (kiến thức/ký hiệu ngoài tiểu học)

| Cấm | Thay bằng |
|---|---|
| `⇒`, `⇔`, `∈`, `{ }`, `∀`, `≤ ≥` trong lập luận | chữ: "nên", "vậy", "suy ra", "là các số", "không lớn hơn" |
| Gọi ẩn ($k$, $x$…) rồi lập phương trình, chuyển vế, nhân hai vế | sơ đồ đoạn thẳng / số phần bằng nhau |
| Biểu thức chữ kiểu $100a + 10b$, $1,01d + 0,1a$ | phân tích theo HÀNG ("chữ số hàng phần mười là…") |
| "Thử $y = 0, 1, …, 9$" liệt kê máy móc | so sánh từng hàng từ trái sang phải |
| Số âm, lũy thừa | — |
| "ước", "bội", "đồng dư", "mod" (lớp 6) | "chia hết cho", "chia cho … dư …" *(bắt ở 4T lô 6, áp luôn 5T)* |
| Công thức tổ hợp, "chỉnh hợp" | đếm theo từng hàng: "Chữ số hàng trăm có … cách chọn" |

Đề có sẵn chữ $y$/$x$ (tìm $y$, tìm chữ số) thì dùng chữ đó bình thường — chỉ cấm TỰ đặt ẩn mới.
*(Khi đọc sách 5T ở B3: rút thêm CHO PHÉP từ "Bài làm" của sách — 4T có ngoại lệ "Bớt cả hai vế đi A" ở cấu tạo số; 5T có hay
không phải xem sách, không suy từ 4T.)*

## 1.5 ⭐ Mỗi lời giải CHIA 2 PHẦN (CEO 04/10)

HS đọc lời giải dễ lẫn giữa *giải thích cách nghĩ* và *cái được viết vào bài thi* ⇒ tách hẳn:

| Phần | Viết gì | Không viết gì |
|---|---|---|
| `**Phần 1. Hướng dẫn**` | Giải thích từng bước: nhận xét gì, dùng quy tắc/tính chất nào, vì sao làm vậy | — |
| `**Phần 2. Trình bày**` | **Đúng cái HS viết vào bài thi:** chỉ có các dòng biến đổi phép tính | Không câu giải thích, không nêu quy tắc, không "Ta có / Nhận xét / Áp dụng" |

- ⭐ **Phần 1 là phần QUAN TRỌNG NHẤT** (CEO 04/10): nó dạy **cách TƯ DUY bài toán** — HS đọc Phần 2 thường không hiểu
  vì Phần 2 không giải thích. Phần 1 KHÔNG được chỉ là "Phần 2 kèm lời". Phải trả lời đủ 3 câu:
  1. **Mấu chốt của bài là gì?** — điều phải nhận ra thì mới giải được (vd "hiệu số tuổi không đổi", "thừa số thứ hai bằng 0",
     "chia cho 0,1 chính là nhân với 10").
  2. **Vì sao lại nghĩ ra hướng đó?** — dấu hiệu nào trong ĐỀ gợi ý cách làm (vd "đề cho hai tỉ số ở hai thời điểm và hỏi tuổi
     ⇒ nghĩ ngay tới đại lượng không đổi"; "các số có phần thập phân giống nhau ⇒ nhóm lại thành số tròn").
  3. **Các bước đi theo mạch suy nghĩ** — mỗi bước nói làm gì và để làm gì.
  Có bẫy/lỗi hay gặp rõ ràng thì thêm 1 câu "Chú ý". Bài quá dễ (1–2 phép tính) thì Phần 1 ngắn, nhưng vẫn phải nói mấu chốt.
- ⭐ **MỌI câu đủ 2 phần** — kể cả câu trắc nghiệm / câu sách chỉ đòi ghi đáp số (CEO 08/10, chốt ở 4T).
- ✅ Bài **lời văn** (CEO chốt 04/10): Phần 2 = **1 câu lời giải ngắn → 1 phép tính** (kèm đơn vị trong ngoặc), lặp lại,
  mở bằng `Bài giải`, kết bằng `Đáp số: …`. Mọi giải thích *vì sao* đưa lên Phần 1.
- ✅ Bài **lập luận** (chữ số, so sánh, tìm số thoả điều kiện — CEO chốt 04/10): Phần 2 = **biến đổi đi kèm lập luận**
  ("Vì … nên …") ở dạng ngắn nhất — đó là nội dung bài thi.
- Bài **tính / tìm $y$ / tính thuận tiện**: Phần 2 chỉ có các dòng biến đổi, không một chữ giải thích — và **mở bằng dòng
  chép lại nguyên biểu thức của đề** (bước bỏ ngoặc / đổi dấu thường chính là mấu chốt, không được nuốt mất).
- Bài lời văn **có tỉ số / số phần** (tổng–tỉ, hiệu–tỉ, hai tỉ số, hai hiệu số, dịch dấu phẩy, chuyển động gặp nhau…): Phần 2 PHẢI
  có dòng `Ta có sơ đồ:` + **HÌNH sơ đồ đoạn thẳng do máy vẽ ĐÚNG TỈ LỆ** (CEO 07–08/10 ở 4T) — `scripts/kho/so-do-doan-thang.mjs`,
  bắt buộc `gia_tri_phan`, máy tự kiểm nhãn tổng/hiệu; nhiều sơ đồ một câu ⇒ mảng. Dòng mô tả bằng lời (`Số A: 3 phần; Số B: 5 phần`)
  vẫn ghi ngay sau `Ta có sơ đồ:` làm alt / bản in. Chi tiết mô tả JSON: `k4T.md` §1.5.
  *(Bản v0 04/10 ghi "app chưa vẽ được nên mô tả bằng lời" — đã lỗi thời từ 07/10.)*
  Mọi bước đổi (hỗn số → phân số, thập phân ↔ phân số) là 1 dòng riêng, không đổi ngầm ở dòng đầu. Dãy cách đều thì
  Phần 2 có 1 dòng phép tính có nhãn: `Số số hạng: $(4,5-0,5):0,4+1=11$` (phép tính, không phải lời giải thích).
- Đừng gọi một số là "số tròn" khi nó không tròn (0,5 hay 14,7 không phải số tròn) — Phần 1 phải khớp ĐÚNG đề, không chép khuôn.
- Bài lập luận: mỗi "Vì … nên …" phải tự đủ lý do — không viết "Vì A nên C" khi còn thiếu bước B ở giữa.
- Bài **nhiều ý a) b) c)**: ý **độc lập** ⇒ tách câu, mỗi câu đủ 2 phần; ý sau dùng kết quả ý trước ⇒ giữ một câu (memory `tach-y-hinh-vs-dai`).
- Ghi chung vào 1 ô `loi_giai`, nhãn in đậm bằng `**…**` (MathText đã hỗ trợ).

## 2. Khuôn trình bày theo dạng — HIỆN MỚI CÓ chuyên đề T15T0202 (Số thập phân)

> Bảng này rút từ kho cũ (04/10), chưa từ sách. **B3 trên sách sẽ thay bằng bảng theo 31 CHUYÊN ĐỀ SÁCH** (như `k4T.md` §2 —
> khuôn Phần 2 + mấu chốt/bẫy từng chuyên đề, rút từ "Bài làm" trong VÍ DỤ). Giữ bảng này tới lúc đó cho CĐ10–13.

| Dạng | Khuôn |
|---|---|
| **020201 Tính chất số thập phân** (so sánh, viết số, đổi phân số ↔ STP) | Đổi về cùng một kiểu số → so sánh **từng hàng từ trái sang phải** → kết luận bằng câu |
| **020202 Tính thuận tiện** | Câu đầu NÊU TÍNH CHẤT dùng (giao hoán, kết hợp, nhân một số với một tổng/hiệu, tích có thừa số 0) → biến đổi từng dòng |
| **020203 Biểu thức hỗn hợp** | Nhắc thứ tự thực hiện → mỗi phép tính một dòng. Nhân/chia với 10, 100, 0,1… thì NÊU quy tắc dịch dấu phẩy. Hỗn số/phân số đổi ra STP trước |
| **020204 Tìm $y$** | Viết **theo cột, mỗi dòng một bước** như vở. Mỗi bước nêu quy tắc thành phần chưa biết ("Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết"). Có $y$ lặp lại ⇒ đưa về "$y$ nhân với một tổng" |
| **020205 Lời văn** | Khuôn **Bài giải**: mỗi bước = 1 câu lời giải + 1 phép tính + đơn vị trong ngoặc. Có tỉ số ⇒ `Ta có sơ đồ:` + hình (§1.5). Kết thúc `Đáp số: …` |
| **020206 Nâng cao cấu tạo STP** | Dịch dấu phẩy = gấp/giảm 10, 100 lần ⇒ quy về **số phần** (số nhỏ 1 phần, số lớn 10 phần). Bài chữ số: lập luận theo hàng + chữ số tận cùng |

## 3. Định dạng (giữ quy ước kho Đại)

- **Mỗi câu lời giải / mỗi phép tính một dòng riêng**, các dòng cách nhau bằng dòng trống (`\n\n`) — CEO 07/10 ở 4T. Phân số
  `\dfrac`. Mỗi công thức một cặp `$…$`.
- Dấu nhân `\times`, dấu chia `:` (không dùng `\div`, không dùng `/`). Dấu phẩy thập phân `,`. Số lớn không chèn dấu cách hàng nghìn
  trong công thức (`25850`). Phần trăm: `$25\%$`.
- Đơn vị trong ngoặc sau phép tính: `$448:8=56$ (kg)`. `\overline{abc}` không `\text`.
- Câu trả lời ngắn vẫn viết đủ bước — "ngắn" là ở **đáp án**, không phải ở lời giải.
- Câu kho cũ: đáp án (`dap_an`) giữ đúng như đáp án hiện có, chỉ đổi lời giải. Đáp án dạng tập hợp `$y \in \{…\}$` ⇒ **hỏi CEO**
  có đổi sang chữ không (vì đụng chấm/form MCQ).

## 4. Kiểm trước khi ghi

- Mọi đáp số được **code tính lại** độc lập (thay ngược vào đề). Câu từ sách: **bộ kiểm khối viết TRƯỚC khi thấy lời giải**
  (`kho-rules/dai/lo/k5T-kiem.mjs` — chưa có, khuôn theo `k4T-kiem.mjs`), không viết hàm kiểm rỗng trả "đạt" giả — kiểm không được
  thì để cờ `khong_kiem_duoc` thật.
- Sai lệch với `dap_an` hiện có / đáp án sách ⇒ không ghi, báo người.
- Hình học (CĐ18–24) và chuyển động (CĐ25–29): máy vẽ hiện chỉ có sơ đồ đoạn thẳng. Câu cần hình phẳng / hình khối / sơ đồ
  chuyển động ⇒ chưa có máy vẽ ⇒ để riêng, không ghi câu thiếu hình (như 4T: câu có ảnh EMF không ghi).

## 5. Hồ sơ nguồn (B1–B2 — mới đo sơ bộ 08/10, CHƯA làm hồ sơ đầy đủ)

**Sách:** `E:\BK ACADEMY\Tài liệu tham khảo\5T\Tài liệu tham khảo Toán 5.docx` (bản sao ở `E:\BK ACADEMY\Tài liệu Claude nhập kho\L5T\`).
2.247 đoạn. Cấu trúc mỗi chuyên đề giống sách 4T: **Kiến thức, kĩ năng cần có → Tóm tắt lí thuyết → VÍ DỤ (có `Bài làm:`) →
LUYỆN TẬP (không lời giải)**; cuối sách **Phần ôn tập kiến thức trọng tâm** (I. Tính toán … XI. Tỉ số phần trăm). Không có phiếu cuối tuần.

**⚠️ Khác 4T ở B1 — đọc không được bằng đường của 4T:** `doc-docx.mjs` báo **0 công thức chữ, 1.154 ảnh** — toàn bộ công thức là
**ảnh WMF** (vd `1.1. ⟦image1033.wmf⟧ ?. Ta có: ⟦image1031.wmf⟧ (dư 3)`). Đọc chữ là mù phần toán. Đường đọc phải là:
`scripts/anh/docx_trich.mjs` (WMF → PNG phóng 4×, đánh dấu vị trí ảnh — đường của kho kiểu 1 Hình, `docs/luong-kho-kieu-1-hinh-hoc.md` B1)
rồi model đọc ảnh chép lại công thức, **hoặc** xuất PDF từ Word rồi đọc PDF (memory `nhap-cau-hgt-tu-pdf`: PDF > DOCX khi WMF).
Bẫy đã biết của WMF: mất dấu / mất ký tự ⇒ đề chép lại phải có **nhân chứng thứ hai** (đáp số trong `Bài làm`, bộ kiểm tính lại khớp),
lệch là để trống hỏi người — không đoán đề (CLAUDE.md §1.5). `tach-bai.mjs` của 4T cần mở rộng cho khuôn này (chưa có PCT/PTL, có khu Ôn tập).

**31 chuyên đề + đếm thô số bài** (đếm nhãn `x.y` in đậm, chưa tách ý, chưa soát — B2 đếm lại bằng tach-bai):

| CĐ | Tên | VD | LT | | CĐ | Tên | VD | LT |
|---|---|---|---|---|---|---|---|---|
| 1 | Ôn tập phân số, hỗn số | 5 | 12 | | 17 | Bài toán khác về tỉ số % | — | 20 |
| 2 | Ba bài toán về phân số | 3 | 26 | | 18 | Hình tam giác | 2 | 16 |
| 3 | Bài toán công việc chung | ~17* | | | 19 | Hình tam giác (tiếp) | 3 | 30 |
| 4 | Ôn tập dãy phân số, hỗn số | ~11* | | | 20 | Hình thang | 2 | 15 |
| 5 | Tỉ lệ thuận – tỉ lệ nghịch | 3 | 21 | | 21 | Hình tròn | 3 | 10 |
| 6 | Ôn tập toán có lời văn | 3 | 24 | | 22 | Hình khối hộp | 2 | 30 |
| 7 | Hai hiệu số | 1 | 20 | | 23 | Cách xếp các hình đơn vị | 3 | 15 |
| 8 | Hai tỉ số | 3 | 20 | | 24 | Bài toán sơn mặt | 1 | 10 |
| 9 | Tính ngược | 3 | 19 | | 25 | Vận tốc, quãng đường, thời gian | 4 | 14 |
| 10 | Số thập phân | 3 | 13 | | 26 | Chuyển động cùng chiều, ngược chiều | 2 | 21 |
| 11 | Đơn vị đo | 3 | 13 | | 27 | Chuyển động dòng nước | 2 | 7 |
| 12 | Các phép tính với số thập phân | 7 | 13 | | 28 | Chuyển động cùng v, s, t | 2 | 9 |
| 13 | Các bài toán về số thập phân | 2 | 43 | | 29 | Chuyển động khác | 3 | 13 |
| 14 | Tỉ số phần trăm | ~19* | | | 30 | Giả thiết tạm | 2 | 14 |
| 15 | Ba bài toán về tỉ số % | 3 | 20 | | 31 | Phương pháp khử | 3 | 10 |
| 16 | Dung dịch, quặng, hạt tươi | 3 | 15 | | Ôn | Ôn tập kiến thức trọng tâm | — | ~123 |

\* CĐ3, 4, 14 không bắt được dòng "LUYỆN TẬP" ⇒ số gộp VD + LT. **Tổng thô ≈ 120 VD + 490 LT + 120 ôn tập ≈ 730 bài** (4T: 910 bài trước tách ý).
Hình: 1.154 ảnh gồm cả công thức lẫn hình vẽ thật (CĐ18–24 nhiều hình) — B2 phải tách hai loại.

## 6. Bản đồ 5T hiện có ↔ sách (đo DB live 08/10, phiên read-only)

`dai_ban_do` khối `5T`: **3 chủ đề · 7 chuyên đề · 22 dạng** (gồm dạng chờ `T15T000000`, 13 câu). Câu: T15T01 394 (380 đã duyệt) ·
T15T02 289 (**16 đã duyệt** — 271 câu Số thập phân giải lại 04/10 vẫn chờ học thuật ký ở màn Duyệt lời giải). Bản nháp
"Bản đồ mới" (`dai_bdm_*`, spec-ban-do-4-tang) đã chép vỏ 5T: 2 chủ đề.

| CĐ sách | Chỗ trên bản đồ 5T hiện tại |
|---|---|
| 1 Ôn tập phân số, hỗn số | `T15T0201` Các phép tính về phân số (2 dạng: cộng trừ nhiều PS · tính thuận tiện) — thiếu hỗn số, so sánh |
| 2 Ba bài toán về phân số | `T15T0104` (4 dạng: phân số của một số · tìm số biết phân số — biết một phần / tổng hiệu các phần / phần còn lại) |
| 6 Ôn tập toán có lời văn | `T15T0101` tổng tỉ – hiệu tỉ hai đại lượng (3 dạng) · `T15T0102` tỉ số nhiều đại lượng (3 dạng) — cần soát chéo với sách |
| 8 Hai tỉ số | `T15T0103` (3 dạng: một đại lượng không đổi · tổng không đổi · hiệu không đổi) |
| 10 Số thập phân | `T15T020201` tính chất STP |
| 12 Phép tính với STP | `T15T020202`–`020204` (thuận tiện · biểu thức hỗn hợp · tìm $y$) |
| 13 Bài toán về STP | `T15T020205`–`020206` (lời văn · nâng cao cấu tạo) |
| **3, 4, 5, 7, 9, 11, 14–31** | **CHƯA CÓ** — 22/31 chuyên đề: công việc chung, dãy phân số, tỉ lệ thuận nghịch, hai hiệu số, tính ngược, đơn vị đo, toàn bộ tỉ số %, toàn bộ hình học (tam giác, thang, tròn, hộp, xếp hình, sơn mặt), toàn bộ chuyển động, giả thiết tạm, khử |

**Hệ quả:** khác 4T (bản đồ 4T dựng từ chính sách 4T, chuyên đề $k$ ↔ chủ đề `T14T0k`), bản đồ 5T hiện là bản đồ từ kho cũ, phủ ~9/31
chuyên đề sách. Lượt gán dạng 5T (§8) chỉ chạy được khi bản đồ 5T đủ — đó là việc "bản đồ kiến thức 5T".

## 7. Kế hoạch 5T — 2 việc ĐỘC LẬP (theo luật CEO 08/10 "giải ≠ gán dạng") + câu chờ CEO

| Việc | Ai | Bước | Phụ thuộc |
|---|---|---|---|
| **A. Bản đồ kiến thức 5T** | CEO soạn, Claude chuẩn bị | Soạn trên **Kho › 🆕 Bản đồ mới** (spec-ban-do-4-tang §0 B2: chia tầng · chép lý thuyết · mô tả nhận biết tầng 3–4). Claude có thể đưa sẵn: danh sách chuyên đề + "Tóm tắt lí thuyết" + dạng gợi ý từ 31 CĐ sách | Không cần việc B |
| **B. Kho 5T từ sách** | Claude (+ Sonnet soạn) | B1 đọc (WMF → PNG/PDF, §5) → B2 hồ sơ + `tach-bai` → B3 nâng luật v0 theo "Bài làm" của sách (bảng 31 CĐ thay §2) → B4 lô thử 10–15 câu phủ nhiều CĐ, ưu tiên CĐ chưa có trong kho → B5–B7 CEO duyệt tới v1 → dây chuyền trạm như 4T lô 5–7 (`kho-rules/README.md` §2b), ghi `--chua-gan-dang` vào `T15T000000` | Không cần việc A |
| **C. Gán dạng 5T** | Claude khớp, Học thuật duyệt | Như spec-ban-do-4-tang B3–B4, dùng §8 dưới (viết khi bản đồ xong) | Cần A + B |

**Câu chờ CEO (R1 — đích, không phải cách đi):**
1. Bản đồ 5T có dựng **theo 31 chuyên đề của sách** như 4T (chuyên đề sách ↔ chủ đề bản đồ) không, hay giữ khung T15T01/T15T02 hiện tại rồi thêm?
2. Hình học tiểu học (CĐ18–24) và chuyển động (CĐ25–29) nằm trong nhánh **Đại** của 5T (như 4T: "Chu vi diện tích" là `T14T05`)?
3. Phần **Ôn tập kiến thức trọng tâm** (~123 bài) có nhập kho không, hay chỉ 31 chuyên đề?
4. 271 câu Số thập phân đã giải lại 04/10 đang chờ học thuật ký — giữ nguyên chờ, hay đợi bản đồ 5T mới rồi duyệt một thể?

## 8. GÁN DẠNG — chưa viết

Viết khi bản đồ 5T xong (việc A): bảng dấu hiệu nhận dạng theo chủ đề nhiều dạng + bảng chỗ bản đồ chưa có dạng, đúng khuôn `k4T.md` §5.
Luật chung đã chốt ở 4T áp luôn: **phương pháp thắng chủ đề** (giải bằng tổng–hiệu ⇒ dạng tổng–hiệu dù câu nằm ở chuyên đề khác) ·
không khớp ⇒ dạng chờ, không ép · bài nhiều ý độc lập tách rồi gán từng ý · CEO duyệt một câu vào dạng mà bảng thiếu đang liệt kê ⇒ xoá
dòng thiếu ngay (nếu không luật tự mâu thuẫn — đã cắn ở 4T) · kiểm bằng model khác gán MÙ.

## 9. NHẬT KÝ SỬA (append-only — CEO sửa gì ghi đó, rồi nâng thành luật ở trên)

| Ngày | Câu | CEO sửa gì | Luật rút ra |
|---|---|---|---|
| 04/10 | 271 câu Số thập phân (T15T0202) | Lời giải cũ kiểu THCS (gọi ẩn, phương trình, `⇒ ∈ {}`) ⇒ giải lại theo cách HS tiểu học. Chốt: lời giải 2 phần, **Phần 1 là phần quan trọng nhất** — dạy cách tư duy | §0, §1, §1.5 |
| 04/10 | Bài lời văn, bài lập luận | Lời văn: "1 câu lời giải → 1 phép tính"; lập luận: biến đổi kèm "Vì … nên …" | §1.5 |
| 04/10 | Đường ghi | *"Sao không đưa lên kho duyệt như bình thường"* ⇒ bỏ trang duyệt riêng, ghi `da_duyet=false`, duyệt ở màn Duyệt lời giải AI | Mọi lô 5T đi đường duyệt chuẩn |
| 08/10 | (từ 4T) | Sơ đồ là HÌNH đúng tỉ lệ (máy vẽ) · mọi câu đủ 2 phần · mỗi câu lời giải một dòng · giải ≠ gán dạng | §1.5, §3, §7 — cập nhật bản v0 theo luật đã chốt ở `k4T.md` §7 |
