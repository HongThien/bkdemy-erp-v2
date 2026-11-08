# Brief giao trạm SOÁT — năm đề cương Toán 6 GKI Hà Nội 2026–2027 (20/10)

> `<MA>`, `<P>`, `<LV>`, Repo như `brief-soan-dc.md`. Trạm soát chạy Opus (người làm ≠ người kiểm). Brief này = `brief-soat.md` (NSHM K6; đọc TRƯỚC — hai pha, biên bản) + các chỗ riêng dưới đây.

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT TRẠM của đề cương, đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án ⇒ đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. KHÔNG ghi DB, KHÔNG commit, KHÔNG xoá, KHÔNG sửa tệp ngoài phạm vi trạm của bạn (và hình giải của trạm).

## Thay đường dẫn

- Tệp trạm: `Repo\kho-rules\dai\lo\k6\de-cuong\<MA>.p<P>.soan.md`; kiểm mù `…p<P>.kiem.md`; bản gốc `…p<P>.soan.goc.md`; biên bản `…p<P>.soat.md`.
- Nguồn đề: ảnh `<LV>\anh\t-1.png … t-N.png` (mở HẾT bằng Read) + hình đề `<LV>\img\de_*.png`. Lớp chữ PDF hỏng công thức — đừng tin. Phóng to bằng `pdftoppm -r 260 … "<LV>\goc.pdf" "<LV>\z\…"`.
- Luật: `Repo\kho-rules\dai\k6.md`, mẫu `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md`, luật soạn `brief-soan-dc.md` (đọc kĩ mục 3: trắc nghiệm "Chọn X.", Đúng/Sai, hình giải, TLN ≤ 4 kí tự…).
- Cổng (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 6 --chi-kiem`.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `k6.md`; mở HẾT ảnh trang. **Chưa mở** `<MA>.p<P>.soan.md`.
2. Lấy danh sách nhãn câu bằng: `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k6/de-cuong/<MA>.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('### ')).map(l=>l.split(' | ')[0]).join('\n'))"` (chỉ lệnh này).
3. Tự giải các câu đó từ ẢNH. Số lớn / vét cạn / tổng dãy / đếm bằng `node -e`, đừng nhẩm. TN: tự tìm chữ cái đúng. Đúng/Sai: đúng-sai từng mệnh đề. Hình: dựng toạ độ số khi cần.
4. Ghi `…p<P>.kiem.md`: `| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Mở `<MA>.p<P>.soan.md`, soát TỪNG câu: đề chép đúng ảnh · đáp án khớp Pha 1 (lệch ⇒ tính lại bằng máy để biết ai sai) · lời giải đúng toán từng dòng · **đúng kiến thức khối 6** (không chuyển vế, không hằng đẳng thức, không đồng dư, không dùng ngầm kết quả chưa học) · Phần 2 đúng khuôn k6.md §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước nghĩ thật, KHÔNG lộ đáp số cuối, không chép lại Phần 2.
   - **Phân loại**: `trac_nghiem` có đủ A–D + `dap_an` một chữ cái + Phần 2 kết `Chọn X.`; `tra_loi_ngan` chỉ khi đáp số là một số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`).
   - **Hình**: hình giải (nếu có) dựng đúng dữ kiện, đủ điểm, không đánh dấu điều phải chứng minh — mở bằng Read; hình đề khớp `Đọc hình`.
   - **Đề in lỗi / thiếu dữ kiện**: soạn bỏ sót mà bạn chắc ⇒ thêm `**Chưa chắc:**` (chứng minh bằng máy khi có thể). `Chưa chắc` của soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản. Các dòng `Ghi chú` / `Chưa chắc` do người gõ đề ⇒ GIỮ.
6. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `…p<P>.soan.goc.md`, rồi sửa THẲNG `…p<P>.soan.md` những lỗi bạn **chắc chắn**; chỗ không chắc ⇒ giữ / thêm `**Chưa chắc:**` (sau đề, trước `**Phần 1. Hướng dẫn**`).
7. Chạy cổng tới "✔ đạt cổng".
8. Biên bản `…p<P>.soat.md`: dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>` · số câu / khớp Pha 1 ngay từ đầu / phải sửa · bảng sửa `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |` · danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.

## Bẫy

- Dấu chia hết ⋮ khác dấu chia `:`; số mũ nhỏ, dấu trừ: không chắc ⇒ nói ra, đừng đoán.
- TN: đáp án đúng nhưng Phần 2 loại phương án bằng cách "thử đáp án" thay vì lí do ⇒ sửa.
- Bài Đúng/Sai: đủ cả 4 mệnh đề a–d, mỗi cái có lí do.
