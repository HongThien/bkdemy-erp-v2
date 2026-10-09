# kho-rules/dai/k5T.md — Luật GIẢI + TRÌNH BÀY (+ GÁN DẠNG) khối 5T (Toán 5 nâng cao)

> **Trạng thái: ⭐ v1 (09/10) — CEO duyệt 4 lô sách (101 câu, một lượt qua mọi dạng của sách): *"OK rồi. Lên V1 thôi."***
> *(lịch sử: NHÁP v0 04/10 từ kho cũ → bước 1 trên sách 08–09/10 → v1 09/10)*. Theo `spec-luong-kho.md` C10: mọi lần giải / gán dạng câu 5T
> PHẢI đọc file này trước. Luật vẫn sống: CEO sửa ở đâu ⇒ ghi §9 (nhật ký) rồi nâng luật ở §1–§4.
> **Quy trình 3 bước mọi khối: `kho-rules/README.md` §0** (1 rút luật giải → 2 giải toàn bộ tài liệu, lên DB dạng chờ → 3 CEO xong bản đồ thì xếp bài vào, CEO duyệt).
> **5T đang ở BƯỚC 2** — giải toàn bộ sách (~750 bài) theo dây chuyền `kho-rules/README.md` §2b, ghi `--chua-gan-dang` vào `T15T000000`.
> Khuôn đã chạy trọn ở 4T (`k4T.md` v1 — §1.5, §7); luật 4T áp cho 5T trừ chỗ ghi khác ở đây.
>
> **Bước 1 đã làm:** B1 đọc sách (công thức WMF ra LaTeX 1.031/1.031 — §5) · B2 tách bài (750 bài) · B3 rút khuôn từ 82 VÍ DỤ (§1 cho phép, §2b)
> · B4 một lượt qua các dạng: 4 lô, 101 câu (cuối `k5T-mau-thu.md`). **Bước 2:** tiến độ ở §8b. Hình đề hỏng (13 bài) vẽ lại bằng code (§1).
> Bản đồ 5T mới phủ ~9/31 chuyên đề (§6) — bản đồ là việc của CEO.

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

**CHO PHÉP vì sách 5T làm vậy (rút từ "Bài làm" trong VÍ DỤ, 08/10 — chờ CEO xác nhận ở lô có các CĐ này):**
- **Phương pháp khử (CĐ31):** được "Gọi giá 1 bút xanh là $X$ (nghìn đồng), giá 1 bút đỏ là $D$" rồi viết hai dòng
  $3\times X+7\times D=134\ (1)$ · $3\times X+4\times D=92\ (2)$, nhân một dòng cho cùng hệ số, **lấy dòng này trừ dòng kia** để khử
  (VD 31.1–31.3). Viết $3\times X$, không viết $3X$. KHÔNG "chuyển vế".
- **Hình học (CĐ18–21):** ký hiệu $S_{ABC}$. **Tỉ số diện tích viết ĐẦY ĐỦ CÂU (CEO 09/10):** "Tam giác AMC và tam giác ABC có chung
  đường cao hạ từ A xuống BC, suy ra $\dfrac{S_{AMC}}{S_{ABC}}=\dfrac{MC}{BC}=\dfrac{2}{3}$" — không để lý do trong ngoặc sau công thức như VD 19.2.
  Hình tròn: $r\times r=28,26:3,14$ (không $r^2$); $\pi$ viết $3,14$.
- **Hình đề hỏng (CEO 09/10 OK):** 13 bài sách có hình hỏng (vùng tô thành khối đen) + LT 19.18 (hình ghi E, đề ghi M) ⇒ **vẽ lại hình bằng code**
  theo đúng số liệu đề (máy vẽ, máy kiểm — như hình đề kho Hình), không dùng ảnh sách.
- **Tỉ số phần trăm (CĐ14–17) — CEO 09/10:** tìm $a\%$ của $M$ viết $M\times a\%$ ($80\times 25\%=20$); tìm số biết $b\%$ của nó là $M$
  viết $M:b\%$ ($24:12\%=200$). KHÔNG dùng kiểu $200\times 6:100$ của VD 16. **Nhân hai tỉ số phần trăm phải viết thêm bước đổi ra số
  thập phân** cho HS dễ hiểu: $125\%\times 75\%=1,25\times 0,75=0,9375=93,75\%$.
