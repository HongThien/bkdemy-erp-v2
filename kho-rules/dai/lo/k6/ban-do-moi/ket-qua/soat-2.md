KẾT LUẬN: ĐẠT

# Biên bản soát gói 2 — Tính thuận tiện · Luỹ thừa · Thứ tự phép tính · Toán thực tế (Opus, 14/10)

- Gói: `goi/goi-2.json` · bản soạn: `out/out-2.json` (bản gốc trạm soạn: `out/out-2.goc.json`).
- Đã soát: **26 ví dụ** (13 dạng × 2) · **0 khối lý thuyết** (cả 5 nhóm NNB00893/897/898/900/896 đều `can_ly_thuyet: false`).
- Cách kiểm: tự tính lại từng ví dụ từ đề bằng `node` (biểu thức `.`=nhân, `:`=chia, ngoặc `[ ]`/`\{ \}`), so **mọi dòng** `$=…$` trong lời giải với giá trị của đề — 26/26 chuỗi biến đổi nhất quán, đáp số đúng. Bài thực tế tính tay lại ($250000$, $200000$, $50000$; $240$, $195$, $555$, $8325000$) — đúng.
- Kiến thức: không chuyển vế, không $(a^m)^n$ (NDB00356 đổi $2^4$, $4^2$, $4^3$, $8^2$, $2^6$ ra giá trị rồi mới rút), không `\cdot`/`\times`. $a^m.a^n$, $a^m:a^n$ dùng ở NDB00354/00360 thuộc Ch I.
- Cổng: `kiem-goi.mjs` ⇒ **✔ đạt cổng** (13 dạng, 15 ghi chú).

## Chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00342 (VD1) | khuôn (câu chữ) | "Nhóm các số có đuôi cộng (hoặc trừ) cho số tròn trăm" ⇒ "Ghép các số hạng có tổng hoặc hiệu là số tròn trăm" | Câu dẫn cũ tối nghĩa |
| NDB00342 (VD2) | kiến thức | "ghép $625$ với $-225$ và $348$ với $-148$" ⇒ "ghép $625$ với số trừ $225$, ghép $348$ với số trừ $148$" | Viết $-225$ đứng riêng là ký hiệu số âm (Ch III, chưa học ở chương này) |
| NDB00347 (VD1, VD2) | dạng | $27.64+27.36+13.52+13.48$ ⇒ $27.64+27.36+15.42+15.18$ (= $3600$); $45.113-45.13+27.58+27.42$ ⇒ $45.113-45.13+25.58-25.18$ (= $5500$) | Hai ví dụ cũ đều ra $a.100+b.100$, rút $100$ lần nữa được ⇒ trượt sang dạng anh em NDB00346 "Rút thừa số chung 2 lần". Đổi số để hai đôi cụm ra kết quả khác nhau, đúng nét riêng của 347 |

Không ví dụ nào sai toán. Không sửa định dạng (đã sạch).

## Phân xử các điểm trạm soạn nêu

- **5 dạng nhân chia NNB00893 không có ứng viên** — xác nhận: 6 dạng cùng trỏ cụm cũ DCUM01566, 8 ứng viên giống hệt, toàn cộng–trừ. Ví dụ soạn mới của NDB00343–00347 đúng toán, đúng dạng (sau khi sửa 347).
- **NDB00345 "Ẩn nhân tử chung"** — giữ cách hiểu của trạm soạn (một cụm có vài thừa số mà tích bằng thừa số chung của cụm kia: $4.3=12$; $6.8=2.24=48$). Khớp chữ mô tả "tích của các thừa số tạo ra số giống nhau. Rút tích giống nhau đó ra".
- **NDB00346 vs NDB00347** — phân xử: 346 = hai ngoặc sau lần rút 1 giống nhau ⇒ rút lần 2; 347 = mỗi đôi cụm một thừa số chung riêng, hai ngoặc khác nhau ⇒ tính từng đôi rồi cộng. Đã sửa 347 theo ranh giới này.
- **NDB00356, NDB00361 không có ứng viên đúng dạng** — xác nhận (ứng viên trùng 00355 / 00360). Ví dụ soạn mới đúng.

## Ghi chú còn lại gửi CEO

1. Gắn lại `cum_cu` cho 5 dạng nhân chia NDB00343–00347 (đang trỏ nhầm cụm cộng–trừ DCUM01566); NDB00356 trỏ cụm của 00355; NDB00361 trỏ cụm "Chỉ Tròn + Vuông".
2. Sửa chữ mô tả: NDB00342 "tròn chăm" ⇒ "tròn trăm"; NDB00346 "tính chất kết hợp của phép nhân với phép cộng" ⇒ "tính chất **phân phối** của phép nhân đối với phép cộng"; NDB00347 mô tả cụt sau dấu phẩy.
3. Ranh giới 346 / 347 như trên — CEO xác nhận để ghi vào mô tả hai dạng.
4. Lý thuyết nhóm NNB00897 nên thêm quy tắc $a^m.a^n=a^{m+n}$ (ví dụ NDB00354 có dùng).
5. Lý thuyết hiện có của NNB00893/898/900/896 còn `\cdot` / `\times` và `\n` chữ thường trong NNB00898 — chuẩn hoá khi ghi.
