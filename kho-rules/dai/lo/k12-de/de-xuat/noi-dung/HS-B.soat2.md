KẾT LUẬN: ĐẠT (sau 3 chỗ sửa ở phần bổ sung; toán đúng)

- Phạm vi: phần mới/đổi theo `diff HS-B.truoc-bs.txt HS-B.txt` — C1.2.2: 1 dòng lý thuyết TC (điểm cực trị A, B; Vi-ét; AB, trung điểm), VD2 b) đổi sang logarit (quyết định Thùy), VD3 mới (phân thức: x₁+x₂, AB, trung điểm); GHI CHÚ. Phần cũ (C1.2, C1.2.1, C1.2.3–C1.2.6) không đổi, rà nhanh vẫn hợp lệ.
- Tự giải lại bằng script độc lập `scratchpad\soat2\HS-B\k.cjs` (quét lưới giá trị hàm, không dùng y′): VD2b mới log₀,₅(−x²+2x+15): CT (1;−4), không CĐ · VD3 (x²−2x+5)/(x−1): CĐ (−1;−4), CT (3;4), AB = 8,944 = 4√5, I(1;0). Khớp lời giải. Không có hình mới.
- Đối chiếu đề thật `cau-dang.cjs HS C1.2.2 60`: đề có ≥7 câu hỏi AB/trung điểm/x₁+x₂ của phân thức (vd (−x²+x+5)/(x+2), (x²−3x)/(x+1), (x²−4x+5)/(x−1)) ⇒ VD3 đúng kiểu, số liệu không trùng đề. Đề có log₀,₅(−x²+4x) và log₃(x²−2x+3) ⇒ VD2b đúng kiểu, nhưng bản bổ sung CHÉP NGUYÊN hàm đề ⇒ đã đổi số.
- Đúng quyết định Thùy: C1.2.2 VD2b không còn trị tuyệt đối ✔ · không dùng f″ ✔ (grep: chỉ còn trong GHI CHÚ).
- Máy kiểm `kiem-moi.mjs HS … C1.2,C1.2.1–C1.2.6`: 1 nhóm · 6 dạng · 13 ví dụ · 6 hình · lỗi 0 · cảnh báo 0.

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.2.2 | VD2 b) | số liệu chép đề | $\log_{0,5}(-x^2+4x)$ (trùng nguyên câu đề) → $\log_{0,5}(-x^2+2x+15)$; giải lại: D=(−3;5), cực tiểu tại x=1, $y_{CT}=\log_{0,5}16=-4$. |
| C1.2.2 | VD2 b) đề | trình bày (LaTeX) | `log_{0{,}5}` thiếu `\` → `\log_{0{,}5}`. |
| — | GHI CHÚ CHO CEO | thông tin cũ | Câu "hàm khúc/trị tuyệt đối vào C1.2.2" (đã lỗi thời) → "hàm căn/mũ/logarit"; ghi chú VD2b cập nhật hàm mới. |

## Cần CEO xem
- C1.2.2: lý thuyết vẫn giữ ý "hàm có điểm không khả vi (trị tuyệt đối, chia khúc)" và bước PP tương ứng vì mô tả dạng trong `HS.json` ghi rõ, nhưng 0/53 câu đề có kiểu này và giờ không còn ví dụ minh hoạ. Theo nguyên tắc "đề không hỏi thì bỏ" nên xoá ý này và bỏ cụm "hàm có điểm không khả vi" khỏi mô tả dạng — CEO quyết.
