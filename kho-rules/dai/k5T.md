# kho-rules/dai/k5T.md — Luật GIẢI + TRÌNH BÀY khối 5T (Toán 5 nâng cao)

> **Trạng thái: NHÁP v0 (04/10) — chờ CEO/học thuật duyệt.** Theo `spec-luong-kho.md` C10: mọi lần giải câu 5T
> PHẢI đọc file này trước. Mỗi lần người sửa lời giải ⇒ tổng kết thêm luật vào đây.

## 0. Nguyên tắc gốc

Lời giải viết **như một học sinh lớp 5 giỏi viết vào vở**, dùng **đúng kiến thức tiểu học**. Phụ huynh tiểu học đọc
phải hiểu được. Nếu một bước chỉ giải được bằng cách "gọi ẩn rồi lập phương trình" ⇒ đổi sang phương pháp tiểu học
(sơ đồ đoạn thẳng / số phần / thử chọn / hiệu không đổi…). Không đổi được ⇒ đưa câu về làn 🔴 hỏi người.

## 1. CẤM (kiến thức/ký hiệu ngoài tiểu học)

| Cấm | Thay bằng |
|---|---|
| `⇒`, `⇔`, `∈`, `{ }`, `∀`, `≤ ≥` trong lập luận | chữ: "nên", "vậy", "suy ra", "là các số", "không lớn hơn" |
| Gọi ẩn ($k$, $x$…) rồi lập phương trình, chuyển vế, nhân hai vế | sơ đồ đoạn thẳng / số phần bằng nhau |
| Biểu thức chữ kiểu $100a + 10b$, $1,01d + 0,1a$ | phân tích theo HÀNG ("chữ số hàng phần mười là…") |
| "Thử $y = 0, 1, …, 9$" liệt kê máy móc | so sánh từng hàng từ trái sang phải |
| Số âm, lũy thừa | — |

Đề có sẵn chữ $y$/$x$ (tìm $y$, tìm chữ số) thì dùng chữ đó bình thường — chỉ cấm TỰ đặt ẩn mới.

## 1.5 ⭐ Mỗi lời giải CHIA 2 PHẦN (CEO 04/10)

HS đọc lời giải dễ lẫn giữa *giải thích cách nghĩ* và *cái được viết vào bài thi* ⇒ tách hẳn:

| Phần | Viết gì | Không viết gì |
|---|---|---|
| `**Phần 1. Hướng dẫn**` | Giải thích từng bước: nhận xét gì, dùng quy tắc/tính chất nào, vì sao làm vậy. Sơ đồ mô tả bằng lời | — |
| `**Phần 2. Trình bày**` | **Đúng cái HS viết vào bài thi:** chỉ có các dòng biến đổi phép tính | Không câu giải thích, không nêu quy tắc, không "Ta có / Nhận xét / Áp dụng" |