- **Chuyển động (CĐ25–29):** dòng "Đổi: 2,5 giờ = 2 giờ 30 phút" riêng; cộng/nhân số đo thời gian viết liền một dòng (VD 25.3).
  **⭐ Bài chuyển động có quãng đường PHẢI có sơ đồ minh hoạ** (CEO 09/10: *"vẽ được sơ đồ minh hoạ là chuẩn, bài chuyển động rất cần"*) —
  sách không vẽ nhưng kho vẽ: `Ta có sơ đồ:` ngay sau `Bài giải`, máy vẽ `scripts/kho/so-do-chuyen-dong.mjs` (mô tả `"loai": "chuyen_dong"`:
  điểm đúng tỉ lệ km/m · mũi tên xe kèm vận tốc · khoảng cách có nhãn, máy kiểm nhãn số khớp vị trí · cầu/đoàn tàu là đoạn đậm). Bài
  chuyển động có tỉ số (CĐ28) vẽ THÊM sơ đồ đoạn thẳng tỉ số (CEO: vẽ được sơ đồ minh hoạ là chuẩn) — khác hai tỉ số CĐ8.
- **Cấu tạo số (Ôn IV) — CEO 09/10:** bài **thêm / bớt chữ số bên trái, bên phải** là **bài toán tỉ số** ⇒ giải bằng **sơ đồ** (số cũ $1$ phần,
  số mới $10$ phần và $c$…). Bài **đề cho sẵn cấu tạo số** (vd $\overline{abcd}+\overline{abc}+\overline{ab}+a=3132$, $7\times\overline{ab}=\overline{3ab}$)
  ⇒ **giải như cấu tạo số**: phân tích số theo hàng, viết rõ dấu nhân ($\overline{3ab}=300+\overline{ab}$; $\overline{abcd}=a\times 1000+b\times 100+c\times 10+d$),
  "bớt cả hai vế" như 4T CĐ12 — cấm viết tắt $100a$, cấm "chuyển vế".
- **Nhiều cách (CEO 08/10):** sách hay cho 2–3 cách. Claude **không tự chọn** — nêu các cách để CEO chốt **một cách chính** cho cả dạng (bảng §2b);
  Phần 2 chỉ trình bày cách chính.
- **Sơ đồ (CEO 08/10):** dạng nào sách có sơ đồ thì kho có sơ đồ (*"có sơ đồ vẫn là tốt nhất"*). Ngoại lệ: **hai tỉ số (CĐ8) không sơ đồ** — cách chuẩn là phân số của đại lượng không đổi.

## 1.5 ⭐ Mỗi lời giải CHIA 2 PHẦN (CEO 04/10)

> **⭐ Phần 1 nhiều bước ⇒ mỗi bước một CARD, mũi tên sang card kế (CEO 09/10, `kho-rules/README.md` §3):** mỗi bước là một đoạn riêng mở bằng `**Bước k.**`; `**Mấu chốt:**` đứng trước chuỗi bước, `**Chú ý:**` đứng sau; chỉ dùng khi ≥ 2 bước. **Tách ý** chỉ cho bài *Tính* và *Tìm $x$*; bài lời văn giữ chung một câu.

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

## 2b. Dạng có NHIỀU CÁCH giải — CEO chốt MỘT cách chính (CEO 08/10: "nói ra bàn với t, chốt một cách chính thôi")

> Claude không tự chọn. Cột "Chốt" để trống = chưa được giải hàng loạt dạng đó. Phần 2 chỉ trình bày cách chính; cách khác
> nhắc một câu ở Phần 1 nếu đáng dạy. Gặp dạng nhiều cách mới ⇒ thêm dòng, hỏi CEO.

