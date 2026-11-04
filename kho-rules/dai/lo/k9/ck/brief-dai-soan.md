# Brief giao trạm SOẠN — ĐỀ CƯƠNG CUỐI KÌ I Toán 9 (kho tham khảo) · LƯỢT ĐẠI SỐ (03/11/2026)

> Thùy 03/11: *"Các bài trong đề cương thì sao"* (sau khi lượt HÌNH xong). Lượt này = MỌI bài KHÔNG phải hình của cùng 27 đề cương.
> `<MA>` = mã đề cương (vd `CK-2526-thanh-cong`; danh sách: `Repo\kho-rules\dai\lo\k9\ck\ds.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\CK\<MA>`
> (đã có `goc.pdf`, `trang\p-N.png` 130 dpi — một số đề là ảnh SCAN không có lớp chữ —, `img\` (đã có hình của lượt Hình, tên `de_*`/`giai_*` — KHÔNG đụng), `tam\`, `z\`, `thongtin.json` chứa tên trường / năm học).
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-dai-soat.md`) chạy Opus.
> **KHÔNG xoá bất cứ thứ gì** (kể cả tệp nháp của chính bạn) — Luật xoá của dự án. Muốn bỏ thì để đó.

---

Bạn là trạm SOẠN cho MỘT đề cương cuối học kì I Toán 9. Việc: **tìm MỌI bài ĐẠI SỐ / không-hình** trong đề cương, gõ lại đề cho đúng ảnh, **giải chi tiết (2 phần)**, gán loại câu.
KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài các tệp nêu dưới. (Được ghi ảnh vào `<LV>\img\` với tên bắt đầu `dai_`, script vào `<LV>\tam\`.)

## 1. Bài nào là của lượt này

- **LÀ của lượt này (`kho=dai`):** phương trình, hệ phương trình, bất phương trình, phương trình quy về bậc nhất, phân tích nhân tử, căn bậc hai / bậc ba, rút gọn biểu thức chứa căn, giải phương trình chứa căn, bất đẳng thức, cực trị / GTLN–GTNN, bài toán thực tế lập phương trình / hệ, bài toán thực tế tính toán (lãi suất, phần trăm, chuyển động, năng suất…), câu trắc nghiệm đại số, thống kê – xác suất nếu có.
- **KHÔNG phải của lượt này — BỎ QUA hoàn toàn:** mọi bài / ý hình học (chứng minh hình, đường tròn, tiếp tuyến, tam giác, hệ thức lượng, tỉ số lượng giác kể cả bài thực tế tháp / thang / bóng nắng, hình tròn / quạt / vành khuyên, thể tích – diện tích hình khối) và bài "tính giá trị biểu thức lượng giác" thuần số. Lượt Hình đã làm những bài này.
- **Cách tránh làm trùng (bắt buộc):** TRƯỚC khi gõ, chạy lệnh liệt kê các bài lượt Hình đã lấy:
  `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/ck/<MA>.hinh.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')).join('\n'))"`
  rồi mở `<MA>.hinh.soan.md` xem nội dung các bài đó. Bài nào đã nằm trong tệp Hình (kể cả bài cực trị có hình như hộp / máng nước / vườn — lượt Hình đã lấy) ⇒ **KHÔNG làm lại**. Bài mà Hình chưa lấy ⇒ của bạn.
- Bài LAI (cùng một số bài có ý a) đại số, ý b) hình): ghi vào mục `## GHI CHÚ CHO NGƯỜI DUYỆT` (nhãn + nằm ở đâu), không tách; để người ghép quyết. Nếu lượt Hình đã lấy nguyên bài thì bạn bỏ.
- Không có bài đại số nào ⇒ không tạo tệp, trả lời cuối "không có bài đại số".

## 2. Đọc trước (bắt buộc)

