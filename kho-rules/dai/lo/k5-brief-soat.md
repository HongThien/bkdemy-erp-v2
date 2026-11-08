# Brief giao trạm SOÁT — khối 5, sách "Đề kiểm tra Toán 5" (Qbooks) — 40 đề (Thùy 28/10)

> Chép khuôn K6 (`k6-brief-soat.md`). `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K5-sach-de\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet).

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra Toán 5 đã được trạm khác soạn lời giải. Sách KHÔNG có đáp án, nên đáp số chỉ
đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k5T.md` §0, §1, §1.5, §3 (luật tiểu học).
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png`. **Chưa mở** `<MA>.soan.md`. Chỗ mờ ⇒ cắt phóng to 300 dpi từ `<LV>\goc.pdf`
   (`pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x -y -W -H …`, toạ độ ×2 so với ảnh 150 dpi).
3. Tự giải mọi câu. Tính bằng `node -e`, không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k5\<MA>.kiem.md`: bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k5-brief-soan.md` và đề mẫu `Repo\kho-rules\dai\lo\k5\HK1-GK01.soan.md`.
6. Mở `Repo\kho-rules\dai\lo\k5\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh (số, phân số, hỗn số, dấu phẩy, đơn vị, phương án, đủ ý, không sót câu, không sót bài).
   - **Đáp án** khớp Pha 1. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức Toán 5 KNTT (không gọi ẩn, không chuyển vế, không kiến thức lớp 6) · Phần 2 đúng khuôn vở
     (k5T.md §1.5) · Phần 1 3–6 bước là bước nghĩ thật (không vụn, không lộ đáp số cuối, không chép lại Phần 2).
   - **Tách ý** đúng luật (chỉ bài Đặt tính / Tính / Tính thuận tiện / Tìm $y$); `loai`; hình (mở tệp ở dòng `**Hình:**`: đúng hình, không cụt, không dính
     chữ câu khác, không phải hình trang trí; câu cần hình / bảng mà thiếu ⇒ cắt bổ sung theo lệnh trong brief soạn).
   - `**Ghi chú:**` chỉ cho lỗi ĐỀ GỐC / điều người duyệt cần biết; ghi chú về "máy gõ nhầm" thì xoá.
7. **Sửa**: trước lần sửa đầu, chép nguyên bản sang `<MA>.soan.goc.md`. Sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ thêm / giữ
   `**Chưa chắc:** …` trong câu đó. `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng":
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k5/<MA>.soan.md --lam-viec "<LV>" --khoi 5 --chi-kiem`
9. Biên bản `Repo\kho-rules\dai\lo\k5\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do).

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
