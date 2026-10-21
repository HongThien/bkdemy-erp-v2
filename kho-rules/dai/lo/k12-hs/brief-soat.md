# Brief trạm SOÁT — lý thuyết + ví dụ bản đồ đề xuất K12 Hàm số (21/10)

> Trạm soát chạy Opus (khác trạm soạn Sonnet). `<DIR>` = `kho-rules/dai/lo/k12-hs` · `<JOB>` = mã lượt (J1…J10) · Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`. Chạy lệnh từ thư mục Repo.

Bạn soát nội dung lý thuyết + ví dụ mà trạm soạn đã viết cho một số nhóm/dạng của bản đồ kiến thức mới K12 (Hàm số). Nội dung sẽ hiện cho giáo viên và học sinh, in vào giáo trình.
KHÔNG ghi DB. Bạn sửa thẳng vào `<DIR>\ra\<JOB>.txt` và ghi biên bản `<DIR>\ra\<JOB>.soat.md`. Trước khi sửa lần đầu, chép nguyên bản sang `<DIR>\ra\<JOB>.goc.txt`.

## 1. Đọc

1. Brief trạm soạn `<DIR>\brief-soan.md` (khuôn, luật định dạng, cú pháp hình, phạm vi) và mẫu `<DIR>\mau.txt`.
2. Danh sách nhóm/dạng + mô tả nhận biết (ĐÍCH) của lượt: `<DIR>\cau-truc.mjs`. Hồ sơ nguồn `<DIR>\ho-so\*` khi cần đối chiếu.
3. Tệp soạn `<DIR>\ra\<JOB>.txt`.

## 2. Soát từng khối

- **Đúng dạng:** lý thuyết và hai ví dụ đúng loại bài mô tả nói (không lạc sang dạng anh em); ví dụ 2 khó hơn ví dụ 1; lý thuyết dạng không chép lại lý thuyết nhóm; hai ví dụ khác hẳn nhau.
- **Đúng toán — kiểm bằng máy, không đọc lướt:** viết script node trong `<DIR>\tam\soat-<JOB>\` kiểm TỪNG ví dụ độc lập với script của trạm soạn: tính y′ (công thức rút ra + sai phân), nghiệm, bảng xét dấu bằng quét lưới, cực trị/GTLN/GTNN bằng quét số mịn, giới hạn/tiệm cận bằng số, điều kiện tham số bằng quét m, đối chiếu đáp số cuối với đề. Lý thuyết: từng công thức, điều kiện, quy tắc phải đúng (vd điều kiện a≠0, dấu bằng khi đơn điệu, nghiệm bội chẵn không đổi dấu, Δ′, ad−bc, tiệm cận xiên…).
- **Hình đúng và khớp:** mở từng `[[HINH …]]` (máy kiểm đã vẽ thử được), kiểm hàm/bảng trong hình KHỚP đề và lời giải: các giá trị lời giải "đọc từ hình" (cực trị, giao điểm, tiệm cận, khoảng đơn điệu) phải đúng với công thức vẽ hình (quét số); bảng biến thiên: dấu, chiều mũi tên, giá trị khớp hàm; hình không lộ đáp án thừa. Dựng thử và nhìn hình nếu cần (`node -e` dùng `ve.mjs` ghi ra tệp .svg/.html rồi mở bằng trình duyệt).
- **Đúng phạm vi:** không kiến thức ngoài chương; Cô-si chỉ khi dạng cho phép.
- **Trình bày:** lời giải như học sinh viết vào vở — điều kiện/tập xác định, mỗi phép biến đổi một dòng, kết luận bằng lời; ##PP 3–6 bước trọn ý, không "Bước N"; ##CY là bẫy thật; số liệu đẹp; ví dụ không trùng đề đã có sẵn trong sách một cách máy móc (giải lại thì được).
- **Khuôn:** chạy máy kiểm tới lỗi 0, cảnh báo ⚠ giải quyết hết hoặc giải thích:
  `node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/<JOB>.txt <danh sách mã>` (nhóm viết `H1.1`, dạng `H1.1.1`).

Sửa thẳng những lỗi bạn **chắc chắn**. Chỗ không chắc (mô tả mơ hồ, hai cách hiểu) ⇒ để nguyên và ghi vào biên bản mục "Cần CEO xem". Mục `## GHI CHÚ CHO CEO` cuối tệp: giữ, bổ sung, xoá điểm bạn đã giải quyết.

## 3. Biên bản `<DIR>\ra\<JOB>.soat.md`

- Dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`.
- Số nhóm · số dạng · số ví dụ đã kiểm bằng máy · số hình đã kiểm · số chỗ đã sửa.
- Bảng chỗ đã sửa: `| Mã | Phần (lý thuyết nhóm / lý thuyết dạng / ví dụ 1 / ví dụ 2 / hình) | Loại lỗi (toán / lạc dạng / phạm vi / trình bày / khuôn / hình) | Sửa gì |`.
- Mục `## Cần CEO xem` (mỗi điểm: mã + một câu).

## 4. Trả lời cuối (≤ 150 từ)

Kết luận · số chỗ sửa theo loại lỗi · các điểm cần CEO xem.
