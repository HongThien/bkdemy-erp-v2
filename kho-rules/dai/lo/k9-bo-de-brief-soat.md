# ⚠️ BẢN ÁP DỤNG KHỐI 9 — BỘ ĐỀ GIỮA KÌ 1 TOÁN 9 (58 đề, 18/10/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG KHỐI 8 BÊN DƯỚI

Brief gốc viết cho bộ đề khối 8 (đã đổi tên khối / đường dẫn). Các điểm KHÁC khối 8 — phải theo đây:

- `<MA>` = `GKI-NN` (01–58; danh sách + tên trường + trang gốc: `Repo\kho-rules\dai\lo\k9\bo-de\ds-de.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K9\<MA>` (đã có `goc.pdf`, ảnh trang `trang\p-N.png` 150 dpi, thư mục `img\`, `tam\`; KHÔNG có `de.json` gõ sẵn — bạn tự gõ lại đề từ ảnh trang).
  Tệp soạn: `Repo\kho-rules\dai\lo\k9\bo-de\<MA>.soan.md`. Mẫu khuôn TỆP: `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ lấy khuôn tệp; kiến thức và cách trình bày theo khối 9).
- Đề là ảnh SCAN (không có lớp chữ). Chữ nhỏ / số mũ / dấu ⇒ phóng to 300 dpi từ `<LV>\goc.pdf` trước khi gõ, không đoán. Đề có thể 2 trang (`p-2.png`). Đề bị cụt / có câu không đọc nổi ⇒ ghi `**Chưa chắc:**` hoặc mục GHI CHÚ, đừng bịa.
- Tên đề (dòng `# ĐỀ |`): "Đề kiểm tra giữa học kì 1 Toán 9 năm <năm học> — <trường (phường/quận)> (<ghi chú: mã đề / Đề 2…>)" lấy từ `ds-de.json` + đối chiếu tiêu đề ảnh. Dòng `nam:` = năm đầu của năm học (2024 hoặc 2025); `bo_sach: KNTT` (đề rõ bộ khác thì ghi đúng).
- **Phân kho:** `kho=hinh_hoc` cho MỌI câu hình học (chứng minh hình, tính độ dài / góc / diện tích trên hình, **hệ thức lượng & tỉ số lượng giác trong tam giác vuông, kể cả bài thực tế tháp / hải đăng / cột cờ / tàu ngầm / thang**, đường tròn). Máy tự đưa các câu này vào dạng "Ôn thi giữa kì I" của phần Hình học lớp 9 (Thùy 18/10) — KHÔNG dùng `kho=hgt`. `kho=dai` cho phần còn lại (phương trình, hệ, bất phương trình, căn thức, bài lập phương trình / hệ, thống kê – xác suất nếu có, và **bài cực trị / tối ưu thực tế dù bối cảnh là hình hộp, máng nước, hàng rào…** nếu lời giải thuần đại số).
- **Tách ý** (theo `kho-rules/dai/k9.md` §10 / đề cương NS): bài giải nhiều phương trình / hệ / bất phương trình ĐỘC LẬP (a, b, c…) ⇒ tách ý (nhãn `Bài 1a`…); bài lời văn, bài hình, bài cực trị, bài cho chung dữ kiện ⇒ giữ MỘT câu. Bài hình ghi `a)` `b)` `c)` trong Phần 2. "Bài" gom hai bài toán khác nhau hẳn ("1)" "2)" mỗi cái dữ kiện riêng) ⇒ `Bài 4.1`, `Bài 4.2`, `kho` theo từng bài.
- **Đề có phần trắc nghiệm:** làm như khối 8 (TN đủ 4 phương án, dòng cuối lời giải `Chọn X.`).
- **Dấu nhân `\cdot`** (cổng `--khoi 9` chặn `\times` và dấu chấm làm dấu nhân).
- **⭐ KIẾN THỨC khối 9 giữa học kì 1 (thay hoàn toàn mục Kiến thức khối 8):**
  1. Đọc `Repo\kho-rules\dai\k9.md` (§1 luật kiến thức theo thứ tự bài, §1.5, §2, §3, §10) và `Repo\kho-rules\hgt\k9.md` (luật bài hình / lượng giác: được dùng — cấm — làm tròn mặc định — khuôn hình) trước khi giải.
  2. Whitelist = những gì **chính đề đó** kiểm tra tới theo bộ sách (KNTT lớp 9 HK1: Chương I phương trình & hệ phương trình bậc nhất hai ẩn, phương trình quy về bậc nhất (tích, chứa ẩn ở mẫu) · Chương II bất đẳng thức, bất phương trình bậc nhất một ẩn · Chương III căn bậc hai & căn thức (chỉ nếu đề chạm tới) · Chương IV tỉ số lượng giác, hệ thức giữa cạnh và góc; lớp 6–8 là nền: hằng đẳng thức, phân tích nhân tử, tam giác đồng dạng, Pythagore, tính chất đường phân giác, hình chữ nhật…). Nhiều đề có thêm tính chất đường tròn mức nhẹ (tâm đường tròn ngoại tiếp tam giác vuông là trung điểm cạnh huyền, bốn điểm cùng thuộc một đường tròn) — chỉ dùng khi chính đề hỏi tới.
  3. **CẤM:** công thức nghiệm / $\Delta$ / định lí Viète (bậc hai ⇒ phân tích nhân tử; nghiệm vô tỉ ⇒ hoàn thành bình phương) · biến đổi căn thức của Chương III khi đề không chạm tới · bất đẳng thức Cô-si dùng thẳng (tự chứng minh từ $(a-b)^2\ge 0$ hoặc hoàn thành bình phương; không làm được ⇒ `**Chưa chắc:**`) · hệ thức đường cao $h^2=b'c'$, $b^2=ab'$, $\dfrac{1}{h^2}=\dfrac{1}{b^2}+\dfrac{1}{c^2}$ dùng thẳng (dùng đồng dạng hoặc tỉ số lượng giác thay) · định lí sin / côsin · đạo hàm · dấu `⇔` · "tập nghiệm $S=\{…\}$" (kết luận bằng LỜI). Dùng ngầm cũng là vi phạm.
  4. Cần một kết quả chưa học ⇒ tự chứng minh bằng cái đã học; không làm được ⇒ `**Chưa chắc:**`. Làm tròn: theo đúng yêu cầu của đề; đề không nêu ⇒ mặc định của `hgt/k9.md` + `**Chưa chắc:**`; không tính tiếp từ số đã làm tròn.
- **Mã chạy cổng:** `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/bo-de/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9/<MA>" --khoi 9 --chi-kiem`.
- Hình trong đề: máy chưa cắt sẵn — bạn tự cắt từ `<LV>\goc.pdf` bằng `pdftoppm -r 150 -x -y -W -H` vào `<LV>\img\` (đặt tên `p1c4.png`…), mở ảnh kiểm tra rồi khai `**Hình:**`. Đề có IN SẴN đáp án (hiếm): vẫn giải độc lập trước.

---

# Brief giao trạm SOÁT — khối 9, bộ đề giữa kì 1 (40 đề, 10/10)

> Khuôn chép từ `k6-brief-soat.md`. `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K9\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa học kì 1 Toán 9 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k9.md` (§1 luật kiến thức, §1.5–§1.6, §3, §10).
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. Đề scan chữ nhỏ ⇒ cắt phóng to 300 dpi từ `<LV>\goc.pdf`
   (`pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/tam/<tên>"`) trước khi giải.
3. Tự giải mọi câu của đề. Đa thức / hằng đẳng thức / tìm $x$ tính bằng script node (thay số kiểm hai vế), không nhẩm.
   Đề có IN SẴN bảng đáp án / hướng dẫn chấm ⇒ vẫn tự giải mù trước, SAU ĐÓ mới đọc bảng in và ghi thêm cột "đáp án in trong đề"; Pha 2 đối chiếu cả ba nguồn.
4. Ghi `Repo\kho-rules\dai\lo\k9\bo-de\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc đề mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\k9-bo-de-brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\k9\bo-de\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu, ngoặc, tên điểm, phương án, đủ ý, không sót câu); câu nào bị bỏ thì có lí do chưa.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (chỉ dùng cái học tới giữa kì 1 theo bộ sách của chính đề; KHÔNG đường trung bình, Thalès,
     đồng dạng, lượng giác; Pythagore / hằng đẳng thức / phân tích nhân tử / hình chữ nhật trở lên chỉ khi đề có chạm tới — kể cả dùng **ngầm** không gọi tên;
     "tứ giác có ba góc vuông" không phải dấu hiệu; **đặt thừa số chung theo tính chất phân phối $ab+ac=a(b+c)$ là kiến thức lớp 6–7, KHÔNG phải vi phạm** —
     đừng sửa những chỗ đó; cái cấm là các phương pháp phân tích nhân tử của Chương II: dùng hằng đẳng thức, nhóm, tách hạng tử) · Phần 2 đúng khuôn vở lớp 9, mỗi khẳng định hình có lí do · dấu nhân `\cdot` · Phần 1 có 3–6 bước là
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
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/bo-de/<MA>.soan.md --lam-viec "<LV>" --khoi 9 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k9\bo-de\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 120 từ): kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