| # | Dạng (nguồn sách) | Các cách sách đưa | Claude đề xuất | Chốt |
|---|---|---|---|---|
| A | Cộng/trừ hỗn số (VD 1.3) | ① đổi hỗn số ra phân số rồi tính · ② tính riêng phần nguyên và phần phân số | ① làm chính; ② khi "tính thuận tiện" | ✅ **② ưu tiên.** Số to (đổi ra phân số thì tử số lớn) ⇒ bắt buộc ②; số bé mới dùng ① |
| B | Tỉ lệ thuận / nghịch (VD 5.1, 5.2) | ① rút về đơn vị · ② lập tỉ số ("gấp mấy lần") · ③ quy tắc tam suất | ① — làm được cả khi số lần không tròn | ✅ **①** rút về đơn vị |
| C | Tỉ lệ kép (VD 5.3) | ① "phương pháp ba dòng" (đổi từng đại lượng một) · ② tam suất kép · (③ rút về "1 người trong 1 ngày") | ③ — cùng một ý với B① | ✅ **③** rút về "1 người trong 1 ngày" |
| D | Tính ngược có phân số (VD 9.2) | ① sơ đồ lồng nhau + tính theo phần ($6\times 4=24$; $24:3\times 5=40$) · ② phân số "… ứng với … (số cam ban đầu)" rồi chia | ① (sơ đồ) | ✅ **②** phân số. ① chỉ để làm quen, dùng khi GV giảng bài — KHÔNG đưa vào lời giải kho (⇒ không cần sơ đồ lồng) |
| E | Xếp hình lập phương nhỏ (VD 23.2, 23.3) | ① thể tích lớn : thể tích nhỏ · ② cạnh lớn gấp cạnh nhỏ mấy lần rồi nhân 3 chiều | ② — dùng được cả khi xếp còn thừa (VD 23.3b) | ✅ **②** |
| F | Dãy phân số mẫu gấp đôi (lô 1 câu 11; sách 5T không có VD) | ① "$2\times B-B$" · ② viết mỗi số hạng thành hiệu hai phân số | ① | ✅ **①** |
| G | Tìm $a\%$ của một số (CĐ14–17) | ① $200\times 25\%$ (Tóm tắt CĐ15, VD 15.2) · ② $200\times 25:100$ (VD 16.1–16.3) | ① — đồng bộ cả CĐ14–17; chiều ngược $M:b\%$ | ✅ **①** $M\times a\%$ · ngược $M:b\%$ |
| — | Hai tỉ số (CĐ8) | phân số của đại lượng không đổi | — | ✅ CEO 08/10: không sơ đồ |

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

## 5. Hồ sơ nguồn (B1–B2 xong 08/10)

