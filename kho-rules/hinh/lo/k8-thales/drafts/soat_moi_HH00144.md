# Biên bản SOÁT mù — 7 câu Đường phân giác MỚI (HH00144) — 02/11

Nguồn soát: `draft_HH00144_N3.md` (TLt1–TLt4), `draft_HH00144_N4.md` (VNt1–VNt3); hình `hinh_N3\`, `hinh_N4\`.
Pha 1 (giải mù, máy): `<TH>\pha1_soat_moi_HH00144.mjs` — dựng tam giác từ 3 cạnh, D tìm bằng chia đôi sao cho góc BAD = góc DAC (KHÔNG dùng công thức tỉ số). TLt1/VNt1 (thiếu BC) thử 2 góc A khác nhau; TLt4 tìm BC bằng chia đôi theo điều kiện DC − DB = 20.

| Nhãn | Pha 1 máy | dap_an nháp | Khớp? | Sửa gì |
|---|---|---|---|---|
| TLt1 | DC = 8 (cả 2 góc A) | 8 | ✓ | — |
| TLt2 | BD = 8, DC = 12 | BD=8; DC=12 | ✓ | — |
| TLt3 | BD = 24, DC = 40 | BD=24; DC=40 | ✓ | — |
| TLt4 | BC = 140 (duy nhất) | 140 | ✓ | Phần 1: dòng 2 của **Mấu chốt** quá dài (~95 ký tự) ⇒ rút gọn, tách 2 dòng (luật dòng ngắn). |
| VNt1 | DC = 6 (cả 2 góc A) | 6 | ✓ | Phần 1 **Chú ý**: bỏ dòng "(khác hình ở bài trên lớp…)" — tham chiếu câu khác, câu trong kho phải tự đứng. |
| VNt2 | BD = 6, DC = 8 | BD=6; DC=8 | ✓ | **Hình**: nhãn `21` cũ nằm trong tam giác, gần `AD` hơn `AB` ⇒ dễ đọc nhầm `AD=21`. Vẽ lại bằng `ve_N4_soat.mjs` (chỉ VNt2), dời `21` ra ngoài cạnh `AB`; ghi đè `hinh_N4\VNt2.png/.svg`; bản cũ lưu `drafts\_truoc_soat\VNt2_N4_truoc_soat.png`. Bảng `_bang.png` dựng lại. |
| VNt3 | BD = 3,6, DC = 5,4 (4+6>9 ✓) | BD=3,6; DC=5,4 | ✓ | — |

## Các mục đã kiểm (a)–(e)
- (a) Đề tự đủ dữ kiện, số liệu giữ nguyên `de-moi.md`; tam giác tồn tại cả 5 câu cho đủ 3 cạnh (TLt2, TLt3, TLt4 với BC=140, VNt2, VNt3). VNt1/VNt2/VNt3 thêm tên `x`, `y` cho khớp hình — không đổi yêu cầu. TLt4 bỏ phần "gợi cách giải" khỏi đề — đúng.
- (b) Đáp số đúng 7/7. Lý do chỉ gồm: tính chất đường phân giác, tính chất tỉ lệ thức, tính chất dãy tỉ số bằng nhau (lớp 7), (gt). Không đồng dạng / Pythagore / lượng giác.
- (c) Khuôn câu TÍNH: Mấu chốt · 3–5 `**Bước k.**` · Chú ý · Phần 2 có lý do, kết "Vậy …". Phần 1 không lộ đáp số cuối (chỉ có tỉ số rút gọn trung gian 2/3, 3/5, 3/4, 2/3 — chấp nhận được).
- (d) Phần 2: dòng ngắn, không dòng trống giữa các bước, mệnh đề có (gt)/tên tính chất. Dòng trống chỉ ở card Phần 1 và trước `**Phần 2. Trình bày**` — đúng khuôn.
- (e) Hình: mở cả 7 ảnh. Dựng đúng tỉ lệ (đo pixel TLt1 BD:DC = 0,75; VNt1 BD = 9/15·BC; VNt2 AB:AC:BC = 21:28:14), hai cung tại A, không ghi đáp số (đoạn cần tìm ghi `x`/`y` hoặc để trống), không gạch ký hiệu bằng nhau trên đoạn con. Chỉ VNt2 phải sửa nhãn.

## Nghi vấn (không sửa, để CTO cân nhắc)
- TLt4: nhãn `150`/`200` nằm trong tam giác (gần đúng cạnh, không gây nhầm rõ ràng) — giữ.
- VNt2: nhãn `D` khá sát cung đứt nét `14` nhưng không chạm — giữ.
- VNt1: số liệu làm BC = AB = 15 (tam giác cân tại B, ngẫu nhiên) — không ảnh hưởng lời giải.
