# Brief giao trạm SOÁT — ĐỀ CƯƠNG Toán 6 Ngôi Sao Hoàng Mai (11/10)

> `<P>` = số phần (1–10). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K6\NSHM-GKI-2026`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Dựa trên `kho-rules/dai/lo/k6-brief-soat.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT PHẦN của đề cương ôn tập giữa kì I Toán 6 đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi phần của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k6.md` (luật khối 6).
2. Mở HẾT ảnh trang `<LV>\trang\p-1.png`, `p-2.png`, `p-3.png` bằng công cụ Read. **Chưa mở** tệp `NSHM-GKI-2026.p<P>.soan.md`.
3. Tự giải các câu của phần bạn. Danh sách nhãn câu của phần: lấy từ tiêu đề `### …` của tệp soạn bằng lệnh
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k6/de-cuong/NSHM-GKI-2026.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('### ')).map(l=>l.split(' | ')[0]).join('\n'))"`
   — chỉ lệnh này, KHÔNG đọc nội dung bản soạn. Số lớn / tổng dãy tính bằng `node -e` (vét cạn bằng máy nếu được), không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k6\de-cuong\NSHM-GKI-2026.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu chuẩn `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` và brief trạm soạn `Repo\kho-rules\dai\lo\k6\de-cuong\brief-soan.md` (luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k6\de-cuong\NSHM-GKI-2026.p<P>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, gạch ngang, đủ ý). Dấu `:` chia hết (`\vdots`) ở bài tập hợp / chia hết; dấu `:` chia ở bài Tính / Tìm $x$.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức lớp 6 (k6.md §1: không chuyển vế, không hằng đẳng thức, không đồng dư, tổng $\dfrac{n(n+1)}{2}$ phải tự suy ra) ·
     Phần 2 đúng khuôn nhóm bài `k6.md` §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối, không chép lại Phần 2).
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`). Không tách / gộp / đổi nhãn câu.
   - **Ghi chú / Chưa chắc**: các dòng có sẵn do người gõ đề — giữ. Dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề cương in sai
     (số / số mũ / kết luận trong đề không đúng) mà trạm soạn bỏ sót ⇒ thêm `**Chưa chắc:**` nói rõ đề sai ở đâu và đúng phải là gì (chứng minh bằng máy khi có thể).
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `NSHM-GKI-2026.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `…p<P>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ thêm / giữ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/de-cuong/NSHM-GKI-2026.p<P>.soan.md --lam-viec "<LV>" --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k6\de-cuong\NSHM-GKI-2026.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.

## Bẫy đọc ảnh đã cắn thật

- Dấu chia hết ⋮ (ba chấm dọc) ở ảnh dễ lẫn dấu chia `:` — phân biệt theo ngữ cảnh. Số mũ nhỏ / dấu trừ: không chắc ⇒ nói ra, đừng đoán.
