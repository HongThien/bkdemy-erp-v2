KẾT LUẬN: ĐẠT

# Soát pnl-b3-p3 — PNL Bài 3 Hàm số liên tục, phần 3/3

- Số câu: 40 (16 Đ/S · 24 TLN), tất cả `luyen`; 0 câu `giang` (không có mục "Ví dụ" trong khúc). Đ/S không gán dạng, đúng brief.
- Lệch đáp số so với Pha 1 (`pnl-b3-p3.kiem.md`): **trước 0 / sau 0**. Cả 40 câu (64 ý Đ/S + 24 đáp số TLN) khớp bản giải mù, và từng câu đã được tính lại bằng node.
- `kiem.mjs`: ✔ đạt (trước và sau khi sửa). Bản gốc trước khi sửa: `pnl-b3-p3.goc.json`.

## Đối chiếu nguồn (`don-vi/pnl-b3-p3.txt`)
- **Bỏ vì hình: Phần II Câu 5, 7, 11 — xác nhận đúng.** Câu 5 (bãi đỗ xe 60 000/40 000): các ý a và c hỏi thẳng "đồ thị"/"từ đồ thị", còn lời giải ý c là OLE hỏng. Câu 7 và 11 chỉ cho hàm bằng hình. Không bỏ nhầm câu nào đủ chữ để giải.
- **Đề dựng lại từ lời giải vì OLE hỏng.** Tôi đã đối chiếu từng dòng lời giải sách, không thấy chỗ nào mâu thuẫn:
  - DS19 f₃: lời giải dùng `lim_{x→4⁻}(2x−m)=8−m=f(4)` nên nhánh trái là `x≤4`; nhánh phải là `(x²−16)/(√x−2)`.
  - DS19 f₄: f(1)=k², nhánh trái 2−x², nhánh phải (x−2)².
  - TL10: v(5)=10+a, nhánh trái 10+a, nhánh phải t²−5t+10. Miền "0≤t≤5" là phỏng đoán nhưng không ảnh hưởng đáp số.
  - TL18: f(1)=2, giới hạn trái lấy theo x²+x nên nhánh này là `x≤1`; nhánh phải m²x+1.
  - TL21: nhánh x≠1 là (∛(x+7)−√(3x+1))/(x−1), f(1)=a²+a−8/3.
  - Đánh giá: dựng đúng về toán (đáp số không phụ thuộc phần phỏng đoán). Vẫn nên đối chiếu bản gốc vì không thấy được ký hiệu thật (xem "Còn nghi").
- **Sửa chữ đề:**
  - TL5: x=−2 → x=2, đúng vì lời giải sách dùng x=2 suốt.
  - TL22: hai nhánh đều in "x≠1" → nhánh sau sửa thành "x=1", lỗi in hiển nhiên.
  - TL19: "bao nhiêu người" → "bao nhiêu nghìn người", để khớp đáp số 500.
  - DS17 ý d: câu hỏi sửa thành khẳng định.
  - DS18 ý c: lim x→5⁺ → lim t→5⁺.
  - Cả năm chỗ đều giữ nghĩa đề.
- **TL12 (m>0 mâu thuẫn với m=−a/√b):** bản soạn giữ đề như sách in, có "Lưu ý" ở đầu Phần 2 và ghi "ĐỀ SAI" ở ghi chú. Kết quả m=−2/√3, a−b=−1, trùng sách. Đúng luật 24/10.
- **LỆCH SÁCH — máy xác nhận bản soạn đúng:**
  - DS21 ý b: sách ghi Đúng. Với m=1/2 phương trình có hai nghiệm ≈ −0,54 và 2,21 trong (−1;3) ⇒ "nhiều nhất một nghiệm" là **Sai**.
  - DS22 ý c: sách ghi Đúng, nhưng chính lời giải sách nói "không liên tục". Giới hạn trái 120 000 ≠ giới hạn phải 140 000 ⇒ **Sai**.
  - TL14: sách in "a=−1/6=0,2" (sai dấu). Thay a=−1/6 thì f(±10⁻⁶)=3 ⇒ đáp số **−0,2**.
  - DS6: đáp án Đ/S khớp sách (S Đ Đ S); "lệch" chỉ nằm ở lời giải sách tự mâu thuẫn (403 205 vs 403 250).
