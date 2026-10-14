# Brief trạm SOÁT — lý thuyết + ví dụ bản đồ mới khối 9 (14/10)

> Trạm soát chạy Opus (khác trạm soạn Sonnet). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k9` · `<NHOM>` = mã lượt (A1…A8) · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.

---

Bạn soát nội dung lý thuyết + ví dụ mà trạm soạn đã viết cho một số dạng bài của bản đồ kiến thức mới khối 9. Nội dung này sẽ hiện cho giáo viên và học sinh, in vào giáo trình.
KHÔNG ghi DB, KHÔNG sửa tệp nào trong Repo. Bạn sửa thẳng vào `<LV>\ra\<NHOM>.txt` và ghi biên bản `<LV>\ra\<NHOM>.soat.md`.

## 1. Đọc

1. Brief trạm soạn `Repo\kho-rules\dai\lo\k9\ban-do\brief-soan.md` (khuôn, luật, phạm vi kiến thức) và luật khối `Repo\kho-rules\dai\k9.md` §1–§3.
2. Với mỗi dạng của lượt: hồ sơ `<LV>\<mã dạng>.md` (mô tả của CEO = đích; lý thuyết đang có; bản đồ cũ) và tệp nhóm `<LV>\nhom-<mã nhóm>.md` nếu có.
3. Tệp soạn `<LV>\ra\<NHOM>.txt`. Trước khi sửa lần đầu, chép nguyên bản sang `<LV>\ra\<NHOM>.goc.txt`.

## 2. Soát từng dạng

- **Đúng dạng:** lý thuyết và hai ví dụ đúng loại bài mô tả của CEO nói (không lạc sang dạng anh em trong cùng nhóm); ví dụ 2 khó hơn ví dụ 1 nhưng vẫn đúng dạng; không chép lại ví dụ đã có trong lý thuyết dạng / nhóm.
- **Đúng toán — kiểm bằng máy, không đọc lướt:** viết script node / python (sympy nếu có) trong `<LV>\tam\soat-<NHOM>\`: thay đáp số vào đề, kiểm TỪNG dòng biến đổi của lời giải
  (hai vế bằng nhau với ≥ 3 giá trị của biến thoả điều kiện), quét lưới tìm nghiệm sót / sai miền, kiểm GTLN – GTNN bằng quét số, kiểm điều kiện xác định và bước đối chiếu.
  Lý thuyết: từng công thức, quy tắc, điều kiện phải đúng (vd $\sqrt{A^2}=|A|$, điều kiện có nghĩa, quy tắc đổi chiều bất phương trình, điều kiện hệ vô nghiệm / vô số nghiệm / nghiệm duy nhất).
- **Đúng phạm vi:** không Δ / công thức nghiệm / Viète ở phương trình – hệ – bất phương trình – căn thức (trừ khi chính mô tả của CEO đòi), không Cô-si thẳng trừ nhóm "ứng dụng Côsi".
- **Trình bày:** lời giải như học sinh viết vào vở — điều kiện, mỗi phép biến đổi một dòng, kết luận bằng lời; ##PP 3–6 bước trọn ý, không vụn, không ghi "Bước N"; ##CY là bẫy thật.
- **Khuôn:** chạy máy kiểm (từ Repo) tới lỗi 0:
  `node kho-rules/dai/lo/k9/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k9/ra/<NHOM>.txt" <danh sách mã dạng>`

Sửa thẳng những lỗi bạn **chắc chắn**. Chỗ không chắc (mô tả mơ hồ, hai cách hiểu) ⇒ để nguyên và ghi vào biên bản mục "Cần CEO xem". Mục `## GHI CHÚ CHO CEO` cuối tệp: giữ, bổ sung, xoá điểm bạn đã giải quyết.

## 3. Biên bản `<LV>\ra\<NHOM>.soat.md`

- Dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`.
- Số dạng · số ví dụ đã kiểm bằng máy · số chỗ đã sửa.
- Bảng chỗ đã sửa: `| Dạng | Phần (lý thuyết / ví dụ 1 / ví dụ 2) | Loại lỗi (toán / lạc dạng / phạm vi / trình bày / khuôn) | Sửa gì |`.
- Mục `## Cần CEO xem` (mỗi điểm: mã dạng + một câu).

## 4. Trả lời cuối (≤ 150 từ)

Kết luận · số chỗ sửa theo loại lỗi · các điểm cần CEO xem.