1. `Repo\kho-rules\dai\k9.md` — **§1 luật kiến thức theo thứ tự bài**, §1.5 khuôn 2 phần, §2, §3 định dạng, §10; mục "BẢN ÁP DỤNG BỘ ĐỀ CUỐI HỌC KÌ 1" ở đầu `Repo\kho-rules\dai\lo\k9-cki-brief-soan.md` (phạm vi kiến thức cuối kì I — theo đó).
2. `Repo\kho-rules\dai\lo\k9-bo-de-brief-soan.md` **mục 3 điều 3–6 (phân kho, tách ý, loại câu, giải + thử máy) và mục 4 (khuôn tệp, khuôn lời giải Phần 1 / Phần 2, định dạng)** — áp dụng nguyên văn cho lượt này, trừ các chỗ nói riêng của bộ đề (tên tệp, `<LV>`).
3. Mẫu khuôn tệp đề cương đã qua soát: `Repo\kho-rules\dai\lo\k9\de-cuong\NT-GKI-2026.p1.soan.md` (hoặc một tệp `.pN.soan.md` bất kì cùng thư mục) — chỉ lấy khuôn tệp / nhịp Phần 1 / cách viết Phần 2 Đại.
4. `Repo\kho-rules\dai\lo\k9\ck\brief-hinh-soan.md` mục 3 (nguồn đề), mục 7 (xử lí đề sai / làm tròn), mục 8 (thử bằng máy), mục 9 (định dạng + cổng).

## 3. Nguồn đề

- `<LV>\trang\p-1.png…` — ảnh từng trang, NGUỒN CHÍNH. Mở HẾT bằng công cụ Read. Chữ nhỏ / số mũ / căn / dấu âm / chỉ số không chắc ⇒ phóng to, **đừng đoán**:
  `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ 260 dpi = 2 × toạ độ ảnh 130 dpi). Dùng thư mục `z\` cho ảnh phóng to.
- Có lớp chữ (`pdftotext`) thì chỉ để đỡ gõ — công thức hay mất căn / phân số / mũ / hệ ⇒ **ảnh đúng**.
- Đề cương có thể kèm đáp án in sẵn: vẫn giải độc lập trước rồi mới đối chiếu; lệch ⇒ tính lại bằng máy, in sai thì giữ đáp án đúng + `**Ghi chú:**`.

## 4. Tệp phải nộp

`Repo\kho-rules\dai\lo\k9\ck\<MA>.dai.soan.md`:

```
# ĐỀ | Đề cương ôn tập cuối học kì I Toán 9 — <tên trường trong thongtin.json> (Hà Nội) · phần Đại số
nam: <năm đầu của năm học, vd 2025>
bo_sach: KNTT
kieu: de_cuong

## PHẦN 1 | <tên phần theo đề cương> | <trac_nghiem|tu_luan|tra_loi_ngan>

### Bài 3 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** …nguyên văn…
…(các dòng **Hình:** / **Ghi chú:** / **Chưa chắc:** nếu có)

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …

**Phần 2. Trình bày**

…
```

- Mỗi phần / mỗi đề trong đề cương ⇒ mỗi `## PHẦN n` (đánh số từ 1, liên tục). Phần của đề cương trộn trắc nghiệm với tự luận ⇒ tách thành các `## PHẦN` riêng, mỗi phần MỘT loại, tên phần giữ tên gốc + "(trắc nghiệm)" / "(tự luận)".
- Nhãn `### Bài k` / `### Câu k` đúng như in, **duy nhất trong một phần** (trùng ⇒ đánh lại `Bài 5.1`, `Bài 5.2` + `Ghi chú`).
- Tách ý, loại câu (`trac_nghiem` / `tra_loi_ngan` / `tu_luan`), Đúng/Sai ⇒ tự luận, khuôn Phần 1 CARD, Phần 2, dấu nhân `\cdot`, `\dfrac`, thập phân dấu phẩy: **theo `k9-bo-de-brief-soan.md` mục 3–4**.
- Hình đi kèm lời văn Đại (vd sân vườn chữ L, khung dây): chỉ khi bài KHÔNG hiểu được nếu thiếu hình ⇒ vẽ lại bằng code (thư viện `Repo\scripts\anh\ve_hinh_lib.mjs`, mẫu `Repo\scripts\anh\ve_hinh_hh101_102.mjs`, script `<LV>\tam\ve_dai.mjs`, tên tệp `dai_P<phần>B<nhãn>.png`), thêm dòng `**Hình:** <tên>`; hình chỉ trang trí ⇒ bỏ. Không cắt ảnh từ PDF.

## 5. Kiến thức — cuối học kì I khối 9

