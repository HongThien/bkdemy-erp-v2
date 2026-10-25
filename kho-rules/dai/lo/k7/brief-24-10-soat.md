# Brief giao trạm SOÁT — đề Toán 7 mới (24/10): GKI-38 · GKI-39 · GKI-40 · DC-09a/b/c/d

> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K7\<MÃ gốc>` (DC-09a/b/c/d dùng chung `…\K7\DC-09`).
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Brief trạm soạn: `Repo\kho-rules\dai\lo\k7\brief-24-10-soan.md` (luật họ phải theo).

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề / MỘT phần đề cương Toán 7 đã được trạm khác soạn. Đề KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập
ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi của bạn.

## Việc được giao (điền khi giao)

Mã: **{MÃ}** · tệp soạn: `Repo\kho-rules\dai\lo\k7\{MÃ}.soan.md` · phạm vi trang: {PHẠM VI TRANG}

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k7.md` (§1 luật kiến thức, §1.5, §2, §3) và `brief-24-10-soan.md` mục 2 (luật CEO đợt này: chỉ giải Toán — bỏ Hình / kì 2; đề sai ⇒ giải bình thường + Ghi chú).
2. Mở HẾT ảnh trang trong phạm vi (`<LV>\trang\p-*.png`) bằng công cụ Read; chỗ nhỏ phóng to bằng `pdftoppm -r 300 -f <trang> -l <trang> -x <x> -y <y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"`.
   **Chưa mở** tệp `{MÃ}.soan.md`.
3. Lấy danh sách nhãn câu chỉ bằng lệnh (KHÔNG đọc nội dung bản soạn):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k7/{MÃ}.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('### ')).map(l=>l.split(' | ')[0]).join('\n'))"`
   (chạy từ thư mục Repo). Tự giải các câu đó; phân số / số lớn / vét cạn dùng script node + BigInt (tạo bằng công cụ Write trong `<LV>\tam\`, KHÔNG heredoc), không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k7\{MÃ}.kiem.md`: bảng `| Nhãn | Đáp án / đáp số (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.
   Đồng thời ghi lại câu Đại trên ảnh mà bản soạn **thiếu** (không có nhãn) — không tính câu Hình / kì 2 (được phép bỏ).

## Pha 2 — soát bản soạn

5. Đọc mẫu `Repo\kho-rules\dai\lo\k7\GKI-32.soan.md` (hoặc `DC-03.soan.md`).
6. Mở `{MÃ}.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, dấu trừ, dấu `.` nhân vs `,` thập phân, hỗn số, đủ ý, đủ phương án).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (k7.md §1: không kiến thức lớp 8+; phân biệt STP tuần hoàn → phân số đúng cách nhân 10/100 rồi trừ) · Phần 2 đúng khuôn vở lớp 7
     (§2) · **dấu nhân là dấu chấm** (không `\cdot`, `\times`) · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối, không chép lại Phần 2).
     Bài nâng cao: mỗi bước kẹp / chia hết / số dư phải đúng với MỌI giá trị biến được nêu (kiểm đủ khoảng, kể cả biên và số âm).
   - **Phân loại**: `tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự theo đúng dạng đề hỏi; còn lại `tu_luan` (`dap_an=—`); TN `trac_nghiem` có `Chọn X.`; Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`. Nhãn duy nhất, đúng quy ước.
   - **Phạm vi**: câu Hình / kì 2 không được lọt vào tệp (nếu lọt ⇒ gỡ và ghi biên bản); câu Đại có hình (trục số) có `**Hình:**` và tệp tồn tại trong `<LV>\img\` — mở ảnh bằng Read xem đúng chưa.
   - **Đề sai**: không treo `Chưa chắc` vì lí do đề sai — giải theo số liệu + `**Ghi chú:** đề sai — …`. Chỉ giữ `Chưa chắc` khi thực sự không làm được. Ghi chú của trạm soạn mà bạn kiểm chắc thì giữ / chỉnh gọn.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `{MÃ}.soan.goc.md` (đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `{MÃ}.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ `**Chưa chắc:** …`.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k7/{MÃ}.soan.md --lam-viec "<LV>" --khoi 7 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k7\{MÃ}.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / phạm vi) | Sửa gì | Vì sao |`;
   - câu Đại bị bỏ sót (nếu có) và danh sách câu còn `Chưa chắc` hoặc `Ghi chú: đề sai` (nhãn + lí do) — danh sách gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.

## Bẫy đã cắn thật

- Số mũ nhỏ / dấu trừ / dấu `|` / hỗn số ở ảnh scan: không chắc ⇒ phóng to, nói ra, đừng đoán.
- Bài "nhiều nhất / ít nhất" số tự nhiên, bài phần trăm giảm giá nhiều tầng (giảm tiếp trên giá đã giảm hay trên giá gốc): đọc đề kĩ, tính lại bằng máy.
- Chứng minh bất đẳng thức dãy (kẹp, làm trội): kiểm số hạng đầu / cuối và dấu bất đẳng thức bằng tính tổng đúng (BigInt phân số).
