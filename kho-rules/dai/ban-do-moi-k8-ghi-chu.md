# Bản đồ mới khối 8 — ghi chú khi điền lý thuyết (14/10/2026)

Claude điền `dai_bdm_dang_bai.ly_thuyet` cho **43 dạng có mô tả mà chưa có lý thuyết** (khối 8, nhánh Toán).
Nguồn: lý thuyết bản đồ cũ (`dai_dang_ly_thuyet`) + cột `vi_du` của chính dạng + tài liệu K8 Thùy gửi.
**Không đụng:** 6 dạng chưa có mô tả (NDB00466, 467, 468, 469, 698, 700), lý thuyết cấp nhóm, `mo_ta`, `vi_du`.
Mỗi dạng ghi 1 dòng riêng (trigger tự lưu `dai_bdm_log`). Bản nháp gốc: `C:\Users\WBPC\bk-kho-lam-viec\bdm\ly-thuyet-k8-nhap.txt`.
Soát toán độc lập bằng 1 agent (đã sửa các lỗi nó nêu: định nghĩa chia hết NDB00679, ghép cặp ax+b NDB00978, thứ tự bước NDB00699…).

## Cần Thùy quyết / xác nhận (ghi chú ở đây, KHÔNG nằm trong lý thuyết hiển thị cho HS)

### A. Mô tả và tên lệch nhau
| Dạng | Vấn đề | Em làm gì |
|---|---|---|
| **NDB00970** "…lập phương tổng hiệu" và **NDB00972** "…áp dụng tổng hiệu hai lập phương" | Mô tả của hai dạng bị **tráo** so với tên (970 mô tả "tổng hiệu hai lập phương", 972 mô tả "lập phương của tổng hiệu") | Lý thuyết cả hai ghi **đủ 4 hằng đẳng thức bậc ba** (lập phương tổng/hiệu + tổng/hiệu hai lập phương). Thùy chốt dạng nào là cái gì thì cắt bớt. |
| **NDB00971** "tổng hiệu hai bình phương" | Tên không rõ: "tổng hai bình phương" không có hằng đẳng thức phân tích | Ghi 3 hằng đẳng thức bậc hai: bình phương tổng, bình phương hiệu, hiệu hai bình phương. |
| **NDB00974 / NDB00975** | Hai dạng **trùng tên** "…một biến dạng bậc nhất"; mô tả của 975 là $ax^2=b$, $ax^3=b$ (không phải bậc nhất) | Lý thuyết 975 theo mô tả (ax²=b, ax³=b). Nên đổi tên 975 thành "…dạng không phải bậc nhất". |
| **NDB00681** nhiều biến | Mô tả ghi "đa thức **một biến**" (chắc gõ nhầm) | Viết theo "nhiều biến". |
| **NDB00687** | Mô tả ghi "dạng a^2.x=b" (mơ hồ) | Viết theo $ax^2=b$, $ax^3=b$ như mô tả của NDB00975. |
| **NDB00969** | "biểu thức có 6 phần" — em hiểu là A, B + 4 hạng tử $A^3$, $3A^2B$, $3AB^2$, $B^3$ | Nếu ý khác thì sửa. |
| **NDB00676** | Mô tả ghi "nhân chia" nhưng dạng là **chia** đơn thức | Viết theo phép chia. |
| **NDB00672** | Mô tả điểm 1 ghi "rút gọn **đơn thức**…" (có thể là đa thức) | Viết theo cộng/trừ đa thức. |

### B. Quy ước cần Thùy chốt
1. **Đơn thức có phải đa thức không (NDB00664, NDB00668).** SGK: đơn thức cũng là đa thức. Nhưng ví dụ trong kho ("có bao nhiêu đa thức" → 4, không tính $x^2y$, $99$) đếm riêng. Em ghi đúng quy ước kho + 1 dòng chú ý nói rõ khác SGK. Nếu muốn theo SGK thì các câu đếm trong kho phải đổi đáp án.
2. **"Hệ số của đa thức" (NDB00669):** mô tả không nói hệ số của hạng tử nào (hạng tử cao nhất? tự do?). Em ghi theo "hệ số của từng hạng tử sau khi thu gọn".
3. **NDB00977 (HĐT):** mô tả chỉ có "Dạng 1" (gom 2-2 và gom 3-1). Cách gom 2-2 em hiểu là "hai cặp hạng tử, trong đó có cặp là hiệu hai bình phương" — chưa chắc đúng ý Thùy; chưa có "Dạng 2". Em cũng thêm trường hợp $C^2-(A\pm B)^2$ (bình phương đứng trước dấu trừ).

### C. Lý thuyết em **ít chắc** (nên Thùy/GV đọc lại)
- **NDB00699** (tổng ba bình phương, hệ số xy là ±1): phương pháp "xét 2A, để b chưa biết rồi cho các bình phương cùng bằng 0 để tìm b" là em tự suy từ NDB00697/698 — bản đồ cũ **không có** lý thuyết dạng này. Đã kiểm bằng ví dụ $x^2+y^2+xy-3x-3y+5$ (min 2 tại (1,1)).
- **NDB00978** (đặt ẩn phụ, 4 nhân tử): lý thuyết dựa trên mô tả của Thùy ("trung bình cộng hai hằng số"), đã kiểm với $(x+1)(x+2)(x+3)(x+4)$ và dạng $(ax+b)$.
- **NDB00982, NDB00983** (Tìm x bằng nhẩm nghiệm / đặt ẩn phụ), **NDB00477, NDB00478** (nhẩm nghiệm): định lý "f(a)=0 ⇒ chia hết cho (x−a)" **không có trong SGK K8** (nâng cao). Em ghi như một tính chất dùng được, phương án chính vẫn là tách hạng tử/chia đa thức.
- **NDB00478:** nghiệm nguyên là ước của hệ số tự do — đúng cho đa thức hệ số nguyên (mọi hệ số bậc cao), nhưng nghiệm hữu tỉ không nguyên chưa đề cập.
- Các dạng *Tìm x* (NDB00979–983) chỉ ghi quy tắc $A\cdot B=0$ và các bước chung; **chưa có ví dụ** (cột `vi_du` Thùy tự điền).

### D. Lỗi dữ liệu thấy khi đọc (chưa sửa)
- **NDB00679 `vi_du`:** đề ghi $(2x^my^6+4x^5y^m)$ chia hết cho $7x^5y^m$, nhưng lời giải thay $y^m$ bằng $y^5$ rồi kết luận $m=5$. Theo đề gốc thì $m\in\{5,6\}$ (cần $m\ge5$ và $6-m\ge0$). Đề còn ghi "tìm m, n" nhưng chỉ có m.
- **NDB00698** (chưa có mô tả nên em không làm): lý thuyết cũ có ví dụ 1 viết $2y$ ở đề rồi $4y$ ở lời giải (đề $+2y$ nhưng tách theo $+4y$) — lệch.
- **NDB00664 `vi_du`:** đang trộn "đơn thức" và "đa thức" theo quy ước ở mục B.1.

### E. Việc **không** làm vì chưa có mô tả (theo yêu cầu)
NDB00466, NDB00467, NDB00468 (Hằng đẳng thức › Bình phương của các biểu thức đặc biệt: dạng phân thức, mũ 4, cụm a=b=c), NDB00469 (Hằng đẳng thức $a^3+b^3+c^3$), NDB00698, NDB00700 (GTLN–GTNN dùng bình phương 3 số, dạng 2 và 3). Ở nhóm cấp trên cũng chưa có mô tả nên không điền lý thuyết nhóm.