- **DS12 ý c, d (suy từ lời giải):** f(2)=3=lim nên hàm liên tục tại 2 và trên ℝ ⇒ c Sai, d Sai. Khớp bản giải mù.
- **TL9 (giải lại không dùng đạo hàm):** kiểm từng dòng, đúng toán.
  - Trên [−1;0]: x⁴, x², −x cùng giảm ⇒ f giảm ngặt.
  - Trên [0;½]: f ≤ ¼+½−3 < 0.
  - Trên [½;1]: f(y)−f(x)=(y−x)[4(x+y)(x²+y²)+2(x+y)−1] > 0 vì x+y>1.
  - Kết luận đúng 2 nghiệm, khớp máy (≈ −0,737; 0,875). Lời giải sách dùng f′, f″ ⇒ ngoài phạm vi, bản soạn bỏ đúng.

## Soát dạng (`dich.md`, dạng sau thắng)
- NDB01191 (tham số ở 1 nhánh, liên tục tại 1 điểm): TL1–4, 6, 7, 8, 12, 13, 14, 18, 21.
- NDB01197 (liên tục trên ℝ / tập xác định): TL5, 16, 20, 22. TL20 có tham số ở cả hai nhánh nhưng NDB01197 đứng sau NDB01193 ⇒ đúng luật dạng sau thắng.
- NDB01198 (thực tế): TL10, 11, 17, 23, 24.
- NDB01200 (ít nhất k nghiệm): TL9, 15.
- NDB01185 (mô hình có giới hạn): TL19.
- Không có gán sai, bản đồ không thiếu dạng nào.

## Soát lời giải và định dạng
- Phần 1 không lộ đáp số cuối. Phần 2 mỗi phép một dòng, kết "Vậy …". Đ/S có dòng tổng kết bốn ý.
- Không có `\times`, `\left`, `\right`, `\frac`, `$$`, và không dùng L'Hôpital.
- TLN đều ≤ 4 ký tự (1000; −0,2; 10,9…).

| id | lỗi | sửa gì |
|---|---|---|
| TL9 | lời giải (phạm vi, chữ) — Mấu chốt ghi "không dùng đạo hàm": nhắc khái niệm ngoài phạm vi trong lời giải cho học sinh | thay bằng "chỉ ra bằng cách so sánh giá trị hàm tại hai điểm bất kì" |
| TL22 | kiem — dùng hằng số −2 gõ sẵn, không tính giới hạn từ đề | kiem tính lim (x²−3x) hai phía rồi giải a²+a−8=f(1) |
| TL5 | kiem — chỉ kiểm giới hạn, không kiểm m=3 làm f liên tục | kiem dựng f(m,x), kiểm m=3 liên tục và m khác thì gián đoạn |

(Tệp JSON chỉ đổi 3 dòng trên so với `pnl-b3-p3.goc.json`; giữ nguyên định dạng thụt lề.)

## Câu CÒN nghi — cần CEO
1. **DS6 (taxi):** trạm soạn THÊM chữ "(đơn giá tính theo km)" vào đề để ý b khớp đáp án sách.
   - Đọc như bảng giá taxi thông thường ("giá mở cửa 0,5 km đầu là 10 000 đồng" là trọn gói): ý b phải là **Sai** (S S Đ S), và f(40)=518 250.
   - Đọc như bản soạn (10 000 đ/km × 0,5 km = 5 000, khớp hằng số 403 250 sách in sẵn trong các ý): ý b **Đúng** (S Đ Đ S, trùng sách).
   - Thùy chọn: giữ cách đọc của bản soạn (khớp sách), hay bỏ câu này.
2. **TL5:** đề sách in x≠−2 / x=−2. Đọc nguyên văn thì vẫn giải được: tập xác định ℝ∖{2}, liên tục tại −2 ⇔ m=−1. Bản soạn sửa thành x=2 (m=3) theo lời giải sách. Tôi đồng ý đây là lỗi in, chỉ nêu để Thùy biết đề nguyên văn cũng ra số khác (−1).
3. **DS19 (f₃, f₄), TL10, TL18, TL21:** đề dựng lại từ lời giải. Dựng đúng về toán và đáp số chắc chắn, nhưng dấu biên của nhánh (≤ hay <) và miền của t ở TL10 là phỏng đoán ⇒ nên liếc bản gốc trước khi vào kho.
4. **TL19:** thị trấn "không vượt quá 500 nghìn người" — số lớn bất thường cho một thị trấn (có thể sách định đơn vị là người, tức 500 người). Toán đúng theo đề in.
5. **TL23:** đề không nói rõ "đường đi liên tục"; lời giải tự nêu lý do vật lí. Đáp số 3,4 trùng sách.
