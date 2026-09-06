# Rule giải bài bằng AI (Claude Code) — ĐỌC TRƯỚC KHI CHẠY

> File này là **rule bắt buộc**, không phải tài liệu tham khảo. Bất kỳ phiên Claude Code nào
> được giao "quét/giải câu chưa có đáp án" (Đại/KHTN/HGT qua `giaiCauAI`, Hình qua `giaiBienTheAI`
> / viết `hinh_cach_giai`) **phải đọc file này trước khi giải bài đầu tiên**, không chỉ đọc lướt
> CLAUDE.md rồi làm theo bản năng.

---

## 1. Luật quan trọng nhất: bài nhiều ý PHẢI dùng lại kết quả ý trước

**Không được chứng minh lại từ đầu** một ý/câu nếu kết quả của nó đã được suy ra (hoặc có thể suy ra
trực tiếp) từ một ý/câu khác **đứng trước** trong cùng chuỗi bài toán. Toán học chuẩn luôn cho phép
"theo câu a)", "theo kết quả trên" — AI giải bài cũng phải làm vậy, không phải vì tiết kiệm công sức
mà vì đó là **cách giải đúng chuẩn sư phạm** (ngắn gọn hơn, và tránh sai lệch nếu chứng minh lại theo
đường khác mà lỡ sai).

**Cách nhận diện một chuỗi bài toán liên quan nhau (PHẢI kiểm tra TRƯỚC khi giải bất kỳ bài nào):**
- Cùng `mo_hinh_id` (Hình) hoặc cùng `dang_chinh`/`ma_cum` (Đại/KHTN/HGT) — đây là tín hiệu mạnh nhất.
- Đánh số `ma` liên tiếp hoặc gần nhau trong cùng mô hình (vd `BT.08.107→108→109→121`,
  `BT.08.113→114→120`, `BT.09.122→...→135`).
- `gia_thiet_rieng` của bài sau xây tiếp lên cấu trúc của bài trước (thêm điểm, thêm giả thiết) mà
  không nhắc lại toàn bộ giả thiết gốc.
- `phat_bieu` hoặc `gia_thiet_rieng` có cụm chỉ-định rõ: "theo câu trên", "ở câu a)", "M là trung điểm
  đã xác định ở trên"...

**Quy trình bắt buộc trước khi giải một bài trong một chuỗi:**
1. Query **toàn bộ các bài cùng `mo_hinh_id`** (hoặc cùng nhóm liên tiếp), sắp theo `ma`.
2. Với mỗi bài đứng **trước** bài đang giải: đọc `hinh_cach_giai.loi_giai` đã có sẵn (dù là lời giải
   cũ `nguon_giai='nguoi'` hay lời giải mới `giai_method='claude_code'` mình vừa viết trong cùng phiên).
   Nếu bài trước cũng đang thiếu lời giải, **giải bài đó trước** (theo đúng thứ tự `ma` tăng dần),
   không nhảy cóc.
3. Khi giải bài hiện tại, nếu một mệnh đề cần dùng đã được chứng minh ở bài trước trong CÙNG chuỗi,
   viết thẳng "Theo câu trên, ... (đã chứng minh)" rồi dùng luôn — không lặp lại phần chứng minh đó.
4. Nếu bài hiện tại KHÔNG thực sự phụ thuộc bài trước (chỉ tình cờ cùng mô hình, ví dụ hỏi một ý hoàn
   toàn độc lập), thì cứ giải độc lập — không ép buộc phải nối chuỗi khi không cần.

**Ví dụ đã áp dụng đúng (khối 8, xem lịch sử `giai_method='claude_code'`):**
- Chuỗi `BT.08.107→108→109→121` ("Hình bình hành", H/K là chân đường vuông góc từ A,C xuống BD):
  107 chứng minh `AHCK` là hbh; 108 và 120 sau đó chỉ cần "theo tính chất đường chéo hình bình hành
  `AHCK`, ..." thay vì chứng minh lại `AH=CK` từ đầu; 121 dùng luôn "trong hình bình hành `AHCK`,
  cặp cạnh đối còn lại `AK, HC` cũng song song" thay vì chứng minh lại bằng tam giác.
- Chuỗi `BT.08.085→086→087→111` ("Phân giác của hình bình hành"): 086 dùng thẳng "AMCN là hình bình
  hành" (kết quả câu 085) để suy ra hai đường chéo cắt nhau tại trung điểm, không dựng lại tam giác cân.
- Chuỗi `BT.08.117→118→119`: 118 dùng thẳng `AM=CK` (từ hbh `AMCK` ở 117); 119 (định lý đường trung
  bình) dùng thẳng `MK∥BC`, `MK=BC` (từ hbh `BMKC` ở 118) thay vì chứng minh đường trung bình bằng
  cách dựng khác.
- Chuỗi `BT.09.122→...→132`: nhiều bài dùng lại `BC=10, AH=4.8, BH=3.6` đã tính ở BT.09.122 thay vì
  tính lại từ đầu mỗi lần.

---

## 2. Khi `gia_thiet_rieng` (text) mâu thuẫn với hình vẽ (`anh_chuan`/`anh_cau_hinh`)

Dữ liệu `gia_thiet_rieng` trong DB đôi khi bị lỗi nhập liệu (gõ nhầm tên điểm, gõ nhầm đoạn thẳng).
**Ưu tiên đọc hình vẽ thực tế** (dùng Browser tool xem ảnh `anh_chuan`/`anh_cau_hinh`) làm nguồn sự
thật, không tin mù text nếu nó tạo ra một bài toán vô lý hoặc hiển nhiên (tautology).

