KẾT LUẬN: ĐẠT

# Biên bản soát GKI-18 (Phòng GD&ĐT huyện Đan Phượng — giữa học kì 1, 2024–2025, Cánh Diều)

- Trạm soát giải mù trước (`GKI-18.kiem.md`), sau đó mới mở bản soạn. Bản soạn gốc giữ ở `GKI-18.soan.goc.md`.
- Số câu: **18** (4 trắc nghiệm · 8 trả lời ngắn · 6 tự luận; 3 câu kho hgt: Câu 4, Câu 8, Bài 4).
- Khớp đáp án Pha 1 ngay từ đầu: **18 / 18** (không câu nào lệch đáp số).
- Số câu phải sửa: **5** (Câu 1, Câu 2, Câu 4, Câu 6, Bài 4) — không có lỗi đáp số, lỗi chép đề hay lỗi kiến thức.
- Chép đề: đã so từng số, số mũ trên bản cắt 400 dpi ($3^3.159-3^3.59$; $(4^2-2.3)^3$; $5^5:5^3$; $5^4$; $2^{99}$; phương án A Câu 1 đúng là "$17\in x$") — bản soạn chép đúng. Không sót câu, đề không có phần tiếng Anh.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | định dạng (ghi chú) | Xoá dòng `Chưa chắc`, gộp ý vào `Ghi chú` | Đã soi ảnh 400 dpi: đề in đúng "$17\in x$"; với đề in như vậy chỉ B đúng, và B vẫn là đáp án dù người ra đề định viết gì ⇒ đáp án chắc chắn. Việc có sửa chữ phương án A hay không để người duyệt quyết, ghi ở `Ghi chú`. |
| Câu 2 | lập luận (lời Phần 1) | `Chú ý`: bỏ từ "cận trên", viết lại bằng lời của đề ("nhỏ hơn hoặc bằng 49") | "Cận trên" không phải từ của học sinh lớp 6. |
| Câu 4 | lập luận (Phần 1) | Viết lại Bước 1–2: quan sát viền ngoài, đếm cạnh → loại biển không có đúng ba cạnh | Bản gốc: Bước 1 đã loại hết biển không có ba cạnh, Bước 2 lại "nhận dạng các hình còn lại: tròn hoặc vuông" — hai bước chồng nhau, mâu thuẫn. |
| Câu 4 | hình | Đổi `p1c4_lai.png` → `p1c4_lai2.png` (cắt lại từ PDF) | Bản cũ còn dính vệt chữ của dòng "Câu 4" ở mép trên; bản mới sạch, đủ 4 biển + nhãn Hình 1–4. |
| Câu 6 | lập luận (lời Phần 1) | `Chú ý`: viết lại thành "lỗi hay gặp: lấy cơ số nhân với số mũ" | Câu gốc ("số mũ là số lần nhân với cơ số") tối nghĩa, không tả đúng lỗi $5.4$. |
| Bài 4 | hình | Đổi `p4c4_1.png` → `p2b4_lai.png` (cắt lại từ PDF) | Hình máy cắt bị cụt chữ $G$ ở mép dưới. |
| Bài 4 | định dạng (ghi chú) + lập luận | `Chưa chắc` → `Ghi chú`; Phần 2 ý b thêm "Theo hình vẽ, …" | Đã đo trên ảnh trang: $E$, $G$ cùng hoành độ, $H$, $F$ cùng tung độ ⇒ $EG$ song song $BC$, $HF$ song song $AB$, đọc hình không mơ hồ; hai lượt giải độc lập cùng ra 225 $m^2$. Điều người duyệt cần biết (đề không ghi bằng chữ) để ở `Ghi chú`; lời giải phải nói rõ căn cứ là hình vẽ. |
| Ghi chú cho người duyệt | hình | Cập nhật tên tệp hình mới | Theo hai hình đã cắt lại. |

## Dòng `Chưa chắc` của trạm soạn đã xoá (đã kiểm chắc chắn)

- **Câu 1** — đề in "$17\in x$" (đã soi ảnh phóng to); đáp án B chắc chắn.
- **Bài 4** — $EG=BC$, $HF=AB$ đọc từ hình vẽ, đã đo trên ảnh; đáp số 225 $m^2$ khớp lượt giải mù.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

## Điều người duyệt nên biết (không phải lỗi)

- Câu 5, Câu 6 là câu Đúng/Sai dạng bảng đánh dấu (x) — nhập `tu_luan` theo brief soạn, lời dẫn đổi thành "Điền Đúng hoặc Sai: …".
- Câu 1: phương án A của đề gốc sai kí hiệu ("$17\in x$") — giữ nguyên như đề in.
- Đề thuộc bộ Cánh Diều; mọi kiến thức dùng trong lời giải đều nằm trong phạm vi giữa kì 1 (không chuyển vế, không luỹ thừa của luỹ thừa — Bài 5 viết $2^{100}=2^{50}.2^{50}$).
