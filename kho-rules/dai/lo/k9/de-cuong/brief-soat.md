# Brief giao trạm SOÁT — ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (NS-GKI-2026) (13/10)

> `<P>` = số phần (1–9). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\NS-GKI-2026`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Cùng khuôn `kho-rules/dai/lo/k8/de-cuong/brief-soat.md`, luật kiến thức khối 9.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT PHẦN của đề cương ôn tập giữa học kì I Toán 9 đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi phần của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k9\de-cuong\brief-soan.md` (mục 2 nguồn, mục 3.4 phạm vi kiến thức + điều cấm, mục 4 khuôn) và luật khối: `Repo\kho-rules\dai\k9.md` (§1, §1.5, §2, §3);
   phần có câu `kho=hgt` (P6, P7, P8, P9) đọc thêm `Repo\kho-rules\hgt\k9.md`.
2. Mở HẾT ảnh `<LV>\trang\p-1.png … p-4.png` bằng công cụ Read (bản scan — chỗ không chắc phóng to:
   `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"`, toạ độ ở 260 dpi = 2 × toạ độ trên `p-N.png`). **Chưa mở** tệp `NS-GKI-2026.p<P>.soan.md`.
3. Tự giải các câu của phần bạn. Danh sách nhãn câu + phần (A / B / C) của tệp: lấy bằng lệnh (chạy từ Repo)
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/de-cuong/NS-GKI-2026.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ')[0]:l).join('\n'))"`
   — chỉ lệnh này (nó in cả các dòng Ghi chú / Chưa chắc của NGƯỜI GÕ ĐỀ: chỗ đề cương in thiếu / in sai đã được nhập thế nào — bạn giải theo bản đã nhập đó), KHÔNG đọc nội dung bản soạn.
   Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc): hệ / phương trình thay nghiệm vào đề + quét lưới tìm nghiệm sót; bất phương trình thử hai phía biên; tham số quét lưới $m$;
   lời văn thay đáp số vào từng dữ kiện; lượng giác bằng `Math`; hình dựng toạ độ số; bất đẳng thức thử ≥ 2000 bộ số ngẫu nhiên. Không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k9\de-cuong\NS-GKI-2026.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Đọc khuôn tệp mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ lấy khuôn tệp).
6. Mở `Repo\kho-rules\dai\lo\k9\de-cuong\NS-GKI-2026.p<P>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, dấu, tên điểm, đủ ý) — trừ các chỗ người gõ đã ghi rõ là xử lí đề in thiếu / in sai (giữ; nếu bạn thấy cách xử lí đó SAI thì nêu trong `Chưa chắc` + biên bản).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (brief soạn mục 3.4: KHÔNG $\Delta$ / công thức nghiệm / Viète, KHÔNG biến đổi căn thức chương III, KHÔNG Cô-si dùng thẳng, KHÔNG hệ thức đường cao /
     định lí sin, côsin dùng thẳng, KHÔNG `⇔`, KHÔNG "tập nghiệm $S$" — kể cả dùng NGẦM không gọi tên) · điều kiện xác định + đối chiếu điều kiện · đổi chiều bất phương trình khi nhân / chia số âm ·
     Phần 2 đúng khuôn vở lớp 9, mỗi phép biến đổi một dòng, kết luận bằng lời đủ mọi đại lượng đề hỏi · dấu nhân `\cdot` ·
     Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Bài tham số: xét điều kiện có nghiệm trước, đối chiếu sau. Bất đẳng thức: mỗi bước đúng với MỌI giá trị biến trong điều kiện (kiểm cả biên, số âm).
   - **Lượng giác / hình (`kho=hgt`)**: nêu tam giác vuông nào, vuông tại đâu; `\tan\cdot\cot=1`, `\sin^2+\cos^2=1`, tỉ số hai góc phụ nhau có ghi căn cứ như `hgt\k9.md`;
     làm tròn theo ĐỀ (đề không nêu ⇒ mặc định của `hgt\k9.md` + `Chưa chắc`); không tính tiếp từ số đã làm tròn; bài có tam giác không tách ý.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`) theo đúng dạng đề hỏi; còn lại `tu_luan` (`dap_an=—`). Không tách / gộp / đổi nhãn câu; `kho` giữ nguyên.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với dòng `**Hình:**` (hình của đề — đúng câu, không dính chữ câu khác) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện đề, đủ điểm của mọi ý, tên điểm đúng chỗ,
     chỉ ghi số đo đề cho, không ghi kết quả phải tìm, nhãn không đè / không cụt). Sai ⇒ sửa script `<LV>\tam\ve_p<P>.mjs` rồi vẽ lại (`node` từ thư mục Repo).
     Bài `kho=hgt` có tam giác / hình thang mà không có `**Hình:**` lẫn `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ: brief soạn mục 3.5).
   - **Ghi chú / Chưa chắc**: dòng của người gõ đề giữ. Dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề cương in sai mà trạm soạn bỏ sót ⇒ thêm
     `**Chưa chắc:**` nói rõ đề sai ở đâu và đúng phải là gì (chứng minh bằng máy khi có thể). Đừng ghi tràn lan.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `NS-GKI-2026.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `…p<P>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ thêm / giữ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/de-cuong/NS-GKI-2026.p<P>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/NS-GKI-2026" --khoi 9 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k9\de-cuong\NS-GKI-2026.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