Quy trình xử lý:
1. Nếu văn bản và hình vẽ khớp nhau → dùng bình thường.
2. Nếu lệch nhau → **thử giải theo cả hai cách đọc**, xem cách nào cho ra kết luận đúng với
   `phat_bieu` (dùng toạ độ số để verify nhanh — xem §3). Cách nào ra kết quả đúng/khớp đề thì dùng
   cách đó.
3. **Không tự sửa `gia_thiet_rieng` trong DB** (đây là dữ liệu đề bài gốc, sửa cần xác nhận theo
   "Luật xoá" của CLAUDE.md). Chỉ giải đúng theo hình, và **liệt kê lại cho người dùng** ở cuối báo
   cáo (bài nào, lệch chỗ nào, vì sao chọn cách đọc đó) để họ quyết định có sửa dữ liệu gốc hay không.

**Ví dụ đã gặp (khối 8):**
- `BT.08.083`: text ghi "AC cắt DM, **NM** ở E,F" nhưng hình vẽ đoạn thật là **BN** (không phải NM).
  Verify bằng vector: đọc "NM" cho giao điểm duy nhất tại trung điểm AC (không tạo ra 2 điểm E,F khác
  nhau, sai với đề "AE=EF=FC" cần 2 điểm phân biệt); đọc "BN" cho đúng `AE=EF=FC=AC/3`. Chọn BN.
- `BT.08.116`: text ghi "M là trung điểm **HI**" nhưng hình vẽ đặt M trên **BC**. Đọc đúng như text
  thì câu hỏi "chứng minh H,M,I thẳng hàng" là hiển nhiên (M được ĐỊNH NGHĨA là trung điểm HI thì dĩ
  nhiên nằm trên HI) — vô nghĩa như một bài toán. Đọc theo hình (M = trung điểm BC) thì thành một bổ
  đề thật (trung điểm BC trùng trung điểm HI vì BHCI là hình bình hành). Chọn theo hình.

---

## 3. Verify TRƯỚC KHI ghi DB — bắt buộc, không phải tùy chọn

- Với bài đại số/tính toán: viết `node -e "..."` hoặc script tạm kiểm tra lại từng con số/đẳng thức
  bằng phép tính độc lập với lời giải (không chỉ đọc lại lời giải rồi tự gật đầu).
- Với bài hình học (chứng minh song song/vuông góc/bằng nhau/thẳng hàng/đồng quy/tỉ lệ): dựng toạ độ
  cụ thể (Descartes) cho hình vẽ, tính số, rồi kiểm tra đúng khẳng định cần chứng minh bằng số liệu
  thực tế. Một bộ toạ độ "đủ tổng quát" (không vuông góc/cân đối đặc biệt trừ khi đề yêu cầu) là đủ để
  bắt lỗi logic.
- Chỉ ghi vào DB sau khi verify PASS. Nếu verify FAIL → sai ở lời giải, sửa lại chứng minh, verify lại,
  không ghi lời giải chưa qua verify.

---

## 4. An toàn khi ghi dữ liệu vào DB

- **Check trước khi ghi:** luôn query xem bài toán đã có dòng `hinh_cach_giai` (hoặc `dap_an`/`loi_giai`
  cho Đại/KHTN/HGT) sẵn chưa. Nếu đã có dòng placeholder trống (`la_mac_dinh=true`, `loi_giai=NULL`) →
  **UPDATE** dòng đó, **KHÔNG INSERT** dòng mới (tránh tạo 2 dòng `la_mac_dinh=true` trùng nhau cho
  cùng một bài toán — lỗi đã từng dính ở đợt giải khối 7).
- **Không dùng heredoc bash để ghi script chứa LaTeX** — heredoc (kể cả `<<'EOF'` có quote) có thể âm
  thầm ăn mất dấu `\` khi nội dung có `\\command` kiểu LaTeX, biến `\perp` thành `perp`. Luôn dùng
  Write tool để tạo file script.
- **Escape apostrophe đúng cách** trong string JS single-quote: `\'` (một dấu `\`), không phải `\\\'`
  (thừa một `\` sẽ để lại ký tự `\` thừa ngay trước dấu nháy trong text hiển thị).
- **Verify lại sau khi ghi:** đọc lại từ DB, kiểm tra `loi_giai.includes('\\')` nếu lời giải có dùng
  LaTeX công thức (không bắt buộc nếu lời giải thuần chữ, không công thức đặc biệt).
- Set `giai_method='claude_code'`, `nguon_giai='ai'`, giữ `da_duyet=false` — để chờ duyệt qua màn
  "Duyệt lời giải AI", không tự động coi là đã duyệt.
- Dọn dẹp script tạm (`scripts/_*.mjs`) ngay sau khi verify xong, không để rác lại trong repo.

---

## 5. Định dạng LaTeX/MathText (bắt buộc theo `ui.tsx`)

- Dùng `\dfrac` (không dùng `\frac`).
- Ký hiệu góc: `\widehat{ABC}`. Vuông góc: `\perp`. Song song: `\parallel`.
- Mỗi công thức bọc riêng trong `$...$` (không gộp nhiều mệnh đề vào 1 cặp `$...$` dài).
- Chuỗi JS chứa các lệnh này cần escape `\\` (một `\` trong LaTeX = `\\` trong string JS).
