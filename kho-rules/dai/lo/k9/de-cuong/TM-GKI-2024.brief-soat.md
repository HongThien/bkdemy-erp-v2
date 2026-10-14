# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG TÂY MỖ (TM-GKI-2024) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã thay tên mã / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề `TM-GKI-2024`; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TM-GKII`; số phần `<P>` = 1–9 (tệp `TM-GKI-2024.p<P>.soan.md`). Ảnh đề cương: `<LV>\trang\t-1.png … t-6.png` (6 trang scan 130 dpi; chỗ không chắc phóng to bằng `pdftoppm` như mô tả). Hình đề đã cắt ở `<LV>\img\de_P4B15…19.png`, `de_P6B4_1.png`, `de_P6B5.png`.
- Bản đồ tệp → trang ảnh: p1, p2 = Bài 1–4 (t-1) · p3 = Bài 5–6 (t-1) · p4 = Bài 7–14 (t-2) · p5 = Bài 15–19 (t-2, t-3, đầu t-4) · p6 = Bài 20–22 (t-4) · p7 = Bài 23–25 (t-4) · p8 = Bài 26–29 (t-5) · p9 = Đề minh hoạ (t-5, t-6).
- Đề cương đánh số: Bài 1–29 LIÊN TỤC qua 5 dạng (các "phần" trong tệp = các dạng); riêng "Đề minh hoạ" đánh số lại từ 1 (Bài 4.1 / 4.2 = hai bài con 1), 2) của Bài 4; "Bài 5" = "Bài V"). Nhãn trong `### …` giữ NGUYÊN như khung.
- Nguồn nhãn "PHẦN <n>": 1 = Dạng 1 (PT quy về bậc nhất) · 2 = Dạng 2 (hệ) · 3 = Dạng 3 (lập hệ) · 4 = Dạng 4 (hình học, kho=hgt) · 5 = Dạng 5 (khác, kho=dai) · 6 = Đề minh hoạ.
- Câu `kho=hgt` mà KHÔNG có `**Hình:**` (Bài 20, 21, 22, 23, 24, 25, 4.2) ⇒ vẽ hình giải bằng code, tên tệp `giai_P<phần>B<bài>.png` (vd `giai_P4B22.png`, `giai_P6B4_2.png`). Bài 21 (tính giá trị biểu thức) không cần hình. Bài 28 (hộp quà, kho=dai, đề nhắc hình nhưng không in) ⇒ vẽ hình giải hình hộp chữ nhật (khối 3D đơn giản) hoặc bỏ nếu lời giải rõ không cần — không bắt buộc.
- Đề nâng cao (Bài 26–29, và Bài 5 đề minh hoạ) là các bài cực trị / bất đẳng thức / bài toán thực tế dạng hàm bậc hai. **Cấm** công thức nghiệm / Δ / Viète vẫn giữ; GTLN–GTNN và bất đẳng thức giải bằng đưa về dạng tổng các bình phương, hằng đẳng thức, điều kiện của biến (như luật khối 9 §1 `dai/k9.md`; ví dụ Cô-si phải tự chứng minh từ $(a-b)^2\ge0$). Bài 29 (lợi nhuận) và Bài 5 (diện tích tối đa) là hàm bậc hai: dùng hoàn thành bình phương $-(x-a)^2+k\le k$. Bài 28: hai biến $x$ (cạnh đáy), $h$ (chiều cao), $x^2h=4$; diện tích mạ $x^2+4xh=x^2+\dfrac{16}{x}$ ⇒ cực trị cần $x=2$: chứng minh bằng đưa $x^2+\dfrac{16}{x}-12=\dfrac{(x-2)(x^2+2x-8)}{x}\cdot$… hay cách tương đương không dùng Cô-si/đạo hàm — nếu KHÔNG làm được trong phạm vi lớp 9 thì ghi `**Chưa chắc:**`.
- Bài 19 (hai góc hạ 30°, 60°, h = 100 m, 6 phút): đáp số là số phút từ vị trí thứ hai đến chân tháp. Bài 16: làm tròn đến độ. Bài 15, 17, 18: nêu `**Chưa chắc:**` nếu làm tròn đề không nêu.
- Bài 24c / Bài 25c có công thức cần chứng minh — kiểm bằng toạ độ số trước khi viết; nếu công thức ĐỀ in có vẻ không đúng (bản scan in sai) thì chứng minh bằng máy rồi ghi `**Chưa chắc:** … nếu sửa thành … thì …`. KHÔNG tự sửa đề.
- Mã chạy cổng: thay `NS-GKI-2026` bằng `TM-GKI-2024` và `--lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TM-GKII"`. Lưu ý: cổng báo "Phần n: không có câu nào" trên tệp CHƯA có lời giải là bình thường; trạm soạn phải chạy cho tới "✔ đạt cổng".
- Ghi chú đã có trong khung (vd Bài 1b vết mực, Bài 28 không có hình) giữ nguyên.

---

# Brief giao trạm SOÁT — ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (TM-GKI-2024) (13/10)

> `<P>` = số phần (1–9). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TM-GKI-2024`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Cùng khuôn `kho-rules/dai/lo/k8/de-cuong/brief-soat.md`, luật kiến thức khối 9.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT PHẦN của đề cương ôn tập giữa học kì I Toán 9 đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi phần của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k9\de-cuong\brief-soan.md` (mục 2 nguồn, mục 3.4 phạm vi kiến thức + điều cấm, mục 4 khuôn) và luật khối: `Repo\kho-rules\dai\k9.md` (§1, §1.5, §2, §3);
   phần có câu `kho=hgt` (P6, P7, P8, P9) đọc thêm `Repo\kho-rules\hgt\k9.md`.
2. Mở HẾT ảnh `<LV>\trang\t-1.png … t-6.png` bằng công cụ Read (bản scan — chỗ không chắc phóng to:
   `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"`, toạ độ ở 260 dpi = 2 × toạ độ trên `t-N.png`). **Chưa mở** tệp `TM-GKI-2024.p<P>.soan.md`.
3. Tự giải các câu của phần bạn. Danh sách nhãn câu + phần (A / B / C) của tệp: lấy bằng lệnh (chạy từ Repo)
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/de-cuong/TM-GKI-2024.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ')[0]:l).join('\n'))"`
   — chỉ lệnh này (nó in cả các dòng Ghi chú / Chưa chắc của NGƯỜI GÕ ĐỀ: chỗ đề cương in thiếu / in sai đã được nhập thế nào — bạn giải theo bản đã nhập đó), KHÔNG đọc nội dung bản soạn.
   Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc): hệ / phương trình thay nghiệm vào đề + quét lưới tìm nghiệm sót; bất phương trình thử hai phía biên; tham số quét lưới $m$;
   lời văn thay đáp số vào từng dữ kiện; lượng giác bằng `Math`; hình dựng toạ độ số; bất đẳng thức thử ≥ 2000 bộ số ngẫu nhiên. Không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k9\de-cuong\TM-GKI-2024.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Đọc khuôn tệp mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ lấy khuôn tệp).
6. Mở `Repo\kho-rules\dai\lo\k9\de-cuong\TM-GKI-2024.p<P>.soan.md`, soát TỪNG câu:
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
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `TM-GKI-2024.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `…p<P>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ thêm / giữ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/de-cuong/TM-GKI-2024.p<P>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TM-GKII" --khoi 9 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k9\de-cuong\TM-GKI-2024.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
