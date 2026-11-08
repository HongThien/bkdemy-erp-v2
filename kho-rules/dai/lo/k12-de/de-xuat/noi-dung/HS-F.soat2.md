KẾT LUẬN: ĐẠT

# Biên bản soát phần BỔ SUNG HS-F (03/11) — nhóm C2.2 + C2.2.1–C2.2.6

Phạm vi (diff `HS-F.truoc-bs.txt` → `HS-F.txt`): C2.2.4 thêm 1 ý lý thuyết (đối xứng qua đường thẳng, MP+MQ nhỏ nhất), 1 bước PP, ví dụ 3; C2.2.6 thêm 1 ý lý thuyết (xác suất hai hàm trùng phương có cực trị chung), 2 ví dụ; GHI CHÚ cập nhật. Không có hình mới. Phần cũ không đổi (đã ĐẠT ở `HS-F.soat.md`).

## Tự giải lại (script `S\soat2\HS-F\kiem.cjs`, độc lập trạm soạn)
| Ví dụ | Cách kiểm | Kết quả |
|---|---|---|
| C2.2.4 VD3 | quét số MP+MQ trên d (bước 1e-5) | M(2;−1), a−b=3, min = P′Q = 4√5 — khớp |
| C2.2.6 VD (cực trị trong khoảng) | giải y′=0 với mọi m nguyên | 4 giá trị {0;1;3;4} — khớp |
| C2.2.6 VD (x^10) a | so f(±h) với f(0) | 5 giá trị {−2..2} — khớp |
| C2.2.6 VD (x^10) b | duyệt mọi cặp (a,b), so toạ độ cực trị | 5/110 = 1/22 — khớp |
| Công thức điểm đối xứng P′ trong lý thuyết | trung điểm PP′ nằm trên d | đúng |

Đối chiếu đề thật (`cau-dang.cjs HS C2.2.4 20`, `C2.2.6 12`, `C2.2.5 30`): ví dụ mới đúng kiểu T112020401099 (MA+MB, M trên đường thẳng cực trị), T112000000462 (cực đại tại 0 của x^12…), T1120000005975 (xác suất hai trùng phương), T1120000006638 (hai cực trị trong khoảng). Cùng phương pháp đã thử lại trên chính đề thật: ra đúng đáp án đề (b−a=1; 8/3192=1/399; 3 giá trị). Số liệu ví dụ khác đề, không chép. Ý lý thuyết mới không lặp lý thuyết nhóm C2.2; không có ý đề không hỏi.

## Chỗ đã sửa
| # | Vị trí | Lỗi | Sửa |
|---|---|---|---|
| 1 | C2.2.6 thứ tự ví dụ | ví dụ khó (x^10 + xác suất) đứng trước ví dụ dễ (cực trị trong khoảng) | đổi chỗ: ví dụ 3 = cực trị trong khoảng, ví dụ 4 = x^10 + xác suất; cập nhật GHI CHÚ |

Máy kiểm `kiem-moi.mjs HS … C2.2,C2.2.1–C2.2.6`: 15 ví dụ · 4 hình · lỗi 0 · cảnh báo 0.

## Cần CEO xem
- Lý thuyết C2.2.6 (phần cũ) và PP vẫn nêu điều kiện đủ bằng y″. Quyết định "không dùng f″ nếu đề không hỏi" của Thùy ghi cho C1.5.1/C1.4; 3 câu đề C2.2.6 cũng không cần y″. Có áp luôn cho C2.2.6 không? (trạm soát chưa xoá vì quyết định không ghi tên dạng này).
