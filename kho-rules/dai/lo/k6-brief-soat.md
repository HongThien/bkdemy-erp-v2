# Brief giao trạm SOÁT — khối 6, bộ đề GKI + CKI (bước 2, 10/10)

> `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K6\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra Toán 6 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k6.md` (luật khối 6).
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`.
3. Tự giải mọi câu của đề (bỏ phần riêng tiếng Anh "Hệ T"). Số lớn tính bằng `node -e`, không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k6\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu chuẩn `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\k6-brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k6\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, gạch ngang, phương án, đủ ý, không sót câu). Phần tiếng Anh phải bị bỏ; câu nào khác bị bỏ thì có lí do chưa.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức lớp 6 tại thời điểm kiểm tra (không chuyển vế, không kiến thức học sau) · Phần 2 đúng khuôn
     nhóm bài `k6.md` §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối, không chép lại Phần 2).
   - **Phân loại**: `kho` (hgt = hình) · `loai` (trả lời ngắn chỉ khi đáp số là một số ≤ 4 ô theo ĐÚNG đơn vị đề hỏi; đáp số phải tự đổi đơn vị mới vừa 4 ô, vd "180 nghìn đồng", thì đổi sang `tu_luan`) · tách ý đúng luật (chỉ bài Tính và Tìm $x$;
     ngoại lệ: "Bài" gom 2 bài toán khác hẳn nhau đánh số 1) 2), mỗi bài toán một bộ dữ kiện ⇒ mỗi bài toán một câu `Bài 5.1`, `Bài 5.2`, `kho` theo
     từng bài toán — bản soạn chưa tách thì bạn tách; các ý a) b) của cùng một bài toán vẫn giữ chung).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` — đúng hình của câu, không cụt. Câu cần hình mà thiếu ⇒ cắt lại theo lệnh `pdftoppm` trong brief soạn.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn
   **chắc chắn**. Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …`
   trong câu đó (đặt sau đề, trước `**Phần 1. Hướng dẫn**`) — CEO sẽ xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/<MA>.soan.md --lam-viec "<LV>" --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k6\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.

## Bẫy đọc ảnh đã cắn thật

- Kí hiệu **"không chia hết"** (ba chấm dọc có gạch chéo) ở ảnh 150 dpi dễ đọc nhầm thành "chia hết" (GKI-21: cả đề lẫn đáp án Đúng/Sai lật ngược).
  Ở Pha 1, gặp kí hiệu chia hết / số mũ / dấu âm mà chưa rõ ⇒ cắt phóng to 400 dpi từ `goc.pdf` trước khi giải.
