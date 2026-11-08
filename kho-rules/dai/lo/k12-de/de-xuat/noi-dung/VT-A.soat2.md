KẾT LUẬN: ĐẠT (sau khi sửa)

# Biên bản soát phần BỔ SUNG — VT-A (C1.1, C1.2, C1.3; 9 dạng) — Opus, 03/11

Phạm vi: `diff VT-A.truoc-bs.txt VT-A.txt` = 8 ví dụ 3 mới (C1.1.2, C1.2.1, C1.2.2, C1.2.3, C1.2.4, C1.3.1, C1.3.2, C1.3.3) + 3 ý lý thuyết thêm ở C1.1.2 + 2 dòng GHI CHÚ. Phần cũ rà nhanh, không thấy lỗi mới. Bản trước khi sửa: `VT-A.truoc-soat2.txt`.

Đã làm:
- Tự giải lại mọi ý mới (sau sửa) bằng toạ độ cụ thể, hình hộp/lăng trụ/tứ diện xiên khi được: `S\soat2\VT-A\thu.cjs` — 31 phép khớp, 0 sai.
- Đối chiếu đề thật: `cau-dang.cjs VT <dạng> 200` cho cả 8 dạng (lưu ở `S\soat2\VT-A\<dạng>.txt`). Kiểu bài mới đều có câu đề thật tương ứng.
- Máy kiểm `kiem-moi.mjs VT … C1.1,…,C1.3.3`: 26 ví dụ, lỗi 0, cảnh báo 0.

Các ví dụ mới đúng toán, đề hiểu được không cần hình, đúng kiểu đề thật, không hỏi ý nào đề không có, không vượt sang PP toạ độ. Lỗi chính: **chép đề thật** (cùng hình, cùng biểu thức, cùng số).

## Chỗ đã sửa

| # | Dạng / ý | Lỗi | Sửa |
|---|---|---|---|
| 1 | C1.2.1 VD2 b) | Chép nguyên đề `AB − EH` trên hộp ABCD.EFGH | Đổi thành `EF − DH` = `EB` |
| 2 | C1.2.1 VD2 a) | Gần như chép đề `AM ± ½B'C'` | Đổi thành `A'M + ½C'B'` = `A'B` |
| 3 | C1.2.2 VD3 a) | Chép đề `AN = AB+AC−AD`; câu hỏi "N là đỉnh nào của hình bình hành?" mơ hồ (không nói hình bình hành nào) | Đổi thành `AN = AC+AD−AB`; hỏi rõ: chứng minh CNDB là hình bình hành, N đối xứng với điểm nào qua trung điểm CD (đáp: B) |
| 4 | C1.2.3 VD3 a) | Chép đề `DA+DB+DC = kDG` | Đổi sang trọng tâm tứ diện: `AB+AC+AD = kAG`, k = 4 |
| 5 | C1.2.3 VD3 c) | Chép nguyên đề `MB = −2MA`, tính MA/MB | Đổi thành `MA = −3MB`, tính MA/AB = 3/4 |
| 6 | C1.2.4 VD3 a), b), c) | a) chép nguyên đề (M trung điểm BB', CA, CB, AA'); b) chép nguyên đề AG'; c) cùng điểm chia với đề (AE = ⅓AB, CF = ⅓CD) | a) M trung điểm A'B' → `−½a+½b+c`; b) hỏi `BG'` → `a−⅔b+⅓c`; c) AE = 2EB, F trung điểm CD → `−⅔a+½b+½c` |
| 7 | C1.3.1 VD3 b) | Chép nguyên đề (chóp S.ABC, AB=4, 60°, tích 6) | Tam giác ABC, AB=5, góc 120°, tích −10 → AC = 4 |
| 8 | C1.3.2 VD3 a), b) | a) chép nguyên đề (lập phương cạnh 2, AC·BC'); b) chép nguyên đề (AS·BC, mọi cạnh a) | a) lập phương cạnh 3, `AB'·BC'` = 9; b) `SB·AD` = −a²/2 (câu c giữ nguyên, kết quả −3a²/4 đúng) |
| 9 | C1.3.3 VD3 b), c) | b) gần như chép đề (a+2b ⊥ 5a−4b); c) chép nguyên đề (AB=a, AA'=a√2); cả 3 ý cùng ra 60° | b) \|a\|=\|b\|=3, (a+2b) ⊥ a → 120°; c) AB=2, AA'=√2 → 90° (AB' ⊥ BC') |
| 10 | C1.1.2 VD3 c) | Hỏi thừa: \|AC'\| và \|AB+AD+AA'\| là một | Chỉ hỏi \|AB+AD+AA'\| |

Lý thuyết thêm ở C1.1.2 (tứ diện đều, tam giác góc 120°, đường chéo hộp chữ nhật): đúng, có câu đề thật cho cả ba, không lặp lý thuyết nhóm C1.1. Quy tắc cộng–trừ đã có sẵn trong lý thuyết C1.1.2 (đúng quyết định Thùy). GHI CHÚ cuối tệp đã thêm dòng soát bổ sung.

## Cần CEO xem
- Không có điểm nào.