Theo mục "BẢN ÁP DỤNG BỘ ĐỀ CUỐI HỌC KÌ 1" của `k9-cki-brief-soan.md`: Chương I–III đầy đủ (hệ, quy về bậc nhất, bất đẳng thức, bất phương trình, **căn thức dùng đầy đủ**), lập phương trình / hệ; lớp 6–8 là nền.
**CẤM:** công thức nghiệm / $\Delta$ / định lí Viète (bậc hai ⇒ phân tích nhân tử; nghiệm vô tỉ ⇒ hoàn thành bình phương) · bất đẳng thức Cô-si, Bunhiacopxki dùng thẳng (tự chứng minh từ $(a-b)^2\ge 0$) · dấu `⇔` (mỗi phép biến đổi một dòng, nối "Ta có", "Suy ra", "Do đó"; `⇒` được) · "tập nghiệm $S=\{…\}$" (kết luận bằng lời: "Vậy phương trình có nghiệm $x=…$", "Vậy nghiệm của bất phương trình là $x>…$") · đạo hàm · kí hiệu khoảng · định thức.
Nội dung học kì II lọt vào đề cương (hàm số $y=ax^2$, phương trình bậc hai tổng quát, Viète, tần số, xác suất…): **vẫn nhập** nhưng giải bằng cách ĐÚNG và NGẮN NHẤT trong phạm vi kiến thức trên; không giải được thì dùng cách ngoài phạm vi + `**Ghi chú:** dùng <công cụ> (kiến thức học kì II)`. Không treo `Chưa chắc` chỉ vì thế.
Đề khó (nâng cao, cực trị, bất đẳng thức): được dùng mọi kiến thức Chương I–V ở trên; không làm được trong phạm vi ⇒ giải bằng cách đúng nhất có thể + `**Chưa chắc:**`.

## 6. Xử lí đề (Thùy 24/10 — nhắc lại)

- **Đề SAI nhưng giải được** (vô nghiệm ngoài ý, số liệu vô lí, thiếu điều kiện): GIẢI BÌNH THƯỜNG theo số liệu, ghi rõ "đề sai" ở `**Ghi chú:**` và một dòng "Lưu ý: …" đầu Phần 2. Lỗi in hiển nhiên có đáp án rõ ⇒ sửa chữ đề + Ghi chú. **Không treo `**Chưa chắc:**`** — chỉ khi THỰC SỰ không giải được hoặc hai cách hiểu cho hai đáp số khác nhau.
- Trắc nghiệm không phương án nào đúng / nhiều phương án đúng: chọn phương án hợp lí nhất + `**Ghi chú:**` nói rõ (và `Chưa chắc` nếu hai phương án ngang nhau).
- Làm tròn: theo đề; đề không nêu ⇒ không làm tròn nếu đáp số đúng chính xác; cần làm tròn thì 1 chữ số thập phân + Ghi chú, KHÔNG `Chưa chắc` chỉ vì thế.
- Ý đề in thiếu hẳn một vế / không đọc nổi ⇒ KHÔNG nhập ý đó, ghi vào `## GHI CHÚ CHO NGƯỜI DUYỆT` (nhãn + lí do).
- Bài in lặp giữa hai phần ⇒ vẫn nhập mỗi chỗ (máy tự gom trùng khi ghi).

## 7. Mọi đáp số phải thử bằng máy

Script node trong `<LV>\tam\` (công cụ Write; KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): phương trình / hệ ⇒ thay nghiệm ngược vào đề; rút gọn / phân tích / đẳng thức ⇒ thay ≥ 3 bộ số ngẫu nhiên hợp điều kiện vào hai vế; bất phương trình ⇒ thử các giá trị ở hai phía mốc; bài lập phương trình ⇒ thay đáp số vào từng dữ kiện của đề; cực trị ⇒ quét số tìm min / max rồi so với đáp số. Đừng nhẩm.

## 8. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/ck/<MA>.dai.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/CK/<MA>" --khoi 9 --chi-kiem
```

Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: bài đã bỏ (vì sao), bài lai Hình–Đại, ý đề in thiếu, nhận xét chung. Không có gì ⇒ "Không".

## 9. Trả lời cuối (≤ 150 từ)

Số bài / câu tìm được theo loại (trắc nghiệm / trả lời ngắn / tự luận) · bài đã bỏ vì lượt Hình lấy rồi (nhãn) · câu có `Chưa chắc` (nhãn + một dòng lí do) · đề sai (nếu có) · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.