- ⭐ **Phần 1 là phần QUAN TRỌNG NHẤT** (CEO 04/10): nó dạy **cách TƯ DUY bài toán** — HS đọc Phần 2 thường không hiểu
  vì Phần 2 không giải thích. Phần 1 KHÔNG được chỉ là "Phần 2 kèm lời". Phải trả lời đủ 3 câu:
  1. **Mấu chốt của bài là gì?** — điều phải nhận ra thì mới giải được (vd "hiệu số tuổi không đổi", "thừa số thứ hai bằng 0",
     "chia cho 0,1 chính là nhân với 10").
  2. **Vì sao lại nghĩ ra hướng đó?** — dấu hiệu nào trong ĐỀ gợi ý cách làm (vd "đề cho hai tỉ số ở hai thời điểm và hỏi tuổi
     ⇒ nghĩ ngay tới đại lượng không đổi"; "các số có phần thập phân giống nhau ⇒ nhóm lại thành số tròn").
  3. **Các bước đi theo mạch suy nghĩ** — mỗi bước nói làm gì và để làm gì.
  Có bẫy/lỗi hay gặp rõ ràng thì thêm 1 câu "Chú ý". Bài quá dễ (1–2 phép tính) thì Phần 1 ngắn, nhưng vẫn phải nói mấu chốt.
- ✅ Bài **lời văn** (CEO chốt 04/10): Phần 2 = **1 câu lời giải ngắn → 1 phép tính** (kèm đơn vị trong ngoặc), lặp lại,
  mở bằng `Bài giải`, kết bằng `Đáp số: …`. Mọi giải thích *vì sao* đưa lên Phần 1.
- ✅ Bài **lập luận** (chữ số, so sánh, tìm số thoả điều kiện — CEO chốt 04/10): Phần 2 = **biến đổi đi kèm lập luận**
  ("Vì … nên …") ở dạng ngắn nhất — đó là nội dung bài thi.
- Bài **tính / tìm $y$ / tính thuận tiện**: Phần 2 chỉ có các dòng biến đổi, không một chữ giải thích — và **mở bằng dòng
  chép lại nguyên biểu thức của đề** (bước bỏ ngoặc / đổi dấu thường chính là mấu chốt, không được nuốt mất).
- Bài lời văn **có tỉ số / số phần** (tổng–tỉ, hiệu–tỉ, dịch dấu phẩy…): Phần 2 PHẢI có dòng `Ta có sơ đồ: <A>: … phần; <B>: … phần`
  (bài thi tiểu học bắt buộc vẽ sơ đồ; app chưa vẽ được nên mô tả bằng lời) trước dòng "Tổng/Hiệu số phần bằng nhau là:".
  Mọi bước đổi (hỗn số → phân số, thập phân ↔ phân số) là 1 dòng riêng, không đổi ngầm ở dòng đầu. Dãy cách đều thì
  Phần 2 có 1 dòng phép tính có nhãn: `Số số hạng: $(4,5-0,5):0,4+1=11$` (phép tính, không phải lời giải thích).
- Đừng gọi một số là "số tròn" khi nó không tròn (0,5 hay 14,7 không phải số tròn) — Phần 1 phải khớp ĐÚNG đề, không chép khuôn.
- Bài lập luận: mỗi "Vì … nên …" phải tự đủ lý do — không viết "Vì A nên C" khi còn thiếu bước B ở giữa.
- Ghi chung vào 1 ô `loi_giai`, nhãn in đậm bằng `**…**` (MathText đã hỗ trợ).

## 2. Khuôn trình bày theo dạng (chuyên đề T15T0202 — Số thập phân)

| Dạng | Khuôn |
|---|---|
| **020201 Tính chất số thập phân** (so sánh, viết số, đổi phân số ↔ STP) | Đổi về cùng một kiểu số → so sánh **từng hàng từ trái sang phải** → kết luận bằng câu |
| **020202 Tính thuận tiện** | Câu đầu NÊU TÍNH CHẤT dùng (giao hoán, kết hợp, nhân một số với một tổng/hiệu, tích có thừa số 0) → biến đổi từng dòng |
| **020203 Biểu thức hỗn hợp** | Nhắc thứ tự thực hiện → mỗi phép tính một dòng. Nhân/chia với 10, 100, 0,1… thì NÊU quy tắc dịch dấu phẩy. Hỗn số/phân số đổi ra STP trước |
| **020204 Tìm $y$** | Viết **theo cột, mỗi dòng một bước** như vở. Mỗi bước nêu quy tắc thành phần chưa biết ("Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết"). Có $y$ lặp lại ⇒ đưa về "$y$ nhân với một tổng" |
| **020205 Lời văn** | Khuôn **Bài giải**: mỗi bước = 1 câu lời giải + 1 phép tính + đơn vị trong ngoặc. Có tỉ số ⇒ mô tả sơ đồ bằng lời ("số A: 3 phần, số B: 5 phần"). Kết thúc `Đáp số: …` |
| **020206 Nâng cao cấu tạo STP** | Dịch dấu phẩy = gấp/giảm 10, 100 lần ⇒ quy về **số phần** (số nhỏ 1 phần, số lớn 10 phần). Bài chữ số: lập luận theo hàng + chữ số tận cùng |

## 3. Định dạng (giữ quy ước kho Đại)

- Các bước cách nhau bằng dòng trống (`\n\n`). Phân số `\dfrac`. Mỗi công thức một cặp `$…$`.
- Dấu nhân `\times`, dấu chia `:` (không dùng `\div`, không dùng `/`). Dấu phẩy thập phân `,`.
- Câu trả lời ngắn vẫn viết đủ bước — "ngắn" là ở **đáp án**, không phải ở lời giải.
- Đáp án (`dap_an`) giữ đúng như đáp án hiện có, chỉ đổi lời giải. Đáp án dạng tập hợp `$y \in \{…\}$` ⇒ **hỏi CEO** có đổi sang chữ không (vì đụng chấm/form MCQ).

## 4. Kiểm trước khi ghi

- Mọi đáp số được **code tính lại** độc lập (thay ngược vào đề).
- Sai lệch với `dap_an` hiện có ⇒ không ghi, báo người.
