KẾT LUẬN: ĐẠT

# Biên bản soát CKI-20 — Kiểm tra cuối kì I 2025–2026, Toán 7, THCS Tây Sơn (phường Hoà Cường), KNTT

- Trạm soát: Opus, giải mù trước (`CKI-20.kiem.md`), rồi mới mở bản soạn. Bản soạn gốc chép ở `CKI-20.soan.goc.md`.
- Số câu: **16** (4 trắc nghiệm · 3 trả lời ngắn · 9 tự luận; 6 câu có hình). Kho: `dai` 12 · `hinh_hoc` 4 (Câu 3, 5, 8, Bài 4); không câu nào `hgt`.
- Đáp án khớp Pha 1 ngay từ đầu: **16/16** (Câu 1 C · 2 B · 3 C · 4 A · 5 S-S-Đ-Đ · 6 = 30 · 7 · 8 = 12 · 9 số liệu · 1a $\frac12$ · 1b 6,7 · 2: $3025\ cm^2$, $1287000$ đồng · 3.1 $\frac{3}{-8}$, $\frac{-27}{72}$ · 3.2 bảng 40/20/15/25 · 4 · 5 $x=-\frac14$, $y=-\frac13$).
- Số câu phải sửa: **7** (trong đó 4 câu có lỗi thật: chép đề 2 · lập luận 1 · hình 2 ảnh; còn lại là gỡ `Chưa chắc` / `Ghi chú` thừa).
- Phạm vi kiến thức: mọi câu nằm trong KNTT cuối kì 1 (Ch I–V). Không có tỉ lệ thức, quan hệ cạnh–góc, Pytago, đồng dạng. Bài 4c dùng đường trung trực (KNTT Bài 16, Ch IV) — trong phạm vi.
- Cổng: `dung-de-tu-soan.mjs … --khoi 7 --chi-kiem` ⇒ **✔ đạt cổng** (16 câu, hình 6, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 5 | hình | Cắt lại `p1c5.png` (rộng/cao hơn) | Ảnh cũ cụt nhãn $B$ ở góc dưới trái |
| Bài 4 | hình | Cắt lại `p2b4.png` | Ảnh cũ cụt nhãn $B$, $C$ |
| Câu 8 | chép đề | Bỏ "(đơn vị $cm$)" bản soạn tự thêm vào câu hỏi | Đề gốc chỉ ghi "Chu vi của $\triangle DEF$ bằng bao nhiêu?"; đơn vị đã rõ từ dữ kiện |
| Bài 3.2 | chép đề | Đề viết lại sát gốc: "Hãy lập bảng thống kê biểu diễn các số liệu trong biểu đồ "Tỉ lệ các môn thể thao yêu thích của học sinh lớp 7" ở hình bên." | Bản soạn tự dựng câu dẫn "Biểu đồ dưới đây cho biết…" không có trong đề |
| Bài 4 | lập luận | b) thêm dòng tổng ba góc của $\triangle AMN$ trước khi tính $\widehat{AMN}$; c) kết luận tách thành: $A$ thuộc trung trực (lý do) · $H$ thuộc trung trực (lý do) · $A\ne H$ ⇒ $AH$ là trung trực | Mỗi khẳng định hình phải có lý do trong ngoặc; bản soạn kết luận không nêu tính chất dùng |
| Bài 4 | (gỡ Chưa chắc) | Xoá `Chưa chắc` về phạm vi tam giác cân / trung trực | Đã kiểm: thuộc KNTT 7 Bài 16 (Ch IV), trong phạm vi cuối kì 1 CEO giao; có ở whitelist HH00104 |
| Câu 4 | (gỡ Chưa chắc) | Xoá `Chưa chắc` "biểu đồ không ghi %" | Đã phóng 400 dpi: hai bán kính biên của hình quạt M thẳng hàng qua tâm ⇒ đúng nửa hình tròn; ba phương án còn lại (10/15/25%) xa hẳn — chỉ A hợp |
| Câu 9 | (gỡ Chưa chắc) + định dạng | Xoá `Chưa chắc`; câu kết thêm "còn gọi là dữ liệu định lượng" | KNTT gọi là "dữ liệu là số (số liệu)"; tên "định lượng" là cùng khái niệm — đáp án không phụ thuộc cách gọi |
| Bài 3.1 | (gỡ Chưa chắc / Ghi chú) | Xoá `Chưa chắc` "hai phân số cùng đúng" và `Ghi chú` về việc tách Bài 3 | Câu hỏi "phân số nào" cho phép nhiều đáp án, không phải lỗi in; ghi chú tách ý là việc của dây chuyền (đã có ở GHI CHÚ CHO NGƯỜI DUYỆT), không phải lỗi đề gốc |

Đã kiểm, giữ nguyên: tách Bài 3 thành 3.1 / 3.2 (hai bài toán khác hẳn nhau: phân số / biểu đồ — đúng ngoại lệ k7.md §1.5) · Bài 1a `tu_luan` (đáp số phân số) · Bài 1b `tra_loi_ngan` 6,7 · Bài 2 giữ chung, `dai` · Câu 7 `tu_luan` · Câu 5 Đúng/Sai ⇒ `tu_luan`, số đo trên hình đã chép vào đề · Bài 5 hiểu $2x:3y=2x:(3y)$ (cách hiểu duy nhất cho nghiệm khác 0, lời giải có thử lại) · dấu nhân dấu chấm toàn tệp, không `\cdot`/`\times` · Phần 1 mọi câu 3–4 bước nghĩ thật.

## Câu còn `Chưa chắc`

Không.

## ẢNH CHO CEO

Không.
