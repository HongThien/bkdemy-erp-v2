# Brief giao trạm SOÁT — khối 8, bộ đề giữa kì 1 (40 đề, 10/10)

> Khuôn chép từ `k6-brief-soat.md`. `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K8\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa học kì 1 Toán 8 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k8.md` (§1 luật kiến thức, §1.5–§1.6, §3, §10).
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. Đề scan chữ nhỏ ⇒ cắt phóng to 300 dpi từ `<LV>\goc.pdf`
   (`pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/tam/<tên>"`) trước khi giải.
3. Tự giải mọi câu của đề. Đa thức / hằng đẳng thức / tìm $x$ tính bằng script node (thay số kiểm hai vế), không nhẩm.
   Đề có IN SẴN bảng đáp án / hướng dẫn chấm ⇒ vẫn tự giải mù trước, SAU ĐÓ mới đọc bảng in và ghi thêm cột "đáp án in trong đề"; Pha 2 đối chiếu cả ba nguồn.
4. Ghi `Repo\kho-rules\dai\lo\k8\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc đề mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\k8-brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k8\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu, ngoặc, tên điểm, phương án, đủ ý, không sót câu); câu nào bị bỏ thì có lí do chưa.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (chỉ dùng cái học tới giữa kì 1 theo bộ sách của chính đề; KHÔNG đường trung bình, Thalès,
     đồng dạng, lượng giác; Pythagore / hằng đẳng thức / phân tích nhân tử / hình chữ nhật trở lên chỉ khi đề có chạm tới — kể cả dùng **ngầm** không gọi tên;
     "tứ giác có ba góc vuông" không phải dấu hiệu; **đặt thừa số chung theo tính chất phân phối $ab+ac=a(b+c)$ là kiến thức lớp 6–7, KHÔNG phải vi phạm** —
     đừng sửa những chỗ đó; cái cấm là các phương pháp phân tích nhân tử của Chương II: dùng hằng đẳng thức, nhóm, tách hạng tử) · Phần 2 đúng khuôn vở lớp 8, mỗi khẳng định hình có lí do · dấu nhân `\cdot` · Phần 1 có 3–6 bước là
     **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối, không chép lại Phần 2); bài hình chứng minh thì Phần 1 đi theo chiều phân tích đi lên
     ("muốn có …, cần …") và Phần 2 đi ngược lại, khớp từng mắt xích.
   - **Phân loại**: `kho` (`hinh_hoc` = hình; `dai` = còn lại) · `loai` (trả lời ngắn chỉ khi đáp số là một số nguyên / thập phân ≤ 4 ô theo ĐÚNG dạng đề hỏi;
     biểu thức, phân số, nhiều giá trị ⇒ `tu_luan`) · tách ý đúng luật (chỉ bài Tính / Rút gọn / Phân tích nhân tử / Tìm $x$ có các ý độc lập; bài hình và bài
     chung dữ kiện KHÔNG tách).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` (đúng hình của câu, không cụt) và dòng `**Hình giải:**` (hình vẽ bằng code: đúng dữ kiện đề,
     đủ điểm, tên điểm đúng chỗ, không đánh dấu điều phải chứng minh, nhãn không đè / không cụt). Hình giải sai ⇒ sửa `<LV>\tam\ve.mjs` rồi vẽ lại
     (`node "<LV>/tam/ve.mjs"` từ thư mục Repo). Bài hình tự luận đề không cho hình mà bản soạn chưa có `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ trong brief soạn mục 3.8).
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn
   **chắc chắn**. Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …`
   trong câu đó (đặt sau đề, trước `**Phần 1. Hướng dẫn**`) — CEO sẽ xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/<MA>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k8\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 120 từ): kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