**Sách:** `E:\BK ACADEMY\Tài liệu tham khảo\5T\Tài liệu tham khảo Toán 5.docx` (bản sao ở `E:\BK ACADEMY\Tài liệu Claude nhập kho\L5T\`).
2.247 đoạn. Cấu trúc mỗi chuyên đề giống sách 4T: **Kiến thức, kĩ năng cần có → Tóm tắt lí thuyết → VÍ DỤ → LUYỆN TẬP (không lời giải)**;
cuối sách **Phần ôn tập kiến thức trọng tâm** (13 mục I. Tính toán … XIII. Một số bài toán tư duy, đánh số bài 1, 2, 3… liên tục).
Không có phiếu cuối tuần / phiếu tự luyện.

**B1 — đọc (công thức là ảnh WMF, KHÔNG phải OLE như 4T):** `doc-docx.mjs` ra 0 công thức chữ, 1.154 ảnh. Nhưng WMF do MathType sinh
có **nhúng nguyên dữ liệu MTEF** (bản ghi comment "AppsMFCC" + "Design Science, Inc.") ⇒ bóc ra, đưa qua đúng bộ chuyển MTEF→LaTeX
của 4T. **1.031/1.031 WMF ra LaTeX, KaTeX 0 hỏng**; soát ảnh gốc: khớp nguyên văn (kể cả chỗ sách in sai). 120 ảnh còn lại là hình vẽ thật.
Không cần model đọc ảnh, không cần PDF. Lệnh (dựng lại vài giây):

```
node scripts/kho/mathtype-thu/doc-docx.mjs "<docx>" --ra <thư mục>                      # → <tên>.txt có [[img:imageN.wmf]]
node scripts/kho/mathtype-thu/wmf-mtef.mjs "<docx>" "<thư mục>/<tên>.txt" --ra goc-tex.txt   # → thay token WMF bằng $latex$
node scripts/kho/sach/tach-bai.mjs goc-tex.txt --sach "Toán 5 TLTK" --ra bai.json
```

**B2 — tách bài (`tach-bai.mjs`, đã mở rộng 08/10, sách 4T tách ra Y HỆT trước):** **750 bài** (VD 82 · LT 543 · Ôn tập 125) + 310 bản
ghi ý; 75 bài có hình trong đề; 54 VD có "Bài làm". Sách in thiếu/sai được script bắt:
- CĐ3, CĐ4 **thiếu tiêu đề "LUYỆN TẬP"** ⇒ script chuyển sang LT khi số bài quay lại (báo ra, không im lặng); CĐ14 gõ "LUYỆN TÂP".
- VD CĐ4 (và một số VD khác) **không có "Bài làm:"** — lời giải viết liền sau đề ⇒ nằm trong `noi_dung` của VD.
- **Cần người:** LT 21.1 sách in nhãn trùng (bảng điền ô lặp 3 lần) · VD 25.1 nhãn ý lặp.

**Lỗi in của sách đã thấy (đừng chép VD làm mẫu mà không kiểm):** VD 1.5a $3\dfrac{3}{4}=\dfrac{5}{4}$ (đúng $\dfrac{15}{4}$) ·
VD 5.3 "75000 : 5×15" (đúng 750000) · VD 26.1 "38,6 km" thiếu "/giờ".

**Dạng bài của sách** (mục trong "Tóm tắt lí thuyết" + VÍ DỤ — khung để giải một lượt qua các dạng; CĐ không ghi mục thì 1 dạng):

| CĐ | Tên | Dạng trong sách | VD | LT |
|---|---|---|---|---|
| 1 | Ôn tập phân số, hỗn số | hỗn số ↔ phân số · phép tính hỗn số · so sánh · tìm $y$ · lời văn | 5 | 12 |
| 2 | Ba bài toán về phân số | phân số của một số · tìm số biết phân số · tỉ số (cả tỉ lệ bản đồ) | 3 | 26 |
| 3 | Công việc chung | (vòi chảy, cùng làm, làm riêng rồi chung) | 2 | 15 |
| 4 | Dãy phân số, hỗn số | dãy có quy luật (hiệu-tích, mẫu gấp đôi, tích) | 2 | 10 |
| 5 | Tỉ lệ thuận – nghịch | tỉ lệ thuận · tỉ lệ nghịch · tỉ lệ kép | 3 | 21 |
| 6 | Ôn tập toán có lời văn | TBC · tổng–hiệu · tỉ số · tổng–tỉ · hiệu–tỉ | 3 | 24 |
| 7 | Hai hiệu số | (thừa–thiếu, thừa đơn vị chứa) | 1 | 20 |
| 8 | Hai tỉ số | một đại lượng không đổi · tổng không đổi · hiệu không đổi | 3 | 20 |
| 9 | Tính ngược | lưu đồ · sơ đồ đoạn thẳng · lập bảng | 3 | 19 |
| 10 | Số thập phân | STP · phân số thập phân ↔ STP · so sánh | 3 | 13 |
| 11 | Đơn vị đo | độ dài · diện tích · khối lượng dưới dạng STP | 3 | 13 |
| 12 | Phép tính với STP | cộng trừ · nhân chia (tính chất, thuận tiện) | 7 | 13 |
| 13 | Bài toán về STP | dãy STP cách đều · dịch dấu phẩy | 2 | 43 |
| 14 | Tỉ số phần trăm | đổi STP/phân số ↔ % · phép tính với % | 2 | 17 |
| 15 | Ba bài toán về % | tìm % của hai số · tìm a% của M · tìm số biết b% | 3 | 20 |
| 16 | Dung dịch, quặng, hạt tươi | 1 yếu tố không đổi · trộn dung dịch | 3 | 15 |
| 17 | Bài toán khác về % | (lãi, giảm giá…) | — | 20 |
| 18 | Hình tam giác | diện tích · chiều cao/đáy từ diện tích | 2 | 16 |
| 19 | Tam giác (tiếp) | diện tích gián tiếp · tỉ lệ cạnh · tỉ lệ đường cao | 3 | 30 |
| 20 | Hình thang | diện tích · thay đổi đáy | 2 | 18 |
| 21 | Hình tròn | chu vi, diện tích · hình vuông nội/ngoại tiếp | 3 | 15 |
| 22 | Hình khối hộp | hộp chữ nhật · lập phương | 2 | 30 |
| 23 | Xếp hình đơn vị | (xếp khối, đếm khối) | 3 | 15 |
| 24 | Sơn mặt | (sơn 3/2/1/0 mặt) | 1 | 10 |
| 25 | Vận tốc, quãng đường, thời gian | công thức · đổi đơn vị · số đo thời gian | 4 | 14 |
| 26 | Cùng chiều, ngược chiều | gặp nhau · đuổi kịp | 2 | 21 |
| 27 | Dòng nước | xuôi – ngược dòng | 2 | 7 |
| 28 | Cùng v, s, t | tỉ lệ thuận/nghịch giữa v, s, t | 2 | 9 |
| 29 | Chuyển động khác | vận tốc trung bình · vật có chiều dài (tàu) | 3 | 13 |
| 30 | Giả thiết tạm | (giả sử tất cả là một loại) | 2 | 14 |
| 31 | Phương pháp khử | cùng hệ số · khác hệ số (đưa về cùng) | 3 | 10 |
| Ôn | Ôn tập kiến thức trọng tâm | 13 mục, tổng hợp | — | 125 |

*(VD/LT là số bài của `tach-bai`, chưa tách ý.)*

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
chuyên đề sách. Bảng này là **tư liệu cho CEO làm bản đồ**, không phải đề xuất cách chia — bản đồ là việc của CEO (README §0).

## 7. Kế hoạch 5T theo quy trình 3 bước (README §0, CEO chốt 08/10)

| Bước | Ai | Việc của 5T | Trạng thái |
|---|---|---|---|
| **1. Rút luật giải** | Claude giải thử · CEO duyệt | B1 đọc sách ✅ → B2 hồ sơ + `tach-bai` ✅ → B3 nâng luật theo "Bài làm" ✅ (§1 cho phép) → B4 **giải một lượt qua MỌI dạng bài của sách** (31 CĐ, mỗi dạng ít nhất 1 câu; lập bảng dạng ↔ lô, ưu tiên CĐ chưa có trong kho: %, hình học, chuyển động, giả thiết tạm, khử…), chia lô 10–20 câu → CEO duyệt từng lô → ghi §9 → nâng luật → đủ dạng và lô cuối không bị sửa ⇒ **v1** | ✅ **v1 (09/10)** — 4 lô, 101 câu, một lượt qua mọi dạng; CEO duyệt |
| **2. Giải toàn bộ tài liệu** | Claude (dây chuyền README §2b) | Giải **hết** sách — 31 chuyên đề **và** phần Ôn tập kiến thức trọng tâm — ghi `--chua-gan-dang` vào `T15T000000`, `da_duyet=false`. Câu có hình đề: dùng đường hình đề của 4T (`kho-rules/dai/hinh-de/dung-hinh-de.ps1` + manifest `5T.json`, cột `anh_de` ở cổng ghi) — khoảng 60 bài hình sách dùng được; 13 bài hình hỏng vẽ lại bằng code (CEO 09/10) | **Đang ở đây** — tiến độ §8b |
| **3. Xếp vào bản đồ** | **CEO làm bản đồ 5T** · Claude xếp · CEO duyệt | Khi CEO xong bản đồ 5T (ERP › Học thuật › Bản đồ mới) ⇒ Claude viết §8 (dấu hiệu nhận dạng theo bản đồ mới) rồi xếp mọi câu dạng chờ + câu 5T cũ vào bản đồ → CEO duyệt | Chờ bản đồ |

**271 câu Số thập phân giải lại 04/10:** CEO 08/10 *"giải là duyệt luôn"* ⇒ duyệt ngay ở màn Duyệt lời giải AI › Lời giải mới từ Claude (câu đã có dạng T15T0202 nên bấm duyệt được), **không chờ bước 3**. 2 câu cờ `nghi` (T15T020205020 đề nghi sai số liệu · T15T020206068 đề mơ hồ) cần người xem kỹ. Bước 3 vẫn xếp lại chúng vào bản đồ mới như mọi câu.

## 8b. BƯỚC 2 — TIẾN ĐỘ GIẢI TOÀN BỘ SÁCH (bắt đầu 09/10)

Danh tính câu: `ten_de_goc = "Toán 5 TLTK · <mã bài>"` (mã của `tach-bai`: `LT 6.8`, `VD 13.2`, `ON 22`, ý `LT 12.3c`). Dạng chờ `T15T000000`.
Đầu vào dựng lại: §5 (doc-docx → wmf-mtef → tach-bai). Bộ kiểm đáp số: `kho-rules/dai/lo/k5T-kiem.mjs` (viết TỪ ĐỀ trước khi mở bản soạn).

| Lô | Khu sách | Câu ghi | Ghi chú |
|---|---|---|---|
| S1–S4 (lô thử, 09/10) | 101 câu rải CĐ1–31 + Ôn | **98** (`T15T000000014`–`111`) | Opus soạn, CEO duyệt; 3 trùng câu kho cũ không chèn (LT 10.12 ≈ T15T020206041 · LT 13.41 ≈ T15T020206066 · LT 1.2d ≡ T105030203013); 98 `khop`; 28 sơ đồ (Sonnet ký `kiem-hinh-b` 29/29) · 7 hình đề |
| 5 (09/10) | CĐ1–6 (A: 1–2 · B: 3–4 · C: 5–6) | **143** (`T15T000000112`–`254`) | Sonnet soạn 3 nhóm, Opus soát. Đáp số 143/143 khớp bộ kiểm `lo/k5T-kiem-lo5.mjs` (19 câu dãy CĐ4 chỉ thiếu "A=" trong `dap_an` ⇒ sửa). Sửa: LT 4.10b bỏ chữ trong công thức · VD 5.1 bỏ câu ngoài lề · 3 sơ đồ trình bày (6.9, 6.13 nhãn hiệu lặp; 6.24 tiêu đề bị cắt). **LT 1.5d mang cờ `nghi`**: sách in `5xy+1`, đề ghi kho đã sửa thành `5\times y+1` (sua `noi_dung`, mới thêm vào `lo-tu-soan`) ⇒ `kiem-doc` báo lệch sách — đúng ý, chờ người xem. 30 sơ đồ, Opus ký `kiem-hinh-b`. Không soạn LT 1.2b/c/d, 1.3e/h, 4.8a (trùng câu kho, `dau-vao-soan` lọc) |
| 6B · 6C · 7B · 7C (09/10) | CĐ10–12 · CĐ15–18 | **145** (`T15T000000255`–`399`) | Từ đây Phần 1 viết **card** (`**Bước k.**`, README §3 CEO 09/10) và chỉ tách ý bài Tính/Tìm x (LT 11.8 lời văn giữ chung — bộ kiểm tự gộp hàm `…a`,`…b`). Đáp số khớp hết. **Cờ `nghi` 9 câu = đề kho đã sửa lỗi in so với sách**: LT 10.4a–f ("thạ̀p"), 11.2 ("tán"), 16.4 ("40%$"), 16.11 ("Lương nước"). **Bỏ** LT 10.6d (trùng nguyên văn VD 10.3), LT 18.2 + 18.3 (bảng sách đọc lộn — treo cần người). 1 sơ đồ (18.11) Opus ký. Nghi còn để người xem: LT 16.5 đáp số 1,06875% (số sách không tròn) · LT 17.7/17.8 hiểu "diện tích" là ban đầu · LT 18.15 coi H nằm trên BC · VD 18.1 sách ghi đáy AB với đường cao AH (giữ như sách) |

**Lệnh một lô (khuôn 5T):** lô thử: `soan-tu-mau-thu.mjs` (md → bản soạn, đáp án tay `lo/k5T-dap-an-tay.json`) · lô hàng loạt: `dau-vao-soan` → Sonnet soạn
⇒ rồi chung: `lo-tu-soan.mjs <soan> <bai.json> --khoi 5T --lo N --so-do-dir kho-rules/dai/so-do --hinh-de kho-rules/dai/hinh-de/5T.json` →
bộ kiểm thêm hàm vào `lo/k5T-kiem.mjs` → Sonnet xem ảnh sơ đồ ký `kiem-hinh-b` → `ghi-lo.mjs … --sach "Toán 5 TLTK" --chua-gan-dang` chạy thử → `--ghi`.

**Còn lại:** toàn bộ 750 bài (VD 82 · LT 543 · Ôn 125, trước tách ý) trừ các câu đã ghi. **Treo:** 13 bài hình hỏng + LT 19.18 (vẽ lại bằng code) ·
LT 21.1 (sách in nhãn trùng) · VD 25.1 (nhãn ý lặp) · 3 lỗi in trong VD (§5).

## 8. GÁN DẠNG — chưa viết

Viết ở bước 3, khi CEO xong bản đồ 5T: bảng dấu hiệu nhận dạng theo chủ đề nhiều dạng + bảng chỗ bản đồ chưa có dạng, đúng khuôn `k4T.md` §5.
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
| 08/10 | Quy trình | *"Bản đồ t sẽ làm."* Chốt 3 bước cho mọi khối: rút luật giải (CEO duyệt) → giải toàn bộ tài liệu lên DB chờ sẵn → CEO xong bản đồ thì Claude xếp bài vào, CEO duyệt | README §0; §7 viết lại; bỏ các câu hỏi về cách chia bản đồ (việc của CEO) |
| 08/10 | Bước 1 + 271 câu STP | *"Giải là duyệt luôn. Bản chất là m đi giải 1 lượt các dạng bài để học cách giải để giải toàn bộ bài đấy."* | README §0: lô thử = một vòng phủ MỌI dạng bài của sách; v1 khi đủ dạng + lô cuối không sửa. 271 câu STP duyệt luôn, không chờ bản đồ (§7) |
| 08/10 | B1–B4 lô sách 1 | *(chưa phải CEO sửa — ghi việc làm)* Đọc sách bằng MTEF trong WMF (1.031/1.031), tách 750 bài, rút khuôn từ 82 VD (khử được đặt chữ, $S_{ABC}$, $r\times r$, %…), lô sách 1 = 26 câu CĐ1–9 gửi CEO kèm 3 câu hỏi | §1 cho phép, §5, §7 |
| 08/10 | Lô sách 1 — câu hỏi 1 (bài nhiều cách) | *"Bài nào nhiều cách thì m nói ra bàn với t. Chốt một cách chính thôi."* | Gặp bài sách cho nhiều cách ⇒ KHÔNG tự chọn: liệt kê các cách + đề xuất, CEO chốt **một cách chính** cho cả dạng, ghi vào §2b. Phần 2 chỉ trình bày cách chính. |
| 08/10 | Lô sách 1 — câu hỏi 2 (sơ đồ hai hiệu số) | *"Nếu có sơ đồ vẫn là tốt nhất."* | Dạng nào sách có sơ đồ ⇒ kho phải có sơ đồ (máy vẽ). Hai hiệu số: 3 hàng — tổng thật, cách thừa (đoạn thiếu nét đứt), cách thiếu (đoạn thêm) — vẽ được bằng `bot`/`them`, đã thêm vào câu 19–20. |
| 08/10 | Lô sách 1 — câu hỏi 3 (hai tỉ số) | *"OK. Cách chuẩn của hai tỉ số là không dùng sơ đồ."* | CĐ8 hai tỉ số: phân số của đại lượng không đổi, KHÔNG sơ đồ (ngoại lệ có chủ đích của luật "có tỉ số ⇒ có sơ đồ"). |
| 09/10 | Bảng nhiều cách §2b | Chốt: *"A: số to thì phải dùng cách 2, số bé mới dùng cách 1, ưu tiên cách 2 · B: 1 · C: 3 · D: cách 2, cách 1 để làm quen thôi, dùng khi giảng bài · E: 2 · F: 1."* | §2b cột Chốt. Lô sách 1 đã khớp cả 6 (câu 1, 11, 12, 14, 25) — không câu nào làm lại. Bài học: **lời giải kho ≠ bài giảng** — cách "để làm quen" (D①) thuộc giáo án GV, không vào kho. |
| 09/10 | Lô sách 2 — 2 câu hỏi | *"1. Kiểu 1. 2. Có, viết thêm cho dễ hiểu."* | §2b dòng G chốt ①; §1: nhân hai tỉ số phần trăm viết thêm bước đổi số thập phân — đã sửa lô 2 câu 24, 26. |
| 09/10 | Lô 3 + lô 4 — 4 câu hỏi | *"1. OK · 2. Câu đấy nên viết đầy đủ là Tam giác AMC và ABC có chung đường cao hạ từ … suy ra … · 3. Vẽ được sơ đồ minh hoạ là chuẩn. Bài chuyển động rất cần · 4. Bài thêm bớt chữ số bên trái bên phải là bài toán tỉ số, giải kiểu sơ đồ được. Còn bài đề cho cấu tạo số thì giải như cấu tạo số."* | §1: hình hỏng vẽ lại bằng code; tỉ số diện tích viết đầy đủ câu (sửa lô 3, 7 dòng); chuyển động bắt buộc sơ đồ minh hoạ — máy vẽ mới `so-do-chuyen-dong.mjs`, chèn 11 câu lô 4; cấu tạo số tách 2 loại. |
| 09/10 | Cả 4 lô sách (101 câu) | *"OK rồi. Lên V1 thôi."* | **v1.** Sang bước 2: giải toàn bộ sách theo dây chuyền README §2b, ghi dạng chờ. |
