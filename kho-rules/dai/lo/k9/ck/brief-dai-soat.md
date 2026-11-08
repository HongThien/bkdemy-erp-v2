# Brief giao trạm SOÁT — ĐỀ CƯƠNG CUỐI KÌ I Toán 9 (kho tham khảo) · LƯỢT ĐẠI SỐ (03/11/2026)

> `<MA>` = mã đề cương (danh sách: `Repo\kho-rules\dai\lo\k9\ck\ds.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\CK\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Brief trạm soạn: `Repo\kho-rules\dai\lo\k9\ck\brief-dai-soan.md`.
> **KHÔNG xoá bất cứ thứ gì** (kể cả tệp nháp của chính bạn). Sửa thì sửa tại chỗ.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho phần ĐẠI SỐ của MỘT đề cương cuối học kì I Toán 9 đã được trạm khác soạn (tệp `Repo\kho-rules\dai\lo\k9\ck\<MA>.dai.soan.md`).
Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi của `<MA>`.

## Pha 0 — kiểm sót bài (làm TRƯỚC khi mở bản soạn)

Mở HẾT ảnh `<LV>\trang\p-*.png` bằng công cụ Read (chỗ không chắc phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"`, toạ độ 260 dpi = 2 × toạ độ ảnh 130 dpi).
Tự lập danh sách MỌI bài / ý KHÔNG-hình trong đề cương (định nghĩa: brief soạn mục 1). Danh sách bài hình đã thuộc lượt Hình: `<MA>.hinh.soan.md` (chỉ liệt kê `###`; bài nào ở đó thì KHÔNG tính vào lượt Đại).
Rồi so với danh sách `### ` của `<MA>.dai.soan.md` (lệnh liệt kê nhãn: `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/ck/<MA>.dai.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ')[0]:l).join('\n'))"` — chỉ lệnh này, chưa đọc nội dung).
**Sót bài** ⇒ ghi vào biên bản; sót ít (1–5 bài / ý) ⇒ bạn tự soạn bổ sung đúng khuôn (giải 2 phần, thử máy); sót nhiều ⇒ `KẾT LUẬN: CHƯA ĐẠT — sót <n> bài`.
**Bài hình nhập nhầm** vào tệp Đại, hoặc bài đã có trong tệp Hình ⇒ báo trong biên bản, KHÔNG xoá (người ghép quyết).

## Pha 1 — giải MÙ (chưa được mở nội dung bản soạn)

1. Đọc luật: `Repo\kho-rules\dai\k9.md` (§1, §1.5, §2, §3, §10), brief soạn (mục 4 khuôn, mục 5 kiến thức + điều CẤM, mục 6 xử lí đề) và `Repo\kho-rules\dai\lo\k9-bo-de-brief-soan.md` mục 3–4.
2. Tự giải từng bài trong danh sách Pha 0 (chỉ theo ảnh đề). Tính bằng script node trong `<LV>\tam\` (Write tool; KHÔNG heredoc): thay nghiệm ngược vào đề; rút gọn thử ≥ 3 bộ số; bất phương trình thử hai phía mốc; bài lập hệ thay đáp số vào từng dữ kiện; cực trị quét số. Không nhẩm.
3. Ghi `Repo\kho-rules\dai\lo\k9\ck\<MA>.dai.kiem.md`: bảng `| Nhãn | Đáp án / đáp số (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

4. Mở `<MA>.dai.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, căn, ngoặc, dấu, đủ ý, đủ 4 phương án trắc nghiệm).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (brief soạn mục 5: KHÔNG $\Delta$ / Viète / Cô-si thẳng / `⇔` / "tập nghiệm $S$" / kí hiệu khoảng; mỗi phép biến đổi một dòng) · đối chiếu điều kiện xác định / loại nghiệm · kết luận bằng lời đủ mọi đại lượng đề hỏi · dấu nhân `\cdot` (cấm `\times`) · trắc nghiệm dòng cuối `Chọn X.` khớp `dap_an`.
     Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa "Đọc kĩ đề", **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
   - **Đề sai / thiếu**: theo brief soạn mục 6 — giải bình thường + `Ghi chú` + "Lưu ý:" đầu Phần 2; không treo `Chưa chắc` khi giải được.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số nguyên hoặc thập phân ≤ 4 kí tự (chữ số, `-`, `,`) theo đúng dạng đề hỏi; đáp số là biểu thức / phân số / nhiều giá trị / có đơn vị phải đổi ⇒ `tu_luan` (`dap_an=—` hoặc tóm tắt theo khuôn). `kho=dai` mọi câu. Đúng/Sai nhiều mệnh đề ⇒ `tu_luan` + Ghi chú. Tách ý đúng luật (bài giải nhiều pt / hệ / bpt độc lập ⇒ tách; bài lời văn, cực trị, chung dữ kiện ⇒ giữ một câu).
   - **Sót / trùng với lượt Hình**: câu nằm trong `<MA>.hinh.soan.md` ⇒ báo.
   - **Hình** (nếu có `**Hình:**`): mở tệp `<LV>\img\dai_*.png` kiểm đúng lời văn, đủ số liệu, không lộ đáp số.
   - **Ghi chú / Chưa chắc**: `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề in sai mà trạm soạn bỏ sót ⇒ thêm `**Ghi chú:**`. Đừng ghi tràn lan.
5. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.dai.soan.goc.md` (đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.dai.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
6. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/ck/<MA>.dai.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/CK/<MA>" --khoi 9 --chi-kiem`
7. Ghi biên bản `Repo\kho-rules\dai\lo\k9\ck\<MA>.dai.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa · bài sót / bài nhập nhầm / bài trùng lượt Hình;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình / sót bài) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · bài trùng lượt Hình (nếu có) · các câu `Chưa chắc`.
