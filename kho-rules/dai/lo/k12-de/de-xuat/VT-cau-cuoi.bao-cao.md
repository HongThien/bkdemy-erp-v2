# VT — bảng câu→dạng CUỐI: báo cáo

File: `VT-cau-cuoi.tsv` (`id⇥dạng⇥ghi_chú`). Nguồn: ánh xạ sơ bộ `VT-cau.tsv` + sửa sau khi đọc câu. Script kiểm: tổng 1550 dòng = 1550 câu không-Đ/S trong `VT-ids.txt` (2 câu đã loại T1120000005532, T1120000005624 vốn không có trong danh sách), không trùng, mọi dạng có trong `VT.json` hoặc là `CHUONG:*`/`CHUA`.

## 1. Tổng quan

- Đổi dạng so với sơ bộ: **134** câu
- `CHUA`: **4**
- `CHUONG:`: **48** (PPTD 46, HS 2)
- Dạng 0 câu: không có

## 2. Đổi dạng (sơ bộ → cuối)

| Sơ bộ → cuối | Số câu |
|---|---|
| C4.1.1 → C4.1.2 | 39 |
| C4.3.2 → CHUONG:PPTD | 25 |
| C3.5.1 → CHUONG:PPTD | 10 |
| C3.5.2 → C3.5.1 | 7 |
| C2.1.2 → C4.2.2 | 5 |
| C2.2.2 → C4.2.2 | 4 |
| C1.3.1 → C1.3.2 | 4 |
| C4.2.1 → C4.2.2 | 4 |
| C3.2.3 → C4.3.1 | 3 |
| C4.3.1 → CHUONG:PPTD | 3 |
| C2.2.1 → C4.2.1 | 3 |
| C2.1.2 → C4.2.1 | 3 |
| C2.2.2 → CHUONG:PPTD | 2 |
| C1.3.2 → C1.3.3 | 2 |
| C4.3.2 → C3.5.2 | 2 |
| C4.2.1 → C3.5.2 | 2 |
| C3.4.3 → CHUONG:PPTD | 2 |
| C4.2.1 → CHUONG:PPTD | 2 |
| C1.1.1 → CHUONG:PPTD | 1 |
| C4.3.2 → CHUONG:HS | 1 |
| C1.1.2 → C1.3.1 | 1 |
| C1.2.2 → C1.1.2 | 1 |
| C4.2.2 → C4.1.2 | 1 |
| C2.2.2 → CHUA | 1 |
| C2.2.2 → C1.3.3 | 1 |
| C2.2.1 → CHUA | 1 |
| C1.2.4 → CHUONG:PPTD | 1 |
| C3.5.2 → CHUA | 1 |
| C3.4.3 → CHUONG:HS | 1 |
| C3.5.1 → CHUA | 1 |

Lý do chính: (1) nhóm lực cũ P1.5.1 (72 câu) tách theo cách giải: hợp lực khi biết độ lớn + góc, trọng lực, F=ma → C4.1.1; dây treo, xích, cáp cần cẩu, giá đỡ chân, chất điểm/vật cân bằng → C4.1.2. (2) Bài thực tế toạ độ theo `VT-thucte-phanloai.tsv` (đã đọc lại): vùng phủ hình cầu, GPS giải hệ, mặt phẳng chắn sóng → PPTD; "tổng khoảng cách nhỏ nhất tới điểm trên mặt đất" → C3.5.2; máy bay cất cánh / chim / xe kéo cáp cho độ dài + góc → C4.2.2. (3) Tâm tỉ cự (ΣkMA², tổng tích vô hướng, |Σ vectơ|) đang ở C3.5.2 → C3.5.1. (4) Câu có M thuộc mặt phẳng/mặt cầu/đường thẳng cho bằng phương trình, vectơ pháp tuyến, cặp VTCP mặt phẳng, góc đường–mặt, góc hai mặt → PPTD. (5) Lạc chương hàm số → HS.

## 3. CHUA (4) — không dạng nào khớp, chưa chắc ≥90%

- T312000000112 — tứ diện lồng nhau, thể tích — hình KG thuần, không rõ dạng VT — đổi từ C2.2.2
- T312000000094 — bóng các cạnh hình hộp, max — không thuộc dạng VT nào — đổi từ C2.2.1
- T312000000915 — tổng khoảng cách tới 3 điểm nhỏ nhất (Fermat), không khớp dạng — đổi từ C3.5.2
- T312000000206 — khoảng cách tới đường thẳng MD lớn nhất — chưa chắc dạng — đổi từ C3.5.1

