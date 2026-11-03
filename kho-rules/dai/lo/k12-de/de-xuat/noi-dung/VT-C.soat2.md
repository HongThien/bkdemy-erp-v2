KẾT LUẬN: ĐẠT

# Soát lần 2 (phần bổ sung) — VT, JOB C (C3.2, C3.3, C3.4 · 8 dạng) — 03/11

Phạm vi: `diff VT-C.truoc-bs.txt VT-C.txt` = (1) thêm ví dụ 3 của C3.4.2; (2) C3.4.3 bỏ "thể tích hình hộp" ở dòng mô tả, lý thuyết, ##CY; (3) viết lại câu "vectơ pháp tuyến của (ABC)"; (4) cập nhật GHI CHÚ. Rà nhanh phần cũ (đã soát đạt lần 1).

## Toàn vẹn tệp
- Đủ 3 khối nhóm + 8 dạng, đúng thứ tự (C3.2 → C3.2.1–3 → C3.3 → C3.3.1–2 → C3.4 → C3.4.1–3), 17 ví dụ (trước bổ sung 16), không dòng lạ, không mất khối. Mô tả C3.4.3 trong tệp khớp `VT.json` (đã bỏ hình hộp).
- Không còn "thể tích hình hộp" (chữ "hình hộp" còn lại ở C3.2.2 là bài tìm đỉnh — đúng dạng). Không có phương trình mặt phẳng/đường thẳng/mặt cầu.

## Tự giải lại (script `S\soat2\VT-C\vd3.mjs`)
- VD3 a): M(0;t;0), MA·MB = t²−3t−4 = 0 ⇒ t = 4 (tia Oy loại t = −1); MA = 3, MB = √17, S = 3√17/2 ≈ 6,18 — khớp.
- VD3 b): quét lưới + suy luận trừ cặp phương trình ⇒ nghiệm duy nhất khác O là N(2;2;2), x+y+z = 6 — khớp.
- Đối chiếu đề thật (`cau-dang.cjs VT C3.4.2`): a) cùng kiểu T1120000004226 (M trên tia Oy, vuông tại M, tính diện tích); b) cùng kiểu T1120000003851 (ba góc vuông). Số liệu khác đề (đề: A(0;2;−1), B(1;−3;6); A,B,C trên trục cách O 4 đơn vị).

## Chỗ đã sửa
| Vị trí | Lỗi | Sửa |
|---|---|---|
| C3.4.3 @ly_thuyet ý 5 | "vectơ pháp tuyến của (ABC) chính là kết quả của tích có hướng" — viết như thể chỉ có một vectơ pháp tuyến | "[AB,AC] là một vectơ pháp tuyến của (ABC) (mọi bội khác 0 của nó cũng vậy)" |

Máy kiểm: `kiem-moi.mjs VT VT-C.txt <11 mã>` — lỗi 0, cảnh báo 0.

## Cần CEO xem
- VD3 b) giữ nguyên cấu trúc câu T1120000003851 (ba điểm trên ba trục, cùng khoảng cách tới O), chỉ đổi 4 → 3. Số khác, nhưng là bản thu nhỏ của đề; nếu muốn khác hơn thì đổi sang ba điểm không cùng khoảng cách tới O (cần soạn và giải lại).
