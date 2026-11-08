KẾT LUẬN: ĐẠT (sau khi sửa)

Trạm soát Opus lượt 2 · 03/11 · soát phần RÀ "bám đề thi" + BỔ SUNG của `noi-dung/SDT.txt` (so với `SDT.truoc-bs.txt` bằng `diff`).

- Máy kiểm `kiem-moi.mjs SDT … (16 mã)`: 6 nhóm · 10 dạng · 27 ví dụ · lỗi 0 · cảnh báo 0.
- Tự giải lại 7 ví dụ mới + 2 ý mới (C1.3.2 VD1 d; VD2 e, f) bằng script riêng `S\soat2\SDT\giai.cjs` (R, Q_k nội suy kèm cờ "tích luỹ = kn/4", x̄/s² ghép nhóm, s mẫu gốc, sai số tương đối): 9/9 đáp số ĐÚNG. Không ví dụ mới nào rơi ca biên tích luỹ = kn/4.
- Quét 381 câu đề SDT (`S\soat2\SDT\dump.cjs` → `all.txt`, lọc từ khoá `cnt.cjs`) để kiểm phần đã xoá.

## Kiểm phần ĐÃ XOÁ (số câu đề có hỏi)

| Ý đã xoá | Từ khoá quét | Số câu đề | Kết luận |
|---|---|---|---|
| Giá trị ngoại lệ Q1−1,5ΔQ / Q3+1,5ΔQ và các câu "ngoại lệ" | ngoại lệ; 1,5 (ngoài đầu mút nhóm) | 0 | xoá đúng |
| Công thức tắt ΔQ = nh/(2n_m) khi Q1, Q3 cùng nhóm | chỉ là mẹo tính, công thức nội suy chung vẫn giải được | 0 câu hỏi riêng | xoá đúng |
| Co giãn: nhân đầu mút với k | đọc hết 12 câu C2.1.1: chỉ có tịnh tiến (T112000000012) và nhân tần số (T1120000003076) | 0 | xoá đúng |
| Máy tính cầm tay, bẫy σx / s_x | máy tính, casio, σ, s_x, chia n−1 | 0 (1 kết quả "máy tính" là ngữ cảnh trạm quan trắc) | xoá đúng, không phải khôi phục |
| s = 0 khi mọi số liệu cùng một nhóm | cùng một nhóm, bằng 0 | 0 | xoá đúng |
| "(nhóm chứa mốt)" ở C2.3 | mốt | 0 ở C2.3 (1 câu C1.3.2 T1120000003515 có "Mốt" làm phương án nhiễu — vẫn được phủ ở C1.3.2) | xoá đúng |

Không ý nào đã xoá có ≥3 câu đề ⇒ không khôi phục.

## Kiểm phần ĐÃ THÊM (kiểu đề thật)

| Dạng | Thêm | Câu đề thật đối chiếu | Kết quả |
|---|---|---|---|
| C1.1.1 | VD3 biểu đồ cột, nhóm đầu tần số 0, nhóm cuối dạng đoạn | T1120000003753 (nhóm [9;10]), nhiều câu "bảng sau" dạng ảnh | đạt sau sửa (bỏ ý a) |
| C1.2.2 | VD3 đầu mút thập phân, Q1 + trung vị làm tròn | 16 câu, có đầu mút thập phân | đạt |
| C1.2.3 | VD biểu đồ cột, ΔQ | 4 câu biểu đồ | đạt sau sửa (dời vị trí) |
| C1.3.1 | VD3 hai lĩnh vực đầu tư, a+b | câu đầu tư / tổng hai s | đạt |
| C1.3.2 | ý d) phương sai → s; e) "luôn bằng" mẫu gốc; f) đơn vị | 10 câu "phương sai bằng", 1 câu "luôn bằng", 1 câu "cùng đơn vị" | đạt |
| C2.1.1 | VD3 hai tổ thưởng Tết, R rồi ΔQ | T1120000003432 (R hai tổ), T1120000004355 (ΔQ đồng đều nhất) | đạt |
| C2.2.1 | VD3 hiệu R ghép − R gốc, sai số tương đối của s | T1120000003519, T1120000003544, T1120000004727 | đạt |
| C2.3.1 | VD3 biểu đồ cột, đầu mút thập phân, trung bình làm tròn | T1120000003582 (biểu đồ), T1120000004524 (thập phân, làm tròn) | đạt |
| Lý thuyết | C1.3.1 cho sẵn giá trị đại diện (3 câu); C1.3.2 s ghép ≈ s gốc; C2.1.1 cho sẵn s1, s2 cùng trung bình (T1120000003557) | có câu đề | đạt |

Ví dụ 2 khó hơn ví dụ 1 ở cả 10 dạng (sau khi dời ví dụ C1.2.3).

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1.1 | VD3 | lạc dạng + mơ hồ | Ý a) "Có bao nhiêu học sinh trong nhóm?" là kiểu đếm cỡ mẫu của C2.3.1 (0/96 câu C1.1.1 hỏi cỡ mẫu), và "nhóm" lẫn với "nhóm" ghép nhóm. Bỏ ý a), VD3 chỉ hỏi R; sửa câu kết luận |
| C1.2.3 | thứ tự ví dụ | mức độ | Ví dụ biểu đồ cột (ΔQ = 0,33, số chẵn) bị chèn vào vị trí VD2, dễ hơn VD1 (ΔQ phân số, làm tròn). Dời xuống cuối thành VD3; VD2 = ΔQ dạng a/b (khó hơn VD1) |
| GHI CHÚ | đếm | sai số | "6 ví dụ mới" → "7 ví dụ mới"; mô tả C1.1.1 VD3 cập nhật |

## Cần CEO xem

- Các ví dụ biểu đồ cột (C1.1.1, C1.2.3, C2.3.1) mô tả biểu đồ bằng chữ (chân cột, chiều cao cột) vì chương không có hình; nếu muốn đúng hình thức đề thật thì cần vẽ hình cột.
- Ngân hàng đề mất ảnh bảng ở ~34/96 câu C1.1.1 ("bảng sau" không có số) nên không đếm được chính xác số câu dạng biểu đồ cột ở C1.1.1.
