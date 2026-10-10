# Brief giao trạm SOÁT — khối 7, bộ đề GKI (10/10)

> `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K7\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Dựng từ `k6-brief-soat.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa kì Toán 7 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k7.md` (luật khối 7) và, nếu đề có hình: `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md`.
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. (Đề là ảnh scan, không có lớp chữ.)
3. Tự chép đề rồi giải mọi câu. Số lớn tính bằng `node -e`, không nhẩm. Gặp số mũ / dấu trừ / chu kì / hỗn số / `|…|` chưa rõ ⇒ cắt phóng to 400 dpi từ
   `<LV>\goc.pdf` (`pdftoppm -r 400 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <w> -H <h> goc.pdf <ra>`) trước khi giải.
4. Ghi `Repo\kho-rules\dai\lo\k7\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu khuôn tệp `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\k7-brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k7\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu âm, ngoặc, gạch ngang, phương án, đủ ý, không sót câu). Chữ khung họ tên / điểm phải bị bỏ.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức lớp 7 tại thời điểm kiểm tra giữa kì (`k7.md` §1: không hằng đẳng thức, Pytago, đồng dạng…; chuyển vế được dùng) ·
     Phần 2 đúng khuôn nhóm bài `k7.md` §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối,
     không chép lại Phần 2) · câu Hình: mỗi khẳng định có lý do trong ngoặc, tia nằm giữa được nêu trước khi cộng góc, đề tự đủ dữ kiện.
   - **Phân loại**: `kho` (hgt = hình: góc, song song, tam giác, hình khối) · `loai` (trả lời ngắn chỉ khi đáp số là một số ≤ 4 ô theo ĐÚNG đơn vị đề hỏi, không phải
     phân số; Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`) · tách ý đúng luật (chỉ bài Tính và Tìm $x$; ngoại lệ "Bài" gom 2 bài toán khác hẳn nhau ⇒ `Bài 5.1`, `Bài 5.2`;
     bản soạn chưa tách thì bạn tách; các ý a) b) của cùng một bài toán vẫn giữ chung).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` — đúng hình của câu, không cụt, không dính chữ câu khác. Câu cần hình mà thiếu ⇒ cắt lại
     theo lệnh `pdftoppm` trong brief soạn. Số đo / kích thước ghi trên hình phải có trong phần Đề.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …` trong câu đó (đặt sau đề, trước
   `**Phần 1. Hướng dẫn**`) — CEO xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k7/<MA>.soan.md --lam-viec "<LV>" --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k7\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
