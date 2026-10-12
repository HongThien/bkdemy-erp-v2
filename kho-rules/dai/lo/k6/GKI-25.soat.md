KẾT LUẬN: ĐẠT

# GKI-25 — biên bản soát (trạm soát, nhân chứng thứ hai)

Đề: THCS Vạn Phúc, quận Hà Đông — giữa học kì 1 Toán 6, 2024–2025 (2 trang scan, không có phần "Hệ T", không có hình vẽ).
Pha 1 giải mù: `GKI-25.kiem.md` (ghi xong trước khi mở bản soạn). Bản soạn nguyên gốc: `GKI-25.soan.goc.md`.
Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (2 phần · 19 câu: 8 TN · 9 TLN · 2 tự luận · HGT 3 · hình 0 · chưa chắc 0).

## Số liệu

- Số câu: **19** (Câu 1–8; Bài 1a–1d; Bài 2a–2d; Bài 3; Bài 4; Bài 5). Không sót, không thừa câu so với ảnh trang.
- Khớp đáp án Pha 1 ngay từ đầu: **19 / 19** (không câu nào lệch đáp số).
- Số câu phải sửa: **6** — đều là lỗi nhẹ (0 lỗi đáp số, 0 lỗi toán trong Phần 2, 0 lỗi phân loại, 0 lỗi hình).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | định dạng (ghi chú) + lập luận | Xoá dòng `**Ghi chú:**` "phương án viết chữ cái không dấu… vẫn chọn D vì ba phương án còn lại sai rõ ràng". Mấu chốt + Bước 1 thêm ý "dấu thanh không làm thành chữ cái mới (Ạ là chữ A, Ú là chữ U)". Phần 2: liệt kê chữ cái là H, A, N, H, P, H, U, C; bỏ cụm "(viết không dấu như phương án D)". | Đây không phải lỗi của đề gốc: chữ cái của "Ạ" là A, của "Ú" là U (đúng cách mẫu GKI-01 Bài 6 đã CEO duyệt). Ghi chú cũ làm người duyệt tưởng D chỉ là "đỡ sai nhất"; lời giải cũ liệt kê "Ạ", "Ú" như chữ cái rồi lại viết tập hợp không dấu — lệch nhau. |
| Câu 3 | lập luận | Bước 3: "tam giác cân chỉ có hai góc bằng nhau" → "chỉ cần có hai góc bằng nhau". | Câu cũ mâu thuẫn với chính dòng Chú ý bên dưới ("tam giác đều cũng là tam giác cân"). |
| Câu 8 | chép đề | Mũi tên trong 4 phương án `\Rightarrow` → `\to`. Chú ý: "đối nghịch" → "ngược". | Ảnh đề in mũi tên đơn →, không phải ⇒ (kí hiệu "suy ra"). |
| Bài 1b | lập luận (chữ dùng) | Bước 2: "một vế của dấu cộng" → "một bên của dấu cộng". | "Vế" là của đẳng thức, không phải của phép cộng. |
| Bài 2c | kiến thức | Bước 3 Phần 1: "Chia hai vế cho thừa số đã biết…" → "Tính tổng trong ngoặc; lúc này $3^x$ là thừa số chưa biết: lấy tích chia cho thừa số đã biết." | k6.md §1 luật 4: tìm $x$ bằng thành phần chưa biết, không nói "chia hai vế". Phần 2 vốn đã viết đúng khuôn ($3^x=270:10$) nên chỉ sửa lời Phần 1. |
| Bài 5 | định dạng (ghi chú) | Xoá dòng `**Ghi chú:**` "Đề gốc in tổng bằng dấu chấm '....'; đã viết thành dấu ba chấm". | Không phải lỗi đề, không phải điều người duyệt cần biết. |

Ngoài câu: mục `## GHI CHÚ CHO NGƯỜI DUYỆT` thêm 1 dòng về Câu 3 (phương án "tam giác cân", "tam giác vuông cân" là khái niệm lớp 7; đáp án C không phụ thuộc).

## Đã soát, không sửa

- **Đề** 19 câu đối chiếu ảnh trang + bản cắt phóng to 300 dpi (số mũ Câu 5, Câu 7, Bài 1b, 1d, 2c, Bài 5 = $3^{2024}$): khớp.
  Bài 2d đề in $96-3(x+1)=42$, bản soạn viết $96-3.(x+1)=42$ — thêm dấu chấm nhân theo k6.md §3, nghĩa không đổi, giữ.
- **Đáp số** tính lại bằng máy: 1400 · 42 · 3200 · 8 · 68 · 121 · 3 · 17 · ƯCLN(36,48,24)=12 (3; 4; 2) · 128 m², 200 viên, 29 thùng · $A \bmod 13=12$ (cộng thật 2024 luỹ thừa bằng BigInt).
- **Phân loại**: Câu 3, Câu 6, Bài 4 `kho=hgt` (đúng); Bài 3, Bài 4 `tu_luan` (nhiều đáp số, bài lời văn giữ chung a) b) c)); Bài 1, Bài 2 tách ý; Bài 5 `tra_loi_ngan` 12 (một số ≤ 4 ô).
- **Khuôn Phần 2**: Bài 1 (NNB00893 / 00897 / 00900 — mỗi dòng phá một tầng ngoặc), Bài 2 (NNB00894 / 00895 / 00899 / 00901 — thành phần chưa biết, không chuyển vế), Bài 3 (NNB00921), Bài 5 (NNB00913 — đếm 2024 số hạng, để riêng $3+3^2$, 674 nhóm ba) đúng khuôn; dấu nhân đều là dấu chấm.
- **Hình**: đề không có hình, thư mục `img` không tồn tại, bản soạn không có dòng `**Hình:**` — đúng.

## Câu còn `Chưa chắc` (gửi CEO)

Không có. (Bản soạn gốc cũng không có dòng `Chưa chắc` nào.)