## 4. Chuyển sang chương PP toạ độ — CHUONG:PPTD (46) — cho PPTD agent

- T312000000630 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000819 — quỹ tích mặt cầu, tìm tâm — đổi từ C3.5.1
- T112000000454 — góc đường thẳng–mặt phẳng (cần pháp tuyến) — đổi từ C2.2.2
- T312010107080 — M thuộc mặt phẳng (P) cho bằng phương trình — đổi từ C3.5.1
- T3120000001144 — GPS: giải hệ khoảng cách — đổi từ C4.3.2
- T3120000001079 — vectơ pháp tuyến của mặt phẳng — đổi từ C1.1.1
- T312000000148 — M thuộc mặt phẳng (P) cho bằng phương trình — đổi từ C3.5.1
- T312010706004 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000433 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312010802042 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.1
- T312000000560 — M thuộc mặt cầu cho bằng phương trình — đổi từ C3.5.1
- T312000000074 — đường thẳng d cho bằng phương trình — đổi từ C3.5.1
- T312000000911 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000676 — cho phương trình tham số đường thẳng — đổi từ C4.3.1
- T312000000597 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312010802024 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000492 — GPS: giải hệ khoảng cách — đổi từ C4.3.2
- T312010802047 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312010403001 — đường thẳng d cho bằng phương trình — đổi từ C3.5.1
- T312010802025 — mặt phẳng chắn sóng / tia sáng — đổi từ C4.3.2
- T312010802026 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000150 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312010705013 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000130 — góc giữa hai mặt phẳng — đổi từ C2.2.2
- T312010802037 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000119 — M thuộc mặt cầu cho bằng phương trình — đổi từ C3.5.1
- T312010802038 — mặt phẳng chắn sóng / tia sáng — đổi từ C4.3.1
- T312000000972 — vectơ pháp tuyến của mặt phẳng — đổi từ C3.4.3
- T312010802043 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T3120000001074 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000153 — mặt phẳng chắn sóng / tia sáng — đổi từ C4.2.1
- T312000000685 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000650 — M thuộc mặt cầu cho bằng phương trình — đổi từ C3.5.1
- T312010802048 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000105 — mặt phẳng (P) phương trình + quỹ tích mặt cầu — đổi từ C3.5.1
- T312000000623 — GPS: giải hệ khoảng cách — đổi từ C4.3.2
- T312000000481 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T112000000479 — cặp vectơ chỉ phương của mặt phẳng — đổi từ C1.2.4
- T3120000001098 — vectơ pháp tuyến của mặt phẳng — đổi từ C3.4.3
- T3120000001103 — phương trình mặt phẳng — đổi từ C4.2.1
- T312000000349 — M thuộc mặt cầu cho bằng phương trình — đổi từ C3.5.1
- T312010802063 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312000000360 — vùng phủ hình cầu / đường thẳng cắt mặt cầu — đổi từ C4.3.2
- T312010802033 — mặt phẳng chắn sóng / tia sáng — đổi từ C4.3.2
- T312000000856 — GPS: giải hệ khoảng cách — đổi từ C4.3.2
- T312000000240 — GPS: giải hệ khoảng cách — đổi từ C4.3.2

Danh sách id (một dòng):

```
T312000000630 T312000000819 T112000000454 T312010107080 T3120000001144 T3120000001079 T312000000148 T312010706004 T312000000433 T312010802042 T312000000560 T312000000074 T312000000911 T312000000676 T312000000597 T312010802024 T312000000492 T312010802047 T312010403001 T312010802025 T312010802026 T312000000150 T312010705013 T312000000130 T312010802037 T312000000119 T312010802038 T312000000972 T312010802043 T3120000001074 T312000000153 T312000000685 T312000000650 T312010802048 T312000000105 T312000000623 T312000000481 T112000000479 T3120000001098 T3120000001103 T312000000349 T312010802063 T312000000360 T312010802033 T312000000856 T312000000240
```

## 5. Chương khác

- T112010102173 → CHUONG:HS — tính đơn điệu hàm số — đổi từ C4.3.2
- T112020302060 → CHUONG:HS — đồ thị hàm số — đổi từ C3.4.3

## 6. Số câu mỗi dạng cuối

| Dạng | Tên | Số câu |
|---|---|---|
| C1.1.1 | Nhận biết vectơ bằng nhau, cùng phương, đối nhau trên hình khối | 57 |
| C1.1.2 | Tính độ dài tổng, hiệu hai vectơ trên hình đặc biệt | 31 |
| C1.2.1 | Rút gọn tổng, hiệu vectơ trong hình hộp, lăng trụ | 149 |
| C1.2.2 | Rút gọn tổng, hiệu vectơ trong hình chóp, tứ diện | 56 |
| C1.2.3 | Dùng hệ thức trung điểm, trọng tâm trên hình khối | 49 |
| C1.2.4 | Phân tích một vectơ theo ba vectơ không đồng phẳng | 35 |
| C1.3.1 | Tính tích vô hướng khi biết độ dài và góc | 45 |
| C1.3.2 | Tính tích vô hướng hai vectơ trên hình khối | 56 |
| C1.3.3 | Tính góc giữa hai vectơ trên hình khối | 66 |
| C2.1.1 | Đọc toạ độ vectơ viết theo i, j, k | 94 |
| C2.1.2 | Tìm hình chiếu, điểm đối xứng qua trục, mặt phẳng toạ độ | 89 |
| C2.2.1 | Gắn hệ trục vào hình hộp chữ nhật, lập phương | 20 |
| C2.2.2 | Gắn hệ trục vào hình chóp, tứ diện; toạ độ đỉnh | 13 |
| C3.1.1 | Tính toạ độ tổng, hiệu, tích vectơ với một số | 78 |
| C3.1.2 | Tính toạ độ vectơ AB từ hai điểm | 61 |
| C3.1.3 | Xét hai vectơ cùng phương, ba điểm thẳng hàng | 13 |
| C3.2.1 | Tìm toạ độ trung điểm, trọng tâm | 68 |
| C3.2.2 | Tìm đỉnh còn lại của hình bình hành, hình hộp, hình thang | 57 |
| C3.2.3 | Tìm điểm chia đoạn theo tỉ số, điểm thoả đẳng thức vectơ | 29 |
| C3.3.1 | Tính độ dài vectơ, khoảng cách giữa hai điểm | 42 |
| C3.3.2 | Tìm điểm cách đều hoặc có khoảng cách cho trước | 7 |
| C3.4.1 | Tính tích vô hướng và góc giữa hai vectơ theo toạ độ | 78 |
| C3.4.2 | Dùng điều kiện vuông góc tìm tham số, tìm điểm | 14 |
| C3.4.3 | Tính tích có hướng, diện tích, thể tích bằng toạ độ | 13 |
| C3.5.1 | Tìm cực trị biểu thức vectơ bằng tâm tỉ cự | 15 |
| C3.5.2 | Điểm trên mặt phẳng toạ độ làm MA+MB nhỏ nhất | 19 |
| C4.1.1 | Tính độ lớn hợp lực khi biết độ lớn và góc | 33 |
| C4.1.2 | Tính lực căng dây treo, chân giá đỡ khi vật cân bằng | 53 |
| C4.2.1 | Lập hệ trục cho phòng, nhà, sân rồi tính khoảng cách, góc | 42 |
| C4.2.2 | Toạ độ vật từ độ dài và góc: cần trục, dây cáp | 23 |
| C4.3.1 | Tìm vị trí, thời gian, vận tốc của vật bay thẳng đều | 73 |
| C4.3.2 | Vị trí, khoảng cách giữa các vật chuyển động trong Oxyz (flycam, máy bay, tàu) | 20 |
| CHUONG:PPTD | (chuyển chương) | 46 |
| CHUONG:HS | (chuyển chương) | 2 |
| CHUA | (chưa xếp) | 4 |

## 7. Ghi chú để duyệt

- Giữ nguyên ánh xạ sơ bộ ở chỗ cả hai dạng đều hợp lý (vd bài nhện/kiến trong hộp kính để C2.2.1; câu trụ điện sườn dốc T312000000221 giữ C2.2.2; lồng đèn T312000000164 giữ C2.2.2 vì thể tích tính bằng công thức hình học, không dùng tích có hướng).
- GPS: C3.3.2 ghi "cùng cách với bài GPS" nhưng theo ranh giới đã duyệt, GPS giải hệ → PPTD.
- T312000000676 (viên đạn đi theo phương trình tham số của đường thẳng) → PPTD vì đề cho phương trình đường thẳng; nếu Thùy coi chỉ là thế t thì trả về C4.3.1.
- Các nhóm cơ bản (C1.1.1, C1.2.1, C2.1.x, C3.1.x, C3.2.x, C3.3.x, C3.4.x) đã lướt từng câu; ngoài những câu ghi ở trên, không thấy câu nào sai dạng rõ.
